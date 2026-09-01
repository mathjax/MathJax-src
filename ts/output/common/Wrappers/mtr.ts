/*************************************************************
 *
 *  Copyright (c) 2017-2026 The MathJax Consortium
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
 * @file  Implements the CcommonMtr wrapper mixin for the MmlMtr object
 *                and CommonMlabeledtr wrapper mixin for MmlMlabeledtr
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  CommonWrapper,
  CommonWrapperClass,
  CommonWrapperConstructor,
  Constructor,
} from '../Wrapper.js';
import { CommonWrapperFactory } from '../WrapperFactory.js';
import { CommonOutputJax, COMMON_FONT } from '../../common.js';
import { BBox } from '../../../util/BBox.js';
import { DIRECTION } from '../FontData.js';
import { DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The CommonMtr interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMtr<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapper<DOM, FONT, JX, WW, WF, WC> {
  /**
   * The number of mtd's in the mtr
   */
  readonly numCells: number;

  /**
   * True if this is a labeled row
   */
  readonly labeled: boolean;

  /**
   * The child nodes that are part of the table (no label node)
   */
  readonly tableCells: WW[];

  /**
   * @param {number} i   The index of the child to get (skipping labels)
   * @returns {WW}       The ith child node wrapper
   */
  getChild(i: number): WW;

  /**
   * @returns {BBox[]}  An array of the bounding boxes for the mtd's in the row
   */
  getChildBBoxes(): BBox[];

  /**
   * Handle vertical stretching of cells to match height of
   *  other cells in the row.
   *
   * @param {number[]=} HD   The total height and depth for the row [H, D]
   *
   * If this isn't specified, the maximum height and depth is computed.
   */
  stretchChildren(HD?: number[]): void;
}

/**
 * The CommonMtrClass interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMtrClass<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC> {}

/*****************************************************************/
/**
 * The CommonMtr wrapper for the MmlMtr object
 *
 * @param {CommonWrapperConstructor} Base The constructor class to extend
 * @returns {B} The mixin constructor
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 *
 * @template B     The mixin interface to create
 */
export function CommonMtrMixin<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  B extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
>(Base: CommonWrapperConstructor<DOM, FONT, JX, WW, WF, WC>): B {
  return class CommonMtrMixin
    extends Base
    implements CommonMtr<DOM, FONT, JX, WW, WF, WC>
  {
    /**
     * @override
     */
    get numCells(): number {
      return this.childNodes.length;
    }

    /**
     * @override
     */
    get labeled(): boolean {
      return false;
    }

    /**
     * @override
     */
    get tableCells(): WW[] {
      return this.childNodes;
    }

    /**
     * @override
     */
    public getChild(i: number): WW {
      return this.childNodes[i];
    }

    /**
     * @override
     */
    public getChildBBoxes(): BBox[] {
      return this.childNodes.map((cell) => cell.getBBox());
    }

    /**
     * @override
     */
    public stretchChildren(HD: number[] = null) {
      const stretchy: WW[] = [];
      const children = this.labeled
        ? this.childNodes.slice(1)
        : this.childNodes;
      //
      //  Locate and count the stretchy children
      //
      for (const mtd of children) {
        const child = mtd.childNodes[0];
        if (child.canStretch(DIRECTION.Vertical)) {
          stretchy.push(child);
        }
      }
      const count = stretchy.length;
      const nodeCount = this.childNodes.length;
      if (count && nodeCount > 1 && !HD) {
        let H = 0;
        let D = 0;
        //
        //  If all the children are stretchy, find the largest one,
        //  otherwise, find the height and depth of the non-stretchy
        //  children.
        //
        const all = count > 1 && count === nodeCount;
        for (const mtd of children) {
          const child = mtd.childNodes[0];
          const noStretch = child.stretch.dir === DIRECTION.None;
          if (all || noStretch) {
            const { h, d } = child.getBBox(noStretch);
            if (h > H) {
              H = h;
            }
            if (d > D) {
              D = d;
            }
          }
        }
        HD = [H, D];
      }
      if (HD) {
        //
        //  Stretch the stretchable children
        //
        for (const child of stretchy) {
          const rscale = child.coreRScale();
          child.coreMO().getStretchedVariant(HD.map((x) => x * rscale));
        }
      }
    }

    /******************************************************/

    /**
     * @override
     */
    get fixesPWidth() {
      return false;
    }
  } as any as B;
}

/*****************************************************************/
/**
 * The CommonMlabeledtr interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMlabeledtr<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonMtr<DOM, FONT, JX, WW, WF, WC> {}

/**
 * The CommonMlabeledtrClass interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMlabeledtrClass<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonMtrClass<DOM, FONT, JX, WW, WF, WC> {}

/*****************************************************************/
/**
 * The CommonMlabeledtr wrapper mixin for the MmlMlabeledtr object
 *
 * @param {Constructor} Base The constructor class to extend
 * @returns {B} The mixin constructor
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 *
 * @template B     The mixin interface to create
 */
export function CommonMlabeledtrMixin<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  B extends CommonMtrClass<DOM, FONT, JX, WW, WF, WC>,
>(Base: Constructor<CommonMtr<DOM, FONT, JX, WW, WF, WC>>): B {
  return class CommonMlabeledtrMixin
    extends Base
    implements CommonMlabeledtr<DOM, FONT, JX, WW, WF, WC>
  {
    /**
     * @override
     */
    get numCells() {
      //
      //  Don't include the label mtd
      //
      return Math.max(0, this.childNodes.length - 1);
    }

    /**
     * @override
     */
    get labeled() {
      return true;
    }

    /**
     * @override
     */
    get tableCells() {
      return this.childNodes.slice(1);
    }

    /**
     * @override
     */
    public getChild(i: number) {
      return this.childNodes[i + 1];
    }

    /**
     * @override
     */
    public getChildBBoxes() {
      //
      //  Don't include the label mtd
      //
      return this.childNodes.slice(1).map((cell) => cell.getBBox());
    }
  } as any as B;
}
