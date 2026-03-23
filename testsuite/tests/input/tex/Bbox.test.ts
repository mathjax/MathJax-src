import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/bbox/BboxConfiguration';

beforeEach(() => setupTex(['base', 'bbox']));

/**********************************************************************************/

describe('Bbox', () => {

  it('Bbox-Background', () => {
    expect(tex2mml('\\bbox[yellow]{a}')).toMatchSnapshot();
  });

  it('Bbox-Padding', () => {
    expect(tex2mml('\\bbox[5px]{a}')).toMatchSnapshot();
  });

  it('Bbox-Frame', () => {
    expect(tex2mml('\\bbox[border:5px solid red]{a}')).toMatchSnapshot();
  });

  it('Bbox-Background-Padding', () => {
    expect(tex2mml('\\bbox[yellow,5px]{a}')).toMatchSnapshot();
  });

  it('Bbox-Padding-Frame', () => {
    expect(tex2mml('\\bbox[5px,border:2px solid red]{a}')).toMatchSnapshot();
  });

  it('Bbox-Background-Padding-Frame', () => {
    expect(tex2mml('\\bbox[yellow,5px,border:2px solid red]{a}')).toMatchSnapshot();
  });

  it('Bbox-Background-Error', () => {
    expectTexError('\\bbox[yellow,green]{a}')
      .toBe('Background specified twice in \\bbox');
  });

  it('Bbox-Padding-Error', () => {
    expectTexError('\\bbox[5px,6px]{a}')
      .toBe('Padding specified twice in \\bbox');
  });

  it('Bbox-Frame-Error', () => {
    expectTexError('\\bbox[border:2px solid red,border:2px solid green]{a}')
      .toBe('Style specified twice in \\bbox');
  });

  it('Bbox-General-Error', () => {
    expectTexError('\\bbox[22-11=color]{a}')
      .toBe(`"22-11=color" doesn't look like a color, a padding dimension, or a style`);
  });

});

/**********************************************************************************/

afterAll(() => getTokens('bbox'));
