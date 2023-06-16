import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DialogBox from "../../components/DialogBox";

import TableComponent from "../../components/TableComponent";
import useCallbackState from "../../utils/useCallBackState";
import { privateAxios } from "../../api/axios";
import {
  GET_OPERATION_MEMBER_BY_ID,
  REPLACE_SUB_ADMIN,
  ADD_OPERATION_MEMBER,
} from "../../api/Url";
import Toaster from "../../components/Toaster";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { Logger } from "../../Logger/Logger";
import { catchError } from "../../utils/CatchError";
const replaceOperationMemberTableHead = [
  {
    id: "",
    disablePadding: true,
    label: "",
    width: "10%",
  },
  {
    id: "name",
    disablePadding: true,
    label: "Operation Member",
    width: "30%",
  },
  {
    id: "email",
    disablePadding: false,
    label: "Email",
    width: "40%",
  },
  {
    id: "role",
    disablePadding: false,
    label: "Role",
    width: "20%",
  },
];
const ReplaceOperationMember = () => {
  //custom hook to set title of page
  useDocumentTitle("Replace Operation Member");

  const replaceHeaderKeyOrder = ["_id", "name", "email", "role"];
  const [opListPage, setOPPage] = React.useState(1);
  const [rowsPerPageReplaceOP, setRowsPerPageReplaceOP] = React.useState(10);
  const [operationMemberReplaceOP, setOperationMemberReplaceOP] = useState({});

  const { id } = useParams();
  const params = useParams();
  //state to hold search timeout delay
  const [disableSubmit, setdisableSubmit] = useState(false);
  const [selectedOperationMember, setSelectedOperationMember] = useState({});
  const [searchTimeoutReplaceOP, setSearchTimeoutReplaceOP] = useState(null);
  const [selectedReplaceOP, setSelectedReplaceOP] = React.useState([]);
  const [orderReplaceOP, setOrderReplaceOP] = React.useState("asc");
  const [orderByReplaceOP, setOrderByReplaceOP] =
    React.useState("operationalMember");
  const [selectedUserReplaceOP, setSelectedUserReplaceOP] = useState("");
  const [makeApiCallReplaceOP, setMakeApiCallReplaceOP] = useState(true);
  const [recordsReplaceOP, setRecordsReplaceOP] = React.useState([]);
  const [totalRecordsReplaceOP, setTotalRecordsReplaceOP] = React.useState(0);
  const [seacrchReplaceOP, setSearchReplaceOP] = useState("");
  const navigate = useNavigate();
  const myRef = React.useRef();
  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  // seacrchReplaceOP function
  const onSearchChangeHandlerReplaceOP = (e) => {
    Logger.debug("event", e.key);
    if (searchTimeoutReplaceOP) clearTimeout(searchTimeoutReplaceOP);
    setMakeApiCallReplaceOP(false);
    Logger.debug("seacrchReplaceOP values", e.target.value);
    setSearchReplaceOP(e.target.value);
    setSearchTimeoutReplaceOP(
      setTimeout(() => {
        setMakeApiCallReplaceOP(true);
        setOPPage(1);
      }, 1000)
    );
  };
  const generateUrl = (multiFilterString) => {
    Logger.debug("Search", seacrchReplaceOP);

    let url = `${ADD_OPERATION_MEMBER}/${id}/replaces/list?page=${opListPage}&size=${rowsPerPageReplaceOP}&orderBy=${orderByReplaceOP}&order=${orderReplaceOP}`;
    if (seacrchReplaceOP?.length >= 3)
      url = `${ADD_OPERATION_MEMBER}/${id}/replaces/list?page=${opListPage}&size=${rowsPerPageReplaceOP}&orderBy=${orderByReplaceOP}&order=${orderReplaceOP}&search=${seacrchReplaceOP}`;

    return url;
  };

  const updateRecordsReplaceOP = (data) => {
    Logger.debug("data before update----", data);

    let staleData = data;
    staleData.forEach((objectRP) => {
      delete objectRP["description"];
      delete objectRP["updatedAt"];
      delete objectRP["isDeleted"];
      delete objectRP["countryCode"];
      delete objectRP["__v"];
      delete objectRP["password"];
      delete objectRP["roleId"];
      delete objectRP["salt"];
      delete objectRP["uuid"];
      delete objectRP["phoneNumber"];
      delete objectRP["subRole"];
      delete objectRP["subRoleId"];
      delete objectRP["createdAt"];
      delete objectRP["isActive"];
      delete objectRP["createdBy"];
      delete objectRP["updatedBy"];
      delete objectRP["isReplaced"];
      delete objectRP["memberData"];
      delete objectRP["memberId"];
      delete objectRP["salutation"];
      delete objectRP["title"];
      delete objectRP["department"];
      delete objectRP["address"];
      delete objectRP["reportingManager"];
      delete objectRP["operationType"];
      delete objectRP["isMemberRepresentative"];
      delete objectRP["isCGFAdmin"];
      delete objectRP["isCGFStaff"];
      delete objectRP["isOperationMember"];

      replaceHeaderKeyOrder.forEach((k) => {
        const v = objectRP[k];
        delete objectRP[k];
        objectRP[k] = v;
      });
    });
    Logger.debug("data in updateRecordsReplaceOP method", staleData);
    setRecordsReplaceOP([...staleData]);
  };

  const getOperationMember = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
    try {
      let url = generateUrl();
      const response = await privateAxios.get(url, {
        signal: controller.signal,
      });

      setTotalRecordsReplaceOP(parseInt(response.headers["x-total-count"]));
      Logger.debug("Response from operation member api get", response);

      updateRecordsReplaceOP(response.data.filter((data) => data._id !== id));
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      Logger.debug("Error from operation member-------", error);
    }
  };

  const fetchOperationMember = async (isMounted, controller) => {
    try {
      const response = await privateAxios.get(GET_OPERATION_MEMBER_BY_ID + id, {
        signal: controller.signal,
      });
      Logger.debug("response from fetch sub admin by id", response);
      setOperationMemberReplaceOP(response.data);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      catchError(
        error,
        setToasterDetails,
        myRef,
        navigate,
        "/users/operation-members"
      );
    }
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    makeApiCallReplaceOP && getOperationMember(isMounted, controller);
    Logger.debug("makeApiCallReplaceOP", makeApiCallReplaceOP);
    Logger.debug("inside use Effect");
    fetchOperationMember(isMounted, controller);

    return () => {
      isMounted = false;
      clearTimeout(searchTimeoutReplaceOP);
      controller.abort();
    };
  }, [
    opListPage,
    rowsPerPageReplaceOP,
    orderByReplaceOP,
    orderReplaceOP,
    makeApiCallReplaceOP,
  ]);

  const handleTableTesterPageChange = (newPage) => {
    Logger.debug("new Page", newPage);
    setOPPage(newPage);
  };

  //rows per opListPage change handler
  const handleTableTesterRowsPerPageChange = (event) => {
    setRowsPerPageReplaceOP(parseInt(event.target.value, 10));
    setOPPage(1);
  };

  const replaceUser = async () => {
    try {
      setdisableSubmit(true);
      const response = await privateAxios.post(
        REPLACE_SUB_ADMIN + "replace",

        {
          replacingTo: id,

          replacingWith: selectedUserReplaceOP,
        }
      );
      if (response.status == 201) {
        Logger.debug(
          selectedOperationMember[0].name +
            " has replaced " +
            operationMemberReplaceOP.name +
            " successfully!"
        );
        setToasterDetails(
          {
            titleMessage: "Success",
            descriptionMessage:
              selectedOperationMember[0].name +
              " has replaced " +
              operationMemberReplaceOP.name +
              " successfully!",
            messageType: "success",
          },
          () => myRef.current()
        );
        setOpen(false);
        setTimeout(() => {
          navigate("/users/operation-members", { state: 0 });
        }, 3000);
      }
    } catch (error) {
      setdisableSubmit(false);
      Logger.debug("error from replace user");

      catchError(
        error,
        setToasterDetails,
        myRef,
        navigate,
        "/users/operation-members",
        0
      );
    }
  };
  const [open, setOpen] = useState(false);

  const handleYes = () => {
    Logger.debug(
      "Yes replcae" + id + " replace id with",
      selectedUserReplaceOP
    );
    replaceUser();
  };
  const handleNo = () => {
    Logger.debug("No replcae");
    navigate("/users/operation-members", { state: 0 });
  };
  const openReplaceDailogBox = () => {
    setOpen(true);
  };
  const selectSingleUser = (opId) => {
    Logger.debug("select single user---", opId);
    setSelectedUserReplaceOP(opId);
    setSelectedOperationMember({
      ...recordsReplaceOP.filter(
        (data) => data._id === opId ?? { name: data.name }
      ),
    });
  };
  const onKeyDownChangeHandler = (e) => {
    if (e.key === "Enter") {
      setMakeApiCallReplaceOP(true);
      setOPPage(1);
    }
  };
  return (
    <div className="page-wrapper">
      <Toaster
        myRef={myRef}
        messageType={toasterDetails.messageType}
        descriptionMessage={toasterDetails.descriptionMessage}
        titleMessage={toasterDetails.titleMessage}
      />
      <DialogBox
        title={
          <p>
            Replace & Delete Operation Member "{operationMemberReplaceOP?.name}"
          </p>
        }
        info1={
          <p>
            On replacing an operation member, the complete ownership would get
            transferred to the new operation member.
          </p>
        }
        info2={
          <p>
            Do you still want to replace
            <b> {operationMemberReplaceOP.name} </b>?{" "}
          </p>
        }
        primaryButtonText="Yes"
        secondaryButtonText="No"
        onPrimaryModalButtonClickHandler={handleYes}
        onSecondaryModalButtonClickHandler={handleNo}
        openModal={open}
        setOpenModal={setOpen}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link
                to="/users/operation-members"
                state={params["*"].includes("pending") ? 1 : 0}
              >
                Operation Member{" "}
                {params["*"].includes("pending") ? "(Pending)" : "(Onboarded)"}
              </Link>
            </li>
            <li>
              <Link to={`/users/operation-member/view-operation-member/${id}`}>
                View Operation Member
              </Link>
            </li>
            <li>Replace & Delete Operation Member</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header flex-between ">
            <h2 className="heading2">Replace & Delete Operation Member</h2>

            <div className="member-filter-left">
              {/* <div className="tertiary-btn-blk"> */}
              <div className="searchbar">
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => onSearchChangeHandlerReplaceOP(e)}
                  onKeyDown={onKeyDownChangeHandler}
                  name="search"
                />
                <button type="submit">
                  <i className="fa fa-search"></i>
                </button>
              </div>
              {/* </div> */}
            </div>
          </div>

          <div className="member-info-wrapper table-content-wrap replace-admin-table">
            <div className="member-data-sect">
              <TableComponent
                tableHead={replaceOperationMemberTableHead}
                records={recordsReplaceOP}
                handleChangePage1={handleTableTesterPageChange}
                handleChangeRowsPerPage1={handleTableTesterRowsPerPageChange}
                page={opListPage}
                rowsPerPage={rowsPerPageReplaceOP}
                totalRecords={totalRecordsReplaceOP}
                orderBy={orderByReplaceOP}
                order={orderReplaceOP}
                setOrder={setOrderReplaceOP}
                setOrderBy={setOrderByReplaceOP}
                selected={selectedReplaceOP}
                setSelected={setSelectedReplaceOP}
                setCheckBoxes={false}
                setSingleSelect={true}
                handleSingleUserSelect={selectSingleUser}
                selectedUser={selectedUserReplaceOP}
              />
            </div>
          </div>
          <div className="form-btn flex-between add-members-btn replace-cgf-admin-btnblk">
            <button
              onClick={() => navigate("/users/operation-members", { state: 0 })}
              className="secondary-button mr-10"
            >
              Cancel
            </button>
            <button
              disabled={selectedUserReplaceOP === "" || disableSubmit}
              onClick={openReplaceDailogBox}
              className="primary-button add-button replace-assign-btn"
            >
              Replace & Delete
            </button>
          </div>
        </div>
      </section>
    </div>
    // </section>
    // </div>
  );
};

export default ReplaceOperationMember;
