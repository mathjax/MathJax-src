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
 * @file  Implements the HTMLMathItem class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { AbstractMathItem, Location, STATE } from '../../core/MathItem.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';
import { InputJax } from '../../core/InputJax.js';
import { HTMLDocument } from './HTMLDocument.js';
import { DOM_TYPES, NT, T } from '../../types/Types.js';

/*****************************************************************/
/**
 *  Implements the HTMLMathItem class (extends AbstractMathItem)
 *
 * @template DOM   the DOM node types
 */
export class HTMLMathItem<DOM extends DOM_TYPES> extends AbstractMathItem<DOM> {
  /**
   * @returns {DOMAdaptor<DOM>} Easy access to DOM adaptor
   */
  get adaptor(): DOMAdaptor<DOM> {
    return this.inputJax.adaptor;
  }

  /**
   * @override
   */
  constructor(
    math: string,
    jax: InputJax<DOM>,
    display: boolean = true,
    start: Location<DOM> = { node: null, n: 0, delim: '' },
    end: Location<DOM> = { node: null, n: 0, delim: '' }
  ) {
    super(math, jax, display, start, end);
  }

  /**
   * Insert the typeset MathItem into the document at the right location
   *   If the starting and ending nodes are the same:
   *     Split the text to isolate the math and its delimiters
   *     Replace the math by the typeset version
   *   Otherewise (spread over several nodes)
   *     Split the start node, if needed
   *     Remove nodes until we reach the end node
   *     Insert the math before the end node
   *     Split the end node, if needed
   *     Remove the end node
   *
   * @override
   */
  public updateDocument(_html: HTMLDocument<DOM>) {
    if (this.state() < STATE.INSERTED) {
      if (this.inputJax.processStrings) {
        let node = this.start.node as T<DOM>;
        if (node === this.end.node) {
          if (
            this.end.n &&
            this.end.n < this.adaptor.value(this.end.node).length
          ) {
            this.adaptor.split(this.end.node, this.end.n);
          }
          if (this.start.n) {
            node = this.adaptor.split(this.start.node as T<DOM>, this.start.n);
          }
          if (this.adaptor.parent(node)) {
            this.adaptor.replace(this.typesetRoot, node);
          }
        } else {
          if (this.start.n) {
            node = this.adaptor.split(node, this.start.n);
          }
          while (node !== this.end.node) {
            const next = this.adaptor.next(node) as T<DOM>;
            this.adaptor.remove(node);
            node = next;
          }
          this.adaptor.insert(this.typesetRoot, node);
          if (this.end.n < this.adaptor.value(node).length) {
            this.adaptor.split(node, this.end.n);
          }
          this.adaptor.remove(node);
        }
      } else {
        this.adaptor.replace(this.typesetRoot, this.start.node);
      }
      this.start.node = this.end.node = this.typesetRoot;
      this.start.n = this.end.n = 0;
      this.state(STATE.INSERTED);
    }
  }

  /**
   * Update the style sheet for any changes due to rerendering
   *
   * @param {HTMLDocument} document   The document whose styles are to be updated
   */
  public updateStyleSheet(document: HTMLDocument<DOM>) {
    document.addStyleSheet();
  }

  /**
   * Remove the typeset math from the document, and put back the original
   *  expression and its delimiters, if requested.
   *
   * @override
   */
  public removeFromDocument(restore: boolean = false) {
    super.removeFromDocument(restore);
    if (this.state() >= STATE.TYPESET) {
      const adaptor = this.adaptor;
      const node = this.start.node;
      let math: NT<DOM> = adaptor.text('');
      if (restore) {
        const text = this.start.delim + this.math + this.end.delim;
        if (this.inputJax.processStrings) {
          math = adaptor.text(text);
        } else {
          const doc = adaptor.parse(text, 'text/html');
          math = adaptor.firstChild(adaptor.body(doc));
        }
      }
      if (adaptor.parent(node)) {
        adaptor.replace(math, node);
      }
      this.start.node = this.end.node = math;
      this.start.n = this.end.n = 0;
    }
  }
}
