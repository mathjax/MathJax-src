/*************************************************************
 *
 *  Copyright (c) 2018-2026 The MathJax Consortium
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
 * @file  Mixin that computes complexity of the internal MathML
 *                and optionally marks collapsible items
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { Handler } from '../core/Handler.js';
import {
  MathDocumentConstructor,
  RenderActions,
} from '../core/MathDocument.js';
import { STATE, newState } from '../core/MathItem.js';
import { MathML } from '../input/mathml.js';
import {
  EnrichHandler,
  EnrichedMathItem,
  EnrichedMathDocument,
  ENRICH_OPTIONS,
} from './semantic-enrich.js';
import { ComplexityVisitor } from './complexity/visitor.js';
import { selectOptionsFromKeys, expandable } from '../util/Options.js';
import { DOM_TYPES, Constructor } from '../types/Types.js';

/**
 * Shorthands for constructors
 */
export type EMItemC<DOM extends DOM_TYPES> = Constructor<EnrichedMathItem<DOM>>;
export type CMItemC<DOM extends DOM_TYPES> = Constructor<
  ComplexityMathItem<DOM>
>;
export type EMDocC<DOM extends DOM_TYPES> = MathDocumentConstructor<
  EnrichedMathDocument<DOM>,
  DOM
>;
export type CMDocC<DOM extends DOM_TYPES> = Constructor<
  ComplexityMathDocument<DOM>
>;

/*==========================================================================*/

/**
 * Add STATE value for having complexity added (after ENRICHED and before TYPESET)
 */
newState('COMPLEXITY', 40);

/**
 * The functions added to MathItem for complexity
 *
 * @template DOM   The DOM node types
 */
export interface ComplexityMathItem<
  DOM extends DOM_TYPES,
> extends EnrichedMathItem<DOM> {
  /**
   * The starting collapse ID for this expression
   */
  initialID: number;

  /**
   * @param {ComplexityMathDocument} document   The MathDocument for the MathItem
   * @param {boolean} force                     True to force the computation even if enableComplexity is false
   */
  complexity(document: ComplexityMathDocument<DOM>, force?: boolean): void;
}

/**
 * The mixin for adding complexity to MathItems
 *
 * @param {B} BaseMathItem                                         The MathItem class to be extended
 * @param {(math: ComplexityMathItem) => void} computeComplexity   Method of complexity computation.
 * @returns {ComplexityMathItem}                                   The complexity MathItem class
 *
 * @template DOM   The DOM node types
 * @template B     The MathItem class to extend
 */
export function ComplexityMathItemMixin<
  DOM extends DOM_TYPES,
  B extends EMItemC<DOM>,
>(
  BaseMathItem: B,
  computeComplexity: (math: ComplexityMathItem<DOM>) => void
): CMItemC<DOM> & B {
  return class extends BaseMathItem {
    /**
     * The starting collapse ID for this expression
     */
    public initialID: number = null;

    /**
     * @param {ComplexityMathDocument} document   The MathDocument for the MathItem
     * @param {boolean} force                     True to force the computation even if enableComplexity is false
     */
    public complexity(
      document: ComplexityMathDocument<DOM>,
      force: boolean = false
    ) {
      if (this.state() >= STATE.COMPLEXITY) return;
      if (!this.isEscaped && (document.options.enableComplexity || force)) {
        this.enrich(document, true);
        computeComplexity(this);
      }
      this.state(STATE.COMPLEXITY);
    }
  };
}

/*==========================================================================*/

/**
 * The copmlexity option types.
 */
export type OPTIONS = {
  enableComplexity: boolean;
  ComplexityVisitor: typeof ComplexityVisitor;
};

/**
 * The ComplexityMathDocument option types.
 */
export interface COMPLEXITY_OPTIONS<DOM extends DOM_TYPES>
  extends OPTIONS, ENRICH_OPTIONS<DOM> {
  MathItem: Constructor<ComplexityMathItem<DOM>>;
}

/**
 * The complexity option defaults.
 */
