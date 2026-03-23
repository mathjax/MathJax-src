import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, setupComponents, tex2mml } from '#helpers';
import '#js/input/tex/bbm/BbmConfiguration';

/**********************************************************************************/
/**********************************************************************************/

describe('Bbm', () => {

  beforeEach(() => setupTex(['base', 'bbm']));

  /********************************************************************************/

  test('mathbbm', () => {
    expect(tex2mml('\\mathbbm{Aa}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('mathbbmss', () => {
    expect(tex2mml('\\mathbbmss{Aa}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('mathbbmtt', () => {
    expect(tex2mml('\\mathbbmtt{Aa}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('mathbbm mathversion', () => {
    expect(tex2mml('\\mathversion{bold}\\mathbbm{Aa}\\mathversion{normal}\\mathbbm{Aa}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('mathbbmss mathversion', () => {
    expect(tex2mml('\\mathversion{bold}\\mathbbmss{Aa}\\mathversion{normal}\\mathbbmss{Aa}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('mathbbmtt mathversion', () => {
    expect(tex2mml('\\mathversion{bold}\\mathbbmtt{Aa}\\mathversion{normal}\\mathbbmtt{Aa}')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Bbm', () => {

  beforeEach(() => setupTex(['base', 'bbm'], {bbm: {bold: true}}));

  /********************************************************************************/

  test('mathbbm', () => {
    expect(tex2mml('\\mathbbm{Aa}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('mathbbmss', () => {
    expect(tex2mml('\\mathbbmss{Aa}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('mathbbmtt', () => {
    expect(tex2mml('\\mathbbmtt{Aa}')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

declare const MathJax: any;

setupComponents({loader: {load: ['input/tex-base', 'output/chtml']}});

describe('Bbm', () => {

  test('bbm with no output', async() => {
    await expect(MathJax.loader.load('[tex]/bbm').then(() => true)).resolves.toBe(true);
  });
});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('bbm'));
