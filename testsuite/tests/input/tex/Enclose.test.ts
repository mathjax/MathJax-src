import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/enclose/EncloseConfiguration';

beforeEach(() => setupTex(['base', 'enclose']));

/**********************************************************************************/
/**********************************************************************************/

describe('Enclose', () => {

  /********************************************************************************/

  it('Enclose 1', () => {
    toXmlMatch(
      tex2mml('\\enclose{updiagonalstrike}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\enclose{updiagonalstrike}{x}" display="block">
         <menclose notation="updiagonalstrike" data-latex="\\enclose{updiagonalstrike}{x}">
           <mi data-latex="x">x</mi>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  it('Enclose 2', () => {
    toXmlMatch(
      tex2mml('\\enclose{circle}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\enclose{circle}{x}" display="block">
         <menclose notation="circle" data-latex="\\enclose{circle}{x}">
           <mi data-latex="x">x</mi>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  it('Enclose 3', () => {
    toXmlMatch(
      tex2mml('\\enclose{horizontalstrike}{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\enclose{horizontalstrike}{x}" display="block">
         <menclose notation="horizontalstrike" data-latex="\\enclose{horizontalstrike}{x}">
           <mi data-latex="x">x</mi>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  it('Enclose Attr 2', () => {
    toXmlMatch(
      tex2mml('\\enclose{updiagonalarrow}[mathbackground=red]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\enclose{updiagonalarrow}[mathbackground=red]{x}" display="block">
         <menclose mathbackground="red" notation="updiagonalarrow" data-latex="\\enclose{updiagonalarrow}[mathbackground=red]{x}">
           <mi data-latex="x">x</mi>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  it('Enclose Attr 1', () => {
    toXmlMatch(
      tex2mml('\\enclose{horizontalstrike}[data-thickness=5]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\enclose{horizontalstrike}[data-thickness=5]{x}" display="block">
         <menclose data-thickness="5" notation="horizontalstrike" data-latex="\\enclose{horizontalstrike}[data-thickness=5]{x}">
           <mi data-latex="x">x</mi>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

  it('Enclose Attrs', () => {
    toXmlMatch(
      tex2mml('\\enclose{circle}[data-thickness=10,data-padding=5]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\enclose{circle}[data-thickness=10,data-padding=5]{x}" display="block">
         <menclose data-thickness="10" data-padding="5" notation="circle" data-latex="\\enclose{circle}[data-thickness=10,data-padding=5]{x}">
           <mi data-latex="x">x</mi>
         </menclose>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('enclose'));
