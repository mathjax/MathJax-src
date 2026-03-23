import { beforeEach, describe, expect, it } from '@jest/globals';
import { setupTex, tex2mml } from '#helpers';
import '#js/input/tex/configmacros/ConfigMacrosConfiguration';

beforeEach(() => {});

function runMacroTests(
  macros: { [key: string]: any },
  control: string,
  macro: string
) {
  setupTex(['base', 'configmacros'], macros);
  expect(tex2mml(control)).toMatchSnapshot();
  expect(tex2mml(macro)).toMatchSnapshot();
}

/**********************************************************************************/

describe('Config Macros Active', () => {
  it('Macros Simple', () => {
    runMacroTests({ active: { '@': '~' } }, 'A~a', 'A@a');
  });
});

/**********************************************************************************/

describe('Config Macros Commands', () => {
  it('Commands Simple', () => {
    runMacroTests({ macros: { RR: '{\\bf R}' } }, '{\\bf R}', '\\RR');
  });

  it('Commands Argument', () => {
    runMacroTests(
      { macros: { bold: ['{\\bf #1}', 1] } },
      '{\\bf bold}',
      '\\bold{bold}'
    );
  });

  it('Commands Aux Argument', () => {
    runMacroTests(
      {
        macros: {
          foo: ['\\mbox{first } #1 \\mbox{ second } #2', 2, ['[', ']']],
        },
      },
      '\\mbox{first } hi \\mbox{ second } there',
      '\\foo[hi]{there}'
    );
  });
});

/**********************************************************************************/

describe('Config Macros Environment', () => {
  it('Environment Simple', () => {
    runMacroTests(
      { environments: { myHeartEnv: ['\\heartsuit', '\\spadesuit'] } },
      '\\begin{myHeartEnv}a\\end{myHeartEnv}',
      '\\begin{myHeartEnv}a\\end{myHeartEnv}'
    );
  });
});

/**********************************************************************************/
