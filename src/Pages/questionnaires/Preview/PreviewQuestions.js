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
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';

const ITEM_HEIGHT = 22;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5,
        },
    },
};

const PreviewQuestions = ({ question }) => {
    const [datevalue, setDateValue] = React.useState(null);

    let questionLabel = question.questionTitle;

    let errorObject = {
        isRequired: question?.isRequired,
        validation: question?.validation,
    };
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
                className="input-field"
            />
        ) : question.inputType === "textarea" ? (
            <TextField
                placeholder={`Enter ${question.questionTitle}`}
                multiline={5}
                className="input-textarea"
            />
        ) : question.inputType === "dropdown" ? (
            <div className="form-group">
                <div className="select-field">
                    <Select
                        IconComponent={(props) => (
                            <KeyboardArrowDownRoundedIcon {...props} />
                        )}
                        value={`Select ${question.questionTitle}`}
                        MenuProps={MenuProps}
                    >
                        <MenuItem value={`Select ${question.questionTitle}`}>
                            {`Select ${question.questionTitle}`}
                        </MenuItem>
                        {question.options.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </div>
        ) : question.inputType === "radioGroup" ? (
            <div className="radio-btn-field radio-btn-half-blk">
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Active"
                    name="radio-buttons-group"
                    className="radio-btn"
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
            <div className="checkbox-with-labelblk checkbox-btn-half-blk">
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
                        OpenPickerIcon: DateRangeOutlinedIcon,
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

export default PreviewQuestions;
