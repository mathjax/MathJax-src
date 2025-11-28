/*************************************************************
 *
 *  Copyright (c) 2023-2025 The MathJax Consortium
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
 * @file  Implements the CommonXmlNode wrapper mixin for the XmlNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  CommonWrapper,
  CommonWrapperClass,
  CommonWrapperConstructor,
} from '../Wrapper.js';
import { CommonWrapperFactory } from '../WrapperFactory.js';
import {
  CharOptions,
  VariantData,
  DelimiterData,
  FontData,
  FontDataClass,
} from '../FontData.js';
import { CommonOutputJax, ExtendedMetrics, UnknownBBox } from '../../common.js';
import { MmlNode, XMLNode } from '../../../core/MmlTree/MmlNode.js';
import { BBox } from '../../../util/BBox.js';
import { StyleList } from '../../../util/Styles.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { split } from '../../../util/string.js';

/*****************************************************************/
/**
 * The CommonXmlNode interface
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
export interface CommonXmlNode<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
> extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {
  /**
   * The relative scaling from the root to this node
   */
  rscale: number;

  /**
   * @returns {N}  The HTML for the node
   */
  getHTML(): N;

  /**
   * @param {N} html            The html to adjust if using or forcing HDW
   * @param {StyleList} styles  The styles object to add to, as needed
   */
  addHDW(html: N, styles: StyleList): N;

  /**
   * @param {N} xml          The XML tree to check
   * @param {string} use     The first xmlHDW value to check
   * @param {string} force   The second (optional) xmlHDW value to check
   * @returns {string}       The data-mjx-hdw value, if the options are met
   */
  getHDW(xml: N, use: string, force?: string): string;

  /**
   * @param {string} hdw     The data-mjx-hdw string to split
   * @returns {UnknownBBox}  The h, d, w values (in em units) as an object
   */
  splitHDW(hdw: string): UnknownBBox;
}

/**
 * The CommonXmlNodeClass interface
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
export interface CommonXmlNodeClass<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
> extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC> {}

/*****************************************************************/
/**
 * The CommonXmlNode wrapper mixin for the XmlNode object
 *
 * @param {CommonWrapperConstructor} Base The constructor class to extend
 * @returns {B} The mixin constructor
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
export function CommonXmlNodeMixin<
  N,
  T,
  D,
  JX extends CommonOutputJax<N, T, D, WW, WF, WC, CC, VV, DD, FD, FC>,
  WW extends CommonWrapper<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WF extends CommonWrapperFactory<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  WC extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
  CC extends CharOptions,
  VV extends VariantData<CC>,
  DD extends DelimiterData,
  FD extends FontData<CC, VV, DD>,
  FC extends FontDataClass<CC, VV, DD>,
  B extends CommonWrapperClass<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>,
>(
  Base: CommonWrapperConstructor<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
): B {
  abstract class CommonXmlNodeMixin
    extends Base
    implements CommonXmlNode<N, T, D, JX, WW, WF, WC, CC, VV, DD, FD, FC>
  {
    /**
     * Don't set up inline-block styles for this
     */
    public static autoStyle = false;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-measure-xml': {
        position: 'absolute',
        left: 0,
        top: 0,
        display: 'inline-block',
        'line-height': 'normal',
        'white-space': 'normal',
      },
      'mjx-html': {
        display: 'inline-block',
        'line-height': 'normal',
        'text-align': 'initial',
        'white-space': 'initial',
      },
      'mjx-html-holder': {
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
    };

    /**
     * @override
     */
    public rscale: number;

    /**
     * @override
     */
    public constructor(factory: WF, node: MmlNode, parent: WW = null) {
      super(factory, node, parent);
      this.rscale = this.getRScale();
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      const xml = (this.node as XMLNode).getXML() as N;
      const hdw = this.getHDW(xml, 'use', 'force');
      const { h, d, w } = hdw ? this.splitHDW(hdw) : this.measureXmlNode(xml);
      bbox.w = w;
      bbox.h = h;
      bbox.d = d;
    }

    /**
     * @override
     */
    public getHTML(): N {
      const adaptor = this.adaptor;
      let html = adaptor.clone((this.node as XMLNode).getXML() as N);
      const styles = this.getFontStyles();
      const hdw = this.getHDW(html, 'force');
      if (hdw || this.jax.options.scale !== 1) {
        html = this.addHDW(html, styles);
      }
      return this.html(
        'mjx-html',
        { variant: this.parent.variant, style: styles },
        [html]
      );
    }

    /**
     * @override
     */
    abstract addHDW(html: N, _styles: StyleList): N;

    /**
     * @override
     */
    public getHDW(xml: N, use: string, force: string = use): string {
      const option = this.jax.options.htmlHDW;
      const hdw = this.adaptor.getAttribute(xml, 'data-mjx-hdw') as string;
      return hdw && (option === use || option === force) ? hdw : null;
    }

    /**
     * @override
     */
    public splitHDW(hdw: string): UnknownBBox {
      const scale = 1 / this.metrics.scale;
      const [h, d, w] = split(hdw).map((x) => this.length2em(x || '0') * scale);
      return { h, d, w };
    }

    /**
     * The font-size and font-family values to use for the XML
     *
     * @returns {StyleJson} The font info
     */
    public getFontStyles(): { 'font-family': string; 'font-size': string } {
      const adaptor = this.adaptor;
      const metrics = this.metrics as ExtendedMetrics;
      return {
        'font-family':
          this.parent.styles?.get('font-family') ||
          metrics.family ||
          adaptor.fontFamily(adaptor.parent(this.jax.math.start.node)) ||
          'initial',
        'font-size': this.jax.fixed(metrics.em * this.rscale) + 'px',
      };
    }

    /**
     * Measure the width, height and depth of an annotation-xml node's content
     *
     * @param {N} xml          The xml content node to be measured
     * @returns {UnknownBBox}  The width, height, and depth of the content
     */
    public measureXmlNode(xml: N): UnknownBBox {
      const adaptor = this.adaptor;
      const content = this.html(
        'mjx-xml-block',
        { style: { display: 'inline-block' } },
        [adaptor.clone(xml)]
      );
      const base = this.html('mjx-baseline', {
        style: { display: 'inline-block', width: 0, height: 0 },
      });
      const style = this.getFontStyles();
      const node = this.html('mjx-measure-xml', { style }, [base, content]);
      const container = this.jax.container;
      adaptor.append(adaptor.parent(this.jax.math.start.node), container);
      adaptor.append(container, node);
      const metrics = this.metrics;
      const em = metrics.em * metrics.scale * this.rscale;
      const { left, right, bottom, top } = adaptor.nodeBBox(content);
      const w = (right - left) / em;
      const h = (adaptor.nodeBBox(base).top - top) / em;
      const d = (bottom - top) / em - h;
      adaptor.remove(container);
      adaptor.remove(node);
      return { w, h, d };
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
  }

  return CommonXmlNodeMixin as any as B;
}
