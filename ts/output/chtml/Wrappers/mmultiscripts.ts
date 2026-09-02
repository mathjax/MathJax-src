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
 * @file  Implements the ChtmlMmultiscripts wrapper for the MmlMmultiscripts object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMmultiscripts,
  CommonMmultiscriptsClass,
  CommonMmultiscriptsMixin,
} from '../../common/Wrappers/mmultiscripts.js';
import { ChtmlMsubsup, ChtmlMsubsupClass, ChtmlMsubsupNTD } from './msubsup.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMmultiscripts } from '../../../core/MmlTree/MmlNodes/mmultiscripts.js';
import { BBox } from '../../../util/BBox.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { split } from '../../../util/string.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMmultiscripts interface for the CHTML Mmultiscripts wrapper
 *
 * @template DOM   The DOM types
 */
export interface ChtmlMmultiscriptsNTD<DOM extends DOM_TYPES>
  extends
    ChtmlMsubsupNTD<DOM>,
    CommonMmultiscripts<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMmultiscriptsClass interface for the CHTML Mmultiscripts wrapper
 *
 * @template DOM   The DOM types
 */
export interface ChtmlMmultiscriptsClass<DOM extends DOM_TYPES>
  extends
    ChtmlMsubsupClass<DOM>,
    CommonMmultiscriptsClass<
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
  ): ChtmlMmultiscriptsNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMmultiscripts wrapper class for the MmlMmultiscripts class
 */
export const ChtmlMmultiscripts = (function (): ChtmlMmultiscriptsClass<DOM> {
  const Base = CommonMmultiscriptsMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMmultiscriptsClass<DOM>
  >(ChtmlMsubsup);

  return class ChtmlMmultiscripts
    // @ts-expect-error Avoid message about base constructors not having the same type
    extends Base
    implements ChtmlMmultiscriptsNTD<DOM>
  {
    /**
     * @override
     */
    public static kind = MmlMmultiscripts.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-prescripts': {
        display: 'inline-table',
        'padding-left': '.05em', // scriptspace
      },
      'mjx-scripts': {
        display: 'inline-table',
        'padding-right': '.05em', // scriptspace
      },
      'mjx-prescripts > mjx-row > mjx-cell': {
        'text-align': 'right',
      },
      '[script-align="left"] > mjx-row > mjx-cell': {
        'text-align': 'left',
      },
      '[script-align="center"] > mjx-row > mjx-cell': {
        'text-align': 'center',
      },
      '[script-align="right"] > mjx-row > mjx-cell': {
        'text-align': 'right',
      },
      //
      // This declaration avoids a Safari positioning bug:
      //
      'mjx-none': {
        display: 'inline-block',
        height: '1px',
      },
    };

    /*************************************************************/

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      const chtml = this.standardChtmlNodes(parents);
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
      const [u, v] = this.getCombinedUV();
      //
      //  Place the pre-scripts, then the base, then the post-scripts
      //
      if (data.numPrescripts) {
        const scripts = this.addScripts(
          this.dom[0],
          u,
          -v,
          true,
          data.psub,
          data.psup,
          this.firstPrescript,
          data.numPrescripts
        );
        if (preAlign !== 'right') {
          this.adaptor.setAttribute(scripts, 'script-align', preAlign);
        }
      }
      this.childNodes[0].toCHTML(chtml);
      if (data.numScripts) {
        const scripts = this.addScripts(
          this.dom[this.dom.length - 1],
          u,
          -v,
          false,
          data.sub,
          data.sup,
          1,
          data.numScripts
        );
        if (postAlign !== 'left') {
          this.adaptor.setAttribute(scripts, 'script-align', postAlign);
        }
      }
    }

    /**
     * Create a table with the super and subscripts properly separated and aligned.
     *
     * @param {N} dom          The HTML node in which the scripts are to be placed
     * @param {number} u       The baseline offset for the superscripts
     * @param {number} v       The baseline offset for the subscripts
     * @param {boolean} isPre  True for prescripts, false for scripts
     * @param {BBox} sub       The subscript bounding box
     * @param {BBox} sup       The superscript bounding box
     * @param {number} i       The starting index for the scripts
     * @param {number} n       The number of sub/super-scripts
     * @returns {N}             The script table for these scripts
     */
    protected addScripts(
      dom: N<DOM>,
      u: number,
      v: number,
      isPre: boolean,
      sub: BBox,
      sup: BBox,
      i: number,
      n: number
    ): N<DOM> {
      const adaptor = this.adaptor;
      const q = u - sup.d + (v - sub.h); // separation of scripts
      const U = u < 0 && v === 0 ? sub.h + u : u; // vertical offset of table
      const rowdef = q > 0 ? { style: { height: this.em(q) } } : {};
      const tabledef = U ? { style: { 'vertical-align': this.em(U) } } : {};
      const supRow = this.html('mjx-row');
      const sepRow = this.html('mjx-row', rowdef);
      const subRow = this.html('mjx-row');
      const name = 'mjx-' + (isPre ? 'pre' : '') + 'scripts';
      const m = i + 2 * n;
      while (i < m) {
        this.childNodes[i++].toCHTML([
          adaptor.append(subRow, this.html('mjx-cell')) as N<DOM>,
        ]);
        this.childNodes[i++].toCHTML([
          adaptor.append(supRow, this.html('mjx-cell')) as N<DOM>,
        ]);
      }
      return adaptor.append(
        dom,
        this.html(name, tabledef, [supRow, sepRow, subRow])
      ) as N<DOM>;
    }
  };
})();
