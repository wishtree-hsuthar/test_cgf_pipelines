import React from "react";
import Chart2 from "./Chart2.js";
import Chart1 from "./Chart1.js";

const Charts = ({graphResult,graphLevelBreakdown, questionnaireTitle}) => {
  console.log("inside charts")
  return (
    <>
      {/* <Statistics /> */}
      <Chart1 graphResult={graphResult } questionnaireTitle={questionnaireTitle}/>
      <Chart2 graphLevelBreakdown={graphLevelBreakdown}/>
    </>
  );
};

export default Charts;
