import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch, setupTex, tex2mml } from '#helpers';

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
  it('Named Function', () =>
    toXmlMatch(
      tex2mml('\\sin x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin x" display="block">
  <mi data-latex="\\sin">sin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="x">x</mi>
</math>`
    ));
  it('Named Function Arg', () =>
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
  it('Square Root', () =>
    toXmlMatch(
      tex2mml('\\sqrt{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sqrt{x}" display="block">
  <msqrt data-latex="\\sqrt{x}">
    <mi data-latex="x">x</mi>
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
  it('spaces', () =>
    toXmlMatch(
      tex2mml('A\\,B\\!C'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\,B\\!C" display="block">
  <mi data-latex="A">A</mi>
  <mstyle scriptlevel="0" data-latex="\\,">
    <mspace width="0.167em"></mspace>
  </mstyle>
  <mi data-latex="B">B</mi>
  <mstyle scriptlevel="0" data-latex="\\!">
    <mspace width="-0.167em"></mspace>
  </mstyle>
  <mi data-latex="C">C</mi>
</math>`
    ));
  it('Hfill', () =>
    toXmlMatch(
      tex2mml('\\begin{array}{c}a\\hfill b\\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c}a\\hfill b\\end{array}" display="block">
  <mtable columnspacing="1em" rowspacing="4pt" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{c}a\\hfill b\\end{array}">
    <mtr data-latex-item="{c}" data-latex="{c}">
      <mtd>
        <mi data-latex="\\hfill">a</mi>
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
