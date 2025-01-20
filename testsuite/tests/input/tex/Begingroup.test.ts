import { afterAll, beforeEach, describe, test, expect } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/begingroup/BegingroupConfiguration';
import '#js/input/tex/newcommand/NewcommandConfiguration';

import { Configuration } from "#js/input/tex/Configuration.js";
import { CommandMap } from "#js/input/tex/TokenMap.js";
import TexParser from "#js/input/tex/TexParser.js";
import { mathjax } from "#js/mathjax.js";

/*************************************************************************/

/**
 * Implement a command that forces a retry error (like \require would),
 * but does nothing when called on the retry.
 */
new CommandMap('retry', {
  retry(parser: TexParser, _name: string) {
    if (!parser.options.retry) {
      parser.options.retry = true;
      mathjax.retryAfter(Promise.resolve());
    }
  }
});

Configuration.create('retry', {handler: {macro: ['retry']}});

/**
 * Test a TeX expression to see if it throws an error
 */
function texError(tex: string) {
  try {
    tex2mml(tex);
    return null;
  } catch (e) {
    return e.message;
  }
}

/*************************************************************************/
/*************************************************************************/

describe('Begingroup', () => {

  beforeEach(() => setupTex(['base', 'begingroup', 'newcommand', 'retry'], {
    formatError: (_jax: any, err: Error) => {throw err}
  }));

  /***********************************************************************/

  test('Begingroup Def Single', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\x \\begingroup \\def\\x{B} \\x \\endgroup \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\x \\begingroup \\def\\x{B} \\x \\endgroup \\x\" display=\"block\">
         <mi data-latex=\"\\def\\x{B}\">A</mi>
         <mi data-latex=\"\\endgroup\">B</mi>
         <mi data-latex=\"A\">A</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup Def Nested', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\x \\begingroup \\def\\x{B} \\x \\begingroup \\def\\x{C} \\x \\endgroup \\x \\endgroup \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\x \\begingroup \\def\\x{B} \\x \\begingroup \\def\\x{C} \\x \\endgroup \\x \\endgroup \\x\" display=\"block\">
         <mi data-latex=\"\\def\\x{B}\">A</mi>
         <mi data-latex=\"\\def\\x{C}\">B</mi>
         <mi data-latex=\"\\endgroup\">C</mi>
         <mi data-latex=\"\\endgroup\">B</mi>
         <mi data-latex=\"A\">A</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup Let Single', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\x \\begingroup \\let\\x=B \\x \\endgroup \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\x \\begingroup \\let\\x=B \\x \\endgroup \\x\" display=\"block\">
         <mi data-latex=\"\\let\\x=B\">A</mi>
         <mi data-latex=\"\\endgroup\">B</mi>
         <mi data-latex=\"A\">A</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup Let Nested', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\x \\begingroup \\let\\x=B \\x \\begingroup \\let\\x=C \\x \\endgroup \\x \\endgroup \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\x \\begingroup \\let\\x=B \\x \\begingroup \\let\\x=C \\x \\endgroup \\x \\endgroup \\x\" display=\"block\">
         <mi data-latex=\"\\let\\x=B\">A</mi>
         <mi data-latex=\"\\let\\x=C\">B</mi>
         <mi data-latex=\"\\endgroup\">C</mi>
         <mi data-latex=\"\\endgroup\">B</mi>
         <mi data-latex=\"A\">A</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup Env Single', () => {
    toXmlMatch(
      tex2mml('\\newenvironment{test}{[}{]}\\begin{test}X\\end{test}\\begingroup\\newenvironment{test}{(}{)}\\begin{test}X\\end{test}\\endgroup\\begin{test}X\\end{test}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\newenvironment{test}{[}{]}\\begin{test}X\\end{test}\\begingroup\\newenvironment{test}{(}{)}\\begin{test}X\\end{test}\\endgroup\\begin{test}X\\end{test}\" display=\"block\">
         <mo data-latex=\"[\" stretchy=\"false\">[</mo>
         <mi data-latex=\"X\">X</mi>
         <mo data-latex=\"]\" stretchy=\"false\">]</mo>
         <mo data-latex=\"(\" stretchy=\"false\">(</mo>
         <mi data-latex=\"X\">X</mi>
         <mo data-latex=\")\" stretchy=\"false\">)</mo>
         <mo data-latex=\"[\" stretchy=\"false\">[</mo>
         <mi data-latex=\"X\">X</mi>
         <mo data-latex=\"]\" stretchy=\"false\">]</mo>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup Delimiter Single', () => {
    toXmlMatch(
      tex2mml('\\let\\x=\\| \\left\\x A\\right\\x \\begingroup \\let\\x=| \\left\\x B \\right\\x \\endgroup \\left\\x C \\right\\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\let\\x=\\| \\left\\x A\\right\\x \\begingroup \\let\\x=| \\left\\x B \\right\\x \\endgroup \\left\\x C \\right\\x\" display=\"block\">
         <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\x A\\right\\x \" data-latex=\"\\left\\x A\\right\\x \">
           <mo data-mjx-texclass=\"OPEN\" symmetric=\"true\" data-latex-item=\"\\left\\x \" data-latex=\"\\left\\x \">&#x2016;</mo>
           <mi data-latex=\"A\">A</mi>
           <mo data-mjx-texclass=\"CLOSE\" symmetric=\"true\" data-latex-item=\"\\right\\x \" data-latex=\"\\right\\x \">&#x2016;</mo>
         </mrow>
         <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\x B \\right\\x \" data-latex=\"\\left\\x B \\right\\x \">
           <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left\\x \" data-latex=\"\\left\\x \">|</mo>
           <mi data-latex=\"B\">B</mi>
           <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right\\x \" data-latex=\"\\right\\x \">|</mo>
         </mrow>
         <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\x C \\right\\x\" data-latex=\"\\left\\x C \\right\\x\">
           <mo data-mjx-texclass=\"OPEN\" symmetric=\"true\" data-latex-item=\"\\left\\x \" data-latex=\"\\left\\x \">&#x2016;</mo>
           <mi data-latex=\"C\">C</mi>
           <mo data-mjx-texclass=\"CLOSE\" symmetric=\"true\" data-latex-item=\"\\right\\x\" data-latex=\"\\right\\x\">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup Delimiter Nested', () => {
    toXmlMatch(
      tex2mml('\\let\\x=\\| \\left\\x A\\right\\x \\begingroup \\let\\x=| \\left\\x B \\right\\x \\begingroup \\let\\x=( \\left\\x C \\right\\x \\endgroup \\left\\x D \\right\\x \\endgroup \\left\\x E \\right\\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\let\\x=\\| \\left\\x A\\right\\x \\begingroup \\let\\x=| \\left\\x B \\right\\x \\begingroup \\let\\x=( \\left\\x C \\right\\x \\endgroup \\left\\x D \\right\\x \\endgroup \\left\\x E \\right\\x\" display=\"block\">
         <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\x A\\right\\x \" data-latex=\"\\left\\x A\\right\\x \">
           <mo data-mjx-texclass=\"OPEN\" symmetric=\"true\" data-latex-item=\"\\left\\x \" data-latex=\"\\left\\x \">&#x2016;</mo>
           <mi data-latex=\"A\">A</mi>
           <mo data-mjx-texclass=\"CLOSE\" symmetric=\"true\" data-latex-item=\"\\right\\x \" data-latex=\"\\right\\x \">&#x2016;</mo>
         </mrow>
         <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\x B \\right\\x \" data-latex=\"\\left\\x B \\right\\x \">
           <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left\\x \" data-latex=\"\\left\\x \">|</mo>
           <mi data-latex=\"B\">B</mi>
           <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right\\x \" data-latex=\"\\right\\x \">|</mo>
         </mrow>
         <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\x C \\right\\x \" data-latex=\"\\left\\x C \\right\\x \">
           <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left\\x \" data-latex=\"\\left\\x \">(</mo>
           <mi data-latex=\"C\">C</mi>
           <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right\\x \" data-latex=\"\\right\\x \">(</mo>
         </mrow>
         <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\x D \\right\\x \" data-latex=\"\\left\\x D \\right\\x \">
           <mo data-mjx-texclass=\"OPEN\" data-latex-item=\"\\left\\x \" data-latex=\"\\left\\x \">|</mo>
           <mi data-latex=\"D\">D</mi>
           <mo data-mjx-texclass=\"CLOSE\" data-latex-item=\"\\right\\x \" data-latex=\"\\right\\x \">|</mo>
         </mrow>
         <mrow data-mjx-texclass=\"INNER\" data-latex-item=\"\\left\\x E \\right\\x\" data-latex=\"\\left\\x E \\right\\x\">
           <mo data-mjx-texclass=\"OPEN\" symmetric=\"true\" data-latex-item=\"\\left\\x \" data-latex=\"\\left\\x \">&#x2016;</mo>
           <mi data-latex=\"E\">E</mi>
           <mo data-mjx-texclass=\"CLOSE\" symmetric=\"true\" data-latex-item=\"\\right\\x\" data-latex=\"\\right\\x\">&#x2016;</mo>
         </mrow>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup Global', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\x \\begingroup \\def\\x{B} \\x \\global\\def\\x{C} \\x \\endgroup \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\x \\begingroup \\def\\x{B} \\x \\global\\def\\x{C} \\x \\endgroup \\x\" display=\"block\">
         <mi data-latex=\"\\def\\x{B}\">A</mi>
         <mi data-latex=\"\\def\\x{C}\">B</mi>
         <mi data-latex=\"\\endgroup\">C</mi>
         <mi data-latex=\"C\">C</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup Global Nested', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\x \\begingroup \\def\\x{B} \\x \\begingroup \\gdef\\x{C} \\x \\endgroup \\x \\endgroup \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\x \\begingroup \\def\\x{B} \\x \\begingroup \\gdef\\x{C} \\x \\endgroup \\x \\endgroup \\x\" display=\"block\">
         <mi data-latex=\"\\def\\x{B}\">A</mi>
         <mi data-latex=\"\\def\\x{C}\">B</mi>
         <mi data-latex=\"\\endgroup\">C</mi>
         <mi data-latex=\"\\endgroup\">C</mi>
         <mi data-latex=\"C\">C</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup Global Let', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\x \\begingroup \\let\\x=B \\x \\global\\let\\x=C \\x \\endgroup \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\x \\begingroup \\let\\x=B \\x \\global\\let\\x=C \\x \\endgroup \\x\" display=\"block\">
         <mi data-latex=\"\\let\\x=B\">A</mi>
         <mi data-latex=\"\\let\\x=C\">B</mi>
         <mi data-latex=\"\\endgroup\">C</mi>
         <mi data-latex=\"C\">C</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup Persists', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\begingroup \\def\\x{B}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\begingroup \\def\\x{B}\" display=\"block\"></math>`
    );
    toXmlMatch(
      tex2mml('\\x \\endgroup \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\x \\endgroup \\x\" display=\"block\">
         <mi data-latex=\"\\endgroup\">B</mi>
         <mi data-latex=\"A\">A</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup Reset', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\begingroup \\def\\x{B} \\begingroupReset \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\begingroup \\def\\x{B} \\begingroupReset \\x\" display=\"block\">
         <mi data-latex=\"A\">A</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup End without Begin', () => {
    expect(texError('\\endgroup')).toBe('Missing \\begingroup or extra \\endgroup');
  });

  /***********************************************************************/

  test('Begingroup End without Begin 2', () => {
    expect(texError('\\begingroup \\endgroup \\endgroup')).toBe('Missing \\begingroup or extra \\endgroup');
  });

  /***********************************************************************/

  test('Begingroup global misplaced', () => {
    expect(texError('\\global\\sqrt{x}')).toBe('Invalid use of \\global');
    expect(texError('\\global x')).toBe('Invalid use of \\global');
  });

  /***********************************************************************/

  test('Begingroup reset', () => {
    expect(texError('\\begingroup \\begingroupReset \\endgroup')).toBe('Missing \\begingroup or extra \\endgroup');
  });

  /***********************************************************************/

  test('Begingroup reset 2', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\begingroup \\def\\x{B} \\begingroupReset \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\begingroup \\def\\x{B} \\begingroupReset \\x\" display=\"block\">
         <mi data-latex=\"A\">A</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup let undefined', () => {
    expect(texError('\\def\\x{A} \\begingroup \\let\\x=\\undefined \\x \\endgroup'))
      .toBe('Undefined control sequence \\x');
  });

  /***********************************************************************/

  test('Begingroup let undefined 2', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\begingroup \\let\\x=\\undefined \\endgroup \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\begingroup \\let\\x=\\undefined \\endgroup \\x\" display=\"block\">
         <mi data-latex=\"A\">A</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup global def undefines local delimiter', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\x \\begingroup \\let\\x=\\| \\x \\begingroup \\gdef\\x{C} \\x \\endgroup \\x \\endgroup \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\x \\begingroup \\let\\x=\\| \\x \\begingroup \\gdef\\x{C} \\x \\endgroup \\x \\endgroup \\x\" display=\"block\">
         <mi data-latex=\"\\let\\x=\\|\">A</mi>
         <mo data-mjx-texclass=\"ORD\" fence=\"false\" stretchy=\"false\" data-latex=\"\\def\\x{C}\">&#x2016;</mo>
         <mi data-latex=\"\\endgroup\">C</mi>
         <mi data-latex=\"\\endgroup\">C</mi>
         <mi data-latex=\"C\">C</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup global let delimiter undefines local def', () => {
    toXmlMatch(
      tex2mml('\\let\\x=| \\x \\begingroup \\def\\x{A} \\x \\begingroup \\global\\let\\x=\\| \\x \\endgroup \\x \\endgroup \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\let\\x=| \\x \\begingroup \\def\\x{A} \\x \\begingroup \\global\\let\\x=\\| \\x \\endgroup \\x \\endgroup \\x\" display=\"block\">
         <mo data-mjx-texclass=\"ORD\" fence=\"false\" stretchy=\"false\" data-latex=\"\\def\\x{A}\">|</mo>
         <mi data-latex=\"\\let\\x=\\|\">A</mi>
         <mo data-mjx-texclass=\"ORD\" fence=\"false\" stretchy=\"false\" data-latex=\"\\endgroup\">&#x2016;</mo>
         <mo data-mjx-texclass=\"ORD\" fence=\"false\" stretchy=\"false\" data-latex=\"\\endgroup\">&#x2016;</mo>
         <mo data-mjx-texclass=\"ORD\" fence=\"false\" stretchy=\"false\" data-latex=\"\\x\">&#x2016;</mo>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup sandbox', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\begingroupSandbox \\def\\x{B} \\begingroupReset \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\begingroupSandbox \\def\\x{B} \\begingroupReset \\x\" display=\"block\">
         <mi data-latex=\"B\">B</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup double sandbox', () => {
    toXmlMatch(
      tex2mml('\\def\\x{A} \\begingroupSandbox \\def\\x{B} \\begingroupSandbox \\x'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\def\\x{A} \\begingroupSandbox \\def\\x{B} \\begingroupSandbox \\x\" display=\"block\">
         <mi data-latex=\"A\">A</mi>
       </math>`
    );
  });

  /***********************************************************************/

  test('Begingroup sandbox not ended', () => {
    expect(texError('\\begingroupSandbox \\endgroup')).toBe('Missing \\begingroup or extra \\endgroup');
  });

  /***********************************************************************/

  test('Begingroup sandbox redefine', () => {
    expect(texError('\\let\\begingroupSandbox=\\undefined'))
      .toBe("The control sequence \\begingroupSandbox can't be redefined");
    expect(texError('\\def\\begingroupSandbox{x}'))
      .toBe("The control sequence \\begingroupSandbox can't be redefined");
    expect(texError('\\newcommand{\\begingroupSandbox}{x}'))
      .toBe("The control sequence \\begingroupSandbox can't be redefined");
  });

  /***********************************************************************/

  test('Begingroup with retry', async () => {
    await expect(mathjax.handleRetriesFor(
      () => tex2mml('\\sin \\begingroup\\def\\sin{SIN}\\retry\\endgroup')
    )).resolves.toBe(
`<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin \\begingroup\\def\\sin{SIN}\\retry\\endgroup" display="block">
  <mi data-latex="\\sin \\begingroup\\def\\sin{SIN}\\retry\\endgroup">sin</mi>
</math>`
    );
  });

  /***********************************************************************/

  test('Begingroup sandbox with retry', async () => {
    tex2mml('\\def\\x{A}\\begingroupSandbox');
    await expect(mathjax.handleRetriesFor(
      () => tex2mml('\\x \\begingroup\\def\\x{B}\\retry\\endgroup')
    )).resolves.toBe(
`<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\x \\begingroup\\def\\x{B}\\retry\\endgroup" display="block">
  <mi data-latex="A\\begingroup\\def\\x{B}\\retry\\endgroup">A</mi>
</math>`
    );
  });

  /***********************************************************************/

  test('Begingroup retry error', async () => {
    await expect(mathjax.handleRetriesFor(
      () => tex2mml('\\begingroup\\retry\\endgroup\\endgroup')
    ).catch((e) => e.message)).resolves.toBe('Missing \\begingroup or extra \\endgroup');
  });

  /***********************************************************************/

  test('Begingroup sandbox retry error', async () => {
    tex2mml('\\begingroupSandbox');
    await expect(mathjax.handleRetriesFor(
      () => tex2mml('\\begingroup\\retry\\endgroup\\endgroup')
    ).catch((e) => e.message)).resolves.toBe('Missing \\begingroup or extra \\endgroup');
  });

});

afterAll(() => getTokens('begingroup'));
