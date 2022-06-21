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
import { PROBLEM_DETAILS_PATH } from "pages/ProblemDetailsPage";
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


const tableData = [];

const problemColumns = [
    {"name": "id", "label": "id"},
    {"name": "description", "label": "Descripción"},
    {"name": "created_by", "label": "Creado por"},
    {"name": "created_at", "label": "Reportado el"},
    {"name": "priority", "label": "Prioridad"},
    {"name": "status", "label": "Estado"},
]


function ProblemsTable() {
    const history = useHistory();
    const [bigChartData, setbigChartData] = useState(tableData);
    const [columns, setColumns] = useState(problemColumns);
    const [category, setCategory] = useState("Mis problemas");
    const classes = useStyles();

    useEffect(() => {
        dbGet("problems").then(data => {
            setbigChartData(data);
            // setColumns(problemColumns);
        }).catch(err => {console.log(err)});
    }   , []);

    const RedirectToProblemCreation = () => {
        history.push(simple_routes.problemCreation);
    };

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
      <Toaster />
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
                    active: category === "Mis problemas",
                })}
                color="info"
                id="0"
                size="sm"
                onClick={(e) => fetchData(e, "problems")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block" aria-label="Mis problemas">
                    Mis problemas
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
                onClick={(e) => fetchData(e, "problems/not-assigned")}
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
                onClick={(e) => fetchData(e, "problems/assigned")}
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
                onClick={(e) => fetchData(e, "problems/solved")}
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
                <CardTitle
                tag="h4">Problemas &nbsp; &nbsp; &nbsp;
                <IconButton
                    size="small" 
                    aria-label="Crear Problema"
                    color="info"
                    style={{backgroundColor:"white"}}
                    onClick={() => {RedirectToProblemCreation();}}
                    hidden={!checkPermissions(TABLES.PROBLEM, PERMISSIONS.CREATE)}
                    >
                    <AddIcon />
                </IconButton>
                </CardTitle>
              </CardHeader>
              <CardBody>
              <CustomDataTable data={bigChartData} columns={columns} edit_details_path = {PROBLEM_DETAILS_PATH}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}


export default ProblemsTable;
