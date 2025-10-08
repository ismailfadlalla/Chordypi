// Pi Network Mock/Simulator for Local Testing
class PiNetworkMock {
    constructor() {
        this.isInitialized = false;
        this.user = null;
        this.payments = [];
        this.mockUsers = [
            { username: 'testuser1', uid: 'mock-uid-1' },
            { username: 'developer', uid: 'mock-uid-2' },
            { username: 'chordypi', uid: 'mock-uid-3' }
        ];
    }

    async init(config) {
        console.log('🥧 Pi Network Mock: Initializing...', config);
        
        // Simulate initialization delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.isInitialized = true;
        console.log('✅ Pi Network Mock: Initialized successfully');
        
        return {
            success: true,
            version: config.version,
            sandbox: config.sandbox
        };
    }

    async authenticate(options) {
        console.log('🔐 Pi Network Mock: Authenticating...', options);
        
        if (!this.isInitialized) {
            throw new Error('Pi SDK not initialized');
        }

        // Simulate authentication delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock user selection
        const mockUser = this.mockUsers[Math.floor(Math.random() * this.mockUsers.length)];
        
        this.user = {
            uid: mockUser.uid,
            username: mockUser.username
        };

        const authResult = {
            user: this.user,
            accessToken: `mock-access-token-${Date.now()}`,
            scopes: options.scopes || ['username', 'payments']
        };

        console.log('✅ Pi Network Mock: Authentication successful', authResult);
        
        // Check for incomplete payments if callback provided
        if (options.onIncompletePaymentFound) {
            const incompletePayment = this.findIncompletePayment();
            if (incompletePayment) {
                setTimeout(() => {
                    options.onIncompletePaymentFound(incompletePayment);
                }, 500);
            }
        }

        return authResult;
    }

    async createPayment(paymentData) {
        console.log('💳 Pi Network Mock: Creating payment...', paymentData);
        
        if (!this.user) {
            throw new Error('User not authenticated');
        }

        // Simulate payment creation delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const payment = {
            identifier: `mock-payment-${Date.now()}`,
            amount: parseFloat(paymentData.amount),
            memo: paymentData.memo,
            metadata: paymentData.metadata,
            status: 'completed', // Auto-complete for testing
            txid: `mock-txid-${Date.now()}`,
            createdAt: new Date().toISOString(),
            from_address: this.user.uid,
            to_address: 'chordypi-app'
        };

        this.payments.push(payment);
        
        console.log('✅ Pi Network Mock: Payment created successfully', payment);
        
        // Simulate blockchain confirmation after a delay
        setTimeout(() => {
            console.log('⛓️ Pi Network Mock: Payment confirmed on blockchain', payment.identifier);
        }, 3000);

        return payment;
    }

    findIncompletePayment() {
        // Simulate finding an incomplete payment 20% of the time
        if (Math.random() < 0.2) {
            return {
                identifier: `incomplete-payment-${Date.now()}`,
                amount: 1.0,
                memo: 'Previous incomplete payment',
                status: 'pending'
            };
        }
        return null;
    }

    // Mock wallet functions
    getBalance() {
        return Promise.resolve({
            balance: Math.random() * 100, // Random balance for testing
            currency: 'PI'
        });
    }

    // Mock transaction history
    getTransactionHistory() {
        return Promise.resolve(this.payments);
    }

    // Simulate network issues (for testing error handling)
    simulateNetworkError() {
        const shouldError = Math.random() < 0.1; // 10% chance of error
        if (shouldError) {
            throw new Error('Network error: Unable to connect to Pi Network');
        }
    }
}

// Install mock Pi Network for development
if (process.env.NODE_ENV === 'development' && !window.Pi) {
    console.log('🧪 Installing Pi Network Mock for development testing');
    window.Pi = new PiNetworkMock();
    
    // Add debug helpers to window for manual testing
    window.PiMock = {
        createTestPayment: (amount = 1.0, memo = 'Test payment') => {
            return window.Pi.createPayment({ amount, memo, metadata: { test: true } });
        },
        
        clearPayments: () => {
            window.Pi.payments = [];
            console.log('🧹 Mock payments cleared');
        },
        
        simulateError: () => {
            throw new Error('Simulated Pi Network error for testing');
        }
    };
    
    console.log('🎮 Pi Network Mock installed! Use window.PiMock for testing');
    console.log('Available commands:');
    console.log('- window.PiMock.createTestPayment()');
    console.log('- window.PiMock.clearPayments()');
    console.log('- window.PiMock.simulateError()');
}

export default PiNetworkMock;