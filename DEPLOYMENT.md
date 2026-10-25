# 🚀 ChilliFusionNet Deployment Guide

This guide provides end-to-end instructions for deploying **ChilliFusionNet** into production. You can choose between:

1. **Separated Architecture (Frontend + Backend)**: React (Vite) on Vercel/Netlify + FastAPI on Render/Railway.
2. **Containerized Deployment (Docker Compose)**: Run both frontend and backend with a single command.
3. **Monolithic Flask Deployment**: Run the all-in-one Flask application on Render/Railway/VPS.

---

## 🏗️ Architecture Options

```
Option A (Separated - Recommended):
  [ React + Vite Frontend ] ---> HTTPS ---> [ FastAPI Backend (Uvicorn) ]
    Hosted on Vercel/Netlify                   Hosted on Render/Railway/HF Spaces
    (Global CDN, Instant Load)                  (EfficientNetB4 + CBAM + Grad-CAM)

Option B (All-in-One Flask):
  [ End User Mobile/Browser ] ---> HTTPS ---> [ Flask + Gunicorn WSGI ]
                                                (Responsive UI + Keras Model)
```

---

## ⚡ Method 1: Separated Frontend & Backend Deployment

### Step 1: Deploy the Backend (FastAPI + AI Model)

You can deploy the backend to **Render**, **Railway**, or **Hugging Face Spaces**.

#### Option 1A: Deploying Backend to Render (Free Tier)
1. Push your project to a GitHub repository.
2. Sign in to [Render.com](https://render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure the following settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3` (or choose `Docker` using `backend/Dockerfile`)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Standard or Starter (Recommended: At least 1GB - 2GB RAM for TensorFlow inference).
6. Under **Environment Variables**, add:
   - `ALLOWED_ORIGINS`: `*` (or your Vercel/Netlify frontend domain once deployed).
7. Click **Create Web Service**.
8. Note your public backend URL (e.g., `https://chillifusionnet-api.onrender.com`).
9. Verify by visiting `https://chillifusionnet-api.onrender.com/health`.

---

### Step 2: Deploy the Frontend (React + Vite)

Deploy the frontend to **Vercel** or **Netlify** with global CDN caching.

#### Option 2A: Deploying Frontend to Vercel (1-Click)
1. Sign in to [Vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `frontend`.
5. In **Build and Output Settings**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://chillifusionnet-api.onrender.com` (Your deployed backend URL from Step 1).
7. Click **Deploy**.
8. Vercel automatically applies [`vercel.json`](file:///frontend/vercel.json) for smooth single-page application routing.

#### Option 2B: Deploying Frontend to Netlify
1. Sign in to [Netlify.com](https://netlify.com).
2. Click **Add new site** -> **Import an existing project**.
3. Select your repository.
4. Set **Base directory** to `frontend`.
5. Set **Publish directory** to `frontend/dist`.
6. Add environment variable:
   - `VITE_API_URL`: `https://chillifusionnet-api.onrender.com`
7. Click **Deploy**. Netlify will use [`netlify.toml`](file:///frontend/netlify.toml).

---

## 🐳 Method 2: One-Command Docker Compose Deployment

If deploying to a VPS (DigitalOcean, AWS EC2, Linode) or local server:

1. Clone your repository:
   ```bash
   git clone <your-repo-url>
   cd ChilliFusionNet_Flask
   ```

2. Start both containers:
   ```bash
   docker compose up --build -d
   ```

3. Services will be available at:
   - **Frontend UI**: `http://<your-server-ip>:3000`
   - **Backend API**: `http://<your-server-ip>:8000`
   - **Interactive API Docs**: `http://<your-server-ip>:8000/docs`

To stop:
```bash
docker compose down
```

---

## 📦 Method 3: Monolithic Flask App Deployment

If you prefer deploying a single service containing the responsive web interface, upload handling, and the model in one place:

### Deploying Flask on Render / Railway
1. Push to GitHub.
2. In Render, create a **Web Service** with:
   - **Root Directory**: `.` (leave blank)
   - **Environment**: `Docker` (Render automatically uses root [`Dockerfile`](file:///Dockerfile))
     *Or Python 3:*
     - **Build Command**: `pip install -r requirements.txt gunicorn`
     - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 4 --timeout 120 app:app`
3. Click **Create Web Service**.
4. The web application will be live at `https://your-flask-app.onrender.com`.

---

## 💡 Important Deployment Tips

### 1. Handling Large Model Weights (`.keras` / `.h5`)
Because deep learning model files (`ChilliFusionNet_final.keras`, ~180MB) exceed GitHub's standard 100MB file limit:
```bash
# Install Git LFS
git lfs install

# Track keras and h5 models
git lfs track "*.keras"
git lfs track "*.h5"

git add .gitattributes
git add .
git commit -m "Add model with Git LFS"
git push origin main
```

### 2. Free Tier Memory Limits
TensorFlow models (especially EfficientNetB4) require around **800MB – 1.2GB RAM** during initialization. If a free-tier hosting instance restarts with an Out-of-Memory (OOM) error, consider:
- Setting Gunicorn to `--workers 1 --threads 2`.
- Upgrading to a basic instance with 1GB or 2GB RAM.
- Setting environment variable `TF_ENABLE_ONEDNN_OPTS=0`.
