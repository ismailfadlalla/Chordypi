import React from 'react';
import ChordyPiLogo from './ChordyPiLogo';
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
                        <div style={{ marginBottom: '10px' }}>
                            <ChordyPiLogo size="small" />
                        </div>
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
                                onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                                onMouseLeave={(e) => e.target.style.color = '#61dafb'}
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
                                onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                                onMouseLeave={(e) => e.target.style.color = '#61dafb'}
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
                    flexDirection: 'column',
                    gap: '15px'
                }}>
                    {/* Copyright */}
                    <p style={{ 
                        margin: '0',
                        color: '#888',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        &copy; {new Date().getFullYear()} ChordyPi. All rights reserved.
                    </p>
                    
                    {/* Social Media & Legal Links */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '20px',
                        flexWrap: 'wrap',
                        fontSize: '14px'
                    }}>
                        {/* Social Media */}
                        <a 
                            href="https://github.com/ismailfadlalla/Chordypi" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                color: '#61dafb',
                                textDecoration: 'none',
                                transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                            onMouseLeave={(e) => e.target.style.color = '#61dafb'}
                        >
                            GitHub
                        </a>
                        <span style={{ color: '#444' }}>•</span>
                        <a 
                            href="https://x.com/chordypi" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                color: '#61dafb',
                                textDecoration: 'none',
                                transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                            onMouseLeave={(e) => e.target.style.color = '#61dafb'}
                        >
                            X (Twitter)
                        </a>
                        <span style={{ color: '#444' }}>•</span>
                        <a 
                            href="/legal/privacy-policy.html" 
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#61dafb',
                                textDecoration: 'none',
                                transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                            onMouseLeave={(e) => e.target.style.color = '#61dafb'}
                        >
                            Privacy Policy
                        </a>
                        <span style={{ color: '#444' }}>•</span>
                        <a 
                            href="/legal/terms-of-service.html" 
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#61dafb',
                                textDecoration: 'none',
                                transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                            onMouseLeave={(e) => e.target.style.color = '#61dafb'}
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;