import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import "./login.css";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://musicrepobcknd.onrender.com:5000/api/auth/login', { username, password });

      // Check if the response contains a token
      if (response.data.token) {
        // Save the token to localStorage
        localStorage.setItem('token', response.data.token);
        console.log('Token saved:', response.data.token);

        // Navigate to the SpotifySearch page

         if (username==="ADMIN" && password=="ADMIN"){
          history.push('/Adminsaved');
          return
         }

        history.push('/SpotifySearch');



      } else {
        console.error('Token not found in response');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
