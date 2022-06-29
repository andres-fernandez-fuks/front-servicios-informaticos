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
import {DisabledInput} from "components/Form/DisabledInput.js";

import SimpleTable from "components/Table/SimpleTable";
import { dbPost } from "utils/backendFetchers";

export const ITEM_DETAILS_PATH = "/item_details";
export const HARDWARE_ITEM_DETAILS_PATH = "/item_details/hardware";

const columns = [
    {"name": "version_number", "label": "Versión"},
    {"name": "created_at", "label": "Fecha de creación"},
]

export default function App() {
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

  React.useEffect(() => {
    dbGet("configuration-items/hardware/" + item_id).then(data => {
        setValues({...data});
        setCurrentValues({...data});
        //getVersions();
    }).catch(err => {console.log(err)});
    }   , []);

    function checkVersion(request_path, redirect_path, version_number) {
        dbGet(request_path + "/" + version_number).then(data => {
            setValues({...data});
            setCurrentValues({...data});
            setCounter(counter - 1);
        }).catch(err => {console.log(err)});
    }   

    console.log("Values: ", values)

    // if (values === '' || values === undefined) {
    //     fetchValues();
    // }

    function getVersions() {
        if (values.versions && values.versions.length > 0) {
            return <SimpleTable
                        data={values.versions}
                        columns={columns}
                        addRestoreColumn={true}
                        function={checkVersion}
                        button_path={"/admin" + HARDWARE_ITEM_DETAILS_PATH}
                        request_endpoint={"configuration-items/hardware/" + values.id + "/version"}/>
        }
        else if (values.versions && values.versions.length === 0) {
            return <div className="version_row">No hay otras versiones del ítem</div>
        }
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
        var path = "configuration-items/hardware/" + values.id + "/version";
        var request_values = getRequestValues();
        dbPost(path, request_values).then(data => {
            history.push("/admin" + HARDWARE_ITEM_DETAILS_PATH + "/" + data.id);
            window.location.reload();
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
                    <h4 className="title">Detalles del ítem</h4>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Label style={{ color:"#1788bd" }} for="type">Nombre</Label>
                                <DisabledInput
                                    
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
                                <DisabledInput
                                    
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
                                <Label style={{ color:"#1788bd" }} for="serial_number">Proveedor</Label>
                                <DisabledInput  className="other_input"
                                    
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
                                <DisabledInput  className="other_input"
                                    
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
                                <DisabledInput
                                    
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
                                <DisabledInput
                                    
                                    defaultValue = {currencyFormat(currentValues.price)}
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
                                    defaultValue = {currentValues.current_version_number}
                                    id = "description"
                                    type="text"/>
                            </FormGroup>
                        </Col>
                        <Col md="12">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="description">Cambio asociado</Label>
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
            <Col md="6">
              <Card className="incident-card">
                <CardBody>
                <div>
                <h4 className="title">Otras versiones</h4>
                    <div className="versions">
                        {getVersions()}
                    </div>
                </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }