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

export type EventHandler = (event: Event) => void;
export type EventList = [any, string, EventHandler];

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
            node.setEventHandler('click', node.toggleClick);
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
                node.setEventHandler('mouseover', node.tooltipOver);
                node.setEventHandler('mouseout',  node.tooltipOut);
            }
        }],

        ['statusline', node => {
            const tip = node.childNodes[1];
            if (!tip) return;
            if (tip.node.isKind('mtext')) {
                const text = (tip.node as TextNode).getText();
                node.adaptor.setAttribute(node.chtml, 'statusline', text);
                node.setEventHandler('mouseover', node.statusOver);
                node.setEventHandler('mouseout', node.statusOut);
            }
        }]

    ] as ActionPair[]);

    /*************************************************************/

    /*
     *  Delays before posting or clearing a math tooltip
     */
    public static postDelay = 600;
    public static clearDelay = 100;

    /*************************************************************/

    /*
     * The handler for the specified actiontype
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

    /*************************************************************/

    /*
     * @override
     */
    constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
        super(factory, node, parent);
        const Actions = (this.constructor as typeof CHTMLmaction).Actions;
        const action = this.node.attributes.get('actiontype') as string;
        this.action = Actions.get(action) || ((node => {}) as ActionHandler<N, T, D>);
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

    /*************************************************************/
    /*************************************************************/
    /*
     * Handle events for the actions
     */

    /*
     * Add an event handler to the output for this maction
     */
    public setEventHandler(type: string, handler: EventHandler) {
        (this.chtml as any).addEventListener(type, handler.bind(this));
    }

    /*************************************************************/
    /*
     *  Handle statuline changes
     */

    /*
     * Change the selection and rerender the expression
     */
    public toggleClick() {
        let selection = Math.max(1, (this.node.attributes.get('selection') as number) + 1);
        if (selection > this.childNodes.length) {
            selection = 1;
        }
        this.node.attributes.set('selection', selection);
        this.toggleRerender();
    }

    /*
     * Rerender the complete expression and replace it in the document
     */
    protected toggleRerender() {
        const html = this.getMathHTML();
        if (!html) return;
        const CHTML = this.factory.chtml;
        const node = CHTML.typeset(CHTML.math, CHTML.document);
        this.adaptor.replace(node, html);
    }

    /*
     * @return{N}  The html for the top-level mjx-chtml node for the expression
     */
    protected getMathHTML() {
        let parent = this as CHTMLWrapper<N, T, D>;
        while (!parent.node.isKind('math')) {
            parent = parent.parent;
            if (!parent) return null;
        }
        return this.adaptor.parent(parent.chtml);
    }

    /*************************************************************/
    /*
     *  Handle tool tips containing math
     */

    /*
     * Timers for posting/clearing a math tooltip
     */
    protected hoverTimer: number = null;
    protected clearTimer: number = null;

    /*
     * clear the timers if any are active
     */
    public clearTimers() {
        if (this.clearTimer) {
            clearTimeout(this.clearTimer);
            this.clearTimer = null;
        }
        if (this.hoverTimer) {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
        }
    }

    /*
     * Handle a tooltip mousover event (start a timer to post the tooltip)
     *
     * @param{Event} event  The mouseover event
     */
    public tooltipOver(event: Event) {
        const delay = (this.constructor as typeof CHTMLmaction).postDelay;
        this.clearTimers();
        this.hoverTimer = setTimeout(((event:Event) => {
            const adaptor = this.adaptor;
            adaptor.setStyle(adaptor.lastChild(this.chtml) as N, 'display', 'block');
        }).bind(this), delay);
        event.stopPropagation();
    }

    /*
     * Handle a tooltip mousout event (start a timer to remove the tooltip)
     *
     * @param{Event} event  The mouseout event
     */
    public tooltipOut(event: Event) {
        const delay = (this.constructor as typeof CHTMLmaction).clearDelay;
        this.clearTimers();
        this.clearTimer = setTimeout(((event: Event) => {
            const adaptor = this.adaptor;
            adaptor.setStyle(adaptor.lastChild(this.chtml) as N, 'display', '');
        }).bind(this), delay);
        event.stopPropagation();
    }

    /*************************************************************/
    /*
     *  Handle statuline changes
     */

    /*
     * Cached document title (where the status is shown)
     */
    protected status: string = null;

    /*
     * Set the document title to the status value
     *
     * @param{Event} event  The mouseover event
     */
    public statusOver(event: Event) {
        if (this.status === null) {
            this.status = document.title;
            document.title = this.adaptor.getAttribute(this.chtml, 'statusline');
        }
        event.stopPropagation();
    }

    /*
     * Restore the document title to its original value
     *
     * @param{Event} event  The mouseout event
     */
    public statusOut(event: Event) {
        if (this.status) {
            document.title = this.status;
            this.status = null;
        }
        event.stopPropagation();
    }
}
