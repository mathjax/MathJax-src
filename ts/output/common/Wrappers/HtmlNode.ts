/*************************************************************
 *
 *  Copyright (c) 2022 The MathJax Consortium
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
 * @fileoverview  Implements the CommonHtmlNode wrapper mixin for the HtmlNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {HtmlNode} from '../../../core/MmlTree/MmlNodes/HtmlNode.js';
import {BBox} from '../../../util/BBox.js';
import {StyleList} from '../../../util/Styles.js';
import {ExtendedMetrics} from '../../common/OutputJax.js';

/*****************************************************************/
/**
 * The CommonHtmlNode interface
 */
export interface CommonHtmlNode<N> extends AnyWrapper {

  /**
   * @return {N}   The HTML for the node
   */
  getHTML(): N;
}

/**
 * Shorthand for the CommonHtmlNode constructor
 */
export type HtmlNodeConstructor<N> = Constructor<CommonHtmlNode<N>>;


/*****************************************************************/
/**
 *  The CommonHtmlNode wrapper mixin for the HtmlNode object
 *
 * @template N  The HTMLElement class
 * @template T  The Wrapper class constructor type
 */
export function CommonHtmlNodeMixin<N, T extends WrapperConstructor>(Base: T): HtmlNodeConstructor<N> & T {

  return class extends Base {

    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      const {w, h, d} = this.jax.measureXMLnode(this.getHTML());
      bbox.w = w;
      bbox.h = h;
      bbox.d = d;
    }

    /**
     * @return {N}   The HTML for the node
     */
    public getHTML(): N {
      const styles: StyleList = {};
      const html = this.adaptor.clone((this.node as HtmlNode<N>).getHTML() as N);
      const metrics = this.jax.math.metrics as ExtendedMetrics;
      const scale = 100 / metrics.scale;
      if (scale !== 100) {
        styles['font-size'] = this.jax.fixed(scale, 1) + '%';
      }
      const parent = this.adaptor.parent(this.jax.math.start.node);
      styles['font-family'] = this.parent.styles?.styles?.['font-family'] ||
        metrics.family || this.adaptor.fontFamily(parent) || 'initial';
      return this.html('mjx-html', {variant: this.parent.variant, style: styles}, [html]);
    }

    /**
     * @override
     */
    protected getStyles() {}

    /**
     * @override
     */
    protected getScale() {}

    /**
     * @override
     */
    protected getVariant() {}

  };
}
