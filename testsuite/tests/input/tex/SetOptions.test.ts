import { beforeEach, describe, test } from '@jest/globals';
import {
  toXmlMatch,
  setupTex,
  setupTexTypeset,
  tex2mml,
  typeset2mml,
  setupComponents,
  expectTexError
} from '#helpers';
import '#js/input/tex/setoptions/SetOptionsConfiguration';
import '#js/input/tex/ams/AmsConfiguration';
import '#js/input/tex/units/UnitsConfiguration';

/**********************************************************************************/
/**********************************************************************************/

describe('Setoptions', () => {

  beforeEach(() => setupTex(['base', 'ams', 'units', 'setoptions']));

  /********************************************************************************/

  test('Set TeX option', () => {
    toXmlMatch(
      tex2mml('\\setOptions{tagSide=left} a=b\\tag{1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\setOptions{tagSide=left} a=b\\tag{1}" display="block">
         <mtable side="left" displaystyle="true" data-latex="\\setOptions{tagSide=left} a=b\\tag{1}">
           <mlabeledtr>
             <mtd id="mjx-eqn:1">
               <mtext data-latex="\\text{(}">(</mtext>
               <mtext data-latex="\\text{1}">1</mtext>
               <mtext data-latex="\\text{)}">)</mtext>
             </mtd>
             <mtd>
               <mi data-latex="a">a</mi>
               <mo data-latex="=">=</mo>
               <mi data-latex="\\tag{1}">b</mi>
             </mtd>
           </mlabeledtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Set invalid option', () => {
    expectTexError('\\setOptions{x=y}')
      .toBe('Invalid TeX option "x"');
  });

  /********************************************************************************/

  test('Set prohibited option', () => {
    expectTexError('\\setOptions{tags=all}')
      .toBe('Option "tags" is not allowed to be set');
  });

  /********************************************************************************/

  test('Set invalid package', () => {
    expectTexError('\\setOptions[abc]{x=y}')
      .toBe('Not a defined package: abc');
  });

  /********************************************************************************/

  test('Set prohibited package', () => {
    expectTexError('\\setOptions[setoptions]{setoptions=true}')
      .toBe(`Options can't be set for package "setoptions"`);
  });

  /********************************************************************************/

  test('Set package string option', () => {
    toXmlMatch(
      tex2mml('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="50%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}">
           <mtr>
             <mtd columnalign="left">
               <mi data-latex="a">a</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('Set package boolean option', () => {
    toXmlMatch(
      tex2mml('\\setOptions[units]{loose=true} \\units[1]{kg}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\setOptions[units]{loose=true} \\units[1]{kg}" display="block">
         <mn data-latex="1">1</mn>
         <mtext data-latex="~">&#xA0;</mtext>
         <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{kg}">
           <mi data-mjx-auto-op="false" data-latex="kg">kg</mi>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Set pacjage regexp option', () => {
    toXmlMatch(
      tex2mml('\\setOptions[ams]{operatornamePattern=/^[a-z0-9]+/} \\operatorname{ab1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\setOptions[ams]{operatornamePattern=/^[a-z0-9]+/} \\operatorname{ab1}" display="block">
         <mi data-latex="\\setOptions[ams]{operatornamePattern=/^[a-z0-9]+/} \\operatorname{ab1}">ab1</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Set regexp option with flags', () => {
    toXmlMatch(
      tex2mml('\\setOptions[ams]{operatornamePattern=/^[a-z0-9]+/i} \\operatorname{ab1}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\setOptions[ams]{operatornamePattern=/^[a-z0-9]+/i} \\operatorname{ab1}" display="block">
         <mi data-latex="\\setOptions[ams]{operatornamePattern=/^[a-z0-9]+/i} \\operatorname{ab1}">ab1</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Set invalid package option', () => {
    expectTexError('\\setOptions[ams]{x=y}')
      .toBe('Invalid option "x" for package "ams"');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Setoptions options', () => {

  /********************************************************************************/

  test('allowPackageDefault false',() => {
    setupTex(['base', 'ams', 'setoptions'], {setoptions: {allowPackageDefault: false}});
    expectTexError('\\setOptions[ams]{multlineWidth=50%}')
      .toBe(`Options can't be set for package "ams"`);
  });

  /********************************************************************************/

  test('allowPackageDefault false ams true',() => {
    setupTex(['base', 'ams', 'setoptions'], {
      setoptions: {
        allowPackageDefault: false,
        allowOptions: {ams: true}
      }
    });
    toXmlMatch(
      tex2mml('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="50%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}">
           <mtr>
             <mtd columnalign="left">
               <mi data-latex="a">a</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('allowOptionsDefault false',() => {
    setupTex(['base', 'ams', 'setoptions'], {setoptions: {allowOptionsDefault: false}});
    expectTexError('\\setOptions[ams]{multlineWidth=50%}')
      .toBe('Option "multlineWidth" is not allowed to be set for package ams');
  });

  /********************************************************************************/

  test('allowOptionsDefault false ams true',() => {
    setupTex(['base', 'ams', 'setoptions'], {
      setoptions: {
        allowOptionsDefault: false,
        allowOptions: {ams: true}
      }
    });
    expectTexError('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}')
      .toBe('Option "multlineWidth" is not allowed to be set for package ams');
  });

  /********************************************************************************/

  test('allowOptionsDefault false ams multlineWidth true',() => {
    setupTex(['base', 'ams', 'setoptions'], {
      setoptions: {
        allowOptionsDefault: false,
        allowOptions: {
          ams: {multlineWidth: true}
        }
      }
    });
    toXmlMatch(
      tex2mml('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="50%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}">
           <mtr>
             <mtd columnalign="left">
               <mi data-latex="a">a</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
    expectTexError('\\setOptions[ams]{multlineIndent=50%} \\begin{multline} a \\end{multline}')
      .toBe('Option "multlineIndent" is not allowed to be set for package ams');
  });

  /********************************************************************************/

  test('filterPackage',() => {
    setupTex(['base', 'ams', 'setoptions'], {
      setoptions: {
        filterPackage: (_parser: any, _extension: string) => false
      }
    });
    toXmlMatch(
      tex2mml('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}">
           <mtr>
             <mtd columnalign="left">
               <mi data-latex="a">a</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('filterOption',() => {
    setupTex(['base', 'ams', 'setoptions'], {
      setoptions: {
        filterOption: (_parser: any, _extension: string, _key: string) => false
      }
    });
    toXmlMatch(
      tex2mml('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="100%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}">
           <mtr>
             <mtd columnalign="left">
               <mi data-latex="a">a</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

  test('filterValue',() => {
    setupTex(['base', 'ams', 'setoptions'], {
      setoptions: {
        filterValue: (_parser: any, _extension: string, _option: string, _value: string) => '25%'
      }
    });
    toXmlMatch(
      tex2mml('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}" display="block">
         <mtable displaystyle="true" rowspacing=".5em" columnspacing="100%" width="25%" data-array-padding="1em 1em" data-width-includes-label="true" data-latex-item="{multline}" data-latex="\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}">
           <mtr>
             <mtd columnalign="left">
               <mi data-latex="a">a</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Setoptions Require', () => {

  setupComponents({
    loader: {load: ['input/tex-base', '[tex]/require']}
  });

  beforeEach(() => setupTexTypeset(['base', 'require', 'setoptions']));

  /********************************************************************************/

  test('Require', async () => {
    toXmlMatch(
      await typeset2mml('\\require{bbox} \\bbox[red]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\require{bbox} \\bbox[red]{x}" display="block">
         <mstyle mathbackground="red" data-latex="\\Require{bbox}\\setOptions[bbox]{} \\bbox[red]{x}">
           <mi data-latex="x">x</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('Require with option', async () => {
    toXmlMatch(
      await typeset2mml('\\require[ugly=true]{units} \\nicefrac{a}{b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\require[ugly=true]{units} \\nicefrac{a}{b}" display="block">
         <mfrac data-latex="\\Require{units}\\setOptions[units]{ugly=true} \\nicefrac{a}{b}">
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{a}">
             <mi mathvariant="normal" data-latex="a">a</mi>
           </mrow>
           <mrow data-mjx-texclass="ORD" data-latex="\\mathrm{b}">
             <mi mathvariant="normal" data-latex="b">b</mi>
           </mrow>
         </mfrac>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/
