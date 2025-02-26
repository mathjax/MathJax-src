import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/colorv2/ColorV2Configuration';

beforeEach(() => setupTex(['base', 'colorv2']));

/**********************************************************************************/
/**********************************************************************************/

describe('ColorV2', () => {

  /********************************************************************************/

  it('Color Open', () => {
    toXmlMatch(
      tex2mml('\\color{red}{ab}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\color{red}{ab}" display="block">
         <mstyle mathcolor="red" data-latex="\\color{red}{ab}">
           <mi data-latex="a">a</mi>
           <mi data-latex="b">b</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  it('Color Enclosed', () => {
    toXmlMatch(
      tex2mml('\\color{red}ab'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\color{red}ab" display="block">
         <mstyle mathcolor="red" data-latex="\\color{red}a">
           <mi data-latex="a">a</mi>
         </mstyle>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Color Frac', () => {
    toXmlMatch(
      tex2mml('\\frac{{\\cal \\color{red}{X}}}{\\color{blue}{\\sf y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\frac{{\\cal \\color{red}{X}}}{\\color{blue}{\\sf y}}" display="block">
         <mfrac data-latex="\\frac{{\\cal \\color{red}{X}}}{\\color{blue}{\\sf y}}">
           <mrow data-mjx-texclass="ORD" data-latex="{\\cal \\color{red}{X}}">
             <mstyle mathcolor="red" data-latex="\\color{red}{X}">
               <mi data-mjx-variant="-tex-calligraphic" mathvariant="script" data-latex="X">X</mi>
             </mstyle>
           </mrow>
           <mstyle mathcolor="blue" data-latex="\\color{blue}{\\sf y}">
             <mi mathvariant="sans-serif" data-latex="\\sf y">y</mi>
           </mstyle>
         </mfrac>
       </math>`
    );
  });

  /********************************************************************************/

  it('Color Nested', () => {
    toXmlMatch(
      tex2mml('\\color{red}{a\\color{blue}{b}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\color{red}{a\\color{blue}{b}c}" display="block">
         <mstyle mathcolor="red" data-latex="\\color{red}{a\\color{blue}{b}c}">
           <mi data-latex="a">a</mi>
           <mstyle mathcolor="blue" data-latex="\\color{blue}{b}">
             <mi data-latex="b">b</mi>
           </mstyle>
           <mi data-latex="c">c</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('colorv2'));
