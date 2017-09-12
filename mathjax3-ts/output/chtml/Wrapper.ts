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
 * @fileoverview  Implements the CHTMLWrapper class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractWrapper} from '../../core/Tree/Wrapper.js';
import {Node, PropertyList} from '../../core/Tree/Node.js';
import {MmlNode, TextNode, AbstractMmlNode} from '../../core/MmlTree/MmlNode.js';
import {Property} from '../../core/Tree/Node.js';
import {OptionList} from '../../util/Options.js';
import {unicodeChars} from '../../util/string.js';
import * as LENGTHS from '../../util/lengths.js';
import {HTMLNodes} from '../../util/HTMLNodes.js';
import {CHTML} from '../chtml.js';
import {CHTMLWrapperFactory} from './WrapperFactory.js';
import {CHTMLmo} from './Wrappers/mo.js';
import {BBox, BBoxData} from './BBox.js';
import {FontData, DIRECTION} from './FontData.js';
import {StyleList} from './CssStyles.js';

/*****************************************************************/

/*
 * Shorthand for a dictionary object (an object of key:value pairs)
 */
export type StringMap = {[key: string]: string};

/*
 * Some standard sizes to use in predefind CSS properties
 */
export const FONTSIZE: StringMap = {
    '70.7%': 's',
    '70%': 's',
    '50%': 'ss',
    '60%': 'Tn',
    '85%': 'sm',
    '120%': 'lg',
    '144%': 'Lg',
    '173%': 'LG',
    '207%': 'hg',
    '249%': 'HG'
};

/*
 * Needed to access node.style[id] using variable id
 */
interface CSSStyle extends CSSStyleDeclaration {
    [id: string]: string | Function | number | CSSRule;
}

/*****************************************************************/
/*
 *  The base CHTMLWrapper class
 */

export class CHTMLWrapper extends AbstractWrapper<MmlNode, CHTMLWrapper> {

    public static kind: string = 'unknown';

    /*
     * If true, this causes a style for the node type to be generated automatically
     * that sets display:inline-block (as needed for the output for MmlNodes).
     */
    public static autoStyle = true;

    /*
     *  The default styles for CommonHTML
     */
    public static styles: StyleList = {
        'mjx-chtml [space="1"]': {'margin-left': '.167em'},
        'mjx-chtml [space="2"]': {'margin-left': '.222em'},
        'mjx-chtml [space="3"]': {'margin-left': '.278em'},

        'mjx-chtml [size="s"]' : {'font-size': '70.7%'},
        'mjx-chtml [size="ss"]': {'font-size': '50%'},
        'mjx-chtml [size="Tn"]': {'font-size': '60%'},
        'mjx-chtml [size="sm"]': {'font-size': '85%'},
        'mjx-chtml [size="lg"]': {'font-size': '120%'},
        'mjx-chtml [size="Lg"]': {'font-size': '144%'},
        'mjx-chtml [size="LG"]': {'font-size': '173%'},
        'mjx-chtml [size="hg"]': {'font-size': '207%'},
        'mjx-chtml [size="HG"]': {'font-size': '249%'},

        'mjx-box': {display: 'inline-block'},
        'mjx-block': {display: 'block'},
        'mjx-itable': {display: 'inline-table'},

        //
        //  These don't have Wrapper subclasses, so add their styles here
        //
        'mjx-mi': {display: 'inline-block'},
        'mjx-mn': {display: 'inline-block'},
        'mjx-mtext': {display: 'inline-block'},
        'mjx-merror': {
            display: 'inline-block',
            color: 'red',
            'background-color': 'yellow'
        },

        'mjx-mphantom': {visibility: 'hidden'},

        'mjx-math': {
            //
            //  There will be more here when the math wrapper is written
            //
            display: 'inline-block',
            'line-height': '0px'
        }

    };

