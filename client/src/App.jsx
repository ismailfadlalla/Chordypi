import React from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import HomePage from './pages/HomePage';
import PlayerPage from './pages/PlayerPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import LibraryPage from './pages/LibraryPage';
import JudgeDemoPage from './pages/JudgeDemoPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AnalyzingPage from './pages/AnalyzingPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
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
    const isAuthPage = location.pathname === '/auth' || location.pathname === '/signup' || location.pathname === '/signin';
    const isDemoPage = location.pathname === '/demo' || location.pathname === '/demo-judge';
    const isSearchPage = location.pathname === '/search' || location.pathname === '/search-results';
    const isAnalyzingPage = location.pathname === '/analyzing';
    const isLibraryPage = location.pathname === '/library';
    const isLegalPage = location.pathname === '/privacy-policy' || location.pathname === '/terms-of-service';

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
            
            {/* Hide header on player, home, auth, demo, search, and analyzing pages - SHOW on legal pages */}
            {!isPlayerPage && !isHomePage && !isAuthPage && !isDemoPage && !isSearchPage && !isAnalyzingPage && <Header />}
            
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
                    
                    {/* Auth Routes */}
                    <Route path="/signup" component={AuthPage} />
                    <Route path="/signin" component={AuthPage} />
                    <Route path="/auth" component={AuthPage} />
                    
                    {/* App Routes */}
                    <Route path="/analyzing" component={AnalyzingPage} />
                    <Route path="/player" component={PlayerPage} />
                    <Route path="/profile" component={ProfilePage} />
                    <Route path="/library" component={LibraryPage} />
                    <Route path="/search-results" component={SearchResultsPage} />
                    <Route path="/search" component={SearchResultsPage} />
                    
                    {/* Legal Pages */}
                    <Route path="/privacy-policy" component={PrivacyPolicyPage} />
                    <Route path="/terms-of-service" component={TermsOfServicePage} />
                </Switch>
            </main>
            
            {/* Hide footer on player, home, auth, demo, search, and analyzing pages - SHOW on legal pages */}
            {!isPlayerPage && !isHomePage && !isAuthPage && !isDemoPage && !isSearchPage && !isAnalyzingPage && <Footer />}
        </div>
    );
};

const App = () => {
    return (
        <PlayerProvider>
            <Router>
                <AppContent />
            </Router>
        </PlayerProvider>
    );
};

export default App;