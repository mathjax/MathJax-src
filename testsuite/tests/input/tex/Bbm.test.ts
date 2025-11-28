import { afterAll, beforeEach, describe, test, expect } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, setupComponents, tex2mml } from '#helpers';
import '#js/input/tex/bbm/BbmConfiguration';

/**********************************************************************************/
/**********************************************************************************/

describe('Bbm', () => {

  beforeEach(() => setupTex(['base', 'bbm']));

  /********************************************************************************/

  test('mathbbm', () => {
    toXmlMatch(
      tex2mml('\\mathbbm{Aa}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbbm{Aa}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbbm{Aa}">
           <mi data-mjx-variant="-bbm-normal" data-latex="Aa">Aa</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathbbmss', () => {
    toXmlMatch(
      tex2mml('\\mathbbmss{Aa}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbbmss{Aa}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbbmss{Aa}">
           <mi data-mjx-variant="-bbm-sans-serif" data-latex="Aa">Aa</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathbbmtt', () => {
    toXmlMatch(
      tex2mml('\\mathbbmtt{Aa}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbbmtt{Aa}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbbmtt{Aa}">
           <mi data-mjx-variant="-bbm-monospace" data-latex="Aa">Aa</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathbbm mathversion', () => {
    toXmlMatch(
      tex2mml('\\mathversion{bold}\\mathbbm{Aa}\\mathversion{normal}\\mathbbm{Aa}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathversion{bold}\\mathbbm{Aa}\\mathversion{normal}\\mathbbm{Aa}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathversion{normal}">
           <mi data-mjx-variant="-bbm-bold" data-latex="Aa">Aa</mi>
         </mrow>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbbm{Aa}">
           <mi data-mjx-variant="-bbm-normal" data-latex="Aa">Aa</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathbbmss mathversion', () => {
    toXmlMatch(
      tex2mml('\\mathversion{bold}\\mathbbmss{Aa}\\mathversion{normal}\\mathbbmss{Aa}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathversion{bold}\\mathbbmss{Aa}\\mathversion{normal}\\mathbbmss{Aa}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathversion{normal}">
           <mi data-mjx-variant="-bbm-sans-serif-bold" data-latex="Aa">Aa</mi>
         </mrow>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbbmss{Aa}">
           <mi data-mjx-variant="-bbm-sans-serif" data-latex="Aa">Aa</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathbbmtt mathversion', () => {
    toXmlMatch(
      tex2mml('\\mathversion{bold}\\mathbbmtt{Aa}\\mathversion{normal}\\mathbbmtt{Aa}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathversion{bold}\\mathbbmtt{Aa}\\mathversion{normal}\\mathbbmtt{Aa}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathversion{normal}">
           <mi data-mjx-variant="-bbm-monospace" data-latex="Aa">Aa</mi>
         </mrow>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbbmtt{Aa}">
           <mi data-mjx-variant="-bbm-monospace" data-latex="Aa">Aa</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Bbm', () => {

  beforeEach(() => setupTex(['base', 'bbm'], {bbm: {bold: true}}));

  /********************************************************************************/

  test('mathbbm', () => {
    toXmlMatch(
      tex2mml('\\mathbbm{Aa}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbbm{Aa}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbbm{Aa}">
           <mi data-mjx-variant="-bbm-bold" data-latex="Aa">Aa</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathbbmss', () => {
    toXmlMatch(
      tex2mml('\\mathbbmss{Aa}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbbmss{Aa}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbbmss{Aa}">
           <mi data-mjx-variant="-bbm-sans-serif-bold" data-latex="Aa">Aa</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('mathbbmtt', () => {
    toXmlMatch(
      tex2mml('\\mathbbmtt{Aa}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbbmtt{Aa}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbbmtt{Aa}">
           <mi data-mjx-variant="-bbm-monospace" data-latex="Aa">Aa</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

declare const MathJax: any;

setupComponents({loader: {load: ['input/tex-base', 'output/chtml']}});

describe('Bbm', () => {

  test('bbm with no output', async() => {
    await expect(MathJax.loader.load('[tex]/bbm').then(() => true)).resolves.toBe(true);
  });
});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('bbm'));
