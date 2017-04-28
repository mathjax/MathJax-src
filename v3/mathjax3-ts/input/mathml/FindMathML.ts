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
 * @fileoverview  Implements the MathML version of the FindMath object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractFindMath} from '../../core/FindMath.js';
import {OptionList} from '../../util/Options.js';
import {ProtoItem} from '../../core/MathItem.js';

/*
 * The MathML namespace
 */
const NAMESPACE = 'http://www.w3.org/1998/Math/MathML';

/*
 * Shorthand for Set of Elements
 */
export type NodeSet = Set<Element>;

/*****************************************************************/
/*
 *  Implements the FindMathML object (extends AbstractFindMath)
 */

export class FindMathML extends AbstractFindMath {

    public static OPTIONS: OptionList = {};

    /*
     * Locates math nodes, possibly with namespace prefixes.
     *  Store them in a set so that if found more than once, they will only
     *  appear in the list once.
     *
     * @override
     */
    public FindMath(node: Element) {
        let set: NodeSet = new Set<Element>();
        this.FindMathNodes(node, set);
        this.FindMathPrefixed(node, set);
        if (node.ownerDocument.documentElement.nodeName === 'html' &&  set.size === 0) {
            this.FindMathNS(node, set);
        }
        return this.ProcessMath(set);
    }

    /*
     * Find plain <math> tags
     *
     * @param{Element} node  The container to seaerch for math
     * @param{NodeSet} set   The set in which to store the math nodes
     */
    protected FindMathNodes(node: Element, set: NodeSet) {
        for (const math of Array.from(node.getElementsByTagName('math'))) {
            set.add(math);
        }
    }

    /*
     * Find <m:math> tags (or whatever prefixes there are)
     *
     * @param{Element} node  The container to seaerch for math
     * @param{NodeSet} set   The set in which to store the math nodes
     */
    protected FindMathPrefixed(node: Element, set: NodeSet) {
        let html = node.ownerDocument.documentElement;
        for (const attr of Array.from(html.attributes)) {
            if (attr.nodeName.substr(0, 6) === 'xmlns:' && attr.nodeValue === NAMESPACE) {
                let prefix = attr.nodeName.substr(6);
                for (const math of Array.from(node.getElementsByTagName(prefix + ':math'))) {
                    set.add(math);
                }
            }
        }
    }

    /*
     * Find namespaced math in XHTML documents (is this really needed?)
     *
     * @param{Element} node  The container to seaerch for math
     * @param{NodeSet} set   The set in which to store the math nodes
     */
    protected FindMathNS(node: Element, set: NodeSet) {
        for (const math of Array.from(node.getElementsByTagNameNS(NAMESPACE, 'math'))) {
            set.add(math);
        }
    }

    /*
     *  Produce the array of proto math items from the node set
     */
    protected ProcessMath(set: NodeSet) {
        let math: ProtoItem[] = [];
        for (const mml of Array.from(set)) {
            let display = (mml.getAttribute('display') === 'block' ||
                           mml.getAttribute('mode') === 'display');
            let start = {node: mml, n: 0, delim: ''};
            let end   = {node: mml, n: 0, delim: ''};
            math.push({math: (mml as HTMLElement).outerHTML, start, end, display});
        }
        return math;
    }

}
