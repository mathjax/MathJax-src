import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTex(['ams', 'base']));

describe('Ams', () => {
  it('Symbol', () =>
    toXmlMatch(
      tex2mml('\\digamma'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\digamma" display="block">
  <mi data-latex="\\digamma">&#x3DD;</mi>
</math>`
    ));
  it('Operator', () =>
    toXmlMatch(
      tex2mml('\\dotplus'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dotplus" display="block">
  <mo data-latex="\\dotplus">&#x2214;</mo>
</math>`
    ));
  it('Delimiter', () =>
    toXmlMatch(
      tex2mml('\\ulcorner'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ulcorner" display="block">
  <mo data-latex="\\ulcorner">&#x231C;</mo>
</math>`
    ));
  it('Delimiter-left-right', () =>
    toXmlMatch(
      tex2mml('\\left\\ulcorner A \\right\\urcorner'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\ulcorner A \\right\\urcorner" display="block">
  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\ulcorner A \\right\\urcorner" data-latex="\\left\\ulcorner A \\right\\urcorner">
    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left\\ulcorner " data-latex="\\left\\ulcorner ">&#x231C;</mo>
    <mi data-latex="A">A</mi>
    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right\\urcorner" data-latex="\\right\\urcorner">&#x231D;</mo>
  </mrow>
</math>`
    ));
  it('Macro', () =>
    toXmlMatch(
      tex2mml('A\\implies B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\implies B" display="block">
  <mi data-latex="A">A</mi>
  <mspace width="0.278em" data-latex="\\;"></mspace>
  <mo stretchy="false" data-latex="\\Longrightarrow">&#x27F9;</mo>
  <mspace width="0.278em" data-latex="\\;"></mspace>
  <mi data-latex="B">B</mi>
</math>`
    ));
  it('AMS-math-mo', () =>
    toXmlMatch(
      tex2mml('\\iiiint'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\iiiint" display="block">
  <mo data-mjx-texclass="OP" data-latex="\\iiiint">&#x2A0C;</mo>
</math>`
    ));
  it('AMS-math-macro', () =>
    toXmlMatch(
      tex2mml('\\ddddot{1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ddddot{1}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\ddddot{1}">
    <mover>
      <mn data-latex="1">1</mn>
      <mo>&#x20DC;</mo>
    </mover>
  </mrow>
</math>`
    ));
  it('Normal Fraction', () =>
    toXmlMatch(
      tex2mml('\\frac{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\frac{n}{k}" display="block">
  <mfrac data-latex="\\frac{n}{k}">
    <mi data-latex="n">n</mi>
    <mi data-latex="k">k</mi>
  </mfrac>
</math>`
    ));
  it('Text Fraction', () =>
    toXmlMatch(
      tex2mml('\\tfrac{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tfrac{n}{k}" display="block">
  <mstyle displaystyle="false" data-latex="\\tfrac{n}{k}">
    <mfrac>
      <mi data-latex="n">n</mi>
      <mi data-latex="k">k</mi>
    </mfrac>
  </mstyle>
</math>`
    ));
  it('Display Fraction', () =>
    toXmlMatch(
      tex2mml('\\dfrac{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dfrac{n}{k}" display="block">
  <mfrac data-latex="\\dfrac{n}{k}">
    <mi data-latex="n">n</mi>
    <mi data-latex="k">k</mi>
  </mfrac>
</math>`
    ));
  it('Normal Sub Fraction', () =>
    toXmlMatch(
      tex2mml('a_\\frac{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a_\\frac{n}{k}" display="block">
  <msub data-latex="a_\\frac{n}{k}">
    <mi data-latex="a">a</mi>
    <mfrac data-latex="{n}{k}">
      <mi data-latex="n">n</mi>
      <mi data-latex="k">k</mi>
    </mfrac>
  </msub>
</math>`
    ));
  it('Text Sub Fraction', () =>
    toXmlMatch(
      tex2mml('a_\\tfrac{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a_\\tfrac{n}{k}" display="block">
  <msub data-latex="a_\\tfrac{n}{k}">
    <mi data-latex="a">a</mi>
    <mstyle scriptlevel="0" data-latex="{n}{k}">
      <mfrac>
        <mi data-latex="n">n</mi>
        <mi data-latex="k">k</mi>
      </mfrac>
    </mstyle>
  </msub>
</math>`
    ));
  it('Display Sub Fraction', () =>
    toXmlMatch(
      tex2mml('a_\\dfrac{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a_\\dfrac{n}{k}" display="block">
  <msub data-latex="a_\\dfrac{n}{k}">
    <mi data-latex="a">a</mi>
    <mstyle displaystyle="true" scriptlevel="0" data-latex="{n}{k}">
      <mfrac>
        <mi data-latex="n">n</mi>
        <mi data-latex="k">k</mi>
      </mfrac>
    </mstyle>
  </msub>
</math>`
    ));
  it('Normal Binomial', () =>
    toXmlMatch(
      tex2mml('\\binom{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\binom{n}{k}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\binom{n}{k}">
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
  it('Text Binomial', () =>
    toXmlMatch(
      tex2mml('\\tbinom{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tbinom{n}{k}" display="block">
  <mstyle displaystyle="false" data-latex="\\tbinom{n}{k}">
    <mrow data-mjx-texclass="ORD">
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
  </mstyle>
</math>`
    ));
  it('Display Binomial', () =>
    toXmlMatch(
      tex2mml('\\dbinom{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dbinom{n}{k}" display="block">
  <mrow data-mjx-texclass="ORD" data-latex="\\dbinom{n}{k}">
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
  it('Normal Sub Binomial', () =>
    toXmlMatch(
      tex2mml('a_\\binom{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a_\\binom{n}{k}" display="block">
  <msub data-latex="a_\\binom{n}{k}">
    <mi data-latex="a">a</mi>
    <mrow data-mjx-texclass="ORD" data-latex="{n}{k}">
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
  </msub>
</math>`
    ));
  it('Text Sub Binomial', () =>
    toXmlMatch(
      tex2mml('a_\\tbinom{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a_\\tbinom{n}{k}" display="block">
  <msub data-latex="a_\\tbinom{n}{k}">
    <mi data-latex="a">a</mi>
    <mstyle scriptlevel="0" data-latex="{n}{k}">
      <mrow data-mjx-texclass="ORD">
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
    </mstyle>
  </msub>
</math>`
    ));
  it('Display Sub Binomial', () =>
    toXmlMatch(
      tex2mml('a_\\dbinom{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a_\\dbinom{n}{k}" display="block">
  <msub data-latex="a_\\dbinom{n}{k}">
    <mi data-latex="a">a</mi>
    <mstyle displaystyle="true" scriptlevel="0" data-latex="{n}{k}">
      <mrow data-mjx-texclass="ORD">
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
    </mstyle>
  </msub>
</math>`
    ));
  it('Center Fraction', () =>
    toXmlMatch(
      tex2mml('\\cfrac{a}{bbb}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cfrac{a}{bbb}" display="block">
  <mfrac data-latex="\\cfrac{a}{bbb}">
    <mrow data-latex="\\strut\\textstyle{a}">
      <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">
        <mrow></mrow>
      </mpadded>
      <mrow data-mjx-texclass="ORD" data-latex="{a}">
        <mi data-latex="a">a</mi>
      </mrow>
    </mrow>
    <mrow data-latex="\\strut\\textstyle{bbb}">
      <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">
        <mrow></mrow>
      </mpadded>
      <mrow data-mjx-texclass="ORD" data-latex="{b b b}">
        <mi data-latex="b">b</mi>
        <mi data-latex="b">b</mi>
        <mi data-latex="b">b</mi>
      </mrow>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Left Fraction', () =>
    toXmlMatch(
      tex2mml('\\cfrac[l]{a}{bbb}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cfrac[l]{a}{bbb}" display="block">
  <mfrac numalign="left" denomalign="left" data-latex="\\cfrac[l]{a}{bbb}">
    <mrow data-latex="\\strut\\textstyle{a}">
      <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">
        <mrow></mrow>
      </mpadded>
      <mrow data-mjx-texclass="ORD" data-latex="{a}">
        <mi data-latex="a">a</mi>
      </mrow>
    </mrow>
    <mrow data-latex="\\strut\\textstyle{bbb}">
      <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">
        <mrow></mrow>
      </mpadded>
      <mrow data-mjx-texclass="ORD" data-latex="{b b b}">
        <mi data-latex="b">b</mi>
        <mi data-latex="b">b</mi>
        <mi data-latex="b">b</mi>
      </mrow>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Right Fraction', () =>
    toXmlMatch(
      tex2mml('\\cfrac[r]{a}{bbb}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cfrac[r]{a}{bbb}" display="block">
  <mfrac numalign="right" denomalign="right" data-latex="\\cfrac[r]{a}{bbb}">
    <mrow data-latex="\\strut\\textstyle{a}">
      <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">
        <mrow></mrow>
      </mpadded>
      <mrow data-mjx-texclass="ORD" data-latex="{a}">
        <mi data-latex="a">a</mi>
      </mrow>
    </mrow>
    <mrow data-latex="\\strut\\textstyle{bbb}">
      <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">
        <mrow></mrow>
      </mpadded>
      <mrow data-mjx-texclass="ORD" data-latex="{b b b}">
        <mi data-latex="b">b</mi>
        <mi data-latex="b">b</mi>
        <mi data-latex="b">b</mi>
      </mrow>
    </mrow>
  </mfrac>
</math>`
    ));
  it('Above Left Arrow', () =>
    toXmlMatch(
      tex2mml('\\xleftarrow{abcd}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xleftarrow{abcd}" display="block">
  <mover data-latex="\\xleftarrow{abcd}">
    <mo data-mjx-texclass="REL">&#x2190;</mo>
    <mpadded width="+0.833em" lspace="0.556em" voffset="-.2em" height="-.2em">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
      <mi data-latex="c">c</mi>
      <mi data-latex="d">d</mi>
      <mspace depth=".2em"></mspace>
    </mpadded>
  </mover>
</math>`
    ));
  it('Above Below Left Arrow', () =>
    toXmlMatch(
      tex2mml('\\xleftarrow[xyz]{abcd}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xleftarrow[xyz]{abcd}" display="block">
  <munderover data-latex="\\xleftarrow[xyz]{abcd}">
    <mo data-mjx-texclass="REL">&#x2190;</mo>
    <mpadded width="+0.833em" lspace="0.556em" voffset=".15em" depth="-.15em">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
      <mi data-latex="z">z</mi>
      <mspace height=".75em"></mspace>
    </mpadded>
    <mpadded width="+0.833em" lspace="0.556em" voffset="-.2em" height="-.2em">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
      <mi data-latex="c">c</mi>
      <mi data-latex="d">d</mi>
      <mspace depth=".2em"></mspace>
    </mpadded>
  </munderover>
</math>`
    ));
  it('Above Left Arrow in Context', () =>
    toXmlMatch(
      tex2mml('A\\xleftarrow{abcd}B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\xleftarrow{abcd}B" display="block">
  <mi data-latex="A">A</mi>
  <mover data-latex="\\xleftarrow{abcd}">
    <mo data-mjx-texclass="REL">&#x2190;</mo>
    <mpadded width="+0.833em" lspace="0.556em" voffset="-.2em" height="-.2em">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
      <mi data-latex="c">c</mi>
      <mi data-latex="d">d</mi>
      <mspace depth=".2em"></mspace>
    </mpadded>
  </mover>
  <mi data-latex="B">B</mi>
</math>`
    ));
  it('Above Right Arrow', () =>
    toXmlMatch(
      tex2mml('\\xrightarrow{abcd}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xrightarrow{abcd}" display="block">
  <mover data-latex="\\xrightarrow{abcd}">
    <mo data-mjx-texclass="REL">&#x2192;</mo>
    <mpadded width="+0.833em" lspace="0.278em" voffset="-.2em" height="-.2em">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
      <mi data-latex="c">c</mi>
      <mi data-latex="d">d</mi>
      <mspace depth=".2em"></mspace>
    </mpadded>
  </mover>
</math>`
    ));
  it('Above Below Right Arrow', () =>
    toXmlMatch(
      tex2mml('\\xrightarrow[xyz]{abcd}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xrightarrow[xyz]{abcd}" display="block">
  <munderover data-latex="\\xrightarrow[xyz]{abcd}">
    <mo data-mjx-texclass="REL">&#x2192;</mo>
    <mpadded width="+0.833em" lspace="0.278em" voffset=".15em" depth="-.15em">
      <mi data-latex="x">x</mi>
      <mi data-latex="y">y</mi>
      <mi data-latex="z">z</mi>
      <mspace height=".75em"></mspace>
    </mpadded>
    <mpadded width="+0.833em" lspace="0.278em" voffset="-.2em" height="-.2em">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
      <mi data-latex="c">c</mi>
      <mi data-latex="d">d</mi>
      <mspace depth=".2em"></mspace>
    </mpadded>
  </munderover>
</math>`
    ));
  it('Above Right Arrow in Context', () =>
    toXmlMatch(
      tex2mml('A\\xrightarrow{abcd}B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\xrightarrow{abcd}B" display="block">
  <mi data-latex="A">A</mi>
  <mover data-latex="\\xrightarrow{abcd}">
    <mo data-mjx-texclass="REL">&#x2192;</mo>
    <mpadded width="+0.833em" lspace="0.278em" voffset="-.2em" height="-.2em">
      <mi data-latex="a">a</mi>
      <mi data-latex="b">b</mi>
      <mi data-latex="c">c</mi>
      <mi data-latex="d">d</mi>
      <mspace depth=".2em"></mspace>
    </mpadded>
  </mover>
  <mi data-latex="B">B</mi>
</math>`
    ));
  it('Genfrac', () =>
    toXmlMatch(
      tex2mml('\\genfrac{[}{]}{0pt}{3}{a}{b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\genfrac{[}{]}{0pt}{3}{a}{b}" display="block">
  <mstyle displaystyle="false" scriptlevel="2" data-latex="\\genfrac{[}{]}{0pt}{3}{a}{b}">
    <mrow data-mjx-texclass="ORD">
      <mrow data-mjx-texclass="OPEN" data-latex="\\bigl [">
        <mo minsize="1.2em" maxsize="1.2em">[</mo>
      </mrow>
      <mfrac linethickness="0pt">
        <mi data-latex="a">a</mi>
        <mi data-latex="b">b</mi>
      </mfrac>
      <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr ]">
        <mo minsize="1.2em" maxsize="1.2em">]</mo>
      </mrow>
    </mrow>
  </mstyle>
</math>`
    ));
  it('MultiInt', () =>
    toXmlMatch(
      tex2mml('\\idotsint'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\idotsint" display="block">
  <mo data-latex="\\int">&#x222B;</mo>
  <mo data-latex="\\cdots">&#x22EF;</mo>
  <mo data-latex="\\int">&#x222B;</mo>
</math>`
    ));
  it('MultiInt in Context', () =>
    toXmlMatch(
      tex2mml('a \\idotsint b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\idotsint b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="\\int">&#x222B;</mo>
  <mo data-latex="\\cdots">&#x22EF;</mo>
  <mo data-latex="\\int">&#x222B;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('MultiInt with Command', () =>
    toXmlMatch(
      tex2mml('\\idotsint\\sin x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\idotsint\\sin x" display="block">
  <mo data-latex="\\int">&#x222B;</mo>
  <mo data-latex="\\cdots">&#x22EF;</mo>
  <mo data-latex="\\int">&#x222B;</mo>
  <mi data-latex="\\sin">sin</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="x">x</mi>
</math>`
    ));
  it('MultiInt with Limits', () =>
    toXmlMatch(
      tex2mml('\\idotsint\\limits_a^b+3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\idotsint\\limits_a^b+3" display="block">
  <mspace width="-0.167em" data-latex="\\!"></mspace>
  <mspace width="-0.167em" data-latex="\\!"></mspace>
  <munderover data-latex="\\limits_a^b">
    <mrow data-mjx-texclass="OP" data-latex="\\limits">
      <mspace width="0.167em" data-latex="\\,"></mspace>
      <mspace width="0.167em" data-latex="\\," data-latex="\\,"></mspace>
      <mo data-latex="\\int">&#x222B;</mo>
      <mo data-latex="\\cdots">&#x22EF;</mo>
      <mo data-latex="\\int">&#x222B;</mo>
    </mrow>
    <mi data-latex="a">a</mi>
    <mi data-latex="b">b</mi>
  </munderover>
  <mo data-latex="+">+</mo>
  <mn data-latex="3">3</mn>
</math>`
    ));
  it('DeclareMathOp', () =>
    toXmlMatch(
      tex2mml('\\DeclareMathOperator{\\R}{R}a\\R b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\DeclareMathOperator{\\R}{R}a\\R b" display="block">
  <mi data-latex="a">a</mi>
  <mi data-mjx-texclass="OP" mathvariant="normal" data-latex="\\operatorname{R}">R</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Operatorname', () =>
    toXmlMatch(
      tex2mml('a\\operatorname{xyz}b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\operatorname{xyz}b" display="block">
  <mi data-latex="a">a</mi>
  <mi data-latex="\\operatorname{xyz}">xyz</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
});

describe('Ams Environments', () => {
  it('Subarray', () =>
    toXmlMatch(
      tex2mml('\\begin{subarray}{c}a\\end{subarray}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{subarray}{c}a\\end{subarray}" display="block">
  <mstyle scriptlevel="1" data-latex-item="{subarray}" data-latex="\\begin{subarray}{c}a\\end{subarray}">
    <mtable data-mjx-smallmatrix="true" columnspacing="0em" rowspacing="0.1em">
      <mtr data-latex-item="{c}" data-latex="{c}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
       </mtr>
    </mtable>
  </mstyle>
</math>`
    ));
  it('Small Matrix', () =>
    toXmlMatch(
      tex2mml('\\begin{smallmatrix}a\\end{smallmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{smallmatrix}a\\end{smallmatrix}" display="block">
  <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="\\begin{smallmatrix}a\\end{smallmatrix}">
    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
      <mtr>
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
  </mstyle>
</math>`
    ));
  it('Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align} a&=b \\\\ c&=d \\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align} a&amp;=b \\\\ c&amp;=d \\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align} a&amp;=b \\\\ c&amp;=d \\end{align}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Align Star', () =>
    toXmlMatch(
      tex2mml('\\begin{align*} a&=b \\\\ c&=d \\end{align*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\\\ c&amp;=d \\end{align*}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\\\ c&amp;=d \\end{align*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Multline', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b \\\\ c \\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b \\\\ c \\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\ b \\\\ c \\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Multline Star', () =>
    toXmlMatch(
      tex2mml('\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline*}" data-latex="\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Split', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{split} r&=s\\\\ & =t \\end{split} \\\\ c&=d \\end{align*}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{split} r&amp;=s\\\\ &amp; =t \\end{split} \\\\ c&amp;=d \\end{align*}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{split} r&amp;=s\\\\ &amp; =t \\end{split} \\\\ c&amp;=d \\end{align*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
          <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{split}" data-latex="{split}">
            <mtr>
              <mtd>
                <mi data-latex="r">r</mi>
              </mtd>
              <mtd>
                <mstyle indentshift="2em">
                  <mi></mi>
                  <mo data-latex="=">=</mo>
                  <mi data-latex="s">s</mi>
                </mstyle>
              </mtd>
            </mtr>
            <mtr>
              <mtd></mtd>
              <mtd>
                <mstyle indentshift="2em">
                  <mi></mi>
                  <mo data-latex="=">=</mo>
                  <mi data-latex="t">t</mi>
                </mstyle>
              </mtd>
            </mtr>
          </mtable>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Gather', () =>
    toXmlMatch(
      tex2mml('\\begin{gather} a=b \\\\ c=d \\end{gather}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{gather} a=b \\\\ c=d \\end{gather}" display="block">
  <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gather}" data-latex="\\begin{gather} a=b \\\\ c=d \\end{gather}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
        <mo data-latex="=">=</mo>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
        <mo data-latex="=">=</mo>
        <mi data-latex="d">d</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Gather Star', () =>
    toXmlMatch(
      tex2mml('\\begin{gather*} a=b \\\\ c=d \\end{gather*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{gather*} a=b \\\\ c=d \\end{gather*}" display="block">
  <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gather*}" data-latex="\\begin{gather*} a=b \\\\ c=d \\end{gather*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
        <mo data-latex="=">=</mo>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
        <mo data-latex="=">=</mo>
        <mi data-latex="d">d</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Alignat', () =>
    toXmlMatch(
      tex2mml('\\begin{alignat}{2} a&=b \\\\ c&=d \\end{alignat}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{alignat}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignat}" data-latex="\\begin{alignat}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat}">
    <mtr data-latex-item="{2}" data-latex="{2}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
        </mstyle>
      </mtd>
    </mtr>
    <mtr data-latex-item="{2}" data-latex="{2}">
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Alignat Star', () =>
    toXmlMatch(
      tex2mml('\\begin{alignat*}{2} a&=b \\\\ c&=d \\end{alignat*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{alignat*}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat*}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignat*}" data-latex="\\begin{alignat*}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat*}">
    <mtr data-latex-item="{2}" data-latex="{2}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
        </mstyle>
      </mtd>
    </mtr>
    <mtr data-latex-item="{2}" data-latex="{2}">
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Alignedat', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{alignedat}{2} r&=s\\\\ & =t \\end{alignedat} \\\\ c&=d \\end{align*}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{alignedat}{2} r&amp;=s\\\\ &amp; =t \\end{alignedat} \\\\ c&amp;=d \\end{align*}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{alignedat}{2} r&amp;=s\\\\ &amp; =t \\end{alignedat} \\\\ c&amp;=d \\end{align*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
          <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignedat}" data-latex="{alignedat}">
            <mtr data-latex-item="{2}" data-latex="{2}">
              <mtd>
                <mi data-latex="r">r</mi>
              </mtd>
              <mtd>
                <mstyle indentshift="2em">
                  <mi></mi>
                  <mo data-latex="=">=</mo>
                  <mi data-latex="s">s</mi>
                </mstyle>
              </mtd>
            </mtr>
            <mtr data-latex-item="{2}" data-latex="{2}">
              <mtd></mtd>
              <mtd>
                <mstyle indentshift="2em">
                  <mi></mi>
                  <mo data-latex="=">=</mo>
                  <mi data-latex="t">t</mi>
                </mstyle>
              </mtd>
            </mtr>
          </mtable>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Aligned', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{aligned} r&=s\\\\ & =t \\end{aligned} \\\\ c&=d \\end{align*}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{aligned} r&amp;=s\\\\ &amp; =t \\end{aligned} \\\\ c&amp;=d \\end{align*}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{aligned} r&amp;=s\\\\ &amp; =t \\end{aligned} \\\\ c&amp;=d \\end{align*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
          <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{aligned}" data-latex="{aligned}">
            <mtr data-latex-item=" " data-latex=" ">
              <mtd>
                <mi data-latex="r">r</mi>
              </mtd>
              <mtd>
                <mstyle indentshift="2em">
                  <mi></mi>
                  <mo data-latex="=">=</mo>
                  <mi data-latex="s">s</mi>
                </mstyle>
              </mtd>
            </mtr>
            <mtr data-latex-item=" " data-latex=" ">
              <mtd></mtd>
              <mtd>
                <mstyle indentshift="2em">
                  <mi></mi>
                  <mo data-latex="=">=</mo>
                  <mi data-latex="t">t</mi>
                </mstyle>
              </mtd>
            </mtr>
          </mtable>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Gathered', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&=d \\end{align*}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&amp;=d \\end{align*}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&amp;=d \\end{align*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
          <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gathered}" data-latex="{gathered}">
            <mtr data-latex-item=" " data-latex=" ">
              <mtd>
                <mi data-latex="r">r</mi>
                <mo data-latex="=">=</mo>
                <mi data-latex="s">s</mi>
              </mtd>
            </mtr>
            <mtr data-latex-item=" " data-latex=" ">
              <mtd>
                <mo data-latex="=">=</mo>
                <mi data-latex="t">t</mi>
              </mtd>
            </mtr>
          </mtable>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Equation', () =>
    toXmlMatch(
      tex2mml('\\begin{equation} a \\end{equation}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation} a \\end{equation}" display="block">
  <mi data-latex="\\begin{equation} a \\end{equation}" data-latex-item="{equation}">a</mi>
</math>`
    ));
  it('Equation Star', () =>
    toXmlMatch(
      tex2mml('\\begin{equation*} a \\end{equation*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation*} a \\end{equation*}" display="block">
  <mi data-latex="\\begin{equation*} a \\end{equation*}" data-latex-item="{equation*}">a</mi>
</math>`
    ));
  it('Eqnarray', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray} a & = & b\\\\ c & = & d \\end{eqnarray}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{eqnarray} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray}" display="block">
  <mtable displaystyle="true" columnalign="right center left" columnspacing="0em 0.278em" rowspacing="3pt" data-break-align="bottom middle top" data-latex-item="{eqnarray}" data-latex="\\begin{eqnarray} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi></mi>
        <mo data-latex="=">=</mo>
      </mtd>
      <mtd>
        <mstyle indentshift=".7em">
          <mi data-latex="b">b</mi>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mi></mi>
        <mo data-latex="=">=</mo>
      </mtd>
      <mtd>
        <mstyle indentshift=".7em">
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Eqnarray Star', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray*} a & = & b\\\\ c & = & d \\end{eqnarray*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{eqnarray*} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray*}" display="block">
  <mtable displaystyle="true" columnalign="right center left" columnspacing="0em 0.278em" rowspacing="3pt" data-break-align="bottom middle top" data-latex-item="{eqnarray*}" data-latex="\\begin{eqnarray*} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi></mi>
        <mo data-latex="=">=</mo>
      </mtd>
      <mtd>
        <mstyle indentshift=".7em">
          <mi data-latex="b">b</mi>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mi></mi>
        <mo data-latex="=">=</mo>
      </mtd>
      <mtd>
        <mstyle indentshift=".7em">
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
});

describe('Ams Labelled Environments', () => {
  beforeEach(() => setupTex(['ams', 'base'], { tags: 'ams' }));
  it('Subarray', () =>
    toXmlMatch(
      tex2mml('\\begin{subarray}{c}a\\end{subarray}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{subarray}{c}a\\end{subarray}" display="block">
  <mstyle scriptlevel="1" data-latex-item="{subarray}" data-latex="\\begin{subarray}{c}a\\end{subarray}">
    <mtable data-mjx-smallmatrix="true" columnspacing="0em" rowspacing="0.1em">
      <mtr data-latex-item="{c}" data-latex="{c}">
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
  </mstyle>
</math>`
    ));
  it('Small Matrix', () =>
    toXmlMatch(
      tex2mml('\\begin{smallmatrix}a\\end{smallmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{smallmatrix}a\\end{smallmatrix}" display="block">
  <mstyle scriptlevel="1" data-latex-item="{smallmatrix}" data-latex="\\begin{smallmatrix}a\\end{smallmatrix}">
    <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
      <mtr>
        <mtd>
          <mi data-latex="a">a</mi>
        </mtd>
      </mtr>
    </mtable>
  </mstyle>
</math>`
    ));
  it('Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align} a&=b \\\\ c&=d \\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align} a&amp;=b \\\\ c&amp;=d \\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align} a&amp;=b \\\\ c&amp;=d \\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
        </mstyle>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:2">
        <mtext data-latex="\\text{(2)}">(2)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Align Star', () =>
    toXmlMatch(
      tex2mml('\\begin{align*} a&=b \\\\ c&=d \\end{align*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\\\ c&amp;=d \\end{align*}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\\\ c&amp;=d \\end{align*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Multline', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b \\\\ c \\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b \\\\ c \\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\ b \\\\ c \\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Multline Star', () =>
    toXmlMatch(
      tex2mml('\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline*}" data-latex="\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Split', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{split} r&=s\\\\ & =t \\end{split} \\\\ c&=d \\end{align*}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{split} r&amp;=s\\\\ &amp; =t \\end{split} \\\\ c&amp;=d \\end{align*}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{split} r&amp;=s\\\\ &amp; =t \\end{split} \\\\ c&amp;=d \\end{align*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
          <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{split}" data-latex="{split}">
            <mtr>
              <mtd>
                <mi data-latex="r">r</mi>
              </mtd>
              <mtd>
                <mstyle indentshift="2em">
                  <mi></mi>
                  <mo data-latex="=">=</mo>
                  <mi data-latex="s">s</mi>
                </mstyle>
              </mtd>
            </mtr>
            <mtr>
              <mtd></mtd>
              <mtd>
                <mstyle indentshift="2em">
                  <mi></mi>
                  <mo data-latex="=">=</mo>
                  <mi data-latex="t">t</mi>
                </mstyle>
              </mtd>
            </mtr>
          </mtable>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Gather', () =>
    toXmlMatch(
      tex2mml('\\begin{gather} a=b \\\\ c=d \\end{gather}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{gather} a=b \\\\ c=d \\end{gather}" display="block">
  <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gather}" data-latex="\\begin{gather} a=b \\\\ c=d \\end{gather}">
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
        <mo data-latex="=">=</mo>
        <mi data-latex="b">b</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:2">
        <mtext data-latex="\\text{(2)}">(2)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="c">c</mi>
        <mo data-latex="=">=</mo>
        <mi data-latex="d">d</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Gather Star', () =>
    toXmlMatch(
      tex2mml('\\begin{gather*} a=b \\\\ c=d \\end{gather*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{gather*} a=b \\\\ c=d \\end{gather*}" display="block">
  <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gather*}" data-latex="\\begin{gather*} a=b \\\\ c=d \\end{gather*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
        <mo data-latex="=">=</mo>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
        <mo data-latex="=">=</mo>
        <mi data-latex="d">d</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Alignat', () =>
    toXmlMatch(
      tex2mml('\\begin{alignat}{2} a&=b \\\\ c&=d \\end{alignat}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{alignat}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignat}" data-latex="\\begin{alignat}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat}">
    <mlabeledtr data-latex-item="{2}" data-latex="{2}">
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
        </mstyle>
      </mtd>
    </mlabeledtr>
    <mlabeledtr data-latex-item="{2}" data-latex="{2}">
      <mtd id="mjx-eqn:2">
        <mtext data-latex="\\text{(2)}">(2)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Alignat Star', () =>
    toXmlMatch(
      tex2mml('\\begin{alignat*}{2} a&=b \\\\ c&=d \\end{alignat*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{alignat*}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat*}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignat*}" data-latex="\\begin{alignat*}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat*}">
    <mtr data-latex-item="{2}" data-latex="{2}">
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
        </mstyle>
      </mtd>
    </mtr>
    <mtr data-latex-item="{2}" data-latex="{2}">
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Alignedat', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{alignedat}{2} r&=s\\\\ & =t \\end{alignedat} \\\\ c&=d \\end{align*}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{alignedat}{2} r&amp;=s\\\\ &amp; =t \\end{alignedat} \\\\ c&amp;=d \\end{align*}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{alignedat}{2} r&amp;=s\\\\ &amp; =t \\end{alignedat} \\\\ c&amp;=d \\end{align*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
          <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignedat}" data-latex="{alignedat}">
            <mtr data-latex-item="{2}" data-latex="{2}">
              <mtd>
                <mi data-latex="r">r</mi>
              </mtd>
              <mtd>
                <mstyle indentshift="2em">
                  <mi></mi>
                  <mo data-latex="=">=</mo>
                  <mi data-latex="s">s</mi>
                </mstyle>
              </mtd>
            </mtr>
            <mtr data-latex-item="{2}" data-latex="{2}">
              <mtd></mtd>
              <mtd>
                <mstyle indentshift="2em">
                  <mi></mi>
                  <mo data-latex="=">=</mo>
                  <mi data-latex="t">t</mi>
                </mstyle>
              </mtd>
            </mtr>
          </mtable>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Aligned', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{aligned} r&=s\\\\ & =t \\end{aligned} \\\\ c&=d \\end{align*}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{aligned} r&amp;=s\\\\ &amp; =t \\end{aligned} \\\\ c&amp;=d \\end{align*}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{aligned} r&amp;=s\\\\ &amp; =t \\end{aligned} \\\\ c&amp;=d \\end{align*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
          <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{aligned}" data-latex="{aligned}">
            <mtr data-latex-item=" " data-latex=" ">
              <mtd>
                <mi data-latex="r">r</mi>
              </mtd>
              <mtd>
                <mstyle indentshift="2em">
                  <mi></mi>
                  <mo data-latex="=">=</mo>
                  <mi data-latex="s">s</mi>
                </mstyle>
              </mtd>
            </mtr>
            <mtr data-latex-item=" " data-latex=" ">
              <mtd></mtd>
              <mtd>
                <mstyle indentshift="2em">
                  <mi></mi>
                  <mo data-latex="=">=</mo>
                  <mi data-latex="t">t</mi>
                </mstyle>
              </mtd>
            </mtr>
          </mtable>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Gathered', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&=d \\end{align*}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&amp;=d \\end{align*}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&amp;=d \\end{align*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="b">b</mi>
          <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gathered}" data-latex="{gathered}">
            <mtr data-latex-item=" " data-latex=" ">
              <mtd>
                <mi data-latex="r">r</mi>
                <mo data-latex="=">=</mo>
                <mi data-latex="s">s</mi>
              </mtd>
            </mtr>
            <mtr data-latex-item=" " data-latex=" ">
              <mtd>
                <mo data-latex="=">=</mo>
                <mi data-latex="t">t</mi>
              </mtd>
            </mtr>
          </mtable>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Equation', () =>
    toXmlMatch(
      tex2mml('\\begin{equation} a \\end{equation}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation} a \\end{equation}" display="block">
  <mtable displaystyle="true" data-latex-item="{equation}" data-latex="\\begin{equation} a \\end{equation}">
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Equation Star', () =>
    toXmlMatch(
      tex2mml('\\begin{equation*} a \\end{equation*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation*} a \\end{equation*}" display="block">
  <mi data-latex="\\begin{equation*} a \\end{equation*}" data-latex-item="{equation*}">a</mi>
</math>`
    ));
  it('Eqnarray', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray} a & = & b\\\\ c & = & d \\end{eqnarray}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{eqnarray} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray}" display="block">
  <mtable displaystyle="true" columnalign="right center left" columnspacing="0em 0.278em" rowspacing="3pt" data-break-align="bottom middle top" data-latex-item="{eqnarray}" data-latex="\\begin{eqnarray} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray}">
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi></mi>
        <mo data-latex="=">=</mo>
      </mtd>
      <mtd>
        <mstyle indentshift=".7em">
          <mi data-latex="b">b</mi>
        </mstyle>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:2">
        <mtext data-latex="\\text{(2)}">(2)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mi></mi>
        <mo data-latex="=">=</mo>
      </mtd>
      <mtd>
        <mstyle indentshift=".7em">
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Eqnarray Star', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray*} a & = & b\\\\ c & = & d \\end{eqnarray*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{eqnarray*} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray*}" display="block">
  <mtable displaystyle="true" columnalign="right center left" columnspacing="0em 0.278em" rowspacing="3pt" data-break-align="bottom middle top" data-latex-item="{eqnarray*}" data-latex="\\begin{eqnarray*} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray*}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
      <mtd>
        <mi></mi>
        <mo data-latex="=">=</mo>
      </mtd>
      <mtd>
        <mstyle indentshift=".7em">
          <mi data-latex="b">b</mi>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mi></mi>
        <mo data-latex="=">=</mo>
      </mtd>
      <mtd>
        <mstyle indentshift=".7em">
          <mi data-latex="d">d</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
});

describe('Amserror', () => {
  it('Center Fraction Error', () =>
    toXmlMatch(
      tex2mml('\\cfrac[c]{a}{b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cfrac[c]{a}{b}" display="block">
  <merror data-mjx-error="Illegal alignment specified in \\cfrac">
    <mtext>Illegal alignment specified in \\cfrac</mtext>
  </merror>
</math>`
    ));
  it('Genfrac Error', () =>
    toXmlMatch(
      tex2mml('\\genfrac{[}{]}{0pt}{4}{a}{b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\genfrac{[}{]}{0pt}{4}{a}{b}" display="block">
  <merror data-mjx-error="Bad math style for \\genfrac">
    <mtext>Bad math style for \\genfrac</mtext>
  </merror>
</math>`
    ));
  it('MissingOrUnrecognizedDelim', () =>
    toXmlMatch(
      tex2mml('\\genfrac{(}{a}{}{2}{1}{2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\genfrac{(}{a}{}{2}{1}{2}" display="block">
  <merror data-mjx-error="Missing or unrecognized delimiter for \\genfrac">
    <mtext>Missing or unrecognized delimiter for \\genfrac</mtext>
  </merror>
</math>`
    ));
  it('PositiveIntegerArg', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{alignedat}{-2} r&=s \\end{alignedat} \\\\ c&=d \\end{align*}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{alignedat}{-2} r&amp;=s \\end{alignedat} \\\\ c&amp;=d \\end{align*}" display="block">
  <merror data-mjx-error="Argument to \\begin{alignedat} must be a positive integer">
    <mtext>Argument to \\begin{alignedat} must be a positive integer</mtext>
  </merror>
</math>`
    ));
  it('MultlineRowsOneCol', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\b&c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\b&amp;c\\end{multline}" display="block">
  <merror data-mjx-error="The rows within the multline environment must have exactly one column">
    <mtext>The rows within the multline environment must have exactly one column</mtext>
  </merror>
</math>`
    ));
});

describe('InternalMath', () => {
  it('Mbox Eqref', () =>
    toXmlMatch(
      tex2mml('a\\mbox{ \\eqref{1} } c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\mbox{ \\eqref{1} } c" display="block">
  <mi data-latex="a">a</mi>
  <mstyle displaystyle="false" data-latex="\\mbox{ \\eqref{1} }">
    <mtext>&#xA0;</mtext>
    <mrow data-mjx-texclass="ORD">
      <mrow href="#" class="MathJax_ref" data-latex="\\eqref{1}">
        <mtext>(???)</mtext>
      </mrow>
    </mrow>
    <mtext>&#xA0;</mtext>
  </mstyle>
  <mi data-latex="c">c</mi>
</math>`
    ));
});

describe('Multirel', () => {
  it('Multirel Mathvariant 1', () =>
    toXmlMatch(
      tex2mml('a <\\equiv \\mathrm{=>}\\thickapprox b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;\\equiv \\mathrm{=&gt;}\\thickapprox b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="&lt;" rspace="0pt">&lt;</mo>
  <mo data-latex="\\equiv" lspace="0pt">&#x2261;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{=&gt;}">
    <mo data-latex="=" rspace="0pt">=</mo>
    <mo data-latex="&gt;" lspace="0pt">&gt;</mo>
  </mrow>
  <mo data-mjx-alternate="1" data-latex="\\thickapprox">&#x2248;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Multirel Mathvariant 2', () =>
    toXmlMatch(
      tex2mml('a <\\equiv \\mathrm{=>}\\thickapprox\\thicksim b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;\\equiv \\mathrm{=&gt;}\\thickapprox\\thicksim b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="&lt;" rspace="0pt">&lt;</mo>
  <mo data-latex="\\equiv" lspace="0pt">&#x2261;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{=&gt;}">
    <mo data-latex="=" rspace="0pt">=</mo>
    <mo data-latex="&gt;" lspace="0pt">&gt;</mo>
  </mrow>
  <mo data-mjx-alternate="1" data-latex="\\thickapprox" rspace="0pt">&#x2248;</mo>
  <mo data-mjx-alternate="1" data-latex="\\thicksim" lspace="0pt">&#x223C;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Multirel Mathvariant 3', () =>
    toXmlMatch(
      tex2mml('a <\\equiv =>\\thickapprox\\thicksim b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;\\equiv =&gt;\\thickapprox\\thicksim b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="&lt;" rspace="0pt">&lt;</mo>
  <mo data-latex="\\equiv" lspace="0pt" rspace="0pt">&#x2261;</mo>
  <mo data-latex="=" lspace="0pt" rspace="0pt">=</mo>
  <mo data-latex="&gt;" lspace="0pt" rspace="0pt">&gt;</mo>
  <mo data-mjx-alternate="1" data-latex="\\thickapprox" lspace="0pt" rspace="0pt">&#x2248;</mo>
  <mo data-mjx-alternate="1" data-latex="\\thicksim" lspace="0pt">&#x223C;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Multirel Mathvariant 4', () =>
    toXmlMatch(
      tex2mml(
        'a <\\equiv \\mathrm{=}\\mathrm{>}\\thickapprox\\thicksim\\frown\\smile=\\updownarrow b'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;\\equiv \\mathrm{=}\\mathrm{&gt;}\\thickapprox\\thicksim\\frown\\smile=\\updownarrow b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="&lt;" rspace="0pt">&lt;</mo>
  <mo data-latex="\\equiv" lspace="0pt">&#x2261;</mo>
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{=}">
    <mo data-latex="=">=</mo>
  </mrow>
  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{&gt;}">
    <mo data-latex="&gt;">&gt;</mo>
  </mrow>
  <mo data-mjx-alternate="1" data-latex="\\thickapprox" rspace="0pt">&#x2248;</mo>
  <mo data-mjx-alternate="1" data-latex="\\thicksim" lspace="0pt" rspace="0pt">&#x223C;</mo>
  <mo data-latex="\\frown" lspace="0pt" rspace="0pt">&#x2322;</mo>
  <mo data-latex="\\smile" lspace="0pt" rspace="0pt">&#x2323;</mo>
  <mo data-latex="=" lspace="0pt" rspace="0pt">=</mo>
  <mo stretchy="false" data-latex="\\updownarrow" lspace="0pt">&#x2195;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Preset Lspace Rspace', () =>
    toXmlMatch(
      tex2mml('a\\lesssim\\gtrsim b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\lesssim\\gtrsim b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="\\lesssim" rspace="0pt">&#x2272;</mo>
  <mo data-latex="\\gtrsim" lspace="0pt">&#x2273;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
  it('Preset Rspace Lspace', () =>
    toXmlMatch(
      tex2mml('a\\gtrsim\\lesssim b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\gtrsim\\lesssim b" display="block">
  <mi data-latex="a">a</mi>
  <mo data-latex="\\gtrsim" rspace="0pt">&#x2273;</mo>
  <mo data-latex="\\lesssim" lspace="0pt">&#x2272;</mo>
  <mi data-latex="b">b</mi>
</math>`
    ));
});

describe('MultlineShove', () => {
  it('Shove None', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b\\\\ c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b\\\\ c\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\ b\\\\ c\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Shove Left Top', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}\\shoveleft a\\\\ b\\\\ c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}\\shoveleft a\\\\ b\\\\ c\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}\\shoveleft a\\\\ b\\\\ c\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Shove Left Middle', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\\\shoveleft b\\\\ c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\\\shoveleft b\\\\ c\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\\\shoveleft b\\\\ c\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Shove Left Bottom', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b\\\\\\shoveleft c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b\\\\\\shoveleft c\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\ b\\\\\\shoveleft c\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Shove Right Top', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}\\shoveright a\\\\ b\\\\ c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}\\shoveright a\\\\ b\\\\ c\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}\\shoveright a\\\\ b\\\\ c\\end{multline}">
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Shove Right Middle', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\\\shoveright b\\\\ c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\\\shoveright b\\\\ c\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\\\shoveright b\\\\ c\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Shove Right Bottom', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b\\\\\\shoveright c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b\\\\\\shoveright c\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\ b\\\\\\shoveright c\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Shove Right Left', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{multline} a\\\\\\shoveright\\shoveleft b\\\\ c\\end{multline}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\\\shoveright\\shoveleft b\\\\ c\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\\\shoveright\\shoveleft b\\\\ c\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Shove Left Right', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{multline} a\\\\\\shoveleft\\shoveright b\\\\ c\\end{multline}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\\\shoveleft\\shoveright b\\\\ c\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\\\shoveleft\\shoveright b\\\\ c\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Shove Error Top', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a \\shoveleft\\\\ b\\\\ c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a \\shoveleft\\\\ b\\\\ c\\end{multline}" display="block">
  <merror data-mjx-error="\\shoveleft must come at the beginning of the line">
    <mtext>\\shoveleft must come at the beginning of the line</mtext>
  </merror>
</math>`
    ));
  it('Shove Error Middle', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b \\shoveleft\\\\ c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b \\shoveleft\\\\ c\\end{multline}" display="block">
  <merror data-mjx-error="\\shoveleft must come at the beginning of the line">
    <mtext>\\shoveleft must come at the beginning of the line</mtext>
  </merror>
</math>`
    ));
  it('Shove Error Bottom', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b\\\\ c \\shoveleft\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b\\\\ c \\shoveleft\\end{multline}" display="block">
  <merror data-mjx-error="\\shoveleft must come at the beginning of the line">
    <mtext>\\shoveleft must come at the beginning of the line</mtext>
  </merror>
</math>`
    ));
  it('Shove Error Environment', () =>
    toXmlMatch(
      tex2mml('\\begin{align}\\shoveleft a\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}\\shoveleft a\\end{align}" display="block">
  <merror data-mjx-error="\\shoveleft only allowed in multline environment">
    <mtext>\\shoveleft only allowed in multline environment</mtext>
  </merror>
</math>`
    ));
});

describe('Ams Complex', () => {
  it('The Lorenz Equations', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}\\dot{x} & = \\sigma(y-x) \\\\\\dot{y} & = \\rho x - y - xz \\\\\\dot{z} & = -\\beta z + xy\\end{align}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}\\dot{x} &amp; = \\sigma(y-x) \\\\\\dot{y} &amp; = \\rho x - y - xz \\\\\\dot{z} &amp; = -\\beta z + xy\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align}\\dot{x} &amp; = \\sigma(y-x) \\\\\\dot{y} &amp; = \\rho x - y - xz \\\\\\dot{z} &amp; = -\\beta z + xy\\end{align}">
    <mtr>
      <mtd>
        <mrow data-mjx-texclass="ORD" data-latex="\\dot{x}">
          <mover>
            <mi data-latex="x">x</mi>
            <mo>&#x2D9;</mo>
          </mover>
        </mrow>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="\\sigma">&#x3C3;</mi>
          <mo data-latex="(" stretchy="false">(</mo>
          <mi data-latex="y">y</mi>
          <mo data-latex="-">&#x2212;</mo>
          <mi data-latex="x">x</mi>
          <mo data-latex=")" stretchy="false">)</mo>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow data-mjx-texclass="ORD" data-latex="\\dot{y}">
          <mover>
            <mi data-latex="y">y</mi>
            <mo>&#x2D9;</mo>
          </mover>
        </mrow>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="\\rho">&#x3C1;</mi>
          <mi data-latex="x">x</mi>
          <mo data-latex="-">&#x2212;</mo>
          <mi data-latex="y">y</mi>
          <mo data-latex="-">&#x2212;</mo>
          <mi data-latex="x">x</mi>
          <mi data-latex="z">z</mi>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow data-mjx-texclass="ORD" data-latex="\\dot{z}">
          <mover>
            <mi data-latex="z">z</mi>
            <mo>&#x2D9;</mo>
          </mover>
        </mrow>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mo data-latex="-">&#x2212;</mo>
          <mi data-latex="\\beta">&#x3B2;</mi>
          <mi data-latex="z">z</mi>
          <mo data-latex="+">+</mo>
          <mi data-latex="x">x</mi>
          <mi data-latex="y">y</mi>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it("Maxwell's Equations", () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align} \\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} & = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\  \\nabla \\cdot \\vec{\\mathbf{E}} & = 4 \\pi \\rho \\\\  \\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} & = \\vec{\\mathbf{0}} \\\\  \\nabla \\cdot \\vec{\\mathbf{B}} & = 0 \\end{align}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align} \\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} &amp; = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\  \\nabla \\cdot \\vec{\\mathbf{E}} &amp; = 4 \\pi \\rho \\\\  \\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} &amp; = \\vec{\\mathbf{0}} \\\\  \\nabla \\cdot \\vec{\\mathbf{B}} &amp; = 0 \\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align} \\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} &amp; = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\  \\nabla \\cdot \\vec{\\mathbf{E}} &amp; = 4 \\pi \\rho \\\\  \\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} &amp; = \\vec{\\mathbf{0}} \\\\  \\nabla \\cdot \\vec{\\mathbf{B}} &amp; = 0 \\end{align}">
    <mtr>
      <mtd>
        <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>
        <mo data-latex="\\times">&#xD7;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{B}}">
          <mover>
            <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{B}">
              <mi mathvariant="bold" data-latex="B">B</mi>
            </mrow>
            <mo stretchy="false">&#x2192;</mo>
          </mover>
        </mrow>
        <mo data-latex="-">&#x2212;</mo>
        <mspace width="0.167em" data-latex="\\,"></mspace>
        <mfrac data-latex="\\frac1c">
          <mn data-latex="1">1</mn>
          <mi data-latex="c">c</mi>
        </mfrac>
        <mspace width="0.167em" data-latex="\\,"></mspace>
        <mfrac data-latex="\\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t}">
          <mrow data-latex="\\partial\\vec{\\mathbf{E}}">
            <mi data-latex="\\partial">&#x2202;</mi>
            <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{E}}">
              <mover>
                <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{E}">
                  <mi mathvariant="bold" data-latex="E">E</mi>
                </mrow>
                <mo stretchy="false">&#x2192;</mo>
              </mover>
            </mrow>
          </mrow>
          <mrow data-latex="\\partial t">
            <mi data-latex="\\partial">&#x2202;</mi>
            <mi data-latex="t">t</mi>
          </mrow>
        </mfrac>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mfrac data-latex="\\frac{4\\pi}{c}">
            <mrow data-latex="4\\pi">
              <mn data-latex="4">4</mn>
              <mi data-latex="\\pi">&#x3C0;</mi>
            </mrow>
            <mi data-latex="c">c</mi>
          </mfrac>
          <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{j}}">
            <mover>
              <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{j}">
                <mi mathvariant="bold" data-latex="j">j</mi>
              </mrow>
              <mo stretchy="false">&#x2192;</mo>
            </mover>
          </mrow>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>
        <mo data-latex="\\cdot">&#x22C5;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{E}}">
          <mover>
            <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{E}">
              <mi mathvariant="bold" data-latex="E">E</mi>
            </mrow>
            <mo stretchy="false">&#x2192;</mo>
          </mover>
        </mrow>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mn data-latex="4">4</mn>
          <mi data-latex="\\pi">&#x3C0;</mi>
          <mi data-latex="\\rho">&#x3C1;</mi>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>
        <mo data-latex="\\times">&#xD7;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{E}}">
          <mover>
            <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{E}">
              <mi mathvariant="bold" data-latex="E">E</mi>
            </mrow>
            <mo stretchy="false">&#x2192;</mo>
          </mover>
        </mrow>
        <mspace width="0.167em" data-latex="\\,"></mspace>
        <mo data-latex="+">+</mo>
        <mspace width="0.167em" data-latex="\\,"></mspace>
        <mfrac data-latex="\\frac1c">
          <mn data-latex="1">1</mn>
          <mi data-latex="c">c</mi>
        </mfrac>
        <mspace width="0.167em" data-latex="\\,"></mspace>
        <mfrac data-latex="\\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t}">
          <mrow data-latex="\\partial\\vec{\\mathbf{B}}">
            <mi data-latex="\\partial">&#x2202;</mi>
            <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{B}}">
              <mover>
                <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{B}">
                  <mi mathvariant="bold" data-latex="B">B</mi>
                </mrow>
                <mo stretchy="false">&#x2192;</mo>
              </mover>
            </mrow>
          </mrow>
          <mrow data-latex="\\partial t">
            <mi data-latex="\\partial">&#x2202;</mi>
            <mi data-latex="t">t</mi>
          </mrow>
        </mfrac>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{0}}">
            <mover>
              <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{0}">
                <mn mathvariant="bold" data-latex="0">0</mn>
              </mrow>
              <mo stretchy="false">&#x2192;</mo>
            </mover>
          </mrow>
        </mstyle>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>
        <mo data-latex="\\cdot">&#x22C5;</mo>
        <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{B}}">
          <mover>
            <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{B}">
              <mi mathvariant="bold" data-latex="B">B</mi>
            </mrow>
            <mo stretchy="false">&#x2192;</mo>
          </mover>
        </mrow>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mn data-latex="0">0</mn>
        </mstyle>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Cubic Binomial', () =>
    toXmlMatch(
      tex2mml(
        '{\\begin{eqnarray}(x+y)^{3}&=&(x+y)(x+y)(x+y)\\\\&=&xxx+xxy+xyx+{\\underline {xyy}}+yxx+{\\underline {yxy}}+{\\underline {yyx}}+yyy\\\\&=&x^{3}+3x^{2}y+{\\underline {3xy^{2}}}+y^{3}.\\end{eqnarray}}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{\\begin{eqnarray}(x+y)^{3}&amp;=&amp;(x+y)(x+y)(x+y)\\\\&amp;=&amp;xxx+xxy+xyx+{\\underline {xyy}}+yxx+{\\underline {yxy}}+{\\underline {yyx}}+yyy\\\\&amp;=&amp;x^{3}+3x^{2}y+{\\underline {3xy^{2}}}+y^{3}.\\end{eqnarray}}" display="block">
  <merror data-mjx-error="Erroneous nesting of equation structures">
    <mtext>Erroneous nesting of equation structures</mtext>
  </merror>
</math>`
    ));
  it('A Cross Product Formula', () =>
    toXmlMatch(
      tex2mml(
        '\\mathbf{V}_1 \\times \\mathbf{V}_2 =   \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\    \\frac{\\partial X}{\\partial u} & \\frac{\\partial Y}{\\partial u} & 0 \\\\    \\frac{\\partial X}{\\partial v} & \\frac{\\partial Y}{\\partial v} & 0 \\\\   \\end{vmatrix}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbf{V}_1 \\times \\mathbf{V}_2 =   \\begin{vmatrix} \\mathbf{i} &amp; \\mathbf{j} &amp; \\mathbf{k} \\\\    \\frac{\\partial X}{\\partial u} &amp; \\frac{\\partial Y}{\\partial u} &amp; 0 \\\\    \\frac{\\partial X}{\\partial v} &amp; \\frac{\\partial Y}{\\partial v} &amp; 0 \\\\   \\end{vmatrix}" display="block">
  <msub data-latex="\\mathbf{V}_1">
    <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{V}">
      <mi mathvariant="bold" data-latex="V">V</mi>
    </mrow>
    <mn data-latex="1">1</mn>
  </msub>
  <mo data-latex="\\times">&#xD7;</mo>
  <msub data-latex="\\mathbf{V}_2">
    <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{V}">
      <mi mathvariant="bold" data-latex="V">V</mi>
    </mrow>
    <mn data-latex="2">2</mn>
  </msub>
  <mo data-latex="=">=</mo>
  <mrow data-mjx-texclass="INNER" data-latex-item="{vmatrix}" data-latex="{vmatrix}">
    <mo data-mjx-texclass="OPEN">|</mo>
    <mtable columnspacing="1em" rowspacing="4pt">
      <mtr>
        <mtd>
          <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{i}">
            <mi mathvariant="bold" data-latex="i">i</mi>
          </mrow>
        </mtd>
        <mtd>
          <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{j}">
            <mi mathvariant="bold" data-latex="j">j</mi>
          </mrow>
        </mtd>
        <mtd>
          <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{k}">
            <mi mathvariant="bold" data-latex="k">k</mi>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mfrac data-latex="\\frac{\\partial X}{\\partial u}">
            <mrow data-latex="\\partial X">
              <mi data-latex="\\partial">&#x2202;</mi>
              <mi data-latex="X">X</mi>
            </mrow>
            <mrow data-latex="\\partial u">
              <mi data-latex="\\partial">&#x2202;</mi>
              <mi data-latex="u">u</mi>
            </mrow>
          </mfrac>
        </mtd>
        <mtd>
          <mfrac data-latex="\\frac{\\partial Y}{\\partial u}">
            <mrow data-latex="\\partial Y">
              <mi data-latex="\\partial">&#x2202;</mi>
              <mi data-latex="Y">Y</mi>
            </mrow>
            <mrow data-latex="\\partial u">
              <mi data-latex="\\partial">&#x2202;</mi>
              <mi data-latex="u">u</mi>
            </mrow>
          </mfrac>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mfrac data-latex="\\frac{\\partial X}{\\partial v}">
            <mrow data-latex="\\partial X">
              <mi data-latex="\\partial">&#x2202;</mi>
              <mi data-latex="X">X</mi>
            </mrow>
            <mrow data-latex="\\partial v">
              <mi data-latex="\\partial">&#x2202;</mi>
              <mi data-latex="v">v</mi>
            </mrow>
          </mfrac>
        </mtd>
        <mtd>
          <mfrac data-latex="\\frac{\\partial Y}{\\partial v}">
            <mrow data-latex="\\partial Y">
              <mi data-latex="\\partial">&#x2202;</mi>
              <mi data-latex="Y">Y</mi>
            </mrow>
            <mrow data-latex="\\partial v">
              <mi data-latex="\\partial">&#x2202;</mi>
              <mi data-latex="v">v</mi>
            </mrow>
          </mfrac>
        </mtd>
        <mtd>
          <mn data-latex="0">0</mn>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE">|</mo>
  </mrow>
</math>`
    ));
});

describe('Ams SideSet', () => {
  it('Sideset Empty', () =>
    toXmlMatch(
      tex2mml('\\sideset{}{}{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{}{}{}" display="block">
      <mrow data-mjx-texclass="OP" data-latex="\\sideset{}{}{}"></mrow>
    </math>`
    ));
  it('Sideset Simple', () =>
    toXmlMatch(
      tex2mml('\\sideset{}{}{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{}{}{a}" display="block">
      <mrow data-mjx-texclass="OP" data-latex="\\sideset{}{}{a}">
        <mi data-latex="a">a</mi>
      </mrow>
    </math>`
    ));
  it('Sideset Simple Right', () =>
    toXmlMatch(
      tex2mml('\\sideset{}{\'}{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{}{'}{a}" display="block">
      <mrow data-mjx-texclass="OP" data-latex="\\sideset{}{'}{a}">
        <msup data-latex="'">
          <mi data-latex="a">a</mi>
          <mo data-mjx-alternate="1" data-latex="'">&#x2032;</mo>
        </msup>
      </mrow>
    </math>`
    ));
  it('Sideset Simple Left', () =>
    toXmlMatch(
      tex2mml('\\sideset{\'}{}{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{'}{}{a}" display="block">
      <mrow data-mjx-texclass="OP" data-latex="\\sideset{'}{}{a}">
        <mmultiscripts data-mjx-script-align="left">
          <mi data-latex="a">a</mi>
          <mprescripts></mprescripts>
          <mo data-mjx-alternate="1" data-latex="'">&#x2032;</mo>
          <none></none>
        </mmultiscripts>
      </mrow>
    </math>`
    ));
  it('Sideset Simple Left Right', () =>
    toXmlMatch(
      tex2mml('\\sideset{\'}{\'}{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{'}{'}{a}" display="block">
      <mrow data-mjx-texclass="OP" data-latex="\\sideset{'}{'}{a}">
        <mmultiscripts data-mjx-script-align="left">
          <mi data-latex="a">a</mi>
          <mo data-mjx-alternate="1" data-latex="'">&#x2032;</mo>
          <none></none>
          <mprescripts></mprescripts>
          <mo data-mjx-alternate="1" data-latex="'">&#x2032;</mo>
          <none></none>
        </mmultiscripts>
      </mrow>
    </math>`
    ));
  it('Sideset Simple Sum', () =>
    toXmlMatch(
      tex2mml('\\sideset{}{\'}\\sum_{n=0}^{k}n'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{}{'}\\sum_{n=0}^{k}n" display="block">
      <munderover data-latex="\\sideset{}{'}\\sum_{n=0}^{k}">
        <mrow data-mjx-texclass="OP" data-latex="\\sideset{}{'}\\sum">
          <msup data-latex="'">
            <mo data-latex="\\sum">&#x2211;</mo>
            <mo data-mjx-alternate="1" data-latex="'">&#x2032;</mo>
          </msup>
        </mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{n=0}">
          <mi data-latex="n">n</mi>
          <mo data-latex="=">=</mo>
          <mn data-latex="0">0</mn>
        </mrow>
        <mrow data-mjx-texclass="ORD" data-latex="{k}">
          <mi data-latex="k">k</mi>
        </mrow>
      </munderover>
      <mi data-latex="n">n</mi>
    </math>`
    ));
});

afterAll(() => getTokens('ams'));
