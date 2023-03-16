import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import "../../../components/TableComponent.css";
import React from "react";

const Statistics = () => {
  return (
    <div className="container">
      <div className="form-header member-form-header mb-0 mt-0">
        <div className="form-header-left-blk">
          <h2 className="heading2">Statistics </h2>
        </div>
      </div>
      <div className="instruct-table-sect">
        <div className="table-content-wrap">
          <Box
            sx={{ width: "100%" }}
            className="table-blk table-blk-without-checkbox"
          >
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2} className="table-header">
                        <span>Available points</span>
                      </TableCell>
                      <TableCell colSpan={2} className="table-header">
                        <span>54(get from back end or as prop)</span>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Launched</TableCell>
                      <TableCell>18</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Established</TableCell>
                      <TableCell>36</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>LeaderShip</TableCell>
                      <TableCell>54</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </div>
        <div className="table-content-wrap">
          <Box
            sx={{ width: "100%" }}
            className="table-blk table-blk-without-checkbox"
          >
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2} className="table-header">
                        <span>Score</span>
                      </TableCell>
                      <TableCell colSpan={2} className="table-header">
                        <span>32</span>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Launched</TableCell>
                      <TableCell>18</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Established</TableCell>
                      <TableCell>36</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>LeaderShip</TableCell>
                      <TableCell>54</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </div>
        <div className="table-content-wrap">
          <Box
            sx={{ width: "100%" }}
            className="table-blk table-blk-without-checkbox"
          >
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2} className="table-header">
                        <span>Level(General)</span>
                      </TableCell>
                      <TableCell colSpan={2} className="table-header">
                        <span>53%</span>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  <TableRow>
                      <TableCell>Not Initiated</TableCell>
                      <TableCell>18</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Launched</TableCell>
                      <TableCell>18</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Established</TableCell>
                      <TableCell>36</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>LeaderShip</TableCell>
                      <TableCell>54</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Advanced & Best Practice (Established + Leadership)</TableCell>
                      <TableCell>54</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
