# 🚀 PRE-DEPLOYMENT CHECKLIST - ChordyPi

## ✅ COMPLETE VERIFICATION BEFORE DEPLOYING

---

## 📦 **1. GITHUB REPOSITORY**

### Check Status:
- [ ] Repository is **PUBLIC** ✅ (required for Railway free tier)
- [ ] All changes committed
- [ ] All changes pushed to `main` branch
- [ ] Latest commit includes:
  - [ ] Legal documents
  - [ ] Pi Network SDK
  - [ ] Environment configurations
  - [ ] Railway config files

### Verify Files Exist:
```bash
# Run this to check critical files:
ls server/Procfile
ls server/railway.json
ls server/runtime.txt
ls server/requirements.txt
ls server/legal/terms-of-service.html
ls server/legal/privacy-policy.html
ls client/public/index.html
ls client/public/legal/terms-of-service.html
ls client/public/legal/privacy-policy.html
```

---

## 🎨 **2. FRONTEND (Vercel)**

### Vercel Environment Variables:
- [ ] `VITE_API_URL` = `https://chordypi-backend.up.railway.app/api`
- [ ] `VITE_PI_APP_ID` = `chordypi`
- [ ] `VITE_PI_ENVIRONMENT` = `sandbox`
- [ ] `REACT_APP_API_URL` = `https://chordypi-backend.up.railway.app/api` (legacy)
- [ ] `REACT_APP_PI_APP_ID` = `chordypi` (legacy)
- [ ] `REACT_APP_PI_ENVIRONMENT` = `sandbox` (legacy)

### ❌ **DO NOT ADD THESE:**
- [ ] ❌ NO `VITE_PI_API_KEY` (frontend should NOT have API keys!)
- [ ] ❌ NO `VITE_RAPIDAPI_KEY` (backend only!)

### Vercel Project Settings:
- [ ] Framework Preset: **Vite**
- [ ] Root Directory: `client` (or leave blank if deploying from root)
- [ ] Build Command: `npm run build` or `vite build`
- [ ] Output Directory: `dist`
- [ ] Node.js Version: **18.x** or higher

### Files to Verify:
- [ ] `client/public/index.html` has Pi SDK script tag
- [ ] `client/public/legal/` contains legal documents
- [ ] `client/.env.production` exists (for reference)
- [ ] `client/package.json` has all dependencies

---

## 🚂 **3. BACKEND (Railway)**

### Railway Environment Variables (CRITICAL!):
- [ ] `RAPIDAPI_KEY` = `[REDACTED_SECRET_RAPIDAPI]`
- [ ] `PORT` = `5000`
- [ ] `FLASK_ENV` = `production`
- [ ] `PYTHONDONTWRITEBYTECODE` = `1` (optional but recommended)

### Railway Settings (MOST IMPORTANT!):
- [ ] **Root Directory** = `server` ⚠️ **CRITICAL - MUST SET THIS!**
- [ ] **Branch** = `main`
- [ ] **Auto Deploy** = Enabled
- [ ] **Build Command** = Auto-detected from Procfile
- [ ] **Start Command** = Auto-detected from Procfile

### Files to Verify:
```bash
# Check these exist in server/ directory:
server/app.py
server/requirements.txt
server/Procfile
server/railway.json
server/runtime.txt
server/legal/terms-of-service.html
server/legal/privacy-policy.html
server/utils/youtube_api_downloader.py
server/utils/audio_processor.py
```

### Critical Code Checks:
- [ ] `app.py` has legal document routes
- [ ] `app.py` clears Python cache on startup
- [ ] `audio_processor.py` has RapidAPI integration
- [ ] `youtube_api_downloader.py` exists and is complete
- [ ] `requirements.txt` includes all dependencies

---

## 🥧 **4. PI NETWORK INTEGRATION**

### Frontend (Client):
- [ ] Pi SDK loaded in `client/public/index.html`:
  ```html
  <script src="https://sdk.minepi.com/pi-sdk.js"></script>
  ```
- [ ] `PiNetworkIntegration.jsx` component exists
- [ ] `piNetworkService.js` service exists
- [ ] Auth page has "Sign in with Pi Network" button

### Legal Documents Accessible:
- [ ] Frontend: `https://chordypi.vercel.app/legal/terms-of-service.html`
- [ ] Frontend: `https://chordypi.vercel.app/legal/privacy-policy.html`
- [ ] Backend: `https://YOUR-RAILWAY-URL/legal/terms-of-service.html`
- [ ] Backend: `https://YOUR-RAILWAY-URL/legal/privacy-policy.html`

### Content Verification:
- [ ] Terms of Service mentions:
  - [ ] Pi Network integration
  - [ ] ChordyPi branding (not ChordsLegend)
  - [ ] Updated date: October 8, 2025
  - [ ] GitHub repo: Chordypi
- [ ] Privacy Policy mentions:
  - [ ] Pi Network data handling
  - [ ] RapidAPI usage
  - [ ] ChordyPi branding
  - [ ] Contact information

---

## 📋 **5. DEPENDENCIES CHECK**

