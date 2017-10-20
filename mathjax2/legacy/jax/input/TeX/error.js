/*************************************************************
 *
 *  MathJax/jax/input/TeX/error.js
 *  
 *  Implements the TeX InputJax that reads mathematics in
 *  TeX and LaTeX format and converts it to the MML ElementJax
 *  internal format.
 *
 *  ---------------------------------------------------------------------
 *  
 *  Copyright (c) 2009-2017 The MathJax Consortium
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


// Temporary class to create error messages without all original localization
// machinery.

const pattern =
        /%(\d+|\{\d+\}|\{[a-z]+:\%\d+(?:\|(?:%\{\d+\}|%.|[^\}])*)+\}|.)/g;

export class TexError {

  constructor(input) {
    if (!input.length > 1) {
      this._message = '';
      return;
    }
    this.id = input[0];
    this._message = TexError.processString(input[1], input.slice(2));
  }

  get message() {
    return this._message;
  }

  /**
   * The old MathJax processing function.
   * @param {Array.<string>} input The input message.
   * @return {string} The processed error string.
   */
  static processString(string, args) {
    let i, m;
    let parts = string.split(pattern);
    for (i = 1, m = parts.length; i < m; i += 2) {
      let c = parts[i].charAt(0);  // first char will be { or \d or a char to be
                                   // kept literally
      if (c >= '0' && c <= '9') {    // %n
        parts[i] = args[parts[i] - 1];
        if (typeof parts[i] === 'number') {
          parts[i] = TexError.number(parts[i]);
        }
      } else if (c === '{') {        // %{n} or %{plural:%n|...}
        c = parts[i].substr(1);
        if (c >= '0' && c <= '9') {  // %{n}
          parts[i] = args[parts[i].substr(1, parts[i].length - 2) - 1];
          if (typeof parts[i] === 'number') parts[i] = this.number(parts[i]);
        } else {                     // %{plural:%n|...}
          let match = parts[i].match(/^\{([a-z]+):%(\d+)\|(.*)\}$/);
          if (match) {
            // Removed plural here.
            parts[i] = '%' + parts[i];
          }
        }
      }
      if (parts[i] == null) {
        parts[i] = '???';
      }
    }
    return parts.join('');
  }


  static number(n) {
    return n.toString();
  }
}
