import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/dsfont/DsfontConfiguration';

/**********************************************************************************/

describe('Dsfont', () => {
  beforeEach(() => setupTex(['base', 'dsfont']));

  test('mathds', () => {
    expect(tex2mml('\\mathds{Aa}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Dsfont sans', () => {
  beforeEach(() => setupTex(['base', 'dsfont'], { dsfont: { sans: true } }));

  test('mathds', () => {
    expect(tex2mml('\\mathds{Aa}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('dsfont'));
