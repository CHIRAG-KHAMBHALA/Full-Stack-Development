import React, { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="App">
      <button className="hamburger" onClick={toggleSidebar}>
        &#9776;
      </button>
      <Sidebar isOpen={isOpen} />
      <div className="content">
        <h1>Welcome to My Website</h1>
        <p>I am Hitarth Sherathia and this is the Home page for my Web page!!.</p>
      </div>
    </div>
  );
}

export default App;
