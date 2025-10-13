# RapidAPI Test Instructions - Quick Verification

## 🧪 Test If RapidAPI Is Working

You said the RAPIDAPI_KEY is already set in Railway. Let's verify it's actually working!

### Method 1: Use the Test Page (EASIEST)

**After Vercel deploys (2-3 minutes), visit**:
```
https://chordypi.vercel.app/test-rapidapi.html
```

**Click the button** and it will tell you if RapidAPI is:
- ✅ Configured correctly
- ✅ API key valid
- ✅ YouTube downloads working
- ❌ OR what's wrong if it fails

### Method 2: Direct API Test

Open your browser and visit:
```
https://chordypi-production.up.railway.app/api/test-rapidapi
```

**Expected Success Response**:
```json
{
  "status": "success",
  "message": "✅ RapidAPI is configured and working!",
  "details": {
    "status": "success",
    "message": "RapidAPI YouTube downloader working!",
    "test_title": "Rick Astley - Never Gonna Give You Up",
    "test_duration": 213
  }
}
```

**If It Fails**, you'll see:
```json
{
  "status": "error",
  "message": "❌ RapidAPI test failed",
  "details": {
    "status": "error",
    "message": "RAPIDAPI_KEY not found in environment",
    "solution": "Add RAPIDAPI_KEY to Railway environment variables"
  }
}
```

## 🔍 Troubleshooting

### Issue 1: "RAPIDAPI_KEY not found"
**Solution**:
1. Go to Railway dashboard
2. Select ChordyPi backend
3. Go to Variables tab
4. Verify `RAPIDAPI_KEY` is there
5. Click "Redeploy" to apply changes

### Issue 2: "API error: 403" or "API error: 429"
**Possible Causes**:
- **403**: Invalid API key
- **429**: Exceeded 500 downloads/month quota

**Solution**:
- Check if key is correct: `223a06cc75msh57f8d4c86ec93ap17fe60jsn29b4702d5ca8`
- Check RapidAPI dashboard for usage limits

### Issue 3: "Network error" or "Timeout"
**Possible Causes**:
- Railway backend is down
- Network connectivity issue

**Solution**:
- Check Railway deployment status
- Check Railway logs for errors

## 📊 Expected Behavior

### If RapidAPI is Working:
1. **YouTube Analysis**: Songs will analyze successfully
2. **Backend Logs**: Will show "✅ SUCCESS with RapidAPI!"
3. **No Bot Errors**: No more "Sign in to confirm you're not a bot"
4. **Fast Downloads**: Audio downloads in 5-10 seconds

### If RapidAPI is NOT Working:
1. **YouTube Analysis**: Will fail with bot detection error
2. **Backend Logs**: Will show "⚠️ RAPIDAPI_KEY not set"
3. **Fallback to yt-dlp**: Which fails with bot detection
4. **400 Errors**: Analysis endpoint returns error

## 🚀 Next Steps

1. **Wait for Vercel to deploy** (2-3 minutes)
2. **Open test page**: https://chordypi.vercel.app/test-rapidapi.html
3. **Click "Test RapidAPI Connection"**
4. **Check results**:
   - ✅ SUCCESS → YouTube analysis should work!
   - ❌ FAILED → Check Railway environment variables

## 🎯 Quick Verification Checklist

After testing:

- [ ] Test page shows ✅ SUCCESS
- [ ] Try analyzing a YouTube song (e.g., "Shape of You Ed Sheeran")
- [ ] Check backend logs show "✅ SUCCESS with RapidAPI!"
- [ ] Verify no "bot detection" errors
- [ ] Confirm chords are returned successfully

## 📝 Railway Environment Variable Check

**Go to Railway Dashboard**:
1. https://railway.app
2. Select your ChordyPi project
3. Click "Variables" tab
4. Look for:
   ```
   RAPIDAPI_KEY = 223a06cc75msh57f8d4c86ec93ap17fe60jsn29b4702d5ca8
   ```

**If it's there but test fails**:
- Click "Redeploy" to force Railway to pick up the variable
- Check Railway logs for any startup errors
- Verify the key value is EXACTLY as shown (no extra spaces)

## 🔗 Test URLs

**Test Page (after deployment)**:
```
https://chordypi.vercel.app/test-rapidapi.html
```

**Direct API Test**:
```
https://chordypi-production.up.railway.app/api/test-rapidapi
```

**Railway Logs**:
```
https://railway.app → Select project → View Logs
```

---

**Expected Result**: 
After running the test, you'll know EXACTLY if RapidAPI is working or what needs to be fixed!
