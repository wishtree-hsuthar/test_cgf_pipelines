import React, { useState, useEffect } from "react";
import {
    Link,
    Navigate,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import PropTypes from "prop-types";

import DialogBox from "../../components/DialogBox";

import TableTester from "../../components/TableTester";
import TableComponent from "../../components/TableComponent";
import useCallbackState from "../../utils/useCallBackState";
import { privateAxios } from "../../api/axios";
import {
    ADD_SUB_ADMIN,
    FETCH_SUB_ADMIN_BY_ADMIN,
    GET_OPERATION_MEMBER_BY_ID,
    REPLACE_SUB_ADMIN,
    ADD_OPERATION_MEMBER,
} from "../../api/Url";
import Toaster from "../../components/Toaster";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
const tableHead = [
    {
        id: "",
        disablePadding: true,
        label: "Select User",
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
    const replaceHeaderKeyOrder = ["_id", "name", "email", "role"];
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [operationMember, setOperationMember] = useState({});

    const { id } = useParams();
    //state to hold search timeout delay
    const [selectedOperationMember, setSelectedOperationMember] = useState({});
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [selected, setSelected] = React.useState([]);
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("operationalMember");
    const [selectedUser, setSelectedUser] = useState("");
    const [makeApiCall, setMakeApiCall] = useState(true);
    const [records, setRecords] = React.useState([]);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const myRef = React.useRef();
    //Toaster Message setter
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });
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
    const generateUrl = (multiFilterString) => {
        console.log("Search", search);

        let url = `${ADD_OPERATION_MEMBER}/${id}/replaces/list?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;
        if (search?.length >= 3)
            url = `${ADD_OPERATION_MEMBER}/${id}/replaces/list?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}&search=${search}`;

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
            // object["role"] = object["subRole"][0].name;
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
        setRecords([...staleData]);
    };

    const getOperationMember = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrl();
            // setIsLoading(true);
            const response = await privateAxios.get(url, {
                signal: controller.signal,
            });
            // console.log(response.headers["x-total-count"]);
            setTotalRecords(parseInt(response.headers["x-total-count"]));
            console.log("Response from operation member api get", response);

            updateRecords(response.data.filter((data) => data._id !== id));
            // setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            console.log("Error from operation member-------", error);

            if (error?.response?.status == 401) {
                navigate("/login");
            }
            // setIsLoading(false);
        }
    };

    const fetchOperationMember = async () => {
        try {
            const response = await privateAxios.get(
                GET_OPERATION_MEMBER_BY_ID + id
            );
            console.log("response from fetch sub admin by id", response);
            setOperationMember(response.data);
        } catch (error) {
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
        makeApiCall && getOperationMember(isMounted, controller);
        console.log("makeApiCall", makeApiCall);
        console.log("inside use Effect");
        fetchOperationMember();

        return () => {
            isMounted = false;
            clearTimeout(searchTimeout);
            controller.abort();
        };
    }, [page, rowsPerPage, orderBy, order, makeApiCall]);

    const handleTableTesterPageChange = (newPage) => {
        console.log("new Page", newPage);
        setPage(newPage);
    };

    //rows per page change handler
    const handleTableTesterRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const replaceUser = async () => {
        try {
            const response = await privateAxios.post(
                REPLACE_SUB_ADMIN + "replace",

                {
                    replacingTo: id,

                    replacingWith: selectedUser,
                }
            );
            if (response.status == 201) {
                console.log(
                    selectedOperationMember[0].name +
                        " has replaced " +
                        operationMember.name +
                        " successfully!"
                );
                setToasterDetails(
                    {
                        titleMessage: "Success",
                        descriptionMessage:
                            selectedOperationMember[0].name +
                            " has replaced " +
                            operationMember.name +
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
                setToasterDetails(
                    {
                        titleMessage: "Error",
                        descriptionMessage: error?.response?.data?.message,
                        messageType: "error",
                    },
                    () => myRef.current()
                );
                setOpen(false);
            }
            if (error.response.status == 401) {
                setToasterDetails(
                    {
                        titleMessage: "Error",
                        descriptionMessage: error?.response?.data?.message,
                        messageType: "error",
                    },
                    () => myRef.current()
                );
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
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const handleSearchText = (e) => {
        setSearchText(e.target.value);
    };
    console.log("Search text---", searchText);

    const handleYes = () => {
        console.log("Yes replcae" + id + " replace id with", selectedUser);
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
        setSelectedUser(id);
        setSelectedOperationMember({
            ...records.filter((data) => data._id === id ?? { name: data.name }),
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
                title={<p> Replace Operation Member {operationMember.name} </p>}
                info1={
                    <p>
                        {" "}
                        On replacing an operation member, all the statistics &
                        records ownership would get transferred to the new
                        operation member
                    </p>
                }
                info2={
                    <p>
                        {" "}
                        Are you want to replace <b>
                            {" "}
                            {operationMember.name}{" "}
                        </b>?{" "}
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

                    <div className="member-info-wrapper table-content-wrap">
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
                            onClick={() => navigate("/users/operation-members")}
                            className="secondary-button mr-10"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={selectedUser === ""}
                            onClick={openReplaceDailogBox}
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

export default ReplaceOperationMember;
