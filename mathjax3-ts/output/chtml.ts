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
 * @fileoverview  Implements the CHTML OutputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CommonOutputJax} from './common/OutputJax.js';
import {StyleList, Styles} from '../util/Styles.js';
import {OptionList} from '../util/Options.js';
import {MathDocument} from '../core/MathDocument.js';
import {MathItem} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {CHTMLWrapper} from './chtml/Wrapper.js';
import {CHTMLWrapperFactory} from './chtml/WrapperFactory.js';
import {TeXFont} from './chtml/fonts/tex.js';

/*****************************************************************/
/**
 *  Implements the CHTML class (extends AbstractOutputJax)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTML<N, T, D> extends CommonOutputJax<N, T, D, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>> {

    public static NAME: string = 'CHTML';
    public static OPTIONS: OptionList = {...CommonOutputJax.OPTIONS};

    /**
     *  Used to store the CHTMLWrapper factory,
     *  the FontData object, and the CssStyles object.
     */
    public factory: CHTMLWrapperFactory<N, T, D>;
    public font: TeXFont;

    /**
     * @override
     * @constructor
     */
    constructor(options: OptionList = null) {
        super(options, CHTMLWrapperFactory, TeXFont);
    }

    /**
     * @override
     */
    public escaped(math: MathItem<N, T, D>, html: MathDocument<N, T, D>) {
        this.setDocument(html);
        return this.html('span', {}, [this.text(math.math)]);
    }

    /**
     * @override
     */
    public styleSheet(html: MathDocument<N, T, D>) {
        const sheet = super.styleSheet(html);
        this.adaptor.setAttribute(sheet, 'id', 'CHTML-styles');
        return sheet;
    }

    /**
     * @override
     */
    protected addClassStyles(CLASS: typeof CHTMLWrapper) {
        if (CLASS.autoStyle && CLASS.kind !== 'unknown') {
            this.cssStyles.addStyles({
                ['mjx-' + CLASS.kind]: {
                    display: 'inline-block',
                    'text-align': 'left'
                }
            });
        }
        super.addClassStyles(CLASS);
    }

    /**
     * @param {MmlNode} math  The MML node whose HTML is to be produced
     * @param {N} parent      The HTML node to contain the HTML
     */
    protected processMath(math: MmlNode, parent: N) {
        this.factory.wrap(math).toCHTML(parent);
    }

    /*****************************************************************/

    /**
     * @override
     */
    public unknownText(text: string, variant: string) {
        const styles: StyleList = {};
        const scale = 100 / this.math.metrics.scale;
        if (scale !== 100) {
            styles['font-size'] = this.fixed(scale, 1) + '%';
        }
        if (variant !== '-explicitFont') {
            this.cssFontStyles(this.font.getCssFont(variant), styles);
        }
        return this.html('mjx-utext', {variant: variant, style: styles}, [this.text(text)]);
    }

    /**
     * Measure the width of a text element by placing it in the page
     *  and looking up its size (fake the height and depth, since we can't measure that)
     *
     * @override
     */
    public measureTextNode(text: N) {
        const adaptor = this.adaptor;
        text = adaptor.clone(text);
        const node = this.html('mjx-measure-text', {}, [text]);
        adaptor.append(adaptor.parent(this.math.start.node), this.container);
        adaptor.append(this.container, node);
        let w = adaptor.nodeSize(text, this.math.metrics.em)[0] / this.math.metrics.scale;
        adaptor.remove(this.container);
        adaptor.remove(node);
        return {w: w, h: .75, d: .25};
    }

    /**
     * @override
     */
    public getFontData(styles: Styles) {
        const font = super.getFontData(styles);
        font[0] = 'MJXZERO, ' + font[0];
        return font;
    }

}
