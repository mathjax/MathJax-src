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
 * @file  Implements the CommonMaction wrapper mixin for the MmlMaction object
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
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMaction } from '../../../core/MmlTree/MmlNodes/maction.js';
import { BBox } from '../../../util/BBox.js';
import { split } from '../../../util/string.js';

/*****************************************************************/
/**
 * The types needed to define the actiontypes
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
 *
 * @template MA  The Maction type
 */
export type ActionData = { [name: string]: any };

export type ActionHandler<
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
  MA extends CommonMaction<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
> = (node: MA, data?: ActionData) => void;

export type ActionPair<
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
  MA extends CommonMaction<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
> = [
  ActionHandler<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC, MA>,
  ActionData,
];

export type ActionMap<
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
  MA extends CommonMaction<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
> = Map<string, ActionPair<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC, MA>>;

export type ActionDef<
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
  MA extends CommonMaction<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
> = [
  string,
  [ActionHandler<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC, MA>, ActionData],
];

export type EventHandler = (event: Event) => void;

/**
 * Data used for tooltip actions
 */
/* prettier-ignore */
export const TooltipData = {
  dx: '.2em',          // x-offset of tooltip from right side of maction bbox
  dy: '.1em',          // y-offset of tooltip from bottom of maction bbox

  postDelay: 600,      // milliseconds before tooltip posts
  clearDelay: 100,     // milliseconds before tooltip is removed

  hoverTimer: new Map<any, number>(),    // timers for posting tooltips
  clearTimer: new Map<any, number>(),    // timers for removing tooltips

  /*
   * clear the timers if any are active
   */
  stopTimers: (node: any, data: ActionData) => {
    if (data.clearTimer.has(node)) {
      clearTimeout(data.clearTimer.get(node));
      data.clearTimer.delete(node);
    }
    if (data.hoverTimer.has(node)) {
      clearTimeout(data.hoverTimer.get(node));
      data.hoverTimer.delete(node);
    }
  }

};

/*****************************************************************/
/**
 * The CommonMaction interface
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
export interface CommonMaction<
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
   * The handler for the specified actiontype
   */
  /* prettier-ignore */
  action: ActionHandler<
    N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC,
    CommonMaction<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  >;
  /**
   * The data for the specified actiontype
   */
  data: ActionData;

  /**
   * The x-offset for tooltips
   */
  tipDx: number;
  /**
   * The y-offset for tooltips
   */
  tipDy: number;

  /**
   * The selected child wrapper
   */
  readonly selected: WW;

  /**
   * Look up attribute parameters
   */
  getParameters(): void;
}

/**
 * The CommonMaction class interface
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
export interface CommonMactionClass<
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
> extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
  /**
   * The valid action types and their handlers
   */
  /* prettier-ignore */
  actions: ActionMap<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC,
    CommonMaction<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  >;
}

/*****************************************************************/
/**
 * The CommonMaction wrapper mixin for the MmlMaction object
 *
 * @param {CommonWrapperConstructor} Base The constructor class to extend
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
export function CommonMactionMixin<
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
  return class CommonMactionMixin
    extends Base
    implements CommonMaction<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * @override
     */
    /* prettier-ignore */
    public static actions: ActionMap<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD,
      FC, CommonMaction<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
    >;

    /**
     * @override
     */
    /* prettier-ignore */
    public action: ActionHandler<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC,
      CommonMaction<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
    >;

    /**
     * @override
     */
    public data: ActionData;

    /**
     * @override
     */
    public tipDx: number;
    /**
     * @override
     */
    public tipDy: number;

    /**
     * @override
     */
    public get selected(): WW {
      const selection = this.node.attributes.get('selection') as number;
      const i = Math.max(1, Math.min(this.childNodes.length, selection)) - 1;
      return (
        this.childNodes[i] || this.wrap((this.node as MmlMaction).selected)
      );
    }

    /**
     * @override
     */
    public getParameters() {
      const offsets = this.node.attributes.get('data-offsets') as string;
      const [dx, dy] = split(offsets || '');
      this.tipDx = this.length2em(dx || TooltipData.dx);
      this.tipDy = this.length2em(dy || TooltipData.dy);
    }

    /*************************************************************/

    /**
     * @override
     */
    constructor(factory: WF, node: MmlNode, parent: WW = null) {
      super(factory, node, parent);
      const actions =
        /* prettier-ignore */
        (this.constructor as
         CommonMactionClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>)
        .actions;
      const action = this.node.attributes.get('actiontype') as string;
      const [handler, data] =
        /* prettier-ignore */
        actions.get(action) || [
          ((_node, _data) => {}) as ActionHandler<
            N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC,
            CommonMaction<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
          >,
          {},
        ];
      this.action = handler;
      this.data = data;
      this.getParameters();
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      bbox.updateFrom(this.selected.getOuterBBox());
      this.selected.setChildPWidths(recompute);
    }

    /**
     * @override
     */
    get breakCount() {
      return this.node.isEmbellished
        ? this.selected.coreMO().embellishedBreakCount
        : this.selected.breakCount;
    }

    /**
     * @override
     */
    public computeLineBBox(i: number) {
      return this.getChildLineBBox(this.selected, i);
    }
  } as any as B;
}
