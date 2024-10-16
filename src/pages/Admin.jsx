import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [decodedUser, setDecodedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userSongs, setUserSongs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('No token found. Please log in as admin.');
          return;
        }

        const decoded = decodeToken(token);
        if (decoded) {
          setDecodedUser(decoded);
        }

        const response = await axios.get('https://musicrepobcknd.onrender.com/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched users:', response.data.users);
        console.log('Decoded user:', decoded);

        const filteredUsers = response.data.users.filter(user => user.username !== "ADMIN");
        console.log('Filtered users:', filteredUsers);
        setUsers(filteredUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || 'An error occurred');
      }
    };

    fetchUsers();
  }, []);

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Fetch songs for the selected user
  const fetchUserSongs = async (username) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/users/${username}/songs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserSongs(response.data.songs);

      // Log the fetched songs to the console
      console.log(`Saved tracks for ${username}:`, response.data.songs);
    } catch (err) {
      console.error('Error fetching user songs:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching songs');
    }
  };

  const handleDetailsClick = (user) => {
    setSelectedUser(user);
    fetchUserSongs(user.username);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setUserSongs([]);
    setSelectedUser(null);
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {decodedUser && (
        <div>
          <p><strong>Logged in as:</strong> {decodedUser.username} ({decodedUser.role})</p>
        </div>
      )}
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Username</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} style={{ border: '1px solid #ccc' }}>
                <td style={{ padding: '8px' }}>{user.username}</td>
                <td style={{ padding: '8px' }}>{user.email}</td>
                <td style={{ padding: '8px' }}>
                  <button 
                    onClick={() => handleDetailsClick(user)} 
                    style={{
                      backgroundColor: '#007BFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Songs Saved by {selectedUser?.username}</h2>
            <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
              {userSongs.length > 0 ? (
                <ul>
                  {userSongs.map((song, index) => (
                    <li key={index}>{song.title}</li>
                  ))}
                </ul>
              ) : (
                <p>No songs saved by this user.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal {
          display: flex;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgb(0,0,0);
          background-color: rgba(0,0,0,0.4);
        }
        .modal-content {
          background-color: #fefefe;
          margin: 15% auto;
          padding: 20px;
          border: 1px solid #888;
          width: 80%;
          max-width: 600px;
          border-radius: 8px;
        }
        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
        }
        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