    /*
     * Styles that should not be passed on from style attribute
     */
    public static removeStyles: [string] = [
        'fontSize', 'fontFamily', 'fontWeight',
        'fontStyle', 'fontVariant', 'font'
    ];

    /*
     * Non-MathML attributes on MathML elements NOT to be copied to the
     * corresponding CHTML elements.  If set to false, then the attribute
     * WILL be copied.  Most of these (like the font attributes) are handled
     * in other ways.
     */
    public static skipAttributes: {[name: string]: boolean} = {
        fontfamily: true, fontsize: true, fontweight: true, fontstyle: true,
        color: true, background: true,
        'class': true, href: true, style: true,
        xmlns: true
    };

    /*
     * The translation of mathvariant to bold or italic styles, or to remove
     * bold or italic from a mathvariant.
     */
    public static BOLDVARIANTS: {[name: string]: StringMap} =  {
        bold: {
            normal: 'bold',
            italic: 'bold-italic',
            fraktur: 'bold-fraktur',
            script: 'bold-script',
            'sans-serif': 'bold-sans-serif',
            'sans-serif-italic': 'sans-serif-bold-italic'
        },
        normal: {
            bold: 'normal',
            'bold-italic': 'italic',
            'bold-fraktur': 'fraktur',
            'bold-script': 'script',
            'bold-sans-serif': 'sans-serif',
            'sans-serif-bold-italic': 'sans-serif-italic'
        }
    };
    public static ITALICVARIANTS: {[name: string]: StringMap} = {
        italic: {
            normal: 'italic',
            bold: 'bold-italic',
            'sans-serif': 'sans-serif-italic',
            'bold-sans-serif': 'sans-serif-bold-italic'
        },
        normal: {
            italic: 'normal',
            'bold-italic': 'bold',
            'sans-serif-italic': 'sans-serif',
            'sans-serif-bold-italic': 'bold-sans-serif'
        }
    };

    /*
     * The factory used to create more CHTMLWrappers
     */
    protected factory: CHTMLWrapperFactory;

    /*
     * The parent and children of this node
     */
    public parent: CHTMLWrapper = null;
    public childNodes: CHTMLWrapper[];

    /*
     * The HTML element generated for this wrapped node
     */
    public chtml: HTMLElement = null;

    /*
     * Styles that must be handled directly by CHTML (mostly having to do with fonts)
     */
    protected removedStyles: StringMap = null;

    /*
     * The explicit styles set by the node
     */
    protected styles: CSSStyleDeclaration = null;

    /*
     * The mathvariant for this node
     */
    public variant: string = '';

    /*
     * The bounding box for this node, and whether it has been computed yet
     */
    public bbox: BBox;
    protected bboxComputed: boolean = false;

    /*
     * Direction this node can be stretched (null means not yet determined)
     */
    public stretch: DIRECTION = DIRECTION.None;

    /*
     * Easy access to the font parameters
     */
    public font: FontData = null;

    /*
     * Easy access to the CHTML output jax for this node
     */
    get CHTML() {
        return this.factory.chtml;
    }

    /*
     * Easy access to the metric data for this node
     */
    get metrics() {
        return this.factory.chtml.math.metrics;
    }

    /*******************************************************************/

    /*
     * @override
     */
    constructor(factory: CHTMLWrapperFactory, node: MmlNode, parent: CHTMLWrapper = null) {
        super(factory, node);
        this.parent = parent;
        this.font = factory.chtml.font;
        this.bbox = BBox.zero();
        this.getStyles();
        this.getVariant();
        this.getScale();
        this.getSpace();
        this.childNodes = node.childNodes.map((child: Node) => {
            return this.wrap(child as MmlNode);
        });
    }

    /*
     * @param{MmlNode} node  The node to the wrapped
     * @param{CHTMLWrapper} parent  The wrapped parent node
     * @return{CHTMLWrapper}  The newly wrapped node
     */
    public wrap(node: MmlNode, parent: CHTMLWrapper = null) {
        const wrapped = this.factory.wrap(node, parent || this);
        if (parent) {
            parent.childNodes.push(wrapped);
        }
        this.CHTML.nodeMap.set(node, wrapped);
        return wrapped;
    }

