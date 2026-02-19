import { describe, test, expect } from '@jest/globals';
import {Locale} from '#js/util/Locale.js';
import '#js/util/asyncLoad/esm.js';

/**********************************************************************************/
/**********************************************************************************/

describe('Locale', () => {

  /********************************************************************************/

  test('Set locale', async () => {
    expect(Locale.current).toBe('en');
    await Locale.setLocale();
    expect(Locale.current).toBe('en');
    await Locale.setLocale('de');
    expect(Locale.current).toBe('de');
    await Locale.setLocale('en');
    expect(Locale.current).toBe('en');
  });

  /********************************************************************************/

  test('Register a component', async () => {
    const locale = Locale as any;
    Locale.registerLocaleFiles('component', '../testsuite/lib/component');
    expect(locale.locations.component).toEqual(['../testsuite/lib/component/locales', new Set()]);
    const error = console.error;
    console.error = (message) => {throw message};
    await expect(Locale.setLocale('de')).rejects
      .toMatch("MathJax(component): Can't load 'de.json': ENOENT: no such file or directory");
    console.error = error;
    await Locale.setLocale('en');
    expect(locale.data.component).toEqual({en: {Id1: 'Test of %1 in %2'}});
    expect(Locale.message('component', 'Id1', 'message', 'Locale')).toBe('Test of message in Locale');
  });

  /********************************************************************************/

  test('Messages', async () => {
    Locale.registerLocaleFiles('component', '../testsuite/lib/component');
    await Locale.setLocale('en');  // load English backups
    await Locale.setLocale('test');
    expect(Locale.message('component', 'test1')).toBe('Has % percent');
    expect(Locale.message('component', 'test2', 'x')).toBe('Has x one');
    expect(Locale.message('component', 'test3', 'a', 'b')).toBe('Order b a reversed');
    expect(Locale.message('component', 'test4', 'a', 'b', 'c')).toBe('Skip a c');
    expect(Locale.message('component', 'test4')).toBe('Skip  ');
    expect(Locale.message('component', 'test5', {hello: 'HELLO', world: 'WORLD'})).toBe('Named HELLO WORLD');
    expect(Locale.message('component', 'Id1', 'a', 'b')).toBe('Test of a in b');
    expect(Locale.message('component', 'Id2'))
      .toBe("No localized or default version for message with id 'Id2' from 'component'");
    expect(Locale.message('undefined', 'Id1'))
      .toBe("No localized or default version for message with id 'Id1' from 'undefined'");
    expect(() => Locale.error('component', 'error', 'x')).toThrow('Error in x');
  });

  /********************************************************************************/

  test('isComponent', async () => {
    Locale.isComponent = true;
    Locale.registerLocaleFiles('../testsuite/lib/component', 'notfound');
    await Locale.setLocale('test');
    expect(Locale.message('component', 'test1')).toBe('Has % percent');
    Locale.isComponent = false;
  });

  /********************************************************************************/

});


/**********************************************************************************/
/**********************************************************************************/
