import React from 'react';
import ChordyPiLogo from './ChordyPiLogo';
import '../../styles/global.css';

const Footer = () => {
    const handleSocialClick = (e, platform) => {
        e.preventDefault();
        alert(`🚧 ${platform} Coming Soon!\n\nWe're setting up our social media presence. Follow us soon for:\n\n✨ Guitar tutorials\n🎵 Chord tips & tricks\n🎸 New feature announcements\n🎶 Music theory lessons\n\nStay tuned! 🎵`);
    };

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
                    
                    {/* Social Media Icons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '15px',
                        fontSize: '24px'
                    }}>
                        <a 
                            href="#"
                            onClick={(e) => handleSocialClick(e, 'LinkedIn')}
                            style={{
                                color: '#888',
                                transition: 'color 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                border: '1px solid #555',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#0077B5'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                            title="LinkedIn - Coming Soon"
                        >
                            in
                        </a>
                        <a 
                            href="#"
                            onClick={(e) => handleSocialClick(e, 'Facebook')}
                            style={{
                                color: '#888',
                                transition: 'color 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                border: '1px solid #555',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#1877F2'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                            title="Facebook - Coming Soon"
                        >
                            f
                        </a>
                        <a 
                            href="#"
                            onClick={(e) => handleSocialClick(e, 'YouTube')}
                            style={{
                                color: '#888',
                                transition: 'color 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                border: '1px solid #555',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#FF0000'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                            title="YouTube - Coming Soon"
                        >
                            ▶
                        </a>
                        <a 
                            href="#"
                            onClick={(e) => handleSocialClick(e, 'Twitter/X')}
                            style={{
                                color: '#888',
                                transition: 'color 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                border: '1px solid #555',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#1DA1F2'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                            title="X (Twitter) - Coming Soon"
                        >
                            𝕏
                        </a>
                        <a 
                            href="#"
                            onClick={(e) => handleSocialClick(e, 'Instagram')}
                            style={{
                                color: '#888',
                                transition: 'color 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                border: '1px solid #555',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#E4405F'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                            title="Instagram - Coming Soon"
                        >
                            ⓘ
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;