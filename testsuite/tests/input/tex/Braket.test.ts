import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/braket/BraketConfiguration';

beforeEach(() => setupTex(['base', 'braket']));

/**********************************************************************************/
/**********************************************************************************/

describe('Braket', () => {

  /********************************************************************************/

  it('Braket-bra', () => {
    expect(tex2mml('\\bra{x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-bra-large', () => {
    expect(tex2mml('\\bra{\\frac{x}{y}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Bra', () => {
    expect(tex2mml('\\Bra{\\frac{x}{y}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-ket', () => {
    expect(tex2mml('\\ket{x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-ket-large', () => {
    expect(tex2mml('\\ket{\\frac{x}{y}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Ket', () => {
    expect(tex2mml('\\Ket{\\frac{x}{y}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-braket', () => {
    expect(tex2mml('\\braket{x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-braket-large', () => {
    expect(tex2mml('\\braket{\\frac{x}{y}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Braket', () => {
    expect(tex2mml('\\Braket{\\frac{x}{y}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-ketbra', () => {
    expect(tex2mml('\\ketbra{x}{y}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-ketbra-large', () => {
    expect(tex2mml('\\ketbra{\\frac{x}{y}}{z}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Ketbra', () => {
    expect(tex2mml('\\Ketbra{\\frac{x}{y}}{z}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Set-small', () => {
    expect(tex2mml('\\set{x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Set', () => {
    expect(tex2mml('\\Set{x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Set-large', () => {
    expect(tex2mml('\\Set{\\frac{x}{y}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Set-Bar', () => {
    expect(tex2mml('\\Set{x|\\frac{x}{y}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Set-over', () => {
    expect(tex2mml('\\Set{x\\over y}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-bar-small', () => {
    expect(tex2mml('\\braket{x|y}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-bar-large', () => {
    expect(tex2mml('\\braket{\\frac{x}{y}|z}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Bar', () => {
    expect(tex2mml('\\Braket{\\frac{x}{y}|z}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Bar1', () => {
    expect(tex2mml('\\Braket{\\frac{x}{y}||z||y}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Bar2', () => {
    expect(tex2mml('\\Braket{\\frac{x}{y}\\||z||y}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Bar3', () => {
    expect(tex2mml('\\Braket{\\frac{x}{y}|||z||y}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Bar4', () => {
    expect(tex2mml('\\Braket{\\frac{x}{y}|||z|||y}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Bar-Set', () => {
    expect(tex2mml('\\Set{\\frac{x}{y}||y||z}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Bar-Set2', () => {
    expect(tex2mml('\\Set{\\frac{x}{y}\\||y\\||z}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Space', () => {
    expect(tex2mml('\\braket {a|b}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-No-Braces-Simple', () => {
    expect(tex2mml('\\braket a|b')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-No-Braces-Complex', () => {
    expect(tex2mml('\\braket \\frac{a}{c}|b')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-Nested', () => {
    expect(tex2mml('\\braket {\\braket{a|b}c}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Braket-error', () => {
    expectTexError('\\braket')
      .toBe('Missing argument for \\braket');
  });

  /********************************************************************************/

  it('Braket-braces', () => {
    expectTexError('\\braket{')
      .toBe('Missing close brace');
  });

  /********************************************************************************/

  it('Braket-braces', () => {
    expectTexError('\\braket}')
      .toBe('Extra close brace or missing open brace');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('braket'));
