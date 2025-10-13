import React from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import PiNetworkAuth from './components/auth/PiNetworkAuth';
import HomePage from './pages/HomePage';
import PlayerPage from './pages/PlayerPage';
import ProfilePage from './pages/ProfilePage';
import LibraryPage from './pages/LibraryPage';
import JudgeDemoPage from './pages/JudgeDemoPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AnalyzingPage from './pages/AnalyzingPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import './styles/mobile-responsive.css';

// Top-right Sign Out Button Component
const TopSignOutButton = () => {
    const [user, setUser] = React.useState(null);
    
    React.useEffect(() => {
        // Check for user in localStorage
        const checkUser = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };
        
        checkUser();
        // Check periodically for changes
        const interval = setInterval(checkUser, 30000);
        return () => clearInterval(interval);
    }, []);
    
    const handleSignOut = async () => {
        try {
            // Clear all authentication data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('piNetworkUser');
            localStorage.removeItem('piNetworkAuth');
            
            // Redirect to home page (will show non-authenticated view)
            window.location.href = '/';
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    // Only show if user is authenticated
    if (!user) {
        return null;
    }

    return (
        <button 
            className="top-sign-out-button"
            onClick={handleSignOut}
            title={`Sign out ${user.username}`}
        >
            🚪 Sign Out
        </button>
    );
};

const AppContent = () => {
    const location = useLocation();
    const isPlayerPage = location.pathname === '/player';
    const isHomePage = location.pathname === '/' || location.pathname === '/home';
    const isDemoPage = location.pathname === '/demo' || location.pathname === '/demo-judge';
    const isSearchPage = location.pathname === '/search' || location.pathname === '/search-results';
    const isAnalyzingPage = location.pathname === '/analyzing';
    const isLibraryPage = location.pathname === '/library';

    // Debug: Log when sign out button should show
    console.log('🔍 Location:', location.pathname, '| Show Sign Out:', isHomePage && !isSearchPage && !isLibraryPage);

    return (
        <div className="app" style={{
            width: '100%',
            maxWidth: '100%',
            margin: '0',
            padding: '0'
        }}>
            {/* Top-right Sign Out Button - Only show on home page, not on search or library */}
            {isHomePage && !isSearchPage && !isLibraryPage && <TopSignOutButton />}
            
            {/* Hide header on player, home, demo, search, and analyzing pages for clean, focused experience */}
            {!isPlayerPage && !isHomePage && !isDemoPage && !isSearchPage && !isAnalyzingPage && <Header />}
            
            <main className="main-content" style={{
                width: '100%',
                maxWidth: '100%',
                margin: '0',
                padding: '0'
            }}>
                <Switch>
                    {/* Demo Routes */}
                    <Route path="/demo-judge" component={JudgeDemoPage} />
                    <Route path="/demo" component={JudgeDemoPage} />
                    
                    {/* Home Routes */}
                    <Route path="/home" component={HomePage} />
                    <Route path="/" exact component={HomePage} />
                    
                    {/* App Routes */}
                    <Route path="/analyzing" component={AnalyzingPage} />
                    <Route path="/player" component={PlayerPage} />
                    <Route path="/profile" component={ProfilePage} />
                    <Route path="/library" component={LibraryPage} />
                    <Route path="/search-results" component={SearchResultsPage} />
                    <Route path="/search" component={SearchResultsPage} />
                </Switch>
            </main>
            
            {/* Hide footer on player, home, demo, search, and analyzing pages for clean, focused experience */}
            {!isPlayerPage && !isHomePage && !isDemoPage && !isSearchPage && !isAnalyzingPage && <Footer />}
        </div>
    );
};

const App = () => {
    const [piAuthenticated, setPiAuthenticated] = React.useState(false);
    const [checkingAuth, setCheckingAuth] = React.useState(true);

    React.useEffect(() => {
        // Check if user is already authenticated
        const checkExistingAuth = () => {
            const piAuth = localStorage.getItem('piNetworkAuth');
            if (piAuth) {
                try {
                    const authData = JSON.parse(piAuth);
                    // Check if auth is still valid (less than 24 hours old)
                    const isValid = authData.timestamp && (Date.now() - authData.timestamp < 24 * 60 * 60 * 1000);
                    if (isValid) {
                        console.log('✅ Existing Pi authentication found');
                        setPiAuthenticated(true);
                    }
                } catch (e) {
                    console.error('Error parsing Pi auth:', e);
                }
            }
            setCheckingAuth(false);
        };

        checkExistingAuth();
    }, []);

    const handleAuthenticated = (user) => {
        console.log('✅ Pi user authenticated:', user);
        setPiAuthenticated(true);
    };

    // Show loading while checking auth
    if (checkingAuth) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{ color: 'white', fontSize: '20px' }}>
                    Loading ChordyPi...
                </div>
            </div>
        );
    }

    // Show Pi authentication screen if not authenticated
    if (!piAuthenticated) {
        return <PiNetworkAuth onAuthenticated={handleAuthenticated} />;
    }

    // Show main app if authenticated
    return (
        <PlayerProvider>
            <Router>
                <AppContent />
            </Router>
        </PlayerProvider>
    );
};

export default App;