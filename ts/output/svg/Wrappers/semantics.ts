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
 * @fileoverview  Implements the SVGsemantics wrapper for the MmlSemantics object
 *                and the associated wrappers for annotations
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonSemantics, CommonSemanticsClass, CommonSemanticsMixin} from '../../common/Wrappers/semantics.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../../../util/BBox.js';
import {MmlSemantics, MmlAnnotation, MmlAnnotationXML} from '../../../core/MmlTree/MmlNodes/semantics.js';
import {XMLNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The SVGSemantics interface for the SVG Semantics wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGSemanticsNTD<N, T, D> extends SVGWrapper<N, T, D>, CommonSemantics<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGSemanticsClass interface for the SVG Semantics wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGSemanticsClass<N, T, D> extends SVGWrapperClass<N, T, D>, CommonSemanticsClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGSemanticsNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGSemantics wrapper class for the MmlSemantics class
 */
export const SVGSemantics = (function <N, T, D>(): SVGSemanticsClass<N, T, D> {

  const Base = CommonSemanticsMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGSemanticsClass<N, T, D>
    >(SVGWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGSemantics extends Base implements SVGSemanticsNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlSemantics.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
      const svg = this.standardSVGnode(parent);
      if (this.childNodes.length) {
        this.childNodes[0].toSVG(svg);
      }
    }

  };

})<any, any, any>();


/*****************************************************************/
/**
 * The SVGAnnotation wrapper for the MmlAnnotation object
 */
export const SVGAnnotation = (function <N, T, D>(): SVGWrapperClass<N, T, D> {

  return class SVGAnnotation extends SVGWrapper<N, T, D> {

    /**
     * The annotation wrapper
     */
    public static kind = MmlAnnotation.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
      // FIXME:  output as plain text
      super.toSVG(parent);
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
 * The SVGAnnotationXML wrapper for the MmlAnnotationXML object
 */
export const SVGAnnotationXML = (function <N, T, D>(): SVGWrapperClass<N, T, D> {
  return class SVGAnnotationXML extends SVGWrapper<N, T, D> {

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
 * The SVGXmlNode wrapper for the XMLNode object
 */
export const SVGXmlNode = (function <N, T, D>(): SVGWrapperClass<N, T, D> {
  return class SVGXmlNode extends SVGWrapper<N, T, D> {

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
    public toSVG(parent: N) {
      const xml = this.adaptor.clone((this.node as XMLNode).getXML() as N);
      const em = this.jax.math.metrics.em * this.jax.math.metrics.scale;
      const scale = this.fixed(1 / em);
      const {w, h, d} = this.getBBox();
      this.element = this.adaptor.append(parent, this.svg('foreignObject', {
        'data-mjx-xml': true,
        y: this.jax.fixed(-h * em) + 'px',
        width: this.jax.fixed(w * em) + 'px',
        height: this.jax.fixed((h + d) * em) + 'px',
        transform: `scale(${scale}) matrix(1 0 0 -1 0 0)`
      }, [xml])) as N;
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
