/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
import { SpeechMathItem, SpeechMathDocument, SpeechHandler } from './speech.js';
import { MathDocumentConstructor } from '../core/MathDocument.js';
import { OptionList, expandable } from '../util/Options.js';
import { SerializedMmlVisitor } from '../core/MmlTree/SerializedMmlVisitor.js';
import { hasWindow } from '../util/context.js';
import { StyleJson } from '../util/StyleJson.js';
import { context } from '../util/context.js';

import { ExplorerPool, RegionPool } from './explorer/ExplorerPool.js';

import * as Sre from './sre.js';

const isUnix = context.os === 'Unix';

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new (...args: any[]) => T;

/**
 * Shorthands for types with HTMLElement, Text, and Document instead of generics
 */
export type HANDLER = Handler<HTMLElement, Text, Document>;
export type HTMLDOCUMENT = SpeechMathDocument<HTMLElement, Text, Document> & {
  menu?: any;
};
export type HTMLMATHITEM = SpeechMathItem<HTMLElement, Text, Document>;
export type MATHML = MathML<HTMLElement, Text, Document>;

/*==========================================================================*/

/**
 * Add STATE value for having the Explorer added (after INSERTED and before CONTEXT_MENU)
 */
newState('EXPLORER', STATE.INSERTED + 30);

/**
 * The properties added to MathItem for the Explorer
 */
export interface ExplorerMathItem extends HTMLMATHITEM {
  /**
   * The value to use for the aria role for mjx-speech elements
   */
  ariaRole: string;

  /**
   * The aria-roleDescription to use for the math
   */
  roleDescription: string;

  /**
   * The string to use for when there is no description;
   */
  none: string;

  /**
   * The string to use for when there is no Braille description;
   */
  brailleNone: string;

  /**
   * The Explorer objects for this math item
   */
  explorers: ExplorerPool;

  /**
   * Semantic id of the rerendered element that should regain the focus.
   */
  refocus: string;

  /**
   * @param {HTMLDocument} document  The document where the Explorer is being added
   * @param {boolean} force          True to force the explorer even if enableExplorer is false
   */
  explorable(document: HTMLDOCUMENT, force?: boolean): void;

  /**
   * @param {ExplorerMathDocument} document  The explorer document being used
   * @returns {HTMLElement}                  The temporary focus element, if any
   */
  setTemporaryFocus(document: ExplorerMathDocument): HTMLElement;

