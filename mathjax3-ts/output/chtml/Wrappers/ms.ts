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
 * @fileoverview  Implements the CHTMLmspace wrapper for the MmlMs object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {MmlMs} from '../../../core/MmlTree/MmlNodes/ms.js';
import {MmlNode, AbstractMmlNode, TextNode} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/*
 *  The CHTMLms wrapper for the MmlMs object
 */

export class CHTMLms extends CHTMLWrapper {
    public static kind = MmlMs.prototype.kind;

    /*
     * Add the quote characters to the wrapper children so they will be output
     *
     * @override
     */
    constructor(factory: CHTMLWrapperFactory, node: MmlNode, parent: CHTMLWrapper = null) {
        super(factory, node, parent);
        const attributes = this.node.attributes;
        let quotes = attributes.getList('lquote', 'rquote');
        if (this.variant !== 'monospace') {
            if (!attributes.isSet('lquote') && quotes.lquote === '"') quotes.lquote = '\u201C';
            if (!attributes.isSet('rquote') && quotes.rquote === '"') quotes.rquote = '\u201D';
        }
        this.childNodes.unshift(this.createText(quotes.lquote as string));
        this.childNodes.push(this.createText(quotes.rquote as string));
    }

    /*
     * Create a text wrapper with the given text;
     *
     * @param{string} text  The text for the wrapped element
     * @return{CHTMLWrapper}   The wrapped text node
     */
    protected createText(text: string) {
        const mmlFactory = (this.node as AbstractMmlNode).factory;
        const node = this.wrap((mmlFactory.create('text') as TextNode).setText(text));
        node.parent = this;
        return node;
    }

}
