const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const keysDir = path.join('src', 'keys');
const publicDir = 'public';

if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
}
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Generate AES key
const aesKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

// Generate RSA keys
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Your Supabase credentials
const credentials = {
  url: 'https://ebnnzdclfvftpkqyoxrz.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVibm56ZGNsZnZmdHBrcXlveHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzQyMzQsImV4cCI6MjA1NjgxMDIzNH0.lBNohOaAkkDlim2z5B94BKolgstVfNIGYNNazCFCev4'
};

// Encrypt credentials with AES
const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
let encryptedData = cipher.update(JSON.stringify(credentials), 'utf8', 'base64');
encryptedData += cipher.final('base64');
const authTag = cipher.getAuthTag();

// Encrypt AES key with RSA
const encryptedKey = crypto.publicEncrypt(
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  },
  aesKey
);

// Save everything
const dataToSave = {
  data: encryptedData,
  iv: iv.toString('base64'),
  authTag: authTag.toString('base64'),
  encryptedKey: encryptedKey.toString('base64')
};

fs.writeFileSync('public/encrypted-credentials.json', JSON.stringify(dataToSave));
fs.writeFileSync('src/keys/private-key.js', 
  `export const privateKey = \`${privateKey}\`;`
);

console.log('Encryption complete! Keys and encrypted data have been saved.');