import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '../graphql/mutations/signup';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const [signUp, { loading, error, data }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      console.log('Registration successful:', data);
      navigate('/signin');
    },
    onError: (error) => {
      console.error('Registration error:', error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    signUp({ variables: { name, email, password } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      </div>
      <button type="submit" disabled={loading}>Register</button>
      {error && <p>Error: {error.message}</p>}
      {data && <p>Registration successful!</p>}
      <Link to="/signin">Already have an account? Sign In</Link>
    </form>
  );
}

export default Register;