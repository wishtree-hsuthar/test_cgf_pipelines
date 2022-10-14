import { MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import TableRender from "./TableRender.js";
import React, { useEffect } from "react";

const ITEM_HEIGHT = 22;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5,
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
    name: "Textbox",
  },
  {
    _id: "dropdown",
    name: "Dropdown",
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

const TableQuestions = ({ sectionIndex, questionnaire, setQuestionnaire }) => {
  const onColumnChangeHandler = (event, columnId) => {
    console.log("Event: ", event.target.name, "columnId", columnId);
    const { name, value } = event.target;
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire.sections[sectionIndex].columnValues[columnId][name] =
      value;
    setQuestionnaire(tempQuestionnaire);
    // const {name, value} = e.target;
    console.log("Questionnaire:- ", questionnaire);
  };

  //method to handle Add column icon click handler
  const onAddColumnClickHandler = () => {
    let tempQuestionnaire = { ...questionnaire };
    const initialId = uuidv4();
    tempQuestionnaire?.sections[sectionIndex]?.columnValues?.push({
      uuid: initialId,
      title: "",
      columnType: "",
      options: ["", ""],
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
    console.log("Temp Questionnaire: ", tempQuestionnaire);
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
  useEffect(() => {
    console.log("Questionnaire: ", questionnaire);
  }, [questionnaire]);

  return (
    <div className="que-column-layout-sect">
      {questionnaire &&
        questionnaire?.sections[sectionIndex]?.columnValues?.map(
          (column, columnId) => (
            <div key={column?.uuid} className="que-column-layout-wrap">
              <div className="que-column-layout-blk">
                {/* <div className="que-column-layout-ttlblk flex-between">
                    
                </div> */}
                
                <div class="que-card-innerblk">
                  <div className="que-col-form-leftfield flex-between">
                    <div className="form-group">
                        <label htmlFor="emailid">Column {columnId + 1} Title</label>
                        <TextField
                          className="input-field"
                          id="outlined-basic"
                          variant="outlined"
                          name="title"
                          value={column?.title}
                          onChange={(e) => onColumnChangeHandler(e, columnId)}
                          placeholder="Enter column title"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="emailid">Input type</label>
                        <div className="select-field">
                          <Select
                            IconComponent={(props) => (
                              <KeyboardArrowDownRoundedIcon {...props} />
                            )}
                            displayEmpty
                            placeholder="Select input type"
                            name="columnType"
                            value={column?.columnType}
                            onChange={(e) => onColumnChangeHandler(e, columnId)}
                            className="select-dropdown"
                            MenuProps={MenuProps}
                          >
                            <MenuItem disabled value="">
                              Select input type
                            </MenuItem>
                            {inputTypeOptions &&
                              inputTypeOptions.map((option) => (
                                <MenuItem key={option?._id} value={option?._id}>
                                  {option?.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="emailid">Response Validator</label>
                        <div className="select-field">
                          <Select
                            IconComponent={(props) => (
                              <KeyboardArrowDownRoundedIcon {...props} />
                            )}
                            displayEmpty
                            name="validation"
                            value={column?.validation}
                            onChange={(e) => onColumnChangeHandler(e, columnId)}
                            className="select-dropdown"
                            MenuProps={MenuProps}
                          >
                            <MenuItem disabled value="">
                              Select Validator
                            </MenuItem>
                            {validationOptions &&
                              validationOptions.map((option) => (
                                <MenuItem key={option?._id} value={option?._id}>
                                  {option?.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </div>
                      </div>
                      <div className="que-col-delete delete-iconblk">
                        <Tooltip title="Delete column" placement="bottom">
                          <img
                            style={{ cursor: "pointer" }}
                            onClick={(e) => onDeleteIconClickHandler(e, columnId)}
                            src={process.env.PUBLIC_URL + "/images/delete-icon.svg"}
                            alt=""
                          />
                        </Tooltip>
                      </div>
                  </div>

                  
                </div>
              </div>
              
            </div>
          )
        )}
      <div className="add-row-btnblk add-col-btn" onClick={onAddColumnClickHandler}>
        <span className="addmore-icon">
          <i className="fa fa-plus"></i>
        </span>{" "}
        Add Column
      </div>
      <TableRender
        questionnaire={questionnaire}
        setQuestionnaire={setQuestionnaire}
        sectionIndex={sectionIndex}
      />
    </div>
  );
};

export default TableQuestions;
