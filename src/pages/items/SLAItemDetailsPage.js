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
import {DisabledInput} from "components/Form/DisabledInput.js";

import SimpleTable from "components/Table/SimpleTable";
import { dbPost } from "utils/backendFetchers";
import ItemMultiTable from "components/Form/ItemMultiTable";

export const SLA_ITEM_DETAILS_PATH = "/item_details/sla";

const columns = [
    {"name": "version_number", "label": "Versión"},
    {"name": "created_at", "label": "Fecha de creación"},
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
    const [counter, setCounter] = React.useState(-1);

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

    function updateMeasurementUnit(new_measurement_unit){
        //Llama al actualizador del values pasandole todos los datos
        //anteriores pero actualiza la prioridad
        setCurrentValues(currentValues => (
            {...currentValues, measurement_unit:new_measurement_unit}
            ))
      }
  React.useEffect(() => {
    dbGet("configuration-items/sla/" + item_id).then(data => {
        setValues({...data});
        setCurrentValues({...data});
    }).catch(err => {console.log(err)});
    }   , []);

    function fetchValues() {
            dbGet("configuration-items/sla/" + item_id).then(data => {
                setValues(data);
            }).catch(err => {console.log(err)});
    }

    function checkVersion(request_path, redirect_path, version_number) {
        dbGet(request_path + "/" + version_number).then(data => {
            setValues({...data});
            setCurrentValues({...data});
            setCounter(counter - 1);
        }).catch(err => {console.log(err)});
    }


    return (
      <>
        <div className="content">
          <Toaster />
          <Row>
            <Col md="6">
            <Form>
            <Card>
                <CardHeader >
                    <h4 className="title">Detalles del SLA</h4>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md="4">
                            <FormGroup>
                                <Label style={{ color:"#1788bd" }}>Nombre</Label>
                                <DisabledInput
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
                                <DisabledInput
                                    
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
                                    disabled
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
                                <DisabledInput
                                    
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
                                <DisabledInput
                                    
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
                                <DisabledInput
                                    
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
                                <DisabledInput
                                    defaultValue = {currentValues.measurement_unit}
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
                            <Label style={{ color:"#1788bd" }} for="type">Valor de la medida</Label>
                                <DisabledInput
                                    
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
                                <DisabledInput  className="other_input"
                                    
                                    defaultValue = {currentValues.starting_date}
                                    onChange = {function(e){updateCurrentValues("starting_date", e.target.value)}}
                                    id = "starting_date"
                                    type="text"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }}>Fecha de fin</Label>
                                <DisabledInput  className="other_input"
                                    
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
                                <DisabledInput
                                    readOnly
                                    defaultValue = {currentValues.current_version_number}
                                    id = "description"
                                    type="text"/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="description">Último cambio asociado</Label>
                                <DisabledInput
                                    readOnly
                                    defaultValue = {currentValues.change && currentValues.change.description}
                                    id = "description"
                                    type="text"/>
                            </FormGroup>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter style={{justifyContent:"center"}}>
                <center>
                <Button className="btn-fill"
                        color="warning"
                        onClick={() => history.go(counter ? counter : -1)}
                        >
                        Volver        
                </Button>
                </center>
                </CardFooter>
            </Card>
            </Form>
            </Col>
            <Col md="6" className="multi-table-parent-col">
                <ItemMultiTable
                    item_id = {item_id}
                    item_type = "sla"
                    item_details_path = {SLA_ITEM_DETAILS_PATH}
                    check_version_function = {checkVersion}
                    versions = {values.versions}
                    comments = {values.comments}
                />
            </Col>
          </Row>
        </div>
      </>
    );
  }