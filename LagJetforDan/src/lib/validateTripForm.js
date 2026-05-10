/**
 * validateTripForm.js — pure checks for the trip planner (no React here).
 * Returning an empty object means “all good.” Otherwise keys match form field names.
 */

/**
 * @param {{
 *   departureTimeZone: string,
 *   destinationTimeZone: string,
 *   departureDate: string,
 *   sleepPreference: string,
 *   wantsMagnesium: boolean,
 * }} fields
 * @returns {Record<string, string>} field name → error message (empty object = valid)
 */
export function validateTripForm(fields) {
  const errors = {}

  if (!fields.departureTimeZone?.trim()) {
    errors.departureTimeZone = 'Please choose a departure city.'
  }

  if (!fields.destinationTimeZone?.trim()) {
    errors.destinationTimeZone = 'Please choose a destination city.'
  }

  if (!fields.departureDate?.trim()) {
    errors.departureDate = 'Please choose a departure date.'
  }

  if (fields.departureTimeZone && fields.destinationTimeZone) {
    if (fields.departureTimeZone === fields.destinationTimeZone) {
      errors.destinationTimeZone = 'Departure and destination must be different cities.'
    }
  }

  if (fields.sleepPreference !== 'morning' && fields.sleepPreference !== 'night') {
    errors.sleepPreference = 'Please pick morning or night person.'
  }

  if (fields.wantsMagnesium !== true && fields.wantsMagnesium !== false) {
    errors.wantsMagnesium = 'Please choose Yes or No for magnesium reminders.'
  }

  return errors
}
