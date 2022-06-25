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
import simple_routes from "utils/routes_simple.js"
import { useHistory } from "react-router-dom";
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
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import { Component } from "react/cjs/react.development";

import {ITEM_DETAILS_PATH} from "../pages/items/HardwareItemDetailsPage.js";

const tableData = [];

const hardwareItemColumns = [
    {"name": "id", "label": "id"},
    {"name": "name", "label": "Nombre"},
    {"name": "current_version_number", "label": "Versión actual"},
    {"name": "manufacturer", "label": "Fabricante"},
    {"name": "serial_number", "label": "N° de serie"},
]

const softwareItemColumns = [
    {"name": "id", "label": "id"},
    {"name": "name", "label": "Nombre"},
    {"name": "type", "label": "Tipo"},
    {"name": "description", "label": "Descripción"},
    {"name": "provider", "label": "Proveedor"},
    {"name": "software_version", "label": "Versión de software"},
]

const SLAItemColumns = [
    {"name": "id", "label": "id"},
    {"name": "name", "label": "Nombre"},
    {"name": "description", "label": "Descripción"},
    {"name": "service_type", "label": "Tipo de servicio"},
    {"name": "service_manager", "label": "Gerente de servicio"},
    {"name": "starting_date", "label": "Inicio"},
    {"name": "ending_date", "label": "Fin"},
]

function ItemsTable() {
    const history = useHistory();
    localStorage.removeItem("wasInChange")

    const [bigChartData, setbigChartData] = useState(tableData);
    const [columns, setColumns] = useState(hardwareItemColumns);
    const [category, setCategory] = useState("Hardware");
    const classes = useStyles();
    useEffect(() => {
        dbGet("/configuration-items/hardware").then(data => {
            setbigChartData(data);
            // setColumns(columns);
        }).catch(err => {console.log(err)});
    }   , []);
    function fetchData(event, endpoint, columns=hardwareItemColumns, item_category) {
        setCategory(item_category);
        dbGet(endpoint).then(data => {
            setbigChartData(data);
            setColumns(columns);
        }).catch(err => {console.log(err)});
    }

    function redirectToItemCreation() {
        console.log("CATEGORIA: " + category)
        debugger;
        if (category === "Hardware") {
            history.push(simple_routes.hardware_creation);
        } else if (category === "Software") {
            history.push(simple_routes.software_creation);
        } else if (category === "SLA") {
            history.push(simple_routes.sla_creation);
        }
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
                tag="label"
                className={classNames("btn-simple", {
                    active: category === "Hardware",
                })}
                color="info"
                id="0"
                size="sm"
                onClick={(e) => fetchData(e, "/configuration-items/hardware", hardwareItemColumns, "Hardware")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="Hardware">
                Hardware
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
                    active: category === "Software",
                })}
                onClick={(e) => fetchData(e, "/configuration-items/software", softwareItemColumns, "Software")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="Software">
                   Software
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
                    active: category === "SLA",
                })}
                onClick={(e) => fetchData(e, "/configuration-items/sla", SLAItemColumns, "SLA")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="SLA">
                    SLA
                </span>
                <span className="d-block d-sm-none">
                    <i className="tim-icons icon-gift-2" />
                </span>
                </Button>
            </ButtonGroup>
            </Col>
              <CardHeader>
                <CardTitle tag="h3">Ítems &nbsp; &nbsp; &nbsp;
                <Button
                  size="sm" 
                  aria-label="Crear ítem"
                  color="warning"
                  hidden={!checkPermissions(TABLES.HARDWARE_ITEM, PERMISSIONS.EDIT)}
                  onClick={() => {redirectToItemCreation();}}
                  >
                  <AddIcon /> Nuevo
                </Button> 
                </CardTitle>
              </CardHeader>
              <CardBody>
              <CustomDataTable
                data={bigChartData}
                columns={columns}
                edit_details_path = {ITEM_DETAILS_PATH}
                edit_extra_path = {category ? category.toLowerCase() : "hardware"}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}


export default ItemsTable;
