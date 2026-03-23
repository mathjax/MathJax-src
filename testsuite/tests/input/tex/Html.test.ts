import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/html/HtmlConfiguration';

beforeEach(() => setupTex(['base', 'html']));

/**********************************************************************************/
/**********************************************************************************/

describe('Html', () => {

  /********************************************************************************/

  it('Html Href Simple', () => {
    expect(tex2mml('\\href{https://mathjax.org}{a}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Href Complex', () => {
    expect(tex2mml('\\href{https://mathjax.org}{\\frac{a}{b}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Href Inner', () => {
    expect(tex2mml('\\frac{a}{\\href{https://mathjax.org}{b}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Style Simple', () => {
    expect(tex2mml('\\style{color:green;background-color:blue}{a}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Style Complex', () => {
    expect(tex2mml('\\style{color:green;background-color:blue}{\\frac{a}{b}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Style Inner', () => {
    expect(tex2mml('\\frac{a}{\\style{color:green;background-color:blue}{b}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Style Nested', () => {
    expect(tex2mml('\\style{color:red}{\\style{background:blue}{x}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Style Row', () => {
    expect(tex2mml('\\style{color:red}{x+y}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Class Simple', () => {
    expect(tex2mml('\\class{myclass}{a}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Class Medium', () => {
    expect(tex2mml('\\class{myclass}{\\frac{a}{b}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Class Complex', () => {
    expect(tex2mml('\\frac{a}{\\class{myclass}{b}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Class nested', () => {
    expect(tex2mml('\\class{class1}{\\class{class2}{x}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Id Inner', () => {
    expect(tex2mml('\\cssId{myid-0}{a}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Id Simple', () => {
    expect(tex2mml('\\cssId{myid-1}{\\frac{a}{b}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Id Complex', () => {
    expect(tex2mml('\\frac{a}{\\cssId{myid-2}{b}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Data', () => {
    expect(tex2mml('\\data{test1=fu, test2=bar}{x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  it('Html Data Invalid', () => {
    expectTexError('\\data{a/b=bar}{x}').toBe('Invalid HTML attribute: data-a/b');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('html'));
