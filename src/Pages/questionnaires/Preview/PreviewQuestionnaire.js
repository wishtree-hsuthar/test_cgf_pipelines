import React, { useEffect, useRef, useState } from "react";

import { Tabs, Tab, Tooltip, Box } from "@mui/material";

import PreviewSection from "./PreviewSection";
import { Link, useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../../api/axios";
import "../../../Pages/PreviewDemo.css";
import {
  ADD_QUESTIONNAIRE,
  DELETE_QUESTIONNAIRE_DRAFT,
  DOWNLOAD_QUESTIONNAIRES_BY_ID,
} from "../../../api/Url";
import { useDocumentTitle } from "../../../utils/useDocumentTitle";
import { useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useCallbackState from "../../../utils/useCallBackState";
import Toaster from "../../../components/Toaster";
import { TabPanel } from "../../../utils/tabUtils/TabPanel";
import DialogBox from "../../../components/DialogBox";
import axios from "axios";
import { downloadFunction } from "../../../utils/downloadFunction";
import Loader from "../../../utils/Loader";
import { Logger } from "../../../Logger/Logger";
const ITEM_HEIGHT = 42;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4,
    },
  },
};
// };
// function TabPanel(props) {
//     const { children, value, index, ...other } = props;

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const data = [
  { id: 0, label: "Country" },
  { id: 1, label: "City" },
];

const dropdownData = [
  { id: 0, label: "Textbox" },
  { id: 1, label: "Calendar" },
  { id: 2, label: "Radiobutton" },
  { id: 3, label: "Dropdown" },
];

