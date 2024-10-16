import { useState, useEffect } from 'react';
import axios from 'axios';

function SavedTracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSavedTracks();
  }, []);

  const fetchSavedTracks = async () => {
    try {
      const response = await axios.get('https://musicrepobcknd.onrender.com/api/music/tracks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTracks(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch saved tracks');
      setLoading(false);
      console.log(error);
    }
  };

  const deleteTrack = async (trackId) => {
    try {
      await axios.delete(`https://musicrepobcknd.onrender.com/api/music/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the deleted track from the state
      setTracks(tracks.filter(track => track._id !== trackId));
    } catch (error) {
      setError('Failed to delete track');
      console.log(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="saved-tracks-container">
      <h2>Your Saved Tracks</h2>
      {tracks.length === 0 ? (
        <p>You haven&apos;t saved any tracks yet.</p>
      ) : (
        <ul className="track-list">
          {tracks.map(track => (
            <li key={track._id} className="track-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <img 
                src={track.imageUrl} 
                alt={track.name} 
                className="track-image" 
                style={{
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  marginRight: '10px', 
                }} 
              />
              <div className="track-info" style={{ flex: 1 }}>
                <h3 style={{ margin: '0' }}>{track.name}</h3>
                <p style={{ margin: '0' }}>{track.artist}</p>
                <p style={{ margin: '0' }}>{track.album}</p>
              </div>
              <button 
                onClick={() => deleteTrack(track._id)} 
                className="btn-delete"
                style={{
                  padding: '5px 10px',
                  borderRadius: '5px',
                  backgroundColor: '#ff4d4d',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: '10px', 
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SavedTracks;
