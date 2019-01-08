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
 * @fileoverview  Mixin that adds semantic enrichment to internal MathML
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Handler} from '../core/Handler.js';
import {MathDocument, AbstractMathDocument} from '../core/MathDocument.js';
import {MathItem, AbstractMathItem} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {MathML} from '../input/mathml.js';
import {SerializedMmlVisitor} from '../core/MmlTree/SerializedMmlVisitor.js';


/**
 * The only funciton we need from SRE
 */
export type SRE = {
    toEnriched(mml: string): Element;
    engineReady(): boolean;
};

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new(...args: any[]) => T;

/*==========================================================================*/

/**
 * The funtions added to MathItem for enrichment
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface EnrichedMathItem<N, T, D> extends MathItem<N, T, D> {

    /**
     * True when this MathItem has already been enriched
     */
    isEnriched: boolean;

    /**
     * @param {MathDocument} document  The document where enrchment is occurring
     */
    enrich(document: MathDocument<N, T, D>): void;
}

/**
 * The mixin for adding enrichment to MathItems
 *
 * @param {B} BaseMathItem     The MathItem class to be extended
 * @param {MathML} MmlJax          The MathML input jax used to convert the enriched MathML
 * @param {SRE} sre            The SRE object to do the enrichment
 * @return {EnrichedMathItem}  The enriched MathItem class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathItem class to extend
 */
export function EnrichedMathItemMixin<N, T, D, B extends Constructor<AbstractMathItem<N, T, D>>>(
    BaseMathItem: B,
    MmlJax: MathML<N, T, D>,
    sre: SRE,
    toMathML: (node: MmlNode) => string
): Constructor<EnrichedMathItem<N, T, D>> & B {

    return class extends BaseMathItem {

        public isEnriched: boolean = false;

        /**
         * @param {MathDocument} docuemnt   The MathDocument for the MathItem
         */
        public enrich(document: MathDocument<N, T, D>) {
            if (this.isEnriched) return;
            const math = new document.options.MathItem('', MmlJax);
            math.math = sre.toEnriched(toMathML(this.root)).outerHTML;
            math.display = this.display;
            math.compile(document);
            this.root = math.root;
            this.inputData.originalMml = math.math;
            this.isEnriched = true;
        }

    };

}

/*==========================================================================*/

/**
 * The funtions added to MathDocument for enrichment
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface EnrichedMathDocument<N, T, D> extends AbstractMathDocument<N, T, D> {

    /**
     * Perform enrichment on the MathItems in the MathDocument
     *
     * @return {MathDocument}   The MathDocument (so calls can be chained)
     */
    enrich(): MathDocument<N, T, D>;

}

/**
 * The mixin for adding enrichment to MathDocuments
 *
 * @param {B} BaseMathDocument     The MathDocument class to be extended
 * @param {MathML} MmlJax          The MathML input jax used to convert the enriched MathML
 * @param {SRE} sre                The SRE object to do the enrichment
 * @return {EnrichedMathDocument}  The enriched MathDocument class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathDocument class to extend
 */
export function EnrichedMathDocumentMixin<N, T, D, B extends Constructor<AbstractMathDocument<N, T, D>>>(
    BaseDocument: B,
    MmlJax: MathML<N, T, D>,
    sre: SRE
): Constructor<EnrichedMathDocument<N, T, D>> & B {

    return class extends BaseDocument {

        /**
         * Enrich the MathItem class used for this MathDocument, and create the
         *   temporary MathItem used for enrchment
         *
         * @override
         * @constructor
         */
        constructor(...args: any[]) {
            super(...args);
            MmlJax.setMmlFactory(this.mmlFactory);
            const ProcessBits = (this.constructor as typeof AbstractMathDocument).ProcessBits;
            if (!ProcessBits.has('enrich')) {
                ProcessBits.allocate('enrich');
            }
            const visitor = new SerializedMmlVisitor(this.mmlFactory);
            const toMathML = ((node: MmlNode) => visitor.visitTree(node));
            this.options.MathItem =
                EnrichedMathItemMixin<N, T, D, Constructor<AbstractMathItem<N, T, D>>>(
                    this.options.MathItem, MmlJax, sre, toMathML
                );
        }

        /**
         * Enrich the MathItems in this MathDocument
         */
        public enrich() {
            if (!this.processed.isSet('enrich')) {
                for (const math of this.math) {
                    (math as EnrichedMathItem<N, T, D>).enrich(this);
                }
                this.processed.set('enrich');
            }
            return this;
        }

    };

}

/*==========================================================================*/

/**
 * Add enrichment a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @param {MathML} MmlJax     The MathML input jax to use for reading the enriched MathML
 * @param {SRE} sre           The SRE object to perform the enrichment
 * @return {Handler}          The handler that was modified (for purposes of chainging extensions)
 */
export function EnrichHandler<N, T, D>(handler: Handler<N, T, D>, MmlJax: MathML<N, T, D>, sre: SRE) {
    MmlJax.setAdaptor(handler.adaptor);
    handler.documentClass =
        EnrichedMathDocumentMixin<N, T, D, Constructor<AbstractMathDocument<N, T, D>>>(
            handler.documentClass, MmlJax, sre
        );
    return handler;
}
