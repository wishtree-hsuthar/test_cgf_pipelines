
export const barGraphOptions =(CountryTitle)=>

 {
    return {
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
    },
  }};

  export const doughnutGraphOptions =(title)=> {
    return {
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