  /**
   * @param {HTMLElement} focus  The temporary focus element, if any
   */
  clearTemporaryFocus(focus: HTMLElement): void;
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
  return class BaseClass extends BaseMathItem {
    /**
     * The value to use for the aria role for mjx-speech elements
     */
    protected static ariaRole: string = isUnix ? 'tree' : 'application';

    /**
     * The aria-roleDescription to use for the math
     */
    protected static roleDescription: string = 'math';

    /**
     * Decription to use when set to none
     *  (private-use-1 is not spoken by any screen reader tested)
     */
    protected static none: string = '\u0091';

    /**
     * Braille decription to use when set to none
     */
    protected static brailleNone: string = '\u2800';

    public get ariaRole() {
      return (this.constructor as typeof BaseClass).ariaRole;
    }

    public get roleDescription() {
      const CLASS = this.constructor as typeof BaseClass;
      return CLASS.roleDescription === 'none'
        ? CLASS.none
        : CLASS.roleDescription;
    }

    public get none() {
      return (this.constructor as typeof BaseClass).none;
    }

    public get brailleNone() {
      return (this.constructor as typeof BaseClass).brailleNone;
    }

    /**
     * @override
     */
    public explorers: ExplorerPool;

    /**
     * @override
     */
    public refocus: string = null;

    /**
     * @override
     */
    public attachSpeech(document: ExplorerMathDocument) {
      super.attachSpeech(document);
      this.outputData.speechPromise
        ?.then(() => this.explorers.speech.attachSpeech())
        ?.then(() => {
          if (this.explorers?.speech) {
            this.explorers.speech.restarted = this.refocus;
          }
          this.refocus = null;
          if (this.explorers) {
            this.explorers.restart();
          }
        });
    }

    /**
     * @override
     */
    public detachSpeech(document: ExplorerMathDocument) {
      super.detachSpeech(document);
      this.explorers.speech.detachSpeech();
    }

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
    public state(state: number = null, restore: boolean = false) {
      if (state < STATE.EXPLORER && this.explorers) {
        for (const explorer of Object.values(this.explorers.explorers)) {
          if (explorer.active) {
            explorer.Stop();
          }
        }
      }
      return super.state(state, restore);
    }

    /**
     * @override
     */
    public rerender(
      document: ExplorerMathDocument,
      start: number = STATE.RERENDER
    ) {
      const focus = this.setTemporaryFocus(document);
      super.rerender(document, start);
      this.clearTemporaryFocus(focus);
    }

    /**
     * Focuses a temporary element during rerendering
     *
     * @param {ExplorerMathDocument} document   The explorer document to use
     * @returns {HTMLElement}                   The temporary focus element, if any
     */
    public setTemporaryFocus(document: ExplorerMathDocument): HTMLElement {
      let focus = null;
      if (this.explorers) {
        const speech = this.explorers.speech;
        focus = speech?.attached ? document.tmpFocus : null;
        if (focus) {
          this.refocus = speech.semanticFocus() ?? null;
          const adaptor = document.adaptor;
          adaptor.append(adaptor.body(), focus);
        }
        this.explorers.reattach();
        focus?.focus();
      }
      return focus;
    }

    /**
     * Removes the temporary element after rerendering
     *
     * @param {HTMLElement} focus  The temporary focus element, if any
     */
    public clearTemporaryFocus(focus: HTMLElement) {
      if (focus) {
        const promise = this.outputData.speechPromise ?? Promise.resolve();
        promise.then(() => setTimeout(() => focus.remove(), 100));
      }
    }
  };
}

/**
 * The functions added to MathDocument for the Explorer
 */
export interface ExplorerMathDocument extends HTMLDOCUMENT {
  /**
   * The info icon for the selected expression
   */
  infoIcon: HTMLElement;

  /**
   * An element ot use for temporary focus during rerendering
   */
  tmpFocus: HTMLElement;

  /**
   * The objects needed for the explorer
   */
  explorerRegions: RegionPool;

