<!-- .github/copilot-instructions.md - guidance for AI coding agents -->
# Copilot / AI Agent Instructions

Purpose: Help an AI agent become productive quickly in this small React + Vite colouring-book project.

- Quick start (dev):
  - Run dev server: `npm run dev` (calls `vite`) — see [package.json](package.json#L1-L50).
  - Build: `npm run build` / Preview: `npm run preview`.
  - Lint: `npm run lint` runs `eslint .` (project uses `@eslint/js`).

- Big picture architecture:
  - Single-page React app created with Vite + `@vitejs/plugin-react-swc` (see [vite.config.js](vite.config.js#L1-L20)).
  - UI is purely client-side. There are three main UI states controlled by `ekran` in `src/App.jsx`: `pocetna`, `kategorije`, `odabir`, `igra`.
  - Shapes are data-driven: shape definitions live in `OBLICI_DATA` (see [src/App.jsx](src/App.jsx#L1-L120)). The app renders two SVG layers (fill + outline) and a `canvas` layer for freehand drawing.
  - Interaction model: a tool state (`alat`) toggles between `'kist'`, `'kantica'`, and `'gumica'`. The `kantica` (bucket) fills SVG shapes by updating `bojeOblika` state. The `kist` and `gumica` draw on the `<canvas>`.

- Key patterns and gotchas (project-specific):
  - Data-driven SVG rendering: `renderOblici(false)` (fills) and `renderOblici(true)` (outlines) in `src/App.jsx` control both appearance and click handling. See `pointerEvents` usage — important to preserve click behavior.
    - Example: shapes set `pointerEvents: 'all'` so the bucket can click them; the canvas layer uses `style={{ pointerEvents: (alat === 'kantica') ? 'none' : 'auto' }}` to let clicks pass through when using the bucket.
  - Quiz mode: when `odabraniOblik === 'kviz'`, the app uses `generirajZadatak()` to set `zadatak` and validates bucket fills against `zadatak.boja`. The `'kviz'` id is special — don't accidentally remove it from selection lists.
  - Coordinate scaling for canvas: mouse coordinates are translated to canvas space using bounding rect scaling (`scaleX/scaleY`) before drawing — copy that logic if adding pointer features.
  - Naming and comments: many identifiers and comments are Croatian (e.g., `ekran`, `odabranaKategorija`, `povratak`). Preserve these names when editing to avoid confusion across the codebase.

- Files to inspect for examples and edits:
  - [src/App.jsx](src/App.jsx#L1-L400) — main app, most logic lives here (UI states, `OBLICI_DATA`, drawing logic, `renderOblici`).
  - [package.json](package.json#L1-L120) — scripts, dependencies (React 19, Vite, ESLint, plugin-react-swc).
  - [vite.config.js](vite.config.js#L1-L20) — plugin configuration.
  - [README.md](README.md#L1-L120) — template notes and ESLint pointers.

- Common change patterns an AI may be asked to implement:
  - Add a new shape: update `OBLICI_DATA` in `src/App.jsx` and ensure new shape's coordinates match grid zones commented near the top of the file.
  - Add a new tool: extend `alat` state usages, update UI tool buttons in the sidebar, and coordinate canvas pointerEvents and event handlers accordingly.
  - Change canvas size: update `CANVAS_WIDTH`/`CANVAS_HEIGHT` in `src/App.jsx` and verify viewBox values on SVG layers.

- Development & debugging tips:
  - Start dev server and use browser devtools for React/HMR inspection. Vite + SWC provides fast refresh; changes in `src/` should hot-reload.
  - To debug drawing coordinate issues, log computed `scaleX/scaleY` and the mapped offsets inside `startDrawing` and `draw` in `src/App.jsx`.
  - ESLint: run `npm run lint` and follow rules in the template; the repo uses `@eslint/js` and React plugins.

- What to not change lightly:
  - `pointerEvents` and layered rendering order: swapping layers or removing `pointerEvents: 'none'` on the canvas will break bucket-click behavior.
  - Special `kviz` flow and task generation — it's implemented inline in `src/App.jsx`; refactors should preserve semantics.

If anything here is unclear or you want more examples (for instance, a step-by-step change to `OBLICI_DATA` or adding a new tool), tell me which area to expand.
