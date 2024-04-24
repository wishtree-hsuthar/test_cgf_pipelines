
import './DashBoardFilter.css'
import 'chartjs-plugin-annotation';

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
export const barGraphOptions =(CountryTitle='',max)=>

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
      tooltip: {
        callbacks: {
          title: (titem) =>  `${titem[0]?.dataset.label} - ${titem[0]?.raw}`, //
          label: (ttItem) => {return `${ttItem.raw}`}
        }
      }
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
        suggestedMax:max
      },
    },
  }};

  export const doughnutGraphOptions =(title,position='left')=> {
    return {
    // responsive: true,
    // maintainAspectRatio: false ,
    plugins: {
      annotation: {
        // clip:false,
        annotations: {
          label1: {
            display:false,
            type: 'label',
            position:"end",
            textAlign:'left',
            xValue: 2.5,
            yValue: 60,
            backgroundColor: 'rgba(245, 245, 245)',
            content: ["**Note - Companies that do not appear on the graph is because they"," have 0 directly hired workers or have not submitted their data"],
            font: {
              size: 10,
            },
            // padding:10,
            // width:'20%',
            xAdjust: 350, // Adjust horizontally if needed
            yAdjust: 320, // Adjust vertically if needed
        },
      }},
      datalabels:{
        display:false,
        
      },
      legend: {
        position:position,
        labels: {
          usePointStyle: true,
         
          // This more specific font property overrides the global property
          font: {
            size: 12,
          },
          color: "black",
        },
      },
  
      title: {
        display: true,
        text: title,
        font: {
          size: 14,

        },
        color: "black",
        
      },
      // datalabels: {
      //   color: "black",
      //   // formatter: (value) =>  "    "+ value + "%",
      //   formatter: (val, context) => `${val}%`,
      // },
      tooltip: {
        callbacks: {
          label: (ttItem) => `: ${ttItem.parsed}%`
        }
      }
    },
    // animation: {
    //   animateRotate: true, // Enable rotation animation
    //   animateScale: true, // Enable scale animation
    //   duration: 1000, // Animation duration in milliseconds
    // },
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
  export const indicatorsForNew=['Policy','Governance','Identify and Assess','Address, Prevent & Mitigate','Remedy','Transparency and verification']
  export const indicatorsForOld=['Policy Commitment','Governance','Assess Human Rights Potential and Actual Impact','Integrate and Act in order To Prevent and Mitigate','Track The Effectiveness Of Responses','Report','Remedy']
  export const indicatorsForNewCountry=['Policy','Governance','Identify and Assess','Address, Prevent & Mitigate','Remedy','Transparency and verification']
  export const indicatorsForOldCountry=['Policy Commitment','Governance','Assess Human Rights Potential and Actual Impact','Integrate and Act To Prevent and Mitigate','Track The Effectiveness Of Responses','Report','Remedy']
  export const assessmentWorkforceOptions=['COUNTRY- OPERATION HRDD REQUIREMENTS', 'HEADQUARTERS HRDD REQUIREMENTS (ALL OPERATIONS)']
  export const assessmentOptions2=['COUNTRY', 'HEADQUARTER']

  export const assessmentIndicatorOptions=[
    'COUNTRY- OPERATION HRDD REQUIREMENTS',
  'HEADQUARTERS HRDD REQUIREMENTS (ALL OPERATIONS)',
  'HRDD Reporting Framework (Country)',
  'HRDD Reporting Framework (Global)']

  export const  splitSentences=(sentence, wordsPerChunk = 15)=> {
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