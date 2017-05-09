let test = require('tape');

let PrioritizedList = require("../../../../mathjax3/util/PrioritizedList.js").PrioritizedList;

/****************************************************************************/

//
//  Turn the item list into a list of just that data
//
function ARRAY(list) {
  let array = [];
  for (const {item, priority} of list) array.push(item);
  return array;
}

/****************************************************************************/

test("PrioritizedList", t => {
  let list = new PrioritizedList();
  
  //
  // Check empty list
  //
  t.deepEqual(list.toArray(),[],"Empty list produces empty array");
  
  //
  // Check adding one item
  //
  let item = list.add(0);
  t.equal(list.toArray().length,1,"One item added OK");
  t.equal(list.toArray()[0].item,0,". Item value OK");
  t.equal(list.toArray()[0].priority,5,". Item default priority OK");
  t.deepEqual(list.toArray(),[{item: 0, priority:5}],". Item object OK");
  t.deepEqual(item,0,". Returned item OK");
  
  //
  // Check removing an item
  //
  list.remove(0);
  t.equal(list.toArray().length,0,"Item removed OK");
  
  //
  // Check sorting of list
  //
  for (const i of [5,0,2,1,6,3,4]) {list.add(i,i)}
  let OK = true;
  let array = list.toArray();
  for (const i of [0,1,2,3,4,5,6]) {
    if (array[i].item !== i) {
      OK = false;
      break;
    }
  }
  t.ok(OK,"List is sorted by priority");

  //
  //  Check iterator
  //
  let j = 0;
  for (const item of list) {
    if (item.item === j) j++; else break;
  }
  t.equal(j,7,"Iterator works");

  //
  // Check remove in longer list
  //
  list.remove(3);
  t.deepEqual(ARRAY(list),[0,1,2,4,5,6],"Middle element removed");
  list.remove(0);
  t.deepEqual(ARRAY(list),[1,2,4,5,6],"First element removed");
  list.remove(6);
  t.deepEqual(ARRAY(list),[1,2,4,5],"Last element removed");
  
  //
  // Check same priority
  //
  list = new PrioritizedList();
  list.add(3); list.add(1,1); list.add(4); list.add(2,1);
  t.deepEqual(ARRAY(list),[1,2,3,4],"Same priority is in order added");

  t.end();

});
