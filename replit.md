# AdminBloc - Management Asociatie de Proprietari

## Overview
AdminBloc is a comprehensive management application designed for Romanian Homeowners Associations (HOA). Its primary purpose is to streamline the administration of expenses, payments, and announcements for property owners' associations. The system features a robust 6-level hierarchical structure (Federations > Associations > Buildings > Staircases > Floors > Units) to accurately reflect real-world property divisions. Key capabilities include hierarchical data exploration, a tree-based infographic visualization, and specialized portals for association-specific management. The project aims to provide a centralized, efficient, and user-friendly platform for HOA administration, enhancing transparency and operational effectiveness in the Romanian property management sector.

## User Preferences
I prefer clear and concise communication. When making changes, please ask for confirmation before proceeding with major modifications. For development, prioritize iterative progress and provide regular updates on completed tasks.

## System Architecture
The application is built with a modern web stack, featuring a React, TypeScript, Vite, Tailwind CSS, and shadcn/ui frontend, communicating with an Express.js and TypeScript backend. PostgreSQL with Drizzle ORM is used for data persistence.

**UI/UX Decisions:**
- **Theme:** Uses `shadcn/ui` for a consistent and modern aesthetic.
- **Navigation:** Features a multi-level sidebar for primary navigation, including a dedicated "Infografie" (home) view, general lists, legal, and user management sections.
- **Hierarchical Visualization:** The core `Infografie` page displays a dynamic, interactive tree structure representing the full property hierarchy, allowing for drill-down and CRUD operations at each level.
- **Association Portal:** Provides a dedicated, scoped view for managing individual associations with tabs for property details, financials, contacts, and announcements.
- **Unit Detail Page:** A separate layout for individual unit management, offering tabs for information, rooms, meters, documents, payments, and announcements.
- **Language:** The entire user interface is in Romanian.

**Technical Implementations:**
- **Frontend Frameworks:** React for UI, TypeScript for type safety, Vite for fast development, Tailwind CSS for utility-first styling, `shadcn/ui` for component library, `wouter` for routing, and `TanStack Query` for data fetching.
- **Backend Framework:** Express.js for RESTful API services, enhanced with TypeScript.
- **Database & ORM:** PostgreSQL as the relational database, with Drizzle ORM for type-safe database interactions.
- **Role-Based Access Control (RBAC):** A sophisticated 6-level role hierarchy (`super_admin`, `admin`, `manager`, `owner`, `tenant`) is implemented with a configurable Permissions Matrix. Permissions are scope-based (federation, building, or apartment level) and enforced via middleware.
- **Data Modeling:** Comprehensive data models cover federations, associations, buildings, staircases, apartments, expenses, payments, announcements, funds, meters, contracts, and platform users, all linked hierarchically.
- **Fund Management:** Supports multiple fund types (maintenance, cash-flow buffer, penalties, custom) with associated categories and tracking of balances.
- **Meter Management:** Tracks various utility meters (water, electricity, gas) with readings, consumption calculation, and historical data. The association portal meters section is organized into 3 sub-tabs: "Structura" (meter hierarchy creation), "Citiri" (readings entry with readingType selector for regularizat/estimat/auto-citire, photo uploads to object storage, differential display), and "Model Estimare" (estimation model configuration with 3 models: historical average, similar apartments average, fixed daily consumption). Photo upload/download endpoints have access scope checks. The 3 meter sub-sections are navigated via the LEFT SIDEBAR as a collapsible submenu under "Contoare Comune" (not content tabs). The Citiri page has a scope selector (building/staircase/floor) to filter meters, and the readings history shows two differentials: absolute (index difference) and adjusted (index difference minus total apartment readings).
- **Contract Management:** Features detailed contract creation for condominium administration, including auto-generated numbering, party details, fee calculation, duration management, and document uploads.
- **Platform User Management:** Dedicated interface for managing platform users, including roles, location assignments, and an activity log.
- **Reference Lists:** A config-driven system for managing 17 different reference lists (e.g., Units of Measure, Currencies) with a generic CRUD interface, and a specialized view for categorized units of measure.
- **Excel Import:** A wizard-based system for importing association and property hierarchy data from Excel files.

**Application Entry Points:**
- **Landing Page (`/`):** Public-facing promotional website that introduces AdminBloc. Contains Register and Login buttons, feature showcase cards, and temporary development shortcut buttons to Super Admin (`/admin`), Association Portal, and Unit Detail pages. No authentication required.
- **Super Admin Dashboard (`/admin`):** Full administrative interface with sidebar navigation for super administrators.
- **Association Portal (`/asociatie/:id`):** Scoped management for a specific association.
- **Unit Detail (`/unitate/:id`):** Individual property owner view with unit-specific information.

**Feature Specifications:**
- **Hierarchy Tree (Infografie):** Displays federations, associations, buildings, staircases, floors, and units with expandable nodes, summary statistics, and direct CRUD actions. Add buttons ("+") and portal links ("Deschide") are always visible (not hover-only). Edit buttons (pencil icons) on federation, association, building, and staircase nodes for inline editing. Uses batch wizard dialogs for creating buildings, staircases, floors, and units: first asks "how many?", then shows naming/configuration form for each item with file upload support. Floors are virtual (derived from staircase.floors count + apartment floor numbers); floor documents stored with entityType="staircase" + floorNumber. Unit creation is simplified (just type + number); detailed info is completed on the unit detail page.
- **Association Creation Wizard:** A 6-step guided wizard (opened via "+Asoc" button) that creates a complete association hierarchy in one flow: (1) Association info (name, address, CUI), (2) Building count + naming, (3) Staircase count per building + naming, (4) Floor count per staircase, (5) Unit count per floor + naming/type, (6) Summary. All data is created in a single database transaction via POST /api/association-wizard. Buildings automatically inherit the association's address.
- **Association Portal (`/asociatie/:id`):** Provides a dedicated management interface for a specific association, segmented into Imobiliar, Financiar, Contact, and Anunturi sections.
- **Unit Detail Page (`/unitate/:id`):** Displays comprehensive information for individual units including owner details, location, rooms, and meter readings.
- **Permissions Matrix (`/matrice-permisiuni`):** An editable table mapping roles to permissions with 4 access levels and support for custom roles.
- **Contract Management (`/contracte`):** Allows creating, editing, and viewing condominium administration contracts, including file uploads to object storage.
- **Facturi (`/facturi`):** Invoice management with manual invoice creation and auto-generated invoices from contracts. Invoice statuses: estimada (estimated), proforma (sent to client), factura_final (final invoice sent), platita (paid), anulata (cancelled). Each invoice has concept field, inline status change, preview/print capability. Replaces old "Venituri" page.
- **User List & Detail (`/lista-utilizatori`, `/utilizator/:id`):** Tools for managing platform users, assigning roles, and tracking user activity.

## External Dependencies
- **PostgreSQL:** Primary database for all application data.
- **Replit Auth (OIDC):** Originally intended for authentication, but currently bypassed for `super_admin` default access.
- **Object Storage:** Used for storing uploaded contract documents and potentially other files (`.private/contracts/:id/`).