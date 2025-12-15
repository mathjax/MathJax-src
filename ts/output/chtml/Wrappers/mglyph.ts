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
 * @file  Implements the ChtmlMglyph wrapper for the MmlMglyph object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  ChtmlCharOptions,
  ChtmlVariantData,
  ChtmlDelimiterData,
  ChtmlFontData,
  ChtmlFontDataClass,
} from '../FontData.js';
import {
  CommonMglyph,
  CommonMglyphClass,
  CommonMglyphMixin,
} from '../../common/Wrappers/mglyph.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMglyph } from '../../../core/MmlTree/MmlNodes/mglyph.js';
import { ChtmlTextNodeNTD } from './TextNode.js';
import { StyleJson, StyleJsonData } from '../../../util/StyleJson.js';

/*****************************************************************/
/**
 * The ChtmlMglyph interface for the CHTML Mglyph wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMglyphNTD<N, T, D>
  extends
    ChtmlWrapper<N, T, D>,
    CommonMglyph<
      N,
      T,
      D,
      CHTML<N, T, D>,
      ChtmlWrapper<N, T, D>,
      ChtmlWrapperFactory<N, T, D>,
      ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions,
      ChtmlVariantData,
      ChtmlDelimiterData,
      ChtmlFontData,
      ChtmlFontDataClass
    > {}

/**
 * The ChtmlMglyphClass interface for the CHTML Mglyph wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMglyphClass<N, T, D>
  extends
    ChtmlWrapperClass<N, T, D>,
    CommonMglyphClass<
      N,
      T,
      D,
      CHTML<N, T, D>,
      ChtmlWrapper<N, T, D>,
      ChtmlWrapperFactory<N, T, D>,
      ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions,
      ChtmlVariantData,
      ChtmlDelimiterData,
      ChtmlFontData,
      ChtmlFontDataClass
    > {
  new (
    factory: ChtmlWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: ChtmlWrapper<N, T, D>
  ): ChtmlMglyphNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMglyph wrapper class for the MmlMglyph class
 */
export const ChtmlMglyph = (function <N, T, D>(): ChtmlMglyphClass<N, T, D> {
  const Base = CommonMglyphMixin<
    N,
    T,
    D,
    CHTML<N, T, D>,
    ChtmlWrapper<N, T, D>,
    ChtmlWrapperFactory<N, T, D>,
    ChtmlWrapperClass<N, T, D>,
    ChtmlCharOptions,
    ChtmlVariantData,
    ChtmlDelimiterData,
    ChtmlFontData,
    ChtmlFontDataClass,
    ChtmlMglyphClass<N, T, D>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlMglyph extends Base implements ChtmlMglyphNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMglyph.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-mglyph > img': {
        display: 'inline-block',
        border: 0,
        padding: 0,
      },
    };

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      const chtml = this.standardChtmlNodes(parents);
      if (this.charWrapper) {
        (this.charWrapper as ChtmlTextNodeNTD<N, T, D>).toCHTML(chtml);
        return;
      }
      const { src, alt } = this.node.attributes.getList('src', 'alt');
      const styles: StyleJsonData = {
        width: this.em(this.width),
        height: this.em(this.height),
      };
      if (this.valign) {
        styles.verticalAlign = this.em(this.valign);
      }
      const img = this.html('img', {
        src: src,
        style: styles,
        alt: alt,
        title: alt,
      });
      this.adaptor.append(chtml[0], img);
    }
  };
})<any, any, any>();
