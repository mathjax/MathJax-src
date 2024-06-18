import { describe, test, expect } from '@jest/globals';
import {PrioritizedList} from '#js/util/PrioritizedList.js';

//
//  Turn the item list into a list of just that data
//
function ARRAY(list: PrioritizedList<any>) {
  let array = [];
  for (const {item} of list) array.push(item);
  return array;
}

describe('PrioritizedList functionality', () => {
  test('Empty list is empty array', () => {
    expect(ARRAY(new PrioritizedList())).toEqual([]);
  });

  test('Adding one item', () => {
    const list = new PrioritizedList();
    const item = list.add(0);
    expect(Array.from(list)).toHaveLength(1);
    expect(Array.from(list)).toEqual([{item: 0, priority: 5}]);
    expect(item).toBe(0);
  });

  test('Removing one item', () => {
    const list = new PrioritizedList();
    list.add(0);
    const item = list.remove(0);
    expect(Array.from(list)).toEqual([]);
    expect(item).toBe(list);
  });

  test('Sorting of list', () => {
    const list = new PrioritizedList();
    for (const i of [5, 0, 2, 1, 6, 3, 4]) {list.add(i, i)}
    expect(ARRAY(list)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  test('Iterator', () => {
    const list = new PrioritizedList();
    for (const i of [5, 0, 2, 1, 6, 3, 4]) {list.add(i, i)}
    let j = 0;
    for (const item of list) {
      if (item.item === j) j++; else break;
    }
    expect(j).toBe(7);
  });

  test('Removing from longer list', () => {
    const list = new PrioritizedList();
    for (const i of [5, 0, 2, 1, 6, 3, 4]) {list.add(i, i)}
    list.remove(3); // remove from middle
    expect(ARRAY(list)).toEqual([0, 1, 2, 4, 5, 6]);
    list.remove(0); // remove first
    expect(ARRAY(list)).toEqual([1, 2, 4, 5, 6]);
    list.remove(6); // remove last
    expect(ARRAY(list)).toEqual([1, 2, 4, 5]);
  });

  test('Adding with same priority', () => {
    const list = new PrioritizedList();
    list.add(3);
    list.add(1,1);
    list.add(4);
    list.add(2,1);
    expect(ARRAY(list)).toEqual([1, 2, 3, 4]);
  });

});
