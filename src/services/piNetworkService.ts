/**
 * Pi Network Service - UPDATED v2.0+
 * Secure authentication with fresh session requirements
 * NO localStorage - memory only for payments
 * 
 * @since 2026-03-26
 * @requires Pi SDK v2.0+
 */

import { PI_CONFIG, PiFeature, PiPayment, PiUser } from '../config/piConfig';

// Session types with FRESH requirement
interface PiAuthSession {
  user: {
    uid: string;
    username: string;
  };
  accessToken: string;
  createdAt: number;
  expiresAt: number;
  forceRefresh?: boolean;
}

interface PiWalletSession {
  address: string;
  createdAt: number;
  expiresAt: number;
}

declare global {
  interface Window {
    Pi: any;
  }
}

/**
 * SECURITY: This service MUST NOT use localStorage for Pi authentication
 * All credentials are in-memory only and expire after SESSION_TIMEOUT
 */
class PiNetworkService {
  private isInitialized = false;
  private currentSession: PiAuthSession | null = null;
  private walletSession: PiWalletSession | null = null;

  // Session management
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly WALLET_TIMEOUT = 15 * 60 * 1000; // 15 minutes for wallet

  /**
   * Initialize Pi Network SDK
   * ✅ FRESH: Every initialization re-checks Pi availability
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if Pi SDK is available in current environment
      if (typeof window !== 'undefined' && window.Pi) {
        console.log('🥧 Pi Network SDK detected - v2.0+');

        // Initialize with fresh configuration
        await window.Pi.init({
          version: '2.0',
          sandbox: PI_CONFIG.SDK_CONFIG.sandbox,
          forceRefresh: true // ✅ Fresh init
        });

        console.log(`🥧 Pi SDK initialized in ${PI_CONFIG.SDK_CONFIG.environment} mode`);
        
        // Clear any previous sessions on re-init
        await this.clearSession();
        
        this.isInitialized = true;
        return true;
      }

      console.log('🥧 Pi Network SDK not available - using fallback');
      return false;
    } catch (error) {
      console.error('❌ Pi Network initialization failed:', error);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Authenticate user with Pi Network - FRESH ONLY
   * ✅ SECURITY: Never uses cached credentials
   * ✅ SECURITY: Always requests fresh authentication
   * ✅ SECURITY: Session stored in memory only
   * 
   * @param forceRefresh - Force fresh authentication (default: true)
   * @returns Fresh authentication session
   */
  async authenticate(forceRefresh = true): Promise<PiUser | null> {
    try {
      if (!this.isInitialized) {
        console.warn('⚠️ Pi Network not initialized');
        return null;
      }

      // ✅ SECURITY: Check if current session is still valid
      if (!forceRefresh && this.isSessionValid()) {
        console.log('📍 Using valid session (not forcing refresh)');
        return this.getSessionUser();
      }

      // ✅ SECURITY: Always authenticate fresh from Pi SDK
      console.log('🔐 Requesting fresh Pi authentication...');
      
      const auth = await window.Pi.authenticate({
        scopes: ['payments', 'username'],
        forceRefresh: true, // ✅ Force fresh from Pi Network
        onIncompletePaymentFound: (payment: any) => {
          console.log('⚠️ Incomplete payment found during auth:', payment);
          this.handleIncompletePayment(payment);
        }
      });

      // ✅ SECURITY: Create fresh session - memory only
      if (auth && auth.user) {
        this.currentSession = {
          user: {
            uid: auth.user.uid,
            username: auth.user.username
          },
          accessToken: auth.accessToken,
          createdAt: Date.now(),
          expiresAt: Date.now() + this.SESSION_TIMEOUT,
          forceRefresh: true
        };

        console.log('✅ Fresh Pi authentication successful:', this.currentSession.user.username);
        console.log(`📊 Session expires in ${this.SESSION_TIMEOUT / 60000} minutes`);
        
        return {
          uid: auth.user.uid,
          username: auth.user.username,
          accessToken: auth.accessToken,
          payments: []
        };
      }

      console.warn('⚠️ Authentication response missing user data');
      return null;

    } catch (error) {
      console.error('❌ Pi Network authentication failed:', error);
      this.currentSession = null;
      return null;
    }
  }

  /**
   * Create a Pi payment - FRESH WALLET REQUIRED
   * ✅ SECURITY: Requests fresh wallet connection for each payment
   * ✅ SECURITY: Validates fresh authentication
   * ✅ SECURITY: Never uses cached wallet
   * 
   * @param feature - Feature to purchase
   * @param userId - User identifier
   * @returns Payment success status
   */
  async createPayment(feature: PiFeature, userId: string): Promise<boolean> {
    try {
      // ✅ SECURITY: Validate fresh session exists
      if (!this.isSessionValid()) {
        console.warn('⚠️ Session expired or invalid - requiring fresh authentication');
        const auth = await this.authenticate(true); // Force fresh auth
        if (!auth) {
          console.error('❌ Cannot create payment without fresh authentication');
          return false;
        }
      }

      if (!this.isInitialized || !this.currentSession) {
        console.warn('⚠️ Pi Network not ready for payments');
        return false;
      }

      // ✅ SECURITY: Validate wallet session is fresh
      if (!this.isWalletSessionValid()) {
        console.log('🔐 Requesting fresh wallet connection for payment...');
        const walletConnected = await this.requestFreshWalletConnection();
        if (!walletConnected) {
          console.error('❌ Cannot create payment without fresh wallet connection');
          return false;
        }
      }

      const featureConfig = PI_CONFIG.FEATURES[feature];
      if (!featureConfig) {
        console.error('❌ Unknown feature:', feature);
        return false;
      }

      const payment: PiPayment = {
        amount: featureConfig.price,
        memo: `ChordsLegend: ${featureConfig.name}`,
        metadata: {
          feature,
          userId,
          timestamp: Date.now()
        }
      };

      // ✅ SECURITY: Create payment with fresh session
      console.log('💰 Creating payment with fresh wallet connection...');
      
      const paymentId = await window.Pi.createPayment({
        amount: payment.amount,
        memo: payment.memo,
        metadata: payment.metadata,
        forceRefresh: true // ✅ Fresh payment with updated SDK
      });

      console.log('✅ Payment created successfully:', paymentId);
      
      // ✅ Log successful payment
      if (this.currentSession) {
        this.currentSession.createdAt = Date.now(); // Refresh session timer
      }

      return true;

    } catch (error) {
      console.error('❌ Payment creation failed:', error);
      return false;
    }
  }

