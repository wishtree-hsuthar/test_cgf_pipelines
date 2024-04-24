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
import CheckIcon from '@mui/icons-material/Check';
import "../../components/TableComponent.css";

DoughnutChartJS.register(ArcElement, Tooltip, Legend);

function IndicatorGraph({indicatorData,setIndicatorTableData,submittedData}) {
  console.log("indicator data",indicatorData)
  console.log("established",indicatorData?.['graphData']?.['Established'])
  let members = [...indicatorData?.['tableData']?.['Established'],...indicatorData?.['tableData']?.['Not Initiated'],...indicatorData?.['tableData']?.['Launched'],...indicatorData?.['tableData']?.['Leadership']]
  console.log('all member companies',members)
 
  const indicatordefaultValue={
    labels: ["Not Initiated",'Launched',"Established",'Leadership'],

    datasets: [
      {
        // label: "# of Votes",
        data: [],
        backgroundColor: ['#FFF67E','#BFEA7C','#9BCF53','#416D19'],
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
  value.labels=[`Not Inititated - ${indicatorData?.['graphData']?.['Not Initiated']}%`,`Launched - ${indicatorData?.['graphData']?.['Launched']}%`,`Established - ${indicatorData?.['graphData']?.['Established']}%`,`Leadership - ${indicatorData?.['graphData']?.['Leadership']}%`,]
  value.datasets[0].data=[indicatorData?.['graphData']?.['Not Initiated'],indicatorData?.['graphData']?.['Launched'],indicatorData?.['graphData']?.['Established'],indicatorData?.['graphData']?.['Leadership']]
  setIndicatorDataForDisplay({...value})
  setIndicatorTableData({rows:members.map((member,index) => [member,
        indicatorData?.['tableData']?.['Not Initiated'].includes(member)? 'Yes' :'--',
        indicatorData?.['tableData']?.['Launched'].includes(member)?'Yes':'--',
      
        indicatorData?.['tableData']?.['Established'].includes(member)?'Yes':'--',
        indicatorData?.['tableData']?.['Leadership'].includes(member)?'Yes':'--',
    ]),indicator:indicatorData?.indicator})
   
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
      padding:'3%'

}}
     >
      <Doughnut
        id='indicatorchart'
            data={indicatorDataForDisplay}
            width={800}
            height={500}  
            options={{responsive:true,maintainAspectRatio: false,...doughnutGraphOptions([indicatorData?.indicator,`Submitted - ${submittedData?.submittedPercent?submittedData?.submittedPercent:0}%, Not Submitted - ${submittedData?.unsubmittedPercent?submittedData?.unsubmittedPercent:0}%`],'top')}}
          />
          </div>}
           <div>
           <TableContainer style={{ maxHeight: 400 }} component={Paper} >
      <Table  aria-label="simple table" style={{position:"relative"}}>
        <TableHead  style={{position:"sticky",top:"0",zIndex:"9999", background:"#fff"}} >
          <TableRow>
          <TableCell style={{background:'rgba(69, 150, 209, 0.1)',opacity:'1'}} >Member Company</TableCell>
            <TableCell style={{background:'rgba(69, 150, 209, 0.1)'}}>Not Initiated</TableCell>
            <TableCell style={{background:'rgba(69, 150, 209, 0.1)'}}>Launched</TableCell>
           
            <TableCell style={{background:'rgba(69, 150, 209, 0.1)'}}>Established</TableCell>
            <TableCell style={{background:'rgba(69, 150, 209, 0.1)'}}>Leadership</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {indicatorData?.['tableData']?.[maxMembers[3]?.name].map((row,index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
             
              <TableCell >{indicatorData?.['tableData']?.['Not Initiated'][index]??'--'}</TableCell>
              <TableCell >{indicatorData?.['tableData']?.['Launched'][index]??"--"}</TableCell>
              <TableCell >{indicatorData?.['tableData']?.['Leadership'][index]??"--"}</TableCell>
              <TableCell >{indicatorData?.['tableData']?.['Established'][index]??"--"}</TableCell>

            </TableRow>
          ))} */}
           {members.length>0?members.map((member,index) => (
            <TableRow
              key={index}
              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
             <TableCell >{member}</TableCell>
              <TableCell >{indicatorData?.['tableData']?.['Not Initiated'].includes(member)?<CheckIcon />:'--'}</TableCell>
              <TableCell >{indicatorData?.['tableData']?.['Launched'].includes(member)?<CheckIcon />:'--'}</TableCell>
              <TableCell >{indicatorData?.['tableData']?.['Established'].includes(member)?<CheckIcon />:'--'}</TableCell>
              <TableCell >{indicatorData?.['tableData']?.['Leadership'].includes(member)?<CheckIcon />:'--'}</TableCell>
              

            </TableRow>
          )):
          <tr>
          <td colSpan="10">
            <div className="no-records-blk">
              <h2 className="heading2">No records available</h2>
            </div>
          </td>
        </tr>
          }
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    </div>
  )
}

export default IndicatorGraph