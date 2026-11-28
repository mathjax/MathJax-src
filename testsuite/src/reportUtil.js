import { ESC, red, green, yellow } from './constants.js';

/**
 * Sets cell content with respect to column with surronding it by whitespace.
 * @param cell The string in that cell.
 * @param size The column size.
 * @param left Cell is left aligned if set.
 * @returns The string with the correctly set column
 */
export function makeColumn(cell, size, color = 0, left = false) {
  let length = cell.toString().length;
  let column = new Array(Math.max(0, size - length + 1)).join(' ');
  cell = colorize(cell, color);
  if (left) {
    column = cell + column;
  } else {
    column += cell;
  }
  column += ' | ';
  return column;
}

/**
 * Percentage computation with two digit precision.
 * @param actual The number of tested elements.
 * @param size The table size.
 * @returns The percentage for table size to tested elements.
 */
export function percentage(actual, size) {
  return Math.round((actual / size) * 10000) / 100;
}

/**
 * Get the color number for the percentage of coverage
 * @param actual The number of tested elements.
 * @param size The table size.
 * @returns The color number for use in a color escape sequence
 */
export function getColor(actual, size) {
  const percent = (actual / size) * 100;
  return percent >= 80 ? green : percent >= 50 ? yellow : red;
}

/**
 * Add color escape sequences, if needed
 * @param cell The cell contents
 * @param color The color number to use in the escape sequence
 * @returns The cell contents with color sequences
 */
export function colorize(cell, color) {
  return color && process.stdout.isTTY
    ? `${ESC}[1m${ESC}[${color}m${cell}${ESC}[0m`
    : cell;
}
