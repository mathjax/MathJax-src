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
 * @file  Implements the ChtmlMsubsup wrapper for the MmlMsubsup object
 *                and the special cases ChtmlMsub and ChtmlMsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMsub,
  CommonMsubClass,
  CommonMsubMixin,
  CommonMsup,
  CommonMsupClass,
  CommonMsupMixin,
  CommonMsubsup,
  CommonMsubsupClass,
  CommonMsubsupMixin,
} from '../../common/Wrappers/msubsup.js';
import {
  ChtmlScriptbase,
  ChtmlScriptbaseClass,
  ChtmlScriptbaseNTD,
} from './scriptbase.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import {
  MmlMsubsup,
  MmlMsub,
  MmlMsup,
} from '../../../core/MmlTree/MmlNodes/msubsup.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMsub interface for the CHTML Msub wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMsubNTD<DOM extends DOM_TYPES>
  extends
    ChtmlScriptbaseNTD<DOM>,
    CommonMsub<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMsubClass interface for the CHTML Msub wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMsubClass<DOM extends DOM_TYPES>
  extends
    ChtmlScriptbaseClass<DOM>,
    CommonMsubClass<
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
  ): ChtmlMsubNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMsub wrapper class for the MmlMsub class
 */
export const ChtmlMsub = (function (): ChtmlMsubClass<DOM> {
  const Base = CommonMsubMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMsubClass<DOM>
  >(ChtmlScriptbase);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMsub extends Base implements ChtmlMsubNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMsub.prototype.kind;
  };
})();

/*****************************************************************/
/*****************************************************************/

/**
 * The ChtmlMsup interface for the CHTML Msup wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMsupNTD<DOM extends DOM_TYPES>
  extends
    ChtmlScriptbaseNTD<DOM>,
    CommonMsup<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMsupClass interface for the CHTML Msup wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMsupClass<DOM extends DOM_TYPES>
  extends
    ChtmlScriptbaseClass<DOM>,
    CommonMsupClass<
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
  ): ChtmlMsupNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMsup wrapper class for the MmlMsup class
 */
export const ChtmlMsup = (function (): ChtmlMsupClass<DOM> {
  const Base = CommonMsupMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMsupClass<DOM>
  >(ChtmlScriptbase);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMsup extends Base implements ChtmlMsupNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMsup.prototype.kind;
  };
})();

/*****************************************************************/
/*****************************************************************/

/**
 * The ChtmlMsubsup interface for the CHTML Msubsup wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMsubsupNTD<DOM extends DOM_TYPES>
  extends
    ChtmlScriptbaseNTD<DOM>,
    CommonMsubsup<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMsubsupClass interface for the CHTML Msubsup wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMsubsupClass<DOM extends DOM_TYPES>
  extends
    ChtmlScriptbaseClass<DOM>,
    CommonMsubsupClass<
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
  ): ChtmlMsubsupNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMsubsup wrapper class for the MmlMsubsup class
 */
export const ChtmlMsubsup = (function (): ChtmlMsubsupClass<DOM> {
  const Base = CommonMsubsupMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMsubsupClass<DOM>
  >(ChtmlScriptbase);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMsubsup extends Base implements ChtmlMsubsupNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMsubsup.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-script': {
        display: 'inline-block',
        'padding-right': '.05em', // scriptspace
        'padding-left': '.033em', // extra_ic
      },
      'mjx-script > mjx-spacer': {
        display: 'block',
      },
    };

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      const adaptor = this.adaptor;
      const chtml = this.standardChtmlNodes(parents);
      const [base, sup, sub] = [this.baseChild, this.supChild, this.subChild];
      const [, v, q] = this.getUVQ();
      const style = { 'vertical-align': this.em(v) };
      base.toCHTML(chtml);
      const stack = adaptor.append(
        chtml[chtml.length - 1],
        this.html('mjx-script', { style })
      ) as N<DOM>;
      sup.toCHTML([stack]);
      adaptor.append(
        stack,
        this.html('mjx-spacer', { style: { 'margin-top': this.em(q) } })
      );
      sub.toCHTML([stack]);
      const ic = this.getAdjustedIc();
      if (ic) {
        adaptor.setStyle(
          sup.dom[0],
          'marginLeft',
          this.em(ic / sup.bbox.rscale)
        );
        if (!this.baseIsChar) {
          adaptor.setStyle(
            sub.dom[0],
            'marginLeft',
            this.em(ic / sup.bbox.rscale)
          );
        }
      }
      if (this.baseRemoveIc) {
        adaptor.setStyle(stack, 'marginLeft', this.em(-this.baseIc));
      }
    }
  };
})();
