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
   * @param {string} component  locale component (e.g. '[tex]/base')
   * @param {string} id         message id
   * @param {string[]} args     substitution arguments
   */
  constructor(
    public component: string,
    public id: string,
    ...args: string[]
  ) {
    this.message = component
      ? Locale.message(component, id, ...args)
      : args.join(' ');
  }
}
