**Final PRD and Implementation Plan for Encrypted GitHub Pages Site**

---

### Project Goal

Build a public GitHub Pages-hosted site that displays a passphrase prompt. When a correct passphrase is entered, client-side JavaScript decrypts and injects a hidden private website. The private site is never committed to the repository; it is encrypted locally before commit and stored as a binary file in the public site directory.

---

### Components

#### 1. Public Site (`/public-site`)

* `index.html`: Contains passphrase input UI
* `decryptor.js`: Handles fetching, cache validation, decryption, and injection
* `encrypted-site.bin`: Encrypted payload of the private site
* `encrypted-site.meta.json`: Contains version timestamp used for cache invalidation

#### 2. Private Site (`/private-site`)

* Initially a static HTML "Hello World"
* Never committed (in `.gitignore`)

#### 3. Scripts (`/scripts`)

* `encrypt-and-inject.js`: Bundles and encrypts the private site, and writes output files

#### 4. Git Infrastructure

* `.git/hooks/pre-commit`: Runs encryption script before every commit that includes changes to `/private-site/`
* `.env`: Contains `ENCRYPTION_PASSPHRASE`
* `.env.example`: Template file for `.env`

#### 5. GitHub Actions

* Deploys `public-site/` to GitHub Pages on every push

---

### Functional Requirements

#### 🔐 Encryption (Local)

* Uses SJCL in Node.js to encrypt bundled private site
* AES (preferably GCM or safest available mode)
* Passphrase is taken from `.env`
* Salt and IV prepended in structured format
* Outputs:

  * `encrypted-site.bin`
  * `encrypted-site.meta.json` with current ISO timestamp

#### 🧠 Bootloader Behavior (Client-Side)

1. Check `localStorage` for:

   * `decrypted-site-content`
   * `decrypted-site-version`
2. Fetch `encrypted-site.meta.json`
3. If cache is valid, inject content
4. Else, prompt for passphrase
5. On correct input:

   * Fetch and decrypt `encrypted-site.bin`
   * Replace full DOM with decrypted content
   * Cache it in `localStorage`

#### 🧷 Pre-Commit Hook

* Only runs when files in `/private-site/` change
* If encryption fails or passphrase is missing, the commit is blocked
* If successful, encrypted output is staged with `git add`

#### 🛰️ GitHub Actions

* No access to `.env` or `/private-site/`
* Deploys `public-site/` to GitHub Pages using `actions/deploy-pages`

---

### Non-Functional Requirements

* Entirely static hosting (no server logic)
* Browser compatibility: Chrome, Firefox, Safari (desktop and mobile)
* No third-party authentication or cookies
* All crypto happens in the browser using SJCL

---

### Implementation Tasks for LLM Agent

#### 📁 File and Repo Setup

FYI - You are already in the root of a newly create github repo that is ready to commit your changes to.

1. Create directory structure - `.gitignore` and `.env.example` already exist (also .env when you get to running stuff)

#### 🔐 Encryption Logic (Node.js)

3. Implement `encrypt-and-inject.js` using SJCL
4. Bundle HTML from `/private-site` into a single string
5. Add AES encryption with key from `.env` passphrase
6. Create and write `encrypted-site.meta.json`
7. Auto-stage the result

#### 💻 Bootloader (Browser JS)

8. Implement `decryptor.js`

   * Check localStorage
   * Compare against `encrypted-site.meta.json`
   * On mismatch: fetch + decrypt `encrypted-site.bin`
   * Inject content and update localStorage
9. Implement fallback UI in `index.html` for wrong passphrase

#### 🧷 Pre-Commit Hook

10. Add pre-commit hook in `.git/hooks/`

    * Checks `/private-site/` diff
    * Blocks commit on failure

#### 🚀 GitHub Action

11. Write `deploy.yml` workflow

    * Pushes `/public-site` to Pages
    * Use `actions/checkout` + `actions/deploy-pages`

#### ✅ Finalize & Test

12. Create test content in `/private-site/index.html`
13. Run end-to-end test with commit + decrypt in browser
14. Verify cache versioning and update triggers

---

### Future Enhancements (Optional)

* React build support
* Zip packaging and unpacker module
* Key rotation or multi-passphrase support
