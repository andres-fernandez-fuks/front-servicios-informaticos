import React from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Chip from "@material-ui/core/Chip";


export default function CustomDataTable(props) {

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
          },
        },
        MUIDataTableBodyCell: {
          root: {
            height: 15,
            whiteSpace: "nowrap",
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
        var has_chip = value.name === 'priority' || value.name === 'status';
        if (has_chip) {
        return {
            
            name: value.name,
            label: value.label,
            options: {
                filter: true,
                sort: true,
                setCellHeaderProps: () => ({
                    style: { fontWeight: "bold", whiteSpace: "nowrap", justifyContent: "center"},
                }),
                setCellProps: () => ({
                    style: { whiteSpace: "nowrap", textAlign:"left"},
                }),
                customBodyRender: priority => <Chip color="primary" style={{backgroundColor: 'green'}} label={priority} size="small" />
            
            }
        }
        }
        else {
            return {
            
                name: value.name,
                label: value.label,
                options: {
                    filter: true,
                    sort: true,
                    setCellHeaderProps: () => ({
                        style: { fontWeight: "bold", whiteSpace: "nowrap", justifyContent: "center"},
                    }),
                    setCellProps: () => ({
                        style: { whiteSpace: "nowrap", textAlign:"left"},
                    })
                
                }
            }
        }
    }
    );

    console.log(new_columns);

    return (
        <ThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
                columns={new_columns}
                data={props.data}
            />
        </ThemeProvider>
    );
}

function priorities_sort(a, b) {
    const PRIORITIES = ["Muy Alta", "Alta", "Media", "Baja", "Muy Baja"];
    var a_index = PRIORITIES.indexOf(a);
    var b_index = PRIORITIES.indexOf(b);
    return a_index < b_index;
}

function getBackgroundColor(priority) {
    const PRIORITIES = ["Muy Alta", "Alta", "Media", "Baja", "Muy Baja"];
    var index = PRIORITIES.indexOf(priority);
    switch (index) {
        case 0:
            return "#ff0000";
        case 1:
            return "#ffa500";
        case 2:
            return "#ffff00";
        case 3:
            return "#00ff00";
        case 4:
            return "#0000ff";
        default:
            return "#ffffff";
    }
}