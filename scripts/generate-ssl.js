const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 Generating SSL certificates for HTTPS...');

const sslDir = path.join(__dirname, '..', 'ssl');

// Create ssl directory if it doesn't exist
if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir, { recursive: true });
    console.log('📁 Created ssl directory');
}

const certPath = path.join(sslDir, 'cert.pem');
const keyPath = path.join(sslDir, 'key.pem');

// Check if certificates already exist
if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    console.log('✅ SSL certificates already exist');
    console.log('🔒 Certificate: ' + certPath);
    console.log('🔑 Private Key: ' + keyPath);
    process.exit(0);
}

try {
    // Generate self-signed certificate using OpenSSL
    const opensslCommand = `openssl req -x509 -newkey rsa:4096 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/C=US/ST=State/L=City/O=ChordsLegend/OU=Development/CN=localhost"`;
    
    console.log('🔧 Running OpenSSL command...');
    execSync(opensslCommand, { stdio: 'inherit' });
    
    console.log('✅ SSL certificates generated successfully!');
    console.log('🔒 Certificate: ' + certPath);
    console.log('🔑 Private Key: ' + keyPath);
    console.log('');
    console.log('🌐 Your app will now run on HTTPS:');
    console.log('   https://localhost:3001');
    console.log('');
    console.log('⚠️  Note: Browser will show security warning for self-signed certificate');
    console.log('   Click "Advanced" -> "Proceed to localhost" to continue');

} catch (error) {
    console.error('❌ Failed to generate SSL certificates');
    console.error('');
    
    if (error.message.includes('openssl')) {
        console.log('📋 OpenSSL is required to generate certificates:');
        console.log('');
        console.log('Windows:');
        console.log('1. Install Git Bash (includes OpenSSL)');
        console.log('2. Or install OpenSSL from: https://slproweb.com/products/Win32OpenSSL.html');
        console.log('3. Add OpenSSL to your PATH');
        console.log('');
        console.log('Mac:');
        console.log('1. brew install openssl');
        console.log('');
        console.log('Ubuntu/Debian:');
        console.log('1. sudo apt-get install openssl');
        console.log('');
        console.log('Alternative: Create certificates manually:');
        console.log('Generate cert.pem and key.pem in the ssl/ folder');
    } else {
        console.error(error.message);
    }
    
    // Create development fallback using Node.js crypto
    console.log('');
    console.log('🔄 Creating development certificates using Node.js...');
    
    try {
        const { generateKeyPairSync } = require('crypto');
        const forge = require('node-forge');
        
        console.log('🔧 Generating RSA key pair...');
        
        // Generate RSA key pair
        const keys = generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });
        
        // Import keys into forge
        const privateKey = forge.pki.privateKeyFromPem(keys.privateKey);
        const publicKey = forge.pki.publicKeyFromPem(keys.publicKey);
        
        console.log('📜 Creating self-signed certificate...');
        
        // Create certificate
        const cert = forge.pki.createCertificate();
        cert.publicKey = publicKey;
        cert.serialNumber = '01';
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
        
        const attrs = [
            { name: 'commonName', value: 'localhost' },
            { name: 'countryName', value: 'US' },
            { shortName: 'ST', value: 'State' },
            { name: 'localityName', value: 'City' },
            { name: 'organizationName', value: 'ChordyPi' },
            { shortName: 'OU', value: 'Development' }
        ];
        
        cert.setSubject(attrs);
        cert.setIssuer(attrs);
        cert.setExtensions([
            { name: 'basicConstraints', cA: true },
            { name: 'keyUsage', keyCertSign: true, digitalSignature: true, nonRepudiation: true, keyEncipherment: true, dataEncipherment: true },
            { name: 'extKeyUsage', serverAuth: true, clientAuth: true, codeSigning: true, emailProtection: true, timeStamping: true },
            { name: 'nsCertType', client: true, server: true, email: true, objsign: true, sslCA: true, emailCA: true, objCA: true },
            { name: 'subjectAltName', altNames: [{ type: 2, value: 'localhost' }, { type: 7, ip: '127.0.0.1' }] }
        ]);
        
        // Self-sign certificate
        cert.sign(privateKey, forge.md.sha256.create());
        
        // Convert to PEM format
        const pemCert = forge.pki.certificateToPem(cert);
        const pemKey = forge.pki.privateKeyToPem(privateKey);
        
        // Write to files
        fs.writeFileSync(certPath, pemCert);
        fs.writeFileSync(keyPath, pemKey);
        
        console.log('✅ Development certificates created successfully!');
        console.log('🔒 Certificate: ' + certPath);
        console.log('🔑 Private Key: ' + keyPath);
        console.log('⚠️  These are for development only!');
        
    } catch (fallbackError) {
        console.error('❌ Failed to create fallback certificates:', fallbackError.message);
        console.log('');
        console.log('📦 Installing node-forge for certificate generation...');
        console.log('Run: npm install node-forge');
        process.exit(1);
    }
}