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
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "utils/routes.js";

import logo from "assets/img/logo.png";
import { BackgroundColorContext } from "contexts/BackgroundColorContext";
import { INCIDENT_DETAILS_PATH } from "pages/IncidentDetailsPage.js";
import { CHANGE_DETAILS_PATH } from "pages/ChangeDetailsPage.js";
import { PROBLEM_DETAILS_PATH } from "pages/ProblemDetailsPage";
import IncidentDetails from "pages/IncidentDetailsPage.js";
import simple_routes from "utils/routes_simple.js";
import IncidentCreation from "pages/IncidentCreationPage.js";
import ProblemCreation from "pages/ProblemCreationPage.js";
import KnownErrorCreation from "pages/KnownErrorCreationPage.js";
import KnownErrorDetails from "pages/KnownErrorDetailsPage.js";
import { KNOWN_ERROR_DETAILS_PATH } from "pages/KnownErrorDetailsPage";
import ChangeCreation from "pages/ChangeCreationPage.js";
import SLACreationPage from "pages/items/SLAItemCreationPage";
import ProblemDetails from "pages/ProblemDetailsPage.js";
import ChangeDetails from "pages/ChangeDetailsPage.js";
import LoginPage from "pages/LoginPage.js";
import { HARDWARE_ITEM_DETAILS_PATH } from "pages/items/HardwareItemDetailsPage";
import { SOFTWARE_ITEM_DETAILS_PATH } from "pages/items/SoftwareItemDetailsPage";
import { HARDWARE_ITEM_CREATION_PATH } from "pages/items/HardwareItemCreationPage";
import { SLA_ITEM_CREATION_PATH } from "pages/items/SLAItemCreationPage";
import { SOFTWARE_ITEM_CREATION_PATH } from "pages/items/SoftwareItemCreationPage";
import { SLA_ITEM_DETAILS_PATH } from "pages/items/SLAItemDetailsPage";
import { HARDWARE_ITEM_EDIT_PATH } from "pages/items/HardwareItemEditPage";
import { SLA_ITEM_EDIT_PATH } from "pages/items/SLAItemEditPage";
import { SOFTWARE_ITEM_EDIT_PATH } from "pages/items/SoftwareItemEditPage";
import { SOFTWARE_ITEM_RESTORE_PATH } from "pages/items/SoftwareItemRestorePage";
import { HARDWARE_ITEM_RESTORE_PATH } from "pages/items/HardwareItemRestorePage";
import { SLA_ITEM_RESTORE_PATH } from "pages/items/SLAItemRestorePage";
import HardwareItemDetails from "pages/items/HardwareItemDetailsPage.js";
import HardwareItemCreation from "pages/items/HardwareItemCreationPage.js";
import HardwareItemEdit from "pages/items/HardwareItemEditPage.js";
import HardwareItemRestore from "pages/items/HardwareItemRestorePage.js";
import SoftwareItemDetails from "pages/items/SoftwareItemDetailsPage.js";
import SoftwareCreation from "pages/items/SoftwareItemCreationPage";
import SoftwareItemEdit from "pages/items/SoftwareItemEditPage.js";
import SoftwareItemRestore from "pages/items/SoftwareItemRestorePage.js";
import SLAItemDetails from "pages/items/SLAItemDetailsPage.js";
import SLAItemEdit from "pages/items/SLAItemEditPage.js";
import SLAItemRestore from "pages/items/SLAItemRestorePage.js";

var ps;

function Admin(props) {
  const location = useLocation();
  const mainPanelRef = React.useRef(null);
  const [sidebarOpened, setsidebarOpened] = React.useState(
    document.documentElement.className.indexOf("nav-open") !== -1
  );
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(mainPanelRef.current, {
        suppressScrollX: true,
      });
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  });
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
  }, [location]);
  // this function opens and closes the sidebar on small devices
  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setsidebarOpened(!sidebarOpened);
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  React.useEffect(
    function checkIfLoggedIn() {
      if (window.location.pathname == simple_routes.login) {
        return
      } else if (!localStorage.getItem("token")) {
        window.location.pathname = simple_routes.login;
      }
    }
  )

  console.log("admin location: ", location.state)
  
  return (
    <BackgroundColorContext.Consumer>
      {({ color, changeColor }) => (
        <React.Fragment>
          <div className="wrapper">
            <Sidebar
              routes={routes}
              logo={{
                text: "ITIL Management",
                imgSrc: logo,
              }}
              toggleSidebar={toggleSidebar}
            />
            <div className="main-panel"  data={color}>
              <AdminNavbar
                brandText={getBrandText(location.pathname)}
                toggleSidebar={toggleSidebar}
                sidebarOpened={sidebarOpened}
              />
              <Switch>
                {getRoutes(routes)}
                <Route
                path={'/login'}
                component={LoginPage}
                />
                <Route
                path={'/admin' + SLA_ITEM_DETAILS_PATH}
                component={SLAItemDetails}
                />
                <Route
                path={'/admin' + SLA_ITEM_CREATION_PATH}
                component={SLACreationPage}
                />
                <Route
                path={'/admin' + SLA_ITEM_EDIT_PATH}
                component={SLAItemEdit}
                />
                <Route
                path={'/admin' + SLA_ITEM_RESTORE_PATH}
                component={SLAItemRestore}
                />
                <Route
                path={'/admin' + HARDWARE_ITEM_DETAILS_PATH}
                component={HardwareItemDetails}
                />
                <Route
                path={'/admin' + HARDWARE_ITEM_CREATION_PATH}
                component={HardwareItemCreation}
                />
                <Route
                path={'/admin' + HARDWARE_ITEM_EDIT_PATH}
                component={HardwareItemEdit}
                />
                <Route
                path={'/admin' + HARDWARE_ITEM_RESTORE_PATH}
                component={HardwareItemRestore}
                />
                <Route
                path={'/admin' + SOFTWARE_ITEM_DETAILS_PATH}
                component={SoftwareItemDetails}
                />
                <Route
                path={'/admin' + SOFTWARE_ITEM_CREATION_PATH}
                component={SoftwareCreation}
                />
                <Route
                path={'/admin' + SOFTWARE_ITEM_EDIT_PATH}
                component={SoftwareItemEdit}
                />
                <Route
                path={'/admin' + SOFTWARE_ITEM_RESTORE_PATH}
                component={SoftwareItemRestore}
                />
                <Route
                path={'/admin' + INCIDENT_DETAILS_PATH}
                component={IncidentDetails}
                />
                <Route
                path={'/admin' + CHANGE_DETAILS_PATH}
                component={ChangeDetails}
                />
                <Route
                path={'/admin' + KNOWN_ERROR_DETAILS_PATH}
                component={KnownErrorDetails}
                />
                <Route
                path={simple_routes.incidentCreation}
                component={IncidentCreation}
                />
                <Route
                path={'/admin' + PROBLEM_DETAILS_PATH}
                component={ProblemDetails}
                />
                <Route
                path={simple_routes.problemCreation}
                component={ProblemCreation}
                />
                <Route
                path={simple_routes.changeCreation}
                component={ChangeCreation}
                />
                <Route
                path={simple_routes.KnownErrorCreation}
                component={KnownErrorCreation}
                />
                <Redirect from="*" to="/admin/dashboard" />
              </Switch>
              {
                // we don't want the Footer to be rendered on map page
                location.pathname === "/admin/maps" ? null : <Footer fluid />
              }
            </div>
          </div>
        </React.Fragment>
      )}
    </BackgroundColorContext.Consumer>
  );
}

export default Admin;
