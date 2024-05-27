import {
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Logger } from "../../../Logger/Logger";
const ITEM_HEIGHT = 42;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4,
        },
    },
};

const TableLayoutCellComponent = ({
    isPreview,
    questionnaire,
    setQuestionnaire,
    sectionIndex,
    tableErr,
    setTableErr,
    rowId,
    cellId,
    cell,
}) => {
    const [showMore, setShowMore] = useState(false);
    const onCellValueChangeHandler = (e, rowId, cellId) => {
        const { name, value } = e.target;
        const tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].rowValues[rowId].cells[cellId][
            name
        ] = value;
        setQuestionnaire(tempQuestionnaire);
    };
    const onCellValueBlurHandler = (e, rowId, cellId) => {
        const { name, value } = e.target;
        const tempQuestionnaire = { ...questionnaire };
        tempQuestionnaire.sections[sectionIndex].rowValues[rowId].cells[cellId][
            name
        ] = value?.trim();
        setQuestionnaire(tempQuestionnaire);
    };
    const columnFieldType =
        questionnaire?.sections[sectionIndex]?.columnValues[cellId]?.columnType;
    const column = questionnaire?.sections[sectionIndex]?.columnValues[cellId];
   
    return (
        <div>
            {columnFieldType &&
                columnFieldType === "prefilled" && 
                isPreview && 
                    (column.uuid===cell.columnId&&column.hideColumn=='no')
                    &&
                (
                    <p style={{ textAlign: "justify" }}>
                        {showMore ? (
                            <span>
                                <span>{cell?.value}</span>
                                <br />
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowMore(false);
                                    }}
                                    style={{ color: "#4596D1" }}
                                >
                                    Show Less
                                </a>
                            </span>
                        ) : (
                            <span>
                                {cell?.value.length > 100 ? (
                                    <span>
                                        <span>
                                            {cell?.value.slice(0, 100)}...
                                        </span>
                                        <br />
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowMore(true);
                                            }}
                                            style={{ color: "#4596D1" }}
                                        >
                                            Show More
                                        </a>
                                    </span>
                                ) : (
                                    cell?.value
                                )}
                            </span>
                        )}
                    </p>
                )}
            {columnFieldType && columnFieldType === "attachments" && (
                <span className="no-attachment-txt">No Attachments</span>
            )}
            {columnFieldType &&
                columnFieldType === "prefilled" && 
                !isPreview && (
                    <TextField
                        multiline
                        className={`input-textarea ${
                            !cell?.value && tableErr && "input-textarea-error"
                        }`}
                        name="value"
                        value={cell?.value}
                        helperText={
                            !cell?.value && tableErr
                                ? "Enter the row value"
                                : " "
                        }
                        onChange={(e) =>
                            onCellValueChangeHandler(e, rowId, cellId)
                        }
                        onBlur={(e) => onCellValueBlurHandler(e, rowId, cellId)}
                    />
                )}
            {columnFieldType && columnFieldType === "textbox" && (
                <TextField helperText=" " disabled />
            )}
            {columnFieldType && columnFieldType === "dropdown" && (
                <FormControl className="fullwidth-field">
                    <Select
                        IconComponent={(props) => (
                            <KeyboardArrowDownRoundedIcon {...props} />
                        )}
                        displayEmpty
                        placeholder="Select input type"
                        name="columnType"
                        value={column?.columnType}
                        // onChange={(e) => onColumnChangeHandler(e, columnId)}
                        // onChange={(e) => onInputTypeChangeHandler(e, columnId)}
                        className="select-dropdown"
                        renderValue={() => (
                            <div className="select-placeholder">
                                Select option
                            </div>
                        )}
                        MenuProps={MenuProps}
                    >
                        {/* <MenuItem value="dropdown" disabled>
              Select option
            </MenuItem> */}
                        {column &&
                            column?.options?.map((option, optionIdx) => (
                                <MenuItem key={optionIdx} value={option}>
                                    {option?.length <= 40 ? (
                                        option
                                    ) : (
                                        <Tooltip title={option}>
                                            <span>
                                                {option?.slice(0, 40) + "..."}
                                            </span>
                                        </Tooltip>
                                    )}
                                </MenuItem>
                            ))}
                    </Select>
                    <FormHelperText> </FormHelperText>
                </FormControl>
            )}
            {columnFieldType && columnFieldType === "date" && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        disabled
                        value={null}
                        className="datepicker-blk"
                        components={{
                            OpenPickerIcon: DateRangeOutlinedIcon,
                        }}
                        onChange={() => {}}
                        renderInput={(params) => (
                            <TextField {...params} helperText=" " />
                        )}
                    />
                </LocalizationProvider>
            )}
            {/* </LocalizationProvider> */}
        </div>
    );
};

export default TableLayoutCellComponent;
