import { DataGrid } from '@mui/x-data-grid';

export default function DataGridTable(props) {
    debugger;
    return (
    <DataGrid
        rows={props.rows}
        columns={props.columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
    />)
}