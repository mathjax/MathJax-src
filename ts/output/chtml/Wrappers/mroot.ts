/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file  Implements the ChtmlMroot wrapper for the MmlMroot object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  ChtmlCharOptions,
  ChtmlVariantData,
  ChtmlDelimiterData,
  ChtmlFontData,
  ChtmlFontDataClass,
} from '../FontData.js';
import {
  CommonMroot,
  CommonMrootClass,
  CommonMrootMixin,
} from '../../common/Wrappers/mroot.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { ChtmlMsqrt, ChtmlMsqrtClass, ChtmlMsqrtNTD } from './msqrt.js';
import { BBox } from '../../../util/BBox.js';
import { MmlMroot } from '../../../core/MmlTree/MmlNodes/mroot.js';

/*****************************************************************/
/**
 * The ChtmlMroot interface for the CHTML Mroot wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMrootNTD<N, T, D>
  extends
    ChtmlMsqrtNTD<N, T, D>,
    CommonMroot<
      N,
      T,
      D,
      CHTML<N, T, D>,
      ChtmlWrapper<N, T, D>,
      ChtmlWrapperFactory<N, T, D>,
      ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions,
      ChtmlVariantData,
      ChtmlDelimiterData,
      ChtmlFontData,
      ChtmlFontDataClass
    > {}

/**
 * The ChtmlMrootClass interface for the CHTML Mroot wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMrootClass<N, T, D>
  extends
    ChtmlMsqrtClass<N, T, D>,
    CommonMrootClass<
      N,
      T,
      D,
      CHTML<N, T, D>,
      ChtmlWrapper<N, T, D>,
      ChtmlWrapperFactory<N, T, D>,
      ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions,
      ChtmlVariantData,
      ChtmlDelimiterData,
      ChtmlFontData,
      ChtmlFontDataClass
    > {
  new (
    factory: ChtmlWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: ChtmlWrapper<N, T, D>
  ): ChtmlMrootNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMroot wrapper class for the MmlMroot class
 */
export const ChtmlMroot = (function <N, T, D>(): ChtmlMrootClass<N, T, D> {
  const Base = CommonMrootMixin<
    N,
    T,
    D,
    CHTML<N, T, D>,
    ChtmlWrapper<N, T, D>,
    ChtmlWrapperFactory<N, T, D>,
    ChtmlWrapperClass<N, T, D>,
    ChtmlCharOptions,
    ChtmlVariantData,
    ChtmlDelimiterData,
    ChtmlFontData,
    ChtmlFontDataClass,
    ChtmlMrootClass<N, T, D>
  >(ChtmlMsqrt);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlMroot extends Base implements ChtmlMrootNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMroot.prototype.kind;

    /**
     * @override
     */
    protected addRoot(
      ROOT: N,
      root: ChtmlWrapper<N, T, D>,
      sbox: BBox,
      H: number
    ) {
      root.toCHTML([ROOT]);
      const adaptor = this.adaptor;
      const [x, h, dx] = this.getRootDimens(sbox, H);
      adaptor.setStyle(ROOT, 'verticalAlign', this.em(h));
      adaptor.setStyle(ROOT, 'width', this.em(x));
      if (dx) {
        adaptor.setStyle(
          adaptor.firstChild(ROOT) as N,
          'paddingLeft',
          this.em(dx)
        );
      }
    }
  };
})<any, any, any>();
