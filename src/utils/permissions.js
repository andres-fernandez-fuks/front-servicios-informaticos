
export const TABLES = {
    ITEM: "items",
    SLA_ITEM: "sla",
    HARDWARE_ITEM: "hardware",
    SOFTWARE_ITEM: "software",
    PROBLEM: "problems",
    INCIDENT: "incidents",
    KNOWN_ERROR: "known_errors",
    CHANGE: "changes",
}
export const PERMISSIONS = {
    SEE: "see",
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
}

const TOTAL_ACCESS_PERMISSION = "total_access"

export function checkPermissions(table_name, permission){
    var user_permissions = JSON.parse(localStorage.getItem("permissions"))
    if (user_permissions.includes(TOTAL_ACCESS_PERMISSION)) return true
    
    var permission_name = `${table_name}_${permission}`
    return user_permissions.includes(permission_name)
} 

