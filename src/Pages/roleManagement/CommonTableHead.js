import { TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";

const CommonTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell align="left" className="table-header" width="16%">
          <span className="sorted-blk">Modules</span>
        </TableCell>
        <TableCell className="table-header">
          <span className="sorted-blk">Fill</span>
        </TableCell>
        <TableCell className="table-header">
          <span className="sorted-blk">List</span>
        </TableCell>
        <TableCell align="center" className="table-header">
          <span className="sorted-blk">Add</span>
        </TableCell>
        <TableCell align="center" className="table-header">
          <span className="sorted-blk">Edit</span>
        </TableCell>
        <TableCell align="center" className="table-header">
          <span className="sorted-blk">View</span>
        </TableCell>
        <TableCell align="center" className="table-header">
          <span className="sorted-blk">Delete</span>
        </TableCell>
        {/* <TableCell
                              align="center"
                              className="table-header"
                              width="16%"
                            >
                              Assign to Member
                            </TableCell> */}
        <TableCell align="center" className="table-header">
          <span className="sorted-blk">All</span>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default CommonTableHead;
