import React, { useState, useEffect } from "react";
import {
    Link,
    Navigate,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import PropTypes from "prop-types";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    Checkbox,
} from "@mui/material";
import DialogBox from "../../components/DialogBox";

import TableTester from "../../components/TableTester";
import TableComponent from "../../components/TableComponent";
import useCallbackState from "../../utils/useCallBackState";
import { privateAxios } from "../../api/axios";
import {
    ADD_SUB_ADMIN,
    FETCH_SUB_ADMIN_BY_ADMIN,
    REPLACE_SUB_ADMIN,
} from "../../api/Url";
import Toaster from "../../components/Toaster";
const tableHead = [
    {
        id: "",
        disablePadding: true,
        label: "Select User",
        width: "10%",
    },
    {
        id: "subAdminName",
        disablePadding: true,
        label: "CGF Admin Name",
        width: "30%",
    },
    {
        id: "emailId",
        disablePadding: false,
        label: "Email Id",
        width: "40%",
    },
    {
        id: "role",
        disablePadding: false,
        label: "Role",
        width: "20%",
    },
    // {
    //     id: "",
    //     disablePadding: true,
    //     label: "",
    //     width: "0%",
    // },
];
//Array of Object (idealy we will get this data from backend)

const ReplaceSubAdmin = () => {
    const replaceHeaderKeyOrder = ["_id", "name", "email", "role"];
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [cgfAdmin, setCgfAdmin] = useState({});
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

        let url = `${ADD_SUB_ADMIN}?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;
        if (search?.length >= 3)
            url = `${ADD_SUB_ADMIN}?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}&search=${search}`;

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
            object["role"] = object["subRole"][0].name;
            delete object["subRole"];
            delete object["subRoleId"];
            delete object["isActive"];
            delete object["createdBy"];
            delete object["updatedBy"];
            delete object["isReplaced"];

            replaceHeaderKeyOrder.forEach((k) => {
                const v = object[k];
                delete object[k];
                object[k] = v;
            });
        });
        console.log("data in updaterecords method", staleData);
        setRecords([...staleData]);
    };
    // fetch sub-admins
    const getSubAdmin = async (
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
            console.log("Response from sub admin api get", response);

            updateRecords(response.data.filter((data) => data._id !== id));
            setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            // console.log(toasterDetails);
            console.log("Error from getSubAdmin-------", error);
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
                    "Error status 500 while fetchiing subadmin from replace sub-admin"
                );
                navigate("/sub-admins");
            }
        }
    };

    const fetchSubAdmin = async () => {
        try {
            const response = await privateAxios.get(
                FETCH_SUB_ADMIN_BY_ADMIN + id
            );
            console.log("response from fetch sub admin by id", response);
            setCgfAdmin(response.data);
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
        makeApiCall && getSubAdmin(isMounted, controller);
        console.log("makeApiCall", makeApiCall);
        console.log("inside use Effect");
        fetchSubAdmin();

        return () => {
            isMounted = false;
            clearTimeout(searchTimeout);
            controller.abort();
        };
    }, [page, rowsPerPage, orderBy, order, makeApiCall]);
    //page change handler
    const handleTableTesterPageChange = (newPage) => {
        console.log("new Page", newPage);
        setPage(newPage);
    };

    //rows per page change handler
    const handleTableTesterRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    //on Click of visibility icon

    console.log(
        "page: ",
        page,
        "rows Per Page: ",
        rowsPerPage,
        "order: ",
        order,
        "order By: ",
        orderBy
    );

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
                setToasterDetails(
                    {
                        titleMessage: "Success",
                        descriptionMessage: response?.data?.message,
                        messageType: "success",
                    },
                    () => myRef.current()
                );
                setOpen(false);
                setTimeout(() => {
                    navigate("/sub-admins");
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
    };
    const openReplaceDailogBox = () => {
        setOpen(true);
    };
    const selectSingleUser = (id) => {
        console.log("select single user---", id);
        setSelectedUser(id);
    };
    return (
        <div className="page-wrapper">
            <Toaster
                myRef={myRef}
                messageType={toasterDetails.messageType}
                descriptionMessage={toasterDetails.descriptionMessage}
                titleMessage={toasterDetails.titleMessage}
            />
            <DialogBox
                title={<p> Replace CGF admin {cgfAdmin.name} </p>}
                info1={
                    <p>
                        {" "}
                        On replacing a cgf admin, all the statistics and record
                        would get transfer to the new member.
                    </p>
                }
                info2={
                    <p>
                        {" "}
                        Are you sure you want to replace{" "}
                        <b> {cgfAdmin.name} </b>?{" "}
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
                            <Link to="/sub-admins">CGF Admin</Link>
                        </li>
                        <li>
                            <Link to={`/sub-admins/view-sub-admin/${id}`}>
                                View CGF Admin
                            </Link>
                        </li>
                        <li>Replace CGF Admin</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between ">
                        <h2 className="heading2">Replace</h2>
                        {/* <h4>Replace sub-admin with following:</h4> */}
                        <div
                            className="form-header-right-txt 
        member-filter-right
               
               "
                        >
                            {/* <div className="tertiary-btn-blk"> */}
                            <div className="searchbar">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    onChange={(e) => onSearchChangeHandler(e)}
                                    name="search"
                                />
                                <button type="submit">
                                    <i className="fa fa-search"></i>
                                </button>
                            </div>
                            {/* </div> */}
                        </div>
                    </div>

                    <div className="member-info-wrapper table-content-wrap">
                        <div className="member-data-sect replace-admin-table">
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
                            onClick={() => navigate("/sub-admins")}
                            className="secondary-button mr-10"
                        >
                            Cancel
                        </button>
                        <button
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

export default ReplaceSubAdmin;
