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
 * @file  Implements the OutputWrapperFactory class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CommonOutputJax, COMMON_FONT } from '../common.js';
import { AbstractWrapperFactory } from '../../core/Tree/WrapperFactory.js';
import { CommonWrapper, CommonWrapperClass } from './Wrapper.js';
import { MmlNode, MmlNodeClass } from '../../core/MmlTree/MmlNode.js';
import { DOM as ANY_DOM, DOM_TYPES } from '../../types/Types.js';

/*****************************************************************/

/**
 *  The OutputWrapperFactory class for creating OutputWrapper nodes
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export class CommonWrapperFactory<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends AbstractWrapperFactory<MmlNode, MmlNodeClass, WW, WC> {
  /**
   * The default list of wrapper nodes this factory can create
   *   (filled in by subclasses)
   */
  public static defaultNodes: {
    /* prettier-ignore */
    [kind: string]: CommonWrapperClass<ANY_DOM, COMMON_FONT, any, any, any, any>;
  } = {};

  /**
   * The output jax associated with this factory
   */
  public jax: JX = null;

  /**
   * @returns {object}  The list of node-creation functions
   */
  get Wrappers(): object {
    return this.node;
  }
}
