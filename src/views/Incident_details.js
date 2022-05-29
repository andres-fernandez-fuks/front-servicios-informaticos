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
import { dbGet, dbPost } from 'utils/backendFetchers';
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

const options = [
  { value: 'Alta', label: 'Alta' },
  { value: 'Media', label: 'Media' },
  { value: 'Baja', label: 'Baja' }
]



const formData = {};
export const INCIDENT_DETAILS_PATH = "/incidents_details";

const tableData = [];
const ciItemColumns = [
    {"name": "id", "label": "id"},
    {"name": "description", "label": "Descripción"},
    {"name": "type", "type": "ci_item_type"}
]
const priorities = [{"name":"Alta"}, {"name":"Media"}, {"name":"Baja"},]


function IncidentDetails(props) {
  var classes = useStyles();
  const history = useHistory();
  const [selectedOption, setSelectedOption] = React.useState(null);

  var paths = window.location.pathname.split("/") 
  var incident_id = paths[paths.length - 1]

  const [confItems, setConfItems]  = React.useState([]);
  const [values, setValues] = React.useState("");
  const [bigChartData, setbigChartData] = React.useState(tableData);
  const [columns, setColumns] = React.useState(ciItemColumns);

  React.useEffect(() => {
    dbGet("incidents/" + incident_id).then(data => {
        setValues(data);
        setSelectedOption(values.priority)
    }).catch(err => {console.log(err)});
    }   , []);

  console.log("Values: ", values)


  React.useEffect(() => {
    dbGet("configuration-items/names").then(data => {
        setConfItems(data["items"]);
    }).catch(err => {console.log(err)});
    }   , []);

    const [formFields, setFormFields] = React.useState([{}])

    const removeFields = (index) => {
        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data)
      }

    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      });
    };
    

  const handleFormChange = (event, index, field) => {
    let value;
    let data = [...formFields];
    if (field === "description" || field === "priority") {
        value = event.target.value;
        data[index] = value;
    }
    else {
        value = event;
        data[index] = value;
        setFormFields(data);
        setValues([...values, value]);
    }
    formData[field] = value;
  }

  const exitForm = () => { 
    history.push(simple_routes.incidents);
    }

  const submitForm = (data) => { 
      formData["created_by"] = "SuperAdmin";
      dbPost("incidents", formData);
      history.push(simple_routes.incidents);
  }

  const addFields = () => {
    let object = {};

  setFormFields([...formFields, object])
  }
  
  function getConfigurationItem(values, type, index){
    if (!values ) return
    if (type in values && (values[type].length > 0)){
      return values[type][index].name
    }

  }

  
  return (
    <>
      <div className="content">
        <Row>
            <Card>
              <CardHeader>
                <h5 className="title">Edit Incident</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="px-md-1" md="3">
                      <FormGroup>
                        <label>Descripción</label>
                        <Input
                          defaultValue= {values.description}
                          placeholder="description"
                          id = "description"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="px-md-1" md="3">
                      <FormGroup>
                        <label>Prioridad</label>
                        <Select
                            defaultValue={{label: values.priority, value: "Alta"}}
                            onChange={setSelectedOption}
                            options={options}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  
                    <Grid class = {classes.PaddedGrid}>
                    <h6 >Hardware configuration items</h6>
                    <DynamicTable data={values["hardware_configuration_items"]} columns={columns} 
                    edit_details_path = {INCIDENT_DETAILS_PATH}
                    />
                    <h6 >Software configuration items</h6>
                    <DynamicTable data={values["software_configuration_items"]} columns={columns} 
                    edit_details_path = {INCIDENT_DETAILS_PATH}
                    />
                    <h6 >SLA configuration items</h6>
                    <DynamicTable data={values["sla_configuration_items"]} columns={columns} 
                    edit_details_path = {INCIDENT_DETAILS_PATH}
                    />
                    </Grid>
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-fill" color="primary" type="submit">
                  Save (doesnt work yet)
                </Button>
              </CardFooter>
            </Card>
        </Row>
      </div>
    </>
  );
}

export default IncidentDetails;
