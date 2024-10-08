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
import { selectStyles } from "./items/SLAItemCreationPage";
// reactstrap components
import {
  Button,
  Card,
  Row,
  Label,
  Input,
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
        value = event["value"];
        data[index] = value;
        setFormFields(data);
        setItemValues([...itemValues, value]);
    }
    formData[field] = value;
  }

  const removeFields = (index) => {
    let data = [...formFields];
    delete formData["item_name_"+index]
    for (let i = index+1; i < data.length; i++) {
      let aux = formData["item_name_"+i]
      delete formData["item_name_"+i]
      formData["item_name_"+(i-1)] = aux
    } 
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
      dbPost("incidents", formData).then(data => {
        toast.success("Incidente creado correctamente");
        history.push(simple_routes.incidents);
      }).catch(err => {console.log(err)});
  }

  function getItemValue(index){
    if (formFields.length == 0 || Object.entries(formFields[index]).length == 0){
      return 
    }else {
      return { value: formFields[index], label: formFields[index] }
    }
  }

  return (
    <>
      <div className="content">
          <div className={classes.centeredDiv}>
      <Toaster/>
      <Form >
        <Card style={{ width: '40rem' }}>
          <CardHeader >
            <h4 className="title">Creación de Incidente</h4>
          </CardHeader>
          <CardBody>
              <Grid className = {classes.SmallPaddedGrip} >
              <FormGroup>
                <Label style={{ color:"#1788bd" }}>Descripción</Label>
                <Input className="left_aligned_input"
                    required
                    id="description"
                    label="Descripción"
                    placeholder="Ingrese una descripción"
                    type="text"
                />
              </FormGroup>
              </Grid>
              <Grid className = {classes.MediumPaddedGrip}> 
              <Row>
                <Col md="10">
                
                  <FormGroup>
                    <Label style={{ color:"#1788bd" }} for="type">Prioridad</Label>
                    <Select 
                        styles={selectStyles}
                        id="priority"
                        onChange={function(new_option){updatePriority(new_option.value)}}
                        options={priorities}
                        autoFocus
                        placeholder="Seleccione una prioridad"
                    />
                  </FormGroup>
                  </Col>
              </Row>
              </Grid>
              <Grid className = {classes.PaddedGrip}>
              <Label style={{ color:"#1788bd" }} for="type">Ítems de configuración</Label>
              {formFields.map((form, index) => {
                  return (
                  <Grid item md="12">   
                  <div key={index} >
                    <Row className="row_div">
                    <Col md="10">
                    <Select
                        id={"item" + index+2}
                        options={confItems}
                        value={getItemValue(index)}
                        onChange={event => handleFormChange(event, index, "item_name_"+index)}
                        search
                        filterOptions={fuzzySearch} 
                        placeholder="Buscar ítem de configuración"
                        styles={selectStyles}
                    />
                    </Col>
                    <Col md="2"> 
                    <IconButton 
                        style={{outline: 'none'}}
                        size="medium" 
                        aria-label="delete"
                        color="primary"
                        onClick={() => removeFields(index)}
                        >
                        <DeleteIcon className={classes.onlyButtonNoSpacing}/>
                    </IconButton>
                    </Col>
                    </Row>
                    </div>
                  
                  </Grid>
                  )
                  })}
                  <Row> <Col>
                  <Button size="sm" style={{backgroundColor:"#00B1E1" }} onClick={addFields}>Nuevo ítem</Button>
                  </Col></Row> 
          
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
          </Grid>
          </CardBody>
        </Card>
        </Form>
        </div>
      </div>
    </>
  );
}

export default IncidentCreation;