const options: OPTIONS = {
  enableComplexity: true,
  ComplexityVisitor: ComplexityVisitor,
};

/*==========================================================================*/

/**
 * The functions added to MathDocument for complexity
 *
 * @template DOM   The DOM node types
 */
export interface ComplexityMathDocument<
  DOM extends DOM_TYPES,
> extends EnrichedMathDocument<DOM> {
  /**
   * @override
   */
  options: COMPLEXITY_OPTIONS<DOM>;

  /**
   * Perform complexity computations on the MathItems in the MathDocument
   *
   * @returns {ComplexityMathDocument}   The MathDocument (so calls can be chained)
   */
  complexity(): this;
}

/**
 * The mixin for adding complexity to MathDocuments
 *
 * @param {B} BaseDocument           The MathDocument class to be extended
 * @returns {EnrichedMathDocument}   The enriched MathDocument class
 *
 * @template DOM   The DOM node types
 * @template B     The MathDocument class to extend
 */
export function ComplexityMathDocumentMixin<
  DOM extends DOM_TYPES,
  B extends EMDocC<DOM>,
>(BaseDocument: B): CMDocC<DOM> & B {
  return class extends BaseDocument {
    /**
     * The options for this type of document
     */
    public static OPTIONS = {
      ...BaseDocument.OPTIONS,
      ...ComplexityVisitor.OPTIONS,
      ...options,
      renderActions: expandable<RenderActions<DOM>>({
        ...BaseDocument.OPTIONS.renderActions,
        complexity: [STATE.COMPLEXITY],
      }),
    };

    /**
     * @override
     */
    public options: COMPLEXITY_OPTIONS<DOM>;

    /**
     * The visitor that computes complexities
     */
    protected complexityVisitor: ComplexityVisitor;

    /**
     * Extend the MathItem class used for this MathDocument
     *
     * @override
     * @class
     */
    constructor(...args: any[]) {
      super(...args);
      const ProcessBits = (this.constructor as typeof BaseDocument).ProcessBits;
      if (!ProcessBits.has('complexity')) {
        ProcessBits.allocate('complexity');
      }
      const visitorOptions = selectOptionsFromKeys(
        this.options,
        this.options.ComplexityVisitor.OPTIONS
      );
      this.complexityVisitor = new this.options.ComplexityVisitor(
        this.mmlFactory,
        visitorOptions
      );
      const computeComplexity = (math: ComplexityMathItem<DOM>) => {
        math.parseSemanticNodes();
        math.initialID = this.complexityVisitor.visitTree(
          math.root,
          math.initialID,
          math.semanticNodes
        );
      };
      this.options.MathItem = ComplexityMathItemMixin<DOM, EMItemC<DOM>>(
        this.options.MathItem,
        computeComplexity
      );
    }

    /**
     * Compute the complexity the MathItems in this MathDocument
     *
     * @returns {ComplexityMathDocument} The object for chaining.
     */
    public complexity(): this {
      if (!this.processed.isSet('complexity')) {
        if (this.options.enableComplexity) {
          for (const math of this.math) {
            (math as ComplexityMathItem<DOM>).complexity(this);
          }
        }
        this.processed.set('complexity');
      }
      return this;
    }

    /**
     * @override
     */
    public state(state: number, restore: boolean = false) {
      super.state(state, restore);
      if (state < STATE.COMPLEXITY) {
        this.processed.clear('complexity');
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
 * @returns {Handler}          The handler that was modified (for purposes of chainging extensions)
 *
 * @template DOM   The DOM node types
 */
export function ComplexityHandler<DOM extends DOM_TYPES>(
  handler: Handler<DOM>,
  MmlJax: MathML<DOM> = null
): Handler<DOM> {
  if (!handler.documentClass.prototype.enrich && MmlJax) {
    handler = EnrichHandler(handler, MmlJax);
  }
  handler.documentClass = ComplexityMathDocumentMixin<DOM, EMDocC<DOM>>(
    handler.documentClass as EMDocC<DOM>
  );
  return handler;
}
