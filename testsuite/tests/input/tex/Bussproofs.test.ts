import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTexWithOutput, tex2mml } from '#helpers';
import '#js/input/tex/bussproofs/BussproofsConfiguration';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTexWithOutput(['base', 'ams', 'bussproofs']));

/**********************************************************************************/
/**********************************************************************************/

describe('BussproofsRegInf', () => {

  /********************************************************************************/

  it('Single Axiom', () => {
    toXmlMatch(
      tex2mml('\\begin{prooftree}\\AxiomC{A}\\end{prooftree}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\end{prooftree}" display="block">
         <mrow data-latex="\\begin{prooftree}\\AxiomC{A}\\end{prooftree}" semantics="bspr_axiom:true;bspr_proof:true">
           <mspace width=".5ex"></mspace>
           <mstyle displaystyle="false">
             <mtext>A</mtext>
           </mstyle>
           <mspace width=".5ex"></mspace>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unary Inference', () => {
    toXmlMatch(
      tex2mml('\\begin{prooftree}\\AxiomC{A}\\UnaryInfC{B}\\end{prooftree}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\UnaryInfC{B}\\end{prooftree}" display="block">
         <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{A}\\UnaryInfC{B}\\end{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:1;bspr_proof:true">
           <mtr>
             <mtd>
               <mtable framespacing="0 0">
                 <mtr>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>A</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                 </mtr>
               </mtable>
             </mtd>
           </mtr>
           <mtr>
             <mtd>
               <mrow>
                 <mspace width=".5ex"></mspace>
                 <mtext>B</mtext>
                 <mspace width=".5ex"></mspace>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Binary Inference', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\BinaryInfC{C}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\BinaryInfC{C}\\end{prooftree}" display="block">
         <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\BinaryInfC{C}\\end{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:2;bspr_proof:true">
           <mtr>
             <mtd>
               <mtable framespacing="0 0">
                 <mtr>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>A</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>B</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                 </mtr>
               </mtable>
             </mtd>
           </mtr>
           <mtr>
             <mtd>
               <mrow>
                 <mspace width=".5ex"></mspace>
                 <mtext>C</mtext>
                 <mspace width=".5ex"></mspace>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Trinary Inference', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\TrinaryInfC{D}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\TrinaryInfC{D}\\end{prooftree}" display="block">
         <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\TrinaryInfC{D}\\end{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:3;bspr_proof:true">
           <mtr>
             <mtd>
               <mtable framespacing="0 0">
                 <mtr>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>A</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>B</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{C}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>C</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                 </mtr>
               </mtable>
             </mtd>
           </mtr>
           <mtr>
             <mtd>
               <mrow>
                 <mspace width=".5ex"></mspace>
                 <mtext>D</mtext>
                 <mspace width=".5ex"></mspace>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Quaternary Inference', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\QuaternaryInfC{E}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\QuaternaryInfC{E}\\end{prooftree}" display="block">
         <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\QuaternaryInfC{E}\\end{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:4;bspr_proof:true">
           <mtr>
             <mtd>
               <mtable framespacing="0 0">
                 <mtr>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>A</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>B</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{C}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>C</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>D</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                 </mtr>
               </mtable>
             </mtd>
           </mtr>
           <mtr>
             <mtd>
               <mrow>
                 <mspace width=".5ex"></mspace>
                 <mtext>E</mtext>
                 <mspace width=".5ex"></mspace>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Quinary Inference', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\AxiomC{E}\\QuinaryInfC{F}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\AxiomC{E}\\QuinaryInfC{F}\\end{prooftree}" display="block">
         <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\AxiomC{E}\\QuinaryInfC{F}\\end{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:5;bspr_proof:true">
           <mtr>
             <mtd>
               <mtable framespacing="0 0">
                 <mtr>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>A</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>B</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{C}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>C</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>D</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AxiomC{E}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>E</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                 </mtr>
               </mtable>
             </mtd>
           </mtr>
           <mtr>
             <mtd>
               <mrow>
                 <mspace width=".5ex"></mspace>
                 <mtext>F</mtext>
                 <mspace width=".5ex"></mspace>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Label Left', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\UnaryInfC{B}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\UnaryInfC{B}\\end{prooftree}" display="block">
         <mrow data-latex="\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\UnaryInfC{B}\\end{prooftree}" semantics="bspr_labelledRule:left;bspr_inference:1;bspr_proof:true">
           <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
             <mstyle displaystyle="false">
               <mtext>L</mtext>
             </mstyle>
           </mpadded>
           <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
             <mtr>
               <mtd>
                 <mtable framespacing="0 0">
                   <mtr>
                     <mtd rowalign="bottom">
                       <mrow data-latex="\\LeftLabel{L}" semantics="bspr_axiom:true">
                         <mspace width=".5ex"></mspace>
                         <mtext>A</mtext>
                         <mspace width=".5ex"></mspace>
                       </mrow>
                     </mtd>
                   </mtr>
                 </mtable>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mrow>
                   <mspace width=".5ex"></mspace>
                   <mtext>B</mtext>
                   <mspace width=".5ex"></mspace>
                 </mrow>
               </mtd>
             </mtr>
           </mtable>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Label Right', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}" display="block">
         <mrow data-latex="\\begin{prooftree}\\AxiomC{A}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}" semantics="bspr_labelledRule:right;bspr_inference:1;bspr_proof:true">
           <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
             <mtr>
               <mtd>
                 <mtable framespacing="0 0">
                   <mtr>
                     <mtd rowalign="bottom">
                       <mrow data-latex="\\RightLabel{R}" semantics="bspr_axiom:true">
                         <mspace width=".5ex"></mspace>
                         <mtext>A</mtext>
                         <mspace width=".5ex"></mspace>
                       </mrow>
                     </mtd>
                   </mtr>
                 </mtable>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mrow>
                   <mspace width=".5ex"></mspace>
                   <mtext>B</mtext>
                   <mspace width=".5ex"></mspace>
                 </mrow>
               </mtd>
             </mtr>
           </mtable>
           <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
             <mstyle displaystyle="false">
               <mtext>R</mtext>
             </mstyle>
           </mpadded>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Label Both', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}" display="block">
         <mrow data-latex="\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}" semantics="bspr_labelledRule:both;bspr_inference:1;bspr_proof:true">
           <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
             <mstyle displaystyle="false">
               <mtext>L</mtext>
             </mstyle>
           </mpadded>
           <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
             <mtr>
               <mtd>
                 <mtable framespacing="0 0">
                   <mtr>
                     <mtd rowalign="bottom">
                       <mrow data-latex="\\RightLabel{R}" semantics="bspr_axiom:true">
                         <mspace width=".5ex"></mspace>
                         <mtext>A</mtext>
                         <mspace width=".5ex"></mspace>
                       </mrow>
                     </mtd>
                   </mtr>
                 </mtable>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mrow>
                   <mspace width=".5ex"></mspace>
                   <mtext>B</mtext>
                   <mspace width=".5ex"></mspace>
                 </mrow>
               </mtd>
             </mtr>
           </mtable>
           <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
             <mstyle displaystyle="false">
               <mtext>R</mtext>
             </mstyle>
           </mpadded>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Single Axiom Abbr', () => {
    toXmlMatch(
      tex2mml('\\begin{prooftree}\\AXC{A}\\end{prooftree}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\end{prooftree}" display="block">
         <mrow data-latex="\\begin{prooftree}\\AXC{A}\\end{prooftree}" semantics="bspr_axiom:true;bspr_proof:true">
           <mspace width=".5ex"></mspace>
           <mstyle displaystyle="false">
             <mtext>A</mtext>
           </mstyle>
           <mspace width=".5ex"></mspace>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unary Inference Abbr', () => {
    toXmlMatch(
      tex2mml('\\begin{prooftree}\\AXC{A}\\UIC{B}\\end{prooftree}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\UIC{B}\\end{prooftree}" display="block">
         <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AXC{A}\\UIC{B}\\end{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:1;bspr_proof:true">
           <mtr>
             <mtd>
               <mtable framespacing="0 0">
                 <mtr>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AXC{A}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>A</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                 </mtr>
               </mtable>
             </mtd>
           </mtr>
           <mtr>
             <mtd>
               <mrow>
                 <mspace width=".5ex"></mspace>
                 <mtext>B</mtext>
                 <mspace width=".5ex"></mspace>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Binary Inference Abbr', () => {
    toXmlMatch(
      tex2mml('\\begin{prooftree}\\AXC{A}\\AXC{B}\\BIC{C}\\end{prooftree}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\AXC{B}\\BIC{C}\\end{prooftree}" display="block">
         <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AXC{A}\\AXC{B}\\BIC{C}\\end{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:2;bspr_proof:true">
           <mtr>
             <mtd>
               <mtable framespacing="0 0">
                 <mtr>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AXC{A}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>A</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AXC{B}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>B</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                 </mtr>
               </mtable>
             </mtd>
           </mtr>
           <mtr>
             <mtd>
               <mrow>
                 <mspace width=".5ex"></mspace>
                 <mtext>C</mtext>
                 <mspace width=".5ex"></mspace>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Trinary Inference Abbr', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AXC{A}\\AXC{B}\\AXC{C}\\TIC{D}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\AXC{B}\\AXC{C}\\TIC{D}\\end{prooftree}" display="block">
         <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AXC{A}\\AXC{B}\\AXC{C}\\TIC{D}\\end{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:3;bspr_proof:true">
           <mtr>
             <mtd>
               <mtable framespacing="0 0">
                 <mtr>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AXC{A}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>A</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AXC{B}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>B</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                   <mtd></mtd>
                   <mtd rowalign="bottom">
                     <mrow data-latex="\\AXC{C}" semantics="bspr_axiom:true">
                       <mspace width=".5ex"></mspace>
                       <mtext>C</mtext>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                 </mtr>
               </mtable>
             </mtd>
           </mtr>
           <mtr>
             <mtd>
               <mrow>
                 <mspace width=".5ex"></mspace>
                 <mtext>D</mtext>
                 <mspace width=".5ex"></mspace>
               </mrow>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  it('Label Left Abbr', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\UIC{B}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\UIC{B}\\end{prooftree}" display="block">
         <mrow data-latex="\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\UIC{B}\\end{prooftree}" semantics="bspr_labelledRule:left;bspr_inference:1;bspr_proof:true">
           <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
             <mstyle displaystyle="false">
               <mtext>L</mtext>
             </mstyle>
           </mpadded>
           <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
             <mtr>
               <mtd>
                 <mtable framespacing="0 0">
                   <mtr>
                     <mtd rowalign="bottom">
                       <mrow data-latex="\\LeftLabel{L}" semantics="bspr_axiom:true">
                         <mspace width=".5ex"></mspace>
                         <mtext>A</mtext>
                         <mspace width=".5ex"></mspace>
                       </mrow>
                     </mtd>
                   </mtr>
                 </mtable>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mrow>
                   <mspace width=".5ex"></mspace>
                   <mtext>B</mtext>
                   <mspace width=".5ex"></mspace>
                 </mrow>
               </mtd>
             </mtr>
           </mtable>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Label Right Abbr', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AXC{A}\\RightLabel{R}\\UIC{B}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\RightLabel{R}\\UIC{B}\\end{prooftree}" display="block">
         <mrow data-latex="\\begin{prooftree}\\AXC{A}\\RightLabel{R}\\UIC{B}\\end{prooftree}" semantics="bspr_labelledRule:right;bspr_inference:1;bspr_proof:true">
           <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
             <mtr>
               <mtd>
                 <mtable framespacing="0 0">
                   <mtr>
                     <mtd rowalign="bottom">
                       <mrow data-latex="\\RightLabel{R}" semantics="bspr_axiom:true">
                         <mspace width=".5ex"></mspace>
                         <mtext>A</mtext>
                         <mspace width=".5ex"></mspace>
                       </mrow>
                     </mtd>
                   </mtr>
                 </mtable>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mrow>
                   <mspace width=".5ex"></mspace>
                   <mtext>B</mtext>
                   <mspace width=".5ex"></mspace>
                 </mrow>
               </mtd>
             </mtr>
           </mtable>
           <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
             <mstyle displaystyle="false">
               <mtext>R</mtext>
             </mstyle>
           </mpadded>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Label Both Abbr', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\RightLabel{R}\\UIC{B}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\RightLabel{R}\\UIC{B}\\end{prooftree}" display="block">
         <mrow data-latex="\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\RightLabel{R}\\UIC{B}\\end{prooftree}" semantics="bspr_labelledRule:both;bspr_inference:1;bspr_proof:true">
           <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
             <mstyle displaystyle="false">
               <mtext>L</mtext>
             </mstyle>
           </mpadded>
           <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
             <mtr>
               <mtd>
                 <mtable framespacing="0 0">
                   <mtr>
                     <mtd rowalign="bottom">
                       <mrow data-latex="\\RightLabel{R}" semantics="bspr_axiom:true">
                         <mspace width=".5ex"></mspace>
                         <mtext>A</mtext>
                         <mspace width=".5ex"></mspace>
                       </mrow>
                     </mtd>
                   </mtr>
                 </mtable>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mrow>
                   <mspace width=".5ex"></mspace>
                   <mtext>B</mtext>
                   <mspace width=".5ex"></mspace>
                 </mrow>
               </mtd>
             </mtr>
           </mtable>
           <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
             <mstyle displaystyle="false">
               <mtext>R</mtext>
             </mstyle>
           </mpadded>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('BussproofsRegProofs', () => {

  /********************************************************************************/

  it('Simple Proof', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}" display="block">
         <mrow semantics="bspr_inference:2;bspr_proof:true">
           <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}" semantics="bspr_inferenceRule:down">
             <mtr>
               <mtd>
                 <mtable framespacing="0 0">
                   <mtr>
                     <mtd rowalign="bottom">
                       <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                         <mspace width=".5ex"></mspace>
                         <mtext>D</mtext>
                         <mspace width=".5ex"></mspace>
                       </mrow>
                     </mtd>
                     <mtd></mtd>
                     <mtd rowalign="bottom">
                       <mrow semantics="bspr_inference:2">
                         <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{E}" semantics="bspr_inferenceRule:down">
                           <mtr>
                             <mtd>
                               <mtable framespacing="0 0">
                                 <mtr>
                                   <mtd rowalign="bottom">
                                     <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                       <mspace width=".5ex"></mspace>
                                       <mtext>A</mtext>
                                       <mspace width=".5ex"></mspace>
                                     </mrow>
                                   </mtd>
                                   <mtd></mtd>
                                   <mtd rowalign="bottom">
                                     <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}" semantics="bspr_inferenceRule:down;bspr_inference:2">
                                       <mtr>
                                         <mtd>
                                           <mtable framespacing="0 0">
                                             <mtr>
                                               <mtd rowalign="bottom">
                                                 <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                   <mspace width=".5ex"></mspace>
                                                   <mtext>B</mtext>
                                                   <mspace width=".5ex"></mspace>
                                                 </mrow>
                                               </mtd>
                                               <mtd></mtd>
                                               <mtd rowalign="bottom">
                                                 <mrow data-latex="\\AxiomC{R}" semantics="bspr_axiom:true">
                                                   <mspace width=".5ex"></mspace>
                                                   <mtext>R</mtext>
                                                   <mspace width=".5ex"></mspace>
                                                 </mrow>
                                               </mtd>
                                             </mtr>
                                           </mtable>
                                         </mtd>
                                       </mtr>
                                       <mtr>
                                         <mtd>
                                           <mrow>
                                             <mspace width=".5ex"></mspace>
                                             <mrow data-mjx-texclass="ORD">
                                               <mi data-latex="C">C</mi>
                                               <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                               <mi data-latex="D">D</mi>
                                               <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                               <mi data-latex="Q">Q</mi>
                                             </mrow>
                                             <mspace width=".5ex"></mspace>
                                           </mrow>
                                         </mtd>
                                       </mtr>
                                     </mtable>
                                   </mtd>
                                 </mtr>
                               </mtable>
                             </mtd>
                           </mtr>
                           <mtr>
                             <mtd>
                               <mrow>
                                 <mspace width=".5ex"></mspace>
                                 <mtext>E</mtext>
                                 <mspace width=".5ex"></mspace>
                               </mrow>
                             </mtd>
                           </mtr>
                         </mtable>
                         <mspace width="-3.795em"></mspace>
                       </mrow>
                     </mtd>
                   </mtr>
                 </mtable>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mrow>
                   <mspace width=".5ex"></mspace>
                   <mtext>F</mtext>
                   <mspace width=".5ex"></mspace>
                 </mrow>
               </mtd>
             </mtr>
           </mtable>
           <mspace width="3.795em"></mspace>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Simple Proof Noise', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}$\\alpha$\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}$\\alpha$\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}" display="block">
         <mrow data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}$\\alpha$\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}" semantics="bspr_proof:true">
           <mo>$</mo>
           <mi>&#x3B1;</mi>
           <mo>$</mo>
           <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{F}" semantics="bspr_inferenceRule:down;bspr_inference:2">
             <mtr>
               <mtd>
                 <mtable framespacing="0 0">
                   <mtr>
                     <mtd rowalign="bottom">
                       <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                         <mspace width=".5ex"></mspace>
                         <mtext>D</mtext>
                         <mspace width=".5ex"></mspace>
                       </mrow>
                     </mtd>
                     <mtd></mtd>
                     <mtd rowalign="bottom">
                       <mrow semantics="bspr_inference:2">
                         <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{E}" semantics="bspr_inferenceRule:down">
                           <mtr>
                             <mtd>
                               <mtable framespacing="0 0">
                                 <mtr>
                                   <mtd rowalign="bottom">
                                     <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                       <mspace width=".5ex"></mspace>
                                       <mtext>A</mtext>
                                       <mspace width=".5ex"></mspace>
                                     </mrow>
                                   </mtd>
                                   <mtd></mtd>
                                   <mtd rowalign="bottom">
                                     <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}" semantics="bspr_inferenceRule:down;bspr_inference:2">
                                       <mtr>
                                         <mtd>
                                           <mtable framespacing="0 0">
                                             <mtr>
                                               <mtd rowalign="bottom">
                                                 <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                   <mspace width=".5ex"></mspace>
                                                   <mtext>B</mtext>
                                                   <mspace width=".5ex"></mspace>
                                                 </mrow>
                                               </mtd>
                                               <mtd></mtd>
                                               <mtd rowalign="bottom">
                                                 <mrow data-latex="$" semantics="bspr_axiom:true">
                                                   <mspace width=".5ex"></mspace>
                                                   <mtext>R</mtext>
                                                   <mspace width=".5ex"></mspace>
                                                 </mrow>
                                               </mtd>
                                             </mtr>
                                           </mtable>
                                         </mtd>
                                       </mtr>
                                       <mtr>
                                         <mtd>
                                           <mrow>
                                             <mspace width=".5ex"></mspace>
                                             <mrow data-mjx-texclass="ORD">
                                               <mi data-latex="C">C</mi>
                                               <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                               <mi data-latex="D">D</mi>
                                               <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                               <mi data-latex="Q">Q</mi>
                                             </mrow>
                                             <mspace width=".5ex"></mspace>
                                           </mrow>
                                         </mtd>
                                       </mtr>
                                     </mtable>
                                   </mtd>
                                 </mtr>
                               </mtable>
                             </mtd>
                           </mtr>
                           <mtr>
                             <mtd>
                               <mrow>
                                 <mspace width=".5ex"></mspace>
                                 <mtext>E</mtext>
                                 <mspace width=".5ex"></mspace>
                               </mrow>
                             </mtd>
                           </mtr>
                         </mtable>
                         <mspace width="-3.795em"></mspace>
                       </mrow>
                     </mtd>
                   </mtr>
                 </mtable>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mrow>
                   <mspace width=".5ex"></mspace>
                   <mtext>F</mtext>
                   <mspace width=".5ex"></mspace>
                 </mrow>
               </mtd>
             </mtr>
           </mtable>
           <mspace width="3.795em"></mspace>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Simple Proof Large', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\end{prooftree}" display="block">
         <mrow semantics="bspr_inference:2;bspr_proof:true">
           <mspace width="8.227em"></mspace>
           <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\end{prooftree}" semantics="bspr_inferenceRule:down">
             <mtr>
               <mtd>
                 <mtable framespacing="0 0">
                   <mtr>
                     <mtd rowalign="bottom">
                       <mrow semantics="bspr_inference:2">
                         <mspace width="-4.953em"></mspace>
                         <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{F}" semantics="bspr_inferenceRule:down">
                           <mtr>
                             <mtd>
                               <mtable framespacing="0 0">
                                 <mtr>
                                   <mtd rowalign="bottom">
                                     <mrow semantics="bspr_inference:3">
                                       <mspace width="-3.274em"></mspace>
                                       <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\TrinaryInfC{Q}" semantics="bspr_inferenceRule:down">
                                         <mtr>
                                           <mtd>
                                             <mtable framespacing="0 0">
                                               <mtr>
                                                 <mtd rowalign="bottom">
                                                   <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                                                     <mspace width=".5ex"></mspace>
                                                     <mtext>D</mtext>
                                                     <mspace width=".5ex"></mspace>
                                                   </mrow>
                                                 </mtd>
                                                 <mtd></mtd>
                                                 <mtd rowalign="bottom">
                                                   <mrow data-latex="\\AxiomC{A1}" semantics="bspr_axiom:true">
                                                     <mspace width=".5ex"></mspace>
                                                     <mtext>A1</mtext>
                                                     <mspace width=".5ex"></mspace>
                                                   </mrow>
                                                 </mtd>
                                                 <mtd></mtd>
                                                 <mtd rowalign="bottom">
                                                   <mrow data-latex="\\AxiomC{A2}" semantics="bspr_axiom:true">
                                                     <mspace width=".5ex"></mspace>
                                                     <mtext>A2</mtext>
                                                     <mspace width=".5ex"></mspace>
                                                   </mrow>
                                                 </mtd>
                                               </mtr>
                                             </mtable>
                                           </mtd>
                                         </mtr>
                                         <mtr>
                                           <mtd>
                                             <mrow>
                                               <mspace width=".5ex"></mspace>
                                               <mtext>Q</mtext>
                                               <mspace width=".5ex"></mspace>
                                             </mrow>
                                           </mtd>
                                         </mtr>
                                       </mtable>
                                     </mrow>
                                   </mtd>
                                   <mtd></mtd>
                                   <mtd rowalign="bottom">
                                     <mrow semantics="bspr_inference:2">
                                       <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{E}" semantics="bspr_inferenceRule:down">
                                         <mtr>
                                           <mtd>
                                             <mtable framespacing="0 0">
                                               <mtr>
                                                 <mtd rowalign="bottom">
                                                   <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                                     <mspace width=".5ex"></mspace>
                                                     <mtext>A</mtext>
                                                     <mspace width=".5ex"></mspace>
                                                   </mrow>
                                                 </mtd>
                                                 <mtd></mtd>
                                                 <mtd rowalign="bottom">
                                                   <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}" semantics="bspr_inferenceRule:down;bspr_inference:2">
                                                     <mtr>
                                                       <mtd>
                                                         <mtable framespacing="0 0">
                                                           <mtr>
                                                             <mtd rowalign="bottom">
                                                               <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                                 <mspace width=".5ex"></mspace>
                                                                 <mtext>B</mtext>
                                                                 <mspace width=".5ex"></mspace>
                                                               </mrow>
                                                             </mtd>
                                                             <mtd></mtd>
                                                             <mtd rowalign="bottom">
                                                               <mrow data-latex="\\AxiomC{R}" semantics="bspr_axiom:true">
                                                                 <mspace width=".5ex"></mspace>
                                                                 <mtext>R</mtext>
                                                                 <mspace width=".5ex"></mspace>
                                                               </mrow>
                                                             </mtd>
                                                           </mtr>
                                                         </mtable>
                                                       </mtd>
                                                     </mtr>
                                                     <mtr>
                                                       <mtd>
                                                         <mrow>
                                                           <mspace width=".5ex"></mspace>
                                                           <mrow data-mjx-texclass="ORD">
                                                             <mi data-latex="C">C</mi>
                                                             <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                             <mi data-latex="D">D</mi>
                                                             <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                             <mi data-latex="Q">Q</mi>
                                                           </mrow>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                     </mtr>
                                                   </mtable>
                                                 </mtd>
                                               </mtr>
                                             </mtable>
                                           </mtd>
                                         </mtr>
                                         <mtr>
                                           <mtd>
                                             <mrow>
                                               <mspace width=".5ex"></mspace>
                                               <mtext>E</mtext>
                                               <mspace width=".5ex"></mspace>
                                             </mrow>
                                           </mtd>
                                         </mtr>
                                       </mtable>
                                       <mspace width="-3.795em"></mspace>
                                     </mrow>
                                   </mtd>
                                 </mtr>
                               </mtable>
                             </mtd>
                           </mtr>
                           <mtr>
                             <mtd>
                               <mrow>
                                 <mspace width=".5ex"></mspace>
                                 <mtext>F</mtext>
                                 <mspace width=".5ex"></mspace>
                               </mrow>
                             </mtd>
                           </mtr>
                         </mtable>
                       </mrow>
                     </mtd>
                     <mtd>
                       <mspace width="3.795em"></mspace>
                     </mtd>
                     <mtd rowalign="bottom">
                       <mrow data-latex="\\AxiomC{M}" semantics="bspr_axiom:true">
                         <mspace width=".5ex"></mspace>
                         <mtext>M</mtext>
                         <mspace width=".5ex"></mspace>
                       </mrow>
                     </mtd>
                   </mtr>
                 </mtable>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mrow>
                   <mspace width=".5ex"></mspace>
                   <mrow data-mjx-texclass="ORD">
                     <mi data-latex="N">N</mi>
                     <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                     <mi data-latex="R">R</mi>
                   </mrow>
                   <mspace width=".5ex"></mspace>
                 </mrow>
               </mtd>
             </mtr>
           </mtable>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Simple Proofs Right Labels', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\RightLabel{Nowhere}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\RightLabel{Nowhere}\\end{prooftree}" display="block">
         <mrow semantics="bspr_inference:2;bspr_proof:true;bspr_labelledRule:right">
           <mspace width="8.227em"></mspace>
           <mrow data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\RightLabel{Nowhere}\\end{prooftree}">
             <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
               <mtr>
                 <mtd>
                   <mtable framespacing="0 0">
                     <mtr>
                       <mtd rowalign="bottom">
                         <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                           <mspace width="-8.227em"></mspace>
                           <mrow>
                             <mspace width="3.274em"></mspace>
                             <mrow data-latex="\\RightLabel{QERE}">
                               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                 <mtr>
                                   <mtd>
                                     <mtable framespacing="0 0">
                                       <mtr>
                                         <mtd rowalign="bottom">
                                           <mrow semantics="bspr_inference:3">
                                             <mspace width="-3.274em"></mspace>
                                             <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\RightLabel{AAAA}" semantics="bspr_inferenceRule:down">
                                               <mtr>
                                                 <mtd>
                                                   <mtable framespacing="0 0">
                                                     <mtr>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>D</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                       <mtd></mtd>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\AxiomC{A1}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>A1</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                       <mtd></mtd>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\AxiomC{A2}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>A2</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                     </mtr>
                                                   </mtable>
                                                 </mtd>
                                               </mtr>
                                               <mtr>
                                                 <mtd>
                                                   <mrow>
                                                     <mspace width=".5ex"></mspace>
                                                     <mtext>Q</mtext>
                                                     <mspace width=".5ex"></mspace>
                                                   </mrow>
                                                 </mtd>
                                               </mtr>
                                             </mtable>
                                           </mrow>
                                         </mtd>
                                         <mtd></mtd>
                                         <mtd rowalign="bottom">
                                           <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                             <mrow data-latex="\\RightLabel{CCCCC}">
                                               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                 <mtr>
                                                   <mtd>
                                                     <mtable framespacing="0 0">
                                                       <mtr>
                                                         <mtd rowalign="bottom">
                                                           <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                                             <mspace width=".5ex"></mspace>
                                                             <mtext>A</mtext>
                                                             <mspace width=".5ex"></mspace>
                                                           </mrow>
                                                         </mtd>
                                                         <mtd></mtd>
                                                         <mtd rowalign="bottom">
                                                           <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                                             <mrow data-latex="\\RightLabel{BBB}">
                                                               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                                 <mtr>
                                                                   <mtd>
                                                                     <mtable framespacing="0 0">
                                                                       <mtr>
                                                                         <mtd rowalign="bottom">
                                                                           <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                                             <mspace width=".5ex"></mspace>
                                                                             <mtext>B</mtext>
                                                                             <mspace width=".5ex"></mspace>
                                                                           </mrow>
                                                                         </mtd>
                                                                         <mtd></mtd>
                                                                         <mtd rowalign="bottom">
                                                                           <mrow data-latex="\\AxiomC{R}" semantics="bspr_axiom:true">
                                                                             <mspace width=".5ex"></mspace>
                                                                             <mtext>R</mtext>
                                                                             <mspace width=".5ex"></mspace>
                                                                           </mrow>
                                                                         </mtd>
                                                                       </mtr>
                                                                     </mtable>
                                                                   </mtd>
                                                                 </mtr>
                                                                 <mtr>
                                                                   <mtd>
                                                                     <mrow>
                                                                       <mspace width=".5ex"></mspace>
                                                                       <mrow data-mjx-texclass="ORD">
                                                                         <mi data-latex="C">C</mi>
                                                                         <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                         <mi data-latex="D">D</mi>
                                                                         <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                         <mi data-latex="Q">Q</mi>
                                                                       </mrow>
                                                                       <mspace width=".5ex"></mspace>
                                                                     </mrow>
                                                                   </mtd>
                                                                 </mtr>
                                                               </mtable>
                                                               <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                                 <mtext>AAAA</mtext>
                                                               </mpadded>
                                                             </mrow>
                                                             <mspace width="-3.216em"></mspace>
                                                           </mrow>
                                                         </mtd>
                                                       </mtr>
                                                     </mtable>
                                                   </mtd>
                                                 </mtr>
                                                 <mtr>
                                                   <mtd>
                                                     <mrow>
                                                       <mspace width=".5ex"></mspace>
                                                       <mtext>E</mtext>
                                                       <mspace width=".5ex"></mspace>
                                                     </mrow>
                                                   </mtd>
                                                 </mtr>
                                               </mtable>
                                               <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                 <mtext>BBB</mtext>
                                               </mpadded>
                                             </mrow>
                                             <mspace width="-6.134em"></mspace>
                                           </mrow>
                                         </mtd>
                                       </mtr>
                                     </mtable>
                                   </mtd>
                                 </mtr>
                                 <mtr>
                                   <mtd>
                                     <mrow>
                                       <mspace width=".5ex"></mspace>
                                       <mtext>F</mtext>
                                       <mspace width=".5ex"></mspace>
                                     </mrow>
                                   </mtd>
                                 </mtr>
                               </mtable>
                               <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                 <mtext>CCCCC</mtext>
                               </mpadded>
                             </mrow>
                           </mrow>
                         </mrow>
                       </mtd>
                       <mtd>
                         <mspace width="3.185em"></mspace>
                       </mtd>
                       <mtd rowalign="bottom">
                         <mrow data-latex="\\AxiomC{M}" semantics="bspr_axiom:true">
                           <mspace width=".5ex"></mspace>
                           <mtext>M</mtext>
                           <mspace width=".5ex"></mspace>
                         </mrow>
                       </mtd>
                     </mtr>
                   </mtable>
                 </mtd>
               </mtr>
               <mtr>
                 <mtd>
                   <mrow>
                     <mspace width=".5ex"></mspace>
                     <mrow data-mjx-texclass="ORD">
                       <mi data-latex="N">N</mi>
                       <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                       <mi data-latex="R">R</mi>
                     </mrow>
                     <mspace width=".5ex"></mspace>
                   </mrow>
                 </mtd>
               </mtr>
             </mtable>
             <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
               <mstyle displaystyle="false">
                 <mtext>QERE</mtext>
               </mstyle>
             </mpadded>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Simple Proofs Left Labels', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\LeftLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\LeftLabel{QERE}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\LeftLabel{Nowhere}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\LeftLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\LeftLabel{QERE}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\LeftLabel{Nowhere}\\end{prooftree}" display="block">
         <mrow semantics="bspr_inference:2;bspr_proof:true;bspr_labelledRule:left">
           <mspace width="3.835em"></mspace>
           <mrow data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\LeftLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\LeftLabel{QERE}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\LeftLabel{Nowhere}\\end{prooftree}">
             <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
               <mstyle displaystyle="false">
                 <mtext>QERE</mtext>
               </mstyle>
             </mpadded>
             <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
               <mtr>
                 <mtd>
                   <mtable framespacing="0 0">
                     <mtr>
                       <mtd rowalign="bottom">
                         <mrow semantics="bspr_inference:2;bspr_labelledRule:left">
                           <mspace width="-6.927em"></mspace>
                           <mrow>
                             <mspace width="-0.551em"></mspace>
                             <mrow data-latex="\\LeftLabel{QERE}">
                               <mspace width="0.551em"></mspace>
                               <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
                                 <mtext>CCCCC</mtext>
                               </mpadded>
                               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                 <mtr>
                                   <mtd>
                                     <mtable framespacing="0 0">
                                       <mtr>
                                         <mtd rowalign="bottom">
                                           <mrow semantics="bspr_inference:3">
                                             <mspace width="-3.274em"></mspace>
                                             <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\LeftLabel{AAAA}" semantics="bspr_inferenceRule:down">
                                               <mtr>
                                                 <mtd>
                                                   <mtable framespacing="0 0">
                                                     <mtr>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>D</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                       <mtd></mtd>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\AxiomC{A1}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>A1</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                       <mtd></mtd>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\AxiomC{A2}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>A2</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                     </mtr>
                                                   </mtable>
                                                 </mtd>
                                               </mtr>
                                               <mtr>
                                                 <mtd>
                                                   <mrow>
                                                     <mspace width=".5ex"></mspace>
                                                     <mtext>Q</mtext>
                                                     <mspace width=".5ex"></mspace>
                                                   </mrow>
                                                 </mtd>
                                               </mtr>
                                             </mtable>
                                           </mrow>
                                         </mtd>
                                         <mtd></mtd>
                                         <mtd rowalign="bottom">
                                           <mrow semantics="bspr_inference:2;bspr_labelledRule:left">
                                             <mrow data-latex="\\LeftLabel{CCCCC}">
                                               <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
                                                 <mtext>BBB</mtext>
                                               </mpadded>
                                               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                 <mtr>
                                                   <mtd>
                                                     <mtable framespacing="0 0">
                                                       <mtr>
                                                         <mtd rowalign="bottom">
                                                           <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                                             <mspace width=".5ex"></mspace>
                                                             <mtext>A</mtext>
                                                             <mspace width=".5ex"></mspace>
                                                           </mrow>
                                                         </mtd>
                                                         <mtd></mtd>
                                                         <mtd rowalign="bottom">
                                                           <mrow data-latex="\\LeftLabel{BBB}" semantics="bspr_labelledRule:left;bspr_inference:2">
                                                             <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
                                                               <mtext>AAAA</mtext>
                                                             </mpadded>
                                                             <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                               <mtr>
                                                                 <mtd>
                                                                   <mtable framespacing="0 0">
                                                                     <mtr>
                                                                       <mtd rowalign="bottom">
                                                                         <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                                           <mspace width=".5ex"></mspace>
                                                                           <mtext>B</mtext>
                                                                           <mspace width=".5ex"></mspace>
                                                                         </mrow>
                                                                       </mtd>
                                                                       <mtd></mtd>
                                                                       <mtd rowalign="bottom">
                                                                         <mrow data-latex="\\AxiomC{R}" semantics="bspr_axiom:true">
                                                                           <mspace width=".5ex"></mspace>
                                                                           <mtext>R</mtext>
                                                                           <mspace width=".5ex"></mspace>
                                                                         </mrow>
                                                                       </mtd>
                                                                     </mtr>
                                                                   </mtable>
                                                                 </mtd>
                                                               </mtr>
                                                               <mtr>
                                                                 <mtd>
                                                                   <mrow>
                                                                     <mspace width=".5ex"></mspace>
                                                                     <mrow data-mjx-texclass="ORD">
                                                                       <mi data-latex="C">C</mi>
                                                                       <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                       <mi data-latex="D">D</mi>
                                                                       <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                       <mi data-latex="Q">Q</mi>
                                                                     </mrow>
                                                                     <mspace width=".5ex"></mspace>
                                                                   </mrow>
                                                                 </mtd>
                                                               </mtr>
                                                             </mtable>
                                                           </mrow>
                                                         </mtd>
                                                       </mtr>
                                                     </mtable>
                                                   </mtd>
                                                 </mtr>
                                                 <mtr>
                                                   <mtd>
                                                     <mrow>
                                                       <mspace width=".5ex"></mspace>
                                                       <mtext>E</mtext>
                                                       <mspace width=".5ex"></mspace>
                                                     </mrow>
                                                   </mtd>
                                                 </mtr>
                                               </mtable>
                                             </mrow>
                                             <mspace width="-5.403em"></mspace>
                                           </mrow>
                                         </mtd>
                                       </mtr>
                                     </mtable>
                                   </mtd>
                                 </mtr>
                                 <mtr>
                                   <mtd>
                                     <mrow>
                                       <mspace width=".5ex"></mspace>
                                       <mtext>F</mtext>
                                       <mspace width=".5ex"></mspace>
                                     </mrow>
                                   </mtd>
                                 </mtr>
                               </mtable>
                             </mrow>
                           </mrow>
                         </mrow>
                       </mtd>
                       <mtd>
                         <mspace width="5.403em"></mspace>
                       </mtd>
                       <mtd rowalign="bottom">
                         <mrow data-latex="\\AxiomC{M}" semantics="bspr_axiom:true">
                           <mspace width=".5ex"></mspace>
                           <mtext>M</mtext>
                           <mspace width=".5ex"></mspace>
                         </mrow>
                       </mtd>
                     </mtr>
                   </mtable>
                 </mtd>
               </mtr>
               <mtr>
                 <mtd>
                   <mrow>
                     <mspace width=".5ex"></mspace>
                     <mrow data-mjx-texclass="ORD">
                       <mi data-latex="N">N</mi>
                       <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                       <mi data-latex="R">R</mi>
                     </mrow>
                     <mspace width=".5ex"></mspace>
                   </mrow>
                 </mtd>
               </mtr>
             </mtable>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Simple Proofs Mixed Labels', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\LeftLabel{DD}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\LeftLabel{Nowhere}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\LeftLabel{DD}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\LeftLabel{Nowhere}\\end{prooftree}" display="block">
         <mrow semantics="bspr_inference:2;bspr_proof:true;bspr_labelledRule:both">
           <mspace width="4.379em"></mspace>
           <mrow data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\LeftLabel{DD}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\LeftLabel{Nowhere}\\end{prooftree}">
             <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
               <mstyle displaystyle="false">
                 <mtext>DD</mtext>
               </mstyle>
             </mpadded>
             <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
               <mtr>
                 <mtd>
                   <mtable framespacing="0 0">
                     <mtr>
                       <mtd rowalign="bottom">
                         <mrow semantics="bspr_inference:2;bspr_labelledRule:left">
                           <mspace width="-6.123em"></mspace>
                           <mrow>
                             <mspace width="-0.551em"></mspace>
                             <mrow data-latex="\\LeftLabel{DD}">
                               <mspace width="0.551em"></mspace>
                               <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
                                 <mtext>CCCCC</mtext>
                               </mpadded>
                               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                 <mtr>
                                   <mtd>
                                     <mtable framespacing="0 0">
                                       <mtr>
                                         <mtd rowalign="bottom">
                                           <mrow semantics="bspr_inference:3">
                                             <mspace width="-3.274em"></mspace>
                                             <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\RightLabel{AAAA}" semantics="bspr_inferenceRule:down">
                                               <mtr>
                                                 <mtd>
                                                   <mtable framespacing="0 0">
                                                     <mtr>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>D</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                       <mtd></mtd>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\AxiomC{A1}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>A1</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                       <mtd></mtd>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\AxiomC{A2}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>A2</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                     </mtr>
                                                   </mtable>
                                                 </mtd>
                                               </mtr>
                                               <mtr>
                                                 <mtd>
                                                   <mrow>
                                                     <mspace width=".5ex"></mspace>
                                                     <mtext>Q</mtext>
                                                     <mspace width=".5ex"></mspace>
                                                   </mrow>
                                                 </mtd>
                                               </mtr>
                                             </mtable>
                                           </mrow>
                                         </mtd>
                                         <mtd></mtd>
                                         <mtd rowalign="bottom">
                                           <mrow semantics="bspr_inference:2;bspr_labelledRule:left">
                                             <mrow data-latex="\\LeftLabel{CCCCC}">
                                               <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
                                                 <mtext>BBB</mtext>
                                               </mpadded>
                                               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                 <mtr>
                                                   <mtd>
                                                     <mtable framespacing="0 0">
                                                       <mtr>
                                                         <mtd rowalign="bottom">
                                                           <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                                             <mspace width=".5ex"></mspace>
                                                             <mtext>A</mtext>
                                                             <mspace width=".5ex"></mspace>
                                                           </mrow>
                                                         </mtd>
                                                         <mtd></mtd>
                                                         <mtd rowalign="bottom">
                                                           <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                                             <mrow data-latex="\\LeftLabel{BBB}">
                                                               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                                 <mtr>
                                                                   <mtd>
                                                                     <mtable framespacing="0 0">
                                                                       <mtr>
                                                                         <mtd rowalign="bottom">
                                                                           <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                                             <mspace width=".5ex"></mspace>
                                                                             <mtext>B</mtext>
                                                                             <mspace width=".5ex"></mspace>
                                                                           </mrow>
                                                                         </mtd>
                                                                         <mtd></mtd>
                                                                         <mtd rowalign="bottom">
                                                                           <mrow data-latex="\\AxiomC{R}" semantics="bspr_axiom:true">
                                                                             <mspace width=".5ex"></mspace>
                                                                             <mtext>R</mtext>
                                                                             <mspace width=".5ex"></mspace>
                                                                           </mrow>
                                                                         </mtd>
                                                                       </mtr>
                                                                     </mtable>
                                                                   </mtd>
                                                                 </mtr>
                                                                 <mtr>
                                                                   <mtd>
                                                                     <mrow>
                                                                       <mspace width=".5ex"></mspace>
                                                                       <mrow data-mjx-texclass="ORD">
                                                                         <mi data-latex="C">C</mi>
                                                                         <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                         <mi data-latex="D">D</mi>
                                                                         <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                         <mi data-latex="Q">Q</mi>
                                                                       </mrow>
                                                                       <mspace width=".5ex"></mspace>
                                                                     </mrow>
                                                                   </mtd>
                                                                 </mtr>
                                                               </mtable>
                                                               <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                                 <mtext>AAAA</mtext>
                                                               </mpadded>
                                                             </mrow>
                                                             <mspace width="-3.216em"></mspace>
                                                           </mrow>
                                                         </mtd>
                                                       </mtr>
                                                     </mtable>
                                                   </mtd>
                                                 </mtr>
                                                 <mtr>
                                                   <mtd>
                                                     <mrow>
                                                       <mspace width=".5ex"></mspace>
                                                       <mtext>E</mtext>
                                                       <mspace width=".5ex"></mspace>
                                                     </mrow>
                                                   </mtd>
                                                 </mtr>
                                               </mtable>
                                             </mrow>
                                             <mspace width="-3.795em"></mspace>
                                           </mrow>
                                         </mtd>
                                       </mtr>
                                     </mtable>
                                   </mtd>
                                 </mtr>
                                 <mtr>
                                   <mtd>
                                     <mrow>
                                       <mspace width=".5ex"></mspace>
                                       <mtext>F</mtext>
                                       <mspace width=".5ex"></mspace>
                                     </mrow>
                                   </mtd>
                                 </mtr>
                               </mtable>
                             </mrow>
                           </mrow>
                         </mrow>
                       </mtd>
                       <mtd>
                         <mspace width="7.01em"></mspace>
                       </mtd>
                       <mtd rowalign="bottom">
                         <mrow data-latex="\\AxiomC{M}" semantics="bspr_axiom:true">
                           <mspace width=".5ex"></mspace>
                           <mtext>M</mtext>
                           <mspace width=".5ex"></mspace>
                         </mrow>
                       </mtd>
                     </mtr>
                   </mtable>
                 </mtd>
               </mtr>
               <mtr>
                 <mtd>
                   <mrow>
                     <mspace width=".5ex"></mspace>
                     <mrow data-mjx-texclass="ORD">
                       <mi data-latex="N">N</mi>
                       <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                       <mi data-latex="R">R</mi>
                     </mrow>
                     <mspace width=".5ex"></mspace>
                   </mrow>
                 </mtd>
               </mtr>
             </mtable>
             <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
               <mstyle displaystyle="false">
                 <mtext>QERE</mtext>
               </mstyle>
             </mpadded>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Proof Very Right Label', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\RightLabel{AAAA}\\TrinaryInfC{Q}\\RightLabel{Nowhere}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\BinaryInfC{$N \\rightarrow R$}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\RightLabel{AAAA}\\TrinaryInfC{Q}\\RightLabel{Nowhere}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\BinaryInfC{$N \\rightarrow R$}\\end{prooftree}" display="block">
         <mrow semantics="bspr_inference:2;bspr_proof:true">
           <mspace width="9.835em"></mspace>
           <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\RightLabel{AAAA}\\TrinaryInfC{Q}\\RightLabel{Nowhere}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\BinaryInfC{$N \\rightarrow R$}\\end{prooftree}" semantics="bspr_inferenceRule:down">
             <mtr>
               <mtd>
                 <mtable framespacing="0 0">
                   <mtr>
                     <mtd rowalign="bottom">
                       <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                         <mspace width="-9.835em"></mspace>
                         <mrow>
                           <mspace width="3.274em"></mspace>
                           <mrow data-latex="\\RightLabel{QERE}">
                             <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                               <mtr>
                                 <mtd>
                                   <mtable framespacing="0 0">
                                     <mtr>
                                       <mtd rowalign="bottom">
                                         <mrow semantics="bspr_inference:3;bspr_labelledRule:right">
                                           <mspace width="-3.274em"></mspace>
                                           <mrow data-latex="\\RightLabel{Nowhere}">
                                             <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                               <mtr>
                                                 <mtd>
                                                   <mtable framespacing="0 0">
                                                     <mtr>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>D</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                       <mtd></mtd>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\AxiomC{A1}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>A1</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                       <mtd></mtd>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\RightLabel{AAAA}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>A2</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                     </mtr>
                                                   </mtable>
                                                 </mtd>
                                               </mtr>
                                               <mtr>
                                                 <mtd>
                                                   <mrow>
                                                     <mspace width=".5ex"></mspace>
                                                     <mtext>Q</mtext>
                                                     <mspace width=".5ex"></mspace>
                                                   </mrow>
                                                 </mtd>
                                               </mtr>
                                             </mtable>
                                             <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                               <mtext>AAAA</mtext>
                                             </mpadded>
                                           </mrow>
                                         </mrow>
                                       </mtd>
                                       <mtd></mtd>
                                       <mtd rowalign="bottom">
                                         <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                           <mrow data-latex="\\RightLabel{CCCCC}">
                                             <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                               <mtr>
                                                 <mtd>
                                                   <mtable framespacing="0 0">
                                                     <mtr>
                                                       <mtd rowalign="bottom">
                                                         <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>A</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                       <mtd></mtd>
                                                       <mtd rowalign="bottom">
                                                         <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                                           <mrow data-latex="\\RightLabel{BBB}">
                                                             <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                               <mtr>
                                                                 <mtd>
                                                                   <mtable framespacing="0 0">
                                                                     <mtr>
                                                                       <mtd rowalign="bottom">
                                                                         <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                                           <mspace width=".5ex"></mspace>
                                                                           <mtext>B</mtext>
                                                                           <mspace width=".5ex"></mspace>
                                                                         </mrow>
                                                                       </mtd>
                                                                       <mtd></mtd>
                                                                       <mtd rowalign="bottom">
                                                                         <mrow data-latex="\\AxiomC{R}" semantics="bspr_axiom:true">
                                                                           <mspace width=".5ex"></mspace>
                                                                           <mtext>R</mtext>
                                                                           <mspace width=".5ex"></mspace>
                                                                         </mrow>
                                                                       </mtd>
                                                                     </mtr>
                                                                   </mtable>
                                                                 </mtd>
                                                               </mtr>
                                                               <mtr>
                                                                 <mtd>
                                                                   <mrow>
                                                                     <mspace width=".5ex"></mspace>
                                                                     <mrow data-mjx-texclass="ORD">
                                                                       <mi data-latex="C">C</mi>
                                                                       <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                       <mi data-latex="D">D</mi>
                                                                       <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                       <mi data-latex="Q">Q</mi>
                                                                     </mrow>
                                                                     <mspace width=".5ex"></mspace>
                                                                   </mrow>
                                                                 </mtd>
                                                               </mtr>
                                                             </mtable>
                                                             <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                               <mtext>Nowhere</mtext>
                                                             </mpadded>
                                                           </mrow>
                                                           <mspace width="-4.023em"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                     </mtr>
                                                   </mtable>
                                                 </mtd>
                                               </mtr>
                                               <mtr>
                                                 <mtd>
                                                   <mrow>
                                                     <mspace width=".5ex"></mspace>
                                                     <mtext>E</mtext>
                                                     <mspace width=".5ex"></mspace>
                                                   </mrow>
                                                 </mtd>
                                               </mtr>
                                             </mtable>
                                             <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                               <mtext>BBB</mtext>
                                             </mpadded>
                                           </mrow>
                                           <mspace width="-6.135em"></mspace>
                                         </mrow>
                                       </mtd>
                                     </mtr>
                                   </mtable>
                                 </mtd>
                               </mtr>
                               <mtr>
                                 <mtd>
                                   <mrow>
                                     <mspace width=".5ex"></mspace>
                                     <mtext>F</mtext>
                                     <mspace width=".5ex"></mspace>
                                   </mrow>
                                 </mtd>
                               </mtr>
                             </mtable>
                             <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                               <mtext>CCCCC</mtext>
                             </mpadded>
                           </mrow>
                         </mrow>
                       </mrow>
                     </mtd>
                     <mtd>
                       <mspace width="3.993em"></mspace>
                     </mtd>
                     <mtd rowalign="bottom">
                       <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\UnaryInfC{More and more}" semantics="bspr_inferenceRule:down;bspr_inference:1">
                         <mtr>
                           <mtd>
                             <mtable framespacing="0 0">
                               <mtr>
                                 <mtd rowalign="bottom">
                                   <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\UnaryInfC{More and more}" semantics="bspr_inferenceRule:down;bspr_inference:1">
                                     <mtr>
                                       <mtd>
                                         <mtable framespacing="0 0">
                                           <mtr>
                                             <mtd rowalign="bottom">
                                               <mrow semantics="bspr_inference:1;bspr_labelledRule:right">
                                                 <mrow data-latex="\\UnaryInfC{More and more}">
                                                   <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                     <mtr>
                                                       <mtd>
                                                         <mtable framespacing="0 0">
                                                           <mtr>
                                                             <mtd rowalign="bottom">
                                                               <mrow data-latex="\\AxiomC{M}" semantics="bspr_axiom:true">
                                                                 <mspace width=".5ex"></mspace>
                                                                 <mtext>M</mtext>
                                                                 <mspace width=".5ex"></mspace>
                                                               </mrow>
                                                             </mtd>
                                                           </mtr>
                                                         </mtable>
                                                       </mtd>
                                                     </mtr>
                                                     <mtr>
                                                       <mtd>
                                                         <mrow>
                                                           <mspace width=".5ex"></mspace>
                                                           <mtext>More and more</mtext>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                     </mtr>
                                                   </mtable>
                                                   <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                     <mtext>QERE</mtext>
                                                   </mpadded>
                                                 </mrow>
                                                 <mspace width="-3.092em"></mspace>
                                               </mrow>
                                             </mtd>
                                           </mtr>
                                         </mtable>
                                       </mtd>
                                     </mtr>
                                     <mtr>
                                       <mtd>
                                         <mrow>
                                           <mspace width=".5ex"></mspace>
                                           <mtext>More and more</mtext>
                                           <mspace width=".5ex"></mspace>
                                         </mrow>
                                       </mtd>
                                     </mtr>
                                   </mtable>
                                 </mtd>
                               </mtr>
                             </mtable>
                           </mtd>
                         </mtr>
                         <mtr>
                           <mtd>
                             <mrow>
                               <mspace width=".5ex"></mspace>
                               <mtext>More and more</mtext>
                               <mspace width=".5ex"></mspace>
                             </mrow>
                           </mtd>
                         </mtr>
                       </mtable>
                     </mtd>
                   </mtr>
                 </mtable>
               </mtd>
             </mtr>
             <mtr>
               <mtd>
                 <mrow>
                   <mspace width=".5ex"></mspace>
                   <mrow data-mjx-texclass="ORD">
                     <mi data-latex="N">N</mi>
                     <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                     <mi data-latex="R">R</mi>
                   </mrow>
                   <mspace width=".5ex"></mspace>
                 </mrow>
               </mtd>
             </mtr>
           </mtable>
           <mspace width="3.091em"></mspace>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Proof Complex', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AXC{}\\RL{$Hyp^{1}$}\\UIC{$P$}\\AXC{$P\\rightarrow Q$}\\RL{$\\rightarrow_E$}\\solidLine\\BIC{$Q^2$}\\AXC{$Q\\rightarrow R$} \\RL{$\\rightarrow_E$} \\BIC{$R$} \\AXC{$Q$}\\RL{Rit$^2$} \\UIC{$Q$}\\RL{$\\wedge_I$}\\BIC{$Q\\wedge R$}\\RL{${\\rightarrow_I}^1$}\\UIC{$P\\rightarrow Q\\wedge R$}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{}\\RL{$Hyp^{1}$}\\UIC{$P$}\\AXC{$P\\rightarrow Q$}\\RL{$\\rightarrow_E$}\\solidLine\\BIC{$Q^2$}\\AXC{$Q\\rightarrow R$} \\RL{$\\rightarrow_E$} \\BIC{$R$} \\AXC{$Q$}\\RL{Rit$^2$} \\UIC{$Q$}\\RL{$\\wedge_I$}\\BIC{$Q\\wedge R$}\\RL{\${\\rightarrow_I}^1$}\\UIC{$P\\rightarrow Q\\wedge R$}\\end{prooftree}" display="block">
         <mrow semantics="bspr_inference:1;bspr_proof:true;bspr_labelledRule:right">
           <mrow>
             <mspace width="13.25em"></mspace>
             <mrow data-latex="\\begin{prooftree}\\AXC{}\\RL{$Hyp^{1}$}\\UIC{$P$}\\AXC{$P\\rightarrow Q$}\\RL{$\\rightarrow_E$}\\solidLine\\BIC{$Q^2$}\\AXC{$Q\\rightarrow R$} \\RL{$\\rightarrow_E$} \\BIC{$R$} \\AXC{$Q$}\\RL{Rit$^2$} \\UIC{$Q$}\\RL{$\\wedge_I$}\\BIC{$Q\\wedge R$}\\RL{\${\\rightarrow_I}^1$}\\UIC{$P\\rightarrow Q\\wedge R$}\\end{prooftree}">
               <mspace width="-1.155em"></mspace>
               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                 <mtr>
                   <mtd>
                     <mtable framespacing="0 0">
                       <mtr>
                         <mtd rowalign="bottom">
                           <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                             <mrow>
                               <mspace width="-13.25em"></mspace>
                               <mrow>
                                 <mspace width="9.111em"></mspace>
                                 <mrow data-latex="\\RL{\${\\rightarrow_I}^1$}">
                                   <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                     <mtr>
                                       <mtd>
                                         <mtable framespacing="0 0">
                                           <mtr>
                                             <mtd rowalign="bottom">
                                               <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                                 <mspace width="-9.111em"></mspace>
                                                 <mrow>
                                                   <mspace width="3.592em"></mspace>
                                                   <mrow data-latex="\\BIC{$R$}">
                                                     <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                       <mtr>
                                                         <mtd>
                                                           <mtable framespacing="0 0">
                                                             <mtr>
                                                               <mtd rowalign="bottom">
                                                                 <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                                                   <mspace width="-3.592em"></mspace>
                                                                   <mrow data-latex="\\BIC{$Q^2$}">
                                                                     <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                                       <mtr>
                                                                         <mtd>
                                                                           <mtable framespacing="0 0">
                                                                             <mtr>
                                                                               <mtd rowalign="bottom">
                                                                                 <mrow data-latex="\\UIC{$P$}" semantics="bspr_labelledRule:right;bspr_inference:0">
                                                                                   <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                                                     <mtr>
                                                                                       <mtd>
                                                                                         <mtable framespacing="0 0">
                                                                                           <mtr>
                                                                                             <mtd rowalign="bottom">
                                                                                               <mrow data-latex="\\RL{$Hyp^{1}$}" semantics="bspr_axiom:true"></mrow>
                                                                                             </mtd>
                                                                                           </mtr>
                                                                                         </mtable>
                                                                                       </mtd>
                                                                                     </mtr>
                                                                                     <mtr>
                                                                                       <mtd>
                                                                                         <mrow>
                                                                                           <mspace width=".5ex"></mspace>
                                                                                           <mrow data-mjx-texclass="ORD">
                                                                                             <mi data-latex="P">P</mi>
                                                                                           </mrow>
                                                                                           <mspace width=".5ex"></mspace>
                                                                                         </mrow>
                                                                                       </mtd>
                                                                                     </mtr>
                                                                                   </mtable>
                                                                                   <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                                                     <mrow data-mjx-texclass="ORD">
                                                                                       <mi data-latex="H">H</mi>
                                                                                       <mi data-latex="y">y</mi>
                                                                                       <msup data-latex="p^{1}">
                                                                                         <mi data-latex="p">p</mi>
                                                                                         <mrow data-mjx-texclass="ORD" data-latex="{1}">
                                                                                           <mn data-latex="1">1</mn>
                                                                                         </mrow>
                                                                                       </msup>
                                                                                     </mrow>
                                                                                   </mpadded>
                                                                                 </mrow>
                                                                               </mtd>
                                                                               <mtd></mtd>
                                                                               <mtd rowalign="bottom">
                                                                                 <mrow data-latex="\\solidLine" semantics="bspr_axiom:true">
                                                                                   <mspace width=".5ex"></mspace>
                                                                                   <mrow data-mjx-texclass="ORD">
                                                                                     <mi data-latex="P">P</mi>
                                                                                     <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                                     <mi data-latex="Q">Q</mi>
                                                                                   </mrow>
                                                                                   <mspace width=".5ex"></mspace>
                                                                                 </mrow>
                                                                               </mtd>
                                                                             </mtr>
                                                                           </mtable>
                                                                         </mtd>
                                                                       </mtr>
                                                                       <mtr>
                                                                         <mtd>
                                                                           <mrow>
                                                                             <mspace width=".5ex"></mspace>
                                                                             <mrow data-mjx-texclass="ORD">
                                                                               <msup data-latex="Q^2">
                                                                                 <mi data-latex="Q">Q</mi>
                                                                                 <mn data-latex="2">2</mn>
                                                                               </msup>
                                                                             </mrow>
                                                                             <mspace width=".5ex"></mspace>
                                                                           </mrow>
                                                                         </mtd>
                                                                       </mtr>
                                                                     </mtable>
                                                                     <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                                       <mrow data-mjx-texclass="ORD">
                                                                         <msub data-latex="\\rightarrow_E">
                                                                           <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                           <mi data-latex="E">E</mi>
                                                                         </msub>
                                                                       </mrow>
                                                                     </mpadded>
                                                                   </mrow>
                                                                 </mrow>
                                                               </mtd>
                                                               <mtd></mtd>
                                                               <mtd rowalign="bottom">
                                                                 <mrow data-latex="\\RL{$\\rightarrow_E$}" semantics="bspr_axiom:true">
                                                                   <mspace width=".5ex"></mspace>
                                                                   <mrow data-mjx-texclass="ORD">
                                                                     <mi data-latex="Q">Q</mi>
                                                                     <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                     <mi data-latex="R">R</mi>
                                                                   </mrow>
                                                                   <mspace width=".5ex"></mspace>
                                                                 </mrow>
                                                               </mtd>
                                                             </mtr>
                                                           </mtable>
                                                         </mtd>
                                                       </mtr>
                                                       <mtr>
                                                         <mtd>
                                                           <mrow>
                                                             <mspace width=".5ex"></mspace>
                                                             <mrow data-mjx-texclass="ORD">
                                                               <mi data-latex="R">R</mi>
                                                             </mrow>
                                                             <mspace width=".5ex"></mspace>
                                                           </mrow>
                                                         </mtd>
                                                       </mtr>
                                                     </mtable>
                                                     <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                       <mrow data-mjx-texclass="ORD">
                                                         <msub data-latex="\\rightarrow_E">
                                                           <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                           <mi data-latex="E">E</mi>
                                                         </msub>
                                                       </mrow>
                                                     </mpadded>
                                                   </mrow>
                                                 </mrow>
                                               </mrow>
                                             </mtd>
                                             <mtd></mtd>
                                             <mtd rowalign="bottom">
                                               <mrow semantics="bspr_inference:1;bspr_labelledRule:right">
                                                 <mrow data-latex="\\RL{$\\wedge_I$}">
                                                   <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                     <mtr>
                                                       <mtd>
                                                         <mtable framespacing="0 0">
                                                           <mtr>
                                                             <mtd rowalign="bottom">
                                                               <mrow data-latex="\\RL{Rit$^2$}" semantics="bspr_axiom:true">
                                                                 <mspace width=".5ex"></mspace>
                                                                 <mrow data-mjx-texclass="ORD">
                                                                   <mi data-latex="Q">Q</mi>
                                                                 </mrow>
                                                                 <mspace width=".5ex"></mspace>
                                                               </mrow>
                                                             </mtd>
                                                           </mtr>
                                                         </mtable>
                                                       </mtd>
                                                     </mtr>
                                                     <mtr>
                                                       <mtd>
                                                         <mrow>
                                                           <mspace width=".5ex"></mspace>
                                                           <mrow data-mjx-texclass="ORD">
                                                             <mi data-latex="Q">Q</mi>
                                                           </mrow>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                     </mtr>
                                                   </mtable>
                                                   <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                     <mstyle>
                                                       <mtext>Rit</mtext>
                                                       <mrow data-mjx-texclass="ORD">
                                                         <msup data-latex="^2">
                                                           <mi></mi>
                                                           <mn data-latex="2">2</mn>
                                                         </msup>
                                                       </mrow>
                                                     </mstyle>
                                                   </mpadded>
                                                 </mrow>
                                                 <mspace width="-2.055em"></mspace>
                                               </mrow>
                                             </mtd>
                                           </mtr>
                                         </mtable>
                                       </mtd>
                                     </mtr>
                                     <mtr>
                                       <mtd>
                                         <mrow>
                                           <mspace width=".5ex"></mspace>
                                           <mrow data-mjx-texclass="ORD">
                                             <mi data-latex="Q">Q</mi>
                                             <mo data-latex="\\wedge">&#x2227;</mo>
                                             <mi data-latex="R">R</mi>
                                           </mrow>
                                           <mspace width=".5ex"></mspace>
                                         </mrow>
                                       </mtd>
                                     </mtr>
                                   </mtable>
                                   <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                     <mrow data-mjx-texclass="ORD">
                                       <msub data-latex="\\wedge_I">
                                         <mo data-latex="\\wedge">&#x2227;</mo>
                                         <mi data-latex="I">I</mi>
                                       </msub>
                                     </mrow>
                                   </mpadded>
                                 </mrow>
                               </mrow>
                             </mrow>
                             <mspace width="-5.456em"></mspace>
                           </mrow>
                         </mtd>
                       </mtr>
                     </mtable>
                   </mtd>
                 </mtr>
                 <mtr>
                   <mtd>
                     <mrow>
                       <mspace width=".5ex"></mspace>
                       <mrow data-mjx-texclass="ORD">
                         <mi data-latex="P">P</mi>
                         <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                         <mi data-latex="Q">Q</mi>
                         <mo data-latex="\\wedge">&#x2227;</mo>
                         <mi data-latex="R">R</mi>
                       </mrow>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                 </mtr>
               </mtable>
               <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                 <mstyle displaystyle="false">
                   <mrow data-mjx-texclass="ORD">
                     <msup data-latex="{\\rightarrow_I}^1">
                       <mrow data-mjx-texclass="ORD" data-latex="{\\rightarrow_I}">
                         <msub data-latex="\\rightarrow_I">
                           <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                           <mi data-latex="I">I</mi>
                         </msub>
                       </mrow>
                       <mn data-latex="1">1</mn>
                     </msup>
                   </mrow>
                 </mstyle>
               </mpadded>
             </mrow>
           </mrow>
           <mspace width="2.953em"></mspace>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Proof Mixing Order', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\alwaysRootAtTop\\AXC{}\\RL{$Hyp^{1}$}\\UIC{$P$}\\AXC{$P\\rightarrow Q$}\\RL{$\\rightarrow_E$}\\solidLine\\BIC{$Q^2$}\\alwaysRootAtBottom\\AXC{$Q\\rightarrow R$} \\RL{$\\rightarrow_E$} \\BIC{$R$} \\AXC{$Q$}\\RL{Rit$^2$} \\UIC{$Q$}\\RL{$\\wedge_I$}\\BIC{$Q\\wedge R$}\\RL{\${\\rightarrow_I}^1$}\\UIC{$P\\rightarrow Q\\wedge R$}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\alwaysRootAtTop\\AXC{}\\RL{$Hyp^{1}$}\\UIC{$P$}\\AXC{$P\\rightarrow Q$}\\RL{$\\rightarrow_E$}\\solidLine\\BIC{$Q^2$}\\alwaysRootAtBottom\\AXC{$Q\\rightarrow R$} \\RL{$\\rightarrow_E$} \\BIC{$R$} \\AXC{$Q$}\\RL{Rit$^2$} \\UIC{$Q$}\\RL{$\\wedge_I$}\\BIC{$Q\\wedge R$}\\RL{\${\\rightarrow_I}^1$}\\UIC{$P\\rightarrow Q\\wedge R$}\\end{prooftree}" display="block">
         <mrow semantics="bspr_inference:1;bspr_proof:true;bspr_labelledRule:right">
           <mrow>
             <mspace width="13.25em"></mspace>
             <mrow data-latex="\\begin{prooftree}\\alwaysRootAtTop\\AXC{}\\RL{$Hyp^{1}$}\\UIC{$P$}\\AXC{$P\\rightarrow Q$}\\RL{$\\rightarrow_E$}\\solidLine\\BIC{$Q^2$}\\alwaysRootAtBottom\\AXC{$Q\\rightarrow R$} \\RL{$\\rightarrow_E$} \\BIC{$R$} \\AXC{$Q$}\\RL{Rit$^2$} \\UIC{$Q$}\\RL{$\\wedge_I$}\\BIC{$Q\\wedge R$}\\RL{\${\\rightarrow_I}^1$}\\UIC{$P\\rightarrow Q\\wedge R$}\\end{prooftree}">
               <mspace width="-1.155em"></mspace>
               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                 <mtr>
                   <mtd>
                     <mtable framespacing="0 0">
                       <mtr>
                         <mtd rowalign="bottom">
                           <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                             <mrow>
                               <mspace width="-13.25em"></mspace>
                               <mrow>
                                 <mspace width="9.111em"></mspace>
                                 <mrow data-latex="\\RL{\${\\rightarrow_I}^1$}">
                                   <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                     <mtr>
                                       <mtd>
                                         <mtable framespacing="0 0">
                                           <mtr>
                                             <mtd rowalign="bottom">
                                               <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                                 <mspace width="-9.111em"></mspace>
                                                 <mrow>
                                                   <mspace width="3.592em"></mspace>
                                                   <mrow data-latex="\\BIC{$R$}">
                                                     <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                       <mtr>
                                                         <mtd>
                                                           <mtable framespacing="0 0">
                                                             <mtr>
                                                               <mtd rowalign="bottom">
                                                                 <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                                                   <mspace width="-3.592em"></mspace>
                                                                   <mrow data-latex="\\alwaysRootAtBottom">
                                                                     <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:up">
                                                                       <mtr>
                                                                         <mtd>
                                                                           <mrow>
                                                                             <mspace width=".5ex"></mspace>
                                                                             <mrow data-mjx-texclass="ORD">
                                                                               <msup data-latex="Q^2">
                                                                                 <mi data-latex="Q">Q</mi>
                                                                                 <mn data-latex="2">2</mn>
                                                                               </msup>
                                                                             </mrow>
                                                                             <mspace width=".5ex"></mspace>
                                                                           </mrow>
                                                                         </mtd>
                                                                       </mtr>
                                                                       <mtr>
                                                                         <mtd>
                                                                           <mtable framespacing="0 0">
                                                                             <mtr>
                                                                               <mtd rowalign="top">
                                                                                 <mrow data-latex="\\UIC{$P$}" semantics="bspr_labelledRule:right;bspr_inference:0">
                                                                                   <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:up">
                                                                                     <mtr>
                                                                                       <mtd>
                                                                                         <mrow>
                                                                                           <mspace width=".5ex"></mspace>
                                                                                           <mrow data-mjx-texclass="ORD">
                                                                                             <mi data-latex="P">P</mi>
                                                                                           </mrow>
                                                                                           <mspace width=".5ex"></mspace>
                                                                                         </mrow>
                                                                                       </mtd>
                                                                                     </mtr>
                                                                                     <mtr>
                                                                                       <mtd>
                                                                                         <mtable framespacing="0 0">
                                                                                           <mtr>
                                                                                             <mtd rowalign="top">
                                                                                               <mrow data-latex="\\RL{$Hyp^{1}$}" semantics="bspr_axiom:true"></mrow>
                                                                                             </mtd>
                                                                                           </mtr>
                                                                                         </mtable>
                                                                                       </mtd>
                                                                                     </mtr>
                                                                                   </mtable>
                                                                                   <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                                                     <mrow data-mjx-texclass="ORD">
                                                                                       <mi data-latex="H">H</mi>
                                                                                       <mi data-latex="y">y</mi>
                                                                                       <msup data-latex="p^{1}">
                                                                                         <mi data-latex="p">p</mi>
                                                                                         <mrow data-mjx-texclass="ORD" data-latex="{1}">
                                                                                           <mn data-latex="1">1</mn>
                                                                                         </mrow>
                                                                                       </msup>
                                                                                     </mrow>
                                                                                   </mpadded>
                                                                                 </mrow>
                                                                               </mtd>
                                                                               <mtd></mtd>
                                                                               <mtd rowalign="top">
                                                                                 <mrow data-latex="\\solidLine" semantics="bspr_axiom:true">
                                                                                   <mspace width=".5ex"></mspace>
                                                                                   <mrow data-mjx-texclass="ORD">
                                                                                     <mi data-latex="P">P</mi>
                                                                                     <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                                     <mi data-latex="Q">Q</mi>
                                                                                   </mrow>
                                                                                   <mspace width=".5ex"></mspace>
                                                                                 </mrow>
                                                                               </mtd>
                                                                             </mtr>
                                                                           </mtable>
                                                                         </mtd>
                                                                       </mtr>
                                                                     </mtable>
                                                                     <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                                       <mrow data-mjx-texclass="ORD">
                                                                         <msub data-latex="\\rightarrow_E">
                                                                           <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                           <mi data-latex="E">E</mi>
                                                                         </msub>
                                                                       </mrow>
                                                                     </mpadded>
                                                                   </mrow>
                                                                 </mrow>
                                                               </mtd>
                                                               <mtd></mtd>
                                                               <mtd rowalign="bottom">
                                                                 <mrow data-latex="\\RL{$\\rightarrow_E$}" semantics="bspr_axiom:true">
                                                                   <mspace width=".5ex"></mspace>
                                                                   <mrow data-mjx-texclass="ORD">
                                                                     <mi data-latex="Q">Q</mi>
                                                                     <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                     <mi data-latex="R">R</mi>
                                                                   </mrow>
                                                                   <mspace width=".5ex"></mspace>
                                                                 </mrow>
                                                               </mtd>
                                                             </mtr>
                                                           </mtable>
                                                         </mtd>
                                                       </mtr>
                                                       <mtr>
                                                         <mtd>
                                                           <mrow>
                                                             <mspace width=".5ex"></mspace>
                                                             <mrow data-mjx-texclass="ORD">
                                                               <mi data-latex="R">R</mi>
                                                             </mrow>
                                                             <mspace width=".5ex"></mspace>
                                                           </mrow>
                                                         </mtd>
                                                       </mtr>
                                                     </mtable>
                                                     <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                       <mrow data-mjx-texclass="ORD">
                                                         <msub data-latex="\\rightarrow_E">
                                                           <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                           <mi data-latex="E">E</mi>
                                                         </msub>
                                                       </mrow>
                                                     </mpadded>
                                                   </mrow>
                                                 </mrow>
                                               </mrow>
                                             </mtd>
                                             <mtd></mtd>
                                             <mtd rowalign="bottom">
                                               <mrow semantics="bspr_inference:1;bspr_labelledRule:right">
                                                 <mrow data-latex="\\RL{$\\wedge_I$}">
                                                   <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                     <mtr>
                                                       <mtd>
                                                         <mtable framespacing="0 0">
                                                           <mtr>
                                                             <mtd rowalign="bottom">
                                                               <mrow data-latex="\\RL{Rit$^2$}" semantics="bspr_axiom:true">
                                                                 <mspace width=".5ex"></mspace>
                                                                 <mrow data-mjx-texclass="ORD">
                                                                   <mi data-latex="Q">Q</mi>
                                                                 </mrow>
                                                                 <mspace width=".5ex"></mspace>
                                                               </mrow>
                                                             </mtd>
                                                           </mtr>
                                                         </mtable>
                                                       </mtd>
                                                     </mtr>
                                                     <mtr>
                                                       <mtd>
                                                         <mrow>
                                                           <mspace width=".5ex"></mspace>
                                                           <mrow data-mjx-texclass="ORD">
                                                             <mi data-latex="Q">Q</mi>
                                                           </mrow>
                                                           <mspace width=".5ex"></mspace>
                                                         </mrow>
                                                       </mtd>
                                                     </mtr>
                                                   </mtable>
                                                   <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                     <mstyle>
                                                       <mtext>Rit</mtext>
                                                       <mrow data-mjx-texclass="ORD">
                                                         <msup data-latex="^2">
                                                           <mi></mi>
                                                           <mn data-latex="2">2</mn>
                                                         </msup>
                                                       </mrow>
                                                     </mstyle>
                                                   </mpadded>
                                                 </mrow>
                                                 <mspace width="-2.055em"></mspace>
                                               </mrow>
                                             </mtd>
                                           </mtr>
                                         </mtable>
                                       </mtd>
                                     </mtr>
                                     <mtr>
                                       <mtd>
                                         <mrow>
                                           <mspace width=".5ex"></mspace>
                                           <mrow data-mjx-texclass="ORD">
                                             <mi data-latex="Q">Q</mi>
                                             <mo data-latex="\\wedge">&#x2227;</mo>
                                             <mi data-latex="R">R</mi>
                                           </mrow>
                                           <mspace width=".5ex"></mspace>
                                         </mrow>
                                       </mtd>
                                     </mtr>
                                   </mtable>
                                   <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                     <mrow data-mjx-texclass="ORD">
                                       <msub data-latex="\\wedge_I">
                                         <mo data-latex="\\wedge">&#x2227;</mo>
                                         <mi data-latex="I">I</mi>
                                       </msub>
                                     </mrow>
                                   </mpadded>
                                 </mrow>
                               </mrow>
                             </mrow>
                             <mspace width="-5.456em"></mspace>
                           </mrow>
                         </mtd>
                       </mtr>
                     </mtable>
                   </mtd>
                 </mtr>
                 <mtr>
                   <mtd>
                     <mrow>
                       <mspace width=".5ex"></mspace>
                       <mrow data-mjx-texclass="ORD">
                         <mi data-latex="P">P</mi>
                         <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                         <mi data-latex="Q">Q</mi>
                         <mo data-latex="\\wedge">&#x2227;</mo>
                         <mi data-latex="R">R</mi>
                       </mrow>
                       <mspace width=".5ex"></mspace>
                     </mrow>
                   </mtd>
                 </mtr>
               </mtable>
               <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                 <mstyle displaystyle="false">
                   <mrow data-mjx-texclass="ORD">
                     <msup data-latex="{\\rightarrow_I}^1">
                       <mrow data-mjx-texclass="ORD" data-latex="{\\rightarrow_I}">
                         <msub data-latex="\\rightarrow_I">
                           <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                           <mi data-latex="I">I</mi>
                         </msub>
                       </mrow>
                       <mn data-latex="1">1</mn>
                     </msup>
                   </mrow>
                 </mstyle>
               </mpadded>
             </mrow>
           </mrow>
           <mspace width="2.953em"></mspace>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Extreme', () => {
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\LL{HHHHH}\\RL{11111111111111111}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\LL{qqqq}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBBB}\\RightLabel{MMM}\\BinaryInfC{E}\\RightLabel{CCCCC}\\LL{WWW}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\LL{BBB}\\BinaryInfC{$N \\rightarrow R$}\\RightLabel{Nowhere}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\LL{HHHHH}\\RL{11111111111111111}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\LL{qqqq}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\LeftLabel{BBBB}\\RightLabel{MMM}\\BinaryInfC{E}\\RightLabel{CCCCC}\\LL{WWW}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\LL{BBB}\\BinaryInfC{\$N \\rightarrow R\$}\\RightLabel{Nowhere}\\end{prooftree}" display="block">
         <mrow semantics="bspr_inference:2;bspr_proof:true;bspr_labelledRule:both">
           <mspace width="16.317em"></mspace>
           <mrow data-latex="\\begin{prooftree}\\LL{HHHHH}\\RL{11111111111111111}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\LL{qqqq}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\LeftLabel{BBBB}\\RightLabel{MMM}\\BinaryInfC{E}\\RightLabel{CCCCC}\\LL{WWW}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\LL{BBB}\\BinaryInfC{\$N \\rightarrow R\$}\\RightLabel{Nowhere}\\end{prooftree}">
             <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
               <mstyle displaystyle="false">
                 <mtext>BBB</mtext>
               </mstyle>
             </mpadded>
             <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
               <mtr>
                 <mtd>
                   <mtable framespacing="0 0">
                     <mtr>
                       <mtd rowalign="bottom">
                         <mrow semantics="bspr_inference:2;bspr_labelledRule:both">
                           <mspace width="-18.656em"></mspace>
                           <mrow>
                             <mspace width="3.94em"></mspace>
                             <mrow data-latex="\\RightLabel{QERE}">
                               <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
                                 <mtext>WWW</mtext>
                               </mpadded>
                               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                 <mtr>
                                   <mtd>
                                     <mtable framespacing="0 0">
                                       <mtr>
                                         <mtd rowalign="bottom">
                                           <mrow semantics="bspr_inference:3;bspr_labelledRule:both">
                                             <mspace width="-7.239em"></mspace>
                                             <mrow data-latex="\\RightLabel{AAAA}">
                                               <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
                                                 <mtext>HHHHH</mtext>
                                               </mpadded>
                                               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                 <mtr>
                                                   <mtd>
                                                     <mtable framespacing="0 0">
                                                       <mtr>
                                                         <mtd rowalign="bottom">
                                                           <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                                                             <mspace width=".5ex"></mspace>
                                                             <mtext>D</mtext>
                                                             <mspace width=".5ex"></mspace>
                                                           </mrow>
                                                         </mtd>
                                                         <mtd></mtd>
                                                         <mtd rowalign="bottom">
                                                           <mrow data-latex="\\AxiomC{A1}" semantics="bspr_axiom:true">
                                                             <mspace width=".5ex"></mspace>
                                                             <mtext>A1</mtext>
                                                             <mspace width=".5ex"></mspace>
                                                           </mrow>
                                                         </mtd>
                                                         <mtd></mtd>
                                                         <mtd rowalign="bottom">
                                                           <mrow data-latex="\\AxiomC{A2}" semantics="bspr_axiom:true">
                                                             <mspace width=".5ex"></mspace>
                                                             <mtext>A2</mtext>
                                                             <mspace width=".5ex"></mspace>
                                                           </mrow>
                                                         </mtd>
                                                       </mtr>
                                                     </mtable>
                                                   </mtd>
                                                 </mtr>
                                                 <mtr>
                                                   <mtd>
                                                     <mrow>
                                                       <mspace width=".5ex"></mspace>
                                                       <mtext>Q</mtext>
                                                       <mspace width=".5ex"></mspace>
                                                     </mrow>
                                                   </mtd>
                                                 </mtr>
                                               </mtable>
                                               <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                 <mtext>11111111111111111</mtext>
                                               </mpadded>
                                             </mrow>
                                           </mrow>
                                         </mtd>
                                         <mtd></mtd>
                                         <mtd rowalign="bottom">
                                           <mrow semantics="bspr_inference:2;bspr_labelledRule:both">
                                             <mrow data-latex="\\LL{WWW}">
                                               <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
                                                 <mtext>BBBB</mtext>
                                               </mpadded>
                                               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                 <mtr>
                                                   <mtd>
                                                     <mtable framespacing="0 0">
                                                       <mtr>
                                                         <mtd rowalign="bottom">
                                                           <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                                             <mspace width=".5ex"></mspace>
                                                             <mtext>A</mtext>
                                                             <mspace width=".5ex"></mspace>
                                                           </mrow>
                                                         </mtd>
                                                         <mtd></mtd>
                                                         <mtd rowalign="bottom">
                                                           <mrow semantics="bspr_inference:2;bspr_labelledRule:both">
                                                             <mrow data-latex="\\RightLabel{MMM}">
                                                               <mpadded height=".25em" depth="+.25em" width="+.5ex" voffset="-.25em" semantics="bspr_prooflabel:left">
                                                                 <mtext>qqqq</mtext>
                                                               </mpadded>
                                                               <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                                 <mtr>
                                                                   <mtd>
                                                                     <mtable framespacing="0 0">
                                                                       <mtr>
                                                                         <mtd rowalign="bottom">
                                                                           <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                                             <mspace width=".5ex"></mspace>
                                                                             <mtext>B</mtext>
                                                                             <mspace width=".5ex"></mspace>
                                                                           </mrow>
                                                                         </mtd>
                                                                         <mtd></mtd>
                                                                         <mtd rowalign="bottom">
                                                                           <mrow data-latex="\\LL{qqqq}" semantics="bspr_axiom:true">
                                                                             <mspace width=".5ex"></mspace>
                                                                             <mtext>R</mtext>
                                                                             <mspace width=".5ex"></mspace>
                                                                           </mrow>
                                                                         </mtd>
                                                                       </mtr>
                                                                     </mtable>
                                                                   </mtd>
                                                                 </mtr>
                                                                 <mtr>
                                                                   <mtd>
                                                                     <mrow>
                                                                       <mspace width=".5ex"></mspace>
                                                                       <mrow data-mjx-texclass="ORD">
                                                                         <mi data-latex="C">C</mi>
                                                                         <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                         <mi data-latex="D">D</mi>
                                                                         <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                         <mi data-latex="Q">Q</mi>
                                                                       </mrow>
                                                                       <mspace width=".5ex"></mspace>
                                                                     </mrow>
                                                                   </mtd>
                                                                 </mtr>
                                                               </mtable>
                                                               <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                                 <mtext>AAAA</mtext>
                                                               </mpadded>
                                                             </mrow>
                                                             <mspace width="-3.216em"></mspace>
                                                           </mrow>
                                                         </mtd>
                                                       </mtr>
                                                     </mtable>
                                                   </mtd>
                                                 </mtr>
                                                 <mtr>
                                                   <mtd>
                                                     <mrow>
                                                       <mspace width=".5ex"></mspace>
                                                       <mtext>E</mtext>
                                                       <mspace width=".5ex"></mspace>
                                                     </mrow>
                                                   </mtd>
                                                 </mtr>
                                               </mtable>
                                               <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                                 <mtext>MMM</mtext>
                                               </mpadded>
                                             </mrow>
                                             <mspace width="-7.925em"></mspace>
                                           </mrow>
                                         </mtd>
                                       </mtr>
                                     </mtable>
                                   </mtd>
                                 </mtr>
                                 <mtr>
                                   <mtd>
                                     <mrow>
                                       <mspace width=".5ex"></mspace>
                                       <mtext>F</mtext>
                                       <mspace width=".5ex"></mspace>
                                     </mrow>
                                   </mtd>
                                 </mtr>
                               </mtable>
                               <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
                                 <mtext>CCCCC</mtext>
                               </mpadded>
                             </mrow>
                           </mrow>
                         </mrow>
                       </mtd>
                       <mtd>
                         <mspace width="4.349em"></mspace>
                       </mtd>
                       <mtd rowalign="bottom">
                         <mrow data-latex="\\LL{BBB}" semantics="bspr_axiom:true">
                           <mspace width=".5ex"></mspace>
                           <mtext>M</mtext>
                           <mspace width=".5ex"></mspace>
                         </mrow>
                       </mtd>
                     </mtr>
                   </mtable>
                 </mtd>
               </mtr>
               <mtr>
                 <mtd>
                   <mrow>
                     <mspace width=".5ex"></mspace>
                     <mrow data-mjx-texclass="ORD">
                       <mi data-latex="N">N</mi>
                       <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                       <mi data-latex="R">R</mi>
                     </mrow>
                     <mspace width=".5ex"></mspace>
                   </mrow>
                 </mtd>
               </mtr>
             </mtable>
             <mpadded height="-.25em" depth="+.25em" width="+.5ex" voffset="-.25em" lspace=".5ex" semantics="bspr_prooflabel:right">
               <mstyle displaystyle="false">
                 <mtext>QERE</mtext>
               </mstyle>
             </mpadded>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('bussproofs'));
