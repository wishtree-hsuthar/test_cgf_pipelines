import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import React from "react";
import TableLayoutCellComponent from "./TableLayoutCellComponent.js";

const ITEM_HEIGHT = 22;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5,
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
    columnValues,
    rowValues,
    sectionUUID,
    answers,
    handleAnswersChange,
    errors,
}) => {
    const tranformedColumnValues = getTransformedColumns(columnValues);
    const tranformedRowValues = getTransformedRows(rowValues);

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
                                        {/* <TableCell width={80}></TableCell> */}
                                        {columnValues?.map(
                                            (column, columnId) => (
                                                <TableCell key={column?.uuid}>
                                                    <div className="que-table-column-info">
                                                        <div className="que-column-ttlblk flex-between">
                                                            <div
                                                                className="que-table-col-ttl"
                                                                // contentEditable="true"
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
                                    {rowValues?.map((row, rowId) => (
                                        <TableRow key={row?.uuid}>
                                            {/* <TableCell>
                                                <div
                                                    className="que-column-count flex-between"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <span className="que-column-count-txt">
                                                        {rowId + 1}.
                                                    </span>
                                                </div>
                                            </TableCell> */}
                                            {row &&
                                                row?.cells?.map(
                                                    (cell, cellId) => (
                                                        <TableCell
                                                            key={cell?.columnId}
                                                        >
                                                            <TableLayoutCellComponent
                                                                transformedColumns={
                                                                    tranformedColumnValues
                                                                }
                                                                tranformedRows={
                                                                    tranformedRowValues
                                                                }
                                                                cellId={cellId}
                                                                rowId={
                                                                    row?.uuid
                                                                }
                                                                cell={cell}
                                                                answer={
                                                                    answers[
                                                                        sectionUUID
                                                                    ][
                                                                        `${cell.columnId}.${row?.uuid}`
                                                                    ] ?? ""
                                                                }
                                                                handleAnswersChange={
                                                                    handleAnswersChange
                                                                }
                                                                error={
                                                                    errors[
                                                                        `${cell?.columnId}.${row?.uuid}`
                                                                    ]
                                                                }
                                                            />
                                                        </TableCell>
                                                    )
                                                )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
            </div>
        </div>
    );
};

export default TableAssessment;
