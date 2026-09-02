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
 * @file  Implements the SvgSemantics wrapper for the MmlSemantics object
 *                and the associated wrappers for annotations
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
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
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgSemantics interface for the SVG Semantics wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgSemanticsNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonSemantics<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgSemanticsClass interface for the SVG Semantics wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgSemanticsClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonSemanticsClass<
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
  ): SvgSemanticsNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgSemantics wrapper class for the MmlSemantics class
 */
export const SvgSemantics = (function (): SvgSemanticsClass<DOM> {
  const Base = CommonSemanticsMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgSemanticsClass<DOM>
  >(SvgWrapper);

  return class SvgSemantics extends Base implements SvgSemanticsNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlSemantics.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
      if (this.toEmbellishedSVG(parents)) return;
      const svg = this.standardSvgNodes(parents);
      if (this.childNodes.length) {
        this.childNodes[0].toSVG(svg);
      }
    }
  };
})();

/*****************************************************************/
/**
 * The SvgAnnotation wrapper for the MmlAnnotation object
 */
export class SvgAnnotation extends SvgWrapper<DOM> {
  /**
   * The annotation wrapper
   */
  public static kind = MmlAnnotation.prototype.kind;

  /**
   * @override
   */
  public toSVG(parents: N<DOM>[]) {
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
}

/*****************************************************************/
/**
 * The SvgAnnotationXML wrapper for the MmlAnnotationXML object
 */
export class SvgAnnotationXML extends SvgWrapper<DOM> {
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
}

/*****************************************************************/
/**
 * The SvgXmlNode interface for the SVG XmlNode wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgXmlNodeNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonXmlNode<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgXmlNodeClass interface for the SVG XmlNode wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgXmlNodeClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonXmlNodeClass<
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
  ): SvgXmlNodeNTD<DOM>;
}

/**
 * The SvgXmlNode wrapper for the XMLNode object
 */
export const SvgXmlNode = (function (): SvgXmlNodeClass<DOM> {
  const Base = CommonXmlNodeMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgXmlNodeClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgXmlNode extends Base implements SvgXmlNodeNTD<DOM> {
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
    public toSVG(parents: N<DOM>[]) {
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
              transform: `scale(${scale} ${-scale})`,
              'font-size': 'initial',
            },
            [this.getHTML()]
          )
        ) as N<DOM>,
      ];
    }

    /**
     * @override
     */
    public addHDW(html: N<DOM>, styles: StyleList): N<DOM> {
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
})();
