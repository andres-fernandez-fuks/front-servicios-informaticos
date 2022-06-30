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
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import {dbGet} from "utils/backendFetchers";
import SimpleTable from "components/Table/SimpleTable";
import { DisabledInput } from "components/Form/DisabledInput";


function UserProfile() {

  const [values, setValues] = React.useState("");
  const [roles, setRoles] = React.useState([]);

  React.useEffect(() => {
    dbGet("/profile").then(data => {
        setValues(data);
        setRoles([data["role"]]);
    }).catch(err => {console.log(err)});
    }   , []);

  //setRoles(values["role"].name);
  console.log("PROFILE VALUES: ", values)

  const COLUMN_MAX_LENGTH= 12;
  const roles_columns = [{"name": "name", "label": "Nombre"}]
  return (
    <>
      <div className="content">
        <Row>
          <Col md={8}>
            <Card>
              <CardHeader>
                <h5 className="title">Mi perfil</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="px-md-1" md="6">
                      <FormGroup>
                        <label>Nombre de usuario</label>
                        <DisabledInput
                          value={values["username"]}
                          placeholder="Nombre de usuario"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">
                          Correo electrónico
                        </label>
                        <DisabledInput 
                          value = {values["email"]}
                          placeholder="ejemplo@mail.com" 
                          type="email" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>Nombre</label>
                        <DisabledInput
                          value={values["name"]}
                          placeholder="Nombre"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>Apellido</label>
                        <DisabledInput
                          value={values["lastname"]}
                          placeholder="Apellido"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                  <h5 className="title">Roles asignados</h5>
                  <SimpleTable data={roles} columns={roles_columns}>
                  </SimpleTable>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserProfile;
