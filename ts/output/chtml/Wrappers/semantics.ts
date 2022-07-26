/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview  Implements the ChtmlSemantics wrapper for the MmlSemantics object
 *                and the associated wrappers for annotations
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {ChtmlWrapper, ChtmlWrapperClass} from '../Wrapper.js';
import {ChtmlWrapperFactory} from '../WrapperFactory.js';
import {ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData,
        ChtmlFontData, ChtmlFontDataClass} from '../FontData.js';
import {CommonSemantics, CommonSemanticsClass, CommonSemanticsMixin} from '../../common/Wrappers/semantics.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlSemantics, MmlAnnotation, MmlAnnotationXML} from '../../../core/MmlTree/MmlNodes/semantics.js';
import {XMLNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../../../util/BBox.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The ChtmlSemantics interface for the CHTML Semantics wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlSemanticsNTD<N, T, D> extends ChtmlWrapper<N, T, D>, CommonSemantics<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {}

/**
 * The ChtmlSemanticsClass interface for the CHTML Semantics wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlSemanticsClass<N, T, D> extends ChtmlWrapperClass<N, T, D>, CommonSemanticsClass<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {
  new(factory: ChtmlWrapperFactory<N, T, D>, node: MmlNode, parent?: ChtmlWrapper<N, T, D>): ChtmlSemanticsNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The ChtmlSemantics wrapper class for the MmlSemantics class
 */
export const ChtmlSemantics = (function <N, T, D>(): ChtmlSemanticsClass<N, T, D> {

  const Base = CommonSemanticsMixin<
      N, T, D,
      CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass,
      ChtmlSemanticsClass<N, T, D>
    >(ChtmlWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be ChtmlWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class ChtmlSemantics extends Base implements ChtmlSemanticsNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlSemantics.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      const chtml = this.standardChtmlNodes(parents);
      if (this.childNodes.length) {
        this.childNodes[0].toCHTML(chtml);
      }
    }

  };

})<any, any, any>();


/*****************************************************************/
/**
 * The ChtmlAnnotation wrapper for the MmlAnnotation class
 */
export const ChtmlAnnotation = (function <N, T, D>(): ChtmlWrapperClass<N, T, D> {

  return class ChtmlAnnotation extends ChtmlWrapper<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlAnnotation.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
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

  };

})<any, any, any>();


/*****************************************************************/
/**
 * The ChtmlAnnotationXML wrapper for the MmlAnnotationXML class
 */
export const ChtmlAnnotationXML = (function <N, T, D>(): ChtmlWrapperClass<N, T, D> {

  return class ChtmlAnnotationXML extends ChtmlWrapper<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlAnnotationXML.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-annotation-xml': {
        'font-family': 'initial',
        'line-height': 'normal'
      }
    };

  };

})<any, any, any>();


/*****************************************************************/
/**
 * The ChtmlXmlNode wrapper for the XMLNode class
 */
export const ChtmlXmlNode = (function <N, T, D>(): ChtmlWrapperClass<N, T, D> {

  return class ChtmlXmlNode extends ChtmlWrapper<N, T, D> {

    /**
     * @override
     */
    public static kind = XMLNode.prototype.kind;

    /**
     * Don't set up inline-block styles for this
     */
    public static autoStyle = false;

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      this.dom = [this.adaptor.append(parents[0], this.adaptor.clone((this.node as XMLNode).getXML() as N)) as N];
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
