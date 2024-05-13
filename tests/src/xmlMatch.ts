import { expect } from '@jest/globals';
import { xml2json } from 'xml-js';

export async function toXmlMatch(received: string, expected: string) {
  expect(xml2json(received)).toStrictEqual(xml2json(expected));
}
