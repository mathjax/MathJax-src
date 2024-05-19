import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeEach(() => setupTex(['base', 'action']));

describe('Action', () => {
  it('TextTip', () =>
    toXmlMatch(
      tex2mml('\\texttip{A}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\texttip{A}{B}" display="block">\n  <maction actiontype="tooltip" data-latex="\\mathtip{A}{\\text{B}}">\n    <mi data-latex="A">A</mi>\n    <mtext data-latex="\\text{B}">B</mtext>\n  </maction>\n</math>'
    ));
  it('MathTip', () =>
    toXmlMatch(
      tex2mml('\\mathtip{A}{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\mathtip{A}{B}" display="block">\n  <maction actiontype="tooltip" data-latex="\\mathtip{A}{B}">\n    <mi data-latex="A">A</mi>\n    <mi data-latex="B">B</mi>\n  </maction>\n</math>'
    ));
  it('Toggle', () =>
    toXmlMatch(
      tex2mml('\\toggle A B C \\endtoggle'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\toggle A B C \\endtoggle" display="block">\n  <maction data-latex="\\toggle A B C \\endtoggle">\n    <mi data-latex="A">A</mi>\n    <mi data-latex="B">B</mi>\n    <mi data-latex="C">C</mi>\n  </maction>\n</math>'
    ));
});
