// src/components/Navbar.js

import { Link, useHistory } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const history = useHistory();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Spotify Music Selector</Link>
      <div className="navbar-links">
        {isLoggedIn ? (
          <>
            <Link to="/search" className="nav-link">Search</Link>
            <Link to="/Adminsaved" className="nav-link">Saved Tracks</Link>
            <button onClick={handleLogout} className="nav-link btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
