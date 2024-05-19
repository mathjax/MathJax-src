import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch } from '../../src/xmlMatch';
import { setupTex, tex2mml } from '../../src/setupTex';

beforeEach(() => setupTex(['base', 'braket']));

describe('Braket', () => {
  it('Braket-bra', () =>
    toXmlMatch(
      tex2mml('\\bra{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra{x}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\langle {x} \\vert}">\n    <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{x}">\n      <mi data-latex="x">x</mi>\n    </mrow>\n    <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-bra-large', () =>
    toXmlMatch(
      tex2mml('\\bra{\\frac{x}{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra{\\frac{x}{y}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\langle {\\frac{x}{y}} \\vert}">\n    <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">\n      <mfrac data-latex="\\frac{x}{y}">\n        <mi data-latex="x">x</mi>\n        <mi data-latex="y">y</mi>\n      </mfrac>\n    </mrow>\n    <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Bra', () =>
    toXmlMatch(
      tex2mml('\\Bra{\\frac{x}{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Bra{\\frac{x}{y}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\left\\langle {\\frac{x}{y}} \\right\\vert}">\n    <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle {\\frac{x}{y}} \\right\\vert" data-latex="\\left\\langle {\\frac{x}{y}} \\right\\vert">\n      <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle " data-latex="\\left\\langle ">&#x27E8;</mo>\n      <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">\n        <mfrac data-latex="\\frac{x}{y}">\n          <mi data-latex="x">x</mi>\n          <mi data-latex="y">y</mi>\n        </mfrac>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n    </mrow>\n  </mrow>\n</math>'
    ));
  it('Braket-ket', () =>
    toXmlMatch(
      tex2mml('\\ket{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket{x}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\vert {x} \\rangle}">\n    <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{x}">\n      <mi data-latex="x">x</mi>\n    </mrow>\n    <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-ket-large', () =>
    toXmlMatch(
      tex2mml('\\ket{\\frac{x}{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket{\\frac{x}{y}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\vert {\\frac{x}{y}} \\rangle}">\n    <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">\n      <mfrac data-latex="\\frac{x}{y}">\n        <mi data-latex="x">x</mi>\n        <mi data-latex="y">y</mi>\n      </mfrac>\n    </mrow>\n    <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Ket', () =>
    toXmlMatch(
      tex2mml('\\Ket{\\frac{x}{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Ket{\\frac{x}{y}}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\left\\vert {\\frac{x}{y}} \\right\\rangle}">\n    <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert {\\frac{x}{y}} \\right\\rangle" data-latex="\\left\\vert {\\frac{x}{y}} \\right\\rangle">\n      <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert " data-latex="\\left\\vert ">|</mo>\n      <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">\n        <mfrac data-latex="\\frac{x}{y}">\n          <mi data-latex="x">x</mi>\n          <mi data-latex="y">y</mi>\n        </mfrac>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n    </mrow>\n  </mrow>\n</math>'
    ));
  it('Braket-braket', () =>
    toXmlMatch(
      tex2mml('\\braket{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{x}" display="block">\n  <mrow data-latex="\\braket{x}">\n    <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-braket-large', () =>
    toXmlMatch(
      tex2mml('\\braket{\\frac{x}{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{\\frac{x}{y}}" display="block">\n  <mrow data-latex="\\braket{\\frac{x}{y}}">\n    <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Braket', () =>
    toXmlMatch(
      tex2mml('\\Braket{\\frac{x}{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Braket{\\frac{x}{y}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\Braket{\\frac{x}{y}}">\n    <mo data-mjx-texclass="OPEN">&#x27E8;</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-ketbra', () =>
    toXmlMatch(
      tex2mml('\\ketbra{x}{y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{x}{y}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\vert {x} \\rangle\\langle {y} \\vert}">\n    <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{x}">\n      <mi data-latex="x">x</mi>\n    </mrow>\n    <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>\n    <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{y}">\n      <mi data-latex="y">y</mi>\n    </mrow>\n    <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-ketbra-large', () =>
    toXmlMatch(
      tex2mml('\\ketbra{\\frac{x}{y}}{z}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{\\frac{x}{y}}{z}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\vert {\\frac{x}{y}} \\rangle\\langle {z} \\vert}">\n    <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">\n      <mfrac data-latex="\\frac{x}{y}">\n        <mi data-latex="x">x</mi>\n        <mi data-latex="y">y</mi>\n      </mfrac>\n    </mrow>\n    <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>\n    <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>\n    <mrow data-mjx-texclass="ORD" data-latex="{z}">\n      <mi data-latex="z">z</mi>\n    </mrow>\n    <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Ketbra', () =>
    toXmlMatch(
      tex2mml('\\Ketbra{\\frac{x}{y}}{z}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Ketbra{\\frac{x}{y}}{z}" display="block">\n  <mrow data-mjx-texclass="ORD" data-latex="{\\left\\vert {\\frac{x}{y}} \\right\\rangle\\left\\langle {z} \\right\\vert}">\n    <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\vert {\\frac{x}{y}} \\right\\rangle" data-latex="\\left\\vert {\\frac{x}{y}} \\right\\rangle">\n      <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\vert " data-latex="\\left\\vert ">|</mo>\n      <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">\n        <mfrac data-latex="\\frac{x}{y}">\n          <mi data-latex="x">x</mi>\n          <mi data-latex="y">y</mi>\n        </mfrac>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\rangle" data-latex="\\right\\rangle">&#x27E9;</mo>\n    </mrow>\n    <mrow data-mjx-texclass="INNER" data-latex-item="\\left\\langle {z} \\right\\vert" data-latex="\\left\\langle {z} \\right\\vert">\n      <mo data-mjx-texclass="OPEN" data-latex-item="\\left\\langle " data-latex="\\left\\langle ">&#x27E8;</mo>\n      <mrow data-mjx-texclass="ORD" data-latex="{z}">\n        <mi data-latex="z">z</mi>\n      </mrow>\n      <mo data-mjx-texclass="CLOSE" data-latex-item="\\right\\vert" data-latex="\\right\\vert">|</mo>\n    </mrow>\n  </mrow>\n</math>'
    ));
  it('Braket-Set', () =>
    toXmlMatch(
      tex2mml('\\Set{x}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Set{x}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\Set{x}">\n    <mo data-mjx-texclass="OPEN">{</mo>\n    <mspace width="0.167em"></mspace>\n    <mi data-latex="x">x</mi>\n    <mspace width="0.167em"></mspace>\n    <mo data-mjx-texclass="CLOSE">}</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Set-large', () =>
    toXmlMatch(
      tex2mml('\\Set{\\frac{x}{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Set{\\frac{x}{y}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\Set{\\frac{x}{y}}">\n    <mo data-mjx-texclass="OPEN">{</mo>\n    <mspace width="0.167em"></mspace>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mspace width="0.167em"></mspace>\n    <mo data-mjx-texclass="CLOSE">}</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Set-Bar', () =>
    toXmlMatch(
      tex2mml('\\Set{x|\\frac{x}{y}}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Set{x|\\frac{x}{y}}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\Set{x|\\frac{x}{y}}">\n    <mo data-mjx-texclass="OPEN">{</mo>\n    <mspace width="0.167em"></mspace>\n    <mi data-latex="x">x</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">|</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mspace width="0.167em"></mspace>\n    <mo data-mjx-texclass="CLOSE">}</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-bar-small', () =>
    toXmlMatch(
      tex2mml('\\braket{x|y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{x|y}" display="block">\n  <mrow data-latex="\\braket{x|y}">\n    <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>\n    <mi data-latex="x">x</mi>\n    <mo data-mjx-texclass="ORD" stretchy="false" data-braketbar="true" data-latex="|">|</mo>\n    <mi data-latex="y">y</mi>\n    <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-bar-large', () =>
    toXmlMatch(
      tex2mml('\\braket{\\frac{x}{y}|z}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{\\frac{x}{y}|z}" display="block">\n  <mrow data-latex="\\braket{\\frac{x}{y}|z}">\n    <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mo data-mjx-texclass="ORD" stretchy="false" data-braketbar="true" data-latex="|">|</mo>\n    <mi data-latex="z">z</mi>\n    <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Bar', () =>
    toXmlMatch(
      tex2mml('\\Braket{\\frac{x}{y}|z}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Braket{\\frac{x}{y}|z}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\Braket{\\frac{x}{y}|z}">\n    <mo data-mjx-texclass="OPEN">&#x27E8;</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">|</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mi data-latex="z">z</mi>\n    <mo data-mjx-texclass="CLOSE">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Bar1', () =>
    toXmlMatch(
      tex2mml('\\Braket{\\frac{x}{y}||z||y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Braket{\\frac{x}{y}||z||y}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\Braket{\\frac{x}{y}||z||y}">\n    <mo data-mjx-texclass="OPEN">&#x27E8;</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mi data-latex="z">z</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mi data-latex="y">y</mi>\n    <mo data-mjx-texclass="CLOSE">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Bar2', () =>
    toXmlMatch(
      tex2mml('\\Braket{\\frac{x}{y}\\||z||y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Braket{\\frac{x}{y}\\||z||y}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\Braket{\\frac{x}{y}\\||z||y}">\n    <mo data-mjx-texclass="OPEN">&#x27E8;</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">|</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mi data-latex="z">z</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mi data-latex="y">y</mi>\n    <mo data-mjx-texclass="CLOSE">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Bar3', () =>
    toXmlMatch(
      tex2mml('\\Braket{\\frac{x}{y}|||z||y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Braket{\\frac{x}{y}|||z||y}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\Braket{\\frac{x}{y}|||z||y}">\n    <mo data-mjx-texclass="OPEN">&#x27E8;</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">|</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mi data-latex="z">z</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mi data-latex="y">y</mi>\n    <mo data-mjx-texclass="CLOSE">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Bar4', () =>
    toXmlMatch(
      tex2mml('\\Braket{\\frac{x}{y}|||z|||y}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Braket{\\frac{x}{y}|||z|||y}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\Braket{\\frac{x}{y}|||z|||y}">\n    <mo data-mjx-texclass="OPEN">&#x27E8;</mo>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">|</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mi data-latex="z">z</mi>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">|</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mi data-latex="y">y</mi>\n    <mo data-mjx-texclass="CLOSE">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Bar-Set', () =>
    toXmlMatch(
      tex2mml('\\Set{\\frac{x}{y}||y||z}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Set{\\frac{x}{y}||y||z}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\Set{\\frac{x}{y}||y||z}">\n    <mo data-mjx-texclass="OPEN">{</mo>\n    <mspace width="0.167em"></mspace>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mi data-latex="y">y</mi>\n    <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n    <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n    <mi data-latex="z">z</mi>\n    <mspace width="0.167em"></mspace>\n    <mo data-mjx-texclass="CLOSE">}</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Bar-Set2', () =>
    toXmlMatch(
      tex2mml('\\Set{\\frac{x}{y}\\||y\\||z}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Set{\\frac{x}{y}\\||y\\||z}" display="block">\n  <mrow data-mjx-texclass="INNER" data-latex="\\Set{\\frac{x}{y}\\||y\\||z}">\n    <mo data-mjx-texclass="OPEN">{</mo>\n    <mspace width="0.167em"></mspace>\n    <mfrac data-latex="\\frac{x}{y}">\n      <mi data-latex="x">x</mi>\n      <mi data-latex="y">y</mi>\n    </mfrac>\n    <mrow data-mjx-texclass="CLOSE"></mrow>\n    <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>\n    <mrow data-mjx-texclass="OPEN"></mrow>\n    <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n    <mi data-latex="y">y</mi>\n    <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\|">&#x2016;</mo>\n    <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n    <mi data-latex="z">z</mi>\n    <mspace width="0.167em"></mspace>\n    <mo data-mjx-texclass="CLOSE">}</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-Space', () =>
    toXmlMatch(
      tex2mml('\\braket {a|b}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket {a|b}" display="block">\n  <mrow data-latex="\\braket {a|b}">\n    <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>\n    <mi data-latex="a">a</mi>\n    <mo data-mjx-texclass="ORD" stretchy="false" data-braketbar="true" data-latex="|">|</mo>\n    <mi data-latex="b">b</mi>\n    <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
  it('Braket-No-Braces-Simple', () =>
    toXmlMatch(
      tex2mml('\\braket a|b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket a|b" display="block">\n  <mrow data-latex="a">\n    <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>\n    <mi>a</mi>\n    <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>\n  </mrow>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('Braket-No-Braces-Complex', () =>
    toXmlMatch(
      tex2mml('\\braket \\frac{a}{c}|b'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket \\frac{a}{c}|b" display="block">\n  <mrow data-latex="\\frac{a}{c}">\n    <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>\n    <mfrac>\n      <mi data-latex="a">a</mi>\n      <mi data-latex="c">c</mi>\n    </mfrac>\n    <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>\n  </mrow>\n  <mo data-mjx-texclass="ORD" stretchy="false" data-latex="|">|</mo>\n  <mi data-latex="b">b</mi>\n</math>'
    ));
  it('Braket-Nested', () =>
    toXmlMatch(
      tex2mml('\\braket {\\braket{a|b}c}'),
      '<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket {\\braket{a|b}c}" display="block">\n  <mrow data-latex="\\braket {\\braket{a|b}c}">\n    <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>\n    <mrow data-latex="{}">\n      <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>\n      <mi data-latex="a">a</mi>\n      <mo data-mjx-texclass="ORD" stretchy="false" data-braketbar="true" data-latex="|">|</mo>\n      <mi data-latex="b">b</mi>\n      <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>\n    </mrow>\n    <mi data-latex="c">c</mi>\n    <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>\n  </mrow>\n</math>'
    ));
});
