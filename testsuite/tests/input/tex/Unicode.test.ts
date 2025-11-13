import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/unicode/UnicodeConfiguration';

beforeEach(() => setupTex(['base', 'unicode']));

/**********************************************************************************/
/**********************************************************************************/

describe('Unicode', () => {

  /********************************************************************************/

  it('Unicode Dec', () => {
    toXmlMatch(
      tex2mml('\\unicode{8922}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{8922}" display="block">
         <mtext data-latex="\\unicode{8922}">&#x22DA;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Hex', () => {
    toXmlMatch(
      tex2mml('\\unicode{0x22DA}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{0x22DA}" display="block">
         <mtext data-latex="\\unicode{0x22DA}">&#x22DA;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Dec A', () => {
    toXmlMatch(
      tex2mml('\\unicode{65}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{65}" display="block">
         <mtext data-latex="\\unicode{65}">A</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Hex A', () => {
    toXmlMatch(
      tex2mml('\\unicode{x41}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{x41}" display="block">
         <mtext data-latex="\\unicode{x41}">A</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Scale', () => {
    toXmlMatch(
      tex2mml('\\unicode[.55,0.05]{x22D6}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode[.55,0.05]{x22D6}" display="block">
         <mtext data-latex="\\unicode[.55,0.05]{x22D6}">&#x22D6;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Scale Font', () => {
    toXmlMatch(
      tex2mml('\\unicode[.55,0.05][Geramond]{x22D6}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode[.55,0.05][Geramond]{x22D6}" display="block">
         <mtext fontfamily="Geramond" data-latex="\\unicode[.55,0.05][Geramond]{x22D6}">&#x22D6;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Font', () => {
    toXmlMatch(
      tex2mml('\\unicode[Garamond]{x22D6}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode[Garamond]{x22D6}" display="block">
         <mtext fontfamily="Garamond" data-latex="\\unicode[Garamond]{x22D6}">&#x22D6;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Combined', () => {
    toXmlMatch(
      tex2mml('\\mbox{A}\\unicode{65}{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mbox{A}\\unicode{65}{B}" display="block">
         <mstyle displaystyle="false" data-latex="\\mbox{A}">
           <mtext>A</mtext>
         </mstyle>
         <mtext data-latex="\\unicode{65}">A</mtext>
         <mrow data-mjx-texclass="ORD" data-latex="{B}">
           <mi data-latex="B">B</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Surrogate Hex', () => {
    toXmlMatch(
      tex2mml('\\unicode{x1D5A0}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{x1D5A0}" display="block">
         <mtext data-latex="\\unicode{x1D5A0}">&#x1D5A0;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Surrogate Dec', () => {
    toXmlMatch(
      tex2mml('\\unicode{120224}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{120224}" display="block">
         <mtext data-latex="\\unicode{120224}">&#x1D5A0;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Blackboard', () => {
    toXmlMatch(
      tex2mml('\\unicode{x1D538}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{x1D538}" display="block">
         <mtext data-latex="\\unicode{x1D538}">&#x1D538;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Blackboard Geramond', () => {
    toXmlMatch(
      tex2mml('\\unicode{x1D538}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\unicode{x1D538}" display="block">
         <mtext data-latex="\\unicode{x1D538}">&#x1D538;</mtext>
       </math>`
    );
  });

  /********************************************************************************/

});

// Here the order is important! As otherwise bold stays.
/**********************************************************************************/
/**********************************************************************************/

describe('Unicode Complete', () => {

  /********************************************************************************/

  it('Unicode Caligraphic', () => {
    toXmlMatch(
      tex2mml('\\mathtt{\\unicode{8922}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtt{\\unicode{8922}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathtt{\\unicode{8922}}">
           <mtext mathvariant="monospace" data-latex="\\unicode{8922}">&#x22DA;</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Bold', () => {
    toXmlMatch(
      tex2mml('\\mathbf{\\unicode[bold]{8922}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathbf{\\unicode[bold]{8922}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathbf{\\unicode[bold]{8922}}">
           <mtext fontfamily="bold" fontweight="bold" data-latex="\\unicode[bold]{8922}">&#x22DA;</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Unicode Italic', () => {
    toXmlMatch(
      tex2mml('\\mathit{\\unicode[bold]{8922}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathit{\\unicode[bold]{8922}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="\\mathit{\\unicode[bold]{8922}}">
           <mtext fontfamily="bold" fontstyle="italic" data-latex="\\unicode[bold]{8922}">&#x22DA;</mtext>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Unicode others', () => {

  /********************************************************************************/

  it('Raw Unicode', () => {
    toXmlMatch(
      tex2mml('\\U{892F}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\U{892F}" display="block">
         <mi mathvariant="normal" data-latex="&#x892F;">&#x892F;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Char numerical', () => {
    toXmlMatch(
      tex2mml('\\char\'777'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\char'777" display="block">
         <mi data-latex="\\char'777">&#x1FF;</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Char alpha', () => {
    toXmlMatch(
      tex2mml('\\char`A'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\char\`A" display="block">
        <mi data-latex="\\char\`A">A</mi>
      </math>`
    )
  });

  /********************************************************************************/

  it('Char command number', () => {
    toXmlMatch(
      tex2mml('\\char`\\3'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\char\`\\3" display="block">
        <mn data-latex="\\char\`\\3">3</mn>
       </math>`
    )
  });

  /********************************************************************************/

  it('Char Yen', () => {
    toXmlMatch(
      tex2mml('\\char"A5'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\char&quot;A5" display="block">
         <mo data-latex="\\char&quot;A5">&#xA5;</mo>
       </math>`
    );
  });

  /********************************************************************************/

  it('Char number', () => {
    toXmlMatch(
      tex2mml('\\char55'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\char55" display="block">
         <mn data-latex="\\char55">7</mn>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Unicode Errors', () => {

  /********************************************************************************/

  it('Unicode BadFont', () => {
    expectTexError('\\unicode[arial;]{8922}')
      .toBe("Font name for \\unicode can't contain semicolons");
  });

  /********************************************************************************/

  it('Unicode BadUnicode', () => {
    expectTexError('\\unicode{4A}')
      .toBe('Argument to \\unicode must be a number');
  });

  /********************************************************************************/

  it('Unicode BadRawUnicode', () => {
    expectTexError('\\U{892G}')
      .toBe('Argument to \\U must a hexadecimal number with 1 to 6 digits');
  });

  /********************************************************************************/

  it('Unicode InvalidAlphanumeric', () => {
    expectTexError('\\char`\\nix')
      .toBe('Invalid alphanumeric constant for \\char');
  });

  /********************************************************************************/

  it('Unicode MissingNumber', () => {
    expectTexError('\\char {40}')
      .toBe('Missing numeric constant for \\char');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('unicode'));
