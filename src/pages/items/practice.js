import Grid from '@mui/material/Grid';

import React from "react";
import { dbGet, dbPatch } from 'utils/backendFetchers';
import "pages/items/ic.css";
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Form
  } from "reactstrap";
import SimpleTable from "components/Table/SimpleTable";

export const ITEM_DETAILS_PATH = "/item_details";
export const HARDWARE_ITEM_DETAILS_PATH = "/item_details/hardware";

const columns = [
    {"name": "version", "label": "Versión"},
    {"name": "name", "label": "Nombre"},
]

const useStyles = makeStyles({
SmallPaddedGrip: {
        marginTop: 10,
        alignItems: "left"
      },
container: {
    height: "100%",
    border: "1px solid black",
    textAlign: "left",
    padding: "10px",
    width: "200%",
},
right_container: {
    height: "100%",
    border: "1px solid black",
    textAlign: "left",
    padding: "10px",
    width: "100%",
}
});
  
  export default function App() {
    const classes = useStyles();
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    var item_id = paths[paths.length - 1]
    const [values, setValues] = React.useState("");
    const isEditable = false;

    React.useEffect(() => {
        dbGet("configuration-items/hardware/" + item_id).then(data => {
            debugger;
            setValues(data);
        }).catch(err => {console.log(err)});
        }   , []);

    function fetchValues() {
            dbGet("configuration-items/hardware/" + item_id).then(data => {
                setValues(data);
            }).catch(err => {console.log(err)});
        }  

    console.log("Values: ", values)

    if (values === '' || values === undefined) {
        fetchValues();
    }

    function getVersions() {
        if (values === '' || values === undefined) {
            fetchValues();
        }
        debugger;
        if (values.versions && values.versions.length > 0) {
            return <SimpleTable data={values.versions} columns={columns} addRestoreColumn={true}/>
        }
        else {
            return <div className="version_row">No hay otras versiones del ítem</div>
        }
    }
  
    return (
        <div className="content">
            <Card>
                <CardHeader >
                    <h4 className="title">Detalles del ítem</h4>
                </CardHeader>
                <CardBody>
                    <Form>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs>
                                <div className={classes.container}>
                                    <Grid >
                                        <h5 className="title">Descripción</h5>
                                        <input className="description_input"
                                            readOnly
                                            disabled
                                            value= {values.description}
                                            id = "description"
                                            type="text"
                                        />
                                    </Grid>
                                    <Grid class = {classes.SmallPaddedGrip} >
                                            <h5 className="title">Fecha de compra</h5>
                                            <input class = "other_input"
                                                readOnly
                                                disabled = {!isEditable}
                                                value= {values.purchase_date}
                                                id = "description"
                                                type="text"
                                    />
                                    </Grid>
                                    <Grid class = {classes.SmallPaddedGrip} >
                                                <h5 className="title">Fabricante</h5>
                                                <input class = "other_input"
                                                    readOnly
                                                    disabled = {!isEditable}
                                                    value= {values.manufacturer}
                                                    id = "description"
                                                    type="text"
                                                />
                                    </Grid>
                                    <Grid class = {classes.SmallPaddedGrip} >
                                                <h5 className="title">Precio</h5>
                                                <input class = "other_input"
                                                    readOnly
                                                    disabled = {!isEditable}
                                                    value= {values.price}
                                                    id = "description"
                                                    type="text"
                                                />
                                    </Grid>
                                    <Grid class = {classes.SmallPaddedGrip} >
                                        <h5 className="title">Versión</h5>
                                        <input class = "other_input"
                                            readOnly
                                            disabled = {!isEditable}
                                            value= {values.version}
                                            id = "description"
                                            type="text"
                                        />
                                    </Grid>
                                    <Grid class = {classes.SmallPaddedGrip} >
                                        <h5 className="title">Número de serie</h5>
                                        <input class = "other_input"
                                            readOnly
                                            disabled = {!isEditable}
                                            value= {values.serial_number}
                                            id = "description"
                                            type="text"
                                        />
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid item container direction="column" xs spacing={2}>
                            <Grid item xs>
                                <div className={classes.right_container}>
                                    <h5 className="title">Versionado</h5>
                                    <div className="versions">
                                        {getVersions()}
                                    </div>
                                </div>
                            </Grid>
                            </Grid>
                        </Grid>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
  }