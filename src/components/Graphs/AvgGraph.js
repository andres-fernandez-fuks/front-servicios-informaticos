import ScatterGraph from './ScatterGraph';

export function AvgGraph(props) {
    return (
        <ScatterGraph
        data={props.data}
        name={"Tiempo de resolución"}
        frameInMonth={false}
        showDataLabelsOnly={true}
        avg={props.avg}
      />
    )
}

