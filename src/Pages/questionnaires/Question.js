import React, { useEffect } from "react";
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormHelperText,
  MenuItem,
  Radio,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const Question = ({
  question,
  questionIdx,
  questionnaire,
  setQuestionnaire,
  sectionIndex,
  // errArray,
  // setErrArray,
  questionsLength,
  err,
  setErr
}) => {
  let defaultValues = {
    uuid: uuidv4(),
    questionTitle: "",
    srNo: 1,
    inputType: "singleTextbox",
    validation: "",
    isRequired: true,
    options: ["",""],
  };
  const myHelper = {
    questionTitle: {
      required: "Enter question title",
    },
    validation: {
      validate: "Select Validation",
    },
  };
  const inputTypeOptions = [
    {
      _id: "singleTextbox",
      name: "Single textbox",
    },
    {
      _id: "textarea",
      name: "Textarea"
    },
    {
      _id: "dropdown",
      name: "Dropdown",
    },
    {
      _id: "date",
      name: "Date",
    },
    {
      _id: "checkbox",
      name: "Checkbox",
    },
    {
      _id: "radioGroup",
      name: "Radio group",
    },
  ];
  const validationOptions = [
    {
      _id: "alphanumeric",
      name: "Alphanumeric",
    },
    {
      _id: "numeric",
      name: "Numeric",
    },
    {
      _id: "character",
      name: "Character",
    },
  ];

  //method to handle delete question
  const deleteQuestionHandler = (uuid, questionIdx) => {
    //deleting question from questionnaire
    let tempQuestionnaire = { ...questionnaire };
    let tempQuestions = tempQuestionnaire?.sections[
      sectionIndex
    ]?.questions.filter((question) => question.uuid !== uuid);
    tempQuestionnaire.sections[sectionIndex].questions = [...tempQuestions];
    setQuestionnaire(tempQuestionnaire);

    // deleting error  object
    // let tempErrArray = [...errArray];
    console.log("questionId: ", questionIdx);
    // tempErrArray.splice(questionIdx, 1);
    // setErrArray(tempErrArray);
  };
  //method to handle switch change
  const onSwichChangeHandler = (e, sectionIdx, questionIdx) => {
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire.sections[sectionIdx].questions[questionIdx].isRequired =
      e.target.checked;
    setQuestionnaire(tempQuestionnaire);
    console.log("questionnaire:- ", questionnaire);
  };

  //On + icon click new question will get added
  const addQuestionHandler = () => {
    let tempQuestionnaire = { ...questionnaire };
    console.log("default Values", defaultValues);
    tempQuestionnaire.sections[sectionIndex].questions.push({
      ...defaultValues,
    });
    setQuestionnaire(tempQuestionnaire);
    // let tempErrArray = [...errArray];
    // tempErrArray.push({ questionTitle: "" });
    // setErrArray(tempErrArray);
    console.log("questionnaire", questionnaire);
  };

  //method to handle question change handler
  const onQuestionChangeHandler = (event, questionIdx) => {
    console.log("event", event.target.name);
    const { name, value } = event.target;
    const tempQuestionnaire = { ...questionnaire };
    console.log("name", name, "value", value);
    tempQuestionnaire.sections[sectionIndex].questions[questionIdx][name] =
      value;
    setQuestionnaire(tempQuestionnaire);
  };
  //method to handle question focus
  const onQuestionFocusHandler = (event, questionIdx) => {
    // let tempErrArray = [...errArray];
    // tempErrArray[questionIdx].questionTitle = "";
    // setErrArray(tempErrArray);
  };

  //method to handle option change
  const onOptionChangeHandler = (e, questionIdx, optionIdx) => {
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire.sections[sectionIndex].questions[questionIdx].options[
      optionIdx
    ] = e.target.value;
    setQuestionnaire(tempQuestionnaire);
  };
  //method to handle option deletion
  const onOptionDeleteHandler = (e, questionIdx, optionIdx) => {
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire?.sections[sectionIndex]?.questions[
      questionIdx
    ]?.options?.splice(optionIdx, 1);
    setQuestionnaire(tempQuestionnaire);
  };
  //method to handle add option button click
  const addOptionHandler = (questionIdx) => {
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire.sections[sectionIndex].questions[
      questionIdx
    ].options.push("");
    setQuestionnaire(tempQuestionnaire);
  };
// console.log("Error",err)
useEffect(() => {
  console.log('Error: ',err)

  return () => {
    
  }
}, [err])
console.log("Error inside question: ",err)
  return (
    <div className={`que-card-blk ${questionIdx + 1 === questionsLength && "active"}`} key={question?.uuid}>
      <div className="que-form-blk">
        <div className="que-card-ttl-blk">
          <h2 className="subheading">Question {`${questionIdx + 1}`}</h2>
        </div>
        <div className="que-card-innerblk flex-between">
          <div className="que-card-form-leftfield">
            <div className="form-group">
              <label htmlFor="questionTitle">Question Title <span className="mandatory">*</span></label>
              <TextField
                className={`input-field ${
                  (!question?.questionTitle && err?.questionTitle) && "input-error"
                } `}
                placeholder="Enter question title"
                name="questionTitle"
                value={question?.questionTitle}
                inputProps={{
                  maxLength: 250,
                }}
                helperText={(!question?.questionTitle && err?.questionTitle) ? "Enter question title" : " "}
                // helperText={
                //   errArray[questionIdx]?.questionTitle
                //     ? "Enter question title"
                //     : " "
                // }
                onChange={(e) => onQuestionChangeHandler(e, questionIdx)}
                onFocus={(e) => onQuestionFocusHandler(e, questionIdx)}
              />
            </div>
          </div>
          <div className="que-card-form-rightfield flex-between">
            <div className="form-group">
              <label htmlFor="inputField">Input Field <span className="mandatory">*</span></label>
              <FormControl>
                <div className="select-field">
                  <Select
                    placeholder="Select Input type"
                    IconComponent={(props) => (
                      <KeyboardArrowDownRoundedIcon {...props} />
                    )}
                    name="inputType"
                    value={question?.inputType}
                    onChange={(e) => onQuestionChangeHandler(e, questionIdx)}
                  >
                    {inputTypeOptions &&
                      inputTypeOptions.map((option) => (
                        <MenuItem key={option?._id} value={option?._id}>
                          {option?.name}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
                <FormHelperText> </FormHelperText>
              </FormControl>
            </div>
            <div className="form-group">
              <label htmlFor="inputField">Validation</label>
              <FormControl>
                <div className="select-field">
                  <Select
                    disabled={
                      question.inputType !== "singleTextbox" &&
                      question.inputType !== "textarea"
                    }
                    placeholder="Select Input validation"
                    displayEmpty
                    IconComponent={(props) => (
                      <KeyboardArrowDownRoundedIcon {...props} />
                    )}
                    name="validation"
                    value={question?.validation}
                    onChange={(e) => onQuestionChangeHandler(e, questionIdx)}
                  >
                    <MenuItem disabled value="">
                      Select validation
                    </MenuItem>
                    {validationOptions &&
                      validationOptions.map((option) => (
                        <MenuItem key={option?._id} value={option?._id}>
                          {option?.name}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
              </FormControl>
            </div>
          </div>
        </div>
        <div className="que-card-icon-sect">
          <div className="que-card-icon-blk">
            <div className="que-card-icon add-que-iconblk mr-40">
              <img
                onClick={addQuestionHandler}
                src={process.env.PUBLIC_URL + "/images/add-question-icon.svg"}
                alt=""
              />
            </div>
            {questionsLength !== 1 && (
              <div className="que-card-icon delete-iconblk mr-40">
                <img
                  onClick={() =>
                    deleteQuestionHandler(question?.uuid, questionIdx)
                  }
                  src={process.env.PUBLIC_URL + "/images/delete-icon.svg"}
                  alt=""
                />
              </div>
            )}
            <div className="required-toggle-btnblk">
              <FormGroup>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Required</Typography>
                  <AntSwitch
                    checked={question.isRequired}
                    onChange={(e) =>
                      onSwichChangeHandler(e, sectionIndex, questionIdx)
                    }
                    inputProps={{
                      "aria-label": "controlled",
                    }}
                  />
                </Stack>
              </FormGroup>
            </div>
          </div>
        </div>
        {["dropdown", "checkbox", "radioGroup"].includes(question?.inputType) &&
          question.options.map((option, optionIdx) => (
            <div className="que-card-innerblk" key={optionIdx}>
              <div className="que-card-input-type-wrapper">
                <div className="que-card-form-leftfield">
                  <div className="que-checkbox-sect">
                    <div className="que-checkbox-wrap">
                      <div className="que-checkbox-blk">
                        <TextField
                          name="options"
                          value={option}
                          onChange={(e) =>
                            onOptionChangeHandler(e, questionIdx, optionIdx)
                          }
                          className={`input-field que-input-type ${(err?.option && !option) && "input-error"}`}
                          helperText={(err?.option && !option) ?  err?.option : " "}
                          id="outlined-basic"
                          placeholder="Enter option value"
                          variant="outlined"
                        />
                      </div>
                      {question?.inputType === "checkbox" && (
                        <Checkbox className="que-checkbox" checked={false} />
                      )}
                      {question?.inputType === "radioGroup" && (
                        <Radio
                          className="radio-btn que-radio-btn"
                          color="primary"
                          checked={false}
                        />
                      )}
                      {question?.options.length !== 2 && (
                        <div
                          className="que-input-type-close"
                          onClick={(e) =>
                            onOptionDeleteHandler(e, questionIdx, optionIdx)
                          }
                        >
                          <CloseIcon />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="que-card-form-rightfield">
                  {optionIdx + 1 === question?.options?.length && (
                    <div
                      className="tertiary-btn-blk"
                      onClick={() => addOptionHandler(questionIdx)}
                    >
                      <span className="addmore-icon">
                        <i className="fa fa-plus"></i>
                      </span>
                      <span className="addmore-txt">Add Other Option</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* </div> */}
    </div>
  );
};

export default Question;
