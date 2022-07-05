import BarGraph from './BarGraph';


export function SolvedByUserGraph(props) {
    return (
        <BarGraph
        data={props.data}
        name={"Gráfico mensual"}
        frameInMonth={false}
        showDataLabelsOnly={true}
        color="green"
      />
    )
}