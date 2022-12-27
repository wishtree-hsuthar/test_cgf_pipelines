import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import TableLayoutCellComponent from "./TableLayoutCellComponent.js";

const ITEM_HEIGHT = 42;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4,
    },
  },
};

const getTransformedColumns = (columns) => {
  let transformedColumns = {};
  columns.forEach((column) => {
    transformedColumns[column.uuid] = column;
  });
  return transformedColumns;
};

const getTransformedRows = (rows) => {
  let transfromedRows = {};
  rows.forEach((row) => {
    transfromedRows[row.uuid] = row;
  });

  return transfromedRows;
};

const TableAssessment = ({
  setAssessmentQuestionnaire,
  assessmentQuestionnaire = {},
  columnValues,
  rowValues,
  sectionUUID,
  handleAnswersChange,
  handleAnswersBlur,
  errors,
  editMode,
}) => {
  const params = useParams();
  const tranformedColumnValues = getTransformedColumns(columnValues);
  const tranformedRowValues = getTransformedRows(rowValues);
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [isRowsModified, setIsRowsModified] = useState(false);
  let rowIdsArray = [];
  // let assessmentQuestionnaire = useSelector((state) => state.user.assessment);
  // console.log("temp Asessement", assessmentQuestionnaire);
  const onAddRowClickHandler = () => {
    const newRowId = uuidv4();
    let temp = { ...assessmentQuestionnaire };
    console.log("temp before row add", temp);
    columnValues.forEach((column) => {
      if (column?.columnType === "dropdown") {
        temp[sectionUUID][`${[column?.uuid]}.${newRowId}`] = undefined;
      } else {
        temp[sectionUUID][`${[column?.uuid]}.${newRowId}`] = "";
      }
    });
    console.log("temp after row Add", temp);
    setAssessmentQuestionnaire({ ...temp });
  };
  const onRowDeleteClickHandler = (toBeDeletedRowId) => {
    let newAssessmentSection = {};
    Object.keys(assessmentQuestionnaire[sectionUUID]).forEach(
      (assessmentQuestionnaireKey) => {
        if (!assessmentQuestionnaireKey.includes(toBeDeletedRowId)) {
          newAssessmentSection[assessmentQuestionnaireKey] =
            assessmentQuestionnaire[sectionUUID][assessmentQuestionnaireKey];
        }
      }
    );
    const tempAsssessmentQuestionnaire = { ...assessmentQuestionnaire };
    tempAsssessmentQuestionnaire[sectionUUID] = newAssessmentSection;
    setAssessmentQuestionnaire(tempAsssessmentQuestionnaire);
  };

  // console.log("Assessment Questionnaire:- ", assessmentQuestionnaire);

  useEffect(() => {
    // console.log("section", assessmentQuestionnaire[sectionUUID]);
    // dispatch(setOldAssessment(assessmentQuestionnaire));
    // console.log("tempSection", assessmentQuestionnaire);
  }, []);
  console.log("Assessment Questionnaire:- ", assessmentQuestionnaire);
  return (
    <div className="que-table-sect">
      <div className="que-table-wrap assessment-table-wrap">
        <div className="que-table-innerwrap assessment-table-innerwrap flex-between no-wrap">
          <Paper
            sx={{ width: "96%", overflow: "hidden" }}
            className="que-table-infoblk"
          >
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                // className="que-table assessment-table"
                className={!isPrefilled &&
                  !params["*"].includes("view") ? "que-table assessment-table not-prefilled-table" : "que-table assessment-table"}
              >
                <TableHead>
                  <TableRow>
                    {!isPrefilled && !params["*"].includes("view") && (
                      <TableCell width={75}></TableCell>
                    )}
                    {columnValues?.map((column, columnId) => (
                      <TableCell key={column?.uuid} width="200px">
                        {isPrefilled ||
                          (column?.columnType === "prefilled" &&
                            setIsPrefilled(true))}
                        <div className="que-table-column-info">
                          <div className="que-column-ttlblk">
                            <div
                              className="que-table-col-ttl"
                              // contentEditable="true"
                            >
                               {column?.title.length > 50 ? (
                                    <Tooltip
                                      title={column?.title}
                                      placement="bottom-start"
                                    >
                                      <p>
                                        {column?.title.slice(0, 50)}
                                        ...
                                      </p>
                                    </Tooltip>
                                  ) : (
                                    <p>{column?.title}</p>
                                  )}
                              {/* <p>{column?.title}</p> */}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isPrefilled &&
                    rowValues?.map((row, rowId) => (
                      <TableRow key={row?.uuid}>
                        {!isPrefilled && !params["*"].includes("view") && (
                          <TableCell
                            className="que-column-count"
                            style={{ cursor: "pointer", display: "" }}
                          >
                            <Tooltip title="Delete row">
                              <span
                                className="minus-iconblk"
                                onClick={() => onRowDeleteClickHandler()}
                              >
                                <i className="fa fa-minus"></i>
                              </span>
                            </Tooltip>
                          </TableCell>
                        )}
                        {row &&
                          row?.cells?.map((cell, cellId) => (
                            <TableCell key={cell?.columnId}>
                              <TableLayoutCellComponent
                                assessmentQuestionnaire={
                                  assessmentQuestionnaire
                                }
                                isPrefilled={isPrefilled}
                                transformedColumns={tranformedColumnValues}
                                tranformedRows={tranformedRowValues}
                                cellId={cellId}
                                rowId={row?.uuid}
                                cell={cell}
                                // answer={
                                //     answers[
                                //         sectionUUID
                                //     ][
                                //         `${cell.columnId}.${row?.uuid}`
                                //     ] ?? ""
                                // }
                                answer={
                                  assessmentQuestionnaire[sectionUUID]
                                    ? assessmentQuestionnaire[sectionUUID][
                                        `${cell.columnId}.${row?.uuid}`
                                      ] ?? ""
                                    : ""
                                }
                                handleAnswersChange={handleAnswersChange}
                                handleAnswersBlur={handleAnswersBlur}
                                error={
                                  errors[`${cell?.columnId}.${row?.uuid}`] ?? ""
                                }
                                editMode={editMode}
                              />
                            </TableCell>
                          ))}
                      </TableRow>
                    ))}
                  {!isPrefilled &&
                    assessmentQuestionnaire &&
                    Object.keys(assessmentQuestionnaire).length !== 0 &&
                    assessmentQuestionnaire[sectionUUID] &&
                    Object.keys(assessmentQuestionnaire[sectionUUID]).length !==
                      0 &&
                    Object?.keys(assessmentQuestionnaire[sectionUUID]).map(
                      (assessmentQuestionnaireKey) => {
                        let assessmentQuestionnaireRowId =
                          assessmentQuestionnaireKey.split(".")[1];
                        const isRowRenderd = rowIdsArray?.findIndex(
                          (tempRowId) =>
                            tempRowId === assessmentQuestionnaireRowId
                        );
                        // console.log("index in rowId Array", isRowRenderd);
                        // console.log("rowIds array:- ", rowIdsArray);
                        if (isRowRenderd === -1) {
                          rowIdsArray?.push(assessmentQuestionnaireRowId);
                          return (
                            <TableRow key={assessmentQuestionnaireKey} className="not-prefilled">
                              {!isPrefilled &&
                                !params["*"].includes("view") && (
                                  <TableCell>
                                    <div
                              className="que-column-count flex-between"
                              style={{ cursor: "pointer", display: "" }}
                            >
                              
                                    <Tooltip title="Delete row">
                                      <span
                                        className="minus-iconblk"
                                        onClick={() =>
                                          onRowDeleteClickHandler(
                                            assessmentQuestionnaireRowId
                                          )
                                        }
                                      >
                                        <i className="fa fa-minus"></i>
                                      </span>
                                    </Tooltip>
                                    </div>
                                  </TableCell>
                                )}
                              {columnValues?.map((column, columnIdx) => {
                                // console.log("column:- ", column);
                                return (
                                  <TableCell key={column?.uuid}>
                                    <TableLayoutCellComponent
                                      isPrefilled={isPrefilled}
                                      assessmentQuestionnaire={
                                        assessmentQuestionnaire
                                      }
                                      transformedColumns={
                                        tranformedColumnValues
                                      }
                                      tranformedRows={tranformedRowValues}
                                      // cellId={cellId}
                                      rowId={assessmentQuestionnaireRowId}
                                      columnId={column?.uuid}
                                      columnIdx={columnIdx}
                                      // cell={cell}
                                      // answer={
                                      //     answers[
                                      //         sectionUUID
                                      //     ][
                                      //         `${cell.columnId}.${row?.uuid}`
                                      //     ] ?? ""
                                      // }
                                      answer={
                                        assessmentQuestionnaire[sectionUUID]
                                          ? assessmentQuestionnaire[
                                              sectionUUID
                                            ][
                                              `${column?.uuid}.${assessmentQuestionnaireRowId}`
                                            ] ?? ""
                                          : ""
                                      }
                                      handleAnswersChange={handleAnswersChange}
                                      handleAnswersBlur={handleAnswersBlur}
                                      error={
                                        errors[
                                          `${column?.uuid}.${assessmentQuestionnaireRowId}`
                                        ] ?? ""
                                      }
                                      editMode={editMode}
                                    />
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        }
                      }
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
        {!isPrefilled && !params["*"].includes("view") && (
          <div className="add-row-btnblk">
            <span className="addmore-icon" onClick={onAddRowClickHandler}>
              <i className="fa fa-plus"></i>
            </span>{" "}
            <span onClick={onAddRowClickHandler}>Add Row</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableAssessment;
