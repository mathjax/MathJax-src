import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch, setupTex, tex2mml, getTokens } from '#helpers';

beforeEach(() => setupTex(['base']));

describe('Base', () => {
  it('Identifier', () =>
    toXmlMatch(
      tex2mml('x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x" display="block">
  <mi data-latex="x">x</mi>
</math>`
    ));
  it('Identifier Font', () =>
    toXmlMatch(
      tex2mml('\\mathbf{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbf{x}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{x}">
    <mi mathvariant="bold" data-latex="x">x</mi>
  </mrow>
</math>`
    ));
  it('Two Identifiers', () =>
    toXmlMatch(
      tex2mml('xy'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="xy" display="block">
  <mi data-latex="x">x</mi>
  <mi data-latex="y">y</mi>
</math>`
    ));
  it('Prime', () =>
    toXmlMatch(
      tex2mml("x'"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x\'" display="block">
  <msup data-latex="x\'">
    <mi data-latex="x">x</mi>
    <mo data-mjx-alternate="1" data-latex="\'">&#x2032;</mo>
  </msup>
</math>`
    ));
  it('PrimeSup', () =>
    toXmlMatch(
      tex2mml("x^{'}"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^{\'}" display="block">
  <msup data-latex="x^{\'}">
    <mi data-latex="x">x</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{}">
      <msup>
        <mi></mi>
        <mo data-mjx-alternate="1" data-latex="\'">&#x2032;</mo>
      </msup>
    </mrow>
  </msup>
</math>`
    ));
  it('Double Prime', () =>
    toXmlMatch(
      tex2mml("x''"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x\'\'" display="block">
  <msup data-latex="x\'\'">
    <mi data-latex="x">x</mi>
    <mo data-mjx-alternate="1" data-latex="\'">&#x2033;</mo>
  </msup>
</math>`
    ));
  it('PrePrime', () =>
    toXmlMatch(
      tex2mml("'x"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\'x" display="block">
  <msup>
    <mi></mi>
    <mo data-mjx-alternate="1" data-latex="\'">&#x2032;</mo>
  </msup>
  <mi data-latex="x">x</mi>
</math>`
    ));
  it('Prime with subscript', () =>
    toXmlMatch(
      tex2mml("x^'_{3}"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^\'_{3}" display="block">
  <merror data-mjx-error="Missing open brace for superscript">
    <mtext>Missing open brace for superscript</mtext>
  </merror>
</math>`
    ));
  it('Prime on Sub', () =>
    toXmlMatch(
      tex2mml("x^{'_{a}}"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^{\'_{a}}" display="block">
  <msup data-latex="x^{\'_{a}}">
    <mi data-latex="x">x</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{undefined^\'_{a}}">
      <msubsup data-latex="undefined^\'_{a}">
        <mi></mi>
        <mrow data-mjx-texclass="ORD" data-latex="{a}">
          <mi data-latex="a">a</mi>
        </mrow>
        <mo data-mjx-alternate="1" data-latex="\'">&#x2032;</mo>
      </msubsup>
    </mrow>
  </msup>
</math>`
    ));
  it('Prime on Sup', () =>
    toXmlMatch(
      tex2mml("x^{a^{'}}"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^{a^{\'}}" display="block">
  <msup data-latex="x^{a^{\'}}">
    <mi data-latex="x">x</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{a^{}}">
      <msup data-latex="a^{}">
        <mi data-latex="a">a</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{}">
          <msup>
            <mi></mi>
            <mo data-mjx-alternate="1" data-latex="\'">&#x2032;</mo>
          </msup>
        </mrow>
      </msup>
    </mrow>
  </msup>
</math>`
    ));
  it('Sup on Prime', () =>
    toXmlMatch(
      tex2mml("x^{'^{a}}"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^{\'^{a}}" display="block">
  <msup data-latex="x^{\'^{a}}">
    <mi data-latex="x">x</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{undefined^{}}">
      <msup data-latex="undefined^{}">
        <mi></mi>
        <mrow data-latex="{}">
          <mo data-mjx-alternate="1" data-mjx-pseudoscript="true" data-latex="\'">&#x2032;</mo>
          <mrow data-mjx-texclass="ORD">
            <mi data-latex="a">a</mi>
          </mrow>
        </mrow>
      </msup>
    </mrow>
  </msup>
</math>`
    ));
  it('Prime on Prime', () =>
    toXmlMatch(
      tex2mml("x^{'^{'}}"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^{\'^{\'}}" display="block">
  <msup data-latex="x^{\'^{\'}}">
    <mi data-latex="x">x</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{undefined^{}}">
      <msup data-latex="undefined^{}">
        <mi></mi>
        <mrow data-latex="{}">
          <mo data-mjx-alternate="1" data-mjx-pseudoscript="true" data-latex="\'">&#x2032;</mo>
          <mrow data-mjx-texclass="ORD">
            <msup>
              <mi></mi>
              <mo data-mjx-alternate="1" data-latex="\'">&#x2032;</mo>
            </msup>
          </mrow>
        </mrow>
      </msup>
    </mrow>
  </msup>
</math>`
    ));
  it('Over', () =>
    toXmlMatch(
      tex2mml('1 \\over 2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="1 \\over 2" display="block">
  <mfrac data-latex-item="\\over" data-latex="1 \\over 2">
    <mn data-latex="1">1</mn>
    <mn data-latex="2">2</mn>
  </mfrac>
</math>`
    ));
  it('Above', () =>
    toXmlMatch(
      tex2mml('a \\above 1pt b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\above 1pt b" display="block">
  <mfrac linethickness="1pt" data-latex-item="\\above" data-latex="a \\above 1pt b">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
</math>`
    ));
  it('Style', () =>
    toXmlMatch(
      tex2mml('\\scriptscriptstyle a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\scriptscriptstyle a" display="block">
  <mstyle displaystyle="false" scriptlevel="2" data-latex="\\scriptscriptstyle a">
    <mi data-latex="a">a</mi>
  </mstyle>
</math>`
    ));
  it('Negation Simple', () =>
    toXmlMatch(
      tex2mml('a \\not= b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\not= b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="=">&#x2260;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Negation Complex', () =>
    toXmlMatch(
      tex2mml('a \\not= b \\not\\rightarrow c \\not\\leq d'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\not= b \\not\\rightarrow c \\not\\leq d" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="=">&#x2260;</mo>
  <mi data-latex="b">b</mi>
  <mo data-latex="\\rightarrow">&#x219B;</mo>
  <mi data-latex="c">c</mi>
  <mo data-latex="\\leq">&#x2270;</mo>
  <mi data-latex="d">d</mi>
</math>`
    ));
  it('Negation Explicit', () =>
    toXmlMatch(
      tex2mml(' \\not\\longrightarrow'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex=" \\not\\longrightarrow" display="block">
  <mo data-latex=" \\not\\longrightarrow">&#x27F6;&#x338;</mo>
</math>`
    ));
  it('Negation Large', () =>
    toXmlMatch(
      tex2mml(' \\not3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex=" \\not3" display="block">
  <mrow data-mjx-texclass="REL">
    <mpadded width="0">
      <mtext>&#x29F8;</mtext>
    </mpadded>
  </mrow>
  <mn data-latex="3">3</mn>
</math>`
    ));
  it('Negation Left Paren', () =>
    toXmlMatch(
      tex2mml('\\not\\left(\\right.'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\not\\left(\\right." display="block">
  <mrow data-mjx-texclass="REL">
    <mpadded width="0">
      <mtext>&#x29F8;</mtext>
    </mpadded>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\right." data-latex="\\left(\\right.">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
</math>`
    ));
  it('Greek', () =>
    toXmlMatch(
      tex2mml('\\alpha'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\alpha" display="block">
  <mi data-latex="\\alpha">&#x3B1;</mi>
</math>`
    ));
  it('Large Set', () =>
    toXmlMatch(
      tex2mml('\\bigcup'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bigcup" display="block">
  <mo data-latex="\\bigcup">&#x22C3;</mo>
</math>`
    ));
  it('MathChar0 Operator', () =>
    toXmlMatch(
      tex2mml('\\Rightarrow'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Rightarrow" display="block">
  <mo stretchy="false" data-latex="\\Rightarrow">&#x21D2;</mo>
</math>`
    ));
  it('MathChar7 Single', () =>
    toXmlMatch(
      tex2mml('\\Upsilon'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Upsilon" display="block">
  <mi mathvariant="normal" data-latex="\\Upsilon">&#x3A5;</mi>
</math>`
    ));
  it('MathChar7 Single Font', () =>
    toXmlMatch(
      tex2mml('\\mathbf{\\Upsilon}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbf{\\Upsilon}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{\\Upsilon}">
    <mi mathvariant="bold" data-latex="\\Upsilon">&#x3A5;</mi>
  </mrow>
</math>`
    ));
  it('MathChar7 Operator', () =>
    toXmlMatch(
      tex2mml('\\And'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\And" display="block">
  <mi mathvariant="normal" data-latex="\\And">&amp;</mi>
</math>`
    ));
  it('MathChar7 Multi', () =>
    toXmlMatch(
      tex2mml('\\Lambda \\& \\Gamma \\Rightarrow \\Omega\\And\\Upsilon'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Lambda \\&amp; \\Gamma \\Rightarrow \\Omega\\And\\Upsilon" display="block">
  <mi mathvariant="normal" data-latex="\\Lambda">&#x39B;</mi>
  <mi mathvariant="normal" data-latex="\\&amp;">&amp;</mi>
  <mi mathvariant="normal" data-latex="\\Gamma">&#x393;</mi>
  <mo stretchy="false" data-latex="\\Rightarrow">&#x21D2;</mo>
  <mi mathvariant="normal" data-latex="\\Omega">&#x3A9;</mi>
  <mi mathvariant="normal" data-latex="\\And">&amp;</mi>
  <mi mathvariant="normal" data-latex="\\Upsilon">&#x3A5;</mi>
</math>`
    ));
  it('Tilde', () =>
    toXmlMatch(
      tex2mml('~'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="~" display="block">
  <mtext data-latex="~">&#xA0;</mtext>
</math>`
    ));
  it('Tilde2', () =>
    toXmlMatch(
      tex2mml('a~b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a~b" display="block">
  <mi data-latex="a">a</mi>
  <mtext data-latex="~">&#xA0;</mtext>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Empty base', () =>
    toXmlMatch(
      tex2mml('^2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="^2" display="block">
  <msup data-latex="^2 ">
    <mi></mi>
    <mn data-latex="2">2</mn>
  </msup>
</math>`
    ));
  it('Empty base2', () =>
    toXmlMatch(
      tex2mml('{}^2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{}^2" display="block">
  <msup data-latex="{}^2 ">
    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    <mn data-latex="2">2</mn>
  </msup>
</math>`
    ));
  it('Square', () =>
    toXmlMatch(
      tex2mml('x^2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^2" display="block">
  <msup data-latex="x^2 ">
    <mi data-latex="x">x</mi>
    <mn data-latex="2">2</mn>
  </msup>
</math>`
    ));
  it('Cube', () =>
    toXmlMatch(
      tex2mml('x^3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^3" display="block">
  <msup data-latex="x^3 ">
    <mi data-latex="x">x</mi>
    <mn data-latex="3">3</mn>
  </msup>
</math>`
    ));
  it('Large Operator', () =>
    toXmlMatch(
      tex2mml('\\sum^2_1'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sum^2_1" display="block">
  <munderover data-latex="\\sum^2 _1 ">
    <mo data-latex="\\sum">&#x2211;</mo>
    <mn data-latex="1">1</mn>
    <mn data-latex="2">2</mn>
  </munderover>
</math>`
    ));
  it('Move Superscript', () =>
    toXmlMatch(
      tex2mml('\\left( \\sum_1^n \\right)^{2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left( \\sum_1^n \\right)^{2}" display="block">
  <msup data-latex="\\left( \\sum_1 ^n \\right)^{2}">
    <mrow data-mjx-texclass="INNER" data-latex-item="\\left( \\sum_1 ^n \\right)" data-latex="\\left( \\sum_1 ^n \\right)">
      <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
      <munderover data-latex="\\sum_1^n">
        <mo data-latex="\\sum">&#x2211;</mo>
        <mn data-latex="1">1</mn>
        <mi data-latex="n">n</mi>
      </munderover>
      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
    </mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{2}">
      <mn data-latex="2">2</mn>
    </mrow>
  </msup>
</math>`
    ));
  it('Empty Base Index', () =>
    toXmlMatch(
      tex2mml('_3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="_3" display="block">
  <msub data-latex="_3 ">
    <mi></mi>
    <mn data-latex="3">3</mn>
  </msub>
</math>`
    ));
  it('Empty Base Index2', () =>
    toXmlMatch(
      tex2mml('{}_3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{}_3" display="block">
  <msub data-latex="{}_3 ">
    <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
    <mn data-latex="3">3</mn>
  </msub>
</math>`
    ));
  it('Index', () =>
    toXmlMatch(
      tex2mml('x_3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x_3" display="block">
  <msub data-latex="x_3 ">
    <mi data-latex="x">x</mi>
    <mn data-latex="3">3</mn>
  </msub>
</math>`
    ));
  it('SubSup', () =>
    toXmlMatch(
      tex2mml('x^a_3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^a_3" display="block">
  <msubsup data-latex="x^a_3 ">
    <mi data-latex="x">x</mi>
    <mn data-latex="3">3</mn>
    <mi data-latex="a">a</mi>
  </msubsup>
</math>`
    ));
  it('Positive Spacing', () =>
    toXmlMatch(
      tex2mml('a\\quad b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\quad b" display="block">
  <mi data-latex="a">a</mi>
  <mstyle scriptlevel="0" data-latex="\\quad">
    <mspace width="1em"></mspace>
  </mstyle>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Negative Spacing', () =>
    toXmlMatch(
      tex2mml('a\\!\\!b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\!\\!b" display="block">
  <mi data-latex="a">a</mi>
  <mstyle scriptlevel="0" data-latex="\\!">
    <mspace width="-0.167em"></mspace>
  </mstyle>
  <mstyle scriptlevel="0" data-latex="\\!">
    <mspace width="-0.167em"></mspace>
  </mstyle>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Limit', () =>
    toXmlMatch(
      tex2mml('\\lim'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\lim" display="block">
  <mo data-mjx-texclass="OP" movablelimits="true" data-latex="\\lim">lim</mo>
</math>`
    ));
  it('Frac', () =>
    toXmlMatch(
      tex2mml('\\frac{a}{b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\frac{a}{b}" display="block">
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
</math>`
    ));
  it('Raise', () =>
    toXmlMatch(
      tex2mml('\\raise 1em {x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\raise 1em {x}" display="block">
  <mpadded height="+1em" depth="-1em" voffset="+1em" data-latex="\\raise 1em {x}">
    <mrow data-mjx-texclass="ORD">
      <mi data-latex="x">x</mi>
    </mrow>
  </mpadded>
</math>`
    ));
  it('Lower', () =>
    toXmlMatch(
      tex2mml('\\lower 1em {x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\lower 1em {x}" display="block">
  <mpadded height="-1em" depth="+1em" voffset="-1em" data-latex="\\lower 1em {x}">
    <mrow data-mjx-texclass="ORD">
      <mi data-latex="x">x</mi>
    </mrow>
  </mpadded>
</math>`
    ));
  it('Operator Dots', () =>
    toXmlMatch(
      tex2mml('+\\dots+'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="+\\dots+" display="block">
  <mo data-latex="+">+</mo>
  <mo>&#x22EF;</mo>
  <mo data-latex="+">+</mo>
</math>`
    ));
  it('Operatorname', () =>
    toXmlMatch(
      tex2mml('a\\operatorname{xyz}b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\operatorname{xyz}b" display="block">
  <merror data-mjx-error="Undefined control sequence \\operatorname">
    <mtext>Undefined control sequence \\operatorname</mtext>
  </merror>
</math>`
    ));
  it('Mathop', () =>
    toXmlMatch(
      tex2mml('\\mathop{\\rm a} b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathop{\\rm a} b" display="block">
  <mi data-mjx-texclass="OP" mathvariant="normal" data-latex="\\mathop{\\rm a}">a</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Mathop Super', () =>
    toXmlMatch(
      tex2mml('\\mathop{\\rm a}^b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathop{\\rm a}^b" display="block">
  <mover data-latex="\\mathop{\\rm a}^b">
    <mi data-mjx-texclass="OP" mathvariant="normal" data-latex="\\mathop{\\rm a}">a</mi>
    <mi data-latex="b">b</mi>
  </mover>
</math>`
    ));
  it('Mathop Sub', () =>
    toXmlMatch(
      tex2mml('\\mathop{\\rm a}_b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathop{\\rm a}_b" display="block">
  <munder data-latex="\\mathop{\\rm a}_b">
    <mi data-mjx-texclass="OP" mathvariant="normal" data-latex="\\mathop{\\rm a}">a</mi>
    <mi data-latex="b">b</mi>
  </munder>
</math>`
    ));
  it('Mathop Sub Super', () =>
    toXmlMatch(
      tex2mml('\\mathop{\\rm a}_b^c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathop{\\rm a}_b^c" display="block">
  <munderover data-latex="\\mathop{\\rm a}_b^c">
    <mi data-mjx-texclass="OP" mathvariant="normal" data-latex="\\mathop{\\rm a}">a</mi>
    <mi data-latex="b">b</mi>
    <mi data-latex="c">c</mi>
  </munderover>
</math>`
    ));
  it('Mathop Cal', () =>
    toXmlMatch(
      tex2mml('\\mathop{\\cal a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathop{\\cal a}" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\mathop{\\cal a}">
    <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="\\cal a">a</mi>
  </mrow>
</math>`
    ));
  it('Mathrel', () =>
    toXmlMatch(
      tex2mml('\\mathrel{R}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathrel{R}" display="block">
  <mrow data-mjx-texclass="REL" data-latex="\\mathrel{R}">
    <mi data-latex="R">R</mi>
  </mrow>
</math>`
    ));
  it('Vector', () =>
    toXmlMatch(
      tex2mml('\\vec{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vec{a}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{a}">
    <mover>
      <mi data-latex="a">a</mi>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector Multi', () =>
    toXmlMatch(
      tex2mml('\\vec{\\vec{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vec{\\vec{a}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\vec{a}}">
    <mover>
      <mrow data-mjx-texclass="ORD" data-latex="\\vec{a}">
        <mover>
          <mi data-latex="a">a</mi>
          <mo stretchy="false">&#x2192;</mo>
        </mover>
      </mrow>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Vector Font', () =>
    toXmlMatch(
      tex2mml('\\mathrm{\\vec{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathrm{\\vec{a}}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{\\vec{a}}">
    <mrow data-mjx-texclass="ORD" data-latex="\\vec{a}">
      <mover>
        <mi mathvariant="normal" data-latex="a">a</mi>
        <mo stretchy="false">&#x2192;</mo>
      </mover>
    </mrow>
  </mrow>
</math>`
    ));
  it('Overset', () =>
    toXmlMatch(
      tex2mml('\\overset{a}{b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overset{a}{b}" display="block">
  <mover data-latex="\\overset{a}{b}">
    <mi data-latex="b">b</mi>
    <mi data-latex="a">a</mi>
  </mover>
</math>`
    ));
  it('Underset', () =>
    toXmlMatch(
      tex2mml('\\underset{a}{b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\underset{a}{b}" display="block">
  <munder data-latex="\\underset{a}{b}">
    <mi data-latex="b">b</mi>
    <mi data-latex="a">a</mi>
  </munder>
</math>`
    ));
  it('Overset', () =>
    toXmlMatch(
      tex2mml('\\overunderset{a}{b}{c}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\overunderset{a}{b}{c}\" display=\"block\">
      <munderover data-latex=\"\\overunderset{a}{b}{c}\">
        <mi data-latex=\"c\">c</mi>
        <mi data-latex=\"b\">b</mi>
        <mi data-latex=\"a\">a</mi>
      </munderover>
    </math>`
    ));
  it('Strut', () =>
    toXmlMatch(
      tex2mml('\\strut{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\strut{x}" display="block">
  <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">
    <mrow></mrow>
  </mpadded>
  <mrow data-mjx-texclass="ORD" data-latex="{x}">
    <mi data-latex="x">x</mi>
  </mrow>
</math>`
    ));
  it('Fbox', () =>
    toXmlMatch(
      tex2mml('\\fbox{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fbox{x}" display="block">
  <menclose notation="box" data-latex="\\fbox{x}">
    <mtext>x</mtext>
  </menclose>
</math>`
    ));
  it('Hbox', () =>
    toXmlMatch(
      tex2mml('\\hbox{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\hbox{x}" display="block">
  <mstyle displaystyle="false" scriptlevel="0" data-latex="\\hbox{x}">
    <mtext>x</mtext>
  </mstyle>
</math>`
    ));
  it('Phantom', () =>
    toXmlMatch(
      tex2mml('x\\phantom{y}z'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x\\phantom{y}z" display="block">
  <mi data-latex="x">x</mi>
  <mrow data-mjx-texclass="ORD" data-latex="\\phantom{y}">
    <mphantom>
      <mi data-latex="y">y</mi>
    </mphantom>
  </mrow>
  <mi data-latex="z">z</mi>
</math>`
    ));
  it('Vertical Phantom', () =>
    toXmlMatch(
      tex2mml('x\\vphantom{y}z'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x\\vphantom{y}z" display="block">
  <mi data-latex="x">x</mi>
  <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{y}">
    <mpadded width="0">
      <mphantom>
        <mi data-latex="y">y</mi>
      </mphantom>
    </mpadded>
  </mrow>
  <mi data-latex="z">z</mi>
</math>`
    ));
  it('Horizontal Phantom', () =>
    toXmlMatch(
      tex2mml('x\\hphantom{y}z'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x\\hphantom{y}z" display="block">
  <mi data-latex="x">x</mi>
  <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{y}">
    <mpadded height="0" depth="0">
      <mphantom>
        <mi data-latex="y">y</mi>
      </mphantom>
    </mpadded>
  </mrow>
  <mi data-latex="z">z</mi>
</math>`
    ));
  it('Smash', () =>
    toXmlMatch(
      tex2mml('\\smash{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smash{x}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\smash{x}">
    <mpadded height="0" depth="0">
      <mi data-latex="x">x</mi>
    </mpadded>
  </mrow>
</math>`
    ));
  it('Smash Bottom', () =>
    toXmlMatch(
      tex2mml('\\smash[b]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smash[b]{x}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\smash[b]{x}">
    <mpadded depth="0">
      <mi data-latex="x">x</mi>
    </mpadded>
  </mrow>
</math>`
    ));
  it('Smash Top', () =>
    toXmlMatch(
      tex2mml('\\smash[t]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\smash[t]{x}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{x}">
    <mpadded height="0">
      <mi data-latex="x">x</mi>
    </mpadded>
  </mrow>
</math>`
    ));
  it('Llap', () =>
    toXmlMatch(
      tex2mml('\\llap{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\llap{x}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\llap{x}">
    <mpadded width="0" lspace="-1width">
      <mi data-latex="x">x</mi>
    </mpadded>
  </mrow>
</math>`
    ));
  it('Rlap', () =>
    toXmlMatch(
      tex2mml('\\rlap{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\rlap{x}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\rlap{x}">
    <mpadded width="0">
      <mi data-latex="x">x</mi>
    </mpadded>
  </mrow>
</math>`
    ));
  it('Rlap 2', () =>
    toXmlMatch(
      tex2mml('a\\mathrel{\\rlap{\\,/}{=}}b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\mathrel{\\rlap{\\,/}{=}}b" display="block">
  <mi data-latex="a">a</mi>
  <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\rlap{\\,/}{=}}">
    <mrow data-mjx-texclass="ORD" data-latex="\\rlap{\\,/}">
      <mpadded width="0">
        <mstyle scriptlevel="0" data-latex="\\,">
          <mspace width="0.167em"></mspace>
        </mstyle>
        <mrow data-mjx-texclass="ORD">
          <mo data-latex="/">/</mo>
        </mrow>
      </mpadded>
    </mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{=}">
      <mo data-latex="=">=</mo>
    </mrow>
  </mrow>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Llap 2', () =>
    toXmlMatch(
      tex2mml('a\\mathrel{{=}\\llap{/\\,}}b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\mathrel{{=}\\llap{/\\,}}b" display="block">
  <mi data-latex="a">a</mi>
  <mrow data-mjx-texclass="REL" data-latex="\\mathrel{{=}\\llap{/\\,}}">
    <mrow data-mjx-texclass="ORD" data-latex="{=}">
      <mo data-latex="=">=</mo>
    </mrow>
    <mrow data-mjx-texclass="ORD" data-latex="\\llap{/\\,}">
      <mpadded width="0" lspace="-1width">
        <mrow data-mjx-texclass="ORD">
          <mo data-latex="/">/</mo>
        </mrow>
        <mstyle scriptlevel="0" data-latex="\\,">
          <mspace width="0.167em"></mspace>
        </mstyle>
      </mpadded>
    </mrow>
  </mrow>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Raise In Line', () =>
    toXmlMatch(
      tex2mml('x\\raise{2pt}{y}z'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x\\raise{2pt}{y}z" display="block">
  <mi data-latex="x">x</mi>
  <mpadded height="+2pt" depth="-2pt" voffset="+2pt" data-latex="{}">
    <mrow data-mjx-texclass="ORD">
      <mi data-latex="y">y</mi>
    </mrow>
  </mpadded>
  <mi data-latex="z">z</mi>
</math>`
    ));
  it('Lower 2', () =>
    toXmlMatch(
      tex2mml('x\\lower{2pt}{y}z'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x\\lower{2pt}{y}z" display="block">
  <mi data-latex="x">x</mi>
  <mpadded height="-2pt" depth="+2pt" voffset="-2pt" data-latex="{}">
    <mrow data-mjx-texclass="ORD">
      <mi data-latex="y">y</mi>
    </mrow>
  </mpadded>
  <mi data-latex="z">z</mi>
</math>`
    ));
  it('Raise Negative', () =>
    toXmlMatch(
      tex2mml('x\\raise{-2pt}{y}z'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x\\raise{-2pt}{y}z" display="block">
  <mi data-latex="x">x</mi>
  <mpadded height="-2pt" depth="+2pt" voffset="-2pt" data-latex="{}">
    <mrow data-mjx-texclass="ORD">
      <mi data-latex="y">y</mi>
    </mrow>
  </mpadded>
  <mi data-latex="z">z</mi>
</math>`
    ));
  it('Lower Negative', () =>
    toXmlMatch(
      tex2mml('x\\lower{-2pt}{y}z'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x\\lower{-2pt}{y}z" display="block">
  <mi data-latex="x">x</mi>
  <mpadded height="+2pt" depth="-2pt" voffset="+2pt" data-latex="{}">
    <mrow data-mjx-texclass="ORD">
      <mi data-latex="y">y</mi>
    </mrow>
  </mpadded>
  <mi data-latex="z">z</mi>
</math>`
    ));
  it.skip('Move Left', () => toXmlMatch(tex2mml('x\\moveleft{2pt}{y}z'), ''));
  it.skip('Move Right', () => toXmlMatch(tex2mml('x\\moveright{2pt}{y}z'), ''));
  it.skip('Move Left Negative', () =>
    toXmlMatch(tex2mml('x\\moveleft{-2pt}{y}z'), ''));
  it.skip('Move Right Negative', () =>
    toXmlMatch(tex2mml('x\\moveright{-2pt}{y}z'), ''));
  it('Rule 2D', () =>
    toXmlMatch(
      tex2mml('\\rule{2cm}{1cm}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\rule{2cm}{1cm}" display="block">
  <mspace width="2cm" height="1cm" mathbackground="black" data-latex="\\rule{2cm}{1cm}"></mspace>
</math>`
    ));
  it('Rule 3D', () =>
    toXmlMatch(
      tex2mml('\\Rule{2cm}{2cm}{1cm}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Rule{2cm}{2cm}{1cm}" display="block">
  <mspace width="2cm" height="2cm" depth="1cm" mathbackground="black" data-latex="\\Rule{2cm}{2cm}{1cm}"></mspace>
</math>`
    ));
  it('Space 3D', () =>
    toXmlMatch(
      tex2mml('\\Space{2cm}{2cm}{1cm}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Space{2cm}{2cm}{1cm}" display="block">
  <mspace width="2cm" height="2cm" depth="1cm" data-latex="\\Space{2cm}{2cm}{1cm}"></mspace>
</math>`
    ));
  it('BuildRel', () =>
    toXmlMatch(
      tex2mml('\\buildrel{a}\\over b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\buildrel{a}\\over b" display="block">
  <mrow data-mjx-texclass="REL" data-latex="\\buildrel{a}\\over b">
    <mover>
      <mi data-latex="b">b</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{a}">
        <mi data-latex="a">a</mi>
      </mrow>
    </mover>
  </mrow>
</math>`
    ));
  it('BuildRel Expression', () =>
    toXmlMatch(
      tex2mml('x\\buildrel{a}\\over b y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x\\buildrel{a}\\over b y" display="block">
  <mi data-latex="x">x</mi>
  <mrow data-mjx-texclass="REL" data-latex="\\buildrel{a}\\over b">
    <mover>
      <mi data-latex="b">b</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{a}">
        <mi data-latex="a">a</mi>
      </mrow>
    </mover>
  </mrow>
  <mi data-latex="y">y</mi>
</math>`
    ));
  it('Linebreak', () =>
    toXmlMatch(
      tex2mml('a\\\\b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\\\b" display="block">
  <mi data-latex="a">a</mi>
  <mspace linebreak="newline" data-latex="\\\\"></mspace>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Custom Linebreak', () =>
    toXmlMatch(
      tex2mml('a\\\\[2ex]b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\\\[2ex]b" display="block">
  <mi data-latex="a">a</mi>
  <mspace linebreak="newline" data-lineleading="2ex" data-latex="\\\\[2ex]"></mspace>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Custom Linebreak European', () =>
    toXmlMatch(
      tex2mml('a\\\\[1,5cm]b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\\\[1,5cm]b" display="block">
  <mi data-latex="a">a</mi>
  <mspace linebreak="newline" data-lineleading="1.5cm" data-latex="\\\\[1,5cm]"></mspace>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Cr Linebreak', () =>
    toXmlMatch(
      tex2mml('\\array{a\\cr b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\array{a\\cr b}" display="block">
  <mtable rowspacing="4pt" columnspacing="1em" data-frame-styles="" framespacing=".2em .125em" data-latex="\\array{a\\cr b}">
    <mtr data-latex-item="{" data-latex="{">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{" data-latex="{">
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Array Custom Linebreak', () =>
    toXmlMatch(
      tex2mml('\\array{a\\\\[1cm] b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\array{a\\\\[1cm] b}" display="block">
  <mtable rowspacing="3.235em 0.4em" columnspacing="1em" data-frame-styles="" framespacing=".2em .125em" data-latex="\\array{a\\\\[1cm] b}">
    <mtr data-latex-item="{" data-latex="{">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{" data-latex="{">
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
});

describe('Digits', () => {
  it('Integer', () =>
    toXmlMatch(
      tex2mml('2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="2" display="block">
  <mn data-latex="2">2</mn>
</math>`
    ));
  it('Number', () =>
    toXmlMatch(
      tex2mml('3.14'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="3.14" display="block">
  <mn data-latex="3.14">3.14</mn>
</math>`
    ));
  it('Decimal', () =>
    toXmlMatch(
      tex2mml('.14'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex=".14" display="block">
  <mn data-latex=".14">.14</mn>
</math>`
    ));
  it('Thousands', () =>
    toXmlMatch(
      tex2mml('1{,}000.10'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="1{,}000.10" display="block">
  <mn data-latex="1{,}000.10">1,000.10</mn>
</math>`
    ));
  it('Wrong Thousands', () =>
    toXmlMatch(
      tex2mml('1{,}0000.10'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="1{,}0000.10" display="block">
  <mn data-latex="{,}000">1,000</mn>
  <mn data-latex=".10">0.10</mn>
</math>`
    ));
  it('Decimal Point', () =>
    toXmlMatch(
      tex2mml('.'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="." display="block">
  <mo data-latex=".">.</mo>
</math>`
    ));
  it('Integer Font', () =>
    toXmlMatch(
      tex2mml('\\mathbf{2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbf{2}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{2}">
    <mn mathvariant="bold" data-latex="2">2</mn>
  </mrow>
</math>`
    ));
});

describe('DigitsEuropean', () => {
  beforeEach(() =>
    setupTex(['base'], {
      digits: '^(?:[0-9]+(?:\\{\\.\\}[0-9]{3})*(?:,[0-9]*)?|,[0-9]+)',
    })
  );
  it('Integer European', () =>
    toXmlMatch(
      tex2mml('2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="2" display="block">
  <mn data-latex="2">2</mn>
</math>`
    ));
  it('Number European', () =>
    toXmlMatch(
      tex2mml('3,14'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="3,14" display="block">
  <mn data-latex="3,14">3,14</mn>
</math>`
    ));
  it('Thousands European', () =>
    toXmlMatch(
      tex2mml('1{.}000,10'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="1{.}000,10" display="block">
  <mn data-latex="1{.}000,10">1.000,10</mn>
</math>`
    ));
  it('Wrong Thousands European', () =>
    toXmlMatch(
      tex2mml('1{.}0000,10'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="1{.}0000,10" display="block">
  <mn data-latex="{.}000">1.000</mn>
  <mn data-latex=",10">0,10</mn>
</math>`
    ));
  it('Decimal European', () =>
    toXmlMatch(
      tex2mml(',14'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex=",14" display="block">
  <mn data-latex=",14">,14</mn>
</math>`
    ));
  it('Decimal Point European', () =>
    toXmlMatch(
      tex2mml(','),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="," display="block">
  <mo data-latex=",">,</mo>
</math>`
    ));
});

describe('Roots', () => {
  it('Square Root', () =>
    toXmlMatch(
      tex2mml('\\sqrt{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt{x}" display="block">
  <msqrt data-latex="\\sqrt{x}">
    <mi data-latex="x">x</mi>
  </msqrt>
</math>`
    ));
  it('Square Root Fraction', () =>
    toXmlMatch(
      tex2mml('\\sqrt\\frac{a}{b}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sqrt\\frac{a}{b}\" display=\"block\">
      <msqrt data-latex=\"\\sqrt\\frac{a}{b}\">
        <mfrac data-latex=\"\\frac{a}{b}\">
          <mi data-latex=\"a\">a</mi>
          <mi data-latex=\"b\">b</mi>
        </mfrac>
      </msqrt>
    </math>`
    ));
  it('Nth Root', () =>
    toXmlMatch(
      tex2mml('\\sqrt[n]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt[n]{x}" display="block">
  <mroot data-latex="\\sqrt[n]{x}">
    <mi data-latex="x">x</mi>
    <mi data-latex="n">n</mi>
  </mroot>
</math>`
    ));
  it('Explicit Root', () =>
    toXmlMatch(
      tex2mml('\\root 4 \\of x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\root 4 \\of x" display="block">
  <mroot data-latex="\\root 4 \\of x">
    <mi data-latex="x">x</mi>
    <mn data-latex="4">4</mn>
  </mroot>
</math>`
    ));
  it('Tweaked Root', () =>
    toXmlMatch(
      tex2mml('\\sqrt[\\leftroot{-2}\\uproot{2}\\beta]{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt[\\leftroot{-2}\\uproot{2}\\beta]{k}" display="block">
  <mroot data-latex="\\sqrt[\\leftroot{-2}\\uproot{2}\\beta]{k}">
    <mi data-latex="k">k</mi>
    <mpadded width="-0.13333333333333333em" voffset="+0.13333333333333333em" height="+0.13333333333333333em">
      <mi data-latex="\\leftroot{-2}\\uproot{2}\\beta">&#x3B2;</mi>
    </mpadded>
  </mroot>
</math>`
    ));
});

describe('Error', () => {
  it('Ampersand-error', () =>
    toXmlMatch(
      tex2mml('&'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="&amp;" display="block">
  <merror data-mjx-error="Misplaced &amp;">
    <mtext>Misplaced &amp;</mtext>
  </merror>
</math>`
    ));
  it('Argument-error', () =>
    toXmlMatch(
      tex2mml('\\frac{b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\frac{b}" display="block">
  <merror data-mjx-error="Missing argument for \\frac">
    <mtext>Missing argument for \\frac</mtext>
  </merror>
</math>`
    ));
  it('Undefined-CS', () =>
    toXmlMatch(
      tex2mml('\\nonsense'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\nonsense" display="block">
  <merror data-mjx-error="Undefined control sequence \\nonsense">
    <mtext>Undefined control sequence \\nonsense</mtext>
  </merror>
</math>`
    ));
  it('Undefined-Env', () =>
    toXmlMatch(
      tex2mml('\\begin{nonsense} a \\end{nonsense}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{nonsense} a \\end{nonsense}" display="block">
  <merror data-mjx-error="Unknown environment \'nonsense\'">
    <mtext>Unknown environment \'nonsense\'</mtext>
  </merror>
</math>`
    ));
  it('Double-super-error', () =>
    toXmlMatch(
      tex2mml('x^2^3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^2^3" display="block">
  <merror data-mjx-error="Double exponent: use braces to clarify">
    <mtext>Double exponent: use braces to clarify</mtext>
  </merror>
</math>`
    ));
  it('Double-over-error', () =>
    toXmlMatch(
      tex2mml('\\sum^2^3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sum^2^3" display="block">
  <merror data-mjx-error="Double exponent: use braces to clarify">
    <mtext>Double exponent: use braces to clarify</mtext>
  </merror>
</math>`
    ));
  it('Limits Error', () =>
    toXmlMatch(
      tex2mml('+\\limits^2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="+\\limits^2" display="block">
  <merror data-mjx-error="\\limits is allowed only on operators">
    <mtext>\\limits is allowed only on operators</mtext>
  </merror>
</math>`
    ));
  it('Double sub error', () =>
    toXmlMatch(
      tex2mml('x_2_3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x_2_3" display="block">
  <merror data-mjx-error="Double subscripts: use braces to clarify">
    <mtext>Double subscripts: use braces to clarify</mtext>
  </merror>
</math>`
    ));
  it('Double under error', () =>
    toXmlMatch(
      tex2mml('\\sum_2_3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sum_2_3" display="block">
  <merror data-mjx-error="Double subscripts: use braces to clarify">
    <mtext>Double subscripts: use braces to clarify</mtext>
  </merror>
</math>`
    ));
  it('Brace Superscript Error', () =>
    toXmlMatch(
      tex2mml("x'^'"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x\'^\'" display="block">
  <merror data-mjx-error="Missing open brace for superscript">
    <mtext>Missing open brace for superscript</mtext>
  </merror>
</math>`
    ));
  it('Double Prime Error', () =>
    toXmlMatch(
      tex2mml("x^\\prime'"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^\\prime\'" display="block">
  <merror data-mjx-error="Prime causes double exponent: use braces to clarify">
    <mtext>Prime causes double exponent: use braces to clarify</mtext>
  </merror>
</math>`
    ));
  it('Hash Error', () =>
    toXmlMatch(
      tex2mml('#'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="#" display="block">
  <merror data-mjx-error="You can\'t use \'macro parameter character #\' in math mode">
    <mtext>You can\'t use \'macro parameter character #\' in math mode</mtext>
  </merror>
</math>`
    ));
  it('Missing Right', () =>
    toXmlMatch(
      tex2mml('\\left(\\middle|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left(\\middle|" display="block">
  <merror data-mjx-error="Extra \\left or missing \\right">
    <mtext>Extra \\left or missing \\right</mtext>
  </merror>
</math>`
    ));
  it('Orphan Middle', () =>
    toXmlMatch(
      tex2mml('\\middle|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\middle|" display="block">
  <merror data-mjx-error="Extra \\middle">
    <mtext>Extra \\middle</mtext>
  </merror>
</math>`
    ));
  it('Middle with Right', () =>
    toXmlMatch(
      tex2mml('\\middle|\\right)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\middle|\\right)" display="block">
  <merror data-mjx-error="Extra \\middle">
    <mtext>Extra \\middle</mtext>
  </merror>
</math>`
    ));
  it('Misplaced Move Root', () =>
    toXmlMatch(
      tex2mml('\\uproot{2}\\sqrt[3]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\uproot{2}\\sqrt[3]{a}" display="block">
  <merror data-mjx-error="\\uproot can appear only within a root">
    <mtext>\\uproot can appear only within a root</mtext>
  </merror>
</math>`
    ));
  it('Multiple Move Root', () =>
    toXmlMatch(
      tex2mml('\\sqrt[\\uproot{-2}\\uproot{2}\\beta]{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt[\\uproot{-2}\\uproot{2}\\beta]{k}" display="block">
  <merror data-mjx-error="Multiple use of \\uproot">
    <mtext>Multiple use of \\uproot</mtext>
  </merror>
</math>`
    ));
  it('Incorrect Move Root', () =>
    toXmlMatch(
      tex2mml('\\sqrt[\\uproot-2.5\\beta]{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt[\\uproot-2.5\\beta]{k}" display="block">
  <merror data-mjx-error="The argument to \\uproot must be an integer">
    <mtext>The argument to \\uproot must be an integer</mtext>
  </merror>
</math>`
    ));
  it('Double Over', () =>
    toXmlMatch(
      tex2mml('1 \\over 2 \\over 3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="1 \\over 2 \\over 3" display="block">
  <merror data-mjx-error="Ambiguous use of \\over">
    <mtext>Ambiguous use of \\over</mtext>
  </merror>
</math>`
    ));
  it('Token Illegal Type', () =>
    toXmlMatch(
      tex2mml('\\mmlToken{mk}[]{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mmlToken{mk}[]{}" display="block">
  <merror data-mjx-error="mk is not a token element">
    <mtext>mk is not a token element</mtext>
  </merror>
</math>`
    ));
  it('Token Wrong Type', () =>
    toXmlMatch(
      tex2mml('\\mmlToken{mrow}[]{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mmlToken{mrow}[]{}" display="block">
  <merror data-mjx-error="mrow is not a token element">
    <mtext>mrow is not a token element</mtext>
  </merror>
</math>`
    ));
  it('Token Invalid Attribute', () =>
    toXmlMatch(
      tex2mml('\\mmlToken{mi}[m1=true]{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mmlToken{mi}[m1=true]{}" display="block">
  <merror data-mjx-error="Invalid MathML attribute: m1=true">
    <mtext>Invalid MathML attribute: m1=true</mtext>
  </merror>
</math>`
    ));
  it('Token Unknown Attribute', () =>
    toXmlMatch(
      tex2mml('\\mmlToken{mo}[nothing="something"]{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mmlToken{mo}[nothing=&quot;something&quot;]{}" display="block">
  <merror data-mjx-error="nothing is not a recognized attribute for mo">
    <mtext>nothing is not a recognized attribute for mo</mtext>
  </merror>
</math>`
    ));
  it('Token Wrong Attribute', () =>
    toXmlMatch(
      tex2mml('\\mmlToken{mi}[movablelimit=true]{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mmlToken{mi}[movablelimit=true]{}" display="block">
  <merror data-mjx-error="movablelimit is not a recognized attribute for mi">
    <mtext>movablelimit is not a recognized attribute for mi</mtext>
  </merror>
</math>`
    ));
  it('MissingBeginExtraEnd', () =>
    toXmlMatch(
      tex2mml('\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\end{array}" display="block">
  <merror data-mjx-error="Missing \\begin{array} or extra \\end{array}">
    <mtext>Missing \\begin{array} or extra \\end{array}</mtext>
  </merror>
</math>`
    ));
  it('ExtraCloseMissingOpen', () =>
    toXmlMatch(
      tex2mml('x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x}" display="block">
  <merror data-mjx-error="Extra close brace or missing open brace">
    <mtext>Extra close brace or missing open brace</mtext>
  </merror>
</math>`
    ));
  it('MissingLeftExtraRight', () =>
    toXmlMatch(
      tex2mml('x\\right\\}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x\\right\\}" display="block">
  <merror data-mjx-error="Missing \\left or extra \\right">
    <mtext>Missing \\left or extra \\right</mtext>
  </merror>
</math>`
    ));
  it('ExtraOpenMissingClose', () =>
    toXmlMatch(
      tex2mml('{x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{x" display="block">
  <merror data-mjx-error="Extra open brace or missing close brace">
    <mtext>Extra open brace or missing close brace</mtext>
  </merror>
</math>`
    ));
  it('MissingScript Sub', () =>
    toXmlMatch(
      tex2mml('x_'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x_" display="block">
  <merror data-mjx-error="Missing superscript or subscript argument">
    <mtext>Missing superscript or subscript argument</mtext>
  </merror>
</math>`
    ));
  it('MissingScript Sup', () =>
    toXmlMatch(
      tex2mml('x^'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^" display="block">
  <merror data-mjx-error="Missing superscript or subscript argument">
    <mtext>Missing superscript or subscript argument</mtext>
  </merror>
</math>`
    ));
  it('MissingOpenForSup', () =>
    toXmlMatch(
      tex2mml('x^^'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^^" display="block">
  <merror data-mjx-error="Missing open brace for superscript">
    <mtext>Missing open brace for superscript</mtext>
  </merror>
</math>`
    ));
  it('MissingOpenForSub', () =>
    toXmlMatch(
      tex2mml('x__'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x__" display="block">
  <merror data-mjx-error="Missing open brace for subscript">
    <mtext>Missing open brace for subscript</mtext>
  </merror>
</math>`
    ));
  it('ExtraLeftMissingRight', () =>
    toXmlMatch(
      tex2mml('\\left\\{x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\{x" display="block">
  <merror data-mjx-error="Extra \\left or missing \\right">
    <mtext>Extra \\left or missing \\right</mtext>
  </merror>
</math>`
    ));
  it('Misplaced Cr', () =>
    toXmlMatch(
      tex2mml('a\\cr b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\cr b" display="block">
  <merror data-mjx-error="Misplaced \\cr">
    <mtext>Misplaced \\cr</mtext>
  </merror>
</math>`
    ));
  it('Dimension Error', () =>
    toXmlMatch(
      tex2mml('a\\\\[abc] b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\\\[abc] b" display="block">
  <merror data-mjx-error="Bracket argument to \\\\ must be a dimension">
    <mtext>Bracket argument to \\\\ must be a dimension</mtext>
  </merror>
</math>`
    ));
  it('MissingArgFor', () =>
    toXmlMatch(
      tex2mml('\\sqrt'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt" display="block">
  <merror data-mjx-error="Missing argument for \\sqrt">
    <mtext>Missing argument for \\sqrt</mtext>
  </merror>
</math>`
    ));
  it('ExtraCloseMissingOpen 2', () =>
    toXmlMatch(
      tex2mml('\\sqrt}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt}" display="block">
  <merror data-mjx-error="Extra close brace or missing open brace">
    <mtext>Extra close brace or missing open brace</mtext>
  </merror>
</math>`
    ));
  it('MissingCloseBrace', () =>
    toXmlMatch(
      tex2mml('\\sqrt{'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt{" display="block">
  <merror data-mjx-error="Missing close brace">
    <mtext>Missing close brace</mtext>
  </merror>
</math>`
    ));
  it('ExtraCloseLooking1', () =>
    toXmlMatch(
      tex2mml('\\sqrt[3}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt[3}" display="block">
  <merror data-mjx-error="Extra close brace while looking for \']\'">
    <mtext>Extra close brace while looking for \']\'</mtext>
  </merror>
</math>`
    ));
  it('MissingCloseBracket', () =>
    toXmlMatch(
      tex2mml('\\sqrt[3{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt[3{x}" display="block">
  <merror data-mjx-error="Could not find closing \']\' for argument to \\sqrt">
    <mtext>Could not find closing \']\' for argument to \\sqrt</mtext>
  </merror>
</math>`
    ));
  it('MissingOrUnrecognizedDelim1', () =>
    toXmlMatch(
      tex2mml('\\left\\alpha b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\alpha b" display="block">
  <merror data-mjx-error="Missing or unrecognized delimiter for \\left">
    <mtext>Missing or unrecognized delimiter for \\left</mtext>
  </merror>
</math>`
    ));
  it('MissingOrUnrecognizedDelim2', () =>
    toXmlMatch(
      tex2mml('\\left( b\\right'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left( b\\right" display="block">
  <merror data-mjx-error="Missing or unrecognized delimiter for \\right">
    <mtext>Missing or unrecognized delimiter for \\right</mtext>
  </merror>
</math>`
    ));
  it('MissingDimOrUnits', () =>
    toXmlMatch(
      tex2mml('\\rule{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\rule{}" display="block">
  <merror data-mjx-error="Missing dimension or its units for \\rule">
    <mtext>Missing dimension or its units for \\rule</mtext>
  </merror>
</math>`
    ));
  it('TokenNotFoundForCommand', () =>
    toXmlMatch(
      tex2mml('\\root {3] \\of 5'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\root {3] \\of 5" display="block">
  <merror data-mjx-error="Could not find \\of for \\root">
    <mtext>Could not find \\of for \\root</mtext>
  </merror>
</math>`
    ));
  it('ExtraCloseLooking2', () =>
    toXmlMatch(
      tex2mml('\\root [3} \\of 5 '),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\root [3} \\of 5 " display="block">
  <merror data-mjx-error="Extra close brace while looking for \\of">
    <mtext>Extra close brace while looking for \\of</mtext>
  </merror>
</math>`
    ));
  it('ErroneousNestingEq', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{equation}\\begin{eqnarray}\\end{eqnarray}\\end{equation}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation}\\begin{eqnarray}\\end{eqnarray}\\end{equation}" display="block">
  <merror data-mjx-error="Erroneous nesting of equation structures">
    <mtext>Erroneous nesting of equation structures</mtext>
  </merror>
</math>`
    ));
  it('ExtraAlignTab', () =>
    toXmlMatch(
      tex2mml('\\cases{b & l & k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cases{b &amp; l &amp; k}" display="block">
  <merror data-mjx-error="Extra alignment tab in \\cases text">
    <mtext>Extra alignment tab in \\cases text</mtext>
  </merror>
</math>`
    ));
  it('Misplaced hline', () =>
    toXmlMatch(
      tex2mml('\\hline'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\hline" display="block">
  <merror data-mjx-error="Misplaced \\hline">
    <mtext>Misplaced \\hline</mtext>
  </merror>
</math>`
    ));
  it('UnsupportedHFill', () =>
    toXmlMatch(
      tex2mml('a\\hfill b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\hfill b" display="block">
  <merror data-mjx-error="Unsupported use of \\hfill">
    <mtext>Unsupported use of \\hfill</mtext>
  </merror>
</math>`
    ));
  it('InvalidEnv', () =>
    toXmlMatch(
      tex2mml('\\begin{\\ff}kk\\end{\\ff}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{\\ff}kk\\end{\\ff}" display="block">
  <merror data-mjx-error="Invalid environment name \'\\ff\'">
    <mtext>Invalid environment name \'\\ff\'</mtext>
  </merror>
</math>`
    ));
  it('EnvBadEnd', () =>
    toXmlMatch(
      tex2mml('\\begin{equation}a\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation}a\\end{array}" display="block">
  <merror data-mjx-error="\\begin{equation} ended with \\end{array}">
    <mtext>\\begin{equation} ended with \\end{array}</mtext>
  </merror>
</math>`
    ));
  it('EnvMissingEnd Array', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c}a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c}a" display="block">
  <merror data-mjx-error="Missing \\end{array}">
    <mtext>Missing \\end{array}</mtext>
  </merror>
</math>`
    ));
  it('MissingBoxFor', () =>
    toXmlMatch(
      tex2mml('\\raise{2pt}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\raise{2pt}" display="block">
  <merror data-mjx-error="Missing box for \\raise">
    <mtext>Missing box for \\raise</mtext>
  </merror>
</math>`
    ));
  it('MissingCloseBrace2', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c" display="block">
  <merror data-mjx-error="Missing close brace">
    <mtext>Missing close brace</mtext>
  </merror>
</math>`
    ));
  it('EnvMissingEnd Equation', () =>
    toXmlMatch(
      tex2mml('\\begin{equation}a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation}a" display="block">
  <merror data-mjx-error="Missing \\end{equation}">
    <mtext>Missing \\end{equation}</mtext>
  </merror>
</math>`
    ));
});

describe('Fenced', () => {
  it('Fenced', () =>
    toXmlMatch(
      tex2mml('\\left(\\frac{a}{\\left[bc\\right]}\\right)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left(\\frac{a}{\\left[bc\\right]}\\right)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\frac{a}{\\left[bc\\right]}\\right)" data-latex="\\left(\\frac{a}{\\left[bc\\right]}\\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mfrac data-latex="\\frac{a}{\\left[bc\\right]}">
      <mi data-latex="a">a</mi>
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left[bc\\right]" data-latex="\\left[bc\\right]">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
        <mi data-latex="b">b</mi>
        <mi data-latex="c">c</mi>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
      </mrow>
    </mfrac>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Fenced2', () =>
    toXmlMatch(
      tex2mml('\\{\\frac{a}{\\uparrow bc\\downarrow}\\}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\{\\frac{a}{\\uparrow bc\\downarrow}\\}" display="block">
  <mo fence="false" stretchy="false" data-latex="\\{">{</mo>
  <mfrac data-latex="\\frac{a}{\\uparrow bc\\downarrow}">
    <mi data-latex="a">a</mi>
    <mrow data-latex="\\uparrow bc\\downarrow">
      <mo stretchy="false" data-latex="\\uparrow">&#x2191;</mo>
      <mi data-latex="b">b</mi>
      <mi data-latex="c">c</mi>
      <mo stretchy="false" data-latex="\\downarrow">&#x2193;</mo>
    </mrow>
  </mfrac>
  <mo fence="false" stretchy="false" data-latex="\\}">}</mo>
</math>`
    ));
  it('Fenced3', () =>
    toXmlMatch(
      tex2mml(
        '\\left\\{\\left\\vert \\left[ \\left\\| A \\right.\\right| \\right]\\right\\}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\{\\left\\vert \\left[ \\left\\| A \\right.\\right| \\right]\\right\\}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{\\left\\vert \\left[ \\left\\| A \\right.\\right| \\right]\\right\\}" data-latex="\\left\\{\\left\\vert \\left[ \\left\\| A \\right.\\right| \\right]\\right\\}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>
    <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert \\left[ \\left\\| A \\right.\\right| \\right]" data-latex="\\left\\vert \\left[ \\left\\| A \\right.\\right| \\right]">
      <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert " data-latex="\\left\\vert ">|</mo>
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left[ \\left\\| A \\right.\\right|" data-latex="\\left[ \\left\\| A \\right.\\right|">
        <mo data-mjx-texclass="OPEN" data-latex-item="\\left[" data-latex="\\left[">[</mo>
        <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\| A \\right." data-latex="\\left\\| A \\right.">
          <mo data-mjx-texclass="OPEN" symmetric="true" data-latex-item="\\left\\|" data-latex="\\left\\|">&#x2016;</mo>
          <mi data-latex="A">A</mi>
          <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
        </mrow>
        <mo data-mjx-texclass="CLOSE" data-latex-item="\\right|" data-latex="\\right|">|</mo>
      </mrow>
      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right]" data-latex="\\right]">]</mo>
    </mrow>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>
  </mrow>
</math>`
    ));
  it('Middle', () =>
    toXmlMatch(
      tex2mml('\\left(a\\middle|b\\right)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left(a\\middle|b\\right)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(a\\middle|b\\right)" data-latex="\\left(a\\middle|b\\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mi data-latex="a">a</mi>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle|" data-latex="\\middle|">|</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle|"></mrow>
    <mi data-latex="b">b</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Fenced Nostretch 1', () =>
    toXmlMatch(
      tex2mml('(\\frac{a}{[bc]})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="(\\frac{a}{[bc]})" display="block">
  <mo data-latex="(" stretchy="false">(</mo>
  <mfrac data-latex="\\frac{a}{[bc]}">
    <mi data-latex="a">a</mi>
    <mrow data-latex="[bc]">
      <mo data-latex="[" stretchy="false">[</mo>
      <mi data-latex="b">b</mi>
      <mi data-latex="c">c</mi>
      <mo data-latex="]" stretchy="false">]</mo>
    </mrow>
  </mfrac>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Fenced Noleft', () =>
    toXmlMatch(
      tex2mml('\\left. ab \\right)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left. ab \\right)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left. ab \\right)" data-latex="\\left. ab \\right)">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left." data-latex="\\left."></mo>
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Fenced Noright', () =>
    toXmlMatch(
      tex2mml('\\left( ab \\right.'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left( ab \\right." display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left( ab \\right." data-latex="\\left( ab \\right.">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right." data-latex="\\right."></mo>
  </mrow>
</math>`
    ));
  it('Fenced Arrows 5', () =>
    toXmlMatch(
      tex2mml(
        '\\left\\{\\frac{a}{\\left\\uparrow bc\\right\\downarrow}\\right\\}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\{\\frac{a}{\\left\\uparrow bc\\right\\downarrow}\\right\\}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\{\\frac{a}{\\left\\uparrow bc\\right\\downarrow}\\right\\}" data-latex="\\left\\{\\frac{a}{\\left\\uparrow bc\\right\\downarrow}\\right\\}">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\{" data-latex="\\left\\{">{</mo>
    <mfrac data-latex="\\frac{a}{\\left\\uparrow bc\\right\\downarrow}">
      <mi data-latex="a">a</mi>
      <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\uparrow bc\\right\\downarrow" data-latex="\\left\\uparrow bc\\right\\downarrow">
        <mo data-mjx-texclass="OPEN" fence="true" symmetric="true" data-latex-item="\\left\\uparrow " data-latex="\\left\\uparrow ">&#x2191;</mo>
        <mi data-latex="b">b</mi>
        <mi data-latex="c">c</mi>
        <mo data-mjx-texclass="CLOSE" fence="true" symmetric="true" data-latex-item="\\right\\downarrow" data-latex="\\right\\downarrow">&#x2193;</mo>
      </mrow>
    </mfrac>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\}" data-latex="\\right\\}">}</mo>
  </mrow>
</math>`
    ));
  it('Fenced Arrows 1', () =>
    toXmlMatch(
      tex2mml('\\left\\uparrow \\frac{a}{b} \\right\\downarrow'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\uparrow \\frac{a}{b} \\right\\downarrow" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\uparrow \\frac{a}{b} \\right\\downarrow" data-latex="\\left\\uparrow \\frac{a}{b} \\right\\downarrow">
    <mo data-mjx-texclass="OPEN" fence="true" symmetric="true" data-latex-item="\\left\\uparrow " data-latex="\\left\\uparrow ">&#x2191;</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mo data-mjx-texclass="CLOSE" fence="true" symmetric="true" data-latex-item="\\right\\downarrow" data-latex="\\right\\downarrow">&#x2193;</mo>
  </mrow>
</math>`
    ));
  it('Fenced Arrows 2', () =>
    toXmlMatch(
      tex2mml('\\uparrow \\frac{a}{b} \\downarrow'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\uparrow \\frac{a}{b} \\downarrow" display="block">
  <mo stretchy="false" data-latex="\\uparrow">&#x2191;</mo>
  <mfrac data-latex="\\frac{a}{b}">
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </mfrac>
  <mo stretchy="false" data-latex="\\downarrow">&#x2193;</mo>
</math>`
    ));
  it('Fenced Arrows 3', () =>
    toXmlMatch(
      tex2mml(
        '\\left\\uparrow \\frac{a}{b}\\middle\\downarrow c \\right\\uparrow'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\uparrow \\frac{a}{b}\\middle\\downarrow c \\right\\uparrow" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\uparrow \\frac{a}{b}\\middle\\downarrow c \\right\\uparrow" data-latex="\\left\\uparrow \\frac{a}{b}\\middle\\downarrow c \\right\\uparrow">
    <mo data-mjx-texclass="OPEN" fence="true" symmetric="true" data-latex-item="\\left\\uparrow " data-latex="\\left\\uparrow ">&#x2191;</mo>
    <mfrac data-latex="\\frac{a}{b}">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mrow data-mjx-texclass="CLOSE"></mrow>
    <mo data-latex-item="\\middle\\downarrow " data-latex="\\middle\\downarrow ">&#x2193;</mo>
    <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\downarrow"></mrow>
    <mi data-latex="c">c</mi>
    <mo data-mjx-texclass="CLOSE" fence="true" symmetric="true" data-latex-item="\\right\\uparrow" data-latex="\\right\\uparrow">&#x2191;</mo>
  </mrow>
</math>`
    ));
});

describe('Mathchoice', () => {
  it('Modulo', () =>
    toXmlMatch(
      tex2mml('a\\mod b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\mod b" display="block">
  <mi data-latex="a">a</mi>
  <mspace width="1em" linebreak="nobreak" data-latex="\\kern18mu"></mspace>
  <mi data-latex="\\mmlToken{mi}{mod}">mod</mi>
  <mstyle scriptlevel="0" data-latex="\\,">
    <mspace width="0.167em"></mspace>
  </mstyle>
  <mstyle scriptlevel="0" data-latex="\\,">
    <mspace width="0.167em"></mspace>
  </mstyle>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Modulo Sub0', () =>
    toXmlMatch(
      tex2mml('X_{a\\mod b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{a\\mod b}" display="block">
  <msub data-latex="\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}">
      <mi data-latex="a">a</mi>
      <mspace width="0.667em" linebreak="nobreak" data-latex="\\kern12mu"></mspace>
      <mi data-latex="\\mmlToken{mi}{mod}">mod</mi>
      <mstyle scriptlevel="0" data-latex="\\,">
        <mspace width="0.167em"></mspace>
      </mstyle>
      <mstyle scriptlevel="0" data-latex="\\,">
        <mspace width="0.167em"></mspace>
      </mstyle>
      <mi data-latex="b">b</mi>
    </mrow>
  </msub>
</math>`
    ));
  it('Modulo Sub1', () =>
    toXmlMatch(
      tex2mml('X_{1_{a\\mod b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1_{a\\mod b}}" display="block">
  <msub data-latex="\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{1_{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}}">
      <msub data-latex="1_{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}">
        <mn data-latex="1">1</mn>
        <mrow data-mjx-texclass="ORD" data-latex="{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}">
          <mi data-latex="a">a</mi>
          <mspace width="0.667em" linebreak="nobreak" data-latex="\\kern12mu"></mspace>
          <mi data-latex="\\mmlToken{mi}{mod}">mod</mi>
          <mstyle scriptlevel="0" data-latex="\\,">
            <mspace width="0.167em"></mspace>
          </mstyle>
          <mstyle scriptlevel="0" data-latex="\\,">
            <mspace width="0.167em"></mspace>
          </mstyle>
          <mi data-latex="b">b</mi>
        </mrow>
      </msub>
    </mrow>
  </msub>
</math>`
    ));
  it('Modulo Sub2', () =>
    toXmlMatch(
      tex2mml('X_{1_{2_{a\\mod b}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1_{2_{a\\mod b}}}" display="block">
  <msub data-latex="\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{1_{2_{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}}}">
      <msub data-latex="1_{2_{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}}">
        <mn data-latex="1">1</mn>
        <mrow data-mjx-texclass="ORD" data-latex="{2_{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}}">
          <msub data-latex="2_{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}">
            <mn data-latex="2">2</mn>
            <mrow data-mjx-texclass="ORD" data-latex="{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}">
              <mi data-latex="a">a</mi>
              <mspace width="0.667em" linebreak="nobreak" data-latex="\\kern12mu"></mspace>
              <mi data-latex="\\mmlToken{mi}{mod}">mod</mi>
              <mstyle scriptlevel="0" data-latex="\\,">
                <mspace width="0.167em"></mspace>
              </mstyle>
              <mstyle scriptlevel="0" data-latex="\\,">
                <mspace width="0.167em"></mspace>
              </mstyle>
              <mi data-latex="b">b</mi>
            </mrow>
          </msub>
        </mrow>
      </msub>
    </mrow>
  </msub>
</math>`
    ));
  it('Modulo Sub3', () =>
    toXmlMatch(
      tex2mml('X_{1_{2_{3_{a\\mod b}}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1_{2_{3_{a\\mod b}}}}" display="block">
  <msub data-latex="\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}}}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{1_{2_{3_{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}}}}">
      <msub data-latex="1_{2_{3_{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}}}">
        <mn data-latex="1">1</mn>
        <mrow data-mjx-texclass="ORD" data-latex="{2_{3_{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}}}">
          <msub data-latex="2_{3_{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}}">
            <mn data-latex="2">2</mn>
            <mrow data-mjx-texclass="ORD" data-latex="{3_{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}}">
              <msub data-latex="3_{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}">
                <mn data-latex="3">3</mn>
                <mrow data-mjx-texclass="ORD" data-latex="{a\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,b}">
                  <mi data-latex="a">a</mi>
                  <mspace width="0.667em" linebreak="nobreak" data-latex="\\kern12mu"></mspace>
                  <mi data-latex="\\mmlToken{mi}{mod}">mod</mi>
                  <mstyle scriptlevel="0" data-latex="\\,">
                    <mspace width="0.167em"></mspace>
                  </mstyle>
                  <mstyle scriptlevel="0" data-latex="\\,">
                    <mspace width="0.167em"></mspace>
                  </mstyle>
                  <mi data-latex="b">b</mi>
                </mrow>
              </msub>
            </mrow>
          </msub>
        </mrow>
      </msub>
    </mrow>
  </msub>
</math>`
    ));
  it('Choose', () =>
    toXmlMatch(
      tex2mml('n \\choose k'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="n \\choose k" display="block">
  <mrow data-mjx-texclass="ORD" data-latex-item="\\choose" data-latex="n \\choose k">
    <mrow data-mjx-texclass="OPEN" data-latex="\\biggl (">
      <mo minsize="2.047em" maxsize="2.047em">(</mo>
    </mrow>
    <mfrac linethickness="0">
      <mi data-latex="n">n</mi>
      <mi data-latex="k">k</mi>
    </mfrac>
    <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr )">
      <mo minsize="2.047em" maxsize="2.047em">)</mo>
    </mrow>
  </mrow>
</math>`
    ));
  it('Choose Sub0', () =>
    toXmlMatch(
      tex2mml('X_{n \\choose k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{n \\choose k}" display="block">
  <msub data-latex="X_{n \\choose k}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{}">
      <mrow data-mjx-texclass="ORD" data-latex-item="\\choose">
        <mrow data-mjx-texclass="OPEN" data-latex="\\bigl (">
          <mo minsize="1.2em" maxsize="1.2em">(</mo>
        </mrow>
        <mfrac linethickness="0">
          <mi data-latex="n">n</mi>
          <mi data-latex="k">k</mi>
        </mfrac>
        <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr )">
          <mo minsize="1.2em" maxsize="1.2em">)</mo>
        </mrow>
      </mrow>
    </mrow>
  </msub>
</math>`
    ));
  it('Choose Sub1', () =>
    toXmlMatch(
      tex2mml('X_{1_{n \\choose k}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1_{n \\choose k}}" display="block">
  <msub data-latex="X_{1_{n \\choose k}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{1_{}}">
      <msub data-latex="1_{}">
        <mn data-latex="1">1</mn>
        <mrow data-mjx-texclass="ORD" data-latex="{}">
          <mrow data-mjx-texclass="ORD" data-latex-item="\\choose">
            <mrow data-mjx-texclass="OPEN" data-latex="\\bigl (">
              <mo minsize="1.2em" maxsize="1.2em">(</mo>
            </mrow>
            <mfrac linethickness="0">
              <mi data-latex="n">n</mi>
              <mi data-latex="k">k</mi>
            </mfrac>
            <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr )">
              <mo minsize="1.2em" maxsize="1.2em">)</mo>
            </mrow>
          </mrow>
        </mrow>
      </msub>
    </mrow>
  </msub>
</math>`
    ));
  it('Choose Sub2', () =>
    toXmlMatch(
      tex2mml('X_{1_{2_{n \\choose k}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1_{2_{n \\choose k}}}" display="block">
  <msub data-latex="X_{1_{2_{n \\choose k}}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{1_{2_{}}}">
      <msub data-latex="1_{2_{}}">
        <mn data-latex="1">1</mn>
        <mrow data-mjx-texclass="ORD" data-latex="{2_{}}">
          <msub data-latex="2_{}">
            <mn data-latex="2">2</mn>
            <mrow data-mjx-texclass="ORD" data-latex="{}">
              <mrow data-mjx-texclass="ORD" data-latex-item="\\choose">
                <mrow data-mjx-texclass="OPEN" data-latex="\\bigl (">
                  <mo minsize="1.2em" maxsize="1.2em">(</mo>
                </mrow>
                <mfrac linethickness="0">
                  <mi data-latex="n">n</mi>
                  <mi data-latex="k">k</mi>
                </mfrac>
                <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr )">
                  <mo minsize="1.2em" maxsize="1.2em">)</mo>
                </mrow>
              </mrow>
            </mrow>
          </msub>
        </mrow>
      </msub>
    </mrow>
  </msub>
</math>`
    ));
  it('Choose Sub3', () =>
    toXmlMatch(
      tex2mml('X_{1_{2_{3_{n \\choose k}}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1_{2_{3_{n \\choose k}}}}" display="block">
  <msub data-latex="X_{1_{2_{3_{n \\choose k}}}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{1_{2_{3_{}}}}">
      <msub data-latex="1_{2_{3_{}}}">
        <mn data-latex="1">1</mn>
        <mrow data-mjx-texclass="ORD" data-latex="{2_{3_{}}}">
          <msub data-latex="2_{3_{}}">
            <mn data-latex="2">2</mn>
            <mrow data-mjx-texclass="ORD" data-latex="{3_{}}">
              <msub data-latex="3_{}">
                <mn data-latex="3">3</mn>
                <mrow data-mjx-texclass="ORD" data-latex="{}">
                  <mrow data-mjx-texclass="ORD" data-latex-item="\\choose">
                    <mrow data-mjx-texclass="OPEN" data-latex="\\bigl (">
                      <mo minsize="1.2em" maxsize="1.2em">(</mo>
                    </mrow>
                    <mfrac linethickness="0">
                      <mi data-latex="n">n</mi>
                      <mi data-latex="k">k</mi>
                    </mfrac>
                    <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr )">
                      <mo minsize="1.2em" maxsize="1.2em">)</mo>
                    </mrow>
                  </mrow>
                </mrow>
              </msub>
            </mrow>
          </msub>
        </mrow>
      </msub>
    </mrow>
  </msub>
</math>`
    ));
  it('Over With Delims', () =>
    toXmlMatch(
      tex2mml('1 \\overwithdelims [ ] 2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="1 \\overwithdelims [ ] 2" display="block">
  <mrow data-mjx-texclass="ORD" data-latex-item="\\overwithdelims" data-latex="1 \\overwithdelims [ ] 2">
    <mrow data-mjx-texclass="OPEN" data-latex="\\biggl [">
      <mo minsize="2.047em" maxsize="2.047em">[</mo>
    </mrow>
    <mfrac>
      <mn data-latex="1">1</mn>
      <mn data-latex="2">2</mn>
    </mfrac>
    <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr ]">
      <mo minsize="2.047em" maxsize="2.047em">]</mo>
    </mrow>
  </mrow>
</math>`
    ));
  it('Over With Delims Sub0', () =>
    toXmlMatch(
      tex2mml('X_{1 \\overwithdelims [ ] 2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1 \\overwithdelims [ ] 2}" display="block">
  <msub data-latex="X_{1 \\overwithdelims [ ] 2}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{}">
      <mrow data-mjx-texclass="ORD" data-latex-item="\\overwithdelims">
        <mrow data-mjx-texclass="OPEN" data-latex="\\bigl [">
          <mo minsize="1.2em" maxsize="1.2em">[</mo>
        </mrow>
        <mfrac>
          <mn data-latex="1">1</mn>
          <mn data-latex="2">2</mn>
        </mfrac>
        <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr ]">
          <mo minsize="1.2em" maxsize="1.2em">]</mo>
        </mrow>
      </mrow>
    </mrow>
  </msub>
</math>`
    ));
  it('Over With Delims Sub1', () =>
    toXmlMatch(
      tex2mml('X_{1_{1 \\overwithdelims [ ] 2}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1_{1 \\overwithdelims [ ] 2}}" display="block">
  <msub data-latex="X_{1_{1 \\overwithdelims [ ] 2}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{1_{}}">
      <msub data-latex="1_{}">
        <mn data-latex="1">1</mn>
        <mrow data-mjx-texclass="ORD" data-latex="{}">
          <mrow data-mjx-texclass="ORD" data-latex-item="\\overwithdelims">
            <mrow data-mjx-texclass="OPEN" data-latex="\\bigl [">
              <mo minsize="1.2em" maxsize="1.2em">[</mo>
            </mrow>
            <mfrac>
              <mn data-latex="1">1</mn>
              <mn data-latex="2">2</mn>
            </mfrac>
            <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr ]">
              <mo minsize="1.2em" maxsize="1.2em">]</mo>
            </mrow>
          </mrow>
        </mrow>
      </msub>
    </mrow>
  </msub>
</math>`
    ));
  it('Over With Delims Sub2', () =>
    toXmlMatch(
      tex2mml('X_{1_{2_{1 \\overwithdelims [ ] 2}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1_{2_{1 \\overwithdelims [ ] 2}}}" display="block">
  <msub data-latex="X_{1_{2_{1 \\overwithdelims [ ] 2}}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{1_{2_{}}}">
      <msub data-latex="1_{2_{}}">
        <mn data-latex="1">1</mn>
        <mrow data-mjx-texclass="ORD" data-latex="{2_{}}">
          <msub data-latex="2_{}">
            <mn data-latex="2">2</mn>
            <mrow data-mjx-texclass="ORD" data-latex="{}">
              <mrow data-mjx-texclass="ORD" data-latex-item="\\overwithdelims">
                <mrow data-mjx-texclass="OPEN" data-latex="\\bigl [">
                  <mo minsize="1.2em" maxsize="1.2em">[</mo>
                </mrow>
                <mfrac>
                  <mn data-latex="1">1</mn>
                  <mn data-latex="2">2</mn>
                </mfrac>
                <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr ]">
                  <mo minsize="1.2em" maxsize="1.2em">]</mo>
                </mrow>
              </mrow>
            </mrow>
          </msub>
        </mrow>
      </msub>
    </mrow>
  </msub>
</math>`
    ));
  it('Over With Delims Sub3', () =>
    toXmlMatch(
      tex2mml('X_{1_{2_{3_{1 \\overwithdelims [ ] 2}}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1_{2_{3_{1 \\overwithdelims [ ] 2}}}}" display="block">
  <msub data-latex="X_{1_{2_{3_{1 \\overwithdelims [ ] 2}}}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{1_{2_{3_{}}}}">
      <msub data-latex="1_{2_{3_{}}}">
        <mn data-latex="1">1</mn>
        <mrow data-mjx-texclass="ORD" data-latex="{2_{3_{}}}">
          <msub data-latex="2_{3_{}}">
            <mn data-latex="2">2</mn>
            <mrow data-mjx-texclass="ORD" data-latex="{3_{}}">
              <msub data-latex="3_{}">
                <mn data-latex="3">3</mn>
                <mrow data-mjx-texclass="ORD" data-latex="{}">
                  <mrow data-mjx-texclass="ORD" data-latex-item="\\overwithdelims">
                    <mrow data-mjx-texclass="OPEN" data-latex="\\bigl [">
                      <mo minsize="1.2em" maxsize="1.2em">[</mo>
                    </mrow>
                    <mfrac>
                      <mn data-latex="1">1</mn>
                      <mn data-latex="2">2</mn>
                    </mfrac>
                    <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr ]">
                      <mo minsize="1.2em" maxsize="1.2em">]</mo>
                    </mrow>
                  </mrow>
                </mrow>
              </msub>
            </mrow>
          </msub>
        </mrow>
      </msub>
    </mrow>
  </msub>
</math>`
    ));
  it('Above With Delims', () =>
    toXmlMatch(
      tex2mml('a \\abovewithdelims [ ] 1pt b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\abovewithdelims [ ] 1pt b" display="block">
  <mrow data-mjx-texclass="ORD" data-latex-item="\\abovewithdelims" data-latex="a \\abovewithdelims [ ] 1pt b">
    <mrow data-mjx-texclass="OPEN" data-latex="\\biggl [">
      <mo minsize="2.047em" maxsize="2.047em">[</mo>
    </mrow>
    <mfrac linethickness="1pt">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
    </mfrac>
    <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr ]">
      <mo minsize="2.047em" maxsize="2.047em">]</mo>
    </mrow>
  </mrow>
</math>`
    ));
  it('Above With Delims Sub0', () =>
    toXmlMatch(
      tex2mml('X_{a \\abovewithdelims [ ] 1pt b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{a \\abovewithdelims [ ] 1pt b}" display="block">
  <msub data-latex="X_{a \\abovewithdelims [ ] 1pt b}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{}">
      <mrow data-mjx-texclass="ORD" data-latex-item="\\abovewithdelims">
        <mrow data-mjx-texclass="OPEN" data-latex="\\bigl [">
          <mo minsize="1.2em" maxsize="1.2em">[</mo>
        </mrow>
        <mfrac linethickness="1pt">
          <mi data-latex="a">a</mi>
          <mi data-latex="b">b</mi>
        </mfrac>
        <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr ]">
          <mo minsize="1.2em" maxsize="1.2em">]</mo>
        </mrow>
      </mrow>
    </mrow>
  </msub>
</math>`
    ));
  it('Above With Delims Sub1', () =>
    toXmlMatch(
      tex2mml('X_{1_{a \\abovewithdelims [ ] 1pt b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1_{a \\abovewithdelims [ ] 1pt b}}" display="block">
  <msub data-latex="X_{1_{a \\abovewithdelims [ ] 1pt b}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{1_{}}">
      <msub data-latex="1_{}">
        <mn data-latex="1">1</mn>
        <mrow data-mjx-texclass="ORD" data-latex="{}">
          <mrow data-mjx-texclass="ORD" data-latex-item="\\abovewithdelims">
            <mrow data-mjx-texclass="OPEN" data-latex="\\bigl [">
              <mo minsize="1.2em" maxsize="1.2em">[</mo>
            </mrow>
            <mfrac linethickness="1pt">
              <mi data-latex="a">a</mi>
              <mi data-latex="b">b</mi>
            </mfrac>
            <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr ]">
              <mo minsize="1.2em" maxsize="1.2em">]</mo>
            </mrow>
          </mrow>
        </mrow>
      </msub>
    </mrow>
  </msub>
</math>`
    ));
  it('Above With Delims Sub2', () =>
    toXmlMatch(
      tex2mml('X_{1_{2_{a \\abovewithdelims [ ] 1pt b}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1_{2_{a \\abovewithdelims [ ] 1pt b}}}" display="block">
  <msub data-latex="X_{1_{2_{a \\abovewithdelims [ ] 1pt b}}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{1_{2_{}}}">
      <msub data-latex="1_{2_{}}">
        <mn data-latex="1">1</mn>
        <mrow data-mjx-texclass="ORD" data-latex="{2_{}}">
          <msub data-latex="2_{}">
            <mn data-latex="2">2</mn>
            <mrow data-mjx-texclass="ORD" data-latex="{}">
              <mrow data-mjx-texclass="ORD" data-latex-item="\\abovewithdelims">
                <mrow data-mjx-texclass="OPEN" data-latex="\\bigl [">
                  <mo minsize="1.2em" maxsize="1.2em">[</mo>
                </mrow>
                <mfrac linethickness="1pt">
                  <mi data-latex="a">a</mi>
                  <mi data-latex="b">b</mi>
                </mfrac>
                <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr ]">
                  <mo minsize="1.2em" maxsize="1.2em">]</mo>
                </mrow>
              </mrow>
            </mrow>
          </msub>
        </mrow>
      </msub>
    </mrow>
  </msub>
</math>`
    ));
  it('Above With Delims Sub3', () =>
    toXmlMatch(
      tex2mml('X_{1_{2_{3_{a \\abovewithdelims [ ] 1pt b}}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{1_{2_{3_{a \\abovewithdelims [ ] 1pt b}}}}" display="block">
  <msub data-latex="X_{1_{2_{3_{a \\abovewithdelims [ ] 1pt b}}}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{1_{2_{3_{}}}}">
      <msub data-latex="1_{2_{3_{}}}">
        <mn data-latex="1">1</mn>
        <mrow data-mjx-texclass="ORD" data-latex="{2_{3_{}}}">
          <msub data-latex="2_{3_{}}">
            <mn data-latex="2">2</mn>
            <mrow data-mjx-texclass="ORD" data-latex="{3_{}}">
              <msub data-latex="3_{}">
                <mn data-latex="3">3</mn>
                <mrow data-mjx-texclass="ORD" data-latex="{}">
                  <mrow data-mjx-texclass="ORD" data-latex-item="\\abovewithdelims">
                    <mrow data-mjx-texclass="OPEN" data-latex="\\bigl [">
                      <mo minsize="1.2em" maxsize="1.2em">[</mo>
                    </mrow>
                    <mfrac linethickness="1pt">
                      <mi data-latex="a">a</mi>
                      <mi data-latex="b">b</mi>
                    </mfrac>
                    <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr ]">
                      <mo minsize="1.2em" maxsize="1.2em">]</mo>
                    </mrow>
                  </mrow>
                </mrow>
              </msub>
            </mrow>
          </msub>
        </mrow>
      </msub>
    </mrow>
  </msub>
</math>`
    ));
  it('Probability', () =>
    toXmlMatch(
      tex2mml('P(E) = {n \\choose k} p^k (1-p)^{ n-k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="P(E) = {n \\choose k} p^k (1-p)^{ n-k}" display="block">
  <mi data-latex="P">P</mi>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="E">E</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mo data-latex="=">=</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{}">
    <mrow data-mjx-texclass="ORD" data-latex-item="\\choose">
      <mrow data-mjx-texclass="OPEN" data-latex="\\biggl (">
        <mo minsize="2.047em" maxsize="2.047em">(</mo>
      </mrow>
      <mfrac linethickness="0">
        <mi data-latex="n">n</mi>
        <mi data-latex="k">k</mi>
      </mfrac>
      <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr )">
        <mo minsize="2.047em" maxsize="2.047em">)</mo>
      </mrow>
    </mrow>
  </mrow>
  <msup data-latex="p^k">
    <mi data-latex="p">p</mi>
    <mi data-latex="k">k</mi>
  </msup>
  <mo data-latex="(" stretchy="false">(</mo>
  <mn data-latex="1">1</mn>
  <mo data-latex="-">&#x2212;</mo>
  <mi data-latex="p">p</mi>
  <msup data-latex=")^{n-k}">
    <mo data-latex=")" stretchy="false">)</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{n-k}">
      <mi data-latex="n">n</mi>
      <mo data-latex="-">&#x2212;</mo>
      <mi data-latex="k">k</mi>
    </mrow>
  </msup>
</math>`
    ));
});

describe('Matrix', () => {
  it('Matrix Error', () =>
    toXmlMatch(
      tex2mml('\\matrix'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrix" display="block">
  <merror data-mjx-error="Missing argument for \\matrix">
    <mtext>Missing argument for \\matrix</mtext>
  </merror>
</math>`
    ));
  it('Matrix Arg', () =>
    toXmlMatch(
      tex2mml('\\matrix a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrix a" display="block">
  <mtable rowspacing="4pt" columnspacing="1em" data-frame-styles="" framespacing=".2em .125em" data-latex="a}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrix Braces', () =>
    toXmlMatch(
      tex2mml('\\matrix{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrix{a}" display="block">
  <mtable rowspacing="4pt" columnspacing="1em" data-frame-styles="" framespacing=".2em .125em" data-latex="\\matrix{a}">
    <mtr data-latex-item="{" data-latex="{">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrix Columns', () =>
    toXmlMatch(
      tex2mml('\\array{a&b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\array{a&amp;b}" display="block">
  <mtable rowspacing="4pt" columnspacing="1em" data-frame-styles="" framespacing=".2em .125em" data-latex="\\array{a&amp;b}">
    <mtr data-latex-item="{" data-latex="{">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrix Rows', () =>
    toXmlMatch(
      tex2mml('\\array{a&b\\\\ c&d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\array{a&amp;b\\\\ c&amp;d}" display="block">
  <mtable rowspacing="4pt" columnspacing="1em" data-frame-styles="" framespacing=".2em .125em" data-latex="\\array{a&amp;b\\\\ c&amp;d}">
    <mtr data-latex-item="{" data-latex="{">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{" data-latex="{">
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
  it('Matrix Subscript', () =>
    toXmlMatch(
      tex2mml('X_{\\matrix{a&b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{\\matrix{a&amp;b}}" display="block">
  <msub data-latex="X_{\\matrix{a&amp;b}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{{}}">
      <mtable rowspacing="4pt" columnspacing="1em" data-frame-styles="" framespacing=".2em .125em" data-latex="{}">
        <mtr data-latex-item="{" data-latex="{">
          <mtd>
            <mi data-latex="a">a</mi>
          </mtd>
          <mtd>
            <mi data-latex="b">b</mi>
          </mtd>
        </mtr>
      </mtable>
    </mrow>
  </msub>
</math>`
    ));
  it('Matrix Parens', () =>
    toXmlMatch(
      tex2mml('\\pmatrix{a&b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmatrix{a&amp;b}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex="\\pmatrix{a&amp;b}">
    <mo data-mjx-texclass="OPEN">(</mo>
    <mtable rowspacing="4pt" columnspacing="1em" data-frame-styles="" framespacing=".2em .125em">
      <mtr data-latex-item="{" data-latex="{">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE">)</mo>
  </mrow>
</math>`
    ));
  it('Matrix Parens Subscript', () =>
    toXmlMatch(
      tex2mml('X_{\\pmatrix{a&b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X_{\\pmatrix{a&amp;b}}" display="block">
  <msub data-latex="X_{\\pmatrix{a&amp;b}}">
    <mi data-latex="X">X</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{{}}">
      <mrow data-mjx-texclass="INNER" data-latex="{}">
        <mo data-mjx-texclass="OPEN">(</mo>
        <mtable rowspacing="4pt" columnspacing="1em" data-frame-styles="" framespacing=".2em .125em">
          <mtr data-latex-item="{" data-latex="{">
            <mtd>
              <mi data-latex="a">a</mi>
            </mtd>
            <mtd>
              <mi data-latex="b">b</mi>
            </mtd>
          </mtr>
        </mtable>
        <mo data-mjx-texclass="CLOSE">)</mo>
      </mrow>
    </mrow>
  </msub>
</math>`
    ));
  it('Matrix Cases', () =>
    toXmlMatch(
      tex2mml('\\cases{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cases{a}" display="block">
  <mrow data-mjx-texclass="INNER" data-latex="\\cases{a}">
    <mo data-mjx-texclass="OPEN">{</mo>
    <mtable rowspacing=".2em" columnspacing="1em" columnalign="left left" data-frame-styles="" framespacing=".2em .125em">
      <mtr data-latex-item="{" data-latex="{">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true"></mo>
  </mrow>
</math>`
    ));
  it('Matrix Numbered', () =>
    toXmlMatch(
      tex2mml('\\eqalignno{a&b&c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eqalignno{a&amp;b&amp;c}" display="block">
  <mtable rowspacing=".5em" columnspacing="0.278em" displaystyle="true" columnalign="right left" data-latex="\\eqalignno{a&amp;b&amp;c}">
    <mlabeledtr data-latex-item="{" data-latex="{">
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
});

describe('InternalMath', () => {
  it('Interspersed Text', () =>
    toXmlMatch(
      tex2mml('a\\text{c$d$e}b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\text{c$d$e}b" display="block">
  <mi data-latex="a">a</mi>
  <mrow data-latex="\\text{c$d$e}">
    <mtext>c</mtext>
    <mrow data-mjx-texclass="ORD">
      <mi data-latex="d">d</mi>
    </mrow>
    <mtext>e</mtext>
  </mrow>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Mbox Mbox', () =>
    toXmlMatch(
      tex2mml('a\\mbox{ b $a\\mbox{ b c } c$ c } c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\mbox{ b $a\\mbox{ b c } c$ c } c" display="block">
  <mi data-latex="a">a</mi>
  <mstyle displaystyle="false" scriptlevel="0" data-latex="\\mbox{ b $a\\mbox{ b c } c$ c }">
    <mtext>&#xA0;b&#xA0;</mtext>
    <mrow data-mjx-texclass="ORD">
      <mi data-latex="a">a</mi>
      <mstyle displaystyle="false" scriptlevel="0" data-latex="\\mbox{ b c }">
        <mtext>&#xA0;b c&#xA0;</mtext>
      </mstyle>
      <mi data-latex="c">c</mi>
    </mrow>
    <mtext>&#xA0;c&#xA0;</mtext>
  </mstyle>
  <mi data-latex="c">c</mi>
</math>`
    ));
  it('Mbox Math', () =>
    toXmlMatch(
      tex2mml('a\\mbox{ ${ab}$ } c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\mbox{ \${ab}\$ } c" display="block">
  <mi data-latex="a">a</mi>
  <mstyle displaystyle="false" scriptlevel="0" data-latex="\\mbox{ \${ab}\$ }">
    <mtext>&#xA0;</mtext>
    <mrow data-mjx-texclass="ORD">
      <mrow data-mjx-texclass="ORD" data-latex="{ab}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mrow>
    </mrow>
    <mtext>&#xA0;</mtext>
  </mstyle>
  <mi data-latex="c">c</mi>
</math>`
    ));
  it('Mbox CR', () =>
    toXmlMatch(
      tex2mml('a\\mbox{aa \\\\ bb} c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\mbox{aa \\\\ bb} c" display="block">
  <mi data-latex="a">a</mi>
  <mstyle displaystyle="false" scriptlevel="0" data-latex="\\mbox{aa \\\\ bb}">
    <mtext>aa \\ bb</mtext>
  </mstyle>
  <mi data-latex="c">c</mi>
</math>`
    ));
  it('Internal Math Error', () =>
    toXmlMatch(
      tex2mml('a\\mbox{$}} c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\mbox{$}} c" display="block">
      <merror data-mjx-error="Math mode is not properly terminated">
        <mtext>Math mode is not properly terminated</mtext>
      </merror>
    </math>`
    ));
  it('Mbox Internal Display', () =>
    toXmlMatch(
      tex2mml('a\\mbox{aa \\(\\frac{a}{b}\\) bb} c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\mbox{aa \\(\\frac{a}{b}\\) bb} c" display="block">
  <mi data-latex="a">a</mi>
  <mstyle displaystyle="false" scriptlevel="0" data-latex="\\mbox{aa \\(\\frac{a}{b}\\) bb}">
    <mtext>aa&#xA0;</mtext>
    <mrow data-mjx-texclass="ORD">
      <mfrac data-latex="\\frac{a}{b}">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
    </mrow>
    <mtext>&#xA0;bb</mtext>
  </mstyle>
  <mi data-latex="c">c</mi>
</math>`
    ));
});

describe('Array', () => {
  it('Array Single', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c}a\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c}a\\end{array}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{c}a\\end{array}">
    <mtr data-latex-item="{c}" data-latex="{c}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Enclosed left right', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{|c|}a\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{|c|}a\\end{array}" display="block">
  <menclose notation="left right" data-padding="0" data-latex-item="{array}" data-latex="\\begin{array}{|c|}a\\end{array}">
    <mtable columnspacing="1em" rowspacing="4pt" data-frame-styles="" framespacing=".5em .125em">
      <mtr data-latex-item="{|c|}" data-latex="{|c|}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
  </menclose>
</math>`
    ));
  it('Enclosed left', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{|c}a\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{|c}a\\end{array}" display="block">
  <menclose notation="left" data-padding="0" data-latex-item="{array}" data-latex="\\begin{array}{|c}a\\end{array}">
    <mtable columnspacing="1em" rowspacing="4pt" data-frame-styles="" framespacing=".5em .125em">
      <mtr data-latex-item="{|c}" data-latex="{|c}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
  </menclose>
</math>`
    ));
  it('Enclosed right', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c|}a\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c|}a\\end{array}" display="block">
  <menclose notation="right" data-padding="0" data-latex-item="{array}" data-latex="\\begin{array}{c|}a\\end{array}">
    <mtable columnspacing="1em" rowspacing="4pt" data-frame-styles="" framespacing=".5em .125em">
      <mtr data-latex-item="{c|}" data-latex="{c|}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
  </menclose>
</math>`
    ));
  it('Enclosed top', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c}\\hline a\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c}\\hline a\\end{array}" display="block">
  <menclose notation="top" data-padding="0" data-latex-item="{array}" data-latex="\\begin{array}{c}\\hline a\\end{array}">
    <mtable columnspacing="1em" rowspacing="4pt" data-frame-styles="" framespacing=".5em .125em">
      <mtr data-latex-item="{c}" data-latex="{c}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
  </menclose>
</math>`
    ));
  it('Enclosed bottom', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c} a\\\\\\hline\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c} a\\\\\\hline\\end{array}" display="block">
  <menclose notation="bottom" data-padding="0" data-latex-item="{array}" data-latex="\\begin{array}{c} a\\\\\\hline\\end{array}">
    <mtable columnspacing="1em" rowspacing="4pt" data-frame-styles="" framespacing=".5em .125em">
      <mtr data-latex-item="{c}" data-latex="{c}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
  </menclose>
</math>`
    ));
  it('Enclosed top bottom', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c}\\hline a\\\\\\hline\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c}\\hline a\\\\\\hline\\end{array}" display="block">
  <menclose notation="top bottom" data-padding="0" data-latex-item="{array}" data-latex="\\begin{array}{c}\\hline a\\\\\\hline\\end{array}">
    <mtable columnspacing="1em" rowspacing="4pt" data-frame-styles="" framespacing=".5em .125em">
      <mtr data-latex-item="{c}" data-latex="{c}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
  </menclose>
</math>`
    ));
  it('Enclosed frame solid', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{|c|}\\hline a\\\\\\hline\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{|c|}\\hline a\\\\\\hline\\end{array}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" framespacing=".5em .125em" frame="solid" data-latex-item="{array}" data-latex="\\begin{array}{|c|}\\hline a\\\\\\hline\\end{array}">
    <mtr data-latex-item="{|c|}" data-latex="{|c|}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Enclosed frame dashed', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{:c:}\\hline a\\\\\\hline\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{:c:}\\hline a\\\\\\hline\\end{array}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" data-frame-styles="solid dashed solid dashed" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{:c:}\\hline a\\\\\\hline\\end{array}">
    <mtr data-latex-item="{:c:}" data-latex="{:c:}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Array dashed column', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c:c}a&c\\\\b&d\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c:c}a&amp;c\\\\b&amp;d\\end{array}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" columnlines="dashed" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{c:c}a&amp;c\\\\b&amp;d\\end{array}">
    <mtr data-latex-item="{c:c}" data-latex="{c:c}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{c:c}" data-latex="{c:c}">
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
      <mtd>
        <mi data-latex="d">d</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Array solid column', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c|c}a&c\\\\b&d\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c|c}a&amp;c\\\\b&amp;d\\end{array}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" columnlines="solid" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{c|c}a&amp;c\\\\b&amp;d\\end{array}">
    <mtr data-latex-item="{c|c}" data-latex="{c|c}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{c|c}" data-latex="{c|c}">
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
      <mtd>
        <mi data-latex="d">d</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Array dashed row', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c}a\\\\\\hdashline b\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c}a\\\\\\hdashline b\\end{array}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" rowlines="dashed" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{c}a\\\\\\hdashline b\\end{array}">
    <mtr data-latex-item="{c}" data-latex="{c}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{c}" data-latex="{c}">
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Array solid row', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c}a\\\\\\hline b\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c}a\\\\\\hline b\\end{array}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" rowlines="solid" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{c}a\\\\\\hline b\\end{array}">
    <mtr data-latex-item="{c}" data-latex="{c}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{c}" data-latex="{c}">
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Enclosed dashed row', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{|c|}a\\\\\\hdashline b\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{|c|}a\\\\\\hdashline b\\end{array}" display="block">
  <menclose notation="left right" data-padding="0" data-latex-item="{array}" data-latex="\\begin{array}{|c|}a\\\\\\hdashline b\\end{array}">
    <mtable columnspacing="1em" rowspacing="4pt" rowlines="dashed" data-frame-styles="" framespacing=".5em .125em">
      <mtr data-latex-item="{|c|}" data-latex="{|c|}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{|c|}" data-latex="{|c|}">
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
    </mtable>
  </menclose>
</math>`
    ));
  it('Enclosed solid row', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{|c|}a\\\\\\hline b\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{|c|}a\\\\\\hline b\\end{array}" display="block">
  <menclose notation="left right" data-padding="0" data-latex-item="{array}" data-latex="\\begin{array}{|c|}a\\\\\\hline b\\end{array}">
    <mtable columnspacing="1em" rowspacing="4pt" rowlines="solid" data-frame-styles="" framespacing=".5em .125em">
      <mtr data-latex-item="{|c|}" data-latex="{|c|}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{|c|}" data-latex="{|c|}">
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
      </mtr>
    </mtable>
  </menclose>
</math>`
    ));
  it('Enclosed dashed column', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{|c:c|}a&c\\\\b&d\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{|c:c|}a&amp;c\\\\b&amp;d\\end{array}" display="block">
  <menclose notation="left right" data-padding="0" data-latex-item="{array}" data-latex="\\begin{array}{|c:c|}a&amp;c\\\\b&amp;d\\end{array}">
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" columnlines="dashed" data-frame-styles="" framespacing=".5em .125em">
      <mtr data-latex-item="{|c:c|}" data-latex="{|c:c|}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{|c:c|}" data-latex="{|c:c|}">
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
  </menclose>
</math>`
    ));
  it('Enclosed solid column', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{|c|c|}a&c\\\\b&d\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{|c|c|}a&amp;c\\\\b&amp;d\\end{array}" display="block">
  <menclose notation="left right" data-padding="0" data-latex-item="{array}" data-latex="\\begin{array}{|c|c|}a&amp;c\\\\b&amp;d\\end{array}">
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" columnlines="solid" data-frame-styles="" framespacing=".5em .125em">
      <mtr data-latex-item="{|c|c|}" data-latex="{|c|c|}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{|c|c|}" data-latex="{|c|c|}">
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
      </mtr>
    </mtable>
  </menclose>
</math>`
    ));
  it('Label', () =>
    toXmlMatch(
      tex2mml('\\eqalignno{a &  & {\\hbox{(3)}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\eqalignno{a &amp;  &amp; {\\hbox{(3)}}}" display="block">
  <mtable rowspacing=".5em" columnspacing="0.278em" displaystyle="true" columnalign="right left" data-latex="\\eqalignno{a &amp;  &amp; {\\hbox{(3)}}}">
    <mlabeledtr data-latex-item="{" data-latex="{">
      <mtd>
        <mrow data-mjx-texclass="ORD" data-latex="{\\hbox{(3)}}">
          <mstyle displaystyle="false" scriptlevel="0" data-latex="\\hbox{(3)}">
            <mtext>(3)</mtext>
          </mstyle>
        </mrow>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd></mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Columnlines Solid None', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c|cc}a&b&c\\\\d&e&f\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c|cc}a&amp;b&amp;c\\\\d&amp;e&amp;f\\end{array}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center center" columnlines="solid none" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{c|cc}a&amp;b&amp;c\\\\d&amp;e&amp;f\\end{array}">
    <mtr data-latex-item="{c|cc}" data-latex="{c|cc}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{c|cc}" data-latex="{c|cc}">
      <mtd>
        <mi data-latex="d">d</mi>
      </mtd>
      <mtd>
        <mi data-latex="e">e</mi>
      </mtd>
      <mtd>
        <mi data-latex="f">f</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Rowlines Solid None', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{array}{ccc}a&b&c\\\\\\hline d&e&f\\\\ g&h&i \\end{array}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{ccc}a&amp;b&amp;c\\\\\\hline d&amp;e&amp;f\\\\ g&amp;h&amp;i \\end{array}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center center" rowlines="solid none" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{ccc}a&amp;b&amp;c\\\\\\hline d&amp;e&amp;f\\\\ g&amp;h&amp;i \\end{array}">
    <mtr data-latex-item="{ccc}" data-latex="{ccc}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{ccc}" data-latex="{ccc}">
      <mtd>
        <mi data-latex="d">d</mi>
      </mtd>
      <mtd>
        <mi data-latex="e">e</mi>
      </mtd>
      <mtd>
        <mi data-latex="f">f</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{ccc}" data-latex="{ccc}">
      <mtd>
        <mi data-latex="g">g</mi>
      </mtd>
      <mtd>
        <mi data-latex="h">h</mi>
      </mtd>
      <mtd>
        <mi data-latex="i">i</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Column+Rowlines Solid None', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{array}{c|cc}a&b&c\\\\\\hline d&e&f\\\\ g&h&i \\end{array}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c|cc}a&amp;b&amp;c\\\\\\hline d&amp;e&amp;f\\\\ g&amp;h&amp;i \\end{array}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center center" columnlines="solid none" rowlines="solid none" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{c|cc}a&amp;b&amp;c\\\\\\hline d&amp;e&amp;f\\\\ g&amp;h&amp;i \\end{array}">
    <mtr data-latex-item="{c|cc}" data-latex="{c|cc}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{c|cc}" data-latex="{c|cc}">
      <mtd>
        <mi data-latex="d">d</mi>
      </mtd>
      <mtd>
        <mi data-latex="e">e</mi>
      </mtd>
      <mtd>
        <mi data-latex="f">f</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{c|cc}" data-latex="{c|cc}">
      <mtd>
        <mi data-latex="g">g</mi>
      </mtd>
      <mtd>
        <mi data-latex="h">h</mi>
      </mtd>
      <mtd>
        <mi data-latex="i">i</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Column+Rowlines Solid Dashed None', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{array}{c|c:cc}0&a&b&c\\\\\\hline 1&d&e&f\\\\\\hdashline 2&g&h&i\\\\ 3&j&k&l \\end{array}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c|c:cc}0&amp;a&amp;b&amp;c\\\\\\hline 1&amp;d&amp;e&amp;f\\\\\\hdashline 2&amp;g&amp;h&amp;i\\\\ 3&amp;j&amp;k&amp;l \\end{array}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center center center" columnlines="solid dashed none" rowlines="solid dashed none" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{c|c:cc}0&amp;a&amp;b&amp;c\\\\\\hline 1&amp;d&amp;e&amp;f\\\\\\hdashline 2&amp;g&amp;h&amp;i\\\\ 3&amp;j&amp;k&amp;l \\end{array}">
    <mtr data-latex-item="{c|c:cc}" data-latex="{c|c:cc}">
      <mtd>
        <mn data-latex="0">0</mn>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{c|c:cc}" data-latex="{c|c:cc}">
      <mtd>
        <mn data-latex="1">1</mn>
      </mtd>
      <mtd>
        <mi data-latex="d">d</mi>
      </mtd>
      <mtd>
        <mi data-latex="e">e</mi>
      </mtd>
      <mtd>
        <mi data-latex="f">f</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{c|c:cc}" data-latex="{c|c:cc}">
      <mtd>
        <mn data-latex="2">2</mn>
      </mtd>
      <mtd>
        <mi data-latex="g">g</mi>
      </mtd>
      <mtd>
        <mi data-latex="h">h</mi>
      </mtd>
      <mtd>
        <mi data-latex="i">i</mi>
      </mtd>
    </mtr>
    <mtr data-latex-item="{c|c:cc}" data-latex="{c|c:cc}">
      <mtd>
        <mn data-latex="3">3</mn>
      </mtd>
      <mtd>
        <mi data-latex="j">j</mi>
      </mtd>
      <mtd>
        <mi data-latex="k">k</mi>
      </mtd>
      <mtd>
        <mi data-latex="l">l</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Matrix Test', () =>
    toXmlMatch(
      tex2mml(
        '\\left( \\begin{array}{ccc}a & b & c \\\\d & e & f \\\\g & h & i \\end{array} \\right)'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left( \\begin{array}{ccc}a &amp; b &amp; c \\\\d &amp; e &amp; f \\\\g &amp; h &amp; i \\end{array} \\right)" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left( \\begin{array}{ccc}a &amp; b &amp; c \\\\d &amp; e &amp; f \\\\g &amp; h &amp; i \\end{array} \\right)" data-latex="\\left( \\begin{array}{ccc}a &amp; b &amp; c \\\\d &amp; e &amp; f \\\\g &amp; h &amp; i \\end{array} \\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center center" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="{array}">
      <mtr data-latex-item="{ccc}" data-latex="{ccc}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
        <mtd>
          <mi data-latex="b">b</mi>
        </mtd>
        <mtd>
          <mi data-latex="c">c</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{ccc}" data-latex="{ccc}">
        <mtd>
          <mi data-latex="d">d</mi>
        </mtd>
        <mtd>
          <mi data-latex="e">e</mi>
        </mtd>
        <mtd>
          <mi data-latex="f">f</mi>
        </mtd>
      </mtr>
      <mtr data-latex-item="{ccc}" data-latex="{ccc}">
        <mtd>
          <mi data-latex="g">g</mi>
        </mtd>
        <mtd>
          <mi data-latex="h">h</mi>
        </mtd>
        <mtd>
          <mi data-latex="i">i</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
});

describe('Moving limits', () => {
  it('Limits SubSup', () =>
    toXmlMatch(
      tex2mml('\\int^2\\limits_3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\int^2\\limits_3" display="block">
  <munderover data-latex="\\int^2 \\limits_3 ">
    <mo data-latex="\\int">&#x222B;</mo>
    <mn data-latex="3">3</mn>
    <mn data-latex="2">2</mn>
  </munderover>
</math>`
    ));
  it('Limits UnderOver', () =>
    toXmlMatch(
      tex2mml('\\lim_3\\nolimits^2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\lim_3\\nolimits^2" display="block">
  <msubsup data-latex="\\lim_3 \\nolimits^2 ">
    <mo data-mjx-texclass="OP" data-latex="\\lim">lim</mo>
    <mn data-latex="3">3</mn>
    <mn data-latex="2">2</mn>
  </msubsup>
</math>`
    ));
  it('Limits', () =>
    toXmlMatch(
      tex2mml('\\sum\\limits^2_3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sum\\limits^2_3" display="block">
  <munderover data-latex="\\sum\\limits^2 _3 ">
    <mo data-latex="\\limits" movablelimits="false">&#x2211;</mo>
    <mn data-latex="3">3</mn>
    <mn data-latex="2">2</mn>
  </munderover>
</math>`
    ));
  it('Vector Op', () =>
    toXmlMatch(
      tex2mml('\\vec{+}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\vec{+}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\vec{+}">
    <mover>
      <mo data-latex="+">+</mo>
      <mo stretchy="false">&#x2192;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Overline', () =>
    toXmlMatch(
      tex2mml('\\overline{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overline{a}" display="block">
  <mover data-latex="\\overline{a}">
    <mi data-latex="a">a</mi>
    <mo accent="true">&#x2015;</mo>
  </mover>
</math>`
    ));
  it('Overline Limits', () =>
    toXmlMatch(
      tex2mml('\\overline{\\int\\limits^2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overline{\\int\\limits^2}" display="block">
  <mover data-latex="\\overline{\\int\\limits^2}">
    <mrow>
      <mo rspace="0"></mo>
      <mover data-latex="\\int\\limits^2 ">
        <mo data-latex="\\limits" lspace="0" rspace="0">&#x222B;</mo>
        <mn data-latex="2">2</mn>
      </mover>
    </mrow>
    <mo accent="true">&#x2015;</mo>
  </mover>
</math>`
    ));
  it('Overline Sum', () =>
    toXmlMatch(
      tex2mml('\\overline{\\sum}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overline{\\sum}" display="block">
  <mover data-latex="\\overline{\\sum}">
    <mo data-latex="\\sum" movablelimits="false">&#x2211;</mo>
    <mo accent="true">&#x2015;</mo>
  </mover>
</math>`
    ));
  it('Overline 1', () =>
    toXmlMatch(
      tex2mml('\\overline{\\sum}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overline{\\sum}" display="block">
  <mover data-latex="\\overline{\\sum}">
    <mo data-latex="\\sum" movablelimits="false">&#x2211;</mo>
    <mo accent="true">&#x2015;</mo>
  </mover>
</math>`
    ));
  it('Overline 2', () =>
    toXmlMatch(
      tex2mml('\\overline{\\mathop{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overline{\\mathop{a}}" display="block">
  <mover data-latex="\\overline{\\mathop{a}}">
    <mrow data-mjx-texclass="OP" data-latex="\\mathop{a}">
      <mi data-latex="a">a</mi>
    </mrow>
    <mo accent="true">&#x2015;</mo>
  </mover>
</math>`
    ));
  it('Overline 3', () =>
    toXmlMatch(
      tex2mml('\\overline{\\mathop{a}}^2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overline{\\mathop{a}}^2" display="block">
  <msup data-latex="\\overline{\\mathop{a}}^2 ">
    <mover data-latex="\\overline{\\mathop{a}}">
      <mrow data-mjx-texclass="OP" data-latex="\\mathop{a}">
        <mi data-latex="a">a</mi>
      </mrow>
      <mo accent="true">&#x2015;</mo>
    </mover>
    <mn data-latex="2">2</mn>
  </msup>
</math>`
    ));
  it('Overline 4', () =>
    toXmlMatch(
      tex2mml('\\overline{\\sum^2_3}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overline{\\sum^2_3}" display="block">
  <mover data-latex="\\overline{\\sum^2_3}">
    <mrow>
      <mo rspace="0"></mo>
      <munderover data-latex="\\sum^2 _3 ">
        <mo data-latex="\\sum" lspace="0" rspace="0">&#x2211;</mo>
        <mn data-latex="3">3</mn>
        <mn data-latex="2">2</mn>
      </munderover>
    </mrow>
    <mo accent="true">&#x2015;</mo>
  </mover>
</math>`
    ));
  it('Overline 5', () =>
    toXmlMatch(
      tex2mml('\\overline{\\sum}^2_3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overline{\\sum}^2_3" display="block">
  <msubsup data-latex="\\overline{\\sum}^2 _3 ">
    <mover data-latex="\\overline{\\sum}">
      <mo data-latex="\\sum" movablelimits="false">&#x2211;</mo>
      <mo accent="true">&#x2015;</mo>
    </mover>
    <mn data-latex="3">3</mn>
    <mn data-latex="2">2</mn>
  </msubsup>
</math>`
    ));
  it('Overline 6', () =>
    toXmlMatch(
      tex2mml('\\overline{\\underline{\\sum}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overline{\\underline{\\sum}}" display="block">
  <mover data-latex="\\overline{\\underline{\\sum}}">
    <mrow>
      <mo rspace="0"></mo>
      <munder data-latex="\\underline{\\sum}">
        <mo data-latex="\\sum" movablelimits="false" lspace="0" rspace="0">&#x2211;</mo>
        <mo accent="true">&#x2015;</mo>
      </munder>
    </mrow>
    <mo accent="true">&#x2015;</mo>
  </mover>
</math>`
    ));
  it('Overbrace 1', () =>
    toXmlMatch(
      tex2mml('\\overbrace{abc}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overbrace{abc}" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\overbrace{abc}">
    <mover>
      <mrow data-latex="abc">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
        <mi data-latex="c">c</mi>
      </mrow>
      <mo>&#x23DE;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Underbrace', () =>
    toXmlMatch(
      tex2mml('\\underbrace{abc}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\underbrace{abc}" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\underbrace{abc}">
    <munder>
      <mrow data-latex="abc">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
        <mi data-latex="c">c</mi>
      </mrow>
      <mo>&#x23DF;</mo>
    </munder>
  </mrow>
</math>`
    ));
  it('Overbrace Op 1', () =>
    toXmlMatch(
      tex2mml('\\overbrace{\\mathop{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overbrace{\\mathop{a}}" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\overbrace{\\mathop{a}}">
    <mover>
      <mrow data-mjx-texclass="OP" data-latex="\\mathop{a}">
        <mi data-latex="a">a</mi>
      </mrow>
      <mo>&#x23DE;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Overbrace Op 2', () =>
    toXmlMatch(
      tex2mml('\\overbrace{\\mathop{a}}^2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overbrace{\\mathop{a}}^2" display="block">
  <mover data-latex="\\overbrace{\\mathop{a}}^2 ">
    <mrow data-mjx-texclass="OP" data-latex="\\overbrace{\\mathop{a}}">
      <mover>
        <mrow data-mjx-texclass="OP" data-latex="\\mathop{a}">
          <mi data-latex="a">a</mi>
        </mrow>
        <mo>&#x23DE;</mo>
      </mover>
    </mrow>
    <mn data-latex="2">2</mn>
  </mover>
</math>`
    ));
  it('Overbrace 2', () =>
    toXmlMatch(
      tex2mml('\\overbrace{\\sum}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overbrace{\\sum}" display="block">
  <mrow data-mjx-texclass="OP" data-latex="\\overbrace{\\sum}">
    <mover>
      <mo data-latex="\\sum" movablelimits="false">&#x2211;</mo>
      <mo>&#x23DE;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Overbrace 3', () =>
    toXmlMatch(
      tex2mml('\\overbrace{\\sum}^2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overbrace{\\sum}^2" display="block">
  <mover data-latex="\\overbrace{\\sum}^2 ">
    <mrow data-mjx-texclass="OP" data-latex="\\overbrace{\\sum}">
      <mover>
        <mo data-latex="\\sum" movablelimits="false">&#x2211;</mo>
        <mo>&#x23DE;</mo>
      </mover>
    </mrow>
    <mn data-latex="2">2</mn>
  </mover>
</math>`
    ));
});

describe('Multirel', () => {
  it('Shift Left', () =>
    toXmlMatch(
      tex2mml('a<<b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a&lt;&lt;b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="&lt;">&lt;&lt;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Less Equal', () =>
    toXmlMatch(
      tex2mml('a<=b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a&lt;=b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="&lt;" rspace="0pt">&lt;</mo>
  <mo data-latex="=" lspace="0pt">=</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Infix Op Op', () =>
    toXmlMatch(
      tex2mml('a++b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a++b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="+">+</mo>
  <mo data-latex="+">+</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Infix Op Rel', () =>
    toXmlMatch(
      tex2mml('a+=b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a+=b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="+">+</mo>
  <mo data-latex="=">=</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Postfix Op Op', () =>
    toXmlMatch(
      tex2mml('a++'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a++" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="+">+</mo>
  <mo data-latex="+">+</mo>
</math>`
    ));
  it('Postfix Rel Rel', () =>
    toXmlMatch(
      tex2mml('a=='),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a==" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="=">==</mo>
</math>`
    ));
  it('Infix Bars', () =>
    toXmlMatch(
      tex2mml('a||b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a||b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Infix Fences', () =>
    toXmlMatch(
      tex2mml('a))b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a))b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mo data-latex=")" stretchy="false">)</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Infix Rel Rel', () =>
    toXmlMatch(
      tex2mml('a\\rightarrow=b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\rightarrow=b" display="block">
  <mi data-latex="a">a</mi>
  <mo stretchy="false" data-latex="\\rightarrow" rspace="0pt">&#x2192;</mo>
  <mo data-latex="=" lspace="0pt">=</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Infix 4Rel', () =>
    toXmlMatch(
      tex2mml('a=<>=b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a=&lt;&gt;=b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="=" rspace="0pt">=</mo>
  <mo data-latex="&lt;" lspace="0pt" rspace="0pt">&lt;</mo>
  <mo data-latex="&gt;" lspace="0pt" rspace="0pt">&gt;</mo>
  <mo data-latex="=" lspace="0pt">=</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Prefix Rel Rel', () =>
    toXmlMatch(
      tex2mml('==a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="==a" display="block">
  <mo data-latex="=">==</mo>
  <mi data-latex="a">a</mi>
</math>`
    ));
  it('Prefix Op Op', () =>
    toXmlMatch(
      tex2mml('++a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="++a" display="block">
  <mo data-latex="+">+</mo>
  <mo data-latex="+">+</mo>
  <mi data-latex="a">a</mi>
</math>`
    ));
  it('Multirel Font 1', () =>
    toXmlMatch(
      tex2mml('a <=\\mathrm{>} b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;=\\mathrm{&gt;} b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="&lt;" rspace="0pt">&lt;</mo>
  <mo data-latex="=" lspace="0pt">=</mo>
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{&gt;}">
    <mo data-latex="&gt;">&gt;</mo>
  </mrow>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Multirel Font 2', () =>
    toXmlMatch(
      tex2mml('a <=\\mathrm{=>} b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;=\\mathrm{=&gt;} b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="&lt;" rspace="0pt">&lt;</mo>
  <mo data-latex="=" lspace="0pt">=</mo>
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{=&gt;}">
    <mo data-latex="=" rspace="0pt">=</mo>
    <mo data-latex="&gt;" lspace="0pt">&gt;</mo>
  </mrow>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Multirel Font 3', () =>
    toXmlMatch(
      tex2mml('a <=\\mathrm{=}\\mathrm{>} b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;=\\mathrm{=}\\mathrm{&gt;} b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="&lt;" rspace="0pt">&lt;</mo>
  <mo data-latex="=" lspace="0pt">=</mo>
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{=}">
    <mo data-latex="=">=</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{&gt;}">
    <mo data-latex="&gt;">&gt;</mo>
  </mrow>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Simple Shadow Rel', () =>
    toXmlMatch(
      tex2mml('a \\sim b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\sim b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="\\sim">&#x223C;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Extra Attribute Rel 1', () =>
    toXmlMatch(
      tex2mml('a =\\sim b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a =\\sim b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="=" rspace="0pt">=</mo>
  <mo data-latex="\\sim" lspace="0pt">&#x223C;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Extra Attribute Rel 2', () =>
    toXmlMatch(
      tex2mml('a \\sim\\simeq b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\sim\\simeq b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="\\sim" rspace="0pt">&#x223C;</mo>
  <mo data-latex="\\simeq" lspace="0pt">&#x2243;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Extra Attribute Rel 3', () =>
    toXmlMatch(
      tex2mml('a \\sim\\asymp b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\sim\\asymp b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="\\sim" rspace="0pt">&#x223C;</mo>
  <mo data-latex="\\asymp" lspace="0pt">&#x224D;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Extra Attribute Rel 4', () =>
    toXmlMatch(
      tex2mml('a \\sim\\simeq\\asymp b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\sim\\simeq\\asymp b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="\\sim" rspace="0pt">&#x223C;</mo>
  <mo data-latex="\\simeq" lspace="0pt" rspace="0pt">&#x2243;</mo>
  <mo data-latex="\\asymp" lspace="0pt">&#x224D;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Extra Attribute Rel 5', () =>
    toXmlMatch(
      tex2mml('a \\sim\\asymp\\simeq b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\sim\\asymp\\simeq b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="\\sim" rspace="0pt">&#x223C;</mo>
  <mo data-latex="\\asymp" lspace="0pt" rspace="0pt">&#x224D;</mo>
  <mo data-latex="\\simeq" lspace="0pt">&#x2243;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Extra Attribute Rel 6', () =>
    toXmlMatch(
      tex2mml('a \\sim\\cong b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\sim\\cong b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="\\sim" rspace="0pt">&#x223C;</mo>
  <mo data-latex="\\cong" lspace="0pt">&#x2245;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Infix Stretchy Right', () =>
    toXmlMatch(
      tex2mml('a=\\rightarrow b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a=\\rightarrow b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="=" rspace="0pt">=</mo>
  <mo stretchy="false" data-latex="\\rightarrow" lspace="0pt">&#x2192;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
});

describe('Other', () => {
  it('Other', () =>
    toXmlMatch(
      tex2mml('+'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="+" display="block">
  <mo data-latex="+">+</mo>
</math>`
    ));
  it('Other Remap', () =>
    toXmlMatch(
      tex2mml('-'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="-" display="block">
  <mo data-latex="-">&#x2212;</mo>
</math>`
    ));
  it('Other Font', () =>
    toXmlMatch(
      tex2mml('\\mathbf{+}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbf{+}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{+}">
    <mo mathvariant="bold" data-latex="+">+</mo>
  </mrow>
</math>`
    ));
  it('Other Delimiter', () =>
    toXmlMatch(
      tex2mml('('),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="(" display="block">
  <mo data-latex="(" stretchy="false">(</mo>
</math>`
    ));
  it('Other Dollar', () =>
    toXmlMatch(
      tex2mml('$'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="$" display="block">
  <mrow data-mjx-texclass="ORD">
    <mo data-latex="$">$</mo>
  </mrow>
</math>`
    ));
  it('Other Unicode', () =>
    toXmlMatch(
      tex2mml('˦'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="&#x2E6;" display="block">
  <mrow data-mjx-texclass="ORD">
    <mo data-latex="&#x2E6;">&#x2E6;</mo>
  </mrow>
</math>`
    ));
  it('Other Surrogate', () =>
    toXmlMatch(
      tex2mml('𝐀'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="&#x1D400;" display="block">
  <mi data-latex="&#x1D400;">&#x1D400;</mi>
</math>`
    ));
  it('Other Arrow Range', () =>
    toXmlMatch(
      tex2mml('⤡'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="&#x2921;" display="block">
  <mo data-latex="&#x2921;" stretchy="false">&#x2921;</mo>
</math>`
    ));
  it('Other Arrow Infix', () =>
    toXmlMatch(
      tex2mml('a⤡b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a&#x2921;b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="&#x2921;" stretchy="false">&#x2921;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Other Arrow Prefix', () =>
    toXmlMatch(
      tex2mml('⤡b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="&#x2921;b" display="block">
  <mo data-latex="&#x2921;" stretchy="false">&#x2921;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Other Arrow Postfix', () =>
    toXmlMatch(
      tex2mml('b⤡'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="b&#x2921;" display="block">
  <mi data-latex="b">b</mi>
  <mo data-latex="&#x2921;" stretchy="false">&#x2921;</mo>
</math>`
    ));
  it('Vertical Bar Alone', () =>
    toXmlMatch(
      tex2mml('|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="|" display="block">
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
</math>`
    ));
  it('Vertical Bar Infix', () =>
    toXmlMatch(
      tex2mml('a|b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a|b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Vertical Bar Postfix', () =>
    toXmlMatch(
      tex2mml('a|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a|" display="block">
  <mi data-latex="a">a</mi>
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
</math>`
    ));
  it('Vertical Bar Prefix', () =>
    toXmlMatch(
      tex2mml('|b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="|b" display="block">
  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
});

describe('Base Complex', () => {
  it('Square Root Complex', () =>
    toXmlMatch(
      tex2mml('\\sqrt{3x-1}+(1+x)^2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt{3x-1}+(1+x)^2" display="block">
  <msqrt data-latex="\\sqrt{3x-1}">
    <mn data-latex="3">3</mn>
    <mi data-latex="x">x</mi>
    <mo data-latex="-">&#x2212;</mo>
    <mn data-latex="1">1</mn>
  </msqrt>
  <mo data-latex="+">+</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mn data-latex="1">1</mn>
  <mo data-latex="+">+</mo>
  <mi data-latex="x">x</mi>
  <msup data-latex=")^2">
    <mo data-latex=")" stretchy="false">)</mo>
    <mn data-latex="2">2</mn>
  </msup>
</math>`
    ));
  it('General Root', () =>
    toXmlMatch(
      tex2mml('\\sqrt[4]{3x-1}+(1+x)^2'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt[4]{3x-1}+(1+x)^2" display="block">
  <mroot data-latex="\\sqrt[4]{3x-1}">
    <mrow data-latex="3x-1">
      <mn data-latex="3">3</mn>
      <mi data-latex="x">x</mi>
      <mo data-latex="-">&#x2212;</mo>
      <mn data-latex="1">1</mn>
    </mrow>
    <mn data-latex="4">4</mn>
  </mroot>
  <mo data-latex="+">+</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mn data-latex="1">1</mn>
  <mo data-latex="+">+</mo>
  <mi data-latex="x">x</mi>
  <msup data-latex=")^2">
    <mo data-latex=")" stretchy="false">)</mo>
    <mn data-latex="2">2</mn>
  </msup>
</math>`
    ));
  it('Quadratic Formula', () =>
    toXmlMatch(
      tex2mml('x = \\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x = \\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}" display="block">
  <mi data-latex="x">x</mi>
  <mo data-latex="=">=</mo>
  <mfrac data-latex="\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}">
    <mrow data-latex="-b\\pm\\sqrt{b^2-4ac}">
      <mo data-latex="-">&#x2212;</mo>
      <mi data-latex="b">b</mi>
      <mo data-latex="\\pm">&#xB1;</mo>
      <msqrt data-latex="\\sqrt{b^2-4ac}">
        <msup data-latex="b^2">
          <mi data-latex="b">b</mi>
          <mn data-latex="2">2</mn>
        </msup>
        <mo data-latex="-">&#x2212;</mo>
        <mn data-latex="4">4</mn>
        <mi data-latex="a">a</mi>
        <mi data-latex="c">c</mi>
      </msqrt>
    </mrow>
    <mrow data-latex="2a">
      <mn data-latex="2">2</mn>
      <mi data-latex="a">a</mi>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Cauchy-Schwarz Inequality', () =>
    toXmlMatch(
      tex2mml(
        '\\left( \\sum_{k=1}^n a_k b_k \\right)^{\\!\\!2} \\leq  \\left( \\sum_{k=1}^n a_k^2 \\right)  \\left( \\sum_{k=1}^n b_k^2 \\right)'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left( \\sum_{k=1}^n a_k b_k \\right)^{\\!\\!2} \\leq  \\left( \\sum_{k=1}^n a_k^2 \\right)  \\left( \\sum_{k=1}^n b_k^2 \\right)" display="block">
  <msup data-latex="\\left( \\sum_{k=1}^n a_k b_k \\right)^{\\!\\!2}">
    <mrow data-mjx-texclass="INNER" data-latex-item="\\left( \\sum_{k=1}^n a_k b_k \\right)" data-latex="\\left( \\sum_{k=1}^n a_k b_k \\right)">
      <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
      <munderover data-latex="\\sum_{k=1}^n">
        <mo data-latex="\\sum">&#x2211;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="{k=1}">
          <mi data-latex="k">k</mi>
          <mo data-latex="=">=</mo>
          <mn data-latex="1">1</mn>
        </mrow>
        <mi data-latex="n">n</mi>
      </munderover>
      <msub data-latex="a_k">
        <mi data-latex="a">a</mi>
        <mi data-latex="k">k</mi>
      </msub>
      <msub data-latex="b_k">
        <mi data-latex="b">b</mi>
        <mi data-latex="k">k</mi>
      </msub>
      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
    </mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\!\\!2}">
      <mstyle scriptlevel="0" data-latex="\\!">
        <mspace width="-0.167em"></mspace>
      </mstyle>
      <mstyle scriptlevel="0" data-latex="\\!">
        <mspace width="-0.167em"></mspace>
      </mstyle>
      <mn data-latex="2">2</mn>
    </mrow>
  </msup>
  <mo data-latex="\\leq">&#x2264;</mo>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left( \\sum_{k=1}^n a_k^2  \\right)" data-latex="\\left( \\sum_{k=1}^n a_k^2  \\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <munderover data-latex="\\sum_{k=1}^n">
      <mo data-latex="\\sum">&#x2211;</mo>
      <mrow data-mjx-texclass="ORD" data-latex="{k=1}">
        <mi data-latex="k">k</mi>
        <mo data-latex="=">=</mo>
        <mn data-latex="1">1</mn>
      </mrow>
      <mi data-latex="n">n</mi>
    </munderover>
    <msubsup data-latex="a_k^2">
      <mi data-latex="a">a</mi>
      <mi data-latex="k">k</mi>
      <mn data-latex="2">2</mn>
    </msubsup>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left( \\sum_{k=1}^n b_k^2  \\right)" data-latex="\\left( \\sum_{k=1}^n b_k^2  \\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <munderover data-latex="\\sum_{k=1}^n">
      <mo data-latex="\\sum">&#x2211;</mo>
      <mrow data-mjx-texclass="ORD" data-latex="{k=1}">
        <mi data-latex="k">k</mi>
        <mo data-latex="=">=</mo>
        <mn data-latex="1">1</mn>
      </mrow>
      <mi data-latex="n">n</mi>
    </munderover>
    <msubsup data-latex="b_k^2">
      <mi data-latex="b">b</mi>
      <mi data-latex="k">k</mi>
      <mn data-latex="2">2</mn>
    </msubsup>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('An Identity of Ramanujan', () =>
    toXmlMatch(
      tex2mml(
        '\\frac{1}{\\Bigl(\\sqrt{\\phi\\sqrt{5}}-\\phi\\Bigr)  e^{\\frac25\\pi}} =    1+\\frac{e^{-2\\pi}}      {1+\\frac{e^{-4\\pi}}        {1+\\frac{e^{-6\\pi}}          {1+\\frac{e^{-8\\pi}}            {1+\\ldots} } } }'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\frac{1}{\\Bigl(\\sqrt{\\phi\\sqrt{5}}-\\phi\\Bigr)  e^{\\frac25\\pi}} =    1+\\frac{e^{-2\\pi}}      {1+\\frac{e^{-4\\pi}}        {1+\\frac{e^{-6\\pi}}          {1+\\frac{e^{-8\\pi}}            {1+\\ldots} } } }" display="block">
  <mfrac data-latex="\\frac{1}{\\Bigl(\\sqrt{\\phi\\sqrt{5}}-\\phi\\Bigr)  e^{\\frac25\\pi}}">
    <mn data-latex="1">1</mn>
    <mrow data-latex="\\Bigl(\\sqrt{\\phi\\sqrt{5}}-\\phi\\Bigr)  e^{\\frac25\\pi}">
      <mrow data-mjx-texclass="OPEN" data-latex="\\Bigl(">
        <mo minsize="1.623em" maxsize="1.623em">(</mo>
      </mrow>
      <msqrt data-latex="\\sqrt{\\phi\\sqrt{5}}">
        <mi data-latex="\\phi">&#x3D5;</mi>
        <msqrt data-latex="\\sqrt{5}">
          <mn data-latex="5">5</mn>
        </msqrt>
      </msqrt>
      <mo data-latex="-">&#x2212;</mo>
      <mi data-latex="\\phi">&#x3D5;</mi>
      <mrow data-mjx-texclass="CLOSE" data-latex="\\Bigr)">
        <mo minsize="1.623em" maxsize="1.623em">)</mo>
      </mrow>
      <msup data-latex="e^{\\frac25\\pi}">
        <mi data-latex="e">e</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{\\frac25\\pi}">
          <mfrac data-latex="\\frac25">
            <mn data-latex="2">2</mn>
            <mn data-latex="5">5</mn>
          </mfrac>
          <mi data-latex="\\pi">&#x3C0;</mi>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
  <mo data-latex="=">=</mo>
  <mn data-latex="1">1</mn>
  <mo data-latex="+">+</mo>
  <mfrac data-latex="\\frac{e^{-2\\pi}}      {1+\\frac{e^{-4\\pi}}        {1+\\frac{e^{-6\\pi}}          {1+\\frac{e^{-8\\pi}}            {1+\\ldots} } } }">
    <msup data-latex="e^{-2\\pi}">
      <mi data-latex="e">e</mi>
      <mrow data-mjx-texclass="ORD" data-latex="{-2\\pi}">
        <mo data-latex="-">&#x2212;</mo>
        <mn data-latex="2">2</mn>
        <mi data-latex="\\pi">&#x3C0;</mi>
      </mrow>
    </msup>
    <mrow data-latex="1+\\frac{e^{-4\\pi}}        {1+\\frac{e^{-6\\pi}}          {1+\\frac{e^{-8\\pi}}            {1+\\ldots} } } ">
      <mn data-latex="1">1</mn>
      <mo data-latex="+">+</mo>
      <mfrac data-latex="\\frac{e^{-4\\pi}}        {1+\\frac{e^{-6\\pi}}          {1+\\frac{e^{-8\\pi}}            {1+\\ldots} } }">
        <msup data-latex="e^{-4\\pi}">
          <mi data-latex="e">e</mi>
          <mrow data-mjx-texclass="ORD" data-latex="{-4\\pi}">
            <mo data-latex="-">&#x2212;</mo>
            <mn data-latex="4">4</mn>
            <mi data-latex="\\pi">&#x3C0;</mi>
          </mrow>
        </msup>
        <mrow data-latex="1+\\frac{e^{-6\\pi}}          {1+\\frac{e^{-8\\pi}}            {1+\\ldots} } ">
          <mn data-latex="1">1</mn>
          <mo data-latex="+">+</mo>
          <mfrac data-latex="\\frac{e^{-6\\pi}}          {1+\\frac{e^{-8\\pi}}            {1+\\ldots} }">
            <msup data-latex="e^{-6\\pi}">
              <mi data-latex="e">e</mi>
              <mrow data-mjx-texclass="ORD" data-latex="{-6\\pi}">
                <mo data-latex="-">&#x2212;</mo>
                <mn data-latex="6">6</mn>
                <mi data-latex="\\pi">&#x3C0;</mi>
              </mrow>
            </msup>
            <mrow data-latex="1+\\frac{e^{-8\\pi}}            {1+\\ldots} ">
              <mn data-latex="1">1</mn>
              <mo data-latex="+">+</mo>
              <mfrac data-latex="\\frac{e^{-8\\pi}}            {1+\\ldots}">
                <msup data-latex="e^{-8\\pi}">
                  <mi data-latex="e">e</mi>
                  <mrow data-mjx-texclass="ORD" data-latex="{-8\\pi}">
                    <mo data-latex="-">&#x2212;</mo>
                    <mn data-latex="8">8</mn>
                    <mi data-latex="\\pi">&#x3C0;</mi>
                  </mrow>
                </msup>
                <mrow data-latex="1+\\ldots">
                  <mn data-latex="1">1</mn>
                  <mo data-latex="+">+</mo>
                  <mo data-latex="\\ldots">&#x2026;</mo>
                </mrow>
              </mfrac>
            </mrow>
          </mfrac>
        </mrow>
      </mfrac>
    </mrow>
  </mfrac>
</math>`
    ));
  it('A Rogers-Ramanujan Identity', () =>
    toXmlMatch(
      tex2mml(
        '1 + \\frac{q^2}{(1-q)}  + \\frac{q^6}{(1-q)(1-q^2)} + \\cdots =\\prod_{j=0}^{\\infty}  \\frac{1}{(1-q^{5j+2})(1-q^{5j+3})},     \\quad\\quad \\text{for $|q|<1$}.'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="1 + \\frac{q^2}{(1-q)}  + \\frac{q^6}{(1-q)(1-q^2)} + \\cdots =\\prod_{j=0}^{\\infty}  \\frac{1}{(1-q^{5j+2})(1-q^{5j+3})},     \\quad\\quad \\text{for $|q|&lt;1$}." display="block">
  <mn data-latex="1">1</mn>
  <mo data-latex="+">+</mo>
  <mfrac data-latex="\\frac{q^2}{(1-q)}">
    <msup data-latex="q^2 ">
      <mi data-latex="q">q</mi>
      <mn data-latex="2">2</mn>
    </msup>
    <mrow data-latex="(1-q)">
      <mo data-latex="(" stretchy="false">(</mo>
      <mn data-latex="1">1</mn>
      <mo data-latex="-">&#x2212;</mo>
      <mi data-latex="q">q</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </mrow>
  </mfrac>
  <mo data-latex="+">+</mo>
  <mfrac data-latex="\\frac{q^6}{(1-q)(1-q^2)}">
    <msup data-latex="q^6 ">
      <mi data-latex="q">q</mi>
      <mn data-latex="6">6</mn>
    </msup>
    <mrow data-latex="(1-q)(1-q^2 )">
      <mo data-latex="(" stretchy="false">(</mo>
      <mn data-latex="1">1</mn>
      <mo data-latex="-">&#x2212;</mo>
      <mi data-latex="q">q</mi>
      <mo data-latex=")" stretchy="false">)</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mn data-latex="1">1</mn>
      <mo data-latex="-">&#x2212;</mo>
      <msup data-latex="q^2">
        <mi data-latex="q">q</mi>
        <mn data-latex="2">2</mn>
      </msup>
      <mo data-latex=")" stretchy="false">)</mo>
    </mrow>
  </mfrac>
  <mo data-latex="+">+</mo>
  <mo data-latex="\\cdots">&#x22EF;</mo>
  <mo data-latex="=">=</mo>
  <munderover data-latex="\\prod_{j=0}^{\\infty}">
    <mo data-latex="\\prod">&#x220F;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{j=0}">
      <mi data-latex="j">j</mi>
      <mo data-latex="=">=</mo>
      <mn data-latex="0">0</mn>
    </mrow>
    <mrow data-mjx-texclass="ORD" data-latex="{\\infty}">
      <mi mathvariant="normal" data-latex="\\infty">&#x221E;</mi>
    </mrow>
  </munderover>
  <mfrac data-latex="\\frac{1}{(1-q^{5j+2})(1-q^{5j+3})}">
    <mn data-latex="1">1</mn>
    <mrow data-latex="(1-q^{5j+2})(1-q^{5j+3})">
      <mo data-latex="(" stretchy="false">(</mo>
      <mn data-latex="1">1</mn>
      <mo data-latex="-">&#x2212;</mo>
      <msup data-latex="q^{5j+2}">
        <mi data-latex="q">q</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{5j+2}">
          <mn data-latex="5">5</mn>
          <mi data-latex="j">j</mi>
          <mo data-latex="+">+</mo>
          <mn data-latex="2">2</mn>
        </mrow>
      </msup>
      <mo data-latex=")" stretchy="false">)</mo>
      <mo data-latex="(" stretchy="false">(</mo>
      <mn data-latex="1">1</mn>
      <mo data-latex="-">&#x2212;</mo>
      <msup data-latex="q^{5j+3}">
        <mi data-latex="q">q</mi>
        <mrow data-mjx-texclass="ORD" data-latex="{5j+3}">
          <mn data-latex="5">5</mn>
          <mi data-latex="j">j</mi>
          <mo data-latex="+">+</mo>
          <mn data-latex="3">3</mn>
        </mrow>
      </msup>
      <mo data-latex=")" stretchy="false">)</mo>
    </mrow>
  </mfrac>
  <mo data-latex=",">,</mo>
  <mstyle scriptlevel="0" data-latex="\\quad">
    <mspace width="1em"></mspace>
  </mstyle>
  <mstyle scriptlevel="0" data-latex="\\quad">
    <mspace width="1em"></mspace>
  </mstyle>
  <mrow data-latex="\\text{for $|q|&lt;1$}">
    <mtext>for&#xA0;</mtext>
    <mrow data-mjx-texclass="ORD">
      <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
      <mi data-latex="q">q</mi>
      <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
      <mo data-latex="&lt;">&lt;</mo>
      <mn data-latex="1">1</mn>
    </mrow>
  </mrow>
  <mo data-latex=".">.</mo>
</math>`
    ));
  it('A Summation Formula', () =>
    toXmlMatch(
      tex2mml('\\sum_{n=1}^\\infty {1\\over n^2} = {\\pi^2\\over 6}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sum_{n=1}^\\infty {1\\over n^2} = {\\pi^2\\over 6}" display="block">
  <munderover data-latex="\\infty">
    <mo data-latex="\\sum">&#x2211;</mo>
    <mrow data-mjx-texclass="ORD" data-latex="{n=1}">
      <mi data-latex="n">n</mi>
      <mo data-latex="=">=</mo>
      <mn data-latex="1">1</mn>
    </mrow>
    <mi mathvariant="normal" data-latex="infty">&#x221E;</mi>
  </munderover>
  <mrow data-mjx-texclass="ORD" data-latex="{}">
    <mfrac data-latex-item="\\over">
      <mn data-latex="1">1</mn>
      <msup data-latex="n^2">
        <mi data-latex="n">n</mi>
        <mn data-latex="2">2</mn>
      </msup>
    </mfrac>
  </mrow>
  <mo data-latex="=">=</mo>
  <mrow data-mjx-texclass="ORD" data-latex="{}">
    <mfrac data-latex-item="\\over">
      <msup data-latex="\\pi^2">
        <mi data-latex="\\pi">&#x3C0;</mi>
        <mn data-latex="2">2</mn>
      </msup>
      <mn data-latex="6">6</mn>
    </mfrac>
  </mrow>
</math>`
    ));
  it('Cauchy Integral Formula', () =>
    toXmlMatch(
      tex2mml('f(a) = \\oint_\\gamma \\frac{f(z)}{z-a}dz'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="f(a) = \\oint_\\gamma \\frac{f(z)}{z-a}dz" display="block">
  <mi data-latex="f">f</mi>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="a">a</mi>
  <mo data-latex=")" stretchy="false">)</mo>
  <mo data-latex="=">=</mo>
  <msub data-latex="\\gamma">
    <mo data-latex="\\oint">&#x222E;</mo>
    <mi data-latex="gamma">&#x3B3;</mi>
  </msub>
  <mfrac data-latex="\\frac{f(z)}{z-a}">
    <mrow data-latex="f(z)">
      <mi data-latex="f">f</mi>
      <mo data-latex="(" stretchy="false">(</mo>
      <mi data-latex="z">z</mi>
      <mo data-latex=")" stretchy="false">)</mo>
    </mrow>
    <mrow data-latex="z-a">
      <mi data-latex="z">z</mi>
      <mo data-latex="-">&#x2212;</mo>
      <mi data-latex="a">a</mi>
    </mrow>
  </mfrac>
  <mi data-latex="d">d</mi>
  <mi data-latex="z">z</mi>
</math>`
    ));
  it('Standard Deviation', () =>
    toXmlMatch(
      tex2mml('\\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^N {(x_i-\\mu)}^2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^N {(x_i-\\mu)}^2}" display="block">
  <mi data-latex="\\sigma">&#x3C3;</mi>
  <mo data-latex="=">=</mo>
  <msqrt data-latex="\\sqrt{\\frac{1}{N}\\sum_{i=1}^N {(x_i-\\mu)}^2}">
    <mfrac data-latex="\\frac{1}{N}">
      <mn data-latex="1">1</mn>
      <mi data-latex="N">N</mi>
    </mfrac>
    <munderover data-latex="\\sum_{i=1}^N">
      <mo data-latex="\\sum">&#x2211;</mo>
      <mrow data-mjx-texclass="ORD" data-latex="{i=1}">
        <mi data-latex="i">i</mi>
        <mo data-latex="=">=</mo>
        <mn data-latex="1">1</mn>
      </mrow>
      <mi data-latex="N">N</mi>
    </munderover>
    <msup data-latex="{(x_i-\\mu)}^2">
      <mrow data-mjx-texclass="ORD" data-latex="{(x_i-\\mu)}">
        <mo data-latex="(" stretchy="false">(</mo>
        <msub data-latex="x_i">
          <mi data-latex="x">x</mi>
          <mi data-latex="i">i</mi>
        </msub>
        <mo data-latex="-">&#x2212;</mo>
        <mi data-latex="\\mu">&#x3BC;</mi>
        <mo data-latex=")" stretchy="false">)</mo>
      </mrow>
      <mn data-latex="2">2</mn>
    </msup>
  </msqrt>
</math>`
    ));
});

describe('Column Parser', () => {
  it('BadPreamToken', () =>
    toXmlMatch(
      tex2mml('\\begin{array}a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}a" display="block">
  <merror data-mjx-error="Illegal pream-token (a)">
    <mtext>Illegal pream-token (a)</mtext>
  </merror>
</math>`
    ));
});

describe('Environments', () => {
  it('Eqnarray', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}a&=&b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}a&amp;=&amp;b\\end{eqnarray}\" display=\"block\">
      <mtable displaystyle=\"true\" columnalign=\"right center left\" columnspacing=\"0em 0.278em\" rowspacing=\"3pt\" data-break-align=\"bottom middle top\" data-latex-item=\"{eqnarray}\" data-latex=\"\\begin{eqnarray}a&amp;=&amp;b\\end{eqnarray}\">
        <mtr>
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd>
            <mi></mi>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mstyle indentshift=\".7em\">
              <mi data-latex=\"b\">b</mi>
            </mstyle>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('Equation', () =>
    toXmlMatch(
      tex2mml('\\begin{equation}a=b\\end{equation}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{equation}a=b\\end{equation}\" display=\"block\">
      <mi data-latex=\"a\">a</mi>
      <mo data-latex=\"=\">=</mo>
      <mi data-latex=\"b\">b</mi>
    </math>`
    ));
  it('Displaymath', () =>
    toXmlMatch(
      tex2mml('\\begin{displaymath}a\\end{displaymath}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{displaymath}a\\end{displaymath}\" display=\"block\">
      <mi data-latex=\"\\begin{displaymath}a\\end{displaymath}\" data-latex-item=\"{displaymath}\">a</mi>
    </math>`
    ));
  it('math', () =>
    toXmlMatch(
      tex2mml('\\begin{math}a\\end{math}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{math}a\\end{math}\">
      <mi data-latex=\"\\begin{math}a\\end{math}\" data-latex-item=\"{math}\">a</mi>
    </math>`
    ));
  it('Array Center', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c}a\\end{array}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{array}{c}a\\end{array}\" display=\"block\">
      <mtable columnspacing=\"1em\" rowspacing=\"4pt\" data-frame-styles=\"\" framespacing=\".5em .125em\" data-latex-item=\"{array}\" data-latex=\"\\begin{array}{c}a\\end{array}\">
        <mtr data-latex-item=\"{c}\" data-latex=\"{c}\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('Array Center Lines', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c}a\\\\b\\end{array}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{array}{c}a\\\\b\\end{array}\" display=\"block\">
      <mtable columnspacing=\"1em\" rowspacing=\"4pt\" data-frame-styles=\"\" framespacing=\".5em .125em\" data-latex-item=\"{array}\" data-latex=\"\\begin{array}{c}a\\\\b\\end{array}\">
        <mtr data-latex-item=\"{c}\" data-latex=\"{c}\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
        </mtr>
        <mtr data-latex-item=\"{c}\" data-latex=\"{c}\">
          <mtd>
            <mi data-latex=\"b\">b</mi>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('Array RCL', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{rcl}a&=&b\\end{array}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{array}{rcl}a&amp;=&amp;b\\end{array}\" display=\"block\">
      <mtable columnspacing=\"1em\" rowspacing=\"4pt\" columnalign=\"right center left\" data-frame-styles=\"\" framespacing=\".5em .125em\" data-latex-item=\"{array}\" data-latex=\"\\begin{array}{rcl}a&amp;=&amp;b\\end{array}\">
        <mtr data-latex-item=\"{rcl}\" data-latex=\"{rcl}\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mi data-latex=\"b\">b</mi>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('Array RCL Lines', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{rcl}a&=&b\\\\c&=&d\\end{array}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{array}{rcl}a&amp;=&amp;b\\\\c&amp;=&amp;d\\end{array}\" display=\"block\">
      <mtable columnspacing=\"1em\" rowspacing=\"4pt\" columnalign=\"right center left\" data-frame-styles=\"\" framespacing=\".5em .125em\" data-latex-item=\"{array}\" data-latex=\"\\begin{array}{rcl}a&amp;=&amp;b\\\\c&amp;=&amp;d\\end{array}\">
        <mtr data-latex-item=\"{rcl}\" data-latex=\"{rcl}\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mi data-latex=\"b\">b</mi>
          </mtd>
        </mtr>
        <mtr data-latex-item=\"{rcl}\" data-latex=\"{rcl}\">
          <mtd>
            <mi data-latex=\"c\">c</mi>
          </mtd>
          <mtd>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mi data-latex=\"d\">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('Display Array Center', () =>
    toXmlMatch(
      tex2mml('\\begin{darray}{c}a\\end{darray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{darray}{c}a\\end{darray}\" display=\"block\">
      <mtable columnspacing=\"1em\" rowspacing=\"4pt\" displaystyle=\"true\" data-latex-item=\"{darray}\" data-latex=\"\\begin{darray}{c}a\\end{darray}\">
        <mtr data-latex-item=\"{c}\" data-latex=\"{c}\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('Display Array Center Lines', () =>
    toXmlMatch(
      tex2mml('\\begin{darray}{c}a\\\\b\\end{darray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{darray}{c}a\\\\b\\end{darray}\" display=\"block\">
      <mtable columnspacing=\"1em\" rowspacing=\"4pt\" displaystyle=\"true\" data-latex-item=\"{darray}\" data-latex=\"\\begin{darray}{c}a\\\\b\\end{darray}\">
        <mtr data-latex-item=\"{c}\" data-latex=\"{c}\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
        </mtr>
        <mtr data-latex-item=\"{c}\" data-latex=\"{c}\">
          <mtd>
            <mi data-latex=\"b\">b</mi>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('Display Array RCL', () =>
    toXmlMatch(
      tex2mml('\\begin{darray}{rcl}a&=&b\\end{darray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{darray}{rcl}a&amp;=&amp;b\\end{darray}\" display=\"block\">
      <mtable columnspacing=\"1em\" rowspacing=\"4pt\" columnalign=\"right center left\" displaystyle=\"true\" data-latex-item=\"{darray}\" data-latex=\"\\begin{darray}{rcl}a&amp;=&amp;b\\end{darray}\">
        <mtr data-latex-item=\"{rcl}\" data-latex=\"{rcl}\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mi data-latex=\"b\">b</mi>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('Display Array RCL Lines', () =>
    toXmlMatch(
      tex2mml('\\begin{darray}{rcl}a&=&b\\\\c&=&d\\end{darray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{darray}{rcl}a&amp;=&amp;b\\\\c&amp;=&amp;d\\end{darray}\" display=\"block\">
      <mtable columnspacing=\"1em\" rowspacing=\"4pt\" columnalign=\"right center left\" displaystyle=\"true\" data-latex-item=\"{darray}\" data-latex=\"\\begin{darray}{rcl}a&amp;=&amp;b\\\\c&amp;=&amp;d\\end{darray}\">
        <mtr data-latex-item=\"{rcl}\" data-latex=\"{rcl}\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mi data-latex=\"b\">b</mi>
          </mtd>
        </mtr>
        <mtr data-latex-item=\"{rcl}\" data-latex=\"{rcl}\">
          <mtd>
            <mi data-latex=\"c\">c</mi>
          </mtd>
          <mtd>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mi data-latex=\"d\">d</mi>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('IndentAlign', () =>
    toXmlMatch(
      tex2mml('\\begin{indentalign}[10cm][20cm][30cm]{lcr}a\\end{indentalign}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{indentalign}[10cm][20cm][30cm]{lcr}a\\end{indentalign}\" display=\"block\">
      <mstyle indentshiftfirst=\"10cm\" indentshift=\"20cm\" indentshiftlast=\"30cm\" indentalignfirst=\"left\" indentalign=\"center\" indentalignlast=\"right\" data-latex=\"\\begin{indentalign}[10cm][20cm][30cm]{lcr}a\\end{indentalign}\">
        <mi data-latex=\"a\">a</mi>
      </mstyle>
    </math>`
    ));
});

describe('Environment Errors', () => {
  it('IndentAlign BadAlignment', () =>
    toXmlMatch(
      tex2mml('\\begin{indentalign}[10cm][20cm][30cm]{lkr}a\\end{indentalign}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{indentalign}[10cm][20cm][30cm]{lkr}a\\end{indentalign}\" display=\"block\">
      <merror data-mjx-error=\"Alignment must be one to three copies of l, c, or r\">
        <mtext>Alignment must be one to three copies of l, c, or r</mtext>
      </merror>
    </math>`
    ));
  it('IndentAlign BadDimension', () =>
    toXmlMatch(
      tex2mml('\\begin{indentalign}[10cm][20cm][30]{lcr}a\\end{indentalign}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{indentalign}[10cm][20cm][30]{lcr}a\\end{indentalign}\" display=\"block\">
      <merror data-mjx-error=\"Bracket argument to \\begin{indentalign} must be a dimension\">
        <mtext>Bracket argument to \\begin{indentalign} must be a dimension</mtext>
      </merror>
    </math>`
    ));
  it('BreakAlign BadBreakAlign', () =>
    toXmlMatch(
      tex2mml('\\begin{indentalign}[10cm][20cm][30]{lcr}a\\end{indentalign}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{indentalign}[10cm][20cm][30]{lcr}a\\end{indentalign}\" display=\"block\">
      <merror data-mjx-error=\"Bracket argument to \\begin{indentalign} must be a dimension\">
        <mtext>Bracket argument to \\begin{indentalign} must be a dimension</mtext>
      </merror>
    </math>`
    ));
});

describe('BreakAlign', () => {
  it('BreakAlign Case c', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}\\breakAlign{c}{t}a&=&b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}\\breakAlign{c}{t}a&amp;=&amp;b\\end{eqnarray}\" display=\"block\">
      <mtable displaystyle=\"true\" columnalign=\"right center left\" columnspacing=\"0em 0.278em\" rowspacing=\"3pt\" data-break-align=\"bottom middle top\" data-latex-item=\"{eqnarray}\" data-latex=\"\\begin{eqnarray}\\breakAlign{c}{t}a&amp;=&amp;b\\end{eqnarray}\">
        <mtr>
          <mtd data-vertical-align=\"top\">
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd>
            <mi></mi>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mstyle indentshift=\".7em\">
              <mi data-latex=\"b\">b</mi>
            </mstyle>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('BreakAlign Case c second cell', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}a&\\breakAlign{c}{t}=&b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}a&amp;\\breakAlign{c}{t}=&amp;b\\end{eqnarray}\" display=\"block\">
      <mtable displaystyle=\"true\" columnalign=\"right center left\" columnspacing=\"0em 0.278em\" rowspacing=\"3pt\" data-break-align=\"bottom middle top\" data-latex-item=\"{eqnarray}\" data-latex=\"\\begin{eqnarray}a&amp;\\breakAlign{c}{t}=&amp;b\\end{eqnarray}\">
        <mtr>
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd data-vertical-align=\"top\">
            <mi></mi>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mstyle indentshift=\".7em\">
              <mi data-latex=\"b\">b</mi>
            </mstyle>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('BreakAlign Case r', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}\\breakAlign{r}{t}a&=&b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}\\breakAlign{r}{t}a&amp;=&amp;b\\end{eqnarray}\" display=\"block\">
      <mtable displaystyle=\"true\" columnalign=\"right center left\" columnspacing=\"0em 0.278em\" rowspacing=\"3pt\" data-break-align=\"bottom middle top\" data-latex-item=\"{eqnarray}\" data-latex=\"\\begin{eqnarray}\\breakAlign{r}{t}a&amp;=&amp;b\\end{eqnarray}\">
        <mtr data-break-align=\"top\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd>
            <mi></mi>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mstyle indentshift=\".7em\">
              <mi data-latex=\"b\">b</mi>
            </mstyle>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('BreakAlign Case r second row', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}\\breakAlign{r}{t}a&=&b\\\\\\breakAlign{r}{t}c&=&d\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}\\breakAlign{r}{t}a&amp;=&amp;b\\\\\\breakAlign{r}{t}c&amp;=&amp;d\\end{eqnarray}\" display=\"block\">
      <mtable displaystyle=\"true\" columnalign=\"right center left\" columnspacing=\"0em 0.278em\" rowspacing=\"3pt\" data-break-align=\"bottom middle top\" data-latex-item=\"{eqnarray}\" data-latex=\"\\begin{eqnarray}\\breakAlign{r}{t}a&amp;=&amp;b\\\\\\breakAlign{r}{t}c&amp;=&amp;d\\end{eqnarray}\">
        <mtr data-break-align=\"top\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd>
            <mi></mi>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mstyle indentshift=\".7em\">
              <mi data-latex=\"b\">b</mi>
            </mstyle>
          </mtd>
        </mtr>
        <mtr data-break-align=\"top\">
          <mtd>
            <mi data-latex=\"c\">c</mi>
          </mtd>
          <mtd>
            <mi></mi>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mstyle indentshift=\".7em\">
              <mi data-latex=\"d\">d</mi>
            </mstyle>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('BreakAlign Case r multi split', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}\\breakAlign{r}{tbmc}a&=&b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}\\breakAlign{r}{tbmc}a&amp;=&amp;b\\end{eqnarray}\" display=\"block\">
      <mtable displaystyle=\"true\" columnalign=\"right center left\" columnspacing=\"0em 0.278em\" rowspacing=\"3pt\" data-break-align=\"bottom middle top\" data-latex-item=\"{eqnarray}\" data-latex=\"\\begin{eqnarray}\\breakAlign{r}{tbmc}a&amp;=&amp;b\\end{eqnarray}\">
        <mtr data-break-align=\"top bottom middle center\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd>
            <mi></mi>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mstyle indentshift=\".7em\">
              <mi data-latex=\"b\">b</mi>
            </mstyle>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('BreakAlign Case t', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}\\breakAlign{t}{t}a&=&b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}\\breakAlign{t}{t}a&amp;=&amp;b\\end{eqnarray}\" display=\"block\">
      <mtable displaystyle=\"true\" columnalign=\"right center left\" columnspacing=\"0em 0.278em\" rowspacing=\"3pt\" data-latex-item=\"{eqnarray}\" data-latex=\"\\begin{eqnarray}\\breakAlign{t}{t}a&amp;=&amp;b\\end{eqnarray}\">
        <mtr>
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd>
            <mi></mi>
            <mo data-latex=\"=\">=</mo>
          </mtd>
          <mtd>
            <mstyle indentshift=\".7em\">
              <mi data-latex=\"b\">b</mi>
            </mstyle>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
});

describe('BreakAlign Errors', () => {
  it('BreakAlign Case c', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}a\\breakAlign{c}{t}&=&b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}a\\breakAlign{c}{t}&amp;=&amp;b\\end{eqnarray}\" display=\"block\">
      <merror data-mjx-error=\"\\breakAlign{c} must be at the beginning of an alignment entry\">
        <mtext>\\breakAlign{c} must be at the beginning of an alignment entry</mtext>
      </merror>
    </math>`
    ));
  it('BreakAlign Case c split', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}a\\breakAlign{c}{tb}&=&b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}a\\breakAlign{c}{tb}&amp;=&amp;b\\end{eqnarray}\" display=\"block\">
      <merror data-mjx-error=\"\\breakAlign{c} must be at the beginning of an alignment entry\">
        <mtext>\\breakAlign{c} must be at the beginning of an alignment entry</mtext>
      </merror>
    </math>`
    ));
  it('BreakAlign Case r', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}a&=&\\breakAlign{r}{t}b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}a&amp;=&amp;\\breakAlign{r}{t}b\\end{eqnarray}\" display=\"block\">
      <merror data-mjx-error=\"\\breakAlign{r} must be at the beginning of an alignment row\">
        <mtext>\\breakAlign{r} must be at the beginning of an alignment row</mtext>
      </merror>
    </math>`
    ));
  it('BreakAlign Case t', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}a&=&\\breakAlign{t}{t}b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}a&amp;=&amp;\\breakAlign{t}{t}b\\end{eqnarray}\" display=\"block\">
      <merror data-mjx-error=\"\\breakAlign{t} must be at the beginning of an alignment\">
        <mtext>\\breakAlign{t} must be at the beginning of an alignment</mtext>
      </merror>
    </math>`
    ));
  it('BreakAlign Case t second row', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}a&=&b\\\\\\breakAlign{t}{t}c&=&d\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}a&amp;=&amp;b\\\\\\breakAlign{t}{t}c&amp;=&amp;d\\end{eqnarray}\" display=\"block\">
      <merror data-mjx-error=\"\\breakAlign{t} must be at the beginning of an alignment\">
        <mtext>\\breakAlign{t} must be at the beginning of an alignment</mtext>
      </merror>
    </math>`
    ));
  it('BreakAlign Case t split', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}\\breakAlign{c}{tb}a&=&b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}\\breakAlign{c}{tb}a&amp;=&amp;b\\end{eqnarray}\" display=\"block\">
      <merror data-mjx-error=\"Too many alignment characters: tb\">
        <mtext>Too many alignment characters: tb</mtext>
      </merror>
    </math>`
    ));
  it('BreakAlign Case unknown', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}\\breakAlign{a}{t}a&=&b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}\\breakAlign{a}{t}a&amp;=&amp;b\\end{eqnarray}\" display=\"block\">
      <merror data-mjx-error=\"First argument to \\breakAlign must be one of c, r, or t\">
        <mtext>First argument to \\breakAlign must be one of c, r, or t</mtext>
      </merror>
    </math>`
    ));
  it('BreakAlign Case unknown split', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray}\\breakAlign{t}{a}a&=&b\\end{eqnarray}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{eqnarray}\\breakAlign{t}{a}a&amp;=&amp;b\\end{eqnarray}\" display=\"block\">
      <merror data-mjx-error=\"Invalid alignment character: a\">
        <mtext>Invalid alignment character: a</mtext>
      </merror>
    </math>`
    ));
});


describe('Setting sizes', () => {
  it('tiny', () =>
    toXmlMatch(
      tex2mml('\\tiny a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\tiny a\" display=\"block\">
      <mstyle mathsize=\"0.5em\" data-latex=\"\\tiny a\">
        <mi data-latex=\"a\">a</mi>
      </mstyle>
    </math>`
    ));
  it('Tiny', () =>
    toXmlMatch(
      tex2mml('\\Tiny a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Tiny a\" display=\"block\">
      <mstyle mathsize=\"0.6em\" data-latex=\"\\Tiny a\">
        <mi data-latex=\"a\">a</mi>
      </mstyle>
    </math>`
    ));
  it('scriptsize', () =>
    toXmlMatch(
      tex2mml('\\scriptsize a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\scriptsize a\" display=\"block\">
      <mstyle mathsize=\"0.7em\" data-latex=\"\\scriptsize a\">
        <mi data-latex=\"a\">a</mi>
      </mstyle>
    </math>`
    ));
  it('small', () =>
    toXmlMatch(
      tex2mml('\\small a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\small a\" display=\"block\">
      <mstyle mathsize=\"0.85em\" data-latex=\"\\small a\">
        <mi data-latex=\"a\">a</mi>
      </mstyle>
    </math>`
    ));
  it('normalsize', () =>
    toXmlMatch(
      tex2mml('\\normalsize a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\normalsize a\" display=\"block\">
      <mstyle mathsize=\"1em\" data-latex=\"\\normalsize a\">
        <mi data-latex=\"a\">a</mi>
      </mstyle>
    </math>`
    ));
  it('large', () =>
    toXmlMatch(
      tex2mml('\\large a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\large a\" display=\"block\">
      <mstyle mathsize=\"1.2em\" data-latex=\"\\large a\">
        <mi data-latex=\"a\">a</mi>
      </mstyle>
    </math>`
    ));
  it('Large', () =>
    toXmlMatch(
      tex2mml('\\Large a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Large a\" display=\"block\">
      <mstyle mathsize=\"1.44em\" data-latex=\"\\Large a\">
        <mi data-latex=\"a\">a</mi>
      </mstyle>
    </math>`
    ));
  it('LARGE', () =>
    toXmlMatch(
      tex2mml('\\LARGE a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\LARGE a\" display=\"block\">
      <mstyle mathsize=\"1.73em\" data-latex=\"\\LARGE a\">
        <mi data-latex=\"a\">a</mi>
      </mstyle>
    </math>`
    ));
  it('huge', () =>
    toXmlMatch(
      tex2mml('\\huge a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\huge a\" display=\"block\">
      <mstyle mathsize=\"2.07em\" data-latex=\"\\huge a\">
        <mi data-latex=\"a\">a</mi>
      </mstyle>
    </math>`
    ));
  it('Huge', () =>
    toXmlMatch(
      tex2mml('\\Huge a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Huge a\" display=\"block\">
      <mstyle mathsize=\"2.49em\" data-latex=\"\\Huge a\">
        <mi data-latex=\"a\">a</mi>
      </mstyle>
    </math>`
    ));
});

describe('Spaces', () => {
  it('spaces ,', () =>
    toXmlMatch(
      tex2mml('A\\,B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\,B" display="block">
  <mi data-latex="A">A</mi>
  <mstyle scriptlevel="0" data-latex="\\,">
    <mspace width="0.167em"></mspace>
  </mstyle>
  <mi data-latex="B">B</mi>
</math>`
    ));
  it('spaces :', () =>
    toXmlMatch(
      tex2mml('A\\:B'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"A\\:B\" display=\"block\">
      <mi data-latex=\"A\">A</mi>
      <mstyle scriptlevel=\"0\" data-latex=\"\\:\">
        <mspace width=\"0.222em\"></mspace>
      </mstyle>
      <mi data-latex=\"B\">B</mi>
    </math>`
    ));
  it('spaces >', () =>
    toXmlMatch(
      tex2mml('A\\>B'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"A\\&gt;B\" display=\"block\">
      <mi data-latex=\"A\">A</mi>
      <mstyle scriptlevel=\"0\" data-latex=\"\\&gt;\">
        <mspace width=\"0.222em\"></mspace>
      </mstyle>
      <mi data-latex=\"B\">B</mi>
    </math>`
    ));
  it('spaces ;', () =>
    toXmlMatch(
      tex2mml('A\\;B'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"A\\;B\" display=\"block\">
      <mi data-latex=\"A\">A</mi>
      <mstyle scriptlevel=\"0\" data-latex=\"\\;\">
        <mspace width=\"0.278em\"></mspace>
      </mstyle>
      <mi data-latex=\"B\">B</mi>
    </math>`
    ));
  it('spaces !', () =>
    toXmlMatch(
      tex2mml('A\\!B'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"A\\!B\" display=\"block\">
      <mi data-latex=\"A\">A</mi>
      <mstyle scriptlevel=\"0\" data-latex=\"\\!\">
        <mspace width=\"-0.167em\"></mspace>
      </mstyle>
      <mi data-latex=\"B\">B</mi>
    </math>`
    ));
  it('spaces quad', () =>
    toXmlMatch(
      tex2mml('A\\quad B'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"A\\quad B\" display=\"block\">
      <mi data-latex=\"A\">A</mi>
      <mstyle scriptlevel=\"0\" data-latex=\"\\quad\">
        <mspace width=\"1em\"></mspace>
      </mstyle>
      <mi data-latex=\"B\">B</mi>
    </math>`
    ));
  it('spaces qquad', () =>
    toXmlMatch(
      tex2mml('A\\qquad B'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"A\\qquad B\" display=\"block\">
      <mi data-latex=\"A\">A</mi>
      <mstyle scriptlevel=\"0\" data-latex=\"\\qquad\">
        <mspace width=\"2em\"></mspace>
      </mstyle>
      <mi data-latex=\"B\">B</mi>
    </math>`
    ));
  it('spaces enspace', () =>
    toXmlMatch(
      tex2mml('A\\enspace B'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"A\\enspace B\" display=\"block\">
      <mi data-latex=\"A\">A</mi>
      <mstyle scriptlevel=\"0\" data-latex=\"\\enspace\">
        <mspace width=\"0.5em\"></mspace>
      </mstyle>
      <mi data-latex=\"B\">B</mi>
    </math>`
    ));
  it('spaces thinspace', () =>
    toXmlMatch(
      tex2mml('A\\thinspace B'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"A\\thinspace B\" display=\"block\">
      <mi data-latex=\"A\">A</mi>
      <mstyle scriptlevel=\"0\" data-latex=\"\\thinspace\">
        <mspace width=\"0.167em\"></mspace>
      </mstyle>
      <mi data-latex=\"B\">B</mi>
    </math>`
    ));
  it('spaces negthinspace', () =>
    toXmlMatch(
      tex2mml('A\\negthinspace B'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"A\\negthinspace B\" display=\"block\">
      <mi data-latex=\"A\">A</mi>
      <mstyle scriptlevel=\"0\" data-latex=\"\\negthinspace\">
        <mspace width=\"-0.167em\"></mspace>
      </mstyle>
      <mi data-latex=\"B\">B</mi>
    </math>`
    ));
  it('Hfil', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{cc}a&\\hfil b\\\\d&ccc\\end{array}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{array}{cc}a&amp;\\hfil b\\\\d&amp;ccc\\end{array}\" display=\"block\">
      <mtable columnspacing=\"1em\" rowspacing=\"4pt\" columnalign=\"center center\" data-frame-styles=\"\" framespacing=\".5em .125em\" data-latex-item=\"{array}\" data-latex=\"\\begin{array}{cc}a&amp;\\hfil b\\\\d&amp;ccc\\end{array}\">
        <mtr data-latex-item=\"{cc}\" data-latex=\"{cc}\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd columnalign=\"right\">
            <mi data-latex=\"b\">b</mi>
          </mtd>
        </mtr>
        <mtr data-latex-item=\"{cc}\" data-latex=\"{cc}\">
          <mtd>
            <mi data-latex=\"d\">d</mi>
          </mtd>
          <mtd>
            <mi data-latex=\"c\">c</mi>
            <mi data-latex=\"c\">c</mi>
            <mi data-latex=\"c\">c</mi>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('Hfill', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{cc}a&\\hfill b\\\\d&ccc\\end{array}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{array}{cc}a&amp;\\hfill b\\\\d&amp;ccc\\end{array}\" display=\"block\">
      <mtable columnspacing=\"1em\" rowspacing=\"4pt\" columnalign=\"center center\" data-frame-styles=\"\" framespacing=\".5em .125em\" data-latex-item=\"{array}\" data-latex=\"\\begin{array}{cc}a&amp;\\hfill b\\\\d&amp;ccc\\end{array}\">
        <mtr data-latex-item=\"{cc}\" data-latex=\"{cc}\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd columnalign=\"right\">
            <mi data-latex=\"b\">b</mi>
          </mtd>
        </mtr>
        <mtr data-latex-item=\"{cc}\" data-latex=\"{cc}\">
          <mtd>
            <mi data-latex=\"d\">d</mi>
          </mtd>
          <mtd>
            <mi data-latex=\"c\">c</mi>
            <mi data-latex=\"c\">c</mi>
            <mi data-latex=\"c\">c</mi>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
  it('Hfilll', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{cc}a&\\hfilll b\\\\d&ccc\\end{array}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{array}{cc}a&amp;\\hfilll b\\\\d&amp;ccc\\end{array}\" display=\"block\">
      <mtable columnspacing=\"1em\" rowspacing=\"4pt\" columnalign=\"center center\" data-frame-styles=\"\" framespacing=\".5em .125em\" data-latex-item=\"{array}\" data-latex=\"\\begin{array}{cc}a&amp;\\hfilll b\\\\d&amp;ccc\\end{array}\">
        <mtr data-latex-item=\"{cc}\" data-latex=\"{cc}\">
          <mtd>
            <mi data-latex=\"a\">a</mi>
          </mtd>
          <mtd columnalign=\"right\">
            <mi data-latex=\"b\">b</mi>
          </mtd>
        </mtr>
        <mtr data-latex-item=\"{cc}\" data-latex=\"{cc}\">
          <mtd>
            <mi data-latex=\"d\">d</mi>
          </mtd>
          <mtd>
            <mi data-latex=\"c\">c</mi>
            <mi data-latex=\"c\">c</mi>
            <mi data-latex=\"c\">c</mi>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
});


describe('Delimiters', () => {
  it('<', () =>
    toXmlMatch(
      tex2mml('< a >'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"&lt; a &gt;\" display=\"block\">
      <mo data-latex=\"&lt;\">&lt;</mo>
      <mi data-latex=\"a\">a</mi>
      <mo data-latex=\"&gt;\">&gt;</mo>
    </math>`
    ));
  it('left right <', () =>
    toXmlMatch(
      tex2mml('\\left< a \\right>'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left&lt; a \\right&gt;\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left&lt; a \\right&gt;\" data-latex=\"\\left&lt; a \\right&gt;\">
        <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left&lt;\" data-latex=\"\\left&lt;\">&#x27E8;</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right&gt;\" data-latex=\"\\right&gt;\">&#x27E9;</mo>
      </mrow>
    </math>`
    ));
  it('lt', () =>
    toXmlMatch(
      tex2mml('\\lt a \\gt'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\lt a \\gt\" display=\"block\">
      <mo data-latex=\"\\lt\">&lt;</mo>
      <mi data-latex=\"a\">a</mi>
      <mo data-latex=\"\\gt\">&gt;</mo>
    </math>`
    ));
  it('left right lt', () =>
    toXmlMatch(
      tex2mml('\\left\\lt a \\right\\gt'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\lt a \\right\\gt\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\lt a \\right\\gt\" data-latex=\"\\left\\lt a \\right\\gt\">
        <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left\\lt \" data-latex=\"\\left\\lt \">&#x27E8;</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right\\gt\" data-latex=\"\\right\\gt\">&#x27E9;</mo>
      </mrow>
    </math>`
    ));
  it('/', () =>
    toXmlMatch(
      tex2mml('/ a \\\\'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"/ a \\\\\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\">
        <mo data-latex=\"/\">/</mo>
      </mrow>
      <mi data-latex=\"a\">a</mi>
      <mspace linebreak=\"newline\" data-latex=\"\\\\\"></mspace>
    </math>`
    ));
  it('left right /', () =>
    toXmlMatch(
      tex2mml('\\left/ a \\right\\\\'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left/ a \\right\\\\\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left/ a \\right\\\\\" data-latex=\"\\left/ a \\right\\\\\">
        <mo data-mjx-texclass=\"OPEN\" fence=\"true\" stretchy=\"true\" symmetric=\"true\" data-latex-item=\"\\left/\" data-latex=\"\\left/\">/</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" fence=\"true\" stretchy=\"true\" symmetric=\"true\" data-latex-item=\"\\right\\\\\" data-latex=\"\\right\\\\\">\\</mo>
      </mrow>
    </math>`
    ));
  it('lmoustache', () =>
    toXmlMatch(
      tex2mml('\\lmoustache a \\rmoustache'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\lmoustache a \\rmoustache\" display=\"block\">
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\lmoustache\">&#x23B0;</mo>
      <mi data-latex=\"a\">a</mi>
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\rmoustache\">&#x23B1;</mo>
    </math>`
    ));
  it('left right lmoustache', () =>
    toXmlMatch(
      tex2mml('\\left\\lmoustache a \\right\\rmoustache'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\lmoustache a \\right\\rmoustache\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\lmoustache a \\right\\rmoustache\" data-latex=\"\\left\\lmoustache a \\right\\rmoustache\">
        <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left\\lmoustache \" data-latex=\"\\left\\lmoustache \">&#x23B0;</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right\\rmoustache\" data-latex=\"\\right\\rmoustache\">&#x23B1;</mo>
      </mrow>
    </math>`
    ));
  it('lgroup', () =>
    toXmlMatch(
      tex2mml('\\lgroup a \\rgroup'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\lgroup a \\rgroup\" display=\"block\">
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\lgroup\">&#x27EE;</mo>
      <mi data-latex=\"a\">a</mi>
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\rgroup\">&#x27EF;</mo>
    </math>`
    ));
  it('left right lgroup', () =>
    toXmlMatch(
      tex2mml('\\left\\lgroup a \\right\\rgroup'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\lgroup a \\right\\rgroup\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\lgroup a \\right\\rgroup\" data-latex=\"\\left\\lgroup a \\right\\rgroup\">
        <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left\\lgroup \" data-latex=\"\\left\\lgroup \">&#x27EE;</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right\\rgroup\" data-latex=\"\\right\\rgroup\">&#x27EF;</mo>
      </mrow>
    </math>`
    ));
  it('arrowvert', () =>
    toXmlMatch(
      tex2mml('\\arrowvert a \\Arrowvert'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\arrowvert a \\Arrowvert\" display=\"block\">
      <mo data-latex=\"\\arrowvert\">&#x23D0;</mo>
      <mi data-latex=\"a\">a</mi>
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\Arrowvert\">&#x2016;</mo>
    </math>`
    ));
  it('left right arrowvert', () =>
    toXmlMatch(
      tex2mml('\\left\\arrowvert a \\right\\Arrowvert'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\arrowvert a \\right\\Arrowvert\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\arrowvert a \\right\\Arrowvert\" data-latex=\"\\left\\arrowvert a \\right\\Arrowvert\">
        <mo data-mjx-texclass=\"OPEN\" fence=\"true\" stretchy=\"true\" symmetric=\"true\" data-latex-item=\"\\left\\arrowvert \" data-latex=\"\\left\\arrowvert \">&#x23D0;</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" symmetric=\"true\" data-latex-item=\"\\right\\Arrowvert\" data-latex=\"\\right\\Arrowvert\">&#x2016;</mo>
      </mrow>
    </math>`
    ));
  it('bracevert', () =>
    toXmlMatch(
      tex2mml('\\bracevert a \\Vert'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bracevert a \\Vert\" display=\"block\">
      <mo data-latex=\"\\bracevert\">&#x23AA;</mo>
      <mi data-latex=\"a\">a</mi>
      <mo data-mjx-texclass=\"ORD\" fence=\"false\" stretchy=\"false\" data-latex=\"\\Vert\">&#x2016;</mo>
    </math>`
    ));
  it('left right bracevert', () =>
    toXmlMatch(
      tex2mml('\\left\\bracevert a \\right\\Vert'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\bracevert a \\right\\Vert\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\bracevert a \\right\\Vert\" data-latex=\"\\left\\bracevert a \\right\\Vert\">
        <mo data-mjx-texclass=\"OPEN\" fence=\"true\" stretchy=\"true\" symmetric=\"true\" data-latex-item=\"\\left\\bracevert \" data-latex=\"\\left\\bracevert \">&#x23AA;</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" symmetric=\"true\" data-latex-item=\"\\right\\Vert\" data-latex=\"\\right\\Vert\">&#x2016;</mo>
      </mrow>
    </math>`
    ));
  it('updownarrow', () =>
    toXmlMatch(
      tex2mml('\\updownarrow a \\Updownarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\updownarrow a \\Updownarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\updownarrow\">&#x2195;</mo>
      <mi data-latex=\"a\">a</mi>
      <mo stretchy=\"false\" data-latex=\"\\Updownarrow\">&#x21D5;</mo>
    </math>`
    ));
  it('left right updownarrow', () =>
    toXmlMatch(
      tex2mml('\\left\\updownarrow a \\right\\Updownarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\updownarrow a \\right\\Updownarrow\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\updownarrow a \\right\\Updownarrow\" data-latex=\"\\left\\updownarrow a \\right\\Updownarrow\">
        <mo data-mjx-texclass=\"OPEN\" fence=\"true\" symmetric=\"true\" data-latex-item=\"\\left\\updownarrow \" data-latex=\"\\left\\updownarrow \">&#x2195;</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" fence=\"true\" symmetric=\"true\" data-latex-item=\"\\right\\Updownarrow\" data-latex=\"\\right\\Updownarrow\">&#x21D5;</mo>
      </mrow>
    </math>`
    ));
  it('backslash', () =>
    toXmlMatch(
      tex2mml('/ a \\backslash'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"/ a \\backslash\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\">
        <mo data-latex=\"/\">/</mo>
      </mrow>
      <mi data-latex=\"a\">a</mi>
      <mi mathvariant=\"normal\" data-latex=\"\\backslash\">\\</mi>
    </math>`
    ));
  it('left right left/', () =>
    toXmlMatch(
      tex2mml('\\left/ a \\right\\backslash'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left/ a \\right\\backslash\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left/ a \\right\\backslash\" data-latex=\"\\left/ a \\right\\backslash\">
        <mo data-mjx-texclass=\"OPEN\" fence=\"true\" stretchy=\"true\" symmetric=\"true\" data-latex-item=\"\\left/\" data-latex=\"\\left/\">/</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" fence=\"true\" stretchy=\"true\" symmetric=\"true\" data-latex-item=\"\\right\\backslash\" data-latex=\"\\right\\backslash\">\\</mo>
      </mrow>
    </math>`
    ));
  it('Uparrow', () =>
    toXmlMatch(
      tex2mml('\\Uparrow a \\Downarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Uparrow a \\Downarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\Uparrow\">&#x21D1;</mo>
      <mi data-latex=\"a\">a</mi>
      <mo stretchy=\"false\" data-latex=\"\\Downarrow\">&#x21D3;</mo>
    </math>`
    ));
  it('left right Uparrow', () =>
    toXmlMatch(
      tex2mml('\\left\\Uparrow a \\right\\Downarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\Uparrow a \\right\\Downarrow\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\Uparrow a \\right\\Downarrow\" data-latex=\"\\left\\Uparrow a \\right\\Downarrow\">
        <mo data-mjx-texclass=\"OPEN\" fence=\"true\" symmetric=\"true\" data-latex-item=\"\\left\\Uparrow \" data-latex=\"\\left\\Uparrow \">&#x21D1;</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" fence=\"true\" symmetric=\"true\" data-latex-item=\"\\right\\Downarrow\" data-latex=\"\\right\\Downarrow\">&#x21D3;</mo>
      </mrow>
    </math>`
    ));
  it('rangle', () =>
    toXmlMatch(
      tex2mml('\\rangle a \\langle'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\rangle a \\langle\" display=\"block\">
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\rangle\">&#x27E9;</mo>
      <mi data-latex=\"a\">a</mi>
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\langle\">&#x27E8;</mo>
    </math>`
    ));
  it('left right rangle', () =>
    toXmlMatch(
      tex2mml('\\left\\rangle a \\right\\langle'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\rangle a \\right\\langle\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\rangle a \\right\\langle\" data-latex=\"\\left\\rangle a \\right\\langle\">
        <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left\\rangle \" data-latex=\"\\left\\rangle \">&#x27E9;</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right\\langle\" data-latex=\"\\right\\langle\">&#x27E8;</mo>
      </mrow>
    </math>`
    ));
  it('rbrace', () =>
    toXmlMatch(
      tex2mml('\\rbrace a \\lbrace'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\rbrace a \\lbrace\" display=\"block\">
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\rbrace\">}</mo>
      <mi data-latex=\"a\">a</mi>
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\lbrace\">{</mo>
    </math>`
    ));
  it('left right rbrace', () =>
    toXmlMatch(
      tex2mml('\\left\\rbrace a \\right\\lbrace'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\rbrace a \\right\\lbrace\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\rbrace a \\right\\lbrace\" data-latex=\"\\left\\rbrace a \\right\\lbrace\">
        <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left\\rbrace \" data-latex=\"\\left\\rbrace \">}</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right\\lbrace\" data-latex=\"\\right\\lbrace\">{</mo>
      </mrow>
    </math>`
    ));
  it('rceil', () =>
    toXmlMatch(
      tex2mml('\\rceil a \\lceil'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\rceil a \\lceil\" display=\"block\">
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\rceil\">&#x2309;</mo>
      <mi data-latex=\"a\">a</mi>
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\lceil\">&#x2308;</mo>
    </math>`
    ));
  it('left right rceil', () =>
    toXmlMatch(
      tex2mml('\\left\\rceil a \\right\\lceil'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\rceil a \\right\\lceil\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\rceil a \\right\\lceil\" data-latex=\"\\left\\rceil a \\right\\lceil\">
        <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left\\rceil \" data-latex=\"\\left\\rceil \">&#x2309;</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right\\lceil\" data-latex=\"\\right\\lceil\">&#x2308;</mo>
      </mrow>
    </math>`
    ));
  it('rfloor', () =>
    toXmlMatch(
      tex2mml('\\rfloor a \\lfloor'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\rfloor a \\lfloor\" display=\"block\">
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\rfloor\">&#x230B;</mo>
      <mi data-latex=\"a\">a</mi>
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\lfloor\">&#x230A;</mo>
    </math>`
    ));
  it('left right rfloor', () =>
    toXmlMatch(
      tex2mml('\\left\\rfloor a \\right\\lfloor'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\rfloor a \\right\\lfloor\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\rfloor a \\right\\lfloor\" data-latex=\"\\left\\rfloor a \\right\\lfloor\">
        <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left\\rfloor \" data-latex=\"\\left\\rfloor \">&#x230B;</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right\\lfloor\" data-latex=\"\\right\\lfloor\">&#x230A;</mo>
      </mrow>
    </math>`
    ));
  it('lbrack', () =>
    toXmlMatch(
      tex2mml('\\lbrack a \\rbrack'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\lbrack a \\rbrack\" display=\"block\">
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\lbrack\">[</mo>
      <mi data-latex=\"a\">a</mi>
      <mo fence=\"false\" stretchy=\"false\" data-latex=\"\\rbrack\">]</mo>
    </math>`
    ));
  it('left right lbrack', () =>
    toXmlMatch(
      tex2mml('\\left\\lbrack a \\right\\rbrack'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\lbrack a \\right\\rbrack\" display=\"block\">
      <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\lbrack a \\right\\rbrack\" data-latex=\"\\left\\lbrack a \\right\\rbrack\">
        <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left\\lbrack \" data-latex=\"\\left\\lbrack \">[</mo>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right\\rbrack\" data-latex=\"\\right\\rbrack\">]</mo>
      </mrow>
    </math>`
    ));
});

describe('Named Functions', () => {
  it('Named Function Arg', () =>
    toXmlMatch(
      tex2mml('\\sin x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin x" display="block">
  <mi data-latex="\\sin">sin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="x">x</mi>
</math>`
    ));
  it('Named Function Parent Arg', () =>
    toXmlMatch(
      tex2mml('\\sin(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin(x)" display="block">
  <mi data-latex="\\sin">sin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo data-latex="(" stretchy="false">(</mo>
  <mi data-latex="x">x</mi>
  <mo data-latex=")" stretchy="false">)</mo>
</math>`
    ));
  it('Fn Pos Space', () =>
    toXmlMatch(
      tex2mml('\\sin\\quad x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin\\quad x" display="block">
  <mi data-latex="\\sin">sin</mi>
  <mstyle scriptlevel="0" data-latex="\\quad">
    <mspace width="1em"></mspace>
  </mstyle>
  <mi data-latex="x">x</mi>
</math>`
    ));
  it('Fn Neg Space', () =>
    toXmlMatch(
      tex2mml('\\sin\\! x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin\\! x" display="block">
  <mi data-latex="\\sin">sin</mi>
  <mstyle scriptlevel="0" data-latex="\\!">
    <mspace width="-0.167em"></mspace>
  </mstyle>
  <mi data-latex="x">x</mi>
</math>`
    ));
  it('Fn Stretchy', () =>
    toXmlMatch(
      tex2mml('\\sin \\left(\\right)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin \\left(\\right)" display="block">
  <mi data-latex="\\sin">sin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left(\\right)" data-latex="\\left(\\right)">
    <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
    <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
  </mrow>
</math>`
    ));
  it('Fn Operator', () =>
    toXmlMatch(
      tex2mml('\\sin +'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin +" display="block">
  <mi data-latex="\\sin">sin</mi>
  <mo data-latex="+">+</mo>
</math>`
    ));
  it('arcsin', () =>
    toXmlMatch(
      tex2mml('\\arcsin'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\arcsin\" display=\"block\">
      <mi data-latex=\"\\arcsin\">arcsin</mi>
    </math>`
    ));
  it('arccos', () =>
    toXmlMatch(
      tex2mml('\\arccos'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\arccos\" display=\"block\">
      <mi data-latex=\"\\arccos\">arccos</mi>
    </math>`
    ));
  it('arctan', () =>
    toXmlMatch(
      tex2mml('\\arctan'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\arctan\" display=\"block\">
      <mi data-latex=\"\\arctan\">arctan</mi>
    </math>`
    ));
  it('arg', () =>
    toXmlMatch(
      tex2mml('\\arg'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\arg\" display=\"block\">
      <mi data-latex=\"\\arg\">arg</mi>
    </math>`
    ));
  it('cos', () =>
    toXmlMatch(
      tex2mml('\\cos'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cos\" display=\"block\">
      <mi data-latex=\"\\cos\">cos</mi>
    </math>`
    ));
  it('cosh', () =>
    toXmlMatch(
      tex2mml('\\cosh'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cosh\" display=\"block\">
      <mi data-latex=\"\\cosh\">cosh</mi>
    </math>`
    ));
  it('cot', () =>
    toXmlMatch(
      tex2mml('\\cot'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cot\" display=\"block\">
      <mi data-latex=\"\\cot\">cot</mi>
    </math>`
    ));
  it('coth', () =>
    toXmlMatch(
      tex2mml('\\coth'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\coth\" display=\"block\">
      <mi data-latex=\"\\coth\">coth</mi>
    </math>`
    ));
  it('csc', () =>
    toXmlMatch(
      tex2mml('\\csc'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\csc\" display=\"block\">
      <mi data-latex=\"\\csc\">csc</mi>
    </math>`
    ));
  it('deg', () =>
    toXmlMatch(
      tex2mml('\\deg'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\deg\" display=\"block\">
      <mi data-latex=\"\\deg\">deg</mi>
    </math>`
    ));
  it('det', () =>
    toXmlMatch(
      tex2mml('\\det'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\det\" display=\"block\">
      <mo data-mjx-texclass=\"OP\" movablelimits=\"true\" data-latex=\"\\det\">det</mo>
    </math>`
    ));
  it('dim', () =>
    toXmlMatch(
      tex2mml('\\dim'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\dim\" display=\"block\">
      <mi data-latex=\"\\dim\">dim</mi>
    </math>`
    ));
  it('exp', () =>
    toXmlMatch(
      tex2mml('\\exp'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\exp\" display=\"block\">
      <mi data-latex=\"\\exp\">exp</mi>
    </math>`
    ));
  it('gcd', () =>
    toXmlMatch(
      tex2mml('\\gcd'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\gcd\" display=\"block\">
      <mo data-mjx-texclass=\"OP\" movablelimits=\"true\" data-latex=\"\\gcd\">gcd</mo>
    </math>`
    ));
  it('hom', () =>
    toXmlMatch(
      tex2mml('\\hom'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\hom\" display=\"block\">
      <mi data-latex=\"\\hom\">hom</mi>
    </math>`
    ));
  it('inf', () =>
    toXmlMatch(
      tex2mml('\\inf'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\inf\" display=\"block\">
      <mo data-mjx-texclass=\"OP\" movablelimits=\"true\" data-latex=\"\\inf\">inf</mo>
    </math>`
    ));
  it('ker', () =>
    toXmlMatch(
      tex2mml('\\ker'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ker\" display=\"block\">
      <mi data-latex=\"\\ker\">ker</mi>
    </math>`
    ));
  it('lg', () =>
    toXmlMatch(
      tex2mml('\\lg'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\lg\" display=\"block\">
      <mi data-latex=\"\\lg\">lg</mi>
    </math>`
    ));
  it('liminf', () =>
    toXmlMatch(
      tex2mml('\\liminf'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\liminf\" display=\"block\">
      <mo data-mjx-texclass=\"OP\" movablelimits=\"true\" data-latex=\"\\liminf\">lim&#x2006;inf</mo>
    </math>`
    ));
  it('limsup', () =>
    toXmlMatch(
      tex2mml('\\limsup'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\limsup\" display=\"block\">
      <mo data-mjx-texclass=\"OP\" movablelimits=\"true\" data-latex=\"\\limsup\">lim&#x2006;sup</mo>
    </math>`
    ));
  it('ln', () =>
    toXmlMatch(
      tex2mml('\\ln'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ln\" display=\"block\">
      <mi data-latex=\"\\ln\">ln</mi>
    </math>`
    ));
  it('log', () =>
    toXmlMatch(
      tex2mml('\\log'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\log\" display=\"block\">
      <mi data-latex=\"\\log\">log</mi>
    </math>`
    ));
  it('max', () =>
    toXmlMatch(
      tex2mml('\\max'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\max\" display=\"block\">
      <mo data-mjx-texclass=\"OP\" movablelimits=\"true\" data-latex=\"\\max\">max</mo>
    </math>`
    ));
  it('min', () =>
    toXmlMatch(
      tex2mml('\\min'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\min\" display=\"block\">
      <mo data-mjx-texclass=\"OP\" movablelimits=\"true\" data-latex=\"\\min\">min</mo>
    </math>`
    ));
  it('Pr', () =>
    toXmlMatch(
      tex2mml('\\Pr'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Pr\" display=\"block\">
      <mo data-mjx-texclass=\"OP\" movablelimits=\"true\" data-latex=\"\\Pr\">Pr</mo>
    </math>`
    ));
  it('sec', () =>
    toXmlMatch(
      tex2mml('\\sec'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sec\" display=\"block\">
      <mi data-latex=\"\\sec\">sec</mi>
    </math>`
    ));
  it('sinh', () =>
    toXmlMatch(
      tex2mml('\\sinh'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sinh\" display=\"block\">
      <mi data-latex=\"\\sinh\">sinh</mi>
    </math>`
    ));
  it('sup', () =>
    toXmlMatch(
      tex2mml('\\sup'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sup\" display=\"block\">
      <mo data-mjx-texclass=\"OP\" movablelimits=\"true\" data-latex=\"\\sup\">sup</mo>
    </math>`
    ));
  it('tan', () =>
    toXmlMatch(
      tex2mml('\\tan'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\tan\" display=\"block\">
      <mi data-latex=\"\\tan\">tan</mi>
    </math>`
    ));
  it('tanh', () =>
    toXmlMatch(
      tex2mml('\\tanh'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\tanh\" display=\"block\">
      <mi data-latex=\"\\tanh\">tanh</mi>
    </math>`
    ));
});

describe('Greek characters', () => {
  it('delta', () =>
    toXmlMatch(
      tex2mml('\\delta'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\delta\" display=\"block\">
      <mi data-latex=\"\\delta\">&#x3B4;</mi>
    </math>`
    ));
  it('epsilon', () =>
    toXmlMatch(
      tex2mml('\\epsilon'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\epsilon\" display=\"block\">
      <mi data-latex=\"\\epsilon\">&#x3F5;</mi>
    </math>`
    ));
  it('zeta', () =>
    toXmlMatch(
      tex2mml('\\zeta'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\zeta\" display=\"block\">
      <mi data-latex=\"\\zeta\">&#x3B6;</mi>
    </math>`
    ));
  it('eta', () =>
    toXmlMatch(
      tex2mml('\\eta'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\eta\" display=\"block\">
      <mi data-latex=\"\\eta\">&#x3B7;</mi>
    </math>`
    ));
  it('theta', () =>
    toXmlMatch(
      tex2mml('\\theta'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\theta\" display=\"block\">
      <mi data-latex=\"\\theta\">&#x3B8;</mi>
    </math>`
    ));
  it('iota', () =>
    toXmlMatch(
      tex2mml('\\iota'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\iota\" display=\"block\">
      <mi data-latex=\"\\iota\">&#x3B9;</mi>
    </math>`
    ));
  it('kappa', () =>
    toXmlMatch(
      tex2mml('\\kappa'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\kappa\" display=\"block\">
      <mi data-latex=\"\\kappa\">&#x3BA;</mi>
    </math>`
    ));
  it('lambda', () =>
    toXmlMatch(
      tex2mml('\\lambda'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\lambda\" display=\"block\">
      <mi data-latex=\"\\lambda\">&#x3BB;</mi>
    </math>`
    ));
  it('nu', () =>
    toXmlMatch(
      tex2mml('\\nu'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\nu\" display=\"block\">
      <mi data-latex=\"\\nu\">&#x3BD;</mi>
    </math>`
    ));
  it('xi', () =>
    toXmlMatch(
      tex2mml('\\xi'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\xi\" display=\"block\">
      <mi data-latex=\"\\xi\">&#x3BE;</mi>
    </math>`
    ));
  it('omicron', () =>
    toXmlMatch(
      tex2mml('\\omicron'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\omicron\" display=\"block\">
      <mi data-latex=\"\\omicron\">&#x3BF;</mi>
    </math>`
    ));
  it('rho', () =>
    toXmlMatch(
      tex2mml('\\rho'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\rho\" display=\"block\">
      <mi data-latex=\"\\rho\">&#x3C1;</mi>
    </math>`
    ));
  it('tau', () =>
    toXmlMatch(
      tex2mml('\\tau'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\tau\" display=\"block\">
      <mi data-latex=\"\\tau\">&#x3C4;</mi>
    </math>`
    ));
  it('upsilon', () =>
    toXmlMatch(
      tex2mml('\\upsilon'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\upsilon\" display=\"block\">
      <mi data-latex=\"\\upsilon\">&#x3C5;</mi>
    </math>`
    ));
  it('chi', () =>
    toXmlMatch(
      tex2mml('\\chi'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\chi\" display=\"block\">
      <mi data-latex=\"\\chi\">&#x3C7;</mi>
    </math>`
    ));
  it('psi', () =>
    toXmlMatch(
      tex2mml('\\psi'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\psi\" display=\"block\">
      <mi data-latex=\"\\psi\">&#x3C8;</mi>
    </math>`
    ));
  it('omega', () =>
    toXmlMatch(
      tex2mml('\\omega'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\omega\" display=\"block\">
      <mi data-latex=\"\\omega\">&#x3C9;</mi>
    </math>`
    ));
  it('varepsilon', () =>
    toXmlMatch(
      tex2mml('\\varepsilon'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\varepsilon\" display=\"block\">
      <mi data-latex=\"\\varepsilon\">&#x3B5;</mi>
    </math>`
    ));
  it('vartheta', () =>
    toXmlMatch(
      tex2mml('\\vartheta'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\vartheta\" display=\"block\">
      <mi data-latex=\"\\vartheta\">&#x3D1;</mi>
    </math>`
    ));
  it('varpi', () =>
    toXmlMatch(
      tex2mml('\\varpi'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\varpi\" display=\"block\">
      <mi data-latex=\"\\varpi\">&#x3D6;</mi>
    </math>`
    ));
  it('varrho', () =>
    toXmlMatch(
      tex2mml('\\varrho'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\varrho\" display=\"block\">
      <mi data-latex=\"\\varrho\">&#x3F1;</mi>
    </math>`
    ));
  it('varsigma', () =>
    toXmlMatch(
      tex2mml('\\varsigma'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\varsigma\" display=\"block\">
      <mi data-latex=\"\\varsigma\">&#x3C2;</mi>
    </math>`
    ));
  it('varphi', () =>
    toXmlMatch(
      tex2mml('\\varphi'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\varphi\" display=\"block\">
      <mi data-latex=\"\\varphi\">&#x3C6;</mi>
    </math>`
    ));
  it('Delta', () =>
    toXmlMatch(
      tex2mml('\\Delta'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Delta\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\Delta\">&#x394;</mi>
    </math>`
    ));
  it('Theta', () =>
    toXmlMatch(
      tex2mml('\\Theta'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Theta\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\Theta\">&#x398;</mi>
    </math>`
    ));
  it('Xi', () =>
    toXmlMatch(
      tex2mml('\\Xi'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Xi\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\Xi\">&#x39E;</mi>
    </math>`
    ));
  it('Pi', () =>
    toXmlMatch(
      tex2mml('\\Pi'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Pi\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\Pi\">&#x3A0;</mi>
    </math>`
    ));
  it('Sigma', () =>
    toXmlMatch(
      tex2mml('\\Sigma'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Sigma\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\Sigma\">&#x3A3;</mi>
    </math>`
    ));
  it('Phi', () =>
    toXmlMatch(
      tex2mml('\\Phi'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Phi\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\Phi\">&#x3A6;</mi>
    </math>`
    ));
  it('Psi', () =>
    toXmlMatch(
      tex2mml('\\Psi'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Psi\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\Psi\">&#x3A8;</mi>
    </math>`
    ));
});

describe('Mathchar0mi', () => {
  it('AA', () =>
    toXmlMatch(
      tex2mml('\\AA'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\AA\" display=\"block\">
      <mi data-latex=\"\\AA\">&#x212B;</mi>
    </math>`
    ));
  it('S', () =>
    toXmlMatch(
      tex2mml('\\S'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\S\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\S\">&#xA7;</mi>
    </math>`
    ));
  it('aleph', () =>
    toXmlMatch(
      tex2mml('\\aleph'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\aleph\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\aleph\">&#x2135;</mi>
    </math>`
    ));
  it('hbar', () =>
    toXmlMatch(
      tex2mml('\\hbar'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\hbar\" display=\"block\">
      <mi data-mjx-alternate=\"1\" data-latex=\"\\hbar\">&#x210F;</mi>
    </math>`
    ));
  it('imath', () =>
    toXmlMatch(
      tex2mml('\\imath'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\imath\" display=\"block\">
      <mi data-latex=\"\\imath\">&#x131;</mi>
    </math>`
    ));
  it('jmath', () =>
    toXmlMatch(
      tex2mml('\\jmath'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\jmath\" display=\"block\">
      <mi data-latex=\"\\jmath\">&#x237;</mi>
    </math>`
    ));
  it('ell', () =>
    toXmlMatch(
      tex2mml('\\ell'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ell\" display=\"block\">
      <mi data-latex=\"\\ell\">&#x2113;</mi>
    </math>`
    ));
  it('wp', () =>
    toXmlMatch(
      tex2mml('\\wp'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\wp\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\wp\">&#x2118;</mi>
    </math>`
    ));
  it('Re', () =>
    toXmlMatch(
      tex2mml('\\Re'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Re\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\Re\">&#x211C;</mi>
    </math>`
    ));
  it('Im', () =>
    toXmlMatch(
      tex2mml('\\Im'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Im\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\Im\">&#x2111;</mi>
    </math>`
    ));
  it('partial', () =>
    toXmlMatch(
      tex2mml('\\partial'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\partial\" display=\"block\">
      <mi data-latex=\"\\partial\">&#x2202;</mi>
    </math>`
    ));
  it('emptyset', () =>
    toXmlMatch(
      tex2mml('\\emptyset'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\emptyset\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\emptyset\">&#x2205;</mi>
    </math>`
    ));
  it('nabla', () =>
    toXmlMatch(
      tex2mml('\\nabla'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\nabla\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\nabla\">&#x2207;</mi>
    </math>`
    ));
  it('top', () =>
    toXmlMatch(
      tex2mml('\\top'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\top\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\top\">&#x22A4;</mi>
    </math>`
    ));
  it('bot', () =>
    toXmlMatch(
      tex2mml('\\bot'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bot\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\bot\">&#x22A5;</mi>
    </math>`
    ));
  it('angle', () =>
    toXmlMatch(
      tex2mml('\\angle'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\angle\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\angle\">&#x2220;</mi>
    </math>`
    ));
  it('triangle', () =>
    toXmlMatch(
      tex2mml('\\triangle'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\triangle\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\triangle\">&#x25B3;</mi>
    </math>`
    ));
  it('forall', () =>
    toXmlMatch(
      tex2mml('\\forall'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\forall\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\forall\">&#x2200;</mi>
    </math>`
    ));
  it('exists', () =>
    toXmlMatch(
      tex2mml('\\exists'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\exists\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\exists\">&#x2203;</mi>
    </math>`
    ));
  it('neg', () =>
    toXmlMatch(
      tex2mml('\\neg'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\neg\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\neg\">&#xAC;</mi>
    </math>`
    ));
  it('lnot', () =>
    toXmlMatch(
      tex2mml('\\lnot'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\lnot\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\lnot\">&#xAC;</mi>
    </math>`
    ));
  it('flat', () =>
    toXmlMatch(
      tex2mml('\\flat'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\flat\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\flat\">&#x266D;</mi>
    </math>`
    ));
  it('natural', () =>
    toXmlMatch(
      tex2mml('\\natural'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\natural\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\natural\">&#x266E;</mi>
    </math>`
    ));
  it('sharp', () =>
    toXmlMatch(
      tex2mml('\\sharp'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sharp\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\sharp\">&#x266F;</mi>
    </math>`
    ));
  it('clubsuit', () =>
    toXmlMatch(
      tex2mml('\\clubsuit'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\clubsuit\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\clubsuit\">&#x2663;</mi>
    </math>`
    ));
  it('diamondsuit', () =>
    toXmlMatch(
      tex2mml('\\diamondsuit'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\diamondsuit\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\diamondsuit\">&#x2662;</mi>
    </math>`
    ));
  it('heartsuit', () =>
    toXmlMatch(
      tex2mml('\\heartsuit'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\heartsuit\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\heartsuit\">&#x2661;</mi>
    </math>`
    ));
  it('spadesuit', () =>
    toXmlMatch(
      tex2mml('\\spadesuit'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\spadesuit\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\spadesuit\">&#x2660;</mi>
    </math>`
    ));
});

describe('Mathchar0mo', () => {
  it('surd', () =>
    toXmlMatch(
      tex2mml('\\surd'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\surd\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\">
        <mo stretchy=\"false\" data-latex=\"\\surd\">&#x221A;</mo>
      </mrow>
    </math>`
    ));
  it('coprod', () =>
    toXmlMatch(
      tex2mml('\\coprod'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\coprod\" display=\"block\">
      <mo data-latex=\"\\coprod\">&#x2210;</mo>
    </math>`
    ));
  it('bigvee', () =>
    toXmlMatch(
      tex2mml('\\bigvee'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bigvee\" display=\"block\">
      <mo data-latex=\"\\bigvee\">&#x22C1;</mo>
    </math>`
    ));
  it('bigwedge', () =>
    toXmlMatch(
      tex2mml('\\bigwedge'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bigwedge\" display=\"block\">
      <mo data-latex=\"\\bigwedge\">&#x22C0;</mo>
    </math>`
    ));
  it('biguplus', () =>
    toXmlMatch(
      tex2mml('\\biguplus'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\biguplus\" display=\"block\">
      <mo data-latex=\"\\biguplus\">&#x2A04;</mo>
    </math>`
    ));
  it('bigcap', () =>
    toXmlMatch(
      tex2mml('\\bigcap'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bigcap\" display=\"block\">
      <mo data-latex=\"\\bigcap\">&#x22C2;</mo>
    </math>`
    ));
  it('intop', () =>
    toXmlMatch(
      tex2mml('\\intop'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\intop\" display=\"block\">
      <mo movablelimits=\"true\" data-latex=\"\\intop\">&#x222B;</mo>
    </math>`
    ));
  it('iint', () =>
    toXmlMatch(
      tex2mml('\\iint'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\iint\" display=\"block\">
      <mo data-latex=\"\\iint\">&#x222C;</mo>
    </math>`
    ));
  it('iiint', () =>
    toXmlMatch(
      tex2mml('\\iiint'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\iiint\" display=\"block\">
      <mo data-latex=\"\\iiint\">&#x222D;</mo>
    </math>`
    ));
  it('bigotimes', () =>
    toXmlMatch(
      tex2mml('\\bigotimes'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bigotimes\" display=\"block\">
      <mo data-latex=\"\\bigotimes\">&#x2A02;</mo>
    </math>`
    ));
  it('bigoplus', () =>
    toXmlMatch(
      tex2mml('\\bigoplus'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bigoplus\" display=\"block\">
      <mo data-latex=\"\\bigoplus\">&#x2A01;</mo>
    </math>`
    ));
  it('bigodot', () =>
    toXmlMatch(
      tex2mml('\\bigodot'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bigodot\" display=\"block\">
      <mo data-latex=\"\\bigodot\">&#x2A00;</mo>
    </math>`
    ));
  it('ointop', () =>
    toXmlMatch(
      tex2mml('\\ointop'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ointop\" display=\"block\">
      <mo movablelimits=\"true\" data-latex=\"\\ointop\">&#x222E;</mo>
    </math>`
    ));
  it('oiint', () =>
    toXmlMatch(
      tex2mml('\\oiint'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\oiint\" display=\"block\">
      <mo data-latex=\"\\oiint\">&#x222F;</mo>
    </math>`
    ));
  it('oiiint', () =>
    toXmlMatch(
      tex2mml('\\oiiint'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\oiiint\" display=\"block\">
      <mo data-latex=\"\\oiiint\">&#x2230;</mo>
    </math>`
    ));
  it('bigsqcup', () =>
    toXmlMatch(
      tex2mml('\\bigsqcup'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bigsqcup\" display=\"block\">
      <mo data-latex=\"\\bigsqcup\">&#x2A06;</mo>
    </math>`
    ));
  it('smallint', () =>
    toXmlMatch(
      tex2mml('\\smallint'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\smallint\" display=\"block\">
      <mo largeop=\"false\" data-latex=\"\\smallint\">&#x222B;</mo>
    </math>`
    ));
  it('triangleleft', () =>
    toXmlMatch(
      tex2mml('\\triangleleft'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\triangleleft\" display=\"block\">
      <mo data-latex=\"\\triangleleft\">&#x25C3;</mo>
    </math>`
    ));
  it('triangleright', () =>
    toXmlMatch(
      tex2mml('\\triangleright'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\triangleright\" display=\"block\">
      <mo data-latex=\"\\triangleright\">&#x25B9;</mo>
    </math>`
    ));
  it('bigtriangleup', () =>
    toXmlMatch(
      tex2mml('\\bigtriangleup'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bigtriangleup\" display=\"block\">
      <mo data-latex=\"\\bigtriangleup\">&#x25B3;</mo>
    </math>`
    ));
  it('bigtriangledown', () =>
    toXmlMatch(
      tex2mml('\\bigtriangledown'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bigtriangledown\" display=\"block\">
      <mo data-latex=\"\\bigtriangledown\">&#x25BD;</mo>
    </math>`
    ));
  it('wedge', () =>
    toXmlMatch(
      tex2mml('\\wedge'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\wedge\" display=\"block\">
      <mo data-latex=\"\\wedge\">&#x2227;</mo>
    </math>`
    ));
  it('land', () =>
    toXmlMatch(
      tex2mml('\\land'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\land\" display=\"block\">
      <mo data-latex=\"\\land\">&#x2227;</mo>
    </math>`
    ));
  it('vee', () =>
    toXmlMatch(
      tex2mml('\\vee'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\vee\" display=\"block\">
      <mo data-latex=\"\\vee\">&#x2228;</mo>
    </math>`
    ));
  it('lor', () =>
    toXmlMatch(
      tex2mml('\\lor'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\lor\" display=\"block\">
      <mo data-latex=\"\\lor\">&#x2228;</mo>
    </math>`
    ));
  it('cap', () =>
    toXmlMatch(
      tex2mml('\\cap'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cap\" display=\"block\">
      <mo data-latex=\"\\cap\">&#x2229;</mo>
    </math>`
    ));
  it('cup', () =>
    toXmlMatch(
      tex2mml('\\cup'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cup\" display=\"block\">
      <mo data-latex=\"\\cup\">&#x222A;</mo>
    </math>`
    ));
  it('ddagger', () =>
    toXmlMatch(
      tex2mml('\\ddagger'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ddagger\" display=\"block\">
      <mo data-latex=\"\\ddagger\">&#x2021;</mo>
    </math>`
    ));
  it('dagger', () =>
    toXmlMatch(
      tex2mml('\\dagger'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\dagger\" display=\"block\">
      <mo data-latex=\"\\dagger\">&#x2020;</mo>
    </math>`
    ));
  it('sqcap', () =>
    toXmlMatch(
      tex2mml('\\sqcap'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sqcap\" display=\"block\">
      <mo data-latex=\"\\sqcap\">&#x2293;</mo>
    </math>`
    ));
  it('sqcup', () =>
    toXmlMatch(
      tex2mml('\\sqcup'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sqcup\" display=\"block\">
      <mo data-latex=\"\\sqcup\">&#x2294;</mo>
    </math>`
    ));
  it('uplus', () =>
    toXmlMatch(
      tex2mml('\\uplus'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\uplus\" display=\"block\">
      <mo data-latex=\"\\uplus\">&#x228E;</mo>
    </math>`
    ));
  it('amalg', () =>
    toXmlMatch(
      tex2mml('\\amalg'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\amalg\" display=\"block\">
      <mo data-latex=\"\\amalg\">&#x2A3F;</mo>
    </math>`
    ));
  it('diamond', () =>
    toXmlMatch(
      tex2mml('\\diamond'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\diamond\" display=\"block\">
      <mo data-latex=\"\\diamond\">&#x22C4;</mo>
    </math>`
    ));
  it('bullet', () =>
    toXmlMatch(
      tex2mml('\\bullet'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bullet\" display=\"block\">
      <mo data-latex=\"\\bullet\">&#x2219;</mo>
    </math>`
    ));
  it('wr', () =>
    toXmlMatch(
      tex2mml('\\wr'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\wr\" display=\"block\">
      <mo data-latex=\"\\wr\">&#x2240;</mo>
    </math>`
    ));
  it('div', () =>
    toXmlMatch(
      tex2mml('\\div'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\div\" display=\"block\">
      <mo data-latex=\"\\div\">&#xF7;</mo>
    </math>`
    ));
  it('odot', () =>
    toXmlMatch(
      tex2mml('\\odot'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\odot\" display=\"block\">
      <mo data-latex=\"\\odot\">&#x2299;</mo>
    </math>`
    ));
  it('oslash', () =>
    toXmlMatch(
      tex2mml('\\oslash'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\oslash\" display=\"block\">
      <mo data-latex=\"\\oslash\">&#x2298;</mo>
    </math>`
    ));
  it('otimes', () =>
    toXmlMatch(
      tex2mml('\\otimes'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\otimes\" display=\"block\">
      <mo data-latex=\"\\otimes\">&#x2297;</mo>
    </math>`
    ));
  it('ominus', () =>
    toXmlMatch(
      tex2mml('\\ominus'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ominus\" display=\"block\">
      <mo data-latex=\"\\ominus\">&#x2296;</mo>
    </math>`
    ));
  it('oplus', () =>
    toXmlMatch(
      tex2mml('\\oplus'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\oplus\" display=\"block\">
      <mo data-latex=\"\\oplus\">&#x2295;</mo>
    </math>`
    ));
  it('mp', () =>
    toXmlMatch(
      tex2mml('\\mp'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mp\" display=\"block\">
      <mo data-latex=\"\\mp\">&#x2213;</mo>
    </math>`
    ));
  it('circ', () =>
    toXmlMatch(
      tex2mml('\\circ'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\circ\" display=\"block\">
      <mo data-latex=\"\\circ\">&#x2218;</mo>
    </math>`
    ));
  it('bigcirc', () =>
    toXmlMatch(
      tex2mml('\\bigcirc'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bigcirc\" display=\"block\">
      <mo data-latex=\"\\bigcirc\">&#x25EF;</mo>
    </math>`
    ));
  it('setminus', () =>
    toXmlMatch(
      tex2mml('\\setminus'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\setminus\" display=\"block\">
      <mo data-latex=\"\\setminus\">&#x2216;</mo>
    </math>`
    ));
  it('cdot', () =>
    toXmlMatch(
      tex2mml('\\cdot'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cdot\" display=\"block\">
      <mo data-latex=\"\\cdot\">&#x22C5;</mo>
    </math>`
    ));
  it('ast', () =>
    toXmlMatch(
      tex2mml('\\ast'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ast\" display=\"block\">
      <mo data-latex=\"\\ast\">&#x2217;</mo>
    </math>`
    ));
  it('times', () =>
    toXmlMatch(
      tex2mml('\\times'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\times\" display=\"block\">
      <mo data-latex=\"\\times\">&#xD7;</mo>
    </math>`
    ));
  it('star', () =>
    toXmlMatch(
      tex2mml('\\star'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\star\" display=\"block\">
      <mo data-latex=\"\\star\">&#x22C6;</mo>
    </math>`
    ));
  it('propto', () =>
    toXmlMatch(
      tex2mml('\\propto'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\propto\" display=\"block\">
      <mo data-latex=\"\\propto\">&#x221D;</mo>
    </math>`
    ));
  it('sqsubseteq', () =>
    toXmlMatch(
      tex2mml('\\sqsubseteq'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sqsubseteq\" display=\"block\">
      <mo data-latex=\"\\sqsubseteq\">&#x2291;</mo>
    </math>`
    ));
  it('sqsupseteq', () =>
    toXmlMatch(
      tex2mml('\\sqsupseteq'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sqsupseteq\" display=\"block\">
      <mo data-latex=\"\\sqsupseteq\">&#x2292;</mo>
    </math>`
    ));
  it('parallel', () =>
    toXmlMatch(
      tex2mml('\\parallel'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\parallel\" display=\"block\">
      <mo data-latex=\"\\parallel\">&#x2225;</mo>
    </math>`
    ));
  it('mid', () =>
    toXmlMatch(
      tex2mml('\\mid'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mid\" display=\"block\">
      <mo data-latex=\"\\mid\">&#x2223;</mo>
    </math>`
    ));
  it('dashv', () =>
    toXmlMatch(
      tex2mml('\\dashv'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\dashv\" display=\"block\">
      <mo data-latex=\"\\dashv\">&#x22A3;</mo>
    </math>`
    ));
  it('vdash', () =>
    toXmlMatch(
      tex2mml('\\vdash'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\vdash\" display=\"block\">
      <mo data-latex=\"\\vdash\">&#x22A2;</mo>
    </math>`
    ));
  it('le', () =>
    toXmlMatch(
      tex2mml('\\le'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\le\" display=\"block\">
      <mo data-latex=\"\\le\">&#x2264;</mo>
    </math>`
    ));
  it('geq', () =>
    toXmlMatch(
      tex2mml('\\geq'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\geq\" display=\"block\">
      <mo data-latex=\"\\geq\">&#x2265;</mo>
    </math>`
    ));
  it('ge', () =>
    toXmlMatch(
      tex2mml('\\ge'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ge\" display=\"block\">
      <mo data-latex=\"\\ge\">&#x2265;</mo>
    </math>`
    ));
  it('succ', () =>
    toXmlMatch(
      tex2mml('\\succ'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\succ\" display=\"block\">
      <mo data-latex=\"\\succ\">&#x227B;</mo>
    </math>`
    ));
  it('prec', () =>
    toXmlMatch(
      tex2mml('\\prec'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\prec\" display=\"block\">
      <mo data-latex=\"\\prec\">&#x227A;</mo>
    </math>`
    ));
  it('approx', () =>
    toXmlMatch(
      tex2mml('\\approx'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\approx\" display=\"block\">
      <mo data-latex=\"\\approx\">&#x2248;</mo>
    </math>`
    ));
  it('succeq', () =>
    toXmlMatch(
      tex2mml('\\succeq'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\succeq\" display=\"block\">
      <mo data-latex=\"\\succeq\">&#x2AB0;</mo>
    </math>`
    ));
  it('preceq', () =>
    toXmlMatch(
      tex2mml('\\preceq'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\preceq\" display=\"block\">
      <mo data-latex=\"\\preceq\">&#x2AAF;</mo>
    </math>`
    ));
  it('supset', () =>
    toXmlMatch(
      tex2mml('\\supset'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\supset\" display=\"block\">
      <mo data-latex=\"\\supset\">&#x2283;</mo>
    </math>`
    ));
  it('subset', () =>
    toXmlMatch(
      tex2mml('\\subset'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\subset\" display=\"block\">
      <mo data-latex=\"\\subset\">&#x2282;</mo>
    </math>`
    ));
  it('supseteq', () =>
    toXmlMatch(
      tex2mml('\\supseteq'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\supseteq\" display=\"block\">
      <mo data-latex=\"\\supseteq\">&#x2287;</mo>
    </math>`
    ));
  it('subseteq', () =>
    toXmlMatch(
      tex2mml('\\subseteq'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\subseteq\" display=\"block\">
      <mo data-latex=\"\\subseteq\">&#x2286;</mo>
    </math>`
    ));
  it('in', () =>
    toXmlMatch(
      tex2mml('\\in'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\in\" display=\"block\">
      <mo data-latex=\"\\in\">&#x2208;</mo>
    </math>`
    ));
  it('ni', () =>
    toXmlMatch(
      tex2mml('\\ni'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ni\" display=\"block\">
      <mo data-latex=\"\\ni\">&#x220B;</mo>
    </math>`
    ));
  it('notin', () =>
    toXmlMatch(
      tex2mml('\\notin'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\notin\" display=\"block\">
      <mo data-latex=\"\\notin\">&#x2209;</mo>
    </math>`
    ));
  it('owns', () =>
    toXmlMatch(
      tex2mml('\\owns'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\owns\" display=\"block\">
      <mo data-latex=\"\\owns\">&#x220B;</mo>
    </math>`
    ));
  it('gg', () =>
    toXmlMatch(
      tex2mml('\\gg'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\gg\" display=\"block\">
      <mo data-latex=\"\\gg\">&#x226B;</mo>
    </math>`
    ));
  it('ll', () =>
    toXmlMatch(
      tex2mml('\\ll'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ll\" display=\"block\">
      <mo data-latex=\"\\ll\">&#x226A;</mo>
    </math>`
    ));
  it('perp', () =>
    toXmlMatch(
      tex2mml('\\perp'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\perp\" display=\"block\">
      <mo data-latex=\"\\perp\">&#x22A5;</mo>
    </math>`
    ));
  it('equiv', () =>
    toXmlMatch(
      tex2mml('\\equiv'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\equiv\" display=\"block\">
      <mo data-latex=\"\\equiv\">&#x2261;</mo>
    </math>`
    ));
  it('smile', () =>
    toXmlMatch(
      tex2mml('\\smile'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\smile\" display=\"block\">
      <mo data-latex=\"\\smile\">&#x2323;</mo>
    </math>`
    ));
  it('frown', () =>
    toXmlMatch(
      tex2mml('\\frown'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\frown\" display=\"block\">
      <mo data-latex=\"\\frown\">&#x2322;</mo>
    </math>`
    ));
  it('ne', () =>
    toXmlMatch(
      tex2mml('\\ne'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ne\" display=\"block\">
      <mo data-latex=\"\\ne\">&#x2260;</mo>
    </math>`
    ));
  it('neq', () =>
    toXmlMatch(
      tex2mml('\\neq'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\neq\" display=\"block\">
      <mo data-latex=\"\\neq\">&#x2260;</mo>
    </math>`
    ));
  it('doteq', () =>
    toXmlMatch(
      tex2mml('\\doteq'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\doteq\" display=\"block\">
      <mo data-latex=\"\\doteq\">&#x2250;</mo>
    </math>`
    ));
  it('bowtie', () =>
    toXmlMatch(
      tex2mml('\\bowtie'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bowtie\" display=\"block\">
      <mo data-latex=\"\\bowtie\">&#x22C8;</mo>
    </math>`
    ));
  it('models', () =>
    toXmlMatch(
      tex2mml('\\models'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\models\" display=\"block\">
      <mo data-latex=\"\\models\">&#x22A7;</mo>
    </math>`
    ));
  it('notChar', () =>
    toXmlMatch(
      tex2mml('\\notChar'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\notChar\" display=\"block\">
      <mo data-latex=\"\\notChar\">&#x29F8;</mo>
    </math>`
    ));
  it('Leftrightarrow', () =>
    toXmlMatch(
      tex2mml('\\Leftrightarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Leftrightarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\Leftrightarrow\">&#x21D4;</mo>
    </math>`
    ));
  it('Leftarrow', () =>
    toXmlMatch(
      tex2mml('\\Leftarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Leftarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\Leftarrow\">&#x21D0;</mo>
    </math>`
    ));
  it('leftrightarrow', () =>
    toXmlMatch(
      tex2mml('\\leftrightarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\leftrightarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\leftrightarrow\">&#x2194;</mo>
    </math>`
    ));
  it('leftarrow', () =>
    toXmlMatch(
      tex2mml('\\leftarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\leftarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\leftarrow\">&#x2190;</mo>
    </math>`
    ));
  it('gets', () =>
    toXmlMatch(
      tex2mml('\\gets'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\gets\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\gets\">&#x2190;</mo>
    </math>`
    ));
  it('to', () =>
    toXmlMatch(
      tex2mml('\\to'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\to\" display=\"block\">
      <mo accent=\"false\" stretchy=\"false\" data-latex=\"\\to\">&#x2192;</mo>
    </math>`
    ));
  it('mapsto', () =>
    toXmlMatch(
      tex2mml('\\mapsto'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mapsto\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\mapsto\">&#x21A6;</mo>
    </math>`
    ));
  it('leftharpoonup', () =>
    toXmlMatch(
      tex2mml('\\leftharpoonup'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\leftharpoonup\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\leftharpoonup\">&#x21BC;</mo>
    </math>`
    ));
  it('leftharpoondown', () =>
    toXmlMatch(
      tex2mml('\\leftharpoondown'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\leftharpoondown\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\leftharpoondown\">&#x21BD;</mo>
    </math>`
    ));
  it('rightharpoonup', () =>
    toXmlMatch(
      tex2mml('\\rightharpoonup'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\rightharpoonup\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\rightharpoonup\">&#x21C0;</mo>
    </math>`
    ));
  it('rightharpoondown', () =>
    toXmlMatch(
      tex2mml('\\rightharpoondown'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\rightharpoondown\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\rightharpoondown\">&#x21C1;</mo>
    </math>`
    ));
  it('nearrow', () =>
    toXmlMatch(
      tex2mml('\\nearrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\nearrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\nearrow\">&#x2197;</mo>
    </math>`
    ));
  it('searrow', () =>
    toXmlMatch(
      tex2mml('\\searrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\searrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\searrow\">&#x2198;</mo>
    </math>`
    ));
  it('nwarrow', () =>
    toXmlMatch(
      tex2mml('\\nwarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\nwarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\nwarrow\">&#x2196;</mo>
    </math>`
    ));
  it('swarrow', () =>
    toXmlMatch(
      tex2mml('\\swarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\swarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\swarrow\">&#x2199;</mo>
    </math>`
    ));
  it('rightleftharpoons', () =>
    toXmlMatch(
      tex2mml('\\rightleftharpoons'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\rightleftharpoons\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\rightleftharpoons\">&#x21CC;</mo>
    </math>`
    ));
  it('hookrightarrow', () =>
    toXmlMatch(
      tex2mml('\\hookrightarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\hookrightarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\hookrightarrow\">&#x21AA;</mo>
    </math>`
    ));
  it('hookleftarrow', () =>
    toXmlMatch(
      tex2mml('\\hookleftarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\hookleftarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\hookleftarrow\">&#x21A9;</mo>
    </math>`
    ));
  it('longleftarrow', () =>
    toXmlMatch(
      tex2mml('\\longleftarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\longleftarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\longleftarrow\">&#x27F5;</mo>
    </math>`
    ));
  it('Longleftarrow', () =>
    toXmlMatch(
      tex2mml('\\Longleftarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Longleftarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\Longleftarrow\">&#x27F8;</mo>
    </math>`
    ));
  it('Longrightarrow', () =>
    toXmlMatch(
      tex2mml('\\Longrightarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Longrightarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\Longrightarrow\">&#x27F9;</mo>
    </math>`
    ));
  it('Longleftrightarrow', () =>
    toXmlMatch(
      tex2mml('\\Longleftrightarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Longleftrightarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\Longleftrightarrow\">&#x27FA;</mo>
    </math>`
    ));
  it('longleftrightarrow', () =>
    toXmlMatch(
      tex2mml('\\longleftrightarrow'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\longleftrightarrow\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\longleftrightarrow\">&#x27F7;</mo>
    </math>`
    ));
  it('longmapsto', () =>
    toXmlMatch(
      tex2mml('\\longmapsto'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\longmapsto\" display=\"block\">
      <mo stretchy=\"false\" data-latex=\"\\longmapsto\">&#x27FC;</mo>
    </math>`
    ));
  it('vdots', () =>
    toXmlMatch(
      tex2mml('\\vdots'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\vdots\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\">
        <mo data-latex=\"\\vdots\">&#x22EE;</mo>
      </mrow>
    </math>`
    ));
  it('ddots', () =>
    toXmlMatch(
      tex2mml('\\ddots'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ddots\" display=\"block\">
      <mo data-latex=\"\\ddots\">&#x22F1;</mo>
    </math>`
    ));
  it('iddots', () =>
    toXmlMatch(
      tex2mml('\\iddots'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\iddots\" display=\"block\">
      <mo data-latex=\"\\iddots\">&#x22F0;</mo>
    </math>`
    ));
  it('dotsc', () =>
    toXmlMatch(
      tex2mml('\\dotsc'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\dotsc\" display=\"block\">
      <mo data-latex=\"\\dotsc\">&#x2026;</mo>
    </math>`
    ));
  it('dotsb', () =>
    toXmlMatch(
      tex2mml('\\dotsb'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\dotsb\" display=\"block\">
      <mo data-latex=\"\\dotsb\">&#x22EF;</mo>
    </math>`
    ));
  it('dotsm', () =>
    toXmlMatch(
      tex2mml('\\dotsm'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\dotsm\" display=\"block\">
      <mo data-latex=\"\\dotsm\">&#x22EF;</mo>
    </math>`
    ));
  it('dotsi', () =>
    toXmlMatch(
      tex2mml('\\dotsi'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\dotsi\" display=\"block\">
      <mo data-latex=\"\\dotsi\">&#x22EF;</mo>
    </math>`
    ));
  it('dotso', () =>
    toXmlMatch(
      tex2mml('\\dotso'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\dotso\" display=\"block\">
      <mo data-latex=\"\\dotso\">&#x2026;</mo>
    </math>`
    ));
  it('ldotp', () =>
    toXmlMatch(
      tex2mml('\\ldotp'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\ldotp\" display=\"block\">
      <mo data-mjx-texclass=\"PUNCT\" data-latex=\"\\ldotp\">.</mo>
    </math>`
    ));
  it('cdotp', () =>
    toXmlMatch(
      tex2mml('\\cdotp'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cdotp\" display=\"block\">
      <mo data-mjx-texclass=\"PUNCT\" data-latex=\"\\cdotp\">&#x22C5;</mo>
    </math>`
    ));
  it('colon', () =>
    toXmlMatch(
      tex2mml('\\colon'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\colon\" display=\"block\">
      <mo data-mjx-texclass=\"PUNCT\" data-latex=\"\\colon\">:</mo>
    </math>`
    ));
});

describe('Font Simple', () => {
  it('rm', () =>
    toXmlMatch(
      tex2mml('\\rm a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\rm a\" display=\"block\">
      <mi mathvariant=\"normal\" data-latex=\"\\rm a\">a</mi>
    </math>`
    ));
  it('mit', () =>
    toXmlMatch(
      tex2mml('\\mit a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mit a\" display=\"block\">
      <mi data-latex=\"\\mit a\">a</mi>
    </math>`
    ));
  it('oldstyle', () =>
    toXmlMatch(
      tex2mml('\\oldstyle 9'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\oldstyle 9\" display=\"block\">
      <mn data-mjx-variant=\"-tex-oldstyle\" mathvariant=\"normal\" data-latex=\"\\oldstyle 9\">9</mn>
    </math>`
    ));
  it('it', () =>
    toXmlMatch(
      tex2mml('\\it a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\it a\" display=\"block\">
      <mi data-mjx-variant=\"-tex-mathit\" mathvariant=\"italic\" data-latex=\"\\it a\">a</mi>
    </math>`
    ));
  it('bf', () =>
    toXmlMatch(
      tex2mml('\\bf a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bf a\" display=\"block\">
      <mi mathvariant=\"bold\" data-latex=\"\\bf a\">a</mi>
    </math>`
    ));
  it('sf', () =>
    toXmlMatch(
      tex2mml('\\sf a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sf a\" display=\"block\">
      <mi mathvariant=\"sans-serif\" data-latex=\"\\sf a\">a</mi>
    </math>`
    ));
  it('tt', () =>
    toXmlMatch(
      tex2mml('\\tt a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\tt a\" display=\"block\">
      <mi mathvariant=\"monospace\" data-latex=\"\\tt a\">a</mi>
    </math>`
    ));
  it('frak', () =>
    toXmlMatch(
      tex2mml('\\frak a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\frak a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\frak a\">
        <mi mathvariant=\"fraktur\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('Bbb', () =>
    toXmlMatch(
      tex2mml('\\Bbb a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Bbb a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\Bbb a\">
        <mi mathvariant=\"double-struck\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathup', () =>
    toXmlMatch(
      tex2mml('\\mathup a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathup a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathup a\">
        <mi mathvariant=\"normal\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathnormal', () =>
    toXmlMatch(
      tex2mml('\\mathnormal a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathnormal a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathnormal a\">
        <mi data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathbfup', () =>
    toXmlMatch(
      tex2mml('\\mathbfup a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathbfup a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathbfup a\">
        <mi mathvariant=\"bold\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathit', () =>
    toXmlMatch(
      tex2mml('\\mathit a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathit a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathit a\">
        <mi data-mjx-variant=\"-tex-mathit\" mathvariant=\"italic\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathbfit', () =>
    toXmlMatch(
      tex2mml('\\mathbfit a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathbfit a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathbfit a\">
        <mi mathvariant=\"bold-italic\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathbb', () =>
    toXmlMatch(
      tex2mml('\\mathbb a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathbb a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathbb a\">
        <mi mathvariant=\"double-struck\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathfrak', () =>
    toXmlMatch(
      tex2mml('\\mathfrak a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathfrak a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathfrak a\">
        <mi mathvariant=\"fraktur\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathbffrak', () =>
    toXmlMatch(
      tex2mml('\\mathbffrak a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathbffrak a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathbffrak a\">
        <mi mathvariant=\"bold-fraktur\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathscr', () =>
    toXmlMatch(
      tex2mml('\\mathscr a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathscr a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathscr a\">
        <mi mathvariant=\"script\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathbfscr', () =>
    toXmlMatch(
      tex2mml('\\mathbfscr a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathbfscr a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathbfscr a\">
        <mi mathvariant=\"bold-script\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathsf', () =>
    toXmlMatch(
      tex2mml('\\mathsf a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathsf a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathsf a\">
        <mi mathvariant=\"sans-serif\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathsfup', () =>
    toXmlMatch(
      tex2mml('\\mathsfup a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathsfup a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathsfup a\">
        <mi mathvariant=\"sans-serif\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathbfsf', () =>
    toXmlMatch(
      tex2mml('\\mathbfsf a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathbfsf a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathbfsf a\">
        <mi mathvariant=\"bold-sans-serif\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathbfsfup', () =>
    toXmlMatch(
      tex2mml('\\mathbfsfup a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathbfsfup a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathbfsfup a\">
        <mi mathvariant=\"bold-sans-serif\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathsfit', () =>
    toXmlMatch(
      tex2mml('\\mathsfit a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathsfit a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathsfit a\">
        <mi mathvariant=\"sans-serif-italic\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathbfsfit', () =>
    toXmlMatch(
      tex2mml('\\mathbfsfit a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathbfsfit a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathbfsfit a\">
        <mi mathvariant=\"sans-serif-bold-italic\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathtt', () =>
    toXmlMatch(
      tex2mml('\\mathtt a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathtt a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathtt a\">
        <mi mathvariant=\"monospace\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathcal', () =>
    toXmlMatch(
      tex2mml('\\mathcal a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathcal a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathcal a\">
        <mi data-mjx-variant=\"-tex-calligraphic\" mathvariant=\"script\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('mathbfcal', () =>
    toXmlMatch(
      tex2mml('\\mathbfcal a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mathbfcal a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\mathbfcal a\">
        <mi data-mjx-variant=\"-tex-bold-calligraphic\" mathvariant=\"bold-script\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symrm', () =>
    toXmlMatch(
      tex2mml('\\symrm a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symrm a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symrm a\">
        <mi mathvariant=\"normal\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symup', () =>
    toXmlMatch(
      tex2mml('\\symup a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symup a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symup a\">
        <mi mathvariant=\"normal\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symnormal', () =>
    toXmlMatch(
      tex2mml('\\symnormal a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symnormal a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symnormal a\">
        <mi data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symbf', () =>
    toXmlMatch(
      tex2mml('\\symbf a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symbf a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symbf a\">
        <mi mathvariant=\"bold\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symbfup', () =>
    toXmlMatch(
      tex2mml('\\symbfup a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symbfup a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symbfup a\">
        <mi mathvariant=\"bold\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symit', () =>
    toXmlMatch(
      tex2mml('\\symit a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symit a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symit a\">
        <mi data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symbfit', () =>
    toXmlMatch(
      tex2mml('\\symbfit a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symbfit a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symbfit a\">
        <mi mathvariant=\"bold-italic\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symbb', () =>
    toXmlMatch(
      tex2mml('\\symbb a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symbb a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symbb a\">
        <mi mathvariant=\"double-struck\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symfrak', () =>
    toXmlMatch(
      tex2mml('\\symfrak a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symfrak a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symfrak a\">
        <mi mathvariant=\"fraktur\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symbffrak', () =>
    toXmlMatch(
      tex2mml('\\symbffrak a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symbffrak a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symbffrak a\">
        <mi mathvariant=\"bold-fraktur\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symscr', () =>
    toXmlMatch(
      tex2mml('\\symscr a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symscr a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symscr a\">
        <mi mathvariant=\"script\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symbfscr', () =>
    toXmlMatch(
      tex2mml('\\symbfscr a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symbfscr a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symbfscr a\">
        <mi mathvariant=\"bold-script\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symsf', () =>
    toXmlMatch(
      tex2mml('\\symsf a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symsf a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symsf a\">
        <mi mathvariant=\"sans-serif\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symsfup', () =>
    toXmlMatch(
      tex2mml('\\symsfup a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symsfup a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symsfup a\">
        <mi mathvariant=\"sans-serif\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symbfsf', () =>
    toXmlMatch(
      tex2mml('\\symbfsf a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symbfsf a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symbfsf a\">
        <mi mathvariant=\"bold-sans-serif\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symbfsfup', () =>
    toXmlMatch(
      tex2mml('\\symbfsfup a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symbfsfup a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symbfsfup a\">
        <mi mathvariant=\"bold-sans-serif\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symsfit', () =>
    toXmlMatch(
      tex2mml('\\symsfit a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symsfit a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symsfit a\">
        <mi mathvariant=\"sans-serif-italic\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symbfsfit', () =>
    toXmlMatch(
      tex2mml('\\symbfsfit a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symbfsfit a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symbfsfit a\">
        <mi mathvariant=\"sans-serif-bold-italic\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symtt', () =>
    toXmlMatch(
      tex2mml('\\symtt a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symtt a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symtt a\">
        <mi mathvariant=\"monospace\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symcal', () =>
    toXmlMatch(
      tex2mml('\\symcal a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symcal a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symcal a\">
        <mi data-mjx-variant=\"-tex-calligraphic\" mathvariant=\"script\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('symbfcal', () =>
    toXmlMatch(
      tex2mml('\\symbfcal a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\symbfcal a\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\symbfcal a\">
        <mi data-mjx-variant=\"-tex-bold-calligraphic\" mathvariant=\"bold-script\" data-latex=\"a\">a</mi>
      </mrow>
    </math>`
    ));
  it('textrm', () =>
    toXmlMatch(
      tex2mml('\\textrm a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\textrm a\" display=\"block\">
      <mtext data-latex=\"\\textrm a\">a</mtext>
    </math>`
    ));
  it('textup', () =>
    toXmlMatch(
      tex2mml('\\textup a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\textup a\" display=\"block\">
      <mtext data-latex=\"\\textup a\">a</mtext>
    </math>`
    ));
  it('textnormal', () =>
    toXmlMatch(
      tex2mml('\\textnormal a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\textnormal a\" display=\"block\">
      <mtext data-latex=\"\\textnormal a\">a</mtext>
    </math>`
    ));
  it('textit', () =>
    toXmlMatch(
      tex2mml('\\textit a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\textit a\" display=\"block\">
      <mtext mathvariant=\"italic\" data-latex=\"\\textit a\">a</mtext>
    </math>`
    ));
  it('textbf', () =>
    toXmlMatch(
      tex2mml('\\textbf a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\textbf a\" display=\"block\">
      <mtext mathvariant=\"bold\" data-latex=\"\\textbf a\">a</mtext>
    </math>`
    ));
  it('textsf', () =>
    toXmlMatch(
      tex2mml('\\textsf a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\textsf a\" display=\"block\">
      <mtext mathvariant=\"sans-serif\" data-latex=\"\\textsf a\">a</mtext>
    </math>`
    ));
  it('texttt', () =>
    toXmlMatch(
      tex2mml('\\texttt a'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\texttt a\" display=\"block\">
      <mtext mathvariant=\"monospace\" data-latex=\"\\texttt a\">a</mtext>
    </math>`
    ));
});

describe('Over Under Extenders', () => {
  it('overparen', () =>
    toXmlMatch(
      tex2mml('\\overparen{ab}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\overparen{ab}\" display=\"block\">
      <mover data-latex=\"\\overparen{ab}\">
        <mrow data-latex=\"ab\">
          <mi data-latex=\"a\">a</mi>
          <mi data-latex=\"b\">b</mi>
        </mrow>
        <mo>&#x23DC;</mo>
      </mover>
    </math>`
    ));
  it('underparen', () =>
    toXmlMatch(
      tex2mml('\\underparen{ab}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\underparen{ab}\" display=\"block\">
      <munder data-latex=\"\\underparen{ab}\">
        <mrow data-latex=\"ab\">
          <mi data-latex=\"a\">a</mi>
          <mi data-latex=\"b\">b</mi>
        </mrow>
        <mo>&#x23DD;</mo>
      </munder>
    </math>`
    ));
  it('overrightarrow', () =>
    toXmlMatch(
      tex2mml('\\overrightarrow{ab}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\overrightarrow{ab}\" display=\"block\">
      <mover data-latex=\"\\overrightarrow{ab}\">
        <mrow data-latex=\"ab\">
          <mi data-latex=\"a\">a</mi>
          <mi data-latex=\"b\">b</mi>
        </mrow>
        <mo>&#x2192;</mo>
      </mover>
    </math>`
    ));
  it('underrightarrow', () =>
    toXmlMatch(
      tex2mml('\\underrightarrow{ab}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\underrightarrow{ab}\" display=\"block\">
      <munder data-latex=\"\\underrightarrow{ab}\">
        <mrow data-latex=\"ab\">
          <mi data-latex=\"a\">a</mi>
          <mi data-latex=\"b\">b</mi>
        </mrow>
        <mo>&#x2192;</mo>
      </munder>
    </math>`
    ));
  it('overleftarrow', () =>
    toXmlMatch(
      tex2mml('\\overleftarrow{ab}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\overleftarrow{ab}\" display=\"block\">
      <mover data-latex=\"\\overleftarrow{ab}\">
        <mrow data-latex=\"ab\">
          <mi data-latex=\"a\">a</mi>
          <mi data-latex=\"b\">b</mi>
        </mrow>
        <mo>&#x2190;</mo>
      </mover>
    </math>`
    ));
  it('underleftarrow', () =>
    toXmlMatch(
      tex2mml('\\underleftarrow{ab}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\underleftarrow{ab}\" display=\"block\">
      <munder data-latex=\"\\underleftarrow{ab}\">
        <mrow data-latex=\"ab\">
          <mi data-latex=\"a\">a</mi>
          <mi data-latex=\"b\">b</mi>
        </mrow>
        <mo>&#x2190;</mo>
      </munder>
    </math>`
    ));
  it('overleftrightarrow', () =>
    toXmlMatch(
      tex2mml('\\overleftrightarrow{ab}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\overleftrightarrow{ab}\" display=\"block\">
      <mover data-latex=\"\\overleftrightarrow{ab}\">
        <mrow data-latex=\"ab\">
          <mi data-latex=\"a\">a</mi>
          <mi data-latex=\"b\">b</mi>
        </mrow>
        <mo>&#x2194;</mo>
      </mover>
    </math>`
    ));
});

describe('Math style sizes', () => {
  it('displaystyle', () =>
    toXmlMatch(
      tex2mml('\\displaystyle A', false),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\displaystyle A\">
      <mstyle displaystyle=\"true\" scriptlevel=\"0\" data-latex=\"\\displaystyle A\">
        <mi data-latex=\"A\">A</mi>
      </mstyle>
    </math>`
    ));
  it('textstyle', () =>
    toXmlMatch(
      tex2mml('\\textstyle B', false),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\textstyle B\">
      <mstyle displaystyle=\"false\" scriptlevel=\"0\" data-latex=\"\\textstyle B\">
        <mi data-latex=\"B\">B</mi>
      </mstyle>
    </math>`
    ));
  it('scriptstyle', () =>
    toXmlMatch(
      tex2mml('\\scriptstyle C', false),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\scriptstyle C\">
      <mstyle displaystyle=\"false\" scriptlevel=\"1\" data-latex=\"\\scriptstyle C\">
        <mi data-latex=\"C\">C</mi>
      </mstyle>
    </math>`
    ));
});

describe('Special characters', () => {
  // it('Space', () =>
  //   toXmlMatch(
  //     tex2mml('a\ b'),
  //     ``
  //   ));
  // it('Tab', () =>
  //   toXmlMatch(
  //     tex2mml('a\tb'),
  //     ``
  //   ));
  // it('CR', () =>
  //   toXmlMatch(
  //     tex2mml('a\rb'),
  //     ``
  //   ));
  // it('Newline', () =>
  //   toXmlMatch(
  //     tex2mml('a\nb'),
  //     ``
  //   ));
  // it('No break space', () =>
  //   toXmlMatch(
  //     tex2mml('a{\u00A0}b'),
  //     ``
  //   ));
  it('Prime', () =>
    toXmlMatch(
      tex2mml('a\u2019b'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"a&#x2019;b\" display=\"block\">
      <msup>
        <mi data-latex=\"a\">a</mi>
        <mo data-mjx-alternate=\"1\" data-latex=\"&#x2019;\">&#x2032;</mo>
      </msup>
      <mi data-latex=\"b\">b</mi>
    </math>`
    ));
});

describe('Big Commands for Delimiters', () => {
  it('big', () =>
    toXmlMatch(
      tex2mml('\\big|'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\big|\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\big|\">
        <mo minsize=\"1.2em\" maxsize=\"1.2em\">|</mo>
      </mrow>
    </math>`
    ));
  it('Big', () =>
    toXmlMatch(
      tex2mml('\\Big|'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Big|\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\Big|\">
        <mo minsize=\"1.623em\" maxsize=\"1.623em\">|</mo>
      </mrow>
    </math>`
    ));
  it('bigg', () =>
    toXmlMatch(
      tex2mml('\\bigg|'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bigg|\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\bigg|\">
        <mo minsize=\"2.047em\" maxsize=\"2.047em\">|</mo>
      </mrow>
    </math>`
    ));
  it('Bigg', () =>
    toXmlMatch(
      tex2mml('\\Bigg|'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Bigg|\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"\\Bigg|\">
        <mo minsize=\"2.470em\" maxsize=\"2.470em\">|</mo>
      </mrow>
    </math>`
    ));
  it('Biggl', () =>
    toXmlMatch(
      tex2mml('\\Biggl|'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Biggl|\" display=\"block\">
      <mrow data-mjx-texclass=\"OPEN\" data-latex=\"\\Biggl|\">
        <mo minsize=\"2.470em\" maxsize=\"2.470em\">|</mo>
      </mrow>
    </math>`
    ));
  it('Biggr', () =>
    toXmlMatch(
      tex2mml('\\Biggr|'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Biggr|\" display=\"block\">
      <mrow data-mjx-texclass=\"CLOSE\" data-latex=\"\\Biggr|\">
        <mo minsize=\"2.470em\" maxsize=\"2.470em\">|</mo>
      </mrow>
    </math>`
    ));
  it('bigm', () =>
    toXmlMatch(
      tex2mml('\\bigm|'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bigm|\" display=\"block\">
      <mrow data-mjx-texclass=\"REL\" data-latex=\"\\bigm|\">
        <mo minsize=\"1.2em\" maxsize=\"1.2em\">|</mo>
      </mrow>
    </math>`
    ));
  it('Bigm', () =>
    toXmlMatch(
      tex2mml('\\Bigm|'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Bigm|\" display=\"block\">
      <mrow data-mjx-texclass=\"REL\" data-latex=\"\\Bigm|\">
        <mo minsize=\"1.623em\" maxsize=\"1.623em\">|</mo>
      </mrow>
    </math>`
    ));
  it('biggm', () =>
    toXmlMatch(
      tex2mml('\\biggm|'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\biggm|\" display=\"block\">
      <mrow data-mjx-texclass=\"REL\" data-latex=\"\\biggm|\">
        <mo minsize=\"2.047em\" maxsize=\"2.047em\">|</mo>
      </mrow>
    </math>`
    ));
  it('Biggm', () =>
    toXmlMatch(
      tex2mml('\\Biggm|'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Biggm|\" display=\"block\">
      <mrow data-mjx-texclass=\"REL\" data-latex=\"\\Biggm|\">
        <mo minsize=\"2.470em\" maxsize=\"2.470em\">|</mo>
      </mrow>
    </math>`
    ));
});

// describe('Complete Base Items', () => {
//   it('Middle Color', () =>
//     toXmlMatch(
//       tex2mml('\\left(A\\color{red}\\middle|B\\right)'),
//       `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
//   <mrow data-mjx-texclass="INNER">
//     <mo data-mjx-texclass="OPEN">(</mo>
//     <mi>A</mi>
//     <mstyle mathcolor="red"></mstyle>
//     <mrow data-mjx-texclass="CLOSE"></mrow>
//     <mo mathcolor="red">|</mo>
//     <mrow data-mjx-texclass="OPEN"></mrow>
//     <mi>B</mi>
//     <mo data-mjx-texclass="CLOSE">)</mo>
//   </mrow>
// </math>`
//     ));
// });

describe('Complete Base Methods', () => {
  it('Comment', () =>
    toXmlMatch(
      tex2mml('a %comment'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"a %comment\" display=\"block\">
      <mi data-latex=\"a %comment\">a</mi>
    </math>`
    ));
});

afterAll(() => getTokens('base'));

// describe('', () => {
//   it('', () =>
//     toXmlMatch(
//       tex2mml(''),
//       ``
//     ));
// });
