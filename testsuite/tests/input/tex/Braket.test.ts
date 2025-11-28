import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/braket/BraketConfiguration';

beforeEach(() => setupTex(['base', 'braket']));

/**********************************************************************************/
/**********************************************************************************/

describe('Braket', () => {

  /********************************************************************************/

  it('Braket-bra', () => {
    toXmlMatch(
      tex2mml('\\bra{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra{x}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\langle {x} \\vert}">
           <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{x}">
             <mi data-latex="x">x</mi>
           </mrow>
           <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-bra-large', () => {
    toXmlMatch(
      tex2mml('\\bra{\\frac{x}{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bra{\\frac{x}{y}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\langle {\\frac{x}{y}} \\vert}">
           <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">
             <mfrac data-latex="\\frac{x}{y}">
               <mi data-latex="x">x</mi>
               <mi data-latex="y">y</mi>
             </mfrac>
           </mrow>
           <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Bra', () => {
    toXmlMatch(
      tex2mml('\\Bra{\\frac{x}{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Bra{\\frac{x}{y}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\left\\langle {\\frac{x}{y}} \\right\\vert}">
           <mrow data-mjx-texclass="INNER" data-latex="\\left\\langle {\\frac{x}{y}} \\right\\vert">
             <mo data-mjx-texclass="OPEN" data-latex="\\left\\langle ">&#x27E8;</mo>
             <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">
               <mfrac data-latex="\\frac{x}{y}">
                 <mi data-latex="x">x</mi>
                 <mi data-latex="y">y</mi>
               </mfrac>
             </mrow>
             <mo data-mjx-texclass="CLOSE" data-latex="\\right\\vert">|</mo>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-ket', () => {
    toXmlMatch(
      tex2mml('\\ket{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket{x}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\vert {x} \\rangle}">
           <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{x}">
             <mi data-latex="x">x</mi>
           </mrow>
           <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-ket-large', () => {
    toXmlMatch(
      tex2mml('\\ket{\\frac{x}{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ket{\\frac{x}{y}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\vert {\\frac{x}{y}} \\rangle}">
           <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">
             <mfrac data-latex="\\frac{x}{y}">
               <mi data-latex="x">x</mi>
               <mi data-latex="y">y</mi>
             </mfrac>
           </mrow>
           <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Ket', () => {
    toXmlMatch(
      tex2mml('\\Ket{\\frac{x}{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Ket{\\frac{x}{y}}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\left\\vert {\\frac{x}{y}} \\right\\rangle}">
           <mrow data-mjx-texclass="INNER" data-latex="\\left\\vert {\\frac{x}{y}} \\right\\rangle">
             <mo data-mjx-texclass="OPEN" data-latex="\\left\\vert ">|</mo>
             <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">
               <mfrac data-latex="\\frac{x}{y}">
                 <mi data-latex="x">x</mi>
                 <mi data-latex="y">y</mi>
               </mfrac>
             </mrow>
             <mo data-mjx-texclass="CLOSE" data-latex="\\right\\rangle">&#x27E9;</mo>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-braket', () => {
    toXmlMatch(
      tex2mml('\\braket{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{x}" display="block">
         <mrow data-latex="\\braket{x}">
           <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>
           <mi data-latex="x">x</mi>
           <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-braket-large', () => {
    toXmlMatch(
      tex2mml('\\braket{\\frac{x}{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{\\frac{x}{y}}" display="block">
         <mrow data-latex="\\braket{\\frac{x}{y}}">
           <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>
           <mfrac data-latex="\\frac{x}{y}">
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Braket', () => {
    toXmlMatch(
      tex2mml('\\Braket{\\frac{x}{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Braket{\\frac{x}{y}}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\Braket{\\frac{x}{y}}">
           <mo data-mjx-texclass="OPEN">&#x27E8;</mo>
           <mfrac data-latex="\\frac{x}{y}">
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mo data-mjx-texclass="CLOSE">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-ketbra', () => {
    toXmlMatch(
      tex2mml('\\ketbra{x}{y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{x}{y}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\vert {x} \\rangle\\langle {y} \\vert}">
           <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{x}">
             <mi data-latex="x">x</mi>
           </mrow>
           <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>
           <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{y}">
             <mi data-latex="y">y</mi>
           </mrow>
           <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-ketbra-large', () => {
    toXmlMatch(
      tex2mml('\\ketbra{\\frac{x}{y}}{z}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\ketbra{\\frac{x}{y}}{z}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\vert {\\frac{x}{y}} \\rangle\\langle {z} \\vert}">
           <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">
             <mfrac data-latex="\\frac{x}{y}">
               <mi data-latex="x">x</mi>
               <mi data-latex="y">y</mi>
             </mfrac>
           </mrow>
           <mo fence="false" stretchy="false" data-latex="\\rangle">&#x27E9;</mo>
           <mo fence="false" stretchy="false" data-latex="\\langle">&#x27E8;</mo>
           <mrow data-mjx-texclass="ORD" data-latex="{z}">
             <mi data-latex="z">z</mi>
           </mrow>
           <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\vert">|</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Ketbra', () => {
    toXmlMatch(
      tex2mml('\\Ketbra{\\frac{x}{y}}{z}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Ketbra{\\frac{x}{y}}{z}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\left\\vert {\\frac{x}{y}} \\right\\rangle\\left\\langle {z} \\right\\vert}">
           <mrow data-mjx-texclass="INNER" data-latex="\\left\\vert {\\frac{x}{y}} \\right\\rangle">
             <mo data-mjx-texclass="OPEN" data-latex="\\left\\vert ">|</mo>
             <mrow data-mjx-texclass="ORD" data-latex="{\\frac{x}{y}}">
               <mfrac data-latex="\\frac{x}{y}">
                 <mi data-latex="x">x</mi>
                 <mi data-latex="y">y</mi>
               </mfrac>
             </mrow>
             <mo data-mjx-texclass="CLOSE" data-latex="\\right\\rangle">&#x27E9;</mo>
           </mrow>
           <mrow data-mjx-texclass="INNER" data-latex="\\left\\langle {z} \\right\\vert">
             <mo data-mjx-texclass="OPEN" data-latex="\\left\\langle ">&#x27E8;</mo>
             <mrow data-mjx-texclass="ORD" data-latex="{z}">
               <mi data-latex="z">z</mi>
             </mrow>
             <mo data-mjx-texclass="CLOSE" data-latex="\\right\\vert">|</mo>
           </mrow>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Set-small', () => {
    toXmlMatch(
      tex2mml('\\set{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\set{x}" display="block">
         <mrow data-latex="\\set{x}">
           <mo data-mjx-texclass="OPEN" stretchy="false">{</mo>
           <mi data-latex="x">x</mi>
           <mo data-mjx-texclass="CLOSE" stretchy="false">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Set', () => {
    toXmlMatch(
      tex2mml('\\Set{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Set{x}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\Set{x}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mspace width="0.167em"></mspace>
           <mi data-latex="x">x</mi>
           <mspace width="0.167em"></mspace>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Set-large', () => {
    toXmlMatch(
      tex2mml('\\Set{\\frac{x}{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Set{\\frac{x}{y}}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\Set{\\frac{x}{y}}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mspace width="0.167em"></mspace>
           <mfrac data-latex="\\frac{x}{y}">
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mspace width="0.167em"></mspace>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Set-Bar', () => {
    toXmlMatch(
      tex2mml('\\Set{x|\\frac{x}{y}}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Set{x|\\frac{x}{y}}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\Set{x|\\frac{x}{y}}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mspace width="0.167em"></mspace>
           <mi data-latex="x">x</mi>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" stretchy="true" data-braketbar="true">|</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mfrac data-latex="\\frac{x}{y}">
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mspace width="0.167em"></mspace>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Set-over', () => {
    toXmlMatch(
      tex2mml('\\Set{x\\over y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Set{x\\over y}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\Set{x\\over y}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mspace width="0.167em"></mspace>
           <mfrac>
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mspace width="0.167em"></mspace>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-bar-small', () => {
    toXmlMatch(
      tex2mml('\\braket{x|y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{x|y}" display="block">
         <mrow data-latex="\\braket{x|y}">
           <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>
           <mi data-latex="x">x</mi>
           <mo data-mjx-texclass="ORD" data-braketbar="true" data-latex="|">|</mo>
           <mi data-latex="y">y</mi>
           <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-bar-large', () => {
    toXmlMatch(
      tex2mml('\\braket{\\frac{x}{y}|z}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket{\\frac{x}{y}|z}" display="block">
         <mrow data-latex="\\braket{\\frac{x}{y}|z}">
           <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>
           <mfrac data-latex="\\frac{x}{y}">
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mo data-mjx-texclass="ORD" data-braketbar="true" data-latex="|">|</mo>
           <mi data-latex="z">z</mi>
           <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Bar', () => {
    toXmlMatch(
      tex2mml('\\Braket{\\frac{x}{y}|z}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Braket{\\frac{x}{y}|z}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\Braket{\\frac{x}{y}|z}">
           <mo data-mjx-texclass="OPEN">&#x27E8;</mo>
           <mfrac data-latex="\\frac{x}{y}">
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" stretchy="true" data-braketbar="true">|</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mi data-latex="z">z</mi>
           <mo data-mjx-texclass="CLOSE">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Bar1', () => {
    toXmlMatch(
      tex2mml('\\Braket{\\frac{x}{y}||z||y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Braket{\\frac{x}{y}||z||y}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\Braket{\\frac{x}{y}||z||y}">
           <mo data-mjx-texclass="OPEN">&#x27E8;</mo>
           <mfrac data-latex="\\frac{x}{y}">
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mi data-latex="z">z</mi>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mi data-latex="y">y</mi>
           <mo data-mjx-texclass="CLOSE">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Bar2', () => {
    toXmlMatch(
      tex2mml('\\Braket{\\frac{x}{y}\\||z||y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Braket{\\frac{x}{y}\\||z||y}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\Braket{\\frac{x}{y}\\||z||y}">
           <mo data-mjx-texclass="OPEN">&#x27E8;</mo>
           <mfrac data-latex="\\frac{x}{y}">
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" stretchy="true" data-braketbar="true">|</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mi data-latex="z">z</mi>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mi data-latex="y">y</mi>
           <mo data-mjx-texclass="CLOSE">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Bar3', () => {
    toXmlMatch(
      tex2mml('\\Braket{\\frac{x}{y}|||z||y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Braket{\\frac{x}{y}|||z||y}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\Braket{\\frac{x}{y}|||z||y}">
           <mo data-mjx-texclass="OPEN">&#x27E8;</mo>
           <mfrac data-latex="\\frac{x}{y}">
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" stretchy="true" data-braketbar="true">|</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mi data-latex="z">z</mi>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mi data-latex="y">y</mi>
           <mo data-mjx-texclass="CLOSE">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Bar4', () => {
    toXmlMatch(
      tex2mml('\\Braket{\\frac{x}{y}|||z|||y}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Braket{\\frac{x}{y}|||z|||y}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\Braket{\\frac{x}{y}|||z|||y}">
           <mo data-mjx-texclass="OPEN">&#x27E8;</mo>
           <mfrac data-latex="\\frac{x}{y}">
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" stretchy="true" data-braketbar="true">|</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mi data-latex="z">z</mi>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" stretchy="true" data-braketbar="true">|</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mi data-latex="y">y</mi>
           <mo data-mjx-texclass="CLOSE">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Bar-Set', () => {
    toXmlMatch(
      tex2mml('\\Set{\\frac{x}{y}||y||z}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Set{\\frac{x}{y}||y||z}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\Set{\\frac{x}{y}||y||z}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mspace width="0.167em"></mspace>
           <mfrac data-latex="\\frac{x}{y}">
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mi data-latex="y">y</mi>
           <mo data-mjx-texclass="ORD" data-latex="|">|</mo>
           <mo data-mjx-texclass="ORD" data-latex="|">|</mo>
           <mi data-latex="z">z</mi>
           <mspace width="0.167em"></mspace>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Bar-Set2', () => {
    toXmlMatch(
      tex2mml('\\Set{\\frac{x}{y}\\||y\\||z}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\Set{\\frac{x}{y}\\||y\\||z}" display="block">
         <mrow data-mjx-texclass="INNER" data-latex="\\Set{\\frac{x}{y}\\||y\\||z}">
           <mo data-mjx-texclass="OPEN">{</mo>
           <mspace width="0.167em"></mspace>
           <mfrac data-latex="\\frac{x}{y}">
             <mi data-latex="x">x</mi>
             <mi data-latex="y">y</mi>
           </mfrac>
           <mrow data-mjx-texclass="CLOSE"></mrow>
           <mo data-mjx-texclass="BIN" data-braketbar="true">&#x2016;</mo>
           <mrow data-mjx-texclass="OPEN"></mrow>
           <mo data-mjx-texclass="ORD" data-latex="|">|</mo>
           <mi data-latex="y">y</mi>
           <mo data-mjx-texclass="ORD" fence="false" stretchy="false" data-latex="\\|">&#x2016;</mo>
           <mo data-mjx-texclass="ORD" data-latex="|">|</mo>
           <mi data-latex="z">z</mi>
           <mspace width="0.167em"></mspace>
           <mo data-mjx-texclass="CLOSE">}</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Space', () => {
    toXmlMatch(
      tex2mml('\\braket {a|b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket {a|b}" display="block">
         <mrow data-latex="\\braket {a|b}">
           <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>
           <mi data-latex="a">a</mi>
           <mo data-mjx-texclass="ORD" data-braketbar="true" data-latex="|">|</mo>
           <mi data-latex="b">b</mi>
           <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-No-Braces-Simple', () => {
    toXmlMatch(
      tex2mml('\\braket a|b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket a|b" display="block">
         <mrow data-latex="a">
           <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>
           <mi>a</mi>
           <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>
         </mrow>
         <mo data-mjx-texclass="ORD" data-latex="|">|</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-No-Braces-Complex', () => {
    toXmlMatch(
      tex2mml('\\braket \\frac{a}{c}|b'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket \\frac{a}{c}|b" display="block">
         <mrow data-latex="\\frac{a}{c}">
           <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>
           <mfrac>
             <mi data-latex="a">a</mi>
             <mi data-latex="c">c</mi>
           </mfrac>
           <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>
         </mrow>
         <mo data-mjx-texclass="ORD" data-latex="|">|</mo>
         <mi data-latex="b">b</mi>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-Nested', () => {
    toXmlMatch(
      tex2mml('\\braket {\\braket{a|b}c}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\braket {\\braket{a|b}c}" display="block">
         <mrow data-latex="\\braket {\\braket{a|b}c}">
           <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>
           <mrow data-latex="{}">
             <mo data-mjx-texclass="OPEN" stretchy="false">&#x27E8;</mo>
             <mi data-latex="a">a</mi>
             <mo data-mjx-texclass="ORD" data-braketbar="true" data-latex="|">|</mo>
             <mi data-latex="b">b</mi>
             <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>
           </mrow>
           <mi data-latex="c">c</mi>
           <mo data-mjx-texclass="CLOSE" stretchy="false">&#x27E9;</mo>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  it('Braket-error', () => {
    expectTexError('\\braket')
      .toBe('Missing argument for \\braket');
  });

  /********************************************************************************/

  it('Braket-braces', () => {
    expectTexError('\\braket{')
      .toBe('Missing close brace');
  });

  /********************************************************************************/

  it('Braket-braces', () => {
    expectTexError('\\braket}')
      .toBe('Extra close brace or missing open brace');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('braket'));
