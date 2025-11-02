import { beforeEach, describe, test } from '@jest/globals';
import { toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/tagformat/TagFormatConfiguration';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTex(['base', 'ams', 'tagformat'], {
  tagformat: {
    number: (n: number) => `A${n}`,
    tag: (tag: string) => `[${tag}]`,
    id: (id: string) => 'my-tag:' + id.replace(/\s/g, '_'),
    url: (id: string, base: string) => `[[${base}#${encodeURIComponent(id)}]]`
  },
  tags: 'ams'
}));

/**********************************************************************************/
/**********************************************************************************/

describe('Tagformat', () => {

  /********************************************************************************/

  test('Basic tag', () => {
    toXmlMatch(
      tex2mml('x \\tag{1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x \\tag{1}" display="block">
         <mtable displaystyle="true" data-latex="x \\tag{1}">
           <mlabeledtr>
             <mtd id="my-tag:1">
               <mtext data-latex="\\text{[}">[</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{]}">]</mtext>
             </mtd>
             <mtd>
               <mi data-latex="\\tag{1}">x</mi>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Text tag', () => {
    toXmlMatch(
      tex2mml('x \\tag{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x \\tag{x}" display="block">
         <mtable displaystyle="true" data-latex="x \\tag{x}">
           <mlabeledtr>
             <mtd id="my-tag:x">
               <mtext data-latex="\\text{[}">[</mtext>
               <mtext data-latex="\\text{x}">x</mtext>
               <mtext data-latex="\\text{]}">]</mtext>
             </mtd>
             <mtd>
               <mi data-latex="\\tag{x}">x</mi>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Ref', () => {
    toXmlMatch(
      tex2mml('\\begin{align}x \\label{test}\\tag{x}\\\\ \\ref{test} \\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}x \\label{test}\\tag{x}\\\\ \\ref{test} \\end{align}" display="block">
         <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex="\\begin{align}x \\label{test}\\tag{x}\\\\ \\ref{test} \\end{align}">
           <mlabeledtr>
             <mtd id="my-tag:test">
               <mtext data-latex="\\text{[}">[</mtext>
               <mtext data-latex="\\text{x}">x</mtext>
               <mtext data-latex="\\text{]}">]</mtext>
             </mtd>
             <mtd>
               <mi data-latex="\\tag{x}">x</mi>
             </mtd>
           </mlabeledtr>
           <mlabeledtr>
             <mtd id="my-tag:A1">
               <mtext data-latex="\\text{[}">[</mtext>
               <mtext data-latex="\\text{A1}">A1</mtext>
               <mtext data-latex="\\text{]}">]</mtext>
             </mtd>
             <mtd>
               <mrow href="[[#my-tag%3Atest]]" class="MathJax_ref" data-latex="\\ref{test}">
                 <mtext>x</mtext>
               </mrow>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Eqref', () => {
    toXmlMatch(
      tex2mml('\\begin{align}x \\label{test}\\tag{x}\\\\ \\eqref{test} \\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}x \\label{test}\\tag{x}\\\\ \\eqref{test} \\end{align}" display="block">
         <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex="\\begin{align}x \\label{test}\\tag{x}\\\\ \\eqref{test} \\end{align}">
           <mlabeledtr>
             <mtd id="my-tag:test">
               <mtext data-latex="\\text{[}">[</mtext>
               <mtext data-latex="\\text{x}">x</mtext>
               <mtext data-latex="\\text{]}">]</mtext>
             </mtd>
             <mtd>
               <mi data-latex="\\tag{x}">x</mi>
             </mtd>
           </mlabeledtr>
           <mlabeledtr>
             <mtd id="my-tag:A1">
               <mtext data-latex="\\text{[}">[</mtext>
               <mtext data-latex="\\text{A1}">A1</mtext>
               <mtext data-latex="\\text{]}">]</mtext>
             </mtd>
             <mtd>
               <mrow href="[[#my-tag%3Atest]]" class="MathJax_ref" data-latex="\\eqref{test}">
                 <mtext>[x]</mtext>
               </mrow>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Custom ref', () => {
    setupTex(['base', 'ams', 'tagformat'], {
      tagformat: {
        ref: (tag: string) => `**${tag}**`
      },
      tags: 'ams'
    });
    toXmlMatch(
      tex2mml('\\begin{align}x \\label{test}\\tag{x}\\\\ \\eqref{test} \\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}x \\label{test}\\tag{x}\\\\ \\eqref{test} \\end{align}" display="block">
         <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex="\\begin{align}x \\label{test}\\tag{x}\\\\ \\eqref{test} \\end{align}">
           <mlabeledtr>
             <mtd id="mjx-eqn:test">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{x}">x</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mi data-latex="\\tag{x}">x</mi>
             </mtd>
           </mlabeledtr>
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mrow href="#mjx-eqn%3Atest" class="MathJax_ref" data-latex="\\eqref{test}">
                 <mtext>**x**</mtext>
               </mrow>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/
