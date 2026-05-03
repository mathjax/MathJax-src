import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/empheq/EmpheqConfiguration';
import '#js/input/tex/cases/CasesConfiguration';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTex(['base', 'ams', 'empheq', 'cases'], { tags: 'ams' }));

/**********************************************************************************/

describe('Empheq', () => {
  test('Empheq Left', () => {
    expect(
      tex2mml(
        '\\begin{empheq}[left=L\\Rightarrow]{align} a&=b\\\\ c&=d \\end{empheq}'
      )
    ).toMatchSnapshot();
  });

  test('Empheq Right', () => {
    expect(
      tex2mml(
        '\\begin{empheq}[right=\\Leftarrow R]{align} a&=b\\\\ c&=d \\end{empheq}'
      )
    ).toMatchSnapshot();
  });

  test('Numcases with label', () => {
    expect(
      tex2mml('\\begin{numcases}{A=\\label{test}} a&=b \\end{numcases}')
    ).toMatchSnapshot();
  });

  test('Numcases empty right', () => {
    expect(
      tex2mml('\\begin{empheq}[right=x]{align}  \\end{empheq}')
    ).toMatchSnapshot();
  });

  test('Numcases empty left', () => {
    expect(
      tex2mml('\\begin{empheq}[left=x]{multline}  \\end{empheq}')
    ).toMatchSnapshot();
  });

  test('Numcases ', () => {
    expect(
      tex2mml('\\begin{empheq}[right=x]{align} a \\\\ b&=c \\end{empheq}')
    ).toMatchSnapshot();
  });

  test('Numcases alignedat', () => {
    expect(
      tex2mml('\\begin{empheq}{alignat=2} a & b & c & d \\end{empheq}')
    ).toMatchSnapshot();
  });

  test('Numcases invalid env', () => {
    expectTexError('\\begin{empheq}{split} \\end{empheq}').toBe(
      'Invalid environment "split" for empheq'
    );
  });
});

/**********************************************************************************/

describe('Empheq Characters', () => {
  test('empheqlbrace', () => {
    expect(tex2mml('\\empheqlbrace')).toMatchSnapshot();
  });

  test('empheqlbrace', () => {
    expect(tex2mml('\\empheqlbrace')).toMatchSnapshot();
  });

  test('empheqrbrace', () => {
    expect(tex2mml('\\empheqrbrace')).toMatchSnapshot();
  });

  test('empheqlbrack', () => {
    expect(tex2mml('\\empheqlbrack')).toMatchSnapshot();
  });

  test('empheqrbrack', () => {
    expect(tex2mml('\\empheqrbrack')).toMatchSnapshot();
  });

  test('empheqlangle', () => {
    expect(tex2mml('\\empheqlangle')).toMatchSnapshot();
  });

  test('empheqrangle', () => {
    expect(tex2mml('\\empheqrangle')).toMatchSnapshot();
  });

  test('empheqlparen', () => {
    expect(tex2mml('\\empheqlparen')).toMatchSnapshot();
  });

  test('empheqrparen', () => {
    expect(tex2mml('\\empheqrparen')).toMatchSnapshot();
  });

  test('empheqlvert', () => {
    expect(tex2mml('\\empheqlvert')).toMatchSnapshot();
  });

  test('empheqrvert', () => {
    expect(tex2mml('\\empheqrvert')).toMatchSnapshot();
  });

  test(' empheqlVert', () => {
    expect(tex2mml('\\empheqlVert')).toMatchSnapshot();
  });

  test('empheqrVert', () => {
    expect(tex2mml('\\empheqrVert')).toMatchSnapshot();
  });

  test('empheqlfloor', () => {
    expect(tex2mml('\\empheqlfloor')).toMatchSnapshot();
  });

  test('empheqrfloor', () => {
    expect(tex2mml('\\empheqrfloor')).toMatchSnapshot();
  });

  test('empheqlceil', () => {
    expect(tex2mml('\\empheqlceil')).toMatchSnapshot();
  });

  test('empheqrceil', () => {
    expect(tex2mml('\\empheqrceil')).toMatchSnapshot();
  });

  test('empheqbiglbrace', () => {
    expect(tex2mml('\\empheqbiglbrace')).toMatchSnapshot();
  });

  test('empheqbigrbrace', () => {
    expect(tex2mml('\\empheqbigrbrace')).toMatchSnapshot();
  });

  test('empheqbiglbrack', () => {
    expect(tex2mml('\\empheqbiglbrack')).toMatchSnapshot();
  });

  test('empheqbigrbrack', () => {
    expect(tex2mml('\\empheqbigrbrack')).toMatchSnapshot();
  });

  test('empheqbiglangle', () => {
    expect(tex2mml('\\empheqbiglangle')).toMatchSnapshot();
  });

  test('empheqbigrangle', () => {
    expect(tex2mml('\\empheqbigrangle')).toMatchSnapshot();
  });

  test('empheqbiglparen', () => {
    expect(tex2mml('\\empheqbiglparen')).toMatchSnapshot();
  });

  test('empheqbigrparen', () => {
    expect(tex2mml('\\empheqbigrparen')).toMatchSnapshot();
  });

  test('empheqbiglvert', () => {
    expect(tex2mml('\\empheqbiglvert')).toMatchSnapshot();
  });

  test('empheqbigrvert', () => {
    expect(tex2mml('\\empheqbigrvert')).toMatchSnapshot();
  });

  test('empheqbiglVert', () => {
    expect(tex2mml('\\empheqbiglVert')).toMatchSnapshot();
  });

  test('empheqbigrVert', () => {
    expect(tex2mml('\\empheqbigrVert')).toMatchSnapshot();
  });

  test('empheqbiglfloor', () => {
    expect(tex2mml('\\empheqbiglfloor')).toMatchSnapshot();
  });

  test('empheqbigrfloor', () => {
    expect(tex2mml('\\empheqbigrfloor')).toMatchSnapshot();
  });

  test('empheqbiglceil', () => {
    expect(tex2mml('\\empheqbiglceil')).toMatchSnapshot();
  });

  test('empheqbigrceil', () => {
    expect(tex2mml('\\empheqbigrceil')).toMatchSnapshot();
  });

  test('empheql', () => {
    expect(tex2mml('\\empheql(')).toMatchSnapshot();
  });

  test('empheqr', () => {
    expect(tex2mml('\\empheqr)')).toMatchSnapshot();
  });

  test('empheqbigl', () => {
    expect(tex2mml('\\empheqbigl(')).toMatchSnapshot();
  });

  test('empheqbigr', () => {
    expect(tex2mml('\\empheqbigr)')).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('empheq'));
