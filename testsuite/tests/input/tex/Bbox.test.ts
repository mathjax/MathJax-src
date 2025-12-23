import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/bbox/BboxConfiguration';

beforeEach(async () => setupTex(['base', 'bbox']));

/**********************************************************************************/
/**********************************************************************************/

describe('Bbox', () => {

  /********************************************************************************/

  it('Bbox-Background', () => {
    toXmlMatch(
      tex2mml('\\bbox[yellow]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[yellow]{a}" display="block">
         <mstyle mathbackground="yellow" data-latex="\\bbox[yellow]{a}">
           <mi data-latex="a">a</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  it('Bbox-Padding', () => {
    toXmlMatch(
      tex2mml('\\bbox[5px]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[5px]{a}" display="block">
         <mpadded height="+5px" depth="+5px" lspace="5px" width="+10px" data-latex="\\bbox[5px]{a}">
           <mi data-latex="a">a</mi>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  it('Bbox-Frame', () => {
    toXmlMatch(
      tex2mml('\\bbox[border:5px solid red]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[border:5px solid red]{a}" display="block">
         <mstyle style="border:5px solid red" data-latex="\\bbox[border:5px solid red]{a}">
           <mi data-latex="a">a</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  it('Bbox-Background-Padding', () => {
    toXmlMatch(
      tex2mml('\\bbox[yellow,5px]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[yellow,5px]{a}" display="block">
         <mstyle mathbackground="yellow" data-latex="\\bbox[yellow,5px]{a}">
           <mpadded height="+5px" depth="+5px" lspace="5px" width="+10px">
             <mi data-latex="a">a</mi>
           </mpadded>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  it('Bbox-Padding-Frame', () => {
    toXmlMatch(
      tex2mml('\\bbox[5px,border:2px solid red]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[5px,border:2px solid red]{a}" display="block">
         <mstyle style="border:2px solid red" data-latex="\\bbox[5px,border:2px solid red]{a}">
           <mpadded height="+5px" depth="+5px" lspace="5px" width="+10px">
             <mi data-latex="a">a</mi>
           </mpadded>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  it('Bbox-Background-Padding-Frame', () => {
    toXmlMatch(
      tex2mml('\\bbox[yellow,5px,border:2px solid red]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[yellow,5px,border:2px solid red]{a}" display="block">
         <mstyle mathbackground="yellow" style="border:2px solid red" data-latex="\\bbox[yellow,5px,border:2px solid red]{a}">
           <mpadded height="+5px" depth="+5px" lspace="5px" width="+10px">
             <mi data-latex="a">a</mi>
           </mpadded>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  it('Bbox-Background-Error', () => {
    expectTexError('\\bbox[yellow,green]{a}')
      .toBe('Background specified twice in \\bbox');
  });

  /********************************************************************************/

  it('Bbox-Padding-Error', () => {
    expectTexError('\\bbox[5px,6px]{a}')
      .toBe('Padding specified twice in \\bbox');
  });

  /********************************************************************************/

  it('Bbox-Frame-Error', () => {
    expectTexError('\\bbox[border:2px solid red,border:2px solid green]{a}')
      .toBe('Style specified twice in \\bbox');
  });

  /********************************************************************************/

  it('Bbox-General-Error', () => {
    expectTexError('\\bbox[22-11=color]{a}')
      .toBe(`'22-11=color' doesn't look like a color, a padding dimension, or a style`);
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('bbox'));
