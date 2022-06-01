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
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SelectSearch, { fuzzySearch } from "react-select-search";
import { dbGet, dbPatch } from 'utils/backendFetchers';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import "pages/ic.css";
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import DynamicTable from "components/Table/DynamicTable"
import useStyles from "styles"
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

import Select from 'react-select'
import SimpleTable from "components/Table/SimpleTable";
import { ValueAxis } from "devextreme-react/range-selector";

const options = [
  { value: 'Alta', label: 'Alta' },
  { value: 'Media', label: 'Media' },
  { value: 'Baja', label: 'Baja' }
]



const formData = {};
export const INCIDENT_DETAILS_PATH = "/incidents_details";

const tableData = [];
const ciItemColumns = [
    {"name": "id", "label": "ID"},
    {"name": "name", "label": "Descripción"},
    {"name": "type", "label": "Tipo"}
]
const priorities = [{"name":"Alta"}, {"name":"Media"}, {"name":"Baja"},]


function IncidentDetails(props) {
  var classes = useStyles();
  const history = useHistory();
  var paths = window.location.pathname.split("/") 
  var incident_id = paths[paths.length - 1]
  const [itemsData, setItemsData] = React.useState([]);

  const [confItems, setConfItems]  = React.useState([]);
  const [values, setValues] = React.useState("");
  const [bigChartData, setbigChartData] = React.useState(tableData);
  const [columns, setColumns] = React.useState(ciItemColumns);
  const isEditable = false
  React.useEffect(() => {
    dbGet("incidents/" + incident_id).then(data => {
        setValues(data);
    }).catch(err => {console.log(err)});
    }   , []);

    function fetchItemsData() {
        dbGet("incidents/" + incident_id).then(data => {
            var items_data = data["configuration_items"]
            setItemsData(items_data);
        }).catch(err => {console.log(err)});
    }
  console.log("Values: ", values)

  function fetchValues() {
    dbGet("incidents/" + incident_id).then(data => {
        setValues(data);
    }).catch(err => {console.log(err)});
}

  React.useEffect(() => {
    dbGet("configuration-items/names").then(data => {
        setConfItems(data["items"]);
    }).catch(err => {console.log(err)});
    }   , []);

    const [formFields, setFormFields] = React.useState([{}])

    function solveIncident() {
        var patch_data = {status:"Resuelto"}
        dbPatch("incidents/" + incident_id, patch_data);
        history.push(simple_routes.incidents);
    }

    function blockIncident() {
        var patch_data = {is_blocked:true}
        dbPatch("incidents/" + incident_id, patch_data);
        // history.push(simple_routes.incidents);
        window.location.reload(false);
    }

    function unblockIncident() {
        var patch_data = {is_blocked:false}
        dbPatch("incidents/" + incident_id, patch_data);
        // history.push(simple_routes.incidents);
        window.location.reload(false);
    }

  const submitForm = (data) => { 
      var patch_data = {taken_by:"SuperAdmin"}
      dbPatch("incidents/" + incident_id, patch_data);
      history.push(simple_routes.incidents);
  }

  if (itemsData.length === 0) {
    fetchItemsData();
  }

  function addBlockButton() {
    if (values.is_blocked === true) {
        return (
            <Button className="btn-fill" align="left"
            color="warning"
            type="submit"
            onClick={() => unblockIncident()}
            >
            Desbloquear        
            </Button>
        )
    }
    return (
        <Button className="btn-fill" align="left"
        color="warning"
        type="submit"
        onClick={() => blockIncident()}
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
        onClick={() => solveIncident()}
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
            <Card>
              <CardHeader >
                <h4 className="title">Detalles del incidente</h4>
              </CardHeader>
              <CardBody>
                <Form disabled>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Descripción</h5>
                        <input
                          readOnly
                          disabled = {!isEditable}
                          value= {values.description}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Prioridad</h5>
                        <input
                          readOnly
                          disabled = {!isEditable}
                          value= {values.priority}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Estado</h5>
                        <input
                          readOnly
                          disabled = {!isEditable}
                          value= {values.status}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Creado por</h5>
                        <input
                          readOnly
                          disabled = {!isEditable}
                          value= {values.created_by}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  <Grid class = {classes.SmallPaddedGrip} >
                      <h5 className="title">Tomado por</h5>
                        <input
                          readOnly
                          disabled = {!isEditable}
                          placeholder = "Nadie..."
                          value= {values.taken_by}
                          id = "description"
                          type="text"
                        />
                  </Grid>
                  {/* <Grid class = {classes.SmallPaddedGrip}>
                    <Col className="px-md-1" md="3">
                      <FormGroup>
                      <h5 className="title">Prioridad</h5>
                        <Select
                            id="priority"
                            value={{ value: values.priority, label: values.priority }}
                            onChange={function(new_option){updatePriority(new_option.value)}}
                            options={options}
                        />
                      </FormGroup>
                    </Col>
                  </Grid> */}
                    <Grid class = {classes.PaddedGrid} >
                    <h5> <b>Ítems de configuración</b></h5>
                    <SimpleTable data={itemsData} columns={columns} />
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

export default IncidentDetails;
