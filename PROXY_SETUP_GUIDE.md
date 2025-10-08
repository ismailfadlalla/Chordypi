# 🎸 PROXY SETUP GUIDE

## Quick Start (5 Minutes)

This guide shows you how to enable proxy support to fix YouTube IP blocking.

---

## Option 1: Webshare.io (RECOMMENDED - Cheapest)

### Cost: $1/GB (~100 songs/month)

### Step 1: Sign Up
1. Go to https://www.webshare.io/
2. Create free account
3. Go to "Proxy" → "Proxy List"
4. Copy your proxy credentials

### Step 2: Get Proxy URL
Your proxy format:
```
http://USERNAME:PASSWORD@proxy.webshare.io:80
```

Example:
```
http://myuser-country-session-0:mypass123@proxy.webshare.io:80
```

### Step 3: Add to Render
1. Go to https://dashboard.render.com/
2. Click on your ChordyPi service
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   - **Key**: `PROXY_URL`
   - **Value**: `http://your-username:your-password@proxy.webshare.io:80`
6. Click "Save Changes"
7. Render will auto-redeploy (takes 2-3 minutes)

### Step 4: Verify
Check your Render logs, you should see:
```
🌐 Proxy ENABLED: Webshare.io
🔗 Proxy URL: http://username:****@proxy.webshare.io:80
✅ Using proxy for download
```

---

## Option 2: Smartproxy

### Cost: $2.50/GB (~100 songs/month)

### Setup:
1. Sign up: https://smartproxy.com/
2. Get credentials from dashboard
3. Proxy URL format:
   ```
   http://USERNAME:PASSWORD@gate.smartproxy.com:7000
   ```
4. Add to Render as `PROXY_URL` (same as Option 1, Step 3)

---

## Option 3: Bright Data

### Cost: $0.001 per request

### Setup:
1. Sign up: https://brightdata.com/
2. Create residential proxy zone
3. Get credentials
4. Proxy URL format:
   ```
   http://USERNAME:PASSWORD@brd.superproxy.io:22225
   ```
5. Add to Render as `PROXY_URL` (same as Option 1, Step 3)

---

## Testing Proxy

### Test on Live Site:
1. Go to https://chordypi.vercel.app
2. Search for "Hotel California"
3. Click "Analyze Chords" on any result
4. Should work without 400 error! ✅

### Check Backend Logs (Render):
1. Go to Render dashboard
2. Click on ChordyPi service
3. Go to "Logs" tab
4. Look for:
   ```
   🌐 Proxy ENABLED: Webshare.io
   ✅ Using proxy for download
   🎵 Attempting to download: https://www.youtube.com/watch?v=...
   ✅ Download successful
   ```

---

## Cost Breakdown

### Webshare.io (BEST VALUE):
- **Plan**: Pay-as-you-go
- **Cost**: $1 per GB
- **Average song**: 5-10MB
- **100 songs**: ~500MB-1GB = **$1-2/month**
- **1000 songs**: ~5-10GB = **$10-20/month**

### Smartproxy:
- **Plan**: Pay-as-you-go
- **Cost**: $2.50 per GB
- **100 songs**: **$2.50-5/month**
- **1000 songs**: **$25-50/month**

### Bright Data:
- **Plan**: Per-request pricing
- **Cost**: $0.001 per request
- **100 songs**: **$0.10/month** (cheapest per-request)
- **1000 songs**: **$1/month**
- **BUT**: Higher base fees, complex setup

---

## Troubleshooting

### "Proxy not working" - Still getting 400 errors:

**1. Check environment variable is set:**
```bash
# In Render dashboard
Environment → PROXY_URL → Should have your proxy URL
```

**2. Check logs show proxy enabled:**
```
🌐 Proxy ENABLED: Webshare.io  ← Should see this
```

If you see:
```
⚠️ Proxy DISABLED - Using direct connection  ← BAD
```
→ Environment variable not set correctly

**3. Verify proxy credentials:**
- Test in browser or Postman
- Check proxy service dashboard
- Make sure account is active

**4. Some videos may still fail:**
- Age-restricted videos
- Region-locked videos  
- Premium-only content
- Recommend user upload file instead

---

## Disabling Proxy

To go back to direct connection (FREE but unreliable):

1. Go to Render dashboard
2. Environment tab
3. Delete `PROXY_URL` variable
4. Save changes
5. Service will redeploy

Logs will show:
```
⚠️ Proxy DISABLED - Using direct connection
```

---

## Best Practices

### Start Small:
1. Deploy file upload first (FREE)
2. Test with users
3. Add proxy if needed based on usage

### Monitor Costs:
1. Check proxy service dashboard weekly
2. Set billing alerts
3. Most services have free trials (test first!)

### Optimize:
1. Only use proxy for YouTube downloads
2. File uploads don't need proxy (direct to backend)
3. Cache successful downloads (future feature)

---

## Summary

| Feature | Cost | Reliability | Setup Time |
|---------|------|-------------|------------|
| **File Upload** | FREE ✅ | 100% ✅ | 0 min (already deployed) |
| **YouTube (No Proxy)** | FREE | 20% ❌ | 0 min (current state) |
| **YouTube (Webshare)** | $1-2/mo | 90% ✅ | 5 min |
| **YouTube (Smartproxy)** | $2.50-5/mo | 90% ✅ | 5 min |
| **YouTube (Bright Data)** | $0.10-1/mo | 95% ✅ | 15 min (complex) |

**Recommendation**: Start with **File Upload** (FREE), add **Webshare proxy** ($1-2/mo) if users request YouTube URL support.

---

## Need Help?

### Proxy Service Support:
- Webshare: https://help.webshare.io/
- Smartproxy: https://help.smartproxy.com/
- Bright Data: https://help.brightdata.com/

### ChordyPi Support:
- Check backend logs in Render dashboard
- Test with file upload first (always works)
- Verify proxy credentials in proxy service dashboard

---

🎉 **Ready to enable proxy! Follow Option 1 (Webshare.io) for fastest setup.**
