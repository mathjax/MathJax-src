import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import { ColorArrayItem } from '#js/input/tex/colortbl/ColortblConfiguration.js';
import '#js/input/tex/color/ColorConfiguration.js';

import { Configuration } from '#js/input/tex/Configuration.js';
import { ConfigurationType } from '#js/input/tex/HandlerTypes.js';

beforeEach(() => setupTex(['base', 'colortbl']));

/**********************************************************************************/

describe('Colortbl', () => {

  test('cellcolor', () => {
    expect(tex2mml('\\begin{array}{cc} a & \\cellcolor{red} b \\\\ \\cellcolor{yellow} c & d \\end{array}')).toMatchSnapshot();
  });

  test('cellcolor late', () => {
    expect(tex2mml('\\begin{array}{cc} a & b \\cellcolor{red} \\end{array}')).toMatchSnapshot();
  });

  test('rowcolor', () => {
    expect(tex2mml('\\begin{array}{cc} a & b \\\\ \\rowcolor{yellow} c & d \\end{array}')).toMatchSnapshot();
  });

  test('rowcolor late', () => {
    expectTexError('\\begin{array}{cc} a & b \\\\ c & \\rowcolor{yellow} d \\end{array}')
      .toBe('\\rowcolor must be at the beginning of a row');
  });

  test('columncolor', () => {
    expect(tex2mml('\\begin{array}{cc} a & \\columncolor{yellow} b \\\\ c & d \\end{array}')).toMatchSnapshot();
  });

  test('columncolor late', () => {
    expectTexError('\\begin{array}{cc} a & b \\\\ c & \\columncolor{yellow} d \\end{array}')
      .toBe('\\columncolor must be in the top row or preamble');
  });

  test('columncolor in preamble', () => {
    expect(tex2mml('\\begin{array}{c>{\\columncolor{yellow}}c} a & b \\\\ c & d \\end{array}')).toMatchSnapshot();
  });

  test('cellcolor in preamble', () => {
    expect(tex2mml('\\begin{array}{c>{\\cellcolor{yellow}}c} a & b \\\\ c & d \\end{array}')).toMatchSnapshot();
  });

  test('cellcolor with rowcolor', () => {
    expect(tex2mml('\\begin{array}{cc} a & b \\\\ \\rowcolor{red} c & \\cellcolor{yellow} d \\end{array}')).toMatchSnapshot();
  });

  test('cellcolor with columncolor', () => {
    expect(tex2mml('\\begin{array}{cc} a & \\columncolor{red} b \\\\ c & \\cellcolor{yellow} d \\end{array}')).toMatchSnapshot();
  });

  test('columncolor and rowcolor', () => {
    expect(tex2mml('\\begin{array}{cc} a & \\columncolor{red} b \\\\ \\rowcolor{yellow} c & d \\end{array}')).toMatchSnapshot();
  });

  test('cellcolor with columncolor and rowcolor', () => {
    expect(tex2mml('\\begin{array}{cc} a & \\columncolor{red} b \\\\ \\rowcolor{yellow} c & \\cellcolor{green} d \\end{array}')).toMatchSnapshot();
  });

  test('columncolor ignore overlap', () => {
    expect(tex2mml('\\begin{array}{cc} a & \\columncolor{red}[ignore][ignore] b \\\\ c & d \\end{array}')).toMatchSnapshot();
  });

  test('cellcolor outside of table', () => {
    expectTexError('\\cellcolor{red}')
      .toBe('Unsupported use of \\cellcolor');
  });

  test('cellcolor nested', () => {
    expectTexError('\\begin{array}{c} \\frac{\\cellcolor{red} a}{b} \\end{array}')
      .toBe('Unsupported use of \\cellcolor');
  });

  test('cellcolor with frame', () => {
    expect(tex2mml('\\begin{array}{|c|} \\cellcolor{red} a \\end{array}')).toMatchSnapshot();
  });

  test('cellcolor in pmatrix', () => {
    expect(tex2mml('\\pmatrix{ \\cellcolor{red} a }')).toMatchSnapshot();
  });

  test('cellcolor with color model', () => {
    expect(tex2mml('\\matrix{ \\cellcolor[rgb]{1,0,0} a }')).toMatchSnapshot();
  });

  test('color with no frame', () => {
    class myArrayItem extends ColorArrayItem {
      createMml() {
        this.setProperty('arrayPadding', null);
        return super.createMml();
      }
    }
    Configuration.create('nopadding', {
      [ConfigurationType.ITEMS]: {array: myArrayItem},
      [ConfigurationType.PRIORITY]: 20
    });
    setupTex(['base', 'colortbl', 'nopadding']);
    expect(tex2mml('\\matrix{ \\cellcolor[rgb]{1,0,0} a }')).toMatchSnapshot();
  });

});

/**********************************************************************************/

afterAll(() => getTokens('colortbl'));
