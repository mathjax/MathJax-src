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
 * @file  Implements the ChtmlTeXAtom wrapper for the MmlTeXAtom object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonTeXAtom,
  CommonTeXAtomClass,
  CommonTeXAtomMixin,
} from '../../common/Wrappers/TeXAtom.js';
import { TeXAtom } from '../../../core/MmlTree/MmlNodes/TeXAtom.js';
import { MmlNode, TEXCLASSNAMES } from '../../../core/MmlTree/MmlNode.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlTeXAtom interface for the CHTML TeXAtom wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlTeXAtomNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonTeXAtom<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlTeXAtomClass interface for the CHTML TeXAtom wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlTeXAtomClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonTeXAtomClass<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {
  new (
    factory: ChtmlWrapperFactory<DOM>,
    node: MmlNode,
    parent?: ChtmlWrapper<DOM>
  ): ChtmlTeXAtomNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlTeXAtom wrapper class for the MmlTeXAtom class
 */
export const ChtmlTeXAtom = (function (): ChtmlTeXAtomClass<DOM> {
  const Base = CommonTeXAtomMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlTeXAtomClass<DOM>
  >(ChtmlWrapper);

  return class ChtmlTeXAtom extends Base implements ChtmlTeXAtomNTD<DOM> {
    /**
     * @override
     */
    public static kind = TeXAtom.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
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
})();
