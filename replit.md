# AdminBloc - Management Asociatie de Proprietari

## Overview
A Romanian Homeowners Association (HOA) management application with multi-level role-based access control. Manages buildings, apartments, expenses, payments, and announcements for property owners' associations. Supports federations of multiple buildings.

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui + wouter (routing) + TanStack Query
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Replit Auth (OIDC) via @replit/express-auth
- **Language**: Romanian UI

## Project Structure
- `client/src/pages/` - Landing, Dashboard, Apartments, Expenses, Payments, Announcements, Users
- `client/src/components/` - AppSidebar, UserMenu, ThemeProvider, ThemeToggle, UI components
- `client/src/hooks/use-auth.ts` - Auth hook providing user state and permissions
- `server/middleware.ts` - Auth middleware with role-based permission checks
- `server/routes.ts` - Express API routes with scope validation
- `server/storage.ts` - Database storage layer (IStorage interface + DatabaseStorage)
- `shared/schema.ts` - Drizzle schemas for all tables including user_roles

## Authentication & Roles
- **Authentication**: Replit Auth (OIDC) - users log in via Replit account
- **Role hierarchy** (level 5 to 1):
  - `super_admin` (5): Platform-wide access to everything
  - `admin` (4): Federation/association-level management
  - `manager` / `gestor` (3): Building-level management
  - `owner` / `proprietar` (2): Apartment-level, can manage tenants
  - `tenant` / `chirias` (1): Read-only access to own apartment
- **Scope**: Roles are scoped to federation, building, or apartment level
- **Permissions**: Computed from roles in middleware, checked via `requirePermission()` middleware

## Data Models
- **Federations**: name, description (groups multiple buildings)
- **Buildings**: name, address, floors, admin info, optional federationId
- **Apartments**: number, floor, surface, rooms, owner info, residents count, buildingId
- **Expenses**: category, description, amount, month/year, split method, buildingId
- **Payments**: apartment reference, amount, month/year, status (pending/paid), receipt
- **Announcements**: title, content, priority (normal/important/urgent), buildingId
- **UserRoles**: userId, role, federationId/buildingId/apartmentId (scope)

## API Routes (all prefixed with /api, all require auth)
- GET /api/auth/me - Current user info with roles and permissions
- GET/POST /api/federations
- GET/POST /api/buildings
- GET/POST /api/apartments
- GET/POST /api/expenses, DELETE /api/expenses/:id
- GET/POST /api/payments, PATCH /api/payments/:id
- GET/POST /api/announcements, DELETE /api/announcements/:id
- GET /api/users - List users (with role info)
- POST /api/user-roles - Assign role to user
- DELETE /api/user-roles/:id - Remove role

## Security
- All mutating endpoints validate scope ownership (isInBuildingScope, isInApartmentScope, isInFederationScope)
- Permission middleware checks role-based permissions before route handler
- Route handlers additionally verify the target resource is within user's accessible scope

## Running
- `npm run dev` starts both Express backend and Vite frontend on port 5000
- `npm run db:push` pushes schema changes to PostgreSQL
