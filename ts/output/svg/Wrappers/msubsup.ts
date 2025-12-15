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
 * @file  Implements the SvgMsubsup wrapper for the MmlMsubsup object
 *                and the special cases SvgMsub and SvgMsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  SvgCharOptions,
  SvgVariantData,
  SvgDelimiterData,
  SvgFontData,
  SvgFontDataClass,
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
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import {
  SvgScriptbase,
  SvgScriptbaseNTD,
  SvgScriptbaseClass,
} from './scriptbase.js';
import {
  MmlMsubsup,
  MmlMsub,
  MmlMsup,
} from '../../../core/MmlTree/MmlNodes/msubsup.js';

/*****************************************************************/
/**
 * The SvgMsub interface for the SVG Msub wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMsubNTD<N, T, D>
  extends
    SvgScriptbaseNTD<N, T, D>,
    CommonMsub<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {}

/**
 * The SvgMsubClass interface for the SVG Msub wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMsubClass<N, T, D>
  extends
    SvgScriptbaseClass<N, T, D>,
    CommonMsubClass<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgMsubNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMsub wrapper class for the MmlMsub class
 */
export const SvgMsub = (function <N, T, D>(): SvgMsubClass<N, T, D> {
  const Base = CommonMsubMixin<
    N,
    T,
    D,
    SVG<N, T, D>,
    SvgWrapper<N, T, D>,
    SvgWrapperFactory<N, T, D>,
    SvgWrapperClass<N, T, D>,
    SvgCharOptions,
    SvgVariantData,
    SvgDelimiterData,
    SvgFontData,
    SvgFontDataClass,
    SvgMsubClass<N, T, D>
  >(SvgScriptbase);

  // @ts-expect-error Avoid message about base constructors not having the same
  //   type (they should both be SvgWrapper<N, T, D>, but are thought of as
  //   different by typescript)
  return class SvgMsub extends Base implements SvgMsubNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMsub.prototype.kind;
  };
})<any, any, any>();

/*****************************************************************/
/**
 * The SvgMsup interface for the SVG Msup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMsupNTD<N, T, D>
  extends
    SvgScriptbaseNTD<N, T, D>,
    CommonMsup<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {}

/**
 * The SvgMsupClass interface for the SVG Msup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMsupClass<N, T, D>
  extends
    SvgScriptbaseClass<N, T, D>,
    CommonMsupClass<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgMsupNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMsup wrapper class for the MmlMsup class
 */
export const SvgMsup = (function <N, T, D>(): SvgMsupClass<N, T, D> {
  const Base = CommonMsupMixin<
    N,
    T,
    D,
    SVG<N, T, D>,
    SvgWrapper<N, T, D>,
    SvgWrapperFactory<N, T, D>,
    SvgWrapperClass<N, T, D>,
    SvgCharOptions,
    SvgVariantData,
    SvgDelimiterData,
    SvgFontData,
    SvgFontDataClass,
    SvgMsupClass<N, T, D>
  >(SvgScriptbase);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgMsup extends Base implements SvgMsupNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMsup.prototype.kind;
  };
})<any, any, any>();

/*****************************************************************/
/**
 * The SvgMglyph interface for the SVG Msubsup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMsubsupNTD<N, T, D>
  extends
    SvgScriptbaseNTD<N, T, D>,
    CommonMsubsup<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {}

/**
 * The SvgMsubsupClass interface for the SVG Msubsup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMsubsupClass<N, T, D>
  extends
    SvgScriptbaseClass<N, T, D>,
    CommonMsubsupClass<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgMsubsupNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMsubsup wrapper class for the MmlMsubsup class
 */
export const SvgMsubsup = (function <N, T, D>(): SvgMsubsupClass<N, T, D> {
  const Base = CommonMsubsupMixin<
    N,
    T,
    D,
    SVG<N, T, D>,
    SvgWrapper<N, T, D>,
    SvgWrapperFactory<N, T, D>,
    SvgWrapperClass<N, T, D>,
    SvgCharOptions,
    SvgVariantData,
    SvgDelimiterData,
    SvgFontData,
    SvgFontDataClass,
    SvgMsubsupClass<N, T, D>
  >(SvgScriptbase);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgMsubsup extends Base implements SvgMsubsupNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMsubsup.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      if (this.toEmbellishedSVG(parents)) return;
      const svg = this.standardSvgNodes(parents);
      const [base, sup, sub] = [this.baseChild, this.supChild, this.subChild];
      const w = this.getBaseWidth();
      const x = this.getAdjustedIc();
      const [u, v] = this.getUVQ();

      base.toSVG(svg);
      const tail = [svg[svg.length - 1]];
      sup.toSVG(tail);
      sub.toSVG(tail);

      base.place(0, 0);
      sub.place(w + (this.baseIsChar ? 0 : x), v);
      sup.place(w + x, u);
    }
  };
})<any, any, any>();
