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
 * @file  Implements the ChtmlMtd wrapper for the MmlMtd object
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
  CommonMtd,
  CommonMtdClass,
  CommonMtdMixin,
} from '../../common/Wrappers/mtd.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMtd } from '../../../core/MmlTree/MmlNodes/mtd.js';
import { StyleJson } from '../../../util/StyleJson.js';

/*****************************************************************/
/**
 * The ChtmlMtd interface for the CHTML Mtd wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMtdNTD<N, T, D>
  extends ChtmlWrapper<N, T, D>,
    CommonMtd<
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
 * The ChtmlMtdClass interface for the CHTML Mtd wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMtdClass<N, T, D>
  extends ChtmlWrapperClass<N, T, D>,
    CommonMtdClass<
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
  ): ChtmlMtdNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMtd wrapper class for the MmlMtd class
 */
export const ChtmlMtd = (function <N, T, D>(): ChtmlMtdClass<N, T, D> {
  const Base = CommonMtdMixin<
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
    ChtmlMtdClass<N, T, D>
  >(ChtmlWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be ChtmlWrapper<N, T, D>, but are thought of as different by typescript)
  return class ChtmlMtd extends Base implements ChtmlMtdNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMtd.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-mtd': {
        display: 'table-cell',
        'text-align': 'center',
        padding: '.215em .4em',
      },
      'mjx-mtd:first-child': {
        'padding-left': 0,
      },
      'mjx-mtd:last-child': {
        'padding-right': 0,
      },
      'mjx-mtable > * > mjx-itable > *:first-child > mjx-mtd': {
        'padding-top': 0,
      },
      'mjx-mtable > * > mjx-itable > *:last-child > mjx-mtd': {
        'padding-bottom': 0,
      },
      'mjx-tstrut': {
        display: 'inline-block',
        height: '1em',
        'vertical-align': '-.25em',
      },
      'mjx-labels[align="left"] > mjx-mtr > mjx-mtd': {
        'text-align': 'left',
      },
      'mjx-labels[align="right"] > mjx-mtr > mjx-mtd': {
        'text-align': 'right',
      },
      'mjx-mtd[extra]': {
        padding: 0,
      },
      'mjx-mtd[rowalign="top"]': {
        'vertical-align': 'top',
      },
      'mjx-mtd[rowalign="center"]': {
        'vertical-align': 'middle',
      },
      'mjx-mtd[rowalign="bottom"]': {
        'vertical-align': 'bottom',
      },
      'mjx-mtd[rowalign="baseline"]': {
        'vertical-align': 'baseline',
      },
      'mjx-mtd[rowalign="axis"]': {
        'vertical-align': '.25em',
      },
    };

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      super.toCHTML(parents);
      const ralign = this.node.attributes.get('rowalign') as string;
      const calign = this.node.attributes.get('columnalign') as string;
      const palign = this.parent.node.attributes.get('rowalign') as string;
      if (ralign !== palign) {
        this.adaptor.setAttribute(this.dom[0], 'rowalign', ralign);
      }
      if (
        calign !== 'center' &&
        (this.parent.kind !== 'mlabeledtr' ||
          this !== this.parent.childNodes[0] ||
          calign !== this.parent.parent.node.attributes.get('side'))
      ) {
        this.adaptor.setStyle(this.dom[0], 'textAlign', calign);
      }
      //
      // If we are using minimum row heights,
      //   Include a strut to force minimum height and depth
      //
      if (this.parent.parent.node.getProperty('useHeight')) {
        this.adaptor.append(this.dom[0], this.html('mjx-tstrut'));
      }
    }
  };
})<any, any, any>();
