import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/color/ColorConfiguration';

beforeEach(() => setupTex(['base', 'color']));

/**********************************************************************************/

describe('Color named', () => {
  test('Color extent', () => {
    expect(tex2mml('\\color{red} x+y')).toMatchSnapshot();
  });

  test('Color limited', () => {
    expect(tex2mml('{\\color{red} x}+y')).toMatchSnapshot();
  });

  test('Color known', () => {
    expect(tex2mml('{\\color{Peach} x}')).toMatchSnapshot();
  });

  test('Textcolor', () => {
    expect(tex2mml('\\textcolor{red}{a b} + c')).toMatchSnapshot();
  });

  test('Textcolor nested', () => {
    expect(
      tex2mml('\\textcolor{red}{\\textcolor{blue}{a} b}')
    ).toMatchSnapshot();
  });

  test('Colorbox', () => {
    expect(tex2mml('\\colorbox{red}{a b}')).toMatchSnapshot();
  });

  test('Fcolorbox', () => {
    expect(tex2mml('\\fcolorbox{red}{yellow}{a b}')).toMatchSnapshot();
  });

  test('Definecolor', () => {
    expect(
      tex2mml('\\definecolor{test}{named}{#48C}\\color{test} a')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Color rgb', () => {
  test('Color extent', () => {
    expect(tex2mml('\\color[rgb]{1,0,0} x+y')).toMatchSnapshot();
  });

  test('Color limited', () => {
    expect(tex2mml('{\\color[rgb]{1,0,0} x}+y')).toMatchSnapshot();
  });

  test('Textcolor', () => {
    expect(tex2mml('\\textcolor[rgb]{1,0,0}{a b} + c')).toMatchSnapshot();
  });

  test('Textcolor nested', () => {
    expect(
      tex2mml('\\textcolor[rgb]{1,0,0}{\\textcolor[rgb]{0,0,1}{a} b}')
    ).toMatchSnapshot();
  });

  test('Colorbox', () => {
    expect(tex2mml('\\colorbox[rgb]{1,0,0}{a b}')).toMatchSnapshot();
  });

  test('Fcolorbox', () => {
    expect(
      tex2mml('\\fcolorbox[rgb]{1,0,0}[rgb]{1,1,0}{a b}')
    ).toMatchSnapshot();
  });

  test('Definecolor', () => {
    expect(
      tex2mml('\\definecolor{test}{rgb}{.25,.5,.75}\\color{test} a')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Color RGB', () => {
  test('Color extent', () => {
    expect(tex2mml('\\color[RGB]{255,0,0} x+y')).toMatchSnapshot();
  });

  test('Color limited', () => {
    expect(tex2mml('{\\color[RGB]{255,0,0} x}+y')).toMatchSnapshot();
  });

  test('Textcolor', () => {
    expect(tex2mml('\\textcolor[RGB]{255,0,0}{a b} + c')).toMatchSnapshot();
  });

  test('Textcolor nested', () => {
    expect(
      tex2mml('\\textcolor[RGB]{255,0,0}{\\textcolor[RGB]{0,0,255}{a} b}')
    ).toMatchSnapshot();
  });

  test('Colorbox', () => {
    expect(tex2mml('\\colorbox[RGB]{255,0,0}{a b}')).toMatchSnapshot();
  });

  test('Fcolorbox', () => {
    expect(
      tex2mml('\\fcolorbox[RGB]{255,0,0}[RGB]{255,255,0}{a b}')
    ).toMatchSnapshot();
  });

  test('Definecolor', () => {
    expect(
      tex2mml('\\definecolor{test}{RGB}{8,128,200}\\color{test} a')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Color gray', () => {
  test('Color extent', () => {
    expect(tex2mml('\\color[gray]{.5} x+y')).toMatchSnapshot();
  });

  test('Color limited', () => {
    expect(tex2mml('{\\color[gray]{.5} x}+y')).toMatchSnapshot();
  });

  test('Textcolor', () => {
    expect(tex2mml('\\textcolor[gray]{.5}{a b} + c')).toMatchSnapshot();
  });

  test('Textcolor nested', () => {
    expect(
      tex2mml('\\textcolor[gray]{.5}{\\textcolor[gray]{.75}{a} b}')
    ).toMatchSnapshot();
  });

  test('Colorbox', () => {
    expect(tex2mml('\\colorbox[gray]{.5}{a b}')).toMatchSnapshot();
  });

  test('Fcolorbox', () => {
    expect(tex2mml('\\fcolorbox[gray]{.5}[gray]{.25}{a b}')).toMatchSnapshot();
  });

  test('Definecolor', () => {
    expect(
      tex2mml('\\definecolor{test}{gray}{.02}\\color{test} a')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Color errors', () => {
  test('UndefinedColormodel', () => {
    expectTexError('\\color[error]{error} x').toBe(
      "Color model 'error' not defined"
    );
  });

  test('ModelArg1 rgb', () => {
    expectTexError('\\definecolor{test}{rgb}{1}').toBe(
      'Color values for the rgb model require 3 numbers'
    );
  });

  test('InvalidDecimalNumber rgb', () => {
    expectTexError('\\definecolor{test}{rgb}{x,x,x}').toBe(
      'Invalid decimal number'
    );
  });

  test('ModelArg2 rgb', () => {
    expectTexError('\\definecolor{test}{rgb}{10,10,10}').toBe(
      'Color values for the rgb model must be between 0 and 1'
    );
  });

  test('ModelArg1 RGB', () => {
    expectTexError('\\definecolor{test}{RGB}{1}').toBe(
      'Color values for the RGB model require 3 numbers'
    );
  });

  test('InvalidDecimalNumber RGB', () => {
    expectTexError('\\definecolor{test}{RGB}{x,x,x}').toBe('Invalid number');
  });

  test('ModelArg2 RGB', () => {
    expectTexError('\\definecolor{test}{RGB}{1000,1000,1000}').toBe(
      'Color values for the RGB model must be between 0 and 255'
    );
  });

  test('InvalidDecimalNumber gray', () => {
    expectTexError('\\definecolor{test}{gray}{x}').toBe(
      'Invalid decimal number'
    );
  });

  test('ModelArg2 gray', () => {
    expectTexError('\\definecolor{test}{gray}{10}').toBe(
      'Color values for the gray model must be between 0 and 1'
    );
  });

  test('BadColorValue', () => {
    expectTexError('\\definecolor{error}{}{a;b}').toBe('Invalid color value');
  });

  test('BadColorValue named', () => {
    expectTexError('\\color[named]{a;b}{x}').toBe('Invalid color value');
  });
});

/**********************************************************************************/

afterAll(() => getTokens('color'));
