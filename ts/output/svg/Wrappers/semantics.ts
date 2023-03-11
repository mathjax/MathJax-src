/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Implements the SvgSemantics wrapper for the MmlSemantics object
 *                and the associated wrappers for annotations
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SvgWrapper, SvgWrapperClass} from '../Wrapper.js';
import {SvgWrapperFactory} from '../WrapperFactory.js';
import {SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass} from '../FontData.js';
import {CommonSemantics, CommonSemanticsClass, CommonSemanticsMixin} from '../../common/Wrappers/semantics.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../../../util/BBox.js';
import {MmlSemantics, MmlAnnotation, MmlAnnotationXML} from '../../../core/MmlTree/MmlNodes/semantics.js';
import {XMLNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The SvgSemantics interface for the SVG Semantics wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgSemanticsNTD<N, T, D> extends SvgWrapper<N, T, D>, CommonSemantics<
  N, T, D,
  SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
  SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass
> {}

/**
 * The SvgSemanticsClass interface for the SVG Semantics wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgSemanticsClass<N, T, D> extends SvgWrapperClass<N, T, D>, CommonSemanticsClass<
  N, T, D,
  SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
  SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass
> {
  new(factory: SvgWrapperFactory<N, T, D>, node: MmlNode, parent?: SvgWrapper<N, T, D>): SvgSemanticsNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SvgSemantics wrapper class for the MmlSemantics class
 */
export const SvgSemantics = (function <N, T, D>(): SvgSemanticsClass<N, T, D> {

  const Base = CommonSemanticsMixin<
      N, T, D,
      SVG<N, T, D>, SvgWrapper<N, T, D>, SvgWrapperFactory<N, T, D>, SvgWrapperClass<N, T, D>,
      SvgCharOptions, SvgVariantData, SvgDelimiterData, SvgFontData, SvgFontDataClass,
      SvgSemanticsClass<N, T, D>
    >(SvgWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SvgWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
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
export const SvgAnnotationXML = (function <N, T, D>(): SvgWrapperClass<N, T, D> {
  return class SvgAnnotationXML extends SvgWrapper<N, T, D> {

    /**
     * The annotation-xml wrapper
     */
    public static kind = MmlAnnotationXML.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'foreignObject[data-mjx-xml]': {
        'font-family': 'initial',
        'line-height': 'normal',
        overflow: 'visible'
      }
    };

  };

})<any, any, any>();


/*****************************************************************/
/**
 * The SvgXmlNode wrapper for the XMLNode object
 */
export const SvgXmlNode = (function <N, T, D>(): SvgWrapperClass<N, T, D> {
  return class SvgXmlNode extends SvgWrapper<N, T, D> {

    /**
     * The XMLNode wrapper
     */
    public static kind = XMLNode.prototype.kind;

    /**
     * Don't include inline-block CSS for this element
     */
    public static autoStyle = false;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      const xml = this.adaptor.clone((this.node as XMLNode).getXML() as N);
      const em = this.jax.math.metrics.em * this.jax.math.metrics.scale;
      const scale = this.fixed(1 / em);
      const {w, h, d} = this.getBBox();
      this.dom = [this.adaptor.append(parents[0], this.svg('foreignObject', {
        'data-mjx-xml': true,
        y: this.jax.fixed(-h * em) + 'px',
        width: this.jax.fixed(w * em) + 'px',
        height: this.jax.fixed((h + d) * em) + 'px',
        transform: `scale(${scale}) matrix(1 0 0 -1 0 0)`
      }, [xml])) as N];
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      const {w, h, d} = this.jax.measureXMLnode((this.node as XMLNode).getXML() as N);
      bbox.w = w;
      bbox.h = h;
      bbox.d = d;
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

})<any, any, any>();
