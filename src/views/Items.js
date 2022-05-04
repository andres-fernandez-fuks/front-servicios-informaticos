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
import classNames from "classnames";

// reactstrap components
import {
  Button,  
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

function Items() {
    const [bigChartData, setbigChartData] = React.useState("data1");
    const setBgChartData = (name) => {
    setbigChartData(name);
    };
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card style={{paddingTop:5}}>
            <Col sm="12">
            <ButtonGroup
                className="btn-group-toggle float-right"
                data-toggle="buttons"
            >
                <Button
                tag="label"
                className={classNames("btn-simple", {
                    active: bigChartData === "data1",
                })}
                color="info"
                id="0"
                size="sm"
                onClick={() => setBgChartData("data1")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                    Software
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
                    active: bigChartData === "data2",
                })}
                onClick={() => setBgChartData("data2")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                    Hardware
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
                    active: bigChartData === "data3",
                })}
                onClick={() => setBgChartData("data3")}
                >
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                    S.L.A.
                </span>
                <span className="d-block d-sm-none">
                    <i className="tim-icons icon-gift-2" />
                </span>
                </Button>
            </ButtonGroup>
            </Col>
              <CardHeader>
                <CardTitle tag="h4">Items de Configuración</CardTitle>
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
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>
                <CardTitle tag="h4">Table on Plain Background</CardTitle>
                <p className="category">Here is a subtitle for this table</p>
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
        </Row>
      </div>
    </>
  );
}

export default Items;