import React from 'react';
import '../../styles/global.css';

const Footer = () => {
    return (
        <footer className="footer" style={{
            width: '100%',
            maxWidth: 'none',
            margin: '0',
            padding: '30px 0',
            boxSizing: 'border-box',
            backgroundColor: '#282c34',
            borderTop: '2px solid #444'
        }}>
            <div className="footer-content" style={{
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '10px 20px',
                boxSizing: 'border-box'
            }}>
                {/* Main Footer Content */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '30px',
                    marginBottom: '20px'
                }}>
                    {/* Brand Section */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h3 style={{ 
                            color: '#61dafb', 
                            fontSize: '20px',
                            marginBottom: '10px' 
                        }}>
                            🎸 ChordyPi
                        </h3>
                        <p style={{ 
                            color: '#888', 
                            fontSize: '14px',
                            margin: '0'
                        }}>
                            AI-powered chord detection for musicians
                        </p>
                    </div>

                    {/* Legal Links - REQUIRED FOR PI NETWORK */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h4 style={{ 
                            color: '#fff', 
                            fontSize: '16px',
                            marginBottom: '10px' 
                        }}>
                            Legal
                        </h4>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <a 
                                href="/legal/terms-of-service.html" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    color: '#61dafb',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    transition: 'color 0.3s'
                                }}
                            >
                                📄 Terms of Service
                            </a>
                            <a 
                                href="/legal/privacy-policy.html" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    color: '#61dafb',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    transition: 'color 0.3s'
                                }}
                            >
                                🔒 Privacy Policy
                            </a>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h4 style={{ 
                            color: '#fff', 
                            fontSize: '16px',
                            marginBottom: '10px' 
                        }}>
                            Connect
                        </h4>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <a 
                                href="https://github.com/ismailfadlalla/Chordypi" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    color: '#61dafb',
                                    textDecoration: 'none',
                                    fontSize: '14px'
                                }}
                            >
                                💻 GitHub
                            </a>
                            <a 
                                href="https://github.com/ismailfadlalla/Chordypi/issues" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    color: '#61dafb',
                                    textDecoration: 'none',
                                    fontSize: '14px'
                                }}
                            >
                                💬 Support
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid #444',
                    paddingTop: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}>
                    <p style={{ 
                        margin: '0',
                        color: '#888',
                        fontSize: '14px'
                    }}>
                        &copy; {new Date().getFullYear()} ChordyPi. All rights reserved.                             v1.1.1
                    </p>
                    <p style={{ 
                        margin: '0',
                        color: '#888',
                        fontSize: '14px'
                    }}>
                        🥧 Pi Network Hackathon 2025
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;