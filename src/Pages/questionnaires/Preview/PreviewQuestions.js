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

const PreviewQuestions = ({ question }) => {
//   const [datevalue, setDateValue] = React.useState(null);

  let questionLabel = question.questionTitle;

  console.log("title preview question", questionLabel);
  console.log("title preview question", question.questionTitle);
  let questionComponent =
    question.inputType === "singleTextbox" ? (
      <TextField
        placeholder={"Enter text here"}
        className="input-field"
        InputProps={{
          readOnly: true,
        }}
      />
    ) : question.inputType === "textarea" ? (
      <TextField
        multiline
        InputProps={{
            readOnly: true,
          }}
        className="input-textarea"
        placeholder="Enter text here"
        variant="outlined"
      />
    ) : //   <TextField

    //     multiline={5}
    //     id="outlined-basic"
    //     variant="outlined"
    //     placeholder={"Enter text here"}
    //   />
    question.inputType === "dropdown" ? (
      <div className="form-group">
        <div className="select-field">
          <Select
            IconComponent={(props) => (
              <KeyboardArrowDownRoundedIcon {...props} />
            )}
            value={question.questionTitle}
            MenuProps={MenuProps}
          >
            <MenuItem value={question.questionTitle} disabled>
               Choose dropdown value
            </MenuItem>
            {question.options.map((option) => (
              <MenuItem key={option} value={option} disabled>
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
          name="radio-buttons-group"
          className="radio-btn radio-btn-vertical"
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
            disabled
            value={null}
            className="datepicker-blk"
            components={{
              OpenPickerIcon: CalendarMonthOutlinedIcon,
            }}
            onChange={() => {}}
            renderInput={(params) => <TextField {...params} helperText=" " />}
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
            {question?.isRequired && <span className="mandatory"> *</span>}
          </div>
        </label>
        <div className="que-half-sect">{questionComponent}</div>
      </div>
    </div>
  );
};

export default PreviewQuestions;
