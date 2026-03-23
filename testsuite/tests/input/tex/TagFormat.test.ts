import { beforeEach, describe, expect, test } from '@jest/globals';
import { setupTex, tex2mml } from '#helpers';
import '#js/input/tex/tagformat/TagFormatConfiguration';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() =>
  setupTex(['base', 'ams', 'tagformat'], {
    tagformat: {
      number: (n: number) => `A${n}`,
      tag: (tag: string) => `[${tag}]`,
      id: (id: string) => 'my-tag:' + id.replace(/\s/g, '_'),
      url: (id: string, base: string) =>
        `[[${base}#${encodeURIComponent(id)}]]`,
    },
    tags: 'ams',
  })
);

/**********************************************************************************/

describe('Tagformat', () => {
  test('Basic tag', () => {
    expect(tex2mml('x \\tag{1}')).toMatchSnapshot();
  });

  test('Text tag', () => {
    expect(tex2mml('x \\tag{x}')).toMatchSnapshot();
  });

  test('Ref', () => {
    expect(
      tex2mml(
        '\\begin{align}x \\label{test}\\tag{x}\\\\ \\ref{test} \\end{align}'
      )
    ).toMatchSnapshot();
  });

  test('Eqref', () => {
    expect(
      tex2mml(
        '\\begin{align}x \\label{test}\\tag{x}\\\\ \\eqref{test} \\end{align}'
      )
    ).toMatchSnapshot();
  });

  test('Custom ref', () => {
    setupTex(['base', 'ams', 'tagformat'], {
      tagformat: {
        ref: (tag: string) => `**${tag}**`,
      },
      tags: 'ams',
    });
    expect(
      tex2mml(
        '\\begin{align}x \\label{test}\\tag{x}\\\\ \\eqref{test} \\end{align}'
      )
    ).toMatchSnapshot();
  });

  test('Array tag', () => {
    setupTex(['base', 'ams', 'tagformat'], {
      tagformat: {
        tag: (tag: string) => ['|', tag, '|'],
      },
      tags: 'ams',
    });
    expect(tex2mml('x \\tag{1}')).toMatchSnapshot();
  });

  test('Array tag with empty entry', () => {
    setupTex(['base', 'ams', 'tagformat'], {
      tagformat: {
        tag: (tag: string) => ['', tag, '.'],
      },
      tags: 'ams',
    });
    expect(tex2mml('x \\tag{1}')).toMatchSnapshot();
  });

  test('Array tag with null entry', () => {
    setupTex(['base', 'ams', 'tagformat'], {
      tagformat: {
        tag: (tag: string) => [, tag, '.'],
      },
      tags: 'ams',
    });
    expect(tex2mml('x \\tag{1}')).toMatchSnapshot();
  });
});

/**********************************************************************************/
