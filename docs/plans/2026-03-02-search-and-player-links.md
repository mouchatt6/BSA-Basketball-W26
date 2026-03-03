# Search & Player Links Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make players searchable by name/school with capped results, and add clickable Sports Reference profile links on player cards.

**Architecture:** Load real player data from `sr_data_2025.csv` at build time via Vite's `?raw` import, parse it into the existing `TransferPlayer` type, add a search bar that filters by name/school, and render SR profile links on each card.

**Tech Stack:** React, TypeScript, Vite (`?raw` imports), Tailwind CSS, lucide-react

---

### Task 1: Copy CSV into dashboard

**Files:**
- Copy: `data/yearly_data/sr_data_2025.csv` → `dashboard/src/app/data/sr_data_2025.csv`

**Step 1: Copy the file**

```bash
cp data/yearly_data/sr_data_2025.csv dashboard/src/app/data/sr_data_2025.csv
```

**Step 2: Add Vite type declaration for `?raw` imports**

Create `dashboard/src/vite-env.d.ts` (if it doesn't exist) or verify it contains:

```typescript
/// <reference types="vite/client" />
```

This ensures TypeScript accepts `import csv from './file.csv?raw'`.

**Step 3: Commit**

```bash
git add dashboard/src/app/data/sr_data_2025.csv dashboard/src/vite-env.d.ts
git commit -m "data: add sr_data_2025.csv to dashboard for build-time import"
```

---

### Task 2: Update schema — add `playerLink` to TransferPlayer

**Files:**
- Modify: `dashboard/src/app/data/schema.ts`

**Step 1: Add `playerLink` field to `TransferPlayer` interface**

In `schema.ts`, add after the `availability` field:

```typescript
export interface TransferPlayer {
  // ... existing fields ...
  availability: Availability;
  playerLink?: string;  // <-- add this
}
```

**Step 2: Update `goldToTransferPlayer` to pass through `player_sr_link`**

Add `playerLink` to the return object:

```typescript
export function goldToTransferPlayer(
  row: GoldPlayerPerGame,
  index: number,
  overrides?: Partial<Pick<TransferPlayer, 'name' | 'previousSchool' | 'year' | 'height' | 'availability'>>
): TransferPlayer {
  // ... existing code ...
  return {
    // ... existing fields ...
    availability: overrides?.availability ?? 'Available',
    playerLink: row.player_sr_link,
  };
}
```

**Step 3: Verify build**

```bash
cd dashboard && npm run build
```

Expected: Success (no type errors).

**Step 4: Commit**

```bash
git add dashboard/src/app/data/schema.ts
git commit -m "feat: add playerLink field to TransferPlayer schema"
```

---

### Task 3: Replace mock data with real CSV parsing

**Files:**
- Modify: `dashboard/src/app/data/transferData.ts`

**Step 1: Rewrite `transferData.ts`**

Replace the entire file with CSV parsing logic. Key details:

- `import csvRaw from './sr_data_2025.csv?raw'`
- Write a `parseCSV(raw: string): GoldPlayerPerGame[]` function that splits by newlines, extracts headers, maps each row to a `GoldPlayerPerGame` object
- The CSV columns map directly to `GoldPlayerPerGame` fields: `player_sr_link`, `pos`, `games`, `mp_per_g`, `fg_pct`, `fg3_pct`, `ft_pct`, `pts_per_g`, `trb_per_g`, `ast_per_g`, `stl_per_g`, `blk_per_g`, `team_name_abbr` (from `school`)
- Rewrite `getTransferPlayers()` to call `parseCSV()` and convert via `goldToTransferPlayer()`, passing real `name` (from `player_name`), `previousSchool` (from `school`), and deriving `year`/`height`/`availability` as defaults since the SR CSV doesn't have those
- Position mapping: SR uses `G`, `F`, `C` — map `G` → `SG`, `F` → `SF`, keep `C`. If position matches `PG`/`SG`/`SF`/`PF`/`C` exactly, use it as-is.
- Remove all mock data arrays (`NAMES`, `HEIGHTS`, `SCHOOLS`, `AVAILABILITY`, `mockGoldRows`)

```typescript
import type { GoldPlayerPerGame, TransferPlayer } from './schema';
import { goldToTransferPlayer } from './schema';
import csvRaw from './sr_data_2025.csv?raw';

export type { TransferPlayer } from './schema';

function parseCSV(raw: string): GoldPlayerPerGame[] {
  const lines = raw.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
    return {
      player_sr_link: row.player_sr_link,
      pos: row.pos,
      games: row.games ? Number(row.games) : undefined,
      games_started: row.games_started ? Number(row.games_started) : undefined,
      mp_per_g: row.mp_per_g ? Number(row.mp_per_g) : undefined,
      fg_pct: row.fg_pct ? Number(row.fg_pct) : undefined,
      fg3_pct: row.fg3_pct ? Number(row.fg3_pct) : undefined,
      ft_pct: row.ft_pct ? Number(row.ft_pct) : undefined,
      pts_per_g: row.pts_per_g ? Number(row.pts_per_g) : undefined,
      trb_per_g: row.trb_per_g ? Number(row.trb_per_g) : undefined,
      ast_per_g: row.ast_per_g ? Number(row.ast_per_g) : undefined,
      stl_per_g: row.stl_per_g ? Number(row.stl_per_g) : undefined,
      blk_per_g: row.blk_per_g ? Number(row.blk_per_g) : undefined,
      team_name_abbr: row.school,
    } as GoldPlayerPerGame;
  });
}

export function getTransferPlayers(): TransferPlayer[] {
  const rows = parseCSV(csvRaw);
  return rows.map((row, i) =>
    goldToTransferPlayer(row, i, {
      name: (row as any)._name, // we'll store player_name separately — see parseCSV
      previousSchool: row.team_name_abbr ?? 'Unknown',
    })
  );
}
```

Note: The `player_name` field from CSV doesn't map to `GoldPlayerPerGame`. Two options:
1. Add `player_name` to `GoldPlayerPerGame` interface, OR
2. Store it in the `parseCSV` output separately and pass as override

**Recommended: Add `player_name?: string` to `GoldPlayerPerGame` in `schema.ts`**, then use it in the override:

```typescript
name: row.player_name ?? `Player ${i}`,
```

**Step 2: Verify build**

```bash
cd dashboard && npm run build
```

Expected: Success.

**Step 3: Run dev server, verify players load in browser**

```bash
cd dashboard && npm run dev
```

Open http://localhost:5173 — should see ~4,700 player cards (many rendered). This confirms data loads correctly.

**Step 4: Commit**

```bash
git add dashboard/src/app/data/transferData.ts dashboard/src/app/data/schema.ts
git commit -m "feat: load real player data from sr_data_2025.csv"
```

---

### Task 4: Add search bar to App.tsx

**Files:**
- Modify: `dashboard/src/app/App.tsx`

**Step 1: Add search state and filtering logic**

Add to App component:

```typescript
const [searchQuery, setSearchQuery] = useState('');
```

Update `filteredPlayers` useMemo to also filter by search query:

```typescript
const filteredPlayers = useMemo(() => {
  const query = searchQuery.toLowerCase();
  return players.filter((player) => {
    if (query && !player.name.toLowerCase().includes(query) && !player.previousSchool.toLowerCase().includes(query)) return false;
    if (filters.position.length > 0 && !filters.position.includes(player.position)) return false;
    if (filters.year.length > 0 && !filters.year.includes(player.year)) return false;
    if (filters.availability.length > 0 && !filters.availability.includes(player.availability)) return false;
    if (player.stats.ppg < filters.ppgMin || player.stats.ppg > filters.ppgMax) return false;
    return true;
  });
}, [players, filters, searchQuery]);
```

**Step 2: Cap displayed players and add search input**

```typescript
const MAX_DISPLAY = 50;
const cappedPlayers = filteredPlayers.slice(0, MAX_DISPLAY);
```

Add a search input above the player grid, inside the "Transfer Players" card:

```tsx
<div className="relative mb-4">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  <input
    type="text"
    placeholder="Search by player name or school..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
  />
</div>
```

Import `Search` from lucide-react.

Add a results count message:

```tsx
{filteredPlayers.length > MAX_DISPLAY && (
  <p className="text-sm text-muted-foreground mb-4">
    Showing {MAX_DISPLAY} of {filteredPlayers.length} results
  </p>
)}
```

Update the player grid to render `cappedPlayers` instead of `filteredPlayers`:

```tsx
{cappedPlayers.map((player) => (
  <PlayerCard ... />
))}
```

Update the Header `playerCount` to use `filteredPlayers.length` (still shows total matching, not capped).

**Step 3: Verify build**

```bash
cd dashboard && npm run build
```

**Step 4: Test in browser**

- Type a player name → results narrow
- Type a school name → results narrow
- Clear search → shows all (capped at 50)
- Filters + search work together

**Step 5: Commit**

```bash
git add dashboard/src/app/App.tsx
git commit -m "feat: add search bar with name/school filtering and 50-result cap"
```

---

### Task 5: Add player profile link to PlayerCard

**Files:**
- Modify: `dashboard/src/app/components/PlayerCard.tsx`

**Step 1: Add profile link button**

Import `ExternalLink` from lucide-react. Add after the stats grid, before the "Selected for comparison" section:

```tsx
{player.playerLink && (
  <div className="mt-3 pt-3 border-t border-border">
    <a
      href={player.playerLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      View Profile
    </a>
  </div>
)}
```

The `e.stopPropagation()` prevents clicking the link from triggering the card's `onClick` (player selection).

**Step 2: Verify build**

```bash
cd dashboard && npm run build
```

**Step 3: Test in browser**

- Each card should show "View Profile" link
- Clicking opens Sports Reference page in new tab
- Clicking the link does NOT select the player for comparison

**Step 4: Commit**

```bash
git add dashboard/src/app/components/PlayerCard.tsx
git commit -m "feat: add View Profile link to player cards"
```

---

### Task 6: Final build verification

**Step 1: Clean build**

```bash
cd dashboard && npm run build
```

Expected: No errors, no warnings.

**Step 2: Preview production build**

```bash
cd dashboard && npm run preview
```

Open in browser, verify:
- Players load from real data
- Search works by name and school
- Results capped at 50
- "View Profile" links work
- Existing filters still work
- Player comparison charts still work

**Step 3: Final commit if any cleanup needed**
