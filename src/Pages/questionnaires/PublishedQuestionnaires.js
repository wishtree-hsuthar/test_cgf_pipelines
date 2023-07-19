import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/TableComponent";
import { privateAxios } from "../../api/axios";
import { useSelector } from "react-redux";
import { ADD_QUESTIONNAIRE } from "../../api/Url";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import Loader from "../../utils/Loader";
import { Logger } from "../../Logger/Logger";
const PublishedQuestionnaires = ({
  pagePublishedQuestionnaire,
  setPagePublishedQuestionnaire,
  makeApiCall,
  setMakeApiCall,
  search,
  searchTimeout,
  setSearch,
}) => {
  const [isPublishedQuestionnaireLoading, setIsPublishedQuestionnaireLoading] =
    useState(false);

  const navigate = useNavigate();
  //state to hold search timeout delay

  const tableHead = [
    {
      id: "title",
      //   width: "30%",
      disablePadding: false,
      label: "Questionnaire Title",
    },
    {
      id: "createdAt",
      //   width: "30%",
      disablePadding: false,
      label: "Created At",
    },

    {
      id: "isActive",
      disablePadding: false,
      label: "Status",
    },
  ];

  const questionnaireKeysOrder = [
    "_id",
    "title",
    "uuid",
    "createdAt",
    "isActive",
  ];

  //code of tablecomponent

  const [
    rowsPerPagePublishedQuestionnaire,
    setRowsPerPagePublishedQuestionnaire,
  ] = useState(10);
  const [orderPublishedQuestionnaire, setOrderPublishedQuestionnaire] =
    useState("desc");
  const [orderByPublishedQuestionnaire, setOrderByPublishedQuestionnaire] =
    useState("");
  const [recordsPublishedQuestionnaire, setRecordsPublishedQuestionnaire] =
    useState([]);
  const [
    totalRecordsPublishedQuestionnaire,
    setTotalRecordsPublishedQuestionnaire,
  ] = useState(0);
  const [selectedPublishedQuestionnaire, setSelectedPublishedQuestionnaire] =
    useState([]);

  const updateRecords = (data) => {
    data.forEach((questionnaireObject) => {
      delete questionnaireObject["updatedAt"];

      delete questionnaireObject["__v"];
      delete questionnaireObject["isDraft"];
      delete questionnaireObject["isPublished"];
      // delete questionnaireObject["isActive"]
      delete questionnaireObject["vNo"];
      questionnaireObject["createdAt"] = new Date(
        questionnaireObject["createdAt"]
      ).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      questionnaireKeysOrder.forEach((k) => {
        const v = questionnaireObject[k];
        delete questionnaireObject[k];
        questionnaireObject[k] = v;
      });
    });
    setRecordsPublishedQuestionnaire([...data]);
  };

  const generateUrl = () => {
    
    let url = `${ADD_QUESTIONNAIRE}/list?page=${pagePublishedQuestionnaire}&size=${rowsPerPagePublishedQuestionnaire}&orderBy=${orderByPublishedQuestionnaire}&order=${orderPublishedQuestionnaire}`;
    if (search?.length) url += `&search=${search}`;

    return url;
  };

  const userAuth = useSelector((state) => state?.user?.userObj);
  const privilege = useSelector((state) => state?.user?.privilege);

  const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
  let publishedQuestionnairePrivilgeArray =
    userAuth?.roleId?.name === "Super Admin"
      ? []
      : Object.values(privilege?.privileges);
  let moduleAccesForMember = publishedQuestionnairePrivilgeArray
    .filter((data) => data?.moduleId?.name === "Questionnaire")
    .map((data) => ({
      questionnaire: {
        list: data?.list,
        view: data?.view,
        edit: data?.edit,
        delete: data?.delete,
        add: data?.add,
      },
    }));
  

  const getPublishedQuestionnaire = async (
    isMounted = true,
    controller = new AbortController()
  ) => {
    try {
      let url = generateUrl();
      setIsPublishedQuestionnaireLoading(true);
      Logger.info("Questionnaire - Published Questionnaire - getPublishedQuestionnaire handler")
      const response = await privateAxios.get(url, {
        signal: controller.signal,
      });
      setTotalRecordsPublishedQuestionnaire(
        parseInt(response.headers["x-total-count"])
      );
      

      updateRecords([...response.data]);
      setIsPublishedQuestionnaireLoading(false);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      Logger.info(`Questionnaire - Published Questionnaire - fetch handler - getPublishedQuestionnaire handler ${error?.response?.data?.message}`)

      if (error.response.status === 401) {

        // Add error toaster here
        setToasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage: "Session Timeout: Please login again",
            messageType: "error",
          },
          () => questionnaireToasterRef.current()
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (error.response.status === 403) {
        setToasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage: error?.response?.data?.message
              ? error?.response?.data?.message
              : "Oops! Something went wrong. Please try again later.",
            messageType: "error",
          },
          () => questionnaireToasterRef.current()
        );
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
        setToasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage: error?.response?.data?.message
              ? error?.response?.data?.message
              : "Oops! Something went wrong. Please try again later.",
            messageType: "error",
          },
          () => questionnaireToasterRef.current()
        );
      }
      setIsPublishedQuestionnaireLoading(false);
    }
  };

  const handleTablePageChange = (newPage) => {
    setPagePublishedQuestionnaire(newPage);
  };

  // rows per page method for onboarded tab
  const handleRowsPerPageChange = (event) => {
    setRowsPerPagePublishedQuestionnaire(parseInt(event.target.value, 10));
    setPagePublishedQuestionnaire(1);
  };

  const onClickVisibilityIconHandler = (uuid) => {
  
    return navigate(`/questionnaires/preview-questionnaire/${uuid}`);
  };
  const questionnaireToasterRef = useRef();
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    makeApiCall && getPublishedQuestionnaire(isMounted, controller);
    return () => {
      isMounted = false;
      clearTimeout(searchTimeout);
      controller.abort();
    };
  }, [
    pagePublishedQuestionnaire,
    rowsPerPagePublishedQuestionnaire,
    orderByPublishedQuestionnaire,
    orderPublishedQuestionnaire,

    makeApiCall,
    setMakeApiCall,
    searchTimeout,
  ]);

  return (
    <>
      <Toaster
        messageType={toasterDetails.messageType}
        descriptionMessage={toasterDetails.descriptionMessage}
        myRef={questionnaireToasterRef}
        titleMessage={toasterDetails.titleMessage}
      />
      <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
        {isPublishedQuestionnaireLoading ? (
          <Loader />
        ) : (
          <TableComponent
            tableHead={tableHead}
            records={recordsPublishedQuestionnaire}
            handleChangePage1={handleTablePageChange}
            handleChangeRowsPerPage1={handleRowsPerPageChange}
            page={pagePublishedQuestionnaire}
            rowsPerPage={rowsPerPagePublishedQuestionnaire}
            // selected={selected}
            totalRecords={totalRecordsPublishedQuestionnaire}
            orderBy={orderByPublishedQuestionnaire}
            // icons={["visibility"]}
            onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
            order={orderPublishedQuestionnaire}
            setOrder={setOrderPublishedQuestionnaire}
            setOrderBy={setOrderByPublishedQuestionnaire}
            setCheckBoxes={false}
            onRowClick={
              SUPER_ADMIN ? true : moduleAccesForMember[0]?.questionnaire?.view
            }
            isQuestionnare={true}
          />
        )}
      </div>
    </>
  );
};

export default PublishedQuestionnaires;
