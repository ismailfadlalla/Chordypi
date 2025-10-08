import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/design-tokens.css';  // Design system tokens - MUST load first
import './styles/components/button-system.css';  // Unified button styles
import './styles/components/cards.css';  // Unified card components
import './styles/components/hero-preview.css';  // Hero featured preview section
import './styles/global.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);