/**
 *  Custom reporter for tex macro coverage.
 */

import {tmpJsonFile} from './constants.js';
import * as fs from 'fs';

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
    let result = '';
    for (let configuration of coverage) {
      result += `\n${createConfigurationOutput(configuration)}\n`;
    }
    console.log(result);
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
 * Creates the output table per configuration.
 * @param configuration The configuration JSON.
 * @return The string containing the table.
 */
function createConfigurationOutput(configuration) {
  let allSize = 0;
  let allActual = 0;
  let result = '\n';
  // Compute columns
  let maxWidth = configuration.tables.reduce((max, val) => Math.max(val.table.length, max), 0);
  result += makeColumn('Table', maxWidth, true);
  result += 'Entries | Tested | Percentage | Missing ';
  result += '\n';
  result += makeColumn('', maxWidth).replaceAll(' ', '-');
  result += '--------|--------|------------|--------';
  maxWidth = Math.max(configuration.configuration.length, maxWidth);
  for (let {table, size, actual, missing} of configuration.tables) {
    allSize += size;
    allActual += actual;
    result += '\n';
    result += makeColumn(table, maxWidth, true);
    result += makeColumn(size, 7);
    result += makeColumn(actual, 6);
    result += makeColumn(percentage(actual, size), 10);
    result += ` ${missing.join(', ')}`;
  }
  result += '\n';
  result += makeColumn(configuration.configuration, maxWidth, true);
  result += makeColumn(allSize, 7);
  result += makeColumn(allActual, 6);
  result += makeColumn(percentage(allActual, allSize), 10);
  return result;
}

/**
 * Sets cell content with respect to column with surronding it by whitespace.
 * @param cell The string in that cell.
 * @param size The column size.
 * @param left Cell is left aligned if set.
 * @return The string with the correctly set column
 */
function makeColumn(cell, size, left = false) {
  let length = cell.toString().length;
  let column = new Array(size - length + 1).join(' ');
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
