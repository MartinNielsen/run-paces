# Encrypted GitHub Pages Site

This repository hosts a public GitHub Pages site that serves an encrypted private website. The private content is never committed directly to the repository; instead, it's encrypted locally and stored as a binary file within the public site.

## How it Works

1.  **Public Site (`public-site/`):** Contains `index.html` with a passphrase input UI, `decryptor.js` for client-side decryption, and the encrypted private site (`encrypted-site.bin`) along with its metadata (`encrypted-site.meta.json`).
2.  **Private Site (`private-site/`):** This directory holds your actual private HTML content. It is listed in `.gitignore` and is never directly committed.
3.  **Encryption:** The `scripts/encrypt-and-inject.js` script bundles and encrypts the content of `private-site/` using a passphrase from your local `.env` file.
4.  **Client-Side Decryption:** When a user visits the GitHub Pages site, `decryptor.js` checks for cached decrypted content. If not found or outdated, it prompts for the passphrase. Upon correct entry, it decrypts `encrypted-site.bin` and injects the private content into the DOM.
5.  **Deployment:** A GitHub Actions workflow automatically deploys the *contents* of the `public-site/` directory to your GitHub Pages site (e.g., `https://martinnielsen.github.io/run-paces/`) on every push to the `main` branch.

## Deployment Procedure for Private Content

To update your private site content and deploy it:

1.  **Update Private Content:** Make any desired changes to the files within the `private-site/` directory.

2.  **Run Encryption Script:** From the root of your repository, execute the encryption script:
    ```bash
    node scripts/encrypt-and-inject.js
    ```
    This script will:
    *   Bundle and encrypt your `private-site/` content.
    *   Generate `public-site/encrypted-site.bin`.
    *   Generate `public-site/encrypted-site.meta.json` with a new timestamp.
    *   Automatically stage these generated files for commit.

3.  **Commit and Push:** Commit your changes (including the newly generated `encrypted-site.bin` and `encrypted-site.meta.json`) and push to your `main` branch:
    ```bash
    git add .
    git commit -m "Update private site content"
    git push origin main
    ```

    The GitHub Actions workflow will then automatically deploy the updated `public-site/` content to your GitHub Pages.

## Local Development

To test the public site locally:

1.  Navigate to the `public-site/` directory:
    ```bash
    cd public-site
    ```
2.  Start a local HTTP server (e.g., using Python):
    ```bash
    python -m http.server 8000
    ```
3.  Open your browser and go to `http://localhost:8000`.

Remember to have your `ENCRYPTION_PASSPHRASE` set in a `.env` file at the root of your repository for the encryption script to work.