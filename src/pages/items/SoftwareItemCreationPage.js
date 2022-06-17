import React from "react";
import Grid from '@mui/material/Grid';
import { dbGet, dbPatch } from 'utils/backendFetchers';
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import useStyles from "styles"
import { SOFTWARE_ITEM_DETAILS_PATH } from "./SoftwareItemDetailsPage";
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

export const SOFTWARE_ITEM_CREATION_PATH = "/item_creation/software";

const columns = [
{"name": "version", "label": "Versión"},
{"name": "name", "label": "Nombre"},
]

export default function SoftwareCreation() {
    const classes = useStyles();
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState({});
    const isEditable = true;
    const [enableCreateButton, setEnableCreateButton] = React.useState(true);

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
        if (!check_required_fields()) return
        var path = "configuration-items/software";
        var request_values = getRequestValues();
        dbPost(path, request_values).then(data => {
            toast.success("Item de Software creado correctamente")
            history.push("/admin" + SOFTWARE_ITEM_DETAILS_PATH + "/" + data.id);
            window.location.reload();
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
        } else if (!currentValues.provider){
            toast.error("Debe explicitar un proveedor")
            return false
        } else if (!currentValues.software_version){
            toast.error("Debe explicitar un número de versión del software")
            return false
        }
        return true  
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
          <Toaster />  
          <Row>
            <Col md="6">
            <Form onSubmit= {handleSubmit}>
            <Card className="incident-card">
                <CardHeader >
                    <h4 className="title">Creación de un ítem de Software</h4>
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
                                    id = "name"
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
                        <Col md="5">
                            <FormGroup>
                                <Label style={{ color:"#1788bd" }}>Proveedor</Label>
                                <Input  className="other_input"
                                    readOnly = {!isEditable}
                                    defaultValue = {currentValues.provider}
                                    onChange = {function(e){updateCurrentValues("provider", e.target.value)}}
                                    id = "provider"
                                    type="text"
                                />
                            </FormGroup>
                        </Col>
                        <Col md="5">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }}>Versión del Software</Label>
                                <Input  className="other_input"
                                    readOnly = {!isEditable}
                                    defaultValue = {currentValues.software_version}
                                    onChange = {function(e){updateCurrentValues("software_version", e.target.value)}}
                                    placeholder = "3.0.1"
                                    id = "software_version"
                                    type="text"
                            />
                            </FormGroup>
                        </Col>
                        <Col md="">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="description">Versión</Label>
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