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
import useStyles from "styles";
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
import toast, { Toaster } from 'react-hot-toast';

const priorities = [
  { value: 'Alta', label: 'Alta' },
  { value: 'Media', label: 'Media' },
  { value: 'Baja', label: 'Baja' }
]

const formData = {};

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
      if (!document.getElementById('description').value){
        toast.error("Debe escribir una descripción para el incidente")
        return
      } else if (!values.priority) {
        toast.error("Debe seleccionar una prioridad")
        return
      } else if(itemValues.length === 0){
        toast.error("Debe relacionar por lo menos un ítem de configuración")
        return
      }
      formData["created_by"] = localStorage.getItem("username");
      formData["description"] = document.getElementById('description').value;
      formData["priority"] = values.priority;
      dbPost("incidents", formData);
      history.push(simple_routes.incidents);
      toast.success("Incidente creado correctamente")

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
            <h4 className="title">Creación de Incidente</h4>
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
              <Grid className = {classes.MediumPaddedGrip}>
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
                <Grid className = {classes.MediumPaddedGrip}>
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
                                className={classes.onlyButtonNoSpacing}
                                size="medium" 
                                aria-label="delete"
                                color="inherit"
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
          <Button className="btn btn-primary"
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

export default IncidentCreation;
