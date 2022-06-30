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
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { dbGet } from "utils/backendFetchers";
// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";


import LineGraph from "components/Graphs/LineGraph";
import {LastYearGraph, MonthlyGraph} from "components/Graphs/LastYearGraph";
import moment from "moment";
import BarGraph from "components/Graphs/BarGraph";
import {SolvedByUserGraph} from "components/Graphs/SolvedByUserGraph";
import { AvgGraph } from "components/Graphs/AvgGraph";
import { PieGraph } from "components/Graphs/PieGraph";
import { setSourceMapRange } from "typescript";
import "./style.css";


const endpoint_names  = {
  "incidents": "Incidentes",
  "changes": "Cambios",
  "problems": "Problemas"
}
const names_endpoints  = {
  "Incidentes": "incidents",
  "Cambios": "changes",
  "Problemas": "problems" 
}

const options = [
  { value: 'Incidentes', label: 'Incidentes' },
  { value: 'Problemas', label: 'Problemas' },
]

function Dashboard(props) {
  const [bigChartData, setbigChartData] = React.useState([]);
  const [bigChartName, setbigChartName] = React.useState("");
  const [centerChartData, setcenterChartData] = React.useState([]);
  const [centerChartName, setcenterChartName] = React.useState("");
  const [solvedRatio, setsolvedRatio] = React.useState(0);
  const [solvedByUserData, setsolvedByUserData] = React.useState([]);
  const [itemsWithMoreSolvables, setitemsWithMoreSolvables] = React.useState([]);
  const [category, setCategory] = React.useState("incidents");
  const [avgSolvingTime, setAvgSolvingTime] = React.useState(0);
  const [avgData, setAvgData] = React.useState([]);
  const [leftChartData, setleftChartData] = React.useState([]);
  const [leftChartName, setleftChartName] = React.useState("");
  const [createdLastMonth, setcreatedLastMonth] = React.useState("Cargando...");
  const [pieData, setPieData] = React.useState([]);
  const [solvableData, setSolvableData] = React.useState(null);
  const [solvableSolvedData, setSolvableSolvedData] = React.useState(null);
  const [itemsData, setItemsData] = React.useState(null);
  const [maxCreationDay, setMaxCreationDay] = React.useState("Cargando...");
  const [maxItemWithSolvables, setMaxItemWithSolvables] = React.useState("Cargando...");
  const [mostSolvingUser, setMostSolvingUser] = React.useState("Cargando...");

  React.useEffect(() => {
    getSolvableData(category);
    getSolvableSolvedData(category);
    getItemsData();
  }, [category])

  React.useEffect(() => {
    getCreatedByDate();
    getCreatedVSSolved();
    getCreatedThisWeek();
    getPieData();
    }, [solvableData])

  React.useEffect(() => {
    getCreatedVSSolved();
    getSolvedByUser();
    getAverageData();
    calculateAverageSolvingTime();
    }, [solvableSolvedData])

  React.useEffect(() => {
    getItemsWithMoreSolvables(category);
    }, [itemsData])

  function getSolvableData(category) {
    dbGet(category).then((data) => {
        setSolvableData(data);
    }).catch((err) => {
        console.log(err);
      })
  }

  function getSolvableSolvedData(category) {
    dbGet(category + "/solved").then((data) => {
        setSolvableSolvedData(data);
    }).catch((err) => {
        console.log(err);
      })
  }

  function getItemsData() {
    dbGet("configuration-items/all").then((data) => {
        setItemsData(data);
    }).catch((err) => {
        console.log(err);
      })
  }

  function getCreatedByDate(){
    if (!solvableData) return;
    let mapped = solvableData.map((element) => {
        return element["created_at"]})
      let counted = mapped.reduce((prev, curr) => {
        prev[curr] = (prev[curr] || 0) + 1;
        return prev;
      }, {})
      let consolidated = Object.entries(counted).map((element) => {
        return {
          x: new Date(moment(element[0], "DD/MM/YYYY").toDate().toDateString()),
          y: element[1],
        }
      })
      setbigChartData(consolidated);
  }

  function getItemsWithMoreSolvables(name){
    if (!itemsData) return;

    var data = itemsData["items"]
    let mapped = data.map((element) => {
      return [element["name"], element["value"]]})
    let consolidated = mapped.map(element => {
      return {
        x: element[0],
        y: element[1],
      }
    })

    let max_item = data[0].name
    setMaxItemWithSolvables(max_item)
    setitemsWithMoreSolvables(consolidated);
    setbigChartName(endpoint_names[name])
  }

  function getAverageData(){
    if (!solvableSolvedData) return;

    let mapped = solvableSolvedData.map((element) => {
        return element["solving_time"]
      })
      let filtered = mapped.filter((element) => {
        return element != null || element > 0;
     })
      let consolidated = filtered.map((element, i) => {
        return {
          x: i,
          y: element,
        }
      })
      setAvgData(consolidated);
  }

  function getPieData(){
    if (!solvableData) return;
    var solved = 0;
    var notSolved = 0;
    solvableData.forEach((element) => {
      if(element.status === "Resuelto") solved++;
      else notSolved++;
    })
    var data = {
      labels: ["Resueltos", "No resueltos"],
      values: [solved, notSolved],
    }
    setPieData(data);
  }

  function calculateAverageSolvingTime() {
    if (!solvableSolvedData) return;
    let mapped = solvableSolvedData.map((element) => {
        return element["solving_time"]
      })
      let filtered = mapped.filter((element) => {
          return element != null
      })
      let avg = filtered.reduce((prev, curr) => {
          return prev + curr
      }
      , 0) / filtered.length
      setAvgSolvingTime(avg);
  }

  function getSolvedByUser(){
    if (!solvableSolvedData) return;
    let mapped = solvableSolvedData.map((element) => {
        return element["taken_by"]})
      let counted = mapped.reduce((prev, curr) => {
        prev[curr] = (prev[curr] || 0) + 1;
        return prev;
      }, {})
      let consolidated = Object.entries(counted).map((element) => {
        return {
          x: element[0],
          y: element[1],
        }
      })
      consolidated.sort((a, b) => {
        return b.y - a.y;
        }   // sort descending
      )
      consolidated = consolidated.slice(0, 5)
      setsolvedByUserData(consolidated);
      setMostSolvingUser(consolidated[0] ? consolidated[0].x : 'No hay incidentes resueltos');
  }

  function getCreatedThisWeek(){
    if (!solvableData) return;

    let solvables_by_week_day = {};

    solvableData.forEach((element) => {
        let date = moment(element["created_at"], "DD/MM/YYYY").weekday();
        date = date === 0 ? 6 : date - 1;
        solvables_by_week_day[date] = (solvables_by_week_day[date] || 0) + 1;
    })

    const day_names = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado", "Domingo"]

    for (var i in day_names) {
      if (solvables_by_week_day[i] === undefined) {
          solvables_by_week_day[i] = 0;
      }
    }

    let consolidated = Object.entries(solvables_by_week_day).map((element) => {
        return {
            x: day_names[element[0]],
            y: element[1],
        }
    })
    let max_day = Object.entries(solvables_by_week_day).reduce((a, b) => a[1] > b[1] ? a : b)[0]

    setleftChartData(consolidated);
    setMaxCreationDay(day_names[max_day]);
  }
  
  function getCreatedVSSolved(name){
    if (!solvableData || !solvableSolvedData) return;
    let data = []
    let aux = {
        x: "Creados",
        y: solvableData.length,
      }
      data.push(aux)
      let aux2 = {
        x: "Resueltos",
        y: solvableSolvedData.length,
      }
      data.push(aux2)
      setcenterChartData(data);
      setcenterChartName(endpoint_names[name])
      setsolvedRatio(data[1]["y"] / data[0]["y"])
  }
  return (
    <>
      <div className="content">
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">{endpoint_names[category]} creados por mes en el último año</h5>
                    <CardTitle tag="h2">Performance</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: category === "incidents",
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => setCategory("incidents")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Incidentes
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
                          active: category === "problems",
                        })}
                        onClick={() => setCategory("problems")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Problemas
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
                          active: category === "changes",
                        })}
                        onClick={() => setCategory("changes")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Cambios
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <LastYearGraph
                    current_year={moment().get("year")}
                    current_month={moment().get("month")}
                    data={bigChartData}
                    name={bigChartName}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">{endpoint_names[category]} Creados por día de semana</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-bell-55 text-info" /> Día con más {endpoint_names[category].toLowerCase()}: {maxCreationDay}
                </CardTitle>
                
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <BarGraph
                    data={leftChartData}
                    name={leftChartName}
                    frameInMonth = {false}
                    showDataLabelsOnly = {false}
                    noRotation={true}
                    color = "teal"
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                <Col>
                <h5 className="card-category">Ratio de resolución</h5>
                <CardTitle tag="h3">
                  {/*icon-check-2 */}
                  <i className="tim-icons icon-notes text-primary" />{" "}
                  {parseFloat(solvedRatio * 100).toFixed(0)+"%"}
                </CardTitle>
                </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <PieGraph
                    data={pieData}
                    name={centerChartName}
                    frameInMonth={true}
                    showDataLabelsOnly={true}
                    color = "purple"
                    
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">{endpoint_names[category]} resueltos por usuario (top 5)</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-user-run text-success" /> Top: {mostSolvingUser}
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                    <SolvedByUserGraph
                      data={solvedByUserData}
                      name={"leftChartName"}
                      frameInMonth={false}
                      showDataLabelsOnly={true}
                    />
                  </div>
                </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="8">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Ítems con más {endpoint_names[category]}</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-settings-gear-63 text-info" /> Ítem: {maxItemWithSolvables}
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                    <BarGraph
                      data={itemsWithMoreSolvables}
                      name={"Ítems con más incidentes"}
                      frameInMonth={false}
                      showDataLabelsOnly={true}
                      noRotation={true}
                      color = "darkred"
                    />
                  </div>
                </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Tiempo de resolución promedio</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-watch-time text-info" /> Promedio: {parseInt(avgSolvingTime)} días
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <AvgGraph
                    current_year={moment().get("year")}
                    current_month={moment().get("month")}
                    data={avgData}
                    name={bigChartName}
                    avg={avgSolvingTime}
                  />
                </div>
                </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
