import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Box, Tabs, Tab, Typography, MenuItem, Select } from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import useCallbackState from "../../utils/useCallBackState";
import { privateAxios } from "../../api/axios";
import Toaster from "../../components/Toaster";

import PendingOperationMembers from "./PendingOperationMembers";
import OnboardedOperationMember from "./OnboardedOperationMember";
import { useSelector } from "react-redux";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { DOWNLOAD_OPERATION_MEMBER } from "../../api/Url";
import { TabPanel } from "../../utils/tabUtils/TabPanel";
import { downloadFunction } from "../../utils/downloadFunction";
// function TabPanel(props) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`}
//             {...other}
//         >
//             {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//         </div>
//     );
// }
// TabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
// };

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}
function OperationMemberList() {
    //custom hook to set title of page
    useDocumentTitle("Operation Members");
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });
    const operationMemberRef = useRef();
    const [search, setSearch] = useState("");
    const [value, setValue] = React.useState(0);
    const [makeApiCall, setMakeApiCall] = useState(true);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const privilege = useSelector((state) => state.user?.privilege);
    const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
    let privilegeArray = privilege ? Object.values(privilege?.privileges) : [];
    let moduleAccessForOperationMember = privilegeArray
        .filter((data) => data?.moduleId?.name === "Operation Members")
        .map((data) => ({
            operationMember: {
                list: data.list,
                view: data.view,
                edit: data.edit,
                delete: data.delete,
                add: data.add,
            },
        }));
    console.log(
        "member operation privilege",
        moduleAccessForOperationMember[0]?.operationMember
    );

    const downloadOperationMembers = async () => {
        try {
            const response = await privateAxios.get(DOWNLOAD_OPERATION_MEMBER, {
                responseType: "blob",
            });
            console.log(
                "resposne from download operation members admins",
                response
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `Operation Members - ${new Date()}.xls`
            );
            document.body.appendChild(link);
            link.click();
            if (response.status == 200) {
                setToasterDetails(
                    {
                        titleMessage: "Success!",
                        descriptionMessage: "Download successfull!",

                        messageType: "success",
                    },
                    () => operationMemberRef.current()
                );
            }
        } catch (error) {
            console.log("Error from download operation members", error);
        }
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
                // setPage(1);
            }, 1000)
        );
    };

    const [filters, setFilters] = useState({
        companyType: "",
        createdBy: "",
        status: "",
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const navigate = useNavigate();
    return (
        <>
            <div className="page-wrapper">
                {/* <DialogBox
                    title={`Withdraw CGF Admin Invitation`}
                    info1={
                        "On withdrawal, cgf admin will not be able to verify their account?"
                    }
                    info2={"Do you want to withdraw the invitation?"}
                    primaryButtonText={"Yes"}
                    secondaryButtonText={"No"}
                    onPrimaryModalButtonClickHandler={() => {
                        // withdrawInviteById();
                    }}
                    onSecondaryModalButtonClickHandler={() => {
                        // setOpenDeleteDialogBox(false);
                    }}
                    openModal={openDeleteDialogBox}
                    setOpenModal={setOpenDeleteDialogBox}
                /> */}
                <Toaster
                    myRef={operationMemberRef}
                    titleMessage={toasterDetails.titleMessage}
                    descriptionMessage={toasterDetails.descriptionMessage}
                    messageType={toasterDetails.messageType}
                />
                <section>
                    <div className="container">
                        <div className="member-filter-sect"></div>

                        <div className="form-header member-form-header flex-between">
                            <div className="form-header-left-blk flex-start">
                                <h2 className="heading2 mr-40">
                                    Operation Members
                                </h2>
                            </div>
                            <div className="form-header-right-txt">
                                {value == 0 && (
                                    <div
                                        className="tertiary-btn-blk mr-20"
                                        onClick={() =>
                                            downloadFunction(
                                                "Operation Members",
                                                setToasterDetails,
                                                // params.id,
                                                operationMemberRef,
                                                DOWNLOAD_OPERATION_MEMBER
                                            )
                                        }
                                    >
                                        <span className="download-icon">
                                            <DownloadIcon />
                                        </span>
                                        Download
                                    </div>
                                )}
                                {(SUPER_ADMIN === true ||
                                    moduleAccessForOperationMember[0]
                                        .operationMember.add === true) &&
                                    value === 0 && (
                                        <div className="form-btn">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        "/users/operation-members/add-operation-member"
                                                    )
                                                }
                                                className="primary-button add-button"
                                            >
                                                Add Operation Member
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
                                        value={search}
                                        onChange={
                                            (e) => onSearchChangeHandler(e)

                                            // setSearch(e.target.value)
                                        }
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
                                                value={filters.companyType}
                                                // defaultValue="none"
                                                displayEmpty
                                                onChange={(e) => {
                                                    setFilters({
                                                        ...filters,
                                                        companyType:
                                                            e.target.value,
                                                    });
                                                }}
                                                renderValue={(value) => {
                                                    if (value.length < 1) {
                                                        return (
                                                            <em>
                                                                Select company
                                                                type
                                                            </em>
                                                        );
                                                    } else {
                                                        return value;
                                                    }
                                                }}
                                            >
                                                <MenuItem disabled value="">
                                                    Select Company Type
                                                </MenuItem>
                                                <MenuItem
                                                    key={"internal"}
                                                    value={"internal"}
                                                >
                                                    Internal
                                                </MenuItem>
                                                <MenuItem
                                                    key={"external"}
                                                    value={"external"}
                                                >
                                                    External
                                                </MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="filter-select-field">
                                        <div className="dropdown-field">
                                            <Select
                                                value={filters.createdBy}
                                                // defaultValue="none"
                                                displayEmpty
                                                onChange={(e) => {
                                                    setFilters({
                                                        ...filters,
                                                        createdBy:
                                                            e.target.value,
                                                    });
                                                }}
                                                renderValue={(value) => {
                                                    if (value.length < 1) {
                                                        return (
                                                            <em>
                                                                Select created
                                                                By
                                                            </em>
                                                        );
                                                    } else {
                                                        return value;
                                                    }
                                                }}
                                            >
                                                <MenuItem disabled value="">
                                                    Select created by
                                                </MenuItem>
                                                <MenuItem
                                                    key={"internal"}
                                                    value={"internal"}
                                                >
                                                    Internal
                                                </MenuItem>
                                                <MenuItem
                                                    key={"external"}
                                                    value={"external"}
                                                >
                                                    External
                                                </MenuItem>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="filter-select-field">
                                        <div className="dropdown-field">
                                            <Select
                                                value={filters.status}
                                                displayEmpty
                                                onChange={(e) =>
                                                    // onFilterChangeHandler(e)
                                                    setFilters({
                                                        ...filters,
                                                        status: e.target.value,
                                                    })
                                                }
                                                renderValue={(value) => {
                                                    if (value.length < 1) {
                                                        return (
                                                            <em>
                                                                Select status
                                                            </em>
                                                        );
                                                    } else {
                                                        return value;
                                                    }
                                                }}
                                                name="status"
                                            >
                                                <MenuItem value="">
                                                    Select status
                                                </MenuItem>
                                                <MenuItem value="inactive">
                                                    In-active
                                                </MenuItem>
                                                <MenuItem value="active">
                                                    Active
                                                </MenuItem>
                                                <MenuItem value="all">
                                                    All
                                                </MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="member-info-wrapper table-content-wrap">
                            <TabPanel value={value} index={0}>
                                <OnboardedOperationMember
                                    makeApiCall={makeApiCall}
                                    setMakeApiCall={setMakeApiCall}
                                    search={search}
                                    filters={filters}
                                    setSearch={setSearch}
                                    setFilters={setFilters}
                                    searchTimeout={searchTimeout}
                                    setSearchTimeout={setSearchTimeout}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <PendingOperationMembers
                                    makeApiCall={makeApiCall}
                                    setMakeApiCall={setMakeApiCall}
                                    search={search}
                                    filters={filters}
                                    setSearch={setSearch}
                                    setFilters={setFilters}
                                    setToasterDetails={setToasterDetails}
                                    myRef={operationMemberRef}
                                />
                            </TabPanel>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default OperationMemberList;
