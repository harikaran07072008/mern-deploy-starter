# MERN Full-Stack App Deployment (React + Node/Express + MongoDB + Render)

Deployment-ready MERN starter structured for separate backend Web Service and frontend Static Site deployment (following Dave Gray's MERN deployment workflow).

## Project Structure (`mern_deploy_github/`)
- [`backend/`](mern_deploy_github/backend) — Express + Mongoose API with dynamic CORS (`allowedOrigins.js`), `/health`, and `/api/notes` CRUD endpoints.
- [`frontend/`](mern_deploy_github/frontend) — React + Vite SPA consuming `VITE_API_URL`.

## 1. Run Locally
```bash
# Terminal 1 (Backend API on port 3500)
cd mern_deploy_github/backend
npm install
npm start

# Terminal 2 (Frontend Vite dev server on port 5173)
cd mern_deploy_github/frontend
npm install
npm run dev
```

## 2. Deploy to Render + MongoDB Atlas
1. **MongoDB Atlas:** Create a cluster, configure network access, and copy your `DATABASE_URI`.
2. **Backend (Render Web Service):**
   - **Root Directory:** `mern_deploy_github/backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** `DATABASE_URI`, `CLIENT_URL=https://your-frontend.onrender.com`
3. **Frontend (Render Static Site):**
   - **Root Directory:** `mern_deploy_github/frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:** `VITE_API_URL=https://your-backend.onrender.com`
   - **Rewrite Rule (SPA):** `/*` → `/index.html` (`Rewrite`).
