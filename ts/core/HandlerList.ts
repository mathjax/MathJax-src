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
 * @file  Implements the interface and abstract class for HandlerList objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { PrioritizedList } from '../util/PrioritizedList.js';
import { OptionList } from '../util/Options.js';
import { Handler } from './Handler.js';
import { MathDocument } from './MathDocument.js';
import { Locale } from '../util/Locale.js';
import { COMPONENT } from '../core/__locales__/Component.js';
import { DOM_TYPES } from '../types/Types.js';

/*****************************************************************/
/**
 *  The HandlerList class (extends PrioritizedList of Handlers)
 *
 *  This list is used to find the handler for a given document
 *  by asking each handler to test if it can handle the document,
 *  and when one can, it is asked to create its associated MathDocument.
 *
 * @template DOM   The DOM node types
 */
export class HandlerList<DOM extends DOM_TYPES> extends PrioritizedList<
  Handler<DOM>
> {
  /**
   * @param {Handler} handler  The handler to register
   * @returns {Handler}        The list item created for the handler
   */
  public register(handler: Handler<DOM>): Handler<DOM> {
    return this.add(handler, handler.priority);
  }

  /**
   * @param {Handler} handler  The handler to remove from the list
   */
  public unregister(handler: Handler<DOM>) {
    this.remove(handler);
  }

  /**
   * @param {any} document     The document (string, window, DOM element, etc) to be handled
   * @returns {Handler}        The handler from the list that can process the given document
   */
  public handlesDocument(document: any): Handler<DOM> {
    for (const item of this) {
      const handler = item.item;
      if (handler.handlesDocument(document)) {
        return handler;
      }
    }
    return Locale.throw(COMPONENT, 'NoHandler');
  }

  /**
   * @param {any} document         The document to be processed
   * @param {OptionList} options   The options for the handler
   * @returns {MathDocument}       The MathDocument created by the handler for this document
   */
  public document(
    document: any,
    options: OptionList = null
  ): MathDocument<DOM> {
    return this.handlesDocument(document).create(document, options);
  }
}
