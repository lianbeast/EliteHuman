const KEYWORDS = {
  IRON:  ['gym', 'workout', 'gain', 'flex', 'bicep', 'shred', 'abs', 'muscle', 'fitness', 'bodybuilding', 'fitfam', 'lift'],
  MIND:  ['mindset', 'focus', 'hustle', 'grind', 'ordinary', 'greatness', 'game face', 'wake', 'create', 'circumstances'],
  SPIRIT:['faith', 'breathe', 'meditate', 'blessed', 'vibration', 'universe', 'spiritual', 'gratitude', 'pray'],
};

export function classifyPillar(caption = '') {
  const text = caption.toLowerCase();
  const scores = { IRON: 0, MIND: 0, SPIRIT: 0 };
  for (const [pillar, words] of Object.entries(KEYWORDS)) {
    for (const w of words) if (text.includes(w)) scores[pillar]++;
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] === 0 ? 'MIND' : best[0];
}
