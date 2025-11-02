import { afterAll, beforeEach, describe, test } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/empheq/EmpheqConfiguration';
import '#js/input/tex/cases/CasesConfiguration';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTex(['base', 'ams', 'empheq', 'cases'], {tags: 'ams'}));

/**********************************************************************************/
/**********************************************************************************/

describe('Empheq', () => {

  /********************************************************************************/

  test('Empheq Left', () => {
    toXmlMatch(
      tex2mml('\\begin{empheq}[left=L\\Rightarrow]{align} a&=b\\\\ c&=d \\end{empheq}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{empheq}[left=L\\Rightarrow]{align} a&amp;=b\\\\ c&amp;=d \\end{empheq}" display="block">
         <mtable displaystyle="true" columnalign="right right left" columnspacing="0em 0em" rowspacing="3pt" data-break-align="bottom top" data-latex="\\begin{align} a&amp;=b\\\\ c&amp;=d \\end{empheq}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mpadded height="0" depth="0" voffset="height">
                 <mpadded height="0" depth="0" voffset="-1height">
                   <mi data-latex="L">L</mi>
                   <mo stretchy="false" data-latex="\\Rightarrow">&#x21D2;</mo>
                   <mphantom>
                     <mpadded width="0">
                       <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top">
                         <mlabeledtr>
                           <mtd>
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
                           <mtd>
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
                     </mpadded>
                   </mphantom>
                 </mpadded>
                 <mphantom>
                   <mpadded width="0">
                     <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" align="baseline 1">
                       <mlabeledtr>
                         <mtd>
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
                   </mpadded>
                 </mphantom>
               </mpadded>
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
             <mtd></mtd>
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

  test('Empheq Right', () => {
    toXmlMatch(
      tex2mml('\\begin{empheq}[right=\\Leftarrow R]{align} a&=b\\\\ c&=d \\end{empheq}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{empheq}[right=\\Leftarrow R]{align} a&amp;=b\\\\ c&amp;=d \\end{empheq}" display="block">
         <mtable displaystyle="true" columnalign="right left left" columnspacing="0em 0em" rowspacing="3pt" data-break-align="bottom top" data-latex="\\begin{align} a&amp;=b\\\\ c&amp;=d \\end{empheq}">
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
             <mtd>
               <mpadded height="0" depth="0" voffset="height">
                 <mpadded height="0" depth="0" voffset="-1height">
                   <mo stretchy="false" data-latex="\\Leftarrow">&#x21D0;</mo>
                   <mi data-latex="R">R</mi>
                   <mphantom>
                     <mpadded width="0">
                       <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top">
                         <mlabeledtr>
                           <mtd>
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
                           <mtd>
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
                     </mpadded>
                   </mphantom>
                 </mpadded>
                 <mphantom>
                   <mpadded width="0">
                     <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" align="baseline 1">
                       <mlabeledtr>
                         <mtd>
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
                   </mpadded>
                 </mphantom>
               </mpadded>
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

  test('Numcases with label', () => {
    toXmlMatch(
      tex2mml('\\begin{numcases}{A=\\label{test}} a&=b \\end{numcases}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{numcases}{A=\\label{test}} a&amp;=b \\end{numcases}" display="block">
         <mtable columnalign="right left left left" columnspacing="0em 1em" rowspacing=".2em" data-break-align="top top top" data-latex="\\begin{numcases}{A=\\label{test}} a&amp;=b \\end{numcases}">
           <mlabeledtr data-latex="{A=\\label{test}}">
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mpadded height="0" depth="0" voffset="height">
                 <mpadded height="0" depth="0" voffset="-1height">
                   <mi data-latex="A">A</mi>
                   <mo data-latex="\\label{test}">=</mo>
                   <mo data-latex="\\mmlToken{mo}{\\U{7B}}">{</mo>
                   <mspace width="0.167em" data-latex="\\,"></mspace>
                   <mphantom>
                     <mpadded width="0">
                       <mtable columnalign="left left left" columnspacing="1em" rowspacing=".2em" data-break-align="top top top">
                         <mlabeledtr data-latex="{A=\\label{test}}">
                           <mtd>
                             <mtext data-latex="\\text{(}">(</mtext>
                             <mtext data-latex="\\text{1}">1</mtext>
                             <mtext data-latex="\\text{)}">)</mtext>
                           </mtd>
                           <mtd>
                             <mi data-latex="a">a</mi>
                           </mtd>
                           <mtd>
                             <mstyle indentshift="2em">
                               <mtext>=b&#xA0;</mtext>
                             </mstyle>
                           </mtd>
                           <mtd>
                             <mstyle indentshift="2em"></mstyle>
                           </mtd>
                         </mlabeledtr>
                       </mtable>
                     </mpadded>
                   </mphantom>
                 </mpadded>
                 <mphantom>
                   <mpadded width="0">
                     <mtable columnalign="left left left" columnspacing="1em" rowspacing=".2em" data-break-align="top top top" align="baseline 1">
                       <mlabeledtr data-latex="{A=\\label{test}}">
                         <mtd>
                           <mtext data-latex="\\text{(}">(</mtext>
                           <mtext data-latex="\\text{1}">1</mtext>
                           <mtext data-latex="\\text{)}">)</mtext>
                         </mtd>
                         <mtd>
                           <mi data-latex="a">a</mi>
                         </mtd>
                         <mtd>
                           <mstyle indentshift="2em">
                             <mtext>=b&#xA0;</mtext>
                           </mstyle>
                         </mtd>
                         <mtd>
                           <mstyle indentshift="2em"></mstyle>
                         </mtd>
                       </mlabeledtr>
                     </mtable>
                   </mpadded>
                 </mphantom>
               </mpadded>
             </mtd>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mtext>=b&#xA0;</mtext>
               </mstyle>
             </mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Numcases empty right', () => {
    toXmlMatch(
      tex2mml('\\begin{empheq}[right=x]{align}  \\end{empheq}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{empheq}[right=x]{align}  \\end{empheq}" display="block">
         <mtable displaystyle="true" columnalign=" left" columnspacing=" 0em" rowspacing="3pt" data-break-align="" data-latex="\\begin{align}  \\end{empheq}">
           <mtr>
             <mtd>
               <mpadded height="0" depth="0" voffset="height">
                 <mpadded height="0" depth="0" voffset="-1height">
                   <mi data-latex="x">x</mi>
                   <mphantom>
                     <mpadded width="0">
                       <mtable displaystyle="true" columnalign="" columnspacing="0em" rowspacing="3pt" data-break-align=""></mtable>
                     </mpadded>
                   </mphantom>
                 </mpadded>
                 <mphantom>
                   <mpadded width="0">
                     <mtable displaystyle="true" columnalign="" columnspacing="0em" rowspacing="3pt" data-break-align="" align="baseline 1"></mtable>
                   </mpadded>
                 </mphantom>
               </mpadded>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Numcases empty left', () => {
    toXmlMatch(
      tex2mml('\\begin{empheq}[left=x]{multline}  \\end{empheq}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{empheq}[left=x]{multline}  \\end{empheq}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" columnspacing="0em 100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" columnalign="right center" data-latex="\\begin{multline}  \\end{empheq}">
           <mtr>
             <mtd>
               <mpadded height="0" depth="0" voffset="height">
                 <mpadded height="0" depth="0" voffset="-1height">
                   <mi data-latex="x">x</mi>
                   <mphantom>
                     <mpadded width="0">
                       <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true"></mtable>
                     </mpadded>
                   </mphantom>
                 </mpadded>
                 <mphantom>
                   <mpadded width="0">
                     <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" align="baseline 1"></mtable>
                   </mpadded>
                 </mphantom>
               </mpadded>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Numcases ', () => {
    toXmlMatch(
      tex2mml('\\begin{empheq}[right=x]{align} a \\\\ b&=c \\end{empheq}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{empheq}[right=x]{align} a \\\\ b&amp;=c \\end{empheq}" display="block">
         <mtable displaystyle="true" columnalign="right left left" columnspacing="0em 0em" rowspacing="3pt" data-break-align="bottom top" data-latex="\\begin{align} a \\\\ b&amp;=c \\end{empheq}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mi data-latex="a">a</mi>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mpadded height="0" depth="0" voffset="height">
                 <mpadded height="0" depth="0" voffset="-1height">
                   <mi data-latex="x">x</mi>
                   <mphantom>
                     <mpadded width="0">
                       <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top">
                         <mlabeledtr>
                           <mtd>
                             <mtext data-latex="\\text{(}">(</mtext>
                             <mtext data-latex="\\text{1}">1</mtext>
                             <mtext data-latex="\\text{)}">)</mtext>
                           </mtd>
                           <mtd>
                             <mi data-latex="a">a</mi>
                           </mtd>
                         </mlabeledtr>
                         <mlabeledtr>
                           <mtd>
                             <mtext data-latex="\\text{(}">(</mtext>
                             <mtext data-latex="\\text{2}">2</mtext>
                             <mtext data-latex="\\text{)}">)</mtext>
                           </mtd>
                           <mtd>
                             <mi data-latex="b">b</mi>
                           </mtd>
                           <mtd>
                             <mstyle indentshift="2em">
                               <mi></mi>
                               <mo data-latex="=">=</mo>
                               <mi data-latex="c">c</mi>
                             </mstyle>
                           </mtd>
                         </mlabeledtr>
                       </mtable>
                     </mpadded>
                   </mphantom>
                 </mpadded>
                 <mphantom>
                   <mpadded width="0">
                     <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" align="baseline 1">
                       <mlabeledtr>
                         <mtd>
                           <mtext data-latex="\\text{(}">(</mtext>
                           <mtext data-latex="\\text{1}">1</mtext>
                           <mtext data-latex="\\text{)}">)</mtext>
                         </mtd>
                         <mtd>
                           <mi data-latex="a">a</mi>
                         </mtd>
                       </mlabeledtr>
                     </mtable>
                   </mpadded>
                 </mphantom>
               </mpadded>
             </mtd>
           </mlabeledtr>
           <mlabeledtr>
             <mtd id="mjx-eqn:2">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{2}">2</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mi data-latex="b">b</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="=">=</mo>
                 <mi data-latex="c">c</mi>
               </mstyle>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Numcases alignedat', () => {
    toXmlMatch(
      tex2mml('\\begin{empheq}{alignat=2} a & b & c & d \\end{empheq}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{empheq}{alignat=2} a &amp; b &amp; c &amp; d \\end{empheq}" display="block">
         <mtable displaystyle="true" columnalign="right left right left" columnspacing="0em 0em 0em" rowspacing="3pt" data-break-align="bottom top bottom top" data-latex="\\begin{alignat}{2} a &amp; b &amp; c &amp; d \\end{empheq}">
           <mlabeledtr data-latex="{2}">
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
             <mtd>
               <mi data-latex="c">c</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi data-latex="d">d</mi>
               </mstyle>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Numcases invalid env', () => {
    expectTexError('\\begin{empheq}{split} \\end{empheq}')
      .toBe('Invalid environment "split" for empheq');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Empheq Characters', () => {

  /********************************************************************************/

  test('empheqlbrace', () => {
    toXmlMatch(
      tex2mml('\\empheqlbrace'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqlbrace" display="block">
         <mo data-latex="\\empheqlbrace">{</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqlbrace', () => {
    toXmlMatch(
      tex2mml('\\empheqlbrace'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqlbrace" display="block">
         <mo data-latex="\\empheqlbrace">{</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqrbrace', () => {
    toXmlMatch(
      tex2mml('\\empheqrbrace'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqrbrace" display="block">
         <mo data-latex="\\empheqrbrace">}</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqlbrack', () => {
    toXmlMatch(
      tex2mml('\\empheqlbrack'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqlbrack" display="block">
         <mo data-latex="\\empheqlbrack">[</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqrbrack', () => {
    toXmlMatch(
      tex2mml('\\empheqrbrack'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqrbrack" display="block">
         <mo data-latex="\\empheqrbrack">]</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqlangle', () => {
    toXmlMatch(
      tex2mml('\\empheqlangle'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqlangle" display="block">
         <mo data-latex="\\empheqlangle">&#x27E8;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqrangle', () => {
    toXmlMatch(
      tex2mml('\\empheqrangle'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqrangle" display="block">
         <mo data-latex="\\empheqrangle">&#x27E9;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqlparen', () => {
    toXmlMatch(
      tex2mml('\\empheqlparen'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqlparen" display="block">
         <mo data-latex="\\empheqlparen">(</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqrparen', () => {
    toXmlMatch(
      tex2mml('\\empheqrparen'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqrparen" display="block">
         <mo data-latex="\\empheqrparen">)</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqlvert', () => {
    toXmlMatch(
      tex2mml('\\empheqlvert'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqlvert" display="block">
         <mo data-latex="\\empheqlvert">|</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqrvert', () => {
    toXmlMatch(
      tex2mml('\\empheqrvert'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqrvert" display="block">
         <mo data-latex="\\empheqrvert">|</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test(' empheqlVert', () => {
    toXmlMatch(
      tex2mml('\\empheqlVert'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqlVert" display="block">
         <mo data-latex="\\empheqlVert">&#x2016;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqrVert', () => {
    toXmlMatch(
      tex2mml('\\empheqrVert'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqrVert" display="block">
         <mo data-latex="\\empheqrVert">&#x2016;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqlfloor', () => {
    toXmlMatch(
      tex2mml('\\empheqlfloor'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqlfloor" display="block">
         <mo data-latex="\\empheqlfloor">&#x230A;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqrfloor', () => {
    toXmlMatch(
      tex2mml('\\empheqrfloor'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqrfloor" display="block">
         <mo data-latex="\\empheqrfloor">&#x230B;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqlceil', () => {
    toXmlMatch(
      tex2mml('\\empheqlceil'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqlceil" display="block">
         <mo data-latex="\\empheqlceil">&#x2308;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqrceil', () => {
    toXmlMatch(
      tex2mml('\\empheqrceil'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqrceil" display="block">
         <mo data-latex="\\empheqrceil">&#x2309;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbiglbrace', () => {
    toXmlMatch(
      tex2mml('\\empheqbiglbrace'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbiglbrace" display="block">
         <mo data-latex="\\empheqbiglbrace">{</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbigrbrace', () => {
    toXmlMatch(
      tex2mml('\\empheqbigrbrace'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbigrbrace" display="block">
         <mo data-latex="\\empheqbigrbrace">}</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbiglbrack', () => {
    toXmlMatch(
      tex2mml('\\empheqbiglbrack'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbiglbrack" display="block">
         <mo data-latex="\\empheqbiglbrack">[</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbigrbrack', () => {
    toXmlMatch(
      tex2mml('\\empheqbigrbrack'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbigrbrack" display="block">
         <mo data-latex="\\empheqbigrbrack">]</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbiglangle', () => {
    toXmlMatch(
      tex2mml('\\empheqbiglangle'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbiglangle" display="block">
         <mo data-latex="\\empheqbiglangle">&#x27E8;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbigrangle', () => {
    toXmlMatch(
      tex2mml('\\empheqbigrangle'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbigrangle" display="block">
         <mo data-latex="\\empheqbigrangle">&#x27E9;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbiglparen', () => {
    toXmlMatch(
      tex2mml('\\empheqbiglparen'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbiglparen" display="block">
         <mo data-latex="\\empheqbiglparen">(</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbigrparen', () => {
    toXmlMatch(
      tex2mml('\\empheqbigrparen'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbigrparen" display="block">
         <mo data-latex="\\empheqbigrparen">)</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbiglvert', () => {
    toXmlMatch(
      tex2mml('\\empheqbiglvert'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbiglvert" display="block">
         <mo data-latex="\\empheqbiglvert">|</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbigrvert', () => {
    toXmlMatch(
      tex2mml('\\empheqbigrvert'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbigrvert" display="block">
         <mo data-latex="\\empheqbigrvert">|</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbiglVert', () => {
    toXmlMatch(
      tex2mml('\\empheqbiglVert'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbiglVert" display="block">
         <mo data-latex="\\empheqbiglVert">&#x2016;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbigrVert', () => {
    toXmlMatch(
      tex2mml('\\empheqbigrVert'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbigrVert" display="block">
         <mo data-latex="\\empheqbigrVert">&#x2016;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbiglfloor', () => {
    toXmlMatch(
      tex2mml('\\empheqbiglfloor'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbiglfloor" display="block">
         <mo data-latex="\\empheqbiglfloor">&#x230A;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbigrfloor', () => {
    toXmlMatch(
      tex2mml('\\empheqbigrfloor'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbigrfloor" display="block">
         <mo data-latex="\\empheqbigrfloor">&#x230B;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbiglceil', () => {
    toXmlMatch(
      tex2mml('\\empheqbiglceil'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbiglceil" display="block">
         <mo data-latex="\\empheqbiglceil">&#x2308;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbigrceil', () => {
    toXmlMatch(
      tex2mml('\\empheqbigrceil'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbigrceil" display="block">
         <mo data-latex="\\empheqbigrceil">&#x2309;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheql', () => {
    toXmlMatch(
      tex2mml('\\empheql('),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheql(" display="block">
         <mo data-latex="\\empheql(">(</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqr',() => {
    toXmlMatch(
      tex2mml('\\empheqr)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqr)" display="block">
         <mo data-latex="\\empheqr)">)</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbigl', () => {
    toXmlMatch(
      tex2mml('\\empheqbigl('),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbigl(" display="block">
         <mo data-latex="\\empheqbigl(">(</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('empheqbigr', () => {
    toXmlMatch(
      tex2mml('\\empheqbigr)'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\empheqbigr)" display="block">
         <mo data-latex="\\empheqbigr)">)</mo>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('empheq'));
