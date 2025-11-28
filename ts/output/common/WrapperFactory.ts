/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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

import { CommonOutputJax } from '../common.js';
import { AbstractWrapperFactory } from '../../core/Tree/WrapperFactory.js';
import { CommonWrapper, CommonWrapperClass } from './Wrapper.js';
import {
  CharOptions,
  VariantData,
  DelimiterData,
  FontData,
  FontDataClass,
} from './FontData.js';
import { MmlNode, MmlNodeClass } from '../../core/MmlTree/MmlNode.js';

/*****************************************************************/

/**
 *  The OutputWrapperFactory class for creating OutputWrapper nodes
 *
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 */
export class CommonWrapperFactory<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, any, DD>,
  FC extends FontDataClass<CC, VV, DD>,
> extends AbstractWrapperFactory<MmlNode, MmlNodeClass, WW, WC> {
  /**
   * The default list of wrapper nodes this factory can create
   *   (filled in by subclasses)
   */
  /* prettier-ignore */
  public static defaultNodes: {
    [kind: string]: CommonWrapperClass<any, any, any, any, any, any, any, any, any, any, any, any>;
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
