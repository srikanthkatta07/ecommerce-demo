import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Header from './Header';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, rawPassword: password }),
      });

      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        let data;

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const token = await response.text();
          data = { token }; // Wrap plain token in an object
        }

        localStorage.setItem('token', data.token); // Store token in localStorage

        // Decode the JWT token and store the user data as JSON
        const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
        localStorage.setItem('userData', JSON.stringify(decodedToken)); // Store user data as JSON

        window.dispatchEvent(new Event('storage')); // Notify other components of storage change

        const role = decodedToken.role;
        if (role === 'ADMIN') {
          navigate('/dashboard');
        } else {
          navigate('/products');
        }
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}

export default Login;
