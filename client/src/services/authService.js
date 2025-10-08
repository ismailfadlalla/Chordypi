// Client-side authentication service (no backend required)

const generateToken = () => {
    return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

const generateUserId = () => {
    return 'user_' + Math.random().toString(36).substr(2, 9);
};

// Sign up a new user
export const signUp = async (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
        id: generateUserId(),
        username: userData.username,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        createdAt: Date.now()
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { 
        status: 'success',
        message: 'User created successfully',
        user: { id: newUser.id, username: newUser.username, email: newUser.email }
    };
};

// Sign in an existing user
export const signIn = async (credentials) => {
    console.log('🔍 authService signIn called with:', credentials);
    
    // IMMEDIATELY clear any existing auth data when starting authentication
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('🔍 Available users:', users.map(u => ({ email: u.email, username: u.username, password: u.password })));
    console.log('🔍 Looking for user with email:', credentials.email, 'and password:', credentials.password);
    
    // Find user
    const user = users.find(u => {
        const emailMatch = u.email === credentials.email;
        const passwordMatch = u.password === credentials.password;
        console.log(`🔍 Checking user ${u.email}: email match=${emailMatch}, password match=${passwordMatch}`);
        return emailMatch && passwordMatch;
    });
    
    console.log('🔍 Found user:', user);
    
    if (!user) {
        console.log('🔍 authService signIn failed: user not found');
        // Ensure auth data stays cleared on failed login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Invalid email or password');
    }
    
    // Generate token and save session
    const token = generateToken();
    const userSession = {
        id: user.id,
        username: user.username,
        email: user.email,
        token: token
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userSession));
    
    return {
        status: 'success',
        user: userSession,
        token: token
    };
};

// Get the current user's profile
export const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!token || !user) {
        throw new Error('No user session found');
    }
    
    return {
        status: 'success',
        user: user
    };
};

// Get user profile by ID (alias for getCurrentUser)
export const getUserProfile = async (userId) => {
    return getCurrentUser();
};

// Sign out the current user
export const signOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return {
        status: 'success',
        message: 'Signed out successfully'
    };
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
};

// Get current user without async
export const getCurrentUserSync = () => {
    return JSON.parse(localStorage.getItem('user') || 'null');
};

// Auth state change listener
export const onAuthStateChanged = (callback) => {
    // Check current state
    const user = getCurrentUserSync();
    console.log('🔍 onAuthStateChanged initial check:', user);
    callback(user);
    
    // Since we're using localStorage, we'll check periodically
    let lastUser = user;
    const interval = setInterval(() => {
        const currentUser = getCurrentUserSync();
        // Only call callback if user state actually changed
        if (JSON.stringify(currentUser) !== JSON.stringify(lastUser)) {
            console.log('🔍 onAuthStateChanged detected change:', { from: lastUser, to: currentUser });
            lastUser = currentUser;
            callback(currentUser);
        }
    }, 1000);
    
    // Return unsubscribe function
    return () => clearInterval(interval);
};

// Create a default export object containing all functions
const authService = {
    signUp,
    signIn,
    getCurrentUser,
    getUserProfile,
    signOut,
    isAuthenticated,
    getCurrentUserSync,
    onAuthStateChanged
};

export default authService;