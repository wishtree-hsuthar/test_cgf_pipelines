import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Tabs, Tab, Tooltip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import FillAssesmentSection from "./FillAssessmentSection";
import { ADD_QUESTIONNAIRE, ASSESSMENTS, FETCH_ASSESSMENT_BY_ID, SUBMIT_ASSESSMENT_AS_DRAFT } from "../../api/Url";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";

const ITEM_HEIGHT = 22;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5,
        },
    },
};

const getTransformedColumns = (columns) => {
    let transformedColumns = {};
    columns.forEach((column) => {
        transformedColumns[column.uuid] = column;
    });
    return transformedColumns;
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
                    {children}
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
    const [errorQuestion, setErrorQuestion] = useState("");
    const [errorQuestionUUID, setErrorQuestionUUID] = useState("");

    const [errors, setErrors] = useState({});

    //Toaster Message setter
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });

    const handleSetErrors = (errors) => {
        setErrors({ ...errors });
    };

    useEffect(() => {
        let isMounted = true;
        let controller = new AbortController();
        const fetchQuestionnaire = async (id) => {
            try {
                const response = await privateAxios.get(
                    `${ADD_QUESTIONNAIRE}/${id}`,
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
                    `${ASSESSMENTS}${params.id}`,
                    {
                        signal: controller.signal,
                    }
                );
                console.log("response from fetch assessment", response);
                isMounted && setAssessments({ ...response.data });
                isMounted &&
                    setAssessmentQuestionnaire({
                        ...response.data.answers,
                    });
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

    const myRef = useRef();

    const saveAssessmentAsDraft = async () => {
        console.log("Save function called");
        try {
            const response = await privateAxios.post(
                SUBMIT_ASSESSMENT_AS_DRAFT + params.id,
                {
                    ...assessmentQuestionnaire,
                }
            );
            console.log("Assessment is saved as draft", response);
            setToasterDetails(
                {
                    titleMessage: "Success",
                    descriptionMessage: response?.data?.message,
                    messageType: "success",
                },
                () => myRef.current()
            );
        } catch (error) {
            console.log("error from save assessment as draft", error);
            setToasterDetails(
                {
                    titleMessage: "Error",
                    descriptionMessage:
                        error?.response?.data?.message &&
                        typeof error.response.data.message === "string"
                            ? error.response.data.message
                            : "Something Went Wrong!",
                    messageType: "error",
                },
                () => myRef.current()
            );
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const tempErrors = {};

        questionnaire?.sections?.map((section) => {
            let sectionErrors = errors[section?.uuid] ?? {};
            let currentSectionAnswers =
                assessmentQuestionnaire[section?.uuid] ?? {};

            if (section?.layout === "table") {
                const transformedColValues = getTransformedColumns(
                    section?.columnValues
                );

                section?.rowValues.map((row) => {
                    row?.cells?.map((cell) => {
                        if (
                            transformedColValues[cell?.columnId].columnType !==
                                "prefilled" &&
                            (!currentSectionAnswers[
                                `${cell?.columnId}.${row?.uuid}`
                            ] ||
                                currentSectionAnswers[
                                    `${cell?.columnId}.${row?.uuid}`
                                ].length === 0)
                        ) {
                            sectionErrors[`${cell?.columnId}.${row?.uuid}`] =
                                "This is required field";
                        } else {
                            delete sectionErrors[
                                `${cell?.columnId}.${row?.uuid}`
                            ];
                        }
                    });
                });
            } else {
                // form validators
                section?.questions.map((question) => {
                    if (
                        question.isRequired &&
                        (!currentSectionAnswers[question?.uuid] ||
                            currentSectionAnswers[question?.uuid].length === 0)
                    ) {
                        sectionErrors[question?.uuid] =
                            "This is required field";
                    } else {
                        delete sectionErrors[question?.uuid];
                    }
                });
            }

            tempErrors[section?.uuid] = { ...sectionErrors };
        });

        handleSetErrors(tempErrors);
        const isValidated = Object.keys(tempErrors).every(
            (key) => Object.keys(tempErrors[key]).length === 0
        );
        if (isValidated) {
            saveAssessmentAsDraft();
        }
    };

    useEffect(() => {
        console.log("UseEffect Errors", errors);
    }, [errors]);

    const [datevalue, setDateValue] = React.useState(null);
    return (
        <div className="page-wrapper">
            <Toaster
                myRef={myRef}
                titleMessage={toasterDetails.titleMessage}
                descriptionMessage={toasterDetails.descriptionMessage}
                messageType={toasterDetails.messageType}
            />
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
                                                    key={section?.uuid}
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
                                <TabPanel value={value} index={index} key={section?.uuid}>
                                    <FillAssesmentSection
                                        assessmentQuestionnaire={
                                            assessmentQuestionnaire
                                        }
                                        setAssessmentQuestionnaire={
                                            setAssessmentQuestionnaire
                                        }
                                        section={section}
                                        errorQuestion={errorQuestion}
                                        setErrorQuestion={setErrorQuestion}
                                        errorQuestionUUID={errorQuestionUUID}
                                        setErrorQuestionUUID={
                                            setErrorQuestionUUID
                                        }
                                        errors={errors[section?.uuid] ?? {}}
                                        // handleSetErrors={handleSetErrors}
                                        handleFormSubmit={handleFormSubmit}
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
