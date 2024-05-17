import { beforeAll, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeAll(() => setupTex(["base","html"]));

describe('Html', () => {
  it('Html Href Simple', () => toXmlMatch(tex2mml("\\href{https://mathjax.org}{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\href{https://mathjax.org}{a}\" display=\"block\">\n  <mi data-latex=\"\\href{https://mathjax.org}{a}\" href=\"https://mathjax.org\">a</mi>\n</math>"
  ));
  it('Html Href Complex', () => toXmlMatch(tex2mml("\\href{https://mathjax.org}{\\frac{a}{b}}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\href{https://mathjax.org}{\\frac{a}{b}}\" display=\"block\">\n  <mfrac data-latex=\"\\href{https://mathjax.org}{\\frac{a}{b}}\" href=\"https://mathjax.org\">\n    <mi data-latex=\"a\">a</mi>\n    <mi data-latex=\"b\">b</mi>\n  </mfrac>\n</math>"
  ));
  it('Html Href Inner', () => toXmlMatch(tex2mml("\\frac{a}{\\href{https://mathjax.org}{b}}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\frac{a}{\\href{https://mathjax.org}{b}}\" display=\"block\">\n  <mfrac data-latex=\"\\frac{a}{\\href{https://mathjax.org}{b}}\">\n    <mi data-latex=\"a\">a</mi>\n    <mi data-latex=\"\\href{https://mathjax.org}{b}\" href=\"https://mathjax.org\">b</mi>\n  </mfrac>\n</math>"
  ));
  it('Html Style Simple', () => toXmlMatch(tex2mml("\\style{color:green;background-color:blue}{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\style{color:green;background-color:blue}{a}\" display=\"block\">\n  <mi data-latex=\"\\style{color:green;background-color:blue}{a}\" style=\"color:green;background-color:blue\">a</mi>\n</math>"
  ));
  it('Html Style Complex', () => toXmlMatch(tex2mml("\\style{color:green;background-color:blue}{\\frac{a}{b}}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\style{color:green;background-color:blue}{\\frac{a}{b}}\" display=\"block\">\n  <mfrac data-latex=\"\\style{color:green;background-color:blue}{\\frac{a}{b}}\" style=\"color:green;background-color:blue\">\n    <mi data-latex=\"a\">a</mi>\n    <mi data-latex=\"b\">b</mi>\n  </mfrac>\n</math>"
  ));
  it('Html Style Inner', () => toXmlMatch(tex2mml("\\frac{a}{\\style{color:green;background-color:blue}{b}}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\frac{a}{\\style{color:green;background-color:blue}{b}}\" display=\"block\">\n  <mfrac data-latex=\"\\frac{a}{\\style{color:green;background-color:blue}{b}}\">\n    <mi data-latex=\"a\">a</mi>\n    <mi data-latex=\"\\style{color:green;background-color:blue}{b}\" style=\"color:green;background-color:blue\">b</mi>\n  </mfrac>\n</math>"
  ));
  it('Html Class Simple', () => toXmlMatch(tex2mml("\\class{myclass}{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\class{myclass}{a}\" display=\"block\">\n  <mi data-latex=\"\\class{myclass}{a}\" class=\"myclass\">a</mi>\n</math>"
  ));
  it('Html Class Medium', () => toXmlMatch(tex2mml("\\class{myclass}{\\frac{a}{b}}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\class{myclass}{\\frac{a}{b}}\" display=\"block\">\n  <mfrac data-latex=\"\\class{myclass}{\\frac{a}{b}}\" class=\"myclass\">\n    <mi data-latex=\"a\">a</mi>\n    <mi data-latex=\"b\">b</mi>\n  </mfrac>\n</math>"
  ));
  it('Html Class Complex', () => toXmlMatch(tex2mml("\\frac{a}{\\class{myclass}{b}}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\frac{a}{\\class{myclass}{b}}\" display=\"block\">\n  <mfrac data-latex=\"\\frac{a}{\\class{myclass}{b}}\">\n    <mi data-latex=\"a\">a</mi>\n    <mi data-latex=\"\\class{myclass}{b}\" class=\"myclass\">b</mi>\n  </mfrac>\n</math>"
  ));
  it('Html Id Inner', () => toXmlMatch(tex2mml("\\cssId{myid-0}{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cssId{myid-0}{a}\" display=\"block\">\n  <mi data-latex=\"\\cssId{myid-0}{a}\" id=\"myid-0\">a</mi>\n</math>"
  ));
  it('Html Id Simple', () => toXmlMatch(tex2mml("\\cssId{myid-1}{\\frac{a}{b}}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cssId{myid-1}{\\frac{a}{b}}\" display=\"block\">\n  <mfrac data-latex=\"\\cssId{myid-1}{\\frac{a}{b}}\" id=\"myid-1\">\n    <mi data-latex=\"a\">a</mi>\n    <mi data-latex=\"b\">b</mi>\n  </mfrac>\n</math>"
  ));
  it('Html Id Complex', () => toXmlMatch(tex2mml("\\frac{a}{\\cssId{myid-2}{b}}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\frac{a}{\\cssId{myid-2}{b}}\" display=\"block\">\n  <mfrac data-latex=\"\\frac{a}{\\cssId{myid-2}{b}}\">\n    <mi data-latex=\"a\">a</mi>\n    <mi data-latex=\"\\cssId{myid-2}{b}\" id=\"myid-2\">b</mi>\n  </mfrac>\n</math>"
  ));
})