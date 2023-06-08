import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logger } from "../../Logger/Logger";
import { MEMBER } from "../../api/Url";
import TableComponent from "../../components/TableComponent";
import Loader from "../../utils/Loader";

const tableHead = [
  {
    id: "companyName",
    // width: "30%",
    disablePadding: false,
    label: "Company",
  },
  {
    id: "name",
    disablePadding: false,
    label: "Representative",
  },
  {
    id: "email",
    disablePadding: false,
    label: "Email",
  },
  {
    id: "companyType",
    disablePadding: false,
    label: "Company Type",
  },
  {
    id: "totalOperationMembers",
    disablePadding: false,
    label: "Ops. Members",
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
  {
    id: "isActive",
    disablePadding: false,
    // width: "15%",
    label: "Status",
  },
];

const OnboardedMember = ({
  onboardedPage,
  setOnboardedPage,
  makeApiCallMemberList,
  searchMember,
  searchTimeoutMemberList,
  setToasterDetailsMemberList,
  memberRef,
  checkViewAccess,
}) => {
  const navigate = useNavigate();
  // state to manage loader
  const [isMemberListLoading, setIsMemberListLoading] = useState(false);
  const keysOrder = [
    "_id",
    "companyName",
    "name",
    "email",
    "companyType",
    "totalOperationMembers",
    "createdBy",
    "createdAt",
    "isActive",
  ];

  const [memberListrowsPerPage, setMemberListRowsPerPage] = useState(10);
  const [memberListOrder, setMemberListOrder] = useState("asc");
  const [orderByMemberList, setOrderByMemberList] = useState("initialRender");
  const [recordsMemberList, setRecordsMemberList] = useState([]);
  const [totalRecordsMemberList, setTotalRecordsMemberList] = useState(0);

  //format recordsMemberList as backend requires
  const updateRecords = (data) => {
    data.forEach((object) => {
      delete object["address"];
      delete object["cgfActivity"];
      delete object["cgfCategory"];
      delete object["cgfOffice"];
      delete object["cgfOfficeCountry"];
      delete object["cgfOfficeRegion"];
      delete object["city"];
      delete object["corporateEmail"];
      delete object["country"];
      delete object["countryCode"];
      delete object["parentCompany"];
      delete object["phoneNumber"];
      delete object["region"];
      delete object["state"];
      delete object["updatedAt"];
      delete object["updatedBy"];
      delete object["website"];
      delete object["isDeleted"];
      delete object["isReplaced"];
      delete object["isMemberRepresentative"];
      delete object["memberRepresentativeRole"];
      delete object["__v"];
      object["createdAt"] = new Date(object["createdAt"])?.toLocaleDateString(
        "en-US",
        {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }
      );
      if (typeof object["createdBy"] === "object") {
        object.createdBy = object?.createdBy?.name ?? "N/A";
      } else {
        object.createdBy = "N/A";
      }
      if (object["representative"]) {
        object["isActive"] = object["representative"]?.isActive ?? false;
        object.email = object["representative"]?.email ?? "N/A";
        object.name = object["representative"]?.name ?? "N/A";
      } else {
        object["isActive"] = false;
        object.email = "N/A";
        object.name = "N/A";
      }

      object.totalOperationMembers =
        object["totalOperationMembers"]?.toString();
      delete object["representative"];
      delete object["memberRepresentativeId"];
      keysOrder.forEach((k) => {
        const v = object[k];
        delete object[k];
        object[k] = v;
      });
    });
    setRecordsMemberList([...data]);
  };
  const handleTablePageChange = (newPage) => {
    setOnboardedPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setMemberListRowsPerPage(parseInt(event.target.value, 10));
    setOnboardedPage(1);
  };
  const onClickVisibilityIconHandler = (id) => {
    Logger.debug("id", id);
    return navigate(`/users/members/view-member/${id}`);
  };
  const generateUrl = () => {
    const namesMappings = {
      initialRender: "",
      companyName: "name",
      name: "representativeName",
      email: "representativeEmail",
      companyType: "companyType",
      totalOperationMembers: "operationMembersCount",
      createdBy: "createdBy",
      createdAt: "createdAt",
      isActive: "status",
    };

    let url = `${MEMBER}/list?page=${onboardedPage}&size=${memberListrowsPerPage}&orderBy=${namesMappings[orderByMemberList]}&order=${memberListOrder}`;
    if (searchMember) url = url + `&search=${searchMember}`;
    return url;
  };
  const getMembers = async (isMounted, controller) => {
    try {
      let url = generateUrl();
      setIsMemberListLoading(true);
      const response = await axios.get(url, {
        signal: controller.signal,
      });
      setTotalRecordsMemberList(parseInt(response.headers["x-total-count"]));
      Logger.debug("response from backend", response);
      setIsMemberListLoading(false);
      updateRecords(response?.data);
    } catch (error) {
      Logger.debug("error from get members api - ", error);
      if (error?.code === "ERR_CANCELED") return;
      if (error?.response?.status === 401) {
        setToasterDetailsMemberList(
          {
            titleMessage: "Error",

            descriptionMessage: "Session Timeout: Please login again",

            messageType: "error",
          },
          () => memberRef.current()
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (error?.response?.status === 403) {
        setToasterDetailsMemberList(
          {
            titleMessage: "Error",

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
        setIsMemberListLoading(false);
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
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    makeApiCallMemberList && getMembers(isMounted, controller);
    return () => {
      isMounted = false;
      clearTimeout(searchTimeoutMemberList);
      controller.abort();
    };
  }, [
    onboardedPage,
    memberListrowsPerPage,
    orderByMemberList,
    memberListOrder,
    makeApiCallMemberList,
  ]);
  return (
    <>
      {isMemberListLoading ? (
        <Loader />
      ) : (
        <TableComponent
          tableHead={tableHead}
          records={recordsMemberList}
          handleChangePage1={handleTablePageChange}
          handleChangeRowsPerPage1={handleRowsPerPageChange}
          page={onboardedPage}
          rowsPerPage={memberListrowsPerPage}
          totalRecords={totalRecordsMemberList}
          orderBy={orderByMemberList}
          // icons={["visibility"]}
          onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
          order={memberListOrder}
          setOrder={setMemberListOrder}
          setOrderBy={setOrderByMemberList}
          setCheckBoxes={false}
          onRowClick={checkViewAccess}
        />
      )}
    </>
  );
};

export default OnboardedMember;
