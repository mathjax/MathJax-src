import { describe, it, expect } from '@jest/globals';
import * as Length from '#js/util/lengths.js';

function convertLengthDim(str: string | number) {
  return Length.length2em(str);
}

describe('Dimension conversion from length', () => {
  it('9', () => expect(convertLengthDim('9')).toBe(0));
  it('9nix', () => expect(convertLengthDim('9nix')).toBe(0));
  it('empty', () => expect(convertLengthDim('')).toBe(0));
  it('nix', () => expect(convertLengthDim('nix')).toBe(0));
  it('9em', () => expect(convertLengthDim('9em')).toBe(9));
  it('9ex', () => expect(convertLengthDim('9ex')).toBe(3.879));
  it('9pt', () => expect(convertLengthDim('9pt')).toBe(0.9));
  it('9pc', () => expect(convertLengthDim('9pc')).toBe(10.799999999999999));
  it('9px', () => expect(convertLengthDim('9px')).toBe(0.5625));
  it('9in', () => expect(convertLengthDim('9in')).toBe(54));
  it('9cm', () => expect(convertLengthDim('9cm')).toBe(21.259842519685037));
  it('9mm', () => expect(convertLengthDim('9mm')).toBe(2.125984251968504));
  it('9mu', () => expect(convertLengthDim('9mu')).toBe(0.5));
  it('9%', () => expect(convertLengthDim('9%')).toBe(0));
  it('number 9', () => expect(convertLengthDim(9)).toBe(0));
  it('thinmathspace', () => expect(convertLengthDim('thinmathspace')).toBe(3/18));
  it('em', () => expect(convertLengthDim('em')).toBe(1));
});

describe('Dimension conversion with default', () => {
  it('9', () => expect(Length.length2em('9', 100)).toBe(900));
  it('empty', () => expect(Length.length2em('', 100)).toBe(100));
  it('nix', () => expect(Length.length2em('nix', 100)).toBe(100));
  it('9nix', () => expect(Length.length2em('9nix', 100)).toBe(900));
  it('9%', () => expect(Length.length2em('9%', 100)).toBe(9));
  it('number 9', () => expect(Length.length2em(9, 100)).toBe(900));
});

describe('Dimension conversion with scale', () => {
  it('9px', () => expect(Length.length2em('9px', 0, 2)).toBe(0.5625 / 2));
  it('9in', () => expect(Length.length2em('9in', 0, 2)).toBe(54 / 2));
  it('9cm', () => expect(Length.length2em('9cm', 0, 2)).toBe(21.259842519685037 / 2));
  it('9mm', () => expect(Length.length2em('9mm', 0, 2)).toBe(2.125984251968504 / 2));
});

describe('Dimension conversion with scale', () => {
  it('9px', () => expect(Length.length2em('9px', 0, 1, 8)).toBe(0.5625 * 2));
  it('9in', () => expect(Length.length2em('9in', 0, 1, 8)).toBe(54 * 2));
  it('9cm', () => expect(Length.length2em('9cm', 0, 1, 8)).toBe(21.259842519685037 * 2));
  it('9mm', () => expect(Length.length2em('9mm', 0, 1, 8)).toBe(2.125984251968504 * 2));
});

describe('percent()', () => {
  it('.75', () => expect(Length.percent(.75)).toBe('75%'));
  it('1.75', () => expect(Length.percent(1.75)).toBe('175%'));
  it('.754321', () => expect(Length.percent(.754321)).toBe('75.4%'));
  it('1.754321', () => expect(Length.percent(1.754321)).toBe('175.4%'));
  it('1', () => expect(Length.percent(1)).toBe('100%'));
});

describe('em()', () => {
  it('.75', () => expect(Length.em(.75)).toBe('0.75em'));
  it('1.75', () => expect(Length.em(1.75)).toBe('1.75em'));
  it('.754321', () => expect(Length.em(.754321)).toBe('0.754em'));
  it('1.754321', () => expect(Length.em(1.754321)).toBe('1.754em'));
  it('1', () => expect(Length.em(1)).toBe('1em'));
  it('0', () => expect(Length.em(0)).toBe('0'));
  it('0.0001', () => expect(Length.em(0.0001)).toBe('0'));
});

describe('px()', () => {
  it('.75', () => expect(Length.px(.75)).toBe('12px'));
  it('1.75', () => expect(Length.px(1.75)).toBe('28px'));
  it('.754321', () => expect(Length.px(.754321)).toBe('12.1px'));
  it('1.754321', () => expect(Length.px(1.754321)).toBe('28.1px'));
  it('1', () => expect(Length.px(1)).toBe('16px'));
  it('0', () => expect(Length.px(0)).toBe('0'));
  it('0.001', () => expect(Length.px(0.001)).toBe('0'));
  it('min=1', () => expect(Length.px(0.001, 1)).toBe('1px'));
  it('em=8', () => expect(Length.px(1, 1, 8)).toBe('8px'));
});
