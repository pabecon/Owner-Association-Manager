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
- `client/src/pages/` - HierarchyTree (home/infografie), AssociationPortal (per-association management), Contracts, Roluri, PermissionsMatrix, UnitDetail (sidebar layout), ListaUtilizatori & UtilizatorDetail (own layout)
- `client/src/components/` - AppSidebar, UsersSidebar, AssociationSidebar, UserMenu, ThemeProvider, ThemeToggle, UI components
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

## Fund Management (Fonduri)
- **Fund Types**: Intretinere (maintenance), Rulment (cash-flow buffer), Penalizari (late penalties), Custom
- **Each fund**: linked to an association, has bankName, bankAccount (IBAN), currentBalance, isActive
- **Fund Categories**: budget line items per fund with budgetAmount, currentAmount, sortOrder
- **Default categories for Intretinere**: Apa, Energie Electrica, Curatenie, Securitate, Administrare, Ascensor, Salarii
- **Tables**: `funds` and `fund_categories` with cascading deletes from funds
- **API**: GET/POST/PATCH/DELETE /api/funds (filtered by associationId), GET/POST/PATCH/DELETE /api/fund-categories (filtered by fundId)
- **UI**: Fonduri page at /fonduri with association filter, collapsible fund cards showing categories, add fund/category dialogs
- **Sidebar**: Under "Financiar" section alongside Cheltuieli and Plati

## Meter Management (Contoare)
- **Meter Types**: Water (Apă), Electricity (Electricitate), Gas (Gaz)
- **Each meter**: serialNumber, meterNumber, chamberLocation, installDate, initialReading, isActive
- **Readings**: readingDate, readingValue, consumption (auto-calculated), accumulatedConsumption (auto-calculated)
- **Validation**: Reading values must be >= previous reading; consumption computed server-side
- **Historical**: Meters can be deactivated (replaced), keeping history; inactive meters shown separately
- **UI**: MeterManager component integrated into Explorer unit cards as collapsible section
- **Tables**: `meters` and `meter_readings` with cascading deletes from apartments/meters
- **API**: GET/POST/PATCH/DELETE /api/meters, GET/POST/DELETE /api/meter-readings with scope-based access control

## Key Features
- **Infografie (Home page `/`)**: THE main page. Tree view showing complete hierarchy: Federations -> Associations -> Buildings -> Staircases -> Floors -> Units. Expandable/collapsible nodes with summary stats. CRUD buttons to create entities at any level. Each association has a "Deschide" button to open its portal.
- **Association Portal** (`/asociatie/:id`): Dedicated management view scoped to a single association. Tabs for Imobiliar (buildings/staircases/floors/units drill-down), Financiar (expenses, payments, funds), Contact (president/admin info), and Anunturi. Stats summary at top. Back button returns to Infografie.
- **Sidebar**: Shows "Infografie" link, collapsible "Liste Generale" (with all 18 reference list sub-items including Tipuri Camere), collapsible "Legislatie" (with all law sub-items), collapsible "Juridic" (with Contracte sub-item), and collapsible "Utilizatori" (with Lista Utilizatori, Matrice Permisiuni sub-items). Sections auto-expand when child routes are active and can be toggled closed/open.
- **Unit Detail Page** (`/unitate/:id`): Dedicated page for each unit (apartment/box/parking). Opens with its OWN layout (no super admin sidebar). Has its own sidebar with tabs: Informatii, Camere, Contoare, Documente, Plati, Anunturi. Shows general info, owner details, location hierarchy, rooms, and meters. Accessible via "Deschide" button on units in both Infografie tree and Association portal.
- **Unit Types**: apartment (default), box (storage), parking. Shown in tree and portal.
- **Negative Floors**: Floors can be negative (e.g., -1 = Subsol 1, -2 = Subsol 2) for basements/garages.

## Authentication & Roles
- **Authentication**: Bypassed - all requests get default-admin super_admin access
- **Role hierarchy** (level 5 to 1):
  - `super_admin` (5): Super Administrator - Platform-wide absolute access. Only platform owner.
  - `admin` (4): Gestor Super Admin - Created by super_admin with configurable rights at federation/association level.
  - `manager` (3): Administrator - Federation/association administrator. Manages buildings, staircases, units.
  - `owner` (2): Proprietar - Property owner. Can view own data and create tenants.
  - `tenant` (1): Chirias - Read-only access to own unit data.
- **Permissions Matrix**: Editable page at /matrice-permisiuni showing all roles vs all permissions in a table with 4 access levels (Total/Limitat/Propriu/Interzis). Click cells to cycle access levels. Edit roles via card buttons. Add new custom roles. Save changes via PUT /api/settings/permission-matrix and /api/settings/custom-roles. Base data from PERMISSION_MATRIX in shared/schema.ts, overrides stored in app_settings table.
- **Scope**: Roles are scoped to federation, building, or apartment level
- **Permissions**: Computed from roles in middleware, checked via `requirePermission()` middleware