### Backend Requirements:
```bash
# Verify server/requirements.txt includes:
Flask>=3.1.0
librosa>=0.10.0
tensorflow>=2.20.0
basic-pitch>=0.4.0
yt-dlp>=2025.9.26
requests>=2.31.0
flask-cors
python-dotenv
numpy
soundfile
```

### Frontend Dependencies:
```bash
# Verify client/package.json includes:
react
react-dom
react-router-dom
axios or fetch
vite
```

---

## 🔐 **6. SECURITY CHECK**

### Files That Should NOT Be Committed:
- [ ] `.env` is in `.gitignore` ✅
- [ ] `__pycache__/` is in `.gitignore` ✅
- [ ] `node_modules/` is in `.gitignore` ✅
- [ ] API keys are NOT in any committed files ✅

### Verify .gitignore:
```bash
# Check .gitignore contains:
.env
.env.local
*.pyc
__pycache__/
node_modules/
.DS_Store
```

---

## 🎯 **7. DEPLOYMENT ORDER**

### Recommended Sequence:
1. **GitHub**: ✅ All changes pushed
2. **Railway**: Deploy backend FIRST (need URL for frontend)
3. **Get Railway URL**: Copy the deployed URL
4. **Update Vercel**: Update `VITE_API_URL` with Railway URL
5. **Vercel**: Deploy or redeploy frontend
6. **Test**: Verify everything works
7. **Pi Network**: Submit app to developer portal

---

## 🧪 **8. PRE-DEPLOYMENT TESTS**

### Test Locally First:
```bash
# Backend:
cd server
python app.py
# Visit: http://localhost:5000/api/health
# Visit: http://localhost:5000/legal/terms-of-service.html

# Frontend:
cd client
npm run dev
# Visit: http://localhost:3000
# Test: Analyze a song
```

### Expected Local Results:
- [ ] Backend `/api/health` returns JSON
- [ ] Legal docs load at `/legal/` routes
- [ ] Frontend loads without errors
- [ ] Can navigate between pages
- [ ] No console errors

---

## ⚠️ **9. COMMON PITFALLS TO AVOID**

### Railway:
- ❌ **Forgetting to set Root Directory to `server`** (MOST COMMON ERROR!)
- ❌ Not setting `RAPIDAPI_KEY` environment variable
- ❌ Using wrong Python version (must be 3.10+)

### Vercel:
- ❌ Adding API keys to frontend environment variables
- ❌ Not setting all environments (Production, Preview, Development)
- ❌ Wrong API URL format (must include `/api` at end)

### Pi Network:
- ❌ Legal documents not accessible
- ❌ Using HTTP instead of HTTPS
- ❌ Pi SDK not loaded in HTML

---

## 📊 **10. FINAL VERIFICATION COMMANDS**

### Check Git Status:
```bash
cd E:\ChordyPiProject\ChordyPi
git status
# Should show: "nothing to commit, working tree clean"

git log --oneline -5
# Should show recent commits with legal docs and Pi SDK
```

### Check File Structure:
```bash
# Run these to verify structure:
ls server/
ls server/legal/
ls client/public/
ls client/public/legal/
```

### Check Environment Files:
```bash
cat client/.env.production
# Should NOT contain any API keys

cat client/.env.example
# Should be template only
```

---

## ✅ **11. DEPLOYMENT READY CHECKLIST**

### Before Clicking "Deploy":
- [ ] ✅ GitHub repository is public
- [ ] ✅ Latest code is pushed to `main` branch
- [ ] ✅ All Railway environment variables are set
- [ ] ✅ Railway Root Directory is set to `server`
- [ ] ✅ All Vercel environment variables are set
- [ ] ✅ No API keys in frontend environment variables
- [ ] ✅ Legal documents exist in both frontend and backend
- [ ] ✅ Pi SDK is loaded in `index.html`
- [ ] ✅ RapidAPI key is set in Railway (backend only)
- [ ] ✅ Dependencies are up to date
- [ ] ✅ Local tests passed

### After Railway Deploys:
- [ ] Copy Railway URL
- [ ] Update Vercel `VITE_API_URL` with Railway URL
- [ ] Redeploy Vercel
- [ ] Test deployed app
- [ ] Submit to Pi Network

---

## 🎊 **YOU'RE READY IF:**

✅ All checkboxes above are checked
✅ GitHub shows latest commit
✅ Railway environment variables are set
✅ Railway Root Directory = `server`
✅ Vercel environment variables are set (NO API keys!)
✅ Legal documents are accessible
✅ Pi SDK is loaded

---

## 🚨 **STOP AND FIX IF:**

❌ Root Directory is NOT set to `server` in Railway
❌ API keys are in Vercel environment variables
❌ Legal documents are missing
❌ Pi SDK is not in `index.html`
❌ RAPIDAPI_KEY is not in Railway variables
❌ Repository is still private

---

## 🚀 **READY TO DEPLOY?**

If all checks pass, proceed with:
1. Deploy Railway backend
2. Wait for Railway URL
3. Update Vercel environment variables
4. Deploy/Redeploy Vercel frontend
5. Test everything
6. Submit to Pi Network

**Good luck! You've got this! 🏆**
