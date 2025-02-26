import { afterAll, beforeEach, describe, test } from '@jest/globals';
import {
  getTokens,
  toXmlMatch,
  setupTex,
  setupTexTypeset,
  tex2mml,
  typeset2mml,
  setupComponents,
  expectTexError,
  expectTypesetError
} from '#helpers';
import '#js/input/tex/textmacros/TextMacrosConfiguration';
import '#js/input/tex/newcommand/NewcommandConfiguration';
import '#js/input/tex/color/ColorConfiguration';
import '#js/input/tex/html/HtmlConfiguration';
import '#js/input/tex/unicode/UnicodeConfiguration';

import {Configuration} from '#js/input/tex/Configuration.js';
import {HandlerType, ConfigurationType} from '#js/input/tex/HandlerTypes.js';

/**********************************************************************************/
/**********************************************************************************/

describe('Textmacros', () => {

  beforeEach(() => setupTex(['base', 'newcommand', 'color', 'textmacros']));

  /********************************************************************************/

  test('Text plain', () => {
    toXmlMatch(
      tex2mml('\\text{abc}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{abc}" display="block">
         <mtext data-latex="\\text{abc}">abc</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text macro', () => {
    toXmlMatch(
      tex2mml('\\text{abc \\large abc}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{abc \\large abc}" display="block">
         <mrow data-latex="\\text{abc \\large abc}">
           <mtext>abc&#xA0;</mtext>
           <mtext mathsize="1.2">abc</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text unknown macro', () => {
    expectTexError('\\text{\\xyz}')
      .toBe('Undefined control sequence \\xyz');
  });

  /********************************************************************************/

  test('Text substitution macro', () => {
    toXmlMatch(
      tex2mml('\\def\\x{X} \\text{\\x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\x{X} \\text{\\x}" display="block">
         <mtext data-latex="\\def\\x{X} \\text{\\x}">X</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text mathmode macro', () => {
    expectTexError('\\text{\\frac{1}{2}}')
      .toBe('\\frac is only supported in math mode');
  });

  /********************************************************************************/

  test('Text internal math', () => {
    toXmlMatch(
      tex2mml('\\text{a $\\frac{1}{2}$ b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a $\\frac{1}{2}$ b}" display="block">
         <mrow data-latex="\\text{a $\\frac{1}{2}$ b}">
           <mtext>a&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD">
             <mfrac data-latex="\\frac{1}{2}">
               <mn data-latex="1">1</mn>
               <mn data-latex="2">2</mn>
             </mfrac>
           </mrow>
           <mtext>&#xA0;b</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text internal math complex', () => {
    toXmlMatch(
      tex2mml('\\text{a $x+y$ b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a $x+y$ b}" display="block">
         <mrow data-latex="\\text{a $x+y$ b}">
           <mtext>a&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD">
             <mrow>
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
             </mrow>
           </mrow>
           <mtext>&#xA0;b</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Textbf ', () => {
    toXmlMatch(
      tex2mml('\\def\\x{X} \\textbf{a\\x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\x{X} \\textbf{a\\x}" display="block">
         <mtext mathvariant="bold" data-latex="\\def\\x{X} \\textbf{a\\x}">aX</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text ref', () => {
    toXmlMatch(
      tex2mml('\\textbf{a \\ref{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textbf{a \\ref{a}}" display="block">
         <mrow data-latex="\\textbf{a \\ref{a}}">
           <mtext mathvariant="bold">a&#xA0;</mtext>
           <mrow href="#" class="MathJax_ref">
             <mtext>???</mtext>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('HBox size', () => {
    toXmlMatch(
      tex2mml('\\scriptstyle\\hbox{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\scriptstyle\\hbox{a}" display="block">
         <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\hbox{a}">
           <mstyle scriptlevel="0" data-latex="\\hbox{a}">
             <mtext>a</mtext>
           </mstyle>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text color', () => {
    toXmlMatch(
      tex2mml('\\text{a\\color{red}b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a\\color{red}b}" display="block">
         <mrow data-latex="\\text{a\\color{red}b}">
           <mtext>a</mtext>
           <mtext mathcolor="red">b</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text color math', () => {
    toXmlMatch(
      tex2mml('\\text{a\\color{red}b$c$}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a\\color{red}b$c$}" display="block">
         <mrow data-latex="\\text{a\\color{red}b$c$}">
           <mtext>a</mtext>
           <mtext mathcolor="red">b</mtext>
           <mrow data-mjx-texclass="ORD">
             <mi data-latex="c" mathcolor="red">c</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text color math complex', () => {
    toXmlMatch(
      tex2mml('\\text{a\\color{red}b$c+d$}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a\\color{red}b$c+d$}" display="block">
         <mrow data-latex="\\text{a\\color{red}b$c+d$}">
           <mtext>a</mtext>
           <mtext mathcolor="red">b</mtext>
           <mrow data-mjx-texclass="ORD">
             <mstyle mathcolor="red">
               <mi data-latex="c">c</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="d">d</mi>
             </mstyle>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Unbalanced Braces', () => {
    expectTexError('\\text{a ${$ b }}')
      .toBe('Math mode is not properly terminated');
  });

  /********************************************************************************/

  test('Unbalanced Braces', () => {
    expectTexError('\\text{{a $}$ b }')
      .toBe('Extra close brace or missing open brace');
  });

  /********************************************************************************/

  test('Unbalanced Braces', () => {
    expectTexError('\\let\\x=}\\text{a \\x}')
      .toBe('Extra close brace or missing open brace');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Textmacros Specials', () => {

  beforeEach(() => setupTex(['base', 'textmacros']));

  /********************************************************************************/

  test('Dollar', () => {
    toXmlMatch(
      tex2mml('\\text{a$b$}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a$b$}" display="block">
         <mrow data-latex="\\text{a$b$}">
           <mtext>a</mtext>
           <mrow data-mjx-texclass="ORD">
             <mi data-latex="b">b</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Percent', () => {
    toXmlMatch(
      tex2mml('\\text{a%comment\nb}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a%comment\nb}" display="block">
         <mtext data-latex="\\text{a%comment\nb}">ab</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('Hat', () => {
    expectTexError('\\text{a^b}').toBe("'^' allowed only in math mode");
  });

  /********************************************************************************/

  test('Underscore', () => {
    expectTexError('\\text{a_b}').toBe("'_' allowed only in math mode");
  });

  /********************************************************************************/

  test('Ampersand', () => {
    expectTexError('\\text{a&b}').toBe("Misplaced '&'");
  });

  /********************************************************************************/

  test('Hash', () => {
    expectTexError('\\text{a#b}').toBe("Misplaced '#'");
  });

  /********************************************************************************/

  test('Tilde', () => {
    toXmlMatch(
      tex2mml('\\text{a~b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a~b}" display="block">
         <mtext data-latex="\\text{a~b}">a&#xA0;b</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('Spaces', () => {
    toXmlMatch(
      tex2mml('\\text{a b\t c\r d\n e\u{00A0}f\\ g}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a b\t c\r d\n e&#xA0;f\\ g}" display="block">
         <mtext data-latex="\\text{a b\t c\r d\n e&#xA0;f\\ g}">a b c d e&#xA0;f g</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('Braces', () => {
    toXmlMatch(
      tex2mml('\\text{a {b} c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a {b} c}" display="block">
         <mrow data-latex="\\text{a {b} c}">
           <mtext>a b</mtext>
           <mtext>&#xA0;c</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Quotes', () => {
    toXmlMatch(
      tex2mml("\\text{a ``b'' `c' d}"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a ${"``"}b'' ${"`"}c' d}" display="block">
         <mtext data-latex="\\text{a ${"``"}b'' ${"`"}c' d}">a &#x201C;b&#x201D; &#x2018;c&#x2019; d</mtext>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Textmacros Macros', () => {

  beforeEach(() => setupTex(['base', 'newcommand', 'color', 'html', 'unicode', 'textmacros']));

  /********************************************************************************/

  test('Internal Math', () => {
    toXmlMatch(
      tex2mml('\\text{a\\(b\\)}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a\\(b\\)}" display="block">
         <mrow data-latex="\\text{a\\(b\\)}">
           <mtext>a</mtext>
           <mrow data-mjx-texclass="ORD">
             <mi data-latex="b">b</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Quoted Specials', () => {
    toXmlMatch(
      tex2mml('\\text{a\\$b\\_c\\%d\\{e\\}f\\&g\\#h}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a\\$b\\_c\\%d\\{e\\}f\\&amp;g\\#h}" display="block">
         <mtext data-latex="\\text{a\\$b\\_c\\%d\\{e\\}f\\&amp;g\\#h}">a$b_c%d{e}f&amp;g#h</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('Newline', () => {
    toXmlMatch(
      tex2mml('\\text{a\\\\b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a\\\\b}" display="block">
         <mrow data-latex="\\text{a\\\\b}">
           <mtext>a</mtext>
           <mrow data-mjx-texclass="ORD">
             <mspace linebreak="newline" data-latex="\\\\"></mspace>
           </mrow>
           <mtext>b</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Accents', () => {
    toXmlMatch(
      tex2mml("\\text{\\'a\\\u2019a\\`a\\\u2018a\\^a\\\"a\\~a\\=a\\.a\\u a\\v a}"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\'a\\&#x2019;a\\${"`"}a\\&#x2018;a\\^a\\&quot;a\\~a\\=a\\.a\\u a\\v a}" display="block">
         <mrow data-latex="\\text{\\'a\\&#x2019;a\\${"`"}a\\&#x2018;a\\^a\\&quot;a\\~a\\=a\\.a\\u a\\v a}">
           <mover>
             <mtext>a</mtext>
             <mo data-mjx-pseudoscript="true">&#xB4;</mo>
           </mover>
           <mover>
             <mtext>a</mtext>
             <mo data-mjx-pseudoscript="true">&#xB4;</mo>
           </mover>
           <mover>
             <mtext>a</mtext>
             <mo data-mjx-pseudoscript="true">${"`"}</mo>
           </mover>
           <mover>
             <mtext>a</mtext>
             <mo data-mjx-pseudoscript="true">${"`"}</mo>
           </mover>
           <mover>
             <mtext>a</mtext>
             <mo>^</mo>
           </mover>
           <mover>
             <mtext>a</mtext>
             <mo>&#xA8;</mo>
           </mover>
           <mover>
             <mtext>a</mtext>
             <mo>~</mo>
           </mover>
           <mover>
             <mtext>a</mtext>
             <mo>&#xAF;</mo>
           </mover>
           <mover>
             <mtext>a</mtext>
             <mo>&#x2D9;</mo>
           </mover>
           <mover>
             <mtext>a</mtext>
             <mo>&#x2D8;</mo>
           </mover>
           <mover>
             <mtext>a</mtext>
             <mo>&#x2C7;</mo>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('emph', () => {
    toXmlMatch(
      tex2mml('\\text{a\\emph{b\\emph{c}}d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a\\emph{b\\emph{c}}d}" display="block">
         <mrow data-latex="\\text{a\\emph{b\\emph{c}}d}">
           <mtext>a</mtext>
           <mrow>
             <mtext data-mjx-variant="-tex-mathit" mathvariant="italic">b</mtext>
             <mtext>c</mtext>
           </mrow>
           <mtext>d</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('rm', () => {
    toXmlMatch(
      tex2mml('\\text{a{\\rm b}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a{\\rm b}c}" display="block">
         <mrow data-latex="\\text{a{\\rm b}c}">
           <mtext>a</mtext>
           <mtext>b</mtext>
           <mtext>c</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mit', () => {
    toXmlMatch(
      tex2mml('\\text{a{\\mit b}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a{\\mit b}c}" display="block">
         <mrow data-latex="\\text{a{\\mit b}c}">
           <mtext>a</mtext>
           <mtext mathvariant="italic">b</mtext>
           <mtext>c</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('oldstyle', () => {
    toXmlMatch(
      tex2mml('\\text{0{\\oldstyle 1}2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{0{\\oldstyle 1}2}" display="block">
         <mrow data-latex="\\text{0{\\oldstyle 1}2}">
           <mtext>0</mtext>
           <mtext data-mjx-variant="-tex-oldstyle" mathvariant="normal">1</mtext>
           <mtext>2</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('cal', () => {
    toXmlMatch(
      tex2mml('\\text{a{\\cal B}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a{\\cal B}c}" display="block">
         <mrow data-latex="\\text{a{\\cal B}c}">
           <mtext>a</mtext>
           <mtext data-mjx-variant="-tex-calligraphic" mathvariant="script">B</mtext>
           <mtext>c</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('it', () => {
    toXmlMatch(
      tex2mml('\\text{a{\\it b}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a{\\it b}c}" display="block">
         <mrow data-latex="\\text{a{\\it b}c}">
           <mtext>a</mtext>
           <mtext data-mjx-variant="-tex-mathit" mathvariant="italic">b</mtext>
           <mtext>c</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('bf', () => {
    toXmlMatch(
      tex2mml('\\text{a{\\bf b}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a{\\bf b}c}" display="block">
         <mrow data-latex="\\text{a{\\bf b}c}">
           <mtext>a</mtext>
           <mtext mathvariant="bold">b</mtext>
           <mtext>c</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('sf', () => {
    toXmlMatch(
      tex2mml('\\text{a{\\sf b}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a{\\sf b}c}" display="block">
         <mrow data-latex="\\text{a{\\sf b}c}">
           <mtext>a</mtext>
           <mtext mathvariant="sans-serif">b</mtext>
           <mtext>c</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('tt', () => {
    toXmlMatch(
      tex2mml('\\text{a{\\tt b}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a{\\tt b}c}" display="block">
         <mrow data-latex="\\text{a{\\tt b}c}">
           <mtext>a</mtext>
           <mtext mathvariant="monospace">b</mtext>
           <mtext>c</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('frak', () => {
    toXmlMatch(
      tex2mml('\\text{a{\\frak b}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a{\\frak b}c}" display="block">
         <mrow data-latex="\\text{a{\\frak b}c}">
           <mtext>a</mtext>
           <mtext mathvariant="fraktur">b</mtext>
           <mtext>c</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Bbb', () => {
    toXmlMatch(
      tex2mml('\\text{a{\\Bbb b}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a{\\Bbb b}c}" display="block">
         <mrow data-latex="\\text{a{\\Bbb b}c}">
           <mtext>a</mtext>
           <mtext mathvariant="double-struck">b</mtext>
           <mtext>c</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Sizes small', () => {
    toXmlMatch(
      tex2mml('\\text{{\\tiny a\\Tiny a \\scriptsize a \\small a\\normalsize a}a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{{\\tiny a\\Tiny a \\scriptsize a \\small a\\normalsize a}a}" display="block">
         <mrow data-latex="\\text{{\\tiny a\\Tiny a \\scriptsize a \\small a\\normalsize a}a}">
           <mtext mathsize="0.5">a</mtext>
           <mtext mathsize="0.6">a&#xA0;</mtext>
           <mtext mathsize="0.7">a&#xA0;</mtext>
           <mtext mathsize="0.85">a</mtext>
           <mtext mathsize="1">a</mtext>
           <mtext>a</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Sizes large', () => {
    toXmlMatch(
      tex2mml('\\text{a\\large a\\Large a\\LARGE a\\huge a\\Huge a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a\\large a\\Large a\\LARGE a\\huge a\\Huge a}" display="block">
         <mrow data-latex="\\text{a\\large a\\Large a\\LARGE a\\huge a\\Huge a}">
           <mtext>a</mtext>
           <mtext mathsize="1.2">a</mtext>
           <mtext mathsize="1.44">a</mtext>
           <mtext mathsize="1.73">a</mtext>
           <mtext mathsize="2.07">a</mtext>
           <mtext mathsize="2.49">a</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text fonts', () => {
    toXmlMatch(
      tex2mml('\\text{\\Bbb a\\textnormal{a}\\textup{a}\\textrm{a}\\textit{a}\\textbf{a}\\textsf{a}\\texttt{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\Bbb a\\textnormal{a}\\textup{a}\\textrm{a}\\textit{a}\\textbf{a}\\textsf{a}\\texttt{a}}" display="block">
         <mrow data-latex="\\text{\\Bbb a\\textnormal{a}\\textup{a}\\textrm{a}\\textit{a}\\textbf{a}\\textsf{a}\\texttt{a}}">
           <mtext mathvariant="double-struck">a</mtext>
           <mtext>a</mtext>
           <mtext>a</mtext>
           <mtext>a</mtext>
           <mtext data-mjx-variant="-tex-mathit" mathvariant="italic">a</mtext>
           <mtext mathvariant="bold">a</mtext>
           <mtext mathvariant="sans-serif">a</mtext>
           <mtext mathvariant="monospace">a</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text symbols', () => {
    toXmlMatch(
      tex2mml('\\text{\\dagger\\ddagger\\S\\AA a\\ldots b\\vdots c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\dagger\\ddagger\\S\\AA a\\ldots b\\vdots c}" display="block">
         <mtext data-latex="\\text{\\dagger\\ddagger\\S\\AA a\\ldots b\\vdots c}">&#x2020;&#x2021;&#xA7;&#x212B;a&#x2026;b&#x22EE;c</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text space macros 1', () => {
    toXmlMatch(
      tex2mml('\\text{a\\,b\\:c\\>d\\;e\\!f}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a\\,b\\:c\\&gt;d\\;e\\!f}" display="block">
         <mrow data-latex="\\text{a\\,b\\:c\\&gt;d\\;e\\!f}">
           <mtext>a</mtext>
           <mspace width="0.167em"></mspace>
           <mtext>b</mtext>
           <mspace width="0.222em"></mspace>
           <mtext>c</mtext>
           <mspace width="0.222em"></mspace>
           <mtext>d</mtext>
           <mspace width="0.278em"></mspace>
           <mtext>e</mtext>
           <mspace width="-0.167em"></mspace>
           <mtext>f</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text space macros 2', () => {
    toXmlMatch(
      tex2mml('\\text{a\\enspace b\\quad c\\qquad d\\thinspace e\\negthinspace f}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a\\enspace b\\quad c\\qquad d\\thinspace e\\negthinspace f}" display="block">
         <mrow data-latex="\\text{a\\enspace b\\quad c\\qquad d\\thinspace e\\negthinspace f}">
           <mtext>a</mtext>
           <mspace width="0.5em"></mspace>
           <mtext>b</mtext>
           <mspace width="1em"></mspace>
           <mtext>c</mtext>
           <mspace width="2em"></mspace>
           <mtext>d</mtext>
           <mspace width="0.167em"></mspace>
           <mtext>e</mtext>
           <mspace width="-0.167em"></mspace>
           <mtext>f</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text spacing macros', () => {
    toXmlMatch(
      tex2mml('\\text{a\\hskip 1emb\\hspace{1em}c\\kern{.1em}d\\mskip{1em}e\\mspace{1em}f\\mkern{.1em}g}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a\\hskip 1emb\\hspace{1em}c\\kern{.1em}d\\mskip{1em}e\\mspace{1em}f\\mkern{.1em}g}" display="block">
         <mrow data-latex="\\text{a\\hskip 1emb\\hspace{1em}c\\kern{.1em}d\\mskip{1em}e\\mspace{1em}f\\mkern{.1em}g}">
           <mtext>a</mtext>
           <mspace width="1em"></mspace>
           <mtext>b</mtext>
           <mspace width="1em"></mspace>
           <mtext>c</mtext>
           <mspace width=".1em"></mspace>
           <mtext>d</mtext>
           <mspace width="1em"></mspace>
           <mtext>e</mtext>
           <mspace width="1em"></mspace>
           <mtext>f</mtext>
           <mspace width=".1em"></mspace>
           <mtext>g</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text rules and spaces', () => {
    toXmlMatch(
      tex2mml('\\text{\\Rule{1em}{.5em}{.5em}\\Space{1em}{.5em}{0em}\\rule[.25em]{1em}{.5em}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\Rule{1em}{.5em}{.5em}\\Space{1em}{.5em}{0em}\\rule[.25em]{1em}{.5em}}" display="block">
         <mrow data-latex="\\text{\\Rule{1em}{.5em}{.5em}\\Space{1em}{.5em}{0em}\\rule[.25em]{1em}{.5em}}">
           <mspace width="1em" height=".5em" depth=".5em" mathbackground="black"></mspace>
           <mspace width="1em" height=".5em" depth="0em"></mspace>
           <mpadded voffset=".25em" height="+.25em">
             <mspace width="1em" height=".5em" mathbackground="black"></mspace>
           </mpadded>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Color', () => {
    toXmlMatch(
      tex2mml('\\text{{\\color{red}{x}}\\textcolor{yellow}{A}\\colorbox{green}{x}\\fcolorbox{blue}{orange}{x}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{{\\color{red}{x}}\\textcolor{yellow}{A}\\colorbox{green}{x}\\fcolorbox{blue}{orange}{x}}" display="block">
         <mrow data-latex="\\text{{\\color{red}{x}}\\textcolor{yellow}{A}\\colorbox{green}{x}\\fcolorbox{blue}{orange}{x}}">
           <mtext mathcolor="red">x</mtext>
           <mstyle mathcolor="yellow">
             <mtext>A</mtext>
           </mstyle>
           <mpadded mathbackground="green" width="+10px" height="+5px" depth="+5px" lspace="5px">
             <mtext>x</mtext>
           </mpadded>
           <mpadded mathbackground="orange" style="border: 2px solid blue" width="+10px" height="+5px" depth="+5px" lspace="5px">
             <mtext>x</mtext>
           </mpadded>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('HTML', () => {
    toXmlMatch(
      tex2mml('\\text{\\href{tmp.html}{x}\\style{padding:3px}{x}\\class{test}{x}\\data{test=1}{x}\\cssId{test}{x}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\href{tmp.html}{x}\\style{padding:3px}{x}\\class{test}{x}\\data{test=1}{x}\\cssId{test}{x}}" display="block">
         <mrow data-latex="\\text{\\href{tmp.html}{x}\\style{padding:3px}{x}\\class{test}{x}\\data{test=1}{x}\\cssId{test}{x}}">
           <mtext href="tmp.html">x</mtext>
           <mtext style="padding:3px">x</mtext>
           <mtext class="test">x</mtext>
           <mtext data-test="1">x</mtext>
           <mtext id="test">x</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Unicode', () => {
    toXmlMatch(
      tex2mml('\\text{\\unicode{x61}\\U{3333}\\char"65}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\unicode{x61}\\U{3333}\\char&quot;65}" display="block">
         <mrow data-latex="\\text{\\unicode{x61}\\U{3333}\\char&quot;65}">
           <mtext>a</mtext>
           <mtext>&#x3333;</mtext>
           <mi>e</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Ref and Eqref', () => {
    toXmlMatch(
      tex2mml('\\text{\\ref{a}\\eqref{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\ref{a}\\eqref{b}}" display="block">
         <mrow data-latex="\\text{\\ref{a}\\eqref{b}}">
           <mrow href="#" class="MathJax_ref">
             <mtext>???</mtext>
           </mrow>
           <mrow href="#" class="MathJax_ref">
             <mtext>(???)</mtext>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Underline', () => {
    toXmlMatch(
      tex2mml('\\text{a \\underline{b c} d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{a \\underline{b c} d}" display="block">
         <mrow data-latex="\\text{a \\underline{b c} d}">
           <mtext>a&#xA0;</mtext>
           <munder>
             <mtext>b c</mtext>
             <mo accent="true">&#x2015;</mo>
           </munder>
           <mtext>&#xA0;d</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('lapping', () => {
    toXmlMatch(
      tex2mml('\\text{\\rlap{a}-- --\\llap{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\rlap{a}-- --\\llap{b}}" display="block">
         <mrow data-latex="\\text{\\rlap{a}-- --\\llap{b}}">
           <mrow data-mjx-texclass="ORD">
             <mpadded width="0">
               <mtext>a</mtext>
             </mpadded>
           </mrow>
           <mtext>-- --</mtext>
           <mrow data-mjx-texclass="ORD">
             <mpadded width="0" lspace="-1width">
               <mtext>b</mtext>
             </mpadded>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Phantoms', () => {
    toXmlMatch(
      tex2mml('\\text{\\phantom{a}a\\vphantom{a}a\\hphantom{a}a\\smash{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\phantom{a}a\\vphantom{a}a\\hphantom{a}a\\smash{a}}" display="block">
         <mrow data-latex="\\text{\\phantom{a}a\\vphantom{a}a\\hphantom{a}a\\smash{a}}">
           <mrow data-mjx-texclass="ORD">
             <mphantom>
               <mtext>a</mtext>
             </mphantom>
           </mrow>
           <mtext>a</mtext>
           <mrow data-mjx-texclass="ORD">
             <mpadded width="0">
               <mphantom>
                 <mtext>a</mtext>
               </mphantom>
             </mpadded>
           </mrow>
           <mtext>a</mtext>
           <mrow data-mjx-texclass="ORD">
             <mpadded height="0" depth="0">
               <mphantom>
                 <mtext>a</mtext>
               </mphantom>
             </mpadded>
           </mrow>
           <mtext>a</mtext>
           <mrow data-mjx-texclass="ORD">
             <mpadded height="0" depth="0">
               <mtext>a</mtext>
             </mpadded>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mmlToken', () => {
    toXmlMatch(
      tex2mml('\\text{\\mmlToken{mo}{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\mmlToken{mo}{a}}" display="block">
         <mo data-latex="\\text{\\mmlToken{mo}{a}}">a</mo>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Textmacros Autoload', () => {

  setupComponents({
    loader: {load: ['input/tex-base', '[tex]/textmacros', '[tex]/autoload']}
  });

  /********************************************************************************/

  test('Autoload not present', async () => {
    setupTexTypeset(['base', 'textmacros']);
    await expectTypesetError('\\text{\\href{tmp.html}{a}}')
      .toBe('Undefined control sequence \\href');
  });

  /********************************************************************************/

  test('Autoload', async () => {
    setupTexTypeset(['base', 'textmacros', 'autoload'])
    toXmlMatch(
      await typeset2mml('\\text{\\href{tmp.html}{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\href{tmp.html}{a}}" display="block">
         <mtext href="tmp.html" data-latex="\\text{\\href{tmp.html}{a}}">a</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  test('No Autoload', async () => {
    Configuration.create('no-autoload', {
      [ConfigurationType.FALLBACK]: {
        [HandlerType.MACRO]: () => {}
      }
    });
    setupTexTypeset(['base', 'textmacros', 'no-autoload'])
    toXmlMatch(
      await typeset2mml('\\text{\\href{tmp.html}{a}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\text{\\href{tmp.html}{a}}" display="block">
         <mrow data-latex="\\text{\\href{tmp.html}{a}}">
           <mtext>tmp.html</mtext>
           <mtext>a</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('text-base'));
