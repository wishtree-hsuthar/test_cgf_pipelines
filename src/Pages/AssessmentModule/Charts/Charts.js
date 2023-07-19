import React from "react";
import Chart2 from "./Chart2.js";
import Chart1 from "./Chart1.js";

const Charts = ({
  graphResult,
  graphLevelBreakdown,
  questionnaireTitle,
  chartImages,
  setChartImages,
}) => {
  
  return (
    <>
      <Chart1
        graphResult={graphResult}
        questionnaireTitle={questionnaireTitle}
        chartImages={chartImages}
        setChartImages={setChartImages}
      />
      <Chart2
        graphLevelBreakdown={graphLevelBreakdown}
        chartImages={chartImages}
        setChartImages={setChartImages}
      />
    </>
  );
};

export default Charts;
