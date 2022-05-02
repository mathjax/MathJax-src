/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Implements the CHTMLmmultiscripts wrapper for the MmlMmultiscripts object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonMmultiscripts, CommonMmultiscriptsClass,
        CommonMmultiscriptsMixin} from '../../common/Wrappers/mmultiscripts.js';
import {CHTMLMsubsup, CHTMLMsubsupClass, CHTMLMsubsupNTD} from './msubsup.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMmultiscripts} from '../../../core/MmlTree/MmlNodes/mmultiscripts.js';
import {BBox} from '../../../util/BBox.js';
import {StyleList} from '../../../util/StyleList.js';
import {split} from '../../../util/string.js';

/*****************************************************************/
/**
 * The CHTMLMmultiscripts interface for the CHTML Mmultiscripts wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMmultiscriptsNTD<N, T, D> extends CHTMLMsubsupNTD<N, T, D>, CommonMmultiscripts<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMmultiscriptsClass interface for the CHTML Mmultiscripts wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMmultiscriptsClass<N, T, D> extends CHTMLMsubsupClass<N, T, D>, CommonMmultiscriptsClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMmultiscriptsNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMmultiscripts wrapper class for the MmlMmultiscripts class
 */
export const CHTMLMmultiscripts = (function <N, T, D>(): CHTMLMmultiscriptsClass<N, T, D> {

  const Base = CommonMmultiscriptsMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMmultiscriptsClass<N, T, D>
    >(CHTMLMsubsup);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMmultiscripts extends Base implements CHTMLMmultiscriptsNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMmultiscripts.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-prescripts': {
        display: 'inline-table',
        'padding-left': '.05em'   // scriptspace
      },
      'mjx-scripts': {
        display: 'inline-table',
        'padding-right': '.05em'   // scriptspace
      },
      'mjx-prescripts > mjx-row > mjx-cell': {
        'text-align': 'right'
      },
      '[script-align="left"] > mjx-row > mjx-cell': {
        'text-align': 'left'
      },
      '[script-align="center"] > mjx-row > mjx-cell': {
        'text-align': 'center'
      },
      '[script-align="right"] > mjx-row > mjx-cell': {
        'text-align': 'right'
      }
    };

    /*************************************************************/

    /**
     * @override
     */
    public toCHTML(parent: N) {
      const chtml = this.standardCHTMLnode(parent);
      const data = this.scriptData;
      //
      //  Get the alignment for the scripts
      //
      const scriptalign = this.node.getProperty('scriptalign') || 'right left';
      const [preAlign, postAlign] = split(scriptalign + ' ' + scriptalign);
      //
      //  Combine the bounding boxes of the pre- and post-scripts,
      //  and get the resulting baseline offsets
      //
      const sub = this.combinePrePost(data.sub, data.psub);
      const sup = this.combinePrePost(data.sup, data.psup);
      const [u, v] = this.getUVQ(sub, sup);
      //
      //  Place the pre-scripts, then the base, then the post-scripts
      //
      if (data.numPrescripts) {
        const scripts = this.addScripts(u, -v, true, data.psub, data.psup, this.firstPrescript, data.numPrescripts);
        preAlign !== 'right' && this.adaptor.setAttribute(scripts, 'script-align', preAlign);
      }
      this.childNodes[0].toCHTML(chtml);
      if (data.numScripts) {
        const scripts = this.addScripts(u, -v, false, data.sub, data.sup, 1, data.numScripts);
        postAlign !== 'left' && this.adaptor.setAttribute(scripts, 'script-align', postAlign);
      }
    }

    /**
     * Create a table with the super and subscripts properly separated and aligned.
     *
     * @param {number} u       The baseline offset for the superscripts
     * @param {number} v       The baseline offset for the subscripts
     * @param {boolean} isPre  True for prescripts, false for scripts
     * @param {BBox} sub       The subscript bounding box
     * @param {BBox} sup       The superscript bounding box
     * @param {number} i       The starting index for the scripts
     * @param {number} n       The number of sub/super-scripts
     * @return {N}             The script table for these scripts
     */
    protected addScripts(u: number, v: number, isPre: boolean, sub: BBox, sup: BBox, i: number, n: number): N {
      const adaptor = this.adaptor;
      const q = (u - sup.d) + (v - sub.h);             // separation of scripts
      const U = (u < 0 && v === 0 ? sub.h + u : u);    // vertical offset of table
      const rowdef = (q > 0 ? {style: {height: this.em(q)}} : {});
      const tabledef = (U ? {style: {'vertical-align': this.em(U)}} : {});
      const supRow = this.html('mjx-row');
      const sepRow = this.html('mjx-row', rowdef);
      const subRow = this.html('mjx-row');
      const name = 'mjx-' + (isPre ? 'pre' : '') + 'scripts';
      let m = i + 2 * n;
      while (i < m) {
        this.childNodes[i++].toCHTML(adaptor.append(subRow, this.html('mjx-cell')) as N);
        this.childNodes[i++].toCHTML(adaptor.append(supRow, this.html('mjx-cell')) as N);
      }
      return adaptor.append(this.dom, this.html(name, tabledef, [supRow, sepRow, subRow])) as N;
    }

  };

})<any, any, any>();
