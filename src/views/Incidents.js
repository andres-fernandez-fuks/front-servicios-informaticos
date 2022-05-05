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
// import { Component } from "react/cjs/react.development";

const tableData = [
    {'id': 1, 'Nombre': 100, 'Prioridad': 'Alta', 'Estado': 'Resuelto', 'Creado por': 'mail@fi.uba.ar', 'Tomado por': 'mail@fi.uba.ar'}
];

const incidentColumns = [
    {"name": "id", "label": "id"},
    {"name": "description", "label": "Descripción"},
    {"name": "created_by", "label": "Creado por"},
    {"name": "created_at", "label": "Reportado el"},
    {"name": "priority", "label": "Prioridad"},
    {"name": "status", "label": "Estado"},
]

const incidentColumns2 = [
    {"id": "id"},
    {"description": "Descripción"},
    {"created_by": "Creado por"},
    {"created_at": "Reportado el"},
    {"priority": "Prioridad"},
    {"status": "Estado"},
]



function IncidentsTable() {
    const [bigChartData, setbigChartData] = useState(tableData);
    const [columns, setColumns] = useState(incidentColumns);
    const [category, setCategory] = useState("Mis incidentes");
    const classes = useStyles();
    useEffect(() => {
        dbGet("incidents").then(data => {
            setbigChartData(data);
            // setColumns(incidentColumns);
        }).catch(err => {console.log(err)});
    }   , []);
    function fetchData(event, endpoint) {
        const category = event.target.getAttribute("aria-label");
        setCategory(category);
        dbGet(endpoint).then(data => {
            setbigChartData(data);
        }).catch(err => {console.log(err)});
    }
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card className={classes.card} style={{paddingTop:5}}>
            <Col sm="12">
            <ButtonGroup
                className="btn-group-toggle float-right"
                data-toggle="buttons"
            >
                <Button
                tag="label"
                className={classNames("btn-simple", {
                    active: category === "Mis incidentes",
                })}
                color="info"
                id="0"
                size="sm"
                onClick={(e) => fetchData(e, "incidents/1")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="Mis incidentes">
                    Mis incidentes
                </span>
                <span className="d-block d-sm-none">
                    <i className="tim-icons icon-single-02" />
                </span>
                </Button>
                <Button
                color="info"
                id="1"
                size="sm"
                tag="label"
                className={classNames("btn-simple", {
                    active: category === "No tomados",
                })}
                onClick={(e) => fetchData(e, "incidents/not-assigned")}
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
                onClick={(e) => fetchData(e, "incidents/assigned")}
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
                onClick={(e) => fetchData(e, "incidents/solved")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="Resueltos">
                    Resueltos
                </span>
                <span className="d-block d-sm-none">
                    <i className="tim-icons icon-gift-2" />
                </span>
                </Button>
            </ButtonGroup>
            </Col>
              <CardHeader>
                <CardTitle tag="h4">Incidentes</CardTitle>
              </CardHeader>
              <CardBody>
              <CustomDataTable data={bigChartData} columns={columns}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}


export default IncidentsTable;
