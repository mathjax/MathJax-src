import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  getTokens,
  setupTex,
  setupTexRender,
  tex2mml,
  render2mml,
  expectTexError
} from '#helpers';
import '#js/input/tex/texhtml/TexHtmlConfiguration';

/**********************************************************************************/
/**********************************************************************************/

describe('Texhtml', () => {

  beforeEach(() => setupTexRender(['base', 'texhtml'], {allowTexHTML: true}));

  /********************************************************************************/

  test('Html', () => {
    expect(render2mml('x + <tex-html><b>bold</b></tex-html> + y')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Html multiple', () => {
    expect(render2mml('x + <tex-html><b>bold</b></tex-html> + <tex-html><i>italic</i></tex-html>y')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Html nested', () => {
    expect(render2mml('x + <tex-html><b>bold</b> and <tex-html>html</tex-html></tex-html> + y')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Html empty tag', () => {
    expect(render2mml('x + <tex-html></tex-html> + y')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Html no tag', () => {
    expect(render2mml('x < y')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Texhtml error', () => {

  beforeEach(() => setupTex(['base', 'texhtml'], {allowTexHTML: true}));

  /********************************************************************************/

  test('Html missing comment tag', () => {
    expectTexError('x + <tex-html n="1"><b>bold</b></tex-html> + y')
      .toBe('Could not find <!1></tex-html> for <tex-html n="1">');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Texhtml not enabled', () => {

  beforeEach(() => setupTex(['base', 'texhtml'], {allowTexHTML: false}));

  /********************************************************************************/

  test('Html not allowed', () => {
    expect(tex2mml('x + <tex-html><b>a</b></tex-html> + y')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('texhtml'));
