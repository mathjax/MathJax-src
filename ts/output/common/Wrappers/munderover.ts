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
 * @file  Implements the CommonMunderover wrapper mixin for the MmlMunderover object
 *                and the special cases CommonMunder and CommonMsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CommonWrapper, CommonWrapperClass } from '../Wrapper.js';
import { CommonWrapperFactory } from '../WrapperFactory.js';
import { CommonOutputJax, COMMON_FONT } from '../../common.js';
import {
  CommonScriptbase,
  CommonScriptbaseClass,
  CommonScriptbaseConstructor,
} from './scriptbase.js';
import {
  MmlMunderover,
  MmlMunder,
  MmlMover,
} from '../../../core/MmlTree/MmlNodes/munderover.js';
import { BBox } from '../../../util/BBox.js';
import { DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The CommonMunder interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMunder<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonScriptbase<DOM, FONT, JX, WW, WF, WC> {}

/**
 * The CommonMunderClass interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMunderClass<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonScriptbaseClass<DOM, FONT, JX, WW, WF, WC> {}

/*****************************************************************/
/**
 * The CommonMunder wrapper mixin for the MmlMunder object
 *
 * @param {CommonScriptbaseConstructor} Base The constructor class to extend
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
export function CommonMunderMixin<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  B extends CommonScriptbaseClass<DOM, FONT, JX, WW, WF, WC>,
>(Base: CommonScriptbaseConstructor<DOM, FONT, JX, WW, WF, WC>): B {
  return class CommonMunderMixin
    extends Base
    implements CommonMunder<DOM, FONT, JX, WW, WF, WC>
  {
    /**
     * @override
     */
    public get scriptChild() {
      return this.childNodes[(this.node as MmlMunder).under];
    }

    /**
     * @override
     * @class
     */
    constructor(...args: any[]) {
      super(...args);
      this.stretchChildren();
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      if (this.hasMovableLimits()) {
        super.computeBBox(bbox, recompute);
        return;
      }
      bbox.empty();
      const basebox = this.baseChild.getOuterBBox();
      const underbox = this.scriptChild.getOuterBBox();
      const v = this.getUnderKV(basebox, underbox)[1];
      const delta = this.isLineBelow
        ? 0
        : this.getDelta(this.scriptChild, true);
      const [bw, uw] = this.getDeltaW([basebox, underbox], [0, -delta]);
      bbox.combine(basebox, bw, 0);
      bbox.combine(underbox, uw, v);
      bbox.d += this.font.params.big_op_spacing5;
      bbox.clean();
      this.setChildPWidths(recompute);
    }
  } as any as B;
}

/*****************************************************************/
/**
 * The CommonMover interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMover<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonScriptbase<DOM, FONT, JX, WW, WF, WC> {}

/**
 * The CommonMoverClass interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMoverClass<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonScriptbaseClass<DOM, FONT, JX, WW, WF, WC> {}

/*****************************************************************/
/**
 * The CommonMover wrapper mixin for the MmlMover object
 *
 * @param {CommonScriptbaseConstructor} Base The constructor class to extend
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
export function CommonMoverMixin<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  B extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
>(Base: CommonScriptbaseConstructor<DOM, FONT, JX, WW, WF, WC>): B {
  return class CommonMoverMixin
    extends Base
    implements CommonMover<DOM, FONT, JX, WW, WF, WC>
  {
    /**
     * @override
     */
    public get scriptChild() {
      return this.childNodes[(this.node as MmlMover).over];
    }

    /**
     * @override
     * @class
     */
    constructor(...args: any[]) {
      super(...args);
      this.stretchChildren();
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox) {
      if (this.hasMovableLimits()) {
        super.computeBBox(bbox);
        return;
      }
      bbox.empty();
      const basebox = this.baseChild.getOuterBBox();
      const overbox = this.scriptChild.getOuterBBox();
      if (this.node.attributes.get('accent')) {
        basebox.h = Math.max(
          basebox.h,
          this.font.params.x_height * this.baseScale
        );
      }
      const u = this.getOverKU(basebox, overbox)[1];
      const delta = this.isLineAbove ? 0 : this.getDelta(this.scriptChild);
      const [bw, ow] = this.getDeltaW([basebox, overbox], [0, delta]);
      bbox.combine(basebox, bw, 0);
      bbox.combine(overbox, ow, u);
      bbox.h += this.font.params.big_op_spacing5;
      bbox.clean();
    }
  } as any as B;
}

