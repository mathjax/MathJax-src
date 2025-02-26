/**
 *  Custom reporter for tex macro coverage.
 */

import {tmpJsonFile} from './constants.js';
import * as fs from 'fs';

const ESC = '\u001B';

export default class TexReporter {

  constructor(globalConfig, reporterOptions, reporterContext) {
    this._globalConfig = globalConfig;
    this._options = reporterOptions;
    this._context = reporterContext;
  }

  onRunStart(
    aggregatedResults, options
  ) {
    fs.writeFileSync(tmpJsonFile, '[{}');
  }

  onRunComplete(testContexts, results) {
    fs.appendFileSync(tmpJsonFile, ']');
    let coverage = JSON.parse(fs.readFileSync(tmpJsonFile));
    if (!coverage) {
      return;
    }
    coverage = coverage.slice(1);
    fs.unlinkSync(tmpJsonFile);
    createCoverageOutput(coverage);
  }

  // Optionally, reporters can force Jest to exit with non zero code by returning
  // an `Error` from `getLastError()` method.
  getLastError() {
    if (this._shouldFail) {
      return new Error('Custom error reported!');
    }
  }
}

/**
 * Convert the array of configurations to an array of rows of data,
 * sorted by package name.
 * @param coverage The coverage data from the json file
 * @return The array of rows of data
 */
function combineCoverage(coverage) {
  const maps = [];
  coverage = coverage.sort((a, b) => a.configuration < b.configuration ? -1 : 1);
  for (const configuration of coverage) {
    const rows = [];
    let actual = 0;
    let size = 0;
    for (const table of configuration.tables.sort((a, b) => a.table < b.table ? -1 : 1)) {
      if (table.actual > table.size) {
        table.actual = table.size;
      }
      actual += table.actual;
      size += table.size;
      rows.push([' ' + table.table, table.size, table.actual, table.missing.join(', ')]);
    }
    maps.push([configuration.configuration, size, actual, ''], ...rows);
  }
  return maps;
}

/**
 * Print the coverage table
 * @param coverage The converage data from the json file
 */
function createCoverageOutput(coverage) {
  const rows = combineCoverage(coverage);
  if (rows.length === 0) return;
  const width = rows.reduce((max, row) => Math.max(row[0].length, max), 5);
  const mwidth = trimMissing(rows, width);
  const line = [
    makeColumn('', width).replaceAll(' ', '-'),
    '--------|--------|------------|',
    makeColumn('', mwidth).replaceAll(' ', '-').replace('|-', '')
  ].join('');
  console.log(line);
  console.log(makeColumn('Table', width, 0, true) + 'Entries | Tested | Percentage | Missing');
  console.log(line);
  for (const [table, size, actual, missing] of rows) {
    const color = getColor(actual, size);
    console.log([
      makeColumn(table, width, color, true),
      makeColumn(size, 7, color),
      makeColumn(actual, 6, color),
      makeColumn(percentage(actual, size), 10, color),
      colorize(missing, color)
    ].join(''));
  }
  console.log(line);
  console.log('');
}

/**
 * Trim the missing token list to fit the screen
 * @param rows The rows whose data is to be trimmed
 * @param width The width of the table name column
 * @return The width of the missing token column
 */
function trimMissing(rows, width) {
  const rest = process.stdout.columns - width - 32;
  let mwidth = 8;
  for (const row of rows) {
    let missing = row[3];
    if (missing.length > rest) {
      row[3] = missing = '...' + missing.slice(missing.length - rest + 4).replace(/.*?, /, '');
    }
    if (missing.length > mwidth) {
      mwidth = missing.length;
    }
  }
  return mwidth;
}

/**
 * Sets cell content with respect to column with surronding it by whitespace.
 * @param cell The string in that cell.
 * @param size The column size.
 * @param left Cell is left aligned if set.
 * @return The string with the correctly set column
 */
function makeColumn(cell, size, color = 0, left = false) {
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
 * @return The percentage for table size to tested elements.
 */
function percentage(actual, size) {
  return Math.round((actual/size) * 10000) / 100;
}

/**
 * Get the color number for the percentage of coverage
 * @param actual The number of tested elements.
 * @param size The table size.
 * @return The color number for use in a color escape sequence
 */
function getColor(actual, size) {
  const percent = actual/size * 100;
  return percent >= 80 ? 32 : percent >= 50 ? 33 : 31;
}

/**
 * Add color escape sequences, if needed
 * @param cell The cell contents
 * @param color The color number to use in the escape sequence
 * @return The cell contents with color sequences
 */
function colorize(cell, color) {
  return color && process.stdout.isTTY ? `${ESC}[1m${ESC}[${color}m${cell}${ESC}[0m` : cell;
}

