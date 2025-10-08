# 🧪 ChordyPi Testing Guide

**Status:** Servers Running ✅
**Date:** October 6, 2025

---

## 🚀 Server Status

All three servers are now running:

| Server | URL | Status |
|--------|-----|--------|
| **React Dev** | https://localhost:3000 | ✅ Running |
| **Node.js HTTPS** | https://localhost:3443 | ✅ Running |
| **Python API** | https://localhost:5000 | ✅ Running |

⚠️ **Note:** You'll need to accept the security warning for self-signed SSL certificates.

---

## 🎯 Testing Priority List

### 1. **Test New Improvements First** (Most Important!)

#### A. Progressive Analysis Steps ⚡
**What to test:** 5-stage loading animation

**Steps:**
1. Open https://localhost:3000
2. Click "Search Songs" or use the search bar
3. Search for any song (e.g., "Hotel California")
4. Click "Analyze" button
5. **Watch carefully:** You should see:
   - 🔍 Searching database...
   - 🎵 Downloading audio...
   - 🤖 AI analyzing chords...
   - ✨ Validating results...
   - 🎸 Preparing player...
6. Progress bar should animate smoothly
7. Total time: ~5 seconds

**Expected Result:** ✅ All 5 steps appear in sequence with progress bar

**If it fails:** ❌ Check browser console for errors

---

#### B. Chord Quality Badge 🏅
**What to test:** Badge showing chord detection source

**Steps:**
1. After analysis completes, player page opens
2. Look at the header section (below song title)
3. You should see: "Key: [X] • [N] unique chords" **+ a colored badge**
4. Badge types:
   - ✅ **Database** (green) - For songs in database
   - 🤖 **AI** (indigo) - For newly analyzed songs
   - ≈ **Pattern** (amber) - For fallback detection

**Expected Result:** ✅ Badge appears next to song info

**Test different songs:**
- Database song: Search "Wonderwall" or "Hotel California"
- New song: Search something obscure
- Check badge color changes accordingly

---

#### C. Better Error Messages 💬
**What to test:** User-friendly error handling

**Steps to trigger errors:**
1. **Network Error:**
   - Disconnect internet
   - Try to analyze a song
   - Expected: "Couldn't download the song. Check your connection!"

2. **Invalid Video:**
   - Search for "asdfghjklzxcvbnm123456"
   - Click analyze
   - Expected: "Video unavailable. Trying with estimated chords..."

3. **Graceful Fallback:**
   - Even with errors, should navigate to player
   - Should NOT go back to search
   - Should show estimated chords

**Expected Result:** ✅ Friendly messages, no crashes, player loads anyway

---

### 2. **Core Feature Testing**

#### Search & Analysis
- [ ] Search bar accepts input
- [ ] Search results display correctly
- [ ] "Analyze" button works
- [ ] Featured songs display on homepage
- [ ] Can click featured songs to analyze

#### Player Functionality
- [ ] YouTube video loads and plays
- [ ] Play/Pause button works
- [ ] Current chord highlights in green
- [ ] Next chord shows in timeline
- [ ] Chords sync with video playback
- [ ] Timeline scrolls to keep current chord visible
- [ ] Seeking works (click on timeline)

#### Fretboard Display
- [ ] Fretboard shows correct chord fingerings
- [ ] Current chord displays prominently
- [ ] Next chord preview shows
- [ ] Finger positions are accurate
- [ ] Responsive to window size

#### Favorites System
- [ ] Can add song to favorites (heart icon)
- [ ] Favorites persist after refresh
- [ ] Can remove from favorites
- [ ] Favorites page shows saved songs

---

### 3. **Pi Network Integration**

⚠️ **Note:** Pi Network features require Pi Browser or sandbox mode

#### Authentication
- [ ] "Connect Pi Wallet" button appears
- [ ] Click triggers Pi authentication modal
- [ ] Can authenticate (in Pi Browser)
- [ ] User profile displays after auth

