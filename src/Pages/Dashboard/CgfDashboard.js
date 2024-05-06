import React, { useRef, useState } from "react";

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
import 'jspdf-autotable';
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
import IndicatorGraph from './IndicatorGraph'
import {jsPDF} from 'jspdf'
import html2canvas from "html2canvas";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";
// import IndicatorData from './IndicatorGraph '
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
  const [resultType, setResultType] = useState('Workforce Data')
  const [submittedData, setSubmittedData] = useState({})
  const [dashboardReport, setDashboardReport] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "error",
  });
  const [selectedCountry, setSelectedCountry] = useState('')
  const [companySAQData, setCompanySAQData] = useState({
    columns:[],
    rows:[]
  })
  const [countrySAQData, setCountrySAQData] = useState({
    columns:[],
    rows:[]
  })
  const [indicatorTableData, setIndicatorTableData] = useState({
    columns:[],
    rows:[]
  })
  
 const dashboardRef = useRef()
  const [optionsForBarGraph, setOptionsForBarGraph] = useState({
    barGraphOptions1:barGraphOptions(''),
    barGraphOptions2:barGraphOptions(''),
    barGraphOptions3:barGraphOptions(''),
    })
  const [personName, setPersonName] = React.useState([]);
  const [dashboardReportPresent, setDashboardReportPresent] = useState(false)
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
  const [disableDownload, setDisableDownload] = useState(true)

  const [indicatorData, setIndicatorData] = useState({
  })
  const [filteredData, setFilteredData] = useState({

  })
  const [accordianTitles, setAccordianTitles] = useState({
    title1: '',
    title2: "",
    title3: ""
  })
  const [dataForBarGraphs, setDataForBarGraphs] = useState({
    directlyHired: {
      barGraph: {
        labels: [''],
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
        labels: [''],
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
        labels: [''],
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

  const saveChartsAsPDF = async (containerIds) => {
    // Create a new jsPDF instance


    const doc = new jsPDF('landscape', 'mm', 'a4');
    const title = `Filters`;
    console.log('filteredData', filteredData)
    // Add the title
    doc.setFontSize(16);
    doc.text(10, 20, title);

    // Add the table to the PDF
    doc.autoTable(['Filters','Selected Values'],filteredData, {
      startY: 30, theme: "grid", headStyles: {
        fillColor: [69, 150, 209] // RGB color for the header background
      }
    });
   
    doc.addPage()
  
    for (let i = 0; i < containerIds.length; i++) {

      if (containerIds[i] !== 'companySAQ' && containerIds[i] !== 'countrySAQ'&&containerIds[i]!=='indicatorTableChart') {
        const containerId = containerIds[i];
        const container = document.getElementById(containerId);

        if (!container) {
          console.error(`Container with ID ${containerId} not found.`);
          continue;
        }

        // Create a canvas for saving the chart image
        const chartCanvas = document.createElement("canvas");
        chartCanvas.width = container.offsetWidth;
        chartCanvas.height = container.offsetHeight;
        const chartContext = chartCanvas.getContext("2d");

        // Draw the content of the container onto the canvas
        await html2canvas(container).then((canvas) => {
          chartContext.drawImage(canvas, 0, 0, chartCanvas.width, chartCanvas.height);
        });

        // Convert the canvas to a data URL
        const chartDataURL = chartCanvas.toDataURL("image/png", 1.0);

        // Add a new page to the PDF, except for the first iteration
        if (i > 0) {
          doc.addPage();
        }

        // Add the chart image to the PDF using the actual canvas size
        doc.addImage(chartDataURL, 'PNG', 0, 0, doc.internal.pageSize?.getWidth(), doc.internal.pageSize?.getHeight());
        // doc.addPage()
        if (containerId === 'tchart') {
          console.log('tchart it is')
          doc.setFontSize(16);
          doc.text(10, 10, 'Total number of workers across the globe');
        }
      } else if (containerIds[i] === 'companySAQ'&&isAssessmentCountryType) {
        const title = `Company's SAQ Status - ${companySAQData?.company ?? 'No company selected'}`;
        console.log('companySAQData', companySAQData)
        if (i > 0) {
          doc.addPage();
        }
        // Add the title
        doc.setFontSize(16);
        doc.text(10, 20, title);

        // Add the table to the PDF
        doc.autoTable(['Country', 'Submitted', 'Pending', 'Total'], companySAQData.rows.length>0?companySAQData?.rows:[['--','--','--','--']], {
          startY: 30, theme: "grid", headStyles: {
            fillColor: [69, 150, 209] // RGB color for the header background
          }
        });
        // doc.table(5,100,companySAQData?.rows,headers);
      } else if (containerIds[i] === 'countrySAQ'&&isAssessmentCountryType) {
        const title = `Country's SAQ Status - ${countrySAQData?.country.length>0?countrySAQData?.country:'No country selected'}`;

        if (i > 0) {
          doc.addPage();
        }
        // Add the title
        doc.setFontSize(16);
        doc.text(10, 20, title);
        console.log('countrySAQdata', countrySAQData)
        // Add the table to the PDF
        doc.autoTable(['Member Company', 'Submitted', 'Pending', 'Total'], countrySAQData.rows.length>0?countrySAQData.rows:[['--','--','--','--']], {
          startY: 30, theme: "grid", headStyles: {
            fillColor: [69, 150, 209] // RGB color for the header background
          }
        });
        // doc.table(5,100,companySAQData?.rows,headers);
      }
      else if (containerIds[i] === 'indicatorTableChart') {
        const title = `Indicator - ${indicatorTableData?.indicator}`;

        if (i > 0) {
          doc.addPage();
        }
        
        // Add the title
        doc.setFontSize(16);
        doc.text(10, 20, title);
        console.log('indicator table data',indicatorTableData )
        let records = indicatorTableData?.rows.length<1?[['--','--','--','--','--']]:indicatorTableData.rows
        console.log('records --',records)
        // Add the table to the PDF
        doc.autoTable(['Member Company', 'Not Initiated', 'Launched', 'Established','Leadership'], records, {
          startY: 30, theme: "grid", headStyles: {
            fillColor: [69, 150, 209] // RGB color for the header background
          }
        });
        // doc.table(5,100,companySAQData?.rows,headers);
      }
    }
   

    // Store the content of the last page
// const lastPageContent = doc.internal.pages.pop();
// console.log('LAST PAGE CONTENT',lastPageContent)
// // Shift the content of all other pages by one
// for (let i = doc.internal.pages.length - 1; i >= 0; i--) {
//     doc.internal.pages[i + 1] = doc.internal.pages[i];
// }

// // Add the stored content as the first page
// doc.internal.pages[0] = lastPageContent;


    // Save the PDF
    doc.save(`Dashboard-report-${new Date().toLocaleString()}.pdf`);
    setDashboardReport({

      titleMessage: "Hurray!",
      descriptionMessage: 'File downloaded successfully!',
      messageType: "success",
    },
      () => dashboardRef.current()
    )
    setDisableDownload(false)
  };
  
console.log('countrySAQdata',countrySAQData)
  
console.log('companySAQData - ',companySAQData)

  const saveAsPdf = (containerId) => {
    console.log('container id = ',containerId)
    const container = document.getElementById(containerId);
    console.log('container  = ',container)


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

  console.log('DATA IN BAR GRAPH 1 - ',dataForBarGraphs)
console.log('indicator data',indicatorData.graphData)
const note=<p style={{fontSize:'x-small',width:'100%'}}><b>Note</b> - Companies not represented on the graph either have zero workers in this category or have not submitted their data. Additionally, the data from the submitted companies constitutes 100% of the data represented on the graph.</p>

  return (
    <div className="page-wrapper">
      <section style={{
        margin:'5%'
      }}>
          <Toaster
        myRef={dashboardRef}
        titleMessage={dashboardReport.titleMessage}
        descriptionMessage={dashboardReport.descriptionMessage}
        messageType={dashboardReport.messageType}
      />
        <div className="container" >
 

          <DashboardAccordian expanded={expanded.expandFilters} name={'expandFilters'} setExpanded={setExpanded} title={'Filters'} defaultExpanded={true}>
            <DashboardFilters setDashboardReportPresent={setDashboardReportPresent} setSubmittedData={setSubmittedData} dashboardRef={dashboardRef} setDashboardReport={setDashboardReport} setDisableDownload={setDisableDownload} setResultType={setResultType} setSelectedCountry={setSelectedCountry} setFilteredData={setFilteredData} disableDownload={disableDownload} setIndicatorData={setIndicatorData} setBarGraphOptions1={setOptionsForBarGraph}  setIsAssessmentCountryType={setIsAssessmentCountryType} 
            saveAsPdf={()=>{
              setExpanded(expanded => { return { ...expanded,
                expandTotalWorker:true,
                expandBarGraph:true,
                expandBarGraph1:true,
                expandBarGraph2:true,
                expandBarGraph3:true,
                expandDoughnutgraph1:true,
                expandDoughnutgraph2:true,
                expandDoughnutgraph3:true,
                expandDoughnutGraph:true,
                expandCompanySAQGraph:true,
                expandCountrySAQGraph:true
                } })
                setDisableDownload(true)
              setTimeout(()=>saveChartsAsPDF(indicatorData?.graphData?['indicatorchart','indicatorTableChart']:['tchart','chart1','chart2','chart3','chart4','chart5','chart6','companySAQ','countrySAQ']),1000);
             
        }
        } expanded={expanded} setExpanded={setExpanded} setMemberCompanies={setMemberCompanies} setDataForBarGraphs={setDataForBarGraphs} personName={personName} options1={options1} options2={options2} options3={options3} setAccordianTitles={setAccordianTitles} />
          </DashboardAccordian>
          <div class="html2pdf__page-break"></div>
          <div id="chart-container">
         {resultType==='Workforce Data'&& <DashboardAccordian  expanded={expanded.expandTotalWorker} name={'expandTotalWorker'} setExpanded={setExpanded} title={'Total number of workers across the globe'}>
            <TotalWorkerDashboard />
          </DashboardAccordian>
}
        {indicatorData?.graphData&& 
        <>
         <div class="html2pdf__page-break"></div>
         <DashboardAccordian title={'Indicators'} expanded={expanded.expandIndicator} name={'expandIndicator'} setExpanded={setExpanded}  >
               <IndicatorGraph submittedData={submittedData} indicatorData={indicatorData} setIndicatorTableData={setIndicatorTableData} />
             </DashboardAccordian>
             </>
             }
               <div class="html2pdf__page-break"></div>
          {
          // dataForBarGraphs?.directlyHired?.barGraph?.datasets[0]?.label?.length>0 
         (resultType==='Workforce Data'&& dashboardReportPresent)
          && (
            <>
            
          
            <DashboardAccordian setExpanded={setExpanded} title={selectedCountry.length>0?`Disaggregated Data  - (${selectedCountry})`:`Disaggregated Data`} expanded={expanded?.expandBarGraph} name={'expandBarGraph'}>
        
          
              <DashboardAccordian title={accordianTitles.title1} expanded={expanded.expandBarGraph1} name={'expandBarGraph1'} setExpanded={setExpanded}  >
             <div id="chart1">
              <div style={{display:"inline-block"}}>
            {note}
            {/* <p style={{fontSize:'x-small',width:'100%'}}><b>Note</b> - Companies that do not appear on the graph is because they have 0 workers in this category or have not submitted their data</p> */}
                
                </div>  {/*this div is used to manage resize issue of bar graph*/}         
           
                <Bar
                 
                  style={{ backgroundColor: "white" }}
                  options={optionsForBarGraph.barGraphOptions1}
                  data={dataForBarGraphs?.directlyHired?.barGraph}
                />
               </div>
              </DashboardAccordian>
           
              <div class="html2pdf__page-break"></div>
             
              <DashboardAccordian title={accordianTitles.title2} expanded={expanded.expandBarGraph2} name={'expandBarGraph2'} setExpanded={setExpanded} >
              <div class="html2pdf__page-break"></div>
              <div id="chart2">
              <div style={{display:"inline-block"}}>
            {note}

            {/* <p style={{fontSize:'x-small',width:'100%'}}><b>Note</b> - Companies not represented on the graph either have zero workers in this category or have not submitted their data. Additionally, the data from the submitted companies constitutes 100% of the data represented on the graph.</p> */}
                
                </div>  {/*this div is used to manage resize issue of bar graph*/}         

              
                <Bar
                
                  style={{ backgroundColor: "white" }}
                  options={optionsForBarGraph.barGraphOptions2}
                  data={dataForBarGraphs?.thirdParty?.barGraph}
                />
                </div>
              </DashboardAccordian>
              <div class="html2pdf__page-break"></div>
            
          
              <DashboardAccordian title={accordianTitles.title3} expanded={expanded.expandBarGraph3} name={'expandBarGraph3'} setExpanded={setExpanded} >
                <div id="chart3"> 
                <div style={{display:"inline-block"}}>
            {note}

            {/* <p style={{fontSize:'x-small',width:'100%'}}><b>Note</b> - Companies that do not appear on the graph is because they have 0 workers in this category or have not submitted their data</p> */}
                  
                  </div>  {/*this div is used to manage resize issue of bar graph*/}             
                <Bar
              
                  style={{ backgroundColor: "white" }}
                  options={optionsForBarGraph.barGraphOptions3}
                  data={dataForBarGraphs?.domesticMigrants?.barGraph}
                />
                </div>
              <div class="html2pdf__page-break"></div>

              </DashboardAccordian>
             

            </DashboardAccordian>
           
            </>
            )}
        
          {
            // dataForBarGraphs?.directlyHired?.doughnutGraph.labels.length > 1
         (resultType==='Workforce Data'&& dashboardReportPresent)
            
            && 
            <>      
                  <div class="html2pdf__page-break"></div>
            
            <DashboardAccordian  expanded={expanded?.expandDoughnutGraph} name={'expandDoughnutGraph'}  setExpanded={setExpanded} title={selectedCountry.length>0?`Worker Status - (${selectedCountry})`:`Worker Status`}>
              <DoughnutChart submittedData={submittedData} expanded={expanded} setExpanded={setExpanded} graphTitle={accordianTitles}  data={dataForBarGraphs?.directlyHired?.doughnutGraph} thirdPartyData={dataForBarGraphs?.thirdParty?.doughnutGraph} domesticMigrantsData={dataForBarGraphs?.domesticMigrants?.doughnutGraph}/>

            </DashboardAccordian>
            </>

          }
              <div class="html2pdf__page-break"></div>

        { (isAssessmentCountryType&&resultType==='Workforce Data')&&<> <DashboardAccordian expanded={expanded.expandCompanySAQGraph} name={'expandCompanySAQGraph'} setExpanded={setExpanded} title={'Company\'s SAQ Status'}>
            <CompanySAQStatus setCompanySAQData={setCompanySAQData} memberCompanies={memberCompanies} />
          </DashboardAccordian>
          <div class="html2pdf__page-break"></div>

          <DashboardAccordian expanded={expanded.expandCountrySAQGraph} name={'expandCountrySAQGraph'} setExpanded={setExpanded} title={'Country\'s SAQ Status'}>
            <CountrySAQStatus  setCountrySAQData={setCountrySAQData} />
          </DashboardAccordian>
         
          </>
          
}</div>

        </div>
      </section>
    </div>
  );
}

export default CgfDashboard;
