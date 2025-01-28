// filepath: /home/turki/Desktop/test/supatest/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import supabase from './supabase-client';
import Home from './Home';
import Todo from './Todo';
import Auth from './Auth';
import VerifyEmail from './VerifyEmail';
import './App.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
    setSession(null);
  };

  return (
    <Router>
      <header>
        <h1>Tobi</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/todo">Todo</Link>
          {session && <button onClick={handleLogout}>Logout</button>}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={session ? <Home /> : <Auth />} />
        <Route path="/todo" element={session ? <Todo /> : <Auth />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
      <footer>
        <p>&copy; 2023 Tobi. All rights reserved.</p>
      </footer>
    </Router>
  );
}

export default App;