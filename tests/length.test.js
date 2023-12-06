import {jest} from '@jest/globals';
import {ParseUtil} from '../mjs/input/tex/ParseUtil.js';
import * as Length from '../mjs/util/lengths.js';

// These methods will be rewritten into non-ParseUtil ones.
function convertLength(unit, num) {
  return ParseUtil.UNIT_CASES.get(unit) * (num);
}

function matchDimension(str) {
  return ParseUtil.matchDimen(str);
}

function convertDimension(str) {
  return ParseUtil.dimen2em(str);
}

function convertLengthDim(str) {
  return Length.length2em(str);
}

function convertEm(num) {
  return ParseUtil.em(num);
}

describe('Length conversion', () => {
  it('em', () => expect(convertLength('em', 9)).toBe(9));
  it('ex', () => expect(convertLength('ex', 9)).toBe(3.87));
  it('pt', () => expect(convertLength('pt', 9)).toBe(0.9));
  it('pc', () => expect(convertLength('pc', 9)).toBe(10.799999999999999));
  it('px', () => expect(convertLength('px', 9)).toBe(0.9));
  it('in', () => expect(convertLength('in', 9)).toBe(64.8));
  it('cm', () => expect(convertLength('cm', 9)).toBe(25.511811023622045));
  it('mm', () => expect(convertLength('mm', 9)).toBe(2.5511811023622046));
  it('mu', () => expect(convertLength('mu', 9)).toBe(0.5));
  // Note that we have to pass a function here.
  // it('nix', () => expect(() => convertLength('nix', 9)).toThrow(TypeError));
  it('nix', () => expect(convertLength('nix', 9)).toBe(0.9));
});

describe('Em conversion', () => {
  it('9', () => expect(convertEm(9)).toBe('9em'));
  it('10', () => expect(convertEm(10)).toBe('10em'));
  it('1e+25', () => expect(convertEm(1e+25)).toBe('1e+25em'));
  it('10000', () => expect(convertEm(10000)).toBe('10000em'));
  it('0.001', () => expect(convertEm(0.001)).toBe('0.001em'));
  it('0.0001', () => expect(convertEm(0.0001)).toBe('0em'));
  it('0.0005', () => expect(convertEm(0.0005)).toBe('0em'));
  it('0.0006', () => expect(convertEm(0.0006)).toBe('0.001em'));
  it('0.0007', () => expect(convertEm(0.0007)).toBe('0.001em'));
  it('25.511811023622045', () => expect(convertEm(25.511811023622045)).toBe('25.512em'));
});

describe('Dimension matching', () => {
  it('9', () => expect(matchDimension('9')).toEqual([null, null, 0]));
  it('10', () => expect(matchDimension('10')).toEqual([null, null, 0]));
  it('9nix', () => expect(matchDimension('9nix')).toEqual([null, null, 0]));
  it('10nix', () => expect(matchDimension('10nix')).toEqual([null, null, 0]));
  it('empty', () => expect(matchDimension('')).toEqual([null, null, 0]));
  it('nix', () => expect(matchDimension('nix')).toEqual([null, null, 0]));
  it('9em', () => expect(matchDimension('9em')).toEqual(['9', 'em', 3]));
  it('10em', () => expect(matchDimension('10em')).toEqual(['10', 'em', 4]));
  it('9ex', () => expect(matchDimension('9ex')).toEqual(['9', 'ex', 3]));
  it('10ex', () => expect(matchDimension('10ex')).toEqual(['10', 'ex', 4]));
  it('9pt', () => expect(matchDimension('9pt')).toEqual(['9', 'pt', 3]));
  it('10pt', () => expect(matchDimension('10pt')).toEqual(['10', 'pt', 4]));
  it('9pc', () => expect(matchDimension('9pc')).toEqual(['9', 'pc', 3]));
  it('10pc', () => expect(matchDimension('10pc')).toEqual(['10', 'pc', 4]));
  it('9px', () => expect(matchDimension('9px')).toEqual(['9', 'px', 3]));
  it('10px', () => expect(matchDimension('10px')).toEqual(['10', 'px', 4]));
  it('9in', () => expect(matchDimension('9in')).toEqual(['9', 'in', 3]));
  it('10in', () => expect(matchDimension('10in')).toEqual(['10', 'in', 4]));
  it('9cm', () => expect(matchDimension('9cm')).toEqual(['9', 'cm', 3]));
  it('10cm', () => expect(matchDimension('10cm')).toEqual(['10', 'cm', 4]));
  it('9mm', () => expect(matchDimension('9mm')).toEqual(['9', 'mm', 3]));
  it('10mm', () => expect(matchDimension('10mm')).toEqual(['10', 'mm', 4]));
  it('9mu', () => expect(matchDimension('9mu')).toEqual(['0.5', 'em', 3]));
  it('10mu', () => expect(matchDimension('10mu')).toEqual(['0.556', 'em', 4]));
});

