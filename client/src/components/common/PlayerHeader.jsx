import React from 'react';
import '../../styles/global.css';

const PlayerHeader = () => {
    return (
        <header className="header" style={{
            width: '100%',
            backgroundColor: '#282c34',
            padding: '0',
            margin: '0',
            borderBottom: '2px solid #61dafb'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '15px 20px',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div className="logo" style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#61dafb'
                }}>
                    🎸 ChordyPi
                </div>
                
                <nav className="nav">
                    <ul style={{
                        display: 'flex',
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        gap: '20px'
                    }}>
                        <li>
                            <a 
                                href="/" 
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    padding: '8px 16px',
                                    backgroundColor: '#61dafb',
                                    borderRadius: '5px',
                                    fontSize: '14px'
                                }}
                            >
                                🏠 Home
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default PlayerHeader;