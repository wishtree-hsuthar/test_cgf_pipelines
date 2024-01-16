import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MockData } from './MockDataForGraph'
import Dropdown from '../../components/Dropdown';
import { Controller, useForm } from 'react-hook-form';
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from '@mui/x-date-pickers';
import { privateAxios } from '../../api/axios';
import { COUNTRIES, DASHBOARD, MEMBER, MEMBER_DROPDOWN, STATES } from '../../api/Url';
import { data } from './CgfDashboard';

import './DashBoardFilter.css'
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function DashboardFilters({setExpanded,setMemberCompanies,setDataForBarGraphs,options1,options2,options3, setAccordianTitles,setDoughnutGraphData1,setDoughnutGraphData2,setDoughnutGraphData}) {
  const [personName, setPersonName] = React.useState([]);
  const [memberCompanyOptions, setMemberCompanyOptions] = useState([])
const [countryListOption, setCountryListOption] = useState([])

  const {
    handleSubmit,
    // formState: { errors },
    control,
    reset,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      type: "SAQ",
      assessment: 'HEADQUARTERS HRDD REQUIREMENTS (ALL OPERATIONS)',
      country:"India",
      memberCompanies: [],
      endDate: '',
      startDate: '',

    },
  });
  const [type, setType] = useState('')
  const [endDate, setEndDate] = useState(null)
  const [startDate, setStartDate] = useState(
    null
  )
  const handleChangeForType = (e) => {
    setType(prev => e.target.value)
    setValue('type', e.target.value)
  }

  const handleChangeAssesment = (event) => {
    setValue('assessment', event.target.value);
  };

  const handleChangeMemberCompanies = (event) => {
    let companies = event.target.value
    setValue('memberCompanies', companies)
  }


  // random color generator
  function getRandomColor() {
    const getRandomValue = () => Math.floor(Math.random() * 256);
    const randomColor = `rgba(${getRandomValue()}, ${getRandomValue()}, ${getRandomValue()}, 0.5)`;
    return randomColor;
  }

  //method to prevent typing on date field
  const handleOnKeyDownChange = (e) => {
    e.preventDefault();
  };
  const submitFilterData = async (data) => {

    // set member companies for company SAQ status dropdown
    setMemberCompanies(memberCompanyOptions.filter(member=>data.memberCompanies.includes(member.id)) )



    console.log('member company = ',memberCompanyOptions.filter(member=>data.memberCompanies.includes(member.id)))
    console.log('member company data = ',data.memberCompanies)

    data.endDate=new Date(new Date().setDate(new Date(data.endDate).getDate()+1)).toISOString()
    try {
      const response = await privateAxios.post(DASHBOARD, {
        ...data
      })
      setExpanded(true)

      console.log("Response from dashboard", response.data)
      // graph titles
      options1.plugins.title.text=`Total - ${response?.data?.total?.directlyHired}`
      options2.plugins.title.text=`Total - ${response?.data?.total?.thirdParty}`
      options3.plugins.title.text=`Total - ${response?.data?.total?.domesticMigrant}`

      


      let labelsFordoughnutGraph = response?.data?.data.map(data=>data?.memberName)
      let directHiredPercentData = response?.data?.data.map(data=>data?.directlyHiredPercent)
      let thirdPartyPercentData=response?.data?.data.map(data=>data?.thirdPartyPercent)
      let domesticMigrantsPercentData=response?.data?.data.map(data=>data?.domesticMigrantPercent)
      let bgColors=directHiredPercentData.map(()=>getRandomColor())
      
      // set accordian titles
      setAccordianTitles(title=> {return {title1:response?.data.columns[0],title2:response?.data.columns[1],title3  :response?.data.columns[2]}})
      
      // one state for bar graphs
      setDataForBarGraphs((data)=>{
        let dataForBarGraphs={...data}

        //dataset for thirdParty
        dataForBarGraphs.thirdParty.barGraph.datasets=response?.data?.data.filter(data=>data.memberName!="Other").map((data)=>{
          return {
            label:data.memberName,
          data:[data.thirdParty],
          barPercentage: 0.9,
            barThickness: 30,
            maxBarThickness: 30,
            minBarLength: 2,
            backgroundColor: getRandomColor(),
          }
        })

        dataForBarGraphs.thirdParty.doughnutGraph.labels=labelsFordoughnutGraph


        dataForBarGraphs.thirdParty.doughnutGraph.datasets=[{
          // label:data.memberName,
        data:[...thirdPartyPercentData],
        backgroundColor: [...bgColors],
          borderColor: [
            ...bgColors
          ],
          borderWidth: 1,
        }
      ]



        // dataset for directly hired
        dataForBarGraphs.directlyHired.barGraph.datasets=response?.data?.data.filter(data=>data.memberName!="Other").map((data)=>{
          return { 
            label:data.memberName,
          data:[data.directlyHired],
          barPercentage: 0.9,
            barThickness: 30,
            maxBarThickness: 30,
            minBarLength: 2,
            backgroundColor: getRandomColor(),
          }
        })
        dataForBarGraphs.directlyHired.doughnutGraph.labels=labelsFordoughnutGraph
        dataForBarGraphs.directlyHired.doughnutGraph.datasets=[{
            // label:data.memberName,
          data:[...directHiredPercentData],
          backgroundColor: [...bgColors],
            borderColor: [
              ...bgColors
            ],
            borderWidth: 1,
          }
        ]

         // dataset for domestic migrants
         dataForBarGraphs.domesticMigrants.barGraph.datasets=response?.data?.data.filter(data=>data.memberName!="Other").map((data)=>{
          return { 
            label:data.memberName,
          data:[data.domesticMigrant],
          barPercentage: 0.9,
            barThickness: 30,
            maxBarThickness: 30,
            minBarLength: 2,
            backgroundColor: getRandomColor(),
          }
        })

        dataForBarGraphs.domesticMigrants.doughnutGraph.labels=labelsFordoughnutGraph
        dataForBarGraphs.domesticMigrants.doughnutGraph.datasets=[{
          // label:data.memberName,
        data:[...domesticMigrantsPercentData],
        backgroundColor: [...bgColors],
          borderColor: [
            ...bgColors
          ],
          borderWidth: 1,
        }
      ]

        console.log('data for bar graphs = ',dataForBarGraphs)

        return dataForBarGraphs
      })
    
    } catch (error) {
      console.log("error from submit filter data",error)
    }
    console.log(data)
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (value.includes('all')) {
      // If 'all' is selected, setPersonName to all companies
      setPersonName(memberCompanyOptions);

      // Set the memberCompanies to all company ids
      let companyIds = memberCompanyOptions.map(data => data.id);
      setValue('memberCompanies', companyIds);
    } else {
      // If individual companies are selected
      setPersonName(value.filter(item => item !== 'all')); // Remove 'all' if present

      // Set the memberCompanies to the selected company ids
      let selectedCompanyIds = value.map(data => data.id);
      setValue('memberCompanies', selectedCompanyIds);
    }

    console.log('selected company = ', value);


  };
  const handleChangeCountry=(e)=>{
    setValue('country',e.target.value)
  
  }

  const getMemberCompanies = async () => {
    try {
      const response = await privateAxios.get(MEMBER_DROPDOWN)
      console.log(response)
      setMemberCompanyOptions(response.data.map(data => ({ id: data._id, label: data.companyName })))
    } catch (error) {
      console.log("error from getMemberCompanies from data filtres", error)

    }
  }
  const getCountryListOptions=async()=>{
    try {
      const response = await privateAxios.get(COUNTRIES)
      console.log(response)
      setCountryListOption(response.data.map(data=>data.name))
    } catch (error) {
      console.log('error from getCountries API',error)
    }
  }
  useEffect(() => {
    getMemberCompanies()
    getCountryListOptions()
  }, [])
  console.log('option list = ', memberCompanyOptions)

  return (
    <div className="page-wrapper">

      <section>
        <div  >
      

              <form onSubmit={handleSubmit(submitFilterData)}>
                <div className='filter-container'>
                  <div className='filter-container-item'>
                    <FormControl fullWidth >
                      <label>
                        Type <span className="mandatory"> *</span>
                      </label>
                      <Dropdown
                        control={control}
                        myOnChange={handleChangeForType}
                        name={'type'}
                        options={['SAQ', 'Indicators']}
                        rules={{ require: false }}
                      />
                    </FormControl>
                  </div>
                  <div className='filter-container-item'>
                    <FormControl fullWidth >
                      <label>
                        Assessment <span className="mandatory"> *</span>
                      </label>
                      <Dropdown
                        control={control}
                        myOnChange={handleChangeAssesment}
                        name={'assessment'}
                        options={['COUNTRY- OPERATION HRDD REQUIREMENTS', 'HEADQUARTERS HRDD REQUIREMENTS (ALL OPERATIONS)']}
                        rules={{ require: false }}
                      />
                    </FormControl>
                  </div>
                  <div className='filter-container-item'>
                    <FormControl fullWidth >
                      <label>
                        Country <span className="mandatory"> *</span>
                      </label>
                      <Dropdown
                        control={control}
                        myOnChange={handleChangeCountry}
                        name={'country'}
                        options={countryListOption}
                        rules={{ require: false }}
                      />
                    </FormControl>
                  </div>
                  <div className='filter-container-item'>
                    <FormControl fullWidth>
                      <label>
                        Member Companies <span className="mandatory"> *</span>
                      </label>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        name='memberCompanies'
                        value={personName}
                        onChange={handleChange}
                        input={<OutlinedInput />}
                        renderValue={(selected) =>
                          selected.includes('all') ? 'All Member Companies' : selected.map((data) => data.label).join(", ")
                        }
                        MenuProps={MenuProps}
                      >
                        <MenuItem key={'all'} value={'all'}>
                          {/* <Checkbox checked={personName.length === memberCompanyOptions.length} /> */}
                          <ListItemText primary={'Select All'} />
                        </MenuItem>
                        {memberCompanyOptions.map((data) => (
                          <MenuItem key={data.label} value={data}>
                            <Checkbox checked={personName.includes('all') || personName.includes(data)} />
                            <ListItemText primary={data.label} />
                          </MenuItem>
                        ))}
                      </Select>

                    </FormControl>
                  </div>
                  <div className='filter-container-item'>
                    <FormControl fullWidth >
                      <label>
                        Start Date <span className="mandatory"> *</span>
                      </label>

                      <Controller
                        name="startDate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState: { error } }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              componentsProps={{
                                actionBar: {
                                  actions: ['clear',]
                                },
                              }}
                              className="datepicker-blk"
                              // value={datevalue}
                              components={{
                                OpenPickerIcon: DateRangeOutlinedIcon,
                              }}
                              // inputFormat={
                              //     "MM/DD/YYYY"
                              // }
                              value={startDate}
                              onChange={(event = "") => {
                                setStartDate(event);
                                setValue(
                                  "startDate",

                                  event?.toISOString()
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  autoComplete="off"
                                  {...params}
                                  className={` input-field ${error && "input-error"
                                    }`}
                                  onKeyDown={handleOnKeyDownChange}
                                  placeholder="MM/DD/YYYY"
                                  error
                                // helperText={
                                //   error
                                //     ? helperTextForAssessment.dueDate[
                                //         error.type
                                //       ]
                                //     : " "
                                // }
                                />
                              )}
                            // {...field}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className='filter-container-item'>
                    <FormControl fullWidth >
                      <label>
                        End Date <span className="mandatory"> *</span>
                      </label>

                      <Controller
                        name="endDate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState: { error } }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker

                              componentsProps={{
                                actionBar: {
                                  actions: ['clear',]
                                },
                              }}
                              className="datepicker-blk"
                              // value={datevalue}
                              components={{
                                OpenPickerIcon: DateRangeOutlinedIcon,
                              }}

                              value={endDate}
                              disableFuture

                              onChange={(event = "") => {
                                setEndDate(event);
                                setValue(
                                  "endDate",

                                  event?.toISOString()
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  autoComplete="off"
                                  {...params}
                                  className={` input-field ${error && "input-error"
                                    }`}
                                  onKeyDown={handleOnKeyDownChange}
                                  placeholder="MM/DD/YYYY"
                                  error
                                // helperText={
                                //   error
                                //     ? helperTextForAssessment.dueDate[
                                //         error.type
                                //       ]
                                //     : " "
                                // }
                                />
                              )}
                            // {...field}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </FormControl>
                  </div>
                  <button type='submit'>Search</button>
                </div>
              </form>


          </div>
       
      </section>
    </div>
  )
}

export default DashboardFilters