/*****************************************************************/
/**
 * The CommonMunderover interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMunderover<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonScriptbase<DOM, FONT, JX, WW, WF, WC> {
  /*
   * The wrapped under node
   */
  readonly underChild: WW;

  /*
   * The wrapped overder node
   */
  readonly overChild: WW;
}

/**
 * The CommonMunderoverClass interface
 *
 * @template DOM   The DOM node types
 * @template FONT  The font data types
 * @template JX    The OutputJax type
 * @template WW    The Wrapper type
 * @template WF    The WrapperFactory type
 * @template WC    The WrapperClass type
 */
export interface CommonMunderoverClass<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
> extends CommonScriptbaseClass<DOM, FONT, JX, WW, WF, WC> {}

/*****************************************************************/
/**
 * The CommonMunderover wrapper for the MmlMunderover object
 *
 * @param {CommonScriptbaseConstructor} Base The constructor class to extend
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
export function CommonMunderoverMixin<
  DOM extends DOM_TYPES,
  FONT extends COMMON_FONT,
  JX extends CommonOutputJax<DOM, FONT, JX, WW, WF, WC>,
  WW extends CommonWrapper<DOM, FONT, JX, WW, WF, WC>,
  WF extends CommonWrapperFactory<DOM, FONT, JX, WW, WF, WC>,
  WC extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
  B extends CommonWrapperClass<DOM, FONT, JX, WW, WF, WC>,
>(Base: CommonScriptbaseConstructor<DOM, FONT, JX, WW, WF, WC>): B {
  return class CommonMunderoverMixin
    extends Base
    implements CommonMunderover<DOM, FONT, JX, WW, WF, WC>
  {
    /*
     * @override
     */
    public get underChild() {
      return this.childNodes[(this.node as MmlMunderover).under];
    }

    /*
     * @override
     */
    public get overChild() {
      return this.childNodes[(this.node as MmlMunderover).over];
    }

    /**************************************************/

    /*
     * Needed for movablelimits
     *
     * @override
     */
    public get subChild() {
      return this.underChild;
    }

    /*
     * Needed for movablelimits
     *
     * @override
     */
    public get supChild() {
      return this.overChild;
    }

    /**
     * @override
     * @class
     */
    constructor(...args: any[]) {
      super(...args);
      this.stretchChildren();
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox) {
      if (this.hasMovableLimits()) {
        super.computeBBox(bbox);
        return;
      }
      bbox.empty();
      const overbox = this.overChild.getOuterBBox();
      const basebox = this.baseChild.getOuterBBox();
      const underbox = this.underChild.getOuterBBox();
      if (this.node.attributes.get('accent')) {
        basebox.h = Math.max(
          basebox.h,
          this.font.params.x_height * this.baseScale
        );
      }
      const u = this.getOverKU(basebox, overbox)[1];
      const v = this.getUnderKV(basebox, underbox)[1];
      const odelta = this.getDelta(this.overChild);
      const udelta = this.getDelta(this.underChild, true);
      const [bw, uw, ow] = this.getDeltaW(
        [basebox, underbox, overbox],
        [0, this.isLineBelow ? 0 : -udelta, this.isLineAbove ? 0 : odelta]
      );
      bbox.combine(basebox, bw, 0);
      bbox.combine(overbox, ow, u);
      bbox.combine(underbox, uw, v);
      const z = this.font.params.big_op_spacing5;
      bbox.h += z;
      bbox.d += z;
      bbox.clean();
    }
  } as any as B;
}
