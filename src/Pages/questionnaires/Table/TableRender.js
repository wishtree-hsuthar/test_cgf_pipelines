import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import TableLayoutCellComponent from "./TableLayoutCellComponent.js";

const TableRender = ({
  questionnaire,
  setQuestionnaire,
  sectionIndex,
  tableErr,
  setTableErr,
}) => {
  // on Add Row click handler
  const onAddRowClickHandler = () => {
    let tempQuestionnaire = { ...questionnaire };
    let tempRow = {
      uuid: uuidv4(),
      cells: [],
    };
    tempQuestionnaire?.sections[sectionIndex]?.columnValues?.forEach(
      (column, columnIdx) =>
        tempRow?.cells?.push({
          columnId: column?.uuid,
          value: "",
        })
    );
    tempQuestionnaire?.sections[sectionIndex]?.rowValues?.push({ ...tempRow });
    setQuestionnaire(tempQuestionnaire);
  };

  // on delete Row click handler
  const onRowDeleteClickHandler = (rowId) => {
    // console.log("Inside row Delete method");
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire?.sections[sectionIndex]?.rowValues?.splice(rowId, 1);
    setQuestionnaire(tempQuestionnaire);
  };

  return (
    <div className="que-table-sect">
      <div className="que-table-wrap active">
        <div className="que-table-innerwrap flex-between no-wrap">
          <Paper
            sx={{ width: "96%", overflow: "hidden" }}
            className="que-table-infoblk"
          >
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                className="que-table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell width={75}></TableCell>
                    {questionnaire &&
                      questionnaire?.sections[sectionIndex]?.columnValues?.map(
                        (column, columnId) => (
                          <TableCell key={column?.uuid}>
                            <div className="que-table-column-info">
                              <div className="que-column-ttlblk">
                                <div className="form-group">
                                  <TextField
                                    className="input-field column-input-field"
                                    id="outlined-basic"
                                    variant="outlined"
                                    name="title"
                                    value={column?.title}
                                    // placeholder="Give column title"
                                  />
                                </div>
                                {/* <div
                                  className="que-table-col-ttl"
                                  // contentEditable="true"
                                >
                                  {column?.title}
                                </div> */}
                              </div>
                            </div>
                          </TableCell>
                        )
                      )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questionnaire?.sections[sectionIndex]?.rowValues?.map(
                    (row, rowId) => (
                      <TableRow key={row?.uuid}>
                        <TableCell>
                          <div
                            className="que-column-count flex-between"
                            style={{ cursor: "pointer" }}
                          >
                            <span className="que-column-count-txt">
                              {rowId + 1}.
                            </span>
                            {questionnaire?.sections[sectionIndex]?.rowValues?.length > 2 && (
                              <span
                                className="minus-iconblk"
                                onClick={() => onRowDeleteClickHandler(rowId)}
                              >
                                <i className="fa fa-minus"></i>
                              </span>
                            )}
                          </div>
                        </TableCell>
                        {row &&
                          row?.cells?.map((cell, cellId) => (
                            <TableCell key={cell?.columnId}>
                              <TableLayoutCellComponent
                                questionnaire={questionnaire}
                                setQuestionnaire={setQuestionnaire}
                                sectionIndex={sectionIndex}
                                tableErr={tableErr}
                                setTableErr={setTableErr}
                                cellId={cellId}
                                rowId={rowId}
                                cell={cell}
                              />
                            </TableCell>
                          ))}
                      </TableRow>
                    )
                  )}
                  {/* <TableRow>
                    <TableCell>
                      <div className="que-column-count flex-between">
                        <span className="que-column-count-txt">1.</span>
                        <span class="minus-iconblk">
                          <i className="fa fa-minus"></i>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow> */}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
        <div className="add-row-btnblk">
          <span className="addmore-icon" onClick={onAddRowClickHandler}>
            <i className="fa fa-plus"></i>
          </span>{" "}
          <span onClick={onAddRowClickHandler}>Add Row</span>
        </div>
      </div>
    </div>
  );
};

export default TableRender;
