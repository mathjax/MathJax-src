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
 * @file  Implements the ChtmlSemantics wrapper for the MmlSemantics object
 *                and the associated wrappers for annotations
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
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

export type FontStyles = {
  'font-family': string;
  'font-size': string;
};

/*****************************************************************/
/**
 * The ChtmlSemantics interface for the CHTML Semantics wrapper
 *
 * @template DOM  The DOM node types
 */
export interface ChtmlSemanticsNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonSemantics<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlSemanticsClass interface for the CHTML Semantics wrapper
 *
 * @template DOM  The DOM node types
 */
export interface ChtmlSemanticsClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonSemanticsClass<
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
  ): ChtmlSemanticsNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlSemantics wrapper class for the MmlSemantics class
 */
export const ChtmlSemantics = (function (): ChtmlSemanticsClass<DOM> {
  const Base = CommonSemanticsMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlSemanticsClass<DOM>
  >(ChtmlWrapper);

  return class ChtmlSemantics extends Base implements ChtmlSemanticsNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlSemantics.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      const chtml = this.standardChtmlNodes(parents);
      if (this.childNodes.length) {
        this.childNodes[0].toCHTML(chtml);
      }
    }
  };
})();

/*****************************************************************/
/**
 * The ChtmlAnnotation wrapper for the MmlAnnotation class
 */
export class ChtmlAnnotation extends ChtmlWrapper<DOM> {
  /**
   * @override
   */
  public static kind = MmlAnnotation.prototype.kind;

  /**
   * @override
   */
  public toCHTML(parents: N<DOM>[]) {
    // FIXME:  output as plain text
    super.toCHTML(parents);
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
 * The ChtmlAnnotationXML wrapper for the MmlAnnotationXML class
 */
export class ChtmlAnnotationXML extends ChtmlWrapper<DOM> {
  /**
   * @override
   */
  public static kind = MmlAnnotationXML.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleJson = {
    'mjx-annotation-xml': {
      'font-family': 'initial',
      'line-height': 'normal',
    },
  };
}

/*****************************************************************/
/**
 * The ChtmlXmlNode interface for the CHTML XmlNode wrapper
 *
 * @template DOM  The DOM node types
 */
export interface ChtmlXmlNodeNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonXmlNode<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {
  /**
   * @returns {FontStyles}  the font family and size data
   */
  getFontStyles(): FontStyles;
}

/**
 * The ChtmlXmlNodeClass interface for the CHTML XmlNode wrapper
 *
 * @template DOM  The DOM node types
 */
export interface ChtmlXmlNodeClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonXmlNodeClass<
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
  ): ChtmlXmlNodeNTD<DOM>;
}

/**
 * The ChtmlXmlNode wrapper for the XMLNode class
 */
export const ChtmlXmlNode = (function (): ChtmlXmlNodeClass<DOM> {
  const Base = CommonXmlNodeMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlXmlNodeClass<DOM>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlXmlNode extends Base implements ChtmlXmlNodeNTD<DOM> {
    /**
     * @override
     */
    public static kind = XMLNode.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
      this.markUsed();
      this.dom = [this.adaptor.append(parents[0], this.getHTML()) as N<DOM>];
    }

    /**
     * @override
     */
    public getFontStyles(): FontStyles {
      const style = super.getFontStyles();
      style['font-size'] = '1em';
      return style;
    }

    /**
     * @override
     */
    public addHDW(html: N<DOM>, styles: StyleList): N<DOM> {
      const scale = this.jax.options.scale;
      const { h, d, w } = this.bbox;
      const rscale = scale * this.metrics.scale;
      styles.width = this.em(w * rscale);
      styles.height = this.em((h + d) * rscale);
      styles['vertical-align'] = this.em(-d * rscale);
      styles.position = 'relative';
      return this.html(
        'mjx-html-holder',
        {
          style: {
            transform: `scale(${this.jax.fixed(scale)})`,
            'transform-origin': 'top left',
          },
        },
        [html]
      );
    }
  };
})();
