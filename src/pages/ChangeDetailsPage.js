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

import {DisabledInput} from "components/Form/DisabledInput.js";  
import SimpleTable from "components/Table/SimpleTable";
import ChangeTable from "components/Table/ChangeTable";
import {TABLES, PERMISSIONS, checkPermissions} from 'utils/permissions'
import Tooltip from "@material-ui/core/Tooltip";
import CommentsTracking from "components/Form/comment_tracking";

export const CHANGE_DETAILS_PATH = "/change_details";

const tableData = [];
const itemsColumns = [
    {"name": "id", "label": "ID"},
    {"name": "type_show", "label": "Tipo"},
    {"name": "type", "label": "type"},
    {"name": "name", "label": "Nombre"},
    {"name": "draft_id", "label": "draft_id"},
    {"name": "draft_change_id", "label": "draft_change_id"},
    {"name": "is_restoring_draft", "label": "is_restoring_draft"},
]

const incidentAndProblemsColumns = [
    {"name": "id", "label": "ID"},
    {"name": "type_show", "label": "Tipo"},
    {"name": "type", "label": "type"},
    {"name": "description", "label": "Descripción"}
]


function ChangeDetails(props) {
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState("");
    const isEditable = checkPermissions(TABLES.CHANGE, PERMISSIONS.UPDATE)
    const [enableCreateButton, setEnableCreateButton] = React.useState(false);
    const [itemsData, setItemsData] = React.useState([]);
    const [itemsCiData, setItemsCiData] = React.useState([]);
    const [problemItemsData, setProblemItemsData] = React.useState([]);
    var change_id = paths[paths.length - 1]
    const [isBlocked, setIsBlocked] = React.useState(false);
    localStorage.setItem("wasInChange", true)
    const [hasModifications, setHasModifications] = React.useState(false);
    const [flushLocalComments, setFlushLocalComments] = React.useState(false);
    const [isTaken, setIsTaken] = React.useState(false);
    const [isTakenByUser, setIsTakenByUser] = React.useState(false);

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
        dbGet("changes/" + change_id).then(data => {
            var this_change_id = parseInt(change_id);
            var incidents_data = data["incidents"]
            var problems_data = data["problems"]
            var ci = []

            incidents_data.map(i => {
                i['type_show'] = "Incidente"
                i['type'] = "incident"
            })
            problems_data.map(i => {
                i['type_show'] = "Problema"
                i['type'] = "problem"
            })
            
            data["hardware_configuration_items"].map(i => {
                i['type_show'] = "Hardware"
                i['type'] = "hardware"
                if (i['draft_id'] && i['draft_change_id'] == this_change_id) setHasModifications(true);
                ci.push(i)
                console.log(i)
            })

            data["software_configuration_items"].map(i => {
                i['type_show'] = "Software"
                i['type'] = "software"
                if (i['draft_id'] && i['draft_change_id'] == this_change_id) setHasModifications(true);
                ci.push(i)
                console.log(i)
            })

            data["sla_configuration_items"].map(i => {
                i['type_show'] = "SLA"
                i['type'] = "sla"
                if (i['draft_id'] && i['draft_change_id'] == this_change_id) setHasModifications(true);
                ci.push(i)
                console.log(i)
            })

            setItemsCiData(ci)
            setItemsData([...incidents_data, ...problems_data]);
            setProblemItemsData(problems_data);
        }).catch(err => {console.log(err)});
    }

    React.useEffect(() => {
        dbGet("changes/" + change_id).then(data => {
            setValues(data);
            setCurrentValues(data);
            fetchItemsData();
            setIsBlocked(data["is_blocked"]);
            setIsTaken(data["taken_by"] !== null);
            setIsTakenByUser(data["taken_by"] === localStorage.getItem("username"));
            localStorage.setItem("change_id", change_id);
        }).catch(err => {console.log(err)});
        }   , []);


    function fetchValues() {
        dbGet("changes/" + change_id).then(data => {
            setValues(data);
        }).catch(err => {console.log(err)});
    }

    function blockChange() {
        var patch_data = {is_blocked:true}
        dbPatch("changes/" + change_id, patch_data);
        sendComment("Cambio bloqueado");
        setIsBlocked(true);
    }

    function unblockChange() {
        var patch_data = {is_blocked:false}
        dbPatch("changes/" + change_id, patch_data);
        sendComment("Cambio desbloqueado");
        setIsBlocked(false);
    }

    function takeChange() {
        var patch_data = {taken_by:localStorage.getItem("username")}
        dbPatch("changes/" + change_id, patch_data).then(data => {
            setCurrentValues(data);
            setIsTaken(true);
            setIsTakenByUser(true);
      });
        sendComment("Cambio tomado");
    }

    const applyChange = () => { 
        dbPost("changes/" + change_id + "/apply", {}).then(data => {
        } ).catch(err => {console.log(err)});
        var patch_data = {taken_by:localStorage.getItem("username"), status: "Resuelto"}
        dbPatch("changes/" + change_id, patch_data).then(data => {
            history.push(simple_routes.changes);
        }).catch(err => {console.log(err)});
        sendComment("Cambio aplicado");
    }

    const rejectChange = () => { 
        dbPost("changes/" + change_id + "/discard", {}).then(data => {
        } ).catch(err => {console.log(err)});
        var patch_data = {taken_by:localStorage.getItem("username"), status: "Rechazado"}
        dbPatch("changes/" + change_id, patch_data).then(data => {
            history.push(simple_routes.changes);
        }).catch(err => {console.log(err)});
        sendComment("Cambio rechazado");
    }

    const sendComment = (comment) => {
        if (!comment) comment = document.getElementById("comment").value;  
        if (!comment) return;
        
        var created_by = localStorage.getItem("username");
        var post_data = {
            comment:comment,
            created_by:created_by
        }
        dbPost("changes/" + change_id + "/comments", post_data).then(data => {
            fetchValues();
            setFlushLocalComments(true);
            setFlushLocalComments(false);
        });
        
    }

    console.log("TAKEN BY USER: ", isTakenByUser)

    function addBlockButton() {
        if (!isEditable) return
            return (
                <>  
                    {isBlocked ? <>&nbsp;</> : <></>}
                    <Button className="btn-fill"
                    hidden = {!isTaken || !isBlocked || !isTakenByUser}
                    color="warning"
                    type="button"
                    onClick={() => unblockChange()}
                    >
                    Desbloquear        
                    </Button>
                    <Button className="btn-fill"
                    hidden = {!isTaken || isBlocked || !isTakenByUser}
                    color="warning"
                    type="button"
                    onClick={() => blockChange()}
                    >
                    Bloquear        
                    </Button> 
                </> 
            )
    }

    function defineTooltipMessage() {
        if (hasModifications && !isBlocked) return "";
        if (isBlocked) return "Cambio bloqueado";
        return "Tiene que modificar por lo menos un ítem"; 
    }

  function addButtons() {
    if (values === '') {
      return;
    }
    if (!isEditable || values.status === "Resuelto" || values.status === "Rechazado") {
        return (
            <Row style={{justifyContent:"center"}}>
                <Button className="btn-fill"
                    color="primary"
                    onClick={() => history.goBack()}
                    >
                    Volver        
                </Button>
            </Row>
        )
    }
        return (
        <Row style={{justifyContent:"center"}}>
            <Button className="btn-fill" align="right"
                hidden={isTaken}
                color="success"
                type="button"
                onClick={() => takeChange()}
                >
                Tomar        
            </Button>
            <Tooltip title={defineTooltipMessage()} style={{paddingRight:"1px"}}>
            <span>
                <Button
                    hidden = {!isTaken || !isTakenByUser}
                    disabled = {!hasModifications || isBlocked}
                    className="btn-fill"
                    color="info"
                    type="button"
                    onClick={() => applyChange()}
                    >
                    Aplicar        
                </Button>
            </span>
            </Tooltip>
            {isTaken ? <> &nbsp; </> : <></>}
            <Tooltip title={isBlocked ? "Cambio bloqueado" : ""}>
                <span>
                    <Button
                    hidden = {!isTaken || !isTakenByUser}
                    disabled = {isBlocked}
                    className="btn-fill"
                    color="danger"
                    type="button"
                    onClick={() => rejectChange()}
                    >
                    Rechazar        
                    </Button>
                </span>
            </Tooltip>
            {addBlockButton()}
            <Button className="btn-fill"
                color="primary"
                onClick={() => history.goBack()}
                >
                Volver        
            </Button>
        </Row>
        )
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="6">
          <Form>
          <Card className="change-card">
              <CardHeader >
                  <h4 className="title">Detalles del cambio</h4>
              </CardHeader>
              <CardBody >
                <div>
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
                              <Label style={{ color:"#1788bd" }}>Estado</Label>
                              <DisabledInput className="other_input"
                                  defaultValue= {currentValues.status}
                                  onChange = {function(e){updateCurrentValues("status", e.target.value)}}
                                  id = "type"
                                  type="text"
                          />
                          </FormGroup>
                      </Col>
                      <Col md="6">
                          <FormGroup>
                          <Label style={{ color:"#1788bd" }}>Prioridad</Label>
                              <DisabledInput className="other_input"
                                  defaultValue= {currentValues.priority}
                                  onChange = {function(e){updateCurrentValues("priority", e.target.value)}}
                                  id = "type"
                                  type="text"
                              />
                          </FormGroup>
                      </Col>
                  </Row>
                  <Row>
                      <Col md="6">
                          <FormGroup>
                              <Label style={{ color:"#1788bd" }}>Pedido por</Label>
                              <DisabledInput  className="other_input"
                                  readOnly
                                  defaultValue = {currentValues.created_by}
                                  onChange = {function(e){updateCurrentValues("created_by", e.target.value)}}
                                  id = "serial_number"
                                  type="text"
                              />
                          </FormGroup>
                      </Col>
                      <Col md="6">
                          <FormGroup>
                          <Label style={{ color:"#1788bd" }}>Tomado por</Label>
                              <DisabledInput  className="other_input"
                                  readOnly
                                  defaultValue = {currentValues.taken_by}
                                  onChange = {function(e){updateCurrentValues("taken_by", e.target.value)}}
                                  id = "serial_number"
                                  type="text"
                          />
                          </FormGroup>
                      </Col>
                  </Row>
                </div>
            <div class="items-div">
                <Grid>
                <h4 className="title">Items relacionados</h4>
                <ChangeTable data={itemsCiData}
                             columns={itemsColumns}
                             addWatchColumn={true}
                             excludeColumns={["id", "draft_change_id", "draft_id", "type", "is_restoring_draft"]}
                             details_button_path={"/admin/item_details/"}
                             edit_button_path={"/admin/item_edit/"}
                             restore_button_path={"/admin/item_restore/"}
                             type_row = {1}
                             change_callback_id = {change_id}
                             use_object_type = {true}
                             change_status = {[currentValues.status]} // si se pasa como puntero, se actualiza solo en la tabla
                             taken_by = {[currentValues.taken_by]} // si se pasa como puntero, se actualiza solo en la tabla
                             />
                </Grid>
                </div>
                <div class="items-div">
                <Grid>
                <h4 className="title">Incidentes y problemas</h4>
                <SimpleTable data={itemsData}
                             columns={incidentAndProblemsColumns}
                             addWatchColumn={true}
                             excludeColumns={["id", "type"]}
                             button_path={"_details"}
                             use_solvable_type = {true}/>
                </Grid>
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
                        commentCreationUrl={"changes/" + change_id + "/comments"}
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

export default ChangeDetails;
