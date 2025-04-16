import React from 'react';
import { useTranslationContext } from '../contexts/TranslationContext';
import './Header.css';

const Header: React.FC = () => {
  const { autoPlay, setAutoPlay } = useTranslationContext();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🌐</span>
          <h1>Tradutor em Tempo Real</h1>
        </div>
        
        <div className="header-controls">
          <label className="auto-play-toggle">
            <input 
              type="checkbox" 
              checked={autoPlay} 
              onChange={(e) => setAutoPlay(e.target.checked)} 
            />
            <span>Reprodução automática</span>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Header;