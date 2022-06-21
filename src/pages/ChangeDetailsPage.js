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
import ChangeTable from "components/Table/ChangeTable";

export const CHANGE_DETAILS_PATH = "/change_details";

const tableData = [];
const itemsColumns = [
    {"name": "id", "label": "ID"},
    {"name": "type_show", "label": "Tipo"},
    {"name": "name", "label": "Nombre"},
    {"name": "draft_change_id", "label": "draft_change_id"},
]

const incidentColumns = [
    {"name": "id", "label": "ID"},
    {"name": "type_show", "label": "Tipo"},
    {"name": "description", "label": "Descripción"}
    
]



function ChangeDetails(props) {
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState("");
    const isEditable = false;
    const [enableCreateButton, setEnableCreateButton] = React.useState(false);
    const [itemsData, setItemsData] = React.useState([]);
    const [itemsCiData, setItemsCiData] = React.useState([]);
    const [problemItemsData, setProblemItemsData] = React.useState([]);
    var paths = window.location.pathname.split("/") 
    var change_id = paths[paths.length - 1]
    const [columns, setColumns] = React.useState(incidentColumns);
    const [formFields, setFormFields] = React.useState([{}])
    localStorage.setItem("wasInChange", true)

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
            var incidents_data = data["incidents"]
            var problems_data = data["problems"]
            var ci = []

            incidents_data.map(i => {
                i['type_show'] = "Incidente"
            })
            problems_data.map(i => {
                i['type_show'] = "Problema"
            })
            
            data["hardware_configuration_items"].map(i => {
                i['type_show'] = "Hardware"
                i['type'] = "hardware"
                i['draft_change_id'] = i['draft'] && i['draft']['change_id']
                ci.push(i)
                console.log(i)
            })

            data["software_configuration_items"].map(i => {
                i['type_show'] = "Software"
                i['type'] = "software"
                i['draft_change_id'] = i['draft'] && i['draft']['change_id']
                ci.push(i)
                console.log(i)
            })

            data["sla_configuration_items"].map(i => {
                i['type_show'] = "SLA"
                i['type'] = "sla"
                i['draft_change_id'] = i['draft'] && i['draft']['change_id']
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
            localStorage.setItem("change_id", change_id);
        }).catch(err => {console.log(err)});
        }   , []);

    function fetchValues() {
            dbGet("changes/" + change_id).then(data => {
                setValues(data);
            }).catch(err => {console.log(err)});
    }

    function solveChange() {
        var patch_data = {status:"Resuelto"}
        dbPatch("changes/" + change_id, patch_data);
        history.push(simple_routes.changes);
    }

    function blockChange() {
        var patch_data = {is_blocked:true}
        dbPatch("changes/" + change_id, patch_data);
        // history.push(simple_routes.changes);
        window.location.reload(false);
    }

    function unblockChange() {
        var patch_data = {is_blocked:false}
        dbPatch("changes/" + change_id, patch_data);
        // history.push(simple_routes.changes);
        window.location.reload(false);
    }

    const applyChange = () => { 
        dbPost("changes/" + change_id + "/apply", {}).then(data => {
        } ).catch(err => {console.log(err)});
        var patch_data = {taken_by:localStorage.getItem("username"), status: "Resuelto"}
        dbPatch("changes/" + change_id, patch_data).then(data => {
            history.push(simple_routes.changes);
        }).catch(err => {console.log(err)});
    }

    const rejectChange = () => { 
        dbPost("changes/" + change_id + "/discard", {}).then(data => {
        } ).catch(err => {console.log(err)});
        var patch_data = {taken_by:localStorage.getItem("username"), status: "Rechazado"}
        dbPatch("changes/" + change_id, patch_data).then(data => {
            history.push(simple_routes.changes);
        }).catch(err => {console.log(err)});
    }

  function addBlockButton() {
    if (values.is_blocked === true) {
        return (
            <Button className="btn-fill" align="left"
            color="warning"
            type="submit"
            onClick={() => unblockChange()}
            >
            Desbloquear        
            </Button>
        )
    }
    return (
        <Button className="btn-fill" align="left"
        color="warning"
        type="submit"
        onClick={() => blockChange()}
        >
        Bloquear        
        </Button>  
    )
  }

  function addButtons() {
      if (values === '') {
      fetchValues();
    }
    if (values.status === "Resuelto" || values.status === "Rechazado") {
        return;
    }
    if (!values.taken_by) {
        return (
        <Grid align="center">
        <Button className="btn-fill"
        color="primary"
        onClick={() => applyChange()}
        >
        Aplicar        
        </Button>
        <Button className="btn-fill"
        color="secondary"
        onClick={() => rejectChange()}
        >
        Rechazar        
        </Button>
        </Grid>
        )
    }
    if (values.taken_by !== undefined) {
    return (
        <Grid align="center">
        <Button className="btn-fill" align="right"
        color="success"
        onClick={() => applyChange()}
        >
        Aplicar        
        </Button>
        {addBlockButton()}
        </Grid>)
    }
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
                              <Input
                                  readOnly = {isEditable}
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
                              <Input className="other_input"
                                  readOnly = {isEditable}
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
                              <Input className="other_input"
                                  readOnly = {isEditable}
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
                              <Input  className="other_input"
                                  readOnly = {isEditable}
                                  defaultValue = {currentValues.created_by}
                                  onChange = {function(e){updateCurrentValues("created_by", e.target.value)}}
                                  id = "serial_number"
                                  type="text"
                              />
                          </FormGroup>
                      </Col>
                      <Col md="6">
                          <FormGroup>
                          <Label style={{ color:"#1788bd" }}>Resuelto por</Label>
                              <Input  className="other_input"
                                  readOnly = {isEditable}
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
                             excludeColumns={["id", "draft_change_id"]}
                             details_button_path={"/admin/item_details/"}
                             edit_button_path={"/admin/item_edit/"}
                             type_row = {1}
                             change_callback_id = {change_id}
                             use_object_type = {true}/>
                </Grid>
                </div>
                <div class="items-div">
                <Grid>
                <h4 className="title">Incidentes y problemas</h4>
                <SimpleTable data={itemsData}
                             columns={incidentColumns}
                             //addWatchColumn={true}
                             excludeIdColumn={true} 
                             //button_path={"/admin/incidents_details/"}
                             use_object_type = {false}/>
                </Grid>
            </div>
              </CardBody>
              <CardFooter className="form_col">
              {addButtons()}
              </CardFooter>
          </Card>
          </Form>
          </Col>
          <Col md="6">
          <Row>
            <Card className="card-user">
              <CardBody className="comment-card">
              <div className="comment-card">
              <h4 className="title">Comentarios</h4>
              </div>
              </CardBody>
            </Card>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ChangeDetails;
