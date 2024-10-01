import { describe, test, expect } from '@jest/globals';
import {LinkedList} from '#js/util/LinkedList.js';

function inReverse(a: number, b: number) {return a > b}

describe('LinkedList functionality', () => {
  test('Empty list is empty array', () => {
    const list = new LinkedList();
    expect(Array.from(list)).toEqual([]);
  });

  test('Adding one item', () => {
    const list = new LinkedList();
    const item = list.push('x');
    expect(Array.from(list)).toEqual(['x']);
    expect(item).toBe(list);
  });

  test('Removing an item from list of 1 item', () => {
    const list = new LinkedList('x');
    const item = list.pop();
    expect(Array.from(list)).toEqual([]);
    expect(item).toBe('x');
  });

  test('Removing from empty list', () => {
    const list = new LinkedList();
    const item1 = list.pop();
    expect(Array.from(list)).toEqual([]);
    expect(item1).toBe(null);
    const item2 = list.shift();
    expect(Array.from(list)).toEqual([]);
    expect(item2).toBe(null);
  });

  test('Removing items', () => {
    expect(Array.from(new LinkedList(1, 2, 3, 4).remove())).toEqual([1, 2, 3, 4]); // remove nothing
    expect(Array.from(new LinkedList(1, 2, 3, 4).remove(1))).toEqual([2, 3, 4]); // at start
    expect(Array.from(new LinkedList(1, 2, 3, 4).remove(4))).toEqual([1, 2, 3]); // at end
    expect(Array.from(new LinkedList(1, 2, 3, 4).remove(2))).toEqual([1, 3, 4]); // in midle
    expect(Array.from(new LinkedList(1, 2, 3, 4).remove(1, 3, 4))).toEqual([2]); // multiple items removed
    expect(Array.from(new LinkedList(1, 2, 3, 4).remove(6))).toEqual([1, 2, 3, 4]); // item not in list
    expect(Array.from(new LinkedList(1, 2, 3, 4).remove(2, 6))).toEqual([1, 3, 4]); // some items not in list
    expect(Array.from(new LinkedList(1, 2, 3, 4).remove(1, 2, 3, 4))).toEqual([]); // all items removed
  });

  test('Adding nothing', () => {
    expect(Array.from(new LinkedList().push())).toEqual([]);
    expect(Array.from(new LinkedList().unshift())).toEqual([]);
    expect(Array.from(new LinkedList(1, 2).push())).toEqual([1, 2]);
    expect(Array.from(new LinkedList(1, 2).unshift())).toEqual([1, 2]);
  });

  test('unshift to empty array', () => {
    const list = new LinkedList();
    expect(Array.from(list.unshift('x'))).toEqual(['x']);
    const item = list.shift();
    expect(Array.from(list)).toEqual([]);
    expect(item).toBe('x');
  });

  test('Pushing several items', () => {
    const list = new LinkedList();
    list.push(2, 3, 4);
    expect(Array.from(list)).toEqual([2, 3, 4]);
    list.push(5, 6);
    expect(Array.from(list)).toEqual([2, 3, 4, 5, 6]);
    const item = list.unshift(0, 1);
    expect(Array.from(list)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(item).toBe(list);
  });

  test('Iterator', () => {
    const list = new LinkedList(0, 1, 2, 3, 4, 5, 6);
    let j = 0;
    for (const item of list) {
      if (item === j) j++; else break;
    }
    expect(j).toBe(7);
  });

  test('Reversed iterator', () => {
    const list = new LinkedList(0, 1, 2, 3, 4, 5, 6);
    let j = 6;
    for (const item of list.reversed()) {
      if (item === j) j--; else break;
    }
    expect(j).toBe(-1);
  });

  test('Removing items by shift', () => {
    const list = new LinkedList(0, 1, 2, 3);
    expect(list.shift()).toBe(0);
    expect(Array.from(list)).toEqual([1, 2, 3]);
    expect(list.pop()).toBe(3);
    expect(Array.from(list)).toEqual([1, 2]);
  });

  test('Clearing of list', () => {
    const list = new LinkedList(1, 2, 3);
    expect(Array.from(list.clear())).toEqual([]);
    expect(list.clear()).toBe(list); // clear() returns list
  });

  test('Sorting of list', () => {
    const list = new LinkedList();
    expect(list.sort()).toBe(list); // sort() returns list
    expect(Array.from(list.sort())).toEqual([]); // empty list
    expect(Array.from(new LinkedList(5, 1, 3, 6, 4, 0, 2).sort())).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(Array.from(new LinkedList(5, 1, 3, 6, 4, 0, 2).sort(inReverse))).toEqual([6, 5, 4, 3, 2, 1, 0]);
  });

  test('Inserting item in sorted list', () => {
    const list = new LinkedList();
    expect(list.insert(3)).toBe(list); // insert() returns list
    expect(Array.from(new LinkedList().insert(3))).toEqual([3]); // with empty list
    expect(Array.from(new LinkedList(5, 3, 4, 1).sort().insert(0))).toEqual([0, 1, 3, 4, 5]); // at start
    expect(Array.from(new LinkedList(5, 3, 4, 1).sort().insert(6))).toEqual([1, 3, 4, 5, 6]); // at end
    expect(Array.from(new LinkedList(5, 3, 4, 1).sort().insert(2))).toEqual([1, 2, 3, 4, 5]); // in middle
  });

  test('Inserting with sort function', () => {
    expect(Array.from(new LinkedList().insert(3, inReverse))).toEqual([3]);  // with empty list
    expect(Array.from(new LinkedList(3, 2, 1).insert(4, inReverse))).toEqual([4, 3, 2, 1]); // at start
    expect(Array.from(new LinkedList(3, 2, 1).insert(0, inReverse))).toEqual([3, 2, 1, 0]); // at end
    expect(Array.from(new LinkedList(4, 3, 1).insert(2, inReverse))).toEqual([4, 3, 2, 1]); // in middle
  });

  test('Merging of lists', () => {
    const list = new LinkedList(1, 3);
    expect(list.merge(new LinkedList(2, 4))).toBe(list);  // merge() return list
    expect(Array.from(new LinkedList().merge(new LinkedList()))).toEqual([]); // with two empty lists
    expect(Array.from(new LinkedList().merge(new LinkedList(1, 3, 5)))).toEqual([1, 3, 5]); // with 1st list empty
    expect(Array.from(new LinkedList(1, 3, 5).merge(new LinkedList()))).toEqual([1, 3, 5]); // with 2nd list empty
    expect(Array.from(new LinkedList(1, 3, 4, 7, 8, 9).merge(new LinkedList(2, 5, 6, 10, 11))))
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]); // intermized lists
    expect(Array.from(new LinkedList(1, 3, 4).merge(new LinkedList(1, 2, 4, 5))))
      .toEqual([1, 1, 2, 3, 4, 4, 5]); // merge with repeats
    expect(Array.from(new LinkedList(1, 2, 3, 4).merge(new LinkedList(5, 6, 7, 8))))
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8]); // at end
    expect(Array.from(new LinkedList(5, 6, 7, 8).merge(new LinkedList(1, 2, 3, 4))))
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8]); // at start
    expect(Array.from(new LinkedList(1, 2, 7, 8).merge(new LinkedList(3, 4, 5, 6))))
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8]); // in the middle
    expect(Array.from(new LinkedList(9, 8, 7, 4, 3, 1).merge(new LinkedList(11, 10, 6, 5, 2, 0), inReverse)))
      .toEqual([11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]); // with sort function
  });

});
