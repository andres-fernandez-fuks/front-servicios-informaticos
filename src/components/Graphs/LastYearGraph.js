import LineGraph from './LineGraph';

export function LastYearGraph(props) {
    var current_year = props.current_year;
    var current_month = props.current_month;
    var month_info = {};
    for (var i = 0; i < 12; i++) {
        var key = current_year + "-" + (current_month)
        month_info[key] = {month: current_month, year: current_year, count:0};
        if (current_month === 0) {
            current_month = 11;
            current_year --;
        } else {
            current_month--
        }
    }
    return (
        <MonthlyGraph
        month_info = {month_info}
        data={props.data}
        name={"Gráfico mensual"}
      />
    )

}

function MonthlyGraph(props) {
    for (var i = 0; i < props.data.length; i++) {
        var month = props.data[i]['x'].getMonth();
        var year = props.data[i]['x'].getFullYear();
        var key = year + "-" + (month)
        if (props.month_info[key]) {
            props.month_info[key]['count'] += props.data[i]['y'];
        }
    }
    var monthlyData = Object.entries(props.month_info).map(([key, value]) => {
        return {
            x: new Date(value['year'], value['month']),
            y: parseInt(value['count'])
        }
    })
    return (
        <LineGraph
        data={monthlyData.length > 0 ? monthlyData : []}
        name={"Gráfico mensual"}
        frameInMonth={false}
        showDataLabelsOnly={true}
      />
    )
}