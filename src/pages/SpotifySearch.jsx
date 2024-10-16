import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const SpotifySearch = () => {
  const [query, setQuery] = useState('');
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [savedAlbums, setSavedAlbums] = useState({}); // State to track saved status for each album

  const clientId = '6692ac82c98e45d0b43e231bdfc05519'; // Replace with your actual client ID
  const clientSecret = '2f506a1c19d44bd28f1a04eb9f17d3ab'; // Replace with your actual client secret

  

  // Function to get the access token
  const getAccessToken = async () => {
    const authString = `${clientId}:${clientSecret}`;
    const encodedAuthString = btoa(authString);

    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'client_credentials'
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${encodedAuthString}`,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw error;
    }
  };

  // Function to search for albums
  const searchAlbum = async () => {
    if (!query) return;

    try {
      const accessToken = await getAccessToken();
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          q: query,
          type: 'album',
          limit: 10,
        },
      });

      setAlbums(response.data.albums.items);
      setError('');
    } catch (error) {
      console.error('Error searching album:', error);
      setError('Failed to fetch albums');
      setAlbums([]);
    }
  };

  // Function to save album
  const handleSave = async (album) => {
    // Collect the required data
    const albumData = {
      userId,
      spotifyId: album.id,
      name: album.name,
      artist: album.artists[0]?.name,
      album: album.name,
      imageUrl: album.images[0]?.url,
    };

    console.log('Saving album:', albumData);

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await axios.post('https://musicrepobcknd.onrender.com/api/music', albumData, {
        headers: {
          token: token, // Include the token in the headers
        },
      });

      console.log('Response from server:', response.data);

      // Update saved status for the album
      setSavedAlbums((prev) => ({
        ...prev,
        [album.id]: true, // Mark the album as saved
      }));
    } catch (error) {
      console.error('Error saving album:', error.response ? error.response.data : error.message);
    }
  };

  // Function to ignore album
  const handleIgnore = (album) => {
    console.log('Ignored album:', album);
  };

  // Decode the token from localStorage and extract the userId
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1]; // Get the payload part of the token
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decodedToken = JSON.parse(jsonPayload);
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []); // Runs once when the component is mounted

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    searchAlbum();
  };

  return (
    <div>
      <h2>Album Search</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter album name"
          required
        />
        <button type="submit">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
      <div style={{ 
          width: '400px',
          height: '300px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          marginTop: '10px'
        }}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {albums.map((album) => (
            <li key={album.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img
                src={album.images[1]?.url}
                alt={album.name}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  marginRight: '10px'
                }}
              />
              <p style={{ flex: '1', margin: 0 }}>{album.name} - {album.artists[0]?.name}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleSave(album)}
                  style={{
                    borderRadius: '20px',
                    padding: '5px 10px'
                  }}
                  disabled={savedAlbums[album.id]} // Disable button if already saved
                >
                  {savedAlbums[album.id] ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={() => handleIgnore(album)}
                  style={{
                    borderRadius: '20px',
                    padding: '5px 10px'
                  }}
                >
                  Ignore
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Link to Saved Tracks */}
      <Link to="/saved">
        <button style={{ marginTop: '20px', padding: '10px', borderRadius: '5px' }}>
          Go to Saved Tracks
        </button>
      </Link>
    </div>
  );
};

export default SpotifySearch;
