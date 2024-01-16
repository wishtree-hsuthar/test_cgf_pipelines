import React, { useEffect, useState } from 'react'
import { privateAxios } from '../../api/axios'
import { COMPANY_SAQ_STATUS, COUNTRIES, COUNTRY_SAQ_STATUS, MEMBER_DROPDOWN } from '../../api/Url'
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


function CountrySAQStatus({memberCompanies}) {
    const [records, setRecords] = useState([])
    console.log("member companies = ",memberCompanies)
    const [selectedCountry, setSelectedCountry] = useState('Select Company')
    const [countryListOption, setCountryListOption] = useState([])
    useEffect(() => {
    getCountryStat()
    getCountryListOptions()
    }, [selectedCountry])
    const getCountryListOptions=async()=>{
        try {
          const response = await privateAxios.get(COUNTRIES)
          console.log(response)
          setCountryListOption(response.data.map(data=>data.name))
        } catch (error) {
          console.log('error from getCountries API',error)
        }
      }
    const getCountryStat=async()=>{
        try {
            const response =await privateAxios.get(COUNTRY_SAQ_STATUS+selectedCountry)
            console.log("response from country saq status = ",response)
            setRecords(response.data)
        } catch (error) {
            console.log("error from country saq",error)
        }
    } 
  
     const data = {
        labels:records.map(data=>data.memberCompany),
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
          {
            label: 'Total',
            data: records.map(record=>record?.total),
            backgroundColor: 'rgb(53, 162, 235)',
          },
        ],
      };
    const dropdown=  <FormControl fullWidth>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={selectedCountry}
      onChange={(e)=>setSelectedCountry(e?.target?.value)}
    >
     {countryListOption.map((data) => (
              <MenuItem key={data} value={data}>
                <ListItemText primary={data} />
              </MenuItem>
            ))}
    </Select>
  </FormControl>
  return (
    <div >
          
        {dropdown}
        <div style={{
               width: '50%',
               padding: '1%'
        }}>
               
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Member Company</TableCell>
            <TableCell align="right">Submitted</TableCell>
            <TableCell align="right">Pending</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row) => (
            <TableRow
              key={row?.memberCompany}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row?.memberCompany}
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
    <div style={{
               width: '50%',
               padding: '1%'
        }}>
            <Bar options={options} data={data} />
            </div>
            
    </div>
  )
}

export default CountrySAQStatus