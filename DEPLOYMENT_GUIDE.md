# ChordyPi Deployment Guide

## 🚀 Deploy to Vercel (Recommended - Free HTTPS)

### Quick Deploy Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build the React Client**
```bash
cd client
npm run build
cd ..
```

3. **Deploy to Vercel**
```bash
vercel --prod
```

4. **Your Production URL will be:**
```
https://chordypi.vercel.app
```

### For Pi Network Checklist:
- **Production URL**: `https://chordypi.vercel.app`
- **Authentication Callback**: `https://chordypi.vercel.app/api/pi/authenticate`
- **Payment Callback**: `https://chordypi.vercel.app/api/pi/payment`

---

## 🌐 Alternative: Deploy to Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the Client**
```bash
cd client
npm run build
cd ..
```

3. **Deploy**
```bash
netlify deploy --prod
```

Your URL: `https://chordypi.netlify.app`

---

## 🔧 Alternative: Use ngrok for Temporary URL

If you just need a quick HTTPS URL for testing:

1. **Download ngrok**: https://ngrok.com/download

2. **Start your servers**
```bash
npm run start-all
```

3. **In another terminal, expose port 3443**
```bash
ngrok http https://localhost:3443
```

4. **Use the ngrok URL** (e.g., `https://abc123.ngrok.io`)

**Note**: ngrok URLs change every restart on free plan.

---

## 📱 For Pi Network Hackathon - Quick Start

### Fastest Option: Deploy to Vercel Now

Run these commands from your `ChordsLegend` directory:

```powershell
# 1. Build the React app
cd client
npm run build
cd ..

# 2. Install Vercel CLI (if not installed)
npm install -g vercel

# 3. Deploy (follow the prompts)
vercel --prod
```

### After Deployment:

1. You'll get a URL like: `https://chordypi-abc123.vercel.app`
2. Use this URL in Pi Network Developer Portal
3. Update your app to use this URL for production API calls

---

## 🎯 What to Enter in Pi Network Checklist

### Before Deployment:
```
Production URL: https://localhost:3443 (for testing only)
```

### After Vercel Deployment:
```
Production URL: https://chordypi.vercel.app
or
Production URL: https://chordypi-[your-hash].vercel.app
```

---

## 🔒 Important Notes

1. **HTTPS Required**: Pi Network requires HTTPS. All hosting options above provide free SSL.

2. **Python Backend**: For full functionality (chord analysis), you'll need to deploy the Python server separately:
   - **Render** (free tier): https://render.com
   - **Railway**: https://railway.app
   - **Heroku**: https://heroku.com

3. **Environment Variables**: Update API URLs in production to point to deployed backend.

4. **For Hackathon**: Start with Vercel for frontend, add backend deployment later if needed.

---

## 🚀 Ready to Deploy?

Run these commands now:

```powershell
cd client
npm run build
cd ..
vercel --prod
```

Then update Pi Network with your new production URL! 🎸
