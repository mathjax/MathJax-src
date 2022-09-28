/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview  Implements the CommonTeXAtom wrapper mixin for the MmlTeXAtom object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CommonWrapper, CommonWrapperClass, CommonWrapperConstructor} from '../Wrapper.js';
import {CommonWrapperFactory} from '../WrapperFactory.js';
import {CharOptions, VariantData, DelimiterData, FontData, FontDataClass} from '../FontData.js';
import {CommonOutputJax} from '../../common.js';
import {BBox} from '../../../util/BBox.js';
import {TEXCLASS} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The CommonTeXAtom interface
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
export interface CommonTeXAtom<
  N, T, D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>
> extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {

  /**
   * The vertical adjustment for VCENTER and VBOX atoms
   */
  dh: number;
}

/**
 * The CommonTeXAtomClass interface
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
export interface CommonTeXAtomClass<
  N, T, D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>
> extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonTeXAtom wrapper mixin for the TeXAtom object
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
 * @template B   The Mixin interface to create
 */
export function CommonTeXAtomMixin<
  N, T, D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
  B extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
>(Base: CommonWrapperConstructor<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>): B {

  return class CommonTeXAtomMixin extends Base
  implements CommonTeXAtom<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {

    /**
     * @override
     */
    public dh: number = 0;

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      super.computeBBox(bbox, recompute);
      if (this.childNodes[0] && this.childNodes[0].bbox.ic) {
        bbox.ic = this.childNodes[0].bbox.ic;
      }
      //
      // Center VCENTER atoms vertically
      //
      if (this.node.texClass === TEXCLASS.VCENTER) {
        const {h, d} = bbox;
        const a = this.font.params.axis_height;
        this.dh = ((h + d) / 2 + a) - h;  // new height minus old height
        bbox.h += this.dh;
        bbox.d -= this.dh;
      } else if (this.node.texClass === TEXCLASS.VBOX) {
        if (this.vboxAdjust(this.childNodes[0], bbox) || this.childNodes[0].childNodes.length > 1) return;
        const child = this.childNodes[0].childNodes[0];
        (child.node.isKind('mpadded') && this.vboxAdjust(child.childNodes[0], bbox)) || this.vboxAdjust(child, bbox);
      }
    }

    public vboxAdjust(child: WW, bbox: BBox): boolean {
      const n = child.lineBBox.length;
      if (!n) return false;
      this.dh = bbox.d - child.lineBBox[n - 1].d;
      bbox.h += this.dh;
      bbox.d -= this.dh;
      return true;
    }

  } as any as B;

}
