import { Scatter } from 'react-chartjs-2';
//import "chartjs-adapter-moment";
import React from "react";
import DataExpressionMixin from 'devextreme/ui/editor/ui.data_expression';

const default_options = {
    width: 500,
    legend: {
      display: false
    },
    tooltips: {
        callbacks: {
            label: function(context) {
                return context.yLabel;
            }
        },
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "point",
        intersect: 0,
        position: "nearest",
        value: "yLabel"
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            drawBorder: true,
            lineWidth: 0
          },
          ticks: {
            // for debugging
            display: false,
            suggestedMin: 0,
          }
        },
        {
            gridLines: {
              drawBorder: true,
              lineWidth: 0
            },
            ticks: {
              display: false,
              suggestedMin: 0,
            }
          }
      ],
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
            lineWidth: 0
          },
          ticks: {
            display: false
          }
        }
      ],
    },


  };

export default function DotGraph(props) {
    const [data, setData] = React.useState([]);
    const [avg, setAvg] = React.useState(0);
    const [frameInMonth, setframeInMonth] = React.useState(props.frameInMonth);
    const [showDataLabelsOnly, setshowDataLabelsOnly] = React.useState(props.showDataLabelsOnly);

    React.useEffect(() => {
        setframeInMonth(props.frameInMonth);
        setData(props.data)
        setshowDataLabelsOnly(props.showDataLabelsOnly)
    }, [props.frameInMonth, props.data, props.showDataLabelsOnly]);

    function createDataset(name, data, avg) {
        var emptyData = new Array(data.length).fill(0);
        let lineData = emptyData.map((element, i) => {
            return {x: i, y: props.avg};})

        return {
            datasets: [
                {
                    label: name,
                    data: data,
                    pointBackgroundColor: '#FF6384',
                    //Plus some config
                },
                {
                    type: 'line',
                    label: 'Dataset 2',
                    data: lineData,
                    borderColor: 'rgb(53, 162, 235)',
                    fill:false,
                    pointRadius: 0,
                    borderWidth: 1,
                  },
            ],
        };        
    }

    function createOptions() {
        var options = { ...default_options };
        if (props.noRotation) {
            options.scales.xAxes[0].ticks.minRotation = 0;
        }
        options.scales.xAxes[0].ticks.suggestedMax = props.data.length;
        return options;
    }
    return (
        <>
            <Scatter
                options={createOptions()}
                data={(canvas) => createDataset(props.name, data, avg)}
            />
        </>
    );
}
