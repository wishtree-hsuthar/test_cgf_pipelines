
import './DashBoardFilter.css'
export const labels = [
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
export const barGraphOptions =(CountryTitle)=>

 {
    return {
    responsive: true,
    plugins: {
      datalabels:{
        display:true,
        anchor: "end",
        offset: -20,
        color: "black",
        align: "start",
      },
      legend: {
        labels: {
          // This more specific font property overrides the global property
          usePointStyle: true,
          font: {
            size: 10,
          },
        },
      },
  
      title: {
        display: true,
        text: CountryTitle,
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
      y:{
        min:0,
        // max:
      },
    },
  }};

  export const doughnutGraphOptions =(title,position='left')=> {
    return {
    // responsive: true,
    plugins: {
      datalabels:{
        display:false,
        
      },
      legend: {
        position:position,
        labels: {
          usePointStyle: true,
         
          // This more specific font property overrides the global property
          font: {
            size: 10,
            weight: "bold",
          },
          color: "black",
        },
      },
  
      title: {
        display: true,
        text: title,
        font: {
          size: 12,

        },
        datalabels: {
          color: "black",
          formatter: (value) =>  "    "+ value + "%",
        },
        
      },
    },
  }};
  export const defaultValue={
    labels: ['Directly hired workers',"Third Party workers","Domestic Migrants"],

    datasets: [
      {
        // label: "# of Votes",
        data: [35,25,40],
        backgroundColor: ['#ffc20000','blue','green'],
        borderColor: [
          ''
        ],
        borderWidth: 1,
      },
    ]
  }
  export const indicatordefaultValue={
    labels: ['Leadership',"Not Initiated","Established","Launched"],

    datasets: [
      {
        // label: "# of Votes",
        data: [35,25,40],
        backgroundColor: ['orange','red','blue','green'],
        borderColor: [
          ''
        ],
        borderWidth: 1,
      },
    ]
  }
  export const indicators=['Policy Commitment','Governing Structure','Roles & Responsibility','Impact/Risk Assessment','Prevent and Mitigate Risks and Impacts','Remediation Processes','Public Reporting']
  export const assessmentOptions=['COUNTRY- OPERATION HRDD REQUIREMENTS', 'HEADQUARTERS HRDD REQUIREMENTS (ALL OPERATIONS)']
  export const assessmentIndicatorOptions=['HQ Level Operations','Country Level Operations']