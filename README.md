# BiO2 Habitat Design Tool

<p align="center">
  <em>A sci-fi, data-rich tool for assembling & stress-testing space habitats.</em>
</p>

<div align="center">

<!-- 🔗 3 CTA rõ ràng & to -->
<a href="https://bio2-project.vercel.app/">
  <img alt="Live Site"
       src="https://img.shields.io/badge/Live%20Site-bio2--project.vercel.app-00FF85?style=for-the-badge&logo=vercel" />
</a>
<a href="./public/Documents/BiO2_Project_Pitch_Deck.pdf">
  <img alt="Pitch Deck (PDF)"
       src="https://img.shields.io/badge/Pitch%20Deck-PDF-4AA3FF?style=for-the-badge&logo=readme" />
</a>
<a href="./public/Videos/BiO2%20Project%20Demo.mp4">
  <img alt="Demo Video"
       src="https://img.shields.io/badge/Demo-Video-FF7847?style=for-the-badge&logo=youtube" />
</a>

</div>

<!-- 🎥 Video phát thẳng trên README -->
<p align="center">
  <video src="./public/Videos/BiO2_Project_Demo.mp4"
         width="860"
         controls
         playsinline
         preload="metadata">
    Your browser does not support the video tag. Watch the demo:
    <a href="./public/Videos/BiO2_Project_Demo.mp4">BiO2_Project_Demo</a>.
  </video>
  <br />
  <sub>🎯 Nếu GitHub không tự phát video, bấm vào nút <strong>Demo-Video</strong> phía trên để mở trực tiếp file MP4.</sub>
</p>

---

## Quick Links

- 🚀 **Live App:** https://bio2-project.vercel.app/
- 📑 **Pitch Deck (PDF):** `./public/Documents/BiO2_Project_Pitch_Deck.pdf`
- 🎥 **Demo (MP4):** `./public/Videos/BiO2_Project_Demo.mp4`

---

## Table of Contents

