import {
    FormControl,
    FormGroup,
    FormHelperText,
    MenuItem,
    Select,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import TableRender from "./TableRender.js";
import React, { useEffect, useState } from "react";
import DropdownOptionModal from "./DropdownOptionModal.js";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { styled } from "@mui/material/styles";
import { Stack } from "@mui/system";
import { event } from "jquery";
import AntSwitch from "../../../utils/AntSwitch.js";
import { Logger } from "../../../Logger/Logger.js";
const ITEM_HEIGHT = 42;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4,
        },
    },
};

const inputTypeOptions = [
    {
        _id: "attachments",
        name: "Attachments",
    },
    {
        _id: "date",
        name: "Date",
    },
    {
        _id: "dropdown",
        name: "Drop down",
    },

    {
        _id: "prefilled",
        name: "Prefilled",
    },
    {
        _id: "textbox",
        name: "Text box",
    },
];
const validationOptions = [
    {
        _id: "alphabets",
        name: "Alphabets",
    },
    {
        _id: "alphanumeric",
        name: "Alphanumeric",
    },
    {
        _id: "numeric",
        name: "Numeric",
    },
];

const TableQuestions = ({
    sectionIndex,
    questionnaire,
    setQuestionnaire,
    tableErr,
    setTableErr,
}) => {
    const [openModal, setOpenModal] = useState(false);
    const [modalIndex, setModalIndex] = useState(-1);

    const onColumnChangeHandler = (event, columnId) => {
        const { name, value } = event.target;
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].columnValues[columnId][name] =
            value;
        setQuestionnaire(tempQuestionnaire);
    };
    const onColumnTogleChangeHandler = (event, columnId) => {
        let tempQuestionnaire = { ...questionnaire };
        Logger.debug("temp Questionnaire before :- ", tempQuestionnaire);
        tempQuestionnaire.sections[sectionIndex].columnValues[
            columnId
        ].isRequired = event.target.checked;
        Logger.debug("temp Questionnaire after:- ", tempQuestionnaire);
        setQuestionnaire(tempQuestionnaire);
    };
    const onColumnBlurHandler = (event, columnId) => {
        const { name, value } = event.target;
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].columnValues[columnId][name] =
            value?.trim();
        setQuestionnaire(tempQuestionnaire);
    };
    const onInputTypeChangeHandler = (event, columnId) => {
        const { name, value } = event.target;
        let tempQuestionnaire = { ...questionnaire };

        tempQuestionnaire.sections[sectionIndex].columnValues[columnId][name] =
            value;
        tempQuestionnaire.sections[sectionIndex].columnValues[
            columnId
        ].validation = "";
        tempQuestionnaire.sections[sectionIndex].columnValues[
            columnId
        ].options = [];

        if (value === "dropdown") {
            tempQuestionnaire.sections[sectionIndex].columnValues[
                columnId
            ].options = ["", ""];
            setModalIndex(columnId);
            setOpenModal(true);
        }
        setQuestionnaire(tempQuestionnaire);
    };

    //method to handle Add column icon click handler
    const onAddColumnClickHandler = () => {
        let tempQuestionnaire = { ...questionnaire };
        const initialId = uuidv4();
        tempQuestionnaire?.sections[sectionIndex]?.columnValues?.push({
            uuid: initialId,
            title: "",
            columnType: "textbox",
            isRequired: true,
            options: [],
            validation: "",
        });
        tempQuestionnaire.sections[sectionIndex].rowValues?.forEach(
            (row, rowId) => {
                row?.cells?.push({
                    columnId: initialId,
                    value: "",
                });
            }
        );
        setQuestionnaire(tempQuestionnaire);
    };

    //   method to handle remove column click handler
    const onDeleteIconClickHandler = (event, columnId) => {
        let tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire?.sections[sectionIndex].rowValues?.forEach(
            (row, rowId) =>
                tempQuestionnaire?.sections[sectionIndex]?.rowValues[
                    rowId
                ]?.cells?.splice(columnId, 1)
        );
        tempQuestionnaire?.sections[sectionIndex]?.columnValues?.splice(
            columnId,
            1
        );
        setQuestionnaire(tempQuestionnaire);
    };

    const onEditOptionClickHandler = (columnIdx) => {
        // Logger.debug("columnIdx",columnIdx)
        setOpenModal(true);
        setModalIndex(columnIdx);
    };
    useEffect(() => {}, [questionnaire]);

    const Placeholder = ({ children }) => {
        return <div className="select-placeholder">{children}</div>;
    };

    const checkIfSameColumnTitlePresent = (title) => {
        let filterSameNameColumnTitle = questionnaire.sections[
            sectionIndex
        ].columnValues.filter((column) => column.title === title);
        if (filterSameNameColumnTitle.length > 1) {
            Logger.debug("Same title appeared twice.");
            return true;
        } else {
            return false;
        }
    };

    return (
        <div className="que-column-layout-sect">
            {questionnaire &&
                questionnaire?.sections[sectionIndex]?.columnValues?.map(
                    (column, columnId) => (
                        <div
                            key={column?.uuid}
                            className="que-column-layout-wrap"
                        >
                            <div className="que-column-layout-blk">
                                <div className="que-card-innerblk">
                                    <div className="que-col-form-leftfield flex-between">
                                        <div className="form-group">
                                            <label htmlFor="emailid">
                                                Column {columnId + 1} Title{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <TextField
                                                className={`input-field ${
                                                    (!column?.title &&
                                                        tableErr &&
                                                        "input-error") ||
                                                    (checkIfSameColumnTitlePresent(
                                                        column?.title
                                                    ) &&
                                                        tableErr &&
                                                        "input-error")
                                                }`}
                                                id="outlined-basic"
                                                variant="outlined"
                                                name="title"
                                                helperText={
                                                    !column?.title && tableErr
                                                        ? "Enter the column title"
                                                        : checkIfSameColumnTitlePresent(
                                                              column?.title
                                                          ) && tableErr
                                                        ? "Column title already in use."
                                                        : " "
                                                }
                                                value={column?.title}
                                                onChange={(e) =>
                                                    onColumnChangeHandler(
                                                        e,
                                                        columnId
                                                    )
                                                }
                                                onBlur={(e) =>
                                                    onColumnBlurHandler(
                                                        e,
                                                        columnId
                                                    )
                                                }
                                                placeholder="Enter column title"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="emailid">
                                                Input Type{" "}
                                                <span className="mandatory">
                                                    *
                                                </span>
                                            </label>
                                            <div className="select-field">
                                                <FormControl className="fullwidth-field">
                                                    <Select
                                                        IconComponent={(
                                                            props
                                                        ) => (
                                                            <KeyboardArrowDownRoundedIcon
                                                                {...props}
                                                            />
                                                        )}
                                                        displayEmpty
                                                        placeholder="Select input type"
                                                        name="columnType"
                                                        value={
                                                            column?.columnType
                                                        }
                                                        // onChange={(e) => onColumnChangeHandler(e, columnId)}
                                                        onChange={(e) =>
                                                            onInputTypeChangeHandler(
                                                                e,
                                                                columnId
                                                            )
                                                        }
                                                        className="select-dropdown"
                                                        MenuProps={MenuProps}
                                                    >
                                                        {inputTypeOptions &&
                                                            inputTypeOptions.map(
                                                                (option) => (
                                                                    <MenuItem
                                                                        key={
                                                                            option?._id
                                                                        }
                                                                        value={
                                                                            option?._id
                                                                        }
                                                                    >
                                                                        {
                                                                            option?.name
                                                                        }
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                    </Select>
                                                    <FormHelperText>
                                                        {" "}
                                                    </FormHelperText>
                                                </FormControl>
                                                {openModal &&
                                                    modalIndex === columnId && (
                                                        <DropdownOptionModal
                                                            openModal={
                                                                openModal
                                                            }
                                                            setOpenModal={
                                                                setOpenModal
                                                            }
                                                            questionnaire={
                                                                questionnaire
                                                            }
                                                            setQuestionnaire={
                                                                setQuestionnaire
                                                            }
                                                            sectionIndex={
                                                                sectionIndex
                                                            }
                                                            columnId={columnId}
                                                            tableErr={tableErr}
                                                            setTableErr={
                                                                setTableErr
                                                            }
                                                        />
                                                    )}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="emailid">
                                                Validation
                                            </label>
                                            <div className="select-field">
                                                <FormControl className="fullwidth-field">
                                                    <Select
                                                        disabled={
                                                            column?.columnType !==
                                                            "textbox"
                                                        }
                                                        IconComponent={(
                                                            props
                                                        ) => (
                                                            <KeyboardArrowDownRoundedIcon
                                                                {...props}
                                                            />
                                                        )}
                                                        renderValue={
                                                            column?.validation !==
                                                            ""
                                                                ? undefined
                                                                : () => (
                                                                      <Placeholder>
                                                                          Select
                                                                          validator
                                                                      </Placeholder>
                                                                  )
                                                        }
                                                        displayEmpty
                                                        name="validation"
                                                        value={
                                                            column?.validation
                                                        }
                                                        onChange={(e) =>
                                                            onColumnChangeHandler(
                                                                e,
                                                                columnId
                                                            )
                                                        }
                                                        className="select-dropdown"
                                                        MenuProps={MenuProps}
                                                    >
                                                        {/* <MenuItem disabled value="">
                              Select Validator
                            </MenuItem> */}
                                                        {validationOptions &&
                                                            validationOptions.map(
                                                                (option) => (
                                                                    <MenuItem
                                                                        key={
                                                                            option?._id
                                                                        }
                                                                        value={
                                                                            option?._id
                                                                        }
                                                                    >
                                                                        {
                                                                            option?.name
                                                                        }
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                    </Select>
                                                    <FormHelperText>
                                                        {" "}
                                                    </FormHelperText>
                                                </FormControl>
                                            </div>
                                            {column?.columnType ===
                                                "dropdown" && (
                                                <div className="add-dropdown-btnblk edit-dropdown-btn">
                                                    <span
                                                        className="addmore-icon"
                                                        onClick={() =>
                                                            onEditOptionClickHandler(
                                                                columnId
                                                            )
                                                        }
                                                    >
                                                        <ModeEditOutlineOutlinedIcon />
                                                    </span>{" "}
                                                    <span
                                                        onClick={() =>
                                                            onEditOptionClickHandler(
                                                                columnId
                                                            )
                                                        }
                                                    >
                                                        Edit Dropdown
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {questionnaire?.sections[sectionIndex]
                                            ?.columnValues?.length > 1 && (
                                            <div className="que-col-delete delete-iconblk">
                                                <Tooltip
                                                    title="Delete column"
                                                    placement="bottom"
                                                >
                                                    <img
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={(e) =>
                                                            onDeleteIconClickHandler(
                                                                e,
                                                                columnId
                                                            )
                                                        }
                                                        src={
                                                            process.env
                                                                .PUBLIC_URL +
                                                            "/images/delete-icon.svg"
                                                        }
                                                        alt=""
                                                    />
                                                </Tooltip>
                                            </div>
                                        )}
                                    </div>
                                    <div className="que-card-icon-sect">
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
                                                        checked={
                                                            column?.isRequired
                                                        }
                                                        onChange={(e) =>
                                                            onColumnTogleChangeHandler(
                                                                e,
                                                                columnId
                                                            )
                                                        }
                                                        // onChange={(e) =>
                                                        //     onSwichChangeHandler(
                                                        //         e,
                                                        //         sectionIndex,
                                                        //         questionIdx
                                                        //     )
                                                        // }
                                                        inputProps={{
                                                            "aria-label":
                                                                "controlled",
                                                        }}
                                                    />
                                                </Stack>
                                            </FormGroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )}
            <div
                className="add-row-btnblk add-col-btn"
                onClick={onAddColumnClickHandler}
            >
                <span className="addmore-icon">
                    <i className="fa fa-plus"></i>
                </span>{" "}
                Add Column
            </div>
            <TableRender
                isPreview={false}
                questionnaire={questionnaire}
                setQuestionnaire={setQuestionnaire}
                sectionIndex={sectionIndex}
                tableErr={tableErr}
                setTableErr={setTableErr}
            />
        </div>
    );
};

export default TableQuestions;
