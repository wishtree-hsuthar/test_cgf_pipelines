import React, { useEffect, useState } from 'react'
import { privateAxios } from '../../api/axios'
import { COMPANY_SAQ_STATUS, MEMBER_DROPDOWN } from '../../api/Url'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// import { FormControl, MenuItem, Select } from '@mui/base';
import { ListItemText, OutlinedInput } from '@mui/material';
import CompanySAQDoughnutChart from './CompanySAQDoughnutChart';
import SAQStatsTable from './SAQStatsTable';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  export const options = {
    plugins: {
      title: {
        display: true,
        text: 'Company\'s SAQ Status',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };


function CompanySAQStatus({memberCompanies}) {
    const [records, setRecords] = useState([])
    console.log("member companies = ",memberCompanies)
    const [memberCompaniesOption, setMemberCompaniesOption] = useState(memberCompanies)
    const [selectedMemberCompany, setSelectedMemberCompany] = useState('Select Company')
    const [pieChart, setPieChart] = useState()
    useEffect(() => {
    getCountryStat()
    }, [selectedMemberCompany])
    const getCountryStat=async()=>{
        try {
            const response =await privateAxios.get(COMPANY_SAQ_STATUS+selectedMemberCompany)
            console.log("response from company saq status = ",response)
            setRecords(response.data.barGraph)
            setPieChart(response.data.pieChart)
        } catch (error) {
            console.log("error from company saq",error)
        }
    } 
  //  bar graph data
  console.log('piechart = ',pieChart)
     const data = {
        labels:records.map(data=>data.country),
        datasets: [
          {
            label: 'Submitted',
            data:records.map(record=>record?.submitted) ,
            backgroundColor: 'rgb(255, 99, 132)',
          },
          {
            label: 'Pending',
            data: records.map(record=>record?.pending),
            backgroundColor: 'rgb(75, 192, 192)',
          },
        
        ],
      };

      // doughnut chart
      const doughnutChartData={
        labels: pieChart?.columns,
    
        datasets: [
          {
            // label: "# of Votes",
            data: [pieChart?.data?.directlyHiredPercent,pieChart?.data?.thirdPartyPercent,pieChart?.data?.domesticMigrantPercent],
            backgroundColor: ['red','blue','green'],
            borderColor: [
              ''
            ],
            borderWidth: 1,
          },
        ]
      }
    const dropdown=  <FormControl fullWidth>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={selectedMemberCompany}
      onChange={(e)=>setSelectedMemberCompany(e?.target?.value)}
    >
     {memberCompanies.map((data) => (
              <MenuItem key={data.label} value={data.id}>
                <ListItemText primary={data.label} />
              </MenuItem>
            ))}
    </Select>
  </FormControl>
  return (
    <div >
          
        {dropdown}
        <div >
               
       
    <SAQStatsTable type={'Country'} records={records}/>

    </div>
    <div >
            {/* <Bar options={options} data={data} /> */}
            </div>
            <div >
            {/* <CompanySAQDoughnutChart data={doughnutChartData} /> */}
            </div>
            
    </div>
  )
}

export default CompanySAQStatus