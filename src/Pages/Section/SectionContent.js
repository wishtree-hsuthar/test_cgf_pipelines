import { MenuItem, Select, Switch, TextField } from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { privateAxios } from "../../api/axios";
import { ADD_QUESTIONNAIRE } from "../../api/Url";
import { useParams } from "react-router-dom";

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
}));
const SectionContent = ({
    value,
    questionnaire,
    setQuestionnaire,
    uuid,
    setValue,
    index,
    section,
    id,
}) => {
    const ITEM_HEIGHT = 22;

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5,
            },
        },
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
        // saveSection();
        setValue(0);
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
        saveSection();
        console.log(
            "questionnaire after submiting questionnaire",
            questionnaire
        );
    };

    const params = useParams();

    const saveSection = async () => {
        try {
            const response = await privateAxios.post(
                ADD_QUESTIONNAIRE,
                questionnaire
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
        <div className="sect-form-card-info active">
            <div className="sect-form-innercard-blk">
                <div className="sect-ttl-blk flex-between">
                    <div className="sect-leftblk">
                        <h2 cla All OperatiossName="subheading">
                            {`Section ${value}`}{" "}
                        </h2>
                    </div>
                    <div className="sect-rightblk">
                        <div className="sect-ttl-right-iconblk">
                            <span className="sect-icon-blk add-sect-iconblk mr-40">
                                <img
                                    src={
                                        process.env.PUBLIC_URL +
                                        "/images/add-section-icon.svg"
                                    }
                                    alt=""
                                />
                            </span>
                            {questionnaire.sections.length > 1 && (
                                <span className="sect-icon-blk delete-iconblk">
                                    <img
                                        onClick={() => deleteSection(uuid)}
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
                <form onSubmit={handleSubmitSection}>
                    <div className="sect-form-card-blk">
                        <div className="sect-form-card-innerblk flex-between">
                            <div className="sect-card-form-leftfield">
                                <div className="form-group">
                                    <label for="emailid">Section Title</label>
                                    <TextField
                                        className="input-field"
                                        id="outlined-basic"
                                        placeholder="Enter section title"
                                        variant="outlined"
                                        onChange={handleInputSection}
                                        value={section.sectionTitle}
                                        name={"sectionTitle"}
                                    />
                                </div>
                            </div>
                            <div className="sect-card-form-rightfield flex-between">
                                <div className="form-group">
                                    <label for="layout">Layout</label>
                                    <div className="select-field">
                                        <Select
                                            IconComponent={(props) => (
                                                <KeyboardArrowDownRoundedIcon
                                                    {...props}
                                                />
                                            )}
                                            value={section.layout}
                                            onChange={handleInputSection}
                                            MenuProps={MenuProps}
                                            name={"layout"}
                                        >
                                            <MenuItem value="form">
                                                Form
                                            </MenuItem>
                                            <MenuItem value="table" selected>
                                                Table
                                            </MenuItem>
                                        </Select>
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
                                        <Select
                                            IconComponent={(props) => (
                                                <KeyboardArrowDownRoundedIcon
                                                    {...props}
                                                />
                                            )}
                                            value={section.isActive}
                                            onChange={handleInputSection}
                                            MenuProps={MenuProps}
                                            name={"isActive"}
                                        >
                                            <MenuItem value={"true"} selected>
                                                Active
                                            </MenuItem>
                                            <MenuItem value={"false"}>
                                                Inactive
                                            </MenuItem>
                                        </Select>
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
                                    />
                                </div>
                            </div>
                        </div>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SectionContent;
