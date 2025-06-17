/**
 * Converts a number into its ordinal string representation.
 * e.g. 1 -> "1st", 2 -> "2nd", 11 -> "11th", 22 -> "22nd"
 * @param {number} number - The number to convert.
 * @returns {string} - Ordinal formatted string.
 */
export const getOrdinalSuffix = (number) => {
  const lastTwoDigits = number % 100;
  const lastDigit = number % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${number}th`;
  }

  switch (lastDigit) {
    case 1: return `${number}st`;
    case 2: return `${number}nd`;
    case 3: return `${number}rd`;
    default: return `${number}th`;
  }
};
