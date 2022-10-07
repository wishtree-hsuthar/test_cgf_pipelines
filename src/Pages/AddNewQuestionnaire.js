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
import { Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";

import CloseIcon from "@mui/icons-material/Close";
import SectionContent from "../Section/SectionContent";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { privateAxios } from "../../api/axios";

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
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
    const [isActive, setActive] = React.useState(false);
    const handleToggle = () => {
        setActive(!isActive);
    };

    const [isActiveField, setActiveField] = React.useState(false);
    const handleToggleField = () => {
        setActiveField(!isActiveField);
    };

    const [isOpen, setIsOpen] = useState(false);
    const [items, setItem] = useState(data);

    const [dropdownitems, dropdownSetItem] = useState(dropdownData);
    const [dropdownisOpen, dropdownsetIsOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const toggleDropdown1 = () => dropdownsetIsOpen(!dropdownisOpen);

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
    const [open, setOpen] = React.useState(false);

    const handleItemClick = (id) => {
        setOpen(true);
        selectedItem === id ? setSelectedItem(null) : setSelectedItem(id);
    };

    const handleSelectClick = (id) => {
        selectedItem === id ? setSelectedItem(null) : setSelectedItem(id);
    };

    const handleOpen = (index) => {
        console.log("clicked");
        setOpen(true);
        //setData(data[index]);
    };
    const handleClose = () => {
        setOpen(false);
    };
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
                sectionTitle: "Primary",
                description: "Primary description",
                layout: "Form", // form | table
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
            {
                id: "",
                isRequired: true,
                uuid: uuidv4(),
                srNo: "", // TBD
                sectionTitle: "Secondary",
                description: "secondary Discussion",
                layout: "Table", // form | table
                isActive: true,
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
        const fetch = async () => {
            try {
                const response = await privateAxios.get(
                    `http://localhost:3000/api/questionnaires/${id}`
                );
                console.log("response from fetch questionnaire", response);
                setQuestionnaire({ ...response.data });
            } catch (error) {
                console.log("error from fetch questionnaire", error);
            }
        };
        fetch();
    }, []);

    const CustomModal = () => {
        return (
            //     <Modal
            //     aria-labelledby="transition-modal-title"
            //     aria-describedby="transition-modal-description"
            //     open={open}
            //     onClose={handleClose}
            //     closeAfterTransition
            //     BackdropComponent={Backdrop}
            //     BackdropProps={{
            //       timeout: 500,
            //     }}
            //     className='popup-blk'
            //   >
            //     <Fade in={open}>
            //       <Box sx={style} className='popup-box'>
            //         <div id="transition-modal-title" className='popup-ttl-blk'>
            //               <h2 className='popup-ttl heading2'>Create Custom List Dropdown</h2>
            //               {/* <span class="popup-close-icon" onClick={handleClose}><CloseIcon/></span> */}
            //         </div>
            //         <div id="transition-modal-description" className='popup-body'>
            //           <div className='popup-content-blk'>
            //               <div className='custom-list-sect'>
            //                 {/* <div className='subheading mb-20'>Create custom list</div> */}
            //                 <div className="form-group">
            //                     <TextField className='input-field' id="outlined-basic" placeholder='Dropdown value1' variant="outlined" />
            //                 </div>
            //                 <div className="form-group">
            //                     <TextField className='input-field' id="outlined-basic" placeholder='Dropdown value2' variant="outlined" />
            //                 </div>
            //                 <div className="form-group">
            //                     <TextField className='input-field' id="outlined-basic" placeholder='Dropdown value3' variant="outlined" />
            //                 </div>
            //                 <div className='add-dropdown-btnblk mb-30'>
            //                     <span class="addmore-icon"><i className='fa fa-plus'></i></span> Add Dropdown
            //                 </div>
            //               </div>
            //               <div className="form-btn flex-center text-center">
            //                   <button type="submit" className="secondary-button mr-10" onClick={handleClose}>Cancel</button>
            //                   <button type="submit" className="primary-button">Save</button>
            //               </div>
            //           </div>
            //         </div>
            //       </Box>
            //     </Fade>
            //   </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                className="popup-blk"
            >
                <Fade in={open}>
                    <Box sx={style} className="popup-box">
                        <div
                            id="transition-modal-title"
                            className="popup-ttl-blk"
                        >
                            <h2 className="popup-ttl heading2">
                                Select Master List Dropdown
                            </h2>
                            {/* <span class="popup-close-icon" onClick={handleClose}><CloseIcon/></span> */}
                        </div>
                        <div
                            id="transition-modal-description"
                            className="popup-body"
                        >
                            <div className="popup-content-blk">
                                <div className="master-list-sect">
                                    <div className="form-group">
                                        <label>Select Value (To display)</label>
                                        <div className="select-field">
                                            <Select
                                                IconComponent={(props) => (
                                                    <KeyboardArrowDownRoundedIcon
                                                        {...props}
                                                    />
                                                )}
                                                value="Select value"
                                                MenuProps={MenuProps}
                                            >
                                                <MenuItem value="Select value">
                                                    Select value
                                                </MenuItem>
                                                <MenuItem
                                                    value="Value1"
                                                    selected
                                                >
                                                    Value1
                                                </MenuItem>
                                                <MenuItem
                                                    value="Value2"
                                                    selected
                                                >
                                                    Value2
                                                </MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Select Key (To store)</label>
                                        <div className="select-field">
                                            <Select
                                                IconComponent={(props) => (
                                                    <KeyboardArrowDownRoundedIcon
                                                        {...props}
                                                    />
                                                )}
                                                value="Select key"
                                                MenuProps={MenuProps}
                                            >
                                                <MenuItem value="Select key">
                                                    Select key
                                                </MenuItem>
                                                <MenuItem value="Key1" selected>
                                                    Key1
                                                </MenuItem>
                                                <MenuItem value="Key2" selected>
                                                    Key2
                                                </MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-btn flex-center text-center">
                                    <button
                                        type="submit"
                                        className="secondary-button mr-10"
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="primary-button"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        );
    };

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
                    layout: "", // form | table
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

    return (
        <div className="page-wrapper">
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <a href="/questionnaires">Questionnaire</a>
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
                                className="input-field"
                                id="outlined-basic"
                                value={questionnaire.title}
                                placeholder="Enter questionnaire title"
                                variant="outlined"
                                onChange={(e) => {
                                    setQuestionnaire({
                                        ...questionnaire,
                                        title: e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="form-header member-form-header flex-between">
                        <div className="form-header-left-blk flex-start">
                            <h2 className="heading2">CGF Admins</h2>
                        </div>
                        <div className="form-header-right-txt">
                            <div className="form-btn">
                                <button
                                    onClick={addSection}
                                    className="primary-button add-button"
                                >
                                    Add Section
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="member-tab-left">
                        <div className="member-tab-wrapper">
                            <Box
                                sx={{
                                    borderBottom: 1,
                                    borderColor: "divider",
                                }}
                                className="tabs-sect"
                            >
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    aria-label="basic tabs example"
                                >
                                    {questionnaire.sections.map(
                                        (section, index, id) => (
                                            <Tab
                                                label={`section - ${index + 1}`}
                                                {...a11yProps(index)}
                                            />
                                        )
                                    )}
                                    {/* <Tab label="Onboarded" {...a11yProps(0)} />
                                    <Tab label="Pending" {...a11yProps(1)} /> */}
                                </Tabs>
                            </Box>
                        </div>
                    </div>
                    <div className="section-form-sect">
                        <div className="sect-form-card-wrapper">
                            <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
                                {questionnaire.sections.map(
                                    (section, index) => (
                                        <TabPanel value={value} index={index}>
                                            <SectionContent
                                                setQuestionnaire={
                                                    setQuestionnaire
                                                }
                                                questionnaire={questionnaire}
                                                value={section.value}
                                                uuid={section.uuid}
                                                setValue={setValue}
                                                index={index}
                                                section={section}
                                                tabChange={handleChange}
                                            />
                                        </TabPanel>
                                    )
                                )}
                            </div>
                            {/* <div className="drag-drop-box">
                                <span className="drag-ind-icon">
                                    <DragIndicatorIcon />
                                </span>
                            </div> */}
                            {/* <div className='sect-form-card-info active'>
                                <div className='sect-form-innercard-blk'>
                                <div className='sect-ttl-blk flex-between'>
                                    <div className='sect-leftblk'>
                                        <h2 className='subheading'>Section 1</h2>
                                    </div>
                                    <div className='sect-rightblk'>
                                        <div className='sect-ttl-right-iconblk'>
                                            <span className='sect-icon-blk add-sect-iconblk mr-40'>
                                                <img src={process.env.PUBLIC_URL + '/images/add-section-icon.svg'} alt="" />
                                            </span>
                                            <span className='sect-icon-blk delete-iconblk'>
                                                <img src={process.env.PUBLIC_URL + '/images/delete-icon.svg'} alt="" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="sect-form-card-blk">
                                    <div className="sect-form-card-innerblk flex-between">
                                        <div className="sect-card-form-leftfield">
                                            <div className="form-group">
                                                <label for="emailid">Section Title</label>
                                                <TextField className='input-field' id="outlined-basic" placeholder='Section title name' variant="outlined" />
                                            </div>
                                        </div>
                                        <div className="sect-card-form-rightfield flex-between">
                                            <div className="form-group">
                                                <label for="layout">Layout</label>
                                                <div className="select-field">
                                                    <Select 
                                                    IconComponent={(props) => <KeyboardArrowDownRoundedIcon {...props}/>}
                                                    value="Form" 
                                                    MenuProps={MenuProps}>
                                                        <MenuItem value="Form">Form</MenuItem>
                                                        <MenuItem value="Textbox" selected>Textbox</MenuItem>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label for="status">Status</label>
                                                <div className="select-field">
                                                    <Select 
                                                    IconComponent={(props) => <KeyboardArrowDownRoundedIcon {...props}/>}
                                                    value="Active" 
                                                    MenuProps={MenuProps}>
                                                        <MenuItem value="Active" selected>Active</MenuItem>
                                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sect-form-card-innerblk">
                                        <div className="sect-card-form-leftfield full-width">
                                            <div className="form-group mb-0">
                                                <label for="emailid">Description</label>
                                                <TextField className='input-field' id="outlined-basic" placeholder='Enter description' variant="outlined" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div> */}
                            <div className="que-form-card-wrapper">
                                <div className="drag-drop-box">
                                    {/* <span className='drag-ind-icon'><DragIndicatorIcon/></span> */}
                                </div>
                                <div className="que-card-blk">
                                    <div className="que-form-blk">
                                        <div className="que-card-ttl-blk">
                                            <h2 className="subheading">
                                                Question 1
                                            </h2>
                                        </div>
                                        <div className="que-card-innerblk flex-between">
                                            <div className="que-card-form-leftfield">
                                                <div className="form-group">
                                                    <label for="emailid">
                                                        Question Title
                                                    </label>
                                                    <TextField
                                                        className="input-field"
                                                        id="outlined-basic"
                                                        placeholder="Enter question title"
                                                        variant="outlined"
                                                    />
                                                </div>
                                            </div>
                                            <div className="que-card-form-rightfield flex-between">
                                                <div className="form-group">
                                                    <label for="emailid">
                                                        Input Field
                                                    </label>
                                                    <div className="select-field">
                                                        <Select
                                                            IconComponent={(
                                                                props
                                                            ) => (
                                                                <KeyboardArrowDownRoundedIcon
                                                                    {...props}
                                                                />
                                                            )}
                                                            value="Single textbox"
                                                            className="select-dropdown"
                                                            MenuProps={
                                                                MenuProps
                                                            }
                                                        >
                                                            <MenuItem value="Select input type">
                                                                Select input
                                                                type
                                                            </MenuItem>
                                                            <MenuItem
                                                                value="Single textbox"
                                                                selected
                                                            >
                                                                Single textbox
                                                            </MenuItem>
                                                            <MenuItem value="Multi textbox">
                                                                Multi textbox
                                                            </MenuItem>
                                                            <MenuItem value="Dropdown">
                                                                Dropdown
                                                            </MenuItem>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="validator-sect">
                                                    <div
                                                        className="validator-iconblk"
                                                        onClick={handleToggle}
                                                    >
                                                        <span className="validator-icon">
                                                            <MoreVertIcon />
                                                        </span>
                                                        <div
                                                            className="response-validator-wrap"
                                                            style={{
                                                                display:
                                                                    isActive
                                                                        ? "block"
                                                                        : "none",
                                                            }}
                                                        >
                                                            <div className="response-validator-listblk">
                                                                <span className="response-validator-txt">
                                                                    Response
                                                                    Validator
                                                                </span>
                                                                <ul className="response-validator-list">
                                                                    <li className="active">
                                                                        Character
                                                                    </li>
                                                                    <li>
                                                                        Numeric
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="que-card-innerblk">
                                            <div className="que-card-form-leftfield">
                                                <div className="form-group">
                                                    <TextField className='input-field' id="outlined-basic" placeholder='Single textbox' variant="outlined" />
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="que-card-icon-sect">
                                            <div className="que-card-icon-blk">
                                                <div className="que-card-icon add-que-iconblk mr-40">
                                                    <img
                                                        src={
                                                            process.env
                                                                .PUBLIC_URL +
                                                            "/images/add-question-icon.svg"
                                                        }
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="que-card-icon duplicate-que-iconblk mr-40">
                                                    <img
                                                        src={
                                                            process.env
                                                                .PUBLIC_URL +
                                                            "/images/duplicate-question-icon.svg"
                                                        }
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="que-card-icon delete-iconblk mr-40">
                                                    <img
                                                        src={
                                                            process.env
                                                                .PUBLIC_URL +
                                                            "/images/delete-icon.svg"
                                                        }
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="required-toggle-btnblk">
                                                    <FormGroup>
                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                            alignItems="center"
                                                        >
                                                            <Typography>
                                                                Required
                                                            </Typography>
                                                            <AntSwitch
                                                                defaultChecked
                                                                inputProps={{
                                                                    "aria-label":
                                                                        "ant design",
                                                                }}
                                                            />
                                                            {/* <Typography>On</Typography> */}
                                                        </Stack>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="que-table-sect">
                                <div className="drag-drop-box">
                                    {/* <span className='drag-ind-icon'><DragIndicatorIcon/></span> */}
                                </div>
                                <div className="que-table-wrap active">
                                    <div className="que-table-innerwrap flex-between no-wrap">
                                        <Paper
                                            sx={{
                                                width: "96%",
                                                overflow: "hidden",
                                            }}
                                            className="que-table-infoblk"
                                        >
                                            <TableContainer
                                                sx={{ maxHeight: 440 }}
                                            >
                                                <Table
                                                    stickyHeader
                                                    aria-label="sticky table"
                                                    className="que-table"
                                                >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell
                                                                width={80}
                                                            ></TableCell>
                                                            <TableCell>
                                                                <div className="que-table-column-info">
                                                                    <div className="que-column-ttlblk flex-between">
                                                                        <div
                                                                            className="que-table-col-ttl"
                                                                            contenteditable="true"
                                                                        >
                                                                            Give
                                                                            column
                                                                            title
                                                                        </div>
                                                                        <div className="que-table-col-right flex-between">
                                                                            <span class="minus-iconblk">
                                                                                <i className="fa fa-minus"></i>
                                                                            </span>
                                                                            <div className="que-table-validator-iconblk">
                                                                                <div
                                                                                    className="validator-iconblk"
                                                                                    onClick={
                                                                                        handleToggleField
                                                                                    }
                                                                                >
                                                                                    <span className="validator-icon">
                                                                                        <MoreVertIcon />
                                                                                    </span>
                                                                                    {/* <div className='response-validator-wrap' style={{display: isActive ? 'block' : 'none'}}>
                                                                                        <div className='response-validator-listblk'>
                                                                                            <span className='response-validator-txt'>Response Validator</span>
                                                                                            <ul className='response-validator-list'>
                                                                                                <li className='active'>Character</li>
                                                                                                <li>Numeric</li>
                                                                                            </ul>
                                                                                        </div>
                                                                                    </div> */}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="que-column-fieldblk"
                                                                        style={{
                                                                            display:
                                                                                isActiveField
                                                                                    ? "block"
                                                                                    : "none",
                                                                        }}
                                                                    >
                                                                        <div className="form-group mb-0">
                                                                            <div className="que-dropdown">
                                                                                <div
                                                                                    className="dropdown-header"
                                                                                    onClick={
                                                                                        toggleDropdown1
                                                                                    }
                                                                                >
                                                                                    {selectedItem
                                                                                        ? dropdownitems.find(
                                                                                              (
                                                                                                  item
                                                                                              ) =>
                                                                                                  item.id ==
                                                                                                  selectedItem
                                                                                          )
                                                                                              .label
                                                                                        : "Select input type"}
                                                                                    <i
                                                                                        className={`fa fa-chevron-down icon ${
                                                                                            dropdownisOpen &&
                                                                                            "open"
                                                                                        }`}
                                                                                    ></i>
                                                                                </div>
                                                                                <div
                                                                                    className={`dropdown-body ${
                                                                                        dropdownisOpen &&
                                                                                        "open"
                                                                                    }`}
                                                                                >
                                                                                    <div className="predefined-txt">
                                                                                        Predefined
                                                                                    </div>
                                                                                    <div className="master-listblk">
                                                                                        <div className="master-list-label">
                                                                                            Custom
                                                                                        </div>
                                                                                        {dropdownitems.map(
                                                                                            (
                                                                                                item
                                                                                            ) => (
                                                                                                <div
                                                                                                    className="dropdown-item"
                                                                                                    onClick={(
                                                                                                        e
                                                                                                    ) =>
                                                                                                        handleSelectClick(
                                                                                                            e
                                                                                                                .target
                                                                                                                .id
                                                                                                        )
                                                                                                    }
                                                                                                    id={
                                                                                                        item.id
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        item.label
                                                                                                    }
                                                                                                </div>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="que-table-column-info">
                                                                    <div className="que-column-ttlblk flex-between">
                                                                        <div
                                                                            className="que-table-col-ttl"
                                                                            contenteditable="true"
                                                                        >
                                                                            Give
                                                                            column
                                                                            title
                                                                        </div>
                                                                        <div className="que-table-col-right flex-between">
                                                                            <span class="minus-iconblk">
                                                                                <i className="fa fa-minus"></i>
                                                                            </span>
                                                                            <div className="que-table-validator-iconblk">
                                                                                <div
                                                                                    className="validator-iconblk"
                                                                                    onClick={
                                                                                        handleToggleField
                                                                                    }
                                                                                >
                                                                                    <span className="validator-icon">
                                                                                        <MoreVertIcon />
                                                                                    </span>
                                                                                    {/* <div className='response-validator-wrap' style={{display: isActive ? 'block' : 'none'}}>
                                                                                        <div className='response-validator-listblk'>
                                                                                            <span className='response-validator-txt'>Response Validator</span>
                                                                                            <ul className='response-validator-list'>
                                                                                                <li className='active'>Character</li>
                                                                                                <li>Numeric</li>
                                                                                            </ul>
                                                                                        </div>
                                                                                    </div> */}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="que-column-fieldblk"
                                                                        style={{
                                                                            display:
                                                                                isActiveField
                                                                                    ? "block"
                                                                                    : "none",
                                                                        }}
                                                                    >
                                                                        <div className="form-group mb-0">
                                                                            <div className="que-dropdown">
                                                                                <div
                                                                                    className="dropdown-header"
                                                                                    onClick={
                                                                                        toggleDropdown1
                                                                                    }
                                                                                >
                                                                                    {selectedItem
                                                                                        ? dropdownitems.find(
                                                                                              (
                                                                                                  item
                                                                                              ) =>
                                                                                                  item.id ==
                                                                                                  selectedItem
                                                                                          )
                                                                                              .label
                                                                                        : "Select input type"}
                                                                                    <i
                                                                                        className={`fa fa-chevron-down icon ${
                                                                                            dropdownisOpen &&
                                                                                            "open"
                                                                                        }`}
                                                                                    ></i>
                                                                                </div>
                                                                                <div
                                                                                    className={`dropdown-body ${
                                                                                        dropdownisOpen &&
                                                                                        "open"
                                                                                    }`}
                                                                                >
                                                                                    <div className="predefined-txt">
                                                                                        Predefined
                                                                                    </div>
                                                                                    <div className="master-listblk">
                                                                                        <div className="master-list-label">
                                                                                            Custom
                                                                                        </div>
                                                                                        {dropdownitems.map(
                                                                                            (
                                                                                                item
                                                                                            ) => (
                                                                                                <div
                                                                                                    className="dropdown-item"
                                                                                                    onClick={(
                                                                                                        e
                                                                                                    ) =>
                                                                                                        handleSelectClick(
                                                                                                            e
                                                                                                                .target
                                                                                                                .id
                                                                                                        )
                                                                                                    }
                                                                                                    id={
                                                                                                        item.id
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        item.label
                                                                                                    }
                                                                                                </div>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="que-table-column-info">
                                                                    <div className="que-column-ttlblk flex-between">
                                                                        <div
                                                                            className="que-table-col-ttl"
                                                                            contenteditable="true"
                                                                        >
                                                                            Give
                                                                            column
                                                                            title
                                                                        </div>
                                                                        <div className="que-table-col-right flex-between">
                                                                            <span class="minus-iconblk">
                                                                                <i className="fa fa-minus"></i>
                                                                            </span>
                                                                            <div className="que-table-validator-iconblk">
                                                                                <div
                                                                                    className="validator-iconblk"
                                                                                    onClick={
                                                                                        handleToggleField
                                                                                    }
                                                                                >
                                                                                    <span className="validator-icon">
                                                                                        <MoreVertIcon />
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="que-column-fieldblk"
                                                                        style={{
                                                                            display:
                                                                                isActiveField
                                                                                    ? "block"
                                                                                    : "none",
                                                                        }}
                                                                    >
                                                                        <div className="form-group mb-0">
                                                                            <div className="que-dropdown">
                                                                                <div
                                                                                    className="dropdown-header"
                                                                                    onClick={
                                                                                        toggleDropdown1
                                                                                    }
                                                                                >
                                                                                    {selectedItem
                                                                                        ? dropdownitems.find(
                                                                                              (
                                                                                                  item
                                                                                              ) =>
                                                                                                  item.id ==
                                                                                                  selectedItem
                                                                                          )
                                                                                              .label
                                                                                        : "Select input type"}
                                                                                    <i
                                                                                        className={`fa fa-chevron-down icon ${
                                                                                            dropdownisOpen &&
                                                                                            "open"
                                                                                        }`}
                                                                                    ></i>
                                                                                </div>
                                                                                <div
                                                                                    className={`dropdown-body ${
                                                                                        dropdownisOpen &&
                                                                                        "open"
                                                                                    }`}
                                                                                >
                                                                                    <div className="predefined-txt">
                                                                                        Predefined
                                                                                    </div>
                                                                                    <div className="master-listblk">
                                                                                        <div className="master-list-label">
                                                                                            Custom
                                                                                        </div>
                                                                                        {dropdownitems.map(
                                                                                            (
                                                                                                item
                                                                                            ) => (
                                                                                                <div
                                                                                                    className="dropdown-item"
                                                                                                    onClick={(
                                                                                                        e
                                                                                                    ) =>
                                                                                                        handleSelectClick(
                                                                                                            e
                                                                                                                .target
                                                                                                                .id
                                                                                                        )
                                                                                                    }
                                                                                                    id={
                                                                                                        item.id
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        item.label
                                                                                                    }
                                                                                                </div>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>
                                                                <div className="que-column-count flex-between">
                                                                    <span className="que-column-count-txt">
                                                                        1.
                                                                    </span>
                                                                    <span class="minus-iconblk">
                                                                        <i className="fa fa-minus"></i>
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="que-dropdown">
                                                                    <div
                                                                        className="dropdown-header"
                                                                        onClick={
                                                                            toggleDropdown
                                                                        }
                                                                    >
                                                                        {selectedItem
                                                                            ? items.find(
                                                                                  (
                                                                                      item
                                                                                  ) =>
                                                                                      item.id ==
                                                                                      selectedItem
                                                                              )
                                                                                  .label
                                                                            : "Select dropdown"}
                                                                        <i
                                                                            className={`fa fa-chevron-down icon ${
                                                                                isOpen &&
                                                                                "open"
                                                                            }`}
                                                                        ></i>
                                                                    </div>
                                                                    <div
                                                                        className={`dropdown-body ${
                                                                            isOpen &&
                                                                            "open"
                                                                        }`}
                                                                    >
                                                                        <div
                                                                            className="create-custom-list-txt"
                                                                            onClick={
                                                                                handleOpen
                                                                            }
                                                                        >
                                                                            Create
                                                                            custom
                                                                            list
                                                                        </div>
                                                                        <div className="master-listblk">
                                                                            <div className="master-list-label">
                                                                                Master
                                                                                list
                                                                            </div>
                                                                            {items.map(
                                                                                (
                                                                                    item
                                                                                ) => (
                                                                                    <div
                                                                                        className="dropdown-item"
                                                                                        onClick={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleItemClick(
                                                                                                e
                                                                                                    .target
                                                                                                    .id
                                                                                            )
                                                                                        }
                                                                                        id={
                                                                                            item.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            item.label
                                                                                        }
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell></TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell></TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell></TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Paper>
                                        <div className="add-column-btnblk">
                                            <span class="addmore-icon">
                                                <i className="fa fa-plus"></i>
                                            </span>{" "}
                                            Add Column
                                        </div>
                                    </div>
                                    <div className="add-row-btnblk">
                                        <span class="addmore-icon">
                                            <i className="fa fa-plus"></i>
                                        </span>{" "}
                                        Add Row
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <CustomModal />
                </div>
            </section>
        </div>
    );
}

export default AddNewQuestionnaire;
