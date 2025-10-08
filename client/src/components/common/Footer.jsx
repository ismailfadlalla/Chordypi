import React from 'react';
import '../../styles/global.css';

const Footer = () => {
    return (
        <footer className="footer" style={{
            width: '100%',
            maxWidth: 'none',
            margin: '0',
            padding: '20px 0',
            boxSizing: 'border-box',
            backgroundColor: '#282c34'
        }}>
            <div className="footer-content" style={{
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '10px 20px',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <p style={{ margin: '0' }}>&copy; {new Date().getFullYear()} ChordyPi. All rights reserved.</p>
                <div className="social-media">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;