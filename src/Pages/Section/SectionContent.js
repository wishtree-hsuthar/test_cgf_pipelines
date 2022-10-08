import {
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    Switch,
    TextField,
} from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import { styled } from "@mui/material/styles";
import { set, useForm } from "react-hook-form";
import { privateAxios } from "../../api/axios";
import { ADD_QUESTIONNAIRE } from "../../api/Url";
import { useParams } from "react-router-dom";
import DialogBox from "../../components/DialogBox";

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
        "& .MuiSwitch-thumb": {
            width: 15,
        },
        "& .MuiSwitch-switchBase.Mui-checked": {
            transform: "translateX(9px)",
        },
    },
    "& .MuiSwitch-switchBase": {
        padding: 2,
        "&.Mui-checked": {
            transform: "translateX(12px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor:
                    theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
            },
        },
    },
    "& .MuiSwitch-thumb": {
        boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(["width"], {
            duration: 200,
        }),
    },
    "& .MuiSwitch-track": {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(255,255,255,.35)"
                : "rgba(0,0,0,.25)",
        boxSizing: "border-box",
    },
})); //
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
}) => {
    const ITEM_HEIGHT = 22;

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5,
            },
        },
    };

    console.log("global title error", globalSectionTitleError);
    const onDialogPrimaryButtonClickHandler = () => {
        deleteSection(uuid);
    };
    const onDialogSecondaryButtonClickHandler = () => {
        setOpenDialog(false);
    };
    const deleteSection = (uuid) => {
        let tempQuestionnare = { ...questionnaire };

        let tempSections = tempQuestionnare.sections.filter(
            (section) => section.uuid !== uuid
        );

        console.log("filter sections", tempQuestionnare);
        console.log("filter sections", tempSections);
        console.log("filter sections id", uuid);
        setQuestionnaire({
            ...tempQuestionnare,
            sections: tempSections,
        });
        let newObj = {
            ...tempQuestionnare,
            sections: tempSections,
        };

        saveSection(newObj);

        setValue(0);
        setOpenDialog(false);
    };

    const [titleError, setTitleError] = useState({
        errorMsg: "",
    });
    const validateSection = () => {
        console.log("questionnaire", questionnaire);
        let countError = 0;

        for (let i = 0; i < questionnaire.sections.length; i++) {
            // const element = array[i];
            console.log(
                "section title in for loop",
                questionnaire.sections[i].sectionTitle
            );
            if (questionnaire.sections[i].sectionTitle === "") {
                setGlobalSectionTitleError({
                    errMsg: "Section title required",
                });
                console.log("in validate section for block");
                setValue(i);
                countError++;
                return false;
            }
        }
        if (countError == 0) {
            return true;
        }
        // if (section?.sectionTitle === "") {
        //     setTitleError("Section title required");
        //     return false;
        // } else {
        //     setTitleError("");

        //     return true;
        // }
    };

    const handleInputSection = (e) => {
        const { name, value } = e.target;
        let tempQuestionnare = { ...questionnaire };
        tempQuestionnare.sections[index][name] =
            value === "true" ? true : value === "false" ? false : value;
        setQuestionnaire(tempQuestionnare);
        console.log("Name ", name);
        console.log("Value ", value);
    };
    const handleSubmitSection = (e) => {
        // data = {
        //     ...data,
        //     isActive: data.isActive === "Inactive" ? false : true,
        //     layout: data.layout === "Form" ? "form" : "table",
        // };
        // let tempSections = [...questionnaire.sections];
        // tempSections[index] = data;
        // setQuestionnaire({
        //     ...questionnaire,
        //     // sections: [...questionnaire.sections, sectionObj],
        //     sections: tempSections,
        // });
        e.preventDefault();
        validateSection() && saveSection();
        console.log(
            "questionnaire after submiting questionnaire",
            questionnaire
        );
    };

    const params = useParams();
    const [openDialog, setOpenDialog] = useState(false);

    const saveSection = async (questionnaireObj) => {
        try {
            const response = await privateAxios.post(
                ADD_QUESTIONNAIRE,
                questionnaireObj ? questionnaireObj : questionnaire
            );
            console.log("response from save section", response);
            if (response.status === 201) {
                const fetch = async () => {
                    try {
                        const response = await privateAxios.get(
                            `http://localhost:3000/api/questionnaires/${params.id}`
                        );
                        console.log(
                            "response from fetch questionnaire",
                            response
                        );
                        setQuestionnaire({ ...response.data });
                    } catch (error) {
                        console.log("error from fetch questionnaire", error);
                    }
                };
                fetch();
            }
        } catch (error) {
            console.log("error from section component", error);
        }
    };
    const [sectionObj, setSectionObj] = useState({ ...section });
    // console.log("questionnaire after submiting questionnaire", sectionObj);

    const helperTextForSectionForm = {
        sectionTitle: {
            required: "Enter section title",
        },
        isActive: {
            required: "Select status",
        },
        layout: {
            required: "Select layout",
        },
    };

    const { reset, handleSubmit, control } = useForm({
        defaultValues: {
            ...sectionObj,
            isActive: sectionObj.isActive === "true" ? "Active" : "Inactive",
            layout: sectionObj.layout === "form" ? "Form" : "Table",
        },
    });
    return (
        // <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
        <div className="sect-form-card-wrapper">
            <DialogBox
                title={<p>Delete Section "{section?.sectionTitle}"</p>}
                info1={
                    <p>
                        On deleting all the details of this section would get
                        deleted and this will be an irreversible action, Are you
                        want to remove the section name?
                    </p>
                }
                info2={
                    <p>
                        Are you sure you want to delete{" "}
                        <b>{section?.sectionTitle}</b>?
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
            <div className="sect-form-card-info active">
                <div className="sect-form-innercard-blk">
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
                                {questionnaire.sections.length > 1 && (
                                    <span className="sect-icon-blk delete-iconblk">
                                        <img
                                            onClick={() => setOpenDialog(true)}
                                            src={
                                                process.env.PUBLIC_URL +
                                                "/images/delete-icon.svg"
                                            }
                                            alt=""
                                        />
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <form>
                        <div className="sect-form-card-blk">
                            <div className="sect-form-card-innerblk flex-between">
                                <div className="sect-card-form-leftfield">
                                    <div className="form-group">
                                        <label for="title">Section Title</label>
                                        <TextField
                                            className={`input-field ${
                                                section.sectionTitle === "" &&
                                                globalSectionTitleError?.errMsg &&
                                                "input-error"
                                            }`}
                                            id="outlined-basic"
                                            placeholder="Enter section title"
                                            variant="outlined"
                                            // error={
                                            //     section.sectionTitle.length !=
                                            //     ""
                                            // }
                                            inputProps={{ maxLength: 250 }}
                                            onChange={handleInputSection}
                                            value={section.sectionTitle}
                                            name={"sectionTitle"}
                                            helperText={
                                                section.sectionTitle === "" &&
                                                globalSectionTitleError?.errMsg
                                                    ? globalSectionTitleError.errMsg
                                                    : " "
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="sect-card-form-rightfield flex-between">
                                    <div className="form-group">
                                        <label for="layout">Layout</label>
                                        <div className="select-field">
                                            <FormControl>
                                                <Select
                                                    IconComponent={(props) => (
                                                        <KeyboardArrowDownRoundedIcon
                                                            {...props}
                                                        />
                                                    )}
                                                    value={section.layout}
                                                    onChange={
                                                        handleInputSection
                                                    }
                                                    MenuProps={MenuProps}
                                                    name={"layout"}
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
                                            {/* <Dropdown
                                            name={"layout"}
                                            control={control}
                                            placeholder={"Select layout"}
                                            options={["Form", "Table"]}
                                            rules={{
                                                required: true,
                                            }}
                                            myHelper={helperTextForSectionForm}
                                        /> */}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label for="status">Status</label>
                                        <div className="select-field">
                                            <FormControl>
                                                <Select
                                                    IconComponent={(props) => (
                                                        <KeyboardArrowDownRoundedIcon
                                                            {...props}
                                                        />
                                                    )}
                                                    value={section.isActive}
                                                    onChange={
                                                        handleInputSection
                                                    }
                                                    MenuProps={MenuProps}
                                                    name={"isActive"}
                                                >
                                                    <MenuItem
                                                        value={"true"}
                                                        selected
                                                    >
                                                        Active
                                                    </MenuItem>
                                                    <MenuItem value={"false"}>
                                                        Inactive
                                                    </MenuItem>
                                                </Select>
                                                <FormHelperText>
                                                    {" "}
                                                </FormHelperText>
                                            </FormControl>
                                            {/* <Dropdown
                                            name={"isActive"}
                                            control={control}
                                            options={["Active", "Inactive"]}
                                            placeholder={"Select status"}
                                            rules={{
                                                required: true,
                                            }}
                                            myHelper={helperTextForSectionForm}
                                        /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sect-form-card-innerblk">
                                <div className="sect-card-form-leftfield full-width">
                                    <div className="form-group mb-0">
                                        <label for="emailid">Description</label>
                                        <TextField
                                            className="input-field"
                                            id="outlined-basic"
                                            placeholder="Enter description"
                                            variant="outlined"
                                            onChange={handleInputSection}
                                            name={"description"}
                                            value={section.description}
                                            // multiline
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <button onClick={handleSubmit}>Submit</button> */}
                            {/* Question content component over here */}
                        </div>
                    </form>
                </div>
            </div>
            <div className="form-btn flex-between add-members-btn que-page-btn">
                <button type="reset" className="secondary-button mr-10">
                    Cancel
                </button>
                <button
                    type="submit"
                    onClick={handleSubmitSection}
                    className="primary-button add-button"
                >
                    Save
                </button>
            </div>
        </div>
        // </div>
    );
};

export default SectionContent;
