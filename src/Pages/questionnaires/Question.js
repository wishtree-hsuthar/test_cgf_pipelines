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
    Tooltip,
    Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import CloseIcon from "@mui/icons-material/Close";
import AntSwitch from "../../utils/AntSwitch";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
const ITEM_HEIGHT = 42;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4,
        },
    },
};

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
    setErr,
}) => {
    let defaultValues = {
        uuid: uuidv4(),
        questionTitle: "",
        srNo: 1,
        inputType: "singleTextbox",
        validation: "",
        isRequired: true,
        options: ["", ""],
    };
    const inputTypeOptions = [
        {
            _id: "checkbox",
            name: "Checkbox",
        },
        {
            _id: "date",
            name: "Date",
        },
        {
            _id: "dropdown",
            name: "Drop down",
        },
        {
            _id: "radioGroup",
            name: "Radio group",
        },

        {
            _id: "singleTextbox",
            name: "Single text box",
        },
        {
            _id: "textarea",
            name: "Text area",
        },
    ];
    const validationOptions = [
        {
            _id: "alphabets",
            name: "Alphabets",
        },
        {
            _id: "alphanumeric",
            name: "Alphanumeric",
        },
        {
            _id: "numeric",
            name: "Numeric",
        },
    ];
    const ITEM_HEIGHT = 42;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4,
            },
        },
    };
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
        // console.log("questionId: ", questionIdx);
        // tempErrArray.splice(questionIdx, 1);
        // setErrArray(tempErrArray);
    };
    //method to handle switch change
    const onSwichChangeHandler = (e, sectionIdx, questionIdx) => {
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIdx].questions[
            questionIdx
        ].isRequired = e.target.checked;
        setQuestionnaire(tempQuestionnaire);
    };

    //On + icon click new question will get added
    const addQuestionHandler = () => {
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].questions.push({
            ...defaultValues,
        });
        setQuestionnaire(tempQuestionnaire);
    };

    //method to handle question change handler
    const onQuestionChangeHandler = (event, questionIdx) => {
        const { name, value } = event.target;
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].questions[questionIdx][name] =
            value;
        setQuestionnaire(tempQuestionnaire);
    };
    //method to handle question blur event
    const onQuestionBlurHandler = (event, questionIdx) => {
        const { name, value } = event.target;
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].questions[questionIdx][name] =
            value?.trim();
        setQuestionnaire(tempQuestionnaire);
    };
    const onInputTypeChangeHandler = (event, questionIdx) => {
        const { name, value } = event.target;
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].questions[questionIdx][name] =
            value;
        tempQuestionnaire.sections[sectionIndex].questions[
            questionIdx
        ].validation = "";
        setQuestionnaire(tempQuestionnaire);
    };

    //method to handle option change
    const onOptionChangeHandler = (e, questionIdx, optionIdx) => {
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].questions[questionIdx].options[
            optionIdx
        ] = e.target.value;
        setQuestionnaire(tempQuestionnaire);
    };
    //method to handler option blur handler
    const onOptionBlurHandler = (e, questionIdx, optionIdx) => {
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].questions[questionIdx].options[
            optionIdx
        ] = e.target.value?.trim();
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
        // console.log('Error: ',err)

        return () => {};
    }, [err]);
    // console.log("Error inside question: ",err)

    const Placeholder = ({ children }) => {
        return <div className="select-placeholder">{children}</div>;
    };

    const checkIfSameQuestionTitlePresent = (title) => {
        let filterSameNameQuestionTitle = questionnaire.sections[
            sectionIndex
        ].questions.filter((question) => question.questionTitle === title);
        if (filterSameNameQuestionTitle.length > 1) {
            console.log("Same question title appeared twice.");
            return true;
        } else {
            return false;
        }
    };

    return (
        <div
            className={`que-card-blk ${
                questionIdx + 1 === questionsLength && "active"
            }`}
            key={question?.uuid}
        >
            <div className="que-form-blk">
                {/* <div className="que-card-ttl-blk">
          <h2 className="subheading">Question {`${questionIdx + 1}`}</h2>
        </div> */}
                <div className="que-card-innerblk flex-between">
                    <div className="que-card-form-leftfield">
                        <div className="form-group">
                            <label htmlFor="questionTitle">
                                Question {`${questionIdx + 1}`} Title{" "}
                                <span className="mandatory">*</span>
                            </label>
                            <TextField
                                className={`input-field ${
                                    (!question?.questionTitle &&
                                        err?.questionTitle &&
                                        "input-error") ||
                                    (checkIfSameQuestionTitlePresent(
                                        question?.questionTitle
                                    ) &&
                                        err?.questionTitle &&
                                        "input-error")
                                } `}
                                placeholder="Enter question title"
                                name="questionTitle"
                                value={question?.questionTitle}
                                helperText={
                                    !question?.questionTitle &&
                                    err?.questionTitle
                                        ? "Enter the question title"
                                        : checkIfSameQuestionTitlePresent(
                                              question?.questionTitle
                                          ) && err?.questionTitle
                                        ? "Question title already in use."
                                        : " "
                                }
                                onChange={(e) =>
                                    onQuestionChangeHandler(e, questionIdx)
                                }
                                onBlur={(e) =>
                                    onQuestionBlurHandler(e, questionIdx)
                                }
                            />
                        </div>
                    </div>
                    <div className="que-card-form-rightfield flex-between">
                        <div className="form-group">
                            <label htmlFor="inputField">
                                Input Type <span className="mandatory">*</span>
                            </label>
                            <FormControl className="fullwidth-field">
                                <div className="select-field">
                                    <Select
                                        MenuProps={MenuProps}
                                        placeholder="Select Input type"
                                        IconComponent={(props) => (
                                            <KeyboardArrowDownRoundedIcon
                                                {...props}
                                            />
                                        )}
                                        name="inputType"
                                        value={question?.inputType}
                                        onChange={(e) =>
                                            onInputTypeChangeHandler(
                                                e,
                                                questionIdx
                                            )
                                        }
                                        // onChange={(e) => onQuestionChangeHandler(e, questionIdx)}
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
                                <FormHelperText> </FormHelperText>
                            </FormControl>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputField">Validation</label>
                            <FormControl className="fullwidth-field">
                                <div className="select-field">
                                    <Select
                                        disabled={
                                            question.inputType !==
                                                "singleTextbox" &&
                                            question.inputType !== "textarea"
                                        }
                                        renderValue={
                                            question?.validation !== ""
                                                ? undefined
                                                : () => (
                                                      <Placeholder>
                                                          Select validation
                                                      </Placeholder>
                                                  )
                                        }
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
                                            onQuestionChangeHandler(
                                                e,
                                                questionIdx
                                            )
                                        }
                                    >
                                        {/* <MenuItem disabled value="">
                      Select validation
                    </MenuItem> */}
                                        {validationOptions &&
                                            validationOptions.map((option) => (
                                                <MenuItem
                                                    key={option?._id}
                                                    value={option?._id}
                                                >
                                                    {option?.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </div>
                            </FormControl>
                        </div>
                    </div>
                </div>

                {["dropdown", "checkbox", "radioGroup"].includes(
                    question?.inputType
                ) &&
                    question.options.map((option, optionIdx) => (
                        <div className="que-card-innerblk" key={optionIdx}>
                            <div className="que-card-input-type-wrapper">
                                <div className="que-card-form-leftfield">
                                    <div className="que-checkbox-sect">
                                        <div className="que-checkbox-wrap">
                                            <div
                                                className={`que-checkbox-blk ${
                                                    (question?.inputType ===
                                                        "dropdown" &&
                                                        "que-dropdown-blk") ||
                                                    (question?.inputType ===
                                                        "checkbox" &&
                                                        "que-checkbox-option") ||
                                                    (question?.inputType ===
                                                        "radioGroup" &&
                                                        "que-radio-option")
                                                }`}
                                            >
                                                <TextField
                                                    name="options"
                                                    value={option}
                                                    onChange={(e) =>
                                                        onOptionChangeHandler(
                                                            e,
                                                            questionIdx,
                                                            optionIdx
                                                        )
                                                    }
                                                    onBlur={(e) =>
                                                        onOptionBlurHandler(
                                                            e,
                                                            questionIdx,
                                                            optionIdx
                                                        )
                                                    }
                                                    className={
                                                        question?.options
                                                            .length !== 2
                                                            ? `input-field que-input-type adddropdown ${
                                                                  err?.option &&
                                                                  !option &&
                                                                  "input-error"
                                                              }`
                                                            : `input-field que-input-type ${
                                                                  err?.option &&
                                                                  !option &&
                                                                  "input-error"
                                                              }`
                                                    }
                                                    helperText={
                                                        err?.option && !option
                                                            ? "Enter the option value"
                                                            : " "
                                                    }
                                                    id="outlined-basic"
                                                    placeholder="Enter option value"
                                                    variant="outlined"
                                                />
                                            </div>
                                            {question?.inputType ===
                                                "checkbox" && (
                                                <Checkbox
                                                    className="que-checkbox"
                                                    checked={false}
                                                />
                                            )}
                                            {question?.inputType ===
                                                "radioGroup" && (
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
                                                        onOptionDeleteHandler(
                                                            e,
                                                            questionIdx,
                                                            optionIdx
                                                        )
                                                    }
                                                >
                                                    <CloseIcon />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="que-card-form-rightfield add-option-blk">
                                    {optionIdx + 1 ===
                                        question?.options?.length && (
                                        <div
                                            className="tertiary-btn-blk"
                                            onClick={() =>
                                                addOptionHandler(questionIdx)
                                            }
                                        >
                                            <span className="addmore-icon">
                                                <i className="fa fa-plus"></i>
                                            </span>
                                            <span className="addmore-txt">
                                                Add Option...
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                <div className="que-card-icon-sect">
                    <div className="que-card-icon-blk">
                        {questionIdx === questionsLength - 1 && (
                            <div className="que-card-icon add-que-iconblk mr-40">
                                <Tooltip title="Add Question">
                                    <img
                                        onClick={addQuestionHandler}
                                        src={
                                            process.env.PUBLIC_URL +
                                            "/images/add-question-icon.svg"
                                        }
                                        alt=""
                                    />
                                </Tooltip>
                            </div>
                        )}

                        {questionsLength !== 1 && (
                            <div className="que-card-icon delete-iconblk mr-40">
                                <Tooltip title="Delete Question">
                                    <img
                                        onClick={() =>
                                            deleteQuestionHandler(
                                                question?.uuid,
                                                questionIdx
                                            )
                                        }
                                        src={
                                            process.env.PUBLIC_URL +
                                            "/images/delete-icon.svg"
                                        }
                                        alt=""
                                    />
                                </Tooltip>
                            </div>
                        )}
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
    );
};

export default Question;
