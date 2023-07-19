import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import { ADD_SUB_ADMIN } from "../../api/Url";
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
];

function PendingCGFAdmins({
  makeApiCall,
  setMakeApiCall,
  search,

  pageForPendingTabCGFAdmin,
  setPageForPendingTabCGFAdmin,
  myRef,
  setPendingCgfToasterDetails,
}) {
  // state to manage loader
  const [isPendingCgfAdmin, setIsPendingCgfAdmin] = useState(true);
  //state to hold search timeout delay

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
    Logger.info(`Pending cgf admin - updatePendingRecordsCGFAdmin handler `);

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

      object["role"] = object?.subRole?.[0]?.name ?? "N/A";
      object["name"] = object?.data?.name ?? "N/A";
      object["email"] = object?.data?.email ?? "N/A";
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
    setRecordsForPendingTabCGFAdmin([...staleData]);
  };

  //page change method for pending tab
  const handlePendingTablePageChangeCGFAdmin = (newPage) => {
    setPageForPendingTabCGFAdmin(newPage);
  };

  // rows per page method for pending tab
  const handleRowsPerPageChangeForPendingTabCGFAdmin = (event) => {
    Logger.info(
      `Pending cgf admin - handleRowsPerPageChangeForPendingTabCGFAdmin handler`
    );
    setRowsPerPageForPendingTabCGFAdmin(parseInt(event.target.value, 10));
    setPageForPendingTabCGFAdmin(1);
  };

  // url for pending tab
  const generateUrlForPendingTabCGFAdmin = () => {
    let url = `${ADD_SUB_ADMIN}/pending/list?page=${pageForPendingTabCGFAdmin}&size=${rowsPerPageForPendingTabCGFAdmin}&orderBy=${orderByForPending}&order=${orderForPendingTabCGFAdmin}`;

    if (search) url += `&search=${search}`;

    return url;
  };

  const onClickVisibilityIconHandler = (id) => {
    return navigate(`/users/cgf-admin/pending/view-cgf-admin/${id}`);
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
      Logger.info(`Pending cgf admin - getSubAdminPendingCGFAdmin handler`);

      updatePendingRecordsCGFAdmin(response.data);
      setIsPendingCgfAdmin(false);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      catchError(error, setPendingCgfToasterDetails, myRef, navigate);

      Logger.info(
        `Pending cgf admin - getSubAdminPendingCGFAdmin handler catch error ${error?.response?.data?.message}`
      );
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    makeApiCall && getSubAdminPendingCGFAdmin(isMounted, controller);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [
    makeApiCall,
    setMakeApiCall,
    pageForPendingTabCGFAdmin,
    rowsPerPageForPendingTabCGFAdmin,
    orderByForPending,
    orderForPendingTabCGFAdmin,
  ]);

  return (
    <>
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
          onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
          order={orderForPendingTabCGFAdmin}
          setOrder={setOrderForPendingTabCGFAdmin}
          setOrderBy={setOrderByForPendingTab}
          setCheckBoxes={false}
          onRowClick={true}
        />
      )}
    </>
  );
}

export default PendingCGFAdmins;
