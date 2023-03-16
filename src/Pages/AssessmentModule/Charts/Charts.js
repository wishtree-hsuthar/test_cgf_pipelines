import React from "react";
import Chart from "chart.js/auto";
import Statistics from "./Statistics.js";
import Chart2 from "./Chart2.js";
import Chart1 from "./Chart1.js";

const Charts = ({graphResult,graphLevelBreakdown}) => {
  return (
    <>
      {/* <Statistics /> */}
      <Chart1 graphResult={graphResult}/>
      <Chart2 graphLevelBreakdown={graphLevelBreakdown}/>
    </>
  );
};

export default Charts;
