import React from "react";
import Grid from '@mui/material/Grid';
import { dbGet, dbPatch } from 'utils/backendFetchers';
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import useStyles from "styles"
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
import {TABLES, PERMISSIONS, checkPermissions} from 'utils/permissions'
import SimpleTable from "components/Table/SimpleTable";
import { dbPost } from "utils/backendFetchers";
import { DisabledInput } from "components/Form/DisabledInput";

export const SOFTWARE_ITEM_EDIT_PATH = "/item_edit/software";

const columns = [
    {"name": "version_number", "label": "Versión"},
    {"name": "created_at", "label": "Fecha de creación"},
]

export default function SoftwareItemDetails() {
    const classes = useStyles();
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    var item_id = paths[paths.length - 1]
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState("");
    const [isEditable, setIsEditable] = React.useState(true);
    const [enableCreateButton, setEnableCreateButton] = React.useState(false);
    const [showRestoreButton, setShowRestoreButton] = React.useState(false);

    function getPrice(price_string) {
        var price = price_string.split(" ")[1]
        price = parseInt(price.replace(/[^0-9]/g, ''));
        return price;
    }

    function setEditability(is_draft) {
        var has_permissions = checkPermissions(TABLES.ITEM, PERMISSIONS.UPDATE);
        setIsEditable(has_permissions && is_draft);
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
    dbGet("configuration-items/software/" + item_id + "/draft?change_id=" + change_id, {change_id:change_id}).then(data => {
        setValues({...data});
        setCurrentValues({...data});
        setEditability(data.is_draft);
        setShowRestoreButton(!data.is_draft);
    }).catch(err => {console.log(err)});
    }   , []);

    // if (values === '' || values === undefined) {
    //     fetchValues();
    // }

    function getRequestValues() {
        var request_values = {...currentValues};
        delete request_values.change_id;
        delete request_values.change;
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
        delete request_values.is_restoring_draft;
        delete request_values.restore_version_id;
        delete request_values.comments;
        return request_values;
    }

    const createDraft = (event) => {
        event.preventDefault();
        var change_id = localStorage.getItem("change_id");
        var path = "configuration-items/software/" + values.id  + "/draft?change_id=" + change_id;
        var request_values = getRequestValues();
        dbPost(path, request_values).then(data => {
            path = simple_routes.change_details + "/" + change_id;
            toast.success("Borrador guardado correctamente");
            history.push(path);
        }
        ).catch(err => {console.log(err)});
    }

    return (
      <>
        <div className="content">
          <Toaster/>
          <Row>
            <Col md="6">
            <Form>
            <Card className="incident-card">
                <CardHeader >
                    <h4 className="title">Detalles del borrador</h4>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Label style={{ color:"#1788bd" }} for="type">Nombre</Label>
                                <Input className="other_input"
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
                                <DisabledInput
                                    defaultValue = {currentValues.current_version_number}
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
                    onClick={(event) => {createDraft(event)}}
                    >
                    Guardar        
                    </Button>
                    <Button className="btn-fill"
                        color="warning"
                        onClick={() => history.goBack()}
                        >
                        Volver        
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