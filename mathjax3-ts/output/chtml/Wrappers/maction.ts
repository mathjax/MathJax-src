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
 * @fileoverview  Implements the CHTMLmaction wrapper for the MmlMaction object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, StringMap} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {BBox} from '../BBox.js';
import {MmlMaction} from '../../../core/MmlTree/MmlNodes/maction.js';
import {MmlNode, TextNode} from '../../../core/MmlTree/MmlNode.js';
import {Property} from '../../../core/Tree/Node.js';
import {StyleList} from '../CssStyles.js';

/*****************************************************************/

/*
 * The types needed to define the actiontypes
 */
export type ActionHandler<N, T, D> = (node: CHTMLmaction<N, T, D>) => void;
export type ActionMap = Map<string, ActionHandler<any, any, any>>;
export type ActionPair = [string, ActionHandler<any, any, any>];


/*****************************************************************/
/*
 * The CHTMLmaction wrapper for the MmlMaction object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmaction<N, T, D> extends CHTMLWrapper<N, T, D> {
    public static kind = MmlMaction.prototype.kind;

    public static styles: StyleList = {
        'mjx-maction': {
            position: 'relative'
        },
        'mjx-maction > mjx-tool': {
            display: 'none',
            position: 'absolute',
            bottom: '-.33em', right: 0,
            width: 0, height: 0
        },
        'mjx-tool > mjx-tip': {
            display: 'inline-block',
            padding: '.2em',
            border: '1px solid #888',
            'font-size': '70%',
            'background-color': '#F8F8F8',
            color: 'black',
            'box-shadow': '2px 2px 5px #AAAAAA'
        },
        'mjx-maction[toggle]': {
            cursor: 'pointer'
        }
    };

    /*
     * The valid action types and their handlers
     */
    public static Actions = new Map([
        ['toggle', node => {
            node.adaptor.setAttribute(node.chtml, 'toggle', node.node.attributes.get('selection') as string);
        }],

        ['tooltip', node => {
            const tip = node.childNodes[1];
            if (!tip) return;
            if (tip.node.isKind('mtext')) {
                const text = (tip.node as TextNode).getText();
                node.adaptor.setAttribute(node.chtml, 'title', text);
            } else {
                const box = node.html('mjx-tip');
                tip.toCHTML(box);
                node.adaptor.append(node.chtml, node.html('mjx-tool', {}, [box]));
            }
        }],

        ['statusline', node => {
            const tip = node.childNodes[1];
            if (!tip) return;
            if (tip.node.isKind('mtext')) {
                const text = (tip.node as TextNode).getText();
                node.adaptor.setAttribute(node.chtml, 'statusline', text);
            }
        }]

    ] as ActionPair[]);

    /*
     *  The handler for the specified actiontype
     */
    protected action: ActionHandler<N, T, D> = null;

    /*
     * @return{CHTMLWrapper}  The selected child wrapper
     */
    public get selected(): CHTMLWrapper<N, T, D> {
        const selection = this.node.attributes.get('selection') as number;
        const i = Math.max(1, Math.min(this.childNodes.length, selection)) - 1;
        return this.childNodes[i] || this.wrap((this.node as MmlMaction).selected);
    }

    /*
     * @override
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        const actions = (this.constructor as typeof CHTMLmaction).Actions;
        const action = this.node.attributes.get('actiontype') as string;
        this.action = actions.get(action) || ((node => {}) as ActionHandler<N, T, D>);
    }

    /*
     * @override
     */
    public toCHTML(parent: N) {
        const chtml = this.standardCHTMLnode(parent);
        const child = this.selected;
        child.toCHTML(chtml);
        this.action(this);
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        bbox.updateFrom(this.selected.getBBox());
    }

}
