import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Loader2 from "../../../assets/Loader/Loader2.svg"


import PropTypes from "prop-types";
import { Tabs, Tab, Tooltip } from "@mui/material";

import PreviewSection from "./PreviewSection";
import { Link, useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../../api/axios";
import "../../../Pages/PreviewDemo.css";
import {
    ADD_QUESTIONNAIRE,
    DOWNLOAD_QUESTIONNAIRES,
    DOWNLOAD_QUESTIONNAIRES_BY_ID,
} from "../../../api/Url";
import { useDocumentTitle } from "../../../utils/useDocumentTitle";
import { useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useCallbackState from "../../../utils/useCallBackState";
import Toaster from "../../../components/Toaster";
import { TabPanel } from "../../../utils/tabUtils/TabPanel";
import DialogBox from "../../../components/DialogBox";
import axios from "axios";
import { downloadFunction } from "../../../utils/downloadFunction";

const ITEM_HEIGHT = 42;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4,
        },
    },
};
// };
// function TabPanel(props) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`}
//             {...other}
//         >
//             {value === index && <Box>{children}</Box>}
//         </div>
//     );
// }

// TabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
// };

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

function PreviewQuestionnaire(props) {
    const [value, setValue] = useState(0);
    //custom hook to set title of page
    useDocumentTitle("Preview Questionnaire");
    const [isLoading, setIsLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false);
    //Toaster Message setter
    const [toasterDetails, setToasterDetails] = useCallbackState({
        titleMessage: "",
        descriptionMessage: "",
        messageType: "success",
    });
    const questionnaireRef = useRef();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const params = useParams();
    const navigate = useNavigate();
    console.log("params in questionnaire", params["*"].includes("version"));
    console.log("props in questionnaire", props);
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
                setIsLoading(true)
                const response = await privateAxios.get(
                    `${ADD_QUESTIONNAIRE}/${params.id}`,
                    {
                        signal: controller.signal,
                    }
                );
                console.log("response from fetch questionnaire", response);
                isMounted && setQuestionnaire({ ...response.data });
                setIsLoading(false)
            } catch (error) {
                if (error?.code === "ERR_CANCELED") return;
                setIsLoading(false)
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
    const [isActive, setActive] = useState(false);
    const handleToggle = () => {
        setActive(!isActive);
    };

    // download assessment
    // const downloadAssessment = async () => {
    //     try {
    //         const response = await privateAxios.get(
    //             DOWNLOAD_QUESTIONNAIRES_BY_ID + params.id + "/download",
    //             {
    //                 responseType: "blob",
    //             }
    //         );
    //         console.log("resposne from download  questionnaire ", response);
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.setAttribute("download", `Questionnaire - ${new Date()}.xls`);
    //         document.body.appendChild(link);
    //         link.click();
    //         if (response.status == 200) {
    //             setToasterDetails(
    //                 {
    //                     titleMessage: "Success!",
    //                     descriptionMessage: "Download successfull!",

    //                     messageType: "success",
    //                 },
    //                 () => myRef.current()
    //             );
    //         }
    //     } catch (error) {
    //         console.log("Error from download  questionnaire", error);
    //     }
    // };
    const deleteQuestionnaire = async (deletionType) => {
        try {
            console.log("Questionnaire", questionnaire);
            await axios.delete(ADD_QUESTIONNAIRE + `/${questionnaire?.uuid}`, {
                data: {
                    deletionType: deletionType,
                },
            });
            setToasterDetails(
                {
                    titleMessage: "Success",
                    descriptionMessage: `${
                        deletionType === "inactive"
                            ? "Questionnaire inactivated successfully!"
                            : "Questionnaire deleted successfully!"
                    }`,
                    messageType: "success",
                },
                () => questionnaireRef.current()
            );
            return setTimeout(() => navigate("/questionnaires"), 3000);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            // console.log(toasterDetails);
            setToasterDetails(
                {
                    titleMessage: "Error",
                    descriptionMessage:
                        error?.response?.data?.message &&
                        typeof error.response.data.message === "string"
                            ? error.response.data.message
                            : "Something went wrong!",
                    messageType: "error",
                },
                () => questionnaireRef.current()
            );
        } finally {
            setOpenDialog(false);
        }
    };
    const onDialogPrimaryButtonClickHandler = async () => {
        deleteQuestionnaire("delete");
    };
    const onDialogSecondaryButtonClickHandler = () => {
        deleteQuestionnaire("inactive");
    };

    return (
        <div
            className="page-wrapper"
            onClick={() => isActive && setActive(false)}
        >
            <DialogBox
                title={<p>Delete Questionnaire</p>}
                info1={
                    <p>
                        Deleting the questionnaire will also delete the related
                        assessments. we recommend you make the questionnaire
                        inactive.
                    </p>
                }
                info2={
                    <p>Are you sure you want to delete the questionnaire?</p>
                }
                primaryButtonText="Delete Anyway"
                secondaryButtonText="Inactive"
                onPrimaryModalButtonClickHandler={
                    onDialogPrimaryButtonClickHandler
                }
                onSecondaryModalButtonClickHandler={
                    onDialogSecondaryButtonClickHandler
                }
                openModal={openDialog}
                setOpenModal={setOpenDialog}
            />
            <Toaster
                myRef={questionnaireRef}
                titleMessage={toasterDetails.titleMessage}
                descriptionMessage={toasterDetails.descriptionMessage}
                messageType={toasterDetails.messageType}
            />
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
                        {(SUPER_ADMIN === true ||
                            moduleAccesForMember[0]?.questionnaire?.add) &&
                            !params["*"].includes("version") &&
                            !questionnaire?.isDraft &&
                            !questionnaire?.isPublished && (
                                <li>
                                    <Link
                                        to={`/questionnaires/add-questionnaire/${params.id}`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Add Questionnaire
                                    </Link>
                                    {/* <a
                    onClick={() =>
                      navigate(`/questionnaires/add-questionnaire/${params.id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    Add Questionnaire
                  </a> */}
                                </li>
                            )}
                        {(SUPER_ADMIN === true ||
                            moduleAccesForMember[0]?.questionnaire?.add) &&
                            !params["*"].includes("version") &&
                            (questionnaire?.isDraft ||
                                questionnaire?.isPublished) && (
                                <li>
                                    {/* <a
                    onClick={() =>
                      navigate(`/questionnaires/add-questionnaire/${params.id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    Edit Questionnaire
                  </a> */}
                                    <Link
                                        to={`/questionnaires/add-questionnaire/${params.id}`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Edit Questionnaire
                                    </Link>
                                </li>
                            )}
                        {params["*"].includes("version") && (
                            <li>
                                <Link
                                    to={`/questionnaire-version-history/${params.id}`}
                                    style={{ cursor: "pointer" }}
                                >
                                    Questionnaire History
                                </Link>
                            </li>
                        )}
                        {params["*"].includes("version") ? (
                            <li>Preview Questionnaire History</li>
                        ) : (
                            <li>Preview Questionnaire </li>
                        )}
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between">
                        <h2 className="heading2">{questionnaire.title}</h2>
                        <span
                            className="form-header-right-txt"
                            onClick={handleToggle}
                        >
                            <span
                                className={`crud-operation ${
                                    isActive && "crud-operation-active"
                                }`}
                            >
                                <MoreVertIcon />
                            </span>
                            <div
                                className="crud-toggle-wrap que-crud-toggle-wrap"
                                style={{ display: isActive ? "block" : "none" }}
                            >
                                <ul className="crud-toggle-list">
                                    <li
                                        onClick={() =>
                                            downloadFunction(
                                                "Questionnaire",
                                                setToasterDetails,
                                                params.id,
                                                questionnaireRef,
                                                DOWNLOAD_QUESTIONNAIRES_BY_ID
                                            )
                                        }
                                    >
                                        Export to Excel
                                    </li>
                                    {!params["*"].includes("version") &&
                                        !questionnaire?.isDraft && (
                                            <li
                                                onClick={() =>
                                                    navigate(
                                                        `/questionnaire-version-history/${params.id}`
                                                    )
                                                }
                                            >
                                                Version history
                                            </li>
                                        )}
                                    {!params["*"].includes("version") && (
                                        <li
                                            onClick={() =>
                                                navigate(
                                                    `/questionnaires/add-questionnaire/${params.id}`
                                                )
                                            }
                                        >
                                            {(SUPER_ADMIN === true ||
                                                moduleAccesForMember[0]
                                                    ?.questionnaire?.add) &&
                                            !params["*"].includes("version") &&
                                            !questionnaire?.isDraft &&
                                            !questionnaire?.isPublished
                                                ? "Add Questionnaire"
                                                : "Edit Questionnaire"}
                                        </li>
                                    )}
                                    <li onClick={() => setOpenDialog(true)}>
                                        Delete Questionnaire
                                    </li>
                                </ul>
                            </div>
                        </span>
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
                    {
                        isLoading ? <div className="loader-blk">
                        <img src={Loader2} alt="Loading" />
                    </div> : <div className="section-form-sect">
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
                    }
                    
                </div>
            </section>
        </div>
    );
}

export default PreviewQuestionnaire;
