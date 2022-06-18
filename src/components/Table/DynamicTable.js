import React from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import datatableTextLabels from "components/Table/textLabels";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import InfoIcon from '@mui/icons-material/Info';
import useStyles from "../../styles";
import { NavLink, Link, useLocation } from "react-router-dom";

function choosePriorityColor(priority) {
    switch(priority) {
        case "Pendiente": return "#9F0606";
        case "Alta": return "#9F0606";
        case "Media": return "#E86C36";
        case "En proceso": return "#E86C36";
        case "Baja": return "#6F975C";
        case "Resuelto": return "#6F975C";
        case "Rechazado": return "#736464";
        default: return "red"
    }
}

export default function CustomDataTable(props) {

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
            main: "#242526"
          },
          secondary: {
            main: "#d975d0"
          },
          text: {
            primary: "#E4E6EB",
            secondary: "#B0B3B8"
          },
          background: {
            default: "",
            paper: "#1f2131"
          }
        }
      });

       
      
      
      var new_columns = Object.entries(props.columns).map(([key, value]) => {
        var has_chip = value.name === 'priority' || value.name === 'status';
        console.log(value.name);
        console.log(has_chip);
        if (has_chip) {
        return {
            
            name: value.name,
            label: value.label,
            options: {
                filter: true,
                sort: false,
                setCellHeaderProps: () => ({
                    style: {whiteSpace: "nowrap", justifyContent: "center"},
                }),
                setCellProps: () => ({
                    style: { whiteSpace: "nowrap", textAlign:"center"},
                }),
                customBodyRender: priority => <Chip color="primary" style={{backgroundColor: choosePriorityColor(priority) }} label={priority} size="small" />
            
            }
        }
        }
        else {
            return {
            
                name: value.name,
                label: value.label,
                options: {
                    filter: true,
                    sort: !props.center_all_columns,
                    setCellHeaderProps: () => ({
                        style: {whiteSpace: "nowrap", justifyContent: "center"},
                    }),
                    setCellProps: () => ({
                        style: { whiteSpace: "nowrap", textAlign:"left"},
                    })
                
                }
            }
        }
    }
    );

    var add_edit_column = props.addEditColumn === false ? false:true 
    if (add_edit_column) {
        new_columns.push({
            name: "Ver",
            options: {
            download: false,
            filter: false,
            sort: false,
            setCellHeaderProps: () => {
                return { style: {minWidth: 150, width: 150 } };
            },
            setCellProps: () => ({
                style: { whiteSpace: "nowrap", textAlign:"center"},
            }),
            customBodyRender: (value, tableMeta, updateValue) => {
                var object_id = tableMeta.rowData[0];
                var edit_details_path = props.edit_extra_path ? 
                                            props.edit_details_path + "/" + props.edit_extra_path + "/" + object_id : 
                                            props.edit_details_path + "/" + object_id;
                
                return (
                <>
                    <Tooltip title="Detalles">
                    <IconButton
                        className={classes.onlyButtonSpacing}
                        color="inherit"
                        aria-label="upload picture"
                        //component="span"
                        size="small"
                        component={Link}
                        to={'/admin' + edit_details_path}
                        path >
                        <InfoIcon />
                    </IconButton>
                    </Tooltip>
                </>
                );
            },
            },
        });

    }

    const table_options = {
        filterType: 'dropdown',
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