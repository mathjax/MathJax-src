import { describe, test, expect } from '@jest/globals';

const window = {document: {}, navigator: {appVersion: 'Win'}};
(global as any).window = window;

describe('context object', () => {

  test('context', async () => {
    let {context, hasWindow} = await import("#js/util/context.js");
    expect(context.path('C:\\test.js')).toBe('C:/test.js');
    expect(context.path('/C:/test.js')).toBe('C:/test.js');
    expect(context.path('/test.js')).toBe('/test.js');
    delete context.path;
    expect(context).toEqual({window: window, document: window.document, os: 'Windows'});
    expect(hasWindow).toBe(true);
  });

});
