import { HARDWARE_ITEM_CREATION_PATH } from "pages/items/HardwareItemCreationPage";
import { SLA_ITEM_CREATION_PATH } from "pages/items/SLAItemCreationPage";
import { SOFTWARE_ITEM_CREATION_PATH } from "pages/items/SoftwareItemCreationPage";
const simple_routes = {
    incidentDetails: "/admin/incident_details",
    incidentCreation: "/admin/incidents_create",
    problemCreation: "/admin/problems_create",
    ErrorCreation: "/admin/errors_create",
    changeCreation: "/admin/changes_create",
    incidents: "/admin/incidents",
    dashboard: "/admin/dashboard",
    problemDetails: "/admin/problems_details",
    problems: "/admin/problems",
    errors: "/admin/errors",
    profile: "/admin/user-profile",
    login: "/login",
    hardware_creation: "/admin" + HARDWARE_ITEM_CREATION_PATH,
    sla_creation: "/admin" +    SLA_ITEM_CREATION_PATH,
    software_creation: "/admin" + SOFTWARE_ITEM_CREATION_PATH,
    changes: "/admin/changes",

}

export default simple_routes;