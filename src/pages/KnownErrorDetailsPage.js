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

export const KNOWN_ERROR_DETAILS_PATH = "/known_error_details";

const tableData = [];
const incidentColumns = [
    {"name": "id", "label": "ID"},
    {"name": "description", "label": "Descripción"}
]



function KnownErrorDetails(props) {
    const classes = useStyles();
    const history = useHistory();
    var paths = window.location.pathname.split("/")
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState("");
    const isEditable = false;
    const [enableCreateButton, setEnableCreateButton] = React.useState(false);
    const [itemsData, setItemsData] = React.useState([]);
    var paths = window.location.pathname.split("/")
    var error_id = paths[paths.length - 1]
    const [bigChartData, setbigChartData] = React.useState(tableData);
    const [columns, setColumns] = React.useState(incidentColumns);
    const [formFields, setFormFields] = React.useState([{}])

    function updateCurrentValues(field, new_value) {
        currentValues[field] = new_value;
        if (JSON.stringify(currentValues) !== JSON.stringify(values)) {
            setEnableCreateButton(true);
        } else {
            setEnableCreateButton(false);
        }
    }

    function fetchItemsData() {
        dbGet("errors/" + error_id).then(data => {
            var incidents_data = data["incidents"]

            setItemsData(incidents_data);
        }).catch(err => {console.log(err)});
    }

    React.useEffect(() => {
        dbGet("errors/" + error_id).then(data => {
            setValues(data);
            setCurrentValues(data);
            getVersions();
            fetchItemsData();
        }).catch(err => {console.log(err)});
        }   , []);

    function fetchValues() {
            dbGet("errors/" + error_id).then(data => {
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
                addRestoreColumn={!localStorage.getItem("wasInChange")}
                function={restoreVersion}
                button_path={"/admin" + KNOWN_ERROR_DETAILS_PATH}
                request_endpoint={"errors/" + values.id + "/restore"}/>
        }
        else if (values.versions && values.versions.length === 0) {
            return <div className="version_row">No hay otras versiones del ítem</div>
        }
    }

    //todo esto no se si va
    const submitForm = (data) => {
        var patch_data = {taken_by:localStorage.getItem("username")}
        dbPatch("errors/" + error_id, patch_data);
        sendComment("Error tomado");
    }

  function addButtons() {
      if (values === '') {
      fetchValues();
    }
    //todo ver que el boton de guardar ande
    if (!values.taken_by) {
        return (
        <Button className="btn-fill"
        color="primary"
        type="submit"
        disabled = {!enableCreateButton}
        onClick={() => submitForm()}
        >
        Guardar
        </Button>)
    }
  }

  //todo ver si esto sirve
  const sendComment = (comment) => {
    if (!comment) comment = document.getElementById("comment").value;
    if (!comment) return;
    
    var created_by = localStorage.getItem("username");
    var post_data = {
        comment:comment,
        created_by:created_by
    }
    dbPost("errors/" + error_id + "/comments", post_data);
    window.location.reload();
 }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="6">
          <Form>
          <Card className="error-card">
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
                                  readOnly = {isEditable}
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
                                  readOnly = {isEditable}
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
                              <Input  className="other_input"
                                  readOnly = {isEditable}
                                  defaultValue = {currentValues.created_by}
                                  onChange = {function(e){updateCurrentValues("created_by", e.target.value)}}
                                  id = "serial_number"
                                  type="text"
                              />
                          </FormGroup>
                      </Col>
                  </Row>
                </div>
            <div class="items-div">
                <h4 className="title">Ítems asociados</h4>
                <SimpleTable data={itemsData}
                             columns={columns}
                             addWatchColumn={true}
                             excludeIdColumn={true}
                             button_path={"/admin/incidents_details/"}
                             use_object_type = {false}/>
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
