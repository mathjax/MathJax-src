import { afterAll, beforeEach, describe, test } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/cases/CasesConfiguration';
import '#js/input/tex/empheq/EmpheqConfiguration';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTex(['base', 'ams', 'cases'], {tags: 'cases'}));

/**********************************************************************************/
/**********************************************************************************/

describe('Cases', () => {

  /********************************************************************************/

  test('Numcases', () => {
    toXmlMatch(
      tex2mml('\\begin{numcases}{f(x)=} 1 & if $x > 0$ \\\\ 0 & otherwise \\end{numcases}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{numcases}{f(x)=} 1 &amp; if $x &gt; 0$ \\\\ 0 &amp; otherwise \\end{numcases}" display="block">
         <mtable columnalign="right left left left" columnspacing="0em 1em" rowspacing=".2em" data-break-align="top top top" data-latex="\\begin{numcases}{f(x)=} 1 &amp; if $x &gt; 0$ \\\\ 0 &amp; otherwise \\end{numcases}">
           <mlabeledtr data-latex="{f(x)=}">
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mpadded height="0" depth="0" voffset="height">
                 <mpadded height="0" depth="0" voffset="-1height">
                   <mi data-latex="f">f</mi>
                   <mo data-latex="(" stretchy="false">(</mo>
                   <mi data-latex="x">x</mi>
                   <mo data-latex=")" stretchy="false">)</mo>
                   <mo data-latex="=">=</mo>
                   <mo data-latex="\\mmlToken{mo}{\\U{7B}}">{</mo>
                   <mspace width="0.167em" data-latex="\\,"></mspace>
                   <mphantom>
                     <mpadded width="0">
                       <mtable columnalign="left left left" columnspacing="1em" rowspacing=".2em" data-break-align="top top top">
                         <mlabeledtr data-latex="{f(x)=}">
                           <mtd>
                             <mtext data-latex="\\text{(}">(</mtext>
                             <mtext data-latex="\\text{1}">1</mtext>
                             <mtext data-latex="\\text{)}">)</mtext>
                           </mtd>
                           <mtd>
                             <mn data-latex="1">1</mn>
                           </mtd>
                           <mtd>
                             <mstyle indentshift="2em">
                               <mstyle>
                                 <mtext>if&#xA0;</mtext>
                                 <mrow data-mjx-texclass="ORD">
                                   <mi data-latex="x">x</mi>
                                   <mo data-latex="&gt;">&gt;</mo>
                                   <mn data-latex="0">0</mn>
                                 </mrow>
                                 <mtext>&#xA0;</mtext>
                               </mstyle>
                             </mstyle>
                           </mtd>
                           <mtd>
                             <mstyle indentshift="2em"></mstyle>
                           </mtd>
                         </mlabeledtr>
                         <mlabeledtr data-latex="{f(x)=}">
                           <mtd>
                             <mtext data-latex="\\text{(}">(</mtext>
                             <mtext data-latex="\\text{2}">2</mtext>
                             <mtext data-latex="\\text{)}">)</mtext>
                           </mtd>
                           <mtd>
                             <mn data-latex="0">0</mn>
                           </mtd>
                           <mtd>
                             <mstyle indentshift="2em">
                               <mtext>otherwise&#xA0;</mtext>
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
                       <mlabeledtr data-latex="{f(x)=}">
                         <mtd>
                           <mtext data-latex="\\text{(}">(</mtext>
                           <mtext data-latex="\\text{1}">1</mtext>
                           <mtext data-latex="\\text{)}">)</mtext>
                         </mtd>
                         <mtd>
                           <mn data-latex="1">1</mn>
                         </mtd>
                         <mtd>
                           <mstyle indentshift="2em">
                             <mstyle>
                               <mtext>if&#xA0;</mtext>
                               <mrow data-mjx-texclass="ORD">
                                 <mi data-latex="x">x</mi>
                                 <mo data-latex="&gt;">&gt;</mo>
                                 <mn data-latex="0">0</mn>
                               </mrow>
                               <mtext>&#xA0;</mtext>
                             </mstyle>
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
               <mn data-latex="1">1</mn>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mstyle>
                   <mtext>if&#xA0;</mtext>
                   <mrow data-mjx-texclass="ORD">
                     <mi data-latex="x">x</mi>
                     <mo data-latex="&gt;">&gt;</mo>
                     <mn data-latex="0">0</mn>
                   </mrow>
                   <mtext>&#xA0;</mtext>
                 </mstyle>
               </mstyle>
             </mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
           </mlabeledtr>
           <mlabeledtr data-latex="{f(x)=}">
             <mtd id="mjx-eqn:2">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{2}">2</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mn data-latex="0">0</mn>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mtext>otherwise&#xA0;</mtext>
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

  test('subnumcases', () => {
    toXmlMatch(
      tex2mml('\\begin{subnumcases}{f(x)=} 1 & if $x > 0$ \\\\ 0 & otherwise \\end{subnumcases}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{subnumcases}{f(x)=} 1 &amp; if $x &gt; 0$ \\\\ 0 &amp; otherwise \\end{subnumcases}" display="block">
         <mtable columnalign="right left left left" columnspacing="0em 1em" rowspacing=".2em" data-break-align="top top top" data-latex="\\begin{subnumcases}{f(x)=} 1 &amp; if $x &gt; 0$ \\\\ 0 &amp; otherwise \\end{subnumcases}">
           <mlabeledtr data-latex="{f(x)=}">
             <mtd id="mjx-eqn:1a">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1a}">1a</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mpadded height="0" depth="0" voffset="height">
                 <mpadded height="0" depth="0" voffset="-1height">
                   <mi data-latex="f">f</mi>
                   <mo data-latex="(" stretchy="false">(</mo>
                   <mi data-latex="x">x</mi>
                   <mo data-latex=")" stretchy="false">)</mo>
                   <mo data-latex="=">=</mo>
                   <mo data-latex="\\mmlToken{mo}{\\U{7B}}">{</mo>
                   <mspace width="0.167em" data-latex="\\,"></mspace>
                   <mphantom>
                     <mpadded width="0">
                       <mtable columnalign="left left left" columnspacing="1em" rowspacing=".2em" data-break-align="top top top">
                         <mlabeledtr data-latex="{f(x)=}">
                           <mtd>
                             <mtext data-latex="\\text{(}">(</mtext>
                             <mtext data-latex="\\text{1a}">1a</mtext>
                             <mtext data-latex="\\text{)}">)</mtext>
                           </mtd>
                           <mtd>
                             <mn data-latex="1">1</mn>
                           </mtd>
                           <mtd>
                             <mstyle indentshift="2em">
                               <mstyle>
                                 <mtext>if&#xA0;</mtext>
                                 <mrow data-mjx-texclass="ORD">
                                   <mi data-latex="x">x</mi>
                                   <mo data-latex="&gt;">&gt;</mo>
                                   <mn data-latex="0">0</mn>
                                 </mrow>
                                 <mtext>&#xA0;</mtext>
                               </mstyle>
                             </mstyle>
                           </mtd>
                           <mtd>
                             <mstyle indentshift="2em"></mstyle>
                           </mtd>
                         </mlabeledtr>
                         <mlabeledtr data-latex="{f(x)=}">
                           <mtd>
                             <mtext data-latex="\\text{(}">(</mtext>
                             <mtext data-latex="\\text{1b}">1b</mtext>
                             <mtext data-latex="\\text{)}">)</mtext>
                           </mtd>
                           <mtd>
                             <mn data-latex="0">0</mn>
                           </mtd>
                           <mtd>
                             <mstyle indentshift="2em">
                               <mtext>otherwise&#xA0;</mtext>
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
                       <mlabeledtr data-latex="{f(x)=}">
                         <mtd>
                           <mtext data-latex="\\text{(}">(</mtext>
                           <mtext data-latex="\\text{1a}">1a</mtext>
                           <mtext data-latex="\\text{)}">)</mtext>
                         </mtd>
                         <mtd>
                           <mn data-latex="1">1</mn>
                         </mtd>
                         <mtd>
                           <mstyle indentshift="2em">
                             <mstyle>
                               <mtext>if&#xA0;</mtext>
                               <mrow data-mjx-texclass="ORD">
                                 <mi data-latex="x">x</mi>
                                 <mo data-latex="&gt;">&gt;</mo>
                                 <mn data-latex="0">0</mn>
                               </mrow>
                               <mtext>&#xA0;</mtext>
                             </mstyle>
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
               <mn data-latex="1">1</mn>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mstyle>
                   <mtext>if&#xA0;</mtext>
                   <mrow data-mjx-texclass="ORD">
                     <mi data-latex="x">x</mi>
                     <mo data-latex="&gt;">&gt;</mo>
                     <mn data-latex="0">0</mn>
                   </mrow>
                   <mtext>&#xA0;</mtext>
                 </mstyle>
               </mstyle>
             </mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
           </mlabeledtr>
           <mlabeledtr data-latex="{f(x)=}">
             <mtd id="mjx-eqn:1b">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1b}">1b</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mn data-latex="0">0</mn>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mtext>otherwise&#xA0;</mtext>
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

  test('Numcases with macro', () => {
    toXmlMatch(
      tex2mml('\\begin{numcases}{A=} 1 & if {x\\\\y}\\$ \\end{numcases}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{numcases}{A=} 1 &amp; if {x\\\\y}\\$ \\end{numcases}" display="block">
         <mtable columnalign="right left left left" columnspacing="0em 1em" rowspacing=".2em" data-break-align="top top top" data-latex="\\begin{numcases}{A=} 1 &amp; if {x\\\\y}\\$ \\end{numcases}">
           <mlabeledtr data-latex="{A=}">
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mpadded height="0" depth="0" voffset="height">
                 <mpadded height="0" depth="0" voffset="-1height">
                   <mi data-latex="A">A</mi>
                   <mo data-latex="=">=</mo>
                   <mo data-latex="\\mmlToken{mo}{\\U{7B}}">{</mo>
                   <mspace width="0.167em" data-latex="\\,"></mspace>
                   <mphantom>
                     <mpadded width="0">
                       <mtable columnalign="left left left" columnspacing="1em" rowspacing=".2em" data-break-align="top top top">
                         <mlabeledtr data-latex="{A=}">
                           <mtd>
                             <mtext data-latex="\\text{(}">(</mtext>
                             <mtext data-latex="\\text{1}">1</mtext>
                             <mtext data-latex="\\text{)}">)</mtext>
                           </mtd>
                           <mtd>
                             <mn data-latex="1">1</mn>
                           </mtd>
                           <mtd>
                             <mstyle indentshift="2em">
                               <mtext>if {x\\y}$&#xA0;</mtext>
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
                       <mlabeledtr data-latex="{A=}">
                         <mtd>
                           <mtext data-latex="\\text{(}">(</mtext>
                           <mtext data-latex="\\text{1}">1</mtext>
                           <mtext data-latex="\\text{)}">)</mtext>
                         </mtd>
                         <mtd>
                           <mn data-latex="1">1</mn>
                         </mtd>
                         <mtd>
                           <mstyle indentshift="2em">
                             <mtext>if {x\\y}$&#xA0;</mtext>
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
               <mn data-latex="1">1</mn>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mtext>if {x\\y}$&#xA0;</mtext>
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

  test('numcases extra brace', () => {
    expectTexError('\\begin{numcases}{A=} x & } \\end{numcases}')
      .toBe('Extra close brace or missing open brace');
  });

  /********************************************************************************/

  test('numcases extra column', () => {
    expectTexError('\\begin{numcases}{A=} x & y & z \\end{numcases}')
      .toBe('Extra alignment tab in text for numcase environment');
  });

  /********************************************************************************/

  test('entry not in numcases', () => {
    toXmlMatch(
      tex2mml('\\begin{array}{cc} x & y \\end{array}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{array}{cc} x &amp; y \\end{array}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="center center" data-frame-styles="" framespacing=".5em .125em" data-latex="\\begin{array}{cc} x &amp; y \\end{array}">
           <mtr data-latex="{cc}">
             <mtd>
               <mi data-latex="x">x</mi>
             </mtd>
             <mtd>
               <mi data-latex="y">y</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('numcases with explicit tag', () => {
    toXmlMatch(
      tex2mml('\\begin{numcases}{A=} x\\tag{A} & y \\end{numcases}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{numcases}{A=} x\\tag{A} &amp; y \\end{numcases}" display="block">
         <mtable columnalign="right left left left" columnspacing="0em 1em" rowspacing=".2em" data-break-align="top top top" data-latex="\\begin{numcases}{A=} x\\tag{A} &amp; y \\end{numcases}">
           <mlabeledtr data-latex="{A=}">
             <mtd id="mjx-eqn:A">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{A}">A</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mpadded height="0" depth="0" voffset="height">
                 <mpadded height="0" depth="0" voffset="-1height">
                   <mi data-latex="A">A</mi>
                   <mo data-latex="=">=</mo>
                   <mo data-latex="\\mmlToken{mo}{\\U{7B}}">{</mo>
                   <mspace width="0.167em" data-latex="\\,"></mspace>
                   <mphantom>
                     <mpadded width="0">
                       <mtable columnalign="left left left" columnspacing="1em" rowspacing=".2em" data-break-align="top top top">
                         <mlabeledtr data-latex="{A=}">
                           <mtd>
                             <mtext data-latex="\\text{(}">(</mtext>
                             <mtext data-latex="\\text{A}">A</mtext>
                             <mtext data-latex="\\text{)}">)</mtext>
                           </mtd>
                           <mtd>
                             <mi data-latex="\\tag{A}">x</mi>
                           </mtd>
                           <mtd>
                             <mstyle indentshift="2em">
                               <mtext>y&#xA0;</mtext>
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
                       <mlabeledtr data-latex="{A=}">
                         <mtd>
                           <mtext data-latex="\\text{(}">(</mtext>
                           <mtext data-latex="\\text{A}">A</mtext>
                           <mtext data-latex="\\text{)}">)</mtext>
                         </mtd>
                         <mtd>
                           <mi data-latex="\\tag{A}">x</mi>
                         </mtd>
                         <mtd>
                           <mstyle indentshift="2em">
                             <mtext>y&#xA0;</mtext>
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
               <mi data-latex="\\tag{A}">x</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mtext>y&#xA0;</mtext>
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

  test('numcases not complete', () => {
    expectTexError('\\begin{numcases}{A=} x & y\\')
      .toBe('Missing \\end{numcases}');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('cases'));
