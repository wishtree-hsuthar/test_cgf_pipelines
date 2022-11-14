import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Box, Tabs, Tab, Typography, MenuItem, Select } from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import useCallbackState from "../../utils/useCallBackState";
import { privateAxios } from "../../api/axios";
import Toaster from "../../components/Toaster";
import { ADD_SUB_ADMIN, FETCH_ROLES, WITHDRAW_SUB_ADMIN } from "../../api/Url";
import DialogBox from "../../components/DialogBox";
import OnBoardedSubAdminsTable from "./OnBoardedSubAdminsTable";
import PendingCGFAdmins from "./PendingCGFAdmins";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const SubAdminList = () => {
    // const dispatch = useDispatch();
    const [value, setValue] = React.useState(0);

    //Refr for Toaster
    const myRef = React.useRef();
    //Toaster Message setter
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });
    const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState(false);
    const [withdrawInviteid, setWithdrawInviteid] = useState("");

    // state to manage loader
    const [isLoading, setIsLoading] = useState(false);

    //state to hold search timeout delay
    const [searchTimeout, setSearchTimeout] = useState(null);
    //state to hold wheather to make api call or not
    const [makeApiCall, setMakeApiCall] = useState(true);

    const navigate = useNavigate();
    //(onboarded users/cgf-admin/ table) order in which records needs to show

    const [page, setPage] = React.useState(1);

    const pendingKeysOrder = [
        "_id",
        "name",
        "email",
        "role",
        "createdAt",
        // "token",
    ];

    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        status: "all",
        role: "",
    });
    const onFilterChangeHandler = (e) => {
        console.log("filter value: ", e.target.value);
        // console.log("type of time out func",typeof(timoutFunc))
        setPage(1);
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
        console.log("filters in parent component", filters);
    };
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
    //code of tablecomponent onboarded tab

    //code of tablecomponent pending tab
    const [pageForPendingTab, setPageForPendingTab] = React.useState(1);
    const [rowsPerPageForPendingTab, setRowsPerPageForPendingTab] =
        React.useState(10);
    const [orderForPendingTab, setOrderForPendingTab] = React.useState("desc");
    const [orderByForPending, setOrderByForPendingTab] =
        React.useState("createdAt");
    const [recordsForPendingTab, setRecordsForPendingTab] = React.useState([]);
    const [totalRecordsForPendingTab, setTotalRecordsForPendingTab] =
        React.useState(0);
    const [roles, setRoles] = useState([]);

    //implemention of pagination on front-end
    // let records = [];

    const updatePendingRecords = (data) => {
        console.log("data before update----", data);

        let staleData = data;
        staleData.forEach((object) => {
            // console.log("subRole-------", object["data"]["subRoleId"].name);
            delete object["updatedAt"];
            delete object["data"]["description"];
            delete object["data"]["countryCode"];
            delete object["data"]["isDeleted"];
            delete object["__v"];
            delete object["data"]["password"];
            delete object["data"]["roleId"];
            delete object["data"]["salt"];
            delete object["data"]["uuid"];
            delete object["data"]["phoneNumber"];
            delete object["token"];
            delete object["tokenExpiry"];
            delete object["tokenType"];

            // delete object["isActive"];
            object["createdAt"] = new Date(
                object["createdAt"]
            ).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            });

            // object["role"] = object["data"]["subRoleId"].name;
            // object["role"] = object["data"]["subRole"][0].name;
            object["role"] = object["subRole"][0].name;
            object["name"] = object["data"].name;
            object["email"] = object["data"].email;
            object["_id"] = object["_id"];
            object["createdAt"] = object["createdAt"];
            // delete object["data"]["subRoleId"];
            // delete object["data"]["subRole"][0].name;
            delete object["subRole"];
            delete object["data"];
            delete object["memberData"];

            pendingKeysOrder.forEach((k) => {
                const v = object[k];
                delete object[k];
                object[k] = v;
            });
        });
        console.log(
            "data in updaterecords method in pending method",
            staleData
        );
        setRecordsForPendingTab([...staleData]);
    };

    //page change method for pending tab
    const handlePendingTablePageChange = (newPage) => {
        setPageForPendingTab(newPage);
    };

    // rows per page method for pending tab
    const handleRowsPerPageChangeForPendingTab = (event) => {
        console.log("rows per page", event);
        setRowsPerPageForPendingTab(parseInt(event.target.value, 10));
        setPageForPendingTab(1);
    };

    //  on click delete icon open delete modal
    const onClickDeleteIconHandler = (id) => {
        console.log("id for delete", id);
        setOpenDeleteDialogBox(true);
        setWithdrawInviteid(id);
    };

    const withdrawInviteById = async () => {
        try {
            const response = await privateAxios.delete(
                WITHDRAW_SUB_ADMIN + withdrawInviteid
            );
            if (response.status == 200) {
                console.log("user invite withdrawn successfully");
                setToasterDetails(
                    {
                        titleMessage: "Success",
                        descriptionMessage: response?.data?.message,
                        messageType: "success",
                    },
                    () => myRef.current()
                );
                getSubAdminPending();
                setOpenDeleteDialogBox(false);
            }
        } catch (error) {
            console.log("error from withdrawInvite id", error);
        }
    };
    const fetchRolesForCGFAdmin = async () => {
        try {
            const response = await privateAxios.get(FETCH_ROLES);
            console.log("response from fetch roles", response.data);
            setRoles(response?.data);
        } catch (error) {
            console.log("error from fetchroles in pending page", error);
            if (error?.response?.status == 401) {
                console.log("401 from fetch roles of subadminlist");
                // dispatch(resetUser());
                navigate("/login");
            }
        }
    };
    // url for pending tab
    const generateUrlForPendingTab = () => {
        console.log("filters", filters);
        console.log("Search", search);
        let url = `${ADD_SUB_ADMIN}/pending?page=${pageForPendingTab}&size=${rowsPerPageForPendingTab}&orderBy=${orderByForPending}&order=${orderForPendingTab}`;

        if (search?.length >= 3) url += `&search=${search}`;

        return url;
    };

    const getSubAdminPending = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrlForPendingTab();
            setIsLoading(true);
            const response = await privateAxios.get(url, {
                signal: controller.signal,
            });
            // console.log(response.headers["x-total-count"]);
            setTotalRecordsForPendingTab(
                parseInt(response.headers["x-total-count"])
            );
            console.log(
                "Response from sub admin api get for pending tab table",
                response
            );

            updatePendingRecords(response.data);
            setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            // console.log(toasterDetails);
            console.log(
                "Error from getSubAdmin pending tab table-------",
                error
            );
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
        }
    };

    useEffect(
        () => {
            let isMounted = true;
            const controller = new AbortController();
            // makeApiCall && getSubAdminPending(isMounted, controller);
            fetchRolesForCGFAdmin();
            console.log("makeApiCall", makeApiCall);
            console.log("inside use Effect");
            return () => {
                isMounted = false;
                clearTimeout(searchTimeout);
                controller.abort();
            };
        },
        [
            // filters,
            // makeApiCall,
            // value,
            // pageForPendingTab,
            // rowsPerPageForPendingTab,
            // orderByForPending,
            // orderForPendingTab,
        ]
    );
    {
        console.log("makeApiCall outside UseEffect ", makeApiCall);
        // console.log("order", order, "order BY", orderBy);
    }

    // let roles = ["System-Administrator", "Co-ordinator"];
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState("");

    const [searchText, setSearchText] = useState("");
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    console.log("selected roles---", selectedRoles);

    console.log("Selected status filter---", selectedStatusFilter);

    console.log("Search text---", searchText);

    return (
        <div className="page-wrapper">
            <DialogBox
                title={<p>Withdraw CGF Admin Invitation</p>}
                info1={
                    <p>
                        On withdrawal, cgf admin will not be able to verify
                        their account?
                    </p>
                }
                info2={<p>Do you want to withdraw the invitation?</p>}
                primaryButtonText={"Yes"}
                secondaryButtonText={"No"}
                onPrimaryModalButtonClickHandler={() => {
                    withdrawInviteById();
                }}
                onSecondaryModalButtonClickHandler={() => {
                    setOpenDeleteDialogBox(false);
                }}
                openModal={openDeleteDialogBox}
                setOpenModal={setOpenDeleteDialogBox}
            />
            <Toaster
                myRef={myRef}
                titleMessage={toasterDetails.titleMessage}
                descriptionMessage={toasterDetails.descriptionMessage}
                messageType={toasterDetails.messageType}
            />
            <section>
                <div className="container">
                    <div className="member-filter-sect"></div>

                    <div className="form-header member-form-header flex-between">
                        <div className="form-header-left-blk flex-start">
                            <h2 className="heading2">CGF Admins</h2>
                        </div>
                        <div className="form-header-right-txt">
                            <div className="tertiary-btn-blk mr-20">
                                <span className="download-icon">
                                    <DownloadIcon />
                                </span>
                                Download
                            </div>
                            {value === 0 && (
                                <div className="form-btn">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/users/cgf-admin/add-sub-admin"
                                            )
                                        }
                                        className="primary-button add-button"
                                    >
                                        Add CGF Admin
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="member-filter-wrap flex-between">
                        <div className="member-tab-left">
                            <div className="member-tab-wrapper">
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: "divider",
                                    }}
                                    className="tabs-sect"
                                >
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="basic tabs example"
                                    >
                                        <Tab
                                            label="Onboarded"
                                            {...a11yProps(0)}
                                        />
                                        <Tab
                                            label="Pending"
                                            {...a11yProps(1)}
                                        />
                                    </Tabs>
                                </Box>
                            </div>
                        </div>
                        <div className="member-filter-left">
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
                        </div>
                        <div className="member-filter-right">
                            {/* <div className="filter-select-wrap flex-between">
                                <div className="filter-select-field">
                                    <div className="dropdown-field">
                                        <Select
                                            value={selectedRoles}
                                           
                                            onChange={(e) =>
                                                setSelectedRoles(e.target.value)
                                            }
                                          
                                            name="role"
                                        >
                                       

                                            {roles.map((role) => (
                                                <MenuItem
                                                    key={role._id}
                                                    value={role._id}
                                                >
                                                    {role.name}
                                                </MenuItem>
                                            ))}

                                       
                                        </Select>
                                    </div>
                                </div>

                                <div className="filter-select-field">
                                    <div className="dropdown-field">
                                        <Select
                                            value={filters.status}
                                            onChange={(e) =>
                                                onFilterChangeHandler(e)
                                            }
                                            name="status"
                                        >
                                            <MenuItem value="inactive" selected>
                                                In-active
                                            </MenuItem>
                                            <MenuItem value="active">
                                                Active
                                            </MenuItem>
                                            <MenuItem value="all">All</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
                        <TabPanel value={value} index={0}>
                            {value === 0 && (
                                <OnBoardedSubAdminsTable
                                    makeApiCall={makeApiCall}
                                    setMakeApiCall={setMakeApiCall}
                                    search={search}
                                    filters={filters}
                                    selectedRoles={selectedRoles}
                                />
                            )}
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            {/* <TableTester /> */}

                            <PendingCGFAdmins
                                makeApiCall={makeApiCall}
                                setMakeApiCall={setMakeApiCall}
                                search={search}
                                filters={filters}
                                myRef={myRef}
                                selectedRoles={selectedRoles}
                                toasterDetails={toasterDetails}
                                setToasterDetails={setToasterDetails}
                                // setWithdrawInviteid={setWithdrawInviteid}
                                // setOpenDeleteDialogBox={setOpenDeleteDialogBox}
                                // openDeleteDialogBox={openDeleteDialogBox}
                                // withdrawInviteById={withdrawInviteid}
                            />
                        </TabPanel>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SubAdminList;
