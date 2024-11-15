/*************************************************************
 *
 *  Copyright (c) 2018-2024 The MathJax Consortium
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
 * @file  Mixin that implements the Explorer
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { Handler } from '../core/Handler.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { MathML } from '../input/mathml.js';
import { STATE, newState } from '../core/MathItem.js';
import {
  EnrichedMathItem,
  EnrichedMathDocument,
  EnrichHandler,
} from './semantic-enrich.js';
import { MathDocumentConstructor } from '../core/MathDocument.js';
import { OptionList, expandable } from '../util/Options.js';
import { SerializedMmlVisitor } from '../core/MmlTree/SerializedMmlVisitor.js';
import { hasWindow } from '../util/context.js';

import { ExplorerPool, RegionPool } from './explorer/ExplorerPool.js';

import * as Sre from './sre.js';

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new (...args: any[]) => T;

/**
 * Shorthands for types with HTMLElement, Text, and Document instead of generics
 */
export type HANDLER = Handler<HTMLElement, Text, Document>;
export type HTMLDOCUMENT = EnrichedMathDocument<HTMLElement, Text, Document>;
export type HTMLMATHITEM = EnrichedMathItem<HTMLElement, Text, Document>;
export type MATHML = MathML<HTMLElement, Text, Document>;

/*==========================================================================*/

/**
 * Add STATE value for having the Explorer added (after TYPESET and before INSERTED or CONTEXT_MENU)
 */
newState('EXPLORER', 160);

/**
 * The properties added to MathItem for the Explorer
 */
export interface ExplorerMathItem extends HTMLMATHITEM {
  /**
   * The Explorer objects for this math item
   */
  explorers: ExplorerPool;

  /**
   * @param {HTMLDocument} document  The document where the Explorer is being added
   * @param {boolean} force          True to force the explorer even if enableExplorer is false
   */
  explorable(document: HTMLDOCUMENT, force?: boolean): void;
}

/**
 * The mixin for adding the Explorer to MathItems
 *
 * @param {B} BaseMathItem      The MathItem class to be extended
 * @param {Function} toMathML   The function to serialize the internal MathML
 * @returns {ExplorerMathItem}  The Explorer MathItem class
 *
 * @template B  The MathItem class to extend
 */
export function ExplorerMathItemMixin<B extends Constructor<HTMLMATHITEM>>(
  BaseMathItem: B,
  toMathML: (node: MmlNode) => string
): Constructor<ExplorerMathItem> & B {
  return class extends BaseMathItem {
    /**
     * @override
     */
    public explorers: ExplorerPool;

    /**
     * Semantic id of the rerendered element that should regain the focus.
     */
    protected refocus: number = null;

    /**
     * Add the explorer to the output for this math item
     *
     * @param {HTMLDocument} document   The MathDocument for the MathItem
     * @param {boolean} force           True to force the explorer even if enableExplorer is false
     */
    public explorable(document: ExplorerMathDocument, force: boolean = false) {
      if (this.state() >= STATE.EXPLORER) return;
      if (!this.isEscaped && (document.options.enableExplorer || force)) {
        const node = this.typesetRoot;
        const mml = toMathML(this.root);
        if (!this.explorers) {
          this.explorers = new ExplorerPool();
        }
        this.explorers.init(document, node, mml, this);
      }
      this.state(STATE.EXPLORER);
    }

    /**
     * @override
     */
    public rerender(
      document: ExplorerMathDocument,
      start: number = STATE.RERENDER
    ) {
      if (this.explorers) {
        const speech = this.explorers.speech;
        if (speech && speech.attached && speech.active) {
          const focus = speech.semanticFocus();
          this.refocus = focus ? focus.id : null;
        }
        this.explorers.reattach();
      }
      super.rerender(document, start);
    }

    /**
     * @override
     */
    public updateDocument(document: ExplorerMathDocument) {
      super.updateDocument(document);
      if (this.explorers?.speech) {
        this.explorers.speech.restarted = this.refocus;
      }
      this.refocus = null;
      if (this.explorers) {
        this.explorers.restart();
      }
    }
  };
}

