# Deployment Guide - AI Resume Creator

To host your AI Resume Creator publicly, you need to deploy the **Frontend** and **Backend** separately (or use a service that supports both).

## Recommended Hosting Pair: Vercel + Render

### 1. Backend (Render.com)
Render is great for Node.js apps and has a solid free tier.

**Steps:**
1. Push your code to a GitHub repository.
2. Link your GitHub account to Render.
3. Create a new **Web Service**.
4. **Environment Variables:**
   - `GEMINI_API_KEY`: Your key from Google AI Studio.
   - `CORS_ORIGIN`: Your production frontend URL (e.g., `https://my-resume-creator.vercel.app`).
5. **Build command**: `cd server && npm install`
6. **Start command**: `cd server && npm start`

### 2. Frontend (Vercel.com)
Vercel is the gold standard for React/Vite apps.

**Steps:**
1. Link your GitHub repository to Vercel.
2. Select the `client` folder as the root directory.
3. **Environment Variables:**
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://resume-api.onrender.com/api`).
4. **Build command**: `npm run build`
5. **Output Directory**: `dist`
6. Click **Deploy**.

---

## 🏗️ Technical Architecture Table
| Layer | Service | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Vercel | Hosting the React + Vite UI |
| **Backend** | Render | Hosting the Node.js (Express) API |
| **AI** | Google Gemini | Powering the resume optimization |

---

## Important Checklist
- [ ] **Gemini API Key**: Ensure your key is from [Google AI Studio](https://aistudio.google.com/app/apikey).
- [ ] **CORS**: Ensure `CORS_ORIGIN` in the backend exactly matches your frontend URL.
- [ ] **HTTPS**: Use `https://` for your `VITE_API_URL` values.
- [ ] **Node Version**: Ensure both platforms use Node.js 18 or 20 (standard on Vercel/Render).