## Contract Management (Contracte de Administrare Condominiu)
- **Serie & Numar**: Auto-generated correlative numbering (Serie: AL, Numar: 0001, 0002...). API GET /api/contracts/next-number returns next available number.
- **Prestator (Administrator)**: prestatorName, prestatorCui, prestatorAddress, prestatorRegistruComert, prestatorRepresentative
- **Beneficiar**: Always association (clientType=association). Shows association details (address, CIF, president, unit count) auto-populated.
- **Onorariu**: pricePerUnit (per imobil/luna), numberOfUnits (auto-computed server-side from association hierarchy on POST and PATCH), totalMonthly (calculated server-side: pricePerUnit × numberOfUnits), currency (from "Tip Moneda" reference list, default RON)
- **Facturare**: invoiceDay (day of month), paymentTermDays (payment term in calendar days)
- **Durata**: signingDate, startDate, durationValue (cantitate), durationUnit (from "Unitate Masura" reference list, time category), endDate (auto-calculated), autoRenewalNoticeDays
- **Status**: draft/active/expired/terminated
- **Jurisdictie**: jurisdiction field for dispute resolution location
- **Document**: File upload stored in object storage at .private/contracts/:id/
- **Contract Templates**: name, description, documentPath, documentName
- **Duration units**: loaded from "Unitate Masura" reference list (filtered by time category)
- **Currency**: loaded from "Tip Moneda" reference list (default RON)
- **File upload**: Documents stored in object storage at .private/contracts/:id/ path
- **Tables**: `contracts` and `contract_templates` with UUID primary keys
- **API**: GET/POST/PATCH/DELETE /api/contracts, GET/POST/DELETE /api/contract-templates, POST /api/contracts/:id/upload
- **UI**: Contracts page at /contracte with list view, add/edit dialog, file upload, delete with confirmation
- **Sidebar**: Under "Juridic" collapsible section

## Platform User Management
- **Lista Utilizatori** (`/lista-utilizatori`): Has its OWN independent layout (UsersLayout) with UsersSidebar, separate from SuperAdmin layout. Table showing all platform users with: name, username, role (Proprietar/Chirias), association, building, staircase, floor, unit, active status. Search/filter input. "Adauga Utilizator" dialog to create new users with cascading location selects. UsersSidebar has "Lista Utilizatori" nav link and "Super Administrator" back link.
- **Utilizator Detail** (`/utilizator/:id`): Uses same UsersLayout. Edit page for individual user. Shows/edits: firstName, lastName, username, password (visible), email, phone, userRole, isActive toggle, cascading location selects (association→building→staircase→apartment). Info card with createdBy, createdAt, deactivatedAt. Activity history timeline showing all changes with dates and who made them.
- **Tables**: `platform_users` (id, firstName, lastName, username, password, email, phone, userRole, associationId, buildingId, staircaseId, apartmentId, isActive, createdBy, createdAt, deactivatedAt) and `user_activity_log` (id, platformUserId, action, details, performedBy, createdAt)
- **API**: GET/POST /api/platform-users, GET/PATCH/DELETE /api/platform-users/:id, GET /api/platform-users/:id/activities
- **Activity tracking**: All changes (create, edit, activate/deactivate) are automatically logged with timestamps and performer info

## Roluri Page
- **Path**: /roluri - Shows all 5 roles with descriptions, hierarchy levels, scope, and creation rules (no longer in sidebar, roles managed in Matrice Permisiuni)
- **Data**: Uses ROLE_* constants from shared/schema.ts (ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_CREATED_BY, ROLE_SCOPE_LABELS, ROLE_HIERARCHY)

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
- **Unitati de Masura** (`/liste-generale/unitate-masura`): Special category-grouped view. Units are grouped by category (Timp, Distanta, Suprafata, Volum, Greutate, Energie, Temperatura, Presiune, Debit, Cantitate). Collapsible category cards with add/rename/delete category and add/edit/delete units within each category. 31 pre-seeded units across 10 categories.
- Other reference lists use the generic flat table view with search, add, edit, delete.

## Excel Import (Import Asociatie din Excel)
- **Upload**: .xlsx, .xls, .csv files up to 10MB
- **Expected columns**: Tip (Apartament/Box/Parking), Bloc*, Scara, Etaj, Nr, Camere, Suprafata, Nr. Camera, Suprafata Camera
- **Auto-detection**: Headers are matched flexibly (case-insensitive, multiple aliases)
- **Process**: Creates association -> buildings -> staircases -> units with rooms from Excel rows
- **UI**: 4-step wizard dialog (Upload -> Preview -> Config -> Done) accessible from "Import Excel" button on Infografie page
- **API**: POST /api/import-excel/preview (preview), POST /api/import-excel (import), both require admin role
- **Component**: `client/src/components/excel-import-dialog.tsx`

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
