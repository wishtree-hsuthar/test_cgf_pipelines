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
           <TableContainer component={Paper} className='table-blk'>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{type}</TableCell>
            <TableCell >Submitted</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>Total</TableCell>
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
              <TableCell >{row?.submitted}</TableCell>
              <TableCell >{row?.pending}</TableCell>
              <TableCell >{row?.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default SAQStatsTable