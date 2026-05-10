/**
 * Timeline blocks: minutes from midnight (same day) for start/end.
 * Used to draw vertical pill bars inside the day window (see dayWindow).
 */
export const dayWindow = { startMinutes: 6 * 60, endMinutes: 22 * 60 }

export const sampleTimelineBlocks = [
  {
    id: 'light',
    kind: 'bright-light',
    title: 'Bright light',
    subtitle: 'Open curtains or take a short walk.',
    startMinutes: 8 * 60,
    endMinutes: 10 * 60,
  },
  {
    id: 'caffeine',
    kind: 'avoid-caffeine',
    title: 'Avoid caffeine',
    subtitle: 'Herbal tea or water instead.',
    startMinutes: 11 * 60,
    endMinutes: 14 * 60,
  },
  {
    id: 'nap',
    kind: 'nap',
    title: 'Short nap',
    subtitle: 'Keep it under 30 minutes.',
    startMinutes: 14 * 60,
    endMinutes: 14 * 60 + 30,
  },
  {
    id: 'dim',
    kind: 'wind-down',
    title: 'Dim lights',
    subtitle: 'Lower screens, warm bedside lamps.',
    startMinutes: 20 * 60,
    endMinutes: 22 * 60,
  },
]
