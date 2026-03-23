import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/gensymb/GensymbConfiguration';

beforeEach(() => setupTex(['base', 'gensymb']));

/**********************************************************************************/

describe('Gensymb', () => {

  test('ohm', () => {
    expect(tex2mml('\\ohm')).toMatchSnapshot();
  });

  test('degree', () => {
    expect(tex2mml('\\degree')).toMatchSnapshot();
  });

  test('celcius', () => {
    expect(tex2mml('\\celsius')).toMatchSnapshot();
  });

  test('perthousand', () => {
    expect(tex2mml('\\perthousand')).toMatchSnapshot();
  });

  test('micro', () => {
    expect(tex2mml('\\micro')).toMatchSnapshot();
  });

});

/**********************************************************************************/

afterAll(() => getTokens('gensymb'));
