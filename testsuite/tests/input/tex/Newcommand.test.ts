import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/newcommand/NewcommandConfiguration';
import '#js/input/tex/ams/AmsConfiguration';
import '#js/input/tex/colorv2/ColorV2Configuration';

/**********************************************************************************/
/**********************************************************************************/

describe('Newcommand', () => {
  beforeEach(() => setupTex(['base', 'newcommand']));

  /********************************************************************************/

  it('Newcommand Simple', () => {
    toXmlMatch(
      tex2mml('\\newcommand{\\sum}{2 + 3}\\sum'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newcommand{\\sum}{2 + 3}\\sum" display="block">
         <mn data-latex="2">2</mn>
         <mo data-latex="+">+</mo>
         <mn data-latex="3">3</mn>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newcommand Arg', () => {
    toXmlMatch(
      tex2mml('\\renewcommand{\\sum}[1]{2 #1 3}\\sum{*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\renewcommand{\\sum}[1]{2 #1 3}\\sum{*}" display="block">
         <mn data-latex="2">2</mn>
         <mo data-latex="*">&#x2217;</mo>
         <mn data-latex="3">3</mn>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newcommand Optional', () => {
    toXmlMatch(
      tex2mml('\\renewcommand{\\sum}[1][+]{2 #1 3}\\sum\\sum[*]'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\renewcommand{\\sum}[1][+]{2 #1 3}\\sum\\sum[*]" display="block">
         <mn data-latex="2">2</mn>
         <mo data-latex="+">+</mo>
         <mn data-latex="3">3</mn>
         <mn data-latex="2">2</mn>
         <mo data-latex="*">&#x2217;</mo>
         <mn data-latex="3">3</mn>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newcommand Arg Optional', () => {
    toXmlMatch(
      tex2mml('\\renewcommand{\\sum}[2][+]{2 #1 3 #2 4}\\sum{+}\\sum[*]{+}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\renewcommand{\\sum}[2][+]{2 #1 3 #2 4}\\sum{+}\\sum[*]{+}" display="block">
         <mn data-latex="2">2</mn>
         <mo data-latex="+">+</mo>
         <mn data-latex="3">3</mn>
         <mo data-latex="+">+</mo>
         <mn data-latex="4">4</mn>
         <mn data-latex="2">2</mn>
         <mo data-latex="*">&#x2217;</mo>
         <mn data-latex="3">3</mn>
         <mo data-latex="+">+</mo>
         <mn data-latex="4">4</mn>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newenvironment Optional', () => {
    toXmlMatch(
      tex2mml(
        '\\newenvironment{argument}[1][a]{\\textbf{Argument #1:}}{aa}\\begin{argument}[c]b\\end{argument}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newenvironment{argument}[1][a]{\\textbf{Argument #1:}}{aa}\\begin{argument}[c]b\\end{argument}" display="block">
         <mtext mathvariant="bold" data-latex="\\textbf{Argument c:}">Argument c:</mtext>
         <mi data-latex="b">b</mi>
         <mi data-latex="a">a</mi>
         <mi data-latex="a">a</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newenvironment Optional Noarg', () => {
    toXmlMatch(
      tex2mml(
        '\\newenvironment{argument}[1][a]{\\textbf{Argument #1:}}{aa}\\begin{argument}b\\end{argument}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newenvironment{argument}[1][a]{\\textbf{Argument #1:}}{aa}\\begin{argument}b\\end{argument}" display="block">
         <mtext mathvariant="bold" data-latex="\\textbf{Argument a:}">Argument a:</mtext>
         <mi data-latex="b">b</mi>
         <mi data-latex="a">a</mi>
         <mi data-latex="a">a</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newenvironment Arg Optional', () => {
    toXmlMatch(
      tex2mml(
        '\\renewenvironment{argument}[2][a]{\\textbf{Argument #1(#2):}}{aa}\\begin{argument}[c]{3}b\\end{argument}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\renewenvironment{argument}[2][a]{\\textbf{Argument #1(#2):}}{aa}\\begin{argument}[c]{3}b\\end{argument}" display="block">
         <mtext mathvariant="bold" data-latex="\\textbf{Argument c(3):}">Argument c(3):</mtext>
         <mi data-latex="b">b</mi>
         <mi data-latex="a">a</mi>
         <mi data-latex="a">a</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Def Double Let', () => {
    toXmlMatch(
      tex2mml(
        '\\def\\bar{h}\\let\\fooi\\bar\\def\\fooii{\\bar}\\fooi +\\fooii\\def\\bar{g}\\fooi +\\fooii'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\bar{h}\\let\\fooi\\bar\\def\\fooii{\\bar}\\fooi +\\fooii\\def\\bar{g}\\fooi +\\fooii" display="block">
         <mi data-latex="h">h</mi>
         <mo data-latex="+">+</mo>
         <mi data-latex="\\def\\bar{g}">h</mi>
         <mi data-latex="h">h</mi>
         <mo data-latex="+">+</mo>
         <mi data-latex="g">g</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Def ReDef', () => {
    toXmlMatch(
      tex2mml(
        '\\def\\foo{a + b}\\foo\\def\\foo#1{a #1 b}\\foo{-}\\def\\foo#1#2{#2 #1 b}\\foo{-}{x}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\foo{a + b}\\foo\\def\\foo#1{a #1 b}\\foo{-}\\def\\foo#1#2{#2 #1 b}\\foo{-}{x}" display="block">
         <mi data-latex="a">a</mi>
         <mo data-latex="+">+</mo>
         <mi data-latex="\\def\\foo#1{a #1 b}">b</mi>
         <mi data-latex="a">a</mi>
         <mo data-latex="-">&#x2212;</mo>
         <mi data-latex="\\def\\foo#1#2{#2 #1 b}">b</mi>
         <mi data-latex="x">x</mi>
         <mo data-latex="-">&#x2212;</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Brace Equal', () => {
    toXmlMatch(
      tex2mml('\\let\\be={ \\be a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\be={ \\be a}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{a}">
           <mi data-latex="a">a</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Brace', () => {
    toXmlMatch(
      tex2mml('\\let\\be{ \\be a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\be{ \\be a}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{a}">
           <mi data-latex="a">a</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Caret', () => {
    toXmlMatch(
      tex2mml('\\let\\car^ a\\car b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\car^ a\\car b" display="block">
         <msup data-latex="^b">
           <mi data-latex="a">a</mi>
           <mi data-latex="b">b</mi>
         </msup>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Brace Delim', () => {
    toXmlMatch(
      tex2mml('\\let\\lb=\\{ \\lb \\frac{1}{2} \\}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\lb=\\{ \\lb \\frac{1}{2} \\}" display="block">
         <mo fence="false" stretchy="false" data-latex="\\lb">{</mo>
         <mfrac data-latex="\\frac{1}{2}">
           <mn data-latex="1">1</mn>
           <mn data-latex="2">2</mn>
         </mfrac>
         <mo fence="false" stretchy="false" data-latex="\\}">}</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Paren Delim', () => {
    toXmlMatch(
      tex2mml('\\let\\lb( \\lb \\frac{1}{2})'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\lb( \\lb \\frac{1}{2})" display="block">
         <mo fence="false" stretchy="false" data-latex="\\lb">(</mo>
         <mfrac data-latex="\\frac{1}{2}">
           <mn data-latex="1">1</mn>
           <mn data-latex="2">2</mn>
         </mfrac>
         <mo data-latex=")" stretchy="false">)</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Relet', () => {
    toXmlMatch(
      tex2mml('\\let\\al\\alpha\\al\\alpha\\let\\al\\aleph\\al\\alpha'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\al\\alpha\\al\\alpha\\let\\al\\aleph\\al\\alpha" display="block">
         <mi data-latex="\\al">&#x3B1;</mi>
         <mi data-latex="\\let\\al\\aleph">&#x3B1;</mi>
         <mi mathvariant="normal" data-latex="\\al">&#x2135;</mi>
         <mi data-latex="\\alpha">&#x3B1;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Let', () => {
    toXmlMatch(
      tex2mml('\\let\\al\\alpha\\al\\alpha\\let\\alpha\\beta\\al\\alpha'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\al\\alpha\\al\\alpha\\let\\alpha\\beta\\al\\alpha" display="block">
         <mi data-latex="\\al">&#x3B1;</mi>
         <mi data-latex="\\let\\alpha\\beta">&#x3B1;</mi>
         <mi data-latex="\\al">&#x3B1;</mi>
         <mi data-latex="\\alpha">&#x3B2;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Def Let', () => {
    toXmlMatch(
      tex2mml('\\def\\bar[#1]#2{#1 + #2}\\bar[a]{b}\\let\\foo\\bar\\foo[c]{d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\bar[#1]#2{#1 + #2}\\bar[a]{b}\\let\\foo\\bar\\foo[c]{d}" display="block">
         <mi data-latex="a">a</mi>
         <mo data-latex="+">+</mo>
         <mi data-latex="\\let\\foo\\bar">b</mi>
         <mi data-latex="c">c</mi>
         <mo data-latex="+">+</mo>
         <mi data-latex="d">d</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newcommand Let', () => {
    toXmlMatch(
      tex2mml(
        '\\newcommand{\\bar}[2][1]{#1 + #2}\\bar[a]{b}\\let\\foo\\bar\\foo[c]{d}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newcommand{\\bar}[2][1]{#1 + #2}\\bar[a]{b}\\let\\foo\\bar\\foo[c]{d}" display="block">
         <mi data-latex="a">a</mi>
         <mo data-latex="+">+</mo>
         <mi data-latex="\\let\\foo\\bar">b</mi>
         <mi data-latex="c">c</mi>
         <mo data-latex="+">+</mo>
         <mi data-latex="d">d</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Circular Macro', () => {
    toXmlMatch(
      tex2mml(
        '\\let\\kk\\alpha\\kk\\let\\rr\\beta\\rr\\let\\rr\\kk\\let\\kk\\beta\\kk\\rr'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\kk\\alpha\\kk\\let\\rr\\beta\\rr\\let\\rr\\kk\\let\\kk\\beta\\kk\\rr" display="block">
         <mi data-latex="\\let\\rr\\beta">&#x3B1;</mi>
         <mi data-latex="\\let\\kk\\beta">&#x3B2;</mi>
         <mi data-latex="\\kk">&#x3B2;</mi>
         <mi data-latex="\\rr">&#x3B1;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Brace Equal Stretchy', () => {
    toXmlMatch(
      tex2mml('\\let\\lb=\\{\\left\\lb \\frac{1}{2} \\right\\}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\lb=\\{\\left\\lb \\frac{1}{2} \\right\\}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\let\\lb=\\{\\left\\lb \\frac{1}{2} \\right\\}">
           <mo data-mjx-texclass="OPEN" data-latex="\\left\\lb ">{</mo>
           <mfrac data-latex="\\frac{1}{2}">
             <mn data-latex="1">1</mn>
             <mn data-latex="2">2</mn>
           </mfrac>
           <mo data-mjx-texclass="CLOSE" data-latex="\\right\\}">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Paren Stretchy', () => {
    toXmlMatch(
      tex2mml('\\let\\lb( \\left\\lb \\frac{1}{2} \\right)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\lb( \\left\\lb \\frac{1}{2} \\right)" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\let\\lb( \\left\\lb \\frac{1}{2} \\right)">
           <mo data-mjx-texclass="OPEN" data-latex="\\left\\lb ">(</mo>
           <mfrac data-latex="\\frac{1}{2}">
             <mn data-latex="1">1</mn>
             <mn data-latex="2">2</mn>
           </mfrac>
           <mo data-mjx-texclass="CLOSE" data-latex="\\right)">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Fn', () => {
    toXmlMatch(
      tex2mml('\\let\\ll\\sin\\ll(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\ll\\sin\\ll(x)" display="block">
         <mi data-latex="\\ll">sin</mi>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mo data-latex="(" stretchy="false">(</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex=")" stretchy="false">)</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Fn Double', () => {
    toXmlMatch(
      tex2mml('\\let\\ll\\sin\\ll(x)\\let\\rr\\ll\\let\\ll\\cos\\rr(x)\\ll(x)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\ll\\sin\\ll(x)\\let\\rr\\ll\\let\\ll\\cos\\rr(x)\\ll(x)" display="block">
         <mi data-latex="\\ll">sin</mi>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mo data-latex="(" stretchy="false">(</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex="\\let\\ll\\cos" stretchy="false">)</mo>
         <mi data-latex="\\rr">sin</mi>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mo data-latex="(" stretchy="false">(</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex=")" stretchy="false">)</mo>
         <mi data-latex="\\ll">cos</mi>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mo data-latex="(" stretchy="false">(</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex=")" stretchy="false">)</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Fn Circular', () => {
    toXmlMatch(
      tex2mml(
        '\\let\\save\\sin\\let\\sin\\cos\\let\\cos\\tan\\let\\tan\\save\\sin(x)\\cos(x)\\tan(x)'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\save\\sin\\let\\sin\\cos\\let\\cos\\tan\\let\\tan\\save\\sin(x)\\cos(x)\\tan(x)" display="block">
         <mi data-latex="\\sin">cos</mi>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mo data-latex="(" stretchy="false">(</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex=")" stretchy="false">)</mo>
         <mi data-latex="\\cos">tan</mi>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mo data-latex="(" stretchy="false">(</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex=")" stretchy="false">)</mo>
         <mi data-latex="\\tan">sin</mi>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <mo data-latex="(" stretchy="false">(</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex=")" stretchy="false">)</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Paren Circular', () => {
    toXmlMatch(
      tex2mml(
        '\\let\\lp(\\let\\rp)\\let\\mp\\rp\\left\\lp \\frac{a}{b}\\middle\\mp c \\right\\rp'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\lp(\\let\\rp)\\let\\mp\\rp\\left\\lp \\frac{a}{b}\\middle\\mp c \\right\\rp" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\let\\lp(\\let\\rp)\\let\\mp\\rp\\left\\lp \\frac{a}{b}\\middle\\mp c \\right\\rp">
           <mo data-mjx-texclass="OPEN" data-latex="\\left\\lp ">(</mo>
           <mfrac data-latex="\\frac{a}{b}">
             <mi data-latex="a">a</mi>
             <mi data-latex="b">b</mi>
           </mfrac>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-latex="\\middle\\mp ">)</mo>
           <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\mp"></mrow>
           <mi data-latex="c">c</mi>
           <mo data-mjx-texclass="CLOSE" data-latex="\\right\\rp">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Angle Circular', () => {
    toXmlMatch(
      tex2mml(
        '\\let\\lp\\langle\\let\\rp\\rangle\\let\\mp\\rp\\left\\lp \\frac{a}{b}\\middle\\mp c \\right\\rp'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\lp\\langle\\let\\rp\\rangle\\let\\mp\\rp\\left\\lp \\frac{a}{b}\\middle\\mp c \\right\\rp" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\let\\lp\\langle\\let\\rp\\rangle\\let\\mp\\rp\\left\\lp \\frac{a}{b}\\middle\\mp c \\right\\rp">
           <mo data-mjx-texclass="OPEN" data-latex="\\left\\lp ">&#x27E8;</mo>
           <mfrac data-latex="\\frac{a}{b}">
             <mi data-latex="a">a</mi>
             <mi data-latex="b">b</mi>
           </mfrac>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-latex="\\middle\\mp ">&#x27E9;</mo>
           <mrow data-mjx-texclass="OPEN" data-latex="\\middle\\mp"></mrow>
           <mi data-latex="c">c</mi>
           <mo data-mjx-texclass="CLOSE" data-latex="\\right\\rp">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Circular Character', () => {
    toXmlMatch(
      tex2mml(
        '\\let\\a a\\let\\b b\\a \\b\\let\\c\\a\\let\\a c\\c \\a\\let\\d=\\c\\let\\c\\b\\d \\c'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\a a\\let\\b b\\a \\b\\let\\c\\a\\let\\a c\\c \\a\\let\\d=\\c\\let\\c\\b\\d \\c" display="block">
         <mi data-latex="a">a</mi>
         <mi data-latex="\\let\\a c">b</mi>
         <mi data-latex="a">a</mi>
         <mi data-latex="\\let\\c\\b">c</mi>
         <mi data-latex="a">a</mi>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Self', () => {
    expectTexError('\\let\\x\\x \\x')
      .toBe('Undefined control sequence \\x');
  });

  /********************************************************************************/

  it('Let Overwrite Sqrt Choose', () => {
    toXmlMatch(
      tex2mml('\\let\\sqrt\\choose a\\sqrt b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\sqrt\\choose a\\sqrt b" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\let\\sqrt\\choose a\\sqrt b">
           <mrow data-mjx-texclass="OPEN" data-latex="\\biggl (">
             <mo minsize="2.047em" maxsize="2.047em">(</mo>
           </mrow>
           <mfrac linethickness="0">
             <mi data-latex="a">a</mi>
             <mi data-latex="b">b</mi>
           </mfrac>
           <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr )">
             <mo minsize="2.047em" maxsize="2.047em">)</mo>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Def Optional Brace', () => {
    toXmlMatch(
      tex2mml('\\def\\bar[#1]#2{#1 + #2}\\bar[{a}]{b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\bar[#1]#2{#1 + #2}\\bar[{a}]{b}" display="block">
         <mi data-latex="a">a</mi>
         <mo data-latex="+">+</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Def Options CS', () => {
    toXmlMatch(
      tex2mml('\\def\\bar[#1]#2{#1 + #2}\\bar[\\sqrt{2}]{b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\bar[#1]#2{#1 + #2}\\bar[\\sqrt{2}]{b}" display="block">
         <msqrt data-latex="\\sqrt{2}">
           <mn data-latex="2">2</mn>
         </msqrt>
         <mo data-latex="+">+</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Def Template Matching', () => {
    toXmlMatch(
      tex2mml('\\def\\ending{+}\\def\\test#1\\end{[#1]} \\test a\\ending b\\end'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\ending{+}\\def\\test#1\\end{[#1]} \\test a\\ending b\\end" display="block">
         <mo data-latex="[" stretchy="false">[</mo>
         <mi data-latex="a">a</mi>
         <mo data-latex="+">+</mo>
         <mi data-latex="b">b</mi>
         <mo data-latex="]" stretchy="false">]</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('Def Template Brace Removal', () => {
    toXmlMatch(
      tex2mml('\\def\\test#1\\end{\\text{#1}} \\test{a b}\\end'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\test#1\\end{\\text{#1}} \\test{a b}\\end" display="block">
        <mtext data-latex="\\text{a b}">a b</mtext>
      </math>`
    );
  });

  /********************************************************************************/

  it('Def Template Brace Retention', () => {
    toXmlMatch(
      tex2mml('\\def\\test#1\\end{\\text{#1}} \\test{a}{b}\\end'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\test#1\\end{\\text{#1}} \\test{a}{b}\\end" display="block">
        <mtext data-latex="\\text{{a}{b}}">{a}{b}</mtext>
      </math>`
    );
  });

  /********************************************************************************/

  it('Def Hash Replacement', () => {
    toXmlMatch(
      tex2mml('\\def\\x#1{\\def\\y##1#1{[##1]}\\y} \\x\\X abc \\X'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\x#1{\\def\\y##1#1{[##1]}\\y} \\x\\X abc \\X" display="block">
         <mo data-latex="[" stretchy="false">[</mo>
         <mi data-latex="a">a</mi>
         <mi data-latex="b">b</mi>
         <mi data-latex="c">c</mi>
         <mo data-latex="]" stretchy="false">]</mo>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Newcommand Color v2', () => {
  beforeEach(() => setupTex(['base', 'newcommand', 'colorv2']));

  /********************************************************************************/

  it('Newenvironment Empty', () => {
    toXmlMatch(
      tex2mml(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\begin{myHeartEnv}\\end{myHeartEnv}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\begin{myHeartEnv}\\end{myHeartEnv}" display="block">
         <mstyle mathcolor="purple" data-latex="\\color{purple}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="green" data-latex="\\color{green}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mtext data-latex="\\text{ forever}">&#xA0;forever</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newenvironment Content', () => {
    toXmlMatch(
      tex2mml(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\begin{myHeartEnv}  2+3\\end{myHeartEnv}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\begin{myHeartEnv}  2+3\\end{myHeartEnv}" display="block">
         <mstyle mathcolor="purple" data-latex="\\color{purple}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="green" data-latex="\\color{green}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mn data-latex="2">2</mn>
         <mo data-latex="+">+</mo>
         <mn data-latex="3">3</mn>
         <mtext data-latex="\\text{ forever}">&#xA0;forever</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newenvironment Nested Double', () => {
    toXmlMatch(
      tex2mml(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\end{yourHeartEnv}\\end{myHeartEnv}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\end{yourHeartEnv}\\end{myHeartEnv}" display="block">
         <mstyle mathcolor="purple" data-latex="\\color{purple}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="green" data-latex="\\color{green}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mstyle mathcolor="blue" data-latex="\\color{blue}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="black" data-latex="\\color{black}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mi data-latex="a">a</mi>
         <mtext data-latex="\\text{ never}">&#xA0;never</mtext>
         <mtext data-latex="\\text{ forever}">&#xA0;forever</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newenvironment Nested Double 2', () => {
    toXmlMatch(
      tex2mml(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\newenvironment{theirHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\end{yourHeartEnv}\\begin{theirHeartEnv}b\\end{theirHeartEnv}\\end{myHeartEnv}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\newenvironment{theirHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\end{yourHeartEnv}\\begin{theirHeartEnv}b\\end{theirHeartEnv}\\end{myHeartEnv}" display="block">
         <mstyle mathcolor="purple" data-latex="\\color{purple}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="green" data-latex="\\color{green}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mstyle mathcolor="blue" data-latex="\\color{blue}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="black" data-latex="\\color{black}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mi data-latex="a">a</mi>
         <mtext data-latex="\\text{ never}">&#xA0;never</mtext>
         <mstyle mathcolor="blue" data-latex="\\color{blue}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="black" data-latex="\\color{black}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mi data-latex="b">b</mi>
         <mtext data-latex="\\text{ never}">&#xA0;never</mtext>
         <mtext data-latex="\\text{ forever}">&#xA0;forever</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newenvironment Nested Triple', () => {
    toXmlMatch(
      tex2mml(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\newenvironment{theirHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\begin{theirHeartEnv}b\\end{theirHeartEnv}\\end{yourHeartEnv}\\end{myHeartEnv}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\newenvironment{theirHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\begin{theirHeartEnv}b\\end{theirHeartEnv}\\end{yourHeartEnv}\\end{myHeartEnv}" display="block">
         <mstyle mathcolor="purple" data-latex="\\color{purple}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="green" data-latex="\\color{green}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mstyle mathcolor="blue" data-latex="\\color{blue}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="black" data-latex="\\color{black}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mi data-latex="a">a</mi>
         <mstyle mathcolor="blue" data-latex="\\color{blue}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="black" data-latex="\\color{black}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mi data-latex="b">b</mi>
         <mtext data-latex="\\text{ never}">&#xA0;never</mtext>
         <mtext data-latex="\\text{ never}">&#xA0;never</mtext>
         <mtext data-latex="\\text{ forever}">&#xA0;forever</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newenvironment Nested Triple Text', () => {
    toXmlMatch(
      tex2mml(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\newenvironment{theirHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\begin{theirHeartEnv}b\\end{theirHeartEnv}c\\end{yourHeartEnv}d\\end{myHeartEnv}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\newenvironment{theirHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\begin{theirHeartEnv}b\\end{theirHeartEnv}c\\end{yourHeartEnv}d\\end{myHeartEnv}" display="block">
         <mstyle mathcolor="purple" data-latex="\\color{purple}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="green" data-latex="\\color{green}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mstyle mathcolor="blue" data-latex="\\color{blue}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="black" data-latex="\\color{black}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mi data-latex="a">a</mi>
         <mstyle mathcolor="blue" data-latex="\\color{blue}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mspace width="-2.5pt" linebreak="nobreak" data-latex="\\kern-2.5pt"></mspace>
         <mstyle mathcolor="black" data-latex="\\color{black}{\\heartsuit}">
           <mi mathvariant="normal" data-latex="\\heartsuit">&#x2661;</mi>
         </mstyle>
         <mi data-latex="b">b</mi>
         <mtext data-latex="\\text{ never}">&#xA0;never</mtext>
         <mi data-latex="c">c</mi>
         <mtext data-latex="\\text{ never}">&#xA0;never</mtext>
         <mi data-latex="d">d</mi>
         <mtext data-latex="\\text{ forever}">&#xA0;forever</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Newenvironment Nested Error', () => {
    expectTexError(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\newenvironment{theirHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\begin{theirHeartEnv}b\\end{yourHeartEnv}\\end{theirHeartEnv}\\end{myHeartEnv}'
      )
      .toBe('\\begin{theirHeartEnv} ended with \\end{yourHeartEnv}');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Newcommand Ams', () => {
  beforeEach(() => setupTex(['base', 'newcommand', 'ams']));

  /********************************************************************************/

  it('Newenvironment Align', () => {
    expectTexError(
      '\\newenvironment{proof}{\\textbf{Proof:}}{\\begin{align} \\blacksquare \\end{align}}\\begin{proof}a=b\\end{proof}'
    ).toBe('Erroneous nesting of equation structures');
  });

  /********************************************************************************/

  it('Newenvironment Align End', () => {
    expectTexError(
      '\\newenvironment{proof}{\\begin{align}\\textbf{Proof:}}{\\end{align}}\\begin{proof}a=b\\end{proof}'
    ).toBe('Erroneous nesting of equation structures');
  });

  /********************************************************************************/

  it('Newenvironment Align Split', () => {
    expectTexError(
      '\\newenvironment{proof}{\\begin{align}\\textbf{Proof:}&}{ \\begin{split} 5 \\end{split}&& \\blacksquare\\end{align}}\\begin{proof}a&=b\\end{proof}'
    ).toBe('Erroneous nesting of equation structures');
  });

  /********************************************************************************/

  it('Let Bar', () => {
    toXmlMatch(
      tex2mml('\\let\\b\\lvert\\let\\lvert\\langle\\vert\\b\\lvert'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\b\\lvert\\let\\lvert\\langle\\vert\\b\\lvert" display="block">
         <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
         <mo data-mjx-texclass="OPEN" data-latex="\\b">|</mo>
         <mo fence="false" stretchy="false" data-latex="\\lvert">&#x27E8;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let Bar Stretchy', () => {
    toXmlMatch(
      tex2mml('\\let\\b\\lvert\\let\\lvert\\langle\\left\\b q \\right\\lvert'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\b\\lvert\\let\\lvert\\langle\\left\\b q \\right\\lvert" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\let\\b\\lvert\\let\\lvert\\langle\\left\\b q \\right\\lvert">
           <mo data-mjx-texclass="OPEN" data-latex="\\left\\b ">|</mo>
           <mi data-latex="q">q</mi>
           <mo data-mjx-texclass="CLOSE" data-latex="\\right\\lvert">&#x27E8;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('NewcommandError', () => {
  beforeEach(() => setupTex(['base', 'newcommand']));

  /********************************************************************************/

  it('No Sequence', () => {
    expectTexError('\\def\\bar[#1]#3{}')
      .toBe('Parameters for \\bar must be numbered sequentially');
  });

  /********************************************************************************/

  it('No CS', () => {
    expectTexError('\\def{\\bar}[#1]#2{}')
      .toBe('\\def must be followed by a control sequence');
  });

  /********************************************************************************/

  it('Illegal Hash', () => {
    expectTexError('\\def\\bar[##1]#2{#1}')
      .toBe('Illegal use of # in template for \\bar');
  });

  /********************************************************************************/

  it('No Replacement', () => {
    expectTexError('\\def\\bar[#1]#2')
      .toBe('Missing replacement string for definition of \\def');
  });

  /********************************************************************************/

  it('Runaway Argument', () => {
    expectTexError('\\def\\bar[#1]#2{}\\bar[')
      .toBe('Runaway argument for \\bar?');
  });

  /********************************************************************************/

  it('Illegal CS', () => {
    expectTexError('\\newcommand{\\11}{a}')
      .toBe('Illegal control sequence name for \\newcommand');
  });

  /********************************************************************************/

  it('Illegal Parameter Number', () => {
    expectTexError('\\newenvironment{hh}[a]{}{}')
      .toBe('Illegal number of parameters specified in \\newenvironment');
  });

  /********************************************************************************/

  it('Let Undefined CS', () => {
    expectTexError('\\let\\aa\\bb \\aa')
      .toBe('Undefined control sequence \\aa');
  });

  /********************************************************************************/

  it('Missing Arguments', () => {
    expectTexError('\\def\\bar[#1]#2#3{c + c}\\bar')
      .toBe('Use of \\bar doesn\'t match its definition');
  });

  /********************************************************************************/

  it('Single Let Error', () => {
    expectTexError('\\let\\aa\\textbf\\let\\bb\\aa\\aa')
      .toBe('Missing argument for \\aa');
  });

  /********************************************************************************/

  it('Double Let Error', () => {
    expectTexError('\\let\\aa\\textbf\\let\\bb\\aa\\bb')
      .toBe('Missing argument for \\bb');
  });

  /********************************************************************************/

  it('Triple Let Error', () => {
    expectTexError('\\let\\aa\\textbf\\let\\bb\\aa\\let\\textbf\\sqrt\\textbf[1]')
      .toBe('Missing argument for \\textbf');
  });

  /********************************************************************************/

  it('Illegal Argument Number', () => {
    expectTexError('\\newcommand{\\foo}[a]{#1 + #2}')
      .toBe('Illegal number of parameters specified in \\newcommand');
  });

  /********************************************************************************/

  it('Optional Brace Error', () => {
    expectTexError('\\def\\bar[{#1}]#2{#1 + #2}')
      .toBe("You can't use 'macro parameter character #' in math mode");
  });

  /********************************************************************************/

  it('Missing End Error', () => {
    expectTexError('\\newenvironment{env}{aa}{bb}\\begin{env}cc')
      .toBe('Missing \\end{env}');
  });

  /********************************************************************************/

  it('Hash Error', () => {
    expectTexError('\\def\\x#1{a #1 b #c} \\x{a}')
      .toBe('Illegal macro parameter reference');
  });

  /********************************************************************************/

  it('Recursive Macro', () => {
    expectTexError('\\def\\x{\\x} \\x')
      .toBe('MathJax maximum macro substitution count exceeded; is here a recursive macro call?');
  });

  /********************************************************************************/

  it('Recursive Environment', () => {
    expectTexError('\\newenvironment{error}{\\begin{error}}{\\end{error}} \\begin{error}\\end{error}')
      .toBe('MathJax maximum substitution count exceeded; is there a recursive latex environment?');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Newcommand Overrides', () => {
  beforeEach(() => setupTex(['base', 'newcommand']));

  /********************************************************************************/

  it('Let def macro be undefined', () => {
    expectTexError('\\def\\test{error} \\let\\test=\\undefined \\test')
      .toBe('Undefined control sequence \\test');
  });

  /********************************************************************************/

  it('Let existing macro be undefined', () => {
    expectTexError('\\let\\sqrt=\\undefined \\sqrt{x}')
      .toBe('Undefined control sequence \\sqrt');
  });

  /********************************************************************************/

  it('Let existing delimiter be undefined', () => {
    expectTexError('\\let\\|=\\undefined \\left\\| X \\right\\|')
      .toBe('Missing or unrecognized delimiter for \\left');
  });

  /********************************************************************************/

  it('Let after def of existing macro be undefined', () => {
    expectTexError('\\def\\sqrt{X} \\let\\sqrt=\\undefined \\sqrt{x}')
      .toBe('Undefined control sequence \\sqrt');
  });

  /********************************************************************************/

  it('Def overrides let delimiter', () => {
    expectTexError('\\let\\test=\\| \\def\\test{x} \\left\\test X \\right\\test')
      .toBe('Missing or unrecognized delimiter for \\left');
  });

  /********************************************************************************/

  it('Def overrides let delimiter as macro', () => {
    toXmlMatch(
      tex2mml('\\let\\test=\\| \\def\\test{x} \\test'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\test=\\| \\def\\test{x} \\test" display="block">
         <mi data-latex="x">x</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Def overrides existing delimiter', () => {
    expectTexError('\\def\\|{x} \\left\\| X \\right\\|')
      .toBe('Missing or unrecognized delimiter for \\left');
  });

  /********************************************************************************/

  it('Def overrides existing delimiter as macro', () => {
    toXmlMatch(
      tex2mml('\\def\\|{x} \\|'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\|{x} \\|" display="block">
         <mi data-latex="x">x</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let overrides def macro', () => {
    toXmlMatch(
      tex2mml('\\def\\test{x} \\let\\test=\\| \\test X \\test'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\test{x} \\let\\test=\\| \\test X \\test" display="block">
         <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\test">&#x2016;</mo>
         <mi data-latex="X">X</mi>
         <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\test">&#x2016;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let overrides def macro as delimiter', () => {
    toXmlMatch(
      tex2mml('\\def\\test{x} \\let\\test=\\| \\left\\test X \\right\\test'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\test{x} \\let\\test=\\| \\left\\test X \\right\\test" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\def\\test{x} \\let\\test=\\| \\left\\test X \\right\\test">
           <mo data-mjx-texclass="OPEN" data-latex="\\left\\test ">&#x2016;</mo>
           <mi data-latex="X">X</mi>
           <mo data-mjx-texclass="CLOSE" data-latex="\\right\\test">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let overrides existing macro', () => {
    toXmlMatch(
      tex2mml('\\let\\sqrt=\\| \\sqrt X'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\sqrt=\\| \\sqrt X" display="block">
         <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\sqrt">&#x2016;</mo>
         <mi data-latex="X">X</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let overrides existing macro as delimiter', () => {
    toXmlMatch(
      tex2mml('\\let\\sqrt=\\| \\left\\sqrt X \\right\\sqrt'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\sqrt=\\| \\left\\sqrt X \\right\\sqrt" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\let\\sqrt=\\| \\left\\sqrt X \\right\\sqrt">
           <mo data-mjx-texclass="OPEN" data-latex="\\left\\sqrt ">&#x2016;</mo>
           <mi data-latex="X">X</mi>
           <mo data-mjx-texclass="CLOSE" data-latex="\\right\\sqrt">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let overrides delimiter', () => {
    expectTexError('\\let\\|=\\sqrt \\left\\| X \\right\\|')
      .toBe('Missing or unrecognized delimiter for \\left');
  });

  /********************************************************************************/

  it('Let overrides delimiter as macro', () => {
    toXmlMatch(
      tex2mml('\\let\\|=\\sqrt \\| X'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\|=\\sqrt \\| X" display="block">
         <msqrt data-latex="\\let\\|=\\sqrt \\| X">
           <mi data-latex="X">X</mi>
         </msqrt>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let of character macro overrides delimiter', () => {
    expectTexError('\\let\\|=\\alpha \\left\\| X \\right\\|')
      .toBe('Missing or unrecognized delimiter for \\left');
  });

  /********************************************************************************/

  it('Let of character creates delimiter', () => {
    toXmlMatch(
      tex2mml('\\let\\test=< \\left\\test X \\right\\test'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\let\\test=&lt; \\left\\test X \\right\\test" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\let\\test=&lt; \\left\\test X \\right\\test">
           <mo data-mjx-texclass="OPEN" data-latex="\\left\\test ">&#x27E8;</mo>
           <mi data-latex="X">X</mi>
           <mo data-mjx-texclass="CLOSE" data-latex="\\right\\test">&#x27E8;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Let of character overrides def', () => {
    toXmlMatch(
      tex2mml('\\def\\test{X}\\let\\test=< \\test'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\test{X}\\let\\test=&lt; \\test" display="block">
         <mo fence="false" stretchy="false" data-latex="\\def\\test{X}\\let\\test=&lt; \\test">&#x27E8;</mo>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Nested Environments', () => {
  beforeEach(() => setupTex(['base', 'ams', 'newcommand']));

  /********************************************************************************/

  it('Newenvironment with Begin', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\newenvironment{boxed}{\\begin{array}{|c|c|}\\hline}{\\\\\\hline\\end{array}}',
          '\\begin{boxed}a&b\\\\c&d\\end{boxed}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newenvironment{boxed}{\\begin{array}{|c|c|}\\hline}{\\\\\\hline\\end{array}}\\begin{boxed}a&amp;b\\\\c&amp;d\\end{boxed}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" columnlines="solid" framespacing=".5em .125em" frame="solid" data-latex="{array}">
           <mtr data-latex="{|c|c|}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
           <mtr data-latex="{|c|c|}">
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

  it('Environments Nested', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\newenvironment{boxed}{\\begin{array}{|c|c|}\\hline}{\\\\\\hline\\end{array}}',
          '\\begin{boxed}\\begin{boxed}a&b\\\\c&d\\end{boxed} & X \\\end{boxed}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newenvironment{boxed}{\\begin{array}{|c|c|}\\hline}{\\\\\\hline\\end{array}}\\begin{boxed}\\begin{boxed}a&amp;b\\\\c&amp;d\\end{boxed} &amp; X \\end{boxed}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" columnlines="solid" framespacing=".5em .125em" frame="solid" data-latex="{array}">
           <mtr data-latex="{|c|c|}">
             <mtd>
               <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" columnlines="solid" framespacing=".5em .125em" frame="solid" data-latex="{array}">
                 <mtr data-latex="{|c|c|}">
                   <mtd>
                     <mi data-latex="a">a</mi>
                   </mtd>
                   <mtd>
                     <mi data-latex="b">b</mi>
                   </mtd>
                 </mtr>
                 <mtr data-latex="{|c|c|}">
                   <mtd>
                     <mi data-latex="c">c</mi>
                   </mtd>
                   <mtd>
                     <mi data-latex="d">d</mi>
                   </mtd>
                 </mtr>
               </mtable>
             </mtd>
             <mtd>
               <mi data-latex="X">X</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Environments Intermixed', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\newenvironment{a}{\\begin{b}}{\\end{b}}',
          '\\newenvironment{b}{x}{y}',
          '\\begin{a} ... \\end{b}\\begin{b}\\end{a}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newenvironment{a}{\\begin{b}}{\\end{b}}\\newenvironment{b}{x}{y}\\begin{a} ... \\end{b}\\begin{b}\\end{a}" display="block">
         <mi data-latex="x">x</mi>
         <mo data-latex=".">.</mo>
         <mo data-latex=".">.</mo>
         <mo data-latex=".">.</mo>
         <mi data-latex="y">y</mi>
         <mi data-latex="x">x</mi>
         <mi data-latex="y">y</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Nested Begins', () => {
    toXmlMatch(
      tex2mml('\\newenvironment{a}{x}{y}\\newenvironment{b}{p}{q}\\begin{a}\\begin{b}X\\end{b}\\end{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newenvironment{a}{x}{y}\\newenvironment{b}{p}{q}\\begin{a}\\begin{b}X\\end{b}\\end{a}" display="block">
         <mi data-latex="x">x</mi>
         <mi data-latex="p">p</mi>
         <mi data-latex="X">X</mi>
         <mi data-latex="q">q</mi>
         <mi data-latex="y">y</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Dangling End', () => {
    expectTexError('\\newenvironment{a}{x}{y\\end{a}}\\begin{a} ... \\end{a}')
      .toBe('Missing \\begin{a} or extra \\end{a}');
  });

  /********************************************************************************/

  it('Nested Dangling End', () => {
    expectTexError(
      '\\newenvironment{a}{\\begin{b}}{\\end{b}}\\newenvironment{b}{x}{y\\end{b}}\\begin{a}X\\end{a}')
      .toBe('\\begin{a} ended with \\end{b}');
  });

  /********************************************************************************/

  it('Badly Nested Begins', () => {
    expectTexError(
      '\\newenvironment{a}{x}{y}\\newenvironment{b}{p}{q}\\begin{a}\\begin{b} ... \\end{a}\\end{b}'
    ).toBe('\\begin{b} ended with \\end{a}');
  });

  /********************************************************************************/

  it('Ended by Wrong Environment', () => {
    expectTexError('\\newenvironment{a}{x}{y}\\begin{a} X \\end{cases}')
      .toBe('\\begin{a} ended with \\end{cases}');
  });

  /********************************************************************************/

  it('Unbalanced Ends 1', () => {
    expectTexError(
      '\\newenvironment{a}{a}{b\\end{a}}\\newenvironment{b}{x}{y}\\begin{a}\\begin{b}...\\end{b}\\end{a}'
    ).toBe('Missing \\begin{a} or extra \\end{a}');
  });

  /********************************************************************************/

  it('Unbalanced Ends 2', () => {
    expectTexError(
      '\\newenvironment{a}{a}{b\\end{a}}\\newenvironment{b}{x}{y}\\begin{b}\\begin{a}...\\end{a}\\end{b}'
    ).toBe('\\begin{b} ended with \\end{a}');
  });

  /********************************************************************************/

  it('Triple Nesting', () => {
    expectTexError(
      [
        '\\newenvironment{c}{x}{\\end{a}y}',
        '\\newenvironment{b}{begin{c}x}{\\end{c}y}',
        '\\newenvironment{a}{\\begin{b}x}{\\end{b}y}',
        '\\begin{a} ... '
      ].join('')
    ).toBe('Missing \\end{b}');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('newcommand'));
