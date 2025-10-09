# 🎯 Adding YouTube Data API Key - Step by Step

## Step 1: Get YouTube API Key from Google Cloud

### A. Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account

### B. Create a New Project (or use existing)
1. Click the project dropdown at the top
2. Click "**NEW PROJECT**"
3. Project name: `ChordyPi` or `ChordyPi-YouTube`
4. Click "**CREATE**"
5. Wait for project creation (~30 seconds)

### C. Enable YouTube Data API v3
1. Make sure your new project is selected (top dropdown)
2. Click "**☰ Menu**" → **APIs & Services** → **Library**
3. Search for: `YouTube Data API v3`
4. Click on it
5. Click "**ENABLE**"
6. Wait for it to enable (~10 seconds)

### D. Create API Credentials
1. Go to: **APIs & Services** → **Credentials**
2. Click "**+ CREATE CREDENTIALS**" at the top
3. Select "**API key**"
4. Copy the API key that appears (looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
5. Click "**RESTRICT KEY**" (recommended for security)

### E. Restrict the API Key (Optional but Recommended)
1. Under "**Application restrictions**":
   - Select "**HTTP referrers (websites)**"
   - Click "**ADD AN ITEM**"
   - Add: `https://chordypi-production.up.railway.app/*`
   - Add: `https://chordypi.vercel.app/*`
   - Click "**DONE**"

2. Under "**API restrictions**":
   - Select "**Restrict key**"
   - Check: ✅ **YouTube Data API v3**
   - Click "**SAVE**"

---

## Step 2: Add API Key to Railway

### A. Go to Railway Dashboard
1. Visit: https://railway.app
2. Click on your **Chordypi** project
3. Click on your **service** (the one with GitHub icon)

### B. Add Environment Variable
1. Click the "**Variables**" tab
2. Click "**+ New Variable**"
3. Add:
   - **Variable**: `YOUTUBE_API_KEY`
   - **Value**: `[paste your API key here]`
4. Click "**Add**"

### C. Redeploy (Automatic)
Railway will automatically redeploy with the new environment variable.

**Wait**: ~1-2 minutes for deployment to complete

---

## Step 3: Verify It's Working

### A. Check Railway Logs
1. In Railway, click "**Deployments**" tab
2. Click "**View Logs**" on the latest deployment
3. Look for successful startup messages

### B. Test the API
Run this command in PowerShell:

```powershell
$body = @{query="wonderwall"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://chordypi-production.up.railway.app/api/search-songs" -Method Post -Body $body -ContentType "application/json"
```

**Expected result**:
- Should return real YouTube search results
- No "mock database" message
- Actual search results for "wonderwall"

---

## Step 4: Test in Browser

1. Visit: https://chordypi.vercel.app
2. Search for "wonderwall"
3. Should see real YouTube search results
4. Try different searches (should be dynamic now!)

---

## Quota Information

### Free Tier Limits:
- **10,000 units per day** (free)
- Each search costs **100 units**
- = **100 searches per day** (plenty for hackathon!)

### Quota Usage:
Monitor at: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas

---

## Troubleshooting

### If still showing mock results:

1. **Check Railway deployed**:
   - Go to Railway → Deployments
   - Latest deployment should show "Live"

2. **Check environment variable**:
   - Go to Railway → Variables tab
   - `YOUTUBE_API_KEY` should be visible (value hidden)

3. **Check Railway logs**:
   ```
   Look for: "Using real YouTube API" or similar
   ```

4. **Hard refresh browser**:
   - Ctrl + Shift + Delete → Clear cache
   - Or use Incognito mode

### If getting API errors:

1. **Check API key is correct**:
   - Should start with `AIza`
   - No extra spaces

2. **Check YouTube API is enabled**:
   - Google Cloud Console → APIs & Services → Dashboard
   - Should see "YouTube Data API v3" enabled

3. **Check restrictions**:
   - If you restricted the key, make sure Railway domain is allowed
   - Or temporarily remove restrictions to test

---

## Security Best Practices

### ✅ DO:
- Restrict API key to YouTube Data API v3 only
- Add HTTP referrer restrictions (Railway + Vercel domains)
- Monitor quota usage regularly
- Rotate key if exposed

### ❌ DON'T:
- Commit API key to GitHub
- Share API key publicly
- Use same key for multiple apps
- Leave unrestricted in production

---

## Expected Changes

### Before (Mock Data):
```json
{
  "status": "success",
  "songs": [...fixed list...],
  "note": "Using mock database"
}
```

### After (Real YouTube API):
```json
{
  "status": "success",
  "songs": [...dynamic results based on search...],
  "query": "wonderwall"
}
```

---

## Quick Reference

### Google Cloud Console:
https://console.cloud.google.com/

### Enable YouTube API:
https://console.cloud.google.com/apis/library/youtube.googleapis.com

### API Credentials:
https://console.cloud.google.com/apis/credentials

### Railway Project:
https://railway.app

### Railway Variables:
https://railway.app → Chordypi → Variables tab

---

## Time Estimate

- Google Cloud setup: **5 minutes**
- API key creation: **2 minutes**
- Add to Railway: **1 minute**
- Railway redeploy: **2 minutes**
- Testing: **2 minutes**

**Total**: ~12 minutes 🚀

---

## Need Help?

If you get stuck at any step, let me know:
1. Which step you're on
2. What you see
3. Any error messages

I'll guide you through it! 🎸

---

**Ready? Start with Step 1!** 👆
