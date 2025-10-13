# 🎯 ACTION REQUIRED: Add Your Pi Wallet Address

## What They Gave You

Pi Network provided you with a **wallet address** for your app. This is where payments will be sent when users pay with Pi.

---

## 📝 Where to Add It

### 1. Frontend - Local Development (`client/.env`)

**Replace** `YOUR_WALLET_ADDRESS_HERE` with your actual wallet address:

```bash
VITE_PI_WALLET_ADDRESS=YOUR_ACTUAL_WALLET_ADDRESS
REACT_APP_PI_WALLET_ADDRESS=YOUR_ACTUAL_WALLET_ADDRESS
```

### 2. Frontend - Production (`client/.env.production`)

**Replace** `YOUR_WALLET_ADDRESS_HERE` with your actual wallet address:

```bash
VITE_PI_WALLET_ADDRESS=YOUR_ACTUAL_WALLET_ADDRESS
REACT_APP_PI_WALLET_ADDRESS=YOUR_ACTUAL_WALLET_ADDRESS
```

### 3. Backend - Railway Environment Variables

Go to **Railway Dashboard → Your Project → Variables** and add:

```
PI_WALLET_ADDRESS=YOUR_ACTUAL_WALLET_ADDRESS
PI_ENVIRONMENT=sandbox
```

### 4. Frontend - Vercel Environment Variables

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and add:

```
VITE_PI_WALLET_ADDRESS=YOUR_ACTUAL_WALLET_ADDRESS
REACT_APP_PI_WALLET_ADDRESS=YOUR_ACTUAL_WALLET_ADDRESS
```

---

## 🚀 After Adding Wallet Address

1. **Commit changes:**
   ```bash
   git add client/.env client/.env.production server/.env.example
   git commit -m "Add Pi Network wallet address configuration"
   git push
   ```

2. **Redeploy:**
   - Vercel will auto-redeploy from Git
   - Railway will auto-redeploy from Git

3. **Test in Pi Browser:**
   - Open your app
   - Authenticate with Pi
   - Try creating a test payment
   - Complete Step 10!

---

## 💡 Why You Need This

The wallet address tells Pi Network:
- ✅ Where to send Pi when users make payments
- ✅ Which app the payment belongs to
- ✅ How to verify payment authenticity

**Without it:** Payments will fail with errors

**With it:** Payments work smoothly ✨

---

## 🎮 Next: Complete Step 10

Once wallet address is configured:

1. Open app in Pi Browser (sandbox mode)
2. Authenticate with Pi account
3. Click "Donate" or trigger a payment
4. Approve payment in Pi dialog
5. Backend receives `/approve` call from Pi Network
6. Backend receives `/complete` call from Pi Network
7. ✅ Step 10 complete!

Good luck! 🎉
