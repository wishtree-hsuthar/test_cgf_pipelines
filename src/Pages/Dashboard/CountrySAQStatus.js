import React, { useEffect, useState } from 'react'
import { privateAxios } from '../../api/axios'
import { COUNTRIES, COUNTRY_SAQ_STATUS, } from '../../api/Url'
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
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

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


function CountrySAQStatus({ memberCompanies ,setCountrySAQData}) {
  const [records, setRecords] = useState([])
  console.log("member companies = ", memberCompanies)
  const [selectedCountry, setSelectedCountry] = useState('Select Company')
  const [countryListOption, setCountryListOption] = useState([])
  useEffect(() => {
    getCountryStat()
    getCountryListOptions()
  }, [selectedCountry])
  const getCountryListOptions = async () => {
    try {
      const response = await privateAxios.get(COUNTRIES)
      console.log(response)
      setCountryListOption(response.data.map(data => data.name))
    } catch (error) {
      console.log('error from getCountries API', error)
    }
  }
  const getCountryStat = async () => {
    try {
      const response = await privateAxios.get(COUNTRY_SAQ_STATUS + selectedCountry)
      console.log("response from country saq status = ", response)
      setRecords(response.data)
      let columns = ['memberCompany','submitted','pending','total']

      const getOrderedValues = (obj) => {
        return columns.map(key => obj[key]);
      };
      setCountrySAQData({columns:columns,
        rows:response?.data?.map(row=>getOrderedValues(row)),country:selectedCountry})
    } catch (error) {
      console.log("error from country saq", error)
    }
  }

  const data = {
    labels: records.map(data => data.memberCompany),
    datasets: [
      {
        label: 'Submitted',
        data: records.map(record => record?.submitted),
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Pending',
        data: records.map(record => record?.pending),
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Total',
        data: records.map(record => record?.total),
        backgroundColor: 'rgb(53, 162, 235)',
      },
    ],
  };
  const ITEM_HEIGHT = 42;
  const MenuProps = {
      PaperProps: {
          style: {
              maxHeight: ITEM_HEIGHT * 4,
          },
      },
  };
  const dropdown = <FormControl style={{width:"50%"}}>
    <Select
  IconComponent={(props) => (
    <KeyboardArrowDownRoundedIcon {...props} />
)}
MenuProps={MenuProps}
className='saq-status-dropdown'
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={selectedCountry}
      onChange={(e) => setSelectedCountry(e?.target?.value)}
    >
      {countryListOption.map((data) => (
        <MenuItem key={data} value={data}>
          <ListItemText primary={data} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  return (
    <div className='select-field'>

      {dropdown}
      <div className='saq-status-table-wrapper'>
        <SAQStatsTable type={'Member Company'} records={records} />
      </div>
      <div>
         {/* <Bar options={options} data={data} /> */}
      </div>

    </div>
  )
}

export default CountrySAQStatus