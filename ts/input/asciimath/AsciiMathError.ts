/*************************************************************
 *
 *  Copyright (c) 2025 The MathJax Consortium
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
 * @file Error class for the AsciiMath parser.
 *
 * @author mathjax@mathjax.org (MathJax Consortium)
 */

export default class AsciiMathError {
  private static pattern =
    /%(\d+|\{\d+\}|\{[a-z]+:%\d+(?:\|(?:%\{\d+\}|%.|[^}])*)+\}|.)/g;

  /**
   * Default error message.
   *
   * @type {string}
   */
  public message: string;

  /**
   * The old MathJax processing function.
   *
   * @param {string} str The basic error message.
   * @param {string[]} args The arguments to be replaced in the error message.
   * @returns {string} The processed error string.
   */
  private static processString(str: string, args: string[]): string {
    const parts = str.split(AsciiMathError.pattern);
    for (let i = 1, m = parts.length; i < m; i += 2) {
      let c = parts[i].charAt(0);
      if (c >= '0' && c <= '9') {
        parts[i] = args[parseInt(parts[i], 10) - 1];
        if (typeof parts[i] === 'number') {
          parts[i] = parts[i].toString();
        }
      } else if (c === '{') {
        c = parts[i].substring(1);
        if (c >= '0' && c <= '9') {
          parts[i] =
            args[
              parseInt(
                parts[i].substring(1, parts[i].length - 1),
                10
              ) - 1
            ];
          if (typeof parts[i] === 'number') {
            parts[i] = parts[i].toString();
          }
        } else {
          const match = parts[i].match(/^\{([a-z]+):%(\d+)\|(.*)\}$/);
          if (match) {
            parts[i] = '%' + parts[i];
          }
        }
      }
    }
    return parts.join('');
  }

  /**
   * @class
   * @param {string} id        message id (for localization)
   * @param {string} message   text of English message
   * @param {string[]=} rest   any substitution arguments
   */
  constructor(
    public id: string,
    message: string,
    ...rest: string[]
  ) {
    this.message = AsciiMathError.processString(message, rest);
  }
}
