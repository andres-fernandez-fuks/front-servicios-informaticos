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
import SimpleTable from "components/Table/SimpleTable";
import { ValueAxis } from "devextreme-react/range-selector";

const priorities = [
  { value: 'Alta', label: 'Alta' },
  { value: 'Media', label: 'Media' },
  { value: 'Baja', label: 'Baja' }
]



const formData = {};
export const INCIDENT_DETAILS_PATH = "/incidents_details";

const tableData = [];
const ciItemColumns = [
    {"name": "id", "label": "id"},
    {"name": "name", "label": "Descripción"},
    {"name": "type", "label": "Tipo"}
]


function IncidentCreation(props) {
  var classes = useStyles();
  const history = useHistory();

  const [confItems, setConfItems]  = React.useState([]);
  const [values, setValues] = React.useState("");
  const [formFields, setFormFields] = React.useState([{}])
  const [itemValues, setItemValues] = React.useState([])

  React.useEffect(() => {
    dbGet("configuration-items/names").then(data => {
        setConfItems(data["items"]);
    }).catch(err => {console.log(err)});
    }   , []);

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
        setItemValues([...itemValues, value]);
    }
    formData[field] = value;
  }

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
  }

  const addFields = () => {
    let object = {};
    setFormFields([...formFields, object])
  }

  function updatePriority(new_priority){
    //Llama al actualizador del values pasandole todos los datos
    //anteriores pero actualiza la prioridad
    setValues({...values, priority:new_priority})
  }

  const exitForm = () => { 
    history.push(simple_routes.incidents);
    }

  const submitForm = (e) => {
      if (!values.priority) {
        alert("Debe seleccionar una prioridad")
        return
      } else if(itemValues.length == 0){
        alert("Debe relacionar por lo menos un ítem de configuración")
        return
      }
      formData["created_by"] = "SuperAdmin";
      formData["description"] = document.getElementById('description').value;
      formData["priority"] = values.priority;
      dbPost("incidents", formData);
      history.push(simple_routes.incidents);
  }

  const selectStyles = { menu: styles => ({ ...styles, zIndex: 999 }) };

  return (
    <>
      <div className="content">
          <Form onsubmit="return false">
            <Card>
              <CardHeader >
                <h4 className="title">Detalles del incidente</h4>
              </CardHeader>
              <CardBody>
                  <Grid className = {classes.SmallPaddedGrip} >
                      <h5 className="title">Descripción</h5>
                      <input size="40"
                        name="description"
                        required
                        id="description"
                        label="Descripción"
                        autoFocus
                        autoComplete="off"
                        placeholder="Ingrese una descripción"
                      />
                  </Grid>
                  <Grid className = {classes.SmallPaddedGrip}>
                    <Col className="px-md-1" md="3">
                      <FormGroup>
                      <h5 className="title">Prioridad</h5>
                        <Select styles={selectStyles}
                            id="priority"
                            value={{ value: values.priority, label: values.priority }}
                            onChange={function(new_option){updatePriority(new_option.value)}}
                            options={priorities}
                            autoFocus
                        />
                      </FormGroup>
                    </Col>
                  </Grid>
                    <Grid className = {classes.PaddedGrip}>
                    <h5> <b>Ítems de configuración</b></h5>
                        {formFields.map((form, index) => {
                            return (
                            <Grid item xs={12}>
                            <div key={index} className="row_div">
                            <SelectSearch
                                id={"item" + index+2}
                                options={confItems}
                                value={itemValues[index]}
                                onChange={event => handleFormChange(event, index, "item_name_"+index)}
                                search
                                filterOptions={fuzzySearch} 
                                placeholder="Search something"
                            />
                            &nbsp; &nbsp; &nbsp;
                            <IconButton
                                    size="medium" 
                                    aria-label="delete"
                                    color="primary"
                                    onClick={() => removeFields(index)}
                                    >
                                    <DeleteIcon/>
                                </IconButton>
                            </div>
                            </Grid>
                            )
                            })}
                            <Button size="sm" style={{backgroundColor:"#00B1E1" }} onClick={addFields}>Nuevo ítem</Button>
                        </Grid>
              </CardBody>
              <CardFooter align="center">
              <Button className="btn-fill"
                color="success"
                type="submit"
                onClick={(e) => {e.preventDefault(); submitForm()}}
                >
                Crear        
              </Button>
              <Button className="btn-fill"
                color="warning"
                onClick={() => exitForm()}
                >
                Volver        
              </Button>
              </CardFooter>
              
            </Card>
            </Form>
      </div>
    </>
  );
}

export default IncidentCreation;
