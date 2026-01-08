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
 * @file  Implements the ChtmlMtr wrapper for the MmlMtr object
 *                and ChtmlMlabeledtr for MmlMlabeledtr
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

/*****************************************************************/
/**
 * The ChtmlMtr interface for the CHTML Mtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMtrNTD<N, T, D>
  extends
    ChtmlWrapper<N, T, D>,
    CommonMtr<
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
 * The ChtmlMtrClass interface for the CHTML Mtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMtrClass<N, T, D>
  extends
    ChtmlWrapperClass<N, T, D>,
    CommonMtrClass<
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
  ): ChtmlMtrNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMtr wrapper class for the MmlMtr class
 */
export const ChtmlMtr = (function <N, T, D>(): ChtmlMtrClass<N, T, D> {
  const Base = CommonMtrMixin<
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
    ChtmlMtrClass<N, T, D>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlMtr extends Base implements ChtmlMtrNTD<N, T, D> {
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
    public toCHTML(parents: N[]) {
      super.toCHTML(parents);
      const align = this.node.attributes.get('rowalign') as string;
      if (align !== 'baseline') {
        this.adaptor.setAttribute(this.dom[0], 'rowalign', align);
      }
      const { h, d } = this.getBBox();
      this.adaptor.setStyle(this.dom[0], 'height', this.em(h + d));
    }
  };
})<any, any, any>();

/*****************************************************************/
/**
 * The ChtmlMlabeledtr interface for the CHTML Mlabeledtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMlabeledtrNTD<N, T, D>
  extends
    ChtmlMtrNTD<N, T, D>,
    CommonMlabeledtr<
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
 * The ChtmlMlabeledtrClass interface for the CHTML Mlabeledtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMlabeledtrClass<N, T, D>
  extends
    ChtmlMtrClass<N, T, D>,
    CommonMlabeledtrClass<
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
  ): ChtmlMlabeledtrNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMlabeledtr wrapper class for the MmlMlabeledtr class
 */
export const ChtmlMlabeledtr = (function <N, T, D>(): ChtmlMlabeledtrClass<
  N,
  T,
  D
> {
  const Base = CommonMlabeledtrMixin<
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
    ChtmlMlabeledtrClass<N, T, D>
  >(ChtmlMtr);

  // Avoid message about base constructors not having the same type
  //   (they should both be ChtmlWrapper<N, T, D>, but are thought of as different by typescript)
  return class ChtmlMlabeledtr
    // @ts-expect-error Avoid message about base constructors not having the
    // same type (they should both be ChtmlWrapper<N, T, D>, but are thought of
    // as different by typescript)
    extends Base
    implements ChtmlMlabeledtrNTD<N, T, D>
  {
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
    public toCHTML(parents: N[]) {
      super.toCHTML(parents);
      const child = this.adaptor.firstChild(this.dom[0]) as N;
      if (child) {
        //
        // Remove label and put it into the labels box inside a row
        //
        this.adaptor.remove(child);
        const align = this.node.attributes.get('rowalign') as string;
        const attr =
          align !== 'baseline' && align !== 'axis' ? { rowalign: align } : {};
        const row = this.html('mjx-mtr', attr, [child]);
        this.adaptor.append(
          (this.parent as ChtmlMtableNTD<N, T, D>).labels,
          row
        );
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
})<any, any, any>();
