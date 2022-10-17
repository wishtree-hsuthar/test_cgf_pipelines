import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FillAssessmentQuestion2 from "./FillAssessmentQuestion2";
import FillAssessmentQuestion from "./FillAssessmentQuestions";

function FillAssesmentSection({
    section,
    setAssessmentQuestionnaire,
    assessmentQuestionnaire,
}) {
    const navigate = useNavigate();
    const params = useParams();

    const [answers, setAnswers] = useState({
        [section?.uuid]: {},
    });

    const [errors, setErrors] = useState({
        [section.uuid]: {},
    });

    const handleAnswersChange = (name, value) => {
        let tempAns = answers[section?.uuid];
        tempAns = { ...tempAns, [name]: value };
        setAnswers({ [section?.uuid]: { ...tempAns } });
    };

    // useEffect(() => {
    //     console.log("ANSWERS", answers);
    // }, [answers]);

    const handleFormSubmit = (e) => {
        let tempErrors = errors[section?.uuid];
        let currentSectionAnswers = answers[section?.uuid];

        section?.rowValues.map((row) => {
            row?.cells.map((cell) => {
                if (
                    !currentSectionAnswers[`${cell?.columnId}.${row?.uuid}`] ||
                    currentSectionAnswers[`${cell?.columnId}.${row?.uuid}`]
                        .length === 0
                ) {
                    tempErrors[`${cell?.columnId}.${row?.uuid}`] =
                        "This is required";
                } else {
                    tempErrors[`${cell?.columnId}.${row?.uuid}`] = "";
                }
            });
        });

        setErrors({
            [section?.uuid]: {
                ...tempErrors,
            },
        });
    };

    return (
        <>
            <div className="preview-card-wrapper">
                <div className="preview-sect-ttl-wrap">
                    <div class="preview-sect-card-ttl-blk">
                        <h2 class="subheading">Section Title</h2>
                    </div>
                    <div className="preview-sect-txt mb-0">
                        {section.sectionTitle}
                    </div>
                </div>
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
                            />
                        ))
                    ) : (
                        <FillAssessmentQuestion2
                            sectionUUID={section?.uuid}
                            columnValues={section?.columnValues}
                            rowValues={section?.rowValues}
                            answers={answers}
                            handleAnswersChange={handleAnswersChange}
                            errors={errors[section?.uuid]}
                        />
                    )}
                </div>
                <div className="form-btn flex-between add-members-btn mt-30">
                    <button
                        type="reset"
                        onClick={() =>
                            navigate(
                                `/questionnaires/add-questionnaire/${params.id}`
                            )
                        }
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
                        Update
                    </button>
                </div>
            </div>
        </>
    );
}

export default FillAssesmentSection;
