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
import React, {useState, useEffect} from "react";
import classNames from "classnames";
import CustomDataTable from "../components/Table/DynamicTable.js";
import useStyles from "../styles";
import {dbGet} from "../utils/backendFetchers";
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import toast, { Toaster } from 'react-hot-toast';
import {TABLES, PERMISSIONS, checkPermissions} from 'utils/permissions'

// reactstrap components
import {
  Button,  
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import {INCIDENT_DETAILS_PATH} from "../pages/IncidentDetailsPage.js";
// import { Component } from "react/cjs/react.development";

const tableData = [];

const unassignedIncidentColumns = [
    {"name": "id", "label": "ID"},
    {"name": "description", "label": "Descripción"},
    {"name": "created_at", "label": "Reportado el"},
    {"name": "priority", "label": "Prioridad"},
    {"name": "status", "label": "Estado"},
]

const assignedIncidentColumns = [
    {"name": "id", "label": "ID"},
    {"name": "description", "label": "Descripción"},
    {"name": "created_at", "label": "Reportado el"},
    {"name": "taken_by", "label": "Tomado por"},
    {"name": "priority", "label": "Prioridad"},
    {"name": "status", "label": "Estado"},
]

const myIncidentColumns = [
    {"name": "id", "label": "ID"},
    {"name": "description", "label": "Descripción"},
    {"name": "created_at", "label": "Reportado el"},
    {"name": "priority", "label": "Prioridad"},
    {"name": "status", "label": "Estado"},
]

const solvedIncidentColumns = [
    {"name": "id", "label": "ID"},
    {"name": "description", "label": "Descripción"},
    {"name": "taken_by", "label": "Tomado por"},
    {"name": "created_at", "label": "Reportado el"},
    {"name": "priority", "label": "Prioridad"},
    {"name": "status", "label": "Estado"},
]


function IncidentsTable() {
    const history = useHistory();
    // EDIT DISTRIBUTOR
    const RedirectToIncidentCreation = () => {
        history.push(simple_routes.incidentCreation);
    };
    const my_incidents_route = "users/" + localStorage.getItem("user_id") + "/incidents" ;
    const [bigChartData, setbigChartData] = useState(tableData);
    const [columns, setColumns] = useState(myIncidentColumns);
    const [category, setCategory] = useState("No tomados");
    const classes = useStyles();
    useEffect(() => {
        dbGet("incidents/not-assigned").then(data => {
            setbigChartData(data);
        }).catch(err => {console.log(err)});
    }   , []);
    function fetchData(event, endpoint, columns) {
        const category = event.target.getAttribute("aria-label");
        setCategory(category);
        dbGet(endpoint).then(data => {
            setbigChartData(data);
            setColumns(columns);
        }).catch(err => {console.log(err)});
    }

  
  return (
    <>
      <div className="content">
      <Toaster/>
        <Row>
          <Col md="12">
            <Card className={classes.card} style={{paddingTop:5}}>
            <Col sm="12">
            <ButtonGroup
                className="btn-group-toggle float-right"
                data-toggle="buttons"
            >
                <Button
                color="info"
                id="1"
                size="sm"
                tag="label"
                className={classNames("btn-simple", {
                    active: category === "No tomados",
                })}
                onClick={(e) => fetchData(e, "incidents/not-assigned", unassignedIncidentColumns)}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="No tomados">
                    No tomados
                </span>
                <span className="d-block d-sm-none">
                    <i className="tim-icons icon-gift-2" />
                </span>
                </Button>
                <Button
                color="info"
                id="2"
                size="sm"
                tag="label"
                className={classNames("btn-simple", {
                    active: category === "Tomados",
                })}
                onClick={(e) => fetchData(e, "incidents/assigned", assignedIncidentColumns)}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="Tomados">
                    Tomados
                </span>
                <span className="d-block d-sm-none">
                    <i className="tim-icons icon-gift-2" />
                </span>
                </Button>
                <Button
                color="info"
                id="3"
                size="sm"
                tag="label"
                className={classNames("btn-simple", {
                    active: category === "Resueltos",
                })}
                onClick={(e) => fetchData(e, "incidents/solved", solvedIncidentColumns)}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="Resueltos">
                    Resueltos
                </span>
                <span className="d-block d-sm-none">
                    <i className="tim-icons icon-gift-2" />
                </span>
                </Button>
                <Button
                hidden={!checkPermissions(TABLES.INCIDENT, PERMISSIONS.CREATE)}
                tag="label"
                className={classNames("btn-simple", {
                    active: category === "Mis incidentes",
                })}
                color="info"
                id="0"
                size="sm"
                onClick={(e) => fetchData(e, my_incidents_route, myIncidentColumns)}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="Mis incidentes">
                    Mis incidentes
                </span>
                <span className="d-block d-sm-none">
                    <i className="tim-icons icon-single-02" />
                </span>
                </Button>
            </ButtonGroup>
            </Col>
              <CardHeader>
                <CardTitle tag="h3"> Incidentes &nbsp; &nbsp;
                    <Button
                        size="sm" 
                        aria-label="Crear Incidente"
                        color="warning"
                        style={{backgroundColor:"white"}}
                        onClick={() => {RedirectToIncidentCreation();}}
                        hidden={!checkPermissions(TABLES.INCIDENT, PERMISSIONS.CREATE)}
                        >
                        <AddIcon />  Nuevo &nbsp;
                    </Button>
                </CardTitle>
              </CardHeader>
              <CardBody>
              <CustomDataTable
                data={bigChartData}
                columns={columns} 
                edit_details_path = {INCIDENT_DETAILS_PATH}
              />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}


export default IncidentsTable;