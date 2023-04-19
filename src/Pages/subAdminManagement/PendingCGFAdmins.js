import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import { ADD_SUB_ADMIN, WITHDRAW_SUB_ADMIN } from "../../api/Url";
import DialogBox from "../../components/DialogBox";
import TableComponent from "../../components/TableComponent";
import Loader from "../../utils/Loader";
import { Logger } from "../../Logger/Logger";
import { catchError } from "../../utils/CatchError";
const pendingTableColumnHead = [
  {
    id: "name",
    // width: "30%",
    disablePadding: false,
    label: "Name",
  },
  {
    id: "email",

    disablePadding: false,
    label: "Email",
  },
  {
    id: "role",

    disablePadding: false,
    label: "Role",
  },
  {
    id: "createdAt",

    disablePadding: false,
    label: "Created At",
  },

  {
    id: "action",

    disablePadding: false,
    label: "Actions",
  },
];

function PendingCGFAdmins({
  makeApiCall,
  setMakeApiCall,
  search,
  filters,
  pageForPendingTabCGFAdmin,
  setPageForPendingTabCGFAdmin,
  myRef,
  pendingCgftoasterDetails,
  setPendingCgfToasterDetails,
}) {
  const [
    openDeleteDialogBoxPendingCGFAdmin,
    setOpenDeleteDialogBoxPendingCGFAdmin,
  ] = useState(false);
  const [withdrawInviteidPendingCGFAdmin, setWithdrawInviteidPendingCGFAdmin] =
    useState("");
  const [
    withdrawInviteUserPendingCGFAdmin,
    setWithdrawInviteUserPendingCGFAdmin,
  ] = useState([]);

  // state to manage loader
  const [isPendingCgfAdmin, setIsPendingCgfAdmin] = useState(true);
  const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState(false);
  //state to hold search timeout delay
  const [searchTimeoutPendingCGFAdmin, setSearchTimeoutPendingCGFAdmin] =
    useState(null);
  //state to hold wheather to make api call or not

  const navigate = useNavigate();
  //(onboarded users/cgf-admin/ table) order in which records needs to show
 
  const [
    rowsPerPageForPendingTabCGFAdmin,
    setRowsPerPageForPendingTabCGFAdmin,
  ] = React.useState(10);
  const [orderForPendingTabCGFAdmin, setOrderForPendingTabCGFAdmin] =
    React.useState("desc");
  const [orderByForPending, setOrderByForPendingTab] =
    React.useState("createdAt");
  const [recordsForPendingTabCGFAdmin, setRecordsForPendingTabCGFAdmin] =
    React.useState([]);
  const [
    totalRecordsForPendingTabCGFAdmin,
    setTotalRecordsForPendingTabCGFAdmin,
  ] = React.useState(0);

  const pendingKeysOrder = [
    "_id",
    "name",
    "email",
    "role",
    "createdAt",
    // "token",
  ];
  const updatePendingRecordsCGFAdmin = (data) => {
    Logger.debug("data before update----", data);

    let staleData = data;
    staleData.forEach((object) => {
      delete object["updatedAt"];
      delete object["data"]["description"];
      delete object["data"]["countryCode"];
      delete object["data"]["isDeleted"];
      delete object["data"]["isReplaced"];
      delete object["__v"];
      delete object["data"]["password"];
      delete object["data"]["roleId"];
      delete object["data"]["salt"];
      delete object["data"]["uuid"];
      delete object["data"]["phoneNumber"];
      delete object["token"];
      delete object["tokenExpiry"];
      delete object["tokenType"];

      object["createdAt"] = new Date(object["createdAt"]).toLocaleDateString(
        "en-US",
        {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }
      );

      object["role"] = object["subRole"][0]?.name;
      object["name"] = object["data"]["name"];
      object["email"] = object["data"].email;
      delete object["createdBy"];
      delete object["subRole"];
      delete object["data"];
      delete object["memberData"];

      pendingKeysOrder.forEach((k) => {
        const v = object[k];
        delete object[k];
        object[k] = v;
      });
    });
    Logger.debug("data in updaterecords method in pending method", staleData);
    setRecordsForPendingTabCGFAdmin([...staleData]);
  };

  //page change method for pending tab
  const handlePendingTablePageChangeCGFAdmin = (newPage) => {
    setPageForPendingTabCGFAdmin(newPage);
  };

  // rows per page method for pending tab
  const handleRowsPerPageChangeForPendingTabCGFAdmin = (event) => {
    Logger.debug("rows per page", event);
    setRowsPerPageForPendingTabCGFAdmin(parseInt(event.target.value, 10));
    setPageForPendingTabCGFAdmin(1);
  };

  //  on click delete icon open delete modal
  const onClickDeleteIconHandlerCGFAdmin = async (id) => {
    Logger.debug("id for delete", id);
    setOpenDeleteDialogBoxPendingCGFAdmin(true);
    setWithdrawInviteidPendingCGFAdmin(id);
    Logger.debug("records: ", recordsForPendingTabCGFAdmin);
    const withdrawCgfAdmin = recordsForPendingTabCGFAdmin.filter(
      (user) => user?._id === id
    );
    Logger.debug("Withdraw user", withdrawCgfAdmin);
    setWithdrawInviteUserPendingCGFAdmin([...withdrawCgfAdmin]);
  };

  const withdrawInviteByIdCGFAdmin = async () => {
    try {
      const response = await privateAxios.delete(
        WITHDRAW_SUB_ADMIN + withdrawInviteidPendingCGFAdmin
      );
      if (response.status == 200) {
        Logger.debug("user invite withdrawn successfully");
        setPendingCgfToasterDetails(
          {
            titleMessage: "Success",
            descriptionMessage: response?.data?.message,
            messageType: "success",
          },
          () => myRef.current()
        );
        getSubAdminPendingCGFAdmin();
        setOpenDeleteDialogBoxPendingCGFAdmin(false);
      }
    } catch (error) {
      catchError(error, setPendingCgfToasterDetails, myRef, navigate);
      // if (error?.response?.status == 401) {
      //     setPendingCgfToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage:
      //                 "Session Timeout: Please login again",
      //             messageType: "error",
      //         },
      //         () => myRef.current()
      //     );
      //     setTimeout(() => {
      //         navigate("/login");
      //     }, 3000);
      // } else if (error?.response?.status === 403) {
      //     setPendingCgfToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage: error?.response?.data?.message
      //                 ? error?.response?.data?.message
      //                 : "Something went wrong",
      //             messageType: "error",
      //         },
      //         () => myRef.current()
      //     );
      //     setTimeout(() => {
      //         navigate("/home");
      //     }, 3000);
      // } else {
      //     setPendingCgfToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage: error?.response?.data?.message
      //                 ? error?.response?.data?.message
      //                 : "Something went wrong",
      //             messageType: "error",
      //         },
      //         () => myRef.current()
      //     );
      // }
      Logger.debug("error from withdrawInvite id", error);
    }
  };

  // url for pending tab
  const generateUrlForPendingTabCGFAdmin = () => {
    Logger.debug("filters", filters);
    Logger.debug("Search", search);
    let url = `${ADD_SUB_ADMIN}/pending/list?page=${pageForPendingTabCGFAdmin}&size=${rowsPerPageForPendingTabCGFAdmin}&orderBy=${orderByForPending}&order=${orderForPendingTabCGFAdmin}`;

    if (search) url += `&search=${search}`;

    return url;
  };

  const getSubAdminPendingCGFAdmin = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
    try {
      let url = generateUrlForPendingTabCGFAdmin();
      setIsPendingCgfAdmin(true);
      const response = await privateAxios.get(url, {
        signal: controller.signal,
      });

      setTotalRecordsForPendingTabCGFAdmin(
        parseInt(response.headers["x-total-count"])
      );
      Logger.debug(
        "Response from sub admin api get for pending tab table",
        response
      );

      updatePendingRecordsCGFAdmin(response.data);
      setIsPendingCgfAdmin(false);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      catchError(error, setPendingCgfToasterDetails, myRef, navigate);
      // if (error?.response?.status == 401) {
      //     setPendingCgfToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage:
      //                 "Session Timeout: Please login again",
      //             messageType: "error",
      //         },
      //         () => myRef.current()
      //     );
      //     setTimeout(() => {
      //         navigate("/login");
      //     }, 3000);
      // } else if (error?.response?.status === 403) {
      //     setPendingCgfToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage: error?.response?.data?.message
      //                 ? error?.response?.data?.message
      //                 : "Something went wrong",
      //             messageType: "error",
      //         },
      //         () => myRef.current()
      //     );
      //     setTimeout(() => {
      //         navigate("/home");
      //     }, 3000);
      // } else {
      //     isMounted &&
      //         setPendingCgfToasterDetails(
      //             {
      //                 titleMessage: "Error",
      //                 descriptionMessage:
      //                     error?.response?.data?.message &&
      //                     typeof error.response.data.message === "string"
      //                         ? error.response.data.message
      //                         : "Something went wrong.",

      //                 messageType: "error",
      //             },
      //             () => myRef.current()
      //         );
      //     setIsPendingCgfAdmin(false);
      // }

      Logger.debug("Error from getSubAdmin pending tab table-------", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    makeApiCall && getSubAdminPendingCGFAdmin(isMounted, controller);
    Logger.debug("makeApiCall", makeApiCall);
    Logger.debug("inside use Effect");
    return () => {
      isMounted = false;
      clearTimeout(searchTimeoutPendingCGFAdmin);
      controller.abort();
    };
  }, [
    filters,
    makeApiCall,

    setMakeApiCall,
    searchTimeoutPendingCGFAdmin,
    pageForPendingTabCGFAdmin,
    rowsPerPageForPendingTabCGFAdmin,
    orderByForPending,
    orderForPendingTabCGFAdmin,
  ]);
  {
    Logger.debug("makeApiCall outside UseEffect ", makeApiCall);
  }
  return (
    <>
      <DialogBox
        title={
          <p>
            Withdraw "
            {withdrawInviteUserPendingCGFAdmin &&
              `${withdrawInviteUserPendingCGFAdmin[0]?.name}`}
            's" Invitation
          </p>
        }
        info1={
          <p>
            On withdrawal, CGF admin will not be able to verify their account.
          </p>
        }
        info2={<p>Do you want to withdraw the invitation?</p>}
        primaryButtonText={"Yes"}
        secondaryButtonText={"No"}
        onPrimaryModalButtonClickHandler={() => {
          withdrawInviteByIdCGFAdmin();
        }}
        onSecondaryModalButtonClickHandler={() => {
          setOpenDeleteDialogBoxPendingCGFAdmin(false);
        }}
        openModal={openDeleteDialogBoxPendingCGFAdmin}
        setOpenModal={setOpenDeleteDialogBoxPendingCGFAdmin}
      />
      {isPendingCgfAdmin ? (
        <Loader />
      ) : (
        <TableComponent
          tableHead={pendingTableColumnHead}
          records={recordsForPendingTabCGFAdmin}
          handleChangePage1={handlePendingTablePageChangeCGFAdmin}
          handleChangeRowsPerPage1={
            handleRowsPerPageChangeForPendingTabCGFAdmin
          }
          page={pageForPendingTabCGFAdmin}
          rowsPerPage={rowsPerPageForPendingTabCGFAdmin}
          totalRecords={totalRecordsForPendingTabCGFAdmin}
          orderBy={orderByForPending}
          icons={["delete"]}
          // onClickVisibilityIconHandler1={
          //     onClickDeleteIconHandlerCGFAdmin
          // }
          onClickDeleteIconHandler1={onClickDeleteIconHandlerCGFAdmin}
          order={orderForPendingTabCGFAdmin}
          setOrder={setOrderForPendingTabCGFAdmin}
          setOrderBy={setOrderByForPendingTab}
          setCheckBoxes={false}
          onRowClick={false}
        />
      )}
    </>
  );
}

export default PendingCGFAdmins;
