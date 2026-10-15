# TeamTasks - Task & Team Management Platform

A full-stack app with authentication, a task module (CRUD), search/filter/sort and a dashboard.

## Live demo
- Frontend (Vercel): `https://<your-app>.vercel.app`
- Backend (Render): `https://<your-api>.onrender.com`

## Login credentials (deployed site)
| Role | Email | Password |
|------|-------|----------|
| User | testuser@example.com | Test@1234 |
| Admin | admin@example.com | Admin@1234 |

These accounts are created by `npm run seed` in `server/`.

## Tech stack
- **Frontend:** React, Vite, React Router, Axios, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express, JWT, bcrypt (bcryptjs)
- **Database:** MongoDB Atlas with Mongoose

## Folder structure
```
client/src/  components/  pages/  hooks/  services/  utils/  store/
server/      controllers/ models/ routes/ middleware/ config/  server.js  seed.js
```

## Local setup
Requirements: Node 18+ and a MongoDB Atlas connection string.

```bash
# 1. Backend
cd server
cp .env.example .env        # fill in MONGO_URI and JWT_SECRET
npm install
npm run seed                # creates test accounts + sample tasks
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd client
cp .env.example .env        # VITE_API_URL=http://localhost:5000
npm install
npm run dev                 # http://localhost:5173
```

## Deployment
1. **MongoDB Atlas:** create a free cluster, add a database user, allow access from anywhere (0.0.0.0/0), copy the connection string.
2. **Render (backend):** New Web Service from the repo, root directory `server`, build `npm install`, start `npm start`. Environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL). After the first deploy, run `npm run seed` once from your machine (with the Atlas `MONGO_URI` in `.env`).
3. **Vercel (frontend):** Import the repo, root directory `client`, framework Vite. Environment variable: `VITE_API_URL` = your Render URL. `vercel.json` already handles React Router refresh.

## API documentation
All requests and responses use JSON. Protected routes need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /register | No | Create account |
| POST | /login | No | Log in, returns JWT |
| GET | /tasks | Yes | List tasks (supports query params) |
| GET | /tasks/:id | Yes | Get one task |
| POST | /tasks | Yes | Create task |
| PUT | /tasks/:id | Yes | Update task |
| DELETE | /tasks/:id | Yes | Delete task |
| GET | /users | Yes | List users (for the "assigned user" dropdown) |

**POST /register** - body `{ "name": "Jane", "email": "jane@example.com", "password": "Passw0rd1" }`
-> `201 { "token": "...", "user": { "id", "name", "email", "role" } }`

**POST /login** - body `{ "email": "...", "password": "...", "rememberMe": true }`
-> `200 { "token": "...", "user": {...} }` (token lasts 30 days with rememberMe, otherwise 1 day)

**GET /tasks** - query: `search` (title), `status` (`pending|in-progress|completed`), `priority` (`low|medium|high`), `sort` (`newest|oldest|dueAsc|dueDesc`)

**POST /tasks** - body
```json
{ "title": "Write docs", "description": "...", "priority": "high",
  "status": "pending", "dueDate": "2026-11-01", "assignedUser": "<userId>" }
```
`assignedUser` defaults to the logged-in user. Responses include the populated `assignedUser` (`_id`, `name`, `email`).

### Error responses
Every error returns `{ "message": "..." }`.

| Code | When |
|------|------|
| 400 | Missing/invalid fields, invalid ID or filter, duplicate email |
| 401 | Missing, invalid or expired JWT, wrong login |
| 404 | Task or route not found |
| Network | The frontend shows "Network error..." when the API cannot be reached |

## Screenshots
Add screenshots of the running app to the `screenshots/` folder and link them here.

## API collection
Import `TeamTasks.postman_collection.json` into Postman or Bruno. Set the `baseUrl` variable; the Login request saves the token automatically.
