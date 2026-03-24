import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/centernot/CenternotConfiguration';

beforeEach(() => setupTex(['base', 'centernot']));

/**********************************************************************************/

describe('Centernot', () => {

  test('Centernot', () => {
    expect(tex2mml('\\centernot{\\longrightarrow}')).toMatchSnapshot();
  });

  test('Centerover', () => {
    expect(tex2mml('\\centerOver{\\bigcirc}{1}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

afterAll(() => getTokens('centernot'));
