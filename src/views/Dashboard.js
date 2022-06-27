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
import { Line, Bar } from "react-chartjs-2";
import { dbGet } from "utils/backendFetchers";
import Select from 'react-select'
import { selectStyles } from "pages/items/SLAItemCreationPage";
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

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
} from "variables/charts.js";
import LineGraph from "components/Graphs/LineGraph";
import {LastYearGraph} from "components/Graphs/LastYearGraph";
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
  const [pieData, setPieData] = React.useState([]);

  React.useEffect(() => {
    getCreatedByDate(category);
    getCreatedVSSolved(category);
    getSolvedByUser(category + "/solved");
    getItemsWithMoreSolvables(category);
    getAverageData(category);
    calculateAverageSolvingTime(category);
    getPieData(category);
  }, [category])

  function getCreatedByDate(name){
    dbGet(name).then((res) => {
      let mapped = res.map((element) => {
        return element["created_at"]})
      console.log("mapped", mapped)
      let counted = mapped.reduce((prev, curr) => {
        prev[curr] = (prev[curr] || 0) + 1;
        return prev;
      }, {})
      console.log("counted", counted)
      let consolidated = Object.entries(counted).map((element) => {
        return {
          x: new Date(moment(element[0], "DD/MM/YYYY").toDate().toDateString()),
          y: element[1],
        }
      })
      setbigChartData(consolidated);
      setbigChartName(endpoint_names[name])
    }).catch((err) => {
      console.log(err);
    })
  }

  function getItemsWithMoreSolvables(name){
    dbGet("configuration-items/all").then((res) => {
      var data = res["items"]  
      let mapped = data.map((element) => {
        return [element["name"], element["value"]]})
      let consolidated = mapped.map(element => {
        return {
          x: element[0],
          y: element[1],
        }
      })
      setitemsWithMoreSolvables(consolidated);
      setbigChartName(endpoint_names[name])
    }).catch((err) => {
      console.log(err);
    })
  }

  function getAverageData(name){
    dbGet(name).then((res) => {
      let mapped = res.map((element) => {
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
    }).catch((err) => {
      console.log(err);
    })
  }

  function getPieData(name){
    dbGet(name).then((res) => {
      var solved = 0;
      var notSolved = 0;
      res.forEach((element) => {
        if(element.status === "Resuelto") solved++;
        else notSolved++;
      })
      var data = {
        labels: ["Resueltos", "No resueltos"],
        values: [solved, notSolved],
      }
      setPieData(data);
    }).catch((err) => {
      console.log(err);
    })
  }

  function calculateAverageSolvingTime(name) {
    dbGet(name).then((res) => {
        let mapped = res.map((element) => {
          return element["solving_time"]
        })
        let filtered = mapped.filter((element) => {
            return element != null
        })
        let avg = filtered.reduce((prev, curr) => {
            return prev + curr
        }
        , 0) / filtered.length
        setAvgSolvingTime(avg);;
    }).catch((err) => {
        console.log(err);
      })
  }

  function getSolvedByUser(name){
    dbGet(name).then((res) => {
      let mapped = res.map((element) => {
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
    }).catch((err) => {
      console.log(err);
    })
  }

  function getCreatedVSSolved(name){
    let data = []
    dbGet(name).then((res) => {
      let aux = {
        x: "Creados",
        y: res.length,
      }
      data.push(aux)
      dbGet(name + "/solved").then((res) => {
        let aux = {
          x: "Resueltos",
          y: res.length,
        }
        data.push(aux)
        console.log("BARDATA", data)
        setcenterChartData(data);
        setcenterChartName(endpoint_names[name])
        setsolvedRatio(data[1]["y"] / data[0]["y"])
      }).catch((err) => {
        console.log(err)
      })
    }).catch((err) => {
      console.log(err)
    })
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
                    <h5 className="card-category">Creados por fecha</h5>
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
                    frameInMonth={true}
                    showDataLabelsOnly={true}
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
                <h5 className="card-category">Total Shipments</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-bell-55 text-info" /> 763,215
                </CardTitle>
                
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample2.data}
                    options={chartExample2.options}
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
                <h5 className="card-category">Resueltos por usuario (top 5)</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-send text-success" /> 12,100K
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
                <h5 className="card-category">Total Shipments</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-bell-55 text-info" /> 763,215
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                    <BarGraph
                      data={itemsWithMoreSolvables}
                      name={"leftChartName"}
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
                  <i className="tim-icons icon-bell-55 text-info" /> Promedio: {parseInt(avgSolvingTime)} días
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
        {/* <Row>
          <Col lg="6" md="12">
            <Card className="card-tasks">
              <CardHeader>
                <h6 className="title d-inline">Tasks(5)</h6>
                <p className="card-category d-inline"> today</p>
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="btn-icon"
                    color="link"
                    data-toggle="dropdown"
                    type="button"
                  >
                    <i className="tim-icons icon-settings-gear-63" />
                  </DropdownToggle>
                  <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Action
                    </DropdownItem>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Another action
                    </DropdownItem>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Something else
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Update the Documentation</p>
                          <p className="text-muted">
                            Dwuamish Head, Seattle, WA 8:47 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip636901683"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip636901683"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">GDPR Compliance</p>
                          <p className="text-muted">
                            The GDPR is a regulation that requires businesses to
                            protect the personal data and privacy of Europe
                            citizens for transactions that occur within EU
                            member states.
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip457194718"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip457194718"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Solve the issues</p>
                          <p className="text-muted">
                            Fifty percent of all respondents said they would be
                            more likely to shop at a company
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip362404923"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip362404923"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Release v2.0.0</p>
                          <p className="text-muted">
                            Ra Ave SW, Seattle, WA 98116, SUA 11:19 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip818217463"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip818217463"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Export the processed files</p>
                          <p className="text-muted">
                            The report also shows that consumers will not easily
                            forgive a company once a breach exposing their
                            personal data occurs.
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip831835125"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip831835125"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Arival at export process</p>
                          <p className="text-muted">
                            Capitol Hill, Seattle, WA 12:34 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip217595172"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip217595172"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Simple Table</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Country</th>
                      <th>City</th>
                      <th className="text-center">Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dakota Rice</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                      <td className="text-center">$36,738</td>
                    </tr>
                    <tr>
                      <td>Minerva Hooper</td>
                      <td>Curaçao</td>
                      <td>Sinaai-Waas</td>
                      <td className="text-center">$23,789</td>
                    </tr>
                    <tr>
                      <td>Sage Rodriguez</td>
                      <td>Netherlands</td>
                      <td>Baileux</td>
                      <td className="text-center">$56,142</td>
                    </tr>
                    <tr>
                      <td>Philip Chaney</td>
                      <td>Korea, South</td>
                      <td>Overland Park</td>
                      <td className="text-center">$38,735</td>
                    </tr>
                    <tr>
                      <td>Doris Greene</td>
                      <td>Malawi</td>
                      <td>Feldkirchen in Kärnten</td>
                      <td className="text-center">$63,542</td>
                    </tr>
                    <tr>
                      <td>Mason Porter</td>
                      <td>Chile</td>
                      <td>Gloucester</td>
                      <td className="text-center">$78,615</td>
                    </tr>
                    <tr>
                      <td>Jon Porter</td>
                      <td>Portugal</td>
                      <td>Gloucester</td>
                      <td className="text-center">$98,615</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row> */}
      </div>
    </>
  );
}

export default Dashboard;
