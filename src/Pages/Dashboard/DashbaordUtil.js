
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

  export const doughnutGraphOptions =(title)=> {
    return {
    // responsive: true,
    plugins: {
      datalabels:{
        display:false,
        
      },
      legend: {
        position:"left",
        labels: {
          usePointStyle: true,
         
          // This more specific font property overrides the global property
          font: {
            size: 10,
          },
        },
      },
  
      title: {
        display: true,
        text: title,
        font: {
          size: 12,

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
        backgroundColor: ['red','blue','green'],
        borderColor: [
          ''
        ],
        borderWidth: 1,
      },
    ]
  }