    /*******************************************************************/
    /*
     * Create the HTML for the wrapped node.
     *
     * @param{HTMLElement} parent  The HTML node where the output is added
     */
    public toCHTML(parent: HTMLElement) {
        let chtml = this.standardCHTMLnode(parent);
        for (const child of this.childNodes) {
            child.toCHTML(chtml);
        }
    }

    /*******************************************************************/
    /*
     * Return the wrapped node's bounding box, either the cached one, if it exists,
     *   or computed directly if not.
     *
     * @param{boolean} save  Whether to cache the bbox or not (used for stretchy elements)
     * @return{BBox}  The computed bounding box
     */
    public getBBox(save: boolean = true) {
        if (this.bboxComputed) {
            return this.bbox;
        }
        let bbox = this.computeBBox();
        if (save) {
            this.bbox = bbox;
            this.bboxComputed = true;
        }
        return bbox;
    }

    /*
     * @return{BBox}  The computed bounding box for the wrapped node
     */
    protected computeBBox() {
        const bbox = this.bbox.empty();
        for (const child of this.childNodes) {
            bbox.append(child.getBBox());
        }
        bbox.clean();
        return bbox;
    }

    /*******************************************************************/

    /*
     * Add the style attribute, but remove any font-related styles
     *   (since these are handled separately by the variant)
     */
    protected getStyles() {
        const styleString = this.node.attributes.getExplicit('style') as string;
        if (!styleString) return;
        this.styles = this.html('span').style;
        const style = this.styles as CSSStyle;
        style.cssText = styleString;
        for (let i = 0, m = CHTMLWrapper.removeStyles.length; i < m; i++) {
            const id = CHTMLWrapper.removeStyles[i];
            if (style[id]) {
                if (!this.removedStyles) this.removedStyles = {};
                this.removedStyles[id] = style[id] as string;
                style[id] = '';
            }
        }
    }

    /*
     * Get the mathvariant (or construct one, if needed).
     */
    protected getVariant() {
        if (!this.node.isToken) return;
        const attributes = this.node.attributes;
        let variant = attributes.get('mathvariant') as string;
        if (!attributes.getExplicit('mathvariant')) {
            const values = attributes.getList('fontfamily', 'fontweight', 'fontstyle') as StringMap;
            if (this.removedStyles) {
                const style = this.removedStyles;
                if (style.fontFamily) values.family = style.fontFamily;
                if (style.fontWeight) values.weight = style.fontWeight;
                if (style.fontStyle)  values.style  = style.fontStyle;
            }
            if (values.fontfamily) values.family = values.fontfamily;
            if (values.fontweight) values.weight = values.fontweight;
            if (values.fontstyle)  values.style  = values.fontstyle;
            if (values.weight && values.weight.match(/^\d+$/)) {
                values.weight = (parseInt(values.weight) > 600 ? 'bold' : 'normal');
            }
            if (values.family) {
                    variant = this.explicitVariant(values.family, values.weight, values.style);
            } else {
                if (this.node.getProperty('variantForm')) variant = '-TeX-variant';
                variant = (CHTMLWrapper.BOLDVARIANTS[values.weight] || {})[variant] || variant;
                variant = (CHTMLWrapper.ITALICVARIANTS[values.style] || {})[variant] || variant;
            }
        }
        this.variant = variant;
    }

    /*
     * Set the CSS for a token element having an explicit font (rather than regular mathvariant).
     *
     * @param{string} fontFamily  The font family to use
     * @param{string} fontWeight  The font weight to use
     * @param{string} fontStyle   The font style to use
     */
    protected explicitVariant(fontFamily: string, fontWeight: string, fontStyle: string) {
        let style = this.styles;
        if (!style) style = this.styles = this.html('span').style;
        style.fontFamily = fontFamily;
        if (fontWeight) style.fontWeight = fontWeight;
        if (fontStyle)  style.fontStyle = fontStyle;
        return '-explicitFont';
    }

