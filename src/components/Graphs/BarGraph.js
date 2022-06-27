import { Bar, Line } from "react-chartjs-2";
//import "chartjs-adapter-moment";
import React from "react";

const default_options = {
    legend:{display:false},
    maintainAspectRatio: false,
    tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
    },
    responsive: true,
    scales: {
        xAxes: [
            {
                ticks: {
                    minRotation: 40,
                    padding: 20,
                    fontColor: "#9a9a9a",
                },
                barPercentage: 0.3,
                gridLines: {
                    drawBorder: false,
                    color: "rgba(29,140,248,0.1)",
                },
            }
        ],
        yAxes: [{
            title: {
                display: true,
                text: "value"
            },
            gridLines: {
                drawBorder: false,
                color: "rgba(29,140,248,0.0)",
                zeroLineColor: "transparent",
            },
            ticks: {
                precision:0,
                min: 0,
                fontColor: "#9a9a9a",
            },
        }]
    }
};

export default function BarGraph(props) {
    const [data, setData] = React.useState(props.data ? props.data : []);
    const [frameInMonth, setframeInMonth] = React.useState(props.frameInMonth);
    const [showDataLabelsOnly, setshowDataLabelsOnly] = React.useState(props.showDataLabelsOnly);

    React.useEffect(() => {
        setframeInMonth(props.frameInMonth);
        setData(props.data)
        setshowDataLabelsOnly(props.showDataLabelsOnly)
    }, [props.frameInMonth, props.data, props.showDataLabelsOnly]);

    function createDataset(name, data, canvas) {       
        let ctx = canvas.getContext("2d");
    
        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
        gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
        gradientStroke.addColorStop(0, "rgba(119,52,169,0)");

        return {
            labels : data.map(d => d.x),
            datasets: [
                {
                    label: name,
                    data: data.map(d => d.y),
                    //Plus some config
                    fill: true,
                    backgroundColor: gradientStroke,
                    borderColor: props.color,
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0.0,
                }
            ]
        };        
    }

    function createOptions() {
        var options = { ...default_options };
        if (props.noRotation) {
            options.scales.xAxes[0].ticks.minRotation = 0;
        }
        return options;
    }
    return (
        <>
            <Bar
                options={createOptions()}
                data={(canvas) => createDataset(props.name, data, canvas)}
            />
        </>
    );
}
