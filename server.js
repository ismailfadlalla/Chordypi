const express = require('express');
const https = require('https');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const selfsigned = require('selfsigned');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "'unsafe-eval'", 
                "*.pi.app",
                "https://www.youtube.com",
                "https://s.ytimg.com",
                "https://www.google.com",
                "https://www.gstatic.com"
            ],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "*.ytimg.com", "*.youtube.com"],
            connectSrc: [
                "'self'", 
                "*.pi.app", 
                "*.youtube.com", 
                "*.googleapis.com", 
                "http://localhost:5000", 
                "https://localhost:3443"
            ],
            frameSrc: [
                "'self'",
                "https://www.youtube.com",
                "https://www.youtube-nocookie.com"
            ],
            childSrc: [
                "'self'",
                "https://www.youtube.com",
                "https://www.youtube-nocookie.com"
            ]
        }
    }
}));

app.use(cors({
    origin: ['https://localhost:3001', 'https://127.0.0.1:3001'],
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Pi Network Authentication endpoint
app.post('/api/pi/authenticate', (req, res) => {
    const { accessToken, user } = req.body;
    
    if (!accessToken || !user) {
        return res.status(400).json({ error: 'Missing access token or user data' });
    }
    
    // In production, verify the token with Pi Network's backend
    console.log('Pi Network Authentication:', { user: user.username, uid: user.uid });
    
    res.json({
        success: true,
        user: {
            id: user.uid,
            username: user.username,
            piBalance: 100 // Mock balance for demo
        }
    });
});

// Pi Network Payment endpoint
app.post('/api/pi/payment', (req, res) => {
    const { amount, memo, metadata } = req.body;
    
    console.log('Pi Network Payment Request:', { amount, memo, metadata });
    
    // Return mock payment identifier for demo
    res.json({
        success: true,
        paymentId: 'mock_payment_' + Date.now(),
        amount: amount,
        memo: memo
    });
});

// YouTube API proxy
app.get('/api/youtube/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter required' });
    }
    
    // Mock YouTube response for demo
    res.json({
        items: [
            {
                id: { videoId: 'mock_video_id' },
                snippet: {
                    title: `Guitar lesson for: ${query}`,
                    description: 'Learn to play this song on guitar',
                    thumbnails: {
                        default: { url: 'https://via.placeholder.com/120x90' }
                    }
                }
            }
        ]
    });
});

// Featured songs API endpoint
app.get('/api/featured-songs', (req, res) => {
    const featuredSongs = [
        {
            id: 1,
            title: "Wonderwall",
            artist: "Oasis",
            difficulty: "Beginner",
            chords: ["G", "D", "Em", "C"],
            thumbnail: "https://img.youtube.com/vi/bx1Bh8ZvH84/mqdefault.jpg",
            youtubeId: "bx1Bh8ZvH84",
            category: "Pop Rock"
        },
        {
            id: 2,
            title: "Hotel California",
            artist: "Eagles",
            difficulty: "Intermediate",
            chords: ["Am", "E", "G", "D", "F", "C", "Dm"],
            thumbnail: "https://img.youtube.com/vi/BciS5krYL80/mqdefault.jpg",
            youtubeId: "BciS5krYL80",
            category: "Classic Rock"
        },
        {
            id: 3,
            title: "Shape of You",
            artist: "Ed Sheeran",
            difficulty: "Beginner",
            chords: ["Am", "F", "C", "G"],
            thumbnail: "https://img.youtube.com/vi/JGwWNGJdvx8/mqdefault.jpg",
            youtubeId: "JGwWNGJdvx8",
            category: "Pop"
        },
        {
            id: 4,
            title: "Stairway to Heaven",
            artist: "Led Zeppelin",
            difficulty: "Advanced",
            chords: ["Am", "C", "D", "F", "G", "Em"],
            thumbnail: "https://img.youtube.com/vi/QkF3oxziUI4/mqdefault.jpg",
            youtubeId: "QkF3oxziUI4",
            category: "Classic Rock"
        },
        {
            id: 5,
            title: "Perfect",
            artist: "Ed Sheeran",
            difficulty: "Beginner",
            chords: ["G", "Em", "C", "D"],
            thumbnail: "https://img.youtube.com/vi/2Vv-BfVoq4g/mqdefault.jpg",
            youtubeId: "2Vv-BfVoq4g",
            category: "Pop"
        }
    ];
    
    res.json(featuredSongs);
});

// Test authentication page
app.get('/test-auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-auth.html'));
});

// Logout route - redirects to React app logout
app.get('/logout', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Logging Out...</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    background: linear-gradient(135deg, #6c5ce7, #a855f7);
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                }
                .logout-container {
                    text-align: center;
                    background: rgba(255,255,255,0.1);
                    padding: 40px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
                .spinner {
                    animation: spin 1s linear infinite;
                    display: inline-block;
                    margin-right: 10px;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="logout-container">
                <h1><span class="spinner">🔄</span>Signing Out...</h1>
                <p>Clearing authentication data...</p>
                <p>Redirecting to sign in page...</p>
            </div>
            <script>
                // Clear all authentication data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('piNetworkUser');
                localStorage.removeItem('piNetworkAuth');
                localStorage.removeItem('users');
                
                console.log('🚪 Logout: Cleared all authentication data');
                
                // Redirect to signin page
                setTimeout(() => {
                    window.location.href = '/signin';
                }, 1500);
            </script>
        </body>
        </html>
    `);
});

// Catch all handler: send back React's index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Generate self-signed certificate for HTTPS (required by Pi Network)
console.log('🔐 Generating SSL certificate for Pi Network...');
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

const httpsOptions = {
    key: pems.private,
    cert: pems.cert
};

// Start HTTPS server (Pi Network requirement)
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(HTTPS_PORT, () => {
    console.log(`🔒 HTTPS Server running on https://localhost:${HTTPS_PORT}`);
    console.log('✅ Pi Network integration ready');
    console.log('🎸 ChordyPi server started successfully');
    console.log('');
    console.log('🌐 Access your app at: https://localhost:3443');
    console.log('⚠️  Accept security warning for self-signed certificate');
    console.log('');
    console.log('📱 Pi Network endpoints available:');
    console.log('   POST /api/pi/authenticate');
    console.log('   POST /api/pi/payment');
    console.log('   GET /api/youtube/search');
});

// Redirect HTTP to HTTPS
const httpApp = express();
httpApp.use((req, res) => {
    res.redirect(301, `https://${req.headers.host.replace('3000', '3443')}${req.url}`);
});

const httpServer = http.createServer(httpApp);
const HTTP_REDIRECT_PORT = process.env.HTTP_PORT || 8080;

httpServer.listen(HTTP_REDIRECT_PORT, () => {
    console.log(`🔀 HTTP Server redirecting :8080 -> :3443 (HTTPS)`);
});

module.exports = app;