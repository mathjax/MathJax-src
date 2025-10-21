import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTex(['base', 'ams']));

/**********************************************************************************/
/**********************************************************************************/

describe('Ams', () => {

  /********************************************************************************/

  it('Symbol', () => {
    toXmlMatch(
      tex2mml('\\digamma'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\digamma" display="block">
         <mi data-latex="\\digamma">&#x3DD;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Operator', () => {
    toXmlMatch(
      tex2mml('\\dotplus'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dotplus" display="block">
         <mo data-latex="\\dotplus">&#x2214;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('Delimiter', () => {
    toXmlMatch(
      tex2mml('\\ulcorner'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ulcorner" display="block">
         <mo data-latex="\\ulcorner">&#x231C;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('Delimiter-left-right', () => {
    toXmlMatch(
      tex2mml('\\left\\ulcorner A \\right\\urcorner'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\ulcorner A \\right\\urcorner" display="block">
         <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\ulcorner A \\right\\urcorner" data-latex="\\left\\ulcorner A \\right\\urcorner">
           <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left\\ulcorner " data-latex="\\left\\ulcorner ">&#x231C;</mo>
           <mi data-latex="A">A</mi>
           <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right\\urcorner" data-latex="\\right\\urcorner">&#x231D;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Macro', () => {
    toXmlMatch(
      tex2mml('A\\implies B'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A\\implies B" display="block">
         <mi data-latex="A">A</mi>
         <mspace width="0.278em" data-latex="\\;"></mspace>
         <mo stretchy="false" data-latex="\\Longrightarrow">&#x27F9;</mo>
         <mspace width="0.278em" data-latex="\\;"></mspace>
         <mi data-latex="B">B</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('AMS-math-mo', () => {
    toXmlMatch(
      tex2mml('\\iiiint'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\iiiint" display="block">
         <mo data-mjx-texclass="OP" data-latex="\\iiiint">&#x2A0C;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('AMS-math-macro', () => {
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
    );
  });

  /********************************************************************************/

  it('Normal Fraction', () => {
    toXmlMatch(
      tex2mml('\\frac{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\frac{n}{k}" display="block">
         <mfrac data-latex="\\frac{n}{k}">
           <mi data-latex="n">n</mi>
           <mi data-latex="k">k</mi>
         </mfrac>
       </math>`
    );
  });

  /********************************************************************************/

  it('Text Fraction', () => {
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
    );
  });

  /********************************************************************************/

  it('Display Fraction', () => {
    toXmlMatch(
      tex2mml('\\dfrac{n}{k}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\dfrac{n}{k}" display="block">
         <mfrac data-latex="\\dfrac{n}{k}">
           <mi data-latex="n">n</mi>
           <mi data-latex="k">k</mi>
         </mfrac>
       </math>`
    );
  });

  /********************************************************************************/

  it('Normal Sub Fraction', () => {
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
    );
  });

  /********************************************************************************/

  it('Text Sub Fraction', () => {
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
    );
  });

  /********************************************************************************/

  it('Display Sub Fraction', () => {
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
    );
  });

  /********************************************************************************/

  it('Normal Binomial', () => {
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
    );
  });

  /********************************************************************************/

  it('Text Binomial', () => {
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
    );
  });

  /********************************************************************************/

  it('Display Binomial', () => {
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
    );
  });

  /********************************************************************************/

  it('Normal Sub Binomial', () => {
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
    );
  });

  /********************************************************************************/

  it('Text Sub Binomial', () => {
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
    );
  });

  /********************************************************************************/

  it('Display Sub Binomial', () => {
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
    );
  });

  /********************************************************************************/

  it('Center Fraction', () => {
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
    );
  });

  /********************************************************************************/

  it('Left Fraction', () => {
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
    );
  });

  /********************************************************************************/

  it('Right Fraction', () => {
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
    );
  });

  /********************************************************************************/

  it('Above Left Arrow', () => {
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
    );
  });

  /********************************************************************************/

  it('Above Below Left Arrow', () => {
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
    );
  });

  /********************************************************************************/

  it('Above Left Arrow in Context', () => {
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
    );
  });

  /********************************************************************************/

  it('Above Right Arrow', () => {
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
    );
  });

  /********************************************************************************/

  it('Above Below Right Arrow', () => {
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
    );
  });

  /********************************************************************************/

  it('Above Right Arrow in Context', () => {
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
    );
  });

  /********************************************************************************/

  it('Genfrac', () => {
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
    );
  });

  /********************************************************************************/

  it('Genfrac no delimiters', () => {
    toXmlMatch(
      tex2mml('\\genfrac{}{}{0pt}{3}{a}{b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\genfrac{}{}{0pt}{3}{a}{b}" display="block">
         <mstyle displaystyle="false" scriptlevel="2" data-latex="\\genfrac{}{}{0pt}{3}{a}{b}">
           <mfrac linethickness="0pt">
             <mi data-latex="a">a</mi>
             <mi data-latex="b">b</mi>
           </mfrac>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  it('MultiInt', () => {
    toXmlMatch(
      tex2mml('\\idotsint'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\idotsint" display="block">
         <mo data-latex="\\int">&#x222B;</mo>
         <mo data-latex="\\cdots">&#x22EF;</mo>
         <mo data-latex="\\int">&#x222B;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('MultiInt in Context', () => {
    toXmlMatch(
      tex2mml('a \\idotsint b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\idotsint b" display="block">
         <mi data-latex="a">a</mi>
         <mo data-latex="\\int">&#x222B;</mo>
         <mo data-latex="\\cdots">&#x22EF;</mo>
         <mo data-latex="\\int">&#x222B;</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('MultiInt with Command', () => {
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
    );
  });

  /********************************************************************************/

  it('MultiInt with Limits', () => {
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
    );
  });

  /********************************************************************************/

  it('DeclareMathOp', () => {
    toXmlMatch(
      tex2mml('\\DeclareMathOperator{\\R}{R}a\\R b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\DeclareMathOperator{\\R}{R}a\\R b" display="block">
         <mi data-latex="a">a</mi>
         <mi data-mjx-texclass="OP" mathvariant="normal" data-latex="\\operatorname{R}">R</mi>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('DeclareMathOp star', () => {
    toXmlMatch(
      tex2mml('\\DeclareMathOperator*{\\R}{R}a\\R b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\DeclareMathOperator*{\\R}{R}a\\R b" display="block">
         <mi data-latex="a">a</mi>
         <mi data-mjx-texclass="OP" mathvariant="normal" data-latex="\\operatorname*{R}">R</mi>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Operatorname', () => {
    toXmlMatch(
      tex2mml('a\\operatorname{xyz}b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\operatorname{xyz}b" display="block">
         <mi data-latex="a">a</mi>
         <mi data-latex="\\operatorname{xyz}">xyz</mi>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Operatorname Complex', () => {
    toXmlMatch(
      tex2mml('\\operatorname{a+}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\operatorname{a+}" display="block">
         <mrow data-mjx-texclass="OP" data-latex="\\operatorname{a+}">
           <mi mathvariant="normal" data-latex="a">a</mi>
           <mo data-latex="+">+</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Operatorname Letters', () => {
    toXmlMatch(
      tex2mml('*\\operatorname{*c}-\\operatorname{-a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="*\\operatorname{*c}-\\operatorname{-a}" display="block">
         <mo data-latex="*">&#x2217;</mo>
         <mi data-mjx-texclass="OP" data-latex="\\operatorname{*c}">*c</mi>
         <mo data-latex="-">&#x2212;</mo>
         <mi data-mjx-texclass="OP" data-latex="\\operatorname{-a}">-a</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Operatorname Followed by CS', () => {
    toXmlMatch(
      tex2mml('\\operatorname{a+}\\alpha'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\operatorname{a+}\\alpha" display="block">
         <mrow data-mjx-texclass="OP" data-latex="\\operatorname{a+}">
           <mi mathvariant="normal" data-latex="a">a</mi>
           <mo data-latex="+">+</mo>
         </mrow>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mi data-latex="\\alpha">&#x3B1;</mi>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Ams Environments', () => {

  /********************************************************************************/

  it('Subarray', () => {
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
    );
  });

  /********************************************************************************/

  it('Small Matrix', () => {
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
    );
  });

  /********************************************************************************/

  it('Align', () => {
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
    );
  });

  /********************************************************************************/

  it('Align Star', () => {
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
    );
  });

  /********************************************************************************/

  it('Multline', () => {
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
    );
  });

  /********************************************************************************/

  it('Multline Star', () => {
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
    );
  });

  /********************************************************************************/

  it('Split', () => {
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
    );
  });

  /********************************************************************************/

  it('Gather', () => {
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
    );
  });

  /********************************************************************************/

  it('Gather Star', () => {
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
    );
  });

  /********************************************************************************/

  it('Alignat', () => {
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
    );
  });

  /********************************************************************************/

  it('Alignat Star', () => {
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
    );
  });

  /********************************************************************************/

  it('Alignedat', () => {
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
    );
  });

  /********************************************************************************/

  it('Aligned', () => {
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
    );
  });

  /********************************************************************************/

  it('Gathered', () => {
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
    );
  });

  /********************************************************************************/

  it('Equation', () => {
    toXmlMatch(
      tex2mml('\\begin{equation} a \\end{equation}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation} a \\end{equation}" display="block">
         <mi data-latex="\\begin{equation} a \\end{equation}" data-latex-item="{equation}">a</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Equation Star', () => {
    toXmlMatch(
      tex2mml('\\begin{equation*} a \\end{equation*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation*} a \\end{equation*}" display="block">
         <mi data-latex="\\begin{equation*} a \\end{equation*}" data-latex-item="{equation*}">a</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Eqnarray', () => {
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
    );
  });

  /********************************************************************************/

  it('Eqnarray Star', () => {
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
    );
  });

  /********************************************************************************/

  it('flalign', () => {
    toXmlMatch(
      tex2mml('\\begin{flalign} a & = & b\\\\ c & = & d \\end{flalign}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{flalign} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{flalign}" display="block">
         <mtable width="100%" displaystyle="true" columnalign="right left center right" columnspacing="0em" columnwidth="auto auto fit auto" rowspacing="3pt" data-break-align="bottom top middle bottom" data-width-includes-label="true" data-latex-item="{flalign}" data-latex="\\begin{flalign} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{flalign}">
           <mtr>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="=">=</mo>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mi data-latex="b">b</mi>
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
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mi data-latex="d">d</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('xalignat', () => {
    toXmlMatch(
      tex2mml('\\begin{xalignat}{2} a&b & c&d \\end{xalignat}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{xalignat}{2} a&amp;b &amp; c&amp;d \\end{xalignat}" display="block">
         <mtable width="100%" displaystyle="true" columnalign="center right left center right left center" columnspacing="0em" columnwidth="fit auto auto fit auto auto fit" rowspacing="3pt" data-break-align="middle bottom top middle bottom top middle" minlabelspacing="0" data-width-includes-label="true" data-latex-item="{xalignat}" data-latex="\\begin{xalignat}{2} a&amp;b &amp; c&amp;d \\end{xalignat}">
           <mtr data-latex-item="{2}" data-latex="{2}">
             <mtd></mtd>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="b">b</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mi data-latex="c">c</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="d">d</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('xalignat error', () => {
    expectTexError('\\begin{xalignat}{x} \\and{xalignat}')
      .toBe('Argument to \\begin{xalignat} must be a positive integer');
  });

  /********************************************************************************/

  it('xxalignat', () => {
    toXmlMatch(
      tex2mml('\\begin{xxalignat}{2} a&b & c&d \\end{xxalignat}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{xxalignat}{2} a&amp;b &amp; c&amp;d \\end{xxalignat}" display="block">
         <mtable width="100%" displaystyle="true" columnalign="right left center right left" columnspacing="0em" columnwidth="auto auto fit auto auto" rowspacing="3pt" data-break-align="bottom top middle bottom top" minlabelspacing="0" data-width-includes-label="true" data-latex-item="{xxalignat}" data-latex="\\begin{xxalignat}{2} a&amp;b &amp; c&amp;d \\end{xxalignat}">
           <mtr data-latex-item="{2}" data-latex="{2}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="b">b</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mi data-latex="c">c</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="d">d</mi>
               </mstyle>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('xalignat error 2', () => {
    expectTexError('\\begin{xalignat}{1} a&b & \\end{xalignat}')
      .toBe('Extra & in row of xalignat');
  });

  /********************************************************************************/

  it('xalignat padding', () => {
    toXmlMatch(
      tex2mml('\\begin{xalignat}{2} a&b \\end{xalignat}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{xalignat}{2} a&amp;b \\end{xalignat}" display="block">
         <mtable width="100%" displaystyle="true" columnalign="center right left center right left center" columnspacing="0em" columnwidth="fit auto auto fit auto auto fit" rowspacing="3pt" data-break-align="middle bottom top middle bottom top middle" minlabelspacing="0" data-width-includes-label="true" data-latex-item="{xalignat}" data-latex="\\begin{xalignat}{2} a&amp;b \\end{xalignat}">
           <mtr data-latex-item="{2}" data-latex="{2}">
             <mtd></mtd>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="b">b</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
             <mtd></mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('xalign tagged', () => {
    toXmlMatch(
      tex2mml('\\begin{xalignat}{2} a & b \\tag{1}\\end{xalignat}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{xalignat}{2} a &amp; b \\tag{1}\\end{xalignat}" display="block">
         <mtable width="100%" displaystyle="true" columnalign="center right left center right left center" columnspacing="0em" columnwidth="fit auto auto fit auto auto fit" rowspacing="3pt" data-break-align="middle bottom top middle bottom top middle" minlabelspacing="0" data-width-includes-label="true" data-latex-item="{xalignat}" data-latex="\\begin{xalignat}{2} a &amp; b \\tag{1}\\end{xalignat}">
           <mlabeledtr data-latex-item="{2}" data-latex="{2}">
             <mtd id="mjx-eqn:1">
               <mpadded width="0" lspace="-1width">
                 <mtext data-latex="\\text{(}">(</mtext>
                 <mtext data-latex="\\text{1}">1</mtext>
                 <mtext data-latex="\\text{)}">)</mtext>
               </mpadded>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="\\tag{1}">b</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
             <mtd></mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('flalign small', () => {
    toXmlMatch(
      tex2mml('\\begin{flalign} a&b \\end{flalign}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{flalign} a&amp;b \\end{flalign}" display="block">
         <mtable displaystyle="true" columnalign="right left" columnspacing="0em" columnwidth="auto auto" rowspacing="3pt" data-break-align="bottom top" data-width-includes-label="true" data-latex-item="{flalign}" data-latex="\\begin{flalign} a&amp;b \\end{flalign}">
           <mtr>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="b">b</mi>
               </mstyle>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('matrix', () => {
    toXmlMatch(
      tex2mml('\\begin{matrix} a & b \\\\ c & d \\end{matrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{matrix} a &amp; b \\\\ c &amp; d \\end{matrix}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" data-latex-item="{matrix}" data-latex="\\begin{matrix} a &amp; b \\\\ c &amp; d \\end{matrix}">
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
       </math>`
    );
  });

  /********************************************************************************/

  it('pmatrix', () => {
    toXmlMatch(
      tex2mml('\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{pmatrix} a &amp; b \\\\ c &amp; d \\end{pmatrix}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex-item="{pmatrix}" data-latex="\\begin{pmatrix} a &amp; b \\\\ c &amp; d \\end{pmatrix}">
           <mo data-mjx-texclass="OPEN">(</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
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
           <mo data-mjx-texclass="CLOSE">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('bmatrix', () => {
    toXmlMatch(
      tex2mml('\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{bmatrix} a &amp; b \\\\ c &amp; d \\end{bmatrix}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex-item="{bmatrix}" data-latex="\\begin{bmatrix} a &amp; b \\\\ c &amp; d \\end{bmatrix}">
           <mo data-mjx-texclass="OPEN">[</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
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
           <mo data-mjx-texclass="CLOSE">]</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Bmatrix', () => {
    toXmlMatch(
      tex2mml('\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Bmatrix} a &amp; b \\\\ c &amp; d \\end{Bmatrix}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex-item="{Bmatrix}" data-latex="\\begin{Bmatrix} a &amp; b \\\\ c &amp; d \\end{Bmatrix}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
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
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Vmatrix', () => {
    toXmlMatch(
      tex2mml('\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Vmatrix} a &amp; b \\\\ c &amp; d \\end{Vmatrix}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex-item="{Vmatrix}" data-latex="\\begin{Vmatrix} a &amp; b \\\\ c &amp; d \\end{Vmatrix}">
           <mo data-mjx-texclass="OPEN">&#x2016;</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
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
           <mo data-mjx-texclass="CLOSE">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('cases', () => {
    toXmlMatch(
      tex2mml('f(x) = \\begin{cases} 1 & \\text{if $x > 1$} \\\\ 0 & \\text{otherwise} \\end{cases}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="f(x) = \\begin{cases} 1 &amp; \\text{if $x &gt; 1$} \\\\ 0 &amp; \\text{otherwise} \\end{cases}" display="block">
         <mi data-latex="f">f</mi>
         <mo data-latex="(" stretchy="false">(</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex=")" stretchy="false">)</mo>
         <mo data-latex="=">=</mo>
         <mrow data-mjx-texclass="INNER" data-latex-item="{cases}" data-latex="{cases}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mtable columnspacing="1em" rowspacing=".2em" columnalign="left left">
             <mtr>
               <mtd>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mrow data-latex="\\text{if $x &gt; 1$}">
                   <mtext>if&#xA0;</mtext>
                   <mrow data-mjx-texclass="ORD">
                     <mi data-latex="x">x</mi>
                     <mo data-latex="&gt;">&gt;</mo>
                     <mn data-latex="1">1</mn>
                   </mrow>
                 </mrow>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mn data-latex="0">0</mn>
               </mtd>
               <mtd>
                 <mtext data-latex="\\text{otherwise}">otherwise</mtext>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true"></mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Ams Tagged Environments', () => {
  beforeEach(() => setupTex(['base', 'ams'], { tags: 'ams' }));

  /********************************************************************************/

  it('Subarray', () => {
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
    );
  });

  /********************************************************************************/

  it('Small Matrix', () => {
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
    );
  });

  /********************************************************************************/

  it('Align', () => {
    toXmlMatch(
      tex2mml('\\begin{align} a&=b \\\\ c&=d \\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align} a&amp;=b \\\\ c&amp;=d \\end{align}" display="block">
         <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align} a&amp;=b \\\\ c&amp;=d \\end{align}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
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
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{2}">2</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
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
    );
  });

  /********************************************************************************/

  it('Align Star', () => {
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
    );
  });

  /********************************************************************************/

  it('Multline', () => {
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
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd columnalign="right">
               <mi data-latex="c">c</mi>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Multline Star', () => {
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
    );
  });

  /********************************************************************************/

  it('Split', () => {
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
    );
  });

  /********************************************************************************/

  it('Gather', () => {
    toXmlMatch(
      tex2mml('\\begin{gather} a=b \\\\ c=d \\end{gather}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{gather} a=b \\\\ c=d \\end{gather}" display="block">
         <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" data-latex-item="{gather}" data-latex="\\begin{gather} a=b \\\\ c=d \\end{gather}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mi data-latex="a">a</mi>
               <mo data-latex="=">=</mo>
               <mi data-latex="b">b</mi>
             </mtd>
           </mlabeledtr>
           <mlabeledtr>
             <mtd id="mjx-eqn:2">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{2}">2</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mi data-latex="c">c</mi>
               <mo data-latex="=">=</mo>
               <mi data-latex="d">d</mi>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Gather Star', () => {
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
    );
  });

  /********************************************************************************/

  it('Alignat', () => {
    toXmlMatch(
      tex2mml('\\begin{alignat}{2} a&=b \\\\ c&=d \\end{alignat}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{alignat}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat}" display="block">
         <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{alignat}" data-latex="\\begin{alignat}{2} a&amp;=b \\\\ c&amp;=d \\end{alignat}">
           <mlabeledtr data-latex-item="{2}" data-latex="{2}">
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
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
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{2}">2</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
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
    );
  });

  /********************************************************************************/

  it('Alignat Star', () => {
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
    );
  });

  /********************************************************************************/

  it('Alignedat', () => {
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
    );
  });

  /********************************************************************************/

  it('Aligned', () => {
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
    );
  });

  /********************************************************************************/

  it('Gathered', () => {
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
    );
  });

  /********************************************************************************/

  it('Equation', () => {
    toXmlMatch(
      tex2mml('\\begin{equation} a \\end{equation}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation} a \\end{equation}" display="block">
         <mtable displaystyle="true" data-latex-item="{equation}" data-latex="\\begin{equation} a \\end{equation}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Equation Star', () => {
    toXmlMatch(
      tex2mml('\\begin{equation*} a \\end{equation*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{equation*} a \\end{equation*}" display="block">
         <mi data-latex="\\begin{equation*} a \\end{equation*}" data-latex-item="{equation*}">a</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Eqnarray', () => {
    toXmlMatch(
      tex2mml('\\begin{eqnarray} a & = & b\\\\ c & = & d \\end{eqnarray}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{eqnarray} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray}" display="block">
         <mtable displaystyle="true" columnalign="right center left" columnspacing="0em 0.278em" rowspacing="3pt" data-break-align="bottom middle top" data-latex-item="{eqnarray}" data-latex="\\begin{eqnarray} a &amp; = &amp; b\\\\ c &amp; = &amp; d \\end{eqnarray}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
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
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{2}">2</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
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
    );
  });

  /********************************************************************************/

  it('Eqnarray Star', () => {
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
    );
  });

  /********************************************************************************/

  it('Align Notag', () => {
    toXmlMatch(
      tex2mml('\\begin{align} a&=b \\\\ &=c \\notag \\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align} a&amp;=b \\\\ &amp;=c \\notag \\end{align}" display="block">
         <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align} a&amp;=b \\\\ &amp;=c \\notag \\end{align}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
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
           <mtr>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="=">=</mo>
                 <mi data-latex="\\notag">c</mi>
               </mstyle>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('xalignet', () => {
    toXmlMatch(
      tex2mml('\\begin{xalignat}{1} a&b \\end{xalignat}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{xalignat}{1} a&amp;b \\end{xalignat}" display="block">
         <mtable width="100%" displaystyle="true" columnalign="center right left center" columnspacing="0em" columnwidth="fit auto auto fit" rowspacing="3pt" data-break-align="middle bottom top middle" minlabelspacing="0" data-width-includes-label="true" data-latex-item="{xalignat}" data-latex="\\begin{xalignat}{1} a&amp;b \\end{xalignat}">
           <mlabeledtr data-latex-item="{1}" data-latex="{1}">
             <mtd id="mjx-eqn:1">
               <mpadded width="0" lspace="-1width">
                 <mtext data-latex="\\text{(}">(</mtext>
                 <mtext data-latex="\\text{1}">1</mtext>
                 <mtext data-latex="\\text{)}">)</mtext>
               </mpadded>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="b">b</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('xalignet star', () => {
    toXmlMatch(
      tex2mml('\\begin{xalignat*}{1} a&b \\end{xalignat*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{xalignat*}{1} a&amp;b \\end{xalignat*}" display="block">
         <mtable width="100%" displaystyle="true" columnalign="center right left center" columnspacing="0em" columnwidth="fit auto auto fit" rowspacing="3pt" data-break-align="middle bottom top middle" minlabelspacing="0" data-width-includes-label="true" data-latex-item="{xalignat*}" data-latex="\\begin{xalignat*}{1} a&amp;b \\end{xalignat*}">
           <mtr data-latex-item="{1}" data-latex="{1}">
             <mtd></mtd>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="b">b</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('flalign', () => {
    toXmlMatch(
      tex2mml('\\begin{flalign} a&b & \\end{flalign}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{flalign} a&amp;b &amp; \\end{flalign}" display="block">
         <mtable width="100%" displaystyle="true" columnalign="right left center right" columnspacing="0em" columnwidth="auto auto fit auto" rowspacing="3pt" data-break-align="bottom top middle bottom" data-width-includes-label="true" data-latex-item="{flalign}" data-latex="\\begin{flalign} a&amp;b &amp; \\end{flalign}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="b">b</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd></mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('xalignet star', () => {
    toXmlMatch(
      tex2mml('\\begin{flalign*} a&b & \\end{flalign*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{flalign*} a&amp;b &amp; \\end{flalign*}" display="block">
         <mtable width="100%" displaystyle="true" columnalign="right left center right" columnspacing="0em" columnwidth="auto auto fit auto" rowspacing="3pt" data-break-align="bottom top middle bottom" data-width-includes-label="true" data-latex-item="{flalign*}" data-latex="\\begin{flalign*} a&amp;b &amp; \\end{flalign*}">
           <mtr>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="b">b</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd></mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('aligned [b]', () => {
    toXmlMatch(
      tex2mml('\\begin{aligned} [b] a \\\\ b \\end{aligned}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{aligned} [b] a \\\\ b \\end{aligned}" display="block">
         <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" align="baseline -1" data-latex-item="{aligned}" data-latex="\\begin{aligned} [b] a \\\\ b \\end{aligned}">
           <mtr data-latex-item=" [b]" data-latex=" [b]">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
           </mtr>
           <mtr data-latex-item=" [b]" data-latex=" [b]">
             <mtd>
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('aligned [x]', () => {
    toXmlMatch(
      tex2mml('\\begin{aligned} [x] a \\\\ b \\end{aligned}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{aligned} [x] a \\\\ b \\end{aligned}" display="block">
         <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{aligned}" data-latex="[x] a \\\\ b \\end{aligned}">
           <mtr>
             <mtd>
               <mo data-latex="[" stretchy="false">[</mo>
               <mi data-latex="x">x</mi>
               <mo data-latex="]" stretchy="false">]</mo>
               <mi data-latex="a">a</mi>
             </mtd>
           </mtr>
           <mtr>
             <mtd>
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Ams Tagged Environments Left', () => {
  beforeEach(() => setupTex(['base', 'ams'], { tags: 'ams', tagSide: 'left' }));

  /********************************************************************************/

  it('xalign tagged left', () => {
    toXmlMatch(
      tex2mml('\\begin{xalignat}{2} a & b \\tag{1}\\end{xalignat}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{xalignat}{2} a &amp; b \\tag{1}\\end{xalignat}" display="block">
         <mtable width="100%" displaystyle="true" columnalign="center right left center right left center" columnspacing="0em" columnwidth="fit auto auto fit auto auto fit" rowspacing="3pt" data-break-align="middle bottom top middle bottom top middle" side="left" minlabelspacing="0" data-width-includes-label="true" data-latex-item="{xalignat}" data-latex="\\begin{xalignat}{2} a &amp; b \\tag{1}\\end{xalignat}">
           <mlabeledtr data-latex-item="{2}" data-latex="{2}">
             <mtd id="mjx-eqn:1">
               <mpadded width="0">
                 <mtext data-latex="\\text{(}">(</mtext>
                 <mtext data-latex="\\text{1}">1</mtext>
                 <mtext data-latex="\\text{)}">)</mtext>
               </mpadded>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="\\tag{1}">b</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
             <mtd></mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('multline tagged left', () => {
    toXmlMatch(
      tex2mml('\\begin{multline} a\\tag{1} \\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline} a\\tag{1} \\end{multline}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" side="left" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline} a\\tag{1} \\end{multline}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd columnalign="left">
               <mi data-latex="\\tag{1}">a</mi>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Nesting error', () => {
    expectTexError('\\begin{align}\\begin{align} \\end{align}\\end{align}')
      .toBe('Erroneous nesting of equation structures')
  });

  /********************************************************************************/

  it('Gather Align', () => {
    toXmlMatch(
      tex2mml('\\begin{gather}\\begin{align} a &= b \\end{align}\\end{gather}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{gather}\\begin{align} a &amp;= b \\end{align}\\end{gather}" display="block">
         <mtable displaystyle="true" columnspacing="1em" rowspacing="3pt" data-break-align="middle" side="left" data-latex-item="{gather}" data-latex="\\begin{gather}\\begin{align} a &amp;= b \\end{align}\\end{gather}">
           <mlabeledtr>
             <mtd id="mjx-eqn:2">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{2}">2</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" side="left" data-latex-item="{align}" data-latex="{align}">
                 <mlabeledtr>
                   <mtd id="mjx-eqn:1">
                     <mtext data-latex="\\text{(}">(</mtext>
                     <mtext data-latex="\\text{1}">1</mtext>
                     <mtext data-latex="\\text{)}">)</mtext>
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
               </mtable>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Gather Gather', () => {
    expectTexError('\\begin{gather}\\begin{gather} \\end{gather}\\end{gather}')
      .toBe('Erroneous nesting of equation structures')
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Amserror', () => {

  /********************************************************************************/

  it('Center Fraction Error', () => {
    expectTexError('\\cfrac[c]{a}{b}')
      .toBe('Illegal alignment specified in \\cfrac');
  });

  /********************************************************************************/

  it('Genfrac Error', () => {
    expectTexError('\\genfrac{[}{]}{0pt}{4}{a}{b}')
      .toBe('Bad math style for \\genfrac');
  });

  /********************************************************************************/

  it('MissingOrUnrecognizedDelim', () => {
    expectTexError('\\genfrac{(}{a}{}{2}{1}{2}')
      .toBe('Missing or unrecognized delimiter for \\genfrac');
  });

  /********************************************************************************/

  it('PositiveIntegerArg', () => {
    expectTexError(
        '\\begin{align*} a&=b \\begin{alignedat}{-2} r&=s \\end{alignedat} \\\\ c&=d \\end{align*}'
      )
      .toBe('Argument to \\begin{alignedat} must be a positive integer');
  });

  /********************************************************************************/

  it('MultlineRowsOneCol', () => {
    expectTexError('\\begin{multline}a\\\\b&c\\end{multline}')
      .toBe('The rows within the multline environment must have exactly one column');
  });

  /********************************************************************************/

  it('CommandNotAllowedInEnv', () => {
    expectTexError('\\begin{split}a\\tag{1}\\end{split}')
      .toBe('\\tag not allowed in split environment');
  });

  /********************************************************************************/

  it('MultipleCommand', () => {
    expectTexError('a\\tag{1}\\tag{2}')
      .toBe('Multiple \\tag');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('InternalMath', () => {

  /********************************************************************************/

  it('Mbox Eqref', () => {
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
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Multirel', () => {

  /********************************************************************************/

  it('Multirel Mathvariant 1', () => {
    toXmlMatch(
      tex2mml('a <\\equiv \\mathrm{=>}\\thickapprox b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;\\equiv \\mathrm{=&gt;}\\thickapprox b" display="block">
         <mi data-latex="a">a</mi>
         <mo data-mjx-texclass="REL" data-latex="&lt;\\equiv">&lt;&#x2261;</mo>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{=&gt;}">
           <mo data-mjx-texclass="REL" data-latex="=&gt;">=&gt;</mo>
         </mrow>
         <mo data-mjx-alternate="1" data-latex="\\thickapprox">&#x2248;</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Multirel Mathvariant 2', () => {
    toXmlMatch(
      tex2mml('a <\\equiv \\mathrm{=>}\\thickapprox\\thicksim b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;\\equiv \\mathrm{=&gt;}\\thickapprox\\thicksim b" display="block">
         <mi data-latex="a">a</mi>
         <mo data-mjx-texclass="REL" data-latex="&lt;\\equiv">&lt;&#x2261;</mo>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{=&gt;}">
           <mo data-mjx-texclass="REL" data-latex="=&gt;">=&gt;</mo>
         </mrow>
         <mo data-mjx-alternate="1" data-mjx-texclass="REL" data-latex="\\thickapprox\\thicksim">&#x2248;&#x223C;</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Multirel Mathvariant 3', () => {
    toXmlMatch(
      tex2mml('a <\\equiv =>\\thickapprox\\thicksim b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;\\equiv =&gt;\\thickapprox\\thicksim b" display="block">
         <mi data-latex="a">a</mi>
         <mo data-mjx-texclass="REL" data-latex="&lt;\\equiv=&gt;" rspace="0pt">&lt;&#x2261;=&gt;</mo>
         <mo data-mjx-alternate="1" data-mjx-texclass="REL" data-latex="\\thickapprox\\thicksim" lspace="0pt">&#x2248;&#x223C;</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Multirel Mathvariant 4', () => {
    toXmlMatch(
      tex2mml(
        'a <\\equiv \\mathrm{=}\\mathrm{>}\\thickapprox\\thicksim\\frown\\smile=\\updownarrow b'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a &lt;\\equiv \\mathrm{=}\\mathrm{&gt;}\\thickapprox\\thicksim\\frown\\smile=\\updownarrow b" display="block">
         <mi data-latex="a">a</mi>
         <mo data-mjx-texclass="REL" data-latex="&lt;\\equiv">&lt;&#x2261;</mo>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{=}">
           <mo data-latex="=">=</mo>
         </mrow>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{&gt;}">
           <mo data-latex="&gt;">&gt;</mo>
         </mrow>
         <mo data-mjx-alternate="1" data-mjx-texclass="REL" data-latex="\\thickapprox\\thicksim" rspace="0pt">&#x2248;&#x223C;</mo>
         <mo data-mjx-texclass="REL" stretchy="false" data-latex="\\frown\\smile=\\updownarrow" lspace="0pt">&#x2322;&#x2323;=&#x2195;</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Preset Lspace Rspace', () => {
    toXmlMatch(
      tex2mml('a\\lesssim\\gtrsim b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\lesssim\\gtrsim b" display="block">
         <mi data-latex="a">a</mi>
         <mo data-mjx-texclass="REL" data-latex="\\lesssim\\gtrsim">&#x2272;&#x2273;</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Preset Rspace Lspace', () => {
    toXmlMatch(
      tex2mml('a\\gtrsim\\lesssim b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\gtrsim\\lesssim b" display="block">
         <mi data-latex="a">a</mi>
         <mo data-mjx-texclass="REL" data-latex="\\gtrsim\\lesssim">&#x2273;&#x2272;</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('MultlineShove', () => {

  /********************************************************************************/

  it('Shove None', () => {
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
    );
  });

  /********************************************************************************/

  it('Shove Left Top', () => {
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
    );
  });

  /********************************************************************************/

  it('Shove Left Middle', () => {
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
    );
  });

  /********************************************************************************/

  it('Shove Left Bottom', () => {
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
    );
  });

  /********************************************************************************/

  it('Shove Right Top', () => {
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
    );
  });

  /********************************************************************************/

  it('Shove Right Middle', () => {
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
    );
  });

  /********************************************************************************/

  it('Shove Right Bottom', () => {
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
    );
  });

  /********************************************************************************/

  it('Shove Right Left', () => {
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
    );
  });

  /********************************************************************************/

  it('Shove Left Right', () => {
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
    );
  });

  /********************************************************************************/

  it('Shove Error Top', () => {
    expectTexError('\\begin{multline}a \\shoveleft\\\\ b\\\\ c\\end{multline}')
      .toBe('\\shoveleft must come at the beginning of the line');
  });

  /********************************************************************************/

  it('Shove Error Middle', () => {
    expectTexError('\\begin{multline} a\\\\ b \\shoveleft\\\\ c\\end{multline}')
      .toBe('\\shoveleft must come at the beginning of the line');
  });

  /********************************************************************************/

  it('Shove Error Bottom', () => {
    expectTexError('\\begin{multline} a\\\\ b\\\\ c \\shoveleft\\end{multline}')
      .toBe('\\shoveleft must come at the beginning of the line');
  });

  /********************************************************************************/

  it('Shove Error Environment', () => {
    expectTexError('\\begin{align}\\shoveleft a\\end{align}')
      .toBe('\\shoveleft only allowed in multline environment');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Ams Complex', () => {

  /********************************************************************************/

  it('The Lorenz Equations', () => {
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
    );
  });

  /********************************************************************************/

  it("Maxwell's Equations", () => {
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
    );
  });

  /********************************************************************************/

  it('Cubic Binomial', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{eqnarray}(x+y)^{3}&=&(x+y)(x+y)(x+y)\\\\&=&xxx+xxy+xyx+{\\underline {xyy}}+yxx+{\\underline {yxy}}+{\\underline {yyx}}+yyy\\\\&=&x^{3}+3x^{2}y+{\\underline {3xy^{2}}}+y^{3}.\\end{eqnarray}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{eqnarray}(x+y)^{3}&amp;=&amp;(x+y)(x+y)(x+y)\\\\&amp;=&amp;xxx+xxy+xyx+{\\underline {xyy}}+yxx+{\\underline {yxy}}+{\\underline {yyx}}+yyy\\\\&amp;=&amp;x^{3}+3x^{2}y+{\\underline {3xy^{2}}}+y^{3}.\\end{eqnarray}" display="block">
         <mtable displaystyle="true" columnalign="right center left" columnspacing="0em 0.278em" rowspacing="3pt" data-break-align="bottom middle top" data-latex-item="{eqnarray}" data-latex="\\begin{eqnarray}(x+y)^{3}&amp;=&amp;(x+y)(x+y)(x+y)\\\\&amp;=&amp;xxx+xxy+xyx+{\\underline {xyy}}+yxx+{\\underline {yxy}}+{\\underline {yyx}}+yyy\\\\&amp;=&amp;x^{3}+3x^{2}y+{\\underline {3xy^{2}}}+y^{3}.\\end{eqnarray}">
           <mtr>
             <mtd>
               <mo data-latex="(" stretchy="false">(</mo>
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <msup data-latex=")^{3}">
                 <mo data-latex=")" stretchy="false">)</mo>
                 <mrow data-mjx-texclass="ORD" data-latex="{3}">
                   <mn data-latex="3">3</mn>
                 </mrow>
               </msup>
             </mtd>
             <mtd>
               <mi></mi>
               <mo data-latex="=">=</mo>
             </mtd>
             <mtd>
               <mstyle indentshift=".7em">
                 <mi></mi>
                 <mo data-latex="(" stretchy="false">(</mo>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="y">y</mi>
                 <mo data-latex=")" stretchy="false">)</mo>
                 <mo data-latex="(" stretchy="false">(</mo>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="y">y</mi>
                 <mo data-latex=")" stretchy="false">)</mo>
                 <mo data-latex="(" stretchy="false">(</mo>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="y">y</mi>
                 <mo data-latex=")" stretchy="false">)</mo>
               </mstyle>
             </mtd>
           </mtr>
           <mtr>
             <mtd></mtd>
             <mtd>
               <mi></mi>
               <mo data-latex="=">=</mo>
             </mtd>
             <mtd>
               <mstyle indentshift=".7em">
                 <mi data-latex="x">x</mi>
                 <mi data-latex="x">x</mi>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="x">x</mi>
                 <mi data-latex="x">x</mi>
                 <mi data-latex="y">y</mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="x">x</mi>
                 <mi data-latex="y">y</mi>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="+">+</mo>
                 <mrow data-mjx-texclass="ORD" data-latex="{\\underline {xyy}}">
                   <munder data-latex="\\underline {xyy}">
                     <mrow data-latex="xyy">
                       <mi data-latex="x">x</mi>
                       <mi data-latex="y">y</mi>
                       <mi data-latex="y">y</mi>
                     </mrow>
                     <mo accent="true">&#x2015;</mo>
                   </munder>
                 </mrow>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="y">y</mi>
                 <mi data-latex="x">x</mi>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="+">+</mo>
                 <mrow data-mjx-texclass="ORD" data-latex="{\\underline {yxy}}">
                   <munder data-latex="\\underline {yxy}">
                     <mrow data-latex="yxy">
                       <mi data-latex="y">y</mi>
                       <mi data-latex="x">x</mi>
                       <mi data-latex="y">y</mi>
                     </mrow>
                     <mo accent="true">&#x2015;</mo>
                   </munder>
                 </mrow>
                 <mo data-latex="+">+</mo>
                 <mrow data-mjx-texclass="ORD" data-latex="{\\underline {yyx}}">
                   <munder data-latex="\\underline {yyx}">
                     <mrow data-latex="yyx">
                       <mi data-latex="y">y</mi>
                       <mi data-latex="y">y</mi>
                       <mi data-latex="x">x</mi>
                     </mrow>
                     <mo accent="true">&#x2015;</mo>
                   </munder>
                 </mrow>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="y">y</mi>
                 <mi data-latex="y">y</mi>
                 <mi data-latex="y">y</mi>
               </mstyle>
             </mtd>
           </mtr>
           <mtr>
             <mtd></mtd>
             <mtd>
               <mi></mi>
               <mo data-latex="=">=</mo>
             </mtd>
             <mtd>
               <mstyle indentshift=".7em">
                 <msup data-latex="x^{3}">
                   <mi data-latex="x">x</mi>
                   <mrow data-mjx-texclass="ORD" data-latex="{3}">
                     <mn data-latex="3">3</mn>
                   </mrow>
                 </msup>
                 <mo data-latex="+">+</mo>
                 <mn data-latex="3">3</mn>
                 <msup data-latex="x^{2}">
                   <mi data-latex="x">x</mi>
                   <mrow data-mjx-texclass="ORD" data-latex="{2}">
                     <mn data-latex="2">2</mn>
                   </mrow>
                 </msup>
                 <mi data-latex="y">y</mi>
                 <mo data-latex="+">+</mo>
                 <mrow data-mjx-texclass="ORD" data-latex="{\\underline {3xy^{2}}}">
                   <munder data-latex="\\underline {3xy^{2}}">
                     <mrow data-latex="3xy^{2}">
                       <mn data-latex="3">3</mn>
                       <mi data-latex="x">x</mi>
                       <msup data-latex="y^{2}">
                         <mi data-latex="y">y</mi>
                         <mrow data-mjx-texclass="ORD" data-latex="{2}">
                           <mn data-latex="2">2</mn>
                         </mrow>
                       </msup>
                     </mrow>
                     <mo accent="true">&#x2015;</mo>
                   </munder>
                 </mrow>
                 <mo data-latex="+">+</mo>
                 <msup data-latex="y^{3}">
                   <mi data-latex="y">y</mi>
                   <mrow data-mjx-texclass="ORD" data-latex="{3}">
                     <mn data-latex="3">3</mn>
                   </mrow>
                 </msup>
                 <mo data-latex=".">.</mo>
               </mstyle>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('A Cross Product Formula', () => {
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
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Ams SideSet', () => {

  /********************************************************************************/

  it('Sideset Empty', () => {
    toXmlMatch(
      tex2mml('\\sideset{}{}{}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{}{}{}" display="block">
         <mrow data-mjx-texclass="OP" data-latex="\\sideset{}{}{}"></mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Sideset Simple', () => {
    toXmlMatch(
      tex2mml('\\sideset{}{}{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{}{}{a}" display="block">
         <mrow data-mjx-texclass="OP" data-latex="\\sideset{}{}{a}">
           <mi data-latex="a">a</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Sideset Simple Right', () => {
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
    );
  });

  /********************************************************************************/

  it('Sideset Simple Left', () => {
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
    );
  });

  /********************************************************************************/

  it('Sideset Simple Left Right', () => {
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
    );
  });

  /********************************************************************************/

  it('Sideset Simple Sum', () => {
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
    );
  });

  /********************************************************************************/

  it('Sideset Extra Post', () => {
    toXmlMatch(
      tex2mml('\\sideset{a}{b}X'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{a}{b}X" display="block">
         <mrow data-mjx-texclass="OP" data-latex="\\sideset{a}{b}X">
           <mi data-latex="a">a</mi>
           <mi data-latex="X">X</mi>
           <mi data-latex="b">b</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Sideset Pre No Base', () => {
    toXmlMatch(
      tex2mml('\\sideset{^1{}^2}{}X'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{^1{}^2}{}X" display="block">
         <mrow data-mjx-texclass="OP" data-latex="\\sideset{^1{}^2}{}X">
           <msup data-latex="^1">
             <mphantom>
               <mpadded width="0">
                 <mi data-latex="X">X</mi>
               </mpadded>
             </mphantom>
             <mn data-latex="1">1</mn>
           </msup>
           <msup data-latex="{}^2">
             <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
             <mn data-latex="2">2</mn>
           </msup>
           <mi data-latex="X">X</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Sideset Pre with Post Sup', () => {
    toXmlMatch(
      tex2mml('\\sideset{^a}{^b}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{^a}{^b}{x}" display="block">
         <mrow data-mjx-texclass="OP" data-latex="\\sideset{^a}{^b}{x}">
           <mmultiscripts data-mjx-script-align="left">
             <mi data-latex="x">x</mi>
             <none></none>
             <mi data-latex="b">b</mi>
             <mprescripts></mprescripts>
             <none></none>
             <mi data-latex="a">a</mi>
           </mmultiscripts>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Sideset Pre with Post Sub', () => {
    toXmlMatch(
      tex2mml('\\sideset{^a}{_b}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{^a}{_b}{x}" display="block">
         <mrow data-mjx-texclass="OP" data-latex="\\sideset{^a}{_b}{x}">
           <mmultiscripts data-mjx-script-align="left">
             <mi data-latex="x">x</mi>
             <mi data-latex="b">b</mi>
             <none></none>
             <mprescripts></mprescripts>
             <none></none>
             <mi data-latex="a">a</mi>
           </mmultiscripts>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Ams symbols', () => {

  /********************************************************************************/

  it('Delimiters', () => {
    toXmlMatch(
      tex2mml(
        '\\left\\llcorner X \\right\\lrcorner \\left\\lvert X \\right\\rvert \\left\\lVert X \\right\\rVert'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\llcorner X \\right\\lrcorner \\left\\lvert X \\right\\rvert \\left\\lVert X \\right\\rVert" display="block">
         <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\llcorner X \\right\\lrcorner " data-latex="\\left\\llcorner X \\right\\lrcorner ">
           <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true" data-latex-item="\\left\\llcorner " data-latex="\\left\\llcorner ">&#x231E;</mo>
           <mi data-latex="X">X</mi>
           <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true" data-latex-item="\\right\\lrcorner " data-latex="\\right\\lrcorner ">&#x231F;</mo>
         </mrow>
         <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lvert X \\right\\rvert " data-latex="\\left\\lvert X \\right\\rvert ">
           <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lvert " data-latex="\\left\\lvert ">|</mo>
           <mi data-latex="X">X</mi>
           <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rvert " data-latex="\\right\\rvert ">|</mo>
         </mrow>
         <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\lVert X \\right\\rVert" data-latex="\\left\\lVert X \\right\\rVert">
           <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\lVert " data-latex="\\left\\lVert ">&#x2016;</mo>
           <mi data-latex="X">X</mi>
           <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rVert" data-latex="\\right\\rVert">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Spaces', () => {
    toXmlMatch(
      tex2mml('\\nobreakspace\\negmedspace\\negthickspace'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\nobreakspace\\negmedspace\\negthickspace" display="block">
         <mtext data-latex="\\nobreakspace">&#xA0;</mtext>
         <mspace width="-0.222em" data-latex="\\negmedspace"></mspace>
         <mspace width="-0.278em" data-latex="\\negthickspace"></mspace>
       </math>`
    );
  });

  /********************************************************************************/

  it('Accents', () => {
    toXmlMatch(
      tex2mml('\\mathring A \\dddot x \\ddddot x'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathring A \\dddot x \\ddddot x" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathring A">
           <mover>
             <mi data-latex="A">A</mi>
             <mo>&#x2DA;</mo>
           </mover>
         </mrow>
         <mrow data-mjx-texclass="ORD" data-latex="\\dddot x">
           <mover>
             <mi data-latex="x">x</mi>
             <mo>&#x20DB;</mo>
           </mover>
         </mrow>
         <mrow data-mjx-texclass="ORD" data-latex="\\ddddot x">
           <mover>
             <mi data-latex="x">x</mi>
             <mo>&#x20DC;</mo>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Limits', () => {
    toXmlMatch(
      tex2mml('\\injlim \\projlim \\varliminf \\varlimsup \\varinjlim \\varprojlim'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\injlim \\projlim \\varliminf \\varlimsup \\varinjlim \\varprojlim" display="block">
         <mo data-mjx-texclass="OP" movablelimits="true" data-latex="\\injlim">inj&#x2006;lim</mo>
         <mo data-mjx-texclass="OP" movablelimits="true" data-latex="\\projlim">proj&#x2006;lim</mo>
         <mrow data-mjx-texclass="OP" data-latex="\\mathop{\\underline{\\mmlToken{mi}{lim}}}">
           <munder data-latex="\\underline{\\mmlToken{mi}{lim}}">
             <mi data-latex="\\mmlToken{mi}{lim}">lim</mi>
             <mo accent="true">&#x2015;</mo>
           </munder>
         </mrow>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mrow data-mjx-texclass="OP" data-latex="\\mathop{\\overline{\\mmlToken{mi}{lim}}}">
           <mover data-latex="\\overline{\\mmlToken{mi}{lim}}">
             <mi data-latex="\\mmlToken{mi}{lim}">lim</mi>
             <mo accent="true">&#x2015;</mo>
           </mover>
         </mrow>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mrow data-mjx-texclass="OP" data-latex="\\mathop{\\underrightarrow{\\mmlToken{mi}{lim}}}">
           <munder data-latex="\\underrightarrow{\\mmlToken{mi}{lim}}">
             <mi data-latex="\\mmlToken{mi}{lim}">lim</mi>
             <mo>&#x2192;</mo>
           </munder>
         </mrow>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mrow data-mjx-texclass="OP" data-latex="\\mathop{\\underleftarrow{\\mmlToken{mi}{lim}}}">
           <munder data-latex="\\underleftarrow{\\mmlToken{mi}{lim}}">
             <mi data-latex="\\mmlToken{mi}{lim}">lim</mi>
             <mo>&#x2190;</mo>
           </munder>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('boxed', () => {
    toXmlMatch(
      tex2mml('\\boxed{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\boxed{x}" display="block">
         <menclose notation="box" data-latex="\\fbox{$\\displaystyle{x}$}">
           <mrow data-mjx-texclass="ORD">
             <mrow data-mjx-texclass="ORD" data-latex="\\displaystyle{x}">
               <mi data-latex="x">x</mi>
             </mrow>
           </mrow>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  it('substack', () => {
    toXmlMatch(
      tex2mml('\\substack{a\\\\b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\substack{a\\\\b}" display="block">
         <mstyle scriptlevel="1" data-latex-item="{subarray}" data-latex="\\begin{subarray}{c}a\\\\b\\end{subarray}">
           <mtable data-mjx-smallmatrix="true" columnspacing="0em" rowspacing="0.1em">
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
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  it('impliedby', () => {
    toXmlMatch(
      tex2mml('Q \\impliedby P'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="Q \\impliedby P" display="block">
         <mi data-latex="Q">Q</mi>
         <mspace width="0.278em" data-latex="\\;"></mspace>
         <mo stretchy="false" data-latex="\\Longleftarrow">&#x27F8;</mo>
         <mspace width="0.278em" data-latex="\\;"></mspace>
         <mi data-latex="P">P</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mi 1', () => {
    toXmlMatch(
      tex2mml(
        '\\varkappa\\varGamma\\varDelta\\varTheta\\varLambda\\varXi\\varPi\\varSigma\\varUpsilon\\varPhi\\varPsi\\varOmega'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\varkappa\\varGamma\\varDelta\\varTheta\\varLambda\\varXi\\varPi\\varSigma\\varUpsilon\\varPhi\\varPsi\\varOmega" display="block">
         <mi data-latex="\\varkappa">&#x3F0;</mi>
         <mi data-latex="\\varGamma">&#x393;</mi>
         <mi data-latex="\\varDelta">&#x394;</mi>
         <mi data-latex="\\varTheta">&#x398;</mi>
         <mi data-latex="\\varLambda">&#x39B;</mi>
         <mi data-latex="\\varXi">&#x39E;</mi>
         <mi data-latex="\\varPi">&#x3A0;</mi>
         <mi data-latex="\\varSigma">&#x3A3;</mi>
         <mi data-latex="\\varUpsilon">&#x3A5;</mi>
         <mi data-latex="\\varPhi">&#x3A6;</mi>
         <mi data-latex="\\varPsi">&#x3A8;</mi>
         <mi data-latex="\\varOmega">&#x3A9;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mi 2', () => {
    toXmlMatch(
      tex2mml(
        '\\beth\\gimel\\daleth\\backprime\\hslash\\varnothing\\blacktriangle\\triangledown\\blacktriangledown\\square\\Box'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\beth\\gimel\\daleth\\backprime\\hslash\\varnothing\\blacktriangle\\triangledown\\blacktriangledown\\square\\Box" display="block">
         <mi data-latex="\\beth">&#x2136;</mi>
         <mi data-latex="\\gimel">&#x2137;</mi>
         <mi data-latex="\\daleth">&#x2138;</mi>
         <mi data-mjx-alternate="1" data-latex="\\backprime">&#x2035;</mi>
         <mi data-latex="\\hslash">&#x210F;</mi>
         <mi data-mjx-alternate="1" data-latex="\\varnothing">&#x2205;</mi>
         <mi data-latex="\\blacktriangle">&#x25B4;</mi>
         <mi data-mjx-alternate="1" data-latex="\\triangledown">&#x25BD;</mi>
         <mi data-latex="\\blacktriangledown">&#x25BE;</mi>
         <mi data-latex="\\square">&#x25FB;</mi>
         <mi data-latex="\\Box">&#x25FB;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mi 3', () => {
    toXmlMatch(
      tex2mml(
        '\\blacksquare\\lozenge\\Diamond\\blacklozenge\\circledS\\bigstar\\sphericalangle\\measuredangle\\nexists\\complement'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\blacksquare\\lozenge\\Diamond\\blacklozenge\\circledS\\bigstar\\sphericalangle\\measuredangle\\nexists\\complement" display="block">
         <mi data-latex="\\blacksquare">&#x25FC;</mi>
         <mi data-latex="\\lozenge">&#x25CA;</mi>
         <mi data-latex="\\Diamond">&#x25CA;</mi>
         <mi data-latex="\\blacklozenge">&#x29EB;</mi>
         <mi mathvariant="normal" data-latex="\\circledS">&#x24C8;</mi>
         <mi data-latex="\\bigstar">&#x2605;</mi>
         <mi data-latex="\\sphericalangle">&#x2222;</mi>
         <mi data-latex="\\measuredangle">&#x2221;</mi>
         <mi data-latex="\\nexists">&#x2204;</mi>
         <mi data-latex="\\complement">&#x2201;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mi 4', () => {
    toXmlMatch(
      tex2mml(
        '\\mho\\eth\\Finv\\diagup\\Game\\diagdown\\Bbbk\\yen\\circledR\\checkmark\\maltese'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mho\\eth\\Finv\\diagup\\Game\\diagdown\\Bbbk\\yen\\circledR\\checkmark\\maltese" display="block">
         <mi data-latex="\\mho">&#x2127;</mi>
         <mi mathvariant="normal" data-latex="\\eth">&#xF0;</mi>
         <mi data-latex="\\Finv">&#x2132;</mi>
         <mi data-latex="\\diagup">&#x2571;</mi>
         <mi data-latex="\\Game">&#x2141;</mi>
         <mi data-latex="\\diagdown">&#x2572;</mi>
         <mi mathvariant="double-struck" data-latex="\\Bbbk">k</mi>
         <mi data-latex="\\yen">&#xA5;</mi>
         <mi data-latex="\\circledR">&#xAE;</mi>
         <mi data-latex="\\checkmark">&#x2713;</mi>
         <mi data-latex="\\maltese">&#x2720;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 1', () => {
    toXmlMatch(
      tex2mml(
        '\\ltimes\\smallsetminus\\rtimes\\Cap\\doublecap\\leftthreetimes\\Cup\\doublecup\\rightthreetimes\\barwedge\\curlywedge'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ltimes\\smallsetminus\\rtimes\\Cap\\doublecap\\leftthreetimes\\Cup\\doublecup\\rightthreetimes\\barwedge\\curlywedge" display="block">
         <mo data-latex="\\ltimes">&#x22C9;</mo>
         <mo data-mjx-alternate="1" data-latex="\\smallsetminus">&#x2216;</mo>
         <mo data-latex="\\rtimes">&#x22CA;</mo>
         <mo data-latex="\\Cap">&#x22D2;</mo>
         <mo data-latex="\\doublecap">&#x22D2;</mo>
         <mo data-latex="\\leftthreetimes">&#x22CB;</mo>
         <mo data-latex="\\Cup">&#x22D3;</mo>
         <mo data-latex="\\doublecup">&#x22D3;</mo>
         <mo data-latex="\\rightthreetimes">&#x22CC;</mo>
         <mo data-latex="\\barwedge">&#x22BC;</mo>
         <mo data-latex="\\curlywedge">&#x22CF;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 2', () => {
    toXmlMatch(
      tex2mml(
        '\\veebar\\curlyvee\\doublebarwedge\\boxminus\\circleddash\\boxtimes\\circledast\\boxdot\\circledcirc\\boxplus'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\veebar\\curlyvee\\doublebarwedge\\boxminus\\circleddash\\boxtimes\\circledast\\boxdot\\circledcirc\\boxplus" display="block">
         <mo data-latex="\\veebar">&#x22BB;</mo>
         <mo data-latex="\\curlyvee">&#x22CE;</mo>
         <mo data-latex="\\doublebarwedge">&#x2A5E;</mo>
         <mo data-latex="\\boxminus">&#x229F;</mo>
         <mo data-latex="\\circleddash">&#x229D;</mo>
         <mo data-latex="\\boxtimes">&#x22A0;</mo>
         <mo data-latex="\\circledast">&#x229B;</mo>
         <mo data-latex="\\boxdot">&#x22A1;</mo>
         <mo data-latex="\\circledcirc">&#x229A;</mo>
         <mo data-latex="\\boxplus">&#x229E;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 3', () => {
    toXmlMatch(
      tex2mml(
        '\\centerdot\\divideontimes\\intercal\\leqq\\geqq\\leqslant\\geqslant\\eqslantless\\eqslantgtr\\lessapprox\\gtrapprox'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\centerdot\\divideontimes\\intercal\\leqq\\geqq\\leqslant\\geqslant\\eqslantless\\eqslantgtr\\lessapprox\\gtrapprox" display="block">
         <mo data-mjx-alternate="1" data-latex="\\centerdot">&#x22C5;</mo>
         <mo data-latex="\\divideontimes">&#x22C7;</mo>
         <mo data-latex="\\intercal">&#x22BA;</mo>
         <mo data-mjx-texclass="REL" data-latex="\\leqq\\geqq\\leqslant\\geqslant\\eqslantless\\eqslantgtr\\lessapprox\\gtrapprox">&#x2266;&#x2267;&#x2A7D;&#x2A7E;&#x2A95;&#x2A96;&#x2A85;&#x2A86;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 4', () => {
    toXmlMatch(
      tex2mml(
        '\\approxeq\\lessdot\\gtrdot\\lll\\llless\\ggg\\gggtr\\lessgtr\\gtrless\\lesseqgtr\\gtreqless\\lesseqqgtr\\gtreqqless'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\approxeq\\lessdot\\gtrdot\\lll\\llless\\ggg\\gggtr\\lessgtr\\gtrless\\lesseqgtr\\gtreqless\\lesseqqgtr\\gtreqqless" display="block">
         <mo data-mjx-texclass="REL" data-latex="\\approxeq\\lessdot\\gtrdot\\lll\\llless\\ggg\\gggtr\\lessgtr\\gtrless\\lesseqgtr\\gtreqless\\lesseqqgtr\\gtreqqless">&#x224A;&#x22D6;&#x22D7;&#x22D8;&#x22D8;&#x22D9;&#x22D9;&#x2276;&#x2277;&#x22DA;&#x22DB;&#x2A8B;&#x2A8C;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 5', () => {
    toXmlMatch(
      tex2mml(
        '\\doteqdot\\Doteq\\eqcirc\\risingdotseq\\circeq\\fallingdotseq\\triangleq\\backsim\\backsimeq\\subseteqq\\supseteqq'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\doteqdot\\Doteq\\eqcirc\\risingdotseq\\circeq\\fallingdotseq\\triangleq\\backsim\\backsimeq\\subseteqq\\supseteqq" display="block">
         <mo data-mjx-texclass="REL" data-latex="\\doteqdot\\Doteq\\eqcirc\\risingdotseq\\circeq\\fallingdotseq\\triangleq\\backsim\\backsimeq\\subseteqq\\supseteqq">&#x2251;&#x2251;&#x2256;&#x2253;&#x2257;&#x2252;&#x225C;&#x223D;&#x22CD;&#x2AC5;&#x2AC6;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 6', () => {
    toXmlMatch(
      tex2mml(
        '\\Subset\\Supset\\sqsubset\\sqsupset\\preccurlyeq\\succcurlyeq\\curlyeqprec\\curlyeqsucc\\precsim\\succsim\\precapprox'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Subset\\Supset\\sqsubset\\sqsupset\\preccurlyeq\\succcurlyeq\\curlyeqprec\\curlyeqsucc\\precsim\\succsim\\precapprox" display="block">
         <mo data-mjx-texclass="REL" data-latex="\\Subset\\Supset\\sqsubset\\sqsupset\\preccurlyeq\\succcurlyeq\\curlyeqprec\\curlyeqsucc\\precsim\\succsim\\precapprox">&#x22D0;&#x22D1;&#x228F;&#x2290;&#x227C;&#x227D;&#x22DE;&#x22DF;&#x227E;&#x227F;&#x2AB7;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 7', () => {
    toXmlMatch(
      tex2mml(
        '\\succapprox\\vartriangleleft\\lhd\\vartriangleright\\rhd\\trianglelefteq\\unlhd\\trianglerighteq\\unrhd\\vDash\\Vdash'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\succapprox\\vartriangleleft\\lhd\\vartriangleright\\rhd\\trianglelefteq\\unlhd\\trianglerighteq\\unrhd\\vDash\\Vdash" display="block">
         <mo data-mjx-texclass="REL" data-latex="\\succapprox\\vartriangleleft\\lhd\\vartriangleright\\rhd\\trianglelefteq\\unlhd\\trianglerighteq\\unrhd\\vDash\\Vdash">&#x2AB8;&#x22B2;&#x22B2;&#x22B3;&#x22B3;&#x22B4;&#x22B4;&#x22B5;&#x22B5;&#x22A8;&#x22A9;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 8', () => {
    toXmlMatch(
      tex2mml(
        '\\Vvdash\\smallsmile\\shortmid\\smallfrown\\shortparallel\\bumpeq\\between\\Bumpeq\\pitchfork\\varpropto\\backepsilon'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Vvdash\\smallsmile\\shortmid\\smallfrown\\shortparallel\\bumpeq\\between\\Bumpeq\\pitchfork\\varpropto\\backepsilon" display="block">
         <mo data-latex="\\Vvdash" rspace="0pt">&#x22AA;</mo>
         <mo data-mjx-alternate="1" data-mjx-texclass="REL" stretchy="false" data-latex="\\smallsmile\\shortmid\\smallfrown\\shortparallel" lspace="0pt" rspace="0pt">&#x2323;&#x2223;&#x2322;&#x2225;</mo>
         <mo data-mjx-texclass="REL" data-latex="\\bumpeq\\between\\Bumpeq\\pitchfork" lspace="0pt" rspace="0pt">&#x224F;&#x226C;&#x224E;&#x22D4;</mo>
         <mo data-mjx-alternate="1" data-latex="\\varpropto" lspace="0pt" rspace="0pt">&#x221D;</mo>
         <mo data-latex="\\backepsilon" lspace="0pt">&#x220D;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 9', () => {
    toXmlMatch(
      tex2mml(
        '\\blacktriangleleft\\blacktriangleright\\therefore\\because\\eqsim\\vartriangle\\Join\\nless\\ngtr\\nleq\\ngeq'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\blacktriangleleft\\blacktriangleright\\therefore\\because\\eqsim\\vartriangle\\Join\\nless\\ngtr\\nleq\\ngeq" display="block">
         <mo data-latex="\\blacktriangleleft">&#x25C2;</mo>
         <mo data-latex="\\blacktriangleright">&#x25B8;</mo>
         <mo data-mjx-texclass="REL" data-latex="\\therefore\\because\\eqsim">&#x2234;&#x2235;&#x2242;</mo>
         <mo data-mjx-alternate="1" data-latex="\\vartriangle">&#x25B3;</mo>
         <mo data-mjx-texclass="REL" data-latex="\\Join\\nless\\ngtr\\nleq\\ngeq">&#x22C8;&#x226E;&#x226F;&#x2270;&#x2271;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 10', () => {
    toXmlMatch(
      tex2mml(
        '\\nleqslant\\ngeqslant\\nleqq\\ngeqq\\lneq\\gneq\\lneqq\\gneqq\\lvertneqq\\gvertneqq\\lnsim\\gnsim\\lnapprox\\gnapprox'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\nleqslant\\ngeqslant\\nleqq\\ngeqq\\lneq\\gneq\\lneqq\\gneqq\\lvertneqq\\gvertneqq\\lnsim\\gnsim\\lnapprox\\gnapprox" display="block">
         <mo data-mjx-alternate="1" data-mjx-texclass="REL" data-latex="\\nleqslant\\ngeqslant\\nleqq\\ngeqq" rspace="0pt">&#x2A87;&#x2A88;&#x2270;&#x2271;</mo>
         <mo data-mjx-texclass="REL" data-latex="\\lneq\\gneq\\lneqq\\gneqq" lspace="0pt" rspace="0pt">&#x2A87;&#x2A88;&#x2268;&#x2269;</mo>
         <mo data-mjx-alternate="1" data-mjx-texclass="REL" data-latex="\\lvertneqq\\gvertneqq" lspace="0pt" rspace="0pt">&#x2268;&#x2269;</mo>
         <mo data-mjx-texclass="REL" data-latex="\\lnsim\\gnsim\\lnapprox\\gnapprox" lspace="0pt">&#x22E6;&#x22E7;&#x2A89;&#x2A8A;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 11', () => {
    toXmlMatch(
      tex2mml(
        '\\nprec\\nsucc\\npreceq\\nsucceq\\precneqq\\succneqq\\precnsim\\succnsim\\precnapprox\\succnapprox\\nsim\\ncong'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\nprec\\nsucc\\npreceq\\nsucceq\\precneqq\\succneqq\\precnsim\\succnsim\\precnapprox\\succnapprox\\nsim\\ncong" display="block">
         <mo data-mjx-texclass="REL" data-latex="\\nprec\\nsucc" rspace="0pt">&#x2280;&#x2281;</mo>
         <mo data-mjx-alternate="1" data-mjx-texclass="REL" data-latex="\\npreceq\\nsucceq" lspace="0pt" rspace="0pt">&#x22E0;&#x22E1;</mo>
         <mo data-mjx-texclass="REL" data-latex="\\precneqq\\succneqq\\precnsim\\succnsim\\precnapprox\\succnapprox\\nsim\\ncong" lspace="0pt">&#x2AB5;&#x2AB6;&#x22E8;&#x22E9;&#x2AB9;&#x2ABA;&#x2241;&#x2247;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 12', () => {
    toXmlMatch(
      tex2mml(
        '\\nshortmid\\nshortparallel\\nmid\\nparallel\\nvdash\\nvDash\\nVdash\\nVDash\\ntriangleleft\\ntriangleright'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\nshortmid\\nshortparallel\\nmid\\nparallel\\nvdash\\nvDash\\nVdash\\nVDash\\ntriangleleft\\ntriangleright" display="block">
         <mo data-mjx-alternate="1" data-mjx-texclass="REL" data-latex="\\nshortmid\\nshortparallel" rspace="0pt">&#x2224;&#x2226;</mo>
         <mo data-mjx-texclass="REL" data-latex="\\nmid\\nparallel\\nvdash\\nvDash\\nVdash\\nVDash\\ntriangleleft\\ntriangleright" lspace="0pt">&#x2224;&#x2226;&#x22AC;&#x22AD;&#x22AE;&#x22AF;&#x22EA;&#x22EB;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 13', () => {
    toXmlMatch(
      tex2mml(
        '\\ntrianglelefteq\\ntrianglerighteq\\nsubseteq\\nsupseteq\\nsubseteqq\\nsupseteqq\\subsetneq\\supsetneq\\varsubsetneq'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ntrianglelefteq\\ntrianglerighteq\\nsubseteq\\nsupseteq\\nsubseteqq\\nsupseteqq\\subsetneq\\supsetneq\\varsubsetneq" display="block">
         <mo data-mjx-texclass="REL" data-latex="\\ntrianglelefteq\\ntrianglerighteq\\nsubseteq\\nsupseteq" rspace="0pt">&#x22EC;&#x22ED;&#x2288;&#x2289;</mo>
         <mo data-mjx-alternate="1" data-mjx-texclass="REL" data-latex="\\nsubseteqq\\nsupseteqq" lspace="0pt" rspace="0pt">&#x2288;&#x2289;</mo>
         <mo data-mjx-texclass="REL" data-latex="\\subsetneq\\supsetneq" lspace="0pt" rspace="0pt">&#x228A;&#x228B;</mo>
         <mo data-mjx-alternate="1" data-latex="\\varsubsetneq" lspace="0pt">&#x228A;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 14', () => {
    toXmlMatch(
      tex2mml(
        '\\varsupsetneq\\subsetneqq\\supsetneqq\\varsubsetneqq\\varsupsetneqq\\leftleftarrows\\rightrightarrows\\leftrightarrows'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\varsupsetneq\\subsetneqq\\supsetneqq\\varsubsetneqq\\varsupsetneqq\\leftleftarrows\\rightrightarrows\\leftrightarrows" display="block">
         <mo data-mjx-alternate="1" data-latex="\\varsupsetneq" rspace="0pt">&#x228B;</mo>
         <mo data-mjx-texclass="REL" data-latex="\\subsetneqq\\supsetneqq" lspace="0pt" rspace="0pt">&#x2ACB;&#x2ACC;</mo>
         <mo data-mjx-alternate="1" data-mjx-texclass="REL" data-latex="\\varsubsetneqq\\varsupsetneqq" lspace="0pt" rspace="0pt">&#x2ACB;&#x2ACC;</mo>
         <mo data-mjx-texclass="REL" stretchy="false" data-latex="\\leftleftarrows\\rightrightarrows\\leftrightarrows" lspace="0pt">&#x21C7;&#x21C9;&#x21C6;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 15', () => {
    toXmlMatch(
      tex2mml(
        '\\rightleftarrows\\Lleftarrow\\Rrightarrow\\twoheadleftarrow\\twoheadrightarrow\\leftarrowtail\\rightarrowtail'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\rightleftarrows\\Lleftarrow\\Rrightarrow\\twoheadleftarrow\\twoheadrightarrow\\leftarrowtail\\rightarrowtail" display="block">
         <mo data-mjx-texclass="REL" stretchy="false" data-latex="\\rightleftarrows\\Lleftarrow\\Rrightarrow\\twoheadleftarrow\\twoheadrightarrow\\leftarrowtail\\rightarrowtail">&#x21C4;&#x21DA;&#x21DB;&#x219E;&#x21A0;&#x21A2;&#x21A3;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 16', () => {
    toXmlMatch(
      tex2mml(
        '\\looparrowleft\\looparrowright\\leftrightharpoons\\rightleftharpoons\\curvearrowleft\\curvearrowright\\circlearrowleft'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\looparrowleft\\looparrowright\\leftrightharpoons\\rightleftharpoons\\curvearrowleft\\curvearrowright\\circlearrowleft" display="block">
         <mo data-mjx-texclass="REL" stretchy="false" data-latex="\\looparrowleft\\looparrowright\\leftrightharpoons" rspace="0pt">&#x21AB;&#x21AC;&#x21CB;</mo>
         <mo data-mjx-alternate="1" stretchy="false" data-latex="\\rightleftharpoons" lspace="0pt" rspace="0pt">&#x21CC;</mo>
         <mo data-mjx-texclass="REL" data-latex="\\curvearrowleft\\curvearrowright\\circlearrowleft" lspace="0pt">&#x21B6;&#x21B7;&#x21BA;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 17', () => {
    toXmlMatch(
      tex2mml(
        '\\circlearrowright\\Lsh\\Rsh\\upuparrows\\downdownarrows\\upharpoonleft\\upharpoonright\\downharpoonleft\\restriction'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\circlearrowright\\Lsh\\Rsh\\upuparrows\\downdownarrows\\upharpoonleft\\upharpoonright\\downharpoonleft\\restriction" display="block">
         <mo data-mjx-texclass="REL" data-latex="\\circlearrowright\\Lsh\\Rsh\\upuparrows\\downdownarrows\\upharpoonleft\\upharpoonright\\downharpoonleft\\restriction" stretchy="false">&#x21BB;&#x21B0;&#x21B1;&#x21C8;&#x21CA;&#x21BF;&#x21BE;&#x21C3;&#x21BE;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 18', () => {
    toXmlMatch(
      tex2mml(
        '\\multimap\\downharpoonright\\leftrightsquigarrow\\rightsquigarrow\\leadsto\\dashrightarrow\\dashleftarrow\\nleftarrow'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\multimap\\downharpoonright\\leftrightsquigarrow\\rightsquigarrow\\leadsto\\dashrightarrow\\dashleftarrow\\nleftarrow" display="block">
         <mo data-mjx-texclass="REL" data-latex="\\multimap\\downharpoonright\\leftrightsquigarrow\\rightsquigarrow\\leadsto\\dashrightarrow\\dashleftarrow\\nleftarrow" stretchy="false">&#x22B8;&#x21C2;&#x21AD;&#x21DD;&#x21DD;&#x21E2;&#x21E0;&#x219A;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('math0mo 19', () => {
    toXmlMatch(
      tex2mml('\\nrightarrow\\nLeftarrow\\nRightarrow\\nleftrightarrow\\nLeftrightarrow'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\nrightarrow\\nLeftarrow\\nRightarrow\\nleftrightarrow\\nLeftrightarrow" display="block">
         <mo data-mjx-texclass="REL" stretchy="false" data-latex="\\nrightarrow\\nLeftarrow\\nRightarrow\\nleftrightarrow\\nLeftrightarrow">&#x219B;&#x21CD;&#x21CF;&#x21AE;&#x21CE;</mo>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('ams'));
