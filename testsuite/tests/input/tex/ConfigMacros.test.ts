import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch, setupTex, tex2mml } from '#helpers';

beforeEach(() => {});

function runMacroTests(
  macros: {[key: string]: any},
  expected: string,
  control: string,
  macro: string) {
  setupTex(['base', 'configmacros'], macros);
  toXmlMatch(tex2mml(control), expected.replace('PH', control));
  toXmlMatch(tex2mml(macro), expected.replace('PH', macro));
}

// describe('Config Macros Active', () => {
//   it('Macros Simple', () =>
//     runMacroTests(
//       {active: {"@": "Tilde"}},
//       `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"PH\" display=\"block\">
//       <mi data-latex=\"A\">A</mi>
//       <mtext data-latex=\"~\">&#xA0;</mtext>
//       <mi data-latex=\"a\">a</mi>
//     </math>`,
//       'A~a',
//       'A@a'
//     ));
// });

describe('Config Macros Commands', () => {
  it('Commands Simple', () => 
    runMacroTests(
      {macros: {"RR": "{\\bf R}"}},
    `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"PH\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"{\\bf R}\">
        <mi mathvariant=\"bold\" data-latex=\"R\">R</mi>
      </mrow>
</math>`,
      '{\\bf R}',
      '\\RR'));
  it('Commands Argument', () =>
    runMacroTests(
      {macros: {"bold": ["{\\bf #1}", 1]}},
    `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"PH\" display=\"block\">
      <mrow data-mjx-texclass=\"ORD\" data-latex=\"{\\bf bold}\">
        <mi mathvariant=\"bold\" data-latex=\"b\">b</mi>
        <mi mathvariant=\"bold\" data-latex=\"o\">o</mi>
        <mi mathvariant=\"bold\" data-latex=\"l\">l</mi>
        <mi mathvariant=\"bold\" data-latex=\"d\">d</mi>
      </mrow>
    </math>`,
      '{\\bf bold}',
      '\\bold{bold}'));
  it('Commands Aux Argument', () =>
    runMacroTests(
      {macros: {"foo": ["\\mbox{first } #1 \\mbox{ second } #2", 2, ["[", "]"]]}},
    `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"PH\" display=\"block\">
      <mstyle displaystyle=\"false\" scriptlevel=\"0\" data-latex=\"\\mbox{first }\">
        <mtext>first&#xA0;</mtext>
      </mstyle>
      <mi data-latex=\"h\">h</mi>
      <mi data-latex=\"i\">i</mi>
      <mstyle displaystyle=\"false\" scriptlevel=\"0\" data-latex=\"\\mbox{ second }\">
        <mtext>&#xA0;second&#xA0;</mtext>
      </mstyle>
      <mi data-latex=\"t\">t</mi>
      <mi data-latex=\"h\">h</mi>
      <mi data-latex=\"e\">e</mi>
      <mi data-latex=\"r\">r</mi>
      <mi data-latex=\"e\">e</mi>
    </math>`,
      '\\mbox{first } hi \\mbox{ second } there',
      '\\foo[hi]{there}'));
});

// describe('Config Macros Environment', () => {
//   it('Environment Simple', () =>
//     runMacroTests(
//       {environment: {"persarr": "array"}},
//       `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"PH\" display=\"block\">
//       <mtable columnspacing=\"1em\" rowspacing=\"4pt\" data-frame-styles=\"\" framespacing=\".5em .125em\" data-latex-item=\"{array}\" data-latex=\"\\begin{array}{c}a\\end{array}\">
//         <mtr data-latex-item=\"{c}\" data-latex=\"{c}\">
//           <mtd>
//             <mi data-latex=\"a\">a</mi>
//           </mtd>
//         </mtr>
//       </mtable>
//     </math>`,
//       '\\begin{array}{c}a\\end{array}',
//       '\\begin{persarr}{c}a\\end{persarr}'
//     ));
// });
