# Pi Network App Registration Guide

## Issue: Authentication Hanging Indefinitely

If clicking "Connect with Pi Network" shows "Connecting..." but never completes, your app likely needs to be registered in the **Pi Developer Portal**.

## Steps to Register Your App

### 1. Go to Pi Developer Portal
Visit: https://develop.pi

### 2. Create a New App
- Click "Create New App" or "Register App"
- Fill in the required information:
  - **App Name**: ChordyPi
  - **App Description**: AI-powered guitar chord learning platform
  - **App URL**: https://chordypi.vercel.app
  - **App Type**: Web Application
  - **Category**: Music & Entertainment / Education

### 3. Configure App Settings
- **Redirect URLs**: 
  - https://chordypi.vercel.app
  - https://chordypi.vercel.app/
- **Scopes Requested**:
  - ✅ username (to identify users)
  - ✅ payments (for premium features)

### 4. Get Your API Key
After registration, you'll receive:
- **App ID**: Copy this
- **API Key**: Copy this

### 5. Add API Key to Vercel Environment Variables
Go to: https://vercel.com/your-username/chordypi/settings/environment-variables

Add:
```
REACT_APP_PI_API_KEY=your_api_key_here
VITE_PI_API_KEY=your_api_key_here
```

### 6. Redeploy
After adding the environment variables:
1. Go to Vercel Deployments
2. Click "Redeploy" on the latest deployment
3. Test authentication again in Pi Browser

## What Happens Without Registration?

Without registration in the Pi Developer Portal:
- ❌ `window.Pi.authenticate()` will hang indefinitely
- ❌ Pi Browser can't show the permission dialog
- ❌ postMessage communication fails
- ❌ Users can't authenticate

## After Registration

Once registered:
- ✅ Pi Browser recognizes your app
- ✅ Shows proper permission dialog to users
- ✅ Authentication completes successfully
- ✅ Users can make Pi payments

## Current Auto-Detection Settings

Your app now automatically detects:
- **Production mode** on `vercel.app` or `chordypi.com` domains
- **Sandbox mode** on `localhost` for development
- **30-second timeout** if authentication hangs

## Testing Checklist

After registration, test in Pi Browser:
1. ✅ Click "Connect with Pi Network"
2. ✅ See "Connecting..." loading state
3. ✅ Pi Browser shows permission dialog
4. ✅ Approve permissions
5. ✅ See "✅ Connected" status
6. ✅ See your Pi username displayed

## Troubleshooting

### Still Hanging After Registration?
Check console logs for:
```
🌍 Environment: production mode (isProduction: true)
⏳ Calling window.Pi.authenticate()...
⏰ Authentication is taking longer than expected (5+ seconds)...
```

### Error Messages
If you see timeout error after 30 seconds:
- Check network connectivity
- Verify app is approved in Pi Developer Portal
- Check API key is correctly set in Vercel
- Try clearing Pi Browser cache

## Support
- Pi Developer Docs: https://developers.minepi.com
- Pi Developer Portal: https://develop.pi
- Pi Network Support: support@minepi.com