    /*
     * Determine the scaling factor to use for this wrapped node, and set the styles for it.
     *
     * @return{number}   The scaling factor for this node
     */
    protected getScale() {
        let scale = 1, parent = this.parent;
        let pscale = (parent ? parent.bbox.scale : 1);
        let attributes = this.node.attributes;
        let scriptlevel = Math.min(attributes.get('scriptlevel') as number, 2);
        let fontsize = attributes.get('fontsize');
        let mathsize = (parent && !this.node.isToken ? parent : this).node.attributes.get('mathsize');
        //
        // If scriptsize is non-zero, set scale based on scriptsizemultiplier
        //
        if (scriptlevel !== 0) {
            scale = Math.pow(attributes.get('scriptsizemultiplier') as number, scriptlevel);
            let scriptminsize = this.length2em(attributes.get('scriptminsize'), .8, 1);
            if (scale < scriptminsize) scale = scriptminsize;
        }
        //
        // If there is style="font-size:...", and not fontsize attribute, use that as fontsize
        //
        if (this.removedStyles && this.removedStyles.fontSize && !fontsize) {
            fontsize = this.removedStyles.fontSize;
        }
        //
        // If there is a fontsize and no mathsize attribute, is that
        //
        if (fontsize && !mathsize) {
            mathsize = fontsize;
        }
        //
        //  Incorporate the mathsize, if any
        //
        if (mathsize !== '1') {
            scale *= this.length2em(mathsize, 1, 1);
        }
        //
        // For explicit font family, go back to the scaing of the surrounding text
        //
        if (this.variant === '-explicitFont') {
           scale /= this.metrics.scale;
        }
        //
        // Record the scaling factors and set the element's CSS
        //
        this.bbox.scale = scale;
        this.bbox.rscale = scale / pscale;
    }

    protected getSpace() {
        const space = this.node.texSpacing();
        if (space) {
            this.bbox.L = this.length2em(space);
        }
    }
    /*******************************************************************/

    /*
     * Create the standard CHTML element for the given wrapped node.
     *
     * @param{HTMLElement} parent  The HTML element in which the node is to be created
     * @returns{HTMLElement}  The root of the HTML tree for the wrapped node's output
     */
    protected standardCHTMLnode(parent: HTMLElement) {
        const chtml = this.createCHTMLnode(parent);
        this.handleStyles();
        this.handleVariant();
        this.handleScale();
        this.handleColor();
        this.handleSpace();
        this.handleAttributes();
        return chtml;
    }

    /*
     * @param{HTMLElement} parent  The HTML element in which the node is to be created
     * @returns{HTMLElement}  The root of the HTML tree for the wrapped node's output
     */
    protected createCHTMLnode(parent: HTMLElement) {
        const href = this.node.attributes.get('href');
        if (href) {
            parent = parent.appendChild(this.html('a', {href: href}));
        }
        this.chtml = parent.appendChild(this.html('mjx-' + this.node.kind));
        return this.chtml;
    }

    /*
     * Set the CSS styles for the chtml element
     */
    protected handleStyles() {
        if (!this.styles) return;
        const styles = this.styles.cssText;
        if (styles) {
            this.chtml.style.cssText = styles;
        }
    }

    /*
     * Set the CSS for the math variant
     */
    protected handleVariant() {
        if (this.node.isToken && this.variant !== '-explicitFont') {
            this.chtml.className = (this.font.getVariant(this.variant) || this.font.getVariant('normal')).classes;
        }
    }

    /*
     * Set the (relative) scaling factor for the node
     */
    protected handleScale() {
        this.setScale(this.chtml, this.bbox.rscale);
    }

