import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/cancel/CancelConfiguration';

beforeEach(() => setupTex(['base', 'cancel']));

/**********************************************************************************/
/**********************************************************************************/

describe('Cancel', () => {

  /********************************************************************************/

  it('Cancel', () => {
    toXmlMatch(
      tex2mml('\\cancel{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cancel{x}" display="block">
         <menclose notation="updiagonalstrike" data-latex="\\cancel{x}">
           <mi data-latex="x">x</mi>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  it('BCancel', () => {
    toXmlMatch(
      tex2mml('\\bcancel{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bcancel{x}" display="block">
         <menclose notation="downdiagonalstrike" data-latex="\\bcancel{x}">
           <mi data-latex="x">x</mi>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  it('XCancel', () => {
    toXmlMatch(
      tex2mml('\\xcancel{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\xcancel{x}" display="block">
         <menclose notation="updiagonalstrike downdiagonalstrike" data-latex="\\xcancel{x}">
           <mi data-latex="x">x</mi>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  it('CancelTo', () => {
    toXmlMatch(
      tex2mml('\\cancelto{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cancelto{x}{y}" display="block">
         <msup data-latex="\\cancelto{x}{y}">
           <menclose notation="updiagonalstrike updiagonalarrow northeastarrow">
             <mi data-latex="y">y</mi>
           </menclose>
           <mpadded depth="-.1em" height="+.1em" voffset=".1em">
             <mi data-latex="x">x</mi>
           </mpadded>
         </msup>
       </math>`
    );
  });

  /********************************************************************************/

  it('Cancel Attr', () => {
    toXmlMatch(
      tex2mml('\\cancel[color=red]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cancel[color=red]{x}" display="block">
         <menclose color="red" notation="updiagonalstrike" data-latex="\\cancel[color=red]{x}">
           <mi data-latex="x">x</mi>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  it('Cancel Attrs', () => {
    toXmlMatch(
      tex2mml('\\cancel[mathcolor=green,mathbackground=yellow]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cancel[mathcolor=green,mathbackground=yellow]{x}" display="block">
         <menclose mathcolor="green" mathbackground="yellow" notation="updiagonalstrike" data-latex="\\cancel[mathcolor=green,mathbackground=yellow]{x}">
           <mi data-latex="x">x</mi>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  it('Cancel Attr Not Allowed', () => {
    toXmlMatch(
      tex2mml('\\cancel[nothing=green]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cancel[nothing=green]{x}" display="block">
         <menclose notation="updiagonalstrike" data-latex="\\cancel[nothing=green]{x}">
           <mi data-latex="x">x</mi>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  it('CancelTo Attrs', () => {
    toXmlMatch(
      tex2mml('\\cancelto[data-padding=5,data-arrowhead=15]{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\cancelto[data-padding=5,data-arrowhead=15]{x}{y}" display="block">
         <msup data-latex="\\cancelto[data-padding=5,data-arrowhead=15]{x}{y}">
           <menclose data-padding="5" data-arrowhead="15" notation="updiagonalstrike updiagonalarrow northeastarrow">
             <mi data-latex="y">y</mi>
           </menclose>
           <mpadded depth="-.1em" height="+.1em" voffset=".1em">
             <mi data-latex="x">x</mi>
           </mpadded>
         </msup>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('cancel'));
