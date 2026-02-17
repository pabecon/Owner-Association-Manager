# AdminBloc - Management Asociatie de Proprietari

## Overview
A Romanian Homeowners Association (HOA) management application. Manages buildings, apartments, expenses, payments, and announcements for property owners' associations.

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui + wouter (routing) + TanStack Query
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Language**: Romanian UI

## Project Structure
- `client/src/pages/` - Dashboard, Apartments, Expenses, Payments, Announcements
- `client/src/components/` - AppSidebar, ThemeProvider, ThemeToggle, UI components
- `server/` - Express server, routes, storage layer, database connection, seed data
- `shared/schema.ts` - Drizzle schemas for buildings, apartments, expenses, payments, announcements

## Data Models
- **Buildings**: name, address, floors, admin info
- **Apartments**: number, floor, surface, rooms, owner info, residents count
- **Expenses**: category, description, amount, month/year, split method
- **Payments**: apartment reference, amount, month/year, status (pending/paid), receipt
- **Announcements**: title, content, priority (normal/important/urgent)

## API Routes (all prefixed with /api)
- GET/POST /api/buildings
- GET/POST /api/apartments
- GET/POST /api/expenses, DELETE /api/expenses/:id
- GET/POST /api/payments, PATCH /api/payments/:id
- GET/POST /api/announcements, DELETE /api/announcements/:id

## Running
- `npm run dev` starts both Express backend and Vite frontend on port 5000
- `npm run db:push` pushes schema changes to PostgreSQL
