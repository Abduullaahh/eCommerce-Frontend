import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate import
import { useLazyQuery } from '@apollo/client';
import { LOGIN_QUERY } from '../graphql/queries/login';

function SignIn({ setUserId }) { // Receive setUserId as a prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const [login, { loading, error, data }] = useLazyQuery(LOGIN_QUERY, {
    variables: { email, password },
    onCompleted: (data) => {
      console.log('Login successful:', data);
      localStorage.setItem('token', data.login.token);
      localStorage.setItem('userId', data.login.user.id); // Save user ID
      setUserId(data.login.user.id); // Set user ID
      navigate('/Home', { state: { userId: data.login.user.id } }); // Pass user ID to Home
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit" disabled={loading}>Sign In</button>
      {error && <p>Error: {error.message}</p>}
      {data && <p>Login successful!</p>}
      <Link to="/signup">Don't have an account? Sign Up</Link>
    </form>
  );
}

export default SignIn;