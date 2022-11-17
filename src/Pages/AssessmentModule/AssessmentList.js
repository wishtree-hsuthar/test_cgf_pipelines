import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// Internal Imports
import TableComponent from "../../components/TableComponent";
// import { MEMBER } from "../api/Url";
import Loader2 from "../../assets/Loader/Loader2.svg";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
import { useSelector } from "react-redux";
import { privateAxios } from "../../api/axios";
import { ASSESSMENTS } from "../../api/Url";

const tableHead = [
    {
        id: "title",
        width: "30%",
        disablePadding: false,
        label: "Assessment Title",
    },
    {
        id: "assessmentType",
        width: "30%",
        disablePadding: false,
        label: "Assessment Type",
    },
    {
        id: "assignedMember.name",
        width: "30%",
        disablePadding: false,
        label: "Assigned Member",
    },
    {
        id: "assignedOperationMember.name",
        width: "30%",
        disablePadding: false,
        label: "Assigned To",
    },
    {
        id: "assessmentStatus",
        width: "30%",
        disablePadding: false,
        label: "Assessment Status",
    },
    {
        id: "dueDate",
        width: "30%",
        disablePadding: false,
        label: "Due Date",
    },
    {
        // id: "dueDate",
        width: "30%",
        disablePadding: false,
        label: "Actions",
    },
];
const AssessmentList = () => {
    const keysOrder = [
        "uuid",
        "_id",
        "title",
        "assessmentType",
        "assignedMember.name",
        "assignedOperationMember.name",
        "assessmentStatus",
        "dueDate",
    ];
    const navigate = useNavigate();
    //Refr for Toaster
    const myRef = React.useRef();
    //Toaster Message setter
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });

    // state to manage loader
    const [isLoading, setIsLoading] = useState(false);

    //state to hold search timeout delay
    const [searchTimeout, setSearchTimeout] = useState(null);
    //state to hold wheather to make api call or not
    const [makeApiCall, setMakeApiCall] = useState(true);

    //state to hold search keyword
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("");
    const [records, setRecords] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selected, setSelected] = useState([]);

    const onSearchChangeHandler = (e) => {
        console.log("event", e.key);
        if (searchTimeout) clearTimeout(searchTimeout);
        setMakeApiCall(false);
        console.log("search values", e.target.value);
        setSearch(e.target.value);
        setSearchTimeout(
            setTimeout(() => {
                setMakeApiCall(true);
                setPage(1);
            }, 1000)
        );
    };

    const handleTablePageChange = (newPage) => {
        setPage(newPage);
    };
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
    const onClickVisibilityIconHandler = (id) => {
        console.log("id", id);
        return navigate(`/assessment-list/fill-assessment/${id}`);
    };

    const onClickEditIconHandler = (uuid) => {
        console.log("uuid", uuid);
        return navigate(`/assessments/edit-assessment/${uuid}`);
    };
    const onClickAssignAssessmentHandler = (uuid) => {
        console.log("uuid", uuid);
        return navigate(`/assessment-list/assign-assessment/${uuid}`);
    };
    const onClickFillAssessmentHandler = (uuid) => {
        console.log("uuid", uuid);
        return navigate(`/assessment-list/fill-assessment/${uuid}`);
    };

    const generateUrl = () => {
        console.log("Search", search);
        let url = `${ASSESSMENTS}?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;
        if (search?.length >= 3) url += `&search=${search}`;

        return url;
    };

    const getAssessments = async (
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
            setTotalRecords(parseInt(response.headers["x-total-count"]));
            console.log("Response from  get assessments api", response);

            updateRecords([...response.data]);
            setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            console.log("Error from assessments-------", error);

            if (error?.response?.status == 401) {
                navigate("/login");
            }
            setIsLoading(false);
        }
    };

    const updateRecords = (data) => {
        data.forEach((object) => {
            delete object["updatedAt"];

            delete object["__v"];

            // delete object["uuid"];
            // delete object["createdAt"];
            delete object["isDraft"];
            delete object["isPublished"];
            delete object["isActive"];
            delete object["isDeleted"];
            delete object["isSubmitted"];
            // delete object["title"];
            delete object["updatedAt"];
            delete object["updatedBy"];
            delete object["createdBy"];
            delete object["createdAt"];
            delete object["remarks"];

            // object["uuid"] = object[x"uuid"];
            // object["creted"]
            object["assignedMember.name"] = object["assignedMember"]["name"];
            object["assignedOperationMember.name"] =
                object["assignedOperationMember"]["name"];
            // object["title"] = object["title"];
            object["assessmentType"] = object["assessmentType"];

            // object["assessmentType"] = object["assessmentType"];
            delete object["assignedOperationMember"];
            delete object["assignedMember"];
            delete object["memberCompany"];
            delete object["questionnaireId"];
            delete object["isMemberRepresentative"];
            object["dueDate"] = new Date(object["dueDate"]).toLocaleDateString(
                "en-US",
                { month: "2-digit", day: "2-digit", year: "numeric" }
            );
            keysOrder.forEach((k) => {
                const v = object[k];
                delete object[k];
                object[k] = v;
            });
        });
        setRecords([...data]);
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCall && getAssessments(isMounted, controller);
        return () => {
            isMounted = false;
            clearTimeout(searchTimeout);
            controller.abort();
        };
    }, [page, rowsPerPage, orderBy, order, makeApiCall]);

    const addAssessment = () => {
        navigate("/assessments/add-assessment");
    };

    const privilege = useSelector((state) => state?.user?.privilege);

    const userAuth = useSelector((state) => state?.user?.userObj);
    const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
    const MEMBER_REPRESENTATIVE =
        privilege?.name === "Member Representative" ? true : false;
    const OPERATION_MEMBER =
        privilege?.name === "Operation Member" ? true : false;
    let privilegeArray =
        userAuth?.roleId?.name === "Super Admin"
            ? []
            : Object.values(privilege?.privileges);
    // let privilegeArray = privilege ? Object.values(privilege?.privileges) : [];
    let moduleAccesForAssessment = privilegeArray
        .filter((data) => data?.moduleId?.name === "Assessment")
        .map((data) => ({
            assessment: {
                list: data?.list,
                view: data?.view,
                edit: data?.edit,
                delete: data?.delete,
                add: data?.add,
            },
        }));

    return (
        <div>
            <div className="page-wrapper">
                <section>
                    <div className="container">
                        <div className="form-header member-form-header flex-between mb-0">
                            <div className="form-header-left-blk flex-start">
                                <h2 className="heading2 mr-40">Assessments</h2>
                            </div>
                            <div className="form-header-right-txt search-and-btn-field-right">
                                <div className="search-and-btn-field-blk mr-0">
                                    <div className="searchbar">
                                        <input
                                            type="text"
                                            value={search}
                                            name="search"
                                            placeholder="Search"
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                setMakeApiCall(true)
                                            }
                                            onChange={onSearchChangeHandler}
                                        />
                                        <button type="submit">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                                {(SUPER_ADMIN ||
                                    moduleAccesForAssessment[0]?.assessment
                                        ?.add) && (
                                    <div className="form-btn ml-20">
                                        <button
                                            type="submit"
                                            className="primary-button add-button"
                                            onClick={addAssessment}
                                        >
                                            Add Assessment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* <div className="member-filter-sect">
                            <div className="member-filter-wrap flex-between">
                                <div className="member-filter-left">
                                    
                                </div>
                            </div>
                        </div> */}
                        <div className="member-info-wrapper table-content-wrap">
                            <div className="member-info-wrapper table-content-wrap table-footer-btm-space assessment-list-table">
                                {isLoading ? (
                                    <div className="loader-blk">
                                        <img src={Loader2} alt="Loading" />
                                    </div>
                                ) : (
                                    <TableComponent
                                        tableHead={tableHead}
                                        records={records}
                                        handleChangePage1={
                                            handleTablePageChange
                                        }
                                        handleChangeRowsPerPage1={
                                            handleRowsPerPageChange
                                        }
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        // selected={selected}
                                        totalRecords={totalRecords}
                                        orderBy={orderBy}
                                        icons={
                                            SUPER_ADMIN
                                                ? ["visibility", "edit"]
                                                : moduleAccesForAssessment[0]
                                                      ?.assessment?.delete
                                                ? ["visibility", "edit"]
                                                : ["fill", "send"]
                                        }
                                        onClickVisibilityIconHandler1={
                                            onClickVisibilityIconHandler
                                        }
                                        onClickEditAssesmentFunction={
                                            onClickEditIconHandler
                                        }
                                        order={order}
                                        setOrder={setOrder}
                                        setOrderBy={setOrderBy}
                                        setCheckBoxes={false}
                                        onClickAssignAssesmentFunction={
                                            onClickAssignAssessmentHandler
                                        }
                                        onClickFillAssessmentFunction={
                                            onClickFillAssessmentHandler
                                        }
                                        viewAssessment={true}
                                        // onRowClick={
                                        //     SUPER_ADMIN
                                        //         ? true
                                        //         : moduleAccesForAssessment[0]
                                        //               ?.assessment?.view
                                        // }
                                        // isQuestionnare={true}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AssessmentList;
