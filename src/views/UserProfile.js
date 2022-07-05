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
import DoubleEntryTable from "components/Table/DoubleEntryTable";
import { DisabledInput } from "components/Form/DisabledInput";
import { data } from "jquery";

function mapPermissions(permissions) {
    if (!permissions.length) return null;
    var has_total_access = permissions[0] === "total_access";
    var incident_permissions = {"Lectura": 1, "Creación": has_total_access, "Edición": has_total_access, "Eliminación": 0};
    var problem_permissions = {"Lectura": 1, "Creación": has_total_access, "Edición": has_total_access, "Eliminación": 0};
    var change_permissions = {"Lectura": 1, "Creación": has_total_access, "Edición": has_total_access, "Eliminación": 0};
    var item_permissions = {"Lectura": 1, "Creación": has_total_access, "Edición": has_total_access, "Eliminación": 0};
    var error_permissions = {"Lectura": 1, "Creación": has_total_access, "Edición": has_total_access, "Eliminación": 0};
    var total_permissions = {
        "Ítems": item_permissions,
        "Incidentes": incident_permissions,
        "Problemas": problem_permissions,
        "Cambios": change_permissions,                       
        "Errores": error_permissions
    };


    if (has_total_access) return total_permissions;

    const TABLE_TRANSLATION = {
        "incidents": "Incidentes", "problems": "Problemas", "changes": "Cambios", "items": "Items", "errors": "Errores"
    }

    const PERMISSION_TRANSLATION = { "see": "Lectura", "create": "Creación", "update": "Edición", "delete": "Eliminación" }

    permissions.forEach(permission => {
        var table = TABLE_TRANSLATION[permission.split("_")[0]];
        var permission_type = PERMISSION_TRANSLATION[permission.split("_")[1]];
        total_permissions[table][permission_type] = 1;
    });

    return total_permissions;
}


function UserProfile() {

  const [values, setValues] = React.useState("");
  const [role, setRole] = React.useState("");
  const [permissions, setPermissions] = React.useState([]);

  React.useEffect(() => {
    var user_id = localStorage.getItem("user_id");
    dbGet(`users/${user_id}/profile`).then(data => {
        setValues(data);
        setRole(data.role);
        setPermissions(data.role.permissions);
    }).catch(err => {console.log(err)});
    }, [] );

  //setRoles(values["role"].name);
  console.log("PROFILE VALUES: ", values)

  const COLUMN_MAX_LENGTH= 12;
  const roles_columns = [{"name": "name", "label": "Nombre"}]
  return (
    <>
      <div className="content">
        <Row>
          <Col md={6}>
            <Card style={{paddingTop:"10px", paddingBottom:"38px"}}>
              <CardHeader>
                <h5 className="title">Mi perfil</h5>
              </CardHeader>
              <CardBody >
                <Form style={{paddingTop:"30px"}}>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label style={{fontSize:13}}>Nombre de usuario</label>
                        <DisabledInput
                          value={values["username"]}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label style={{fontSize:13}} htmlFor="exampleInputEmail1">
                          Correo electrónico
                        </label>
                        <DisabledInput 
                          value = {values["email"]}
                          type="email" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label style={{fontSize:13}}>Nombre</label>
                        <DisabledInput
                          value={values["name"]}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label style={{fontSize:13}}>Apellido</label>
                        <DisabledInput
                          value={values["lastname"]}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <Card className="card-user">
              <CardBody>
                <CardText />
                  <h5 className="title">Rol asignado: {role.name}</h5>
                  <div style={{color:"white", paddingBottom:"10px"}}> <center>Permisos</center></div>
                  <DoubleEntryTable permissions={mapPermissions(permissions)} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserProfile;
