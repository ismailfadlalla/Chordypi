/**
 * Detect Pi Browser Environment & Route to Correct Screen
 * 
 * Smart routing:
 * - If in Pi Browser → Show PiBrowserNativeScreen (native auth/payments only)
 * - If in regular browser → Show normal App screens
 * 
 * @since 2026-03-26
 */

import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import PiBrowserNativeScreen from '../screens/PiBrowserNativeScreen';

/**
 * Detects if running in Pi Browser
 * @returns true if window.Pi SDK is available
 */
const isPiBrowserEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).Pi;
};

/**
 * Smart App Router
 * Routes between Pi Browser mode and regular web mode
 */
export const PiBrowserRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInPiBrowser, setIsInPiBrowser] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Detect Pi Browser environment on mount
    const inPiBrowser = isPiBrowserEnvironment();
    setIsInPiBrowser(inPiBrowser);
    setIsLoaded(true);

    if (inPiBrowser) {
      console.log('🥧 Pi Browser detected - using native Pi auth/payment flows');
    } else {
      console.log('🌐 Regular web browser - using Firebase auth');
    }
  }, []);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F1419' }}>
        <Text style={{ color: '#FFFFFF' }}>Loading...</Text>
      </View>
    );
  }

  // In Pi Browser → Use native Pi screen (no loops, no Firebase)
  if (isInPiBrowser) {
    return <PiBrowserNativeScreen />;
  }

  // Regular browser → Use normal app (with Firebase auth)
  return <>{children}</>;
};

export default PiBrowserRouter;
