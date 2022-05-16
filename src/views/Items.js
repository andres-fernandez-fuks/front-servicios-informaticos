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

const tableData = [];

const hardwareItemColumns = [
    {"name": "id", "label": "id"},
    {"name": "name", "label": "Nombre"},
    {"name": "Description", "label": "Descripción"},
    {"name": "manufacturer", "label": "Proveedor"},
    {"name": "serial_number", "label": "N° de serie"},
]



function ItemsTable() {
    const [bigChartData, setbigChartData] = useState(tableData);
    const [columns, setColumns] = useState(hardwareItemColumns);
    const [category, setCategory] = useState("Hardware");
    const classes = useStyles();
    useEffect(() => {
        dbGet("items").then(data => {
            setbigChartData(data);
            // setColumns(columns);
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
                    active: category === "Hardware",
                })}
                color="info"
                id="0"
                size="sm"
                onClick={(e) => fetchData(e, "/configuration-items/hardware")}
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
                onClick={(e) => fetchData(e, "/configuration-items/software")}
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
                onClick={(e) => fetchData(e, "/configuration-items/sla")}
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
                <CardTitle tag="h4">Items</CardTitle>
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


export default ItemsTable;
