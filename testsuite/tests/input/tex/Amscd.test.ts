import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/amscd/AmsCdConfiguration';

beforeEach(() => setupTex(['base', 'amscd']));

/**********************************************************************************/

describe('AmsCD', () => {
  it('AmsCD-1', () => {
    expect(
      tex2mml('\\begin{CD}A @>a>> B\\\\@VVbV @VVcV\\\\C @>d>> D\\end{CD}')
    ).toMatchSnapshot();
  });

  it('AmsCD-2', () => {
    expect(
      tex2mml('\\begin{CD}A @<<< B @>>> C\\\\@. @| @AAA\\\\@. D @= E\\end{CD}')
    ).toMatchSnapshot();
  });

  it('AmsCD-3', () => {
    expect(
      tex2mml('\\begin{CD}A @>a>b> B\\\\@VlVrV @AlArA\\\\C @<a<b< D\\end{CD}')
    ).toMatchSnapshot();
  });

  it('AmsCD-4', () => {
    expect(
      tex2mml(
        '\\begin{CD}A @>>> B@>\\text{very long label}>>C\\\\@VVV @VVV @VVV\\\\D @>>> E@>>> F\\end{CD}'
      )
    ).toMatchSnapshot();
  });

  it('AmsCD-5', () => {
    expect(
      tex2mml(
        '\\begin{CD}A @>>> B @>{\\text{very long label}}>> C \\\\@VVV @VVV @VVV \\\\D @>>> E @>{\\phantom{\\text{very long label}}}>> F\\end{CD}'
      )
    ).toMatchSnapshot();
  });

  it('AmsCD-6', () => {
    expect(
      tex2mml(
        '\\begin{CD}A @>>> B @>{\\text{very long label}}>> C \\\\@VVV @VVV @VVV \\\\D @>>> E @>{\\rlap{\\scriptstyle{\\ \\ \\ \\text{shorter}}}\\phantom{\\text{very long label}}}>> F\\end{CD}'
      )
    ).toMatchSnapshot();
  });

  it('AmsCD-width', () => {
    expect(
      tex2mml(
        '\\minCDarrowwidth{5cm}\\begin{CD}A @>a>> B\\\\@VVbV @VVcV\\\\C @>d>> D\\end{CD}'
      )
    ).toMatchSnapshot();
  });

  it('AmsCD-height', () => {
    expect(
      tex2mml(
        '\\minCDarrowheight{4cm}\\begin{CD}A @>a>> B\\\\@VVbV @VVcV\\\\C @>d>> D\\end{CD}'
      )
    ).toMatchSnapshot();
  });

  it('AmsCD-both', () => {
    expect(
      tex2mml(
        '\\minCDarrowheight{4cm}\\minCDarrowwidth{5cm}\\begin{CD}A @>a>> B\\\\@VVbV @VVcV\\\\C @>d>> D\\end{CD}'
      )
    ).toMatchSnapshot();
  });

  it('Spaces', () => {
    expect(tex2mml('\\begin{CD}A @ > x > > B \\end{CD}')).toMatchSnapshot();
  });

  it('Suspicious Return', () => {
    expect(tex2mml('\\begin{CD}A @Ra>> BaD\\end{CD}')).toMatchSnapshot();
  });

  it('Entry with prime (#3373)', () => {
    expect(tex2mml(`\\begin{CD}A' @>>> B\\end{CD}`)).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('AmsCD Options', () => {
  beforeEach(() =>
    setupTex(['base', 'amscd'], { amscd: { hideHorizontalLabels: true } })
  );

  it('Hide Horizontal Labels', () => {
    expect(
      tex2mml('\\begin{CD}A @>a>> B\\\\@VVbV @VVcV\\\\C @>d>> D\\end{CD}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('amscd'));
