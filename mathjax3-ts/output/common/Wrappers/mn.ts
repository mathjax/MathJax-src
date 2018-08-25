/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview  Implements the CommonMn wrapper mixin for the MmlMn object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor} from '../Wrapper.js';
import {TextNode} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The CommonMn interface
 */
export interface CommonMnInterface extends AnyWrapper {
}

/**
 * Shorthand for the CommonMn constructor
 */
export type MnConstructor = Constructor<CommonMnInterface>;

/*****************************************************************/
/**
 * The Commonmn wrapper for the MmlMn object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template U  The Wrapper class constructor type
 */
export function CommonMn<N, T, D, U extends WrapperConstructor>(Base: U): MnConstructor & U {
    return class extends Base {

        /**
         * @override
         */
        public remapChars(chars: number[]) {
            //
            //  Convert a leading hyphen to a minus
            //
            if (chars.length) {
                const string = this.font.getRemappedChar('mn', chars[0]);
                if (string) {
                    const c = this.unicodeChars(string);
                    if (c.length === 1) {
                        chars[0] = c[0];
                    } else {
                        chars = c.concat(chars.slice(1));
                    }
                }
            }
            return chars;
        }
    };

}
