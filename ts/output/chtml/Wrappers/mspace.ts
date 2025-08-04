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
 * @file  Implements the ChtmlMspace wrapper for the MmlMspace object
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
  CommonMspace,
  CommonMspaceClass,
  CommonMspaceMixin,
} from '../../common/Wrappers/mspace.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMspace } from '../../../core/MmlTree/MmlNodes/mspace.js';

/*****************************************************************/
/**
 * The ChtmlMspace interface for the CHTML Mspace wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMspaceNTD<N, T, D>
  extends ChtmlWrapper<N, T, D>,
    CommonMspace<
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
 * The ChtmlMspaceClass interface for the CHTML Mspace wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMspaceClass<N, T, D>
  extends ChtmlWrapperClass<N, T, D>,
    CommonMspaceClass<
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
  ): ChtmlMspaceNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMspace wrapper class for the MmlMspace class
 */
export const ChtmlMspace = (function <N, T, D>(): ChtmlMspaceClass<N, T, D> {
  const Base = CommonMspaceMixin<
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
    ChtmlMspaceClass<N, T, D>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlMspace extends Base implements ChtmlMspaceNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMspace.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      if (parents.length > 1) {
        parents.forEach((dom) =>
          this.adaptor.append(dom, this.html('mjx-linestrut'))
        );
      }
      const chtml = this.standardChtmlNodes(parents);
      let { w, h, d } = this.getBBox();
      if (w < 0) {
        this.adaptor.setStyle(chtml[0], 'marginRight', this.em(w));
        w = 0;
      }
      if (w && !this.breakCount) {
        this.adaptor.setStyle(chtml[0], 'width', this.em(w));
      }
      h = Math.max(0, h + d);
      if (h) {
        this.adaptor.setStyle(chtml[0], 'height', this.em(Math.max(0, h)));
      }
      if (d) {
        this.adaptor.setStyle(chtml[0], 'verticalAlign', this.em(-d));
      }
    }
  };
})<any, any, any>();
