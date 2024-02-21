import React, { useEffect } from 'react'
import { Chart as DoughnutChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { defaultValue, doughnutGraphOptions, indicatordefaultValue } from './DashbaordUtil';
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
DoughnutChartJS.register(ArcElement, Tooltip, Legend);

function IndicatorGraph({indicatorData}) {
  console.log("indicator data",indicatorData)
  console.log("established",indicatorData?.['graphData']?.['Established'])
 
  // indicatordefaultValue.datasets[0].data=[indicatorData?.['graphData']?.['Established'],indicatorData?.['graphData']?.['Launched'],indicatorData?.['graphData']?.['Leadership'],indicatorData?.['graphData']?.['Not Initiated']]
  // console.log('indicator data = ',indicatordefaultValue)
  const indicatordefaultValue={
    labels: ["Not Initiated",'Launched','Leadership',"Established"],

    datasets: [
      {
        // label: "# of Votes",
        data: [],
        backgroundColor: ['orange','red','blue','green'],
        borderColor: [
          ''
        ],
        borderWidth: 1,
      },
    ]
  }
  const [indicatorDataForDisplay, setIndicatorDataForDisplay] = useState({...indicatordefaultValue})
  let maxMembers=[
    {name:'Not Initiated',
    count:indicatorData?.['tableData']?.['Not Initiated']?.length},
    {name:'Launched'
    ,count:indicatorData?.['tableData']?.['Launched']?.length},
    {name:'Leadership',count:indicatorData?.['tableData']?.['Leadership']?.length},
    {name:'Established',count:indicatorData?.['tableData']?.['Established']?.length}].sort((a,b)=>a.count-b.count)
    console.log('maxMembers = ',maxMembers)
  useEffect(() => {
    
  let value = {...indicatordefaultValue}
  value.datasets[0].data=[indicatorData?.['graphData']?.['Not Initiated'],indicatorData?.['graphData']?.['Launched'],indicatorData?.['graphData']?.['Leadership'],indicatorData?.['graphData']?.['Established']]
  setIndicatorDataForDisplay({...value})
   
  }, [indicatorData])
  
  return (
    <div id='ichart1'>
      {
      
      indicatorDataForDisplay.datasets[0].data.length>0&&
     <div 
     style={{
      width: '60%',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',

}}
     >
      <Doughnut
            data={indicatorDataForDisplay}
            options={doughnutGraphOptions(indicatorData?.indicator,'top')}
          />
          </div>}
           <div>
           <TableContainer component={Paper} className='table-blk'>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Not Initiated</TableCell>
            <TableCell >Launched</TableCell>
            <TableCell>Leadership</TableCell>
            <TableCell>Established</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {indicatorData?.['tableData']?.[maxMembers[3]?.name].map((row,index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
             
              <TableCell >{indicatorData?.['tableData']?.['Not Initiated'][index]??'--'}</TableCell>
              <TableCell >{indicatorData?.['tableData']?.['Launched'][index]??"--"}</TableCell>
              <TableCell >{indicatorData?.['tableData']?.['Leadership'][index]??"--"}</TableCell>
              <TableCell >{indicatorData?.['tableData']?.['Established'][index]??"--"}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    </div>
  )
}

export default IndicatorGraph