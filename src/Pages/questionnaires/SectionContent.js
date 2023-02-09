import {
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { privateAxios } from "../../api/axios";
import { ADD_QUESTIONNAIRE } from "../../api/Url";
import { useNavigate, useParams } from "react-router-dom";
import DialogBox from "../../components/DialogBox";
import FormQuestions from "./FormQuestions";
import useCallbackState from "../../utils/useCallBackState";
import TableQuestions from "./Table/TableQuestions.js";
import { v4 as uuidv4 } from "uuid";
import Toaster from "../../components/Toaster";

const SectionContent = ({
    value,
    questionnaire,
    setQuestionnaire,
    uuid,
    setValue,
    index,
    section,
    id,
    globalSectionTitleError,
    setGlobalSectionTitleError,
    setSameSectionsNames,
    sameSectionsNames,
    err,
    setErr,
    tableErr,
    setTableErr,
    questionTitleList,
    setQuestionTitleList,
}) => {
    const navigate = useNavigate();
    // state to handle question level erros
    // const [err, setErr] = useState({ questionTitle: "", option: "" });
    // const [sameSectionsNames, setSameSectionsNames] = useState([]);
    // state to handle errors in table layout
    // const [tableErr, setTableErr] = useState("");
    const ITEM_HEIGHT = 42;

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4,
            },
        },
    };
    //Refr for Toaster
    const myRef = React.useRef();
    //Toaster Message setter
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });
    //method to call all error toaster from this method
    const setErrorToaster = (error) => {
        setToasterDetails(
            {
                titleMessage: "Error",
                descriptionMessage:
                    error?.response?.data?.message &&
                    typeof error.response.data.message === "string"
                        ? error.response.data.message
                        : "Something went wrong.",
                messageType: "error",
            },
            () => myRef.current()
        );
    };
    const [disableButton, setDisableButton] = useState(false);
    const onDialogPrimaryButtonClickHandler = () => {
        deleteSection(uuid);
    };
    const onDialogPrimaryButtonClickHandler1 = () => {
        // handleSubmitSection();
        setOpenDialog1(false);
        navigate("/questionnaires");
    };
    const onDialogSecondaryButtonClickHandler = () => {
        setOpenDialog(false);
    };
    const onDialogSecondaryButtonClickHandler1 = () => {
        setOpenDialog1(false);
    };
    const deleteSection = (uuid) => {
        let tempQuestionnare = { ...questionnaire };

        let tempSections = tempQuestionnare.sections.filter(
            (section) => section.uuid !== uuid
        );

    setQuestionnaire({
      ...tempQuestionnare,
      sections: tempSections,
    });
    // let newObj = {
    //   ...tempQuestionnare,
    //   sections: tempSections,
    // };

    // saveSection(newObj);

        setValue(0);
        setOpenDialog(false);
    };

    const validateTableQuestions = (tableCountError, tabIndex) => {
        // let tableCountError = 0;
        console.log("inside table question validator");
        let filteredTableSections = questionnaire?.sections.filter(
            (section) => section.layout === "table" // section.columnValues.map((col) => col.title)
        );
        let sameColumnTitleNamesInFilteredTableSections =
            filteredTableSections.map((section) => ({
                section: section.sectionTitle,
                columnTitles: section.columnValues.map((col) => col.title),
            }));

        console.log(
            "sameColumnTitleNamesInFilteredTableSections = ",
            sameColumnTitleNamesInFilteredTableSections
        );
        for (
            let sectionIndex = 0;
            sectionIndex < questionnaire.sections.length;
            sectionIndex++
        ) {
            const sectionObject = questionnaire.sections[sectionIndex];
            console.log("section object = ", sectionObject);
            if (sectionObject.layout === "table") {
                for (
                    let columnIndex = 0;
                    columnIndex < sectionObject.columnValues.length;
                    columnIndex++
                ) {
                    const columnTitle =
                        sectionObject.columnValues[columnIndex].title;
                    const columnType =
                        sectionObject.columnValues[columnIndex].columnType;
                    if (columnTitle === "") {
                        setTableErr("Error hai");
                        console.log(
                            "title not present in section = ",
                            sectionIndex
                        );
                        // setValue(sectionIndex);
                        tabIndex.push(sectionIndex);
                        tableCountError++;
                    }
                    if (columnType === "prefilled") {
                        console.log("inside prefiled");
                        questionnaire?.sections[
                            sectionIndex
                        ]?.rowValues?.forEach((row, rowId) => {
                            if (row?.cells[columnIndex]?.value) return;
                            setTableErr("Error hai");
                            tabIndex.push(sectionIndex);

                            tableCountError++;
                        });
                    }
                    // let filteredSameColumnTitle = sameColumnTitleNames.filter(
                    //     (name) => name === columnTitle
                    // );
                    // if (filteredSameColumnTitle.length > 1) {
                    //     console.log(
                    //         "same column names present = ",
                    //         filteredSameColumnTitle
                    //     );
                    //     setTableErr("Error hai");

                    //     tableCountError++;
                    // }
                    for (
                        let sameColumnTitleNamesIndex = 0;
                        sameColumnTitleNamesIndex <
                        sameColumnTitleNamesInFilteredTableSections.length;
                        sameColumnTitleNamesIndex++
                    ) {
                        let sameNameCount = 0;

                        const sectionToCheckColumnValues =
                            sameColumnTitleNamesInFilteredTableSections[
                                sameColumnTitleNamesIndex
                            ];
                        for (
                            let colIndex = 0;
                            colIndex <
                            sectionToCheckColumnValues.columnTitles.length;
                            colIndex++
                        ) {
                            const elementToCheck =
                                sectionToCheckColumnValues.columnTitles[
                                    colIndex
                                ];
                            let sectionIndex = questionnaire.sections
                                .map((section, index) => section.sectionTitle)
                                .indexOf(sectionToCheckColumnValues.section);
                            if (columnTitle === elementToCheck) {
                                sameNameCount++;
                            }
                            if (sameNameCount > 1) {
                                tableCountError++;
                                console.log(
                                    "Same name 1 se zyaada hai",
                                    columnTitle
                                );
                                console.log("in section = ", sectionIndex);
                                setTableErr("Same name hai");
                                tabIndex.push(sectionIndex);

                                // setValue(sectionIndex);
                                // setValue(
                                //     questionnaire.sections
                                //         .map(
                                //             (section) =>
                                //                 sectionToCheckColumnValues.section
                                //         )
                                //         .indexOf(
                                //             sectionToCheckColumnValues.section
                                //         )
                                // );

                                break;
                            }
                        }
                        // sectionToCheckColumnValues.columnTitles.map((title) => {
                        //     if (columnTitle === title) {
                        //         sameNameCount++;
                        //     }
                        //     if (sameNameCount > 1) {
                        //         tableCountError++;
                        //         console.log(
                        //             "Same name 1 se zyaada hai",
                        //             columnTitle
                        //         );
                        //         setTableErr("Same name hai");
                        //         // setValue(sectionIndex);
                        //     }
                        // });
                    }
                }
            }
        }

        // questionnaire?.sections[index]?.columnValues.forEach(
        //     (column, columnIdx) => {
        //         if (column?.title === "") {
        //             setTableErr("Error hai");
        //             countError++;
        //         }
        //         if (column?.columnType === "prefilled") {
        //             console.log("inside prefiled");
        //             questionnaire?.sections[index]?.rowValues?.forEach(
        //                 (row, rowId) => {
        //                     if (row?.cells[columnIdx]?.value) return;
        //                     setTableErr("Error hai");
        //                     countError++;
        //                 }
        //             );
        //         }
        //     }
        // );
        console.log("count Error in table validator: ", tableCountError);
        return tableCountError;
    };

    const validateSection = async () => {
        let countError = 0;
        let sectionTitles = questionnaire?.sections.map(
            (section) => section.sectionTitle
        );
        // let sameTitleSectionIndex = [];
        let tabIndex = [];
        setSameSectionsNames([...sectionTitles]);

        for (let index = 0; index < questionnaire?.sections.length; index++) {
            let sameNameCount = 0;
            for (
                let innerIndex = 0;
                innerIndex < sectionTitles.length;
                innerIndex++
            ) {
                const element = sectionTitles[innerIndex];
                if (questionnaire.sections[index].sectionTitle === element) {
                    sameNameCount++;
                    console.log("sameNameCount for section =", sameNameCount);
                }
            }
            if (sameNameCount > 1) {
                // sameTitleSectionIndex.push(index);
                setValue(index);
                console.log(
                    "same name counter exceeds more than once",
                    sameNameCount
                );

                countError++;
                setGlobalSectionTitleError({
                    errMsg: "Section name already in use",
                });
                // tabIndex.push(index);
                setValue(index);

                return false;
            } else {
                if (questionnaire.sections[index].layout == "table") {
                    countError = await validateTableQuestions(
                        countError,
                        tabIndex
                    );
                } else if (questionnaire.sections[index].layout == "form") {
                    console.log("count Error", countError);
                    //Rajkumar's save section
                    let tempError = {
                        questionTitle: "",
                        option: "",
                    };
                    for (
                        let sectionIndex = 0;
                        sectionIndex < questionnaire?.sections.length;
                        sectionIndex++
                    ) {
                        const index = sectionIndex;
                        console.log("index -", index);
                        let questionsOfListEachSection = questionnaire.sections[
                            index
                        ].questions.map((question) => question.questionTitle);
                        console.log(
                            "questionsOfListEachSection = ",
                            questionsOfListEachSection
                        );
                        questionnaire?.sections[index]?.questions?.map(
                            (question, questionIdx) => {
                                if (question?.questionTitle === "") {
                                    console.log(
                                        "question title is empty in section",
                                        index
                                    );

                                    tempError["questionTitle"] =
                                        "Enter question title";
                                    countError++;
                                    // tabIndex.push(sectionIndex);

                                    setValue(index);
                                }
                                let filteredSameQuestionList =
                                    questionsOfListEachSection.filter(
                                        (ques) =>
                                            ques === question?.questionTitle
                                    );
                                console.log(
                                    "filterd question titles = ",
                                    filteredSameQuestionList
                                );
                                if (filteredSameQuestionList.length > 1) {
                                    console.log(
                                        "Question title already in use = ",
                                        question.questionTitle
                                    );
                                    tempError["questionTitle"] =
                                        "Question title already in use.";
                                    countError++;
                                    setValue(index);
                                    // tabIndex.push(sectionIndex);
                                }
                                //   console.log("question in validate section map",question)
                                if (
                                    [
                                        "dropdown",
                                        "checkbox",
                                        "radioGroup",
                                    ].includes(question?.inputType)
                                ) {
                                    question?.options?.map((option) => {
                                        if (option === "") {
                                            tempError["option"] =
                                                "Enter option";
                                            countError++;
                                            // tabIndex.push(sectionIndex);
                                        }
                                    });
                                }
                            }
                        );
                        setErr({ ...tempError });
                    }
                }
            }
        }

        // if (questionnaire?.sections[index]?.layout === "table") {
        //     countError = validateTableQuestions();
        // } else {
        //     console.log("count Error", countError);
        //     //Rajkumar's save section
        //     let tempError = {
        //         questionTitle: "",
        //         option: "",
        //     };
        //     for (
        //         let sectionIndex = 0;
        //         sectionIndex < questionnaire?.sections.length;
        //         sectionIndex++
        //     ) {
        //         const index = sectionIndex;
        //         console.log("index -", index);
        //         questionnaire?.sections[index]?.questions?.map(
        //             (question, questionIdx) => {
        //                 if (question?.questionTitle === "") {
        //                     console.log(
        //                         "question title is empty in section",
        //                         index
        //                     );
        //                     tempError["questionTitle"] = "Enter question title";
        //                     countError++;
        //                     setValue(index);
        //                 }
        //                 //   console.log("question in validate section map",question)
        //                 if (
        //                     ["dropdown", "checkbox", "radioGroup"].includes(
        //                         question?.inputType
        //                     )
        //                 ) {
        //                     question?.options?.map((option) => {
        //                         if (option === "") {
        //                             tempError["option"] = "Enter option";
        //                             countError++;
        //                         }
        //                     });
        //                 }
        //             }
        //         );
        //         setErr({ ...tempError });
        //     }
        // }

        //Madhav's save section
        // console.log("questionnaire", questionnaire);

        if (questionnaire?.title === "" || questionnaire?.sheetName === "") {
            // setGlobalSectionTitleError({ errMsg: "Section title required" });
            countError++;
        }
        for (let i = 0; i < questionnaire.sections.length; i++) {
            if (questionnaire.sections[i].sectionTitle === "") {
                setGlobalSectionTitleError({
                    errMsg: "Section title required",
                });
                setValue(i);
                // tabIndex.push(i);

                countError++;
                return false;
            }
        }
        // if (tabIndex.length > 0) {
        //     let distinctTabIndex = [...tabIndex];
        //     console.log("disticet tab index = ", distinctTabIndex);
        //     setValue(distinctTabIndex[0]);
        // }
        if (countError === 0) {
            console.log("count error is 0");
            setDisableButton(true);

            return true;
        }

        return false;
    };
    console.log("same name array = ", sameSectionsNames);
    const checkNamePresentInSameNameArrayList = (name) => {
        let listnames = [...sameSectionsNames];
        let filteredSameName = listnames.filter(
            (listName) => listName === name
        );
        console.log("filtered same name object = ", filteredSameName);
        if (filteredSameName.length > 1) {
            console.log("filteredSameName = ", filteredSameName);
            return true;
        } else {
            return false;
        }
    };

    const sectionLayoutChangeHandler = (e) => {
        const { name, value } = e.target;
        console.log("name:", name, "value:", value);
        let tempQuestionnaire = { ...questionnaire };
        console.log("tempQuestionnaire: ", tempQuestionnaire);
        tempQuestionnaire.sections[index]["layout"] = value;
        //check if layout is table remove form layout questions and add initial rows and colums
        if (value === "table") {
            tempQuestionnaire.sections[index].questions = [];
            const initialId = uuidv4();
            tempQuestionnaire.sections[index].columnValues = [
                {
                    uuid: initialId,
                    title: "",
                    isRequired: true,
                    columnType: "textbox",
                    options: ["", ""],
                    validation: "",
                },
            ];
            tempQuestionnaire.sections[index].rowValues = [
                {
                    uuid: uuidv4(),
                    cells: [
                        {
                            columnId: initialId, // UUID of the column
                            value: "",
                        },
                    ],
                },
                {
                    uuid: uuidv4(),
                    cells: [
                        {
                            columnId: initialId, // UUID of the column
                            value: "",
                        },
                    ],
                },
            ];
        }
        //check if layout is form then remove table questions and add form inital question
        if (value === "form") {
            tempQuestionnaire.sections[index].columnValues = [];
            tempQuestionnaire.sections[index].rowValues = [];
            tempQuestionnaire.sections[index].questions = [
                {
                    uuid: uuidv4(),
                    questionTitle: "",
                    inputType: "singleTextbox", // single textbox, multi textbox, dropdown, checkbox, radio group, calendar, ratings, boolean
                    validation: "", // isRequired, maxLength, minLength, alpha, alphaNumeric, numeric
                    defaultValue: "", // Will only be there in case of the inputType which requires the default value
                    isRequired: true,
                    options: ["", ""], // multiple values from which user can select
                },
            ];
        }
        console.log("tempQuestionnaire after layout update", tempQuestionnaire);
        setQuestionnaire(tempQuestionnaire);
    };
    const handleInputSection = (e) => {
        const { name, value } = e.target;
        let tempQuestionnare = { ...questionnaire };

        tempQuestionnare.sections[index][name] = value;
        setQuestionnaire(tempQuestionnare);
    };
    const handleInputBlur = (e) => {
        const { name, value } = e.target;
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[index][name] = value?.trim();
        setQuestionnaire(tempQuestionnaire);
    };
    const handleSubmitSection = async (e, isPublished) => {
        e?.preventDefault();
        // setSameSectionsNames([]);

        const response = await validateSection();
        if (response) {
            return await saveSection(undefined, isPublished);
        }
        return false;
        // validateSection() && saveSection()
    };

    const params = useParams();
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialog1, setOpenDialog1] = useState(false);

    const saveSection = async (questionnaireObj, isPublished) => {
        try {
            const response = await privateAxios.post(
                ADD_QUESTIONNAIRE,
                questionnaireObj ? questionnaireObj : questionnaire
            );
            if (response.status === 201) {
                const fetch = async () => {
                    try {
                        const fetchResponse = await privateAxios.get(
                            `${ADD_QUESTIONNAIRE}/${response?.data?.uuid}`
                        );

                        setQuestionnaire({ ...fetchResponse.data });
                        setTimeout(() => {
                            setValue(fetchResponse.data.sections.length - 1);
                            // setDisableButton(true);
                        }, 3000);
                        setToasterDetails(
                            {
                                titleMessage: "Success!",
                                descriptionMessage: `${
                                    isPublished
                                        ? "Questionnaire published successfully!"
                                        : "Section details saved successfully!"
                                }`,
                                messageType: "success",
                            },
                            () => myRef.current()
                        );
                        console.log("index after save section ", index);
                        setTimeout(() => navigate("/questionnaires"), 3000);
                        return true;
                    } catch (error) {
                        console.log("error from fetch questionnaire", error);

                        setErrorToaster(error);
                        return false;
                    }
                };
                fetch();
            }
            return response.data.uuid;
        } catch (error) {
            setDisableButton(false);
            if (error?.code === "ERR_CANCELED") return;
            if (error?.response?.status == 401) {
                console.log("Session timeout in save questionnaire");
                setToasterDetails(
                    {
                        titleMessage: "Error!",
                        descriptionMessage: `Session Timeout: Please login again`,
                        messageType: "error",
                    },
                    () => myRef.current()
                );
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setErrorToaster(error);
                return false;
            }
        }
    };
    const onCancelClickHandler = () => {
        setOpenDialog1(true);
    };
    const onPublishButtonClickHandler = async (e) => {
        console.log("inside publist button click");
        const response = await handleSubmitSection(e, true);
        if (response) {
            try {
                await privateAxios.put(
                    `${ADD_QUESTIONNAIRE}/publish/${response}`
                );
            } catch (error) {
                if (error?.code === "ERR_CANCELED") return;
                console.log("in onPublishButtonClickHandler ");
                setErrorToaster(error);
            }
        }
    };

    return (
        // <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
        <div className="sect-form-card-wrapper">
            <Toaster
                myRef={myRef}
                titleMessage={toasterDetails.titleMessage}
                descriptionMessage={toasterDetails.descriptionMessage}
                messageType={toasterDetails.messageType}
            />
            <DialogBox
                title={
                    <p>
                        Delete Section{" "}
                        {section?.sectionTitle &&
                            '"' + section?.sectionTitle + '"'}
                    </p>
                }
                info1={
                    <p>
                        On deleting, all the details of this section would get
                        deleted and this will be an irreversible action.
                    </p>
                }
                info2={
                    <p>
                        Do you still want to delete the{" "}
                        <b>
                            {section?.sectionTitle
                                ? section?.sectionTitle
                                : "Section"}
                        </b>
                        ?
                    </p>
                }
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
                onPrimaryModalButtonClickHandler={
                    onDialogPrimaryButtonClickHandler
                }
                onSecondaryModalButtonClickHandler={
                    onDialogSecondaryButtonClickHandler
                }
                openModal={openDialog}
                setOpenModal={setOpenDialog}
            />
            {/* Dialog box for cancel */}
            <DialogBox
                title={<p>Cancel Questionnaire</p>}
                info1={
                    <p> On canceling, newly added details will be discarded.</p>
                }
                info2={<p>Do you still want to cancel it?</p>}
                primaryButtonText="Yes"
                secondaryButtonText="No"
                onPrimaryModalButtonClickHandler={
                    onDialogPrimaryButtonClickHandler1
                }
                onSecondaryModalButtonClickHandler={
                    onDialogSecondaryButtonClickHandler1
                }
                openModal={openDialog1}
                setOpenModal={setOpenDialog1}
            />
            <div className="sect-form-card-info">
                <div className="sect-form-innercard-blk">
                    {questionnaire.sections.length > 1 && (
                        <div className="sect-ttl-blk flex-between">
                            <div className="sect-leftblk">
                                {/* <h2 className="subheading">
                                {`Section ${value}`}{" "}
                            </h2> */}
                            </div>
                            <div className="sect-rightblk">
                                <div className="sect-ttl-right-iconblk">
                                    {/* <span className="sect-icon-blk add-sect-iconblk mr-40">
                                    <img
                                        src={
                                            process.env.PUBLIC_URL +
                                            "/images/add-section-icon.svg"
                                        }
                                        alt=""
                                    />
                                </span> */}
                                    <span className="sect-icon-blk delete-iconblk">
                                        <Tooltip title="Delete section">
                                            <img
                                                onClick={() =>
                                                    setOpenDialog(true)
                                                }
                                                src={
                                                    process.env.PUBLIC_URL +
                                                    "/images/delete-icon.svg"
                                                }
                                                alt=""
                                            />
                                        </Tooltip>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    <form>
                        <div className="sect-form-card-blk">
                            <div className="sect-form-card-innerblk flex-between">
                                <div className="sect-card-form-leftfield">
                                    <div className="form-group">
                                        <label htmlFor="title">
                                            Section Name{" "}
                                            <span className="mandatory">*</span>
                                        </label>
                                        <TextField
                                            className={`input-field ${
                                                (section.sectionTitle === "" &&
                                                    globalSectionTitleError?.errMsg &&
                                                    "input-error") ||
                                                (checkNamePresentInSameNameArrayList(
                                                    section.sectionTitle
                                                ) &&
                                                    globalSectionTitleError?.errMsg &&
                                                    "input-error")
                                            }`}
                                            id="outlined-basic"
                                            placeholder="Enter section name"
                                            variant="outlined"
                                            onChange={handleInputSection}
                                            onBlur={handleInputBlur}
                                            value={section.sectionTitle}
                                            name={"sectionTitle"}
                                            helperText={
                                                section.sectionTitle === "" &&
                                                globalSectionTitleError?.errMsg
                                                    ? "Enter the section name"
                                                    : checkNamePresentInSameNameArrayList(
                                                          section.sectionTitle
                                                      ) &&
                                                      globalSectionTitleError?.errMsg
                                                    ? globalSectionTitleError?.errMsg
                                                    : " "
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="sect-card-form-rightfield">
                                    <div className="form-group">
                                        <label htmlFor="layout">
                                            Layout{" "}
                                            <span className="mandatory">*</span>
                                        </label>
                                        <div className="select-field">
                                            <FormControl className="fullwidth-field">
                                                <Select
                                                    IconComponent={(props) => (
                                                        <KeyboardArrowDownRoundedIcon
                                                            {...props}
                                                        />
                                                    )}
                                                    name={"layout"}
                                                    value={section?.layout}
                                                    onChange={
                                                        sectionLayoutChangeHandler
                                                    }
                                                    MenuProps={MenuProps}
                                                >
                                                    <MenuItem value="form">
                                                        Form
                                                    </MenuItem>
                                                    <MenuItem
                                                        value="table"
                                                        selected
                                                    >
                                                        Table
                                                    </MenuItem>
                                                </Select>
                                                <FormHelperText>
                                                    {" "}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </div>
                                    {/* <div className="form-group">
                                        <label htmlFor="status">
                                            Status{" "}
                                            <span className="mandatory">*</span>
                                        </label>
                                        <div className="select-field">
                                            <FormControl className="fullwidth-field">
                                                <Select
                                                    IconComponent={(props) => (
                                                        <KeyboardArrowDownRoundedIcon
                                                            {...props}
                                                        />
                                                    )}
                                                    value={
                                                        section?.isActive
                                                            ? "active"
                                                            : "inActive"
                                                    }
                                                    onChange={
                                                        handleStatusChange
                                                    }
                                                    MenuProps={MenuProps}
                                                    name={"isActive"}
                                                >
                                                    <MenuItem
                                                        value={"active"}
                                                        selected
                                                    >
                                                        Active
                                                    </MenuItem>
                                                    <MenuItem
                                                        value={"inActive"}
                                                    >
                                                        Inactive
                                                    </MenuItem>
                                                </Select>
                                                <FormHelperText>
                                                    {" "}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                            <div className="sect-form-card-innerblk">
                                <div className="sect-card-form-leftfield full-width">
                                    <div className="form-group mb-0">
                                        <label htmlFor="emailid">
                                            Description
                                        </label>
                                        <TextField
                                            className="input-field"
                                            id="outlined-basic"
                                            placeholder="Enter description"
                                            variant="outlined"
                                            onChange={handleInputSection}
                                            onBlur={handleInputBlur}
                                            name={"description"}
                                            value={section.description}
                                            // multiline
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {section?.layout === "form" ? (
                <FormQuestions
                    sectionIndex={index}
                    questionnaire={questionnaire}
                    setQuestionnaire={setQuestionnaire}
                    err={err}
                    setErr={setErr}
                    questionTitleList={questionTitleList}
                    setQuestionTitleList={setQuestionTitleList}
                />
            ) : (
                <TableQuestions
                    sectionIndex={index}
                    questionnaire={questionnaire}
                    setQuestionnaire={setQuestionnaire}
                    tableErr={tableErr}
                    setTableErr={setTableErr}
                />
            )}
            <div className="form-btn flex-between add-members-btn que-page-btn">
                <button
                    type="reset"
                    className="secondary-button mr-10"
                    onClick={onCancelClickHandler}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    onClick={handleSubmitSection}
                    disabled={disableButton}
                    className="outlined-button add-button mr-10"
                >
                    {questionnaire?.isDraft || questionnaire?.isPublished
                        ? "Update"
                        : "Save"}
                </button>
                <button
                    type="submit"
                    disabled={disableButton}
                    className="primary-button add-button"
                    onClick={onPublishButtonClickHandler}
                >
                    Publish
                </button>
            </div>
        </div>
        // </div>
    );
};

export default SectionContent;
