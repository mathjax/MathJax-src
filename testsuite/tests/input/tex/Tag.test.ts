import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/ams/AmsConfiguration';

describe('TagAll', () => {
  beforeEach(() => setupTex(['ams', 'base'], { tags: 'all' }));
  it('Single Expression', () =>
    toXmlMatch(
      tex2mml('a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a" display="block">
  <mtable displaystyle="true"  data-latex="a">
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('MultLine', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\ b\\\\ c\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}a\\\\ b\\\\ c\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label Empty', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{A}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Notag Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\notag\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\notag\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\notag\\end{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\notag">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Notag Multline', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="\\notag">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Notag Tag', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\notag\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\notag\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\notag\\end{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\notag">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Ref', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{A}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>1</mtext>
  </mrow>
</math>`
    ));
  it('Ref Unknown', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{B}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#" class="MathJax_ref" data-latex="\\ref{B}">
    <mtext>???</mtext>
  </mrow>
</math>`
    ));
  it('Eqref', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\eqref{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\eqref{A}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\eqref{A}">
    <mtext>(1)</mtext>
  </mrow>
</math>`
    ));
  it('Align Two labels', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a=b\\label{A}\\\\ c&=d \\label{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a=b\\label{A}\\\\ c&amp;=d \\label{B}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align}a=b\\label{A}\\\\ c&amp;=d \\label{B}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
        <mo data-latex="=">=</mo>
        <mi data-latex="\\label{A}">b</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(2)}">(2)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="\\label{B}">d</mi>
        </mstyle>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Illegal Tag Error', () =>
    toXmlMatch(
      tex2mml('\\begin{split}a\\tag{A}\\end{split}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{split}a\\tag{A}\\end{split}" display="block">
  <merror data-mjx-error="\\tag not allowed in split environment">
    <mtext>\\tag not allowed in split environment</mtext>
  </merror>
</math>`
    ));
  it('Double Tag Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\tag{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\tag{B}\\end{align}" display="block">
  <merror data-mjx-error="Multiple \\tag">
    <mtext>Multiple \\tag</mtext>
  </merror>
</math>`
    ));
  it('Double Label Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\label{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\label{B}\\end{align}" display="block">
  <merror data-mjx-error="Multiple \\label">
    <mtext>Multiple \\label</mtext>
  </merror>
</math>`
    ));
  it('Duplicate Label Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}" display="block">
  <merror data-mjx-error="Label \'A\' multiply defined">
    <mtext>Label \'A\' multiply defined</mtext>
  </merror>
</math>`
    ));
  it('Tag Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Tag Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Tag Named Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\\\b\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\\\b\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Tag Named Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(B)}">(B)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{A}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label Named Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label Named Named', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(B)}">(B)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Ref Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{A}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>1</mtext>
  </mrow>
</math>`
    ));
  it('Ref Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>A</mtext>
  </mrow>
</math>`
    ));
  it('Ref Named Default', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>A</mtext>
  </mrow>
  <mrow href="#mjx-eqn%3AB" class="MathJax_ref" data-latex="\\ref{B}">
    <mtext>1</mtext>
  </mrow>
</math>`
    ));
  it('Ref Named Named', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(B)}">(B)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>A</mtext>
  </mrow>
  <mrow href="#mjx-eqn%3AB" class="MathJax_ref" data-latex="\\ref{B}">
    <mtext>B</mtext>
  </mrow>
