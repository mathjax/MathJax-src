/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
import {BitField} from '../util/BitField.js';
import {SerializedMmlVisitor} from '../core/MmlTree/SerializedMmlVisitor.js';

import {Explorer} from './explorer/Explorer.js';
import * as ke from './explorer/KeyExplorer.js';
import * as me from './explorer/MouseExplorer.js';
import {TreeColorer, FlameColorer} from './explorer/TreeExplorer.js';
import {LiveRegion, ToolTip, HoverRegion} from './explorer/Region.js';

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
     * @param {HTMLDocument} document  The document where the Explorer is being added
     */
    explorable(document: HTMLDOCUMENT): void;

    attachExplorers(document: HTMLDOCUMENT): void;
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
         * The Explorer objects for this math item
         */
        protected explorers: {[key: string]: Explorer} = {};

        /**
         * The currently attached explorers
         */
        protected attached: Explorer[] = [];

        /**
         * True when a rerendered element should restart the explorer
         */
        protected restart: boolean = false;

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
         * @param {HTMLDocument} docuemnt   The MathDocument for the MathItem
         */
        public explorable(document: ExplorerMathDocument) {
            if (this.state() >= STATE.EXPLORER) return;
            const node = this.typesetRoot;
            const mml = toMathML(this.root);
            if (this.savedId) {
                this.typesetRoot.setAttribute('sre-explorer-id', this.savedId);
                this.savedId = null;
            }
            // Init explorers:
            // Make these part of the explorer.
            this.explorers = initExplorers(document, node, mml);
            this.attachExplorers(document);
            // Attach explorers, returns the ones that need to be reactivated.
            this.state(STATE.EXPLORER);
        }


        public attachExplorers(document: ExplorerMathDocument) {
            this.attached = [];
            for (let key of Object.keys(this.explorers)) {
                let explorer = this.explorers[key];
                if (document.options.a11y[key]) {
                    explorer.Attach();
                    this.attached.push(explorer);
                } else {
                    explorer.Detach();
                }
            }
            this.addExplorers(this.attached);
        }


        /**
         * @override
         */
        public rerender(document: ExplorerMathDocument, start: number = STATE.RERENDER) {
            this.savedId = this.typesetRoot.getAttribute('sre-explorer-id');
            this.refocus = (window.document.activeElement === this.typesetRoot);
            for (let explorer of this.attached) {
                if (explorer.active) {
                    this.restart = true;
                    explorer.Stop();
                }
            }
            super.rerender(document, start);
        }

        /**
         * @override
         */
        public updateDocument(document: ExplorerMathDocument) {
            super.updateDocument(document);
            this.refocus && this.typesetRoot.focus();
            this.restart && this.attached.forEach(x => x.Start());
            this.refocus = this.restart = false;
        }


        /**
         * Adds a list of explorers and makes sure the right one stops propagating.
         * @param {Explorer[]} explorers The active explorers to be added.
         */
        private addExplorers(explorers: Explorer[]) {
            if (explorers.length <= 1) return;
            let lastKeyExplorer = null;
            for (let explorer of this.attached) {
                if (!(explorer instanceof ke.AbstractKeyExplorer)) continue;
                if (lastKeyExplorer) {
                    lastKeyExplorer.stoppable = false;
                }
                lastKeyExplorer = explorer;
                lastKeyExplorer.stoppable = true;
            }
        }

    };

}

/**
 * The funtions added to MathDocument for the Explorer
 */
export interface ExplorerMathDocument extends HTMLDOCUMENT {

