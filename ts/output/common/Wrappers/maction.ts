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
import { CommonOutputJax, COMMON_FONT } from '../../common.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMaction } from '../../../core/MmlTree/MmlNodes/maction.js';
import { TextNode } from '../../../core/MmlTree/MmlNode.js';
import { STATE } from '../../../core/MathItem.js';
import { mathjax } from '../../../mathjax.js';
import { BBox } from '../../../util/BBox.js';
import { split } from '../../../util/string.js';
import { DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The types needed to define the actiontypes
 *
 * @template DOM   The DOM node types
 * @template FONT  The Font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 *
 * @template MA  The Maction type
 */
export type ActionData = { [name: string]: any };

export type ActionHandler<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  MA extends CommonMaction<DOM, FONT, JX, WW, WF, WC>,
> = (node: MA, data?: ActionData) => void;

export type ActionPair<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  MA extends CommonMaction<DOM, FONT, JX, WW, WF, WC>,
> = [ActionHandler<DOM, FONT, JX, WW, WF, WC, MA>, ActionData];

export type ActionMap<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  MA extends CommonMaction<DOM, FONT, JX, WW, WF, WC>,
> = Map<string, ActionPair<DOM, FONT, JX, WW, WF, WC, MA>>;

export type ActionDef<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  MA extends CommonMaction<DOM, FONT, JX, WW, WF, WC>,
> = [string, [ActionHandler<DOM, FONT, JX, WW, WF, WC, MA>, ActionData]];

export type EventHandler = (event: Event) => void;

/**
 * Data used for tooltip actions
 */
export const TooltipData = {
  dx: '.2em', //          x-offset of tooltip from right side of maction bbox
  dy: '.1em', //          y-offset of tooltip from bottom of maction bbox

  postDelay: 600, //      milliseconds before tooltip posts
  clearDelay: 100, //     milliseconds before tooltip is removed

  hoverTimer: new Map<any, number>(), //    timers for posting tooltips
  clearTimer: new Map<any, number>(), //    timers for removing tooltips

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
  },
};

/*****************************************************************/
/**
 * The CommonMaction interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMaction<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapper<DOM, FONT, JX, WW, WF, WC> {
  /**
   * The handler for the specified actiontype
   */
  /* prettier-ignore */
  action: ActionHandler<
    DOM, FONT, JX, WW, WF, WC,
    CommonMaction<DOM, FONT, JX, WW, WF, WC>
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
   * The prefix to use for the toggle action attribute
   */
  readonly prefix: string;

  /**
   * Look up attribute parameters
   */
  getParameters(): void;

  /**
   * Add an event handler to the output for this maction
   *
   * @param {string} type The event handler type.
   * @param {EventHandler} handler The actual event handler.
   * @param {N=} dom The DOM node. If not provided goes over all elements of
   *the dom tree of this wrapper.
   */
  setEventHandler(type: string, handler: EventHandler, dom?: N<DOM>): void;

  /**
   * Public access to em method (for use in notation functions)
   *
   * @param {number} m   The number to convert to pixels
   * @returns {string}   The dimension with "px" units
   */
  Em(m: number): string;

  /**
   * @param {number} m   The number to convert to pixels
   * @returns {string}   The dimension with "px" units
   */
  Px(m: number): string;
}

/**
 * The CommonMaction class interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font node types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMactionClass<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC> {
  /**
   * The valid action types and their handlers
   */
  /* prettier-ignore */
  actions: ActionMap<DOM, FONT, JX, WW, WF, WC,
    CommonMaction<DOM, FONT, JX, WW, WF, WC>
  >;
}

