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
           <TableContainer component={Paper} >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{width:'40%'}}>{type}</TableCell>
            <TableCell align='center'>Submitted</TableCell>
            <TableCell align='center'>Pending</TableCell>
            <TableCell align='center'>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row,index) => (
            <TableRow
              key={index}
              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell style={{width:'40%'}}component="th" scope="row">
                {type==='Member Company'?row?.memberCompany:row.country}
              </TableCell>
              <TableCell align='center'>{row?.submitted}</TableCell>
              <TableCell align='center'>{row?.pending}</TableCell>
              <TableCell align='center'>{row?.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default SAQStatsTable