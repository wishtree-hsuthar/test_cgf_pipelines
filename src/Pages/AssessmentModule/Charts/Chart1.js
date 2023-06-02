import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
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
const Chart1 = ({
  graphResult,
  questionnaireTitle,
  chartImages,
  setChartImages,
}) => {
  const chartRef = useRef(null);
  
  const labels = [
    "Not Initiated",
    "Launched",
    "Established",
    "Leadership",
    "General Result",
  ];
  const getChartLabel = () => {
    switch (questionnaireTitle) {
      case "HEADQUARTERS HRDD REQUIREMENTS (ALL OPERATIONS)":
        return "HRDD HQ Level Result";
      case "GLOBAL OPERATION HRDD REQUIREMENTS (SELECTED OPERATION)":
        return "Global Operation HRDD Result";
      case "COUNTRY- OPERATION HRDD REQUIREMENTS":
        return "Country Operation HRDD Result";
      default:
        return "HRDD Result";
    }
  };
  const data = {
    labels: labels,
    datasets: [
      {
        label: getChartLabel(),
        backgroundColor: "#3498db",
        borderColor: "#3498db",
        data: [
          graphResult["Not Initiated"] ?? 0,
          graphResult["Launched"] ?? 0,
          graphResult["Established"] ?? 0,
          graphResult["Leadership"] ?? 0,
          graphResult["General"] ?? 0,
        ],
        barThickness: 25,
      },
    ],
  };
  useEffect(() => {
    console.log("chartImages in chart1:- ", chartImages.resultsGraph);
    if (chartImages.resultsGraph === undefined) {
      console.log("inside condition");
      let temp = { ...chartImages };
      temp.resultsGraph = chartRef.current.toBase64Image();
      setChartImages(temp);
    }
  });

  return (
    <div style={{ height: "400px" }} className="preview-card-wrapper">
      <Bar
        ref={chartRef}
        data={data}
        options={{
          animation: false,
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: 10,
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              text: getChartLabel(),
              display: true,
              font: {
                weight: "bold",
                size: 16,
              },
            },
            datalabels: {
              color: "black",
              formatter: (value) =>  "    "+ value + "%",
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
