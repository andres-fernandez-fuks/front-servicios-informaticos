
import { Route } from "react-router-dom";
import simple_routes from "utils/routes_simple";
import IncidentCreationForm from "pages/IncidentCreationPage";

function MapRoutes(props) {

    <Route
    path={simple_routes.incidentCreation}
    component={IncidentCreationForm}
    props={props}
    // enabledPermissions={pagesPermissions.abmDistributorsNewPage}
    />

}