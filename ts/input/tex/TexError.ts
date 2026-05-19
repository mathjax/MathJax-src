/*************************************************************
 *
 *  Copyright (c) 2009-2026 The MathJax Consortium
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
 * @file Error class for the TeX parser.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { Locale } from '../../util/Locale.js';

export default class TexError {
  public message: string;

  /**
   * @param {string} id         message id
   * @param _id
   * @param {string} message    text of English message
   * @param {string[]} args     substitution arguments
   */
  constructor(
    public _id: string,
    message: string,
    ...args: string[]
  ) {
    this.message = Locale.processMessage(message, args[0], ...args.slice(1));
  }
}

/**
 * @param {string} component  locale component (e.g. '[tex]/base')
 * @param {string} id         message id
 * @param {string[]} args     substitution arguments
 */
export function texError(component: string, id: string, ...args: string[]) {
  const message = Locale.message(component, id, ...args);
  throw new TexError(id, message, ...args);
}
