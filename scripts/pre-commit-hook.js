const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PRIVATE_SITE_VERSION_FILE = 'private-site-version.txt';
const LAST_ENCRYPTION_TIMESTAMP_FILE = '.last-encryption-timestamp';

function getLastModified(file) {
  const stats = fs.statSync(file);
  return stats.mtimeMs;
}

function getLastEncryptionTimestamp() {
  if (fs.existsSync(LAST_ENCRYPTION_TIMESTAMP_FILE)) {
    return parseInt(fs.readFileSync(LAST_ENCRYPTION_TIMESTAMP_FILE, 'utf8'), 10);
  }
  return 0;
}

const lastEncryptionTimestamp = getLastEncryptionTimestamp();
const lastPrivateSiteVersionModification = getLastModified(PRIVATE_SITE_VERSION_FILE);

if (lastPrivateSiteVersionModification > lastEncryptionTimestamp) {
  console.log('Changes detected in private-site-version.txt. Running encryption script...');
  try {
    execSync('node scripts/encrypt-and-inject.js');
    console.log('Encryption successful. Staging encrypted files...');
    execSync('git add public-site/encrypted-site.bin public-site/encrypted-site.meta.json');
    fs.writeFileSync(LAST_ENCRYPTION_TIMESTAMP_FILE, Date.now().toString());
    console.log('Pre-commit hook finished.');
  } catch (error) {
    console.error('Encryption failed. Commit aborted.');
    console.error(error);
    process.exit(1);
  }
}

process.exit(0);
