import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUser, changePassword } from '../../data/userStore';
import CMSHeader from '../../components/cms/CMSHeader';

export default function MyProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    title: user?.title || '',
    strNumber: user?.strNumber || '',
    bio: user?.bio || '',
    linkedinUrl: user?.linkedinUrl || '',
    instagramUrl: user?.instagramUrl || '',
    avatarUrl: user?.avatarUrl || ''
  });

  const [securityData, setSecurityData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e) => {
    setSecurityData({ ...securityData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      updateUser(user.id, profileData);
      showMessage('success', 'Profile updated successfully. Changes will fully apply on next login or refresh.');
    } catch (err) {
      showMessage('error', err.message || 'Failed to update profile.');
    }
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (!user) return;
    if (securityData.newPassword !== securityData.confirmPassword) {
      showMessage('error', 'New passwords do not match.');
      return;
    }
    try {
      changePassword(user.id, securityData.oldPassword, securityData.newPassword);
      showMessage('success', 'Password changed successfully.');
      setSecurityData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showMessage('error', err.message || 'Failed to change password.');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-main flex items-center justify-center">
        <p className="text-text-muted font-body-md">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-main flex flex-col">
      <CMSHeader title="My Profile" />
      
      <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full py-6 flex-1">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-state-success-bg text-state-success-main border border-state-success-main/20' : 'bg-state-error-bg text-state-error-main border border-state-error-main/20'}`}>
            <span className="font-label-md">{message.text}</span>
          </div>
        )}

        <div className="bg-surface-container-lowest border border-border-muted rounded-xl overflow-hidden shadow-sm">
          <div className="flex border-b border-border-muted px-6 pt-4">
            <button
              className={`px-4 py-3 font-label-md transition-colors border-b-2 -mb-[1px] ${
                activeTab === 'profile' 
                  ? 'border-primary-main text-primary-main' 
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Settings
            </button>
            <button
              className={`px-4 py-3 font-label-md transition-colors border-b-2 -mb-[1px] ${
                activeTab === 'security' 
                  ? 'border-primary-main text-primary-main' 
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container-highest border border-border-muted flex items-center justify-center shrink-0">
                    {profileData.avatarUrl ? (
                      <img src={profileData.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-display-sm text-text-muted">
                        {getInitials(profileData.name)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-text-main font-label-md mb-1">Avatar URL</label>
                    <input
                      type="url"
                      name="avatarUrl"
                      value={profileData.avatarUrl}
                      onChange={handleProfileChange}
                      placeholder="https://example.com/avatar.png"
                      className="w-full px-3 py-2 bg-surface-main border border-border-main rounded-lg text-text-main font-body-md focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-shadow"
                    />
                    <p className="text-text-muted font-body-sm mt-1">Provide a URL for your profile picture.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-text-main font-label-md mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-3 py-2 bg-surface-main border border-border-main rounded-lg text-text-main font-body-md focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-shadow"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-text-main font-label-md mb-1">Title / Profession</label>
                    <input
                      type="text"
                      name="title"
                      value={profileData.title}
                      onChange={handleProfileChange}
                      placeholder="e.g. Dokter Umum"
                      className="w-full px-3 py-2 bg-surface-main border border-border-main rounded-lg text-text-main font-body-md focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-text-main font-label-md mb-1">STR Number (Optional)</label>
                    <input
                      type="text"
                      name="strNumber"
                      value={profileData.strNumber}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 bg-surface-main border border-border-main rounded-lg text-text-main font-body-md focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-text-main font-label-md mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    rows="4"
                    placeholder="Write a short professional bio..."
                    className="w-full px-3 py-2 bg-surface-main border border-border-main rounded-lg text-text-main font-body-md focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-shadow resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-text-main font-label-md mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={profileData.linkedinUrl}
                      onChange={handleProfileChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3 py-2 bg-surface-main border border-border-main rounded-lg text-text-main font-body-md focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-text-main font-label-md mb-1">Instagram URL</label>
                    <input
                      type="url"
                      name="instagramUrl"
                      value={profileData.instagramUrl}
                      onChange={handleProfileChange}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2 bg-surface-main border border-border-main rounded-lg text-text-main font-body-md focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-shadow"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border-muted flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary-main text-text-inverse font-label-md rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleSecuritySubmit} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-text-main font-label-md mb-1">Old Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={securityData.oldPassword}
                    onChange={handleSecurityChange}
                    required
                    className="w-full px-3 py-2 bg-surface-main border border-border-main rounded-lg text-text-main font-body-md focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-text-main font-label-md mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={securityData.newPassword}
                    onChange={handleSecurityChange}
                    required
                    className="w-full px-3 py-2 bg-surface-main border border-border-main rounded-lg text-text-main font-body-md focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-text-main font-label-md mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={securityData.confirmPassword}
                    onChange={handleSecurityChange}
                    required
                    className="w-full px-3 py-2 bg-surface-main border border-border-main rounded-lg text-text-main font-body-md focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-shadow"
                  />
                </div>

                <div className="pt-6 border-t border-border-muted flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary-main text-text-inverse font-label-md rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
