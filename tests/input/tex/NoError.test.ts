import { beforeAll, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeAll(() => setupTex(["base","noerrors"]));

describe('NoError', () => {
  it('Ampersand-error', () => toXmlMatch(tex2mml("&"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"&amp;\" display=\"block\">\n  <merror data-mjx-error=\"Misplaced &amp;\" title=\"Misplaced &amp;\">\n    <mtext>&amp;</mtext>\n  </merror>\n</math>"
  ));
  it('Argument-error', () => toXmlMatch(tex2mml("\\frac{b}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\frac{b}\" display=\"block\">\n  <merror data-mjx-error=\"Missing argument for \\frac\" title=\"Missing argument for \\frac\">\n    <mtext>\\frac{b}</mtext>\n  </merror>\n</math>"
  ));
  it('Undefined-CS', () => toXmlMatch(tex2mml("\\nonsense"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\nonsense\" display=\"block\">\n  <merror data-mjx-error=\"Undefined control sequence \\nonsense\" title=\"Undefined control sequence \\nonsense\">\n    <mtext>\\nonsense</mtext>\n  </merror>\n</math>"
  ));
  it('Undefined-Env', () => toXmlMatch(tex2mml("\\begin{nonsense} a \\end{nonsense}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{nonsense} a \\end{nonsense}\" display=\"block\">\n  <merror data-mjx-error=\"Unknown environment 'nonsense'\" title=\"Unknown environment 'nonsense'\">\n    <mtext>\\begin{nonsense} a \\end{nonsense}</mtext>\n  </merror>\n</math>"
  ));
  it('Double-super-error', () => toXmlMatch(tex2mml("x^2^3"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"x^2^3\" display=\"block\">\n  <merror data-mjx-error=\"Double exponent: use braces to clarify\" title=\"Double exponent: use braces to clarify\">\n    <mtext>x^2^3</mtext>\n  </merror>\n</math>"
  ));
  it('Double-over-error', () => toXmlMatch(tex2mml("\\sum^2^3"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sum^2^3\" display=\"block\">\n  <merror data-mjx-error=\"Double exponent: use braces to clarify\" title=\"Double exponent: use braces to clarify\">\n    <mtext>\\sum^2^3</mtext>\n  </merror>\n</math>"
  ));
  it('Limits Error', () => toXmlMatch(tex2mml("+\\limits^2"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"+\\limits^2\" display=\"block\">\n  <merror data-mjx-error=\"\\limits is allowed only on operators\" title=\"\\limits is allowed only on operators\">\n    <mtext>+\\limits^2</mtext>\n  </merror>\n</math>"
  ));
  it('Double sub error', () => toXmlMatch(tex2mml("x_2_3"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"x_2_3\" display=\"block\">\n  <merror data-mjx-error=\"Double subscripts: use braces to clarify\" title=\"Double subscripts: use braces to clarify\">\n    <mtext>x_2_3</mtext>\n  </merror>\n</math>"
  ));
  it('Double under error', () => toXmlMatch(tex2mml("\\sum_2_3"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sum_2_3\" display=\"block\">\n  <merror data-mjx-error=\"Double subscripts: use braces to clarify\" title=\"Double subscripts: use braces to clarify\">\n    <mtext>\\sum_2_3</mtext>\n  </merror>\n</math>"
  ));
  it('Brace Superscript Error', () => toXmlMatch(tex2mml("x'^'"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"x'^'\" display=\"block\">\n  <merror data-mjx-error=\"Missing open brace for superscript\" title=\"Missing open brace for superscript\">\n    <mtext>x'^'</mtext>\n  </merror>\n</math>"
  ));
  it('Double Prime Error', () => toXmlMatch(tex2mml("x^\\prime'"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"x^\\prime'\" display=\"block\">\n  <merror data-mjx-error=\"Prime causes double exponent: use braces to clarify\" title=\"Prime causes double exponent: use braces to clarify\">\n    <mtext>x^\\prime'</mtext>\n  </merror>\n</math>"
  ));
  it('Hash Error', () => toXmlMatch(tex2mml("#"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"#\" display=\"block\">\n  <merror data-mjx-error=\"You can't use 'macro parameter character #' in math mode\" title=\"You can't use 'macro parameter character #' in math mode\">\n    <mtext>#</mtext>\n  </merror>\n</math>"
  ));
  it('Missing Right', () => toXmlMatch(tex2mml("\\left(\\middle|"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left(\\middle|\" display=\"block\">\n  <merror data-mjx-error=\"Extra \\left or missing \\right\" title=\"Extra \\left or missing \\right\">\n    <mtext>\\left(\\middle|</mtext>\n  </merror>\n</math>"
  ));
  it('Orphan Middle', () => toXmlMatch(tex2mml("\\middle|"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\middle|\" display=\"block\">\n  <merror data-mjx-error=\"Extra \\middle\" title=\"Extra \\middle\">\n    <mtext>\\middle|</mtext>\n  </merror>\n</math>"
  ));
  it('Middle with Right', () => toXmlMatch(tex2mml("\\middle|\\right)"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\middle|\\right)\" display=\"block\">\n  <merror data-mjx-error=\"Extra \\middle\" title=\"Extra \\middle\">\n    <mtext>\\middle|\\right)</mtext>\n  </merror>\n</math>"
  ));
  it('Misplaced Move Root', () => toXmlMatch(tex2mml("\\uproot{2}\\sqrt[3]{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\uproot{2}\\sqrt[3]{a}\" display=\"block\">\n  <merror data-mjx-error=\"\\uproot can appear only within a root\" title=\"\\uproot can appear only within a root\">\n    <mtext>\\uproot{2}\\sqrt[3]{a}</mtext>\n  </merror>\n</math>"
  ));
  it('Multiple Move Root', () => toXmlMatch(tex2mml("\\sqrt[\\uproot{-2}\\uproot{2}\\beta]{k}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sqrt[\\uproot{-2}\\uproot{2}\\beta]{k}\" display=\"block\">\n  <merror data-mjx-error=\"Multiple use of \\uproot\" title=\"Multiple use of \\uproot\">\n    <mtext>\\sqrt[\\uproot{-2}\\uproot{2}\\beta]{k}</mtext>\n  </merror>\n</math>"
  ));
  it('Incorrect Move Root', () => toXmlMatch(tex2mml("\\sqrt[\\uproot-2.5\\beta]{k}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sqrt[\\uproot-2.5\\beta]{k}\" display=\"block\">\n  <merror data-mjx-error=\"The argument to \\uproot must be an integer\" title=\"The argument to \\uproot must be an integer\">\n    <mtext>\\sqrt[\\uproot-2.5\\beta]{k}</mtext>\n  </merror>\n</math>"
  ));
  it('Double Over', () => toXmlMatch(tex2mml("1 \\over 2 \\over 3"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"1 \\over 2 \\over 3\" display=\"block\">\n  <merror data-mjx-error=\"Ambiguous use of \\over\" title=\"Ambiguous use of \\over\">\n    <mtext>1 \\over 2 \\over 3</mtext>\n  </merror>\n</math>"
  ));
  it('Token Illegal Type', () => toXmlMatch(tex2mml("\\mmlToken{mk}[]{}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mmlToken{mk}[]{}\" display=\"block\">\n  <merror data-mjx-error=\"mk is not a token element\" title=\"mk is not a token element\">\n    <mtext>\\mmlToken{mk}[]{}</mtext>\n  </merror>\n</math>"
  ));
  it('Token Wrong Type', () => toXmlMatch(tex2mml("\\mmlToken{mrow}[]{}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mmlToken{mrow}[]{}\" display=\"block\">\n  <merror data-mjx-error=\"mrow is not a token element\" title=\"mrow is not a token element\">\n    <mtext>\\mmlToken{mrow}[]{}</mtext>\n  </merror>\n</math>"
  ));
  it('Token Invalid Attribute', () => toXmlMatch(tex2mml("\\mmlToken{mi}[m1=true]{}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mmlToken{mi}[m1=true]{}\" display=\"block\">\n  <merror data-mjx-error=\"Invalid MathML attribute: m1=true\" title=\"Invalid MathML attribute: m1=true\">\n    <mtext>\\mmlToken{mi}[m1=true]{}</mtext>\n  </merror>\n</math>"
  ));
  it('Token Unknown Attribute', () => toXmlMatch(tex2mml("\\mmlToken{mo}[nothing=\"something\"]{}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mmlToken{mo}[nothing=&quot;something&quot;]{}\" display=\"block\">\n  <merror data-mjx-error=\"nothing is not a recognized attribute for mo\" title=\"nothing is not a recognized attribute for mo\">\n    <mtext>\\mmlToken{mo}[nothing=&quot;something&quot;]{}</mtext>\n  </merror>\n</math>"
  ));
  it('Token Wrong Attribute', () => toXmlMatch(tex2mml("\\mmlToken{mi}[movablelimit=true]{}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\mmlToken{mi}[movablelimit=true]{}\" display=\"block\">\n  <merror data-mjx-error=\"movablelimit is not a recognized attribute for mi\" title=\"movablelimit is not a recognized attribute for mi\">\n    <mtext>\\mmlToken{mi}[movablelimit=true]{}</mtext>\n  </merror>\n</math>"
  ));
  it('MissingBeginExtraEnd', () => toXmlMatch(tex2mml("\\end{array}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\end{array}\" display=\"block\">\n  <merror data-mjx-error=\"Missing \\begin{array} or extra \\end{array}\" title=\"Missing \\begin{array} or extra \\end{array}\">\n    <mtext>\\end{array}</mtext>\n  </merror>\n</math>"
  ));
  it('ExtraCloseMissingOpen', () => toXmlMatch(tex2mml("x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"x}\" display=\"block\">\n  <merror data-mjx-error=\"Extra close brace or missing open brace\" title=\"Extra close brace or missing open brace\">\n    <mtext>x}</mtext>\n  </merror>\n</math>"
  ));
  it('MissingLeftExtraRight', () => toXmlMatch(tex2mml("x\\right\\}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"x\\right\\}\" display=\"block\">\n  <merror data-mjx-error=\"Missing \\left or extra \\right\" title=\"Missing \\left or extra \\right\">\n    <mtext>x\\right\\}</mtext>\n  </merror>\n</math>"
  ));
  it('ExtraOpenMissingClose', () => toXmlMatch(tex2mml("{x"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"{x\" display=\"block\">\n  <merror data-mjx-error=\"Extra open brace or missing close brace\" title=\"Extra open brace or missing close brace\">\n    <mtext>{x</mtext>\n  </merror>\n</math>"
  ));
  it('MissingScript Sub', () => toXmlMatch(tex2mml("x_"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"x_\" display=\"block\">\n  <merror data-mjx-error=\"Missing superscript or subscript argument\" title=\"Missing superscript or subscript argument\">\n    <mtext>x_</mtext>\n  </merror>\n</math>"
  ));
  it('MissingScript Sup', () => toXmlMatch(tex2mml("x^"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"x^\" display=\"block\">\n  <merror data-mjx-error=\"Missing superscript or subscript argument\" title=\"Missing superscript or subscript argument\">\n    <mtext>x^</mtext>\n  </merror>\n</math>"
  ));
  it('MissingOpenForSup', () => toXmlMatch(tex2mml("x^^"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"x^^\" display=\"block\">\n  <merror data-mjx-error=\"Missing open brace for superscript\" title=\"Missing open brace for superscript\">\n    <mtext>x^^</mtext>\n  </merror>\n</math>"
  ));
  it('MissingOpenForSub', () => toXmlMatch(tex2mml("x__"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"x__\" display=\"block\">\n  <merror data-mjx-error=\"Missing open brace for subscript\" title=\"Missing open brace for subscript\">\n    <mtext>x__</mtext>\n  </merror>\n</math>"
  ));
  it('ExtraLeftMissingRight', () => toXmlMatch(tex2mml("\\left\\{x"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\{x\" display=\"block\">\n  <merror data-mjx-error=\"Extra \\left or missing \\right\" title=\"Extra \\left or missing \\right\">\n    <mtext>\\left\\{x</mtext>\n  </merror>\n</math>"
  ));
  it('Misplaced Cr', () => toXmlMatch(tex2mml("a\\cr b"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"a\\cr b\" display=\"block\">\n  <merror data-mjx-error=\"Misplaced \\cr\" title=\"Misplaced \\cr\">\n    <mtext>a\\cr b</mtext>\n  </merror>\n</math>"
  ));
  it('Dimension Error', () => toXmlMatch(tex2mml("a\\\\[abc] b"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"a\\\\[abc] b\" display=\"block\">\n  <merror data-mjx-error=\"Bracket argument to \\\\ must be a dimension\" title=\"Bracket argument to \\\\ must be a dimension\">\n    <mtext>a\\\\[abc] b</mtext>\n  </merror>\n</math>"
  ));
  it('MissingArgFor', () => toXmlMatch(tex2mml("\\sqrt"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sqrt\" display=\"block\">\n  <merror data-mjx-error=\"Missing argument for \\sqrt\" title=\"Missing argument for \\sqrt\">\n    <mtext>\\sqrt</mtext>\n  </merror>\n</math>"
  ));
  it('ExtraCloseMissingOpen 2', () => toXmlMatch(tex2mml("\\sqrt}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sqrt}\" display=\"block\">\n  <merror data-mjx-error=\"Extra close brace or missing open brace\" title=\"Extra close brace or missing open brace\">\n    <mtext>\\sqrt}</mtext>\n  </merror>\n</math>"
  ));
  it('MissingCloseBrace', () => toXmlMatch(tex2mml("\\sqrt{"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sqrt{\" display=\"block\">\n  <merror data-mjx-error=\"Missing close brace\" title=\"Missing close brace\">\n    <mtext>\\sqrt{</mtext>\n  </merror>\n</math>"
  ));
  it('ExtraCloseLooking1', () => toXmlMatch(tex2mml("\\sqrt[3}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sqrt[3}\" display=\"block\">\n  <merror data-mjx-error=\"Extra close brace while looking for ']'\" title=\"Extra close brace while looking for ']'\">\n    <mtext>\\sqrt[3}</mtext>\n  </merror>\n</math>"
  ));
  it('MissingCloseBracket', () => toXmlMatch(tex2mml("\\sqrt[3{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\sqrt[3{x}\" display=\"block\">\n  <merror data-mjx-error=\"Could not find closing ']' for argument to \\sqrt\" title=\"Could not find closing ']' for argument to \\sqrt\">\n    <mtext>\\sqrt[3{x}</mtext>\n  </merror>\n</math>"
  ));
  it('MissingOrUnrecognizedDelim1', () => toXmlMatch(tex2mml("\\left\\alpha b"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left\\alpha b\" display=\"block\">\n  <merror data-mjx-error=\"Missing or unrecognized delimiter for \\left\" title=\"Missing or unrecognized delimiter for \\left\">\n    <mtext>\\left\\alpha b</mtext>\n  </merror>\n</math>"
  ));
  it('MissingOrUnrecognizedDelim2', () => toXmlMatch(tex2mml("\\left( b\\right"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\left( b\\right\" display=\"block\">\n  <merror data-mjx-error=\"Missing or unrecognized delimiter for \\right\" title=\"Missing or unrecognized delimiter for \\right\">\n    <mtext>\\left( b\\right</mtext>\n  </merror>\n</math>"
  ));
  it('MissingDimOrUnits', () => toXmlMatch(tex2mml("\\rule{}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\rule{}\" display=\"block\">\n  <merror data-mjx-error=\"Missing dimension or its units for \\rule\" title=\"Missing dimension or its units for \\rule\">\n    <mtext>\\rule{}</mtext>\n  </merror>\n</math>"
  ));
  it('TokenNotFoundForCommand', () => toXmlMatch(tex2mml("\\root {3] \\of 5"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\root {3] \\of 5\" display=\"block\">\n  <merror data-mjx-error=\"Could not find \\of for \\root\" title=\"Could not find \\of for \\root\">\n    <mtext>\\root {3] \\of 5</mtext>\n  </merror>\n</math>"
  ));
  it('ExtraCloseLooking2', () => toXmlMatch(tex2mml("\\root [3} \\of 5 "),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\root [3} \\of 5 \" display=\"block\">\n  <merror data-mjx-error=\"Extra close brace while looking for \\of\" title=\"Extra close brace while looking for \\of\">\n    <mtext>\\root [3} \\of 5 </mtext>\n  </merror>\n</math>"
  ));
  it('MissingOrUnrecognizedDelim', () => toXmlMatch(tex2mml("\\genfrac{(}{a}{}{2}{1}{2}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\genfrac{(}{a}{}{2}{1}{2}\" display=\"block\">\n  <merror data-mjx-error=\"Undefined control sequence \\genfrac\" title=\"Undefined control sequence \\genfrac\">\n    <mtext>\\genfrac{(}{a}{}{2}{1}{2}</mtext>\n  </merror>\n</math>"
  ));
  it('ErroneousNestingEq', () => toXmlMatch(tex2mml("\\begin{equation}\\begin{eqnarray}\\end{eqnarray}\\end{equation}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{equation}\\begin{eqnarray}\\end{eqnarray}\\end{equation}\" display=\"block\">\n  <merror data-mjx-error=\"Erroneous nesting of equation structures\" title=\"Erroneous nesting of equation structures\">\n    <mtext>\\begin{equation}\\begin{eqnarray}\\end{eqnarray}\\end{equation}</mtext>\n  </merror>\n</math>"
  ));
  it('ExtraAlignTab', () => toXmlMatch(tex2mml("\\cases{b & l & k}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cases{b &amp; l &amp; k}\" display=\"block\">\n  <merror data-mjx-error=\"Extra alignment tab in \\cases text\" title=\"Extra alignment tab in \\cases text\">\n    <mtext>\\cases{b &amp; l &amp; k}</mtext>\n  </merror>\n</math>"
  ));
  it('Misplaced hline', () => toXmlMatch(tex2mml("\\hline"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\hline\" display=\"block\">\n  <merror data-mjx-error=\"Misplaced \\hline\" title=\"Misplaced \\hline\">\n    <mtext>\\hline</mtext>\n  </merror>\n</math>"
  ));
  it('UnsupportedHFill', () => toXmlMatch(tex2mml("a\\hfill b"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"a\\hfill b\" display=\"block\">\n  <merror data-mjx-error=\"Unsupported use of \\hfill\" title=\"Unsupported use of \\hfill\">\n    <mtext>a\\hfill b</mtext>\n  </merror>\n</math>"
  ));
  it('InvalidEnv', () => toXmlMatch(tex2mml("\\begin{\\ff}kk\\end{\\ff}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{\\ff}kk\\end{\\ff}\" display=\"block\">\n  <merror data-mjx-error=\"Invalid environment name '\\ff'\" title=\"Invalid environment name '\\ff'\">\n    <mtext>\\begin{\\ff}kk\\end{\\ff}</mtext>\n  </merror>\n</math>"
  ));
  it('EnvBadEnd', () => toXmlMatch(tex2mml("\\begin{equation}a\\end{array}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{equation}a\\end{array}\" display=\"block\">\n  <merror data-mjx-error=\"\\begin{equation} ended with \\end{array}\" title=\"\\begin{equation} ended with \\end{array}\">\n    <mtext>\\begin{equation}a\\end{array}</mtext>\n  </merror>\n</math>"
  ));
  it('EnvMissingEnd Array', () => toXmlMatch(tex2mml("\\begin{array}a"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{array}a\" display=\"block\">\n  <merror data-mjx-error=\"Illegal pream-token (a)\" title=\"Illegal pream-token (a)\">\n    <mtext>\\begin{array}a</mtext>\n  </merror>\n</math>"
  ));
  it('MissingBoxFor', () => toXmlMatch(tex2mml("\\raise{2pt}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\raise{2pt}\" display=\"block\">\n  <merror data-mjx-error=\"Missing box for \\raise\" title=\"Missing box for \\raise\">\n    <mtext>\\raise{2pt}</mtext>\n  </merror>\n</math>"
  ));
  it('MissingCloseBrace2', () => toXmlMatch(tex2mml("\\begin{array}{c"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{array}{c\" display=\"block\">\n  <merror data-mjx-error=\"Missing close brace\" title=\"Missing close brace\">\n    <mtext>\\begin{array}{c</mtext>\n  </merror>\n</math>"
  ));
  it('EnvMissingEnd Equation', () => toXmlMatch(tex2mml("\\begin{equation}a"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{equation}a\" display=\"block\">\n  <merror data-mjx-error=\"Missing \\end{equation}\" title=\"Missing \\end{equation}\">\n    <mtext>\\begin{equation}a</mtext>\n  </merror>\n</math>"
  ));
})
