/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import Grid from '@mui/material/Grid';
import { dbGet, dbPatch } from 'utils/backendFetchers';
import "pages/ic.css";
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import useStyles from "styles"
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form
} from "reactstrap";

export const SOFTWARE_ITEM_DETAILS_PATH = "/item_details/software";

const tableData = [];

function ProblemDetails(props) {
  var classes = useStyles();
  const history = useHistory();
  var paths = window.location.pathname.split("/") 
  var item_id = paths[paths.length - 1]
  const [values, setValues] = React.useState("");
  const isEditable = false;

  React.useEffect(() => {
    dbGet("configuration-items/software/" + item_id).then(data => {
        debugger;
        setValues(data);
    }).catch(err => {console.log(err)});
    }   , []);

  function fetchValues() {
        dbGet("configuration-items/software/" + item_id).then(data => {
            setValues(data);
        }).catch(err => {console.log(err)});
      }  

  console.log("Values: ", values)

  if (values === '' || values === undefined) {
    fetchValues();
  }

  return (
    <>
      <div className="content">
            <Card>
              <CardHeader >
                <h4 className="title">Detalles del ítem</h4>
              </CardHeader>
              <CardBody>
                <Form disabled>
                <Grid class = {classes.SmallPaddedGrip} >
                    <h5 className="title">Nombre</h5>
                    <input class = "other_input"
                        readOnly
                        disabled = {!isEditable}
                        value= {values.name}
                        id = "name"
                        type="text"
                    />
                </Grid>
                <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Descripción</h5>
                        <input className="description_input"
                          readOnly
                          disabled = {!isEditable}
                          value= {values.description}
                          id = "description"
                          type="text"
                        />
                </Grid>
                <Grid class = {classes.SmallPaddedGrip} >
                    <h5 className="title">Tipo de software</h5>
                    <input class = "other_input"
                        readOnly
                        disabled = {!isEditable}
                        value= {values.type}
                        id = "description"
                        type="text"
                    />
                </Grid>
                <Grid class = {classes.SmallPaddedGrip} >
                    <h5 className="title">Proveedor</h5>
                    <input class = "other_input"
                        readOnly
                        disabled = {!isEditable}
                        value= {values.provider}
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
                    <h5 className="title">Versión de software</h5>
                    <input class = "other_input"
                        readOnly
                        disabled = {!isEditable}
                        value= {values.software_version}
                        id = "description"
                        type="text"
                    />
                </Grid>
            </Form>
        </CardBody>
        <CardFooter align="center">
        </CardFooter>
    </Card>
      </div>
    </>
  );
}

export default ProblemDetails;
