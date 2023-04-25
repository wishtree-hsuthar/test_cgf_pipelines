import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Internal Imports
import TableComponent from "../../components/TableComponent";
import { useSelector } from "react-redux";
import { privateAxios } from "../../api/axios";
import { ASSESSMENTS } from "../../api/Url";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Toaster from "../../components/Toaster";
import Loader from "../../utils/Loader";
import { Logger } from "../../Logger/Logger";

const assessmentListTableHead = [
  {
    disablePadding: false,
    width: "30%",
    id: "title",
    label: "Title",
  },
  {
    disablePadding: false,
    width: "30%",
    id: "assessmentType",
    label: "Assessment Type",
  },
  {
    disablePadding: false,

    width: "30%",
    id: "assignedMember.name",
    label: "Assigned Member",
  },
  {
    disablePadding: false,
    width: "30%",
    id: "assignedOperationMember.name",
    label: "Assigned To",
  },
  {
    disablePadding: false,
    width: "30%",
    id: "assessmentStatus",
    label: "Status",
  },
  {
    disablePadding: false,
    width: "30%",
    id: "dueDate",
    label: "Due Date",
  },
  {
    disablePadding: false,
    width: "30%",
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
    "assessmentStatus",
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
  let icons = [];

  const onSearchChangeHandler = (e) => {
    Logger.debug("event", e.key);
    if (searchTimeout) clearTimeout(searchTimeout);
    setMakeApiCall(false);
    Logger.debug("search values", e.target.value);
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
              : "Something went wrong",
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
              : "Something went wrong",
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

      object["assignedMember.name"] = object["assignedMember"]["name"];
      object["assignedOperationMember.name"] =
        object["assignedOperationMember"]["name"];
      object["isUserAuthorizedToFillAssessment"] =
        userAuth._id === object["assignedOperationMember"]["_id"]
          ? true
          : false;
      delete object["assignedOperationMember"];
      delete object["assignedMember"];
      delete object["memberCompany"];
      delete object["questionnaireId"];
      delete object["isMemberRepresentative"];

      object["dueDate"] = new Date(
        new Date(object["dueDate"]).setDate(
          new Date(object["dueDate"]).getDate() - 1
        )
      ).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
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
    if (SUPER_ADMIN || userAuth?.isCGFAdmin == true) {
      icons = ["edit", "visibility"];
      return icons;
    } else if (icons.includes("fill")) {
      icons.push("send");

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
              <div className="form-header-right-txt search-and-btn-field-right view-instruct-field-right">
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
