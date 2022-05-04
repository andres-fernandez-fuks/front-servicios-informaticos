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
import Dashboard from "views/Dashboard.js";
import Items from "views/Items.js";
import IncidentsTable from "views/Incidents.js";
import ProblemsTable from "views/Problems.js";
import Rtl from "views/Rtl.js";
import ChangesTable from "views/Changes.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";

var routes = [
  {
    path: "/dashboard",
    name: "Tablero",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/items",
    name: "Items de configuración",
    rtlName: "الرموز",
    icon: "tim-icons icon-app",
    component: Items,
    layout: "/admin",
  },
  {
    path: "/incidents",
    name: "Incidentes",
    rtlName: "خرائط",
    icon: "tim-icons icon-bell-55",
    component: IncidentsTable,
    layout: "/admin",
  },
  {
    path: "/problems",
    name: "Problemas",
    rtlName: "إخطارات",
    icon: "tim-icons icon-volume-98",
    component: ProblemsTable,
    layout: "/admin"
  },
  {
    path: "/changes",
    name: "Cambios",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-refresh-02",
    component: ChangesTable,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Errores",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-alert-circle-exc",
    component: ChangesTable,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "Usuario",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-single-02",
    component: UserProfile,
    layout: "/admin",
  }
];
export default routes;
