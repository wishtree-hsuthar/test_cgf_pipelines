import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select, Tabs, Tab, Box } from "@mui/material";
import TableComponent from "../../components/TableComponent";
import DraftedQuestionnaires from "./DraftedQuestionnaires";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

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
function QuestionnairesList() {
    const navigate = useNavigate();
    const addQuestionnaire = () => {
        navigate(`/questionnaires/add-questionnaire/${uuidv4()}`);
    };
    const [searchTimeout, setSearchTimeout] = useState(null);
    //state to hold wheather to make api call or not
    const [makeApiCall, setMakeApiCall] = useState(true);

    //state to hold search keyword
    const [search, setSearch] = useState("");
    const [value, setValue] = React.useState(0);

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
    console.log(
        "module access member in view member",
        moduleAccesForMember[0]?.member
    );

    const [filters, setFilters] = useState({
        companyType: "",
        createdBy: "",
        status: "",
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="page-wrapper">
            <section>
                <div className="container">
                    <div className="form-header member-form-header flex-between">
                        <div className="form-header-left-blk flex-start">
                            <h2 className="heading2 mr-40">
                                Questionaire List
                            </h2>
                        </div>
                        <div className="form-header-right-txt">
                            {(SUPER_ADMIN == true ||
                                moduleAccesForMember[0]?.member?.add) && (
                                <div className="form-btn">
                                    <button
                                        type="submit"
                                        className="primary-button add-button"
                                        onClick={addQuestionnaire}
                                    >
                                        Add Questionnaire
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="member-filter-sect">
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
                                                label="Drafted"
                                                {...a11yProps(0)}
                                            />
                                            <Tab
                                                label="Published"
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
                            {/* <div className="member-filter-right">
                                <div className="filter-select-wrap flex-between">
                                    <div className="filter-select-field">
                                        <div className="dropdown-field">
                                            <Select
                                                sx={{ display: "none" }}
                                                name="status"
                                                value={filters.status}
                                                onChange={onFilterChangehandler}
                                                onFocus={(e) =>
                                                    onFilterFocusHandler(
                                                        "status"
                                                    )
                                                }
                                            >
                                                <MenuItem
                                                    value="none"
                                                    sx={{
                                                        display:
                                                            showFilterPlaceholder ===
                                                                "status" &&
                                                            "none",
                                                    }}
                                                >
                                                    Status
                                                </MenuItem>
                                                <MenuItem value="active">
                                                    Active
                                                </MenuItem>
                                                <MenuItem value="inactive">
                                                    Inactive
                                                </MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className="member-info-wrapper table-content-wrap">
                        <TabPanel value={value} index={0}>
                            <DraftedQuestionnaires
                                makeApiCall={makeApiCall}
                                setMakeApiCall={setMakeApiCall}
                                search={search}
                                setSearch={setSearch}
                                searchTimeout={searchTimeout}
                            />
                        </TabPanel>
                        <TabPanel value={value} index={1}></TabPanel>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default QuestionnairesList;