    /*
     * @param{HTMLElement} chtml  The HTML node to scale
     * @param{number} rscale      The relatie scale to apply
     * @return{HTMLElement}       The HTML node (for chaining)
     */
    setScale(chtml: HTMLElement, rscale: number) {
        const scale = (Math.abs(rscale - 1) < .001 ? 1 : rscale);
        if (chtml && scale !== 1) {
            const size = this.percent(scale);
            if (FONTSIZE[size]) {
                chtml.setAttribute('size', FONTSIZE[size]);
            } else {
                chtml.style.fontSize = size;
            }
        }
        return chtml;
    }

    /*
     * Add the proper spacing according to the TeX rules
     *   FIXME:  still need to handle MathML spacing
     */
    protected handleSpace() {
        if (this.bbox.L) {
            this.chtml.setAttribute('space', (this.bbox.L * 18 - 2).toString());
        }
    }

    /*
     * Add the foreground and background colors
     * (Only look at explicit attributes, since inherited ones will
     *  be applied to a parent element, and we will inherit from that)
     */
    protected handleColor() {
        const attributes = this.node.attributes;
        const mathcolor = attributes.getExplicit('mathcolor') as string;
        const color = attributes.getExplicit('color') as string;
        const mathbackground = attributes.getExplicit('mathbackground') as string;
        const background = attributes.getExplicit('background') as string;
        if (mathcolor || color) {
            this.chtml.style.color = mathcolor || color;
        }
        if (mathbackground || background) {
            this.chtml.style.backgroundColor = mathbackground || background;
        }
    }

    /*
     * Copy RDFa, aria, and other tags from the MathML to the CHTML output nodes.
     * Don't copy those in the skipAttributes list, or anything that already exists
     * as a property of the node (e.g., no "onlick", etc.).  If a name in the
     * skipAttributes object is set to false, then the attribute WILL be copied.
     */
    protected handleAttributes() {
        const attributes = this.node.attributes;
        const defaults = attributes.getAllDefaults();
        const skip = CHTMLWrapper.skipAttributes;
        for (const name of attributes.getExplicitNames()) {
            if (skip[name] === false || (!(name in defaults) && !skip[name] &&
                                         typeof((this.chtml as {[name: string]: any})[name]) === 'undefined')) {
                this.chtml.setAttribute(name, attributes.getExplicit(name) as string);
            }
        }
        if (attributes.get('class')) {
            this.chtml.classList.add(attributes.get('class') as string);
        }
    }

    /*******************************************************************/

    /*
     * @return{CHTMLWrapper}  The wrapper for this node's core node
     */
    public core() {
        return this.CHTML.nodeMap.get(this.node.core());
    }

    /*
     * @return{CHTMLWrapper}  The wrapper for this node's core <mo> node
     */
    public coreMO(): CHTMLmo {
        return this.CHTML.nodeMap.get(this.node.coreMO()) as CHTMLmo;
    }

    /*
     * @return{string}  For a token node, the combined text content of the node's children
     */
    public getText() {
        let text = '';
        if (this.node.isToken) {
            for (const child of this.node.childNodes) {
                if (child instanceof TextNode) {
                    text += child.getText();
                }
            }
        }
        return text;
    }

    /*
     * @param{DIRECTION} direction  The direction to stretch this node
     * @return{boolean}             Whether the node can stretch in that direction
     */
    public canStretch(direction: DIRECTION): boolean {
        this.stretch = DIRECTION.None;
        if (this.node.isEmbellished) {
            let core = this.core();
            if (core && core.node !== this.node) {
                if (core.canStretch(direction)) {
                    this.stretch = direction;
                }
            }
        }
        return this.stretch !== DIRECTION.None;
    }

    /*******************************************************************/
    /*
     * For debugging
     */

