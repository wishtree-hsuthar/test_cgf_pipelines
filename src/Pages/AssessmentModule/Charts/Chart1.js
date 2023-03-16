import React from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);
const Chart1 = ({ graphResult }) => {
  console.log("graph result:- ", graphResult);
  const labels = [
    "Not Initiated",
    "Launched",
    "Established",
    "Leadership",
    "General Result",
  ];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Pass as Prop(Get from backend or get based on section title) ",
        backgroundColor: "#3498db",
        borderColor: "#3498db",
        data: [
          graphResult["Not Initiated"],
          graphResult["Launched"],
          graphResult["Established"],
          graphResult["Leadership"],
          graphResult["General"],
        ],
        barThickness: 25,
      },
    ],
  };

  return (
    <div style={{ height: "400px" }}>
      <Bar
        data={data}
        options={{
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: 10,
          },
          plugins: {
            datalabels: {
              color: "black",
              formatter: (value) => value + "%",
            },
            tooltip: {
              enabled: false,
            },
          },
          scales: {
            y: {
              grid: {
                display: false,
              },
              alignToPixels: "center",
              align: "start",
            },
            x: {
              grid: {
                display: false,
              },
              min: 0,
              max: 100,
              ticks: {
                stepSize: 10,
                callback: function (value, index, values) {
                  return value + "%";
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Chart1;
