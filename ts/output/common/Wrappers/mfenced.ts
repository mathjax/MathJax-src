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
 * @file  Implements the CommonMfenced wrapper mixin for the MmlMfenced object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  CommonWrapper,
  CommonWrapperClass,
  CommonWrapperConstructor,
} from '../Wrapper.js';
import { CommonWrapperFactory } from '../WrapperFactory.js';
import {
  CharOptions,
  VariantData,
  DelimiterData,
  FontData,
  FontDataClass,
} from '../FontData.js';
import { CommonOutputJax } from '../../common.js';
import { CommonInferredMrow } from './mrow.js';
import { MmlNode, AbstractMmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMfenced } from '../../../core/MmlTree/MmlNodes/mfenced.js';
import { BBox } from '../../../util/BBox.js';

/*****************************************************************/
/**
 * The CommonMfenced interface
 *
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 */
export interface CommonMfenced<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
> extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
  /**
   * An mrow to use for the layout of the mfenced
   */
  mrow: CommonInferredMrow<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>;

  /**
   * Creates the mrow wrapper to use for the layout
   */
  createMrow(): void;

  /**
   * Populate the mrow with wrapped mo elements interleaved
   *   with the mfenced children (the mo's are already created
   *   in the mfenced object)
   */
  addMrowChildren(): void;

  /**
   * Wrap an mo element and push it onto the mrow
   *
   * @param {MmlNode} node  The mo element to push on the mrow
   */
  addMo(node: MmlNode): void;
}

/**
 * The CommonMfencedClass interface
 *
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 */
export interface CommonMfencedClass<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
> extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonMfenced wrapper mixin for the MmlMfenced object
 *
 * @param {CommonWrapperConstructor} Base The constructor class
 * @returns {B} The mixin constructor
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 *
 * @template B   The mixin interface to create
 */
export function CommonMfencedMixin<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
  B extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
>(
  Base: CommonWrapperConstructor<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
): B {
  return class CommonMfencedMixin
    extends Base
    implements CommonMfenced<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * @override
     */
    /* prettier-ignore */
    public mrow:
      CommonInferredMrow<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> = null;

    /**
     * @override
     */
    public createMrow() {
      const mmlFactory = (this.node as AbstractMmlNode).factory;
      const mrow = mmlFactory.create('inferredMrow');
      mrow.inheritAttributesFrom(this.node);
      this.mrow = this.wrap(mrow);
      this.mrow.parent = this as any as WW;
    }

    /**
     * @override
     */
    public addMrowChildren() {
      const mfenced = this.node as MmlMfenced;
      const mrow = this.mrow;
      this.addMo(mfenced.open);
      if (this.childNodes.length) {
        mrow.childNodes.push(this.childNodes[0]);
      }
      let i = 0;
      for (const child of this.childNodes.slice(1)) {
        this.addMo(mfenced.separators[i++]);
        mrow.childNodes.push(child);
      }
      this.addMo(mfenced.close);
      mrow.stretchChildren();
    }

    /**
     * @override
     */
    public addMo(node: MmlNode) {
      if (!node) return;
      const mo = this.wrap(node);
      this.mrow.childNodes.push(mo);
      mo.parent = this.mrow as any as WW;
    }

    /*******************************************************/

    /**
     * @override
     * @class
     */
    constructor(factory: WF, node: MmlNode, parent: WW = null) {
      super(factory, node, parent);
      this.createMrow();
      this.addMrowChildren();
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      bbox.updateFrom(this.mrow.getOuterBBox());
      this.setChildPWidths(recompute);
    }

    /**
     * @override
     */
    get breakCount() {
      return this.mrow.breakCount;
    }

    /**
     * @override
     */
    public computeLineBBox(i: number) {
      return this.mrow.getLineBBox(i);
    }
  } as any as B;
}
