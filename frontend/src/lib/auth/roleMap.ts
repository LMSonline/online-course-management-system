/**
 * Role mapping between backend roles and internal FE roles
 * Backend may use: USER, CREATOR, ADMIN
 * FE internal: STUDENT, TEACHER, ADMIN
 */

export type BackendRole = "USER" | "CREATOR" | "ADMIN";
export type InternalRole = "STUDENT" | "TEACHER" | "ADMIN";

/**
 * Map backend role to internal role
 */
export function mapBackendRoleToInternal(backendRole: string): InternalRole {
  switch (backendRole.toUpperCase()) {
    case "USER":
    case "STUDENT":
      return "STUDENT";
    case "CREATOR":
    case "TEACHER":
      return "TEACHER";
    case "ADMIN":
      return "ADMIN";
    default:
      // Default to STUDENT for unknown roles
      return "STUDENT";
  }
}

/**
 * Map internal role to backend role
 */
export function mapInternalRoleToBackend(internalRole: InternalRole): BackendRole {
  switch (internalRole) {
    case "STUDENT":
      return "USER";
    case "TEACHER":
      return "CREATOR";
    case "ADMIN":
      return "ADMIN";
  }
}

/**
 * Check if role is student
 */
export function isStudentRole(role: string): boolean {
  return mapBackendRoleToInternal(role) === "STUDENT";
}

/**
 * Check if role is teacher
 */
export function isTeacherRole(role: string): boolean {
  return mapBackendRoleToInternal(role) === "TEACHER";
}

/**
 * Check if role is admin
 */
export function isAdminRole(role: string): boolean {
  return mapBackendRoleToInternal(role) === "ADMIN";
}

