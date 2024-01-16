import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { total } from "./MockDataForGraph";
import { defaultValue, doughnutGraphOptions } from "./DashbaordUtil";

ChartJS.register(ArcElement, Tooltip, Legend);
const titles = [
  [
    "Known directly hired",
    "workers in all sites",
    "for prioritised operation",
    " in the selected",
    "country who work regularly",
    "on the sites. (Launched)",
  ],
  [
    "Known third party",
    "workers working in",
    "prioritised operation on",
    "a regular basis. (Established)",
  ],
  [
    "Known domestic migrant",
    "and foreign migrant",
    "workers (Number and Locations) (Leadership)",
  ],
];

export const options1 = doughnutGraphOptions(titles[0])
export const options2 = doughnutGraphOptions(titles[1])
export const options3 = doughnutGraphOptions(titles[2])

export default function DoughnutChart(props) {
  console.log('props form doughnut chart page = ',props);


  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {" "}
      <div style={{ height: "450px", width: "400px" }}>
        <Doughnut
          data={props?.data}
          width={200}
          height={200}
          options={options1}
        />
      </div>
      <div style={{ height: "450px", width: "400px" }}>
        <Doughnut
          data={props.thirdPartyData}
          width={200}
          height={200}
          options={options2}
        />
      </div>
      <div style={{ height: "450px", width: "400px" }}>
        <Doughnut
          data={props.domesticMigrantsData}
          width={200}
          height={200}
          options={options3}
        />
      </div>
    </div>
  );
}
