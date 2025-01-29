import React, { useState, useEffect } from 'react';
import supabase from './supabase-client';
import './Profile.css';

function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');

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

    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        if (error) {
          setError(error.message);
        } else {
          setUsername(data.username);
        }
        setLoading(false);
      }
    };

    fetchProfilePicture();
    fetchProfile();
  }, []);

  const updateProfile = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Profile updated successfully');
    }
    setLoading(false);
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    // Add your password change logic here
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    const filePath = `public/${user.id}.png`;

    const { error } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, { upsert: true });

    if (error) {
      setError('Error uploading profile picture: ' + error.message);
    } else {
      const url = URL.createObjectURL(file);
      setProfilePictureUrl(url);
      setSuccess('Profile picture updated successfully');
    }
  };

  if (loading) return <div>Loading...</div>;

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
      <form onSubmit={updateProfile}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" className="profile-button">Update Username</button>
        </div>
      </form>
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
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button type="submit" className="profile-button">Change Password</button>
        </div>
      </form>
    </div>
  );
}

export default Profile;