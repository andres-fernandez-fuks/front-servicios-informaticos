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

export const CHANGE_DETAILS_PATH = "/change_details";

const tableData = [];
const incidentColumns = [
    {"name": "id", "label": "ID"},
    {"name": "type", "label": "Tipo"},
    {"name": "description", "label": "Descripción"}
    
]



function ChangeDetails(props) {
    const classes = useStyles();
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState("");
    const isEditable = false;
    const [enableCreateButton, setEnableCreateButton] = React.useState(false);
    const [itemsData, setItemsData] = React.useState([]);
    const [problemItemsData, setProblemItemsData] = React.useState([]);
    var paths = window.location.pathname.split("/") 
    var change_id = paths[paths.length - 1]
    const [bigChartData, setbigChartData] = React.useState(tableData);
    const [columns, setColumns] = React.useState(incidentColumns);
    const [formFields, setFormFields] = React.useState([{}])

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

            incidents_data.map(i => {
                i['type'] = "Incidente"
            })
            problems_data.map(i => {
                i['type'] = "Problema"
            })
            
            
            setItemsData([...incidents_data, ...problems_data]);
            setProblemItemsData(problems_data);
        }).catch(err => {console.log(err)});
    }

    React.useEffect(() => {
        dbGet("changes/" + change_id).then(data => {
            setValues(data);
            setCurrentValues(data);
            fetchItemsData();
        }).catch(err => {console.log(err)});
        }   , []);

    function fetchValues() {
            dbGet("changes/" + change_id).then(data => {
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
        // event.preventDefault();
        // var path = "changes/" + values.id ;
        // var request_values = getRequestValues();
        // dbPost(path, request_values).then(data => {
        //     
        //     history.push("/admin" + CHANGE_DETAILS_PATH + "/" + data.id);
        //     window.location.reload();
        // }
        // ).catch(err => {console.log(err)});
    }

    function updateType(new_type) {
        setValues({...values, type:new_type})
    }

    function currencyFormat(num) {
        if (!num) return;
        return '$ ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
     }

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

    const submitForm = (status) => { 
        var patch_data = {taken_by:localStorage.getItem("username"), status: status}
        dbPatch("changes/" + change_id, patch_data);
        history.push(simple_routes.changes);
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
    if (values.status === "Resuelto" || values.status == "Rechazado") {
        return;
    }
    if (!values.taken_by) {
        return (
        <Grid align="center">
        <Button className="btn-fill"
        color="primary"
        type="submit"
        onClick={() => submitForm("Resuelto")}
        >
        Aplicar        
        </Button>
        <Button className="btn-fill"
        color="secondary"
        type="submit"
        onClick={() => submitForm("Rechazado")}
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
        type="submit"
        onClick={() => solveChange()}
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
          <Form onSubmit= {handleSubmit}>
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
                <h4 className="title"></h4>
                <SimpleTable data={itemsData}
                             columns={columns}
                             //addWatchColumn={true}
                             excludeIdColumn={true} 
                             //button_path={"/admin/incidents_details/"}
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
