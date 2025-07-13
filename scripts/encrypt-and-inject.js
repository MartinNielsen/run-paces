require('dotenv').config();
const fs = require('fs');
const sjcl = require('sjcl');

const privateSitePath = 'private-site/dist/index.html';
const encryptedSitePath = 'public-site/encrypted-site.bin';
const metaPath = 'public-site/encrypted-site.meta.json';

const passphrase = process.env.ENCRYPTION_PASSPHRASE;

if (!passphrase) {
  console.error('ENCRYPTION_PASSPHRASE not set in .env file');
  process.exit(1);
}

const privateSiteContent = fs.readFileSync(privateSitePath, 'utf8');

const encrypted = sjcl.encrypt(passphrase, privateSiteContent);

fs.writeFileSync(encryptedSitePath, encrypted);

const meta = {
  version: new Date().toISOString(),
};

fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

console.log('Encryption successful!');
