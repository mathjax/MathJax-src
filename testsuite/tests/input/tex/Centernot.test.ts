import { afterAll, beforeEach, describe, test } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/centernot/CenternotConfiguration';

beforeEach(() => setupTex(['base', 'centernot']));

/**********************************************************************************/
/**********************************************************************************/

describe('Centernot', () => {

  /********************************************************************************/

  test('Centernot', () => {
    toXmlMatch(
      tex2mml('\\centernot{\\longrightarrow}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\centernot{\\longrightarrow}" display="block">
         <mrow data-mjx-texclass="REL" data-latex="\\centerOver{\\longrightarrow}{{&#x29F8;}}">
           <mrow data-mjx-texclass="ORD" data-latex="{\\longrightarrow}">
             <mo stretchy="false" data-latex="\\longrightarrow">&#x27F6;</mo>
           </mrow>
           <mpadded width="0" lspace="-.5width">
             <mpadded width="0" lspace="-.5width">
               <mrow data-mjx-texclass="ORD" data-latex="{&#x29F8;}">
                 <mo data-latex="&#x29F8;">&#x29F8;</mo>
               </mrow>
             </mpadded>
             <mphantom>
               <mrow data-mjx-texclass="ORD" data-latex="{\\longrightarrow}">
                 <mo stretchy="false" data-latex="\\longrightarrow">&#x27F6;</mo>
               </mrow>
             </mphantom>
           </mpadded>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Centerover', () => {
    toXmlMatch(
      tex2mml('\\centerOver{\\bigcirc}{1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\centerOver{\\bigcirc}{1}" display="block">
         <mrow data-mjx-texclass="BIN" data-latex="\\centerOver{\\bigcirc}{1}">
           <mrow data-mjx-texclass="ORD" data-latex="{\\bigcirc}">
             <mo data-latex="\\bigcirc">&#x25EF;</mo>
           </mrow>
           <mpadded width="0" lspace="-.5width">
             <mpadded width="0" lspace="-.5width">
               <mn data-latex="1">1</mn>
             </mpadded>
             <mphantom>
               <mrow data-mjx-texclass="ORD" data-latex="{\\bigcirc}">
                 <mo data-latex="\\bigcirc">&#x25EF;</mo>
               </mrow>
             </mphantom>
           </mpadded>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('centernot'));
