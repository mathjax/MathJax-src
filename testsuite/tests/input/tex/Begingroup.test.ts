import { afterAll, beforeEach, describe, test, expect } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/begingroup/BegingroupConfiguration';
import '#js/input/tex/newcommand/NewcommandConfiguration';

import { Configuration } from "#js/input/tex/Configuration.js";
import { CommandMap } from "#js/input/tex/TokenMap.js";
import TexParser from "#js/input/tex/TexParser.js";
import { mathjax } from "#js/mathjax.js";

/**********************************************************************************/
/**********************************************************************************/

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

/**********************************************************************************/
/**********************************************************************************/

describe('Begingroup', () => {

  beforeEach(() => setupTex(['base', 'begingroup', 'newcommand', 'retry'], {
    formatError: (_jax: any, err: Error) => {throw err}
  }));

  /********************************************************************************/

  test('Begingroup Def Single', () => {
    expect(tex2mml('\\def\\x{A} \\x \\begingroup \\def\\x{B} \\x \\endgroup \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup Def Nested', () => {
    expect(tex2mml('\\def\\x{A} \\x \\begingroup \\def\\x{B} \\x \\begingroup \\def\\x{C} \\x \\endgroup \\x \\endgroup \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup Let Single', () => {
    expect(tex2mml('\\def\\x{A} \\x \\begingroup \\let\\x=B \\x \\endgroup \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup Let Nested', () => {
    expect(tex2mml('\\def\\x{A} \\x \\begingroup \\let\\x=B \\x \\begingroup \\let\\x=C \\x \\endgroup \\x \\endgroup \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup Env Single', () => {
    expect(tex2mml('\\newenvironment{test}{[}{]}\\begin{test}X\\end{test}\\begingroup\\newenvironment{test}{(}{)}\\begin{test}X\\end{test}\\endgroup\\begin{test}X\\end{test}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup Delimiter Single', () => {
    expect(tex2mml('\\let\\x=\\| \\left\\x A\\right\\x \\begingroup \\let\\x=| \\left\\x B \\right\\x \\endgroup \\left\\x C \\right\\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup Delimiter Nested', () => {
    expect(tex2mml('\\let\\x=\\| \\left\\x A\\right\\x \\begingroup \\let\\x=| \\left\\x B \\right\\x \\begingroup \\let\\x=( \\left\\x C \\right\\x \\endgroup \\left\\x D \\right\\x \\endgroup \\left\\x E \\right\\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup Global', () => {
    expect(tex2mml('\\def\\x{A} \\x \\begingroup \\def\\x{B} \\x \\global\\def\\x{C} \\x \\endgroup \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup Global Nested', () => {
    expect(tex2mml('\\def\\x{A} \\x \\begingroup \\def\\x{B} \\x \\begingroup \\gdef\\x{C} \\x \\endgroup \\x \\endgroup \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup Global Let', () => {
    expect(tex2mml('\\def\\x{A} \\x \\begingroup \\let\\x=B \\x \\global\\let\\x=C \\x \\endgroup \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup Persists', () => {
    expect(tex2mml('\\def\\x{A} \\begingroup \\def\\x{B}')).toMatchSnapshot();
    expect(tex2mml('\\x \\endgroup \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup Reset', () => {
    expect(tex2mml('\\def\\x{A} \\begingroup \\def\\x{B} \\begingroupReset \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup End without Begin', () => {
    expectTexError('\\endgroup').toBe('Missing \\begingroup or extra \\endgroup');
  });

  /********************************************************************************/

  test('Begingroup End without Begin 2', () => {
    expectTexError('\\begingroup \\endgroup \\endgroup').toBe('Missing \\begingroup or extra \\endgroup');
  });

  /********************************************************************************/

  test('Begingroup global misplaced', () => {
    expectTexError('\\global\\sqrt{x}').toBe('Invalid use of \\global');
    expectTexError('\\global x').toBe('Invalid use of \\global');
  });

  /********************************************************************************/

  test('Begingroup reset', () => {
    expectTexError('\\begingroup \\begingroupReset \\endgroup').toBe('Missing \\begingroup or extra \\endgroup');
  });

  /********************************************************************************/

  test('Begingroup reset 2', () => {
    expect(tex2mml('\\def\\x{A} \\begingroup \\def\\x{B} \\begingroupReset \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup let undefined', () => {
    expectTexError('\\def\\x{A} \\begingroup \\let\\x=\\undefined \\x \\endgroup')
      .toBe('Undefined control sequence \\x');
  });

  /********************************************************************************/

  test('Begingroup let undefined 2', () => {
    expect(tex2mml('\\def\\x{A} \\begingroup \\let\\x=\\undefined \\endgroup \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup global def undefines local delimiter', () => {
    expect(tex2mml('\\def\\x{A} \\x \\begingroup \\let\\x=\\| \\x \\begingroup \\gdef\\x{C} \\x \\endgroup \\x \\endgroup \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup global let delimiter undefines local def', () => {
    expect(tex2mml('\\let\\x=| \\x \\begingroup \\def\\x{A} \\x \\begingroup \\global\\let\\x=\\| \\x \\endgroup \\x \\endgroup \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup sandbox', () => {
    expect(tex2mml('\\def\\x{A} \\begingroupSandbox \\def\\x{B} \\begingroupReset \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup double sandbox', () => {
    expect(tex2mml('\\def\\x{A} \\begingroupSandbox \\def\\x{B} \\begingroupSandbox \\x')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Begingroup sandbox not ended', () => {
    expectTexError('\\begingroupSandbox \\endgroup').toBe('Missing \\begingroup or extra \\endgroup');
  });

  /********************************************************************************/

  test('Begingroup sandbox redefine', () => {
    expectTexError('\\let\\begingroupSandbox=\\undefined')
      .toBe("The control sequence \\begingroupSandbox can't be redefined");
    expectTexError('\\def\\begingroupSandbox{x}')
      .toBe("The control sequence \\begingroupSandbox can't be redefined");
    expectTexError('\\newcommand{\\begingroupSandbox}{x}')
      .toBe("The control sequence \\begingroupSandbox can't be redefined");
  });

  /********************************************************************************/

  test('Begingroup with retry', async () => {
    await expect(mathjax.handleRetriesFor(
      () => tex2mml('\\sin \\begingroup\\def\\sin{SIN}\\retry\\endgroup')
    )).resolves.toBe(
    `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\sin \\begingroup\\def\\sin{SIN}\\retry\\endgroup" display="block">
  <mi data-latex="\\sin \\begingroup\\def\\sin{SIN}\\retry\\endgroup">sin</mi>
</math>`
    );
  });

  /********************************************************************************/

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

  /********************************************************************************/

  test('Begingroup retry error', async () => {
    await expect(mathjax.handleRetriesFor(
      () => tex2mml('\\begingroup\\retry\\endgroup\\endgroup')
    ).catch((e) => e.message)).resolves.toBe('Missing \\begingroup or extra \\endgroup');
  });

  /********************************************************************************/

  test('Begingroup sandbox retry error', async () => {
    tex2mml('\\begingroupSandbox');
    await expect(mathjax.handleRetriesFor(
      () => tex2mml('\\begingroup\\retry\\endgroup\\endgroup')
    ).catch((e) => e.message)).resolves.toBe('Missing \\begingroup or extra \\endgroup');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('begingroup'));
