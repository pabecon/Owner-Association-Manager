import type { Request, Response, NextFunction, RequestHandler } from "express";
import { storage } from "./storage";
import { ROLE_PERMISSIONS, ROLE_HIERARCHY, type UserRole, type PermissionSet, type UserRoleRecord } from "@shared/schema";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRoles?: UserRoleRecord[];
  highestRole?: UserRole;
  permissions?: PermissionSet;
  accessibleBuildingIds?: string[];
  accessibleApartmentIds?: string[];
  accessibleFederationIds?: string[];
}

function getHighestRole(roles: UserRoleRecord[]): UserRole {
  if (roles.length === 0) return "tenant";
  let highest: UserRole = "tenant";
  for (const r of roles) {
    const role = r.role as UserRole;
    if (ROLE_HIERARCHY[role] > ROLE_HIERARCHY[highest]) {
      highest = role;
    }
  }
  return highest;
}

function mergePermissions(roles: UserRoleRecord[]): PermissionSet {
  const base: PermissionSet = { ...ROLE_PERMISSIONS.tenant };
  for (const r of roles) {
    const perms = ROLE_PERMISSIONS[r.role as UserRole];
    if (!perms) continue;
    for (const key of Object.keys(perms) as (keyof PermissionSet)[]) {
      if (perms[key]) {
        (base as any)[key] = true;
      }
    }
  }
  return base;
}

export const loadUserContext: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  const user = (req as any).user;
  if (!user?.claims?.sub) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = user.claims.sub;
  req.userId = userId;

  const roles = await storage.getUserRoles(userId);
  req.userRoles = roles;
  req.highestRole = getHighestRole(roles);
  req.permissions = mergePermissions(roles);

  const buildingIds = new Set<string>();
  const apartmentIds = new Set<string>();
  const federationIds = new Set<string>();

  for (const role of roles) {
    if (role.role === "super_admin") {
      const allBuildings = await storage.getBuildings();
      allBuildings.forEach(b => buildingIds.add(b.id));
      break;
    }
    if (role.federationId) {
      federationIds.add(role.federationId);
      const fedBuildings = await storage.getBuildingsByFederation(role.federationId);
      fedBuildings.forEach(b => buildingIds.add(b.id));
    }
    if (role.buildingId) {
      buildingIds.add(role.buildingId);
    }
    if (role.apartmentId) {
      apartmentIds.add(role.apartmentId);
      const apt = await storage.getApartment(role.apartmentId);
      if (apt) buildingIds.add(apt.buildingId);
    }
  }

  req.accessibleBuildingIds = Array.from(buildingIds);
  req.accessibleApartmentIds = Array.from(apartmentIds);
  req.accessibleFederationIds = Array.from(federationIds);

  next();
};

export function requirePermission(permission: keyof PermissionSet): RequestHandler {
  return (req: AuthenticatedRequest, res, next) => {
    if (!req.permissions || !req.permissions[permission]) {
      return res.status(403).json({ message: "Nu aveti permisiunea necesara" });
    }
    next();
  };
}

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req: AuthenticatedRequest, res, next) => {
    if (!req.highestRole || !roles.includes(req.highestRole)) {
      const hasRole = req.userRoles?.some(r => roles.includes(r.role as UserRole));
      if (!hasRole) {
        return res.status(403).json({ message: "Nu aveti rolul necesar" });
      }
    }
    next();
  };
}
