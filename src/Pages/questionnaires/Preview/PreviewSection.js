import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PreviewQuestions from "./PreviewQuestions";
function PreviewSection({
    // questionnaire,
    // setQuestionnaire,
    // uuid,
    // setValue,
    // index,
    section,
}) {
    const navigate = useNavigate();
    const params = useParams();
   useEffect(() => {
      console.log("section:- ",section)
   },[])
    return (
        <>
            <div className="preview-card-wrapper">
                <div className="preview-sect-ttl-wrap">
                    <div class="preview-sect-card-ttl-blk">
                        <h2 className="subheading">Section Title</h2>
                    </div>
                    <div className="preview-sect-txt mb-0">
                        {section.sectionTitle}
                    </div>
                </div>
            </div>
            <div className="preview-card-wrapper">
                <div className="preview-que-wrap">
                    {section.questions.map((question) => (
                        <PreviewQuestions question={question} />
                    ))}
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
                    onClick={() =>
                        navigate(
                            `/questionnaires/add-questionnaire/${params.id}`
                        )
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

export default PreviewSection;
