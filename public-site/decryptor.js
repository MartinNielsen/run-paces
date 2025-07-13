const promptDiv = document.getElementById('prompt');
const passphraseInput = document.getElementById('passphrase');
const decryptButton = document.getElementById('decrypt');
const errorP = document.getElementById('error');

const encryptedSitePath = 'encrypted-site.bin';
const metaPath = 'encrypted-site.meta.json';

function injectContent(content) {
  document.open();
  document.write(content);
  document.close();
}

async function main() {
  const meta = await (await fetch(metaPath)).json();
  const cachedVersion = localStorage.getItem('decrypted-site-version');

  if (cachedVersion === meta.version) {
    const decryptedContent = localStorage.getItem('decrypted-site-content');
    injectContent(decryptedContent);
    return;
  }

  decryptButton.addEventListener('click', async () => {
    const passphrase = passphraseInput.value;
    if (!passphrase) {
      errorP.textContent = 'Please enter a passphrase.';
      return;
    }

    try {
      const encryptedContent = await (await fetch(encryptedSitePath)).text();
      const decryptedContent = sjcl.decrypt(passphrase, encryptedContent);

      localStorage.setItem('decrypted-site-version', meta.version);
      localStorage.setItem('decrypted-site-content', decryptedContent);

      injectContent(decryptedContent);
    } catch (e) {
      console.error(e);
      errorP.textContent = 'Wrong passphrase.';
    }
  });
}

main();
