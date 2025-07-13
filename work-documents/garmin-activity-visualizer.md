# Garmin Activity Viewer - Full PRD and Detailed Implementation Tasks

## Product Requirements Document (PRD)

### Overview

Build an **encrypted Garmin Activity Viewer** web app that displays running, hiking, and cycling routes on a map. The app will include time-based filtering via a slider and real-time route progress visualization using a draggable timeline dot. The private application will be built into a **single file**, encrypted, and deployed within a **public decryptor site**.

### Project Structure

* **Public Site** (root directory)

  * Contains the decryptor web page and scripts.
  * Users will initially see the decryptor UI and input a passphrase.
  * After decryption, the decrypted private app will be injected into the DOM and replace the public site.

* **Private Site** (`private-site/` directory)

  * Contains the Garmin Activity Viewer.
  * Built into a **single file output** (e.g., `bundle.html` or `bundle.js`).

### Functional Requirements

#### Map and Visualization

* Display activity traces using **React-Leaflet** and **Polyline** components.
* Color-code activities: **Run (red)**, **Hike (green)**, **Cycle (blue)**.
* Include a **legend** showing the color codes.
* Support zooming, panning, and interactive exploration of the map.

#### Timeline and Controls

* **Material UI `Slider`** for selecting a time range.

  * `track` attribute set to **false** to hide the track.
  * Use **two draggable dots** to define the start and end of the selected time window.
* **Progress Timeline Dot**

  * Single draggable dot that represents the current time within the selected range.
  * Moving the dot updates the displayed position on the map, showing progress through the activity.

#### Data Simplification

* Use **`simplify-js`** to implement the **Douglas-Peucker algorithm**.
* Apply **dynamic re-simplification based on zoom level**:

  * **High zoom**: Render more detail (less simplification).
  * **Low zoom**: Render simplified traces to optimize performance.

#### Mock Data

* Define a **Garmin Activity Data Format**, e.g.:

  ```json
  [
    {
      "type": "run",
      "coordinates": [[lon1, lat1], [lon2, lat2], ...],
      "timestamps": ["2025-07-01T10:00:00Z", "2025-07-01T10:05:00Z", ...]
    }
  ]
  ```
* Create mock datasets for **runs, hikes, and cycles**.
* Use mock data to test polyline rendering, time filtering, and progress display.

#### Build and Deployment

* Bundle the `private-site/` into a **single file output**.

  * **Single HTML file** (recommended for simpler injection), or
  * **Single JS file** that generates the app dynamically.
* Use a bundler: **Vite**, **Webpack**, or **Parcel**.

#### Encryption

* Use **AES encryption** with a JavaScript library (e.g., `crypto-js`, MIT-licensed).
* Encrypt the single-file private site build.
* Place the encrypted output into the **public site**.

#### Runtime Behavior

* On first load, the user is presented with the decryptor UI.
* The user enters a **passphrase**.
* After successful decryption, the private site is injected into the DOM.
* The private Garmin Activity Viewer takes over the entire page.

### Non-Functional Requirements

* **Security**: The private site must never be deployed unencrypted.
* **Performance**: Must handle large GPS datasets smoothly using simplification.
* **Portability**: Entire solution runs in-browser without server dependencies.
* **Ease of Deployment**: Single-file output for private site simplifies encryption and deployment.

---

## Detailed Implementation Tasks

### 1. Setup and Boilerplate

* [ ] **Initialize the project**

  * Create `private-site/` directory.
  * Set up **React + TypeScript** with your chosen bundler (Vite recommended).
* [ ] **Install Tailwind CSS**

  * Configure Tailwind in the build pipeline for rapid UI styling.

### 2. Map and UI Components

* [ ] **Install React-Leaflet and Leaflet**

  * Set up a basic map with zoom and pan functionality.
* [ ] **Create Polyline Components**

  * Render activity paths using `Polyline`.
  * Color code each activity type.
* [ ] **Build Legend Component**

  * Display activity type and corresponding color.
* [ ] **Implement Timespan Slider**

  * Use Material UI `Slider` with `track=false`.
  * Add two draggable handles for selecting time range.
* [ ] **Progress Timeline Dot**

  * Implement a draggable single dot to show current progress on the map.
  * Update the map marker position in real-time.

### 3. Mock Data Integration

* [ ] **Define Data Format**

  * Use `type`, `coordinates`, and `timestamps` fields.
* [ ] **Create Mock Activities**

  * Generate sample data for runs, hikes, and cycles.
* [ ] **Implement Data Loader**

  * Load mock data into the app for development and testing.

### 4. Data Simplification

* [ ] **Install simplify-js**

  * Add it as a project dependency.
* [ ] **Implement Simplification Logic**

  * Simplify GPS points dynamically based on current zoom level.
* [ ] **Integrate with React-Leaflet**

  * Recalculate simplified points on zoom events.

### 5. Build and Encryption Pipeline

* [ ] **Configure Single File Build**

  * Set up bundler to output a single HTML or JS file.
* [ ] **Write Encryption Script**

  * Use `crypto-js` or equivalent.
  * Encrypt the single-file output.
* [ ] **Place Encrypted File in Public Site**

### 6. Public Decryptor Site

* [ ] **Create Decryptor Web Page**

  * Prompt user for passphrase.
* [ ] **Implement Decryption Script**

  * Decrypt the encrypted private site file.
* [ ] **Inject into DOM**

  * Dynamically replace the public site with the decrypted private app.

### 7. Testing and QA

* [ ] **Test with Mock Data**

  * Verify map rendering, time filtering, and progress dot behavior.
* [ ] **Test Data Simplification**

  * Check performance at different zoom levels.
* [ ] **Test Encryption/Decryption Flow**

  * Ensure the decryptor page correctly loads and injects the private app.
* [ ] **Validate Single File Output**

  * Confirm all assets are bundled properly.

---

## Deliverables

* Fully functional **Garmin Activity Viewer** packaged as a **single encrypted file**.
* **Mock datasets** for development and testing.
* **Public decryptor site** that handles passphrase input, decryption, and injection.

This document is complete and ready to hand over to an implementation AI or development team for execution.
