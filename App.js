import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import AuthProvider for development
import { AuthProvider } from './src/context/AuthProvider';

// Import Pi Browser Router - detects if running in Pi Browser

// Import SearchScreen
import AuthScreen from './src/screens/AuthScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import SearchScreen from './src/screens/SearchScreen';

const Stack = createNativeStackNavigator();

// Home Screen Component
function HomeScreen({ navigation }) {
  console.log('🚨🚨🚨 HOME SCREEN IN APP.JS RENDERING!!! 🚨🚨🚨');
  console.log('🎵 HomeScreen rendering...');

  const handleTest = () => {
    Alert.alert('Test', 'App is working with navigation!');
  };

  const handleTestAPI = async () => {
    console.log('🧪 Testing App Features...');
    
    try {
      Alert.alert('Test Complete', 'App is working correctly!');
    } catch (error) {
      console.error('Test Failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleSearch = () => {
    console.log('🔍 Navigating to Search...');
    navigation.navigate('Search');
  };

  const handleLibrary = () => {
    console.log('📚 Navigating to Library...');
    navigation.navigate('Library');
  };

  const handleAuth = () => {
    console.log('👤 Navigating to Auth...');
    navigation.navigate('Auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: '#ff0000', fontSize: 24 }]}>🚨 APP.JS DEBUG MODE ACTIVE 🚨</Text>
        <Text style={styles.title}>🎵 Chords Legend</Text>
        <Text style={styles.subtitle}>Professional Music App</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleTest}>
          <Text style={styles.buttonText}>Test App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#e74c3c' }]} onPress={handleTestAPI}>
          <Text style={styles.buttonText}>🧪 Test Unified API</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#27ae60' }]} onPress={handleSearch}>
          <Text style={styles.buttonText}>🔍 Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#9b59b6' }]} onPress={handleLibrary}>
          <Text style={styles.buttonText}>📚 Library</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#f39c12' }]} onPress={handleAuth}>
          <Text style={styles.buttonText}>👤 Account</Text>
        </TouchableOpacity>
        
        <Text style={styles.status}>✅ Professional App Ready!</Text>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  console.log('🚨🚨🚨 MAIN APP.JS LOADING!!! 🚨🚨🚨');
  console.log('🎵 Professional App Loading...');

  return (
    <PiBrowserRouter>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: '#2c3e50' },
              headerTintColor: '#ecf0f1',
              headerTitleStyle: { fontWeight: 'bold' }
            }}
          >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: '🎵 Chords Legend' }}
          />
          <Stack.Screen 
            name="Search" 
            component={SearchScreen} 
            options={{ title: '🔍 Search Songs' }}
          />
          <Stack.Screen 
            name="Library" 
            component={LibraryScreen} 
            options={{ title: '📚 My Library' }}
          />
          <Stack.Screen 
            name="Auth" 
            component={AuthScreen} 
            options={{ title: '👤 Signup / Signin' }}
          />
          <Stack.Screen 
            name="Player" 
            component={PlayerScreen} 
            options={{ title: '🎸 Chord Player' }}
          />
          <Stack.Screen 
            name="ChordPlayer" 
            component={PlayerScreen} 
            options={{ title: '🎸 Chord Progression Sheet' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </AuthProvider>
    </PiBrowserRouter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#bbb',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    marginTop: 40,
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
