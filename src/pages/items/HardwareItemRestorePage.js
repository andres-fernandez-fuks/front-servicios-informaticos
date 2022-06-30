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
import {DisabledInput} from "components/Form/DisabledInput.js";
import Tooltip from "@material-ui/core/Tooltip";

export const HARDWARE_ITEM_RESTORE_PATH = "/item_restore/hardware";

const columns = [
    {"name": "version_number", "label": "Versión"},
    {"name": "created_at", "label": "Fecha de creación"},
]

export default function HardwareItemRestore() {
    const classes = useStyles();
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    var item_id = paths[paths.length - 1]
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState("");
    const [isEditable, setIsEditable] = React.useState(true);
    const [enableCreateButton, setEnableCreateButton] = React.useState(false);
    const [showRestoreButton, setShowRestoreButton] = React.useState(false);
    const [counter, setCounter] = React.useState(-1);
    const [actualCurrentVersion, setActualCurrentVersion] = React.useState(null);
    

    function getPrice(price_string) {
        var price = price_string.split(" ")[1]
        price = parseInt(price.replace(/[^0-9]/g, ''));
        return price;
    }

    function setEditability(is_draft) {
        var has_permissions = checkPermissions(TABLES.HARDWARE, PERMISSIONS.UPDATE);
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
    dbGet("configuration-items/hardware/" + item_id + "/draft?change_id=" + change_id, {change_id:change_id}).then(data => {
        setValues({...data});
        setCurrentValues({...data});
        setEditability(data.is_draft);
        setShowRestoreButton(!data.is_draft);
        if (!actualCurrentVersion) setActualCurrentVersion(data.current_version_number);
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
        return request_values;
    }


    const restoreVersion = (event)  => {
        event.preventDefault();
        var path = "configuration-items/hardware/" + item_id + "/restore";
        var version_number = currentValues.current_version_number;
        var change_id = localStorage.getItem("change_id");
        var body = {
            "version": version_number,
            "change_id": change_id
        }
        dbPost(path, body).then(data => {
            path = simple_routes.change_details+ "/" + change_id;
            toast.success("La versión se restaurará cuando se aplique el cambio");
            history.push(path);
        }).catch(err => {console.log(err)});
    }


    const createDraft = (event) => {
        event.preventDefault();
        var change_id = localStorage.getItem("change_id");
        var path = "configuration-items/hardware/" + values.id  + "/draft?change_id=" + change_id;
        var request_values = getRequestValues();
        dbPost(path, request_values).then(data => {
            path = simple_routes.change_details + "/" + change_id;
            toast.success("Borrador guardado correctamente");
            history.push(path);
        }
        ).catch(err => {console.log(err)});
    }

    function currencyFormat(num) {
        if (!num) return;
        return '$ ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
     }

    function checkVersion(request_path, redirect_path, version_number) {
        dbGet(request_path + "/" + version_number).then(data => {
            setValues({...data});
            setCurrentValues({...data});
            setEditability(data.is_draft);
            setShowRestoreButton(!data.is_draft);
            setCounter(counter - 1);
        }).catch(err => {console.log(err)});
    }  

    function getVersions() {
        if (values.versions && values.versions.length > 0) {
            return <SimpleTable
                        data={values.versions}
                        columns={columns}
                        addRestoreColumn={true}
                        function={checkVersion}
                        button_path={"/admin" + HARDWARE_ITEM_RESTORE_PATH}
                        request_endpoint={"configuration-items/hardware/" + values.id + "/version"}/>
        }
        else if (values.versions && values.versions.length === 0) {
            return <div className="version_row">No hay otras versiones del ítem</div>
        }
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
                    <h4 className="title">Crear borrador</h4>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Label style={{ color:"#1788bd" }} for="type">Nombre</Label>
                                <DisabledInput className="other_input"
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
                                <DisabledInput className="other_input"
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
                                <DisabledInput
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
                                <DisabledInput  className="other_input"
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
                                <DisabledInput  className="other_input"
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
                                <DisabledInput className="other_input"
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
                                <DisabledInput
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
                                <DisabledInput
                                    readOnly
                                    defaultValue = {currentValues.current_version_number}
                                    id = "description"
                                    type="text"/>
                            </FormGroup>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter className="form_col">
                <Tooltip title={currentValues.current_version_number === actualCurrentVersion ? "Versión actual del ítem" : ""}>
                    <span>
                        <Button className="btn btn-primary"
                            color="info"
                            onClick={(event) => {restoreVersion(event)}}
                            disabled = {currentValues.current_version_number === actualCurrentVersion}
                            >
                            Restaurar        
                        </Button>
                    </span>
                </Tooltip>
                &nbsp;
                <Button className="btn-fill"
                    color="warning"
                    onClick={() => history.go(counter ? counter : -1)}
                    >
                    Volver        
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