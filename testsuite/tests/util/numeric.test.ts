import { describe, test, expect } from '@jest/globals';
import * as numeric from '#js/util/numeric.js';

describe('numeric functions', () => {

  test('sum', () => {
    expect(numeric.sum([1, 2, 3, 4, 5])).toBe(15);
    expect(numeric.sum([])).toBe(0);
  });

  test('max', () => {
    expect(numeric.max([5, 2, 10, 3, 50, -5])).toBe(50);
    expect(numeric.max([])).toBe(0);
  });

});
