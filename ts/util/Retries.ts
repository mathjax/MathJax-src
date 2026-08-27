/*************************************************************
 *
 *  Copyright (c) 2017-2026 The MathJax Consortium
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

import { localize } from '../core/__locales__/Component.js';

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
 *  Allow us to pass a promise and restart code as part of an Error object
 */

export interface RetryError extends Error {
  retry: Promise<any>;
  code: () => any;
}

/*****************************************************************/
/**
 * A wrapper for actions that may be asynchronous.  This will
 *   rerun the action after the asychronous action completes.
 *   Usually, this is for dynamic loading of files.
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
 * @param {()=>any} code   The code to run that might cause retries
 * @returns {Promise}      A promise that is satisfied when the code
 *                         runs completely, and fails if the code
 *                         generates an error (that is not a retry).
 */
export async function handleRetriesFor(code: () => any): Promise<any> {
  const CODE = code;
  while (code) {
    //
    // Wait for the user code to run and return its value
    // If there was an error,
    //   If it was a retry error, restart with the given or original code,
    //   Otherwise fail with the error.
    // Continue to this until the user code runs successfully.
    //
    try {
      return await code();
    } catch (err) {
      if (err.retry instanceof Promise) {
        code = () => (err as RetryError).retry.then(err.code ?? CODE);
      } else if (err.restart?.isCallback) {
        // FIXME: Remove this branch when all legacy code is gone
        code = () =>
          new Promise((ok, fail) => {
            MathJax.Callback.After(() => {
              try {
                ok(CODE());
              } catch (e) {
                fail(e);
              }
            }, err.restart);
          });
      } else {
        throw err;
      }
    }
  }
}

/*****************************************************************/
/**
 * Tells HandleRetriesFor() to wait for this promise to be fulfilled
 *   before rerunning the code.  Causes an error to be thrown, so
 *   calling this terminates the code at that point.
 *
 * @param {Promise} promise    The promise that must be satisfied before
 *                               actions will continue
 * @param {boolean} code       Code to run after the retry is complete
 */
export function retryAfter(promise: Promise<any>, code: () => any = null) {
  const err = new Error(localize('RetryError')) as RetryError;
  err.retry = promise;
  err.code = code;
  throw err;
}
