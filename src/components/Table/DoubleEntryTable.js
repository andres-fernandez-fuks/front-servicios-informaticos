import "./double_entry.css"
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

export default function DoubleEntryTable(props) {

    function createTableHeader(permissions) {
        return (
            <tr> 
                <td class="permissions-th"> </td>
                {Object.keys(permissions).map((permission) => {
                return (
                    <td class="permissions-th" key={permission}> <label style={{fontSize:13, paddingTop:"7px"}}>{permission}</label></td>
                );
                }
                )}
            </tr>
        );
    }

    function renderIcon(has_permission) {
        if (has_permission) {
            return <DoneIcon style={{color:"green"}}/>;
        } else {
            return <CloseIcon style={{color:"red"}}/>;
        }
    }
    
    function createRows(data) {
        return Object.entries(data).map(([table, table_permissions]) => {
            return createRow(table, table_permissions)
        });
    }

    function createRow(row_name, row_data) {
        return (
            <tr>
                <td class="permissions-th"> <label style={{fontSize:13, paddingTop:"7px"}}>{row_name}</label> </td>
                {createColumns(row_data)}
            </tr>
        )
    }

    function createColumns(row_data) {
        return Object.entries(row_data).map(([column, column_permissions]) => {
            return createColumn(column_permissions)
        });
    }

    function createColumn(column_permissions) {
        return <td class="permissions-th">{renderIcon(column_permissions)}</td>;
    }

    if (!props.permissions) return <></>;

    return (
        <table className="permissions-table">
            {createTableHeader(props.permissions["Incidentes"])}
            {createRows(props.permissions)}
        </table>
    );
}