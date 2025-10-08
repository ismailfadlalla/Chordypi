# 🚀 Render.com Backend Deployment Guide

## Step-by-Step Instructions

### 1️⃣ Create Render Account (2 minutes)

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up using one of these methods:
   - **GitHub** (Recommended - easier deployment)
   - **GitLab**
   - Email

### 2️⃣ Connect Your Repository (1 minute)

1. If you signed up with GitHub:
   - Render will ask for repository access
   - Click **"Grant access"**
   - Select your ChordyPi repository

2. If you signed up with email:
   - Go to **Account Settings** → **Connect GitHub**
   - Authorize Render to access your repositories

### 3️⃣ Create New Web Service (3 minutes)

1. From Render Dashboard, click **"New +"** (top right)
2. Select **"Web Service"**
3. Find your **ChordyPi** repository in the list
4. Click **"Connect"**

### 4️⃣ Configure Web Service (5 minutes)

Fill in these settings:

#### Basic Settings:
- **Name:** `chordypi-api` (or any name you prefer)
- **Region:** Choose closest to your users (e.g., Oregon, Frankfurt)
- **Branch:** `main` (or your default branch)
- **Root Directory:** `server` ⚠️ **IMPORTANT!**
- **Environment:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `python app.py`

#### Instance Type:
- Select **"Free"** ($0/month)
- Note: Free tier spins down after 15 min of inactivity (first request may be slow)

### 5️⃣ Add Environment Variables (5 minutes)

Scroll down to **"Environment Variables"** section and add these:

```
FLASK_ENV=production
FLASK_APP=app.py
PORT=10000
PYTHON_VERSION=3.10.0
CORS_ORIGINS=https://chordypi.vercel.app,http://localhost:3000
```

**SECURE KEYS** (generated for you - see terminal output above):
```
SECRET_KEY=<copy from terminal>
JWT_SECRET_KEY=<copy from terminal>
```

**Optional (if needed):**
```
DATABASE_URL=<will be auto-set if you add a database>
```

### 6️⃣ Deploy! (1 click)

1. Click **"Create Web Service"** at the bottom
2. Render will start building your app
3. Watch the build logs (usually takes 3-5 minutes)
4. Look for: ✅ **"Your service is live"**

### 7️⃣ Get Your Backend URL

Once deployed, you'll see:
- **URL:** `https://chordypi-api.onrender.com` (or similar)
- **Status:** 🟢 Live

Copy this URL - you'll need it!

---

## 🔄 Update Frontend to Use New Backend

### Option 1: Update Vercel Environment Variables (Recommended)

1. Go to **https://vercel.com/dashboard**
2. Select your **ChordyPi** project
3. Click **Settings** → **Environment Variables**
4. Add/Update:
   ```
   REACT_APP_API_URL = https://your-actual-render-url.onrender.com
   ```
5. Click **"Save"**
6. Redeploy: Go to **Deployments** → Click **"..."** → **"Redeploy"**

### Option 2: Update vercel.json (Alternative)

If your Render URL is different from `chordypi-api.onrender.com`, update `vercel.json`:

```json
"rewrites": [
  {
    "source": "/api/analyze-song",
    "destination": "https://YOUR-ACTUAL-URL.onrender.com/api/analyze-song"
  },
  // ... update all API routes
]
```

Then commit and push to trigger auto-deployment.

---

## ✅ Testing Your Deployment

### Test Backend Directly:

1. Open browser to: `https://your-render-url.onrender.com/api/health`
2. Should see: `{"status": "healthy"}`

### Test Full Flow:

1. Go to **https://chordypi.vercel.app**
2. Search for a song (e.g., "Wonderwall")
3. Click on a song to analyze
4. Should see chord progression appear!

---

## 🐛 Troubleshooting

### Build Failed?

**Check build logs for:**
- Missing dependencies in `requirements.txt`
- Python version issues (ensure Python 3.10+)
- Port configuration (should use PORT env var)

**Common fixes:**
```bash
# If TensorFlow fails (large dependency):
# Can comment out in requirements.txt:
# tensorflow>=2.12.0
# tensorflow-io>=0.31.0
# (AI chord detection will use fallback)
```

### Service Not Starting?

**Check start logs for:**
- Port binding issues
- Missing environment variables
- Import errors

**Fix:**
- Ensure `app.py` uses `PORT` env var: `port = int(os.getenv('PORT', 5000))`
- Check all imports are in `requirements.txt`

### CORS Errors?

**Add your Vercel URL to CORS_ORIGINS:**
```
CORS_ORIGINS=https://chordypi.vercel.app,https://your-vercel-url.vercel.app
```

### Slow First Request?

**This is normal on Free tier:**
- Free instances spin down after 15 min inactivity
- First request "wakes up" the instance (10-30 seconds)
- Subsequent requests are fast

**Solutions:**
- Upgrade to Starter tier ($7/month - always on)
- Use a "keep-alive" service to ping every 10 minutes
- Accept the delay (most apps do this)

---

## 📊 Monitoring Your Deployment

### Render Dashboard:
- **Metrics:** CPU, Memory, Request count
- **Logs:** Real-time application logs
- **Events:** Deploy history, crashes

### View Logs:
1. Click on your service
2. Click **"Logs"** tab
3. See real-time Python output

### Check Health:
- Green dot = Healthy
- Red dot = Crashed (check logs)

---

## 🔄 Updating Your Backend

### Automatic Deployment:
Render auto-deploys when you push to your GitHub branch!

```bash
# Make changes to server code
git add server/
git commit -m "Update backend"
git push

# Render automatically detects and deploys!
```

### Manual Deployment:
1. Go to Render Dashboard
2. Click your service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 💰 Render Free Tier Limits

✅ **Free tier includes:**
- 750 hours/month (enough for one service 24/7)
- Automatic HTTPS/SSL
- Git-based deploys
- Basic metrics

⚠️ **Free tier limitations:**
- Spins down after 15 min inactivity
- 512 MB RAM
- Shared CPU
- No custom domains (use .onrender.com subdomain)

🚀 **Upgrade benefits ($7/month Starter):**
- Always-on (no spin down)
- 2 GB RAM
- Custom domains
- Faster CPU

---

## 🎯 Quick Checklist

Before deploying:
- [ ] GitHub repository connected
- [ ] `server/` directory contains all backend files
- [ ] `requirements.txt` is complete
- [ ] `render.yaml` is configured (optional but helpful)
- [ ] Environment variables noted (SECRET_KEY, JWT_SECRET_KEY)

During deployment:
- [ ] Root directory set to `server`
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `python app.py`
- [ ] Environment variables added
- [ ] Free tier selected

After deployment:
- [ ] Service shows "Live" status
- [ ] Test health endpoint works
- [ ] Update Vercel with new backend URL
- [ ] Test full flow from frontend
- [ ] Check logs for any errors

---

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Support:** support@render.com
- **Status Page:** https://status.render.com

---

## 🎉 Success!

Once you see:
```
✅ Your service is live
✅ https://chordypi-api.onrender.com
```

Your backend is deployed! Go test your app! 🚀
