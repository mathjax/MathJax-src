import { localeJsonFile, red, yellow } from './constants.js';
import { makeColumn, percentage, getColor, colorize } from './reportUtil.js';
import * as fs from 'fs';

/**
 * The custom reporter class for Locale message id coverage.
 */
export default class LocaleReporter {
  constructor(globalConfig, reporterOptions, reporterContext) {
    this._globalConfig = globalConfig;
    this._options = reporterOptions;
    this._context = reporterContext;
  }

  onRunStart(aggregatedResults, options) {
    fs.writeFileSync(localeJsonFile, '[{}');
  }

  onRunComplete(testContexts, results) {
    fs.appendFileSync(localeJsonFile, ']');
    let coverage = JSON.parse(fs.readFileSync(localeJsonFile));
    fs.unlinkSync(localeJsonFile);
    if (coverage) {
      const [context] = testContexts;
      createCoverageOutput(coverage.slice(1), context.config.collectCoverageFrom);
    }
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
 * @returns The array of coverage rows.
 */
function combineCoverage(coverage, from) {
  //
  // The files or directories to show
  //
  const collect = from.map((name) => name.replace(/.*mjs\//, '').replace(/\*?\.js$/, ''));
  //
  // Determine the IDs defined and used for each component from the collected data
  //
  const components = new Map();
  for (const data of coverage) {
    if (!components.has(data.component)) {
      components.set(data.component, [new Set(), new Set()]);
    }
    if (data.ids) {
      const ids = components.get(data.component)[0];
      data.ids.forEach((id) => ids.add(id));
    } else {
      components.get(data.component)[1].add(data.id);
    }
  }
  //
  // Get the data for each row (the name, size, number used, ids not used, and ids not defined).
  //
  const rows = [];
  for (const name of Array.from(components.keys()).sort()) {
    if (collect.length === 0 || collect.filter((dir) => name.substring(0, dir.length) === dir).length) {
      if (name.match(/\/testsuite\//)) continue;
      const [ids, used] = components.get(name);
      const nodef = new Set(Array.from(used.values()));
      const size = ids.size;
      ids.forEach((id) => nodef.delete(id));
      used.forEach((id) => ids.delete(id));
      rows.push([
        name, size, size - ids.size,
        Array.from(ids.values()).join(', '),
        Array.from(nodef.values()).join(', ')
      ]);
    }
  };
  return rows;
}

/**
 * Print the coverage table
 * @param coverage The converage data from the json file
 */
function createCoverageOutput(coverage, from) {
  const rows = combineCoverage(coverage, from);
  if (rows.length === 0) return;
  const width = rows.reduce((max, row) => Math.max(row[0].length, max), 5);
  const separator = makeColumn('', width) + '      |       |        |';
  const mwidth = wrapUnusedExtra(rows, width, separator);
  const line = [
    makeColumn('', width).replaceAll(' ', '-'),
    '------|-------|--------|',
    makeColumn('', mwidth).replaceAll(' ', '-').replace('|-', ''),
  ].join('');
  console.log(line);
  console.log(
    makeColumn('Locale', width, 0, true) +
      `  Ids |  Used | % Used | ${colorize('Unused', yellow)} / ${colorize('Missing', red)}`
  );
  console.log(line);
  for (const [component, size, used, unused, missing] of rows) {
    const color = getColor(used, size);
    console.log(
      [
        makeColumn(component, width, color, true),
        makeColumn(size, 5, color),
        makeColumn(used, 5, color),
        makeColumn(percentage(used, size), 6, color),
        unused,
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
function wrapUnusedExtra(rows, width, separator) {
  const rest = process.stdout.columns - width - 28;
  let mwidth = 17;
  mwidth = wrapIds(rows, 3, separator, rest, mwidth, yellow);
  mwidth = wrapIds(rows, 4, separator, rest, mwidth, red);
  for (const row of rows) {
    if (row[4]) {
      if (row[3]) {
        row[3] += '\n' + separator + ' ' + row[4];
      } else {
        row[3] = row[4];
      }
    }
    row.pop();
  }
  return mwidth;
}

/**
 * Wraps IDs to the column width producing multiple lines, if needed.
 * @param rows The rows of data for the report
 * @param i The column to be wrapped
 * @param rest The maximum width for the column
 * @param mwidth The width of the longest line in the column
 * @param color The color to use for the lines in the column
 * @returns The width of the longest line in the column after wrapping
 */
function wrapIds(rows, i, separator, rest, mwidth, color) {
  for (const row of rows) {
    let ids = row[i];
    const wrapped = [];
    let m = 0;
    while (ids.length > rest) {
      const line = ids.slice(0, rest).replace(/,[^,]*?$/, ',');
      if (line.lenght === 0) break;
      if (line.length > mwidth) {
        mwidth = line.length;
      }
      ids = ids.slice(line.length + 1);
      wrapped.push(colorize(line, color));
    }
    if (ids) {
      wrapped.push(colorize(ids, color));
    }
    if (ids.length > mwidth) {
      mwidth = ids.length;
    }
    row[i] = wrapped.join('\n' + separator + ' ');
  }
  return mwidth;
}
