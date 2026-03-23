import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/cases/CasesConfiguration';
import '#js/input/tex/empheq/EmpheqConfiguration';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTex(['base', 'ams', 'cases'], {tags: 'cases'}));

/**********************************************************************************/

describe('Cases', () => {

  test('Numcases', () => {
    expect(tex2mml('\\begin{numcases}{f(x)=} 1 & if $x > 0$ \\\\ 0 & otherwise \\end{numcases}')).toMatchSnapshot();
  });

  test('subnumcases', () => {
    expect(tex2mml('\\begin{subnumcases}{f(x)=} 1 & if $x > 0$ \\\\ 0 & otherwise \\end{subnumcases}')).toMatchSnapshot();
  });

  test('Numcases with macro', () => {
    expect(tex2mml('\\begin{numcases}{A=} 1 & if {x\\\\y}\\$ \\end{numcases}')).toMatchSnapshot();
  });

  test('numcases extra brace', () => {
    expectTexError('\\begin{numcases}{A=} x & } \\end{numcases}')
      .toBe('Extra close brace or missing open brace');
  });

  test('numcases extra column', () => {
    expectTexError('\\begin{numcases}{A=} x & y & z \\end{numcases}')
      .toBe('Extra alignment tab in text for numcase environment');
  });

  test('entry not in numcases', () => {
    expect(tex2mml('\\begin{array}{cc} x & y \\end{array}')).toMatchSnapshot();
  });

  test('numcases with explicit tag', () => {
    expect(tex2mml('\\begin{numcases}{A=} x\\tag{A} & y \\end{numcases}')).toMatchSnapshot();
  });

  test('numcases not complete', () => {
    expectTexError('\\begin{numcases}{A=} x & y\\')
      .toBe('Missing \\end{numcases}');
  });

});

/**********************************************************************************/

afterAll(() => getTokens('cases'));
