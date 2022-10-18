import {
    TextField,
    FormControl,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import React, { useState } from "react";
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
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
    const [showMore, setShowMore] = useState(false);

    return (
        <>
            {transformedColumns[cell.columnId] &&
                transformedColumns[cell.columnId].columnType ===
                    "prefilled" && (
                    <p className="text-justify">
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
                                    className="show-more-less-txt"
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
                                            className="show-more-less-txt"
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
                    // <div name={`${cell.columnId}.${rowId}`}>{cell?.value}</div>
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
                                    OpenPickerIcon: DateRangeOutlinedIcon,
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
