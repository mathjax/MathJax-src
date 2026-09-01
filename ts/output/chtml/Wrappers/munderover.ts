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
 * @file  Implements the ChtmlMunderover wrapper for the MmlMunderover object
 *                and the special cases ChtmlMunder and ChtmlMsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
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
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMunder interface for the CHTML Munder wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMunderNTD<DOM extends DOM_TYPES>
  extends
    ChtmlMsubNTD<DOM>,
    CommonMunder<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMunderClass interface for the CHTML Munder wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMunderClass<DOM extends DOM_TYPES>
  extends
    ChtmlMsubClass<DOM>,
    CommonMunderClass<
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
  ): ChtmlMunderNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMunder wrapper class for the MmlMunder class
 */
export const ChtmlMunder = (function (): ChtmlMunderClass<DOM> {
  const Base = CommonMunderMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMunderClass<DOM>
  >(ChtmlMsub);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMunder extends Base implements ChtmlMunderNTD<DOM> {
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
    public toCHTML(parents: N<DOM>[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      if (this.hasMovableLimits()) {
        super.toCHTML(parents);
        this.adaptor.setAttribute(this.dom[0], 'limits', 'false');
        return;
      }
      this.dom = this.standardChtmlNodes(parents);
      const base = this.adaptor.append(
        this.adaptor.append(this.dom[0], this.html('mjx-row')) as N<DOM>,
        this.html('mjx-base')
      ) as N<DOM>;
      const under = this.adaptor.append(
        this.adaptor.append(this.dom[0], this.html('mjx-row')) as N<DOM>,
        this.html('mjx-under')
      ) as N<DOM>;
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
})();

/*****************************************************************/
/*****************************************************************/

/**
 * The ChtmlMover interface for the CHTML Mover wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMoverNTD<DOM extends DOM_TYPES>
  extends
    ChtmlMsupNTD<DOM>,
    CommonMover<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMoverClass interface for the CHTML Mover wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMoverClass<DOM extends DOM_TYPES>
  extends
    ChtmlMsupClass<DOM>,
    CommonMoverClass<
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
  ): ChtmlMoverNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMover wrapper class for the MmlMover class
 */
export const ChtmlMover = (function (): ChtmlMoverClass<DOM> {
  const Base = CommonMoverMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMoverClass<DOM>
  >(ChtmlMsup);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMover extends Base implements ChtmlMoverNTD<DOM> {
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
    public toCHTML(parents: N<DOM>[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      if (this.hasMovableLimits()) {
        super.toCHTML(parents);
        this.adaptor.setAttribute(this.dom[0], 'limits', 'false');
        return;
      }
      this.dom = this.standardChtmlNodes(parents);
      const over = this.adaptor.append(
        this.dom[0],
        this.html('mjx-over')
      ) as N<DOM>;
      const base = this.adaptor.append(
        this.dom[0],
        this.html('mjx-base')
      ) as N<DOM>;
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
})();

/*****************************************************************/
/*****************************************************************/

/**
 * The ChtmlMunderover interface for the CHTML Munderover wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMunderoverNTD<DOM extends DOM_TYPES>
  extends
    ChtmlMsubsupNTD<DOM>,
    CommonMunderover<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMunderoverClass interface for the CHTML Munderover wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMunderoverClass<DOM extends DOM_TYPES>
  extends
    ChtmlMsubsupClass<DOM>,
    CommonMunderoverClass<
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
  ): ChtmlMunderoverNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMunderover wrapper class for the MmlMunderover class
 */
export const ChtmlMunderover = (function (): ChtmlMunderoverClass<DOM> {
  const Base = CommonMunderoverMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMunderoverClass<DOM>
  >(ChtmlMsubsup);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMunderover extends Base implements ChtmlMunderoverNTD<DOM> {
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
    public toCHTML(parents: N<DOM>[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      if (this.hasMovableLimits()) {
        super.toCHTML(parents);
        this.adaptor.setAttribute(this.dom[0], 'limits', 'false');
        return;
      }
      this.dom = this.standardChtmlNodes(parents);
      const over = this.adaptor.append(
        this.dom[0],
        this.html('mjx-over')
      ) as N<DOM>;
      const table = this.adaptor.append(
        this.adaptor.append(this.dom[0], this.html('mjx-box')) as N<DOM>,
        this.html('mjx-munder')
      ) as N<DOM>;
      const base = this.adaptor.append(
        this.adaptor.append(table, this.html('mjx-row')) as N<DOM>,
        this.html('mjx-base')
      ) as N<DOM>;
      const under = this.adaptor.append(
        this.adaptor.append(table, this.html('mjx-row')) as N<DOM>,
        this.html('mjx-under')
      ) as N<DOM>;
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
})();
