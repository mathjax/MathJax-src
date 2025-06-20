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
 * @file  Implements the SvgHtmlNode wrapper for the HtmlNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SvgWrapper } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import { SvgXmlNode, SvgXmlNodeNTD, SvgXmlNodeClass } from './semantics.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { HtmlNode } from '../../../core/MmlTree/MmlNodes/HtmlNode.js';

/*****************************************************************/
/**
 * The SvgHtmlNode interface for the SVG HtmlNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgHtmlNodeNTD<N, T, D> extends SvgXmlNodeNTD<N, T, D> {}

/**
 * The SvgHtmlNodeClass interface for the SVG HtmlNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgHtmlNodeClass<N, T, D> extends SvgXmlNodeClass<N, T, D> {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgHtmlNodeNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgHtmlNode wrapper class for the MmlHtmlNode class
 */
export const SvgHtmlNode = (function <N, T, D>(): SvgHtmlNodeClass<N, T, D> {
  return class SvgHtmlNode
    // @ts-expect-error Avoid message about SvgXmlNode constructors not having
    // the same type (they should both be SvgWrapper<N, T, D>, but are thought
    // of as different by typescript)
    extends SvgXmlNode
    implements SvgHtmlNodeNTD<N, T, D>
  {
    /**
     * @override
     */
    public static kind = HtmlNode.prototype.kind;
  };
})<any, any, any>();
