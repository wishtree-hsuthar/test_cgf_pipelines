import React, { useState } from "react";
import {
    TextField,
    Select,
    MenuItem,
    Checkbox,
    Radio,
    FormControlLabel,
    RadioGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

export const AlphaRegEx = /^[a-z]+$/i;
export const NumericRegEx = /^[0-9]+$/i;
export const AlphaNumRegEx = /^[a-z0-9]+$/i;

const ITEM_HEIGHT = 22;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5,
        },
    },
};

const FillAssessmentQuestion = ({
    assessmentQuestionnaire,
    setAssessmentQuestionnaire,
    question,
    error,
    setError,
    sectionUUID,
    // selectedValues,
    // setSelectedValues,
    setErrorQuestion,
    errorQuestion,
    errorQuestionUUID,
    setErrorQuestionUUID,
}) => {
    const [datevalue, setDateValue] = React.useState(null);
    // const [errorQuestionUUID, setErrorQuestionUUID] = useState("");
    // const [selectedValues, setSelectedValues] = React.useState([]);

    let questionLabel = question.questionTitle;

    let errorObject = {
        isRequired: question?.isRequired,
        validation: question?.validation,
    };

    const checkNumericValue = (value) => {
        if (NumericRegEx.test(value)) {
            setErrorQuestion("");
            setErrorQuestionUUID();
            return true;
        } else {
            setErrorQuestionUUID(questionUUID);
            setErrorQuestion("Enter numeric value");
            return false;
        }
    };
    const checkCharacterValue = (value) => {
        if (AlphaNumRegEx.test(value)) {
            setErrorQuestion("");
            setErrorQuestionUUID();
            return true;
        } else {
            setErrorQuestionUUID(questionUUID);
            setErrorQuestion("Enter character value");
            return false;
        }
    };

    console.log("sectionUUID", sectionUUID);
    let questionUUID = question?.uuid;
    const handleChange = (e) => {
        const { name, value } = e.target;
        let tempAssessment = { ...assessmentQuestionnaire };
        console.log("question uuid: ", questionUUID);

        if (errorObject.validation === "numeric") {
            checkNumericValue(value);
        }
        if (errorObject.validation === "character") {
            checkCharacterValue(value);
        }
        tempAssessment = {
            ...assessmentQuestionnaire,
            [sectionUUID]: {
                ...assessmentQuestionnaire[sectionUUID],
                [name]: value,
            },
        };

        setAssessmentQuestionnaire({
            ...tempAssessment,
        });
    };
    const handleDate = (name, newValue) => {
        let tempAssessment = { ...assessmentQuestionnaire };

        tempAssessment = {
            ...assessmentQuestionnaire,
            [sectionUUID]: {
                ...assessmentQuestionnaire[sectionUUID],
                [name]: newValue,
            },
        };
        setAssessmentQuestionnaire({
            ...tempAssessment,
        });
    };
    const handleChecked = (e) => {
        const { name, value, checked } = e.target;
        let tempAssessment = { ...assessmentQuestionnaire };
        console.log("question uuid: ", questionUUID);
        console.log(`VALUE=${value} is ${checked}`);
        let values =
            assessmentQuestionnaire[sectionUUID] &&
            assessmentQuestionnaire[sectionUUID][questionUUID]
                ? assessmentQuestionnaire[sectionUUID][questionUUID]
                : [];
        if (checked) {
            values.push(value);
        } else {
            values = values.filter((v) => v !== value);
        }

        tempAssessment = {
            ...assessmentQuestionnaire,
            [sectionUUID]: {
                ...assessmentQuestionnaire[sectionUUID],
                [name]:
                    assessmentQuestionnaire[sectionUUID] &&
                    assessmentQuestionnaire[sectionUUID][questionUUID]
                        ? [...values]
                        : [value],
            },
        };
        setAssessmentQuestionnaire({
            ...tempAssessment,
        });
    };
    // console.log("values ====", selectedValues);

    console.log("assessment answer", assessmentQuestionnaire);
    // console.log(
    //     "assessment answer of selected question",

    //     assessmentQuestionnaire?.sectionUUID?.questionUUID
    // );
    const helperText = () => {
        // if (errorObject.isRequired) {
        //     return assessmentQuestionnaire.sectionUUID.questionUUID === ""
        //         ? setError("required field is empty")
        //         : setError("  ");
        // }
        if (errorObject.validation !== "") {
            if (errorObject.validation === "character") {
                return assessmentQuestionnaire[sectionUUID] &&
                    assessmentQuestionnaire[sectionUUID][questionUUID].isalnum()
                    ? " "
                    : "required field should be character";
            }
            if (errorObject.validation === "numeric") {
                return assessmentQuestionnaire[sectionUUID] &&
                    assessmentQuestionnaire[sectionUUID][questionUUID].isalnum()
                    ? " "
                    : "required field should be numeric";
            }
            if (errorObject.validation === "alpanumeric") {
                return assessmentQuestionnaire.sectionUUID.questionUUID.isalpha()
                    ? " "
                    : "required field should be numeric";
            }
        }
    };

    console.log("title preview question", questionLabel);
    console.log("title preview question", question.questionTitle);
    let questionComponent =
        question.inputType === "singleTextbox" ? (
            <TextField
                placeholder={`Enter ${question.questionTitle}`}
                // helperText={helperText}
                value={
                    assessmentQuestionnaire[sectionUUID] &&
                    assessmentQuestionnaire[sectionUUID][questionUUID]
                        ? assessmentQuestionnaire[sectionUUID][questionUUID]
                        : ""
                }
                // helperText={help}
                // value={assessmentQuestionnaire?.sectionUUID?.questionUUID}
                name={questionUUID}
                onChange={handleChange}
                className="input-field"
                helperText={errorQuestionUUID === questionUUID && errorQuestion}
            />
        ) : question.inputType === "textarea" ? (
            <TextField
                placeholder={`Enter ${question.questionTitle}`}
                multiline={5}
                value={
                    assessmentQuestionnaire[sectionUUID] &&
                    assessmentQuestionnaire[sectionUUID][questionUUID]
                        ? assessmentQuestionnaire[sectionUUID][questionUUID]
                        : ""
                }
                name={questionUUID}
                onChange={handleChange}
                className="input-textarea"
                helperText={
                    errorQuestion === questionUUID
                        ? `${question.questionTitle} required.`
                        : ""
                }
            />
        ) : question.inputType === "dropdown" ? (
            <div className="form-group">
                <div className="select-field">
                    <Select
                        IconComponent={(props) => (
                            <KeyboardArrowDownRoundedIcon {...props} />
                        )}
                        name={questionUUID}
                        // value={`Select ${question.questionTitle}`}
                        value={
                            assessmentQuestionnaire[sectionUUID] &&
                            assessmentQuestionnaire[sectionUUID][questionUUID]
                                ? assessmentQuestionnaire[sectionUUID][
                                      questionUUID
                                  ]
                                : ""
                        }
                        MenuProps={MenuProps}
                        onChange={handleChange}
                    >
                        {/* <MenuItem value={`Select ${question.questionTitle}`}>
                            {`Select ${question.questionTitle}`}
                        </MenuItem> */}
                        {question.options.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </div>
        ) : question.inputType === "radioGroup" ? (
            <div className="radio-btn-field">
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    // defaultValue="Active"
                    // name="radio-buttons-group"
                    className="radio-btn radio-btn-vertical"
                    value={
                        assessmentQuestionnaire[sectionUUID] &&
                        assessmentQuestionnaire[sectionUUID][questionUUID]
                            ? assessmentQuestionnaire[sectionUUID][questionUUID]
                            : ""
                    }
                    name={questionUUID}
                    onChange={handleChange}
                >
                    {question.options.map((option) => (
                        <FormControlLabel
                            value={option}
                            control={
                                <Radio
                                // checked={
                                //     assessmentQuestionnaire &&
                                //     assessmentQuestionnaire[sectionUUID] &&
                                //     assessmentQuestionnaire[sectionUUID][
                                //         questionUUID
                                //     ]
                                //         ? true
                                //         : false
                                // }
                                // value={option}
                                />
                            }
                            label={option}
                        />
                    ))}
                </RadioGroup>
            </div>
        ) : question.inputType === "checkbox" ? (
            <div className="checkbox-with-labelblk">
                {/* <FormGroup> */}
                {question.options.map((option) => (
                    <>
                        <FormControlLabel
                            type={"checkbox"}
                            name={questionUUID}
                            className="checkbox-with-label"
                            value={option}
                            control={<Checkbox />}
                            checked={
                                assessmentQuestionnaire[sectionUUID] &&
                                assessmentQuestionnaire[sectionUUID][
                                    questionUUID
                                ]
                                    ? assessmentQuestionnaire[sectionUUID][
                                          questionUUID
                                      ].includes(option)
                                    : false
                            }
                            onChange={handleChecked}
                        />
                        <labe>{option}</labe>
                    </>
                ))}
                {/* </FormGroup> */}
            </div>
        ) : question.inputType === "date" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    className="datepicker-blk"
                    components={{
                        OpenPickerIcon: CalendarMonthOutlinedIcon,
                    }}
                    value={
                        assessmentQuestionnaire[sectionUUID] &&
                        assessmentQuestionnaire[sectionUUID][questionUUID]
                            ? assessmentQuestionnaire[sectionUUID][questionUUID]
                            : ""
                    }
                    onChange={(newValue) => handleDate(questionUUID, newValue)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        ) : (
            ""
        );
    return (
        <div className="preview-que-blk">
            <div className="form-group">
                <label htmlFor="questionTitle">
                    <div class="preview-sect-txt">
                        {questionLabel}
                        {question?.isRequired && (
                            <span className="mandatory"> *</span>
                        )}
                    </div>
                </label>
                <div className="que-half-sect">{questionComponent}</div>
            </div>
        </div>
    );
};

export default FillAssessmentQuestion;
