/**
 * Escapes characters that have special meaning in regular expressions
 * to prevent ReDoS and regex syntax errors from user input.
 *
 * @param {string} string - The raw string to escape.
 * @returns {string} The escaped string safe for new RegExp().
 */
export const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default escapeRegex;
