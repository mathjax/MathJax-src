import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/boldsymbol/BoldsymbolConfiguration';

beforeEach(() => setupTex(['base', 'boldsymbol']));

describe('Boldsymbol', () => {
  it('Boldsymbol Single', () =>
    toXmlMatch(
      tex2mml('\\boldsymbol{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\boldsymbol{a}" display="block">
  <mi data-latex="\\boldsymbol{a}" mathvariant="bold-italic">a</mi>
</math>`
    ));
  it('Boldsymbol Context', () =>
    toXmlMatch(
      tex2mml('b\\boldsymbol{a}c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="b\\boldsymbol{a}c" display="block">
  <mi data-latex="b">b</mi>
  <mi data-latex="\\boldsymbol{a}" mathvariant="bold-italic">a</mi>
  <mi data-latex="c">c</mi>
</math>`
    ));
  it('Boldsymbol Operator', () =>
    toXmlMatch(
      tex2mml('\\boldsymbol{a+b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\boldsymbol{a+b}" display="block">
  <mi data-latex="a" mathvariant="bold-italic">a</mi>
  <mo data-latex="+" mathvariant="bold">+</mo>
  <mi data-latex="\\boldsymbol{a+b}" mathvariant="bold-italic">b</mi>
</math>`
    ));
  it('Boldsymbol Fraction', () =>
    toXmlMatch(
      tex2mml('\\boldsymbol{\\frac{a}{b}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\boldsymbol{\\frac{a}{b}}" display="block">
  <mfrac data-latex="\\boldsymbol{\\frac{a}{b}}">
    <mi data-latex="a" mathvariant="bold-italic">a</mi>
    <mi data-latex="b" mathvariant="bold-italic">b</mi>
  </mfrac>
</math>`
    ));
  it('Boldsymbol Recursive', () =>
    toXmlMatch(
      tex2mml('\\boldsymbol{a+b\\mbox{ w $c+\\boldsymbol{d+e}$ w } q-} -q'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\boldsymbol{a+b\\mbox{ w $c+\\boldsymbol{d+e}$ w } q-} -q" display="block">
  <mi data-latex="a" mathvariant="bold-italic">a</mi>
  <mo data-latex="+" mathvariant="bold">+</mo>
  <mi data-latex="b" mathvariant="bold-italic">b</mi>
  <mstyle displaystyle="false" data-latex="\\mbox{ w $c+\\boldsymbol{d+e}$ w }">
    <mtext>&#xA0;w&#xA0;</mtext>
    <mrow data-mjx-texclass="ORD">
      <mi data-latex="c">c</mi>
      <mo data-latex="+">+</mo>
      <mi data-latex="d" mathvariant="bold-italic">d</mi>
      <mo data-latex="+" mathvariant="bold">+</mo>
      <mi data-latex="\\boldsymbol{d+e}" mathvariant="bold-italic">e</mi>
    </mrow>
    <mtext>&#xA0;w&#xA0;</mtext>
  </mstyle>
  <mi data-latex="q" mathvariant="bold-italic">q</mi>
  <mo data-latex="\\boldsymbol{a+b\\mbox{ w $c+\\boldsymbol{d+e}$ w } q-}" mathvariant="bold">&#x2212;</mo>
  <mo data-latex="-">&#x2212;</mo>
  <mi data-latex="q">q</mi>
</math>`
    ));
});

afterAll(() => getTokens('boldsymbol'));
