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
 * @fileoverview  Implements the CHTMLmn wrapper for the MmlMn object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {MmlMn} from '../../../core/MmlTree/MmlNodes/mn.js';
import {MmlNode, AbstractMmlNode, TextNode} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The CHTMLmn wrapper for the MmlMn object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmn<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = MmlMn.prototype.kind;

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

}
