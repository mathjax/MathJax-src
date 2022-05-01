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
 * @fileoverview  Implements the SVGmspace wrapper for the MmlMspace object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonMspace, CommonMspaceClass, CommonMspaceMixin} from '../../common/Wrappers/mspace.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMspace} from '../../../core/MmlTree/MmlNodes/mspace.js';

/*****************************************************************/
/**
 * The SVGMspace interface for the SVG Mspace wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMspaceNTD<N, T, D> extends SVGWrapper<N, T, D>, CommonMspace<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMspaceClass interface for the SVG Mspace wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMspaceClass<N, T, D> extends SVGWrapperClass<N, T, D>, CommonMspaceClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMspaceNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMspace wrapper class for the MmlMspace class
 */
export const SVGMspace = (function <N, T, D>(): SVGMspaceClass<N, T, D> {

  const Base = CommonMspaceMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMspaceClass<N, T, D>
    >(SVGWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMspace extends Base implements SVGMspaceNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMspace.prototype.kind;

  };

})<any, any, any>();
