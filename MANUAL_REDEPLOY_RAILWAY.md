# 🔄 MANUALLY REDEPLOY RAILWAY

Railway didn't auto-deploy? No problem! Here's how to manually trigger it:

---

## 🚀 Quick Steps to Redeploy

### Method 1: From Deployments Tab (Recommended)

1. **Go to Railway**: https://railway.app
2. **Click** your **Chordypi** project
3. **Click** your **service** (the one with GitHub icon)
4. **Click** "**Deployments**" tab (at the top)
5. **Look for** the latest deployment (should show commit `34ed991`)
6. **Click the "⋮" (three dots)** on the right side
7. **Click "Redeploy"**
8. **Wait** ~2 minutes for deployment

---

### Method 2: Trigger from Settings

1. Go to Railway → Chordypi → Your service
2. Click "**Settings**" tab
3. Scroll to "**Service**" section
4. Click "**Redeploy**" button
5. Confirm the redeploy
6. Wait ~2 minutes

---

### Method 3: Force Git Push (If above don't work)

In PowerShell:
```powershell
cd e:\ChordyPiProject\ChordyPi
git commit --allow-empty -m "chore: Trigger Railway deployment"
git push origin main
```

This creates an empty commit that forces Railway to redeploy.

---

## ✅ How to Know It's Deploying

### In Railway Dashboard:

**Deployments tab** will show:
- 🔄 **Building...** (grey/blue) - Currently deploying
- ✅ **Success** (green) - Deployed successfully
- ❌ **Failed** (red) - Something went wrong

**Also check**:
- **View Logs** button - See real-time deployment logs
- Status at top should say "**Live**" when done

---

## 🧪 Test After Deployment

### 1. Check Health Endpoint
```powershell
curl https://chordypi-production.up.railway.app/api/health
```
**Expected**: Should return 200 OK with service info

### 2. Test File Upload
```powershell
# Create a test (this will fail but shows endpoint is responding)
$headers = @{"Content-Type" = "application/json"}
$body = @{url="https://www.youtube.com/watch?v=3T1c7GkzRQQ"; song_name="Test"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://chordypi-production.up.railway.app/api/analyze-song" -Method Post -Body $body -Headers $headers
```
**Expected**: Should start analysis (might fail on YouTube download, but 200 response = working)

---

## 🎯 After Railway is Live

### Then Add YouTube API Key:

1. **While on Railway**, click "**Variables**" tab
2. **Click "New Variable"**
3. **Add**:
   - Name: `YOUTUBE_API_KEY`
   - Value: `AIzaSyCNBzdkGau4j1nKzZUm6AjLv8FPB1mj_Gs`
4. **Click "Add"**
5. **This will trigger another redeploy** (~2 min)

---

## 📊 Expected Timeline

1. **Manual redeploy**: ~2 minutes
2. **Add YouTube key**: 1 minute
3. **Auto-redeploy from env var**: ~2 minutes
4. **Test everything**: 2 minutes

**Total**: ~7 minutes to full functionality! 🚀

---

## 🐛 If Deployment Fails

### Check Logs:
1. Railway → Deployments → Click on failed deployment
2. Click "**View Logs**"
3. Look for errors (usually shows which line failed)

### Common Issues:
- **Missing dependencies**: Check `requirements.txt`
- **Import errors**: Module not installed
- **Syntax errors**: Check the error line

### Quick Fix:
If you see an error, let me know and I'll help fix it!

---

## 📝 Current Commits to Deploy

- ✅ `5f213c6` - API endpoint fixes
- ✅ `62c9cd7` - Numpy float32 fix
- ✅ `34ed991` - File upload support

**All pushed to GitHub** ✅

---

**Start here**: https://railway.app → Chordypi → Deployments → Redeploy

**Time**: 2 minutes to redeploy + 2 minutes for deployment = 4 minutes! 🎸
