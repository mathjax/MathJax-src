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
 * @file  Implements the SvgMath wrapper for the MmlMath object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMath,
  CommonMathClass,
  CommonMathMixin,
} from '../../common/Wrappers/math.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMath } from '../../../core/MmlTree/MmlNodes/math.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { BBox } from '../../../util/BBox.js';
import { ZeroFontDataUrl } from './zero.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The Svgmath interface for the SVG math wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMathNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMath<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgmathClass interface for the SVG math wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMathClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMathClass<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {
  new (
    factory: SvgWrapperFactory<DOM>,
    node: MmlNode,
    parent?: SvgWrapper<DOM>
  ): SvgMathNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMath wrapper for the MmlMath class
 */
export const SvgMath = (function (): SvgMathClass<DOM> {
  const Base = CommonMathMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMathClass<DOM>
  >(SvgWrapper);

  return class SvgMath extends Base implements SvgMathNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMath.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      //
      //  For inline breakpoints, use a space that is 1em width, make it breakable,
      //    and then set the letter-spacing to make the space the proper size.
      //
      'mjx-container[jax="SVG"] mjx-break': {
        'white-space': 'normal',
        'line-height': '0',
        'clip-path': 'rect(0 0 0 0)',
        'font-family': 'MJX-ZERO ! important',
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
      'mjx-container[jax="SVG"] mjx-break[newline]::before': {
        'white-space': 'pre',
        content: '"\\A"',
      },
      'mjx-break[newline] + svg[width="0.054ex"]': {
        'margin-right': '-1px',
      },
      'mjx-break[prebreak]': {
        'letter-spacing': '-.999em',
      },
      '@font-face /* zero */': {
        'font-family': 'MJX-ZERO',
        src: ZeroFontDataUrl,
      },
    };

    /************************************************************/

    /**
     * Set the justification, and get the minwidth and shift needed
     * for the displayed equation.
     */
    protected handleDisplay() {
      const [align, shift] = this.getAlignShift();
      if (align !== 'center') {
        this.adaptor.setAttribute(this.jax.container, 'justify', align);
      }
      if (this.bbox.pwidth === BBox.fullWidth) {
        this.adaptor.setAttribute(this.jax.container, 'width', 'full');
        if (this.jax.table) {
          let { L, w, R } = this.jax.table.getOuterBBox();
          if (align === 'right') {
            R = Math.max(R || -shift, -shift);
          } else if (align === 'left') {
            L = Math.max(L || shift, shift);
          } else if (align === 'center') {
            w += 2 * Math.abs(shift);
          }
          this.jax.minwidth = Math.max(0, L + w + R);
        }
      } else {
        this.jax.shift = shift;
      }
    }

    /************************************************************/

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
      super.toSVG(parents);
      const adaptor = this.adaptor;
      const display = this.node.attributes.get('display') === 'block';
      if (display) {
        adaptor.setAttribute(this.jax.container, 'display', 'true');
        this.handleDisplay();
      }
    }

    /**
     * @override
     */
    public setChildPWidths(
      recompute: boolean,
      w: number = null,
      _clear: boolean = true
    ) {
      return super.setChildPWidths(
        recompute,
        this.parent ? w : this.metrics.containerWidth / this.jax.pxPerEm,
        false
      );
    }
  };
})();
