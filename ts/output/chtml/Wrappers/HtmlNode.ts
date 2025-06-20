/*************************************************************
 *
 *  Copyright (c) 2022-2025 The MathJax Consortium
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
 * @file  Implements the ChtmlHtmlNode wrapper for the HtmlNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { ChtmlWrapper } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  ChtmlXmlNode,
  ChtmlXmlNodeNTD,
  ChtmlXmlNodeClass,
} from './semantics.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { HtmlNode } from '../../../core/MmlTree/MmlNodes/HtmlNode.js';

/*****************************************************************/
/**
 * The ChtmlHtmlNode interface for the CHTML HtmlNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlHtmlNodeNTD<N, T, D> extends ChtmlXmlNodeNTD<N, T, D> {}

/**
 * The ChtmlHtmlNodeClass interface for the CHTML HtmlNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlHtmlNodeClass<N, T, D>
  extends ChtmlXmlNodeClass<N, T, D> {
  new (
    factory: ChtmlWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: ChtmlWrapper<N, T, D>
  ): ChtmlHtmlNodeNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlHtmlNode wrapper class for the MmlHtmlNode class
 */
export const ChtmlHtmlNode = (function <N, T, D>(): ChtmlHtmlNodeClass<
  N,
  T,
  D
> {
  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlHtmlNode
    extends ChtmlXmlNode
    implements ChtmlHtmlNodeNTD<N, T, D>
  {
    /**
     * @override
     */
    public static kind = HtmlNode.prototype.kind;
  };
})<any, any, any>();
