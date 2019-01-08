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
import {MathItem} from '../core/MathItem.js';
import {MathML} from '../input/mathml.js';
import {MmlNode, AbstractMmlTokenNode} from '../core/MmlTree/MmlNode.js';
import {EnrichHandler, EnrichedMathItem, EnrichedMathDocument} from './semantic-enrich.js';
import {ComplexityVisitor} from './complexity/visitor.js';
import {OptionList, selectOptionsFromKeys} from '../util/Options.js';

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
 * The funtions added to MathItem for complexity
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ComplexityMathItem<N, T, D> extends EnrichedMathItem<N, T, D> {
    /**
     * True if complexity has been computed
     */
    complexityComputed: boolean;

    /**
     * @param {MathDocument} docuemnt   The MathDocument for the MathItem
     */
    complexity(document: MathDocument<N, T, D>): void;
}

/**
 * The mixin for adding complexity to MathItems
 *
 * @param {B} BaseMathItem       The MathItem class to be extended
 * @return {ComplexityMathItem}  The complexity MathItem class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathItem class to extend
 */
export function ComplexityMathItemMixin<N, T, D, B extends Constructor<EnrichedMathItem<N, T, D>>>(
    BaseMathItem: B,
    computeComplexity: (node: MmlNode) => void
): Constructor<ComplexityMathItem<N, T, D>> & B {

    return class extends BaseMathItem {

        public complexityComputed: boolean = false;

        /**
         * @param {MathDocument} docuemnt   The MathDocument for the MathItem
         */
        public complexity(document: MathDocument<N, T, D>) {
            if (this.complexityComputed) return;
            this.enrich(document);
            computeComplexity(this.root);
            this.complexityComputed = true;
        }

    };

}

/*==========================================================================*/

/**
 * The funtions added to MathDocument for complexity
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ComplexityMathDocument<N, T, D> extends EnrichedMathDocument<N, T, D> {
    /**
     * Perform complexity computations on the MathItems in the MathDocument
     *
     * @return {MathDocument}   The MathDocument (so calls can be chained)
     */
    complexity(): MathDocument<N, T, D>;
}

/**
 * The mixin for adding complexity to MathDocuments
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
export function ComplexityMathDocumentMixin<N, T, D, B extends Constructor<EnrichedMathDocument<N, T, D>>>(
    BaseDocument: B
): Constructor<ComplexityMathDocument<N, T, D>> & B {

    return class extends BaseDocument {

        public static OPTIONS: OptionList = {
            ...(BaseDocument as any as typeof AbstractMathDocument).OPTIONS,
            ...ComplexityVisitor.OPTIONS,
            ComplexityVisitor: ComplexityVisitor
        };

        private complexityVisitor: ComplexityVisitor;

        /**
         * Extend the MathItem class used for this MathDocument
         *
         * @override
         * @constructor
         */
        constructor(...args: any[]) {
            super(...args);
            const ProcessBits = (this.constructor as typeof AbstractMathDocument).ProcessBits;
            if (!ProcessBits.has('getComplexity')) {
                ProcessBits.allocate('getComplexity');
            }
            const visitorOptions = selectOptionsFromKeys(this.options, this.options.ComplexityVisitor.OPTIONS);
            this.complexityVisitor = new this.options.ComplexityVisitor(this.mmlFactory, visitorOptions);
            const computeComplexity = ((node: MmlNode) => this.complexityVisitor.visitTree(node));
            this.options.MathItem =
                ComplexityMathItemMixin<N, T, D, Constructor<EnrichedMathItem<N, T, D>>>(
                    this.options.MathItem, computeComplexity
                );
        }

        /**
         * Compute the complexity the MathItems in this MathDocument
         */
        public complexity() {
            if (!this.processed.isSet('getComplexity')) {
                for (const math of this.math) {
                    (math as ComplexityMathItem<N, T, D>).complexity(this);
                }
                this.processed.set('getComplexity');
            }
            return this;
        }

    };

}

/*==========================================================================*/

/**
 * Add complexity computations a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @param {MathML} MmlJax     The MathML input jax to use for reading the enriched MathML
 * @param {SRE} sre           The SRE object to perform the enrichment
 * @return {Handler}          The handler that was modified (for purposes of chainging extensions)
 */
export function ComplexityHandler<N, T, D>(handler: Handler<N, T, D>, MmlJax: MathML<N, T, D>, sre: SRE) {
    handler = EnrichHandler(handler, MmlJax, sre);
    handler.documentClass =
        ComplexityMathDocumentMixin<N, T, D, Constructor<EnrichedMathDocument<N, T, D>>>(
            handler.documentClass as any as Constructor<EnrichedMathDocument<N, T, D>>
        );
    return handler;
}
