import { afterAll, beforeEach, describe, test, expect } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml, expectTexError, trapErrors } from '#helpers';
import '#js/input/tex/mathtools/MathtoolsConfiguration';
import '#js/input/tex/ams/AmsConfiguration';
import '#js/input/tex/boldsymbol/BoldsymbolConfiguration';
import '#js/input/tex/bbox/BboxConfiguration';

import { Configuration } from '#js/input/tex/Configuration.js';
import { ConfigurationType } from '#js/input/tex/HandlerTypes.js';
import { AbstractTags } from '#js/input/tex/Tags.js';

beforeEach(() => setupTex(['base', 'ams', 'boldsymbol', 'mathtools']));

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools Spacing Control', () => {

  /********************************************************************************/

  test('mathllap', () => {
    toXmlMatch(
      tex2mml('\\mathord{=}\\mathllap{x}\\quad \\mathord{=}\\mathllap[\\scriptstyle]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathord{=}\\mathllap{x}\\quad \\mathord{=}\\mathllap[\\scriptstyle]{x}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathord{=}">
           <mo data-latex="=">=</mo>
         </mrow>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathllap{x}">
           <mstyle data-cramped="false">
             <mpadded width="0" lspace="-1width">
               <mi data-latex="x">x</mi>
             </mpadded>
           </mstyle>
         </mrow>
         <mspace width="1em" data-latex="\\quad"></mspace>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathord{=}">
           <mo data-latex="=">=</mo>
         </mrow>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathllap[\\scriptstyle]{x}">
           <mstyle data-cramped="false" displaystyle="false" scriptlevel="1">
             <mpadded width="0" lspace="-1width">
               <mi data-latex="x">x</mi>
             </mpadded>
           </mstyle>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathrlap', () => {
    toXmlMatch(
      tex2mml('\\mathrlap{x}\\mathord{=}\\quad \\mathrlap[\\scriptstyle]{x}\\mathord{=}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathrlap{x}\\mathord{=}\\quad \\mathrlap[\\scriptstyle]{x}\\mathord{=}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathrlap{x}">
           <mstyle data-cramped="false">
             <mpadded width="0">
               <mi data-latex="x">x</mi>
             </mpadded>
           </mstyle>
         </mrow>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathord{=}">
           <mo data-latex="=">=</mo>
         </mrow>
         <mspace width="1em" data-latex="\\quad"></mspace>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathrlap[\\scriptstyle]{x}">
           <mstyle data-cramped="false" displaystyle="false" scriptlevel="1">
             <mpadded width="0">
               <mi data-latex="x">x</mi>
             </mpadded>
           </mstyle>
         </mrow>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathord{=}">
           <mo data-latex="=">=</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathclap', () => {
    toXmlMatch(
      tex2mml('X = \\sum_{\\mathclap{1\\le i\\le j\\le n}} X_{ij}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X = \\sum_{\\mathclap{1\\le i\\le j\\le n}} X_{ij}" display="block">
         <mi data-latex="X">X</mi>
         <mo data-latex="=">=</mo>
         <munder data-latex="\\sum_{\\mathclap{1\\le i\\le j\\le n}}">
           <mo data-latex="\\sum">&#x2211;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{\\mathclap{1\\le i\\le j\\le n}}">
             <mrow data-mjx-texclass="ORD" data-latex="\\mathclap{1\\le i\\le j\\le n}">
               <mstyle data-cramped="false">
                 <mpadded width="0" lspace="-.5width">
                   <mn data-latex="1">1</mn>
                   <mo data-latex="\\le">&#x2264;</mo>
                   <mi data-latex="i">i</mi>
                   <mo data-latex="\\le">&#x2264;</mo>
                   <mi data-latex="j">j</mi>
                   <mo data-latex="\\le">&#x2264;</mo>
                   <mi data-latex="n">n</mi>
                 </mpadded>
               </mstyle>
             </mrow>
           </mrow>
         </munder>
         <msub data-latex="X_{i j}">
           <mi data-latex="X">X</mi>
           <mrow data-mjx-texclass="ORD" data-latex="{i j}">
             <mi data-latex="i">i</mi>
             <mi data-latex="j">j</mi>
           </mrow>
         </msub>
       </math>`
    );
  });

  /********************************************************************************/

  test('clap', () => {
    toXmlMatch(
      tex2mml('X = \\sum_{\\clap{long text under}} X_{ij}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="X = \\sum_{\\clap{long text under}} X_{ij}" display="block">
         <mi data-latex="X">X</mi>
         <mo data-latex="=">=</mo>
         <munder data-latex="\\sum_{\\clap{long text under}}">
           <mo data-latex="\\sum">&#x2211;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{\\clap{long text under}}">
             <mpadded width="0" lspace="-.5width" data-latex="\\clap{long text under}">
               <mstyle scriptlevel="0">
                 <mtext>long text under</mtext>
               </mstyle>
             </mpadded>
           </mrow>
         </munder>
         <msub data-latex="X_{i j}">
           <mi data-latex="X">X</mi>
           <mrow data-mjx-texclass="ORD" data-latex="{i j}">
             <mi data-latex="i">i</mi>
             <mi data-latex="j">j</mi>
           </mrow>
         </msub>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathmakebox', () => {
    toXmlMatch(
      tex2mml('\\mathmakebox[3em][l]{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathmakebox[3em][l]{x+y}" display="block">
         <mpadded width="3em" data-latex="\\mathmakebox[3em][l]{x+y}">
           <mi data-latex="x">x</mi>
           <mo data-latex="+">+</mo>
           <mi data-latex="y">y</mi>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathmakebox [r]', () => {
    toXmlMatch(
      tex2mml('\\mathmakebox[3em][r]{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathmakebox[3em][r]{x+y}" display="block">
         <mpadded width="3em" data-align="right" data-latex="\\mathmakebox[3em][r]{x+y}">
           <mi data-latex="x">x</mi>
           <mo data-latex="+">+</mo>
           <mi data-latex="y">y</mi>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathmakebox [R]', () => {
    toXmlMatch(
      tex2mml('\\mathmakebox[3em][R]{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathmakebox[3em][R]{x+y}" display="block">
         <mpadded width="3em" data-align="right" data-overflow="linebreak" data-latex="\\mathmakebox[3em][R]{x+y}">
           <mi data-latex="x">x</mi>
           <mo data-latex="+">+</mo>
           <mi data-latex="y">y</mi>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathmbox', () => {
    toXmlMatch(
      tex2mml('\\mathmbox{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathmbox{x+y}" display="block">
         <mrow data-latex="\\mathmbox{x+y}">
           <mi data-latex="x">x</mi>
           <mo data-latex="+">+</mo>
           <mi data-latex="y">y</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('textllap', () => {
    toXmlMatch(
      tex2mml('\\mathord{==}\\textllap{a b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathord{==}\\textllap{a b}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathord{==}">
           <mo data-mjx-texclass="REL" data-latex="==">==</mo>
         </mrow>
         <mpadded width="0" lspace="-1width" data-latex="\\textllap{a b}">
           <mstyle displaystyle="false">
             <mtext>a b</mtext>
           </mstyle>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  test('textrlap', () => {
    toXmlMatch(
      tex2mml('\\textrlap{a b}\\mathord{==}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textrlap{a b}\\mathord{==}" display="block">
         <mpadded width="0" data-latex="\\textrlap{a b}">
           <mstyle displaystyle="false">
             <mtext>a b</mtext>
           </mstyle>
         </mpadded>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathord{==}">
           <mo data-mjx-texclass="REL" data-latex="==">==</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('textclap', () => {
    toXmlMatch(
      tex2mml('ab\\sum_{\\textclap{long text}}cd'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="ab\\sum_{\\textclap{long text}}cd" display="block">
         <mi data-latex="a">a</mi>
         <mi data-latex="b">b</mi>
         <munder data-latex="\\sum_{\\textclap{long text}}">
           <mo data-latex="\\sum">&#x2211;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{\\textclap{long text}}">
             <mpadded width="0" lspace="-.5width" data-latex="\\textclap{long text}">
               <mstyle scriptlevel="0">
                 <mtext>long text</mtext>
               </mstyle>
             </mpadded>
           </mrow>
         </munder>
         <mi data-latex="c">c</mi>
         <mi data-latex="d">d</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('cramped', () => {
    toXmlMatch(
      tex2mml('x^2\\cramped{x^2}\\quad{\\scriptstyle x^2}\\cramped[\\scriptstyle]{x^2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x^2\\cramped{x^2}\\quad{\\scriptstyle x^2}\\cramped[\\scriptstyle]{x^2}" display="block">
         <msup data-latex="x^2">
           <mi data-latex="x">x</mi>
           <mn data-latex="2">2</mn>
         </msup>
         <mstyle data-cramped="true" data-latex="\\cramped{x^2}">
           <msup data-latex="x^2">
             <mi data-latex="x">x</mi>
             <mn data-latex="2">2</mn>
           </msup>
         </mstyle>
         <mspace width="1em" data-latex="\\quad"></mspace>
         <mrow data-mjx-texclass="ORD" data-latex="{}">
           <mstyle displaystyle="false" scriptlevel="1">
             <msup data-latex="x^2">
               <mi data-latex="x">x</mi>
               <mn data-latex="2">2</mn>
             </msup>
           </mstyle>
         </mrow>
         <mstyle data-cramped="true" displaystyle="false" scriptlevel="1" data-latex="\\cramped[\\scriptstyle]{x^2}">
           <msup data-latex="x^2">
             <mi data-latex="x">x</mi>
             <mn data-latex="2">2</mn>
           </msup>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('crampedllap', () => {
    toXmlMatch(
      tex2mml('\\mathord{==}\\crampedllap{x^2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathord{==}\\crampedllap{x^2}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathord{==}">
           <mo data-mjx-texclass="REL" data-latex="==">==</mo>
         </mrow>
         <mrow data-mjx-texclass="ORD" data-latex="\\crampedllap{x^2}">
           <mstyle data-cramped="true">
             <mpadded width="0" lspace="-1width">
               <msup data-latex="x^2">
                 <mi data-latex="x">x</mi>
                 <mn data-latex="2">2</mn>
               </msup>
             </mpadded>
           </mstyle>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('crampedrlap', () => {
    toXmlMatch(
      tex2mml('\\crampedrlap{x^2}\\mathord{==}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\crampedrlap{x^2}\\mathord{==}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\crampedrlap{x^2}">
           <mstyle data-cramped="true">
             <mpadded width="0">
               <msup data-latex="x^2">
                 <mi data-latex="x">x</mi>
                 <mn data-latex="2">2</mn>
               </msup>
             </mpadded>
           </mstyle>
         </mrow>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathord{==}">
           <mo data-mjx-texclass="REL" data-latex="==">==</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('crampedclap', () => {
    toXmlMatch(
      tex2mml('\\sum_{\\crampedclap{x^2}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sum_{\\crampedclap{x^2}}" display="block">
         <munder data-latex="\\sum_{\\crampedclap{x^2}}">
           <mo data-latex="\\sum">&#x2211;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{\\crampedclap{x^2}}">
             <mrow data-mjx-texclass="ORD" data-latex="\\crampedclap{x^2}">
               <mstyle data-cramped="true">
                 <mpadded width="0" lspace="-.5width">
                   <msup data-latex="x^2">
                     <mi data-latex="x">x</mi>
                     <mn data-latex="2">2</mn>
                   </msup>
                 </mpadded>
               </mstyle>
             </mrow>
           </mrow>
         </munder>
       </math>`
    );
  });

  /********************************************************************************/

  test('crampedsubstack', () => {
    toXmlMatch(
      tex2mml('\\sum_{\\crampedsubstack{x^2\\\\y^2}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sum_{\\crampedsubstack{x^2\\\\y^2}}" display="block">
         <munder data-latex="\\begin{crampedsubarray}{c}x^2 \\\\y^2 \\end{crampedsubarray}}">
           <mo data-latex="\\sum">&#x2211;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{{crampedsubarray}}">
             <mtable data-mjx-smallmatrix="true" columnspacing="0em" rowspacing="0.1em" data-cramped="true" data-latex="{crampedsubarray}">
               <mtr data-latex="{c}">
                 <mtd>
                   <msup data-latex="x^2">
                     <mi data-latex="x">x</mi>
                     <mn data-latex="2">2</mn>
                   </msup>
                 </mtd>
               </mtr>
               <mtr data-latex="{c}">
                 <mtd>
                   <msup data-latex="y^2">
                     <mi data-latex="y">y</mi>
                     <mn data-latex="2">2</mn>
                   </msup>
                 </mtd>
               </mtr>
             </mtable>
           </mrow>
         </munder>
       </math>`
    );
  });

  /********************************************************************************/

  test('adjustlimits', () => {
    toXmlMatch(
      tex2mml('\\adjustlimits\\lim_{n\\to\\infty} \\max_{p^2\\ge n}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\adjustlimits\\lim_{n\\to\\infty} \\max_{p^2\\ge n}" display="block">
         <munder data-latex="\\mathop{{\\lim}\\vphantom{{ \\max}}}_{{n\\to\\infty}\\vphantom{{p^2\\ge n}}}">
           <mrow data-mjx-texclass="OP" data-latex="\\mathop{{\\lim}\\vphantom{{ \\max}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\lim}">
               <mo data-mjx-texclass="OP" movablelimits="true" data-latex="\\lim">lim</mo>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{{ \\max}}">
               <mpadded width="0">
                 <mphantom>
                   <mrow data-mjx-texclass="ORD" data-latex="{ \\max}">
                     <mo data-mjx-texclass="OP" movablelimits="true" data-latex="\\max">max</mo>
                   </mrow>
                 </mphantom>
               </mpadded>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{{n\\to\\infty}\\vphantom{{p^2\\ge n}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{n\\to\\infty}">
               <mi data-latex="n">n</mi>
               <mo accent="false" stretchy="false" data-latex="\\to">&#x2192;</mo>
               <mi mathvariant="normal" data-latex="\\infty">&#x221E;</mi>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{{p^2\\ge n}}">
               <mpadded width="0">
                 <mphantom>
                   <mrow data-mjx-texclass="ORD" data-latex="{p^2 \\ge n}">
                     <msup data-latex="p^2">
                       <mi data-latex="p">p</mi>
                       <mn data-latex="2">2</mn>
                     </msup>
                     <mo data-latex="\\ge">&#x2265;</mo>
                     <mi data-latex="n">n</mi>
                   </mrow>
                 </mphantom>
               </mpadded>
             </mrow>
           </mrow>
         </munder>
         <mo data-mjx-texclass="NONE">&#x2061;</mo>
         <munder data-latex="\\mathop{{ \\max}\\vphantom{{\\lim}}}_{{p^2\\ge n}\\vphantom{{n\\to\\infty}}}">
           <mrow data-mjx-texclass="OP" data-latex="\\mathop{{ \\max}\\vphantom{{\\lim}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\max}">
               <mo data-mjx-texclass="OP" movablelimits="true" data-latex="\\max">max</mo>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{{\\lim}}">
               <mpadded width="0">
                 <mphantom>
                   <mrow data-mjx-texclass="ORD" data-latex="{\\lim}">
                     <mo data-mjx-texclass="OP" movablelimits="true" data-latex="\\lim">lim</mo>
                   </mrow>
                 </mphantom>
               </mpadded>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{{p^2\\ge n}\\vphantom{{n\\to\\infty}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{p^2\\ge n}">
               <msup data-latex="p^2">
                 <mi data-latex="p">p</mi>
                 <mn data-latex="2">2</mn>
               </msup>
               <mo data-latex="\\ge">&#x2265;</mo>
               <mi data-latex="n">n</mi>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{{n\\to\\infty}}">
               <mpadded width="0">
                 <mphantom>
                   <mrow data-mjx-texclass="ORD" data-latex="{n\\to\\infty}">
                     <mi data-latex="n">n</mi>
                     <mo accent="false" stretchy="false" data-latex="\\to">&#x2192;</mo>
                     <mi mathvariant="normal" data-latex="\\infty">&#x221E;</mi>
                   </mrow>
                 </mphantom>
               </mpadded>
             </mrow>
           </mrow>
         </munder>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools Tagging', () => {

  /********************************************************************************/

  test('newtagform', () => {
    toXmlMatch(
      tex2mml('\\newtagform{brackets}{[}{]}\\usetagform{brackets} E=mc^2\\tag{1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newtagform{brackets}{[}{]}\\usetagform{brackets} E=mc^2\\tag{1}" display="block">
         <mtable displaystyle="true" data-latex="\\newtagform{brackets}{[}{]}\\usetagform{brackets} E=mc^2 \\tag{1}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{[}">[</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{]}">]</mtext>
             </mtd>
             <mtd>
               <mi data-latex="E">E</mi>
               <mo data-latex="=">=</mo>
               <mi data-latex="m">m</mi>
               <msup data-latex="c^2">
                 <mi data-latex="c">c</mi>
                 <mn data-latex="2">2</mn>
               </msup>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('newtagform styled', () => {
    toXmlMatch(
      tex2mml('\\newtagform{bfbrackets}[\\textbf]{[}{]}\\usetagform{bfbrackets} E=mc^2\\tag{1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newtagform{bfbrackets}[\\textbf]{[}{]}\\usetagform{bfbrackets} E=mc^2\\tag{1}" display="block">
         <mtable displaystyle="true" data-latex="\\newtagform{bfbrackets}[\\textbf]{[}{]}\\usetagform{bfbrackets} E=mc^2 \\tag{1}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{[}">[</mtext>
               <mtext data-latex="\\text{\\textbf{1}}">\\textbf{1}</mtext>
               <mtext data-latex="\\text{]}">]</mtext>
             </mtd>
             <mtd>
               <mi data-latex="E">E</mi>
               <mo data-latex="=">=</mo>
               <mi data-latex="m">m</mi>
               <msup data-latex="c^2">
                 <mi data-latex="c">c</mi>
                 <mn data-latex="2">2</mn>
               </msup>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('newtagform duplicate', () => {
    expectTexError('\\newtagform{a}{(}{)}\\newtagform{a}{((}{))}')
      .toBe('Duplicate tag form: a');
  });

  /********************************************************************************/

  test('newtagform empty name', () => {
    expectTexError('\\newtagform{}{(}{)}')
      .toBe("Tag form name can't be empty");
  });

  /********************************************************************************/

  test('usetagform undefined name', () => {
    expectTexError('\\usetagform{error}')
      .toBe('Undefined tag form: error');
  });

  /********************************************************************************/

  test('renewtagform', () => {
    toXmlMatch(
      tex2mml('\\newtagform{a}{(}{)}\\renewtagform{a}{((}{))}\\usetagform{a} E=mc^2\\tag{1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newtagform{a}{(}{)}\\renewtagform{a}{((}{))}\\usetagform{a} E=mc^2\\tag{1}" display="block">
         <mtable displaystyle="true" data-latex="\\newtagform{a}{(}{)}\\renewtagform{a}{((}{))}\\usetagform{a} E=mc^2 \\tag{1}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{((}">((</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{))}">))</mtext>
             </mtd>
             <mtd>
               <mi data-latex="E">E</mi>
               <mo data-latex="=">=</mo>
               <mi data-latex="m">m</mi>
               <msup data-latex="c^2">
                 <mi data-latex="c">c</mi>
                 <mn data-latex="2">2</mn>
               </msup>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('refeq', () => {
    toXmlMatch(
      tex2mml('\\begin{align}E=mc^2\\label{test}\\tag*{\\textsf{A}}\\\\ \\refeq{test}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}E=mc^2\\label{test}\\tag*{\\textsf{A}}\\\\ \\refeq{test}\\end{align}" display="block">
         <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex="\\begin{align}E=mc^2 \\label{test}\\tag*{\\textsf{A}}\\\\ \\refeq{test}\\end{align}">
           <mlabeledtr>
             <mtd id="mjx-eqn:test">
               <mtext data-latex="\\text{\\textsf{A}}">\\textsf{A}</mtext>
             </mtd>
             <mtd>
               <mi data-latex="E">E</mi>
               <mo data-latex="=">=</mo>
               <mi data-latex="m">m</mi>
               <msup data-latex="c^2">
                 <mi data-latex="c">c</mi>
                 <mn data-latex="2">2</mn>
               </msup>
             </mtd>
           </mlabeledtr>
           <mtr>
             <mtd>
               <mrow href="#mjx-eqn%3Atest" class="MathJax_ref" data-latex="\\refeq{test}">
                 <mtext>\\textsf{A}</mtext>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Tags add', () => {
    setupTex(['base', 'ams', 'mathtools'], {tags: 'ams'});
    toXmlMatch(
      tex2mml('\\newtagform{bars}||\\usetagform{bars} x\\tag{1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\newtagform{bars}||\\usetagform{bars} x\\tag{1}" display="block">
         <mtable displaystyle="true" data-latex="\\newtagform{bars}||\\usetagform{bars} x\\tag{1}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{|}">|</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{|}">|</mtext>
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

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools Symbols', () => {

  /********************************************************************************/

  test('Delimiters', () => {
    toXmlMatch(
      tex2mml('\\left\\lparen X \\right\\rparen'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\left\\lparen X \\right\\rparen" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\left\\lparen X \\right\\rparen">
           <mo data-mjx-texclass="OPEN" data-latex="\\left\\lparen ">(</mo>
           <mi data-latex="X">X</mi>
           <mo data-mjx-texclass="CLOSE" data-latex="\\right\\rparen">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Other', () => {
    toXmlMatch(
      tex2mml('\\ndownarrow \\nuparrow \\bigtimes_n'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ndownarrow \\nuparrow \\bigtimes_n" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\ndownarrow">
           <mtext>&#x2193;</mtext>
           <mpadded width="0" lspace="-.5width">
             <mpadded width="0" lspace="-.5width" voffset=".25em">
               <menclose notation="updiagonalstrike" data-thickness=".05em" data-padding="0">
                 <mspace height=".2em" depth="0" width=".4em"></mspace>
               </menclose>
             </mpadded>
             <mphantom>
               <mtext>&#x2193;</mtext>
             </mphantom>
           </mpadded>
         </mrow>
         <mrow data-mjx-texclass="REL" data-latex="\\nuparrow">
           <mtext>&#x2191;</mtext>
           <mpadded width="0" lspace="-.5width">
             <mpadded width="0" lspace="-.5width" voffset=".06em">
               <menclose notation="updiagonalstrike" data-thickness=".05em" data-padding="0">
                 <mspace height=".2em" depth="0" width=".4em"></mspace>
               </menclose>
             </mpadded>
             <mphantom>
               <mtext>&#x2191;</mtext>
             </mphantom>
           </mpadded>
         </mrow>
         <munder data-latex="\\mathop{\\Large\\kern-.1em\\boldsymbol{\\times}\\kern-.1em}_n">
           <mrow data-mjx-texclass="OP" data-latex="\\mathop{\\Large\\kern-.1em\\boldsymbol{\\times}\\kern-.1em}">
             <mstyle mathsize="1.44em" data-latex="\\Large\\kern-.1em\\boldsymbol{\\times}\\kern-.1em">
               <mspace width="-.1em" linebreak="nobreak" data-latex="\\kern-.1em"></mspace>
               <mo data-latex="\\boldsymbol{\\times}" mathvariant="bold">&#xD7;</mo>
               <mspace width="-.1em" linebreak="nobreak" data-latex="\\kern-.1em"></mspace>
             </mstyle>
           </mrow>
           <mi data-latex="n">n</mi>
         </munder>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools stretchy', () => {

  /********************************************************************************/

  test('xleftrightarrow', () => {
    toXmlMatch(
      tex2mml('\\xleftrightarrow{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xleftrightarrow{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xleftrightarrow{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x2194;</mo>
             <mpadded width="+1.111em" lspace="0.556em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xLeftarrow', () => {
    toXmlMatch(
      tex2mml('\\xLeftarrow{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xLeftarrow{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xLeftarrow{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x21D0;</mo>
             <mpadded width="+1.056em" lspace="0.667em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xRightarrow', () => {
    toXmlMatch(
      tex2mml('\\xRightarrow{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xRightarrow{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xRightarrow{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x21D2;</mo>
             <mpadded width="+1.056em" lspace="0.389em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xLeftrightarrow', () => {
    toXmlMatch(
      tex2mml('\\xLeftrightarrow{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xLeftrightarrow{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xLeftrightarrow{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x21D4;</mo>
             <mpadded width="+1.333em" lspace="0.667em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xhookleftarrow', () => {
    toXmlMatch(
      tex2mml('\\xhookleftarrow{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xhookleftarrow{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xhookleftarrow{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x21A9;</mo>
             <mpadded width="+0.833em" lspace="0.556em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xhookrightarrow', () => {
    toXmlMatch(
      tex2mml('\\xhookrightarrow{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xhookrightarrow{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xhookrightarrow{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x21AA;</mo>
             <mpadded width="+0.833em" lspace="0.278em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xmapsto', () => {
    toXmlMatch(
      tex2mml('\\xmapsto{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xmapsto{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xmapsto{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x21A6;</mo>
             <mpadded width="+1.111em" lspace="0.556em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xrightharpoondown', () => {
    toXmlMatch(
      tex2mml('\\xrightharpoondown{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xrightharpoondown{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xrightharpoondown{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x21C1;</mo>
             <mpadded width="+0.833em" lspace="0.278em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xleftharpoondown', () => {
    toXmlMatch(
      tex2mml('\\xleftharpoondown{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xleftharpoondown{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xleftharpoondown{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x21BD;</mo>
             <mpadded width="+0.833em" lspace="0.556em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xrightleftharpoons', () => {
    toXmlMatch(
      tex2mml('\\xrightleftharpoons{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xrightleftharpoons{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xrightleftharpoons{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x21CC;</mo>
             <mpadded width="+1.111em" lspace="0.556em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xleftrightharpoons', () => {
    toXmlMatch(
      tex2mml('\\xleftrightharpoons{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xleftrightharpoons{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xleftrightharpoons{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x21CB;</mo>
             <mpadded width="+1.111em" lspace="0.556em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xrightharpoonup', () => {
    toXmlMatch(
      tex2mml('\\xrightharpoonup{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xrightharpoonup{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xrightharpoonup{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x21C0;</mo>
             <mpadded width="+0.833em" lspace="0.278em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xleftharpoonup', () => {
    toXmlMatch(
      tex2mml('\\xleftharpoonup{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xleftharpoonup{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xleftharpoonup{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD">&#x21BC;</mo>
             <mpadded width="+0.833em" lspace="0.556em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xlongleftarrow', () => {
    toXmlMatch(
      tex2mml('\\xlongleftarrow{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xlongleftarrow{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xlongleftarrow{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD" minsize="1.45em">&#x27F5;</mo>
             <mpadded width="+1.056em" lspace="0.667em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xLongleftarrow', () => {
    toXmlMatch(
      tex2mml('\\xLongleftarrow{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xLongleftarrow{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xLongleftarrow{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD" minsize="1.45em">&#x27F8;</mo>
             <mpadded width="+1.056em" lspace="0.667em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xlongrightarrow', () => {
    toXmlMatch(
      tex2mml('\\xlongrightarrow{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xlongrightarrow{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xlongrightarrow{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD" minsize="1.45em">&#x27F6;</mo>
             <mpadded width="+1.056em" lspace="0.389em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xLongrightarrow', () => {
    toXmlMatch(
      tex2mml('\\xLongrightarrow{x+y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xLongrightarrow{x+y}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\xLongrightarrow{x+y}">
           <mrow data-mjx-texclass="NONE"></mrow>
           <mover>
             <mo data-mjx-texclass="ORD" minsize="1.45em">&#x27F9;</mo>
             <mpadded width="+1.056em" lspace="0.389em" voffset="-.2em" height="-.2em">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mspace depth=".2em"></mspace>
             </mpadded>
           </mover>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('underbracket', () => {
    toXmlMatch(
      tex2mml('\\underbracket{x+y+z}_{\\text{$n$ times}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\underbracket{x+y+z}_{\\text{$n$ times}}" display="block">
         <munder data-latex="\\underbracket{x+y+z}_{\\text{$n$ times}}">
           <mrow data-mjx-texclass="OP" data-latex="\\underbracket{x+y+z}">
             <mstyle accentunder="true">
               <munder>
                 <mrow data-latex="x+y+z">
                   <mi data-latex="x">x</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="y">y</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="z">z</mi>
                 </mrow>
                 <mpadded style="border: 0.1em solid; border-top: none" height=".2em" depth="0">
                   <mphantom>
                     <mi data-latex="x">x</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="y">y</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="z">z</mi>
                   </mphantom>
                 </mpadded>
               </munder>
             </mstyle>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{$n$ times}}">
             <mrow data-latex="\\text{$n$ times}">
               <mrow data-mjx-texclass="ORD">
                 <mi data-latex="n">n</mi>
               </mrow>
               <mtext>&#xA0;times</mtext>
             </mrow>
           </mrow>
         </munder>
       </math>`
    );
  });

  /********************************************************************************/

  test('underbracket thickness', () => {
    toXmlMatch(
      tex2mml('\\underbracket[3px]{x+y+z}_{\\text{$n$ times}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\underbracket[3px]{x+y+z}_{\\text{$n$ times}}" display="block">
         <munder data-latex="\\underbracket[3px]{x+y+z}_{\\text{$n$ times}}">
           <mrow data-mjx-texclass="OP" data-latex="\\underbracket[3px]{x+y+z}">
             <mstyle accentunder="true">
               <munder>
                 <mrow data-latex="x+y+z">
                   <mi data-latex="x">x</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="y">y</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="z">z</mi>
                 </mrow>
                 <mpadded style="border: 0.188em solid; border-top: none" height=".2em" depth="0">
                   <mphantom>
                     <mi data-latex="x">x</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="y">y</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="z">z</mi>
                   </mphantom>
                 </mpadded>
               </munder>
             </mstyle>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{$n$ times}}">
             <mrow data-latex="\\text{$n$ times}">
               <mrow data-mjx-texclass="ORD">
                 <mi data-latex="n">n</mi>
               </mrow>
               <mtext>&#xA0;times</mtext>
             </mrow>
           </mrow>
         </munder>
       </math>`
    );
  });

  /********************************************************************************/

  test('underbracket height', () => {
    toXmlMatch(
      tex2mml('\\underbracket[][10px]{x+y+z}_{\\text{$n$ times}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\underbracket[][10px]{x+y+z}_{\\text{$n$ times}}" display="block">
         <munder data-latex="\\underbracket[][10px]{x+y+z}_{\\text{$n$ times}}">
           <mrow data-mjx-texclass="OP" data-latex="\\underbracket[][10px]{x+y+z}">
             <mstyle accentunder="true">
               <munder>
                 <mrow data-latex="x+y+z">
                   <mi data-latex="x">x</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="y">y</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="z">z</mi>
                 </mrow>
                 <mpadded style="border: 0.1em solid; border-top: none" height="10px" depth="0">
                   <mphantom>
                     <mi data-latex="x">x</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="y">y</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="z">z</mi>
                   </mphantom>
                 </mpadded>
               </munder>
             </mstyle>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{$n$ times}}">
             <mrow data-latex="\\text{$n$ times}">
               <mrow data-mjx-texclass="ORD">
                 <mi data-latex="n">n</mi>
               </mrow>
               <mtext>&#xA0;times</mtext>
             </mrow>
           </mrow>
         </munder>
       </math>`
    );
  });

  /********************************************************************************/

  test('underbracket thickness height', () => {
    toXmlMatch(
      tex2mml('\\underbracket[3px][10px]{x+y+z}_{\\text{$n$ times}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\underbracket[3px][10px]{x+y+z}_{\\text{$n$ times}}" display="block">
         <munder data-latex="\\underbracket[3px][10px]{x+y+z}_{\\text{$n$ times}}">
           <mrow data-mjx-texclass="OP" data-latex="\\underbracket[3px][10px]{x+y+z}">
             <mstyle accentunder="true">
               <munder>
                 <mrow data-latex="x+y+z">
                   <mi data-latex="x">x</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="y">y</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="z">z</mi>
                 </mrow>
                 <mpadded style="border: 0.188em solid; border-top: none" height="10px" depth="0">
                   <mphantom>
                     <mi data-latex="x">x</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="y">y</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="z">z</mi>
                   </mphantom>
                 </mpadded>
               </munder>
             </mstyle>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{$n$ times}}">
             <mrow data-latex="\\text{$n$ times}">
               <mrow data-mjx-texclass="ORD">
                 <mi data-latex="n">n</mi>
               </mrow>
               <mtext>&#xA0;times</mtext>
             </mrow>
           </mrow>
         </munder>
       </math>`
    );
  });

  /********************************************************************************/

  test('overbracket', () => {
    toXmlMatch(
      tex2mml('\\overbracket{x+y+z}^{\\text{$n$ times}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overbracket{x+y+z}^{\\text{$n$ times}}" display="block">
         <mover data-latex="\\overbracket{x+y+z}^{\\text{$n$ times}}">
           <mrow data-mjx-texclass="OP" data-latex="\\overbracket{x+y+z}">
             <mstyle accent="true">
               <mover>
                 <mrow data-latex="x+y+z">
                   <mi data-latex="x">x</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="y">y</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="z">z</mi>
                 </mrow>
                 <mpadded style="border: 0.1em solid; border-bottom: none" height=".2em" depth="0">
                   <mphantom>
                     <mi data-latex="x">x</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="y">y</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="z">z</mi>
                   </mphantom>
                 </mpadded>
               </mover>
             </mstyle>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{$n$ times}}">
             <mrow data-latex="\\text{$n$ times}">
               <mrow data-mjx-texclass="ORD">
                 <mi data-latex="n">n</mi>
               </mrow>
               <mtext>&#xA0;times</mtext>
             </mrow>
           </mrow>
         </mover>
       </math>`
    );
  });

  /********************************************************************************/

  test('overbracket thickness', () => {
    toXmlMatch(
      tex2mml('\\overbracket[3px]{x+y+z}^{\\text{$n$ times}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overbracket[3px]{x+y+z}^{\\text{$n$ times}}" display="block">
         <mover data-latex="\\overbracket[3px]{x+y+z}^{\\text{$n$ times}}">
           <mrow data-mjx-texclass="OP" data-latex="\\overbracket[3px]{x+y+z}">
             <mstyle accent="true">
               <mover>
                 <mrow data-latex="x+y+z">
                   <mi data-latex="x">x</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="y">y</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="z">z</mi>
                 </mrow>
                 <mpadded style="border: 0.188em solid; border-bottom: none" height=".2em" depth="0">
                   <mphantom>
                     <mi data-latex="x">x</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="y">y</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="z">z</mi>
                   </mphantom>
                 </mpadded>
               </mover>
             </mstyle>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{$n$ times}}">
             <mrow data-latex="\\text{$n$ times}">
               <mrow data-mjx-texclass="ORD">
                 <mi data-latex="n">n</mi>
               </mrow>
               <mtext>&#xA0;times</mtext>
             </mrow>
           </mrow>
         </mover>
       </math>`
    );
  });

  /********************************************************************************/

  test('overbracket height', () => {
    toXmlMatch(
      tex2mml('\\overbracket[][10px]{x+y+z}^{\\text{$n$ times}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overbracket[][10px]{x+y+z}^{\\text{$n$ times}}" display="block">
         <mover data-latex="\\overbracket[][10px]{x+y+z}^{\\text{$n$ times}}">
           <mrow data-mjx-texclass="OP" data-latex="\\overbracket[][10px]{x+y+z}">
             <mstyle accent="true">
               <mover>
                 <mrow data-latex="x+y+z">
                   <mi data-latex="x">x</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="y">y</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="z">z</mi>
                 </mrow>
                 <mpadded style="border: 0.1em solid; border-bottom: none" height="10px" depth="0">
                   <mphantom>
                     <mi data-latex="x">x</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="y">y</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="z">z</mi>
                   </mphantom>
                 </mpadded>
               </mover>
             </mstyle>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{$n$ times}}">
             <mrow data-latex="\\text{$n$ times}">
               <mrow data-mjx-texclass="ORD">
                 <mi data-latex="n">n</mi>
               </mrow>
               <mtext>&#xA0;times</mtext>
             </mrow>
           </mrow>
         </mover>
       </math>`
    );
  });

  /********************************************************************************/

  test('overbracket thickness height', () => {
    toXmlMatch(
      tex2mml('\\overbracket[3px][10px]{x+y+z}^{\\text{$n$ times}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\overbracket[3px][10px]{x+y+z}^{\\text{$n$ times}}" display="block">
         <mover data-latex="\\overbracket[3px][10px]{x+y+z}^{\\text{$n$ times}}">
           <mrow data-mjx-texclass="OP" data-latex="\\overbracket[3px][10px]{x+y+z}">
             <mstyle accent="true">
               <mover>
                 <mrow data-latex="x+y+z">
                   <mi data-latex="x">x</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="y">y</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="z">z</mi>
                 </mrow>
                 <mpadded style="border: 0.188em solid; border-bottom: none" height="10px" depth="0">
                   <mphantom>
                     <mi data-latex="x">x</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="y">y</mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="z">z</mi>
                   </mphantom>
                 </mpadded>
               </mover>
             </mstyle>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{$n$ times}}">
             <mrow data-latex="\\text{$n$ times}">
               <mrow data-mjx-texclass="ORD">
                 <mi data-latex="n">n</mi>
               </mrow>
               <mtext>&#xA0;times</mtext>
             </mrow>
           </mrow>
         </mover>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools Matrix Environments', () => {

  /********************************************************************************/

  test('matrix*', () => {
    toXmlMatch(
      tex2mml('\\begin{matrix*} -1 & 3 \\\\ 2 & -4 \\end{matrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{matrix*} -1 &amp; 3 \\\\ 2 &amp; -4 \\end{matrix*}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" data-latex="\\begin{matrix*} -1 &amp; 3 \\\\ 2 &amp; -4 \\end{matrix*}">
           <mtr data-latex=" ">
             <mtd>
               <mo data-latex="-">&#x2212;</mo>
               <mn data-latex="1">1</mn>
             </mtd>
             <mtd>
               <mn data-latex="3">3</mn>
             </mtd>
           </mtr>
           <mtr data-latex=" ">
             <mtd>
               <mn data-latex="2">2</mn>
             </mtd>
             <mtd>
               <mo data-latex="-">&#x2212;</mo>
               <mn data-latex="4">4</mn>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('matrix*[l]', () => {
    toXmlMatch(
      tex2mml('\\begin{matrix*}[l] -1 & 3 \\\\ 2 & -4 \\end{matrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{matrix*}[l] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{matrix*}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="left" data-latex="\\begin{matrix*}[l] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{matrix*}">
           <mtr data-latex="[l]">
             <mtd>
               <mo data-latex="-">&#x2212;</mo>
               <mn data-latex="1">1</mn>
             </mtd>
             <mtd>
               <mn data-latex="3">3</mn>
             </mtd>
           </mtr>
           <mtr data-latex="[l]">
             <mtd>
               <mn data-latex="2">2</mn>
             </mtd>
             <mtd>
               <mo data-latex="-">&#x2212;</mo>
               <mn data-latex="4">4</mn>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('matrix*[c]', () => {
    toXmlMatch(
      tex2mml('\\begin{matrix*}[c] -1 & 3 \\\\ 2 & -4 \\end{matrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{matrix*}[c] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{matrix*}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" data-latex="\\begin{matrix*}[c] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{matrix*}">
           <mtr data-latex="[c]">
             <mtd>
               <mo data-latex="-">&#x2212;</mo>
               <mn data-latex="1">1</mn>
             </mtd>
             <mtd>
               <mn data-latex="3">3</mn>
             </mtd>
           </mtr>
           <mtr data-latex="[c]">
             <mtd>
               <mn data-latex="2">2</mn>
             </mtd>
             <mtd>
               <mo data-latex="-">&#x2212;</mo>
               <mn data-latex="4">4</mn>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('matrix*[r]', () => {
    toXmlMatch(
      tex2mml('\\begin{matrix*}[r] -1 & 3 \\\\ 2 & -4 \\end{matrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{matrix*}[r] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{matrix*}" display="block">
         <mtable columnspacing="1em" rowspacing="4pt" columnalign="right" data-latex="\\begin{matrix*}[r] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{matrix*}">
           <mtr data-latex="[r]">
             <mtd>
               <mo data-latex="-">&#x2212;</mo>
               <mn data-latex="1">1</mn>
             </mtd>
             <mtd>
               <mn data-latex="3">3</mn>
             </mtd>
           </mtr>
           <mtr data-latex="[r]">
             <mtd>
               <mn data-latex="2">2</mn>
             </mtd>
             <mtd>
               <mo data-latex="-">&#x2212;</mo>
               <mn data-latex="4">4</mn>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('pmatrix*', () => {
    toXmlMatch(
      tex2mml('\\begin{pmatrix*} -1 & 3 \\\\ 2 & -4 \\end{pmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{pmatrix*} -1 &amp; 3 \\\\ 2 &amp; -4 \\end{pmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{pmatrix*} -1 &amp; 3 \\\\ 2 &amp; -4 \\end{pmatrix*}">
           <mo data-mjx-texclass="OPEN">(</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
             <mtr data-latex=" ">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex=" ">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('pmatrix*[l]', () => {
    toXmlMatch(
      tex2mml('\\begin{pmatrix*}[l] -1 & 3 \\\\ 2 & -4 \\end{pmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{pmatrix*}[l] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{pmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{pmatrix*}[l] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{pmatrix*}">
           <mo data-mjx-texclass="OPEN">(</mo>
           <mtable columnspacing="1em" rowspacing="4pt" columnalign="left">
             <mtr data-latex="[l]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[l]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('pmatrix*[c]', () => {
    toXmlMatch(
      tex2mml('\\begin{pmatrix*}[c] -1 & 3 \\\\ 2 & -4 \\end{pmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{pmatrix*}[c] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{pmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{pmatrix*}[c] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{pmatrix*}">
           <mo data-mjx-texclass="OPEN">(</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
             <mtr data-latex="[c]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[c]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('pmatrix*[r]', () => {
    toXmlMatch(
      tex2mml('\\begin{pmatrix*}[r] -1 & 3 \\\\ 2 & -4 \\end{pmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{pmatrix*}[r] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{pmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{pmatrix*}[r] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{pmatrix*}">
           <mo data-mjx-texclass="OPEN">(</mo>
           <mtable columnspacing="1em" rowspacing="4pt" columnalign="right">
             <mtr data-latex="[r]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[r]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('bmatrix*', () => {
    toXmlMatch(
      tex2mml('\\begin{bmatrix*} -1 & 3 \\\\ 2 & -4 \\end{bmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{bmatrix*} -1 &amp; 3 \\\\ 2 &amp; -4 \\end{bmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{bmatrix*} -1 &amp; 3 \\\\ 2 &amp; -4 \\end{bmatrix*}">
           <mo data-mjx-texclass="OPEN">[</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
             <mtr data-latex=" ">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex=" ">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">]</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('bmatrix*[l]', () => {
    toXmlMatch(
      tex2mml('\\begin{bmatrix*}[l] -1 & 3 \\\\ 2 & -4 \\end{bmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{bmatrix*}[l] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{bmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{bmatrix*}[l] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{bmatrix*}">
           <mo data-mjx-texclass="OPEN">[</mo>
           <mtable columnspacing="1em" rowspacing="4pt" columnalign="left">
             <mtr data-latex="[l]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[l]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">]</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('bmatrix*[c]', () => {
    toXmlMatch(
      tex2mml('\\begin{bmatrix*}[c] -1 & 3 \\\\ 2 & -4 \\end{bmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{bmatrix*}[c] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{bmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{bmatrix*}[c] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{bmatrix*}">
           <mo data-mjx-texclass="OPEN">[</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
             <mtr data-latex="[c]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[c]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">]</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('bmatrix*[r]', () => {
    toXmlMatch(
      tex2mml('\\begin{bmatrix*}[r] -1 & 3 \\\\ 2 & -4 \\end{bmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{bmatrix*}[r] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{bmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{bmatrix*}[r] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{bmatrix*}">
           <mo data-mjx-texclass="OPEN">[</mo>
           <mtable columnspacing="1em" rowspacing="4pt" columnalign="right">
             <mtr data-latex="[r]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[r]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">]</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Bmatrix*', () => {
    toXmlMatch(
      tex2mml('\\begin{Bmatrix*} -1 & 3 \\\\ 2 & -4 \\end{Bmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Bmatrix*} -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Bmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Bmatrix*} -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Bmatrix*}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
             <mtr data-latex=" ">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex=" ">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Bmatrix*[l]', () => {
    toXmlMatch(
      tex2mml('\\begin{Bmatrix*}[l] -1 & 3 \\\\ 2 & -4 \\end{Bmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Bmatrix*}[l] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Bmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Bmatrix*}[l] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Bmatrix*}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mtable columnspacing="1em" rowspacing="4pt" columnalign="left">
             <mtr data-latex="[l]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[l]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Bmatrix*[c]', () => {
    toXmlMatch(
      tex2mml('\\begin{Bmatrix*}[c] -1 & 3 \\\\ 2 & -4 \\end{Bmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Bmatrix*}[c] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Bmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Bmatrix*}[c] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Bmatrix*}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
             <mtr data-latex="[c]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[c]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Bmatrix*[r]', () => {
    toXmlMatch(
      tex2mml('\\begin{Bmatrix*}[r] -1 & 3 \\\\ 2 & -4 \\end{Bmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Bmatrix*}[r] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Bmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Bmatrix*}[r] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Bmatrix*}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mtable columnspacing="1em" rowspacing="4pt" columnalign="right">
             <mtr data-latex="[r]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[r]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('vmatrix*', () => {
    toXmlMatch(
      tex2mml('\\begin{vmatrix*} -1 & 3 \\\\ 2 & -4 \\end{vmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{vmatrix*} -1 &amp; 3 \\\\ 2 &amp; -4 \\end{vmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{vmatrix*} -1 &amp; 3 \\\\ 2 &amp; -4 \\end{vmatrix*}">
           <mo data-mjx-texclass="OPEN">|</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
             <mtr data-latex=" ">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex=" ">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('vmatrix*[l]', () => {
    toXmlMatch(
      tex2mml('\\begin{vmatrix*}[l] -1 & 3 \\\\ 2 & -4 \\end{vmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{vmatrix*}[l] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{vmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{vmatrix*}[l] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{vmatrix*}">
           <mo data-mjx-texclass="OPEN">|</mo>
           <mtable columnspacing="1em" rowspacing="4pt" columnalign="left">
             <mtr data-latex="[l]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[l]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('vmatrix*[c]', () => {
    toXmlMatch(
      tex2mml('\\begin{vmatrix*}[c] -1 & 3 \\\\ 2 & -4 \\end{vmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{vmatrix*}[c] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{vmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{vmatrix*}[c] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{vmatrix*}">
           <mo data-mjx-texclass="OPEN">|</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
             <mtr data-latex="[c]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[c]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('vmatrix*[r]', () => {
    toXmlMatch(
      tex2mml('\\begin{vmatrix*}[r] -1 & 3 \\\\ 2 & -4 \\end{vmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{vmatrix*}[r] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{vmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{vmatrix*}[r] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{vmatrix*}">
           <mo data-mjx-texclass="OPEN">|</mo>
           <mtable columnspacing="1em" rowspacing="4pt" columnalign="right">
             <mtr data-latex="[r]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[r]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Vmatrix*', () => {
    toXmlMatch(
      tex2mml('\\begin{Vmatrix*} -1 & 3 \\\\ 2 & -4 \\end{Vmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Vmatrix*} -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Vmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Vmatrix*} -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Vmatrix*}">
           <mo data-mjx-texclass="OPEN">&#x2016;</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
             <mtr data-latex=" ">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex=" ">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Vmatrix*[l]', () => {
    toXmlMatch(
      tex2mml('\\begin{Vmatrix*}[l] -1 & 3 \\\\ 2 & -4 \\end{Vmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Vmatrix*}[l] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Vmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Vmatrix*}[l] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Vmatrix*}">
           <mo data-mjx-texclass="OPEN">&#x2016;</mo>
           <mtable columnspacing="1em" rowspacing="4pt" columnalign="left">
             <mtr data-latex="[l]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[l]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Vmatrix*[c]', () => {
    toXmlMatch(
      tex2mml('\\begin{Vmatrix*}[c] -1 & 3 \\\\ 2 & -4 \\end{Vmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Vmatrix*}[c] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Vmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Vmatrix*}[c] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Vmatrix*}">
           <mo data-mjx-texclass="OPEN">&#x2016;</mo>
           <mtable columnspacing="1em" rowspacing="4pt">
             <mtr data-latex="[c]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[c]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Vmatrix*[r]', () => {
    toXmlMatch(
      tex2mml('\\begin{Vmatrix*}[r] -1 & 3 \\\\ 2 & -4 \\end{Vmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Vmatrix*}[r] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Vmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Vmatrix*}[r] -1 &amp; 3 \\\\ 2 &amp; -4 \\end{Vmatrix*}">
           <mo data-mjx-texclass="OPEN">&#x2016;</mo>
           <mtable columnspacing="1em" rowspacing="4pt" columnalign="right">
             <mtr data-latex="[r]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mn data-latex="3">3</mn>
               </mtd>
             </mtr>
             <mtr data-latex="[r]">
               <mtd>
                 <mn data-latex="2">2</mn>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="4">4</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools Small Matrix Environments', () => {

  /********************************************************************************/

  test('smallmatrix*', () => {
    toXmlMatch(
      tex2mml('\\begin{smallmatrix*} -a & b \\\\ c & -d \\end{smallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{smallmatrix*} -a &amp; b \\\\ c &amp; -d \\end{smallmatrix*}" display="block">
         <mstyle scriptlevel="1" data-latex="\\begin{smallmatrix*} -a &amp; b \\\\ c &amp; -d \\end{smallmatrix*}">
           <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
             <mtr data-latex=" ">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mi data-latex="a">a</mi>
               </mtd>
               <mtd>
                 <mi data-latex="b">b</mi>
               </mtd>
             </mtr>
             <mtr data-latex=" ">
               <mtd>
                 <mi data-latex="c">c</mi>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mi data-latex="d">d</mi>
               </mtd>
             </mtr>
           </mtable>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('smallmatrix*[l]', () => {
    toXmlMatch(
      tex2mml('\\begin{smallmatrix*}[l] -a & b \\\\ c & -d \\end{smallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{smallmatrix*}[l] -a &amp; b \\\\ c &amp; -d \\end{smallmatrix*}" display="block">
         <mstyle scriptlevel="1" data-latex="\\begin{smallmatrix*}[l] -a &amp; b \\\\ c &amp; -d \\end{smallmatrix*}">
           <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="left">
             <mtr data-latex="[l]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mi data-latex="a">a</mi>
               </mtd>
               <mtd>
                 <mi data-latex="b">b</mi>
               </mtd>
             </mtr>
             <mtr data-latex="[l]">
               <mtd>
                 <mi data-latex="c">c</mi>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mi data-latex="d">d</mi>
               </mtd>
             </mtr>
           </mtable>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('smallmatrix*[c]', () => {
    toXmlMatch(
      tex2mml('\\begin{smallmatrix*}[c] -a & b \\\\ c & -d \\end{smallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{smallmatrix*}[c] -a &amp; b \\\\ c &amp; -d \\end{smallmatrix*}" display="block">
         <mstyle scriptlevel="1" data-latex="\\begin{smallmatrix*}[c] -a &amp; b \\\\ c &amp; -d \\end{smallmatrix*}">
           <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
             <mtr data-latex="[c]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mi data-latex="a">a</mi>
               </mtd>
               <mtd>
                 <mi data-latex="b">b</mi>
               </mtd>
             </mtr>
             <mtr data-latex="[c]">
               <mtd>
                 <mi data-latex="c">c</mi>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mi data-latex="d">d</mi>
               </mtd>
             </mtr>
           </mtable>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('smallmatrix*[r]', () => {
    toXmlMatch(
      tex2mml('\\begin{smallmatrix*}[r] -a & b \\\\ c & -d \\end{smallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{smallmatrix*}[r] -a &amp; b \\\\ c &amp; -d \\end{smallmatrix*}" display="block">
         <mstyle scriptlevel="1" data-latex="\\begin{smallmatrix*}[r] -a &amp; b \\\\ c &amp; -d \\end{smallmatrix*}">
           <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="right">
             <mtr data-latex="[r]">
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mi data-latex="a">a</mi>
               </mtd>
               <mtd>
                 <mi data-latex="b">b</mi>
               </mtd>
             </mtr>
             <mtr data-latex="[r]">
               <mtd>
                 <mi data-latex="c">c</mi>
               </mtd>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mi data-latex="d">d</mi>
               </mtd>
             </mtr>
           </mtable>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('psmallmatrix*', () => {
    toXmlMatch(
      tex2mml('\\begin{psmallmatrix*} -a & b \\\\ c & -d \\end{psmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{psmallmatrix*} -a &amp; b \\\\ c &amp; -d \\end{psmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{psmallmatrix*} -a &amp; b \\\\ c &amp; -d \\end{psmallmatrix*}">
           <mo data-mjx-texclass="OPEN">(</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr data-latex=" ">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex=" ">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('psmallmatrix*[l]', () => {
    toXmlMatch(
      tex2mml('\\begin{psmallmatrix*}[l] -a & b \\\\ c & -d \\end{psmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{psmallmatrix*}[l] -a &amp; b \\\\ c &amp; -d \\end{psmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{psmallmatrix*}[l] -a &amp; b \\\\ c &amp; -d \\end{psmallmatrix*}">
           <mo data-mjx-texclass="OPEN">(</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="left">
               <mtr data-latex="[l]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[l]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('psmallmatrix*[c]', () => {
    toXmlMatch(
      tex2mml('\\begin{psmallmatrix*}[c] -a & b \\\\ c & -d \\end{psmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{psmallmatrix*}[c] -a &amp; b \\\\ c &amp; -d \\end{psmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{psmallmatrix*}[c] -a &amp; b \\\\ c &amp; -d \\end{psmallmatrix*}">
           <mo data-mjx-texclass="OPEN">(</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr data-latex="[c]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[c]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('psmallmatrix*[r]', () => {
    toXmlMatch(
      tex2mml('\\begin{psmallmatrix*}[r] -a & b \\\\ c & -d \\end{psmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{psmallmatrix*}[r] -a &amp; b \\\\ c &amp; -d \\end{psmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{psmallmatrix*}[r] -a &amp; b \\\\ c &amp; -d \\end{psmallmatrix*}">
           <mo data-mjx-texclass="OPEN">(</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="right">
               <mtr data-latex="[r]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[r]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('bsmallmatrix*', () => {
    toXmlMatch(
      tex2mml('\\begin{bsmallmatrix*} -a & b \\\\ c & -d \\end{bsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{bsmallmatrix*} -a &amp; b \\\\ c &amp; -d \\end{bsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{bsmallmatrix*} -a &amp; b \\\\ c &amp; -d \\end{bsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">[</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr data-latex=" ">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex=" ">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">]</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('bsmallmatrix*[l]', () => {
    toXmlMatch(
      tex2mml('\\begin{bsmallmatrix*}[l] -a & b \\\\ c & -d \\end{bsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{bsmallmatrix*}[l] -a &amp; b \\\\ c &amp; -d \\end{bsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{bsmallmatrix*}[l] -a &amp; b \\\\ c &amp; -d \\end{bsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">[</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="left">
               <mtr data-latex="[l]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[l]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">]</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('bsmallmatrix*[c]', () => {
    toXmlMatch(
      tex2mml('\\begin{bsmallmatrix*}[c] -a & b \\\\ c & -d \\end{bsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{bsmallmatrix*}[c] -a &amp; b \\\\ c &amp; -d \\end{bsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{bsmallmatrix*}[c] -a &amp; b \\\\ c &amp; -d \\end{bsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">[</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr data-latex="[c]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[c]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">]</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('bsmallmatrix*[r]', () => {
    toXmlMatch(
      tex2mml('\\begin{bsmallmatrix*}[r] -a & b \\\\ c & -d \\end{bsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{bsmallmatrix*}[r] -a &amp; b \\\\ c &amp; -d \\end{bsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{bsmallmatrix*}[r] -a &amp; b \\\\ c &amp; -d \\end{bsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">[</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="right">
               <mtr data-latex="[r]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[r]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">]</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Bsmallmatrix*', () => {
    toXmlMatch(
      tex2mml('\\begin{Bsmallmatrix*} -a & b \\\\ c & -d \\end{Bsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Bsmallmatrix*} -a &amp; b \\\\ c &amp; -d \\end{Bsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Bsmallmatrix*} -a &amp; b \\\\ c &amp; -d \\end{Bsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr data-latex=" ">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex=" ">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Bsmallmatrix*[l]', () => {
    toXmlMatch(
      tex2mml('\\begin{Bsmallmatrix*}[l] -a & b \\\\ c & -d \\end{Bsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Bsmallmatrix*}[l] -a &amp; b \\\\ c &amp; -d \\end{Bsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Bsmallmatrix*}[l] -a &amp; b \\\\ c &amp; -d \\end{Bsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="left">
               <mtr data-latex="[l]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[l]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Bsmallmatrix*[c]', () => {
    toXmlMatch(
      tex2mml('\\begin{Bsmallmatrix*}[c] -a & b \\\\ c & -d \\end{Bsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Bsmallmatrix*}[c] -a &amp; b \\\\ c &amp; -d \\end{Bsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Bsmallmatrix*}[c] -a &amp; b \\\\ c &amp; -d \\end{Bsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr data-latex="[c]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[c]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Bsmallmatrix*[r]', () => {
    toXmlMatch(
      tex2mml('\\begin{Bsmallmatrix*}[r] -a & b \\\\ c & -d \\end{Bsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Bsmallmatrix*}[r] -a &amp; b \\\\ c &amp; -d \\end{Bsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Bsmallmatrix*}[r] -a &amp; b \\\\ c &amp; -d \\end{Bsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="right">
               <mtr data-latex="[r]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[r]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('vsmallmatrix*', () => {
    toXmlMatch(
      tex2mml('\\begin{vsmallmatrix*} -a & b \\\\ c & -d \\end{vsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{vsmallmatrix*} -a &amp; b \\\\ c &amp; -d \\end{vsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{vsmallmatrix*} -a &amp; b \\\\ c &amp; -d \\end{vsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">|</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr data-latex=" ">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex=" ">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('vsmallmatrix*[l]', () => {
    toXmlMatch(
      tex2mml('\\begin{vsmallmatrix*}[l] -a & b \\\\ c & -d \\end{vsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{vsmallmatrix*}[l] -a &amp; b \\\\ c &amp; -d \\end{vsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{vsmallmatrix*}[l] -a &amp; b \\\\ c &amp; -d \\end{vsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">|</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="left">
               <mtr data-latex="[l]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[l]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('vsmallmatrix*[c]', () => {
    toXmlMatch(
      tex2mml('\\begin{vsmallmatrix*}[c] -a & b \\\\ c & -d \\end{vsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{vsmallmatrix*}[c] -a &amp; b \\\\ c &amp; -d \\end{vsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{vsmallmatrix*}[c] -a &amp; b \\\\ c &amp; -d \\end{vsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">|</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr data-latex="[c]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[c]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('vsmallmatrix*[r]', () => {
    toXmlMatch(
      tex2mml('\\begin{vsmallmatrix*}[r] -a & b \\\\ c & -d \\end{vsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{vsmallmatrix*}[r] -a &amp; b \\\\ c &amp; -d \\end{vsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{vsmallmatrix*}[r] -a &amp; b \\\\ c &amp; -d \\end{vsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">|</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="right">
               <mtr data-latex="[r]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[r]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Vsmallmatrix*', () => {
    toXmlMatch(
      tex2mml('\\begin{Vsmallmatrix*} -a & b \\\\ c & -d \\end{Vsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Vsmallmatrix*} -a &amp; b \\\\ c &amp; -d \\end{Vsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Vsmallmatrix*} -a &amp; b \\\\ c &amp; -d \\end{Vsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">&#x2016;</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr data-latex=" ">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex=" ">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Vsmallmatrix*[l]', () => {
    toXmlMatch(
      tex2mml('\\begin{Vsmallmatrix*}[l] -a & b \\\\ c & -d \\end{Vsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Vsmallmatrix*}[l] -a &amp; b \\\\ c &amp; -d \\end{Vsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Vsmallmatrix*}[l] -a &amp; b \\\\ c &amp; -d \\end{Vsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">&#x2016;</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="left">
               <mtr data-latex="[l]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[l]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Vsmallmatrix*[c]', () => {
    toXmlMatch(
      tex2mml('\\begin{Vsmallmatrix*}[c] -a & b \\\\ c & -d \\end{Vsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Vsmallmatrix*}[c] -a &amp; b \\\\ c &amp; -d \\end{Vsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Vsmallmatrix*}[c] -a &amp; b \\\\ c &amp; -d \\end{Vsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">&#x2016;</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr data-latex="[c]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[c]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Vsmallmatrix*[r]', () => {
    toXmlMatch(
      tex2mml('\\begin{Vsmallmatrix*}[r] -a & b \\\\ c & -d \\end{Vsmallmatrix*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Vsmallmatrix*}[r] -a &amp; b \\\\ c &amp; -d \\end{Vsmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Vsmallmatrix*}[r] -a &amp; b \\\\ c &amp; -d \\end{Vsmallmatrix*}">
           <mo data-mjx-texclass="OPEN">&#x2016;</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="right">
               <mtr data-latex="[r]">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="a">a</mi>
                 </mtd>
                 <mtd>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
               <mtr data-latex="[r]">
                 <mtd>
                   <mi data-latex="c">c</mi>
                 </mtd>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('smallmatrix', () => {
    toXmlMatch(
      tex2mml('\\begin{smallmatrix} -a & b \\\\ c & -d \\end{smallmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{smallmatrix} -a &amp; b \\\\ c &amp; -d \\end{smallmatrix}" display="block">
         <mstyle scriptlevel="1" data-latex="\\begin{smallmatrix} -a &amp; b \\\\ c &amp; -d \\end{smallmatrix}">
           <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
             <mtr>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
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
                 <mo data-latex="-">&#x2212;</mo>
                 <mi data-latex="d">d</mi>
               </mtd>
             </mtr>
           </mtable>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('smallmatrix', () => {
    toXmlMatch(
      tex2mml('\\begin{smallmatrix} -a & b \\\\ c & -d \\end{smallmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{smallmatrix} -a &amp; b \\\\ c &amp; -d \\end{smallmatrix}" display="block">
         <mstyle scriptlevel="1" data-latex="\\begin{smallmatrix} -a &amp; b \\\\ c &amp; -d \\end{smallmatrix}">
           <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
             <mtr>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
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
                 <mo data-latex="-">&#x2212;</mo>
                 <mi data-latex="d">d</mi>
               </mtd>
             </mtr>
           </mtable>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('psmallmatrix', () => {
    toXmlMatch(
      tex2mml('\\begin{psmallmatrix} -a & b \\\\ c & -d \\end{psmallmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{psmallmatrix} -a &amp; b \\\\ c &amp; -d \\end{psmallmatrix}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{psmallmatrix} -a &amp; b \\\\ c &amp; -d \\end{psmallmatrix}">
           <mo data-mjx-texclass="OPEN">(</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
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
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('bsmallmatrix', () => {
    toXmlMatch(
      tex2mml('\\begin{bsmallmatrix} -a & b \\\\ c & -d \\end{bsmallmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{bsmallmatrix} -a &amp; b \\\\ c &amp; -d \\end{bsmallmatrix}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{bsmallmatrix} -a &amp; b \\\\ c &amp; -d \\end{bsmallmatrix}">
           <mo data-mjx-texclass="OPEN">[</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
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
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">]</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Bsmallmatrix', () => {
    toXmlMatch(
      tex2mml('\\begin{Bsmallmatrix} -a & b \\\\ c & -d \\end{Bsmallmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Bsmallmatrix} -a &amp; b \\\\ c &amp; -d \\end{Bsmallmatrix}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Bsmallmatrix} -a &amp; b \\\\ c &amp; -d \\end{Bsmallmatrix}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
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
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('vsmallmatrix', () => {
    toXmlMatch(
      tex2mml('\\begin{vsmallmatrix} -a & b \\\\ c & -d \\end{vsmallmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{vsmallmatrix} -a &amp; b \\\\ c &amp; -d \\end{vsmallmatrix}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{vsmallmatrix} -a &amp; b \\\\ c &amp; -d \\end{vsmallmatrix}">
           <mo data-mjx-texclass="OPEN">|</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
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
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Vsmallmatrix', () => {
    toXmlMatch(
      tex2mml('\\begin{Vsmallmatrix} -a & b \\\\ c & -d \\end{Vsmallmatrix}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{Vsmallmatrix} -a &amp; b \\\\ c &amp; -d \\end{Vsmallmatrix}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{Vsmallmatrix} -a &amp; b \\\\ c &amp; -d \\end{Vsmallmatrix}">
           <mo data-mjx-texclass="OPEN">&#x2016;</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em">
               <mtr>
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
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
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="d">d</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools More Environments', () => {

  /********************************************************************************/

  test('multlined', () => {
    toXmlMatch(
      tex2mml(
        'A = \\begin{multlined}[t]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined} B'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="A = \\begin{multlined}[t]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined} B" display="block">
         <mi data-latex="A">A</mi>
         <mo data-latex="=">=</mo>
         <mtable displaystyle="true" rowspacing=".5em" columnwidth="100%" align="baseline 1" data-latex="{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{first}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>first</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
               <mspace width="1em"></mspace>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mspace width="1em"></mspace>
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{last}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>last</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
         <mi data-latex="B">B</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('multlined [b] width', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{multlined}[b][7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined} = B'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multlined}[b][7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined} = B" display="block">
         <mtable displaystyle="true" rowspacing=".5em" width="7cm" columnwidth="100%" align="baseline -1" data-latex="{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{first}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>first</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
               <mspace width="1em"></mspace>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mspace width="1em"></mspace>
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{last}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>last</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
         <mo data-latex="=">=</mo>
         <mi data-latex="B">B</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('multlined [c] width', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{multlined}[c][7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined} = B'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multlined}[c][7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined} = B" display="block">
         <mtable displaystyle="true" rowspacing=".5em" width="7cm" columnwidth="100%" data-latex="{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{first}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>first</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
               <mspace width="1em"></mspace>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mspace width="1em"></mspace>
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{last}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>last</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
         <mo data-latex="=">=</mo>
         <mi data-latex="B">B</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('multlined [t] width', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{multlined}[t][7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined} = B'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multlined}[t][7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined} = B" display="block">
         <mtable displaystyle="true" rowspacing=".5em" width="7cm" columnwidth="100%" align="baseline 1" data-latex="{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{first}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>first</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
               <mspace width="1em"></mspace>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mspace width="1em"></mspace>
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{last}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>last</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
         <mo data-latex="=">=</mo>
         <mi data-latex="B">B</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('multlined width', () => {
    toXmlMatch(
      tex2mml('\\begin{multlined}[7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multlined}[7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" width="7cm" columnwidth="100%" data-latex="\\begin{multlined}[7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{first}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>first</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
               <mspace width="1em"></mspace>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mspace width="1em"></mspace>
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{last}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>last</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('multlined shoved', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\begin{multlined}[c][7cm]',
          '\\framebox[4cm]{first} \\\\',
          '\\shoveright{\\framebox[4cm]{second}} \\\\',
          '\\shoveleft{\\framebox[4cm]{third}} \\\\',
          '\\framebox[4cm]{last}',
          '\\end{multlined}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multlined}[c][7cm]\\framebox[4cm]{first} \\\\\\shoveright{\\framebox[4cm]{second}} \\\\\\shoveleft{\\framebox[4cm]{third}} \\\\\\framebox[4cm]{last}\\end{multlined}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" width="7cm" columnwidth="100%" data-latex="\\begin{multlined}[c][7cm]\\framebox[4cm]{first} \\\\\\shoveright{\\framebox[4cm]{second}} \\\\\\shoveleft{\\framebox[4cm]{third}} \\\\\\framebox[4cm]{last}\\end{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{first}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>first</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
               <mspace width="1em"></mspace>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mrow data-mjx-texclass="ORD" data-latex="\\shoveright{\\framebox[4cm]{second}}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>second</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="left">
               <mrow data-mjx-texclass="ORD" data-latex="\\shoveleft{\\framebox[4cm]{third}}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>third</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mspace width="1em"></mspace>
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{last}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>last</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('multlined shoved distance', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\begin{multlined}[c][7cm]',
          '\\framebox[4cm]{first} \\\\',
          '\\shoveright[1cm]{\\framebox[4cm]{second}} \\\\',
          '\\shoveleft[1cm]{\\framebox[4cm]{third}} \\\\',
          '\\framebox[4cm]{last}',
          '\\end{multlined}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multlined}[c][7cm]\\framebox[4cm]{first} \\\\\\shoveright[1cm]{\\framebox[4cm]{second}} \\\\\\shoveleft[1cm]{\\framebox[4cm]{third}} \\\\\\framebox[4cm]{last}\\end{multlined}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" width="7cm" columnwidth="100%" data-latex="\\begin{multlined}[c][7cm]\\framebox[4cm]{first} \\\\\\shoveright[1cm]{\\framebox[4cm]{second}} \\\\\\shoveleft[1cm]{\\framebox[4cm]{third}} \\\\\\framebox[4cm]{last}\\end{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{first}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>first</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
               <mspace width="1em"></mspace>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mrow data-latex="\\shoveright[1cm]{\\framebox[4cm]{second}}">
                 <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{second}">
                   <menclose notation="box">
                     <mpadded width="4cm" data-align="center">
                       <mtext>second</mtext>
                     </mpadded>
                   </menclose>
                 </mrow>
                 <mspace width="1cm"></mspace>
               </mrow>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="left">
               <mrow data-latex="\\shoveleft[1cm]{\\framebox[4cm]{third}}">
                 <mspace width="1cm"></mspace>
                 <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{third}">
                   <menclose notation="box">
                     <mpadded width="4cm" data-align="center">
                       <mtext>third</mtext>
                     </mpadded>
                   </menclose>
                 </mrow>
               </mrow>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mspace width="1em"></mspace>
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[4cm]{last}">
                 <menclose notation="box">
                   <mpadded width="4cm" data-align="center">
                     <mtext>last</mtext>
                   </mpadded>
                 </menclose>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('shoved outside multline', () => {
    expectTexError('\\shoveleft')
      .toBe('\\shoveleft can only appear within the multline or multlined environments');
  });

  /********************************************************************************/

  test('multlined shoved misplaced', () => {
    expectTexError(
      [
        '\\begin{multlined}[c][7cm]',
        '\\framebox[4cm]{first}\\shoveleft \\\\',
        '\\end{multlined}'
      ].join('')
    ).toBe('\\shoveleft must come at the beginning of the line');
  });

  /********************************************************************************/

  test('multlined bad width', () => {
    expectTexError('\\begin{multlined}[abc] \\end{multlined}')
      .toBe('Width for \\begin{multlined} must be a dimension');
  });

  /********************************************************************************/

  test('multlined empty row', () => {
    toXmlMatch(
      tex2mml('\\begin{multlined} a \\\\ \\end{multlined}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multlined} a \\\\ \\end{multlined}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" columnwidth="100%" data-latex="\\begin{multlined} a \\\\ \\end{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mi data-latex="a">a</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('dcases', () => {
    toXmlMatch(
      tex2mml('\\begin{dcases} 1 & x>0 \\\\ -1 & x\\le 0 \\end{dcases}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{dcases} 1 &amp; x&gt;0 \\\\ -1 &amp; x\\le 0 \\end{dcases}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{dcases} 1 &amp; x&gt;0 \\\\ -1 &amp; x\\le 0 \\end{dcases}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mtable columnspacing="1em" rowspacing=".2em" columnalign="left left" displaystyle="true">
             <mtr>
               <mtd>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="&gt;">&gt;</mo>
                 <mn data-latex="0">0</mn>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="\\le">&#x2264;</mo>
                 <mn data-latex="0">0</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true"></mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('dcases*', () => {
    toXmlMatch(
      tex2mml('\\begin{dcases*} 1 & if $x>0$ \\\\ -1 & otherwise \\end{dcases*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{dcases*} 1 &amp; if $x&gt;0$ \\\\ -1 &amp; otherwise \\end{dcases*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{dcases*} 1 &amp; if $x&gt;0$ \\\\ -1 &amp; otherwise \\end{dcases*}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mtable rowspacing=".2em" columnspacing="1em" columnalign="left" displaystyle="true">
             <mtr>
               <mtd>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mstyle displaystyle="false" data-latex="if $x&gt;0$">
                   <mtext>if&#xA0;</mtext>
                   <mrow data-mjx-texclass="ORD">
                     <mi data-latex="x">x</mi>
                     <mo data-latex="&gt;">&gt;</mo>
                     <mn data-latex="0">0</mn>
                   </mrow>
                 </mstyle>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mstyle displaystyle="false" data-latex="otherwise">
                   <mtext>otherwise</mtext>
                 </mstyle>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true"></mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('rcases', () => {
    toXmlMatch(
      tex2mml('\\begin{rcases} 1 & x>0 \\\\ -1 & x\\le 0 \\end{rcases}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{rcases} 1 &amp; x&gt;0 \\\\ -1 &amp; x\\le 0 \\end{rcases}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{rcases} 1 &amp; x&gt;0 \\\\ -1 &amp; x\\le 0 \\end{rcases}">
           <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true"></mo>
           <mtable columnspacing="1em" rowspacing=".2em" columnalign="left left">
             <mtr>
               <mtd>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="&gt;">&gt;</mo>
                 <mn data-latex="0">0</mn>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="\\le">&#x2264;</mo>
                 <mn data-latex="0">0</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('rcases*', () => {
    toXmlMatch(
      tex2mml('\\begin{rcases*} 1 & if $x>0$ \\\\ -1 & otherwise \\end{rcases*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{rcases*} 1 &amp; if $x&gt;0$ \\\\ -1 &amp; otherwise \\end{rcases*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{rcases*} 1 &amp; if $x&gt;0$ \\\\ -1 &amp; otherwise \\end{rcases*}">
           <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true"></mo>
           <mtable rowspacing=".2em" columnspacing="1em" columnalign="left">
             <mtr>
               <mtd>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mstyle data-latex="if $x&gt;0$">
                   <mtext>if&#xA0;</mtext>
                   <mrow data-mjx-texclass="ORD">
                     <mi data-latex="x">x</mi>
                     <mo data-latex="&gt;">&gt;</mo>
                     <mn data-latex="0">0</mn>
                   </mrow>
                 </mstyle>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mtext data-latex="otherwise">otherwise</mtext>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('drcases', () => {
    toXmlMatch(
      tex2mml('\\begin{drcases} 1 & x>0 \\\\ -1 & x\\le 0 \\end{drcases}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{drcases} 1 &amp; x&gt;0 \\\\ -1 &amp; x\\le 0 \\end{drcases}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{drcases} 1 &amp; x&gt;0 \\\\ -1 &amp; x\\le 0 \\end{drcases}">
           <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true"></mo>
           <mtable columnspacing="1em" rowspacing=".2em" columnalign="left left" displaystyle="true">
             <mtr>
               <mtd>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="&gt;">&gt;</mo>
                 <mn data-latex="0">0</mn>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="\\le">&#x2264;</mo>
                 <mn data-latex="0">0</mn>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('drcases*', () => {
    toXmlMatch(
      tex2mml('\\begin{drcases*} 1 & if $x>0$ \\\\ -1 & otherwise \\end{drcases*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{drcases*} 1 &amp; if $x&gt;0$ \\\\ -1 &amp; otherwise \\end{drcases*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{drcases*} 1 &amp; if $x&gt;0$ \\\\ -1 &amp; otherwise \\end{drcases*}">
           <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true"></mo>
           <mtable rowspacing=".2em" columnspacing="1em" columnalign="left" displaystyle="true">
             <mtr>
               <mtd>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mstyle displaystyle="false" data-latex="if $x&gt;0$">
                   <mtext>if&#xA0;</mtext>
                   <mrow data-mjx-texclass="ORD">
                     <mi data-latex="x">x</mi>
                     <mo data-latex="&gt;">&gt;</mo>
                     <mn data-latex="0">0</mn>
                   </mrow>
                 </mstyle>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mstyle displaystyle="false" data-latex="otherwise">
                   <mtext>otherwise</mtext>
                 </mstyle>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('cases*', () => {
    toXmlMatch(
      tex2mml('\\begin{cases*} 1 & if $x>0$ \\\\ -1 & otherwise \\end{cases*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{cases*} 1 &amp; if $x&gt;0$ \\\\ -1 &amp; otherwise \\end{cases*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\begin{cases*} 1 &amp; if $x&gt;0$ \\\\ -1 &amp; otherwise \\end{cases*}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mtable rowspacing=".2em" columnspacing="1em" columnalign="left">
             <mtr>
               <mtd>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mstyle data-latex="if $x&gt;0$">
                   <mtext>if&#xA0;</mtext>
                   <mrow data-mjx-texclass="ORD">
                     <mi data-latex="x">x</mi>
                     <mo data-latex="&gt;">&gt;</mo>
                     <mn data-latex="0">0</mn>
                   </mrow>
                 </mstyle>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mtd>
               <mtd>
                 <mtext data-latex="otherwise">otherwise</mtext>
               </mtd>
             </mtr>
           </mtable>
           <mo data-mjx-texclass="CLOSE" fence="true" stretchy="true" symmetric="true"></mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('MoveEqLeft', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\begin{align*}',
          '\\MoveEqLeft \\framebox[10cm][c]{Long first line} \\\\',
          '  & = \\framebox[6cm][c]{ \\vphantom{g} 2nd line} \\\\',
          '  & \\leq \\dots',
          '\\end{align*}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*}\\MoveEqLeft \\framebox[10cm][c]{Long first line} \\\\  &amp; = \\framebox[6cm][c]{ \\vphantom{g} 2nd line} \\\\  &amp; \\leq \\dots\\end{align*}" display="block">
         <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex="\\hspace{2em}&amp;\\hspace{-2em}\\framebox[10cm][c]{Long first line} \\\\  &amp; = \\framebox[6cm][c]{ \\vphantom{g} 2nd line} \\\\  &amp; \\leq \\dots\\end{align*}">
           <mtr>
             <mtd>
               <mspace width="2em" data-latex="\\hspace{2em}"></mspace>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mspace width="-2em" data-latex="\\hspace{-2em}"></mspace>
                 <mrow data-mjx-texclass="ORD" data-latex="\\framebox[10cm][c]{Long first line}">
                   <menclose notation="box">
                     <mpadded width="10cm" data-align="center">
                       <mtext>Long first line</mtext>
                     </mpadded>
                   </menclose>
                 </mrow>
               </mstyle>
             </mtd>
           </mtr>
           <mtr>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="=">=</mo>
                 <mrow data-mjx-texclass="ORD" data-latex="\\framebox[6cm][c]{ \\vphantom{g} 2nd line}">
                   <menclose notation="box">
                     <mpadded width="6cm" data-align="center">
                       <mtext>&#xA0;\\vphantom{g} 2nd line</mtext>
                     </mpadded>
                   </menclose>
                 </mrow>
               </mstyle>
             </mtd>
           </mtr>
           <mtr>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="\\leq">&#x2264;</mo>
                 <mo>&#x2026;</mo>
               </mstyle>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Spreadlines', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\begin{spreadlines}{20pt}',
          '\\begin{gather}',
          'a=b\\\\',
          'c=d',
          '\\end{gather}',
          '\\end{spreadlines}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{spreadlines}{20pt}\\begin{gather}a=b\\\\c=d\\end{gather}\\end{spreadlines}" display="block">
         <mtable displaystyle="true" columnspacing="1em" rowspacing="2.3em" data-break-align="middle" data-latex="\\begin{spreadlines}{20pt}\\begin{gather}a=b\\\\c=d\\end{gather}\\end{spreadlines}">
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

  test('Spreadlines no environment', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\begin{spreadlines}{20pt}',
          'a=b',
          '\\end{spreadlines}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{spreadlines}{20pt}a=b\\end{spreadlines}" display="block">
         <mi data-latex="a">a</mi>
         <mo data-latex="=">=</mo>
         <mi data-latex="\\end{spreadlines}">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Spreadlines multiple environments', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\begin{spreadlines}{20pt}',
          '\\begin{gather}',
          'a=b\\\\',
          'c=d',
          '\\end{gather}',
          '\\\\',
          '\\begin{gather}',
          'x=y\\\\',
          'z',
          '\\end{gather}',
          '\\end{spreadlines}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{spreadlines}{20pt}\\begin{gather}a=b\\\\c=d\\end{gather}\\\\\\begin{gather}x=y\\\\z\\end{gather}\\end{spreadlines}" display="block">
         <mtable displaystyle="true" columnspacing="1em" rowspacing="2.3em" data-break-align="middle" data-latex="{gather}">
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
         <mspace linebreak="newline" data-latex="\\\\"></mspace>
         <mtable displaystyle="true" columnspacing="1em" rowspacing="2.3em" data-break-align="middle" data-latex="{gather}">
           <mtr>
             <mtd>
               <mi data-latex="x">x</mi>
               <mo data-latex="=">=</mo>
               <mi data-latex="y">y</mi>
             </mtd>
           </mtr>
           <mtr>
             <mtd>
               <mi data-latex="z">z</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('lgathered', () => {
    toXmlMatch(
      tex2mml('\\begin{lgathered} a+b+c \\\\ d \\end{lgathered}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{lgathered} a+b+c \\\\ d \\end{lgathered}" display="block">
         <mtable displaystyle="true" columnalign="left" columnspacing="1em" rowspacing="3pt" data-latex="\\begin{lgathered} a+b+c \\\\ d \\end{lgathered}">
           <mtr data-latex=" ">
             <mtd>
               <mi data-latex="a">a</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="b">b</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="c">c</mi>
             </mtd>
           </mtr>
           <mtr data-latex=" ">
             <mtd>
               <mi data-latex="d">d</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('rgathered', () => {
    toXmlMatch(
      tex2mml('\\begin{rgathered} a+b+c \\\\ d \\end{rgathered}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{rgathered} a+b+c \\\\ d \\end{rgathered}" display="block">
         <mtable displaystyle="true" columnalign="right" columnspacing="1em" rowspacing="3pt" data-latex="\\begin{rgathered} a+b+c \\\\ d \\end{rgathered}">
           <mtr data-latex=" ">
             <mtd>
               <mi data-latex="a">a</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="b">b</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="c">c</mi>
             </mtd>
           </mtr>
           <mtr data-latex=" ">
             <mtd>
               <mi data-latex="d">d</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('ArrowBetweenLines', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\begin{alignat*}{2}',
          '&& \\framebox[1.5cm]{} &= \\framebox[3cm]{} \\\\',
          '\\ArrowBetweenLines',
          '&& \\framebox[1.5cm]{} &= \\framebox[2cm]{}',
          '\\end{alignat*}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{alignat*}{2}&amp;&amp; \\framebox[1.5cm]{} &amp;= \\framebox[3cm]{} \\\\\\ArrowBetweenLines&amp;&amp; \\framebox[1.5cm]{} &amp;= \\framebox[2cm]{}\\end{alignat*}" display="block">
         <mtable displaystyle="true" columnalign="right left right left" columnspacing="0em 0em 0em" rowspacing="3pt" data-break-align="bottom top bottom top" data-latex="\\begin{alignat*}{2}&amp;&amp; \\framebox[1.5cm]{} &amp;= \\framebox[3cm]{} \\\\\\ArrowBetweenLines&amp;&amp; \\framebox[1.5cm]{} &amp;= \\framebox[2cm]{}\\end{alignat*}">
           <mtr data-latex="{2}">
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
             <mtd>
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[1.5cm]{}">
                 <menclose notation="box">
                   <mpadded width="1.5cm" data-align="center"></mpadded>
                 </menclose>
               </mrow>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="=">=</mo>
                 <mrow data-mjx-texclass="ORD" data-latex="\\framebox[3cm]{}">
                   <menclose notation="box">
                     <mpadded width="3cm" data-align="center"></mpadded>
                   </menclose>
                 </mrow>
               </mstyle>
             </mtd>
           </mtr>
           <mtr data-latex="{2}">
             <mtd>
               <mo stretchy="false" data-latex="\\Updownarrow">&#x21D5;</mo>
               <mspace width="1em" data-latex="\\quad"></mspace>
             </mtd>
           </mtr>
           <mtr data-latex="{2}">
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
             <mtd>
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[1.5cm]{}">
                 <menclose notation="box">
                   <mpadded width="1.5cm" data-align="center"></mpadded>
                 </menclose>
               </mrow>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="=">=</mo>
                 <mrow data-mjx-texclass="ORD" data-latex="\\framebox[2cm]{}">
                   <menclose notation="box">
                     <mpadded width="2cm" data-align="center"></mpadded>
                   </menclose>
                 </mrow>
               </mstyle>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('ArrowBetweenLines*', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\begin{alignat*}{2}',
          '&& \\framebox[1.5cm]{} &= \\framebox[3cm]{} &&\\\\',
          '\\ArrowBetweenLines*[\\Downarrow]',
          '&& \\framebox[1.5cm]{} &= \\framebox[2cm]{} &&',
          '\\end{alignat*}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{alignat*}{2}&amp;&amp; \\framebox[1.5cm]{} &amp;= \\framebox[3cm]{} &amp;&amp;\\\\\\ArrowBetweenLines*[\\Downarrow]&amp;&amp; \\framebox[1.5cm]{} &amp;= \\framebox[2cm]{} &amp;&amp;\\end{alignat*}" display="block">
         <mtable displaystyle="true" columnalign="right left right left right left" columnspacing="0em 0em 0em 0em 0em" rowspacing="3pt" data-break-align="bottom top bottom top bottom top" data-latex="\\begin{alignat*}{2}&amp;&amp; \\framebox[1.5cm]{} &amp;= \\framebox[3cm]{} &amp;&amp;\\\\\\ArrowBetweenLines*[\\Downarrow]&amp;&amp; \\framebox[1.5cm]{} &amp;= \\framebox[2cm]{} &amp;&amp;\\end{alignat*}">
           <mtr data-latex="{2}">
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
             <mtd>
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[1.5cm]{}">
                 <menclose notation="box">
                   <mpadded width="1.5cm" data-align="center"></mpadded>
                 </menclose>
               </mrow>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="=">=</mo>
                 <mrow data-mjx-texclass="ORD" data-latex="\\framebox[3cm]{}">
                   <menclose notation="box">
                     <mpadded width="3cm" data-align="center"></mpadded>
                   </menclose>
                 </mrow>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
           </mtr>
           <mtr data-latex="{2}">
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
             <mtd>
               <mspace width="1em" data-latex="\\quad"></mspace>
               <mo stretchy="false" data-latex="\\Downarrow">&#x21D3;</mo>
             </mtd>
           </mtr>
           <mtr data-latex="{2}">
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
             <mtd>
               <mrow data-mjx-texclass="ORD" data-latex="\\framebox[1.5cm]{}">
                 <menclose notation="box">
                   <mpadded width="1.5cm" data-align="center"></mpadded>
                 </menclose>
               </mrow>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="=">=</mo>
                 <mrow data-mjx-texclass="ORD" data-latex="\\framebox[2cm]{}">
                   <menclose notation="box">
                     <mpadded width="2cm" data-align="center"></mpadded>
                   </menclose>
                 </mrow>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('ArrowBetweenLines misplaced', () => {
    expectTexError('\\begin{aligned} a \\ArrowBetweenLines \\end{aligned}')
      .toBe('\\ArrowBetweenLines must be on a row by itself');
  });

  /********************************************************************************/

  test('ArrowBetweenLines error', () => {
    expectTexError('\\ArrowBetweenLines')
      .toBe('\\ArrowBetweenLines can only be used in aligment environments');
  });

  /********************************************************************************/

  test('vdotswithin smallvdotswithin', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\begin{align*}',
          'a &= b \\\\',
          '& \\vdotswithin{=} \\\\',
          '& = c \\\\',
          '\\shortvdotswithin{=}',
          '& = d',
          '\\end{align*}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*}a &amp;= b \\\\&amp; \\vdotswithin{=} \\\\&amp; = c \\\\\\shortvdotswithin{=}&amp; = d\\end{align*}" display="block">
         <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt 0.3em 0.1em 0.1em 0.30000000000000004em" data-break-align="bottom top" data-latex="\\begin{align*}a &amp;= b \\\\&amp; \\vdotswithin{=} \\\\&amp; = c \\\\\\shortvdotswithin{=}&amp; = d\\end{align*}">
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
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mpadded lspace=".5width" data-latex="\\vdotswithin{=}">
                   <mpadded width="0" lspace="-.5width">
                     <mo>&#x22EE;</mo>
                   </mpadded>
                   <mphantom>
                     <mi data-latex="\\mmlToken{mi}{}"></mi>
                     <mo data-latex="=">=</mo>
                     <mi data-latex="\\mmlToken{mi}{}"></mi>
                   </mphantom>
                 </mpadded>
               </mstyle>
             </mtd>
           </mtr>
           <mtr>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="=">=</mo>
                 <mi data-latex="c">c</mi>
               </mstyle>
             </mtd>
           </mtr>
           <mtr>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mpadded lspace=".5width">
                   <mpadded width="0" lspace="-.5width">
                     <mo>&#x22EE;</mo>
                   </mpadded>
                   <mphantom>
                     <mi data-latex="\\mmlToken{mi}{}"></mi>
                     <mo data-latex="=">=</mo>
                     <mi data-latex="\\mmlToken{mi}{}"></mi>
                   </mphantom>
                 </mpadded>
               </mstyle>
             </mtd>
           </mtr>
           <mtr>
             <mtd></mtd>
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

  test('smallvdotswithin star', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\begin{aligned}',
          'A&+ B \\\\',
          '&\\shortvdotswithin*{+}',
          'C &+ D',
          '\\end{aligned}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{aligned}A&amp;+ B \\\\&amp;\\shortvdotswithin*{+}C &amp;+ D\\end{aligned}" display="block">
         <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="0.1em 0.1em 0.30000000000000004em" data-break-align="bottom top" data-latex="\\begin{aligned}A&amp;+ B \\\\&amp;\\shortvdotswithin*{+}C &amp;+ D\\end{aligned}">
           <mtr>
             <mtd>
               <mi data-latex="A">A</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="B">B</mi>
               </mstyle>
             </mtd>
           </mtr>
           <mtr>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mpadded lspace=".5width">
                   <mpadded width="0" lspace="-.5width">
                     <mo>&#x22EE;</mo>
                   </mpadded>
                   <mphantom>
                     <mi data-latex="\\mmlToken{mi}{}"></mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="\\mmlToken{mi}{}"></mi>
                   </mphantom>
                 </mpadded>
               </mstyle>
             </mtd>
           </mtr>
           <mtr>
             <mtd>
               <mi data-latex="C">C</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="D">D</mi>
               </mstyle>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('vdotswithin smallvdotswithin', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\begin{alignat*}{3}',
          'A&+ B &&= C &&+ D \\\\',
          '\\MTFlushSpaceAbove',
          '&\\vdotswithin{+} &&&& \\vdotswithin{+}',
          '\\MTFlushSpaceBelow ',
          'C &+ D &&= Y &&+K',
          '\\end{alignat*}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{alignat*}{3}A&amp;+ B &amp;&amp;= C &amp;&amp;+ D \\\\\\MTFlushSpaceAbove&amp;\\vdotswithin{+} &amp;&amp;&amp;&amp; \\vdotswithin{+}\\MTFlushSpaceBelow C &amp;+ D &amp;&amp;= Y &amp;&amp;+K\\end{alignat*}" display="block">
         <mtable displaystyle="true" columnalign="right left right left right left" columnspacing="0em 0em 0em 0em 0em" rowspacing="0.1em 0.1em 0.30000000000000004em" data-break-align="bottom top bottom top bottom top" data-latex="\\begin{alignat*}{3}A&amp;+ B &amp;&amp;= C &amp;&amp;+ D \\\\\\MTFlushSpaceAbove&amp;\\vdotswithin{+} &amp;&amp;&amp;&amp; \\vdotswithin{+}\\MTFlushSpaceBelow C &amp;+ D &amp;&amp;= Y &amp;&amp;+K\\end{alignat*}">
           <mtr data-latex="{3}">
             <mtd>
               <mi data-latex="A">A</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="B">B</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="=">=</mo>
                 <mi data-latex="C">C</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="D">D</mi>
               </mstyle>
             </mtd>
           </mtr>
           <mtr data-latex="{3}">
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mpadded lspace=".5width" data-latex="\\vdotswithin{+}">
                   <mpadded width="0" lspace="-.5width">
                     <mo>&#x22EE;</mo>
                   </mpadded>
                   <mphantom>
                     <mi data-latex="\\mmlToken{mi}{}"></mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="\\mmlToken{mi}{}"></mi>
                   </mphantom>
                 </mpadded>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mpadded lspace=".5width" data-latex="\\vdotswithin{+}">
                   <mpadded width="0" lspace="-.5width">
                     <mo>&#x22EE;</mo>
                   </mpadded>
                   <mphantom>
                     <mi data-latex="\\mmlToken{mi}{}"></mi>
                     <mo data-latex="+">+</mo>
                     <mi data-latex="\\mmlToken{mi}{}"></mi>
                   </mphantom>
                 </mpadded>
               </mstyle>
             </mtd>
           </mtr>
           <mtr data-latex="{3}">
             <mtd>
               <mi data-latex="C">C</mi>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="D">D</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="=">=</mo>
                 <mi data-latex="Y">Y</mi>
               </mstyle>
             </mtd>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="K">K</mi>
               </mstyle>
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

describe('Mathtools Paired Delimiters', () => {

  /********************************************************************************/

  test('DeclarePairedDelimiter', () => {
    toXmlMatch(
      tex2mml('\\DeclarePairedDelimiter\\abs{\\lvert}{\\rvert} \\abs{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\DeclarePairedDelimiter\\abs{\\lvert}{\\rvert} \\abs{\\frac{a}{b}}" display="block">
         <mo data-mjx-texclass="OPEN" fence="false" stretchy="false" data-latex="\\lvert">|</mo>
         <mfrac data-latex="\\frac{a}{b}">
           <mi data-latex="a">a</mi>
           <mi data-latex="b">b</mi>
         </mfrac>
         <mo data-mjx-texclass="CLOSE" fence="false" stretchy="false" data-latex="\\rvert">|</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('DeclarePairedDelimiter star', () => {
    toXmlMatch(
      tex2mml('\\DeclarePairedDelimiter\\abs{\\lvert}{\\rvert} \\abs*{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\DeclarePairedDelimiter\\abs{\\lvert}{\\rvert} \\abs*{\\frac{a}{b}}" display="block">
         <mrow data-mjx-texclass="OPEN" data-latex="\\mathopen{\\left\\lvert\\frac{a}{b}\\right\\rvert}">
           <mrow data-mjx-texclass="INNER" data-latex="\\left\\lvert\\frac{a}{b}\\right\\rvert">
             <mo data-mjx-texclass="OPEN" data-latex="\\left\\lvert">|</mo>
             <mfrac data-latex="\\frac{a}{b}">
               <mi data-latex="a">a</mi>
               <mi data-latex="b">b</mi>
             </mfrac>
             <mo data-mjx-texclass="CLOSE" data-latex="\\right\\rvert">|</mo>
           </mrow>
         </mrow>
         <mrow data-mjx-texclass="CLOSE" data-latex="\\mathclose{}"></mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('DeclarePairedDelimiter size', () => {
    toXmlMatch(
      tex2mml('\\DeclarePairedDelimiter\\abs{\\lvert}{\\rvert} \\abs[\\Bigg]{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\DeclarePairedDelimiter\\abs{\\lvert}{\\rvert} \\abs[\\Bigg]{\\frac{a}{b}}" display="block">
         <mrow data-mjx-texclass="OPEN" data-latex="\\Biggl\\lvert">
           <mo minsize="2.470em" maxsize="2.470em" fence="true" stretchy="true" symmetric="true">|</mo>
         </mrow>
         <mfrac data-latex="\\frac{a}{b}">
           <mi data-latex="a">a</mi>
           <mi data-latex="b">b</mi>
         </mfrac>
         <mrow data-mjx-texclass="CLOSE" data-latex="\\Biggr\\rvert">
           <mo minsize="2.470em" maxsize="2.470em" fence="true" stretchy="true" symmetric="true">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('DeclarePairedDelimiter duplicate', () => {
    expectTexError('\\DeclarePairedDelimiter\\abs{\\lvert}{\\rvert} \\DeclarePairedDelimiter\\abs{|}{|}')
      .toBe('Command \\abs already defined');
  });

  /********************************************************************************/

  test('DeclarePairedDelimiterX', () => {
    toXmlMatch(
      tex2mml('\\DeclarePairedDelimiterX\\x[1]{\\lvert}{\\rvert}{a#1b} \\x{X}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\DeclarePairedDelimiterX\\x[1]{\\lvert}{\\rvert}{a#1b} \\x{X}" display="block">
         <mo data-mjx-texclass="OPEN" fence="false" stretchy="false" data-latex="\\lvert">|</mo>
         <mi data-latex="a">a</mi>
         <mi data-latex="X">X</mi>
         <mi data-latex="b">b</mi>
         <mo data-mjx-texclass="CLOSE" fence="false" stretchy="false" data-latex="\\rvert">|</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('DeclarePairedDelimiterXPP', () => {
    toXmlMatch(
      tex2mml('\\DeclarePairedDelimiterXPP\\x[1]{A}{\\lvert}{\\rvert}{B}{a#1b} \\x{X}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\DeclarePairedDelimiterXPP\\x[1]{A}{\\lvert}{\\rvert}{B}{a#1b} \\x{X}" display="block">
         <mi data-latex="A">A</mi>
         <mo data-mjx-texclass="OPEN" data-latex="\\lvert">|</mo>
         <mi data-latex="a">a</mi>
         <mi data-latex="X">X</mi>
         <mi data-latex="b">b</mi>
         <mo data-mjx-texclass="CLOSE" data-latex="\\rvert">|</mo>
         <mi data-latex="B">B</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('DeclarePairedDelimiters Backward Compatibility', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\DeclarePairedDelimiters\\a{|}{|}',
          '\\DeclarePairedDelimitersX\\b[1]{|}{|}{#1}',
          '\\DeclarePairedDelimitersXPP\\c[1]{A}{|}{|}{B}{#1}',
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\DeclarePairedDelimiters\\a{|}{|}\\DeclarePairedDelimitersX\\b[1]{|}{|}{#1}\\DeclarePairedDelimitersXPP\\c[1]{A}{|}{|}{B}{#1}" display="block"></math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools Boxed Equations', () => {

  /********************************************************************************/

  test('Aboxed', () => {
    toXmlMatch(
      tex2mml('\\begin{align*}\\Aboxed{ a & = b} \\\\ & = c \\end{align*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align*}\\Aboxed{ a &amp; = b} \\\\ &amp; = c \\end{align*}" display="block">
         <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex="\\rlap{\\boxed{a{}= b}}\\kern.267em\\phantom{a}&amp;\\phantom{{}= b}\\kern.267em \\\\ &amp; = c \\end{align*}">
           <mtr>
             <mtd>
               <mrow data-mjx-texclass="ORD" data-latex="\\rlap{\\boxed{a{}= b}}">
                 <mpadded width="0">
                   <menclose notation="box" data-latex="\\fbox{$\\displaystyle{a{}= b}$}">
                     <mrow data-mjx-texclass="ORD">
                       <mrow data-mjx-texclass="ORD" data-latex="\\displaystyle{a{}= b}">
                         <mi data-latex="a">a</mi>
                         <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                         <mo data-latex="=">=</mo>
                         <mi data-latex="b">b</mi>
                       </mrow>
                     </mrow>
                   </menclose>
                 </mpadded>
               </mrow>
               <mspace width=".267em" linebreak="nobreak" data-latex="\\kern.267em"></mspace>
               <mrow data-mjx-texclass="ORD" data-latex="\\phantom{a}">
                 <mphantom>
                   <mi data-latex="a">a</mi>
                 </mphantom>
               </mrow>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mrow data-mjx-texclass="ORD" data-latex="\\phantom{{}= b}">
                   <mphantom>
                     <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                     <mo data-latex="=">=</mo>
                     <mi data-latex="b">b</mi>
                   </mphantom>
                 </mrow>
                 <mspace width=".267em" linebreak="nobreak" data-latex="\\kern.267em"></mspace>
               </mstyle>
             </mtd>
           </mtr>
           <mtr>
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mi></mi>
                 <mo data-latex="=">=</mo>
                 <mi data-latex="c">c</mi>
               </mstyle>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Aboxed error', () => {
    expectTexError('\\Aboxed{ a & = b}')
      .toBe('\\Aboxed can only be used in aligment environments');
  });

  /********************************************************************************/

  test('Aboxed odd column', () => {
    toXmlMatch(
      tex2mml('\\begin{aligned} & \\Aboxed{ a & = b} \\end{aligned}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{aligned} &amp; \\Aboxed{ a &amp; = b} \\end{aligned}" display="block">
         <mtable displaystyle="true" columnalign="right left right left" columnspacing="0em 2em 0em" rowspacing="3pt" data-break-align="bottom top bottom top" data-latex="\\rlap{\\boxed{a{}= b}}\\kern.267em\\phantom{a}&amp;\\phantom{{}= b}\\kern.267em \\end{aligned}">
           <mtr data-latex=" ">
             <mtd></mtd>
             <mtd>
               <mstyle indentshift="2em"></mstyle>
             </mtd>
             <mtd>
               <mrow data-mjx-texclass="ORD" data-latex="\\rlap{\\boxed{a{}= b}}">
                 <mpadded width="0">
                   <menclose notation="box" data-latex="\\fbox{$\\displaystyle{a{}= b}$}">
                     <mrow data-mjx-texclass="ORD">
                       <mrow data-mjx-texclass="ORD" data-latex="\\displaystyle{a{}= b}">
                         <mi data-latex="a">a</mi>
                         <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                         <mo data-latex="=">=</mo>
                         <mi data-latex="b">b</mi>
                       </mrow>
                     </mrow>
                   </menclose>
                 </mpadded>
               </mrow>
               <mspace width=".267em" linebreak="nobreak" data-latex="\\kern.267em"></mspace>
               <mrow data-mjx-texclass="ORD" data-latex="\\phantom{a}">
                 <mphantom>
                   <mi data-latex="a">a</mi>
                 </mphantom>
               </mrow>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mrow data-mjx-texclass="ORD" data-latex="\\phantom{{}= b}">
                   <mphantom>
                     <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                     <mo data-latex="=">=</mo>
                     <mi data-latex="b">b</mi>
                   </mphantom>
                 </mrow>
                 <mspace width=".267em" linebreak="nobreak" data-latex="\\kern.267em"></mspace>
               </mstyle>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('MakeAboxedCommand', () => {
    toXmlMatch(
      tex2mml('\\MakeAboxedCommand\\Afbox\\fbox \\begin{align}\\Afbox{a &= b}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\MakeAboxedCommand\\Afbox\\fbox \\begin{align}\\Afbox{a &amp;= b}\\end{align}" display="block">
         <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex="\\rlap{\\fbox{$\\displaystyle{a{}= b}$}}\\kern.267em\\phantom{a}&amp;\\phantom{{}= b}\\kern.267em\\end{align}">
           <mtr>
             <mtd>
               <mrow data-mjx-texclass="ORD" data-latex="\\rlap{\\fbox{$\\displaystyle{a{}= b}$}}">
                 <mpadded width="0">
                   <menclose notation="box" data-latex="\\fbox{$\\displaystyle{a{}= b}$}">
                     <mrow data-mjx-texclass="ORD">
                       <mrow data-mjx-texclass="ORD" data-latex="\\displaystyle{a{}= b}">
                         <mi data-latex="a">a</mi>
                         <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                         <mo data-latex="=">=</mo>
                         <mi data-latex="b">b</mi>
                       </mrow>
                     </mrow>
                   </menclose>
                 </mpadded>
               </mrow>
               <mspace width=".267em" linebreak="nobreak" data-latex="\\kern.267em"></mspace>
               <mrow data-mjx-texclass="ORD" data-latex="\\phantom{a}">
                 <mphantom>
                   <mi data-latex="a">a</mi>
                 </mphantom>
               </mrow>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mrow data-mjx-texclass="ORD" data-latex="\\phantom{{}= b}">
                   <mphantom>
                     <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                     <mo data-latex="=">=</mo>
                     <mi data-latex="b">b</mi>
                   </mphantom>
                 </mrow>
                 <mspace width=".267em" linebreak="nobreak" data-latex="\\kern.267em"></mspace>
               </mstyle>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('MakeAboxedCommand star', () => {
    setupTex(['base', 'ams', 'newcommand', 'bbox', 'mathtools']);
    toXmlMatch(
      tex2mml(
        '\\def\\mybox#1{\\bbox[yellow, 5px, border:2px solid]{#1}}\\MakeAboxedCommand*\\Afbox\\mybox \\begin{align}\\Afbox{a &= b}\\end{align}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\def\\mybox#1{\\bbox[yellow, 5px, border:2px solid]{#1}}\\MakeAboxedCommand*\\Afbox\\mybox \\begin{align}\\Afbox{a &amp;= b}\\end{align}" display="block">
         <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex="\\rlap{\\mybox{a{}= b}}\\kern.267em\\phantom{a}&amp;\\phantom{{}= b}\\kern.267em\\end{align}">
           <mtr>
             <mtd>
               <mrow data-mjx-texclass="ORD" data-latex="\\rlap{\\mybox{a{}= b}}">
                 <mpadded width="0">
                   <mstyle mathbackground="yellow" style="border:2px solid" data-latex="\\bbox[yellow, 5px, border:2px solid]{a{}= b}">
                     <mpadded height="+5px" depth="+5px" lspace="5px" width="+10px">
                       <mi data-latex="a">a</mi>
                       <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                       <mo data-latex="=">=</mo>
                       <mi data-latex="b">b</mi>
                     </mpadded>
                   </mstyle>
                 </mpadded>
               </mrow>
               <mspace width=".267em" linebreak="nobreak" data-latex="\\kern.267em"></mspace>
               <mrow data-mjx-texclass="ORD" data-latex="\\phantom{a}">
                 <mphantom>
                   <mi data-latex="a">a</mi>
                 </mphantom>
               </mrow>
             </mtd>
             <mtd>
               <mstyle indentshift="2em">
                 <mrow data-mjx-texclass="ORD" data-latex="\\phantom{{}= b}">
                   <mphantom>
                     <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                     <mo data-latex="=">=</mo>
                     <mi data-latex="b">b</mi>
                   </mphantom>
                 </mrow>
                 <mspace width=".267em" linebreak="nobreak" data-latex="\\kern.267em"></mspace>
               </mstyle>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('MakeAboxedCommand no cs', () => {
    expectTexError('\\MakeAboxedCommand x')
      .toBe('\\MakeAboxedCommand must be followed by a control sequence');
  });

  /********************************************************************************/

  test('MakeAboxedCommand no box', () => {
    expectTexError('\\MakeAboxedCommand\\x x')
      .toBe('\\MakeAboxedCommand\\x must be followed by a control sequence');
  });

  /********************************************************************************/

  test('MakeAboxedCommand redefined', () => {
    expectTexError('\\MakeAboxedCommand*\\x\\boxed \\MakeAboxedCommand\\x\\fbox')
      .toBe('\\x is already defined');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools Centered Colons', () => {

  /********************************************************************************/

  test(':=', () => {
    toXmlMatch(
      tex2mml('a := b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a := b" display="block">
         <mi data-latex="a">a</mi>
         <mo data-mjx-texclass="REL" data-latex=":=">:=</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('vcentercolon', () => {
    toXmlMatch(
      tex2mml('a \\vcentercolon= b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\vcentercolon= b" display="block">
         <mi data-latex="a">a</mi>
         <mpadded voffset=".04em" height="+.04em" depth="-.04em" data-latex="\\vcentercolon">
           <mo>:</mo>
         </mpadded>
         <mo data-latex="=">=</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('ordinarycolon', () => {
    toXmlMatch(
      tex2mml('a \\ordinarycolon= b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\ordinarycolon= b" display="block">
         <mi data-latex="a">a</mi>
         <mo data-mjx-texclass="REL" data-latex="\\ordinarycolon=">:=</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('coloneq', () => {
    toXmlMatch(
      tex2mml('a \\coloneq b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\coloneq b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon=}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mo data-latex="=">=</mo>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Coloneq', () => {
    toXmlMatch(
      tex2mml('a \\Coloneq b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\Coloneq b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\MTThinColon=}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mo data-latex="=">=</mo>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('coloneqq', () => {
    toXmlMatch(
      tex2mml('a \\coloneqq b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\coloneqq b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon=}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mo data-latex="=">=</mo>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Coloneqq', () => {
    toXmlMatch(
      tex2mml('a \\Coloneqq b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\Coloneqq b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\MTThinColon=}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mo data-latex="=">=</mo>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('eqqcolon', () => {
    toXmlMatch(
      tex2mml('a \\eqqcolon b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\eqqcolon b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{=\\MTThinColon}">
           <mo data-latex="=">=</mo>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Eqqcolon', () => {
    toXmlMatch(
      tex2mml('a \\Eqqcolon b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\Eqqcolon b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{=\\MTThinColon\\MTThinColon}">
           <mo data-latex="=">=</mo>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('eqcolon', () => {
    toXmlMatch(
      tex2mml('a \\eqcolon b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\eqcolon b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{=\\MTThinColon}">
           <mo data-latex="=">=</mo>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Eqcolon', () => {
    toXmlMatch(
      tex2mml('a \\Eqcolon b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\Eqcolon b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{=\\MTThinColon\\MTThinColon}">
           <mo data-latex="=">=</mo>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('colonapprox', () => {
    toXmlMatch(
      tex2mml('a \\colonapprox b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\colonapprox b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\approx}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mo data-latex="\\approx">&#x2248;</mo>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Colonapprox', () => {
    toXmlMatch(
      tex2mml('a \\Colonapprox b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\Colonapprox b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\MTThinColon\\approx}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mo data-latex="\\approx">&#x2248;</mo>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('colonsim', () => {
    toXmlMatch(
      tex2mml('a \\colonsim b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\colonsim b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\sim}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mo data-latex="\\sim">&#x223C;</mo>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Colonsim', () => {
    toXmlMatch(
      tex2mml('a \\Colonsim b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\Colonsim b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\MTThinColon\\sim}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mo data-latex="\\sim">&#x223C;</mo>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('dblcolon', () => {
    toXmlMatch(
      tex2mml('a \\dblcolon b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\dblcolon b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\MTThinColon}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('approxcolon', () => {
    toXmlMatch(
      tex2mml('a \\approxcolon b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\approxcolon b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\approx\\MTThinColon}">
           <mo data-latex="\\approx">&#x2248;</mo>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Approxcolon', () => {
    toXmlMatch(
      tex2mml('a \\Approxcolon b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\Approxcolon b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\approx\\MTThinColon\\MTThinColon}">
           <mo data-latex="\\approx">&#x2248;</mo>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('simcolon', () => {
    toXmlMatch(
      tex2mml('a \\simcolon b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\simcolon b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\sim\\MTThinColon}">
           <mo data-latex="\\sim">&#x223C;</mo>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Simcolon', () => {
    toXmlMatch(
      tex2mml('a \\Simcolon b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\Simcolon b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\sim\\MTThinColon\\MTThinColon}">
           <mo data-latex="\\sim">&#x223C;</mo>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('colondash', () => {
    toXmlMatch(
      tex2mml('a \\colondash b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\colondash b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\mathrel{-}}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Colondash', () => {
    toXmlMatch(
      tex2mml('a \\Colondash b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\Colondash b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\MTThinColon\\mathrel{-}}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('dashcolon', () => {
    toXmlMatch(
      tex2mml('a \\dashcolon b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\dashcolon b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mathrel{-}\\MTThinColon}">
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Dashcolon', () => {
    toXmlMatch(
      tex2mml('a \\Dashcolon b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a \\Dashcolon b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mathrel{-}\\MTThinColon\\MTThinColon}">
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools Prescripts', () => {

  /********************************************************************************/

  test('prescripts sub sup', () => {
    toXmlMatch(
      tex2mml('\\prescript{a}{b}{X}^{c}_{d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\prescript{a}{b}{X}^{c}_{d}" display="block">
         <mmultiscripts data-latex="\\prescript{a}{b}{X}^{c}_{d}">
           <mi data-latex="X">X</mi>
           <mrow data-mjx-texclass="ORD" data-latex="{d}">
             <mi data-latex="d">d</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{c}">
             <mi data-latex="c">c</mi>
           </mrow>
           <mprescripts></mprescripts>
           <mi data-latex="b">b</mi>
           <mi data-latex="a">a</mi>
         </mmultiscripts>
       </math>`
    );
  });

  /********************************************************************************/

  test('prescripts sub', () => {
    toXmlMatch(
      tex2mml('\\prescript{a}{}{X}^{c}_{d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\prescript{a}{}{X}^{c}_{d}" display="block">
         <mmultiscripts data-latex="\\prescript{a}{}{X}^{c}_{d}">
           <mi data-latex="X">X</mi>
           <mrow data-mjx-texclass="ORD" data-latex="{d}">
             <mi data-latex="d">d</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{c}">
             <mi data-latex="c">c</mi>
           </mrow>
           <mprescripts></mprescripts>
           <none></none>
           <mi data-latex="a">a</mi>
         </mmultiscripts>
       </math>`
    );
  });

  /********************************************************************************/

  test('prescripts sup', () => {
    toXmlMatch(
      tex2mml('\\prescript{}{b}{X}^{c}_{d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\prescript{}{b}{X}^{c}_{d}" display="block">
         <mmultiscripts data-latex="\\prescript{}{b}{X}^{c}_{d}">
           <mi data-latex="X">X</mi>
           <mrow data-mjx-texclass="ORD" data-latex="{d}">
             <mi data-latex="d">d</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{c}">
             <mi data-latex="c">c</mi>
           </mrow>
           <mprescripts></mprescripts>
           <mi data-latex="b">b</mi>
           <none></none>
         </mmultiscripts>
       </math>`
    );
  });

  /********************************************************************************/

  test('prescripts no post sub', () => {
    toXmlMatch(
      tex2mml('\\prescript{}{b}{X}^{c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\prescript{}{b}{X}^{c}" display="block">
         <mmultiscripts data-latex="\\prescript{}{b}{X}^{c}">
           <mi data-latex="X">X</mi>
           <none></none>
           <mrow data-mjx-texclass="ORD" data-latex="{c}">
             <mi data-latex="c">c</mi>
           </mrow>
           <mprescripts></mprescripts>
           <mi data-latex="b">b</mi>
           <none></none>
         </mmultiscripts>
       </math>`
    );
  });

  /********************************************************************************/

  test('prescripts no post sup', () => {
    toXmlMatch(
      tex2mml('\\prescript{}{b}{X}_{d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\prescript{}{b}{X}_{d}" display="block">
         <mmultiscripts data-latex="\\prescript{}{b}{X}_{d}">
           <mi data-latex="X">X</mi>
           <mrow data-mjx-texclass="ORD" data-latex="{d}">
             <mi data-latex="d">d</mi>
           </mrow>
           <none></none>
           <mprescripts></mprescripts>
           <mi data-latex="b">b</mi>
           <none></none>
         </mmultiscripts>
       </math>`
    );
  });

  /********************************************************************************/

  test('prescripts no postscripts', () => {
    toXmlMatch(
      tex2mml('\\prescript{a}{b}{X}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\prescript{a}{b}{X}" display="block">
         <mmultiscripts data-latex="\\prescript{a}{b}{X}">
           <mi data-latex="X">X</mi>
           <mprescripts></mprescripts>
           <mi data-latex="b">b</mi>
           <mi data-latex="a">a</mi>
         </mmultiscripts>
       </math>`
    );
  });

  /********************************************************************************/

  test('prescripts empty', () => {
    toXmlMatch(
      tex2mml('\\prescript{\\mathbf{}}{}{X}^{c}_{d}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\prescript{\\mathbf{}}{}{X}^{c}_{d}" display="block">
         <msubsup data-latex="\\prescript{\\mathbf{}}{}{X}^{c}_{d}">
           <mi data-latex="\\prescript{\\mathbf{}}{}{X}">X</mi>
           <mrow data-mjx-texclass="ORD" data-latex="{d}">
             <mi data-latex="d">d</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{c}">
             <mi data-latex="c">c</mi>
           </mrow>
         </msubsup>
       </math>`
    );
  });

  /********************************************************************************/

  test('prescripts empty no postscripts', () => {
    toXmlMatch(
      tex2mml('\\prescript{\\mathbf{}}{}{X}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\prescript{\\mathbf{}}{}{X}" display="block">
         <mi data-latex="\\prescript{\\mathbf{}}{}{X}">X</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('prescript filter ingores others', () => {
    toXmlMatch(
      tex2mml('\\sideset{^a}{C}{_b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sideset{^a}{C}{_b}" display="block">
         <mrow data-mjx-texclass="OP" data-latex="\\sideset{^a}{C}{_b}">
           <mmultiscripts data-mjx-script-align="left">
             <msub data-latex="_b">
               <mi></mi>
               <mi data-latex="b">b</mi>
             </msub>
             <mprescripts></mprescripts>
             <none></none>
             <mi data-latex="a">a</mi>
           </mmultiscripts>
           <mi data-latex="C">C</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools Split Fractions', () => {

  /********************************************************************************/

  test('splitfrac', () => {
    toXmlMatch(
      tex2mml('\\frac{\\splitfrac{x + y}{+ x + y}}{z}=\\frac{\\splitdfrac{x + y}{+ x + y}}{z}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\frac{\\splitfrac{x + y}{+ x + y}}{z}=\\frac{\\splitdfrac{x + y}{+ x + y}}{z}" display="block">
         <mfrac data-latex="\\frac{\\splitfrac{x + y}{+ x + y}}{z}">
           <mfrac linethickness="0" numalign="left" denomalign="right" data-latex="\\splitfrac{x + y}{+ x + y}">
             <mstyle scriptlevel="0">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
               <mi></mi>
               <mspace width="1em"></mspace>
             </mstyle>
             <mstyle scriptlevel="0">
               <mspace width="1em"></mspace>
               <mi></mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="y">y</mi>
             </mstyle>
           </mfrac>
           <mi data-latex="z">z</mi>
         </mfrac>
         <mo data-latex="=">=</mo>
         <mfrac data-latex="\\frac{\\splitdfrac{x + y}{+ x + y}}{z}">
           <mstyle displaystyle="true" data-latex="\\splitdfrac{x + y}{+ x + y}">
             <mfrac linethickness="0" numalign="left" denomalign="right">
               <mstyle>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="y">y</mi>
                 <mi></mi>
                 <mspace width="1em"></mspace>
               </mstyle>
               <mstyle>
                 <mspace width="1em"></mspace>
                 <mi></mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="x">x</mi>
                 <mo data-latex="+">+</mo>
                 <mi data-latex="y">y</mi>
               </mstyle>
             </mfrac>
           </mstyle>
           <mi data-latex="z">z</mi>
         </mfrac>
       </math>`
    );
  });

  /********************************************************************************/

  test('splitfrac nested', () => {
    toXmlMatch(
      tex2mml('\\frac{\\splitfrac{x + x + z}{\\splitfrac{\\mathstrut x + y + z}{+ x + y + z}}}{z}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\frac{\\splitfrac{x + x + z}{\\splitfrac{\\mathstrut x + y + z}{+ x + y + z}}}{z}" display="block">
         <mfrac data-latex="\\frac{\\splitfrac{x + x + z}{\\splitfrac{\\mathstrut x + y + z}{+ x + y + z}}}{z}">
           <mfrac linethickness="0" numalign="left" denomalign="right" data-latex="\\splitfrac{x + x + z}{\\splitfrac{\\mathstrut x + y + z}{+ x + y + z}}">
             <mstyle scriptlevel="0">
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="x">x</mi>
               <mo data-latex="+">+</mo>
               <mi data-latex="z">z</mi>
               <mi></mi>
               <mspace width="1em"></mspace>
             </mstyle>
             <mstyle scriptlevel="0">
               <mspace width="1em"></mspace>
               <mi></mi>
               <mfrac linethickness="0" numalign="left" denomalign="right" data-latex="\\splitfrac{\\mathstrut x + y + z}{+ x + y + z}">
                 <mstyle scriptlevel="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{(}">
                     <mpadded width="0">
                       <mphantom>
                         <mo data-latex="(" stretchy="false">(</mo>
                       </mphantom>
                     </mpadded>
                   </mrow>
                   <mi data-latex="x">x</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="y">y</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="z">z</mi>
                   <mi></mi>
                   <mspace width="1em"></mspace>
                 </mstyle>
                 <mstyle scriptlevel="0">
                   <mspace width="1em"></mspace>
                   <mi></mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="x">x</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="y">y</mi>
                   <mo data-latex="+">+</mo>
                   <mi data-latex="z">z</mi>
                 </mstyle>
               </mfrac>
             </mstyle>
           </mfrac>
           <mi data-latex="z">z</mi>
         </mfrac>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools struts', () => {

  /********************************************************************************/

  test('xmathstrut', () => {
    toXmlMatch(
      tex2mml('\\xmathstrut{0.1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xmathstrut{0.1}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\xmathstrut{0.1}">
           <mpadded width="0" height="+0.1height" depth="+0.1depth">
             <mphantom>
               <mo stretchy="false">(</mo>
             </mphantom>
           </mpadded>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xmathstrut', () => {
    toXmlMatch(
      tex2mml('\\xmathstrut[0.2]{0.1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xmathstrut[0.2]{0.1}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\xmathstrut[0.2]{0.1}">
           <mpadded width="0" height="+0.1height" depth="+0.2depth">
             <mphantom>
               <mo stretchy="false">(</mo>
             </mphantom>
           </mpadded>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('xmathstrut error', () => {
    expectTexError('\\xmathstrut{abc}')
      .toBe('Argument to \\xmathstrut is not a number');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools setoptions', () => {

  /********************************************************************************/

  test('multlined gap and pos', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\mathtoolsset{multlined-gap=2em,multlined-pos=b}',
          'a+\\begin{multlined} a \\\\ b \\end{multlined}+b'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{multlined-gap=2em,multlined-pos=b}a+\\begin{multlined} a \\\\ b \\end{multlined}+b" display="block">
         <mi data-latex="a">a</mi>
         <mo data-latex="+">+</mo>
         <mtable displaystyle="true" rowspacing=".5em" columnwidth="100%" align="baseline -1" data-latex="{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mi data-latex="a">a</mi>
               <mspace width="2em"></mspace>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mspace width="2em"></mspace>
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
         </mtable>
         <mo data-latex="+">+</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('multlined-pos override', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\mathtoolsset{multlined-gap=2em,multlined-pos=b}',
          'a+\\begin{multlined}[b] a \\\\ b \\end{multlined}+b'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{multlined-gap=2em,multlined-pos=b}a+\\begin{multlined}[b] a \\\\ b \\end{multlined}+b" display="block">
         <mi data-latex="a">a</mi>
         <mo data-latex="+">+</mo>
         <mtable displaystyle="true" rowspacing=".5em" columnwidth="100%" align="baseline -1" data-latex="{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mi data-latex="a">a</mi>
               <mspace width="2em"></mspace>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mspace width="2em"></mspace>
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
         </mtable>
         <mo data-latex="+">+</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('multlined skips', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\mathtoolsset{multlined-gap=2em,firstline-afterskip=3em,lastline-preskip=1em}',
          '\\begin{multlined}[b] a \\\\ b \\end{multlined}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{multlined-gap=2em,firstline-afterskip=3em,lastline-preskip=1em}\\begin{multlined}[b] a \\\\ b \\end{multlined}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" columnwidth="100%" align="baseline -1" data-latex="\\mathtoolsset{multlined-gap=2em,firstline-afterskip=3em,lastline-preskip=1em}\\begin{multlined}[b] a \\\\ b \\end{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mi data-latex="a">a</mi>
               <mspace width="3em"></mspace>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mspace width="1em"></mspace>
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('multlined width', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\mathtoolsset{multlined-width=5em}',
          '\\begin{multlined} a \\\\ b \\end{multlined}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{multlined-width=5em}\\begin{multlined} a \\\\ b \\end{multlined}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" width="5em" columnwidth="100%" data-latex="\\mathtoolsset{multlined-width=5em}\\begin{multlined} a \\\\ b \\end{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mi data-latex="a">a</mi>
               <mspace width="1em"></mspace>
             </mtd>
           </mtr>
           <mtr>
             <mtd columnalign="right">
               <mspace width="1em"></mspace>
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('smallmatrix-align', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\mathtoolsset{smallmatrix-align=r}',
          '\\begin{psmallmatrix*} a \\\\ -b \\end{psmallmatrix*}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{smallmatrix-align=r}\\begin{psmallmatrix*} a \\\\ -b \\end{psmallmatrix*}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\mathtoolsset{smallmatrix-align=r}\\begin{psmallmatrix*} a \\\\ -b \\end{psmallmatrix*}">
           <mo data-mjx-texclass="OPEN">(</mo>
           <mstyle scriptlevel="1">
             <mtable data-mjx-smallmatrix="true" columnspacing="0.333em" rowspacing=".2em" columnalign="right">
               <mtr data-latex=" ">
                 <mtd>
                   <mi data-latex="a">a</mi>
                 </mtd>
               </mtr>
               <mtr data-latex=" ">
                 <mtd>
                   <mo data-latex="-">&#x2212;</mo>
                   <mi data-latex="b">b</mi>
                 </mtd>
               </mtr>
             </mtable>
           </mstyle>
           <mo data-mjx-texclass="CLOSE">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('contercolon', () => {
    toXmlMatch(
      tex2mml('\\mathtoolsset{centercolon=true} a := b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{centercolon=true} a := b" display="block">
         <mi data-latex="a">a</mi>
         <mpadded voffset=".04em" height="+.04em" depth="-.04em" data-latex=":">
           <mo>:</mo>
         </mpadded>
         <mo data-latex="=">=</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('contercolon-offset', () => {
    toXmlMatch(
      tex2mml('\\mathtoolsset{centercolon-offset=.6em} a \\vcentercolon= b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{centercolon-offset=.6em} a \\vcentercolon= b" display="block">
         <mi data-latex="a">a</mi>
         <mpadded voffset=".6em" height="+.6em" depth="-.6em" data-latex="\\vcentercolon">
           <mo>:</mo>
         </mpadded>
         <mo data-latex="=">=</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('thincolor dx and dw', () => {
    toXmlMatch(
      tex2mml('\\mathtoolsset{thincolon-dx=-.06em,thincolon-dw=.12em} a \\coloneq b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{thincolon-dx=-.06em,thincolon-dw=.12em} a \\coloneq b" display="block">
         <mi data-latex="a">a</mi>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon=}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width=".12em" lspace="-.06em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mo data-latex="=">=</mo>
         </mrow>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('use-unicode', () => {
    toXmlMatch(
      tex2mml(
        '\\mathtoolsset{use-unicode=true}\\coloneq\\Coloneqq\\coloneq\\Coloneqq\\eqqcolon\\eqcolon\\dblcolon\\dashcolon'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{use-unicode=true}\\coloneq\\Coloneqq\\coloneq\\Coloneqq\\eqqcolon\\eqcolon\\dblcolon\\dashcolon" display="block">
         <mo data-mjx-texclass="REL" data-latex="\\coloneq\\Coloneqq\\coloneq\\Coloneqq\\eqqcolon\\eqcolon\\dblcolon\\dashcolon">&#x2254;&#x2A74;&#x2254;&#x2A74;&#x2255;&#x2255;&#x2237;&#x2239;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('prescript formats', () => {
    toXmlMatch(
      tex2mml(
        [
          '\\mathtoolsset{prescript-sub-format=\\mathbf,prescript-sup-format=\\mathsf}',
          '\\mathtoolsset{prescript-arg-format=\\mathfrak}',
          '\\prescript{a}{b}{X}^{c}_{d}'
        ].join('')
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{prescript-sub-format=\\mathbf,prescript-sup-format=\\mathsf}\\mathtoolsset{prescript-arg-format=\\mathfrak}\\prescript{a}{b}{X}^{c}_{d}" display="block">
         <mmultiscripts data-latex="\\mathtoolsset{prescript-sub-format=\\mathbf,prescript-sup-format=\\mathsf}\\mathtoolsset{prescript-arg-format=\\mathfrak}\\prescript{a}{b}{X}^{c}_{d}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathfrak{X}">
             <mi mathvariant="fraktur" data-latex="X">X</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{d}">
             <mi data-latex="d">d</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{c}">
             <mi data-latex="c">c</mi>
           </mrow>
           <mprescripts></mprescripts>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{b}">
             <mi mathvariant="bold" data-latex="b">b</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathsf{a}">
             <mi mathvariant="sans-serif" data-latex="a">a</mi>
           </mrow>
         </mmultiscripts>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mathtools options', () => {

  beforeEach(() => {});

  /********************************************************************************/

  test('setoptions', () => {
    setupTex(['base', 'mathtools'], {mathtools: {'allow-mathtoolsset': false}});
    expectTexError('\\mathtoolsset{use-unicode=true}')
      .toBe('\\mathtoolsset is disabled');
  });

  /********************************************************************************/

  test('tagforms', () => {
    setupTex(['base', 'ams', 'mathtools'], {
      mathtools: {
        tagforms: {
          bold: ['[[', ']]', '\\mathbf']
        }
      }
    });
    toXmlMatch(
      tex2mml('\\usetagform{bold} a=b\\tag{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\usetagform{bold} a=b\\tag{x}" display="block">
         <mtable displaystyle="true" data-latex="\\usetagform{bold} a=b\\tag{x}">
           <mlabeledtr>
             <mtd id="mjx-eqn:x">
               <mtext data-latex="\\text{[[}">[[</mtext>
               <mtext data-latex="\\text{\\mathbf{x}}">\\mathbf{x}</mtext>
               <mtext data-latex="\\text{]]}">]]</mtext>
             </mtd>
             <mtd>
               <mi data-latex="a">a</mi>
               <mo data-latex="=">=</mo>
               <mi data-latex="\\tag{x}">b</mi>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('tagforms error', () => {
    expect(trapErrors(() => {
      setupTex(['base', 'ams', 'mathtools'], {
        mathtools: {
          tagforms: {
            bold: ['[[', ']]', '\\mathbf', 'error']
          }
        }
      });
    })).toBe('The tag form definition for "bold" should be an array of three strings');
  });

  /********************************************************************************/

  test('tagforms reset', () => {
    setupTex(['base', 'ams', 'mathtools'], {
      mathtools: {
        tagforms: {
          bold: ['[[', ']]', '\\mathbf']
        }
      }
    });
    toXmlMatch(
      tex2mml('\\usetagform{bold} \\usetagform{} a\\tag{1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\usetagform{bold} \\usetagform{} a\\tag{1}" display="block">
         <mtable displaystyle="true" data-latex="\\usetagform{bold} \\usetagform{} a\\tag{1}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mi data-latex="\\tag{1}">a</mi>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('non-ams tags', () => {
    class myTags extends AbstractTags {
      formatTag(tag: string) {return ['[[', tag, ']]']}
    };
    Configuration.create('mytags', {
      [ConfigurationType.TAGS]: {mytags: myTags},
      [ConfigurationType.CONFIG]: (config: any, jax: any) => {
        jax.parseOptions.options.tags = 'mytags';
        jax.constructor.tags(jax.parseOptions, config);
      }
    });
    setupTex(['base', 'ams', 'mathtools', ['mytags', 10]], {tags: 'ams'});
    expectTexError('\\newtagform{a}()')
      .toBe('\\newtagform can only be used with ams or mathtools tags');
    expectTexError('\\usetagform{bold}')
      .toBe('\\usetagform can only be used with ams or mathtools tags');
  });

  /********************************************************************************/

  test('pairedDelimiters', () => {
    setupTex(['base', 'ams', 'mathtools'], {
      mathtools: {
        pairedDelimiters: {
          aaa: ['[', ']'],
          bbb: ['|', '|', '[#1]', 1],
          ccc: ['\\{', '\\}', '[#1]', 1, '\\Rightarrow', '\\Leftarrow'],
        }
      }
    });
    toXmlMatch(
      tex2mml('\\aaa{x} \\aaa*{x} \\aaa[\\bigg]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\aaa{x} \\aaa*{x} \\aaa[\\bigg]{x}" display="block">
         <mo data-latex="[" stretchy="false">[</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex="]" stretchy="false">]</mo>
         <mrow data-mjx-texclass="OPEN" data-latex="\\mathopen{\\left[x\\right]}">
           <mrow data-mjx-texclass="INNER" data-latex="\\left[x\\right]">
             <mo data-mjx-texclass="OPEN" data-latex="\\left[">[</mo>
             <mi data-latex="x">x</mi>
             <mo data-mjx-texclass="CLOSE" data-latex="\\right]">]</mo>
           </mrow>
         </mrow>
         <mrow data-mjx-texclass="CLOSE" data-latex="\\mathclose{}"></mrow>
         <mrow data-mjx-texclass="OPEN" data-latex="\\biggl[">
           <mo minsize="2.047em" maxsize="2.047em">[</mo>
         </mrow>
         <mi data-latex="x">x</mi>
         <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr]">
           <mo minsize="2.047em" maxsize="2.047em">]</mo>
         </mrow>
       </math>`
    );
    toXmlMatch(
      tex2mml('\\bbb{x} \\bbb*{x} \\bbb[\\bigg]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbb{x} \\bbb*{x} \\bbb[\\bigg]{x}" display="block">
         <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>
         <mo data-latex="[" stretchy="false">[</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex="]" stretchy="false">]</mo>
         <mo data-mjx-texclass="ORD" data-latex="|">|</mo>
         <mrow data-mjx-texclass="OPEN" data-latex="\\mathopen{\\left|[x]\\right|}">
           <mrow data-mjx-texclass="INNER" data-latex="\\left|[x]\\right|">
             <mo data-mjx-texclass="OPEN" data-latex="\\left|">|</mo>
             <mo data-latex="[" stretchy="false">[</mo>
             <mi data-latex="x">x</mi>
             <mo data-latex="]" stretchy="false">]</mo>
             <mo data-mjx-texclass="CLOSE" data-latex="\\right|">|</mo>
           </mrow>
         </mrow>
         <mrow data-mjx-texclass="CLOSE" data-latex="\\mathclose{}"></mrow>
         <mrow data-mjx-texclass="OPEN" data-latex="\\biggl|">
           <mo minsize="2.047em" maxsize="2.047em" fence="true" stretchy="true" symmetric="true">|</mo>
         </mrow>
         <mo data-latex="[" stretchy="false">[</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex="]" stretchy="false">]</mo>
         <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr|">
           <mo minsize="2.047em" maxsize="2.047em" fence="true" stretchy="true" symmetric="true">|</mo>
         </mrow>
       </math>`
    );
    toXmlMatch(
      tex2mml('\\ccc{x} \\ccc*{x} \\ccc[\\bigg]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ccc{x} \\ccc*{x} \\ccc[\\bigg]{x}" display="block">
         <mo stretchy="false" data-latex="\\Rightarrow">&#x21D2;</mo>
         <mo fence="false" stretchy="false" data-latex="\\{">{</mo>
         <mo data-latex="[" stretchy="false">[</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex="]" stretchy="false">]</mo>
         <mo fence="false" stretchy="false" data-latex="\\}">}</mo>
         <mo data-mjx-texclass="REL" stretchy="false" data-latex="\\Leftarrow\\Rightarrow">&#x21D0;&#x21D2;</mo>
         <mrow data-mjx-texclass="OPEN" data-latex="\\mathopen{\\left\\{[x]\\right\\}}">
           <mrow data-mjx-texclass="INNER" data-latex="\\left\\{[x]\\right\\}">
             <mo data-mjx-texclass="OPEN" data-latex="\\left\\{">{</mo>
             <mo data-latex="[" stretchy="false">[</mo>
             <mi data-latex="x">x</mi>
             <mo data-latex="]" stretchy="false">]</mo>
             <mo data-mjx-texclass="CLOSE" data-latex="\\right\\}">}</mo>
           </mrow>
         </mrow>
         <mrow data-mjx-texclass="CLOSE" data-latex="\\mathclose{}"></mrow>
         <mo data-mjx-texclass="REL" stretchy="false" data-latex="\\Leftarrow\\Rightarrow">&#x21D0;&#x21D2;</mo>
         <mrow data-mjx-texclass="OPEN" data-latex="\\biggl\\{">
           <mo minsize="2.047em" maxsize="2.047em">{</mo>
         </mrow>
         <mo data-latex="[" stretchy="false">[</mo>
         <mi data-latex="x">x</mi>
         <mo data-latex="]" stretchy="false">]</mo>
         <mrow data-mjx-texclass="CLOSE" data-latex="\\biggr\\}">
           <mo minsize="2.047em" maxsize="2.047em">}</mo>
         </mrow>
         <mo stretchy="false" data-latex="\\Leftarrow">&#x21D0;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathtoolsset', () => {
    setupTex(['base', 'ams', 'mathtools']);
    toXmlMatch(
      tex2mml('\\mathtoolsset{multlined-pos={}}\\begin{multlined} a \\end{multlined}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{multlined-pos={}}\\begin{multlined} a \\end{multlined}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" columnwidth="100%" data-latex="\\mathtoolsset{multlined-pos={}}\\begin{multlined} a \\end{multlined}">
           <mtr>
             <mtd columnalign="left">
               <mi data-latex="a">a</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathtoolsset legacycolonsymbols', () => {
    setupTex(['base', 'ams', 'mathtools']);
    toXmlMatch(
      tex2mml('\\mathtoolsset{legacycolonsymbols}\\coloneq\\Coloneq\\eqcolon\\Eqcolon'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{legacycolonsymbols}\\coloneq\\Coloneq\\eqcolon\\Eqcolon" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\mathrel{-}}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
         </mrow>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\MTThinColon\\mathrel{-}}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
         </mrow>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mathrel{-}\\MTThinColon}">
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mathrel{-}\\MTThinColon\\MTThinColon}">
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('legacycolonsymbols option', () => {
    setupTex(['base', 'ams', 'mathtools'], {mathtools: {legacycolonsymbols: true}});
    toXmlMatch(
      tex2mml('\\coloneq\\Coloneq\\eqcolon\\Eqcolon'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\coloneq\\Coloneq\\eqcolon\\Eqcolon" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\mathrel{-}}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
         </mrow>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\MTThinColon\\mathrel{-}}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
         </mrow>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mathrel{-}\\MTThinColon}">
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mathrel{-}\\MTThinColon\\MTThinColon}">
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
       </math>`
    );
    toXmlMatch(
      tex2mml('\\mathtoolsset{legacycolonsymbols=false}\\coloneq\\Coloneq\\eqcolon\\Eqcolon'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtoolsset{legacycolonsymbols=false}\\coloneq\\Coloneq\\eqcolon\\Eqcolon" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon=}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mo data-latex="=">=</mo>
         </mrow>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\MTThinColon\\MTThinColon=}">
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mo data-latex="=">=</mo>
         </mrow>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{=\\MTThinColon}">
           <mo data-latex="=">=</mo>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
         <mrow data-mjx-texclass="REL" data-latex="\\mathrel{=\\MTThinColon\\MTThinColon}">
           <mo data-latex="=">=</mo>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
           <mpadded voffset=".04em" height="+.04em" depth="-.04em" width="-.08em" lspace="-.04em" data-latex="\\MTThinColon">
             <mo>:</mo>
           </mpadded>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('mathtools'));
