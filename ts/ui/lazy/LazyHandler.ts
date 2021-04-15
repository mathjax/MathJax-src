/*************************************************************
 *
 *  Copyright (c) 2021 The MathJax Consortium
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
 * @fileoverview  Mixin that implements lazy typesetting
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Handler} from '../../core/Handler.js';
import {MathDocument, AbstractMathDocument,
        MathDocumentConstructor, ContainerList} from '../../core/MathDocument.js';
import {MathItem, AbstractMathItem, STATE} from '../../core/MathItem.js';
import {handleRetriesFor} from '../../util/Retries.js';

/**
 * Add the needed function to the window object.
 */
declare const window: {
  requestIdleCallback: (callback: () => void) => void;
};

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new(...args: any[]) => T;

/*==========================================================================*/

/**
 * The data to map expression marker IDs back to their MathItem.
 */
export class LazyList<N, T, D> {

  /**
   * The next ID to use
   */
  protected id: number = 0;

  /**
   * The map from IDs to MathItems
   */
  protected items: Map<string, LazyMathItem<N, T, D>> = new Map();

  /**
   * Add a MathItem to the list and return its ID
   *
   * @param {LazyMathItem} math   The item to add
   * @return {string}             The id for the newly added item
   */
  public add(math: LazyMathItem<N, T, D>): string {
    const id = String(this.id++);
    this.items.set(id,  math);
    return id;
  }

  /**
   * Get the MathItem with the given ID
   *
   * @param {string} id       The ID of the MathItem to get
   * @return {LazyMathItem}   The MathItem having that ID (if any)
   */
  public get(id: string): LazyMathItem<N, T, D> {
    return this.items.get(id);
  }

  /**
   * Remove an item from the map
   *
   * @param {string} id   The ID of the MathItem to remove
   */
  public delete(id: string) {
    return this.items.delete(id);
  }

}

/*==========================================================================*/

/**
 * The attribute to use for the ID on the marker node
 */
export const LAZYID = 'data-mjx-lazy';

/**
 * The properties added to MathItem for lazy typesetting
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface LazyMathItem<N, T, D> extends MathItem<N, T, D> {

  /**
   * True when the MathItem needs to be lazy compiled
   */
  lazyCompile: boolean;

  /**
   * True when the MathItem needs to be lazy displayed
   */
  lazyTypeset: boolean;

  /**
   * The DOM node used to mark the location of the math to be lazy typeset
   */
  lazyMarker: N;

  /**
   * The state to use when rerednering the math item (COMPILED vs TYPESET)
   */
  lazyState: number;

  /**
   * True if this item is a TeX MathItem
   */
  lazyTex: boolean;

}

/**
 * The mixin for adding laxy typesetting to MathItems
 *
 * @param {B} BaseMathItem      The MathItem class to be extended
 * @return {AssistiveMathItem}  The augmented MathItem class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathItem class to extend
 */
export function LazyMathItemMixin<N, T, D, B extends Constructor<AbstractMathItem<N, T, D>>>(
  BaseMathItem: B
): Constructor<LazyMathItem<N, T, D>> & B {

  return class extends BaseMathItem {

    public lazyCompile: boolean = true;
    public lazyTypeset: boolean = true;
    public lazyMarker: N;
    public lazyState: number = STATE.COMPILED;
    public lazyTex: boolean = false;

    /**
     * Initially don't compile math, just use an empty math item,
     *   then when the math comes into view (or is before something
     *   that comes into view), compile it properly and mark the item
     *   as only needing to be typeset.
     *
     * @override
     */
    public compile(document: LazyMathDocument<N, T, D>) {
      if (this.lazyCompile) {
        if (this.state() < STATE.COMPILED) {
          this.lazyTex = (this.inputJax.name === 'TeX');
          this.root = document.mmlFactory.create('math');
          this.state(STATE.COMPILED);
        }
      } else {
        super.compile(document);
        this.lazyState = STATE.TYPESET;
      }
    }

    /**
     * Initially, just insert a marker for where the math will go, and
     *   track it in the lazy list.  Then, when it comes into view,
     *   typeset it properly.
     *
     * @override
     */
    public typeset(document: LazyMathDocument<N, T, D>) {
      if (this.lazyTypeset) {
        if (this.state() < STATE.TYPESET) {
          const adaptor = document.adaptor;
          if (!this.lazyMarker) {
            const id = document.lazyList.add(this);
            this.lazyMarker = adaptor.node('mjx-lazy', {[LAZYID]: id});
            this.typesetRoot = adaptor.node('mjx-container', {}, [this.lazyMarker]);
          }
          this.state(STATE.TYPESET);
        }
      } else {
        super.typeset(document);
      }
    }

    /**
     * When the MathItem is added to the page, set the observer to watch
     *   for it coming into view so that it can be typeset.
     *
     * @override
     */
    public updateDocument(document: LazyMathDocument<N, T, D>) {
      super.updateDocument(document);
      if (this.lazyTypeset) {
        document.lazyObserver.observe(this.lazyMarker as any as Element);
      }
    }

  };

}
/*==========================================================================*/

