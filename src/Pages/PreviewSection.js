import React from "react";
import PreviewQuestions from "./PreviewQuestions";
function PreviewSection({
    // questionnaire,
    // setQuestionnaire,
    // uuid,
    // setValue,
    // index,
    section,
}) {
    const questions = [
        {
            id: "",
            uuid: "",
            questionTitle: "Company Name",
            srNo: "", // TBD
            inputType: "Single Textbox", // single textbox, multi textbox, dropdown, checkbox, radio group, calendar, ratings,true
            validations: [], // isRequired, maxLength, minLength, alpha, alphaNumeric, numeric
            defaultValue: "", // Will only be there in case of the inputType which requires the default value
            options: [""], // multiple values from which user can select
        },
        {
            id: "",
            uuid: "",
            questionTitle: "Company type",
            srNo: "", // TBD
            inputType: "radio-button", // single textbox, multi textbox, dropdown, checkbox, radio group, calendar, ratings,true
            validations: [], // isRequired, maxLength, minLength, alpha, alphaNumeric, numeric
            defaultValue: "", // Will only be there in case of the inputType which requires the default value
            options: ["Service Based Company", "Product Based Company"], // multiple values from which user can select
        },
        {
            id: "",
            uuid: "",
            questionTitle: "Status",
            srNo: "", // TBD
            inputType: "dropdown", // single textbox, multi textbox, dropdown, checkbox, radio group, calendar, ratings,true
            validations: [], // isRequired, maxLength, minLength, alpha, alphaNumeric, numeric
            defaultValue: "", // Will only be there in case of the inputType which requires the default value
            options: ["Service Based Company", "Product Based Company"], // multiple values from which user can select
        },
        {
            id: "",
            uuid: "",
            questionTitle: "Employee Type",
            srNo: "", // TBD
            inputType: "checkbox", // single textbox, multi textbox, dropdown, checkbox, radio group, calendar, ratings,true
            validations: [], // isRequired, maxLength, minLength, alpha, alphaNumeric, numeric
            defaultValue: "", // Will only be there in case of the inputType which requires the default value
            options: ["Full time", "Part time"], // multiple values from which user can select
        },
        {
            id: "",
            uuid: "",
            questionTitle: "Joining date",
            srNo: "", // TBD
            inputType: "Date", // single textbox, multi textbox, dropdown, checkbox, radio group, calendar, ratings,true
            validations: [], // isRequired, maxLength, minLength, alpha, alphaNumeric, numeric
            defaultValue: "", // Will only be there in case of the inputType which requires the default value
            options: ["Full time", "Part time"], // multiple values from which user can select
        },
    ];
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
                    {questions.map((question) => (
                        <PreviewQuestions question={question} />
                    ))}
                </div>
            </div>
            <div className="form-btn flex-between add-members-btn">
                <button type="reset" className="secondary-button mr-10">
                    Cancel
                </button>
                <button type="submit" className="primary-button add-button">
                    Edit
                </button>
            </div>
        </>
    );
}

export default PreviewSection;