  /**
   * The MathItem with the active KeyExplorer, if any
   */
  activeItem: ExplorerMathItem;

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
  return class BaseClass extends BaseDocument {
    /**
     * @override
     */
    /* prettier-ignore */
    public static OPTIONS: OptionList = {
      ...BaseDocument.OPTIONS,
      enableExplorer: hasWindow,           // only activate in interactive contexts
      enableExplorerHelp: true,            // help dialog is enabled
      renderActions: expandable({
        ...BaseDocument.OPTIONS.renderActions,
        explorable: [STATE.EXPLORER]
      }),
      sre: expandable({
        ...BaseDocument.OPTIONS.sre,
        speech: 'none',                    // None as speech is explicitly computed
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
        brailleSpeech: false,              // use aria-label for Braille
        brailleCombine: false,             // combine Braille with speech output
        help: true,                        // include "press h for help" messages on focus
        roleDescription: 'math',           // the role description to use for math expressions
        tabSelects: 'all',                 // 'all' for whole expression, 'last' for last explored node
      }
    };

    /**
     * Styles to add for speech
     */
    public static speechStyles: StyleJson = {
      'mjx-container[has-speech="true"]': {
        position: 'relative',
        cursor: 'default',
      },
      'mjx-speech': {
        position: 'absolute',
        'z-index': -1,
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      },
      'mjx-speech:focus': {
        outline: 'none',
      },
      'mjx-container .mjx-selected': {
        outline: '2px solid black',
      },

      'mjx-container a[data-mjx-href]': {
        color: 'LinkText',
        cursor: 'pointer',
      },
      'mjx-container a[data-mjx-href].mjx-visited': {
        color: 'VisitedText',
      },

      'mjx-container > mjx-help': {
        display: 'none',
        position: 'absolute',
        top: '-.3em',
        right: '-.5em',
        width: '.6em',
        height: '.6em',
        cursor: 'pointer',
      },
      'mjx-container[display="true"] > mjx-help': {
        position: 'sticky',
        inset: '-100% 0 100% 0',
        margin: '-.3em -.5em 0 -.1em',
        right: 0,
        top: 'initial',
      },
      'mjx-help > svg': {
        stroke: 'black',
        width: '100%',
        height: '100%',
      },
      'mjx-help > svg > circle': {
        'stroke-width': '1.5px',
        cx: '9px',
        cy: '9px',
        r: '9px',
        fill: 'white',
      },
      'mjx-help > svg > circle:nth-child(2)': {
        fill: 'var(--mjx-bg1-color)',
        r: '7px',
      },
      'mjx-help > svg > line': {
        'stroke-width': '2.5px',
        'stroke-linecap': 'round',
      },
      'mjx-help:hover > svg > circle:nth-child(2)': {
        fill: 'white',
      },
      'mjx-container.mjx-explorer-active > mjx-help': {
        display: 'inline-flex',
        'align-items': 'center',
      },
      '@media (prefers-color-scheme: dark) /* explorer */': {
        'mjx-help > svg': {
          stroke: '#E0E0E0',
        },
        'mjx-help > svg > circle': {
          fill: '#404040',
        },
        'mjx-help > svg > circle:nth-child(2)': {
          fill: 'rgba(132, 132, 255, .3)',
        },
        'mjx-help:hover > svg > circle:nth-child(2)': {
          stroke: '#AAAAAA',
          fill: '#404040',
        },
      },
    };

    /**
     * The info icon for the selected expression
     */
    public infoIcon: HTMLElement;

    /**
     * An element ot use for temporary focus during rerendering
     */
    public tmpFocus: HTMLElement;

    /**
     * The objects needed for the explorer
     */
    public explorerRegions: RegionPool = null;

    /**
     * The MathItem with the active KeyExplorer, if any
     */
    public activeItem: ExplorerMathItem = null;

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
      const mathItem = (options.MathItem = ExplorerMathItemMixin(
        options.MathItem,
        toMathML
      ));
      mathItem.roleDescription = options.roleDescription;
      this.explorerRegions = new RegionPool(this);
      if ('addStyles' in this) {
        (this as any).addStyles(
          (this.constructor as typeof BaseClass).speechStyles
        );
      }
      const adaptor = this.adaptor;
      const SVGNS = 'http://www.w3.org/2000/svg';
      this.infoIcon = adaptor.node('mjx-help', {}, [
        adaptor.node(
          'svg',
          { viewBox: '0 0 18 18', xmlns: SVGNS, 'aria-hidden': 'true' },
          [
            adaptor.node('circle', { stroke: 'none' }, [], SVGNS),
            adaptor.node('circle', {}, [], SVGNS),
            adaptor.node('line', { x1: 9, y1: 9, x2: 9, y2: 13 }, [], SVGNS),
            adaptor.node('line', { x1: 9, y1: 5.5, x2: 9, y2: 5.5 }, [], SVGNS),
          ],
          SVGNS
        ),
      ]);
      this.tmpFocus = adaptor.node('mjx-focus', {
        tabIndex: 0,
        style: {
          outline: 'none',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: '-10px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        },
        role: mathItem.ariaRole,
        'aria-label': mathItem.none,
        'aria-roledescription': mathItem.none,
      });
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
    public rerender(start?: number) {
      const active = this.activeItem;
      const focus = active?.setTemporaryFocus(this);
      super.rerender(start);
      active?.clearTemporaryFocus(focus);
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
  if (!handler.documentClass.prototype.attachSpeech) {
    handler = SpeechHandler(handler, MmlJax);
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
  // TODO (volker): This needs to be replace by the engine feature vector.
  // Minus rule sets etc. Breaking change in SRE.
  const sreOptions = Sre.engineSetup() as { [name: string]: string };
  for (const key in options) {
    if (document.options.a11y[key] !== undefined) {
      setA11yOption(document, key, options[key]);
    } else if (sreOptions[key] !== undefined) {
      document.options.sre[key] = options[key];
    }
  }
  if (options.roleDescription) {
    document.options.MathItem.roleDescription = options.roleDescription;
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