/**
 * The properties added to MathDocument for lazy typesetting
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface LazyMathDocument<N, T, D> extends AbstractMathDocument<N, T, D> {

  /**
   * The Intersection Observer used to track the appearance of the expression markers
   */
  lazyObserver: IntersectionObserver;

  /**
   * The mapping of markers to MathItems
   */
  lazyList: LazyList<N, T, D>;

}

/**
 * The mixin for adding lazy typesetting to MathDocuments
 *
 * @param {B} BaseDocument        The MathDocument class to be extended
 * @return {LazyMathDocument}     The Lazy MathDocument class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathDocument class to extend
 */
export function LazyMathDocumentMixin<N, T, D,
B extends MathDocumentConstructor<AbstractMathDocument<N, T, D>>>(
  BaseDocument: B
): MathDocumentConstructor<MathDocument<N, T, D>> & B {

  return class BaseClass extends BaseDocument {

    /**
     * The Intersection Observer used to track the appearance of the expression markers
     */
    public lazyObserver: IntersectionObserver;

    /**
     * The mapping of markers to MathItems
     */
    public lazyList: LazyList<N, T, D>;

    /**
     * A promise to make sure our compiling/typesetting is sequential
     */
    protected lazyPromise: Promise<void> = Promise.resolve();

    /**
     * Augment the MathItem class used for this MathDocument,
     *   then create the intersection observer and laxzy list.
     *
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      this.options.MathItem =
        LazyMathItemMixin<N, T, D, Constructor<AbstractMathItem<N, T, D>>>(this.options.MathItem);
      this.lazyObserver = new IntersectionObserver(this.observe.bind(this));
      this.lazyList = new LazyList<N, T, D>();
    }

    /**
     * The function used by the IntersectionObserver to monitor the markers coming into view.
     * When one (or more) does, use an idle callback to process the marker:
     *  Get the id of the marker and look up the associated MathItem;
     *  Remove the item from the list (it will be typeset from now on);
     *  Compile any previous TeX expressions (since they may contain definitions, automatic numbering, etc.);
     *  Remove the lazy markers from the math item so it will compile and typeset as usual;
     *  Rerender the math (in order, and handing retries as needed for loading extensions).
     *
     * @param {IntersectionObserverEntry[]} entries   The markers that have come into or out of view.
     */
    public observe(entries: IntersectionObserverEntry[]) {
      for (const entry of Array.from(entries).reverse()) {
        if (entry.isIntersecting) {
          this.lazyObserver.unobserve(entry.target);
          window.requestIdleCallback(() => {
            const id = this.adaptor.getAttribute(entry.target as any as N, LAZYID);
            const math = this.lazyList.get(id);
            if (!math) return;
            this.lazyList.delete(id);
            this.compileEarlier(math);
            math.lazyMarker = null;
            math.lazyTypeset = math.lazyCompile = false;
            this.lazyPromise = this.lazyPromise.then(() => {
              return handleRetriesFor(() => math.rerender(this, math.lazyState));
            });
          });
        }
      }
    }

    /**
     * If this is a TeX item, look through the math list for any earlier math
     * that needs to be compiled and rerender it (it will be compiled, but
     * its marker will be reinserted into the page).
     */
    public compileEarlier(math: LazyMathItem<N, T, D>) {
      if (!math.lazyTex) return;
      for (const item of this.math) {
        if (item === math) break;
        const earlier = item as LazyMathItem<N, T, D>;
        if (earlier.lazyTex && earlier.lazyCompile) {
          earlier.lazyCompile = false;
          earlier.lazyMarker && this.lazyObserver.unobserve(earlier.lazyMarker as any as Element);
          this.lazyPromise = this.lazyPromise.then(() => {
            return handleRetriesFor(() => earlier.rerender(this, STATE.COMPILED));
          });
        }
      }
    }

    /**
     * If any of the removed items are observed or in the lazy list, remove them.
     *
     * @override
     */
    public clearMathItemsWithin(containers: ContainerList<N>) {
      const items = super.clearMathItemsWithin(containers) as LazyMathItem<N, T, D>[];
      for (const math of items) {
        const marker = math.lazyMarker;
        if (marker) {
          this.lazyObserver.unobserve(marker as any as Element);
          this.lazyList.delete(this.adaptor.getAttribute(marker, LAZYID));
        }
      }
      return items;
    }

  };

}

/*==========================================================================*/

/**
 * Add lazy typesetting support a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @return {Handler}          The handler that was modified (for purposes of chaining extensions)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export function LazyHandler<N, T, D>(handler: Handler<N, T, D>): Handler<N, T, D> {
  //
  // Only update the document class if we can handle IntersectionObservers and idle callbacks
  //
  if (typeof window !== 'undefined' && window.requestIdleCallback &&
      typeof IntersectionObserver !== 'undefined') {
    handler.documentClass =
      LazyMathDocumentMixin<N, T, D, MathDocumentConstructor<AbstractMathDocument<N, T, D>>>(
        handler.documentClass
      );
  }
  return handler;
}
