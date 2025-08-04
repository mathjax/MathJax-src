import { expect } from '@jest/globals';
import { xml2json } from 'xml-js';

expect.extend({
  /**
   * An xml matcher via deep equality on JSON objects.
   *
   * @param {string} received  The string received from the tests
   * @param {string} expected  The string expected to be produced by the tests
   */
  toBeXmlMatch(received: string, expected: string) {
    const recJson = xml2json(received);
    const exptJson = xml2json(expected)
    const pass = this.equals(recJson, exptJson, [this.utils.iterableEquality]);
    const message = () =>
      `Expected: ${this.utils.printExpected(expected)}\nReceived: ${this.utils.printReceived(received)}`;
    return { pass, message }
  },
});

/**
 * Compares a result to an expected result.
 *
 * @param {string} received  The string received from the tests
 * @param {string} expected  The string expected to be produced by the tests
 */
export function toXmlMatch(received: string, expected: string) {
  // This is slightly awkward way of getting around ts-jest problems with custom
  // matcher extensions.
  (expect(received) as any).toBeXmlMatch(expected);
}

/**
 * Compares an array of results to an array of expected results.
 *
 * @param {string[]} received  An array of strings received from the tests
 * @param {string[]} expected  The array of string expected to be produced by the tests
 */
export function toXmlArrayMatch(received: string[], expected: string[]) {
  const r = received.length;
  const e = expected.length;
  expect(`${r} MathML string${r === 1 ? '' : 's'}`).toBe(`${e} MathML string${e === 1 ? '' : 's'}`);
  for (let i = 0; i < received.length; i++) {
    toXmlMatch(`<!--${i+1}-->\n${received[i]}`, `<!--${i+1}-->\n${expected[i]}`);
  }
}
