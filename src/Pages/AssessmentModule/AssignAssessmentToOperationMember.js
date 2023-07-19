import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import { FETCH_ASSESSMENT_BY_ID, REASSIGN_ASSESSMENTS } from "../../api/Url";
import TableComponent from "../../components/TableComponent";
import Toaster from "../../components/Toaster";
import Loader from "../../utils/Loader";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { Logger } from "../../Logger/Logger";
const tableHead = [
  {
    id: "",
    disablePadding: true,
    label: "",
  },
  {
    id: "name",
    disablePadding: true,
    label: "Operation Member",
  },
  {
    id: "email",
    disablePadding: false,
    label: "Email",
  },
];

const AssignAssessmentToOperationMember = () => {
  //custom hook to set title of page
  useDocumentTitle("Assign Assessment");

  const keysOrder = ["_id", "name", "email"];

  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  //state to hold search timeout delay
  const [searchTimeout, setSearchTimeout] = useState(null);

  //array to get array of selected rows ids
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("operationalMember");
  const [selectedUser, setSelectedUser] = useState("");
  const [makeApiCall, setMakeApiCall] = useState(true);
  const [records, setRecords] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [assessment, setAssessment] = useState({});
  const [search, setSearch] = useState("");
  const [newOperationMember, setNewOperationMember] = useState("");
  const navigate = useNavigate();
  const myRef = React.useRef();

  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });

  let memberId;
  // search function
  const onSearchChangeHandler = (e) => {
    e.preventDefault();
    Logger.info(
      "Assign assessment to operation member - onSearchChangeHandler handler"
    );
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
  const generateUrl = () => {
    let url = `${FETCH_ASSESSMENT_BY_ID}${window.location.pathname
      .split("/")
      .at(
        -1
      )}/reassignto/list?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;
    if (search?.length >= 3)
      url = `${FETCH_ASSESSMENT_BY_ID}${window.location.pathname
        .split("/")
        .at(
          -1
        )}/reassignto/list?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}&search=${search}`;
    return memberId && url;
  };

  const updateRecords = (data) => {
    Logger.info(
      "Assign assessment to operation member - updateRecords handler"
    );

    let staleData = data;
    staleData.forEach((object) => {
      delete object["updatedAt"];
      delete object["description"];
      delete object["countryCode"];
      delete object["isDeleted"];
      delete object["__v"];
      delete object["password"];
      delete object["roleId"];
      delete object["salt"];
      delete object["uuid"];
      delete object["phoneNumber"];
      delete object["createdAt"];
      delete object["memberData"];
      delete object["department"];
      delete object["isDeleted"];
      delete object["isActive"];
      delete object["createdBy"];
      delete object["updatedBy"];
      delete object["isReplaced"];
      delete object["memberId"];
      delete object["salutation"];
      delete object["title"];
      delete object["address"];
      delete object["operationType"];
      delete object["reportingManager"];
      delete object["isCGFStaff"];
      delete object["isOperationMember"];
      delete object["isMemberRepresentative"];
      delete object["assessmentCount"];

      keysOrder.forEach((k) => {
        const v = object[k];
        delete object[k];
        object[k] = v;
      });
    });
    setRecords([...staleData]);
  };

  const getOperationMembers = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
    Logger.info(
      "Assign assessment to operation member - getOperationMembers handler"
    );
    try {
      let url = generateUrl();
      setIsLoading(true);
      const response = await privateAxios.get(memberId && url, {
        signal: controller.signal,
      });
      setTotalRecords(parseInt(response.headers["x-total-count"]));

      updateRecords(response?.data);
      setIsLoading(false);
    } catch (error) {
      Logger.info(
        "Assign assessment to operation member - getOperationMembers handler catch error"
      );
      if (error?.code === "ERR_CANCELED") return;
      isMounted &&
        setToasterDetails(
          {
            titleMessage: "Error",
            descriptionMessage:
              error?.response?.data?.error &&
              typeof error.response.data.error === "string"
                ? error.response.data.error
                : "Oops! Something went wrong. Please try again later.",

            messageType: "error",
          },
          () => myRef.current()
        );
      setIsLoading(false);
    }
  };

  const handleTableTesterPageChange = (newPage) => {
    Logger.info(
      "Assign assessment to operation member - handleTableTesterPageChange handler"
    );
    setPage(newPage);
  };

  //rows per page change handler
  const handleTableTesterRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  // selects single operation member
  const selectSingleUser = (opId) => {
    setSelectedUser(opId);
    setNewOperationMember(opId);
  };

  // fetch assessment method
  const fetchAssessment = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
    Logger.info(
      "Assign assessment to operation member - fetchAssessment handler"
    );
    try {
      const response = await privateAxios.get(FETCH_ASSESSMENT_BY_ID + id, {
        signal: controller.signal,
      });
      isMounted && setAssessment(response.data);
      memberId = response?.data?.assignedMember?._id;
    } catch (error) {
      Logger.info(
        "Assign assessment to operation member - fetchAssessment handler catch error"
      );

      if (
        error?.response?.status === 400 &&
        error?.response?.data?.message === "Invalid assessment!"
      ) {
        setToasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage:
              "Oops!! There is some error while saving assessment details. Either someone has removed this assessment or looks like invalid assessment getting submitted. For more details please contact system / CGF admin",
            messageType: "error",
          },
          () => myRef.current()
        );
        setTimeout(() => {
          navigate("/assessment-list");
        }, 3000);
      }
    }
  };

  // assign assessment to operation member
  const handleReassignAssessment = async () => {
    Logger.info(
      `Assign assessment to operation member - handleReassignAssessment handler`
    );
    try {
      const response = await privateAxios.post(
        REASSIGN_ASSESSMENTS + id + "/reassign",
        {
          reassignTo: newOperationMember,
        }
      );
      if (response.status == 201) {
        setToasterDetails(
          {
            titleMessage: "Success",
            descriptionMessage: response?.data?.message,

            messageType: "success",
          },
          () => myRef.current()
        );
        setTimeout(() => {
          navigate("/assessment-list");
        }, 2000);
      }
    } catch (error) {
      Logger.info(
        "Assign assessment to operation member - handleReassignAssessment handler catch error"
      );
      if (error?.response?.status == 400) {
        setToasterDetails(
          {
            titleMessage: "Error",
            descriptionMessage:
              error?.response?.data?.error &&
              typeof error.response.data.error === "string"
                ? error.response.data.error
                : "Oops! Something went wrong. Please try again later.",

            messageType: "error",
          },
          () => myRef.current()
        );
      }
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.message === "Invalid assessment!"
      ) {
        setToasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage:
              "Oops!! There is some error while saving assessment details. Either someone has removed this assessment or looks like invalid assessment getting submitted. For more details please contact system / CGF admin",
            messageType: "error",
          },
          () => myRef.current()
        );
        setTimeout(() => {
          navigate("/assessment-list");
        }, 3000);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    makeApiCall &&
      // const fetchAssessment=()=>{
      //     try {

      //     } catch (error) {

      (async () => {
        await fetchAssessment(isMounted, controller);
        await getOperationMembers(isMounted, controller);
      })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [makeApiCall, orderBy, order, page, rowsPerPage]);

  return (
    <div className="page-wrapper">
      <Toaster
        myRef={myRef}
        messageType={toasterDetails.messageType}
        descriptionMessage={toasterDetails.descriptionMessage}
        titleMessage={toasterDetails.titleMessage}
      />

      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link to="/assessment-list">Assessments</Link>
            </li>

            <li>Assign Assessment</li>
          </ul>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="form-header flex-between ">
            <h2 className="heading2">Assign Assessment</h2>
            <div className="member-filter-left">
              {/* <div className="tertiary-btn-blk"> */}
              <div className="searchbar">
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => onSearchChangeHandler(e)}
                  name="search"
                />
                <button type="submit">
                  <i className="fa fa-search"></i>
                </button>
              </div>
              {/* </div> */}
            </div>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="member-info-wrapper table-content-wrap replace-admin-table">
              <div className="member-data-sect">
                <TableComponent
                  tableHead={tableHead}
                  records={records}
                  handleChangePage1={handleTableTesterPageChange}
                  handleChangeRowsPerPage1={handleTableTesterRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalRecords={totalRecords}
                  orderBy={orderBy}
                  order={order}
                  setOrder={setOrder}
                  setOrderBy={setOrderBy}
                  selected={selected}
                  setSelected={setSelected}
                  setCheckBoxes={false}
                  setSingleSelect={true}
                  handleSingleUserSelect={selectSingleUser}
                  selectedUser={selectedUser}
                />
              </div>
            </div>
          )}
          <div className="form-btn flex-between add-members-btn mb-20 replace-cgf-admin-btnblk">
            <button
              onClick={() => navigate("/assessment-list")}
              className="secondary-button mr-10"
            >
              Cancel
            </button>

            <button
              // onClick={openReplaceDailogBox}
              onClick={handleReassignAssessment}
              disabled={selectedUser == ""}
              // disabled
              className="primary-button add-button replace-assign-btn"
            >
              Assign
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssignAssessmentToOperationMember;
