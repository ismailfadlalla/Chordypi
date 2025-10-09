# ✅ ADD YOUTUBE API KEY TO RAILWAY

You already have the YouTube API key! You just need to add it to Railway.

## Your YouTube API Key:
```
AIzaSyCNBzdkGau4j1nKzZUm6AjLv8FPB1mj_Gs
```

---

## 🚀 Quick Steps:

### 1. Go to Railway
Visit: https://railway.app

### 2. Open Your Project
- Click on **Chordypi** project
- Click on your **service** (the one with GitHub icon)

### 3. Add Environment Variable
- Click "**Variables**" tab
- Click "**+ New Variable**" or "**Add Variable**"
- Variable name: `YOUTUBE_API_KEY`
- Value: `AIzaSyCNBzdkGau4j1nKzZUm6AjLv8FPB1mj_Gs`
- Click "**Add**"

### 4. Wait for Auto-Deploy
Railway will automatically redeploy (~2 minutes)

---

## 🧪 Test After Deploy

Run this in PowerShell:

```powershell
$body = @{query="wonderwall"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://chordypi-production.up.railway.app/api/search-songs" -Method Post -Body $body -ContentType "application/json"
```

**Expected**: Should return real YouTube search results (no "mock database" message)

---

## ✅ After Adding:

- ✅ Real YouTube search results (dynamic)
- ✅ Up to 100 searches/day (free quota)
- ✅ No more "mock database" message
- ✅ Search will show actual results for any query

---

**Time**: 2 minutes to add + 2 minutes for Railway to deploy = **4 minutes total** 🚀

**Go to**: https://railway.app → Chordypi → Variables → Add `YOUTUBE_API_KEY`
