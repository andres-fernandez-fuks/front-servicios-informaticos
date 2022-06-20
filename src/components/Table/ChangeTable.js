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
import EditOffIcon from '@mui/icons-material/EditOff';

import toast, { Toaster } from 'react-hot-toast';

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

      function insertButtons(tableMeta, props) {
        var object_id = tableMeta.rowData[0];
        var draft_id = tableMeta.rowData[1];
        console.log("ID DE OBJETO: " + object_id);

        var object_type = tableMeta.rowData[props.type_row || 2].toLowerCase();
        var details_path = props.details_button_path + object_type + "/" + object_id;
        var edit_path = props.edit_button_path + object_type + "/" + object_id;
        var disabled = draft_id && draft_id != localStorage.getItem("change_id");
        console.log(draft_id,(draft_id !== undefined && draft_id !== null) && draft_id != localStorage.getItem("change_id"),localStorage.getItem("change_id"))

        if (disabled) {
            return (
                <>
                <Toaster/>
                <Tooltip title="Detalles">
                <IconButton
                    className={classes.onlyButtonSpacing}
                    color="inherit"
                    size="small"
                    component={Link}
                    to={details_path}
                    path >
                    <VisibilityIcon />
                </IconButton>
                </Tooltip>
                <Tooltip title= {"Hay modificaciones pendientes"}>
                <IconButton
                    className={classes.onlyButtonSpacing}
                    color="inherit"
                    size="small"
                    onClick= {() => {
                        toast.error("El cambio " + draft_id + " tiene modificaciones pendientes sobre este CI")
                    }}
                    path >
                    <EditOffIcon />
                </IconButton>
                </Tooltip>
            </>
            )
        }
        return (
        <>
            <Tooltip title="Detalles">
            <IconButton
                className={classes.onlyButtonSpacing}
                color="inherit"
                size="small"
                component={Link}
                to={details_path}
                path >
                <VisibilityIcon />
            </IconButton>
            </Tooltip>
            <Tooltip title= {"Editar"}>
            <IconButton
                className={classes.onlyButtonSpacing}
                color="inherit"
                size="small"
                component={Link}
                to={edit_path}
                path >
                <EditIcon />
            </IconButton>
            </Tooltip>
        </>)
      }

       
      var new_columns = Object.entries(props.columns).map(([key, value]) => {
        console.log(value.name);
        return {
            name: value.name,
            label: value.label,
            options: {
                filter: false,
                sort: false,
                display	: props.excludeIdColumn && (value.name === "id" || value.name == "draft_id") ? false : true,
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

    if (props.addRestoreColumn === true) {
        new_columns.push({
            name: "Restaurar",
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
                var object_id = tableMeta.rowData[0];
                
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
                        <RestoreIcon />
                    </IconButton>
                    </Tooltip>
                </>
                );
            },
            },
        });
    }

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

                // if (props.change_callback_id) {
                //     path = path + "/" + props.change_callback_id;
                // }

                return (insertButtons(tableMeta, props));
            },
            },
        });

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