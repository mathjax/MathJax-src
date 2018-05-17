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
import {HTMLMathItem} from '../../../handlers/html/HTMLMathItem.js';
import {HTMLDocument} from '../../../handlers/html/HTMLDocument.js';
import {Property} from '../../../core/Tree/Node.js';
import {StyleList} from '../CssStyles.js';

/*****************************************************************/

/*
 * The types needed to define the actiontypes
 */
export type ActionData = {[name: string]: any};
export type ActionHandler<N, T, D> = (node: CHTMLmaction<N, T, D>, data?: ActionData) => void;
export type ActionMap = Map<string, ActionHandler<any, any, any>>;
export type ActionPair = [string, [ActionHandler<any, any, any>, ActionData]];

export type EventHandler = (event: Event) => void;

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
        ['toggle', [(node, data) => {
            //
            // Mark which child is selected
            //
            node.adaptor.setAttribute(node.chtml, 'toggle', node.node.attributes.get('selection') as string);
            //
            // Cache the data needed to select another node
            //
            const math = node.factory.chtml.math;
            const document = node.factory.chtml.document;
            const mml = node.node as MmlMaction;
            //
            // Add a click handler that changes the selection and rerenders the expression
            //
            node.setEventHandler('click', (event: Event) => {
                if (!math.start.node) {
                    //
                    // If the MathItem was created by hand, it might not have a node
                    // telling it where to replace the existing math, so set it.
                    //
                    math.start.node = math.end.node = math.typesetRoot;
                    math.start.n = math.end.n = 0;
                }
                mml.nextToggleSelection();
                math.rerender(document);
                event.stopPropagation();
            });
        }, {}]],

        ['tooltip', [(node, data) => {
            const tip = node.childNodes[1];
            if (!tip) return;
            if (tip.node.isKind('mtext')) {
                //
                // Text tooltips are handled through title attributes
                //
                const text = (tip.node as TextNode).getText();
                node.adaptor.setAttribute(node.chtml, 'title', text);
            } else {
                //
                // Math tooltips are handled through hidden nodes and event handlers
                //
                const adaptor = node.adaptor;
                const tool = adaptor.append(node.chtml, node.html('mjx-tool', {}, [node.html('mjx-tip')]));
                tip.toCHTML(adaptor.firstChild(tool));
                //
                // Set up the event handlers to display and remove the tooltip
                //
                node.setEventHandler('mouseover', (event: Event) => {
                    data.stopTimers(data);
                    data.hoverTimer = setTimeout(() => adaptor.setStyle(tool, 'display', 'block'), data.postDelay);
                    event.stopPropagation();
                });
                node.setEventHandler('mouseout',  (event: Event) => {
                    data.stopTimers(data);
                    data.clearTimer = setTimeout(() => adaptor.setStyle(tool, 'display', ''), data.clearDelay);
                    event.stopPropagation();
                });
            }
        }, {
            postDelay: 600,      // milliseconds before tooltip posts
            clearDelay: 100,     // milliseconds before tooltip is removed

            hoverTimer: null,    // timer for posting tooltips
            clearTimer: null,    // timer for removing tooltips

            /*
             * clear the timers if any are active
             */
            stopTimers: (data: ActionData) => {
                if (data.clearTimer) {
                    clearTimeout(data.clearTimer);
                    data.clearTimer = null;
                }
                if (data.hoverTimer) {
                    clearTimeout(data.hoverTimer);
                    data.hoverTimer = null;
                }
            }
        }]],

        ['statusline', [(node, data) => {
            const tip = node.childNodes[1];
            if (!tip) return;
            if (tip.node.isKind('mtext')) {
                const adaptor = node.adaptor;
                const text = (tip.node as TextNode).getText();
                adaptor.setAttribute(node.chtml, 'statusline', text);
                //
                // Set up event handlers to change the document title
                //
                node.setEventHandler('mouseover', (event: Event) => {
                    if (data.status === null) {
                        data.status = adaptor.getStatus(adaptor.document);
                        adaptor.setStatus(adaptor.document, text);
                    }
                    event.stopPropagation();
                });
                node.setEventHandler('mouseout', (event: Event) => {
                    if (data.status) {
                        adaptor.setStatus(adaptor.document, data.status);
                        data.status = null;
                    }
                    event.stopPropagation();
                });
            }
        }, {
            status: null  // cached status line
        }]]

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
    protected data: ActionData = null;

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
        const [handler, data] = Actions.get(action) || [((node, data) => {}) as ActionHandler<N, T, D>, {}];
        this.action = handler;
        this.data = data;
    }

    /*
     * @override
     */
    public toCHTML(parent: N) {
        const chtml = this.standardCHTMLnode(parent);
        const child = this.selected;
        child.toCHTML(chtml);
        this.action(this, this.data);
    }

    /*
     * @override
     */
    public computeBBox(bbox: BBox) {
        bbox.updateFrom(this.selected.getBBox());
    }

    /*
     * Add an event handler to the output for this maction
     */
    public setEventHandler(type: string, handler: EventHandler) {
        (this.chtml as any).addEventListener(type, handler);
    }

}
