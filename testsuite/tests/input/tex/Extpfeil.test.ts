import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/extpfeil/ExtpfeilConfiguration';

beforeEach(() => setupTex(['base', 'extpfeil']));

/**********************************************************************************/

describe('Extpfeil', () => {

  it('Xtwoheadrightarrow', () => {
    expect(tex2mml('\\xtwoheadrightarrow{abcxyz}')).toMatchSnapshot();
  });

  it('Xtwoheadleftarrow', () => {
    expect(tex2mml('\\xtwoheadleftarrow{abcxyz}')).toMatchSnapshot();
  });

  it('Xmapsto', () => {
    expect(tex2mml('\\xmapsto{abcxyz}')).toMatchSnapshot();
  });

  it('Xlongequal', () => {
    expect(tex2mml('\\xlongequal{abcxyz}')).toMatchSnapshot();
  });

  it('Xtofrom', () => {
    expect(tex2mml('\\xtofrom{abcxyz}')).toMatchSnapshot();
  });

  it('Newextarrow', () => {
    expect(tex2mml('\\Newextarrow{\\ab}{10,20}{8672}\\ab{xyz}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Extpfeil Errors', () => {

  it('NewextarrowArg1', () => {
    expectTexError('\\Newextarrow{ab}{10,20}{8672}\\ab{xyz}')
      .toBe('First argument to \\Newextarrow must be a control sequence name');
  });

  it('NewextarrowArg2 One', () => {
    expectTexError('\\Newextarrow{\\ab}{10}{8672}\\ab{xyz}')
      .toBe('Second argument to \\Newextarrow must be two integers separated by a comma');
  });

  it('NewextarrowArg2 Two', () => {
    expectTexError('\\Newextarrow{\\ab}{10 20}{8672}\\ab{xyz}')
      .toBe('Second argument to \\Newextarrow must be two integers separated by a comma');
  });

  it('NewextarrowArg2 Three', () => {
    expectTexError('\\Newextarrow{\\ab}{aa}{8672}\\ab{xyz}')
      .toBe('Second argument to \\Newextarrow must be two integers separated by a comma');
  });

  it('NewextarrowArg3', () => {
    expectTexError('\\Newextarrow{\\ab}{10,20}{AG}\\ab{xyz}')
      .toBe('Third argument to \\Newextarrow must be a unicode character number');
  });

});

/**********************************************************************************/

afterAll(() => getTokens('extpfeil'));
