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
 * @file  Implements the ChtmlMfenced wrapper for the MmlMfenced object
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
  CommonMfenced,
  CommonMfencedClass,
  CommonMfencedMixin,
} from '../../common/Wrappers/mfenced.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMfenced } from '../../../core/MmlTree/MmlNodes/mfenced.js';
import { ChtmlInferredMrowNTD } from './mrow.js';

/*****************************************************************/
/**
 * The ChtmlMfenced interface for the CHTML Mfenced wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMfencedNTD<N, T, D>
  extends
    ChtmlWrapper<N, T, D>,
    CommonMfenced<
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
 * The ChtmlMfencedClass interface for the CHTML Mfenced wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMfencedClass<N, T, D>
  extends
    ChtmlWrapperClass<N, T, D>,
    CommonMfencedClass<
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
  ): ChtmlMfencedNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMfenced wrapper class for the MmlMfenced class
 */
export const ChtmlMfenced = (function <N, T, D>(): ChtmlMfencedClass<N, T, D> {
  const Base = CommonMfencedMixin<
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
    ChtmlMfencedClass<N, T, D>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  //   type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  //   different by typescript)
  return class ChtmlMfenced extends Base implements ChtmlMfencedNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMfenced.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      const chtml = this.standardChtmlNodes(parents);
      (this.mrow as ChtmlInferredMrowNTD<N, T, D>).toCHTML(chtml);
    }
  };
})<any, any, any>();
