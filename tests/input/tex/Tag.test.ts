import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

describe('TagAll', () => {
  beforeEach(() => setupTex(['ams', 'base'], { tags: 'all' }));
  it('Single Expression', () =>
    toXmlMatch(
      tex2mml('a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a" display="block">\n  <mtable displaystyle="true" data-latex="a">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('MultLine', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\ b\\\\ c\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}a\\\\ b\\\\ c\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label Empty', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{A}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Notag Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\notag\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\notag\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\notag\\end{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\notag">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Notag Multline', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="\\notag">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Notag Tag', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\notag\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\notag\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\notag\\end{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\notag">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Ref', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{A}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>1</mtext>\n  </mrow>\n</math>'
    ));
  it('Ref Unknown', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{B}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#" class="MathJax_ref" data-latex="\\ref{B}">\n    <mtext>???</mtext>\n  </mrow>\n</math>'
    ));
  it('Eqref', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\eqref{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\eqref{A}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\eqref{A}">\n    <mtext>(1)</mtext>\n  </mrow>\n</math>'
    ));
  it('Align Two labels', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a=b\\label{A}\\\\ c&=d \\label{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a=b\\label{A}\\\\ c&amp;=d \\label{B}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align}a=b\\label{A}\\\\ c&amp;=d \\label{B}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="a">a</mi>\n        <mo data-latex="=">=</mo>\n        <mi data-latex="\\label{A}">b</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(2)}">(2)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="\\label{B}">d</mi>\n        </mstyle>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Illegal Tag Error', () =>
    toXmlMatch(
      tex2mml('\\begin{split}a\\tag{A}\\end{split}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{split}a\\tag{A}\\end{split}" display="block">\n  <merror data-mjx-error="\\tag not allowed in split environment">\n    <mtext>\\tag not allowed in split environment</mtext>\n  </merror>\n</math>'
    ));
  it('Double Tag Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\tag{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\tag{B}\\end{align}" display="block">\n  <merror data-mjx-error="Multiple \\tag">\n    <mtext>Multiple \\tag</mtext>\n  </merror>\n</math>'
    ));
  it('Double Label Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\label{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\label{B}\\end{align}" display="block">\n  <merror data-mjx-error="Multiple \\label">\n    <mtext>Multiple \\label</mtext>\n  </merror>\n</math>'
    ));
  it('Duplicate Label Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}" display="block">\n  <merror data-mjx-error="Label \'A\' multiply defined">\n    <mtext>Label \'A\' multiply defined</mtext>\n  </merror>\n</math>'
    ));
  it('Tag Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Tag Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Tag Named Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\\\b\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\\\b\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Tag Named Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(B)}">(B)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{A}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label Named Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label Named Named', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(B)}">(B)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Ref Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{A}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>1</mtext>\n  </mrow>\n</math>'
    ));
  it('Ref Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>A</mtext>\n  </mrow>\n</math>'
    ));
  it('Ref Named Default', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>A</mtext>\n  </mrow>\n  <mrow href="#mjx-eqn%3AB" class="MathJax_ref" data-latex="\\ref{B}">\n    <mtext>1</mtext>\n  </mrow>\n</math>'
    ));
  it('Ref Named Named', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(B)}">(B)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>A</mtext>\n  </mrow>\n  <mrow href="#mjx-eqn%3AB" class="MathJax_ref" data-latex="\\ref{B}">\n    <mtext>B</mtext>\n  </mrow>\n</math>'
    ));
});

