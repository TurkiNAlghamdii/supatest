import React, { useState } from 'react';
import supabase from './supabase-client';
import './Auth.css';

function Auth({ isSignUp: initialIsSignUp = false, setSession }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);

  const handleAuth = async (event) => {
    event.preventDefault();
    setError('');

    if (isSignUp) {
      const { data: { user }, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        await supabase.from('profiles').insert([{ id: user.id, username }]);
      }
    } else {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSession(session);
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAuth} className="auth-form">
        {isSignUp && (
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="auth-button">{isSignUp ? 'Sign Up' : 'Log In'}</button>
      </form>
      <p className="toggle-auth">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <span onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? ' Log In' : ' Sign Up'}
        </span>
      </p>
    </div>
  );
}

export default Auth;