import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/bbox/BboxConfiguration';

beforeEach(() => setupTex(['base', 'bbox']));

describe('Bbox', () => {
  it('Bbox-Background', () =>
    toXmlMatch(
      tex2mml('\\bbox[yellow]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[yellow]{a}" display="block">
  <mstyle mathbackground="yellow" data-latex="\\bbox[yellow]{a}">
    <mi data-latex="a">a</mi>
  </mstyle>
</math>`
    ));
  it('Bbox-Padding', () =>
    toXmlMatch(
      tex2mml('\\bbox[5px]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[5px]{a}" display="block">
  <mpadded height="+5px" depth="+5px" lspace="5px" width="+10px" data-latex="\\bbox[5px]{a}">
    <mi data-latex="a">a</mi>
  </mpadded>
</math>`
    ));
  it('Bbox-Frame', () =>
    toXmlMatch(
      tex2mml('\\bbox[border:5px solid red]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[border:5px solid red]{a}" display="block">
  <mstyle style="border:5px solid red" data-latex="\\bbox[border:5px solid red]{a}">
    <mi data-latex="a">a</mi>
  </mstyle>
</math>`
    ));
  it('Bbox-Background-Padding', () =>
    toXmlMatch(
      tex2mml('\\bbox[yellow,5px]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[yellow,5px]{a}" display="block">
  <mstyle mathbackground="yellow" data-latex="\\bbox[yellow,5px]{a}">
    <mpadded height="+5px" depth="+5px" lspace="5px" width="+10px">
      <mi data-latex="a">a</mi>
    </mpadded>
  </mstyle>
</math>`
    ));
  it('Bbox-Padding-Frame', () =>
    toXmlMatch(
      tex2mml('\\bbox[5px,border:2px solid red]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[5px,border:2px solid red]{a}" display="block">
  <mstyle style="border:2px solid red" data-latex="\\bbox[5px,border:2px solid red]{a}">
    <mpadded height="+5px" depth="+5px" lspace="5px" width="+10px">
      <mi data-latex="a">a</mi>
    </mpadded>
  </mstyle>
</math>`
    ));
  it('Bbox-Background-Padding-Frame', () =>
    toXmlMatch(
      tex2mml('\\bbox[yellow,5px,border:2px solid red]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[yellow,5px,border:2px solid red]{a}" display="block">
  <mstyle mathbackground="yellow" style="border:2px solid red" data-latex="\\bbox[yellow,5px,border:2px solid red]{a}">
    <mpadded height="+5px" depth="+5px" lspace="5px" width="+10px">
      <mi data-latex="a">a</mi>
    </mpadded>
  </mstyle>
</math>`
    ));
  it('Bbox-Background-Error', () =>
    toXmlMatch(
      tex2mml('\\bbox[yellow,green]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[yellow,green]{a}" display="block">
  <merror data-mjx-error="Background specified twice in \\bbox">
    <mtext>Background specified twice in \\bbox</mtext>
  </merror>
</math>`
    ));
  it('Bbox-Padding-Error', () =>
    toXmlMatch(
      tex2mml('\\bbox[5px,6px]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[5px,6px]{a}" display="block">
  <merror data-mjx-error="Padding specified twice in \\bbox">
    <mtext>Padding specified twice in \\bbox</mtext>
  </merror>
</math>`
    ));
  it('Bbox-Frame-Error', () =>
    toXmlMatch(
      tex2mml('\\bbox[border:2px solid red,border:2px solid green]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[border:2px solid red,border:2px solid green]{a}" display="block">
  <merror data-mjx-error="Style specified twice in \\bbox">
    <mtext>Style specified twice in \\bbox</mtext>
  </merror>
</math>`
    ));
  it('Bbox-General-Error', () =>
    toXmlMatch(
      tex2mml('\\bbox[22-11=color]{a}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[22-11=color]{a}" display="block">
  <merror data-mjx-error="&quot;22-11=color&quot; doesn\'t look like a color, a padding dimension, or a style">
    <mtext>&quot;22-11=color&quot; doesn\'t look like a color, a padding dimension, or a style</mtext>
  </merror>
</math>`
    ));
});
