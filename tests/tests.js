/* globals System: true */

let test = System.nodeRequire('tape');

export class Test {

  constructor() {
    /**
     * @type {Object.<string, number>}
     */
    this.runningTests = {};

    /**
     * @type {Object.<string, number>}
     */
    this.concludedTests = {};

    this.createStream();
  }


  /**
   * @param {string} name The name of the test.
   * @private
   */
  startTest(name) {
    this.runningTests[name] = (new Date()).getTime();
  }

  stopTest(name) {
    this.concludedTests[name] =
        (new Date()).getTime() - this.runningTests[name];
    delete this.runningTests[name];
  }


  printTime() {
    if (Object.keys(this.runningTests).length) {
      setTimeout(this.printTime.bind(this), 100);
      return;
    }
    let time = 0;
    for (var test in this.concludedTests) {
      time += this.concludedTests[test];
      delete this.concludedTests[test];
    }
    process.stdout.write(this.constructor.name + ': ' + time + 'ms\n');
  }

  test(name, func) {
    this.startTest(name);
    test(name, function(t) {
      t.plan(1);
      func(t);
      this.stopTest(name);
    }.bind(this));
  }

  createStream() {
    test.createStream({ objectMode: true }).on('data', result => {
      if (result.type !== 'assert') return;
      process.stdout.write('Running test ' + result.name + '\t' +
                           (result.ok ?
                            ('\u001B\u005B\u0033\u0032\u006D' + 'PASS' +
                             '\u001B\u005B\u0033\u0037\u006D') :
                            ('\u001B\u005B\u0033\u0031\u006D' + 'FAIL' +
                             '\u001B\u005B\u0033\u0037\u006D')) +
                           '\n');
      if (result.ok) return;
      process.stdout.write('Actual: \n');
      process.stdout.write(JSON.stringify(result.actual) + '\n');
      process.stdout.write('Expected: \n');
      process.stdout.write(JSON.stringify(result.expected) + '\n');
    });
  }

  runTest(name, input, expected) {}

}
