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
 * @file  Implements the ChtmlMglyph wrapper for the MmlMglyph object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMglyph,
  CommonMglyphClass,
  CommonMglyphMixin,
} from '../../common/Wrappers/mglyph.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMglyph } from '../../../core/MmlTree/MmlNodes/mglyph.js';
import { ChtmlTextNodeNTD } from './TextNode.js';
import { StyleJson, StyleJsonData } from '../../../util/StyleJson.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMglyph interface for the CHTML Mglyph wrapper
 *
 * @template DOM   The DOM nod types
 */
export interface ChtmlMglyphNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonMglyph<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMglyphClass interface for the CHTML Mglyph wrapper
 *
 * @template DOM   The DOM nod types
 */
export interface ChtmlMglyphClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonMglyphClass<
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
  ): ChtmlMglyphNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMglyph wrapper class for the MmlMglyph class
 */
export const ChtmlMglyph = (function (): ChtmlMglyphClass<DOM> {
  const Base = CommonMglyphMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMglyphClass<DOM>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMglyph extends Base implements ChtmlMglyphNTD<DOM> {
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
    public toCHTML(parents: N<DOM>[]) {
      const chtml = this.standardChtmlNodes(parents);
      if (this.charWrapper) {
        (this.charWrapper as ChtmlTextNodeNTD<DOM>).toCHTML(chtml);
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
})();
