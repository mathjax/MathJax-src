import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/colorv2/ColorV2Configuration';

beforeEach(() => setupTex(['base', 'colorv2']));

/**********************************************************************************/
/**********************************************************************************/

describe('ColorV2', () => {

  /********************************************************************************/

  it('Color Open', () => {
    expect(tex2mml('\\color{red}{ab}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Color Enclosed', () => {
    expect(tex2mml('\\color{red}ab')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Color Frac', () => {
    expect(tex2mml('\\frac{{\\cal \\color{red}{X}}}{\\color{blue}{\\sf y}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Color Nested', () => {
    expect(tex2mml('\\color{red}{a\\color{blue}{b}c}')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('colorv2'));
