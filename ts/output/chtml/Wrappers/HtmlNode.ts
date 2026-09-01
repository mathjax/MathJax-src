/*************************************************************
 *
 *  Copyright (c) 2022-2026 The MathJax Consortium
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
import { DOM, DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlHtmlNode interface for the CHTML HtmlNode wrapper
 *
 * @template DOM  The DOM node types
 */
export interface ChtmlHtmlNodeNTD<
  DOM extends DOM_TYPES,
> extends ChtmlXmlNodeNTD<DOM> {}

/**
 * The ChtmlHtmlNodeClass interface for the CHTML HtmlNode wrapper
 *
 * @template DOM  The DOM node types
 */
export interface ChtmlHtmlNodeClass<
  DOM extends DOM_TYPES,
> extends ChtmlXmlNodeClass<DOM> {
  new (
    factory: ChtmlWrapperFactory<DOM>,
    node: MmlNode,
    parent?: ChtmlWrapper<DOM>
  ): ChtmlHtmlNodeNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlHtmlNode wrapper class for the MmlHtmlNode class
 */
export class ChtmlHtmlNode
  // @ts-expect-error Avoid message about base constructors not having the same type
  extends ChtmlXmlNode
  implements ChtmlHtmlNodeNTD<DOM>
{
  /**
   * @override
   */
  public static kind = HtmlNode.prototype.kind;
}
