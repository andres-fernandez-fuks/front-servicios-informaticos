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
import SelectSearch, { fuzzySearch } from "react-select-search";
import { dbGet, dbPost } from 'utils/backendFetchers';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import "pages/ic.css";
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import useStyles from "styles"
import toast, { Toaster } from 'react-hot-toast';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Col,
} from "reactstrap";

import Select from 'react-select'

const formData = {};


function ErrorCreation(props) {
  var classes = useStyles();
  const history = useHistory();

  const [incidents, setIncidents]  = React.useState([]);
  const [values, setValues] = React.useState("");
  const [formFields, setFormFields] = React.useState([{}])
  const [incidentValues, setIncidentValues] = React.useState([])

  React.useEffect(() => {
    dbGet("incidents/names").then(data => {
        setIncidents(data["incidents"]);
    }).catch(err => {console.log(err)});
    }   , []);

  const handleFormChange = (event, index, field) => {
    let value;
    let data = [...formFields];
    if (field === "description" || field === "solution") {
        value = event.target.value;
        data[index] = value;
    }
    else {
        value = event;
        data[index] = value;
        setFormFields(data);
        setIncidentValues([...incidentValues, value]);
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

  const exitForm = () => { 
    history.push(simple_routes.errors);
    }

  const submitForm = (e) => {
      if (!document.getElementById('description').value){
        toast.error("Debe escribir una descripción para el error")
        return
      } else if (!document.getElementById('solution').value) {
        toast.error("Debe escribir una solucion para el error")
        return
      } else if(incidentValues.length === 0){
        toast.error("Debe relacionar por lo menos un incidente")
        return
      }
      formData["created_by"] = localStorage.getItem("username");
      formData["description"] = document.getElementById('description').value;
      formData["solution"] = document.getElementById('solution').value;
      dbPost("errors", formData);
      history.push(simple_routes.errors);
      toast.success("Error creado correctamente")
  }

  const selectStyles = { menu: styles => ({ ...styles, zIndex: 999 }) };

  return (
    <>
        <div className="content">
            <div className={classes.centeredDiv}>
        <Toaster/>
        <Form onSubmit="return false" className="center-div">
            <Card style={{ width: '40rem' }} className="creation-card">
            <CardHeader >
                <h4 className="title">Creación de Error</h4>
            </CardHeader>
            <CardBody>
                <Grid className = {classes.SmallPaddedGrip} >
                    <h5 className="title">Descripción</h5>
                    <input class="heighttext"
                        name="description"
                        required
                        id="description"
                        label="Descripción"
                        autoFocus
                        autoComplete="off"
                        placeholder="Ingrese una descripción"
                    />
                </Grid>
                <Grid className = {classes.SmallPaddedGrip} >
                    <h5 className="title">Solución</h5>
                    <input class="heighttext"
                        name="solution"
                        required
                        id="solution"
                        label="Solución"
                        autoFocus
                        autoComplete="off"
                        placeholder="Ingrese una solución"
                    />
                </Grid>
                <Grid className = {classes.MediumPaddedGrip}>
                    <Col className="px-md-1" md="3">
                    </Col>
                </Grid>
                    <Grid className = {classes.PaddedGrip}>
                    <h5> <b>Incidentes</b></h5>
                        {formFields.map((form, index) => {
                            return (
                            <Grid item xs={12}>
                            <div key={index} className="row_div">
                            <SelectSearch
                                id={"incident" + index+2}
                                options={incidents}
                                value={incidentValues[index]}
                                onChange={event => handleFormChange(event, index, "incident_name_"+index)}
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
                            <Button size="sm" style={{backgroundColor:"#00B1E1" }} onClick={addFields}>Nuevo Error</Button>
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
      </div>
    </>
  );
}

export default ErrorCreation;