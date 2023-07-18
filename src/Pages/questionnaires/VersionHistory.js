import { TextField } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import { ADD_QUESTIONNAIRE } from "../../api/Url";
import TableComponent from "../../components/TableComponent";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";
import Loader from "../../utils/Loader";
import { Logger } from "../../Logger/Logger";
const VersionHistory = () => {
  const params = useParams();
  const navigate = useNavigate();
  // state to manage loader
  const [isVersionHistoryLoading, setIsVersionHistoryLoading] = useState(false);
  const versionHistoryTableHeadColumns = [
    // {
    //     id: "title",

    //     disablePadding: false,
    //     label: "Title",
    // },

    // {
    //     id: "uuid",
    //     // width: "30%",
    //     disablePadding: false,
    //     // label: "Version Date",
    // },
    {
      id: "vNo",

      disablePadding: false,
      label: "Versions",
    },
    {
      id: "date",
      // width: "30%",
      disablePadding: false,
      label: "Version Date",
    },
    {
      id: "createdBy",
      // width: "30%",
      disablePadding: false,
      label: "Created By",
    },
  ];
  const [versionHistoryPage, setVersionHistoryPage] = React.useState(1);
  const [versionHistoryRowsPerPage, setVersionHistoryRowsPerPage] =
    React.useState(10);
  const [versionHistoryOrder, setVersionHistoryOrder] = React.useState("desc");
  const [versionHistoryOrderBy, setVersionHistoryOrderBy] = React.useState("");
  const [versionHistoryRecords, setVersionHistoryRecords] = React.useState([]);
  const [versionHistoryTotalRecords, setVersionHistoryTotalRecords] =
    React.useState(0);
  const [makeApiCall, setMakeApiCall] = useState(true);
  const [questionnaireTitle, setQuestionnaireTitle] = useState("");

  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  const versionHistoryRef = useRef();

  const generateUrl = () => {
    let url = `${ADD_QUESTIONNAIRE}/${params.id}/versions?page=${versionHistoryPage}&size=${versionHistoryRowsPerPage}&orderBy=${versionHistoryOrderBy}&order=${versionHistoryOrder}`;

    return url;
  };

  const updateRecordsForVersionHistory = (data) => {
    const onboardedKeysOrder = ["vNo", "date", "createdBy"];

    

    let staleData = data;
    let title = data.filter((data) => data.uuid === params.id);
    setQuestionnaireTitle(title[0].title);
    staleData.forEach((object) => {
      object["date"] = new Date(object["createdAt"]).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      object["vNo"] = "v" + object["vNo"];
      delete object["title"];
      delete object["createdAt"];

      onboardedKeysOrder.forEach((k) => {
        const v = object[k];
        delete object[k];
        object[k] = v;
      });
    });
    
    setVersionHistoryRecords([...staleData]);
  };

  const getVersionHistory = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
    try {
      let url = generateUrl();
      setIsVersionHistoryLoading(true);
      Logger.info("Questionnaire - Version History - getVersionHistory handler")
      const response = await privateAxios.get(url, {
        signal: controller.signal,
      });
      setVersionHistoryTotalRecords(
        parseInt(response.headers["x-total-count"])
      );
      

      updateRecordsForVersionHistory([...response.data]);
      setIsVersionHistoryLoading(false);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      Logger.info(`Questionnaire - Version History - getVersionHistory handler - catch error ${error?.response?.data?.message}`)

      if (error?.response?.status == 401) {
        setToasterDetails(
          {
            titleMessage: "Error",
            descriptionMessage: "Session Timeout: Please login again",
            messageType: "error",
          },
          () => versionHistoryRef.current()
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
              : "Oops! Something went wrong. Please try again later.",
            messageType: "error",
          },
          () => versionHistoryRef.current()
        );
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
        setToasterDetails(
          {
            titleMessage: "Error",
            descriptionMessage: error?.response?.data?.message
              ? error?.response?.data?.message
              : "Oops! Something went wrong. Please try again later.",
            messageType: "error",
          },
          () => versionHistoryRef.current()
        );
      }
      setIsVersionHistoryLoading(false);
    }
  };


  const handleTablePageChange = (newPage) => {
    setVersionHistoryPage(newPage);
  };

  // rows per page method for onboarded tab
  const handleRowsPerPageChange = (event) => {
    setVersionHistoryRowsPerPage(parseInt(event.target.value, 10));
    setVersionHistoryPage(1);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    makeApiCall && getVersionHistory(isMounted, controller);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [
    versionHistoryPage,
    versionHistoryRowsPerPage,
    versionHistoryOrderBy,
    versionHistoryOrder,
    // filters,
    makeApiCall,
    setMakeApiCall,
    // searchTimeout,
  ]);

  const onClickVisibilityIconHandler = (uuid) => {

    return navigate(`/questionnaires/preview-questionnaire-version/${uuid}`);
  };

  return (
    <div className="page-wrapper">
      <Toaster
        myRef={versionHistoryRef}
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
                state={0}
                style={{ cursor: "pointer" }}
              >
                Questionnaire (Published)
              </Link>
            </li>

            <li>
              <a
                onClick={() =>
                  navigate(`/questionnaires/preview-questionnaire/${params.id}`)
                }
                style={{ cursor: "pointer" }}
              >
                Preview Questionnaire
              </a>
            </li>

            <li>Questionnaire History</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="form-header flex-between">
          <h2 className="heading2">Questionnaire History</h2>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="que-ttl-blk">
            <div className="form-group">
              <label htmlFor="emailid">
                Questionnaire Title <span className="mandatory">*</span>
              </label>
              <TextField
                className={`input-field 
                                 
                                    // questionnaire.title === "" &&
                                    // globalSectionTitleError?.errMsg &&
                                     // "input-error"
                                // }`}
                id="outlined-basic"
                value={questionnaireTitle}
                placeholder="Enter questionnaire title"
                // inputProps={{
                //   maxLength: 500,
                // }}
                disabled
                variant="outlined"
                // onChange={(e) => {
                //     setQuestionnaire({
                //         ...questionnaire,
                //         title: e.target.value,
                //     });
                // }}
                // onBlur={(e) =>
                //     setQuestionnaire({
                //         ...questionnaire,
                //         title: e.target.value?.trim(),
                //     })
                // }
                // helperText={
                //     questionnaire.title === "" &&
                //     globalSectionTitleError?.errMsg
                //         ? "Enter the questionnaire title"
                //         : " "
                // }
              />
            </div>
          </div>
          <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
            {isVersionHistoryLoading ? (
              <Loader />
            ) : (
              <TableComponent
                tableHead={versionHistoryTableHeadColumns}
                records={versionHistoryRecords}
                handleChangePage1={handleTablePageChange}
                handleChangeRowsPerPage1={handleRowsPerPageChange}
                page={versionHistoryPage}
                rowsPerPage={versionHistoryRowsPerPage}
                totalRecords={versionHistoryTotalRecords}
                orderBy={versionHistoryOrderBy}
                // icons={["visibility"]}
                onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
                order={versionHistoryOrder}
                setOrder={setVersionHistoryOrder}
                setOrderBy={setVersionHistoryOrderBy}
                setCheckBoxes={false}
                onRowClick={true}
                isQuestionnare={true}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VersionHistory;
