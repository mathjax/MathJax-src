/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @file  Implements methods for handling asynchronous actions
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/*****************************************************************/
/*
 *  The legacy MathJax object  (FIXME: remove this after all v2 code is gone)
 */

declare const MathJax: {
  Callback: {
    After: (cb1: () => void, cb2: () => void) => Promise<any>;
  };
};

/*****************************************************************/
/**
 *  Allow us to pass a promise as part of an Error object
 */

export interface RetryError extends Error {
  retry: Promise<any>;
}

/*****************************************************************/
/**
 * A wrapper for actions that may be asynchronous.  This will
 *   rerun the action after the asychronous action completes.
 *   Usually, this is for dynamic loading of files.  Legacy
 *   MathJax does that a lot, so we still need it for now, but
 *   may be able to go without it in the future.
 *
 *   Example:
 *
 *     HandleRetriesFor(() => {
 *
 *         html.findMath()
 *             .compile()
 *             .getMetrics()
 *             .typeset()
 *             .updateDocument();
 *
 *     }).catch(err => {
 *       console.log(err.message);
 *     });
 *
 * @param {Function} code  The code to run that might cause retries
 * @returns {Promise}       A promise that is satisfied when the code
 *                         runs completely, and fails if the code
 *                         generates an error (that is not a retry).
 */
export function handleRetriesFor(code: () => any): Promise<any> {
  return new Promise(function run(ok, fail) {
    //
    // Process an error (retry or actual error)
    //
    const handleRetry = (err: any) => {
      if (err.retry instanceof Promise) {
        err.retry.then(() => run(ok, fail)).catch((e: any) => fail(e));
      } else if (err.restart?.isCallback) {
        // FIXME: Remove this branch when all legacy code is gone
        MathJax.Callback.After(() => run(ok, fail), err.restart);
      } else {
        fail(err);
      }
    };
    //
    // Run the user code
    //   If it returns a promise, wait on it
    //     when done, resolve the original promise with its returned value,
    //     or if it errors, handle a retry or fail with the error.
    //   Otherwise resolve the original promise with the result.
    // If there was an error, handle a retry otherwise fail with the error.
    try {
      const result = code();
      if (result instanceof Promise) {
        result.then((value) => ok(value)).catch((err) => handleRetry(err));
      } else {
        ok(result);
      }
    } catch (err) {
      handleRetry(err);
    }
  });
}

/*****************************************************************/
/**
 * Tells HandleRetriesFor() to wait for this promise to be fulfilled
 *   before rerunning the code.  Causes an error to be thrown, so
 *   calling this terminates the code at that point.
 *
 * @param {Promise} promise  The promise that must be satisfied before
 *                            actions will continue
 */
export function retryAfter(promise: Promise<any>) {
  const err = new Error(
    'MathJax retry -- an asynchronous action is required; ' +
      'try using one of the promise-based functions and await its resolution.'
  ) as RetryError;
  err.retry = promise;
  throw err;
}
