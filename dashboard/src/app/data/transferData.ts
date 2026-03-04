/**
 * Transfer dashboard data layer.
 * Parses real CSV data from Sports Reference via Vite's ?raw import.
 */

import type { GoldPlayerPerGame, TransferPlayer, TransferStatus } from './schema';
import { goldToTransferPlayer, mapClassRank } from './schema';

export type { TransferPlayer } from './schema';

import csvRaw from './sr_data_2025.csv?raw';
import on3Raw from './on3_wbb_transfers_2025.csv?raw';

function parseCSV(raw: string): Record<string, string>[] {
  const lines = raw.trim().split('\n');
  if (lines.length === 0) return [];
  const headers = lines[0].split(',');
  return lines.slice(1).filter(line => line.trim() !== '').map(line => {
    const values = line.split(',');
    const record: Record<string, string> = {};
    headers.forEach((header, i) => {
      record[header.trim()] = (values[i] ?? '').trim();
    });
    return record;
  });
}

function num(val: string | undefined): number {
  const n = parseFloat(val ?? '');
  return isNaN(n) ? 0 : n;
}

interface On3TransferRecord {
  name: string;
  classRank: string;
  previousTeam: string;
  newTeam: string;
  status: string;
  date: string;
}

function parseOn3Transfers(): Map<string, On3TransferRecord> {
  const rows = parseCSV(on3Raw);
  const byName = new Map<string, On3TransferRecord>();

  for (const r of rows) {
    const key = (r['Name'] || '').toLowerCase().trim();
    if (!key) continue;

    const record: On3TransferRecord = {
      name: r['Name'] || '',
      classRank: r['Class Rank'] || '',
      previousTeam: r['Previous Team'] || '',
      newTeam: r['New Team'] || '',
      status: r['Status'] || '',
      date: r['Date'] || '',
    };

    const existing = byName.get(key);
    if (!existing || record.date > existing.date) {
      byName.set(key, record);
    }
  }

  // Remove withdrawn players
  for (const [key, record] of byName) {
    if (record.status === 'Withdrawn') {
      byName.delete(key);
    }
  }

  return byName;
}

function stripMascot(fullTeamName: string): string {
  if (!fullTeamName) return '';
  const parts = fullTeamName.trim().split(/\s+/);
  if (parts.length <= 1) return fullTeamName;
  const knownTwoWordMascots = ['tar heels', 'fighting irish', 'scarlet knights',
    'golden eagles', 'mean green', 'red storm', 'blue devils',
    'yellow jackets', 'horned frogs', 'nittany lions', 'lady vols',
    'red raiders', 'golden gophers', 'banana slugs'];
  const lower = fullTeamName.toLowerCase();
  for (const mascot of knownTwoWordMascots) {
    if (lower.endsWith(mascot)) {
      return fullTeamName.slice(0, lower.lastIndexOf(mascot)).trim();
    }
  }
  return parts.slice(0, -1).join(' ');
}

export function getTransferPlayers(): TransferPlayer[] {
  const on3Map = parseOn3Transfers();
  const rows = parseCSV(csvRaw);
  return rows.map((r, i) => {
    const gold: GoldPlayerPerGame = {
      player_sr_link: r.player_sr_link,
      player_name: r.player_name,
      team_name_abbr: r.school,
      pos: r.pos,
      games: num(r.games),
      games_started: num(r.games_started),
      mp_per_g: num(r.mp_per_g),
      fg_pct: num(r.fg_pct),
      fg3_pct: num(r.fg3_pct),
      ft_pct: num(r.ft_pct),
      pts_per_g: num(r.pts_per_g),
      trb_per_g: num(r.trb_per_g),
      ast_per_g: num(r.ast_per_g),
      stl_per_g: num(r.stl_per_g),
      blk_per_g: num(r.blk_per_g),
    };
    const player: TransferPlayer = {
      ...goldToTransferPlayer(gold, i, {
        name: r.player_name || `Player ${i}`,
        previousSchool: r.school || 'Unknown',
        year: 'Junior',
        height: '—',
        availability: 'Available',
      }),
    };

    // Cross-reference with ON3 transfer data
    const on3 = on3Map.get(player.name.toLowerCase().trim());
    if (on3) {
      player.transferInfo = {
        classYear: mapClassRank(on3.classRank),
        previousTeam: on3.previousTeam,
        newTeam: on3.status === 'Committed' ? stripMascot(on3.newTeam) : null,
        status: on3.status as TransferStatus,
      };
      player.availability = on3.status === 'Committed' ? 'Committed' : 'Available';
    }

    return player;
  });
}
