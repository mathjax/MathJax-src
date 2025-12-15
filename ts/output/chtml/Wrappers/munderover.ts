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
 * @file  Implements the ChtmlMunderover wrapper for the MmlMunderover object
 *                and the special cases ChtmlMunder and ChtmlMsup
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
  CommonMunder,
  CommonMunderClass,
  CommonMunderMixin,
  CommonMover,
  CommonMoverClass,
  CommonMoverMixin,
  CommonMunderover,
  CommonMunderoverClass,
  CommonMunderoverMixin,
} from '../../common/Wrappers/munderover.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import {
  MmlMunderover,
  MmlMunder,
  MmlMover,
} from '../../../core/MmlTree/MmlNodes/munderover.js';
import {
  ChtmlMsub,
  ChtmlMsubClass,
  ChtmlMsubNTD,
  ChtmlMsup,
  ChtmlMsupClass,
  ChtmlMsupNTD,
  ChtmlMsubsup,
  ChtmlMsubsupClass,
  ChtmlMsubsupNTD,
} from './msubsup.js';
import { StyleJson } from '../../../util/StyleJson.js';

/*****************************************************************/
/**
 * The ChtmlMunder interface for the CHTML Munder wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMunderNTD<N, T, D>
  extends
    ChtmlMsubNTD<N, T, D>,
    CommonMunder<
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
 * The ChtmlMunderClass interface for the CHTML Munder wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMunderClass<N, T, D>
  extends
    ChtmlMsubClass<N, T, D>,
    CommonMunderClass<
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
  ): ChtmlMunderNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMunder wrapper class for the MmlMunder class
 */
export const ChtmlMunder = (function <N, T, D>(): ChtmlMunderClass<N, T, D> {
  const Base = CommonMunderMixin<
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
    ChtmlMunderClass<N, T, D>
  >(ChtmlMsub);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlMunder extends Base implements ChtmlMunderNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMunder.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-over': {
        'text-align': 'left',
      },
      'mjx-munder:not([limits="false"])': {
        display: 'inline-table',
      },
      'mjx-munder > mjx-row': {
        'text-align': 'left',
      },
      'mjx-under': {
        'padding-bottom': '.1em', // big_op_spacing5
      },
    };

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      if (this.hasMovableLimits()) {
        super.toCHTML(parents);
        this.adaptor.setAttribute(this.dom[0], 'limits', 'false');
        return;
      }
      this.dom = this.standardChtmlNodes(parents);
      const base = this.adaptor.append(
        this.adaptor.append(this.dom[0], this.html('mjx-row')) as N,
        this.html('mjx-base')
      ) as N;
      const under = this.adaptor.append(
        this.adaptor.append(this.dom[0], this.html('mjx-row')) as N,
        this.html('mjx-under')
      ) as N;
      this.baseChild.toCHTML([base]);
      this.scriptChild.toCHTML([under]);
      const basebox = this.baseChild.getOuterBBox();
      const underbox = this.scriptChild.getOuterBBox();
      const k = this.getUnderKV(basebox, underbox)[0];
      const delta = this.isLineBelow
        ? 0
        : this.getDelta(this.scriptChild, true);
      this.adaptor.setStyle(under, 'paddingTop', this.em(k));
      this.setDeltaW(
        [base, under],
        this.getDeltaW([basebox, underbox], [0, -delta])
      );
      this.adjustUnderDepth(under, underbox);
    }
  };
})<any, any, any>();

/*****************************************************************/
/*****************************************************************/

/**
 * The ChtmlMover interface for the CHTML Mover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMoverNTD<N, T, D>
  extends
    ChtmlMsupNTD<N, T, D>,
    CommonMover<
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
 * The ChtmlMoverClass interface for the CHTML Mover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMoverClass<N, T, D>
  extends
    ChtmlMsupClass<N, T, D>,
    CommonMoverClass<
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
  ): ChtmlMoverNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMover wrapper class for the MmlMover class
 */
