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
 * @file  Implements the ChtmlTeXAtom wrapper for the MmlTeXAtom object
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
  CommonTeXAtom,
  CommonTeXAtomClass,
  CommonTeXAtomMixin,
} from '../../common/Wrappers/TeXAtom.js';
import { TeXAtom } from '../../../core/MmlTree/MmlNodes/TeXAtom.js';
import { MmlNode, TEXCLASSNAMES } from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The ChtmlTeXAtom interface for the CHTML TeXAtom wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlTeXAtomNTD<N, T, D>
  extends
    ChtmlWrapper<N, T, D>,
    CommonTeXAtom<
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
 * The ChtmlTeXAtomClass interface for the CHTML TeXAtom wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlTeXAtomClass<N, T, D>
  extends
    ChtmlWrapperClass<N, T, D>,
    CommonTeXAtomClass<
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
  ): ChtmlTeXAtomNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlTeXAtom wrapper class for the MmlTeXAtom class
 */
export const ChtmlTeXAtom = (function <N, T, D>(): ChtmlTeXAtomClass<N, T, D> {
  const Base = CommonTeXAtomMixin<
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
    ChtmlTeXAtomClass<N, T, D>
  >(ChtmlWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be ChtmlWrapper<N, T, D>, but are thought of as different by typescript)
  return class ChtmlTeXAtom extends Base implements ChtmlTeXAtomNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = TeXAtom.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      super.toCHTML(parents);
      this.dom.forEach((dom) =>
        this.adaptor.setAttribute(
          dom,
          'texclass',
          TEXCLASSNAMES[this.node.texClass]
        )
      );
    }
  };
})<any, any, any>();
