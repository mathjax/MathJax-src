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
 * @file  Implements the ChtmlMsubsup wrapper for the MmlMsubsup object
 *                and the special cases ChtmlMsub and ChtmlMsup
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

/*****************************************************************/
/**
 * The ChtmlMsub interface for the CHTML Msub wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMsubNTD<N, T, D>
  extends ChtmlScriptbaseNTD<N, T, D>,
    CommonMsub<
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
 * The ChtmlMsubClass interface for the CHTML Msub wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMsubClass<N, T, D>
  extends ChtmlScriptbaseClass<N, T, D>,
    CommonMsubClass<
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
  ): ChtmlMsubNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMsub wrapper class for the MmlMsub class
 */
export const ChtmlMsub = (function <N, T, D>(): ChtmlMsubClass<N, T, D> {
  const Base = CommonMsubMixin<
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
    ChtmlMsubClass<N, T, D>
  >(ChtmlScriptbase);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlMsub extends Base implements ChtmlMsubNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMsub.prototype.kind;
  };
})<any, any, any>();

/*****************************************************************/
/*****************************************************************/

/**
 * The ChtmlMsup interface for the CHTML Msup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMsupNTD<N, T, D>
  extends ChtmlScriptbaseNTD<N, T, D>,
    CommonMsup<
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
 * The ChtmlMsupClass interface for the CHTML Msup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMsupClass<N, T, D>
  extends ChtmlScriptbaseClass<N, T, D>,
    CommonMsupClass<
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
  ): ChtmlMsupNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMsup wrapper class for the MmlMsup class
 */
export const ChtmlMsup = (function <N, T, D>(): ChtmlMsupClass<N, T, D> {
  const Base = CommonMsupMixin<
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
    ChtmlMsupClass<N, T, D>
  >(ChtmlScriptbase);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlMsup extends Base implements ChtmlMsupNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMsup.prototype.kind;
  };
})<any, any, any>();

/*****************************************************************/
/*****************************************************************/

/**
 * The ChtmlMsubsup interface for the CHTML Msubsup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMsubsupNTD<N, T, D>
  extends ChtmlScriptbaseNTD<N, T, D>,
    CommonMsubsup<
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
 * The ChtmlMsubsupClass interface for the CHTML Msubsup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMsubsupClass<N, T, D>
  extends ChtmlScriptbaseClass<N, T, D>,
    CommonMsubsupClass<
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
  ): ChtmlMsubsupNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMsubsup wrapper class for the MmlMsubsup class
 */
export const ChtmlMsubsup = (function <N, T, D>(): ChtmlMsubsupClass<N, T, D> {
  const Base = CommonMsubsupMixin<
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
    ChtmlMsubsupClass<N, T, D>
  >(ChtmlScriptbase);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlMsubsup extends Base implements ChtmlMsubsupNTD<N, T, D> {
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
    public toCHTML(parents: N[]) {
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
      ) as N;
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
})<any, any, any>();
