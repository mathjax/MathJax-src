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
 * @file  Implements the linkedom DOM adaptor
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { HTMLAdaptor } from './HTMLAdaptor.js';
import { NodeMixin, Constructor } from './NodeMixin.js';
import { OptionList } from '../util/Options.js';

/**
 * The constructor for an HTMLAdaptor
 */
export type HTMLAdaptorConstructor = Constructor<
  HTMLAdaptor<HTMLElement, Text, Document>
>;

/**
 * The LinkedomAdaptor class
 */
export class LinkedomAdaptor extends NodeMixin<
  HTMLElement,
  Text,
  Document,
  HTMLAdaptorConstructor
>(HTMLAdaptor) {
  /**
   * @override
   */
  public parse(text: string, format: string = 'text/html') {
    //
    //  Make sure the text string has nodes (in particular, it can't be empty)
    //
    if (!text.match(/^(?:\s|\n)*</)) text = '<html>' + text + '</html>';
    return this.parser.parseFromString(text, format);
  }

  /**
   * This will do an HTML serialization, which may be good enough, but
   *   won't necessarily close some tags properly.
   *
   * @override
   */
  public serializeXML(node: HTMLElement) {
    return this.outerHTML(node);
  }
}

/**
 * Function for creating an HTML adaptor using linkedom
 *
 * @param {any} parseHTML       The linkedom HTML parser to use for this adaptor
 * @param {OptionList} options  The options for the adaptor
 * @returns {LinkedomAdaptor}   The newly created adaptor
 */
export function linkedomAdaptor(
  parseHTML: any,
  options: OptionList = null
): LinkedomAdaptor {
  const window = parseHTML('<html></html>');
  //
  // Add fake class for missing HTMLCollection
  //
  window.HTMLCollection = class {};
  //
  // Add missing splitText() method
  //
  window.Text.prototype.splitText = function (offset: number) {
    const text = this.data;
    if (offset > text.length) {
      throw Error('Index Size Error');
    }
    const newNode = window.document.createTextNode(text.substring(offset));
    this.parentNode.insertBefore(newNode, this.nextSibling);
    this.data = text.substring(0, offset);
    return newNode;
  };
  return new LinkedomAdaptor(window, options);
}
