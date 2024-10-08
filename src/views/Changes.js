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
import { useHistory } from "react-router-dom";
import simple_routes from "utils/routes_simple.js"
import AddIcon from '@mui/icons-material/Add';
import { CHANGE_DETAILS_PATH } from "pages/ChangeDetailsPage";
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
// import { Component } from "react/cjs/react.development";

const tableData = [];

const changeColumns = [
    {"name": "id", "label": "id"},
    {"name": "description", "label": "Descripción"},
    {"name": "created_by", "label": "Pedido por"},
    {"name": "created_at", "label": "Creado el"},
    {"name": "priority", "label": "Prioridad"},
    {"name": "status", "label": "Estado"},
]


function ChangesTable() {
    const history = useHistory();
    const [bigChartData, setbigChartData] = useState(tableData);
    const [columns, setColumns] = useState(changeColumns);
    const [category, setCategory] = useState("No tomados");
    const classes = useStyles();

    const RedirectToProblemCreation = () => {
        history.push(simple_routes.changeCreation);
    };
    useEffect(() => {
        dbGet("changes/pending").then(data => {
            setbigChartData(data);
        }).catch(err => {console.log(err)});
    }   , []);
    function fetchData(event, endpoint, filterStatus) {
        const category = event.target.getAttribute("aria-label");
        setCategory(category);
        dbGet(endpoint).then(data => {
            if (filterStatus) {
                data = data.filter(e => e.status == filterStatus)
            }
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
                color="info"
                id="1"
                size="sm"
                tag="label"
                className={classNames("btn-simple", {
                    active: category === "No tomados",
                })}
                onClick={(e) => fetchData(e, "changes/pending")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="No tomados">
                    Pendientes
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
                    active: category === "Aplicados",
                })}
                onClick={(e) => fetchData(e, "changes/solved", "Resuelto")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="Aplicados">
                    Aplicados
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
                onClick={(e) => fetchData(e, "changes/assigned", "Rechazado")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="Resueltos">
                    Rechazados
                </span>
                <span className="d-block d-sm-none">
                    <i className="tim-icons icon-gift-2" />
                </span>
                </Button>
                <Button
                hidden={!checkPermissions(TABLES.CHANGE, PERMISSIONS.UPDATE)}
                tag="label"
                className={classNames("btn-simple", {
                    active: category === "Mis cambios",
                })}
                color="info"
                id="0"
                size="sm"
                onClick={(e) => fetchData(e, "changes")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="Mis cambios">
                    Mis cambios
                </span>
                <span className="d-block d-sm-none">
                    <i className="tim-icons icon-single-02" />
                </span>
                </Button>
            </ButtonGroup>
            </Col>
              <CardHeader>
                <CardTitle tag="h3">Cambios &nbsp; &nbsp;
                <Button
                    size="sm" 
                    aria-label="Crear Cambio"
                    color="warning"
                    style={{backgroundColor:"white"}}
                    onClick={() => {RedirectToProblemCreation();}}
                    hidden={!checkPermissions(TABLES.CHANGE, PERMISSIONS.CREATE)}

                    >
                    <AddIcon /> Nuevo &nbsp;
                </Button>
                </CardTitle>
              </CardHeader>
              <CardBody>
              <CustomDataTable data={bigChartData} columns={columns} edit_details_path = {CHANGE_DETAILS_PATH}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}


export default ChangesTable;
