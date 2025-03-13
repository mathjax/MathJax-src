import { describe, test, expect } from '@jest/globals';
import { context, hasWindow } from '#js/util/context.js';

describe('context object', () => {

  test('context', () => {
    expect(context).toEqual({window: null, document: null});
    expect(hasWindow).toBe(false);
  });

});