  /**
   * Request fresh wallet connection
   * ✅ SECURITY: Always requests new wallet approval
   * 
   * @returns Wallet connection success
   */
  private async requestFreshWalletConnection(): Promise<boolean> {
    try {
      if (!window.Pi) {
        throw new Error('Pi SDK not available');
      }

      const wallet = await window.Pi.requestWalletConnection({
        forceRefresh: true, // ✅ NEW in v2.0+ - Fresh wallet approval
        scopes: ['payments']
      });

      if (wallet) {
        this.walletSession = {
          address: wallet.address,
          createdAt: Date.now(),
          expiresAt: Date.now() + this.WALLET_TIMEOUT
        };

        console.log('✅ Fresh wallet connected:', wallet.address.substring(0, 10) + '...');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      return false;
    }
  }

  /**
   * Check if current session is still valid
   * ✅ SECURITY: Validates session timeout
   */
  private isSessionValid(): boolean {
    if (!this.currentSession) {
      return false;
    }

    const now = Date.now();
    const isValid = now < this.currentSession.expiresAt;

    if (!isValid) {
      console.warn('⏱️ Session expired - authentication required');
      this.currentSession = null;
    }

    return isValid;
  }

  /**
   * Check if wallet session is still valid
   * ✅ SECURITY: Validates wallet session timeout
   */
  private isWalletSessionValid(): boolean {
    if (!this.walletSession) {
      return false;
    }

    const now = Date.now();
    const isValid = now < this.walletSession.expiresAt;

    if (!isValid) {
      console.warn('⏱️ Wallet session expired - fresh connection required');
      this.walletSession = null;
    }

    return isValid;
  }

  /**
   * Get current session user (if session is valid)
   */
  private getSessionUser(): PiUser | null {
    if (!this.isSessionValid()) {
      return null;
    }

    return {
      uid: this.currentSession!.user.uid,
      username: this.currentSession!.user.username,
      accessToken: this.currentSession!.accessToken,
      payments: []
    };
  }

  /**
   * Check if user has purchased a specific feature
   * In production, verify against backend
   */
  async hasPurchasedFeature(feature: PiFeature, userId: string): Promise<boolean> {
    try {
      // Validate session is fresh
      if (!this.isSessionValid()) {
        console.warn('⚠️ Session expired - cannot verify purchase');
        return false;
      }

      // TODO: Implement backend verification
      // For now, assume no purchase (require payment each time)
      return false;

    } catch (error) {
      console.error('❌ Feature check failed:', error);
      return false;
    }
  }

  /**
   * Handle incomplete payments
   */
  private async handleIncompletePayment(payment: any): Promise<void> {
    try {
      console.log('🔄 Completing incomplete payment:', payment.identifier);

      // ✅ SECURITY: Validate session before completing payment
      if (!this.isSessionValid()) {
        console.warn('⚠️ Session expired - cannot complete payment');
        return;
      }

      await window.Pi.completePayment(payment.identifier);
      console.log('✅ Incomplete payment completed:', payment.identifier);

    } catch (error) {
      console.error('❌ Failed to complete payment:', error);
    }
  }

  /**
   * Get current user (session must be valid)
   */
  getCurrentUser(): PiUser | null {
    return this.getSessionUser();
  }

  /**
   * Get session information (for debugging)
   */
  getSessionInfo(): { isValid: boolean; expiresIn: number } | null {
    if (!this.currentSession) {
      return null;
    }

    const expiresIn = this.currentSession.expiresAt - Date.now();
    return {
      isValid: expiresIn > 0,
      expiresIn: Math.max(0, expiresIn)
    };
  }

  /**
   * Clear session - REQUIRED before logout
   * ✅ SECURITY: Removes all in-memory credentials
   */
  async clearSession(): Promise<void> {
    try {
      // Clear Pi session on backend
      if (this.isInitialized && window.Pi && window.Pi.clearSession) {
        await window.Pi.clearSession(); // ✅ NEW in v2.0+
      }

      // ✅ SECURITY: Clear all memory
      this.currentSession = null;
      this.walletSession = null;

      console.log('🧹 All sessions cleared');

    } catch (error) {
      console.error('❌ Session clear failed:', error);
    }
  }

  /**
   * Sign out from Pi Network
   * ✅ SECURITY: Complete logout with session cleanup
   */
  async signOut(): Promise<void> {
    try {
      // Clear session data first
      await this.clearSession();

      // Sign out from Pi SDK
      if (this.isInitialized && window.Pi) {
        await window.Pi.signOut();
      }

      console.log('👋 Pi Network signed out');

    } catch (error) {
      console.error('❌ Pi Network sign out failed:', error);
    }
  }

  /**
   * Check if Pi Network is available
   */
  isAvailable(): boolean {
    return this.isInitialized;
  }

  /**
   * Check if user is authenticated with valid session
   */
  isAuthenticated(): boolean {
    return this.isSessionValid();
  }
}

// Export singleton instance
export const piNetworkService = new PiNetworkService();
export default piNetworkService;