</math>`
    ));
});

describe('TagNone', () => {
  beforeEach(() => setupTex(['ams', 'base'], { tags: 'none' }));
  it('Single Expression', () =>
    toXmlMatch(
      tex2mml('a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a" display="block">
  <mi data-latex="a">a</mi>
</math>`
    ));
  it('Simple Tag', () =>
    toXmlMatch(
      tex2mml('a\\tag{0}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a\\tag{0}" display="block">
  <mtable displaystyle="true" data-latex="a\\tag{0}">
    <mlabeledtr>
      <mtd id="mjx-eqn:0">
        <mtext data-latex="\\text{(0)}">(0)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{0}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\end{align}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Split', () =>
    toXmlMatch(
      tex2mml('\\begin{split}a\\end{split}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{split}a\\end{split}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="0em" rowspacing="3pt" data-break-align="bottom" data-latex-item="{split}" data-latex="\\begin{split}a\\end{split}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('MultLine', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\ b\\\\ c\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}a\\\\ b\\\\ c\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Label Empty', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{}\\end{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\label{}">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Label', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{A}\\end{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Notag Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\notag\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\notag\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\notag\\end{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\notag">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Notag Multline', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="\\notag">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Notag Tag', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\notag\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\notag\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\notag\\end{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\notag">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Ref', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{A}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mtr>
  </mtable>
  <mrow href="#" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>???</mtext>
  </mrow>
</math>`
    ));
  it('Ref Unknown', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{B}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mtr>
  </mtable>
  <mrow href="#" class="MathJax_ref" data-latex="\\ref{B}">
    <mtext>???</mtext>
  </mrow>
</math>`
    ));
  it('Eqref', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\eqref{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\eqref{A}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mtr>
  </mtable>
  <mrow href="#" class="MathJax_ref" data-latex="\\eqref{A}">
    <mtext>(???)</mtext>
  </mrow>
</math>`
    ));
  it('Align Two labels', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a=b\\label{A}\\\\ c&=d \\label{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a=b\\label{A}\\\\ c&amp;=d \\label{B}\\end{align}" display="block">
  <merror data-mjx-error="Multiple \\label">
    <mtext>Multiple \\label</mtext>
  </merror>
</math>`
    ));
  it('Illegal Tag Error', () =>
    toXmlMatch(
      tex2mml('\\begin{split}a\\tag{A}\\end{split}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{split}a\\tag{A}\\end{split}" display="block">
  <merror data-mjx-error="\\tag not allowed in split environment">
    <mtext>\\tag not allowed in split environment</mtext>
  </merror>
</math>`
    ));
  it('Double Tag Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\tag{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\tag{B}\\end{align}" display="block">
  <merror data-mjx-error="Multiple \\tag">
    <mtext>Multiple \\tag</mtext>
  </merror>
</math>`
    ));
  it('Double Label Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\label{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\label{B}\\end{align}" display="block">
  <merror data-mjx-error="Multiple \\label">
    <mtext>Multiple \\label</mtext>
  </merror>
</math>`
    ));
  it('Duplicate Label Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}" display="block">
  <merror data-mjx-error="Multiple \\label">
    <mtext>Multiple \\label</mtext>
  </merror>
</math>`
    ));
  it('Tag Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\end{align}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Tag Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Tag Named Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\\\b\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\\\b\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Tag Named Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(B)}">(B)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{A}\\end{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Label Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label Named Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mtr>
      <mtd>
        <mi data-latex="\\label{B}">b</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Label Named Named', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(B)}">(B)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Ref Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{A}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mtr>
  </mtable>
  <mrow href="#" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>???</mtext>
  </mrow>
</math>`
    ));
  it('Ref Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>A</mtext>
  </mrow>
</math>`
    ));
  it('Ref Named Default', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mtr>
      <mtd>
        <mi data-latex="\\label{B}">b</mi>
      </mtd>
    </mtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>A</mtext>
  </mrow>
  <mrow href="#" class="MathJax_ref" data-latex="\\ref{B}">
    <mtext>???</mtext>
  </mrow>
</math>`
    ));
  it('Ref Named Named', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(B)}">(B)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>A</mtext>
  </mrow>
  <mrow href="#mjx-eqn%3AB" class="MathJax_ref" data-latex="\\ref{B}">
    <mtext>B</mtext>
  </mrow>
</math>`
    ));
});

describe('TagAms', () => {
  beforeEach(() => setupTex(['ams', 'base'], { tags: 'ams' }));
  it('Single Expression', () =>
    toXmlMatch(
      tex2mml('a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="a" display="block">
  <mi data-latex="a">a</mi>
</math>`
    ));
  it('Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Split', () =>
    toXmlMatch(
      tex2mml('\\begin{split}a\\end{split}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{split}a\\end{split}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="0em" rowspacing="3pt" data-break-align="bottom" data-latex-item="{split}" data-latex="\\begin{split}a\\end{split}">
    <mtr>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('MultLine', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\ b\\\\ c\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}a\\\\ b\\\\ c\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd columnalign="right">
        <mi data-latex="c">c</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label Empty', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{A}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Notag Align', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\notag\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\notag\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\notag\\end{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\notag">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Notag Multline', () =>
    toXmlMatch(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}" display="block">
  <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}">
    <mtr>
      <mtd columnalign="left">
        <mi data-latex="a">a</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd columnalign="right">
        <mi data-latex="\\notag">c</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Notag Tag', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\notag\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\notag\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\notag\\end{align}">
    <mtr>
      <mtd>
        <mi data-latex="\\notag">a</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Ref', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{A}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>1</mtext>
  </mrow>
</math>`
    ));
  it('Ref Unknown', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{B}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{B}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#" class="MathJax_ref" data-latex="\\ref{B}">
    <mtext>???</mtext>
  </mrow>
</math>`
    ));
  it('Eqref', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\eqref{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\eqref{A}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\eqref{A}">
    <mtext>(1)</mtext>
  </mrow>
</math>`
    ));
  it('Align Two labels', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a=b\\label{A}\\\\ c&=d \\label{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a=b\\label{A}\\\\ c&amp;=d \\label{B}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top" data-latex-item="{align}" data-latex="\\begin{align}a=b\\label{A}\\\\ c&amp;=d \\label{B}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
        <mo data-latex="=">=</mo>
        <mi data-latex="\\label{A}">b</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(2)}">(2)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="c">c</mi>
      </mtd>
      <mtd>
        <mstyle indentshift="2em">
          <mi></mi>
          <mo data-latex="=">=</mo>
          <mi data-latex="\\label{B}">d</mi>
        </mstyle>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Illegal Tag Error', () =>
    toXmlMatch(
      tex2mml('\\begin{split}a\\tag{A}\\end{split}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{split}a\\tag{A}\\end{split}" display="block">
  <merror data-mjx-error="\\tag not allowed in split environment">
    <mtext>\\tag not allowed in split environment</mtext>
  </merror>
</math>`
    ));
  it('Double Tag Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\tag{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\tag{B}\\end{align}" display="block">
  <merror data-mjx-error="Multiple \\tag">
    <mtext>Multiple \\tag</mtext>
  </merror>
</math>`
    ));
  it('Double Label Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\label{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\label{B}\\end{align}" display="block">
  <merror data-mjx-error="Multiple \\label">
    <mtext>Multiple \\label</mtext>
  </merror>
</math>`
    ));
  it('Duplicate Label Error', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}" display="block">
  <merror data-mjx-error="Label \'A\' multiply defined">
    <mtext>Label \'A\' multiply defined</mtext>
  </merror>
</math>`
    ));
  it('Tag Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="a">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Tag Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Tag Named Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\\\b\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\\\b\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:1">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="b">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Tag Named Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(B)}">(B)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\tag{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\label{A}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label Named Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Label Named Named', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(B)}">(B)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
</math>`
    ));
  it('Ref Default', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\label{A}\\end{align}\\ref{A}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>1</mtext>
  </mrow>
</math>`
    ));
  it('Ref Named', () =>
    toXmlMatch(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>A</mtext>
  </mrow>
</math>`
    ));
  it('Ref Named Default', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(1)}">(1)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>A</mtext>
  </mrow>
  <mrow href="#mjx-eqn%3AB" class="MathJax_ref" data-latex="\\ref{B}">
    <mtext>1</mtext>
  </mrow>
</math>`
    ));
  it('Ref Named Named', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}" display="block">
  <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom" data-latex-item="{align}" data-latex="{align}">
    <mlabeledtr>
      <mtd id="mjx-eqn:A">
        <mtext data-latex="\\text{(A)}">(A)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{A}">a</mi>
      </mtd>
    </mlabeledtr>
    <mlabeledtr>
      <mtd id="mjx-eqn:B">
        <mtext data-latex="\\text{(B)}">(B)</mtext>
      </mtd>
      <mtd>
        <mi data-latex="\\label{B}">b</mi>
      </mtd>
    </mlabeledtr>
  </mtable>
  <mrow href="#mjx-eqn%3AA" class="MathJax_ref" data-latex="\\ref{A}">
    <mtext>A</mtext>
  </mrow>
  <mrow href="#mjx-eqn%3AB" class="MathJax_ref" data-latex="\\ref{B}">
    <mtext>B</mtext>
  </mrow>
</math>`
    ));
});
