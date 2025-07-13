**Final PRD and Implementation Plan for Encrypted GitHub Pages Site**

---

### Project Goal

Build a public GitHub Pages-hosted site that displays a passphrase prompt. When a correct passphrase is entered, client-side JavaScript decrypts and injects a hidden private website. The private site is never committed to the repository; it is encrypted locally before commit and stored as a binary file in the public site directory.

The first private website to be implemented is the **Garmin Activity Viewer**.

---

### Execution and Development Environment

*   **OS:** Windows
*   **Shell:** PowerShell

Notice - if you are gemini cli you are being run from a powershell on windows. This affect which commands you should use for f.ex. creating and deleting files
---

### Components

#### 1. Public Site (`/public-site`)

*   `index.html`: Contains passphrase input UI
*   `decryptor.js`: Handles fetching, cache validation, decryption, and injection
*   `encrypted-site.bin`: Encrypted payload of the private site
*   `encrypted-site.meta.json`: Contains version timestamp used for cache invalidation

#### 2. Private Site (`/private-site`)

*   Contains the source code for the **Garmin Activity Viewer**.
*   Never committed (in `.gitignore`)

#### 3. Scripts (`/scripts`)

*   `encrypt-and-inject.js`: Bundles and encrypts the private site, and writes output files

#### 4. Git Infrastructure

*   `.env`: Contains `ENCRYPTION_PASSPHRASE`
*   `.env.example`: Template file for `.env`


#### 5. GitHub Actions

*   Deploys the *contents* of `public-site/` to the root of GitHub Pages on every push.
*   **Crucially, this action only deploys; it does not perform any encryption.**

---

### Functional Requirements

#### 🔐 Encryption & Decryption Infrastructure

*   **Encryption (Local):**
    *   Uses SJCL in Node.js to encrypt the bundled private site.
    *   AES (preferably GCM or safest available mode).
    *   Passphrase is taken from `.env`.
    *   Salt and IV prepended in structured format.
    *   Outputs `encrypted-site.bin` and `encrypted-site.meta.json` with a current ISO timestamp.
*   **Bootloader Behavior (Client-Side):**
    1.  Check `localStorage` for `decrypted-site-content` and `decrypted-site-version`.
    2.  Fetch `encrypted-site.meta.json`.
    3.  If cache is valid, inject content.
    4.  Else, prompt for passphrase.
    5.  On correct input:
        *   Fetch and decrypt `encrypted-site.bin`.
        *   Replace full DOM with decrypted content.
        *   Cache it in `localStorage`.
*   **GitHub Actions:**
    *   No access to `.env` or `/private-site/`.
    *   Deploys `public-site/` to GitHub Pages using `actions/deploy-pages`.

####  Viewer: Garmin Activity Viewer

*   **Map and Visualization**:
    *   Display activity traces using **React-Leaflet** and **Polyline** components.
    *   Color-code activities: **Run (red)**, **Hike (green)**, **Cycle (blue)**.
    *   Include a **legend** showing the color codes.
    *   Support zooming, panning, and interactive exploration of the map.
*   **Timeline and Controls**:
    *   **Material UI `Slider`** for selecting a time range (`track` attribute set to **false**).
    *   Use **two draggable dots** to define the start and end of the selected time window.
    *   **Progress Timeline Dot**: A single draggable dot that represents the current time, updating the displayed position on the map.
*   **Data Simplification**:
    *   Use **`simplify-js`** (Douglas-Peucker algorithm).
    *   Apply **dynamic re-simplification based on zoom level**.
*   **Mock Data**:
    *   Define a Garmin Activity Data Format (`type`, `coordinates`, `timestamps`).
    *   Create and use mock datasets for runs, hikes, and cycles.
*   **Build**:
    *   Bundle the `private-site/` into a **single file output** using Vite, Webpack, or Parcel.

---

### Non-Functional Requirements

*   **Security**: The private site must never be deployed unencrypted.
*   **Performance**: Must handle large GPS datasets smoothly using simplification.
*   **Portability**: Entire solution runs in-browser without server dependencies.
*   **Ease of Deployment**: Single-file output for private site simplifies encryption and deployment.
*   **Browser compatibility**: Chrome, Firefox, Safari (desktop and mobile).

---

### Implementation Plan & Tasks

The project will be implemented in stages, starting with the private site development, followed by the integration with the encryption and deployment pipeline.

#### Phase 1: Garmin Activity Viewer Development (`/private-site`)

*   [ ] **1.1: Project Setup**
    *   [ ] Initialize React + TypeScript project in `private-site/` using Vite.
    *   [ ] Install and configure Tailwind CSS.
*   [ ] **1.2: Map and UI Components**
    *   [ ] Install `react-leaflet`, `leaflet`, `@mui/material`, `@emotion/react`, `@emotion/styled`.
    *   [ ] Set up a basic map component with zoom/pan.
    *   [ ] Create a component to render activity polylines with correct colors.
    *   [ ] Build the legend component.
    *   [ ] Implement the timespan slider using Material UI `Slider`.
    *   [ ] Implement the progress timeline dot.
*   [ ] **1.3: Mock Data & Simplification**
    *   [ ] Create mock data files for different activities.
    *   [ ] Load and display mock data on the map.
    *   [ ] Install `simplify-js`.
    *   [ ] Implement dynamic simplification logic based on map zoom events.

#### Phase 2: Build & Encryption

*   [ ] **2.1: Single-File Build**
    *   [ ] Configure Vite (or other bundler) to output a single bundled HTML file.
*   [ ] **2.2: Encryption Script**
    *   [ ] Review and confirm `scripts/encrypt-and-inject.js` meets requirements.
    *   [ ] Install `crypto-js` or similar if not already present.
    *   [ ] Ensure the script correctly encrypts the bundled file from `private-site/dist`.

#### Phase 3: Public Site & Deployment

*   [ ] **3.1: Decryptor Page**
    *   [ ] Review and confirm `public-site/decryptor.js` and `public-site/index.html` are complete.
*   [ ] **3.2: GitHub Actions Deployment**
    *   [ ] Review `deploy.yml` to ensure it correctly deploys the `public-site/` directory.

#### Phase 4: Final Testing

*   [ ] **4.1: End-to-End Test**
    *   [ ] Run the encryption script.
    *   [ ] Commit the encrypted files.
    *   [ ] Open `public-site/index.html` locally, enter passphrase, and verify the Garmin viewer loads and functions correctly.
*   [ ] **4.2: Cache Test**
    *   [ ] Verify cache versioning and update triggers work as expected.