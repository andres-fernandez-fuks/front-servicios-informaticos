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
import classNames from "classnames";
import CommentsTracking from "components/Form/comment_tracking";
import {TABLES, PERMISSIONS, checkPermissions} from 'utils/permissions'

export const INCIDENT_DETAILS_PATH = "/incidents_details";
const tableData = [];
const ciItemColumns = [
    {"name": "id", "label": "ID"},
    {"name": "name", "label": "Nombre"},
    {"name": "type", "label": "Tipo"}
]



function IncidentDetails(props) {
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState({});
    const isEditable = checkPermissions(TABLES.INCIDENT, PERMISSIONS.UPDATE)
    const [isBlocked, setIsBlocked] = React.useState(false);
    const [enableCreateButton, setEnableCreateButton] = React.useState(false);
    const [flushLocalComments, setFlushLocalComments] = React.useState(false);
    const [itemsData, setItemsData] = React.useState([]);
    var paths = window.location.pathname.split("/") 
    var incident_id = paths[paths.length - 1]
    const [columns, setColumns] = React.useState(ciItemColumns);
    const [isTaken, setIsTaken] = React.useState(false);

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

    function fetchItemsData() {
        dbGet("incidents/" + incident_id).then(data => {
            var items_data = data["configuration_items"]
            setItemsData(items_data);
        }).catch(err => {console.log(err)});
    }

    React.useEffect(() => {
        dbGet("incidents/" + incident_id).then(data => {
            setValues(data);
            setCurrentValues(data);
            fetchItemsData();
            setIsBlocked(data["is_blocked"])
            setIsTaken(data["taken_by"] !== null)
        }).catch(err => {console.log(err)});
        }   , []);

    function fetchValues() {
            dbGet("incidents/" + incident_id).then(data => {
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

    console.log("Values: ", values)

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
            history.push("/admin" + INCIDENT_DETAILS_PATH + "/" + data.id);
            window.location.reload();
        }
        ).catch(err => {console.log(err)});
    }

    function solveIncident() {
        var patch_data = {status:"Resuelto"}
        dbPatch("incidents/" + incident_id, patch_data);
        history.push(simple_routes.incidents);
        sendComment("Incidente resuelto");
    }

    function blockIncident() {
        var patch_data = {is_blocked:true}
        dbPatch("incidents/" + incident_id, patch_data);
        sendComment("Incidente bloqueado");
        setIsBlocked(true);
    }

    function unblockIncident() {
        var patch_data = {is_blocked:false}
        dbPatch("incidents/" + incident_id, patch_data);
        sendComment("Incidente desbloqueado");
        setIsBlocked(false);
    }

  const takeIncident = () => { 
      var patch_data = {taken_by:localStorage.getItem("username")}
      dbPatch("incidents/" + incident_id, patch_data);
      // history.push(simple_routes.incidents);
      sendComment("Incidente tomado");
  }

  function addBlockButton() {
    if (!isEditable) return
        return (
            <>
                <Button className="btn-fill" align="left"
                hidden = {!isBlocked}
                color="warning"
                type="submit"
                onClick={() => unblockIncident()}
                >
                Desbloquear        
                </Button>
                <Button className="btn-fill" align="left"
                hidden = {isBlocked}
                color="warning"
                type="submit"
                onClick={() => blockIncident()}
                >
                Bloquear        
                </Button> 
            </> 
        )
  }

  function addButtons() {
    if (!isEditable) return
      if (values === '') {
        return
    }
    if (values.status === "Resuelto") {
        return;
    }
        return (
        <>
            <Button className="btn-fill"
            hidden={isTaken}
            color="primary"
            type="submit"
            onClick={() => takeIncident()}
            >
            Tomar        
            </Button>
            <Grid align="center">
            <Button className="btn-fill" align="right"
            hidden={!isTaken}
            color="success"
            type="submit"
            onClick={() => solveIncident()}
            >
            Resolver        
            </Button>
            {addBlockButton()}
            </Grid>
        </>
        )
  }

  const sendComment = (comment) => {
    if (!comment) comment = document.getElementById("comment").value;  
    if (!comment) return;
    
    var created_by = localStorage.getItem("username");
    var post_data = {
        comment:comment,
        created_by:created_by
    }
    dbPost("incidents/" + incident_id + "/comments", post_data).then(data => {
        fetchValues();
        setFlushLocalComments(true);
        setFlushLocalComments(false);
    });
    
 }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="6">
          <Form onSubmit= {handleSubmit}>
          <Card className="incident-card">
              <CardHeader >
                  <h4 className="title">Detalles del incidente</h4>
              </CardHeader>
              <CardBody >
                  <Row>
                      <Col className="pb-md-2" md="12">
                          <FormGroup>
                          <Label style={{ color:"#1788bd" }} for="description">Descripción</Label>
                              <Input
                                  readOnly = {!isEditable}
                                  defaultValue = {currentValues.description}
                                  onChange = {(e) => {updateCurrentValues("description", e.target.value)}}
                                  id = "description"
                                  type="text"
                          />
                          </FormGroup>
                      </Col>
                  </Row>
                  <Row>
                      <Col md="6">
                          <FormGroup>
                              <Label style={{ color:"#1788bd" }}>Estado</Label>
                              <Input className="other_input"
                                  readOnly = {!isEditable}
                                  defaultValue= {currentValues.status}
                                  onChange = {(e) => {updateCurrentValues("status", e.target.value)}}
                                  id = "type"
                                  type="text"
                          />
                          </FormGroup>
                      </Col>
                      <Col md="6">
                          <FormGroup>
                          <Label style={{ color:"#1788bd" }}>Prioridad</Label>
                              <Input className="other_input"
                                  readOnly = {!isEditable}
                                  defaultValue= {currentValues.priority}
                                  onChange = {(e) => {updateCurrentValues("priority", e.target.value)}}
                                  id = "type"
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
                                  readOnly = {!isEditable}
                                  defaultValue = {currentValues.created_by}
                                  onChange = {(e) => {updateCurrentValues("created_by", e.target.value)}}
                                  id = "serial_number"
                                  type="text"
                              />
                          </FormGroup>
                      </Col>
                      <Col md="6">
                          <FormGroup>
                          <Label style={{ color:"#1788bd" }}>Tomado por</Label>
                              <Input  className="other_input"
                                  readOnly = {!isEditable}
                                  defaultValue = {currentValues.taken_by}
                                  onChange = { (e) => {updateCurrentValues("taken_by", e.target.value)}}
                                  id = "serial_number"
                                  type="text"
                          />
                          </FormGroup>
                      </Col>
                  </Row>
              <div class="items-div">
                <h4 className="title">Ítems de configuración</h4>
                <SimpleTable data={itemsData}
                             columns={columns}
                             addWatchColumn={true}
                             excludeIdColumn={true}
                             use_object_type={true}
                             button_path={"/admin/item_details/"}/>
             </div>
              </CardBody>
              <CardFooter className="form_col">
              {addButtons()}
              </CardFooter>
          </Card>
          </Form>
          </Col>
          <Col md="6" className="comment-section">
          <Row>
            <Col md="11">
              <h4 className="title">Tracking</h4>
                <div>
                    <CommentsTracking 
                        comments={values.comments} 
                        commentCreationUrl={"incidents/" + incident_id + "/comments"}
                        flushLocalComments={flushLocalComments}
                        />
                </div>
          </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default IncidentDetails;
