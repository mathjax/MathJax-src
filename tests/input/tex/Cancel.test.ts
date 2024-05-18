import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeEach(() => setupTex(["base","cancel"]));

describe('Cancel', () => {
  it('Cancel', () => toXmlMatch(tex2mml("\\cancel{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cancel{x}\" display=\"block\">\n  <menclose notation=\"updiagonalstrike\" data-latex=\"\\cancel{x}\">\n    <mi data-latex=\"x\">x</mi>\n  </menclose>\n</math>"
  ));
  it('BCancel', () => toXmlMatch(tex2mml("\\bcancel{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bcancel{x}\" display=\"block\">\n  <menclose notation=\"downdiagonalstrike\" data-latex=\"\\bcancel{x}\">\n    <mi data-latex=\"x\">x</mi>\n  </menclose>\n</math>"
  ));
  it('XCancel', () => toXmlMatch(tex2mml("\\xcancel{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\xcancel{x}\" display=\"block\">\n  <menclose notation=\"updiagonalstrike downdiagonalstrike\" data-latex=\"\\xcancel{x}\">\n    <mi data-latex=\"x\">x</mi>\n  </menclose>\n</math>"
  ));
  it('CancelTo', () => toXmlMatch(tex2mml("\\cancelto{x}{y}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cancelto{x}{y}\" display=\"block\">\n  <msup data-latex=\"\\cancelto{x}{y}\">\n    <menclose notation=\"updiagonalstrike updiagonalarrow northeastarrow\">\n      <mi data-latex=\"y\">y</mi>\n    </menclose>\n    <mpadded depth=\"-.1em\" height=\"+.1em\" voffset=\".1em\">\n      <mi data-latex=\"x\">x</mi>\n    </mpadded>\n  </msup>\n</math>"
  ));
  it('Cancel Attr', () => toXmlMatch(tex2mml("\\cancel[color=red]{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cancel[color=red]{x}\" display=\"block\">\n  <menclose color=\"red\" notation=\"updiagonalstrike\" data-latex=\"\\cancel[color=red]{x}\">\n    <mi data-latex=\"x\">x</mi>\n  </menclose>\n</math>"
  ));
  it('Cancel Attrs', () => toXmlMatch(tex2mml("\\cancel[mathcolor=green,mathbackground=yellow]{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cancel[mathcolor=green,mathbackground=yellow]{x}\" display=\"block\">\n  <menclose mathcolor=\"green\" mathbackground=\"yellow\" notation=\"updiagonalstrike\" data-latex=\"\\cancel[mathcolor=green,mathbackground=yellow]{x}\">\n    <mi data-latex=\"x\">x</mi>\n  </menclose>\n</math>"
  ));
  it('Cancel Attr Not Allowed', () => toXmlMatch(tex2mml("\\cancel[nothing=green]{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cancel[nothing=green]{x}\" display=\"block\">\n  <menclose notation=\"updiagonalstrike\" data-latex=\"\\cancel[nothing=green]{x}\">\n    <mi data-latex=\"x\">x</mi>\n  </menclose>\n</math>"
  ));
  it('CancelTo Attrs', () => toXmlMatch(tex2mml("\\cancelto[data-padding=5,data-arrowhead=15]{x}{y}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\cancelto[data-padding=5,data-arrowhead=15]{x}{y}\" display=\"block\">\n  <msup data-latex=\"\\cancelto[data-padding=5,data-arrowhead=15]{x}{y}\">\n    <menclose data-padding=\"5\" data-arrowhead=\"15\" notation=\"updiagonalstrike updiagonalarrow northeastarrow\">\n      <mi data-latex=\"y\">y</mi>\n    </menclose>\n    <mpadded depth=\"-.1em\" height=\"+.1em\" voffset=\".1em\">\n      <mi data-latex=\"x\">x</mi>\n    </mpadded>\n  </msup>\n</math>"
  ));
})
