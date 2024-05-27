import React, { useEffect, useState } from "react";
import { Chart as DoughnutChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { total } from "./MockDataForGraph";
import { defaultValue, doughnutGraphOptions, splitSentences } from "./DashbaordUtil";
import DashboardAccordian from "./DashboardAccordian";
import Annotation from "chartjs-plugin-annotation";
DoughnutChartJS.register(ArcElement, Tooltip, Legend,Annotation);
const titles = [
  [
    "Known directly hired workers in all sites",
    "for prioritised operation in the selected",
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

// function splitSentences(sentence, wordsPerChunk = 15) {
//   // Remove consecutive spaces
//   const cleanedSentence = sentence.replace(/\s{2,}/g, ' ');

//   const words = cleanedSentence.split(' ');

//   const chunks = [];
//   let currentChunk = '';

//   words.forEach((word) => {
//     if (word.trim() !== '') {
//       // Check for non-empty word
//       if (currentChunk.split(' ').length + 1 <= wordsPerChunk) {
//         // Adjust the wordsPerChunk value based on your needs
//         currentChunk += word + ' ';
//       } else {
//         chunks.push(currentChunk.trim());
//         currentChunk = word + ' ';
//       }
//     }
//   });

//   // Add the last chunk
//   if (currentChunk.trim().length > 0) {
//     chunks.push(currentChunk.trim());
//   }

//   return chunks;
// }

// Example usage
// const inputSentence = "This is a sample sentence. It is used for demonstration purposes. Feel free to customize it based on your needs. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

// const result = splitSentences(inputSentence);
// console.log(result);



export default function DoughnutChart(props) {
  const [width, setWidth] = useState(1000)
  const [screenSize, setScreenSize] = useState(1024)
  useEffect(() => {

    console.log('screen size - ', window.innerWidth)

    if (screenSize <= window.innerWidth) {
      console.log('in if screen size - ', window.innerWidth)

      setWidth(500)
      setScreenSize(window.innerWidth)
    }
  }, [screenSize, window.innerWidth])

  console.log('screen size - ', window.innerWidth)
  let t1=[...splitSentences(props.graphTitle.title1, 30),`Submitted - ${props?.submittedData?.submittedPercent?props?.submittedData?.submittedPercent:0}%, Not Submitted - ${props?.submittedData?.unsubmittedPercent?props?.submittedData?.unsubmittedPercent:0}%`]
  let t2=[...splitSentences(props.graphTitle.title2, 30),`Submitted - ${props?.submittedData?.submittedPercent?props?.submittedData?.submittedPercent:0}%, Not Submitted - ${props?.submittedData?.unsubmittedPercent?props?.submittedData?.unsubmittedPercent:0}%`]
  let t3=[...splitSentences(props.graphTitle.title3, 30),`Submitted - ${props?.submittedData?.submittedPercent?props?.submittedData?.submittedPercent:0}%, Not Submitted - ${props?.submittedData?.unsubmittedPercent?props?.submittedData?.unsubmittedPercent:0}%`]

  let title01 = t1
  let title02 = t2
  let title03 = t3

  console.log('title01', title01)
  console.log('props form doughnut chart page = ', props);

  const options1 = doughnutGraphOptions(title01, 'top')
  const options2 = doughnutGraphOptions(title02, 'top')
  const options3 = doughnutGraphOptions(title03, 'top')
  const note=<div style={{fontSize:'x-small',width:'100%'}}>
  <p><b>Note</b> - Companies not represented on the graph either have zero workers in this category or have not submitted their data. Additionally, the data from the submitted companies constitutes 100% of the data represented on the graph.</p>
  </div>
  return (
    <div

      // className="container"
    >
      {/* <div class="html2pdf__page-break"></div> */}

      <DashboardAccordian title={props?.graphTitle?.title1} expanded={props?.expanded?.expandDoughnutgraph1} name={'expandDoughnutgraph1'} setExpanded={props.setExpanded} >
        <div
       
        id="chart4"
        >
            <div style={{ display: "inline-block" }}></div> 
          {note}

          {/* <div className="note">
            <p><b>Note</b> - Companies not represented on the graph either have zero workers in this category or have not submitted their data. Additionally, the data from the submitted companies constitutes 100% of the data represented on the graph.</p>
            </div>   */}

            {/*this div is used to manage resize issue of bar graph*/}
          <div style={{
            height: '500px',
          
          }}>
            <Doughnut
            
              width={1000}
              height={500}
              options={{ responsive: true, maintainAspectRatio: false, ...options1 }}


              data={props?.data}

            />
          </div>
        </div>

      </DashboardAccordian>
      <div class="html2pdf__page-break"></div>

      <DashboardAccordian title={props?.graphTitle?.title2} expanded={props?.expanded?.expandDoughnutgraph2} name={'expandDoughnutgraph2'} setExpanded={props.setExpanded} >
        <div   id="chart5"  >
          <div style={{ display: "inline-block" }}></div>  {/*this div is used to manage resize issue of bar graph*/}
        {note}  
          {/* <div className="note">
            <p><b>Note</b> - Companies that do not appear on the graph is because they have 0 workers in this category or have not submitted their data</p>
            </div>  
             */}
            {/*this div is used to manage resize issue of bar graph*/}

          <div style={{
            height: '500px'
          }}>
            <Doughnut
              data={props.thirdPartyData}
            

              options={{ responsive: true, maintainAspectRatio: false, ...options2 }}
            />
          </div>
        </div>
      </DashboardAccordian>
      <div class="html2pdf__page-break"></div>

      <DashboardAccordian title={props?.graphTitle?.title3} expanded={props?.expanded?.expandDoughnutgraph3} name={'expandDoughnutgraph3'} setExpanded={props.setExpanded} >
        <div  id="chart6">
          <div style={{ display: "inline-block" }}></div>  {/*this div is used to manage resize issue of bar graph*/}
         {note}
          {/* <div className="note">
            <p><b>Note</b> - Companies that do not appear on the graph is because they have 0 workers in this category or have not submitted their data</p>
            </div>  */}
            
             {/*this div is used to manage resize issue of bar graph*/}

          <div style={{
            height: '500px'
          }}>
            <Doughnut
             

              data={props.domesticMigrantsData}
              options={{ responsive: true, maintainAspectRatio: false, ...options3 }}
            />
          </div>
        </div>
      </DashboardAccordian>
    </div>
  )
}
