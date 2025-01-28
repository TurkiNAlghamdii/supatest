import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabase-client';
import './Auth.css';

function Auth({ isSignUp = false, setSession }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setError(''); // Clear previous errors
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else {
        // Inform the user to check their email for the verification link
        alert('Please check your email for the verification link.');
        navigate('/login');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        navigate('/');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <p onClick={() => navigate(isSignUp ? '/login' : '/register')}>
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
}

export default Auth;