    public drawBBox() {
        const bbox = this.getBBox();
        const box = this.html('mjx-box', {style: {
            opacity: .25, 'margin-left': this.em(-bbox.w-bbox.R)
        }}, [
            this.html('mjx-box', {style: {
                height: this.em(bbox.h),
                width: this.em(bbox.w),
                'background-color': 'red'
            }}),
            this.html('mjx-box', {style: {
                height: this.em(bbox.d),
                width: this.em(bbox.w),
                'margin-left': this.em(-bbox.w),
                'vertical-align': this.em(-bbox.d),
                'background-color': 'green'
            }})
        ]);
        const node = this.chtml || this.parent.chtml;
        node.parentNode.appendChild(box);
        node.style.backgroundColor = '#FFEE00';
    }

    /*******************************************************************/
    /*
     * Easy access to some utility routines
     */

    /*
     * @param{number} m  A number to be shown as a percent
     * @return{string}  The number m as a percent
     */
    protected percent(m: number) {
        return LENGTHS.percent(m);
    }

    /*
     * @param{number} m  A number to be shown in ems
     * @return{string}  The number with units of ems
     */
    protected em(m: number) {
        return LENGTHS.em(m);
    }

    /*
     * @param{number} m   A number of em's to be shown as pixels
     * @param{number} M   The minimum number of pixels to allow
     * @return{string}  The number with units of px
     */
    protected px(m: number, M: number = -LENGTHS.BIGDIMEN) {
        return LENGTHS.px(m, M, this.metrics.em);
    }

    /*
     * @param{Property} length  A dimension (giving number and units) or number to be converted to ems
     * @param{number} size  The default size of the dimension (for percentage values)
     * @param{number} scale  The current scaling factor (to handle absolute units)
     * @return{number}  The dimension converted to ems
     */
    protected length2em(length: Property, size: number = 1, scale: number = null) {
        if (scale === null) {
            scale = this.bbox.scale;
        }
        return LENGTHS.length2em(length as string, size, scale, this.metrics.em);
    }

    /*
     * @param{string} text  The text to turn into unicode locations
     * @return{number[]}  Array of numbers represeting the string's unicode character positions
     */
    protected unicodeChars(text: string) {
        return unicodeChars(text);
    }

    /*
     * @param{number} n  A unicode code point to be converted to a character reference for use with the
     *                   CSS rules for fonts (either a literal character for most ASCII values, or \nnnn
     *                   for higher values, or for the double quote and backslash characters).
     * @return{string}  The character as a properly encoded string.
     */
    protected char(n: number, escape: boolean = false) {
        return this.font.char(n, escape);
    }

    /*
     * @param{string} type  The tag name of the HTML node to be created
     * @param{OptionList} def  The properties to set for the created node
     * @param{HTMLElement[]} content  The child nodes for the created HTML node
     * @return{HTMLElement}   The generated HTML tree
     */
    public html(type: string, def: OptionList = {}, content: HTMLElement[] = []) {
        return this.factory.chtml.html(type, def, content);
    }

    /*
     * @param{string} text  The text from which to create an HTML text node
     * @return{HTMLElement}  The generated text node with the given text
     */
    public text(text: string) {
        return this.factory.chtml.text(text);
    }

    /*
     * @param{string} text  The text from which to create a TextNode object
     * @return{CHTMLTextNode}  The TextNode with the given text
     */
    public mmlText(text: string) {
        return ((this.node as AbstractMmlNode).factory.create('text') as TextNode).setText(text);
    }

    /*
     * @param{string} kind  The kind of MmlNode to create
     * @paramProperyList} properties  The properties to set initially
     * @param{MmlNode[]} children  The child nodes to add to the created node
     * @return{MmlNode}  The newly created MmlNode
     */
    public mmlNode(kind: string, properties: PropertyList = {}, children: MmlNode[] = []) {
        return (this.node as AbstractMmlNode).factory.create(kind, properties, children);
    }

}

/*
 *  The type of the CHTMLWrapper class (used when creating the wrapper factory for this class)
 */
export type CHTMLWrapperClass = typeof CHTMLWrapper;
