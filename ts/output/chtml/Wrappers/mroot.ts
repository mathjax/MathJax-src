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
 * @file  Implements the ChtmlMroot wrapper for the MmlMroot object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMroot,
  CommonMrootClass,
  CommonMrootMixin,
} from '../../common/Wrappers/mroot.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { ChtmlMsqrt, ChtmlMsqrtClass, ChtmlMsqrtNTD } from './msqrt.js';
import { BBox } from '../../../util/BBox.js';
import { MmlMroot } from '../../../core/MmlTree/MmlNodes/mroot.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMroot interface for the CHTML Mroot wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMrootNTD<DOM extends DOM_TYPES>
  extends
    ChtmlMsqrtNTD<DOM>,
    CommonMroot<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMrootClass interface for the CHTML Mroot wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMrootClass<DOM extends DOM_TYPES>
  extends
    ChtmlMsqrtClass<DOM>,
    CommonMrootClass<
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
  ): ChtmlMrootNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMroot wrapper class for the MmlMroot class
 */
export const ChtmlMroot = (function (): ChtmlMrootClass<DOM> {
  const Base = CommonMrootMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMrootClass<DOM>
  >(ChtmlMsqrt);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMroot extends Base implements ChtmlMrootNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMroot.prototype.kind;

    /**
     * @override
     */
    protected addRoot(
      ROOT: N<DOM>,
      root: ChtmlWrapper<DOM>,
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
          adaptor.firstChild(ROOT) as N<DOM>,
          'paddingLeft',
          this.em(dx)
        );
      }
    }
  };
})();
