# Architecture

## Overview
The PFM Dashboard is a MERN-style application that aggregates financial data into a single view. The current phase focuses on backend scaffolding, authentication, and a frontend shell that will host dashboards and charts.

## Tech Stack
- Frontend: React, Tailwind CSS, Recharts
- Backend: Node.js, Express
- Database: MongoDB (Mongoose ODM)
- External: Plaid API (planned in Phase 2)

## System Components
- Frontend (Vite + React): UI, routing, API calls
- Backend (Express): REST APIs, auth, data processing
- Database (MongoDB): users, accounts, transactions

## Backend Flow (File Dependencies)
1. `backend/server.js`
   - Loads environment variables.
   - Connects to MongoDB via `backend/config/db.js`.
   - Registers middleware (CORS, JSON parser).
   - Mounts route modules from `backend/routes/*`.

2. Routes -> Controllers
   - `backend/routes/authRoutes.js` -> `backend/controllers/authController.js`
   - `backend/routes/accountRoutes.js` -> `backend/controllers/accountController.js`
   - `backend/routes/transactionRoutes.js` -> `backend/controllers/transactionController.js`

3. Controllers -> Models and Utils
   - Controllers use Mongoose models from `backend/models/*`.
   - Transaction logic can use `backend/utils/categorizeTransaction.js` when categorization is added.

4. Middleware -> Models
   - `backend/middleware/authMiddleware.js` verifies JWT, then loads the user from `backend/models/User.js`.

5. Models -> Database
   - `backend/models/*.js` define schemas and map to MongoDB collections.

## Request Lifecycle (Backend)
1. Client sends request to `/api/*`.
2. Express matches the route module.
3. Auth middleware verifies the token (protected routes only).
4. Controller runs business logic and queries MongoDB.
5. Response is returned to the client as JSON.

## Frontend Flow
1. UI renders routes in `frontend/src/App.jsx`.
2. Pages call API helpers in `frontend/src/services/api.js`.
3. Auth token is stored and managed via `frontend/src/hooks/useAuth.js`.
4. Responses populate UI state (dashboards and charts in later phases).

## Planned Integration (Plaid)
- `backend/config/plaid.js` initializes the Plaid client.
- Account linking flow will connect the frontend Plaid Link to backend token exchange endpoints.
