import { afterAll, beforeEach, describe, test } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/gensymb/GensymbConfiguration';

beforeEach(() => setupTex(['base', 'gensymb']));

/**********************************************************************************/
/**********************************************************************************/

describe('Gensymb', () => {

  /********************************************************************************/

  test('ohm', () => {
    toXmlMatch(
      tex2mml('\\ohm'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ohm" display="block">
         <mi mathvariant="normal" class="MathML-Unit" data-latex="\\ohm">&#x2126;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('degree', () => {
    toXmlMatch(
      tex2mml('\\degree'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\degree" display="block">
         <mi mathvariant="normal" class="MathML-Unit" data-latex="\\degree">&#xB0;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('celcius', () => {
    toXmlMatch(
      tex2mml('\\celsius'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\celsius" display="block">
         <mi mathvariant="normal" class="MathML-Unit" data-latex="\\celsius">&#x2103;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('perthousand', () => {
    toXmlMatch(
      tex2mml('\\perthousand'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\perthousand" display="block">
         <mi mathvariant="normal" class="MathML-Unit" data-latex="\\perthousand">&#x2030;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('micro', () => {
    toXmlMatch(
      tex2mml('\\micro'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\micro" display="block">
         <mi mathvariant="normal" class="MathML-Unit" data-latex="\\micro">&#xB5;</mi>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('gensymb'));
