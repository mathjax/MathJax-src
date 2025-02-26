import { afterAll, beforeEach, describe, test } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/units/UnitsConfiguration';

/**********************************************************************************/
/**********************************************************************************/

describe('Units', () => {

  beforeEach(() => setupTex(['base', 'units']));

  /********************************************************************************/

  test('Unit', () => {
    toXmlMatch(
      tex2mml('\\units{kg}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\units{kg}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kg}">
           <mi data-mjx-auto-op="false" data-latex="kg">kg</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Unit squared', () => {
    toXmlMatch(
      tex2mml('\\units{m^2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\units{m^2}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{m^2}">
           <msup data-latex="m^2 ">
             <mi mathvariant="normal" data-latex="m">m</mi>
             <mn data-latex="2">2</mn>
           </msup>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Unit with value', () => {
    toXmlMatch(
      tex2mml('\\units[2.5]{kg}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\units[2.5]{kg}" display="block">
         <mn data-latex=".5">2.5</mn>
         <mspace width="0.167em" data-latex="\\,"></mspace>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kg}">
           <mi data-mjx-auto-op="false" data-latex="kg">kg</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Unitfrac', () => {
    toXmlMatch(
      tex2mml('\\unitfrac{m}{s}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unitfrac{m}{s}" display="block">
         <mfrac bevelled="true" data-latex="\\nicefrac[\\mathrm]{m}{s}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{m}">
             <mi mathvariant="normal" data-latex="m">m</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{s}">
             <mi mathvariant="normal" data-latex="s">s</mi>
           </mrow>
         </mfrac>
       </math>`
    );
  });

  /********************************************************************************/

  test('Unitfrac with value', () => {
    toXmlMatch(
      tex2mml('\\unitfrac[9.8]{m}{s^2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unitfrac[9.8]{m}{s^2}" display="block">
         <mn data-latex=".8">9.8</mn>
         <mspace width="0.167em" data-latex="\\,"></mspace>
         <mfrac bevelled="true" data-latex="\\nicefrac[\\mathrm]{m}{s^2}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{m}">
             <mi mathvariant="normal" data-latex="m">m</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{s^2}">
             <msup data-latex="s^2 ">
               <mi mathvariant="normal" data-latex="s">s</mi>
               <mn data-latex="2">2</mn>
             </msup>
           </mrow>
         </mfrac>
       </math>`
    );
  });

  /********************************************************************************/

  test('Nicefrac', () => {
    toXmlMatch(
      tex2mml('\\nicefrac{1}{2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\nicefrac{1}{2}" display="block">
         <mfrac bevelled="true" data-latex="\\nicefrac{1}{2}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{1}">
             <mn data-latex="1">1</mn>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{2}">
             <mn data-latex="2">2</mn>
           </mrow>
         </mfrac>
       </math>`
    );
  });

  /********************************************************************************/

  test('Nicefrac with font', () => {
    toXmlMatch(
      tex2mml('\\nicefrac[\\mathsf]{1}{2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\nicefrac[\\mathsf]{1}{2}" display="block">
         <mfrac bevelled="true" data-latex="\\nicefrac[\\mathsf]{1}{2}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathsf{1}">
             <mn mathvariant="sans-serif" data-latex="1">1</mn>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathsf{2}">
             <mn mathvariant="sans-serif" data-latex="2">2</mn>
           </mrow>
         </mfrac>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Units loose ugly', () => {

  beforeEach(() => setupTex(['base', 'units'], {units: {loose: true, ugly: true}}));

  /********************************************************************************/

  test('Unit with value', () => {
    toXmlMatch(
      tex2mml('\\units[5]{kg}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\units[5]{kg}" display="block">
         <mn data-latex="5">5</mn>
         <mtext data-latex="~">&#xA0;</mtext>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kg}">
           <mi data-mjx-auto-op="false" data-latex="kg">kg</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Unitfrac with value', () => {
    toXmlMatch(
      tex2mml('\\unitfrac[3]{ft}{min}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unitfrac[3]{ft}{min}" display="block">
         <mn data-latex="3">3</mn>
         <mtext data-latex="~">&#xA0;</mtext>
         <mfrac data-latex="\\nicefrac[\\mathrm]{ft}{min}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{ft}">
             <mi data-mjx-auto-op="false" data-latex="ft">ft</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{min}">
             <mi data-mjx-auto-op="false" data-latex="min">min</mi>
           </mrow>
         </mfrac>
       </math>`
    );
  });

  /********************************************************************************/

  test('nicefrac', () => {
    toXmlMatch(
      tex2mml('\\nicefrac{1}{2}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\nicefrac{1}{2}" display="block">
         <mfrac data-latex="\\nicefrac{1}{2}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{1}">
             <mn data-latex="1">1</mn>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{2}">
             <mn data-latex="2">2</mn>
           </mrow>
         </mfrac>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('units'));
