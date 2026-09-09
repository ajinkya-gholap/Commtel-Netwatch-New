# Commtel NetWatch

A single-screen NOC dashboard for monitoring routers, switches, firewalls, cameras, NVRs and sensors across Commtel's sites. Front-end only — `src/data/devices.js` stands in for a backend API response.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`). `npm run build` produces a production bundle; `npm run preview` serves that bundle locally.

## Component tree

```
App                          (state: filters, selectedId)
├── Header                   (fleet summary line)
├── AlertBanner               (worst critical device, or nothing)
├── StatsRow
│   └── StatTile × 4          (Online / Degraded / Offline / Avg uptime)
├── FilterBar                 (search, status/site/sort, Reset)
└── main
    ├── DeviceList
    │   ├── DeviceCard × N       (each wraps a StatusBadge)
    │   └── EmptyState           (only when the filtered list is empty)
    └── DeviceDetail             (only when a device is selected)
```

`App` is the only component that imports the raw device data. It converts it to `Device` instances once, then derives the filtered/sorted list and the selected device *during render* — there's no separate `filteredDevices` state, and `selectedId` simply stops resolving to anything once its device is filtered out, which is what closes the detail panel automatically. Every other component receives plain props and calls back up (`onSelect`, `onFilterChange`, `onReset`, `onInspect`) rather than touching `App`'s state directly. All device-specific math (health score, staleness, load, display text) lives in the `Device` class in `src/models/Device.js`, so components only ever ask a `Device` instance for a fact instead of recomputing it from raw fields.

## Where the four conditional patterns are used

1. **Guard clause / early return `null`**
   `AlertBanner` (`src/components/AlertBanner.jsx`) returns `null` immediately if no device is critical. Chosen because the component either has one specific thing to render or nothing at all — there's no partial state worth building JSX for.
   `DeviceList` also uses this to hand off to `EmptyState` when the filtered set is empty, for the same reason.

2. **`if / else if / else` chain assigning to a variable before the `return`**
   - `StatusBadge` picks its label and modifier class from `status` (4 branches: online/warning/offline/unknown).
   - `DeviceCard` picks its footer note (offline → no heartbeat, saturated → link saturated, stale firmware → firmware warning, else → last seen).
   - `DeviceDetail` picks the recommended action sentence (offline → dispatch engineer, critical + maintenance planned → wait for window, saturated → raise capacity request, stale firmware → schedule upgrade, else → no action needed).
   Chosen over nested ternaries because each branch produces a full sentence built from different device facts — a ternary chain here would be much harder to read than four explicit checks.

3. **`&&` short-circuit in JSX**
   - The alert-count chip in `DeviceCard` only renders when `device.alerts > 0`.
   - The Reset button in `FilterBar` only renders when `isActive` is true.
   - The `DeviceDetail` panel in `App` only renders when a device is selected.

4. **Ternary inside JSX**
   Small inline choices only, e.g. `device.alerts === 1 ? 'alert' : 'alerts'` for pluralisation, and the `1 device needs…` vs `N devices need…` copy in `AlertBanner`.

## Notes on styling

Plain CSS via CSS Modules (one `Component.module.css` per component, plus shared design tokens in `src/styles/variables.css`) — no UI framework. Class names follow BEM-ish conventions (`card`, `card__meta`, `card--selected`) and are composed with the `classes()` helper in `src/utils/format.js` rather than string concatenation.

## Stretch goals not attempted

Live refresh simulation, grouped-by-site sections, PropTypes, URL-persisted filters, and per-device sparklines were left out to keep the core requirements (1–6) solid within scope.
