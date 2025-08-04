import { describe, test, expect } from '@jest/globals';
import * as Options from '#js/util/Options.js';

const SYMB = Symbol('symbol');
const OPTIONS = Options.OPTIONS
const optionError = OPTIONS.optionError;

describe('Options utility', () => {

  test('keys()', () => {
    expect(Options.keys({a: 1, [Symbol.iterator]: 2})).toEqual(['a', Symbol.iterator]);
    expect(Options.keys(null)).toEqual([]);
    expect(Options.keys({})).toEqual([]);
  });

  test('copy()', () => {
    //
    // Copy() copies deeply
    //
    const orig: any = {
      a: 1,
      b: {x: 'x'},
      c: {y: 'y'},
      d: [1, {z: 'z'}, {w: 'w'}],
      e: [1],
      [SYMB]: 1
    };
    let copy = Options.copy(orig);
    expect(copy).toEqual(orig);

    //
    //  Changing original doesn't change copy
    //
    orig.a = 2;
    orig.b.x = 'xx';
    orig.c = {yy: 'yy'};
    orig.d[0] = 2;
    orig.d[1].z = 'zz';
    orig.d[2] = {ww: 'ww'};
    orig.e = [2];
    orig.f = 2;
    orig[SYMB] = 2;
    expect(copy).toEqual({
      a: 1,
      b: {x: 'x'},
      c: {y: 'y'},
      d: [1, {z: 'z'}, {w: 'w'}],
      e: [1],
      [SYMB]: 1
    });

    //
    //  Copy() copies symbols
    //
    expect((copy as any)[SYMB]).toBe(1);

    //
    //  Copy() copies getter and setter
    //
    copy = Options.copy({
      _a: 1,
      get a() {return this._a},
      set a(x) {this._a = x}
    });
    expect(copy.a).toBe(1);
    copy.a = 2;
    expect(copy._a).toBe(2);

    //
    //  Copy() handle empty objects
    //
    expect(Options.copy({})).toEqual({});
  });

  test('insert()', () => {
    let warnings = [] as string[];
    OPTIONS.optionError = (_msg: string, key: string) => {warnings.push(key)};

    const options = {a: 1, b: {x: 'x', y: [0]}, c: [1, 2, 3]};
    let copy = Options.insert({}, options, false);
    expect(copy).toEqual(options);
    expect(warnings).toEqual([]);

    //
    //  Error on unknown keys
    //
    copy = Options.insert({}, options);
    expect(copy).toEqual({});
    expect(warnings).toEqual(['a', 'b', 'c']);  // invalid keys
    warnings = [];
    copy = Options.insert({a: 2, b: {}, c: [4]}, options, true);
    expect(copy).toEqual({a: 1, b: {}, c: [1, 2, 3]});
    expect(warnings).toEqual(['x', 'y']);  // invalid keys
    warnings = [];
    copy = Options.insert({}, {[SYMB]: 1});
    expect(copy).toEqual({});
    expect(warnings).toEqual(['Symbol(symbol)']);
    warnings = [];

    //
    //  insert() adds to objects and replaces other values
    //
    copy = Options.insert({a: 2, b: {}, c: [4]}, options, false);
    expect(copy).toEqual(options);

    //
    //  insert() merges objects
    //
    copy = Options.insert({a: {}, b: 2}, {a: {x: 'x'}}, false);
    expect(copy).toEqual({a: {x: 'x'}, b: 2});

    //
    //  insert() merges into functions
    //
    copy = Options.insert({a: function () {}}, {a: {x: 'x'}}, false);
    expect(copy.a.x).toBe('x');

    //
    //  insert() changes object type
    //
    copy = Options.insert({a: {x: 'x'}}, {a: 1}, false);
    expect(copy).toEqual({a: 1});

    //
    //  insert() replaces arrays
    //
    copy = Options.insert({a: [1, 2]}, {a: [3, 4]}, false);
    expect(copy).toEqual({a: [3, 4]});

    //
    //  insert() appends to arrays with APPEND key
    //
    copy = Options.insert({a: [1, 2]}, {a: {[Options.APPEND]:[3, 4]}}, false);
    expect(copy).toEqual({a: [1, 2, 3, 4]});

    //
    //  insert() removes from arrays with REMOVE key
    //
    copy = Options.insert({a: [1, 2, 3, 4]}, {a: {[Options.REMOVE]:[1, 3]}}, false);
    expect(copy).toEqual({a: [2, 4]});

    //
    //  insert() adds and removes from arrays
    //
    copy = Options.insert({a: [1, 2, 3, 4]}, {a: {[Options.REMOVE]:[1, 3], [Options.APPEND]: [3, 5]}}, false);
    expect(copy).toEqual({a: [2, 4, 3, 5]});

    //
    //  insert() handles empty objects
    //
    copy = Options.insert({a: 1}, {});
    expect(copy).toEqual({a: 1});
    expect(warnings).toEqual([]);

    OPTIONS.optionError = optionError;
  });

  test('expandable()', () => {
    let warnings = [] as string[];
    OPTIONS.optionError = (_msg: string, key: string) => {warnings.push(key)};

    //
    //  No error for unknonw keys in expandables
    //
    const options = {a: Options.expandable({x: 1})};
    let copy = Options.userOptions(options, {a: {y: 2}});
    expect(copy).toEqual({a: {x: 1, y: 2}});
    expect(warnings).toEqual([]);

    OPTIONS.optionError = optionError;

    //
    //  Expandable copies as expandable
    //
    copy = Options.copy(Options.expandable({x: 1}));
    expect(copy instanceof Options.Expandable).toBe(true);
    expect(copy).toEqual({x:1});
  });

  test('defaultOptions()', () => {
    let warnings = 0;
    OPTIONS.optionError = () => {warnings++};

    const copy = Options.defaultOptions({}, {a: 1}, {b: 2});
    expect(copy).toEqual({a: 1, b: 2});
    expect(warnings).toBe(0);

    OPTIONS.optionError = optionError;
  });

  test('userOptions()', () => {
    let warnings = [] as string[];
    OPTIONS.optionError = (_msg: string, key: string) => {warnings.push(key)};

    //
    // userOptions() warns about invalid options
    //
    let copy = Options.userOptions({}, {a: 1}, {b: 2});
    expect(copy).toEqual({});
    expect(warnings).toEqual(['a', 'b']);
    warnings = [];

    //
    // userOptions() warns about invalid secondary options
    //
    copy = Options.userOptions({a: 'x'}, {a: 1}, {b: 2});
    expect(copy).toEqual({a: 1});
    expect(warnings).toEqual(['b']);
    warnings = [];

    //
    // userOptions() merges multiple options
    //
    copy = Options.userOptions({a: 'x', b: 'y'}, {a: 1}, {b: 2});
    expect(copy).toEqual({a: 1, b: 2});
    expect(warnings).toEqual([]);

    OPTIONS.optionError = optionError;
  });

  test('selectOptions()', () => {
    //
    //  selectOptions() finds existing keys and skips others
    //
    const options = {a: 1, b: 2, c: 3, d: 4};
    let copy = Options.selectOptions(options, 'a', 'c', 'x', 'y');
    expect(copy).toEqual({a: 1, c: 3});

    //
    //  selectOptions() handles empty list
    //
    copy = Options.selectOptions({}, 'x', 'y');
    expect(copy).toEqual({});

    //
    //  selectOptions() handles empty list of keys
    //
    copy = Options.selectOptions(options);
    expect(copy).toEqual({});
  });

  test('selectOptionsFromKeys()', () => {
    //
    //  selectOptionsFromKeys() finds existing keys and skips others
    //
    const options = {a: 1, b: 2, c: 3, d: 4};
    let copy = Options.selectOptionsFromKeys(options, {a: true, c: true, x: true, y: true});
    expect(copy).toEqual({a: 1, c: 3});
    //
    //  selectOptionsFromKeys() handles empty source list
    //
    copy = Options.selectOptionsFromKeys({}, options);
    expect(copy).toEqual({});
    //
    //  selectOptionsFromKeys() handles empty key list;
    //
    copy = Options.selectOptionsFromKeys(options, {});
    expect(copy).toEqual({});
  });

  test('separateOptions()', () => {
    //
    //  separateOptions() works with one set
    //
    const options = {a: 1, b: 2, c: 3, d: 4, e: 5};
    let result = Options.separateOptions(options, {a: true, c: true});
    expect(result).toEqual([{b: 2, d: 4, e: 5}, {a: 1, c: 3}]);

    //
    //  separateOptions() works with two sets
    //
    result = Options.separateOptions(options, {a: true, c: true}, {d: true});
    expect(result).toEqual([{b: 2, e: 5}, {a: 1, c: 3}, {d: 4}]);

    //
    //  separateOptions() works with no sets
    //
    result = Options.separateOptions(options);
    expect(result).toEqual([options]);

    //
    //  separateOptions() works with unknown keys
    //
    result = Options.separateOptions(options, {a: true, c: true, x: true});
    expect(result).toEqual([{b: 2, d: 4, e: 5}, {a: 1, c: 3}]);

    //
    //  separateOptions() works with empty options
    //
    result = Options.separateOptions({}, {a: true});
    expect(result).toEqual([{}, {}]);

    //
    //  separateOptions() works with no options
    //
    result = Options.separateOptions(null, {a: true});
    expect(result).toEqual([{}, {}]);
  });

  test('OPTIONS settings', () => {
    let copy: Options.OptionList;

    //
    //  Fatal throws an error
    //
    OPTIONS.invalidOption = 'fatal';
    try {
      copy = Options.userOptions({}, {a: 1});
    } catch(err) {
      expect(err.message).toBe('Invalid option "a" (no default value).');
    }
    expect(copy).toEqual(undefined);

    //
    //  Warn does not throw an error
    //
    const warn = console.warn;
    console.warn = () => {}
    OPTIONS.invalidOption = 'warn';
    try {
      copy = Options.userOptions({}, {a: 1});
    } catch(err) {}
    expect(copy).toEqual({});
    console.warn = warn;

  });

  test('makeArray()', () => {
    expect(Options.makeArray([1, 2])).toEqual([1, 2]);
    expect(Options.makeArray(1)).toEqual([1]);
  });

  test('lookup()', () => {
    const options = {a: 1, b: 'x'};
    expect(Options.lookup('a', options)).toBe(1);
    expect(Options.lookup('c', options, 'default')).toBe('default');
    expect(Options.lookup('c', options)).toBe(null);
  });

});
