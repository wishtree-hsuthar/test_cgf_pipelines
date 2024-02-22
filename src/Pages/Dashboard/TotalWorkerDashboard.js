import React, { useEffect, useState } from 'react'
import { defaultValue, doughnutGraphOptions } from './DashbaordUtil'
import DashboardAccordian from "./DashboardAccordian";
import { Doughnut } from "react-chartjs-2";
import { Chart as DoughnutChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { privateAxios } from "../../api/axios";
import { TOTAL_WORKERS } from '../../api/Url';

DoughnutChartJS.register(ArcElement, Tooltip, Legend);
function TotalWorkerDashboard() {
    const TotalWorkerValue={
        labels: ['Directly hired workers',"Third Party workers",],
    
        datasets: [
          {
            // label: "# of Votes",
            data: [],
            backgroundColor: ['red','blue','green'],
            borderColor: [
              ''
            ],
            borderWidth: 1,
          },
        ]
      }
      const DomesticMigrantsvalue={
        labels: ['Domestic Migrants',"Others",],
    
        datasets: [
          {
            // label: "# of Votes",
            data: [],
            backgroundColor: ['Orange','grey'],
            borderColor: [
              ''
            ],
            borderWidth: 1,
          },
        ]
      }

    const [totalWorkerData, setTotalWorkerData] = useState({...TotalWorkerValue})
      const [domesticMigrantData, setDomesticMigrantData] = useState({...DomesticMigrantsvalue})
    useEffect(() => {
      fetchTotalWorkersData()
    

    }, [])
    const [totalWorkers, setTotalWorkers] = useState('')
   const [TotalMigrants,setTotalMigrants] = useState('')
    const fetchTotalWorkersData=async()=>{
        try {
            const response = await privateAxios.get(TOTAL_WORKERS)
            console.log('Response from total workers',response)
            // let totalWorkersData={...defaultValue}
            TotalWorkerValue.datasets[0].data=[response?.data?.graph1?.directlyHiredPercent,response?.data?.graph1?.thirdPartyPercent]   
            DomesticMigrantsvalue.datasets[0].data=[response?.data?.graph2?.domesticMigrantPercent,response?.data?.graph2?.otherPercent]   

            setTotalWorkerData({...TotalWorkerValue})
            setTotalWorkers(`Total Workers - ${response?.data?.graph1?.total}`)
            setTotalMigrants(`Domestic & Foreign Migrant Workers - ${response?.data?.graph2?.domesticMigrantTotal}`)
        } catch (error) {
            console.log('error from fetch total workers',error)
        }
    }
    console.log('totaldata=',totalWorkerData)
  return (
    <div  id={'tchart'}>
      {/* <h6>{totalWorkers}</h6> */}
{
    totalWorkerData?.datasets[0]?.data.length>0&&
    <div style={{
      display:"flex",
      width:"80",
      margin:'auto'
    }}
   
    >
<div style={{
  width:'50%',
  margin:'auto'
}}>
         <div style={{ display: "inline-block" }}></div>  {/*this div is used to manage resize issue of bar graph*/}

<Doughnut
  data={totalWorkerData}
  options={doughnutGraphOptions(totalWorkers,'top')}
  width={200}
  height={200}
/>
</div>

<div style={{
  width:'50%',
  margin:'auto'
}}>
         <div style={{ display: "inline-block" }}></div>  {/*this div is used to manage resize issue of bar graph*/}

<Doughnut
  data={domesticMigrantData}
  options={doughnutGraphOptions(TotalMigrants,'top')}
  width={100}
  height={100}
/>
</div>
</div>
}
    </div>
  )
}

export default TotalWorkerDashboard