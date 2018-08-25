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
 * @fileoverview  Implements the CommonMi wrapper mixin for the MmlMi object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor} from '../Wrapper.js';
import {BBox} from '../BBox.js';

/*****************************************************************/
/**
 * The CommonMi interface
 */
export interface CommonMiInterface extends AnyWrapper {
    noIC: boolean;
}

/**
 * Shorthand for the CommonMi constructor
 */
export type MiConstructor = Constructor<CommonMiInterface>;

/*****************************************************************/
/**
 *  The CommonMi wrapper mixin for the MmlMi object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template U  The Wrapper class constructor type
 */
export function CommonMi<N, T, D, U extends WrapperConstructor>(Base: U): MiConstructor & U {
    return class extends Base {

        /**
         * True if no italic correction should be used
         */
        public noIC: boolean = false;

        /**
         * @override
         */
        public computeBBox(bbox: BBox) {
            super.computeBBox(bbox);
            this.copySkewIC(bbox);
        }

    };

}
