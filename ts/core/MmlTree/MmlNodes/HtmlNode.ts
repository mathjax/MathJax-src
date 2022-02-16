/*************************************************************
 *
 *  Copyright (c) 2022 The MathJax Consortium
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
 * @fileoverview  Implement html-in-mathml internal node type
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractMmlEmptyNode}  from '../../../core/MmlTree/MmlNode.js';
import {DOMAdaptor} from '../../../core/DOMadaptor.js';
import {PropertyList} from '../../../core/Tree/Node.js';


/******************************************************************/
/**
 * The HtmlNode calss for storing HTML within token elements
 *
 * @template N   The HTMLElement class
 */
export class HtmlNode<N> extends AbstractMmlEmptyNode {
  /**
   * The HTML content for this node
   */
  protected html: N = null;

  /**
   * DOM adaptor for the content
   */
  protected adaptor: DOMAdaptor<any, any, any> = null;

  /**
   * @override
   */
  public get kind() {
    return 'html';
  }

  /**
   * @return {Object}  Return the node's HTML content
   */
  public getHTML(): Object {
    return this.html;
  }

  /**
   * @param {object} html          The HTML content to be saved
   * @param {DOMAdaptor} adaptor   DOM adaptor for the content
   * @return {HTMLNode}            The HTML node (for chaining of method calls)
   */
  public setHTML(html: N, adaptor: DOMAdaptor<any, any, any> = null): HtmlNode<N> {
    //
    // Test if the HTML element has attributes and wrap in a <span> if not
    //
    try {
      adaptor.getAttribute(html, 'data-mjx-hdw');
    } catch (error) {
      html = adaptor.node('span', {}, [html]);
    }
    this.html = html;
    this.adaptor = adaptor;
    return this;
  }

  /**
   * @return {string}  The serialized HTML content
   */
  public getSerializedHTML(): string {
    return this.adaptor.outerHTML(this.html);
  }

  /**
   * @return {string}   The text of the HTML content
   */
  public textContent(): string {
    return this.adaptor.textContent(this.html);
  }

  /**
   * @override
   */
  public copy(): HtmlNode<N> {
    return (this.factory.create(this.kind) as HtmlNode<N>).setHTML(this.adaptor.clone(this.html));
  }

  /**
   * Just indicate that this is HTML data
   */
  public toString() {
    const kind = this.adaptor.kind(this.html);
    return `HTML=<${kind}>...</${kind}>` ;
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
