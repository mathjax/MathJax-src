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
 * @file  Implements the CommonMmultiscripts wrapper mixin for the MmlMmultiscripts object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CommonWrapper, CommonWrapperClass, Constructor } from '../Wrapper.js';
import { CommonWrapperFactory } from '../WrapperFactory.js';
import {
  CharOptions,
  VariantData,
  DelimiterData,
  FontData,
  FontDataClass,
} from '../FontData.js';
import { CommonOutputJax } from '../../common.js';
import { CommonMsubsup, CommonMsubsupClass } from './msubsup.js';
import { BBox } from '../../../util/BBox.js';
import { LineBBox } from '../LineBBox.js';

/*****************************************************************/

/**
 * The data about the scripts and base
 */
/* prettier-ignore */
export type ScriptData = {
  base: BBox;
  sub: BBox;   // combined bbox for all subscripts
  sup: BBox;   // combined bbox for all superscripts
  psub: BBox;  // combined bbox for all presubscripts
  psup: BBox;  // combined bbox for all presuperscripts
  numPrescripts: number;
  numScripts: number;
};
export type ScriptDataName = keyof ScriptData;

/**
 * The lists of all the individual script bboxes
 */
export type ScriptLists = {
  base: BBox[];
  subList: BBox[];
  supList: BBox[];
  psubList: BBox[];
  psupList: BBox[];
};
export type ScriptListName = keyof ScriptLists;

/**
 * The type of script that follows the given type
 */
export const NextScript: { [key: string]: ScriptListName } = {
  base: 'subList',
  subList: 'supList',
  supList: 'subList',
  psubList: 'psupList',
  psupList: 'psubList',
};

/**
 * The names of the scripts (for looping)
 */
export const ScriptNames = ['sup', 'sup', 'psup', 'psub'] as ScriptDataName[];

/*****************************************************************/
/**
 * The CommonMmultiscripts interface
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
export interface CommonMmultiscripts<
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
> extends CommonMsubsup<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
  /**
   *  The cached data for the various bounding boxes
   */
  scriptData: ScriptData;

  /**
   *  The index of the child following the <mprescripts/> tag
   */
  firstPrescript: number;

  /**
   * @param {BBox} pre   The prescript bounding box
   * @param {BBox} post  The postcript bounding box
   * @returns {BBox}      The combined bounding box
   */
  combinePrePost(pre: BBox, post: BBox): BBox;

  /**
   * Compute the bounding box information about all the scripts
   */
  getScriptData(): void;

  /**
   * @returns {ScriptLists}  The bounding boxes for all the scripts divided into lists by position
   */
  getScriptBBoxLists(): ScriptLists;

  /**
   * Pad the second list, if it is one short
   *
   * @param {BBox[]} list1   The first list
   * @param {BBox[]} list2   The second list
   */
  padLists(list1: BBox[], list2: BBox[]): void;

  /**
   * @param {BBox} bbox1    The bbox for the combined subscripts
   * @param {BBox} bbox2    The bbox for the combined superscripts
   * @param {BBox[]} list1  The list of subscripts to combine
   * @param {BBox[]} list2  The list of superscripts to combine
   */
  combineBBoxLists(
    bbox1: BBox,
    bbox2: BBox,
    list1: BBox[],
    list2: BBox[]
  ): void;

  /**
   * @param {BBox} bbox  The bounding box from which to get the (scaled) width, height, and depth
   */
  getScaledWHD(bbox: BBox): void;

  /**
   * @returns {[number, number]}  The vertical shifts for super and subscripts
   */
  getCombinedUV(): number[];

  /**
   * @param {BBox} bbox   The bbox to adjust
   * @param {number} u    The vertical shift for superscripts
   * @param {number} v    The vertical shift for subscripts
   * @returns {BBox}       The modified bbox
   */
  addPrescripts(bbox: BBox, u: number, v: number): BBox;
}

