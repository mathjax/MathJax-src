import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeEach(() => setupTex(['ams', 'base']));

describe('Ams', () => {
  it('Symbol', () =>
    toXmlMatch(
      tex2mml('\\digamma'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\digamma" display="block">\n  <mi data-latex="\\digamma">&#x3DD;</mi>\n</math>'
    ));
  it('Operator', () =>
    toXmlMatch(
      tex2mml('\\dotplus'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dotplus" display="block">\n  <mo data-latex="\\dotplus">&#x2214;</mo>\n</math>'
    ));
  it('Delimiter', () =>
    toXmlMatch(
      tex2mml('\\ulcorner'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ulcorner" display="block">\n  <mo data-latex="\\ulcorner">&#x231C;</mo>\n</math>'
    ));
  it('Delimiter-left-right', () =>
    toXmlMatch(
      tex2mml('\\left\\ulcorner A \\right\\urcorner'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\ulcorner A \\right\\urcorner" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\ulcorner A \\right\\urcorner" data-latex="\\left\\ulcorner A \\right\\urcorner">\n    <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left\\ulcorner " data-latex="\\left\\ulcorner ">&#x231C;</mo>\n    <mi data-latex="A">A</mi>\n    <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right\\urcorner" data-latex="\\right\\urcorner">&#x231D;</mo>\n  </mrow>\n</math>'
    ));
  it('Macro', () =>
    toXmlMatch(
      tex2mml('A\\implies B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\implies B" display="block">\n  <mi data-latex="A">A</mi>\n  <mstyle scriptlevel="0" data-latex="\\;">\n    <mspace width="0.278em"></mspace>\n  </mstyle>\n  <mo stretchy="false" data-latex="\\Longrightarrow">&#x27F9;</mo>\n  <mstyle scriptlevel="0" data-latex="\\;">\n    <mspace width="0.278em"></mspace>\n  </mstyle>\n  <mi data-latex="B">B</mi>\n</math>'
    ));
  it('AMS-math-mo', () =>
    toXmlMatch(
      tex2mml('\\iiiint'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\iiiint" display="block">\n  <mo data-mjx-texclass="OP" data-latex="\\iiiint">&#x2A0C;</mo>\n</math>'
    ));
  it('AMS-math-macro', () =>
    toXmlMatch(
      tex2mml('\\ddddot{1}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ddddot{1}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\ddddot{1}">\n    <mover>\n      <mn data-latex="1">1</mn>\n      <mo>&#x20DC;</mo>\n    </mover>\n  </mrow>\n</math>'
    ));
  it('Normal Fraction', () =>
    toXmlMatch(
      tex2mml('\\frac{n}{k}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\frac{n}{k}" display="block">\n  <mfrac data-latex="\\frac{n}{k}">\n    <mi data-latex="n">n</mi>\n    <mi data-latex="k">k</mi>\n  </mfrac>\n</math>'
    ));
  it('Text Fraction', () =>
    toXmlMatch(
      tex2mml('\\tfrac{n}{k}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tfrac{n}{k}" display="block">\n  <mstyle displaystyle="false" scriptlevel="0" data-latex="\\tfrac{n}{k}">\n    <mfrac>\n      <mi data-latex="n">n</mi>\n      <mi data-latex="k">k</mi>\n    </mfrac>\n  </mstyle>\n</math>'
    ));
  it('Display Fraction', () =>
    toXmlMatch(
      tex2mml('\\dfrac{n}{k}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dfrac{n}{k}" display="block">\n  <mstyle displaystyle="true" scriptlevel="0" data-latex="\\dfrac{n}{k}">\n    <mfrac>\n      <mi data-latex="n">n</mi>\n      <mi data-latex="k">k</mi>\n    </mfrac>\n  </mstyle>\n</math>'
    ));
  it('Normal Sub Fraction', () =>
    toXmlMatch(
      tex2mml('a_\\frac{n}{k}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a_\\frac{n}{k}" display="block">\n  <msub data-latex="a_\\frac{n}{k}">\n    <mi data-latex="a">a</mi>\n    <mfrac data-latex="{n}{k}">\n      <mi data-latex="n">n</mi>\n      <mi data-latex="k">k</mi>\n    </mfrac>\n  </msub>\n</math>'
    ));
  it('Text Sub Fraction', () =>
    toXmlMatch(
      tex2mml('a_\\tfrac{n}{k}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a_\\tfrac{n}{k}" display="block">\n  <msub data-latex="a_\\tfrac{n}{k}">\n    <mi data-latex="a">a</mi>\n    <mstyle displaystyle="false" scriptlevel="0" data-latex="{n}{k}">\n      <mfrac>\n        <mi data-latex="n">n</mi>\n        <mi data-latex="k">k</mi>\n      </mfrac>\n    </mstyle>\n  </msub>\n</math>'
    ));
  it('Display Sub Fraction', () =>
    toXmlMatch(
      tex2mml('a_\\dfrac{n}{k}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a_\\dfrac{n}{k}" display="block">\n  <msub data-latex="a_\\dfrac{n}{k}">\n    <mi data-latex="a">a</mi>\n    <mstyle displaystyle="true" scriptlevel="0" data-latex="{n}{k}">\n      <mfrac>\n        <mi data-latex="n">n</mi>\n        <mi data-latex="k">k</mi>\n      </mfrac>\n    </mstyle>\n  </msub>\n</math>'
    ));
  it('Normal Binomial', () =>
    toXmlMatch(
      tex2mml('\\binom{n}{k}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\binom{n}{k}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="\\binom{n}{k}">\n    <mrow data-mjx-texclass="OPEN" data-latex="\\biggl (">\n      <mo minsize="2.047em" maxsize="2.047em">(</mo>\n    </mrow>\n    <mfrac linethickness="0">\n      <mi data-latex="n">n</mi>\n      <mi data-latex="k">k</mi>\n    </mfrac>\n    <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr )">\n      <mo minsize="2.047em" maxsize="2.047em">)</mo>\n    </mrow>\n  </mrow>\n</math>'
    ));
  it('Text Binomial', () =>
    toXmlMatch(
      tex2mml('\\tbinom{n}{k}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\tbinom{n}{k}" display="block">\n  <mstyle displaystyle="false" scriptlevel="0" data-latex="\\tbinom{n}{k}">\n    <mrow data-mjx-texclass="ORD">\n      <mrow data-mjx-texclass="OPEN" data-latex="\\bigl (">\n        <mo minsize="1.2em" maxsize="1.2em">(</mo>\n      </mrow>\n      <mfrac linethickness="0">\n        <mi data-latex="n">n</mi>\n        <mi data-latex="k">k</mi>\n      </mfrac>\n      <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr )">\n        <mo minsize="1.2em" maxsize="1.2em">)</mo>\n      </mrow>\n    </mrow>\n  </mstyle>\n</math>'
    ));
  it('Display Binomial', () =>
    toXmlMatch(
      tex2mml('\\dbinom{n}{k}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dbinom{n}{k}" display="block">\n  <mstyle displaystyle="true" scriptlevel="0" data-latex="\\dbinom{n}{k}">\n    <mrow data-mjx-texclass="ORD">\n      <mrow data-mjx-texclass="OPEN" data-latex="\\biggl (">\n        <mo minsize="2.047em" maxsize="2.047em">(</mo>\n      </mrow>\n      <mfrac linethickness="0">\n        <mi data-latex="n">n</mi>\n        <mi data-latex="k">k</mi>\n      </mfrac>\n      <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr )">\n        <mo minsize="2.047em" maxsize="2.047em">)</mo>\n      </mrow>\n    </mrow>\n  </mstyle>\n</math>'
    ));
  it('Normal Sub Binomial', () =>
    toXmlMatch(
      tex2mml('a_\\binom{n}{k}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a_\\binom{n}{k}" display="block">\n  <msub data-latex="a_\\binom{n}{k}">\n    <mi data-latex="a">a</mi>\n    <mrow data-mjx-texclass="ORD" data-latex="{n}{k}">\n      <mrow data-mjx-texclass="OPEN" data-latex="\\bigl (">\n        <mo minsize="1.2em" maxsize="1.2em">(</mo>\n      </mrow>\n      <mfrac linethickness="0">\n        <mi data-latex="n">n</mi>\n        <mi data-latex="k">k</mi>\n      </mfrac>\n      <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr )">\n        <mo minsize="1.2em" maxsize="1.2em">)</mo>\n      </mrow>\n    </mrow>\n  </msub>\n</math>'
    ));
  it('Text Sub Binomial', () =>
    toXmlMatch(
      tex2mml('a_\\tbinom{n}{k}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a_\\tbinom{n}{k}" display="block">\n  <msub data-latex="a_\\tbinom{n}{k}">\n    <mi data-latex="a">a</mi>\n    <mstyle displaystyle="false" scriptlevel="0" data-latex="{n}{k}">\n      <mrow data-mjx-texclass="ORD">\n        <mrow data-mjx-texclass="OPEN" data-latex="\\bigl (">\n          <mo minsize="1.2em" maxsize="1.2em">(</mo>\n        </mrow>\n        <mfrac linethickness="0">\n          <mi data-latex="n">n</mi>\n          <mi data-latex="k">k</mi>\n        </mfrac>\n        <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr )">\n          <mo minsize="1.2em" maxsize="1.2em">)</mo>\n        </mrow>\n      </mrow>\n    </mstyle>\n  </msub>\n</math>'
    ));
  it('Display Sub Binomial', () =>
    toXmlMatch(
      tex2mml('a_\\dbinom{n}{k}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a_\\dbinom{n}{k}" display="block">\n  <msub data-latex="a_\\dbinom{n}{k}">\n    <mi data-latex="a">a</mi>\n    <mstyle displaystyle="true" scriptlevel="0" data-latex="{n}{k}">\n      <mrow data-mjx-texclass="ORD">\n        <mrow data-mjx-texclass="OPEN" data-latex="\\biggl (">\n          <mo minsize="2.047em" maxsize="2.047em">(</mo>\n        </mrow>\n        <mfrac linethickness="0">\n          <mi data-latex="n">n</mi>\n          <mi data-latex="k">k</mi>\n        </mfrac>\n        <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr )">\n          <mo minsize="2.047em" maxsize="2.047em">)</mo>\n        </mrow>\n      </mrow>\n    </mstyle>\n  </msub>\n</math>'
    ));
  it('Center Fraction', () =>
    toXmlMatch(
      tex2mml('\\cfrac{a}{bbb}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cfrac{a}{bbb}" display="block">\n  <mfrac data-latex="\\cfrac{a}{bbb}">\n    <mrow data-latex="\\strut\\textstyle{a}">\n      <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">\n        <mrow></mrow>\n      </mpadded>\n      <mstyle displaystyle="false" scriptlevel="0">\n        <mrow data-mjx-texclass="ORD" data-latex="{a}">\n          <mi data-latex="a">a</mi>\n        </mrow>\n      </mstyle>\n    </mrow>\n    <mrow data-latex="\\strut\\textstyle{bbb}">\n      <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">\n        <mrow></mrow>\n      </mpadded>\n      <mstyle displaystyle="false" scriptlevel="0">\n        <mrow data-mjx-texclass="ORD" data-latex="{b b b}">\n          <mi data-latex="b">b</mi>\n          <mi data-latex="b">b</mi>\n          <mi data-latex="b">b</mi>\n        </mrow>\n      </mstyle>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Left Fraction', () =>
    toXmlMatch(
      tex2mml('\\cfrac[l]{a}{bbb}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cfrac[l]{a}{bbb}" display="block">\n  <mfrac numalign="left" denomalign="left" data-latex="\\cfrac[l]{a}{bbb}">\n    <mrow data-latex="\\strut\\textstyle{a}">\n      <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">\n        <mrow></mrow>\n      </mpadded>\n      <mstyle displaystyle="false" scriptlevel="0">\n        <mrow data-mjx-texclass="ORD" data-latex="{a}">\n          <mi data-latex="a">a</mi>\n        </mrow>\n      </mstyle>\n    </mrow>\n    <mrow data-latex="\\strut\\textstyle{bbb}">\n      <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">\n        <mrow></mrow>\n      </mpadded>\n      <mstyle displaystyle="false" scriptlevel="0">\n        <mrow data-mjx-texclass="ORD" data-latex="{b b b}">\n          <mi data-latex="b">b</mi>\n          <mi data-latex="b">b</mi>\n          <mi data-latex="b">b</mi>\n        </mrow>\n      </mstyle>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Right Fraction', () =>
    toXmlMatch(
      tex2mml('\\cfrac[r]{a}{bbb}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cfrac[r]{a}{bbb}" display="block">\n  <mfrac numalign="right" denomalign="right" data-latex="\\cfrac[r]{a}{bbb}">\n    <mrow data-latex="\\strut\\textstyle{a}">\n      <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">\n        <mrow></mrow>\n      </mpadded>\n      <mstyle displaystyle="false" scriptlevel="0">\n        <mrow data-mjx-texclass="ORD" data-latex="{a}">\n          <mi data-latex="a">a</mi>\n        </mrow>\n      </mstyle>\n    </mrow>\n    <mrow data-latex="\\strut\\textstyle{bbb}">\n      <mpadded height="8.6pt" depth="3pt" width="0" data-latex="\\strut">\n        <mrow></mrow>\n      </mpadded>\n      <mstyle displaystyle="false" scriptlevel="0">\n        <mrow data-mjx-texclass="ORD" data-latex="{b b b}">\n          <mi data-latex="b">b</mi>\n          <mi data-latex="b">b</mi>\n          <mi data-latex="b">b</mi>\n        </mrow>\n      </mstyle>\n    </mrow>\n  </mfrac>\n</math>'
    ));
  it('Above Left Arrow', () =>
    toXmlMatch(
      tex2mml('\\xleftarrow{abcd}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xleftarrow{abcd}" display="block">\n  <mover data-latex="\\xleftarrow{abcd}">\n    <mstyle scriptlevel="0">\n      <mo data-mjx-texclass="REL">&#x2190;</mo>\n    </mstyle>\n    <mpadded width="+0.833em" lspace="0.556em" voffset="-.2em" height="-.2em">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n      <mi data-latex="c">c</mi>\n      <mi data-latex="d">d</mi>\n      <mspace depth=".2em"></mspace>\n    </mpadded>\n  </mover>\n</math>'
    ));
  it('Above Below Left Arrow', () =>
    toXmlMatch(
      tex2mml('\\xleftarrow[xyz]{abcd}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xleftarrow[xyz]{abcd}" display="block">\n  <munderover data-latex="\\xleftarrow[xyz]{abcd}">\n    <mstyle scriptlevel="0">\n      <mo data-mjx-texclass="REL">&#x2190;</mo>\n    </mstyle>\n    <mpadded width="+0.833em" lspace="0.556em" voffset=".15em" depth="-.15em">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n      <mi data-latex="z">z</mi>\n      <mspace height=".75em"></mspace>\n    </mpadded>\n    <mpadded width="+0.833em" lspace="0.556em" voffset="-.2em" height="-.2em">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n      <mi data-latex="c">c</mi>\n      <mi data-latex="d">d</mi>\n      <mspace depth=".2em"></mspace>\n    </mpadded>\n  </munderover>\n</math>'
    ));
  it('Above Left Arrow in Context', () =>
    toXmlMatch(
      tex2mml('A\\xleftarrow{abcd}B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\xleftarrow{abcd}B" display="block">\n  <mi data-latex="A">A</mi>\n  <mover data-latex="\\xleftarrow{abcd}">\n    <mstyle scriptlevel="0">\n      <mo data-mjx-texclass="REL">&#x2190;</mo>\n    </mstyle>\n    <mpadded width="+0.833em" lspace="0.556em" voffset="-.2em" height="-.2em">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n      <mi data-latex="c">c</mi>\n      <mi data-latex="d">d</mi>\n      <mspace depth=".2em"></mspace>\n    </mpadded>\n  </mover>\n  <mi data-latex="B">B</mi>\n</math>'
    ));
  it('Above Right Arrow', () =>
    toXmlMatch(
      tex2mml('\\xrightarrow{abcd}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xrightarrow{abcd}" display="block">\n  <mover data-latex="\\xrightarrow{abcd}">\n    <mstyle scriptlevel="0">\n      <mo data-mjx-texclass="REL">&#x2192;</mo>\n    </mstyle>\n    <mpadded width="+0.833em" lspace="0.278em" voffset="-.2em" height="-.2em">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n      <mi data-latex="c">c</mi>\n      <mi data-latex="d">d</mi>\n      <mspace depth=".2em"></mspace>\n    </mpadded>\n  </mover>\n</math>'
    ));
  it('Above Below Right Arrow', () =>
    toXmlMatch(
      tex2mml('\\xrightarrow[xyz]{abcd}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xrightarrow[xyz]{abcd}" display="block">\n  <munderover data-latex="\\xrightarrow[xyz]{abcd}">\n    <mstyle scriptlevel="0">\n      <mo data-mjx-texclass="REL">&#x2192;</mo>\n    </mstyle>\n    <mpadded width="+0.833em" lspace="0.278em" voffset=".15em" depth="-.15em">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n      <mi data-latex="z">z</mi>\n      <mspace height=".75em"></mspace>\n    </mpadded>\n    <mpadded width="+0.833em" lspace="0.278em" voffset="-.2em" height="-.2em">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n      <mi data-latex="c">c</mi>\n      <mi data-latex="d">d</mi>\n      <mspace depth=".2em"></mspace>\n    </mpadded>\n  </munderover>\n</math>'
    ));
  it('Above Right Arrow in Context', () =>
    toXmlMatch(
      tex2mml('A\\xrightarrow{abcd}B'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\xrightarrow{abcd}B" display="block">\n  <mi data-latex="A">A</mi>\n  <mover data-latex="\\xrightarrow{abcd}">\n    <mstyle scriptlevel="0">\n      <mo data-mjx-texclass="REL">&#x2192;</mo>\n    </mstyle>\n    <mpadded width="+0.833em" lspace="0.278em" voffset="-.2em" height="-.2em">\n      <mi data-latex="a">a</mi>\n      <mi data-latex="b">b</mi>\n      <mi data-latex="c">c</mi>\n      <mi data-latex="d">d</mi>\n      <mspace depth=".2em"></mspace>\n    </mpadded>\n  </mover>\n  <mi data-latex="B">B</mi>\n</math>'
    ));
  it('Genfrac', () =>
    toXmlMatch(
      tex2mml('\\genfrac{[}{]}{0pt}{3}{a}{b}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\genfrac{[}{]}{0pt}{3}{a}{b}" display="block">\n  <mstyle displaystyle="false" scriptlevel="2" data-latex="\\genfrac{[}{]}{0pt}{3}{a}{b}">\n    <mrow data-mjx-texclass="ORD">\n      <mrow data-mjx-texclass="OPEN" data-latex="\\bigl [">\n        <mo minsize="1.2em" maxsize="1.2em">[</mo>\n      </mrow>\n      <mfrac linethickness="0pt">\n        <mi data-latex="a">a</mi>\n        <mi data-latex="b">b</mi>\n      </mfrac>\n      <mrow data-mjx-texclass="CLOSE" data-latex="\\bigr ]">\n        <mo minsize="1.2em" maxsize="1.2em">]</mo>\n      </mrow>\n    </mrow>\n  </mstyle>\n</math>'
    ));
  it('MultiInt', () =>
    toXmlMatch(
      tex2mml('\\idotsint'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\idotsint" display="block">\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mo data-latex="\\cdots">&#x22EF;</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n</math>'
    ));
  it('MultiInt in Context', () =>
    toXmlMatch(
      tex2mml('a \\idotsint b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\idotsint b" display="block">\n  <mi data-latex="a">a</mi>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mo data-latex="\\cdots">&#x22EF;</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('MultiInt with Command', () =>
    toXmlMatch(
      tex2mml('\\idotsint\\sin x'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\idotsint\\sin x" display="block">\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mo data-latex="\\cdots">&#x22EF;</mo>\n  <mo data-latex="\\int">&#x222B;</mo>\n  <mi data-latex="\\sin">sin</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mi data-latex="x">x</mi>\n</math>'
    ));
  it('MultiInt with Limits', () =>
    toXmlMatch(
      tex2mml('\\idotsint\\limits_a^b+3'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\idotsint\\limits_a^b+3" display="block">\n  <mstyle scriptlevel="0" data-latex="\\!">\n    <mspace width="-0.167em"></mspace>\n  </mstyle>\n  <mstyle scriptlevel="0" data-latex="\\!">\n    <mspace width="-0.167em"></mspace>\n  </mstyle>\n  <munderover data-latex="\\limits_a^b">\n    <mrow data-mjx-texclass="OP" data-latex="\\limits">\n      <mstyle scriptlevel="0" data-latex="\\,">\n        <mspace width="0.167em"></mspace>\n      </mstyle>\n      <mstyle scriptlevel="0" data-latex="\\,">\n        <mspace width="0.167em"></mspace>\n      </mstyle>\n      <mo data-latex="\\int">&#x222B;</mo>\n      <mo data-latex="\\cdots">&#x22EF;</mo>\n      <mo data-latex="\\int">&#x222B;</mo>\n    </mrow>\n    <mi data-latex="a">a</mi>\n    <mi data-latex="b">b</mi>\n  </munderover>\n  <mo data-latex="+">+</mo>\n  <mn data-latex="3">3</mn>\n</math>'
    ));
  it('DeclareMathOp', () =>
    toXmlMatch(
      tex2mml('\\DeclareMathOperator{\\R}{R}a\\R b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\DeclareMathOperator{\\R}{R}a\\R b" display="block">\n  <mi data-latex="a">a</mi>\n  <mi data-mjx-texclass="OP" mathvariant="normal" data-latex="\\operatorname{R}">R</mi>\n  <mo data-mjx-texclass="NONE">&#x2061;</mo>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
});

describe('Ams Environments', () => {
  it('Subarray', () =>
    toXmlMatch(
      tex2mml('\\begin{subarray}{c}a\\end{subarray}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{subarray}{c}a\\end{subarray}" display="block">\n  <mtable data-mjx-smallmatrix="true" columnspacing="0em" rowspacing="0.1em" data-latex-item="{subarray}" data-latex="\\begin{subarray}{c}a\\end{subarray}">\n    <mtr data-latex-item="{c}" data-latex="{c}">\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Small Matrix', () =>
    toXmlMatch(
      tex2mml('\\begin{smallmatrix}a\\end{smallmatrix}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{smallmatrix}a\\end{smallmatrix}" display="block">\n  <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="\\begin{smallmatrix}a\\end{smallmatrix}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align} a&=b \\\\ c&=d \\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align} a&amp;=b \\\\ c&amp;=d \\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align} a&amp;=b \\\\ c&amp;=d \\end{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Align Star', () =>
    toXmlMatch(
      tex2mml('\\begin{align*} a&=b \\\\ c&=d \\end{align*}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\\\ c&amp;=d \\end{align*}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\\\ c&amp;=d \\end{align*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Multline', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b \\\\ c \\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b \\\\ c \\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\ b \\\\ c \\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Multline Star', () =>
    toXmlMatch(
      tex2mml('\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline*}" data-latex="\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Split', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{split} r&=s\\\\ & =t \\end{split} \\\\ c&=d \\end{align*}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{split} r&amp;=s\\\\ &amp; =t \\end{split} \\\\ c&amp;=d \\end{align*}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{split} r&amp;=s\\\\ &amp; =t \\end{split} \\\\ c&amp;=d \\end{align*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n          <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{split}" data-latex="{split}">\n            <mtr>\n              <mtd>\n                <mi data-latex="r">r</mi>\n              </mtd>\n              <mtd>\n                <mstyle indentshift="2em">\n                  <mi></mi>\n                  <mo data-latex="=">=</mo>\n                  <mi data-latex="s">s</mi>\n                </mstyle>\n              </mtd>\n            </mtr>\n            <mtr>\n              <mtd></mtd>\n              <mtd>\n                <mstyle indentshift="2em">\n                  <mi></mi>\n                  <mo data-latex="=">=</mo>\n                  <mi data-latex="t">t</mi>\n                </mstyle>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Gather', () =>
    toXmlMatch(
      tex2mml('\\begin{gather} a=b \\\\ c=d \\end{gather}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{gather} a=b \\\\ c=d \\end{gather}" display="block">\n  <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gather}" data-latex="\\begin{gather} a=b \\\\ c=d \\end{gather}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n        <mo data-latex="=">=</mo>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n        <mo data-latex="=">=</mo>\n        <mi data-latex="d">d</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Gather Star', () =>
    toXmlMatch(
      tex2mml('\\begin{gather*} a=b \\\\ c=d \\end{gather*}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{gather*} a=b \\\\ c=d \\end{gather*}" display="block">\n  <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gather*}" data-latex="\\begin{gather*} a=b \\\\ c=d \\end{gather*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n        <mo data-latex="=">=</mo>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n        <mo data-latex="=">=</mo>\n        <mi data-latex="d">d</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Alignat', () =>
    toXmlMatch(
      tex2mml('\\begin{alignat}{2} a&=b \\\\ c&=d \\end{alignat}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{alignat}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignat}" data-latex="\\begin{alignat}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat}">\n    <mtr data-latex-item="{2}" data-latex="{2}">\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{2}" data-latex="{2}">\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Alignat Star', () =>
    toXmlMatch(
      tex2mml('\\begin{alignat*}{2} a&=b \\\\ c&=d \\end{alignat*}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{alignat*}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat*}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignat*}" data-latex="\\begin{alignat*}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat*}">\n    <mtr data-latex-item="{2}" data-latex="{2}">\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{2}" data-latex="{2}">\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Alignedat', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{alignedat}{2} r&=s\\\\ & =t \\end{alignedat} \\\\ c&=d \\end{align*}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{alignedat}{2} r&amp;=s\\\\ &amp; =t \\end{alignedat} \\\\ c&amp;=d \\end{align*}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{alignedat}{2} r&amp;=s\\\\ &amp; =t \\end{alignedat} \\\\ c&amp;=d \\end{align*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n          <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignedat}" data-latex="{alignedat}">\n            <mtr data-latex-item="{2}" data-latex="{2}">\n              <mtd>\n                <mi data-latex="r">r</mi>\n              </mtd>\n              <mtd>\n                <mstyle indentshift="2em">\n                  <mi></mi>\n                  <mo data-latex="=">=</mo>\n                  <mi data-latex="s">s</mi>\n                </mstyle>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{2}" data-latex="{2}">\n              <mtd></mtd>\n              <mtd>\n                <mstyle indentshift="2em">\n                  <mi></mi>\n                  <mo data-latex="=">=</mo>\n                  <mi data-latex="t">t</mi>\n                </mstyle>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Aligned', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{aligned} r&=s\\\\ & =t \\end{aligned} \\\\ c&=d \\end{align*}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{aligned} r&amp;=s\\\\ &amp; =t \\end{aligned} \\\\ c&amp;=d \\end{align*}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{aligned} r&amp;=s\\\\ &amp; =t \\end{aligned} \\\\ c&amp;=d \\end{align*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n          <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{aligned}" data-latex="{aligned}">\n            <mtr data-latex-item=" " data-latex=" ">\n              <mtd>\n                <mi data-latex="r">r</mi>\n              </mtd>\n              <mtd>\n                <mstyle indentshift="2em">\n                  <mi></mi>\n                  <mo data-latex="=">=</mo>\n                  <mi data-latex="s">s</mi>\n                </mstyle>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item=" " data-latex=" ">\n              <mtd></mtd>\n              <mtd>\n                <mstyle indentshift="2em">\n                  <mi></mi>\n                  <mo data-latex="=">=</mo>\n                  <mi data-latex="t">t</mi>\n                </mstyle>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Gathered', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&=d \\end{align*}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&amp;=d \\end{align*}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&amp;=d \\end{align*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n          <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gathered}" data-latex="{gathered}">\n            <mtr data-latex-item=" " data-latex=" ">\n              <mtd>\n                <mi data-latex="r">r</mi>\n                <mo data-latex="=">=</mo>\n                <mi data-latex="s">s</mi>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item=" " data-latex=" ">\n              <mtd>\n                <mo data-latex="=">=</mo>\n                <mi data-latex="t">t</mi>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Equation', () =>
    toXmlMatch(
      tex2mml('\\begin{equation} a \\end{equation}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation} a \\end{equation}" display="block">\n  <mi data-latex="\\begin{equation} a \\end{equation}" data-latex-item="{equation}">a</mi>\n</math>'
    ));
  it('Equation Star', () =>
    toXmlMatch(
      tex2mml('\\begin{equation*} a \\end{equation*}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation*} a \\end{equation*}" display="block">\n  <mi data-latex="\\begin{equation*} a \\end{equation*}" data-latex-item="{equation*}">a</mi>\n</math>'
    ));
  it('Eqnarray', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray} a & = & b\\\\ c & = & d \\end{eqnarray}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{eqnarray} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray}" display="block">\n  <mtable displaystyle="true" columnalign="right center left" columnspacing="0em 0.278em" rowspacing="3pt" data-break-align="bottom middle top" data-latex-item="{eqnarray}" data-latex="\\begin{eqnarray} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mi></mi>\n        <mo data-latex="=">=</mo>\n      </mtd>\n      <mtd>\n        <mstyle indentshift=".7em">\n          <mi data-latex="b">b</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mi></mi>\n        <mo data-latex="=">=</mo>\n      </mtd>\n      <mtd>\n        <mstyle indentshift=".7em">\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Eqnarray Star', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray*} a & = & b\\\\ c & = & d \\end{eqnarray*}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{eqnarray*} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray*}" display="block">\n  <mtable displaystyle="true" columnalign="right center left" columnspacing="0em 0.278em" rowspacing="3pt" data-break-align="bottom middle top" data-latex-item="{eqnarray*}" data-latex="\\begin{eqnarray*} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mi></mi>\n        <mo data-latex="=">=</mo>\n      </mtd>\n      <mtd>\n        <mstyle indentshift=".7em">\n          <mi data-latex="b">b</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mi></mi>\n        <mo data-latex="=">=</mo>\n      </mtd>\n      <mtd>\n        <mstyle indentshift=".7em">\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
});

describe('Ams Labelled Environments', () => {
  beforeEach(() => setupTex(['ams', 'base'], { tags: 'ams' }));
  it('Subarray', () =>
    toXmlMatch(
      tex2mml('\\begin{subarray}{c}a\\end{subarray}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{subarray}{c}a\\end{subarray}" display="block">\n  <mtable data-mjx-smallmatrix="true" columnspacing="0em" rowspacing="0.1em" data-latex-item="{subarray}" data-latex="\\begin{subarray}{c}a\\end{subarray}">\n    <mtr data-latex-item="{c}" data-latex="{c}">\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Small Matrix', () =>
    toXmlMatch(
      tex2mml('\\begin{smallmatrix}a\\end{smallmatrix}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{smallmatrix}a\\end{smallmatrix}" display="block">\n  <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" data-latex-item="{smallmatrix}" data-latex="\\begin{smallmatrix}a\\end{smallmatrix}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align} a&=b \\\\ c&=d \\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align} a&amp;=b \\\\ c&amp;=d \\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align} a&amp;=b \\\\ c&amp;=d \\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n        </mstyle>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:2">\n        <mtext data-latex="\\text{(2)}">(2)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Align Star', () =>
    toXmlMatch(
      tex2mml('\\begin{align*} a&=b \\\\ c&=d \\end{align*}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\\\ c&amp;=d \\end{align*}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\\\ c&amp;=d \\end{align*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Multline', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b \\\\ c \\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b \\\\ c \\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\ b \\\\ c \\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Multline Star', () =>
    toXmlMatch(
      tex2mml('\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline*}" data-latex="\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Split', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{split} r&=s\\\\ & =t \\end{split} \\\\ c&=d \\end{align*}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{split} r&amp;=s\\\\ &amp; =t \\end{split} \\\\ c&amp;=d \\end{align*}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{split} r&amp;=s\\\\ &amp; =t \\end{split} \\\\ c&amp;=d \\end{align*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n          <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{split}" data-latex="{split}">\n            <mtr>\n              <mtd>\n                <mi data-latex="r">r</mi>\n              </mtd>\n              <mtd>\n                <mstyle indentshift="2em">\n                  <mi></mi>\n                  <mo data-latex="=">=</mo>\n                  <mi data-latex="s">s</mi>\n                </mstyle>\n              </mtd>\n            </mtr>\n            <mtr>\n              <mtd></mtd>\n              <mtd>\n                <mstyle indentshift="2em">\n                  <mi></mi>\n                  <mo data-latex="=">=</mo>\n                  <mi data-latex="t">t</mi>\n                </mstyle>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Gather', () =>
    toXmlMatch(
      tex2mml('\\begin{gather} a=b \\\\ c=d \\end{gather}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{gather} a=b \\\\ c=d \\end{gather}" display="block">\n  <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gather}" data-latex="\\begin{gather} a=b \\\\ c=d \\end{gather}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="a">a</mi>\n        <mo data-latex="=">=</mo>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:2">\n        <mtext data-latex="\\text{(2)}">(2)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="c">c</mi>\n        <mo data-latex="=">=</mo>\n        <mi data-latex="d">d</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Gather Star', () =>
    toXmlMatch(
      tex2mml('\\begin{gather*} a=b \\\\ c=d \\end{gather*}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{gather*} a=b \\\\ c=d \\end{gather*}" display="block">\n  <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gather*}" data-latex="\\begin{gather*} a=b \\\\ c=d \\end{gather*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n        <mo data-latex="=">=</mo>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n        <mo data-latex="=">=</mo>\n        <mi data-latex="d">d</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Alignat', () =>
    toXmlMatch(
      tex2mml('\\begin{alignat}{2} a&=b \\\\ c&=d \\end{alignat}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{alignat}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignat}" data-latex="\\begin{alignat}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat}">\n    <mlabeledtr data-latex-item="{2}" data-latex="{2}">\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n        </mstyle>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr data-latex-item="{2}" data-latex="{2}">\n      <mtd id="mjx-eqn:2">\n        <mtext data-latex="\\text{(2)}">(2)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Alignat Star', () =>
    toXmlMatch(
      tex2mml('\\begin{alignat*}{2} a&=b \\\\ c&=d \\end{alignat*}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{alignat*}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat*}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignat*}" data-latex="\\begin{alignat*}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat*}">\n    <mtr data-latex-item="{2}" data-latex="{2}">\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr data-latex-item="{2}" data-latex="{2}">\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Alignedat', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{alignedat}{2} r&=s\\\\ & =t \\end{alignedat} \\\\ c&=d \\end{align*}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{alignedat}{2} r&amp;=s\\\\ &amp; =t \\end{alignedat} \\\\ c&amp;=d \\end{align*}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{alignedat}{2} r&amp;=s\\\\ &amp; =t \\end{alignedat} \\\\ c&amp;=d \\end{align*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n          <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignedat}" data-latex="{alignedat}">\n            <mtr data-latex-item="{2}" data-latex="{2}">\n              <mtd>\n                <mi data-latex="r">r</mi>\n              </mtd>\n              <mtd>\n                <mstyle indentshift="2em">\n                  <mi></mi>\n                  <mo data-latex="=">=</mo>\n                  <mi data-latex="s">s</mi>\n                </mstyle>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item="{2}" data-latex="{2}">\n              <mtd></mtd>\n              <mtd>\n                <mstyle indentshift="2em">\n                  <mi></mi>\n                  <mo data-latex="=">=</mo>\n                  <mi data-latex="t">t</mi>\n                </mstyle>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Aligned', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{aligned} r&=s\\\\ & =t \\end{aligned} \\\\ c&=d \\end{align*}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{aligned} r&amp;=s\\\\ &amp; =t \\end{aligned} \\\\ c&amp;=d \\end{align*}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{aligned} r&amp;=s\\\\ &amp; =t \\end{aligned} \\\\ c&amp;=d \\end{align*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n          <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{aligned}" data-latex="{aligned}">\n            <mtr data-latex-item=" " data-latex=" ">\n              <mtd>\n                <mi data-latex="r">r</mi>\n              </mtd>\n              <mtd>\n                <mstyle indentshift="2em">\n                  <mi></mi>\n                  <mo data-latex="=">=</mo>\n                  <mi data-latex="s">s</mi>\n                </mstyle>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item=" " data-latex=" ">\n              <mtd></mtd>\n              <mtd>\n                <mstyle indentshift="2em">\n                  <mi></mi>\n                  <mo data-latex="=">=</mo>\n                  <mi data-latex="t">t</mi>\n                </mstyle>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Gathered', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&=d \\end{align*}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&amp;=d \\end{align*}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align*}" data-latex="\\begin{align*} a&amp;=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&amp;=d \\end{align*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="b">b</mi>\n          <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gathered}" data-latex="{gathered}">\n            <mtr data-latex-item=" " data-latex=" ">\n              <mtd>\n                <mi data-latex="r">r</mi>\n                <mo data-latex="=">=</mo>\n                <mi data-latex="s">s</mi>\n              </mtd>\n            </mtr>\n            <mtr data-latex-item=" " data-latex=" ">\n              <mtd>\n                <mo data-latex="=">=</mo>\n                <mi data-latex="t">t</mi>\n              </mtd>\n            </mtr>\n          </mtable>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Equation', () =>
    toXmlMatch(
      tex2mml('\\begin{equation} a \\end{equation}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation} a \\end{equation}" display="block">\n  <mtable displaystyle="true" data-latex-item="{equation}" data-latex="\\begin{equation} a \\end{equation}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Equation Star', () =>
    toXmlMatch(
      tex2mml('\\begin{equation*} a \\end{equation*}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation*} a \\end{equation*}" display="block">\n  <mi data-latex="\\begin{equation*} a \\end{equation*}" data-latex-item="{equation*}">a</mi>\n</math>'
    ));
  it('Eqnarray', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray} a & = & b\\\\ c & = & d \\end{eqnarray}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{eqnarray} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray}" display="block">\n  <mtable displaystyle="true" columnalign="right center left" columnspacing="0em 0.278em" rowspacing="3pt" data-break-align="bottom middle top" data-latex-item="{eqnarray}" data-latex="\\begin{eqnarray} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mi></mi>\n        <mo data-latex="=">=</mo>\n      </mtd>\n      <mtd>\n        <mstyle indentshift=".7em">\n          <mi data-latex="b">b</mi>\n        </mstyle>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:2">\n        <mtext data-latex="\\text{(2)}">(2)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mi></mi>\n        <mo data-latex="=">=</mo>\n      </mtd>\n      <mtd>\n        <mstyle indentshift=".7em">\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Eqnarray Star', () =>
    toXmlMatch(
      tex2mml('\\begin{eqnarray*} a & = & b\\\\ c & = & d \\end{eqnarray*}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{eqnarray*} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray*}" display="block">\n  <mtable displaystyle="true" columnalign="right center left" columnspacing="0em 0.278em" rowspacing="3pt" data-break-align="bottom middle top" data-latex-item="{eqnarray*}" data-latex="\\begin{eqnarray*} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray*}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n      <mtd>\n        <mi></mi>\n        <mo data-latex="=">=</mo>\n      </mtd>\n      <mtd>\n        <mstyle indentshift=".7em">\n          <mi data-latex="b">b</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mi></mi>\n        <mo data-latex="=">=</mo>\n      </mtd>\n      <mtd>\n        <mstyle indentshift=".7em">\n          <mi data-latex="d">d</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
});

describe('Amserror', () => {
  it('Center Fraction Error', () =>
    toXmlMatch(
      tex2mml('\\cfrac[c]{a}{b}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cfrac[c]{a}{b}" display="block">\n  <merror data-mjx-error="Illegal alignment specified in \\cfrac">\n    <mtext>Illegal alignment specified in \\cfrac</mtext>\n  </merror>\n</math>'
    ));
  it('Genfrac Error', () =>
    toXmlMatch(
      tex2mml('\\genfrac{[}{]}{0pt}{4}{a}{b}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\genfrac{[}{]}{0pt}{4}{a}{b}" display="block">\n  <merror data-mjx-error="Bad math style for \\genfrac">\n    <mtext>Bad math style for \\genfrac</mtext>\n  </merror>\n</math>'
    ));
  it('MissingOrUnrecognizedDelim', () =>
    toXmlMatch(
      tex2mml('\\genfrac{(}{a}{}{2}{1}{2}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\genfrac{(}{a}{}{2}{1}{2}" display="block">\n  <merror data-mjx-error="Missing or unrecognized delimiter for \\genfrac">\n    <mtext>Missing or unrecognized delimiter for \\genfrac</mtext>\n  </merror>\n</math>'
    ));
  it('PositiveIntegerArg', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align*} a&=b \\begin{alignedat}{-2} r&=s \\end{alignedat} \\\\ c&=d \\end{align*}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*} a&amp;=b \\begin{alignedat}{-2} r&amp;=s \\end{alignedat} \\\\ c&amp;=d \\end{align*}" display="block">\n  <merror data-mjx-error="Argument to \\begin{alignedat} must be a positive integer">\n    <mtext>Argument to \\begin{alignedat} must be a positive integer</mtext>\n  </merror>\n</math>'
    ));
  it('MultlineRowsOneCol', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\b&c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\b&amp;c\\end{multline}" display="block">\n  <merror data-mjx-error="The rows within the multline environment must have exactly one column">\n    <mtext>The rows within the multline environment must have exactly one column</mtext>\n  </merror>\n</math>'
    ));
});

describe('InternalMath', () => {
  it('Mbox Eqref', () =>
    toXmlMatch(
      tex2mml('a\\mbox{ \\eqref{1} } c'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\mbox{ \\eqref{1} } c" display="block">\n  <mi data-latex="a">a</mi>\n  <mstyle displaystyle="false" scriptlevel="0" data-latex="\\mbox{ \\eqref{1} }">\n    <mtext>&#xA0;</mtext>\n    <mrow data-mjx-texclass="ORD">\n      <mrow href="#" class="MathJax_ref" data-latex="\\eqref{1}">\n        <mtext>(???)</mtext>\n      </mrow>\n    </mrow>\n    <mtext>&#xA0;</mtext>\n  </mstyle>\n  <mi data-latex="c">c</mi>\n</math>'
    ));
});

describe('Multirel', () => {
  it('Multirel Mathvariant 1', () =>
    toXmlMatch(
      tex2mml('a <\\equiv \\mathrm{=>}\\thickapprox b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;\\equiv \\mathrm{=&gt;}\\thickapprox b" display="block">\n  <mi data-latex="a">a</mi>\n  <mo data-latex="&lt;" rspace="0pt">&lt;</mo>\n  <mo data-latex="\\equiv" lspace="0pt">&#x2261;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{=&gt;}">\n    <mo data-latex="=" rspace="0pt">=</mo>\n    <mo data-latex="&gt;" lspace="0pt">&gt;</mo>\n  </mrow>\n  <mo data-mjx-alternate="1" data-latex="\\thickapprox">&#x2248;</mo>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('Multirel Mathvariant 2', () =>
    toXmlMatch(
      tex2mml('a <\\equiv \\mathrm{=>}\\thickapprox\\thicksim b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;\\equiv \\mathrm{=&gt;}\\thickapprox\\thicksim b" display="block">\n  <mi data-latex="a">a</mi>\n  <mo data-latex="&lt;" rspace="0pt">&lt;</mo>\n  <mo data-latex="\\equiv" lspace="0pt">&#x2261;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{=&gt;}">\n    <mo data-latex="=" rspace="0pt">=</mo>\n    <mo data-latex="&gt;" lspace="0pt">&gt;</mo>\n  </mrow>\n  <mo data-mjx-alternate="1" data-latex="\\thickapprox" rspace="0pt">&#x2248;</mo>\n  <mo data-mjx-alternate="1" data-latex="\\thicksim" lspace="0pt">&#x223C;</mo>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('Multirel Mathvariant 3', () =>
    toXmlMatch(
      tex2mml('a <\\equiv =>\\thickapprox\\thicksim b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;\\equiv =&gt;\\thickapprox\\thicksim b" display="block">\n  <mi data-latex="a">a</mi>\n  <mo data-latex="&lt;" rspace="0pt">&lt;</mo>\n  <mo data-latex="\\equiv" lspace="0pt" rspace="0pt">&#x2261;</mo>\n  <mo data-latex="=" lspace="0pt" rspace="0pt">=</mo>\n  <mo data-latex="&gt;" lspace="0pt" rspace="0pt">&gt;</mo>\n  <mo data-mjx-alternate="1" data-latex="\\thickapprox" lspace="0pt" rspace="0pt">&#x2248;</mo>\n  <mo data-mjx-alternate="1" data-latex="\\thicksim" lspace="0pt">&#x223C;</mo>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('Multirel Mathvariant 4', () =>
    toXmlMatch(
      tex2mml(
        'a <\\equiv \\mathrm{=}\\mathrm{>}\\thickapprox\\thicksim\\frown\\smile=\\updownarrow b'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;\\equiv \\mathrm{=}\\mathrm{&gt;}\\thickapprox\\thicksim\\frown\\smile=\\updownarrow b" display="block">\n  <mi data-latex="a">a</mi>\n  <mo data-latex="&lt;" rspace="0pt">&lt;</mo>\n  <mo data-latex="\\equiv" lspace="0pt">&#x2261;</mo>\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{=}">\n    <mo data-latex="=">=</mo>\n  </mrow>\n  <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{&gt;}">\n    <mo data-latex="&gt;">&gt;</mo>\n  </mrow>\n  <mo data-mjx-alternate="1" data-latex="\\thickapprox" rspace="0pt">&#x2248;</mo>\n  <mo data-mjx-alternate="1" data-latex="\\thicksim" lspace="0pt" rspace="0pt">&#x223C;</mo>\n  <mo data-latex="\\frown" lspace="0pt" rspace="0pt">&#x2322;</mo>\n  <mo data-latex="\\smile" lspace="0pt" rspace="0pt">&#x2323;</mo>\n  <mo data-latex="=" lspace="0pt" rspace="0pt">=</mo>\n  <mo stretchy="false" data-latex="\\updownarrow" lspace="0pt">&#x2195;</mo>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('Preset Lspace Rspace', () =>
    toXmlMatch(
      tex2mml('a\\lesssim\\gtrsim b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\lesssim\\gtrsim b" display="block">\n  <mi data-latex="a">a</mi>\n  <mo data-latex="\\lesssim" rspace="0pt">&#x2272;</mo>\n  <mo data-latex="\\gtrsim" lspace="0pt">&#x2273;</mo>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('Preset Rspace Lspace', () =>
    toXmlMatch(
      tex2mml('a\\gtrsim\\lesssim b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\gtrsim\\lesssim b" display="block">\n  <mi data-latex="a">a</mi>\n  <mo data-latex="\\gtrsim" rspace="0pt">&#x2273;</mo>\n  <mo data-latex="\\lesssim" lspace="0pt">&#x2272;</mo>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
});

describe('MultlineShove', () => {
  it('Shove None', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b\\\\ c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b\\\\ c\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\ b\\\\ c\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Shove Left Top', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}\\shoveleft a\\\\ b\\\\ c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}\\shoveleft a\\\\ b\\\\ c\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}\\shoveleft a\\\\ b\\\\ c\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Shove Left Middle', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\\\shoveleft b\\\\ c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\\\shoveleft b\\\\ c\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\\\shoveleft b\\\\ c\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Shove Left Bottom', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b\\\\\\shoveleft c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b\\\\\\shoveleft c\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\ b\\\\\\shoveleft c\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Shove Right Top', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}\\shoveright a\\\\ b\\\\ c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}\\shoveright a\\\\ b\\\\ c\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}\\shoveright a\\\\ b\\\\ c\\end{multline}">\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Shove Right Middle', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\\\shoveright b\\\\ c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\\\shoveright b\\\\ c\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\\\shoveright b\\\\ c\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Shove Right Bottom', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b\\\\\\shoveright c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b\\\\\\shoveright c\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\ b\\\\\\shoveright c\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Shove Right Left', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{multline} a\\\\\\shoveright\\shoveleft b\\\\ c\\end{multline}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\\\shoveright\\shoveleft b\\\\ c\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\\\shoveright\\shoveleft b\\\\ c\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Shove Left Right', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{multline} a\\\\\\shoveleft\\shoveright b\\\\ c\\end{multline}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\\\shoveleft\\shoveright b\\\\ c\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\\\\\shoveleft\\shoveright b\\\\ c\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Shove Error Top', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a \\shoveleft\\\\ b\\\\ c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a \\shoveleft\\\\ b\\\\ c\\end{multline}" display="block">\n  <merror data-mjx-error="\\shoveleft must come at the beginning of the line">\n    <mtext>\\shoveleft must come at the beginning of the line</mtext>\n  </merror>\n</math>'
    ));
  it('Shove Error Middle', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b \\shoveleft\\\\ c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b \\shoveleft\\\\ c\\end{multline}" display="block">\n  <merror data-mjx-error="\\shoveleft must come at the beginning of the line">\n    <mtext>\\shoveleft must come at the beginning of the line</mtext>\n  </merror>\n</math>'
    ));
  it('Shove Error Bottom', () =>
    toXmlMatch(
      tex2mml('\\begin{multline} a\\\\ b\\\\ c \\shoveleft\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\\\ b\\\\ c \\shoveleft\\end{multline}" display="block">\n  <merror data-mjx-error="\\shoveleft must come at the beginning of the line">\n    <mtext>\\shoveleft must come at the beginning of the line</mtext>\n  </merror>\n</math>'
    ));
  it('Shove Error Environment', () =>
    toXmlMatch(
      tex2mml('\\begin{align}\\shoveleft a\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}\\shoveleft a\\end{align}" display="block">\n  <merror data-mjx-error="\\shoveleft only allowed in multline environment">\n    <mtext>\\shoveleft only allowed in multline environment</mtext>\n  </merror>\n</math>'
    ));
});

describe('Ams Complex', () => {
  it('The Lorenz Equations', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}\\dot{x} & = \\sigma(y-x) \\\\\\dot{y} & = \\rho x - y - xz \\\\\\dot{z} & = -\\beta z + xy\\end{align}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}\\dot{x} &amp; = \\sigma(y-x) \\\\\\dot{y} &amp; = \\rho x - y - xz \\\\\\dot{z} &amp; = -\\beta z + xy\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align}\\dot{x} &amp; = \\sigma(y-x) \\\\\\dot{y} &amp; = \\rho x - y - xz \\\\\\dot{z} &amp; = -\\beta z + xy\\end{align}">\n    <mtr>\n      <mtd>\n        <mrow data-mjx-texclass="ORD" data-latex="\\dot{x}">\n          <mover>\n            <mi data-latex="x">x</mi>\n            <mo>&#x2D9;</mo>\n          </mover>\n        </mrow>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="\\sigma">&#x3C3;</mi>\n          <mo data-latex="(" stretchy="false">(</mo>\n          <mi data-latex="y">y</mi>\n          <mo data-latex="-">&#x2212;</mo>\n          <mi data-latex="x">x</mi>\n          <mo data-latex=")" stretchy="false">)</mo>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mrow data-mjx-texclass="ORD" data-latex="\\dot{y}">\n          <mover>\n            <mi data-latex="y">y</mi>\n            <mo>&#x2D9;</mo>\n          </mover>\n        </mrow>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="\\rho">&#x3C1;</mi>\n          <mi data-latex="x">x</mi>\n          <mo data-latex="-">&#x2212;</mo>\n          <mi data-latex="y">y</mi>\n          <mo data-latex="-">&#x2212;</mo>\n          <mi data-latex="x">x</mi>\n          <mi data-latex="z">z</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mrow data-mjx-texclass="ORD" data-latex="\\dot{z}">\n          <mover>\n            <mi data-latex="z">z</mi>\n            <mo>&#x2D9;</mo>\n          </mover>\n        </mrow>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mo data-latex="-">&#x2212;</mo>\n          <mi data-latex="\\beta">&#x3B2;</mi>\n          <mi data-latex="z">z</mi>\n          <mo data-latex="+">+</mo>\n          <mi data-latex="x">x</mi>\n          <mi data-latex="y">y</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it("Maxwell's Equations", () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align} \\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} & = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\  \\nabla \\cdot \\vec{\\mathbf{E}} & = 4 \\pi \\rho \\\\  \\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} & = \\vec{\\mathbf{0}} \\\\  \\nabla \\cdot \\vec{\\mathbf{B}} & = 0 \\end{align}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align} \\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} &amp; = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\  \\nabla \\cdot \\vec{\\mathbf{E}} &amp; = 4 \\pi \\rho \\\\  \\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} &amp; = \\vec{\\mathbf{0}} \\\\  \\nabla \\cdot \\vec{\\mathbf{B}} &amp; = 0 \\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align} \\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} &amp; = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\  \\nabla \\cdot \\vec{\\mathbf{E}} &amp; = 4 \\pi \\rho \\\\  \\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} &amp; = \\vec{\\mathbf{0}} \\\\  \\nabla \\cdot \\vec{\\mathbf{B}} &amp; = 0 \\end{align}">\n    <mtr>\n      <mtd>\n        <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>\n        <mo data-latex="\\times">&#xD7;</mo>\n        <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{B}}">\n          <mover>\n            <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{B}">\n              <mi mathvariant="bold" data-latex="B">B</mi>\n            </mrow>\n            <mo stretchy="false">&#x2192;</mo>\n          </mover>\n        </mrow>\n        <mo data-latex="-">&#x2212;</mo>\n        <mstyle scriptlevel="0" data-latex="\\,">\n          <mspace width="0.167em"></mspace>\n        </mstyle>\n        <mfrac data-latex="\\frac1c">\n          <mn data-latex="1">1</mn>\n          <mi data-latex="c">c</mi>\n        </mfrac>\n        <mstyle scriptlevel="0" data-latex="\\,">\n          <mspace width="0.167em"></mspace>\n        </mstyle>\n        <mfrac data-latex="\\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t}">\n          <mrow data-latex="\\partial\\vec{\\mathbf{E}}">\n            <mi data-latex="\\partial">&#x2202;</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{E}}">\n              <mover>\n                <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{E}">\n                  <mi mathvariant="bold" data-latex="E">E</mi>\n                </mrow>\n                <mo stretchy="false">&#x2192;</mo>\n              </mover>\n            </mrow>\n          </mrow>\n          <mrow data-latex="\\partial t">\n            <mi data-latex="\\partial">&#x2202;</mi>\n            <mi data-latex="t">t</mi>\n          </mrow>\n        </mfrac>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mfrac data-latex="\\frac{4\\pi}{c}">\n            <mrow data-latex="4\\pi">\n              <mn data-latex="4">4</mn>\n              <mi data-latex="\\pi">&#x3C0;</mi>\n            </mrow>\n            <mi data-latex="c">c</mi>\n          </mfrac>\n          <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{j}}">\n            <mover>\n              <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{j}">\n                <mi mathvariant="bold" data-latex="j">j</mi>\n              </mrow>\n              <mo stretchy="false">&#x2192;</mo>\n            </mover>\n          </mrow>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>\n        <mo data-latex="\\cdot">&#x22C5;</mo>\n        <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{E}}">\n          <mover>\n            <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{E}">\n              <mi mathvariant="bold" data-latex="E">E</mi>\n            </mrow>\n            <mo stretchy="false">&#x2192;</mo>\n          </mover>\n        </mrow>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mn data-latex="4">4</mn>\n          <mi data-latex="\\pi">&#x3C0;</mi>\n          <mi data-latex="\\rho">&#x3C1;</mi>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>\n        <mo data-latex="\\times">&#xD7;</mo>\n        <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{E}}">\n          <mover>\n            <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{E}">\n              <mi mathvariant="bold" data-latex="E">E</mi>\n            </mrow>\n            <mo stretchy="false">&#x2192;</mo>\n          </mover>\n        </mrow>\n        <mstyle scriptlevel="0" data-latex="\\,">\n          <mspace width="0.167em"></mspace>\n        </mstyle>\n        <mo data-latex="+">+</mo>\n        <mstyle scriptlevel="0" data-latex="\\,">\n          <mspace width="0.167em"></mspace>\n        </mstyle>\n        <mfrac data-latex="\\frac1c">\n          <mn data-latex="1">1</mn>\n          <mi data-latex="c">c</mi>\n        </mfrac>\n        <mstyle scriptlevel="0" data-latex="\\,">\n          <mspace width="0.167em"></mspace>\n        </mstyle>\n        <mfrac data-latex="\\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t}">\n          <mrow data-latex="\\partial\\vec{\\mathbf{B}}">\n            <mi data-latex="\\partial">&#x2202;</mi>\n            <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{B}}">\n              <mover>\n                <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{B}">\n                  <mi mathvariant="bold" data-latex="B">B</mi>\n                </mrow>\n                <mo stretchy="false">&#x2192;</mo>\n              </mover>\n            </mrow>\n          </mrow>\n          <mrow data-latex="\\partial t">\n            <mi data-latex="\\partial">&#x2202;</mi>\n            <mi data-latex="t">t</mi>\n          </mrow>\n        </mfrac>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{0}}">\n            <mover>\n              <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{0}">\n                <mn mathvariant="bold" data-latex="0">0</mn>\n              </mrow>\n              <mo stretchy="false">&#x2192;</mo>\n            </mover>\n          </mrow>\n        </mstyle>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi mathvariant="normal" data-latex="\\nabla">&#x2207;</mi>\n        <mo data-latex="\\cdot">&#x22C5;</mo>\n        <mrow data-mjx-texclass="ORD" data-latex="\\vec{\\mathbf{B}}">\n          <mover>\n            <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{B}">\n              <mi mathvariant="bold" data-latex="B">B</mi>\n            </mrow>\n            <mo stretchy="false">&#x2192;</mo>\n          </mover>\n        </mrow>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mn data-latex="0">0</mn>\n        </mstyle>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Cubic Binomial', () =>
    toXmlMatch(
      tex2mml(
        '{\\begin{eqnarray}(x+y)^{3}&=&(x+y)(x+y)(x+y)\\\\&=&xxx+xxy+xyx+{\\underline {xyy}}+yxx+{\\underline {yxy}}+{\\underline {yyx}}+yyy\\\\&=&x^{3}+3x^{2}y+{\\underline {3xy^{2}}}+y^{3}.\\end{eqnarray}}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{\\begin{eqnarray}(x+y)^{3}&amp;=&amp;(x+y)(x+y)(x+y)\\\\&amp;=&amp;xxx+xxy+xyx+{\\underline {xyy}}+yxx+{\\underline {yxy}}+{\\underline {yyx}}+yyy\\\\&amp;=&amp;x^{3}+3x^{2}y+{\\underline {3xy^{2}}}+y^{3}.\\end{eqnarray}}" display="block">\n  <merror data-mjx-error="Erroneous nesting of equation structures">\n    <mtext>Erroneous nesting of equation structures</mtext>\n  </merror>\n</math>'
    ));
  it('A Cross Product Formula', () =>
    toXmlMatch(
      tex2mml(
        '\\mathbf{V}_1 \\times \\mathbf{V}_2 =   \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\    \\frac{\\partial X}{\\partial u} & \\frac{\\partial Y}{\\partial u} & 0 \\\\    \\frac{\\partial X}{\\partial v} & \\frac{\\partial Y}{\\partial v} & 0 \\\\   \\end{vmatrix}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbf{V}_1 \\times \\mathbf{V}_2 =   \\begin{vmatrix} \\mathbf{i} &amp; \\mathbf{j} &amp; \\mathbf{k} \\\\    \\frac{\\partial X}{\\partial u} &amp; \\frac{\\partial Y}{\\partial u} &amp; 0 \\\\    \\frac{\\partial X}{\\partial v} &amp; \\frac{\\partial Y}{\\partial v} &amp; 0 \\\\   \\end{vmatrix}" display="block">\n  <msub data-latex="\\mathbf{V}_1">\n    <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{V}">\n      <mi mathvariant="bold" data-latex="V">V</mi>\n    </mrow>\n    <mn data-latex="1">1</mn>\n  </msub>\n  <mo data-latex="\\times">&#xD7;</mo>\n  <msub data-latex="\\mathbf{V}_2">\n    <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{V}">\n      <mi mathvariant="bold" data-latex="V">V</mi>\n    </mrow>\n    <mn data-latex="2">2</mn>\n  </msub>\n  <mo data-latex="=">=</mo>\n  <mrow data-mjx-texclass="INNER" data-latex-item="{vmatrix}" data-latex="{vmatrix}">\n    <mo data-mjx-texclass="OPEN">|</mo>\n    <mtable columnspacing="1em" rowspacing="4pt">\n      <mtr>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{i}">\n            <mi mathvariant="bold" data-latex="i">i</mi>\n          </mrow>\n        </mtd>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{j}">\n            <mi mathvariant="bold" data-latex="j">j</mi>\n          </mrow>\n        </mtd>\n        <mtd>\n          <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{k}">\n            <mi mathvariant="bold" data-latex="k">k</mi>\n          </mrow>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mfrac data-latex="\\frac{\\partial X}{\\partial u}">\n            <mrow data-latex="\\partial X">\n              <mi data-latex="\\partial">&#x2202;</mi>\n              <mi data-latex="X">X</mi>\n            </mrow>\n            <mrow data-latex="\\partial u">\n              <mi data-latex="\\partial">&#x2202;</mi>\n              <mi data-latex="u">u</mi>\n            </mrow>\n          </mfrac>\n        </mtd>\n        <mtd>\n          <mfrac data-latex="\\frac{\\partial Y}{\\partial u}">\n            <mrow data-latex="\\partial Y">\n              <mi data-latex="\\partial">&#x2202;</mi>\n              <mi data-latex="Y">Y</mi>\n            </mrow>\n            <mrow data-latex="\\partial u">\n              <mi data-latex="\\partial">&#x2202;</mi>\n              <mi data-latex="u">u</mi>\n            </mrow>\n          </mfrac>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n      <mtr>\n        <mtd>\n          <mfrac data-latex="\\frac{\\partial X}{\\partial v}">\n            <mrow data-latex="\\partial X">\n              <mi data-latex="\\partial">&#x2202;</mi>\n              <mi data-latex="X">X</mi>\n            </mrow>\n            <mrow data-latex="\\partial v">\n              <mi data-latex="\\partial">&#x2202;</mi>\n              <mi data-latex="v">v</mi>\n            </mrow>\n          </mfrac>\n        </mtd>\n        <mtd>\n          <mfrac data-latex="\\frac{\\partial Y}{\\partial v}">\n            <mrow data-latex="\\partial Y">\n              <mi data-latex="\\partial">&#x2202;</mi>\n              <mi data-latex="Y">Y</mi>\n            </mrow>\n            <mrow data-latex="\\partial v">\n              <mi data-latex="\\partial">&#x2202;</mi>\n              <mi data-latex="v">v</mi>\n            </mrow>\n          </mfrac>\n        </mtd>\n        <mtd>\n          <mn data-latex="0">0</mn>\n        </mtd>\n      </mtr>\n    </mtable>\n    <mo data-mjx-texclass="CLOSE">|</mo>\n  </mrow>\n</math>'
    ));
});
