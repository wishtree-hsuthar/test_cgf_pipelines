import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import {  Tabs, Tab, Box } from "@mui/material";
import DraftedQuestionnaires from "./DraftedQuestionnaires";
import { useSelector } from "react-redux";
import PublishedQuestionnaires from "./PublishedQuestionnaires";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { TabPanel } from "../../utils/tabUtils/TabPanel";

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

function a11yPropsQuestionnaireList(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}
function QuestionnairesList() {
    //custom hook to set title of page
    useDocumentTitle("Questionnaires");
    const navigateQuestionnaire = useNavigate();
    const addQuestionnaire = () => {
        navigateQuestionnaire(`/questionnaires/add-questionnaire/${uuidv4()}`);
    };
    const [searchTimeoutQuestionnaire, setSearchTimeoutQuestionnaire] = useState(null);
    //state to hold wheather to make api call or not
    const [makeApiCallQuestionnaire, setMakeApiCallQuestionnaire] = useState(true);

    //state to hold search keyword
    const [searchQuestionnaire, setSearchQuestionnaire] = useState("");
    const [questionnaireValue, setQuestionnaireValue] = React.useState(0);

    const onQuestionnaireSearchChangeHandler = (e) => {
        // console.log("event", e.key);
        if (searchTimeoutQuestionnaire) clearTimeout(searchTimeoutQuestionnaire);
        setMakeApiCallQuestionnaire(false);
        // console.log("searchQuestionnaire values", e.target.value);
        setSearchQuestionnaire(e.target.value);
        setSearchTimeoutQuestionnaire(
            setTimeout(() => {
                setMakeApiCallQuestionnaire(true);
                // setPage(1);
            }, 1000)
        );
    };

    const privilege = useSelector((state) => state?.user?.privilege);
    const userAuth = useSelector((state) => state?.user?.userObj);
    const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
    let QuestionnairePrivilgeArray =
        userAuth?.roleId?.name === "Super Admin"
            ? []
            : Object.values(privilege?.privileges);
    let moduleAccesForMember = QuestionnairePrivilgeArray
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
    // console.log(
    //     "module access member in view member",
    //     moduleAccesForMember[0]?.member
    // );


    const handleChange = (event, newValue) => {
        setQuestionnaireValue(newValue);
    };

    return (
        <div className="page-wrapper">
            <section>
                <div className="container">
                    <div className="form-header member-form-header flex-between">
                        <div className="form-header-left-blk flex-start">
                            <h2 className="heading2 mr-40">Questionnaires</h2>
                        </div>
                        <div className="form-header-right-txt">
                            {(SUPER_ADMIN == true ||
                                moduleAccesForMember[0]?.questionnaire
                                    ?.add) && (
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
                                            value={questionnaireValue}
                                            onChange={handleChange}
                                            aria-label="basic tabs example"
                                        >
                                            <Tab
                                                label="Published"
                                                {...a11yPropsQuestionnaireList(0)}
                                            />
                                            <Tab
                                                label="Drafted"
                                                {...a11yPropsQuestionnaireList(1)}
                                            />
                                        </Tabs>
                                    </Box>
                                </div>
                            </div>
                            <div className="member-filter-left">
                                <div className="searchbar">
                                    <input
                                        type="text"
                                        value={searchQuestionnaire}
                                        name="search"
                                        placeholder="Search"
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            setMakeApiCallQuestionnaire(true)
                                        }
                                        onChange={onQuestionnaireSearchChangeHandler}
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
                        <TabPanel value={questionnaireValue} index={1}>
                            <DraftedQuestionnaires
                                makeApiCall={makeApiCallQuestionnaire}
                                setMakeApiCall={setMakeApiCallQuestionnaire}
                                search={searchQuestionnaire}
                                setSearch={setSearchQuestionnaire}
                                searchTimeoutQuestionnaire={searchTimeoutQuestionnaire}
                            />
                        </TabPanel>
                        <TabPanel value={questionnaireValue} index={0}>
                            <PublishedQuestionnaires
                                makeApiCall={makeApiCallQuestionnaire}
                                setMakeApiCall={setMakeApiCallQuestionnaire}
                                search={searchQuestionnaire}
                                setSearch={setSearchQuestionnaire}
                                searchTimeoutQuestionnaire={searchTimeoutQuestionnaire}
                            />
                        </TabPanel>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default QuestionnairesList;
