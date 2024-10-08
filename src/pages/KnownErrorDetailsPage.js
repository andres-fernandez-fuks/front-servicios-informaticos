/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import Grid from '@mui/material/Grid';
import { dbGet, dbPatch, dbPost } from 'utils/backendFetchers';
import "pages/ic.css";
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import useStyles from "styles"
import ModalDialog from "components/Modal/ModalDialog"
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
    Modal,
    Row,
    Col,
    Select
  } from "reactstrap";

import SimpleTable from "components/Table/SimpleTable";
import {TABLES, PERMISSIONS, checkPermissions} from 'utils/permissions'
import { DisabledInput } from "components/Form/DisabledInput";
import toast, { Toaster } from 'react-hot-toast';
import moment from "moment";
import { INCIDENT_DETAILS_PATH } from "./IncidentDetailsPage";


export const KNOWN_ERROR_DETAILS_PATH = "/known_error_details";


const tableData = [];
const incidentColumns = [
    {"name": "id", "label": "ID"},
    {"name": "description", "label": "Descripción"}
]
const versionColumns = [
    {"name": "version_number", "label": "Número de versión"},
    {"name": "description", "label": "Descripción"}
]


function KnownErrorDetails(props) {
    const classes = useStyles();
    const history = useHistory();
    var paths = window.location.pathname.split("/")
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState("");
    const isEditable = checkPermissions(TABLES.KNOWN_ERROR, PERMISSIONS.UPDATE);
    const [enableCreateButton, setEnableCreateButton] = React.useState(false);
    const [incidentsData, setIncidentsData] = React.useState([]);
    var paths = window.location.pathname.split("/")
    var error_id = paths[paths.length - 1]
    const [bigChartData, setbigChartData] = React.useState(tableData);
    const [columns, setColumns] = React.useState(incidentColumns);
    const [formFields, setFormFields] = React.useState([{}]);
    const [counter, setCounter] = React.useState(-1);
    const [modalShow, setModalShow] = React.useState(false);

    function updateCurrentValues(field, new_value) {
        currentValues[field] = new_value;
        if (JSON.stringify(currentValues) !== JSON.stringify(values)) {
            setEnableCreateButton(true);
        } else {
            setEnableCreateButton(false);
        }
    }

    function fetchIncidentsData() {
        dbGet("errors/" + error_id).then(data => {
            var incidents_data = data["incidents"]
            setIncidentsData(incidents_data);
        }).catch(err => {console.log(err)});
    }

    React.useEffect(() => {
        dbGet("errors/" + error_id).then(data => {
            setValues({...data});
            setCurrentValues({...data});
            getVersions();
            fetchIncidentsData();
        }).catch(err => {console.log(err)});
        }   , []);

    function restoreVersion(request_path, redirect_path, version_id) {
        dbPost(request_path, {"version": version_id}).then(data => {
            setValues({...data});
            setCurrentValues({...data});
            setIncidentsData(data.incidents);
            setCounter(counter -1);
            toast.success("Se ha restaurado la versión '" + version_id +"' correctamente");
        }).catch(err => {console.log(err)});
    }

    function getVersions() {
        if (values.versions && values.versions.length > 0) {
            return <SimpleTable
                        data={values.versions}
                        columns={versionColumns}
                        addRestoreColumn={true}
                        function={restoreVersion}
                        button_path={"/admin" + KNOWN_ERROR_DETAILS_PATH}
                        request_endpoint={"errors/" + values.id + "/restore"}
                        isKnownErrorTable={true}
                  />
        }
        else if (values.versions && values.versions.length === 0) {
            return <div className="version_row">No hay otras versiones del ítem</div>
        }
    }

    function cleanPostValues(data){
        let cleaned_data = {}
        cleaned_data["created_by"] = data["created_by"]
        cleaned_data["description"] = data["description"]
        cleaned_data["solution"] = data["solution"]
        return cleaned_data
    }

    const submitForm = (data) => {
        var cleaned_data = cleanPostValues(currentValues)
        dbPost("errors/" + error_id + "/version", cleaned_data).then(data => {
            setValues({...data});
            setCurrentValues({...data});
            setIncidentsData(data.incidents);
            toast.success("Se ha creado la versión correctamente");
        });
    }

    const addIncidentToError = (selectedIncident) => {
        dbPost("errors/incident", {error_id: error_id, incident_name: selectedIncident}).then(data => {
            setIncidentsData(data.incidents)
            toast.success("Se ha agregado el incidente correctamente");

        }).catch(err => {console.log(err)});
      };

  function addButtons() {
    if (values === '') return;

    return (
        <>
        <Button className="btn-fill"
            hidden={!isEditable}
            disabled = {!enableCreateButton}
            color="primary"
            type="submit"
            onClick={(e) =>{e.preventDefault(); submitForm()}}
            >
            Guardar
        </Button>
        <Button
            className="btn-fill"
            color="warning"
            onClick={(e) =>{history.go(counter)}}
        >
            Volver
        </Button>
        </>
    )
  }

  return (
    <>
      <div className="content">
        <Toaster/>
        <Row>
          <Col md="6">
          <Form>
          <Card style={{paddingBottom:"33px"}}>
              <CardHeader >
                  <h4 className="title">Detalles del Error</h4>
              </CardHeader>
              <CardBody >
                <div>
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
                      <Col className="pb-md-2" md="12">
                          <FormGroup>
                          <Label style={{ color:"#1788bd" }} for="solution">Solución</Label>
                              <Input
                                  defaultValue = {currentValues.solution}
                                  onChange = {function(e){updateCurrentValues("solution", e.target.value)}}
                                  id = "solution"
                                  type="text"
                          />
                          </FormGroup>
                      </Col>
                  </Row>
                  <Row>
                      <Col md="6">
                          <FormGroup>
                              <Label style={{ color:"#1788bd" }}>Creado por</Label>
                              <DisabledInput                                  
                                  readOnly = {!isEditable}
                                  defaultValue = {currentValues.created_by}
                                  id = "serial_number"
                                  type="text"
                              />
                          </FormGroup>
                      </Col>
                      <Col md="6">
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
                </div>
            <div class="items-div">
                <h4 className="title">Incidentes asociados</h4>
                <ModalDialog
                    error_id = {error_id}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    addFunction={addIncidentToError}
                />
                <SimpleTable
                    data={incidentsData}
                    columns={columns}
                    addWatchColumn={true}
                    excludeIdColumn={true}
                    use_object_type = {false}
                    button_path={"/admin" + INCIDENT_DETAILS_PATH + "/"}
                />
            </div>
        </CardBody>
        
              <CardFooter className="form_col">
              {addButtons()}
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

export default KnownErrorDetails;
