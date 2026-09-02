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
 * @file  Implements the SvgMsubsup wrapper for the MmlMsubsup object
 *                and the special cases SvgMsub and SvgMsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
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
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMsub interface for the SVG Msub wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMsubNTD<DOM extends DOM_TYPES>
  extends
    SvgScriptbaseNTD<DOM>,
    CommonMsub<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMsubClass interface for the SVG Msub wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMsubClass<DOM extends DOM_TYPES>
  extends
    SvgScriptbaseClass<DOM>,
    CommonMsubClass<
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
  ): SvgMsubNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMsub wrapper class for the MmlMsub class
 */
export const SvgMsub = (function (): SvgMsubClass<DOM> {
  const Base = CommonMsubMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMsubClass<DOM>
  >(SvgScriptbase);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMsub extends Base implements SvgMsubNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMsub.prototype.kind;
  };
})();

/*****************************************************************/
/**
 * The SvgMsup interface for the SVG Msup wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMsupNTD<DOM extends DOM_TYPES>
  extends
    SvgScriptbaseNTD<DOM>,
    CommonMsup<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMsupClass interface for the SVG Msup wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMsupClass<DOM extends DOM_TYPES>
  extends
    SvgScriptbaseClass<DOM>,
    CommonMsupClass<
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
  ): SvgMsupNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMsup wrapper class for the MmlMsup class
 */
export const SvgMsup = (function (): SvgMsupClass<DOM> {
  const Base = CommonMsupMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMsupClass<DOM>
  >(SvgScriptbase);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMsup extends Base implements SvgMsupNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMsup.prototype.kind;
  };
})();

/*****************************************************************/
/**
 * The SvgMglyph interface for the SVG Msubsup wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMsubsupNTD<DOM extends DOM_TYPES>
  extends
    SvgScriptbaseNTD<DOM>,
    CommonMsubsup<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMsubsupClass interface for the SVG Msubsup wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMsubsupClass<DOM extends DOM_TYPES>
  extends
    SvgScriptbaseClass<DOM>,
    CommonMsubsupClass<
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
  ): SvgMsubsupNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMsubsup wrapper class for the MmlMsubsup class
 */
export const SvgMsubsup = (function (): SvgMsubsupClass<DOM> {
  const Base = CommonMsubsupMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMsubsupClass<DOM>
  >(SvgScriptbase);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMsubsup extends Base implements SvgMsubsupNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMsubsup.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
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
})();
