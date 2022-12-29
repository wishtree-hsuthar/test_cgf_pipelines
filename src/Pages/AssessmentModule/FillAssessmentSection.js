import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TableAssessment from "./TableAssesment";
import FillAssessmentQuestion from "./FillAssessmentQuestions";
import DialogBox from "../../components/DialogBox";

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
  editMode,
  setEditMode,
}) {
  const navigate = useNavigate();
  const params = useParams();

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
    console.log("inside on Blur");

    setAssessmentQuestionnaire({
      ...assessmentQuestionnaire,
      [section?.uuid]: {
        ...assessmentQuestionnaire[section?.uuid],
        [name]: value?.trim(),
      },
    });
  };
  const addTableAssessmentValues = () => {
    let tempAsssessmentQuestionnaire = { ...assessmentQuestionnaire };
    tempAsssessmentQuestionnaire[section?.uuid] = {};
    section?.rowValues.forEach((row) => {
      section?.columnValues?.forEach((column) => {
        // console.log("column:- ", column);
        if (column?.columnType === "dropdown") {
          console.log("Inside fill Assessment drop down condition");
          tempAsssessmentQuestionnaire[section?.uuid][
            `${column?.uuid}.${row?.uuid}`
          ] = undefined;
        } else {
          tempAsssessmentQuestionnaire[section?.uuid][
            `${column?.uuid}.${row?.uuid}`
          ] = "";
        }
      });
      // row?.cells?.forEach((cell) => {
      //   console.log("cell", cell);
      //   if (cell?.columnType === "dropdown") {
      //     console.log("Inside fill Assessment drop down condition");
      //     tempAsssessmentQuestionnaire[section?.uuid][
      //       `${cell?.columnId}.${row?.uuid}`
      //     ] = undefined;
      //   } else {
      //     tempAsssessmentQuestionnaire[section?.uuid][
      //       `${cell?.columnId}.${row?.uuid}`
      //     ] = "";
      //   }
      // });
    });
    console.log(
      "Assessment in Fill Assessment Section:- ",
      tempAsssessmentQuestionnaire
    );
    setAssessmentQuestionnaire(tempAsssessmentQuestionnaire);
  };
  useEffect(() => {
    console.log(
      "assessment Section:- ",
      assessmentQuestionnaire[section?.uuid]
    );
    if (
      section?.layout === "table" &&
      !assessmentQuestionnaire[section?.uuid]
    ) {
      // addTableAssessmentValues();
    }
  }, []);
  return (
    <>
      <DialogBox
        title={<p>Cancel Assessment</p>}
        info1={
          <p>
            On canceling, all the entered details of the section will be
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
                // errors={errors ?? {}}
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
          ) : (
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
            />
          )}
        </div>
        {editMode && !params["*"].includes("view") ? (
          <div className="form-btn flex-between add-members-btn">
            <button
              type="reset"
              onClick={() => setOpenCancelDailog(true)}
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
                (e) => handleFormSubmit(e, true)
              }
              className="outlined-button add-button mr-10"
            >
              Save as draft
            </button>
            <button
              type="submit"
              onClick={
                // () =>
                // navigate(
                //     `/questionnaires/add-questionnaire/${params.id}`
                // )
                (e) => handleFormSubmit(e, false)
              }
              className="primary-button add-button"
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
