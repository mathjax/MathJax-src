import { createRequire } from 'node:module';
import { beforeAll, describe, expect, test } from '@jest/globals';
import { mathjax } from '#js/mathjax.js';
import { MathML } from '#js/input/mathml.js';
import { RegisterHTMLHandler } from '#js/handlers/html.js';
import { liteAdaptor } from '#js/adaptors/liteAdaptor.js';
import { Mml3Handler } from '#js/input/mathml/mml3/mml3.js';
import { SerializedMmlVisitor } from '#js/core/MmlTree/SerializedMmlVisitor.js';

/**
 * Tests for the MathML3 elementary math support (mstack, mlongdiv, etc.),
 * which is implemented via an XSLT transform run as a MathML pre-filter.
 */

const adaptor = liteAdaptor();
Mml3Handler(RegisterHTMLHandler(adaptor));
const visitor = new SerializedMmlVisitor();

/**
 * @param {string} mml  The MathML to run through the MML3 transform
 * @returns {string}    The serialized internal MathML after the transform
 */
function mml3(mml: string): string {
  const doc = mathjax.document(`<html><body>${mml}</body></html>`, {
    InputJax: new MathML(),
  }) as any;
  doc.findMath().compile();
  return visitor.visitTree(Array.from(doc.math as any[])[0].root);
}

beforeAll(() => {
  //
  // The node version of the MML3 transform uses eval('require') to load
  // Saxon-JS, but require is not available in ESM modules, so provide it.
  //
  (globalThis as any).require = createRequire(import.meta.url);
});

