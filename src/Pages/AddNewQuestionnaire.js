import React, { useState, useEffect } from "react";
import {
    TextField,
    Select,
    MenuItem,
    FormGroup,
    Box,
    Modal,
    Fade,
    Backdrop,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Tab, Tabs, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import CloseIcon from "@mui/icons-material/Close";
import SectionContent from "./Section/SectionContent";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../api/axios";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const ITEM_HEIGHT = 22;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5,
        },
    },
};
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

const data = [
    { id: 0, label: "Country" },
    { id: 1, label: "City" },
];

const dropdownData = [
    { id: 0, label: "Textbox" },
    { id: 1, label: "Calendar" },
    { id: 2, label: "Radiobutton" },
    { id: 3, label: "Dropdown" },
];

function AddNewQuestionnaire() {
    const [value, setValue] = React.useState(0);
    // questionnaire id
    const { id } = useParams();

    /* Popup */
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    const [globalSectionTitleError, setGlobalSectionTitleError] = useState({
        errMsg: "",
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [questionnaire, setQuestionnaire] = useState({
        uuid: id,
        version: "", // TBD
        title: "",
        sections: [
            {
                id: "",
                isRequired: true,

                uuid: uuidv4(),
                srNo: "", // TBD
                sectionTitle: "",
                description: "",
                layout: "form", // form | table
                isActive: false,
                questions: [
                    {
                        id: "",
                        uuid: "",
                        questionTitle: "",
                        srNo: "", // TBD
                        inputType: "", // single textbox, multi textbox, dropdown, checkbox, radio group, calendar, ratings,true
                        validations: [], // isRequired, maxLength, minLength, alpha, alphaNumeric, numeric
                        defaultValue: "", // Will only be there in case of the inputType which requires the default value
                        options: [], // multiple values from which user can select
                    },
                ],
                value: 1,
            },
        ],
        isDraft: true,
        isPublished: false,
        createdAt: Date,
        updatedAt: Date,
        createdBy: "",
        updatedBy: "",
    });
    useEffect(() => {
        let isMounted = true;
        let controller = new AbortController();
        const fetch = async () => {
            try {
                const response = await privateAxios.get(
                    `http://localhost:3000/api/questionnaires/${id}`,
                    {
                        signal: controller.signal,
                    }
                );
                console.log("response from fetch questionnaire", response);
                isMounted && setQuestionnaire({ ...response.data });
            } catch (error) {
                console.log("error from fetch questionnaire", error);
            }
        };
        fetch();
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    const addSection = () => {
        setQuestionnaire({
            ...questionnaire,
            sections: [
                ...questionnaire.sections,
                {
                    id: "",
                    uuid: uuidv4(),
                    srNo: "", // TBD
                    sectionTitle: "",
                    description: "",
                    layout: "form", // form | table
                    isActive: true,
                    questions: [
                        {
                            id: "",
                            uuid: uuidv4(),
                            title: "",
                            srNo: "", // TBD
                            inputType: "", // single textbox, multi textbox, dropdown, checkbox, radio group, calendar, ratings,true
                            validations: [], // isRequired, maxLength, minLength, alpha, alphaNumeric, numeric
                            defaultValue: "", // Will only be there in case of the inputType which requires the default value
                            options: [], // multiple values from which user can select
                        },
                    ],
                    value: questionnaire.sections.length + 1,
                },
            ],
        });
        setValue(questionnaire.sections.length);
    };

    console.log("questionnaire---", questionnaire.sections);
    const navigate = useNavigate();
    return (
        <div className="page-wrapper">
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li onClick={() => navigate("/questionnaires")}>
                            <a>Questionnaire</a>
                        </li>
                        <li>Add Questionnaire</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between">
                        <h2 className="heading2">Add Questionnaire</h2>
                    </div>
                    <div className="que-ttl-blk">
                        <div className="form-group">
                            <label for="emailid">
                                Questionnaire Title{" "}
                                <span className="mandatory">*</span>
                            </label>
                            <TextField
                                className={`input-field ${
                                    questionnaire.title === "" &&
                                    globalSectionTitleError?.errMsg &&
                                    "input-error"
                                }`}
                                id="outlined-basic"
                                value={questionnaire.title}
                                placeholder="Enter questionnaire title"
                                inputProps={{
                                    maxLength: 500,
                                }}
                                variant="outlined"
                                onChange={(e) => {
                                    setQuestionnaire({
                                        ...questionnaire,
                                        title: e.target.value,
                                    });
                                }}
                                helperText={
                                    questionnaire.title === "" &&
                                    globalSectionTitleError?.errMsg
                                        ? "Enter the questionnaire title"
                                        : " "
                                }
                            />
                        </div>
                    </div>

                    <div className="section-form-sect">
                        <div className="section-tab-blk flex-between">
                            <div className="section-tab-leftblk">
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: "divider",
                                    }}
                                    className="tabs-sect que-tab-sect"
                                >
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="basic tabs example"
                                    >
                                        {questionnaire.sections.map(
                                            (section, index, id) => (
                                                <Tooltip
                                                    title={section.sectionTitle}
                                                    placement="bottom-start"
                                                >
                                                    <Tab
                                                        className="section-tab-item"
                                                        label={`section - ${
                                                            index + 1
                                                        }`}
                                                        {...a11yProps(index)}
                                                    />
                                                </Tooltip>
                                            )
                                        )}
                                    </Tabs>
                                </Box>
                            </div>
                            <div className="section-tab-rightblk">
                                <div className="form-header-right-txt">
                                    <div className="tertiary-btn-blk mr-20">
                                        <span class="preview-icon">
                                            <VisibilityOutlinedIcon />
                                        </span>
                                        <span className="addmore-txt">
                                            Preview
                                        </span>
                                    </div>
                                    <div className="tertiary-btn-blk">
                                        <span class="addmore-icon">
                                            <i className="fa fa-plus"></i>
                                        </span>
                                        <span
                                            onClick={addSection}
                                            className="addmore-txt"
                                        >
                                            Add Section
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="que-tab-data">
                            {questionnaire.sections.map((section, index) => (
                                <TabPanel value={value} index={index}>
                                    <SectionContent
                                        setQuestionnaire={setQuestionnaire}
                                        questionnaire={questionnaire}
                                        value={section.value}
                                        uuid={section.uuid}
                                        setValue={setValue}
                                        index={index}
                                        section={section}
                                        tabChange={handleChange}
                                        globalSectionTitleError={
                                            globalSectionTitleError
                                        }
                                        setGlobalSectionTitleError={
                                            setGlobalSectionTitleError
                                        }
                                    />
                                </TabPanel>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AddNewQuestionnaire;
