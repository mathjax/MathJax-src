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

import {Explorer, SpeechExplorer, Magnifier} from './explorer/Explorer.js';
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
         * The Explorer object for this math item
         */
        protected explorer: Explorer = null;

        /**
         * True when a rerendered element should restart the explorer
         */
        protected restart: boolean = false;

        /**
         * True when a rerendered element should regain the focus
         */
        protected refocus: boolean = false;

        /**
         * Add the explorer to the output for this math item
         *
         * @param {HTMLDocument} docuemnt   The MathDocument for the MathItem
         */
        public explorable(document: ExplorerMathDocument) {
            if (this.state() >= STATE.EXPLORER) return;
            const node = this.typesetRoot;
            const mml = toMathML(this.root);
            this.explorer = SpeechExplorer.create(document, document.explorerObjects.region, node, mml);
            this.state(STATE.EXPLORER);
        }

        /**
         * @override
         */
        public rerender(document: ExplorerMathDocument, start: number = STATE.RERENDER) {
            this.refocus = (window.document.activeElement === this.typesetRoot);
            if (this.explorer && (this.explorer as any).active) {
                this.restart = true;
                this.explorer.Stop();
            }
            super.rerender(document, start);
        }

        /**
         * @override
         */
        public updateDocument(document: ExplorerMathDocument) {
            super.updateDocument(document);
            this.refocus && this.typesetRoot.focus();
            this.restart && this.explorer.Start();
            this.refocus = this.restart = false;
        }

    };

}

/*==========================================================================*/

/**
 * The objects needed for the explorer
 */
export type ExplorerObjects = {
    region?: LiveRegion,
    tooltip?: ToolTip,
    tooltip2?: ToolTip,
    tooltip3?: ToolTip,
    magnifier?: HoverRegion
}

/**
 * The funtions added to MathDocument for the Explorer
 */
export interface ExplorerMathDocument extends HTMLDOCUMENT {

    /**
     * The objects needed for the explorer
     */
    explorerObjects: ExplorerObjects;

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
            })
        };

        /**
         * The objects needed for the explorer
         */
        public explorerObjects: ExplorerObjects;

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
            this.explorerObjects = {
                region: new LiveRegion(this),
                tooltip: new ToolTip(this),
                tooltip2: new ToolTip(this),
                tooltip3: new ToolTip(this),
                magnifier: new HoverRegion(this)
            };
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
