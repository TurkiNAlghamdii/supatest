// filepath: /home/turki/Desktop/test/supatest/src/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import supabase from './supabase-client';
import './VerifyEmail.css';

function VerifyEmail() {
  const [message, setMessage] = useState('Verifying your email...');
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const query = new URLSearchParams(location.search);
      const accessToken = query.get('access_token');

      if (accessToken) {
        const { error } = await supabase.auth.verifyOtp({ token: accessToken, type: 'signup' });
        if (error) {
          setMessage('Email verification failed. Please try again.');
        } else {
          setMessage('Email verified successfully! You can now log in.');
        }
      } else {
        setMessage('Invalid verification link.');
      }
    };

    verifyEmail();
  }, [location]);

  return (
    <div className="verify-email-container">
      <h2>{message}</h2>
    </div>
  );
}

export default VerifyEmail;