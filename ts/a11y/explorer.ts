/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Mixin that implements the Explorer
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Handler} from '../core/Handler.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {MathML} from '../input/mathml.js';
import {STATE, newState} from '../core/MathItem.js';
import {EnrichedMathItem, EnrichedMathDocument, EnrichHandler} from './semantic-enrich.js';
import {MathDocumentConstructor} from '../core/MathDocument.js';
import {OptionList, expandable} from '../util/Options.js';
import {SerializedMmlVisitor} from '../core/MmlTree/SerializedMmlVisitor.js';
import {MJContextMenu} from '../ui/menu/MJContextMenu.js';

import {ExplorerPool, RegionPool} from './explorer/ExplorerPool.js';

import {Submenu} from 'mj-context-menu/js/item_submenu.js';

import Sre from './sre.js';

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new(...args: any[]) => T;

/**
 * Shorthands for types with HTMLElement, Text, and Document instead of generics
 */
export type HANDLER = Handler<HTMLElement, Text, Document>;
export type HTMLDOCUMENT = EnrichedMathDocument<HTMLElement, Text, Document>;
export type HTMLMATHITEM = EnrichedMathItem<HTMLElement, Text, Document>;
export type MATHML = MathML<HTMLElement, Text, Document>;

const hasWindow = (typeof window !== 'undefined');

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
     * True when a rerendered element should regain the focus
     */
    protected refocus: boolean = false;

    /**
     * Save explorer id during rerendering.
     */
    protected savedId: string = null;

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
        if (this.savedId) {
          this.typesetRoot.setAttribute('sre-explorer-id', this.savedId);
          this.savedId = null;
        }
        if (!this.explorers) {
          this.explorers = new ExplorerPool();
        }
        this.explorers.init(document, node, mml);
      }
      this.state(STATE.EXPLORER);
    }

    /**
     * @override
     */
    public rerender(document: ExplorerMathDocument, start: number = STATE.RERENDER) {
      this.savedId = this.typesetRoot.getAttribute('sre-explorer-id');
      this.refocus = (hasWindow ? window.document.activeElement === this.typesetRoot : false);
      if (this.explorers) {
        this.explorers.reattach();
      }
      super.rerender(document, start);
    }

    /**
     * @override
     */
    public updateDocument(document: ExplorerMathDocument) {
      super.updateDocument(document);
      this.refocus && this.typesetRoot.focus();
      if (this.explorers) {
        this.explorers.restart();
      }
      this.refocus = false;
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
   * @returns {MathDocument}   The MathDocument (so calls can be chained)
   */
  explorable(): HTMLDOCUMENT;

}

/**
 * The mixin for adding the Explorer to MathDocuments
 *
 * @param {B} BaseDocument      The MathDocument class to be extended
 * @returns {ExplorerMathDocument}  The extended MathDocument class
 */
