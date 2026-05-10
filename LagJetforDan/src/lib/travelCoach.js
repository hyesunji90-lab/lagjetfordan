/**
 * travelCoach.js — short, friendly copy based on what the traveler selected.
 * This is **not** medical advice—just UI coaching text for a learning app.
 */

/**
 * If the user asked for magnesium reminders, return one supportive sentence for the results page.
 * Otherwise return `null` (caller hides the coach panel).
 *
 * @param {{ wantsMagnesium?: boolean }} form
 * @returns {string | null}
 */
export function getTravelCoachNote(form) {
  if (form?.wantsMagnesium === true) {
    return 'Since you opted into magnesium reminders, your plan includes a gentle sleep-support cue before bedtime. Optional education only—not a claim that magnesium treats jet lag or insomnia.'
  }
  return null
}
