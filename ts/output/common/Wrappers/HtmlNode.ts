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

import {CommonWrapper, CommonWrapperClass, CommonWrapperConstructor} from '../Wrapper.js';
import {CommonWrapperFactory} from '../WrapperFactory.js';
import {CharOptions, VariantData, DelimiterData, FontData, FontDataClass} from '../FontData.js';
import {CommonOutputJax} from '../../common.js';
import {HtmlNode} from '../../../core/MmlTree/MmlNodes/HtmlNode.js';
import {BBox} from '../../../util/BBox.js';
import {StyleList} from '../../../util/Styles.js';
import {ExtendedMetrics, UnknownBBox} from '../../common.js';
import {split} from '../../../util/string.js';

/*****************************************************************/
/**
 * The CommonHtmlNode interface
 *
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 */
export interface CommonHtmlNode<
  N, T, D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>
> extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {

  /**
   * @return {N}   The HTML for the node
   */
  getHTML(): N;

  /**
   * @param {N} html            The html to adjust if using or forcing HDW
   * @param {StyleList} styles  The styles object to add to, as needed
   */
  addHDW(html: N, styles: StyleList): N;

  /**
   * @param {N} html         The HTML tree to check
   * @param {string} use     The first htmlHDW value to check
   * @param {string} force   The second (optional) htmlHDW value to check
   * @return {string}        The data-mjx-hdw value, if the options are met
   */
  getHDW(html: N, use: string, force?: string): string;

  /**
   * @param {string} hdw     The data-mjx-hdw string to split
   * @return {UnknownBBox}   The h, d, w values (in em units) as an object
   */
  splitHDW(hdw: string): UnknownBBox;

}

/**
 * The CommonHtmlNodeClass interface
 *
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 */
export interface CommonHtmlNodeClass<
  N, T, D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>
> extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonHtmlNode wrapper mixin for the HtmlNode object
 *
 * @template N   The DOM node type
 * @template T   The DOM text node type
 * @template D   The DOM document type
 * @template JX  The OutputJax type
 * @template WW  The Wrapper type
 * @template WF  The WrapperFactory type
 * @template WC  The WrapperClass type
 * @template CC  The CharOptions type
 * @template VV  The VariantData type
 * @template DD  The DelimiterData type
 * @template FD  The FontData type
 * @template FC  The FontDataClass type
 *
 * @template B   The Mixin interface to create
 */
export function CommonHtmlNodeMixin<
  N, T, D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
  B extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
>(Base: CommonWrapperConstructor<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>): B {

  return class CommonHtmlNodeMixin extends Base
  implements CommonHtmlNode<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {

    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      const hdw = this.getHDW((this.node as HtmlNode<N>).getHTML() as N, 'use', 'force');
      const {h, d, w} = (hdw ? this.splitHDW(hdw) : this.jax.measureXMLnode(this.getHTML()));
      bbox.w = w;
      bbox.h = h;
      bbox.d = d;
    }

    /**
     * @return {N}   The HTML for the node
     */
    public getHTML(): N {
      const adaptor = this.adaptor;
      const jax = this.jax;
      const styles: StyleList = {};
      const html = this.addHDW(adaptor.clone((this.node as HtmlNode<N>).getHTML() as N), styles);
      const metrics = jax.math.metrics as ExtendedMetrics;
      if (metrics.scale !== 1) {
        styles['font-size'] = jax.fixed(100 / metrics.scale, 1) + '%';
      }
      const parent = adaptor.parent(jax.math.start.node);
      styles['font-family'] = this.parent.styles?.get('font-family') ||
        metrics.family || adaptor.fontFamily(parent) || 'initial';
      return this.html('mjx-html', {variant: this.parent.variant, style: styles}, [html]);
    }

    /**
     * @param {N} html            The html to adjust if using or forcing HDW
     * @param {StyleList} styles  The styles object to add to, as needed
     */
    public addHDW(html: N, styles: StyleList): N {
      const hdw = this.getHDW(html, 'force');
      if (!hdw) return html;
      const {h, d, w} = this.splitHDW(hdw);
      styles.height = this.em(h + d);
      styles.width = this.em(w);
      styles['vertical-align'] = this.em(-d);
      styles.position = 'relative';
      return this.html('mjx-html-holder', {}, [html]);
    }

    /**
     * @param {N} html         The HTML tree to check
     * @param {string} use     The first htmlHDW value to check
     * @param {string} force   The second (optional) htmlHDW value to check
     * @return {string}        The data-mjx-hdw value, if the options are met
     */
    public getHDW(html: N, use: string, force: string = use): string {
      const option = this.jax.options.htmlHDW;
      const hdw = this.adaptor.getAttribute(html, 'data-mjx-hdw') as string;
      return (hdw && (option === use || option === force) ? hdw : null);
    }

    /**
     * @param {string} hdw     The data-mjx-hdw string to split
     * @return {UnknownBBox}   The h, d, w values (in em units) as an object
     */
    public splitHDW(hdw: string): UnknownBBox {
      const [h, d, w] = split(hdw).map(x => this.length2em(x || '0'));
      return {h, d, w};
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

  } as any as B;

}
