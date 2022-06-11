import { HARDWARE_ITEM_CREATION_PATH } from "pages/items/HardwareItemCreationPage";

const simple_routes = {
    incidentDetails: "/admin/incident_details",
    incidentCreation: "/admin/incidents_create",
    problemCreation: "/admin/problems_create",
    changeCreation: "/admin/changes_create",
    incidents: "/admin/incidents",
    dashboard: "/admin/dashboard",
    problemDetails: "/admin/problems_details",
    problems: "/admin/problems",
    profile: "/admin/user-profile",
    login: "/login",
    hardware_creation: "/admin" + HARDWARE_ITEM_CREATION_PATH,
}

export default simple_routes;