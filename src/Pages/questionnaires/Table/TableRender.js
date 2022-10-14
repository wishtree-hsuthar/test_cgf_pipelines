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

const TableRender = ({ questionnaire, setQuestionnaire, sectionIndex }) => {
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
    console.log("Inside row Delete method");
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
                    <TableCell width={80}></TableCell>
                    {questionnaire &&
                      questionnaire?.sections[sectionIndex]?.columnValues?.map(
                        (column, columnId) => (
                          <TableCell key={column?.uuid}>
                            <div className="que-table-column-info">
                              <div className="que-column-ttlblk flex-between">
                                <div
                                  className="que-table-col-ttl"
                                  contentEditable="true"
                                >
                                  {column?.title}
                                </div>
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
                            <span
                              className="minus-iconblk"
                              onClick={() => onRowDeleteClickHandler(rowId)}
                            >
                              <i className="fa fa-minus"></i>
                            </span>
                          </div>
                        </TableCell>
                        {row &&
                          row?.cells?.map((cell, cellId) => (
                            <TableCell key={cell?.columnId}>
                              <TableLayoutCellComponent
                                questionnaire={questionnaire}
                                setQuestionnaire={setQuestionnaire}
                                sectionIndex={sectionIndex}
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
        <div className="add-row-btnblk" onClick={onAddRowClickHandler}>
          <span className="addmore-icon">
            <i className="fa fa-plus"></i>
          </span>{" "}
          Add Row
        </div>
      </div>
    </div>
  );
};

export default TableRender;