/**
 * The functions added to MathDocument for the Explorer
 */
export interface ExplorerMathDocument extends HTMLDOCUMENT {
  /**
   * The objects needed for the explorer
   */
  explorerRegions: RegionPool;

  /**
   * Add the Explorer to the MathItems in the MathDocument
   *
   * @returns {HTMLDocument}   The MathDocument (so calls can be chained)
   */
  explorable(): HTMLDOCUMENT;
}

/**
 * The mixin for adding the Explorer to MathDocuments
 *
 * @param {B} BaseDocument      The MathDocument class to be extended
 * @returns {ExplorerMathDocument}  The extended MathDocument class
 *
 * @template B  The MathItem class to extend
 */
export function ExplorerMathDocumentMixin<
  B extends MathDocumentConstructor<HTMLDOCUMENT>,
>(BaseDocument: B): MathDocumentConstructor<ExplorerMathDocument> & B {
  return class extends BaseDocument {
    /**
     * @override
     */
    /* prettier-ignore */
    public static OPTIONS: OptionList = {
      ...BaseDocument.OPTIONS,
      enableExplorer: hasWindow,           // only activate in interactive contexts
      renderActions: expandable({
        ...BaseDocument.OPTIONS.renderActions,
        explorable: [STATE.EXPLORER]
      }),
      sre: expandable({
        ...BaseDocument.OPTIONS.sre,
        speech: 'none',                    // None as speech is explicitly computed
        structure: true,                   // Generates full aria structure
        aria: true,
      }),
      a11y: {
        ...BaseDocument.OPTIONS.a11y,
        align: 'top',                      // placement of magnified expression
        backgroundColor: 'Blue',           // color for background of selected sub-expression
        backgroundOpacity: 20,             // opacity for background of selected sub-expression
        flame: false,                      // color collapsible sub-expressions
        foregroundColor: 'Black',          // color to use for text of selected sub-expression
        foregroundOpacity: 100,            // opacity for text of selected sub-expression
        highlight: 'None',                 // type of highlighting for collapsible sub-expressions
        hover: false,                      // show collapsible sub-expression on mouse hovering
        infoPrefix: false,                 // show speech prefixes on mouse hovering
        infoRole: false,                   // show semantic role on mouse hovering
        infoType: false,                   // show semantic type on mouse hovering
        keyMagnifier: false,               // switch on magnification via key exploration
        magnification: 'None',             // type of magnification
        magnify: '400%',                   // percentage of magnification of zoomed expressions
        mouseMagnifier: false,             // switch on magnification via mouse hovering
        subtitles: false,                  // show speech as a subtitle
        treeColoring: false,               // tree color expression
        viewBraille: false,                // display Braille output as subtitles
        voicing: false,                    // switch on speech output
      }
    };

    /**
     * The objects needed for the explorer
     */
    public explorerRegions: RegionPool = null;

    /**
     * Extend the MathItem class used for this MathDocument
     *   and create the visitor and explorer objects needed for the explorer
     *
     * @override
     * @class
     */
    constructor(...args: any[]) {
      super(...args);
      const ProcessBits = (this.constructor as typeof BaseDocument).ProcessBits;
      if (!ProcessBits.has('explorer')) {
        ProcessBits.allocate('explorer');
      }
      const visitor = new SerializedMmlVisitor(this.mmlFactory);
      const toMathML = (node: MmlNode) => visitor.visitTree(node);
      const options = this.options;
      if (!options.a11y.speechRules) {
        options.a11y.speechRules = `${options.sre.domain}-${options.sre.style}`;
      }
      options.MathItem = ExplorerMathItemMixin(options.MathItem, toMathML);
      this.explorerRegions = new RegionPool(this);
    }

    /**
     * Add the Explorer to the MathItems in this MathDocument
     *
     * @returns {ExplorerMathDocument}   The MathDocument (so calls can be chained)
     */
    public explorable(): ExplorerMathDocument {
      if (!this.processed.isSet('explorer')) {
        if (this.options.enableExplorer) {
          for (const math of this.math) {
            (math as ExplorerMathItem).explorable(this);
          }
        }
        this.processed.set('explorer');
      }
      return this;
    }

    /**
     * @override
     */
    public state(state: number, restore: boolean = false) {
      super.state(state, restore);
      if (state < STATE.EXPLORER) {
        this.processed.clear('explorer');
      }
      return this;
    }
  };
}

