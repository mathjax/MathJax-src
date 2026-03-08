import { describe, test, expect } from '@jest/globals';
import { context, hasWindow } from '#js/util/context.js';

const OS = {
  'linux': 'Unix',
  'android': 'Unix',
  'aix': 'Unix',
  'freebsd': 'Unix',
  'netbsd': 'Unix',
  'openbsd': 'Unix',
  'sunos': 'Unix',
  'darwin': 'MacOS',
  'win32': 'Windows',
  'cygwin': 'Windows',
  'haiku': 'unknown',
}[process.platform] || process.platform;

describe('context object', () => {

  test('context', () => {
    if (OS === 'Windows') {
      expect(context.path('C:\\test.js')).toBe('file://C:/test.js');
    } else {
      expect(context.path('C:\\test.js')).toBe('C:\\test.js');
    }
    delete context.path;
    expect(context).toEqual({window: null, document: null, os: OS});
    expect(hasWindow).toBe(false);
  });

});
