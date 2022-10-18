import { FormControl, FormHelperText, MenuItem, Select, TextField } from "@mui/material";
import React from "react";
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


const ITEM_HEIGHT = 22;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5,
    },
  },
};


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
  const columnFieldType =
    questionnaire?.sections[sectionIndex]?.columnValues[cellId]?.columnType;
  const column = questionnaire?.sections[sectionIndex]?.columnValues[cellId]

  return (
    <div>
      {columnFieldType && columnFieldType === "prefilled" && (
        <TextField
          className={`input-field ${!cell?.value && tableErr && "input-error"}`}
          name="value"
          value={cell?.value}
          helperText={!cell?.value && tableErr ? "Enter prefiled" : " "}
          onChange={(e) => onCellValueChangeHandler(e, rowId, cellId)}
        />
      )}
      {columnFieldType && columnFieldType === "textbox" && (
        <TextField helperText=" " disabled />
      )}
      {columnFieldType && columnFieldType === "dropdown" && (
        <FormControl className="fullwidth-field">
        <Select
          IconComponent={(props) => <KeyboardArrowDownRoundedIcon {...props} />}
          displayEmpty
          placeholder="Select input type"
          name="columnType"
          value={column?.columnType}
          // onChange={(e) => onColumnChangeHandler(e, columnId)}
          // onChange={(e) => onInputTypeChangeHandler(e, columnId)}
          className="select-dropdown"
          MenuProps={MenuProps}
        >
          <MenuItem value="dropdown" disabled>Select option</MenuItem>
          {column &&
            column?.options?.map((option,optionIdx) => (
              <MenuItem key={optionIdx} value={option} disabled>
                {option}
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
            renderInput={(params) => <TextField {...params} helperText=" " />}
          />
        </LocalizationProvider>
      )}
      {/* </LocalizationProvider> */}
    </div>
  );
};

export default TableLayoutCellComponent;
