let test = require('tape');
let PromiseTests = require('../../../lib/PromiseTests.js').PromiseTests;

let FunctionList = require("../../../../mathjax3/util/FunctionList.js").FunctionList;

/****************************************************************************/

//
//  A buffer for output from the functions
//
let output = [];
function CLEAR() {output = []};

//
//  A function that buffers the value of its parameters plus i
//    unless the parameter is false or fail, which do special actions,
//    or if the second is 'p', when we return a promise with a delay.
//
function FN(i) {
  return function (x,y) {
    if (x === 'false' && i === 3) return false;
    if (x === 'fail' && i === 3) throw new Error('fail');
    output.push(x == null ? i : y == null ? x+i : x+y+i);
    if (y === 'p' && i === 3) {
      return new Promise((ok, fail) => {
        setTimeout(() => {x === 'f' ? fail('Failed!') : ok()}, 10);
      });
    }
  };
}

/****************************************************************************/

test("FunctionList", t => {
  let list = new FunctionList();
  
  //
  // Check empty list
  //
  t.deepEqual(list.toArray(),[],"Empty list produces empty array");

  //
  // Check adding a function
  //
  let item = list.add(FN(0));
  t.deepEqual(list.toArray(),[{item: item, priority: 5}],"Function added OK");
  
  //
  // Check execution of function;
  //
  list.execute();
  t.deepEqual(output,[0],"Function executes");
  CLEAR();
  
  //
  // Check removing a function
  //
  list.remove(item);
  t.deepEqual(list.toArray(),[],"Function removed OK");

  /*******************************************/

  //
  // Check sorting of list
  //
  for (const i of [5,0,2,1,6,3,4]) {list.add(FN(i),i)}
  let result = list.execute();
  t.deepEqual(output,[0,1,2,3,4,5,6],"Functions are sorted by priority");
  t.equal(result,true,". Return value is true");
  CLEAR();
  
  //
  // Check passing of parameters
  //
  result = list.execute('x');
  t.deepEqual(output,['x0','x1','x2','x3','x4','x5','x6'],"Single parameter passed");
  t.equal(result,true,". Return value is true");
  CLEAR();
  result = list.execute('x','y');
  t.deepEqual(output,['xy0','xy1','xy2','xy3','xy4','xy5','xy6'],"Multiple parameters passed");
  t.equal(result,true,". Return value is true");
  CLEAR();
  
  //
  // Check for function returning false
  //
  result = list.execute('false');
  t.deepEqual(output,['false0','false1','false2'],"Function returing false stops execution");
  t.equal(result,false,". Return value is false");
  CLEAR();
  
  /*******************************************/

  //
  //  Test asynchronous execution
  //
  let promise = list.asyncExecute();
  t.ok(promise instanceof Promise,"asyncExecute() returns promise");
  
  let asyncError = ((err) => t.fail("asyncExecute() errors: "+err.message));

  PromiseTests(t,[
    //
    //  Rest that asyncExecute runs
    //
    [
      () => {return promise},
      (result) => {
        t.pass("asynchExecute() runs");
        t.ok(result,". Result value is true");
        t.deepEqual(output,[0,1,2,3,4,5,6],". All functions called");
        CLEAR();
      },
      asyncError
    ],

    //
    // Test single passing parameter
    //
    [
      () => {return list.asyncExecute('x')},
      (result) => {
        t.deepEqual(output,['x0','x1','x2','x3','x4','x5','x6'],"Single parameter passed");
        t.equal(result,true,". Result value is true");
        CLEAR();
      },
      asyncError
    ],

    //
    // Test multiple passing parameter
    //
    [
      () => {return list.asyncExecute('x','y')},
      (result) => {
        t.deepEqual(output,['xy0','xy1','xy2','xy3','xy4','xy5','xy6'],
                   "Multiple parameters passed");
        t.equal(result,true,". Result value is true");
        CLEAR();
      },
      asyncError
    ],

    //
    // Test for function returnng false
    //
    [
      () => {return list.asyncExecute('false')},
      (result) => {
        t.deepEqual(output,['false0','false1','false2'],"Function returning false stops execution");
        t.equal(result,false,". Result value is false");
        CLEAR();
      },
      asyncError
    ],

    //
    // Test for function error
    //
    [
      () => {return list.asyncExecute('fail')},
      () => {
        t.fail("Function error is not caught");
        CLEAR();
      },(err) => {
        t.pass("Function error is caught");
        t.deepEqual(output,['fail0','fail1','fail2'],". Execution is stopped");
        t.equal(err.message,"fail",". Failure message is passed");
        CLEAR();
      }
    ],

    //
    // Test for delay
    //
    [
      () => {return list.asyncExecute('x','p')},
      (result) => {
        t.deepEqual(output,['xp0','xp1','xp2','xp3','xp4','xp5','xp6'],"Delay is handled");
        t.equal(result,true,". Result value is true");
        CLEAR();
      },
      asyncError
    ],
    
    //
    // Test for delay with failed promise
    //
    [
      () => {return list.asyncExecute('f','p')},
      (result) => {
        t.fail("Failed promise is not caught");
        CLEAR();
      },
      (err) => {
        t.pass("Failed promise is caught");
        t.deepEqual(output,['fp0','fp1','fp2','fp3'],". Execution is stopped");
        t.equal(err,"Failed!",". Return message is correct");
        CLEAR();
      }
    ]
    
  ]);
  
});
