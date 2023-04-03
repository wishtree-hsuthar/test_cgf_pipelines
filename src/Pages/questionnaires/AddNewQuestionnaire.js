import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SectionContent from "./SectionContent";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import { ADD_QUESTIONNAIRE } from "../../api/Url";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { TabPanel } from "../../utils/tabUtils/TabPanel";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import Loader from "../../utils/Loader";
import { Logger } from "../../Logger/Logger";
import { useSelector } from "react-redux";
import { catchError } from "../../utils/CatchError";
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const ITEM_HEIGHT = 22;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5,
    },
  },
};
function AddNewQuestionnaire() {
  //custom hook to set title of page
  useDocumentTitle("Add Questionnaire");
  // state to manage to loader
  const [isQuestionnaireLoading, setIsQuestionnaireLoading] = useState(false);
  const [sameSectionsNames, setSameSectionsNames] = useState([]);

  const [value, setValue] = React.useState(0);
  // questionnaire id
  const [err, setErr] = useState({ questionTitle: "", option: "" });
  const [tableErr, setTableErr] = useState("");
  const [questionTitleList, setQuestionTitleList] = useState([]);

  const { id } = useParams();

  const [globalSectionTitleError, setGlobalSectionTitleError] = useState({
    errMsg: "",
  });

  //Refr for Toaster
  const myRef = React.useRef();
  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  const [questionnaire, setQuestionnaire] = useState({
    uuid: id,
    version: "", // TBD
    title: "",
    sheetName: "",
    sections: [
      {
        id: "",
        isRequired: true,
        uuid: uuidv4(),
        sectionTitle: "",
        description: "",
        layout: "form", // form | table
        isActive: true,
        questions: [
          {
            uuid: uuidv4(),
            questionTitle: "",
            inputType: "singleTextbox", // single textbox, multi textbox, dropdown, checkbox, radio group, calendar, ratings, boolean
            validation: "", // isRequired, maxLength, minLength, alpha, alphaNumeric, numeric
            defaultValue: "", // Will only be there in case of the inputType which requires the default value
            isRequired: true,
            options: ["", ""], // multiple values from which user can select
          },
        ],
        value: 1,
      },
    ],
    // isDraft: true,
    // isPublished: false,
    createdAt: Date,
    updatedAt: Date,
    createdBy: "",
    updatedBy: "",
    isActive: true,
  });
  const urlParams = useParams();
  Logger.debug("urlParams- ", urlParams);
  const privilegeObj = useSelector((state) => state?.user?.privilege);
  const userAuthObj = useSelector((state) => state?.user?.userObj);
  const SUPER_ADMIN = privilegeObj?.name === "Super Admin" ? true : false;
  let privilegesArray =
    userAuthObj?.roleId?.name === "Super Admin"
      ? []
      : Object.values(privilegeObj?.privileges);
  let moduleAccessForOpMember = privilegesArray
    .filter((module) => module?.moduleId?.name === "Questionnaire")
    .map((privilegeObj) => ({
      questionnaire: {
        list: privilegeObj?.list,
        view: privilegeObj?.view,
        edit: privilegeObj?.edit,
        delete: privilegeObj?.delete,
        add: privilegeObj?.add,
      },
    }));
  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();
    const fetch = async () => {
      try {
        setIsQuestionnaireLoading(true);
        const response = await privateAxios.get(`${ADD_QUESTIONNAIRE}/${id}`, {
          signal: controller.signal,
        });
        setIsQuestionnaireLoading(false);
        Logger.debug("response from fetch questionnaire", response);

        isMounted && setQuestionnaire({ ...response.data });
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        setIsQuestionnaireLoading(false);
        catchError(
          error,
          setToasterDetails,
          myRef,
          navigate,
          "/questionnaires"
        );
        // if (error?.response?.status == 401) {
        //   setToasterDetails(
        //     {
        //       titleMessage: "Error",
        //       descriptionMessage: "Session Timeout: Please login again",

        //       messageType: "error",
        //     },
        //     () => myRef.current()
        //   );
        //   setTimeout(() => {
        //     navigate("/login");
        //   }, 3000);
        // }
      }
    };
    // (moduleAccessForOpMember[0]?.questionnaire?.edit || SUPER_ADMIN) && fetch();
    if (
      (moduleAccessForOpMember[0]?.questionnaire?.edit || SUPER_ADMIN) &&
      urlParams["*"].includes("edit")
    ) {
      fetch();
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  const onPreviewClickHandler = () => {
    (questionnaire?.isDraft || questionnaire?.isPublished) &&
      navigate(`/questionnaires/preview-questionnaire/${id}`);
  };
  const addSection = () => {
    // Logger.debug("questionnare: ",questionnaire)
    setQuestionnaire({
      ...questionnaire,
      sections: [
        ...questionnaire.sections,
        {
          id: "",
          uuid: uuidv4(),
          srNo: "", // TBD
          sectionTitle: "",
          description: "",
          layout: "form", // form | table
          isActive: true,
          questions: [
            {
              uuid: uuidv4(),
              questionTitle: "",
              inputType: "singleTextbox", // single textbox, multi textbox, dropdown, checkbox, radio group, calendar, ratings, boolean
              validation: "", // isRequired, maxLength, minLength, alpha, alphaNumeric, numeric
              defaultValue: "", // Will only be there in case of the inputType which requires the default value
              isRequired: true,
              options: ["", ""], // multiple values from which user can select
            },
          ],
          value: questionnaire.sections.length + 1,
        },
      ],
    });
    setValue(questionnaire.sections.length);
  };

  return (
    <div className="page-wrapper">
      <Toaster
        myRef={myRef}
        titleMessage={toasterDetails.titleMessage}
        descriptionMessage={toasterDetails.descriptionMessage}
        messageType={toasterDetails.messageType}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link to="/questionnaires">Questionnaire</Link>
            </li>
            {questionnaire?.isDraft || questionnaire?.isPublished ? (
              <li>Edit Questionnaire</li>
            ) : (
              <li>Add Questionnaire</li>
            )}
          </ul>
        </div>
      </div>
      <section>
        {isQuestionnaireLoading ? (
          <Loader />
        ) : (
          <div className="container">
            <div className="form-header flex-between">
              {questionnaire?.isDraft || questionnaire?.isPublished ? (
                <h2 className="heading2">Edit Questionnaire</h2>
              ) : (
                <h2 className="heading2">Add Questionnaire</h2>
              )}
            </div>
            <div className="que-ttl-blk flex-between">
              <div className="que-ttl-left">
                <div className="form-group">
                  <label htmlFor="emailid">
                    Questionnaire Title <span className="mandatory">*</span>
                  </label>
                  <TextField
                    className={`input-field ${
                      questionnaire.title === "" &&
                      globalSectionTitleError?.errMsg &&
                      "input-error"
                    }`}
                    id="outlined-basic"
                    value={questionnaire.title}
                    placeholder="Enter questionnaire title"
                    // inputProps={{
                    //   maxLength: 500,
                    // }}
                    disabled={
                      questionnaire?.isPublished || questionnaire?.isDraft
                    }
                    variant="outlined"
                    onChange={(e) => {
                      setQuestionnaire({
                        ...questionnaire,
                        title: e.target.value,
                      });
                    }}
                    onBlur={(e) =>
                      setQuestionnaire({
                        ...questionnaire,
                        title: e.target.value?.trim(),
                      })
                    }
                    helperText={
                      questionnaire.title === "" &&
                      globalSectionTitleError?.errMsg
                        ? "Enter the questionnaire title"
                        : " "
                    }
                  />
                </div>
              </div>
              <div className="que-ttl-right flex-between">
                <div className="form-group">
                  <label htmlFor="emailid">
                    Sheet Name <span className="mandatory">*</span>
                  </label>
                  <TextField
                    className={`input-field ${
                      questionnaire.sheetName === "" &&
                      globalSectionTitleError?.errMsg &&
                      "input-error"
                    }`}
                    id="outlined-basic"
                    inputProps={{
                      maxLength: 31,
                    }}
                    value={questionnaire.sheetName}
                    placeholder="Enter sheet name"
                    variant="outlined"
                    onChange={(e) => {
                      setQuestionnaire({
                        ...questionnaire,
                        sheetName: e.target.value,
                      });
                    }}
                    helperText={
                      questionnaire.sheetName === "" &&
                      globalSectionTitleError?.errMsg
                        ? "Enter the sheet name"
                        : " "
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">
                    Status <span className="mandatory">*</span>
                  </label>
                  <div className="select-field">
                    <FormControl className="fullwidth-field">
                      <Select
                        IconComponent={(props) => (
                          <KeyboardArrowDownRoundedIcon {...props} />
                        )}
                        value={questionnaire?.isActive ? "active" : "inActive"}
                        onChange={(e) => {
                          setQuestionnaire({
                            ...questionnaire,
                            isActive:
                              e.target.value === "active" ? true : false,
                          });
                        }}
                        MenuProps={MenuProps}
                        name={"isActive"}
                      >
                        <MenuItem value={"active"} selected>
                          Active
                        </MenuItem>
                        <MenuItem value={"inActive"}>Inactive</MenuItem>
                      </Select>
                      <FormHelperText> </FormHelperText>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-form-sect">
              <div className="section-tab-blk flex-between">
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
                      {questionnaire.sections.map((section, index, id) => (
                        <Tooltip
                          key={section?.uuid}
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
                <div className="section-tab-rightblk">
                  <div className="form-header-right-txt">
                    <div
                      onClick={onPreviewClickHandler}
                      className={`tertiary-btn-blk ${
                        questionnaire?.isDraft ||
                        questionnaire?.isPublished ||
                        "disabled-tertiary-btn"
                      }  mr-20`}
                    >
                      <span className="preview-icon">
                        <VisibilityOutlinedIcon />
                      </span>
                      <span className="addmore-txt">Preview</span>
                    </div>
                    <div className="tertiary-btn-blk">
                      <span className="addmore-icon" onClick={addSection}>
                        <i className="fa fa-plus"></i>
                      </span>
                      <span onClick={addSection} className="addmore-txt">
                        Add Section
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="que-tab-data">
                {questionnaire.sections.map((section, index) => (
                  <TabPanel key={section?.uuid} value={value} index={index}>
                    <SectionContent
                      sameSectionsNames={sameSectionsNames}
                      err={err}
                      setErr={setErr}
                      setSameSectionsNames={setSameSectionsNames}
                      setQuestionnaire={setQuestionnaire}
                      tableErr={tableErr}
                      setTableErr={setTableErr}
                      questionnaire={questionnaire}
                      value={section.value}
                      uuid={section.uuid}
                      setValue={setValue}
                      index={index}
                      section={section}
                      tabChange={handleChange}
                      globalSectionTitleError={globalSectionTitleError}
                      setGlobalSectionTitleError={setGlobalSectionTitleError}
                      questionTitleList={questionTitleList}
                      setQuestionTitleList={setQuestionTitleList}
                    />
                  </TabPanel>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default AddNewQuestionnaire;
