/*************************************************************
 *
 *  Copyright (c) 2018-2026 The MathJax Consortium
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
 * @file  Implements the SvgWrapperFactory class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../svg.js';
import { CommonWrapperFactory } from '../common/WrapperFactory.js';
import { SvgWrapper, SvgWrapperClass } from './Wrapper.js';
import { SvgWrappers } from './Wrappers.js';
import { DOM_TYPES } from '../../types/Types.js';

/*****************************************************************/
/*
 *  The SvgWrapperFactory class for creating SvgWrapper nodes
 *
 * @template DOM   The DOM node types
 */
export class SvgWrapperFactory<
  DOM extends DOM_TYPES,
> extends CommonWrapperFactory<
  DOM,
  SVG_FONT,
  SVG<DOM>,
  SvgWrapper<DOM>,
  SvgWrapperFactory<DOM>,
  SvgWrapperClass<DOM>
> {
  /**
   * The default list of wrapper nodes this factory can create
   */
  public static defaultNodes = SvgWrappers;
}
