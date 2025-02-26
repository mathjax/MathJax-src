import { afterAll, beforeEach, describe, test } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml, expectTexError } from '#helpers';
import { ColorArrayItem } from '#js/input/tex/colortbl/ColortblConfiguration.js';
import '#js/input/tex/color/ColorConfiguration.js';

import { Configuration } from '#js/input/tex/Configuration.js';
import { ConfigurationType } from '#js/input/tex/HandlerTypes.js';

beforeEach(() => setupTex(['base', 'colortbl']));

/**********************************************************************************/
/**********************************************************************************/

describe('Colortbl', () => {

  /********************************************************************************/

  test('cellcolor', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{cc} a & \\cellcolor{red} b \\\\ \\cellcolor{yellow} c & d \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{cc} a &amp; \\cellcolor{red} b \\\\ \\cellcolor{yellow} c &amp; d \\end{array}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{cc} a &amp; \\cellcolor{red} b \\\\ \\cellcolor{yellow} c &amp; d \\end{array}">
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd mathbackground="red">
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd mathbackground="yellow">
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

  test('cellcolor late', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{cc} a & b \\cellcolor{red} \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{cc} a &amp; b \\cellcolor{red} \\end{array}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{cc} a &amp; b \\cellcolor{red} \\end{array}">
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd mathbackground="red">
               <mi data-latex="\\cellcolor{red}">b</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('rowcolor', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{cc} a & b \\\\ \\rowcolor{yellow} c & d \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{cc} a &amp; b \\\\ \\rowcolor{yellow} c &amp; d \\end{array}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{cc} a &amp; b \\\\ \\rowcolor{yellow} c &amp; d \\end{array}">
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd mathbackground="yellow">
               <mi data-latex="c">c</mi>
             </mtd>
             <mtd mathbackground="yellow">
               <mi data-latex="d">d</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('rowcolor late', () => {
    expectTexError('\\begin{array}{cc} a & b \\\\ c & \\rowcolor{yellow} d \\end{array}')
      .toBe('\\rowcolor must be at the beginning of a row');
  });

  /********************************************************************************/

  test('columncolor', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{cc} a & \\columncolor{yellow} b \\\\ c & d \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{cc} a &amp; \\columncolor{yellow} b \\\\ c &amp; d \\end{array}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{cc} a &amp; \\columncolor{yellow} b \\\\ c &amp; d \\end{array}">
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd mathbackground="yellow">
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd>
               <mi data-latex="c">c</mi>
             </mtd>
             <mtd mathbackground="yellow">
               <mi data-latex="d">d</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('columncolor late', () => {
    expectTexError('\\begin{array}{cc} a & b \\\\ c & \\columncolor{yellow} d \\end{array}')
      .toBe('\\columncolor must be in the top row or preamble');
  });

  /********************************************************************************/

  test('columncolor in preamble', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{c>{\\columncolor{yellow}}c} a & b \\\\ c & d \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c&gt;{\\columncolor{yellow}}c} a &amp; b \\\\ c &amp; d \\end{array}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\columncolor{yellow}d\\end{array}">
           <mtr data-latex-item="{c&gt;{\\columncolor{yellow}}c}" data-latex="{c&gt;{\\columncolor{yellow}}c}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd mathbackground="yellow">
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
           <mtr data-latex-item="{c&gt;{\\columncolor{yellow}}c}" data-latex="{c&gt;{\\columncolor{yellow}}c}">
             <mtd>
               <mi data-latex="c">c</mi>
             </mtd>
             <mtd mathbackground="yellow">
               <mi data-latex="d">d</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('cellcolor in preamble', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{c>{\\cellcolor{yellow}}c} a & b \\\\ c & d \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{c&gt;{\\cellcolor{yellow}}c} a &amp; b \\\\ c &amp; d \\end{array}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\cellcolor{yellow}d\\end{array}">
           <mtr data-latex-item="{c&gt;{\\cellcolor{yellow}}c}" data-latex="{c&gt;{\\cellcolor{yellow}}c}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd mathbackground="yellow">
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
           <mtr data-latex-item="{c&gt;{\\cellcolor{yellow}}c}" data-latex="{c&gt;{\\cellcolor{yellow}}c}">
             <mtd>
               <mi data-latex="c">c</mi>
             </mtd>
             <mtd mathbackground="yellow">
               <mi data-latex="d">d</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('cellcolor with rowcolor', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{cc} a & b \\\\ \\rowcolor{red} c & \\cellcolor{yellow} d \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{cc} a &amp; b \\\\ \\rowcolor{red} c &amp; \\cellcolor{yellow} d \\end{array}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{cc} a &amp; b \\\\ \\rowcolor{red} c &amp; \\cellcolor{yellow} d \\end{array}">
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd mathbackground="red">
               <mi data-latex="c">c</mi>
             </mtd>
             <mtd mathbackground="yellow">
               <mi data-latex="d">d</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('cellcolor with columncolor', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{cc} a & \\columncolor{red} b \\\\ c & \\cellcolor{yellow} d \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{cc} a &amp; \\columncolor{red} b \\\\ c &amp; \\cellcolor{yellow} d \\end{array}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{cc} a &amp; \\columncolor{red} b \\\\ c &amp; \\cellcolor{yellow} d \\end{array}">
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd mathbackground="red">
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd>
               <mi data-latex="c">c</mi>
             </mtd>
             <mtd mathbackground="yellow">
               <mi data-latex="d">d</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('columncolor and rowcolor', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{cc} a & \\columncolor{red} b \\\\ \\rowcolor{yellow} c & d \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{cc} a &amp; \\columncolor{red} b \\\\ \\rowcolor{yellow} c &amp; d \\end{array}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{cc} a &amp; \\columncolor{red} b \\\\ \\rowcolor{yellow} c &amp; d \\end{array}">
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd mathbackground="red">
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd mathbackground="yellow">
               <mi data-latex="c">c</mi>
             </mtd>
             <mtd mathbackground="yellow">
               <mi data-latex="d">d</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('cellcolor with columncolor and rowcolor', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{cc} a & \\columncolor{red} b \\\\ \\rowcolor{yellow} c & \\cellcolor{green} d \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{cc} a &amp; \\columncolor{red} b \\\\ \\rowcolor{yellow} c &amp; \\cellcolor{green} d \\end{array}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{cc} a &amp; \\columncolor{red} b \\\\ \\rowcolor{yellow} c &amp; \\cellcolor{green} d \\end{array}">
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd mathbackground="red">
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd mathbackground="yellow">
               <mi data-latex="c">c</mi>
             </mtd>
             <mtd mathbackground="green">
               <mi data-latex="d">d</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('columncolor ignore overlap', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{cc} a & \\columncolor{red}[ignore][ignore] b \\\\ c & d \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{cc} a &amp; \\columncolor{red}[ignore][ignore] b \\\\ c &amp; d \\end{array}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" data-frame-styles="" framespacing=".5em .125em" data-latex-item="{array}" data-latex="\\begin{array}{cc} a &amp; \\columncolor{red}[ignore][ignore] b \\\\ c &amp; d \\end{array}">
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd mathbackground="red">
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
           <mtr data-latex-item="{cc}" data-latex="{cc}">
             <mtd>
               <mi data-latex="c">c</mi>
             </mtd>
             <mtd mathbackground="red">
               <mi data-latex="d">d</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('cellcolor outside of table', () => {
    expectTexError('\\cellcolor{red}')
      .toBe('Unsupported use of \\cellcolor');
  });

  /********************************************************************************/

  test('cellcolor nested', () => {
    expectTexError('\\begin{array}{c} \\frac{\\cellcolor{red} a}{b} \\end{array}')
      .toBe('Unsupported use of \\cellcolor');
  });

  /********************************************************************************/

  test('cellcolor with frame', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{|c|} \\cellcolor{red} a \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{|c|} \\cellcolor{red} a \\end{array}" display="block">
         <menclose notation="left right" data-padding="0" data-latex-item="{array}" data-latex="\\begin{array}{|c|} \\cellcolor{red} a \\end{array}">
           <mtable columnspacing="1em" rowspacing="4pt" data-frame-styles="" framespacing=".5em .125em">
             <mtr data-latex-item="{|c|}" data-latex="{|c|}">
               <mtd mathbackground="red">
                 <mi data-latex="a">a</mi>
               </mtd>
             </mtr>
           </mtable>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  test('cellcolor in pmatrix', () => {
    toXmlMatch(
      tex2mml('\\pmatrix{ \\cellcolor{red} a }'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pmatrix{ \\cellcolor{red} a }" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\pmatrix{ \\cellcolor{red} a }">
           <mo data-mjx-texclass="OPEN">(</mo>
           <mtable rowspacing="4pt" columnspacing="1em" data-frame-styles="" framespacing=".2em .125em">
             <mtr data-latex-item="{" data-latex="{">
               <mtd mathbackground="red">
                 <mi data-latex="a">a</mi>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('cellcolor with color model', () => {
    toXmlMatch(
      tex2mml('\\matrix{ \\cellcolor[rgb]{1,0,0} a }'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrix{ \\cellcolor[rgb]{1,0,0} a }" display="block">
         <mtable rowspacing="4pt" columnspacing="1em" data-frame-styles="" framespacing=".2em .125em" data-latex="\\matrix{ \\cellcolor[rgb]{1,0,0} a }">
           <mtr data-latex-item="{" data-latex="{">
             <mtd mathbackground="#ff0000">
               <mi data-latex="a">a</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    )
  });

  /********************************************************************************/

  test('color with no frame', () => {
    class myArrayItem extends ColorArrayItem {
      createMml() {
        this.setProperty('arrayPadding', null);
        return super.createMml();
      }
    }
    Configuration.create('nopadding', {
      [ConfigurationType.ITEMS]: {array: myArrayItem},
      [ConfigurationType.PRIORITY]: 20
    });
    setupTex(['base', 'colortbl', 'nopadding']);
    toXmlMatch(
      tex2mml('\\matrix{ \\cellcolor[rgb]{1,0,0} a }'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\matrix{ \\cellcolor[rgb]{1,0,0} a }" display="block">
         <mtable rowspacing="4pt" columnspacing="1em" data-frame-styles="" data-latex="\\matrix{ \\cellcolor[rgb]{1,0,0} a }">
           <mtr data-latex-item="{" data-latex="{">
             <mtd mathbackground="#ff0000">
               <mi data-latex="a">a</mi>
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

afterAll(() => getTokens('colortbl'));
