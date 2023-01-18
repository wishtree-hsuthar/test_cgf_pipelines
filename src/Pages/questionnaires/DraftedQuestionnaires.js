import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/TableComponent";
import { privateAxios } from "../../api/axios";
import { useSelector } from "react-redux";
import { ADD_QUESTIONNAIRE } from "../../api/Url";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import Loader from "../../utils/Loader";

function DraftedQuestionnaires({
    makeApiCall,
    setMakeApiCall,
    search,
    searchTimeout,
    setSearch,
}) {
    const [isDraftedQuestionnaireLoading, setIsDraftedQuestionnaireLoading] =
        useState(false);

    const navigate = useNavigate();
    //state to hold search timeout delay

    const tableHead = [
        {
            id: "title",
            // width: "30%",
            disablePadding: false,
            label: "Questionnaire Title",
        },
        {
            id: "createdAt",
            // width: "30%",
            disablePadding: false,
            label: "Created At",
        },
        {
            id: "isActive",
            disablePadding: false,
            label: "Status",
        },
    ];

    const keysOrder = ["_id", "title", "uuid", "createdAt", "isActive"];

    //code of tablecomponent
    const [pageDraftedQuestionnaire, setPageDraftedQuestionnaire] = useState(1);
    const [
        rowsPerPageDraftedQuestionnaire,
        setRowsPerPageDraftedQuestionnaire,
    ] = useState(10);
    const [orderDraftedQuestionnaire, setOrderDraftedQuestionnaire] =
        useState("desc");
    const [orderByDraftedQuestionnaire, setOrderByDraftedQuestionnaire] =
        useState("");
    const [recordsDraftedQuestionnaire, setRecordsDraftedQuestionnaire] =
        useState([]);
    const [
        totalRecordsDraftedQuestionnaire,
        setTotalRecordsDraftedQuestionnaire,
    ] = useState(0);

    const questionnaireDraftedToasterRef = useRef();
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });

    const updateRecords = (data) => {
        data.forEach((object) => {
            delete object["updatedAt"];

            delete object["__v"];

            delete object["isDraft"];
            delete object["isPublished"];
            object["createdAt"] = new Date(
                object["createdAt"]
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
        setRecordsDraftedQuestionnaire([...data]);
    };
    const generateUrl = () => {
        let url = `${ADD_QUESTIONNAIRE}/drafted/list?page=${pageDraftedQuestionnaire}&size=${rowsPerPageDraftedQuestionnaire}&orderBy=${orderByDraftedQuestionnaire}&order=${orderDraftedQuestionnaire}`;
        if (search?.length >= 3) url += `&search=${search}`;

        return url;
    };

    const privilege = useSelector((state) => state?.user?.privilege);

    const userAuth = useSelector((state) => state?.user?.userObj);
    const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
    let draftedQuestionnairePrivilgeArray =
        userAuth?.roleId?.name === "Super Admin"
            ? []
            : Object.values(privilege?.privileges);

    let moduleAccesForMember = draftedQuestionnairePrivilgeArray
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

    const getQuestionnaire = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrl();
            setIsDraftedQuestionnaireLoading(true);
            const response = await privateAxios.get(url, {
                signal: controller.signal,
            });

            setTotalRecordsDraftedQuestionnaire(
                parseInt(response.headers["x-total-count"])
            );

            updateRecords([...response.data]);
            setIsDraftedQuestionnaireLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;

            if (error.response.status === 401) {
                console.log("Unauthorized user access");
                // Add error toaster here
                setToasterDetails(
                    {
                        titleMessage: "Oops!",
                        descriptionMessage:
                            "Session Timeout: Please login again",
                        messageType: "error",
                    },
                    () => questionnaireDraftedToasterRef.current()
                );
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            }
            setIsDraftedQuestionnaireLoading(false);
        }
    };

    const handleTablePageChange = (newPage) => {
        setPageDraftedQuestionnaire(newPage);
    };

    // rows per page method for onboarded tab
    const handleRowsPerPageChange = (event) => {
        setRowsPerPageDraftedQuestionnaire(parseInt(event.target.value, 10));
        setPageDraftedQuestionnaire(1);
    };

    const onClickVisibilityIconHandler = (uuid) => {
        return navigate(`/questionnaires/preview-questionnaire/${uuid}`);
    };
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCall && getQuestionnaire(isMounted, controller);
        return () => {
            isMounted = false;
            clearTimeout(searchTimeout);
            controller.abort();
        };
    }, [
        pageDraftedQuestionnaire,
        rowsPerPageDraftedQuestionnaire,
        orderByDraftedQuestionnaire,
        orderDraftedQuestionnaire,

        makeApiCall,
        setMakeApiCall,
        searchTimeout,
    ]);
    return (
        <>
            <Toaster
                messageType={toasterDetails.messageType}
                descriptionMessage={toasterDetails.descriptionMessage}
                myRef={questionnaireDraftedToasterRef}
                titleMessage={toasterDetails.titleMessage}
            />
            <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
                {isDraftedQuestionnaireLoading ? (
                    <Loader />
                ) : (
                    <TableComponent
                        tableHead={tableHead}
                        records={recordsDraftedQuestionnaire}
                        handleChangePage1={handleTablePageChange}
                        handleChangeRowsPerPage1={handleRowsPerPageChange}
                        page={pageDraftedQuestionnaire}
                        rowsPerPage={rowsPerPageDraftedQuestionnaire}
                        // selected={selected}
                        totalRecords={totalRecordsDraftedQuestionnaire}
                        orderBy={orderByDraftedQuestionnaire}
                        // icons={["visibility"]}
                        onClickVisibilityIconHandler1={
                            onClickVisibilityIconHandler
                        }
                        order={orderDraftedQuestionnaire}
                        setOrder={setOrderDraftedQuestionnaire}
                        setOrderBy={setOrderByDraftedQuestionnaire}
                        setCheckBoxes={false}
                        onRowClick={
                            SUPER_ADMIN
                                ? true
                                : moduleAccesForMember[0]?.questionnaire?.view
                        }
                        isQuestionnare={true}
                    />
                )}
            </div>
        </>
    );
}

export default DraftedQuestionnaires;
