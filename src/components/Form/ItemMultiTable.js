import SimpleTable from 'components/Table/SimpleTable';
import CommentsTracking from 'components/Form/comment_tracking';
import MultiTable from './MultiTable';

const itemColumns = [
    {"name": "version_number", "label": "Versión"},
    {"name": "created_at", "label": "Fecha de creación"},
]


export default function ItemMultiTable(props) {

    var first_component;

    if (props.versions && props.versions.length === 0) {
        first_component = <div className="version_row">No hay otras versiones del ítem</div>
    } else {
        first_component =
        <SimpleTable
            data={props.versions}
            columns={itemColumns}
            addRestoreColumn={true}
            function={props.check_version_function}
            button_path={"/admin" + props.item_details_path}//HARDWARE_ITEM_DETAILS_PATH
            request_endpoint = {`configuration-items/${props.item_type}/${props.item_id}/version`}
        />    
    }

    const second_component =
    <div>
        <CommentsTracking 
            comments={props.comments} 
            commentCreationUrl={`configuration-items/${props.item_type}/${props.item_id}/comments`}
            flushLocalComments={false}
        />
    </div>

    var buttons = ["Versiones", "Tracking"]
    var tables = [first_component, second_component]

    return (
        <MultiTable className="multi-table-card"
            buttons={buttons}
            tables={tables}
        />
    )
}
