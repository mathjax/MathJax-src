import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/enclose/EncloseConfiguration';

beforeEach(() => setupTex(['base', 'enclose']));

/**********************************************************************************/

describe('Enclose', () => {
  it('Enclose 1', () => {
    expect(tex2mml('\\enclose{updiagonalstrike}{x}')).toMatchSnapshot();
  });

  it('Enclose 2', () => {
    expect(tex2mml('\\enclose{circle}{x}')).toMatchSnapshot();
  });

  it('Enclose 3', () => {
    expect(tex2mml('\\enclose{horizontalstrike}{x}')).toMatchSnapshot();
  });

  it('Enclose Attr 2', () => {
    expect(
      tex2mml('\\enclose{updiagonalarrow}[mathbackground=red]{x}')
    ).toMatchSnapshot();
  });

  it('Enclose Attr 1', () => {
    expect(
      tex2mml('\\enclose{horizontalstrike}[data-thickness=5]{x}')
    ).toMatchSnapshot();
  });

  it('Enclose Attrs', () => {
    expect(
      tex2mml('\\enclose{circle}[data-thickness=10,data-padding=5]{x}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('enclose'));
