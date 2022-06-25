import { Line } from "react-chartjs-2";
//import "chartjs-adapter-moment";
import React from "react";

const default_options = {
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
                type: "time",
                time: {
                    unit: "day",
                    displayFormats: {
                        day: "DD/MM"
                    }
                },
                ticks: {
                    //min: new Date(2022, 5, 1),
                    //max: new Date(2022, 5, 30),
                    //source: "data",
                    minRotation: 40,
                    padding: 20,
                    fontColor: "#9a9a9a",
                },
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: "rgba(29,140,248,0.1)",
                    zeroLineColor: "transparent",
                },
            }
        ],
        yAxes: {
            title: {
                display: true,
                text: "value"
            },
            barPercentage: 1.6,
            gridLines: {
                drawBorder: false,
                color: "rgba(29,140,248,0.0)",
                zeroLineColor: "transparent",
            },
            ticks: {
                padding: 20,
                fontColor: "#9a9a9a",
            },
        }
    }
};

export default function LineGraph(props) {
    const [data, setData] = React.useState(props.data ? props.data : []);
    const [frameInMonth, setframeInMonth] = React.useState(true);
    const [showDataLabelsOnly, setshowDataLabelsOnly] = React.useState(true);

    React.useEffect(() => {
        setframeInMonth(props.frameInMonth);
        setData(props.data)
        setshowDataLabelsOnly(props.showDataLabelsOnly)
    }, [props.frameInMonth, props.data, props.showDataLabelsOnly]);

    if (document.getElementsByTagName("canvas").length >0) {
        let ctx = document.getElementsByTagName("canvas")[0].getContext('2d');
        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors
    }

    function createDataset(name, data, canvas) {       
        //return (canvas) => {
            debugger
            let ctx = canvas.getContext("2d");
        
            let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

            gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
            gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
            gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors
            return {
                datasets: [
                    {
                        label: name,
                        data: data
                    }
                ]
            };
        //}
        
    }

    function createOptions() {
        var options = { ...default_options };
        if (showDataLabelsOnly)
            options["scales"]["xAxes"][0]["ticks"]["source"] = "data";
        if (frameInMonth && data.length > 0) {

            let first_month = data[0]["x"].getMonth();
            let first_year = data[0]["x"].getFullYear();
            options["scales"]["xAxes"][0]["ticks"]["min"] = new Date(
                first_year,
                first_month,
                1
            );
            let last_month = data[0]["x"].getMonth();
            let last_year = data[0]["x"].getFullYear();
            options["scales"]["xAxes"][0]["ticks"]["max"] = new Date(
                last_year,
                last_month + 1,
                0
            );
        }
        return options;
    }
    //console.log("AAAA", createDataset(props.name, data))
    return (
        <>
            <Line
                options={createOptions()}
                data={(canvas) => createDataset(props.name, data, canvas)}
            />
        </>
    );
}
