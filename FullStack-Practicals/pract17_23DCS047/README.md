# Tuition Admin Panel (pract17_23DCS122)

Express + MongoDB CRUD for managing students with a minimal admin UI.

## Setup

1. Install dependencies:
   - `npm install`
2. Create `.env` file (see `ENV.example`):
   - `PORT=4000`
   - `MONGO_URI=mongodb://127.0.0.1:27017/tuition_admin`
3. Start MongoDB locally (e.g., `mongod`).
4. Run the server:
   - Dev: `npm run dev`
   - Prod: `npm start`

## API

- `GET /api/students` — list students, supports `?q=search&page=1&limit=50`
- `GET /api/students/:id` — get student
- `POST /api/students` — create student
- `PUT /api/students/:id` — update student
- `DELETE /api/students/:id` — delete student

Open `http://localhost:4000/` for the admin UI.



