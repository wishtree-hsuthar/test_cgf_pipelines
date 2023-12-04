import React, { useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
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
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        // This more specific font property overrides the global property
        font: {
          size: 10,
        },
      },
    },

    title: {
      display: true,
      text: "Brazil",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      alignToPixels: "start",
      align: "start",
    },
  },
};

const labels = [
  [
    "Known directly hired",
    "workers in all sites",
    "for prioritised operation",
    " in the selected",
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

export const data = {
  labels,
  datasets: [...MockData],
};

function CgfDashboard() {
  const [personName, setPersonName] = React.useState([]);
  const [dataForgraph, setDataForgraph] = React.useState({
    ...data,
  });
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
      {/* <Toaster
        messageType={homeToasterDetails.messageType}
        descriptionMessage={homeToasterDetails.descriptionMessage}
        myRef={homeRef}
        titleMessage={homeToasterDetails.titleMessage}
      /> */}
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) =>
            selected.map((data) => data.label).join(", ")
          }
          MenuProps={MenuProps}
        >
          {MockData.map((data) => (
            <MenuItem key={data.label} value={data}>
              <Checkbox checked={personName.indexOf(data) > -1} />
              <ListItemText primary={data.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <section>
        <div className="container">
          <button onClick={saveCanvas}>Download png</button>
          <Bar
            id="chart"
            style={{ backgroundColor: "white" }}
            options={options}
            data={dataForgraph}
          />
          <DoughnutChart data={doughnutGraphData} />;
          <div className="dashboard-sect"></div>
        </div>
      </section>
    </div>
  );
}

export default CgfDashboard;
