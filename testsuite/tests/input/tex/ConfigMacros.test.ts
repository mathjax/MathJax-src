import { beforeEach, describe, expect, it } from '@jest/globals';
import { setupTex, tex2mml } from '#helpers';
import '#js/input/tex/configmacros/ConfigMacrosConfiguration.js';

beforeEach(() => {});

function runMacroTest(
  macros: { [key: string]: any },
  macro: string
) {
  setupTex(['base', 'configmacros'], macros);
  expect(tex2mml(macro)).toMatchSnapshot();
}

/**********************************************************************************/

describe('Config Macros Active', () => {
  it('Macros Simple', () => {
    runMacroTest({ active: { '@': '~' } }, 'A@a');
  });
});

/**********************************************************************************/

describe('Config Macros Commands', () => {
  it('Commands Simple', () => {
    runMacroTest({ macros: { RR: '{\\bf R}' } }, '\\RR');
  });

  it('Commands Argument', () => {
    runMacroTest({ macros: { bold: ['{\\bf #1}', 1] } }, '\\bold{bold}');
  });

  it('Commands Aux Argument', () => {
    runMacroTest(
      {
        macros: {
          foo: ['\\mbox{first } #1 \\mbox{ second } #2', 2, ['[', ']']],
        },
      },
      '\\foo[hi]{there}'
    );
  });

  it('Commands Template', () => {
    runMacroTest(
      {
        macros: {
          foo: ['\\text{[#1]}', 1, [undefined , '+ \\oof']]
        }
      },
      '\\foo A + \\oof'
    );
  });
});

/**********************************************************************************/

describe('Config Macros Environment', () => {
  it('Environment Simple', () => {
    runMacroTest(
      { environments: { myHeartEnv: ['\\heartsuit', '\\spadesuit'] } },
      '\\begin{myHeartEnv}a\\end{myHeartEnv}'
    );
  });
});

/**********************************************************************************/
