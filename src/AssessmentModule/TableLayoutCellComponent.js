import {
    TextField,
    FormControl,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import React from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const TableLayoutCellComponent = ({
    rowId,
    transformedColumns,
    cell,
    answer,
    handleAnswersChange,
    error,
}) => {
    return (
        <>
            {transformedColumns[cell.columnId] &&
                transformedColumns[cell.columnId].columnType ===
                    "prefilled" && (
                    <div name={`${cell.columnId}.${rowId}`}>{cell?.value}</div>
                    // <TextField
                    //     className={`input-field`}
                    //     name={`${cell.columnId}.${rowId}`}
                    //     value={cell?.value}
                    //     disabled
                    //     helperText={" "}
                    // />
                )}
            {transformedColumns[cell.columnId] &&
                transformedColumns[cell.columnId].columnType === "textbox" && (
                    <TextField
                        className={`${
                            !answer && error && error?.length !== 0
                                ? "input-error"
                                : ""
                        }`}
                        value={answer}
                        name={`${cell.columnId}.${rowId}`}
                        onChange={(e) =>
                            handleAnswersChange(e.target.name, e.target.value)
                        }
                        helperText={
                            !answer && error && error?.length !== 0
                                ? error
                                : " "
                        }
                    />
                )}
            {transformedColumns[cell.columnId] &&
                transformedColumns[cell.columnId].columnType === "dropdown" && (
                    <div className="select-field">
                        <FormControl className="fullwidth-field">
                            <Select
                                IconComponent={(props) => (
                                    <KeyboardArrowDownRoundedIcon {...props} />
                                )}
                                name={`${cell.columnId}.${rowId}`}
                                value={answer}
                                className={`${
                                    !answer && error && error?.length !== 0
                                        ? "select-field-error"
                                        : ""
                                }`}
                                onChange={(e) => {
                                    handleAnswersChange(
                                        e.target.name,
                                        e.target.value
                                    );
                                }}
                            >
                                {transformedColumns[cell.columnId].options.map(
                                    (option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                            <FormHelperText>
                                {!answer && error && error?.length !== 0
                                    ? error
                                    : " "}
                            </FormHelperText>
                        </FormControl>
                    </div>
                )}
            {transformedColumns[cell.columnId] &&
                transformedColumns[cell.columnId].columnType === "date" && (
                    <FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={answer}
                                className={`datepicker-blk`}
                                components={{
                                    OpenPickerIcon: CalendarMonthOutlinedIcon,
                                }}
                                onChange={(dateValue) => {
                                    handleAnswersChange(
                                        `${cell.columnId}.${rowId}`,
                                        new Date(dateValue).toISOString()
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        className={`${
                                            !answer &&
                                            error &&
                                            error?.length !== 0
                                                ? "input-error"
                                                : ""
                                        }`}
                                    />
                                )}
                            />
                            <FormHelperText>
                                {!answer && error && error?.length !== 0
                                    ? error
                                    : " "}
                            </FormHelperText>
                        </LocalizationProvider>
                    </FormControl>
                )}
        </>
    );
};

export default TableLayoutCellComponent;
