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
 * @file  Implement html-in-mathml internal node type
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { XMLNode } from '../MmlNode.js';
import { DOMAdaptor } from '../../DOMAdaptor.js';
import { PropertyList } from '../../Tree/Node.js';

/******************************************************************/
/**
 * The HtmlNode class for storing HTML within token elements
 *
 * @template N   The HTMLElement class
 */
export class HtmlNode<N> extends XMLNode {
  /**
   * @override
   */
  public get kind() {
    return 'html';
  }

  /**
   * @returns {N}  Return the node's HTML content
   */
  public getHTML(): N {
    return this.getXML() as any as N;
  }

  /**
   * @param {N} html               The HTML content to be saved
   * @param {DOMAdaptor} adaptor   DOM adaptor for the content
   * @returns {HtmlNode}            The HTML node (for chaining of method calls)
   */
  public setHTML(
    html: N,
    adaptor: DOMAdaptor<any, any, any> = null
  ): HtmlNode<N> {
    //
    // Test if the HTML element has attributes and wrap in a <span> if not
    //
    try {
      adaptor.getAttribute(html, 'data-mjx-hdw');
    } catch (_error) {
      html = adaptor.node('span', {}, [html]);
    }
    return this.setXML(html, adaptor) as HtmlNode<N>;
  }

  /**
   * @returns {string}  The serialized HTML content
   */
  public getSerializedHTML(): string {
    return this.adaptor.outerHTML(this.xml);
  }

  /**
   * @returns {string}   The text of the HTML content
   */
  public textContent(): string {
    return this.adaptor.textContent(this.xml);
  }

  /**
   * Just indicate that this is HTML data
   *
   * @override
   */
  public toString() {
    const kind = this.adaptor.kind(this.xml);
    return `HTML=<${kind}>...</${kind}>`;
  }

  /**
   * @override
   */
  public verifyTree(options: PropertyList) {
    if (this.parent && !this.parent.isToken) {
      this.mError('HTML can only be a child of a token element', options, true);
      return;
    }
  }
}
