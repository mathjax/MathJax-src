/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file  Implements the ChtmlMpadded wrapper for the MmlMpadded object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass, StringMap } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  ChtmlCharOptions,
  ChtmlVariantData,
  ChtmlDelimiterData,
  ChtmlFontData,
  ChtmlFontDataClass,
} from '../FontData.js';
import {
  CommonMpadded,
  CommonMpaddedClass,
  CommonMpaddedMixin,
} from '../../common/Wrappers/mpadded.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMpadded } from '../../../core/MmlTree/MmlNodes/mpadded.js';
import { StyleJson } from '../../../util/StyleJson.js';

/*****************************************************************/
/**
 * The ChtmlMpadded interface for the CHTML Mpadded wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMpaddedNTD<N, T, D>
  extends ChtmlWrapper<N, T, D>,
    CommonMpadded<
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
 * The ChtmlMpaddedClass interface for the CHTML Mpadded wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMpaddedClass<N, T, D>
  extends ChtmlWrapperClass<N, T, D>,
    CommonMpaddedClass<
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
  ): ChtmlMpaddedNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMpadded wrapper class for the MmlMpadded class
 */
export const ChtmlMpadded = (function <N, T, D>(): ChtmlMpaddedClass<N, T, D> {
  const Base = CommonMpaddedMixin<
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
    ChtmlMpaddedClass<N, T, D>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  //   type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  //   different by typescript)
  return class ChtmlMpadded extends Base implements ChtmlMpaddedNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMpadded.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-mpadded': {
        display: 'inline-block',
      },
      'mjx-rbox': {
        display: 'inline-block',
        position: 'relative',
      },
    };

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      let chtml = this.standardChtmlNodes(parents);
      const content: N[] = [];
      const style: StringMap = {};
      const [, , W, dh, dd, dw, x, y, dx] = this.getDimens();
      //
      // If the width changed, set the width explicitly
      //
      if (dw || this.childNodes[0].getBBox().pwidth) {
        style.width = this.em(W + dw);
      }
      //
      // If the height or depth changed, use margin to make the change
      //
      if (dh || dd) {
        style.margin = this.em(dh) + ' 0 ' + this.em(dd);
      }
      //
      // If there is a horizontal or vertical shift,
      //   use relative positioning to move the contents
      //
      if (x + dx || y) {
        style.position = 'relative';
        const rbox = this.html('mjx-rbox', {
          style: {
            left: this.em(x + dx),
            top: this.em(-y),
            'max-width': style.width,
          },
        });
        if (x + dx && this.childNodes[0].getBBox().pwidth) {
          this.adaptor.setAttribute(rbox, 'width', 'full');
          this.adaptor.setStyle(rbox, 'left', this.em(x));
        }
        content.push(rbox);
      }
      //
      //  Create the HTML with the proper styles and content
      //
      chtml = [
        this.adaptor.append(
          chtml[0],
          this.html('mjx-block', { style: style }, content)
        ) as N,
      ];
      if (this.childNodes[0].childNodes.length) {
        this.childNodes[0].toCHTML([content[0] || chtml[0]]);
      } else if (dh || dd) {
        // forces margins to take effect
        this.adaptor.append(content[0] || chtml[0], this.html('mjx-box'));
      }
    }
  };
})<any, any, any>();
