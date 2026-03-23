import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/newcommand/NewcommandConfiguration';
import '#js/input/tex/ams/AmsConfiguration';
import '#js/input/tex/colorv2/ColorV2Configuration';

/**********************************************************************************/

describe('Newcommand', () => {
  beforeEach(() => setupTex(['base', 'newcommand']));

  it('Newcommand Simple', () => {
    expect(tex2mml('\\newcommand{\\sum}{2 + 3}\\sum')).toMatchSnapshot();
  });

  it('Newcommand Arg', () => {
    expect(tex2mml('\\renewcommand{\\sum}[1]{2 #1 3}\\sum{*}')).toMatchSnapshot();
  });

  it('Newcommand Optional', () => {
    expect(tex2mml('\\renewcommand{\\sum}[1][+]{2 #1 3}\\sum\\sum[*]')).toMatchSnapshot();
  });

  it('Newcommand Arg Optional', () => {
    expect(tex2mml('\\renewcommand{\\sum}[2][+]{2 #1 3 #2 4}\\sum{+}\\sum[*]{+}')).toMatchSnapshot();
  });

  it('Newenvironment Optional', () => {
    expect(tex2mml(
        '\\newenvironment{argument}[1][a]{\\textbf{Argument #1:}}{aa}\\begin{argument}[c]b\\end{argument}'
    )).toMatchSnapshot();
  });

  it('Newenvironment Optional Noarg', () => {
    expect(tex2mml(
        '\\newenvironment{argument}[1][a]{\\textbf{Argument #1:}}{aa}\\begin{argument}b\\end{argument}'
    )).toMatchSnapshot();
  });

  it('Newenvironment Arg Optional', () => {
    expect(tex2mml(
        '\\renewenvironment{argument}[2][a]{\\textbf{Argument #1(#2):}}{aa}\\begin{argument}[c]{3}b\\end{argument}'
    )).toMatchSnapshot();
  });

  it('Def Double Let', () => {
    expect(tex2mml(
        '\\def\\bar{h}\\let\\fooi\\bar\\def\\fooii{\\bar}\\fooi +\\fooii\\def\\bar{g}\\fooi +\\fooii'
    )).toMatchSnapshot();
  });

  it('Def ReDef', () => {
    expect(tex2mml(
        '\\def\\foo{a + b}\\foo\\def\\foo#1{a #1 b}\\foo{-}\\def\\foo#1#2{#2 #1 b}\\foo{-}{x}'
    )).toMatchSnapshot();
  });

  it('Let Brace Equal', () => {
    expect(tex2mml('\\let\\be={ \\be a}')).toMatchSnapshot();
  });

  it('Let Brace', () => {
    expect(tex2mml('\\let\\be{ \\be a}')).toMatchSnapshot();
  });

  it('Let Caret', () => {
    expect(tex2mml('\\let\\car^ a\\car b')).toMatchSnapshot();
  });

  it('Let Brace Delim', () => {
    expect(tex2mml('\\let\\lb=\\{ \\lb \\frac{1}{2} \\}')).toMatchSnapshot();
  });

  it('Let Paren Delim', () => {
    expect(tex2mml('\\let\\lb( \\lb \\frac{1}{2})')).toMatchSnapshot();
  });

  it('Let Relet', () => {
    expect(tex2mml('\\let\\al\\alpha\\al\\alpha\\let\\al\\aleph\\al\\alpha')).toMatchSnapshot();
  });

  it('Let Let', () => {
    expect(tex2mml('\\let\\al\\alpha\\al\\alpha\\let\\alpha\\beta\\al\\alpha')).toMatchSnapshot();
  });

  it('Def Let', () => {
    expect(tex2mml('\\def\\bar[#1]#2{#1 + #2}\\bar[a]{b}\\let\\foo\\bar\\foo[c]{d}')).toMatchSnapshot();
  });

  it('Newcommand Let', () => {
    expect(tex2mml(
        '\\newcommand{\\bar}[2][1]{#1 + #2}\\bar[a]{b}\\let\\foo\\bar\\foo[c]{d}'
    )).toMatchSnapshot();
  });

  it('Let Circular Macro', () => {
    expect(tex2mml(
        '\\let\\kk\\alpha\\kk\\let\\rr\\beta\\rr\\let\\rr\\kk\\let\\kk\\beta\\kk\\rr'
    )).toMatchSnapshot();
  });

  it('Let Brace Equal Stretchy', () => {
    expect(tex2mml('\\let\\lb=\\{\\left\\lb \\frac{1}{2} \\right\\}')).toMatchSnapshot();
  });

  it('Let Paren Stretchy', () => {
    expect(tex2mml('\\let\\lb( \\left\\lb \\frac{1}{2} \\right)')).toMatchSnapshot();
  });

  it('Let Fn', () => {
    expect(tex2mml('\\let\\ll\\sin\\ll(x)')).toMatchSnapshot();
  });

  it('Let Fn Double', () => {
    expect(tex2mml('\\let\\ll\\sin\\ll(x)\\let\\rr\\ll\\let\\ll\\cos\\rr(x)\\ll(x)')).toMatchSnapshot();
  });

  it('Let Fn Circular', () => {
    expect(tex2mml(
        '\\let\\save\\sin\\let\\sin\\cos\\let\\cos\\tan\\let\\tan\\save\\sin(x)\\cos(x)\\tan(x)'
    )).toMatchSnapshot();
  });

  it('Let Paren Circular', () => {
    expect(tex2mml(
        '\\let\\lp(\\let\\rp)\\let\\mp\\rp\\left\\lp \\frac{a}{b}\\middle\\mp c \\right\\rp'
    )).toMatchSnapshot();
  });

  it('Let Angle Circular', () => {
    expect(tex2mml(
        '\\let\\lp\\langle\\let\\rp\\rangle\\let\\mp\\rp\\left\\lp \\frac{a}{b}\\middle\\mp c \\right\\rp'
    )).toMatchSnapshot();
  });

  it('Let Circular Character', () => {
    expect(tex2mml(
        '\\let\\a a\\let\\b b\\a \\b\\let\\c\\a\\let\\a c\\c \\a\\let\\d=\\c\\let\\c\\b\\d \\c'
    )).toMatchSnapshot();
  });

  it('Let Self', () => {
    expectTexError('\\let\\x\\x \\x')
      .toBe('Undefined control sequence \\x');
  });

  it('Let Overwrite Sqrt Choose', () => {
    expect(tex2mml('\\let\\sqrt\\choose a\\sqrt b')).toMatchSnapshot();
  });

  it('Def Optional Brace', () => {
    expect(tex2mml('\\def\\bar[#1]#2{#1 + #2}\\bar[{a}]{b}')).toMatchSnapshot();
  });

  it('Def Options CS', () => {
    expect(tex2mml('\\def\\bar[#1]#2{#1 + #2}\\bar[\\sqrt{2}]{b}')).toMatchSnapshot();
  });

  it('Def Template Matching', () => {
    expect(tex2mml('\\def\\ending{+}\\def\\test#1\\end{[#1]} \\test a\\ending b\\end')).toMatchSnapshot();
  });

  it('Def Template Brace Removal', () => {
    expect(tex2mml('\\def\\test#1\\end{\\text{#1}} \\test{a b}\\end')).toMatchSnapshot();
  });

  it('Def Template Brace Retention', () => {
    expect(tex2mml('\\def\\test#1\\end{\\text{#1}} \\test{a}{b}\\end')).toMatchSnapshot();
  });

  it('Def Hash Replacement', () => {
    expect(tex2mml('\\def\\x#1{\\def\\y##1#1{[##1]}\\y} \\x\\X abc \\X')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Newcommand Color v2', () => {
  beforeEach(() => setupTex(['base', 'newcommand', 'colorv2']));

  it('Newenvironment Empty', () => {
    expect(tex2mml(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\begin{myHeartEnv}\\end{myHeartEnv}'
    )).toMatchSnapshot();
  });

  it('Newenvironment Content', () => {
    expect(tex2mml(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\begin{myHeartEnv}  2+3\\end{myHeartEnv}'
    )).toMatchSnapshot();
  });

  it('Newenvironment Nested Double', () => {
    expect(tex2mml(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\end{yourHeartEnv}\\end{myHeartEnv}'
    )).toMatchSnapshot();
  });

  it('Newenvironment Nested Double 2', () => {
    expect(tex2mml(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\newenvironment{theirHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\end{yourHeartEnv}\\begin{theirHeartEnv}b\\end{theirHeartEnv}\\end{myHeartEnv}'
    )).toMatchSnapshot();
  });

  it('Newenvironment Nested Triple', () => {
    expect(tex2mml(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\newenvironment{theirHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\begin{theirHeartEnv}b\\end{theirHeartEnv}\\end{yourHeartEnv}\\end{myHeartEnv}'
    )).toMatchSnapshot();
  });

  it('Newenvironment Nested Triple Text', () => {
    expect(tex2mml(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\newenvironment{theirHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\begin{theirHeartEnv}b\\end{theirHeartEnv}c\\end{yourHeartEnv}d\\end{myHeartEnv}'
    )).toMatchSnapshot();
  });

  it('Newenvironment Nested Error', () => {
    expectTexError(
        '\\newenvironment{myHeartEnv}{\\color{purple}{\\heartsuit}\\kern-2.5pt\\color{green}{\\heartsuit}}{\\text{ forever}}\\newenvironment{yourHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\newenvironment{theirHeartEnv}{\\color{blue}{\\heartsuit}\\kern-2.5pt\\color{black}{\\heartsuit}}{\\text{ never}}\\begin{myHeartEnv}\\begin{yourHeartEnv}a\\begin{theirHeartEnv}b\\end{yourHeartEnv}\\end{theirHeartEnv}\\end{myHeartEnv}'
      )
      .toBe('\\begin{theirHeartEnv} ended with \\end{yourHeartEnv}');
  });

});

/**********************************************************************************/

describe('Newcommand Ams', () => {
  beforeEach(() => setupTex(['base', 'newcommand', 'ams']));

  it('Newenvironment Align', () => {
    expectTexError(
      '\\newenvironment{proof}{\\textbf{Proof:}}{\\begin{align} \\blacksquare \\end{align}}\\begin{proof}a=b\\end{proof}'
    ).toBe('Erroneous nesting of equation structures');
  });

  it('Newenvironment Align End', () => {
    expectTexError(
      '\\newenvironment{proof}{\\begin{align}\\textbf{Proof:}}{\\end{align}}\\begin{proof}a=b\\end{proof}'
    ).toBe('Erroneous nesting of equation structures');
  });

  it('Newenvironment Align Split', () => {
    expectTexError(
      '\\newenvironment{proof}{\\begin{align}\\textbf{Proof:}&}{ \\begin{split} 5 \\end{split}&& \\blacksquare\\end{align}}\\begin{proof}a&=b\\end{proof}'
    ).toBe('Erroneous nesting of equation structures');
  });

  it('Let Bar', () => {
    expect(tex2mml('\\let\\b\\lvert\\let\\lvert\\langle\\vert\\b\\lvert')).toMatchSnapshot();
  });

  it('Let Bar Stretchy', () => {
    expect(tex2mml('\\let\\b\\lvert\\let\\lvert\\langle\\left\\b q \\right\\lvert')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('NewcommandError', () => {
  beforeEach(() => setupTex(['base', 'newcommand']));

  it('No Sequence', () => {
    expectTexError('\\def\\bar[#1]#3{}')
      .toBe('Parameters for \\bar must be numbered sequentially');
  });

  it('No CS', () => {
    expectTexError('\\def{\\bar}[#1]#2{}')
      .toBe('\\def must be followed by a control sequence');
  });

  it('Illegal Hash', () => {
    expectTexError('\\def\\bar[##1]#2{#1}')
      .toBe('Illegal use of # in template for \\bar');
  });

  it('No Replacement', () => {
    expectTexError('\\def\\bar[#1]#2')
      .toBe('Missing replacement string for definition of \\def');
  });

  it('Runaway Argument', () => {
    expectTexError('\\def\\bar[#1]#2{}\\bar[')
      .toBe('Runaway argument for \\bar?');
  });

  it('Illegal CS', () => {
    expectTexError('\\newcommand{\\11}{a}')
      .toBe('Illegal control sequence name for \\newcommand');
  });

  it('Illegal Parameter Number', () => {
    expectTexError('\\newenvironment{hh}[a]{}{}')
      .toBe('Illegal number of parameters specified in \\newenvironment');
  });

  it('Let Undefined CS', () => {
    expectTexError('\\let\\aa\\bb \\aa')
      .toBe('Undefined control sequence \\aa');
  });

  it('Missing Arguments', () => {
    expectTexError('\\def\\bar[#1]#2#3{c + c}\\bar')
      .toBe('Use of \\bar doesn\'t match its definition');
  });

  it('Single Let Error', () => {
    expectTexError('\\let\\aa\\textbf\\let\\bb\\aa\\aa')
      .toBe('Missing argument for \\aa');
  });

  it('Double Let Error', () => {
    expectTexError('\\let\\aa\\textbf\\let\\bb\\aa\\bb')
      .toBe('Missing argument for \\bb');
  });

  it('Triple Let Error', () => {
    expectTexError('\\let\\aa\\textbf\\let\\bb\\aa\\let\\textbf\\sqrt\\textbf[1]')
      .toBe('Missing argument for \\textbf');
  });

  it('Illegal Argument Number', () => {
    expectTexError('\\newcommand{\\foo}[a]{#1 + #2}')
      .toBe('Illegal number of parameters specified in \\newcommand');
  });

  it('Optional Brace Error', () => {
    expectTexError('\\def\\bar[{#1}]#2{#1 + #2}')
      .toBe("You can't use 'macro parameter character #' in math mode");
  });

  it('Missing End Error', () => {
    expectTexError('\\newenvironment{env}{aa}{bb}\\begin{env}cc')
      .toBe('Missing \\end{env}');
  });

  it('Hash Error', () => {
    expectTexError('\\def\\x#1{a #1 b #c} \\x{a}')
      .toBe('Illegal macro parameter reference');
  });

  it('Recursive Macro', () => {
    expectTexError('\\def\\x{\\x} \\x')
      .toBe('MathJax maximum macro substitution count exceeded; is here a recursive macro call?');
  });

  it('Recursive Environment', () => {
    expectTexError('\\newenvironment{error}{\\begin{error}}{\\end{error}} \\begin{error}\\end{error}')
      .toBe('MathJax maximum substitution count exceeded; is there a recursive latex environment?');
  });

});

/**********************************************************************************/

describe('Newcommand Overrides', () => {
  beforeEach(() => setupTex(['base', 'newcommand']));

  it('Let def macro be undefined', () => {
    expectTexError('\\def\\test{error} \\let\\test=\\undefined \\test')
      .toBe('Undefined control sequence \\test');
  });

  it('Let existing macro be undefined', () => {
    expectTexError('\\let\\sqrt=\\undefined \\sqrt{x}')
      .toBe('Undefined control sequence \\sqrt');
  });

  it('Let existing delimiter be undefined', () => {
    expectTexError('\\let\\|=\\undefined \\left\\| X \\right\\|')
      .toBe('Missing or unrecognized delimiter for \\left');
  });

  it('Let after def of existing macro be undefined', () => {
    expectTexError('\\def\\sqrt{X} \\let\\sqrt=\\undefined \\sqrt{x}')
      .toBe('Undefined control sequence \\sqrt');
  });

  it('Def overrides let delimiter', () => {
    expectTexError('\\let\\test=\\| \\def\\test{x} \\left\\test X \\right\\test')
      .toBe('Missing or unrecognized delimiter for \\left');
  });

  it('Def overrides let delimiter as macro', () => {
    expect(tex2mml('\\let\\test=\\| \\def\\test{x} \\test')).toMatchSnapshot();
  });

  it('Def overrides existing delimiter', () => {
    expectTexError('\\def\\|{x} \\left\\| X \\right\\|')
      .toBe('Missing or unrecognized delimiter for \\left');
  });

  it('Def overrides existing delimiter as macro', () => {
    expect(tex2mml('\\def\\|{x} \\|')).toMatchSnapshot();
  });

  it('Let overrides def macro', () => {
    expect(tex2mml('\\def\\test{x} \\let\\test=\\| \\test X \\test')).toMatchSnapshot();
  });

  it('Let overrides def macro as delimiter', () => {
    expect(tex2mml('\\def\\test{x} \\let\\test=\\| \\left\\test X \\right\\test')).toMatchSnapshot();
  });

  it('Let overrides existing macro', () => {
    expect(tex2mml('\\let\\sqrt=\\| \\sqrt X')).toMatchSnapshot();
  });

  it('Let overrides existing macro as delimiter', () => {
    expect(tex2mml('\\let\\sqrt=\\| \\left\\sqrt X \\right\\sqrt')).toMatchSnapshot();
  });

  it('Let overrides delimiter', () => {
    expectTexError('\\let\\|=\\sqrt \\left\\| X \\right\\|')
      .toBe('Missing or unrecognized delimiter for \\left');
  });

  it('Let overrides delimiter as macro', () => {
    expect(tex2mml('\\let\\|=\\sqrt \\| X')).toMatchSnapshot();
  });

  it('Let of character macro overrides delimiter', () => {
    expectTexError('\\let\\|=\\alpha \\left\\| X \\right\\|')
      .toBe('Missing or unrecognized delimiter for \\left');
  });

  it('Let of character creates delimiter', () => {
    expect(tex2mml('\\let\\test=< \\left\\test X \\right\\test')).toMatchSnapshot();
  });

  it('Let of character overrides def', () => {
    expect(tex2mml('\\def\\test{X}\\let\\test=< \\test')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Nested Environments', () => {
  beforeEach(() => setupTex(['base', 'ams', 'newcommand']));

  it('Newenvironment with Begin', () => {
    expect(tex2mml(
        [
          '\\newenvironment{boxed}{\\begin{array}{|c|c|}\\hline}{\\\\\\hline\\end{array}}',
          '\\begin{boxed}a&b\\\\c&d\\end{boxed}'
        ].join('')
    )).toMatchSnapshot();
  });

  it('Environments Nested', () => {
    expect(tex2mml(
        [
          '\\newenvironment{boxed}{\\begin{array}{|c|c|}\\hline}{\\\\\\hline\\end{array}}',
          '\\begin{boxed}\\begin{boxed}a&b\\\\c&d\\end{boxed} & X \\\end{boxed}'
        ].join('')
    )).toMatchSnapshot();
  });

  it('Environments Intermixed', () => {
    expect(tex2mml(
        [
          '\\newenvironment{a}{\\begin{b}}{\\end{b}}',
          '\\newenvironment{b}{x}{y}',
          '\\begin{a} ... \\end{b}\\begin{b}\\end{a}'
        ].join('')
    )).toMatchSnapshot();
  });

  it('Nested Begins', () => {
    expect(tex2mml('\\newenvironment{a}{x}{y}\\newenvironment{b}{p}{q}\\begin{a}\\begin{b}X\\end{b}\\end{a}')).toMatchSnapshot();
  });

  it('Dangling End', () => {
    expectTexError('\\newenvironment{a}{x}{y\\end{a}}\\begin{a} ... \\end{a}')
      .toBe('Missing \\begin{a} or extra \\end{a}');
  });

  it('Nested Dangling End', () => {
    expectTexError(
      '\\newenvironment{a}{\\begin{b}}{\\end{b}}\\newenvironment{b}{x}{y\\end{b}}\\begin{a}X\\end{a}')
      .toBe('\\begin{a} ended with \\end{b}');
  });

  it('Badly Nested Begins', () => {
    expectTexError(
      '\\newenvironment{a}{x}{y}\\newenvironment{b}{p}{q}\\begin{a}\\begin{b} ... \\end{a}\\end{b}'
    ).toBe('\\begin{b} ended with \\end{a}');
  });

  it('Ended by Wrong Environment', () => {
    expectTexError('\\newenvironment{a}{x}{y}\\begin{a} X \\end{cases}')
      .toBe('\\begin{a} ended with \\end{cases}');
  });

  it('Unbalanced Ends 1', () => {
    expectTexError(
      '\\newenvironment{a}{a}{b\\end{a}}\\newenvironment{b}{x}{y}\\begin{a}\\begin{b}...\\end{b}\\end{a}'
    ).toBe('Missing \\begin{a} or extra \\end{a}');
  });

  it('Unbalanced Ends 2', () => {
    expectTexError(
      '\\newenvironment{a}{a}{b\\end{a}}\\newenvironment{b}{x}{y}\\begin{b}\\begin{a}...\\end{a}\\end{b}'
    ).toBe('\\begin{b} ended with \\end{a}');
  });

  it('Triple Nesting', () => {
    expectTexError(
      [
        '\\newenvironment{c}{x}{\\end{a}y}',
        '\\newenvironment{b}{begin{c}x}{\\end{c}y}',
        '\\newenvironment{a}{\\begin{b}x}{\\end{b}y}',
        '\\begin{a} ... '
      ].join('')
    ).toBe('Missing \\end{b}');
  });

});

/**********************************************************************************/

afterAll(() => getTokens('newcommand'));
