# ⚡ QUICK SETUP - Vercel Environment Variables

## 🎯 Add These to Vercel Dashboard Right Now:

### **Step 1: Go to Vercel**
https://vercel.com/dashboard → Your ChordyPi Project → Settings → Environment Variables

---

### **Step 2: Add Each Variable**

Click **"Add New"** for each:

#### **1. Backend API URL**
```
Name:  VITE_API_URL
Value: https://chordypi-backend.up.railway.app/api
Environments: ✅ Production ✅ Preview ✅ Development
```

#### **2. Pi App ID**
```
Name:  VITE_PI_APP_ID
Value: chordypi
Environments: ✅ Production ✅ Preview ✅ Development
```

#### **3. Pi Environment**
```
Name:  VITE_PI_ENVIRONMENT
Value: sandbox
Environments: ✅ Production ✅ Preview ✅ Development
```

#### **4. Pi API Key**
```
Name:  VITE_PI_API_KEY
Value: yggncprmynziskdawv59oxn7azds4ikolzjounw2nr1memfj3v4vusdbbsgghkk5
Environments: ✅ Production ✅ Preview ✅ Development
```

---

### **Step 3: Legacy Support (Optional)**

Add these for backward compatibility:

#### **5. Legacy API URL**
```
Name:  REACT_APP_API_URL
Value: https://chordypi-backend.up.railway.app/api
Environments: ✅ Production ✅ Preview ✅ Development
```

#### **6. Legacy Pi App ID**
```
Name:  REACT_APP_PI_APP_ID
Value: chordypi
Environments: ✅ Production ✅ Preview ✅ Development
```

#### **7. Legacy Pi Environment**
```
Name:  REACT_APP_PI_ENVIRONMENT
Value: sandbox
Environments: ✅ Production ✅ Preview ✅ Development
```

---

### **Step 4: Redeploy**

After adding all variables:
1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. ✅ Done!

---

## 🚂 Railway Variables (In Railway Dashboard)

### **Variables Tab:**

```
RAPIDAPI_KEY=[REDACTED_SECRET_RAPIDAPI]
PORT=5000
FLASK_ENV=production
PYTHONDONTWRITEBYTECODE=1
```

### **Settings Tab:**

```
Root Directory: server
```

---

## ✅ Checklist

- [ ] All 4 VITE_ variables added to Vercel
- [ ] All variables set for Production, Preview, Development
- [ ] Vercel redeployed
- [ ] Railway variables added
- [ ] Railway Root Directory set to `server`
- [ ] Railway deployed successfully

---

**After Railway deployment, update `VITE_API_URL` with your actual Railway URL!** 🚀
