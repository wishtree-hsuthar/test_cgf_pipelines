import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import {
    FETCH_ASSESSMENT_BY_ID,
    FETCH_OPERATION_MEMBER,
    MEMBER_OPERATION_MEMBERS,
    REASSIGN_ASSESSMENTS,
} from "../../api/Url";
import TableComponent from "../../components/TableComponent";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

const tableHead = [
    {
        id: "",
        disablePadding: true,
        label: "",
        // width: "30%",
    },
    {
        id: "name",
        disablePadding: true,
        label: "Operation Member",
        // width: "30%",
    },
    {
        id: "email",
        disablePadding: false,
        label: "Email",
        // width: "40%",
    },
];

const AssignAssessmentToOperationMember = () => {
    //custom hook to set title of page
    useDocumentTitle("Assign Assessment");

    const keysOrder = ["_id", "name", "email"];

    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    //state to hold search timeout delay
    const [searchTimeout, setSearchTimeout] = useState(null);

    //array to get array of selected rows ids
    const [selected, setSelected] = React.useState([]);
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("operationalMember");
    const [selectedUser, setSelectedUser] = useState("");
    const [makeApiCall, setMakeApiCall] = useState(true);
    const [records, setRecords] = React.useState([]);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [assessment, setAssessment] = useState({});
    const [search, setSearch] = useState("");
    const [newOperationMember, setNewOperationMember] = useState("");
    const [disableAssignButton, setDisableAssignButton] = useState(false);
    const navigate = useNavigate();
    const myRef = React.useRef();

    //Toaster Message setter
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });

    let memberId;
    let operationMemberId;
    // search function
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
    const generateUrl = () => {
        console.log("Search", search);
        console.log(
            "assessment?",
            assessment,
            window.location.pathname.split("/")[-1]
        );

        let url = `${FETCH_ASSESSMENT_BY_ID}${window.location.pathname
            .split("/")
            .at(
                -1
            )}/reassignto/list?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;
        if (search?.length >= 3)
            url = `${MEMBER_OPERATION_MEMBERS}/${memberId}/list?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}&search=${search}`;

        return memberId && url;
    };

    const updateRecords = (data) => {
        console.log("data before update----", data);

        let staleData = data;
        staleData.forEach((object) => {
            delete object["updatedAt"];
            delete object["description"];
            delete object["countryCode"];
            delete object["isDeleted"];
            delete object["__v"];
            delete object["password"];
            delete object["roleId"];
            delete object["salt"];
            delete object["uuid"];
            delete object["phoneNumber"];
            delete object["createdAt"];
            delete object["memberData"];
            delete object["department"];
            delete object["isDeleted"];
            delete object["isActive"];
            delete object["createdBy"];
            delete object["updatedBy"];
            delete object["isReplaced"];
            delete object["memberId"];
            delete object["salutation"];
            delete object["title"];
            delete object["address"];
            delete object["operationType"];
            delete object["reportingManager"];
            delete object["isCGFStaff"];
            delete object["isOperationMember"];
            delete object["isMemberRepresentative"];
            delete object["assessmentCount"];

            keysOrder.forEach((k) => {
                const v = object[k];
                delete object[k];
                object[k] = v;
            });
        });
        console.log("data in updaterecords method", staleData);
        setRecords([...staleData]);
    };

    const fetchReportingManagers = async (id) => {
        try {
            const response = await privateAxios.get(
                FETCH_OPERATION_MEMBER + id
            );
            if (response.status == 200) {
            }
        } catch (error) {
            console.log("error from fetching reporting managers", error);
        }
    };

    const getOperationMembers = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrl();
            setIsLoading(true);
            const response = await privateAxios.get(memberId && url, {
                signal: controller.signal,
            });
            setTotalRecords(parseInt(response.headers["x-total-count"]));
            console.log(
                "Response from  api get operation member api",
                response
            );
            let filteredMembers = response?.data.filter(
                (member) => member?._id !== operationMemberId
            );
            updateRecords(filteredMembers);
            setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            console.log("Error from operation member-------", error);
            isMounted &&
                setToasterDetails(
                    {
                        titleMessage: "Error",
                        descriptionMessage:
                            error?.response?.data?.error &&
                            typeof error.response.data.error === "string"
                                ? error.response.data.error
                                : "Something went wrong!",

                        messageType: "error",
                    },
                    () => myRef.current()
                );
            setIsLoading(false);
            if (error?.response?.status == 500) {
                console.log(
                    "Error status 500 while fetchiing operation member"
                );
            }
        }
    };

    const handleTableTesterPageChange = (newPage) => {
        console.log("new Page", newPage);
        setPage(newPage);
    };

    //rows per page change handler
    const handleTableTesterRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
    // selects single operation member
    const selectSingleUser = (id) => {
        console.log("select single user---", id);
        setDisableAssignButton(true);

        setSelectedUser(id);
        setNewOperationMember(id);
    };

    // fetch assessment method
    const fetchAssessment = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            const response = await privateAxios.get(
                FETCH_ASSESSMENT_BY_ID + id,
                {
                    signal: controller.signal,
                }
            );
            isMounted && setAssessment(response.data);
            memberId = response?.data?.assignedMember?._id;
            operationMemberId = response?.data?.assignedOperationMember?._id;

            console.log(
                "response from fetch assessment in assign assessment page",
                response
            );
        } catch (error) {
            console.log(
                "Error from fetch assessment in assign assessment page",
                error
            );
        }
    };

    // assign assessment to operation member
    const handleReassignAssessment = async () => {
        setDisableAssignButton(false);
        console.log(
            `data from re-assign assessment-${id} and operation-member-${newOperationMember}`
        );
        try {
            const response = await privateAxios.post(
                REASSIGN_ASSESSMENTS + id + "/reassign",
                {
                    reassignTo: newOperationMember,
                }
            );
            console.log("response from handle re-assign assessment", response);
            if (response.status == 201) {
                setToasterDetails(
                    {
                        titleMessage: "Success",
                        descriptionMessage: response?.data?.message,

                        messageType: "success",
                    },
                    () => myRef.current()
                );
                setTimeout(() => {
                    navigate("/assessment-list");
                }, 2000);
            }
        } catch (error) {
            console.log("Error from re-assign assessment", error);
            if (error?.response?.status == 400) {
                setToasterDetails(
                    {
                        titleMessage: "Error",
                        descriptionMessage:
                            error?.response?.data?.error &&
                            typeof error.response.data.error === "string"
                                ? error.response.data.error
                                : "Something went wrong!",

                        messageType: "error",
                    },
                    () => myRef.current()
                );
            }
        }
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCall &&
            // const fetchAssessment=()=>{
            //     try {

            //     } catch (error) {

            (async () => {
                await fetchAssessment(isMounted, controller);
                await getOperationMembers(isMounted, controller);
            })();
        console.log("assessment - ", assessment);

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [makeApiCall, orderBy, order, page]);

    return (
        <div className="page-wrapper">
            <Toaster
                myRef={myRef}
                messageType={toasterDetails.messageType}
                descriptionMessage={toasterDetails.descriptionMessage}
                titleMessage={toasterDetails.titleMessage}
            />
            {/* <DialogBox
                title={<p> Assign Assessment {cgfAdmin.name} </p>}
                info1={
                    <p>
                        {" "}
                        On assigning this assessment, it will
                         get transfer to the new operation member.
                    </p>
                }
                info2={
                    <p>
                        {" "}
                        Are you sure you want to Assign it to {" "}
                        <b> {cgfAdmin.name} </b>?{" "}
                    </p>
                }
                primaryButtonText="Yes"
                secondaryButtonText="No"
                onPrimaryModalButtonClickHandler={handleYes}
                onSecondaryModalButtonClickHandler={handleNo}
                openModal={open}
                setOpenModal={setOpen}
            /> */}
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <Link to="/assessment-list">Assessment</Link>
                        </li>

                        <li>Assign Assessment</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between ">
                        <h2 className="heading2">Assign Assessment</h2>
                        <div className="member-filter-left">
                            {/* <div className="tertiary-btn-blk"> */}
                            <div className="searchbar">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    onChange={(e) => onSearchChangeHandler(e)}
                                    name="search"
                                />
                                <button type="submit">
                                    <i class="fa fa-search"></i>
                                </button>
                            </div>
                            {/* </div> */}
                        </div>
                    </div>

                    <div className="member-info-wrapper table-content-wrap replace-admin-table">
                        <div className="member-data-sect">
                            <TableComponent
                                tableHead={tableHead}
                                records={records}
                                handleChangePage1={handleTableTesterPageChange}
                                handleChangeRowsPerPage1={
                                    handleTableTesterRowsPerPageChange
                                }
                                page={page}
                                rowsPerPage={rowsPerPage}
                                totalRecords={totalRecords}
                                orderBy={orderBy}
                                order={order}
                                setOrder={setOrder}
                                setOrderBy={setOrderBy}
                                selected={selected}
                                setSelected={setSelected}
                                setCheckBoxes={false}
                                setSingleSelect={true}
                                handleSingleUserSelect={selectSingleUser}
                                selectedUser={selectedUser}
                            />
                        </div>
                    </div>
                    <div className="form-btn flex-between add-members-btn mb-20">
                        <button
                            onClick={() => navigate("/assessment-list")}
                            className="secondary-button mr-10"
                        >
                            Cancel
                        </button>

                        <button
                            // onClick={openReplaceDailogBox}
                            onClick={handleReassignAssessment}
                            disabled={selectedUser == ""}
                            // disabled
                            className="primary-button add-button replace-assign-btn"
                        >
                            Assign
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AssignAssessmentToOperationMember;
