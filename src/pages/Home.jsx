// src/pages/Home.js

import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Spotify Music Selector</h1>
      <p>Find and save your favorite tracks from Spotify!</p>
      <div className="cta-buttons">
        <Link to="/search" className="btn-primary">
          Search Music
        </Link>
        <Link to="/saved" className="btn-secondary">
          View Saved Tracks
        </Link>
      </div>
      <div className="auth-links">
        <p>
          New user? <Link to="/register">Register here</Link>
        </p>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Home;