    /**
     * The objects needed for the explorer
     */
    explorerRegions: ExplorerRegions;

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
 * @param {B} BaseMathDocument      The MathDocument class to be extended
 * @returns {ExplorerMathDocument}  The extended MathDocument class
 */
export function ExplorerMathDocumentMixin<B extends MathDocumentConstructor<HTMLDOCUMENT>>(
    BaseDocument: B
): MathDocumentConstructor<ExplorerMathDocument> & B {

    return class extends BaseDocument {

        public static OPTIONS: OptionList = {
            ...BaseDocument.OPTIONS,
            renderActions: expandable({
                ...BaseDocument.OPTIONS.renderActions,
                explorable: [STATE.EXPLORER]
            }),
            a11y: {
                align: 'top',
                backgroundColor: 'Blue',
                backgroundOpacity: .2,
                braille: true,
                flame: true,
                foregroundColor: 'Black',
                foregroundOpacity: 1,
                highlight: 'None',
                hover: false,
                infoPrefix: false,
                infoRole: false,
                infoType: false,
                keymagnifier: false,
                magnification: 'None',
                magnify: 500,
                mousemagnifier: false,
                speech: true,
                subtitles: true,
                treecoloring: true,
                viewbraille: false
          }
        };

        /**
         * The objects needed for the explorer
         */
        public explorerRegions: ExplorerRegions;

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
            this.options.MathItem = ExplorerMathItemMixin(this.options.MathItem, toMathML);
            this.explorerRegions = initExplorerRegions(this);
        }

        /**
         * Add the Explorer to the MathItems in this MathDocument
         *
         * @return {ExplorerMathDocument}   The MathDocument (so calls can be chained)
         */
        public explorable() {
            if (!this.processed.isSet('explorer')) {
                for (const math of this.math) {
                    (math as ExplorerMathItem).explorable(this);
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
export function ExplorerHandler(handler: HANDLER, MmlJax: MATHML = null) {
    if (!handler.documentClass.prototype.enrich && MmlJax) {
        handler = EnrichHandler(handler, MmlJax);
    }
    handler.documentClass = ExplorerMathDocumentMixin(handler.documentClass as any);
    return handler;
}


/*==========================================================================*/

/**
 * The objects needed for the explorer
 */
export type ExplorerRegions = {
    speechRegion?: LiveRegion,
    brailleRegion?: LiveRegion,
    magnifier?: HoverRegion,
    tooltip1?: ToolTip,
    tooltip2?: ToolTip,
    tooltip3?: ToolTip
}


function initExplorerRegions(document: ExplorerMathDocument) {
    return {
        speechRegion: new LiveRegion(document),
        brailleRegion: new LiveRegion(document),
        magnifier: new HoverRegion(document),
        tooltip1: new ToolTip(document),
        tooltip2: new ToolTip(document),
        tooltip3: new ToolTip(document)
    };
}


// Each explorer has a name, an option and a region associated.


type ExplorerInit = (doc: ExplorerMathDocument,
                     node: HTMLElement, ...rest: any[]) => Explorer;

/**
 *  Generation methods for all MathJax explorers available via option settings.
 */
let allExplorers: {[options: string]: ExplorerInit} = {
    speech: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) => {
        let explorer = ke.SpeechExplorer.create(
            doc, doc.explorerRegions.speechRegion, node, ...rest) as ke.SpeechExplorer;
        explorer.speechGenerator.setOptions({locale: 'en', domain: 'mathspeak',
                                             style: 'default', modality: 'speech'});
        explorer.showRegion = 'subtitles';
        return explorer;
    },
    braille: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) => {
        let explorer = ke.SpeechExplorer.create(
            doc, doc.explorerRegions.brailleRegion, node, ...rest) as ke.SpeechExplorer;
        explorer.speechGenerator.setOptions({locale: 'nemeth', domain: 'default',
                                             style: 'default', modality: 'braille'});
        explorer.showRegion = 'viewbraille';
        return explorer;
    },
    keymagnifier: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) =>
        ke.Magnifier.create(doc, doc.explorerRegions.magnifier, node, ...rest),
    mousemagnifier: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) =>
        me.ContentHoverer.create(doc, doc.explorerRegions.magnifier, node,
                                 (x: HTMLElement) => x.hasAttribute('data-semantic-type'),
                                 (x: HTMLElement) => x),
    hover: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) =>
        me.FlameHoverer.create(doc, null, node),
    infoType: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) =>
        me.ValueHoverer.create(doc, doc.explorerRegions.tooltip1, node,
                               (x: HTMLElement) => x.hasAttribute('data-semantic-type'),
                               (x: HTMLElement) => x.getAttribute('data-semantic-type')),
    infoRole: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) =>
        me.ValueHoverer.create(doc, doc.explorerRegions.tooltip2, node,
                               (x: HTMLElement) => x.hasAttribute('data-semantic-role'),
                               (x: HTMLElement) => x.getAttribute('data-semantic-role')),
    infoPrefix: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) =>
        me.ValueHoverer.create(doc, doc.explorerRegions.tooltip3, node,
                               (x: HTMLElement) => x.hasAttribute('data-semantic-prefix'),
                               (x: HTMLElement) => x.getAttribute('data-semantic-prefix')),
    // Missing: FlameHighlighter, TreeHighlighter
    flame: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) =>
        FlameColorer.create(doc, null, node),
    treecoloring: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) =>
        TreeColorer.create(doc, null, node, ...rest)
};


/**
 * Initialises explorers for a document.
 * @param {ExplorerMathDocument} document The target document.
 * @param {HTMLElement} node The node explorers will be attached to.
 * @param {string} mml The corresponding Mathml node as a string.
 * @return {Explorer[]} A list of initialised explorers.
 */
function initExplorers(document: ExplorerMathDocument, node: HTMLElement, mml: string): {[key: string]: Explorer} {
    let explorers: {[key: string]: Explorer} = {};
    for (let key of Object.keys(allExplorers)) {
        explorers[key] = allExplorers[key](document, node, mml);
    }
    return explorers;
}


/* Context Menu Interactions */


export function setA11yOptions(document: HTMLDOCUMENT, options: {[key: string]: any}) {
    for (let key in options) {
        if (document.options.a11y[key] !== undefined) {
            setA11yOption(document, key, options[key]);
        }
    }
    // Reinit explorers
    for (let item of document.math ) {
        (item as ExplorerMathItem).attachExplorers(document as ExplorerMathDocument);
    }
}


/**
 * Sets a single a11y option for a menu name.
 * @param {HTMLDOCUMENT} document The current document.
 * @param {string} option The option name in the menu.
 * @param {string|boolean} value The new value.
 */
export function setA11yOption(document: HTMLDOCUMENT, option: string, value: string|boolean) {
    switch (option) {
    case 'magnification':
        switch (value) {
        case 'None':
            document.options.a11y.magnifier = value;
            document.options.a11y.keymagnifier = false;
            document.options.a11y.mousemagnifier = false;
            break;
        case 'Keyboard':
            document.options.a11y.magnifier = value;
            document.options.a11y.keymagnifier = true;
            document.options.a11y.mousemagnifier = false;
            break;
        case 'Mouse':
            document.options.a11y.magnifier = value;
            document.options.a11y.keymagnifier = false;
            document.options.a11y.mousemagnifier = true;
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
        // TODO: magnify, similar to zscale.
    default:
        document.options.a11y[option] = value;
    }
}
