import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/verb/VerbConfiguration';

beforeEach(() => setupTex(['base', 'verb']));

/**********************************************************************************/
/**********************************************************************************/

describe('Verb', () => {

  /********************************************************************************/

  it('Verb Plus ', () => {
    toXmlMatch(
      tex2mml('\\verb+{a}+'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb+{a}+" display="block">
         <mtext mathvariant="monospace" data-latex="\\verb+{a}+">{a}</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Verb Plus Empty', () => {
    toXmlMatch(
      tex2mml('\\verb ++'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb ++" display="block">
         <mtext mathvariant="monospace" data-latex="\\verb ++"></mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Verb Plus Space', () => {
    toXmlMatch(
      tex2mml('\\verb + +'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb + +" display="block">
         <mtext mathvariant="monospace" data-latex="\\verb + +">&#xA0;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Verb Minus', () => {
    toXmlMatch(
      tex2mml('\\verb -{a}-'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb -{a}-" display="block">
         <mtext mathvariant="monospace" data-latex="\\verb -{a}-">{a}</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Verb Minus Double', () => {
    toXmlMatch(
      tex2mml('\\verb -{a--'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb -{a--" display="block">
         <mtext mathvariant="monospace" data-latex="\\verb -{a-">{a</mtext>
         <mo data-latex="-">&#x2212;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('Verb Error', () => {
    expectTexError('\\verb{a}').toBe('Can\'t find closing delimiter for \\verb');
  });

  /********************************************************************************/

  it('Verb Missing Arg', () => {
    expectTexError('\\verb').toBe('Missing argument for \\verb');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('verb'));
