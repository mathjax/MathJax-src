import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/cancel/CancelConfiguration';

beforeEach(() => setupTex(['base', 'cancel']));

/**********************************************************************************/

describe('Cancel', () => {
  it('Cancel', () => {
    expect(tex2mml('\\cancel{x}')).toMatchSnapshot();
  });

  it('BCancel', () => {
    expect(tex2mml('\\bcancel{x}')).toMatchSnapshot();
  });

  it('XCancel', () => {
    expect(tex2mml('\\xcancel{x}')).toMatchSnapshot();
  });

  it('CancelTo', () => {
    expect(tex2mml('\\cancelto{x}{y}')).toMatchSnapshot();
  });

  it('Cancel Attr', () => {
    expect(tex2mml('\\cancel[color=red]{x}')).toMatchSnapshot();
  });

  it('Cancel Attrs', () => {
    expect(
      tex2mml('\\cancel[mathcolor=green,mathbackground=yellow]{x}')
    ).toMatchSnapshot();
  });

  it('Cancel Attr Not Allowed', () => {
    expect(tex2mml('\\cancel[nothing=green]{x}')).toMatchSnapshot();
  });

  it('CancelTo Attrs', () => {
    expect(
      tex2mml('\\cancelto[data-padding=5,data-arrowhead=15]{x}{y}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('cancel'));
