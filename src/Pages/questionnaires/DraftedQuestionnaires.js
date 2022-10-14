import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import TableComponent from "../../components/TableComponent";
import { privateAxios } from "../../api/axios";
import Loader2 from "../../assets/Loader/Loader2.svg";
import { useSelector } from "react-redux";

function DraftedQuestionnaires({
    makeApiCall,
    setMakeApiCall,
    search,
    searchTimeout,
    setSearch,
}) {
    const [questionnaire, setQuestionnaire] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    //state to hold search timeout delay

    const tableHead = [
        {
            id: "title",
            width: "30%",
            disablePadding: false,
            label: "Questionnaire Title",
        },
    ];

    const keysOrder = ["_id", "title", "uuid"];

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
    const [selectedDraftedQuestionnaire, setSelectedDraftedQuestionnaire] =
        useState([]);

    const updateRecords = (data) => {
        data.forEach((object) => {
            delete object["updatedAt"];

            delete object["__v"];

            // delete object["uuid"];
            delete object["createdAt"];
            delete object["isDraft"];
            delete object["isPublished"];
            // delete object["title"];
            // delete object["updatedAt"];
            // object["uuid"] = object["uuid"];
            keysOrder.forEach((k) => {
                const v = object[k];
                delete object[k];
                object[k] = v;
            });
        });
        setRecordsDraftedQuestionnaire([...data]);
    };
    const generateUrl = () => {
        // console.log("Search", search);
        let url = `http://localhost:3000/api/questionnaires/drafted?page=${pageDraftedQuestionnaire}&size=${rowsPerPageDraftedQuestionnaire}&orderBy=${orderByDraftedQuestionnaire}&order=${orderDraftedQuestionnaire}`;
        if (search?.length >= 3) url += `&search=${search}`;

        return url;
    };

    const privilege = useSelector((state) => state?.user?.privilege);
    const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
    let privilegeArray = privilege ? Object.values(privilege?.privileges) : [];
    let moduleAccesForMember = privilegeArray
        .filter((data) => data?.moduleId?.name === "Members")
        .map((data) => ({
            member: {
                list: data?.list,
                view: data?.view,
                edit: data?.edit,
                delete: data?.delete,
                add: data?.add,
            },
        }));
    // console.log(
    //     "module access member in view member",
    //     moduleAccesForMember[0]?.member
    // );

    const getQuestionnaire = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrl();
            setIsLoading(true);
            const response = await privateAxios.get(url, {
                signal: controller.signal,
            });
            // console.log(response.headers["x-total-count"]);
            setTotalRecordsDraftedQuestionnaire(
                parseInt(response.headers["x-total-count"])
            );
            // console.log("Response from sub admin api get", response);

            updateRecords([...response.data]);
            setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            // console.log("Error from questionnaire-------", error);

            if (error?.response?.status == 401) {
                navigate("/login");
            }
            setIsLoading(false);
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
        // console.log("id", uuid);
        return navigate(`/questionnaires/add-questionnaire/${uuid}`);
    };
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCall && getQuestionnaire(isMounted, controller);
        // console.log("makeApiCall", makeApiCall);
        // console.log("inside use Effect");
        return () => {
            isMounted = false;
            clearTimeout(searchTimeout);
            controller.abort();
        };
    }, [
        pageDraftedQuestionnaire,
        rowsPerPageDraftedQuestionnaire,
        orderByDraftedQuestionnaire,
        orderByDraftedQuestionnaire,

        makeApiCall,
        setMakeApiCall,
        searchTimeout,
    ]);
    return (
        <>
            <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
                {isLoading ? (
                    <div className="loader-blk">
                        <img src={Loader2} alt="Loading" />
                    </div>
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
                                : moduleAccesForMember[0]?.member?.view
                        }
                        isQuestionnare={true}
                    />
                )}
            </div>
        </>
    );
}

export default DraftedQuestionnaires;
