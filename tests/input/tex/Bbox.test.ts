import { beforeAll, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeAll(() => setupTex(["base","bbox"]));

describe('Bbox', () => {
  it('Bbox-Background', () => toXmlMatch(tex2mml("\\bbox[yellow]{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bbox[yellow]{a}\" display=\"block\">\n  <mstyle mathbackground=\"yellow\" data-latex=\"\\bbox[yellow]{a}\">\n    <mi data-latex=\"a\">a</mi>\n  </mstyle>\n</math>"
  ));
  it('Bbox-Padding', () => toXmlMatch(tex2mml("\\bbox[5px]{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bbox[5px]{a}\" display=\"block\">\n  <mpadded height=\"+5px\" depth=\"+5px\" lspace=\"5px\" width=\"+10px\" data-latex=\"\\bbox[5px]{a}\">\n    <mi data-latex=\"a\">a</mi>\n  </mpadded>\n</math>"
  ));
  it('Bbox-Frame', () => toXmlMatch(tex2mml("\\bbox[border:5px solid red]{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bbox[border:5px solid red]{a}\" display=\"block\">\n  <mstyle style=\"border:5px solid red\" data-latex=\"\\bbox[border:5px solid red]{a}\">\n    <mi data-latex=\"a\">a</mi>\n  </mstyle>\n</math>"
  ));
  it('Bbox-Background-Padding', () => toXmlMatch(tex2mml("\\bbox[yellow,5px]{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bbox[yellow,5px]{a}\" display=\"block\">\n  <mstyle mathbackground=\"yellow\" data-latex=\"\\bbox[yellow,5px]{a}\">\n    <mpadded height=\"+5px\" depth=\"+5px\" lspace=\"5px\" width=\"+10px\">\n      <mi data-latex=\"a\">a</mi>\n    </mpadded>\n  </mstyle>\n</math>"
  ));
  it('Bbox-Padding-Frame', () => toXmlMatch(tex2mml("\\bbox[5px,border:2px solid red]{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bbox[5px,border:2px solid red]{a}\" display=\"block\">\n  <mstyle style=\"border:2px solid red\" data-latex=\"\\bbox[5px,border:2px solid red]{a}\">\n    <mpadded height=\"+5px\" depth=\"+5px\" lspace=\"5px\" width=\"+10px\">\n      <mi data-latex=\"a\">a</mi>\n    </mpadded>\n  </mstyle>\n</math>"
  ));
  it('Bbox-Background-Padding-Frame', () => toXmlMatch(tex2mml("\\bbox[yellow,5px,border:2px solid red]{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bbox[yellow,5px,border:2px solid red]{a}\" display=\"block\">\n  <mstyle mathbackground=\"yellow\" style=\"border:2px solid red\" data-latex=\"\\bbox[yellow,5px,border:2px solid red]{a}\">\n    <mpadded height=\"+5px\" depth=\"+5px\" lspace=\"5px\" width=\"+10px\">\n      <mi data-latex=\"a\">a</mi>\n    </mpadded>\n  </mstyle>\n</math>"
  ));
  it('Bbox-Background-Error', () => toXmlMatch(tex2mml("\\bbox[yellow,green]{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bbox[yellow,green]{a}\" display=\"block\">\n  <merror data-mjx-error=\"Background specified twice in \\bbox\">\n    <mtext>Background specified twice in \\bbox</mtext>\n  </merror>\n</math>"
  ));
  it('Bbox-Padding-Error', () => toXmlMatch(tex2mml("\\bbox[5px,6px]{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bbox[5px,6px]{a}\" display=\"block\">\n  <merror data-mjx-error=\"Padding specified twice in \\bbox\">\n    <mtext>Padding specified twice in \\bbox</mtext>\n  </merror>\n</math>"
  ));
  it('Bbox-Frame-Error', () => toXmlMatch(tex2mml("\\bbox[border:2px solid red,border:2px solid green]{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bbox[border:2px solid red,border:2px solid green]{a}\" display=\"block\">\n  <merror data-mjx-error=\"Style specified twice in \\bbox\">\n    <mtext>Style specified twice in \\bbox</mtext>\n  </merror>\n</math>"
  ));
  it('Bbox-General-Error', () => toXmlMatch(tex2mml("\\bbox[22-11=color]{a}"),
    "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\bbox[22-11=color]{a}\" display=\"block\">\n  <merror data-mjx-error=\"&quot;22-11=color&quot; doesn't look like a color, a padding dimension, or a style\">\n    <mtext>&quot;22-11=color&quot; doesn't look like a color, a padding dimension, or a style</mtext>\n  </merror>\n</math>"
  ));
})
