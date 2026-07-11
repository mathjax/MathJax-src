import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/action/ActionConfiguration';

beforeEach(() => setupTex(['base', 'action']));

/**********************************************************************************/

describe('Action', () => {
  it('TextTip', () => {
    expect(tex2mml('\\texttip{A}{B}')).toMatchSnapshot();
  });

  it('MathTip', () => {
    expect(tex2mml('\\mathtip{A}{B}')).toMatchSnapshot();
  });

  it('Toggle', () => {
    expect(tex2mml('\\toggle A B C \\endtoggle')).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('action'));
