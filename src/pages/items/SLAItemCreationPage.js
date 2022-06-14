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
import Select from 'react-select'


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

export const SLA_ITEM_DETAILS_PATH = "/item_details/sla";
export const SLA_ITEM_CREATION_PATH = "/item_creation/sla";
const columns = [
    {"name": "version", "label": "Versión"},
    {"name": "name", "label": "Nombre"},
]
const priorities = [
    { value: 'Alta', label: 'Alta' },
    { value: 'Media', label: 'Media' },
    { value: 'Baja', label: 'Baja' }
  ]
export default function SLACreationPage() {
    const classes = useStyles();
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    var item_id = paths[paths.length - 1]
    const [values, setValues] = React.useState({});
    const [currentValues, setCurrentValues] = React.useState({});
    const [enableCreateButton, setEnableCreateButton] = React.useState(true);

    const selectStyles = { 
        menu: styles => ({
            ...styles,
            zIndex: 999,
            borderBottom: '1px dotted pink',
            color: "white",
            backgroundColor: "#27293d"
        }),
        control: styles => ({
            ...styles,
            backgroundColor: "#27293d"
        }),
        input: styles => ({
            ...styles,
            backgroundColor: "#27293d"
        }),
        option: (styles, {isFocused}) => ({
            ...styles,
            backgroundColor: isFocused ? "#1d253b" : "#27293d"
        })};

    function updateMeasurementUnit(new_measurement_unit){
        //Llama al actualizador del values pasandole todos los datos
        //anteriores pero actualiza la prioridad
        setCurrentValues({...currentValues, measurement_unit:new_measurement_unit})
        debugger
      }
    function updateCurrentValues(field, new_value) {
        debugger
        currentValues[field] = new_value;
    }




    function getRequestValues() {
        var request_values = {...currentValues};
        delete request_values.versions;
        delete request_values.version;
        delete request_values.created_at;
        delete request_values.updated_at;
        delete request_values.id;
        delete request_values.is_deleted;
        delete request_values.item_class;
        return request_values;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        var path = "configuration-items/sla";
        var request_values = getRequestValues();
        dbPost(path, request_values).then(data => {
            
            history.push("/admin" + SLA_ITEM_DETAILS_PATH + "/" + data.id);
            window.location.reload();
        }
        ).catch(err => {console.log(err)});
    }

    function updateType(new_type) {
        setValues({...values, type:new_type})
    }

    function currencyFormat(num) {
        if (!num) return;
        return '$ ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
     }

    return (
      <>
        <div className="content">
          <Row>
            <Col md="6">
            <Form onSubmit= {handleSubmit}>
            <Card>
                <CardHeader >
                    <h4 className="title">Crear un SLA</h4>
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
                                    defaultValue= {currentValues.name}
                                    onChange = {function(e){updateCurrentValues("client", e.target.value)}}
                                    id = "type"
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
                                    id = "type"
                                    type="text"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="type">Gerente</Label>
                                <Input className="other_input"
                                    defaultValue= {currentValues.service_manager}
                                    onChange = {function(e){updateCurrentValues("service_manager", e.target.value)}}
                                    id = "type"
                                    type="text"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="type">Unidad de medida</Label>
                                <Input className="other_input"
                                    defaultValue= {currentValues.service_type}
                                    onChange = {function(e){updateCurrentValues("measurement_unit", e.target.value)}}
                                    id = "type"
                                    type="text"
                                />
                                <Select styles={selectStyles}
                                    id="priority"
                                    value={{value: currentValues.measurement_unit, label: currentValues.measurement_unit }}
                                    onChange={function(new_option){updateMeasurementUnit("measurement_unit", new_option.value)}}
                                    options={priorities}
                                    autoFocus
                    />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="type">Valor de la medida</Label>
                                <Input className="other_input"
                                    defaultValue= {currentValues.service_manager}
                                    onChange = {function(e){updateCurrentValues("measurement_value", e.target.value)}}
                                    id = "type"
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
                                    id = "serial_number"
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
                                    id = "serial_number"
                                    type="date"
                            />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} >Versión</Label>
                                <Input
                                    readOnly
                                    defaultValue = {1}
                                    id = "version"
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
          </Row>
        </div>
      </>
    );
  }