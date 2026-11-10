import { describe, expect, it } from '@jest/globals';
import { FindTypst } from '#js/input/typst/FindTypst.js';

describe('FindTypst', () => {
  it('finds inline and display math with exact source offsets', () => {
    expect(new FindTypst().findMath(['a $x$ b $$y$$ c', '$z$'])).toEqual([
      {
        open: '$',
        math: 'x',
        close: '$',
        n: 0,
        start: { n: 2 },
        end: { n: 5 },
        display: false,
      },
      {
        open: '$$',
        math: 'y',
        close: '$$',
        n: 0,
        start: { n: 8 },
        end: { n: 13 },
        display: true,
      },
      {
        open: '$',
        math: 'z',
        close: '$',
        n: 1,
        start: { n: 0 },
        end: { n: 3 },
        display: false,
      },
    ]);
  });

  it.each([
    [],
    [''],
    ['plain text'],
    ['$unclosed'],
    ['$$unclosed'],
    ['$x', 'y$'],
  ])(
    'ignores input without a complete delimiter pair: %j',
    (...strings: string[]) => {
      expect(new FindTypst().findMath(strings)).toEqual([]);
    }
  );

  it('prefers the longest opening delimiter at the same position', () => {
    const finder = new FindTypst({
      inlineDelimiters: [['[', ']']],
      displayDelimiters: [['[[', ']]']],
    });
    expect(
      finder.findMath(['[[x]][y]']).map(({ math, display }) => [math, display])
    ).toEqual([
      ['x', true],
      ['y', false],
    ]);
  });

  it('supports literal custom delimiters and continues after unmatched openers', () => {
    const finder = new FindTypst({
      inlineDelimiters: [['\\(', '\\)']],
      displayDelimiters: [['[[', ']]']],
    });
    expect(finder.findMath([String.raw`[[unclosed \(x\)`])).toEqual([
      {
        open: '\\(',
        math: 'x',
        close: '\\)',
        n: 0,
        start: { n: 11 },
        end: { n: 16 },
        display: false,
      },
    ]);
    expect(finder.findMath(['$x$'])).toEqual([]);
  });

  it('ignores escaped openers and closers', () => {
    const source = String.raw`\$ignored $x\$y$`;
    expect(new FindTypst().findMath([source])).toEqual([
      {
        open: '$',
        math: String.raw`x\$y`,
        close: '$',
        n: 0,
        start: { n: 10 },
        end: { n: 16 },
        display: false,
      },
    ]);
  });

  it.each([1, 2, 3, 4])(
    'uses backslash parity for opening and closing delimiters (%i)',
    (count) => {
      const slashes = '\\'.repeat(count);
      const finder = new FindTypst();
      expect(finder.findMath([`${slashes}$x$`])).toHaveLength(
        count % 2 ? 0 : 1
      );
      const matches = finder.findMath([`$x${slashes}$y$`]);
      expect(matches[0].math).toBe(count % 2 ? `x${slashes}$y` : `x${slashes}`);
    }
  );

  it('can disable escape processing', () => {
    expect(
      new FindTypst({ processEscapes: false }).findMath([String.raw`\$x\$`])
    ).toEqual([
      {
        open: '$',
        math: 'x\\',
        close: '$',
        n: 0,
        start: { n: 1 },
        end: { n: 5 },
        display: false,
      },
    ]);
  });

  it('handles multiline bodies, adjacent expressions, and empty display math', () => {
    expect(
      new FindTypst()
        .findMath(['$x\ny$$z$ $$$$'])
        .map(({ math, display }) => [math, display])
    ).toEqual([
      ['x\ny', false],
      ['z', false],
      ['', true],
    ]);
  });

  it('allows all delimiters to be disabled', () => {
    expect(
      new FindTypst({ inlineDelimiters: [], displayDelimiters: [] }).findMath([
        '$x$ $$y$$',
      ])
    ).toEqual([]);
  });
});
