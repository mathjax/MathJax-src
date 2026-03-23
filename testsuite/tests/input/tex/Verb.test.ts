import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/verb/VerbConfiguration';

beforeEach(() => setupTex(['base', 'verb']));

/**********************************************************************************/

describe('Verb', () => {
  it('Verb Plus ', () => {
    expect(tex2mml('\\verb+{a}+')).toMatchSnapshot();
  });

  it('Verb Plus Empty', () => {
    expect(tex2mml('\\verb ++')).toMatchSnapshot();
  });

  it('Verb Plus Space', () => {
    expect(tex2mml('\\verb + +')).toMatchSnapshot();
  });

  it('Verb Minus', () => {
    expect(tex2mml('\\verb -{a}-')).toMatchSnapshot();
  });

  it('Verb Minus Double', () => {
    expect(tex2mml('\\verb -{a--')).toMatchSnapshot();
  });

  it('Verb Error', () => {
    expectTexError('\\verb{a}').toBe("Can't find closing delimiter for \\verb");
  });

  it('Verb Missing Arg', () => {
    expectTexError('\\verb').toBe('Missing argument for \\verb');
  });
});

/**********************************************************************************/

afterAll(() => getTokens('verb'));
