import { afterAll, beforeEach, describe, expect, test } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError, trapErrors } from '#helpers';
import '#js/input/tex/mathtools/MathtoolsConfiguration';
import '#js/input/tex/ams/AmsConfiguration';
import '#js/input/tex/boldsymbol/BoldsymbolConfiguration';
import '#js/input/tex/bbox/BboxConfiguration';

import { Configuration } from '#js/input/tex/Configuration.js';
import { ConfigurationType } from '#js/input/tex/HandlerTypes.js';
import { AbstractTags } from '#js/input/tex/Tags.js';

beforeEach(() => setupTex(['base', 'ams', 'boldsymbol', 'mathtools']));

/**********************************************************************************/

describe('Mathtools Spacing Control', () => {

  test('mathllap', () => {
    expect(tex2mml('\\mathord{=}\\mathllap{x}\\quad \\mathord{=}\\mathllap[\\scriptstyle]{x}')).toMatchSnapshot();
  });

  test('mathrlap', () => {
    expect(tex2mml('\\mathrlap{x}\\mathord{=}\\quad \\mathrlap[\\scriptstyle]{x}\\mathord{=}')).toMatchSnapshot();
  });

  test('mathclap', () => {
    expect(tex2mml('X = \\sum_{\\mathclap{1\\le i\\le j\\le n}} X_{ij}')).toMatchSnapshot();
  });

  test('clap', () => {
    expect(tex2mml('X = \\sum_{\\clap{long text under}} X_{ij}')).toMatchSnapshot();
  });

  test('mathmakebox', () => {
    expect(tex2mml('\\mathmakebox[3em][l]{x+y}')).toMatchSnapshot();
  });

  test('mathmakebox [r]', () => {
    expect(tex2mml('\\mathmakebox[3em][r]{x+y}')).toMatchSnapshot();
  });

  test('mathmakebox [R]', () => {
    expect(tex2mml('\\mathmakebox[3em][R]{x+y}')).toMatchSnapshot();
  });

  test('mathmbox', () => {
    expect(tex2mml('\\mathmbox{x+y}')).toMatchSnapshot();
  });

  test('textllap', () => {
    expect(tex2mml('\\mathord{==}\\textllap{a b}')).toMatchSnapshot();
  });

  test('textrlap', () => {
    expect(tex2mml('\\textrlap{a b}\\mathord{==}')).toMatchSnapshot();
  });

  test('textclap', () => {
    expect(tex2mml('ab\\sum_{\\textclap{long text}}cd')).toMatchSnapshot();
  });

  test('cramped', () => {
    expect(tex2mml('x^2\\cramped{x^2}\\quad{\\scriptstyle x^2}\\cramped[\\scriptstyle]{x^2}')).toMatchSnapshot();
  });

  test('crampedllap', () => {
    expect(tex2mml('\\mathord{==}\\crampedllap{x^2}')).toMatchSnapshot();
  });

  test('crampedrlap', () => {
    expect(tex2mml('\\crampedrlap{x^2}\\mathord{==}')).toMatchSnapshot();
  });

  test('crampedclap', () => {
    expect(tex2mml('\\sum_{\\crampedclap{x^2}}')).toMatchSnapshot();
  });

  test('crampedsubstack', () => {
    expect(tex2mml('\\sum_{\\crampedsubstack{x^2\\\\y^2}}')).toMatchSnapshot();
  });

  test('adjustlimits', () => {
    expect(tex2mml('\\adjustlimits\\lim_{n\\to\\infty} \\max_{p^2\\ge n}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Mathtools Tagging', () => {

  test('newtagform', () => {
    expect(tex2mml('\\newtagform{brackets}{[}{]}\\usetagform{brackets} E=mc^2\\tag{1}')).toMatchSnapshot();
  });

  test('newtagform styled', () => {
    expect(tex2mml('\\newtagform{bfbrackets}[\\textbf]{[}{]}\\usetagform{bfbrackets} E=mc^2\\tag{1}')).toMatchSnapshot();
  });

  test('newtagform duplicate', () => {
    expectTexError('\\newtagform{a}{(}{)}\\newtagform{a}{((}{))}')
      .toBe('Duplicate tag form: a');
  });

  test('newtagform empty name', () => {
    expectTexError('\\newtagform{}{(}{)}')
      .toBe("Tag form name can't be empty");
  });

  test('usetagform undefined name', () => {
    expectTexError('\\usetagform{error}')
      .toBe('Undefined tag form: error');
  });

  test('renewtagform', () => {
    expect(tex2mml('\\newtagform{a}{(}{)}\\renewtagform{a}{((}{))}\\usetagform{a} E=mc^2\\tag{1}')).toMatchSnapshot();
  });

  test('refeq', () => {
    expect(tex2mml('\\begin{align}E=mc^2\\label{test}\\tag*{\\textsf{A}}\\\\ \\refeq{test}\\end{align}')).toMatchSnapshot();
  });

  test('Tags add', () => {
    setupTex(['base', 'ams', 'mathtools'], {tags: 'ams'});
    expect(tex2mml('\\newtagform{bars}||\\usetagform{bars} x\\tag{1}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Mathtools Symbols', () => {

  test('Delimiters', () => {
    expect(tex2mml('\\left\\lparen X \\right\\rparen')).toMatchSnapshot();
  });

  test('Other', () => {
    expect(tex2mml('\\ndownarrow \\nuparrow \\bigtimes_n')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Mathtools stretchy', () => {

  test('xleftrightarrow', () => {
    expect(tex2mml('\\xleftrightarrow{x+y}')).toMatchSnapshot();
  });

  test('xLeftarrow', () => {
    expect(tex2mml('\\xLeftarrow{x+y}')).toMatchSnapshot();
  });

  test('xRightarrow', () => {
    expect(tex2mml('\\xRightarrow{x+y}')).toMatchSnapshot();
  });

  test('xLeftrightarrow', () => {
    expect(tex2mml('\\xLeftrightarrow{x+y}')).toMatchSnapshot();
  });

  test('xhookleftarrow', () => {
    expect(tex2mml('\\xhookleftarrow{x+y}')).toMatchSnapshot();
  });

  test('xhookrightarrow', () => {
    expect(tex2mml('\\xhookrightarrow{x+y}')).toMatchSnapshot();
  });

  test('xmapsto', () => {
    expect(tex2mml('\\xmapsto{x+y}')).toMatchSnapshot();
  });

  test('xrightharpoondown', () => {
    expect(tex2mml('\\xrightharpoondown{x+y}')).toMatchSnapshot();
  });

  test('xleftharpoondown', () => {
    expect(tex2mml('\\xleftharpoondown{x+y}')).toMatchSnapshot();
  });

  test('xrightleftharpoons', () => {
    expect(tex2mml('\\xrightleftharpoons{x+y}')).toMatchSnapshot();
  });

  test('xleftrightharpoons', () => {
    expect(tex2mml('\\xleftrightharpoons{x+y}')).toMatchSnapshot();
  });

  test('xrightharpoonup', () => {
    expect(tex2mml('\\xrightharpoonup{x+y}')).toMatchSnapshot();
  });

  test('xleftharpoonup', () => {
    expect(tex2mml('\\xleftharpoonup{x+y}')).toMatchSnapshot();
  });

  test('xlongleftarrow', () => {
    expect(tex2mml('\\xlongleftarrow{x+y}')).toMatchSnapshot();
  });

  test('xLongleftarrow', () => {
    expect(tex2mml('\\xLongleftarrow{x+y}')).toMatchSnapshot();
  });

  test('xlongrightarrow', () => {
    expect(tex2mml('\\xlongrightarrow{x+y}')).toMatchSnapshot();
  });

  test('xLongrightarrow', () => {
    expect(tex2mml('\\xLongrightarrow{x+y}')).toMatchSnapshot();
  });

  test('underbracket', () => {
    expect(tex2mml('\\underbracket{x+y+z}_{\\text{$n$ times}}')).toMatchSnapshot();
  });

  test('underbracket thickness', () => {
    expect(tex2mml('\\underbracket[3px]{x+y+z}_{\\text{$n$ times}}')).toMatchSnapshot();
  });

  test('underbracket height', () => {
    expect(tex2mml('\\underbracket[][10px]{x+y+z}_{\\text{$n$ times}}')).toMatchSnapshot();
  });

  test('underbracket thickness height', () => {
    expect(tex2mml('\\underbracket[3px][10px]{x+y+z}_{\\text{$n$ times}}')).toMatchSnapshot();
  });

  test('overbracket', () => {
    expect(tex2mml('\\overbracket{x+y+z}^{\\text{$n$ times}}')).toMatchSnapshot();
  });

  test('overbracket thickness', () => {
    expect(tex2mml('\\overbracket[3px]{x+y+z}^{\\text{$n$ times}}')).toMatchSnapshot();
  });

  test('overbracket height', () => {
    expect(tex2mml('\\overbracket[][10px]{x+y+z}^{\\text{$n$ times}}')).toMatchSnapshot();
  });

  test('overbracket thickness height', () => {
    expect(tex2mml('\\overbracket[3px][10px]{x+y+z}^{\\text{$n$ times}}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Mathtools Matrix Environments', () => {

  test('matrix*', () => {
    expect(tex2mml('\\begin{matrix*} -1 & 3 \\\\ 2 & -4 \\end{matrix*}')).toMatchSnapshot();
  });

  test('matrix*[l]', () => {
    expect(tex2mml('\\begin{matrix*}[l] -1 & 3 \\\\ 2 & -4 \\end{matrix*}')).toMatchSnapshot();
  });

  test('matrix*[c]', () => {
    expect(tex2mml('\\begin{matrix*}[c] -1 & 3 \\\\ 2 & -4 \\end{matrix*}')).toMatchSnapshot();
  });

  test('matrix*[r]', () => {
    expect(tex2mml('\\begin{matrix*}[r] -1 & 3 \\\\ 2 & -4 \\end{matrix*}')).toMatchSnapshot();
  });

  test('pmatrix*', () => {
    expect(tex2mml('\\begin{pmatrix*} -1 & 3 \\\\ 2 & -4 \\end{pmatrix*}')).toMatchSnapshot();
  });

  test('pmatrix*[l]', () => {
    expect(tex2mml('\\begin{pmatrix*}[l] -1 & 3 \\\\ 2 & -4 \\end{pmatrix*}')).toMatchSnapshot();
  });

  test('pmatrix*[c]', () => {
    expect(tex2mml('\\begin{pmatrix*}[c] -1 & 3 \\\\ 2 & -4 \\end{pmatrix*}')).toMatchSnapshot();
  });

  test('pmatrix*[r]', () => {
    expect(tex2mml('\\begin{pmatrix*}[r] -1 & 3 \\\\ 2 & -4 \\end{pmatrix*}')).toMatchSnapshot();
  });

  test('bmatrix*', () => {
    expect(tex2mml('\\begin{bmatrix*} -1 & 3 \\\\ 2 & -4 \\end{bmatrix*}')).toMatchSnapshot();
  });

  test('bmatrix*[l]', () => {
    expect(tex2mml('\\begin{bmatrix*}[l] -1 & 3 \\\\ 2 & -4 \\end{bmatrix*}')).toMatchSnapshot();
  });

  test('bmatrix*[c]', () => {
    expect(tex2mml('\\begin{bmatrix*}[c] -1 & 3 \\\\ 2 & -4 \\end{bmatrix*}')).toMatchSnapshot();
  });

  test('bmatrix*[r]', () => {
    expect(tex2mml('\\begin{bmatrix*}[r] -1 & 3 \\\\ 2 & -4 \\end{bmatrix*}')).toMatchSnapshot();
  });

  test('Bmatrix*', () => {
    expect(tex2mml('\\begin{Bmatrix*} -1 & 3 \\\\ 2 & -4 \\end{Bmatrix*}')).toMatchSnapshot();
  });

  test('Bmatrix*[l]', () => {
    expect(tex2mml('\\begin{Bmatrix*}[l] -1 & 3 \\\\ 2 & -4 \\end{Bmatrix*}')).toMatchSnapshot();
  });

  test('Bmatrix*[c]', () => {
    expect(tex2mml('\\begin{Bmatrix*}[c] -1 & 3 \\\\ 2 & -4 \\end{Bmatrix*}')).toMatchSnapshot();
  });

  test('Bmatrix*[r]', () => {
    expect(tex2mml('\\begin{Bmatrix*}[r] -1 & 3 \\\\ 2 & -4 \\end{Bmatrix*}')).toMatchSnapshot();
  });

  test('vmatrix*', () => {
    expect(tex2mml('\\begin{vmatrix*} -1 & 3 \\\\ 2 & -4 \\end{vmatrix*}')).toMatchSnapshot();
  });

  test('vmatrix*[l]', () => {
    expect(tex2mml('\\begin{vmatrix*}[l] -1 & 3 \\\\ 2 & -4 \\end{vmatrix*}')).toMatchSnapshot();
  });

  test('vmatrix*[c]', () => {
    expect(tex2mml('\\begin{vmatrix*}[c] -1 & 3 \\\\ 2 & -4 \\end{vmatrix*}')).toMatchSnapshot();
  });

  test('vmatrix*[r]', () => {
    expect(tex2mml('\\begin{vmatrix*}[r] -1 & 3 \\\\ 2 & -4 \\end{vmatrix*}')).toMatchSnapshot();
  });

  test('Vmatrix*', () => {
    expect(tex2mml('\\begin{Vmatrix*} -1 & 3 \\\\ 2 & -4 \\end{Vmatrix*}')).toMatchSnapshot();
  });

  test('Vmatrix*[l]', () => {
    expect(tex2mml('\\begin{Vmatrix*}[l] -1 & 3 \\\\ 2 & -4 \\end{Vmatrix*}')).toMatchSnapshot();
  });

  test('Vmatrix*[c]', () => {
    expect(tex2mml('\\begin{Vmatrix*}[c] -1 & 3 \\\\ 2 & -4 \\end{Vmatrix*}')).toMatchSnapshot();
  });

  test('Vmatrix*[r]', () => {
    expect(tex2mml('\\begin{Vmatrix*}[r] -1 & 3 \\\\ 2 & -4 \\end{Vmatrix*}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Mathtools Small Matrix Environments', () => {

  test('smallmatrix*', () => {
    expect(tex2mml('\\begin{smallmatrix*} -a & b \\\\ c & -d \\end{smallmatrix*}')).toMatchSnapshot();
  });

  test('smallmatrix*[l]', () => {
    expect(tex2mml('\\begin{smallmatrix*}[l] -a & b \\\\ c & -d \\end{smallmatrix*}')).toMatchSnapshot();
  });

  test('smallmatrix*[c]', () => {
    expect(tex2mml('\\begin{smallmatrix*}[c] -a & b \\\\ c & -d \\end{smallmatrix*}')).toMatchSnapshot();
  });

  test('smallmatrix*[r]', () => {
    expect(tex2mml('\\begin{smallmatrix*}[r] -a & b \\\\ c & -d \\end{smallmatrix*}')).toMatchSnapshot();
  });

  test('psmallmatrix*', () => {
    expect(tex2mml('\\begin{psmallmatrix*} -a & b \\\\ c & -d \\end{psmallmatrix*}')).toMatchSnapshot();
  });

  test('psmallmatrix*[l]', () => {
    expect(tex2mml('\\begin{psmallmatrix*}[l] -a & b \\\\ c & -d \\end{psmallmatrix*}')).toMatchSnapshot();
  });

  test('psmallmatrix*[c]', () => {
    expect(tex2mml('\\begin{psmallmatrix*}[c] -a & b \\\\ c & -d \\end{psmallmatrix*}')).toMatchSnapshot();
  });

  test('psmallmatrix*[r]', () => {
    expect(tex2mml('\\begin{psmallmatrix*}[r] -a & b \\\\ c & -d \\end{psmallmatrix*}')).toMatchSnapshot();
  });

  test('bsmallmatrix*', () => {
    expect(tex2mml('\\begin{bsmallmatrix*} -a & b \\\\ c & -d \\end{bsmallmatrix*}')).toMatchSnapshot();
  });

  test('bsmallmatrix*[l]', () => {
    expect(tex2mml('\\begin{bsmallmatrix*}[l] -a & b \\\\ c & -d \\end{bsmallmatrix*}')).toMatchSnapshot();
  });

  test('bsmallmatrix*[c]', () => {
    expect(tex2mml('\\begin{bsmallmatrix*}[c] -a & b \\\\ c & -d \\end{bsmallmatrix*}')).toMatchSnapshot();
  });

  test('bsmallmatrix*[r]', () => {
    expect(tex2mml('\\begin{bsmallmatrix*}[r] -a & b \\\\ c & -d \\end{bsmallmatrix*}')).toMatchSnapshot();
  });

  test('Bsmallmatrix*', () => {
    expect(tex2mml('\\begin{Bsmallmatrix*} -a & b \\\\ c & -d \\end{Bsmallmatrix*}')).toMatchSnapshot();
  });

  test('Bsmallmatrix*[l]', () => {
    expect(tex2mml('\\begin{Bsmallmatrix*}[l] -a & b \\\\ c & -d \\end{Bsmallmatrix*}')).toMatchSnapshot();
  });

  test('Bsmallmatrix*[c]', () => {
    expect(tex2mml('\\begin{Bsmallmatrix*}[c] -a & b \\\\ c & -d \\end{Bsmallmatrix*}')).toMatchSnapshot();
  });

  test('Bsmallmatrix*[r]', () => {
    expect(tex2mml('\\begin{Bsmallmatrix*}[r] -a & b \\\\ c & -d \\end{Bsmallmatrix*}')).toMatchSnapshot();
  });

  test('vsmallmatrix*', () => {
    expect(tex2mml('\\begin{vsmallmatrix*} -a & b \\\\ c & -d \\end{vsmallmatrix*}')).toMatchSnapshot();
  });

  test('vsmallmatrix*[l]', () => {
    expect(tex2mml('\\begin{vsmallmatrix*}[l] -a & b \\\\ c & -d \\end{vsmallmatrix*}')).toMatchSnapshot();
  });

  test('vsmallmatrix*[c]', () => {
    expect(tex2mml('\\begin{vsmallmatrix*}[c] -a & b \\\\ c & -d \\end{vsmallmatrix*}')).toMatchSnapshot();
  });

  test('vsmallmatrix*[r]', () => {
    expect(tex2mml('\\begin{vsmallmatrix*}[r] -a & b \\\\ c & -d \\end{vsmallmatrix*}')).toMatchSnapshot();
  });

  test('Vsmallmatrix*', () => {
    expect(tex2mml('\\begin{Vsmallmatrix*} -a & b \\\\ c & -d \\end{Vsmallmatrix*}')).toMatchSnapshot();
  });

  test('Vsmallmatrix*[l]', () => {
    expect(tex2mml('\\begin{Vsmallmatrix*}[l] -a & b \\\\ c & -d \\end{Vsmallmatrix*}')).toMatchSnapshot();
  });

  test('Vsmallmatrix*[c]', () => {
    expect(tex2mml('\\begin{Vsmallmatrix*}[c] -a & b \\\\ c & -d \\end{Vsmallmatrix*}')).toMatchSnapshot();
  });

  test('Vsmallmatrix*[r]', () => {
    expect(tex2mml('\\begin{Vsmallmatrix*}[r] -a & b \\\\ c & -d \\end{Vsmallmatrix*}')).toMatchSnapshot();
  });

  test('smallmatrix', () => {
    expect(tex2mml('\\begin{smallmatrix} -a & b \\\\ c & -d \\end{smallmatrix}')).toMatchSnapshot();
  });

  test('smallmatrix', () => {
    expect(tex2mml('\\begin{smallmatrix} -a & b \\\\ c & -d \\end{smallmatrix}')).toMatchSnapshot();
  });

  test('psmallmatrix', () => {
    expect(tex2mml('\\begin{psmallmatrix} -a & b \\\\ c & -d \\end{psmallmatrix}')).toMatchSnapshot();
  });

  test('bsmallmatrix', () => {
    expect(tex2mml('\\begin{bsmallmatrix} -a & b \\\\ c & -d \\end{bsmallmatrix}')).toMatchSnapshot();
  });

  test('Bsmallmatrix', () => {
    expect(tex2mml('\\begin{Bsmallmatrix} -a & b \\\\ c & -d \\end{Bsmallmatrix}')).toMatchSnapshot();
  });

  test('vsmallmatrix', () => {
    expect(tex2mml('\\begin{vsmallmatrix} -a & b \\\\ c & -d \\end{vsmallmatrix}')).toMatchSnapshot();
  });

  test('Vsmallmatrix', () => {
    expect(tex2mml('\\begin{Vsmallmatrix} -a & b \\\\ c & -d \\end{Vsmallmatrix}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Mathtools More Environments', () => {

  test('multlined', () => {
    expect(tex2mml(
        'A = \\begin{multlined}[t]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined} B'
    )).toMatchSnapshot();
  });

  test('multlined [b] width', () => {
    expect(tex2mml(
        '\\begin{multlined}[b][7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined} = B'
    )).toMatchSnapshot();
  });

  test('multlined [c] width', () => {
    expect(tex2mml(
        '\\begin{multlined}[c][7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined} = B'
    )).toMatchSnapshot();
  });

  test('multlined [t] width', () => {
    expect(tex2mml(
        '\\begin{multlined}[t][7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined} = B'
    )).toMatchSnapshot();
  });

  test('multlined width', () => {
    expect(tex2mml('\\begin{multlined}[7cm]\\framebox[4cm]{first}\\\\\\framebox[4cm]{last}\\end{multlined}')).toMatchSnapshot();
  });

  test('multlined shoved', () => {
    expect(tex2mml(
        [
          '\\begin{multlined}[c][7cm]',
          '\\framebox[4cm]{first} \\\\',
          '\\shoveright{\\framebox[4cm]{second}} \\\\',
          '\\shoveleft{\\framebox[4cm]{third}} \\\\',
          '\\framebox[4cm]{last}',
          '\\end{multlined}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('multlined shoved distance', () => {
    expect(tex2mml(
        [
          '\\begin{multlined}[c][7cm]',
          '\\framebox[4cm]{first} \\\\',
          '\\shoveright[1cm]{\\framebox[4cm]{second}} \\\\',
          '\\shoveleft[1cm]{\\framebox[4cm]{third}} \\\\',
          '\\framebox[4cm]{last}',
          '\\end{multlined}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('shoved outside multline', () => {
    expectTexError('\\shoveleft')
      .toBe('\\shoveleft can only appear within the multline or multlined environments');
  });

  test('multlined shoved misplaced', () => {
    expectTexError(
      [
        '\\begin{multlined}[c][7cm]',
        '\\framebox[4cm]{first}\\shoveleft \\\\',
        '\\end{multlined}'
      ].join('')
    ).toBe('\\shoveleft must come at the beginning of the line');
  });

  test('multlined bad width', () => {
    expectTexError('\\begin{multlined}[abc] \\end{multlined}')
      .toBe('Width for \\begin{multlined} must be a dimension');
  });

  test('multlined empty row', () => {
    expect(tex2mml('\\begin{multlined} a \\\\ \\end{multlined}')).toMatchSnapshot();
  });

  test('dcases', () => {
    expect(tex2mml('\\begin{dcases} 1 & x>0 \\\\ -1 & x\\le 0 \\end{dcases}')).toMatchSnapshot();
  });

  test('dcases*', () => {
    expect(tex2mml('\\begin{dcases*} 1 & if $x>0$ \\\\ -1 & otherwise \\end{dcases*}')).toMatchSnapshot();
  });

  test('rcases', () => {
    expect(tex2mml('\\begin{rcases} 1 & x>0 \\\\ -1 & x\\le 0 \\end{rcases}')).toMatchSnapshot();
  });

  test('rcases*', () => {
    expect(tex2mml('\\begin{rcases*} 1 & if $x>0$ \\\\ -1 & otherwise \\end{rcases*}')).toMatchSnapshot();
  });

  test('drcases', () => {
    expect(tex2mml('\\begin{drcases} 1 & x>0 \\\\ -1 & x\\le 0 \\end{drcases}')).toMatchSnapshot();
  });

  test('drcases*', () => {
    expect(tex2mml('\\begin{drcases*} 1 & if $x>0$ \\\\ -1 & otherwise \\end{drcases*}')).toMatchSnapshot();
  });

  test('cases*', () => {
    expect(tex2mml('\\begin{cases*} 1 & if $x>0$ \\\\ -1 & otherwise \\end{cases*}')).toMatchSnapshot();
  });

  test('MoveEqLeft', () => {
    expect(tex2mml(
        [
          '\\begin{align*}',
          '\\MoveEqLeft \\framebox[10cm][c]{Long first line} \\\\',
          '  & = \\framebox[6cm][c]{ \\vphantom{g} 2nd line} \\\\',
          '  & \\leq \\dots',
          '\\end{align*}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('Spreadlines', () => {
    expect(tex2mml(
        [
          '\\begin{spreadlines}{20pt}',
          '\\begin{gather}',
          'a=b\\\\',
          'c=d',
          '\\end{gather}',
          '\\end{spreadlines}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('Spreadlines no environment', () => {
    expect(tex2mml(
        [
          '\\begin{spreadlines}{20pt}',
          'a=b',
          '\\end{spreadlines}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('Spreadlines multiple environments', () => {
    expect(tex2mml(
        [
          '\\begin{spreadlines}{20pt}',
          '\\begin{gather}',
          'a=b\\\\',
          'c=d',
          '\\end{gather}',
          '\\\\',
          '\\begin{gather}',
          'x=y\\\\',
          'z',
          '\\end{gather}',
          '\\end{spreadlines}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('lgathered', () => {
    expect(tex2mml('\\begin{lgathered} a+b+c \\\\ d \\end{lgathered}')).toMatchSnapshot();
  });

  test('rgathered', () => {
    expect(tex2mml('\\begin{rgathered} a+b+c \\\\ d \\end{rgathered}')).toMatchSnapshot();
  });

  test('ArrowBetweenLines', () => {
    expect(tex2mml(
        [
          '\\begin{alignat*}{2}',
          '&& \\framebox[1.5cm]{} &= \\framebox[3cm]{} \\\\',
          '\\ArrowBetweenLines',
          '&& \\framebox[1.5cm]{} &= \\framebox[2cm]{}',
          '\\end{alignat*}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('ArrowBetweenLines*', () => {
    expect(tex2mml(
        [
          '\\begin{alignat*}{2}',
          '&& \\framebox[1.5cm]{} &= \\framebox[3cm]{} &&\\\\',
          '\\ArrowBetweenLines*[\\Downarrow]',
          '&& \\framebox[1.5cm]{} &= \\framebox[2cm]{} &&',
          '\\end{alignat*}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('ArrowBetweenLines misplaced', () => {
    expectTexError('\\begin{aligned} a \\ArrowBetweenLines \\end{aligned}')
      .toBe('\\ArrowBetweenLines must be on a row by itself');
  });

  test('ArrowBetweenLines error', () => {
    expectTexError('\\ArrowBetweenLines')
      .toBe('\\ArrowBetweenLines can only be used in aligment environments');
  });

  test('vdotswithin smallvdotswithin', () => {
    expect(tex2mml(
        [
          '\\begin{align*}',
          'a &= b \\\\',
          '& \\vdotswithin{=} \\\\',
          '& = c \\\\',
          '\\shortvdotswithin{=}',
          '& = d',
          '\\end{align*}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('smallvdotswithin star', () => {
    expect(tex2mml(
        [
          '\\begin{aligned}',
          'A&+ B \\\\',
          '&\\shortvdotswithin*{+}',
          'C &+ D',
          '\\end{aligned}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('vdotswithin smallvdotswithin', () => {
    expect(tex2mml(
        [
          '\\begin{alignat*}{3}',
          'A&+ B &&= C &&+ D \\\\',
          '\\MTFlushSpaceAbove',
          '&\\vdotswithin{+} &&&& \\vdotswithin{+}',
          '\\MTFlushSpaceBelow ',
          'C &+ D &&= Y &&+K',
          '\\end{alignat*}'
        ].join('')
    )).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Mathtools Paired Delimiters', () => {

  test('DeclarePairedDelimiter', () => {
    expect(tex2mml('\\DeclarePairedDelimiter\\abs{\\lvert}{\\rvert} \\abs{\\frac{a}{b}}')).toMatchSnapshot();
  });

  test('DeclarePairedDelimiter star', () => {
    expect(tex2mml('\\DeclarePairedDelimiter\\abs{\\lvert}{\\rvert} \\abs*{\\frac{a}{b}}')).toMatchSnapshot();
  });

  test('DeclarePairedDelimiter size', () => {
    expect(tex2mml('\\DeclarePairedDelimiter\\abs{\\lvert}{\\rvert} \\abs[\\Bigg]{\\frac{a}{b}}')).toMatchSnapshot();
  });

  test('DeclarePairedDelimiter duplicate', () => {
    expectTexError('\\DeclarePairedDelimiter\\abs{\\lvert}{\\rvert} \\DeclarePairedDelimiter\\abs{|}{|}')
      .toBe('Command \\abs already defined');
  });

  test('DeclarePairedDelimiterX', () => {
    expect(tex2mml('\\DeclarePairedDelimiterX\\x[1]{\\lvert}{\\rvert}{a#1b} \\x{X}')).toMatchSnapshot();
  });

  test('DeclarePairedDelimiterXPP', () => {
    expect(tex2mml('\\DeclarePairedDelimiterXPP\\x[1]{A}{\\lvert}{\\rvert}{B}{a#1b} \\x{X}')).toMatchSnapshot();
  });

  test('DeclarePairedDelimiters Backward Compatibility', () => {
    expect(tex2mml(
        [
          '\\DeclarePairedDelimiters\\a{|}{|}',
          '\\DeclarePairedDelimitersX\\b[1]{|}{|}{#1}',
          '\\DeclarePairedDelimitersXPP\\c[1]{A}{|}{|}{B}{#1}',
        ].join('')
    )).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Mathtools Boxed Equations', () => {

  test('Aboxed', () => {
    expect(tex2mml('\\begin{align*}\\Aboxed{ a & = b} \\\\ & = c \\end{align*}')).toMatchSnapshot();
  });

  test('Aboxed error', () => {
    expectTexError('\\Aboxed{ a & = b}')
      .toBe('\\Aboxed can only be used in aligment environments');
  });

  test('Aboxed odd column', () => {
    expect(tex2mml('\\begin{aligned} & \\Aboxed{ a & = b} \\end{aligned}')).toMatchSnapshot();
  });

  test('MakeAboxedCommand', () => {
    expect(tex2mml('\\MakeAboxedCommand\\Afbox\\fbox \\begin{align}\\Afbox{a &= b}\\end{align}')).toMatchSnapshot();
  });

  test('MakeAboxedCommand star', () => {
    setupTex(['base', 'ams', 'newcommand', 'bbox', 'mathtools']);
    expect(tex2mml(
        '\\def\\mybox#1{\\bbox[yellow, 5px, border:2px solid]{#1}}\\MakeAboxedCommand*\\Afbox\\mybox \\begin{align}\\Afbox{a &= b}\\end{align}'
    )).toMatchSnapshot();
  });

  test('MakeAboxedCommand no cs', () => {
    expectTexError('\\MakeAboxedCommand x')
      .toBe('\\MakeAboxedCommand must be followed by a control sequence');
  });

  test('MakeAboxedCommand no box', () => {
    expectTexError('\\MakeAboxedCommand\\x x')
      .toBe('\\MakeAboxedCommand\\x must be followed by a control sequence');
  });

  test('MakeAboxedCommand redefined', () => {
    expectTexError('\\MakeAboxedCommand*\\x\\boxed \\MakeAboxedCommand\\x\\fbox')
      .toBe('\\x is already defined');
  });

});

/**********************************************************************************/

describe('Mathtools Centered Colons', () => {

  test(':=', () => {
    expect(tex2mml('a := b')).toMatchSnapshot();
  });

  test('vcentercolon', () => {
    expect(tex2mml('a \\vcentercolon= b')).toMatchSnapshot();
  });

  test('ordinarycolon', () => {
    expect(tex2mml('a \\ordinarycolon= b')).toMatchSnapshot();
  });

  test('coloneq', () => {
    expect(tex2mml('a \\coloneq b')).toMatchSnapshot();
  });

  test('Coloneq', () => {
    expect(tex2mml('a \\Coloneq b')).toMatchSnapshot();
  });

  test('coloneqq', () => {
    expect(tex2mml('a \\coloneqq b')).toMatchSnapshot();
  });

  test('Coloneqq', () => {
    expect(tex2mml('a \\Coloneqq b')).toMatchSnapshot();
  });

  test('eqqcolon', () => {
    expect(tex2mml('a \\eqqcolon b')).toMatchSnapshot();
  });

  test('Eqqcolon', () => {
    expect(tex2mml('a \\Eqqcolon b')).toMatchSnapshot();
  });

  test('eqcolon', () => {
    expect(tex2mml('a \\eqcolon b')).toMatchSnapshot();
  });

  test('Eqcolon', () => {
    expect(tex2mml('a \\Eqcolon b')).toMatchSnapshot();
  });

  test('colonapprox', () => {
    expect(tex2mml('a \\colonapprox b')).toMatchSnapshot();
  });

  test('Colonapprox', () => {
    expect(tex2mml('a \\Colonapprox b')).toMatchSnapshot();
  });

  test('colonsim', () => {
    expect(tex2mml('a \\colonsim b')).toMatchSnapshot();
  });

  test('Colonsim', () => {
    expect(tex2mml('a \\Colonsim b')).toMatchSnapshot();
  });

  test('dblcolon', () => {
    expect(tex2mml('a \\dblcolon b')).toMatchSnapshot();
  });

  test('approxcolon', () => {
    expect(tex2mml('a \\approxcolon b')).toMatchSnapshot();
  });

  test('Approxcolon', () => {
    expect(tex2mml('a \\Approxcolon b')).toMatchSnapshot();
  });

  test('simcolon', () => {
    expect(tex2mml('a \\simcolon b')).toMatchSnapshot();
  });

  test('Simcolon', () => {
    expect(tex2mml('a \\Simcolon b')).toMatchSnapshot();
  });

  test('colondash', () => {
    expect(tex2mml('a \\colondash b')).toMatchSnapshot();
  });

  test('Colondash', () => {
    expect(tex2mml('a \\Colondash b')).toMatchSnapshot();
  });

  test('dashcolon', () => {
    expect(tex2mml('a \\dashcolon b')).toMatchSnapshot();
  });

  test('Dashcolon', () => {
    expect(tex2mml('a \\Dashcolon b')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Mathtools Prescripts', () => {

  test('prescripts sub sup', () => {
    expect(tex2mml('\\prescript{a}{b}{X}^{c}_{d}')).toMatchSnapshot();
  });

  test('prescripts sub', () => {
    expect(tex2mml('\\prescript{a}{}{X}^{c}_{d}')).toMatchSnapshot();
  });

  test('prescripts sup', () => {
    expect(tex2mml('\\prescript{}{b}{X}^{c}_{d}')).toMatchSnapshot();
  });

  test('prescripts no post sub', () => {
    expect(tex2mml('\\prescript{}{b}{X}^{c}')).toMatchSnapshot();
  });

  test('prescripts no post sup', () => {
    expect(tex2mml('\\prescript{}{b}{X}_{d}')).toMatchSnapshot();
  });

  test('prescripts no postscripts', () => {
    expect(tex2mml('\\prescript{a}{b}{X}')).toMatchSnapshot();
  });

  test('prescripts empty', () => {
    expect(tex2mml('\\prescript{\\mathbf{}}{}{X}^{c}_{d}')).toMatchSnapshot();
  });

  test('prescripts empty no postscripts', () => {
    expect(tex2mml('\\prescript{\\mathbf{}}{}{X}')).toMatchSnapshot();
  });

  test('prescript filter ingores others', () => {
    expect(tex2mml('\\sideset{^a}{C}{_b}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Mathtools Split Fractions', () => {

  test('splitfrac', () => {
    expect(tex2mml('\\frac{\\splitfrac{x + y}{+ x + y}}{z}=\\frac{\\splitdfrac{x + y}{+ x + y}}{z}')).toMatchSnapshot();
  });

  test('splitfrac nested', () => {
    expect(tex2mml('\\frac{\\splitfrac{x + x + z}{\\splitfrac{\\mathstrut x + y + z}{+ x + y + z}}}{z}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Mathtools struts', () => {

  test('xmathstrut', () => {
    expect(tex2mml('\\xmathstrut{0.1}')).toMatchSnapshot();
  });

  test('xmathstrut', () => {
    expect(tex2mml('\\xmathstrut[0.2]{0.1}')).toMatchSnapshot();
  });

  test('xmathstrut error', () => {
    expectTexError('\\xmathstrut{abc}')
      .toBe('Argument to \\xmathstrut is not a number');
  });

});

/**********************************************************************************/

describe('Mathtools setoptions', () => {

  test('multlined gap and pos', () => {
    expect(tex2mml(
        [
          '\\mathtoolsset{multlined-gap=2em,multlined-pos=b}',
          'a+\\begin{multlined} a \\\\ b \\end{multlined}+b'
        ].join('')
    )).toMatchSnapshot();
  });

  test('multlined-pos override', () => {
    expect(tex2mml(
        [
          '\\mathtoolsset{multlined-gap=2em,multlined-pos=b}',
          'a+\\begin{multlined}[b] a \\\\ b \\end{multlined}+b'
        ].join('')
    )).toMatchSnapshot();
  });

  test('multlined skips', () => {
    expect(tex2mml(
        [
          '\\mathtoolsset{multlined-gap=2em,firstline-afterskip=3em,lastline-preskip=1em}',
          '\\begin{multlined}[b] a \\\\ b \\end{multlined}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('multlined width', () => {
    expect(tex2mml(
        [
          '\\mathtoolsset{multlined-width=5em}',
          '\\begin{multlined} a \\\\ b \\end{multlined}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('smallmatrix-align', () => {
    expect(tex2mml(
        [
          '\\mathtoolsset{smallmatrix-align=r}',
          '\\begin{psmallmatrix*} a \\\\ -b \\end{psmallmatrix*}'
        ].join('')
    )).toMatchSnapshot();
  });

  test('contercolon', () => {
    expect(tex2mml('\\mathtoolsset{centercolon=true} a := b')).toMatchSnapshot();
  });

  test('contercolon-offset', () => {
    expect(tex2mml('\\mathtoolsset{centercolon-offset=.6em} a \\vcentercolon= b')).toMatchSnapshot();
  });

  test('thincolor dx and dw', () => {
    expect(tex2mml('\\mathtoolsset{thincolon-dx=-.06em,thincolon-dw=.12em} a \\coloneq b')).toMatchSnapshot();
  });

  test('use-unicode', () => {
    expect(tex2mml(
        '\\mathtoolsset{use-unicode=true}\\coloneq\\Coloneqq\\coloneq\\Coloneqq\\eqqcolon\\eqcolon\\dblcolon\\dashcolon'
    )).toMatchSnapshot();
  });

  test('prescript formats', () => {
    expect(tex2mml(
        [
          '\\mathtoolsset{prescript-sub-format=\\mathbf,prescript-sup-format=\\mathsf}',
          '\\mathtoolsset{prescript-arg-format=\\mathfrak}',
          '\\prescript{a}{b}{X}^{c}_{d}'
        ].join('')
    )).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Mathtools options', () => {

  beforeEach(() => {});

  test('setoptions', () => {
    setupTex(['base', 'mathtools'], {mathtools: {'allow-mathtoolsset': false}});
    expectTexError('\\mathtoolsset{use-unicode=true}')
      .toBe('\\mathtoolsset is disabled');
  });

  test('tagforms', () => {
    setupTex(['base', 'ams', 'mathtools'], {
      mathtools: {
        tagforms: {
          bold: ['[[', ']]', '\\mathbf']
        }
      }
    });
    expect(tex2mml('\\usetagform{bold} a=b\\tag{x}')).toMatchSnapshot();
  });

  test('tagforms error', () => {
    expect(trapErrors(() => {
      setupTex(['base', 'ams', 'mathtools'], {
        mathtools: {
          tagforms: {
            bold: ['[[', ']]', '\\mathbf', 'error']
          }
        }
      });
    })).toBe('The tag form definition for "bold" should be an array of three strings');
  });

  test('tagforms reset', () => {
    setupTex(['base', 'ams', 'mathtools'], {
      mathtools: {
        tagforms: {
          bold: ['[[', ']]', '\\mathbf']
        }
      }
    });
    expect(tex2mml('\\usetagform{bold} \\usetagform{} a\\tag{1}')).toMatchSnapshot();
  });

  test('non-ams tags', () => {
    class myTags extends AbstractTags {
      formatTag(tag: string) {return ['[[', tag, ']]']}
    };
    Configuration.create('mytags', {
      [ConfigurationType.TAGS]: {mytags: myTags},
      [ConfigurationType.CONFIG]: (config: any, jax: any) => {
        jax.parseOptions.options.tags = 'mytags';
        jax.constructor.tags(jax.parseOptions, config);
      }
    });
    setupTex(['base', 'ams', 'mathtools', ['mytags', 10]], {tags: 'ams'});
    expectTexError('\\newtagform{a}()')
      .toBe('\\newtagform can only be used with ams or mathtools tags');
    expectTexError('\\usetagform{bold}')
      .toBe('\\usetagform can only be used with ams or mathtools tags');
  });

  test('pairedDelimiters', () => {
    setupTex(['base', 'ams', 'mathtools'], {
      mathtools: {
        pairedDelimiters: {
          aaa: ['[', ']'],
          bbb: ['|', '|', '[#1]', 1],
          ccc: ['\\{', '\\}', '[#1]', 1, '\\Rightarrow', '\\Leftarrow'],
        }
      }
    });
    expect(tex2mml('\\aaa{x} \\aaa*{x} \\aaa[\\bigg]{x}')).toMatchSnapshot();
    expect(tex2mml('\\bbb{x} \\bbb*{x} \\bbb[\\bigg]{x}')).toMatchSnapshot();
    expect(tex2mml('\\ccc{x} \\ccc*{x} \\ccc[\\bigg]{x}')).toMatchSnapshot();
  });

  test('mathtoolsset', () => {
    setupTex(['base', 'ams', 'mathtools']);
    expect(tex2mml('\\mathtoolsset{multlined-pos={}}\\begin{multlined} a \\end{multlined}')).toMatchSnapshot();
  });

  test('mathtoolsset legacycolonsymbols', () => {
    setupTex(['base', 'ams', 'mathtools']);
    expect(tex2mml('\\mathtoolsset{legacycolonsymbols}\\coloneq\\Coloneq\\eqcolon\\Eqcolon')).toMatchSnapshot();
  });

  test('legacycolonsymbols option', () => {
    setupTex(['base', 'ams', 'mathtools'], {mathtools: {legacycolonsymbols: true}});
    expect(tex2mml('\\coloneq\\Coloneq\\eqcolon\\Eqcolon')).toMatchSnapshot();
    expect(tex2mml('\\mathtoolsset{legacycolonsymbols=false}\\coloneq\\Coloneq\\eqcolon\\Eqcolon')).toMatchSnapshot();
  });

});

/**********************************************************************************/

afterAll(() => getTokens('mathtools'));
