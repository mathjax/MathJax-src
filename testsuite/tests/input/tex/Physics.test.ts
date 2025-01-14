import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/physics/PhysicsConfiguration';


beforeEach(() => setupTex(['base', 'physics']));

describe('Physics1_0', () => {
  it('Quantities_Quantities_0', () =>
    toXmlMatch(
      tex2mml('\\quantity'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity" display="block">
  <mrow data-mjx-texclass="INNER" data-latex="\\quantity">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mrow></mrow>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Quantities_1', () =>
    toXmlMatch(
      tex2mml('\\quantity a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity a" display="block">
  <mrow data-mjx-texclass="INNER" data-latex="\\quantity">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mrow></mrow>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
  <mi data-latex="a">a</mi>
</math>`
    ));
  it('Quantities_Quantities_2', () =>
    toXmlMatch(
      tex2mml('\\quantity\\bigg a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\bigg a" display="block">
  <merror data-mjx-error="Missing or unrecognized delimiter for \\bigg">
    <mtext>Missing or unrecognized delimiter for \\bigg</mtext>
  </merror>
</math>`
    ));
  it('Quantities_Quantities_3', () =>
    toXmlMatch(
      tex2mml('\\quantity[c]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity[c]" display="block">
  <mrow data-latex="\\quantity[c]">
    <mo data-mjx-texclass="OPEN">[</mo>
    <mi data-latex="c">c</mi>
    <mo data-mjx-texclass="CLOSE">]</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Quantities_4', () =>
    toXmlMatch(
      tex2mml('\\quantity\\sin'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\sin" display="block">
  <mrow data-mjx-texclass="INNER" data-latex="\\quantity">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mrow></mrow>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
  <mi data-latex="\\sin">sin</mi>
</math>`
    ));
  it('Quantities_Quantities_5', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg ab'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg ab" display="block">
  <merror data-mjx-error="Missing or unrecognized delimiter for \\Bigg">
    <mtext>Missing or unrecognized delimiter for \\Bigg</mtext>
  </merror>
</math>`
    ));
  it('Quantities_Quantities_6', () =>
    toXmlMatch(
      tex2mml('\\quantity\\bigg\\sin'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\bigg\\sin" display="block">
  <merror data-mjx-error="Missing or unrecognized delimiter for \\bigg">
    <mtext>Missing or unrecognized delimiter for \\bigg</mtext>
  </merror>
</math>`
    ));
  it('Quantities_Quantities_7', () =>
    toXmlMatch(
      tex2mml('\\qty(a)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty(a)" display="block">
  <mrow data-latex="\\qty(a)">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="a">a</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Quantities_8', () =>
    toXmlMatch(
      tex2mml('\\qty(\\frac{a}{\\frac{c}{b}})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty(\\frac{a}{\\frac{c}{b}})" display="block">
  <mrow data-latex="\\qty(\\frac{a}{\\frac{c}{b}})">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{a}{\\frac{c}{b}}">
      <mi data-latex="a">a</mi>
      <mfrac data-latex="\\frac{c}{b}">
        <mi data-latex="c">c</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Quantities_9', () =>
    toXmlMatch(
      tex2mml('\\qty[\\frac{a}{\\frac{c}{b}}]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty[\\frac{a}{\\frac{c}{b}}]" display="block">
  <mrow data-latex="\\qty[\\frac{a}{\\frac{c}{b}}]">
    <mo data-mjx-texclass="OPEN">[</mo>
    <mfrac data-latex="\\frac{a}{\\frac{c}{b}}">
      <mi data-latex="a">a</mi>
      <mfrac data-latex="\\frac{c}{b}">
        <mi data-latex="c">c</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">]</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Quantities_10', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg{a}" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">
    <mo minsize="2.470em" maxsize="2.470em">{</mo>
  </mrow>
  <mi data-latex="a">a</mi>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\qty\\Bigg{a}">
    <mo minsize="2.470em" maxsize="2.470em">}</mo>
  </mrow>
</math>`
    ));
});

describe('Physics1_1', () => {
  it('Quantities_Empty_0', () =>
    toXmlMatch(
      tex2mml('\\qty\\big{}[]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\big{}[]" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\bigl\\{">
    <mo minsize="1.2em" maxsize="1.2em">{</mo>
  </mrow>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\qty\\big{}">
    <mo minsize="1.2em" maxsize="1.2em">}</mo>
  </mrow>
  <mo data-latex="[" stretchy="false">[</mo>
  <mo data-latex="]" stretchy="false">]</mo>
</math>`
    ));
  it('Quantities_Empty_1', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg{}[]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg{}[]" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">
    <mo minsize="2.470em" maxsize="2.470em">{</mo>
  </mrow>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\qty\\Bigg{}">
    <mo minsize="2.470em" maxsize="2.470em">}</mo>
  </mrow>
  <mo data-latex="[" stretchy="false">[</mo>
  <mo data-latex="]" stretchy="false">]</mo>
</math>`
    ));
  it('Quantities_Empty_2', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg{}\\Bigg[]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg{}\\Bigg[]" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">
    <mo minsize="2.470em" maxsize="2.470em">{</mo>
  </mrow>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\qty\\Bigg{}">
    <mo minsize="2.470em" maxsize="2.470em">}</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="\\Bigg[">
    <mo minsize="2.470em" maxsize="2.470em">[</mo>
  </mrow>
  <mo data-latex="]" stretchy="false">]</mo>
</math>`
    ));
  it('Quantities_Empty_3', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg{}\\qty\\Bigg[]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg{}\\qty\\Bigg[]" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">
    <mo minsize="2.470em" maxsize="2.470em">{</mo>
  </mrow>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\qty\\Bigg{}">
    <mo minsize="2.470em" maxsize="2.470em">}</mo>
  </mrow>
  <mrow data-latex="]">
    <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl[">
      <mo minsize="2.470em" maxsize="2.470em">[</mo>
    </mrow>
    <mrow data-mjx-texclass="CLOSE" data-latex="\\Biggr]">
      <mo minsize="2.470em" maxsize="2.470em">]</mo>
    </mrow>
  </mrow>
</math>`
    ));
  it('Quantities_Empty_4', () =>
    toXmlMatch(
      tex2mml('\\Bigg[]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Bigg[]" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Bigg[">
    <mo minsize="2.470em" maxsize="2.470em">[</mo>
  </mrow>
  <mo data-latex="]" stretchy="false">]</mo>
</math>`
    ));
  it('Quantities_Empty_5', () =>
    toXmlMatch(
      tex2mml('\\Bigg[ \\times \\Bigg]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Bigg[ \\times \\Bigg]" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Bigg[">
    <mo minsize="2.470em" maxsize="2.470em">[</mo>
  </mrow>
  <mo data-latex="\\times">&#xD7;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="\\Bigg]">
    <mo minsize="2.470em" maxsize="2.470em">]</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Empty_6', () =>
    toXmlMatch(
      tex2mml('\\Biggl[ \\times \\Biggr]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Biggl[ \\times \\Biggr]" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl[">
    <mo minsize="2.470em" maxsize="2.470em">[</mo>
  </mrow>
  <mo data-latex="\\times">&#xD7;</mo>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\Biggr]">
    <mo minsize="2.470em" maxsize="2.470em">]</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Empty_7', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg[\\times]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg[\\times]" display="block">
  <mrow data-latex="\\qty\\Bigg[\\times]">
    <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl[">
      <mo minsize="2.470em" maxsize="2.470em">[</mo>
    </mrow>
    <mo data-latex="\\times">&#xD7;</mo>
    <mrow data-mjx-texclass="CLOSE" data-latex="\\Biggr]">
      <mo minsize="2.470em" maxsize="2.470em">]</mo>
    </mrow>
  </mrow>
</math>`
    ));
  it('Quantities_Empty_8', () =>
    toXmlMatch(
      tex2mml('\\qty\\Bigg{\\times}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty\\Bigg{\\times}" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">
    <mo minsize="2.470em" maxsize="2.470em">{</mo>
  </mrow>
  <mo data-latex="\\times">&#xD7;</mo>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\qty\\Bigg{\\times}">
    <mo minsize="2.470em" maxsize="2.470em">}</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Empty_9', () =>
    toXmlMatch(
      tex2mml('\\qty(\\frac{a}{b})\\langle\\rangle'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty(\\frac{a}{b})\\langle\\rangle" display="block">
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>
</math>`
    ));
  it('Quantities_Empty_10', () =>
    toXmlMatch(
      tex2mml('\\qty<\\frac{a}{b}>\\langle\\rangle'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qty&lt;\\frac{a}{b}&gt;\\langle\\rangle" display="block">
  <mrow data-mjx-texclass="INNER" data-latex="\\qty">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mrow></mrow>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
  <mo data-latex="&lt;">&lt;</mo>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mo data-latex="&gt;">&gt;</mo>
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>
</math>`
    ));
});

describe('Physics1_2', () => {
  it('Quantities_Big_0', () =>
    toXmlMatch(
      tex2mml('\\quantity\\big(\\frac{a}{b})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\big(\\frac{a}{b})" display="block">
  <mrow data-latex="\\quantity\\big(\\frac{a}{b})">
    <mrow data-mjx-texclass="OPEN" data-latex="\\bigl(">
      <mo minsize="1.2em" maxsize="1.2em">(</mo>
    </mrow>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr)">
      <mo minsize="1.2em" maxsize="1.2em">)</mo>
    </mrow>
  </mrow>
</math>`
    ));
  it('Quantities_Big_1', () =>
    toXmlMatch(
      tex2mml('\\quantity\\bigg(\\frac{a}{b})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\bigg(\\frac{a}{b})" display="block">
  <mrow data-latex="\\quantity\\bigg(\\frac{a}{b})">
    <mrow data-mjx-texclass="OPEN" data-latex="\\biggl(">
      <mo minsize="2.047em" maxsize="2.047em">(</mo>
    </mrow>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr)">
      <mo minsize="2.047em" maxsize="2.047em">)</mo>
    </mrow>
  </mrow>
</math>`
    ));
  it('Quantities_Big_2', () =>
    toXmlMatch(
      tex2mml('\\quantity\\Big(\\frac{a}{b})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\Big(\\frac{a}{b})" display="block">
  <mrow data-latex="\\quantity\\Big(\\frac{a}{b})">
    <mrow data-mjx-texclass="OPEN" data-latex="\\Bigl(">
      <mo minsize="1.623em" maxsize="1.623em">(</mo>
    </mrow>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mrow data-mjx-texclass="CLOSE" data-latex="\\Bigr)">
      <mo minsize="1.623em" maxsize="1.623em">)</mo>
    </mrow>
  </mrow>
</math>`
    ));
  it('Quantities_Big_3', () =>
    toXmlMatch(
      tex2mml('\\quantity\\Bigg(\\frac{a}{b})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity\\Bigg(\\frac{a}{b})" display="block">
  <mrow data-latex="\\quantity\\Bigg(\\frac{a}{b})">
    <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl(">
      <mo minsize="2.470em" maxsize="2.470em">(</mo>
    </mrow>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mrow data-mjx-texclass="CLOSE" data-latex="\\Biggr)">
      <mo minsize="2.470em" maxsize="2.470em">)</mo>
    </mrow>
  </mrow>
</math>`
    ));
  it('Quantities_Big_4', () =>
    toXmlMatch(
      tex2mml('\\pqty\\Bigg{} '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pqty\\Bigg{} " display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl(">
    <mo minsize="2.470em" maxsize="2.470em">(</mo>
  </mrow>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\pqty\\Bigg{}">
    <mo minsize="2.470em" maxsize="2.470em">)</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Big_5', () =>
    toXmlMatch(
      tex2mml('\\pqty{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pqty{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left( \\frac{a}{b} \\right)" data-latex="\\pqty{\\frac{a}{b}}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Big_6', () =>
    toXmlMatch(
      tex2mml('\\pqty\\Bigg{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pqty\\Bigg{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl(">
    <mo minsize="2.470em" maxsize="2.470em">(</mo>
  </mrow>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\pqty\\Bigg{\\frac{a}{b}}">
    <mo minsize="2.470em" maxsize="2.470em">)</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Big_7', () =>
    toXmlMatch(
      tex2mml('\\pqty\\big{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pqty\\big{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\bigl(">
    <mo minsize="1.2em" maxsize="1.2em">(</mo>
  </mrow>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\pqty\\big{\\frac{a}{b}}">
    <mo minsize="1.2em" maxsize="1.2em">)</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Big_8', () =>
    toXmlMatch(
      tex2mml('\\Bqty{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Bqty{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ \\frac{a}{b} \\right\\}" data-latex="\\Bqty{\\frac{a}{b}}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Big_9', () =>
    toXmlMatch(
      tex2mml('\\Bqty\\Bigg{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Bqty\\Bigg{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">
    <mo minsize="2.470em" maxsize="2.470em">{</mo>
  </mrow>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\Bqty\\Bigg{\\frac{a}{b}}">
    <mo minsize="2.470em" maxsize="2.470em">}</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Big_10', () =>
    toXmlMatch(
      tex2mml('\\Bqty\\big{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Bqty\\big{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\bigl\\{">
    <mo minsize="1.2em" maxsize="1.2em">{</mo>
  </mrow>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\Bqty\\big{\\frac{a}{b}}">
    <mo minsize="1.2em" maxsize="1.2em">}</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Big_11', () =>
    toXmlMatch(
      tex2mml('\\quantity*\\Bigg(\\frac{a}{b})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\quantity*\\Bigg(\\frac{a}{b})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex="\\quantity">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mrow></mrow>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
  <mo data-latex="*">&#x2217;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="\\Bigg(">
    <mo minsize="2.470em" maxsize="2.470em">(</mo>
  </mrow>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
});

describe('Physics1_3', () => {
  it('Quantities_Absval_0', () =>
    toXmlMatch(
      tex2mml('\\absolutevalue\\Bigg{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\absolutevalue\\Bigg{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl|">
    <mo minsize="2.470em" maxsize="2.470em">|</mo>
  </mrow>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\absolutevalue\\Bigg{\\frac{a}{b}}">
    <mo minsize="2.470em" maxsize="2.470em">|</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Absval_1', () =>
    toXmlMatch(
      tex2mml('\\absolutevalue{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\absolutevalue{}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|  \\right|" data-latex="\\absolutevalue{}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Absval_2', () =>
    toXmlMatch(
      tex2mml('\\abs\\Bigg{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\abs\\Bigg{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl|">
    <mo minsize="2.470em" maxsize="2.470em">|</mo>
  </mrow>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\abs\\Bigg{\\frac{a}{b}}">
    <mo minsize="2.470em" maxsize="2.470em">|</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Absval_3', () =>
    toXmlMatch(
      tex2mml('\\abs*\\Bigg{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\abs*\\Bigg{\\frac{a}{b}}" display="block">
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="\\abs*\\Bigg{\\frac{a}{b}}">|</mo>
</math>`
    ));
  it('Quantities_Absval_4', () =>
    toXmlMatch(
      tex2mml('\\norm\\Bigg{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\norm\\Bigg{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\|">
    <mo minsize="2.470em" maxsize="2.470em" symmetric="true">&#x2016;</mo>
  </mrow>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\norm\\Bigg{\\frac{a}{b}}">
    <mo minsize="2.470em" maxsize="2.470em" symmetric="true">&#x2016;</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Absval_5', () =>
    toXmlMatch(
      tex2mml('\\norm*\\Bigg{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\norm*\\Bigg{\\frac{a}{b}}" display="block">
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\|">&#x2016;</mo>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\norm*\\Bigg{\\frac{a}{b}}">&#x2016;</mo>
</math>`
    ));
  it('Quantities_Absval_6', () =>
    toXmlMatch(
      tex2mml('\\norm{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\norm{}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\|  \\right\\|" data-latex="\\norm{}">
    <mo data-mjx-texclass="OPEN" symmetric="true" data-latex-item="\\left\\|" data-latex="\\left\\|">&#x2016;</mo>
    <mo data-mjx-texclass="CLOSE" symmetric="true" data-latex-item="\\right\\|" data-latex="\\right\\|">&#x2016;</mo>
  </mrow>
</math>`
    ));
});

describe('Physics1_4', () => {
  it('Quantities_Eval_0', () =>
    toXmlMatch(
      tex2mml('\\evaluated{x}_0^\\infty'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\evaluated{x}_0^\\infty" display="block">
  <msubsup data-latex="\\evaluated{x}\\left. x \\vphantom{\\int}\\right|_0 ^\\infty">
    <mrow data-mjx-texclass="INNER" data-latex-item="\\left. x \\vphantom{\\int}\\right|" data-latex="\\left. x \\vphantom{\\int}\\right|">
      <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
      <mi data-latex="x">x</mi>
      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">
        <mpadded width="0">
          <mphantom>
            <mo data-latex="\\int">&#x222B;</mo>
          </mphantom>
        </mpadded>
      </mrow>
      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
    </mrow>
    <mn data-latex="0">0</mn>
    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>
  </msubsup>
</math>`
    ));
  it('Quantities_Eval_1', () =>
    toXmlMatch(
      tex2mml('\\eval{x}_0^\\infty'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval{x}_0^\\infty" display="block">
  <msubsup data-latex="\\eval{x}\\left. x \\vphantom{\\int}\\right|_0 ^\\infty">
    <mrow data-mjx-texclass="INNER" data-latex-item="\\left. x \\vphantom{\\int}\\right|" data-latex="\\left. x \\vphantom{\\int}\\right|">
      <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
      <mi data-latex="x">x</mi>
      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">
        <mpadded width="0">
          <mphantom>
            <mo data-latex="\\int">&#x222B;</mo>
          </mphantom>
        </mpadded>
      </mrow>
      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
    </mrow>
    <mn data-latex="0">0</mn>
    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>
  </msubsup>
</math>`
    ));
  it('Quantities_Eval_2', () =>
    toXmlMatch(
      tex2mml('\\eval*{x}_0^\\infty'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval*{x}_0^\\infty" display="block">
  <msubsup data-latex="\\eval*{x}\\left. \\smash{x} \\vphantom{\\int}\\right|_0 ^\\infty">
    <mrow data-mjx-texclass="INNER" data-latex-item="\\left. \\smash{x} \\vphantom{\\int}\\right|" data-latex="\\left. \\smash{x} \\vphantom{\\int}\\right|">
      <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
      <mrow data-mjx-texclass="ORD" data-latex="\\smash{x}">
        <mpadded height="0" depth="0">
          <mi data-latex="x">x</mi>
        </mpadded>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">
        <mpadded width="0">
          <mphantom>
            <mo data-latex="\\int">&#x222B;</mo>
          </mphantom>
        </mpadded>
      </mrow>
      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
    </mrow>
    <mn data-latex="0">0</mn>
    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>
  </msubsup>
</math>`
    ));
  it('Quantities_Eval_3', () =>
    toXmlMatch(
      tex2mml('\\eval[x|_0^\\infty'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval[x|_0^\\infty" display="block">
  <msubsup data-latex="\\eval[x|_0 ^\\infty">
    <mrow data-latex="|">
      <mo data-mjx-texclass="OPEN">[</mo>
      <mi data-latex="x">x</mi>
      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">
        <mpadded width="0">
          <mphantom>
            <mo data-latex="\\int">&#x222B;</mo>
          </mphantom>
        </mpadded>
      </mrow>
      <mo data-mjx-texclass="CLOSE">|</mo>
    </mrow>
    <mn data-latex="0">0</mn>
    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>
  </msubsup>
</math>`
    ));
  it('Quantities_Eval_4', () =>
    toXmlMatch(
      tex2mml('\\eval*(x|_0^\\infty'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval*(x|_0^\\infty" display="block">
  <msubsup data-latex="\\eval*(x|_0 ^\\infty">
    <mrow data-latex="|">
      <mo data-mjx-texclass="OPEN">(</mo>
      <mrow data-mjx-texclass="ORD">
        <mpadded height="0" depth="0">
          <mi data-latex="x">x</mi>
        </mpadded>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">
        <mpadded width="0">
          <mphantom>
            <mo data-latex="\\int">&#x222B;</mo>
          </mphantom>
        </mpadded>
      </mrow>
      <mo data-mjx-texclass="CLOSE">|</mo>
    </mrow>
    <mn data-latex="0">0</mn>
    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>
  </msubsup>
</math>`
    ));
  it('Quantities_Eval_5', () =>
    toXmlMatch(
      tex2mml('\\eval*{\\frac{A}{\\frac{A}{\\int x}}}_0^\\infty'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval*{\\frac{A}{\\frac{A}{\\int x}}}_0^\\infty" display="block">
  <msubsup data-latex="\\eval*{\\frac{A}{\\frac{A}{\\int x}}}\\left. \\smash{\\frac{A}{\\frac{A}{\\int x}}} \\vphantom{\\int}\\right|_0 ^\\infty">
    <mrow data-mjx-texclass="INNER" data-latex-item="\\left. \\smash{\\frac{A}{\\frac{A}{\\int x}}} \\vphantom{\\int}\\right|" data-latex="\\left. \\smash{\\frac{A}{\\frac{A}{\\int x}}} \\vphantom{\\int}\\right|">
      <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
      <mrow data-mjx-texclass="ORD" data-latex="\\smash{\\frac{A}{\\frac{A}{\\int x}}}">
        <mpadded height="0" depth="0">
          <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">
            <mi data-latex="A">A</mi>
            <mfrac data-latex="\\frac{A}{\\int x}">
              <mi data-latex="A">A</mi>
              <mrow data-latex="\\int x">
                <mo data-latex="\\int">&#x222B;</mo>
                <mi data-latex="x">x</mi>
              </mrow>
            </mfrac>
          </mfrac>
        </mpadded>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">
        <mpadded width="0">
          <mphantom>
            <mo data-latex="\\int">&#x222B;</mo>
          </mphantom>
        </mpadded>
      </mrow>
      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
    </mrow>
    <mn data-latex="0">0</mn>
    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>
  </msubsup>
</math>`
    ));
  it('Quantities_Eval_6', () =>
    toXmlMatch(
      tex2mml('\\eval{\\frac{A}{\\frac{A}{\\int x}}}_0^\\infty'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval{\\frac{A}{\\frac{A}{\\int x}}}_0^\\infty" display="block">
  <msubsup data-latex="\\eval{\\frac{A}{\\frac{A}{\\int x}}}\\left. \\frac{A}{\\frac{A}{\\int x}} \\vphantom{\\int}\\right|_0 ^\\infty">
    <mrow data-mjx-texclass="INNER" data-latex-item="\\left. \\frac{A}{\\frac{A}{\\int x}} \\vphantom{\\int}\\right|" data-latex="\\left. \\frac{A}{\\frac{A}{\\int x}} \\vphantom{\\int}\\right|">
      <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
      <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">
        <mi data-latex="A">A</mi>
        <mfrac data-latex="\\frac{A}{\\int x}">
          <mi data-latex="A">A</mi>
          <mrow data-latex="\\int x">
            <mo data-latex="\\int">&#x222B;</mo>
            <mi data-latex="x">x</mi>
          </mrow>
        </mfrac>
      </mfrac>
      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">
        <mpadded width="0">
          <mphantom>
            <mo data-latex="\\int">&#x222B;</mo>
          </mphantom>
        </mpadded>
      </mrow>
      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
    </mrow>
    <mn data-latex="0">0</mn>
    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>
  </msubsup>
</math>`
    ));
  it('Quantities_Eval_7', () =>
    toXmlMatch(
      tex2mml('\\eval*(\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval*(\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty" display="block">
  <msubsup data-latex="\\eval*(\\frac{A}{\\frac{A}{\\int x}}|_0 ^\\infty">
    <mrow data-latex="|">
      <mo data-mjx-texclass="OPEN">(</mo>
      <mrow data-mjx-texclass="ORD">
        <mpadded height="0" depth="0">
          <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">
            <mi data-latex="A">A</mi>
            <mfrac data-latex="\\frac{A}{\\int x}">
              <mi data-latex="A">A</mi>
              <mrow data-latex="\\int x">
                <mo data-latex="\\int">&#x222B;</mo>
                <mi data-latex="x">x</mi>
              </mrow>
            </mfrac>
          </mfrac>
        </mpadded>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">
        <mpadded width="0">
          <mphantom>
            <mo data-latex="\\int">&#x222B;</mo>
          </mphantom>
        </mpadded>
      </mrow>
      <mo data-mjx-texclass="CLOSE">|</mo>
    </mrow>
    <mn data-latex="0">0</mn>
    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>
  </msubsup>
</math>`
    ));
  it('Quantities_Eval_8', () =>
    toXmlMatch(
      tex2mml('\\eval(\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval(\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty" display="block">
  <msubsup data-latex="\\eval(\\frac{A}{\\frac{A}{\\int x}}|_0 ^\\infty">
    <mrow data-latex="|">
      <mo data-mjx-texclass="OPEN">(</mo>
      <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">
        <mi data-latex="A">A</mi>
        <mfrac data-latex="\\frac{A}{\\int x}">
          <mi data-latex="A">A</mi>
          <mrow data-latex="\\int x">
            <mo data-latex="\\int">&#x222B;</mo>
            <mi data-latex="x">x</mi>
          </mrow>
        </mfrac>
      </mfrac>
      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">
        <mpadded width="0">
          <mphantom>
            <mo data-latex="\\int">&#x222B;</mo>
          </mphantom>
        </mpadded>
      </mrow>
      <mo data-mjx-texclass="CLOSE">|</mo>
    </mrow>
    <mn data-latex="0">0</mn>
    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>
  </msubsup>
</math>`
    ));
  it('Quantities_Eval_9', () =>
    toXmlMatch(
      tex2mml('\\eval*[\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval*[\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty" display="block">
  <msubsup data-latex="\\eval*[\\frac{A}{\\frac{A}{\\int x}}|_0 ^\\infty">
    <mrow data-latex="|">
      <mo data-mjx-texclass="OPEN">[</mo>
      <mrow data-mjx-texclass="ORD">
        <mpadded height="0" depth="0">
          <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">
            <mi data-latex="A">A</mi>
            <mfrac data-latex="\\frac{A}{\\int x}">
              <mi data-latex="A">A</mi>
              <mrow data-latex="\\int x">
                <mo data-latex="\\int">&#x222B;</mo>
                <mi data-latex="x">x</mi>
              </mrow>
            </mfrac>
          </mfrac>
        </mpadded>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">
        <mpadded width="0">
          <mphantom>
            <mo data-latex="\\int">&#x222B;</mo>
          </mphantom>
        </mpadded>
      </mrow>
      <mo data-mjx-texclass="CLOSE">|</mo>
    </mrow>
    <mn data-latex="0">0</mn>
    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>
  </msubsup>
</math>`
    ));
  it('Quantities_Eval_10', () =>
    toXmlMatch(
      tex2mml('\\eval[\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval[\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty" display="block">
  <msubsup data-latex="\\eval[\\frac{A}{\\frac{A}{\\int x}}|_0 ^\\infty">
    <mrow data-latex="|">
      <mo data-mjx-texclass="OPEN">[</mo>
      <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">
        <mi data-latex="A">A</mi>
        <mfrac data-latex="\\frac{A}{\\int x}">
          <mi data-latex="A">A</mi>
          <mrow data-latex="\\int x">
            <mo data-latex="\\int">&#x222B;</mo>
            <mi data-latex="x">x</mi>
          </mrow>
        </mfrac>
      </mfrac>
      <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{\\int}">
        <mpadded width="0">
          <mphantom>
            <mo data-latex="\\int">&#x222B;</mo>
          </mphantom>
        </mpadded>
      </mrow>
      <mo data-mjx-texclass="CLOSE">|</mo>
    </mrow>
    <mn data-latex="0">0</mn>
    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>
  </msubsup>
</math>`
    ));
});

describe('Physics1_5', () => {
  it('Quantities_Order_0', () =>
    toXmlMatch(
      tex2mml('\\order{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\order{}" display="block">
  <mi data-mjx-variant="-tex-calligraphic" data-mjx-texclass="OP" mathvariant="script">O</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(  \\right)" data-latex="\\left(  \\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Order_1', () =>
    toXmlMatch(
      tex2mml('\\order{x^2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\order{x^2}" display="block">
  <mi data-mjx-variant="-tex-calligraphic" data-mjx-texclass="OP" mathvariant="script">O</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left( x^2  \\right)" data-latex="\\left( x^2  \\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <msup data-latex="x^2">
      <mi data-latex="x">x</mi>
      <mn data-latex="2">2</mn>
    </msup>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Order_2', () =>
    toXmlMatch(
      tex2mml('\\order\\Bigg{x^2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\order\\Bigg{x^2}" display="block">
  <mi data-mjx-variant="-tex-calligraphic" data-mjx-texclass="OP" mathvariant="script">O</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl(">
    <mo minsize="2.470em" maxsize="2.470em">(</mo>
  </mrow>
  <msup data-latex="x^2">
    <mi data-latex="x">x</mi>
    <mn data-latex="2">2</mn>
  </msup>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\order\\Bigg{x^2}">
    <mo minsize="2.470em" maxsize="2.470em">)</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Order_3', () =>
    toXmlMatch(
      tex2mml('\\order{\\frac{A}{\\frac{A}{\\int x}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\order{\\frac{A}{\\frac{A}{\\int x}}}" display="block">
  <mi data-mjx-variant="-tex-calligraphic" data-mjx-texclass="OP" mathvariant="script">O</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left( \\frac{A}{\\frac{A}{\\int x}} \\right)" data-latex="\\left( \\frac{A}{\\frac{A}{\\int x}} \\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">
      <mi data-latex="A">A</mi>
      <mfrac data-latex="\\frac{A}{\\int x}">
        <mi data-latex="A">A</mi>
        <mrow data-latex="\\int x">
          <mo data-latex="\\int">&#x222B;</mo>
          <mi data-latex="x">x</mi>
        </mrow>
      </mfrac>
    </mfrac>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Order_4', () =>
    toXmlMatch(
      tex2mml('\\order*{\\frac{A}{\\frac{A}{\\int x}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\order*{\\frac{A}{\\frac{A}{\\int x}}}" display="block">
  <mi data-mjx-variant="-tex-calligraphic" data-mjx-texclass="OP" mathvariant="script">O</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">
    <mi data-latex="A">A</mi>
    <mfrac data-latex="\\frac{A}{\\int x}">
      <mi data-latex="A">A</mi>
      <mrow data-latex="\\int x">
        <mo data-latex="\\int">&#x222B;</mo>
        <mi data-latex="x">x</mi>
      </mrow>
    </mfrac>
  </mfrac>
  <mo data-latex="\\order*{\\frac{A}{\\frac{A}{\\int x}}}" stretchy="false">)</mo>
</math>`
    ));
});

describe('Physics1_6', () => {
  it('Quantities_Comm_0', () =>
    toXmlMatch(
      tex2mml('\\comm{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\comm{A}{B}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[ A,B \\right]" data-latex="\\comm{A}{B}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
    <mi data-latex="A">A</mi>
    <mo data-latex=",">,</mo>
    <mi data-latex="B">B</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Comm_1', () =>
    toXmlMatch(
      tex2mml('\\comm{\\frac{A}{\\frac{A}{\\int x}}}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\comm{\\frac{A}{\\frac{A}{\\int x}}}{B}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[ \\frac{A}{\\frac{A}{\\int x}},B \\right]" data-latex="\\comm{\\frac{A}{\\frac{A}{\\int x}}}{B}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
    <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">
      <mi data-latex="A">A</mi>
      <mfrac data-latex="\\frac{A}{\\int x}">
        <mi data-latex="A">A</mi>
        <mrow data-latex="\\int x">
          <mo data-latex="\\int">&#x222B;</mo>
          <mi data-latex="x">x</mi>
        </mrow>
      </mfrac>
    </mfrac>
    <mo data-latex=",">,</mo>
    <mi data-latex="B">B</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Comm_2', () =>
    toXmlMatch(
      tex2mml('\\comm\\Bigg{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\comm\\Bigg{A}{B}" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl[">
    <mo minsize="2.470em" maxsize="2.470em">[</mo>
  </mrow>
  <mi data-latex="A">A</mi>
  <mo data-latex=",">,</mo>
  <mi data-latex="B">B</mi>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\comm\\Bigg{A}{B}">
    <mo minsize="2.470em" maxsize="2.470em">]</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Comm_3', () =>
    toXmlMatch(
      tex2mml('\\comm*{\\frac{A}{\\frac{A}{\\int x}}}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\comm*{\\frac{A}{\\frac{A}{\\int x}}}{B}" display="block">
  <mo data-latex="[" stretchy="false">[</mo>
  <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">
    <mi data-latex="A">A</mi>
    <mfrac data-latex="\\frac{A}{\\int x}">
      <mi data-latex="A">A</mi>
      <mrow data-latex="\\int x">
        <mo data-latex="\\int">&#x222B;</mo>
        <mi data-latex="x">x</mi>
      </mrow>
    </mfrac>
  </mfrac>
  <mo data-latex=",">,</mo>
  <mi data-latex="B">B</mi>
  <mo data-latex="\\comm*{\\frac{A}{\\frac{A}{\\int x}}}{B}" stretchy="false">]</mo>
</math>`
    ));
  it('Quantities_Comm_4', () =>
    toXmlMatch(
      tex2mml('\\comm*\\Bigg{\\frac{X}{Y}}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\comm*\\Bigg{\\frac{X}{Y}}{B}" display="block">
  <mo data-latex="[" stretchy="false">[</mo>
  <mfrac data-latex="\\frac{X}{Y}">
    <mi data-latex="X">X</mi>
    <mi data-latex="Y">Y</mi>
  </mfrac>
  <mo data-latex=",">,</mo>
  <mi data-latex="B">B</mi>
  <mo data-latex="\\comm*\\Bigg{\\frac{X}{Y}}{B}" stretchy="false">]</mo>
</math>`
    ));
  it('Quantities_Comm_5', () =>
    toXmlMatch(
      tex2mml('\\comm{A}B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\comm{A}B" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[ A,B \\right]" data-latex="\\comm{A}B">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
    <mi data-latex="A">A</mi>
    <mo data-latex=",">,</mo>
    <mi data-latex="B">B</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
  </mrow>
</math>`
    ));
});

describe('Physics1_7', () => {
  it('Quantities_Acomm_0', () =>
    toXmlMatch(
      tex2mml('\\acomm{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acomm{A}{B}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ A,B \\right\\}" data-latex="\\acomm{A}{B}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>
    <mi data-latex="A">A</mi>
    <mo data-latex=",">,</mo>
    <mi data-latex="B">B</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Acomm_1', () =>
    toXmlMatch(
      tex2mml('\\anticommutator{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\anticommutator{A}{B}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ A,B \\right\\}" data-latex="\\anticommutator{A}{B}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>
    <mi data-latex="A">A</mi>
    <mo data-latex=",">,</mo>
    <mi data-latex="B">B</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Acomm_2', () =>
    toXmlMatch(
      tex2mml('\\poissonbracket{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\poissonbracket{A}{B}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ A,B \\right\\}" data-latex="\\poissonbracket{A}{B}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>
    <mi data-latex="A">A</mi>
    <mo data-latex=",">,</mo>
    <mi data-latex="B">B</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Acomm_3', () =>
    toXmlMatch(
      tex2mml('\\pb{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pb{A}{B}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ A,B \\right\\}" data-latex="\\pb{A}{B}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>
    <mi data-latex="A">A</mi>
    <mo data-latex=",">,</mo>
    <mi data-latex="B">B</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Acomm_4', () =>
    toXmlMatch(
      tex2mml('\\acomm{\\frac{A}{\\frac{A}{\\int x}}}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acomm{\\frac{A}{\\frac{A}{\\int x}}}{B}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ \\frac{A}{\\frac{A}{\\int x}},B \\right\\}" data-latex="\\acomm{\\frac{A}{\\frac{A}{\\int x}}}{B}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>
    <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">
      <mi data-latex="A">A</mi>
      <mfrac data-latex="\\frac{A}{\\int x}">
        <mi data-latex="A">A</mi>
        <mrow data-latex="\\int x">
          <mo data-latex="\\int">&#x222B;</mo>
          <mi data-latex="x">x</mi>
        </mrow>
      </mfrac>
    </mfrac>
    <mo data-latex=",">,</mo>
    <mi data-latex="B">B</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Acomm_5', () =>
    toXmlMatch(
      tex2mml('\\acomm\\Bigg{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acomm\\Bigg{A}{B}" display="block">
  <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\{">
    <mo minsize="2.470em" maxsize="2.470em">{</mo>
  </mrow>
  <mi data-latex="A">A</mi>
  <mo data-latex=",">,</mo>
  <mi data-latex="B">B</mi>
  <mrow data-mjx-texclass="CLOSE" data-latex="\\acomm\\Bigg{A}{B}">
    <mo minsize="2.470em" maxsize="2.470em">}</mo>
  </mrow>
</math>`
    ));
  it('Quantities_Acomm_6', () =>
    toXmlMatch(
      tex2mml('\\acomm*{\\frac{A}{\\frac{A}{\\int x}}}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acomm*{\\frac{A}{\\frac{A}{\\int x}}}{B}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\{">{</mo>
  <mfrac data-latex="\\frac{A}{\\frac{A}{\\int x}}">
    <mi data-latex="A">A</mi>
    <mfrac data-latex="\\frac{A}{\\int x}">
      <mi data-latex="A">A</mi>
      <mrow data-latex="\\int x">
        <mo data-latex="\\int">&#x222B;</mo>
        <mi data-latex="x">x</mi>
      </mrow>
    </mfrac>
  </mfrac>
  <mo data-latex=",">,</mo>
  <mi data-latex="B">B</mi>
  <mo fence="false" stretchy="false" data-latex="\\acomm*{\\frac{A}{\\frac{A}{\\int x}}}{B}">}</mo>
</math>`
    ));
  it('Quantities_Acomm_7', () =>
    toXmlMatch(
      tex2mml('\\acomm{A}B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acomm{A}B" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ A,B \\right\\}" data-latex="\\acomm{A}B">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>
    <mi data-latex="A">A</mi>
    <mo data-latex=",">,</mo>
    <mi data-latex="B">B</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>
  </mrow>
</math>`
    ));
});

describe('Physics2_0', () => {
  it('Vector_Bold_0', () =>
    toXmlMatch(
      tex2mml('\\vectorbold{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vectorbold{a}" display="block">
  <mi mathvariant="bold" data-latex="\\vectorbold{a}">a</mi>
</math>`
    ));
  it('Vector_Bold_1', () =>
    toXmlMatch(
      tex2mml('\\vectorbold*{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vectorbold*{a}" display="block">
  <mi mathvariant="bold-italic" data-latex="\\vectorbold*{a}">a</mi>
</math>`
    ));
  it('Vector_Bold_2', () =>
    toXmlMatch(
      tex2mml('\\vb{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{a}" display="block">
  <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>
</math>`
    ));
  it('Vector_Bold_3', () =>
    toXmlMatch(
      tex2mml('\\vb{\\Gamma}\\Gamma'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\Gamma}\\Gamma" display="block">
  <mi mathvariant="bold" data-latex="\\vb{\\Gamma}">&#x393;</mi>
  <mi mathvariant="normal" data-latex="\\Gamma">&#x393;</mi>
</math>`
    ));
  it('Vector_Bold_4', () =>
    toXmlMatch(
      tex2mml('\\vb{2}2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{2}2" display="block">
  <mn mathvariant="bold" data-latex="\\vb{2}">2</mn>
  <mn data-latex="2">2</mn>
</math>`
    ));
  it('Vector_Bold_5', () =>
    toXmlMatch(
      tex2mml('\\vb{\\theta}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\theta}" display="block">
  <mi data-latex="\\vb{\\theta}">&#x3B8;</mi>
</math>`
    ));
  it('Vector_Bold_6', () =>
    toXmlMatch(
      tex2mml(
        '\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}" display="block">
  <mi data-latex="\\theta">&#x3B8;</mi>
  <mi mathvariant="bold" data-latex="\\Gamma">&#x393;</mi>
  <mi mathvariant="bold" data-latex="a">a</mi>
  <mi data-latex="\\delta">&#x3B4;</mi>
  <mfrac data-latex="\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}">
    <mi data-latex="\\theta">&#x3B8;</mi>
    <mi mathvariant="bold" data-latex="b">b</mi>
  </mfrac>
  <mfrac data-latex="\\frac{\\theta}{b}">
    <mi data-latex="\\theta">&#x3B8;</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
</math>`
    ));
  it('Vector_Bold_7', () =>
    toXmlMatch(
      tex2mml('\\vb*{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb*{a}" display="block">
  <mi mathvariant="bold-italic" data-latex="\\vb*{a}">a</mi>
</math>`
    ));
  it('Vector_Bold_8', () =>
    toXmlMatch(
      tex2mml('\\vb*{2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb*{2}" display="block">
  <mn mathvariant="bold-italic" data-latex="\\vb*{2}">2</mn>
</math>`
    ));
  it('Vector_Bold_9', () =>
    toXmlMatch(
      tex2mml('\\vb*{\\Gamma}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb*{\\Gamma}" display="block">
  <mi mathvariant="bold-italic" data-latex="\\vb*{\\Gamma}">&#x393;</mi>
</math>`
    ));
  it('Vector_Bold_10', () =>
    toXmlMatch(
      tex2mml('\\vb*{\\theta}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb*{\\theta}" display="block">
  <mi mathvariant="bold-italic" data-latex="\\vb*{\\theta}">&#x3B8;</mi>
</math>`
    ));
});

describe('Physics2_1', () => {
  it('Vector_Special_0', () =>
    toXmlMatch(
      tex2mml('\\vb{\\mbox{ab}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\mbox{ab}}" display="block">
  <mstyle displaystyle="false" data-latex="\\vb{\\mbox{ab}}">
    <mtext>ab</mtext>
  </mstyle>
</math>`
    ));
  it('Vector_Special_1', () =>
    toXmlMatch(
      tex2mml('\\vb{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{B}" display="block">
  <mi mathvariant="bold" data-latex="\\vb{B}">B</mi>
</math>`
    ));
  it('Vector_Special_2', () =>
    toXmlMatch(
      tex2mml('\\vb{\\mathcal{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\mathcal{B}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vb{\\mathcal{B}}">
    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="B">B</mi>
  </mrow>
</math>`
    ));
  it('Vector_Special_3', () =>
    toXmlMatch(
      tex2mml('\\mathcal{\\vb{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathcal{\\vb{B}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathcal{\\vb{B}}">
    <mi mathvariant="bold" data-latex="\\vb{B}">B</mi>
  </mrow>
</math>`
    ));
  it('Vector_Special_4', () =>
    toXmlMatch(
      tex2mml('\\mathit{\\vb{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathit{\\vb{B}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathit{\\vb{B}}">
    <mi mathvariant="bold" data-latex="\\vb{B}">B</mi>
  </mrow>
</math>`
    ));
  it('Vector_Special_5', () =>
    toXmlMatch(
      tex2mml('\\vb{\\mathit{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\mathit{B}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vb{\\mathit{B}}">
    <mi data-mjx-variant="-tex-mathit" mathvariant="italic" data-latex="B">B</mi>
  </mrow>
</math>`
    ));
  it('Vector_Special_6', () =>
    toXmlMatch(
      tex2mml('\\vb{\\mathit{a}b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\mathit{a}b}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathit{a}">
    <mi data-mjx-variant="-tex-mathit" mathvariant="italic" data-latex="a">a</mi>
  </mrow>
  <mi mathvariant="bold" data-latex="\\vb{\\mathit{a}b}">b</mi>
</math>`
    ));
  it('Vector_Special_7', () =>
    toXmlMatch(
      tex2mml('\\vb{a+\\theta}{\\bf +}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{a+\\theta}{\\bf +}" display="block">
  <mi mathvariant="bold" data-latex="a">a</mi>
  <mo data-latex="+">+</mo>
  <mi data-latex="\\vb{a+\\theta}">&#x3B8;</mi>
  <mrow data-mjx-texclass="ORD" data-latex="{+}">
    <mo mathvariant="bold" data-latex="+">+</mo>
  </mrow>
</math>`
    ));
  it('Vector_Special_8', () =>
    toXmlMatch(
      tex2mml('\\vb{\\hat{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\hat{a}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vb{\\hat{a}}">
    <mover>
      <mi mathvariant="bold" data-latex="a">a</mi>
      <mo mathvariant="bold" stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Special_9', () =>
    toXmlMatch(
      tex2mml('\\vb{[}['),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{[}[" display="block">
  <mo data-latex="\\vb{[}" stretchy="false">[</mo>
  <mo data-latex="[" stretchy="false">[</mo>
</math>`
    ));
  it('Vector_Special_10', () =>
    toXmlMatch(
      tex2mml('\\vb{\\hat{}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\hat{}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vb{\\hat{}}">
    <mover>
      <mrow data-latex=""></mrow>
      <mo mathvariant="bold" stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Special_11', () =>
    toXmlMatch(
      tex2mml('\\vb{=}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{=}" display="block">
  <mo data-latex="\\vb{=}">=</mo>
</math>`
    ));
  it('Vector_Special_12', () =>
    toXmlMatch(
      tex2mml('\\vb{\\hat{=}}\\hat{=}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vb{\\hat{=}}\\hat{=}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vb{\\hat{=}}">
    <mover>
      <mo data-latex="=">=</mo>
      <mo mathvariant="bold" stretchy="false">^</mo>
    </mover>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{=}">
    <mover>
      <mo data-latex="=">=</mo>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
});

describe('Physics2_2', () => {
  it('Vector_Arrow_0', () =>
    toXmlMatch(
      tex2mml('\\va{=}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{=}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{=}}">
    <mover>
      <mo data-latex="\\vb{=}">=</mo>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Arrow_1', () =>
    toXmlMatch(
      tex2mml('\\vectorarrow{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vectorarrow{a}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{a}}">
    <mover>
      <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Arrow_2', () =>
    toXmlMatch(
      tex2mml('\\va{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{a}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{a}}">
    <mover>
      <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Arrow_3', () =>
    toXmlMatch(
      tex2mml('\\va{\\Gamma}\\Gamma'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{\\Gamma}\\Gamma" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{\\Gamma}}">
    <mover>
      <mi mathvariant="bold" data-latex="\\vb{\\Gamma}">&#x393;</mi>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
  <mi mathvariant="normal" data-latex="\\Gamma">&#x393;</mi>
</math>`
    ));
  it('Vector_Arrow_4', () =>
    toXmlMatch(
      tex2mml('\\va{2}2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{2}2" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{2}}">
    <mover>
      <mn mathvariant="bold" data-latex="\\vb{2}">2</mn>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
  <mn data-latex="2">2</mn>
</math>`
    ));
  it('Vector_Arrow_5', () =>
    toXmlMatch(
      tex2mml('\\va{\\theta}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{\\theta}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{\\theta}}">
    <mover>
      <mi data-latex="\\vb{\\theta}">&#x3B8;</mi>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Arrow_6', () =>
    toXmlMatch(
      tex2mml(
        '\\va{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}}">
    <mover>
      <mrow data-latex="\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}">
        <mi data-latex="\\theta">&#x3B8;</mi>
        <mi mathvariant="bold" data-latex="\\Gamma">&#x393;</mi>
        <mi mathvariant="bold" data-latex="a">a</mi>
        <mi data-latex="\\delta">&#x3B4;</mi>
        <mfrac data-latex="\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}">
          <mi data-latex="\\theta">&#x3B8;</mi>
          <mi mathvariant="bold" data-latex="b">b</mi>
        </mfrac>
      </mrow>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
  <mfrac data-latex="\\frac{\\theta}{b}">
    <mi data-latex="\\theta">&#x3B8;</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
</math>`
    ));
  it('Vector_Arrow_7', () =>
    toXmlMatch(
      tex2mml('\\vectorarrow*{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vectorarrow*{a}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb*{a}}">
    <mover>
      <mi mathvariant="bold-italic" data-latex="\\vb*{a}">a</mi>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Arrow_8', () =>
    toXmlMatch(
      tex2mml('\\va*{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va*{a}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb*{a}}">
    <mover>
      <mi mathvariant="bold-italic" data-latex="\\vb*{a}">a</mi>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Arrow_9', () =>
    toXmlMatch(
      tex2mml('\\va*{2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va*{2}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb*{2}}">
    <mover>
      <mn mathvariant="bold-italic" data-latex="\\vb*{2}">2</mn>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Arrow_10', () =>
    toXmlMatch(
      tex2mml('\\va*{\\Gamma}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va*{\\Gamma}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb*{\\Gamma}}">
    <mover>
      <mi mathvariant="bold-italic" data-latex="\\vb*{\\Gamma}">&#x393;</mi>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Arrow_11', () =>
    toXmlMatch(
      tex2mml('\\va*{\\theta}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va*{\\theta}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb*{\\theta}}">
    <mover>
      <mi mathvariant="bold-italic" data-latex="\\vb*{\\theta}">&#x3B8;</mi>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Arrow_12', () =>
    toXmlMatch(
      tex2mml('\\va{a}\\vec{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\va{a}\\vec{a}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vb{a}}">
    <mover>
      <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{a}">
    <mover>
      <mi data-latex="a">a</mi>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
});

describe('Physics2_3', () => {
  it('Vector_Unit_0', () =>
    toXmlMatch(
      tex2mml('\\vu{=}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{=}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{=}}">
    <mover>
      <mo data-latex="\\vb{=}">=</mo>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Unit_1', () =>
    toXmlMatch(
      tex2mml('\\vectorunit{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vectorunit{a}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{a}}">
    <mover>
      <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Unit_2', () =>
    toXmlMatch(
      tex2mml('\\vu{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{a}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{a}}">
    <mover>
      <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Unit_3', () =>
    toXmlMatch(
      tex2mml('\\vu{\\Gamma}\\Gamma'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{\\Gamma}\\Gamma" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{\\Gamma}}">
    <mover>
      <mi mathvariant="bold" data-latex="\\vb{\\Gamma}">&#x393;</mi>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
  <mi mathvariant="normal" data-latex="\\Gamma">&#x393;</mi>
</math>`
    ));
  it('Vector_Unit_4', () =>
    toXmlMatch(
      tex2mml('\\vu{2}2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{2}2" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{2}}">
    <mover>
      <mn mathvariant="bold" data-latex="\\vb{2}">2</mn>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
  <mn data-latex="2">2</mn>
</math>`
    ));
  it('Vector_Unit_5', () =>
    toXmlMatch(
      tex2mml('\\vu{\\theta}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{\\theta}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{\\theta}}">
    <mover>
      <mi data-latex="\\vb{\\theta}">&#x3B8;</mi>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Unit_6', () =>
    toXmlMatch(
      tex2mml(
        '\\vu{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}}">
    <mover>
      <mrow data-latex="\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}">
        <mi data-latex="\\theta">&#x3B8;</mi>
        <mi mathvariant="bold" data-latex="\\Gamma">&#x393;</mi>
        <mi mathvariant="bold" data-latex="a">a</mi>
        <mi data-latex="\\delta">&#x3B4;</mi>
        <mfrac data-latex="\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}">
          <mi data-latex="\\theta">&#x3B8;</mi>
          <mi mathvariant="bold" data-latex="b">b</mi>
        </mfrac>
      </mrow>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
  <mfrac data-latex="\\frac{\\theta}{b}">
    <mi data-latex="\\theta">&#x3B8;</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
</math>`
    ));
  it('Vector_Unit_7', () =>
    toXmlMatch(
      tex2mml('\\vectorunit*{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vectorunit*{a}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb*{a}}">
    <mover>
      <mi mathvariant="bold-italic" data-latex="\\vb*{a}">a</mi>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Unit_8', () =>
    toXmlMatch(
      tex2mml('\\vu*{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu*{a}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb*{a}}">
    <mover>
      <mi mathvariant="bold-italic" data-latex="\\vb*{a}">a</mi>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Unit_9', () =>
    toXmlMatch(
      tex2mml('\\vu*{2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu*{2}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb*{2}}">
    <mover>
      <mn mathvariant="bold-italic" data-latex="\\vb*{2}">2</mn>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Unit_10', () =>
    toXmlMatch(
      tex2mml('\\vu*{\\Gamma}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu*{\\Gamma}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb*{\\Gamma}}">
    <mover>
      <mi mathvariant="bold-italic" data-latex="\\vb*{\\Gamma}">&#x393;</mi>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Unit_11', () =>
    toXmlMatch(
      tex2mml('\\vu*{\\theta}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu*{\\theta}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb*{\\theta}}">
    <mover>
      <mi mathvariant="bold-italic" data-latex="\\vb*{\\theta}">&#x3B8;</mi>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector_Unit_12', () =>
    toXmlMatch(
      tex2mml('\\vu{a}\\hat{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vu{a}\\hat{a}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{\\vb{a}}">
    <mover>
      <mi mathvariant="bold" data-latex="\\vb{a}">a</mi>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="\\hat{a}">
    <mover>
      <mi data-latex="a">a</mi>
      <mo stretchy="false">^</mo>
    </mover>
  </mrow>
</math>`
    ));
});

describe('Physics2_4', () => {
  it('Vector_Gradient_0', () =>
    toXmlMatch(
      tex2mml('\\gradient '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\gradient " display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\gradient ">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
</math>`
    ));
  it('Vector_Gradient_1', () =>
    toXmlMatch(
      tex2mml('\\gradient(\\frac{a}{b})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\gradient(\\frac{a}{b})" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Vector_Gradient_2', () =>
    toXmlMatch(
      tex2mml('\\gradient[\\frac{a}{b}]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\gradient[\\frac{a}{b}]" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex="]">
    <mo data-mjx-texclass="OPEN">[</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">]</mo>
  </mrow>
</math>`
    ));
  it('Vector_Gradient_3', () =>
    toXmlMatch(
      tex2mml('\\gradient{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\gradient{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
</math>`
    ));
  it('Vector_Gradient_4', () =>
    toXmlMatch(
      tex2mml('\\grad '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\grad " display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\grad ">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
</math>`
    ));
  it('Vector_Gradient_5', () =>
    toXmlMatch(
      tex2mml('\\grad(\\frac{a}{b})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\grad(\\frac{a}{b})" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Vector_Gradient_6', () =>
    toXmlMatch(
      tex2mml('\\grad[\\frac{a}{b}]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\grad[\\frac{a}{b}]" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex="]">
    <mo data-mjx-texclass="OPEN">[</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">]</mo>
  </mrow>
</math>`
    ));
  it('Vector_Gradient_7', () =>
    toXmlMatch(
      tex2mml('\\grad{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\grad{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
</math>`
    ));
});

describe('Physics2_5', () => {
  it('Vector_Divergence_0', () =>
    toXmlMatch(
      tex2mml('a\\dotproduct b \\vdot c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\dotproduct b \\vdot c" display="block">
  <mi data-latex="a">a</mi>
  <mo mathvariant="bold" data-latex="\\dotproduct">&#x22C5;</mo>
  <mi data-latex="b">b</mi>
  <mo mathvariant="bold" data-latex="\\vdot">&#x22C5;</mo>
  <mi data-latex="c">c</mi>
</math>`
    ));
  it('Vector_Divergence_1', () =>
    toXmlMatch(
      tex2mml('\\divergence{\\frac{a}{b}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\divergence{\\frac{a}{b}c}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo mathvariant="bold" data-latex="\\vdot">&#x22C5;</mo>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mi data-latex="c">c</mi>
</math>`
    ));
  it('Vector_Divergence_2', () =>
    toXmlMatch(
      tex2mml('\\div{\\frac{a}{b}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\div{\\frac{a}{b}c}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo mathvariant="bold" data-latex="\\vdot">&#x22C5;</mo>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mi data-latex="c">c</mi>
</math>`
    ));
  it('Vector_Divergence_3', () =>
    toXmlMatch(
      tex2mml('\\div{(\\frac{a}{b}c)}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\div{(\\frac{a}{b}c)}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo mathvariant="bold" data-latex="\\vdot">&#x22C5;</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mi data-latex="c">c</mi>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Vector_Divergence_4', () =>
    toXmlMatch(
      tex2mml('\\div(\\frac{a}{b}c)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\div(\\frac{a}{b}c)" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo mathvariant="bold" data-latex="\\vdot">&#x22C5;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mi data-latex="c">c</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Vector_Divergence_5', () =>
    toXmlMatch(
      tex2mml('{\\bf\\nabla} \\cdot \\left(\\frac{a}{b}c\\right)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{\\bf\\nabla} \\cdot \\left(\\frac{a}{b}c\\right)" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="{\\nabla}">
    <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>
  </mrow>
  <mo data-latex="\\cdot">&#x22C5;</mo>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\frac{a}{b}c\\right)" data-latex="\\left(\\frac{a}{b}c\\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mi data-latex="c">c</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
});

describe('Physics2_6', () => {
  it('Vector_Curl_0', () =>
    toXmlMatch(
      tex2mml('\\curl '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\curl " display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo data-latex="\\crossproduct">&#xD7;</mo>
</math>`
    ));
  it('Vector_Curl_1', () =>
    toXmlMatch(
      tex2mml('\\curl(\\frac{a}{b})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\curl(\\frac{a}{b})" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo data-latex="\\crossproduct">&#xD7;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Vector_Curl_2', () =>
    toXmlMatch(
      tex2mml('\\curl[\\frac{a}{b}]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\curl[\\frac{a}{b}]" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo data-latex="\\crossproduct">&#xD7;</mo>
  <mrow data-latex="]">
    <mo data-mjx-texclass="OPEN">[</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">]</mo>
  </mrow>
</math>`
    ));
  it('Vector_Curl_3', () =>
    toXmlMatch(
      tex2mml('\\curl{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\curl{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vnabla">
    <mrow data-mjx-texclass="ORD">
      <mo mathvariant="bold" data-latex="\\gradientnabla">&#x2207;</mo>
    </mrow>
  </mrow>
  <mo data-latex="\\crossproduct">&#xD7;</mo>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
</math>`
    ));
});

describe('Physics2_7', () => {
  it('Vector_Laplace_0', () =>
    toXmlMatch(
      tex2mml('\\laplacian '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\laplacian " display="block">
  <msup data-latex="\\laplacian ">
    <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>
    <mn data-latex="2">2</mn>
  </msup>
</math>`
    ));
  it('Vector_Laplace_1', () =>
    toXmlMatch(
      tex2mml('\\laplacian(\\frac{a}{b})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\laplacian(\\frac{a}{b})" display="block">
  <msup data-latex="\\nabla^2 ">
    <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>
    <mn data-latex="2">2</mn>
  </msup>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Vector_Laplace_2', () =>
    toXmlMatch(
      tex2mml('\\laplacian[\\frac{a}{b}]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\laplacian[\\frac{a}{b}]" display="block">
  <msup data-latex="\\nabla^2 ">
    <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>
    <mn data-latex="2">2</mn>
  </msup>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex="]">
    <mo data-mjx-texclass="OPEN">[</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">]</mo>
  </mrow>
</math>`
    ));
  it('Vector_Laplace_3', () =>
    toXmlMatch(
      tex2mml('\\laplacian{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\laplacian{\\frac{a}{b}}" display="block">
  <msup data-latex="\\nabla^2 ">
    <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>
    <mn data-latex="2">2</mn>
  </msup>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
</math>`
    ));
});

describe('Physics3_0', () => {
  it('Operators_Trig_0', () =>
    toXmlMatch(
      tex2mml('\\sin(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin(x)" display="block">
  <mi>sin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Trig_1', () =>
    toXmlMatch(
      tex2mml('\\sinh(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sinh(x)" display="block">
  <mi>sinh</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Trig_2', () =>
    toXmlMatch(
      tex2mml('\\arcsin(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arcsin(x)" display="block">
  <mi>arcsin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Trig_3', () =>
    toXmlMatch(
      tex2mml('\\asin(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\asin(x)" display="block">
  <mi>asin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Trig_4', () =>
    toXmlMatch(
      tex2mml('\\cos(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cos(x)" display="block">
  <mi>cos</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Trig_5', () =>
    toXmlMatch(
      tex2mml('\\cosh(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cosh(x)" display="block">
  <mi>cosh</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Trig_6', () =>
    toXmlMatch(
      tex2mml('\\arccos(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccos(x)" display="block">
  <mi>arccos</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Trig_7', () =>
    toXmlMatch(
      tex2mml('\\acos(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acos(x)" display="block">
  <mi>acos</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Trig_8', () =>
    toXmlMatch(
      tex2mml('\\tan(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tan(x)" display="block">
  <mi>tan</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Trig_9', () =>
    toXmlMatch(
      tex2mml('\\tanh(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tanh(x)" display="block">
  <mi>tanh</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Trig_10', () =>
    toXmlMatch(
      tex2mml('\\arctan(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arctan(x)" display="block">
  <mi>arctan</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Trig_11', () =>
    toXmlMatch(
      tex2mml('\\atan(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\atan(x)" display="block">
  <mi>atan</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
});

describe('Physics3_1', () => {
  it('Operators_Arc_0', () =>
    toXmlMatch(
      tex2mml('\\csc(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\csc(x)" display="block">
  <mi>csc</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Arc_1', () =>
    toXmlMatch(
      tex2mml('\\csch(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\csch(x)" display="block">
  <mi>csch</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Arc_2', () =>
    toXmlMatch(
      tex2mml('\\arccsc(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccsc(x)" display="block">
  <mi>arccsc</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Arc_3', () =>
    toXmlMatch(
      tex2mml('\\acsc(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acsc(x)" display="block">
  <mi>acsc</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Arc_4', () =>
    toXmlMatch(
      tex2mml('\\sec(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sec(x)" display="block">
  <mi>sec</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Arc_5', () =>
    toXmlMatch(
      tex2mml('\\sech(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sech(x)" display="block">
  <mi>sech</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Arc_6', () =>
    toXmlMatch(
      tex2mml('\\arcsec(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arcsec(x)" display="block">
  <mi>arcsec</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Arc_7', () =>
    toXmlMatch(
      tex2mml('\\asec(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\asec(x)" display="block">
  <mi>asec</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Arc_8', () =>
    toXmlMatch(
      tex2mml('\\cot(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cot(x)" display="block">
  <mi>cot</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Arc_9', () =>
    toXmlMatch(
      tex2mml('\\coth(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\coth(x)" display="block">
  <mi>coth</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Arc_10', () =>
    toXmlMatch(
      tex2mml('\\arccot(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccot(x)" display="block">
  <mi>arccot</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Arc_11', () =>
    toXmlMatch(
      tex2mml('\\acot(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acot(x)" display="block">
  <mi>acot</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
});

describe('Physics3_2', () => {
  it('Operators_TrigLarge_0', () =>
    toXmlMatch(
      tex2mml('\\sin(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin(\\frac{x}{y})" display="block">
  <mi>sin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_TrigLarge_1', () =>
    toXmlMatch(
      tex2mml('\\sinh(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sinh(\\frac{x}{y})" display="block">
  <mi>sinh</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_TrigLarge_2', () =>
    toXmlMatch(
      tex2mml('\\arcsin(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arcsin(\\frac{x}{y})" display="block">
  <mi>arcsin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_TrigLarge_3', () =>
    toXmlMatch(
      tex2mml('\\asin(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\asin(\\frac{x}{y})" display="block">
  <mi>asin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_TrigLarge_4', () =>
    toXmlMatch(
      tex2mml('\\cos(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cos(\\frac{x}{y})" display="block">
  <mi>cos</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_TrigLarge_5', () =>
    toXmlMatch(
      tex2mml('\\cosh(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cosh(\\frac{x}{y})" display="block">
  <mi>cosh</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_TrigLarge_6', () =>
    toXmlMatch(
      tex2mml('\\arccos(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccos(\\frac{x}{y})" display="block">
  <mi>arccos</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_TrigLarge_7', () =>
    toXmlMatch(
      tex2mml('\\acos(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acos(\\frac{x}{y})" display="block">
  <mi>acos</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_TrigLarge_8', () =>
    toXmlMatch(
      tex2mml('\\tan(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tan(\\frac{x}{y})" display="block">
  <mi>tan</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_TrigLarge_9', () =>
    toXmlMatch(
      tex2mml('\\tanh(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tanh(\\frac{x}{y})" display="block">
  <mi>tanh</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_TrigLarge_10', () =>
    toXmlMatch(
      tex2mml('\\arctan(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arctan(\\frac{x}{y})" display="block">
  <mi>arctan</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_TrigLarge_11', () =>
    toXmlMatch(
      tex2mml('\\atan(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\atan(\\frac{x}{y})" display="block">
  <mi>atan</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
});

describe('Physics3_3', () => {
  it('Operators_ArcLarge_0', () =>
    toXmlMatch(
      tex2mml('\\csc(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\csc(\\frac{x}{y})" display="block">
  <mi>csc</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_ArcLarge_1', () =>
    toXmlMatch(
      tex2mml('\\csch(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\csch(\\frac{x}{y})" display="block">
  <mi>csch</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_ArcLarge_2', () =>
    toXmlMatch(
      tex2mml('\\arccsc(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccsc(\\frac{x}{y})" display="block">
  <mi>arccsc</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_ArcLarge_3', () =>
    toXmlMatch(
      tex2mml('\\acsc(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acsc(\\frac{x}{y})" display="block">
  <mi>acsc</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_ArcLarge_4', () =>
    toXmlMatch(
      tex2mml('\\sec(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sec(\\frac{x}{y})" display="block">
  <mi>sec</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_ArcLarge_5', () =>
    toXmlMatch(
      tex2mml('\\sech(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sech(\\frac{x}{y})" display="block">
  <mi>sech</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_ArcLarge_6', () =>
    toXmlMatch(
      tex2mml('\\arcsec(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arcsec(\\frac{x}{y})" display="block">
  <mi>arcsec</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_ArcLarge_7', () =>
    toXmlMatch(
      tex2mml('\\asec(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\asec(\\frac{x}{y})" display="block">
  <mi>asec</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_ArcLarge_8', () =>
    toXmlMatch(
      tex2mml('\\cot(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cot(\\frac{x}{y})" display="block">
  <mi>cot</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_ArcLarge_9', () =>
    toXmlMatch(
      tex2mml('\\coth(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\coth(\\frac{x}{y})" display="block">
  <mi>coth</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_ArcLarge_10', () =>
    toXmlMatch(
      tex2mml('\\arccot(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccot(\\frac{x}{y})" display="block">
  <mi>arccot</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_ArcLarge_11', () =>
    toXmlMatch(
      tex2mml('\\acot(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acot(\\frac{x}{y})" display="block">
  <mi>acot</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
});

describe('Physics3_4', () => {
  it('Operators_Exp_0', () =>
    toXmlMatch(
      tex2mml('\\sin x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin x" display="block">
  <mi data-latex="\\sin">sin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="x">x</mi>
</math>`
    ));
  it('Operators_Exp_1', () =>
    toXmlMatch(
      tex2mml('\\sin{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin{x}" display="block">
  <mi data-latex="\\sin">sin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{x}">
    <mi data-latex="x">x</mi>
  </mrow>
</math>`
    ));
  it('Operators_Exp_2', () =>
    toXmlMatch(
      tex2mml('\\sin[x]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[x]" display="block">
  <msup data-latex="\\sin[x]">
    <mi>sin</mi>
    <mi data-latex="x">x</mi>
  </msup>
</math>`
    ));
  it('Operators_Exp_3', () =>
    toXmlMatch(
      tex2mml('\\sin[2]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[2]{x}" display="block">
  <msup data-latex="\\sin[2]">
    <mi>sin</mi>
    <mn data-latex="2">2</mn>
  </msup>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{x}">
    <mi data-latex="x">x</mi>
  </mrow>
</math>`
    ));
  it('Operators_Exp_4', () =>
    toXmlMatch(
      tex2mml('\\sin[2]x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[2]x" display="block">
  <msup data-latex="\\sin[2]">
    <mi>sin</mi>
    <mn data-latex="2">2</mn>
  </msup>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="x">x</mi>
</math>`
    ));
  it('Operators_Exp_5', () =>
    toXmlMatch(
      tex2mml('\\sin[2]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[2]" display="block">
  <msup data-latex="\\sin[2]">
    <mi>sin</mi>
    <mn data-latex="2">2</mn>
  </msup>
</math>`
    ));
  it('Operators_Exp_6', () =>
    toXmlMatch(
      tex2mml('\\sin|\\frac{x}{y}|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin|\\frac{x}{y}|" display="block">
  <mi data-latex="\\sin">sin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
</math>`
    ));
  it('Operators_Exp_7', () =>
    toXmlMatch(
      tex2mml('\\sin[\\frac{x}{y}]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[\\frac{x}{y}]" display="block">
  <msup data-latex="\\sin[\\frac{x}{y}]">
    <mi>sin</mi>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
  </msup>
</math>`
    ));
  it('Operators_Exp_8', () =>
    toXmlMatch(
      tex2mml("\\sin['](\\frac{x}{y})"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[\'](\\frac{x}{y})" display="block">
  <msup>
    <mi>sin</mi>
    <msup data-latex="\'">
      <mi></mi>
      <mo data-mjx-alternate="1" data-latex="\'">&#x2032;</mo>
    </msup>
  </msup>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Exp_9', () =>
    toXmlMatch(
      tex2mml("\\sin[']{\\frac{x}{y}}"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin[\']{\\frac{x}{y}}" display="block">
  <msup data-latex="\\sin[\']">
    <mi>sin</mi>
    <msup data-latex="\'">
      <mi></mi>
      <mo data-mjx-alternate="1" data-latex="\'">&#x2032;</mo>
    </msup>
  </msup>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
  </mrow>
</math>`
    ));
  it('Operators_Exp_10', () =>
    toXmlMatch(
      tex2mml('\\sine(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sine(\\frac{x}{y})" display="block">
  <mi data-latex="\\sine">sin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Operators_Exp_11', () =>
    toXmlMatch(
      tex2mml('\\hypsine'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\hypsine" display="block">
  <mi data-latex="\\hypsine">sinh</mi>
</math>`
    ));
  it('Operators_Exp_12', () =>
    toXmlMatch(
      tex2mml('\\log[2](x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\log[2](x)" display="block">
  <msup>
    <mi>log</mi>
    <mn data-latex="2">2</mn>
  </msup>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Exp_13', () =>
    toXmlMatch(
      tex2mml('\\ln[2](x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ln[2](x)" display="block">
  <msup>
    <mi>ln</mi>
    <mn data-latex="2">2</mn>
  </msup>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Exp_14', () =>
    toXmlMatch(
      tex2mml('\\exp[2](x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\exp[2](x)" display="block">
  <mi data-latex="\\exp">exp</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="[" stretchy="false">[</mo>
  <mn data-latex="2">2</mn>
  <mo data-latex="]" stretchy="false">]</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="x">x</mi>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Operators_Exp_15', () =>
    toXmlMatch(
      tex2mml('\\det[2](x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\det[2](x)" display="block">
  <mi data-latex="\\det">det</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="[" stretchy="false">[</mo>
  <mn data-latex="2">2</mn>
  <mo data-latex="]" stretchy="false">]</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="x">x</mi>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Operators_Exp_16', () =>
    toXmlMatch(
      tex2mml('\\Pr[2](x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Pr[2](x)" display="block">
  <mi data-latex="\\Pr">Pr</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="[" stretchy="false">[</mo>
  <mn data-latex="2">2</mn>
  <mo data-latex="]" stretchy="false">]</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="x">x</mi>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
});

describe('Physics3_5', () => {
  it('Operators_Operators_0', () =>
    toXmlMatch(
      tex2mml('\\tr\\rho'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tr\\rho" display="block">
  <mi data-latex="\\tr">tr</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="\\rho">&#x3C1;</mi>
</math>`
    ));
  it('Operators_Operators_1', () =>
    toXmlMatch(
      tex2mml('\\tr(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tr(\\frac{x}{y})" display="block">
  <mi>tr</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Operators_2', () =>
    toXmlMatch(
      tex2mml('\\tr[2](\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tr[2](\\frac{x}{y})" display="block">
  <mi data-latex="\\tr">tr</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="[" stretchy="false">[</mo>
  <mn data-latex="2">2</mn>
  <mo data-latex="]" stretchy="false">]</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Operators_Operators_3', () =>
    toXmlMatch(
      tex2mml('\\rank\\rho'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\rank\\rho" display="block">
  <mi data-latex="\\rank">rank</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="\\rho">&#x3C1;</mi>
</math>`
    ));
  it('Operators_Operators_4', () =>
    toXmlMatch(
      tex2mml('\\rank(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\rank(\\frac{x}{y})" display="block">
  <mi data-latex="\\rank">rank</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Operators_Operators_5', () =>
    toXmlMatch(
      tex2mml('\\rank[2](\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\rank[2](\\frac{x}{y})" display="block">
  <mi data-latex="\\rank">rank</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="[" stretchy="false">[</mo>
  <mn data-latex="2">2</mn>
  <mo data-latex="]" stretchy="false">]</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Operators_Operators_6', () =>
    toXmlMatch(
      tex2mml('\\erf\\rho'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\erf\\rho" display="block">
  <mi data-latex="\\erf">erf</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="\\rho">&#x3C1;</mi>
</math>`
    ));
  it('Operators_Operators_7', () =>
    toXmlMatch(
      tex2mml('\\erf(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\erf(\\frac{x}{y})" display="block">
  <mi>erf</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Operators_8', () =>
    toXmlMatch(
      tex2mml('\\erf[2](\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\erf[2](\\frac{x}{y})" display="block">
  <mi data-latex="\\erf">erf</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="[" stretchy="false">[</mo>
  <mn data-latex="2">2</mn>
  <mo data-latex="]" stretchy="false">]</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Operators_Operators_9', () =>
    toXmlMatch(
      tex2mml('\\Res\\rho'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res\\rho" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Res">
    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="\\rho">&#x3C1;</mi>
</math>`
    ));
  it('Operators_Operators_10', () =>
    toXmlMatch(
      tex2mml('\\Res(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res(\\frac{x}{y})" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Res}">
    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Operators_Operators_11', () =>
    toXmlMatch(
      tex2mml('\\Res[\\frac{x}{y}]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res[\\frac{x}{y}]" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Res}">
    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex="]">
    <mo data-mjx-texclass="OPEN">[</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">]</mo>
  </mrow>
</math>`
    ));
  it('Operators_Operators_12', () =>
    toXmlMatch(
      tex2mml('\\Res{\\frac{x}{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res{\\frac{x}{y}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Res}">
    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ \\frac{x}{y} \\right\\}" data-latex="\\left\\{ \\frac{x}{y} \\right\\}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>
  </mrow>
</math>`
    ));
  it('Operators_Operators_13', () =>
    toXmlMatch(
      tex2mml('\\Res|\\frac{x}{y}|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res|\\frac{x}{y}|" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Res">
    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
</math>`
    ));
  it('Operators_Operators_14', () =>
    toXmlMatch(
      tex2mml('\\Res \\frac{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res \\frac{x}{y}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Res">
    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
</math>`
    ));
  it('Operators_Operators_15', () =>
    toXmlMatch(
      tex2mml('\\Res[2](\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Res[2](\\frac{x}{y})" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Res}">
    <mi data-mjx-auto-op="false" data-latex="Res">Res</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-latex="]">
    <mo data-mjx-texclass="OPEN">[</mo>
    <mn data-latex="2">2</mn>
    <mo data-mjx-texclass="CLOSE">]</mo>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
});

describe('Physics3_6', () => {
  it('Operators_PV_0', () =>
    toXmlMatch(
      tex2mml('\\principalvalue{\\int f(z) \\dd{z}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\principalvalue{\\int f(z) \\dd{z}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="{\\cal P}">
    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="\\int">&#x222B;</mo>
  <mi data-latex="f">f</mi>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="z">z</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mi data-latex="z">z</mi>
  </mrow>
</math>`
    ));
  it('Operators_PV_1', () =>
    toXmlMatch(
      tex2mml('\\pv{\\int f(z) \\dd{z}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pv{\\int f(z) \\dd{z}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="{\\cal P}">
    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="\\int">&#x222B;</mo>
  <mi data-latex="f">f</mi>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="z">z</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mi data-latex="z">z</mi>
  </mrow>
</math>`
    ));
  it('Operators_PV_2', () =>
    toXmlMatch(
      tex2mml('\\pv{\\int f(z) \\dd{z}}a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pv{\\int f(z) \\dd{z}}a" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="{\\cal P}">
    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="\\int">&#x222B;</mo>
  <mi data-latex="f">f</mi>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="z">z</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mi data-latex="z">z</mi>
  </mrow>
  <mi data-latex="a">a</mi>
</math>`
    ));
  it('Operators_PV_3', () =>
    toXmlMatch(
      tex2mml('\\pv\\int f(z) \\dd{z}a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pv\\int f(z) \\dd{z}a" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\pv">
    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="\\int">&#x222B;</mo>
  <mi data-latex="f">f</mi>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="z">z</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mi data-latex="z">z</mi>
  </mrow>
  <mi data-latex="a">a</mi>
</math>`
    ));
  it('Operators_PV_4', () =>
    toXmlMatch(
      tex2mml('\\pv(\\int f(z))'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pv(\\int f(z))" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\pv">
    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mo data-latex="\\int">&#x222B;</mo>
  <mi data-latex="f">f</mi>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="z">z</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Operators_PV_5', () =>
    toXmlMatch(
      tex2mml('\\pv|\\int f(z)|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pv|\\int f(z)|" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\pv">
    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
  <mo data-latex="\\int">&#x222B;</mo>
  <mi data-latex="f">f</mi>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="z">z</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
</math>`
    ));
  it('Operators_PV_6', () =>
    toXmlMatch(
      tex2mml('\\pv[\\int f(z)]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pv[\\int f(z)]" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\pv">
    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="P">P</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="[" stretchy="false">[</mo>
  <mo data-latex="\\int">&#x222B;</mo>
  <mi data-latex="f">f</mi>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="z">z</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mo data-latex="]" stretchy="false">]</mo>
</math>`
    ));
  it('Operators_PV_7', () =>
    toXmlMatch(
      tex2mml('\\PV{\\int f(z) \\dd{z}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\PV{\\int f(z) \\dd{z}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="{\\rm P.V.}">
    <mi mathvariant="normal" data-latex="P">P</mi>
    <mo data-latex=".">.</mo>
    <mi mathvariant="normal" data-latex="V">V</mi>
    <mo data-latex=".">.</mo>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="\\int">&#x222B;</mo>
  <mi data-latex="f">f</mi>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="z">z</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mi data-latex="z">z</mi>
  </mrow>
</math>`
    ));
  it('Operators_PV_8', () =>
    toXmlMatch(
      tex2mml('\\PV{\\int f(z) \\dd{z}}a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\PV{\\int f(z) \\dd{z}}a" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="{\\rm P.V.}">
    <mi mathvariant="normal" data-latex="P">P</mi>
    <mo data-latex=".">.</mo>
    <mi mathvariant="normal" data-latex="V">V</mi>
    <mo data-latex=".">.</mo>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="\\int">&#x222B;</mo>
  <mi data-latex="f">f</mi>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="z">z</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mi data-latex="z">z</mi>
  </mrow>
  <mi data-latex="a">a</mi>
</math>`
    ));
  it('Operators_PV_9', () =>
    toXmlMatch(
      tex2mml('\\PV\\int f(z) \\dd{z}a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\PV\\int f(z) \\dd{z}a" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\PV">
    <mi mathvariant="normal" data-latex="P">P</mi>
    <mo data-latex=".">.</mo>
    <mi mathvariant="normal" data-latex="V">V</mi>
    <mo data-latex=".">.</mo>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="\\int">&#x222B;</mo>
  <mi data-latex="f">f</mi>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="z">z</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mrow data-mjx-texclass="OP" data-latex="\\dd{z}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mi data-latex="z">z</mi>
  </mrow>
  <mi data-latex="a">a</mi>
</math>`
    ));
});

describe('Physics3_7', () => {
  it('Operators_Imaginary_0', () =>
    toXmlMatch(
      tex2mml('\\Re\\rho'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re\\rho" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Re">
    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="\\rho">&#x3C1;</mi>
</math>`
    ));
  it('Operators_Imaginary_1', () =>
    toXmlMatch(
      tex2mml('\\Re(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re(\\frac{x}{y})" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Re">
    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Operators_Imaginary_2', () =>
    toXmlMatch(
      tex2mml('\\Re[\\frac{x}{y}]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re[\\frac{x}{y}]" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Re">
    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="[" stretchy="false">[</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex="]" stretchy="false">]</mo>
</math>`
    ));
  it('Operators_Imaginary_3', () =>
    toXmlMatch(
      tex2mml('\\Re{\\frac{x}{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re{\\frac{x}{y}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Re}">
    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ \\frac{x}{y} \\right\\}" data-latex="\\left\\{ \\frac{x}{y} \\right\\}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>
  </mrow>
</math>`
    ));
  it('Operators_Imaginary_4', () =>
    toXmlMatch(
      tex2mml('\\Re|\\frac{x}{y}|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re|\\frac{x}{y}|" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Re">
    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
</math>`
    ));
  it('Operators_Imaginary_5', () =>
    toXmlMatch(
      tex2mml('\\Re \\frac{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re \\frac{x}{y}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Re">
    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
</math>`
    ));
  it('Operators_Imaginary_6', () =>
    toXmlMatch(
      tex2mml('\\Re[2](\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Re[2](\\frac{x}{y})" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Re">
    <mi data-mjx-auto-op="false" data-latex="Re">Re</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="[" stretchy="false">[</mo>
  <mn data-latex="2">2</mn>
  <mo data-latex="]" stretchy="false">]</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Operators_Imaginary_7', () =>
    toXmlMatch(
      tex2mml('\\real'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\real" display="block">
  <mi mathvariant="normal" data-latex="\\real">&#x211C;</mi>
</math>`
    ));
  it('Operators_Imaginary_8', () =>
    toXmlMatch(
      tex2mml('\\real{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\real{x}" display="block">
  <mi mathvariant="normal" data-latex="\\real">&#x211C;</mi>
  <mrow data-mjx-texclass="ORD" data-latex="{x}">
    <mi data-latex="x">x</mi>
  </mrow>
</math>`
    ));
  it('Operators_Imaginary_9', () =>
    toXmlMatch(
      tex2mml('\\Im\\rho'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im\\rho" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Im">
    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="\\rho">&#x3C1;</mi>
</math>`
    ));
  it('Operators_Imaginary_10', () =>
    toXmlMatch(
      tex2mml('\\Im(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im(\\frac{x}{y})" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Im">
    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Operators_Imaginary_11', () =>
    toXmlMatch(
      tex2mml('\\Im[\\frac{x}{y}]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im[\\frac{x}{y}]" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Im">
    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="[" stretchy="false">[</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex="]" stretchy="false">]</mo>
</math>`
    ));
  it('Operators_Imaginary_12', () =>
    toXmlMatch(
      tex2mml('\\Im{\\frac{x}{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im{\\frac{x}{y}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Im}">
    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{ \\frac{x}{y} \\right\\}" data-latex="\\left\\{ \\frac{x}{y} \\right\\}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>
  </mrow>
</math>`
    ));
  it('Operators_Imaginary_13', () =>
    toXmlMatch(
      tex2mml('\\Im|\\frac{x}{y}|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im|\\frac{x}{y}|" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Im">
    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
</math>`
    ));
  it('Operators_Imaginary_14', () =>
    toXmlMatch(
      tex2mml('\\Im \\frac{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im \\frac{x}{y}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Im">
    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
</math>`
    ));
  it('Operators_Imaginary_15', () =>
    toXmlMatch(
      tex2mml('\\Im[2](\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Im[2](\\frac{x}{y})" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\Im">
    <mi data-mjx-auto-op="false" data-latex="Im">Im</mi>
  </mrow>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="[" stretchy="false">[</mo>
  <mn data-latex="2">2</mn>
  <mo data-latex="]" stretchy="false">]</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Operators_Imaginary_16', () =>
    toXmlMatch(
      tex2mml('\\imaginary'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\imaginary" display="block">
  <mi mathvariant="normal" data-latex="\\imaginary">&#x2111;</mi>
</math>`
    ));
  it('Operators_Imaginary_17', () =>
    toXmlMatch(
      tex2mml('\\imaginary{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\imaginary{x}" display="block">
  <mi mathvariant="normal" data-latex="\\imaginary">&#x2111;</mi>
  <mrow data-mjx-texclass="ORD" data-latex="{x}">
    <mi data-latex="x">x</mi>
  </mrow>
</math>`
    ));
});

describe('Physics4_0', () => {
  it('QuickQuad_0_0', () =>
    toXmlMatch(
      tex2mml('\\qcc'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qcc" display="block">
  <mspace width="1em" data-latex="\\quad"></mspace>
  <mtext data-latex="\\text{c.c.}">c.c.</mtext>
  <mspace width="1em" data-latex="\\quad"></mspace>
</math>`
    ));
  it('QuickQuad_0_1', () =>
    toXmlMatch(
      tex2mml('\\qand'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\qand" display="block">
  <mspace width="1em" data-latex="\\quad"></mspace>
  <mtext data-latex="\\text{and}">and</mtext>
  <mspace width="1em" data-latex="\\quad"></mspace>
</math>`
    ));
  it('QuickQuad_0_2', () =>
    toXmlMatch(
      tex2mml('a\\qc b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\qc b" display="block">
  <mi data-latex="\\qqtext*{,}">a</mi>
  <mtext data-latex="\\text{,}">,</mtext>
  <mspace width="1em" data-latex="\\quad"></mspace>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('QuickQuad_0_3', () =>
    toXmlMatch(
      tex2mml('a\\qqtext{hello}b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\qqtext{hello}b" display="block">
  <mi data-latex="\\qqtext{hello}">a</mi>
  <mspace width="1em" data-latex="\\quad"></mspace>
  <mtext data-latex="\\text{hello}">hello</mtext>
  <mspace width="1em" data-latex="\\quad"></mspace>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('QuickQuad_0_4', () =>
    toXmlMatch(
      tex2mml('a\\qqtext*{hello}b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\qqtext*{hello}b" display="block">
  <mi data-latex="\\qqtext*{hello}">a</mi>
  <mtext data-latex="\\text{hello}">hello</mtext>
  <mspace width="1em" data-latex="\\quad"></mspace>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('QuickQuad_0_5', () =>
    toXmlMatch(
      tex2mml('a\\qqtext ab'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\qqtext ab" display="block">
  <mi data-latex="\\qqtext a">a</mi>
  <mspace width="1em" data-latex="\\quad"></mspace>
  <mtext data-latex="\\text{a}">a</mtext>
  <mspace width="1em" data-latex="\\quad"></mspace>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('QuickQuad_0_6', () =>
    toXmlMatch(
      tex2mml('a\\qqtext* ab'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\qqtext* ab" display="block">
  <mi data-latex="\\qqtext* a">a</mi>
  <mtext data-latex="\\text{a}">a</mtext>
  <mspace width="1em" data-latex="\\quad"></mspace>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('QuickQuad_0_7', () =>
    toXmlMatch(
      tex2mml('three\\qif two'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="three\\qif two" display="block">
  <mi data-latex="t">t</mi>
  <mi data-latex="h">h</mi>
  <mi data-latex="r">r</mi>
  <mi data-latex="e">e</mi>
  <mi data-latex="\\qif">e</mi>
  <mspace width="1em" data-latex="\\quad"></mspace>
  <mtext data-latex="\\text{if}">if</mtext>
  <mspace width="1em" data-latex="\\quad"></mspace>
  <mi data-latex="t">t</mi>
  <mi data-latex="w">w</mi>
  <mi data-latex="o">o</mi>
</math>`
    ));
});

describe('Physics5_0', () => {
  it('Derivatives_Deriv_0', () =>
    toXmlMatch(
      tex2mml('\\dv x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv x" display="block">
  <mfrac data-latex="\\dv x">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mrow data-latex="\\diffd x  ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Deriv_1', () =>
    toXmlMatch(
      tex2mml('\\dv x(ll)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv x(ll)" display="block">
  <mfrac data-latex="\\frac{\\diffd }{\\diffd x  }">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mrow data-latex="\\diffd x  ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="l">l</mi>
    <mi data-latex="l">l</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Deriv_2', () =>
    toXmlMatch(
      tex2mml('\\dv{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv{x}{y}" display="block">
  <mfrac data-latex="\\dv{x}{y}">
    <mrow data-latex="\\diffd x">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mi data-latex="x">x</mi>
    </mrow>
    <mrow data-latex="\\diffd y  ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mi data-latex="y">y</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Deriv_3', () =>
    toXmlMatch(
      tex2mml('\\dv[n]{f}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv[n]{f}{x}" display="block">
  <mfrac data-latex="\\dv[n]{f}{x}">
    <mrow data-latex="\\diffd^{n}f">
      <msup data-latex="\\diffd^{n}">
        <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
          <mi mathvariant="normal" data-latex="d">d</mi>
        </mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\diffd x^{n} ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <msup data-latex="x^{n}">
        <mi data-latex="x">x</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Deriv_4', () =>
    toXmlMatch(
      tex2mml('\\dv{f}{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv{f}{x}{y}" display="block">
  <mfrac data-latex="\\dv{f}{x}">
    <mrow data-latex="\\diffd f">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\diffd x  ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
  <mrow data-mjx-texclass="ORD" data-latex="{y}">
    <mi data-latex="y">y</mi>
  </mrow>
</math>`
    ));
  it('Derivatives_Deriv_5', () =>
    toXmlMatch(
      tex2mml('\\dv{f}{x}y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv{f}{x}y" display="block">
  <mfrac data-latex="\\dv{f}{x}">
    <mrow data-latex="\\diffd f">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\diffd x  ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
  <mi data-latex="y">y</mi>
</math>`
    ));
  it('Derivatives_Deriv_6', () =>
    toXmlMatch(
      tex2mml('\\dv{x}y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv{x}y" display="block">
  <mfrac data-latex="\\dv{x}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mrow data-latex="\\diffd x  ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
  <mi data-latex="y">y</mi>
</math>`
    ));
  it('Derivatives_Deriv_7', () =>
    toXmlMatch(
      tex2mml('\\dv[n]{f}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv[n]{f}(\\frac{x}{y})" display="block">
  <mfrac data-latex="\\frac{\\diffd^{n}}{\\diffd f^{n} }">
    <msup data-latex="\\diffd^{n}">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{n}">
        <mi data-latex="n">n</mi>
      </mrow>
    </msup>
    <mrow data-latex="\\diffd f^{n} ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <msup data-latex="f^{n}">
        <mi data-latex="f">f</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Deriv_8', () =>
    toXmlMatch(
      tex2mml('\\dv[n]{f}{x}{y}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv[n]{f}{x}{y}(\\frac{x}{y})" display="block">
  <mfrac data-latex="\\dv[n]{f}{x}">
    <mrow data-latex="\\diffd^{n}f">
      <msup data-latex="\\diffd^{n}">
        <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
          <mi mathvariant="normal" data-latex="d">d</mi>
        </mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\diffd x^{n} ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <msup data-latex="x^{n}">
        <mi data-latex="x">x</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
  <mrow data-mjx-texclass="ORD" data-latex="{y}">
    <mi data-latex="y">y</mi>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Derivatives_Deriv_9', () =>
    toXmlMatch(
      tex2mml('\\dv*[n]{f}{x}{y}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv*[n]{f}{x}{y}(\\frac{x}{y})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\diffd^{n}f\\middle/\\diffd x^{n} \\right." data-latex="\\left.\\diffd^{n}f\\middle/\\diffd x^{n} \\right.">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <msup data-latex="\\diffd^{n}">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{n}">
        <mi data-latex="n">n</mi>
      </mrow>
    </msup>
    <mi data-latex="f">f</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <msup data-latex="x^{n}">
      <mi data-latex="x">x</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{n}">
        <mi data-latex="n">n</mi>
      </mrow>
    </msup>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{y}">
    <mi data-latex="y">y</mi>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Derivatives_Deriv_10', () =>
    toXmlMatch(
      tex2mml('\\dv*[]{f}{x}{y}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv*[]{f}{x}{y}(\\frac{x}{y})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\diffd^{}f\\middle/\\diffd x^{} \\right." data-latex="\\left.\\diffd^{}f\\middle/\\diffd x^{} \\right.">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <msup data-latex="\\diffd^{}">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    </msup>
    <mi data-latex="f">f</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <msup data-latex="x^{}">
      <mi data-latex="x">x</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    </msup>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{y}">
    <mi data-latex="y">y</mi>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Derivatives_Deriv_11', () =>
    toXmlMatch(
      tex2mml('\\dv[]{f}{x}{y}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv[]{f}{x}{y}(\\frac{x}{y})" display="block">
  <mfrac data-latex="\\dv[]{f}{x}">
    <mrow data-latex="\\diffd^{}f">
      <msup data-latex="\\diffd^{}">
        <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
          <mi mathvariant="normal" data-latex="d">d</mi>
        </mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
      </msup>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\diffd x^{} ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <msup data-latex="x^{}">
        <mi data-latex="x">x</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
      </msup>
    </mrow>
  </mfrac>
  <mrow data-mjx-texclass="ORD" data-latex="{y}">
    <mi data-latex="y">y</mi>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Derivatives_Deriv_12', () =>
    toXmlMatch(
      tex2mml('\\dv[5](\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv[5](\\frac{x}{y})" display="block">
  <mfrac data-latex="\\dv[5](">
    <msup data-latex="\\diffd^{5}">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{5}">
        <mn data-latex="5">5</mn>
      </mrow>
    </msup>
    <mrow data-latex="\\diffd (^{5} ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <msup data-latex="(^{5}">
        <mo data-latex="(" stretchy="false">(</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{5}">
          <mn data-latex="5">5</mn>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Derivatives_Deriv_13', () =>
    toXmlMatch(
      tex2mml('\\dv[5]{f}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv[5]{f}" display="block">
  <mfrac data-latex="\\dv[5]{f}">
    <msup data-latex="\\diffd^{5}">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{5}">
        <mn data-latex="5">5</mn>
      </mrow>
    </msup>
    <mrow data-latex="\\diffd f^{5} ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <msup data-latex="f^{5}">
        <mi data-latex="f">f</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{5}">
          <mn data-latex="5">5</mn>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Deriv_14', () =>
    toXmlMatch(
      tex2mml('\\dv{f}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dv{f}" display="block">
  <mfrac data-latex="\\dv{f}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mrow data-latex="\\diffd f  ">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mi data-latex="f">f</mi>
    </mrow>
  </mfrac>
</math>`
    ));
});

describe('Physics5_1', () => {
  it('Derivatives_Partial_0', () =>
    toXmlMatch(
      tex2mml('\\flatfrac{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\flatfrac{x}{y}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.x\\middle/y\\right." data-latex="\\left.x\\middle/y\\right.">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <mi data-latex="x">x</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mi data-latex="y">y</mi>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Partial_1', () =>
    toXmlMatch(
      tex2mml('\\flatfrac{x^2}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\flatfrac{x^2}{y}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.x^2 \\middle/y\\right." data-latex="\\left.x^2 \\middle/y\\right.">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <msup data-latex="x^2">
      <mi data-latex="x">x</mi>
      <mn data-latex="2">2</mn>
    </msup>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mi data-latex="y">y</mi>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Partial_2', () =>
    toXmlMatch(
      tex2mml('\\pdv x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv x" display="block">
  <mfrac data-latex="\\pdv x">
    <mi data-latex="\\partial ">&#x2202;</mi>
    <mrow data-latex="\\partial x  ">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Partial_3', () =>
    toXmlMatch(
      tex2mml('\\pdv x(ll)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv x(ll)" display="block">
  <mfrac data-latex="\\frac{\\partial }{\\partial x  }">
    <mi data-latex="\\partial ">&#x2202;</mi>
    <mrow data-latex="\\partial x  ">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="l">l</mi>
    <mi data-latex="l">l</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Partial_4', () =>
    toXmlMatch(
      tex2mml('\\pdv{f}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv{f}" display="block">
  <mfrac data-latex="\\pdv{f}">
    <mi data-latex="\\partial ">&#x2202;</mi>
    <mrow data-latex="\\partial f  ">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="f">f</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Partial_5', () =>
    toXmlMatch(
      tex2mml('\\pdv{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv{x}{y}" display="block">
  <mfrac data-latex="\\pdv{x}{y}">
    <mrow data-latex="\\partial x">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="x">x</mi>
    </mrow>
    <mrow data-latex="\\partial y  ">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="y">y</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Partial_6', () =>
    toXmlMatch(
      tex2mml('\\pdv[n]{f}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv[n]{f}{x}" display="block">
  <mfrac data-latex="\\pdv[n]{f}{x}">
    <mrow data-latex="\\partial^{n}f">
      <msup data-latex="\\partial^{n}">
        <mi data-latex="\\partial">&#x2202;</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\partial x^{n} ">
      <mi data-latex="\\partial">&#x2202;</mi>
      <msup data-latex="x^{n}">
        <mi data-latex="x">x</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Partial_7', () =>
    toXmlMatch(
      tex2mml('\\pdv{f}{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv{f}{x}{y}" display="block">
  <mfrac data-latex="\\pdv{f}{x}{y}">
    <mrow data-latex="\\partial^{2}f">
      <msup data-latex="\\partial^{2}">
        <mi data-latex="\\partial">&#x2202;</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{2}">
          <mn data-latex="2">2</mn>
        </mrow>
      </msup>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\partial x  \\partial y">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="x">x</mi>
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="y">y</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Partial_8', () =>
    toXmlMatch(
      tex2mml('\\pdv{f}{x}y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv{f}{x}y" display="block">
  <mfrac data-latex="\\pdv{f}{x}">
    <mrow data-latex="\\partial f">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\partial x  ">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
  <mi data-latex="y">y</mi>
</math>`
    ));
  it('Derivatives_Partial_9', () =>
    toXmlMatch(
      tex2mml('\\pdv{x}y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv{x}y" display="block">
  <mfrac data-latex="\\pdv{x}">
    <mi data-latex="\\partial ">&#x2202;</mi>
    <mrow data-latex="\\partial x  ">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
  <mi data-latex="y">y</mi>
</math>`
    ));
  it('Derivatives_Partial_10', () =>
    toXmlMatch(
      tex2mml('\\pdv*{f}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv*{f}{x}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\partial f\\middle/\\partial x  \\right." data-latex="\\pdv*{f}{x}">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <mi data-latex="\\partial">&#x2202;</mi>
    <mi data-latex="f">f</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mi data-latex="\\partial">&#x2202;</mi>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Partial_11', () =>
    toXmlMatch(
      tex2mml('\\pdv*[3]{f}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv*[3]{f}{x}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\partial^{3}f\\middle/\\partial x^{3} \\right." data-latex="\\pdv*[3]{f}{x}">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <msup data-latex="\\partial^{3}">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{3}">
        <mn data-latex="3">3</mn>
      </mrow>
    </msup>
    <mi data-latex="f">f</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mi data-latex="\\partial">&#x2202;</mi>
    <msup data-latex="x^{3}">
      <mi data-latex="x">x</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{3}">
        <mn data-latex="3">3</mn>
      </mrow>
    </msup>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Partial_12', () =>
    toXmlMatch(
      tex2mml('\\pdv[n]{f}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv[n]{f}(\\frac{x}{y})" display="block">
  <mfrac data-latex="\\frac{\\partial^{n}}{\\partial f^{n} }">
    <msup data-latex="\\partial^{n}">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{n}">
        <mi data-latex="n">n</mi>
      </mrow>
    </msup>
    <mrow data-latex="\\partial f^{n} ">
      <mi data-latex="\\partial">&#x2202;</mi>
      <msup data-latex="f^{n}">
        <mi data-latex="f">f</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Partial_13', () =>
    toXmlMatch(
      tex2mml('\\pdv[n]{f}{x}{y}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv[n]{f}{x}{y}(\\frac{x}{y})" display="block">
  <mfrac data-latex="\\pdv[n]{f}{x}{y}(\\frac{x}{y})">
    <mrow data-latex="\\partial^{2}f">
      <msup data-latex="\\partial^{2}">
        <mi data-latex="\\partial">&#x2202;</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{2}">
          <mn data-latex="2">2</mn>
        </mrow>
      </msup>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\partial x  \\partial y">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="x">x</mi>
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="y">y</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Partial_14', () =>
    toXmlMatch(
      tex2mml('\\pdv*[n]{f}{x}{y}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv*[n]{f}{x}{y}(\\frac{x}{y})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\partial^{2}f\\middle/\\partial x  \\partial y\\right." data-latex="\\pdv*[n]{f}{x}{y}(\\frac{x}{y})">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <msup data-latex="\\partial^{2}">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{2}">
        <mn data-latex="2">2</mn>
      </mrow>
    </msup>
    <mi data-latex="f">f</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mi data-latex="\\partial">&#x2202;</mi>
    <mi data-latex="x">x</mi>
    <mi data-latex="\\partial">&#x2202;</mi>
    <mi data-latex="y">y</mi>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Partial_15', () =>
    toXmlMatch(
      tex2mml('\\pdv*[]{f}{x}{y}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv*[]{f}{x}{y}(\\frac{x}{y})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\partial^{2}f\\middle/\\partial x  \\partial y\\right." data-latex="\\pdv*[]{f}{x}{y}(\\frac{x}{y})">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <msup data-latex="\\partial^{2}">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{2}">
        <mn data-latex="2">2</mn>
      </mrow>
    </msup>
    <mi data-latex="f">f</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mi data-latex="\\partial">&#x2202;</mi>
    <mi data-latex="x">x</mi>
    <mi data-latex="\\partial">&#x2202;</mi>
    <mi data-latex="y">y</mi>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Partial_16', () =>
    toXmlMatch(
      tex2mml('\\pdv[]{f}{x}{y}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv[]{f}{x}{y}(\\frac{x}{y})" display="block">
  <mfrac data-latex="\\pdv[]{f}{x}{y}(\\frac{x}{y})">
    <mrow data-latex="\\partial^{2}f">
      <msup data-latex="\\partial^{2}">
        <mi data-latex="\\partial">&#x2202;</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{2}">
          <mn data-latex="2">2</mn>
        </mrow>
      </msup>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\partial x  \\partial y">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="x">x</mi>
      <mi data-latex="\\partial">&#x2202;</mi>
      <mi data-latex="y">y</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Partial_17', () =>
    toXmlMatch(
      tex2mml('\\pdv[5](\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv[5](\\frac{x}{y})" display="block">
  <mfrac data-latex="\\pdv[5](">
    <msup data-latex="\\partial^{5}">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{5}">
        <mn data-latex="5">5</mn>
      </mrow>
    </msup>
    <mrow data-latex="\\partial (^{5} ">
      <mi data-latex="\\partial">&#x2202;</mi>
      <msup data-latex="(^{5}">
        <mo data-latex="(" stretchy="false">(</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{5}">
          <mn data-latex="5">5</mn>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Derivatives_Partial_18', () =>
    toXmlMatch(
      tex2mml('\\pdv[5]{f}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pdv[5]{f}" display="block">
  <mfrac data-latex="\\pdv[5]{f}">
    <msup data-latex="\\partial^{5}">
      <mi data-latex="\\partial">&#x2202;</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{5}">
        <mn data-latex="5">5</mn>
      </mrow>
    </msup>
    <mrow data-latex="\\partial f^{5} ">
      <mi data-latex="\\partial">&#x2202;</mi>
      <msup data-latex="f^{5}">
        <mi data-latex="f">f</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{5}">
          <mn data-latex="5">5</mn>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
</math>`
    ));
});

describe('Physics5_2', () => {
  it('Derivatives_Functional_0', () =>
    toXmlMatch(
      tex2mml('\\fdv x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv x" display="block">
  <mfrac data-latex="\\fdv x">
    <mi data-latex="\\delta ">&#x3B4;</mi>
    <mrow data-latex="\\delta x  ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Functional_1', () =>
    toXmlMatch(
      tex2mml('\\fdv x(ll)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv x(ll)" display="block">
  <mfrac data-latex="\\frac{\\delta }{\\delta x  }">
    <mi data-latex="\\delta ">&#x3B4;</mi>
    <mrow data-latex="\\delta x  ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="l">l</mi>
    <mi data-latex="l">l</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Functional_2', () =>
    toXmlMatch(
      tex2mml('\\fdv{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv{x}{y}" display="block">
  <mfrac data-latex="\\fdv{x}{y}">
    <mrow data-latex="\\delta x">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mi data-latex="x">x</mi>
    </mrow>
    <mrow data-latex="\\delta y  ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mi data-latex="y">y</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Functional_3', () =>
    toXmlMatch(
      tex2mml('\\fdv{f}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv{f}" display="block">
  <mfrac data-latex="\\fdv{f}">
    <mi data-latex="\\delta ">&#x3B4;</mi>
    <mrow data-latex="\\delta f  ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mi data-latex="f">f</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Functional_4', () =>
    toXmlMatch(
      tex2mml('\\fdv[n]{f}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv[n]{f}{x}" display="block">
  <mfrac data-latex="\\fdv[n]{f}{x}">
    <mrow data-latex="\\delta^{n}f">
      <msup data-latex="\\delta^{n}">
        <mi data-latex="\\delta">&#x3B4;</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\delta x^{n} ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <msup data-latex="x^{n}">
        <mi data-latex="x">x</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Functional_5', () =>
    toXmlMatch(
      tex2mml('\\fdv{f}{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv{f}{x}{y}" display="block">
  <mfrac data-latex="\\fdv{f}{x}">
    <mrow data-latex="\\delta f">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\delta x  ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
  <mrow data-mjx-texclass="ORD" data-latex="{y}">
    <mi data-latex="y">y</mi>
  </mrow>
</math>`
    ));
  it('Derivatives_Functional_6', () =>
    toXmlMatch(
      tex2mml('\\fdv{f}{x}y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv{f}{x}y" display="block">
  <mfrac data-latex="\\fdv{f}{x}">
    <mrow data-latex="\\delta f">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\delta x  ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
  <mi data-latex="y">y</mi>
</math>`
    ));
  it('Derivatives_Functional_7', () =>
    toXmlMatch(
      tex2mml('\\fdv{x}y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv{x}y" display="block">
  <mfrac data-latex="\\fdv{x}">
    <mi data-latex="\\delta ">&#x3B4;</mi>
    <mrow data-latex="\\delta x  ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
  <mi data-latex="y">y</mi>
</math>`
    ));
  it('Derivatives_Functional_8', () =>
    toXmlMatch(
      tex2mml('\\functionalderivative*{F}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\functionalderivative*{F}{x}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\delta F\\middle/\\delta x  \\right." data-latex="\\functionalderivative*{F}{x}">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="F">F</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Functional_9', () =>
    toXmlMatch(
      tex2mml('\\fderivative*{F}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fderivative*{F}{x}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\delta F\\middle/\\delta x  \\right." data-latex="\\fderivative*{F}{x}">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="F">F</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Functional_10', () =>
    toXmlMatch(
      tex2mml('\\fdv*{F}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv*{F}{x}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\delta F\\middle/\\delta x  \\right." data-latex="\\fdv*{F}{x}">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="F">F</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="x">x</mi>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Functional_11', () =>
    toXmlMatch(
      tex2mml('\\fdv{F}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv{F}{x}" display="block">
  <mfrac data-latex="\\fdv{F}{x}">
    <mrow data-latex="\\delta F">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mi data-latex="F">F</mi>
    </mrow>
    <mrow data-latex="\\delta x  ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mi data-latex="x">x</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Functional_12', () =>
    toXmlMatch(
      tex2mml('\\fdv[2]{F}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv[2]{F}{x}" display="block">
  <mfrac data-latex="\\fdv[2]{F}{x}">
    <mrow data-latex="\\delta^{2}F">
      <msup data-latex="\\delta^{2}">
        <mi data-latex="\\delta">&#x3B4;</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{2}">
          <mn data-latex="2">2</mn>
        </mrow>
      </msup>
      <mi data-latex="F">F</mi>
    </mrow>
    <mrow data-latex="\\delta x^{2} ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <msup data-latex="x^{2}">
        <mi data-latex="x">x</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{2}">
          <mn data-latex="2">2</mn>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Derivatives_Functional_13', () =>
    toXmlMatch(
      tex2mml('\\fdv[n]{f}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv[n]{f}(\\frac{x}{y})" display="block">
  <mfrac data-latex="\\frac{\\delta^{n}}{\\delta f^{n} }">
    <msup data-latex="\\delta^{n}">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{n}">
        <mi data-latex="n">n</mi>
      </mrow>
    </msup>
    <mrow data-latex="\\delta f^{n} ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <msup data-latex="f^{n}">
        <mi data-latex="f">f</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Functional_14', () =>
    toXmlMatch(
      tex2mml('\\fdv[n]{f}{x}{y}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv[n]{f}{x}{y}(\\frac{x}{y})" display="block">
  <mfrac data-latex="\\fdv[n]{f}{x}">
    <mrow data-latex="\\delta^{n}f">
      <msup data-latex="\\delta^{n}">
        <mi data-latex="\\delta">&#x3B4;</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\delta x^{n} ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <msup data-latex="x^{n}">
        <mi data-latex="x">x</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{n}">
          <mi data-latex="n">n</mi>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
  <mrow data-mjx-texclass="ORD" data-latex="{y}">
    <mi data-latex="y">y</mi>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Derivatives_Functional_15', () =>
    toXmlMatch(
      tex2mml('\\fdv*[n]{f}{x}{y}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv*[n]{f}{x}{y}(\\frac{x}{y})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\delta^{n}f\\middle/\\delta x^{n} \\right." data-latex="\\left.\\delta^{n}f\\middle/\\delta x^{n} \\right.">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <msup data-latex="\\delta^{n}">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{n}">
        <mi data-latex="n">n</mi>
      </mrow>
    </msup>
    <mi data-latex="f">f</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mi data-latex="\\delta">&#x3B4;</mi>
    <msup data-latex="x^{n}">
      <mi data-latex="x">x</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{n}">
        <mi data-latex="n">n</mi>
      </mrow>
    </msup>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{y}">
    <mi data-latex="y">y</mi>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Derivatives_Functional_16', () =>
    toXmlMatch(
      tex2mml('\\fdv*[]{f}{x}{y}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv*[]{f}{x}{y}(\\frac{x}{y})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left.\\delta^{}f\\middle/\\delta x^{} \\right." data-latex="\\left.\\delta^{}f\\middle/\\delta x^{} \\right.">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <msup data-latex="\\delta^{}">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    </msup>
    <mi data-latex="f">f</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo stretchy="true" data-latex-item="\\middle/" data-latex="\\middle/">/</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle/"></mrow>
    <mi data-latex="\\delta">&#x3B4;</mi>
    <msup data-latex="x^{}">
      <mi data-latex="x">x</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    </msup>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{y}">
    <mi data-latex="y">y</mi>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Derivatives_Functional_17', () =>
    toXmlMatch(
      tex2mml('\\fdv[]{f}{x}{y}(\\frac{x}{y})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv[]{f}{x}{y}(\\frac{x}{y})" display="block">
  <mfrac data-latex="\\fdv[]{f}{x}">
    <mrow data-latex="\\delta^{}f">
      <msup data-latex="\\delta^{}">
        <mi data-latex="\\delta">&#x3B4;</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
      </msup>
      <mi data-latex="f">f</mi>
    </mrow>
    <mrow data-latex="\\delta x^{} ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <msup data-latex="x^{}">
        <mi data-latex="x">x</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
      </msup>
    </mrow>
  </mfrac>
  <mrow data-mjx-texclass="ORD" data-latex="{y}">
    <mi data-latex="y">y</mi>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{x}{y}">
    <mi data-latex="x">x</mi>
    <mi data-latex="y">y</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Derivatives_Functional_18', () =>
    toXmlMatch(
      tex2mml('\\fdv[5]{f}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fdv[5]{f}" display="block">
  <mfrac data-latex="\\fdv[5]{f}">
    <msup data-latex="\\delta^{5}">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{5}">
        <mn data-latex="5">5</mn>
      </mrow>
    </msup>
    <mrow data-latex="\\delta f^{5} ">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <msup data-latex="f^{5}">
        <mi data-latex="f">f</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{5}">
          <mn data-latex="5">5</mn>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
</math>`
    ));
});

describe('Physics5_3', () => {
  it('Derivatives_Var_0', () =>
    toXmlMatch(
      tex2mml('\\var A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var A" display="block">
  <mi data-latex="\\delta">&#x3B4;</mi>
  <mi data-latex="\\var A">A</mi>
</math>`
    ));
  it('Derivatives_Var_1', () =>
    toXmlMatch(
      tex2mml('\\var{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var{A}" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\var{A}">
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="A">A</mi>
  </mrow>
</math>`
    ));
  it('Derivatives_Var_2', () =>
    toXmlMatch(
      tex2mml('\\var{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var{A}{B}" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\var{A}">
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="A">A</mi>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{B}">
    <mi data-latex="B">B</mi>
  </mrow>
</math>`
    ));
  it('Derivatives_Var_3', () =>
    toXmlMatch(
      tex2mml('\\var[4]{A} B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var[4]{A} B" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\var[4]{A}">
    <msup data-latex="\\delta^{4}">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{4}">
        <mn data-latex="4">4</mn>
      </mrow>
    </msup>
    <mi data-latex="A">A</mi>
  </mrow>
  <mi data-latex="B">B</mi>
</math>`
    ));
  it('Derivatives_Var_4', () =>
    toXmlMatch(
      tex2mml('\\var{F[g(x)]}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var{F[g(x)]}" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\var{F[g(x)]}">
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="F">F</mi>
    <mo data-latex="[" stretchy="false">[</mo>
    <mi data-latex="g">g</mi>
    <mo data-latex="(" stretchy="false">(</mo>
    <mi data-latex="x">x</mi>
    <mo data-latex=")" stretchy="false">)</mo>
    <mo data-latex="]" stretchy="false">]</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Var_5', () =>
    toXmlMatch(
      tex2mml('\\var(E-TS)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var(E-TS)" display="block">
  <mi data-latex="\\delta ">&#x3B4;</mi>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mi data-latex="E">E</mi>
    <mo data-latex="-">&#x2212;</mo>
    <mi data-latex="T">T</mi>
    <mi data-latex="S">S</mi>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Var_6', () =>
    toXmlMatch(
      tex2mml('\\var{F[g(\\frac{x}{y})]}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var{F[g(\\frac{x}{y})]}" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\var{F[g(\\frac{x}{y})]}">
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="F">F</mi>
    <mo data-latex="[" stretchy="false">[</mo>
    <mi data-latex="g">g</mi>
    <mo data-latex="(" stretchy="false">(</mo>
    <mfrac data-latex="\\frac{x}{y}">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
    </mfrac>
    <mo data-latex=")" stretchy="false">)</mo>
    <mo data-latex="]" stretchy="false">]</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Var_7', () =>
    toXmlMatch(
      tex2mml('\\var{F[g\\left(\\frac{x}{y}\\right)]}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var{F[g\\left(\\frac{x}{y}\\right)]}" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\var{F[g\\left(\\frac{x}{y}\\right)]}">
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="F">F</mi>
    <mo data-latex="[" stretchy="false">[</mo>
    <mi data-latex="g">g</mi>
    <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\frac{x}{y}\\right)" data-latex="\\left(\\frac{x}{y}\\right)">
      <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
      <mfrac data-latex="\\frac{x}{y}">
        <mi data-latex="x">x</mi>
        <mi data-latex="y">y</mi>
      </mfrac>
      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
    </mrow>
    <mo data-latex="]" stretchy="false">]</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Var_8', () =>
    toXmlMatch(
      tex2mml('\\var(\\frac{a}{b})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\var(\\frac{a}{b})" display="block">
  <mi data-latex="\\delta ">&#x3B4;</mi>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Var_9', () =>
    toXmlMatch(
      tex2mml('A \\var A B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\var A B" display="block">
  <mi data-latex="A">A</mi>
  <mi data-latex="\\delta">&#x3B4;</mi>
  <mi data-latex="\\var A">A</mi>
  <mi data-latex="B">B</mi>
</math>`
    ));
  it('Derivatives_Var_10', () =>
    toXmlMatch(
      tex2mml('A \\var{A} B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\var{A} B" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="OP" data-latex="\\var{A}">
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="A">A</mi>
  </mrow>
  <mi data-latex="B">B</mi>
</math>`
    ));
  it('Derivatives_Var_11', () =>
    toXmlMatch(
      tex2mml('A \\var{A}{B} B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\var{A}{B} B" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="OP" data-latex="\\var{A}">
    <mi data-latex="\\delta">&#x3B4;</mi>
    <mi data-latex="A">A</mi>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{B}">
    <mi data-latex="B">B</mi>
  </mrow>
  <mi data-latex="B">B</mi>
</math>`
    ));
  it('Derivatives_Var_12', () =>
    toXmlMatch(
      tex2mml('A \\var[4]{A} B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\var[4]{A} B" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="OP" data-latex="\\var[4]{A}">
    <msup data-latex="\\delta^{4}">
      <mi data-latex="\\delta">&#x3B4;</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{4}">
        <mn data-latex="4">4</mn>
      </mrow>
    </msup>
    <mi data-latex="A">A</mi>
  </mrow>
  <mi data-latex="B">B</mi>
</math>`
    ));
});

describe('Physics5_4', () => {
  it('Derivatives_Differ_0', () =>
    toXmlMatch(
      tex2mml('\\dd'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\dd">
    <mi mathvariant="normal" data-latex="d">d</mi>
  </mrow>
</math>`
    ));
  it('Derivatives_Differ_1', () =>
    toXmlMatch(
      tex2mml('\\dd x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd x" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
    <mi mathvariant="normal" data-latex="d">d</mi>
  </mrow>
  <mi data-latex="\\dd x">x</mi>
</math>`
    ));
  it('Derivatives_Differ_2', () =>
    toXmlMatch(
      tex2mml('\\dd{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd{x}" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\dd{x}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mi data-latex="x">x</mi>
  </mrow>
</math>`
    ));
  it('Derivatives_Differ_3', () =>
    toXmlMatch(
      tex2mml('\\dd[3]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd[3]{x}" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\dd[3]{x}">
    <msup data-latex="\\diffd^{3}">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{3}">
        <mn data-latex="3">3</mn>
      </mrow>
    </msup>
    <mi data-latex="x">x</mi>
  </mrow>
</math>`
    ));
  it('Derivatives_Differ_4', () =>
    toXmlMatch(
      tex2mml('\\dd[3]x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd[3]x" display="block">
  <msup data-latex="\\diffd^{3}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{3}">
      <mn data-latex="3">3</mn>
    </mrow>
  </msup>
  <mi data-latex="\\dd[3]x">x</mi>
</math>`
    ));
  it('Derivatives_Differ_5', () =>
    toXmlMatch(
      tex2mml('\\dd(\\frac{\\frac{\\cos}{\\theta}}{\\theta})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd(\\frac{\\frac{\\cos}{\\theta}}{\\theta})" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">
    <mi mathvariant="normal" data-latex="d">d</mi>
  </mrow>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">
      <mfrac data-latex="\\frac{\\cos}{\\theta}">
        <mi data-latex="\\cos">cos</mi>
        <mi data-latex="\\theta">&#x3B8;</mi>
      </mfrac>
      <mi data-latex="\\theta">&#x3B8;</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Differ_6', () =>
    toXmlMatch(
      tex2mml('\\dd[4](\\frac{\\frac{\\cos}{\\theta}}{\\theta})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd[4](\\frac{\\frac{\\cos}{\\theta}}{\\theta})" display="block">
  <msup data-latex="\\diffd^{4}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{4}">
      <mn data-latex="4">4</mn>
    </mrow>
  </msup>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">
      <mfrac data-latex="\\frac{\\cos}{\\theta}">
        <mi data-latex="\\cos">cos</mi>
        <mi data-latex="\\theta">&#x3B8;</mi>
      </mfrac>
      <mi data-latex="\\theta">&#x3B8;</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Derivatives_Differ_7', () =>
    toXmlMatch(
      tex2mml('\\dd{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\dd{x}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mi data-latex="x">x</mi>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">
    <mfrac data-latex="\\frac{\\cos}{\\theta}">
      <mi data-latex="\\cos">cos</mi>
      <mi data-latex="\\theta">&#x3B8;</mi>
    </mfrac>
    <mi data-latex="\\theta">&#x3B8;</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Derivatives_Differ_8', () =>
    toXmlMatch(
      tex2mml('\\dd[4]{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd[4]{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\dd[4]{x}">
    <msup data-latex="\\diffd^{4}">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{4}">
        <mn data-latex="4">4</mn>
      </mrow>
    </msup>
    <mi data-latex="x">x</mi>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">
    <mfrac data-latex="\\frac{\\cos}{\\theta}">
      <mi data-latex="\\cos">cos</mi>
      <mi data-latex="\\theta">&#x3B8;</mi>
    </mfrac>
    <mi data-latex="\\theta">&#x3B8;</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Derivatives_Differ_9', () =>
    toXmlMatch(
      tex2mml('\\dd[5]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dd[5]" display="block">
  <msup data-latex="\\dd[5]">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{5}">
      <mn data-latex="5">5</mn>
    </mrow>
  </msup>
</math>`
    ));
});

describe('Physics5_5', () => {
  it('Derivatives_PDiff_0', () =>
    toXmlMatch(
      tex2mml('A\\dd A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd A" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
    <mi mathvariant="normal" data-latex="d">d</mi>
  </mrow>
  <mi data-latex="\\dd A">A</mi>
</math>`
    ));
  it('Derivatives_PDiff_1', () =>
    toXmlMatch(
      tex2mml('A\\dd x A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd x A" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
    <mi mathvariant="normal" data-latex="d">d</mi>
  </mrow>
  <mi data-latex="\\dd x">x</mi>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('Derivatives_PDiff_2', () =>
    toXmlMatch(
      tex2mml('A\\dd{x} A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd{x} A" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="OP" data-latex="\\dd{x}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mi data-latex="x">x</mi>
  </mrow>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('Derivatives_PDiff_3', () =>
    toXmlMatch(
      tex2mml('A\\dd xA'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd xA" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
    <mi mathvariant="normal" data-latex="d">d</mi>
  </mrow>
  <mi data-latex="\\dd x">x</mi>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('Derivatives_PDiff_4', () =>
    toXmlMatch(
      tex2mml('A{{\\rm d}(\\it x)}A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A{{\\rm d}(\\it x)}A" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="ORD" data-latex="{{d}\\it x)}">
    <mrow data-mjx-texclass="ORD" data-latex="{d}">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mo data-latex="\\it" stretchy="false">(</mo>
    <mi data-mjx-variant="-tex-mathit" mathvariant="italic" data-latex="x">x</mi>
    <mo data-mjx-variant="-tex-mathit" mathvariant="italic" data-latex=")" stretchy="false">)</mo>
  </mrow>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('Derivatives_PDiff_5', () =>
    toXmlMatch(
      tex2mml('A\\dd[3]{x} A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd[3]{x} A" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="OP" data-latex="\\dd[3]{x}">
    <msup data-latex="\\diffd^{3}">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{3}">
        <mn data-latex="3">3</mn>
      </mrow>
    </msup>
    <mi data-latex="x">x</mi>
  </mrow>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('Derivatives_PDiff_6', () =>
    toXmlMatch(
      tex2mml('A\\dd[3]x A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd[3]x A" display="block">
  <mi data-latex="A">A</mi>
  <msup data-latex="\\diffd^{3}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{3}">
      <mn data-latex="3">3</mn>
    </mrow>
  </msup>
  <mi data-latex="\\dd[3]x">x</mi>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('Derivatives_PDiff_7', () =>
    toXmlMatch(
      tex2mml('A\\dd(\\frac{\\frac{\\cos}{\\theta}}{\\theta}) A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd(\\frac{\\frac{\\cos}{\\theta}}{\\theta}) A" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">
    <mi mathvariant="normal" data-latex="d">d</mi>
  </mrow>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">
      <mfrac data-latex="\\frac{\\cos}{\\theta}">
        <mi data-latex="\\cos">cos</mi>
        <mi data-latex="\\theta">&#x3B8;</mi>
      </mfrac>
      <mi data-latex="\\theta">&#x3B8;</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('Derivatives_PDiff_8', () =>
    toXmlMatch(
      tex2mml('A\\dd[4](\\frac{\\frac{\\cos}{\\theta}}{\\theta})A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd[4](\\frac{\\frac{\\cos}{\\theta}}{\\theta})A" display="block">
  <mi data-latex="A">A</mi>
  <msup data-latex="\\diffd^{4}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{4}">
      <mn data-latex="4">4</mn>
    </mrow>
  </msup>
  <mrow data-latex=")">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">
      <mfrac data-latex="\\frac{\\cos}{\\theta}">
        <mi data-latex="\\cos">cos</mi>
        <mi data-latex="\\theta">&#x3B8;</mi>
      </mfrac>
      <mi data-latex="\\theta">&#x3B8;</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('Derivatives_PDiff_9', () =>
    toXmlMatch(
      tex2mml('A\\dd{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})A" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="OP" data-latex="\\dd{x}">
    <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
      <mi mathvariant="normal" data-latex="d">d</mi>
    </mrow>
    <mi data-latex="x">x</mi>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">
    <mfrac data-latex="\\frac{\\cos}{\\theta}">
      <mi data-latex="\\cos">cos</mi>
      <mi data-latex="\\theta">&#x3B8;</mi>
    </mfrac>
    <mi data-latex="\\theta">&#x3B8;</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('Derivatives_PDiff_10', () =>
    toXmlMatch(
      tex2mml('A\\dd[4]{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\dd[4]{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})A" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="OP" data-latex="\\dd[4]{x}">
    <msup data-latex="\\diffd^{4}">
      <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{4}">
        <mn data-latex="4">4</mn>
      </mrow>
    </msup>
    <mi data-latex="x">x</mi>
  </mrow>
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">
    <mfrac data-latex="\\frac{\\cos}{\\theta}">
      <mi data-latex="\\cos">cos</mi>
      <mi data-latex="\\theta">&#x3B8;</mi>
    </mfrac>
    <mi data-latex="\\theta">&#x3B8;</mi>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('Derivatives_PDiff_11', () =>
    toXmlMatch(
      tex2mml(
        'A{\\rm d}\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right) A'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A{\\rm d}\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right) A" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="ORD" data-latex="{d}">
    <mi mathvariant="normal" data-latex="d">d</mi>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)" data-latex="\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">
      <mfrac data-latex="\\frac{\\cos}{\\theta}">
        <mi data-latex="\\cos">cos</mi>
        <mi data-latex="\\theta">&#x3B8;</mi>
      </mfrac>
      <mi data-latex="\\theta">&#x3B8;</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('Derivatives_PDiff_12', () =>
    toXmlMatch(
      tex2mml(
        'A{\\rm d}{\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)} A'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A{\\rm d}{\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)} A" display="block">
  <mi data-latex="A">A</mi>
  <mrow data-mjx-texclass="ORD" data-latex="{d}">
    <mi mathvariant="normal" data-latex="d">d</mi>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)}">
    <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)" data-latex="\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)">
      <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
      <mfrac data-latex="\\frac{\\frac{\\cos}{\\theta}}{\\theta}">
        <mfrac data-latex="\\frac{\\cos}{\\theta}">
          <mi data-latex="\\cos">cos</mi>
          <mi data-latex="\\theta">&#x3B8;</mi>
        </mfrac>
        <mi data-latex="\\theta">&#x3B8;</mi>
      </mfrac>
      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
    </mrow>
  </mrow>
  <mi data-latex="A">A</mi>
</math>`
    ));
});

describe('Physics6_0', () => {
  it('BraKet_Bra_0', () =>
    toXmlMatch(
      tex2mml('\\bra{\\phi}\\ket{\\psi}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra{\\phi}\\ket{\\psi}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\phi}\\middle\\vert{\\psi}\\right\\rangle" data-latex="\\bra{\\phi}\\ket{\\psi}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\phi}">
      <mi data-latex="\\phi">&#x3D5;</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\psi}">
      <mi data-latex="\\psi">&#x3C8;</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Bra_1', () =>
    toXmlMatch(
      tex2mml('\\bra{A}\\ket{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra{A}\\ket{B}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{B}\\right\\rangle" data-latex="\\bra{A}\\ket{B}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{B}">
      <mi data-latex="B">B</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Bra_2', () =>
    toXmlMatch(
      tex2mml('\\bra{\\phi}\\dyad{\\psi}{\\xi}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra{\\phi}\\dyad{\\psi}{\\xi}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\phi}\\right\\vert" data-latex="\\left\\langle{\\phi}\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\phi}">
      <mi data-latex="\\phi">&#x3D5;</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="\\bra{\\phi}"></mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\psi}\\middle\\rangle\\!\\middle\\langle{\\xi}\\right\\vert" data-latex="\\left\\vert{\\psi}\\middle\\rangle\\!\\middle\\langle{\\xi}\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\psi}">
      <mi data-latex="\\psi">&#x3C8;</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
    <mspace width="-0.167em" data-latex="\\!"></mspace>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\xi}">
      <mi data-latex="\\xi">&#x3BE;</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Bra_3', () =>
    toXmlMatch(
      tex2mml('\\bra A  \\ket B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra A  \\ket B" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{}\\right\\rangle" data-latex="\\left\\langle{A}\\middle\\vert{}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
  <mi data-latex="B">B</mi>
</math>`
    ));
  it('BraKet_Bra_4', () =>
    toXmlMatch(
      tex2mml('\\bra*{\\frac{a}{b}}  \\ket{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra*{\\frac{a}{b}}  \\ket{\\frac{a}{b}}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\bra*{\\frac{a}{b}}  \\ket{\\frac{a}{b}}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Bra_5', () =>
    toXmlMatch(
      tex2mml('\\bra{\\frac{a}{b}}  \\ket*{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra{\\frac{a}{b}}  \\ket*{\\frac{a}{b}}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\bra{\\frac{a}{b}}  \\ket*{\\frac{a}{b}}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Bra_6', () =>
    toXmlMatch(
      tex2mml('\\bra A\\ket{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra A\\ket{B}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{B}\\right\\rangle" data-latex="\\bra A\\ket{B}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{B}">
      <mi data-latex="B">B</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Bra_7', () =>
    toXmlMatch(
      tex2mml('\\bra A\\ket '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra A\\ket " display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{}\\right\\rangle" data-latex="\\bra A\\ket ">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Bra_8', () =>
    toXmlMatch(
      tex2mml('\\bra {A}\\ket '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra {A}\\ket " display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{}\\right\\rangle" data-latex="\\bra {A}\\ket ">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Bra_9', () =>
    toXmlMatch(
      tex2mml('\\bra {A}\\ket B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra {A}\\ket B" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{}\\right\\rangle" data-latex="\\left\\langle{A}\\middle\\vert{}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
  <mi data-latex="B">B</mi>
</math>`
    ));
  it('BraKet_Bra_10', () =>
    toXmlMatch(
      tex2mml('\\bra {\\frac{a}{b}} \\ket* \\alpha'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra {\\frac{a}{b}} \\ket* \\alpha" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\middle\\vert{}\\right\\rangle" data-latex="\\left\\langle{\\frac{a}{b}}\\middle\\vert{}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
  <mo data-latex="*">&#x2217;</mo>
  <mi data-latex="\\alpha">&#x3B1;</mi>
</math>`
    ));
  it('BraKet_Bra_11', () =>
    toXmlMatch(
      tex2mml('\\ket{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket{A}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\right\\rangle" data-latex="\\ket{A}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Bra_12', () =>
    toXmlMatch(
      tex2mml('\\ket{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{a}{b}}\\right\\rangle" data-latex="\\ket{\\frac{a}{b}}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Bra_13', () =>
    toXmlMatch(
      tex2mml('\\ket*{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket*{A}" display="block">
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\ket*{A}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Bra_14', () =>
    toXmlMatch(
      tex2mml('\\ket a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket a" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{a}\\right\\rangle" data-latex="\\ket a">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{a}">
      <mi data-latex="a">a</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Bra_15', () =>
    toXmlMatch(
      tex2mml('\\ket* a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket* a" display="block">
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{a}">
    <mi data-latex="a">a</mi>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\ket* a">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Bra_16', () =>
    toXmlMatch(
      tex2mml('\\ket \\alpha'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket \\alpha" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\alpha}\\right\\rangle" data-latex="\\ket \\alpha">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\alpha}">
      <mi data-latex="\\alpha">&#x3B1;</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
});

describe('Physics6_1', () => {
  it('BraKet_Braket_0', () =>
    toXmlMatch(
      tex2mml('\\braket{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{A}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{A}\\right\\rangle" data-latex="\\braket{A}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Braket_1', () =>
    toXmlMatch(
      tex2mml('\\braket{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\middle\\vert{\\frac{a}{b}}\\right\\rangle" data-latex="\\braket{\\frac{a}{b}}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Braket_2', () =>
    toXmlMatch(
      tex2mml('\\braket*{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket*{A}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\braket*{A}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Braket_3', () =>
    toXmlMatch(
      tex2mml('\\braket*{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket*{\\frac{a}{b}}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\braket*{\\frac{a}{b}}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Braket_4', () =>
    toXmlMatch(
      tex2mml('\\braket a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket a" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{a}\\middle\\vert{a}\\right\\rangle" data-latex="\\braket a">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{a}">
      <mi data-latex="a">a</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{a}">
      <mi data-latex="a">a</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Braket_5', () =>
    toXmlMatch(
      tex2mml('\\braket* a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket* a" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{a}">
    <mi data-latex="a">a</mi>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{a}">
    <mi data-latex="a">a</mi>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\braket* a">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Braket_6', () =>
    toXmlMatch(
      tex2mml('\\braket \\alpha'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket \\alpha" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\alpha}\\middle\\vert{\\alpha}\\right\\rangle" data-latex="\\braket \\alpha">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\alpha}">
      <mi data-latex="\\alpha">&#x3B1;</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\alpha}">
      <mi data-latex="\\alpha">&#x3B1;</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Braket_7', () =>
    toXmlMatch(
      tex2mml('\\braket{\\frac{a}{b}}{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{\\frac{a}{b}}{A}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\middle\\vert{A}\\right\\rangle" data-latex="\\braket{\\frac{a}{b}}{A}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Braket_8', () =>
    toXmlMatch(
      tex2mml('\\braket*{\\frac{a}{b}}{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket*{\\frac{a}{b}}{A}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\braket*{\\frac{a}{b}}{A}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Braket_9', () =>
    toXmlMatch(
      tex2mml('\\braket{\\frac{a}{b}}  A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{\\frac{a}{b}}  A" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\middle\\vert{\\frac{a}{b}}\\right\\rangle" data-latex="\\left\\langle{\\frac{a}{b}}\\middle\\vert{\\frac{a}{b}}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('BraKet_Braket_10', () =>
    toXmlMatch(
      tex2mml('\\braket*{\\frac{a}{b}}   A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket*{\\frac{a}{b}}   A" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\braket*{\\frac{a}{b}}">&#x27E9;</mo>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('BraKet_Braket_11', () =>
    toXmlMatch(
      tex2mml('\\braket{\\frac{a}{b}}{} '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{\\frac{a}{b}}{} " display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\middle\\vert{}\\right\\rangle" data-latex="\\braket{\\frac{a}{b}}{} ">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Braket_12', () =>
    toXmlMatch(
      tex2mml('\\braket*{\\frac{a}{b}}{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket*{\\frac{a}{b}}{}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
  <mo fence="false" stretchy="false" data-latex="\\braket*{\\frac{a}{b}}{}">&#x27E9;</mo>
</math>`
    ));
});

describe('Physics6_2', () => {
  it('BraKet_Ketbra_0', () =>
    toXmlMatch(
      tex2mml('\\ketbra{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{A}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\middle\\rangle\\!\\middle\\langle{A}\\right\\vert" data-latex="\\ketbra{A}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
    <mspace width="-0.167em" data-latex="\\!"></mspace>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Ketbra_1', () =>
    toXmlMatch(
      tex2mml('\\ketbra{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{a}{b}}\\middle\\rangle\\!\\middle\\langle{\\frac{a}{b}}\\right\\vert" data-latex="\\ketbra{\\frac{a}{b}}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
    <mspace width="-0.167em" data-latex="\\!"></mspace>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Ketbra_2', () =>
    toXmlMatch(
      tex2mml('\\ketbra*{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra*{A}" display="block">
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>
  <mspace width="-0.167em" data-latex="\\!"></mspace>
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\ketbra*{A}">|</mo>
</math>`
    ));
  it('BraKet_Ketbra_3', () =>
    toXmlMatch(
      tex2mml('\\ketbra*{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra*{\\frac{a}{b}}" display="block">
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>
  <mspace width="-0.167em" data-latex="\\!"></mspace>
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\ketbra*{\\frac{a}{b}}">|</mo>
</math>`
    ));
  it('BraKet_Ketbra_4', () =>
    toXmlMatch(
      tex2mml('\\ketbra a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra a" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{a}\\middle\\rangle\\!\\middle\\langle{a}\\right\\vert" data-latex="\\ketbra a">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{a}">
      <mi data-latex="a">a</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
    <mspace width="-0.167em" data-latex="\\!"></mspace>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{a}">
      <mi data-latex="a">a</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Ketbra_5', () =>
    toXmlMatch(
      tex2mml('\\ketbra* a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra* a" display="block">
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{a}">
    <mi data-latex="a">a</mi>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>
  <mspace width="-0.167em" data-latex="\\!"></mspace>
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{a}">
    <mi data-latex="a">a</mi>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\ketbra* a">|</mo>
</math>`
    ));
  it('BraKet_Ketbra_6', () =>
    toXmlMatch(
      tex2mml('\\ketbra \\alpha'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra \\alpha" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\alpha}\\middle\\rangle\\!\\middle\\langle{\\alpha}\\right\\vert" data-latex="\\ketbra \\alpha">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\alpha}">
      <mi data-latex="\\alpha">&#x3B1;</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
    <mspace width="-0.167em" data-latex="\\!"></mspace>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\alpha}">
      <mi data-latex="\\alpha">&#x3B1;</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Ketbra_7', () =>
    toXmlMatch(
      tex2mml('\\ketbra{\\frac{a}{b}}{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{\\frac{a}{b}}{A}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{a}{b}}\\middle\\rangle\\!\\middle\\langle{A}\\right\\vert" data-latex="\\ketbra{\\frac{a}{b}}{A}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
    <mspace width="-0.167em" data-latex="\\!"></mspace>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Ketbra_8', () =>
    toXmlMatch(
      tex2mml('\\ketbra*{\\frac{a}{b}}{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra*{\\frac{a}{b}}{A}" display="block">
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>
  <mspace width="-0.167em" data-latex="\\!"></mspace>
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\ketbra*{\\frac{a}{b}}{A}">|</mo>
</math>`
    ));
  it('BraKet_Ketbra_9', () =>
    toXmlMatch(
      tex2mml('\\ketbra{\\frac{a}{b}}  A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{\\frac{a}{b}}  A" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{a}{b}}\\middle\\rangle\\!\\middle\\langle{\\frac{a}{b}}\\right\\vert" data-latex="\\left\\vert{\\frac{a}{b}}\\middle\\rangle\\!\\middle\\langle{\\frac{a}{b}}\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
    <mspace width="-0.167em" data-latex="\\!"></mspace>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('BraKet_Ketbra_10', () =>
    toXmlMatch(
      tex2mml('\\ketbra*{\\frac{a}{b}}   A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra*{\\frac{a}{b}}   A" display="block">
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>
  <mspace width="-0.167em" data-latex="\\!"></mspace>
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\ketbra*{\\frac{a}{b}}">|</mo>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('BraKet_Ketbra_11', () =>
    toXmlMatch(
      tex2mml('\\ketbra{\\frac{a}{b}}{} '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{\\frac{a}{b}}{} " display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{a}{b}}\\middle\\rangle\\!\\middle\\langle{}\\right\\vert" data-latex="\\ketbra{\\frac{a}{b}}{} ">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
    <mspace width="-0.167em" data-latex="\\!"></mspace>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Ketbra_12', () =>
    toXmlMatch(
      tex2mml('\\ketbra*{\\frac{a}{b}}{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra*{\\frac{a}{b}}{}" display="block">
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>
  <mspace width="-0.167em" data-latex="\\!"></mspace>
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\ketbra*{\\frac{a}{b}}{}">|</mo>
</math>`
    ));
  it('BraKet_Ketbra_13', () =>
    toXmlMatch(
      tex2mml('\\left\\vert A \\middle\\rangle\\middle\\langle B\\right\\vert'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\vert A \\middle\\rangle\\middle\\langle B\\right\\vert" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert A \\middle\\rangle\\middle\\langle B\\right\\vert" data-latex="\\left\\vert A \\middle\\rangle\\middle\\langle B\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert " data-latex="\\left\\vert ">|</mo>
    <mi data-latex="A">A</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\langle " data-latex="\\middle\\langle ">&#x27E8;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
    <mi data-latex="B">B</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Ketbra_14', () =>
    toXmlMatch(
      tex2mml('\\ketbra{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{A}{B}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\middle\\rangle\\!\\middle\\langle{B}\\right\\vert" data-latex="\\ketbra{A}{B}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
    <mspace width="-0.167em" data-latex="\\!"></mspace>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{B}">
      <mi data-latex="B">B</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Ketbra_15', () =>
    toXmlMatch(
      tex2mml('\\outerproduct{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\outerproduct{A}{B}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\middle\\rangle\\!\\middle\\langle{B}\\right\\vert" data-latex="\\outerproduct{A}{B}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
    <mspace width="-0.167em" data-latex="\\!"></mspace>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{B}">
      <mi data-latex="B">B</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Ketbra_16', () =>
    toXmlMatch(
      tex2mml('\\dyad{a}{b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dyad{a}{b}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{a}\\middle\\rangle\\!\\middle\\langle{b}\\right\\vert" data-latex="\\dyad{a}{b}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{a}">
      <mi data-latex="a">a</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
    <mspace width="-0.167em" data-latex="\\!"></mspace>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{b}">
      <mi data-latex="b">b</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
</math>`
    ));
});

describe('Physics6_3', () => {
  it('BraKet_Expect_0', () =>
    toXmlMatch(
      tex2mml('\\ev{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev{A}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle {A} \\right\\rangle" data-latex="\\ev{A}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle " data-latex="\\left\\langle ">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Expect_1', () =>
    toXmlMatch(
      tex2mml('\\ev{\\frac{A}{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev{\\frac{A}{B}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle {\\frac{A}{B}} \\right\\rangle" data-latex="\\ev{\\frac{A}{B}}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle " data-latex="\\left\\langle ">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
      <mfrac data-latex="\\frac{A}{B}">
        <mi data-latex="A">A</mi>
        <mi data-latex="B">B</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Expect_2', () =>
    toXmlMatch(
      tex2mml('\\ev*{\\frac{A}{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev*{\\frac{A}{B}}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
    <mfrac data-latex="\\frac{A}{B}">
      <mi data-latex="A">A</mi>
      <mi data-latex="B">B</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\ev*{\\frac{A}{B}}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Expect_3', () =>
    toXmlMatch(
      tex2mml('\\ev**{\\frac{A}{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev**{\\frac{A}{B}}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
    <mfrac data-latex="\\frac{A}{B}">
      <mi data-latex="A">A</mi>
      <mi data-latex="B">B</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\ev**{\\frac{A}{B}}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Expect_4', () =>
    toXmlMatch(
      tex2mml('\\ev{A}{\\frac{A}{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev{A}{\\frac{A}{B}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{A}{B}}\\right\\vert" data-latex="\\left\\langle{\\frac{A}{B}}\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
      <mfrac data-latex="\\frac{A}{B}">
        <mi data-latex="A">A</mi>
        <mi data-latex="B">B</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{A}{B}}\\right\\rangle" data-latex="\\left\\vert{\\frac{A}{B}}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
      <mfrac data-latex="\\frac{A}{B}">
        <mi data-latex="A">A</mi>
        <mi data-latex="B">B</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Expect_5', () =>
    toXmlMatch(
      tex2mml('\\ev{\\frac{A}{B}}{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev{\\frac{A}{B}}{A}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\right\\vert" data-latex="\\left\\langle{A}\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
    <mfrac data-latex="\\frac{A}{B}">
      <mi data-latex="A">A</mi>
      <mi data-latex="B">B</mi>
    </mfrac>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\right\\rangle" data-latex="\\left\\vert{A}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Expect_6', () =>
    toXmlMatch(
      tex2mml('\\ev*{A}{\\frac{A}{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev*{A}{\\frac{A}{B}}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
    <mfrac data-latex="\\frac{A}{B}">
      <mi data-latex="A">A</mi>
      <mi data-latex="B">B</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
    <mfrac data-latex="\\frac{A}{B}">
      <mi data-latex="A">A</mi>
      <mi data-latex="B">B</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\ev*{A}{\\frac{A}{B}}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Expect_7', () =>
    toXmlMatch(
      tex2mml('\\ev**{A} {\\frac{A}{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev**{A} {\\frac{A}{B}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{A}{B}}\\middle\\vert{A}\\middle\\vert{\\frac{A}{B}}\\right\\rangle" data-latex="\\ev**{A} {\\frac{A}{B}}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
      <mfrac data-latex="\\frac{A}{B}">
        <mi data-latex="A">A</mi>
        <mi data-latex="B">B</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
      <mfrac data-latex="\\frac{A}{B}">
        <mi data-latex="A">A</mi>
        <mi data-latex="B">B</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Expect_8', () =>
    toXmlMatch(
      tex2mml('\\ev A B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev A B" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle {A} \\right\\rangle" data-latex="\\left\\langle {A} \\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle " data-latex="\\left\\langle ">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
  <mi data-latex="B">B</mi>
</math>`
    ));
  it('BraKet_Expect_9', () =>
    toXmlMatch(
      tex2mml('\\ev A {\\frac{A}{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev A {\\frac{A}{B}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{A}{B}}\\right\\vert" data-latex="\\left\\langle{\\frac{A}{B}}\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
      <mfrac data-latex="\\frac{A}{B}">
        <mi data-latex="A">A</mi>
        <mi data-latex="B">B</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{A}{B}}\\right\\rangle" data-latex="\\left\\vert{\\frac{A}{B}}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
      <mfrac data-latex="\\frac{A}{B}">
        <mi data-latex="A">A</mi>
        <mi data-latex="B">B</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Expect_10', () =>
    toXmlMatch(
      tex2mml('\\ev {\\frac{A}{B}} A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev {\\frac{A}{B}} A" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle {\\frac{A}{B}} \\right\\rangle" data-latex="\\left\\langle {\\frac{A}{B}} \\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle " data-latex="\\left\\langle ">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
      <mfrac data-latex="\\frac{A}{B}">
        <mi data-latex="A">A</mi>
        <mi data-latex="B">B</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
  <mi data-latex="A">A</mi>
</math>`
    ));
  it('BraKet_Expect_11', () =>
    toXmlMatch(
      tex2mml('\\ev* A {\\frac{A}{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev* A {\\frac{A}{B}}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
    <mfrac data-latex="\\frac{A}{B}">
      <mi data-latex="A">A</mi>
      <mi data-latex="B">B</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
    <mfrac data-latex="\\frac{A}{B}">
      <mi data-latex="A">A</mi>
      <mi data-latex="B">B</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\ev* A {\\frac{A}{B}}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Expect_12', () =>
    toXmlMatch(
      tex2mml('\\ev** A {\\frac{A}{B}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev** A {\\frac{A}{B}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{A}{B}}\\middle\\vert{A}\\middle\\vert{\\frac{A}{B}}\\right\\rangle" data-latex="\\ev** A {\\frac{A}{B}}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
      <mfrac data-latex="\\frac{A}{B}">
        <mi data-latex="A">A</mi>
        <mi data-latex="B">B</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
      <mfrac data-latex="\\frac{A}{B}">
        <mi data-latex="A">A</mi>
        <mi data-latex="B">B</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Expect_13', () =>
    toXmlMatch(
      tex2mml('\\ev{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{\\Psi}{\\Phi}}\\right\\vert" data-latex="\\left\\langle{\\frac{\\Psi}{\\Phi}}\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{\\Psi}{\\Phi}}">
      <mfrac data-latex="\\frac{\\Psi}{\\Phi}">
        <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>
        <mi mathvariant="normal" data-latex="\\Phi">&#x3A6;</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
    <mfrac data-latex="\\frac{A}{B}">
      <mi data-latex="A">A</mi>
      <mi data-latex="B">B</mi>
    </mfrac>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{\\Psi}{\\Phi}}\\right\\rangle" data-latex="\\left\\vert{\\frac{\\Psi}{\\Phi}}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{\\Psi}{\\Phi}}">
      <mfrac data-latex="\\frac{\\Psi}{\\Phi}">
        <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>
        <mi mathvariant="normal" data-latex="\\Phi">&#x3A6;</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Expect_14', () =>
    toXmlMatch(
      tex2mml('\\ev{\\frac{A}{B}}{{\\Psi}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev{\\frac{A}{B}}{{\\Psi}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{{\\Psi}}\\right\\vert" data-latex="\\left\\langle{{\\Psi}}\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{{\\Psi}}">
      <mrow data-mjx-texclass="ORD" data-latex="{\\Psi}">
        <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>
      </mrow>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
    <mfrac data-latex="\\frac{A}{B}">
      <mi data-latex="A">A</mi>
      <mi data-latex="B">B</mi>
    </mfrac>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{{\\Psi}}\\right\\rangle" data-latex="\\left\\vert{{\\Psi}}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{{\\Psi}}">
      <mrow data-mjx-texclass="ORD" data-latex="{\\Psi}">
        <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>
      </mrow>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_Expect_15', () =>
    toXmlMatch(
      tex2mml('\\ev*{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev*{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{\\Psi}{\\Phi}}">
    <mfrac data-latex="\\frac{\\Psi}{\\Phi}">
      <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>
      <mi mathvariant="normal" data-latex="\\Phi">&#x3A6;</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
    <mfrac data-latex="\\frac{A}{B}">
      <mi data-latex="A">A</mi>
      <mi data-latex="B">B</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{\\Psi}{\\Phi}}">
    <mfrac data-latex="\\frac{\\Psi}{\\Phi}">
      <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>
      <mi mathvariant="normal" data-latex="\\Phi">&#x3A6;</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\ev*{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_Expect_16', () =>
    toXmlMatch(
      tex2mml('\\ev**{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ev**{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{\\Psi}{\\Phi}}\\middle\\vert{\\frac{A}{B}}\\middle\\vert{\\frac{\\Psi}{\\Phi}}\\right\\rangle" data-latex="\\ev**{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{\\Psi}{\\Phi}}">
      <mfrac data-latex="\\frac{\\Psi}{\\Phi}">
        <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>
        <mi mathvariant="normal" data-latex="\\Phi">&#x3A6;</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{A}{B}}">
      <mfrac data-latex="\\frac{A}{B}">
        <mi data-latex="A">A</mi>
        <mi data-latex="B">B</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{\\Psi}{\\Phi}}">
      <mfrac data-latex="\\frac{\\Psi}{\\Phi}">
        <mi mathvariant="normal" data-latex="\\Psi">&#x3A8;</mi>
        <mi mathvariant="normal" data-latex="\\Phi">&#x3A6;</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
});

describe('Physics6_4', () => {
  it('BraKet_MatrixEl_0', () =>
    toXmlMatch(
      tex2mml('\\matrixel{n}{A}{m}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixel{n}{A}{m}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{n}\\right\\vert" data-latex="\\left\\langle{n}\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{n}">
      <mi data-latex="n">n</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{m}\\right\\rangle" data-latex="\\left\\vert{m}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{m}">
      <mi data-latex="m">m</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_MatrixEl_1', () =>
    toXmlMatch(
      tex2mml('\\mel{n}{A}{m}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel{n}{A}{m}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{n}\\right\\vert" data-latex="\\left\\langle{n}\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{n}">
      <mi data-latex="n">n</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{A}">
    <mi data-latex="A">A</mi>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{m}\\right\\rangle" data-latex="\\left\\vert{m}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{m}">
      <mi data-latex="m">m</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_MatrixEl_2', () =>
    toXmlMatch(
      tex2mml('\\mel{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\right\\vert" data-latex="\\left\\langle{\\frac{a}{b}}\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{\\frac{a}{b}}\\right\\rangle" data-latex="\\left\\vert{\\frac{a}{b}}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_MatrixEl_3', () =>
    toXmlMatch(
      tex2mml('\\mel A B C'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel A B C" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\right\\vert" data-latex="\\left\\langle{A}\\right\\vert">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{A}">
      <mi data-latex="A">A</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="{B}">
    <mi data-latex="B">B</mi>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{C}\\right\\rangle" data-latex="\\left\\vert{C}\\right\\rangle">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{C}">
      <mi data-latex="C">C</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_MatrixEl_4', () =>
    toXmlMatch(
      tex2mml('\\mel*{n}{\\frac{a}{b}}{m}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel*{n}{\\frac{a}{b}}{m}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{n}">
    <mi data-latex="n">n</mi>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{m}">
    <mi data-latex="m">m</mi>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\mel*{n}{\\frac{a}{b}}{m}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_MatrixEl_5', () =>
    toXmlMatch(
      tex2mml('\\mel*{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel*{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
  </mrow>
  <mo fence="false" stretchy="false" data-latex="\\mel*{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}">&#x27E9;</mo>
</math>`
    ));
  it('BraKet_MatrixEl_6', () =>
    toXmlMatch(
      tex2mml('\\mel**{n}{\\frac{a}{b}}{m}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel**{n}{\\frac{a}{b}}{m}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{n}\\middle\\vert{\\frac{a}{b}}\\middle\\vert{m}\\right\\rangle" data-latex="\\mel**{n}{\\frac{a}{b}}{m}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{n}">
      <mi data-latex="n">n</mi>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{m}">
      <mi data-latex="m">m</mi>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
  it('BraKet_MatrixEl_7', () =>
    toXmlMatch(
      tex2mml('\\mel**{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mel**{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{\\frac{a}{b}}\\middle\\vert{\\frac{a}{b}}\\middle\\vert{\\frac{a}{b}}\\right\\rangle" data-latex="\\mel**{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{a}{b}}">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
  </mrow>
</math>`
    ));
});

describe('Physics7_0', () => {
  it('Matrices_Quantity_0', () =>
    toXmlMatch(
      tex2mml('\\matrixquantity{Q}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixquantity{Q}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\matrixquantity{Q}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mi data-latex="Q">Q</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrices_Quantity_1', () =>
    toXmlMatch(
      tex2mml('\\matrixquantity*{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixquantity*{a &amp; b \\\\ c &amp; d}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\matrixquantity*{a &amp; b \\\\ c &amp; d}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mi data-latex="d">d</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrices_Quantity_2', () =>
    toXmlMatch(
      tex2mml('\\matrixquantity*(a & b \\\\ c & d)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixquantity*(a &amp; b \\\\ c &amp; d)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right\\rgroup" data-latex="\\matrixquantity*(a &amp; b \\\\ c &amp; d)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Quantity_3', () =>
    toXmlMatch(
      tex2mml('\\matrixquantity(a & b \\\\ c & d)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixquantity(a &amp; b \\\\ c &amp; d)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right)" data-latex="\\matrixquantity(a &amp; b \\\\ c &amp; d)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Quantity_4', () =>
    toXmlMatch(
      tex2mml('\\matrixquantity[a & b \\\\ c & d]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixquantity[a &amp; b \\\\ c &amp; d]" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right]" data-latex="\\matrixquantity[a &amp; b \\\\ c &amp; d]">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Quantity_5', () =>
    toXmlMatch(
      tex2mml('\\matrixquantity|a & b \\\\ c & d|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixquantity|a &amp; b \\\\ c &amp; d|" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right|" data-latex="\\matrixquantity|a &amp; b \\\\ c &amp; d|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Quantity_6', () =>
    toXmlMatch(
      tex2mml('\\mqty{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{a &amp; b \\\\ c &amp; d}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{a &amp; b \\\\ c &amp; d}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mi data-latex="d">d</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrices_Quantity_7', () =>
    toXmlMatch(
      tex2mml('\\mqty(a & b \\\\ c & d)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(a &amp; b \\\\ c &amp; d)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right)" data-latex="\\mqty(a &amp; b \\\\ c &amp; d)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Quantity_8', () =>
    toXmlMatch(
      tex2mml('\\mqty*(a & b \\\\ c & d)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty*(a &amp; b \\\\ c &amp; d)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right\\rgroup" data-latex="\\mqty*(a &amp; b \\\\ c &amp; d)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Quantity_9', () =>
    toXmlMatch(
      tex2mml('\\mqty[a & b \\\\ c & d]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty[a &amp; b \\\\ c &amp; d]" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right]" data-latex="\\mqty[a &amp; b \\\\ c &amp; d]">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Quantity_10', () =>
    toXmlMatch(
      tex2mml('\\mqty|a & b \\\\ c & d|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty|a &amp; b \\\\ c &amp; d|" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right|" data-latex="\\mqty|a &amp; b \\\\ c &amp; d|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Quantity_11', () =>
    toXmlMatch(
      tex2mml('\\mqty*|a & b\\\\ c& d|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty*|a &amp; b\\\\ c&amp; d|" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a &amp; b\\\\ c&amp; d\\end{array}\\right|" data-latex="\\mqty*|a &amp; b\\\\ c&amp; d|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
});

describe('Physics7_10', () => {
  it('Matrices_Adiag_0', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\admat{1,2&3\\\\4&5})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\lefty{1}\\\\ \\mqty{2&amp;3\\\\4&amp;5}\\end{array}\\right)" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Adiag_1', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\admat 1)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\admat 1)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\admat 1\\end{array}\\right)" data-latex="\\mqty(\\admat 1)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Adiag_2', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\admat 1,2)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\admat 1,2)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\admat 1,2\\end{array}\\right)" data-latex="\\mqty(\\admat 1,2)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
          <mo data-latex=",">,</mo>
          <mn data-latex="2">2</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Adiag_3', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\admat{1,2&3\\\\4&5&6,7,8})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5&amp;6,7,8})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\leftqty{1}\\\\ &amp;&amp;\\mqty{2&amp;3\\\\4&amp;5&amp;6}\\\\ &amp;\\mqty{7}\\\\ \\mqty{8}\\end{array}\\right)" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5&amp;6,7,8})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
              <mtd>
                <mn data-latex="6">6</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="7">7</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="8">8</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Adiag_4', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\admat{1,2&3\\\\4&5,6,7,8})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5,6,7,8})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\leftmqty{1}\\\\ &amp;&amp;&amp;\\mqty{2&amp;3\\\\4&amp;5}\\\\ &amp;&amp;\\mqty{6}\\\\ &amp;\\mqty{7}\\\\ \\mqty{8}\\end{array}\\right)" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5,6,7,8})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="6">6</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="7">7</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="8">8</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Adiag_5', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\admat{1,2&3\\\\4&5&6,7,8,\\dmat{9,10}})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5&amp;6,7,8,\\dmat{9,10}})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\leftmqty{1}\\\\ &amp;&amp;&amp;\\mqty{2&amp;3\\\\4&amp;5&amp;6}\\\\ &amp;&amp;\\mqty{7}\\\\ &amp;\\mqty{8}\\\\ \\mqty{\\dmat{9,10}}\\end{array}\\right)" data-latex="\\mqty(\\admat{1,2&amp;3\\\\4&amp;5&amp;6,7,8,\\dmat{9,10}})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
              <mtd>
                <mn data-latex="6">6</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="7">7</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="8">8</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
                  <mtr data-latex-item="{}" data-latex="{}">
                    <mtd>
                      <mn data-latex="9">9</mn>
                    </mtd>
                  </mtr>
                </mtable>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd></mtd>
              <mtd>
                <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
                  <mtr data-latex-item="{}" data-latex="{}">
                    <mtd>
                      <mn data-latex="0">10</mn>
                    </mtd>
                  </mtr>
                </mtable>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
});

describe('Physics7_11', () => {
  it('Matrices_Other_0', () =>
    toXmlMatch(
      tex2mml('\\mqty a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty a" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\end{array}\\right)" data-latex="\\left(\\begin{array}{} \\end{array}\\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}"></mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
  <mi data-latex="a">a</mi>
</math>`
    ));
  it('Matrices_Other_1', () =>
    toXmlMatch(
      tex2mml('\\mqty1'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty1" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\end{array}\\right)" data-latex="\\left(\\begin{array}{} \\end{array}\\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}"></mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
  <mn data-latex="1">1</mn>
</math>`
    ));
  it('Matrices_Other_2', () =>
    toXmlMatch(
      tex2mml('\\pmqty* 34'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty* 34" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} *\\end{array}\\right)" data-latex="\\left(\\begin{array}{} *\\end{array}\\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mo data-latex="*">&#x2217;</mo>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
  <mn data-latex="4">34</mn>
</math>`
    ));
  it('Matrices_Other_3', () =>
    toXmlMatch(
      tex2mml(
        '\\mqty(\\dmat{1,2&3,4&4&5\\\\4&5,33,4,5,7,8\\\\0\\\\10&20\\\\3,200}) '
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3,4&amp;4&amp;5\\\\4&amp;5,33,4,5,7,8\\\\0\\\\10&amp;20\\\\3,200}) " display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3}\\\\ &amp;&amp;\\mqty{4&amp;4&amp;5\\\\4&amp;5}\\\\ &amp;&amp;&amp;\\mqty{33}\\\\ &amp;&amp;&amp;&amp;\\mqty{4}\\\\ &amp;&amp;&amp;&amp;&amp;\\mqty{5}\\\\ &amp;&amp;&amp;&amp;&amp;&amp;\\mqty{7}\\\\ &amp;&amp;&amp;&amp;&amp;&amp;&amp;\\mqty{8\\\\0\\\\10&amp;20\\\\3}\\\\ &amp;&amp;&amp;&amp;&amp;&amp;&amp;&amp;\\mqty{200}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3,4&amp;4&amp;5\\\\4&amp;5,33,4,5,7,8\\\\0\\\\10&amp;20\\\\3,200}) ">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="3">33</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="7">7</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="8">8</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="0">10</mn>
              </mtd>
              <mtd>
                <mn data-latex="0">20</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="00">200</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Other_4', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5}) '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5}) " display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3\\\\4&amp;5}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5}) ">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Other_5', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5&6,\\imat{3},7,8,\\dmat{9,10}})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5&amp;6,\\imat{3},7,8,\\dmat{9,10}})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3\\\\4&amp;5&amp;6}\\\\ &amp;&amp;\\mqty{\\imat{3}}\\\\ &amp;&amp;&amp;\\mqty{7}\\\\ &amp;&amp;&amp;&amp;\\mqty{8}\\\\ &amp;&amp;&amp;&amp;&amp;\\mqty{\\dmat{9,10}}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5&amp;6,\\imat{3},7,8,\\dmat{9,10}})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
              <mtd>
                <mn data-latex="6">6</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="7">7</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="8">8</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
                  <mtr data-latex-item="{}" data-latex="{}">
                    <mtd>
                      <mn data-latex="9">9</mn>
                    </mtd>
                  </mtr>
                </mtable>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd></mtd>
              <mtd>
                <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
                  <mtr data-latex-item="{}" data-latex="{}">
                    <mtd>
                      <mn data-latex="0">10</mn>
                    </mtd>
                  </mtr>
                </mtable>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Other_6', () =>
    toXmlMatch(
      tex2mml(
        '\\mqty(\\mqty{1}\\\\ & \\mqty{2 & 3\\\\ 4 & 5 & 6}\\\\ & & \\mqty{\\imat{3}} \\\\ & & & \\mqty{7})'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\mqty{1}\\\\ &amp; \\mqty{2 &amp; 3\\\\ 4 &amp; 5 &amp; 6}\\\\ &amp; &amp; \\mqty{\\imat{3}} \\\\ &amp; &amp; &amp; \\mqty{7})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\mqty{1}\\\\ &amp; \\mqty{2 &amp; 3\\\\ 4 &amp; 5 &amp; 6}\\\\ &amp; &amp; \\mqty{\\imat{3}} \\\\ &amp; &amp; &amp; \\mqty{7}\\end{array}\\right)" data-latex="\\mqty(\\mqty{1}\\\\ &amp; \\mqty{2 &amp; 3\\\\ 4 &amp; 5 &amp; 6}\\\\ &amp; &amp; \\mqty{\\imat{3}} \\\\ &amp; &amp; &amp; \\mqty{7})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
              <mtd>
                <mn data-latex="6">6</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
              <mtd>
                <mn data-latex="0">0</mn>
              </mtd>
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="7">7</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Other_7', () =>
    toXmlMatch(
      tex2mml('\\left\\lgroup\\frac{a}{b}\\right\\rgroup'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\lgroup\\frac{a}{b}\\right\\rgroup" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\frac{a}{b}\\right\\rgroup" data-latex="\\left\\lgroup\\frac{a}{b}\\right\\rgroup">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Other_8', () =>
    toXmlMatch(
      tex2mml('\\begin{smallmatrix} a & b \\\\ c & d \\end{smallmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{smallmatrix} a &amp; b \\\\ c &amp; d \\end{smallmatrix}" display="block">
  <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="\\begin{smallmatrix} a &amp; b \\\\ c &amp; d \\end{smallmatrix}">
    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
      <mtr>
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
  </mstyle>
</math>`
    ));
  it('Matrices_Other_9', () =>
    toXmlMatch(
      tex2mml('\\smqty{\\imat{3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty{\\imat{3}}" display="block">
  <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="\\smqty{\\imat{3}}">
    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
      <mtr>
        <mtd>
          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
    </mtable>
  </mstyle>
</math>`
    ));
  it('Matrices_Other_10', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\imat{10}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\imat{10}}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\imat{10}}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
});

describe('Physics7_1', () => {
  it('Matrices_Fenced_0', () =>
    toXmlMatch(
      tex2mml('\\pmqty{Q} \\mqty(R)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{Q} \\mqty(R)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} Q\\end{array}\\right)" data-latex="\\left(\\begin{array}{} Q\\end{array}\\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="Q">Q</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} R\\end{array}\\right)" data-latex="\\left(\\begin{array}{} R\\end{array}\\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="R">R</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Fenced_1', () =>
    toXmlMatch(
      tex2mml('\\Pmqty{Q} \\mqty*(R)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Pmqty{Q} \\mqty*(R)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{array}{} Q\\end{array}\\right\\rgroup" data-latex="\\left\\lgroup\\begin{array}{} Q\\end{array}\\right\\rgroup">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="Q">Q</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{array}{} R\\end{array}\\right\\rgroup" data-latex="\\left\\lgroup\\begin{array}{} R\\end{array}\\right\\rgroup">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="R">R</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Fenced_2', () =>
    toXmlMatch(
      tex2mml('\\bmqty{Q} \\mqty[R]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bmqty{Q} \\mqty[R]" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{array}{} Q\\end{array}\\right]" data-latex="\\left[\\begin{array}{} Q\\end{array}\\right]">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="Q">Q</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{array}{} R\\end{array}\\right]" data-latex="\\left[\\begin{array}{} R\\end{array}\\right]">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="R">R</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Fenced_3', () =>
    toXmlMatch(
      tex2mml('\\vmqty{Q} \\mqty|R|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vmqty{Q} \\mqty|R|" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} Q\\end{array}\\right|" data-latex="\\left|\\begin{array}{} Q\\end{array}\\right|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="Q">Q</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} R\\end{array}\\right|" data-latex="\\left|\\begin{array}{} R\\end{array}\\right|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="R">R</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Fenced_4', () =>
    toXmlMatch(
      tex2mml('\\pmqty{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{a &amp; b \\\\ c &amp; d}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right)" data-latex="\\mqty(a &amp; b \\\\ c &amp; d)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Fenced_5', () =>
    toXmlMatch(
      tex2mml('\\Pmqty{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Pmqty{a &amp; b \\\\ c &amp; d}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right\\rgroup" data-latex="\\mqty*(a &amp; b \\\\ c &amp; d)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Fenced_6', () =>
    toXmlMatch(
      tex2mml('\\bmqty{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bmqty{a &amp; b \\\\ c &amp; d}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right]" data-latex="\\mqty[a &amp; b \\\\ c &amp; d]">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Fenced_7', () =>
    toXmlMatch(
      tex2mml('\\vmqty{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vmqty{a &amp; b \\\\ c &amp; d}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right|" data-latex="\\mqty|a &amp; b \\\\ c &amp; d|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
});

describe('Physics7_2', () => {
  it('Matrices_Small_0', () =>
    toXmlMatch(
      tex2mml('\\smallmatrixquantity{Q}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smallmatrixquantity{Q}" display="block">
  <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="\\smallmatrixquantity{Q}">
    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
      <mtr>
        <mtd>
          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
          <mi data-latex="Q">Q</mi>
        </mtd>
      </mtr>
    </mtable>
  </mstyle>
</math>`
    ));
  it('Matrices_Small_1', () =>
    toXmlMatch(
      tex2mml('\\smallmatrixquantity*{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smallmatrixquantity*{a &amp; b \\\\ c &amp; d}" display="block">
  <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="\\smallmatrixquantity*{a &amp; b \\\\ c &amp; d}">
    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
      <mtr>
        <mtd>
          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
  </mstyle>
</math>`
    ));
  it('Matrices_Small_2', () =>
    toXmlMatch(
      tex2mml('\\smallmatrixquantity*(a & b \\\\ c & d)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smallmatrixquantity*(a &amp; b \\\\ c &amp; d)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right\\rgroup" data-latex="\\smallmatrixquantity*(a &amp; b \\\\ c &amp; d)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="c">c</mi>
          </mtd>
          <mtd>
            <mi data-latex="d">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Small_3', () =>
    toXmlMatch(
      tex2mml('\\smallmatrixquantity(a & b \\\\ c & d)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smallmatrixquantity(a &amp; b \\\\ c &amp; d)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right)" data-latex="\\smallmatrixquantity(a &amp; b \\\\ c &amp; d)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="c">c</mi>
          </mtd>
          <mtd>
            <mi data-latex="d">d</mi>
         </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Small_5', () =>
    toXmlMatch(
      tex2mml('\\smallmatrixquantity|a & b \\\\ c & d|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smallmatrixquantity|a &amp; b \\\\ c &amp; d|" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right|" data-latex="\\smallmatrixquantity|a &amp; b \\\\ c &amp; d|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="c">c</mi>
          </mtd>
          <mtd>
            <mi data-latex="d">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Small_6', () =>
    toXmlMatch(
      tex2mml('\\smqty{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty{a &amp; b \\\\ c &amp; d}" display="block">
  <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="\\smqty{a &amp; b \\\\ c &amp; d}">
    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
      <mtr>
        <mtd>
          <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
  </mstyle>
</math>`
    ));
  it('Matrices_Small_7', () =>
    toXmlMatch(
      tex2mml('\\smqty(a & b \\\\ c & d)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(a &amp; b \\\\ c &amp; d)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right)" data-latex="\\smqty(a &amp; b \\\\ c &amp; d)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="c">c</mi>
          </mtd>
          <mtd>
            <mi data-latex="d">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Small_8', () =>
    toXmlMatch(
      tex2mml('\\smqty*(a & b \\\\ c & d)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty*(a &amp; b \\\\ c &amp; d)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right\\rgroup" data-latex="\\smqty*(a &amp; b \\\\ c &amp; d)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="c">c</mi>
          </mtd>
          <mtd>
            <mi data-latex="d">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Small_9', () =>
    toXmlMatch(
      tex2mml('\\smqty[a & b \\\\ c & d]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty[a &amp; b \\\\ c &amp; d]" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right]" data-latex="\\smqty[a &amp; b \\\\ c &amp; d]">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="c">c</mi>
          </mtd>
          <mtd>
            <mi data-latex="d">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Small_10', () =>
    toXmlMatch(
      tex2mml('\\smqty|a & b \\\\ c & d|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty|a &amp; b \\\\ c &amp; d|" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right|" data-latex="\\smqty|a &amp; b \\\\ c &amp; d|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="c">c</mi>
          </mtd>
          <mtd>
            <mi data-latex="d">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
});

describe('Physics7_3', () => {
  it('Matrices_SmallFenced_0', () =>
    toXmlMatch(
      tex2mml('\\spmqty{Q} \\smqty(R)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\spmqty{Q} \\smqty(R)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right)" data-latex="\\left(\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="Q">Q</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{smallmatrix}{} R\\end{smallmatrix}\\right)" data-latex="\\left(\\begin{smallmatrix}{} R\\end{smallmatrix}\\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="R">R</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_SmallFenced_1', () =>
    toXmlMatch(
      tex2mml('\\sPmqty{Q} \\smqty*(R)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sPmqty{Q} \\smqty*(R)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right\\rgroup" data-latex="\\left\\lgroup\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right\\rgroup">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="Q">Q</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{smallmatrix}{} R\\end{smallmatrix}\\right\\rgroup" data-latex="\\left\\lgroup\\begin{smallmatrix}{} R\\end{smallmatrix}\\right\\rgroup">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="R">R</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>
  </mrow>
</math>`
    ));
  it('Matrices_SmallFenced_2', () =>
    toXmlMatch(
      tex2mml('\\sbmqty{Q} \\smqty[R]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sbmqty{Q} \\smqty[R]" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right]" data-latex="\\left[\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right]">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="Q">Q</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{smallmatrix}{} R\\end{smallmatrix}\\right]" data-latex="\\left[\\begin{smallmatrix}{} R\\end{smallmatrix}\\right]">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="R">R</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
  </mrow>
</math>`
    ));
  it('Matrices_SmallFenced_3', () =>
    toXmlMatch(
      tex2mml('\\svmqty{Q} \\smqty|R|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\svmqty{Q} \\smqty|R|" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right|" data-latex="\\left|\\begin{smallmatrix}{} Q\\end{smallmatrix}\\right|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="Q">Q</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} R\\end{smallmatrix}\\right|" data-latex="\\left|\\begin{smallmatrix}{} R\\end{smallmatrix}\\right|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="R">R</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Matrices_SmallFenced_4', () =>
    toXmlMatch(
      tex2mml('\\spmqty{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\spmqty{a &amp; b \\\\ c &amp; d}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right)" data-latex="\\smqty(a &amp; b \\\\ c &amp; d)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="c">c</mi>
          </mtd>
          <mtd>
            <mi data-latex="d">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_SmallFenced_5', () =>
    toXmlMatch(
      tex2mml('\\sPmqty{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sPmqty{a &amp; b \\\\ c &amp; d}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lgroup\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right\\rgroup" data-latex="\\smqty*(a &amp; b \\\\ c &amp; d)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lgroup" data-latex="\\left\\lgroup">&#x27EE;</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="c">c</mi>
          </mtd>
          <mtd>
            <mi data-latex="d">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rgroup" data-latex="\\right\\rgroup">&#x27EF;</mo>
  </mrow>
</math>`
    ));
  it('Matrices_SmallFenced_6', () =>
    toXmlMatch(
      tex2mml('\\sbmqty{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sbmqty{a &amp; b \\\\ c &amp; d}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left[\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right]" data-latex="\\smqty[a &amp; b \\\\ c &amp; d]">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="c">c</mi>
          </mtd>
          <mtd>
            <mi data-latex="d">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
  </mrow>
</math>`
    ));
  it('Matrices_SmallFenced_7', () =>
    toXmlMatch(
      tex2mml('\\svmqty{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\svmqty{a &amp; b \\\\ c &amp; d}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right|" data-latex="\\smqty|a &amp; b \\\\ c &amp; d|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="c">c</mi>
          </mtd>
          <mtd>
            <mi data-latex="d">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
});

describe('Physics7_4', () => {
  it('Matrices_Det_0', () =>
    toXmlMatch(
      tex2mml('\\matrixdeterminant{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixdeterminant{a &amp; b \\\\ c &amp; d}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right|" data-latex="\\mqty|a &amp; b \\\\ c &amp; d|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Det_1', () =>
    toXmlMatch(
      tex2mml('\\mdet{a & b \\\\ c & d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mdet{a &amp; b \\\\ c &amp; d}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a &amp; b \\\\ c &amp; d\\end{array}\\right|" data-latex="\\mqty|a &amp; b \\\\ c &amp; d|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Det_2', () =>
    toXmlMatch(
      tex2mml('\\smdet{a & b \\\\ c & d} '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smdet{a &amp; b \\\\ c &amp; d} " display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} a &amp; b \\\\ c &amp; d\\end{smallmatrix}\\right|" data-latex="\\smqty|a &amp; b \\\\ c &amp; d| ">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="c">c</mi>
          </mtd>
          <mtd>
            <mi data-latex="d">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Det_3', () =>
    toXmlMatch(
      tex2mml('\\matrixdeterminant a b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixdeterminant a b" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a\\end{array}\\right|" data-latex="\\left|\\begin{array}{} a\\end{array}\\right|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Matrices_Det_4', () =>
    toXmlMatch(
      tex2mml('\\mdet a b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mdet a b" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{array}{} a\\end{array}\\right|" data-latex="\\left|\\begin{array}{} a\\end{array}\\right|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Matrices_Det_5', () =>
    toXmlMatch(
      tex2mml('\\smdet a b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smdet a b" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left|\\begin{smallmatrix}{} a\\end{smallmatrix}\\right|" data-latex="\\left|\\begin{smallmatrix}{} a\\end{smallmatrix}\\right|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
  <mi data-latex="b">b</mi>
</math>`
    ));
});

describe('Physics7_5', () => {
  it('Matrices_Identity_0', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\imat{3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\imat{3}}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\imat{3}}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrices_Identity_1', () =>
    toXmlMatch(
      tex2mml('\\vmqty{\\imat{5}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vmqty{\\imat{5}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; 0 &amp; 0 &amp; 0\\\\ 0 &amp; 1 &amp; 0 &amp; 0 &amp; 0\\\\ 0 &amp; 0 &amp; 1 &amp; 0 &amp; 0\\\\ 0 &amp; 0 &amp; 0 &amp; 1 &amp; 0\\\\ 0 &amp; 0 &amp; 0 &amp; 0 &amp; 1\\end{array}\\right|" data-latex="\\mqty|\\imat{5}|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Identity_2', () =>
    toXmlMatch(
      tex2mml('\\vmqty{\\imat{0}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vmqty{\\imat{0}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{array}\\right|" data-latex="\\mqty|\\imat{0}|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Identity_3', () =>
    toXmlMatch(
      tex2mml('\\vmqty{\\imat{1}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vmqty{\\imat{1}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{array}\\right|" data-latex="\\mqty|\\imat{1}|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Identity_4', () =>
    toXmlMatch(
      tex2mml('\\vmqty{\\imat{-1}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vmqty{\\imat{-1}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{array}\\right|" data-latex="\\mqty|\\imat{-1}|">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left|" data-latex="\\left|">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Identity_5', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\imat{3}\\pmat{0}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\imat{3}\\pmat{0}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left0\\\\ 0 &amp; 1\\end{array}\\right)" data-latex="\\mqty(\\imat{3}\\pmat{0})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
});

describe('Physics7_6', () => {
  it('Matrices_XMatrix_0', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat{1}{2}{3})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat{1}{2}{3})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; 1\\\\ 1 &amp; 1 &amp; 1\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat{1}{2}{3})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mn data-latex="1">1</mn>
          </mtd>
          <mtd>
            <mn data-latex="1">1</mn>
          </mtd>
          <mtd>
            <mn data-latex="1">1</mn>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mn data-latex="1">1</mn>
          </mtd>
          <mtd>
            <mn data-latex="1">1</mn>
          </mtd>
          <mtd>
            <mn data-latex="1">1</mn>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_XMatrix_1', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat{a}{3}{3}) '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat{a}{3}{3}) " display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; a\\\\ a &amp; a &amp; a\\\\ a &amp; a &amp; a\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat{a}{3}{3}) ">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_XMatrix_2', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat{a}{3}{1}) '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat{a}{3}{1}) " display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\\\ a\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat{a}{3}{1}) ">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_XMatrix_3', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat{a}{1}{3})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat{a}{1}{3})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; a\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat{a}{1}{3})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
        </mtd>
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_XMatrix_4', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat*{1}{2}{3})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat*{1}{2}{3})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left}{1}} &amp; 1_{{1}{2}} &amp; 1_{{1}{3}}\\\\ 1_{{2}{1}} &amp; 1_{{2}{2}} &amp; 1_{{2}{3}}\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat*{1}{2}{3})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <msub data-latex="1_{{1}{1}}">
              <mn data-latex="1">1</mn>
              <mrow data-mjx-texclass="ORD" data-latex="{{1}{1}}">
                <mrow data-mjx-texclass="ORD" data-latex="{1}">
                  <mn data-latex="1">1</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{1}">
                  <mn data-latex="1">1</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
          <mtd>
            <msub data-latex="1_{{1}{2}}">
              <mn data-latex="1">1</mn>
              <mrow data-mjx-texclass="ORD" data-latex="{{1}{2}}">
                <mrow data-mjx-texclass="ORD" data-latex="{1}">
                  <mn data-latex="1">1</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{2}">
                  <mn data-latex="2">2</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
          <mtd>
            <msub data-latex="1_{{1}{3}}">
              <mn data-latex="1">1</mn>
              <mrow data-mjx-texclass="ORD" data-latex="{{1}{3}}">
                <mrow data-mjx-texclass="ORD" data-latex="{1}">
                  <mn data-latex="1">1</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{3}">
                  <mn data-latex="3">3</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <msub data-latex="1_{{2}{1}}">
              <mn data-latex="1">1</mn>
              <mrow data-mjx-texclass="ORD" data-latex="{{2}{1}}">
                <mrow data-mjx-texclass="ORD" data-latex="{2}">
                  <mn data-latex="2">2</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{1}">
                  <mn data-latex="1">1</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
          <mtd>
            <msub data-latex="1_{{2}{2}}">
              <mn data-latex="1">1</mn>
              <mrow data-mjx-texclass="ORD" data-latex="{{2}{2}}">
                <mrow data-mjx-texclass="ORD" data-latex="{2}">
                  <mn data-latex="2">2</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{2}">
                  <mn data-latex="2">2</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
          <mtd>
            <msub data-latex="1_{{2}{3}}">
              <mn data-latex="1">1</mn>
              <mrow data-mjx-texclass="ORD" data-latex="{{2}{3}}">
                <mrow data-mjx-texclass="ORD" data-latex="{2}">
                  <mn data-latex="2">2</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{3}">
                  <mn data-latex="3">3</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_XMatrix_5', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat*{a}{3}{3})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat*{a}{3}{3})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left}{1}} &amp; a_{{1}{2}} &amp; a_{{1}{3}}\\\\ a_{{2}{1}} &amp; a_{{2}{2}} &amp; a_{{2}{3}}\\\\ a_{{3}{1}} &amp; a_{{3}{2}} &amp; a_{{3}{3}}\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat*{a}{3}{3})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <msub data-latex="a_{{1}{1}}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{{1}{1}}">
                <mrow data-mjx-texclass="ORD" data-latex="{1}">
                  <mn data-latex="1">1</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{1}">
                  <mn data-latex="1">1</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
          <mtd>
            <msub data-latex="a_{{1}{2}}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{{1}{2}}">
                <mrow data-mjx-texclass="ORD" data-latex="{1}">
                  <mn data-latex="1">1</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{2}">
                  <mn data-latex="2">2</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
          <mtd>
            <msub data-latex="a_{{1}{3}}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{{1}{3}}">
                <mrow data-mjx-texclass="ORD" data-latex="{1}">
                  <mn data-latex="1">1</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{3}">
                  <mn data-latex="3">3</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <msub data-latex="a_{{2}{1}}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{{2}{1}}">
                <mrow data-mjx-texclass="ORD" data-latex="{2}">
                  <mn data-latex="2">2</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{1}">
                  <mn data-latex="1">1</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
          <mtd>
            <msub data-latex="a_{{2}{2}}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{{2}{2}}">
                <mrow data-mjx-texclass="ORD" data-latex="{2}">
                  <mn data-latex="2">2</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{2}">
                  <mn data-latex="2">2</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
          <mtd>
            <msub data-latex="a_{{2}{3}}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{{2}{3}}">
                <mrow data-mjx-texclass="ORD" data-latex="{2}">
                  <mn data-latex="2">2</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{3}">
                  <mn data-latex="3">3</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <msub data-latex="a_{{3}{1}}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{{3}{1}}">
                <mrow data-mjx-texclass="ORD" data-latex="{3}">
                  <mn data-latex="3">3</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{1}">
                  <mn data-latex="1">1</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
          <mtd>
            <msub data-latex="a_{{3}{2}}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{{3}{2}}">
                <mrow data-mjx-texclass="ORD" data-latex="{3}">
                  <mn data-latex="3">3</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{2}">
                  <mn data-latex="2">2</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
          <mtd>
            <msub data-latex="a_{{3}{3}}">
              <mi data-latex="a">a</mi>
               <mrow data-mjx-texclass="ORD" data-latex="{{3}{3}}">
                <mrow data-mjx-texclass="ORD" data-latex="{3}">
                  <mn data-latex="3">3</mn>
                </mrow>
                <mrow data-mjx-texclass="ORD" data-latex="{3}">
                  <mn data-latex="3">3</mn>
                </mrow>
              </mrow>
            </msub>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_XMatrix_6', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat*{a}{3}{1})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat*{a}{3}{1})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\\\ a_{2}\\\\ a_{3}\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat*{a}{3}{1})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <msub data-latex="a_{1}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{1}">
                <mn data-latex="1">1</mn>
              </mrow>
            </msub>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <msub data-latex="a_{2}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{2}">
                <mn data-latex="2">2</mn>
              </mrow>
            </msub>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <msub data-latex="a_{3}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{3}">
                <mn data-latex="3">3</mn>
              </mrow>
            </msub>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_XMatrix_7', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat*{a}{1}{3})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat*{a}{1}{3})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; a_{2} &amp; a_{3}\\end{smallmatrix}\\right)" data-latex="\\smqty(\\xmat*{a}{1}{3})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <msub data-latex="a_{1}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{1}">
                <mn data-latex="1">1</mn>
              </mrow>
            </msub>
          </mtd>
          <mtd>
            <msub data-latex="a_{2}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{2}">
                <mn data-latex="2">2</mn>
              </mrow>
            </msub>
          </mtd>
          <mtd>
            <msub data-latex="a_{3}">
              <mi data-latex="a">a</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{3}">
                <mn data-latex="3">3</mn>
              </mrow>
            </msub>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_XMatrix_8', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat*{a}{1}{1})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat*{a}{1}{1})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{smallmatrix}\\right)" data-latex="\\smqty(\\xmat*{a}{1}{1})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_XMatrix_9', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmat*{a}{-1}{-1})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmat*{a}{-1}{-1})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{smallmatrix}\\right)" data-latex="\\smqty(\\xmat*{a}{-1}{-1})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mi data-latex="a">a</mi>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_XMatrix_10', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\zmat{1}{3})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\zmat{1}{3})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; 0\\end{smallmatrix}\\right)" data-latex="\\smqty(\\zmat{1}{3})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mn data-latex="0">0</mn>
          </mtd>
          <mtd>
            <mn data-latex="0">0</mn>
          </mtd>
          <mtd>
            <mn data-latex="0">0</mn>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_XMatrix_11', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\zmat{2}{3})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\zmat{2}{3})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; 0\\\\ 0 &amp; 0 &amp; 0\\end{smallmatrix}\\right)" data-latex="\\smqty(\\zmat{2}{3})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mn data-latex="0">0</mn>
          </mtd>
          <mtd>
            <mn data-latex="0">0</mn>
          </mtd>
          <mtd>
            <mn data-latex="0">0</mn>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mn data-latex="0">0</mn>
          </mtd>
          <mtd>
            <mn data-latex="0">0</mn>
          </mtd>
          <mtd>
            <mn data-latex="0">0</mn>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_XMatrix_12', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\zmat{3}{1})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\zmat{3}{1})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\\\ 0\\end{smallmatrix}\\right)" data-latex="\\smqty(\\zmat{3}{1})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="{smallmatrix}">
      <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
        <mtr>
          <mtd>
            <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
            <mn data-latex="0">0</mn>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mn data-latex="0">0</mn>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mn data-latex="0">0</mn>
          </mtd>
        </mtr>
      </mtable>
    </mstyle>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
});

describe('Physics7_7', () => {
  it('Matrices_Pauli_0', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{0}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{0}}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{0}}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrices_Pauli_1', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{0}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{0}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left0\\\\ 0 &amp; 1\\end{array}\\right)" data-latex="\\mqty(\\pmat{0})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Pauli_2', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{1}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{1}}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{1}}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrices_Pauli_3', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{2}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{2}}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{2}}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mo data-latex="-">&#x2212;</mo>
        <mi data-latex="i">i</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mi data-latex="i">i</mi>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrices_Pauli_4', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{3}}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{3}}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mo data-latex="-">&#x2212;</mo>
        <mn data-latex="1">1</mn>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrices_Pauli_5', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{4}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{4}}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{4}}"></mtable>
</math>`
    ));
  it('Matrices_Pauli_6', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{x}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{x}}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{x}}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrices_Pauli_7', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{y}}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{y}}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mo data-latex="-">&#x2212;</mo>
        <mi data-latex="i">i</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mi data-latex="i">i</mi>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrices_Pauli_8', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{z}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{z}}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{z}}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
    </mtr>
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mo data-latex="-">&#x2212;</mo>
        <mn data-latex="1">1</mn>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrices_Pauli_9', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{a}}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{a}}"></mtable>
</math>`
    ));
  it('Matrices_Pauli_10', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{a}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\leftarray}\\right)" data-latex="\\mqty(\\pmat{a})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}"></mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Pauli_11', () =>
    toXmlMatch(
      tex2mml('\\mqty{\\pmat{aa}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty{\\pmat{aa}}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\mqty{\\pmat{aa}}">
    <mtr data-latex-item="{}" data-latex="{}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrices_Pauli_12', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{0.a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{0.a}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left&amp; 0\\\\ 0 &amp; 1\\end{array}\\right)" data-latex="\\mqty(\\pmat{0.a})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mo data-latex=".">.</mo>
          <mi data-latex="a">a</mi>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
});

describe('Physics7_8', () => {
  it('Matrices_PauliFenced_0', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{1}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{1}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left1\\\\ 1 &amp; 0\\end{array}\\right)" data-latex="\\mqty(\\pmat{1})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_PauliFenced_1', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{2}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{2}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left-i\\\\ i &amp; 0\\end{array}\\right)" data-latex="\\mqty(\\pmat{2})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mo data-latex="-">&#x2212;</mo>
          <mi data-latex="i">i</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="i">i</mi>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_PauliFenced_2', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{3}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left0\\\\ 0 &amp; -1\\end{array}\\right)" data-latex="\\mqty(\\pmat{3})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mo data-latex="-">&#x2212;</mo>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_PauliFenced_3', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{4}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{4}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\leftarray}\\right)" data-latex="\\mqty(\\pmat{4})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}"></mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_PauliFenced_4', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{x}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{x}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left1\\\\ 1 &amp; 0\\end{array}\\right)" data-latex="\\mqty(\\pmat{x})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_PauliFenced_5', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{y}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left-i\\\\ i &amp; 0\\end{array}\\right)" data-latex="\\mqty(\\pmat{y})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mo data-latex="-">&#x2212;</mo>
          <mi data-latex="i">i</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="i">i</mi>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_PauliFenced_6', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{z}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{z}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left0\\\\ 0 &amp; -1\\end{array}\\right)" data-latex="\\mqty(\\pmat{z})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
        <mtd>
          <mo data-latex="-">&#x2212;</mo>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_PauliFenced_7', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\pmat{aa}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\pmat{aa}}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{array}\\right)" data-latex="\\mqty(\\pmat{aa})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
});

describe('Physics7_9', () => {
  it('Matrices_Diag_0', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3\\\\4&amp;5}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Diag_1', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat 1)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat 1)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\dmat 1\\end{array}\\right)" data-latex="\\mqty(\\dmat 1)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Diag_2', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat 1,2)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat 1,2)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\begin{array}{} \\dmat 1,2\\end{array}\\right)" data-latex="\\mqty(\\dmat 1,2)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mn data-latex="1">1</mn>
          <mo data-latex=",">,</mo>
          <mn data-latex="2">2</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Diag_3', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5&6,7,8})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5&amp;6,7,8})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3\\\\4&amp;5&amp;6}\\\\ &amp;&amp;\\mqty{7}\\\\ &amp;&amp;&amp;\\mqty{8}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5&amp;6,7,8})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
              <mtd>
                <mn data-latex="6">6</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="7">7</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="8">8</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Diag_4', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5,6,7,8})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5,6,7,8})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3\\\\4&amp;5}\\\\ &amp;&amp;\\mqty{6}\\\\ &amp;&amp;&amp;\\mqty{7}\\\\ &amp;&amp;&amp;&amp;\\mqty{8}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5,6,7,8})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="6">6</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="7">7</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="8">8</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Diag_5', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2\\\\3\\\\4\\\\5\\\\6,7,8})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2\\\\3\\\\4\\\\5\\\\6,7,8})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2\\\\3\\\\4\\\\5\\\\6}\\\\ &amp;&amp;\\mqty{7}\\\\ &amp;&amp;&amp;\\mqty{8}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2\\\\3\\\\4\\\\5\\\\6,7,8})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="6">6</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="7">7</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="8">8</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Matrices_Diag_6', () =>
    toXmlMatch(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5&6,7,8,\\dmat{9,10}})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5&amp;6,7,8,\\dmat{9,10}})" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left{1}\\\\ &amp;\\mqty{2&amp;3\\\\4&amp;5&amp;6}\\\\ &amp;&amp;\\mqty{7}\\\\ &amp;&amp;&amp;\\mqty{8}\\\\ &amp;&amp;&amp;&amp;\\mqty{\\dmat{9,10}}\\end{array}\\right)" data-latex="\\mqty(\\dmat{1,2&amp;3\\\\4&amp;5&amp;6,7,8,\\dmat{9,10}})">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="1">1</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="2">2</mn>
              </mtd>
              <mtd>
                <mn data-latex="3">3</mn>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="4">4</mn>
              </mtd>
              <mtd>
                <mn data-latex="5">5</mn>
              </mtd>
              <mtd>
                <mn data-latex="6">6</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="7">7</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mn data-latex="8">8</mn>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr data-latex-item="{}" data-latex="{}">
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd></mtd>
        <mtd>
          <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd>
                <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
                  <mtr data-latex-item="{}" data-latex="{}">
                    <mtd>
                      <mn data-latex="9">9</mn>
                    </mtd>
                  </mtr>
                </mtable>
              </mtd>
            </mtr>
            <mtr data-latex-item="{}" data-latex="{}">
              <mtd></mtd>
              <mtd>
                <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
                  <mtr data-latex-item="{}" data-latex="{}">
                    <mtd>
                      <mn data-latex="0">10</mn>
                    </mtd>
                  </mtr>
                </mtable>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
});

describe('Physics Errors', () => {
  it('MissingArgFor Quantity', () =>
    toXmlMatch(
      tex2mml('\\pqty'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pqty" display="block">
      <merror data-mjx-error="Missing argument for \\pqty">
        <mtext>Missing argument for \\pqty</mtext>
      </merror>
    </math>`
    ));
  it('MissingArgFor Eval', () =>
    toXmlMatch(
      tex2mml('\\eval'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eval" display="block">
      <merror data-mjx-error="Missing argument for \\eval">
        <mtext>Missing argument for \\eval</mtext>
      </merror>
    </math>`
    ));
  it('MissingArgFor Commutator 1', () =>
    toXmlMatch(
      tex2mml('\\commutator\\nix'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\commutator\\nix" display="block">
      <merror data-mjx-error="Missing argument for \\commutator">
        <mtext>Missing argument for \\commutator</mtext>
      </merror>
    </math>`
    ));
  it('MissingArgFor Commutator 2', () =>
    toXmlMatch(
      tex2mml('\\commutator'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\commutator" display="block">
      <merror data-mjx-error="Missing argument for \\commutator">
        <mtext>Missing argument for \\commutator</mtext>
      </merror>
    </math>`
    ));
  it('InvalidNumber IdentityMatrix', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\identitymatrix{a})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\identitymatrix{a})" display="block">
      <merror data-mjx-error="Invalid number">
        <mtext>Invalid number</mtext>
      </merror>
    </math>`
    ));
  it('InvalidNumber XMatrix n', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmatrix{a}{a}{2})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmatrix{a}{a}{2})" display="block">
      <merror data-mjx-error="Invalid number">
        <mtext>Invalid number</mtext>
      </merror>
    </math>`
    ));
  it('InvalidNumber XMatrix m', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmatrix{a}{2}{a})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmatrix{a}{2}{a})" display="block">
      <merror data-mjx-error="Invalid number">
        <mtext>Invalid number</mtext>
      </merror>
    </math>`
    ));
  it('InvalidNumber XMatrix n+', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmatrix{a}{2.0}{2})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmatrix{a}{2.0}{2})" display="block">
      <merror data-mjx-error="Invalid number">
        <mtext>Invalid number</mtext>
      </merror>
    </math>`
    ));
  it('InvalidNumber XMatrix m+', () =>
    toXmlMatch(
      tex2mml('\\smqty(\\xmatrix{a}{2}{2.0})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smqty(\\xmatrix{a}{2}{2.0})" display="block">
      <merror data-mjx-error="Invalid number">
        <mtext>Invalid number</mtext>
      </merror>
    </math>`
    ));
});

describe('Automatic Bracing Macros Rest', () => {
  it('Quantities_Bracket', () =>
    toXmlMatch(
      tex2mml('\\bqty\\Bigg{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bqty\\Bigg{a}" display="block">
      <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl[">
        <mo minsize="2.470em" maxsize="2.470em">[</mo>
      </mrow>
      <mi data-latex="a">a</mi>
      <mrow data-mjx-texclass="CLOSE" data-latex="\\bqty\\Bigg{a}">
        <mo minsize="2.470em" maxsize="2.470em">]</mo>
      </mrow>
    </math>`
    ));
  it('Quantities_Vert', () =>
    toXmlMatch(
      tex2mml('\\vqty\\Bigg{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vqty\\Bigg{a}" display="block">
      <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl|">
        <mo minsize="2.470em" maxsize="2.470em">|</mo>
      </mrow>
      <mi data-latex="a">a</mi>
      <mrow data-mjx-texclass="CLOSE" data-latex="\\vqty\\Bigg{a}">
        <mo minsize="2.470em" maxsize="2.470em">|</mo>
      </mrow>
    </math>`
    ));
});

describe('Vector Mo Rest', () => {
  it('dotproduct', () =>
    toXmlMatch(
      tex2mml('A \\dotproduct B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\dotproduct B" display="block">
      <mi data-latex="A">A</mi>
      <mo mathvariant="bold" data-latex="\\dotproduct">&#x22C5;</mo>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('vdot', () =>
    toXmlMatch(
      tex2mml('A \\vdot B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\vdot B" display="block">
      <mi data-latex="A">A</mi>
      <mo mathvariant="bold" data-latex="\\vdot">&#x22C5;</mo>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('cross', () =>
    toXmlMatch(
      tex2mml('A \\cross B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\cross B" display="block">
      <mi data-latex="A">A</mi>
      <mo data-latex="\\cross">&#xD7;</mo>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('cp', () =>
    toXmlMatch(
      tex2mml('A \\cp B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\cp B" display="block">
      <mi data-latex="A">A</mi>
      <mo data-latex="\\cp">&#xD7;</mo>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('divsymbol', () =>
    toXmlMatch(
      tex2mml('A \\divsymbol B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\divsymbol B" display="block">
      <mi data-latex="A">A</mi>
      <mo data-latex="\\divsymbol">&#xF7;</mo>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('divisionsymbol', () =>
    toXmlMatch(
      tex2mml('A \\divisionsymbol B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\divisionsymbol B" display="block">
      <mi data-latex="A">A</mi>
      <mo data-latex="\\divisionsymbol">&#xF7;</mo>
      <mi data-latex="B">B</mi>
    </math>`
    ));
});

describe('Expressions Macros Rest', () => {
  it('trace', () =>
    toXmlMatch(
      tex2mml('\\trace(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\trace(x)" display="block">
      <mi>tr</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mrow data-latex=")">
        <mo data-mjx-texclass="OPEN">(</mo>
        <mi data-latex="x">x</mi>
        <mo data-mjx-texclass="CLOSE">)</mo>
      </mrow>
    </math>`
    ));
  it('Tr', () =>
    toXmlMatch(
      tex2mml('\\Tr(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Tr(x)" display="block">
      <mi>Tr</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mrow data-latex=")">
        <mo data-mjx-texclass="OPEN">(</mo>
        <mi data-latex="x">x</mi>
        <mo data-mjx-texclass="CLOSE">)</mo>
      </mrow>
    </math>`
    ));
  it('Trace', () =>
    toXmlMatch(
      tex2mml('\\Trace(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Trace(x)" display="block">
      <mi>Tr</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mrow data-latex=")">
        <mo data-mjx-texclass="OPEN">(</mo>
        <mi data-latex="x">x</mi>
        <mo data-mjx-texclass="CLOSE">)</mo>
      </mrow>
    </math>`
    ));
  it('arcsine', () =>
    toXmlMatch(
      tex2mml('\\arcsine(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arcsine(x)" display="block">
      <mi data-latex="\\arcsine">arcsin</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('asine', () =>
    toXmlMatch(
      tex2mml('\\asine(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\asine(x)" display="block">
      <mi data-latex="\\asine">asin</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('cosine', () =>
    toXmlMatch(
      tex2mml('\\cosine(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cosine(x)" display="block">
      <mi data-latex="\\cosine">cos</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('hypcosine', () =>
    toXmlMatch(
      tex2mml('\\hypcosine(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\hypcosine(x)" display="block">
      <mi data-latex="\\hypcosine">cosh</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('arccosine', () =>
    toXmlMatch(
      tex2mml('\\arccosine(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccosine(x)" display="block">
      <mi data-latex="\\arccosine">arccos</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('acosine', () =>
    toXmlMatch(
      tex2mml('\\acosine(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acosine(x)" display="block">
      <mi data-latex="\\acosine">acos</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('tangent', () =>
    toXmlMatch(
      tex2mml('\\tangent(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tangent(x)" display="block">
      <mi data-latex="\\tangent">tan</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('hyptangent', () =>
    toXmlMatch(
      tex2mml('\\hyptangent(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\hyptangent(x)" display="block">
      <mi data-latex="\\hyptangent">tanh</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('arctangent', () =>
    toXmlMatch(
      tex2mml('\\arctangent(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arctangent(x)" display="block">
      <mi data-latex="\\arctangent">arctan</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('atangent', () =>
    toXmlMatch(
      tex2mml('\\atangent(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\atangent(x)" display="block">
      <mi data-latex="\\atangent">atan</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('cosecant', () =>
    toXmlMatch(
      tex2mml('\\cosecant(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cosecant(x)" display="block">
      <mi data-latex="\\cosecant">csc</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('hypcosecant', () =>
    toXmlMatch(
      tex2mml('\\hypcosecant(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\hypcosecant(x)" display="block">
      <mi data-latex="\\hypcosecant">csch</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('arccosecant', () =>
    toXmlMatch(
      tex2mml('\\arccosecant(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccosecant(x)" display="block">
      <mi data-latex="\\arccosecant">arccsc</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('acosecant', () =>
    toXmlMatch(
      tex2mml('\\acosecant(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acosecant(x)" display="block">
      <mi data-latex="\\acosecant">acsc</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('secant', () =>
    toXmlMatch(
      tex2mml('\\secant(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\secant(x)" display="block">
      <mi data-latex="\\secant">sec</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('hypsecant', () =>
    toXmlMatch(
      tex2mml('\\hypsecant(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\hypsecant(x)" display="block">
      <mi data-latex="\\hypsecant">sech</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('arcsecant', () =>
    toXmlMatch(
      tex2mml('\\arcsecant(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arcsecant(x)" display="block">
      <mi data-latex="\\arcsecant">arcsec</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('asecant', () =>
    toXmlMatch(
      tex2mml('\\asecant(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\asecant(x)" display="block">
      <mi data-latex="\\asecant">asec</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('cotangent', () =>
    toXmlMatch(
      tex2mml('\\cotangent(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cotangent(x)" display="block">
      <mi data-latex="\\cotangent">cot</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('hypcotangent', () =>
    toXmlMatch(
      tex2mml('\\hypcotangent(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\hypcotangent(x)" display="block">
      <mi data-latex="\\hypcotangent">coth</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('arccotangent', () =>
    toXmlMatch(
      tex2mml('\\arccotangent(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\arccotangent(x)" display="block">
      <mi data-latex="\\arccotangent">arccot</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('acotangent', () =>
    toXmlMatch(
      tex2mml('\\acotangent(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\acotangent(x)" display="block">
      <mi data-latex="\\acotangent">acot</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('exponential', () =>
    toXmlMatch(
      tex2mml('\\exponential(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\exponential(x)" display="block">
      <mi data-latex="\\exponential">exp</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('logarithm', () =>
    toXmlMatch(
      tex2mml('\\logarithm(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\logarithm(x)" display="block">
      <mi data-latex="\\logarithm">log</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('naturallogarithm', () =>
    toXmlMatch(
      tex2mml('\\naturallogarithm(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\naturallogarithm(x)" display="block">
      <mi data-latex="\\naturallogarithm">ln</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('determinant', () =>
    toXmlMatch(
      tex2mml('\\determinant(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\determinant(x)" display="block">
      <mi data-latex="\\determinant">det</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
  it('Probability', () =>
    toXmlMatch(
      tex2mml('\\Probability(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Probability(x)" display="block">
      <mi data-latex="\\Probability">Pr</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="x">x</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </math>`
    ));
});

describe('Derivative Macros Rest', () => {
  it('differential', () =>
    toXmlMatch(
      tex2mml('\\differential'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\differential" display="block">
      <mrow data-mjx-texclass="ORD" data-latex="\\differential">
        <mi mathvariant="normal" data-latex="d">d</mi>
      </mrow>
    </math>`
    ));
  it('variation', () =>
    toXmlMatch(
      tex2mml('\\variation'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\variation" display="block">
      <mi data-latex="\\variation">&#x3B4;</mi>
    </math>`
    ));
  it('derivative one arg', () =>
    toXmlMatch(
      tex2mml('\\derivative{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\derivative{x}" display="block">
      <mfrac data-latex="\\derivative{x}">
        <mrow data-mjx-texclass="ORD" data-latex="\\diffd ">
          <mi mathvariant="normal" data-latex="d">d</mi>
        </mrow>
        <mrow data-latex="\\diffd x  ">
          <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
            <mi mathvariant="normal" data-latex="d">d</mi>
          </mrow>
          <mi data-latex="x">x</mi>
        </mrow>
      </mfrac>
    </math>`
    ));
  it('derivative two arg', () =>
    toXmlMatch(
      tex2mml('\\derivative{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\derivative{x}{y}" display="block">
      <mfrac data-latex="\\derivative{x}{y}">
        <mrow data-latex="\\diffd x">
          <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
            <mi mathvariant="normal" data-latex="d">d</mi>
          </mrow>
          <mi data-latex="x">x</mi>
        </mrow>
        <mrow data-latex="\\diffd y  ">
          <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
            <mi mathvariant="normal" data-latex="d">d</mi>
          </mrow>
          <mi data-latex="y">y</mi>
        </mrow>
      </mfrac>
    </math>`
    ));
  it('derivative three arg', () =>
    toXmlMatch(
      tex2mml('\\derivative{x}{y}{z}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\derivative{x}{y}{z}" display="block">
      <mfrac data-latex="\\derivative{x}{y}">
        <mrow data-latex="\\diffd x">
          <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
            <mi mathvariant="normal" data-latex="d">d</mi>
          </mrow>
          <mi data-latex="x">x</mi>
        </mrow>
        <mrow data-latex="\\diffd y  ">
          <mrow data-mjx-texclass="ORD" data-latex="\\diffd">
            <mi mathvariant="normal" data-latex="d">d</mi>
          </mrow>
          <mi data-latex="y">y</mi>
        </mrow>
      </mfrac>
      <mrow data-mjx-texclass="ORD" data-latex="{z}">
        <mi data-latex="z">z</mi>
      </mrow>
    </math>`
    ));
  it('partialderivative one arg', () =>
    toXmlMatch(
      tex2mml('\\partialderivative{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\partialderivative{x}" display="block">
      <mfrac data-latex="\\partialderivative{x}">
        <mi data-latex="\\partial ">&#x2202;</mi>
        <mrow data-latex="\\partial x  ">
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="x">x</mi>
        </mrow>
      </mfrac>
    </math>`
    ));
  it('partialderivative two arg', () =>
    toXmlMatch(
      tex2mml('\\partialderivative{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\partialderivative{x}{y}" display="block">
      <mfrac data-latex="\\partialderivative{x}{y}">
        <mrow data-latex="\\partial x">
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="x">x</mi>
        </mrow>
        <mrow data-latex="\\partial y  ">
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="y">y</mi>
        </mrow>
      </mfrac>
    </math>`
    ));
  it('partialderivative three arg', () =>
    toXmlMatch(
      tex2mml('\\partialderivative{x}{y}{z}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\partialderivative{x}{y}{z}" display="block">
      <mfrac data-latex="\\partialderivative{x}{y}{z}">
        <mrow data-latex="\\partial^{2}x">
          <msup data-latex="\\partial^{2}">
            <mi data-latex="\\partial">&#x2202;</mi>
            <mrow data-mjx-texclass="ORD" data-latex="{2}">
              <mn data-latex="2">2</mn>
            </mrow>
          </msup>
          <mi data-latex="x">x</mi>
        </mrow>
        <mrow data-latex="\\partial y  \\partial z">
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="y">y</mi>
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="z">z</mi>
        </mrow>
      </mfrac>
    </math>`
    ));
  it('partialderivative four arg', () =>
    toXmlMatch(
      tex2mml('\\partialderivative{x}{y}{z}{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\partialderivative{x}{y}{z}{a}" display="block">
      <mfrac data-latex="\\partialderivative{x}{y}{z}">
        <mrow data-latex="\\partial^{2}x">
          <msup data-latex="\\partial^{2}">
            <mi data-latex="\\partial">&#x2202;</mi>
            <mrow data-mjx-texclass="ORD" data-latex="{2}">
              <mn data-latex="2">2</mn>
            </mrow>
          </msup>
          <mi data-latex="x">x</mi>
        </mrow>
        <mrow data-latex="\\partial y  \\partial z">
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="y">y</mi>
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="z">z</mi>
        </mrow>
      </mfrac>
      <mrow data-mjx-texclass="ORD" data-latex="{a}">
        <mi data-latex="a">a</mi>
      </mrow>
    </math>`
    ));
  it('pderivative one arg', () =>
    toXmlMatch(
      tex2mml('\\pderivative{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pderivative{x}" display="block">
      <mfrac data-latex="\\pderivative{x}">
        <mi data-latex="\\partial ">&#x2202;</mi>
        <mrow data-latex="\\partial x  ">
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="x">x</mi>
        </mrow>
      </mfrac>
    </math>`
    ));
  it('pderivative two arg', () =>
    toXmlMatch(
      tex2mml('\\pderivative{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pderivative{x}{y}" display="block">
      <mfrac data-latex="\\pderivative{x}{y}">
        <mrow data-latex="\\partial x">
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="x">x</mi>
        </mrow>
        <mrow data-latex="\\partial y  ">
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="y">y</mi>
        </mrow>
      </mfrac>
    </math>`
    ));
  it('pderivative three arg', () =>
    toXmlMatch(
      tex2mml('\\pderivative{x}{y}{z}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pderivative{x}{y}{z}" display="block">
      <mfrac data-latex="\\pderivative{x}{y}{z}">
        <mrow data-latex="\\partial^{2}x">
          <msup data-latex="\\partial^{2}">
            <mi data-latex="\\partial">&#x2202;</mi>
            <mrow data-mjx-texclass="ORD" data-latex="{2}">
              <mn data-latex="2">2</mn>
            </mrow>
          </msup>
          <mi data-latex="x">x</mi>
        </mrow>
        <mrow data-latex="\\partial y  \\partial z">
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="y">y</mi>
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="z">z</mi>
        </mrow>
      </mfrac>
    </math>`
    ));
  it('pderivative four arg', () =>
    toXmlMatch(
      tex2mml('\\pderivative{x}{y}{z}{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pderivative{x}{y}{z}{a}" display="block">
      <mfrac data-latex="\\pderivative{x}{y}{z}">
        <mrow data-latex="\\partial^{2}x">
          <msup data-latex="\\partial^{2}">
            <mi data-latex="\\partial">&#x2202;</mi>
            <mrow data-mjx-texclass="ORD" data-latex="{2}">
              <mn data-latex="2">2</mn>
            </mrow>
          </msup>
          <mi data-latex="x">x</mi>
        </mrow>
        <mrow data-latex="\\partial y  \\partial z">
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="y">y</mi>
          <mi data-latex="\\partial">&#x2202;</mi>
          <mi data-latex="z">z</mi>
        </mrow>
      </mfrac>
      <mrow data-mjx-texclass="ORD" data-latex="{a}">
        <mi data-latex="a">a</mi>
      </mrow>
    </math>`
    ));
});

describe('Quick Quad Macros Rest', () => {
  it('qq', () =>
    toXmlMatch(
      tex2mml('A \\qq B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qq B" display="block">
      <mi data-latex="\\qq B">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{B}">B</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
    </math>`
    ));
  it('qcomma', () =>
    toXmlMatch(
      tex2mml('A \\qcomma B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qcomma B" display="block">
      <mi data-latex="\\qqtext*{,}">A</mi>
      <mtext data-latex="\\text{,}">,</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qthen', () =>
    toXmlMatch(
      tex2mml('A \\qthen B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qthen B" display="block">
      <mi data-latex="\\qthen">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{then}">then</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qelse', () =>
    toXmlMatch(
      tex2mml('A \\qelse B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qelse B" display="block">
      <mi data-latex="\\qelse">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{else}">else</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qotherwise', () =>
    toXmlMatch(
      tex2mml('A \\qotherwise B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qotherwise B" display="block">
      <mi data-latex="\\qotherwise">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{otherwise}">otherwise</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qunless', () =>
    toXmlMatch(
      tex2mml('A \\qunless B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qunless B" display="block">
      <mi data-latex="\\qunless">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{unless}">unless</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qgiven', () =>
    toXmlMatch(
      tex2mml('A \\qgiven B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qgiven B" display="block">
      <mi data-latex="\\qgiven">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{given}">given</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qusing', () =>
    toXmlMatch(
      tex2mml('A \\qusing B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qusing B" display="block">
      <mi data-latex="\\qusing">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{using}">using</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qassume', () =>
    toXmlMatch(
      tex2mml('A \\qassume B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qassume B" display="block">
      <mi data-latex="\\qassume">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{assume}">assume</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qsince', () =>
    toXmlMatch(
      tex2mml('A \\qsince B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qsince B" display="block">
      <mi data-latex="\\qsince">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{since}">since</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qlet', () =>
    toXmlMatch(
      tex2mml('A \\qlet B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qlet B" display="block">
      <mi data-latex="\\qlet">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{let}">let</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qfor', () =>
    toXmlMatch(
      tex2mml('A \\qfor B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qfor B" display="block">
      <mi data-latex="\\qfor">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{for}">for</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qall', () =>
    toXmlMatch(
      tex2mml('A \\qall B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qall B" display="block">
      <mi data-latex="\\qall">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{all}">all</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qeven', () =>
    toXmlMatch(
      tex2mml('A \\qeven B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qeven B" display="block">
      <mi data-latex="\\qeven">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{even}">even</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qodd', () =>
    toXmlMatch(
      tex2mml('A \\qodd B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qodd B" display="block">
      <mi data-latex="\\qodd">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{odd}">odd</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qinteger', () =>
    toXmlMatch(
      tex2mml('A \\qinteger B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qinteger B" display="block">
      <mi data-latex="\\qinteger">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{integer}">integer</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qor', () =>
    toXmlMatch(
      tex2mml('A \\qor B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qor B" display="block">
      <mi data-latex="\\qor">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{or}">or</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qas', () =>
    toXmlMatch(
      tex2mml('A \\qas B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qas B" display="block">
      <mi data-latex="\\qas">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{as}">as</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
  it('qin', () =>
    toXmlMatch(
      tex2mml('A \\qin B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A \\qin B" display="block">
      <mi data-latex="\\qin">A</mi>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mtext data-latex="\\text{in}">in</mtext>
      <mspace width="1em" data-latex="\\quad"></mspace>
      <mi data-latex="B">B</mi>
    </math>`
    ));
});

describe('Bra-Ket Macros Rest', () => {
  it('innerproduct arg one', () =>
    toXmlMatch(
      tex2mml('\\innerproduct{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\innerproduct{A}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{A}\\right\\rangle" data-latex="\\innerproduct{A}">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mrow data-mjx-texclass="CLOSE"></mrow>
        <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
        <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
    </math>`
    ));
  it('innerproduct arg two', () =>
    toXmlMatch(
      tex2mml('\\innerproduct{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\innerproduct{A}{B}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{B}\\right\\rangle" data-latex="\\innerproduct{A}{B}">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mrow data-mjx-texclass="CLOSE"></mrow>
        <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
        <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
    </math>`
    ));
  it('innerproduct arg three', () =>
    toXmlMatch(
      tex2mml('\\innerproduct{A}{B}{C}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\innerproduct{A}{B}{C}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{B}\\right\\rangle" data-latex="\\left\\langle{A}\\middle\\vert{B}\\right\\rangle">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mrow data-mjx-texclass="CLOSE"></mrow>
        <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
        <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{C}">
        <mi data-latex="C">C</mi>
      </mrow>
    </math>`
    ));
  it('ip arg one', () =>
    toXmlMatch(
      tex2mml('\\ip{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ip{A}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{A}\\right\\rangle" data-latex="\\ip{A}">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mrow data-mjx-texclass="CLOSE"></mrow>
        <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
        <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
    </math>`
    ));
  it('ip arg two', () =>
    toXmlMatch(
      tex2mml('\\ip{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ip{A}{B}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{B}\\right\\rangle" data-latex="\\ip{A}{B}">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mrow data-mjx-texclass="CLOSE"></mrow>
        <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
        <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
    </math>`
    ));
  it('ip arg three', () =>
    toXmlMatch(
      tex2mml('\\ip{A}{B}{C}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ip{A}{B}{C}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\middle\\vert{B}\\right\\rangle" data-latex="\\left\\langle{A}\\middle\\vert{B}\\right\\rangle">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mrow data-mjx-texclass="CLOSE"></mrow>
        <mo data-latex-item="\\middle\\vert" data-latex="\\middle\\vert">|</mo>
        <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\vert"></mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{C}">
        <mi data-latex="C">C</mi>
      </mrow>
    </math>`
    ));
  it('op arg one', () =>
    toXmlMatch(
      tex2mml('\\op{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\op{A}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\middle\\rangle\\!\\middle\\langle{A}\\right\\vert" data-latex="\\op{A}">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mrow data-mjx-texclass="CLOSE"></mrow>
        <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
        <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
        <mspace width="-0.167em" data-latex="\\!"></mspace>
        <mrow data-mjx-texclass="CLOSE"></mrow>
        <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
      </mrow>
    </math>`
    ));
  it('op arg two', () =>
    toXmlMatch(
      tex2mml('\\op{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\op{A}{B}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\middle\\rangle\\!\\middle\\langle{B}\\right\\vert" data-latex="\\op{A}{B}">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mrow data-mjx-texclass="CLOSE"></mrow>
        <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
        <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
        <mspace width="-0.167em" data-latex="\\!"></mspace>
        <mrow data-mjx-texclass="CLOSE"></mrow>
        <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
      </mrow>
    </math>`
    ));
  it('op arg three', () =>
    toXmlMatch(
      tex2mml('\\op{A}{B}{C}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\op{A}{B}{C}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{A}\\middle\\rangle\\!\\middle\\langle{B}\\right\\vert" data-latex="\\left\\vert{A}\\middle\\rangle\\!\\middle\\langle{B}\\right\\vert">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mrow data-mjx-texclass="CLOSE"></mrow>
        <mo data-latex-item="\\middle\\rangle" data-latex="\\middle\\rangle">&#x27E9;</mo>
        <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\rangle"></mrow>
        <mspace width="-0.167em" data-latex="\\!"></mspace>
        <mrow data-mjx-texclass="CLOSE"></mrow>
        <mo data-latex-item="\\middle\\langle" data-latex="\\middle\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\langle"></mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{C}">
        <mi data-latex="C">C</mi>
      </mrow>
    </math>`
    ));
  it('expectationvalue arg one', () =>
    toXmlMatch(
      tex2mml('\\expectationvalue{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\expectationvalue{A}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle {A} \\right\\rangle" data-latex="\\expectationvalue{A}">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle " data-latex="\\left\\langle ">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
    </math>`
    ));
  it('expectationvalue arg two', () =>
    toXmlMatch(
      tex2mml('\\expectationvalue{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\expectationvalue{A}{B}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{B}\\right\\vert" data-latex="\\left\\langle{B}\\right\\vert">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{A}">
        <mi data-latex="A">A</mi>
      </mrow>
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{B}\\right\\rangle" data-latex="\\left\\vert{B}\\right\\rangle">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
    </math>`
    ));
  it('expectationvalue arg three', () =>
    toXmlMatch(
      tex2mml('\\expectationvalue{A}{B}{C}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\expectationvalue{A}{B}{C}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{B}\\right\\vert" data-latex="\\left\\langle{B}\\right\\vert">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{A}">
        <mi data-latex="A">A</mi>
      </mrow>
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{B}\\right\\rangle" data-latex="\\left\\vert{B}\\right\\rangle">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{C}">
        <mi data-latex="C">C</mi>
      </mrow>
    </math>`
    ));
  it('expval arg one', () =>
    toXmlMatch(
      tex2mml('\\expval{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\expval{A}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle {A} \\right\\rangle" data-latex="\\expval{A}">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle " data-latex="\\left\\langle ">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
    </math>`
    ));
  it('expval arg two', () =>
    toXmlMatch(
      tex2mml('\\expval{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\expval{A}{B}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{B}\\right\\vert" data-latex="\\left\\langle{B}\\right\\vert">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{A}">
        <mi data-latex="A">A</mi>
      </mrow>
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{B}\\right\\rangle" data-latex="\\left\\vert{B}\\right\\rangle">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
    </math>`
    ));
  it('expval arg three', () =>
    toXmlMatch(
      tex2mml('\\expval{A}{B}{C}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\expval{A}{B}{C}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{B}\\right\\vert" data-latex="\\left\\langle{B}\\right\\vert">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{A}">
        <mi data-latex="A">A</mi>
      </mrow>
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{B}\\right\\rangle" data-latex="\\left\\vert{B}\\right\\rangle">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{B}">
          <mi data-latex="B">B</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{C}">
        <mi data-latex="C">C</mi>
      </mrow>
    </math>`
    ));
  it('matrixelement arg three', () =>
    toXmlMatch(
      tex2mml('\\matrixelement{A}{B}{C}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixelement{A}{B}{C}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\right\\vert" data-latex="\\left\\langle{A}\\right\\vert">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{B}">
        <mi data-latex="B">B</mi>
      </mrow>
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{C}\\right\\rangle" data-latex="\\left\\vert{C}\\right\\rangle">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{C}">
          <mi data-latex="C">C</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
    </math>`
    ));
  it('matrixelement arg four', () =>
    toXmlMatch(
      tex2mml('\\matrixelement{A}{B}{C}{D}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrixelement{A}{B}{C}{D}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle{A}\\right\\vert" data-latex="\\left\\langle{A}\\right\\vert">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle" data-latex="\\left\\langle">&#x27E8;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{A}">
          <mi data-latex="A">A</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{B}">
        <mi data-latex="B">B</mi>
      </mrow>
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert{C}\\right\\rangle" data-latex="\\left\\vert{C}\\right\\rangle">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert" data-latex="\\left\\vert">|</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{C}">
          <mi data-latex="C">C</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>
      </mrow>
      <mrow data-mjx-texclass="ORD" data-latex="{D}">
        <mi data-latex="D">D</mi>
      </mrow>
    </math>`
    ));
});

describe('Matrix Macros Rest', () => {
  it('zeromatrix', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\zeromatrix{2}{3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\zeromatrix{2}{3}}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left &amp; 0\\\\ 0 &amp; 0 &amp; 0\\end{array}\\right)" data-latex="\\mqty(\\zeromatrix{2}{3})">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
        <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
          </mtr>
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
          </mtr>
        </mtable>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
      </mrow>
    </math>`
    ));
  it('paulimatrix 0', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\paulimatrix{0}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\paulimatrix{0}}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left0\\\\ 0 &amp; 1\\end{array}\\right)" data-latex="\\mqty(\\paulimatrix{0})">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
        <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd>
              <mn data-latex="1">1</mn>
            </mtd>
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
          </mtr>
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
            <mtd>
              <mn data-latex="1">1</mn>
            </mtd>
          </mtr>
        </mtable>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
      </mrow>
    </math>`
    ));
  it('paulimatrix 1', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\paulimatrix{1}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\paulimatrix{1}}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left1\\\\ 1 &amp; 0\\end{array}\\right)" data-latex="\\mqty(\\paulimatrix{1})">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
        <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
            <mtd>
              <mn data-latex="1">1</mn>
            </mtd>
          </mtr>
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd>
              <mn data-latex="1">1</mn>
            </mtd>
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
          </mtr>
        </mtable>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
      </mrow>
    </math>`
    ));
  it('paulimatrix 2', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\paulimatrix{2}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\paulimatrix{2}}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left-i\\\\ i &amp; 0\\end{array}\\right)" data-latex="\\mqty(\\paulimatrix{2})">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
        <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
            <mtd>
              <mo data-latex="-">&#x2212;</mo>
              <mi data-latex="i">i</mi>
            </mtd>
          </mtr>
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd>
              <mi data-latex="i">i</mi>
            </mtd>
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
          </mtr>
        </mtable>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
      </mrow>
    </math>`
    ));
  it('paulimatrix 3', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\paulimatrix{3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\paulimatrix{3}}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left0\\\\ 0 &amp; -1\\end{array}\\right)" data-latex="\\mqty(\\paulimatrix{3})">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
        <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd>
              <mn data-latex="1">1</mn>
            </mtd>
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
          </mtr>
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd>
              <mn data-latex="0">0</mn>
            </mtd>
            <mtd>
              <mo data-latex="-">&#x2212;</mo>
              <mn data-latex="1">1</mn>
            </mtd>
          </mtr>
        </mtable>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
      </mrow>
    </math>`
    ));
  it('paulimatrix 4', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\paulimatrix{4}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\paulimatrix{4}}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\leftarray}\\right)" data-latex="\\mqty(\\paulimatrix{4})">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
        <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}"></mtable>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
      </mrow>
    </math>`
    ));
  it('diagonalmatrix', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\diagonalmatrix{0,1\\\\2&3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\diagonalmatrix{0,1\\\\2&amp;3}}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left{0}\\\\ &amp;\\mqty{1\\\\2&amp;3}\\end{array}\\right)" data-latex="\\mqty(\\diagonalmatrix{0,1\\\\2&amp;3})">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
        <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd>
              <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
                <mtr data-latex-item="{}" data-latex="{}">
                  <mtd>
                    <mn data-latex="0">0</mn>
                  </mtd>
                </mtr>
              </mtable>
            </mtd>
          </mtr>
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd></mtd>
            <mtd>
              <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
                <mtr data-latex-item="{}" data-latex="{}">
                  <mtd>
                    <mn data-latex="1">1</mn>
                  </mtd>
                </mtr>
                <mtr data-latex-item="{}" data-latex="{}">
                  <mtd>
                    <mn data-latex="2">2</mn>
                  </mtd>
                  <mtd>
                    <mn data-latex="3">3</mn>
                  </mtd>
                </mtr>
              </mtable>
            </mtd>
          </mtr>
        </mtable>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
      </mrow>
    </math>`
    ));
  it('antidiagonalmatrix', () =>
    toXmlMatch(
      tex2mml('\\pmqty{\\antidiagonalmatrix{0,1\\\\2&3}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmqty{\\antidiagonalmatrix{0,1\\\\2&amp;3}}" display="block">
      <mrow data-mjx-texclass="INNER" data-latex-item="\\lefty{0}\\\\ \\mqty{1\\\\2&amp;3}\\end{array}\\right)" data-latex="\\mqty(\\antidiagonalmatrix{0,1\\\\2&amp;3})">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
        <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd></mtd>
            <mtd>
              <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
                <mtr data-latex-item="{}" data-latex="{}">
                  <mtd>
                    <mn data-latex="0">0</mn>
                  </mtd>
                </mtr>
              </mtable>
            </mtd>
          </mtr>
          <mtr data-latex-item="{}" data-latex="{}">
            <mtd>
              <mtable columnspacing="1em" rowspacing="4pt" columnalign="" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
                <mtr data-latex-item="{}" data-latex="{}">
                  <mtd>
                    <mn data-latex="1">1</mn>
                  </mtd>
                </mtr>
                <mtr data-latex-item="{}" data-latex="{}">
                  <mtd>
                    <mn data-latex="2">2</mn>
                  </mtd>
                  <mtd>
                    <mn data-latex="3">3</mn>
                  </mtd>
                </mtr>
              </mtable>
            </mtd>
          </mtr>
        </mtable>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
      </mrow>
    </math>`
    ));
});

describe('Rest for Completion', () => {
  it('Issue 2831', () =>
    toXmlMatch(
      tex2mml('\\exp((\\frac{a}{a}a){a})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\exp((\\frac{a}{a}a){a})" display="block">
      <mi>exp</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mrow data-latex=")">
        <mo data-mjx-texclass="OPEN">(</mo>
        <mo data-latex="(" stretchy="false">(</mo>
        <mfrac data-latex="\\frac{a}{a}">
          <mi data-latex="a">a</mi>
          <mi data-latex="a">a</mi>
        </mfrac>
        <mi data-latex="a">a</mi>
        <mo data-latex=")" stretchy="false">)</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{a}">
          <mi data-latex="a">a</mi>
        </mrow>
        <mo data-mjx-texclass="CLOSE">)</mo>
      </mrow>
    </math>`
    ));
  it('Issue 3000', () =>
    toXmlMatch(
      tex2mml('\\sin(1\\over2)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin(1\\over2)" display="block">
      <mi>sin</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mrow data-latex=")">
        <mo data-mjx-texclass="OPEN">(</mo>
        <mfrac data-latex-item="\\over">
          <mn data-latex="1">1</mn>
          <mn data-latex="2">2</mn>
        </mfrac>
        <mo data-mjx-texclass="CLOSE">)</mo>
      </mrow>
    </math>`
    ));
});

afterAll(() => getTokens('physics'));
