/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview  Implements the CHTMLmtr wrapper for the MmlMtr object
 *                and CHTMLmlabeledtr for MmlMlabeledtr
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonMtr, CommonMtrClass, CommonMtrMixin,
        CommonMlabeledtr, CommonMlabeledtrClass, CommonMlabeledtrMixin} from '../../common/Wrappers/mtr.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMtr, MmlMlabeledtr} from '../../../core/MmlTree/MmlNodes/mtr.js';
import {CHTMLMtableNTD} from './mtable.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLMtr interface for the CHTML Mtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMtrNTD<N, T, D> extends CHTMLWrapper<N, T, D>, CommonMtr<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMtrClass interface for the CHTML Mtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMtrClass<N, T, D> extends CHTMLWrapperClass<N, T, D>, CommonMtrClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMtrNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMtr wrapper class for the MmlMtr class
 */
export const CHTMLMtr = (function <N, T, D>(): CHTMLMtrClass<N, T, D> {

  const Base = CommonMtrMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMtrClass<N, T, D>
    >(CHTMLWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMtr extends Base implements CHTMLMtrNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMtr.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-mtr': {
        display: 'table-row',
      },
      'mjx-mtr[rowalign="top"] > mjx-mtd': {
        'vertical-align': 'top'
      },
      'mjx-mtr[rowalign="center"] > mjx-mtd': {
        'vertical-align': 'middle'
      },
      'mjx-mtr[rowalign="bottom"] > mjx-mtd': {
        'vertical-align': 'bottom'
      },
      'mjx-mtr[rowalign="baseline"] > mjx-mtd': {
        'vertical-align': 'baseline'
      },
      'mjx-mtr[rowalign="axis"] > mjx-mtd': {
        'vertical-align': '.25em'
      }
    };

    /**
     * @override
     */
    public toCHTML(parent: N) {
      super.toCHTML(parent);
      const align = this.node.attributes.get('rowalign') as string;
      if (align !== 'baseline') {
        this.adaptor.setAttribute(this.chtml, 'rowalign', align);
      }
    }

  };

})<any, any, any>();


/*****************************************************************/
/**
 * The CHTMLMlabeledtr interface for the CHTML Mlabeledtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMlabeledtrNTD<N, T, D> extends CHTMLMtrNTD<N, T, D>, CommonMlabeledtr<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMlabeledtrClass interface for the CHTML Mlabeledtr wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMlabeledtrClass<N, T, D> extends CHTMLMtrClass<N, T, D>, CommonMlabeledtrClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMlabeledtrNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMlabeledtr wrapper class for the MmlMlabeledtr class
 */
export const CHTMLMlabeledtr = (function <N, T, D>(): CHTMLMlabeledtrClass<N, T, D> {

  const Base = CommonMlabeledtrMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMlabeledtrClass<N, T, D>
    >(CHTMLMtr);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMlabeledtr extends Base implements CHTMLMlabeledtrNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMlabeledtr.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-mlabeledtr': {
        display: 'table-row'
      },
      'mjx-mlabeledtr[rowalign="top"] > mjx-mtd': {
        'vertical-align': 'top'
      },
      'mjx-mlabeledtr[rowalign="center"] > mjx-mtd': {
        'vertical-align': 'middle'
      },
      'mjx-mlabeledtr[rowalign="bottom"] > mjx-mtd': {
        'vertical-align': 'bottom'
      },
      'mjx-mlabeledtr[rowalign="baseline"] > mjx-mtd': {
        'vertical-align': 'baseline'
      },
      'mjx-mlabeledtr[rowalign="axis"] > mjx-mtd': {
        'vertical-align': '.25em'
      }
    };

    /**
     * @override
     */
    public toCHTML(parent: N) {
      super.toCHTML(parent);
      const child = this.adaptor.firstChild(this.chtml) as N;
      if (child) {
        //
        // Remove label and put it into the labels box inside a row
        //
        this.adaptor.remove(child);
        const align = this.node.attributes.get('rowalign') as string;
        const attr = (align !== 'baseline' && align !== 'axis' ? {rowalign: align} : {});
        const row = this.html('mjx-mtr', attr, [child]);
        this.adaptor.append((this.parent as CHTMLMtableNTD<N, T, D>).labels, row);
      }
    }

    /**
     * @override
     */
    public markUsed() {
      super.markUsed();
      this.jax.wrapperUsage.add(CHTMLMtr.kind);
    }

  };

})<any, any, any>();
