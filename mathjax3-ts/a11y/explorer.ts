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

import {MathJax} from '../mathjax.js';
import {Handler} from '../core/Handler.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {HTMLDocument} from '../handlers/html/HTMLDocument.js';
import {HTMLMathItem} from '../handlers/html/HTMLMathItem.js';
import {SerializedMmlVisitor} from '../core/MmlTree/SerializedMmlVisitor.js';

import {SpeechExplorer, Magnifier} from './explorer/Explorer.js';
import {LiveRegion, ToolTip, HoverRegion} from './explorer/Region.js';
import {sreReady} from './sre.js';

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new(...args: any[]) => T;

export type HANDLER = Handler<HTMLElement, Text, Document>;
export type HTMLDOCUMENT = HTMLDocument<HTMLElement, Text, Document>;
export type HTMLMATHITEM = HTMLMathItem<HTMLElement, Text, Document>;

/*==========================================================================*/

/**
 * The properties added to MathItem for the Explorer
 */
export interface ExplorerMathItem extends HTMLMATHITEM {

    /**
     * True when this MathItem has already had the Explorer added to it
     */
    hasExplorer: boolean;

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
export function ExplorerMathItemMixin(
    BaseMathItem: Constructor<HTMLMATHITEM>,
    toMathML: (node: MmlNode) => string
): Constructor<ExplorerMathItem> {

    return class extends BaseMathItem {

        /**
         * True when this MathItem has already had the Explorer added to it
         */
        public hasExplorer: boolean = false;

        /**
         * Add the explorer to the output for this math item
         *
         * @param {HTMLDocument} docuemnt   The MathDocument for the MathItem
         */
        public explorable(document: ExplorerMathDocument) {
            if (this.hasExplorer) return;
            if (!(sre && sre.Engine.isReady())) {
                MathJax.retryAfter(sreReady);
            }
            const node = this.typesetRoot;
            const mml = toMathML(this.root);
            SpeechExplorer.create(document, document.explorerObjects.region, node, mml);
            this.hasExplorer = true;
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
export function ExplorerMathDocumentMixin(BaseDocument: Constructor<HTMLDOCUMENT>): Constructor<ExplorerMathDocument> {

    return class extends BaseDocument {

        /**
         * The objects needed for the explorer
         */
        public explorerObjects: ExplorerObjects;

        /**
         * Extend the MathItem class used for this MathDocument
         *   and create the visitor and exporer objects needed for the explorer
         *
         * @override
         * @constructor
         */
        constructor(...args: any[]) {
            super(...args);
            const ProcessBits = (this.constructor as typeof HTMLDocument).ProcessBits;
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

    };

}

/*==========================================================================*/

/**
 * Add Explorer functions to a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @returns {Handler}         The handler that was modified (for purposes of chainging extensions)
 */
export function ExplorerHandler(handler: Handler<HTMLElement, Text, Document>) {
    handler.documentClass = ExplorerMathDocumentMixin(handler.documentClass as any);
    return handler;
}
