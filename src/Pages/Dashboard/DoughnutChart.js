import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { total } from "./MockDataForGraph";

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

export const options1 = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        // This more specific font property overrides the global property
        font: {
          size: 10,
        },
      },
    },

    title: {
      display: true,
      text: titles[0],
      font: {
        size: 12,
      },
    },
  },
};
export const options2 = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        // This more specific font property overrides the global property
        font: {
          size: 10,
        },
      },
    },

    title: {
      display: true,
      text: titles[1],
      font: {
        size: 12,
      },
    },
  },
};
export const options3 = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        // This more specific font property overrides the global property
        font: {
          size: 10,
        },
      },
    },

    title: {
      display: true,
      text: titles[2],
      font: {
        size: 12,
      },
    },
  },
};

export default function DoughnutChart(props) {
  console.log(props);
  let labelsFordoughnutGraph1 = props.data
    ? props.data.map((d) => d.label)
    : [""];
  let labelsFordoughnutGraph2 = props.data
    ? props.data.map((d) => d.label)
    : [""];
  let labelsFordoughnutGraph3 = props.data
    ? props.data.map((d) => d.label)
    : [""];
  let directHiredPercent = props.data
    ? props.data.map(
        (d) => (d.directlyHiredWorkers / total.directlyHiredWorkers) * 100
      )
    : [0];
  let thirdPartyPercent = props.data
    ? props.data.map((d) => (d.thirdParty / total.thirdParty) * 100)
    : [0];
  let domesticMigrantsPercent = props.data
    ? props.data.map((d) => (d.domesticMigrants / total.domesticMigrants) * 100)
    : [0];
  let otherPercent = props.data
    ? props.data.reduce(
        (accumulator, currentValue) => {
          accumulator.otherdirectlyHiredWorkers +=
            (currentValue.directlyHiredWorkers / total.directlyHiredWorkers) *
            100;
          accumulator.otherThirdParty +=
            (currentValue.thirdParty / total.thirdParty) * 100;
          accumulator.otherDomesticMigrants +=
            (currentValue.domesticMigrants / total.domesticMigrants) * 100;
          return accumulator;
        },
        {
          otherdirectlyHiredWorkers: 0,
          otherThirdParty: 0,
          otherDomesticMigrants: 0,
        }
      )
    : [0];
  directHiredPercent = [
    ...directHiredPercent,
    100 - otherPercent.otherdirectlyHiredWorkers,
  ];
  thirdPartyPercent = [
    ...thirdPartyPercent,
    100 - otherPercent.otherThirdParty,
  ];
  domesticMigrantsPercent = [
    ...domesticMigrantsPercent,
    100 - otherPercent.otherDomesticMigrants,
  ];
  const dataForgraph = {
    labels: [...labelsFordoughnutGraph1, "other"],

    datasets: [
      {
        // label: "# of Votes",
        data: directHiredPercent,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const dataForgraph2 = {
    labels: [...labelsFordoughnutGraph2, "other"],

    datasets: [
      {
        // label: "# of Votes",
        data: thirdPartyPercent,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const dataForgraph3 = {
    labels: [...labelsFordoughnutGraph3, "other"],
    datasets: [
      {
        // label: "# of Votes",
        data: domesticMigrantsPercent,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {" "}
      <div style={{ height: "450px", width: "400px" }}>
        <Doughnut
          data={dataForgraph}
          width={200}
          height={200}
          options={options1}
        />
      </div>
      <div style={{ height: "450px", width: "400px" }}>
        <Doughnut
          data={dataForgraph2}
          width={200}
          height={200}
          options={options2}
        />
      </div>
      <div style={{ height: "450px", width: "400px" }}>
        <Doughnut
          data={dataForgraph3}
          width={200}
          height={200}
          options={options3}
        />
      </div>
    </div>
  );
}
