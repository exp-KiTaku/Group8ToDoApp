import React from 'react';
import './NavBar.css';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="icon"></span>
        <span className="title">KCCToDo</span>
      </div>
    </nav>
  );
};

export default NavBar;