import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages
  const history = useHistory(); // Hook for history navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('https://musicrepobcknd.onrender.com:5000/api/auth/register', {
        username,
        email,
        password
      });

      console.log(response.data.message); // Log the server message

      // Clear error state if registration is successful
      setError('');

      // Navigate to /login after successful registration
      history.push('/login');
    } catch (error) {
      // Check if there's a response from the server
      if (error.response && error.response.data && error.response.data.error) {
        // Set the error message from the server
        setError(error.response.data.error);
      } else {
        // Set a generic error message if no specific server response is available
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error registering user:', error.response?.data || error.message);
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>} {/* Display error if it exists */}
    </div>
  );
};

export default Register;
