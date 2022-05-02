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
 * @fileoverview  Implements the CHTMLsemantics wrapper for the MmlSemantics object
 *                and the associated wrappers for annotations
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonSemantics, CommonSemanticsClass, CommonSemanticsMixin} from '../../common/Wrappers/semantics.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlSemantics, MmlAnnotation, MmlAnnotationXML} from '../../../core/MmlTree/MmlNodes/semantics.js';
import {XMLNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../../../util/BBox.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLSemantics interface for the CHTML Semantics wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLSemanticsNTD<N, T, D> extends CHTMLWrapper<N, T, D>, CommonSemantics<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLSemanticsClass interface for the CHTML Semantics wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLSemanticsClass<N, T, D> extends CHTMLWrapperClass<N, T, D>, CommonSemanticsClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLSemanticsNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLSemantics wrapper class for the MmlSemantics class
 */
export const CHTMLSemantics = (function <N, T, D>(): CHTMLSemanticsClass<N, T, D> {

  const Base = CommonSemanticsMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLSemanticsClass<N, T, D>
    >(CHTMLWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLSemantics extends Base implements CHTMLSemanticsNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlSemantics.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parent: N) {
      const chtml = this.standardCHTMLnode(parent);
      if (this.childNodes.length) {
        this.childNodes[0].toCHTML(chtml);
      }
    }

  };

})<any, any, any>();


/*****************************************************************/
/**
 * The CHTMLAnnotation wrapper for the MmlAnnotation class
 */
export const CHTMLAnnotation = (function <N, T, D>(): CHTMLWrapperClass<N, T, D> {

  return class CHTMLAnnotation extends CHTMLWrapper<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlAnnotation.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parent: N) {
      // FIXME:  output as plain text
      super.toCHTML(parent);
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
 * The CHTMLAnnotationXML wrapper for the MmlAnnotationXML class
 */
export const CHTMLAnnotationXML = (function <N, T, D>(): CHTMLWrapperClass<N, T, D> {

  return class CHTMLAnnotationXML extends CHTMLWrapper<N, T, D> {

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
 * The CHTMLXmlNode wrapper for the XMLNode class
 */
export const CHTMLXmlNode = (function <N, T, D>(): CHTMLWrapperClass<N, T, D> {

  return class CHTMLXmlNode extends CHTMLWrapper<N, T, D> {

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
    public toCHTML(parent: N) {
      this.dom = this.adaptor.append(parent, this.adaptor.clone((this.node as XMLNode).getXML() as N)) as N;
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
