let test = require('tape');

let LinkedList = require("../../../../mathjax3/util/LinkedList.js").LinkedList;

/****************************************************************************/

function inReverse(a,b) {return a > b};

/****************************************************************************/

test("LinkededList", t => {
  let list = new LinkedList();
  
  //
  // Check empty list
  //
  t.deepEqual(list.toArray(),[],"Empty list produces empty array");
  
  //
  // Check adding one item
  //
  let item = list.push('x');
  t.equal(list.toArray().length, 1, "One item added OK");
  t.equal(list.toArray()[0], 'x', ". Item value OK");
  t.equal(item, list, ". Returned list OK");
  
  //
  // Check removing an item from list of 1 item
  //
  item = list.pop();
  t.equal(list.toArray().length, 0, "Item removed OK");
  t.equal(item, 'x', ". Returned item OK");
  
  //
  // Check removing from empty list
  //
  item = list.pop();
  t.deepEqual([list.toArray(), item], [[],null], "pop() on empty list OK");
  item = list.shift();
  t.deepEqual([list.toArray(), item], [[],null], "shift() on empty list OK");
  
  //
  // Check adding nothing
  //
  list.push();
  t.equal(list.toArray().length, 0, "Empty push() is OK");
  list.unshift();
  t.equal(list.toArray().length, 0, "Empty unshift() is OK");
  
  //
  // unshift to emtpy array
  //
  item = list.unshift('x');
  t.deepEqual([list.toArray(),item], [['x'],list], "unshift() on empty list works");
  item = list.shift();
  t.deepEqual([list.toArray(),item], [[],'x'], "shift() on list of one item works");
  

  //
  // Check pushing several items
  //
  list.push(2,3,4);
  t.deepEqual(list.toArray(), [2,3,4], "Pushing multiple items OK");
  list.push(5,6);
  t.deepEqual(list.toArray(), [2,3,4,5,6], "Pushing to the end is OK");
  item = list.unshift(0,1);
  t.deepEqual(list.toArray(), [0,1,2,3,4,5,6], "Pushing to the front is OK");
  t.equal(item, list, ". Returned list is OK");
  
  //
  // Check iterator
  //
  let j = 0;
  for (const item of list) {
    if (item === j) j++; else break;
  }
  t.equal(j,7, "Iterator works");
  
  //
  // Check reversed iterator
  //
  j = 6;
  for (const item of list.reversed()) {
    if (item === j) j--; else break;
  }
  t.equal(j,-1, "Reversed iterator works");
    
  //
  // Removing items by shift;
  //
  item = list.shift();
  t.deepEqual([list.toArray(), item], [[1,2,3,4,5,6], 0], "Item removed by shift()");
  item = list.pop();
  t.deepEqual([list.toArray(), item], [[1,2,3,4,5], 6], "Item removed by pop()");
  
  //
  // Check clearing of list
  //
  item = list.clear();
  t.deepEqual([list.toArray().length, item], [0, list], "clear() works.");
  
  //
  // Check sorting of list
  //
  item = list.sort();
  t.deepEqual([list.toArray(),item], [[],list], "sort() of empty list works");
  item = list.push(5,1,3,6,4,0,2).sort();
  t.deepEqual(list.toArray(), [0,1,2,3,4,5,6], "sort() of list works");
  list.sort(inReverse);
  t.deepEqual(list.toArray(), [6,5,4,3,2,1,0], "sort() accepts sorting function");

  //
  // Check inserting item in sorted list
  //
  list.clear();
  item = list.insert(3);
  t.deepEqual(list.toArray(), [3], "insert() on empty list works");
  list.push(5,4,1).sort();
  list.insert(0);
  t.deepEqual(list.toArray(), [0,1,3,4,5], "insert() at beginning works");
  list.insert(6);
  t.deepEqual(list.toArray(), [0,1,3,4,5,6], "insert() at end works");
  list.insert(2);
  t.deepEqual(list.toArray(), [0,1,2,3,4,5,6], "insert() in middle works");
  
  //
  // Check inserting with sort function
  //
  list.clear().push(5,4,3,1);
  list.insert(6,inReverse);
  t.deepEqual(list.toArray(), [6,5,4,3,1], "insert() at beginning works with sort function");
  list.insert(0,inReverse);
  t.deepEqual(list.toArray(), [6,5,4,3,1,0], "insert() at end works with sort function");
  list.insert(2,inReverse);
  t.deepEqual(list.toArray(), [6,5,4,3,2,1,0], "insert() in middle works with sort function");
  
  //
  // Check merging of lists
  //
  list.clear().push(1,3,4,7,8,9);
  item = list.merge(new LinkedList(0,2,5,6,10,11));
  t.deepEqual([list.toArray(),item], [[0,1,2,3,4,5,6,7,8,9,10,11],list], "merge() works intermixed");
  list.clear().push(1,2,3,4).merge(new LinkedList(5,6,7,8));
  t.deepEqual(list.toArray(), [1,2,3,4,5,6,7,8], "merge() works at end");
  list.clear().push(5,6,7,8).merge(new LinkedList(1,2,3,4));
  t.deepEqual(list.toArray(), [1,2,3,4,5,6,7,8], "merge() works at beginning");
  list.clear().push(1,2,7,8).merge(new LinkedList(3,4,5,6));
  t.deepEqual(list.toArray(), [1,2,3,4,5,6,7,8], "merge() works at in the middle");
  list.clear().push(9,8,7,4,3,1).merge(new LinkedList(11,10,6,5,2,0),inReverse);
  t.deepEqual(list.toArray(), [11,10,9,8,7,6,5,4,3,2,1,0], "merge() works with sort function");
  list.clear().merge(new LinkedList(1,4,5));
  t.deepEqual(list.toArray(), [1,4,5], "merge() works on empty list");
  list.merge(new LinkedList());
  t.deepEqual(list.toArray(), [1,4,5], "merge() of empty list works");
  list.clear().merge(new LinkedList());
  t.deepEqual(list.toArray(), [], "merge() of two empty lists works");

  //
  // 
  
  t.end();

});
