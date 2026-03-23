import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/unicode/UnicodeConfiguration';

beforeEach(() => setupTex(['base', 'unicode']));

/**********************************************************************************/

describe('Unicode', () => {

  it('Unicode Dec', () => {
    expect(tex2mml('\\unicode{8922}')).toMatchSnapshot();
  });

  it('Unicode Hex', () => {
    expect(tex2mml('\\unicode{0x22DA}')).toMatchSnapshot();
  });

  it('Unicode Dec A', () => {
    expect(tex2mml('\\unicode{65}')).toMatchSnapshot();
  });

  it('Unicode Hex A', () => {
    expect(tex2mml('\\unicode{x41}')).toMatchSnapshot();
  });

  it('Unicode Scale', () => {
    expect(tex2mml('\\unicode[.55,0.05]{x22D6}')).toMatchSnapshot();
  });

  it('Unicode Scale Font', () => {
    expect(tex2mml('\\unicode[.55,0.05][Geramond]{x22D6}')).toMatchSnapshot();
  });

  it('Unicode Font', () => {
    expect(tex2mml('\\unicode[Garamond]{x22D6}')).toMatchSnapshot();
  });

  it('Unicode Combined', () => {
    expect(tex2mml('\\mbox{A}\\unicode{65}{B}')).toMatchSnapshot();
  });

  it('Unicode Surrogate Hex', () => {
    expect(tex2mml('\\unicode{x1D5A0}')).toMatchSnapshot();
  });

  it('Unicode Surrogate Dec', () => {
    expect(tex2mml('\\unicode{120224}')).toMatchSnapshot();
  });

  it('Unicode Blackboard', () => {
    expect(tex2mml('\\unicode{x1D538}')).toMatchSnapshot();
  });

  it('Unicode Blackboard Geramond', () => {
    expect(tex2mml('\\unicode{x1D538}')).toMatchSnapshot();
  });

});

// Here the order is important! As otherwise bold stays.
/**********************************************************************************/

describe('Unicode Complete', () => {

  it('Unicode Caligraphic', () => {
    expect(tex2mml('\\mathtt{\\unicode{8922}}')).toMatchSnapshot();
  });

  it('Unicode Bold', () => {
    expect(tex2mml('\\mathbf{\\unicode[bold]{8922}}')).toMatchSnapshot();
  });

  it('Unicode Italic', () => {
    expect(tex2mml('\\mathit{\\unicode[bold]{8922}}')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Unicode others', () => {

  it('Raw Unicode', () => {
    expect(tex2mml('\\U{892F}')).toMatchSnapshot();
  });

  it('Char numerical', () => {
    expect(tex2mml('\\char\'777')).toMatchSnapshot();
  });

  it('Char alpha', () => {
    expect(tex2mml('\\char`A')).toMatchSnapshot();
  });

  it('Char command number', () => {
    expect(tex2mml('\\char`\\3')).toMatchSnapshot();
  });

  it('Char Yen', () => {
    expect(tex2mml('\\char"A5')).toMatchSnapshot();
  });

  it('Char number', () => {
    expect(tex2mml('\\char55')).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('Unicode Errors', () => {

  it('Unicode BadFont', () => {
    expectTexError('\\unicode[arial;]{8922}')
      .toBe("Font name for \\unicode can't contain semicolons");
  });

  it('Unicode BadUnicode', () => {
    expectTexError('\\unicode{4A}')
      .toBe('Argument to \\unicode must be a number');
  });

  it('Unicode BadRawUnicode', () => {
    expectTexError('\\U{892G}')
      .toBe('Argument to \\U must a hexadecimal number with 1 to 6 digits');
  });

  it('Unicode InvalidAlphanumeric', () => {
    expectTexError('\\char`\\nix')
      .toBe('Invalid alphanumeric constant for \\char');
  });

  it('Unicode MissingNumber', () => {
    expectTexError('\\char {40}')
      .toBe('Missing numeric constant for \\char');
  });

});

/**********************************************************************************/

afterAll(() => getTokens('unicode'));