- [Overview](#overview)
- [Core Capabilities](#core-capabilities)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Telemetry & Viability Modelling](#telemetry--viability-modelling)
- [Mission Alerts](#mission-alerts)
- [Key Workflows](#key-workflows)
- [Getting Started](#getting-started)
- [Project Scripts](#project-scripts)
- [Assets & Exports](#assets--exports)
- [Roadmap Ideas](#roadmap-ideas)
- [Contributing](#contributing)

## Overview

BiO2 Habitat Design Tool helps engineers, students, and explorers prototype living modules beyond Earth. Users can configure mission parameters, assemble habitats in 2D/3D, monitor real-time telemetry, and export polished reports. All computations run client-side, allowing rapid iteration without a backend.

## Demo

> 🎥 Watch the product walkthrough: [BiO2 Project Demo](./public/Videos/BiO2_Project_Demo.mp4)

<div align=\"center\">

[![Live Site](https://img.shields.io/badge/Live%20Site-bio2--project.vercel.app-00FF85?style=for-the-badge&logo=vercel)](https://bio2-project.vercel.app/)
[![Pitch Deck](https://img.shields.io/badge/Pitch%20Deck-PDF-4AA3FF?style=for-the-badge&logo=readme)](./public/Documents/BiO2_Project_Pitch_Deck.pdf)
[![Demo Video](https://img.shields.io/badge/Demo-Video-FF7847?style=for-the-badge&logo=youtube)](./public/Videos/BiO2_Project_Demo.mp4)

</div>
## Core Capabilities

| Category | Highlights |
| --- | --- |
| **Habitat Builder** | Drag-and-drop grid builder, rotation & resizing, snap-to-grid placement, orbit-camera 3D preview with day/night lighting. |
| **Module Library** | 13+ curated modules (Airlock, BiO2 Hydrogel pods, Life Support, Lab, Power, Thermal, etc.) with built-in performance metrics. |
| **Mission Telemetry** | Oxygen balance, power load, water recycling, hydrogel health, thermal loads, structural stress, radiation shielding, volume per crew, Mission Viability score. |
| **Alerts & Rules** | Automated warnings for O₂ deficit, power shortfall, insufficient shielding, cramped volume, low hydrogel vitality, missing recycling. |
| **Persistence** | Save/load designs to localStorage, import JSON blueprints, capture layout thumbnails, keep an active project cache. |
| **Exports** | Generate PNG renders, PDF mission briefs with charts & stats, and raw JSON for interoperability. |
| **Results Analytics** | Dedicated page showing space allocation pie, oxygen vs CO₂ timeline, density/shielding heatmap, design comparison. |
| **Community & Learning** | Mock community gallery for inspiration, dashboard with badges, resources hub with downloadable educator kits. |

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript.
- **Styling:** TailwindCSS 4, Radix UI components, class-variance-authority, Lucide icons.
- **3D & Interaction:** React Three Fiber, Drei helpers, react-rnd for 2D drag/resize.
- **Charts & UI Enhancements:** Recharts, Sonner toasts, Radix Tabs/Dialog components.
- **Exports:** html-to-image, jsPDF, date-fns.
- **State & Utilities:** Local state hooks, zod for potential validation, utility helpers in `lib/`.

## System Architecture

```text
User Action → Module Library / Mission Panel → Habitat State (modules + mission config)
           ↘                            ↘
          Canvas 2D (react-rnd)          Telemetry (computeHabitatMetrics)
             ↘                              ↘
           Canvas 3D (R3F)           Alerts + Viability Score + Simulation Charts
             ↘                              ↘
           Exports (PNG/PDF)          Dashboard / Results view / localStorage persistence
```

- **Data Flow:** Modules are stored with position, size, rotation, and baseline metrics. When resized, metrics scale relative to area. Telemetry aggregates module contributions plus crew requirements to compute net oxygen, power, shielding effectiveness, etc.
- **3D Rendering:** React Three Fiber renders each module as a lit, emissive box on a grid with orbit controls and lighting presets.
- **Persistence:** Designs are cached under `bio2.projects` (array) and `bio2.activeProject` (current snapshot) in `localStorage`.

## Project Structure

```text
app/                  Next.js routes (home, design, dashboard, results, community, resources, achievements, team, contact)
components/
  ├─ hero-section.tsx    Landing hero + demo dialog
  ├─ features-section.tsx Feature highlights
  ├─ header.tsx          Global navigation bar
  ├─ design-workspace.tsx Main layout orchestrating builder, telemetry, and exports
  ├─ design-canvas.tsx   2D canvas + react-rnd logic
  ├─ scene-3d.tsx        React Three Fiber scene
  ├─ mission-parameters.tsx Mission input sidebar
  ├─ module-library.tsx  Catalog of habitat modules
  ├─ telemetry-panel.tsx Telemetry/alerts UI
  ├─ results-view.tsx    Simulation analytics page
  ├─ dashboard-view.tsx  Saved projects & highlights
  └─ ...                 Community, resources, achievements, contact sections
lib/
  └─ calculations.ts     Core metric and viability computations
types/
  └─ habitat.ts          TypeScript interfaces for Module, MissionConfig, HabitatDesign
public/
  ├─ Documents/          PDF resources (1.pdf, 2.pdf, 3.pdf, NASA.pdf)
  └─ Videos/             Demo clips for landing page
```

## Telemetry & Viability Modelling

`computeHabitatMetrics(modules, missionConfig)` performs:

1. **Aggregate module metrics** (oxygen generation, power output, shielding, water processing, thermal load, crew capacity, mass) scaled by module area.
2. **Add crew demands:** O₂ consumption `0.84 L/min/crew`, power baseline `0.3 kW/crew`.
3. **Compute derived values:** net oxygen/power, total volume, volume-per-crew, shielding effectiveness (relative to destination requirements), water recycling efficiency, hydrogel vitality projections.
4. **Score viability:** Weighted combination of net oxygen/power positivity, water throughput, volume-per-crew, shielding ratio, plus baseline credit for positive balances.
5. **Generate alerts:** Emitted when thresholds fall below mission needs.
6. **Produce simulation data:** Synthetic daily trend lines for O₂, power, water, and hydrogel health used in charts.

## Mission Alerts

- **Critical:** Oxygen generation insufficiency, power deficit, crew capacity shortfall.
- **Warning:** Low hydrogel vitality (<50% or <14 days life), missing water recycling, volume-per-crew < 10 m³, shielding below destination requirement, elevated structural stress (~ payload/crew count).

## Key Workflows

### 1. Designing a Habitat
1. Open **Start Designing** → `/design`.
2. Configure mission (destination, crew size, duration, radiation) in the left sidebar.
3. Drag modules from the library onto the 2D canvas. Resize or rotate as needed; switch to **3D** for spatial inspection.
4. Monitor telemetry on the right panel; resolve alerts by adding/upgrading modules.

### 2. Saving, Loading, Exporting
1. Click **Save** → fill name & notes → project stored in localStorage (and shown in Dashboard).
2. Use **Load** to import a JSON blueprint.
3. **Export** options:
   - **JSON Blueprint:** machine-readable layout.
   - **PNG Layout:** high-res render of the 2D canvas.
   - **PDF Report:** includes mission info, metrics summary, viability score, and embedded layout snapshot.

### 3. Reviewing Results
1. From Dashboard or via **Preview / Results**, open `/results` to view analytics for the active design.
2. Explore space allocation pie chart, oxygen vs CO₂ timeline, crew density & shielding heatmap, and stability chips.
3. Select another saved design for side-by-side comparison.

### 4. Learning & Sharing
- **Dashboard:** quick stats, badges, progress roadmap, saved project thumbnails.
- **Community Gallery:** curated example habitats with viability scores, likes, remix buttons (mock data).
- **Resources:** download PDFs (Educator Kit, Engineering Workbook, Mission Brief) and review the NASA brief.

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Development
```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
# → http://localhost:3000

# Build for production
npm run build

# Run production build locally
npm start
```

If you encounter `_next` chunk errors during development, delete the `.next/` folder and restart the dev server.

### Environment Variables
None required for the current localStorage-based implementation.

## Project Scripts
| Script | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode. |
| `npm run build` | Create optimized production build. |
| `npm start` | Launch the built app (defaults to port 3000). |

## Assets & Exports
- **Videos:** `public/Videos/demo1.mp4`, `demo2.mp4` for landing page demos.
- **Documents:** `public/Documents/1.pdf`, `2.pdf`, `3.pdf`, and the [NASA briefing](./public/Documents/NASA.pdf).
- **Thumbnails:** generated dynamically when saving designs (PNG base64 saved to localStorage).
- **Exports:** stored via browser download (JSON, PNG, PDF).

## Roadmap Ideas
- 🔒 User authentication & cloud sync for collaborative editing.
- 📡 Real sensor integration for live telemetry feeds.
- 🤖 AI layout assistant to suggest module placement based on mission goals.
- 🌐 Multi-language support and improved accessibility contrasts.
- 🛰️ Advanced physics (radiation storm scenarios, redundancy modelling).

## Contributing
Contributions, suggestions, and bug reports are welcome! Fork the repo, create a feature branch, and open a pull request once your changes pass `npm run build`. For larger features, please open an issue to discuss scope first.

---

Built for explorers who want to prototype the future of living beyond Earth. 🚀


