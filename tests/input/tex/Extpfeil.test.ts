import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeEach(() => setupTex(["base","extpfeil"]));

describe('Extpfeil', () => {
  it('Xtwoheadrightarrow', () => toXmlMatch(tex2mml("\\xtwoheadrightarrow{abcxyz}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\xtwoheadrightarrow{abcxyz}\" display=\"block\">\n  <mover data-latex=\"\\xtwoheadrightarrow{abcxyz}\">\n    <mstyle scriptlevel=\"0\">\n      <mo data-mjx-texclass=\"REL\">&#x21A0;</mo>\n    </mstyle>\n    <mpadded width=\"+1.556em\" lspace=\"0.667em\" voffset=\"-.2em\" height=\"-.2em\">\n      <mi data-latex=\"a\">a</mi>\n      <mi data-latex=\"b\">b</mi>\n      <mi data-latex=\"c\">c</mi>\n      <mi data-latex=\"x\">x</mi>\n      <mi data-latex=\"y\">y</mi>\n      <mi data-latex=\"z\">z</mi>\n      <mspace depth=\".2em\"></mspace>\n    </mpadded>\n  </mover>\n</math>"
  ));
  it('Xtwoheadleftarrow', () => toXmlMatch(tex2mml("\\xtwoheadleftarrow{abcxyz}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\xtwoheadleftarrow{abcxyz}\" display=\"block\">\n  <mover data-latex=\"\\xtwoheadleftarrow{abcxyz}\">\n    <mstyle scriptlevel=\"0\">\n      <mo data-mjx-texclass=\"REL\">&#x219E;</mo>\n    </mstyle>\n    <mpadded width=\"+1.667em\" lspace=\"0.944em\" voffset=\"-.2em\" height=\"-.2em\">\n      <mi data-latex=\"a\">a</mi>\n      <mi data-latex=\"b\">b</mi>\n      <mi data-latex=\"c\">c</mi>\n      <mi data-latex=\"x\">x</mi>\n      <mi data-latex=\"y\">y</mi>\n      <mi data-latex=\"z\">z</mi>\n      <mspace depth=\".2em\"></mspace>\n    </mpadded>\n  </mover>\n</math>"
  ));
  it('Xmapsto', () => toXmlMatch(tex2mml("\\xmapsto{abcxyz}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\xmapsto{abcxyz}\" display=\"block\">\n  <mover data-latex=\"\\xmapsto{abcxyz}\">\n    <mstyle scriptlevel=\"0\">\n      <mo data-mjx-texclass=\"REL\">&#x21A6;</mo>\n    </mstyle>\n    <mpadded width=\"+0.722em\" lspace=\"0.333em\" voffset=\"-.2em\" height=\"-.2em\">\n      <mi data-latex=\"a\">a</mi>\n      <mi data-latex=\"b\">b</mi>\n      <mi data-latex=\"c\">c</mi>\n      <mi data-latex=\"x\">x</mi>\n      <mi data-latex=\"y\">y</mi>\n      <mi data-latex=\"z\">z</mi>\n      <mspace depth=\".2em\"></mspace>\n    </mpadded>\n  </mover>\n</math>"
  ));
  it('Xlongequal', () => toXmlMatch(tex2mml("\\xlongequal{abcxyz}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\xlongequal{abcxyz}\" display=\"block\">\n  <mover data-latex=\"\\xlongequal{abcxyz}\">\n    <mstyle scriptlevel=\"0\">\n      <mo data-mjx-texclass=\"REL\" stretchy=\"true\">=</mo>\n    </mstyle>\n    <mpadded width=\"+0.778em\" lspace=\"0.389em\" voffset=\"-.2em\" height=\"-.2em\">\n      <mi data-latex=\"a\">a</mi>\n      <mi data-latex=\"b\">b</mi>\n      <mi data-latex=\"c\">c</mi>\n      <mi data-latex=\"x\">x</mi>\n      <mi data-latex=\"y\">y</mi>\n      <mi data-latex=\"z\">z</mi>\n      <mspace depth=\".2em\"></mspace>\n    </mpadded>\n  </mover>\n</math>"
  ));
  it('Xtofrom', () => toXmlMatch(tex2mml("\\xtofrom{abcxyz}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\xtofrom{abcxyz}\" display=\"block\">\n  <mover data-latex=\"\\xtofrom{abcxyz}\">\n    <mstyle scriptlevel=\"0\">\n      <mo data-mjx-texclass=\"REL\">&#x21C4;</mo>\n    </mstyle>\n    <mpadded width=\"+1.333em\" lspace=\"0.667em\" voffset=\"-.2em\" height=\"-.2em\">\n      <mi data-latex=\"a\">a</mi>\n      <mi data-latex=\"b\">b</mi>\n      <mi data-latex=\"c\">c</mi>\n      <mi data-latex=\"x\">x</mi>\n      <mi data-latex=\"y\">y</mi>\n      <mi data-latex=\"z\">z</mi>\n      <mspace depth=\".2em\"></mspace>\n    </mpadded>\n  </mover>\n</math>"
  ));
  it('Newextarrow', () => toXmlMatch(tex2mml("\\Newextarrow{\\ab}{10,20}{8672}\\ab{xyz}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\Newextarrow{\\ab}{10,20}{8672}\\ab{xyz}\" display=\"block\">\n  <mover data-latex=\"\\Newextarrow{\\ab}{10,20}{8672}\\ab{xyz}\">\n    <mstyle scriptlevel=\"0\">\n      <mo data-mjx-texclass=\"REL\">&#x21E0;</mo>\n    </mstyle>\n    <mpadded width=\"+1.667em\" lspace=\"0.556em\" voffset=\"-.2em\" height=\"-.2em\">\n      <mi data-latex=\"x\">x</mi>\n      <mi data-latex=\"y\">y</mi>\n      <mi data-latex=\"z\">z</mi>\n      <mspace depth=\".2em\"></mspace>\n    </mpadded>\n  </mover>\n</math>"
  ));
})
