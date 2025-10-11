import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';

const PrivacyPolicyPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white',
            paddingTop: '60px'
        }}>
            {/* Header */}
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '40px 20px'
            }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        marginBottom: '30px',
                        fontSize: '16px'
                    }}
                >
                    ← Back to Home
                </button>

                <h1 style={{
                    fontSize: '3rem',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '10px'
                }}>
                    Privacy Policy
                </h1>
                <p style={{ color: '#888', marginBottom: '40px' }}>
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                {/* Content */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '15px',
                    padding: '40px',
                    lineHeight: '1.8'
                }}>
                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>1. Introduction</h2>
                        <p>
                            Welcome to ChordyPi. We respect your privacy and are committed to protecting your personal data. 
                            This privacy policy explains how we collect, use, and safeguard your information when you use our AI-powered 
                            chord analysis service.
                        </p>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>2. Information We Collect</h2>
                        <h3 style={{ color: '#6c5ce7', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>
                            2.1 Pi Network Information
                        </h3>
                        <p>
                            When you authenticate with Pi Network, we collect:
                        </p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Pi Network username</li>
                            <li>Pi Network user ID (UID)</li>
                            <li>Authentication tokens</li>
                        </ul>

                        <h3 style={{ color: '#6c5ce7', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>
                            2.2 Usage Data
                        </h3>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Songs analyzed (YouTube URLs or uploaded files)</li>
                            <li>Chord analysis results</li>
                            <li>Saved songs and favorites</li>
                            <li>Device and browser information</li>
                        </ul>

                        <h3 style={{ color: '#6c5ce7', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>
                            2.3 Audio Files
                        </h3>
                        <p>
                            Uploaded audio files are processed temporarily for chord analysis and deleted after processing. 
                            We do not permanently store your audio files.
                        </p>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>3. How We Use Your Information</h2>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Provide AI-powered chord analysis services</li>
                            <li>Authenticate users via Pi Network</li>
                            <li>Save user preferences and favorites</li>
                            <li>Improve our AI detection algorithms</li>
                            <li>Process Pi cryptocurrency payments for premium features</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>4. Data Storage and Security</h2>
                        <p>
                            We use industry-standard security measures to protect your data:
                        </p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Encrypted connections (HTTPS/SSL)</li>
                            <li>Secure database storage</li>
                            <li>Regular security audits</li>
                            <li>Temporary audio file processing (deleted after analysis)</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>5. Third-Party Services</h2>
                        <p>We use the following third-party services:</p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li><strong>Pi Network:</strong> User authentication and payment processing</li>
                            <li><strong>YouTube API:</strong> Fetching video metadata (via RapidAPI)</li>
                            <li><strong>Vercel/Railway:</strong> Hosting infrastructure</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Access your personal data</li>
                            <li>Request data deletion</li>
                            <li>Opt-out of data collection</li>
                            <li>Export your saved songs and favorites</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>7. Cookies</h2>
                        <p>
                            We use essential cookies for:
                        </p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>User authentication</li>
                            <li>Session management</li>
                            <li>Saving user preferences</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>8. Contact Us</h2>
                        <p>
                            For privacy-related questions or data requests, contact us at:
                        </p>
                        <p style={{ marginTop: '10px' }}>
                            📧 Email: <a href="mailto:privacy@chordypi.com" style={{ color: '#61dafb' }}>privacy@chordypi.com</a><br />
                            💻 GitHub: <a href="https://github.com/ismailfadlalla/Chordypi/issues" target="_blank" rel="noopener noreferrer" style={{ color: '#61dafb' }}>Submit an Issue</a>
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
