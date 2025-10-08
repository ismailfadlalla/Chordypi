import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../services/authService';
import '../styles/global.css';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const data = await getUserProfile(user.id);
                setProfileData(data);
            } catch (err) {
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="profile-page">
            <h1>Profile Page</h1>
            {profileData ? (
                <div className="profile-info">
                    <h2>{profileData.username}</h2>
                    <p>Email: {profileData.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <p>No profile data available.</p>
            )}
        </div>
    );
};

export default ProfilePage;