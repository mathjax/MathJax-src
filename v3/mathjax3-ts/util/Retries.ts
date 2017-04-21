//import {MathJax} from '../legacy/MathJax.js';

declare var MathJax: {Callback: {After: Function}};

export class RetryError extends Error {
    retry: Object;
}

export function HandleRetriesFor(code: Function) {
    return new Promise(function run(ok: Function, fail: Function) {
        try {
            ok(code());
        } catch (err) {
            if (err.retry && err.retry instanceof Promise) {
                err.retry.then(() => run(ok, fail))
                         .catch((perr: Error) => fail(perr));
            } else if (err.restart && err.restart.isCallback) {
                MathJax.Callback.After(() => run(ok, fail), err.restart);
            } else {
                fail(err);
            }
        }
    });
};

export function RetryAfter(promise: Promise<Object>) {
    let err = new Error("MathJax retry") as RetryError;
    err.retry = promise;
    throw err;
}
