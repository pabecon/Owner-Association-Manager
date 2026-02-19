# AdminBloc - Management Asociatie de Proprietari

## Overview
A Romanian Homeowners Association (HOA) management application with multi-level role-based access control. Full 6-level hierarchy: Federations -> Associations -> Buildings -> Staircases -> Floors -> Units (Apartments/Boxes/Parking). Manages expenses, payments, and announcements for property owners' associations. Authentication bypassed for default super_admin access. Includes hierarchical drill-down explorer and tree infographic visualization.

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui + wouter (routing) + TanStack Query
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Bypassed (default-admin super_admin), originally Replit Auth (OIDC)
- **Language**: Romanian UI

## Project Structure
- `client/src/pages/` - Dashboard, Explorer, HierarchyTree, Federations, Associations, Buildings, Staircases, Apartments, Expenses, Payments, Announcements, Users, ListaGenerala
- `client/src/components/` - AppSidebar, UserMenu, ThemeProvider, ThemeToggle, UI components
- `client/src/hooks/use-auth.ts` - Auth hook providing user state and permissions
- `server/middleware.ts` - Auth middleware with role-based permission checks
- `server/routes.ts` - Express API routes with scope validation
- `server/storage.ts` - Database storage layer (IStorage interface + DatabaseStorage)
- `server/seed.ts` - Database seeding with sample data for full hierarchy
- `shared/schema.ts` - Drizzle schemas for all tables including user_roles

## Hierarchy (5 levels)
1. **Federations** (Federatii): Groups of associations. Optional top-level grouping.
2. **Associations** (Asociatii): Core management unit. Can belong to a federation or be independent (federationId nullable). Has CUI, president, admin contact info.
3. **Buildings** (Blocuri): Physical buildings. Each belongs to one association (associationId required).
4. **Staircases** (Scari): Building entries/sections. Each belongs to one building. Has floors count and apartments-per-floor configuration.
5. **Apartments** (Apartamente): Individual units. Each belongs to one staircase (staircaseId required). Has owner info, surface, rooms, residents.

## Key Features
- **Explorer (Explorator)**: Hierarchical drill-down navigation - click federation to see associations, click association to see buildings, etc. through all 6 levels including floors (implicit from unit floor numbers). Supports negative floors (basements).
- **Infographic (Infografie)**: Tree view showing complete hierarchy structure as expandable/collapsible tree with summary stats.
- **Unit Types**: Apartments support unitType field: apartment (default), box (storage), parking. Shown throughout explorer, tree view, and units list page.
- **Negative Floors**: Floors can be negative (e.g., -1 = Subsol 1, -2 = Subsol 2) for basements/garages.

## Authentication & Roles
- **Authentication**: Bypassed - all requests get default-admin super_admin access
- **Role hierarchy** (level 5 to 1):
  - `super_admin` (5): Platform-wide access to everything
  - `admin` (4): Federation/association-level management
  - `manager` / `gestor` (3): Building-level management
  - `owner` / `proprietar` (2): Apartment-level, can manage tenants
  - `tenant` / `chirias` (1): Read-only access to own apartment
- **Scope**: Roles are scoped to federation, building, or apartment level
- **Permissions**: Computed from roles in middleware, checked via `requirePermission()` middleware

## Data Models
- **Federations**: name, description, address, phone, email, presidentName
- **Associations**: name, description, cui, address, federationId (nullable), president info, admin info
- **Buildings**: name, address, totalApartments, floors, associationId (required)
- **Staircases**: name, buildingId, floors, apartmentsPerFloor
- **Apartments**: number, floor, surface, rooms, owner info, residents count, staircaseId (required)
- **Expenses**: category, description, amount, month/year, split method, buildingId
- **Payments**: apartment reference, amount, month/year, status (pending/paid), receipt
- **Announcements**: title, content, priority (normal/important/urgent), buildingId
- **UserRoles**: userId, role, federationId/buildingId/apartmentId (scope)

### Reference Lists (17 tables under "Liste Generale")
Config-driven CRUD system in `server/reference-lists.ts`. Each list has a DB table, API routes, and a generic UI page.

## API Routes (all prefixed with /api, auth bypassed)
- GET /api/me/roles - Current user role info with permissions
- GET/POST /api/federations, DELETE /api/federations/:id
- GET/POST /api/associations, DELETE /api/associations/:id
- GET/POST /api/buildings, DELETE /api/buildings/:id
- GET/POST /api/staircases, DELETE /api/staircases/:id
- GET/POST /api/apartments
- GET/POST /api/expenses, DELETE /api/expenses/:id
- GET/POST /api/payments, PATCH /api/payments/:id
- GET/POST /api/announcements, DELETE /api/announcements/:id
- GET /api/users - List users (with role info)
- POST /api/user-roles - Assign role to user
- DELETE /api/user-roles/:id - Remove role
- GET /api/liste-config - Reference list configs
- GET/POST /api/liste/:key - Reference list items
- DELETE /api/liste/:key/:id - Delete reference list item

## Security
- Middleware resolves building access through association->federation chain
- Apartment access resolved through staircase->building chain
- All mutating endpoints validate scope ownership
- Permission middleware checks role-based permissions before route handler

## Running
- `npm run dev` starts both Express backend and Vite frontend on port 5000
- `npm run db:push` pushes schema changes to PostgreSQL
