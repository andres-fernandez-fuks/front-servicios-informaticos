import React from "react";
import Grid from '@mui/material/Grid';

import { dbGet, dbPatch } from 'utils/backendFetchers';
import "pages/items/ic.css";
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import useStyles from "styles"
import clsx from "clsx";
import CurrencyInput from "react-currency-input-field";
import { formatValue } from 'react-currency-input-field';
import {units, selectStyles} from './SLAItemCreationPage';
import Select from 'react-select'
import toast, { Toaster } from 'react-hot-toast';
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
  Label,
  Row,
  Col,
} from "reactstrap";

import SimpleTable from "components/Table/SimpleTable";
import { dbPost } from "utils/backendFetchers";

export const SLA_ITEM_EDIT_PATH = "/item_edit/sla";

const columns = [
    {"name": "version", "label": "Versión"},
    {"name": "name", "label": "Nombre"},
]

export default function SLADetailsPage() {

    const classes = useStyles();
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    var item_id = paths[paths.length - 1]
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState("");
    const isEditable = false;
    const [enableCreateButton, setEnableCreateButton] = React.useState(false);

    function getPrice(price_string) {
        var price = price_string.split(" ")[1]
        price = parseInt(price.replace(/[^0-9]/g, ''));
        return price;
    }

    function updateCurrentValues(field, new_value) {
        if (field === "price") new_value = getPrice(new_value);
        currentValues[field] = new_value;
        if (JSON.stringify(currentValues) !== JSON.stringify(values)) {
            setEnableCreateButton(true);
        } else {
            setEnableCreateButton(false);
        }
    }

  React.useEffect(() => {
    var change_id = localStorage.getItem("change_id");
    dbGet("configuration-items/hardware/" + item_id + "/draft?change_id=" + change_id, {change_id:change_id}).then(data => {
        setValues({...data});
        setCurrentValues({...data});
    }).catch(err => {console.log(err)});
    }   , []);

    // if (values === '' || values === undefined) {
    //     fetchValues();
    // }

    function getRequestValues() {
        var request_values = {...currentValues};
        delete request_values.change_id;
        delete request_values.last_version;
        delete request_values.item_type;
        delete request_values.current_version_number;
        delete request_values.current_version_id;
        delete request_values.versions;
        delete request_values.version;
        delete request_values.created_at;
        delete request_values.updated_at;
        delete request_values.id;
        delete request_values.is_deleted;
        delete request_values.item_class;
        delete request_values.draft_id;
        return request_values;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        var change_id = localStorage.getItem("change_id");
        var path = "configuration-items/sla/" + values.id + "/draft?change_id=" + change_id;
        var request_values = getRequestValues();
        dbPost(path, request_values).then(data => {
            toast.success("Borrador guardado correctamente");
            history.goBack();
        }
        ).catch(err => {console.log(err)});
    }


    function updateMeasurementUnit(new_measurement_unit){
        //Llama al actualizador del values pasandole todos los datos
        //anteriores pero actualiza la prioridad
        setCurrentValues(currentValues => (
            {...currentValues, measurement_unit:new_measurement_unit}
            ))
      }
    
      
    return (
      <>
        <div className="content">
          <Toaster />
          <Row>
            <Col md="6">
            <Form onSubmit= {handleSubmit}>
            <Card>
                <CardHeader >
                    <h4 className="title">Detalles del borrador</h4>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md="4">
                            <FormGroup>
                                <Label style={{ color:"#1788bd" }}>Nombre</Label>
                                <Input
                                    defaultValue= {currentValues.name}
                                    onChange = {function(e){updateCurrentValues("name", e.target.value)}}
                                    id = "type"
                                    type="text"
                            />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label style={{ color:"#1788bd" }}>Cliente</Label>
                                <Input
                                    defaultValue= {currentValues.client}
                                    onChange = {function(e){updateCurrentValues("client", e.target.value)}}
                                    id = "client"
                                    type="text"
                            />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} >¿Crucial?</Label>
                            <br></br> &nbsp; &nbsp; &nbsp;
                                <Input
                                    id = "is_crucial"
                                    onChange={function(e){updateCurrentValues("is_crucial", e.target.checked)}}
                                    checked = {currentValues.is_crucial}
                                    type="checkbox"/>
                            </FormGroup>
                        </Col>  
                    </Row>
                    <Row>
                        <Col className="pb-md-2" md="12">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="description">Descripción</Label>
                                <Input
                                    defaultValue = {currentValues.description}
                                    onChange = {function(e){updateCurrentValues("description", e.target.value)}}
                                    id = "description"
                                    type="text"
                            />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="type">Tipo de servicio</Label>
                                <Input className="other_input"
                                    defaultValue= {currentValues.service_type}
                                    onChange = {function(e){updateCurrentValues("service_type", e.target.value)}}
                                    id = "service_type"
                                    type="text"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="type">Gerente</Label>
                                <Input className="other_input"
                                    defaultValue= {currentValues.service_manager}
                                    onChange = {function(e){updateCurrentValues("manager", e.target.value)}}
                                    id = "service_manager"
                                    type="text"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="type">Unidad de medida</Label>
                                <Select 
                                    styles={selectStyles}
                                    isDisabled = {!isEditable}
                                    id="measurement_unit"
                                    onChange={function(new_option){updateMeasurementUnit(new_option.value)}}
                                    options={units}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="type">Valor de la medida (numérico)</Label>
                                <Input className="other_input"
                                    defaultValue= {currentValues.measurement_value}
                                    onChange = {function(e){updateCurrentValues("measurement_value", e.target.value)}}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }}
                                    id = "measurement_value"
                                    type="number"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4">
                            <FormGroup>
                                <Label style={{ color:"#1788bd" }}>Fecha de inicio</Label>
                                <Input  className="other_input"
                                    defaultValue = {currentValues.starting_date}
                                    onChange = {function(e){updateCurrentValues("starting_date", e.target.value)}}
                                    id = "starting_date"
                                    type="date"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }}>Fecha de fin</Label>
                                <Input  className="other_input"
                                    defaultValue = {currentValues.ending_date}
                                    onChange = {function(e){updateCurrentValues("ending_date", e.target.value)}}
                                    id = "ending_date"
                                    type="text"
                            />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} >Versión</Label>
                                <Input
                                    readOnly
                                    defaultValue = {currentValues.version}
                                    id = "description"
                                    type="text"/>
                            </FormGroup>
                        </Col>  
                    </Row>
                </CardBody>
                <CardFooter className="form_col">
                    <Button className="btn btn-primary"
                    disabled = {!enableCreateButton}
                    color="primary"
                    type="submit"
                    >
                    Guardar        
                </Button>
                </CardFooter>
            </Card>
            </Form>
            </Col>
            <Col md="6">
            </Col>
          </Row>
        </div>
      </>
    );
  }