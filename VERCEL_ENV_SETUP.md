# Vercel Environment Variables Setup

## Required Environment Variables for Pi Network Integration

You MUST add these environment variables to your Vercel project for Pi authentication to work:

### Steps to Add Environment Variables to Vercel:

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your `chordypi` project
3. Go to **Settings** → **Environment Variables**
4. Add each of these variables:

```
VITE_API_URL=https://chordypi-backend.up.railway.app/api
VITE_PI_API_KEY=yggncprmynziskdawv59oxn7azds4ikolzjounw2nr1memfj3v4vusdbbsgghkk5
VITE_PI_NETWORK_API_KEY=yggncprmynziskdawv59oxn7azds4ikolzjounw2nr1memfj3v4vusdbbsgghkk5
VITE_PI_APP_ID=chordypi
VITE_PI_ENVIRONMENT=sandbox
```

5. For each variable, select **All Environments** (Production, Preview, Development)
6. Click **Save**
7. **IMPORTANT**: After adding all variables, you MUST **redeploy** your app:
   - Go to **Deployments** tab
   - Click the three dots (...) on the latest deployment
   - Click **Redeploy**

### Why This is Necessary:

- Vercel doesn't automatically read `.env` files from your repository for security reasons
- You must manually add environment variables in the Vercel dashboard
- After adding variables, you must redeploy for them to take effect

### Verify It's Working:

After redeploying:
1. Open your app in Pi Browser
2. Go to authentication page
3. Open browser console and check for the log: `🔧 Pi SDK Config:`
4. It should show `hasApiKey: true` and `environment: 'sandbox'`

### Pi Developer Portal Setup:

Make sure you've also:
1. Registered your app at https://developers.minepi.com
2. Added your domain `chordypi.vercel.app` to the allowed domains list
3. Your App ID matches: `chordypi`
