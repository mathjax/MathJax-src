import { afterAll, beforeEach, describe, test } from '@jest/globals';
import {
  getTokens,
  toXmlMatch,
  setupTex,
  setupTexRender,
  tex2mml,
  render2mml,
  expectTexError
} from '#helpers';
import '#js/input/tex/texhtml/TexHtmlConfiguration';

/**********************************************************************************/
/**********************************************************************************/

describe('Texhtml', () => {

  beforeEach(() => setupTexRender(['base', 'texhtml'], {allowTexHTML: true}));

  /********************************************************************************/

  test('Html', () => {
    toXmlMatch(
      render2mml('x + <tex-html><b>bold</b></tex-html> + y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x + &lt;tex-html&gt;&lt;b&gt;bold&lt;/b&gt;&lt;/tex-html&gt; + y" display="block">
         <mi data-latex="x">x</mi>
         <mo data-latex="+">+</mo>
         <mtext data-latex="&lt;tex-html&gt;&lt;b&gt;bold&lt;/b&gt;&lt;/tex-html&gt;"><b>bold</b></mtext>
         <mo data-latex="+">+</mo>
         <mi data-latex="y">y</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Html multiple', () => {
    toXmlMatch(
      render2mml('x + <tex-html><b>bold</b></tex-html> + <tex-html><i>italic</i></tex-html>y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x + &lt;tex-html&gt;&lt;b&gt;bold&lt;/b&gt;&lt;/tex-html&gt; + &lt;tex-html&gt;&lt;i&gt;italic&lt;/i&gt;&lt;/tex-html&gt;y" display="block">
         <mi data-latex="x">x</mi>
         <mo data-latex="+">+</mo>
         <mtext data-latex="&lt;tex-html&gt;&lt;b&gt;bold&lt;/b&gt;&lt;/tex-html&gt;"><b>bold</b></mtext>
         <mo data-latex="+">+</mo>
         <mtext data-latex="&lt;tex-html&gt;&lt;i&gt;italic&lt;/i&gt;&lt;/tex-html&gt;"><i>italic</i></mtext>
         <mi data-latex="y">y</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Html nested', () => {
    toXmlMatch(
      render2mml('x + <tex-html><b>bold</b> and <tex-html>html</tex-html></tex-html> + y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x + &lt;tex-html n=&quot;2&quot;&gt;&lt;b&gt;bold&lt;/b&gt; and &lt;tex-html&gt;html&lt;/tex-html&gt;&lt;!2&gt;&lt;/tex-html&gt; + y" display="block">
         <mi data-latex="x">x</mi>
         <mo data-latex="+">+</mo>
         <mtext data-latex="&lt;tex-html n=&quot;2&quot;&gt;&lt;b&gt;bold&lt;/b&gt; and &lt;tex-html&gt;html&lt;/tex-html&gt;&lt;!2&gt;&lt;/tex-html&gt;"><div><b>bold</b> and <tex-html>html</tex-html></div></mtext>
         <mo data-latex="+">+</mo>
         <mi data-latex="y">y</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Html empty tag', () => {
    toXmlMatch(
      render2mml('x + <tex-html></tex-html> + y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x + &lt;tex-html&gt;&lt;/tex-html&gt; + y" display="block">
         <mi data-latex="x">x</mi>
         <mo data-latex="&lt;tex-html&gt;&lt;/tex-html&gt;">+</mo>
         <mo data-latex="+">+</mo>
         <mi data-latex="y">y</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Html no tag', () => {
    toXmlMatch(
      render2mml('x < y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x &lt; y" display="block">
         <mi data-latex="x">x</mi>
         <mo data-latex="&lt;">&lt;</mo>
         <mi data-latex="y">y</mi>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Texhtml error', () => {

  beforeEach(() => setupTex(['base', 'texhtml'], {allowTexHTML: true}));

  /********************************************************************************/

  test('Html missing comment tag', () => {
    expectTexError('x + <tex-html n="1"><b>bold</b></tex-html> + y')
      .toBe('Could not find <!1></tex-html> for <tex-html n="1">');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Texhtml not enabled', () => {

  beforeEach(() => setupTex(['base', 'texhtml'], {allowTexHTML: false}));

  /********************************************************************************/

  test('Html not allowed', () => {
    toXmlMatch(
      tex2mml('x + <tex-html><b>a</b></tex-html> + y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x + &lt;tex-html&gt;&lt;b&gt;a&lt;/b&gt;&lt;/tex-html&gt; + y" display="block">
         <mi data-latex="x">x</mi>
         <mo data-latex="+">+</mo>
         <mo data-latex="&lt;">&lt;</mo>
         <mi data-latex="t">t</mi>
         <mi data-latex="e">e</mi>
         <mi data-latex="x">x</mi>
         <mo data-latex="-">&#x2212;</mo>
         <mi data-latex="h">h</mi>
         <mi data-latex="t">t</mi>
         <mi data-latex="m">m</mi>
         <mi data-latex="l">l</mi>
         <mo data-mjx-texclass="REL" data-latex="&gt;&lt;">&gt;&lt;</mo>
         <mi data-latex="b">b</mi>
         <mo data-latex="&gt;">&gt;</mo>
         <mi data-latex="a">a</mi>
         <mo data-latex="&lt;">&lt;</mo>
         <mo data-latex="/">/</mo>
         <mi data-latex="b">b</mi>
         <mo data-mjx-texclass="REL" data-latex="&gt;&lt;">&gt;&lt;</mo>
         <mo data-latex="/">/</mo>
         <mi data-latex="t">t</mi>
         <mi data-latex="e">e</mi>
         <mi data-latex="x">x</mi>
         <mo data-latex="-">&#x2212;</mo>
         <mi data-latex="h">h</mi>
         <mi data-latex="t">t</mi>
         <mi data-latex="m">m</mi>
         <mi data-latex="l">l</mi>
         <mo data-latex="&gt;">&gt;</mo>
         <mo data-latex="+">+</mo>
         <mi data-latex="y">y</mi>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('texhtml'));
