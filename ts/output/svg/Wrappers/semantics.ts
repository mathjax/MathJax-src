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
 * @file  Implements the SvgSemantics wrapper for the MmlSemantics object
 *                and the associated wrappers for annotations
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  SvgCharOptions,
  SvgVariantData,
  SvgDelimiterData,
  SvgFontData,
  SvgFontDataClass,
} from '../FontData.js';
import {
  CommonSemantics,
  CommonSemanticsClass,
  CommonSemanticsMixin,
} from '../../common/Wrappers/semantics.js';
import {
  CommonXmlNode,
  CommonXmlNodeClass,
  CommonXmlNodeMixin,
} from '../../common/Wrappers/XmlNode.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import {
  MmlSemantics,
  MmlAnnotation,
  MmlAnnotationXML,
} from '../../../core/MmlTree/MmlNodes/semantics.js';
import { XMLNode } from '../../../core/MmlTree/MmlNode.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { StyleList } from '../../../util/Styles.js';

/*****************************************************************/
/**
 * The SvgSemantics interface for the SVG Semantics wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgSemanticsNTD<N, T, D>
  extends SvgWrapper<N, T, D>,
    CommonSemantics<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {}

/**
 * The SvgSemanticsClass interface for the SVG Semantics wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgSemanticsClass<N, T, D>
  extends SvgWrapperClass<N, T, D>,
    CommonSemanticsClass<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgSemanticsNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgSemantics wrapper class for the MmlSemantics class
 */
export const SvgSemantics = (function <N, T, D>(): SvgSemanticsClass<N, T, D> {
  const Base = CommonSemanticsMixin<
    N,
    T,
    D,
    SVG<N, T, D>,
    SvgWrapper<N, T, D>,
    SvgWrapperFactory<N, T, D>,
    SvgWrapperClass<N, T, D>,
    SvgCharOptions,
    SvgVariantData,
    SvgDelimiterData,
    SvgFontData,
    SvgFontDataClass,
    SvgSemanticsClass<N, T, D>
  >(SvgWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SvgWrapper<N, T, D>, but are thought of as different by typescript)
  return class SvgSemantics extends Base implements SvgSemanticsNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlSemantics.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      if (this.toEmbellishedSVG(parents)) return;
      const svg = this.standardSvgNodes(parents);
      if (this.childNodes.length) {
        this.childNodes[0].toSVG(svg);
      }
    }
  };
})<any, any, any>();

/*****************************************************************/
/**
 * The SvgAnnotation wrapper for the MmlAnnotation object
 */
export const SvgAnnotation = (function <N, T, D>(): SvgWrapperClass<N, T, D> {
  return class SvgAnnotation extends SvgWrapper<N, T, D> {
    /**
     * The annotation wrapper
     */
    public static kind = MmlAnnotation.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      // FIXME:  output as plain text
      super.toSVG(parents);
    }

    /**
     * @override
     */
    public computeBBox() {
      // FIXME:  compute using the DOM, if possible
      return this.bbox;
    }
  };
})<any, any, any>();

/*****************************************************************/
/**
 * The SvgAnnotationXML wrapper for the MmlAnnotationXML object
 */
export const SvgAnnotationXML = (function <N, T, D>(): SvgWrapperClass<
  N,
  T,
  D
> {
  return class SvgAnnotationXML extends SvgWrapper<N, T, D> {
    /**
     * The annotation-xml wrapper
     */
    public static kind = MmlAnnotationXML.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'foreignObject[data-mjx-xml]': {
        'font-family': 'initial',
        'line-height': 'normal',
        overflow: 'visible',
      },
    };
  };
})<any, any, any>();

/*****************************************************************/
/**
 * The SvgXmlNode interface for the SVG XmlNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgXmlNodeNTD<N, T, D>
  extends SvgWrapper<N, T, D>,
    CommonXmlNode<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {}

/**
 * The SvgXmlNodeClass interface for the SVG XmlNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgXmlNodeClass<N, T, D>
  extends SvgWrapperClass<N, T, D>,
    CommonXmlNodeClass<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgXmlNodeNTD<N, T, D>;
}

/**
 * The SvgXmlNode wrapper for the XMLNode object
 */

export const SvgXmlNode = (function <N, T, D>(): SvgXmlNodeClass<N, T, D> {
  const Base = CommonXmlNodeMixin<
    N,
    T,
    D,
    SVG<N, T, D>,
    SvgWrapper<N, T, D>,
    SvgWrapperFactory<N, T, D>,
    SvgWrapperClass<N, T, D>,
    SvgCharOptions,
    SvgVariantData,
    SvgDelimiterData,
    SvgFontData,
    SvgFontDataClass,
    SvgXmlNodeClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgXmlNode extends Base implements SvgXmlNodeNTD<N, T, D> {
    /**
     * The XMLNode wrapper
     */
    public static kind = XMLNode.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'foreignObject[data-mjx-html]': {
        overflow: 'visible',
      },
      ...Base.styles,
    };

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      const metrics = this.jax.math.metrics;
      const em = metrics.em * metrics.scale * this.rscale;
      const scale = this.fixed(1 / em, 3);
      const { w, h, d } = this.getBBox();
      this.dom = [
        this.adaptor.append(
          parents[0],
          this.svg(
            'foreignObject',
            {
              'data-mjx-xml': true,
              y: this.jax.fixed(-h * em) + 'px',
              width: this.jax.fixed(w * em) + 'px',
              height: this.jax.fixed((h + d) * em) + 'px',
              transform: `scale(${scale}) matrix(1 0 0 -1 0 0)`,
            },
            [this.getHTML()]
          )
        ) as N,
      ];
    }

    /**
     * @override
     */
    public addHDW(html: N, styles: StyleList): N {
      html = this.html('mjx-html-holder', { style: styles }, [html]);
      const { h, d, w } = this.getBBox();
      const scale = this.metrics.scale;
      styles.height = this.em((h + d) * scale);
      styles.width = this.em(w * scale);
      styles['vertical-align'] = this.em(-d * scale);
      delete styles['font-size'];
      delete styles['font-family'];
      return html;
    }
  };
})<any, any, any>();
