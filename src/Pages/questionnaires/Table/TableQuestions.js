import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import TableRender from "./TableRender.js";
import React, { useEffect } from "react";
import DropdownOptionModal from "./DropdownOptionModal.js";
import { useState } from "react";
import { set } from "react-hook-form";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

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
    _id: "prefilled",
    name: "Prefilled",
  },
  {
    _id: "textbox",
    name: "Text box",
  },
  {
    _id: "dropdown",
    name: "Drop down",
  },
  {
    _id: "date",
    name: "Date",
  },
];
const validationOptions = [
  {
    _id: "alphanumeric",
    name: "Alphanumeric",
  },
  {
    _id: "numeric",
    name: "Numeric",
  },
  {
    _id: "alphabets",
    name: "Alphabets",
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
  const [modalIndex, setModalIndex] = useState(-1)
  const onColumnChangeHandler = (event, columnId) => {
    // console.log("Event: ", event.target.name, "columnId", columnId);
    const { name, value } = event.target;
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire.sections[sectionIndex].columnValues[columnId][name] =
      value;
    setQuestionnaire(tempQuestionnaire);
    // const {name, value} = e.target;
    // console.log("Questionnaire:- ", questionnaire);
  };
 const onColumnBlurHandler = (event, columnId) => {
  const { name, value } = event.target;
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire.sections[sectionIndex].columnValues[columnId][name] =
      value?.trim();
    setQuestionnaire(tempQuestionnaire);
    
 }
  const onInputTypeChangeHandler = (event, columnId) => {
    const { name, value } = event.target;
    let tempQuestionnaire = { ...questionnaire };

    tempQuestionnaire.sections[sectionIndex].columnValues[columnId][name] =
      value;
    tempQuestionnaire.sections[sectionIndex].columnValues[columnId].validation =
      "";
    tempQuestionnaire.sections[sectionIndex].columnValues[columnId].options =
      [];

    if (value === "dropdown") {
      tempQuestionnaire.sections[sectionIndex].columnValues[columnId].options =
        ["", ""];
      setModalIndex(columnId)  
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
    // console.log("Temp Questionnaire: ", tempQuestionnaire);
    setQuestionnaire(tempQuestionnaire);
  };

  //   method to handle remove column click handler
  const onDeleteIconClickHandler = (event, columnId) => {
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire?.sections[sectionIndex].rowValues?.forEach((row, rowId) =>
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
    // console.log("columnIdx",columnIdx)
    setOpenModal(true)
    setModalIndex(columnIdx) 
  }
  useEffect(() => {
    // console.log("Questionnaire: ", questionnaire);
  }, [questionnaire]);

  const Placeholder = ({ children }) => {
    return <div className="select-placeholder">{children}</div>;
  };

  return (
    <div className="que-column-layout-sect">
      {questionnaire &&
        questionnaire?.sections[sectionIndex]?.columnValues?.map(
          (column, columnId) => (
            <div key={column?.uuid} className="que-column-layout-wrap">
              <div className="que-column-layout-blk">
                <div className="que-card-innerblk">
                  <div className="que-col-form-leftfield flex-between">
                    <div className="form-group">
                      <label htmlFor="emailid">
                        Column {columnId + 1} Title <span className="mandatory">*</span>
                      </label>
                      <TextField
                        className={`input-field ${
                          !column?.title && tableErr && "input-error"
                        }`}
                        id="outlined-basic"
                        variant="outlined"
                        name="title"
                        helperText={
                          !column?.title && tableErr
                            ? "Enter the column title"
                            : " "
                        }
                        value={column?.title}
                        onChange={(e) => onColumnChangeHandler(e, columnId)}
                        onBlur={(e) => onColumnBlurHandler(e, columnId)}
                        placeholder="Enter column title"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="emailid">Input Type <span className="mandatory">*</span></label>
                      <div className="select-field">
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
                            onChange={(e) =>
                              onInputTypeChangeHandler(e, columnId)
                            }
                            className="select-dropdown"
                            MenuProps={MenuProps}
                          >
                            {inputTypeOptions &&
                              inputTypeOptions.map((option) => (
                                <MenuItem key={option?._id} value={option?._id}>
                                  {option?.name}
                                </MenuItem>
                              ))}
                          </Select>
                          <FormHelperText> </FormHelperText>
                        </FormControl>
                        {openModal && modalIndex === columnId  &&  (
                          <DropdownOptionModal
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                            questionnaire={questionnaire}
                            setQuestionnaire={setQuestionnaire}
                            sectionIndex={sectionIndex}
                            columnId={columnId}
                            tableErr={tableErr}
                            setTableErr={setTableErr}
                          />
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="emailid">Validation</label>
                      <div className="select-field">
                        <FormControl className="fullwidth-field">
                          <Select
                            disabled={column?.columnType !== "textbox"}
                            IconComponent={(props) => (
                              <KeyboardArrowDownRoundedIcon {...props} />
                            )}
                            renderValue={column?.validation !== "" ? undefined : () => <Placeholder>Select validator</Placeholder>}
                            displayEmpty
                            name="validation"
                            value={column?.validation}
                            onChange={(e) => onColumnChangeHandler(e, columnId)}
                            className="select-dropdown"
                            MenuProps={MenuProps}
                          >
                            {/* <MenuItem disabled value="">
                              Select Validator
                            </MenuItem> */}
                            {validationOptions &&
                              validationOptions.map((option) => (
                                <MenuItem key={option?._id} value={option?._id}>
                                  {option?.name}
                                </MenuItem>
                              ))}
                          </Select>
                          <FormHelperText> </FormHelperText>
                        </FormControl>
                      </div>
                      {column?.columnType === "dropdown" && (
                          <div className="add-dropdown-btnblk edit-dropdown-btn">
                            <span className="addmore-icon" onClick={() => onEditOptionClickHandler(columnId)}>
                              <ModeEditOutlineOutlinedIcon/>
                            </span>{" "}
                            <span onClick={() => onEditOptionClickHandler(columnId)}>Edit Dropdown</span>
                          </div>
                        )}
                    </div>

                    {questionnaire?.sections[sectionIndex]?.columnValues
                      ?.length > 1 && (
                      <div className="que-col-delete delete-iconblk">
                        <Tooltip title="Delete column" placement="bottom">
                          <img
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              onDeleteIconClickHandler(e, columnId)
                            }
                            src={
                              process.env.PUBLIC_URL + "/images/delete-icon.svg"
                            }
                            alt=""
                          />
                        </Tooltip>
                      </div>
                    )}
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
