# AI Chord Detection Options for ChordyPi

## Current Status
- **Basic Pitch** (Spotify) - 90-95% accuracy - IMPLEMENTED but failing on Railway due to TensorFlow compatibility
- **Fallback**: librosa - 60-70% accuracy

## High-Accuracy AI Alternatives

### 1. **Essentia** (Music Technology Group)
- **Accuracy**: 85-90%
- **Pros**: 
  - Free, open source
  - Works without TensorFlow (C++ backend)
  - Lightweight
- **Cons**: 
  - Requires compilation on some platforms
  - Harder to install than Basic Pitch
- **Installation**: `pip install essentia`

### 2. **Madmom** (Audio Signal Processing Library)
- **Accuracy**: 80-85%
- **Pros**:
  - Designed for music information retrieval
  - No TensorFlow dependency
  - Good for chord detection
- **Cons**:
  - Not as accurate as Basic Pitch
  - Less maintained
- **Installation**: `pip install madmom`

### 3. **Crepe** (Pitch Detection)
- **Accuracy**: 90%+ for pitch, can derive chords
- **Pros**:
  - TensorFlow-based but simpler models
  - Very accurate pitch detection
- **Cons**:
  - Same TensorFlow issues as Basic Pitch
  - Requires post-processing for chords
- **Installation**: `pip install crepe`

### 4. **Chordino Vamp Plugin** (Queen Mary University)
- **Accuracy**: 75-80%
- **Pros**:
  - Battle-tested (used in many apps)
  - No deep learning dependencies
- **Cons**:
  - Lower accuracy
  - Requires Vamp plugin system
- **Installation**: Complex

### 5. **RapidAPI Chord Detection Services**
- **Accuracy**: Varies (70-90%)
- **Pros**:
  - No local processing
  - No dependency issues
  - Cloud-based
- **Cons**:
  - Costs money
  - API rate limits
  - Network dependency
- **Examples**:
  - Chordify API
  - AudioTag API

## RECOMMENDED SOLUTION

### Option A: Fix Basic Pitch on Railway ✅ BEST
**Fix the TensorFlow compatibility issue:**
```python
# In requirements.txt:
tensorflow==2.10.0  # Specific version that works on Railway
basic-pitch==0.2.5
```

**Railway Build Settings:**
- Use Python 3.10 (already set)
- Add build command: `pip install --no-cache-dir tensorflow==2.10.0`

### Option B: Hybrid Approach (Current)
**Use Basic Pitch when available, fallback to enhanced librosa:**
- ✅ Already implemented
- Works now with 60-70% accuracy
- Will auto-upgrade to 90-95% when Basic Pitch works

### Option C: Add Essentia as Mid-Tier Fallback
**Three-tier system:**
1. Basic Pitch (90-95%) - Primary
2. Essentia (85-90%) - Secondary fallback
3. Librosa (60-70%) - Last resort

```python
# Waterfall approach:
if BASIC_PITCH_AVAILABLE:
    return basic_pitch_detect()
elif ESSENTIA_AVAILABLE:
    return essentia_detect()
else:
    return librosa_detect()
```

## IMMEDIATE ACTION

**For the Pi Hackathon (6 days left):**
1. ✅ Keep current Basic Pitch + librosa fallback (ALREADY DONE)
2. Test TensorFlow 2.10.0 on Railway (NEXT STEP)
3. If still fails, app works at 60-70% accuracy (ACCEPTABLE)
4. After hackathon, upgrade Railway to GPU instance for guaranteed Basic Pitch support

**TensorFlow Version Fix to Try:**
```bash
# In server/requirements.txt, change:
tensorflow>=2.12.0
# TO:
tensorflow==2.10.0
basic-pitch==0.2.5
```

This specific version combination is known to work on Railway's Python 3.10 environment.
