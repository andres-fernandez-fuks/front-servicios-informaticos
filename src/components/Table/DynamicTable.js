import React from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';


export class CustomDataTable extends React.Component {

    getMuiTheme = () => createTheme({
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
      
    render() {
        return (
            <ThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    columns={this.props.columns}
                    data={this.props.data}
                />
            </ThemeProvider>
        );
    }
}