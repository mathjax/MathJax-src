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

import {AbstractOutputJax} from '../core/OutputJax.js';
import {OptionList, separateOptions} from '../util/Options.js';
import {MathDocument} from '../core/MathDocument.js';
import {MathItem} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {CHTMLWrapper} from './chtml/Wrapper.js';
import {CHTMLWrapperFactory} from './chtml/WrapperFactory.js';
import {FontData} from './chtml/FontData.js';
import {TeXFont} from './chtml/fonts/tex.js';
import {CssStyles} from './chtml/CssStyles.js';
import {percent} from '../util/lengths.js';
import {BBox} from './chtml/BBox.js';


/*****************************************************************/
/*
 *  Implements the CHTML class (extends AbstractOutputJax)
 */

/*
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTML<N, T, D> extends AbstractOutputJax<N, T, D> {

    public static NAME: string = 'CHTML';
    public static OPTIONS: OptionList = {
        ...AbstractOutputJax.OPTIONS,
        scale: 1,                      // Global scaling factor for all expressions
        skipAttributes: {},            // RFDa and other attributes NOT to copy to CHTML output
        CHTMLWrapperFactory: null,     // The CHTMLWrapper factory to use
        font: null,                    // The FontData object to use
        cssStyles: null                // The CssStyles object to use
    };

    /*
     *  Used to store the CHTMLWrapper factory,
     *  the FontData object, and the CssStyles object.
     */
    public factory: CHTMLWrapperFactory<N, T, D>;
    public font: FontData;
    public cssStyles: CssStyles;

    /*
     * The MathDocument for the math we find
     * and the MathItem currently being processed
     */
    public document: MathDocument<N, T, D>;
    public math: MathItem<N, T, D>;

    /*
     * A map from the nodes in the expression currently being processed to the
     * wrapper nodes for them (used by functions like core() to locate the wrappers
     * from the core nodes)
     */
    public nodeMap: Map<MmlNode, CHTMLWrapper<N, T, D>>;

    /*
     * Get the WrapperFactory and connect it to this output jax
     * Get the cssStyle and font objects
     *
     * @param{OptionList} options  The configuration options
     * @constructor
     */
    constructor(options: OptionList = null) {
        const [chtmlOptions, fontOptions] = separateOptions(options, TeXFont.OPTIONS);
        super(chtmlOptions);
        this.factory = this.options.CHTMLWrapperFactory || new CHTMLWrapperFactory<N, T, D>();
        this.factory.chtml = this;
        this.cssStyles = this.options.cssStyles || new CssStyles();
        this.font = this.options.font || new TeXFont(fontOptions);
    }

    /*
     * Save the math document and the math item
     * Set the document where HTML nodes will be created via the adaptor
     * Recursively set the TeX classes for the nodes
     * Create the container mjx-chtml node
     * Create the CHTML output for the root MathML node in the container
     *
     * @override
     */
    public typeset(math: MathItem<N, T, D>, html: MathDocument<N, T, D>) {
        this.document = html;
        this.math = math;
        this.adaptor.document = html.document;
        math.root.setTeXclass(null);
        let node = this.html('mjx-chtml', {'class': 'MathJax MJX-CHTML MJX-TEX'});
        const scale = math.metrics.scale * this.options.scale;
        if (scale !== 1) {
            this.adaptor.setStyle(node, 'fontSize', percent(scale));
        }
        this.nodeMap = new Map<MmlNode, CHTMLWrapper<N, T, D>>();
        this.toCHTML(math.root, node);
        this.nodeMap = null;
        return node;
    }

    /*
     * @param{MathItem} math      The MathItem to get the bounding box for
     * @param{MathDocument} html  The MathDocument for the math
     */
    public getBBox(math: MathItem<N, T, D>, html: MathDocument<N, T, D>) {
        this.document = html;
        this.math = math;
        this.adaptor.document = html.document;
        math.root.setTeXclass(null);
        this.nodeMap = new Map<MmlNode, CHTMLWrapper<N, T, D>>();
        let bbox = this.factory.wrap(math.root).getBBox();
        this.nodeMap = null;
        return bbox;
    }

    /*
     * @override
     */
    public escaped(math: MathItem<N, T, D>, html: MathDocument<N, T, D>) {
        this.adaptor.document = html.document;
        return this.html('span', {}, [this.text(math.math)]);
    }

    /*
     * @override
     */
    public getMetrics(html: MathDocument<N, T, D>) {
        for (const math of html.math) {
            math.setMetrics(16, 8, 1000000, 1000000, 1);
        }
    }

    /*
     * @override
     */
    public styleSheet(html: MathDocument<N, T, D>) {
        this.adaptor.document = html.document;
        //
        // Gather the CSS from the classes
        //
        for (const kind of this.factory.getKinds()) {
            const CLASS = this.factory.getNodeClass(kind);
            if (CLASS.autoStyle && kind !== 'unknown') {
                this.cssStyles.addStyles({['mjx-' + CLASS.kind]: {display: 'inline-block'}});
            }
            this.cssStyles.addStyles(CLASS.styles);
        }
        //
        // Get the font styles
        //
        this.cssStyles.addStyles((this.font as TeXFont).styles);
        //
        // Create the stylesheet for the CSS
        //
        const sheet = this.html('style', {id: 'CHTML-styles'},
                                [this.text('\n' + this.cssStyles.cssText + '\n')]);
        return sheet as N;
    }

    /*
     * @param{MmlNode} node  The MML node whose HTML is to be produced
     * @param{HTMLElement} parent  The HTML node to contain the HTML
     */
    public toCHTML(node: MmlNode, parent: N) {
        return this.factory.wrap(node).toCHTML(parent);
    }

    /*
     * @param{string} type  The type of HTML node to create
     * @param{OptionList} def  The properties to set on the HTML node
     * @param{HTMLElement[]} content  Array of child nodes to set for the HTML node
     *
     * @return{HTMLElement} The newly created HTML tree
     */
    public html(type: string, def: OptionList = {}, content: (N | T)[] = []) {
        return this.adaptor.node(type, def, content);
    }

    /*
     * @param{string} text  The text string for which to make a text node
     *
     * @return{HTMLElement}  A text node with the given text
     */
    public text(text: string) {
        return this.adaptor.text(text);
    }

}
