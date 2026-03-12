import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  getTokens,
  setupTex,
  setupTexTypeset,
  tex2mml,
  typeset2mml,
  setupComponents,
  expectTexError,
  expectTypesetError
} from '#helpers';
import '#js/input/tex/textmacros/TextMacrosConfiguration';
import '#js/input/tex/newcommand/NewcommandConfiguration';
import '#js/input/tex/color/ColorConfiguration';
import '#js/input/tex/html/HtmlConfiguration';
import '#js/input/tex/unicode/UnicodeConfiguration';

import {Configuration} from '#js/input/tex/Configuration.js';
import {HandlerType, ConfigurationType} from '#js/input/tex/HandlerTypes.js';

/**********************************************************************************/
/**********************************************************************************/

describe('Textmacros', () => {

  beforeEach(() => setupTex(['base', 'newcommand', 'color', 'textmacros']));

  /********************************************************************************/

  test('Text plain', () => {
    expect(tex2mml('\\text{abc}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text macro', () => {
    expect(tex2mml('\\text{abc \\large abc}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text unknown macro', () => {
    expectTexError('\\text{\\xyz}')
      .toBe('Undefined control sequence \\xyz');
  });

  /********************************************************************************/

  test('Text substitution macro', () => {
    expect(tex2mml('\\def\\x{X} \\text{\\x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text mathmode macro', () => {
    expectTexError('\\text{\\frac{1}{2}}')
      .toBe('\\frac is only supported in math mode');
  });

  /********************************************************************************/

  test('Text internal math', () => {
    expect(tex2mml('\\text{a $\\frac{1}{2}$ b}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text internal math complex', () => {
    expect(tex2mml('\\text{a $x+y$ b}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Textbf ', () => {
    expect(tex2mml('\\def\\x{X} \\textbf{a\\x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text ref', () => {
    expect(tex2mml('\\textbf{a \\ref{a}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('HBox size', () => {
    expect(tex2mml('\\scriptstyle\\hbox{a}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text color', () => {
    expect(tex2mml('\\text{a\\color{red}b}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text color math', () => {
    expect(tex2mml('\\text{a\\color{red}b$c$}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text color math complex', () => {
    expect(tex2mml('\\text{a\\color{red}b$c+d$}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Unbalanced Braces', () => {
    expectTexError('\\text{a ${$ b }}')
      .toBe('Math mode is not properly terminated');
  });

  /********************************************************************************/

  test('Unbalanced Braces', () => {
    expectTexError('\\text{{a $}$ b }')
      .toBe('Extra close brace or missing open brace');
  });

  /********************************************************************************/

  test('Unbalanced Braces', () => {
    expectTexError('\\let\\x=}\\text{a \\x}')
      .toBe('Extra close brace or missing open brace');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Textmacros Specials', () => {

  beforeEach(() => setupTex(['base', 'textmacros']));

  /********************************************************************************/

  test('Dollar', () => {
    expect(tex2mml('\\text{a$b$}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Percent', () => {
    expect(tex2mml('\\text{a%comment\nb}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Hat', () => {
    expectTexError('\\text{a^b}').toBe("'^' allowed only in math mode");
  });

  /********************************************************************************/

  test('Underscore', () => {
    expectTexError('\\text{a_b}').toBe("'_' allowed only in math mode");
  });

  /********************************************************************************/

  test('Ampersand', () => {
    expectTexError('\\text{a&b}').toBe("Misplaced '&'");
  });

  /********************************************************************************/

  test('Hash', () => {
    expectTexError('\\text{a#b}').toBe("Misplaced '#'");
  });

  /********************************************************************************/

  test('Tilde', () => {
    expect(tex2mml('\\text{a~b}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Spaces', () => {
    expect(tex2mml('\\text{a b\t c\r d\n e\u{00A0}f\\ g}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Braces', () => {
    expect(tex2mml('\\text{a {b} c}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Quotes', () => {
    expect(tex2mml("\\text{a ``b'' `c' d}")).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Textmacros Macros', () => {

  beforeEach(() => setupTex(['base', 'newcommand', 'color', 'html', 'unicode', 'textmacros']));

  /********************************************************************************/

  test('Internal Math', () => {
    expect(tex2mml('\\text{a\\(b\\)}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Quoted Specials', () => {
    expect(tex2mml('\\text{a\\$b\\_c\\%d\\{e\\}f\\&g\\#h}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Newline', () => {
    expect(tex2mml('\\text{a\\\\b}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Accents', () => {
    expect(tex2mml("\\text{\\'a\\\u2019a\\`a\\\u2018a\\^a\\\"a\\~a\\=a\\.a\\u a\\v a}")).toMatchSnapshot();
  });

  /********************************************************************************/

  test('emph', () => {
    expect(tex2mml('\\text{a\\emph{b\\emph{c}}d}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('rm', () => {
    expect(tex2mml('\\text{a{\\rm b}c}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('mit', () => {
    expect(tex2mml('\\text{a{\\mit b}c}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('oldstyle', () => {
    expect(tex2mml('\\text{0{\\oldstyle 1}2}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('cal', () => {
    expect(tex2mml('\\text{a{\\cal B}c}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('it', () => {
    expect(tex2mml('\\text{a{\\it b}c}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('bf', () => {
    expect(tex2mml('\\text{a{\\bf b}c}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('sf', () => {
    expect(tex2mml('\\text{a{\\sf b}c}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('tt', () => {
    expect(tex2mml('\\text{a{\\tt b}c}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('frak', () => {
    expect(tex2mml('\\text{a{\\frak b}c}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Bbb', () => {
    expect(tex2mml('\\text{a{\\Bbb b}c}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Sizes small', () => {
    expect(tex2mml('\\text{{\\tiny a\\Tiny a \\scriptsize a \\small a\\normalsize a}a}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Sizes large', () => {
    expect(tex2mml('\\text{a\\large a\\Large a\\LARGE a\\huge a\\Huge a}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text fonts', () => {
    expect(tex2mml('\\text{\\Bbb a\\textnormal{a}\\textup{a}\\textrm{a}\\textit{a}\\textbf{a}\\textsf{a}\\texttt{a}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text symbols', () => {
    expect(tex2mml('\\text{\\dagger\\ddagger\\S\\AA a\\ldots b\\vdots c}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text space macros 1', () => {
    expect(tex2mml('\\text{a\\,b\\:c\\>d\\;e\\!f}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text space macros 2', () => {
    expect(tex2mml('\\text{a\\enspace b\\quad c\\qquad d\\thinspace e\\negthinspace f}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text spacing macros', () => {
    expect(tex2mml('\\text{a\\hskip 1emb\\hspace{1em}c\\kern{.1em}d\\mskip{1em}e\\mspace{1em}f\\mkern{.1em}g}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Text rules and spaces', () => {
    expect(tex2mml('\\text{\\Rule{1em}{.5em}{.5em}\\Space{1em}{.5em}{0em}\\rule[.25em]{1em}{.5em}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Color', () => {
    expect(tex2mml('\\text{{\\color{red}{x}}\\textcolor{yellow}{A}\\colorbox{green}{x}\\fcolorbox{blue}{orange}{x}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('HTML', () => {
    expect(tex2mml('\\text{\\href{tmp.html}{x}\\style{padding:3px}{x}\\class{test}{x}\\data{test=1}{x}\\cssId{test}{x}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Unicode', () => {
    expect(tex2mml('\\text{\\unicode{x61}\\U{3333}\\char"65}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Ref and Eqref', () => {
    expect(tex2mml('\\text{\\ref{a}\\eqref{b}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Underline', () => {
    expect(tex2mml('\\text{a \\underline{b c} d}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('lapping', () => {
    expect(tex2mml('\\text{\\rlap{a}-- --\\llap{b}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Phantoms', () => {
    expect(tex2mml('\\text{\\phantom{a}a\\vphantom{a}a\\hphantom{a}a\\smash{a}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('mmlToken', () => {
    expect(tex2mml('\\text{\\mmlToken{mo}{a}}')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Textmacros Autoload', () => {

  setupComponents({
    loader: {load: ['input/tex-base', '[tex]/textmacros', '[tex]/autoload']}
  });

  /********************************************************************************/

  test('Autoload not present', async () => {
    setupTexTypeset(['base', 'textmacros']);
    await expectTypesetError('\\text{\\href{tmp.html}{a}}')
      .toBe('Undefined control sequence \\href');
  });

  /********************************************************************************/

  test('Autoload', async () => {
    setupTexTypeset(['base', 'textmacros', 'autoload'])
    expect(
      await typeset2mml('\\text{\\href{tmp.html}{a}}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('No Autoload', async () => {
    Configuration.create('no-autoload', {
      [ConfigurationType.FALLBACK]: {
        [HandlerType.MACRO]: () => {}
      }
    });
    setupTexTypeset(['base', 'textmacros', 'no-autoload'])
    expect(
      await typeset2mml('\\text{\\href{tmp.html}{a}}')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('text-base'));