#### Payment Flow
- [ ] "Unlock Premium" button visible
- [ ] Click opens payment modal
- [ ] Payment amount shows correctly (0.1 π)
- [ ] Can complete payment (in sandbox/production)

---

### 4. **UI/UX Testing**

#### Responsive Design
- [ ] Resize browser window (desktop → mobile)
- [ ] All elements scale properly
- [ ] No horizontal scrolling
- [ ] Touch-friendly on mobile/tablet

#### Navigation
- [ ] "Back to Search" button works
- [ ] Browser back/forward buttons work
- [ ] URLs update correctly
- [ ] Direct links work (refresh page)

#### Visual Polish
- [ ] No layout shifts or jumps
- [ ] Smooth animations
- [ ] Colors are consistent
- [ ] Icons display correctly
- [ ] Loading states are clear

---

## 🐛 Common Issues & Solutions

### Issue: SSL Certificate Warning
**Solution:** Click "Advanced" → "Proceed to localhost (unsafe)"
- This is normal for self-signed certificates
- Only occurs in development

### Issue: React server won't start
**Solution:**
```powershell
cd E:\ChordyPiProject\ChordyPi\client
npm install
npm start
```

### Issue: Python server errors
**Solution:**
```powershell
cd E:\ChordyPiProject\ChordyPi\server
pip install -r requirements.txt
python app.py
```

### Issue: Analysis fails immediately
**Check:**
1. Python server is running (port 5000)
2. YouTube API key is set
3. FFmpeg is installed
4. Check browser console for errors

### Issue: Chords don't sync with video
**Check:**
1. Video is playing (not paused)
2. Browser console for timing errors
3. Chords array has valid time data

---

## 📊 Test Results Checklist

### Critical Features (Must Work)
- [ ] Progressive analysis steps show (NEW!)
- [ ] Quality badge displays (NEW!)
- [ ] Error messages are friendly (NEW!)
- [ ] Search works
- [ ] Analysis completes
- [ ] Player loads
- [ ] Video plays
- [ ] Chords sync

### Important Features (Should Work)
- [ ] Favorites system
- [ ] Fretboard display
- [ ] Timeline scrolling
- [ ] Seeking functionality
- [ ] Mobile responsive

### Nice-to-Have (Can Fix Later)
- [ ] Pi Network auth (requires Pi Browser)
- [ ] Payment flow
- [ ] All edge cases

---

## 🎬 Recording Demo for Hackathon

**Recommended Flow:**
1. Start on homepage (show branding)
2. Search for popular song
3. **Highlight progressive steps** (camera on this!)
4. **Point out quality badge** when player loads
5. Play video + show chord sync
6. Demonstrate fretboard
7. Try to trigger error (show graceful handling)
8. Show favorites system
9. Mention Pi Network integration

**Duration:** 2-3 minutes max

---

## ✅ Sign-Off Criteria

Before deploying to Vercel, ensure:

### Must Have ✅
- [ ] All 3 new improvements work
- [ ] No console errors on homepage
- [ ] Can analyze at least one song successfully
- [ ] Video plays and syncs
- [ ] Mobile responsive (test on phone if possible)

### Nice to Have
- [ ] All database songs work
- [ ] Error handling tested
- [ ] Pi Network features tested (if in Pi Browser)

---

## 🚦 Next Steps

**If all tests pass:**
1. Stop servers (Ctrl+C in terminal)
2. Deploy to Vercel: `vercel --prod`
3. Test deployed version
4. Submit to Pi Hackathon

**If issues found:**
1. Note which features fail
2. Check browser console
3. Check server logs
4. Fix issues before deployment

---

## 📝 Test Notes

Use this space to record your test results:

```
Test Date: ___________
Tester: ___________

Progressive Steps: ✅ / ❌
Notes: _________________________________

Quality Badge: ✅ / ❌
Notes: _________________________________

Error Messages: ✅ / ❌
Notes: _________________________________

Core Features: ✅ / ❌
Notes: _________________________________

Ready for Deployment: YES / NO
```

---

**Happy Testing! 🎸🚀**

Stop servers: Press Ctrl+C in the terminal
