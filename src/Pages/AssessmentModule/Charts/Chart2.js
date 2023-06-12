import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);
Chart.register({
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = options.color || "#fff";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
});
const Chart2 = ({ graphLevelBreakdown, chartImages, setChartImages }) => {
  const [val, setVal] = useState(0);
  const chartRef = useRef(null);
  const labels = [
    ["Policy", " Commitment", "& Governance"],
    ["Assess", "Human Rights Potential", " & Actual Impact"],
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
          graphLevelBreakdown["Policy Commitment & Governance"] ?? 0,
          graphLevelBreakdown[
            "Assess Human Rights Potential and Actual Impact"
          ] ?? 0,
          graphLevelBreakdown[
            "Integrate and Act in Order to Prevent and Mitigate"
          ] ?? 0,
          graphLevelBreakdown["Track the Effectiveness of Responses"] ?? 0,
          graphLevelBreakdown["Report"] ?? 0,
          graphLevelBreakdown["Remedy"] ?? 0,
        ],
        barThickness: 50,
      },
    ],
  };
  useEffect(() => {
    console.log("chartImages in chart2:- ", chartRef.current.toBase64Image());
    if (val < 3) {
      setVal((val) => val + 1);
      let temp = { ...chartImages };
      temp.levelBreakdownGraph = chartRef.current.toBase64Image();
      setChartImages(temp);
    }
  }, [val]);
  return (
    <div style={{ height: "400px" }} className="card-wrapper">
      <Bar
        ref={chartRef}
        data={data}
        options={{
          animation: false,
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
                size: 16,
              },
            },
            datalabels: {
              // align: 'top',
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
