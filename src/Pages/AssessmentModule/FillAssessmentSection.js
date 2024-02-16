import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DialogBox from "../../components/DialogBox";
import { Logger } from "../../Logger/Logger";
import PreviewOtherDocument from "../questionnaires/Preview/PreviewOtherDocument";
const FillAssessmentQuestion = React.lazy(() =>
  import("./FillAssessmentQuestions")
);
const TableAssessment = React.lazy(() => import("./TableAssesment"));
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
  myRef,
  setToasterDetails,
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
  editMode,
  setEditMode,
  disableFillAssessment,
  totalSections,
  index,
  questionnaireId
}) {
  const navigate = useNavigate();
  const params = useParams();

  const showSubmitOnFinalSection = () => {
   
    return totalSections === index + 1 ? false : true;
  };

  // cancel dailog box open/close state
  

  const [openCancelDailog, setOpenCancelDailog] = useState(false);

  const handleAnswersChange = (name, value) => {
    setAssessmentQuestionnaire({
      ...assessmentQuestionnaire,
      [section?.uuid]: {
        ...assessmentQuestionnaire[section?.uuid],
        [name]: value,
      },
    });
  };
  const handleAnswersBlur = (name, value) => {
    Logger.info("Fill Assessment section - handleAnswersBlur handler");

    setAssessmentQuestionnaire({
      ...assessmentQuestionnaire,
      [section?.uuid]: {
        ...assessmentQuestionnaire[section?.uuid],
        [name]: value?.trim(),
      },
    });
  };
  return (
    <>
      <DialogBox
        title={<p>Cancel Assessment</p>}
        info1={
          <p>
            On canceling, all the unsaved details of the sections will be
            removed.
          </p>
        }
        info2={<p>Do you still want to cancel it?</p>}
        primaryButtonText={"Yes"}
        secondaryButtonText={"No"}
        onPrimaryModalButtonClickHandler={() => {
          navigate("/assessment-list");
        }}
        onSecondaryModalButtonClickHandler={() => {
          setOpenCancelDailog(false);
        }}
        openModal={openCancelDailog}
        setOpenModal={setOpenCancelDailog}
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
                key={question?.uuid}
                assessmentQuestionnaire={assessmentQuestionnaire}
                setAssessmentQuestionnaire={setAssessmentQuestionnaire}
                sectionUUID={section?.uuid}
                question={question}
                errorQuestion={errorQuestion}
                setErrorQuestion={setErrorQuestion}
                errorQuestionUUID={errorQuestionUUID}
                setErrorQuestionUUID={setErrorQuestionUUID}
                answer={
                  assessmentQuestionnaire[section?.uuid] &&
                  assessmentQuestionnaire[section?.uuid][question?.uuid]
                    ? assessmentQuestionnaire[section?.uuid][question?.uuid]
                    : question?.inputType === "checkbox"
                    ? []
                    : ""
                }
                error={errors[question?.uuid] ?? ""}
                handleAnswersChange={handleAnswersChange}
                handleAnswersBlur={handleAnswersBlur}
                editMode={editMode}
                setEditMode={setEditMode}
              />
            ))
          ) : section?.layout==='documents'?(
            section.documents.map((document)=>(<PreviewOtherDocument 
              sectionUUID={section?.uuid}
              questionnaireId={questionnaireId}
              documentObj={document}  />))
          ):
          
          (
            <TableAssessment
              setAssessmentQuestionnaire={setAssessmentQuestionnaire}
              assessmentQuestionnaire={assessmentQuestionnaire}
              sectionUUID={section?.uuid}
              columnValues={section?.columnValues}
              rowValues={section?.rowValues}
              handleAnswersChange={handleAnswersChange}
              handleAnswersBlur={handleAnswersBlur}
              errors={errors ?? {}}
              editMode={editMode}
              myRef={myRef}
              setToasterDetails={setToasterDetails}
            />
          )}
        </div>
        {editMode && !params["*"].includes("view") ? (
          <div className="form-btn flex-between add-members-btn">
            <button
              type="reset"
              onClick={() => setOpenCancelDailog(true)}
              className="secondary-button mr-10"
              disabled={disableFillAssessment}
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={(e) => handleFormSubmit(e, true)}
              disabled={disableFillAssessment}
              className="outlined-button add-button mr-10"
            >
              Save as draft
            </button>
            <button
              type="submit"
              onClick={(e) => handleFormSubmit(e, false)}
              disabled={disableFillAssessment}
              className="primary-button add-button"
              hidden={showSubmitOnFinalSection()}
            >
              Submit assessment
            </button>
          </div>
        ) : (
          <div className="form-btn flex-between add-members-btn">
            <button
              type="reset"
              onClick={() => navigate("/assessment-list")}
              className="secondary-button"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default FillAssesmentSection;