/*==========================================================================*/

/**
 * Add Explorer functions to a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @param {MathML} MmlJax     A MathML input jax to be used for the semantic enrichment
 * @returns {Handler}         The handler that was modified (for purposes of chainging extensions)
 */
export function ExplorerHandler(
  handler: HANDLER,
  MmlJax: MATHML = null
): HANDLER {
  if (!handler.documentClass.prototype.enrich && MmlJax) {
    handler = EnrichHandler(handler, MmlJax);
  }
  handler.documentClass = ExplorerMathDocumentMixin(
    handler.documentClass as any
  );
  return handler;
}

/*==========================================================================*/

/* Context Menu Interactions */

/**
 * Sets a list of a11y options for a given document.
 *
 * @param {HTMLDOCUMENT} document The current document.
 * @param {{[key: string]: any}} options Association list for a11y option value pairs.
 */
export function setA11yOptions(
  document: HTMLDOCUMENT,
  options: { [key: string]: any }
) {
  const sreOptions = Sre.engineSetup() as { [name: string]: string };
  for (const key in options) {
    if (document.options.a11y[key] !== undefined) {
      setA11yOption(document, key, options[key]);
    } else if (sreOptions[key] !== undefined) {
      document.options.sre[key] = options[key];
    }
  }
  // Reinit explorers
  for (const item of document.math) {
    (item as ExplorerMathItem)?.explorers?.attach();
  }
}

/**
 * Sets a single a11y option for a menu name.
 *
 * @param {HTMLDOCUMENT} document The current document.
 * @param {string} option The option name in the menu.
 * @param {string|boolean} value The new value.
 */
export function setA11yOption(
  document: HTMLDOCUMENT,
  option: string,
  value: string | boolean
) {
  switch (option) {
    case 'speechRules': {
      const [domain, style] = (value as string).split('-');
      document.options.sre.domain = domain;
      document.options.sre.style = style;
      break;
    }
    case 'magnification':
      switch (value) {
        case 'None':
          document.options.a11y.magnification = value;
          document.options.a11y.keyMagnifier = false;
          document.options.a11y.mouseMagnifier = false;
          break;
        case 'Keyboard':
          document.options.a11y.magnification = value;
          document.options.a11y.keyMagnifier = true;
          document.options.a11y.mouseMagnifier = false;
          break;
        case 'Mouse':
          document.options.a11y.magnification = value;
          document.options.a11y.keyMagnifier = false;
          document.options.a11y.mouseMagnifier = true;
          break;
      }
      break;
    case 'highlight':
      switch (value) {
        case 'None':
          document.options.a11y.highlight = value;
          document.options.a11y.hover = false;
          document.options.a11y.flame = false;
          break;
        case 'Hover':
          document.options.a11y.highlight = value;
          document.options.a11y.hover = true;
          document.options.a11y.flame = false;
          break;
        case 'Flame':
          document.options.a11y.highlight = value;
          document.options.a11y.hover = false;
          document.options.a11y.flame = true;
          break;
      }
      break;
    case 'locale':
      document.options.sre.locale = value;
      break;
    default:
      document.options.a11y[option] = value;
  }
}
