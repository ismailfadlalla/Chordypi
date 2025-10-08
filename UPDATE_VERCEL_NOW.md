# 🚀 UPDATE VERCEL - FINAL STEP!

**Railway Backend is LIVE**: ✅ https://chordypi-production.up.railway.app

Now update Vercel to use the Railway backend!

---

## 📝 Step-by-Step Instructions

### Option 1: Manual Update (Recommended)

1. **Go to Vercel Dashboard**:
   ```
   https://vercel.com/ismailfadlallas-projects/chordypi/settings/environment-variables
   ```

2. **Add/Update Environment Variables**:

   Click "Add New" or edit existing, add these:

   **Variable 1**:
   - Key: `VITE_API_URL`
   - Value: `https://chordypi-production.up.railway.app`
   - Environments: ✅ Production

   **Variable 2**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://chordypi-production.up.railway.app`
   - Environments: ✅ Production

3. **Redeploy**:
   - Go to: https://vercel.com/ismailfadlallas-projects/chordypi
   - Click "Deployments" tab
   - Find latest deployment
   - Click "..." menu → "Redeploy"
   - Wait ~2 minutes for build

---

### Option 2: Import .env.production File

1. **Go to Environment Variables**:
   ```
   https://vercel.com/ismailfadlallas-projects/chordypi/settings/environment-variables
   ```

2. **Click "Import .env"** button (top right)

3. **Paste this content**:
   ```env
   VITE_API_URL=https://chordypi-production.up.railway.app
   REACT_APP_API_URL=https://chordypi-production.up.railway.app
   VITE_PI_APP_ID=chordypi
   VITE_PI_ENVIRONMENT=sandbox
   REACT_APP_PI_APP_ID=chordypi
   REACT_APP_PI_ENVIRONMENT=sandbox
   VITE_APP_NAME=ChordyPi
   VITE_APP_VERSION=3.0.0
   ```

4. **Select Environment**: Production

5. **Click Import**

6. **Redeploy** as described above

---

## ✅ Verification Checklist

After Vercel redeploys, test these:

### 1. Frontend Loads
- [ ] Visit: https://chordypi.vercel.app
- [ ] Homepage displays correctly
- [ ] No console errors

### 2. Backend Connection
- [ ] Open browser DevTools → Network tab
- [ ] Try song analysis
- [ ] Check API calls go to: `chordypi-production.up.railway.app`

### 3. YouTube Download (THE BIG TEST!)
- [ ] Paste YouTube URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- [ ] Click Analyze
- [ ] Watch for RapidAPI download logs in Railway (View logs button)
- [ ] Verify song downloads successfully
- [ ] Confirm chord detection works

### 4. Pi Network Auth
- [ ] Click Pi Login button
- [ ] Pi SDK should load
- [ ] Authentication flow works

### 5. Legal Documents
- [ ] Visit: https://chordypi.vercel.app/legal/terms-of-service.html
- [ ] Visit: https://chordypi.vercel.app/legal/privacy-policy.html
- [ ] Both should display properly

---

## 🐛 Troubleshooting

### If frontend still uses old URL:
1. Check Vercel env vars are saved
2. Ensure you redeployed AFTER updating vars
3. Clear browser cache (Ctrl + Shift + Delete)
4. Try incognito/private window

### If YouTube download fails:
1. Check Railway logs: Click "View logs" in Railway dashboard
2. Look for: `🎵 RAPIDAPI: Downloading from YouTube`
3. Verify RapidAPI key is set correctly in Railway
4. Test health endpoint: https://chordypi-production.up.railway.app/api/health

### If Pi Auth doesn't work:
1. Check Pi SDK loaded: View page source → look for `pi-sdk.js`
2. Check console for Pi errors
3. Verify env vars: `VITE_PI_APP_ID=chordypi`

---

## 📊 Expected API Calls

After update, your frontend should make calls to:

```
✅ https://chordypi-production.up.railway.app/api/health
✅ https://chordypi-production.up.railway.app/api/analyze
✅ https://chordypi-production.up.railway.app/api/featured-songs
✅ https://chordypi-production.up.railway.app/legal/terms-of-service.html
```

NOT to:
❌ https://chordypi-backend.up.railway.app (old placeholder)
❌ Any Render URLs

---

## 🎯 Current Status

- ✅ Backend deployed to Railway
- ✅ Health check passing
- ✅ Legal documents accessible
- ✅ RapidAPI configured
- ✅ Pi Network SDK loaded
- ⏳ **WAITING**: Vercel environment variables update
- ⏳ **WAITING**: Vercel redeploy

---

## ⏱️ Time Estimate

- Update env vars: 2 minutes
- Redeploy frontend: 2 minutes
- Testing: 5 minutes
- **Total**: ~10 minutes to complete migration! 🚀

---

**🎉 You're almost done! Just update Vercel and test!**
