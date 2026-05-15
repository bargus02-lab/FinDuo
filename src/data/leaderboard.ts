export interface Competitor {
  name: string
  avatar: string
  xp: number
}

export const COMPETITORS: Competitor[] = [
  { name: 'Maya R.', avatar: '🦊', xp: 1240 },
  { name: 'Jordan T.', avatar: '🐻', xp: 980 },
  { name: 'Priya K.', avatar: '🦉', xp: 760 },
  { name: 'Sam W.', avatar: '🐢', xp: 540 },
  { name: 'Ana M.', avatar: '🐙', xp: 410 },
  { name: 'Luis B.', avatar: '🐯', xp: 280 },
  { name: 'Riley S.', avatar: '🐝', xp: 180 },
  { name: 'Kim H.', avatar: '🦔', xp: 95 },
  { name: 'Theo P.', avatar: '🐳', xp: 42 },
]

export interface LeaderboardEntry extends Competitor {
  isUser: boolean
}

export function buildLeaderboard(userXp: number): LeaderboardEntry[] {
  return [
    ...COMPETITORS.map((c) => ({ ...c, isUser: false })),
    { name: 'You', avatar: '⭐', xp: userXp, isUser: true },
  ].sort((a, b) => b.xp - a.xp)
}
