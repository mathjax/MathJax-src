import { afterAll, beforeEach, describe, test } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/dsfont/DsfontConfiguration';

/**********************************************************************************/
/**********************************************************************************/

describe('Dsfont', () => {

  beforeEach(() => setupTex(['base', 'dsfont']));

  /********************************************************************************/

  test('mathds', () => {
    toXmlMatch(
      tex2mml('\\mathds{Aa}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathds{Aa}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathds{Aa}">
           <mi data-mjx-variant="-ds-rm" data-latex="Aa">Aa</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Dsfont sans', () => {

  beforeEach(() => setupTex(['base', 'dsfont'], {dsfont: {sans: true}}));

  /********************************************************************************/

  test('mathds', () => {
    toXmlMatch(
      tex2mml('\\mathds{Aa}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathds{Aa}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathds{Aa}">
           <mi data-mjx-variant="-ds-ss" data-latex="Aa">Aa</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('dsfont'));
