import { beforeEach, describe, expect, it } from '@jest/globals';
import { setupTex, tex2mml } from '#helpers';
import '#js/input/tex/noerrors/NoErrorsConfiguration';

beforeEach(() => setupTex(['base', 'noerrors']));

/**********************************************************************************/
/**********************************************************************************/

describe('NoError', () => {

  /********************************************************************************/

  it('Ampersand-error', () => {
    expect(tex2mml('&')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Argument-error', () => {
    expect(tex2mml('\\frac{b}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Undefined-CS', () => {
    expect(tex2mml('\\nonsense')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Undefined-Env', () => {
    expect(tex2mml('\\begin{nonsense} a \\end{nonsense}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Double-super-error', () => {
    expect(tex2mml('x^2^3')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Double-over-error', () => {
    expect(tex2mml('\\sum^2^3')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Limits Error', () => {
    expect(tex2mml('+\\limits^2')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Double sub error', () => {
    expect(tex2mml('x_2_3')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Double under error', () => {
    expect(tex2mml('\\sum_2_3')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Brace Superscript Error', () => {
    expect(tex2mml("x'^'")).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Double Prime Error', () => {
    expect(tex2mml("x^\\prime'")).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Hash Error', () => {
    expect(tex2mml('#')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Missing Right', () => {
    expect(tex2mml('\\left(\\middle|')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Orphan Middle', () => {
    expect(tex2mml('\\middle|')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Middle with Right', () => {
    expect(tex2mml('\\middle|\\right)')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Misplaced Move Root', () => {
    expect(tex2mml('\\uproot{2}\\sqrt[3]{a}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Multiple Move Root', () => {
    expect(tex2mml('\\sqrt[\\uproot{-2}\\uproot{2}\\beta]{k}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Incorrect Move Root', () => {
    expect(tex2mml('\\sqrt[\\uproot-2.5\\beta]{k}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Double Over', () => {
    expect(tex2mml('1 \\over 2 \\over 3')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Token Illegal Type', () => {
    expect(tex2mml('\\mmlToken{mk}[]{}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Token Wrong Type', () => {
    expect(tex2mml('\\mmlToken{mrow}[]{}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Token Invalid Attribute', () => {
    expect(tex2mml('\\mmlToken{mi}[m1=true]{}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Token Unknown Attribute', () => {
    expect(tex2mml('\\mmlToken{mo}[nothing="something"]{}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Token Wrong Attribute', () => {
    expect(tex2mml('\\mmlToken{mi}[movablelimit=true]{}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingBeginExtraEnd', () => {
    expect(tex2mml('\\end{array}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('ExtraCloseMissingOpen', () => {
    expect(tex2mml('x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingLeftExtraRight', () => {
    expect(tex2mml('x\\right\\}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('ExtraOpenMissingClose', () => {
    expect(tex2mml('{x')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingScript Sub', () => {
    expect(tex2mml('x_')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingScript Sup', () => {
    expect(tex2mml('x^')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingOpenForSup', () => {
    expect(tex2mml('x^^')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingOpenForSub', () => {
    expect(tex2mml('x__')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('ExtraLeftMissingRight', () => {
    expect(tex2mml('\\left\\{x')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Misplaced Cr', () => {
    expect(tex2mml('a\\cr b')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Dimension Error', () => {
    expect(tex2mml('a\\\\[abc] b')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingArgFor', () => {
    expect(tex2mml('\\sqrt')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('ExtraCloseMissingOpen 2', () => {
    expect(tex2mml('\\sqrt}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingCloseBrace', () => {
    expect(tex2mml('\\sqrt{')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('ExtraCloseLooking1', () => {
    expect(tex2mml('\\sqrt[3}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingCloseBracket', () => {
    expect(tex2mml('\\sqrt[3{x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingOrUnrecognizedDelim1', () => {
    expect(tex2mml('\\left\\alpha b')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingOrUnrecognizedDelim2', () => {
    expect(tex2mml('\\left( b\\right')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingDimOrUnits', () => {
    expect(tex2mml('\\rule{}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('TokenNotFoundForCommand', () => {
    expect(tex2mml('\\root {3] \\of 5')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('ExtraCloseLooking2', () => {
    expect(tex2mml('\\root [3} \\of 5 ')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingOrUnrecognizedDelim', () => {
    expect(tex2mml('\\genfrac{(}{a}{}{2}{1}{2}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('ErroneousNestingEq', () => {
    expect(tex2mml(
        '\\begin{equation}\\begin{eqnarray}\\end{eqnarray}\\end{equation}'
    )).toMatchSnapshot();
  });

  /********************************************************************************/

  it('ExtraAlignTab', () => {
    expect(tex2mml('\\cases{b & l & k}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Misplaced hline', () => {
    expect(tex2mml('\\hline')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('UnsupportedHFill', () => {
    expect(tex2mml('a\\hfill b')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('InvalidEnv', () => {
    expect(tex2mml('\\begin{\\ff}kk\\end{\\ff}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('EnvBadEnd', () => {
    expect(tex2mml('\\begin{equation}a\\end{array}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('EnvMissingEnd Array', () => {
    expect(tex2mml('\\begin{array}a')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingBoxFor', () => {
    expect(tex2mml('\\raise{2pt}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('MissingCloseBrace2', () => {
    expect(tex2mml('\\begin{array}{c')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('EnvMissingEnd Equation', () => {
    expect(tex2mml('\\begin{equation}a')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/
