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
import DialogBox from "../components/DialogBox";

import TableTester from "../components/TableTester";
import TableComponent from "../components/TableComponent";
import useCallbackState from "../utils/useCallBackState";
import { privateAxios } from "../api/axios";
import { FETCH_SUB_ADMIN_BY_ADMIN, REPLACE_SUB_ADMIN } from "../api/Url";
import Toaster from "../components/Toaster";

const tableHead = [
    // {
    //     id: "",
    //     disablePadding: true,
    //     label: "Select User",
    //     width: "10%",
    // },
    {
        id: "operationMember",
        disablePadding: true,
        label: "Operation Member",
        width: "30%",
    },
    {
        id: "emailId",
        disablePadding: false,
        label: "Email Id",
        width: "40%",
    },
];

const AssignAssessmentToOperationMember = () => {
    const keysOrder = ["_id", "operationMember", "email"];

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

    const [open, setOpen] = useState();
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

        let url = `http://localhost:3000/api/users/cgfadmin?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`;
        if (search?.length >= 3)
            url = `http://localhost:3000/api/users/cgfadmin?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}&search=${search}`;

        return url;
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
        setSelectedUser(id);
    };
    return (
        <div class="page-wrapper">
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
                        <h2 className="heading2">Replace</h2>
                        <h4>Replace sub-admin with following:</h4>
                        <div
                            className="form-header-right-txt 
member-filter-right
       
       "
                        >
                            {/* <div className="tertiary-btn-blk"> */}
                            <div className="searchbar">
                                <input
                                    type="text"
                                    placeholder="Search sub-admin name, email "
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
                            onClick={() => navigate("/sub-admins")}
                            className="secondary-button mr-10"
                        >
                            Cancel
                        </button>
                        <button
                            // onClick={openReplaceDailogBox}
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
