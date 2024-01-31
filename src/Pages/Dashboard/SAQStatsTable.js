import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
function SAQStatsTable({records,type}) {
  return (
    <div>
           <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{type}</TableCell>
            <TableCell align="right">Submitted</TableCell>
            <TableCell align="right">Pending</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row,index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {type==='Member Company'?row?.memberCompany:row.country}
              </TableCell>
              <TableCell align="right">{row?.submitted}</TableCell>
              <TableCell align="right">{row?.pending}</TableCell>
              <TableCell align="right">{row?.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default SAQStatsTable