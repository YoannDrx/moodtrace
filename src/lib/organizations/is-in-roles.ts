import type { AuthRole } from "../auth/auth-permissions";

/**
 * Check if user has at least one of the required roles
 *
 * @param userRoles User's roles
 * @param rolesNeeded Roles to check
 * @returns a boolean indicating if the user has at least one role in rolesB
 */
export const isInRoles = (
  userRoles?: AuthRole[],
  rolesNeeded?: AuthRole[],
): boolean => {
  if (!userRoles) return false;

  // Owner can access to everything
  if (userRoles.includes("owner")) return true;

  if (!rolesNeeded) return true;
  return rolesNeeded.every((role) => userRoles.includes(role));
};
