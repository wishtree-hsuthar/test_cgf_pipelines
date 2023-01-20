import React, { useEffect } from "react";
import PreviewQuestions from "./PreviewQuestions";
import TableRender from "../Table/TableRender.js";
function PreviewSection({
    questionnaire,

    section,
    sectionIndex,
}) {
    useEffect(() => {
        console.log("section:- ", section);
    }, []);
    return (
        <>
            {/* <div className="preview-card-wrapper"> */}
            <div className="preview-sect-ttl-wrap">
                <div className="preview-sect-card-ttl-blk">
                    <h2 className="subheading">{section?.sectionTitle}</h2>
                </div>
                <div className="preview-sect-txt">{section?.description}</div>
                {/* <p>{section?.description}</p> */}
            </div>
            {/* <div className="preview-sect-txt mb-0"></div> */}
            {/* </div> */}
            {/* </div> */}
            <div className="preview-card-wrapper">
                <div className="preview-que-wrap que-preview">
                    {section?.layout === "form" ? (
                        section.questions.map((question) => (
                            <PreviewQuestions
                                key={question?.uuid}
                                question={question}
                            />
                        ))
                    ) : (
                        <TableRender
                            questionnaire={questionnaire}
                            sectionIndex={sectionIndex}
                            isPreview={true}
                        />
                    )}
                </div>
                {/* <div className="form-btn flex-between add-members-btn mt-30">
          <button
            type="reset"
            onClick={() =>
              navigate(`/questionnaires/add-questionnaire/${params.id}`)
            }
            className="secondary-button mr-10"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={() =>
              navigate(`/questionnaires/add-questionnaire/${params.id}`)
            }
            className="primary-button add-button"
          >
            Update
          </button>
        </div> */}
            </div>
        </>
    );
}

export default PreviewSection;
