import { expect } from '@jest/globals';
import { xml2json } from 'xml-js';

expect.extend({
  // An xml matcher via deep equality on JSON objects.
  toBeXmlMatch(received, expected) {
    const recJson = xml2json(received);
    const exptJson = xml2json(expected)
    const pass = this.equals(recJson, exptJson, [this.utils.iterableEquality]);
    const message = () =>
      `Expected: ${this.utils.printExpected(expected)}\nReceived: ${this.utils.printReceived(received)}`;
    return { pass, message }
  },
});

export function toXmlMatch(received: string, expected: string) {
  // This is slightly awkward way of getting around ts-jest problems with custom
  // matcher extensions.
  (expect(received) as any).toBeXmlMatch(expected);
}
