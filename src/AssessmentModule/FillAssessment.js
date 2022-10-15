import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import PropTypes from "prop-types";
import { Tabs, Tab, Tooltip } from "@mui/material";

import PreviewSection from "../Pages/PreviewSection";
import { useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../api/axios";
import FillAssesmentSection from "./FillAssessmentSection";

const ITEM_HEIGHT = 22;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5,
        },
    },
};
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
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
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

function FillAssessment() {
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const params = useParams();
    const navigate = useNavigate();
    const [assessment, setAssessments] = useState({});
    const [questionnaire, setQuestionnaire] = useState({});
    const [assessmentQuestionnaire, setAssessmentQuestionnaire] = useState({});
    useEffect(() => {
        let isMounted = true;
        let controller = new AbortController();
        const fetchQuestionnaire = async (id) => {
            try {
                const response = await privateAxios.get(
                    `http://localhost:3000/api/questionnaires/${id}`,
                    {
                        signal: controller.signal,
                    }
                );
                console.log("response from fetch questionnaire", response);
                isMounted && setQuestionnaire({ ...response.data });
            } catch (error) {
                console.log("error from fetch questionnaire", error);
            }
        };

        const fetchAssessments = async () => {
            try {
                const response = await privateAxios.get(
                    `http://localhost:3000/api/assessments/${params.id}`,
                    {
                        signal: controller.signal,
                    }
                );
                console.log("response from fetch assessment", response);
                isMounted && setAssessments({ ...response.data });
                fetchQuestionnaire(response?.data?.questionnaireId);
            } catch (error) {
                console.log("error from fetch assessment", error);
            }
        };
        fetchAssessments();
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    const [datevalue, setDateValue] = React.useState(null);
    return (
        <div className="page-wrapper">
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <a
                                onClick={() => navigate(`/assessment-list`)}
                                style={{ cursor: "pointer" }}
                            >
                                Assessment
                            </a>
                        </li>

                        <li>{assessment?.assessmentTitle}</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between">
                        <h2 className="heading2">{questionnaire.title}</h2>
                    </div>
                    {/* <div className="que-ttl-blk">
                        <div className="form-group mb-0">
                            <label for="">
                                Questionnaire Title{" "}
                                <span className="mandatory">*</span>
                            </label>
                            <TextField
                                className="input-field"
                                id="outlined-basic"
                                value={questionnaire.title}
                                placeholder="Enter questionnaire title"
                                variant="outlined"
                            />
                        </div>
                    </div> */}
                    <div className="section-form-sect">
                        <div className="section-tab-blk flex-between preview-tab-blk">
                            <div className="section-tab-leftblk">
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: "divider",
                                    }}
                                    className="tabs-sect que-tab-sect"
                                >
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="basic tabs example"
                                    >
                                        {questionnaire?.sections?.map(
                                            (section, index, id) => (
                                                <Tooltip
                                                    title={section.sectionTitle}
                                                    placement="bottom-start"
                                                >
                                                    <Tab
                                                        className="section-tab-item"
                                                        label={`section ${
                                                            index + 1
                                                        }`}
                                                        {...a11yProps(index)}
                                                    />
                                                </Tooltip>
                                            )
                                        )}
                                    </Tabs>
                                </Box>
                            </div>
                        </div>
                        <div className="preview-tab-data">
                            {questionnaire?.sections?.map((section, index) => (
                                <TabPanel value={value} index={index}>
                                    <FillAssesmentSection
                                        assessmentQuestionnaire={
                                            assessmentQuestionnaire
                                        }
                                        setAssessmentQuestionnaire={
                                            setAssessmentQuestionnaire
                                        }
                                        section={section}
                                    />
                                </TabPanel>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FillAssessment;
