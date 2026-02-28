/**
 * Types for dashboard transfer-portal view.
 * Can be mapped from super_pergame / super_totals when loaded.
 */

export interface GoldPlayerPerGame {
  player_key?: number;
  team_season_key?: number;
  player_sr_link?: string;
  class?: string;
  pos?: string;
  games?: number;
  games_started?: number;
  mp_per_g?: number;
  fg_per_g?: number;
  fga_per_g?: number;
  fg_pct?: number;
  fg3_per_g?: number;
  fg3a_per_g?: number;
  fg3_pct?: number;
  fg2_per_g?: number;
  fg2a_per_g?: number;
  fg2_pct?: number;
  efg_pct?: number;
  ft_per_g?: number;
  fta_per_g?: number;
  ft_pct?: number;
  orb_per_g?: number;
  drb_per_g?: number;
  trb_per_g?: number;
  ast_per_g?: number;
  stl_per_g?: number;
  blk_per_g?: number;
  tov_per_g?: number;
  pf_per_g?: number;
  pts_per_g?: number;
  team_name_abbr?: string;
  year_id?: string;
}

export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';
export type Year = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
export type Availability = 'Available' | 'Committed' | 'Considering';

export interface TransferPlayer {
  id: string;
  name: string;
  position: Position;
  previousSchool: string;
  year: Year;
  height: string;
  stats: {
    ppg: number;
    rpg: number;
    apg: number;
    spg: number;
    bpg: number;
    fgPercentage: number;
    threePointPercentage: number;
    ftPercentage: number;
    minutesPerGame: number;
    gamesPlayed: number;
  };
  availability: Availability;
}

export function goldToTransferPlayer(
  row: GoldPlayerPerGame,
  index: number,
  overrides?: Partial<Pick<TransferPlayer, 'name' | 'previousSchool' | 'year' | 'height' | 'availability'>>
): TransferPlayer {
  const pos = (row.pos as Position) || 'G';
  const position = ['PG', 'SG', 'SF', 'PF', 'C'].includes(pos) ? pos : 'SG';
  return {
    id: `gold-${row.player_key ?? index}-${index}`,
    name: overrides?.name ?? `Player ${row.player_key ?? index}`,
    position,
    previousSchool: overrides?.previousSchool ?? row.team_name_abbr ?? 'Unknown',
    year: overrides?.year ?? 'Junior',
    height: overrides?.height ?? '—',
    stats: {
      ppg: row.pts_per_g ?? 0,
      rpg: row.trb_per_g ?? 0,
      apg: row.ast_per_g ?? 0,
      spg: row.stl_per_g ?? 0,
      bpg: row.blk_per_g ?? 0,
      fgPercentage: (row.fg_pct ?? 0) * 100,
      threePointPercentage: (row.fg3_pct ?? 0) * 100,
      ftPercentage: (row.ft_pct ?? 0) * 100,
      minutesPerGame: row.mp_per_g ?? 0,
      gamesPlayed: row.games ?? 0,
    },
    availability: overrides?.availability ?? 'Available',
  };
}
