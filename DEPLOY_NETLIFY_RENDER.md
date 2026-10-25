# 🚀 Step-by-Step Deployment: Frontend on Netlify & Backend on Render

Your project is now fully configured and staged. Follow these exact steps to deploy live:

---

## 📌 Prerequisites: Push to GitHub First

Run this command in your terminal to push all the latest fixes and configurations:

```bash
git push origin main
```

*(Note: Git LFS is already configured to automatically handle the 184MB `.keras` model file).*

---

## 🟢 Part 1: Deploy Backend to Render

1. Open [dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **New +** (top right) and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your repo:  
   `sangmeshafzalpur/final-responsive-project`
4. Fill in the service configuration:
   * **Name**: `chillifusionnet-backend` (or your preferred name)
   * **Region**: Choose the closest region (e.g., Singapore, Frankfurt, Oregon)
   * **Branch**: `main`
   * **Root Directory**: `backend`
   * **Runtime**: `Python 3`
   * **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
   * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   * **Instance Type**: **Starter** or **Standard** (Recommended: 1GB - 2GB RAM for TensorFlow inference).
5. Scroll down to **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `PYTHON_VERSION` | `3.11.9` |
   | `ALLOWED_ORIGINS` | `*` |
   | `TF_ENABLE_ONEDNN_OPTS` | `0` |
6. Under **Advanced**, set **Health Check Path** to `/health`.
7. Click **Create Web Service**.
8. Once deployment finishes (takes ~2-3 minutes), Render will display your public backend URL, for example:  
   👉 `https://chillifusionnet-backend.onrender.com`
9. Test by opening `https://chillifusionnet-backend.onrender.com/health` in your browser. You will see:
   ```json
   {"status":"healthy","service":"ChilliFusionNet Backend API","model_loaded":true}
   ```

---

## 🌐 Part 2: Deploy Frontend to Netlify

1. Open [app.netlify.com](https://app.netlify.com) and log in.
2. Click **Add new site** -> **Import an existing project**.
3. Select **GitHub** and authorize access to your repository:  
   `sangmeshafzalpur/final-responsive-project`
4. Netlify will automatically detect the pre-configured [`netlify.toml`](file:///netlify.toml):
   * **Base directory**: `frontend`
   * **Build command**: `npm run build`
   * **Publish directory**: `frontend/dist`
5. Click **Add environment variables** and enter:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://chillifusionnet-backend.onrender.com` *(Use your exact Render URL from Part 1)* |
6. Click **Deploy final-responsive-project**.
7. In ~1 minute, your Netlify site will be live on a global CDN URL (e.g. `https://chillifusionnet.netlify.app`)!

---

## 🔄 How Frontend Connects to Backend

In [`frontend/src/services/api.js`](file:///frontend/src/services/api.js):
* In local development: defaults to `http://localhost:8000/api`.
* In Netlify production: automatically reads `VITE_API_URL` (`https://chillifusionnet-backend.onrender.com/api`).
* CORS in [`backend/app/main.py`](file:///backend/app/main.py) is pre-configured to accept requests from your Netlify domain.
