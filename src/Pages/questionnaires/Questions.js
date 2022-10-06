import {
  FormGroup,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";

const ITEM_HEIGHT = 22;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5,
    },
  },
};

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

const myHelper = {
  questionTitle: {
    required: "Enter question title",
  },
  validation: {
    validate: "Select Validation",
  },
};

const questionnaireFormat = {
  uuid: uuidv4(),
  version: "1.0",
  title: "HQ level operation",
  sections: [
    {
      uuid: uuidv4(),
      srNo: 1,
      sectionTitle: "Section 1 title",
      description: "Section 1 Description hai",
      layout: "form",
      isActive: true,
      questions: [
        {
          uuid: uuidv4(),
          questionTitle: "",
          srNo: 1, // TBD
          inputType: "singleTextbox", // single textbox, multi textbox, dropdown, checkbox, radio group, calendar, ratings, boolean
          validation: "", // isRequired, maxLength, minLength, alpha, alphaNumeric, numeric
          defaultValue: "", // Will only be there in case of the inputType which requires the default value
          isRequired: true,
          options: [], // multiple values from which user can select
        },
      ],
    },
  ],
};
const Questions = () => {
  const [errArray, setErrArray] = useState([{ questionTitle: "" }]);
  let defaultValues = {
    uuid: uuidv4(),
    questionTitle: "",
    srNo: 1,
    inputType: "singleTextbox",
    validation: "",
    isRequired: true,
    options: [],
  };
  const inputTypeOptions = [
    {
      _id: "singleTextbox",
      name: "Single textbox",
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
  const validationOptions = ["alphanumeric", "numeric", "character"];
  const { control, reset, setValue, watch, trigger, handleSubmit } = useForm({
    defaultValues: defaultValues,
  });
  const [isActive, setActive] = React.useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);

  const [questionnare, setQuestionnare] = useState({ ...questionnaireFormat });

  const handleToggle = () => {
    setActive(!isActive);
  };

  //method to handle switch change
  const onSwichChangeHandler = (e, sectionIdx, questionIdx) => {
    let tempQuestionnaire = { ...questionnare };
    tempQuestionnaire.sections[sectionIdx].questions[questionIdx].isRequired =
      e.target.checked;
    setQuestionnare(tempQuestionnaire);
    console.log("Questionnare:- ", questionnare);
  };

  //On + icon click new question will get added
  const addQuestionHandler = () => {
    let tempQuestionnaire = { ...questionnare };
    console.log("default Values", defaultValues);
    tempQuestionnaire.sections[sectionIndex].questions.push({
      ...defaultValues,
    });
    setQuestionnare(tempQuestionnaire);
    let tempErrArray = [...errArray]
    tempErrArray.push({questionTitle:""})
    setErrArray(tempErrArray)
    console.log("Questionnare", questionnare);
  };
  
  //method to handle delete question
  const deleteQuestionHandler = (uuid,questionIdx) => {
    //deleting question from questionnare
    let tempQuestionnaire = {...questionnare}
    let tempQuestions = tempQuestionnaire?.sections[sectionIndex]?.questions.filter(question => question.uuid !== uuid)
    tempQuestionnaire.sections[sectionIndex].questions = [...tempQuestions]
    setQuestionnare(tempQuestionnaire)

    // deleting error  object 
    let tempErrArray = [...errArray]
    console.log("questionId: ",questionIdx)
    tempErrArray.splice(questionIdx,1)
    setErrArray(tempErrArray)



  }
  //On click of Save button handler
  const onSectionSubmitHandler = () => {
    console.log("question: ", questionnare);
    let tempErrArray = errArray
    questionnare.sections[sectionIndex].questions.map((question,questionIdx) => {
        if(question?.questionTitle) return
        tempErrArray[questionIdx].questionTitle = "Enter question title"
    })
    console.log("error Array",tempErrArray)
    setErrArray([...tempErrArray])
  };

  //method to handle question change handler
  const onQuestionChangeHandler = (event, questionIdx) => {
    console.log("event", event.target.name);
    const { name, value } = event.target;
    const tempQuestionnaire = { ...questionnare };
    console.log("name", name, "value", value);
    tempQuestionnaire.sections[sectionIndex].questions[questionIdx][name] =
      value;
    setQuestionnare(tempQuestionnaire);
  }
  //method to handle question focus
  const onQuestionFocusHandler = (event,questionIdx) => {
    let tempErrArray = [...errArray]
    tempErrArray[questionIdx].questionTitle = ""
    setErrArray(tempErrArray)
  }
  useEffect(() => {
    
  
    return () => {
      
    }
  }, [errArray])
  console.log("Error Array: ",errArray)
  return (
    <>
      <div className="page-wrapper">
        <section>
          <div className="container">
            {/* <div className="section-form-sect"> */}
            <div className="sect-form-card-wrapper">
              <div className="que-form-card-wrapper">
                <div className="drag-drop-box"></div>
                {questionnare &&
                  questionnare.sections[sectionIndex]?.questions?.map(
                    (question, questionIdx) => (
                      <div className="que-card-blk" key={question?.uuid}>
                        <div className="que-form-blk">
                          <div className="que-card-ttl-blk">
                            <h2 className="subheading">
                              Question {`${questionIdx + 1}`}
                            </h2>
                          </div>
                          <div className="que-card-innerblk flex-between">
                            <div className="que-card-form-leftfield">
                              <div className="form-group">
                                <label htmlFor="questionTitle">
                                  Question Title
                                </label>
                                <TextField
                                  className={`input-field ${errArray[questionIdx]?.questionTitle && 'input-error'} `}
                                  placeholder="Enter question title"
                                  name="questionTitle"
                                  value={question?.questionTitle}
                                  inputProps={{
                                    maxLength: 250,
                                  }}
                                  helperText={errArray[questionIdx]?.questionTitle ? "Enter question title" : " "}
                                  onChange={(e) =>onQuestionChangeHandler(e, questionIdx)}
                                  onFocus={(e) => onQuestionFocusHandler(e, questionIdx)}
                                />
                                {/* <Input
                                control={control}
                                name="questionTitle"
                                value={question?.questionTitle}
                                myOnChange={(e) => onQuestionChangeHandler(e, questionIdx)}
                                placeholder="Enter question title"
                                myHelper={myHelper}
                                rules={{
                                  required: true,
                                  maxLength: 250,
                                }}
                              /> */}
                              </div>
                            </div>
                            <div className="que-card-form-rightfield flex-between">
                              <div className="form-group">
                                <label htmlFor="inputField">Input Field</label>
                                <div className="select-field">
                                  <Select
                                    placeholder="Select Input type"
                                    IconComponent={(props) => (
                                      <KeyboardArrowDownRoundedIcon
                                        {...props}
                                      />
                                    )}
                                    name="inputType"
                                    value={question?.inputType}
                                    onChange={(e) =>
                                      onQuestionChangeHandler(e, questionIdx)
                                    }
                                  >
                                    {inputTypeOptions &&
                                      inputTypeOptions.map((option) => (
                                        <MenuItem
                                          key={option?._id}
                                          value={option?._id}
                                        >
                                          {option?.name}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </div>
                                {/* <Dropdown
                                control={control}
                                myOnChange={(e) => onQuestionChangeHandler(e , questionIdx)}
                                name="inputType"
                                value={question?.inputType}
                                //    myHelper={memberHelper}
                                rules={{ required: true }}
                                options={inputTypeOptions}
                              /> */}
                                <label htmlFor="inputField">Validation</label>
                                <div className="select-field">
                                  <Select
                                    disabled={question.inputType !== "singleTextbox" && question.inputType !== "multiSelect"}
                                    placeholder="Select Input validation"
                                    displayEmpty
                                    IconComponent={(props) => (
                                      <KeyboardArrowDownRoundedIcon
                                        {...props}
                                      />
                                    )}
                                    name="validation"
                                    value={question?.validation}
                                    onChange={(e) =>
                                      onQuestionChangeHandler(e, questionIdx)
                                    }
                                  >
                                    <MenuItem disabled value="">
                                      Select validation
                                    </MenuItem>
                                    {validationOptions &&
                                      validationOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                          {option}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </div>
                                {/* <Dropdown
                                  control={control}
                                  name="validation"
                                  value={question?.validation}
                                  placeholder="Select validation"
                                  // rules={{ required: true }}
                                  options={validationOptions}
                                /> */}
                              </div>
                              <div className="validator-sect">
                                <div
                                  className="validator-iconblk"
                                  onClick={handleToggle}
                                >
                                  <span className="validator-icon">
                                    <MoreVertIcon />
                                  </span>
                                  <div
                                    className="response-validator-wrap"
                                    style={{
                                      display: isActive ? "block" : "none",
                                    }}
                                  >
                                    <div className="response-validator-listblk">
                                      <span className="response-validator-txt">
                                        Response Validator
                                      </span>
                                      <ul className="response-validator-list">
                                        <li className="active">Character</li>
                                        <li>Numeric</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="que-card-icon-sect">
                            <div className="que-card-icon-blk">
                              <div className="que-card-icon add-que-iconblk mr-40">
                                <img
                                  onClick={addQuestionHandler}
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/add-question-icon.svg"
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="que-card-icon delete-iconblk mr-40">
                                <img
                                  onClick={() => deleteQuestionHandler(question?.uuid, questionIdx)}
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/delete-icon.svg"
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="required-toggle-btnblk">
                                <FormGroup>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    <Typography>Required</Typography>
                                    <AntSwitch
                                      checked={question.isRequired}
                                      onChange={(e) =>
                                        onSwichChangeHandler(
                                          e,
                                          sectionIndex,
                                          questionIdx
                                        )
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
                        </div>
                        {/* </div> */}
                      </div>
                    )
                  )}
              </div>
              <div className="form-btn flex-between add-members-btn">
                <button
                  type="reset"
                  //   onClick={onClickCancelHandler}
                  className="secondary-button mr-10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={onSectionSubmitHandler}
                  className="primary-button add-button"
                >
                  Save
                </button>
              </div>
            </div>
            {/* <CustomModal/> */}
          </div>
        </section>
      </div>
    </>
  );
};

export default Questions;
