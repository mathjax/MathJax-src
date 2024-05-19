import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeEach(() => setupTex(['base', 'physics']));

describe('Physics1_0', () => {
  it('Quantities_Quantities_0', () =>
    toXmlMatch(
      tex2mml('\\quantity'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\quantity">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mrow></mrow>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Quantities_1', () =>
    toXmlMatch(
      tex2mml('\\quantity a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity a" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\quantity">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mrow></mrow>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n  <mi data-latex="a">a</mi>\n</math>'
    ));
  it('Quantities_Quantities_2', () =>
    toXmlMatch(
      tex2mml('\\quantity\\bigg a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\bigg a" display="block">\n  <merror data-mjx-error="Missing or unrecognized delimiter for \\bigg">\n    <mtext>Missing or unrecognized delimiter for \\bigg</mtext>\n  </merror>\n</math>'
    ));
  it('Quantities_Quantities_3', () =>
    toXmlMatch(
      tex2mml('\\quantity[c]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity[c]" display="block">\n  <mrow data-latex="\\quantity[c]">\n    <mo data-mjx-texclass="OPEN">[</mo>\n    <mi data-latex="c">c</mi>\n    <mo data-mjx-texclass="CLOSE">]</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Quantities_4', () =>
    toXmlMatch(
      tex2mml('\\quantity\\sin'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\sin" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\quantity">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mrow></mrow>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n  <mi data-latex="\\sin">sin</mi>\n</math>'
    ));
  it('Quantities_Quantities_5', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg ab'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg ab" display="block">\n  <merror data-mjx-error="Missing or unrecognized delimiter for \\Bigg">\n    <mtext>Missing or unrecognized delimiter for \\Bigg</mtext>\n  </merror>\n</math>'
    ));
  it('Quantities_Quantities_6', () =>
    toXmlMatch(
      tex2mml('\\quantity\\bigg\\sin'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\bigg\\sin" display="block">\n  <merror data-mjx-error="Missing or unrecognized delimiter for \\bigg">\n    <mtext>Missing or unrecognized delimiter for \\bigg</mtext>\n  </merror>\n</math>'
    ));
  it('Quantities_Quantities_7', () =>
    toXmlMatch(
      tex2mml('\\qty(a)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty(a)" display="block">\n  <mrow data-latex="\\qty(a)">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="a">a</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Quantities_8', () =>
    toXmlMatch(
      tex2mml('\\qty(\\frac{a}{\\frac{c}{b}})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty(\\frac{a}{\\frac{c}{b}})" display="block">\n  <mrow data-latex="\\qty(\\frac{a}{\\frac{c}{b}})">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{a}{\\frac{c}{b}}">\n      <mi data-latex="a">a</mi>\n      <mfrac data-latex="\\frac{c}{b}">\n        <mi data-latex="c">c</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Quantities_9', () =>
    toXmlMatch(
      tex2mml('\\qty[\\frac{a}{\\frac{c}{b}}]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty[\\frac{a}{\\frac{c}{b}}]" display="block">\n  <mrow data-latex="\\qty[\\frac{a}{\\frac{c}{b}}]">\n    <mo data-mjx-texclass="OPEN">[</mo>\n    <mfrac data-latex="\\frac{a}{\\frac{c}{b}}">\n      <mi data-latex="a">a</mi>\n      <mfrac data-latex="\\frac{c}{b}">\n        <mi data-latex="c">c</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">]</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Quantities_10', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg{a}" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">\n    <mo minsize="2.470em" maxsize="2.470em">{</mo>\n  </mrow>\n  <mi data-latex="a">a</mi>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\qty\\Bigg{a}">\n    <mo minsize="2.470em" maxsize="2.470em">}</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics1_1', () => {
  it('Quantities_Empty_0', () =>
    toXmlMatch(
      tex2mml('\\qty\\big{}[]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\big{}[]" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\bigl\\{">\n    <mo minsize="1.2em" maxsize="1.2em">{</mo>\n  </mrow>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\qty\\big{}">\n    <mo minsize="1.2em" maxsize="1.2em">}</mo>\n  </mrow>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mo data-latex="]" stretchy="false">]</mo>\n</math>'
    ));
  it('Quantities_Empty_1', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg{}[]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg{}[]" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">\n    <mo minsize="2.470em" maxsize="2.470em">{</mo>\n  </mrow>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\qty\\Bigg{}">\n    <mo minsize="2.470em" maxsize="2.470em">}</mo>\n  </mrow>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mo data-latex="]" stretchy="false">]</mo>\n</math>'
    ));
  it('Quantities_Empty_2', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg{}\\Bigg[]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg{}\\Bigg[]" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">\n    <mo minsize="2.470em" maxsize="2.470em">{</mo>\n  </mrow>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\qty\\Bigg{}">\n    <mo minsize="2.470em" maxsize="2.470em">}</mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="\\Bigg[">\n    <mo minsize="2.470em" maxsize="2.470em">[</mo>\n  </mrow>\n  <mo data-latex="]" stretchy="false">]</mo>\n</math>'
    ));
  it('Quantities_Empty_3', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg{}\\qty\\Bigg[]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg{}\\qty\\Bigg[]" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">\n    <mo minsize="2.470em" maxsize="2.470em">{</mo>\n  </mrow>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\qty\\Bigg{}">\n    <mo minsize="2.470em" maxsize="2.470em">}</mo>\n  </mrow>\n  <mrow data-latex="]">\n    <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl[">\n      <mo minsize="2.470em" maxsize="2.470em">[</mo>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE" data-latex="\\Biggr]">\n      <mo minsize="2.470em" maxsize="2.470em">]</mo>\n    </mrow>\n  </mrow>\n</math>'
    ));
  it('Quantities_Empty_4', () =>
    toXmlMatch(
      tex2mml('\\Bigg[]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Bigg[]" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Bigg[">\n    <mo minsize="2.470em" maxsize="2.470em">[</mo>\n  </mrow>\n  <mo data-latex="]" stretchy="false">]</mo>\n</math>'
    ));
  it('Quantities_Empty_5', () =>
    toXmlMatch(
      tex2mml('\\Bigg[ \\times \\Bigg]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Bigg[ \\times \\Bigg]" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Bigg[">\n    <mo minsize="2.470em" maxsize="2.470em">[</mo>\n  </mrow>\n  <mo data-latex="\\times">&#xD7;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="\\Bigg]">\n    <mo minsize="2.470em" maxsize="2.470em">]</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Empty_6', () =>
    toXmlMatch(
      tex2mml('\\Biggl[ \\times \\Biggr]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Biggl[ \\times \\Biggr]" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl[">\n    <mo minsize="2.470em" maxsize="2.470em">[</mo>\n  </mrow>\n  <mo data-latex="\\times">&#xD7;</mo>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\Biggr]">\n    <mo minsize="2.470em" maxsize="2.470em">]</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Empty_7', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg[\\times]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg[\\times]" display="block">\n  <mrow data-latex="\\qty\\Bigg[\\times]">\n    <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl[">\n      <mo minsize="2.470em" maxsize="2.470em">[</mo>\n    </mrow>\n    <mo data-latex="\\times">&#xD7;</mo>\n    <mrow data-mjx-texclass="CLOSE" data-latex="\\Biggr]">\n      <mo minsize="2.470em" maxsize="2.470em">]</mo>\n    </mrow>\n  </mrow>\n</math>'
    ));
  it('Quantities_Empty_8', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg{\\times}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg{\\times}" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">\n    <mo minsize="2.470em" maxsize="2.470em">{</mo>\n  </mrow>\n  <mo data-latex="\\times">&#xD7;</mo>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\qty\\Bigg{\\times}">\n    <mo minsize="2.470em" maxsize="2.470em">}</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Empty_9', () =>
    toXmlMatch(
      tex2mml('\\qty(\\frac{a}{b})\\langle\\rangle'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty(\\frac{a}{b})\\langle\\rangle" display="block">\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>\n</math>'
    ));
  it('Quantities_Empty_10', () =>
    toXmlMatch(
      tex2mml('\\qty<\\frac{a}{b}>\\langle\\rangle'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty&lt;\\frac{a}{b}&gt;\\langle\\rangle" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\qty">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mrow></mrow>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n  <mo data-latex="&lt;">&lt;</mo>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mo data-latex="&gt;">&gt;</mo>\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>\n</math>'
    ));
});

describe('Physics1_2', () => {
  it('Quantities_Big_0', () =>
    toXmlMatch(
      tex2mml('\\quantity\\big(\\frac{a}{b})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\big(\\frac{a}{b})" display="block">\n  <mrow data-latex="\\quantity\\big(\\frac{a}{b})">\n    <mrow data-mjx-texclass="OPEN" data-latex="\\bigl(">\n      <mo minsize="1.2em" maxsize="1.2em">(</mo>\n    </mrow>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr)">\n      <mo minsize="1.2em" maxsize="1.2em">)</mo>\n    </mrow>\n  </mrow>\n</math>'
    ));
  it('Quantities_Big_1', () =>
    toXmlMatch(
      tex2mml('\\quantity\\bigg(\\frac{a}{b})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\bigg(\\frac{a}{b})" display="block">\n  <mrow data-latex="\\quantity\\bigg(\\frac{a}{b})">\n    <mrow data-mjx-texclass="OPEN" data-latex="\\biggl(">\n      <mo minsize="2.047em" maxsize="2.047em">(</mo>\n    </mrow>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr)">\n      <mo minsize="2.047em" maxsize="2.047em">)</mo>\n    </mrow>\n  </mrow>\n</math>'
    ));
  it('Quantities_Big_2', () =>
    toXmlMatch(
      tex2mml('\\quantity\\Big(\\frac{a}{b})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\Big(\\frac{a}{b})" display="block">\n  <mrow data-latex="\\quantity\\Big(\\frac{a}{b})">\n    <mrow data-mjx-texclass="OPEN" data-latex="\\Bigl(">\n      <mo minsize="1.623em" maxsize="1.623em">(</mo>\n    </mrow>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mrow data-mjx-texclass="CLOSE" data-latex="\\Bigr)">\n      <mo minsize="1.623em" maxsize="1.623em">)</mo>\n    </mrow>\n  </mrow>\n</math>'
    ));
  it('Quantities_Big_3', () =>
    toXmlMatch(
      tex2mml('\\quantity\\Bigg(\\frac{a}{b})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\Bigg(\\frac{a}{b})" display="block">\n  <mrow data-latex="\\quantity\\Bigg(\\frac{a}{b})">\n    <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl(">\n      <mo minsize="2.470em" maxsize="2.470em">(</mo>\n    </mrow>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mrow data-mjx-texclass="CLOSE" data-latex="\\Biggr)">\n      <mo minsize="2.470em" maxsize="2.470em">)</mo>\n    </mrow>\n  </mrow>\n</math>'
    ));
  it('Quantities_Big_4', () =>
    toXmlMatch(
      tex2mml('\\pqty\\Bigg{} '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pqty\\Bigg{} " display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl(">\n    <mo minsize="2.470em" maxsize="2.470em">(</mo>\n  </mrow>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\pqty\\Bigg{}">\n    <mo minsize="2.470em" maxsize="2.470em">)</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Big_5', () =>
    toXmlMatch(
      tex2mml('\\pqty{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pqty{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left( \\frac{a}{b} \\right)" data-latex="\\pqty{\\frac{a}{b}}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Big_6', () =>
    toXmlMatch(
      tex2mml('\\pqty\\Bigg{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pqty\\Bigg{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl(">\n    <mo minsize="2.470em" maxsize="2.470em">(</mo>\n  </mrow>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\pqty\\Bigg{\\frac{a}{b}}">\n    <mo minsize="2.470em" maxsize="2.470em">)</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Big_7', () =>
    toXmlMatch(
      tex2mml('\\pqty\\big{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pqty\\big{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\bigl(">\n    <mo minsize="1.2em" maxsize="1.2em">(</mo>\n  </mrow>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\pqty\\big{\\frac{a}{b}}">\n    <mo minsize="1.2em" maxsize="1.2em">)</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Big_8', () =>
    toXmlMatch(
      tex2mml('\\Bqty{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Bqty{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ \\frac{a}{b} \\right\\}" data-latex="\\Bqty{\\frac{a}{b}}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Big_9', () =>
    toXmlMatch(
      tex2mml('\\Bqty\\Bigg{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Bqty\\Bigg{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">\n    <mo minsize="2.470em" maxsize="2.470em">{</mo>\n  </mrow>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\Bqty\\Bigg{\\frac{a}{b}}">\n    <mo minsize="2.470em" maxsize="2.470em">}</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Big_10', () =>
    toXmlMatch(
      tex2mml('\\Bqty\\big{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Bqty\\big{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\bigl\\{">\n    <mo minsize="1.2em" maxsize="1.2em">{</mo>\n  </mrow>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\Bqty\\big{\\frac{a}{b}}">\n    <mo minsize="1.2em" maxsize="1.2em">}</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Big_11', () =>
    toXmlMatch(
      tex2mml('\\quantity*\\Bigg(\\frac{a}{b})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity*\\Bigg(\\frac{a}{b})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\quantity">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mrow></mrow>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n  <mo data-latex="*">&#x2217;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="\\Bigg(">\n    <mo minsize="2.470em" maxsize="2.470em">(</mo>\n  </mrow>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
});

describe('Physics1_3', () => {
  it('Quantities_Absval_0', () =>
    toXmlMatch(
      tex2mml('\\absolutevalue\\Bigg{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\absolutevalue\\Bigg{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl|">\n    <mo minsize="2.470em" maxsize="2.470em">|</mo>\n  </mrow>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\absolutevalue\\Bigg{\\frac{a}{b}}">\n    <mo minsize="2.470em" maxsize="2.470em">|</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Absval_1', () =>
    toXmlMatch(
      tex2mml('\\absolutevalue{}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\absolutevalue{}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|  \\right|" data-latex="\\absolutevalue{}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Absval_2', () =>
    toXmlMatch(
      tex2mml('\\abs\\Bigg{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\abs\\Bigg{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl|">\n    <mo minsize="2.470em" maxsize="2.470em">|</mo>\n  </mrow>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\abs\\Bigg{\\frac{a}{b}}">\n    <mo minsize="2.470em" maxsize="2.470em">|</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Absval_3', () =>
    toXmlMatch(
      tex2mml('\\abs*\\Bigg{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\abs*\\Bigg{\\frac{a}{b}}" display="block">\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="\\abs*\\Bigg{\\frac{a}{b}}">|</mo>\n</math>'
    ));
  it('Quantities_Absval_4', () =>
    toXmlMatch(
      tex2mml('\\norm\\Bigg{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\norm\\Bigg{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\|">\n    <mo minsize="2.470em" maxsize="2.470em" symmetric="true">&#x2016;</mo>\n  </mrow>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\norm\\Bigg{\\frac{a}{b}}">\n    <mo minsize="2.470em" maxsize="2.470em" symmetric="true">&#x2016;</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Absval_5', () =>
    toXmlMatch(
      tex2mml('\\norm*\\Bigg{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\norm*\\Bigg{\\frac{a}{b}}" display="block">\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\|">&#x2016;</mo>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\norm*\\Bigg{\\frac{a}{b}}">&#x2016;</mo>\n</math>'
    ));
  it('Quantities_Absval_6', () =>
    toXmlMatch(
      tex2mml('\\norm{}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\norm{}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\|  \\right\\|" data-latex="\\norm{}">\n    <mo data-mjx-texclass="OPEN" symmetric="true" data-latex-item="\\left\\|" data-latex="\\left\\|">&#x2016;</mo>\n    <mo data-mjx-texclass="CLOSE" symmetric="true" data-latex-item="\\right\\|" data-latex="\\right\\|">&#x2016;</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics1_4', () => {
  it('Quantities_Eval_0', () =>
    toXmlMatch(
      tex2mml('\\evaluated{x}_0^\\infty'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\evaluated{x}_0^\\infty" display="block">\n  <msubsup data-latex="\\evaluated{x}\\left. x \\vphantom{\\int}\\right|_0 ^\\infty">\n    <mrow data-mjx-texclass="INNER" data-latex-item="\\left. x \\vphantom{\\int}\\right|" data-latex="\\left. x \\vphantom{\\int}\\right|">\n      <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n      <mi data-latex="x">x</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">\n        <mpadded width="0">\n          <mphantom>\n            <mo data-latex="\\int">&#x222B;</mo>\n          </mphantom>\n        </mpadded>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n    </mrow>\n    <mn data-latex="0">0</mn>\n    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>\n  </msubsup>\n</math>'
    ));
  it('Quantities_Eval_1', () =>
    toXmlMatch(
      tex2mml('\\eval{x}_0^\\infty'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval{x}_0^\\infty" display="block">\n  <msubsup data-latex="\\eval{x}\\left. x \\vphantom{\\int}\\right|_0 ^\\infty">\n    <mrow data-mjx-texclass="INNER" data-latex-item="\\left. x \\vphantom{\\int}\\right|" data-latex="\\left. x \\vphantom{\\int}\\right|">\n      <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n      <mi data-latex="x">x</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">\n        <mpadded width="0">\n          <mphantom>\n            <mo data-latex="\\int">&#x222B;</mo>\n          </mphantom>\n        </mpadded>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n    </mrow>\n    <mn data-latex="0">0</mn>\n    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>\n  </msubsup>\n</math>'
    ));
  it('Quantities_Eval_2', () =>
    toXmlMatch(
      tex2mml('\\eval*{x}_0^\\infty'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval*{x}_0^\\infty" display="block">\n  <msubsup data-latex="\\eval*{x}\\left. \\smash{x} \\vphantom{\\int}\\right|_0 ^\\infty">\n    <mrow data-mjx-texclass="INNER" data-latex-item="\\left. \\smash{x} \\vphantom{\\int}\\right|" data-latex="\\left. \\smash{x} \\vphantom{\\int}\\right|">\n      <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n      <mrow data-mjx-texclass="ORD" data-latex="\\smash{x}">\n        <mpadded height="0" depth="0">\n          <mi data-latex="x">x</mi>\n        </mpadded>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">\n        <mpadded width="0">\n          <mphantom>\n            <mo data-latex="\\int">&#x222B;</mo>\n          </mphantom>\n        </mpadded>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n    </mrow>\n    <mn data-latex="0">0</mn>\n    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>\n  </msubsup>\n</math>'
    ));
  it('Quantities_Eval_3', () =>
    toXmlMatch(
      tex2mml('\\eval[x|_0^\\infty'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval[x|_0^\\infty" display="block">\n  <msubsup data-latex="\\eval[x|_0 ^\\infty">\n    <mrow data-latex="|">\n      <mo data-mjx-texclass="OPEN">[</mo>\n      <mi data-latex="x">x</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">\n        <mpadded width="0">\n          <mphantom>\n            <mo data-latex="\\int">&#x222B;</mo>\n          </mphantom>\n        </mpadded>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE">|</mo>\n    </mrow>\n    <mn data-latex="0">0</mn>\n    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>\n  </msubsup>\n</math>'
    ));
  it('Quantities_Eval_4', () =>
    toXmlMatch(
      tex2mml('\\eval*(x|_0^\\infty'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval*(x|_0^\\infty" display="block">\n  <msubsup data-latex="\\eval*(x|_0 ^\\infty">\n    <mrow data-latex="|">\n      <mo data-mjx-texclass="OPEN">(</mo>\n      <mrow data-mjx-texclass="ORD">\n        <mpadded height="0" depth="0">\n          <mi data-latex="x">x</mi>\n        </mpadded>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">\n        <mpadded width="0">\n          <mphantom>\n            <mo data-latex="\\int">&#x222B;</mo>\n          </mphantom>\n        </mpadded>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE">|</mo>\n    </mrow>\n    <mn data-latex="0">0</mn>\n    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>\n  </msubsup>\n</math>'
    ));
  it('Quantities_Eval_5', () =>
    toXmlMatch(
      tex2mml('\\eval*{\\frac{A}{\\frac{A}{\\int x}}}_0^\\infty'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval*{\\frac{A}{\\frac{A}{\\int x}}}_0^\\infty" display="block">\n  <msubsup data-latex="\\eval*{\\frac{A}{\\frac{A}{\\int x}}}\\left. \\smash{\\frac{A}{\\frac{A}{\\int x}}} \\vphantom{\\int}\\right|_0 ^\\infty">\n    <mrow data-mjx-texclass="INNER" data-latex-item="\\left. \\smash{\\frac{A}{\\frac{A}{\\int x}}} \\vphantom{\\int}\\right|" data-latex="\\left. \\smash{\\frac{A}{\\frac{A}{\\int x}}} \\vphantom{\\int}\\right|">\n      <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n      <mrow data-mjx-texclass="ORD" data-latex="\\smash{\\frac{A}{\\frac{A}{\\int x}}}">\n        <mpadded height="0" depth="0">\n          <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">\n            <mi data-latex="A">A</mi>\n            <mfrac data-latex="\\frac{A}{\\int x}">\n              <mi data-latex="A">A</mi>\n              <mrow data-latex="\\int x">\n                <mo data-latex="\\int">&#x222B;</mo>\n                <mi data-latex="x">x</mi>\n              </mrow>\n            </mfrac>\n          </mfrac>\n        </mpadded>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">\n        <mpadded width="0">\n          <mphantom>\n            <mo data-latex="\\int">&#x222B;</mo>\n          </mphantom>\n        </mpadded>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n    </mrow>\n    <mn data-latex="0">0</mn>\n    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>\n  </msubsup>\n</math>'
    ));
  it('Quantities_Eval_6', () =>
    toXmlMatch(
      tex2mml('\\eval{\\frac{A}{\\frac{A}{\\int x}}}_0^\\infty'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval{\\frac{A}{\\frac{A}{\\int x}}}_0^\\infty" display="block">\n  <msubsup data-latex="\\eval{\\frac{A}{\\frac{A}{\\int x}}}\\left. \\frac{A}{\\frac{A}{\\int x}} \\vphantom{\\int}\\right|_0 ^\\infty">\n    <mrow data-mjx-texclass="INNER" data-latex-item="\\left. \\frac{A}{\\frac{A}{\\int x}} \\vphantom{\\int}\\right|" data-latex="\\left. \\frac{A}{\\frac{A}{\\int x}} \\vphantom{\\int}\\right|">\n      <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n      <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">\n        <mi data-latex="A">A</mi>\n        <mfrac data-latex="\\frac{A}{\\int x}">\n          <mi data-latex="A">A</mi>\n          <mrow data-latex="\\int x">\n            <mo data-latex="\\int">&#x222B;</mo>\n            <mi data-latex="x">x</mi>\n          </mrow>\n        </mfrac>\n      </mfrac>\n      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">\n        <mpadded width="0">\n          <mphantom>\n            <mo data-latex="\\int">&#x222B;</mo>\n          </mphantom>\n        </mpadded>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n    </mrow>\n    <mn data-latex="0">0</mn>\n    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>\n  </msubsup>\n</math>'
    ));
  it('Quantities_Eval_7', () =>
    toXmlMatch(
      tex2mml('\\eval*(\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval*(\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty" display="block">\n  <msubsup data-latex="\\eval*(\\frac{A}{\\frac{A}{\\int x}}|_0 ^\\infty">\n    <mrow data-latex="|">\n      <mo data-mjx-texclass="OPEN">(</mo>\n      <mrow data-mjx-texclass="ORD">\n        <mpadded height="0" depth="0">\n          <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">\n            <mi data-latex="A">A</mi>\n            <mfrac data-latex="\\frac{A}{\\int x}">\n              <mi data-latex="A">A</mi>\n              <mrow data-latex="\\int x">\n                <mo data-latex="\\int">&#x222B;</mo>\n                <mi data-latex="x">x</mi>\n              </mrow>\n            </mfrac>\n          </mfrac>\n        </mpadded>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">\n        <mpadded width="0">\n          <mphantom>\n            <mo data-latex="\\int">&#x222B;</mo>\n          </mphantom>\n        </mpadded>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE">|</mo>\n    </mrow>\n    <mn data-latex="0">0</mn>\n    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>\n  </msubsup>\n</math>'
    ));
  it('Quantities_Eval_8', () =>
    toXmlMatch(
      tex2mml('\\eval(\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval(\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty" display="block">\n  <msubsup data-latex="\\eval(\\frac{A}{\\frac{A}{\\int x}}|_0 ^\\infty">\n    <mrow data-latex="|">\n      <mo data-mjx-texclass="OPEN">(</mo>\n      <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">\n        <mi data-latex="A">A</mi>\n        <mfrac data-latex="\\frac{A}{\\int x}">\n          <mi data-latex="A">A</mi>\n          <mrow data-latex="\\int x">\n            <mo data-latex="\\int">&#x222B;</mo>\n            <mi data-latex="x">x</mi>\n          </mrow>\n        </mfrac>\n      </mfrac>\n      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">\n        <mpadded width="0">\n          <mphantom>\n            <mo data-latex="\\int">&#x222B;</mo>\n          </mphantom>\n        </mpadded>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE">|</mo>\n    </mrow>\n    <mn data-latex="0">0</mn>\n    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>\n  </msubsup>\n</math>'
    ));
  it('Quantities_Eval_9', () =>
    toXmlMatch(
      tex2mml('\\eval*[\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval*[\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty" display="block">\n  <msubsup data-latex="\\eval*[\\frac{A}{\\frac{A}{\\int x}}|_0 ^\\infty">\n    <mrow data-latex="|">\n      <mo data-mjx-texclass="OPEN">[</mo>\n      <mrow data-mjx-texclass="ORD">\n        <mpadded height="0" depth="0">\n          <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">\n            <mi data-latex="A">A</mi>\n            <mfrac data-latex="\\frac{A}{\\int x}">\n              <mi data-latex="A">A</mi>\n              <mrow data-latex="\\int x">\n                <mo data-latex="\\int">&#x222B;</mo>\n                <mi data-latex="x">x</mi>\n              </mrow>\n            </mfrac>\n          </mfrac>\n        </mpadded>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">\n        <mpadded width="0">\n          <mphantom>\n            <mo data-latex="\\int">&#x222B;</mo>\n          </mphantom>\n        </mpadded>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE">|</mo>\n    </mrow>\n    <mn data-latex="0">0</mn>\n    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>\n  </msubsup>\n</math>'
    ));
  it('Quantities_Eval_10', () =>
    toXmlMatch(
      tex2mml('\\eval[\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval[\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty" display="block">\n  <msubsup data-latex="\\eval[\\frac{A}{\\frac{A}{\\int x}}|_0 ^\\infty">\n    <mrow data-latex="|">\n      <mo data-mjx-texclass="OPEN">[</mo>\n      <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">\n        <mi data-latex="A">A</mi>\n        <mfrac data-latex="\\frac{A}{\\int x}">\n          <mi data-latex="A">A</mi>\n          <mrow data-latex="\\int x">\n            <mo data-latex="\\int">&#x222B;</mo>\n            <mi data-latex="x">x</mi>\n          </mrow>\n        </mfrac>\n      </mfrac>\n      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">\n        <mpadded width="0">\n          <mphantom>\n            <mo data-latex="\\int">&#x222B;</mo>\n          </mphantom>\n        </mpadded>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE">|</mo>\n    </mrow>\n    <mn data-latex="0">0</mn>\n    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>\n  </msubsup>\n</math>'
    ));
});

describe('Physics1_5', () => {
  it('Quantities_Order_0', () =>
    toXmlMatch(
      tex2mml('\\order{}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\order{}" display="block">\n  <mi data-mjx-variant="-tex-calligraphic" data-mjx-texclass="OP" mathvariant="script">O</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(  \\right)" data-latex="\\left(  \\right)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Order_1', () =>
    toXmlMatch(
      tex2mml('\\order{x^2}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\order{x^2}" display="block">\n  <mi data-mjx-variant="-tex-calligraphic" data-mjx-texclass="OP" mathvariant="script">O</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left( x^2  \\right)" data-latex="\\left( x^2  \\right)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <msup data-latex="x^2">\n      <mi data-latex="x">x</mi>\n      <mn data-latex="2">2</mn>\n    </msup>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Order_2', () =>
    toXmlMatch(
      tex2mml('\\order\\Bigg{x^2}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\order\\Bigg{x^2}" display="block">\n  <mi data-mjx-variant="-tex-calligraphic" data-mjx-texclass="OP" mathvariant="script">O</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl(">\n    <mo minsize="2.470em" maxsize="2.470em">(</mo>\n  </mrow>\n  <msup data-latex="x^2">\n    <mi data-latex="x">x</mi>\n    <mn data-latex="2">2</mn>\n  </msup>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\order\\Bigg{x^2}">\n    <mo minsize="2.470em" maxsize="2.470em">)</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Order_3', () =>
    toXmlMatch(
      tex2mml('\\order{\\frac{A}{\\frac{A}{\\int x}}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\order{\\frac{A}{\\frac{A}{\\int x}}}" display="block">\n  <mi data-mjx-variant="-tex-calligraphic" data-mjx-texclass="OP" mathvariant="script">O</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left( \\frac{A}{\\frac{A}{\\int x}} \\right)" data-latex="\\left( \\frac{A}{\\frac{A}{\\int x}} \\right)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">\n      <mi data-latex="A">A</mi>\n      <mfrac data-latex="\\frac{A}{\\int x}">\n        <mi data-latex="A">A</mi>\n        <mrow data-latex="\\int x">\n          <mo data-latex="\\int">&#x222B;</mo>\n          <mi data-latex="x">x</mi>\n        </mrow>\n      </mfrac>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Order_4', () =>
    toXmlMatch(
      tex2mml('\\order*{\\frac{A}{\\frac{A}{\\int x}}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\order*{\\frac{A}{\\frac{A}{\\int x}}}" display="block">\n  <mi data-mjx-variant="-tex-calligraphic" data-mjx-texclass="OP" mathvariant="script">O</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">\n    <mi data-latex="A">A</mi>\n    <mfrac data-latex="\\frac{A}{\\int x}">\n      <mi data-latex="A">A</mi>\n      <mrow data-latex="\\int x">\n        <mo data-latex="\\int">&#x222B;</mo>\n        <mi data-latex="x">x</mi>\n      </mrow>\n    </mfrac>\n  </mfrac>\n  <mo data-latex="\\order*{\\frac{A}{\\frac{A}{\\int x}}}" stretchy="false">)</mo>\n</math>'
    ));
});

describe('Physics1_6', () => {
  it('Quantities_Comm_0', () =>
    toXmlMatch(
      tex2mml('\\comm{A}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\comm{A}{B}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[ A,B \\right]" data-latex="\\comm{A}{B}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mi data-latex="A">A</mi>\n    <mo data-latex=",">,</mo>\n    <mi data-latex="B">B</mi>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Comm_1', () =>
    toXmlMatch(
      tex2mml('\\comm{\\frac{A}{\\frac{A}{\\int x}}}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\comm{\\frac{A}{\\frac{A}{\\int x}}}{B}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[ \\frac{A}{\\frac{A}{\\int x}},B \\right]" data-latex="\\comm{\\frac{A}{\\frac{A}{\\int x}}}{B}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">\n      <mi data-latex="A">A</mi>\n      <mfrac data-latex="\\frac{A}{\\int x}">\n        <mi data-latex="A">A</mi>\n        <mrow data-latex="\\int x">\n          <mo data-latex="\\int">&#x222B;</mo>\n          <mi data-latex="x">x</mi>\n        </mrow>\n      </mfrac>\n    </mfrac>\n    <mo data-latex=",">,</mo>\n    <mi data-latex="B">B</mi>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Comm_2', () =>
    toXmlMatch(
      tex2mml('\\comm\\Bigg{A}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\comm\\Bigg{A}{B}" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl[">\n    <mo minsize="2.470em" maxsize="2.470em">[</mo>\n  </mrow>\n  <mi data-latex="A">A</mi>\n  <mo data-latex=",">,</mo>\n  <mi data-latex="B">B</mi>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\comm\\Bigg{A}{B}">\n    <mo minsize="2.470em" maxsize="2.470em">]</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Comm_3', () =>
    toXmlMatch(
      tex2mml('\\comm*{\\frac{A}{\\frac{A}{\\int x}}}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\comm*{\\frac{A}{\\frac{A}{\\int x}}}{B}" display="block">\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">\n    <mi data-latex="A">A</mi>\n    <mfrac data-latex="\\frac{A}{\\int x}">\n      <mi data-latex="A">A</mi>\n      <mrow data-latex="\\int x">\n        <mo data-latex="\\int">&#x222B;</mo>\n        <mi data-latex="x">x</mi>\n      </mrow>\n    </mfrac>\n  </mfrac>\n  <mo data-latex=",">,</mo>\n  <mi data-latex="B">B</mi>\n  <mo data-latex="\\comm*{\\frac{A}{\\frac{A}{\\int x}}}{B}" stretchy="false">]</mo>\n</math>'
    ));
  it('Quantities_Comm_4', () =>
    toXmlMatch(
      tex2mml('\\comm*\\Bigg{\\frac{X}{Y}}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\comm*\\Bigg{\\frac{X}{Y}}{B}" display="block">\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mfrac data-latex="\\frac{X}{Y}">\n    <mi data-latex="X">X</mi>\n    <mi data-latex="Y">Y</mi>\n  </mfrac>\n  <mo data-latex=",">,</mo>\n  <mi data-latex="B">B</mi>\n  <mo data-latex="\\comm*\\Bigg{\\frac{X}{Y}}{B}" stretchy="false">]</mo>\n</math>'
    ));
  it('Quantities_Comm_5', () =>
    toXmlMatch(
      tex2mml('\\comm{A}B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\comm{A}B" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[ A,B \\right]" data-latex="\\comm{A}B">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mi data-latex="A">A</mi>\n    <mo data-latex=",">,</mo>\n    <mi data-latex="B">B</mi>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics1_7', () => {
  it('Quantities_Acomm_0', () =>
    toXmlMatch(
      tex2mml('\\acomm{A}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acomm{A}{B}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ A,B \\right\\}" data-latex="\\acomm{A}{B}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>\n    <mi data-latex="A">A</mi>\n    <mo data-latex=",">,</mo>\n    <mi data-latex="B">B</mi>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Acomm_1', () =>
    toXmlMatch(
      tex2mml('\\anticommutator{A}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\anticommutator{A}{B}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ A,B \\right\\}" data-latex="\\anticommutator{A}{B}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>\n    <mi data-latex="A">A</mi>\n    <mo data-latex=",">,</mo>\n    <mi data-latex="B">B</mi>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Acomm_2', () =>
    toXmlMatch(
      tex2mml('\\poissonbracket{A}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\poissonbracket{A}{B}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ A,B \\right\\}" data-latex="\\poissonbracket{A}{B}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>\n    <mi data-latex="A">A</mi>\n    <mo data-latex=",">,</mo>\n    <mi data-latex="B">B</mi>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Acomm_3', () =>
    toXmlMatch(
      tex2mml('\\pb{A}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pb{A}{B}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ A,B \\right\\}" data-latex="\\pb{A}{B}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>\n    <mi data-latex="A">A</mi>\n    <mo data-latex=",">,</mo>\n    <mi data-latex="B">B</mi>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Acomm_4', () =>
    toXmlMatch(
      tex2mml('\\acomm{\\frac{A}{\\frac{A}{\\int x}}}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acomm{\\frac{A}{\\frac{A}{\\int x}}}{B}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ \\frac{A}{\\frac{A}{\\int x}},B \\right\\}" data-latex="\\acomm{\\frac{A}{\\frac{A}{\\int x}}}{B}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>\n    <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">\n      <mi data-latex="A">A</mi>\n      <mfrac data-latex="\\frac{A}{\\int x}">\n        <mi data-latex="A">A</mi>\n        <mrow data-latex="\\int x">\n          <mo data-latex="\\int">&#x222B;</mo>\n          <mi data-latex="x">x</mi>\n        </mrow>\n      </mfrac>\n    </mfrac>\n    <mo data-latex=",">,</mo>\n    <mi data-latex="B">B</mi>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Acomm_5', () =>
    toXmlMatch(
      tex2mml('\\acomm\\Bigg{A}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acomm\\Bigg{A}{B}" display="block">\n  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">\n    <mo minsize="2.470em" maxsize="2.470em">{</mo>\n  </mrow>\n  <mi data-latex="A">A</mi>\n  <mo data-latex=",">,</mo>\n  <mi data-latex="B">B</mi>\n  <mrow data-mjx-texclass="CLOSE" data-latex="\\acomm\\Bigg{A}{B}">\n    <mo minsize="2.470em" maxsize="2.470em">}</mo>\n  </mrow>\n</math>'
    ));
  it('Quantities_Acomm_6', () =>
    toXmlMatch(
      tex2mml('\\acomm*{\\frac{A}{\\frac{A}{\\int x}}}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acomm*{\\frac{A}{\\frac{A}{\\int x}}}{B}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\{">{</mo>\n  <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">\n    <mi data-latex="A">A</mi>\n    <mfrac data-latex="\\frac{A}{\\int x}">\n      <mi data-latex="A">A</mi>\n      <mrow data-latex="\\int x">\n        <mo data-latex="\\int">&#x222B;</mo>\n        <mi data-latex="x">x</mi>\n      </mrow>\n    </mfrac>\n  </mfrac>\n  <mo data-latex=",">,</mo>\n  <mi data-latex="B">B</mi>\n  <mo fence="false" stretchy="false" data-latex="\\acomm*{\\frac{A}{\\frac{A}{\\int x}}}{B}">}</mo>\n</math>'
    ));
  it('Quantities_Acomm_7', () =>
    toXmlMatch(
      tex2mml('\\acomm{A}B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acomm{A}B" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ A,B \\right\\}" data-latex="\\acomm{A}B">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>\n    <mi data-latex="A">A</mi>\n    <mo data-latex=",">,</mo>\n    <mi data-latex="B">B</mi>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics2_0', () => {
  it('Vector_Bold_0', () =>
    toXmlMatch(
      tex2mml('\\vectorbold{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vectorbold{a}" display="block">\n  <mi mathvariant="bold" data-latex="\\vectorbold{a}">a</mi>\n</math>'
    ));
  it('Vector_Bold_1', () =>
    toXmlMatch(
      tex2mml('\\vectorbold*{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vectorbold*{a}" display="block">\n  <mi mathvariant="bold-italic" data-latex="\\vectorbold*{a}">a</mi>\n</math>'
    ));
  it('Vector_Bold_2', () =>
    toXmlMatch(
      tex2mml('\\vb{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{a}" display="block">\n  <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>\n</math>'
    ));
  it('Vector_Bold_3', () =>
    toXmlMatch(
      tex2mml('\\vb{\\Gamma}\\Gamma'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\Gamma}\\Gamma" display="block">\n  <mi mathvariant="bold" data-latex="\\vb{\\Gamma}">&#x393;</mi>\n  <mi mathvariant="normal" data-latex="\\Gamma">&#x393;</mi>\n</math>'
    ));
  it('Vector_Bold_4', () =>
    toXmlMatch(
      tex2mml('\\vb{2}2'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{2}2" display="block">\n  <mn mathvariant="bold" data-latex="\\vb{2}">2</mn>\n  <mn data-latex="2">2</mn>\n</math>'
    ));
  it('Vector_Bold_5', () =>
    toXmlMatch(
      tex2mml('\\vb{\\theta}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\theta}" display="block">\n  <mi data-latex="\\vb{\\theta}">&#x3B8;</mi>\n</math>'
    ));
  it('Vector_Bold_6', () =>
    toXmlMatch(
      tex2mml(
        '\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}" display="block">\n  <mi data-latex="\\theta">&#x3B8;</mi>\n  <mi mathvariant="bold" data-latex="\\Gamma">&#x393;</mi>\n  <mi mathvariant="bold" data-latex="a">a</mi>\n  <mi data-latex="\\delta">&#x3B4;</mi>\n  <mfrac data-latex="\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}">\n    <mi data-latex="\\theta">&#x3B8;</mi>\n    <mi mathvariant="bold" data-latex="b">b</mi>\n  </mfrac>\n  <mfrac data-latex="\\frac{\\theta}{b}">\n    <mi data-latex="\\theta">&#x3B8;</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n</math>'
    ));
  it('Vector_Bold_7', () =>
    toXmlMatch(
      tex2mml('\\vb*{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb*{a}" display="block">\n  <mi mathvariant="bold-italic" data-latex="\\vb*{a}">a</mi>\n</math>'
    ));
  it('Vector_Bold_8', () =>
    toXmlMatch(
      tex2mml('\\vb*{2}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb*{2}" display="block">\n  <mn mathvariant="bold-italic" data-latex="\\vb*{2}">2</mn>\n</math>'
    ));
  it('Vector_Bold_9', () =>
    toXmlMatch(
      tex2mml('\\vb*{\\Gamma}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb*{\\Gamma}" display="block">\n  <mi mathvariant="bold-italic" data-latex="\\vb*{\\Gamma}">&#x393;</mi>\n</math>'
    ));
  it('Vector_Bold_10', () =>
    toXmlMatch(
      tex2mml('\\vb*{\\theta}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb*{\\theta}" display="block">\n  <mi mathvariant="bold-italic" data-latex="\\vb*{\\theta}">&#x3B8;</mi>\n</math>'
    ));
});

describe('Physics2_1', () => {
  it('Vector_Special_0', () =>
    toXmlMatch(
      tex2mml('\\vb{\\mbox{ab}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\mbox{ab}}" display="block">\n  <mstyle displaystyle="false" scriptlevel="0" data-latex="\\vb{\\mbox{ab}}">\n    <mtext>ab</mtext>\n  </mstyle>\n</math>'
    ));
  it('Vector_Special_1', () =>
    toXmlMatch(
      tex2mml('\\vb{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{B}" display="block">\n  <mi mathvariant="bold" data-latex="\\vb{B}">B</mi>\n</math>'
    ));
  it('Vector_Special_2', () =>
    toXmlMatch(
      tex2mml('\\vb{\\mathcal{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\mathcal{B}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vb{\\mathcal{B}}">\n    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="B">B</mi>\n  </mrow>\n</math>'
    ));
  it('Vector_Special_3', () =>
    toXmlMatch(
      tex2mml('\\mathcal{\\vb{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathcal{\\vb{B}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathcal{\\vb{B}}">\n    <mi mathvariant="bold" data-latex="\\vb{B}">B</mi>\n  </mrow>\n</math>'
    ));
  it('Vector_Special_4', () =>
    toXmlMatch(
      tex2mml('\\mathit{\\vb{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathit{\\vb{B}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathit{\\vb{B}}">\n    <mi mathvariant="bold" data-latex="\\vb{B}">B</mi>\n  </mrow>\n</math>'
    ));
  it('Vector_Special_5', () =>
    toXmlMatch(
      tex2mml('\\vb{\\mathit{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\mathit{B}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vb{\\mathit{B}}">\n    <mi data-mjx-variant="-tex-mathit" mathvariant="italic" data-latex="B">B</mi>\n  </mrow>\n</math>'
    ));
  it('Vector_Special_6', () =>
    toXmlMatch(
      tex2mml('\\vb{\\mathit{a}b}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\mathit{a}b}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathit{a}">\n    <mi data-mjx-variant="-tex-mathit" mathvariant="italic" data-latex="a">a</mi>\n  </mrow>\n  <mi mathvariant="bold" data-latex="\\vb{\\mathit{a}b}">b</mi>\n</math>'
    ));
  it('Vector_Special_7', () =>
    toXmlMatch(
      tex2mml('\\vb{a+\\theta}{\\bf +}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{a+\\theta}{\\bf +}" display="block">\n  <mi mathvariant="bold" data-latex="a">a</mi>\n  <mo data-latex="+">+</mo>\n  <mi data-latex="\\vb{a+\\theta}">&#x3B8;</mi>\n  <mrow data-mjx-texclass="ORD" data-latex="{+}">\n    <mo mathvariant="bold" data-latex="+">+</mo>\n  </mrow>\n</math>'
    ));
  it('Vector_Special_8', () =>
    toXmlMatch(
      tex2mml('\\vb{\\hat{a}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\hat{a}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vb{\\hat{a}}">\n    <mover>\n      <mi mathvariant="bold" data-latex="a">a</mi>\n      <mo mathvariant="bold" stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Special_9', () =>
    toXmlMatch(
      tex2mml('\\vb{[}['),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{[}[" display="block">\n  <mo data-latex="\\vb{[}" stretchy="false">[</mo>\n  <mo data-latex="[" stretchy="false">[</mo>\n</math>'
    ));
  it('Vector_Special_10', () =>
    toXmlMatch(
      tex2mml('\\vb{\\hat{}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\hat{}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vb{\\hat{}}">\n    <mover>\n      <mrow data-latex=""></mrow>\n      <mo mathvariant="bold" stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Special_11', () =>
    toXmlMatch(
      tex2mml('\\vb{=}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{=}" display="block">\n  <mo data-latex="\\vb{=}">=</mo>\n</math>'
    ));
  it('Vector_Special_12', () =>
    toXmlMatch(
      tex2mml('\\vb{\\hat{=}}\\hat{=}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\hat{=}}\\hat{=}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vb{\\hat{=}}">\n    <mover>\n      <mo data-latex="=">=</mo>\n      <mo mathvariant="bold" stretchy="false">^</mo>\n    </mover>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{=}">\n    <mover>\n      <mo data-latex="=">=</mo>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
});

describe('Physics2_2', () => {
  it('Vector_Arrow_0', () =>
    toXmlMatch(
      tex2mml('\\va{=}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{=}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{=}}">\n    <mover>\n      <mo data-latex="\\vb{=}">=</mo>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Arrow_1', () =>
    toXmlMatch(
      tex2mml('\\vectorarrow{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vectorarrow{a}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{a}}">\n    <mover>\n      <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Arrow_2', () =>
    toXmlMatch(
      tex2mml('\\va{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{a}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{a}}">\n    <mover>\n      <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Arrow_3', () =>
    toXmlMatch(
      tex2mml('\\va{\\Gamma}\\Gamma'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{\\Gamma}\\Gamma" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{\\Gamma}}">\n    <mover>\n      <mi mathvariant="bold" data-latex="\\vb{\\Gamma}">&#x393;</mi>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n  <mi mathvariant="normal" data-latex="\\Gamma">&#x393;</mi>\n</math>'
    ));
  it('Vector_Arrow_4', () =>
    toXmlMatch(
      tex2mml('\\va{2}2'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{2}2" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{2}}">\n    <mover>\n      <mn mathvariant="bold" data-latex="\\vb{2}">2</mn>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n  <mn data-latex="2">2</mn>\n</math>'
    ));
  it('Vector_Arrow_5', () =>
    toXmlMatch(
      tex2mml('\\va{\\theta}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{\\theta}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{\\theta}}">\n    <mover>\n      <mi data-latex="\\vb{\\theta}">&#x3B8;</mi>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Arrow_6', () =>
    toXmlMatch(
      tex2mml(
        '\\va{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}}">\n    <mover>\n      <mrow data-latex="\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}">\n        <mi data-latex="\\theta">&#x3B8;</mi>\n        <mi mathvariant="bold" data-latex="\\Gamma">&#x393;</mi>\n        <mi mathvariant="bold" data-latex="a">a</mi>\n        <mi data-latex="\\delta">&#x3B4;</mi>\n        <mfrac data-latex="\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}">\n          <mi data-latex="\\theta">&#x3B8;</mi>\n          <mi mathvariant="bold" data-latex="b">b</mi>\n        </mfrac>\n      </mrow>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n  <mfrac data-latex="\\frac{\\theta}{b}">\n    <mi data-latex="\\theta">&#x3B8;</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n</math>'
    ));
  it('Vector_Arrow_7', () =>
    toXmlMatch(
      tex2mml('\\vectorarrow*{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vectorarrow*{a}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb*{a}}">\n    <mover>\n      <mi mathvariant="bold-italic" data-latex="\\vb*{a}">a</mi>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Arrow_8', () =>
    toXmlMatch(
      tex2mml('\\va*{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va*{a}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb*{a}}">\n    <mover>\n      <mi mathvariant="bold-italic" data-latex="\\vb*{a}">a</mi>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Arrow_9', () =>
    toXmlMatch(
      tex2mml('\\va*{2}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va*{2}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb*{2}}">\n    <mover>\n      <mn mathvariant="bold-italic" data-latex="\\vb*{2}">2</mn>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Arrow_10', () =>
    toXmlMatch(
      tex2mml('\\va*{\\Gamma}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va*{\\Gamma}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb*{\\Gamma}}">\n    <mover>\n      <mi mathvariant="bold-italic" data-latex="\\vb*{\\Gamma}">&#x393;</mi>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Arrow_11', () =>
    toXmlMatch(
      tex2mml('\\va*{\\theta}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va*{\\theta}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb*{\\theta}}">\n    <mover>\n      <mi mathvariant="bold-italic" data-latex="\\vb*{\\theta}">&#x3B8;</mi>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Arrow_12', () =>
    toXmlMatch(
      tex2mml('\\va{a}\\vec{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{a}\\vec{a}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{a}}">\n    <mover>\n      <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="\\vec{a}">\n    <mover>\n      <mi data-latex="a">a</mi>\n      <mo stretchy="false">&#x2192;</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
});

describe('Physics2_3', () => {
  it('Vector_Unit_0', () =>
    toXmlMatch(
      tex2mml('\\vu{=}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{=}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{=}}">\n    <mover>\n      <mo data-latex="\\vb{=}">=</mo>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Unit_1', () =>
    toXmlMatch(
      tex2mml('\\vectorunit{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vectorunit{a}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{a}}">\n    <mover>\n      <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Unit_2', () =>
    toXmlMatch(
      tex2mml('\\vu{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{a}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{a}}">\n    <mover>\n      <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Unit_3', () =>
    toXmlMatch(
      tex2mml('\\vu{\\Gamma}\\Gamma'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{\\Gamma}\\Gamma" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{\\Gamma}}">\n    <mover>\n      <mi mathvariant="bold" data-latex="\\vb{\\Gamma}">&#x393;</mi>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n  <mi mathvariant="normal" data-latex="\\Gamma">&#x393;</mi>\n</math>'
    ));
  it('Vector_Unit_4', () =>
    toXmlMatch(
      tex2mml('\\vu{2}2'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{2}2" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{2}}">\n    <mover>\n      <mn mathvariant="bold" data-latex="\\vb{2}">2</mn>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n  <mn data-latex="2">2</mn>\n</math>'
    ));
  it('Vector_Unit_5', () =>
    toXmlMatch(
      tex2mml('\\vu{\\theta}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{\\theta}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{\\theta}}">\n    <mover>\n      <mi data-latex="\\vb{\\theta}">&#x3B8;</mi>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Unit_6', () =>
    toXmlMatch(
      tex2mml(
        '\\vu{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}}">\n    <mover>\n      <mrow data-latex="\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}">\n        <mi data-latex="\\theta">&#x3B8;</mi>\n        <mi mathvariant="bold" data-latex="\\Gamma">&#x393;</mi>\n        <mi mathvariant="bold" data-latex="a">a</mi>\n        <mi data-latex="\\delta">&#x3B4;</mi>\n        <mfrac data-latex="\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}">\n          <mi data-latex="\\theta">&#x3B8;</mi>\n          <mi mathvariant="bold" data-latex="b">b</mi>\n        </mfrac>\n      </mrow>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n  <mfrac data-latex="\\frac{\\theta}{b}">\n    <mi data-latex="\\theta">&#x3B8;</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n</math>'
    ));
  it('Vector_Unit_7', () =>
    toXmlMatch(
      tex2mml('\\vectorunit*{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vectorunit*{a}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb*{a}}">\n    <mover>\n      <mi mathvariant="bold-italic" data-latex="\\vb*{a}">a</mi>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Unit_8', () =>
    toXmlMatch(
      tex2mml('\\vu*{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu*{a}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb*{a}}">\n    <mover>\n      <mi mathvariant="bold-italic" data-latex="\\vb*{a}">a</mi>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Unit_9', () =>
    toXmlMatch(
      tex2mml('\\vu*{2}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu*{2}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb*{2}}">\n    <mover>\n      <mn mathvariant="bold-italic" data-latex="\\vb*{2}">2</mn>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Unit_10', () =>
    toXmlMatch(
      tex2mml('\\vu*{\\Gamma}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu*{\\Gamma}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb*{\\Gamma}}">\n    <mover>\n      <mi mathvariant="bold-italic" data-latex="\\vb*{\\Gamma}">&#x393;</mi>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Unit_11', () =>
    toXmlMatch(
      tex2mml('\\vu*{\\theta}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu*{\\theta}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb*{\\theta}}">\n    <mover>\n      <mi mathvariant="bold-italic" data-latex="\\vb*{\\theta}">&#x3B8;</mi>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Vector_Unit_12', () =>
    toXmlMatch(
      tex2mml('\\vu{a}\\hat{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{a}\\hat{a}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{a}}">\n    <mover>\n      <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="\\hat{a}">\n    <mover>\n      <mi data-latex="a">a</mi>\n      <mo stretchy="false">^</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
});

describe('Physics2_4', () => {
  it('Vector_Gradient_0', () =>
    toXmlMatch(
      tex2mml('\\gradient '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\gradient " display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\gradient ">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n</math>'
    ));
  it('Vector_Gradient_1', () =>
    toXmlMatch(
      tex2mml('\\gradient(\\frac{a}{b})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\gradient(\\frac{a}{b})" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Vector_Gradient_2', () =>
    toXmlMatch(
      tex2mml('\\gradient[\\frac{a}{b}]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\gradient[\\frac{a}{b}]" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex="]">\n    <mo data-mjx-texclass="OPEN">[</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">]</mo>\n  </mrow>\n</math>'
    ));
  it('Vector_Gradient_3', () =>
    toXmlMatch(
      tex2mml('\\gradient{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\gradient{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n</math>'
    ));
  it('Vector_Gradient_4', () =>
    toXmlMatch(
      tex2mml('\\grad '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\grad " display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\grad ">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n</math>'
    ));
  it('Vector_Gradient_5', () =>
    toXmlMatch(
      tex2mml('\\grad(\\frac{a}{b})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\grad(\\frac{a}{b})" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Vector_Gradient_6', () =>
    toXmlMatch(
      tex2mml('\\grad[\\frac{a}{b}]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\grad[\\frac{a}{b}]" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex="]">\n    <mo data-mjx-texclass="OPEN">[</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">]</mo>\n  </mrow>\n</math>'
    ));
  it('Vector_Gradient_7', () =>
    toXmlMatch(
      tex2mml('\\grad{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\grad{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n</math>'
    ));
});

describe('Physics2_5', () => {
  it('Vector_Divergence_0', () =>
    toXmlMatch(
      tex2mml('a\\dotproduct b \\vdot c'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\dotproduct b \\vdot c" display="block">\n  <mi data-latex="a">a</mi>\n  <mo mathvariant="bold" data-latex="\\dotproduct">&#x22C5;</mo>\n  <mi data-latex="b">b</mi>\n  <mo mathvariant="bold" data-latex="\\vdot">&#x22C5;</mo>\n  <mi data-latex="c">c</mi>\n</math>'
    ));
  it('Vector_Divergence_1', () =>
    toXmlMatch(
      tex2mml('\\divergence{\\frac{a}{b}c}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\divergence{\\frac{a}{b}c}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo mathvariant="bold" data-latex="\\vdot">&#x22C5;</mo>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mi data-latex="c">c</mi>\n</math>'
    ));
  it('Vector_Divergence_2', () =>
    toXmlMatch(
      tex2mml('\\div{\\frac{a}{b}c}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\div{\\frac{a}{b}c}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo mathvariant="bold" data-latex="\\vdot">&#x22C5;</mo>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mi data-latex="c">c</mi>\n</math>'
    ));
  it('Vector_Divergence_3', () =>
    toXmlMatch(
      tex2mml('\\div{(\\frac{a}{b}c)}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\div{(\\frac{a}{b}c)}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo mathvariant="bold" data-latex="\\vdot">&#x22C5;</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n  <mi data-latex="c">c</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Vector_Divergence_4', () =>
    toXmlMatch(
      tex2mml('\\div(\\frac{a}{b}c)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\div(\\frac{a}{b}c)" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo mathvariant="bold" data-latex="\\vdot">&#x22C5;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mi data-latex="c">c</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Vector_Divergence_5', () =>
    toXmlMatch(
      tex2mml('{\\bf\\nabla} \\cdot \\left(\\frac{a}{b}c\\right)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{\\bf\\nabla} \\cdot \\left(\\frac{a}{b}c\\right)" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\nabla}">\n    <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>\n  </mrow>\n  <mo data-latex="\\cdot">&#x22C5;</mo>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\frac{a}{b}c\\right)" data-latex="\\left(\\frac{a}{b}c\\right)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mi data-latex="c">c</mi>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics2_6', () => {
  it('Vector_Curl_0', () =>
    toXmlMatch(
      tex2mml('\\curl '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\curl " display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo data-latex="\\crossproduct">&#xD7;</mo>\n</math>'
    ));
  it('Vector_Curl_1', () =>
    toXmlMatch(
      tex2mml('\\curl(\\frac{a}{b})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\curl(\\frac{a}{b})" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo data-latex="\\crossproduct">&#xD7;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Vector_Curl_2', () =>
    toXmlMatch(
      tex2mml('\\curl[\\frac{a}{b}]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\curl[\\frac{a}{b}]" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo data-latex="\\crossproduct">&#xD7;</mo>\n  <mrow data-latex="]">\n    <mo data-mjx-texclass="OPEN">[</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">]</mo>\n  </mrow>\n</math>'
    ));
  it('Vector_Curl_3', () =>
    toXmlMatch(
      tex2mml('\\curl{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\curl{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">\n    <mrow data-mjx-texclass="ORD">\n      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>\n    </mrow>\n  </mrow>\n  <mo data-latex="\\crossproduct">&#xD7;</mo>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n</math>'
    ));
});

describe('Physics2_7', () => {
  it('Vector_Laplace_0', () =>
    toXmlMatch(
      tex2mml('\\laplacian '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\laplacian " display="block">\n  <msup data-latex="\\laplacian ">\n    <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>\n    <mn data-latex="2">2</mn>\n  </msup>\n</math>'
    ));
  it('Vector_Laplace_1', () =>
    toXmlMatch(
      tex2mml('\\laplacian(\\frac{a}{b})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\laplacian(\\frac{a}{b})" display="block">\n  <msup data-latex="\\nabla^2 ">\n    <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>\n    <mn data-latex="2">2</mn>\n  </msup>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Vector_Laplace_2', () =>
    toXmlMatch(
      tex2mml('\\laplacian[\\frac{a}{b}]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\laplacian[\\frac{a}{b}]" display="block">\n  <msup data-latex="\\nabla^2 ">\n    <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>\n    <mn data-latex="2">2</mn>\n  </msup>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex="]">\n    <mo data-mjx-texclass="OPEN">[</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">]</mo>\n  </mrow>\n</math>'
    ));
  it('Vector_Laplace_3', () =>
    toXmlMatch(
      tex2mml('\\laplacian{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\laplacian{\\frac{a}{b}}" display="block">\n  <msup data-latex="\\nabla^2 ">\n    <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>\n    <mn data-latex="2">2</mn>\n  </msup>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mfrac data-latex="\\frac{a}{b}">\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </mfrac>\n</math>'
    ));
});

describe('Physics3_0', () => {
  it('Operators_Trig_0', () =>
    toXmlMatch(
      tex2mml('\\sin(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin(x)" display="block">\n  <mi>sin</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Trig_1', () =>
    toXmlMatch(
      tex2mml('\\sinh(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sinh(x)" display="block">\n  <mi>sinh</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Trig_2', () =>
    toXmlMatch(
      tex2mml('\\arcsin(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arcsin(x)" display="block">\n  <mi>arcsin</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Trig_3', () =>
    toXmlMatch(
      tex2mml('\\asin(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\asin(x)" display="block">\n  <mi>asin</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Trig_4', () =>
    toXmlMatch(
      tex2mml('\\cos(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cos(x)" display="block">\n  <mi>cos</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Trig_5', () =>
    toXmlMatch(
      tex2mml('\\cosh(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cosh(x)" display="block">\n  <mi>cosh</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Trig_6', () =>
    toXmlMatch(
      tex2mml('\\arccos(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccos(x)" display="block">\n  <mi>arccos</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Trig_7', () =>
    toXmlMatch(
      tex2mml('\\acos(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acos(x)" display="block">\n  <mi>acos</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Trig_8', () =>
    toXmlMatch(
      tex2mml('\\tan(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tan(x)" display="block">\n  <mi>tan</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Trig_9', () =>
    toXmlMatch(
      tex2mml('\\tanh(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tanh(x)" display="block">\n  <mi>tanh</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Trig_10', () =>
    toXmlMatch(
      tex2mml('\\arctan(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arctan(x)" display="block">\n  <mi>arctan</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Trig_11', () =>
    toXmlMatch(
      tex2mml('\\atan(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\atan(x)" display="block">\n  <mi>atan</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics3_1', () => {
  it('Operators_Arc_0', () =>
    toXmlMatch(
      tex2mml('\\csc(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\csc(x)" display="block">\n  <mi>csc</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Arc_1', () =>
    toXmlMatch(
      tex2mml('\\csch(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\csch(x)" display="block">\n  <mi>csch</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Arc_2', () =>
    toXmlMatch(
      tex2mml('\\arccsc(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccsc(x)" display="block">\n  <mi>arccsc</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Arc_3', () =>
    toXmlMatch(
      tex2mml('\\acsc(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acsc(x)" display="block">\n  <mi>acsc</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Arc_4', () =>
    toXmlMatch(
      tex2mml('\\sec(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sec(x)" display="block">\n  <mi>sec</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Arc_5', () =>
    toXmlMatch(
      tex2mml('\\sech(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sech(x)" display="block">\n  <mi>sech</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Arc_6', () =>
    toXmlMatch(
      tex2mml('\\arcsec(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arcsec(x)" display="block">\n  <mi>arcsec</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Arc_7', () =>
    toXmlMatch(
      tex2mml('\\asec(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\asec(x)" display="block">\n  <mi>asec</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Arc_8', () =>
    toXmlMatch(
      tex2mml('\\cot(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cot(x)" display="block">\n  <mi>cot</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Arc_9', () =>
    toXmlMatch(
      tex2mml('\\coth(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\coth(x)" display="block">\n  <mi>coth</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Arc_10', () =>
    toXmlMatch(
      tex2mml('\\arccot(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccot(x)" display="block">\n  <mi>arccot</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Arc_11', () =>
    toXmlMatch(
      tex2mml('\\acot(x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acot(x)" display="block">\n  <mi>acot</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics3_2', () => {
  it('Operators_TrigLarge_0', () =>
    toXmlMatch(
      tex2mml('\\sin(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin(\\frac{x}{y})" display="block">\n  <mi>sin</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_TrigLarge_1', () =>
    toXmlMatch(
      tex2mml('\\sinh(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sinh(\\frac{x}{y})" display="block">\n  <mi>sinh</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_TrigLarge_2', () =>
    toXmlMatch(
      tex2mml('\\arcsin(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arcsin(\\frac{x}{y})" display="block">\n  <mi>arcsin</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_TrigLarge_3', () =>
    toXmlMatch(
      tex2mml('\\asin(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\asin(\\frac{x}{y})" display="block">\n  <mi>asin</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_TrigLarge_4', () =>
    toXmlMatch(
      tex2mml('\\cos(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cos(\\frac{x}{y})" display="block">\n  <mi>cos</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_TrigLarge_5', () =>
    toXmlMatch(
      tex2mml('\\cosh(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cosh(\\frac{x}{y})" display="block">\n  <mi>cosh</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_TrigLarge_6', () =>
    toXmlMatch(
      tex2mml('\\arccos(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccos(\\frac{x}{y})" display="block">\n  <mi>arccos</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_TrigLarge_7', () =>
    toXmlMatch(
      tex2mml('\\acos(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acos(\\frac{x}{y})" display="block">\n  <mi>acos</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_TrigLarge_8', () =>
    toXmlMatch(
      tex2mml('\\tan(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tan(\\frac{x}{y})" display="block">\n  <mi>tan</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_TrigLarge_9', () =>
    toXmlMatch(
      tex2mml('\\tanh(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tanh(\\frac{x}{y})" display="block">\n  <mi>tanh</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_TrigLarge_10', () =>
    toXmlMatch(
      tex2mml('\\arctan(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arctan(\\frac{x}{y})" display="block">\n  <mi>arctan</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_TrigLarge_11', () =>
    toXmlMatch(
      tex2mml('\\atan(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\atan(\\frac{x}{y})" display="block">\n  <mi>atan</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics3_3', () => {
  it('Operators_ArcLarge_0', () =>
    toXmlMatch(
      tex2mml('\\csc(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\csc(\\frac{x}{y})" display="block">\n  <mi>csc</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_ArcLarge_1', () =>
    toXmlMatch(
      tex2mml('\\csch(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\csch(\\frac{x}{y})" display="block">\n  <mi>csch</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_ArcLarge_2', () =>
    toXmlMatch(
      tex2mml('\\arccsc(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccsc(\\frac{x}{y})" display="block">\n  <mi>arccsc</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_ArcLarge_3', () =>
    toXmlMatch(
      tex2mml('\\acsc(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acsc(\\frac{x}{y})" display="block">\n  <mi>acsc</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_ArcLarge_4', () =>
    toXmlMatch(
      tex2mml('\\sec(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sec(\\frac{x}{y})" display="block">\n  <mi>sec</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_ArcLarge_5', () =>
    toXmlMatch(
      tex2mml('\\sech(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sech(\\frac{x}{y})" display="block">\n  <mi>sech</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_ArcLarge_6', () =>
    toXmlMatch(
      tex2mml('\\arcsec(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arcsec(\\frac{x}{y})" display="block">\n  <mi>arcsec</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_ArcLarge_7', () =>
    toXmlMatch(
      tex2mml('\\asec(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\asec(\\frac{x}{y})" display="block">\n  <mi>asec</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_ArcLarge_8', () =>
    toXmlMatch(
      tex2mml('\\cot(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cot(\\frac{x}{y})" display="block">\n  <mi>cot</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_ArcLarge_9', () =>
    toXmlMatch(
      tex2mml('\\coth(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\coth(\\frac{x}{y})" display="block">\n  <mi>coth</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_ArcLarge_10', () =>
    toXmlMatch(
      tex2mml('\\arccot(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccot(\\frac{x}{y})" display="block">\n  <mi>arccot</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_ArcLarge_11', () =>
    toXmlMatch(
      tex2mml('\\acot(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acot(\\frac{x}{y})" display="block">\n  <mi>acot</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics3_4', () => {
  it('Operators_Exp_0', () =>
    toXmlMatch(
      tex2mml('\\sin x'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin x" display="block">\n  <mi data-latex="\\sin">sin</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mi data-latex="x">x</mi>\n</math>'
    ));
  it('Operators_Exp_1', () =>
    toXmlMatch(
      tex2mml('\\sin{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin{x}" display="block">\n  <mi data-latex="\\sin">sin</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{x}">\n    <mi data-latex="x">x</mi>\n  </mrow>\n</math>'
    ));
  it('Operators_Exp_2', () =>
    toXmlMatch(
      tex2mml('\\sin[x]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[x]" display="block">\n  <msup data-latex="\\sin[x]">\n    <mi>sin</mi>\n    <mi data-latex="x">x</mi>\n  </msup>\n</math>'
    ));
  it('Operators_Exp_3', () =>
    toXmlMatch(
      tex2mml('\\sin[2]{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[2]{x}" display="block">\n  <msup data-latex="\\sin[2]">\n    <mi>sin</mi>\n    <mn data-latex="2">2</mn>\n  </msup>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{x}">\n    <mi data-latex="x">x</mi>\n  </mrow>\n</math>'
    ));
  it('Operators_Exp_4', () =>
    toXmlMatch(
      tex2mml('\\sin[2]x'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[2]x" display="block">\n  <msup data-latex="\\sin[2]">\n    <mi>sin</mi>\n    <mn data-latex="2">2</mn>\n  </msup>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mi data-latex="x">x</mi>\n</math>'
    ));
  it('Operators_Exp_5', () =>
    toXmlMatch(
      tex2mml('\\sin[2]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[2]" display="block">\n  <msup data-latex="\\sin[2]">\n    <mi>sin</mi>\n    <mn data-latex="2">2</mn>\n  </msup>\n</math>'
    ));
  it('Operators_Exp_6', () =>
    toXmlMatch(
      tex2mml('\\sin|\\frac{x}{y}|'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin|\\frac{x}{y}|" display="block">\n  <mi data-latex="\\sin">sin</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n</math>'
    ));
  it('Operators_Exp_7', () =>
    toXmlMatch(
      tex2mml('\\sin[\\frac{x}{y}]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[\\frac{x}{y}]" display="block">\n  <msup data-latex="\\sin[\\frac{x}{y}]">\n    <mi>sin</mi>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n  </msup>\n</math>'
    ));
  it('Operators_Exp_8', () =>
    toXmlMatch(
      tex2mml("\\sin['](\\frac{x}{y})"),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[\'](\\frac{x}{y})" display="block">\n  <msup>\n    <mi>sin</mi>\n    <msup data-latex="\'">\n      <mi></mi>\n      <mo data-mjx-alternate="1" data-latex="\'">&#x2032;</mo>\n    </msup>\n  </msup>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Exp_9', () =>
    toXmlMatch(
      tex2mml("\\sin[']{\\frac{x}{y}}"),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[\']{\\frac{x}{y}}" display="block">\n  <msup data-latex="\\sin[\']">\n    <mi>sin</mi>\n    <msup data-latex="\'">\n      <mi></mi>\n      <mo data-mjx-alternate="1" data-latex="\'">&#x2032;</mo>\n    </msup>\n  </msup>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n  </mrow>\n</math>'
    ));
  it('Operators_Exp_10', () =>
    toXmlMatch(
      tex2mml('\\sine(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sine(\\frac{x}{y})" display="block">\n  <mi data-latex="\\sine">sin</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Operators_Exp_11', () =>
    toXmlMatch(
      tex2mml('\\hypsine'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\hypsine" display="block">\n  <mi data-latex="\\hypsine">sinh</mi>\n</math>'
    ));
  it('Operators_Exp_12', () =>
    toXmlMatch(
      tex2mml('\\log[2](x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\log[2](x)" display="block">\n  <msup>\n    <mi>log</mi>\n    <mn data-latex="2">2</mn>\n  </msup>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Exp_13', () =>
    toXmlMatch(
      tex2mml('\\ln[2](x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ln[2](x)" display="block">\n  <msup>\n    <mi>ln</mi>\n    <mn data-latex="2">2</mn>\n  </msup>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Exp_14', () =>
    toXmlMatch(
      tex2mml('\\exp[2](x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\exp[2](x)" display="block">\n  <mi data-latex="\\exp">exp</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mn data-latex="2">2</mn>\n  <mo data-latex="]" stretchy="false">]</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="x">x</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Operators_Exp_15', () =>
    toXmlMatch(
      tex2mml('\\det[2](x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\det[2](x)" display="block">\n  <mi data-latex="\\det">det</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mn data-latex="2">2</mn>\n  <mo data-latex="]" stretchy="false">]</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="x">x</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Operators_Exp_16', () =>
    toXmlMatch(
      tex2mml('\\Pr[2](x)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Pr[2](x)" display="block">\n  <mi data-latex="\\Pr">Pr</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mn data-latex="2">2</mn>\n  <mo data-latex="]" stretchy="false">]</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="x">x</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
});

describe('Physics3_5', () => {
  it('Operators_Operators_0', () =>
    toXmlMatch(
      tex2mml('\\tr\\rho'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tr\\rho" display="block">\n  <mi data-latex="\\tr">tr</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mi data-latex="\\rho">&#x3C1;</mi>\n</math>'
    ));
  it('Operators_Operators_1', () =>
    toXmlMatch(
      tex2mml('\\tr(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tr(\\frac{x}{y})" display="block">\n  <mi>tr</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Operators_2', () =>
    toXmlMatch(
      tex2mml('\\tr[2](\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tr[2](\\frac{x}{y})" display="block">\n  <mi data-latex="\\tr">tr</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mn data-latex="2">2</mn>\n  <mo data-latex="]" stretchy="false">]</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Operators_Operators_3', () =>
    toXmlMatch(
      tex2mml('\\rank\\rho'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\rank\\rho" display="block">\n  <mi data-latex="\\rank">rank</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mi data-latex="\\rho">&#x3C1;</mi>\n</math>'
    ));
  it('Operators_Operators_4', () =>
    toXmlMatch(
      tex2mml('\\rank(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\rank(\\frac{x}{y})" display="block">\n  <mi data-latex="\\rank">rank</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Operators_Operators_5', () =>
    toXmlMatch(
      tex2mml('\\rank[2](\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\rank[2](\\frac{x}{y})" display="block">\n  <mi data-latex="\\rank">rank</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mn data-latex="2">2</mn>\n  <mo data-latex="]" stretchy="false">]</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Operators_Operators_6', () =>
    toXmlMatch(
      tex2mml('\\erf\\rho'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\erf\\rho" display="block">\n  <mi data-latex="\\erf">erf</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mi data-latex="\\rho">&#x3C1;</mi>\n</math>'
    ));
  it('Operators_Operators_7', () =>
    toXmlMatch(
      tex2mml('\\erf(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\erf(\\frac{x}{y})" display="block">\n  <mi>erf</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Operators_8', () =>
    toXmlMatch(
      tex2mml('\\erf[2](\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\erf[2](\\frac{x}{y})" display="block">\n  <mi data-latex="\\erf">erf</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mn data-latex="2">2</mn>\n  <mo data-latex="]" stretchy="false">]</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Operators_Operators_9', () =>
    toXmlMatch(
      tex2mml('\\Res\\rho'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res\\rho" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Res">\n    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mi data-latex="\\rho">&#x3C1;</mi>\n</math>'
    ));
  it('Operators_Operators_10', () =>
    toXmlMatch(
      tex2mml('\\Res(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res(\\frac{x}{y})" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Res}">\n    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Operators_11', () =>
    toXmlMatch(
      tex2mml('\\Res[\\frac{x}{y}]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res[\\frac{x}{y}]" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Res}">\n    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex="]">\n    <mo data-mjx-texclass="OPEN">[</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">]</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Operators_12', () =>
    toXmlMatch(
      tex2mml('\\Res{\\frac{x}{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res{\\frac{x}{y}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Res}">\n    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ \\frac{x}{y} \\right\\}" data-latex="\\left\\{ \\frac{x}{y} \\right\\}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Operators_13', () =>
    toXmlMatch(
      tex2mml('\\Res|\\frac{x}{y}|'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res|\\frac{x}{y}|" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Res">\n    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n</math>'
    ));
  it('Operators_Operators_14', () =>
    toXmlMatch(
      tex2mml('\\Res \\frac{x}{y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res \\frac{x}{y}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Res">\n    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n</math>'
    ));
  it('Operators_Operators_15', () =>
    toXmlMatch(
      tex2mml('\\Res[2](\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res[2](\\frac{x}{y})" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Res}">\n    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-latex="]">\n    <mo data-mjx-texclass="OPEN">[</mo>\n    <mn data-latex="2">2</mn>\n    <mo data-mjx-texclass="CLOSE">]</mo>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
});

describe('Physics3_6', () => {
  it('Operators_PV_0', () =>
    toXmlMatch(
      tex2mml('\\principalvalue{\\int f(z) \\dd{z}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\principalvalue{\\int f(z) \\dd{z}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\cal P}">\n    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mi data-latex="f">f</mi>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="z">z</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mi data-latex="z">z</mi>\n  </mrow>\n</math>'
    ));
  it('Operators_PV_1', () =>
    toXmlMatch(
      tex2mml('\\pv{\\int f(z) \\dd{z}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pv{\\int f(z) \\dd{z}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\cal P}">\n    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mi data-latex="f">f</mi>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="z">z</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mi data-latex="z">z</mi>\n  </mrow>\n</math>'
    ));
  it('Operators_PV_2', () =>
    toXmlMatch(
      tex2mml('\\pv{\\int f(z) \\dd{z}}a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pv{\\int f(z) \\dd{z}}a" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\cal P}">\n    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mi data-latex="f">f</mi>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="z">z</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mi data-latex="z">z</mi>\n  </mrow>\n  <mi data-latex="a">a</mi>\n</math>'
    ));
  it('Operators_PV_3', () =>
    toXmlMatch(
      tex2mml('\\pv\\int f(z) \\dd{z}a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pv\\int f(z) \\dd{z}a" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\pv">\n    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mi data-latex="f">f</mi>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="z">z</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mi data-latex="z">z</mi>\n  </mrow>\n  <mi data-latex="a">a</mi>\n</math>'
    ));
  it('Operators_PV_4', () =>
    toXmlMatch(
      tex2mml('\\pv(\\int f(z))'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pv(\\int f(z))" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\pv">\n    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mi data-latex="f">f</mi>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="z">z</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Operators_PV_5', () =>
    toXmlMatch(
      tex2mml('\\pv|\\int f(z)|'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pv|\\int f(z)|" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\pv">\n    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mi data-latex="f">f</mi>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="z">z</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n</math>'
    ));
  it('Operators_PV_6', () =>
    toXmlMatch(
      tex2mml('\\pv[\\int f(z)]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pv[\\int f(z)]" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\pv">\n    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mi data-latex="f">f</mi>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="z">z</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n  <mo data-latex="]" stretchy="false">]</mo>\n</math>'
    ));
  it('Operators_PV_7', () =>
    toXmlMatch(
      tex2mml('\\PV{\\int f(z) \\dd{z}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\PV{\\int f(z) \\dd{z}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\rm P.V.}">\n    <mi mathvariant="normal" data-latex="P">P</mi>\n    <mo data-latex=".">.</mo>\n    <mi mathvariant="normal" data-latex="V">V</mi>\n    <mo data-latex=".">.</mo>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mi data-latex="f">f</mi>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="z">z</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mi data-latex="z">z</mi>\n  </mrow>\n</math>'
    ));
  it('Operators_PV_8', () =>
    toXmlMatch(
      tex2mml('\\PV{\\int f(z) \\dd{z}}a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\PV{\\int f(z) \\dd{z}}a" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\rm P.V.}">\n    <mi mathvariant="normal" data-latex="P">P</mi>\n    <mo data-latex=".">.</mo>\n    <mi mathvariant="normal" data-latex="V">V</mi>\n    <mo data-latex=".">.</mo>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mi data-latex="f">f</mi>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="z">z</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mi data-latex="z">z</mi>\n  </mrow>\n  <mi data-latex="a">a</mi>\n</math>'
    ));
  it('Operators_PV_9', () =>
    toXmlMatch(
      tex2mml('\\PV\\int f(z) \\dd{z}a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\PV\\int f(z) \\dd{z}a" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\PV">\n    <mi mathvariant="normal" data-latex="P">P</mi>\n    <mo data-latex=".">.</mo>\n    <mi mathvariant="normal" data-latex="V">V</mi>\n    <mo data-latex=".">.</mo>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mi data-latex="f">f</mi>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mi data-latex="z">z</mi>\n  <mo data-latex=")" stretchy="false">)</mo>\n  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mi data-latex="z">z</mi>\n  </mrow>\n  <mi data-latex="a">a</mi>\n</math>'
    ));
});

describe('Physics3_7', () => {
  it('Operators_Imaginary_0', () =>
    toXmlMatch(
      tex2mml('\\Re\\rho'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re\\rho" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Re">\n    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mi data-latex="\\rho">&#x3C1;</mi>\n</math>'
    ));
  it('Operators_Imaginary_1', () =>
    toXmlMatch(
      tex2mml('\\Re(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re(\\frac{x}{y})" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Re">\n    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Operators_Imaginary_2', () =>
    toXmlMatch(
      tex2mml('\\Re[\\frac{x}{y}]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re[\\frac{x}{y}]" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Re">\n    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex="]" stretchy="false">]</mo>\n</math>'
    ));
  it('Operators_Imaginary_3', () =>
    toXmlMatch(
      tex2mml('\\Re{\\frac{x}{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re{\\frac{x}{y}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Re}">\n    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ \\frac{x}{y} \\right\\}" data-latex="\\left\\{ \\frac{x}{y} \\right\\}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Imaginary_4', () =>
    toXmlMatch(
      tex2mml('\\Re|\\frac{x}{y}|'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re|\\frac{x}{y}|" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Re">\n    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n</math>'
    ));
  it('Operators_Imaginary_5', () =>
    toXmlMatch(
      tex2mml('\\Re \\frac{x}{y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re \\frac{x}{y}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Re">\n    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n</math>'
    ));
  it('Operators_Imaginary_6', () =>
    toXmlMatch(
      tex2mml('\\Re[2](\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re[2](\\frac{x}{y})" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Re">\n    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mn data-latex="2">2</mn>\n  <mo data-latex="]" stretchy="false">]</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Operators_Imaginary_7', () =>
    toXmlMatch(
      tex2mml('\\real'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\real" display="block">\n  <mi mathvariant="normal" data-latex="\\real">&#x211C;</mi>\n</math>'
    ));
  it('Operators_Imaginary_8', () =>
    toXmlMatch(
      tex2mml('\\real{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\real{x}" display="block">\n  <mi mathvariant="normal" data-latex="\\real">&#x211C;</mi>\n  <mrow data-mjx-texclass="ORD" data-latex="{x}">\n    <mi data-latex="x">x</mi>\n  </mrow>\n</math>'
    ));
  it('Operators_Imaginary_9', () =>
    toXmlMatch(
      tex2mml('\\Im\\rho'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im\\rho" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Im">\n    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mi data-latex="\\rho">&#x3C1;</mi>\n</math>'
    ));
  it('Operators_Imaginary_10', () =>
    toXmlMatch(
      tex2mml('\\Im(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im(\\frac{x}{y})" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Im">\n    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Operators_Imaginary_11', () =>
    toXmlMatch(
      tex2mml('\\Im[\\frac{x}{y}]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im[\\frac{x}{y}]" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Im">\n    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex="]" stretchy="false">]</mo>\n</math>'
    ));
  it('Operators_Imaginary_12', () =>
    toXmlMatch(
      tex2mml('\\Im{\\frac{x}{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im{\\frac{x}{y}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Im}">\n    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ \\frac{x}{y} \\right\\}" data-latex="\\left\\{ \\frac{x}{y} \\right\\}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>\n  </mrow>\n</math>'
    ));
  it('Operators_Imaginary_13', () =>
    toXmlMatch(
      tex2mml('\\Im|\\frac{x}{y}|'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im|\\frac{x}{y}|" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Im">\n    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n</math>'
    ));
  it('Operators_Imaginary_14', () =>
    toXmlMatch(
      tex2mml('\\Im \\frac{x}{y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im \\frac{x}{y}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Im">\n    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n</math>'
    ));
  it('Operators_Imaginary_15', () =>
    toXmlMatch(
      tex2mml('\\Im[2](\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im[2](\\frac{x}{y})" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\Im">\n    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>\n  </mrow>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mo data-latex="[" stretchy="false">[</mo>\n  <mn data-latex="2">2</mn>\n  <mo data-latex="]" stretchy="false">]</mo>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Operators_Imaginary_16', () =>
    toXmlMatch(
      tex2mml('\\imaginary'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\imaginary" display="block">\n  <mi mathvariant="normal" data-latex="\\imaginary">&#x2111;</mi>\n</math>'
    ));
  it('Operators_Imaginary_17', () =>
    toXmlMatch(
      tex2mml('\\imaginary{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\imaginary{x}" display="block">\n  <mi mathvariant="normal" data-latex="\\imaginary">&#x2111;</mi>\n  <mrow data-mjx-texclass="ORD" data-latex="{x}">\n    <mi data-latex="x">x</mi>\n  </mrow>\n</math>'
    ));
});

describe('Physics4_0', () => {
  it('QuickQuad_0_0', () =>
    toXmlMatch(
      tex2mml('\\qcc'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qcc" display="block">\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n  <mtext data-latex="\\text{c.c.}">c.c.</mtext>\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n</math>'
    ));
  it('QuickQuad_0_1', () =>
    toXmlMatch(
      tex2mml('\\qand'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qand" display="block">\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n  <mtext data-latex="\\text{and}">and</mtext>\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n</math>'
    ));
  it('QuickQuad_0_2', () =>
    toXmlMatch(
      tex2mml('a\\qc b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\qc b" display="block">\n  <mi data-latex="\\qqtext*{,}">a</mi>\n  <mtext data-latex="\\text{,}">,</mtext>\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('QuickQuad_0_3', () =>
    toXmlMatch(
      tex2mml('a\\qqtext{hello}b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\qqtext{hello}b" display="block">\n  <mi data-latex="\\qqtext{hello}">a</mi>\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n  <mtext data-latex="\\text{hello}">hello</mtext>\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('QuickQuad_0_4', () =>
    toXmlMatch(
      tex2mml('a\\qqtext*{hello}b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\qqtext*{hello}b" display="block">\n  <mi data-latex="\\qqtext*{hello}">a</mi>\n  <mtext data-latex="\\text{hello}">hello</mtext>\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('QuickQuad_0_5', () =>
    toXmlMatch(
      tex2mml('a\\qqtext ab'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\qqtext ab" display="block">\n  <mi data-latex="\\qqtext a">a</mi>\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n  <mtext data-latex="\\text{a}">a</mtext>\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('QuickQuad_0_6', () =>
    toXmlMatch(
      tex2mml('a\\qqtext* ab'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\qqtext* ab" display="block">\n  <mi data-latex="\\qqtext* a">a</mi>\n  <mtext data-latex="\\text{a}">a</mtext>\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('QuickQuad_0_7', () =>
    toXmlMatch(
      tex2mml('three\\qif two'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="three\\qif two" display="block">\n  <mi data-latex="t">t</mi>\n  <mi data-latex="h">h</mi>\n  <mi data-latex="r">r</mi>\n  <mi data-latex="e">e</mi>\n  <mi data-latex="\\qif">e</mi>\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n  <mtext data-latex="\\text{if}">if</mtext>\n  <mstyle scriptlevel="0" data-latex="\\quad">\n    <mspace width="1em"></mspace>\n  </mstyle>\n  <mi data-latex="t">t</mi>\n  <mi data-latex="w">w</mi>\n  <mi data-latex="o">o</mi>\n</math>'
    ));
});

describe('Physics5_0', () => {
  it('Derivatives_Deriv_0', () =>
    toXmlMatch(
      tex2mml('\\dv x'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv x" display="block">\n  <mfrac data-latex="\\dv x">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mrow data-latex="\\diffd x  ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Deriv_1', () =>
    toXmlMatch(
      tex2mml('\\dv x(ll)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv x(ll)" display="block">\n  <mfrac data-latex="\\frac{\\diffd }{\\diffd x  }">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mrow data-latex="\\diffd x  ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="l">l</mi>\n    <mi data-latex="l">l</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Deriv_2', () =>
    toXmlMatch(
      tex2mml('\\dv{x}{y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv{x}{y}" display="block">\n  <mfrac data-latex="\\dv{x}{y}">\n    <mrow data-latex="\\diffd x">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mi data-latex="x">x</mi>\n    </mrow>\n    <mrow data-latex="\\diffd y  ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mi data-latex="y">y</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Deriv_3', () =>
    toXmlMatch(
      tex2mml('\\dv[n]{f}{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv[n]{f}{x}" display="block">\n  <mfrac data-latex="\\dv[n]{f}{x}">\n    <mrow data-latex="\\diffd^{n}f">\n      <msup data-latex="\\diffd^{n}">\n        <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n          <mi mathvariant="normal" data-latex="d">d</mi>\n        </mrow>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\diffd x^{n} ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <msup data-latex="x^{n}">\n        <mi data-latex="x">x</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Deriv_4', () =>
    toXmlMatch(
      tex2mml('\\dv{f}{x}{y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv{f}{x}{y}" display="block">\n  <mfrac data-latex="\\dv{f}{x}">\n    <mrow data-latex="\\diffd f">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\diffd x  ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n  <mrow data-mjx-texclass="ORD" data-latex="{y}">\n    <mi data-latex="y">y</mi>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Deriv_5', () =>
    toXmlMatch(
      tex2mml('\\dv{f}{x}y'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv{f}{x}y" display="block">\n  <mfrac data-latex="\\dv{f}{x}">\n    <mrow data-latex="\\diffd f">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\diffd x  ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n  <mi data-latex="y">y</mi>\n</math>'
    ));
  it('Derivatives_Deriv_6', () =>
    toXmlMatch(
      tex2mml('\\dv{x}y'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv{x}y" display="block">\n  <mfrac data-latex="\\dv{x}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mrow data-latex="\\diffd x  ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n  <mi data-latex="y">y</mi>\n</math>'
    ));
  it('Derivatives_Deriv_7', () =>
    toXmlMatch(
      tex2mml('\\dv[n]{f}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv[n]{f}(\\frac{x}{y})" display="block">\n  <mfrac data-latex="\\frac{\\diffd^{n}}{\\diffd f^{n} }">\n    <msup data-latex="\\diffd^{n}">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="{n}">\n        <mi data-latex="n">n</mi>\n      </mrow>\n    </msup>\n    <mrow data-latex="\\diffd f^{n} ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <msup data-latex="f^{n}">\n        <mi data-latex="f">f</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Deriv_8', () =>
    toXmlMatch(
      tex2mml('\\dv[n]{f}{x}{y}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv[n]{f}{x}{y}(\\frac{x}{y})" display="block">\n  <mfrac data-latex="\\dv[n]{f}{x}">\n    <mrow data-latex="\\diffd^{n}f">\n      <msup data-latex="\\diffd^{n}">\n        <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n          <mi mathvariant="normal" data-latex="d">d</mi>\n        </mrow>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\diffd x^{n} ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <msup data-latex="x^{n}">\n        <mi data-latex="x">x</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n  <mrow data-mjx-texclass="ORD" data-latex="{y}">\n    <mi data-latex="y">y</mi>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Derivatives_Deriv_9', () =>
    toXmlMatch(
      tex2mml('\\dv*[n]{f}{x}{y}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv*[n]{f}{x}{y}(\\frac{x}{y})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\diffd^{n}f\\middle/\\diffd x^{n} \\right." data-latex="\\left.\\diffd^{n}f\\middle/\\diffd x^{n} \\right.">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <msup data-latex="\\diffd^{n}">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="{n}">\n        <mi data-latex="n">n</mi>\n      </mrow>\n    </msup>\n    <mi data-latex="f">f</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <msup data-latex="x^{n}">\n      <mi data-latex="x">x</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{n}">\n        <mi data-latex="n">n</mi>\n      </mrow>\n    </msup>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{y}">\n    <mi data-latex="y">y</mi>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Derivatives_Deriv_10', () =>
    toXmlMatch(
      tex2mml('\\dv*[]{f}{x}{y}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv*[]{f}{x}{y}(\\frac{x}{y})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\diffd^{}f\\middle/\\diffd x^{} \\right." data-latex="\\left.\\diffd^{}f\\middle/\\diffd x^{} \\right.">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <msup data-latex="\\diffd^{}">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n    </msup>\n    <mi data-latex="f">f</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <msup data-latex="x^{}">\n      <mi data-latex="x">x</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n    </msup>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{y}">\n    <mi data-latex="y">y</mi>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Derivatives_Deriv_11', () =>
    toXmlMatch(
      tex2mml('\\dv[]{f}{x}{y}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv[]{f}{x}{y}(\\frac{x}{y})" display="block">\n  <mfrac data-latex="\\dv[]{f}{x}">\n    <mrow data-latex="\\diffd^{}f">\n      <msup data-latex="\\diffd^{}">\n        <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n          <mi mathvariant="normal" data-latex="d">d</mi>\n        </mrow>\n        <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n      </msup>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\diffd x^{} ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <msup data-latex="x^{}">\n        <mi data-latex="x">x</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n  <mrow data-mjx-texclass="ORD" data-latex="{y}">\n    <mi data-latex="y">y</mi>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Derivatives_Deriv_12', () =>
    toXmlMatch(
      tex2mml('\\dv[5](\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv[5](\\frac{x}{y})" display="block">\n  <mfrac data-latex="\\dv[5](">\n    <msup data-latex="\\diffd^{5}">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="{5}">\n        <mn data-latex="5">5</mn>\n      </mrow>\n    </msup>\n    <mrow data-latex="\\diffd (^{5} ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <msup data-latex="(^{5}">\n        <mo data-latex="(" stretchy="false">(</mo>\n        <mrow data-mjx-texclass="ORD" data-latex="{5}">\n          <mn data-latex="5">5</mn>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Derivatives_Deriv_13', () =>
    toXmlMatch(
      tex2mml('\\dv[5]{f}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv[5]{f}" display="block">\n  <mfrac data-latex="\\dv[5]{f}">\n    <msup data-latex="\\diffd^{5}">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="{5}">\n        <mn data-latex="5">5</mn>\n      </mrow>\n    </msup>\n    <mrow data-latex="\\diffd f^{5} ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <msup data-latex="f^{5}">\n        <mi data-latex="f">f</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{5}">\n          <mn data-latex="5">5</mn>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Deriv_14', () =>
    toXmlMatch(
      tex2mml('\\dv{f}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv{f}" display="block">\n  <mfrac data-latex="\\dv{f}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mrow data-latex="\\diffd f  ">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mi data-latex="f">f</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
});

describe('Physics5_1', () => {
  it('Derivatives_Partial_0', () =>
    toXmlMatch(
      tex2mml('\\flatfrac{x}{y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\flatfrac{x}{y}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.x\\middle/y\\right." data-latex="\\left.x\\middle/y\\right.">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <mi data-latex="x">x</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mi data-latex="y">y</mi>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Partial_1', () =>
    toXmlMatch(
      tex2mml('\\flatfrac{x^2}{y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\flatfrac{x^2}{y}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.x^2 \\middle/y\\right." data-latex="\\left.x^2 \\middle/y\\right.">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <msup data-latex="x^2">\n      <mi data-latex="x">x</mi>\n      <mn data-latex="2">2</mn>\n    </msup>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mi data-latex="y">y</mi>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Partial_2', () =>
    toXmlMatch(
      tex2mml('\\pdv x'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv x" display="block">\n  <mfrac data-latex="\\pdv x">\n    <mi data-latex="\\partial ">&#x2202;</mi>\n    <mrow data-latex="\\partial x  ">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Partial_3', () =>
    toXmlMatch(
      tex2mml('\\pdv x(ll)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv x(ll)" display="block">\n  <mfrac data-latex="\\frac{\\partial }{\\partial x  }">\n    <mi data-latex="\\partial ">&#x2202;</mi>\n    <mrow data-latex="\\partial x  ">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="l">l</mi>\n    <mi data-latex="l">l</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Partial_4', () =>
    toXmlMatch(
      tex2mml('\\pdv{f}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv{f}" display="block">\n  <mfrac data-latex="\\pdv{f}">\n    <mi data-latex="\\partial ">&#x2202;</mi>\n    <mrow data-latex="\\partial f  ">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="f">f</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Partial_5', () =>
    toXmlMatch(
      tex2mml('\\pdv{x}{y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv{x}{y}" display="block">\n  <mfrac data-latex="\\pdv{x}{y}">\n    <mrow data-latex="\\partial x">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="x">x</mi>\n    </mrow>\n    <mrow data-latex="\\partial y  ">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="y">y</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Partial_6', () =>
    toXmlMatch(
      tex2mml('\\pdv[n]{f}{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv[n]{f}{x}" display="block">\n  <mfrac data-latex="\\pdv[n]{f}{x}">\n    <mrow data-latex="\\partial^{n}f">\n      <msup data-latex="\\partial^{n}">\n        <mi data-latex="\\partial">&#x2202;</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\partial x^{n} ">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <msup data-latex="x^{n}">\n        <mi data-latex="x">x</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Partial_7', () =>
    toXmlMatch(
      tex2mml('\\pdv{f}{x}{y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv{f}{x}{y}" display="block">\n  <mfrac data-latex="\\pdv{f}{x}{y}">\n    <mrow data-latex="\\partial^{2}f">\n      <msup data-latex="\\partial^{2}">\n        <mi data-latex="\\partial">&#x2202;</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{2}">\n          <mn data-latex="2">2</mn>\n        </mrow>\n      </msup>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\partial x  \\partial y">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="x">x</mi>\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="y">y</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Partial_8', () =>
    toXmlMatch(
      tex2mml('\\pdv{f}{x}y'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv{f}{x}y" display="block">\n  <mfrac data-latex="\\pdv{f}{x}">\n    <mrow data-latex="\\partial f">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\partial x  ">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n  <mi data-latex="y">y</mi>\n</math>'
    ));
  it('Derivatives_Partial_9', () =>
    toXmlMatch(
      tex2mml('\\pdv{x}y'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv{x}y" display="block">\n  <mfrac data-latex="\\pdv{x}">\n    <mi data-latex="\\partial ">&#x2202;</mi>\n    <mrow data-latex="\\partial x  ">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n  <mi data-latex="y">y</mi>\n</math>'
    ));
  it('Derivatives_Partial_10', () =>
    toXmlMatch(
      tex2mml('\\pdv*{f}{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv*{f}{x}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\partial f\\middle/\\partial x  \\right." data-latex="\\pdv*{f}{x}">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <mi data-latex="\\partial">&#x2202;</mi>\n    <mi data-latex="f">f</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mi data-latex="\\partial">&#x2202;</mi>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Partial_11', () =>
    toXmlMatch(
      tex2mml('\\pdv*[3]{f}{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv*[3]{f}{x}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\partial^{3}f\\middle/\\partial x^{3} \\right." data-latex="\\pdv*[3]{f}{x}">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <msup data-latex="\\partial^{3}">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{3}">\n        <mn data-latex="3">3</mn>\n      </mrow>\n    </msup>\n    <mi data-latex="f">f</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mi data-latex="\\partial">&#x2202;</mi>\n    <msup data-latex="x^{3}">\n      <mi data-latex="x">x</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{3}">\n        <mn data-latex="3">3</mn>\n      </mrow>\n    </msup>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Partial_12', () =>
    toXmlMatch(
      tex2mml('\\pdv[n]{f}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv[n]{f}(\\frac{x}{y})" display="block">\n  <mfrac data-latex="\\frac{\\partial^{n}}{\\partial f^{n} }">\n    <msup data-latex="\\partial^{n}">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{n}">\n        <mi data-latex="n">n</mi>\n      </mrow>\n    </msup>\n    <mrow data-latex="\\partial f^{n} ">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <msup data-latex="f^{n}">\n        <mi data-latex="f">f</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Partial_13', () =>
    toXmlMatch(
      tex2mml('\\pdv[n]{f}{x}{y}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv[n]{f}{x}{y}(\\frac{x}{y})" display="block">\n  <mfrac data-latex="\\pdv[n]{f}{x}{y}(\\frac{x}{y})">\n    <mrow data-latex="\\partial^{2}f">\n      <msup data-latex="\\partial^{2}">\n        <mi data-latex="\\partial">&#x2202;</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{2}">\n          <mn data-latex="2">2</mn>\n        </mrow>\n      </msup>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\partial x  \\partial y">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="x">x</mi>\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="y">y</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Partial_14', () =>
    toXmlMatch(
      tex2mml('\\pdv*[n]{f}{x}{y}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv*[n]{f}{x}{y}(\\frac{x}{y})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\partial^{2}f\\middle/\\partial x  \\partial y\\right." data-latex="\\pdv*[n]{f}{x}{y}(\\frac{x}{y})">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <msup data-latex="\\partial^{2}">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{2}">\n        <mn data-latex="2">2</mn>\n      </mrow>\n    </msup>\n    <mi data-latex="f">f</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mi data-latex="\\partial">&#x2202;</mi>\n    <mi data-latex="x">x</mi>\n    <mi data-latex="\\partial">&#x2202;</mi>\n    <mi data-latex="y">y</mi>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Partial_15', () =>
    toXmlMatch(
      tex2mml('\\pdv*[]{f}{x}{y}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv*[]{f}{x}{y}(\\frac{x}{y})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\partial^{2}f\\middle/\\partial x  \\partial y\\right." data-latex="\\pdv*[]{f}{x}{y}(\\frac{x}{y})">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <msup data-latex="\\partial^{2}">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{2}">\n        <mn data-latex="2">2</mn>\n      </mrow>\n    </msup>\n    <mi data-latex="f">f</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mi data-latex="\\partial">&#x2202;</mi>\n    <mi data-latex="x">x</mi>\n    <mi data-latex="\\partial">&#x2202;</mi>\n    <mi data-latex="y">y</mi>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Partial_16', () =>
    toXmlMatch(
      tex2mml('\\pdv[]{f}{x}{y}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv[]{f}{x}{y}(\\frac{x}{y})" display="block">\n  <mfrac data-latex="\\pdv[]{f}{x}{y}(\\frac{x}{y})">\n    <mrow data-latex="\\partial^{2}f">\n      <msup data-latex="\\partial^{2}">\n        <mi data-latex="\\partial">&#x2202;</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{2}">\n          <mn data-latex="2">2</mn>\n        </mrow>\n      </msup>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\partial x  \\partial y">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="x">x</mi>\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mi data-latex="y">y</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Partial_17', () =>
    toXmlMatch(
      tex2mml('\\pdv[5](\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv[5](\\frac{x}{y})" display="block">\n  <mfrac data-latex="\\pdv[5](">\n    <msup data-latex="\\partial^{5}">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{5}">\n        <mn data-latex="5">5</mn>\n      </mrow>\n    </msup>\n    <mrow data-latex="\\partial (^{5} ">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <msup data-latex="(^{5}">\n        <mo data-latex="(" stretchy="false">(</mo>\n        <mrow data-mjx-texclass="ORD" data-latex="{5}">\n          <mn data-latex="5">5</mn>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Derivatives_Partial_18', () =>
    toXmlMatch(
      tex2mml('\\pdv[5]{f}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv[5]{f}" display="block">\n  <mfrac data-latex="\\pdv[5]{f}">\n    <msup data-latex="\\partial^{5}">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{5}">\n        <mn data-latex="5">5</mn>\n      </mrow>\n    </msup>\n    <mrow data-latex="\\partial f^{5} ">\n      <mi data-latex="\\partial">&#x2202;</mi>\n      <msup data-latex="f^{5}">\n        <mi data-latex="f">f</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{5}">\n          <mn data-latex="5">5</mn>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n</math>'
    ));
});

describe('Physics5_2', () => {
  it('Derivatives_Functional_0', () =>
    toXmlMatch(
      tex2mml('\\fdv x'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv x" display="block">\n  <mfrac data-latex="\\fdv x">\n    <mi data-latex="\\delta ">&#x3B4;</mi>\n    <mrow data-latex="\\delta x  ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Functional_1', () =>
    toXmlMatch(
      tex2mml('\\fdv x(ll)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv x(ll)" display="block">\n  <mfrac data-latex="\\frac{\\delta }{\\delta x  }">\n    <mi data-latex="\\delta ">&#x3B4;</mi>\n    <mrow data-latex="\\delta x  ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="l">l</mi>\n    <mi data-latex="l">l</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Functional_2', () =>
    toXmlMatch(
      tex2mml('\\fdv{x}{y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv{x}{y}" display="block">\n  <mfrac data-latex="\\fdv{x}{y}">\n    <mrow data-latex="\\delta x">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mi data-latex="x">x</mi>\n    </mrow>\n    <mrow data-latex="\\delta y  ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mi data-latex="y">y</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Functional_3', () =>
    toXmlMatch(
      tex2mml('\\fdv{f}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv{f}" display="block">\n  <mfrac data-latex="\\fdv{f}">\n    <mi data-latex="\\delta ">&#x3B4;</mi>\n    <mrow data-latex="\\delta f  ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mi data-latex="f">f</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Functional_4', () =>
    toXmlMatch(
      tex2mml('\\fdv[n]{f}{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv[n]{f}{x}" display="block">\n  <mfrac data-latex="\\fdv[n]{f}{x}">\n    <mrow data-latex="\\delta^{n}f">\n      <msup data-latex="\\delta^{n}">\n        <mi data-latex="\\delta">&#x3B4;</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\delta x^{n} ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <msup data-latex="x^{n}">\n        <mi data-latex="x">x</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Functional_5', () =>
    toXmlMatch(
      tex2mml('\\fdv{f}{x}{y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv{f}{x}{y}" display="block">\n  <mfrac data-latex="\\fdv{f}{x}">\n    <mrow data-latex="\\delta f">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\delta x  ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n  <mrow data-mjx-texclass="ORD" data-latex="{y}">\n    <mi data-latex="y">y</mi>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Functional_6', () =>
    toXmlMatch(
      tex2mml('\\fdv{f}{x}y'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv{f}{x}y" display="block">\n  <mfrac data-latex="\\fdv{f}{x}">\n    <mrow data-latex="\\delta f">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\delta x  ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n  <mi data-latex="y">y</mi>\n</math>'
    ));
  it('Derivatives_Functional_7', () =>
    toXmlMatch(
      tex2mml('\\fdv{x}y'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv{x}y" display="block">\n  <mfrac data-latex="\\fdv{x}">\n    <mi data-latex="\\delta ">&#x3B4;</mi>\n    <mrow data-latex="\\delta x  ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n  <mi data-latex="y">y</mi>\n</math>'
    ));
  it('Derivatives_Functional_8', () =>
    toXmlMatch(
      tex2mml('\\functionalderivative*{F}{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\functionalderivative*{F}{x}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\delta F\\middle/\\delta x  \\right." data-latex="\\functionalderivative*{F}{x}">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="F">F</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Functional_9', () =>
    toXmlMatch(
      tex2mml('\\fderivative*{F}{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fderivative*{F}{x}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\delta F\\middle/\\delta x  \\right." data-latex="\\fderivative*{F}{x}">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="F">F</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Functional_10', () =>
    toXmlMatch(
      tex2mml('\\fdv*{F}{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv*{F}{x}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\delta F\\middle/\\delta x  \\right." data-latex="\\fdv*{F}{x}">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="F">F</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Functional_11', () =>
    toXmlMatch(
      tex2mml('\\fdv{F}{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv{F}{x}" display="block">\n  <mfrac data-latex="\\fdv{F}{x}">\n    <mrow data-latex="\\delta F">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mi data-latex="F">F</mi>\n    </mrow>\n    <mrow data-latex="\\delta x  ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mi data-latex="x">x</mi>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Functional_12', () =>
    toXmlMatch(
      tex2mml('\\fdv[2]{F}{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv[2]{F}{x}" display="block">\n  <mfrac data-latex="\\fdv[2]{F}{x}">\n    <mrow data-latex="\\delta^{2}F">\n      <msup data-latex="\\delta^{2}">\n        <mi data-latex="\\delta">&#x3B4;</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{2}">\n          <mn data-latex="2">2</mn>\n        </mrow>\n      </msup>\n      <mi data-latex="F">F</mi>\n    </mrow>\n    <mrow data-latex="\\delta x^{2} ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <msup data-latex="x^{2}">\n        <mi data-latex="x">x</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{2}">\n          <mn data-latex="2">2</mn>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Derivatives_Functional_13', () =>
    toXmlMatch(
      tex2mml('\\fdv[n]{f}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv[n]{f}(\\frac{x}{y})" display="block">\n  <mfrac data-latex="\\frac{\\delta^{n}}{\\delta f^{n} }">\n    <msup data-latex="\\delta^{n}">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{n}">\n        <mi data-latex="n">n</mi>\n      </mrow>\n    </msup>\n    <mrow data-latex="\\delta f^{n} ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <msup data-latex="f^{n}">\n        <mi data-latex="f">f</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Functional_14', () =>
    toXmlMatch(
      tex2mml('\\fdv[n]{f}{x}{y}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv[n]{f}{x}{y}(\\frac{x}{y})" display="block">\n  <mfrac data-latex="\\fdv[n]{f}{x}">\n    <mrow data-latex="\\delta^{n}f">\n      <msup data-latex="\\delta^{n}">\n        <mi data-latex="\\delta">&#x3B4;</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\delta x^{n} ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <msup data-latex="x^{n}">\n        <mi data-latex="x">x</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{n}">\n          <mi data-latex="n">n</mi>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n  <mrow data-mjx-texclass="ORD" data-latex="{y}">\n    <mi data-latex="y">y</mi>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Derivatives_Functional_15', () =>
    toXmlMatch(
      tex2mml('\\fdv*[n]{f}{x}{y}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv*[n]{f}{x}{y}(\\frac{x}{y})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\delta^{n}f\\middle/\\delta x^{n} \\right." data-latex="\\left.\\delta^{n}f\\middle/\\delta x^{n} \\right.">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <msup data-latex="\\delta^{n}">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{n}">\n        <mi data-latex="n">n</mi>\n      </mrow>\n    </msup>\n    <mi data-latex="f">f</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <msup data-latex="x^{n}">\n      <mi data-latex="x">x</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{n}">\n        <mi data-latex="n">n</mi>\n      </mrow>\n    </msup>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{y}">\n    <mi data-latex="y">y</mi>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Derivatives_Functional_16', () =>
    toXmlMatch(
      tex2mml('\\fdv*[]{f}{x}{y}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv*[]{f}{x}{y}(\\frac{x}{y})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\delta^{}f\\middle/\\delta x^{} \\right." data-latex="\\left.\\delta^{}f\\middle/\\delta x^{} \\right.">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>\n    <msup data-latex="\\delta^{}">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n    </msup>\n    <mi data-latex="f">f</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <msup data-latex="x^{}">\n      <mi data-latex="x">x</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n    </msup>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{y}">\n    <mi data-latex="y">y</mi>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Derivatives_Functional_17', () =>
    toXmlMatch(
      tex2mml('\\fdv[]{f}{x}{y}(\\frac{x}{y})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv[]{f}{x}{y}(\\frac{x}{y})" display="block">\n  <mfrac data-latex="\\fdv[]{f}{x}">\n    <mrow data-latex="\\delta^{}f">\n      <msup data-latex="\\delta^{}">\n        <mi data-latex="\\delta">&#x3B4;</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n      </msup>\n      <mi data-latex="f">f</mi>\n    </mrow>\n    <mrow data-latex="\\delta x^{} ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <msup data-latex="x^{}">\n        <mi data-latex="x">x</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n  <mrow data-mjx-texclass="ORD" data-latex="{y}">\n    <mi data-latex="y">y</mi>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{x}{y}">\n    <mi data-latex="x">x</mi>\n    <mi data-latex="y">y</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Derivatives_Functional_18', () =>
    toXmlMatch(
      tex2mml('\\fdv[5]{f}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv[5]{f}" display="block">\n  <mfrac data-latex="\\fdv[5]{f}">\n    <msup data-latex="\\delta^{5}">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{5}">\n        <mn data-latex="5">5</mn>\n      </mrow>\n    </msup>\n    <mrow data-latex="\\delta f^{5} ">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <msup data-latex="f^{5}">\n        <mi data-latex="f">f</mi>\n        <mrow data-mjx-texclass="ORD" data-latex="{5}">\n          <mn data-latex="5">5</mn>\n        </mrow>\n      </msup>\n    </mrow>\n  </mfrac>\n</math>'
    ));
});

describe('Physics5_3', () => {
  it('Derivatives_Var_0', () =>
    toXmlMatch(
      tex2mml('\\var A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var A" display="block">\n  <mi data-latex="\\delta">&#x3B4;</mi>\n  <mi data-latex="\\var A">A</mi>\n</math>'
    ));
  it('Derivatives_Var_1', () =>
    toXmlMatch(
      tex2mml('\\var{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var{A}" display="block">\n  <mrow data-mjx-texclass="OP" data-latex="\\var{A}">\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="A">A</mi>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Var_2', () =>
    toXmlMatch(
      tex2mml('\\var{A}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var{A}{B}" display="block">\n  <mrow data-mjx-texclass="OP" data-latex="\\var{A}">\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{B}">\n    <mi data-latex="B">B</mi>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Var_3', () =>
    toXmlMatch(
      tex2mml('\\var[4]{A} B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var[4]{A} B" display="block">\n  <mrow data-mjx-texclass="OP" data-latex="\\var[4]{A}">\n    <msup data-latex="\\delta^{4}">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{4}">\n        <mn data-latex="4">4</mn>\n      </mrow>\n    </msup>\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mi data-latex="B">B</mi>\n</math>'
    ));
  it('Derivatives_Var_4', () =>
    toXmlMatch(
      tex2mml('\\var{F[g(x)]}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var{F[g(x)]}" display="block">\n  <mrow data-mjx-texclass="OP" data-latex="\\var{F[g(x)]}">\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="F">F</mi>\n    <mo data-latex="[" stretchy="false">[</mo>\n    <mi data-latex="g">g</mi>\n    <mo data-latex="(" stretchy="false">(</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-latex=")" stretchy="false">)</mo>\n    <mo data-latex="]" stretchy="false">]</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Var_5', () =>
    toXmlMatch(
      tex2mml('\\var(E-TS)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var(E-TS)" display="block">\n  <mi data-latex="\\delta ">&#x3B4;</mi>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mi data-latex="E">E</mi>\n    <mo data-latex="-">&#x2212;</mo>\n    <mi data-latex="T">T</mi>\n    <mi data-latex="S">S</mi>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Var_6', () =>
    toXmlMatch(
      tex2mml('\\var{F[g(\\frac{x}{y})]}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var{F[g(\\frac{x}{y})]}" display="block">\n  <mrow data-mjx-texclass="OP" data-latex="\\var{F[g(\\frac{x}{y})]}">\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="F">F</mi>\n    <mo data-latex="[" stretchy="false">[</mo>\n    <mi data-latex="g">g</mi>\n    <mo data-latex="(" stretchy="false">(</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-latex=")" stretchy="false">)</mo>\n    <mo data-latex="]" stretchy="false">]</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Var_7', () =>
    toXmlMatch(
      tex2mml('\\var{F[g\\left(\\frac{x}{y}\\right)]}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var{F[g\\left(\\frac{x}{y}\\right)]}" display="block">\n  <mrow data-mjx-texclass="OP" data-latex="\\var{F[g\\left(\\frac{x}{y}\\right)]}">\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="F">F</mi>\n    <mo data-latex="[" stretchy="false">[</mo>\n    <mi data-latex="g">g</mi>\n    <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\frac{x}{y}\\right)" data-latex="\\left(\\frac{x}{y}\\right)">\n      <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n      <mfrac data-latex="\\frac{x}{y}">\n        <mi data-latex="x">x</mi>\n        <mi data-latex="y">y</mi>\n      </mfrac>\n      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n    </mrow>\n    <mo data-latex="]" stretchy="false">]</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Var_8', () =>
    toXmlMatch(
      tex2mml('\\var(\\frac{a}{b})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var(\\frac{a}{b})" display="block">\n  <mi data-latex="\\delta ">&#x3B4;</mi>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Var_9', () =>
    toXmlMatch(
      tex2mml('A \\var A B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\var A B" display="block">\n  <mi data-latex="A">A</mi>\n  <mi data-latex="\\delta">&#x3B4;</mi>\n  <mi data-latex="\\var A">A</mi>\n  <mi data-latex="B">B</mi>\n</math>'
    ));
  it('Derivatives_Var_10', () =>
    toXmlMatch(
      tex2mml('A \\var{A} B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\var{A} B" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="OP" data-latex="\\var{A}">\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mi data-latex="B">B</mi>\n</math>'
    ));
  it('Derivatives_Var_11', () =>
    toXmlMatch(
      tex2mml('A \\var{A}{B} B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\var{A}{B} B" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="OP" data-latex="\\var{A}">\n    <mi data-latex="\\delta">&#x3B4;</mi>\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{B}">\n    <mi data-latex="B">B</mi>\n  </mrow>\n  <mi data-latex="B">B</mi>\n</math>'
    ));
  it('Derivatives_Var_12', () =>
    toXmlMatch(
      tex2mml('A \\var[4]{A} B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\var[4]{A} B" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="OP" data-latex="\\var[4]{A}">\n    <msup data-latex="\\delta^{4}">\n      <mi data-latex="\\delta">&#x3B4;</mi>\n      <mrow data-mjx-texclass="ORD" data-latex="{4}">\n        <mn data-latex="4">4</mn>\n      </mrow>\n    </msup>\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mi data-latex="B">B</mi>\n</math>'
    ));
});

describe('Physics5_4', () => {
  it('Derivatives_Differ_0', () =>
    toXmlMatch(
      tex2mml('\\dd'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\dd">\n    <mi mathvariant="normal" data-latex="d">d</mi>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Differ_1', () =>
    toXmlMatch(
      tex2mml('\\dd x'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd x" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n    <mi mathvariant="normal" data-latex="d">d</mi>\n  </mrow>\n  <mi data-latex="\\dd x">x</mi>\n</math>'
    ));
  it('Derivatives_Differ_2', () =>
    toXmlMatch(
      tex2mml('\\dd{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd{x}" display="block">\n  <mrow data-mjx-texclass="OP" data-latex="\\dd{x}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mi data-latex="x">x</mi>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Differ_3', () =>
    toXmlMatch(
      tex2mml('\\dd[3]{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd[3]{x}" display="block">\n  <mrow data-mjx-texclass="OP" data-latex="\\dd[3]{x}">\n    <msup data-latex="\\diffd^{3}">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="{3}">\n        <mn data-latex="3">3</mn>\n      </mrow>\n    </msup>\n    <mi data-latex="x">x</mi>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Differ_4', () =>
    toXmlMatch(
      tex2mml('\\dd[3]x'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd[3]x" display="block">\n  <msup data-latex="\\diffd^{3}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{3}">\n      <mn data-latex="3">3</mn>\n    </mrow>\n  </msup>\n  <mi data-latex="\\dd[3]x">x</mi>\n</math>'
    ));
  it('Derivatives_Differ_5', () =>
    toXmlMatch(
      tex2mml('\\dd(\\frac{\\frac{\\cos}{\\theta}}{\\theta})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd(\\frac{\\frac{\\cos}{\\theta}}{\\theta})" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">\n    <mi mathvariant="normal" data-latex="d">d</mi>\n  </mrow>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">\n      <mfrac data-latex="\\frac{\\cos}{\\theta}">\n        <mi data-latex="\\cos">cos</mi>\n        <mi data-latex="\\theta">&#x3B8;</mi>\n      </mfrac>\n      <mi data-latex="\\theta">&#x3B8;</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Differ_6', () =>
    toXmlMatch(
      tex2mml('\\dd[4](\\frac{\\frac{\\cos}{\\theta}}{\\theta})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd[4](\\frac{\\frac{\\cos}{\\theta}}{\\theta})" display="block">\n  <msup data-latex="\\diffd^{4}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{4}">\n      <mn data-latex="4">4</mn>\n    </mrow>\n  </msup>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">\n      <mfrac data-latex="\\frac{\\cos}{\\theta}">\n        <mi data-latex="\\cos">cos</mi>\n        <mi data-latex="\\theta">&#x3B8;</mi>\n      </mfrac>\n      <mi data-latex="\\theta">&#x3B8;</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n</math>'
    ));
  it('Derivatives_Differ_7', () =>
    toXmlMatch(
      tex2mml('\\dd{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})" display="block">\n  <mrow data-mjx-texclass="OP" data-latex="\\dd{x}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mi data-latex="x">x</mi>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">\n    <mfrac data-latex="\\frac{\\cos}{\\theta}">\n      <mi data-latex="\\cos">cos</mi>\n      <mi data-latex="\\theta">&#x3B8;</mi>\n    </mfrac>\n    <mi data-latex="\\theta">&#x3B8;</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Derivatives_Differ_8', () =>
    toXmlMatch(
      tex2mml('\\dd[4]{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd[4]{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})" display="block">\n  <mrow data-mjx-texclass="OP" data-latex="\\dd[4]{x}">\n    <msup data-latex="\\diffd^{4}">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="{4}">\n        <mn data-latex="4">4</mn>\n      </mrow>\n    </msup>\n    <mi data-latex="x">x</mi>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">\n    <mfrac data-latex="\\frac{\\cos}{\\theta}">\n      <mi data-latex="\\cos">cos</mi>\n      <mi data-latex="\\theta">&#x3B8;</mi>\n    </mfrac>\n    <mi data-latex="\\theta">&#x3B8;</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n</math>'
    ));
  it('Derivatives_Differ_9', () =>
    toXmlMatch(
      tex2mml('\\dd[5]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd[5]" display="block">\n  <msup data-latex="\\dd[5]">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{5}">\n      <mn data-latex="5">5</mn>\n    </mrow>\n  </msup>\n</math>'
    ));
});

describe('Physics5_5', () => {
  it('Derivatives_PDiff_0', () =>
    toXmlMatch(
      tex2mml('A\\dd A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd A" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n    <mi mathvariant="normal" data-latex="d">d</mi>\n  </mrow>\n  <mi data-latex="\\dd A">A</mi>\n</math>'
    ));
  it('Derivatives_PDiff_1', () =>
    toXmlMatch(
      tex2mml('A\\dd x A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd x A" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n    <mi mathvariant="normal" data-latex="d">d</mi>\n  </mrow>\n  <mi data-latex="\\dd x">x</mi>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('Derivatives_PDiff_2', () =>
    toXmlMatch(
      tex2mml('A\\dd{x} A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd{x} A" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="OP" data-latex="\\dd{x}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mi data-latex="x">x</mi>\n  </mrow>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('Derivatives_PDiff_3', () =>
    toXmlMatch(
      tex2mml('A\\dd xA'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd xA" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n    <mi mathvariant="normal" data-latex="d">d</mi>\n  </mrow>\n  <mi data-latex="\\dd x">x</mi>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('Derivatives_PDiff_4', () =>
    toXmlMatch(
      tex2mml('A{{\\rm d}(\\it x)}A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A{{\\rm d}(\\it x)}A" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="ORD" data-latex="{{d}\\it x)}">\n    <mrow data-mjx-texclass="ORD" data-latex="{d}">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mo data-latex="\\it" stretchy="false">(</mo>\n    <mi data-mjx-variant="-tex-mathit" mathvariant="italic" data-latex="x">x</mi>\n    <mo data-mjx-variant="-tex-mathit" mathvariant="italic" data-latex=")" stretchy="false">)</mo>\n  </mrow>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('Derivatives_PDiff_5', () =>
    toXmlMatch(
      tex2mml('A\\dd[3]{x} A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd[3]{x} A" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="OP" data-latex="\\dd[3]{x}">\n    <msup data-latex="\\diffd^{3}">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="{3}">\n        <mn data-latex="3">3</mn>\n      </mrow>\n    </msup>\n    <mi data-latex="x">x</mi>\n  </mrow>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('Derivatives_PDiff_6', () =>
    toXmlMatch(
      tex2mml('A\\dd[3]x A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd[3]x A" display="block">\n  <mi data-latex="A">A</mi>\n  <msup data-latex="\\diffd^{3}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{3}">\n      <mn data-latex="3">3</mn>\n    </mrow>\n  </msup>\n  <mi data-latex="\\dd[3]x">x</mi>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('Derivatives_PDiff_7', () =>
    toXmlMatch(
      tex2mml('A\\dd(\\frac{\\frac{\\cos}{\\theta}}{\\theta}) A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd(\\frac{\\frac{\\cos}{\\theta}}{\\theta}) A" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">\n    <mi mathvariant="normal" data-latex="d">d</mi>\n  </mrow>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">\n      <mfrac data-latex="\\frac{\\cos}{\\theta}">\n        <mi data-latex="\\cos">cos</mi>\n        <mi data-latex="\\theta">&#x3B8;</mi>\n      </mfrac>\n      <mi data-latex="\\theta">&#x3B8;</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('Derivatives_PDiff_8', () =>
    toXmlMatch(
      tex2mml('A\\dd[4](\\frac{\\frac{\\cos}{\\theta}}{\\theta})A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd[4](\\frac{\\frac{\\cos}{\\theta}}{\\theta})A" display="block">\n  <mi data-latex="A">A</mi>\n  <msup data-latex="\\diffd^{4}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{4}">\n      <mn data-latex="4">4</mn>\n    </mrow>\n  </msup>\n  <mrow data-latex=")">\n    <mo data-mjx-texclass="OPEN">(</mo>\n    <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">\n      <mfrac data-latex="\\frac{\\cos}{\\theta}">\n        <mi data-latex="\\cos">cos</mi>\n        <mi data-latex="\\theta">&#x3B8;</mi>\n      </mfrac>\n      <mi data-latex="\\theta">&#x3B8;</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">)</mo>\n  </mrow>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('Derivatives_PDiff_9', () =>
    toXmlMatch(
      tex2mml('A\\dd{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})A" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="OP" data-latex="\\dd{x}">\n    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n      <mi mathvariant="normal" data-latex="d">d</mi>\n    </mrow>\n    <mi data-latex="x">x</mi>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">\n    <mfrac data-latex="\\frac{\\cos}{\\theta}">\n      <mi data-latex="\\cos">cos</mi>\n      <mi data-latex="\\theta">&#x3B8;</mi>\n    </mfrac>\n    <mi data-latex="\\theta">&#x3B8;</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('Derivatives_PDiff_10', () =>
    toXmlMatch(
      tex2mml('A\\dd[4]{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd[4]{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})A" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="OP" data-latex="\\dd[4]{x}">\n    <msup data-latex="\\diffd^{4}">\n      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">\n        <mi mathvariant="normal" data-latex="d">d</mi>\n      </mrow>\n      <mrow data-mjx-texclass="ORD" data-latex="{4}">\n        <mn data-latex="4">4</mn>\n      </mrow>\n    </msup>\n    <mi data-latex="x">x</mi>\n  </mrow>\n  <mo data-latex="(" stretchy="false">(</mo>\n  <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">\n    <mfrac data-latex="\\frac{\\cos}{\\theta}">\n      <mi data-latex="\\cos">cos</mi>\n      <mi data-latex="\\theta">&#x3B8;</mi>\n    </mfrac>\n    <mi data-latex="\\theta">&#x3B8;</mi>\n  </mfrac>\n  <mo data-latex=")" stretchy="false">)</mo>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('Derivatives_PDiff_11', () =>
    toXmlMatch(
      tex2mml(
        'A{\\rm d}\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right) A'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A{\\rm d}\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right) A" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="ORD" data-latex="{d}">\n    <mi mathvariant="normal" data-latex="d">d</mi>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)" data-latex="\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">\n      <mfrac data-latex="\\frac{\\cos}{\\theta}">\n        <mi data-latex="\\cos">cos</mi>\n        <mi data-latex="\\theta">&#x3B8;</mi>\n      </mfrac>\n      <mi data-latex="\\theta">&#x3B8;</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('Derivatives_PDiff_12', () =>
    toXmlMatch(
      tex2mml(
        'A{\\rm d}{\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)} A'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A{\\rm d}{\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)} A" display="block">\n  <mi data-latex="A">A</mi>\n  <mrow data-mjx-texclass="ORD" data-latex="{d}">\n    <mi mathvariant="normal" data-latex="d">d</mi>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)}">\n    <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)" data-latex="\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)">\n      <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n      <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">\n        <mfrac data-latex="\\frac{\\cos}{\\theta}">\n          <mi data-latex="\\cos">cos</mi>\n          <mi data-latex="\\theta">&#x3B8;</mi>\n        </mfrac>\n        <mi data-latex="\\theta">&#x3B8;</mi>\n      </mfrac>\n      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n    </mrow>\n  </mrow>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
});

describe('Physics6_0', () => {
  it('BraKet_Bra_0', () =>
    toXmlMatch(
      tex2mml('\\bra{\\phi}\\ket{\\psi}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra{\\phi}\\ket{\\psi}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\phi}\\middle\\vert{\\psi}\\right\\rangle" data-latex="\\bra{\\phi}\\ket{\\psi}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\phi}">\n      <mi data-latex="\\phi">&#x3D5;</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\psi}">\n      <mi data-latex="\\psi">&#x3C8;</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Bra_1', () =>
    toXmlMatch(
      tex2mml('\\bra{A}\\ket{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra{A}\\ket{B}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{B}\\right\\rangle" data-latex="\\bra{A}\\ket{B}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{B}">\n      <mi data-latex="B">B</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Bra_2', () =>
    toXmlMatch(
      tex2mml('\\bra{\\phi}\\dyad{\\psi}{\\xi}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra{\\phi}\\dyad{\\psi}{\\xi}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\phi}\\right\\vert" data-latex="\\left\\langle{\\phi}\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\phi}">\n      <mi data-latex="\\phi">&#x3D5;</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="\\bra{\\phi}"></mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\psi}\\middle\\rangle\\!\\middle\\langle{\\xi}\\right\\vert" data-latex="\\left\\vert{\\psi}\\middle\\rangle\\!\\middle\\langle{\\xi}\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\psi}">\n      <mi data-latex="\\psi">&#x3C8;</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>\n    <mstyle scriptlevel="0" data-latex="\\!">\n      <mspace width="-0.167em"></mspace>\n    </mstyle>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\xi}">\n      <mi data-latex="\\xi">&#x3BE;</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Bra_3', () =>
    toXmlMatch(
      tex2mml('\\bra A  \\ket B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra A  \\ket B" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{}\\right\\rangle" data-latex="\\left\\langle{A}\\middle\\vert{}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n  <mi data-latex="B">B</mi>\n</math>'
    ));
  it('BraKet_Bra_4', () =>
    toXmlMatch(
      tex2mml('\\bra*{\\frac{a}{b}}  \\ket{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra*{\\frac{a}{b}}  \\ket{\\frac{a}{b}}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\bra*{\\frac{a}{b}}  \\ket{\\frac{a}{b}}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Bra_5', () =>
    toXmlMatch(
      tex2mml('\\bra{\\frac{a}{b}}  \\ket*{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra{\\frac{a}{b}}  \\ket*{\\frac{a}{b}}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\bra{\\frac{a}{b}}  \\ket*{\\frac{a}{b}}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Bra_6', () =>
    toXmlMatch(
      tex2mml('\\bra A\\ket{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra A\\ket{B}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{B}\\right\\rangle" data-latex="\\bra A\\ket{B}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{B}">\n      <mi data-latex="B">B</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Bra_7', () =>
    toXmlMatch(
      tex2mml('\\bra A\\ket '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra A\\ket " display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{}\\right\\rangle" data-latex="\\bra A\\ket ">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Bra_8', () =>
    toXmlMatch(
      tex2mml('\\bra {A}\\ket '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra {A}\\ket " display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{}\\right\\rangle" data-latex="\\bra {A}\\ket ">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Bra_9', () =>
    toXmlMatch(
      tex2mml('\\bra {A}\\ket B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra {A}\\ket B" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{}\\right\\rangle" data-latex="\\left\\langle{A}\\middle\\vert{}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n  <mi data-latex="B">B</mi>\n</math>'
    ));
  it('BraKet_Bra_10', () =>
    toXmlMatch(
      tex2mml('\\bra {\\frac{a}{b}} \\ket* \\alpha'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra {\\frac{a}{b}} \\ket* \\alpha" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\middle\\vert{}\\right\\rangle" data-latex="\\left\\langle{\\frac{a}{b}}\\middle\\vert{}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n  <mo data-latex="*">&#x2217;</mo>\n  <mi data-latex="\\alpha">&#x3B1;</mi>\n</math>'
    ));
  it('BraKet_Bra_11', () =>
    toXmlMatch(
      tex2mml('\\ket{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket{A}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\right\\rangle" data-latex="\\ket{A}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Bra_12', () =>
    toXmlMatch(
      tex2mml('\\ket{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{a}{b}}\\right\\rangle" data-latex="\\ket{\\frac{a}{b}}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Bra_13', () =>
    toXmlMatch(
      tex2mml('\\ket*{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket*{A}" display="block">\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\ket*{A}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Bra_14', () =>
    toXmlMatch(
      tex2mml('\\ket a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket a" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{a}\\right\\rangle" data-latex="\\ket a">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{a}">\n      <mi data-latex="a">a</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Bra_15', () =>
    toXmlMatch(
      tex2mml('\\ket* a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket* a" display="block">\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{a}">\n    <mi data-latex="a">a</mi>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\ket* a">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Bra_16', () =>
    toXmlMatch(
      tex2mml('\\ket \\alpha'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket \\alpha" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\alpha}\\right\\rangle" data-latex="\\ket \\alpha">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\alpha}">\n      <mi data-latex="\\alpha">&#x3B1;</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics6_1', () => {
  it('BraKet_Braket_0', () =>
    toXmlMatch(
      tex2mml('\\braket{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{A}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{A}\\right\\rangle" data-latex="\\braket{A}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Braket_1', () =>
    toXmlMatch(
      tex2mml('\\braket{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\middle\\vert{\\frac{a}{b}}\\right\\rangle" data-latex="\\braket{\\frac{a}{b}}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Braket_2', () =>
    toXmlMatch(
      tex2mml('\\braket*{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket*{A}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\braket*{A}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Braket_3', () =>
    toXmlMatch(
      tex2mml('\\braket*{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket*{\\frac{a}{b}}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\braket*{\\frac{a}{b}}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Braket_4', () =>
    toXmlMatch(
      tex2mml('\\braket a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket a" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{a}\\middle\\vert{a}\\right\\rangle" data-latex="\\braket a">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{a}">\n      <mi data-latex="a">a</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{a}">\n      <mi data-latex="a">a</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Braket_5', () =>
    toXmlMatch(
      tex2mml('\\braket* a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket* a" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{a}">\n    <mi data-latex="a">a</mi>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{a}">\n    <mi data-latex="a">a</mi>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\braket* a">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Braket_6', () =>
    toXmlMatch(
      tex2mml('\\braket \\alpha'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket \\alpha" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\alpha}\\middle\\vert{\\alpha}\\right\\rangle" data-latex="\\braket \\alpha">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\alpha}">\n      <mi data-latex="\\alpha">&#x3B1;</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\alpha}">\n      <mi data-latex="\\alpha">&#x3B1;</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Braket_7', () =>
    toXmlMatch(
      tex2mml('\\braket{\\frac{a}{b}}{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{\\frac{a}{b}}{A}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\middle\\vert{A}\\right\\rangle" data-latex="\\braket{\\frac{a}{b}}{A}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Braket_8', () =>
    toXmlMatch(
      tex2mml('\\braket*{\\frac{a}{b}}{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket*{\\frac{a}{b}}{A}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\braket*{\\frac{a}{b}}{A}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Braket_9', () =>
    toXmlMatch(
      tex2mml('\\braket{\\frac{a}{b}}  A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{\\frac{a}{b}}  A" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\middle\\vert{\\frac{a}{b}}\\right\\rangle" data-latex="\\left\\langle{\\frac{a}{b}}\\middle\\vert{\\frac{a}{b}}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('BraKet_Braket_10', () =>
    toXmlMatch(
      tex2mml('\\braket*{\\frac{a}{b}}   A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket*{\\frac{a}{b}}   A" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\braket*{\\frac{a}{b}}">&#x27E9;</mo>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('BraKet_Braket_11', () =>
    toXmlMatch(
      tex2mml('\\braket{\\frac{a}{b}}{} '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{\\frac{a}{b}}{} " display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\middle\\vert{}\\right\\rangle" data-latex="\\braket{\\frac{a}{b}}{} ">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Braket_12', () =>
    toXmlMatch(
      tex2mml('\\braket*{\\frac{a}{b}}{}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket*{\\frac{a}{b}}{}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n  <mo fence="false" stretchy="false" data-latex="\\braket*{\\frac{a}{b}}{}">&#x27E9;</mo>\n</math>'
    ));
});

describe('Physics6_2', () => {
  it('BraKet_Ketbra_0', () =>
    toXmlMatch(
      tex2mml('\\ketbra{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{A}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\middle\\rangle\\!\\middle\\langle{A}\\right\\vert" data-latex="\\ketbra{A}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>\n    <mstyle scriptlevel="0" data-latex="\\!">\n      <mspace width="-0.167em"></mspace>\n    </mstyle>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Ketbra_1', () =>
    toXmlMatch(
      tex2mml('\\ketbra{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{a}{b}}\\middle\\rangle\\!\\middle\\langle{\\frac{a}{b}}\\right\\vert" data-latex="\\ketbra{\\frac{a}{b}}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>\n    <mstyle scriptlevel="0" data-latex="\\!">\n      <mspace width="-0.167em"></mspace>\n    </mstyle>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Ketbra_2', () =>
    toXmlMatch(
      tex2mml('\\ketbra*{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra*{A}" display="block">\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>\n  <mstyle scriptlevel="0" data-latex="\\!">\n    <mspace width="-0.167em"></mspace>\n  </mstyle>\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\ketbra*{A}">|</mo>\n</math>'
    ));
  it('BraKet_Ketbra_3', () =>
    toXmlMatch(
      tex2mml('\\ketbra*{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra*{\\frac{a}{b}}" display="block">\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>\n  <mstyle scriptlevel="0" data-latex="\\!">\n    <mspace width="-0.167em"></mspace>\n  </mstyle>\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\ketbra*{\\frac{a}{b}}">|</mo>\n</math>'
    ));
  it('BraKet_Ketbra_4', () =>
    toXmlMatch(
      tex2mml('\\ketbra a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra a" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{a}\\middle\\rangle\\!\\middle\\langle{a}\\right\\vert" data-latex="\\ketbra a">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{a}">\n      <mi data-latex="a">a</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>\n    <mstyle scriptlevel="0" data-latex="\\!">\n      <mspace width="-0.167em"></mspace>\n    </mstyle>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{a}">\n      <mi data-latex="a">a</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Ketbra_5', () =>
    toXmlMatch(
      tex2mml('\\ketbra* a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra* a" display="block">\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{a}">\n    <mi data-latex="a">a</mi>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>\n  <mstyle scriptlevel="0" data-latex="\\!">\n    <mspace width="-0.167em"></mspace>\n  </mstyle>\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{a}">\n    <mi data-latex="a">a</mi>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\ketbra* a">|</mo>\n</math>'
    ));
  it('BraKet_Ketbra_6', () =>
    toXmlMatch(
      tex2mml('\\ketbra \\alpha'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra \\alpha" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\alpha}\\middle\\rangle\\!\\middle\\langle{\\alpha}\\right\\vert" data-latex="\\ketbra \\alpha">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\alpha}">\n      <mi data-latex="\\alpha">&#x3B1;</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>\n    <mstyle scriptlevel="0" data-latex="\\!">\n      <mspace width="-0.167em"></mspace>\n    </mstyle>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\alpha}">\n      <mi data-latex="\\alpha">&#x3B1;</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Ketbra_7', () =>
    toXmlMatch(
      tex2mml('\\ketbra{\\frac{a}{b}}{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{\\frac{a}{b}}{A}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{a}{b}}\\middle\\rangle\\!\\middle\\langle{A}\\right\\vert" data-latex="\\ketbra{\\frac{a}{b}}{A}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>\n    <mstyle scriptlevel="0" data-latex="\\!">\n      <mspace width="-0.167em"></mspace>\n    </mstyle>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Ketbra_8', () =>
    toXmlMatch(
      tex2mml('\\ketbra*{\\frac{a}{b}}{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra*{\\frac{a}{b}}{A}" display="block">\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>\n  <mstyle scriptlevel="0" data-latex="\\!">\n    <mspace width="-0.167em"></mspace>\n  </mstyle>\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\ketbra*{\\frac{a}{b}}{A}">|</mo>\n</math>'
    ));
  it('BraKet_Ketbra_9', () =>
    toXmlMatch(
      tex2mml('\\ketbra{\\frac{a}{b}}  A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{\\frac{a}{b}}  A" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{a}{b}}\\middle\\rangle\\!\\middle\\langle{\\frac{a}{b}}\\right\\vert" data-latex="\\left\\vert{\\frac{a}{b}}\\middle\\rangle\\!\\middle\\langle{\\frac{a}{b}}\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>\n    <mstyle scriptlevel="0" data-latex="\\!">\n      <mspace width="-0.167em"></mspace>\n    </mstyle>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('BraKet_Ketbra_10', () =>
    toXmlMatch(
      tex2mml('\\ketbra*{\\frac{a}{b}}   A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra*{\\frac{a}{b}}   A" display="block">\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>\n  <mstyle scriptlevel="0" data-latex="\\!">\n    <mspace width="-0.167em"></mspace>\n  </mstyle>\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\ketbra*{\\frac{a}{b}}">|</mo>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('BraKet_Ketbra_11', () =>
    toXmlMatch(
      tex2mml('\\ketbra{\\frac{a}{b}}{} '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{\\frac{a}{b}}{} " display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{a}{b}}\\middle\\rangle\\!\\middle\\langle{}\\right\\vert" data-latex="\\ketbra{\\frac{a}{b}}{} ">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>\n    <mstyle scriptlevel="0" data-latex="\\!">\n      <mspace width="-0.167em"></mspace>\n    </mstyle>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Ketbra_12', () =>
    toXmlMatch(
      tex2mml('\\ketbra*{\\frac{a}{b}}{}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra*{\\frac{a}{b}}{}" display="block">\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>\n  <mstyle scriptlevel="0" data-latex="\\!">\n    <mspace width="-0.167em"></mspace>\n  </mstyle>\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\ketbra*{\\frac{a}{b}}{}">|</mo>\n</math>'
    ));
  it('BraKet_Ketbra_13', () =>
    toXmlMatch(
      tex2mml('\\left\\vert A \\middle\\rangle\\middle\\langle B\\right\\vert'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\vert A \\middle\\rangle\\middle\\langle B\\right\\vert" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert A \\middle\\rangle\\middle\\langle B\\right\\vert" data-latex="\\left\\vert A \\middle\\rangle\\middle\\langle B\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert " data-latex="\\left\\vert ">|</mo>\n    <mi data-latex="A">A</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\langle " data-latex="\\middle\\langle ">&#x27E8;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>\n    <mi data-latex="B">B</mi>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Ketbra_14', () =>
    toXmlMatch(
      tex2mml('\\ketbra{A}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{A}{B}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\middle\\rangle\\!\\middle\\langle{B}\\right\\vert" data-latex="\\ketbra{A}{B}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>\n    <mstyle scriptlevel="0" data-latex="\\!">\n      <mspace width="-0.167em"></mspace>\n    </mstyle>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{B}">\n      <mi data-latex="B">B</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Ketbra_15', () =>
    toXmlMatch(
      tex2mml('\\outerproduct{A}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\outerproduct{A}{B}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\middle\\rangle\\!\\middle\\langle{B}\\right\\vert" data-latex="\\outerproduct{A}{B}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>\n    <mstyle scriptlevel="0" data-latex="\\!">\n      <mspace width="-0.167em"></mspace>\n    </mstyle>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{B}">\n      <mi data-latex="B">B</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Ketbra_16', () =>
    toXmlMatch(
      tex2mml('\\dyad{a}{b}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dyad{a}{b}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{a}\\middle\\rangle\\!\\middle\\langle{b}\\right\\vert" data-latex="\\dyad{a}{b}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{a}">\n      <mi data-latex="a">a</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>\n    <mstyle scriptlevel="0" data-latex="\\!">\n      <mspace width="-0.167em"></mspace>\n    </mstyle>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{b}">\n      <mi data-latex="b">b</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics6_3', () => {
  it('BraKet_Expect_0', () =>
    toXmlMatch(
      tex2mml('\\ev{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev{A}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle {A} \\right\\rangle" data-latex="\\ev{A}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle " data-latex="\\left\\langle ">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Expect_1', () =>
    toXmlMatch(
      tex2mml('\\ev{\\frac{A}{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev{\\frac{A}{B}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle {\\frac{A}{B}} \\right\\rangle" data-latex="\\ev{\\frac{A}{B}}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle " data-latex="\\left\\langle ">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n      <mfrac data-latex="\\frac{A}{B}">\n        <mi data-latex="A">A</mi>\n        <mi data-latex="B">B</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Expect_2', () =>
    toXmlMatch(
      tex2mml('\\ev*{\\frac{A}{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev*{\\frac{A}{B}}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n    <mfrac data-latex="\\frac{A}{B}">\n      <mi data-latex="A">A</mi>\n      <mi data-latex="B">B</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\ev*{\\frac{A}{B}}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Expect_3', () =>
    toXmlMatch(
      tex2mml('\\ev**{\\frac{A}{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev**{\\frac{A}{B}}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n    <mfrac data-latex="\\frac{A}{B}">\n      <mi data-latex="A">A</mi>\n      <mi data-latex="B">B</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\ev**{\\frac{A}{B}}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Expect_4', () =>
    toXmlMatch(
      tex2mml('\\ev{A}{\\frac{A}{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev{A}{\\frac{A}{B}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{A}{B}}\\right\\vert" data-latex="\\left\\langle{\\frac{A}{B}}\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n      <mfrac data-latex="\\frac{A}{B}">\n        <mi data-latex="A">A</mi>\n        <mi data-latex="B">B</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{A}{B}}\\right\\rangle" data-latex="\\left\\vert{\\frac{A}{B}}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n      <mfrac data-latex="\\frac{A}{B}">\n        <mi data-latex="A">A</mi>\n        <mi data-latex="B">B</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Expect_5', () =>
    toXmlMatch(
      tex2mml('\\ev{\\frac{A}{B}}{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev{\\frac{A}{B}}{A}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\right\\vert" data-latex="\\left\\langle{A}\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n    <mfrac data-latex="\\frac{A}{B}">\n      <mi data-latex="A">A</mi>\n      <mi data-latex="B">B</mi>\n    </mfrac>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\right\\rangle" data-latex="\\left\\vert{A}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Expect_6', () =>
    toXmlMatch(
      tex2mml('\\ev*{A}{\\frac{A}{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev*{A}{\\frac{A}{B}}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n    <mfrac data-latex="\\frac{A}{B}">\n      <mi data-latex="A">A</mi>\n      <mi data-latex="B">B</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n    <mfrac data-latex="\\frac{A}{B}">\n      <mi data-latex="A">A</mi>\n      <mi data-latex="B">B</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\ev*{A}{\\frac{A}{B}}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Expect_7', () =>
    toXmlMatch(
      tex2mml('\\ev**{A} {\\frac{A}{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev**{A} {\\frac{A}{B}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{A}{B}}\\middle\\vert{A}\\middle\\vert{\\frac{A}{B}}\\right\\rangle" data-latex="\\ev**{A} {\\frac{A}{B}}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n      <mfrac data-latex="\\frac{A}{B}">\n        <mi data-latex="A">A</mi>\n        <mi data-latex="B">B</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n      <mfrac data-latex="\\frac{A}{B}">\n        <mi data-latex="A">A</mi>\n        <mi data-latex="B">B</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Expect_8', () =>
    toXmlMatch(
      tex2mml('\\ev A B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev A B" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle {A} \\right\\rangle" data-latex="\\left\\langle {A} \\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle " data-latex="\\left\\langle ">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n  <mi data-latex="B">B</mi>\n</math>'
    ));
  it('BraKet_Expect_9', () =>
    toXmlMatch(
      tex2mml('\\ev A {\\frac{A}{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev A {\\frac{A}{B}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{A}{B}}\\right\\vert" data-latex="\\left\\langle{\\frac{A}{B}}\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n      <mfrac data-latex="\\frac{A}{B}">\n        <mi data-latex="A">A</mi>\n        <mi data-latex="B">B</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{A}{B}}\\right\\rangle" data-latex="\\left\\vert{\\frac{A}{B}}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n      <mfrac data-latex="\\frac{A}{B}">\n        <mi data-latex="A">A</mi>\n        <mi data-latex="B">B</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Expect_10', () =>
    toXmlMatch(
      tex2mml('\\ev {\\frac{A}{B}} A'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev {\\frac{A}{B}} A" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle {\\frac{A}{B}} \\right\\rangle" data-latex="\\left\\langle {\\frac{A}{B}} \\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle " data-latex="\\left\\langle ">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n      <mfrac data-latex="\\frac{A}{B}">\n        <mi data-latex="A">A</mi>\n        <mi data-latex="B">B</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n  <mi data-latex="A">A</mi>\n</math>'
    ));
  it('BraKet_Expect_11', () =>
    toXmlMatch(
      tex2mml('\\ev* A {\\frac{A}{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev* A {\\frac{A}{B}}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n    <mfrac data-latex="\\frac{A}{B}">\n      <mi data-latex="A">A</mi>\n      <mi data-latex="B">B</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n    <mfrac data-latex="\\frac{A}{B}">\n      <mi data-latex="A">A</mi>\n      <mi data-latex="B">B</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\ev* A {\\frac{A}{B}}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Expect_12', () =>
    toXmlMatch(
      tex2mml('\\ev** A {\\frac{A}{B}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev** A {\\frac{A}{B}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{A}{B}}\\middle\\vert{A}\\middle\\vert{\\frac{A}{B}}\\right\\rangle" data-latex="\\ev** A {\\frac{A}{B}}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n      <mfrac data-latex="\\frac{A}{B}">\n        <mi data-latex="A">A</mi>\n        <mi data-latex="B">B</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n      <mfrac data-latex="\\frac{A}{B}">\n        <mi data-latex="A">A</mi>\n        <mi data-latex="B">B</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Expect_13', () =>
    toXmlMatch(
      tex2mml('\\ev{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{\\Psi}{\\Phi}}\\right\\vert" data-latex="\\left\\langle{\\frac{\\Psi}{\\Phi}}\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{\\Psi}{\\Phi}}">\n      <mfrac data-latex="\\frac{\\Psi}{\\Phi}">\n        <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>\n        <mi mathvariant="normal" data-latex="\\Phi">&#x3A6;</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n    <mfrac data-latex="\\frac{A}{B}">\n      <mi data-latex="A">A</mi>\n      <mi data-latex="B">B</mi>\n    </mfrac>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{\\Psi}{\\Phi}}\\right\\rangle" data-latex="\\left\\vert{\\frac{\\Psi}{\\Phi}}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{\\Psi}{\\Phi}}">\n      <mfrac data-latex="\\frac{\\Psi}{\\Phi}">\n        <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>\n        <mi mathvariant="normal" data-latex="\\Phi">&#x3A6;</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Expect_14', () =>
    toXmlMatch(
      tex2mml('\\ev{\\frac{A}{B}}{{\\Psi}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev{\\frac{A}{B}}{{\\Psi}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{{\\Psi}}\\right\\vert" data-latex="\\left\\langle{{\\Psi}}\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{{\\Psi}}">\n      <mrow data-mjx-texclass="ORD" data-latex="{\\Psi}">\n        <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>\n      </mrow>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n    <mfrac data-latex="\\frac{A}{B}">\n      <mi data-latex="A">A</mi>\n      <mi data-latex="B">B</mi>\n    </mfrac>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{{\\Psi}}\\right\\rangle" data-latex="\\left\\vert{{\\Psi}}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{{\\Psi}}">\n      <mrow data-mjx-texclass="ORD" data-latex="{\\Psi}">\n        <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>\n      </mrow>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_Expect_15', () =>
    toXmlMatch(
      tex2mml('\\ev*{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev*{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{\\Psi}{\\Phi}}">\n    <mfrac data-latex="\\frac{\\Psi}{\\Phi}">\n      <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>\n      <mi mathvariant="normal" data-latex="\\Phi">&#x3A6;</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n    <mfrac data-latex="\\frac{A}{B}">\n      <mi data-latex="A">A</mi>\n      <mi data-latex="B">B</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{\\Psi}{\\Phi}}">\n    <mfrac data-latex="\\frac{\\Psi}{\\Phi}">\n      <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>\n      <mi mathvariant="normal" data-latex="\\Phi">&#x3A6;</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\ev*{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_Expect_16', () =>
    toXmlMatch(
      tex2mml('\\ev**{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev**{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{\\Psi}{\\Phi}}\\middle\\vert{\\frac{A}{B}}\\middle\\vert{\\frac{\\Psi}{\\Phi}}\\right\\rangle" data-latex="\\ev**{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{\\Psi}{\\Phi}}">\n      <mfrac data-latex="\\frac{\\Psi}{\\Phi}">\n        <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>\n        <mi mathvariant="normal" data-latex="\\Phi">&#x3A6;</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">\n      <mfrac data-latex="\\frac{A}{B}">\n        <mi data-latex="A">A</mi>\n        <mi data-latex="B">B</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{\\Psi}{\\Phi}}">\n      <mfrac data-latex="\\frac{\\Psi}{\\Phi}">\n        <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>\n        <mi mathvariant="normal" data-latex="\\Phi">&#x3A6;</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics6_4', () => {
  it('BraKet_MatrixEl_0', () =>
    toXmlMatch(
      tex2mml('\\matrixel{n}{A}{m}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixel{n}{A}{m}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{n}\\right\\vert" data-latex="\\left\\langle{n}\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{n}">\n      <mi data-latex="n">n</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{m}\\right\\rangle" data-latex="\\left\\vert{m}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{m}">\n      <mi data-latex="m">m</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_MatrixEl_1', () =>
    toXmlMatch(
      tex2mml('\\mel{n}{A}{m}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel{n}{A}{m}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{n}\\right\\vert" data-latex="\\left\\langle{n}\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{n}">\n      <mi data-latex="n">n</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{A}">\n    <mi data-latex="A">A</mi>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{m}\\right\\rangle" data-latex="\\left\\vert{m}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{m}">\n      <mi data-latex="m">m</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_MatrixEl_2', () =>
    toXmlMatch(
      tex2mml('\\mel{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\right\\vert" data-latex="\\left\\langle{\\frac{a}{b}}\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{a}{b}}\\right\\rangle" data-latex="\\left\\vert{\\frac{a}{b}}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_MatrixEl_3', () =>
    toXmlMatch(
      tex2mml('\\mel A B C'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel A B C" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\right\\vert" data-latex="\\left\\langle{A}\\right\\vert">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{A}">\n      <mi data-latex="A">A</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="{B}">\n    <mi data-latex="B">B</mi>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{C}\\right\\rangle" data-latex="\\left\\vert{C}\\right\\rangle">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{C}">\n      <mi data-latex="C">C</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_MatrixEl_4', () =>
    toXmlMatch(
      tex2mml('\\mel*{n}{\\frac{a}{b}}{m}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel*{n}{\\frac{a}{b}}{m}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{n}">\n    <mi data-latex="n">n</mi>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{m}">\n    <mi data-latex="m">m</mi>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\mel*{n}{\\frac{a}{b}}{m}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_MatrixEl_5', () =>
    toXmlMatch(
      tex2mml('\\mel*{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel*{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}" display="block">\n  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n  </mrow>\n  <mo fence="false" stretchy="false" data-latex="\\mel*{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}">&#x27E9;</mo>\n</math>'
    ));
  it('BraKet_MatrixEl_6', () =>
    toXmlMatch(
      tex2mml('\\mel**{n}{\\frac{a}{b}}{m}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel**{n}{\\frac{a}{b}}{m}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{n}\\middle\\vert{\\frac{a}{b}}\\middle\\vert{m}\\right\\rangle" data-latex="\\mel**{n}{\\frac{a}{b}}{m}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{n}">\n      <mi data-latex="n">n</mi>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{m}">\n      <mi data-latex="m">m</mi>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('BraKet_MatrixEl_7', () =>
    toXmlMatch(
      tex2mml('\\mel**{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel**{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\middle\\vert{\\frac{a}{b}}\\middle\\vert{\\frac{a}{b}}\\right\\rangle" data-latex="\\mel**{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>\n    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">\n      <mfrac data-latex="\\frac{a}{b}">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics7_0', () => {
  it('Matrices_Quantity_0', () =>
    toXmlMatch(
      tex2mml('\\matrixquantity{Q}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixquantity{Q}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\matrixquantity{Q}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mi data-latex="Q">Q</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Quantity_1', () =>
    toXmlMatch(
      tex2mml('\\matrixquantity*{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixquantity*{a &amp; b \\\\ c &amp; d}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\matrixquantity*{a &amp; b \\\\ c &amp; d}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mi data-latex="d">d</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Quantity_2', () =>
    toXmlMatch(
      tex2mml('\\matrixquantity*(a & b \\\\ c & d)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixquantity*(a &amp; b \\\\ c &amp; d)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right\\rgroup" data-latex="\\matrixquantity*(a &amp; b \\\\ c &amp; d)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Quantity_3', () =>
    toXmlMatch(
      tex2mml('\\matrixquantity(a & b \\\\ c & d)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixquantity(a &amp; b \\\\ c &amp; d)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right)" data-latex="\\matrixquantity(a &amp; b \\\\ c &amp; d)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Quantity_4', () =>
    toXmlMatch(
      tex2mml('\\matrixquantity[a & b \\\\ c & d]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixquantity[a &amp; b \\\\ c &amp; d]" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right]" data-latex="\\matrixquantity[a &amp; b \\\\ c &amp; d]">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Quantity_5', () =>
    toXmlMatch(
      tex2mml('\\matrixquantity|a & b \\\\ c & d|'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixquantity|a &amp; b \\\\ c &amp; d|" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right|" data-latex="\\matrixquantity|a &amp; b \\\\ c &amp; d|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Quantity_6', () =>
    toXmlMatch(
      tex2mml('\\mqty{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{a &amp; b \\\\ c &amp; d}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{a &amp; b \\\\ c &amp; d}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mi data-latex="d">d</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Quantity_7', () =>
    toXmlMatch(
      tex2mml('\\mqty(a & b \\\\ c & d)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(a &amp; b \\\\ c &amp; d)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right)" data-latex="\\mqty(a &amp; b \\\\ c &amp; d)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Quantity_8', () =>
    toXmlMatch(
      tex2mml('\\mqty*(a & b \\\\ c & d)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty*(a &amp; b \\\\ c &amp; d)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right\\rgroup" data-latex="\\mqty*(a &amp; b \\\\ c &amp; d)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Quantity_9', () =>
    toXmlMatch(
      tex2mml('\\mqty[a & b \\\\ c & d]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty[a &amp; b \\\\ c &amp; d]" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right]" data-latex="\\mqty[a &amp; b \\\\ c &amp; d]">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Quantity_10', () =>
    toXmlMatch(
      tex2mml('\\mqty|a & b \\\\ c & d|'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty|a &amp; b \\\\ c &amp; d|" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right|" data-latex="\\mqty|a &amp; b \\\\ c &amp; d|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Quantity_11', () =>
    toXmlMatch(
      tex2mml('\\mqty*|a & b\\\\ c& d|'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty*|a &amp; b\\\\ c&amp; d|" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a &amp; b\\\\ c&amp; d\\end{array}\\right|" data-latex="\\mqty*|a &amp; b\\\\ c&amp; d|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics7_10', () => {
  it('Matrices_Adiag_0', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\admat{1,2&3\\\\4&5})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\lefty{1}\\\\ \\mqty{2&amp;3\\\\4&amp;5}\\end{array}\\right)" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Adiag_1', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\admat 1)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\admat 1)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\admat 1\\end{array}\\right)" data-latex="\\mqty(\\admat 1)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Adiag_2', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\admat 1,2)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\admat 1,2)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\admat 1,2\\end{array}\\right)" data-latex="\\mqty(\\admat 1,2)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n          <mo data-latex=",">,</mo>\n          <mn data-latex="2">2</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Adiag_3', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\admat{1,2&3\\\\4&5&6,7,8})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5&amp;6,7,8})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\leftqty{1}\\\\ &amp;&amp;\\mqty{2&amp;3\\\\4&amp;5&amp;6}\\\\ &amp;\\mqty{7}\\\\ \\mqty{8}\\end{array}\\right)" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5&amp;6,7,8})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="6">6</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="7">7</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="8">8</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Adiag_4', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\admat{1,2&3\\\\4&5,6,7,8})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5,6,7,8})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\leftmqty{1}\\\\ &amp;&amp;&amp;\\mqty{2&amp;3\\\\4&amp;5}\\\\ &amp;&amp;\\mqty{6}\\\\ &amp;\\mqty{7}\\\\ \\mqty{8}\\end{array}\\right)" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5,6,7,8})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="6">6</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="7">7</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="8">8</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Adiag_5', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\admat{1,2&3\\\\4&5&6,7,8,\\dmat{9,10}})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5&amp;6,7,8,\\dmat{9,10}})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\leftmqty{1}\\\\ &amp;&amp;&amp;\\mqty{2&amp;3\\\\4&amp;5&amp;6}\\\\ &amp;&amp;\\mqty{7}\\\\ &amp;\\mqty{8}\\\\ \\mqty{\\dmat{9,10}}\\end{array}\\right)" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5&amp;6,7,8,\\dmat{9,10}})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="6">6</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="7">7</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="8">8</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n                  <mtr data-latex-item="{}" data-latex="{}">\n                    <mtd>\n                      <mn data-latex="9">9</mn>\n                    </mtd>\n                  </mtr>\n                </mtable>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd></mtd>\n              <mtd>\n                <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n                  <mtr data-latex-item="{}" data-latex="{}">\n                    <mtd>\n                      <mn data-latex="0">10</mn>\n                    </mtd>\n                  </mtr>\n                </mtable>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics7_11', () => {
  it('Matrices_Other_0', () =>
    toXmlMatch(
      tex2mml('\\mqty a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty a" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\end{array}\\right)" data-latex="\\left(\\begin{array}{} \\end{array}\\right)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}"></mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n  <mi data-latex="a">a</mi>\n</math>'
    ));
  it('Matrices_Other_1', () =>
    toXmlMatch(
      tex2mml('\\mqty1'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty1" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\end{array}\\right)" data-latex="\\left(\\begin{array}{} \\end{array}\\right)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}"></mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n  <mn data-latex="1">1</mn>\n</math>'
    ));
  it('Matrices_Other_2', () =>
    toXmlMatch(
      tex2mml('\\pmqty* 34'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty* 34" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} *\\end{array}\\right)" data-latex="\\left(\\begin{array}{} *\\end{array}\\right)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mo data-latex="*">&#x2217;</mo>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n  <mn data-latex="4">34</mn>\n</math>'
    ));
  it('Matrices_Other_3', () =>
    toXmlMatch(
      tex2mml(
        '\\mqty(\\dmat{1,2&3,4&4&5\\\\4&5,33,4,5,7,8\\\\0\\\\10&20\\\\3,200}) '
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3,4&amp;4&amp;5\\\\4&amp;5,33,4,5,7,8\\\\0\\\\10&amp;20\\\\3,200}) " display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3}\\\\ &amp;&amp;\\mqty{4&amp;4&amp;5\\\\4&amp;5}\\\\ &amp;&amp;&amp;\\mqty{33}\\\\ &amp;&amp;&amp;&amp;\\mqty{4}\\\\ &amp;&amp;&amp;&amp;&amp;\\mqty{5}\\\\ &amp;&amp;&amp;&amp;&amp;&amp;\\mqty{7}\\\\ &amp;&amp;&amp;&amp;&amp;&amp;&amp;\\mqty{8\\\\0\\\\10&amp;20\\\\3}\\\\ &amp;&amp;&amp;&amp;&amp;&amp;&amp;&amp;\\mqty{200}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3,4&amp;4&amp;5\\\\4&amp;5,33,4,5,7,8\\\\0\\\\10&amp;20\\\\3,200}) ">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="3">33</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="7">7</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="8">8</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="0">10</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="0">20</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="00">200</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Other_4', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5}) '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5}) " display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3\\\\4&amp;5}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5}) ">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Other_5', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5&6,\\imat{3},7,8,\\dmat{9,10}})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5&amp;6,\\imat{3},7,8,\\dmat{9,10}})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3\\\\4&amp;5&amp;6}\\\\ &amp;&amp;\\mqty{\\imat{3}}\\\\ &amp;&amp;&amp;\\mqty{7}\\\\ &amp;&amp;&amp;&amp;\\mqty{8}\\\\ &amp;&amp;&amp;&amp;&amp;\\mqty{\\dmat{9,10}}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5&amp;6,\\imat{3},7,8,\\dmat{9,10}})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="6">6</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="7">7</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="8">8</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n                  <mtr data-latex-item="{}" data-latex="{}">\n                    <mtd>\n                      <mn data-latex="9">9</mn>\n                    </mtd>\n                  </mtr>\n                </mtable>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd></mtd>\n              <mtd>\n                <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n                  <mtr data-latex-item="{}" data-latex="{}">\n                    <mtd>\n                      <mn data-latex="0">10</mn>\n                    </mtd>\n                  </mtr>\n                </mtable>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Other_6', () =>
    toXmlMatch(
      tex2mml(
        '\\mqty(\\mqty{1}\\\\ & \\mqty{2 & 3\\\\ 4 & 5 & 6}\\\\ & & \\mqty{\\imat{3}} \\\\ & & & \\mqty{7})'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\mqty{1}\\\\ &amp; \\mqty{2 &amp; 3\\\\ 4 &amp; 5 &amp; 6}\\\\ &amp; &amp; \\mqty{\\imat{3}} \\\\ &amp; &amp; &amp; \\mqty{7})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\mqty{1}\\\\ &amp; \\mqty{2 &amp; 3\\\\ 4 &amp; 5 &amp; 6}\\\\ &amp; &amp; \\mqty{\\imat{3}} \\\\ &amp; &amp; &amp; \\mqty{7}\\end{array}\\right)" data-latex="\\mqty(\\mqty{1}\\\\ &amp; \\mqty{2 &amp; 3\\\\ 4 &amp; 5 &amp; 6}\\\\ &amp; &amp; \\mqty{\\imat{3}} \\\\ &amp; &amp; &amp; \\mqty{7})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="6">6</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="0">0</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="7">7</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Other_7', () =>
    toXmlMatch(
      tex2mml('\\left\\lgroup\\frac{a}{b}\\right\\rgroup'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\lgroup\\frac{a}{b}\\right\\rgroup" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\frac{a}{b}\\right\\rgroup" data-latex="\\left\\lgroup\\frac{a}{b}\\right\\rgroup">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>\n    <mfrac data-latex="\\frac{a}{b}">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Other_8', () =>
    toXmlMatch(
      tex2mml('\\begin{smallmatrix} a & b \\\\ c & d \\end{smallmatrix}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{smallmatrix} a &amp; b \\\\ c &amp; d \\end{smallmatrix}" display="block">\n  <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="\\begin{smallmatrix} a &amp; b \\\\ c &amp; d \\end{smallmatrix}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mi data-latex="d">d</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Other_9', () =>
    toXmlMatch(
      tex2mml('\\smqty{\\imat{3}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty{\\imat{3}}" display="block">\n  <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="\\smqty{\\imat{3}}">\n    <mtr>\n      <mtd>\n        <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Other_10', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\imat{10}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\imat{10}}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\imat{10}}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
});

describe('Physics7_1', () => {
  it('Matrices_Fenced_0', () =>
    toXmlMatch(
      tex2mml('\\pmqty{Q} \\mqty(R)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{Q} \\mqty(R)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} Q\\end{array}\\right)" data-latex="\\left(\\begin{array}{} Q\\end{array}\\right)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="Q">Q</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} R\\end{array}\\right)" data-latex="\\left(\\begin{array}{} R\\end{array}\\right)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="R">R</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Fenced_1', () =>
    toXmlMatch(
      tex2mml('\\Pmqty{Q} \\mqty*(R)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Pmqty{Q} \\mqty*(R)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{array}{} Q\\end{array}\\right\\rgroup" data-latex="\\left\\lgroup\\begin{array}{} Q\\end{array}\\right\\rgroup">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="Q">Q</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{array}{} R\\end{array}\\right\\rgroup" data-latex="\\left\\lgroup\\begin{array}{} R\\end{array}\\right\\rgroup">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="R">R</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Fenced_2', () =>
    toXmlMatch(
      tex2mml('\\bmqty{Q} \\mqty[R]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bmqty{Q} \\mqty[R]" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{array}{} Q\\end{array}\\right]" data-latex="\\left[\\begin{array}{} Q\\end{array}\\right]">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="Q">Q</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{array}{} R\\end{array}\\right]" data-latex="\\left[\\begin{array}{} R\\end{array}\\right]">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="R">R</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Fenced_3', () =>
    toXmlMatch(
      tex2mml('\\vmqty{Q} \\mqty|R|'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vmqty{Q} \\mqty|R|" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} Q\\end{array}\\right|" data-latex="\\left|\\begin{array}{} Q\\end{array}\\right|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="Q">Q</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} R\\end{array}\\right|" data-latex="\\left|\\begin{array}{} R\\end{array}\\right|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="R">R</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Fenced_4', () =>
    toXmlMatch(
      tex2mml('\\pmqty{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{a &amp; b \\\\ c &amp; d}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right)" data-latex="\\mqty(a &amp; b \\\\ c &amp; d)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Fenced_5', () =>
    toXmlMatch(
      tex2mml('\\Pmqty{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Pmqty{a &amp; b \\\\ c &amp; d}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right\\rgroup" data-latex="\\mqty*(a &amp; b \\\\ c &amp; d)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Fenced_6', () =>
    toXmlMatch(
      tex2mml('\\bmqty{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bmqty{a &amp; b \\\\ c &amp; d}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right]" data-latex="\\mqty[a &amp; b \\\\ c &amp; d]">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Fenced_7', () =>
    toXmlMatch(
      tex2mml('\\vmqty{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vmqty{a &amp; b \\\\ c &amp; d}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right|" data-latex="\\mqty|a &amp; b \\\\ c &amp; d|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics7_2', () => {
  it('Matrices_Small_0', () =>
    toXmlMatch(
      tex2mml('\\smallmatrixquantity{Q}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smallmatrixquantity{Q}" display="block">\n  <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="\\smallmatrixquantity{Q}">\n    <mtr>\n      <mtd>\n        <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n        <mi data-latex="Q">Q</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Small_1', () =>
    toXmlMatch(
      tex2mml('\\smallmatrixquantity*{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smallmatrixquantity*{a &amp; b \\\\ c &amp; d}" display="block">\n  <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="\\smallmatrixquantity*{a &amp; b \\\\ c &amp; d}">\n    <mtr>\n      <mtd>\n        <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mi data-latex="d">d</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Small_2', () =>
    toXmlMatch(
      tex2mml('\\smallmatrixquantity*(a & b \\\\ c & d)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smallmatrixquantity*(a &amp; b \\\\ c &amp; d)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right\\rgroup" data-latex="\\smallmatrixquantity*(a &amp; b \\\\ c &amp; d)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Small_3', () =>
    toXmlMatch(
      tex2mml('\\smallmatrixquantity(a & b \\\\ c & d)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smallmatrixquantity(a &amp; b \\\\ c &amp; d)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right)" data-latex="\\smallmatrixquantity(a &amp; b \\\\ c &amp; d)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Small_4', () =>
    toXmlMatch(
      tex2mml('\\smallmatrixquantity[a & b \\\\ c & d]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smallmatrixquantity[a &amp; b \\\\ c &amp; d]" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right]" data-latex="\\smallmatrixquantity[a &amp; b \\\\ c &amp; d]">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Small_5', () =>
    toXmlMatch(
      tex2mml('\\smallmatrixquantity|a & b \\\\ c & d|'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smallmatrixquantity|a &amp; b \\\\ c &amp; d|" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right|" data-latex="\\smallmatrixquantity|a &amp; b \\\\ c &amp; d|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Small_6', () =>
    toXmlMatch(
      tex2mml('\\smqty{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty{a &amp; b \\\\ c &amp; d}" display="block">\n  <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="\\smqty{a &amp; b \\\\ c &amp; d}">\n    <mtr>\n      <mtd>\n        <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mi data-latex="d">d</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Small_7', () =>
    toXmlMatch(
      tex2mml('\\smqty(a & b \\\\ c & d)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(a &amp; b \\\\ c &amp; d)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right)" data-latex="\\smqty(a &amp; b \\\\ c &amp; d)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Small_8', () =>
    toXmlMatch(
      tex2mml('\\smqty*(a & b \\\\ c & d)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty*(a &amp; b \\\\ c &amp; d)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right\\rgroup" data-latex="\\smqty*(a &amp; b \\\\ c &amp; d)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Small_9', () =>
    toXmlMatch(
      tex2mml('\\smqty[a & b \\\\ c & d]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty[a &amp; b \\\\ c &amp; d]" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right]" data-latex="\\smqty[a &amp; b \\\\ c &amp; d]">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Small_10', () =>
    toXmlMatch(
      tex2mml('\\smqty|a & b \\\\ c & d|'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty|a &amp; b \\\\ c &amp; d|" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right|" data-latex="\\smqty|a &amp; b \\\\ c &amp; d|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics7_3', () => {
  it('Matrices_SmallFenced_0', () =>
    toXmlMatch(
      tex2mml('\\spmqty{Q} \\smqty(R)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\spmqty{Q} \\smqty(R)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right)" data-latex="\\left(\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="Q">Q</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{smallmatrix}{} R\\end{smallmatrix}\\right)" data-latex="\\left(\\begin{smallmatrix}{} R\\end{smallmatrix}\\right)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="R">R</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_SmallFenced_1', () =>
    toXmlMatch(
      tex2mml('\\sPmqty{Q} \\smqty*(R)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sPmqty{Q} \\smqty*(R)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right\\rgroup" data-latex="\\left\\lgroup\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right\\rgroup">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="Q">Q</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{smallmatrix}{} R\\end{smallmatrix}\\right\\rgroup" data-latex="\\left\\lgroup\\begin{smallmatrix}{} R\\end{smallmatrix}\\right\\rgroup">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="R">R</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_SmallFenced_2', () =>
    toXmlMatch(
      tex2mml('\\sbmqty{Q} \\smqty[R]'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sbmqty{Q} \\smqty[R]" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right]" data-latex="\\left[\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right]">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="Q">Q</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{smallmatrix}{} R\\end{smallmatrix}\\right]" data-latex="\\left[\\begin{smallmatrix}{} R\\end{smallmatrix}\\right]">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="R">R</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_SmallFenced_3', () =>
    toXmlMatch(
      tex2mml('\\svmqty{Q} \\smqty|R|'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\svmqty{Q} \\smqty|R|" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right|" data-latex="\\left|\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="Q">Q</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} R\\end{smallmatrix}\\right|" data-latex="\\left|\\begin{smallmatrix}{} R\\end{smallmatrix}\\right|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="R">R</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_SmallFenced_4', () =>
    toXmlMatch(
      tex2mml('\\spmqty{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\spmqty{a &amp; b \\\\ c &amp; d}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right)" data-latex="\\smqty(a &amp; b \\\\ c &amp; d)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_SmallFenced_5', () =>
    toXmlMatch(
      tex2mml('\\sPmqty{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sPmqty{a &amp; b \\\\ c &amp; d}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right\\rgroup" data-latex="\\smqty*(a &amp; b \\\\ c &amp; d)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_SmallFenced_6', () =>
    toXmlMatch(
      tex2mml('\\sbmqty{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sbmqty{a &amp; b \\\\ c &amp; d}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right]" data-latex="\\smqty[a &amp; b \\\\ c &amp; d]">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_SmallFenced_7', () =>
    toXmlMatch(
      tex2mml('\\svmqty{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\svmqty{a &amp; b \\\\ c &amp; d}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right|" data-latex="\\smqty|a &amp; b \\\\ c &amp; d|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics7_4', () => {
  it('Matrices_Det_0', () =>
    toXmlMatch(
      tex2mml('\\matrixdeterminant{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixdeterminant{a &amp; b \\\\ c &amp; d}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right|" data-latex="\\mqty|a &amp; b \\\\ c &amp; d|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Det_1', () =>
    toXmlMatch(
      tex2mml('\\mdet{a & b \\\\ c & d}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mdet{a &amp; b \\\\ c &amp; d}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right|" data-latex="\\mqty|a &amp; b \\\\ c &amp; d|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Det_2', () =>
    toXmlMatch(
      tex2mml('\\smdet{a & b \\\\ c & d} '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smdet{a &amp; b \\\\ c &amp; d} " display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right|" data-latex="\\smqty|a &amp; b \\\\ c &amp; d| ">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="b">b</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="c">c</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="d">d</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Det_3', () =>
    toXmlMatch(
      tex2mml('\\matrixdeterminant a b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixdeterminant a b" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a\\end{array}\\right|" data-latex="\\left|\\begin{array}{} a\\end{array}\\right|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('Matrices_Det_4', () =>
    toXmlMatch(
      tex2mml('\\mdet a b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mdet a b" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a\\end{array}\\right|" data-latex="\\left|\\begin{array}{} a\\end{array}\\right|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('Matrices_Det_5', () =>
    toXmlMatch(
      tex2mml('\\smdet a b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smdet a b" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} a\\end{smallmatrix}\\right|" data-latex="\\left|\\begin{smallmatrix}{} a\\end{smallmatrix}\\right|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
});

describe('Physics7_5', () => {
  it('Matrices_Identity_0', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\imat{3}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\imat{3}}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\imat{3}}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Identity_1', () =>
    toXmlMatch(
      tex2mml('\\vmqty{\\imat{5}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vmqty{\\imat{5}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; 0 &amp; 0 &amp; 0\\\\ 0 &amp; 1 &amp; 0 &amp; 0 &amp; 0\\\\ 0 &amp; 0 &amp; 1 &amp; 0 &amp; 0\\\\ 0 &amp; 0 &amp; 0 &amp; 1 &amp; 0\\\\ 0 &amp; 0 &amp; 0 &amp; 0 &amp; 1\\end{array}\\right|" data-latex="\\mqty|\\imat{5}|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Identity_2', () =>
    toXmlMatch(
      tex2mml('\\vmqty{\\imat{0}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vmqty{\\imat{0}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{array}\\right|" data-latex="\\mqty|\\imat{0}|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Identity_3', () =>
    toXmlMatch(
      tex2mml('\\vmqty{\\imat{1}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vmqty{\\imat{1}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{array}\\right|" data-latex="\\mqty|\\imat{1}|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Identity_4', () =>
    toXmlMatch(
      tex2mml('\\vmqty{\\imat{-1}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vmqty{\\imat{-1}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{array}\\right|" data-latex="\\mqty|\\imat{-1}|">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Identity_5', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\imat{3}\\pmat{0}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\imat{3}\\pmat{0}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left0\\\\ 0 &amp; 1\\end{array}\\right)" data-latex="\\mqty(\\imat{3}\\pmat{0})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics7_6', () => {
  it('Matrices_XMatrix_0', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat{1}{2}{3})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat{1}{2}{3})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; 1\\\\ 1 &amp; 1 &amp; 1\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat{1}{2}{3})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_XMatrix_1', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat{a}{3}{3}) '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat{a}{3}{3}) " display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; a\\\\ a &amp; a &amp; a\\\\ a &amp; a &amp; a\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat{a}{3}{3}) ">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_XMatrix_2', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat{a}{3}{1}) '),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat{a}{3}{1}) " display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\\\ a\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat{a}{3}{1}) ">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_XMatrix_3', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat{a}{1}{3})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat{a}{1}{3})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; a\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat{a}{1}{3})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_XMatrix_4', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat*{1}{2}{3})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat*{1}{2}{3})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left}{1}} &amp; 1_{{1}{2}} &amp; 1_{{1}{3}}\\\\ 1_{{2}{1}} &amp; 1_{{2}{2}} &amp; 1_{{2}{3}}\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat*{1}{2}{3})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <msub data-latex="1_{{1}{1}}">\n            <mn data-latex="1">1</mn>\n            <mrow data-mjx-texclass="ORD" data-latex="{{1}{1}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{1}">\n                <mn data-latex="1">1</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{1}">\n                <mn data-latex="1">1</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n        <mtd>\n          <msub data-latex="1_{{1}{2}}">\n            <mn data-latex="1">1</mn>\n            <mrow data-mjx-texclass="ORD" data-latex="{{1}{2}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{1}">\n                <mn data-latex="1">1</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{2}">\n                <mn data-latex="2">2</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n        <mtd>\n          <msub data-latex="1_{{1}{3}}">\n            <mn data-latex="1">1</mn>\n            <mrow data-mjx-texclass="ORD" data-latex="{{1}{3}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{1}">\n                <mn data-latex="1">1</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{3}">\n                <mn data-latex="3">3</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <msub data-latex="1_{{2}{1}}">\n            <mn data-latex="1">1</mn>\n            <mrow data-mjx-texclass="ORD" data-latex="{{2}{1}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{2}">\n                <mn data-latex="2">2</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{1}">\n                <mn data-latex="1">1</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n        <mtd>\n          <msub data-latex="1_{{2}{2}}">\n            <mn data-latex="1">1</mn>\n            <mrow data-mjx-texclass="ORD" data-latex="{{2}{2}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{2}">\n                <mn data-latex="2">2</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{2}">\n                <mn data-latex="2">2</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n        <mtd>\n          <msub data-latex="1_{{2}{3}}">\n            <mn data-latex="1">1</mn>\n            <mrow data-mjx-texclass="ORD" data-latex="{{2}{3}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{2}">\n                <mn data-latex="2">2</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{3}">\n                <mn data-latex="3">3</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_XMatrix_5', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat*{a}{3}{3})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat*{a}{3}{3})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left}{1}} &amp; a_{{1}{2}} &amp; a_{{1}{3}}\\\\ a_{{2}{1}} &amp; a_{{2}{2}} &amp; a_{{2}{3}}\\\\ a_{{3}{1}} &amp; a_{{3}{2}} &amp; a_{{3}{3}}\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat*{a}{3}{3})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <msub data-latex="a_{{1}{1}}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{{1}{1}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{1}">\n                <mn data-latex="1">1</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{1}">\n                <mn data-latex="1">1</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n        <mtd>\n          <msub data-latex="a_{{1}{2}}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{{1}{2}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{1}">\n                <mn data-latex="1">1</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{2}">\n                <mn data-latex="2">2</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n        <mtd>\n          <msub data-latex="a_{{1}{3}}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{{1}{3}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{1}">\n                <mn data-latex="1">1</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{3}">\n                <mn data-latex="3">3</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <msub data-latex="a_{{2}{1}}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{{2}{1}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{2}">\n                <mn data-latex="2">2</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{1}">\n                <mn data-latex="1">1</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n        <mtd>\n          <msub data-latex="a_{{2}{2}}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{{2}{2}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{2}">\n                <mn data-latex="2">2</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{2}">\n                <mn data-latex="2">2</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n        <mtd>\n          <msub data-latex="a_{{2}{3}}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{{2}{3}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{2}">\n                <mn data-latex="2">2</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{3}">\n                <mn data-latex="3">3</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <msub data-latex="a_{{3}{1}}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{{3}{1}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{3}">\n                <mn data-latex="3">3</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{1}">\n                <mn data-latex="1">1</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n        <mtd>\n          <msub data-latex="a_{{3}{2}}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{{3}{2}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{3}">\n                <mn data-latex="3">3</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{2}">\n                <mn data-latex="2">2</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n        <mtd>\n          <msub data-latex="a_{{3}{3}}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{{3}{3}}">\n              <mrow data-mjx-texclass="ORD" data-latex="{3}">\n                <mn data-latex="3">3</mn>\n              </mrow>\n              <mrow data-mjx-texclass="ORD" data-latex="{3}">\n                <mn data-latex="3">3</mn>\n              </mrow>\n            </mrow>\n          </msub>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_XMatrix_6', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat*{a}{3}{1})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat*{a}{3}{1})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\\\ a_{2}\\\\ a_{3}\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat*{a}{3}{1})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <msub data-latex="a_{1}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{1}">\n              <mn data-latex="1">1</mn>\n            </mrow>\n          </msub>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <msub data-latex="a_{2}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{2}">\n              <mn data-latex="2">2</mn>\n            </mrow>\n          </msub>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <msub data-latex="a_{3}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{3}">\n              <mn data-latex="3">3</mn>\n            </mrow>\n          </msub>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_XMatrix_7', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat*{a}{1}{3})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat*{a}{1}{3})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; a_{2} &amp; a_{3}\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat*{a}{1}{3})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <msub data-latex="a_{1}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{1}">\n              <mn data-latex="1">1</mn>\n            </mrow>\n          </msub>\n        </mtd>\n        <mtd>\n          <msub data-latex="a_{2}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{2}">\n              <mn data-latex="2">2</mn>\n            </mrow>\n          </msub>\n        </mtd>\n        <mtd>\n          <msub data-latex="a_{3}">\n            <mi data-latex="a">a</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="{3}">\n              <mn data-latex="3">3</mn>\n            </mrow>\n          </msub>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_XMatrix_8', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat*{a}{1}{1})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat*{a}{1}{1})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{smallmatrix}\\right)" data-latex="\\smqty(\\xmat*{a}{1}{1})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_XMatrix_9', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat*{a}{-1}{-1})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat*{a}{-1}{-1})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{smallmatrix}\\right)" data-latex="\\smqty(\\xmat*{a}{-1}{-1})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_XMatrix_10', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\zmat{1}{3})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\zmat{1}{3})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; 0\\end{smallmatrix}\\right)" data-latex="\\smqty(\\zmat{1}{3})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_XMatrix_11', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\zmat{2}{3})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\zmat{2}{3})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; 0\\\\ 0 &amp; 0 &amp; 0\\end{smallmatrix}\\right)" data-latex="\\smqty(\\zmat{2}{3})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_XMatrix_12', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\zmat{3}{1})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\zmat{3}{1})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\\\ 0\\end{smallmatrix}\\right)" data-latex="\\smqty(\\zmat{3}{1})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics7_7', () => {
  it('Matrices_Pauli_0', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{0}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{0}}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{0}}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Pauli_1', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{0}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{0}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left0\\\\ 0 &amp; 1\\end{array}\\right)" data-latex="\\mqty(\\pmat{0})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Pauli_2', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{1}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{1}}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{1}}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Pauli_3', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{2}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{2}}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{2}}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mo data-latex="-">&#x2212;</mo>\n        <mi data-latex="i">i</mi>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mi data-latex="i">i</mi>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Pauli_4', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{3}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{3}}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{3}}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mo data-latex="-">&#x2212;</mo>\n        <mn data-latex="1">1</mn>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Pauli_5', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{4}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{4}}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{4}}"></mtable>\n</math>'
    ));
  it('Matrices_Pauli_6', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{x}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{x}}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{x}}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Pauli_7', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{y}}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{y}}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mo data-latex="-">&#x2212;</mo>\n        <mi data-latex="i">i</mi>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mi data-latex="i">i</mi>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Pauli_8', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{z}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{z}}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{z}}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="1">1</mn>\n      </mtd>\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mn data-latex="0">0</mn>\n      </mtd>\n      <mtd>\n        <mo data-latex="-">&#x2212;</mo>\n        <mn data-latex="1">1</mn>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Pauli_9', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{a}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{a}}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{a}}"></mtable>\n</math>'
    ));
  it('Matrices_Pauli_10', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{a}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{a}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\leftarray}\\right)" data-latex="\\mqty(\\pmat{a})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}"></mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Pauli_11', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{aa}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{aa}}" display="block">\n  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{aa}}">\n    <mtr data-latex-item="{}" data-latex="{}">\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Matrices_Pauli_12', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{0.a}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{0.a}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left&amp; 0\\\\ 0 &amp; 1\\end{array}\\right)" data-latex="\\mqty(\\pmat{0.a})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mo data-latex=".">.</mo>\n          <mi data-latex="a">a</mi>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics7_8', () => {
  it('Matrices_PauliFenced_0', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{1}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{1}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left1\\\\ 1 &amp; 0\\end{array}\\right)" data-latex="\\mqty(\\pmat{1})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_PauliFenced_1', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{2}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{2}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left-i\\\\ i &amp; 0\\end{array}\\right)" data-latex="\\mqty(\\pmat{2})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mo data-latex="-">&#x2212;</mo>\n          <mi data-latex="i">i</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="i">i</mi>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_PauliFenced_2', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{3}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{3}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left0\\\\ 0 &amp; -1\\end{array}\\right)" data-latex="\\mqty(\\pmat{3})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mo data-latex="-">&#x2212;</mo>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_PauliFenced_3', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{4}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{4}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\leftarray}\\right)" data-latex="\\mqty(\\pmat{4})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}"></mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_PauliFenced_4', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{x}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{x}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left1\\\\ 1 &amp; 0\\end{array}\\right)" data-latex="\\mqty(\\pmat{x})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_PauliFenced_5', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{y}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left-i\\\\ i &amp; 0\\end{array}\\right)" data-latex="\\mqty(\\pmat{y})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mo data-latex="-">&#x2212;</mo>\n          <mi data-latex="i">i</mi>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="i">i</mi>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_PauliFenced_6', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{z}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{z}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left0\\\\ 0 &amp; -1\\end{array}\\right)" data-latex="\\mqty(\\pmat{z})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n        <mtd>\n          <mo data-latex="-">&#x2212;</mo>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_PauliFenced_7', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{aa}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{aa}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{array}\\right)" data-latex="\\mqty(\\pmat{aa})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mi data-latex="a">a</mi>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
});

describe('Physics7_9', () => {
  it('Matrices_Diag_0', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3\\\\4&amp;5}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Diag_1', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat 1)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat 1)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\dmat 1\\end{array}\\right)" data-latex="\\mqty(\\dmat 1)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Diag_2', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat 1,2)'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat 1,2)" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\dmat 1,2\\end{array}\\right)" data-latex="\\mqty(\\dmat 1,2)">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mn data-latex="1">1</mn>\n          <mo data-latex=",">,</mo>\n          <mn data-latex="2">2</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Diag_3', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5&6,7,8})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5&amp;6,7,8})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3\\\\4&amp;5&amp;6}\\\\ &amp;&amp;\\mqty{7}\\\\ &amp;&amp;&amp;\\mqty{8}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5&amp;6,7,8})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="6">6</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="7">7</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="8">8</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Diag_4', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5,6,7,8})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5,6,7,8})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3\\\\4&amp;5}\\\\ &amp;&amp;\\mqty{6}\\\\ &amp;&amp;&amp;\\mqty{7}\\\\ &amp;&amp;&amp;&amp;\\mqty{8}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5,6,7,8})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="6">6</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="7">7</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="8">8</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Diag_5', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2\\\\3\\\\4\\\\5\\\\6,7,8})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2\\\\3\\\\4\\\\5\\\\6,7,8})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2\\\\3\\\\4\\\\5\\\\6}\\\\ &amp;&amp;\\mqty{7}\\\\ &amp;&amp;&amp;\\mqty{8}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2\\\\3\\\\4\\\\5\\\\6,7,8})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="6">6</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="7">7</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="8">8</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
  it('Matrices_Diag_6', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5&6,7,8,\\dmat{9,10}})'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5&amp;6,7,8,\\dmat{9,10}})" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3\\\\4&amp;5&amp;6}\\\\ &amp;&amp;\\mqty{7}\\\\ &amp;&amp;&amp;\\mqty{8}\\\\ &amp;&amp;&amp;&amp;\\mqty{\\dmat{9,10}}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5&amp;6,7,8,\\dmat{9,10}})">\n    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>\n    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="1">1</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="2">2</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="3">3</mn>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="4">4</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="5">5</mn>\n              </mtd>\n              <mtd>\n                <mn data-latex="6">6</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="7">7</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mn data-latex="8">8</mn>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n      <mtr data-latex-item="{}" data-latex="{}">\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd></mtd>\n        <mtd>\n          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd>\n                <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n                  <mtr data-latex-item="{}" data-latex="{}">\n                    <mtd>\n                      <mn data-latex="9">9</mn>\n                    </mtd>\n                  </mtr>\n                </mtable>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{}" data-latex="{}">\n              <mtd></mtd>\n              <mtd>\n                <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">\n                  <mtr data-latex-item="{}" data-latex="{}">\n                    <mtd>\n                      <mn data-latex="0">10</mn>\n                    </mtd>\n                  </mtr>\n                </mtable>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>\n  </mrow>\n</math>'
    ));
});
