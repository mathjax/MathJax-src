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
 * @file  Implements the SvgTeXAtom wrapper for the MmlTeXAtom object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
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
 * The SvgTeXAtom interface for the SVG TeXAtom wrapper
 *
 * @template DOM   The DOM Node types
 */
export interface SvgTeXAtomNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonTeXAtom<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgTeXAtomClass interface for the SVG TeXAtom wrapper
 *
 * @template DOM   The DOM Node types
 */
export interface SvgTeXAtomClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonTeXAtomClass<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {
  new (
    factory: SvgWrapperFactory<DOM>,
    node: MmlNode,
    parent?: SvgWrapper<DOM>
  ): SvgTeXAtomNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgTeXAtom wrapper for the MmlTeXAtom class
 */
export const SvgTeXAtom = (function (): SvgTeXAtomClass<DOM> {
  const Base = CommonTeXAtomMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgTeXAtomClass<DOM>
  >(SvgWrapper);

  return class SvgTeXAtom extends Base implements SvgTeXAtomNTD<DOM> {
    /**
     * @override
     */
    public static kind = TeXAtom.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
      super.toSVG(parents);
      this.adaptor.setAttribute(
        this.dom[0],
        'data-mjx-texclass',
        TEXCLASSNAMES[this.node.texClass]
      );
    }
  } as any as SvgTeXAtomClass<DOM>;
})();
