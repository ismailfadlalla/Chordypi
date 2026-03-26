/**
 * Pi Authentication Hook
 * 
 * Custom hook for managing Pi Network authentication state
 * ✅ SECURITY: Fresh session management with timeout
 * ✅ SECURITY: Automatic re-authentication on expiry
 * ✅ SECURITY: Session monitoring and cleanup
 * 
 * @since 2026-03-26
 * @requires piNetworkService with fresh auth
 */

import { useCallback, useEffect, useState } from 'react';
import piNetworkService from '../services/piNetworkService';

export interface PiAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpiresIn?: number;
  username?: string;
  error?: string;
}

/**
 * Custom hook for Pi Network authentication
 * 
 * Usage:
 * ```tsx
 * const { isAuthenticated, isLoading, authenticate, logout } = usePiAuth();
 * 
 * if (isLoading) return <Spinner />;
 * if (!isAuthenticated) return <LoginButton onClick={authenticate} />;
 * return <PaymentButton />;
 * ```
 */
export const usePiAuth = () => {
  const [state, setState] = useState<PiAuthState>({
    isAuthenticated: false,
    isLoading: false,
    error: undefined
  });

  // Session monitor interval
  const [sessionMonitor, setSessionMonitor] = useState<NodeJS.Timeout | null>(null);

  /**
   * Monitor session expiry
   */
  const monitorSession = useCallback(() => {
    const interval = setInterval(() => {
      const sessionInfo = piNetworkService.getSessionInfo();
      
      if (sessionInfo) {
        const expiresInMs = sessionInfo.expiresIn;
        
        setState(prev => ({
          ...prev,
          sessionExpiresIn: Math.floor(expiresInMs / 1000), // Convert to seconds
          isAuthenticated: sessionInfo.isValid
        }));

        // Warn when 5 minutes remaining
        if (expiresInMs > 0 && expiresInMs <= 5 * 60 * 1000) {
          console.warn(`⏰ Pi session expires in ${Math.floor(expiresInMs / 1000)}s`);
        }

        // Auto-clear when expired
        if (!sessionInfo.isValid) {
          console.warn('⏱️ Pi session expired - cleanup required');
          setState(prev => ({
            ...prev,
            isAuthenticated: false,
            error: 'Session expired - please re-authenticate'
          }));
        }
      }
    }, 1000); // Check every second

    return interval;
  }, []);

  /**
   * Authenticate with Pi Network
   * ✅ SECURITY: Always requests fresh authentication
   */
  const authenticate = useCallback(async (forceRefresh = true): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }));

      console.log('🔐 Authenticating with Pi Network (fresh)...');

      // Ensure Pi is initialized
      const isInitialized = await piNetworkService.initialize();
      if (!isInitialized) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Pi Network initialization failed'
        }));
        return false;
      }

      // Authenticate fresh
      const user = await piNetworkService.authenticate(forceRefresh);

      if (user) {
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          username: user.username,
          error: undefined,
          isLoading: false
        }));

        console.log('✅ Pi authentication successful:', user.username);
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          error: 'Authentication failed',
          isLoading: false
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Pi authentication error:', errorMessage);

      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        error: errorMessage,
        isLoading: false
      }));

      return false;
    }
  }, []);

  /**
   * Require fresh authentication
   * Called when session expired or payment required
   */
  const requireFreshAuth = useCallback(async (): Promise<boolean> => {
    console.log('🔄 Fresh authentication required');
    return authenticate(true); // Force fresh
  }, [authenticate]);

  /**
   * Logout from Pi Network
   * ✅ SECURITY: Complete session cleanup
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      console.log('👋 Logging out from Pi Network...');

      // Clear session monitor
      if (sessionMonitor) {
        clearInterval(sessionMonitor);
        setSessionMonitor(null);
      }

      // Sign out from Pi service
      await piNetworkService.signOut();

      setState({
        isAuthenticated: false,
        isLoading: false,
        error: undefined
      });

      console.log('✅ Logout complete');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      console.error('❌ Logout error:', errorMessage);

      setState(prev => ({
        ...prev,
        error: errorMessage
      }));
    }
  }, [sessionMonitor]);

  /**
   * Check if session needs refresh
   */
  const needsRefresh = useCallback((): boolean => {
    const sessionInfo = piNetworkService.getSessionInfo();
    if (!sessionInfo) return true;

    // Need refresh if less than 2 minutes remaining
    return sessionInfo.expiresIn < 2 * 60 * 1000;
  }, []);

  /**
   * Get current session info
   */
  const getSessionInfo = useCallback(() => {
    return piNetworkService.getSessionInfo();
  }, []);

  /**
   * Initialize Pi on component mount
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));

        // Initialize Pi Network
        const isInitialized = await piNetworkService.initialize();

        if (isInitialized) {
          // Start session monitor
          const interval = monitorSession();
          setSessionMonitor(interval);

          console.log('✅ Pi Network ready for authentication');
        } else {
          console.log('ℹ️ Pi Network not available (fallback mode)');
        }

        setState(prev => ({ ...prev, isLoading: false }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Init failed';
        console.error('❌ Pi initialization error:', errorMessage);

        setState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false
        }));
      }
    };

    initialize();

    // Cleanup on unmount
    return () => {
      if (sessionMonitor) {
        clearInterval(sessionMonitor);
      }
    };
  }, [monitorSession]);

  return {
    // State
    ...state,

    // Methods
    authenticate,
    logout,
    requireFreshAuth,
    needsRefresh,
    getSessionInfo
  };
};

export default usePiAuth;
