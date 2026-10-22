import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/esdiff/EsdiffConfiguration.js';

beforeEach(() => setupTex(['base', 'esdiff']));

/**********************************************************************************/

describe('Esdiff', () => {
  test('diff', () => {
    expect(tex2mml('\\diff{f}{x}')).toMatchSnapshot();
  });

  test('diff order', () => {
    expect(tex2mml('\\diff[n]{f}{x}')).toMatchSnapshot();
  });

  test('diff star', () => {
    expect(tex2mml('\\diff*{f}{x}{x_0}')).toMatchSnapshot();
  });

  test('diff star order', () => {
    expect(tex2mml('\\diff*[2]{g}{y}{0}')).toMatchSnapshot();
  });

  test('diff inline', () => {
    expect(tex2mml('\\diff{f}{x}', false)).toMatchSnapshot();
  });

  test('diff script', () => {
    expect(tex2mml('a^{\\diff{f}{x}}')).toMatchSnapshot();
  });

  test('diffp', () => {
    expect(tex2mml('\\diffp{f}{x}')).toMatchSnapshot();
  });

  test('diffp order', () => {
    expect(tex2mml('\\diffp[2]{f}{x}')).toMatchSnapshot();
  });

  test('diffp star', () => {
    expect(tex2mml('\\diffp*{p}{V}{T}')).toMatchSnapshot();
  });

  test('diffp star order', () => {
    expect(tex2mml('\\diffp*[2]{p}{V}{T}')).toMatchSnapshot();
  });

  test('diffp crossed', () => {
    expect(tex2mml('\\diffp{f}{{x}{y^2}}')).toMatchSnapshot();
  });

  test('diffp crossed braced power', () => {
    expect(tex2mml('\\diffp{f}{{x^2}}')).toMatchSnapshot();
  });

  test('diffp crossed star', () => {
    expect(tex2mml('\\diffp*{f}{{x^2}{y^3}}{z}')).toMatchSnapshot();
  });

  test('diffp crossed macros', () => {
    expect(tex2mml('\\diffp{\\phi}{\\alpha\\beta}')).toMatchSnapshot();
  });

  test('diffp crossed unbraced', () => {
    expect(tex2mml('\\diffp{f}{xy}')).toMatchSnapshot();
  });

  test('diffp crossed large power', () => {
    expect(tex2mml('\\diffp{f}{{x^{10}}{y^2}z}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Esdiff errors', () => {
  test('diffp non-numeric power', () => {
    expectTexError('\\diffp{f}{{x^n}{y}}').toBe(
      'Power of a variable for \\diffp must be a number, not n'
    );
  });

  test('diffp empty power', () => {
    expectTexError('\\diffp{f}{{x^{}}}').toBe(
      'Power of a variable for \\diffp must be a number, not '
    );
  });

  test('diffp dangling superscript', () => {
    expectTexError('\\diffp{f}{x^}').toBe(
      'Missing superscript or subscript argument'
    );
  });

  test('diffp dangling superscript braced', () => {
    expectTexError('\\diffp{f}{{x^}}').toBe(
      'Missing superscript or subscript argument'
    );
  });

  test('diffp dangling superscript spaces', () => {
    expectTexError('\\diffp{f}{{x^ }}').toBe(
      'Missing superscript or subscript argument'
    );
  });

  test('diffp leading superscript', () => {
    expectTexError('\\diffp{f}{^2}').toBe(
      'Missing superscript or subscript argument'
    );
  });

  test('diffp unbraced power', () => {
    expectTexError('\\diffp{f}{x^2}').toBe(
      'Missing superscript or subscript argument'
    );
  });

  test('diffp dangling subscript', () => {
    expectTexError('\\diffp{f}{x_}').toBe(
      'Missing superscript or subscript argument'
    );
  });

  test('diffp dangling subscript braced', () => {
    expectTexError('\\diffp{f}{{x_}}').toBe(
      'Missing superscript or subscript argument'
    );
  });
});

/**********************************************************************************/

afterAll(() => getTokens('esdiff'));
