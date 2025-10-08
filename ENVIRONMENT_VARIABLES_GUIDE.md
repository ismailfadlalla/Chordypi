# 🚀 Environment Variables Setup Guide

## ✅ Your `.env` is Already Configured!

Your `.env` file already has all the necessary Pi Network variables. I've updated them to use **`VITE_`** prefix (required for Vite projects).

---

## 📋 Current Environment Variables

### **Local Development** (`.env` file):
```bash
VITE_API_URL=https://chordypi-backend.up.railway.app/api
VITE_PI_APP_ID=chordypi
VITE_PI_ENVIRONMENT=sandbox
VITE_PI_API_KEY=yggncprmynziskdawv59oxn7azds4ikolzjounw2nr1memfj3v4vusdbbsgghkk5
```

---

## 🌐 Vercel Deployment - Add These Variables

### **Go to Vercel Dashboard:**
1. Open: https://vercel.com/dashboard
2. Select your **ChordyPi** project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

### **Required Variables for Vercel:**

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `https://YOUR-RAILWAY-URL.up.railway.app/api` | Production, Preview, Development |
| `VITE_PI_APP_ID` | `chordypi` | Production, Preview, Development |
| `VITE_PI_ENVIRONMENT` | `sandbox` | Production, Preview, Development |
| `VITE_PI_API_KEY` | `yggncprmynziskdawv59oxn7azds4ikolzjounw2nr1memfj3v4vusdbbsgghkk5` | Production, Preview, Development |

### **Legacy Support (Optional but Recommended):**

| Name | Value | Environment |
|------|-------|-------------|
| `REACT_APP_API_URL` | `https://YOUR-RAILWAY-URL.up.railway.app/api` | Production, Preview, Development |
| `REACT_APP_PI_APP_ID` | `chordypi` | Production, Preview, Development |
| `REACT_APP_PI_ENVIRONMENT` | `sandbox` | Production, Preview, Development |

---

## 🔄 After Railway Deployment

Once Railway gives you a URL (e.g., `chordypi-production.up.railway.app`):

### **Step 1: Update Vercel Variables**
1. Go to Vercel → Settings → Environment Variables
2. Edit `VITE_API_URL` and `REACT_APP_API_URL`
3. Replace with: `https://YOUR-ACTUAL-RAILWAY-URL.up.railway.app/api`
4. Save changes

### **Step 2: Redeploy Vercel**
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Check **"Use existing Build Cache"**
4. Click **"Redeploy"**

---

## 🚂 Railway Backend Variables

### **Go to Railway Dashboard:**
1. Open your ChordyPi project
2. Go to **Variables** tab
3. Add these:

| Variable Name | Value |
|---------------|-------|
| `RAPIDAPI_KEY` | `223e06cc75msha57f8d4c86ec93ap17fe60jsn29b4702d5ca8` |
| `PORT` | `5000` |
| `FLASK_ENV` | `production` |
| `PYTHONDONTWRITEBYTECODE` | `1` |

### **Critical Railway Settings:**
- **Root Directory:** `server` ⚠️ **MUST SET THIS!**
- **Build Command:** `pip install -r requirements.txt` (auto-detected)
- **Start Command:** `python app.py` (auto-detected from Procfile)

---

## ✅ Verification Checklist

### **Frontend (Vercel):**
- [ ] `VITE_API_URL` points to Railway backend
- [ ] `VITE_PI_APP_ID` is set to `chordypi`
- [ ] `VITE_PI_ENVIRONMENT` is `sandbox`
- [ ] All variables are set for **Production** environment
- [ ] Redeployed after adding variables

### **Backend (Railway):**
- [ ] `RAPIDAPI_KEY` is set (for YouTube downloads)
- [ ] `PORT` is set to `5000`
- [ ] Root Directory is `server`
- [ ] Deployment successful

---

## 🧪 Testing After Deployment

### **1. Test Backend Health:**
```
https://YOUR-RAILWAY-URL.up.railway.app/api/health
```
**Expected:** JSON response with `"status": "healthy"`

### **2. Test Legal Documents:**
```
https://YOUR-RAILWAY-URL.up.railway.app/legal/terms-of-service.html
https://YOUR-RAILWAY-URL.up.railway.app/legal/privacy-policy.html
```
**Expected:** HTML pages displaying legal documents

### **3. Test Frontend:**
```
https://chordypi.vercel.app
```
**Expected:** App loads, can analyze songs, no CORS errors

### **4. Test Pi Network (in Pi Browser):**
```
https://chordypi.vercel.app/auth
```
- Click "Sign in with Pi Network"
- **Expected:** Permission dialog appears (in Pi Browser)

---

## 🔐 Security Notes

### **`.env` File:**
- ✅ Already in `.gitignore` (safe)
- ✅ NOT committed to GitHub (safe)
- ✅ Only exists locally (safe)

### **Vercel Variables:**
- ✅ Stored securely in Vercel (encrypted)
- ✅ Not visible in deployed code
- ✅ Not in GitHub repository

### **Railway Variables:**
- ✅ Stored securely in Railway (encrypted)
- ✅ Not visible in logs
- ✅ Not in GitHub repository

---

## 🎯 Quick Setup Commands

### **Check Current Environment Variables:**
```bash
# In your terminal
cat client/.env
```

### **Test Locally:**
```bash
cd client
npm run dev
```
Open: http://localhost:3000

### **Build for Production:**
```bash
cd client
npm run build
```

---

## 🆘 Troubleshooting

### **Issue: "VITE_API_URL is undefined"**
**Solution:** 
1. Make sure variables start with `VITE_` (not `REACT_APP_`)
2. Restart dev server after changing `.env`
3. Redeploy Vercel after updating variables

### **Issue: "CORS error when calling API"**
**Solution:**
1. Check backend CORS settings in `server/app.py`
2. Verify `VITE_API_URL` points to correct Railway URL
3. Ensure Railway backend is running

### **Issue: "Pi Network SDK not available"**
**Solution:**
1. Check `index.html` has Pi SDK script tag
2. Test in Pi Browser (not regular Chrome)
3. Verify `VITE_PI_APP_ID` is set

---

## 🎊 Summary

### ✅ **Already Done:**
- Pi Network variables in `.env` ✅
- Updated to use `VITE_` prefix ✅
- Example file exists ✅

### 🔄 **Next Steps:**
1. Add variables to Vercel dashboard
2. Deploy Railway backend
3. Update `VITE_API_URL` with Railway URL
4. Redeploy Vercel
5. Test everything!

---

**Your environment variables are ready! Just need to add them to Vercel and Railway dashboards!** 🚀
