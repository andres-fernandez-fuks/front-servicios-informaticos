import React from "react";
import ReactDOM from "react-dom";
import { Doughnut, Pie } from "react-chartjs-2";

const pieOptions = {
    maintainAspectRatio: false,
    tooltipTemplate: "<%= label %> - <%= value %>",
    legend: {
        display: true,
        position: "right"
    },
    elements: {
        arc: {
        borderWidth: 0
    },
    labels: {
        display: true,
        color: "white",
      },
}
};
  
  export function PieGraph(props) {
    const [data, setData] = React.useState(props.data ? props.data : [{labels: [], values: []}]);
    
    React.useEffect(() => {
        setData(props.data)
    }, [props.data]);

    function createDataset() {
        if (data.length === 0) return {};
        return {
            responsive: false,
            labels: data.labels,
            datasets: [
              {
                data: data.values,
                backgroundColor: [
                    'rgba(104, 219, 66, 0.2)',
                    'rgba(110, 67, 195, 0.2)',
                ],
                borderColor: [
                    'rgba(104, 219, 66, 1)',
                    'rgba(110, 67, 195, 1)',
                ],
                borderWidth: 1,
              }
            ],
            
        }
        
    }
  
    return (
        // <Doughnut data={data} options={options} />
        <Pie
            data={createDataset()}
            options={pieOptions}
        />
    );
  }