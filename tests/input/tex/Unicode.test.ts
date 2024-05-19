import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeEach(() => setupTex(['base', 'unicode']));

describe('Unicode', () => {
  it('Unicode Dec', () =>
    toXmlMatch(
      tex2mml('\\unicode{8922}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{8922}" display="block">\n  <mtext data-latex="\\unicode{8922}">&#x22DA;</mtext>\n</math>'
    ));
  it('Unicode Hex', () =>
    toXmlMatch(
      tex2mml('\\unicode{0x22DA}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{0x22DA}" display="block">\n  <mtext data-latex="\\unicode{0x22DA}">&#x22DA;</mtext>\n</math>'
    ));
  it('Unicode Dec A', () =>
    toXmlMatch(
      tex2mml('\\unicode{65}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{65}" display="block">\n  <mtext data-latex="\\unicode{65}">A</mtext>\n</math>'
    ));
  it('Unicode Hex A', () =>
    toXmlMatch(
      tex2mml('\\unicode{x41}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{x41}" display="block">\n  <mtext data-latex="\\unicode{x41}">A</mtext>\n</math>'
    ));
  it.skip('Unicode Scale', () =>
    toXmlMatch(tex2mml('\\unicode[.55,0.05]{x22D6}'), ''));
  it('Unicode Scale Font', () =>
    toXmlMatch(
      tex2mml('\\unicode[.55,0.05][Geramond]{x22D6}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode[.55,0.05][Geramond]{x22D6}" display="block">\n  <mtext fontfamily="Geramond" data-latex="\\unicode[.55,0.05][Geramond]{x22D6}">&#x22D6;</mtext>\n</math>'
    ));
  it('Unicode Font', () =>
    toXmlMatch(
      tex2mml('\\unicode[Garamond]{x22D6}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode[Garamond]{x22D6}" display="block">\n  <mtext fontfamily="Garamond" data-latex="\\unicode[Garamond]{x22D6}">&#x22D6;</mtext>\n</math>'
    ));
  it('Unicode Combined', () =>
    toXmlMatch(
      tex2mml('\\mbox{A}\\unicode{65}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mbox{A}\\unicode{65}{B}" display="block">\n  <mstyle displaystyle="false" scriptlevel="0" data-latex="\\mbox{A}">\n    <mtext>A</mtext>\n  </mstyle>\n  <mtext data-latex="\\unicode{65}">A</mtext>\n  <mrow data-mjx-texclass="ORD" data-latex="{B}">\n    <mi data-latex="B">B</mi>\n  </mrow>\n</math>'
    ));
  it('Unicode Surrogate Hex', () =>
    toXmlMatch(
      tex2mml('\\unicode{x1D5A0}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{x1D5A0}" display="block">\n  <mtext data-latex="\\unicode{x1D5A0}">&#x1D5A0;</mtext>\n</math>'
    ));
  it('Unicode Surrogate Dec', () =>
    toXmlMatch(
      tex2mml('\\unicode{120224}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{120224}" display="block">\n  <mtext data-latex="\\unicode{120224}">&#x1D5A0;</mtext>\n</math>'
    ));
  it('Unicode Blackboard', () =>
    toXmlMatch(
      tex2mml('\\unicode{x1D538}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{x1D538}" display="block">\n  <mtext data-latex="\\unicode{x1D538}">&#x1D538;</mtext>\n</math>'
    ));
  it('Unicode Blackboard Geramond', () =>
    toXmlMatch(
      tex2mml('\\unicode{x1D538}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{x1D538}" display="block">\n  <mtext data-latex="\\unicode{x1D538}">&#x1D538;</mtext>\n</math>'
    ));
});
