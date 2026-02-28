/**
 * Transfer dashboard data layer.
 * Uses mock data so the dashboard runs out of the box.
 * Super tables: ../data/player_tables/batch2_supers/super_pergame.csv, super_totals.csv
 * (created by ../player-tables-scraper.ipynb)
 */

import type { GoldPlayerPerGame, TransferPlayer } from './schema';
import { goldToTransferPlayer } from './schema';

export type { TransferPlayer } from './schema';

const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'] as const;
const SCHOOLS = ['Stanford', 'USC', 'Oregon', 'Arizona', 'Colorado', 'Washington', 'Cal', 'Arizona State', 'Utah', 'Oregon State', 'UCLA', 'Washington State'];
const AVAILABILITY = ['Available', 'Considering', 'Committed'] as const;

function mockGoldRows(): GoldPlayerPerGame[] {
  return [
    { player_key: 1, team_season_key: 1, pos: 'PG', team_name_abbr: 'Stanford', pts_per_g: 16.5, trb_per_g: 3.2, ast_per_g: 5.8, stl_per_g: 2.1, blk_per_g: 0.3, fg_pct: 0.445, fg3_pct: 0.382, ft_pct: 0.843, mp_per_g: 32.4, games: 28 },
    { player_key: 2, team_season_key: 2, pos: 'SG', team_name_abbr: 'USC', pts_per_g: 18.7, trb_per_g: 4.1, ast_per_g: 2.9, stl_per_g: 1.5, blk_per_g: 0.4, fg_pct: 0.468, fg3_pct: 0.413, ft_pct: 0.886, mp_per_g: 34.2, games: 30 },
    { player_key: 3, team_season_key: 3, pos: 'SF', team_name_abbr: 'Oregon', pts_per_g: 14.3, trb_per_g: 5.6, ast_per_g: 2.4, stl_per_g: 1.8, blk_per_g: 0.7, fg_pct: 0.482, fg3_pct: 0.356, ft_pct: 0.765, mp_per_g: 28.9, games: 29 },
    { player_key: 4, team_season_key: 4, pos: 'PF', team_name_abbr: 'Arizona', pts_per_g: 12.8, trb_per_g: 8.4, ast_per_g: 1.6, stl_per_g: 1.2, blk_per_g: 1.5, fg_pct: 0.521, fg3_pct: 0.284, ft_pct: 0.723, mp_per_g: 26.7, games: 31 },
    { player_key: 5, team_season_key: 5, pos: 'C', team_name_abbr: 'Colorado', pts_per_g: 11.2, trb_per_g: 9.8, ast_per_g: 1.1, stl_per_g: 0.8, blk_per_g: 2.3, fg_pct: 0.546, fg3_pct: 0, ft_pct: 0.689, mp_per_g: 24.3, games: 27 },
    { player_key: 6, team_season_key: 6, pos: 'PG', team_name_abbr: 'Washington', pts_per_g: 13.9, trb_per_g: 2.8, ast_per_g: 6.4, stl_per_g: 2.5, blk_per_g: 0.2, fg_pct: 0.423, fg3_pct: 0.368, ft_pct: 0.817, mp_per_g: 30.1, games: 28 },
    { player_key: 7, team_season_key: 7, pos: 'SG', team_name_abbr: 'Cal', pts_per_g: 15.6, trb_per_g: 3.5, ast_per_g: 3.2, stl_per_g: 1.7, blk_per_g: 0.5, fg_pct: 0.452, fg3_pct: 0.395, ft_pct: 0.862, mp_per_g: 31.5, games: 30 },
    { player_key: 8, team_season_key: 8, pos: 'SF', team_name_abbr: 'Arizona State', pts_per_g: 10.4, trb_per_g: 4.9, ast_per_g: 2.1, stl_per_g: 1.4, blk_per_g: 0.6, fg_pct: 0.478, fg3_pct: 0.332, ft_pct: 0.741, mp_per_g: 23.6, games: 29 },
    { player_key: 9, team_season_key: 9, pos: 'PF', team_name_abbr: 'Utah', pts_per_g: 14.1, trb_per_g: 7.6, ast_per_g: 1.8, stl_per_g: 1.0, blk_per_g: 1.8, fg_pct: 0.513, fg3_pct: 0.315, ft_pct: 0.708, mp_per_g: 27.8, games: 30 },
    { player_key: 10, team_season_key: 10, pos: 'C', team_name_abbr: 'Oregon State', pts_per_g: 9.8, trb_per_g: 8.9, ast_per_g: 0.9, stl_per_g: 0.7, blk_per_g: 2.1, fg_pct: 0.532, fg3_pct: 0, ft_pct: 0.654, mp_per_g: 22.4, games: 26 },
  ];
}

const NAMES = ['Jordan Williams', 'Taylor Martinez', 'Morgan Davis', 'Alex Thompson', 'Sam Johnson', 'Riley Parker', 'Casey Anderson', 'Jamie Brooks', 'Drew Miller', 'Avery Lee'];
const HEIGHTS = ["5'9\"", "6'1\"", "6'2\"", "6'3\"", "6'5\"", "5'8\"", "6'0\"", "6'1\"", "6'4\"", "6'4\""];

export function getTransferPlayers(): TransferPlayer[] {
  const rows = mockGoldRows();
  return rows.map((row, i) =>
    goldToTransferPlayer(row, i, {
      name: NAMES[i] ?? `Player ${row.player_key}`,
      previousSchool: row.team_name_abbr ?? SCHOOLS[i % SCHOOLS.length],
      year: YEARS[i % YEARS.length],
      height: HEIGHTS[i % HEIGHTS.length],
      availability: AVAILABILITY[i % AVAILABILITY.length],
    })
  );
}
