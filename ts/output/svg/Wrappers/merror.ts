/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file  Implements the SvgMerror wrapper for the MmlMerror object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMerror } from '../../../core/MmlTree/MmlNodes/merror.js';
import { StyleJson } from '../../../util/StyleJson.js';

/*****************************************************************/
/**
 * The SvgMerror interface for the Svg merror wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMerrorNTD<N, T, D> extends SvgWrapper<N, T, D> {}

/**
 * The SvgMerrorClass interface for the SVG merror wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMerrorClass<N, T, D> extends SvgWrapperClass<N, T, D> {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgMerrorNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMerror wrapper class for the MmlMerror class
 */
export const SvgMerror = (function <N, T, D>(): SvgMerrorClass<N, T, D> {
  return class SvgMerror
    extends SvgWrapper<N, T, D>
    implements SvgMerrorNTD<N, T, D>
  {
    /**
     * @override
     */
    public static kind = MmlMerror.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'g[data-mml-node="merror"] > g': {
        fill: 'red',
        stroke: 'red',
      },
      'g[data-mml-node="merror"] > rect[data-background]': {
        fill: 'yellow',
        stroke: 'none',
      },
    };

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      const svg = this.standardSvgNodes(parents);
      const { h, d, w } = this.getBBox();
      this.adaptor.append(
        this.dom[0],
        this.svg('rect', {
          'data-background': true,
          width: this.fixed(w),
          height: this.fixed(h + d),
          y: this.fixed(-d),
        })
      );
      const title = this.node.attributes.get('title') as string;
      if (title) {
        this.adaptor.append(
          this.dom[0],
          this.svg('title', {}, [this.adaptor.text(title)])
        );
      }
      this.addChildren(svg);
    }
  };
})<any, any, any>();
