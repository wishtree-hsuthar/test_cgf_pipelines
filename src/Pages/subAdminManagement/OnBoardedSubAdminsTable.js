import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import { ADD_SUB_ADMIN } from "../../api/Url";
import TableComponent from "../../components/TableComponent";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import Loader from "../../utils/Loader";
import { Logger } from "../../Logger/Logger";
const onBoardedTableColumnHead = [
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
    label: "Onboarded On",
  },
  {
    id: "status",

    disablePadding: false,
    label: "Status",
  },
  // {
  //     id: "action",

  //     disablePadding: false,
  //     label: "Action",
  // },
];

function OnBoardedSubAdminsTable({
  page,
  setPage,
  makeApiCall,
  setMakeApiCall,
  search,
}) {
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("");
  const [records, setRecords] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [selected, setSelected] = useState([]);
  const [isOnboardedCgfAdminLoading, setIsOnboardedCgfAdminLoading] =
    useState(true);

  //state to hold search timeout delay
  //state to hold wheather to make api call or not
  // const [makeApiCall, setMakeApiCall] = useState(true);
  //Refr for Toaster
  const onBoardedCGFAdminRef = React.useRef();
  //Toaster Message setter
  const [onBoardedCgfAdmintoasterDetails, setonBoardedCgfAdmintoasterDetails] =
    useCallbackState({
      titleMessage: "",
      descriptionMessage: "",
      messageType: "success",
    });

  const updateRecords = (data) => {
    const onboardedKeysOrder = [
      "_id",
      "name",
      "email",
      "role",
      "createdAt",
      "isActive",
    ];

    Logger.debug("data before update----", data);

    let staleData = data;
    staleData.forEach((onboardedCGFAdmin) => {
      delete onboardedCGFAdmin["updatedAt"];
      delete onboardedCGFAdmin["updatedBy"];
      delete onboardedCGFAdmin["createdBy"];
      delete onboardedCGFAdmin["description"];
      delete onboardedCGFAdmin["countryCode"];
      delete onboardedCGFAdmin["isDeleted"];
      delete onboardedCGFAdmin["isReplaced"];
      delete onboardedCGFAdmin["replacedUsers"];
      delete onboardedCGFAdmin["__v"];
      delete onboardedCGFAdmin["password"];
      delete onboardedCGFAdmin["roleId"];
      delete onboardedCGFAdmin["salt"];
      delete onboardedCGFAdmin["uuid"];
      delete onboardedCGFAdmin["phoneNumber"];
      delete onboardedCGFAdmin["isCGFAdmin"];
      onboardedCGFAdmin["createdAt"] = new Date(
        onboardedCGFAdmin["createdAt"]
      ).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      onboardedCGFAdmin["role"] = onboardedCGFAdmin?.subRole[0]?.name ?? "N/A";
      delete onboardedCGFAdmin["subRole"];
      delete onboardedCGFAdmin["subRoleId"];

      onboardedKeysOrder.forEach((k) => {
        const v = onboardedCGFAdmin[k];
        delete onboardedCGFAdmin[k];
        onboardedCGFAdmin[k] = v;
      });
    });
    Logger.debug("data in updaterecords method", staleData);
    setRecords([...staleData]);
  };

  const generateUrl = () => {
    Logger.debug("Search", search);
    let url = `${ADD_SUB_ADMIN}/list/?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;

    if (search) url += `&search=${search}`;

    return url;
  };
  const getSubAdmin = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
    try {
      let url = generateUrl();
      setIsOnboardedCgfAdminLoading(true);
      const onBoardedCGFAdmin = await privateAxios.get(url, {
        signal: controller.signal,
      });
      setTotalRecords(parseInt(onBoardedCGFAdmin.headers["x-total-count"]));
      Logger.debug("Response from sub admin api get", onBoardedCGFAdmin);

      updateRecords([...onBoardedCGFAdmin.data]);
      setIsOnboardedCgfAdminLoading(false);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      Logger.debug("Error from getSubAdmin-------", error);

      if (error?.response?.status == 401) {
        setonBoardedCgfAdmintoasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage: "Session Timeout: Please login again",
            messageType: "error",
          },
          () => onBoardedCGFAdminRef.current()
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (error?.response?.status === 403) {
        setonBoardedCgfAdmintoasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage: error?.response?.data?.message
              ? error?.response?.data?.message
              : "Oops! Something went wrong. Please try again later.",
            messageType: "error",
          },
          () => onBoardedCGFAdminRef.current()
        );
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
        setonBoardedCgfAdmintoasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage: error?.response?.data?.message,
            messageType: "error",
          },
          () => onBoardedCGFAdminRef.current()
        );
      }
      setIsOnboardedCgfAdminLoading(false);
    }
  };
  const handleTablePageChange = (newPage) => {
    setPage(newPage);
  };

  // rows per page method for onboarded tab
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  // on click eye icon to  navigate view page
  const onClickVisibilityIconHandler = (id) => {
    Logger.debug("id", id);
    return navigate(`view-cgf-admin/${id}`);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    makeApiCall && getSubAdmin(isMounted, controller);
    Logger.debug("makeApiCall", makeApiCall);
    Logger.debug("inside use Effect");
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, rowsPerPage, orderBy, order, makeApiCall, setMakeApiCall]);
  return (
    <>
      <Toaster
        myRef={onBoardedCGFAdminRef}
        titleMessage={onBoardedCgfAdmintoasterDetails.titleMessage}
        descriptionMessage={onBoardedCgfAdmintoasterDetails.descriptionMessage}
        messageType={onBoardedCgfAdmintoasterDetails.messageType}
      />
      {isOnboardedCgfAdminLoading ? (
        <Loader />
      ) : (
        <TableComponent
          tableHead={onBoardedTableColumnHead}
          records={records}
          handleChangePage1={handleTablePageChange}
          handleChangeRowsPerPage1={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRecords={totalRecords}
          orderBy={orderBy}
          // icons={["visibility"]}
          onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
          order={order}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          setCheckBoxes={false}
          setSelected={setSelected}
          selected={selected}
          onRowClick={true}
        />
      )}
    </>
  );
}

export default OnBoardedSubAdminsTable;
