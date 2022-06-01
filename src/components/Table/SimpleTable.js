import React from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import datatableTextLabels from "components/Table/textLabels";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import useStyles from "../../styles";
import { NavLink, Link, useLocation } from "react-router-dom";


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
                setCellHeaderProps: () => ({
                    style: {whiteSpace: "nowrap", justifyContent: "center"},
                }),
                setCellProps: () => ({
                    style: { whiteSpace: "nowrap", textAlign:"center"},
                }),
            }
        }  
    }
    );

    // if (add_edit_column) {
    //     new_columns.push({
    //         name: "Editar",
    //         options: {
    //         download: false,
    //         filter: false,
    //         sort: false,
    //         setCellHeaderProps: () => {
    //             return { style: {minWidth: 150, width: 150 } };
    //         },
    //         setCellProps: () => ({
    //             style: { whiteSpace: "nowrap", textAlign:"center"},
    //         }),
    //         customBodyRender: (value, tableMeta, updateValue) => {
    //             var incident_id = tableMeta.rowData[0];
    //             return (
    //             <>
    //                 <Tooltip title="Editar">
    //                 <IconButton
    //                     className={classes.onlyButtonSpacing}
    //                     color="inherit"
    //                     aria-label="upload picture"
    //                     //component="span"
    //                     size="small"
    //                     component={Link}
    //                     to={'/admin' + props.edit_details_path + "/" + incident_id}
    //                     path >
    //                     <EditIcon />
    //                 </IconButton>
    //                 </Tooltip>
    //             </>
    //             );
    //         },
    //         },
    //     });

    // }

    const table_options = {
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