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

const errorColumns = [
    {"name": "id", "label": "id"},
    {"name": "description", "label": "Descripción"},
    {"name": "solution", "label": "Solución"}
]


function ChangesTable() {
    const [bigChartData, setbigChartData] = useState(tableData);
    const [columns, setColumns] = useState(errorColumns);
    const [category, setCategory] = useState("Mis errores");
    const classes = useStyles();
    useEffect(() => {
        dbGet("errors").then(data => {
            setbigChartData(data);
            // setColumns(errorColumns);
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
            </Col>
              <CardHeader>
                <CardTitle tag="h4">Errores</CardTitle>
              </CardHeader>
              <CardBody>
              <CustomDataTable data={bigChartData} columns={columns} addEditColumn={false} center_all_columns={true}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}


export default ChangesTable;
