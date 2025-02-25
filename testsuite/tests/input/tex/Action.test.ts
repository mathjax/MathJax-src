import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/action/ActionConfiguration';

beforeEach(() => setupTex(['base', 'action']));

/**********************************************************************************/
/**********************************************************************************/

describe('Action', () => {

  /********************************************************************************/

  it('TextTip', () => {
    toXmlMatch(
      tex2mml('\\texttip{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\texttip{A}{B}" display="block">
         <maction actiontype="tooltip" data-latex="\\mathtip{A}{\\text{B}}">
      <mi data-latex="A">A</mi>
      <mtext data-latex="\\text{B}">B</mtext>
    </maction>
  </math>`
    );
  });

  /********************************************************************************/

  it('MathTip', () => {
    toXmlMatch(
      tex2mml('\\mathtip{A}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtip{A}{B}" display="block">
         <maction actiontype="tooltip" data-latex="\\mathtip{A}{B}">
           <mi data-latex="A">A</mi>
           <mi data-latex="B">B</mi>
         </maction>
       </math>`
    );
  });

  /********************************************************************************/

  it('Toggle', () => {
    toXmlMatch(
      tex2mml('\\toggle A B C \\endtoggle'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\toggle A B C \\endtoggle" display="block">
         <maction data-latex="\\toggle A B C \\endtoggle">
           <mi data-latex="A">A</mi>
           <mi data-latex="B">B</mi>
           <mi data-latex="C">C</mi>
         </maction>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('action'));
