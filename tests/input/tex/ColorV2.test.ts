import { beforeAll, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeAll(() => setupTex(["base","colorv2"]));

describe('ColorV2', () => {
  it('Color Open', () => toXmlMatch(tex2mml("\\color{red}{ab}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\color{red}{ab}\" display=\"block\">\n  <mstyle mathcolor=\"red\" data-latex=\"\\color{red}{ab}\">\n    <mi data-latex=\"a\">a</mi>\n    <mi data-latex=\"b\">b</mi>\n  </mstyle>\n</math>"
  ));
  it('Color Enclosed', () => toXmlMatch(tex2mml("\\color{red}ab"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\color{red}ab\" display=\"block\">\n  <mstyle mathcolor=\"red\" data-latex=\"\\color{red}a\">\n    <mi data-latex=\"a\">a</mi>\n  </mstyle>\n  <mi data-latex=\"b\">b</mi>\n</math>"
  ));
  it('Color Frac', () => toXmlMatch(tex2mml("\\frac{{\\cal \\color{red}{X}}}{\\color{blue}{\\sf y}}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\frac{{\\cal \\color{red}{X}}}{\\color{blue}{\\sf y}}\" display=\"block\">\n  <mfrac data-latex=\"\\frac{{\\cal \\color{red}{X}}}{\\color{blue}{\\sf y}}\">\n    <mrow data-mjx-texclass=\"ORD\" data-latex=\"{\\cal \\color{red}{X}}\">\n      <mstyle mathcolor=\"red\" data-latex=\"\\color{red}{X}\">\n        <mi data-mjx-variant=\"-tex-calligraphic\" mathvariant=\"script\" data-latex=\"X\">X</mi>\n      </mstyle>\n    </mrow>\n    <mstyle mathcolor=\"blue\" data-latex=\"\\color{blue}{\\sf y}\">\n      <mi mathvariant=\"sans-serif\" data-latex=\"\\sf y\">y</mi>\n    </mstyle>\n  </mfrac>\n</math>"
  ));
})
