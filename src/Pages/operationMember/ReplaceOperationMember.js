import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DialogBox from "../../components/DialogBox";

import TableComponent from "../../components/TableComponent";
import useCallbackState from "../../utils/useCallBackState";
import { privateAxios } from "../../api/axios";
import {
    GET_OPERATION_MEMBER_BY_ID,
    REPLACE_SUB_ADMIN,
    ADD_OPERATION_MEMBER,
} from "../../api/Url";
import Toaster from "../../components/Toaster";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
const replaceOperationMemberTableHead = [
    {
        id: "",
        disablePadding: true,
        label: "",
        width: "10%",
    },
    {
        id: "name",
        disablePadding: true,
        label: "Operation Member",
        width: "30%",
    },
    {
        id: "email",
        disablePadding: false,
        label: "Email",
        width: "40%",
    },
    {
        id: "role",
        disablePadding: false,
        label: "Role",
        width: "20%",
    },
];
const ReplaceOperationMember = () => {
    //custom hook to set title of page
    useDocumentTitle("Replace Operation Member");
    const setErrorToaster = (error) => {
        console.log("error", error);
        setToasterDetails(
            {
                titleMessage: "Error",
                descriptionMessage:
                    error?.response?.data?.message &&
                    typeof error.response.data.message === "string"
                        ? error.response.data.message
                        : "Something went wrong!",
                messageType: "error",
            },
            () => myRef.current()
        );
    };
    const replaceHeaderKeyOrder = ["_id", "name", "email", "role"];
    const [opListPage, setOPPage] = React.useState(1);
    const [rowsPerPageReplaceOP, setRowsPerPageReplaceOP] = React.useState(10);
    const [operationMemberReplaceOP, setOperationMemberReplaceOP] = useState(
        {}
    );

    const { id } = useParams();
    //state to hold search timeout delay
    const [selectedOperationMember, setSelectedOperationMember] = useState({});
    const [searchTimeoutReplaceOP, setSearchTimeoutReplaceOP] = useState(null);
    const [selectedReplaceOP, setSelectedReplaceOP] = React.useState([]);
    const [orderReplaceOP, setOrderReplaceOP] = React.useState("asc");
    const [orderByReplaceOP, setOrderByReplaceOP] =
        React.useState("operationalMember");
    const [selectedUserReplaceOP, setSelectedUserReplaceOP] = useState("");
    const [makeApiCallReplaceOP, setMakeApiCallReplaceOP] = useState(true);
    const [recordsReplaceOP, setRecordsReplaceOP] = React.useState([]);
    const [totalRecordsReplaceOP, setTotalRecordsReplaceOP] = React.useState(0);
    const [seacrchReplaceOP, setSearchReplaceOP] = useState("");
    const navigate = useNavigate();
    const myRef = React.useRef();
    //Toaster Message setter
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });
    // seacrchReplaceOP function
    const onSearchChangeHandlerReplaceOP = (e) => {
        console.log("event", e.key);
        if (searchTimeoutReplaceOP) clearTimeout(searchTimeoutReplaceOP);
        setMakeApiCallReplaceOP(false);
        console.log("seacrchReplaceOP values", e.target.value);
        setSearchReplaceOP(e.target.value);
        setSearchTimeoutReplaceOP(
            setTimeout(() => {
                setMakeApiCallReplaceOP(true);
                setOPPage(1);
            }, 1000)
        );
    };
    const generateUrl = (multiFilterString) => {
        console.log("Search", seacrchReplaceOP);

        let url = `${ADD_OPERATION_MEMBER}/${id}/replaces/list?page=${opListPage}&size=${rowsPerPageReplaceOP}&orderBy=${orderByReplaceOP}&order=${orderReplaceOP}`;
        if (seacrchReplaceOP?.length >= 3)
            url = `${ADD_OPERATION_MEMBER}/${id}/replaces/list?page=${opListPage}&size=${rowsPerPageReplaceOP}&orderBy=${orderByReplaceOP}&order=${orderReplaceOP}&search=${seacrchReplaceOP}`;

        return url;
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
            object["role"] = "Operation Member";
            delete object["subRole"];
            delete object["subRoleId"];
            delete object["isActive"];
            delete object["createdBy"];
            delete object["updatedBy"];
            delete object["isReplaced"];
            delete object["memberData"];
            delete object["salutation"];
            delete object["memberId"];
            delete object["title"];
            delete object["department"];
            delete object["address"];
            delete object["reportingManager"];
            delete object["operationType"];
            delete object["isMemberRepresentative"];
            delete object["isCGFAdmin"];
            delete object["isCGFStaff"];
            delete object["isOperationMember"];

            replaceHeaderKeyOrder.forEach((k) => {
                const v = object[k];
                delete object[k];
                object[k] = v;
            });
        });
        console.log("data in updaterecords method", staleData);
        setRecordsReplaceOP([...staleData]);
    };

    const getOperationMember = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrl();
            const response = await privateAxios.get(url, {
                signal: controller.signal,
            });

            setTotalRecordsReplaceOP(
                parseInt(response.headers["x-total-count"])
            );
            console.log("Response from operation member api get", response);

            updateRecords(response.data.filter((data) => data._id !== id));
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            console.log("Error from operation member-------", error);

            // if (error?.response?.status == 401) {
            //     navigate("/login");
            // }
            // setIsLoading(false);
        }
    };

    const fetchOperationMember = async (isMounted, controller) => {
        try {
            const response = await privateAxios.get(
                GET_OPERATION_MEMBER_BY_ID + id,
                {
                    signal: controller.signal,
                }
            );
            console.log("response from fetch sub admin by id", response);
            setOperationMemberReplaceOP(response.data);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;

            if (error?.response?.status == 401) {
                setToasterDetails(
                    {
                        titleMessage: "Error",
                        descriptionMessage:
                            "Session Timeout: Please login again",
                        messageType: "error",
                    },
                    () => myRef.current()
                );
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            }
            if (error?.response?.status == 500) {
                console.log(
                    "Error status 500 while fetchiing subadmin from replace sub-admin"
                );
                navigate("/sub-admins");
            }
        }
    };
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCallReplaceOP && getOperationMember(isMounted, controller);
        console.log("makeApiCallReplaceOP", makeApiCallReplaceOP);
        console.log("inside use Effect");
        fetchOperationMember(isMounted, controller);

        return () => {
            isMounted = false;
            clearTimeout(searchTimeoutReplaceOP);
            controller.abort();
        };
    }, [
        opListPage,
        rowsPerPageReplaceOP,
        orderByReplaceOP,
        orderReplaceOP,
        makeApiCallReplaceOP,
    ]);

    const handleTableTesterPageChange = (newPage) => {
        console.log("new Page", newPage);
        setOPPage(newPage);
    };

    //rows per opListPage change handler
    const handleTableTesterRowsPerPageChange = (event) => {
        setRowsPerPageReplaceOP(parseInt(event.target.value, 10));
        setOPPage(1);
    };

    const replaceUser = async () => {
        try {
            const response = await privateAxios.post(
                REPLACE_SUB_ADMIN + "replace",

                {
                    replacingTo: id,

                    replacingWith: selectedUserReplaceOP,
                }
            );
            if (response.status == 201) {
                console.log(
                    selectedOperationMember[0].name +
                        " has replaced " +
                        operationMemberReplaceOP.name +
                        " successfully!"
                );
                setToasterDetails(
                    {
                        titleMessage: "Success",
                        descriptionMessage:
                            selectedOperationMember[0].name +
                            " has replaced " +
                            operationMemberReplaceOP.name +
                            " successfully!",
                        messageType: "success",
                    },
                    () => myRef.current()
                );
                setOpen(false);
                setTimeout(() => {
                    navigate("/users/operation-members");
                }, 3000);
            }
        } catch (error) {
            console.log("error from replace user");
            if (error.response.status == 400) {
                setErrorToaster(error);
                setOpen(false);
            }
            if (error.response.status == 401) {
                setErrorToaster(error);
                setOpen(false);
            }
            if (error?.response?.status == 500) {
                console.log(
                    "Error status 500 while fetchiing subadmin from replace sub-admin"
                );
                navigate("/sub-admins");
            }
        }
    };
    const [searchTextReplaceOP, setSearchTextReplaceOP] = useState("");
    const [open, setOpen] = useState(false);
    const handleSearchText = (e) => {
        setSearchTextReplaceOP(e.target.value);
    };
    console.log("Search text---", searchTextReplaceOP);

    const handleYes = () => {
        console.log(
            "Yes replcae" + id + " replace id with",
            selectedUserReplaceOP
        );
        replaceUser();
    };
    const handleNo = () => {
        console.log("No replcae");
        navigate("/users/operation-members");
    };
    const openReplaceDailogBox = () => {
        setOpen(true);
    };
    const selectSingleUser = (id) => {
        console.log("select single user---", id);
        setSelectedUserReplaceOP(id);
        setSelectedOperationMember({
            ...recordsReplaceOP.filter(
                (data) => data._id === id ?? { name: data.name }
            ),
        });
    };
    return (
        <div class="page-wrapper">
            <Toaster
                myRef={myRef}
                messageType={toasterDetails.messageType}
                descriptionMessage={toasterDetails.descriptionMessage}
                titleMessage={toasterDetails.titleMessage}
            />
            <DialogBox
                title={
                    <p>
                        Replace Operation Member "
                        {operationMemberReplaceOP?.name}"
                    </p>
                }
                info1={
                    <p>
                        On replacing an operation member, the complete ownership
                        would get transferred to the new operation member.
                    </p>
                }
                info2={
                    <p>
                        Do you still want to replace
                        <b> {operationMemberReplaceOP.name} </b>?{" "}
                    </p>
                }
                primaryButtonText="Yes"
                secondaryButtonText="No"
                onPrimaryModalButtonClickHandler={handleYes}
                onSecondaryModalButtonClickHandler={handleNo}
                openModal={open}
                setOpenModal={setOpen}
            />
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <Link to="/users/operation-members">
                                Operation Member
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/users/operation-member/view-operation-member/${id}`}
                            >
                                View Operation Member
                            </Link>
                        </li>
                        <li>Replace Operation Member</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between ">
                        <h2 className="heading2">Replace</h2>

                        <div className="member-filter-left">
                            {/* <div className="tertiary-btn-blk"> */}
                            <div className="searchbar">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    onChange={(e) =>
                                        onSearchChangeHandlerReplaceOP(e)
                                    }
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
                                tableHead={replaceOperationMemberTableHead}
                                records={recordsReplaceOP}
                                handleChangePage1={handleTableTesterPageChange}
                                handleChangeRowsPerPage1={
                                    handleTableTesterRowsPerPageChange
                                }
                                page={opListPage}
                                rowsPerPage={rowsPerPageReplaceOP}
                                totalRecords={totalRecordsReplaceOP}
                                orderBy={orderByReplaceOP}
                                order={orderReplaceOP}
                                setOrder={setOrderReplaceOP}
                                setOrderBy={setOrderByReplaceOP}
                                selected={selectedReplaceOP}
                                setSelected={setSelectedReplaceOP}
                                setCheckBoxes={false}
                                setSingleSelect={true}
                                handleSingleUserSelect={selectSingleUser}
                                selectedUser={selectedUserReplaceOP}
                            />
                        </div>
                    </div>
                    <div className="form-btn flex-between add-members-btn replace-cgf-admin-btnblk">
                        <button
                            onClick={() => navigate("/users/operation-members")}
                            className="secondary-button mr-10"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={selectedUserReplaceOP === ""}
                            onClick={openReplaceDailogBox}
                            className="primary-button add-button replace-assign-btn"
                        >
                            Replace
                        </button>
                    </div>
                </div>
            </section>
        </div>
        // </section>
        // </div>
    );
};

export default ReplaceOperationMember;