describe('Dimension conversion', () => {
  it('9', () => expect(convertDimension('9')).toBe(0.1));
  it('9nix', () => expect(convertDimension('9nix')).toBe(0.1));
  it('empty', () => expect(convertDimension('')).toBe(0.1));
  it('nix', () => expect(convertDimension('nix')).toBe(0.1));
  it('9em', () => expect(convertDimension('9em')).toBe(9));
  it('9ex', () => expect(convertDimension('9ex')).toBe(3.87));
  it('9pt', () => expect(convertDimension('9pt')).toBe(0.9));
  it('9pc', () => expect(convertDimension('9pc')).toBe(10.799999999999999));
  it('9px', () => expect(convertDimension('9px')).toBe(0.9));
  it('9in', () => expect(convertDimension('9in')).toBe(64.8));
  it('9cm', () => expect(convertDimension('9cm')).toBe(25.511811023622045));
  it('9mm', () => expect(convertDimension('9mm')).toBe(2.5511811023622046));
  it('9mu', () => expect(convertDimension('9mu')).toBe(0.5));
});


describe.skip('Dimension conversion from length', () => {
  it('9', () => expect(convertLengthDim('9')).toBe(0));
  it('9nix', () => expect(convertLengthDim('9nix')).toBe(0));
  it('empty', () => expect(convertLengthDim('')).toBe(0));
  it('nix', () => expect(convertLengthDim('nix')).toBe(0));
  it('9em', () => expect(convertLengthDim('9em')).toBe(9));
  it('9ex', () => expect(convertLengthDim('9ex')).toBe(3.87));
  it('9pt', () => expect(convertLengthDim('9pt')).toBe(0.9));
  it('9pc', () => expect(convertLengthDim('9pc')).toBe(10.799999999999999));
  it('9px', () => expect(convertLengthDim('9px')).toBe(0.8999999999999999));
  it('9in', () => expect(convertLengthDim('9in')).toBe(64.8));
  it('9cm', () => expect(convertLengthDim('9cm')).toBe(25.511811023622045));
  it('9mm', () => expect(convertLengthDim('9mm')).toBe(2.5511811023622046));
  it('9mu', () => expect(convertLengthDim('9mu')).toBe(0.5));
});

describe.skip('Dimension conversion comparison', () => {
  it('1em', () => expect(convertDimension('1em')).toBe(convertLengthDim('1em')));
  it('1ex', () => expect(convertDimension('1ex')).toBe(convertLengthDim('1ex')));
  it('1pt', () => expect(convertDimension('1pt')).toBe(convertLengthDim('1pt')));
  it('1pc', () => expect(convertDimension('1pc')).toBe(convertLengthDim('1pc')));
  it('1px', () => expect(convertDimension('1px')).toBe(convertLengthDim('1px')));
  it('1in', () => expect(convertDimension('1in')).toBe(convertLengthDim('1in')));
  it('1cm', () => expect(convertDimension('1cm')).toBe(convertLengthDim('1cm')));
  it('1mm', () => expect(convertDimension('1mm')).toBe(convertLengthDim('1mm')));
  it('1mu', () => expect(convertDimension('1mu')).toBe(convertLengthDim('1mu')));
});

// Useful for the IEEE case.
describe('Adds pi unit', () => {
  beforeAll(() => ParseUtil.UNIT_CASES.set('pi', 1 / 10));
  it('pi', () => expect(convertLength('pi', 9)).toBe(0.9));
  it('9pi', () => expect(matchDimension('9pi')).toEqual(['9', 'pi', 3]));
  it('10pi', () => expect(matchDimension('10pi')).toEqual(['10', 'pi', 4]));
  it('9pi', () => expect(convertDimension('9pi')).toBe(0.9));
});
