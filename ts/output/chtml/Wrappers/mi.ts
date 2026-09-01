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
 * @file  Implements the ChtmlMi wrapper for the MmlMi object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMi,
  CommonMiClass,
  CommonMiMixin,
} from '../../common/Wrappers/mi.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMi } from '../../../core/MmlTree/MmlNodes/mi.js';
import { DOM, DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMi interface for the CHTML Mi wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMiNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonMi<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMiClass interface for the CHTML Mi wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMiClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonMiClass<
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
  ): ChtmlMiNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMi wrapper class for the MmlMi class
 */
export const ChtmlMi = (function (): ChtmlMiClass<DOM> {
  const Base = CommonMiMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMiClass<DOM>
  >(ChtmlWrapper);

  return class ChtmlMi extends Base implements ChtmlMiNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMi.prototype.kind;
  };
})();
