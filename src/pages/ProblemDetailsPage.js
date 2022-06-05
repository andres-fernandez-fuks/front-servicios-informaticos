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
import toast, { Toaster } from 'react-hot-toast';

import SimpleTable from "components/Table/SimpleTable";
export const PROBLEM_DETAILS_PATH = "/problems_details";

const tableData = [];
const incidentColumns = [
    {"name": "id", "label": "ID"},
    {"name": "description", "label": "Descripción"},
    {"name": "status", "label": "Estado"}
]


function ProblemDetails(props) {
  var classes = useStyles();
  const history = useHistory();
  var paths = window.location.pathname.split("/") 
  var problem_id = paths[paths.length - 1]
  const [incidentsData, setIncidentsData] = React.useState([]);
  const [confItems, setConfItems]  = React.useState([]);
  const [values, setValues] = React.useState("");
  const [bigChartData, setbigChartData] = React.useState(tableData);
  const [columns, setColumns] = React.useState(incidentColumns);
  const isEditable = false;

  React.useEffect(() => {
    dbGet("problems/" + problem_id).then(data => {
        setValues(data);
    }).catch(err => {console.log(err)});
    }   , []);

    function fetchIncidentsData() {
        dbGet("problems/" + problem_id).then(data => {
            var incidents_data = data["incidents"]
            setIncidentsData(incidents_data);
        }).catch(err => {console.log(err)});
    }
  console.log("Values: ", values)

  function fetchValues() {
    dbGet("problems/" + problem_id).then(data => {
        setValues(data);
    }).catch(err => {console.log(err)});
}

  React.useEffect(() => {
    dbGet("configuration-items/names").then(data => {
        setConfItems(data["items"]);
    }).catch(err => {console.log(err)});
    }   , []);

    const [formFields, setFormFields] = React.useState([{}])

    function solveProblem() {
        var patch_data = {status:"Resuelto"}
        dbPatch("problems/" + problem_id, patch_data);
        history.push(simple_routes.problems);
    }

    function blockProblem() {
        var patch_data = {is_blocked:true}
        dbPatch("problems/" + problem_id, patch_data);
        // history.push(simple_routes.problems);
        window.location.reload(false);
    }

    function unblockProblem() {
        var patch_data = {is_blocked:false}
        dbPatch("problems/" + problem_id, patch_data);
        // history.push(simple_routes.problems);
        window.location.reload(false);
    }

  const submitForm = (data) => { 
      var patch_data = {taken_by:localStorage.getItem("username")}
      dbPatch("problems/" + problem_id, patch_data);
      history.push(simple_routes.problems);
  }

  if (!incidentsData || incidentsData.length === 0) {
    fetchIncidentsData();
  }

  function addBlockButton() {
    if (values.is_blocked === true) {
        return (
            <Button className="btn-fill" align="left"
            color="warning"
            type="submit"
            onClick={() => unblockProblem()}
            >
            Desbloquear        
            </Button>
        )
    }
    return (
        <Button className="btn-fill" align="left"
        color="warning"
        type="submit"
        onClick={() => blockProblem()}
        >
        Bloquear        
        </Button>  
    )
  }

  function addButtons() {
      if (values === '') {
      fetchValues();
    }
    if (values.status === "Resuelto") {
        return;
    }
    if (!values.taken_by) {
        return (
        <Button className="btn-fill"
        color="primary"
        type="submit"
        onClick={() => submitForm()}
        >
        Tomar        
        </Button>)
    }
    if (values.taken_by !== undefined) {
    return (
        <Grid align="center">
        <Button className="btn-fill" align="right"
        color="success"
        type="submit"
        onClick={() => solveProblem()}
        >
        Resolver        
        </Button>
        {addBlockButton()}
        </Grid>)
    }
  }

  return (
    <>
      <div className="content">
        <Toaster />
            <Card>
              <CardHeader >
                <h4 className="title">Detalles del problema</h4>
              </CardHeader>
              <CardBody>
                <Form disabled>
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
                      <h5 className="title">Prioridad</h5>
                        <input class = "other_input"
                          readOnly
                          disabled = {!isEditable}
                          value= {values.priority}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Estado</h5>
                        <input class = "other_input"
                          readOnly
                          disabled = {!isEditable}
                          value= {values.status}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Creado por</h5>
                        <input class = "other_input"
                          readOnly
                          disabled = {!isEditable}
                          value= {values.created_by}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Tomado por</h5>
                        <input class = "other_input"
                          readOnly
                          disabled = {!isEditable}
                          placeholder = "Nadie..."
                          value= {values.taken_by}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                    <Grid class = {classes.PaddedGrid} >
                    <h5> <b>Ítems de configuración</b></h5>
                    <SimpleTable data={incidentsData} columns={columns} />
                    </Grid>
                </Form>
              </CardBody>
              <CardFooter align="center">
                {addButtons()}
              </CardFooter>
            </Card>
      </div>
    </>
  );
}

export default ProblemDetails;
