import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TableAssessment from "./TableAssesment";
import FillAssessmentQuestion from "./FillAssessmentQuestions";
import { privateAxios } from "../api/axios";
import { SUBMIT_ASSESSMENT_AS_DRAFT } from "../api/Url";
import useCallbackState from "../utils/useCallBackState";
import Toaster from "../components/Toaster";

function FillAssesmentSection({
    // questionnaire,
    // setQuestionnaire,
    // uuid,
    // setValue,
    // index,
    section,
    setAssessmentQuestionnaire,
    assessmentQuestionnaire,
    errorQuestion,
    setErrorQuestion,
    errorQuestionUUID,
    setErrorQuestionUUID,
}) {
    const [selectedValues, setSelectedValues] = React.useState([]);

    const navigate = useNavigate();
    const params = useParams();

    //Toaster Message setter
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });

    const myRef = useRef();

    const validateAssessment = async () => {
        Object.entries(assessmentQuestionnaire).forEach(([key, value]) =>
            Object.entries(value).forEach(([key, value]) => {
                if (value.length === 0) {
                    setErrorQuestion(key);
                    return false;
                }
            })
        );
        return true;
    };

    const saveAssessmentAsDraft = async () => {
        try {
            const response =
                validateAssessment() &&
                (await privateAxios.post(
                    SUBMIT_ASSESSMENT_AS_DRAFT + params.id,
                    {
                        assessmentQuestionnaire,
                    }
                ));
            console.log("Assessment is saved as draft", response);
            setToasterDetails(
                {
                    titleMessage: "Success",
                    descriptionMessage: response?.data?.message,
                    messageType: "success",
                },
                () => myRef.current()
            );
        } catch (error) {
            console.log("error from save assessment as draft", error);
            setToasterDetails(
                {
                    titleMessage: "Error",
                    descriptionMessage:
                        error?.response?.data?.message &&
                        typeof error.response.data.message === "string"
                            ? error.response.data.message
                            : "Something Went Wrong!",
                    messageType: "error",
                },
                () => myRef.current()
            );
        }
    };

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
            <Toaster
                myRef={myRef}
                titleMessage={toasterDetails.titleMessage}
                descriptionMessage={toasterDetails.descriptionMessage}
                messageType={toasterDetails.messageType}
            />
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
                                errorQuestion={errorQuestion}
                                setErrorQuestion={setErrorQuestion}
                                errorQuestionUUID={errorQuestionUUID}
                                setErrorQuestionUUID={setErrorQuestionUUID}
                            />
                        ))
                    ) : (
                        <TableAssessment
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
