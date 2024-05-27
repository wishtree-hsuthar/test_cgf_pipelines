import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { defaultValue, doughnutGraphOptions } from './DashbaordUtil';
ChartJS.register(ArcElement, Tooltip, Legend);


function CompanySAQDoughnutChart(props) {
  return (

        <Doughnut
          data={props.data}
          width={200}
          height={200}
          options={doughnutGraphOptions('Company\'s Status')}
        />
    
  )
}

export default CompanySAQDoughnutChart