/**
 * The CommonMmlultisciptsClass interface
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
export interface CommonMmultiscriptsClass<
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
> extends CommonMsubsupClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonMmultiscripts wrapper mixin for the MmlMmultiscripts object
 *
 * @param {Constructor} Base The constructor class to extend
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
export function CommonMmultiscriptsMixin<
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
  B extends CommonMsubsupClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
>(
  Base: Constructor<CommonMsubsup<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>>
): B {
  return class CommonMmultiscriptsMixin
    extends Base
    implements CommonMmultiscripts<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * @override
     */
    public scriptData: ScriptData = null;

    /**
     * @override
     */
    public firstPrescript = 0;

    /*************************************************************/

    /**
     * @override
     */
    public combinePrePost(pre: BBox, post: BBox): BBox {
      const bbox = new BBox(pre);
      bbox.combine(post, 0, 0);
      return bbox;
    }

    /*************************************************************/

    /**
     * @override
     */
    public getScriptData() {
      //
      //  Initialize the bounding box data
      //
      const data: ScriptData = (this.scriptData = {
        base: null,
        sub: BBox.empty(),
        sup: BBox.empty(),
        psub: BBox.empty(),
        psup: BBox.empty(),
        numPrescripts: 0,
        numScripts: 0,
      });
      //
      //  Get the bboxes for all the scripts and combine them into the scriptData
      //
      const lists = this.getScriptBBoxLists();
      this.combineBBoxLists(data.sub, data.sup, lists.subList, lists.supList);
      this.combineBBoxLists(
        data.psub,
        data.psup,
        lists.psubList,
        lists.psupList
      );
      data.base = lists.base[0];
      //
      //  Save the lengths and return the data
      //
      data.numPrescripts = lists.psubList.length;
      data.numScripts = lists.subList.length;
    }

    /**
     * @override
     */
    public getScriptBBoxLists(): ScriptLists {
      const lists: ScriptLists = {
        base: [],
        subList: [],
        supList: [],
        psubList: [],
        psupList: [],
      };
      //
      // The first entry is the base, and then they altername sub- and superscripts.
      // Once we find the <mprescripts/> element, switch to presub- and presuperscript lists.
      //
      let script: ScriptListName = 'base';
      for (const child of this.childNodes) {
        if (child.node.isKind('mprescripts')) {
          script = 'psubList';
        } else {
          lists[script].push(child.getOuterBBox());
          script = NextScript[script];
        }
      }
      //
      //  The index of the first prescript (skip over base, sub- and superscripts, and mprescripts)
      //
      this.firstPrescript = lists.subList.length + lists.supList.length + 2;
      //
      //  Make sure the lists are the same length
      //
      this.padLists(lists.subList, lists.supList);
      this.padLists(lists.psubList, lists.psupList);
      return lists;
    }

    /**
     * @override
     */
    public padLists(list1: BBox[], list2: BBox[]) {
      if (list1.length > list2.length) {
        list2.push(BBox.empty());
      }
    }

    /**
     * @override
     */
    public combineBBoxLists(
      bbox1: BBox,
      bbox2: BBox,
      list1: BBox[],
      list2: BBox[]
    ) {
      for (let i = 0; i < list1.length; i++) {
        const [w1, h1, d1] = this.getScaledWHD(list1[i]);
        const [w2, h2, d2] = this.getScaledWHD(list2[i]);
        const w = Math.max(w1, w2);
        bbox1.w += w;
        bbox2.w += w;
        if (h1 > bbox1.h) bbox1.h = h1;
        if (d1 > bbox1.d) bbox1.d = d1;
        if (h2 > bbox2.h) bbox2.h = h2;
        if (d2 > bbox2.d) bbox2.d = d2;
      }
    }

    /**
     * @override
     */
    public getScaledWHD(bbox: BBox) {
      const { w, h, d, rscale } = bbox;
      return [w * rscale, h * rscale, d * rscale];
    }

    /**
     * @override
     */
    public getCombinedUV() {
      //
      // Get the bounding boxes, and combine the pre- and post-scripts
      //  to get a common offset for both
      //
      const data = this.scriptData;
      const sub = this.combinePrePost(data.sub, data.psub);
      const sup = this.combinePrePost(data.sup, data.psup);
      return this.getUVQ(sub, sup);
    }

    /**
     * @override
     */
    public addPrescripts(bbox: BBox, u: number, v: number) {
      const data = this.scriptData;
      if (data.numPrescripts) {
        const scriptspace = this.font.params.scriptspace;
        bbox.combine(data.psup, scriptspace, u);
        bbox.combine(data.psub, scriptspace, v);
      }
      return bbox;
    }

    /**
     * @override
     */
    public addPostscripts(bbox: BBox, u: number, v: number) {
      const data = this.scriptData;
      if (data.numScripts) {
        const x = bbox.w;
        bbox.combine(data.sup, x, u);
        bbox.combine(data.sub, x, v);
        bbox.w += this.font.params.scriptspace;
      }
      return bbox;
    }

    /*************************************************************/

    /**
     * @override
     */
    constructor(...args: any[]) {
      super(...args);
      this.getScriptData();
    }

    /**
     * @override
     */
    public appendScripts(bbox: BBox) {
      //
      //  Lay out the pre-scripts, then the base, then the post-scripts
      //
      bbox.empty();
      const [u, v] = this.getCombinedUV();
      this.addPrescripts(bbox, u, v);
      bbox.append(this.scriptData.base);
      this.addPostscripts(bbox, u, v);
      bbox.clean();
      return bbox;
    }

    /**
     * @override
     */
    protected computeLineBBox(i: number) {
      const n = this.baseChild.breakCount;
      const cbox = this.baseChild.getLineBBox(i).copy();
      let bbox = cbox;
      const [u, v] = this.getCombinedUV();
      if (i === 0) {
        bbox = LineBBox.from(
          this.addPrescripts(BBox.zero(), u, v),
          this.linebreakOptions.lineleading
        );
        bbox.append(cbox);
        this.addLeftBorders(bbox);
        bbox.L = this.bbox.L;
      } else if (i === n) {
        bbox = this.addPostscripts(bbox, u, v) as LineBBox;
        this.addRightBorders(bbox);
        bbox.R = this.bbox.R;
      }
      this.addMiddleBorders(bbox);
      return bbox;
    }

    /**
     * @override
     */
    public getUVQ(subbox: BBox, supbox: BBox) {
      if (!this.UVQ) {
        let [u, v, q] = [0, 0, 0];
        if (subbox.w === 0) {
          //
          //  Use placement for superscript only
          //
          u = this.getU();
        } else if (supbox.w === 0) {
          //
          //  Use placement for subsccript only
          //
          u = -this.getV();
        } else {
          //
          //  Use placement for both
          //
          [u, v, q] = super.getUVQ(subbox, supbox);
        }
        this.UVQ = [u, v, q];
      }
      return this.UVQ;
    }
  } as any as B;
}
