import {MathJax} from '../legacy/MathJax.js';

export function HandleRetriesFor(code) {
  return new Promise(function run(ok,fail) {
    try {
      ok(code());
    } catch (err) {
      if (err.retry && err.retry instanceof Promise) {
        err.retry.then(_ => run(ok,fail))
                 .catch(perr => fail(perr));
      } else if (err.restart && err.restart.isCallback) {
        MathJax.Callback.After(_ => run(ok,fail),err.restart);
      } else {
        fail(err);
      }
    }
  });
};
  
export function RetryAfter(promise) {
  let err = new Error("MathJax retry");
  err.retry = promise;
  throw err;
}
