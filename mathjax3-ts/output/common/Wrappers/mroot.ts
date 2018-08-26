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
 * @fileoverview  Implements the CommonMroot wrapper mixin for the MmlMroot object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CommonMsqrtInterface, MsqrtConstructor} from './msqrt.js';
import {CommonMoInterface} from './mo.js';
import {BBox} from '../BBox.js';
import {MmlMroot} from '../../../core/MmlTree/MmlNodes/mroot.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The CommonMroot interface
 */
export interface CommonMrootInterface extends CommonMsqrtInterface {
}

/**
 * Shorthand for the CommonMroot constructor
 */
export type MrootConstructor = Constructor<CommonMrootInterface>;

/*****************************************************************/
/**
 * The CommonMroot wrapper mixin for the MmlMroot object (extends CHTMLmsqrt)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template U  The Wrapper class constructor type
 */
export function CommonMroot<N, T, D, U extends MsqrtConstructor>(Base: U): MrootConstructor & U {
    return class extends Base {

        /**
         * @override
         */
        get surd() {
            return 2;
        }

        /**
         * @override
         */
        get root(): number {
            return 1;
        }

        /**
         * @override
         */
        public combineRootBBox(BBOX: BBox, sbox: BBox) {
            const bbox = this.childNodes[this.root].getBBox();
            const [x, h] = this.getRootDimens(sbox);
            BBOX.combine(bbox, 0, h);
        }

        /**
         * @override
         */
        public getRootDimens(sbox: BBox) {
            const surd = this.childNodes[this.surd] as CommonMoInterface;
            const bbox = this.childNodes[this.root].getBBox();
            const offset = (surd.size < 0 ? .5 : .6) * sbox.w;
            const {w, rscale} = bbox;
            const W = Math.max(w, offset / rscale);
            const dx = Math.max(0, W - w);
            const h = this.rootHeight(bbox, sbox, surd.size);
            const x = W * rscale - offset;
            return [x, h, dx];
        }

        /**
         * @param {BBox} rbox      The bbox of the root
         * @param {BBox} sbox      The bbox of the surd
         * @param {number} size    The size of the surd
         * @return {number}        The height of the root within the surd
         */
        public rootHeight(rbox: BBox, sbox: BBox, size: number) {
            const H = sbox.h + sbox.d;
            const b = (size < 0 ? 2 + .3 * (H - 4) : .55 * H) - sbox.d;
            return b + Math.max(0, rbox.d * rbox.rscale);
        }

    };

}
