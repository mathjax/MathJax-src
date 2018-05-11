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
 * @fileoverview  Implements the CHTMLmglyph wrapper for the MmlMglyph object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, StringMap} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {BBox} from '../BBox.js';
import {MmlMglyph} from '../../../core/MmlTree/MmlNodes/mglyph.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {Property} from '../../../core/Tree/Node.js';
import {StyleList, StyleData} from '../CssStyles.js';

/*****************************************************************/
/*
 * The CHTMLmglyph wrapper for the MmlMglyph object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmglyph<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = MmlMglyph.prototype.kind;

    public static styles: StyleList = {
        'mjx-mglyph > img': {
            display: 'inline-block',
            border: 0,
            padding: 0
        }
    };

    /*
     * The image's width, height, and voffset values converted to em's
     */
    public width: number;
    public height: number;
    public voffset: number;

    /*
     * @override
     * @constructor
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        this.getParameters();
    }

    /*
     * Obtain the width, height, and voffset.
     * Note:  Currently, the width and height must be specified explicitly, or they default to 1em
     *   Since loading the image may be asynchronous, it would require a restart.
     *   A future extension could implement this either by subclassing this object, or
     *   perhaps as a post-filter on the MathML input jax that adds the needed dimensions
     */
    protected getParameters() {
        const {width, height, voffset} = this.node.attributes.getList('width', 'height', 'voffset');
        this.width = (width === 'auto' ? 1 : this.length2em(width));
        this.height = (height === 'auto' ? 1 : this.length2em(height));
        this.voffset = this.length2em(voffset || '0');
    }

    /*
     * @override
     */
    public toCHTML(parent: N) {
        const chtml = this.standardCHTMLnode(parent);
        const {src, alt} = this.node.attributes.getList('src', 'alt');
        const styles: StyleData = {
            width: this.em(this.width),
            height: this.em(this.height)
        };
        if (this.voffset) {
            styles.verticalAlign = this.em(-this.voffset);
        }
        const img = this.html('img', {src: src, style: styles, alt: alt, title: alt});
        this.adaptor.append(chtml, img);
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        bbox.w = this.width;
        bbox.h = this.height - this.voffset;
        bbox.d = this.voffset;
    }

}
