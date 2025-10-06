## Portfolio Contact Form (pract16_23DCS122)

A simple, polished contact form with Node/Express and NodeMailer.

### Features
- Validated contact form with modern UI/UX
- Express API endpoint using NodeMailer
- Clear success/failure feedback with optional preview URL in dev

### Quick start
1. Open a terminal in this folder `pract16_23DCS122`.
2. Install dependencies:
   - `npm i`
3. Start the backend server:
   - `npm run start`
   - The server will start on port 4001 by default and auto-retry to the next port if it is in use. The console will print the exact URL, e.g. `Server running on http://localhost:4001`.
4. Open the UI:
   - Open `client/index.html` in your browser.
   - The form is configured to call the backend at `http://localhost:4001`.

### Environment
- The server loads `server/.env` if present. If missing, it uses `server/ENV.example` as a fallback so you can run immediately.
- Dev email is enabled via Nodemailer Ethereal by default (`USE_ETHEREAL=true` in `ENV.example`). On successful submit, you will see a preview link in the success message.

To use real SMTP instead of Ethereal:
1. Copy `server/ENV.example` to `server/.env`.
2. Set `USE_ETHEREAL=false` (or remove it) and fill these:
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`
   - `SMTP_USER`, `SMTP_PASS`
   - `FROM_EMAIL` (optional), `TO_EMAIL` (defaults to `SMTP_USER`)
3. Restart the server: `npm run start`

### API
POST `http://localhost:<port>/api/contact`
Body: `{ name, email, message }`

### Notes
- Health check: `GET /health`
- CORS is enabled for local testing.
- Do not commit real credentials in `.env`.
