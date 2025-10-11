import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';

const TermsOfServicePage = () => {
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
                    Terms of Service
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
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using ChordyPi ("the Service"), you accept and agree to be bound by these Terms of Service. 
                            If you do not agree to these terms, please do not use the Service.
                        </p>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>2. Description of Service</h2>
                        <p>
                            ChordyPi is an AI-powered guitar chord analysis tool that:
                        </p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Analyzes YouTube videos and uploaded audio files for chord progressions</li>
                            <li>Uses AI (Basic Pitch) for 90-95% chord detection accuracy</li>
                            <li>Provides interactive fretboard visualizations</li>
                            <li>Integrates with Pi Network for authentication and payments</li>
                            <li>Offers free and premium tiers</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>3. User Accounts</h2>
                        <h3 style={{ color: '#6c5ce7', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>
                            3.1 Pi Network Authentication
                        </h3>
                        <p>
                            Users must authenticate via Pi Network to access certain features. You are responsible for:
                        </p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Maintaining the security of your Pi Network account</li>
                            <li>All activities under your account</li>
                            <li>Notifying us immediately of unauthorized access</li>
                        </ul>

                        <h3 style={{ color: '#6c5ce7', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>
                            3.2 Account Termination
                        </h3>
                        <p>
                            We reserve the right to terminate accounts that violate these terms or engage in abusive behavior.
                        </p>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>4. Acceptable Use</h2>
                        <p>You agree NOT to:</p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Upload copyrighted material without permission</li>
                            <li>Abuse the API or attempt to overload the service</li>
                            <li>Reverse-engineer or copy our AI detection algorithms</li>
                            <li>Use the service for illegal purposes</li>
                            <li>Distribute malware or harmful content</li>
                            <li>Impersonate other users or entities</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>5. Intellectual Property</h2>
                        <h3 style={{ color: '#6c5ce7', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>
                            5.1 Our IP
                        </h3>
                        <p>
                            ChordyPi owns all rights to:
                        </p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>The ChordyPi platform and software</li>
                            <li>AI detection algorithms and implementations</li>
                            <li>Branding, logos, and design elements</li>
                            <li>Documentation and tutorials</li>
                        </ul>

                        <h3 style={{ color: '#6c5ce7', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>
                            5.2 User Content
                        </h3>
                        <p>
                            You retain ownership of uploaded audio files. By using the service, you grant us a limited license to:
                        </p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Process your files for chord analysis</li>
                            <li>Store analysis results</li>
                            <li>Use anonymized data to improve AI algorithms</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>6. Payments and Refunds</h2>
                        <h3 style={{ color: '#6c5ce7', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>
                            6.1 Pi Network Payments
                        </h3>
                        <p>
                            Premium features are purchased using Pi cryptocurrency via Pi Network's payment system.
                        </p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li><strong>Premium Access:</strong> 1π - Unlimited analysis + advanced features</li>
                            <li><strong>Ad Removal:</strong> 0.5π - Remove all advertisements</li>
                        </ul>

                        <h3 style={{ color: '#6c5ce7', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>
                            6.2 Refund Policy
                        </h3>
                        <p>
                            Pi cryptocurrency payments are final and non-refundable except in cases of:
                        </p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Technical errors preventing service access</li>
                            <li>Duplicate charges</li>
                            <li>Service discontinuation within 7 days of payment</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>7. Service Limitations</h2>
                        <h3 style={{ color: '#6c5ce7', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>
                            7.1 AI Accuracy
                        </h3>
                        <p>
                            While our AI achieves 90-95% accuracy, chord detection is not perfect. ChordyPi is a learning tool, not a replacement for professional music education.
                        </p>

                        <h3 style={{ color: '#6c5ce7', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>
                            7.2 Third-Party Content
                        </h3>
                        <p>
                            YouTube video analysis depends on third-party services (YouTube API, RapidAPI). We cannot guarantee 100% availability.
                        </p>

                        <h3 style={{ color: '#6c5ce7', fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>
                            7.3 Free Tier Limitations
                        </h3>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Limited analysis quota (500 free RapidAPI requests/month)</li>
                            <li>Advertisements may be displayed</li>
                            <li>Some advanced features restricted to premium users</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>8. Disclaimer of Warranties</h2>
                        <p>
                            ChordyPi is provided "AS IS" without warranties of any kind. We do not guarantee:
                        </p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Uninterrupted service</li>
                            <li>100% chord detection accuracy</li>
                            <li>Error-free operation</li>
                            <li>Compatibility with all devices/browsers</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>9. Limitation of Liability</h2>
                        <p>
                            ChordyPi and its developers are not liable for:
                        </p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Incorrect chord analysis results</li>
                            <li>Data loss or corruption</li>
                            <li>Third-party service failures (YouTube, Pi Network, etc.)</li>
                            <li>Consequential damages from service use</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>10. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of new terms.
                        </p>
                    </section>

                    <section style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>11. Contact Information</h2>
                        <p>
                            For questions about these Terms of Service:
                        </p>
                        <p style={{ marginTop: '10px' }}>
                            📧 Email: <a href="mailto:support@chordypi.com" style={{ color: '#61dafb' }}>support@chordypi.com</a><br />
                            💻 GitHub: <a href="https://github.com/ismailfadlalla/Chordypi" target="_blank" rel="noopener noreferrer" style={{ color: '#61dafb' }}>ChordyPi Repository</a><br />
                            🥧 Pi Network: <a href="https://minepi.com/chordypi" target="_blank" rel="noopener noreferrer" style={{ color: '#61dafb' }}>@chordypi</a>
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>12. Pi Network Hackathon</h2>
                        <p>
                            ChordyPi is a Pi Network Hackathon 2025 submission. By using this service during the hackathon period, 
                            you agree to provide feedback and understand the service is in active development.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TermsOfServicePage;
