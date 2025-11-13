import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/mhchem/MhchemConfiguration';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTex(['base', 'mhchem']));

/**********************************************************************************/
/**********************************************************************************/

describe('Mhchem0', () => {

  /********************************************************************************/

  it('Chem-1', () => {
    toXmlMatch(
      tex2mml('\\ce{CO2 + C -> 2 CO}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{CO2 + C -&gt; 2 CO}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{CO}{\\vphantom{A}}_{\\smash[t]{2}} {}+{} \\mathrm{C} {}\\mathrel{\\mhchemlongrightarrow}{} 2\\,\\mathrm{CO}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{CO}">
             <mi data-mjx-auto-op="false" data-latex="CO">CO</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="+">+</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
             <mi mathvariant="normal" data-latex="C">C</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemlongrightarrow}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemlongrightarrow">&#xE429;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mn data-latex="2">2</mn>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{CO}">
             <mi data-mjx-auto-op="false" data-latex="CO">CO</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-3', () => {
    toXmlMatch(
      tex2mml('C_p[\\ce{H2O(l)}] = \\pu{75.3 J // mol K}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="C_p[\\ce{H2O(l)}] = \\pu{75.3 J // mol K}" display="block">
         <msub data-latex="C_p">
           <mi data-latex="C">C</mi>
           <mi data-latex="p">p</mi>
         </msub>
         <mo data-latex="[" stretchy="false">[</mo>
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}\\mskip2mu(\\mathrm{l})}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
           <mspace width="0.111em" data-latex="\\mskip2mu"></mspace>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{l}">
             <mi mathvariant="normal" data-latex="l">l</mi>
           </mrow>
           <mo data-latex=")" stretchy="false">)</mo>
         </mrow>
         <mo data-latex="]" stretchy="false">]</mo>
         <mo data-latex="=">=</mo>
         <mrow data-mjx-texclass="ORD" data-latex="{5.3~\\mathchoice{\\textstyle\\frac{\\mathrm{J}}{\\mathrm{mol}\\mkern3mu \\mathrm{K}}}{\\frac{\\mathrm{J}}{\\mathrm{mol}\\mkern3mu \\mathrm{K}}}{\\frac{\\mathrm{J}}{\\mathrm{mol}\\mkern3mu \\mathrm{K}}}{\\frac{\\mathrm{J}}{\\mathrm{mol}\\mkern3mu \\mathrm{K}}}}">
           <mn data-latex="5.3">75.3</mn>
           <mtext data-latex="~">&#xA0;</mtext>
           <mstyle displaystyle="false" data-latex="\\textstyle\\frac{\\mathrm{J}}{\\mathrm{mol}\\mkern3mu \\mathrm{K}}">
             <mfrac data-latex="\\frac{\\mathrm{J}}{\\mathrm{mol}\\mkern3mu \\mathrm{K}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{J}">
                 <mi mathvariant="normal" data-latex="J">J</mi>
               </mrow>
               <mrow data-latex="\\mathrm{mol}\\mkern3mu \\mathrm{K}">
                 <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{mol}">
                   <mi data-mjx-auto-op="false" data-latex="mol">mol</mi>
                 </mrow>
                 <mspace width="0.167em" linebreak="nobreak" data-latex="\\mkern3mu"></mspace>
                 <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{K}">
                   <mi mathvariant="normal" data-latex="K">K</mi>
                 </mrow>
               </mrow>
             </mfrac>
           </mstyle>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-4', () => {
    toXmlMatch(
      tex2mml('\\ce{H2O}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{H2O}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-5', () => {
    toXmlMatch(
      tex2mml('\\ce{Sb2O3}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{Sb2O3}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Sb}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}{\\vphantom{A}}_{\\smash[t]{3}}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Sb}">
             <mi data-mjx-auto-op="false" data-latex="Sb">Sb</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{3}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{3}">
                 <mpadded height="0">
                   <mn data-latex="3">3</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-6', () => {
    toXmlMatch(
      tex2mml('\\ce{H+}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{H+}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{H}{\\vphantom{A}}^{+}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{+}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{+}">
               <mo data-latex="+">+</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-7', () => {
    toXmlMatch(
      tex2mml('\\ce{CrO4^2-}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{CrO4^2-}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{CrO}{\\vphantom{A}}_{\\smash[t]{4}}{\\vphantom{A}}^{2-}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{CrO}">
             <mi data-mjx-auto-op="false" data-latex="CrO">CrO</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <msup data-latex="{\\vphantom{A}}^{2-}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{2-}">
               <mn data-latex="2">2</mn>
               <mo data-latex="-">&#x2212;</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-8', () => {
    toXmlMatch(
      tex2mml('\\ce{[AgCl2]-}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{[AgCl2]-}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{[\\mathrm{AgCl}{\\vphantom{A}}_{\\smash[t]{2}}]{\\vphantom{A}}^{-}}">
           <mo data-latex="[" stretchy="false">[</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{AgCl}">
             <mi data-mjx-auto-op="false" data-latex="AgCl">AgCl</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex="]" stretchy="false">]</mo>
           <msup data-latex="{\\vphantom{A}}^{-}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{-}">
               <mo data-latex="-">&#x2212;</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-9', () => {
    toXmlMatch(
      tex2mml('\\ce{Y^99+}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{Y^99+}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Y}{\\vphantom{A}}^{99+}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Y}">
             <mi mathvariant="normal" data-latex="Y">Y</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{9+}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{9+}">
               <mn data-latex="9">99</mn>
               <mo data-latex="+">+</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mhchem1', () => {

  /********************************************************************************/

  it('Chem-10', () => {
    toXmlMatch(
      tex2mml('\\ce{Y^{99+}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{Y^{99+}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Y}{\\vphantom{A}}^{99+}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Y}">
             <mi mathvariant="normal" data-latex="Y">Y</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{9+}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{9+}">
               <mn data-latex="9">99</mn>
               <mo data-latex="+">+</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-11', () => {
    toXmlMatch(
      tex2mml('\\ce{2 H2O}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{2 H2O}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{2\\,\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}">
           <mn data-latex="2">2</mn>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-12', () => {
    toXmlMatch(
      tex2mml('\\ce{2H2O}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{2H2O}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{2\\,\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}">
           <mn data-latex="2">2</mn>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-13', () => {
    toXmlMatch(
      tex2mml('\\ce{0.5 H2O}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{0.5 H2O}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{0.5\\,\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}">
           <mn data-latex=".5">0.5</mn>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-14', () => {
    toXmlMatch(
      tex2mml('\\ce{1/2 H2O}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{1/2 H2O}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathchoice{\\textstyle\\frac{1}{2}}{\\frac{1}{2}}{\\frac{1}{2}}{\\frac{1}{2}}\\,\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}">
           <mstyle displaystyle="false" data-latex="\\textstyle\\frac{1}{2}">
             <mfrac data-latex="\\frac{1}{2}" data-latex="\\textstyle\\frac{1}{2}">
               <mn data-latex="1">1</mn>
               <mn data-latex="2">2</mn>
             </mfrac>
           </mstyle>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-15', () => {
    toXmlMatch(
      tex2mml('\\ce{(1/2) H2O}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{(1/2) H2O}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{(1/2)\\,\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}">
           <mo data-latex="(" stretchy="false">(</mo>
           <mn data-latex="1">1</mn>
           <mo data-latex="/">/</mo>
           <mn data-latex="2">2</mn>
           <mo data-latex=")" stretchy="false">)</mo>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-16', () => {
    toXmlMatch(
      tex2mml('\\ce{$n$ H2O}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{$n$ H2O}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{n \\,\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}">
           <mi data-latex="n">n</mi>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-17', () => {
    toXmlMatch(
      tex2mml('\\ce{^{227}_{90}Th+}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{^{227}_{90}Th+}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{{\\vphantom{A}}^{\\hphantom{227}}_{\\hphantom{90}}\\mkern-1.5mu{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{227}}_{\\vphantom{2}\\llap{\\smash[t]{90}}}\\mathrm{Th}{\\vphantom{A}}^{+}}">
           <msubsup data-latex="{\\vphantom{A}}^{\\hphantom{227}}_{\\hphantom{90}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{90}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{90}">
                 <mpadded height="0" depth="0">
                   <mphantom>
                     <mn data-latex="90">90</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{227}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{227}">
                 <mpadded height="0" depth="0">
                   <mphantom>
                     <mn data-latex="227">227</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mspace width="-0.083em" linebreak="nobreak" data-latex="\\mkern-1.5mu"></mspace>
           <msubsup data-latex="{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{227}}_{\\vphantom{2}\\llap{\\smash[t]{90}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{2}\\llap{\\smash[t]{90}}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                 <mpadded width="0">
                   <mphantom>
                     <mn data-latex="2">2</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{\\smash[t]{90}}">
                 <mpadded width="0" lspace="-1width">
                   <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{90}">
                     <mpadded height="0">
                       <mn data-latex="90">90</mn>
                     </mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\vphantom{2}}\\llap{227}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\vphantom{2}}">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                     <mpadded width="0">
                       <mphantom>
                         <mn data-latex="2">2</mn>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{227}">
                 <mpadded width="0" lspace="-1width">
                   <mn data-latex="227">227</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Th}">
             <mi data-mjx-auto-op="false" data-latex="Th">Th</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{+}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{+}">
               <mo data-latex="+">+</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-18', () => {
    toXmlMatch(
      tex2mml('\\ce{^227_90Th+}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{^227_90Th+}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{{\\vphantom{A}}^{\\hphantom{227}}_{\\hphantom{90}}\\mkern-1.5mu{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{227}}_{\\vphantom{2}\\llap{\\smash[t]{90}}}\\mathrm{Th}{\\vphantom{A}}^{+}}">
           <msubsup data-latex="{\\vphantom{A}}^{\\hphantom{227}}_{\\hphantom{90}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{90}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{90}">
                 <mpadded height="0" depth="0">
                   <mphantom>
                     <mn data-latex="90">90</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{227}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{227}">
                 <mpadded height="0" depth="0">
                   <mphantom>
                     <mn data-latex="227">227</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mspace width="-0.083em" linebreak="nobreak" data-latex="\\mkern-1.5mu"></mspace>
           <msubsup data-latex="{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{227}}_{\\vphantom{2}\\llap{\\smash[t]{90}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{2}\\llap{\\smash[t]{90}}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                 <mpadded width="0">
                   <mphantom>
                     <mn data-latex="2">2</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{\\smash[t]{90}}">
                 <mpadded width="0" lspace="-1width">
                   <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{90}">
                     <mpadded height="0">
                       <mn data-latex="90">90</mn>
                     </mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\vphantom{2}}\\llap{227}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\vphantom{2}}">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                     <mpadded width="0">
                       <mphantom>
                         <mn data-latex="2">2</mn>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{227}">
                 <mpadded width="0" lspace="-1width">
                   <mn data-latex="227">227</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Th}">
             <mi data-mjx-auto-op="false" data-latex="Th">Th</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{+}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{+}">
               <mo data-latex="+">+</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-19', () => {
    toXmlMatch(
      tex2mml('\\ce{^{0}_{-1}n^{-}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{^{0}_{-1}n^{-}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{{\\vphantom{A}}^{\\hphantom{0}}_{\\hphantom{-1}}\\mkern-1.5mu{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{0}}_{\\vphantom{2}\\llap{\\smash[t]{-1}}}\\mathrm{n}{\\vphantom{A}}^{-}}">
           <msubsup data-latex="{\\vphantom{A}}^{\\hphantom{0}}_{\\hphantom{-1}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{-1}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{-1}">
                 <mpadded height="0" depth="0">
                   <mphantom>
                     <mo data-latex="-">&#x2212;</mo>
                     <mn data-latex="1">1</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{0}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{0}">
                 <mpadded height="0" depth="0">
                   <mphantom>
                     <mn data-latex="0">0</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mspace width="-0.083em" linebreak="nobreak" data-latex="\\mkern-1.5mu"></mspace>
           <msubsup data-latex="{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{0}}_{\\vphantom{2}\\llap{\\smash[t]{-1}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{2}\\llap{\\smash[t]{-1}}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                 <mpadded width="0">
                   <mphantom>
                     <mn data-latex="2">2</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{\\smash[t]{-1}}">
                 <mpadded width="0" lspace="-1width">
                   <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{-1}">
                     <mpadded height="0">
                       <mo data-latex="-">&#x2212;</mo>
                       <mn data-latex="1">1</mn>
                     </mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\vphantom{2}}\\llap{0}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\vphantom{2}}">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                     <mpadded width="0">
                       <mphantom>
                         <mn data-latex="2">2</mn>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{0}">
                 <mpadded width="0" lspace="-1width">
                   <mn data-latex="0">0</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{n}">
             <mi mathvariant="normal" data-latex="n">n</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{-}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{-}">
               <mo data-latex="-">&#x2212;</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mhchem2', () => {

  /********************************************************************************/

  it('Chem-20', () => {
    toXmlMatch(
      tex2mml('\\ce{^0_-1n-}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{^0_-1n-}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{{\\vphantom{A}}^{\\hphantom{0}}_{\\hphantom{-1}}\\mkern-1.5mu{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{0}}_{\\vphantom{2}\\llap{\\smash[t]{-1}}}\\mathrm{n}{\\vphantom{A}}^{-}}">
           <msubsup data-latex="{\\vphantom{A}}^{\\hphantom{0}}_{\\hphantom{-1}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{-1}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{-1}">
                 <mpadded height="0" depth="0">
                   <mphantom>
                     <mo data-latex="-">&#x2212;</mo>
                     <mn data-latex="1">1</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{0}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{0}">
                 <mpadded height="0" depth="0">
                   <mphantom>
                     <mn data-latex="0">0</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mspace width="-0.083em" linebreak="nobreak" data-latex="\\mkern-1.5mu"></mspace>
           <msubsup data-latex="{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{0}}_{\\vphantom{2}\\llap{\\smash[t]{-1}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{2}\\llap{\\smash[t]{-1}}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                 <mpadded width="0">
                   <mphantom>
                     <mn data-latex="2">2</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{\\smash[t]{-1}}">
                 <mpadded width="0" lspace="-1width">
                   <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{-1}">
                     <mpadded height="0">
                       <mo data-latex="-">&#x2212;</mo>
                       <mn data-latex="1">1</mn>
                     </mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\vphantom{2}}\\llap{0}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\vphantom{2}}">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                     <mpadded width="0">
                       <mphantom>
                         <mn data-latex="2">2</mn>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{0}">
                 <mpadded width="0" lspace="-1width">
                   <mn data-latex="0">0</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{n}">
             <mi mathvariant="normal" data-latex="n">n</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{-}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{-}">
               <mo data-latex="-">&#x2212;</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-21', () => {
    toXmlMatch(
      tex2mml('\\ce{H{}^3HO}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{H{}^3HO}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{H}\\mkern2mu{\\vphantom{A}}^{\\hphantom{3}}_{\\hphantom{}}\\mkern-1.5mu{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{3}}_{\\vphantom{2}\\llap{\\smash[t]{}}}\\mathrm{HO}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <mspace width="0.111em" linebreak="nobreak" data-latex="\\mkern2mu"></mspace>
           <msubsup data-latex="{\\vphantom{A}}^{\\hphantom{3}}_{\\hphantom{}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{}">
                 <mpadded height="0" depth="0">
                   <mphantom></mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{3}">
                 <mpadded height="0" depth="0">
                   <mphantom>
                     <mn data-latex="3">3</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mspace width="-0.083em" linebreak="nobreak" data-latex="\\mkern-1.5mu"></mspace>
           <msubsup data-latex="{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{3}}_{\\vphantom{2}\\llap{\\smash[t]{}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{2}\\llap{\\smash[t]{}}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                 <mpadded width="0">
                   <mphantom>
                     <mn data-latex="2">2</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{\\smash[t]{}}">
                 <mpadded width="0" lspace="-1width">
                   <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{}">
                     <mpadded height="0"></mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\vphantom{2}}\\llap{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\vphantom{2}}">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                     <mpadded width="0">
                       <mphantom>
                         <mn data-latex="2">2</mn>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{3}">
                 <mpadded width="0" lspace="-1width">
                   <mn data-latex="3">3</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{HO}">
             <mi data-mjx-auto-op="false" data-latex="HO">HO</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-22', () => {
    toXmlMatch(
      tex2mml('\\ce{H^3HO}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{H^3HO}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{H}\\mkern2mu{\\vphantom{A}}^{\\hphantom{3}}_{\\hphantom{}}\\mkern-1.5mu{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{3}}_{\\vphantom{2}\\llap{\\smash[t]{}}}\\mathrm{HO}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <mspace width="0.111em" linebreak="nobreak" data-latex="\\mkern2mu"></mspace>
           <msubsup data-latex="{\\vphantom{A}}^{\\hphantom{3}}_{\\hphantom{}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{}">
                 <mpadded height="0" depth="0">
                   <mphantom></mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{3}">
                 <mpadded height="0" depth="0">
                   <mphantom>
                     <mn data-latex="3">3</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mspace width="-0.083em" linebreak="nobreak" data-latex="\\mkern-1.5mu"></mspace>
           <msubsup data-latex="{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{3}}_{\\vphantom{2}\\llap{\\smash[t]{}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{2}\\llap{\\smash[t]{}}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                 <mpadded width="0">
                   <mphantom>
                     <mn data-latex="2">2</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{\\smash[t]{}}">
                 <mpadded width="0" lspace="-1width">
                   <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{}">
                     <mpadded height="0"></mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\vphantom{2}}\\llap{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\vphantom{2}}">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                     <mpadded width="0">
                       <mphantom>
                         <mn data-latex="2">2</mn>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{3}">
                 <mpadded width="0" lspace="-1width">
                   <mn data-latex="3">3</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{HO}">
             <mi data-mjx-auto-op="false" data-latex="HO">HO</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-23', () => {
    toXmlMatch(
      tex2mml('\\ce{A -> B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A -&gt; B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemlongrightarrow}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemlongrightarrow}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemlongrightarrow">&#xE429;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-24', () => {
    toXmlMatch(
      tex2mml('\\ce{A <- B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A &lt;- B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemlongleftarrow}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemlongleftarrow}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemlongleftarrow">&#xE428;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-25', () => {
    toXmlMatch(
      tex2mml('\\ce{A <-> B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A &lt;-&gt; B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemlongleftrightarrow}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemlongleftrightarrow}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemlongleftrightarrow">&#xE42A;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-26', () => {
    toXmlMatch(
      tex2mml('\\ce{A <--> B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A &lt;--&gt; B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemlongleftrightarrows}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemlongleftrightarrows}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemlongleftrightarrows">&#xE42B;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-27', () => {
    toXmlMatch(
      tex2mml('\\ce{A <=> B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A &lt;=&gt; B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemlongrightleftharpoons}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemlongrightleftharpoons}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemlongrightleftharpoons">&#xE408;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-28', () => {
    toXmlMatch(
      tex2mml('\\ce{A <=>> B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A &lt;=&gt;&gt; B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemlongRightleftharpoons}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemlongRightleftharpoons}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemlongRightleftharpoons">&#xE409;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-29', () => {
    toXmlMatch(
      tex2mml('\\ce{A <<=> B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A &lt;&lt;=&gt; B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemlongLeftrightharpoons}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemlongLeftrightharpoons}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemlongLeftrightharpoons">&#xE40A;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mhchem3', () => {

  /********************************************************************************/

  it('Chem-33', () => {
    toXmlMatch(
      tex2mml('\\ce{(NH4)2S}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{(NH4)2S}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{(\\mathrm{NH}{\\vphantom{A}}_{\\smash[t]{4}}){\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{S}}">
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{NH}">
             <mi data-mjx-auto-op="false" data-latex="NH">NH</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex=")" stretchy="false">)</mo>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{S}">
             <mi mathvariant="normal" data-latex="S">S</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-34', () => {
    toXmlMatch(
      tex2mml('\\ce{[\\{(X2)3\\}2]^3+}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{[\\{(X2)3\\}2]^3+}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{[\\{(\\mathrm{X}{\\vphantom{A}}_{\\smash[t]{2}}){\\vphantom{A}}_{\\smash[t]{3}}\\}{\\vphantom{A}}_{\\smash[t]{2}}]{\\vphantom{A}}^{3+}}">
           <mo data-latex="[" stretchy="false">[</mo>
           <mo fence="false" stretchy="false" data-latex="\\{">{</mo>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{X}">
             <mi mathvariant="normal" data-latex="X">X</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex=")" stretchy="false">)</mo>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{3}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{3}">
                 <mpadded height="0">
                   <mn data-latex="3">3</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo fence="false" stretchy="false" data-latex="\\}">}</mo>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex="]" stretchy="false">]</mo>
           <msup data-latex="{\\vphantom{A}}^{3+}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{3+}">
               <mn data-latex="3">3</mn>
               <mo data-latex="+">+</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-35', () => {
    toXmlMatch(
      tex2mml('\\ce{CH4 + 2 $\\left( \\ce{O2 + 79/21 N2} \\right)$}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{CH4 + 2 $\\left( \\ce{O2 + 79/21 N2} \\right)$}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{CH}{\\vphantom{A}}_{\\smash[t]{4}} {}+{} 2\\,\\left(  \\mathrm{O}{\\vphantom{A}}_{\\smash[t]{2}} {}+{} \\mathchoice{\\textstyle\\frac{79}{21}}{\\frac{79}{21}}{\\frac{79}{21}}{\\frac{79}{21}}\\,\\mathrm{N}{\\vphantom{A}}_{\\smash[t]{2}} \\right) }">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{CH}">
             <mi data-mjx-auto-op="false" data-latex="CH">CH</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="+">+</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mn data-latex="2">2</mn>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="INNER" data-latex-item="\\left(  \\mathrm{O}{\\vphantom{A}}_{\\smash[t]{2}} {}+{} \\mathchoice{\\textstyle\\frac{79}{21}}{\\frac{79}{21}}{\\frac{79}{21}}{\\frac{79}{21}}\\,\\mathrm{N}{\\vphantom{A}}_{\\smash[t]{2}} \\right)" data-latex="\\left(  \\mathrm{O}{\\vphantom{A}}_{\\smash[t]{2}} {}+{} \\mathchoice{\\textstyle\\frac{79}{21}}{\\frac{79}{21}}{\\frac{79}{21}}{\\frac{79}{21}}\\,\\mathrm{N}{\\vphantom{A}}_{\\smash[t]{2}} \\right)">
             <mo data-mjx-texclass="OPEN" data-latex-item="\\left(" data-latex="\\left(">(</mo>
             <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
               <mi mathvariant="normal" data-latex="O">O</mi>
             </mrow>
             <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                 <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                   <mpadded width="0">
                     <mphantom>
                       <mi data-latex="A">A</mi>
                     </mphantom>
                   </mpadded>
                 </mrow>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
                 <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                   <mpadded height="0">
                     <mn data-latex="2">2</mn>
                   </mpadded>
                 </mrow>
               </mrow>
             </msub>
             <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
             <mo data-latex="+">+</mo>
             <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
             <mstyle displaystyle="false" data-latex="\\textstyle\\frac{79}{21}">
               <mfrac data-latex="\\frac{79}{21}">
                 <mn data-latex="79">79</mn>
                 <mn data-latex="21">21</mn>
               </mfrac>
             </mstyle>
             <mspace width="0.167em" data-latex="\\,"></mspace>
             <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{N}">
               <mi mathvariant="normal" data-latex="N">N</mi>
             </mrow>
             <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                 <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                   <mpadded width="0">
                     <mphantom>
                       <mi data-latex="A">A</mi>
                     </mphantom>
                   </mpadded>
                 </mrow>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
                 <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                   <mpadded height="0">
                     <mn data-latex="2">2</mn>
                   </mpadded>
                 </mrow>
               </mrow>
             </msub>
             <mo data-mjx-texclass="CLOSE" data-latex-item="\\right)" data-latex="\\right)">)</mo>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-36', () => {
    toXmlMatch(
      tex2mml('\\ce{H2(aq)}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{H2(aq)}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mskip2mu (\\mathrm{aq})}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mspace width="0.111em" data-latex="\\mskip2mu"></mspace>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{aq}">
             <mi data-mjx-auto-op="false" data-latex="aq">aq</mi>
           </mrow>
           <mo data-latex=")" stretchy="false">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-37', () => {
    toXmlMatch(
      tex2mml('\\ce{CO3^2-_{(aq)}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{CO3^2-_{(aq)}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{CO}{\\vphantom{A}}_{\\smash[t]{3}}{\\vphantom{A}}^{2-}{\\vphantom{A}}_{\\smash[t]{\\mskip1mu (\\mathrm{aq})}}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{CO}">
             <mi data-mjx-auto-op="false" data-latex="CO">CO</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{3}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{3}">
                 <mpadded height="0">
                   <mn data-latex="3">3</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <msup data-latex="{\\vphantom{A}}^{2-}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{2-}">
               <mn data-latex="2">2</mn>
               <mo data-latex="-">&#x2212;</mo>
             </mrow>
           </msup>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{\\mskip1mu (\\mathrm{aq})}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\mskip1mu (\\mathrm{aq})}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\mskip1mu (\\mathrm{aq})}">
                 <mpadded height="0">
                   <mspace width="0.056em" data-latex="\\mskip1mu"></mspace>
                   <mo data-latex="(" stretchy="false">(</mo>
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{aq}">
                     <mi data-mjx-auto-op="false" data-latex="aq">aq</mi>
                   </mrow>
                   <mo data-latex=")" stretchy="false">)</mo>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-38', () => {
    toXmlMatch(
      tex2mml('\\ce{NaOH(aq,$\\infty$)}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{NaOH(aq,$\\infty$)}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{NaOH}\\mskip2mu (\\mathrm{aq},\\infty )}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{NaOH}">
             <mi data-mjx-auto-op="false" data-latex="NaOH">NaOH</mi>
           </mrow>
           <mspace width="0.111em" data-latex="\\mskip2mu"></mspace>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{aq}">
             <mi data-mjx-auto-op="false" data-latex="aq">aq</mi>
           </mrow>
           <mo data-latex=",">,</mo>
           <mi mathvariant="normal" data-latex="\\infty">&#x221E;</mi>
           <mo data-latex=")" stretchy="false">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-39', () => {
    toXmlMatch(
      tex2mml('\\ce{ZnS($c$)}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{ZnS($c$)}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{ZnS}\\mskip2mu (c )}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{ZnS}">
             <mi data-mjx-auto-op="false" data-latex="ZnS">ZnS</mi>
           </mrow>
           <mspace width="0.111em" data-latex="\\mskip2mu"></mspace>
           <mo data-latex="(" stretchy="false">(</mo>
           <mi data-latex="c">c</mi>
           <mo data-latex=")" stretchy="false">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mhchem4', () => {

  /********************************************************************************/

  it('Chem-40', () => {
    toXmlMatch(
      tex2mml('\\ce{ZnS(\\ca$c$)}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{ZnS(\\ca$c$)}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{ZnS}\\mskip2mu ({\\sim}c )}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{ZnS}">
             <mi data-mjx-auto-op="false" data-latex="ZnS">ZnS</mi>
           </mrow>
           <mspace width="0.111em" data-latex="\\mskip2mu"></mspace>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{\\sim}">
             <mo data-latex="\\sim">&#x223C;</mo>
           </mrow>
           <mi data-latex="c">c</mi>
           <mo data-latex=")" stretchy="false">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-41', () => {
    toXmlMatch(
      tex2mml('\\ce{NO_x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{NO_x}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{NO}{\\vphantom{A}}_{\\smash[t]{x }}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{NO}">
             <mi data-mjx-auto-op="false" data-latex="NO">NO</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{x }}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{x }}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{x }">
                 <mpadded height="0">
                   <mi data-latex="x ">x</mi>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-42', () => {
    toXmlMatch(
      tex2mml('\\ce{Fe^n+}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{Fe^n+}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Fe}{\\vphantom{A}}^{n +}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Fe}">
             <mi data-mjx-auto-op="false" data-latex="Fe">Fe</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{n+}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{n+}">
               <mi data-latex="n">n</mi>
               <mo data-latex="+">+</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-44', () => {
    toXmlMatch(
      tex2mml('\\ce{\\mu-Cl}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{\\mu-Cl}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{\\mu}\\text{-}\\mathrm{Cl}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{\\mu}">
             <mi data-latex="\\mu">&#x3BC;</mi>
           </mrow>
           <mtext data-latex="\\text{-}">-</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Cl}">
             <mi data-mjx-auto-op="false" data-latex="Cl">Cl</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-45', () => {
    toXmlMatch(
      tex2mml('\\ce{[Pt(\\eta^2-C2H4)Cl3]-}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{[Pt(\\eta^2-C2H4)Cl3]-}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{[\\mathrm{Pt}(\\mathrm{\\eta}{\\vphantom{A}}^{2}\\text{-}\\mathrm{C}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{4}})\\mathrm{Cl}{\\vphantom{A}}_{\\smash[t]{3}}]{\\vphantom{A}}^{-}}">
           <mo data-latex="[" stretchy="false">[</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Pt}">
             <mi data-mjx-auto-op="false" data-latex="Pt">Pt</mi>
           </mrow>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{\\eta}">
             <mi data-latex="\\eta">&#x3B7;</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{2}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{2}">
               <mn data-latex="2">2</mn>
             </mrow>
           </msup>
           <mtext data-latex="\\text{-}">-</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
             <mi mathvariant="normal" data-latex="C">C</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex=")" stretchy="false">)</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Cl}">
             <mi data-mjx-auto-op="false" data-latex="Cl">Cl</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{3}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{3}">
                 <mpadded height="0">
                   <mn data-latex="3">3</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex="]" stretchy="false">]</mo>
           <msup data-latex="{\\vphantom{A}}^{-}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{-}">
               <mo data-latex="-">&#x2212;</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-46', () => {
    toXmlMatch(
      tex2mml('\\ce{\\beta +}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{\\beta +}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{\\beta }{\\vphantom{A}}^{+}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{\\beta }">
             <mi data-latex="\\beta ">&#x3B2;</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{+}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{+}">
               <mo data-latex="+">+</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-47', () => {
    toXmlMatch(
      tex2mml('\\ce{^40_18Ar + \\gamma{} + \\nu_e}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{^40_18Ar + \\gamma{} + \\nu_e}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{{\\vphantom{A}}^{\\hphantom{40}}_{\\hphantom{18}}\\mkern-1.5mu{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{40}}_{\\vphantom{2}\\llap{\\smash[t]{18}}}\\mathrm{Ar} {}+{} \\mathrm{\\gamma{}} {}+{} \\mathrm{\\nu}{\\vphantom{A}}_{\\smash[t]{e }}}">
           <msubsup data-latex="{\\vphantom{A}}^{\\hphantom{40}}_{\\hphantom{18}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{18}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{18}">
                 <mpadded height="0" depth="0">
                   <mphantom>
                     <mn data-latex="18">18</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\hphantom{40}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\hphantom{40}">
                 <mpadded height="0" depth="0">
                   <mphantom>
                     <mn data-latex="40">40</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mspace width="-0.083em" linebreak="nobreak" data-latex="\\mkern-1.5mu"></mspace>
           <msubsup data-latex="{\\vphantom{A}}^{\\smash[t]{\\vphantom{2}}\\llap{40}}_{\\vphantom{2}\\llap{\\smash[t]{18}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{2}\\llap{\\smash[t]{18}}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                 <mpadded width="0">
                   <mphantom>
                     <mn data-latex="2">2</mn>
                   </mphantom>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{\\smash[t]{18}}">
                 <mpadded width="0" lspace="-1width">
                   <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{18}">
                     <mpadded height="0">
                       <mn data-latex="18">18</mn>
                     </mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\vphantom{2}}\\llap{40}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\vphantom{2}}">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{2}">
                     <mpadded width="0">
                       <mphantom>
                         <mn data-latex="2">2</mn>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mpadded>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\llap{40}">
                 <mpadded width="0" lspace="-1width">
                   <mn data-latex="40">40</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msubsup>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Ar}">
             <mi data-mjx-auto-op="false" data-latex="Ar">Ar</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="+">+</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{\\gamma{}}">
             <mi data-latex="\\gamma">&#x3B3;</mi>
             <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="+">+</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{\\nu}">
             <mi data-latex="\\nu">&#x3BD;</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{e }}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{e }}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{e }">
                 <mpadded height="0">
                   <mi data-latex="e ">e</mi>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-48', () => {
    toXmlMatch(
      tex2mml('\\ce{NaOH(aq,$\\infty$)}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{NaOH(aq,$\\infty$)}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{NaOH}\\mskip2mu (\\mathrm{aq},\\infty )}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{NaOH}">
             <mi data-mjx-auto-op="false" data-latex="NaOH">NaOH</mi>
           </mrow>
           <mspace width="0.111em" data-latex="\\mskip2mu"></mspace>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{aq}">
             <mi data-mjx-auto-op="false" data-latex="aq">aq</mi>
           </mrow>
           <mo data-latex=",">,</mo>
           <mi mathvariant="normal" data-latex="\\infty">&#x221E;</mi>
           <mo data-latex=")" stretchy="false">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-49', () => {
    toXmlMatch(
      tex2mml('\\ce{Fe(CN)_{$\\frac{6}{2}$}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{Fe(CN)_{$\\frac{6}{2}$}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Fe}(\\mathrm{CN}){\\vphantom{A}}_{\\smash[t]{\\frac{6}{2} }}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Fe}">
             <mi data-mjx-auto-op="false" data-latex="Fe">Fe</mi>
           </mrow>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{CN}">
             <mi data-mjx-auto-op="false" data-latex="CN">CN</mi>
           </mrow>
           <mo data-latex=")" stretchy="false">)</mo>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{\\frac{6}{2} }}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\frac{6}{2} }}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\frac{6}{2} }">
                 <mpadded height="0">
                   <mfrac data-latex="\\frac{6}{2} ">
                     <mn data-latex="6">6</mn>
                     <mn data-latex="2">2</mn>
                   </mfrac>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mhchem5', () => {

  /********************************************************************************/

  it('Chem-50', () => {
    toXmlMatch(
      tex2mml('\\ce{X_{$i$}^{$x$}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{X_{$i$}^{$x$}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{X}{\\vphantom{A}}_{\\smash[t]{i }}{\\vphantom{A}}^{x }}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{X}">
             <mi mathvariant="normal" data-latex="X">X</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{i }}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{i }}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{i }">
                 <mpadded height="0">
                   <mi data-latex="i ">i</mi>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <msup data-latex="{\\vphantom{A}}^{x}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{x}">
               <mi data-latex="x">x</mi>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-51', () => {
    toXmlMatch(
      tex2mml('\\ce{X_$i$^$x$}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{X_$i$^$x$}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{X}{\\vphantom{A}}_{\\smash[t]{i }}{\\vphantom{A}}^{x }}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{X}">
             <mi mathvariant="normal" data-latex="X">X</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{i }}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{i }}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{i }">
                 <mpadded height="0">
                   <mi data-latex="i ">i</mi>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <msup data-latex="{\\vphantom{A}}^{x}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{x}">
               <mi data-latex="x">x</mi>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-52', () => {
    toXmlMatch(
      tex2mml('\\ce{$cis${-}[PtCl2(NH3)2]}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{\$cis\${-}[PtCl2(NH3)2]}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{cis {\\text{-}}[\\mathrm{PtCl}{\\vphantom{A}}_{\\smash[t]{2}}(\\mathrm{NH}{\\vphantom{A}}_{\\smash[t]{3}}){\\vphantom{A}}_{\\smash[t]{2}}]}">
           <mi data-latex="c">c</mi>
           <mi data-latex="i">i</mi>
           <mi data-latex="s">s</mi>
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{-}}">
             <mtext data-latex="\\text{-}">-</mtext>
           </mrow>
           <mo data-latex="[" stretchy="false">[</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{PtCl}">
             <mi data-mjx-auto-op="false" data-latex="PtCl">PtCl</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{NH}">
             <mi data-mjx-auto-op="false" data-latex="NH">NH</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{3}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{3}">
                 <mpadded height="0">
                   <mn data-latex="3">3</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex=")" stretchy="false">)</mo>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex="]" stretchy="false">]</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-53', () => {
    toXmlMatch(
      tex2mml('\\ce{CuS($hP12$)}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{CuS(\$hP12\$)}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{CuS}(hP12 )}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{CuS}">
             <mi data-mjx-auto-op="false" data-latex="CuS">CuS</mi>
           </mrow>
           <mo data-latex="(" stretchy="false">(</mo>
           <mi data-latex="h">h</mi>
           <mi data-latex="P">P</mi>
           <mn data-latex="2">12</mn>
           <mo data-latex=")" stretchy="false">)</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-54', () => {
    toXmlMatch(
      tex2mml('\\ce{{Gluconic Acid} + H2O2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{{Gluconic Acid} + H2O2}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{{\\text{Gluconic Acid}} {}+{} \\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}{\\vphantom{A}}_{\\smash[t]{2}}}">
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{Gluconic Acid}}">
             <mtext data-latex="\\text{Gluconic Acid}">Gluconic Acid</mtext>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="+">+</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-55', () => {
    toXmlMatch(
      tex2mml('\\ce{X_{{red}}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{X_{{red}}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{X}{\\vphantom{A}}_{\\smash[t]{\\text{red}}}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{X}">
             <mi mathvariant="normal" data-latex="X">X</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{\\text{red}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\text{red}}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\text{red}}">
                 <mpadded height="0">
                   <mtext data-latex="\\text{red}">red</mtext>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-56', () => {
    toXmlMatch(
      tex2mml('\\ce{{(+)}_589{-}[Co(en)3]Cl3}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{{(+)}_589{-}[Co(en)3]Cl3}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{{\\text{(+)}}{\\vphantom{A}}_{\\smash[t]{589}}{\\text{-}}[\\mathrm{Co}(\\mathrm{en}){\\vphantom{A}}_{\\smash[t]{3}}]\\mathrm{Cl}{\\vphantom{A}}_{\\smash[t]{3}}}">
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{(+)}}">
             <mtext data-latex="\\text{(+)}">(+)</mtext>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{589}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{589}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{589}">
                 <mpadded height="0">
                   <mn data-latex="589">589</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{-}}">
             <mtext data-latex="\\text{-}">-</mtext>
           </mrow>
           <mo data-latex="[" stretchy="false">[</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Co}">
             <mi data-mjx-auto-op="false" data-latex="Co">Co</mi>
           </mrow>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{en}">
             <mi data-mjx-auto-op="false" data-latex="en">en</mi>
           </mrow>
           <mo data-latex=")" stretchy="false">)</mo>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{3}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{3}">
                 <mpadded height="0">
                   <mn data-latex="3">3</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex="]" stretchy="false">]</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Cl}">
             <mi data-mjx-auto-op="false" data-latex="Cl">Cl</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{3}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{3}">
                 <mpadded height="0">
                   <mn data-latex="3">3</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-57', () => {
    toXmlMatch(
      tex2mml('\\ce{C6H5-CHO}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{C6H5-CHO}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{C}{\\vphantom{A}}_{\\smash[t]{6}}\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{5}}{-}\\mathrm{CHO}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
             <mi mathvariant="normal" data-latex="C">C</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{6}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{6}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{6}">
                 <mpadded height="0">
                   <mn data-latex="6">6</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{5}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{5}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{5}">
                 <mpadded height="0">
                   <mn data-latex="5">5</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{CHO}">
             <mi data-mjx-auto-op="false" data-latex="CHO">CHO</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-58', () => {
    toXmlMatch(
      tex2mml('\\ce{A-B=C#D}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A-B=C#D}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A}{-}\\mathrm{B}{=}\\mathrm{C}{\\equiv}\\mathrm{D}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{=}">
             <mo data-latex="=">=</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
             <mi mathvariant="normal" data-latex="C">C</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\equiv}">
             <mo data-latex="\\equiv">&#x2261;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{D}">
             <mi mathvariant="normal" data-latex="D">D</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-59', () => {
    toXmlMatch(
      tex2mml('\\ce{A\\bond{-}B\\bond{=}C\\bond{#}D}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A\\bond{-}B\\bond{=}C\\bond{#}D}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A}{-}\\mathrm{B}{=}\\mathrm{C}{\\equiv}\\mathrm{D}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{=}">
             <mo data-latex="=">=</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
             <mi mathvariant="normal" data-latex="C">C</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\equiv}">
             <mo data-latex="\\equiv">&#x2261;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{D}">
             <mi mathvariant="normal" data-latex="D">D</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mhchem6', () => {

  /********************************************************************************/

  it('Chem-60', () => {
    toXmlMatch(
      tex2mml('\\ce{A\\bond{1}B\\bond{2}C\\bond{3}D}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A\\bond{1}B\\bond{2}C\\bond{3}D}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A}{-}\\mathrm{B}{=}\\mathrm{C}{\\equiv}\\mathrm{D}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{-}">
             <mo data-latex="-">&#x2212;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{=}">
             <mo data-latex="=">=</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
             <mi mathvariant="normal" data-latex="C">C</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\equiv}">
             <mo data-latex="\\equiv">&#x2261;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{D}">
             <mi mathvariant="normal" data-latex="D">D</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-61', () => {
    toXmlMatch(
      tex2mml('\\ce{A\\bond{~}B\\bond{~-}C}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A\\bond{~}B\\bond{~-}C}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A}{\\tripledash}\\mathrm{B}{\\mhchemBondTD}\\mathrm{C}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\tripledash}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" data-latex="\\tripledash">&#xE410;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\mhchemBondTD}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" data-latex="\\mhchemBondTD">&#xE411;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
             <mi mathvariant="normal" data-latex="C">C</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-62', () => {
    toXmlMatch(
      tex2mml('\\ce{A\\bond{~--}B\\bond{~=}C\\bond{-~-}D}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A\\bond{~--}B\\bond{~=}C\\bond{-~-}D}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A}{\\mhchemBondTDD}\\mathrm{B}{\\mhchemBondTDD}\\mathrm{C}{\\mhchemBondDTD}\\mathrm{D}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\mhchemBondTDD}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" data-latex="\\mhchemBondTDD">&#xE412;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\mhchemBondTDD}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" data-latex="\\mhchemBondTDD">&#xE412;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
             <mi mathvariant="normal" data-latex="C">C</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\mhchemBondDTD}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" data-latex="\\mhchemBondDTD">&#xE413;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{D}">
             <mi mathvariant="normal" data-latex="D">D</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-63', () => {
    toXmlMatch(
      tex2mml('\\ce{A\\bond{...}B\\bond{....}C}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A\\bond{...}B\\bond{....}C}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A}{{\\cdot}{\\cdot}{\\cdot}}\\mathrm{B}{{\\cdot}{\\cdot}{\\cdot}{\\cdot}}\\mathrm{C}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{{\\cdot}{\\cdot}{\\cdot}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\cdot}">
               <mo data-latex="\\cdot">&#x22C5;</mo>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\cdot}">
               <mo data-latex="\\cdot">&#x22C5;</mo>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\cdot}">
               <mo data-latex="\\cdot">&#x22C5;</mo>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{{\\cdot}{\\cdot}{\\cdot}{\\cdot}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\cdot}">
               <mo data-latex="\\cdot">&#x22C5;</mo>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\cdot}">
               <mo data-latex="\\cdot">&#x22C5;</mo>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\cdot}">
               <mo data-latex="\\cdot">&#x22C5;</mo>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\cdot}">
               <mo data-latex="\\cdot">&#x22C5;</mo>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
             <mi mathvariant="normal" data-latex="C">C</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-64', () => {
    toXmlMatch(
      tex2mml('\\ce{A\\bond{->}B\\bond{<-}C}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A\\bond{-&gt;}B\\bond{&lt;-}C}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A}{\\mhchemrightarrow}\\mathrm{B}{\\mhchemleftarrow}\\mathrm{C}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\mhchemrightarrow}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemrightarrow">&#xE42D;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{\\mhchemleftarrow}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemleftarrow">&#xE42C;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
             <mi mathvariant="normal" data-latex="C">C</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-65', () => {
    toXmlMatch(
      tex2mml('\\ce{KCr(SO4)2*12H2O}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{KCr(SO4)2*12H2O}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{KCr}(\\mathrm{SO}{\\vphantom{A}}_{\\smash[t]{4}}){\\vphantom{A}}_{\\smash[t]{2}}\\,{\\cdot}\\,12\\,\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{KCr}">
             <mi data-mjx-auto-op="false" data-latex="KCr">KCr</mi>
           </mrow>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{SO}">
             <mi data-mjx-auto-op="false" data-latex="SO">SO</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex=")" stretchy="false">)</mo>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="{\\cdot}">
             <mo data-latex="\\cdot">&#x22C5;</mo>
           </mrow>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mn data-latex="2">12</mn>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-66', () => {
    toXmlMatch(
      tex2mml('\\ce{KCr(SO4)2.12H2O}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{KCr(SO4)2.12H2O}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{KCr}(\\mathrm{SO}{\\vphantom{A}}_{\\smash[t]{4}}){\\vphantom{A}}_{\\smash[t]{2}}\\,{\\cdot}\\,12\\,\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{KCr}">
             <mi data-mjx-auto-op="false" data-latex="KCr">KCr</mi>
           </mrow>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{SO}">
             <mi data-mjx-auto-op="false" data-latex="SO">SO</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex=")" stretchy="false">)</mo>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="{\\cdot}">
             <mo data-latex="\\cdot">&#x22C5;</mo>
           </mrow>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mn data-latex="2">12</mn>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-67', () => {
    toXmlMatch(
      tex2mml('\\ce{KCr(SO4)2 * 12 H2O}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{KCr(SO4)2 * 12 H2O}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{KCr}(\\mathrm{SO}{\\vphantom{A}}_{\\smash[t]{4}}){\\vphantom{A}}_{\\smash[t]{2}}\\,{\\cdot}\\,12\\,\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{KCr}">
             <mi data-mjx-auto-op="false" data-latex="KCr">KCr</mi>
           </mrow>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{SO}">
             <mi data-mjx-auto-op="false" data-latex="SO">SO</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex=")" stretchy="false">)</mo>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="{\\cdot}">
             <mo data-latex="\\cdot">&#x22C5;</mo>
           </mrow>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mn data-latex="2">12</mn>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-68', () => {
    toXmlMatch(
      tex2mml('\\ce{Fe^{II}Fe^{III}2O4}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{Fe^{II}Fe^{III}2O4}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Fe}{\\vphantom{A}}^{\\mathrm{II}}\\mathrm{Fe}{\\vphantom{A}}^{\\mathrm{III}}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}{\\vphantom{A}}_{\\smash[t]{4}}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Fe}">
             <mi data-mjx-auto-op="false" data-latex="Fe">Fe</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{\\mathrm{II}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{II}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{II}">
                 <mi data-mjx-auto-op="false" data-latex="II">II</mi>
               </mrow>
             </mrow>
           </msup>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Fe}">
             <mi data-mjx-auto-op="false" data-latex="Fe">Fe</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{\\mathrm{III}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{III}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{III}">
                 <mi data-mjx-auto-op="false" data-latex="III">III</mi>
               </mrow>
             </mrow>
           </msup>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-69', () => {
    toXmlMatch(
      tex2mml('\\ce{OCO^{.-}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{OCO^{.-}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{OCO}{\\vphantom{A}}^{\\mkern1mu \\bullet\\mkern1mu -}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{OCO}">
             <mi data-mjx-auto-op="false" data-latex="OCO">OCO</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{\\mkern1mu\\bullet\\mkern1mu-}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\mkern1mu\\bullet\\mkern1mu-}">
               <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
               <mo data-latex="\\bullet">&#x2219;</mo>
               <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
               <mo data-latex="-">&#x2212;</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mhchem7', () => {

  /********************************************************************************/

  it('Chem-70', () => {
    toXmlMatch(
      tex2mml('\\ce{NO^{(2.)-}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{NO^{(2.)-}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{NO}{\\vphantom{A}}^{(2\\mkern1mu \\bullet\\mkern1mu )-}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{NO}">
             <mi data-mjx-auto-op="false" data-latex="NO">NO</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{(2\\mkern1mu\\bullet\\mkern1mu)-}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{(2\\mkern1mu\\bullet\\mkern1mu)-}">
               <mo data-latex="(" stretchy="false">(</mo>
               <mn data-latex="2">2</mn>
               <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
               <mo data-latex="\\bullet">&#x2219;</mo>
               <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
               <mo data-latex=")" stretchy="false">)</mo>
               <mo data-latex="-">&#x2212;</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-71', () => {
    toXmlMatch(
      tex2mml("\\ce{O''_{i,x}}"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{O\'\'_{i,x}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{O}{\\vphantom{A}}^{\\prime \\prime }_{\\smash[t]{\\mathrm{i}{,}\\mkern1mu x }}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
           <msubsup data-latex="{\\vphantom{A}}^{\\prime\\prime}_{\\smash[t]{\\mathrm{i}{,}\\mkern1mu x }}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\mathrm{i}{,}\\mkern1mu x }}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\mathrm{i}{,}\\mkern1mu x }">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{i}">
                     <mi mathvariant="normal" data-latex="i">i</mi>
                   </mrow>
                   <mrow data-mjx-texclass="ORD" data-latex="{,}">
                     <mo data-latex=",">,</mo>
                   </mrow>
                   <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
                   <mi data-latex="x">x</mi>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\prime\\prime}">
               <mi data-mjx-alternate="1" data-latex="\\prime">&#x2032;</mi>
               <mi data-mjx-alternate="1" data-latex="\\prime">&#x2032;</mi>
             </mrow>
           </msubsup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-72', () => {
    toXmlMatch(
      tex2mml('\\ce{M^{..}_i}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{M^{..}_i}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{M}{\\vphantom{A}}^{\\mkern1mu \\bullet\\mkern1mu \\mkern1mu \\bullet\\mkern1mu }_{\\smash[t]{\\mathrm{i}}}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{M}">
             <mi mathvariant="normal" data-latex="M">M</mi>
           </mrow>
           <msubsup data-latex="{\\vphantom{A}}^{\\mkern1mu\\bullet\\mkern1mu\\mkern1mu\\bullet\\mkern1mu}_{\\smash[t]{\\mathrm{i}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\mathrm{i}}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\mathrm{i}}">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{i}">
                     <mi mathvariant="normal" data-latex="i">i</mi>
                   </mrow>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\mkern1mu\\bullet\\mkern1mu\\mkern1mu\\bullet\\mkern1mu}">
               <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
               <mo data-latex="\\bullet">&#x2219;</mo>
               <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
               <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
               <mo data-latex="\\bullet">&#x2219;</mo>
               <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
             </mrow>
           </msubsup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-73', () => {
    toXmlMatch(
      tex2mml("\\ce{$V$^{4'}_{Ti}}"),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{\$V\$^{4\'}_{Ti}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{V {\\vphantom{A}}^{4\\prime }_{\\smash[t]{\\mathrm{Ti}}}}">
           <mi data-latex="V">V</mi>
           <msubsup data-latex="{\\vphantom{A}}^{4\\prime}_{\\smash[t]{\\mathrm{Ti}}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\mathrm{Ti}}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\mathrm{Ti}}">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Ti}">
                     <mi data-mjx-auto-op="false" data-latex="Ti">Ti</mi>
                   </mrow>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{4\\prime}">
               <mn data-latex="4">4</mn>
               <mi data-mjx-alternate="1" data-latex="\\prime">&#x2032;</mi>
             </mrow>
           </msubsup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-74', () => {
    toXmlMatch(
      tex2mml('\\ce{V_{V,1}C_{C,0.8}$V$_{C,0.2}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{V_{V,1}C_{C,0.8}\$V\$_{C,0.2}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{V}{\\vphantom{A}}_{\\smash[t]{\\mathrm{V}{,}\\mkern1mu 1}}\\mathrm{C}{\\vphantom{A}}_{\\smash[t]{\\mathrm{C}{,}\\mkern1mu 0.8}}V {\\vphantom{A}}_{\\smash[t]{\\mathrm{C}{,}\\mkern1mu 0.2}}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{V}">
             <mi mathvariant="normal" data-latex="V">V</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{\\mathrm{V}{,}\\mkern1mu 1}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\mathrm{V}{,}\\mkern1mu 1}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\mathrm{V}{,}\\mkern1mu 1}">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{V}">
                     <mi mathvariant="normal" data-latex="V">V</mi>
                   </mrow>
                   <mrow data-mjx-texclass="ORD" data-latex="{,}">
                     <mo data-latex=",">,</mo>
                   </mrow>
                   <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
                   <mn data-latex="1">1</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
             <mi mathvariant="normal" data-latex="C">C</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{\\mathrm{C}{,}\\mkern1mu 0.8}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\mathrm{C}{,}\\mkern1mu 0.8}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\mathrm{C}{,}\\mkern1mu 0.8}">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
                     <mi mathvariant="normal" data-latex="C">C</mi>
                   </mrow>
                   <mrow data-mjx-texclass="ORD" data-latex="{,}">
                     <mo data-latex=",">,</mo>
                   </mrow>
                   <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
                   <mn data-latex=".8">0.8</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mi data-latex="V">V</mi>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{\\mathrm{C}{,}\\mkern1mu 0.2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{\\mathrm{C}{,}\\mkern1mu 0.2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{\\mathrm{C}{,}\\mkern1mu 0.2}">
                 <mpadded height="0">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
                     <mi mathvariant="normal" data-latex="C">C</mi>
                   </mrow>
                   <mrow data-mjx-texclass="ORD" data-latex="{,}">
                     <mo data-latex=",">,</mo>
                   </mrow>
                   <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
                   <mn data-latex=".2">0.2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-75', () => {
    toXmlMatch(
      tex2mml('\\ce{A + B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A + B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}+{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="+">+</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-76', () => {
    toXmlMatch(
      tex2mml('\\ce{A - B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A - B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}-{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="-">&#x2212;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-77', () => {
    toXmlMatch(
      tex2mml('\\ce{A = B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A = B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}={} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="=">=</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-78', () => {
    toXmlMatch(
      tex2mml('\\ce{A \\pm B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A \\pm B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\pm{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="\\pm">&#xB1;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-79', () => {
    toXmlMatch(
      tex2mml('\\ce{SO4^2- + Ba^2+ -> BaSO4 v}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{SO4^2- + Ba^2+ -&gt; BaSO4 v}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{SO}{\\vphantom{A}}_{\\smash[t]{4}}{\\vphantom{A}}^{2-} {}+{} \\mathrm{Ba}{\\vphantom{A}}^{2+} {}\\mathrel{\\mhchemlongrightarrow}{} \\mathrm{BaSO}{\\vphantom{A}}_{\\smash[t]{4}} \\downarrow{} }">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{SO}">
             <mi data-mjx-auto-op="false" data-latex="SO">SO</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <msup data-latex="{\\vphantom{A}}^{2-}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{2-}">
               <mn data-latex="2">2</mn>
               <mo data-latex="-">&#x2212;</mo>
             </mrow>
           </msup>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="+">+</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Ba}">
             <mi data-mjx-auto-op="false" data-latex="Ba">Ba</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{2+}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{2+}">
               <mn data-latex="2">2</mn>
               <mo data-latex="+">+</mo>
             </mrow>
           </msup>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemlongrightarrow}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemlongrightarrow">&#xE429;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{BaSO}">
             <mi data-mjx-auto-op="false" data-latex="BaSO">BaSO</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo stretchy="false" data-latex="\\downarrow">&#x2193;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mhchem8', () => {

  /********************************************************************************/

  it('Chem-80', () => {
    toXmlMatch(
      tex2mml('\\ce{A v B (v) -> B ^ B (^)}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A v B (v) -&gt; B ^ B (^)}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} \\downarrow{} ~\\mathrm{B} \\downarrow{}  {}\\mathrel{\\mhchemlongrightarrow}{} \\mathrm{B} \\uparrow{} ~\\mathrm{B} \\uparrow{} }">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mo stretchy="false" data-latex="\\downarrow">&#x2193;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
           <mo stretchy="false" data-latex="\\downarrow">&#x2193;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemlongrightarrow}">
             <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemlongrightarrow">&#xE429;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
           <mo stretchy="false" data-latex="\\uparrow">&#x2191;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
           <mo stretchy="false" data-latex="\\uparrow">&#x2191;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-81', () => {
    toXmlMatch(
      tex2mml('\\ce{NO^*}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{NO^*}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{NO}{\\vphantom{A}}^{*}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{NO}">
             <mi data-mjx-auto-op="false" data-latex="NO">NO</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{*}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{*}">
               <mo data-latex="*">&#x2217;</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-82', () => {
    toXmlMatch(
      tex2mml('\\ce{1s^2-N}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{1s^2-N}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{1\\mathrm{s}{\\vphantom{A}}^{2}\\text{-}\\mathrm{N}}">
           <mn data-latex="1">1</mn>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{s}">
             <mi mathvariant="normal" data-latex="s">s</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{2}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{2}">
               <mn data-latex="2">2</mn>
             </mrow>
           </msup>
           <mtext data-latex="\\text{-}">-</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{N}">
             <mi mathvariant="normal" data-latex="N">N</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-83', () => {
    toXmlMatch(
      tex2mml('\\ce{n-Pr}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{n-Pr}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{n \\text{-}\\mathrm{Pr}}">
           <mi data-latex="n">n</mi>
           <mtext data-latex="\\text{-}">-</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Pr}">
             <mi data-mjx-auto-op="false" data-latex="Pr">Pr</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-84', () => {
    toXmlMatch(
      tex2mml('\\ce{iPr}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{iPr}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{iPr}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{iPr}">
             <mi data-mjx-auto-op="false" data-latex="iPr">iPr</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-85', () => {
    toXmlMatch(
      tex2mml('\\ce{\\ca Fe}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{\\ca Fe}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{{\\sim}\\mathrm{Fe}}">
           <mrow data-mjx-texclass="ORD" data-latex="{\\sim}">
             <mo data-latex="\\sim">&#x223C;</mo>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Fe}">
             <mi data-mjx-auto-op="false" data-latex="Fe">Fe</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-86', () => {
    toXmlMatch(
      tex2mml('\\ce{A, B, C; F}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A, B, C; F}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A}{,}\\mkern6mu \\mathrm{B}{,}\\mkern6mu \\mathrm{C}{;}\\mkern6mu \\mathrm{F}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{,}">
             <mo data-latex=",">,</mo>
           </mrow>
           <mspace width="0.333em" linebreak="nobreak" data-latex="\\mkern6mu"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{,}">
             <mo data-latex=",">,</mo>
           </mrow>
           <mspace width="0.333em" linebreak="nobreak" data-latex="\\mkern6mu"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{C}">
             <mi mathvariant="normal" data-latex="C">C</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{;}">
             <mo data-latex=";">;</mo>
           </mrow>
           <mspace width="0.333em" linebreak="nobreak" data-latex="\\mkern6mu"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{F}">
             <mi mathvariant="normal" data-latex="F">F</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-87', () => {
    toXmlMatch(
      tex2mml('\\ce{{and others}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{{and others}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{{\\text{and others}}}">
           <mrow data-mjx-texclass="ORD" data-latex="{\\text{and others}}">
             <mtext data-latex="\\text{and others}">and others</mtext>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-88', () => {
    toXmlMatch(
      tex2mml(
        '\\ce{Zn^2+  <=>[+ 2OH-][+ 2H+]  $\\underset{\\text{amphoteres Hydroxid}}{\\ce{Zn(OH)2 v}}$  <=>[+ 2OH-][+ 2H+]  $\\underset{\\text{Hydroxozikat}}{\\ce{[Zn(OH)4]^2-}}$}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{Zn^2+  &lt;=&gt;[+ 2OH-][+ 2H+]  $\\underset{\\text{amphoteres Hydroxid}}{\\ce{Zn(OH)2 v}}$  &lt;=&gt;[+ 2OH-][+ 2H+]  $\\underset{\\text{Hydroxozikat}}{\\ce{[Zn(OH)4]^2-}}$}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Zn}{\\vphantom{A}}^{2+} {}\\mathrel{\\underset{\\lower6mu{ {}+{} 2\\,\\mathrm{H}{\\vphantom{A}}^{+}}}{\\mhchemxrightleftharpoons{ {}+{} 2\\,\\mathrm{OH}{\\vphantom{A}}^{-}}}}{} \\underset{\\text{amphoteres Hydroxid}}{\\ce{Zn(OH)2 v}}  {}\\mathrel{\\underset{\\lower6mu{ {}+{} 2\\,\\mathrm{H}{\\vphantom{A}}^{+}}}{\\mhchemxrightleftharpoons{ {}+{} 2\\,\\mathrm{OH}{\\vphantom{A}}^{-}}}}{} \\underset{\\text{Hydroxozikat}}{\\ce{[Zn(OH)4]^2-}} }">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Zn}">
             <mi data-mjx-auto-op="false" data-latex="Zn">Zn</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{2+}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{2+}">
               <mn data-latex="2">2</mn>
               <mo data-latex="+">+</mo>
             </mrow>
           </msup>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\underset{\\lower6mu{ {}+{} 2\\,\\mathrm{H}{\\vphantom{A}}^{+}}}{\\mhchemxrightleftharpoons{ {}+{} 2\\,\\mathrm{OH}{\\vphantom{A}}^{-}}}}">
             <munder data-latex="\\underset{\\lower6mu{ {}+{} 2\\,\\mathrm{H}{\\vphantom{A}}^{+}}}{\\mhchemxrightleftharpoons{ {}+{} 2\\,\\mathrm{OH}{\\vphantom{A}}^{-}}}">
               <mrow data-mjx-texclass="REL" data-latex="\\mhchemxrightleftharpoons{ {}+{} 2\\,\\mathrm{OH}{\\vphantom{A}}^{-}}">
                 <mrow data-mjx-texclass="NONE"></mrow>
                 <mover>
                   <mo data-mjx-texclass="ORD" stretchy="true">&#xE408;</mo>
                   <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                     <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                     <mo data-latex="+">+</mo>
                     <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                     <mn data-latex="2">2</mn>
                     <mstyle scriptlevel="0" data-latex="\\,">
                       <mspace width="0.167em"></mspace>
                     </mstyle>
                     <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{OH}">
                       <mi data-mjx-auto-op="false" data-latex="OH">OH</mi>
                     </mrow>
                     <msup data-latex="{\\vphantom{A}}^{-}">
                       <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                         <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                           <mpadded width="0">
                             <mphantom>
                               <mi data-latex="A">A</mi>
                             </mphantom>
                           </mpadded>
                         </mrow>
                       </mrow>
                       <mrow data-mjx-texclass="ORD" data-latex="{-}">
                         <mo data-latex="-">&#x2212;</mo>
                       </mrow>
                     </msup>
                     <mspace depth=".2em"></mspace>
                   </mpadded>
                 </mover>
               </mrow>
               <mpadded height="-0.333em" depth="+0.333em" voffset="-0.333em" data-latex="\\lower6mu{ {}+{} 2\\,\\mathrm{H}{\\vphantom{A}}^{+}}">
                 <mrow data-mjx-texclass="ORD">
                   <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                   <mo data-latex="+">+</mo>
                   <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                   <mn data-latex="2">2</mn>
                   <mstyle scriptlevel="0" data-latex="\\,">
                     <mspace width="0.167em"></mspace>
                   </mstyle>
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
                     <mi mathvariant="normal" data-latex="H">H</mi>
                   </mrow>
                   <msup data-latex="{\\vphantom{A}}^{+}">
                     <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                       <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                         <mpadded width="0">
                           <mphantom>
                             <mi data-latex="A">A</mi>
                           </mphantom>
                         </mpadded>
                       </mrow>
                     </mrow>
                     <mrow data-mjx-texclass="ORD" data-latex="{+}">
                       <mo data-latex="+">+</mo>
                     </mrow>
                   </msup>
                 </mrow>
               </mpadded>
             </munder>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <munder data-latex="\\underset{\\text{amphoteres Hydroxid}}{\\ce{Zn(OH)2 v}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Zn}(\\mathrm{OH}){\\vphantom{A}}_{\\smash[t]{2}} \\downarrow{} }">
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Zn}">
                 <mi data-mjx-auto-op="false" data-latex="Zn">Zn</mi>
               </mrow>
               <mo data-latex="(" stretchy="false">(</mo>
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{OH}">
                 <mi data-mjx-auto-op="false" data-latex="OH">OH</mi>
               </mrow>
               <mo data-latex=")" stretchy="false">)</mo>
               <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
                 <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                     <mpadded width="0">
                       <mphantom>
                         <mi data-latex="A">A</mi>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mrow>
                 <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                     <mpadded height="0">
                       <mn data-latex="2">2</mn>
                     </mpadded>
                   </mrow>
                 </mrow>
               </msub>
               <mo stretchy="false" data-latex="\\downarrow">&#x2193;</mo>
               <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
             </mrow>
             <mtext data-latex="\\text{amphoteres Hydroxid}">amphoteres Hydroxid</mtext>
           </munder>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\underset{\\lower6mu{ {}+{} 2\\,\\mathrm{H}{\\vphantom{A}}^{+}}}{\\mhchemxrightleftharpoons{ {}+{} 2\\,\\mathrm{OH}{\\vphantom{A}}^{-}}}}">
             <munder data-latex="\\underset{\\lower6mu{ {}+{} 2\\,\\mathrm{H}{\\vphantom{A}}^{+}}}{\\mhchemxrightleftharpoons{ {}+{} 2\\,\\mathrm{OH}{\\vphantom{A}}^{-}}}">
               <mrow data-mjx-texclass="REL" data-latex="\\mhchemxrightleftharpoons{ {}+{} 2\\,\\mathrm{OH}{\\vphantom{A}}^{-}}">
                 <mrow data-mjx-texclass="NONE"></mrow>
                 <mover>
                   <mo data-mjx-texclass="ORD" stretchy="true">&#xE408;</mo>
                   <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                     <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                     <mo data-latex="+">+</mo>
                     <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                     <mn data-latex="2">2</mn>
                     <mstyle scriptlevel="0" data-latex="\\,">
                       <mspace width="0.167em"></mspace>
                     </mstyle>
                     <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{OH}">
                       <mi data-mjx-auto-op="false" data-latex="OH">OH</mi>
                     </mrow>
                     <msup data-latex="{\\vphantom{A}}^{-}">
                       <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                         <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                           <mpadded width="0">
                             <mphantom>
                               <mi data-latex="A">A</mi>
                             </mphantom>
                           </mpadded>
                         </mrow>
                       </mrow>
                       <mrow data-mjx-texclass="ORD" data-latex="{-}">
                         <mo data-latex="-">&#x2212;</mo>
                       </mrow>
                     </msup>
                     <mspace depth=".2em"></mspace>
                   </mpadded>
                 </mover>
               </mrow>
               <mpadded height="-0.333em" depth="+0.333em" voffset="-0.333em" data-latex="\\lower6mu{ {}+{} 2\\,\\mathrm{H}{\\vphantom{A}}^{+}}">
                 <mrow data-mjx-texclass="ORD">
                   <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                   <mo data-latex="+">+</mo>
                   <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
                   <mn data-latex="2">2</mn>
                   <mstyle scriptlevel="0" data-latex="\\,">
                     <mspace width="0.167em"></mspace>
                   </mstyle>
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
                     <mi mathvariant="normal" data-latex="H">H</mi>
                   </mrow>
                   <msup data-latex="{\\vphantom{A}}^{+}">
                     <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                       <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                         <mpadded width="0">
                           <mphantom>
                             <mi data-latex="A">A</mi>
                           </mphantom>
                         </mpadded>
                       </mrow>
                     </mrow>
                     <mrow data-mjx-texclass="ORD" data-latex="{+}">
                       <mo data-latex="+">+</mo>
                     </mrow>
                   </msup>
                 </mrow>
               </mpadded>
             </munder>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <munder data-latex="\\underset{\\text{Hydroxozikat}}{\\ce{[Zn(OH)4]^2-}}">
             <mrow data-mjx-texclass="ORD" data-latex="{[\\mathrm{Zn}(\\mathrm{OH}){\\vphantom{A}}_{\\smash[t]{4}}]{\\vphantom{A}}^{2-}}">
               <mo data-latex="[" stretchy="false">[</mo>
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Zn}">
                 <mi data-mjx-auto-op="false" data-latex="Zn">Zn</mi>
               </mrow>
               <mo data-latex="(" stretchy="false">(</mo>
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{OH}">
                 <mi data-mjx-auto-op="false" data-latex="OH">OH</mi>
               </mrow>
               <mo data-latex=")" stretchy="false">)</mo>
               <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
                 <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                     <mpadded width="0">
                       <mphantom>
                         <mi data-latex="A">A</mi>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mrow>
                 <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                     <mpadded height="0">
                       <mn data-latex="4">4</mn>
                     </mpadded>
                   </mrow>
                 </mrow>
               </msub>
               <mo data-latex="]" stretchy="false">]</mo>
               <msup data-latex="{\\vphantom{A}}^{2-}">
                 <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                     <mpadded width="0">
                       <mphantom>
                         <mi data-latex="A">A</mi>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mrow>
                 <mrow data-mjx-texclass="ORD" data-latex="{2-}">
                   <mn data-latex="2">2</mn>
                   <mo data-latex="-">&#x2212;</mo>
                 </mrow>
               </msup>
             </mrow>
             <mtext data-latex="\\text{Hydroxozikat}">Hydroxozikat</mtext>
           </munder>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-89', () => {
    toXmlMatch(
      tex2mml('\\ce{$K = \\frac{[\\ce{Hg^2+}][\\ce{Hg}]}{[\\ce{Hg2^2+}]}$}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{\$K = \\frac{[\\ce{Hg^2+}][\\ce{Hg}]}{[\\ce{Hg2^2+}]}\$}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{K = \\frac{[\\ce{Hg^2+}][\\ce{Hg}]}{[\\ce{Hg2^2+}]} }">
           <mi data-latex="K">K</mi>
           <mo data-latex="=">=</mo>
           <mfrac data-latex="\\frac{[\\ce{Hg^2+}][\\ce{Hg}]}{[\\ce{Hg2^2+}]}">
             <mrow data-latex="{\\mathrm{Hg}}]">
               <mo data-latex="[" stretchy="false">[</mo>
               <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Hg}{\\vphantom{A}}^{2+}}">
                 <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Hg}">
                   <mi data-mjx-auto-op="false" data-latex="Hg">Hg</mi>
                 </mrow>
                 <msup data-latex="{\\vphantom{A}}^{2+}">
                   <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                     <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                       <mpadded width="0">
                         <mphantom>
                           <mi data-latex="A">A</mi>
                         </mphantom>
                       </mpadded>
                     </mrow>
                   </mrow>
                   <mrow data-mjx-texclass="ORD" data-latex="{2+}">
                     <mn data-latex="2">2</mn>
                     <mo data-latex="+">+</mo>
                   </mrow>
                 </msup>
               </mrow>
               <mo data-latex="]" stretchy="false">]</mo>
               <mo data-latex="[" stretchy="false">[</mo>
               <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Hg}}">
                 <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Hg}">
                   <mi data-mjx-auto-op="false" data-latex="Hg">Hg</mi>
                 </mrow>
               </mrow>
               <mo data-latex="]" stretchy="false">]</mo>
             </mrow>
             <mrow data-latex="{\\mathrm{Hg}{\\vphantom{A}}_{\\smash[t]{2}}{\\vphantom{A}}^{2+}}]">
               <mo data-latex="[" stretchy="false">[</mo>
               <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Hg}{\\vphantom{A}}_{\\smash[t]{2}}{\\vphantom{A}}^{2+}}">
                 <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Hg}">
                   <mi data-mjx-auto-op="false" data-latex="Hg">Hg</mi>
                 </mrow>
                 <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
                   <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                     <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                       <mpadded width="0">
                         <mphantom>
                           <mi data-latex="A">A</mi>
                         </mphantom>
                       </mpadded>
                     </mrow>
                   </mrow>
                   <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
                     <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                       <mpadded height="0">
                         <mn data-latex="2">2</mn>
                       </mpadded>
                     </mrow>
                   </mrow>
                 </msub>
                 <msup data-latex="{\\vphantom{A}}^{2+}">
                   <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                     <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                       <mpadded width="0">
                         <mphantom>
                           <mi data-latex="A">A</mi>
                         </mphantom>
                       </mpadded>
                     </mrow>
                   </mrow>
                   <mrow data-mjx-texclass="ORD" data-latex="{2+}">
                     <mn data-latex="2">2</mn>
                     <mo data-latex="+">+</mo>
                   </mrow>
                 </msup>
               </mrow>
               <mo data-latex="]" stretchy="false">]</mo>
             </mrow>
           </mfrac>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mhchem9', () => {

  /********************************************************************************/

  it('Chem-90', () => {
    toXmlMatch(
      tex2mml('\\ce{$K = \\ce{\\frac{[Hg^2+][Hg]}{[Hg2^2+]}}$}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{\$K = \\ce{\\frac{[Hg^2+][Hg]}{[Hg2^2+]}}\$}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{K =  \\frac{[\\mathrm{Hg}{\\vphantom{A}}^{2+}][\\mathrm{Hg}]}{[\\mathrm{Hg}{\\vphantom{A}}_{\\smash[t]{2}}{\\vphantom{A}}^{2+}]}}">
           <mi data-latex="K">K</mi>
           <mo data-latex="=">=</mo>
           <mfrac data-latex="\\frac{[\\mathrm{Hg}{\\vphantom{A}}^{2+}][\\mathrm{Hg}]}{[\\mathrm{Hg}{\\vphantom{A}}_{\\smash[t]{2}}{\\vphantom{A}}^{2+}]}">
             <mrow data-latex="[\\mathrm{Hg}{\\vphantom{A}}^{2+}][\\mathrm{Hg}]">
               <mo data-latex="[" stretchy="false">[</mo>
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Hg}">
                 <mi data-mjx-auto-op="false" data-latex="Hg">Hg</mi>
               </mrow>
               <msup data-latex="{\\vphantom{A}}^{2+}">
                 <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                     <mpadded width="0">
                       <mphantom>
                         <mi data-latex="A">A</mi>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mrow>
                 <mrow data-mjx-texclass="ORD" data-latex="{2+}">
                   <mn data-latex="2">2</mn>
                   <mo data-latex="+">+</mo>
                 </mrow>
               </msup>
               <mo data-latex="]" stretchy="false">]</mo>
               <mo data-latex="[" stretchy="false">[</mo>
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Hg}">
                 <mi data-mjx-auto-op="false" data-latex="Hg">Hg</mi>
               </mrow>
               <mo data-latex="]" stretchy="false">]</mo>
             </mrow>
             <mrow data-latex="[\\mathrm{Hg}{\\vphantom{A}}_{\\smash[t]{2}}{\\vphantom{A}}^{2+}]">
               <mo data-latex="[" stretchy="false">[</mo>
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Hg}">
                 <mi data-mjx-auto-op="false" data-latex="Hg">Hg</mi>
               </mrow>
               <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
                 <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                     <mpadded width="0">
                       <mphantom>
                         <mi data-latex="A">A</mi>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mrow>
                 <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                     <mpadded height="0">
                       <mn data-latex="2">2</mn>
                     </mpadded>
                   </mrow>
                 </mrow>
               </msub>
               <msup data-latex="{\\vphantom{A}}^{2+}">
                 <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                     <mpadded width="0">
                       <mphantom>
                         <mi data-latex="A">A</mi>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mrow>
                 <mrow data-mjx-texclass="ORD" data-latex="{2+}">
                   <mn data-latex="2">2</mn>
                   <mo data-latex="+">+</mo>
                 </mrow>
               </msup>
               <mo data-latex="]" stretchy="false">]</mo>
             </mrow>
           </mfrac>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-92', () => {
    toXmlMatch(
      tex2mml('\\pu{123 kJ}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pu{123 kJ}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{123~\\mathrm{kJ}}">
           <mn data-latex="23">123</mn>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kJ}">
             <mi data-mjx-auto-op="false" data-latex="kJ">kJ</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-93', () => {
    toXmlMatch(
      tex2mml('\\pu{123 mm2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pu{123 mm2}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{123~\\mathrm{mm^{2}}}">
           <mn data-latex="23">123</mn>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{mm^{2}}">
             <msup data-latex="mm^{2}">
               <mi data-mjx-auto-op="false" data-latex="m">mm</mi>
               <mrow data-mjx-texclass="ORD" data-latex="{2}">
                 <mn data-latex="2">2</mn>
               </mrow>
             </msup>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-94', () => {
    toXmlMatch(
      tex2mml('\\pu{123 J s}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pu{123 J s}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{123~\\mathrm{J}\\mkern3mu \\mathrm{s}}">
           <mn data-latex="23">123</mn>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{J}">
             <mi mathvariant="normal" data-latex="J">J</mi>
           </mrow>
           <mspace width="0.167em" linebreak="nobreak" data-latex="\\mkern3mu"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{s}">
             <mi mathvariant="normal" data-latex="s">s</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-95', () => {
    toXmlMatch(
      tex2mml('\\pu{123 J*s}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pu{123 J*s}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{123~\\mathrm{J}\\mkern1mu{\\cdot}\\mkern1mu \\mathrm{s}}">
           <mn data-latex="23">123</mn>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{J}">
             <mi mathvariant="normal" data-latex="J">J</mi>
           </mrow>
           <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="{\\cdot}">
             <mo data-latex="\\cdot">&#x22C5;</mo>
           </mrow>
           <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{s}">
             <mi mathvariant="normal" data-latex="s">s</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-96', () => {
    toXmlMatch(
      tex2mml('\\pu{123 kJ/mol}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pu{123 kJ/mol}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{123~\\mathrm{kJ}/\\mathrm{mol}}">
           <mn data-latex="23">123</mn>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kJ}">
             <mi data-mjx-auto-op="false" data-latex="kJ">kJ</mi>
           </mrow>
           <mo data-latex="/">/</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{mol}">
             <mi data-mjx-auto-op="false" data-latex="mol">mol</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-97', () => {
    toXmlMatch(
      tex2mml('\\pu{123 kJ//mol}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pu{123 kJ//mol}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{123~\\mathchoice{\\textstyle\\frac{\\mathrm{kJ}}{\\mathrm{mol}}}{\\frac{\\mathrm{kJ}}{\\mathrm{mol}}}{\\frac{\\mathrm{kJ}}{\\mathrm{mol}}}{\\frac{\\mathrm{kJ}}{\\mathrm{mol}}}}">
           <mn data-latex="23">123</mn>
           <mtext data-latex="~">&#xA0;</mtext>
           <mstyle displaystyle="false" data-latex="\\textstyle\\frac{\\mathrm{kJ}}{\\mathrm{mol}}">
             <mfrac data-latex="\\frac{\\mathrm{kJ}}{\\mathrm{mol}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kJ}">
                 <mi data-mjx-auto-op="false" data-latex="kJ">kJ</mi>
               </mrow>
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{mol}">
                 <mi data-mjx-auto-op="false" data-latex="mol">mol</mi>
               </mrow>
             </mfrac>
           </mstyle>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-98', () => {
    toXmlMatch(
      tex2mml('\\pu{123 kJ mol-1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pu{123 kJ mol-1}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{123~\\mathrm{kJ}\\mkern3mu \\mathrm{mol^{-1}}}">
           <mn data-latex="23">123</mn>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kJ}">
             <mi data-mjx-auto-op="false" data-latex="kJ">kJ</mi>
           </mrow>
           <mspace width="0.167em" linebreak="nobreak" data-latex="\\mkern3mu"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{mol^{-1}}">
             <msup data-latex="mol^{-1}">
               <mi data-mjx-auto-op="false" data-latex="ol">mol</mi>
               <mrow data-mjx-texclass="ORD" data-latex="{-1}">
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mrow>
             </msup>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-99', () => {
    toXmlMatch(
      tex2mml('\\pu{123 kJ*mol-1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pu{123 kJ*mol-1}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{123~\\mathrm{kJ}\\mkern1mu{\\cdot}\\mkern1mu \\mathrm{mol^{-1}}}">
           <mn data-latex="23">123</mn>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kJ}">
             <mi data-mjx-auto-op="false" data-latex="kJ">kJ</mi>
           </mrow>
           <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="{\\cdot}">
             <mo data-latex="\\cdot">&#x22C5;</mo>
           </mrow>
           <mspace width="0.056em" linebreak="nobreak" data-latex="\\mkern1mu"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{mol^{-1}}">
             <msup data-latex="mol^{-1}">
               <mi data-mjx-auto-op="false" data-latex="ol">mol</mi>
               <mrow data-mjx-texclass="ORD" data-latex="{-1}">
                 <mo data-latex="-">&#x2212;</mo>
                 <mn data-latex="1">1</mn>
               </mrow>
             </msup>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-100', () => {
    toXmlMatch(
      tex2mml('\\pu{1.2e3 kJ}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pu{1.2e3 kJ}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{1.2\\cdot 10^{3}~\\mathrm{kJ}}">
           <mn data-latex=".2">1.2</mn>
           <mo data-latex="\\cdot">&#x22C5;</mo>
           <msup data-latex="0^{3}">
             <mn data-latex="0">10</mn>
             <mrow data-mjx-texclass="ORD" data-latex="{3}">
               <mn data-latex="3">3</mn>
             </mrow>
           </msup>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kJ}">
             <mi data-mjx-auto-op="false" data-latex="kJ">kJ</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-101', () => {
    toXmlMatch(
      tex2mml('\\pu{1,2e3 kJ}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pu{1,2e3 kJ}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{1{,}2\\cdot 10^{3}~\\mathrm{kJ}}">
           <mn data-latex="1">1</mn>
           <mrow data-mjx-texclass="ORD" data-latex="{,}">
             <mo data-latex=",">,</mo>
           </mrow>
           <mn data-latex="2">2</mn>
           <mo data-latex="\\cdot">&#x22C5;</mo>
           <msup data-latex="0^{3}">
             <mn data-latex="0">10</mn>
             <mrow data-mjx-texclass="ORD" data-latex="{3}">
               <mn data-latex="3">3</mn>
             </mrow>
           </msup>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kJ}">
             <mi data-mjx-auto-op="false" data-latex="kJ">kJ</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-102', () => {
    toXmlMatch(
      tex2mml('\\pu{1.2E3 kJ}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pu{1.2E3 kJ}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{1.2\\times 10^{3}~\\mathrm{kJ}}">
           <mn data-latex=".2">1.2</mn>
           <mo data-latex="\\times">&#xD7;</mo>
           <msup data-latex="0^{3}">
             <mn data-latex="0">10</mn>
             <mrow data-mjx-texclass="ORD" data-latex="{3}">
               <mn data-latex="3">3</mn>
             </mrow>
           </msup>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kJ}">
             <mi data-mjx-auto-op="false" data-latex="kJ">kJ</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-103', () => {
    toXmlMatch(
      tex2mml('\\pu{1,2E3 kJ}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\pu{1,2E3 kJ}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{1{,}2\\times 10^{3}~\\mathrm{kJ}}">
           <mn data-latex="1">1</mn>
           <mrow data-mjx-texclass="ORD" data-latex="{,}">
             <mo data-latex=",">,</mo>
           </mrow>
           <mn data-latex="2">2</mn>
           <mo data-latex="\\times">&#xD7;</mo>
           <msup data-latex="0^{3}">
             <mn data-latex="0">10</mn>
             <mrow data-mjx-texclass="ORD" data-latex="{3}">
               <mn data-latex="3">3</mn>
             </mrow>
           </msup>
           <mtext data-latex="~">&#xA0;</mtext>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kJ}">
             <mi data-mjx-auto-op="false" data-latex="kJ">kJ</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Mhchem-Ams', () => {
  beforeEach(() => setupTex(['base', 'ams', 'mhchem']));

  /********************************************************************************/

  it('Chem-2', () => {
    toXmlMatch(
      tex2mml('\\ce{Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{Hg^2+ -&gt;[I-] HgI2 -&gt;[I-] [Hg^{II}I4]^2-}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Hg}{\\vphantom{A}}^{2+} {}\\mathrel{\\mhchemxrightarrow{\\mathrm{I}{\\vphantom{A}}^{-}}}{} \\mathrm{HgI}{\\vphantom{A}}_{\\smash[t]{2}} {}\\mathrel{\\mhchemxrightarrow{\\mathrm{I}{\\vphantom{A}}^{-}}}{} [\\mathrm{Hg}{\\vphantom{A}}^{\\mathrm{II}}\\mathrm{I}{\\vphantom{A}}_{\\smash[t]{4}}]{\\vphantom{A}}^{2-}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Hg}">
             <mi data-mjx-auto-op="false" data-latex="Hg">Hg</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{2+}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{2+}">
               <mn data-latex="2">2</mn>
               <mo data-latex="+">+</mo>
             </mrow>
           </msup>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxrightarrow{\\mathrm{I}{\\vphantom{A}}^{-}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxrightarrow{\\mathrm{I}{\\vphantom{A}}^{-}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE429;</mo>
                 <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{I}">
                     <mi mathvariant="normal" data-latex="I">I</mi>
                   </mrow>
                   <msup data-latex="{\\vphantom{A}}^{-}">
                     <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                       <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                         <mpadded width="0">
                           <mphantom>
                             <mi data-latex="A">A</mi>
                           </mphantom>
                         </mpadded>
                       </mrow>
                     </mrow>
                     <mrow data-mjx-texclass="ORD" data-latex="{-}">
                       <mo data-latex="-">&#x2212;</mo>
                     </mrow>
                   </msup>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{HgI}">
             <mi data-mjx-auto-op="false" data-latex="HgI">HgI</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxrightarrow{\\mathrm{I}{\\vphantom{A}}^{-}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxrightarrow{\\mathrm{I}{\\vphantom{A}}^{-}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE429;</mo>
                 <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{I}">
                     <mi mathvariant="normal" data-latex="I">I</mi>
                   </mrow>
                   <msup data-latex="{\\vphantom{A}}^{-}">
                     <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                       <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                         <mpadded width="0">
                           <mphantom>
                             <mi data-latex="A">A</mi>
                           </mphantom>
                         </mpadded>
                       </mrow>
                     </mrow>
                     <mrow data-mjx-texclass="ORD" data-latex="{-}">
                       <mo data-latex="-">&#x2212;</mo>
                     </mrow>
                   </msup>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="[" stretchy="false">[</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Hg}">
             <mi data-mjx-auto-op="false" data-latex="Hg">Hg</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{\\mathrm{II}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{II}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{II}">
                 <mi data-mjx-auto-op="false" data-latex="II">II</mi>
               </mrow>
             </mrow>
           </msup>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{I}">
             <mi mathvariant="normal" data-latex="I">I</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex="]" stretchy="false">]</mo>
           <msup data-latex="{\\vphantom{A}}^{2-}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{2-}">
               <mn data-latex="2">2</mn>
               <mo data-latex="-">&#x2212;</mo>
             </mrow>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-30', () => {
    toXmlMatch(
      tex2mml('\\ce{A ->[H2O] B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A -&gt;[H2O] B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemxrightarrow{\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxrightarrow{\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxrightarrow{\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE429;</mo>
                 <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
                     <mi mathvariant="normal" data-latex="H">H</mi>
                   </mrow>
                   <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
                     <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                       <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                         <mpadded width="0">
                           <mphantom>
                             <mi data-latex="A">A</mi>
                           </mphantom>
                         </mpadded>
                       </mrow>
                     </mrow>
                     <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
                       <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                         <mpadded height="0">
                           <mn data-latex="2">2</mn>
                         </mpadded>
                       </mrow>
                     </mrow>
                   </msub>
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
                     <mi mathvariant="normal" data-latex="O">O</mi>
                   </mrow>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-31', () => {
    toXmlMatch(
      tex2mml('\\ce{A ->[{text above}][{text below}] B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A -&gt;[{text above}][{text below}] B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemxrightarrow[{{\\text{text below}}}]{{\\text{text above}}}}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxrightarrow[{{\\text{text below}}}]{{\\text{text above}}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxrightarrow[{{\\text{text below}}}]{{\\text{text above}}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <munderover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE429;</mo>
                 <mpadded width="+0.778em" lspace="0.278em" voffset=".15em" depth="-.15em">
                   <mrow data-mjx-texclass="ORD" data-latex="{{\\text{text below}}}">
                     <mrow data-mjx-texclass="ORD" data-latex="{\\text{text below}}">
                       <mtext data-latex="\\text{text below}">text below</mtext>
                     </mrow>
                   </mrow>
                   <mspace height=".75em"></mspace>
                 </mpadded>
                 <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="{\\text{text above}}">
                     <mtext data-latex="\\text{text above}">text above</mtext>
                   </mrow>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </munderover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-32', () => {
    toXmlMatch(
      tex2mml('\\ce{A ->[$x$][$x_i$] B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A -&gt;[$x$][$x_i$] B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemxrightarrow[{x_i }]{x }}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxrightarrow[{x_i }]{x }}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxrightarrow[{x_i }]{x }">
               <mrow data-mjx-texclass="NONE"></mrow>
               <munderover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE429;</mo>
                 <mpadded width="+0.778em" lspace="0.278em" voffset=".15em" depth="-.15em">
                   <mrow data-mjx-texclass="ORD" data-latex="{x_i }">
                     <msub data-latex="x_i">
                       <mi data-latex="x">x</mi>
                       <mi data-latex="i">i</mi>
                     </msub>
                   </mrow>
                   <mspace height=".75em"></mspace>
                 </mpadded>
                 <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                   <mi data-latex="x ">x</mi>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </munderover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-43', () => {
    toXmlMatch(
      tex2mml('\\ce{x Na(NH4)HPO4 ->[\\Delta] (NaPO3)_x + x NH3 ^ + x H2O}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{x Na(NH4)HPO4 -&gt;[\\Delta] (NaPO3)_x + x NH3 ^ + x H2O}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{x\\,\\mathrm{Na}(\\mathrm{NH}{\\vphantom{A}}_{\\smash[t]{4}})\\mathrm{HPO}{\\vphantom{A}}_{\\smash[t]{4}} {}\\mathrel{\\mhchemxrightarrow{\\mathrm{\\Delta}}}{} (\\mathrm{NaPO}{\\vphantom{A}}_{\\smash[t]{3}}){\\vphantom{A}}_{\\smash[t]{x }} {}+{} x\\,\\mathrm{NH}{\\vphantom{A}}_{\\smash[t]{3}} \\uparrow{}  {}+{} x\\,\\mathrm{H}{\\vphantom{A}}_{\\smash[t]{2}}\\mathrm{O}}">
           <mi data-latex="x">x</mi>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Na}">
             <mi data-mjx-auto-op="false" data-latex="Na">Na</mi>
           </mrow>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{NH}">
             <mi data-mjx-auto-op="false" data-latex="NH">NH</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex=")" stretchy="false">)</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{HPO}">
             <mi data-mjx-auto-op="false" data-latex="HPO">HPO</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                 <mpadded height="0">
                   <mn data-latex="4">4</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxrightarrow{\\mathrm{\\Delta}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxrightarrow{\\mathrm{\\Delta}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE429;</mo>
                 <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{\\Delta}">
                     <mi mathvariant="normal" data-latex="\\Delta">&#x394;</mi>
                   </mrow>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="(" stretchy="false">(</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{NaPO}">
             <mi data-mjx-auto-op="false" data-latex="NaPO">NaPO</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{3}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{3}">
                 <mpadded height="0">
                   <mn data-latex="3">3</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo data-latex=")" stretchy="false">)</mo>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{x }}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{x }}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{x }">
                 <mpadded height="0">
                   <mi data-latex="x ">x</mi>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="+">+</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mi data-latex="x">x</mi>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{NH}">
             <mi data-mjx-auto-op="false" data-latex="NH">NH</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{3}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{3}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{3}">
                 <mpadded height="0">
                   <mn data-latex="3">3</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mo stretchy="false" data-latex="\\uparrow">&#x2191;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mo data-latex="+">+</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mi data-latex="x">x</mi>
           <mspace width="0.167em" data-latex="\\,"></mspace>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{H}">
             <mi mathvariant="normal" data-latex="H">H</mi>
           </mrow>
           <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                 <mpadded height="0">
                   <mn data-latex="2">2</mn>
                 </mpadded>
               </mrow>
             </mrow>
           </msub>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{O}">
             <mi mathvariant="normal" data-latex="O">O</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Chem-91', () => {
    toXmlMatch(
      tex2mml(
        '\\ce{Hg^2+ ->[I-]  $\\underset{\\mathrm{red}}{\\ce{HgI2}}$  ->[I-]  $\\underset{\\mathrm{red}}{\\ce{[Hg^{II}I4]^2-}}$}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{Hg^2+ -&gt;[I-]  $\\underset{\\mathrm{red}}{\\ce{HgI2}}$  -&gt;[I-]  $\\underset{\\mathrm{red}}{\\ce{[Hg^{II}I4]^2-}}$}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{Hg}{\\vphantom{A}}^{2+} {}\\mathrel{\\mhchemxrightarrow{\\mathrm{I}{\\vphantom{A}}^{-}}}{} \\underset{\\mathrm{red}}{\\ce{HgI2}}  {}\\mathrel{\\mhchemxrightarrow{\\mathrm{I}{\\vphantom{A}}^{-}}}{} \\underset{\\mathrm{red}}{\\ce{[Hg^{II}I4]^2-}} }">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Hg}">
             <mi data-mjx-auto-op="false" data-latex="Hg">Hg</mi>
           </mrow>
           <msup data-latex="{\\vphantom{A}}^{2+}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                 <mpadded width="0">
                   <mphantom>
                     <mi data-latex="A">A</mi>
                   </mphantom>
                 </mpadded>
               </mrow>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="{2+}">
               <mn data-latex="2">2</mn>
               <mo data-latex="+">+</mo>
             </mrow>
           </msup>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxrightarrow{\\mathrm{I}{\\vphantom{A}}^{-}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxrightarrow{\\mathrm{I}{\\vphantom{A}}^{-}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE429;</mo>
                 <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{I}">
                     <mi mathvariant="normal" data-latex="I">I</mi>
                   </mrow>
                   <msup data-latex="{\\vphantom{A}}^{-}">
                     <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                       <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                         <mpadded width="0">
                           <mphantom>
                             <mi data-latex="A">A</mi>
                           </mphantom>
                         </mpadded>
                       </mrow>
                     </mrow>
                     <mrow data-mjx-texclass="ORD" data-latex="{-}">
                       <mo data-latex="-">&#x2212;</mo>
                     </mrow>
                   </msup>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <munder data-latex="\\underset{\\mathrm{red}}{\\ce{HgI2}}">
             <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{HgI}{\\vphantom{A}}_{\\smash[t]{2}}}">
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{HgI}">
                 <mi data-mjx-auto-op="false" data-latex="HgI">HgI</mi>
               </mrow>
               <msub data-latex="{\\vphantom{A}}_{\\smash[t]{2}}">
                 <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                     <mpadded width="0">
                       <mphantom>
                         <mi data-latex="A">A</mi>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mrow>
                 <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{2}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{2}">
                     <mpadded height="0">
                       <mn data-latex="2">2</mn>
                     </mpadded>
                   </mrow>
                 </mrow>
               </msub>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{red}">
               <mi data-mjx-auto-op="false" data-latex="red">red</mi>
             </mrow>
           </munder>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxrightarrow{\\mathrm{I}{\\vphantom{A}}^{-}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxrightarrow{\\mathrm{I}{\\vphantom{A}}^{-}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE429;</mo>
                 <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{I}">
                     <mi mathvariant="normal" data-latex="I">I</mi>
                   </mrow>
                   <msup data-latex="{\\vphantom{A}}^{-}">
                     <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                       <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                         <mpadded width="0">
                           <mphantom>
                             <mi data-latex="A">A</mi>
                           </mphantom>
                         </mpadded>
                       </mrow>
                     </mrow>
                     <mrow data-mjx-texclass="ORD" data-latex="{-}">
                       <mo data-latex="-">&#x2212;</mo>
                     </mrow>
                   </msup>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <munder data-latex="\\underset{\\mathrm{red}}{\\ce{[Hg^{II}I4]^2-}}">
             <mrow data-mjx-texclass="ORD" data-latex="{[\\mathrm{Hg}{\\vphantom{A}}^{\\mathrm{II}}\\mathrm{I}{\\vphantom{A}}_{\\smash[t]{4}}]{\\vphantom{A}}^{2-}}">
               <mo data-latex="[" stretchy="false">[</mo>
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{Hg}">
                 <mi data-mjx-auto-op="false" data-latex="Hg">Hg</mi>
               </mrow>
               <msup data-latex="{\\vphantom{A}}^{\\mathrm{II}}">
                 <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                     <mpadded width="0">
                       <mphantom>
                         <mi data-latex="A">A</mi>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mrow>
                 <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{II}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{II}">
                     <mi data-mjx-auto-op="false" data-latex="II">II</mi>
                   </mrow>
                 </mrow>
               </msup>
               <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{I}">
                 <mi mathvariant="normal" data-latex="I">I</mi>
               </mrow>
               <msub data-latex="{\\vphantom{A}}_{\\smash[t]{4}}">
                 <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                     <mpadded width="0">
                       <mphantom>
                         <mi data-latex="A">A</mi>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mrow>
                 <mrow data-mjx-texclass="ORD" data-latex="{\\smash[t]{4}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\smash[t]{4}">
                     <mpadded height="0">
                       <mn data-latex="4">4</mn>
                     </mpadded>
                   </mrow>
                 </mrow>
               </msub>
               <mo data-latex="]" stretchy="false">]</mo>
               <msup data-latex="{\\vphantom{A}}^{2-}">
                 <mrow data-mjx-texclass="ORD" data-latex="{\\vphantom{A}}">
                   <mrow data-mjx-texclass="ORD" data-latex="\\vphantom{A}">
                     <mpadded width="0">
                       <mphantom>
                         <mi data-latex="A">A</mi>
                       </mphantom>
                     </mpadded>
                   </mrow>
                 </mrow>
                 <mrow data-mjx-texclass="ORD" data-latex="{2-}">
                   <mn data-latex="2">2</mn>
                   <mo data-latex="-">&#x2212;</mo>
                 </mrow>
               </msup>
             </mrow>
             <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{red}">
               <mi data-mjx-auto-op="false" data-latex="red">red</mi>
             </mrow>
           </munder>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Mhchem Error', () => {
    expectTexError('\\ce{A\\bond{x}B}')
      .toBe('mhchem bug T. Please report.');
  });

  /********************************************************************************/

  it('Mhchem stretchy <-', () => {
    toXmlMatch(
      tex2mml('\\ce{A <-[text] B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A &lt;-[text] B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemxleftarrow{\\mathrm{text}}}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxleftarrow{\\mathrm{text}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxleftarrow{\\mathrm{text}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE428;</mo>
                 <mpadded width="+0.778em" lspace="0.5em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{text}">
                     <mi data-mjx-auto-op="false" data-latex="text">text</mi>
                   </mrow>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Mhchem stretchy ->', () => {
    toXmlMatch(
      tex2mml('\\ce{A->[text]B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A-&gt;[text]B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemxrightarrow{\\mathrm{text}}}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxrightarrow{\\mathrm{text}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxrightarrow{\\mathrm{text}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE429;</mo>
                 <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{text}">
                     <mi data-mjx-auto-op="false" data-latex="text">text</mi>
                   </mrow>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Mhchem stretchy <->', () => {
    toXmlMatch(
      tex2mml('\\ce{A<->[text]B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A&lt;-&gt;[text]B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemxleftrightarrow{\\mathrm{text}}}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxleftrightarrow{\\mathrm{text}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxleftrightarrow{\\mathrm{text}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE42A;</mo>
                 <mpadded width="+1em" lspace="0.5em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{text}">
                     <mi data-mjx-auto-op="false" data-latex="text">text</mi>
                   </mrow>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Mhchem stretchy <-->', () => {
    toXmlMatch(
      tex2mml('\\ce{A<-->[text]B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A&lt;--&gt;[text]B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemxleftrightarrows{\\mathrm{text}}}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxleftrightarrows{\\mathrm{text}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxleftrightarrows{\\mathrm{text}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE42B;</mo>
                 <mpadded width="+1em" lspace="0.5em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{text}">
                     <mi data-mjx-auto-op="false" data-latex="text">text</mi>
                   </mrow>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Mhchem stretchy <=>', () => {
    toXmlMatch(
      tex2mml('\\ce{A <=>[text] B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A &lt;=&gt;[text] B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemxrightleftharpoons{\\mathrm{text}}}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxrightleftharpoons{\\mathrm{text}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxrightleftharpoons{\\mathrm{text}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE408;</mo>
                 <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{text}">
                     <mi data-mjx-auto-op="false" data-latex="text">text</mi>
                   </mrow>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Mhchem stretchy <=>>', () => {
    toXmlMatch(
      tex2mml('\\ce{A <=>>[text] B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A &lt;=&gt;&gt;[text] B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemxRightleftharpoons{\\mathrm{text}}}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxRightleftharpoons{\\mathrm{text}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxRightleftharpoons{\\mathrm{text}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE409;</mo>
                 <mpadded width="+0.778em" lspace="0.278em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{text}">
                     <mi data-mjx-auto-op="false" data-latex="text">text</mi>
                   </mrow>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Mhchem stretchy <<=>', () => {
    toXmlMatch(
      tex2mml('\\ce{A <<=>[text] B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A &lt;&lt;=&gt;[text] B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A} {}\\mathrel{\\mhchemxLeftrightharpoons{\\mathrm{text}}}{} \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="REL" data-latex="\\mathrel{\\mhchemxLeftrightharpoons{\\mathrm{text}}}">
             <mrow data-mjx-texclass="REL" data-latex="\\mhchemxLeftrightharpoons{\\mathrm{text}}">
               <mrow data-mjx-texclass="NONE"></mrow>
               <mover>
                 <mo data-mjx-texclass="ORD" stretchy="true">&#xE40A;</mo>
                 <mpadded width="+1.111em" lspace="0.5em" voffset="-.2em" height="-.2em">
                   <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{text}">
                     <mi data-mjx-auto-op="false" data-latex="text">text</mi>
                   </mrow>
                   <mspace depth=".2em"></mspace>
                 </mpadded>
               </mover>
             </mrow>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="{}"></mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Mhchem leftrightarrow', () => {
    toXmlMatch(
      tex2mml('\\ce{A\\leftrightarrow B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A\\leftrightarrow B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A}\\mhchemleftrightarrow \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mo data-mjx-variant="-mhchem" data-mjx-texclass="REL" stretchy="true" data-latex="\\mhchemleftrightarrow">&#xE42E;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Mhchem rightleftharpoons', () => {
    toXmlMatch(
      tex2mml('\\ce{A\\rightleftharpoons B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ce{A\\rightleftharpoons B}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\mathrm{A}\\rightleftharpoons \\mathrm{B}}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{A}">
             <mi mathvariant="normal" data-latex="A">A</mi>
           </mrow>
           <mo data-mjx-alternate="1" stretchy="false" data-latex="\\rightleftharpoons">&#x21CC;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{B}">
             <mi mathvariant="normal" data-latex="B">B</mi>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('mhchem'));
