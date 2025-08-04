import { describe, test, expect } from '@jest/globals';

const window = {document: {}, navigator: {appVersion: 'Linux'}};
(global as any).window = window;

describe('context object', () => {

  test('context', async () => {
    let {context, hasWindow} = await import("#js/util/context.js");
    expect(context).toEqual({window: window, document: window.document, os: 'Unix'});
    expect(hasWindow).toBe(true);
  });

});
