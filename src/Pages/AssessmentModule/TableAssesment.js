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
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Logger } from "../../Logger/Logger.js";
const TableLayoutCellComponent = React.lazy(() =>
  import("./TableLayoutCellComponent.js")
);

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
  myRef,
  setToasterDetails,
  section
}) => {
  const params = useParams();

  const tranformedColumnValues = getTransformedColumns(columnValues);
  const tranformedRowValues = getTransformedRows(rowValues);
  const [isPrefilled, setIsPrefilled] = useState(false);

  let rowIdsArray = [];
  const onAddRowClickHandler = () => {
    const newRowId = uuidv4();
    let temp = { ...assessmentQuestionnaire };

    columnValues.forEach((column) => {
      temp[sectionUUID][`${[column?.uuid]}_${newRowId}`] = "";
    });
    Logger.info("Table Assesment - onRowClickHandler");
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

   // show hide table cell
   const hideCell=(cell,cellId)=>{
    let column = section?.columnValues[cellId];
    if (column.hideColumn) {
      if (column.uuid===cell.columnId&&column.hideColumn=='no') {
        return true
      } else {
        return false      
      }
    } else {
      return true
    }
     
  }
    columnValues.map(column=> {isPrefilled ||
      (column?.columnType === "prefilled" &&
        setIsPrefilled(true))})
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
                className={
                  !isPrefilled && !params["*"].includes("view")
                    ? "que-table assessment-table not-prefilled-table"
                    : "que-table assessment-table"
                }
              >
                <TableHead>
                  <TableRow>
                    {!isPrefilled && !params["*"].includes("view") && (
                      <TableCell width={75}></TableCell>
                    )}
                    {columnValues?.filter(column=>column.columnType=='prefilled'&&column.hideColumn==='no').map((column, columnId) => (
                      <TableCell key={column?.uuid} width="200px">
                        {/* {isPrefilled ||
                          (column?.columnType === "prefilled" &&
                            setIsPrefilled(true))} */}
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
                                    {column?.isRequired && (
                                      <span className="mandatory">*</span>
                                    )}
                                  </p>
                                </Tooltip>
                              ) : (
                                <p>
                                  {column?.title}{" "}
                                  {column?.isRequired && (
                                    <span className="mandatory">*</span>
                                  )}
                                </p>
                              )}
                              {/* <p>{column?.title}</p> */}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    ))}
                    {columnValues?.filter(column=>column.columnType!='prefilled'||(column.columnType==='prefilled'&&!column.hideColumn)).map((column, columnId) => (
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
                                    {column?.isRequired && (
                                      <span className="mandatory">*</span>
                                    )}
                                  </p>
                                </Tooltip>
                              ) : (
                                <p>
                                  {column?.title}{" "}
                                  {column?.isRequired && (
                                    <span className="mandatory">*</span>
                                  )}
                                </p>
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
                            style={{
                              cursor: "pointer",
                              display: "",
                            }}
                          >
                            <Tooltip title="Delete Row">
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
                            hideCell(cell,cellId)&&
                            <TableCell key={cell?.columnId}>
                              <TableLayoutCellComponent
                                sectionUUID={sectionUUID}
                                isPrefilled={isPrefilled}
                                assessmentQuestionnaire={
                                  assessmentQuestionnaire
                                }
                                setAssessmentQuestionnaire={
                                  setAssessmentQuestionnaire
                                }
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
                                        `${cell.columnId}_${row?.uuid}`
                                      ] ?? ""
                                    : ""
                                }
                                handleAnswersChange={handleAnswersChange}
                                handleAnswersBlur={handleAnswersBlur}
                                error={
                                  errors[`${cell?.columnId}_${row?.uuid}`] ?? ""
                                }
                                editMode={editMode}
                                myRef={myRef}
                                setToasterDetails={setToasterDetails}
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
                      (assessmentQuestionnaireKey, idx) => {
                        let assessmentQuestionnaireRowId =
                          assessmentQuestionnaireKey.split("_")[1];
                        const isRowRenderd = rowIdsArray?.findIndex(
                          (tempRowId) =>
                            tempRowId === assessmentQuestionnaireRowId
                        );

                        if (isRowRenderd === -1) {
                          rowIdsArray?.push(assessmentQuestionnaireRowId);

                          return (
                            <TableRow
                              key={assessmentQuestionnaireKey}
                              className="not-prefilled"
                            >
                              {!isPrefilled &&
                                !params["*"].includes("view") && (
                                  <TableCell>
                                    <div
                                      className="que-column-count flex-between"
                                      style={{
                                        cursor: "pointer",
                                        display: "",
                                      }}
                                    >
                                      {rowIdsArray?.length > 1 && (
                                        <Tooltip title="Delete Row">
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
                                      )}
                                      {rowIdsArray?.length > 1 && idx === 0 && (
                                        <Tooltip title="Delete Row">
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
                                      )}
                                    </div>
                                  </TableCell>
                                )}
                              {columnValues?.map((column, columnIdx) => {
                                return (
                                  <TableCell key={column?.uuid}>
                                    <TableLayoutCellComponent
                                      isPrefilled={isPrefilled}
                                      sectionUUID={sectionUUID}
                                      assessmentQuestionnaire={
                                        assessmentQuestionnaire
                                      }
                                      setAssessmentQuestionnaire={
                                        setAssessmentQuestionnaire
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
                                              `${column?.uuid}_${assessmentQuestionnaireRowId}`
                                            ] ?? ""
                                          : ""
                                      }
                                      handleAnswersChange={handleAnswersChange}
                                      handleAnswersBlur={handleAnswersBlur}
                                      error={
                                        errors[
                                          `${column?.uuid}_${assessmentQuestionnaireRowId}`
                                        ] ?? ""
                                      }
                                      editMode={editMode}
                                      myRef={myRef}
                                      setToasterDetails={setToasterDetails}
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
          <div className="add-row-btnblk" onClick={onAddRowClickHandler}>
            <span className="addmore-icon">
              <i className="fa fa-plus"></i>
            </span>{" "}
            <span>Add Row</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableAssessment;
