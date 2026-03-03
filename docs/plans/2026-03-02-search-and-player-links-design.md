# Search & Player Links Design

## Goal

Make players searchable by name/school, show matching player cards, and add a clickable profile link on each card that opens in a new tab.

## Data Layer

- Copy `data/yearly_data/sr_data_2025.csv` into `dashboard/src/app/data/`
- Import via Vite `?raw` suffix (inlined at build time, no backend needed)
- Parse CSV with a simple split-based parser (no new dependencies)
- Add `playerLink?: string` to `TransferPlayer` interface
- Map `player_sr_link` from CSV through `goldToTransferPlayer`
- Replace mock `getTransferPlayers()` with real CSV parsing using `player_name`, `school`, `pos`, `season` fields

## Search (App.tsx)

- `searchQuery` state (string)
- Text input above the player cards grid
- Case-insensitive substring match on name and school
- Cap displayed results at 50 players
- Show "Showing X of Y results" when capped
- Works alongside existing filters (position, year, availability, PPG)

## Player Link (PlayerCard.tsx)

- "View Profile" button at bottom of each card
- `<a target="_blank" rel="noopener noreferrer">` with `ExternalLink` icon
- Only shown when `player.playerLink` exists
- `onClick` stops propagation to avoid triggering card selection

## Files Changed

| File | Change |
|------|--------|
| `schema.ts` | Add `playerLink` to `TransferPlayer`, update converter |
| `transferData.ts` | Replace mock data with CSV parsing |
| `App.tsx` | Add search state, input, cap results |
| `PlayerCard.tsx` | Add profile link button |
| `sr_data_2025.csv` | Copy into dashboard data dir |
