import ScatterGraph from './ScatterGraph';

export function AvgGraph(props) {
    return (
        <ScatterGraph
        data={props.data}
        name={"Gráfico mensual"}
        frameInMonth={false}
        showDataLabelsOnly={true}
        avg={props.avg}
      />
    )
}

