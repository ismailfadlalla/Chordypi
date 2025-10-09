# File Upload Flow Analysis - Route Mapping

## Current Flow Issues

### ✅ YouTube Song Analysis (WORKING)
```
User clicks "Analyze" on YouTube song
    ↓
HomePage/SearchResultsPage → onSongSelect(song)
    ↓
Navigate to /analyzing with state: { song }
    ↓
AnalyzingPage.jsx mounts
    ↓
Calls analyzeSong(song) from api.js
    ↓
POST /api/analyze-song with JSON: { song_name, url }
    ↓
Backend: analyze_song() → Downloads YouTube → AI Detection
    ↓
Returns: { chords, duration, key, etc. }
    ↓
AnalyzingPage shows overlay (5 seconds minimum)
    ↓
Navigate to /player with chord data
    ↓
✅ SUCCESS - User sees chords with progression
```

### ❌ File Upload (BROKEN)
```
User uploads file in FileUploader
    ↓
FileUploader.jsx → onUpload(formData, fileName)
    ↓
SearchResultsPage.handleFileUpload()
    ↓
Calls analyzeUploadedAudio(formData, fileName) from api.js
    ↓
POST /api/analyze-song with FormData
    ↓
❌ BACKEND ISSUE: request.files is empty or not detected
    ↓
Falls through to JSON parsing
    ↓
Throws 415 error: "Did not attempt to load JSON data..."
    ↓
❌ FAILS - User sees error
```

## Root Causes

### Issue 1: File Upload Not Going Through AnalyzingPage
**Problem:** File upload directly calls API, doesn't show overlay

**Expected Flow:**
```
User uploads file
    ↓
Should navigate to /analyzing (with file data)
    ↓
AnalyzingPage should handle upload + analysis
    ↓
Show overlay while processing
    ↓
Navigate to /player
```

**Current Flow:**
```
User uploads file
    ↓
Directly calls API (NO OVERLAY)
    ↓
Tries to navigate with result
```

### Issue 2: Backend Not Detecting File Upload
**Problem:** `request.files` is empty or doesn't have 'audio' field

**Possible Causes:**
1. FormData not being sent correctly by browser
2. CORS or proxy stripping file data
3. Vercel → Railway proxy issue
4. Flask/Werkzeug configuration issue
5. File size limit being exceeded

## Routes Involved

### Frontend Routes
1. **SearchResultsPage.jsx** (line 332-346)
   - `handleFileUpload()` - Handles file upload
   - Should navigate to AnalyzingPage instead of calling API directly

2. **AnalyzingPage.jsx** (line 44-143)
   - Currently only handles YouTube songs
   - Needs to handle file uploads too

3. **api.js** (line 249-298)
   - `analyzeUploadedAudio()` - Sends FormData to backend
   - Currently sends directly, should be called FROM AnalyzingPage

### Backend Routes
1. **server/routes/analysis.py** (line 12-275)
   - `analyze_song()` - Main endpoint
   - Line 19: File detection check (NOT WORKING)
   - Line 275: `analyze_uploaded_file()` - Never being called

## Solution Required

### Fix 1: Update Frontend Flow
**Change SearchResultsPage.handleFileUpload:**
```javascript
const handleFileUpload = async (formData, fileName) => {
    // Instead of calling API directly:
    // const result = await analyzeUploadedAudio(formData, fileName);
    
    // Navigate to AnalyzingPage with file data:
    history.push('/analyzing', {
        song: {
            title: fileName,
            source: 'upload',
            fileData: formData,
            fileName: fileName
        }
    });
};
```

**Update AnalyzingPage to handle files:**
```javascript
// In AnalyzingPage.jsx, detect if song has fileData:
if (song.source === 'upload' && song.fileData) {
    // Upload and analyze
    const result = await analyzeUploadedAudio(song.fileData, song.fileName);
    // Then navigate to player
}
```

### Fix 2: Debug Backend File Detection
**Need to see Railway logs showing:**
- `request.files` content
- `request.content_type`
- Whether 'audio' field exists

**Current debug code deployed but not tested yet.**

## Next Steps

1. ✅ Added comprehensive debug logging (commit 48754c9)
2. ⏳ Wait for Railway deployment
3. 🔍 Test file upload and check Railway logs
4. 📝 Based on logs, fix backend file detection
5. 🔄 Update frontend to use AnalyzingPage flow
6. ✅ File uploads work with overlay like YouTube songs

## Backend Debug Output Expected

When file upload works, logs should show:
```
================================================================================
📨 ANALYZE_SONG ENDPOINT CALLED
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
request.files: <ImmutableMultiDict: [('audio', <FileStorage: 'song.mp3' ...>)]>
request.files bool: True
Files keys: ['audio']
  - File 'audio': <FileStorage: 'song.mp3' ('audio/mpeg')>
================================================================================
✅ File upload detected, calling analyze_uploaded_file()
================================================================================
🎵 ANALYZE_UPLOADED_FILE CALLED
📥 Request Content-Type: multipart/form-data; boundary=...
📥 Request.files keys: ['audio']
================================================================================
📁 Received file upload: song.mp3
💾 Saving to: /tmp/upload_12345_song.mp3
⏱️ Duration: 180.5s
🤖 Running AI chord detection on uploaded file...
✅ File analysis complete: 42 chords detected
```

When file upload fails, logs currently show:
```
Content-Type: ??? (need to see this)
request.files: ??? (likely empty)
request.files bool: False
Falls through to JSON parsing → 415 error
```
