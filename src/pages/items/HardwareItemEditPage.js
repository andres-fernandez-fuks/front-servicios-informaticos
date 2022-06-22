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
import toast, { Toaster } from 'react-hot-toast';
import {TABLES, PERMISSIONS, checkPermissions} from 'utils/permissions'

import SimpleTable from "components/Table/SimpleTable";
import { dbPost } from "utils/backendFetchers";

export const ITEM_EDIT_PATH = "/item_edit";
export const HARDWARE_ITEM_EDIT_PATH = "/item_edit/hardware";

export default function App() {
    const classes = useStyles();
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    var item_id = paths[paths.length - 1]
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState("");
    const isEditable = checkPermissions(TABLES.HARDWARE_ITEM, PERMISSIONS.UPDATE);
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
        delete request_values.draft;
        delete request_values.is_draft;
        delete request_values.is_deleted;
        delete request_values.draft_id;
        delete request_values.draft_change_id;
        delete request_values.version_number;
        return request_values;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        var change_id = localStorage.getItem("change_id");
        var path = "configuration-items/hardware/" + values.id + "/draft?change_id=" + change_id;
        var request_values = getRequestValues();
        dbPost(path, request_values).then(data => {
            toast.success("Borrador guardado correctamente");
            history.goBack();
        }
        ).catch(err => {console.log(err)});
    }

    function currencyFormat(num) {
        if (!num) return;
        return '$ ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
     }

    return (
      <>
        <div className="content">
        <Toaster />
          <Row>
            <Col md="6">
            <Form onSubmit= {handleSubmit}>
            <Card className="incident-card">
                <CardHeader >
                    <h4 className="title">Crear borrador</h4>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Label style={{ color:"#1788bd" }} for="type">Nombre</Label>
                                <Input className="other_input"
                                    readOnly = {!isEditable}
                                    defaultValue= {currentValues.name}
                                    onChange = {function(e){updateCurrentValues("name", e.target.value)}}
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
                                    defaultValue= {currentValues.type}
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
                                <Label style={{ color:"#1788bd" }} for="serial_number">Proveedor</Label>
                                <Input  className="other_input"
                                    readOnly = {!isEditable}
                                    defaultValue = {currentValues.manufacturer}
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
                                    defaultValue = {currentValues.serial_number}
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
                                <Input className="other_input"
                                    readOnly = {!isEditable}
                                    defaultValue = {currentValues.purchase_date}
                                    onChange = {function(e){updateCurrentValues("purchase_date", e.target.value)}}
                                    id = "description"
                                    type="text"
                        />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="description">Precio</Label>
                                <Input
                                    readOnly = {!isEditable}
                                    defaultValue = {currencyFormat(currentValues.price)}
                                    onChange = {function(e){updateCurrentValues("price", e.target.value)}}
                                    id = "description"
                                    type="text" />
                            </FormGroup>
                        </Col>
                        <Col md="3">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="description">Versión</Label>
                                <Input
                                    readOnly
                                    defaultValue = "Borrador"
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