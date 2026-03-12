# Multi-Year Stats Support — Design Spec

**Date:** 2026-03-12
**Branch:** wbb-dashboard-super-tables
**Status:** Approved

---

## Overview

Add multi-year stats support to the BSA Women's Basketball Dashboard. Users can browse any season from 2017–2026 and view a player's full career trajectory (stats across all seasons they appear in).

**Use cases:**
1. **Season browser** — select a year to see all players for that season (default: 2025)
2. **Career view** — click any player to see their stats charted and tabled across every season they played

---

## Approach

**Dynamic fetch (Approach B):** CSV files are served from `/public/data/` and fetched on demand when a year is first selected. Already-loaded years are cached in React context, so switching back to a previously-viewed season is instant. The app bundle stays small.

---

## Section 1: Data Preparation

### Advanced Stats Aggregation Script

A Python script (`scripts/aggregate_advanced_stats.py`) reads per-team advanced CSV files from `advancedData/YYYY/` and concatenates them into a single `sr_advanced_YYYY.csv` per year, matching the column schema of the existing `sr_advanced_2025.csv`:

```
player_sr_link, player_name, school, season, pos, games, games_started, mp,
per, ts_pct, fg3a_per_fga_pct, fta_per_fga_pct, pprod, orb_pct, drb_pct,
trb_pct, ast_pct, stl_pct, blk_pct, tov_pct, usg_pct, ows, dws, ws,
ws_per_40, obpm, dbpm, bpm
```

Runs for years 2017–2026. Output goes to `data/yearly_data/sr_advanced_YYYY.csv`.

### Public Data Directory

All CSV files are copied to `dashboard/public/data/`:
- `sr_data_YYYY.csv` (basic stats, 2017–2026)
- `sr_advanced_YYYY.csv` (advanced stats, 2017–2026)

The existing static Vite imports (`import csvRaw from './sr_data_2025.csv?raw'`) are removed.

**Note:** ON3 transfer data and class year data remain 2025-only (files don't exist for other years). `transferInfo` and `year` fields will be null/unknown for non-2025 seasons.

---

## Section 2: Data Layer

### `fetchYearData(year: number): Promise<TransferPlayer[]>`

Replaces the current static data loading in `transferData.ts`.

- Fetches `/data/sr_data_YYYY.csv` and `/data/sr_advanced_YYYY.csv` in parallel
- Parses and joins on `player_sr_link` — same join logic as current code
- Returns `TransferPlayer[]` — identical shape, all existing components remain untouched
- For 2025 only: also fetches ON3 and class year CSVs (same as current behavior)

### `YearDataContext`

A new React context holding:
```typescript
interface YearDataContext {
  cache: Map<number, TransferPlayer[]>;
  loadYear: (year: number) => Promise<void>;
  isLoading: boolean;
}
```

`loadYear()` checks the cache first; only fetches if the year hasn't been loaded. The cache persists for the lifetime of the app session, so career view fetches (which load all years) benefit immediately.

### `useYearData(year: number)`

Convenience hook that calls `loadYear(year)` on mount and returns `{ players, isLoading }`.

---

## Section 3: Year Picker UI

A year selector is added to the `FilterPanel` component (top of the filter area).

- **Control:** Dropdown (`<select>`) listing years 2017–2026, defaulting to 2025
- **On change:** Calls `loadYear(newYear)`, shows a loading spinner in the player list area while fetching
- **Filter reset:** All existing filters (position, conference, PPG range, etc.) reset to defaults on year change, since they're season-specific
- **Styling:** Matches existing filter panel input styles (dark/light mode aware)

---

## Section 4: Career View (`CareerModal`)

A new modal component following the same pattern as the existing `PlayerComparisonModal`.

### Trigger
Clicking a player card opens the `CareerModal` for that player.

### Data Loading
On open, fetches all years not yet in cache (in parallel). Filters each year's `TransferPlayer[]` by `player_sr_link` to build `CareerSeason[]`:

```typescript
interface CareerSeason {
  year: number;         // e.g. 2025
  season: string;       // e.g. "2024-25"
  school: string;
  stats: PlayerStats;   // same shape as TransferPlayer.stats
}
```

### Career Trend Chart (top)

A Recharts `LineChart` with season on the X-axis and stats on the Y-axis. Three preset tabs control which stats are plotted:

| Tab | Stats |
|-----|-------|
| **Scoring** | PPG, FG%, 3P%, FT% |
| **Efficiency** | TS%, OBPM, DBPM, MPG |
| **Defense** | RPG, APG, SPG, BPG |

Each stat is a distinct colored line with dots at each season. If only one season exists, renders a single data point (no connecting lines).

### Year-by-Year Table (bottom)

One row per season, columns:

| Season | School | GP | PPG | RPG | APG | FG% | 3P% | FT% | MPG | TS% | OBPM | DBPM |
|--------|--------|----|----|----|----|-----|-----|-----|-----|-----|------|------|

Rows sorted chronologically (oldest first). Schools are linked via `player_sr_link` if the player transferred (different school rows).

### Loading State
While career years are being fetched, show a spinner inside the modal body. The modal opens immediately so the UX feels responsive.

---

## Data Flow Summary

```
User selects year
       │
       ▼
YearDataContext.loadYear(year)
       │
  cache hit? ──yes──▶ return cached TransferPlayer[]
       │ no
       ▼
fetch(/data/sr_data_YYYY.csv)
fetch(/data/sr_advanced_YYYY.csv)   ← parallel
       │
       ▼
parse + join CSVs → TransferPlayer[]
       │
       ▼
store in cache, update state
       │
       ▼
existing filters/sort/display unchanged

User clicks player card
       │
       ▼
CareerModal opens
       │
       ▼
fetch all uncached years (parallel)
       │
       ▼
filter each year by player_sr_link → CareerSeason[]
       │
       ▼
render LineChart (tabbed presets) + stats table
```

---

## What Doesn't Change

- All existing filter controls (position, conference, PPG range, games, MPG, transfer toggle, availability)
- Sort panel and sort logic
- `PlayerCard` component
- `PlayerComparisonModal` and comparison charts
- `TransferPlayer` interface shape
- Dark/light theme system
- Conference mapping in `conferences.ts`

---

## Files Affected

| File | Change |
|------|--------|
| `scripts/aggregate_advanced_stats.py` | **New** — aggregates per-team advanced CSVs |
| `dashboard/public/data/` | **New dir** — all CSV files served statically |
| `dashboard/src/app/data/transferData.ts` | Refactor: remove static imports, add `fetchYearData()` |
| `dashboard/src/app/data/YearDataContext.tsx` | **New** — cache + loadYear + isLoading |
| `dashboard/src/app/App.tsx` | Wrap with `YearDataContext`, wire year state |
| `dashboard/src/app/components/FilterPanel.tsx` | Add year dropdown |
| `dashboard/src/app/components/CareerModal.tsx` | **New** — career chart + table |
| `dashboard/src/app/components/PlayerCard.tsx` | Add click handler to open CareerModal |
