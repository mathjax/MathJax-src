import { describe, test, expect } from '@jest/globals';
import {FunctionList, AnyFunction} from '#js/util/FunctionList.js';

//
//  Set up a function list with 6 functions that captures output
//
function LIST(): [FunctionList, string[]] {
  const output = [] as string[];
  const list = new FunctionList();
  for (const i of [5, 0, 2, 1, 6, 3, 4]) {list.add(FN(i, output), i)}
  return [list, output];
}

//
//  A function that buffers the value of its parameters plus i
//    unless the parameter is false or fail, which do special actions,
//    or if the second is 'p', when we return a promise with a delay.
//
function FN(i: number, output: string[] = []) {
  return function (x?: string, y?: string) {
    if (x === 'false' && i === 3) return false;
    if (x === 'fail' && i === 3) throw new Error('fail');
    output.push(x === undefined ? String(i) : y == null ? x + i : x + y + i);
    if (x === 'delay' && i === 3) {
      return new Promise<void>((ok, fail) => {
        setTimeout(() => {y === 'fail' ? fail('Failed!') : ok()}, 10);
      });
    }
    return true;
  };
}

describe('FunctionList functionality', () => {
  test('Empty list is empty array', () => {
    expect(Array.from(new FunctionList())).toEqual([]);
  });

  test('Adding one item', () => {
    const list = new FunctionList();
    const fn = FN(0);
    const item = list.add(fn);
    expect(Array.from(list)).toEqual([{item: item, priority: 5}]);
    expect(item).toBe(fn);
  });

  test('Adding a list of items', () => {
    const fns = [(_: any) => {}, [(_: any) => {}, 1]] as [AnyFunction, [AnyFunction, number]];
    const list = new FunctionList(fns);
    expect(Array.from(list)).toEqual([
      {item: fns[1][0], priority: 1},
      {item: fns[0], priority: 5},
    ]);
  });

  test('Removing one item', () => {
    const list = new FunctionList();
    const fn = list.add(FN(0));
    const item = list.remove(fn);
    expect(Array.from(list)).toEqual([]);
    expect(item).toBe(list);
  });

  test('Executing list', () => {
    const output = [] as string[];
    const list = new FunctionList();
    list.add(FN(0, output));
    expect(list.execute()).toBe(true);
    expect(output).toEqual(["0"]);
  });

  test('Sorting of list', () => {
    const [list, output] = LIST();
    expect(list.execute()).toBe(true);
    expect(output).toEqual(['0', '1', '2', '3', '4', '5', '6']);
  });

  test('Passing one parameter', () => {
    const [list, output] = LIST();
    expect(list.execute('x')).toBe(true);
    expect(output).toEqual(['x0', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6']);
  });

  test('Passing multiple parameters', () => {
    const [list, output] = LIST();
    expect(list.execute('x', 'y')).toBe(true);
    expect(output).toEqual(['xy0', 'xy1', 'xy2', 'xy3', 'xy4', 'xy5', 'xy6']);
  });

  test('Function returning false', () => {
    const [list, output] = LIST();
    expect(list.execute('false')).toBe(false);
    expect(output).toEqual(['false0', 'false1', 'false2']);
  });

  test('asyncExecute() returns promise', () => {
    const list = new FunctionList();
    expect(list.asyncExecute() instanceof Promise).toBe(true);
  });

  test('asyncExecute() runs', () => {
    const [list, output] = LIST();
    list.asyncExecute().then((result: boolean) => {
      expect(result).toBe(true);
      expect(output).toEqual(['0', '1', '2', '3', '4', '5', '6']);
    });
  });

  test('Passing parameter to asyncExecute()', () => {
    const [list, output] = LIST();
    list.asyncExecute('x').then((result: boolean) => {
      expect(result).toBe(true);
      expect(output).toEqual(['x0', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6']);
    });
  });

  test('Passing multiple parameters to asyncExecute()', () => {
    const [list, output] = LIST();
    list.asyncExecute('x', 'y').then((result: boolean) => {
      expect(result).toBe(true);
      expect(output).toEqual(['xy0', 'xy1', 'xy2', 'xy3', 'xy4', 'xy5', 'xy6']);
    });
  });

  test('Function returning false in asyncExecute()', () => {
    const [list, output] = LIST();
    list.asyncExecute('false').then((result: boolean) => {
      expect(result).toBe(false);
      expect(output).toEqual(['false0', 'false1', 'false2']);
    });
  });

  test('Function error in asyncExecute()', () => {
    const [list, output] = LIST();
    expect.assertions(2);
    list.asyncExecute('fail').catch((err: Error) => {
      expect(output).toEqual(['fail0', 'fail1', 'fail2']);
      expect(err.message).toBe("fail");
    });
  });

  test('Delay in asyncExecute()', () => {
    const [list, output] = LIST();
    list.asyncExecute('delay', '').then((result: boolean) => {
      expect(result).toBe(true);
      expect(output).toEqual(['delay0', 'delay1', 'delay2', 'delay3', 'delay4', 'delay5', 'delay6']);
    });
  });

  test('Failed promise in asyncExecute()', () => {
    const [list, output] = LIST();
    list.asyncExecute('delay', 'fail').catch((result: string) => {
      expect(output).toEqual(['delayfail0', 'delayfail1', 'delayfail2', 'delayfail3']);
      expect(result).toBe("Failed!");
    });
  });

});
