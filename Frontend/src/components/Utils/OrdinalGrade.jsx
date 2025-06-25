/**
 * Converts a number into its ordinal string representation.
 * For example:
 *   1 -> "1st"
 *   2 -> "2nd"
 *   3 -> "3rd"
 *   4 -> "4th"
 *   11 -> "11th"
 *   22 -> "22nd"
 *
 * @param {number} number - The number to convert.
 * @returns {string} - Ordinal formatted string.
 */
export const getOrdinalSuffix = (number) => {
  const lastTwoDigits = number % 100; // Extract last two digits (used for special cases like 11, 12, 13)
  const lastDigit = number % 10;  // Extract the last digit to determine suffix

  // Handle special case for numbers ending in 11, 12, 13
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${number}th`;
  }

  // Determine suffix based on last digit
  switch (lastDigit) {
    case 1: return `${number}st`; // 1st
    case 2: return `${number}nd`; // 2nd
    case 3: return `${number}rd`; // 3rd
    default: return `${number}th`;  // All others - 'th'
  }
};
