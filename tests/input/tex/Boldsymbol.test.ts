import { beforeAll, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeAll(() => setupTex(["base","boldsymbol"]));

describe('Boldsymbol', () => {
  it('Boldsymbol Single', () => toXmlMatch(tex2mml("\\boldsymbol{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\boldsymbol{a}\" display=\"block\">\n  <mi data-latex=\"\\boldsymbol{a}\" mathvariant=\"bold-italic\">a</mi>\n</math>"
  ));
  it('Boldsymbol Context', () => toXmlMatch(tex2mml("b\\boldsymbol{a}c"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"b\\boldsymbol{a}c\" display=\"block\">\n  <mi data-latex=\"b\">b</mi>\n  <mi data-latex=\"\\boldsymbol{a}\" mathvariant=\"bold-italic\">a</mi>\n  <mi data-latex=\"c\">c</mi>\n</math>"
  ));
  it('Boldsymbol Operator', () => toXmlMatch(tex2mml("\\boldsymbol{a+b}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\boldsymbol{a+b}\" display=\"block\">\n  <mi data-latex=\"a\" mathvariant=\"bold-italic\">a</mi>\n  <mo data-latex=\"+\" mathvariant=\"bold\">+</mo>\n  <mi data-latex=\"\\boldsymbol{a+b}\" mathvariant=\"bold-italic\">b</mi>\n</math>"
  ));
  it('Boldsymbol Fraction', () => toXmlMatch(tex2mml("\\boldsymbol{\\frac{a}{b}}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\boldsymbol{\\frac{a}{b}}\" display=\"block\">\n  <mfrac data-latex=\"\\boldsymbol{\\frac{a}{b}}\">\n    <mi data-latex=\"a\" mathvariant=\"bold-italic\">a</mi>\n    <mi data-latex=\"b\" mathvariant=\"bold-italic\">b</mi>\n  </mfrac>\n</math>"
  ));
  it('Boldsymbol Recursive', () => toXmlMatch(tex2mml("\\boldsymbol{a+b\\mbox{ w $c+\\boldsymbol{d+e}$ w } q-} -q"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\boldsymbol{a+b\\mbox{ w $c+\\boldsymbol{d+e}$ w } q-} -q\" display=\"block\">\n  <mi data-latex=\"a\" mathvariant=\"bold-italic\">a</mi>\n  <mo data-latex=\"+\" mathvariant=\"bold\">+</mo>\n  <mi data-latex=\"b\" mathvariant=\"bold-italic\">b</mi>\n  <mstyle displaystyle=\"false\" scriptlevel=\"0\" data-latex=\"\\mbox{ w $c+\\boldsymbol{d+e}$ w }\">\n    <mtext>&#xA0;w&#xA0;</mtext>\n    <mrow data-mjx-texclass=\"ORD\">\n      <mi data-latex=\"c\">c</mi>\n      <mo data-latex=\"+\">+</mo>\n      <mi data-latex=\"d\" mathvariant=\"bold-italic\">d</mi>\n      <mo data-latex=\"+\" mathvariant=\"bold\">+</mo>\n      <mi data-latex=\"\\boldsymbol{d+e}\" mathvariant=\"bold-italic\">e</mi>\n    </mrow>\n    <mtext>&#xA0;w&#xA0;</mtext>\n  </mstyle>\n  <mi data-latex=\"q\" mathvariant=\"bold-italic\">q</mi>\n  <mo data-latex=\"\\boldsymbol{a+b\\mbox{ w $c+\\boldsymbol{d+e}$ w } q-}\" mathvariant=\"bold\">&#x2212;</mo>\n  <mo data-latex=\"-\">&#x2212;</mo>\n  <mi data-latex=\"q\">q</mi>\n</math>"
  ));
})
