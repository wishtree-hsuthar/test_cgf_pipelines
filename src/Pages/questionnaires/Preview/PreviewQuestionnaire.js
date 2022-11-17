import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import PropTypes from "prop-types";
import { Tabs, Tab, Tooltip } from "@mui/material";

import PreviewSection from "./PreviewSection";
import { Link, useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../../api/axios";
import "../../../Pages/PreviewDemo.css";
import { ADD_QUESTIONNAIRE } from "../../../api/Url";
import { useDocumentTitle } from "../../../utils/useDocumentTitle";
import { useSelector } from "react-redux";

const ITEM_HEIGHT = 22;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5,
        },
    },
};
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

function PreviewQuestionnaire() {
    const [value, setValue] = useState(0);
    //custom hook to set title of page
    useDocumentTitle("Preview Questionnaire");
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const params = useParams();
    const navigate = useNavigate();
    const [questionnaire, setQuestionnaire] = useState({});

    const privilege = useSelector((state) => state?.user?.privilege);
    const userAuth = useSelector((state) => state?.user?.userObj);
    const SUPER_ADMIN = privilege?.name === "Super Admin" ? true : false;
    let privilegeArray =
        userAuth?.roleId?.name === "Super Admin"
            ? []
            : Object.values(privilege?.privileges);
    let moduleAccesForMember = privilegeArray
        .filter((data) => data?.moduleId?.name === "Questionnaire")
        .map((data) => ({
            questionnaire: {
                list: data?.list,
                view: data?.view,
                edit: data?.edit,
                delete: data?.delete,
                add: data?.add,
            },
        }));
    useEffect(() => {
        let isMounted = true;
        let controller = new AbortController();
        const fetch = async () => {
            try {
                const response = await privateAxios.get(
                    `${ADD_QUESTIONNAIRE}/${params.id}`,
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
    const [datevalue, setDateValue] = React.useState(null);

    return (
        <div className="page-wrapper">
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <Link
                                // onClick={() => navigate(`/questionnaires`)}
                                to="/questionnaires"
                                style={{ cursor: "pointer" }}
                            >
                                Questionnaire
                            </Link>
                        </li>
                        {(SUPER_ADMIN == true ||
                            moduleAccesForMember[0]?.questionnaire?.add) && (
                            <li>
                                <a
                                    onClick={() =>
                                        navigate(
                                            `/questionnaires/add-questionnaire/${params.id}`
                                        )
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    Add Questionnaire
                                </a>
                            </li>
                        )}
                        <li>Preview Questionnaire</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between">
                        <h2 className="heading2">{questionnaire.title}</h2>
                    </div>
                    {/* <div className="que-ttl-blk">
                        <div className="form-group mb-0">
                            <label for="">
                                Questionnaire Title{" "}
                                <span className="mandatory">*</span>
                            </label>
                            <TextField
                                className="input-field"
                                id="outlined-basic"
                                value={questionnaire.title}
                                placeholder="Enter questionnaire title"
                                variant="outlined"
                            />
                        </div>
                    </div> */}
                    <div className="section-form-sect">
                        <div className="section-tab-blk flex-between preview-tab-blk">
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
                                        {questionnaire?.sections?.map(
                                            (section, index, id) => (
                                                <Tooltip
                                                    key={section?.uuid ?? id}
                                                    title={section.sectionTitle}
                                                    placement="bottom-start"
                                                >
                                                    <Tab
                                                        className="section-tab-item"
                                                        label={`section ${
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
                        </div>
                        <div className="preview-tab-data">
                            {questionnaire?.sections?.map((section, index) => (
                                <TabPanel
                                    key={section?.uuid ?? index}
                                    value={value}
                                    index={index}
                                >
                                    <PreviewSection
                                        questionnaire={questionnaire}
                                        section={section}
                                        sectionIndex={index}
                                    />
                                    {/* <div className="preview-card-wrapper">
                                        <div className="preview-que-wrap">
                                            <div className="preview-que-blk">
                                                <div className="preview-sect-txt">
                                                    Question 1 title will come
                                                    here
                                                </div>
                                                <div className="form-group">
                                                    <TextField
                                                        className="input-field"
                                                        id="outlined-basic"
                                                        placeholder="Enter question title"
                                                        variant="outlined"
                                                    />
                                                </div>
                                            </div>
                                            <div className="preview-que-blk">
                                                <div className="preview-sect-txt">
                                                    Question 2 title will come
                                                    here
                                                </div>
                                                <div className="form-group">
                                                    <div className="select-field">
                                                        <Select
                                                            IconComponent={(
                                                                props
                                                            ) => (
                                                                <KeyboardArrowDownRoundedIcon
                                                                    {...props}
                                                                />
                                                            )}
                                                            value="Select status"
                                                            MenuProps={
                                                                MenuProps
                                                            }
                                                        >
                                                            <MenuItem value="Select status">
                                                                Select status
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
                                            </div>
                                            <div className="preview-que-blk">
                                                <div className="preview-sect-txt">
                                                    Question 3 title will come
                                                    here
                                                </div>
                                                <div className="form-group">
                                                    <LocalizationProvider
                                                        dateAdapter={
                                                            AdapterDayjs
                                                        }
                                                    >
                                                        <DatePicker
                                                            className="datepicker-blk"
                                                            components={{
                                                                OpenPickerIcon:
                                                                    CalendarMonthOutlinedIcon,
                                                            }}
                                                            datevalue={
                                                                datevalue
                                                            }
                                                            onChange={(
                                                                newValue
                                                            ) => {
                                                                setDateValue(
                                                                    newValue
                                                                );
                                                            }}
                                                            renderInput={(
                                                                params
                                                            ) => (
                                                                <TextField
                                                                    {...params}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                            </div>
                                            <div className="preview-que-blk">
                                                <div className="preview-sect-txt">
                                                    Question 4 title will come
                                                    here
                                                </div>
                                                <div className="form-group">
                                                    <TextField
                                                        multiline
                                                        className="input-textarea"
                                                        id="outlined-basic"
                                                        placeholder="Enter text here.."
                                                        variant="outlined"
                                                    />
                                                </div>
                                            </div>
                                            <div className="preview-que-blk">
                                                <div className="preview-sect-txt preview-incl-padding-space">
                                                    Question 5 title will come
                                                    here
                                                </div>
                                                <div className="form-group">
                                                    <div className="radio-btn-field">
                                                        <RadioGroup
                                                            aria-labelledby="demo-radio-buttons-group-label"
                                                            defaultValue="Active"
                                                            name="radio-buttons-group"
                                                            className="radio-btn radio-btn-vertical"
                                                        >
                                                            <FormControlLabel
                                                                value="Option A"
                                                                control={
                                                                    <Radio />
                                                                }
                                                                label="Option A"
                                                            />
                                                            <FormControlLabel
                                                                value="Option B"
                                                                control={
                                                                    <Radio />
                                                                }
                                                                label="Option B"
                                                            />
                                                        </RadioGroup>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="preview-que-blk">
                                                <div className="preview-sect-txt preview-incl-padding-space">
                                                    Question 6 title will come
                                                    here
                                                </div>
                                                <div className="form-group mb-0">
                                                    <div className="checkbox-with-labelblk">
                                                        <FormControlLabel
                                                            className="checkbox-with-label"
                                                            control={
                                                                <Checkbox
                                                                    defaultChecked
                                                                />
                                                            }
                                                            label="Label"
                                                        />
                                                        <FormControlLabel
                                                            className="checkbox-with-label"
                                                            control={
                                                                <Checkbox />
                                                            }
                                                            label="Disabled"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-btn flex-between add-members-btn">
                                            <button
                                                type="reset"
                                                className="secondary-button mr-10"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="primary-button add-button"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div> */}
                                </TabPanel>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PreviewQuestionnaire;
