import { describe, it, expect } from '@jest/globals';
import * as Length from '#js/util/lengths.js';

function convertLengthDim(str: string) {
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
});
