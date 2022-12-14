import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
  FormHelperText,
  FormGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import { useParams } from "react-router-dom";

export const AlphaRegEx = /^[a-zA-Z ]*$/;
export const NumericRegEx = /^[0-9]+$/i;
export const AlphaNumRegEx = /^[a-z0-9]+$/i;

const ITEM_HEIGHT = 42;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4,
    },
  },
};

const FillAssessmentQuestion = ({
  question,
  error,
  answer,
  handleAnswersChange,
  handleAnswersBlur,
  editMode,
  setEditMode,
}) => {
  let questionLabel = question.questionTitle;
  let errorObject = {
    isRequired: question?.isRequired,
    validation: question?.validation,
  };

  let questionUUID = question?.uuid;
  const handleOnKeyDownChange = (e) => {
    e.preventDefault();
  };
  const handleChecked = (e) => {
    const { name, value, checked } = e.target;
    let values = answer;

    if (checked) {
      values.push(value);
    } else {
      values = values.filter((v) => v !== value);
    }

    handleAnswersChange(name, values);
  };

  const params = useParams();
  console.log(
    "disabled in form section question",
    editMode && params["*"].includes("view")
  );
  console.log("viewmode in form section question", editMode);
  console.log("params in form section question", params["*"].includes("view"));
  //   answer === "" && console.log("answe blank string")
  let questionComponent =
    question.inputType === "singleTextbox" ? (
      <TextField
        disabled={(editMode && params["*"].includes("view")) || !editMode}
        placeholder={`Enter text here`}
        value={answer ?? ""}
        name={questionUUID}
        onChange={(e) => handleAnswersChange(e.target.name, e.target.value)}
        onBlur={(e) => handleAnswersBlur(e.target.name, e.target.value)}
        className={`${
          !answer && error && error?.length !== 0
            ? "input-error"
            : question.validation === "numeric" &&
              !NumericRegEx.test(answer) &&
              answer &&
              error
            ? "input-error"
            : question.validation === "alphabets" &&
              !AlphaRegEx.test(answer) &&
              answer &&
              error
            ? "input-error"
            : question.validation === "alphanumeric" &&
              !AlphaNumRegEx.test(answer) &&
              answer &&
              error
            ? "input-error"
            : "input-field"
        }`}
        helperText={
          question.validation === "alphanumeric" &&
          !AlphaNumRegEx.test(answer) &&
          answer
            ? error
            : question.validation === "alphabets" &&
              !AlphaRegEx.test(answer) &&
              answer
            ? error
            : question.validation === "numeric" &&
              !NumericRegEx.test(answer) &&
              answer
            ? error
            : !answer && error
            ? error
            : ""
        }
      />
    ) : question.inputType === "textarea" ? (
      <TextField
        disabled={(editMode && params["*"].includes("view")) || !editMode}
        placeholder={`Enter text here`}
        multiline
        value={answer ?? ""}
        name={questionUUID}
        onChange={(e) => handleAnswersChange(e.target.name, e.target.value)}
        onBlur={(e) => handleAnswersBlur(e.target.name, e.target.value)}
        // className="input-textarea"
        className={`input-textarea ${
          !answer &&
          error &&
          error?.length !== 0 &&
          "input-textarea input-textarea-error"
        }`}
        helperText={!answer && error ? error : ""}
        variant="outlined"
      />
    ) : question.inputType === "dropdown" ? (
      <FormControl className="fullwidth-field">
        <div className="form-group">
          <div
            className={`select-field ${
              !answer && error && error?.length !== 0 && "select-field-error"
            }`}
          >
            <Select
              displayEmpty
              IconComponent={(props) => (
                <KeyboardArrowDownRoundedIcon {...props} />
              )}
              name={questionUUID}
              value={answer ?? ""}
              MenuProps={MenuProps}
              onChange={(e) =>
                handleAnswersChange(e.target.name, e.target.value)
              }
              renderValue={
                answer !== ""
                  ? undefined
                  : () => (
                      <div className="select-placeholder">
                        Choose dropdown value
                      </div>
                    )
              }
            >
              {question.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </div>
          <FormHelperText>{!answer && error ? error : ""}</FormHelperText>
        </div>
      </FormControl>
    ) : question.inputType === "radioGroup" ? (
      <div className="radio-btn-field">
        <FormControl>
          <RadioGroup
            //  disabled={editMode}

            aria-labelledby="demo-radio-buttons-group-label"
            className="radio-btn radio-btn-vertical"
            value={answer ?? ""}
            name={questionUUID}
            onChange={(e) => handleAnswersChange(e.target.name, e.target.value)}
          >
            {question.options.map((option, idx) => (
              <FormControlLabel
                key={idx}
                value={option}
                control={
                  <Radio
                    disabled={!editMode && !params["*"].includes("view")}
                    checked={answer === option}
                  />
                }
                label={option}
              />
            ))}
          </RadioGroup>
          <FormHelperText>{!answer && error ? error : ""}</FormHelperText>
        </FormControl>
      </div>
    ) : question.inputType === "checkbox" ? (
      // <div className="form-group mb-0">
      <div className="checkbox-with-labelblk checkbox-btn-half-blk">
        <FormControl>
          <FormGroup>
            {question.options.map((option, idx) => (
              <FormControlLabel
                key={idx}
                type={"checkbox"}
                name={questionUUID}
                className="checkbox-with-label"
                value={option}
                control={
                  <Checkbox
                    disabled={!editMode && !params["*"].includes("view")}
                  />
                }
                checked={answer.includes(option)}
                onChange={handleChecked}
                label={option}
              />
            ))}
          </FormGroup>
          <FormHelperText>{!answer && error ? error : ""}</FormHelperText>
        </FormControl>

        {/* </div> */}
      </div>
    ) : question.inputType === "date" ? (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          className="datepicker-blk"
          components={{
            OpenPickerIcon: DateRangeOutlinedIcon,
          }}
          disabled={!editMode && !params["*"].includes("view")}
          value={answer ?? ""}
          onChange={(newValue) => handleAnswersChange(questionUUID, newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              onKeyDown={handleOnKeyDownChange}
              helperText={!answer && error ? error : ""}
            />
          )}
        />
      </LocalizationProvider>
    ) : (
      ""
    );
  return (
    <div className="preview-que-blk">
      <div className="form-group">
        <label htmlFor="questionTitle">
          <div className="preview-sect-txt">
            {questionLabel}
            {question?.isRequired && <span className="mandatory"> *</span>}
          </div>
        </label>
        <div className="que-half-blk">{questionComponent}</div>
      </div>
    </div>
  );
};

export default FillAssessmentQuestion;