function PreviewQuestionnaire(props) {
  const [value, setValue] = useState(0);
  //custom hook to set title of page
  useDocumentTitle("Preview Questionnaire");
  const [isPreviewQuestionnaireLoading, setIsPreviewQuestionnaireLoading] =
    useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  const questionnairePreviewRef = useRef();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const params = useParams();
  const navigate = useNavigate();
  Logger.debug("params in questionnaire", params["*"].includes("version"));
  Logger.debug("props in questionnaire", props);
  const [questionnaire, setQuestionnaire] = useState({});

  const privilege = useSelector((state) => state?.user?.privilege);
  const userAuth = useSelector((state) => state?.user?.userObj);
  const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
  let privilegeArray =
    userAuth?.roleId?.name === "Super Admin"
      ? []
      : Object.values(privilege?.privileges);
  let moduleAccesForMember = privilegeArray
    .filter((module) => module?.moduleId?.name === "Questionnaire")
    .map((privilege) => ({
      questionnaire: {
        list: privilege?.list,
        view: privilege?.view,
        edit: privilege?.edit,
        delete: privilege?.delete,
        add: privilege?.add,
      },
    }));
  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();
    const fetch = async () => {
      try {
        setIsPreviewQuestionnaireLoading(true);
        const response = await privateAxios.get(
          `${ADD_QUESTIONNAIRE}/${params.id}`,
          {
            signal: controller.signal,
          }
        );
        Logger.debug("response from fetch questionnaire", response);
        isMounted && setQuestionnaire({ ...response.data });
        setIsPreviewQuestionnaireLoading(false);
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        setIsPreviewQuestionnaireLoading(false);
        handleError(error);
        // if (error?.response?.status == 401) {
        //     setToasterDetails(
        //         {
        //             titleMessage: "Error",
        //             descriptionMessage:
        //                 "Session Timeout: Please login again",
        //             messageType: "error",
        //         },
        //         () => questionnairePreviewRef.current()
        //     );
        //     setTimeout(() => {
        //         navigate("/login");
        //     }, 3000);
        // } else if (error?.response?.status === 403) {
        //     setToasterDetails(
        //         {
        //             titleMessage: "Error",
        //             descriptionMessage: error?.response?.data?.message
        //                 ? error?.response?.data?.message
        //                 : "Something went wrong",
        //             messageType: "error",
        //         },
        //         () => questionnairePreviewRef.current()
        //     );
        //     setTimeout(() => {
        //         navigate("/home");
        //     }, 3000);
        // } else {
        //     setToasterDetails(
        //         {
        //             titleMessage: "Error",
        //             descriptionMessage: error?.response?.data?.message
        //                 ? error?.response?.data?.message
        //                 : "Something went wrong",
        //             messageType: "error",
        //         },
        //         () => questionnairePreviewRef.current()
        //     );
        // }
        Logger.debug("error from fetch questionnaire", error);
      }
    };
    // moduleAccesForMember[0].questionnaire.edit &&
    //   params.includes("edit") &&
    fetch();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const [isActive, setActive] = useState(false);
  const handleToggle = () => {
    setActive(!isActive);
  };
  Logger.debug(
    "edit access = ",
    moduleAccesForMember[0]?.questionnaire?.edit && params["*"].includes("edit")
  );
  // download assessment
  // const downloadAssessment = async () => {
  //     try {
  //         const response = await privateAxios.get(
  //             DOWNLOAD_QUESTIONNAIRES_BY_ID + params.id + "/download",
  //             {
  //                 responseType: "blob",
  //             }
  //         );
  //         Logger.debug("resposne from download  questionnaire ", response);
  //         const url = window.URL.createObjectURL(new Blob([response.data]));
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute("download", `Questionnaire - ${new Date()}.xls`);
  //         document.body.appendChild(link);
  //         link.click();
  //         if (response.status == 200) {
  //             setToasterDetails(
  //                 {
  //                     titleMessage: "Success!",
  //                     descriptionMessage: "Download successfull!",

  //                     messageType: "success",
  //                 },
  //                 () => myRef.current()
  //             );
  //         }
  //     } catch (error) {
  //         Logger.debug("Error from download  questionnaire", error);
  //     }
  // };
  const handleError = (error) => {
    if (error?.code === "ERR_CANCELED") return;
    if (error?.response?.status == 401) {
      setToasterDetails(
        {
          titleMessage: "Error",
          descriptionMessage: "Session Timeout: Please login again",
          messageType: "error",
        },
        () => questionnairePreviewRef.current()
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else if (error?.response?.status === 403) {
      setToasterDetails(
        {
          titleMessage: "Error",
          descriptionMessage: error?.response?.data?.message
            ? error?.response?.data?.message
            : "Something went wrong",
          messageType: "error",
        },
        () => questionnairePreviewRef.current()
      );
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } else if (
      error?.response?.status === 400 &&
      error.response.data.message === "Invalid questionnaire!"
    ) {
      setToasterDetails(
        {
          titleMessage: "Error",
          descriptionMessage: error?.response?.data?.message
            ? error?.response?.data?.message
            : "Something went wrong",
          messageType: "error",
        },
        () => questionnairePreviewRef.current()
      );
      setTimeout(() => {
        navigate("/questionnaires");
      }, 3000);
    } else {
      setToasterDetails(
        {
          titleMessage: "Error",
          descriptionMessage:
            error?.response?.data?.message &&
            typeof error.response.data.message === "string"
              ? error.response.data.message
              : "Something went wrong.",
          messageType: "error",
        },
        () => questionnairePreviewRef.current()
      );
    }
  };
  const deleteQuestionnaire = async (deletionType) => {
    try {
      Logger.debug("Questionnaire", questionnaire);
      await axios.delete(ADD_QUESTIONNAIRE + `/${questionnaire?.uuid}`, {
        data: {
          deletionType: deletionType,
        },
      });
      setToasterDetails(
        {
          titleMessage: "Success",
          descriptionMessage: `${
            deletionType === "inactive"
              ? "Questionnaire inactivated successfully!"
              : "Questionnaire deleted successfully!"
          }`,
          messageType: "success",
        },
        () => questionnairePreviewRef.current()
      );
      return setTimeout(() => navigate("/questionnaires"), 3000);
    } catch (error) {
      handleError(error);
    } finally {
      setOpenDialog(false);
    }
  };
  const deleteDraft = async () => {
    try {
      const response = await axios.delete(
        DELETE_QUESTIONNAIRE_DRAFT + `/${questionnaire?.uuid}`
      );
      setToasterDetails(
        {
          titleMessage: "Success",
          descriptionMessage: response.data.message,
          messageType: "success",
        },
        () => questionnairePreviewRef.current()
      );
      return setTimeout(() => navigate("/questionnaires"), 3000);
    } catch (error) {
      handleError(error);
    } finally {
      setOpenDialog(false);
    }
  };
  const onDialogPrimaryButtonClickHandler = async () => {
    questionnaire && questionnaire?.isPublished
      ? deleteQuestionnaire("delete")
      : deleteDraft();
  };
  const onDialogSecondaryButtonClickHandler = () => {
    questionnaire && questionnaire?.isPublished
      ? deleteQuestionnaire("inactive")
      : setOpenDialog(false);
  };

  return (
    <div className="page-wrapper" onClick={() => isActive && setActive(false)}>
      <DialogBox
        title={
          <p>
            {" "}
            Delete Questionnaire{" "}
            {questionnaire && !questionnaire?.isPublished && "Draft"}
          </p>
        }
        info1={
          <p>
            {questionnaire && questionnaire?.isPublished
              ? "Deleting the questionnaire will also delete the related assessments. we recommend you make the questionnaire inactive"
              : "You can not access this draft version of questionnaire any more once delete."}
          </p>
        }
        info2={
          <p>
            Are you sure you want to delete the questionnaire{" "}
            {questionnaire && !questionnaire?.isPublished && "draft"}?
          </p>
        }
        primaryButtonText={
          questionnaire && questionnaire?.isPublished
            ? "Delete Anyway"
            : "Delete"
        }
        secondaryButtonText={
          questionnaire && questionnaire?.isPublished ? "Inactive" : "Cancel"
        }
        onPrimaryModalButtonClickHandler={onDialogPrimaryButtonClickHandler}
        onSecondaryModalButtonClickHandler={onDialogSecondaryButtonClickHandler}
        openModal={openDialog}
        setOpenModal={setOpenDialog}
      />
      <Toaster
        myRef={questionnairePreviewRef}
        titleMessage={toasterDetails.titleMessage}
        descriptionMessage={toasterDetails.descriptionMessage}
        messageType={toasterDetails.messageType}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link
                // onClick={() => navigate(`/questionnaires`)}
                to="/questionnaires"
                style={{ cursor: "pointer" }}
              >
                Questionnaire
              </Link>
            </li>

            {params["*"].includes("version") && (
              <li>
                <Link
                  to={`/questionnaire-version-history/${params.id}`}
                  style={{ cursor: "pointer" }}
                >
                  Questionnaire History
                </Link>
              </li>
            )}
            {params["*"].includes("version") ? (
              <li>Preview Questionnaire History</li>
            ) : (
              <li>Preview Questionnaire </li>
            )}
            {/* {(SUPER_ADMIN === true ||
              moduleAccesForMember[0]?.questionnaire?.add) &&
              !params["*"].includes("version") &&
              !questionnaire?.isDraft &&
              !questionnaire?.isPublished && (
                <li>
                  <Link
                    to={`/questionnaires/add-questionnaire/${params.id}`}
                    style={{ cursor: "pointer" }}
                  >
                    Add Questionnaire
                  </Link>
                </li>
              )}
            {(SUPER_ADMIN === true ||
              moduleAccesForMember[0]?.questionnaire?.edit) &&
              !params["*"].includes("version") &&
              (questionnaire?.isDraft || questionnaire?.isPublished) && (
                <li>
                  <Link
                    to={`/questionnaires/edit-questionnaire/${params.id}`}
                    style={{ cursor: "pointer" }}
                  >
                    Edit Questionnaire
                  </Link>
                </li>
              )} */}
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header">
            <div className="flex-between preview-que-ttl-blk">
              <h2 className="heading2">{questionnaire?.title}</h2>
              <span className="form-header-right-txt" onClick={handleToggle}>
                <span
                  className={`crud-operation ${
                    isActive && "crud-operation-active"
                  }`}
                >
                  <MoreVertIcon />
                </span>
                <div
                  className="crud-toggle-wrap que-crud-toggle-wrap"
                  style={{
                    display: isActive ? "block" : "none",
                  }}
                >
                  <ul className="crud-toggle-list">
                    <li
                      onClick={() =>
                        downloadFunction(
                          "Questionnaire",
                          setToasterDetails,
                          params.id,
                          questionnairePreviewRef,
                          DOWNLOAD_QUESTIONNAIRES_BY_ID,
                          navigate
                        )
                      }
                    >
                      Export to Excel
                    </li>
                    {!params["*"].includes("version") &&
                      !questionnaire?.isDraft && (
                        <li
                          onClick={() =>
                            navigate(
                              `/questionnaire-version-history/${params.id}`
                            )
                          }
                        >
                          Version History
                        </li>
                      )}
                    {(SUPER_ADMIN === true ||
                      moduleAccesForMember[0]?.questionnaire?.edit) &&
                      !params["*"].includes("version") &&
                      (questionnaire?.isDraft ||
                        questionnaire?.isPublished) && (
                        <li
                          onClick={() =>
                            navigate(
                              `/questionnaires/edit-questionnaire/${params.id}`
                            )
                          }
                        >
                          Edit Questionnaire
                        </li>
                      )}
                    {(SUPER_ADMIN === true ||
                      moduleAccesForMember[0]?.questionnaire?.delete) && (
                      <li onClick={() => setOpenDialog(true)}>
                        Delete Questionnaire
                      </li>
                    )}
                  </ul>
                </div>
              </span>
            </div>
            <div className="excel-short-name">
              <p>{questionnaire?.sheetName}</p>
            </div>
          </div>

          {/* <div className="que-ttl-blk">
                        <div className="form-group mb-0">
                            <label for="">
                                Questionnaire Title{" "}
                                <span className="mandatory">*</span>
                            </label>
                            <TextField
                                className="input-field"
                                id="outlined-basic"
                                value={questionnaire.title}
                                placeholder="Enter questionnaire title"
                                variant="outlined"
                            />
                        </div>
                    </div> */}
          {isPreviewQuestionnaireLoading ? (
            <Loader />
          ) : (
            <div className="section-form-sect">
              <div className="section-tab-blk flex-between preview-tab-blk">
                <div className="section-tab-leftblk">
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                    className="tabs-sect que-tab-sect"
                  >
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      {questionnaire?.sections?.map((section, index, id) => (
                        <Tooltip
                          key={section?.uuid ?? id}
                          title={section.sectionTitle}
                          placement="bottom-start"
                        >
                          <Tab
                            className="section-tab-item"
                            label={`section ${index + 1}`}
                            {...a11yProps(index)}
                          />
                        </Tooltip>
                      ))}
                    </Tabs>
                  </Box>
                </div>
              </div>
              <div className="preview-tab-data">
                {questionnaire?.sections?.map((section, index) => (
                  <TabPanel
                    key={section?.uuid ?? index}
                    value={value}
                    index={index}
                  >
                    <PreviewSection
                      questionnaire={questionnaire}
                      section={section}
                      sectionIndex={index}
                    />
                  </TabPanel>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default PreviewQuestionnaire;