describe('TagNone', () => {
  beforeEach(() => setupTex(['ams', 'base'], { tags: 'none' }));
  it('Single Expression', () =>
    toXmlMatch(
      tex2mml('a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a" display="block">\n  <mi data-latex="a">a</mi>\n</math>'
    ));
  it('Simple Tag', () =>
    toXmlMatch(
      tex2mml('a\\tag{0}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\tag{0}" display="block">\n  <mtable displaystyle="true" data-latex="a\\tag{0}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:0">\n        <mtext data-latex="\\text{(0)}">(0)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{0}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\end{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Split', () =>
    toXmlMatch(
      tex2mml('\\begin{split}a\\end{split}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{split}a\\end{split}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="0em" rowspacing="3pt" data-break-align="bottom" data-latex-item="{split}" data-latex="\\begin{split}a\\end{split}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('MultLine', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\ b\\\\ c\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}a\\\\ b\\\\ c\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Label Empty', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{}\\end{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\label{}">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Label', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{A}\\end{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Notag Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\notag\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\notag\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\notag\\end{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\notag">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Notag Multline', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="\\notag">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Notag Tag', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\notag\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\notag\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\notag\\end{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\notag">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Ref', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{A}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n  <mrow href="#" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>???</mtext>\n  </mrow>\n</math>'
    ));
  it('Ref Unknown', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{B}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n  <mrow href="#" class="MathJax_ref" data-latex="\\ref{B}">\n    <mtext>???</mtext>\n  </mrow>\n</math>'
    ));
  it('Eqref', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\eqref{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\eqref{A}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n  <mrow href="#" class="MathJax_ref" data-latex="\\eqref{A}">\n    <mtext>(???)</mtext>\n  </mrow>\n</math>'
    ));
  it('Align Two labels', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a=b\\label{A}\\\\ c&=d \\label{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a=b\\label{A}\\\\ c&amp;=d \\label{B}\\end{align}" display="block">\n  <merror data-mjx-error="Multiple \\label">\n    <mtext>Multiple \\label</mtext>\n  </merror>\n</math>'
    ));
  it('Illegal Tag Error', () =>
    toXmlMatch(
      tex2mml('\\begin{split}a\\tag{A}\\end{split}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{split}a\\tag{A}\\end{split}" display="block">\n  <merror data-mjx-error="\\tag not allowed in split environment">\n    <mtext>\\tag not allowed in split environment</mtext>\n  </merror>\n</math>'
    ));
  it('Double Tag Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\tag{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\tag{B}\\end{align}" display="block">\n  <merror data-mjx-error="Multiple \\tag">\n    <mtext>Multiple \\tag</mtext>\n  </merror>\n</math>'
    ));
  it('Double Label Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\label{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\label{B}\\end{align}" display="block">\n  <merror data-mjx-error="Multiple \\label">\n    <mtext>Multiple \\label</mtext>\n  </merror>\n</math>'
    ));
  it('Duplicate Label Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}" display="block">\n  <merror data-mjx-error="Multiple \\label">\n    <mtext>Multiple \\label</mtext>\n  </merror>\n</math>'
    ));
  it('Tag Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\end{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Tag Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Tag Named Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\\\b\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\\\b\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Tag Named Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(B)}">(B)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{A}\\end{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Label Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label Named Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="\\label{B}">b</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Label Named Named', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(B)}">(B)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Ref Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{A}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n  <mrow href="#" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>???</mtext>\n  </mrow>\n</math>'
    ));
  it('Ref Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>A</mtext>\n  </mrow>\n</math>'
    ));
  it('Ref Named Default', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="\\label{B}">b</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>A</mtext>\n  </mrow>\n  <mrow href="#" class="MathJax_ref" data-latex="\\ref{B}">\n    <mtext>???</mtext>\n  </mrow>\n</math>'
    ));
  it('Ref Named Named', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(B)}">(B)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>A</mtext>\n  </mrow>\n  <mrow href="#mjx-eqn%3AB" class="MathJax_ref" data-latex="\\ref{B}">\n    <mtext>B</mtext>\n  </mrow>\n</math>'
    ));
});

