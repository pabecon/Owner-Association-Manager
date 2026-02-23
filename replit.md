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
- **Meter Management:** Tracks various utility meters (water, electricity, gas) with readings, consumption calculation, and historical data.
- **Contract Management:** Features detailed contract creation for condominium administration, including auto-generated numbering, party details, fee calculation, duration management, and document uploads.
- **Platform User Management:** Dedicated interface for managing platform users, including roles, location assignments, and an activity log.
- **Reference Lists:** A config-driven system for managing 17 different reference lists (e.g., Units of Measure, Currencies) with a generic CRUD interface, and a specialized view for categorized units of measure.
- **Excel Import:** A wizard-based system for importing association and property hierarchy data from Excel files.

**Feature Specifications:**
- **Hierarchy Tree (Infografie):** Displays federations, associations, buildings, staircases, floors, and units with expandable nodes, summary statistics, and direct CRUD actions.
- **Association Portal (`/asociatie/:id`):** Provides a dedicated management interface for a specific association, segmented into Imobiliar, Financiar, Contact, and Anunturi sections.
- **Unit Detail Page (`/unitate/:id`):** Displays comprehensive information for individual units including owner details, location, rooms, and meter readings.
- **Permissions Matrix (`/matrice-permisiuni`):** An editable table mapping roles to permissions with 4 access levels and support for custom roles.
- **Contract Management (`/contracte`):** Allows creating, editing, and viewing condominium administration contracts, including file uploads to object storage.
- **User List & Detail (`/lista-utilizatori`, `/utilizator/:id`):** Tools for managing platform users, assigning roles, and tracking user activity.

## External Dependencies
- **PostgreSQL:** Primary database for all application data.
- **Replit Auth (OIDC):** Originally intended for authentication, but currently bypassed for `super_admin` default access.
- **Object Storage:** Used for storing uploaded contract documents and potentially other files (`.private/contracts/:id/`).