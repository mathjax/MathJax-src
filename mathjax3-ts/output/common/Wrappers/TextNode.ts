/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview  Implements the CommonTextNode wrapper mixin for the TextNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {BBox} from '../BBox.js';
import {TextNode} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The CommonTextNode interface
 */
export interface CommonTextNode extends AnyWrapper {
}

/**
 * Shorthand for the CommonTextNode constructor
 */
export type TextNodeConstructor = Constructor<CommonTextNode>;

/*****************************************************************/
/**
 *  The CommonTextNode wrapper mixin for the TextNode object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonTextNodeMixin<T extends WrapperConstructor>(Base: T): TextNodeConstructor & T {
   return class extends Base {

       /**
        * @override
        */
       public computeBBox(bbox: BBox) {
           const variant = this.parent.variant;
           if (variant === '-explicitFont') {
               // FIXME:  measure this using DOM, if possible
           } else {
               const c = this.parent.stretch.c;
               const text = (this.node as TextNode).getText();
               const chars = this.parent.remapChars(c ? [c] : this.unicodeChars(text));
               let [h, d, w, data] = this.getVariantChar(variant, chars[0]);
               bbox.h = h;
               bbox.d = d;
               bbox.w = w;
               bbox.ic = data.ic || 0;
               bbox.sk = data.sk || 0;
               for (let i = 1, m = chars.length; i < m; i++) {
                   [h, d, w, data] = this.getVariantChar(variant, chars[i]);
                   bbox.w += w;
                   if (h > bbox.h) bbox.h = h;
                   if (d > bbox.d) bbox.d = d;
                   bbox.ic = data.ic || 0;
                   bbox.sk = 0;
               }
           }
       }

       /******************************************************/
       /*
        * TextNodes don't need these, since these properties
        *   are inherited from the parent nodes
        */

       /**
        * @override
        */
       public getStyles() {}

       /**
        * @override
        */
       public getVariant() {}

       /**
        * @override
        */
       public getScale() {}

       /**
        * @override
        */
       public getSpace() {}

   };

}
