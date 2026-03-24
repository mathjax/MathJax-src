import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/units/UnitsConfiguration';

/**********************************************************************************/

describe('Units', () => {

  beforeEach(() => setupTex(['base', 'units']));

  test('Unit', () => {
    expect(tex2mml('\\units{kg}')).toMatchSnapshot();
  });

  test('Unit squared', () => {
    expect(tex2mml('\\units{m^2}')).toMatchSnapshot();
  });

  test('Unit with value', () => {
    expect(tex2mml('\\units[2.5]{kg}')).toMatchSnapshot();
  });

  test('Unitfrac', () => {
    expect(tex2mml('\\unitfrac{m}{s}')).toMatchSnapshot();
  });

  test('Unitfrac with value', () => {
    expect(tex2mml('\\unitfrac[9.8]{m}{s^2}')).toMatchSnapshot();
  });

  test('Nicefrac', () => {
    expect(tex2mml('\\nicefrac{1}{2}')).toMatchSnapshot();
  });

  test('Nicefrac with font', () => {
    expect(tex2mml('\\nicefrac[\\mathsf]{1}{2}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Units loose ugly', () => {

  beforeEach(() => setupTex(['base', 'units'], {units: {loose: true, ugly: true}}));

  test('Unit with value', () => {
    expect(tex2mml('\\units[5]{kg}')).toMatchSnapshot();
  });

  test('Unitfrac with value', () => {
    expect(tex2mml('\\unitfrac[3]{ft}{min}')).toMatchSnapshot();
  });

  test('nicefrac', () => {
    expect(tex2mml('\\nicefrac{1}{2}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

afterAll(() => getTokens('units'));
