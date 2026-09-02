/*************************************************************
 *
 *  Copyright (c) 2019-2026 The MathJax Consortium
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
 * @file  Mixin that adds hidden MathML to the output
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { Handler } from '../core/Handler.js';
import {
  MathDocument,
  AbstractMathDocument,
  MathDocumentConstructor,
  RenderActions,
  DOCUMENT_OPTIONS,
} from '../core/MathDocument.js';
import { AbstractMathItem, STATE, newState } from '../core/MathItem.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { SerializedMmlVisitor } from '../core/MmlTree/SerializedMmlVisitor.js';
import { expandable } from '../util/Options.js';
import { StyleJson } from '../util/StyleJson.js';
import { DOM_TYPES, N, Constructor } from '../types/Types.js';

/*==========================================================================*/

export class LimitedMmlVisitor extends SerializedMmlVisitor {
  /**
   * @override
   */
  protected getAttributes(node: MmlNode): string {
    /**
     * Remove id from attribute output
     */
    return super.getAttributes(node).replace(/ ?id=".*?"/, '');
  }
}

/*==========================================================================*/

/**
 * Add STATE value for having assistive MathML (after TYPESETTING)
 */
newState('ASSISTIVEMML', 153);

/**
 * The functions added to MathItem for assistive MathML
 *
 * @template DOM   The DOM node types
 */
export interface AssistiveMmlMathItem<
  DOM extends DOM_TYPES,
> extends AbstractMathItem<DOM> {
  /**
   * @param {MathDocument} document  The document where assistive MathML is being added
   * @param {boolean} force          True to force assistive MathML even if enableAssistiveMml is false
   */
  assistiveMml(document: MathDocument<DOM>, force?: boolean): void;
}

/**
 * The mixin for adding assistive MathML to MathItems
 *
 * @param {B} BaseMathItem          The MathItem class to be extended
 * @returns {AssistiveMmlMathItem}  The augmented MathItem class
 *
 * @template DOM   The DOM node types
 * @template B     The MathItem class to extend
 */
export function AssistiveMmlMathItemMixin<
  DOM extends DOM_TYPES,
  B extends Constructor<AbstractMathItem<DOM>>,
>(BaseMathItem: B): Constructor<AssistiveMmlMathItem<DOM>> & B {
  return class extends BaseMathItem {
    /**
     * @param {MathDocument} document   The MathDocument for the MathItem
     * @param {boolean} force           True to force assistive MathML evenif enableAssistiveMml is false
     */
    public assistiveMml(
      document: AssistiveMmlMathDocument<DOM>,
      force: boolean = false
    ) {
      if (this.state() >= STATE.ASSISTIVEMML) return;
      if (!this.isEscaped && (document.options.enableAssistiveMml || force)) {
        const adaptor = document.adaptor;
        //
        // Get the serialized MathML
        //
        const mml = document
          .toMML(this.root)
          .replace(/\n */g, '')
          .replace(/<!--.*?-->/g, '');
        //
        // Parse is as HTML and retrieve the <math> element
        //
        const mmlNodes = adaptor.firstChild(
          adaptor.body(adaptor.parse(mml, 'text/html'))
        );
        //
        // Create a container for the hidden MathML
        //
        const node = adaptor.node(
          'mjx-assistive-mml',
          {
            unselectable: 'on',
            display: this.display ? 'block' : 'inline',
          },
          [mmlNodes]
        );
        //
        // Hide the typeset math from assistive technology and append the MathML that is visually
        //   hidden from other users
        //
        for (const child of adaptor.childNodes(this.typesetRoot) as N<DOM>[]) {
          adaptor.setAttribute(child, 'aria-hidden', 'true');
        }
        adaptor.setStyle(this.typesetRoot, 'position', 'relative');
        adaptor.append(this.typesetRoot, node);
      }
      this.state(STATE.ASSISTIVEMML);
    }
  };
}

/*==========================================================================*/

/**
 * The assistive-mml option types.
 */
export type OPTIONS = {
  enableAssistiveMml: boolean;
};

/**
 * The AssistiveMmlDocument option types.
 */
export interface ASSISTIVEMML_OPTIONS<DOM extends DOM_TYPES>
  extends OPTIONS, DOCUMENT_OPTIONS<DOM> {
  MathItem: Constructor<AssistiveMmlMathItem<DOM>>;
}

/**
 * The assistive-mml option defaults.
 */
const options: OPTIONS = {
  enableAssistiveMml: true,
};

/*==========================================================================*/

/**
 * The functions added to MathDocument for assistive MathML
 *
 * @template DOM   The DOM node types
 */
export interface AssistiveMmlMathDocument<
  DOM extends DOM_TYPES,
