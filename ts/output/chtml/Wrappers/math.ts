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
 * @file  Implements the ChtmlMath wrapper for the MmlMath object
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
  CommonMath,
  CommonMathClass,
  CommonMathMixin,
} from '../../common/Wrappers/math.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMath } from '../../../core/MmlTree/MmlNodes/math.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { BBox } from '../../../util/BBox.js';

/*****************************************************************/
/**
 * The ChtmlMath interface for the CHTML Math wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMathNTD<N, T, D>
  extends
    ChtmlWrapper<N, T, D>,
    CommonMath<
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
 * The ChtmlMathClass interface for the CHTML Math wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMathClass<N, T, D>
  extends
    ChtmlWrapperClass<N, T, D>,
    CommonMathClass<
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
  ): ChtmlMathNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMath wrapper class for the MmlMath class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export const ChtmlMath = (function <N, T, D>(): ChtmlMathClass<N, T, D> {
  const Base = CommonMathMixin<
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
    ChtmlMathClass<N, T, D>
  >(ChtmlWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be ChtmlWrapper<N, T, D>, but are thought of as different by typescript)
  return class ChtmlMath extends Base implements ChtmlMathNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMath.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-math': {
        'line-height': 0,
        'text-align': 'left',
        'text-indent': 0,
        'font-style': 'normal',
        'font-weight': 'normal',
        'font-size': '100%',
        'font-size-adjust': 'none',
        'letter-spacing': 'normal',
        'word-wrap': 'normal',
        'word-spacing': 'normal',
        direction: 'ltr',
        padding: '1px 0',
      },
      'mjx-container[jax="CHTML"][display="true"] mjx-math': {
        padding: 0,
      },
      'mjx-math[breakable]': {
        display: 'inline',
      },
      //
      //  For inline breakpoints, use a space that is 1em width, make it breakable,
      //    and then set the letter-spacing to make the space the proper size.
      //
      'mjx-container[jax="CHTML"] mjx-break': {
        'white-space': 'normal',
        'line-height': '0',
        'clip-path': 'rect(0 0 0 0)',
        'font-family': 'MJX-BRK !important',
      },
      'mjx-break[size="0"]': {
        'letter-spacing': 0.001 - 1 + 'em',
      },
      'mjx-break[size="1"]': {
        'letter-spacing': 0.111 - 1 + 'em',
      },
      'mjx-break[size="2"]': {
        'letter-spacing': 0.167 - 1 + 'em',
      },
      'mjx-break[size="3"]': {
        'letter-spacing': 0.222 - 1 + 'em',
      },
      'mjx-break[size="4"]': {
        'letter-spacing': 0.278 - 1 + 'em',
      },
      'mjx-break[size="5"]': {
        'letter-spacing': 0.333 - 1 + 'em',
      },
    };

    /**
     *  Handle displayed equations (set min-width, and so on).
     *
     * @param {N} parent     The HTML node to contain the HTML
     */
    protected handleDisplay(parent: N) {
      const adaptor = this.adaptor;
      const [align, shift] = this.getAlignShift();
      if (align !== 'center') {
        adaptor.setAttribute(parent, 'justify', align);
      }
      if (this.bbox.pwidth === BBox.fullWidth) {
        adaptor.setAttribute(parent, 'width', 'full');
        if (this.jax.table) {
          let { L, w, R } = this.jax.table.getOuterBBox();
          if (align === 'right') {
            R = Math.max(R || -shift, -shift);
          } else if (align === 'left') {
            L = Math.max(L || shift, shift);
          } else if (align === 'center') {
            w += 2 * Math.abs(shift);
          }
          const W = this.em(Math.max(0, L + w + R));
          adaptor.setStyle(parent, 'min-width', W);
          adaptor.setStyle(this.jax.table.dom[0], 'min-width', W);
        }
      } else {
        this.setIndent(this.dom[0], align, shift);
      }
    }

    /**
     * Handle in-line expressions
     *
     * @param {N} parent     The HTML node to contain the HTML
     */
    protected handleInline(parent: N) {
      //
      // Transfer right margin to container (for things like $x\hskip -2em y$)
      //
      const adaptor = this.adaptor;
      const margin = adaptor.getStyle(this.dom[0], 'margin-right');
      if (margin) {
        adaptor.setStyle(this.dom[0], 'margin-right', '');
        adaptor.setStyle(parent, 'margin-right', margin);
        adaptor.setStyle(parent, 'width', '0');
      }
    }

    /***********************************************************/

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      super.toCHTML(parents);
      const adaptor = this.adaptor;
      const display = this.node.attributes.get('display') === 'block';
      if (display) {
        adaptor.setAttribute(this.dom[0], 'display', 'true');
        adaptor.setAttribute(parents[0], 'display', 'true');
        this.handleDisplay(parents[0]);
      } else {
        this.handleInline(parents[0]);
      }
      adaptor.addClass(this.dom[0], `${this.font.cssFontPrefix}-N`);
    }

    /**
     * @override
     */
    public setChildPWidths(
      recompute: boolean,
      w: number = null,
      clear: boolean = true
    ) {
      return this.parent ? super.setChildPWidths(recompute, w, clear) : false;
    }

    /**
     * @override
     */
    protected handleAttributes() {
      super.handleAttributes();
      const adaptor = this.adaptor;
      if (this.node.getProperty('process-breaks')) {
        this.dom.forEach((dom) =>
          adaptor.setAttribute(dom, 'breakable', 'true')
        );
      }
    }
  };
})<any, any, any>();
