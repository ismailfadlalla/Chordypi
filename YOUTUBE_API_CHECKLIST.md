# ✅ YOUTUBE API KEY - Quick Checklist

## 📋 Step-by-Step Checklist

### Step 1: Google Cloud Console
- [ ] Go to: https://console.cloud.google.com/
- [ ] Sign in with Google account
- [ ] Create new project named "ChordyPi"
- [ ] Wait for project creation (~30 sec)

### Step 2: Enable YouTube Data API
- [ ] Click ☰ Menu → APIs & Services → Library
- [ ] Search: "YouTube Data API v3"
- [ ] Click "ENABLE"
- [ ] Wait for activation (~10 sec)

### Step 3: Create API Key
- [ ] Go to: APIs & Services → Credentials
- [ ] Click "+ CREATE CREDENTIALS"
- [ ] Select "API key"
- [ ] Copy the API key (starts with `AIza...`)
- [ ] Save it somewhere safe

### Step 4: Restrict API Key (Optional)
- [ ] Click "RESTRICT KEY"
- [ ] API restrictions → Select "Restrict key"
- [ ] Check: ✅ YouTube Data API v3
- [ ] Click "SAVE"

### Step 5: Add to Railway
- [ ] Go to: https://railway.app
- [ ] Click your Chordypi project
- [ ] Click your service
- [ ] Click "Variables" tab
- [ ] Click "+ New Variable"
- [ ] Variable: `YOUTUBE_API_KEY`
- [ ] Value: [paste your API key]
- [ ] Click "Add"

### Step 6: Wait for Redeploy
- [ ] Railway auto-deploys (~2 min)
- [ ] Check "Deployments" tab
- [ ] Wait for "Live" status

### Step 7: Test It
- [ ] Run in PowerShell:
```powershell
$body = @{query="wonderwall"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://chordypi-production.up.railway.app/api/search-songs" -Method Post -Body $body -ContentType "application/json"
```
- [ ] Should see real YouTube results (no "mock" message)

### Step 8: Test in Browser
- [ ] Visit: https://chordypi.vercel.app
- [ ] Search for "wonderwall"
- [ ] Should see real, dynamic search results!

---

## 🎯 Quick Links

**Google Cloud Console**: https://console.cloud.google.com/

**Enable YouTube API**: https://console.cloud.google.com/apis/library/youtube.googleapis.com

**Create Credentials**: https://console.cloud.google.com/apis/credentials

**Railway Dashboard**: https://railway.app

---

## ⚡ Time: ~12 minutes total

## 📊 Free Quota: 100 searches/day

---

**Start here**: https://console.cloud.google.com/ 🚀
