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
 * @file  Implements the ChtmlMrow wrapper for the MmlMrow object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMrow,
  CommonMrowClass,
  CommonMrowMixin,
} from '../../common/Wrappers/mrow.js';
import {
  CommonInferredMrow,
  CommonInferredMrowClass,
  CommonInferredMrowMixin,
} from '../../common/Wrappers/mrow.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import {
  MmlMrow,
  MmlInferredMrow,
} from '../../../core/MmlTree/MmlNodes/mrow.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMrow interface for the CHTML Mrow wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMrowNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonMrow<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMrowClass interface for the CHTML Mrow wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMrowClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonMrowClass<
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
  ): ChtmlMrowNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMrow wrapper class for the MmlMrow class
 */
export const ChtmlMrow = (function (): ChtmlMrowClass<DOM> {
  const Base = CommonMrowMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMrowClass<DOM>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMrow extends Base implements ChtmlMrowNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMrow.prototype.kind;

    /**
     * If this is an mrow inside a linebreakContainer, this gives the number
     *   of breaks, otherwise it is 0
     */
    protected linebreakCount: number = 0;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-linestack, mjx-mrow[break-top]': {
        display: 'inline-table',
        width: '100%',
      },
      'mjx-linestack[break-align="bottom"], mjx-mrow[break-top][break-align="bottom"]':
        {
          display: 'inline-block',
        },
      'mjx-linestack[break-align="middle"], mjx-mrow[break-top][break-align="middle"]':
        {
          'vertical-align': 'middle',
        },
      'mjx-linestack[break-align="center"], mjx-mrow[break-top][break-align="center"]':
        {
          'vertical-align': 'middle',
        },
      'mjx-linestack[breakable]': {
        display: 'inline',
      },
      'mjx-linestack[breakable] > mjx-linebox': {
        display: 'inline',
      },
      'mjx-linestack[breakable] > mjx-linebox::before': {
        'white-space': 'pre',
        content: '"\\A"',
      },
      'mjx-linestack[breakable] > mjx-linebox::after': {
        'white-space': 'normal',
        content: '" "',
        'letter-spacing': '-.999em',
        'font-family': 'MJX-BRK',
      },
      'mjx-linestack[breakable] > mjx-linebox:first-of-type::before': {
        display: 'none',
      },
      'mjx-linestack[breakable] > mjx-linebox:last-of-type::after': {
        display: 'none',
      },
      'mjx-linebox': {
        display: 'block',
      },
      'mjx-linebox[align="left"]': {
        'text-align': 'left',
      },
      'mjx-linebox[align="center"]': {
        'text-align': 'center',
      },
      'mjx-linebox[align="right"]': {
        'text-align': 'right',
      },
      'mjx-linestrut': {
        display: 'inline-block',
        height: '1em',
        'vertical-align': '-.25em',
      },
    };

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
      const n = (this.linebreakCount = this.isStack ? 0 : this.breakCount);
      if (n || !this.node.isInferred) {
        parents = this.standardChtmlNodes(parents);
      } else {
        this.dom = parents;
      }
      this.addChildren(parents);
      if (n) {
        this.placeLines(parents, n);
      } else {
        this.handleVerticalAlign(parents[0]);
        this.handleNegativeWidth(parents[0]);
      }
    }

    /**
     * @param {N[]} parents  The HTML nodes in which to place the lines
     * @param {number} n     The number of lines
     */
    protected placeLines(parents: N<DOM>[], n: number) {
      this.getBBox(); // make sure we have linebreak information
      const lines = this.lineBBox;
      const adaptor = this.adaptor;
      const [alignfirst, shiftfirst] = lines[1].indentData?.[0] || [
        'left',
        '0',
      ];
      for (const i of parents.keys()) {
        const bbox = lines[i];
        const [indentalign, indentshift] =
          i === 0
            ? [alignfirst, shiftfirst]
            : bbox.indentData?.[i === n ? 2 : 1] || ['left', '0'];
        const [align, shift] = this.processIndent(
          indentalign,
          indentshift,
          alignfirst,
          shiftfirst
        );
        adaptor.setAttribute(parents[i], 'align', align);
        if (shift) {
          adaptor.setStyle(parents[i], 'margin-left', this.em(shift));
        }
        if (i < n && this.jax.math.display) {
          adaptor.setStyle(
            parents[i],
            'margin-bottom',
            this.em(bbox.lineLeading)
          );
        }
      }
    }

    /**
     * @param {N} dom  The HTML element for the mrow
     */
    protected handleVerticalAlign(dom: N<DOM>) {
      if (this.dh) {
        this.adaptor.setStyle(
          this.adaptor.parent(dom),
          'vertical-align',
          this.em(this.dh)
        );
      }
    }

    /**
     * @param {N} dom  The HTML element for the mrow
     */
    protected handleNegativeWidth(dom: N<DOM>) {
      const { w } = this.getBBox();
      if (w < 0) {
        this.adaptor.setStyle(dom, 'width', this.em(Math.max(0, w)));
        this.adaptor.setStyle(dom, 'marginRight', this.em(w));
      }
    }

    /**
     * @override
     */
    protected createChtmlNodes(parents: N<DOM>[]): N<DOM>[] {
      const n = this.linebreakCount;
      if (!n) return super.createChtmlNodes(parents);
      //
      // Create a linestack/mrow node for the lines
      //
      const adaptor = this.adaptor;
      const kind = this.node.isInferred
        ? 'mjx-linestack'
        : 'mjx-' + this.node.kind;
      this.dom = [adaptor.append(parents[0], this.html(kind)) as N<DOM>];
      if (kind === 'mjx-mrow' && !this.isStack) {
        adaptor.setAttribute(this.dom[0], 'break-top', 'true');
      }
      if (this.node.getProperty('process-breaks')) {
        adaptor.setAttribute(this.dom[0], 'breakable', 'true');
      }
      if (this.node.isInferred || !this.isStack) {
        const valign = this.parent.node.attributes.get(
          'data-vertical-align'
        ) as string;
        if (valign === 'middle' || valign === 'center' || valign === 'bottom') {
          adaptor.setAttribute(this.dom[0], 'break-align', valign);
        }
      }
      //
      // Add an href anchor, if needed, and insert the linestack/mrow
      //
      this.dom = [
        adaptor.append(this.handleHref(parents)[0], this.dom[0]) as N<DOM>,
      ];
      //
      //  Add the line boxes
      //
      const chtml = Array(n) as N<DOM>[];
      for (let i = 0; i <= n; i++) {
        chtml[i] = adaptor.append(
          this.dom[0],
          this.html('mjx-linebox', { lineno: i })
        ) as N<DOM>;
      }
      //
      //  Return the line boxes as the parent nodes for their contents
      //
      return chtml;
    }

    /**
     * @override
     */
    public addChildren(parents: N<DOM>[]) {
      let i = 0;
      for (const child of this.childNodes) {
        const n = child.breakCount;
        child.toCHTML(parents.slice(i, i + n + 1));
        i += n;
      }
    }
  };
})();

/*****************************************************************/
/*****************************************************************/

/**
 * The ChtmlInferredMrow interface for the CHTML InferredMrow wrapper
 *
 * @template DOM   THe DOM node types
 */
export interface ChtmlInferredMrowNTD<DOM extends DOM_TYPES>
  extends
    ChtmlMrowNTD<DOM>,
    CommonInferredMrow<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlInferredMrowClass interface for the CHTML InferredMrow wrapper
 *
 * @template DOM   THe DOM node types
 */
export interface ChtmlInferredMrowClass<DOM extends DOM_TYPES>
  extends
    ChtmlMrowClass<DOM>,
    CommonInferredMrowClass<
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
  ): ChtmlInferredMrowNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlInferredMrow wrapper class for the MmlInferredMrow class
 */
export const ChtmlInferredMrow = (function (): ChtmlInferredMrowClass<DOM> {
  const Base = CommonInferredMrowMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlInferredMrowClass<DOM>
  >(ChtmlMrow);

  return class ChtmlInferredMrow
    // @ts-expect-error Avoid message about base constructors not having the same type
    extends Base
    implements ChtmlInferredMrowNTD<DOM>
  {
    /**
     * @override
     */
    public static kind = MmlInferredMrow.prototype.kind;
  };
})();
