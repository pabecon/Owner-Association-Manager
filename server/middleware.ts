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
  const userId = (req as any).user?.claims?.sub || "default-admin";
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
      const fedAssociations = await storage.getAssociationsByFederation(role.federationId);
      for (const assoc of fedAssociations) {
        const assocBuildings = await storage.getBuildingsByAssociation(assoc.id);
        assocBuildings.forEach(b => buildingIds.add(b.id));
      }
    }
    if (role.buildingId) {
      buildingIds.add(role.buildingId);
    }
    if (role.apartmentId) {
      apartmentIds.add(role.apartmentId);
      const apt = await storage.getApartment(role.apartmentId);
      if (apt) {
        const staircase = await storage.getStaircase(apt.staircaseId);
        if (staircase) buildingIds.add(staircase.buildingId);
      }
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
    const minLevel = Math.min(...roles.map(r => ROLE_HIERARCHY[r] || 0));
    const userLevel = ROLE_HIERARCHY[req.highestRole || "tenant"] || 0;
    if (userLevel >= minLevel) {
      return next();
    }
    const hasRole = req.userRoles?.some(r => {
      const rLevel = ROLE_HIERARCHY[r.role as UserRole] || 0;
      return rLevel >= minLevel;
    });
    if (hasRole) return next();
    return res.status(403).json({ message: "Nu aveti rolul necesar" });
  };
}
