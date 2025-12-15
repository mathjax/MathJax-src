import { describe, test, expect } from '@jest/globals';

global.process = {...process, platform: 'test'} as any;

describe('context object', () => {

  test('context', async () => {
    let {context, hasWindow} = await import("#js/util/context.js");
    expect(context.path('C:\\test.js')).toBe('C:\\test.js');
    delete context.path;
    expect(context).toEqual({window: null, document: null, os: 'test'});
    expect(hasWindow).toBe(false);
  });

});
