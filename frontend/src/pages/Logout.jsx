import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="logout-container">
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
}

export default Logout;
