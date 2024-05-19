import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeEach(() => setupTex(['base', 'verb']));

describe('Verb', () => {
  it('Verb Plus ', () =>
    toXmlMatch(
      tex2mml('\\verb+{a}+'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb+{a}+" display="block">\n  <mtext mathvariant="monospace" data-latex="\\verb+{a}+">{a}</mtext>\n</math>'
    ));
  it('Verb Plus Empty', () =>
    toXmlMatch(
      tex2mml('\\verb ++'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb ++" display="block">\n  <mtext mathvariant="monospace" data-latex="\\verb ++"></mtext>\n</math>'
    ));
  it('Verb Plus Space', () =>
    toXmlMatch(
      tex2mml('\\verb + +'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb + +" display="block">\n  <mtext mathvariant="monospace" data-latex="\\verb + +">&#xA0;</mtext>\n</math>'
    ));
  it('Verb Minus', () =>
    toXmlMatch(
      tex2mml('\\verb -{a}-'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb -{a}-" display="block">\n  <mtext mathvariant="monospace" data-latex="\\verb -{a}-">{a}</mtext>\n</math>'
    ));
  it('Verb Minus Double', () =>
    toXmlMatch(
      tex2mml('\\verb -{a--'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb -{a--" display="block">\n  <mtext mathvariant="monospace" data-latex="\\verb -{a-">{a</mtext>\n  <mo data-latex="-">&#x2212;</mo>\n</math>'
    ));
  it('Verb Error', () =>
    toXmlMatch(
      tex2mml('\\verb{a}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb{a}" display="block">\n  <merror data-mjx-error="Can\'t find closing delimiter for \\verb">\n    <mtext>Can\'t find closing delimiter for \\verb</mtext>\n  </merror>\n</math>'
    ));
  it('Verb Missing Arg', () =>
    toXmlMatch(
      tex2mml('\\verb'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\verb" display="block">\n  <merror data-mjx-error="Missing argument for \\verb">\n    <mtext>Missing argument for \\verb</mtext>\n  </merror>\n</math>'
    ));
});
