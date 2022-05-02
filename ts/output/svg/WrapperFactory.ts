/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Implements the SvgWrapperFactory class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../svg.js';
import {CommonWrapperFactory} from '../common/WrapperFactory.js';
import {SvgWrapper, SvgWrapperClass} from './Wrapper.js';
import {SvgWrappers} from './Wrappers.js';
import {SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass} from './FontData.js';

/*****************************************************************/
/*
 *  The SvgWrapperFactory class for creating SvgWrapper nodes
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SvgWrapperFactory<N, T, D> extends
CommonWrapperFactory<
  N, T, D,
  SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
  SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass
> {

  /**
   * The default list of wrapper nodes this factory can create
   */
  public static defaultNodes = SvgWrappers;

}
