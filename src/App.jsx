import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import supabase from './supabase-client';
import Home from './Home';
import Todo from './Todo';
import Auth from './Auth';
import VerifyEmail from './VerifyEmail';
import Profile from './Profile';
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
    <Router basename="/supatest">
      {session ? (
        <>
          <header>
            <div className="header-left">
              <h1>TOBI'S HIDEOUT</h1>
              <nav>
                <Link to="/">Home</Link>
                <Link to="/todo">Todo</Link>
              </nav>
            </div>
            <div className="user-info">
              <Link to="/profile" className="user-email">{session.user.email}</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </header>
          <main style={{ paddingTop: '80px' }}> {/* Add padding to avoid content being hidden behind the fixed header */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/todo" element={<Todo />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer>
            <p>&copy; 2023 Tobi. All rights reserved.</p>
          </footer>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Auth setSession={setSession} />} />
          <Route path="/register" element={<Auth isSignUp={true} setSession={setSession} />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;