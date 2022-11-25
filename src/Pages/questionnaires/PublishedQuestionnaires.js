import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import TableComponent from "../../components/TableComponent";
import { privateAxios } from "../../api/axios";
import Loader2 from "../../assets/Loader/Loader2.svg";
import { useSelector } from "react-redux";
import { ADD_QUESTIONNAIRE } from "../../api/Url";
const PublishedQuestionnaires = ({
    makeApiCall,
    setMakeApiCall,
    search,
    searchTimeout,
    setSearch,
}) => {
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
        {
            id: "createdAt",
            width: "30%",
            disablePadding: false,
            label: "Created At",
        },
    ];

    const keysOrder = ["_id", "title", "uuid", "createdAt"];

    //code of tablecomponent
    const [pagePublishedQuestionnaire, setPagePublishedQuestionnaire] =
        useState(1);
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
        data.forEach((object) => {
            delete object["updatedAt"];

            delete object["__v"];

            // delete object["uuid"];
            // delete object["createdAt"];
            delete object["isDraft"];
            delete object["isPublished"];
            delete object["vNo"];
            // delete object[""];
            // delete object["title"];
            // delete object["updatedAt"];
            // object["uuid"] = object["uuid"];
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
        setRecordsPublishedQuestionnaire([...data]);
    };

    const generateUrl = () => {
        console.log("Search", search);
        let url = `${ADD_QUESTIONNAIRE}?page=${pagePublishedQuestionnaire}&size=${rowsPerPagePublishedQuestionnaire}&orderBy=${orderByPublishedQuestionnaire}&order=${orderPublishedQuestionnaire}`;
        if (search?.length >= 3) url += `&search=${search}`;

        return url;
    };

    const userAuth = useSelector((state) => state?.user?.userObj);
    const privilege = useSelector((state) => state?.user?.privilege);

    const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
    let privilegeArray =
        userAuth?.roleId?.name === "Super Admin"
            ? []
            : Object.values(privilege?.privileges);
    // let privilegeArray = privilege ? Object.values(privilege?.privileges) : [];
    let moduleAccesForMember = privilegeArray
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
    console.log(
        "module access member in view member",
        moduleAccesForMember[0]?.questionnaire
    );

    const getPublishedQuestionnaire = async (
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
            setTotalRecordsPublishedQuestionnaire(
                parseInt(response.headers["x-total-count"])
            );
            console.log("Response from sub admin api get", response);

            updateRecords([...response.data]);
            setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            console.log("Error from questionnaire-------", error);

            if (error?.response?.status == 401) {
                navigate("/login");
            }
            setIsLoading(false);
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
        console.log("id", uuid);
        return navigate(`/questionnaires/preview-questionnaire/${uuid}`);
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCall && getPublishedQuestionnaire(isMounted, controller);
        console.log("makeApiCall", makeApiCall);
        console.log("inside use Effect");
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
            <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
                {isLoading ? (
                    <div className="loader-blk">
                        <img src={Loader2} alt="Loading" />
                    </div>
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
                        onClickVisibilityIconHandler1={
                            onClickVisibilityIconHandler
                        }
                        order={orderPublishedQuestionnaire}
                        setOrder={setOrderPublishedQuestionnaire}
                        setOrderBy={setOrderByPublishedQuestionnaire}
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
};

export default PublishedQuestionnaires;
