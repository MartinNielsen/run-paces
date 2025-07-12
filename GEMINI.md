**Final PRD and Implementation Plan for Encrypted GitHub Pages Site**

---

### Project Goal

Build a public GitHub Pages-hosted site that displays a passphrase prompt. When a correct passphrase is entered, client-side JavaScript decrypts and injects a hidden private website. The private site is never committed to the repository; it is encrypted locally before commit and stored as a binary file in the public site directory.

---

### Execution Environment

*   **OS:** Windows
*   **Shell:** PowerShell

---

### Components

#### 1. Public Site (`/public-site`)

*   `index.html`: Contains passphrase input UI
*   `decryptor.js`: Handles fetching, cache validation, decryption, and injection
*   `encrypted-site.bin`: Encrypted payload of the private site
*   `encrypted-site.meta.json`: Contains version timestamp used for cache invalidation

#### 2. Private Site (`/private-site`)

*   Initially a static HTML "Hello World"
*   Never committed (in `.gitignore`)

#### 3. Scripts (`/scripts`)

*   `encrypt-and-inject.js`: Bundles and encrypts the private site, and writes output files

#### 4. Git Infrastructure

*   `.git/hooks/pre-commit`: Runs encryption script before every commit that includes changes to `/private-site/`
*   `.env`: Contains `ENCRYPTION_PASSPHRASE`
*   `.env.example`: Template file for `.env`
*   `private-site-version.txt`: A file containing an integer. This file should be manually updated when changes are made to the `private-site/` directory. This file is used to trigger the pre-commit hook.

#### 5. GitHub Actions

*   Deploys `public-site/` to GitHub Pages on every push

---

### Functional Requirements

#### 🔐 Encryption (Local)

*   Uses SJCL in Node.js to encrypt bundled private site
*   AES (preferably GCM or safest available mode)
*   Passphrase is taken from `.env`
*   Salt and IV prepended in structured format
*   Outputs:
    *   `encrypted-site.bin`
    *   `encrypted-site.meta.json` with current ISO timestamp

#### 🧠 Bootloader Behavior (Client-Side)

1.  Check `localStorage` for:
    *   `decrypted-site-content`
    *   `decrypted-site-version`
2.  Fetch `encrypted-site.meta.json`
3.  If cache is valid, inject content
4.  Else, prompt for passphrase
5.  On correct input:
    *   Fetch and decrypt `encrypted-site.bin`
    *   Replace full DOM with decrypted content
    *   Cache it in `localStorage`

#### 🧷 Pre-Commit Hook

*   Only runs when `private-site-version.txt` changes
*   If encryption fails or passphrase is missing, the commit is blocked
*   If successful, encrypted output is staged with `git add`

#### 🛰️ GitHub Actions

*   No access to `.env` or `/private-site/`
*   Deploys `public-site/` to GitHub Pages using `actions/deploy-pages`

---

### Non-Functional Requirements

*   Entirely static hosting (no server logic)
*   Browser compatibility: Chrome, Firefox, Safari (desktop and mobile)
*   No third-party authentication or cookies
*   All crypto happens in the browser using SJCL

---

### Implementation Tasks for LLM Agent

#### 📁 File and Repo Setup
*   **Task:** Create directory structure.
*   **Status:** Done

#### 🔐 Encryption Logic (Node.js)
*   **Task:** Implement `encrypt-and-inject.js` using SJCL.
*   **Status:** Done
*   **Task:** Bundle HTML from `/private-site` into a single string.
*   **Status:** Done
*   **Task:** Add AES encryption with key from `.env` passphrase.
*   **Status:** Done
*   **Task:** Create and write `encrypted-site.meta.json`.
*   **Status:** Done
*   **Task:** Auto-stage the result.
*   **Status:** Done

#### 💻 Bootloader (Browser JS)
*   **Task:** Implement `decryptor.js`.
*   **Status:** Done
*   **Task:** Implement fallback UI in `index.html` for wrong passphrase.
*   **Status:** Done

#### 🧷 Pre-Commit Hook
*   **Task:** Add pre-commit hook in `.git/hooks/`.
*   **Status:** In Progress (chmod failed, testing execution)

#### 🚀 GitHub Action
*   **Task:** Write `deploy.yml` workflow.
*   **Status:** Not Started

#### ✅ Finalize & Test
*   **Task:** Create test content in `/private-site/index.html`.
*   **Status:** Done
*   **Task:** Run end-to-end test with commit + decrypt in browser.
*   **Status:** Not Started
*   **Task:** Verify cache versioning and update triggers.
*   **Status:** Not Started

---

### Future Enhancements (Optional)

*   React build support
*   Zip packaging and unpacker module
*   Key rotation or multi-passphrase support
