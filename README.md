# 🎸 ChordsLegend - AI Chord Analysis + Pi Network Integration

> **Professional chord detection** that combines YouTube video playback with real-time AI chord analysis, interactive horizontal fretboards, and Pi Network blockchain payments.

[![React](https://img.shields.io/badge/React-17-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-green.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0-black.svg)](https://flask.palletsprojects.com/)
[![Pi Network](https://img.shields.io/badge/Pi%20Network-Integrated-purple.svg)](https://minepi.com/)

---

## ✨ Key Features

### 🎵 **Enhanced Chord Analysis**
- AI-powered chord detection using **Librosa + FFmpeg**
- Analyzes any YouTube video for chord progressions
- **276-chord resolution** with smart grouping (358 → ~60 chords)
- Key signature detection + music theory filtering
- Real-time synchronization with video playback

### 🎸 **Demo-Quality Horizontal Fretboards**
- Professional **horizontal guitar fretboards** (matching demo standard)
- Interactive **click-to-seek** chord progression timeline
- **Current + Next chord showcase** with finger position guidance
- Wooden gradient styling with gold/purple accents
- **Auto-scroll** with playback synchronization
- **150+ chord patterns** built-in (C, G, D, A, E, F, B, maj7, m7, 7th, sus, add9, 6th variants)

### 🔐 **User Authentication**
- Secure JWT-based authentication
- **Pi Network integration** for blockchain payments
- User library for saved songs and favorites
- Search history tracking

### 🎨 **Unified Design System**
- Glassmorphism UI with purple/gold color scheme
- Responsive design (desktop, tablet, mobile)
- Dark mode optimized
- Consistent components across all pages

---

## 🚀 Quick Start

### **Prerequisites**
- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 14+** ([Download](https://nodejs.org/))
- **FFmpeg** ([Installation Guide](https://ffmpeg.org/download.html))

### **Option 1: Simplified Startup Script** (Recommended)
```bash
# Clone repository
git clone <repository-url>
cd ChordsLegend

# Run automated startup
python start-server.py
```

The script will:
1. Check for Python, Node.js, and npm
2. Optionally install dependencies
3. Start Flask backend (port 5000) + React dev server (port 3000)
4. Open http://localhost:3000 in your browser

### **Option 2: Manual Setup**
```bash
# 1. Install backend dependencies
cd server
pip install -r requirements.txt

# 2. Install frontend dependencies
cd ../client
npm install

# 3. Start backend (Terminal 1)
cd ../server
python app.py

# 4. Start frontend (Terminal 2)
cd ../client
npm start

# 5. Open http://localhost:3000
```

---

## 📁 Project Structure (Consolidated)

```
ChordsLegend/
├── start-server.py          # ✅ Simplified startup script
├── ARCHITECTURE.md          # ✅ Technical architecture documentation
├── CONSOLIDATION_PLAN.md    # ✅ Consolidation roadmap
│
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── player/
│   │   │   │   └── ChordProgressionDisplay.jsx  # ✅ UNIFIED fretboard system
│   │   │   ├── home/        # Homepage components
│   │   │   ├── auth/        # Authentication UI
│   │   │   └── common/      # Shared components
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── PlayerPage.jsx      # ✅ CONSOLIDATED (no duplicate fretboards)
│   │   │   ├── AuthPage.jsx
│   │   │   ├── LibraryPage.jsx
│   │   │   └── JudgeDemoPage.jsx
│   │   ├── styles/
│   │   │   ├── tokens.css          # Design system tokens
│   │   │   └── components/
│   │   │       ├── chord-progression-pro.css  # ✅ Horizontal fretboard styles
│   │   │       └── player.css
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API layer
│   │   └── App.jsx          # ✅ SIMPLIFIED routing (7 routes)
│   ├── webpack.config.js
│   └── package.json
│
├── server/                  # Python Flask backend
│   ├── app.py               # Main Flask application
│   ├── routes/              # API endpoints
│   │   ├── auth.py          # User authentication
│   │   ├── songs.py         # ✅ CONSOLIDATED song routes
│   │   ├── analysis.py      # Chord detection engine
│   │   ├── search.py        # YouTube search
│   │   ├── library.py       # User library
│   │   ├── favorites.py     # Favorites system
│   │   ├── search_history.py
│   │   └── pi.py            # Pi Network integration
│   ├── models/              # Database models
│   ├── utils/
│   │   ├── chord_analyzer.py       # ✅ ENHANCED (276-chord resolution)
│   │   ├── audio_processor.py      # FFmpeg processing
│   │   └── auth_middleware.py      # JWT validation
│   ├── requirements.txt
│   └── instance/            # SQLite database
│
└── DELETED (Consolidated):  # ❌ Removed for simplicity
    ├── server.js            # Old Node.js middleware
    ├── start-dual-servers.js # Old startup script
    ├── FretboardDisplay.jsx # Old vertical fretboards
    ├── FretboardHighlight.jsx
    └── Debug components     # YouTubeDebug, SimpleYouTubeTest, etc.
```

---

## 🎯 Core Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 17 | UI components + routing |
| | Webpack 5 | Bundling + Hot Module Replacement |
| | CSS Custom Properties | Design system tokens |
| **Backend** | Python Flask | REST API server |
| | Librosa | Audio analysis + chord detection |
| | FFmpeg | Audio processing |
| | SQLAlchemy | Database ORM |
| | JWT | Token-based authentication |
| **External APIs** | YouTube Data API | Video search |
| | yt-dlp | Audio extraction |
| | Pi Network SDK | Blockchain payments |
| **Database** | SQLite | Development database |

---

## 🔥 What's New (v2.0 - Post-Consolidation)

### ✅ **Component Unification**
- **ONE fretboard component** (ChordProgressionDisplay) - removed 3 duplicates
- **Unified player page** - removed old vertical fretboards
- **Demo-quality horizontal fretboards** everywhere

### ✅ **Route Simplification**
- **7 essential routes** (down from 12)
- Removed duplicate auth routes (`/signin`, `/signup` → `/auth`)
- Removed duplicate demo routes (`/demo-judge`, `/hackathon-demo` → `/demo`)
- Removed all debug routes (`/test`, `/youtube-debug`, `/graphics-showcase`)

### ✅ **Server Consolidation**
- **2 servers** (Flask + React dev) - removed Node.js middleware
- Deleted `server.js`, `start-dual-servers.js`, `ssl/` folder
- Simplified startup with `start-server.py`

### ✅ **Code Cleanup**
- **Removed 400+ lines** of debug/duplicate code
- **Unified design system** across all components
- **Single source of truth** for chord visualization

---

## 📖 Usage Guide

### **1. Search for a Song**
- Open http://localhost:3000
- Use the search bar to find any song on YouTube
- Select a song from search results

### **2. Analyze Chords**
- Click "Analyze" on a song card
- Wait for AI chord detection (~15-30 seconds)
- View real-time analysis progress

### **3. Play & Learn**
- Video plays in YouTube player
- **Horizontal fretboards** show current + next chord
- **Timeline** displays full progression with click-to-seek
- **Auto-scroll** keeps current chord in view

### **4. Save to Library**
- Sign in with your account or Pi Network
- Click "Add to Library" to save analyzed songs
- Toggle favorites with the ❤️ button
- Access your library from the navigation menu

---

## 🎸 Chord Analysis Deep Dive

### **Enhanced Algorithm**
1. **Download**: yt-dlp extracts audio from YouTube video
2. **Process**: FFmpeg converts to WAV format for analysis
3. **Analyze**: Librosa chromagram extraction + beat tracking
4. **Detect**: AI chord detection with music theory filtering
5. **Group**: Smart grouping (major/minor/7th/sus families)
6. **Output**: ~60-100 chords per song (from 358 raw detections)

### **Supported Chord Types**
- **Major**: C, G, D, A, E, F, B, F#, C#, G#, D#, A#
- **Minor**: Am, Em, Dm, Bm, F#m, C#m, G#m, D#m, A#m
- **7th Chords**: C7, G7, D7, A7, E7, F7, B7, Cmaj7, Gmaj7, Dmaj7
- **Minor 7th**: Am7, Em7, Dm7, Bm7, F#m7, C#m7
- **Suspended**: Csus2, Csus4, Gsus2, Gsus4, Dsus2, Dsus4
- **Add9**: Cadd9, Gadd9, Dadd9, Aadd9, Eadd9
- **6th Chords**: C6, G6, D6, A6, Am6, Em6

---

## 🔐 Authentication & Pi Network

### **Standard Authentication**
- **Signup**: Create account with username, email, password
- **Signin**: JWT token authentication (7-day expiry)
- **Protected Routes**: Library, favorites, profile

### **Pi Network Integration**
- **Pi Browser Detection**: Automatically detects Pi SDK
- **Pi Authentication**: One-click signin with Pi Network account
- **Pi Payments**: Unlock premium features (chord transposition, MIDI export, offline mode)
- **Blockchain Verified**: Payments verified on Pi Network blockchain

---

## 🌐 API Endpoints

### **Authentication**
```
POST /signup               Create new user
POST /signin               Login with credentials
GET /profile               Get user profile (JWT required)
```

### **Songs**
```
GET /api/songs             List all songs
GET /api/songs/<id>        Get song by ID
POST /api/songs            Create new song (JWT required)
PUT /api/songs/<id>        Update song (JWT required)
DELETE /api/songs/<id>     Delete song (JWT required)
```

### **Analysis**
```
POST /api/analyze-song     Analyze YouTube video for chords
  Body: { "youtube_url": "https://youtube.com/watch?v=..." }
  Returns: { "chords": [...], "key": "C major", "tempo": 120 }
```

### **Library**
```
POST /api/library/add                Add song to library
GET /api/library/recent              Recent songs
GET /api/library/saved               Saved songs
GET /api/library/favorites           Favorite songs
POST /api/library/toggle-favorite    Toggle favorite
DELETE /api/library/remove           Remove from library
```

### **Pi Network**
```
POST /api/pi/authenticate   Authenticate Pi user
POST /api/pi/payment        Process Pi payment
```

---

## 🛠️ Development

### **Run Tests**
```bash
# Backend tests
cd server
pytest

# Frontend tests
cd client
npm test
```

### **Build for Production**
```bash
# Build React app
cd client
npm run build

# Built files in: server/web-build/
# Flask serves static files + API on single port
```

### **Environment Variables**
```bash
# .env file
FLASK_ENV=production
DATABASE_URL=sqlite:///instance/chordslegend.db
JWT_SECRET_KEY=<random-secret-key>
PI_NETWORK_API_KEY=<pi-api-key>
YOUTUBE_API_KEY=<youtube-api-key>
```

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture deep dive
- **[CONSOLIDATION_PLAN.md](./CONSOLIDATION_PLAN.md)** - Consolidation roadmap
- **[ENHANCEMENT_PROGRESS.md](./ENHANCEMENT_PROGRESS.md)** - Session progress tracking

---

## 🚀 Deployment

### **Local Development**
```bash
python start-server.py
```

### **Production (Example - Heroku)**
```bash
# 1. Build React
cd client && npm run build && cd ..

# 2. Configure Flask to serve static files (already done)
# 3. Deploy to Heroku
heroku create chordslegend
git push heroku main

# 4. Set environment variables
heroku config:set JWT_SECRET_KEY=<secret>
heroku config:set PI_NETWORK_API_KEY=<api-key>
```

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Style**
- **React**: Functional components with hooks, PropTypes
- **Python**: PEP 8, type hints, docstrings
- **CSS**: BEM methodology, design tokens

---

## 📝 License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Librosa** - Audio analysis library
- **FFmpeg** - Audio processing
- **React** - UI framework
- **Flask** - Python web framework
- **Pi Network** - Blockchain payment integration
- **YouTube** - Video hosting + search API

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/chordslegend/issues)
- **Documentation**: Check `ARCHITECTURE.md` for technical details
- **Updates**: See `CONSOLIDATION_PLAN.md` for recent changes

---

**Made with ❤️ for musicians everywhere**

🎸 **ChordsLegend** - Learn any song, one chord at a time.

---

**Version**: 2.0 (Post-Consolidation)  
**Last Updated**: October 1, 2025  
**Status**: ✅ Production-Ready