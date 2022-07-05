import React from "react";
import Grid from '@mui/material/Grid';
import {DatePicker} from "react"

import { dbGet, dbPatch } from 'utils/backendFetchers';
import "pages/items/ic.css";
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import useStyles from "styles"
import clsx from "clsx";
import CurrencyInput from "react-currency-input-field";
import { formatValue } from 'react-currency-input-field';
import toast, { Toaster } from 'react-hot-toast';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import "moment/locale/es";
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
import { HARDWARE_ITEM_DETAILS_PATH } from "pages/items/HardwareItemDetailsPage";
import { DisabledInput } from "components/Form/DisabledInput";
import SimpleTable from "components/Table/SimpleTable";
import { dbPost } from "utils/backendFetchers";

export const ITEM_DETAILS_PATH = "/item_details";
export const HARDWARE_ITEM_CREATION_PATH = "/item_creation/hardware";

const columns = [
    {"name": "version_number", "label": "Versión"},
    {"name": "name", "label": "Nombre"},
]

export default function HardwareItemCreation() {
    const classes = useStyles();
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    var item_id = paths[paths.length - 1]
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState({});
    const isEditable = true;
    const [enableCreateButton, setEnableCreateButton] = React.useState(true);

    function getPrice(price_string) {
        var price = price_string.split(" ")[0]
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

    function getRequestValues() {
        var request_values = {...currentValues};
        return request_values;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!check_required_fields()) return
        var path = "configuration-items/hardware";
        var request_values = getRequestValues();
        dbPost(path, request_values).then(data => {
            toast.success("Item de hardware creado correctamente")
            history.push("/admin" + HARDWARE_ITEM_DETAILS_PATH + "/" + data.id);
        }
        ).catch(err => {console.log(err)});
    }

    function check_required_fields(){
        if (!currentValues.name) {
            toast.error("Debe escribir un nombre")
            return false
        } else if (!currentValues.type){
            toast.error("Debe escribir un tipo")
            return false
        } else if (!currentValues.description){
            toast.error("Debe escribir una descripción")
            return false
        } else if (!currentValues.manufacturer){
            toast.error("Debe explicitar un proveedor")
            return false
        } else if (!currentValues.serial_number){
            toast.error("Debe explicitar un número de serie")
            return false
        } else if (!currentValues.purchase_date){
            toast.error("Debe explicitar una fecha de compra")
            return false
        } else if (!currentValues.price){
            toast.error("Debe explicitar un precio")
            return false
        }
        return true  
    }

    function currencyFormat(num) {
        if (!num) return;
        return '$ ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
     }

    return (
      <>
        <div className="content">
            <div className={classes.centeredDiv}>
            <Toaster/>
                <Row>
                    <Col md="6">
                    <Form onSubmit= {handleSubmit}>
                    <Card style={{ width: '40rem' }}>
                        <CardHeader >
                            <h4 className="title">Crear un ítem de hardware</h4>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label style={{ color:"#1788bd" }} for="type">Nombre</Label>
                                        <Input className="other_input"
                                            readOnly = {!isEditable}
                                            //defaultValue= {currentValues.name}
                                            onChange = {function(e){ updateCurrentValues("name", e.target.value)}}
                                            id = "type"
                                            type="text"
                                    />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                    <Label style={{ color:"#1788bd" }} for="type">Tipo</Label>
                                        <Input className="other_input"
                                            readOnly = {!isEditable}
                                            //defaultValue= {currentValues.type}
                                            onChange = {function(e){updateCurrentValues("type", e.target.value)}}
                                            id = "type"
                                            type="text"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="pb-md-2" md="12">
                                    <FormGroup>
                                    <Label style={{ color:"#1788bd" }} for="description">Descripción</Label>
                                        <Input
                                            readOnly = {!isEditable}
                                            //defaultValue = {currentValues.description}
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
                                        <Label style={{ color:"#1788bd" }} for="serial_number">Proveedor</Label>
                                        <Input  className="other_input"
                                            readOnly = {!isEditable}
                                            //defaultValue = {currentValues.manufacturer}
                                            onChange = {function(e){updateCurrentValues("manufacturer", e.target.value)}}
                                            id = "serial_number"
                                            type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                    <Label style={{ color:"#1788bd" }} for="serial_number">Número de serie</Label>
                                        <Input  className="other_input"
                                            readOnly = {!isEditable}
                                            //defaultValue = {currentValues.serial_number}
                                            onChange = {function(e){updateCurrentValues("serial_number", e.target.value)}}
                                            id = "serial_number"
                                            type="text"
                                    />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="pb-md-2" md="5">
                                    <FormGroup>
                                    <Label style={{ color:"#1788bd" }} for="description">Fecha de compra</Label>
                                        {/* <MuiPickersUtilsProvider utils={MomentUtils} locale={moment.locale("es")}>
                                            <KeyboardDatePicker
                                                onChange = {function(e){updateCurrentValues("purchase_date", moment(e.toDate()).format("DD/MM/YYYY"))}}
                                                id = "purchase_date"
                                                format="DD/MM/yyyy"                              
                                            />
                                        </MuiPickersUtilsProvider> */}
                                        <Input className="other_input"
                                            readOnly = {!isEditable}
                                            defaultValue={"02/25/2020"}
                                            onChange = {function(e){updateCurrentValues("purchase_date", e.target.value)}}
                                            id = "description"
                                            type="date"
                                            dateFormat='DD/M/YYYY'
                                />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                    <Label style={{ color:"#1788bd" }} for="description">Precio</Label>
                                        <Input
                                            readOnly = {!isEditable}
                                            //defaultValue = {currencyFormat(currentValues.price)}
                                            onChange = {function(e){updateCurrentValues("price", e.target.value)}}
                                            id = "description"
                                            type="text" />
                                    </FormGroup>
                                </Col>
                                <Col md="3">
                                    <FormGroup>
                                    <Label style={{ color:"#1788bd" }} for="description">Versión</Label>
                                        <DisabledInput
                                            readOnly
                                            defaultValue = {1}
                                            id = "version_number"
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
        </div>
      </>
    );
  }