# Pi Network Browser Testing Guide

## 🌐 **Making Your Local Server Accessible**

### **Option A: Same WiFi Network**

1. **Find Your Computer's IP Address:**
```bash
# Windows
ipconfig
# Look for "IPv4 Address" under your WiFi adapter
# Example: 192.168.1.100

# Mac/Linux  
ifconfig
# Look for inet address
```

2. **Start Your Development Server:**
```bash
# React Frontend (make sure it binds to all interfaces)
npm start -- --host 0.0.0.0

# Or modify package.json:
"start": "react-scripts start --host 0.0.0.0"

# Python Backend
python app.py --host 0.0.0.0 --port 5000
```

3. **Access from Pi Browser:**
```
http://192.168.1.100:3000
# Replace with your actual IP address
```

### **Option B: ngrok Tunnel (Recommended)**

1. **Install ngrok:**
```bash
# Download from https://ngrok.com/
# Or use npm
npm install -g ngrok
```

2. **Create Tunnel to Your React App:**
```bash
# Terminal 1: Start your React app
npm start

# Terminal 2: Create ngrok tunnel
ngrok http 3000
```

3. **Access Public URL:**
```
# ngrok will provide a public URL like:
https://abc123.ngrok.io
# Use this URL in Pi Browser
```

### **Option C: Local Network with Port Forwarding**

1. **Configure Router:**
- Access your router admin panel
- Forward port 3000 to your computer's IP
- Use your public IP + port 3000

2. **Security Warning:**
- Only for testing
- Don't expose production servers this way

## 📱 **Pi Browser Testing Steps**

### **Step 1: Open Pi Browser**
```
Pi Network App → Menu → Pi Browser
```

### **Step 2: Navigate to Your App**
```
Enter your URL:
- Local: http://192.168.1.100:3000
- ngrok: https://abc123.ngrok.io
- Public: http://your-public-ip:3000
```

### **Step 3: Test Pi Network Features**
```javascript
// Your app will detect Pi SDK automatically
if (window.Pi) {
    console.log("✅ Pi Network SDK detected!");
    // All Pi Network features will work
} else {
    console.log("❌ Pi SDK not available");
    // Fallback to mock mode
}
```

## 🔒 **Pi Network Authentication Flow**

### **Real Authentication Process:**
```javascript
// 1. Initialize Pi SDK
await window.Pi.init({
    version: "2.0",
    sandbox: true  // Use sandbox for testing
});

// 2. Authenticate User
const auth = await window.Pi.authenticate({
    scopes: ['username', 'payments'],
    onIncompletePaymentFound: (payment) => {
        console.log('Found incomplete payment:', payment);
    }
});

// 3. User Info Available
console.log('Pi User:', auth.user.username);
console.log('Access Token:', auth.accessToken);
```

### **Payment Testing:**
```javascript
// Create test payment
const payment = await window.Pi.createPayment({
    amount: 1.0,
    memo: "ChordsLegend Annual Subscription",
    metadata: { 
        feature: 'annualSubscription',
        userId: 'test-user-123'
    }
});

console.log('Payment Created:', payment.identifier);
```

## 🧪 **Testing Scenarios**

### **Scenario 1: New User Flow**
```
1. Open app in Pi Browser
2. Click "Connect Pi Network"
3. Grant permissions in Pi Network
4. See premium features (locked)
5. Try to analyze 4th song → see limit message
6. Click "Upgrade to Annual" 
7. Complete Pi payment
8. Verify features unlock
```

### **Scenario 2: Returning User**
```
1. Open app (Pi connection restored)
2. See premium status if previously purchased
3. Test unlimited song analysis
4. Verify no ads between songs
```

### **Scenario 3: Payment Recovery**
```
1. Start payment but don't complete
2. Return to app later
3. Pi SDK should detect incomplete payment
4. Complete or cancel the payment
```

## 📊 **Testing Checklist**

### **Pi SDK Integration:**
- [ ] Pi Network detection works
- [ ] Authentication flow completes
- [ ] User data is retrieved correctly
- [ ] Access tokens are valid

### **Payment System:**
- [ ] Payment creation works
- [ ] Payment amounts are correct
- [ ] Metadata is properly attached
- [ ] Backend receives payment verification

### **Feature Unlocking:**
- [ ] Individual features unlock correctly
- [ ] Annual subscription unlocks all features
- [ ] Persistent storage works between sessions
- [ ] Feature gates work properly

### **User Experience:**
- [ ] Daily limits enforce correctly (3 songs)
- [ ] Ads show between songs for free users
- [ ] Usage tracker displays accurate data
- [ ] Upgrade prompts appear at right times

## 🔧 **Debugging Tools**

### **Browser Developer Tools:**
```javascript
// Check Pi SDK availability
console.log('Pi SDK:', window.Pi);

// Check current authentication
console.log('Pi User:', localStorage.getItem('piNetworkUser'));

// Check premium features
console.log('Features:', localStorage.getItem('premiumFeatures'));

// Check daily usage
const today = new Date().toDateString();
console.log('Today Usage:', localStorage.getItem(`analysis_usage_${today}`));
```

### **Network Tab:**
- Monitor API calls to your backend
- Check Pi Network API requests
- Verify payment webhooks (if implemented)

## ⚠️ **Common Issues & Solutions**

### **Issue 1: Pi SDK Not Loading**
```javascript
// Solution: Check Pi Browser version
// Ensure you're in Pi Browser, not regular browser
if (typeof window !== 'undefined' && window.Pi) {
    // Pi SDK available
} else {
    console.warn('Not in Pi Browser environment');
}
```

### **Issue 2: CORS Errors**
```javascript
// Backend: Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
```

### **Issue 3: Network Connection**
```bash
# Make sure firewall allows connections
# Windows Firewall
# Mac: System Preferences → Security & Privacy → Firewall

# Test connectivity
ping 192.168.1.100  # From your phone
```

## 🎯 **Production Testing**

### **Sandbox vs Production:**
```javascript
// Sandbox (for testing)
await window.Pi.init({
    version: "2.0",
    sandbox: true
});

// Production (real Pi payments)
await window.Pi.init({
    version: "2.0", 
    sandbox: false
});
```

### **Environment Variables:**
```env
# .env.development
REACT_APP_PI_NETWORK_SANDBOX=true
REACT_APP_API_BASE_URL=http://192.168.1.100:5000

# .env.production
REACT_APP_PI_NETWORK_SANDBOX=false
REACT_APP_API_BASE_URL=https://your-production-api.com
```

This testing approach gives you the most authentic experience and ensures your Pi Network integration works correctly with real Pi SDK functionality! 🚀