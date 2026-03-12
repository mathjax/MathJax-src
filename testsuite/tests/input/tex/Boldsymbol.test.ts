import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/boldsymbol/BoldsymbolConfiguration';

beforeEach(() => setupTex(['base', 'boldsymbol']));

/**********************************************************************************/
/**********************************************************************************/

describe('Boldsymbol', () => {

  /********************************************************************************/

  it('Boldsymbol Single', () => {
    expect(tex2mml('\\boldsymbol{a}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Boldsymbol Context', () => {
    expect(tex2mml('b\\boldsymbol{a}c')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Boldsymbol Operator', () => {
    expect(tex2mml('\\boldsymbol{a+b}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Boldsymbol Fraction', () => {
    expect(tex2mml('\\boldsymbol{\\frac{a}{b}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Boldsymbol Recursive', () => {
    expect(tex2mml('\\boldsymbol{a+b\\mbox{ w $c+\\boldsymbol{d+e}$ w } q-} -q')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Boldsymbol Variant', () => {
    expect(tex2mml('\\boldsymbol{A\\mathbb{B}C}')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('boldsymbol'));
