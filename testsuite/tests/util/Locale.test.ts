import { describe, test, expect, jest } from '@jest/globals';
import { trapOutput, trapAsyncOutput } from '#helpers/traps.js';
import { Locale } from '#js/util/Locale.js';
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
    expect(locale.locations.component).toEqual([
      '../testsuite/lib/component/__locales__',
      new Set(),
    ]);
    const spy = jest.spyOn(console, 'error').mockImplementation((msg) => {throw msg});
    await expect(Locale.setLocale('xy')).rejects.toContain(
      "MathJax(component): Can't load 'xy.json': ENOENT: no such file or directory"
    );
    await expect(Locale.setLocale('de')).rejects.toContain(
      "MathJax(component): 'de.json' kann nicht geladen werden: ENOENT: no such file or directory"
    );
    spy.mockRestore();
    await Locale.setLocale('en');
    expect(locale.data.component).toEqual({ en: { Id1: 'Test of %1 in %2' } });
    expect(Locale.message('component', 'Id1', 'message', 'Locale')).toBe(
      'Test of message in Locale'
    );
  });

  /********************************************************************************/

  test('Messages', async () => {
    Locale.registerLocaleFiles('component', '../testsuite/lib/component');
    await Locale.setLocale('en'); // load English backups
    await Locale.setLocale('test');
    expect(Locale.message('component', 'test1')).toBe('Has % percent');
    expect(Locale.message('component', 'test2', 'x')).toBe('Has x one');
    expect(Locale.message('component', 'test3', 'a', 'b')).toBe(
      'Order b a reversed'
    );
    expect(Locale.message('component', 'test4', 'a', 'b', 'c')).toBe(
      'Skip a c'
    );
    expect(Locale.message('component', 'test4')).toBe('Skip  ');
    expect(
      Locale.message('component', 'test5', { hello: 'HELLO', world: 'WORLD' })
    ).toBe('Named HELLO WORLD');
    expect(Locale.message('component', 'Id1', 'a', 'b')).toBe('Test of a in b');
    expect(Locale.message('component', 'Id2')).toBe(
      "MathJax(Locale): No localized or default version for message with id 'Id2' from 'component'"
    );
    expect(Locale.message('undefined', 'Id1')).toBe(
      "MathJax(Locale): No localized or default version for message with id 'Id1' from 'undefined'"
    );
    expect(() => Locale.throw('component', 'error', 'x')).toThrow('Error in x');
    Locale.current = 'de';
    expect(Locale.message('undefined', 'Id1')).toBe(
      "MathJax(Locale): Keine lokalisierte oder Standardversion für die Meldung mit der ID 'Id1' aus 'undefined'"
    );
    Locale.current = 'xy';
    Locale.default = 'xy';
    expect(Locale.message('undefined', 'Id1')).toBe('');
    Locale.current = 'en';
    Locale.default = 'en';
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

  test('Message with empty component', () => {
    expect(Locale.message('', 'any')).toBe('');
    expect(Locale.message('', 'any', {})).toBe('');
    expect(Locale.message('', 'any', 'raw text')).toBe('raw text');
    expect(Locale.message('', 'any', '%1 + %2', 'a', 'b')).toBe('a + b');
  });

  /********************************************************************************/

  test('Locale error falls back to default locale', async () => {
    const locale = Locale as any;
    Locale.registerLocaleFiles('fallback', '../testsuite/lib/component');
    const message = await trapAsyncOutput('error', async () => {
      await locale.localeError(
        'fallback',
        'xy',
        new Error('xy.json not found')
      );
    });
    expect(message).toContain("MathJax(fallback): Can't load 'xy.json'");
    expect(locale.data.fallback?.en).toEqual({ Id1: 'Test of %1 in %2' });
  });

  /********************************************************************************/

  test('Locale warn', async () => {
    Locale.registerLocaleFiles('component', '../testsuite/lib/component');
    const message = trapOutput('warn', () =>
      Locale.warn('component', 'test2', 'warn')
    );
    expect(message).toEqual('Has warn one');
  });

  /********************************************************************************/
});

/**********************************************************************************/
/**********************************************************************************/
