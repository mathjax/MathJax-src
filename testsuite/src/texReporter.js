/**
 *  Custom reporter for tex macro coverage.
 */

import { texJsonFile, ESC } from './constants.js';
import { makeColumn, percentage, getColor, colorize } from './reportUtil.js';
import * as fs from 'fs';

export default class TexReporter {
  constructor(globalConfig, reporterOptions, reporterContext) {
    this._globalConfig = globalConfig;
    this._options = reporterOptions;
    this._context = reporterContext;
  }

  onRunStart(aggregatedResults, options) {
    fs.writeFileSync(texJsonFile, '[{}');
  }

  onRunComplete(testContexts, results) {
    fs.appendFileSync(texJsonFile, ']');
    let coverage = JSON.parse(fs.readFileSync(texJsonFile));
    fs.unlinkSync(texJsonFile);
    if (!coverage) {
      return;
    }
    coverage = coverage.slice(1);
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
 * @returns The array of rows of data
 */
function combineCoverage(coverage) {
  const maps = [];
  coverage = coverage.sort((a, b) =>
    a.configuration < b.configuration ? -1 : 1
  );
  for (const configuration of coverage) {
    const rows = [];
    let actual = 0;
    let size = 0;
    for (const table of configuration.tables.sort((a, b) =>
      a.table < b.table ? -1 : 1
    )) {
      if (table.actual > table.size) {
        table.actual = table.size;
      }
      actual += table.actual;
      size += table.size;
      rows.push([
        ' ' + table.table,
        table.size,
        table.actual,
        table.missing.join(', '),
      ]);
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
    makeColumn('', mwidth).replaceAll(' ', '-').replace('|-', ''),
  ].join('');
  console.log(line);
  console.log(
    makeColumn('Table', width, 0, true) +
      'Entries | Tested | Percentage | Missing'
  );
  console.log(line);
  for (const [table, size, actual, missing] of rows) {
    const color = getColor(actual, size);
    console.log(
      [
        makeColumn(table, width, color, true),
        makeColumn(size, 7, color),
        makeColumn(actual, 6, color),
        makeColumn(percentage(actual, size), 10, color),
        colorize(missing, color),
      ].join('')
    );
  }
  console.log(line);
  console.log('');
}

/**
 * Trim the missing token list to fit the screen
 * @param rows The rows whose data is to be trimmed
 * @param width The width of the table name column
 * @returns The width of the missing token column
 */
function trimMissing(rows, width) {
  const rest = process.stdout.columns - width - 32;
  let mwidth = 8;
  for (const row of rows) {
    let missing = row[3];
    if (missing.length > rest) {
      row[3] = missing =
        '...' + missing.slice(missing.length - rest + 4).replace(/.*?, /, '');
    }
    if (missing.length > mwidth) {
      mwidth = missing.length;
    }
  }
  return mwidth;
}
