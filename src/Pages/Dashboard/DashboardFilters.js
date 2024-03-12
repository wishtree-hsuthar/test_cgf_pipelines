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
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import './DashBoardFilter.css'
import { assessmentIndicatorOptions, assessmentOptions, assessmentOptions2, barGraphOptions, indicators, labels, splitSentences } from './DashbaordUtil';
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
function DashboardFilters({setIndicatorData,disableDownload, setBarGraphOptions1,saveAsPdf,setIsAssessmentCountryType,expanded, setExpanded, setMemberCompanies, setDataForBarGraphs, options1, options2, options3, setAccordianTitles, setDoughnutGraphData1, setDoughnutGraphData2, setDoughnutGraphData }) {
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
    getValues,
    control,
    reset,
    setValue,
    trigger,
    watch
  } = useForm({
    defaultValues: {
      type: "",
      assessment: '',
      country: "",
      memberCompanies: '',
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
    setValue('assessment','')
    setValue('country','')
  }

  const handleChangeAssesment = (event) => {
    setValue('assessment', event.target.value);
  };


  function getCryptoRandomValue() {
    // Generate a Uint8Array of 1 element
    const randomValue = window.crypto.getRandomValues(new Uint8Array(1))[0];
    // Scale the value to the 0-255 range
    return Math.floor(randomValue / 256 * 255);
  }
  

  // random color generator
  function getRandomColor() {

    const randomColor = `rgba(${getCryptoRandomValue()}, ${getCryptoRandomValue()}, ${getCryptoRandomValue()}, 0.5)`;
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
      memberCompanies: '',
      endDate: '',
      startDate: '',
    })
    setStartDate(null)
    setEndDate(null)
    setPersonName([]);
    setExpanded(expanded => { return { ...expanded, expandBarGraph: false, expandDoughnutGraph: false,expandFilters:true ,expandDoughnutgraph1:false} })
    setIsAssessmentCountryType(false)
    setIndicatorData({})
    setDataForBarGraphs({
      directlyHired: {
        barGraph: {
          labels: [''],
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
          labels: [''],
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
          labels: [''],
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

  

console.log('data = ',data)
data.memberCompanies=personName.map(member=>member?.id)
setMemberCompanies([...personName])
    // console.log('member company = ', memberCompanyOptions.filter(member => data.memberCompanies.includes(member.id)))
    console.log('member company data = ', data.memberCompanies)
     if(data.assessment==='COUNTRY'){
      data.assessment='COUNTRY- OPERATION HRDD REQUIREMENTS'
     }
     if(data?.assessment==='HEADQUARTER')
     {
      data.assessment='HEADQUARTERS HRDD REQUIREMENTS (ALL OPERATIONS)'
     }
    if (data.type !== 'Indicators') { 
      data.endDate = new Date(new Date().setDate(new Date(data.endDate).getDate() + 1)).toISOString() 
      data.type='SAQ'
    } 
    else {
      data = {
        indicator:data?.indicator,
        assessment:data?.assessment,
        type:data?.type,
        country:data?.country
      }
    }
    setIsAssessmentCountryType(data.assessment==="COUNTRY- OPERATION HRDD REQUIREMENTS")
  
    try {
      const response = await privateAxios.post(DASHBOARD, {
        ...data
      })
      console.log('expanded graph in dashboard filter= ', expanded.expandBarGraph)
      setExpanded(expanded => { return { ...expanded,
        expandBarGraph:true,
        expandBarGraph1:true,
        expandBarGraph2:true,
        expandBarGraph3:true,
        expandDoughnutgraph1:true,
        expandDoughnutgraph2:true,
        expandDoughnutgraph3:true,
        expandDoughnutGraph:true,
        expandCompanySAQGraph:true,
        expandCountrySAQGraph:true,
        expandFilters:false,
        } })

      console.log("Response from dashboard", response.data)
      if (watch('type')==='Workforce Data') {

      
      let maxDirectlyHired=0
      let maxThirdParty=0
      let maxDomesticMigrants=0
      let companies = response?.data?.data.filter(data=>data?.memberName!=='Other').map(data=>data)
      console.log('companies=',companies)
      companies.forEach(company => {
        if (company.directlyHired > maxDirectlyHired) {
    console.log("max directly hired before in foreach",maxDirectlyHired)

            maxDirectlyHired = company.directlyHired;
    console.log("max directly hired after in foreach",maxDirectlyHired)

        }
        if (company.thirdParty > maxThirdParty) {
          maxThirdParty = company.thirdParty;
      }
      if (company.domesticMigrant>maxDomesticMigrants) {
        maxDomesticMigrants=company.domesticMigrant
      }
    });
    
    // change bar width to avoid mess
    let barPercentage=companies.length>30?0.4:companies.length>15&&companies.length<=30?0.5:companies.length<15?0.8:0
    console.log('bar percent',barPercentage)
    console.log('companies - ',companies?.length)
    
    console.log("max directly hired before",maxDirectlyHired)
    
    // Round up the maximum value to the nearest 1000
    maxDirectlyHired = Math.ceil(maxDirectlyHired / 1000) * 1000+10000;
    maxThirdParty = Math.ceil(maxThirdParty / 1000) * 1000+10000;
    maxDomesticMigrants = Math.ceil(maxDomesticMigrants / 1000) * 1000+1000;
    console.log("max directly hired",maxDirectlyHired)



    setBarGraphOptions1({
      barGraphOptions1:barGraphOptions(`Total - ${response?.data?.total?.directlyHired}`,maxDirectlyHired),
      barGraphOptions2:barGraphOptions(`Total - ${response?.data?.total?.thirdParty}`,maxThirdParty),
      barGraphOptions3:barGraphOptions(`Total - ${response?.data?.total?.domesticMigrant}`,maxDomesticMigrants)

    })
     maxDirectlyHired=0
     maxThirdParty=0
     maxDomesticMigrants=0

    // options1.scales.y.suggestedMax=maxDirectlyHired
    // setBarGraphOptions(barGraphOptions)
      let labelsFordoughnutGraph1 = response?.data?.data.sort((a,b)=>{
        let memberA=a?.memberName?.toUpperCase()
        let memberB=b?.memberName?.toUpperCase()
        if (memberA<memberB) {
          return -1
        }
        if (memberA>memberB) {
          return 1
        } 
        return 0
      }).map(data => `${data?.memberName} - ${data?.directlyHiredPercent}%`)
      let labelsFordoughnutGraph2= response?.data?.data.sort((a,b)=>{
        let memberA=a?.memberName?.toUpperCase()
        let memberB=b?.memberName?.toUpperCase()
        if (memberA<memberB) {
          return -1
        }
        if (memberA>memberB) {
          return 1
        } 
        return 0
      }).map(data => `${data?.memberName} - ${data?.thirdPartyPercent}%`)
      let labelsFordoughnutGraph3= response?.data?.data.sort((a,b)=>{
        let memberA=a?.memberName?.toUpperCase()
        let memberB=b?.memberName?.toUpperCase()
        if (memberA<memberB) {
          return -1
        }
        if (memberA>memberB) {
          return 1
        } 
        return 0
      }).map(data => `${data?.memberName} - ${data?.domesticMigrantPercent}%`)
      
      let directHiredPercentData = response?.data?.data.sort((a,b)=>{
        let memberA=a?.memberName?.toUpperCase()
        let memberB=b?.memberName?.toUpperCase()
        if (memberA<memberB) {
          return -1
        }
        if (memberA>memberB) {
          return 1
        } 
        return 0
      }).map(data => data?.directlyHiredPercent)
      let thirdPartyPercentData = response?.data?.data.sort((a,b)=>{
        let memberA=a?.memberName?.toUpperCase()
        let memberB=b?.memberName?.toUpperCase()
        if (memberA<memberB) {
          return -1
        }
        if (memberA>memberB) {
          return 1
        } 
        return 0
      }).map(data => data?.thirdPartyPercent)
      let domesticMigrantsPercentData = response?.data?.data.sort((a,b)=>{
        let memberA=a?.memberName?.toUpperCase()
        let memberB=b?.memberName?.toUpperCase()
        if (memberA<memberB) {
          return -1
        }
        if (memberA>memberB) {
          return 1
        } 
        return 0
      }).map(data => data?.domesticMigrantPercent)
      let bgColors = directHiredPercentData.map(() => getRandomColor())

      // set accordian titles
      setAccordianTitles(title => { return { title1: response?.data.columns[0], title2: response?.data.columns[1], title3: response?.data.columns[2] } })

      // one state for bar graphs
      setDataForBarGraphs((data) => {
        let dataForBarGraphs = { ...data }
        dataForBarGraphs.directlyHired.barGraph.labels=splitSentences(response?.data.columns[0],30)
        dataForBarGraphs.thirdParty.barGraph.labels=splitSentences(response?.data.columns[0],30)
        dataForBarGraphs.domesticMigrants.barGraph.labels=splitSentences(response?.data.columns[0],30)
        
        //dataset for thirdParty
        dataForBarGraphs.thirdParty.barGraph.datasets = response?.data?.data.filter(data => data.memberName != "Other").sort((a,b)=>{
          let memberA=a?.memberName?.toUpperCase()
          let memberB=b?.memberName?.toUpperCase()
          if (memberA<memberB) {
            return -1
          }
          if (memberA>memberB) {
            return 1
          } 
          return 0
        }).map((data) => {
          return {
            label: data.memberName,
            data: [data.thirdParty],
            barPercentage: barPercentage,
            // barThickness: 30,
            // maxBarThickness: 30,
            // minBarLength: 2,
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
        dataForBarGraphs.directlyHired.barGraph.datasets = response?.data?.data.filter(data => data.memberName != "Other").sort((a,b)=>{
          let memberA=a?.memberName?.toUpperCase()
          let memberB=b?.memberName?.toUpperCase()
          if (memberA<memberB) {
            return -1
          }
          if (memberA>memberB) {
            return 1
          } 
          return 0
        }).map((data) => {
          return {
            label: data.memberName,
            data: [data.directlyHired],
            barPercentage: barPercentage,
            // barThickness: 20,
            // maxBarThickness: 20,
            // minBarLength: 2,
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
        dataForBarGraphs.domesticMigrants.barGraph.datasets = response?.data?.data.filter(data => data.memberName != "Other").sort((a,b)=>{
          let memberA=a?.memberName?.toUpperCase()
          let memberB=b?.memberName?.toUpperCase()
          if (memberA<memberB) {
            return -1
          }
          if (memberA>memberB) {
            return 1
          } 
          return 0
        }).map((data) => {
          return {
            label: data.memberName ,
            data: [data.domesticMigrant],
            barPercentage: barPercentage,
            // barThickness: 30,
            // maxBarThickness: 30,
            // minBarLength: 2,
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
        setIndicatorData({})

        return dataForBarGraphs
      })
    } else {
      setIndicatorData({...response.data,indicator:getValues('indicator')})
      setDataForBarGraphs({
        directlyHired: {
          barGraph: {
            labels: [''],
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
            labels: [''],
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
            labels: [''],
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


    } catch (error) {
      console.log("error from submit filter data", error)
    }
    console.log(data)
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    // const value = event.target.value;
    if (value[value.length - 1] === "all") {
     
      setPersonName(personName.length === memberCompanyOptions.length ? [] : memberCompanyOptions);
      setValue('memberCompanies',personName.length === memberCompanyOptions.length ?'':'213123')
     
      return;
    }
    setPersonName(value);



    setValue('memberCompanies','213123')




    // if (value.includes('all')) {
    //   // If 'all' is selected, setPersonName to all companies
    //   setPersonName(memberCompanyOptions);

    //   // Set the memberCompanies to all company ids
    //   let companyIds = memberCompanyOptions.map(data => data.id);
    //   setValue('memberCompanies', companyIds);
    // } else {
    //   // If individual companies are selected
    //   setPersonName(value.filter(item => item !== 'all')); // Remove 'all' if present

    //   // Set the memberCompanies to the selected company ids
    //   let selectedCompanyIds = value.map(data => data.id);
    //   setValue('memberCompanies', selectedCompanyIds);
    // }

    console.log('selected company = ', value);


  };

  

  
  console.log( 'member companies values = ',getValues('memberCompanies') )

  const handleChangeCountry = (e) => {
    setValue('country', e.target.value)

  }

  const getMemberCompanies = async () => {
    try {
      const response = await privateAxios.get(MEMBER_DROPDOWN)
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
                    options={['Workforce Data','Indicators']}
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
                    options={watch('type') === 'Indicators' ? assessmentIndicatorOptions : assessmentOptions2}
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
                  isDisabled={watch('assessment') === 'COUNTRY'?false:watch('assessment')!=='Country Level Operations'?true:false}
                    control={control}
                    myOnChange={handleChangeCountry}
                    name={'country'}
                    options={countryListOption}
                    rules={{ required: watch('assessment')==='COUNTRY' }}
                    myHelper={helperTextForFilters}
                    placeholder="Select country"
                  />
                </div>
              </div>
              {
                watch('type')==='Indicators'&&
              <div className="card-form-field">
                <div className='form-group'>
                  <label>
                    Indicators <span className="mandatory"> *</span>
                  </label>
                  <Dropdown
                    isDisabled={watch('type') === 'Workforce Data'}
                    control={control}
                    name={'indicator'}
                    options={indicators}
                    rules={{ required: watch('type') === 'Indicators' }}
                    myHelper={helperTextForFilters}
                    placeholder="Select indicator"
                  />
                </div>
              </div>
              }
              {
                
                watch('type')==='Workforce Data'&&
                <>
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
                    <FormControl {...field} style={{width:"100%"}}>
                  <Select
                  IconComponent={(props) => (
                    <KeyboardArrowDownRoundedIcon {...props} />
                )}
                  {...field}
                  multiple
                  displayEmpty
                  className='dashboard-select-component'
                     fullWidth
                   
                  value={personName}
                  onChange={handleChange}
                  input={<OutlinedInput {...field} />}
                      renderValue={(selected) => selected?.includes('all') ? 'All Member Companies' :selected?.length<1?'Select member companies': selected?.map((data) => data?.label).join(", ") }
                  MenuProps={MenuProps}
                >
                  <MenuItem key={'all'} value={'all'}>
                    <Checkbox checked={memberCompanyOptions.length>0&&personName.length === memberCompanyOptions.length} />
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
                    disabled={watch('type') === 'Indicators'}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          name="startDate"
                          disableFuture
                          disabled={watch('type') === 'Indicators'}
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
                    disabled={watch('type') === 'Indicators'}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          disabled={watch('type') === 'Indicators'}
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
              </>
              }
            
              <div className="form-btn flex-between add-members-btn">
              <button type="reset"
                      className="secondary-button mr-10" onClick={handleReset}>Reset Filter</button>
  <button type="reset"
 className="secondary-button mr-10" disabled={disableDownload}onClick={()=>saveAsPdf('chart-container')}>Download</button>
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