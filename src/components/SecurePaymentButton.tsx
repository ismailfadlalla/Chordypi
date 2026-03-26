/**
 * Secure Payment Button Component
 * 
 * Example component for payments with fresh Pi authentication
 * ✅ SECURITY: Enforces fresh authentication before payment
 * ✅ SECURITY: Displays session expiry warning
 * ✅ SECURITY: Handles re-authentication flow
 * 
 * @since 2026-03-26
 * @requires usePiAuth hook and securePaymentService
 */

import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PiFeature } from '../config/piConfig';
import usePiAuth from '../hooks/usePiAuth';
import securePaymentService from '../services/securePaymentService';

export interface SecurePaymentButtonProps {
  feature: PiFeature;
  userId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  title?: string;
  disabled?: boolean;
}

/**
 * Payment Button with Fresh Authentication Enforcement
 * 
 * Features:
 * - ✅ Enforces fresh Pi authentication
 * - ✅ Shows session timeout warning
 * - ✅ Handles re-authentication
 * - ✅ Processes payments securely
 * 
 * Usage:
 * ```tsx
 * <SecurePaymentButton
 *   feature="premium-features"
 *   userId={user.uid}
 *   onSuccess={() => console.log('Payment complete')}
 *   title="Unlock Premium"
 * />
 * ```
 */
export const SecurePaymentButton: React.FC<SecurePaymentButtonProps> = ({
  feature,
  userId,
  onSuccess,
  onError,
  title = 'Continue Payment',
  disabled = false
}) => {
  const {
    isAuthenticated,
    isLoading,
    sessionExpiresIn,
    error: authError,
    authenticate,
    requireFreshAuth,
    needsRefresh
  } = usePiAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  /**
   * Handle payment button press
   * ✅ SECURITY: Enforce fresh authentication
   */
  const handlePayment = async () => {
    try {
      setPaymentError(null);
      setIsProcessing(true);

      // Check authentication status
      if (!isAuthenticated) {
        console.log('🔐 Not authenticated - requesting authentication...');
        const authSuccess = await authenticate(true); // Force fresh
        if (!authSuccess) {
          setPaymentError('Authentication failed - cannot process payment');
          onError?.('Authentication failed');
          setIsProcessing(false);
          return;
        }
      }

      // Check if session needs refresh (less than 2 minutes remaining)
      if (needsRefresh()) {
        console.log('🔄 Session expiring soon - requesting fresh authentication...');
        const refreshSuccess = await requireFreshAuth();
        if (!refreshSuccess) {
          setPaymentError('Re-authentication failed - please try again');
          onError?.('Re-authentication failed');
          setIsProcessing(false);
          return;
        }
      }

      // Process payment with fresh authentication
      console.log(`💳 Processing payment for feature: ${feature}`);
      
      const result = await securePaymentService.processPayment({
        feature,
        userId
      });

      if (result.success) {
        console.log('✅ Payment successful:', result.paymentId);
        onSuccess?.();
        setPaymentError(null);
      } else if (result.requiresReauth) {
        // Re-authenticate and retry
        console.log('🔄 Fresh authentication required - retrying...');
        const authSuccess = await authenticate(true);
        if (authSuccess) {
          // Retry payment after authentication
          const retryResult = await securePaymentService.processPayment({
            feature,
            userId
          });
          if (retryResult.success) {
            console.log('✅ Payment successful after re-auth:', retryResult.paymentId);
            onSuccess?.();
          } else {
            setPaymentError(retryResult.error || 'Payment failed');
            onError?.(retryResult.error || 'Payment failed');
          }
        } else {
          setPaymentError('Re-authentication failed');
          onError?.('Re-authentication failed');
        }
      } else {
        setPaymentError(result.error || 'Payment failed');
        onError?.(result.error || 'Payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment error';
      console.error('❌ Payment error:', errorMessage);
      setPaymentError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine button state
  const isDisabled = disabled || isProcessing || isLoading || !isAuthenticated;
  const showWarning = sessionExpiresIn !== undefined && sessionExpiresIn < 300; // 5 minutes

  return (
    <View style={styles.container}>
      {/* Session timeout warning */}
      {showWarning && sessionExpiresIn !== undefined && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⏰ Session expires in {Math.ceil(sessionExpiresIn / 60)} minute
            {Math.ceil(sessionExpiresIn / 60) !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Error message */}
      {(paymentError || authError) && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {paymentError || authError}
          </Text>
        </View>
      )}

      {/* Payment button */}
      <TouchableOpacity
        style={[
          styles.button,
          isDisabled && styles.buttonDisabled,
          isProcessing && styles.buttonLoading
        ]}
        onPress={handlePayment}
        disabled={isDisabled}
      >
        {isProcessing || isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.buttonText}>
            {!isAuthenticated ? '🔐 Authenticate' : title}
          </Text>
        )}
      </TouchableOpacity>

      {/* Status info */}
      {isAuthenticated && !showWarning && (
        <Text style={styles.statusText}>
          ✅ Ready to pay (Session active)
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6
  },
  buttonLoading: {
    opacity: 0.8
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 4
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: '500'
  },
  errorContainer: {
    backgroundColor: '#F8D7DA',
    borderLeftWidth: 4,
    borderLeftColor: '#DC3545',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 4
  },
  errorText: {
    color: '#721C24',
    fontSize: 14,
    fontWeight: '500'
  },
  statusText: {
    color: '#28A745',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8
  }
});

export default SecurePaymentButton;