export function ExplorerMathDocumentMixin<B extends MathDocumentConstructor<HTMLDOCUMENT>>(
  BaseDocument: B
): MathDocumentConstructor<ExplorerMathDocument> & B {

  return class extends BaseDocument {

    /**
     * @override
     */
    public static OPTIONS: OptionList = {
      ...BaseDocument.OPTIONS,
      enableExplorer: hasWindow,           // only activate in interactive contexts
      renderActions: expandable({
        ...BaseDocument.OPTIONS.renderActions,
        explorable: [STATE.EXPLORER]
      }),
      sre: expandable({
        ...BaseDocument.OPTIONS.sre,
        speech: 'shallow',                 // overrides option in EnrichedMathDocument
      }),
      a11y: {
        align: 'top',                      // placement of magnified expression
        backgroundColor: 'Blue',           // color for background of selected sub-expression
        backgroundOpacity: 20,             // opacity for background of selected sub-expression
        braille: false,                    // switch on Braille output
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
        speech: true,                      // switch on speech output
        subtitles: true,                   // show speech as a subtitle
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
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      const ProcessBits = (this.constructor as typeof BaseDocument).ProcessBits;
      if (!ProcessBits.has('explorer')) {
        ProcessBits.allocate('explorer');
      }
      const visitor = new SerializedMmlVisitor(this.mmlFactory);
      const toMathML = ((node: MmlNode) => visitor.visitTree(node));
      const options = this.options;
      if (!options.a11y.speechRules) {
        options.a11y.speechRules = `${options.sre.domain}-${options.sre.style}`;
      }
      options.MathItem = ExplorerMathItemMixin(options.MathItem, toMathML);
    }

    /**
     * Add the Explorer to the MathItems in this MathDocument
     *
     * @return {ExplorerMathDocument}   The MathDocument (so calls can be chained)
     */
    public explorable(): ExplorerMathDocument {
      if (!this.processed.isSet('explorer')) {
        if (this.options.enableExplorer) {
          if (!this.explorerRegions) {
            this.explorerRegions = new RegionPool(this);
          }
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
export function ExplorerHandler(handler: HANDLER, MmlJax: MATHML = null): HANDLER {
  if (!handler.documentClass.prototype.enrich && MmlJax) {
    handler = EnrichHandler(handler, MmlJax);
  }
  handler.documentClass = ExplorerMathDocumentMixin(handler.documentClass as any);
  return handler;
}


/*==========================================================================*/

/* Context Menu Interactions */

/**
 * Sets a list of a11y options for a given document.
 * @param {HTMLDOCUMENT} document The current document.
 * @param {{[key: string]: any}} options Association list for a11y option value pairs.
 */
export function setA11yOptions(document: HTMLDOCUMENT, options: {[key: string]: any}) {
  let sreOptions = Sre.engineSetup() as {[name: string]: string};
  for (let key in options) {
    if (document.options.a11y[key] !== undefined) {
      setA11yOption(document, key, options[key]);
      if (key === 'locale') {
        document.options.sre[key] = options[key];
      }
      continue;
    }
    if (sreOptions[key] !== undefined) {
      document.options.sre[key] = options[key];
    }
  }
  // Reinit explorers
  for (let item of document.math) {
    (item as ExplorerMathItem).explorers.attach();
  }
}


/**
 * Sets a single a11y option for a menu name.
 * @param {HTMLDOCUMENT} document The current document.
 * @param {string} option The option name in the menu.
 * @param {string|boolean} value The new value.
 */
export function setA11yOption(document: HTMLDOCUMENT, option: string, value: string | boolean) {
  switch (option) {
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
  default:
    document.options.a11y[option] = value;
  }
}

/**
 * Values for the ClearSpeak preference variables.
 */
let csPrefsSetting: {[pref: string]: string} = {};

/**
 * Generator of all variables for the Clearspeak Preference settings.
 * @param {MJContextMenu} menu The current context menu.
 * @param {string[]} prefs The preferences.
 */
let csPrefsVariables = function(menu: MJContextMenu, prefs: string[]) {
  let srVariable = menu.pool.lookup('speechRules');
  for (let pref of prefs) {
    if (csPrefsSetting[pref]) continue;
    menu.factory.get('variable')(menu.factory, {
      name: 'csprf_' + pref,
      setter: (value: string) => {
        csPrefsSetting[pref] = value;
          srVariable.setValue(
          'clearspeak-' +
              Sre.clearspeakPreferences.addPreference(
                Sre.clearspeakStyle(), pref, value)
        );
      },
      getter: () => { return csPrefsSetting[pref] || 'Auto'; }
    }, menu.pool);
  }
};

/**
 * Generate the selection box for the Clearspeak Preferences.
 * @param {MJContextMenu} menu The current context menu.
 * @param {string} locale The current locale.
 */
let csSelectionBox = function(menu: MJContextMenu, locale: string) {
  let prefs = Sre.clearspeakPreferences.getLocalePreferences();
  let props = prefs[locale];
  if (!props) {
    let csEntry = menu.findID('Accessibility', 'Speech', 'Clearspeak');
    if (csEntry) {
      csEntry.disable();
    }
    return null;
  }
  csPrefsVariables(menu, Object.keys(props));
  let items = [];
  for (const prop of Object.getOwnPropertyNames(props)) {
    items.push({
      'title': prop,
      'values': props[prop].map(x => x.replace(RegExp('^' + prop + '_'), '')),
      'variable': 'csprf_' + prop
    });
  }
  let sb = menu.factory.get('selectionBox')(menu.factory, {
    'title': 'Clearspeak Preferences',
    'signature': '',
    'order': 'alphabetic',
    'grid': 'square',
    'selections': items
  }, menu);
  return {'type': 'command',
          'id': 'ClearspeakPreferences',
          'content': 'Select Preferences',
          'action': () => sb.post(0, 0)};
};

/**
 * Creates dynamic clearspeak menu.
 * @param {MJContextMenu} menu The context menu.
 * @param {Submenu} sub The submenu to attach.
 */
let csMenu = function(menu: MJContextMenu, sub: Submenu) {
  let locale = menu.pool.lookup('locale').getValue() as string;
  const box = csSelectionBox(menu, locale);
  let items: Object[] = [];
  try {
    items = Sre.clearspeakPreferences.smartPreferences(
      menu.mathItem, locale);
  } catch (e) {
    console.log(e);
  }
  if (box) {
    items.splice(2, 0, box);
  }
  return menu.factory.get('subMenu')(menu.factory, {
    items: items,
    id: 'Clearspeak'
  }, sub);
};

MJContextMenu.DynamicSubmenus.set('Clearspeak', csMenu);

/**
 * Creates dynamic locale menu.
 * @param {MJContextMenu} menu The context menu.
 * @param {Submenu} sub The submenu to attach.
 */
let language = function(menu: MJContextMenu, sub: Submenu) {
  let radios: {type: string, id: string,
               content: string, variable: string}[] = [];
  for (let lang of Sre.locales.keys()) {
    if (lang === 'nemeth') continue;
    radios.push({type: 'radio', id: lang,
                 content: Sre.locales.get(lang) || lang, variable: 'locale'});
  }
  radios.sort((x, y) => x.content.localeCompare(y.content, 'en'));
  return menu.factory.get('subMenu')(menu.factory, {
    items: radios, id: 'Language'}, sub);
};

MJContextMenu.DynamicSubmenus.set('A11yLanguage', language);
