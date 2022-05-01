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
 * @fileoverview  Implements the SVGmrow wrapper for the MmlMrow object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonMrow, CommonMrowClass, CommonMrowMixin,
        CommonInferredMrow, CommonInferredMrowClass, CommonInferredMrowMixin} from '../../common/Wrappers/mrow.js';
import {MmlMrow, MmlInferredMrow} from '../../../core/MmlTree/MmlNodes/mrow.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The SVGMrow interface for the SVG Mrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMrowNTD<N, T, D> extends SVGWrapper<N, T, D>, CommonMrow<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMrowClass interface for the SVG Mrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMrowClass<N, T, D> extends SVGWrapperClass<N, T, D>, CommonMrowClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMrowNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMrow wrapper for the MmlMrow type
 */
export const SVGMrow = (function <N, T, D>(): SVGMrowClass<N, T, D> {

  const Base = CommonMrowMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMrowClass<N, T, D>
    >(SVGWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMrow extends Base implements SVGMrowNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMrow.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
      const svg = (this.node.isInferred ? (this.element = parent) : this.standardSVGnode(parent));
      this.addChildren(svg);
      // FIXME:  handle line breaks
    }

  };

})<any, any, any>();

/*****************************************************************/
/*****************************************************************/

/**
 * The SVGInferredMrow interface for the SVG InferredMrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGInferredMrowNTD<N, T, D> extends SVGMrowNTD<N, T, D>, CommonInferredMrow<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGInferredMrowClass interface for the SVG InferredMrow wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGInferredMrowClass<N, T, D> extends SVGMrowClass<N, T, D>, CommonInferredMrowClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapper<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGInferredMrowNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGInferredMrow wrapper for the MmlInferredMrow class
 */
export const SVGInferredMrow = (function <N, T, D>(): SVGInferredMrowClass<N, T, D> {

  const Base = CommonInferredMrowMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGInferredMrowClass<N, T, D>
    >(SVGMrow);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGInferredMrowNTD extends Base implements SVGInferredMrow<N, T, D> {

    /**
     * The inferred-mrow wrapper
     */
    public static kind = MmlInferredMrow.prototype.kind;

  };

})<any, any, any>();
