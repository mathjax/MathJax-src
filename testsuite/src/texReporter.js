import * as fs from 'fs';

export default class CustomReporter {

  constructor(globalConfig, reporterOptions, reporterContext) {
    this._globalConfig = globalConfig;
    this._options = reporterOptions;
    this._context = reporterContext;
  }

  onRunStart(
    aggregatedResults, options
  ) {
    fs.writeFileSync('/tmp/test.json', '[{}');
  }

  onRunComplete(testContexts, results) {
    fs.appendFileSync('/tmp/test.json', ']');
    console.log(JSON.parse(fs.readFileSync('/tmp/test.json')));
  }

  // Optionally, reporters can force Jest to exit with non zero code by returning
  // an `Error` from `getLastError()` method.
  getLastError() {
    if (this._shouldFail) {
      return new Error('Custom error reported!');
    }
  }
}
