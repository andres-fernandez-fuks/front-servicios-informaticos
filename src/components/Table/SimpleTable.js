import React from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import datatableTextLabels from "components/Table/textLabels";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import useStyles from "pages/control/styles";
import { NavLink, Link, useLocation } from "react-router-dom";
import RestoreIcon from '@mui/icons-material/Restore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { PersonPin } from "@mui/icons-material";

export default function SimpleTable(props) {

    var classes = useStyles();

    const getMuiTheme = () => createTheme({
      overrides: {
        MuiTableCell: {
          head: {
            position: "sticky",
            textAlign: "center",
            zIndex: 2,
          },
          body: {
            display: "table-cell",
            verticalAlign: "middle",
            zIndex: 1,
            borderBottom: "none"
          },
        },
        MUIDataTableBodyCell: {
          root: {
            height: 15,
            whiteSpace: "nowrap",
            borderBottom: "none"
          },
        },
        MUIDataTableToolbar: {
          filterPaper: {
            width: "300px",
          },
        },
      },
        palette: {
          primary: {
            main: "#1f2131"
          },
          secondary: {
            main: "#E4E6EB"
          },
          text: {
            primary: "#E4E6EB",
            secondary: "#B0B3B8"
          },
          background: {
            default: "#1f2131",
            paper: "transparent"
          }
        }
      });

       
      var new_columns = Object.entries(props.columns).map(([key, value]) => {
        console.log(value.name);
        return {
            name: value.name,
            label: value.label,
            options: {
                filter: false,
                sort: false,
                display	: !props.excludeColumns || !props.excludeColumns.includes(value.name),
                setCellHeaderProps: () => ({
                    style: {whiteSpace: "nowrap", justifyContent: "center"},
                }),
                setCellProps: () => ({
                    style: { whiteSpace: "nowrap", textAlign: "center"},
                }),
            }
        }  
    }
    );
    
    if (props.addRestoreColumn) {
        new_columns.push({
            name: props.isKnownErrorTable ? "Restaurar" : "Detalles",
            options: {
            download: false,
            filter: false,
            sort: false,
            setCellHeaderProps: () => {
                return {  };
            },
            setCellProps: () => ({
                style: { whiteSpace: "nowrap", textAlign:"center", verticalAlign: "top"},
            }),
            customBodyRender: (value, tableMeta, updateValue) => {
                var object_id = props.isVersionsTable ? tableMeta.rowData[0] : tableMeta.rowData[0];
                
            return (
            <>
                <Tooltip title="Restaurar">
                <IconButton
                    className={classes.onlyButtonSpacing}
                    color="inherit"
                    size="small"
                    component={Link}
                    onClick={() => props.function(props.request_endpoint, props.button_path, object_id)}
                    path >
                    {props.isKnownErrorTable ? <RestoreIcon/> : <VisibilityIcon/>}
                </IconButton>
                </Tooltip>
            </>
            );
            },
            },
        });
    }

    if (props.addWatchColumn === true) {
        new_columns.push({
            name: "Detalles",
            options: {
            download: false,
            filter: false,
            sort: false,
            setCellHeaderProps: () => {
                return {  };
            },
            setCellProps: () => ({
                style: { whiteSpace: "nowrap", textAlign:"center", verticalAlign: "middle"},
            }),
            customBodyRender: (value, tableMeta, updateValue) => {
                var object_id = tableMeta.rowData[0];
                console.log("ID DE OBJETO: " + object_id);
                var path;

                if (props.use_object_type) {
                    var object_type = tableMeta.rowData[props.type_row || 2].toLowerCase();
                    path = props.button_path + object_type + "/" + object_id;
                } else if (props.use_solvable_type) {
                    object_type = tableMeta.rowData[props.type_row || 2].toLowerCase();
                    path = "/admin/" + object_type + props.button_path + "/" + object_id;
                } else {
                    path = props.button_path + object_id;
                }

                // if (props.change_callback_id) {
                //     path = path + "/" + props.change_callback_id;
                // }

                return (
                <>
                    <Tooltip title="Detalles">
                    <IconButton
                        className={classes.onlyButtonSpacing}
                        color="inherit"
                        size="small"
                        component={Link}
                        to={path}
                        path >
                        <VisibilityIcon />
                    </IconButton>
                    </Tooltip>
                </>
                );
            },
            },
        });
    }

    const table_options = {
        elevation: 0,
        pagination:false,
        viewColumns: false,
        download:false,
        search:false,
        filter:false,
        selectableRows: false,
        textLabels: datatableTextLabels(),
        print: false
      };

    return (
        <ThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
                columns={new_columns}
                data={props.data}
                options={table_options}
            />
        </ThemeProvider>
    );
}