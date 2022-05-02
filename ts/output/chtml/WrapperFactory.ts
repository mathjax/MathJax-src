/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview  Implements the ChtmlWrapperFactory class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../chtml.js';
import {CommonWrapperFactory} from '../common/WrapperFactory.js';
import {ChtmlWrapper, ChtmlWrapperClass} from './Wrapper.js';
import {ChtmlWrappers} from './Wrappers.js';
import {ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData,
        ChtmlFontData, ChtmlFontDataClass} from './FontData.js';

/*****************************************************************/
/**
 *  The ChtmlWrapperFactory class for creating ChtmlWrapper nodes
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class ChtmlWrapperFactory<N, T, D> extends
CommonWrapperFactory<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {

  /**
   * The default list of wrapper nodes this factory can create
   */
  public static defaultNodes = ChtmlWrappers;

}
