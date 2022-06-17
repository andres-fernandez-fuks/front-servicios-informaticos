import React from "react";
import Grid from '@mui/material/Grid';
import { dbGet, dbPatch } from 'utils/backendFetchers';
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import useStyles from "styles"


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

export const SOFTWARE_ITEM_DETAILS_PATH = "/item_details/software";

const columns = [
{"name": "version", "label": "Versión"},
{"name": "name", "label": "Nombre"},
]

export default function SoftwareItemDetails() {
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
    dbGet("configuration-items/software/" + item_id).then(data => {
        setValues({...data});
        setCurrentValues({...data});
        getVersions();
    }).catch(err => {console.log(err)});
    }   , []);

    function fetchValues() {
            dbGet("configuration-items/software/" + item_id).then(data => {
                setValues(data);
            }).catch(err => {console.log(err)});
    }

    function restoreVersion(request_path, redirect_path, version_id) {
        dbPost(request_path, {"version": version_id}).then(data => {
            redirect_path += "/" + data.id;
            history.push(redirect_path);
            window.location.reload();
            // setValues(data);
        }).catch(err => {console.log(err)});
}  


    function getVersions() {
        if (values.versions && values.versions.length > 0) {
            return <SimpleTable
                        data={values.versions}
                        columns={columns}
                        addRestoreColumn={true}
                        function={restoreVersion}
                        button_path={"/admin" + SOFTWARE_ITEM_DETAILS_PATH}
                        request_endpoint={"configuration-items/software/" + values.id + "/restore"}/>
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
            
            history.push("/admin" + SOFTWARE_ITEM_DETAILS_PATH + "/" + data.id);
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
            <Card className="incident-card">
                <CardHeader >
                    <h4 className="title">Detalles del ítem</h4>
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
                                    id = "software_version"
                                    type="text"
                            />
                            </FormGroup>
                        </Col>
                        <Col md="2">
                            <FormGroup>
                            <Label style={{ color:"#1788bd" }} for="description">Versión</Label>
                                <Input
                                    readOnly
                                    defaultValue = {currentValues.version}
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