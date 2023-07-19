import React from "react";
import { v4 as uuidv4 } from "uuid";

import Question from "./Question.js";

const ITEM_HEIGHT = 42;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4,
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
                    options: ["", ""], // multiple values from which user can select
                },
            ],
        },
    ],
};
const FormQuestions = ({
    sectionIndex,
    questionnaire,
    setQuestionnaire,
    err,
    setErr,
    questionTitleList,
    setQuestionTitleList,
}) => {
    //On click of Save button handler
    // Logger.debug("section Index",sectionIndex,"questionnaire",questionnaire)
    return (
        <>
            <div className="que-form-card-wrapper">
                <div className="drag-drop-box"></div>
                {questionnaire &&
                    questionnaire?.sections[sectionIndex]?.questions?.map(
                        (question, questionIdx) => (
                            <Question
                                key={question?.uuid}
                                question={question}
                                questionsLength={
                                    questionnaire?.sections[sectionIndex]
                                        ?.questions?.length
                                }
                                questionIdx={questionIdx}
                                questionnaire={questionnaire}
                                setQuestionnaire={setQuestionnaire}
                                sectionIndex={sectionIndex}
                                err={err}
                                setErr={setErr}
                                questionTitleList={questionTitleList}
                                setQuestionTitleList={setQuestionTitleList}
                            />
                        )
                    )}
            </div>
            {/* <CustomModal/> */}
        </>
    );
};

export default FormQuestions;
