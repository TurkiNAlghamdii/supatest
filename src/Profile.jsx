import React, { useState, useEffect } from 'react';
import supabase from './supabase-client';
import './Profile.css';

function Profile() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.storage
          .from('profile-pictures')
          .download(`public/${user.id}.png`);
        if (error) {
          console.error('Error downloading profile picture:', error.message);
        } else {
          const url = URL.createObjectURL(data);
          setProfilePictureUrl(url);
        }
      }
    };

    fetchProfilePicture();
  }, []);

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password updated successfully!');
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.storage
        .from('profile-pictures')
        .upload(`public/${user.id}.png`, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        setError('Error uploading profile picture: ' + error.message);
      } else {
        setSuccess('Profile picture updated successfully!');
        const url = URL.createObjectURL(file);
        setProfilePictureUrl(url);
      }
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-picture-container">
        {profilePictureUrl && <img src={profilePictureUrl} alt="Profile" className="profile-picture" />}
        <label className="upload-button">
          Upload Picture
          <input type="file" accept="image/*" onChange={handleProfilePictureUpload} />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleChangePassword}>
        <div className="password-place">
          <label>Change Your Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default Profile;