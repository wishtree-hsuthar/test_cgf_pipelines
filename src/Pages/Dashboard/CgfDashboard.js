import React, { useState } from "react";

import { saveAs } from "file-saver";
import ChartDataLabels from "chartjs-plugin-datalabels";

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
import { barGraphOptions, labels } from "./DashbaordUtil";
import  html2pdf  from "html2pdf.js";
import "./DashBoardFilter.css"
import TotalWorkerDashboard from "./TotalWorkerDashboard";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);


const options1 = barGraphOptions('')
const options2 = barGraphOptions('')
const options3 = barGraphOptions('')




function CgfDashboard() {
  const [optionsForBarGraph, setOptionsForBarGraph] = useState({
    barGraphOptions1:barGraphOptions(''),
    barGraphOptions2:barGraphOptions(''),
    barGraphOptions3:barGraphOptions(''),
    })
  const [personName, setPersonName] = React.useState([]);
  const [isAssessmentCountryType, setIsAssessmentCountryType] = useState(false)
  const [memberCompanies, setMemberCompanies] = useState([])
  const [expanded, setExpanded] = useState({
    expandFilters:true,
    expandBarGraph:false,
    expandBarGraph1:false,
    expandBarGraph2:false,
    expandBarGraph3:false,
    expandDoughnutgraph1:false,
    expandDoughnutgraph2:false,
    expandDoughnutgraph3:false,
    expandDoughnutGraph:false,
    expandCompanySAQGraph:false,
    expandCountrySAQGraph:false,
    expandTotalWorker:true
  })
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

  const saveAsPdf = (containerId) => {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`Container with ID ${containerId} not found.`);
      return;
    }

    const contentHeight = container.scrollHeight; // Measure the content height dynamically

    const dynamicMargin = calculateDynamicMargin(contentHeight);

    // html2pdf(container, {
    //   margin: [10,5],
    //   filename: 'multiple_charts.pdf',
    //   image: { type: 'jpeg', quality: 1.0 },
    //   html2canvas: { scale: 2 ,width:'1179' },
    //   jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' , autoScale: true},
    // });


    html2pdf(container, {
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      // pagebreak: { avoid: "tr", mode: "css", before: "#nextpage1", after: "1cm" },
      html2canvas: { scale: 2 ,width:'1200'},
      margin: [10,10], 
    }).outputPdf().then((pdf) => {
      // Optional: Adjust image quality and scale
      const options = {
        image: { type: 'jpeg', quality: 1.0 }, // Increase quality if needed
      };

      pdf.output('blob').then((blob) => {
        // Save the PDF blob
        saveAs(blob, 'output.pdf');
      });
    });
  };
  const calculateDynamicMargin = (contentHeight) => {
    // Add your logic to calculate the dynamic margin based on content height
    // You might want to add some extra margin to avoid cutting off content
    return Math.max(contentHeight * 0.01, 10); // Example: 1% of content height or a minimum of 10mm
  }


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
      <section style={{
        margin:'5%'
      }}>
        <div className="container" >
 

          <DashboardAccordian expanded={expanded.expandFilters} name={'expandFilters'} setExpanded={setExpanded} title={'Filters'} defaultExpanded={true}>
            <DashboardFilters setBarGraphOptions1={setOptionsForBarGraph}  setIsAssessmentCountryType={setIsAssessmentCountryType} saveAsPdf={saveAsPdf} expanded={expanded} setExpanded={setExpanded} setMemberCompanies={setMemberCompanies} setDataForBarGraphs={setDataForBarGraphs} personName={personName} options1={options1} options2={options2} options3={options3} setAccordianTitles={setAccordianTitles} handleChange={handleChange}/>
          </DashboardAccordian>
          <div class="html2pdf__page-break"></div>
          <div id="chart-container">
          <DashboardAccordian  expanded={expanded.expandTotalWorker} name={'expandTotalWorker'} setExpanded={setExpanded} title={'Total no of workers across globe'}>
            <TotalWorkerDashboard />
          </DashboardAccordian>
          <div class="html2pdf__page-break"></div>

          {dataForBarGraphs?.directlyHired?.barGraph?.datasets?.length>0 && (
            <>
              <div class="html2pdf__page-break"></div>
            <DashboardAccordian setExpanded={setExpanded} title={'Bar Graphs'} expanded={expanded?.expandBarGraph} name={'expandBarGraph'}>
        
              
              <DashboardAccordian title={accordianTitles.title1} expanded={expanded.expandBarGraph1} name={'expandBarGraph1'} setExpanded={setExpanded}  >
               
                <Bar
                  id="chart"
                  style={{ backgroundColor: "white" }}
                  options={optionsForBarGraph.barGraphOptions1}
                  data={dataForBarGraphs?.directlyHired?.barGraph}
                />
              </DashboardAccordian>
          <div class="html2pdf__page-break"></div>

        
              <DashboardAccordian title={accordianTitles.title2} expanded={expanded.expandBarGraph2} name={'expandBarGraph2'} setExpanded={setExpanded} >
              <div style={{display:"inline-block"}}></div>  {/*this div is used to manage resize issue of bar graph*/}         

       
                <Bar
                  // id="chart"
                  style={{ backgroundColor: "white" }}
                  options={optionsForBarGraph.barGraphOptions2}
                  data={dataForBarGraphs?.thirdParty?.barGraph}
                />
               
              </DashboardAccordian>
              <div class="html2pdf__page-break"></div>
              
              <DashboardAccordian title={accordianTitles.title3} expanded={expanded.expandBarGraph3} name={'expandBarGraph3'} setExpanded={setExpanded} >
                <div style={{display:"inline-block"}}></div>  {/*this div is used to manage resize issue of bar graph*/}             
                <Bar
                  id="chart"
                  style={{ backgroundColor: "white" }}
                  options={optionsForBarGraph.barGraphOptions3}
                  data={dataForBarGraphs?.domesticMigrants?.barGraph}
                />
              </DashboardAccordian>
           

            </DashboardAccordian>
            <div class="html2pdf__page-break"></div>
            </>
            )}
        
          {
            dataForBarGraphs?.directlyHired?.doughnutGraph.labels.length > 1 && 
            <>      
                  <div class="html2pdf__page-break"></div>
            
            <DashboardAccordian  expanded={expanded?.expandDoughnutGraph} name={'expandDoughnutGraph'}  setExpanded={setExpanded} title={'Doughnut Chart'}>
              <DoughnutChart expanded={expanded} setExpanded={setExpanded} graphTitle={accordianTitles}  data={dataForBarGraphs?.directlyHired?.doughnutGraph} thirdPartyData={dataForBarGraphs?.thirdParty?.doughnutGraph} domesticMigrantsData={dataForBarGraphs?.domesticMigrants?.doughnutGraph}/>

            </DashboardAccordian>
            </>

          }
              <div class="html2pdf__page-break"></div>

        { isAssessmentCountryType&&<> <DashboardAccordian expanded={expanded.expandCompanySAQGraph} name={'expandCompanySAQGraph'} setExpanded={setExpanded} title={'Company\'s SAQ Status'}>
            <CompanySAQStatus memberCompanies={memberCompanies} />
          </DashboardAccordian>
          <div class="html2pdf__page-break"></div>

          <DashboardAccordian expanded={expanded.expandCountrySAQGraph} name={'expandCountrySAQGraph'} setExpanded={setExpanded} title={'Country\'s SAQ Status'}>
            <CountrySAQStatus />
          </DashboardAccordian>
         
          </>
          
}</div>

        </div>
      </section>
    </div>
  );
}

export default CgfDashboard;
