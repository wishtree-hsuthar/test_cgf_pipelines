import { TextField } from "@mui/material";
import React from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const TableLayoutCellComponent = ({
  questionnaire,
  setQuestionnaire,
  sectionIndex,
  tableErr,
  setTableErr,
  rowId,
  cellId,
  cell,
}) => {
  const onCellValueChangeHandler = (e, rowId, cellId) => {
    const { name, value } = e.target;
    const tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire.sections[sectionIndex].rowValues[rowId].cells[cellId][
      name
    ] = value;
    setQuestionnaire(tempQuestionnaire);
  };
  console.log("Questionnaire: ", questionnaire);
  const columnFieldType =
    questionnaire?.sections[sectionIndex]?.columnValues[cellId]?.columnType;

  return (
    <>
      {columnFieldType && columnFieldType === "prefilled" && (
        <TextField
        className={`input-field ${
          !cell?.value && tableErr && "input-error"
        }`}
          name="value"
          value={cell?.value}
          helperText={!cell?.value && tableErr ? "Enter prefiled" : " "}
          onChange={(e) => onCellValueChangeHandler(e, rowId, cellId)}
        />
      )}
      {columnFieldType && columnFieldType === "textbox" && (
        <TextField disabled />
      )}
      {columnFieldType && columnFieldType === "date" && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disabled
            value={null}
            className="datepicker-blk"
            components={{
              OpenPickerIcon: CalendarMonthOutlinedIcon,
            }}
            onChange={() => {}}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      )}
      {/* </LocalizationProvider> */}
    </>
  );
};

export default TableLayoutCellComponent;
