import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeEach(() => setupTex(["base","enclose"]));

describe('Enclose', () => {
  it('Enclose 1', () => toXmlMatch(tex2mml("\\enclose{updiagonalstrike}{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\enclose{updiagonalstrike}{x}\" display=\"block\">\n  <menclose notation=\"updiagonalstrike\" data-latex=\"\\enclose{updiagonalstrike}{x}\">\n    <mi data-latex=\"x\">x</mi>\n  </menclose>\n</math>"
  ));
  it('Enclose 2', () => toXmlMatch(tex2mml("\\enclose{circle}{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\enclose{circle}{x}\" display=\"block\">\n  <menclose notation=\"circle\" data-latex=\"\\enclose{circle}{x}\">\n    <mi data-latex=\"x\">x</mi>\n  </menclose>\n</math>"
  ));
  it('Enclose 3', () => toXmlMatch(tex2mml("\\enclose{horizontalstrike}{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\enclose{horizontalstrike}{x}\" display=\"block\">\n  <menclose notation=\"horizontalstrike\" data-latex=\"\\enclose{horizontalstrike}{x}\">\n    <mi data-latex=\"x\">x</mi>\n  </menclose>\n</math>"
  ));
  it('Enclose Attr 2', () => toXmlMatch(tex2mml("\\enclose{updiagonalarrow}[mathbackground=red]{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\enclose{updiagonalarrow}[mathbackground=red]{x}\" display=\"block\">\n  <menclose mathbackground=\"red\" notation=\"updiagonalarrow\" data-latex=\"\\enclose{updiagonalarrow}[mathbackground=red]{x}\">\n    <mi data-latex=\"x\">x</mi>\n  </menclose>\n</math>"
  ));
  it('Enclose Attr 1', () => toXmlMatch(tex2mml("\\enclose{horizontalstrike}[data-thickness=5]{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\enclose{horizontalstrike}[data-thickness=5]{x}\" display=\"block\">\n  <menclose data-thickness=\"5\" notation=\"horizontalstrike\" data-latex=\"\\enclose{horizontalstrike}[data-thickness=5]{x}\">\n    <mi data-latex=\"x\">x</mi>\n  </menclose>\n</math>"
  ));
  it('Enclose Attrs', () => toXmlMatch(tex2mml("\\enclose{circle}[data-thickness=10,data-padding=5]{x}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\enclose{circle}[data-thickness=10,data-padding=5]{x}\" display=\"block\">\n  <menclose data-thickness=\"10\" data-padding=\"5\" notation=\"circle\" data-latex=\"\\enclose{circle}[data-thickness=10,data-padding=5]{x}\">\n    <mi data-latex=\"x\">x</mi>\n  </menclose>\n</math>"
  ));
})
