import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and role in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      // Define role-based navigation
      const roleRoutes = {
        admin: '/xyz',
        purchase: '/master-list-cash',
        segregation: '/cash-segregation-list',
        packaging: '/packaging',
        expense: '/expense',
        expenseD: '/expenseD',
        credentials: '/credentials'
      };

      // Redirect based on role or default to home
      const redirectPath = roleRoutes[data.role] || '/';
      navigate(redirectPath);

    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Inline styles
  const styles = {
    body: {
      margin: 0,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f9',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
    },
    loginContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    loginBox: {
      background: '#ffffff',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      width: '100%',
      maxWidth: '400px',
    },
    logo: {
      width: '100px',
    },
    heading: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '0.5rem',
    },
    subtext: {
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '1.5rem',
    },
    inputGroup: {
      marginBottom: '1rem',
      textAlign: 'left',
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      color: '#555',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '0.9rem',
      boxSizing: 'border-box',
    },
    errorMessage: {
      color: '#ff4d4d',
      fontSize: '0.9rem',
      marginBottom: '1rem',
    },
    loginButton: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    loginButtonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <img src="image/abso-removebg-preview.png" alt="Company Logo" style={styles.logo} />
          <h1 style={styles.heading}>Welcome Back</h1>
          <p style={styles.subtext}>Please log in to continue</p>
          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={styles.input}
              />
            </div>
            {error && <p style={styles.errorMessage}>{error}</p>}
            <button
              type="submit"
              style={styles.loginButton}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}