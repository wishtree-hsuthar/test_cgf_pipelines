import {
  FormControl,
  FormGroup,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import Question from "./Question.js";

const ITEM_HEIGHT = 22;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5,
    },
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
          inputType: "singleTextbox", // single textbox, multi textbox, dropdown, checkbox, radio group, calendar, ratings, boolean
          validation: "", // isRequired, maxLength, minLength, alpha, alphaNumeric, numeric
          defaultValue: "", // Will only be there in case of the inputType which requires the default value
          isRequired: true,
          options: [""], // multiple values from which user can select
        },
      ],
    },
  ],
};
const Questions = ({sectionIndex, questionnaire, setQuestionnaire,err, setErr}) => {
  // const [errArray, setErrArray] = useState([{ questionTitle: "" }]);
  // const [err, setErr] = useState({ questionTitle: "", option: "" });

  // const [sectionIndex, setSectionIndex] = useState(0);

  // const [questionnaire, setQuestionnaire] = useState({ ...questionnaireFormat });

  //On click of Save button handler
  const onSectionSubmitHandler = () => {
    let tempError = {
      questionTitle: "",
      option: "",
    };
    questionnaire?.sections[sectionIndex]?.questions?.map(
      (question, questionIdx) => {
        
        if (question?.questionTitle === "") {
          tempError.questionTitle = "Enter question title";
        }
        if (
          ["dropdown", "checkbox", "radioGroup"].includes(question?.inputType)
        ) {
          question?.options?.map((option) => {
            if (option === "") {
              tempError.option = "Enter option";
            }
          });
        }
      }
    );

    setErr({ ...tempError });
  };
// console.log("section Index",sectionIndex,"questionnaire",questionnaire)
  return (
    <>
      <div className="page-wrapper">
        <section>
          <div className="container">
            {/* <div className="section-form-sect"> */}
            <div className="sect-form-card-wrapper">
              <div className="que-form-card-wrapper">
                <div className="drag-drop-box"></div>
                {questionnaire &&
                  questionnaire?.sections[sectionIndex]?.questions?.map(
                    (question, questionIdx) => (
                      <Question
                        key={question?.uuid}
                        question={question}
                        questionsLength={
                          questionnaire?.sections[sectionIndex]?.questions
                            ?.length
                        }
                        questionIdx={questionIdx}
                        questionnaire={questionnaire}
                        setQuestionnaire={setQuestionnaire}
                        sectionIndex={sectionIndex}
                        err={err}
                        setErr={setErr}
                      />
                    )
                  )}
              </div>
              {/* <div className="form-btn flex-between add-members-btn">
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
              </div> */}
            </div>
            {/* <CustomModal/> */}
          </div>
        </section>
      </div>
    </>
  );
};

export default Questions;
