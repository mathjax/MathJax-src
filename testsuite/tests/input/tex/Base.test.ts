import { afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import ParseOptions from '#js/input/tex/ParseOptions.js';

beforeEach(() => setupTex(['base']));

/**********************************************************************************/

describe('Identifiers', () => {
  /********************************************************************************/
  it('Identifier', () => {
    expect(tex2mml('x')).toMatchSnapshot();
  });

  it('Two Identifiers', () => {
    expect(tex2mml('xy')).toMatchSnapshot();
  });

  it('Capital', () => {
    expect(tex2mml('A')).toMatchSnapshot();
  });

  it('Other Characters', () => {
    expect(tex2mml('x + \u00eb')).toMatchSnapshot();
  });

  it('Other Character Variant', () => {
    expect(tex2mml('\\mathbf{\u0391}\u0391\u3333')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Sub and Superscripts', () => {
  it('Empty base', () => {
    expect(tex2mml('^2')).toMatchSnapshot();
  });

  it('Empty base2', () => {
    expect(tex2mml('{}^2')).toMatchSnapshot();
  });

  it('Square', () => {
    expect(tex2mml('x^2')).toMatchSnapshot();
  });

  it('Cube', () => {
    expect(tex2mml('x^3')).toMatchSnapshot();
  });

  it('Large Operator', () => {
    expect(tex2mml('\\sum^2_1')).toMatchSnapshot();
  });

  it('Move Superscript', () => {
    expect(tex2mml('\\left( \\sum_1^n \\right)^{2}')).toMatchSnapshot();
  });

  it('Empty Base Index', () => {
    expect(tex2mml('_3')).toMatchSnapshot();
  });

  it('Empty Base Index2', () => {
    expect(tex2mml('{}_3')).toMatchSnapshot();
  });

  it('Index', () => {
    expect(tex2mml('x_3')).toMatchSnapshot();
  });

  it('SubSup', () => {
    expect(tex2mml('x^a_3')).toMatchSnapshot();
  });

  it('Inline OP Sup', () => {
    expect(tex2mml('\\mathop{X}^2', false)).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Negations', () => {
  it('Negation Simple', () => {
    expect(tex2mml('a \\not= b')).toMatchSnapshot();
  });

  it('Negation Complex', () => {
    expect(
      tex2mml('a \\not= b \\not\\rightarrow c \\not\\leq d')
    ).toMatchSnapshot();
  });

  it('Negation Explicit', () => {
    expect(tex2mml(' \\not\\longrightarrow')).toMatchSnapshot();
  });

  it('Negation Large', () => {
    expect(tex2mml(' \\not3')).toMatchSnapshot();
  });

  it('Negation Left Paren', () => {
    expect(tex2mml('\\not\\left(\\right.')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Primes', () => {
  it('Prime', () => {
    expect(tex2mml("x'")).toMatchSnapshot();
  });

  it('PrimeSup', () => {
    expect(tex2mml("x^{'}")).toMatchSnapshot();
  });

  it('Double Prime', () => {
    expect(tex2mml("x''")).toMatchSnapshot();
  });

  it('Triple Prime', () => {
    expect(tex2mml("x'''")).toMatchSnapshot();
  });

  it('Quadruple Prime', () => {
    expect(tex2mml("x''''")).toMatchSnapshot();
  });

  it('Quintuple Prime', () => {
    expect(tex2mml("x'''''")).toMatchSnapshot();
  });

  it('PrePrime', () => {
    expect(tex2mml("'x")).toMatchSnapshot();
  });

  it('Prime with subscript', () => {
    expectTexError("x^'_{3}").toBe('Missing open brace for superscript');
  });

  it('Prime on Sub', () => {
    expect(tex2mml("x^{'_{a}}")).toMatchSnapshot();
  });

  it('Prime on Sup', () => {
    expect(tex2mml("x^{a^{'}}")).toMatchSnapshot();
  });

  it('Sup on Prime', () => {
    expect(tex2mml("x^{'^{a}}")).toMatchSnapshot();
  });

  it('Prime on Prime', () => {
    expect(tex2mml("x^{'^{'}}")).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Digits', () => {
  it('Integer', () => {
    expect(tex2mml('2')).toMatchSnapshot();
  });

  it('Number', () => {
    expect(tex2mml('3.14')).toMatchSnapshot();
  });

  it('Decimal', () => {
    expect(tex2mml('.14')).toMatchSnapshot();
  });

  it('Thousands', () => {
    expect(tex2mml('1{,}000.10')).toMatchSnapshot();
  });

  it('Wrong Thousands', () => {
    expect(tex2mml('1{,}0000.10')).toMatchSnapshot();
  });

  it('Decimal Point', () => {
    expect(tex2mml('.')).toMatchSnapshot();
  });

  it('Integer Font', () => {
    expect(tex2mml('\\mathbf{2}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('DigitsEuropean', () => {
  beforeEach(() =>
    setupTex(['base'], {
      digits: '^(?:[0-9]+(?:\\{\\.\\}[0-9]{3})*(?:,[0-9]*)?|,[0-9]+)',
    })
  );

  it('Integer European', () => {
    expect(tex2mml('2')).toMatchSnapshot();
  });

  it('Number European', () => {
    expect(tex2mml('3,14')).toMatchSnapshot();
  });

  it('Thousands European', () => {
    expect(tex2mml('1{.}000,10')).toMatchSnapshot();
  });

  it('Wrong Thousands European', () => {
    expect(tex2mml('1{.}0000,10')).toMatchSnapshot();
  });

  it('Decimal European', () => {
    expect(tex2mml(',14')).toMatchSnapshot();
  });

  it('Decimal Point European', () => {
    expect(tex2mml(',')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Roots', () => {
  it('Square Root', () => {
    expect(tex2mml('\\sqrt{x}')).toMatchSnapshot();
  });

  it('Square Root Fraction', () => {
    expect(tex2mml('\\sqrt\\frac{a}{b}')).toMatchSnapshot();
  });

  it('Nth Root', () => {
    expect(tex2mml('\\sqrt[n]{x}')).toMatchSnapshot();
  });

  it('Explicit Root', () => {
    expect(tex2mml('\\root 4 \\of x')).toMatchSnapshot();
  });

  it('Tweaked Root', () => {
    expect(
      tex2mml('\\sqrt[\\leftroot{-2}\\uproot{2}\\beta]{k}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Error', () => {
  it('merror node', () => {
    expect(tex2mml('&')).toMatchSnapshot();
  });

  it('Ampersand-error', () => {
    expectTexError('&').toBe("Misplaced '&'");
  });

  it('Argument-error', () => {
    expectTexError('\\frac{b}').toBe('Missing argument for \\frac');
  });

  it('Undefined-CS', () => {
    expectTexError('\\nonsense').toBe('Undefined control sequence \\nonsense');
  });

  it('Undefined-Env', () => {
    expectTexError('\\begin{nonsense} a \\end{nonsense}').toBe(
      "Unknown environment 'nonsense'"
    );
  });

  it('Double-super-error', () => {
    expectTexError('x^2^3').toBe('Double exponent: use braces to clarify');
  });

  it('Double-over-error', () => {
    expectTexError('\\sum^2^3').toBe('Double exponent: use braces to clarify');
  });

  it('Limits Error', () => {
    expectTexError('+\\limits^2').toBe('\\limits is allowed only on operators');
  });

  it('Double sub error', () => {
    expectTexError('x_2_3').toBe('Double subscripts: use braces to clarify');
  });

  it('Double under error', () => {
    expectTexError('\\sum_2_3').toBe(
      'Double subscripts: use braces to clarify'
    );
  });

  it('Brace Superscript Error', () => {
    expectTexError("x'^'").toBe('Missing open brace for superscript');
  });

  it('Double Prime Error', () => {
    expectTexError("x^\\prime'").toBe(
      'Prime causes double exponent: use braces to clarify'
    );
  });

  it('Double Prime Error 2', () => {
    expectTexError("\\sum\\limits^n'").toBe(
      'Prime causes double exponent: use braces to clarify'
    );
  });

  it('Hash Error', () => {
    expectTexError('#').toBe(
      "You can't use 'macro parameter character #' in math mode"
    );
  });

  it('Missing Right', () => {
    expectTexError('\\left(\\middle|').toBe('Extra \\left or missing \\right');
  });

  it('Orphan Middle', () => {
    expectTexError('\\middle|').toBe('Extra \\middle');
  });

  it('Middle with Right', () => {
    expectTexError('\\middle|\\right)').toBe('Extra \\middle');
  });

  it('Misplaced Move Root', () => {
    expectTexError('\\uproot{2}\\sqrt[3]{a}').toBe(
      '\\uproot can appear only within a root'
    );
  });

  it('Multiple Move Root', () => {
    expectTexError('\\sqrt[\\uproot{-2}\\uproot{2}\\beta]{k}').toBe(
      'Multiple use of \\uproot'
    );
  });

  it('Incorrect Move Root', () => {
    expectTexError('\\sqrt[\\uproot-2.5\\beta]{k}').toBe(
      'The argument to \\uproot must be an integer'
    );
  });

  it('Double Over', () => {
    expectTexError('1 \\over 2 \\over 3').toBe('Ambiguous use of \\over');
  });

  it('MissingBeginExtraEnd', () => {
    expectTexError('\\end{array}').toBe(
      'Missing \\begin{array} or extra \\end{array}'
    );
  });

  it('ExtraCloseMissingOpen', () => {
    expectTexError('x}').toBe('Extra close brace or missing open brace');
  });

  it('MissingLeftExtraRight', () => {
    expectTexError('x\\right\\}').toBe('Missing \\left or extra \\right');
  });

  it('ExtraOpenMissingClose', () => {
    expectTexError('{x').toBe('Extra open brace or missing close brace');
  });

  it('MissingScript Sub', () => {
    expectTexError('x_').toBe('Missing superscript or subscript argument');
  });

  it('MissingScript Sup', () => {
    expectTexError('x^').toBe('Missing superscript or subscript argument');
  });

  it('MissingOpenForSup', () => {
    expectTexError('x^^').toBe('Missing open brace for superscript');
  });

  it('MissingOpenForSub', () => {
    expectTexError('x__').toBe('Missing open brace for subscript');
  });

  it('ExtraLeftMissingRight', () => {
    expectTexError('\\left\\{x').toBe('Extra \\left or missing \\right');
  });

  it('Misplaced Cr', () => {
    expectTexError('a\\cr b').toBe("Misplaced '\\cr'");
  });

  it('Dimension Error', () => {
    expectTexError('a\\\\[abc] b').toBe(
      'Bracket argument to \\\\ must be a dimension'
    );
  });

  it('MissingArgFor', () => {
    expectTexError('\\sqrt').toBe('Missing argument for \\sqrt');
  });

  it('ExtraCloseMissingOpen 2', () => {
    expectTexError('\\sqrt}').toBe('Extra close brace or missing open brace');
  });

  it('MissingCloseBrace', () => {
    expectTexError('\\sqrt{').toBe('Missing close brace');
  });

  it('ExtraCloseLooking1', () => {
    expectTexError('\\sqrt[3}').toBe("Extra close brace while looking for ']'");
  });

  it('MissingCloseBracket', () => {
    expectTexError('\\sqrt[3{x}').toBe(
      "Could not find closing ']' for argument to \\sqrt"
    );
  });

  it('MissingOrUnrecognizedDelim1', () => {
    expectTexError('\\left\\alpha b').toBe(
      'Missing or unrecognized delimiter for \\left'
    );
  });

  it('MissingOrUnrecognizedDelim2', () => {
    expectTexError('\\left( b\\right').toBe(
      'Missing or unrecognized delimiter for \\right'
    );
  });

  it('MissingDimOrUnits', () => {
    expectTexError('\\rule{}').toBe(
      'Missing dimension or its units for \\rule'
    );
  });

  it('TokenNotFoundForCommand', () => {
    expectTexError('\\root {3] \\of 5').toBe('Could not find \\of for \\root');
  });

  it('ExtraCloseLooking2', () => {
    expectTexError('\\root [3} \\of 5 ').toBe(
      'Extra close brace while looking for \\of'
    );
  });

  it('ErroneousNestingEq', () => {
    expectTexError(
      '\\begin{equation}\\begin{eqnarray}\\end{eqnarray}\\end{equation}'
    ).toBe('Erroneous nesting of equation structures');
  });

  it('ExtraAlignTab', () => {
    expectTexError('\\cases{b & l & k}').toBe(
      'Extra alignment tab in \\cases text'
    );
  });

  it('Misplaced hline', () => {
    expectTexError('\\hline').toBe("Misplaced '\\hline'");
  });

  it('UnsupportedHFill', () => {
    expectTexError('a\\hfill b').toBe('Unsupported use of \\hfill');
  });

  it('InvalidEnv', () => {
    expectTexError('\\begin{\\ff}kk\\end{\\ff}').toBe(
      "Invalid environment name '\\ff'"
    );
  });

  it('EnvBadEnd', () => {
    expectTexError('\\begin{equation}a\\end{array}').toBe(
      '\\begin{equation} ended with \\end{array}'
    );
  });

  it('EnvMissingEnd Array', () => {
    expectTexError('\\begin{array}{c}a').toBe('Missing \\end{array}');
  });

  it('MissingBoxFor', () => {
    expectTexError('\\raise{2pt}').toBe('Missing box for \\raise');
  });

  it('MissingCloseBrace2', () => {
    expectTexError('\\begin{array}{c').toBe('Missing close brace');
  });

  it('EnvMissingEnd Equation', () => {
    expectTexError('\\begin{equation}a').toBe('Missing \\end{equation}');
  });
});

/**********************************************************************************/

describe('Fenced', () => {
  it('Fenced', () => {
    expect(
      tex2mml('\\left(\\frac{a}{\\left[bc\\right]}\\right)')
    ).toMatchSnapshot();
  });

  it('Fenced2', () => {
    expect(
      tex2mml('\\{\\frac{a}{\\uparrow bc\\downarrow}\\}')
    ).toMatchSnapshot();
  });

  it('Fenced3', () => {
    expect(
      tex2mml(
        '\\left\\{\\left\\vert \\left[ \\left\\| A \\right.\\right| \\right]\\right\\}'
      )
    ).toMatchSnapshot();
  });

  it('Middle', () => {
    expect(tex2mml('\\left(a\\middle|b\\right)')).toMatchSnapshot();
  });

  it('Fenced Nostretch 1', () => {
    expect(tex2mml('(\\frac{a}{[bc]})')).toMatchSnapshot();
  });

  it('Fenced Noleft', () => {
    expect(tex2mml('\\left. ab \\right)')).toMatchSnapshot();
  });

  it('Fenced Noright', () => {
    expect(tex2mml('\\left( ab \\right.')).toMatchSnapshot();
  });

  it('Fenced Arrows 5', () => {
    expect(
      tex2mml(
        '\\left\\{\\frac{a}{\\left\\uparrow bc\\right\\downarrow}\\right\\}'
      )
    ).toMatchSnapshot();
  });

  it('Fenced Arrows 1', () => {
    expect(
      tex2mml('\\left\\uparrow \\frac{a}{b} \\right\\downarrow')
    ).toMatchSnapshot();
  });

  it('Fenced Arrows 2', () => {
    expect(tex2mml('\\uparrow \\frac{a}{b} \\downarrow')).toMatchSnapshot();
  });

  it('Fenced Arrows 3', () => {
    expect(
      tex2mml(
        '\\left\\uparrow \\frac{a}{b}\\middle\\downarrow c \\right\\uparrow'
      )
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mathchoice', () => {
  it('Modulo', () => {
    expect(tex2mml('a\\mod b')).toMatchSnapshot();
  });

  it('Modulo Sub0', () => {
    expect(tex2mml('X_{a\\mod b}')).toMatchSnapshot();
  });

  it('Modulo Sub1', () => {
    expect(tex2mml('X_{1_{a\\mod b}}')).toMatchSnapshot();
  });

  it('Modulo Sub2', () => {
    expect(tex2mml('X_{1_{2_{a\\mod b}}}')).toMatchSnapshot();
  });

  it('Modulo Sub3', () => {
    expect(tex2mml('X_{1_{2_{3_{a\\mod b}}}}')).toMatchSnapshot();
  });

  it(`Pmod`, () => {
    expect(tex2mml('a \\pmod b')).toMatchSnapshot();
  });

  it(`Bmod`, () => {
    expect(tex2mml('a \\bmod b')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Stacking expressions', () => {
  it('Frac', () => {
    expect(tex2mml('\\frac{a}{b}')).toMatchSnapshot();
  });

  it('over', () => {
    expect(tex2mml('a \\over b')).toMatchSnapshot();
  });

  it('over complex numerator', () => {
    expect(tex2mml('a + b \\over c')).toMatchSnapshot();
  });

  it('Overset', () => {
    expect(tex2mml('\\overset{a}{b}')).toMatchSnapshot();
  });

  it('Overset Accent', () => {
    expect(tex2mml('\\overset{\\rightarrow}{b}')).toMatchSnapshot();
  });

  it('Underset', () => {
    expect(tex2mml('\\underset{a}{b}')).toMatchSnapshot();
  });

  it('Underset Accent', () => {
    expect(tex2mml('\\underset{\\rightarrow}{b}')).toMatchSnapshot();
  });

  it('Overunderset', () => {
    expect(tex2mml('\\overunderset{a}{b}{c}')).toMatchSnapshot();
  });

  it('Overunderset Accent', () => {
    expect(
      tex2mml('\\overunderset{\\rightarrow}{\\leftarrow}{b}')
    ).toMatchSnapshot();
  });

  it('Over', () => {
    expect(tex2mml('1 \\over 2')).toMatchSnapshot();
  });

  it('Above', () => {
    expect(tex2mml('a \\above 1pt b')).toMatchSnapshot();
  });

  it('Choose', () => {
    expect(tex2mml('n \\choose k')).toMatchSnapshot();
  });

  it('Choose Sub0', () => {
    expect(tex2mml('X_{n \\choose k}')).toMatchSnapshot();
  });

  it('Choose Sub1', () => {
    expect(tex2mml('X_{1_{n \\choose k}}')).toMatchSnapshot();
  });

  it('Choose Sub2', () => {
    expect(tex2mml('X_{1_{2_{n \\choose k}}}')).toMatchSnapshot();
  });

  it('Choose Sub3', () => {
    expect(tex2mml('X_{1_{2_{3_{n \\choose k}}}}')).toMatchSnapshot();
  });

  it('Over With Delims', () => {
    expect(tex2mml('1 \\overwithdelims [ ] 2')).toMatchSnapshot();
  });

  it('Over With Delims Sub0', () => {
    expect(tex2mml('X_{1 \\overwithdelims [ ] 2}')).toMatchSnapshot();
  });

  it('Over With Delims Sub1', () => {
    expect(tex2mml('X_{1_{1 \\overwithdelims [ ] 2}}')).toMatchSnapshot();
  });

  it('Over With Delims Sub2', () => {
    expect(tex2mml('X_{1_{2_{1 \\overwithdelims [ ] 2}}}')).toMatchSnapshot();
  });

  it('Over With Delims Sub3', () => {
    expect(
      tex2mml('X_{1_{2_{3_{1 \\overwithdelims [ ] 2}}}}')
    ).toMatchSnapshot();
  });

  it('Above With Delims', () => {
    expect(tex2mml('a \\abovewithdelims [ ] 1pt b')).toMatchSnapshot();
  });

  it('Above With Delims Sub0', () => {
    expect(tex2mml('X_{a \\abovewithdelims [ ] 1pt b}')).toMatchSnapshot();
  });

  it('Above With Delims Sub1', () => {
    expect(tex2mml('X_{1_{a \\abovewithdelims [ ] 1pt b}}')).toMatchSnapshot();
  });

  it('Above With Delims Sub2', () => {
    expect(
      tex2mml('X_{1_{2_{a \\abovewithdelims [ ] 1pt b}}}')
    ).toMatchSnapshot();
  });

  it('Above With Delims Sub3', () => {
    expect(
      tex2mml('X_{1_{2_{3_{a \\abovewithdelims [ ] 1pt b}}}}')
    ).toMatchSnapshot();
  });

  it('Probability', () => {
    expect(tex2mml('P(E) = {n \\choose k} p^k (1-p)^{ n-k}')).toMatchSnapshot();
  });

  it('stackrel', () => {
    expect(tex2mml('x\\stackrel{a}{b}y')).toMatchSnapshot();
  });

  it('stackbin', () => {
    expect(tex2mml('x\\stackbin{a}{b}y')).toMatchSnapshot();
  });

  it('atop', () => {
    expect(tex2mml('a \\atop b')).toMatchSnapshot();
  });

  it('atopwithdelims', () => {
    expect(tex2mml('a \\atopwithdelims [ ] b')).toMatchSnapshot();
  });

  it('brack', () => {
    expect(tex2mml('n \\brack k')).toMatchSnapshot();
  });

  it('brace', () => {
    expect(tex2mml('n \\brace k')).toMatchSnapshot();
  });

  it('BuildRel', () => {
    expect(tex2mml('\\buildrel{a}\\over b')).toMatchSnapshot();
  });

  it('BuildRel Expression', () => {
    expect(tex2mml('x\\buildrel{a}\\over b y')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('MmlToken', () => {
  it('MmlToken mo', () => {
    expect(tex2mml('\\mmlToken{mo}{rem}')).toMatchSnapshot();
  });

  it('MmlToken mi', () => {
    expect(tex2mml('\\mmlToken{mi}{=}')).toMatchSnapshot();
  });

  it('MmlToken attribute', () => {
    expect(tex2mml('\\mmlToken{mo}[mathvariant=normal]{=}')).toMatchSnapshot();
  });

  it('MmlToken attribute boolean', () => {
    expect(
      tex2mml('\\mmlToken{mo}[mathvariant=normal,largeop=true]{=}')
    ).toMatchSnapshot();
  });

  it('MmlToken attribute boolean false', () => {
    expect(
      tex2mml('\\mmlToken{mo}[mathvariant=normal,largeop=false]{=}')
    ).toMatchSnapshot();
  });

  it('Token Illegal Type', () => {
    expectTexError('\\mmlToken{mk}[]{}').toBe('mk is not a token element');
  });

  it('Token Wrong Type', () => {
    expectTexError('\\mmlToken{mrow}[]{}').toBe('mrow is not a token element');
  });

  it('Token Invalid Attribute', () => {
    expectTexError('\\mmlToken{mi}[m1=true]{}').toBe(
      'Invalid MathML attribute: m1'
    );
  });

  it('Token Unknown Attribute', () => {
    expectTexError('\\mmlToken{mo}[nothing="something"]{}').toBe(
      'nothing is not a recognized attribute for mo'
    );
  });

  it('Token Wrong Attribute', () => {
    expectTexError('\\mmlToken{mi}[movablelimit=true]{}').toBe(
      'movablelimit is not a recognized attribute for mi'
    );
  });
});

/**********************************************************************************/

describe('Matrix', () => {
  it('Matrix Error', () => {
    expectTexError('\\matrix').toBe('Missing argument for \\matrix');
  });

  it('Matrix Arg', () => {
    expect(tex2mml('\\matrix a')).toMatchSnapshot();
  });

  it('Matrix Braces', () => {
    expect(tex2mml('\\matrix{a}')).toMatchSnapshot();
  });

  it('Matrix Columns', () => {
    expect(tex2mml('\\array{a&b}')).toMatchSnapshot();
  });

  it('Matrix Rows', () => {
    expect(tex2mml('\\array{a&b\\\\ c&d}')).toMatchSnapshot();
  });

  it('Matrix Subscript', () => {
    expect(tex2mml('X_{\\matrix{a&b}}')).toMatchSnapshot();
  });

  it('Matrix Parens', () => {
    expect(tex2mml('\\pmatrix{a&b}')).toMatchSnapshot();
  });

  it('Matrix Parens Subscript', () => {
    expect(tex2mml('X_{\\pmatrix{a&b}}')).toMatchSnapshot();
  });

  it('Matrix Font Entry', () => {
    expect(tex2mml('\\pmatrix{\\bf a&b}')).toMatchSnapshot();
  });

  it('Matrix Cases', () => {
    expect(tex2mml('\\cases{a}')).toMatchSnapshot();
  });

  it('Matrix Cases', () => {
    expect(tex2mml('\\cases{a}')).toMatchSnapshot();
  });

  it('Matrix Cases two columns', () => {
    expect(tex2mml('\\cases{a & b}')).toMatchSnapshot();
  });

  it('Matrix Cases two columns braces', () => {
    expect(tex2mml('\\cases{a & {b}}')).toMatchSnapshot();
  });

  it('Matrix Cases two rows', () => {
    expect(tex2mml('\\cases{a & b\\\\ c & d}')).toMatchSnapshot();
  });

  it('Matrix Cases text', () => {
    expect(tex2mml('\\cases{a & \\text{b}}')).toMatchSnapshot();
  });

  it('Matrix Numbered', () => {
    expect(tex2mml('\\eqalignno{a&b&c}')).toMatchSnapshot();
  });

  it('Matrix Numbered Left', () => {
    expect(tex2mml('\\leqalignno{a&b&c}')).toMatchSnapshot();
  });

  it('Matrix Not Numbered', () => {
    expect(tex2mml('\\eqalign{a&b&c}')).toMatchSnapshot();
  });

  it('Displaylines', () => {
    expect(tex2mml('\\displaylines{a\\\\ b}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('InternalMath', () => {
  it('Interspersed Text', () => {
    expect(tex2mml('a\\text{c$d$e}b')).toMatchSnapshot();
  });

  it('Unicode text', () => {
    expect(tex2mml('\\text{\\U{65}}')).toMatchSnapshot();
  });

  it('Unicode text error', () => {
    expectTexError('\\text{\\U{xyz}}').toBe(
      'Argument to \\U must a hexadecimal number with 1 to 6 digits'
    );
  });

  it('Mbox Mbox', () => {
    expect(tex2mml('a\\mbox{ b $a\\mbox{ b c } c$ c } c')).toMatchSnapshot();
  });

  it('Mbox Math', () => {
    expect(tex2mml('a\\mbox{ ${ab}$ } c')).toMatchSnapshot();
  });

  it('Mbox CR', () => {
    expect(tex2mml('a\\mbox{aa \\\\ bb} c')).toMatchSnapshot();
  });

  it('Internal Math Error', () => {
    expectTexError('a\\mbox{$}} c').toBe(
      'Math mode is not properly terminated'
    );
  });

  it('Mbox Internal Display', () => {
    expect(tex2mml('a\\mbox{aa \\(\\frac{a}{b}\\) bb} c')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Array', () => {
  it('Array Single', () => {
    expect(tex2mml('\\begin{array}{c}a\\end{array}')).toMatchSnapshot();
  });

  it('Enclosed left right', () => {
    expect(tex2mml('\\begin{array}{|c|}a\\end{array}')).toMatchSnapshot();
  });

  it('Enclosed left', () => {
    expect(tex2mml('\\begin{array}{|c}a\\end{array}')).toMatchSnapshot();
  });

  it('Enclosed right', () => {
    expect(tex2mml('\\begin{array}{c|}a\\end{array}')).toMatchSnapshot();
  });

  it('Enclosed top', () => {
    expect(tex2mml('\\begin{array}{c}\\hline a\\end{array}')).toMatchSnapshot();
  });

  it('Enclosed bottom', () => {
    expect(
      tex2mml('\\begin{array}{c} a\\\\\\hline\\end{array}')
    ).toMatchSnapshot();
  });

  it('Enclosed top bottom', () => {
    expect(
      tex2mml('\\begin{array}{c}\\hline a\\\\\\hline\\end{array}')
    ).toMatchSnapshot();
  });

  it('Enclosed frame solid', () => {
    expect(
      tex2mml('\\begin{array}{|c|}\\hline a\\\\\\hline\\end{array}')
    ).toMatchSnapshot();
  });

  it('Enclosed frame dashed', () => {
    expect(
      tex2mml('\\begin{array}{:c:}\\hline a\\\\\\hline\\end{array}')
    ).toMatchSnapshot();
  });

  it('Enclosed solid dashed', () => {
    expect(tex2mml('\\begin{array}{|c:} a\\end{array}')).toMatchSnapshot();
  });

  it('Array dashed column', () => {
    expect(
      tex2mml('\\begin{array}{c:c}a&c\\\\b&d\\end{array}')
    ).toMatchSnapshot();
  });

  it('Array solid column', () => {
    expect(
      tex2mml('\\begin{array}{c|c}a&c\\\\b&d\\end{array}')
    ).toMatchSnapshot();
  });

  it('Array dashed row', () => {
    expect(
      tex2mml('\\begin{array}{c}a\\\\\\hdashline b\\end{array}')
    ).toMatchSnapshot();
  });

  it('Array solid row', () => {
    expect(
      tex2mml('\\begin{array}{c}a\\\\\\hline b\\end{array}')
    ).toMatchSnapshot();
  });

  it('Enclosed dashed row', () => {
    expect(
      tex2mml('\\begin{array}{|c|}a\\\\\\hdashline b\\end{array}')
    ).toMatchSnapshot();
  });

  it('Enclosed solid row', () => {
    expect(
      tex2mml('\\begin{array}{|c|}a\\\\\\hline b\\end{array}')
    ).toMatchSnapshot();
  });

  it('Enclosed dashed column', () => {
    expect(
      tex2mml('\\begin{array}{|c:c|}a&c\\\\b&d\\end{array}')
    ).toMatchSnapshot();
  });

  it('Enclosed solid column', () => {
    expect(
      tex2mml('\\begin{array}{|c|c|}a&c\\\\b&d\\end{array}')
    ).toMatchSnapshot();
  });

  it('Array aligned', () => {
    expect(tex2mml('\\begin{array}[b]{c}a\\end{array}')).toMatchSnapshot();
  });

  it('Array aligned invalid', () => {
    expect(tex2mml('\\begin{array}[x]{c}a\\end{array}')).toMatchSnapshot();
  });

  it('Empty Array with Template', () => {
    expect(tex2mml('\\begin{array}{>{x}c} \\end{array}')).toMatchSnapshot();
  });

  it('Label', () => {
    expect(tex2mml('\\eqalignno{a &  & {\\hbox{(3)}}}')).toMatchSnapshot();
  });

  it('Columnlines Solid None', () => {
    expect(
      tex2mml('\\begin{array}{c|cc}a&b&c\\\\d&e&f\\end{array}')
    ).toMatchSnapshot();
  });

  it('Rowlines Solid None', () => {
    expect(
      tex2mml(
        '\\begin{array}{ccc}a&b&c\\\\\\hline d&e&f\\\\ g&h&i \\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('Column+Rowlines Solid None', () => {
    expect(
      tex2mml(
        '\\begin{array}{c|cc}a&b&c\\\\\\hline d&e&f\\\\ g&h&i \\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('Column+Rowlines Solid Dashed None', () => {
    expect(
      tex2mml(
        '\\begin{array}{c|c:cc}0&a&b&c\\\\\\hline 1&d&e&f\\\\\\hdashline 2&g&h&i\\\\ 3&j&k&l \\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('Matrix Test', () => {
    expect(
      tex2mml(
        '\\left( \\begin{array}{ccc}a & b & c \\\\d & e & f \\\\g & h & i \\end{array} \\right)'
      )
    ).toMatchSnapshot();
  });

  it('Newcolumntype', () => {
    expect(
      tex2mml('\\newcolumntype{a}{c}\\begin{array}{a|a}a&b\\\\c&d\\end{array}')
    ).toMatchSnapshot();
  });

  it('Newcolumntype Option', () => {
    expect(
      tex2mml(
        '\\newcolumntype{a}[1]{m{#1}}\\begin{array}{a{1em}|a{2em}}a&b\\\\c&d\\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('Newcolumntype Error Argument', () => {
    expectTexError(
      '\\newcolumntype{ab}{c}\\begin{array}{a|a}a&b\\\\c&d\\end{array}'
    ).toBe('Column specifier must be exactly one character: ab');
  });

  it('Newcolumntype Error Option', () => {
    expectTexError(
      '\\newcolumntype{a}[-1]{c}\\begin{array}{a|a}a&b\\\\c&d\\end{array}'
    ).toBe('Argument to -1 must be a positive integer');
  });

  it('Newcolumntype Missing Option', () => {
    expectTexError(
      '\\newcolumntype{a}[1]{c}\\begin{array}{a|a}a&b\\\\c&d\\end{array}'
    ).toBe('Missing argument for a column declaration');
  });

  it('Column Infinite Loop', () => {
    expectTexError(
      '\\newcolumntype{a}{a}\\begin{array}{a} x \\end{array}'
    ).toBe('Too many column specifiers (perhaps looping column definitions?)');
  });
});

/**********************************************************************************/

describe('Moving limits', () => {
  it('Limits SubSup', () => {
    expect(tex2mml('\\int^2\\limits_3')).toMatchSnapshot();
  });

  it('Limits UnderOver', () => {
    expect(tex2mml('\\lim_3\\nolimits^2')).toMatchSnapshot();
  });

  it('Limits', () => {
    expect(tex2mml('\\sum\\limits^2_3')).toMatchSnapshot();
  });

  it('Vector Op', () => {
    expect(tex2mml('\\vec{+}')).toMatchSnapshot();
  });

  it('Overline', () => {
    expect(tex2mml('\\overline{a}')).toMatchSnapshot();
  });

  it('Overline Limits', () => {
    expect(tex2mml('\\overline{\\int\\limits^2}')).toMatchSnapshot();
  });

  it('Overline Sum', () => {
    expect(tex2mml('\\overline{\\sum}')).toMatchSnapshot();
  });

  it('Overline 1', () => {
    expect(tex2mml('\\overline{\\sum}')).toMatchSnapshot();
  });

  it('Overline 2', () => {
    expect(tex2mml('\\overline{\\mathop{a}}')).toMatchSnapshot();
  });

  it('Overline 3', () => {
    expect(tex2mml('\\overline{\\mathop{a}}^2')).toMatchSnapshot();
  });

  it('Overline 4', () => {
    expect(tex2mml('\\overline{\\sum^2_3}')).toMatchSnapshot();
  });

  it('Overline 5', () => {
    expect(tex2mml('\\overline{\\sum}^2_3')).toMatchSnapshot();
  });

  it('Overline 6', () => {
    expect(tex2mml('\\overline{\\underline{\\sum}}')).toMatchSnapshot();
  });

  it('Subscripted overline with space (#3372)', () => {
    expect(tex2mml('\\overline{X}_ {y}')).toMatchSnapshot();
  });

  it('Overbrace 1', () => {
    expect(tex2mml('\\overbrace{abc}')).toMatchSnapshot();
  });

  it('Underbrace', () => {
    expect(tex2mml('\\underbrace{abc}')).toMatchSnapshot();
  });

  it('Overbrace Op 1', () => {
    expect(tex2mml('\\overbrace{\\mathop{a}}')).toMatchSnapshot();
  });

  it('Overbrace Op 2', () => {
    expect(tex2mml('\\overbrace{\\mathop{a}}^2')).toMatchSnapshot();
  });

  it('Overbrace 2', () => {
    expect(tex2mml('\\overbrace{\\sum}')).toMatchSnapshot();
  });

  it('Overbrace 3', () => {
    expect(tex2mml('\\overbrace{\\sum}^2')).toMatchSnapshot();
  });

  it('Underleftrightarrow', () => {
    expect(tex2mml('\\underleftrightarrow{abc}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Multirel', () => {
  it('Shift Left', () => {
    expect(tex2mml('a<<b')).toMatchSnapshot();
  });

  it('Less Equal', () => {
    expect(tex2mml('a<=b')).toMatchSnapshot();
  });

  it('Infix Op Op', () => {
    expect(tex2mml('a++b')).toMatchSnapshot();
  });

  it('Infix Op Rel', () => {
    expect(tex2mml('a+=b')).toMatchSnapshot();
  });

  it('Postfix Op Op', () => {
    expect(tex2mml('a++')).toMatchSnapshot();
  });

  it('Postfix Rel Rel', () => {
    expect(tex2mml('a==')).toMatchSnapshot();
  });

  it('Infix Bars', () => {
    expect(tex2mml('a||b')).toMatchSnapshot();
  });

  it('Infix Fences', () => {
    expect(tex2mml('a))b')).toMatchSnapshot();
  });

  it('Infix Rel Rel', () => {
    expect(tex2mml('a\\rightarrow=b')).toMatchSnapshot();
  });

  it('Infix 4Rel', () => {
    expect(tex2mml('a=<>=b')).toMatchSnapshot();
  });

  it('Prefix Rel Rel', () => {
    expect(tex2mml('==a')).toMatchSnapshot();
  });

  it('Prefix Op Op', () => {
    expect(tex2mml('++a')).toMatchSnapshot();
  });

  it('Multirel Font 1', () => {
    expect(tex2mml('a <=\\mathrm{>} b')).toMatchSnapshot();
  });

  it('Multirel Font 2', () => {
    expect(tex2mml('a <=\\mathrm{=>} b')).toMatchSnapshot();
  });

  it('Multirel Font 3', () => {
    expect(tex2mml('a <=\\mathrm{=}\\mathrm{>} b')).toMatchSnapshot();
  });

  it('Multirel Attributes 1', () => {
    expect(
      tex2mml('a \\mmlToken{mo}[mathvariant=bold]{<}= b')
    ).toMatchSnapshot();
  });
  it('Multirel Attributes 2', () => {
    expect(
      tex2mml(
        'a \\mmlToken{mo}[mathvariant=bold]{<}\\mmlToken{mo}[mathsize=2]{=} b'
      )
    ).toMatchSnapshot();
  });

  it('Simple Shadow Rel', () => {
    expect(tex2mml('a \\sim b')).toMatchSnapshot();
  });

  it('Extra Attribute Rel 1', () => {
    expect(tex2mml('a =\\sim b')).toMatchSnapshot();
  });

  it('Extra Attribute Rel 2', () => {
    expect(tex2mml('a \\sim\\simeq b')).toMatchSnapshot();
  });

  it('Extra Attribute Rel 3', () => {
    expect(tex2mml('a \\sim\\asymp b')).toMatchSnapshot();
  });

  it('Extra Attribute Rel 4', () => {
    expect(tex2mml('a \\sim\\simeq\\asymp b')).toMatchSnapshot();
  });

  it('Extra Attribute Rel 5', () => {
    expect(tex2mml('a \\sim\\asymp\\simeq b')).toMatchSnapshot();
  });

  it('Extra Attribute Rel 6', () => {
    expect(tex2mml('a \\sim\\cong b')).toMatchSnapshot();
  });

  it('Infix Stretchy Right', () => {
    expect(tex2mml('a=\\rightarrow b')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Other', () => {
  it('Other', () => {
    expect(tex2mml('+')).toMatchSnapshot();
  });

  it('Other Remap', () => {
    expect(tex2mml('-')).toMatchSnapshot();
  });

  it('Other Font', () => {
    expect(tex2mml('\\mathbf{+}')).toMatchSnapshot();
  });

  it('Other Delimiter', () => {
    expect(tex2mml('(')).toMatchSnapshot();
  });

  it('Other Dollar', () => {
    expect(tex2mml('$')).toMatchSnapshot();
  });

  it('Other Unicode', () => {
    expect(tex2mml('˦')).toMatchSnapshot();
  });

  it('Other Surrogate', () => {
    expect(tex2mml('𝐀')).toMatchSnapshot();
  });

  it('Other Arrow Range', () => {
    expect(tex2mml('⤡')).toMatchSnapshot();
  });

  it('Other Arrow Infix', () => {
    expect(tex2mml('a⤡b')).toMatchSnapshot();
  });

  it('Other Arrow Prefix', () => {
    expect(tex2mml('⤡b')).toMatchSnapshot();
  });

  it('Other Arrow Postfix', () => {
    expect(tex2mml('b⤡')).toMatchSnapshot();
  });

  it('Vertical Bar Alone', () => {
    expect(tex2mml('|')).toMatchSnapshot();
  });

  it('Vertical Bar Infix', () => {
    expect(tex2mml('a|b')).toMatchSnapshot();
  });

  it('Vertical Bar Postfix', () => {
    expect(tex2mml('a|')).toMatchSnapshot();
  });

  it('Vertical Bar Prefix', () => {
    expect(tex2mml('|b')).toMatchSnapshot();
  });

  it('CKJ', () => {
    expect(tex2mml('褯¥')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Base Complex', () => {
  it('Square Root Complex', () => {
    expect(tex2mml('\\sqrt{3x-1}+(1+x)^2')).toMatchSnapshot();
  });

  it('General Root', () => {
    expect(tex2mml('\\sqrt[4]{3x-1}+(1+x)^2')).toMatchSnapshot();
  });

  it('Quadratic Formula', () => {
    expect(tex2mml('x = \\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}')).toMatchSnapshot();
  });

  it('Cauchy-Schwarz Inequality', () => {
    expect(
      tex2mml(
        '\\left( \\sum_{k=1}^n a_k b_k \\right)^{\\!\\!2} \\leq  \\left( \\sum_{k=1}^n a_k^2 \\right)  \\left( \\sum_{k=1}^n b_k^2 \\right)'
      )
    ).toMatchSnapshot();
  });

  it('An Identity of Ramanujan', () => {
    expect(
      tex2mml(
        '\\frac{1}{\\Bigl(\\sqrt{\\phi\\sqrt{5}}-\\phi\\Bigr)  e^{\\frac25\\pi}} =    1+\\frac{e^{-2\\pi}}      {1+\\frac{e^{-4\\pi}}        {1+\\frac{e^{-6\\pi}}          {1+\\frac{e^{-8\\pi}}            {1+\\ldots} } } }'
      )
    ).toMatchSnapshot();
  });

  it('A Rogers-Ramanujan Identity', () => {
    expect(
      tex2mml(
        '1 + \\frac{q^2}{(1-q)}  + \\frac{q^6}{(1-q)(1-q^2)} + \\cdots =\\prod_{j=0}^{\\infty}  \\frac{1}{(1-q^{5j+2})(1-q^{5j+3})},     \\quad\\quad \\text{for $|q|<1$}.'
      )
    ).toMatchSnapshot();
  });

  it('A Summation Formula', () => {
    expect(
      tex2mml('\\sum_{n=1}^\\infty {1\\over n^2} = {\\pi^2\\over 6}')
    ).toMatchSnapshot();
  });

  it('Cauchy Integral Formula', () => {
    expect(
      tex2mml('f(a) = \\oint_\\gamma \\frac{f(z)}{z-a}dz')
    ).toMatchSnapshot();
  });

  it('Standard Deviation', () => {
    expect(
      tex2mml('\\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^N {(x_i-\\mu)}^2}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Environments', () => {
  it('Eqnarray', () => {
    expect(tex2mml('\\begin{eqnarray}a&=&b\\end{eqnarray}')).toMatchSnapshot();
  });

  it('Equation', () => {
    expect(tex2mml('\\begin{equation}a=b\\end{equation}')).toMatchSnapshot();
  });

  it('Displaymath', () => {
    expect(
      tex2mml('\\begin{displaymath}a\\end{displaymath}')
    ).toMatchSnapshot();
  });

  it('math', () => {
    expect(tex2mml('\\begin{math}a\\end{math}')).toMatchSnapshot();
  });

  it('Array Center', () => {
    expect(tex2mml('\\begin{array}{c}a\\end{array}')).toMatchSnapshot();
  });

  it('Array Center Lines', () => {
    expect(tex2mml('\\begin{array}{c}a\\\\b\\end{array}')).toMatchSnapshot();
  });

  it('Array RCL', () => {
    expect(tex2mml('\\begin{array}{rcl}a&=&b\\end{array}')).toMatchSnapshot();
  });

  it('Array RCL Lines', () => {
    expect(
      tex2mml('\\begin{array}{rcl}a&=&b\\\\c&=&d\\end{array}')
    ).toMatchSnapshot();
  });

  it('Display Array Center', () => {
    expect(tex2mml('\\begin{darray}{c}a\\end{darray}')).toMatchSnapshot();
  });

  it('Display Array Center Lines', () => {
    expect(tex2mml('\\begin{darray}{c}a\\\\b\\end{darray}')).toMatchSnapshot();
  });

  it('Display Array RCL', () => {
    expect(tex2mml('\\begin{darray}{rcl}a&=&b\\end{darray}')).toMatchSnapshot();
  });

  it('Display Array RCL Lines', () => {
    expect(
      tex2mml('\\begin{darray}{rcl}a&=&b\\\\c&=&d\\end{darray}')
    ).toMatchSnapshot();
  });

  it('Nested array', () => {
    expect(
      tex2mml(
        '\\begin{array}{rcl}a&{}{b}&c\\begin{array}{cc}f&h\\\\g\\end{array}\\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('IndentAlign', () => {
    expect(
      tex2mml('\\begin{indentalign}[10cm][20cm][30cm]{lcr}a\\end{indentalign}')
    ).toMatchSnapshot();
  });

  it('IndentAlign Single', () => {
    expect(
      tex2mml('\\begin{indentalign}[10cm][20cm][30cm]{c}a\\end{indentalign}')
    ).toMatchSnapshot();
  });

  it('IndentAlign First Only', () => {
    expect(
      tex2mml('\\begin{indentalign}[10cm]{c}a\\end{indentalign}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Environment Errors', () => {
  it('IndentAlign BadAlignment', () => {
    expectTexError(
      '\\begin{indentalign}[10cm][20cm][30cm]{lkr}a\\end{indentalign}'
    ).toBe('Alignment must be one to three copies of l, c, or r');
  });

  it('IndentAlign BadDimension', () => {
    expectTexError(
      '\\begin{indentalign}[10cm][20cm][30]{lcr}a\\end{indentalign}'
    ).toBe('Bracket argument to \\begin{indentalign} must be a dimension');
  });

  it('BreakAlign BadBreakAlign', () => {
    expectTexError(
      '\\begin{indentalign}[10cm][20cm][30]{lcr}a\\end{indentalign}'
    ).toBe('Bracket argument to \\begin{indentalign} must be a dimension');
  });

  it('Template loop', () => {
    expectTexError('\\begin{array}{r@{a\\\\b}l}a&b\\end{array}').toBe(
      'Maximum template substitutions exceeded; is there an invalid use of \\\\ in the template?'
    );
  });
});

/**********************************************************************************/

describe('BreakAlign', () => {
  it('BreakAlign Case c', () => {
    expect(
      tex2mml('\\begin{eqnarray}\\breakAlign{c}{t}a&=&b\\end{eqnarray}')
    ).toMatchSnapshot();
  });

  it('BreakAlign Case c second cell', () => {
    expect(
      tex2mml('\\begin{eqnarray}a&\\breakAlign{c}{t}=&b\\end{eqnarray}')
    ).toMatchSnapshot();
  });

  it('BreakAlign Case r', () => {
    expect(
      tex2mml('\\begin{eqnarray}\\breakAlign{r}{t}a&=&b\\end{eqnarray}')
    ).toMatchSnapshot();
  });

  it('BreakAlign Case r second row', () => {
    expect(
      tex2mml(
        '\\begin{eqnarray}\\breakAlign{r}{t}a&=&b\\\\\\breakAlign{r}{t}c&=&d\\end{eqnarray}'
      )
    ).toMatchSnapshot();
  });

  it('BreakAlign Case r multi split', () => {
    expect(
      tex2mml('\\begin{eqnarray}\\breakAlign{r}{tbmc}a&=&b\\end{eqnarray}')
    ).toMatchSnapshot();
  });

  it('BreakAlign Case t', () => {
    expect(
      tex2mml('\\begin{eqnarray}\\breakAlign{t}{t}a&=&b\\end{eqnarray}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('BreakAlign Errors', () => {
  it('BreakAlign not in environment', () => {
    expectTexError('\\breakAlign{c}{t}').toBe(
      '\\breakAlign must be used in an alignment environment'
    );
  });

  it('BreakAlign Case c', () => {
    expectTexError(
      '\\begin{eqnarray}a\\breakAlign{c}{t}&=&b\\end{eqnarray}'
    ).toBe('\\breakAlign{c} must be at the beginning of an alignment entry');
  });

  it('BreakAlign Case c split', () => {
    expectTexError(
      '\\begin{eqnarray}a\\breakAlign{c}{tb}&=&b\\end{eqnarray}'
    ).toBe('\\breakAlign{c} must be at the beginning of an alignment entry');
  });

  it('BreakAlign Case r', () => {
    expectTexError(
      '\\begin{eqnarray}a&=&\\breakAlign{r}{t}b\\end{eqnarray}'
    ).toBe('\\breakAlign{r} must be at the beginning of an alignment row');
  });

  it('BreakAlign Case t', () => {
    expectTexError(
      '\\begin{eqnarray}a&=&\\breakAlign{t}{t}b\\end{eqnarray}'
    ).toBe('\\breakAlign{t} must be at the beginning of an alignment');
  });

  it('BreakAlign Case t second row', () => {
    expectTexError(
      '\\begin{eqnarray}a&=&b\\\\\\breakAlign{t}{t}c&=&d\\end{eqnarray}'
    ).toBe('\\breakAlign{t} must be at the beginning of an alignment');
  });

  it('BreakAlign Case t split', () => {
    expectTexError(
      '\\begin{eqnarray}\\breakAlign{c}{tb}a&=&b\\end{eqnarray}'
    ).toBe('Too many alignment characters: tb');
  });

  it('BreakAlign Case unknown', () => {
    expectTexError(
      '\\begin{eqnarray}\\breakAlign{a}{t}a&=&b\\end{eqnarray}'
    ).toBe('First argument to \\breakAlign must be one of c, r, or t');
  });

  it('BreakAlign Case unknown split', () => {
    expectTexError(
      '\\begin{eqnarray}\\breakAlign{t}{a}a&=&b\\end{eqnarray}'
    ).toBe('Invalid alignment character: a');
  });
});

/**********************************************************************************/

describe('Setting sizes', () => {
  it('tiny', () => {
    expect(tex2mml('\\tiny a')).toMatchSnapshot();
  });

  it('Tiny', () => {
    expect(tex2mml('\\Tiny a')).toMatchSnapshot();
  });

  it('scriptsize', () => {
    expect(tex2mml('\\scriptsize a')).toMatchSnapshot();
  });

  it('small', () => {
    expect(tex2mml('\\small a')).toMatchSnapshot();
  });

  it('normalsize', () => {
    expect(tex2mml('\\normalsize a')).toMatchSnapshot();
  });

  it('large', () => {
    expect(tex2mml('\\large a')).toMatchSnapshot();
  });

  it('Large', () => {
    expect(tex2mml('\\Large a')).toMatchSnapshot();
  });

  it('LARGE', () => {
    expect(tex2mml('\\LARGE a')).toMatchSnapshot();
  });

  it('huge', () => {
    expect(tex2mml('\\huge a')).toMatchSnapshot();
  });

  it('Huge', () => {
    expect(tex2mml('\\Huge a')).toMatchSnapshot();
  });

  it('Empty', () => {
    expect(tex2mml('\\Huge')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Spaces', () => {
  it('Positive Spacing', () => {
    expect(tex2mml('a\\quad b')).toMatchSnapshot();
  });

  it('Negative Spacing', () => {
    expect(tex2mml('a\\!\\!b')).toMatchSnapshot();
  });

  it('spaces ,', () => {
    expect(tex2mml('A\\,B')).toMatchSnapshot();
  });

  it('spaces :', () => {
    expect(tex2mml('A\\:B')).toMatchSnapshot();
  });

  it('spaces >', () => {
    expect(tex2mml('A\\>B')).toMatchSnapshot();
  });

  it('spaces ;', () => {
    expect(tex2mml('A\\;B')).toMatchSnapshot();
  });

  it('spaces !', () => {
    expect(tex2mml('A\\!B')).toMatchSnapshot();
  });

  it('spaces quad', () => {
    expect(tex2mml('A\\quad B')).toMatchSnapshot();
  });

  it('spaces qquad', () => {
    expect(tex2mml('A\\qquad B')).toMatchSnapshot();
  });

  it('spaces enspace', () => {
    expect(tex2mml('A\\enspace B')).toMatchSnapshot();
  });

  it('spaces thinspace', () => {
    expect(tex2mml('A\\thinspace B')).toMatchSnapshot();
  });

  it('spaces negthinspace', () => {
    expect(tex2mml('A\\negthinspace B')).toMatchSnapshot();
  });

  it('Hfil', () => {
    expect(
      tex2mml('\\begin{array}{cc}a&\\hfil b\\\\d&ccc\\end{array}')
    ).toMatchSnapshot();
  });

  it('Hfill', () => {
    expect(
      tex2mml('\\begin{array}{cc}a&\\hfill b\\\\d&ccc\\end{array}')
    ).toMatchSnapshot();
  });

  it('Hfilll', () => {
    expect(
      tex2mml('\\begin{array}{cc}a&\\hfilll b\\\\d&ccc\\end{array}')
    ).toMatchSnapshot();
  });

  it('Hfil Centering', () => {
    expect(
      tex2mml('\\begin{array}{l} \\hfil x\\hfil \\end{array}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Delimiters', () => {
  it('<', () => {
    expect(tex2mml('< a >')).toMatchSnapshot();
  });

  it('left right <', () => {
    expect(tex2mml('\\left< a \\right>')).toMatchSnapshot();
  });

  it('lt', () => {
    expect(tex2mml('\\lt a \\gt')).toMatchSnapshot();
  });

  it('left right lt', () => {
    expect(tex2mml('\\left\\lt a \\right\\gt')).toMatchSnapshot();
  });

  it('/', () => {
    expect(tex2mml('/ a \\\\')).toMatchSnapshot();
  });

  it('left right /', () => {
    expectTexError('\\left/ a \\right\\\\').toBe(
      'Missing or unrecognized delimiter for \\right'
    );
  });

  it('lmoustache', () => {
    expect(tex2mml('\\lmoustache a \\rmoustache')).toMatchSnapshot();
  });

  it('left right lmoustache', () => {
    expect(
      tex2mml('\\left\\lmoustache a \\right\\rmoustache')
    ).toMatchSnapshot();
  });

  it('lgroup', () => {
    expect(tex2mml('\\lgroup a \\rgroup')).toMatchSnapshot();
  });

  it('left right lgroup', () => {
    expect(tex2mml('\\left\\lgroup a \\right\\rgroup')).toMatchSnapshot();
  });

  it('arrowvert', () => {
    expect(tex2mml('\\arrowvert a \\Arrowvert')).toMatchSnapshot();
  });

  it('left right arrowvert', () => {
    expect(tex2mml('\\left\\arrowvert a \\right\\Arrowvert')).toMatchSnapshot();
  });

  it('bracevert', () => {
    expect(tex2mml('\\bracevert a \\Vert')).toMatchSnapshot();
  });

  it('left right bracevert', () => {
    expect(tex2mml('\\left\\bracevert a \\right\\Vert')).toMatchSnapshot();
  });

  it('updownarrow', () => {
    expect(tex2mml('\\updownarrow a \\Updownarrow')).toMatchSnapshot();
  });

  it('left right updownarrow', () => {
    expect(
      tex2mml('\\left\\updownarrow a \\right\\Updownarrow')
    ).toMatchSnapshot();
  });

  it('backslash', () => {
    expect(tex2mml('/ a \\backslash')).toMatchSnapshot();
  });

  it('left right left/', () => {
    expect(tex2mml('\\left/ a \\right\\backslash')).toMatchSnapshot();
  });

  it('Uparrow', () => {
    expect(tex2mml('\\Uparrow a \\Downarrow')).toMatchSnapshot();
  });

  it('left right Uparrow', () => {
    expect(tex2mml('\\left\\Uparrow a \\right\\Downarrow')).toMatchSnapshot();
  });

  it('rangle', () => {
    expect(tex2mml('\\rangle a \\langle')).toMatchSnapshot();
  });

  it('left right rangle', () => {
    expect(tex2mml('\\left\\rangle a \\right\\langle')).toMatchSnapshot();
  });

  it('rbrace', () => {
    expect(tex2mml('\\rbrace a \\lbrace')).toMatchSnapshot();
  });

  it('left right rbrace', () => {
    expect(tex2mml('\\left\\rbrace a \\right\\lbrace')).toMatchSnapshot();
  });

  it('rceil', () => {
    expect(tex2mml('\\rceil a \\lceil')).toMatchSnapshot();
  });

  it('left right rceil', () => {
    expect(tex2mml('\\left\\rceil a \\right\\lceil')).toMatchSnapshot();
  });

  it('rfloor', () => {
    expect(tex2mml('\\rfloor a \\lfloor')).toMatchSnapshot();
  });

  it('left right rfloor', () => {
    expect(tex2mml('\\left\\rfloor a \\right\\lfloor')).toMatchSnapshot();
  });

  it('lbrack', () => {
    expect(tex2mml('\\lbrack a \\rbrack')).toMatchSnapshot();
  });

  it('left right lbrack', () => {
    expect(tex2mml('\\left\\lbrack a \\right\\rbrack')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Named Functions', () => {
  it('Limit', () => {
    expect(tex2mml('\\lim')).toMatchSnapshot();
  });

  it('Named Function Arg', () => {
    expect(tex2mml('\\sin x')).toMatchSnapshot();
  });

  it('Named Function Parent Arg', () => {
    expect(tex2mml('\\sin(x)')).toMatchSnapshot();
  });

  it('Fn Pos Space', () => {
    expect(tex2mml('\\sin\\quad x')).toMatchSnapshot();
  });

  it('Fn Neg Space', () => {
    expect(tex2mml('\\sin\\! x')).toMatchSnapshot();
  });

  it('Fn Stretchy', () => {
    expect(tex2mml('\\sin \\left(\\right)')).toMatchSnapshot();
  });

  it('Fn Operator', () => {
    expect(tex2mml('\\sin +')).toMatchSnapshot();
  });

  it('arcsin', () => {
    expect(tex2mml('\\arcsin')).toMatchSnapshot();
  });

  it('arccos', () => {
    expect(tex2mml('\\arccos')).toMatchSnapshot();
  });

  it('arctan', () => {
    expect(tex2mml('\\arctan')).toMatchSnapshot();
  });

  it('arg', () => {
    expect(tex2mml('\\arg')).toMatchSnapshot();
  });

  it('cos', () => {
    expect(tex2mml('\\cos')).toMatchSnapshot();
  });

  it('cosh', () => {
    expect(tex2mml('\\cosh')).toMatchSnapshot();
  });

  it('cot', () => {
    expect(tex2mml('\\cot')).toMatchSnapshot();
  });

  it('coth', () => {
    expect(tex2mml('\\coth')).toMatchSnapshot();
  });

  it('csc', () => {
    expect(tex2mml('\\csc')).toMatchSnapshot();
  });

  it('deg', () => {
    expect(tex2mml('\\deg')).toMatchSnapshot();
  });

  it('det', () => {
    expect(tex2mml('\\det')).toMatchSnapshot();
  });

  it('dim', () => {
    expect(tex2mml('\\dim')).toMatchSnapshot();
  });

  it('exp', () => {
    expect(tex2mml('\\exp')).toMatchSnapshot();
  });

  it('gcd', () => {
    expect(tex2mml('\\gcd')).toMatchSnapshot();
  });

  it('hom', () => {
    expect(tex2mml('\\hom')).toMatchSnapshot();
  });

  it('inf', () => {
    expect(tex2mml('\\inf')).toMatchSnapshot();
  });

  it('ker', () => {
    expect(tex2mml('\\ker')).toMatchSnapshot();
  });

  it('lg', () => {
    expect(tex2mml('\\lg')).toMatchSnapshot();
  });

  it('liminf', () => {
    expect(tex2mml('\\liminf')).toMatchSnapshot();
  });

  it('limsup', () => {
    expect(tex2mml('\\limsup')).toMatchSnapshot();
  });

  it('ln', () => {
    expect(tex2mml('\\ln')).toMatchSnapshot();
  });

  it('log', () => {
    expect(tex2mml('\\log')).toMatchSnapshot();
  });

  it('max', () => {
    expect(tex2mml('\\max')).toMatchSnapshot();
  });

  it('min', () => {
    expect(tex2mml('\\min')).toMatchSnapshot();
  });

  it('Pr', () => {
    expect(tex2mml('\\Pr')).toMatchSnapshot();
  });

  it('sec', () => {
    expect(tex2mml('\\sec')).toMatchSnapshot();
  });

  it('sinh', () => {
    expect(tex2mml('\\sinh')).toMatchSnapshot();
  });

  it('sup', () => {
    expect(tex2mml('\\sup')).toMatchSnapshot();
  });

  it('tan', () => {
    expect(tex2mml('\\tan')).toMatchSnapshot();
  });

  it('tanh', () => {
    expect(tex2mml('\\tanh')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Greek characters', () => {
  it('alpha', () => {
    expect(tex2mml('\\alpha')).toMatchSnapshot();
  });

  it('beta', () => {
    expect(tex2mml('\\beta')).toMatchSnapshot();
  });

  it('delta', () => {
    expect(tex2mml('\\delta')).toMatchSnapshot();
  });

  it('epsilon', () => {
    expect(tex2mml('\\epsilon')).toMatchSnapshot();
  });

  it('zeta', () => {
    expect(tex2mml('\\zeta')).toMatchSnapshot();
  });

  it('eta', () => {
    expect(tex2mml('\\eta')).toMatchSnapshot();
  });

  it('theta', () => {
    expect(tex2mml('\\theta')).toMatchSnapshot();
  });

  it('iota', () => {
    expect(tex2mml('\\iota')).toMatchSnapshot();
  });

  it('kappa', () => {
    expect(tex2mml('\\kappa')).toMatchSnapshot();
  });

  it('lambda', () => {
    expect(tex2mml('\\lambda')).toMatchSnapshot();
  });

  it('nu', () => {
    expect(tex2mml('\\nu')).toMatchSnapshot();
  });

  it('xi', () => {
    expect(tex2mml('\\xi')).toMatchSnapshot();
  });

  it('omicron', () => {
    expect(tex2mml('\\omicron')).toMatchSnapshot();
  });

  it('rho', () => {
    expect(tex2mml('\\rho')).toMatchSnapshot();
  });

  it('tau', () => {
    expect(tex2mml('\\tau')).toMatchSnapshot();
  });

  it('upsilon', () => {
    expect(tex2mml('\\upsilon')).toMatchSnapshot();
  });

  it('chi', () => {
    expect(tex2mml('\\chi')).toMatchSnapshot();
  });

  it('psi', () => {
    expect(tex2mml('\\psi')).toMatchSnapshot();
  });

  it('omega', () => {
    expect(tex2mml('\\omega')).toMatchSnapshot();
  });

  it('varepsilon', () => {
    expect(tex2mml('\\varepsilon')).toMatchSnapshot();
  });

  it('vartheta', () => {
    expect(tex2mml('\\vartheta')).toMatchSnapshot();
  });

  it('varpi', () => {
    expect(tex2mml('\\varpi')).toMatchSnapshot();
  });

  it('varrho', () => {
    expect(tex2mml('\\varrho')).toMatchSnapshot();
  });

  it('varsigma', () => {
    expect(tex2mml('\\varsigma')).toMatchSnapshot();
  });

  it('varphi', () => {
    expect(tex2mml('\\varphi')).toMatchSnapshot();
  });

  it('Delta', () => {
    expect(tex2mml('\\Delta')).toMatchSnapshot();
  });

  it('Theta', () => {
    expect(tex2mml('\\Theta')).toMatchSnapshot();
  });

  it('Xi', () => {
    expect(tex2mml('\\Xi')).toMatchSnapshot();
  });

  it('Pi', () => {
    expect(tex2mml('\\Pi')).toMatchSnapshot();
  });

  it('Sigma', () => {
    expect(tex2mml('\\Sigma')).toMatchSnapshot();
  });

  it('Phi', () => {
    expect(tex2mml('\\Phi')).toMatchSnapshot();
  });

  it('Psi', () => {
    expect(tex2mml('\\Psi')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mathchar0mi', () => {
  it('AA', () => {
    expect(tex2mml('\\AA')).toMatchSnapshot();
  });

  it('S', () => {
    expect(tex2mml('\\S')).toMatchSnapshot();
  });

  it('aleph', () => {
    expect(tex2mml('\\aleph')).toMatchSnapshot();
  });

  it('hbar', () => {
    expect(tex2mml('\\hbar')).toMatchSnapshot();
  });

  it('imath', () => {
    expect(tex2mml('\\imath')).toMatchSnapshot();
  });

  it('jmath', () => {
    expect(tex2mml('\\jmath')).toMatchSnapshot();
  });

  it('ell', () => {
    expect(tex2mml('\\ell')).toMatchSnapshot();
  });

  it('wp', () => {
    expect(tex2mml('\\wp')).toMatchSnapshot();
  });

  it('Re', () => {
    expect(tex2mml('\\Re')).toMatchSnapshot();
  });

  it('Im', () => {
    expect(tex2mml('\\Im')).toMatchSnapshot();
  });

  it('partial', () => {
    expect(tex2mml('\\partial')).toMatchSnapshot();
  });

  it('emptyset', () => {
    expect(tex2mml('\\emptyset')).toMatchSnapshot();
  });

  it('nabla', () => {
    expect(tex2mml('\\nabla')).toMatchSnapshot();
  });

  it('top', () => {
    expect(tex2mml('\\top')).toMatchSnapshot();
  });

  it('bot', () => {
    expect(tex2mml('\\bot')).toMatchSnapshot();
  });

  it('angle', () => {
    expect(tex2mml('\\angle')).toMatchSnapshot();
  });

  it('triangle', () => {
    expect(tex2mml('\\triangle')).toMatchSnapshot();
  });

  it('forall', () => {
    expect(tex2mml('\\forall')).toMatchSnapshot();
  });

  it('exists', () => {
    expect(tex2mml('\\exists')).toMatchSnapshot();
  });

  it('neg', () => {
    expect(tex2mml('\\neg')).toMatchSnapshot();
  });

  it('lnot', () => {
    expect(tex2mml('\\lnot')).toMatchSnapshot();
  });

  it('flat', () => {
    expect(tex2mml('\\flat')).toMatchSnapshot();
  });

  it('natural', () => {
    expect(tex2mml('\\natural')).toMatchSnapshot();
  });

  it('sharp', () => {
    expect(tex2mml('\\sharp')).toMatchSnapshot();
  });

  it('clubsuit', () => {
    expect(tex2mml('\\clubsuit')).toMatchSnapshot();
  });

  it('diamondsuit', () => {
    expect(tex2mml('\\diamondsuit')).toMatchSnapshot();
  });

  it('heartsuit', () => {
    expect(tex2mml('\\heartsuit')).toMatchSnapshot();
  });

  it('spadesuit', () => {
    expect(tex2mml('\\spadesuit')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Mathchar0mo', () => {
  it('Rightarrow', () => {
    expect(tex2mml('\\Rightarrow')).toMatchSnapshot();
  });

  it('surd', () => {
    expect(tex2mml('\\surd')).toMatchSnapshot();
  });

  it('coprod', () => {
    expect(tex2mml('\\coprod')).toMatchSnapshot();
  });

  it('bigvee', () => {
    expect(tex2mml('\\bigvee')).toMatchSnapshot();
  });

  it('bigwedge', () => {
    expect(tex2mml('\\bigwedge')).toMatchSnapshot();
  });

  it('biguplus', () => {
    expect(tex2mml('\\biguplus')).toMatchSnapshot();
  });

  it('bigcap', () => {
    expect(tex2mml('\\bigcap')).toMatchSnapshot();
  });

  it('bigcup', () => {
    expect(tex2mml('\\bigcup')).toMatchSnapshot();
  });

  it('intop', () => {
    expect(tex2mml('\\intop')).toMatchSnapshot();
  });

  it('iint', () => {
    expect(tex2mml('\\iint')).toMatchSnapshot();
  });

  it('iiint', () => {
    expect(tex2mml('\\iiint')).toMatchSnapshot();
  });

  it('bigotimes', () => {
    expect(tex2mml('\\bigotimes')).toMatchSnapshot();
  });

  it('bigoplus', () => {
    expect(tex2mml('\\bigoplus')).toMatchSnapshot();
  });

  it('bigodot', () => {
    expect(tex2mml('\\bigodot')).toMatchSnapshot();
  });

  it('ointop', () => {
    expect(tex2mml('\\ointop')).toMatchSnapshot();
  });

  it('oiint', () => {
    expect(tex2mml('\\oiint')).toMatchSnapshot();
  });

  it('oiiint', () => {
    expect(tex2mml('\\oiiint')).toMatchSnapshot();
  });

  it('bigsqcup', () => {
    expect(tex2mml('\\bigsqcup')).toMatchSnapshot();
  });

  it('smallint', () => {
    expect(tex2mml('\\smallint')).toMatchSnapshot();
  });

  it('triangleleft', () => {
    expect(tex2mml('\\triangleleft')).toMatchSnapshot();
  });

  it('triangleright', () => {
    expect(tex2mml('\\triangleright')).toMatchSnapshot();
  });

  it('bigtriangleup', () => {
    expect(tex2mml('\\bigtriangleup')).toMatchSnapshot();
  });

  it('bigtriangledown', () => {
    expect(tex2mml('\\bigtriangledown')).toMatchSnapshot();
  });

  it('wedge', () => {
    expect(tex2mml('\\wedge')).toMatchSnapshot();
  });

  it('land', () => {
    expect(tex2mml('\\land')).toMatchSnapshot();
  });

  it('vee', () => {
    expect(tex2mml('\\vee')).toMatchSnapshot();
  });

  it('lor', () => {
    expect(tex2mml('\\lor')).toMatchSnapshot();
  });

  it('cap', () => {
    expect(tex2mml('\\cap')).toMatchSnapshot();
  });

  it('cup', () => {
    expect(tex2mml('\\cup')).toMatchSnapshot();
  });

  it('ddagger', () => {
    expect(tex2mml('\\ddagger')).toMatchSnapshot();
  });

  it('dagger', () => {
    expect(tex2mml('\\dagger')).toMatchSnapshot();
  });

  it('sqcap', () => {
    expect(tex2mml('\\sqcap')).toMatchSnapshot();
  });

  it('sqcup', () => {
    expect(tex2mml('\\sqcup')).toMatchSnapshot();
  });

  it('uplus', () => {
    expect(tex2mml('\\uplus')).toMatchSnapshot();
  });

  it('amalg', () => {
    expect(tex2mml('\\amalg')).toMatchSnapshot();
  });

  it('diamond', () => {
    expect(tex2mml('\\diamond')).toMatchSnapshot();
  });

  it('bullet', () => {
    expect(tex2mml('\\bullet')).toMatchSnapshot();
  });

  it('wr', () => {
    expect(tex2mml('\\wr')).toMatchSnapshot();
  });

  it('div', () => {
    expect(tex2mml('\\div')).toMatchSnapshot();
  });

  it('odot', () => {
    expect(tex2mml('\\odot')).toMatchSnapshot();
  });

  it('oslash', () => {
    expect(tex2mml('\\oslash')).toMatchSnapshot();
  });

  it('otimes', () => {
    expect(tex2mml('\\otimes')).toMatchSnapshot();
  });

  it('ominus', () => {
    expect(tex2mml('\\ominus')).toMatchSnapshot();
  });

  it('oplus', () => {
    expect(tex2mml('\\oplus')).toMatchSnapshot();
  });

  it('mp', () => {
    expect(tex2mml('\\mp')).toMatchSnapshot();
  });

  it('circ', () => {
    expect(tex2mml('\\circ')).toMatchSnapshot();
  });

  it('bigcirc', () => {
    expect(tex2mml('\\bigcirc')).toMatchSnapshot();
  });

  it('setminus', () => {
    expect(tex2mml('\\setminus')).toMatchSnapshot();
  });

  it('cdot', () => {
    expect(tex2mml('\\cdot')).toMatchSnapshot();
  });

  it('ast', () => {
    expect(tex2mml('\\ast')).toMatchSnapshot();
  });

  it('times', () => {
    expect(tex2mml('\\times')).toMatchSnapshot();
  });

  it('star', () => {
    expect(tex2mml('\\star')).toMatchSnapshot();
  });

  it('propto', () => {
    expect(tex2mml('\\propto')).toMatchSnapshot();
  });

  it('sqsubseteq', () => {
    expect(tex2mml('\\sqsubseteq')).toMatchSnapshot();
  });

  it('sqsupseteq', () => {
    expect(tex2mml('\\sqsupseteq')).toMatchSnapshot();
  });

  it('parallel', () => {
    expect(tex2mml('\\parallel')).toMatchSnapshot();
  });

  it('mid', () => {
    expect(tex2mml('\\mid')).toMatchSnapshot();
  });

  it('dashv', () => {
    expect(tex2mml('\\dashv')).toMatchSnapshot();
  });

  it('vdash', () => {
    expect(tex2mml('\\vdash')).toMatchSnapshot();
  });

  it('le', () => {
    expect(tex2mml('\\le')).toMatchSnapshot();
  });

  it('geq', () => {
    expect(tex2mml('\\geq')).toMatchSnapshot();
  });

  it('ge', () => {
    expect(tex2mml('\\ge')).toMatchSnapshot();
  });

  it('succ', () => {
    expect(tex2mml('\\succ')).toMatchSnapshot();
  });

  it('prec', () => {
    expect(tex2mml('\\prec')).toMatchSnapshot();
  });

  it('approx', () => {
    expect(tex2mml('\\approx')).toMatchSnapshot();
  });

  it('succeq', () => {
    expect(tex2mml('\\succeq')).toMatchSnapshot();
  });

  it('preceq', () => {
    expect(tex2mml('\\preceq')).toMatchSnapshot();
  });

  it('supset', () => {
    expect(tex2mml('\\supset')).toMatchSnapshot();
  });

  it('subset', () => {
    expect(tex2mml('\\subset')).toMatchSnapshot();
  });

  it('supseteq', () => {
    expect(tex2mml('\\supseteq')).toMatchSnapshot();
  });

  it('subseteq', () => {
    expect(tex2mml('\\subseteq')).toMatchSnapshot();
  });

  it('in', () => {
    expect(tex2mml('\\in')).toMatchSnapshot();
  });

  it('ni', () => {
    expect(tex2mml('\\ni')).toMatchSnapshot();
  });

  it('notin', () => {
    expect(tex2mml('\\notin')).toMatchSnapshot();
  });

  it('owns', () => {
    expect(tex2mml('\\owns')).toMatchSnapshot();
  });

  it('gg', () => {
    expect(tex2mml('\\gg')).toMatchSnapshot();
  });

  it('ll', () => {
    expect(tex2mml('\\ll')).toMatchSnapshot();
  });

  it('perp', () => {
    expect(tex2mml('\\perp')).toMatchSnapshot();
  });

  it('equiv', () => {
    expect(tex2mml('\\equiv')).toMatchSnapshot();
  });

  it('smile', () => {
    expect(tex2mml('\\smile')).toMatchSnapshot();
  });

  it('frown', () => {
    expect(tex2mml('\\frown')).toMatchSnapshot();
  });

  it('ne', () => {
    expect(tex2mml('\\ne')).toMatchSnapshot();
  });

  it('neq', () => {
    expect(tex2mml('\\neq')).toMatchSnapshot();
  });

  it('doteq', () => {
    expect(tex2mml('\\doteq')).toMatchSnapshot();
  });

  it('bowtie', () => {
    expect(tex2mml('\\bowtie')).toMatchSnapshot();
  });

  it('models', () => {
    expect(tex2mml('\\models')).toMatchSnapshot();
  });

  it('notChar', () => {
    expect(tex2mml('\\notChar')).toMatchSnapshot();
  });

  it('Leftrightarrow', () => {
    expect(tex2mml('\\Leftrightarrow')).toMatchSnapshot();
  });

  it('Leftarrow', () => {
    expect(tex2mml('\\Leftarrow')).toMatchSnapshot();
  });

  it('leftrightarrow', () => {
    expect(tex2mml('\\leftrightarrow')).toMatchSnapshot();
  });

  it('leftarrow', () => {
    expect(tex2mml('\\leftarrow')).toMatchSnapshot();
  });

  it('gets', () => {
    expect(tex2mml('\\gets')).toMatchSnapshot();
  });

  it('to', () => {
    expect(tex2mml('\\to')).toMatchSnapshot();
  });

  it('mapsto', () => {
    expect(tex2mml('\\mapsto')).toMatchSnapshot();
  });

  it('leftharpoonup', () => {
    expect(tex2mml('\\leftharpoonup')).toMatchSnapshot();
  });

  it('leftharpoondown', () => {
    expect(tex2mml('\\leftharpoondown')).toMatchSnapshot();
  });

  it('rightharpoonup', () => {
    expect(tex2mml('\\rightharpoonup')).toMatchSnapshot();
  });

  it('rightharpoondown', () => {
    expect(tex2mml('\\rightharpoondown')).toMatchSnapshot();
  });

  it('nearrow', () => {
    expect(tex2mml('\\nearrow')).toMatchSnapshot();
  });

  it('searrow', () => {
    expect(tex2mml('\\searrow')).toMatchSnapshot();
  });

  it('nwarrow', () => {
    expect(tex2mml('\\nwarrow')).toMatchSnapshot();
  });

  it('swarrow', () => {
    expect(tex2mml('\\swarrow')).toMatchSnapshot();
  });

  it('rightleftharpoons', () => {
    expect(tex2mml('\\rightleftharpoons')).toMatchSnapshot();
  });

  it('hookrightarrow', () => {
    expect(tex2mml('\\hookrightarrow')).toMatchSnapshot();
  });

  it('hookleftarrow', () => {
    expect(tex2mml('\\hookleftarrow')).toMatchSnapshot();
  });

  it('longleftarrow', () => {
    expect(tex2mml('\\longleftarrow')).toMatchSnapshot();
  });

  it('Longleftarrow', () => {
    expect(tex2mml('\\Longleftarrow')).toMatchSnapshot();
  });

  it('Longrightarrow', () => {
    expect(tex2mml('\\Longrightarrow')).toMatchSnapshot();
  });

  it('Longleftrightarrow', () => {
    expect(tex2mml('\\Longleftrightarrow')).toMatchSnapshot();
  });

  it('longleftrightarrow', () => {
    expect(tex2mml('\\longleftrightarrow')).toMatchSnapshot();
  });

  it('longmapsto', () => {
    expect(tex2mml('\\longmapsto')).toMatchSnapshot();
  });

  it('colon', () => {
    expect(tex2mml('\\colon')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Dots', () => {
  it('Identifier Dots', () => {
    expect(tex2mml('A\\dots B')).toMatchSnapshot();
  });

  it('Operator Dots', () => {
    expect(tex2mml('+\\dots+')).toMatchSnapshot();
  });

  it('Relation Dots', () => {
    expect(tex2mml('x<\\dots<y')).toMatchSnapshot();
  });

  it('Dots Left', () => {
    expect(tex2mml('\\dots\\left( A\\right)')).toMatchSnapshot();
  });

  it('Dots Open', () => {
    expect(tex2mml('\\dots{\\alpha}')).toMatchSnapshot();
  });

  it('ldots', () => {
    expect(tex2mml('\\ldots')).toMatchSnapshot();
  });

  it('vdots', () => {
    expect(tex2mml('\\vdots')).toMatchSnapshot();
  });

  it('cdots', () => {
    expect(tex2mml('\\cdots')).toMatchSnapshot();
  });

  it('ddots', () => {
    expect(tex2mml('\\ddots')).toMatchSnapshot();
  });

  it('iddots', () => {
    expect(tex2mml('\\iddots')).toMatchSnapshot();
  });

  it('dotsc', () => {
    expect(tex2mml('\\dotsc')).toMatchSnapshot();
  });

  it('dotsb', () => {
    expect(tex2mml('\\dotsb')).toMatchSnapshot();
  });

  it('dotsm', () => {
    expect(tex2mml('\\dotsm')).toMatchSnapshot();
  });

  it('dotsi', () => {
    expect(tex2mml('\\dotsi')).toMatchSnapshot();
  });

  it('dotso', () => {
    expect(tex2mml('\\dotso')).toMatchSnapshot();
  });

  it('ldotp', () => {
    expect(tex2mml('\\ldotp')).toMatchSnapshot();
  });

  it('cdotp', () => {
    expect(tex2mml('\\cdotp')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Font Simple', () => {
  it('rm', () => {
    expect(tex2mml('\\rm a')).toMatchSnapshot();
  });

  it('mit', () => {
    expect(tex2mml('\\mit a')).toMatchSnapshot();
  });

  it('oldstyle', () => {
    expect(tex2mml('\\oldstyle 9')).toMatchSnapshot();
  });

  it('it', () => {
    expect(tex2mml('\\it a')).toMatchSnapshot();
  });

  it('bf', () => {
    expect(tex2mml('\\bf a')).toMatchSnapshot();
  });

  it('sf', () => {
    expect(tex2mml('\\sf a')).toMatchSnapshot();
  });

  it('tt', () => {
    expect(tex2mml('\\tt a')).toMatchSnapshot();
  });

  it('frak', () => {
    expect(tex2mml('\\frak a')).toMatchSnapshot();
  });

  it('Bbb', () => {
    expect(tex2mml('\\Bbb a')).toMatchSnapshot();
  });

  it('mathbf', () => {
    expect(tex2mml('\\mathbf{x}')).toMatchSnapshot();
  });

  it('mathup', () => {
    expect(tex2mml('\\mathup a')).toMatchSnapshot();
  });

  it('mathnormal', () => {
    expect(tex2mml('\\mathnormal a')).toMatchSnapshot();
  });

  it('mathbfup', () => {
    expect(tex2mml('\\mathbfup a')).toMatchSnapshot();
  });

  it('mathit', () => {
    expect(tex2mml('\\mathit a')).toMatchSnapshot();
  });

  it('mathbfit', () => {
    expect(tex2mml('\\mathbfit a')).toMatchSnapshot();
  });

  it('mathbb', () => {
    expect(tex2mml('\\mathbb a')).toMatchSnapshot();
  });

  it('mathfrak', () => {
    expect(tex2mml('\\mathfrak a')).toMatchSnapshot();
  });

  it('mathbffrak', () => {
    expect(tex2mml('\\mathbffrak a')).toMatchSnapshot();
  });

  it('mathscr', () => {
    expect(tex2mml('\\mathscr a')).toMatchSnapshot();
  });

  it('mathbfscr', () => {
    expect(tex2mml('\\mathbfscr a')).toMatchSnapshot();
  });

  it('mathsf', () => {
    expect(tex2mml('\\mathsf a')).toMatchSnapshot();
  });

  it('mathsfup', () => {
    expect(tex2mml('\\mathsfup a')).toMatchSnapshot();
  });

  it('mathbfsf', () => {
    expect(tex2mml('\\mathbfsf a')).toMatchSnapshot();
  });

  it('mathbfsfup', () => {
    expect(tex2mml('\\mathbfsfup a')).toMatchSnapshot();
  });

  it('mathsfit', () => {
    expect(tex2mml('\\mathsfit a')).toMatchSnapshot();
  });

  it('mathbfsfit', () => {
    expect(tex2mml('\\mathbfsfit a')).toMatchSnapshot();
  });

  it('mathtt', () => {
    expect(tex2mml('\\mathtt a')).toMatchSnapshot();
  });

  it('mathcal', () => {
    expect(tex2mml('\\mathcal a')).toMatchSnapshot();
  });

  it('mathbfcal', () => {
    expect(tex2mml('\\mathbfcal a')).toMatchSnapshot();
  });

  it('symrm', () => {
    expect(tex2mml('\\symrm a')).toMatchSnapshot();
  });

  it('symup', () => {
    expect(tex2mml('\\symup a')).toMatchSnapshot();
  });

  it('symnormal', () => {
    expect(tex2mml('\\symnormal a')).toMatchSnapshot();
  });

  it('symbf', () => {
    expect(tex2mml('\\symbf a')).toMatchSnapshot();
  });

  it('symbfup', () => {
    expect(tex2mml('\\symbfup a')).toMatchSnapshot();
  });

  it('symit', () => {
    expect(tex2mml('\\symit a')).toMatchSnapshot();
  });

  it('symbfit', () => {
    expect(tex2mml('\\symbfit a')).toMatchSnapshot();
  });

  it('symbb', () => {
    expect(tex2mml('\\symbb a')).toMatchSnapshot();
  });

  it('symfrak', () => {
    expect(tex2mml('\\symfrak a')).toMatchSnapshot();
  });

  it('symbffrak', () => {
    expect(tex2mml('\\symbffrak a')).toMatchSnapshot();
  });

  it('symscr', () => {
    expect(tex2mml('\\symscr a')).toMatchSnapshot();
  });

  it('symbfscr', () => {
    expect(tex2mml('\\symbfscr a')).toMatchSnapshot();
  });

  it('symsf', () => {
    expect(tex2mml('\\symsf a')).toMatchSnapshot();
  });

  it('symsfup', () => {
    expect(tex2mml('\\symsfup a')).toMatchSnapshot();
  });

  it('symbfsf', () => {
    expect(tex2mml('\\symbfsf a')).toMatchSnapshot();
  });

  it('symbfsfup', () => {
    expect(tex2mml('\\symbfsfup a')).toMatchSnapshot();
  });

  it('symsfit', () => {
    expect(tex2mml('\\symsfit a')).toMatchSnapshot();
  });

  it('symbfsfit', () => {
    expect(tex2mml('\\symbfsfit a')).toMatchSnapshot();
  });

  it('symtt', () => {
    expect(tex2mml('\\symtt a')).toMatchSnapshot();
  });

  it('symcal', () => {
    expect(tex2mml('\\symcal a')).toMatchSnapshot();
  });

  it('symbfcal', () => {
    expect(tex2mml('\\symbfcal a')).toMatchSnapshot();
  });

  it('textrm', () => {
    expect(tex2mml('\\textrm a')).toMatchSnapshot();
  });

  it('textup', () => {
    expect(tex2mml('\\textup a')).toMatchSnapshot();
  });

  it('textnormal', () => {
    expect(tex2mml('\\textnormal a')).toMatchSnapshot();
  });

  it('textit', () => {
    expect(tex2mml('\\textit a')).toMatchSnapshot();
  });

  it('textbf', () => {
    expect(tex2mml('\\textbf a')).toMatchSnapshot();
  });

  it('textsf', () => {
    expect(tex2mml('\\textsf a')).toMatchSnapshot();
  });

  it('texttt', () => {
    expect(tex2mml('\\texttt a')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Over Under Extenders', () => {
  it('overparen', () => {
    expect(tex2mml('\\overparen{ab}')).toMatchSnapshot();
  });

  it('underparen', () => {
    expect(tex2mml('\\underparen{ab}')).toMatchSnapshot();
  });

  it('overrightarrow', () => {
    expect(tex2mml('\\overrightarrow{ab}')).toMatchSnapshot();
  });

  it('underrightarrow', () => {
    expect(tex2mml('\\underrightarrow{ab}')).toMatchSnapshot();
  });

  it('overleftarrow', () => {
    expect(tex2mml('\\overleftarrow{ab}')).toMatchSnapshot();
  });

  it('underleftarrow', () => {
    expect(tex2mml('\\underleftarrow{ab}')).toMatchSnapshot();
  });

  it('overleftrightarrow', () => {
    expect(tex2mml('\\overleftrightarrow{ab}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Math style sizes', () => {
  it('displaystyle', () => {
    expect(tex2mml('\\displaystyle A', false)).toMatchSnapshot();
  });

  it('textstyle', () => {
    expect(tex2mml('\\textstyle B', false)).toMatchSnapshot();
  });

  it('scriptstyle', () => {
    expect(tex2mml('\\scriptstyle C', false)).toMatchSnapshot();
  });

  it('scriptscriptstyle', () => {
    expect(tex2mml('\\scriptscriptstyle a')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Special characters', () => {
  it('Space', () => {
    expect(tex2mml('a b')).toMatchSnapshot();
  });

  it('Tab', () => {
    expect(tex2mml('a\tb')).toMatchSnapshot();
  });

  it('CR', () => {
    expect(tex2mml('a\rb')).toMatchSnapshot();
  });

  it('Newline', () => {
    expect(tex2mml('a\nb')).toMatchSnapshot();
  });

  it('No break space', () => {
    expect(tex2mml('a{\u00A0}b')).toMatchSnapshot();
  });

  it('Prime', () => {
    expect(tex2mml('a\u2019b')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Special macros', () => {
  it('Iff', () => {
    expect(tex2mml('A \\iff B')).toMatchSnapshot();
  });

  it('TeX', () => {
    expect(tex2mml('\\TeX')).toMatchSnapshot();
  });

  it('LaTeX', () => {
    expect(tex2mml('\\LaTeX')).toMatchSnapshot();
  });

  it('Skew 7', () => {
    expect(tex2mml('\\skew7\\hat A')).toMatchSnapshot();
  });

  it('Skew 20', () => {
    expect(tex2mml('\\skew{20}\\hat A')).toMatchSnapshot();
  });

  it('Pmb', () => {
    expectTexError('a \\pmb a \\boldsymbol a').toBe(
      'Undefined control sequence \\boldsymbol'
    );
  });

  it('Space', () => {
    expect(tex2mml('A \\space B')).toMatchSnapshot();
  });

  it('Space 2', () => {
    expect(tex2mml('A \\ B')).toMatchSnapshot();
  });

  it('Space 3', () => {
    expect(tex2mml('A \\ B')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Big Commands for Delimiters', () => {
  it('big', () => {
    expect(tex2mml('\\big|')).toMatchSnapshot();
  });

  it('Big', () => {
    expect(tex2mml('\\Big|')).toMatchSnapshot();
  });

  it('bigg', () => {
    expect(tex2mml('\\bigg|')).toMatchSnapshot();
  });

  it('Bigg', () => {
    expect(tex2mml('\\Bigg|')).toMatchSnapshot();
  });

  it('Biggl', () => {
    expect(tex2mml('\\Biggl|')).toMatchSnapshot();
  });

  it('Biggr', () => {
    expect(tex2mml('\\Biggr|')).toMatchSnapshot();
  });

  it('bigm', () => {
    expect(tex2mml('\\bigm|')).toMatchSnapshot();
  });

  it('Bigm', () => {
    expect(tex2mml('\\Bigm|')).toMatchSnapshot();
  });

  it('biggm', () => {
    expect(tex2mml('\\biggm|')).toMatchSnapshot();
  });

  it('Biggm', () => {
    expect(tex2mml('\\Biggm|')).toMatchSnapshot();
  });

  it('Big with braces', () => {
    expect(tex2mml('\\Big{\\{}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Boxes', () => {
  it('Fbox', () => {
    expect(tex2mml('\\fbox{x}')).toMatchSnapshot();
  });

  it('Hbox', () => {
    expect(tex2mml('\\hbox{x}')).toMatchSnapshot();
  });

  it('Vtop', () => {
    expect(tex2mml('\\vtop{x}')).toMatchSnapshot();
  });

  it('Vtop Hsize', () => {
    expect(tex2mml('\\hsize{2cm}\\vtop{x}')).toMatchSnapshot();
  });

  it('Vtop Hsize =', () => {
    expect(tex2mml('\\hsize=2cm\\vtop{x}')).toMatchSnapshot();
  });

  it('Vcenter', () => {
    expect(tex2mml('\\vcenter{x}')).toMatchSnapshot();
  });

  it('Vcenter Hsize', () => {
    expect(tex2mml('\\hsize{2cm}\\vcenter{x}')).toMatchSnapshot();
  });

  it('Vbox', () => {
    expect(tex2mml('\\vbox{x}')).toMatchSnapshot();
  });

  it('Vbox Hsize', () => {
    expect(tex2mml('\\hsize{2cm}\\vbox{x}')).toMatchSnapshot();
  });

  it('Parbox', () => {
    expect(tex2mml('\\parbox{2cm}{x}')).toMatchSnapshot();
  });

  it('Boxed', () => {
    expect(tex2mml('\\boxed{x}')).toMatchSnapshot();
  });

  it('Framebox', () => {
    expect(tex2mml('\\framebox{x}')).toMatchSnapshot();
  });

  it('Framebox dimension', () => {
    expect(tex2mml('\\framebox[2cm]{x}')).toMatchSnapshot();
  });

  it('Framebox dimension position', () => {
    expect(tex2mml('\\framebox[2cm][c]{x}')).toMatchSnapshot();
  });

  it('Makebox', () => {
    expect(tex2mml('\\makebox{x}')).toMatchSnapshot();
  });

  it('Makebox dimension', () => {
    expect(tex2mml('\\makebox[2cm]{x}')).toMatchSnapshot();
  });

  it('Makebox dimension position', () => {
    expect(tex2mml('\\makebox[2cm][c]{x}')).toMatchSnapshot();
  });

  it('Makebox Cap position', () => {
    expect(tex2mml('\\makebox[2cm][C]{x}')).toMatchSnapshot();
  });

  it('Rule 2D', () => {
    expect(tex2mml('\\rule{2cm}{1cm}')).toMatchSnapshot();
  });

  it('Rule 2D positive raise', () => {
    expect(tex2mml('\\rule[3cm]{2cm}{1cm}')).toMatchSnapshot();
  });

  it('Rule 2D negative raise', () => {
    expect(tex2mml('\\rule[-3cm]{2cm}{1cm}')).toMatchSnapshot();
  });

  it('Rule 3D', () => {
    expect(tex2mml('\\Rule{2cm}{2cm}{1cm}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Moving Elements', () => {
  it('Space 3D', () => {
    expect(tex2mml('\\Space{2cm}{2cm}{1cm}')).toMatchSnapshot();
  });

  it('Strut', () => {
    expect(tex2mml('\\strut{x}')).toMatchSnapshot();
  });

  it('Phantom', () => {
    expect(tex2mml('x\\phantom{y}z')).toMatchSnapshot();
  });

  it('Vertical Phantom', () => {
    expect(tex2mml('x\\vphantom{y}z')).toMatchSnapshot();
  });

  it('Horizontal Phantom', () => {
    expect(tex2mml('x\\hphantom{y}z')).toMatchSnapshot();
  });

  it('Smash', () => {
    expect(tex2mml('\\smash{x}')).toMatchSnapshot();
  });

  it('Smash Bottom', () => {
    expect(tex2mml('\\smash[b]{x}')).toMatchSnapshot();
  });

  it('Smash Top', () => {
    expect(tex2mml('\\smash[t]{x}')).toMatchSnapshot();
  });

  it('Llap', () => {
    expect(tex2mml('\\llap{x}')).toMatchSnapshot();
  });

  it('Rlap', () => {
    expect(tex2mml('\\rlap{x}')).toMatchSnapshot();
  });

  it('Rlap 2', () => {
    expect(tex2mml('a\\mathrel{\\rlap{\\,/}{=}}b')).toMatchSnapshot();
  });

  it('Llap 2', () => {
    expect(tex2mml('a\\mathrel{{=}\\llap{/\\,}}b')).toMatchSnapshot();
  });

  it('Raise In Line', () => {
    expect(tex2mml('x\\raise{2pt}{y}z')).toMatchSnapshot();
  });

  it('Lower 2', () => {
    expect(tex2mml('x\\lower{2pt}{y}z')).toMatchSnapshot();
  });

  it('Raise Negative', () => {
    expect(tex2mml('x\\raise{-2pt}{y}z')).toMatchSnapshot();
  });

  it('Lower Negative', () => {
    expect(tex2mml('x\\lower{-2pt}{y}z')).toMatchSnapshot();
  });

  it('Raise', () => {
    expect(tex2mml('\\raise 1em {x}')).toMatchSnapshot();
  });

  it('Lower', () => {
    expect(tex2mml('\\lower 1em {x}')).toMatchSnapshot();
  });

  it('Moveright', () => {
    expect(tex2mml('\\moveright 1em {x}')).toMatchSnapshot();
  });

  it('Moveleft', () => {
    expect(tex2mml('\\moveleft 1em {x}')).toMatchSnapshot();
  });

  it('Move Left Negative', () => {
    expect(tex2mml('x\\moveleft -2pt {y} z')).toMatchSnapshot();
  });

  it('Move Right Negative', () => {
    expect(tex2mml('x\\moveright -2pt {y} z')).toMatchSnapshot();
  });

  it('Mathstrut', () => {
    expect(tex2mml('\\mathstrut{x}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Linebreaks', () => {
  it('Linebreak', () => {
    expect(tex2mml('a\\\\b')).toMatchSnapshot();
  });

  it('Pagebreak', () => {
    expect(tex2mml('a\\\\*b')).toMatchSnapshot();
  });

  it('Custom Linebreak', () => {
    expect(tex2mml('a\\\\[2ex]b')).toMatchSnapshot();
  });

  it('Custom Linebreak European', () => {
    expect(tex2mml('a\\\\[1,5cm]b')).toMatchSnapshot();
  });

  it('Cr Linebreak', () => {
    expect(tex2mml('\\array{a\\cr b}')).toMatchSnapshot();
  });

  it('Array Custom Linebreak', () => {
    expect(tex2mml('\\array{a\\\\[1cm] b}')).toMatchSnapshot();
  });

  it('allowbreak', () => {
    expect(tex2mml('a\\allowbreak b')).toMatchSnapshot();
  });

  it('allowbreak cdot', () => {
    expect(tex2mml('a\\allowbreak \\cdot b')).toMatchSnapshot();
  });

  it('goodbreak', () => {
    expect(tex2mml('a\\goodbreak b')).toMatchSnapshot();
  });

  it('goodbreak cdot', () => {
    expect(tex2mml('a\\goodbreak\\cdot b')).toMatchSnapshot();
  });

  it('goodbreak cdot cdot', () => {
    expect(tex2mml('a\\cdot\\goodbreak\\cdot b')).toMatchSnapshot();
  });

  it('goodbreak comma cdot', () => {
    expect(tex2mml('a,\\goodbreak\\cdot b')).toMatchSnapshot();
  });

  it('badbreak', () => {
    expect(tex2mml('a\\badbreak b')).toMatchSnapshot();
  });

  it('badbreak cdot', () => {
    expect(tex2mml('a\\badbreak\\cdot b')).toMatchSnapshot();
  });

  it('nobreak', () => {
    expect(tex2mml('a\\nobreak b')).toMatchSnapshot();
  });

  it('nobreak cdot', () => {
    expect(tex2mml('a\\nobreak\\cdot b')).toMatchSnapshot();
  });

  it('break', () => {
    expect(tex2mml('a\\break b')).toMatchSnapshot();
  });

  it('newline', () => {
    expect(tex2mml('a\\newline b')).toMatchSnapshot();
  });

  it('goodbreak comma', () => {
    expect(tex2mml('a,\\goodbreak b')).toMatchSnapshot();
  });

  it('goodbreak comma comma', () => {
    expect(tex2mml('a,\\goodbreak, b')).toMatchSnapshot();
  });

  it('goodbreak ord close', () => {
    expect(tex2mml('\u2220\\goodbreak )\\goodbreak')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('MathChar7', () => {
  it('MathChar7 Single', () => {
    expect(tex2mml('\\#')).toMatchSnapshot();
  });

  it('MathChar7 Single Font', () => {
    expect(tex2mml('\\mathbf{\\#}')).toMatchSnapshot();
  });

  it('MathChar7 Operator', () => {
    expect(tex2mml('\\And')).toMatchSnapshot();
  });

  it('MathChar7 Multi', () => {
    expect(
      tex2mml('\\Lambda \\& \\Gamma \\Rightarrow \\Omega\\And\\Upsilon')
    ).toMatchSnapshot();
  });

  it('Tilde', () => {
    expect(tex2mml('~')).toMatchSnapshot();
  });

  it('Tilde2', () => {
    expect(tex2mml('a~b')).toMatchSnapshot();
  });

  it('Underscore', () => {
    expect(tex2mml('a\\_b')).toMatchSnapshot();
  });

  it('Hash', () => {
    expect(tex2mml('a\\#b')).toMatchSnapshot();
  });

  it('Dollar', () => {
    expect(tex2mml('a\\$b')).toMatchSnapshot();
  });

  it('Percentage', () => {
    expect(tex2mml('a\\%b')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Accents', () => {
  it('Vector', () => {
    expect(tex2mml('\\vec{a}')).toMatchSnapshot();
  });

  it('Vector Multi', () => {
    expect(tex2mml('\\vec{\\vec{a}}')).toMatchSnapshot();
  });

  it('Vector Font', () => {
    expect(tex2mml('\\mathrm{\\vec{a}}')).toMatchSnapshot();
  });

  it('acute', () => {
    expect(tex2mml('\\acute{a}')).toMatchSnapshot();
  });

  it('grave', () => {
    expect(tex2mml('\\grave{a}')).toMatchSnapshot();
  });

  it('ddot', () => {
    expect(tex2mml('\\ddot{a}')).toMatchSnapshot();
  });

  it('dddot', () => {
    expect(tex2mml('\\dddot{a}')).toMatchSnapshot();
  });

  it('ddddot', () => {
    expect(tex2mml('\\ddddot{a}')).toMatchSnapshot();
  });

  it('tilde', () => {
    expect(tex2mml('\\tilde{a}')).toMatchSnapshot();
  });

  it('bar', () => {
    expect(tex2mml('\\bar{a}')).toMatchSnapshot();
  });

  it('breve', () => {
    expect(tex2mml('\\breve{a}')).toMatchSnapshot();
  });

  it('check', () => {
    expect(tex2mml('\\check{a}')).toMatchSnapshot();
  });

  it('hat', () => {
    expect(tex2mml('\\hat{a}')).toMatchSnapshot();
  });

  it('dot', () => {
    expect(tex2mml('\\dot{a}')).toMatchSnapshot();
  });

  it('widetilde', () => {
    expect(tex2mml('\\widetilde{abc}')).toMatchSnapshot();
  });

  it('widehat', () => {
    expect(tex2mml('\\widehat{abc}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Character Class Changes', () => {
  it('Mathop', () => {
    expect(tex2mml('\\mathop{\\rm a} b')).toMatchSnapshot();
  });

  it('Mathop Super', () => {
    expect(tex2mml('\\mathop{\\rm a}^b')).toMatchSnapshot();
  });

  it('Mathop Sub', () => {
    expect(tex2mml('\\mathop{\\rm a}_b')).toMatchSnapshot();
  });

  it('Mathop Sub Super', () => {
    expect(tex2mml('\\mathop{\\rm a}_b^c')).toMatchSnapshot();
  });

  it('Mathop Cal', () => {
    expect(tex2mml('\\mathop{\\cal a}')).toMatchSnapshot();
  });

  it('Mathop Apply', () => {
    expect(tex2mml('\\mathop{F} x')).toMatchSnapshot();
  });

  it('Mathop No Apply I', () => {
    expect(tex2mml('\\mathop{} x')).toMatchSnapshot();
  });

  it('Mathop no Apply II', () => {
    expect(tex2mml('\\mathop{\\mathrm{}{}} x')).toMatchSnapshot();
  });

  it('Mathrel', () => {
    expect(tex2mml('\\mathrel{R}')).toMatchSnapshot();
  });

  it('mathord', () => {
    expect(tex2mml('a\\mathord{b}c')).toMatchSnapshot();
  });

  it('mathopen', () => {
    expect(tex2mml('a\\mathopen{b}c')).toMatchSnapshot();
  });

  it('mathclose', () => {
    expect(tex2mml('a\\mathclose{b}c')).toMatchSnapshot();
  });

  it('mathbin', () => {
    expect(tex2mml('a\\mathbin{b}c')).toMatchSnapshot();
  });

  it('mathpunct', () => {
    expect(tex2mml('a\\mathpunct{b}c')).toMatchSnapshot();
  });

  it('mathinner', () => {
    expect(tex2mml('a\\mathinner{b}c')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Spacing', () => {
  it('Nonscript toplevel', () => {
    expect(
      tex2mml('\\left. a \\nonscript\\;\\middle|\\nonscript\\; b \\right.')
    ).toMatchSnapshot();
  });

  it('Nonscript scriptlevel', () => {
    expect(
      tex2mml('X_{\\left. a \\nonscript\\;\\middle|\\nonscript\\; b \\right.}')
    ).toMatchSnapshot();
  });

  it('hskip', () => {
    expect(tex2mml('\\hskip{1cm}')).toMatchSnapshot();
  });

  it('hspace', () => {
    expect(tex2mml('\\hspace{1cm}')).toMatchSnapshot();
  });

  it('mskip', () => {
    expect(tex2mml('\\mskip{1cm}')).toMatchSnapshot();
  });

  it('mspace', () => {
    expect(tex2mml('\\mspace{1cm}')).toMatchSnapshot();
  });

  it('mkern', () => {
    expect(tex2mml('\\mkern{1cm}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Complete Base Methods', () => {
  it('Comment', () => {
    expect(tex2mml('a %comment')).toMatchSnapshot();
  });

  it('Elided Times', () => {
    expect(tex2mml('a\\* b')).toMatchSnapshot();
  });
});

import { OverItem } from '#js/input/tex/base/BaseItems.js';

/**********************************************************************************/

describe('Complete Base Items', () => {
  it('Over toString', () => {
    const over = new OverItem(null);
    expect(over.toString()).toBe('over[undefined / ]');
  });
});

/**********************************************************************************/

describe('Referencing', () => {
  beforeEach(() => setupTex(['base'], { tags: 'all' }));

  it('Label', () => {
    expect(tex2mml('a\\label{A}')).toMatchSnapshot();
  });

  it('Label Empty', () => {
    expect(tex2mml('a\\label{}')).toMatchSnapshot();
  });

  it('Label Multiple', () => {
    expect(
      tex2mml('\\begin{eqnarray}a\\label{A}\\\\c\\label{B}\\end{eqnarray}')
    ).toMatchSnapshot();
  });

  it('Label Multiple Error', () => {
    expectTexError('a\\label{A}c\\label{B}').toBe('Multiple \\label');
  });

  it('Label Multiply Defined Error', () => {
    expectTexError(
      '\\begin{eqnarray}a\\label{A}\\\\c\\label{A}\\end{eqnarray}'
    ).toBe("Label 'A' multiply defined");
  });

  it('Ref', () => {
    expect(tex2mml('a\\label{A}\\ref{A}')).toMatchSnapshot();
  });

  it('Ref Unknown', () => {
    expect(tex2mml('a\\label{A}\\ref{B}')).toMatchSnapshot();
  });

  it('Nonumber', () => {
    expect(
      tex2mml('\\begin{eqnarray}a\\\\c\\nonumber\\end{eqnarray}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Complete Array', () => {
  it('column r c l', () => {
    expect(
      tex2mml('\\begin{array}{rcl}a & b &c\\\\ d & e & f\\end{array}')
    ).toMatchSnapshot();
  });

  it('column r c l | ', () => {
    expect(
      tex2mml('\\begin{array}{r|c|l}a & b & c\\\\d & e & f\\end{array}')
    ).toMatchSnapshot();
  });

  it('column r c l : ', () => {
    expect(
      tex2mml('\\begin{array}{r:c:l}a & b &c\\\\ d & e & f\\end{array}')
    ).toMatchSnapshot();
  });

  it('column r c l @ ', () => {
    expect(
      tex2mml('\\begin{array}{r@{h}c@{h}l}a & b &c\\\\ d & e & f\\end{array}')
    ).toMatchSnapshot();
  });

  it('column r c l ! ', () => {
    expect(
      tex2mml('\\begin{array}{r!{h}c!{h}l}a & b &c\\\\ d & e & f\\end{array}')
    ).toMatchSnapshot();
  });

  it('column p ', () => {
    expect(
      tex2mml(
        '\\begin{array}{p{1cm}p{1cm}p{1cm}}a & b &c\\\\ d & e & f\\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('column m ', () => {
    expect(
      tex2mml(
        '\\begin{array}{m{1cm}m{1cm}m{1cm}}a & b &c\\\\ d & e & f\\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('column b ', () => {
    expect(
      tex2mml(
        '\\begin{array}{b{1cm}b{1cm}b{1cm}}a & b &c\\\\ d & e & f\\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('column r c l >', () => {
    expect(
      tex2mml('\\begin{array}{>{A}rcl}a & b &c\\\\ d & e & f\\end{array}')
    ).toMatchSnapshot();
  });

  it('column r c l <', () => {
    expect(
      tex2mml('\\begin{array}{r<{A}cl}a & b &c\\\\ d & e & f\\end{array}')
    ).toMatchSnapshot();
  });

  it('column c >', () => {
    expect(
      tex2mml('\\begin{array}{>{A}c}a \\\\ d\\end{array}')
    ).toMatchSnapshot();
  });

  it('column c <', () => {
    expect(
      tex2mml('\\begin{array}{c<{A}}a\\\\ d \\end{array}')
    ).toMatchSnapshot();
  });

  it('column c @ end', () => {
    expect(
      tex2mml('\\begin{array}{c@{h}}a\\\\ d \\end{array}')
    ).toMatchSnapshot();
  });

  it('column c @&', () => {
    expect(
      tex2mml(
        '\\begin{array}{c@{\\alpha}c}a&\\hfill&b\\\\ d&\\hfill&e \\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('column c w', () => {
    expect(
      tex2mml('\\begin{array}{cw{c}{1cm}c}a&b&c\\\\ d&e&f \\end{array}')
    ).toMatchSnapshot();
  });

  it('column c W', () => {
    expect(
      tex2mml('\\begin{array}{cW{c}{1cm}c}a&b&c\\\\ d&e&f \\end{array}')
    ).toMatchSnapshot();
  });

  it('column repeat r c ', () => {
    expect(
      tex2mml('\\begin{array}{*{2}rc}a & b & c\\\\d & e & f\\end{array}')
    ).toMatchSnapshot();
  });

  it('column r repeat c ', () => {
    expect(
      tex2mml('\\begin{array}{r*{2}c}a & b & c\\\\d & e & f\\end{array}')
    ).toMatchSnapshot();
  });

  it('column r c repeat | ', () => {
    expect(
      tex2mml('\\begin{array}{r*{2}|c}a& b & c\\\\d & e & f\\end{array}')
    ).toMatchSnapshot();
  });

  it('column r c repeat | {}', () => {
    expect(
      tex2mml(
        '\\begin{array}{r*{2}|c}a {\\hbox{(3)}}& b & c\\\\d & e & f\\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('column r c repeat | {}', () => {
    expect(
      tex2mml(
        '\\begin{array}{r*{2}|c}a {\\begin{array}{c}Q\\end{array}}& b & c\\\\d & e & f\\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('column r c repeat | {}', () => {
    expect(
      tex2mml(
        '\\begin{array}{r*{2}|c}a \\begin{array}{c}Q\\end{array}& b & c\\\\d & e & f\\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('column c @& hfil', () => {
    expect(
      tex2mml('\\begin{array}{c@{\\alpha}c}a&&b\\\\ d&&e\\hfil \\end{array}')
    ).toMatchSnapshot();
  });

  it('Label Error', () => {
    expectTexError('\\eqalignno{a &  & {\\hbox{(3)}}').toBe(
      'Missing close brace'
    );
  });

  it('end row spacing r c l', () => {
    expect(
      tex2mml(
        '\\begin{array}{rcl}a & b &c\\\\[2cm] d & e & f\\\\[2cm] \\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('eqnarray extend last row', () => {
    expect(
      tex2mml('\\begin{eqnarray}{rcl}a & b \\\\d&c&c&c \\\\\\end{eqnarray}')
    ).toMatchSnapshot();
  });

  it('end row hline c', () => {
    expect(
      tex2mml(
        '\\begin{array}{|c|}\\hline a\\\\\\hline b\\\\\\hline\\end{array}'
      )
    ).toMatchSnapshot();
  });

  it('column ! | @', () => {
    expect(
      tex2mml('\\begin{array}{!{a}|@{b}c} X\\end{array}')
    ).toMatchSnapshot();
  });

  it('column @ | ! c', () => {
    expect(
      tex2mml('\\begin{array}{@{}|!{x}c} X \\end{array}')
    ).toMatchSnapshot();
  });

  it('column @ p m', () => {
    expect(
      tex2mml('\\begin{array}{@{x}p{1em}m{1em}} X & Y \\end{array}')
    ).toMatchSnapshot();
  });

  it('column c c @', () => {
    expect(
      tex2mml('\\begin{array}{cc@{x}} X & Y \\end{array}')
    ).toMatchSnapshot();
  });

  it('column c c | c', () => {
    expect(
      tex2mml('\\begin{array}{cc|c} X & Y & Z \\end{array}')
    ).toMatchSnapshot();
  });

  it('column > space', () => {
    expect(tex2mml('\\begin{array}{> {x} c} X \\end{array}')).toMatchSnapshot();
  });

  it('BadPreamToken', () => {
    expectTexError('\\begin{array}a').toBe('Illegal pream-token (a)');
  });

  it('Template Without End', () => {
    expectTexError('\\begin{array}{>{x}c} a').toBe('Missing \\end{array}');
  });

  it('column buffer size', () => {
    expectTexError(
      '\\begin{array}{cW{c}{1cm}c}a&b}&c\\\\ d&e&f \\end{array}'
    ).toBe(
      'MathJax internal buffer size exceeded; is there a recursive macro call?'
    );
  });

  it('Bad Dimension', () => {
    expectTexError('\\begin{array}{cp{xyz}c}a&b&c\\end{array}').toBe(
      'Missing dimension or its units for p column declaration'
    );
  });

  it('Missing argument', () => {
    expectTexError('\\begin{array}{c@}a&b\\end{array}').toBe(
      'Missing argument for @ column declaration'
    );
  });

  it('Bad * argument', () => {
    expectTexError('\\begin{array}{*{x}{x}} a&b \\end{array}').toBe(
      'First argument to * column specifier must be a number'
    );
  });
});

/**
 *
 * For completion we need define some extra commands reflecting those in other
 * packages, that needed provisions in Base.
 *
 */
import { Configuration } from '#js/input/tex/Configuration.js';
import { HandlerType, ConfigurationType } from '#js/input/tex/HandlerTypes.js';
import { CommandMap, EnvironmentMap } from '#js/input/tex/TokenMap.js';
import BaseMethods from '#js/input/tex/base/BaseMethods.js';
import ParseMethods from '#js/input/tex/ParseMethods.js';
import TexParser from '#js/input/tex/TexParser.js';

/**********************************************************************************/

describe('User Defined Macros', () => {
  new CommandMap('userMacros', {
    eqref: [BaseMethods.HandleRef, true],
    RR: [BaseMethods.Macro, '{\\bf R_{#1}}', 1, 'a'],
    color: (parser: TexParser, name: string) => {
      const color = parser.GetArgument(name);
      const style = parser.itemFactory
        .create('style')
        .setProperties({ styles: { mathcolor: color } });
      parser.stack.env['color'] = color;
      parser.Push(style);
    },
  });
  Configuration.create('userMacros', {
    [ConfigurationType.HANDLER]: {
      [HandlerType.MACRO]: ['userMacros'],
    },
  });

  beforeEach(() => setupTex(['base', 'userMacros']));

  it('Macro with empty optional def', () => {
    expect(tex2mml('\\RR')).toMatchSnapshot();
  });

  it('Macro with optional def', () => {
    expect(tex2mml('\\RR[b]')).toMatchSnapshot();
  });

  it('EqRef', () => {
    expect(tex2mml('a\\label{A}\\eqref{A}')).toMatchSnapshot();
  });

  it('Right Color', () => {
    expect(tex2mml('\\left(A\\middle|B\\color{red}\\right)')).toMatchSnapshot();
  });

  it('Middle Color', () => {
    expect(tex2mml('\\left(A\\color{red}\\middle|B\\right)')).toMatchSnapshot();
  });
});

/**********************************************************************************/

import NewcommandMethods from '#js/input/tex/newcommand/NewcommandMethods.js';
import { BeginEnvItem } from '#js/input/tex/newcommand/NewcommandItems.js';
import { MathtoolsMethods } from '#js/input/tex/mathtools/MathtoolsMethods.js';

describe('User Defined Environments', () => {
  new EnvironmentMap('userEnvs', ParseMethods.environment, {
    smallmatrix: [
      BaseMethods.Array,
      null,
      null,
      null,
      'c',
      '1',
      '.2em',
      'S',
      1,
    ],
    pmatrix: [BaseMethods.Array, null, '(', ')', 'c'],
    crampedsubarray: [
      BaseMethods.Array,
      null,
      null,
      null,
      null,
      '0em',
      '0.1em',
      "S'",
      1,
    ],
    gather: [BaseMethods.EqnArray, null, true, true, 'c', 'm'],
    user: [NewcommandMethods.BeginEnv, true, 'A', 'B', 0],
    mmtool: [MathtoolsMethods.Cases, null, '{', ''],
    eqntest: [BaseMethods.EqnArray, null, true, true, 'rl', 'bt'],
  });

  Configuration.create('userEnvs', {
    [ConfigurationType.HANDLER]: {
      [HandlerType.ENVIRONMENT]: ['userEnvs'],
    },
    [ConfigurationType.ITEMS]: {
      [BeginEnvItem.prototype.kind]: BeginEnvItem,
    },
  });

  beforeEach(() => setupTex(['base', 'userEnvs']));

  it('smallmatrix', () => {
    expect(
      tex2mml('\\begin{smallmatrix} a & b \\\\ c & d \\end{smallmatrix}')
    ).toMatchSnapshot();
  });

  it('pmatrix', () => {
    expect(
      tex2mml('\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}')
    ).toMatchSnapshot();
  });

  it('Crampedsubarray', () => {
    expect(
      tex2mml(
        '\\begin{crampedsubarray}{cc} a & b \\\\ c & d \\end{crampedsubarray}'
      )
    ).toMatchSnapshot();
  });

  it('Gather', () => {
    expect(tex2mml('\\begin{gather}a\\end{gather}')).toMatchSnapshot();
  });

  it('User', () => {
    expect(tex2mml('\\begin{user} X \\end{user}')).toMatchSnapshot();
  });

  it('Cases star', () => {
    expect(
      tex2mml('\\begin{mmtool} a & test a\\\\ b & test b \\end{mmtool}')
    ).toMatchSnapshot();
  });

  it('EqnTest', () => {
    expect(tex2mml('\\begin{eqntest} a & b \\end{eqntest}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Tagged Environments', () => {
  beforeEach(() => setupTex(['base', 'userEnvs'], { tags: 'all' }));

  it('EqnTest', () => {
    expect(tex2mml('\\begin{eqntest} a & b \\end{eqntest}')).toMatchSnapshot();
  });

  it('Equation', () => {
    expect(tex2mml('\\begin{equation} x \\end{equation}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('MathStyle', () => {
  it('French', () => {
    setupTex(['base', 'userEnvs'], { mathStyle: 'TeX' });
    expect(tex2mml('Aa\\Gamma\\gamma')).toMatchSnapshot();
  });

  it('French', () => {
    setupTex(['base', 'userEnvs'], { mathStyle: 'French' });
    expect(tex2mml('Aa\\Gamma\\gamma')).toMatchSnapshot();
  });

  it('ISO', () => {
    setupTex(['base', 'userEnvs'], { mathStyle: 'ISO' });
    expect(tex2mml('Aa\\Gamma\\gamma')).toMatchSnapshot();
  });

  it('upright', () => {
    setupTex(['base', 'userEnvs'], { mathStyle: 'upright' });
    expect(tex2mml('Aa\\Gamma\\gamma')).toMatchSnapshot();
  });

  it('other', () => {
    ParseOptions.getVariant.set('other', (_c: string) => '');
    setupTex(['base', 'userEnvs'], { mathStyle: 'other' });
    expect(tex2mml('Aa\\Gamma\\gamma')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Multiletter Indentifier', () => {
  beforeEach(() => setupTex(['base', 'userEnvs'], { identifierPattern: /^$/ }));

  it('Mismatch', () => {
    expect(tex2mml('\\mathbf{aa}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Postfilter', () => {
  Configuration.create('userFilters', {
    [ConfigurationType.POSTPROCESSORS]: [
      ({ data }: { data: ParseOptions }) => {
        data.removeFromList('undefined', []);
      },
    ],
  });

  beforeEach(() => setupTex(['base', 'userFilters']));

  it('Empty list', () => {
    expect(tex2mml('x')).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('base'));
