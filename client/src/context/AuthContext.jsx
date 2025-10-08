import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [piUser, setPiUser] = useState(null);
    const [isPiUser, setIsPiUser] = useState(false);
    const [piConnected, setPiConnected] = useState(false);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        // Check for existing Pi Network connection
        checkPiConnection();

        return () => unsubscribe();
    }, []);

    const checkPiConnection = () => {
        try {
            const savedPiUser = localStorage.getItem('piNetworkUser');
            const savedPiAuth = localStorage.getItem('piNetworkAuth');
            
            if (savedPiUser && savedPiAuth) {
                const piUserData = JSON.parse(savedPiUser);
                const piAuthData = JSON.parse(savedPiAuth);
                
                setPiUser(piUserData);
                setIsPiUser(true);
                setPiConnected(true);
                
                console.log('✅ Restored Pi Network connection:', piUserData.username);
            }
        } catch (error) {
            console.error('Failed to restore Pi connection:', error);
        }
    };

    const connectPiNetwork = (piUserData, piAuthData) => {
        try {
            // Save Pi user data
            localStorage.setItem('piNetworkUser', JSON.stringify(piUserData));
            localStorage.setItem('piNetworkAuth', JSON.stringify(piAuthData));
            
            setPiUser(piUserData);
            setIsPiUser(true);
            setPiConnected(true);
            
            console.log('🥧 Pi Network connected successfully:', piUserData.username);
        } catch (error) {
            console.error('Failed to connect Pi Network:', error);
        }
    };

    const disconnectPiNetwork = () => {
        try {
            localStorage.removeItem('piNetworkUser');
            localStorage.removeItem('piNetworkAuth');
            localStorage.removeItem('piNetworkPayments');
            
            setPiUser(null);
            setIsPiUser(false);
            setPiConnected(false);
            
            console.log('🥧 Pi Network disconnected');
        } catch (error) {
            console.error('Failed to disconnect Pi Network:', error);
        }
    };

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await authService.signIn(email, password);
            setUser(userCredential.user);
        } catch (error) {
            console.error("Sign In Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await authService.signOut();
            setUser(null);
        } catch (error) {
            console.error("Sign Out Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await authService.signUp(email, password);
            setUser(userCredential.user);
        } catch (error) {
            console.error("Sign Up Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            signIn, 
            signOut, 
            signUp,
            piUser,
            isPiUser,
            piConnected,
            connectPiNetwork,
            disconnectPiNetwork,
            checkPiConnection
        }}>
            {children}
        </AuthContext.Provider>
    );
};