import { beforeEach, describe, expect, test } from '@jest/globals';
import {
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
    expect(tex2mml('\\setOptions{tagSide=left} a=b\\tag{1}')).toMatchSnapshot();
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
    expect(tex2mml('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Set package boolean option', () => {
    expect(tex2mml('\\setOptions[units]{loose=true} \\units[1]{kg}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Set pacjage regexp option', () => {
    expect(tex2mml('\\setOptions[ams]{operatornamePattern=/^[a-z0-9]+/} \\operatorname{ab1}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Set regexp option with flags', () => {
    expect(tex2mml('\\setOptions[ams]{operatornamePattern=/^[a-z0-9]+/i} \\operatorname{ab1}')).toMatchSnapshot();
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
    expect(tex2mml('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}')).toMatchSnapshot();
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
    expect(tex2mml('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}')).toMatchSnapshot();
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
    expect(tex2mml('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('filterOption',() => {
    setupTex(['base', 'ams', 'setoptions'], {
      setoptions: {
        filterOption: (_parser: any, _extension: string, _key: string) => false
      }
    });
    expect(tex2mml('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('filterValue',() => {
    setupTex(['base', 'ams', 'setoptions'], {
      setoptions: {
        filterValue: (_parser: any, _extension: string, _option: string, _value: string) => '25%'
      }
    });
    expect(tex2mml('\\setOptions[ams]{multlineWidth=50%} \\begin{multline} a \\end{multline}')).toMatchSnapshot();
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
    expect(await typeset2mml('\\require{bbox} \\bbox[red]{x}')).toMatchSnapshot();
  });

  /********************************************************************************/

  test('Require with option', async () => {
    expect(await typeset2mml('\\require[ugly=true]{units} \\nicefrac{a}{b}')).toMatchSnapshot();
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/
