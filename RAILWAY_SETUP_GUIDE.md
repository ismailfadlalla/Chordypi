# 🚂 Railway Deployment Setup - ChordyPi Backend

## 🔧 Required Configuration for Railway

### Step 1: Environment Variables (CRITICAL!)

Go to Railway dashboard → Your project → **Variables** tab

Add these **REQUIRED** environment variables:

```bash
# RapidAPI Key (REQUIRED for YouTube downloads)
RAPIDAPI_KEY=223e06cc75msha57f8d4c86ec93ap17fe60jsn29b4702d5ca8

# Port (Railway auto-assigns, but good to set)
PORT=5000

# Flask Environment
FLASK_ENV=production

# Python don't write bytecode (optional but recommended)
PYTHONDONTWRITEBYTECODE=1
```

---

### Step 2: Root Directory (CRITICAL!)

⚠️ **MOST IMPORTANT SETTING!**

Railway needs to know we're deploying from the `/server` folder:

1. Go to **Settings** tab
2. Find **"Root Directory"** or **"Source"** section
3. Set to: `server`
4. Click **Save**

---

### Step 3: Build & Start Commands (Auto-detected)

Railway should auto-detect these from `Procfile` and `railway.json`:

- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `python app.py`

If not auto-detected:
1. Go to **Settings** tab
2. Find **"Build Command"** → Enter: `pip install -r requirements.txt`
3. Find **"Start Command"** → Enter: `python app.py`

---

### Step 4: Python Version

Railway should detect Python 3.10 from `runtime.txt`

If you need to set it manually:
1. Go to **Settings**
2. Find **"Runtime"** or **"Builder"**
3. Select **Python 3.10**

---

## 🚨 Common Issues & Solutions

### Issue 1: "Deployment Failed - Module not found"
**Solution:** Check that Root Directory is set to `server`

### Issue 2: "Port already in use"
**Solution:** Railway auto-assigns PORT. Make sure your `app.py` uses:
```python
port = int(os.environ.get('PORT', 5000))
```

### Issue 3: "RAPIDAPI_KEY not found"
**Solution:** 
1. Go to Variables tab
2. Add: `RAPIDAPI_KEY=223e06cc75msha57f8d4c86ec93ap17fe60jsn29b4702d5ca8`
3. Restart deployment

### Issue 4: "Build takes forever"
**Solution:** 
- TensorFlow is large (~500MB)
- First build takes 5-10 minutes
- Subsequent builds are cached and faster

---

## ✅ Deployment Checklist

Before clicking "Deploy":

- [ ] Root Directory set to `server`
- [ ] `RAPIDAPI_KEY` environment variable added
- [ ] `PORT` environment variable added (optional)
- [ ] `FLASK_ENV=production` added
- [ ] Repository is public (or Railway has access)
- [ ] Branch is set to `main`

---

## 🎯 After Successful Deployment

You'll get a URL like:
```
https://chordypi-backend-production.up.railway.app
```

### Test it:

1. **Health Check:**
   ```
   https://YOUR-RAILWAY-URL.up.railway.app/api/health
   ```
   Should return JSON with "status": "healthy"

2. **Legal Documents:**
   ```
   https://YOUR-RAILWAY-URL.up.railway.app/legal/terms-of-service.html
   https://YOUR-RAILWAY-URL.up.railway.app/legal/privacy-policy.html
   ```
   Should display HTML documents

3. **Analyze a Song:**
   - Use your frontend
   - Check Railway logs for:
     ```
     🚀 Trying RapidAPI YouTube MP3 Downloader...
     ✅ RapidAPI download successful!
     ```

---

## 📊 What to Watch in Railway Logs

During deployment, you should see:

```
📦 Installing dependencies...
✅ Flask==3.1.2
✅ librosa
✅ tensorflow
✅ yt-dlp
✅ requests

🚀 Starting application...
🧹 CLEARING PYTHON BYTECODE CACHE
🚀 APP.PY STARTING - ChordyPi v3.0 with RapidAPI
🔥 AUDIO_PROCESSOR.PY LOADED - VERSION 2 WITH RAPIDAPI DEBUG

 * Running on http://0.0.0.0:5000
Your service is live! 🎉
```

---

## 🔄 Redeploying

If deployment fails:

1. Check logs for errors
2. Fix the issue
3. Push to GitHub: `git push origin main`
4. Railway auto-deploys
5. OR click "Redeploy" in Railway dashboard

---

## 🆘 If Deployment Still Fails

### Option 1: Manual Redeploy
1. Go to Railway dashboard
2. Click **"..."** menu
3. Select **"Redeploy"**

### Option 2: Check Logs
1. Click **"View Logs"**
2. Look for error messages
3. Share the error here for help

### Option 3: Verify Files
Make sure these files exist in `/server`:
- `app.py` ✅
- `requirements.txt` ✅
- `Procfile` ✅
- `railway.json` ✅
- `runtime.txt` ✅

---

## 🎊 Success Indicators

✅ Build completes without errors
✅ Service shows "Healthy" status
✅ URL is accessible
✅ Health check returns JSON
✅ Logs show RapidAPI debug messages
✅ Song analysis works without bot errors

---

**Need help? Share the Railway logs or error messages!** 🚀