/*****************************************************************/
/**
 * The CommonMaction wrapper mixin for the MmlMaction object
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
export function CommonMactionMixin<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  B extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
>(Base: CommonWrapperConstructor<DOM, FONT, JX, WW, WF, WC>): B {
  return class CommonMactionMixin
    extends Base
    implements CommonMaction<DOM, FONT, JX, WW, WF, WC>
  {
    /**
     * @override
     */
    public static actions = new Map([
      [
        'toggle',
        [
          (node, _data) => {
            //
            // Mark which child is selected
            //
            node.dom.forEach((dom) => {
              node.adaptor.setAttribute(
                dom,
                `${node.prefix}toggle`,
                node.node.attributes.get('selection') as string
              );
            });
            //
            // Cache the data needed to select another node
            //
            const math = node.factory.jax.math;
            const document = node.factory.jax.document;
            const mml = node.node as MmlMaction;
            //
            // Add a click handler that changes the selection and rerenders the expression
            //
            node.setEventHandler('click', (event: Event) => {
              if (!math.end.node) {
                //
                // If the MathItem was created by hand, it might not have a node
                // telling it where to replace the existing math, so set it.
                //
                math.start.node = math.end.node = math.typesetRoot;
                math.start.n = math.end.n = 0;
              }
              mml.nextToggleSelection();
              if (mml.attributes.get('data-collapse-group')) {
                const id = mml.attributes.get('id');
                const selection = mml.attributes.get('selection');
                math.root.walkTree((node) => {
                  if (node.attributes.get('data-collapse-id') === id) {
                    node.attributes.set('selection', selection);
                  }
                });
              }
              mathjax.handleRetriesFor(() => {
                math.rerender(
                  document,
                  mml.attributes.get('data-maction-id')
                    ? STATE.ENRICHED
                    : STATE.RERENDER
                );
              });
              event.stopPropagation();
            });
          },
          {},
        ],
      ],

      [
        'tooltip',
        [(_node, _data) => {}, {}], // overriden in by subclasses
      ],

      [
        'statusline',
        [
          (node, data) => {
            const tip = node.childNodes[1];
            if (!tip) return;
            if (tip.node.isKind('mtext')) {
              const adaptor = node.adaptor;
              const text = (tip.node as TextNode).getText();
              node.dom.forEach((dom) =>
                adaptor.setAttribute(dom, `${node.prefix}statusline`, text)
              );
              //
              // Set up event handlers to change the status window
              //
              node.setEventHandler('mouseover', (event: Event) => {
                if (data.status === null) {
                  const body = adaptor.body(adaptor.document);
                  data.status = adaptor.append(
                    body,
                    node.html('mjx-status', {}, [node.text(text)])
                  );
                }
                event.stopPropagation();
              });
              node.setEventHandler('mouseout', (event: Event) => {
                if (data.status) {
                  adaptor.remove(data.status);
                  data.status = null;
                }
                event.stopPropagation();
              });
            }
          },
          {
            status: null, // cached status line
          },
        ],
      ],
    ]) as ActionMap<
      DOM,
      FONT,
      JX,
      WW,
      WF,
      WC,
      CommonMaction<DOM, FONT, JX, WW, WF, WC>
    >;

    /**
     * @override
     */
    /* prettier-ignore */
    public action: ActionHandler<DOM, FONT, JX, WW, WF, WC,
      CommonMaction<DOM, FONT, JX, WW, WF, WC>
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
    public get prefix(): string {
      return '';
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
      const actions = (
        this.constructor as CommonMactionClass<DOM, FONT, JX, WW, WF, WC>
      ).actions;
      const action = this.node.attributes.get('actiontype') as string;
      const [handler, data] =
        /* prettier-ignore */
        actions.get(action) || [
          ((_node, _data) => {}) as ActionHandler<
            DOM, FONT, JX, WW, WF, WC,
            CommonMaction<DOM, FONT, JX, WW, WF, WC>
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

    /**
     * @override
     */
    public setEventHandler(
      type: string,
      handler: EventHandler,
      dom: N<DOM> = null
    ) {
      (dom ? [dom] : this.dom).forEach((node) =>
        (node as any).addEventListener(type, handler)
      );
    }

    /**
     * @override
     */
    public Em(m: number): string {
      return this.em(m);
    }

    /**
     * @override
     */
    public Px(m: number): string {
      return this.px(m);
    }
  } as any as B;
}
