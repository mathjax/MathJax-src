import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/verb/VerbConfiguration';

beforeEach(() => setupTex(['base', 'verb']));

describe('Verb', () => {
  it('Verb Plus ', () =>
    toXmlMatch(
      tex2mml('\\verb+{a}+'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb+{a}+" display="block">
  <mtext mathvariant="monospace" data-latex="\\verb+{a}+">{a}</mtext>
</math>`
    ));
  it('Verb Plus Empty', () =>
    toXmlMatch(
      tex2mml('\\verb ++'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb ++" display="block">
  <mtext mathvariant="monospace" data-latex="\\verb ++"></mtext>
</math>`
    ));
  it('Verb Plus Space', () =>
    toXmlMatch(
      tex2mml('\\verb + +'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb + +" display="block">
  <mtext mathvariant="monospace" data-latex="\\verb + +">&#xA0;</mtext>
</math>`
    ));
  it('Verb Minus', () =>
    toXmlMatch(
      tex2mml('\\verb -{a}-'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb -{a}-" display="block">
  <mtext mathvariant="monospace" data-latex="\\verb -{a}-">{a}</mtext>
</math>`
    ));
  it('Verb Minus Double', () =>
    toXmlMatch(
      tex2mml('\\verb -{a--'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb -{a--" display="block">
  <mtext mathvariant="monospace" data-latex="\\verb -{a-">{a</mtext>
  <mo data-latex="-">&#x2212;</mo>
</math>`
    ));
  it('Verb Error', () =>
    toXmlMatch(
      tex2mml('\\verb{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb{a}" display="block">
  <merror data-mjx-error="Can\'t find closing delimiter for \\verb">
    <mtext>Can\'t find closing delimiter for \\verb</mtext>
  </merror>
</math>`
    ));
  it('Verb Missing Arg', () =>
    toXmlMatch(
      tex2mml('\\verb'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb" display="block">
  <merror data-mjx-error="Missing argument for \\verb">
    <mtext>Missing argument for \\verb</mtext>
  </merror>
</math>`
    ));
});
