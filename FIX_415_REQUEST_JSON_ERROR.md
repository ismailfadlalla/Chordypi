# Fix for 415 Error: "Did not attempt to load JSON data..."

## Problem
When uploading audio files, the backend was returning:
```
415 Unsupported Media Type: Did not attempt to load JSON data because the request Content-Type was not 'application/json'
```

## Root Cause
The issue was in `server/routes/analysis.py` line 22:

```python
# Old code - PROBLEMATIC
data = request.json or {}
```

When Flask tries to access `request.json` on a multipart/form-data request (file upload), it throws an error because the Content-Type isn't `application/json`.

## The Fix
Changed the code to check `request.is_json` before trying to access `request.json`:

```python
# New code - FIXED
if request.is_json:
    data = request.json or {}
else:
    # If not JSON and not a file upload, return error
    return jsonify({
        "status": "error",
        "error": "Request must be either JSON with song_name/url or multipart/form-data with audio file"
    }), 415
```

## What Changed
**File:** `server/routes/analysis.py`

1. Added check for `request.is_json` before accessing `request.json`
2. Added better error message for unsupported request types
3. Added debug logging to see request Content-Type and file fields

**Commit:** bc8071d - "Fix 415 error: Check request.is_json before accessing request.json"

## Testing
After this fix is deployed to Railway:

1. Go to https://chordypi.vercel.app
2. Upload an MP3/WAV file
3. Should now successfully analyze without 415 error
4. Backend logs will show:
   ```
   📥 Request Content-Type: multipart/form-data; boundary=...
   📥 Request has files: True
   📥 File fields: ['audio']
   ```

## Status
✅ Code fixed locally
✅ Committed to Git (bc8071d)
✅ Pushed to GitHub
⏳ Waiting for Railway auto-deploy (or manually trigger in Railway dashboard)

## Next Steps
1. Wait ~2-3 minutes for Railway to deploy
2. Test file upload on production
3. Verify chord analysis works with AI (90-95% accuracy)
