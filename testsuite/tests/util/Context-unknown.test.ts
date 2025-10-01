import { describe, test, expect } from '@jest/globals';

const window = {document: {}, navigator: {userAgent: '', appVersion: ''}};
(global as any).window = window;

describe('context object', () => {

  test('context', async () => {
    let {context, hasWindow} = await import("#js/util/context.js");
    expect(context.path('C:\\test.js')).toBe('C:\\test.js');
    delete context.path;
    expect(context).toEqual({window: window, document: window.document, os: 'unknown'});
    expect(hasWindow).toBe(true);
  });

});
