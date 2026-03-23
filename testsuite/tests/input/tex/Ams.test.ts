import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTex(['base', 'ams']));

/**********************************************************************************/

describe('Ams', () => {

  it('Symbol', () => {
    expect(tex2mml('\\digamma')).toMatchSnapshot();
  });

  it('Operator', () => {
    expect(tex2mml('\\dotplus')).toMatchSnapshot();
  });

  it('Delimiter', () => {
    expect(tex2mml('\\ulcorner')).toMatchSnapshot();
  });

  it('Delimiter-left-right', () => {
    expect(tex2mml('\\left\\ulcorner A \\right\\urcorner')).toMatchSnapshot();
  });

  it('Macro', () => {
    expect(tex2mml('A\\implies B')).toMatchSnapshot();
  });

  it('AMS-math-mo', () => {
    expect(tex2mml('\\iiiint')).toMatchSnapshot();
  });

  it('AMS-math-macro', () => {
    expect(tex2mml('\\ddddot{1}')).toMatchSnapshot();
  });

  it('Normal Fraction', () => {
    expect(tex2mml('\\frac{n}{k}')).toMatchSnapshot();
  });

  it('Text Fraction', () => {
    expect(tex2mml('\\tfrac{n}{k}')).toMatchSnapshot();
  });

  it('Display Fraction', () => {
    expect(tex2mml('\\dfrac{n}{k}')).toMatchSnapshot();
  });

  it('Normal Sub Fraction', () => {
    expect(tex2mml('a_\\frac{n}{k}')).toMatchSnapshot();
  });

  it('Text Sub Fraction', () => {
    expect(tex2mml('a_\\tfrac{n}{k}')).toMatchSnapshot();
  });

  it('Display Sub Fraction', () => {
    expect(tex2mml('a_\\dfrac{n}{k}')).toMatchSnapshot();
  });

  it('Normal Binomial', () => {
    expect(tex2mml('\\binom{n}{k}')).toMatchSnapshot();
  });

  it('Text Binomial', () => {
    expect(tex2mml('\\tbinom{n}{k}')).toMatchSnapshot();
  });

  it('Display Binomial', () => {
    expect(tex2mml('\\dbinom{n}{k}')).toMatchSnapshot();
  });

  it('Normal Sub Binomial', () => {
    expect(tex2mml('a_\\binom{n}{k}')).toMatchSnapshot();
  });

  it('Text Sub Binomial', () => {
    expect(tex2mml('a_\\tbinom{n}{k}')).toMatchSnapshot();
  });

  it('Display Sub Binomial', () => {
    expect(tex2mml('a_\\dbinom{n}{k}')).toMatchSnapshot();
  });

  it('Center Fraction', () => {
    expect(tex2mml('\\cfrac{a}{bbb}')).toMatchSnapshot();
  });

  it('Left Fraction', () => {
    expect(tex2mml('\\cfrac[l]{a}{bbb}')).toMatchSnapshot();
  });

  it('Right Fraction', () => {
    expect(tex2mml('\\cfrac[r]{a}{bbb}')).toMatchSnapshot();
  });

  it('Above Left Arrow', () => {
    expect(tex2mml('\\xleftarrow{abcd}')).toMatchSnapshot();
  });

  it('Above Below Left Arrow', () => {
    expect(tex2mml('\\xleftarrow[xyz]{abcd}')).toMatchSnapshot();
  });

  it('Above Left Arrow in Context', () => {
    expect(tex2mml('A\\xleftarrow{abcd}B')).toMatchSnapshot();
  });

  it('Above Right Arrow', () => {
    expect(tex2mml('\\xrightarrow{abcd}')).toMatchSnapshot();
  });

  it('Above Below Right Arrow', () => {
    expect(tex2mml('\\xrightarrow[xyz]{abcd}')).toMatchSnapshot();
  });

  it('Above Right Arrow in Context', () => {
    expect(tex2mml('A\\xrightarrow{abcd}B')).toMatchSnapshot();
  });

  it('Genfrac', () => {
    expect(tex2mml('\\genfrac{[}{]}{0pt}{3}{a}{b}')).toMatchSnapshot();
  });

  it('Genfrac no delimiters', () => {
    expect(tex2mml('\\genfrac{}{}{0pt}{3}{a}{b}')).toMatchSnapshot();
  });

  it('MultiInt', () => {
    expect(tex2mml('\\idotsint')).toMatchSnapshot();
  });

  it('MultiInt in Context', () => {
    expect(tex2mml('a \\idotsint b')).toMatchSnapshot();
  });

  it('MultiInt with Command', () => {
    expect(tex2mml('\\idotsint\\sin x')).toMatchSnapshot();
  });

  it('MultiInt with Limits', () => {
    expect(tex2mml('\\idotsint\\limits_a^b+3')).toMatchSnapshot();
  });

  it('DeclareMathOp', () => {
    expect(tex2mml('\\DeclareMathOperator{\\R}{R}a\\R b')).toMatchSnapshot();
  });

  it('DeclareMathOp star', () => {
    expect(tex2mml('\\DeclareMathOperator*{\\R}{R}a\\R b')).toMatchSnapshot();
  });

  it('Operatorname', () => {
    expect(tex2mml('a\\operatorname{xyz}b')).toMatchSnapshot();
  });

  it('Operatorname Complex', () => {
    expect(tex2mml('\\operatorname{a+}')).toMatchSnapshot();
  });

  it('Operatorname Letters', () => {
    expect(tex2mml('*\\operatorname{*c}-\\operatorname{-a}')).toMatchSnapshot();
  });

  it('Operatorname Followed by CS', () => {
    expect(tex2mml('\\operatorname{a+}\\alpha')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Ams Environments', () => {

  it('Subarray', () => {
    expect(tex2mml('\\begin{subarray}{c}a\\end{subarray}')).toMatchSnapshot();
  });

  it('Small Matrix', () => {
    expect(tex2mml('\\begin{smallmatrix}a\\end{smallmatrix}')).toMatchSnapshot();
  });

  it('Align', () => {
    expect(tex2mml('\\begin{align} a&=b \\\\ c&=d \\end{align}')).toMatchSnapshot();
  });

  it('Align Star', () => {
    expect(tex2mml('\\begin{align*} a&=b \\\\ c&=d \\end{align*}')).toMatchSnapshot();
  });

  it('Multline', () => {
    expect(tex2mml('\\begin{multline} a\\\\ b \\\\ c \\end{multline}')).toMatchSnapshot();
  });

  it('Multline Star', () => {
    expect(tex2mml('\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}')).toMatchSnapshot();
  });

  it('Split', () => {
    expect(tex2mml(
        '\\begin{align*} a&=b \\begin{split} r&=s\\\\ & =t \\end{split} \\\\ c&=d \\end{align*}'
    )).toMatchSnapshot();
  });

  it('Gather', () => {
    expect(tex2mml('\\begin{gather} a=b \\\\ c=d \\end{gather}')).toMatchSnapshot();
  });

  it('Gather Star', () => {
    expect(tex2mml('\\begin{gather*} a=b \\\\ c=d \\end{gather*}')).toMatchSnapshot();
  });

  it('Alignat', () => {
    expect(tex2mml('\\begin{alignat}{2} a&=b \\\\ c&=d \\end{alignat}')).toMatchSnapshot();
  });

  it('Alignat Star', () => {
    expect(tex2mml('\\begin{alignat*}{2} a&=b \\\\ c&=d \\end{alignat*}')).toMatchSnapshot();
  });

  it('Alignedat', () => {
    expect(tex2mml(
        '\\begin{align*} a&=b \\begin{alignedat}{2} r&=s\\\\ & =t \\end{alignedat} \\\\ c&=d \\end{align*}'
    )).toMatchSnapshot();
  });

  it('Aligned', () => {
    expect(tex2mml(
        '\\begin{align*} a&=b \\begin{aligned} r&=s\\\\ & =t \\end{aligned} \\\\ c&=d \\end{align*}'
    )).toMatchSnapshot();
  });

  it('Gathered', () => {
    expect(tex2mml(
        '\\begin{align*} a&=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&=d \\end{align*}'
    )).toMatchSnapshot();
  });

  it('Equation', () => {
    expect(tex2mml('\\begin{equation} a \\end{equation}')).toMatchSnapshot();
  });

  it('Equation Star', () => {
    expect(tex2mml('\\begin{equation*} a \\end{equation*}')).toMatchSnapshot();
  });

  it('Eqnarray', () => {
    expect(tex2mml('\\begin{eqnarray} a & = & b\\\\ c & = & d \\end{eqnarray}')).toMatchSnapshot();
  });

  it('Eqnarray Star', () => {
    expect(tex2mml('\\begin{eqnarray*} a & = & b\\\\ c & = & d \\end{eqnarray*}')).toMatchSnapshot();
  });

  it('flalign', () => {
    expect(tex2mml('\\begin{flalign} a & = & b\\\\ c & = & d \\end{flalign}')).toMatchSnapshot();
  });

  it('xalignat', () => {
    expect(tex2mml('\\begin{xalignat}{2} a&b & c&d \\end{xalignat}')).toMatchSnapshot();
  });

  it('xalignat error', () => {
    expectTexError('\\begin{xalignat}{x} \\and{xalignat}')
      .toBe('Argument to \\begin{xalignat} must be a positive integer');
  });

  it('xxalignat', () => {
    expect(tex2mml('\\begin{xxalignat}{2} a&b & c&d \\end{xxalignat}')).toMatchSnapshot();
  });

  it('xalignat error 2', () => {
    expectTexError('\\begin{xalignat}{1} a&b & \\end{xalignat}')
      .toBe('Extra & in row of xalignat');
  });

  it('xalignat padding', () => {
    expect(tex2mml('\\begin{xalignat}{2} a&b \\end{xalignat}')).toMatchSnapshot();
  });

  it('xalign tagged', () => {
    expect(tex2mml('\\begin{xalignat}{2} a & b \\tag{1}\\end{xalignat}')).toMatchSnapshot();
  });

  it('flalign small', () => {
    expect(tex2mml('\\begin{flalign} a&b \\end{flalign}')).toMatchSnapshot();
  });

  it('matrix', () => {
    expect(tex2mml('\\begin{matrix} a & b \\\\ c & d \\end{matrix}')).toMatchSnapshot();
  });

  it('pmatrix', () => {
    expect(tex2mml('\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}')).toMatchSnapshot();
  });

  it('bmatrix', () => {
    expect(tex2mml('\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}')).toMatchSnapshot();
  });

  it('Bmatrix', () => {
    expect(tex2mml('\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}')).toMatchSnapshot();
  });

  it('Vmatrix', () => {
    expect(tex2mml('\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}')).toMatchSnapshot();
  });

  it('cases', () => {
    expect(tex2mml('f(x) = \\begin{cases} 1 & \\text{if $x > 1$} \\\\ 0 & \\text{otherwise} \\end{cases}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Ams Tagged Environments', () => {
  beforeEach(() => setupTex(['base', 'ams'], { tags: 'ams' }));

  it('Subarray', () => {
    expect(tex2mml('\\begin{subarray}{c}a\\end{subarray}')).toMatchSnapshot();
  });

  it('Small Matrix', () => {
    expect(tex2mml('\\begin{smallmatrix}a\\end{smallmatrix}')).toMatchSnapshot();
  });

  it('Align', () => {
    expect(tex2mml('\\begin{align} a&=b \\\\ c&=d \\end{align}')).toMatchSnapshot();
  });

  it('Align Star', () => {
    expect(tex2mml('\\begin{align*} a&=b \\\\ c&=d \\end{align*}')).toMatchSnapshot();
  });

  it('Multline', () => {
    expect(tex2mml('\\begin{multline} a\\\\ b \\\\ c \\end{multline}')).toMatchSnapshot();
  });

  it('Multline Star', () => {
    expect(tex2mml('\\begin{multline*} a\\\\ b \\\\ c \\end{multline*}')).toMatchSnapshot();
  });

  it('Split', () => {
    expect(tex2mml(
        '\\begin{align*} a&=b \\begin{split} r&=s\\\\ & =t \\end{split} \\\\ c&=d \\end{align*}'
    )).toMatchSnapshot();
  });

  it('Gather', () => {
    expect(tex2mml('\\begin{gather} a=b \\\\ c=d \\end{gather}')).toMatchSnapshot();
  });

  it('Gather Star', () => {
    expect(tex2mml('\\begin{gather*} a=b \\\\ c=d \\end{gather*}')).toMatchSnapshot();
  });

  it('Alignat', () => {
    expect(tex2mml('\\begin{alignat}{2} a&=b \\\\ c&=d \\end{alignat}')).toMatchSnapshot();
  });

  it('Alignat Star', () => {
    expect(tex2mml('\\begin{alignat*}{2} a&=b \\\\ c&=d \\end{alignat*}')).toMatchSnapshot();
  });

  it('Alignedat', () => {
    expect(tex2mml(
        '\\begin{align*} a&=b \\begin{alignedat}{2} r&=s\\\\ & =t \\end{alignedat} \\\\ c&=d \\end{align*}'
    )).toMatchSnapshot();
  });

  it('Aligned', () => {
    expect(tex2mml(
        '\\begin{align*} a&=b \\begin{aligned} r&=s\\\\ & =t \\end{aligned} \\\\ c&=d \\end{align*}'
    )).toMatchSnapshot();
  });

  it('Gathered', () => {
    expect(tex2mml(
        '\\begin{align*} a&=b \\begin{gathered} r=s\\\\  =t \\end{gathered} \\\\ c&=d \\end{align*}'
    )).toMatchSnapshot();
  });

  it('Equation', () => {
    expect(tex2mml('\\begin{equation} a \\end{equation}')).toMatchSnapshot();
  });

  it('Equation Star', () => {
    expect(tex2mml('\\begin{equation*} a \\end{equation*}')).toMatchSnapshot();
  });

  it('Eqnarray', () => {
    expect(tex2mml('\\begin{eqnarray} a & = & b\\\\ c & = & d \\end{eqnarray}')).toMatchSnapshot();
  });

  it('Eqnarray Star', () => {
    expect(tex2mml('\\begin{eqnarray*} a & = & b\\\\ c & = & d \\end{eqnarray*}')).toMatchSnapshot();
  });

  it('Align Notag', () => {
    expect(tex2mml('\\begin{align} a&=b \\\\ &=c \\notag \\end{align}')).toMatchSnapshot();
  });

  it('xalignet', () => {
    expect(tex2mml('\\begin{xalignat}{1} a&b \\end{xalignat}')).toMatchSnapshot();
  });

  it('xalignet star', () => {
    expect(tex2mml('\\begin{xalignat*}{1} a&b \\end{xalignat*}')).toMatchSnapshot();
  });

  it('flalign', () => {
    expect(tex2mml('\\begin{flalign} a&b & \\end{flalign}')).toMatchSnapshot();
  });

  it('xalignet star', () => {
    expect(tex2mml('\\begin{flalign*} a&b & \\end{flalign*}')).toMatchSnapshot();
  });

  it('aligned [b]', () => {
    expect(tex2mml('\\begin{aligned} [b] a \\\\ b \\end{aligned}')).toMatchSnapshot();
  });

  it('aligned [x]', () => {
    expect(tex2mml('\\begin{aligned} [x] a \\\\ b \\end{aligned}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Ams Tagged Environments Left', () => {
  beforeEach(() => setupTex(['base', 'ams'], { tags: 'ams', tagSide: 'left' }));

  it('xalign tagged left', () => {
    expect(tex2mml('\\begin{xalignat}{2} a & b \\tag{1}\\end{xalignat}')).toMatchSnapshot();
  });

  it('multline tagged left', () => {
    expect(tex2mml('\\begin{multline} a\\tag{1} \\end{multline}')).toMatchSnapshot();
  });

  it('Nesting error', () => {
    expectTexError('\\begin{align}\\begin{align} \\end{align}\\end{align}')
      .toBe('Erroneous nesting of equation structures')
  });

  it('Gather Align', () => {
    expect(tex2mml('\\begin{gather}\\begin{align} a &= b \\end{align}\\end{gather}')).toMatchSnapshot();
  });

  it('Gather Gather', () => {
    expectTexError('\\begin{gather}\\begin{gather} \\end{gather}\\end{gather}')
      .toBe('Erroneous nesting of equation structures')
  });

});

/**********************************************************************************/

describe('Amserror', () => {

  it('Center Fraction Error', () => {
    expectTexError('\\cfrac[c]{a}{b}')
      .toBe('Illegal alignment specified in \\cfrac');
  });

  it('Genfrac Error', () => {
    expectTexError('\\genfrac{[}{]}{0pt}{4}{a}{b}')
      .toBe('Bad math style for \\genfrac');
  });

  it('MissingOrUnrecognizedDelim', () => {
    expectTexError('\\genfrac{(}{a}{}{2}{1}{2}')
      .toBe('Missing or unrecognized delimiter for \\genfrac');
  });

  it('PositiveIntegerArg', () => {
    expectTexError(
        '\\begin{align*} a&=b \\begin{alignedat}{-2} r&=s \\end{alignedat} \\\\ c&=d \\end{align*}'
      )
      .toBe('Argument to \\begin{alignedat} must be a positive integer');
  });

  it('MultlineRowsOneCol', () => {
    expectTexError('\\begin{multline}a\\\\b&c\\end{multline}')
      .toBe('The rows within the multline environment must have exactly one column');
  });

  it('CommandNotAllowedInEnv', () => {
    expectTexError('\\begin{split}a\\tag{1}\\end{split}')
      .toBe('\\tag not allowed in split environment');
  });

  it('MultipleCommand', () => {
    expectTexError('a\\tag{1}\\tag{2}')
      .toBe('Multiple \\tag');
  });

});

/**********************************************************************************/

describe('InternalMath', () => {

  it('Mbox Eqref', () => {
    expect(tex2mml('a\\mbox{ \\eqref{1} } c')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Multirel', () => {

  it('Multirel Mathvariant 1', () => {
    expect(tex2mml('a <\\equiv \\mathrm{=>}\\thickapprox b')).toMatchSnapshot();
  });

  it('Multirel Mathvariant 2', () => {
    expect(tex2mml('a <\\equiv \\mathrm{=>}\\thickapprox\\thicksim b')).toMatchSnapshot();
  });

  it('Multirel Mathvariant 3', () => {
    expect(tex2mml('a <\\equiv =>\\thickapprox\\thicksim b')).toMatchSnapshot();
  });

  it('Multirel Mathvariant 4', () => {
    expect(tex2mml(
        'a <\\equiv \\mathrm{=}\\mathrm{>}\\thickapprox\\thicksim\\frown\\smile=\\updownarrow b'
    )).toMatchSnapshot();
  });

  it('Preset Lspace Rspace', () => {
    expect(tex2mml('a\\lesssim\\gtrsim b')).toMatchSnapshot();
  });

  it('Preset Rspace Lspace', () => {
    expect(tex2mml('a\\gtrsim\\lesssim b')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('MultlineShove', () => {

  it('Shove None', () => {
    expect(tex2mml('\\begin{multline} a\\\\ b\\\\ c\\end{multline}')).toMatchSnapshot();
  });

  it('Shove Left Top', () => {
    expect(tex2mml('\\begin{multline}\\shoveleft a\\\\ b\\\\ c\\end{multline}')).toMatchSnapshot();
  });

  it('Shove Left Middle', () => {
    expect(tex2mml('\\begin{multline} a\\\\\\shoveleft b\\\\ c\\end{multline}')).toMatchSnapshot();
  });

  it('Shove Left Bottom', () => {
    expect(tex2mml('\\begin{multline} a\\\\ b\\\\\\shoveleft c\\end{multline}')).toMatchSnapshot();
  });

  it('Shove Right Top', () => {
    expect(tex2mml('\\begin{multline}\\shoveright a\\\\ b\\\\ c\\end{multline}')).toMatchSnapshot();
  });

  it('Shove Right Middle', () => {
    expect(tex2mml('\\begin{multline} a\\\\\\shoveright b\\\\ c\\end{multline}')).toMatchSnapshot();
  });

  it('Shove Right Bottom', () => {
    expect(tex2mml('\\begin{multline} a\\\\ b\\\\\\shoveright c\\end{multline}')).toMatchSnapshot();
  });

  it('Shove Right Left', () => {
    expect(tex2mml(
        '\\begin{multline} a\\\\\\shoveright\\shoveleft b\\\\ c\\end{multline}'
    )).toMatchSnapshot();
  });

  it('Shove Left Right', () => {
    expect(tex2mml(
        '\\begin{multline} a\\\\\\shoveleft\\shoveright b\\\\ c\\end{multline}'
    )).toMatchSnapshot();
  });

  it('Shove Error Top', () => {
    expectTexError('\\begin{multline}a \\shoveleft\\\\ b\\\\ c\\end{multline}')
      .toBe('\\shoveleft must come at the beginning of the line');
  });

  it('Shove Error Middle', () => {
    expectTexError('\\begin{multline} a\\\\ b \\shoveleft\\\\ c\\end{multline}')
      .toBe('\\shoveleft must come at the beginning of the line');
  });

  it('Shove Error Bottom', () => {
    expectTexError('\\begin{multline} a\\\\ b\\\\ c \\shoveleft\\end{multline}')
      .toBe('\\shoveleft must come at the beginning of the line');
  });

  it('Shove Error Environment', () => {
    expectTexError('\\begin{align}\\shoveleft a\\end{align}')
      .toBe('\\shoveleft only allowed in multline environment');
  });

});

/**********************************************************************************/

describe('Ams Complex', () => {

  it('The Lorenz Equations', () => {
    expect(tex2mml(
        '\\begin{align}\\dot{x} & = \\sigma(y-x) \\\\\\dot{y} & = \\rho x - y - xz \\\\\\dot{z} & = -\\beta z + xy\\end{align}'
    )).toMatchSnapshot();
  });

  it("Maxwell's Equations", () => {
    expect(tex2mml(
        '\\begin{align} \\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} & = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\  \\nabla \\cdot \\vec{\\mathbf{E}} & = 4 \\pi \\rho \\\\  \\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} & = \\vec{\\mathbf{0}} \\\\  \\nabla \\cdot \\vec{\\mathbf{B}} & = 0 \\end{align}'
    )).toMatchSnapshot();
  });

  it('Cubic Binomial', () => {
    expect(tex2mml(
        '\\begin{eqnarray}(x+y)^{3}&=&(x+y)(x+y)(x+y)\\\\&=&xxx+xxy+xyx+{\\underline {xyy}}+yxx+{\\underline {yxy}}+{\\underline {yyx}}+yyy\\\\&=&x^{3}+3x^{2}y+{\\underline {3xy^{2}}}+y^{3}.\\end{eqnarray}'
    )).toMatchSnapshot();
  });

  it('A Cross Product Formula', () => {
    expect(tex2mml(
        '\\mathbf{V}_1 \\times \\mathbf{V}_2 =   \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\    \\frac{\\partial X}{\\partial u} & \\frac{\\partial Y}{\\partial u} & 0 \\\\    \\frac{\\partial X}{\\partial v} & \\frac{\\partial Y}{\\partial v} & 0 \\\\   \\end{vmatrix}'
    )).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Ams SideSet', () => {

  it('Sideset Empty', () => {
    expect(tex2mml('\\sideset{}{}{}')).toMatchSnapshot();
  });

  it('Sideset Simple', () => {
    expect(tex2mml('\\sideset{}{}{a}')).toMatchSnapshot();
  });

  it('Sideset Simple Right', () => {
    expect(tex2mml('\\sideset{}{\'}{a}')).toMatchSnapshot();
  });

  it('Sideset Simple Left', () => {
    expect(tex2mml('\\sideset{\'}{}{a}')).toMatchSnapshot();
  });

  it('Sideset Simple Left Right', () => {
    expect(tex2mml('\\sideset{\'}{\'}{a}')).toMatchSnapshot();
  });

  it('Sideset Simple Sum', () => {
    expect(tex2mml('\\sideset{}{\'}\\sum_{n=0}^{k}n')).toMatchSnapshot();
  });

  it('Sideset Extra Post', () => {
    expect(tex2mml('\\sideset{a}{b}X')).toMatchSnapshot();
  });

  it('Sideset Pre No Base', () => {
    expect(tex2mml('\\sideset{^1{}^2}{}X')).toMatchSnapshot();
  });

  it('Sideset Pre with Post Sup', () => {
    expect(tex2mml('\\sideset{^a}{^b}{x}')).toMatchSnapshot();
  });

  it('Sideset Pre with Post Sub', () => {
    expect(tex2mml('\\sideset{^a}{_b}{x}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Ams symbols', () => {

  it('Delimiters', () => {
    expect(tex2mml(
        '\\left\\llcorner X \\right\\lrcorner \\left\\lvert X \\right\\rvert \\left\\lVert X \\right\\rVert'
    )).toMatchSnapshot();
  });

  it('Spaces', () => {
    expect(tex2mml('\\nobreakspace\\negmedspace\\negthickspace')).toMatchSnapshot();
  });

  it('Accents', () => {
    expect(tex2mml('\\mathring A \\dddot x \\ddddot x')).toMatchSnapshot();
  });

  it('Limits', () => {
    expect(tex2mml('\\injlim \\projlim \\varliminf \\varlimsup \\varinjlim \\varprojlim')).toMatchSnapshot();
  });

  it('boxed', () => {
    expect(tex2mml('\\boxed{x}')).toMatchSnapshot();
  });

  it('substack', () => {
    expect(tex2mml('\\substack{a\\\\b}')).toMatchSnapshot();
  });

  it('impliedby', () => {
    expect(tex2mml('Q \\impliedby P')).toMatchSnapshot();
  });

  it('math0mi 1', () => {
    expect(tex2mml(
        '\\varkappa\\varGamma\\varDelta\\varTheta\\varLambda\\varXi\\varPi\\varSigma\\varUpsilon\\varPhi\\varPsi\\varOmega'
    )).toMatchSnapshot();
  });

  it('math0mi 2', () => {
    expect(tex2mml(
        '\\beth\\gimel\\daleth\\backprime\\hslash\\varnothing\\blacktriangle\\triangledown\\blacktriangledown\\square\\Box'
    )).toMatchSnapshot();
  });

  it('math0mi 3', () => {
    expect(tex2mml(
        '\\blacksquare\\lozenge\\Diamond\\blacklozenge\\circledS\\bigstar\\sphericalangle\\measuredangle\\nexists\\complement'
    )).toMatchSnapshot();
  });

  it('math0mi 4', () => {
    expect(tex2mml(
        '\\mho\\eth\\Finv\\diagup\\Game\\diagdown\\Bbbk\\yen\\circledR\\checkmark\\maltese'
    )).toMatchSnapshot();
  });

  it('math0mo 1', () => {
    expect(tex2mml(
        '\\ltimes\\smallsetminus\\rtimes\\Cap\\doublecap\\leftthreetimes\\Cup\\doublecup\\rightthreetimes\\barwedge\\curlywedge'
    )).toMatchSnapshot();
  });

  it('math0mo 2', () => {
    expect(tex2mml(
        '\\veebar\\curlyvee\\doublebarwedge\\boxminus\\circleddash\\boxtimes\\circledast\\boxdot\\circledcirc\\boxplus'
    )).toMatchSnapshot();
  });

  it('math0mo 3', () => {
    expect(tex2mml(
        '\\centerdot\\divideontimes\\intercal\\leqq\\geqq\\leqslant\\geqslant\\eqslantless\\eqslantgtr\\lessapprox\\gtrapprox'
    )).toMatchSnapshot();
  });

  it('math0mo 4', () => {
    expect(tex2mml(
        '\\approxeq\\lessdot\\gtrdot\\lll\\llless\\ggg\\gggtr\\lessgtr\\gtrless\\lesseqgtr\\gtreqless\\lesseqqgtr\\gtreqqless'
    )).toMatchSnapshot();
  });

  it('math0mo 5', () => {
    expect(tex2mml(
        '\\doteqdot\\Doteq\\eqcirc\\risingdotseq\\circeq\\fallingdotseq\\triangleq\\backsim\\backsimeq\\subseteqq\\supseteqq'
    )).toMatchSnapshot();
  });

  it('math0mo 6', () => {
    expect(tex2mml(
        '\\Subset\\Supset\\sqsubset\\sqsupset\\preccurlyeq\\succcurlyeq\\curlyeqprec\\curlyeqsucc\\precsim\\succsim\\precapprox'
    )).toMatchSnapshot();
  });

  it('math0mo 7', () => {
    expect(tex2mml(
        '\\succapprox\\vartriangleleft\\lhd\\vartriangleright\\rhd\\trianglelefteq\\unlhd\\trianglerighteq\\unrhd\\vDash\\Vdash'
    )).toMatchSnapshot();
  });

  it('math0mo 8', () => {
    expect(tex2mml(
        '\\Vvdash\\smallsmile\\shortmid\\smallfrown\\shortparallel\\bumpeq\\between\\Bumpeq\\pitchfork\\varpropto\\backepsilon'
    )).toMatchSnapshot();
  });

  it('math0mo 9', () => {
    expect(tex2mml(
        '\\blacktriangleleft\\blacktriangleright\\therefore\\because\\eqsim\\vartriangle\\Join\\nless\\ngtr\\nleq\\ngeq'
    )).toMatchSnapshot();
  });

  it('math0mo 10', () => {
    expect(tex2mml(
        '\\nleqslant\\ngeqslant\\nleqq\\ngeqq\\lneq\\gneq\\lneqq\\gneqq\\lvertneqq\\gvertneqq\\lnsim\\gnsim\\lnapprox\\gnapprox'
    )).toMatchSnapshot();
  });

  it('math0mo 11', () => {
    expect(tex2mml(
        '\\nprec\\nsucc\\npreceq\\nsucceq\\precneqq\\succneqq\\precnsim\\succnsim\\precnapprox\\succnapprox\\nsim\\ncong'
    )).toMatchSnapshot();
  });

  it('math0mo 12', () => {
    expect(tex2mml(
        '\\nshortmid\\nshortparallel\\nmid\\nparallel\\nvdash\\nvDash\\nVdash\\nVDash\\ntriangleleft\\ntriangleright'
    )).toMatchSnapshot();
  });

  it('math0mo 13', () => {
    expect(tex2mml(
        '\\ntrianglelefteq\\ntrianglerighteq\\nsubseteq\\nsupseteq\\nsubseteqq\\nsupseteqq\\subsetneq\\supsetneq\\varsubsetneq'
    )).toMatchSnapshot();
  });

  it('math0mo 14', () => {
    expect(tex2mml(
        '\\varsupsetneq\\subsetneqq\\supsetneqq\\varsubsetneqq\\varsupsetneqq\\leftleftarrows\\rightrightarrows\\leftrightarrows'
    )).toMatchSnapshot();
  });

  it('math0mo 15', () => {
    expect(tex2mml(
        '\\rightleftarrows\\Lleftarrow\\Rrightarrow\\twoheadleftarrow\\twoheadrightarrow\\leftarrowtail\\rightarrowtail'
    )).toMatchSnapshot();
  });

  it('math0mo 16', () => {
    expect(tex2mml(
        '\\looparrowleft\\looparrowright\\leftrightharpoons\\rightleftharpoons\\curvearrowleft\\curvearrowright\\circlearrowleft'
    )).toMatchSnapshot();
  });

  it('math0mo 17', () => {
    expect(tex2mml(
        '\\circlearrowright\\Lsh\\Rsh\\upuparrows\\downdownarrows\\upharpoonleft\\upharpoonright\\downharpoonleft\\restriction'
    )).toMatchSnapshot();
  });

  it('math0mo 18', () => {
    expect(tex2mml(
        '\\multimap\\downharpoonright\\leftrightsquigarrow\\rightsquigarrow\\leadsto\\dashrightarrow\\dashleftarrow\\nleftarrow'
    )).toMatchSnapshot();
  });

  it('math0mo 19', () => {
    expect(tex2mml('\\nrightarrow\\nLeftarrow\\nRightarrow\\nleftrightarrow\\nLeftrightarrow')).toMatchSnapshot();
  });

});

/**********************************************************************************/

afterAll(() => getTokens('ams'));
