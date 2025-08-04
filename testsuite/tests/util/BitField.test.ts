import { describe, test, expect } from '@jest/globals';
import {BitField, BitFieldClass} from '#js/util/BitField.js';

const MAXBIT = (BitField as any).MAXBIT;

const bitClass = BitFieldClass('a', 'b');
bitClass.allocate('c');

describe('BitField object', () => {

  test('Allocating bits', () => {
    expect(bitClass.has('a')).toBe(true);
    expect(bitClass.has('b')).toBe(true);
    expect(bitClass.has('c')).toBe(true);
    expect(() => bitClass.allocate('a')).toThrow('Bit already allocated for a');
    for (let i = 1 << 3; i !== MAXBIT; i = i << 1) {
      bitClass.allocate('x' + i);
    }
    expect(() => bitClass.allocate('y')).toThrow('Maximum number of bits already allocated');
  });

  test('set/clear/isSet/reset', () => {
    const bits = new bitClass();
    //
    //  Bit is initially false
    //
    expect(bits.isSet('a')).toBe(false);
    expect(bits.isSet('b')).toBe(false);
    //
    //  Check that it sets
    //
    bits.set('a');
    expect(bits.isSet('a')).toBe(true);
    expect(bits.isSet('b')).toBe(false);
    //
    //  Check that setting again is still set
    //
    bits.set('a')
    expect(bits.isSet('a')).toBe(true);
    //
    //  Check that it clears
    //
    bits.clear('a');
    expect(bits.isSet('a')).toBe(false);
    //
    //  Check that it stays clear
    //
    bits.clear('a');
    expect(bits.isSet('a')).toBe(false);
    //
    //  Check that reset clears all bits
    //
    bits.set('a');
    bits.set('b');
    expect(bits.isSet('a')).toBe(true);
    expect(bits.isSet('b')).toBe(true);
    bits.reset();
    expect(bits.isSet('a')).toBe(false);
    expect(bits.isSet('b')).toBe(false);
    //
    //  Invalid name throws error
    //
    expect(() => bits.isSet('A')).toThrow('Unknown bit-field name: A');
  });

});
