import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../../components/TableComponent.css";

function SAQStatsTable({records,type}) {
  return (
    <div>
           <TableContainer component={Paper} >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow style={{background:'rgba(69, 150, 209, 0.1)'}}>
            <TableCell style={{width:'40%'}}>{type}</TableCell>
            <TableCell align='center'>Submitted</TableCell>
            <TableCell align='center'>Pending</TableCell>
            <TableCell align='center'>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length>0?records.map((row,index) => (
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
          )):  
          <tr>
          <td colSpan="10">
            <div className="no-records-blk">
              <h2 className="heading2">No records available</h2>
            </div>
          </td>
        </tr>}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default SAQStatsTable