let test = require('tape');
let PromiseTests = require('../../../lib/PromiseTests.js').PromiseTests;

let MathJax = require("../../../../mathjax3/mathjax.js").MathJax;

/****************************************************************************/

test("handleRetriesFor()/retryAfter()", t => {
  let retryError = function (err) {
    t.fail("handleRetriesFor() error: "+err.message);
  };
  
  PromiseTests(t,[

    //
    //  Check if handleRetriesFor().then() gets called
    //
    [
      () => {return MathJax.handleRetriesFor(() => {return 'success'})},
      (result) => {
        t.equal(result,'success',"handleRetriesFor() completes with correct value");
      },
      retryError
    ],

    //
    //  Check if handleRetriesFor().catch() gets called
    //
    [
      () => {return MathJax.handleRetriesFor(() => {throw Error('fail')})},
      () => t.fail("handleRetriesFor() failed to fail"),
      (err) => {
        t.equal(err.message,'fail',"handleRetriesFor() fails with correct value");
      }
    ],

    //
    //  Check if handleRetriesFor().then() gets called after 3 retries
    //
    (() => {
      let n = 0;
      return [
        () => {
          return MathJax.handleRetriesFor(() => {
            if (++n < 3) {
              let p = new Promise((ok, fail) => {
                setTimeout(() => ok(), 10);
              });
              MathJax.retryAfter(p);
            }
            return 'success';
          });
        },
        (result) => {
          t.equal(n,3,"retryAfter() called 3 times");
          t.equal(result,'success',". Return value correct");
        },
        retryError
      ]
    })(),

    //
    //  Check if handleRetriesFor().catch() gets called after 2 retries
    //
    (() => {
      let n = 0;
      return [
        () => {
          return MathJax.handleRetriesFor(() => {
            if (++n < 3) {
              let p = new Promise((ok, fail) => {
                setTimeout(() => {if (n < 2) ok(); else fail('fail');}, 10);
              });
              MathJax.retryAfter(p);
            }
          });
        },
        () => t.fail("handleRetriesFor() didn't fail on second try"),
        (err) => {
          t.equal(n,2,"handleRetriesFor() caught failure from retryAfter()");
          t.equal(err,'fail',". Return value correct");
        }
      ]
    })()
  ]);
  
});
