import { describe, test, expect } from '@jest/globals';
import * as string from '#js/util/string.js';

describe('string functions', () => {

  test('sortLength()', () => {
    expect(['a', '', 'aaa', 'aa'].sort(string.sortLength)).toEqual(['aaa', 'aa', 'a', '']);
    expect(['a', '', 'aaa', 'a', 'aa'].sort(string.sortLength)).toEqual(['aaa', 'aa', 'a', 'a', '']);
    expect(['a', 'ccc', '', 'aaa', 'bb', 'aa', 'bbb'].sort(string.sortLength)).toEqual(
      ['aaa', 'bbb', 'ccc', 'aa', 'bb', 'a', '']
    );
    expect(['a'].sort(string.sortLength)).toEqual(['a']);
    expect([].sort(string.sortLength)).toEqual([]);
  });

  test('quotePattern()', () => {
    expect(string.quotePattern('[({.*+?^$-|:\\})]')).toBe('\\[\\(\\{\\.\\*\\+\\?\\^\\$\\-\\|\\:\\\\\\}\\)\\]');
  });

  test('unicodeChars()', () => {
    expect(string.unicodeChars('aA\u00AA\u2212\uFFFD\u{1D410}')).toEqual([0x61, 0x41, 0xAA, 0x2212, 0xFFFD, 0x1D410]);
    expect(string.unicodeChars('')).toEqual([]);
  });

  test('uncideString()', () => {
    expect(string.unicodeString([0x61, 0x41, 0xAA, 0x2212, 0xFFFD, 0x1D410])).toBe('aA\u00AA\u2212\uFFFD\u{1D410}');
    expect(string.unicodeString([])).toBe('');
  });

  test('isPercent()', () => {
    expect(string.isPercent('10%')).toBe(true);
    expect(string.isPercent('10 % ')).toBe(true);
    expect(string.isPercent('10%10')).toBe(false);
  });

  test('split()', () => {
    expect(string.split('a bbb cc')).toEqual(['a', 'bbb', 'cc']);
    expect(string.split('  a  bbb    cc ')).toEqual(['a', 'bbb', 'cc']);
    expect(string.split('abc')).toEqual(['abc']);
    expect(string.split('')).toEqual(['']);
  });

  test('replaceUnicode()', () => {
    expect(string.replaceUnicode(String.raw`\U0061`)).toBe('a');
    expect(string.replaceUnicode(String.raw`a \U0062`)).toBe('a b');
    expect(string.replaceUnicode(String.raw`\U{61}`)).toBe('a');
    expect(string.replaceUnicode(String.raw`\U006D`)).toBe('m');
    expect(string.replaceUnicode(String.raw`\U006d`)).toBe('m');
    expect(string.replaceUnicode(String.raw`\U{6D}`)).toBe('m');
    expect(string.replaceUnicode(String.raw`\U{6d}`)).toBe('m');
    expect(string.replaceUnicode(String.raw`\U{6d}\U{6d}`)).toBe('mm');
    expect(string.replaceUnicode(String.raw`a \U{62} c`)).toBe('a b c');
    expect(string.replaceUnicode(String.raw`\\U{61}`)).toBe(String.raw`\U{61}`);
    expect(string.replaceUnicode(String.raw`\\\U{61}`)).toBe(String.raw`\a`);
    expect(string.replaceUnicode(String.raw`\\\\U{61}`)).toBe(String.raw`\\U{61}`);
    expect(string.replaceUnicode(String.raw`\\\\\U{61}`)).toBe(String.raw`\\a`);
    expect(string.replaceUnicode(String.raw`x\\U{61}`)).toBe(String.raw`x\U{61}`);
    expect(string.replaceUnicode(String.raw`x\\\U{61}`)).toBe(String.raw`x\a`);
    expect(string.replaceUnicode(String.raw`x\\\\U{61}`)).toBe(String.raw`x\\U{61}`);
    expect(string.replaceUnicode(String.raw`x\\\\\U{61}`)).toBe(String.raw`x\\a`);
  });

  test('toEntity()', () => {
    expect(string.toEntity('\u200B')).toBe('&#x200B;');
  });

});
