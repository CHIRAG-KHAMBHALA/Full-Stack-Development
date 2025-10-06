import React from 'react';
import './Sidebar.css';

function Sidebar({ isOpen, onNavigate }) {
  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Navigation</h2>
      </div>
      <button className="nav-btn" onClick={() => handleNavigation('home')}>
        🏠 Home
      </button>
      <button className="nav-btn" onClick={() => handleNavigation('about')}>
        ℹ️ About
      </button>
      <button className="nav-btn" onClick={() => handleNavigation('contact')}>
        📧 Contact
      </button>
      <button className="nav-btn" onClick={() => handleNavigation('services')}>
        🔧 Services
      </button>
      <button className="nav-btn" onClick={() => handleNavigation('portfolio')}>
        💼 Portfolio
      </button>
    </div>
  );
}

export default Sidebar;
