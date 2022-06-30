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
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import UpdateIcon from '@mui/icons-material/Update';
import UpdateDisabledIcon from '@mui/icons-material/UpdateDisabled';

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

      function determineToastMessage(other_change_draft, draft_change_id) {
        if (!other_change_draft) {
          return "Ya se restauró una versión del ítem en este cambio";
        } else {
          return "Este ítem está siendo modificado por el cambio " + draft_change_id;
        }
      }

      function determineRestoreToastMessage(other_change_draft, draft_change_id, is_restoring_draft) {
        if (other_change_draft) {
            return "Este ítem está siendo modificado por el cambio " + draft_change_id;
        } else if (is_restoring_draft) {
          return "Ya se restauró una versión del ítem en este cambio";
        } else {
            return "El ítem está siendo editado, no se puede restaurar una versión";
        }
      }

      function insertModifiedButton(tableMeta, props) {
        var draft_id = tableMeta.rowData[4];
        var draft_change_id = tableMeta.rowData[5];
        var modified = draft_id && draft_change_id === parseInt(localStorage.change_id); // modificado si hay borrador y es de este cambio

        if (modified) {
            return ( <> <DoneIcon style={{ color: '#5AD660' }}/> </> );
        } else {
            return ( <> <CloseIcon style={{ color: '#B14141' }}/> </> );
        }
    }

    function insertDetailsButton(details_path) {
        return (
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
        )
    }

    function insertEditButton(show_buttons, edit_enabled, edit_path, draft_change_id, other_change_draft) {
        if (!show_buttons) { return }

        if (edit_enabled) {
            return (
                <>
                <Tooltip title= {"Editar"}>
                <IconButton
                    className={classes.onlyButtonSpacing}
                    color="inherit"
                    size="small"
                    component={Link}
                    to={{
                        pathname: edit_path,
                    }}
                    path >
                    <EditIcon />
                </IconButton>
                </Tooltip>
            </>
            )
        } else {
            return (
                <>
                <Toaster/>
                <Tooltip title= {determineToastMessage(other_change_draft, draft_change_id)}>
                <IconButton
                    className={classes.onlyButtonSpacing}
                    color="inherit"
                    size="small"
                    component={Link}
                    onClick= {() => {
                        toast.error(determineToastMessage(other_change_draft, draft_change_id));
                    }}
                    path >
                    <EditOffIcon />
                </IconButton>
                </Tooltip>
                </>
            )
        }
    }

    function insertRestoreButton(show_buttons, restore_enabled, restore_path, other_change_draft, draft_change_id, is_restoring_draft) {
        if (!show_buttons) { return }

        if (restore_enabled) {
            return (
                <Tooltip title= {"Restaurar versión"}>
                <IconButton
                    className={classes.onlyButtonSpacing}
                    color="inherit"
                    size="small"
                    component={Link}
                    to={{
                        pathname: restore_path,
                    }}
                    path >
                    <UpdateIcon/>
                </IconButton>
                </Tooltip>
            )
        } else {
            return (
                <>
                <Toaster/>
                <Tooltip title= {determineRestoreToastMessage(other_change_draft, draft_change_id, is_restoring_draft)}>
                <IconButton
                    className={classes.onlyButtonSpacing}
                    color="inherit"
                    size="small"
                    component={Link}
                    onClick= {() => {
                        toast.error(determineRestoreToastMessage(other_change_draft, draft_change_id, is_restoring_draft));
                    }}
                    path >
                    <UpdateDisabledIcon/>
                </IconButton>
                </Tooltip>
                </>
            )
        }
    }

    function insertButtons(tableMeta, props) {
        var object_id = tableMeta.rowData[0];
        var draft_change_id = tableMeta.rowData[5];
        var object_type = tableMeta.rowData[props.type_row || 2].toLowerCase();
        var is_restoring_draft = tableMeta.rowData[6];
        var details_path = props.details_button_path + object_type + "/" + object_id;
        var edit_path = props.edit_button_path + object_type + "/" + object_id;
        var restore_path = props.restore_button_path + object_type + "/" + object_id;
        var item_has_draft = draft_change_id !== null
        var other_change_draft = item_has_draft && draft_change_id !== parseInt(localStorage.change_id)
        var edit_enabled = !other_change_draft && !is_restoring_draft;
        var restore_enabled = !item_has_draft
        var show_buttons = props.change_status[0] === "Pendiente" && props.taken_by[0]

        return (
            <>
                {insertDetailsButton(details_path)}
                {insertEditButton(show_buttons, edit_enabled, edit_path, draft_change_id, other_change_draft)}
                {insertRestoreButton(show_buttons, restore_enabled, restore_path, other_change_draft, draft_change_id, is_restoring_draft)}
            </>
        )
    }


    var new_columns = Object.entries(props.columns).map(([key, value]) => {
    console.log(value.name);
        return {
            name: value.name,
            label: value.label,
            options: {
                filter: false,
                sort: false,
                display: props.excludeColumns && props.excludeColumns.includes(value.name) ? false : true,
                setCellHeaderProps: () => ({
                    style: {whiteSpace: "nowrap", justifyContent: "center"},
                }),
                setCellProps: () => ({
                    style: { whiteSpace: "nowrap", textAlign: "center"},
                }),
            }
        }  
    });

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
        name: "Acciones",
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

    new_columns.push({
        name: "¿Modificado?",
        options: {
        download: false,
        filter: false,
        sort: false,
        display: props.change_status !== 'Resuelto', // solamente se muestra si el cambio no está resuelto
        setCellHeaderProps: () => {
            return {  };
        },
        setCellProps: () => ({
            style: { whiteSpace: "nowrap", textAlign:"center", verticalAlign: "middle"},
        }),
        customBodyRender: (value, tableMeta, updateValue) => {
            return insertModifiedButton(tableMeta, props);
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