import React, { useEffect } from "react";
import { Chart as DoughnutChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { total } from "./MockDataForGraph";
import { defaultValue, doughnutGraphOptions } from "./DashbaordUtil";
import DashboardAccordian from "./DashboardAccordian";

DoughnutChartJS.register(ArcElement, Tooltip, Legend);
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

function splitSentences(sentence, wordsPerChunk = 15) {
  // Remove consecutive spaces
  const cleanedSentence = sentence.replace(/\s{2,}/g, ' ');

  const words = cleanedSentence.split(' ');

  const chunks = [];
  let currentChunk = '';

  words.forEach((word) => {
    if (word.trim() !== '') {
      // Check for non-empty word
      if (currentChunk.split(' ').length + 1 <= wordsPerChunk) {
        // Adjust the wordsPerChunk value based on your needs
        currentChunk += word + ' ';
      } else {
        chunks.push(currentChunk.trim());
        currentChunk = word + ' ';
      }
    }
  });

  // Add the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Example usage
const inputSentence = "This is a sample sentence. It is used for demonstration purposes. Feel free to customize it based on your needs. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const result = splitSentences(inputSentence);
console.log(result);



export default function DoughnutChart(props) {

  let title01 = splitSentences(props.graphTitle.title1, 9)
  let title02 = splitSentences(props.graphTitle.title2, 9)
  let title03 = splitSentences(props.graphTitle.title3, 9)

  console.log('title01', title01)
  console.log('props form doughnut chart page = ', props);

  const options1 = doughnutGraphOptions(title01)
  const options2 = doughnutGraphOptions(title02)
  const options3 = doughnutGraphOptions(title03)
  return (
    <div
      // style={{
      //   display: "flex",
      //   flexDirection:"column",
      //   alignItems:"center"
      // }}
      className="container"
    >
      {" "}

      <DashboardAccordian title={title01} expanded={props?.expanded?.expandDoughnutgraph1} name={'expandDoughnutgraph1'} setExpanded={props.setExpanded} >
        <div style={{
          // width:"60%"
          // padding:'10%'
        }}>
          <div style={{ display: "inline-block" }}></div>  {/*this div is used to manage resize issue of bar graph*/}

          <Doughnut
            data={props?.data}
            options={options1}
          />
        </div>

      </DashboardAccordian>



      <DashboardAccordian title={title02} expanded={props?.expanded?.expandDoughnutgraph2} name={'expandDoughnutgraph2'} setExpanded={props.setExpanded} >
        <div style={{

        }}>
          <div style={{ display: "inline-block" }}></div>  {/*this div is used to manage resize issue of bar graph*/}

          <Doughnut
            data={props.thirdPartyData}

            options={options2}
          />
        </div>
      </DashboardAccordian>
      <DashboardAccordian title={title03} expanded={props?.expanded?.expandDoughnutgraph3} name={'expandDoughnutgraph3'} setExpanded={props.setExpanded} >
        <div style={{

        }}>
          <div style={{ display: "inline-block" }}></div>  {/*this div is used to manage resize issue of bar graph*/}

          <Doughnut
            data={props.domesticMigrantsData}

            options={options3}
          />
        </div>
      </DashboardAccordian>
    </div>
  );
}