describe('TagAms', () => {
  beforeEach(() => setupTex(['ams', 'base'], { tags: 'ams' }));
  it('Single Expression', () =>
    toXmlMatch(
      tex2mml('a'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a" display="block">\n  <mi data-latex="a">a</mi>\n</math>'
    ));
  it('Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Split', () =>
    toXmlMatch(
      tex2mml('\\begin{split}a\\end{split}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{split}a\\end{split}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="0em" rowspacing="3pt" data-break-align="bottom" data-latex-item="{split}" data-latex="\\begin{split}a\\end{split}">\n    <mtr>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('MultLine', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\ b\\\\ c\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}a\\\\ b\\\\ c\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd columnalign="right">\n        <mi data-latex="c">c</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label Empty', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{A}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Notag Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\notag\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\notag\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\notag\\end{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\notag">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Notag Multline', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}" display="block">\n  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}">\n    <mtr>\n      <mtd columnalign="left">\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mtr>\n    <mtr>\n      <mtd columnalign="right">\n        <mi data-latex="\\notag">c</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Notag Tag', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\notag\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\notag\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\notag\\end{align}">\n    <mtr>\n      <mtd>\n        <mi data-latex="\\notag">a</mi>\n      </mtd>\n    </mtr>\n  </mtable>\n</math>'
    ));
  it('Ref', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{A}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>1</mtext>\n  </mrow>\n</math>'
    ));
  it('Ref Unknown', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{B}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{B}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#" class="MathJax_ref" data-latex="\\ref{B}">\n    <mtext>???</mtext>\n  </mrow>\n</math>'
    ));
  it('Eqref', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\eqref{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\eqref{A}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\eqref{A}">\n    <mtext>(1)</mtext>\n  </mrow>\n</math>'
    ));
  it('Align Two labels', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a=b\\label{A}\\\\ c&=d \\label{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a=b\\label{A}\\\\ c&amp;=d \\label{B}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align}a=b\\label{A}\\\\ c&amp;=d \\label{B}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="a">a</mi>\n        <mo data-latex="=">=</mo>\n        <mi data-latex="\\label{A}">b</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(2)}">(2)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="c">c</mi>\n      </mtd>\n      <mtd>\n        <mstyle indentshift="2em">\n          <mi></mi>\n          <mo data-latex="=">=</mo>\n          <mi data-latex="\\label{B}">d</mi>\n        </mstyle>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Illegal Tag Error', () =>
    toXmlMatch(
      tex2mml('\\begin{split}a\\tag{A}\\end{split}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{split}a\\tag{A}\\end{split}" display="block">\n  <merror data-mjx-error="\\tag not allowed in split environment">\n    <mtext>\\tag not allowed in split environment</mtext>\n  </merror>\n</math>'
    ));
  it('Double Tag Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\tag{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\tag{B}\\end{align}" display="block">\n  <merror data-mjx-error="Multiple \\tag">\n    <mtext>Multiple \\tag</mtext>\n  </merror>\n</math>'
    ));
  it('Double Label Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\label{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\label{B}\\end{align}" display="block">\n  <merror data-mjx-error="Multiple \\label">\n    <mtext>Multiple \\label</mtext>\n  </merror>\n</math>'
    ));
  it('Duplicate Label Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}" display="block">\n  <merror data-mjx-error="Label \'A\' multiply defined">\n    <mtext>Label \'A\' multiply defined</mtext>\n  </merror>\n</math>'
    ));
  it('Tag Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="a">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Tag Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Tag Named Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\\\b\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\\\b\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:1">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="b">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Tag Named Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(B)}">(B)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\tag{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{A}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label Named Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Label Named Named', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(B)}">(B)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n</math>'
    ));
  it('Ref Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{A}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>1</mtext>\n  </mrow>\n</math>'
    ));
  it('Ref Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>A</mtext>\n  </mrow>\n</math>'
    ));
  it('Ref Named Default', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(1)}">(1)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>A</mtext>\n  </mrow>\n  <mrow href="#mjx-eqn%3AB" class="MathJax_ref" data-latex="\\ref{B}">\n    <mtext>1</mtext>\n  </mrow>\n</math>'
    ));
  it('Ref Named Named', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}'
      ),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}" display="block">\n  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">\n    <mlabeledtr>\n      <mtd id="mjx-eqn:A">\n        <mtext data-latex="\\text{(A)}">(A)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{A}">a</mi>\n      </mtd>\n    </mlabeledtr>\n    <mlabeledtr>\n      <mtd id="mjx-eqn:B">\n        <mtext data-latex="\\text{(B)}">(B)</mtext>\n      </mtd>\n      <mtd>\n        <mi data-latex="\\label{B}">b</mi>\n      </mtd>\n    </mlabeledtr>\n  </mtable>\n  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">\n    <mtext>A</mtext>\n  </mrow>\n  <mrow href="#mjx-eqn%3AB" class="MathJax_ref" data-latex="\\ref{B}">\n    <mtext>B</mtext>\n  </mrow>\n</math>'
    ));
});
