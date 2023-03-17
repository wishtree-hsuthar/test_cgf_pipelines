import React from "react";
import { Bar } from "react-chartjs-2";

const Chart2 = ({ graphLevelBreakdown }) => {
  const labels = [
    ["Policy", " Commitment", "& Governance"],
    ["Assess", "Human Rights Potential", " & Actual Impacts"],
    ["Integrate", "& Act in Order to Prevent", "& Mitigate"],
    ["Track the", "Effectiveness of Responses"],
    "Report",
    "Remedy",
  ];
  const data = {
    labels: labels,
    datasets: [
      {
        // label: "HRDD Step Level Breakdown",
        backgroundColor: "#f7a823",
        borderColor: "#f7a823",
        // inflateAmount: "auto",
        data: [
          graphLevelBreakdown["Policy Commitment & Governance"],
          graphLevelBreakdown[
            "Assess Human Rights Potential and Actual Impacts"
          ],
          graphLevelBreakdown[
            "Integrate and Act in Order to Prevent and Mitigate"
          ],
          graphLevelBreakdown["Track the Effectiveness of Responses"],
          graphLevelBreakdown["Report"],
          graphLevelBreakdown["Remedy"],
        ],
        barThickness: 50,
      },
    ],
  };

  return (
    <div style={{ height: "400px" }} className="card-wrapper">
      <Bar
        data={data}
        options={{
          //   categoryPercentage: 1,
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            // padding: 10,
          },

          plugins: {
            legend: {
              display: false,
            },
            title: {
              text: "HRDD Step Level Breakdown",
              display: true,
              font: {
                weight: "bold",
                size: 16
              },
            },
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
              min: 0,
              max: 100,
              ticks: {
                stepSize: 10,
                // padding: 20,
                callback: function (value, index, values) {
                  return value + "%";
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              alignToPixels: "center",
              align: "start",
            },
          },
        }}
      />
    </div>
  );
};

export default Chart2;
