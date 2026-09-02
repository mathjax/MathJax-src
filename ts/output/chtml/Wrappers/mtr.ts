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
 * @file  Implements the ChtmlMtr wrapper for the MmlMtr object
 *                and ChtmlMlabeledtr for MmlMlabeledtr
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMtr,
  CommonMtrClass,
  CommonMtrMixin,
  CommonMlabeledtr,
  CommonMlabeledtrClass,
  CommonMlabeledtrMixin,
} from '../../common/Wrappers/mtr.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMtr, MmlMlabeledtr } from '../../../core/MmlTree/MmlNodes/mtr.js';
import { ChtmlMtableNTD } from './mtable.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMtr interface for the CHTML Mtr wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMtrNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonMtr<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMtrClass interface for the CHTML Mtr wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMtrClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonMtrClass<
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
  ): ChtmlMtrNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMtr wrapper class for the MmlMtr class
 */
export const ChtmlMtr = (function (): ChtmlMtrClass<DOM> {
  const Base = CommonMtrMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMtrClass<DOM>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMtr extends Base implements ChtmlMtrNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMtr.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-mtr': {
        display: 'table-row',
      },
      'mjx-mtr[rowalign="top"] > mjx-mtd': {
        'vertical-align': 'top',
      },
      'mjx-mtr[rowalign="center"] > mjx-mtd': {
        'vertical-align': 'middle',
      },
      'mjx-mtr[rowalign="bottom"] > mjx-mtd': {
        'vertical-align': 'bottom',
      },
      'mjx-mtr[rowalign="baseline"] > mjx-mtd': {
        'vertical-align': 'baseline',
      },
      'mjx-mtr[rowalign="axis"] > mjx-mtd': {
        'vertical-align': '.25em',
      },
    };

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
      super.toCHTML(parents);
      const align = this.node.attributes.get('rowalign') as string;
      if (align !== 'baseline') {
        this.adaptor.setAttribute(this.dom[0], 'rowalign', align);
      }
      const { h, d } = this.getBBox();
      this.adaptor.setStyle(this.dom[0], 'height', this.em(h + d));
    }
  };
})();

/*****************************************************************/
/**
 * The ChtmlMlabeledtr interface for the CHTML Mlabeledtr wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMlabeledtrNTD<DOM extends DOM_TYPES>
  extends
    ChtmlMtrNTD<DOM>,
    CommonMlabeledtr<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMlabeledtrClass interface for the CHTML Mlabeledtr wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMlabeledtrClass<DOM extends DOM_TYPES>
  extends
    ChtmlMtrClass<DOM>,
    CommonMlabeledtrClass<
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
  ): ChtmlMlabeledtrNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMlabeledtr wrapper class for the MmlMlabeledtr class
 */
export const ChtmlMlabeledtr = (function (): ChtmlMlabeledtrClass<DOM> {
  const Base = CommonMlabeledtrMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMlabeledtrClass<DOM>
  >(ChtmlMtr);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMlabeledtr extends Base implements ChtmlMlabeledtrNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMlabeledtr.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-mlabeledtr': {
        display: 'table-row',
      },
      'mjx-mlabeledtr[rowalign="top"] > mjx-mtd': {
        'vertical-align': 'top',
      },
      'mjx-mlabeledtr[rowalign="center"] > mjx-mtd': {
        'vertical-align': 'middle',
      },
      'mjx-mlabeledtr[rowalign="bottom"] > mjx-mtd': {
        'vertical-align': 'bottom',
      },
      'mjx-mlabeledtr[rowalign="baseline"] > mjx-mtd': {
        'vertical-align': 'baseline',
      },
      'mjx-mlabeledtr[rowalign="axis"] > mjx-mtd': {
        'vertical-align': '.25em',
      },
    };

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
      super.toCHTML(parents);
      const child = this.adaptor.firstChild(this.dom[0]) as N<DOM>;
      if (child) {
        //
        // Remove label and put it into the labels box inside a row
        //
        this.adaptor.remove(child);
        const align = this.node.attributes.get('rowalign') as string;
        const attr =
          align !== 'baseline' && align !== 'axis' ? { rowalign: align } : {};
        const row = this.html('mjx-mtr', attr, [child]);
        this.adaptor.append((this.parent as ChtmlMtableNTD<DOM>).labels, row);
      }
    }

    /**
     * @override
     */
    public markUsed() {
      super.markUsed();
      this.jax.wrapperUsage.add(ChtmlMtr.kind);
    }
  };
})();
