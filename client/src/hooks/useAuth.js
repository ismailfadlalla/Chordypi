import { useState, useEffect } from 'react';
import authService from '../services/authService';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        console.log('🔍 useAuth signIn called with:', { email, password });
        setLoading(true);
        setError(null);
        setUser(null); // Clear any existing user state
        
        try {
            const userCredential = await authService.signIn({ email, password });
            console.log('🔍 useAuth signIn success:', userCredential);
            setUser(userCredential.user);
            setError(null); // Clear any previous errors
            return userCredential;
        } catch (err) {
            console.log('🔍 useAuth signIn error:', err);
            setError(err.message);
            setUser(null); // Ensure user is null on error
            // Additional debugging
            console.log('🔍 Error state set to:', err.message);
            console.log('🔍 User state set to:', null);
            throw err; // Re-throw so AuthPage can catch it
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email, password, username) => {
        setLoading(true);
        setError(null);
        try {
            const userCredential = await authService.signUp({ email, password, username });
            setUser(userCredential.user);
            return userCredential;
        } catch (err) {
            setError(err.message);
            throw err; // Re-throw so AuthPage can catch it
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await authService.signOut();
            setUser(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
    };
};

export default useAuth;
export { useAuth };