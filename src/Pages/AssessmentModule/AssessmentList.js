import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Internal Imports
import TableComponent from "../../components/TableComponent";
import { useSelector } from "react-redux";
import { privateAxios } from "../../api/axios";
import { ASSESSMENTS, DOWNLOAD_ACTION_PLAN, ZIP_FILE_DOWNLOAD } from "../../api/Url";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Toaster from "../../components/Toaster";
import Loader from "../../utils/Loader";
import { Logger } from "../../Logger/Logger";
import  {catchError}  from "../../utils/CatchError";
import { CloudDownloadOutlined, ImportExportOutlined } from "@mui/icons-material";
import { getTimeStamp } from "../../utils/downloadFunction";
import { Tooltip } from "@mui/material";

const listObj = {
  width: "30%",
  disablePadding: false,
};
const assessmentListTableHead = [
  {
    ...listObj,
    id: "title",
    label: "Title",
  },
  {
    ...listObj,
    id: "assessmentType",
    label: "Assessment Type",
  },
  {
    ...listObj,
    id: "assignedMember.name",
    label: "Assigned Member",
  },
  {
    ...listObj,
    id: "assignedOperationMember.name",
    label: "Assigned To",
  },
  {
    ...listObj,
    id: "region",
    label: "Region",
  },
  {
    ...listObj,
    id: "country",
    label: "Country",
  },

  {
    ...listObj,
    id: "assessmentStatus",
    label: "Status",
  },
  {
    ...listObj,
    id:"submissionDate",
    label:"Submitted Date"
  },
  {
    ...listObj,
    id: "dueDate",
    label: "Due Date",
  },
  {
    ...listObj,
    id: "action",
    label: "Actions",
  },
];
const AssessmentList = () => {
  //custom hook to set title of page
  useDocumentTitle("Assessments");

  //Refr for Toaster
  const myRef = React.useRef();
  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  const keysOrder = [
    "uuid",
    "_id",
    "title",
    "assessmentType",
    "assignedMember.name",
    "assignedOperationMember.name",

    "region",
    "country",

    "assessmentStatus",
    "submissionDate",
    "dueDate",
    "isUserAuthorizedToFillAssessment",
  ];
  const navigate = useNavigate();

  // state to manage loader
  const [isAssessmentListLoading, setIsAssessmentListLoading] = useState(false);

  //state to hold search timeout delay
  const [searchTimeout, setSearchTimeout] = useState(null);
  //state to hold wheather to make api call or not
  const [makeApiCall, setMakeApiCall] = useState(true);

  //state to hold search keyword
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("");
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  let icons = ["download"];

  const onSearchChangeHandler = (e) => {
    Logger.info("Assessment list - onSearchChangeHandler handler");
    if (searchTimeout) clearTimeout(searchTimeout);
    setMakeApiCall(false);
    setSearch(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        setMakeApiCall(true);
        setPage(1);
      }, 1000)
    );
  };

  const handleTablePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  const onClickVisibilityIconHandler = (id) => {
    return navigate(`/assessment-list/view-assessment/${id}`);
  };

  const onClickEditIconHandler = (uuid) => {
    return navigate(`/assessment-list/edit-assessment/${uuid}`);
  };
  const onClickAssignAssessmentHandler = (uuid) => {
    return navigate(`/assessment-list/assign-assessment/${uuid}`);
  };
  const onClickFillAssessmentHandler = (uuid) => {
    return navigate(`/assessment-list/fill-assessment/${uuid}`);
  };

  const onClickDownload =async (uuid)=>{
    try {
      const response = await privateAxios.get(DOWNLOAD_ACTION_PLAN+uuid+'/action-plan',{
        responseType:"blob"
      })
      Logger.info(` download function -  from   assessment `);
      console.log('response-download = ',response)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement(`a`);
      link.href = url;
      link.setAttribute(`download`, `${response.headers['file-name']}`);
      document.body.appendChild(link);
      link.click();
      if (response.status == 200) {
        console.log('response from download',response)
        setToasterDetails(
          {
            titleMessage: `Success!`,
            descriptionMessage: "Downloaded Successfully!",
  
            messageType: `success`,
          },
          () => myRef.current()
        );
      }
    } catch (error) {
      if (error.response) {
        // Error response received from the server
        let reader = new FileReader();
        reader.onload = function () {
          let errorData = JSON.parse(reader.result);
          // Handle errorData
          catchError(errorData,setToasterDetails,myRef,navigate)

        };
        console.log(reader.readAsText(error.response.data));

      } else if (error.request) {
        // No response received from the server
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    }
  }
  const generateUrl = () => {
    let url = `${ASSESSMENTS}?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;
    if (search?.length >= 3) url += `&search=${search}`;

    return url;
  };

  const getAssessments = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
    try {
      let url = generateUrl();
      setIsAssessmentListLoading(true);
      const response = await privateAxios.get(url, {
        signal: controller.signal,
      });
      setTotalRecords(parseInt(response.headers["x-total-count"]));

      updateRecords([...response.data]);
      setIsAssessmentListLoading(false);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;

      if (error?.response?.status == 401) {
        setToasterDetails(
          {
            titleMessage: "Error",
            descriptionMessage: "Session Timeout: Please login again",
            messageType: "error",
          },
          () => myRef.current()
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (error?.response?.status == 403) {
        setToasterDetails(
          {
            titleMessage: "Error",
            descriptionMessage: error?.response?.data?.message
              ? error?.response?.data?.message
              : "Oops! Something went wrong. Please try again later.",
            messageType: "error",
          },
          () => myRef.current()
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
          () => myRef.current()
        );
      }

      setIsAssessmentListLoading(false);
    }
  };

  const updateRecords = (data) => {
    data.forEach((object) => {
      delete object["updatedAt"];

      delete object["__v"];
      delete object["isDraft"];
      delete object["isPublished"];
      delete object["isActive"];
      delete object["isDeleted"];
      delete object["isSubmitted"];
      delete object["updatedAt"];
      delete object["updatedBy"];
      delete object["createdBy"];
      delete object["createdAt"];
      delete object["remarks"];

      object["assignedMember.name"] = object?.assignedMember?.name ?? "N/A";
      object["assignedOperationMember.name"] =
        object?.assignedOperationMember?.name ?? "N/A";
      object["isUserAuthorizedToFillAssessment"] =
        userAuth._id === object["assignedOperationMember"]["_id"]
          ? true
          : false;
      delete object["assignedOperationMember"];
      delete object["assignedMember"];
      delete object["memberCompany"];
      delete object["questionnaireId"];
      delete object["isMemberRepresentative"];
      delete object["actionPlan"];


      object["dueDate"] = new Date(
        new Date(object["dueDate"]).setDate(
          new Date(object["dueDate"]).getDate() - 1
        )
      ).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      object["submissionDate"] = object['submissionDate']?new Date(
        new Date(object["submissionDate"]).setDate(
          new Date(object["submissionDate"]).getDate() - 1
        )
      ).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }):'N/A';
      keysOrder.forEach((k) => {
        const v = object[k];
        delete object[k];
        object[k] = v;
      });
    });
    setRecords([...data]);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    makeApiCall && getAssessments(isMounted, controller);
    return () => {
      isMounted = false;
      clearTimeout(searchTimeout);
      controller.abort();
    };
  }, [page, rowsPerPage, orderBy, order, makeApiCall]);

  const addAssessment = () => {
    navigate("/assessment-list/add-assessment");
  };

  const viewInstruction = () => {
    navigate("/assessment-list/instructions");
  };

  const privilege = useSelector((state) => state?.user?.privilege);

  const userAuth = useSelector((state) => state?.user?.userObj);
  const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;

  let privilegeArray =
    userAuth?.roleId?.name === "Super Admin"
      ? []
      : Object.values(privilege?.privileges);
  let moduleAccesForAssessment = privilegeArray
    .filter((data) => data?.moduleId?.name === "Assessment")
    .map((data) => ({
      assessment: {
        list: data?.list,
        visibility: data?.view,
        edit: data?.edit,
        // delete: data?.delete,
        add: data?.add,
        fill: data?.fill,
      },
    }));

  let assessmentAccessObj = { ...moduleAccesForAssessment[0]?.assessment };
  let handleActionIcons = () => {
    let icon = Object.entries(assessmentAccessObj).filter(
      (key) => key[1] === true && icons.push(key[0])
    );
    console.log("icons - assessment", icons);

    if (SUPER_ADMIN) {
      icons = ["edit", "visibility", "download"];
      return icons;
    } else if (icons.includes("fill")) {
      icons.push("send");
      icons.push("download");

      return icons;
    }
    return icons;
  };
  const onKeyDownChangeHandler = (e) => {
    if (e.key === "Enter") {
      setMakeApiCall(true);
      setPage(1);
    }
  };
  // download action plan
  const downnloadZipFile =async () => {
    try {
      const response = await privateAxios.get(ZIP_FILE_DOWNLOAD+search,{
          responseType: "blob",
        }
      );
      // Logger.info(` download function -  from ${filename}  assessment `);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement(`a`);
      link.href = url;
      let timeStamp = getTimeStamp();
      link.setAttribute(`download`, `Assessments - ${timeStamp}.zip`);
      document.body.appendChild(link);
      link.click();
      if (response.status == 200) {
        setIsAssessmentListLoading(false)
        setToasterDetails(
          {
            titleMessage: `Success!`,
            descriptionMessage: "Downloaded Successfully!",
  
            messageType: `success`,
          },
          () => myRef.current()
        );
      }
    } catch (error) {
      setIsAssessmentListLoading(false)
      Logger.info(`downlaod function - error ${error?.response?.data?.message}`);
      catchError(error, setToasterDetails, myRef, navigate);
      return error;
    }
  };
  return (
    <div>
      <Toaster
        messageType={toasterDetails.messageType}
        descriptionMessage={toasterDetails.descriptionMessage}
        myRef={myRef}
        titleMessage={toasterDetails.titleMessage}
      />
      <div className="page-wrapper">
        <section>
          <div className="container">
            <div className="form-header member-form-header flex-between mb-0">
              <div className="form-header-left-blk flex-start">
                <h2 className="heading2 mr-40">Assessments</h2>
              </div>
              <div className="form-header-right-txt search-and-btn-field-right view-instruct-field-right-edited">
                <div className="search-and-btn-field-blk mr-0">
                  <div className="searchbar">
                    <input
                      type="text"
                      value={search}
                      name="search"
                      placeholder="Search"
                      onKeyDown={onKeyDownChangeHandler}
                      onChange={onSearchChangeHandler}
                    />
                    <button type="submit">
                      <i className="fa fa-search"></i>
                    </button>

                  </div>
               

                </div>
                {(SUPER_ADMIN ||
                  moduleAccesForAssessment[0]?.assessment?.add) && (
                  <div className="form-btn ml-20">
                    <button
                      type="submit"
                      className="primary-button add-button"
                      onClick={addAssessment}
                    >
                      Add Assessment
                    </button>
                  </div>
                )}
             <div className="form-btn ml-20" onClick={()=>{downnloadZipFile();
      setIsAssessmentListLoading(true)
            
            }}
            style={{cursor:'pointer'}}
            >
              <Tooltip title={'Downlaod Assessments'}>
                   <CloudDownloadOutlined  />
                   </Tooltip>
                  </div>
                <div
                  className="tertiary-btn-blk ml-20"
                  onClick={viewInstruction}
                >
                  <span className="preview-icon">
                    <VisibilityOutlinedIcon />
                  </span>
                  <span className="addmore-txt">View Instructions</span>
                </div>
             
              </div>
            </div>

            <div className="member-info-wrapper table-content-wrap">
              <div className="member-info-wrapper table-content-wrap table-footer-btm-space assessment-list-table">
                {isAssessmentListLoading ? (
                  <Loader />
                ) : (
                  <TableComponent
                    tableHead={assessmentListTableHead}
                    records={records}
                    handleChangePage1={handleTablePageChange}
                    handleChangeRowsPerPage1={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalRecords={totalRecords}
                    orderBy={orderBy}
                    icons={handleActionIcons()}
                    onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
                    onClickEditAssesmentFunction={onClickEditIconHandler}
                    order={order}
                    setOrder={setOrder}
                    setOrderBy={setOrderBy}
                    setCheckBoxes={false}
                    onClickAssignAssesmentFunction={
                      onClickAssignAssessmentHandler
                    }
                    onClickFillAssessmentFunction={onClickFillAssessmentHandler}
                    viewAssessment={true}
                    onClickActionPlanDownload={onClickDownload}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AssessmentList;
