// Quirky one-liners the mascot says. Each pool is sampled at random;
// keep them short (≤ ~40 chars) so they fit in the speech bubble.

export const MASCOT_LINES = {
  start: [
    "Let's stack some XP!",
    'Brain warm-up time.',
    'Here we go!',
    'Lesson go brrr.',
    'Cha-ching incoming.',
    'I’ve been waiting for this.',
  ],
  thinking: [
    'Take your time.',
    'No rush — trust your gut.',
    'You got this.',
    'Hmm, sneaky one.',
    'Read it twice.',
    'I believe in you.',
    'What would Warren do?',
    'When in doubt, eliminate the obvious-wrong one.',
  ],
  correct: [
    'YES! Knew it!',
    'Cha-ching!',
    'Galaxy brain energy.',
    'Stack that XP!',
    'Frame this one.',
    '10/10 piggy approves.',
    'Money moves.',
    'You are STUDYING.',
    'Oink yeah.',
  ],
  wrong: [
    'Oof — we live and learn.',
    'No biggie. Next one.',
    'Even Buffett gets one wrong.',
    'Plot twist!',
    'Knowledge: unlocked.',
    'That’s on me, not you.',
    'Shake it off.',
  ],
  complete: [
    'Lesson absolutely demolished.',
    'Brain leveled up.',
    'See you tomorrow?',
    'Whew. Look at us.',
    'Treat yourself.',
    'You’re a different person now.',
  ],
  daily: [
    'Daily dose of learning.',
    'One question. Make it count.',
    'Show me what you got.',
    'Wakey wakey, eggs and equity.',
  ],
} as const

export type MascotMoodKey = keyof typeof MASCOT_LINES

export function pickLine(key: MascotMoodKey): string {
  const pool = MASCOT_LINES[key]
  return pool[Math.floor(Math.random() * pool.length)]
}
