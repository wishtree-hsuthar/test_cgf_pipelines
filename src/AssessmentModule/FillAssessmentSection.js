import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TableAssessment from "./TableAssesment";
import FillAssessmentQuestion from "./FillAssessmentQuestions";
import useCallbackState from "../utils/useCallBackState";
import Toaster from "../components/Toaster";

const getTransformedColumns = (columns) => {
    let transformedColumns = {};
    columns.forEach((column) => {
        transformedColumns[column.uuid] = column;
    });
    return transformedColumns;
};

const getTransformedRows = (rows) => {
    let transfromedRows = {};
    rows.forEach((row) => {
        transfromedRows[row.uuid] = row;
    });

    return transfromedRows;
};

function FillAssesmentSection({
    section,
    setAssessmentQuestionnaire,
    assessmentQuestionnaire,
    errorQuestion,
    setErrorQuestion,
    errorQuestionUUID,
    setErrorQuestionUUID,
    errors,
    handleSetErrors,
    handleFormSubmit,
}) {
    const navigate = useNavigate();
    const params = useParams();

    //Toaster Message setter
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });

    const myRef = useRef();

    const handleAnswersChange = (name, value) => {
        setAssessmentQuestionnaire({
            ...assessmentQuestionnaire,
            [section?.uuid]: {
                ...assessmentQuestionnaire[section?.uuid],
                [name]: value,
            },
        });
    };

    return (
        <>
            <Toaster
                myRef={myRef}
                titleMessage={toasterDetails.titleMessage}
                descriptionMessage={toasterDetails.descriptionMessage}
                messageType={toasterDetails.messageType}
            />

            <div className="preview-sect-ttl-wrap">
                <div className="preview-sect-card-ttl-blk">
                    <h2 className="subheading">{section?.sectionTitle}</h2>
                </div>
                <div className="preview-sect-txt">{section?.description}</div>
            </div>
            <div className="preview-card-wrapper">
                <div className="preview-que-wrap">
                    {section.layout === "form" ? (
                        section.questions.map((question) => (
                            <FillAssessmentQuestion
                                assessmentQuestionnaire={
                                    assessmentQuestionnaire
                                }
                                setAssessmentQuestionnaire={
                                    setAssessmentQuestionnaire
                                }
                                sectionUUID={section?.uuid}
                                question={question}
                                errorQuestion={errorQuestion}
                                setErrorQuestion={setErrorQuestion}
                                errorQuestionUUID={errorQuestionUUID}
                                setErrorQuestionUUID={setErrorQuestionUUID}
                                // errors={errors ?? {}}
                                answer={
                                    assessmentQuestionnaire[section?.uuid] &&
                                    assessmentQuestionnaire[section?.uuid][
                                        question?.uuid
                                    ]
                                        ? assessmentQuestionnaire[
                                              section?.uuid
                                          ][question?.uuid]
                                        : question?.inputType === "checkbox"
                                        ? []
                                        : ""
                                }
                                error={errors[question?.uuid] ?? ""}
                                handleAnswersChange={handleAnswersChange}
                            />
                        ))
                    ) : (
                        <TableAssessment
                            assessmentQuestionnaire={assessmentQuestionnaire}
                            sectionUUID={section?.uuid}
                            columnValues={section?.columnValues}
                            rowValues={section?.rowValues}
                            handleAnswersChange={handleAnswersChange}
                            errors={errors ?? {}}
                        />
                    )}
                </div>
                <div className="form-btn flex-between add-members-btn">
                    <button
                        type="reset"
                        onClick={() => navigate(`/assessment-list/`)}
                        className="secondary-button mr-10"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={
                            // () =>
                            // navigate(
                            //     `/questionnaires/add-questionnaire/${params.id}`
                            // )
                            handleFormSubmit
                        }
                        className="primary-button add-button"
                    >
                        Submit assessment
                    </button>
                </div>
            </div>
        </>
    );
}

export default FillAssesmentSection;
