import React from "react";
import {
    TextField,
    Select,
    MenuItem,
    FormGroup,
    Box,
    Modal,
    Fade,
    Backdrop,
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
    sectionUUID,
}) => {
    const [datevalue, setDateValue] = React.useState(null);

    let questionLabel = question.questionTitle;

    let errorObject = {
        isRequired: question?.isRequired,
        validation: question?.validation,
    };

    console.log("sectionUUID", sectionUUID);
    let questionUUID = question?.uuid;
    const handleChange = (e) => {
        const { name, value } = e.target;
        let tempAssessment = { ...assessmentQuestionnaire };
        // tempAssessment["sectionUUID"]['name'] = value;

        tempAssessment = {
            [sectionUUID]: {
                ...assessmentQuestionnaire[sectionUUID],
                [name]: value,
            },
        };
        setAssessmentQuestionnaire({
            ...tempAssessment,
        });
    };
    console.log("assessment answer", assessmentQuestionnaire);
    // const helperText = () => {
    //     if (errorObject.isRequired) {
    //         return assessmentUUID.sectionUUID.questionUUID === ""
    //             ? setError("required field is empty")
    //             : setError("  ");
    //     }
    //     if (errorObject.validation !== "") {

    //         if ( errorObject.validation === "character") {
    //             return assessmentUUID.sectionUUID.questionUUID.isalnum()
    //                 ? setError(" ")
    //                 : setError("required field should be numeric");
    //         }
    //         if (errorObject.validation === "numeric") {
    //             return assessmentUUID.sectionUUID.questionUUID.isalnum()
    //                 ? setError(" ")
    //                 : setError("required field should be numeric");
    //         }
    //         if (errorObject.validation === "alphabet") {
    //             return assessmentUUID.sectionUUID.questionUUID.isalpha()
    //                 ? setError(" ")
    //                 : setError("required field should be numeric");
    //         }
    //     }
    // };

    console.log("title preview question", questionLabel);
    console.log("title preview question", question.questionTitle);
    let questionComponent =
        question.inputType === "singleTextbox" ? (
            <TextField
                placeholder={`Enter ${question.questionTitle}`}
                // helperText={helperText}
                value={["sectionUUID"]["questionUUID"]}
                name={questionUUID}
                onChange={handleChange}
                className="input-field"
            />
        ) : question.inputType === "textarea" ? (
            <TextField
                placeholder={`Enter ${question.questionTitle}`}
                multiline={5}
                value={["sectionUUID"]["questionUUID"]}
                name={questionUUID}
                onChange={handleChange}
                className="input-textarea"
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
                        value={["sectionUUID"]["questionUUID"]}
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
                    defaultValue="Active"
                    // name="radio-buttons-group"
                    className="radio-btn radio-btn-vertical"
                    name={questionUUID}
                    onChange={handleChange}
                >
                    {question.options.map((option) => (
                        <FormControlLabel
                            value={option}
                            control={<Radio />}
                            label={option}
                        />
                    ))}
                </RadioGroup>
            </div>
        ) : question.inputType === "checkbox" ? (
            <div className="checkbox-with-labelblk">
                {question.options.map((option) => (
                    <FormControlLabel
                        className="checkbox-with-label"
                        control={<Checkbox />}
                        label={option}
                    />
                ))}
            </div>
        ) : question.inputType === "date" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    className="datepicker-blk"
                    components={{
                        OpenPickerIcon: CalendarMonthOutlinedIcon,
                    }}
                    datevalue={datevalue}
                    onChange={(newValue) => {
                        setDateValue(newValue);
                    }}
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