describe('Mml3', () => {
  test('Example 1', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mstack>
    <mn>496</mn>
    <msrow>
      <mo>+</mo>
      <none/>
      <mn>28</mn>
    </msrow>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 2', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mstack>
    <mscarries location="nw">
      <none/>
      <mscarry crossout="updiagonalstrike" location="n">
        <mn>2</mn>
      </mscarry>
      <mn>1</mn>
      <none/>
    </mscarries>
    <mn>2,327</mn>
    <msrow>
      <mo>-</mo>
      <mn> 1,156</mn>
    </msrow>
    <msline/>
    <mn>1,171</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 3', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mstack charspacing="loose">
    <mscarries position="1">
      <mn>1</mn>
    </mscarries>
    <mscarries position="1">
      <mn>1</mn>
      <mn>3</mn>
    </mscarries>
    <mn>435</mn>
    <msrow>
      <mo>&#xD7;</mo>
      <none/>
      <mn>25</mn>
    </msrow>
    <msline/>
    <mscarries position="2">
      <mn>1</mn>
    </mscarries>
    <mn>2185</mn>
    <msrow position="1"><mn>874</mn></msrow>
    <msline/>
    <mn>10925</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 4', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mlongdiv>
    <mn> 12 </mn>
    <mn> 16.5 </mn>
    <mn> 198 </mn>
    <msgroup position='1' shift='-1'>
      <msgroup>
        <mn> 12 </mn>
        <msline length='2'/>
      </msgroup>
      <msgroup>
        <mn> 78 </mn>
        <mn> 72 </mn>
        <msline length='2'/>
        <mn> 6.0 </mn>
        <mn> 6.0 </mn>
      </msgroup>
      <msgroup position='-1'>
        <!-- extra shift to move to the right of the "." -->
        <msline length='3'/>
        <mn> 0 </mn>
      </msgroup>
    </msgroup>
  </mlongdiv>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 5', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" decimalpoint=",">
  <mlongdiv longdivstyle='stackedrightright'>
    <mn> 12 </mn>
    <mn> 16,5 </mn>
    <mn> 198 </mn>
    <msgroup position='1' shift='-1'>
      <msgroup>
        <mn> 12 </mn>
        <msline length='2'/>
      </msgroup>
      <msgroup>
        <mn> 78 </mn>
        <mn> 72 </mn>
        <msline length='2'/>
        <mn> 6,0 </mn>
        <mn> 6,0 </mn>
      </msgroup>
      <msgroup position='-1'>
        <!-- extra shift to move to the right of the "," -->
        <msline length='3'/>
        <mn> 0 </mn>
      </msgroup>
    </msgroup>
  </mlongdiv>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 6', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mstack stackalign="right">
    <msline length="6"/>
    <mn> 0.4047619 </mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 7', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mstack stackalign="right">
    <msrow>
      <mo>.</mo>
      <none/><none/><none/><none/>
      <mo>.</mo>
    </msrow>
    <mn> 0.4047619 </mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 8', () => {
    expect(
      mml3(`
<math display="block">
  <mstack>
    <msgroup>
      <mn>123</mn>
      <msrow><mo>&#xD7;</mo><mn>321</mn></msrow>
      </msgroup><msline/>
      <msgroup shift='1'>
        <mn>123</mn>
        <mn>246</mn>
        <mn>369</mn>
      </msgroup>
      <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 9', () => {
    expect(
      mml3(`
<math display="block">
  <mstack>
    <mscarries crossout='updiagonalstrike'><mn>2</mn><mn>12</mn><none/></mscarries>
    <mn>2,327</mn>
    <msrow><mo>-</mo><mn>1,156</mn></msrow>
    <msline/>
    <mn>1,171</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 10', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>424</mn>
    <msrow>
      <mo>+</mo>
      <none/>
      <mn>33</mn>
    </msrow>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 11', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn> 
    <msrow>
      <mn>456</mn>
      <mo>+</mo>
    </msrow>
    <msline/>
    <mn>579</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 12', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries crossout='updiagonalstrike'>
      <mn>2</mn>  <mn>12</mn>  <mscarry crossout='none'>
      <none/>
    </mscarry>
    </mscarries>
    <mn>2,327</mn>
    <msrow>
      <mo>-</mo>
      <mn> 1,156</mn>
    </msrow>
    <msline/>
    <mn>1,171</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 13', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='nw'>
      <none/>
      <mscarry crossout='updiagonalstrike' location='n'>
        <mn>2</mn>
      </mscarry>
      <mn>1</mn>
      <none/>
    </mscarries>
    <mn>2,327</mn>
    <msrow>
      <mo>-</mo>
      <mn> 1,156</mn>
    </msrow>
    <msline/>
    <mn>1,171</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 14', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries>
      <mscarry crossout='updiagonalstrike'><none/></mscarry>
      <menclose notation='bottom'>
        <mn>10</mn>
      </menclose>
    </mscarries>
    <mn>52</mn>
    <msrow>
      <mo>-</mo>
      <mn> 7</mn>
    </msrow>
    <msline/>
    <mn>45</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 15', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msgroup>
      <mn>123</mn>
      <msrow><mo>&#xD7;<!--MULTIPLICATION SIGN--></mo><mn>321</mn></msrow>
    </msgroup>
    <msline/>
    <msgroup shift="1">
      <mn>123</mn>
      <mn>246</mn>
      <mn>369</mn>
    </msgroup>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 16', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries><mn>1</mn><mn>1</mn><none/></mscarries>
    <mscarries><mn>1</mn><mn>1</mn><none/></mscarries>
    <mn>1,234</mn>
    <msrow><mo>&#xD7;<!--MULTIPLICATION SIGN--></mo><mn>4,321</mn></msrow>
    <msline/>
    
    <mscarries position='2'>
      <mn>1</mn>
      <none/>
      <mn>1</mn>
      <mn>1</mn>
      <mn>1</mn>
      <none/>
      <mn>1</mn>
    </mscarries>
    <msgroup shift="1">
      <mn>1,234</mn>
      <mn>24,68</mn>
      <mn>370,2</mn>
      <msrow position="1">
        <mn>4,936</mn>
      </msrow>
    </msgroup>
    <msline/>
    
    <mn>5,332,114</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 17', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack stackalign="right">
    <msline length="1"/>
    <mn> 0.3333 </mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 18', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack stackalign="right">
    <msline length="6"/>
    <mn> 0.142857 </mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 19', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack stackalign="right">
    <mn> 0.142857 </mn>
    <msline length="6"/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 20', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack stackalign="right">
    <msrow>
      <mo>.</mo>
      <none/><none/><none/><none/>
      <mo>.</mo>
    </msrow>
    <mn> 0.142857 </mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 21', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 22', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 23', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <mn>456</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 24', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack stackalign='left'>
    <mn>2123.4</mn> 
    <msrow>
      <mn>456.018</mn>
      <mo>+</mo>
    </msrow>
    <msline/>
    <mn>2579.418</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 25', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack stackalign='center'>
    <mn>2123.4</mn> 
    <msrow>
      <mn>456.018</mn>
      <mo>+</mo>
    </msrow>
    <msline/>
    <mn>2579.418</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 26', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack stackalign='right'>
    <mn>2123.4</mn> 
    <msrow>
      <mn>456.018</mn>
      <mo>+</mo>
    </msrow>
    <msline/>
    <mn>2579.418</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 27', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack stackalign='decimalpoint'>
    <mn>2123.4</mn> 
    <msrow>
      <mn>456.018</mn>
      <mo>+</mo>
    </msrow>
    <msline/>
    <mn>2579.418</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 28', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>2123.4</mn> 
    <msrow>
      <mn>456.018</mn>
      <mo>+</mo>
    </msrow>
    <msline/>
    <mn>2579.418</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 29', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstyle decimalpoint=','>
    <mstack>
      <mn>2123,</mn> 
      <msrow>
        <mn>456,018</mn>
        <mo>+</mo>
      </msrow>
      <msline/>
      <mn>2579,418</mn>
    </mstack>
  </mstyle>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 30', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack charalign='left'>
    <mn>12</mn>
    <msrow>
      <mi>wide</mi>
      <mn>1</mn>
    </msrow>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 31', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack charalign='center'>
    <mn>12</mn>
    <msrow>
      <mi>wide</mi>
      <mn>1</mn>
    </msrow>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 32', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack charalign='right'>
    <mn>12</mn>
    <msrow>
      <mi>wide</mi>
      <mn>1</mn>
    </msrow>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 33', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>12</mn>
    <msrow>
      <mi>wide</mi>
      <mn>1</mn>
    </msrow>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 34', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack charspacing='loose'>
    <mn>432</mn>
    <msrow>
      <mo>+</mo><mn>33</mn>
    </msrow>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 35', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack charspacing='medium'>
    <mn>432</mn>
    <msrow>
      <mo>+</mo>
      <mn>33</mn>
    </msrow>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 36', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack charspacing='tight'>
    <mn>432</mn>
    <msrow>
      <mo>+</mo>
      <mn>33</mn>
    </msrow>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 37', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack charspacing='1em'>
    <mn>432</mn>
    <msrow>
      <mo>+</mo>
      <mn>33</mn>
    </msrow>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 38', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack charspacing='tight'>
    <mn>4321</mn>
    <msrow>
      <mo>+</mo>
      <none/><mn>33</mn>
    </msrow>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 39', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msgroup>
    </msgroup>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 40', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msgroup position="2" shift="1">
      <mn>123</mn>
    </msgroup>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 41', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msgroup position="-1" shift="2">
      <mn>123</mn>
      <mn>321</mn>
    </msgroup>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 42', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msgroup position="-1" shift="-1">
      <mn>234</mn>
      <mn>345</mn>
      <msgroup position="-1" shift="1">
        <mn>567</mn>
        <mn>456</mn>           
        <mn>345</mn>           
      </msgroup>
    </msgroup>
    <mn>0123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 43', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msgroup position='1'>
      <mn>123</mn>
    </msgroup>
    <msgroup position='-1'>
      <mn>345</mn>
    </msgroup>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 44', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msgroup position='1'>
      <mn>123</mn>
      <mn>123</mn>
    </msgroup>
    <msgroup position='-1'>
      <mn>345</mn>
      <mn>345</mn>
    </msgroup>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 45', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msgroup shift='1'>
      <mn>345</mn>
      <mn>234</mn>
      <mn>123</mn>
    </msgroup>
    <msgroup shift='-1'>
      <mn>345</mn>
      <mn>456</mn>
      <mn>567</mn>
    </msgroup>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 46', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msgroup position='-2' shift='-2'>
      <mn>345</mn>
      <mn>567</mn>
      <mn>789</mn>
    </msgroup>
    <msgroup position ='-6' shift='2'>
      <mn>789</mn>
      <mn>567</mn>
      <mn>345</mn>
    </msgroup>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 47', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msrow>
    </msrow>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 48', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msrow>
      <mn>123</mn>
    </msrow>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 49', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msrow>
      <mn>123.45</mn>
      <mo>|</mo>
      <mn>456</mn>
    </msrow>
    <mn>123.45</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 50', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msrow position='2'>
    </msrow>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 51', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msrow  position='-2'>
      <mn>123</mn>
    </msrow>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 52', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msrow position='1'>
      <mn>123</mn>
    </msrow>
    <msrow position='-1'>
      <mn>345</mn>
    </msrow>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 53', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries position='2'>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 54', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries position='2'>
    </mscarries>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 55', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries position='2'>
      <mn>9</mn>
    </mscarries>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 56', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 57', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries>
      <mn>1</mn>
      <mn>2</mn>
    </mscarries>
    <mn>9</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 58', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries>
      <mn>1</mn>
    </mscarries>
    <mscarries>
      <mn>2</mn>
    </mscarries>
    <mn>789</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 59', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries>
      <mn>1</mn>
    </mscarries>
    <mscarries>
      <mn>2</mn>
    </mscarries>
    <mscarries>
      <mn>3</mn>
    </mscarries>
    <mn>789</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 60', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msline/>
    <mscarries>
      <mn>3</mn>
    </mscarries>
    <mn>543</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 61', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries position='-1'>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 62', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries position='1'>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 63', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 64', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='w'>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 65', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='nw'>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 66', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='n'>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 67', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='ne'>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 68', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='e'>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 69', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='se'>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 70', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='s'>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 71', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='sw'>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 72', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='n' crossout='none'>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 73', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='ne' crossout='updiagonalstrike'>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 74', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='nw' crossout='downdiagonalstrike'>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 75', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='n' crossout='verticalstrike'>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 76', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='ne' crossout='horizontalstrike'>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 77', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='nw' crossout='downdiagonalstrike updiagonalstrike'>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 78', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries position='1' location='n' crossout='verticalstrike horizontalstrike downdiagonalstrike updiagonalstrike'>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 79', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='nw' crossout='  downdiagonalstrike    updiagonalstrike downdiagonalstrike '>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 80', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack charspacing='loose'>
    <mscarries scriptsizemultiplier='.4'>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>
    <mn>12345</mn>
    <mscarries>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 81', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack charspacing='tight'>
    <mscarries scriptsizemultiplier='1.5'>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>

    <mn>12345</mn>
    <mscarries>
      <mn>8</mn>
      <mn>9</mn>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 82', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstyle  scriptsizemultiplier='.4'>
    <mstack charspacing='loose'>
      <mscarries>
        <mn>8</mn>
        <mn>9</mn>
      </mscarries>
      <mn>12345</mn>
      <mscarries>
        <mn>8</mn>
        <mn>9</mn>
      </mscarries>
      <mn>123</mn>
    </mstack>
  </mstyle>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 83', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries>
      <mscarry><mn></mn></mscarry>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 84', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries>
      <mscarry><mn>9</mn></mscarry>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 85', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries>
      <mscarry><mn>789</mn></mscarry>
      <none/>
    </mscarries>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 86', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries>
      <mscarry location='w'><mn>0</mn></mscarry>
      <mscarry location='nw'><mn>0</mn></mscarry>
      <mscarry location='n'><mn>0</mn></mscarry>
      <mscarry location='ne'><mn>0</mn></mscarry>
      <mscarry location='e'><mn>0</mn></mscarry>
      <mscarry location='se'><mn>0</mn></mscarry>
      <mscarry location='s'><mn>0</mn></mscarry>
      <mscarry location='sw'><mn>0</mn></mscarry>
      <mscarry ><mn>0</mn></mscarry>
    </mscarries>
    <msrow>
      <mo>+</mo>
      <mn>123456789</mn>
    </msrow>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 87', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='nw'>
      <mscarry location='w'><mn>0</mn></mscarry>
      <mscarry location='nw'><mn>0</mn></mscarry>
      <mscarry location='n'><mn>0</mn></mscarry>
      <mscarry location='ne'><mn>0</mn></mscarry>
      <mscarry location='e'><mn>0</mn></mscarry>
      <mscarry location='se'><mn>0</mn></mscarry>
      <mscarry location='s'><mn>0</mn></mscarry>
      <mscarry location='sw'><mn>0</mn></mscarry>
      <mscarry ><mn>0</mn></mscarry>
    </mscarries>
    <msrow>
      <mo>+</mo>
      <mn>123456789</mn>
    </msrow>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 88', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mscarries location='nw' crossout='updiagonalstrike downdiagonalstrike'>
      <mscarry crossout='none'> <NONE/> </mscarry>
      <mscarry crossout='updiagonalstrike'> <NONE/> </mscarry>
      <mscarry crossout='downdiagonalstrike'> <NONE/> </mscarry>
      <mscarry crossout='verticalstrike'> <NONE/> </mscarry>
      <mscarry crossout='horizontalstrike'> <NONE/> </mscarry>
      <mscarry > <NONE/> </mscarry>
    </mscarries>
    <msrow>
      <mo>+</mo>
      <mn>56789</mn>
    </msrow>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 89', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msline length='3'/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 90', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msline position='1' length='2'/>
    <mn>123</mn>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 91', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msline position='1'/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 92', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msline position='1' length='1'/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 93', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msline position='4' length='1'/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 94', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msline position='-1' length='1'/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 95', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <msgroup>
      <mn>123</mn>
      <msrow><mo>&#xD7;<!--MULTIPLICATION SIGN--></mo><mn>321</mn></msrow>
    </msgroup>
    <msline length='4'/>
    <msgroup shift="1">
      <mn>123</mn>
      <mn>246</mn>
      <mn>369</mn>
    </msgroup>
    <msline length='3' position='2'/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 96', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msline length='5' position='-1'/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 97', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msline mslinethickness='thin'/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 98', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msline mslinethickness='medium'/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 99', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msline mslinethickness='thick'/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 100', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msline/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 101', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstack>
    <mn>123</mn>
    <msline mslinethickness='3ex'/>
  </mstack>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 102', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstyle mathcolor='gray'>
    <mstack>
      <mn>123</mn>
      <msline/>
    </mstack>
  </mstyle>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 103', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstyle mathcolor='gray'>
    <mstack>
      <mn>123</mn>
      <mstyle mathcolor='blue'>
        <msline mslinethickness='1ex'/>
      </mstyle>
    </mstack>
  </mstyle>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 104', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mlongdiv longdivstyle="lefttop">
    <mn> 3 </mn>
    <mn> 435.3</mn>
    
    <mn> 1306</mn>
    
    <msgroup position="2" shift="-1">
      <msgroup>
        <mn> 12</mn>
        <msline length="2"/>
      </msgroup>
      <msgroup>
        <mn> 10</mn>
        <mn> 9</mn>
        <msline length="2"/>
      </msgroup>
      <msgroup>
        <mn> 16</mn>
        <mn> 15</mn>
        <msline length="2"/>
        <mn> 1.0</mn>           <!-- aligns on '.', not the right edge ('0') -->
      </msgroup>
      <msgroup position='-1'>   <!-- extra shift to move to the right of the "." -->
        <mn> 9</mn>
        <msline length="3"/>
        <mn> 1</mn>
      </msgroup>
    </msgroup>
  </mlongdiv>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 105', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mstyle decimalpoint=",">
    <mlongdiv longdivstyle="stackedrightright" >
      <mn> 3 </mn>
      <mn> 435,3</mn>
      
      <mn> 1306</mn>
      
      <msgroup position="2" shift="-1">
        <msgroup>
          <mn> 12</mn>
          <msline length="2"/>
        </msgroup>
        <msgroup>
          <mn> 10</mn>
          <mn> 9</mn>
          <msline length="2"/>
        </msgroup>
        <msgroup>
          <mn> 16</mn>
          <mn> 15</mn>
          <msline length="2"/>
          <mn> 1,0</mn>           <!-- aligns on '.', not the right edge ('0') -->
        </msgroup>
        <msgroup position='-1'>   <!-- extra shift to move to the right of the "." -->
          <mn> 9</mn>
          <msline length="3"/>
          <mn> 1</mn>
        </msgroup>
      </msgroup>
    </mlongdiv>
  </mstyle>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 106', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"  decimalpoint="&#x066B;">
  <mlongdiv longdivstyle="stackedleftlinetop">
    <mn> &#x0663;<!--ARABIC-INDIC DIGIT THREE--> </mn>
    <mn> &#x0664;<!--ARABIC-INDIC DIGIT FOUR-->&#x0663;<!--ARABIC-INDIC DIGIT THREE-->&#x0665;<!--ARABIC-INDIC DIGIT FIVE-->&#x066B;<!--ARABIC DECIMAL SEPARATOR-->&#x0663;<!--ARABIC-INDIC DIGIT THREE--></mn>
    
    <mn> &#x0661;<!--ARABIC-INDIC DIGIT ONE-->&#x0663;<!--ARABIC-INDIC DIGIT THREE-->&#x0660;<!--ARABIC-INDIC DIGIT ZERO-->&#x0666;<!--ARABIC-INDIC DIGIT SIX--></mn>
    <msgroup position="2" shift="-1">
      <msgroup>
        <mn> &#x0661;<!--ARABIC-INDIC DIGIT ONE-->&#x0662;<!--ARABIC-INDIC DIGIT TWO--></mn>
        <msline length="2"/>
      </msgroup>
      <msgroup>
        <mn> &#x0661;<!--ARABIC-INDIC DIGIT ONE-->&#x0660;<!--ARABIC-INDIC DIGIT ZERO--></mn>
        <mn> &#x0669;<!--ARABIC-INDIC DIGIT NINE--></mn>
        <msline length="2"/>
      </msgroup>
      <msgroup>
        <mn> &#x0661;<!--ARABIC-INDIC DIGIT ONE-->&#x0666;<!--ARABIC-INDIC DIGIT SIX--></mn>
        <mn> &#x0661;<!--ARABIC-INDIC DIGIT ONE-->&#x0665;<!--ARABIC-INDIC DIGIT FIVE--></mn>
        <msline length="2"/>
        <mn> &#x0661;<!--ARABIC-INDIC DIGIT ONE-->&#x066B;<!--ARABIC DECIMAL SEPARATOR-->&#x0660;<!--ARABIC-INDIC DIGIT ZERO--></mn>
      </msgroup>
      <msgroup position='-1'>
        <mn> &#x0669;<!--ARABIC-INDIC DIGIT NINE--></mn>
        <msline length="3"/>
        <mn> &#x0661;<!--ARABIC-INDIC DIGIT ONE--></mn>
      </msgroup>
    </msgroup>
  </mlongdiv>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 107', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mlongdiv longdivstyle='lefttop'>
    <mn>1</mn>
    <mn>2</mn>
    <mn>3</mn>
  </mlongdiv>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 108', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mlongdiv longdivstyle='lefttop'>
  </mlongdiv>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 109', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mlongdiv longdivstyle='lefttop'>
    <mn>11.1</mn>
  </mlongdiv>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 110', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mlongdiv longdivstyle='lefttop'>
    <mn>11.1</mn>
    <mn>22.2</mn>
  </mlongdiv>
</math>
`)
    ).toMatchSnapshot();
  });

  test('Example 111', () => {
    expect(
      mml3(`
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mlongdiv longdivstyle='lefttop'>
    <mn>11.1</mn>
    <mn>22.2</mn>
    <mn>33.3</mn>
  </mlongdiv>
</math>
`)
    ).toMatchSnapshot();
  });
});

/**
 * Additional cases to cover the parts of the XSLT not reached by the examples
 * above (right-to-left handling and the remaining longdivstyle values, etc.).
 */
describe('Mml3 coverage', () => {
  const cases: [string, string][] = [
    [
      'rtl text and brackets',
      '<math dir="rtl"><mrow><mo>(</mo><mi>a</mi><mo>)</mo><mo>{</mo><mi>b</mi><mo>}</mo><mi>x</mi><mo>&lt;</mo><mi>y</mi><mo>&gt;</mo><mi>z</mi><mo>&#x2208;</mo><mi>A</mi><mo>&#x220b;</mo><mi>B</mi></mrow></math>',
    ],
    [
      'rtl mfenced round, square, curly',
      '<math dir="rtl"><mrow><mfenced open="(" close=")"><mi>a</mi></mfenced><mfenced open="[" close="]"><mi>b</mi></mfenced><mfenced open="{" close="}"><mi>c</mi></mfenced></mrow></math>',
    ],
    [
      'rtl mfenced reversed brackets',
      '<math dir="rtl"><mrow><mfenced open=")" close="("><mi>a</mi></mfenced><mfenced open="]" close="["><mi>b</mi></mfenced><mfenced open="}" close="{"><mi>c</mi></mfenced></mrow></math>',
    ],
    [
      'rtl mfenced other delimiters',
      '<math dir="rtl"><mfenced open="|" close="&#x2016;"><mi>a</mi><mi>b</mi></mfenced></math>',
    ],
    ['rtl mfrac', '<math dir="rtl"><mfrac><mi>a</mi><mi>b</mi></mfrac></math>'],
    [
      'rtl bevelled mfrac',
      '<math dir="rtl"><mfrac bevelled="true"><mi>a</mi><mi>b</mi></mfrac></math>',
    ],
    ['rtl mroot', '<math dir="rtl"><mroot><mi>a</mi><mn>3</mn></mroot></math>'],
    [
      'rtl msqrt',
      '<math dir="rtl"><msqrt><mi>a</mi><mo>+</mo><mi>b</mi></msqrt></math>',
    ],
    [
      'rtl mtable',
      '<math dir="rtl"><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd><mtd><mi>d</mi></mtd></mtr></mtable></math>',
    ],
    [
      'rtl munder, mover, munderover',
      '<math dir="rtl"><mrow><munder><mi>a</mi><mi>b</mi></munder><mover><mi>c</mi><mi>d</mi></mover><munderover><mi>e</mi><mi>f</mi><mi>g</mi></munderover></mrow></math>',
    ],
    [
      'rtl msup, msub, msubsup',
      '<math dir="rtl"><mrow><msup><mi>a</mi><mn>2</mn></msup><msub><mi>b</mi><mn>1</mn></msub><msubsup><mi>c</mi><mn>1</mn><mn>2</mn></msubsup></mrow></math>',
    ],
    [
      'rtl mmultiscripts with prescripts',
      '<math dir="rtl"><mmultiscripts><mi>a</mi><mi>b</mi><mi>c</mi><mprescripts/><mi>d</mi><mi>e</mi></mmultiscripts></math>',
    ],
    [
      'rtl mmultiscripts without prescripts',
      '<math dir="rtl"><mmultiscripts><mi>a</mi><mi>b</mi><mi>c</mi></mmultiscripts></math>',
    ],
    [
      'rtl menclose radical',
      '<math dir="rtl"><menclose notation="radical"><mi>a</mi></menclose></math>',
    ],
    [
      'rtl menclose madruwb',
      '<math dir="rtl"><menclose notation="madruwb"><mn>5</mn></menclose></math>',
    ],
    [
      'rtl mstack',
      '<math dir="rtl"><mstack><mn>496</mn><msrow><mo>+</mo><mn>28</mn></msrow><msline/></mstack></math>',
    ],
    [
      'rtl mlongdiv',
      '<math dir="rtl"><mlongdiv><mn>3</mn><mn>4</mn><mn>12</mn><msgroup><mn>12</mn><msline length="2"/></msgroup></mlongdiv></math>',
    ],
    [
      'mstack stackalign left with plain row',
      '<math><mstack stackalign="left"><mn>496</mn><mn>28</mn><msline/></mstack></math>',
    ],
    [
      'mstack stackalign left with mscarries',
      '<math><mstack stackalign="left"><mscarries><mn>1</mn><mn>2</mn></mscarries><mn>496</mn><msrow><mo>+</mo><mn>28</mn></msrow><msline/></mstack></math>',
    ],
    [
      'mscarries with scriptsizemultiplier',
      '<math><mstack><mscarries scriptsizemultiplier="0.5"><mscarry><mn>1</mn></mscarry><mn>2</mn></mscarries><mn>496</mn><msrow><mo>+</mo><mn>28</mn></msrow><msline/></mstack></math>',
    ],
    [
      'mscarries without location',
      '<math><mstack><mscarries><mn>1</mn><mn>2</mn></mscarries><mn>496</mn><msrow><mo>+</mo><mn>28</mn></msrow><msline/></mstack></math>',
    ],
    [
      'msline with length and stackalign left',
      '<math><mstack stackalign="left"><mn>496</mn><msrow><mo>+</mo><mn>28</mn></msrow><msline length="2"/><mn>524</mn></mstack></math>',
    ],
    [
      'longdivstyle left)(right',
      '<math><mlongdiv longdivstyle="left)(right"><mn>12</mn><mn>16.5</mn><mn>198</mn></mlongdiv></math>',
    ],
    [
      'longdivstyle left/\\right',
      '<math><mlongdiv longdivstyle="left/\\right"><mn>12</mn><mn>16.5</mn><mn>198</mn></mlongdiv></math>',
    ],
    [
      'longdivstyle :right=right',
      '<math><mlongdiv longdivstyle=":right=right"><mn>12</mn><mn>16.5</mn><mn>198</mn></mlongdiv></math>',
    ],
    [
      'longdivstyle righttop',
      '<math><mlongdiv longdivstyle="righttop"><mn>12</mn><mn>16.5</mn><mn>198</mn></mlongdiv></math>',
    ],
    [
      'longdivstyle mediumstackedrightright',
      '<math><mlongdiv longdivstyle="mediumstackedrightright"><mn>12</mn><mn>16.5</mn><mn>198</mn></mlongdiv></math>',
    ],
    [
      'longdivstyle shortstackedrightright',
      '<math><mlongdiv longdivstyle="shortstackedrightright"><mn>12</mn><mn>16.5</mn><mn>198</mn></mlongdiv></math>',
    ],
    [
      'longdivstyle stackedleftleft',
      '<math><mlongdiv longdivstyle="stackedleftleft"><mn>12</mn><mn>16.5</mn><mn>198</mn></mlongdiv></math>',
    ],
    [
      'mscarry with unknown location',
      '<math><mstack><mscarries><mscarry location="x"><mn>1</mn></mscarry><mn>2</mn></mscarries><mn>496</mn><msrow><mo>+</mo><mn>28</mn></msrow><msline/></mstack></math>',
    ],
    [
      'mstack stackalign left with generic row then msrow',
      '<math><mstack stackalign="left"><mi>x</mi><msrow><mi>y</mi><mi>z</mi></msrow></mstack></math>',
    ],
    [
      'mstack stackalign left with msrow then generic row',
      '<math><mstack stackalign="left"><msrow><mi>y</mi><mi>z</mi></msrow><mi>x</mi></mstack></math>',
    ],
    [
      'mstack stackalign left with mrow and msrow',
      '<math><mstack stackalign="left"><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><msrow><mo>-</mo><mi>c</mi></msrow></mstack></math>',
    ],
    [
      'mstack stackalign right with generic row then msrow',
      '<math><mstack stackalign="right"><mi>x</mi><msrow><mi>y</mi><mi>z</mi></msrow></mstack></math>',
    ],
    [
      'mstack stackalign left with mn rows and mscarries position',
      '<math><mstack stackalign="left"><mscarries position="1"><mn>1</mn></mscarries><mn>12345</mn><mn>67</mn></mstack></math>',
    ],
    [
      'mstack stackalign left with mn rows and msrow position',
      '<math><mstack stackalign="left"><mn>12345</mn><msrow position="1"><mn>67</mn></msrow></mstack></math>',
    ],
    [
      'mstack stackalign left with mn rows and msgroup position',
      '<math><mstack stackalign="left"><mn>12345</mn><msgroup position="1"><mn>67</mn></msgroup></mstack></math>',
    ],
  ];
  for (const [name, mml] of cases) {
    test(name, () => {
      expect(mml3(mml)).toMatchSnapshot();
    });
  }
});
