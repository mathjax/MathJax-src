import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/noundefined/NoUndefinedConfiguration';

beforeEach(() => setupTex(['base', 'noundefined']));

/**********************************************************************************/
/**********************************************************************************/

describe('Noundefined', () => {

  /********************************************************************************/

  it('Noundefined Single', () => {
    toXmlMatch(
      tex2mml('\\a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\a" display="block">
         <mtext mathcolor="red" data-latex="\\a">\\a</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Noundefined Context', () => {
    toXmlMatch(
      tex2mml('a\\b c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\b c" display="block">
         <mi data-latex="a">a</mi>
         <mtext mathcolor="red" data-latex="\\b">\\b</mtext>
         <mi data-latex="c">c</mi>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/
