import { Checkbox, FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
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
import { labels } from './DashbaordUtil';
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
function DashboardFilters({ setIsAssessmentCountryType,expanded, setExpanded, setMemberCompanies, setDataForBarGraphs, options1, options2, options3, setAccordianTitles, setDoughnutGraphData1, setDoughnutGraphData2, setDoughnutGraphData }) {
  const [personName, setPersonName] = React.useState([]);
  const [memberCompanyOptions, setMemberCompanyOptions] = useState([])
  const [countryListOption, setCountryListOption] = useState([])
  const helperTextForFilters = {
    type: {
      required: "Select the type",
    },
    assessment: {
      required:"Select the asssessment"
    },
    country:{
      required:"Select the country"
    },
    memberCompanies: {
      required: "Select the member company",
      maxLength:{
        value:12,
        message:"Max 12"
      }
     
    },
    startDate: {
      required: "Select the start date",
      
    },
    endDate: {
      required: "Select the end date",
    },
  };

  const {
    handleSubmit,
    // formState: { errors },
    control,
    reset,
    setValue,
    trigger,
    watch
  } = useForm({
    defaultValues: {
      type: "SAQ",
      assessment: 'HEADQUARTERS HRDD REQUIREMENTS (ALL OPERATIONS)',
      country: "India",
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
  // reset filter 
  const handleReset=()=>{
    reset({
      type: "",
      assessment: '',
      country: "",
      memberCompanies: [],
      endDate: '',
      startDate: '',
    })
    setStartDate(null)
    setEndDate(null)
    setPersonName([]);
    setExpanded(expanded => { return { ...expanded, expandBarGraph: false, expandDoughnutGraph: false,expandFilters:true ,expandDoughnutgraph1:false} })
    setIsAssessmentCountryType(false)
    setDataForBarGraphs({
      directlyHired: {
        barGraph: {
          labels: labels[0],
          datasets: [{
            label: '',
            data: []
          }]
        },
        doughnutGraph: {
          labels: [''],
          datasets: [{
            label: '',
            data: []
          }]
        }
      },
      thirdParty: {
        barGraph: {
          labels: labels[1],
          datasets: [{
            label: '',
            data: []
          }]
        },
        doughnutGraph: {
          labels: [''],
          datasets: [{
            label: '',
            data: []
          }]
        }
  
      },
      domesticMigrants: {
        barGraph: {
          labels: labels[2],
          datasets: [{
            label: '',
            data: []
          }]
  
        },
        doughnutGraph: {
          labels: [''],
          datasets: [{
            label: '',
            data: []
          }]
        }
      }
    })

  }
  const submitFilterData = async (data) => {

    // set member companies for company SAQ status dropdown
    setMemberCompanies(memberCompanyOptions.filter(member => data?.memberCompanies?.includes(member.id)))



    console.log('member company = ', memberCompanyOptions.filter(member => data.memberCompanies.includes(member.id)))
    console.log('member company data = ', data.memberCompanies)

    data.endDate = new Date(new Date().setDate(new Date(data.endDate).getDate() + 1)).toISOString()
    setIsAssessmentCountryType(data.assessment==="COUNTRY- OPERATION HRDD REQUIREMENTS")
    try {
      const response = await privateAxios.post(DASHBOARD, {
        ...data
      })
      console.log('expanded graph in dashboard filter= ', expanded.expandBarGraph)
      setExpanded(expanded => { return { ...expanded, expandBarGraph: !expanded.expandBarGraph,expandBarGraph1: !expanded.expandBarGraph1,expandBarGraph2: !expanded.expandBarGraph2,expandBarGraph3: !expanded.expandBarGraph3, expandDoughnutGraph: !expanded.expandDoughnutGraph,expandFilters:!expanded.expandFilters,expandDoughnutgraph1:!expanded.expandDoughnutgraph1 } })

      console.log("Response from dashboard", response.data)
      // graph titles
      options1.plugins.title.text = `Total - ${response?.data?.total?.directlyHired}`
      options2.plugins.title.text = `Total - ${response?.data?.total?.thirdParty}`
      options3.plugins.title.text = `Total - ${response?.data?.total?.domesticMigrant}`




      let labelsFordoughnutGraph1 = response?.data?.data.map(data => `${data?.memberName}-${data?.directlyHiredPercent}`)
      let labelsFordoughnutGraph2= response?.data?.data.map(data => `${data?.memberName}-${data?.thirdPartyPercent}`)
      let labelsFordoughnutGraph3= response?.data?.data.map(data => `${data?.memberName}-${data?.domesticMigrantPercent}`)
      
      let directHiredPercentData = response?.data?.data.map(data => data?.directlyHiredPercent)
      let thirdPartyPercentData = response?.data?.data.map(data => data?.thirdPartyPercent)
      let domesticMigrantsPercentData = response?.data?.data.map(data => data?.domesticMigrantPercent)
      let bgColors = directHiredPercentData.map(() => getRandomColor())

      // set accordian titles
      setAccordianTitles(title => { return { title1: response?.data.columns[0], title2: response?.data.columns[1], title3: response?.data.columns[2] } })

      // one state for bar graphs
      setDataForBarGraphs((data) => {
        let dataForBarGraphs = { ...data }

        //dataset for thirdParty
        dataForBarGraphs.thirdParty.barGraph.datasets = response?.data?.data.filter(data => data.memberName != "Other").map((data) => {
          return {
            label: data.memberName,
            data: [data.thirdParty],
            barPercentage: 0.9,
            barThickness: 30,
            maxBarThickness: 30,
            minBarLength: 2,
            backgroundColor: getRandomColor(),
          }
        })

        dataForBarGraphs.thirdParty.doughnutGraph.labels = labelsFordoughnutGraph2


        dataForBarGraphs.thirdParty.doughnutGraph.datasets = [{
          // label:data.memberName,
          data: [...thirdPartyPercentData],
          backgroundColor: [...bgColors],
          borderColor: [
            ...bgColors
          ],
          borderWidth: 1,
        }
        ]



        // dataset for directly hired
        dataForBarGraphs.directlyHired.barGraph.datasets = response?.data?.data.filter(data => data.memberName != "Other").map((data) => {
          return {
            label: data.memberName,
            data: [data.directlyHired],
            barPercentage: 0.9,
            barThickness: 30,
            maxBarThickness: 30,
            minBarLength: 2,
            backgroundColor: getRandomColor(),
          }
        })
        dataForBarGraphs.directlyHired.doughnutGraph.labels = labelsFordoughnutGraph1
        dataForBarGraphs.directlyHired.doughnutGraph.datasets = [{
          // label:data.memberName,
          data: [...directHiredPercentData],
          backgroundColor: [...bgColors],
          borderColor: [
            ...bgColors
          ],
          borderWidth: 1,
        }
        ]

        // dataset for domestic migrants
        dataForBarGraphs.domesticMigrants.barGraph.datasets = response?.data?.data.filter(data => data.memberName != "Other").map((data) => {
          return {
            label: data.memberName,
            data: [data.domesticMigrant],
            barPercentage: 0.9,
            barThickness: 30,
            maxBarThickness: 30,
            minBarLength: 2,
            backgroundColor: getRandomColor(),
          }
        })

        dataForBarGraphs.domesticMigrants.doughnutGraph.labels = labelsFordoughnutGraph3
        dataForBarGraphs.domesticMigrants.doughnutGraph.datasets = [{
          // label:data.memberName,
          data: [...domesticMigrantsPercentData],
          backgroundColor: [...bgColors],
          borderColor: [
            ...bgColors
          ],
          borderWidth: 1,
        }
        ]

        console.log('data for bar graphs = ', dataForBarGraphs)

        return dataForBarGraphs
      })

    } catch (error) {
      console.log("error from submit filter data", error)
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
  const handleChangeCountry = (e) => {
    setValue('country', e.target.value)

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
  const getCountryListOptions = async () => {
    try {
      const response = await privateAxios.get(COUNTRIES)
      console.log(response)
      setCountryListOption(response.data.map(data => data.name))
    } catch (error) {
      console.log('error from getCountries API', error)
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
        <div className='card-wrapper' >


          <form onSubmit={handleSubmit(submitFilterData)}>
            <div className='card-blk flex-between'>
              <div className="card-form-field">
                <div className="form-group">

                  <label htmlFor="type">
                    Type <span className="mandatory">*</span>
                  </label>
                  <Dropdown
                    control={control}
                    myOnChange={handleChangeForType}
                    name={'type'}
                    options={['SAQ', 'Indicators']}
                    rules={{ required: true }}
                    myHelper={helperTextForFilters}
                    placeholder="Select type"
                  />

                </div>
              </div>
              <div className="card-form-field">
                <div className="form-group">
                  <label>
                    Assessment <span className="mandatory"> *</span>
                  </label>
                  <Dropdown
                    control={control}
                    myOnChange={handleChangeAssesment}
                    name={'assessment'}
                    options={['COUNTRY- OPERATION HRDD REQUIREMENTS', 'HEADQUARTERS HRDD REQUIREMENTS (ALL OPERATIONS)']}
                    rules={{ required: true }}
                    myHelper={helperTextForFilters}
                    placeholder="Select assessment"

                  />
                </div>
              </div>
              <div className="card-form-field">
                <div className="form-group" >
                  <label>
                    Country <span className="mandatory"> *</span>
                  </label>
                  <Dropdown
                  isDisabled={watch('assessment')!=='COUNTRY- OPERATION HRDD REQUIREMENTS'}
                    control={control}
                    myOnChange={handleChangeCountry}
                    name={'country'}
                    options={countryListOption}
                    rules={{ required: watch('assessment')==='COUNTRY- OPERATION HRDD REQUIREMENTS' }}
                    myHelper={helperTextForFilters}
                    placeholder="Select country"
                  />
                </div>
              </div>
              <div className="card-form-field">
                <div className='form-group'>
                  <label>
                    Member Companies <span className="mandatory"> *</span>
                  </label>
                  <Controller 
                  name={'memberCompanies'}

                  control={control}
                  rules={{required:"Select the member company"}}
                  render={({field,fieldState:{error}})=>(
                    <FormControl {...field}>
                  <Select
                  
                  {...field}
                  multiple
                  displayEmpty
                    fullWidth={true}
                    // fullWidth
                    style={{maxWidth:"300px"}}
                  value={personName}
                  onChange={handleChange}
                  input={<OutlinedInput {...field} />}
                      renderValue={(selected) => selected?.includes('all') ? 'All Member Companies' :selected?.length<1?'Select member companies': selected?.map((data) => data?.label).join(", ") }
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
                <FormHelperText>{error&&error?.message}</FormHelperText>
                </FormControl>
                  )}
                  />
                  
                </div>

              </div>
              <div className='card-form-field'>
                <div className='form-group'>
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
                    name="startDate"

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
                            helperText={
                              error
                                ? helperTextForFilters.startDate[
                                    error.type
                                  ]
                                : " "
                            }
                            />
                          )}
                        // {...field}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </div>
              </div>
              <div className='card-form-field'>
                <div className='form-group'>
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
                            helperText={
                              error
                                ? helperTextForFilters.endDate[
                                    error.type
                                  ]
                                : " "
                            }
                            />
                          )}
                        // {...field}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </div>
              </div>
              <div className="form-btn flex-between add-members-btn">
              <button       type="reset"
                      className="secondary-button mr-10" onClick={handleReset}>Reset Filter</button>

              <button type='submit'  className="primary-button add-button">Search</button>
              </div>
            </div>
          </form>


        </div>

      </section>
    </div>
  )
}

export default DashboardFilters