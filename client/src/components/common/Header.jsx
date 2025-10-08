import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/global.css';

const Header = () => {
    return (
        <header className="header" style={{
            width: '100%',
            backgroundColor: '#282c34',
            padding: '0',
            margin: '0'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px 20px',
                boxSizing: 'border-box'
            }}>
                <nav className="nav">
                    <ul>
                        <li>
                            <Link to="/auth">Sign In</Link>
                        </li>
                        <li>
                            <Link to="/signup">Sign Up</Link>
                        </li>
                        <li>
                            <Link to="/home">Home</Link>
                        </li>
                        <li>
                            <Link to="/library">📚 Library</Link>
                        </li>
                        <li>
                            <Link to="/player">Player</Link>
                        </li>
                        <li>
                            <Link to="/graphics-showcase" className="showcase-link">🎨 Graphics</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;