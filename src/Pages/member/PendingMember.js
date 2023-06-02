import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logger } from "../../Logger/Logger";
import { MEMBER } from "../../api/Url";
import { privateAxios } from "../../api/axios";
import TableComponent from "../../components/TableComponent";
import Loader from "../../utils/Loader";

const tableHead = [
  {
    id: "name",
    // width: "30%",
    disablePadding: false,
    label: "Company",
  },
  {
    id: "representativeName",
    disablePadding: false,
    label: "Representative",
  },
  {
    id: "representativeEmail",
    disablePadding: false,
    label: "Email",
  },
  {
    id: "companyType",
    disablePadding: false,
    label: "Company Type",
  },
  {
    id: "createdBy",
    disablePadding: false,
    // width: "20%",
    label: "Created By",
  },
  {
    id: "createdAt",
    disablePadding: false,
    label: "Created At",
  },
];

const PendingMember = ({
  pendingPage,
  setPendingPage,
  makeApiCallMemberList,
  searchMember,
  searchTimeoutMemberList,
  setToasterDetailsMemberList,
  memberRef,
  checkViewAccess,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Table Render State
  const [rowsPerPagePending, setRowsPerPagePending] = useState(10);
  const [orderPending, setOrderPending] = React.useState("desc");
  const [orderByPending, setOrderByPending] = React.useState("");
  const [recordsPending, setRecordsPending] = React.useState([]);
  const [totalRecordsPending, setTotalRecordsPending] = React.useState(0);

  const keysOrder = [
    "_id",
    "companyName",
    "name",
    "email",
    "companyType",
    "createdBy",
    "createdAt",
  ];

  //page change method for pending tab
  const pendingPageChange = (newPage) => {
    setPendingPage(newPage);
  };

  const updatePendingRecords = (data) => {
    Logger.debug("data before update----", data);

    let staleData = data;
    staleData.forEach((pendingMember) => {
      pendingMember["email"] = pendingMember?.invite?.data?.email ?? "";
      pendingMember["name"] = pendingMember?.invite?.data?.name ?? "";
      pendingMember["createdAt"] = new Date(
        pendingMember["invite"]["createdAt"]
      ).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      delete pendingMember["invite"];
      keysOrder.forEach((k) => {
        const v = pendingMember[k];
        delete pendingMember[k];
        pendingMember[k] = v;
      });
    });
    Logger.debug("data in updaterecords method in pending method", staleData);
    // setRecordsForPendingOperationMemberTab([...staleData]);
    setRecordsPending(staleData);
  };
  // rows per page method for pending tab
  const rowsPerPageChange = (event) => {
    Logger.debug("rows per page", event);
    setRowsPerPagePending(parseInt(event.target.value, 10));
    setPendingPage(1);
  };

  const generateUrlForPendingTab = () => {
    let url = `${MEMBER}/pending/list?page=${pendingPage}&size=${rowsPerPagePending}&orderBy=${orderByPending}&order=${orderPending}`;
    if (searchMember.length > 0) url += `&search=${searchMember}`;
    return url;
  };

  const onRowClickHandler = (id) => {
    return navigate(`/users/members/view-member/pending/${id}`);
  };
  const getPendingMember = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
    try {
      let url = generateUrlForPendingTab();
      setLoading(true);
      const response = await privateAxios.get(
        url,

        {
          signal: controller.signal,
        }
      );
      setTotalRecordsPending(parseInt(response.headers["x-total-count"]));
      updatePendingRecords(response?.data);

      //   setIsPendingOperationMemberLoading(false);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      //   setIsPendingOperationMemberLoading(false);

      Logger.debug(
        "Error from get all pending operation member  tab table-------",
        error
      );
      if (error?.response?.status == 401) {
        isMounted &&
          setToasterDetailsMemberList(
            {
              titleMessage: "Oops!",
              descriptionMessage: "Session Timeout: Please login again",
              messageType: "error",
            },
            () => memberRef.current()
          );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (error?.response?.status === 403) {
        isMounted &&
          setToasterDetailsMemberList(
            {
              titleMessage: "Oops!",
              descriptionMessage: error?.response?.data?.message
                ? error?.response?.data?.message
                : "Oops! Something went wrong. Please try again later.",
              messageType: "error",
            },
            () => memberRef.current()
          );
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
        isMounted &&
          setToasterDetailsMemberList(
            {
              titleMessage: "Error",
              descriptionMessage:
                error?.response?.data?.message &&
                typeof error.response.data.message === "string"
                  ? error.response.data.message
                  : "Oops! Something went wrong. Please try again later.",

              messageType: "error",
            },
            () => memberRef.current()
          );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    makeApiCallMemberList && getPendingMember(isMounted, controller);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [
    makeApiCallMemberList,
    pendingPage,
    rowsPerPagePending,
    orderByPending,
    orderPending,
  ]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <TableComponent
          tableHead={tableHead}
          records={recordsPending}
          handleChangePage1={pendingPageChange}
          handleChangeRowsPerPage1={rowsPerPageChange}
          onClickVisibilityIconHandler1={onRowClickHandler}
          page={pendingPage}
          rowsPerPage={rowsPerPagePending}
          totalRecords={totalRecordsPending}
          orderBy={orderByPending}
          setOrderBy={setOrderByPending}
          order={orderPending}
          setOrder={setOrderPending}
          setCheckBoxes={false}
          onRowClick={checkViewAccess}
        />
      )}
    </>
  );
};

export default PendingMember;
