import React, { useState } from "react";

import { saveAs } from "file-saver";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import DoughnutChart from "./DoughnutChart";
import { MockData } from "./MockDataForGraph";
import DashboardFilters from "./DashboardFilters";
import DashboardAccordian from "./DashboardAccordian";
import CompanySAQStatus from "./CompanySAQStatus";
import CountrySAQStatus from "./CountrySAQStatus";
import { barGraphOptions } from "./DashbaordUtil";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const options1 = barGraphOptions('')
const options2 = barGraphOptions('')
const options3 = barGraphOptions('')

const labels = [
  [
    "Known directly hired workers in all sites for prioritised operation in the selected country who work regularly on the sites. (Launched)",
  ],
  [
    "Known third party workers working in prioritised operation on a regular basis. (Established)",
  ],
  [
    "Known domestic migrant and foreign migrant workers (Number and Locations) (Leadership)",
  ],
];



function CgfDashboard() {
  const [personName, setPersonName] = React.useState([]);
  const [memberCompanies, setMemberCompanies] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [dataForgraph, setDataForgraph] = React.useState({
    // ...data,
  });
  const [accordianTitles, setAccordianTitles] = useState({
    title1: '',
    title2: "",
    title3: ""
  })

  const [dataForBarGraphs, setDataForBarGraphs] = useState({
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

  const [doughnutGraphData, setDoughnutGraphData] = useState();


  const saveCanvas = () => {
    // Original chart canvas
    const chartCanvas = document.getElementById("chart");

    // Create a new canvas for saving
    const saveCanvas = document.createElement("canvas");
    saveCanvas.width = chartCanvas.width;
    saveCanvas.height = chartCanvas.height;
    const saveContext = saveCanvas.getContext("2d");

    // Set white background on the new canvas
    saveContext.fillStyle = "white";
    saveContext.fillRect(0, 0, saveCanvas.width, saveCanvas.height);

    // Copy content from the original chart canvas to the new canvas
    saveContext.drawImage(chartCanvas, 0, 0);

    // Save the new canvas as a blob
    saveCanvas.toBlob((blob) => {
      saveAs(blob, "output.png");
    });
  };
  // random color generator
  function getRandomColor() {
    const getRandomValue = () => Math.floor(Math.random() * 256);
    const randomColor = `rgba(${getRandomValue()}, ${getRandomValue()}, ${getRandomValue()}, 0.5)`;
    return randomColor;
  }
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    console.log("selected company = ", event.target.value);
    // total sum object

    const sumObjectValues = (array) => {
      return array.reduce(
        (accumulator, currentValue) => {
          accumulator.directlyHiredWorkers += currentValue.directlyHiredWorkers;
          accumulator.thirdParty += currentValue.thirdParty;
          accumulator.domesticMigrants += currentValue.domesticMigrants;
          return accumulator;
        },
        { directlyHiredWorkers: 0, thirdParty: 0, domesticMigrants: 0 }
      );
    };
    const total = sumObjectValues(MockData);

    // console.log("new company = ", newComp);
    setDoughnutGraphData(event.target.value);
    setDataForgraph((data) => {
      let graphData = { ...data };
      graphData.datasets = event.target.value.map((data) => {
        return {
          label: data.label,
          data: [
            data.directlyHiredWorkers,
            data.thirdParty,
            data.domesticMigrants,
          ],
          backgroundColor: getRandomColor(),
        };
      });
      graphData.datasets = [
        ...graphData.datasets,
        {
          label: "Total",
          data: [
            total.directlyHiredWorkers,
            total.thirdParty,
            total.domesticMigrants,
          ],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ];
      console.log("new graph data = ", graphData);
      return graphData;
    });

    // data.datasets = personName;
  };
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

  return (
    <div className="page-wrapper">
      <section>
        <div className="container">
          <DashboardAccordian title={'Filters'} defaultExpanded={true}>
            <DashboardFilters setExpanded={setExpanded} setMemberCompanies={setMemberCompanies} setDataForBarGraphs={setDataForBarGraphs} personName={personName} options1={options1} options2={options2} options3={options3} setAccordianTitles={setAccordianTitles} handleChange={handleChange}/>
          </DashboardAccordian>
          {dataForBarGraphs && (
            <DashboardAccordian title={'Bar Graphs'} expanded={expanded}>
              <DashboardAccordian title={accordianTitles.title1} expanded={expanded}>
                <button onClick={saveCanvas}>Download png</button>
                <Bar
                  id="chart"
                  style={{ backgroundColor: "white" }}
                  options={options1}
                  data={dataForBarGraphs?.directlyHired?.barGraph}
                />
              </DashboardAccordian>
              <DashboardAccordian title={accordianTitles.title2} expanded={expanded} >
                <Bar
                  id="chart"
                  style={{ backgroundColor: "white" }}
                  options={options2}
                  data={dataForBarGraphs?.thirdParty?.barGraph}
                />
              </DashboardAccordian>

              <DashboardAccordian title={accordianTitles.title3} expanded={expanded}>
                <Bar
                  id="chart"
                  style={{ backgroundColor: "white" }}
                  options={options3}
                  data={dataForBarGraphs?.domesticMigrants?.barGraph}
                />
              </DashboardAccordian>
            </DashboardAccordian>)}
          {
            dataForBarGraphs?.directlyHired?.doughnutGraph.labels.length >= 1 && <DashboardAccordian expanded={expanded} title={'Doughnut Chart'}>
              <DoughnutChart data={dataForBarGraphs?.directlyHired?.doughnutGraph} thirdPartyData={dataForBarGraphs?.thirdParty?.doughnutGraph} domesticMigrantsData={dataForBarGraphs?.domesticMigrants?.doughnutGraph}/>;

            </DashboardAccordian>
          }

          <DashboardAccordian title={'Company\'s SAQ Status'}>
            <CompanySAQStatus memberCompanies={memberCompanies} />
          </DashboardAccordian>
          <DashboardAccordian title={'Country\'s SAQ Status'}>
            <CountrySAQStatus />
          </DashboardAccordian>

        </div>
      </section>
    </div>
  );
}

export default CgfDashboard;
