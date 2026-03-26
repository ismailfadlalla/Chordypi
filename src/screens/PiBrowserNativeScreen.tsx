/**
 * Pi Browser Native Screen
 * 
 * Simplified UX for Pi Browser - uses ONLY Pi's native authentication
 * No custom screens, no loops - just native Pi flows
 * 
 * @since 2026-03-26
 * @requires Running in Pi Browser (window.Pi available)
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SecurePaymentButton from '../components/SecurePaymentButton';
import usePiAuth from '../hooks/usePiAuth';

/**
 * Pi Browser Native Screen
 * 
 * Features:
 * - Simple one-button Pi authentication
 * - Uses Pi's native auth popup (not custom screen)
 * - After auth, show payment features
 * - No loops, no custom screens
 */
export const PiBrowserNativeScreen: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    username,
    authenticate,
    logout
  } = usePiAuth();

  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // LOADING STATE
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Initializing...</Text>
        </View>
      </View>
    );
  }

  // NOT AUTHENTICATED - Show only Pi Connect Button
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🎵 ChordsLegend</Text>
            <Text style={styles.subtitle}>Pi Network Powered</Text>
          </View>

          {/* Connect Button - Single CTA */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => authenticate(true)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.connectButtonEmoji}>🥧</Text>
                  <Text style={styles.connectButtonText}>Connect to Pi Account</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.helperText}>
              Uses Pi Browser's native authentication
            </Text>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>🎸</Text>
              <Text style={styles.infoTitle}>Real-Time Analysis</Text>
              <Text style={styles.infoDescription}>
                Instant chord detection with AI
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>💰</Text>
              <Text style={styles.infoTitle}>Pi Payments</Text>
              <Text style={styles.infoDescription}>
                Simple micropayments with Pi
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>🌐</Text>
              <Text style={styles.infoTitle}>YouTube Ready</Text>
              <Text style={styles.infoDescription}>
                Analyze any song from YouTube
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // AUTHENTICATED - Show Features
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* User Header */}
        <View style={styles.userHeader}>
          <View>
            <Text style={styles.greeting}>Welcome back! 👋</Text>
            <Text style={styles.username}>@{username}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Main Features */}
        <View style={styles.featuresSection}>
          {/* Analyze Song Feature */}
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🎵</Text>
            <Text style={styles.featureTitle}>Analyze Song</Text>
            <Text style={styles.featureDescription}>
              Paste YouTube URL to get chord progressions
            </Text>
            <TouchableOpacity style={styles.featureButton}>
              <Text style={styles.featureButtonText}>Open Analyzer →</Text>
            </TouchableOpacity>
          </View>

          {/* Premium Features */}
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>⭐</Text>
            <Text style={styles.featureTitle}>Premium Features</Text>
            <Text style={styles.featureDescription}>
              Unlock advanced analysis and chord library
            </Text>
            <SecurePaymentButton
              feature="premium-features"
              userId={username || 'anonymous'}
              title="🔓 Unlock Premium"
              onSuccess={() => {
                alert('Premium unlocked! 🎉');
              }}
            />
          </View>

          {/* Settings */}
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>⚙️</Text>
            <Text style={styles.featureTitle}>Settings</Text>
            <Text style={styles.featureDescription}>
              Customize your chord detection preferences
            </Text>
            <TouchableOpacity style={styles.featureButton}>
              <Text style={styles.featureButtonText}>Go to Settings →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pi Network Badge */}
        <View style={styles.piNetworkBadge}>
          <Text style={styles.badgeText}>
            ✅ Authenticated with Pi Network • Fresh Session Active
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'space-between'
  },

  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500'
  },

  // Loading
  loadingText: {
    marginTop: 16,
    color: '#FFFFFF',
    fontSize: 16
  },

  // Button Section
  buttonSection: {
    marginBottom: 32
  },
  connectButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  connectButtonEmoji: {
    fontSize: 24
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600'
  },
  helperText: {
    color: '#999999',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic'
  },

  // Info Section
  infoSection: {
    gap: 12,
    marginBottom: 24
  },
  infoCard: {
    backgroundColor: '#1a1f2e',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B'
  },
  infoEmoji: {
    fontSize: 24,
    marginBottom: 4
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4
  },
  infoDescription: {
    color: '#999999',
    fontSize: 12
  },

  // User Header (After Auth)
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333'
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  username: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500'
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#333333',
    borderRadius: 6
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },

  // Features Section
  featuresSection: {
    gap: 16,
    flex: 1,
    justifyContent: 'flex-start'
  },
  featureCard: {
    backgroundColor: '#1a1f2e',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333'
  },
  featureEmoji: {
    fontSize: 28,
    marginBottom: 8
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  featureDescription: {
    color: '#999999',
    fontSize: 13,
    marginBottom: 12
  },
  featureButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  featureButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },

  // Pi Network Badge
  piNetworkBadge: {
    backgroundColor: '#1a4d1a',
    borderWidth: 1,
    borderColor: '#28A745',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  badgeText: {
    color: '#28A745',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default PiBrowserNativeScreen;
