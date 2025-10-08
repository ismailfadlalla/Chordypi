# 🔒 ChordyPi Security & Environment Variables Setup

**Date**: October 8, 2025  
**Status**: ✅ Security Enhanced

---

## 🎯 Overview

ChordyPi uses multiple environment variables for different parts of the application. This guide consolidates everything into a secure, unified structure.

---

## 📁 File Structure

### **Current Files:**
```
ChordyPi/
├── .env                    ❌ IGNORED - Local backend development
├── .env.local              ❌ IGNORED - Unified local development (NEW)
├── .env.production         ❌ IGNORED - Production secrets
├── .env.example            ✅ COMMITTED - Template with placeholders
├── .env.production.example ✅ COMMITTED - Production template
└── client/
    ├── .env                ❌ IGNORED - Local React development
    ├── .env.local          ❌ IGNORED - Local React override
    └── .env.example        ✅ COMMITTED - React template
```

### **What Gets Committed to Git:**
- ✅ `.env.example` files (placeholders only)
- ✅ `.env.production.example` (template)
- ✅ `.gitignore` (protects secrets)
- ❌ **NEVER** `.env`, `.env.local`, `.env.production` (contain real keys)

---

## 🔐 Security Rules

### **Golden Rules:**
1. **NEVER commit files with real API keys**
2. **NEVER push `.env` or `.env.local` to git**
3. **ALWAYS use Vercel environment variables for production**
4. **ROTATE keys immediately if exposed**

### **What's Safe vs Unsafe:**

| ✅ Safe to Commit | ❌ Never Commit |
|------------------|----------------|
| `.env.example` | `.env` |
| `.env.production.example` | `.env.production` |
| `.gitignore` | `.env.local` |
| Documentation | Any file with real API keys |

---

## 🚀 Setup Instructions

### **1. Local Development Setup**

```powershell
# Copy the template
cp .env.local .env

# Edit .env and add your real API keys
# (File is in .gitignore so it's safe)
```

Your `.env` file should contain:
```bash
# Pi Network
PI_API_KEY=yggncprmynziskdawv59oxn7azds4ikolzjounw2nr1memfj3v4vusdbbsgghkk5
REACT_APP_PI_NETWORK_API_KEY=yggncprmynziskdawv59oxn7azds4ikolzjounw2nr1memfj3v4vusdbbsgghkk5

# Other secrets...
```

### **2. Production Deployment (Vercel)**

**DO NOT use .env files in production!**

Instead, add environment variables in Vercel Dashboard:

1. Go to: https://vercel.com/ismails-projects-c328e53e/chordypi/settings/environment-variables

2. Add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `REACT_APP_PI_NETWORK_API_KEY` | `yggncprmynziskdawv59oxn7azds4ikolzjounw2nr1memfj3v4vusdbbsgghkk5` | Production |
| `REACT_APP_PI_API_KEY` | `yggncprmynziskdawv59oxn7azds4ikolzjounw2nr1memfj3v4vusdbbsgghkk5` | Production |
| `REACT_APP_PI_ENVIRONMENT` | `production` | Production |
| `REACT_APP_API_URL` | `https://chordypi-api.onrender.com` | Production |

3. Click **Save** for each

4. Redeploy to apply changes

### **3. Team Members Setup**

New team members should:

```powershell
# Clone the repository
git clone https://github.com/yourusername/chordypi.git
cd chordypi/ChordyPi

# Copy example files
cp .env.example .env
cp client/.env.example client/.env

# Get API keys from team lead (NEVER from git!)
# Edit .env and client/.env with real keys

# Install and run
npm install
npm run dev
```

---

## 🛡️ Security Best Practices

### **1. API Key Rotation**

If you suspect a key is compromised:

```powershell
# 1. Generate new key from Pi Network Developer Portal
# 2. Update .env files locally
# 3. Update Vercel environment variables
# 4. Redeploy
npx vercel --prod

# 5. Revoke old key in Pi Developer Portal
```

### **2. Never Log Secrets**

❌ **BAD:**
```javascript
console.log('API Key:', process.env.REACT_APP_PI_API_KEY);
```

✅ **GOOD:**
```javascript
console.log('API Key configured:', !!process.env.REACT_APP_PI_API_KEY);
```

### **3. Check Before Committing**

```powershell
# Always check what you're committing
git status

# Make sure no .env files are in the list
git diff --cached

# If you accidentally staged .env, unstage it:
git reset .env
```

### **4. Use Environment-Specific Keys**

- **Development**: Use sandbox/test API keys
- **Production**: Use production API keys
- **Never mix them!**

---

## 📊 Current Configuration Status

### **Development (Local):**
- ✅ `.env.local` created with all variables
- ✅ Pi Network sandbox mode enabled
- ✅ Local API URLs configured
- ✅ Files protected by .gitignore

### **Production (Vercel):**
- ⏳ Add environment variables to Vercel dashboard
- ⏳ Set `REACT_APP_PI_ENVIRONMENT=production`
- ⏳ Redeploy to apply changes

---

## 🔍 Troubleshooting

### **Issue: Environment variables not loading**

**Check:**
1. Is `.env` in the same directory as the code?
2. Are variables prefixed with `REACT_APP_` for React?
3. Did you restart the dev server after changing .env?
4. Is Dotenv webpack plugin configured?

**Solution:**
```powershell
# Restart dev server
cd client
npm start
```

### **Issue: API key showing in browser**

**This is normal!**  
React environment variables (`REACT_APP_*`) are bundled into the JavaScript and visible in the browser. This is safe because:
- Pi Network API keys are meant to be used client-side
- They're restricted to your registered domains
- They can only be used with your app ID

**To verify domain restrictions:**
1. Go to Pi Developer Portal
2. Check "Allowed Domains"
3. Should only list `chordypi.vercel.app` and `localhost:3000`

### **Issue: .env file was committed to git**

**Emergency Fix:**
```powershell
# Remove from git history (DANGEROUS - backup first!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (CAUTION: This rewrites history!)
git push origin --force --all

# Rotate ALL API keys immediately!
```

**Better: Prevention**
- Use `.gitignore` (already configured)
- Double-check `git status` before commit
- Use pre-commit hooks

---

## 📝 Checklist

Before deploying to production:

- [ ] All `.env` files in `.gitignore`
- [ ] No real API keys committed to git
- [ ] Environment variables added to Vercel dashboard
- [ ] Production API keys different from development
- [ ] Team members know how to get keys securely
- [ ] API keys documented in password manager (not git)
- [ ] Domain restrictions configured in Pi Portal
- [ ] Backup access to Pi Developer account

---

## 🆘 Emergency Contacts

**If API keys are exposed:**
1. **Immediately revoke** in Pi Developer Portal
2. **Generate new keys**
3. **Update Vercel** environment variables
4. **Redeploy** application
5. **Document incident** for security audit

**Pi Network Developer Portal:**  
https://developers.minepi.com

**Vercel Dashboard:**  
https://vercel.com/ismails-projects-c328e53e/chordypi

---

## ✅ Verification

Check your setup is secure:

```powershell
# 1. Verify .env is ignored
git check-ignore .env
# Should output: .gitignore:XX:.env

# 2. Check what's staged
git status
# Should NOT show any .env files

# 3. Verify environment variables load
cd client
npm start
# Check console for "Pi Network SDK initialized"
```

---

**Last Updated**: October 8, 2025  
**Maintained By**: ChordyPi Team  
**Security Status**: ✅ Enhanced & Protected
