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
import Tooltip from "@material-ui/core/Tooltip";
import SimpleTable from "components/Table/SimpleTable";
import {TABLES, PERMISSIONS, checkPermissions} from 'utils/permissions'
import CommentsTracking from "components/Form/comment_tracking";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export const PROBLEM_DETAILS_PATH = "/problem_details";
const tableData = [];
const incidentColumns = [
    {"name": "id", "label": "ID"},
    {"name": "description", "label": "Descripción"}
]



function ProblemDetails(props) {
    const classes = useStyles();
    const history = useHistory();
    var paths = window.location.pathname.split("/") 
    const [values, setValues] = React.useState("");
    const [currentValues, setCurrentValues] = React.useState("");
    const isEditable = checkPermissions(TABLES.PROBLEM, PERMISSIONS.UPDATE)
    const [enableCreateButton, setEnableCreateButton] = React.useState(false);
    const [itemsData, setItemsData] = React.useState([]);
    var problem_id = paths[paths.length - 1]
    const [bigChartData, setbigChartData] = React.useState(tableData);
    const [columns, setColumns] = React.useState(incidentColumns);
    const [formFields, setFormFields] = React.useState([{}])
    const [flushLocalComments, setFlushLocalComments] = React.useState(false);
    const [isBlocked, setIsBlocked] = React.useState(false);
    const [isTaken, setIsTaken] = React.useState(false);
    const [isTakenByUser, setIsTakenByUser] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [counter, setCounter] = React.useState(0);

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
        dbGet("problems/" + problem_id).then(data => {
            var incidents_data = data["incidents"]
            
            setItemsData(incidents_data);
        }).catch(err => {console.log(err)});
    }

    React.useEffect(() => {
        dbGet("problems/" + problem_id).then(data => {
            setValues(data);
            setCurrentValues(data);
            fetchItemsData();
            setIsBlocked(data["is_blocked"]);
            setIsTaken(data["taken_by"] !== null);
            setIsLoading(false);
            setIsTakenByUser(data.taken_by === localStorage.getItem("username"));
            console.log("comentarios: ", data)
        }).catch(err => {console.log(err)});
        }   , []);

    function fetchValues() {
            dbGet("problems/" + problem_id).then(data => {
                setValues(data);
            }).catch(err => {console.log(err)});
    }

    function solveProblem() {
        var patch_data = {status:"Resuelto"}
        dbPatch("problems/" + problem_id, patch_data);
        sendComment("Problema resuelto");
    }

    function blockProblem() {
        var patch_data = {is_blocked:true}
        dbPatch("problems/" + problem_id, patch_data);
        sendComment("Problema bloqueado");
        setIsBlocked(true);
    }

    function unblockProblem() {
        var patch_data = {is_blocked:false}
        dbPatch("problems/" + problem_id, patch_data);
        sendComment("Problema desbloqueado");
        setIsBlocked(false);
    }

    const takeChange = (data) => { 
        var patch_data = {taken_by:localStorage.getItem("username")}
        dbPatch("problems/" + problem_id, patch_data).then(data => {
            setCurrentValues(data);
            sendComment("Problema tomado");
            setIsTaken(true);
            setIsTakenByUser(true);
        });
    }

    function addBlockButton() {
        if (!isEditable) return
            return (
                 <> 
                    {isBlocked ? <>&nbsp;</> : <></>}
                    <Button className="btn-fill" align="left"
                    hidden = {!isTaken || !isBlocked || !isTakenByUser}
                    color="danger"
                    type="submit"
                    onClick={() => unblockProblem()}
                    >
                    Desbloquear        
                    </Button>
                    <Button className="btn-fill" align="left"
                    hidden = {!isTaken || isBlocked || !isTakenByUser}
                    color="danger"
                    type="submit"
                    onClick={() => blockProblem()}
                    >
                    Bloquear        
                    </Button> 
                </> 
            )
      }

  function addButtons() {
    if (isLoading) return;
    if (values === '') return;
    if (!isEditable || values.status === "Resuelto") {
        return (
            <Button className="btn-fill"
            color="warning"
            onClick={() => history.goBack()}
            >
            Volver        
            </Button>
        )
    }

    return (
        <Row style={{justifyContent:"center"}}>
            <Button className="btn-fill"
            hidden={isTaken}
            color="primary"
            type="submit"
            onClick={() => takeChange()}
            >
            Tomar        
            </Button>
            <Tooltip title={isBlocked ? "Problema bloqueado" : "" }>
                <span>
                    <Button className="btn-fill" align="right"
                        hidden={!isTaken || !isTakenByUser}
                        disabled = {isBlocked}
                        color="info"
                        type="submit"
                        onClick={() => solveProblem()}
                    >
                    Resolver        
                    </Button>
                </span>
            </Tooltip>
            {addBlockButton()}
            <Button className="btn-fill"
                color="warning"
                onClick={() => history.goBack()}
                >
                Volver        
            </Button>
        </Row>)
    
  }

  const sendComment = (comment) => {
    if (!comment) comment = document.getElementById("comment").value;  
    if (!comment) return;
    
    var created_by = localStorage.getItem("username");
    var post_data = {
        comment:comment,
        created_by:created_by
    }
    dbPost("problems/" + problem_id + "/comments", post_data).then(data => {
        fetchValues();
        setFlushLocalComments(true);
        setFlushLocalComments(false);
    })
 }


  return (
    <>
      <div className="content">
        <Row>
          <Col md="6">
          <Form onSubmit= {(e)=>e.preventDefault()}>
          <Card className="problem-card">
              <CardHeader>
                <h4 className="title">Detalles del problema</h4>
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
                              <Label style={{ color:"#1788bd" }}>Creado por</Label>
                              <DisabledInput  className="other_input"
                                  
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
                <h4 className="title">Incidentes asociados</h4>
                <SimpleTable data={itemsData}
                             columns={columns}
                             addWatchColumn={true}
                             excludeIdColumn={true} 
                             button_path={"/admin/incident_details/"}
                             use_object_type = {false}
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
          <Row>
          <Col md="11">
              <h4 className="title">Tracking</h4>
                <div>
                    <CommentsTracking 
                        comments={values.comments} 
                        commentCreationUrl={"problems/" + problem_id + "/comments"}
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

export default ProblemDetails;
