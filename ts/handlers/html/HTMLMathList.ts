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
 * @file  Implements the HTMLMathList object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { AbstractMathList } from '../../core/MathList.js';
import { DOM_TYPES } from '../../types/Types.js';

/*****************************************************************/
/**
 *  Implement the HTMLMathList class (extends AbstractMathList)
 *
 * @template DOM   The DOM node types
 */
export class HTMLMathList<
  DOM extends DOM_TYPES,
> extends AbstractMathList<DOM> {}