> extends AbstractMathDocument<DOM> {
  /**
   * @override
   */
  options: ASSISTIVEMML_OPTIONS<DOM>;

  /**
   * @param {MmlNode} node   The node to be serializes
   * @returns {string}       The serialization of the node
   */
  toMML: (node: MmlNode) => string;

  /**
   * Add assistive MathML to the MathItems in the MathDocument
   *
   * @returns {AssistiveMmlMathDocument}   The MathDocument (so calls can be chained)
   */
  assistiveMml(): this;
}

/**
 * The mixin for adding assistive MathML to MathDocuments
 *
 * @param {B} BaseDocument              The MathDocument class to be extended
 * @returns {AssistiveMmlMathDocument}  The Assistive MathML MathDocument class
 *
 * @template DOM   The DOM node types
 * @template B     The MathDocument class to extend
 */
export function AssistiveMmlMathDocumentMixin<
  DOM extends DOM_TYPES,
  B extends MathDocumentConstructor<AbstractMathDocument<DOM>, DOM>,
>(
  BaseDocument: B
): MathDocumentConstructor<AssistiveMmlMathDocument<DOM>, DOM> {
  return class BaseClass extends BaseDocument {
    /**
     * @override
     */
    public static OPTIONS = {
      ...BaseDocument.OPTIONS,
      ...options,
      renderActions: expandable({
        ...BaseDocument.OPTIONS.renderActions,
        assistiveMml: [STATE.ASSISTIVEMML],
      }) as RenderActions<DOM>,
    };

    /**
     * @override
     */
    options: ASSISTIVEMML_OPTIONS<DOM>;

    /**
     * styles needed for the hidden MathML
     */
    public static assistiveStyles: StyleJson = {
      'mjx-assistive-mml': {
        position: 'absolute !important',
        top: '0px',
        left: '0px',
        bottom: '0px',
        right: '0px',
        clip: 'rect(1px, 1px, 1px, 1px)',
        'clip-path': 'polygon(0 0, 0 1px, 1px 1px, 1px 0)',
        padding: '1px 0px 0px 0px !important',
        border: '0px !important',
        display: 'block !important',
        width: 'auto !important',
        overflow: 'hidden !important',
        'text-indent': '0px ! important',
        /*
         *  Don't allow the assistive MathML to become part of the selection
         */
        '-webkit-touch-callout': 'none',
        '-webkit-user-select': 'none',
        '-khtml-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none',
      },
      'mjx-assistive-mml[display="block"]': {
        width: '100% !important',
      },
    };

    /**
     * Visitor used for serializing internal MathML nodes
     */
    protected visitor: LimitedMmlVisitor;

    /**
     * Augment the MathItem class used for this MathDocument, and create the serialization visitor.
     *
     * @override
     * @class
     */
    constructor(...args: any[]) {
      super(...args);
      const CLASS = this.constructor as typeof BaseClass;
      const ProcessBits = CLASS.ProcessBits;
      if (!ProcessBits.has('assistive-mml')) {
        ProcessBits.allocate('assistive-mml');
      }
      this.visitor = new LimitedMmlVisitor(this.mmlFactory);
      this.options.MathItem = AssistiveMmlMathItemMixin<
        DOM,
        Constructor<AbstractMathItem<DOM>>
      >(this.options.MathItem);
      if ('addStyles' in this) {
        (this as any).addStyles(CLASS.assistiveStyles);
      }
    }

    /**
     * @param {MmlNode} node   The node to be serializes
     * @returns {string}       The serialization of the node
     */
    public toMML(node: MmlNode): string {
      return this.visitor.visitTree(node);
    }

    /**
     * Add assistive MathML to the MathItems in this MathDocument
     *
     * @returns {AssistiveMmlMathDocument<DOM>} The assistive mml document.
     */
    public assistiveMml(): this {
      if (!this.processed.isSet('assistive-mml')) {
        for (const math of this.math) {
          (math as AssistiveMmlMathItem<DOM>).assistiveMml(this);
        }
        this.processed.set('assistive-mml');
      }
      return this;
    }

    /**
     * @override
     */
    public state(state: number, restore: boolean = false) {
      super.state(state, restore);
      if (state < STATE.ASSISTIVEMML) {
        this.processed.clear('assistive-mml');
      }
      return this;
    }
  };
}

/*==========================================================================*/

/**
 * Add assitive MathML support a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @returns {Handler}         The handler that was modified (for purposes of chainging extensions)
 *
 * @template DOM   The DOM node types
 */
export function AssistiveMmlHandler<DOM extends DOM_TYPES>(
  handler: Handler<DOM>
): Handler<DOM> {
  handler.documentClass = AssistiveMmlMathDocumentMixin<
    DOM,
    MathDocumentConstructor<AbstractMathDocument<DOM>, DOM>
  >(handler.documentClass);
  return handler;
}