export const ChtmlMover = (function <N, T, D>(): ChtmlMoverClass<N, T, D> {
  const Base = CommonMoverMixin<
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
    ChtmlMoverClass<N, T, D>
  >(ChtmlMsup);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlMover extends Base implements ChtmlMoverNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMover.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-mover:not([limits="false"])': {
        'padding-top': '.1em', // big_op_spacing5
      },
      [['base', 'over']
        .map((node) => `mjx-mover:not([limits="false"]) > mjx-${node}`)
        .join(', ')]: {
        display: 'block',
        'text-align': 'left',
      },
    };

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      if (this.hasMovableLimits()) {
        super.toCHTML(parents);
        this.adaptor.setAttribute(this.dom[0], 'limits', 'false');
        return;
      }
      this.dom = this.standardChtmlNodes(parents);
      const over = this.adaptor.append(this.dom[0], this.html('mjx-over')) as N;
      const base = this.adaptor.append(this.dom[0], this.html('mjx-base')) as N;
      this.scriptChild.toCHTML([over]);
      this.baseChild.toCHTML([base]);
      const overbox = this.scriptChild.getOuterBBox();
      const basebox = this.baseChild.getOuterBBox();
      this.adjustBaseHeight(base, basebox);
      const k = this.getOverKU(basebox, overbox)[0];
      const delta = this.isLineAbove ? 0 : this.getDelta(this.scriptChild);
      this.adaptor.setStyle(over, 'paddingBottom', this.em(k));
      this.setDeltaW(
        [base, over],
        this.getDeltaW([basebox, overbox], [0, delta])
      );
      this.adjustOverDepth(over, overbox);
    }
  };
})<any, any, any>();

/*****************************************************************/
/*****************************************************************/

/**
 * The ChtmlMunderover interface for the CHTML Munderover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMunderoverNTD<N, T, D>
  extends
    ChtmlMsubsupNTD<N, T, D>,
    CommonMunderover<
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
 * The ChtmlMunderoverClass interface for the CHTML Munderover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMunderoverClass<N, T, D>
  extends
    ChtmlMsubsupClass<N, T, D>,
    CommonMunderoverClass<
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
  ): ChtmlMunderoverNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMunderover wrapper class for the MmlMunderover class
 */
export const ChtmlMunderover = (function <N, T, D>(): ChtmlMunderoverClass<
  N,
  T,
  D
> {
  const Base = CommonMunderoverMixin<
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
    ChtmlMunderoverClass<N, T, D>
  >(ChtmlMsubsup);

  return class ChtmlMunderover
    // @ts-expect-error Avoid message about base constructors not having the
    // same type (they should both be ChtmlWrapper<N, T, D>, but are thought of
    // as different by typescript)
    extends Base
    implements ChtmlMunderoverNTD<N, T, D>
  {
    /**
     * @override
     */
    public static kind = MmlMunderover.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-munderover:not([limits="false"])': {
        'padding-top': '.1em', // big_op_spacing5
      },
      [['over', 'box']
        .map((node) => `mjx-munderover:not([limits="false"]) > mjx-${node}`)
        .join(', ')]: {
        display: 'block',
      },
    };

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      if (this.hasMovableLimits()) {
        super.toCHTML(parents);
        this.adaptor.setAttribute(this.dom[0], 'limits', 'false');
        return;
      }
      this.dom = this.standardChtmlNodes(parents);
      const over = this.adaptor.append(this.dom[0], this.html('mjx-over')) as N;
      const table = this.adaptor.append(
        this.adaptor.append(this.dom[0], this.html('mjx-box')) as N,
        this.html('mjx-munder')
      ) as N;
      const base = this.adaptor.append(
        this.adaptor.append(table, this.html('mjx-row')) as N,
        this.html('mjx-base')
      ) as N;
      const under = this.adaptor.append(
        this.adaptor.append(table, this.html('mjx-row')) as N,
        this.html('mjx-under')
      ) as N;
      this.overChild.toCHTML([over]);
      this.baseChild.toCHTML([base]);
      this.underChild.toCHTML([under]);
      const overbox = this.overChild.getOuterBBox();
      const basebox = this.baseChild.getOuterBBox();
      const underbox = this.underChild.getOuterBBox();
      this.adjustBaseHeight(base, basebox);
      const ok = this.getOverKU(basebox, overbox)[0];
      const uk = this.getUnderKV(basebox, underbox)[0];
      const odelta = this.getDelta(this.overChild);
      const udelta = this.getDelta(this.underChild, true);
      this.adaptor.setStyle(over, 'paddingBottom', this.em(ok));
      this.adaptor.setStyle(under, 'paddingTop', this.em(uk));
      this.setDeltaW(
        [base, under, over],
        this.getDeltaW(
          [basebox, underbox, overbox],
          [0, this.isLineBelow ? 0 : -udelta, this.isLineAbove ? 0 : odelta]
        )
      );
      this.adjustOverDepth(over, overbox);
      this.adjustUnderDepth(under, underbox);
    }
  };
})<any, any, any>();
