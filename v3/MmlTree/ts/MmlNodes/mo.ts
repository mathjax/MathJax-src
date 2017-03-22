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
 * @fileoverview  Implements the MmlMo node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../Node.js';
import {AMmlTokenNode, MmlNode, IMmlNode, AttributeList, TEXCLASS} from '../MmlNode.js';
import {MmlMrow} from './mrow.js';

/*
 * Types needed for the operator dictionary
 */
export type OperatorDef = [number, number, number, PropertyList];
export type OperatorList = {[name: string]: OperatorDef};
export type RangeDef = [number, number, number, string];

export function OPDEF(lspace: number, rspace: number, texClass: number, properties: PropertyList = null): OperatorDef {
    return [lspace, rspace, texClass, properties] as OperatorDef;
}

/*
 *  The various kinds of operators in the dictionary
 */
export let MO = {
    ORD:        OPDEF(0, 0, TEXCLASS.ORD),
    ORD11:      OPDEF(1, 1, TEXCLASS.ORD),
    ORD21:      OPDEF(2, 1, TEXCLASS.ORD),
    ORD02:      OPDEF(0, 2, TEXCLASS.ORD),
    ORD55:      OPDEF(5, 5, TEXCLASS.ORD),
    OP:         OPDEF(1, 2, TEXCLASS.OP, {largeop: true, movablelimits: true, symmetric: true}),
    OPFIXED:    OPDEF(1, 2, TEXCLASS.OP, {largeop: true, movablelimits: true}),
    INTEGRAL:   OPDEF(0, 1, TEXCLASS.OP, {largeop: true, symmetric: true}),
    INTEGRAL2:  OPDEF(1, 2, TEXCLASS.OP, {largeop: true, symmetric: true}),
    BIN3:       OPDEF(3, 3, TEXCLASS.BIN),
    BIN4:       OPDEF(4, 4, TEXCLASS.BIN),
    BIN01:      OPDEF(0, 1, TEXCLASS.BIN),
    BIN5:       OPDEF(5, 5, TEXCLASS.BIN),
    TALLBIN:    OPDEF(4, 4, TEXCLASS.BIN, {stretchy: true}),
    BINOP:      OPDEF(4, 4, TEXCLASS.BIN, {largeop: true, movablelimits: true}),
    REL:        OPDEF(5, 5, TEXCLASS.REL),
    REL1:       OPDEF(1, 1, TEXCLASS.REL, {stretchy: true}),
    REL4:       OPDEF(4, 4, TEXCLASS.REL),
    RELSTRETCH: OPDEF(5, 5, TEXCLASS.REL, {stretchy: true}),
    RELACCENT:  OPDEF(5, 5, TEXCLASS.REL, {accent: true}),
    WIDEREL:    OPDEF(5, 5, TEXCLASS.REL, {accent: true, stretchy: true}),
    OPEN:       OPDEF(0, 0, TEXCLASS.OPEN, {fence: true, stretchy: true, symmetric: true}),
    CLOSE:      OPDEF(0, 0, TEXCLASS.CLOSE, {fence: true, stretchy: true, symmetric: true}),
    INNER:      OPDEF(0, 0, TEXCLASS.INNER),
    PUNCT:      OPDEF(0, 3, TEXCLASS.PUNCT),
    ACCENT:     OPDEF(0, 0, TEXCLASS.ORD, {accent: true}),
    WIDEACCENT: OPDEF(0, 0, TEXCLASS.ORD, {accent: true, stretchy: true})
};

/*****************************************************************/
/*
 *  Implements the MmlMo node class (subclass of AMmlTokenNode)
 */

export class MmlMo extends AMmlTokenNode {
    public static defaults: PropertyList = {
        ...AMmlTokenNode.defaults,
        form: 'infix',
        fence: false,
        separator: false,
        lspace: 'thickmathspace',
        rspace: 'thickmathspace',
        stretchy: false,
        symmetric: false,
        maxsize: 'infinity',
        minsize: '0em', // MathML says '1em', but that is larger than some natural sizes
        largeop: false,
        movablelimits: false,
        accent: false,
        linebreak: 'auto',
        lineleading: '1ex',
        linebreakstyle: 'before',
        indentalign: 'auto',
        indentshift: '0',
        indenttarget: '',
        indentalignfirst: 'indentalign',
        indentshiftfirst: 'indentshift',
        indentalignlast: 'indentalign',
        indentshiftlast: 'indentshift'
    };

    /*
     *  The sizes of the various lspace and rspace values in the operator table
     */
    public static SPACE = [
        '0em',
        '0.1111em',
        '0.1667em',
        '0.2222em',
        '0.2667em',
        '0.3333em'
    ];

    /*
     * Unicode ranges and their default TeX classes
     */
    public static RANGES: RangeDef[] = [
        [0x20, 0x7F, TEXCLASS.REL, 'BasicLatin'],
        [0xA0, 0xFF, TEXCLASS.ORD, 'Latin1Supplement'],
        [0x100, 0x17F, TEXCLASS.ORD, 'LatinExtendedA'],
        [0x180, 0x24F, TEXCLASS.ORD, 'LatinExtendedB'],
        [0x2B0, 0x2FF, TEXCLASS.ORD, 'SpacingModLetters'],
        [0x300, 0x36F, TEXCLASS.ORD, 'CombDiacritMarks'],
        [0x370, 0x3FF, TEXCLASS.ORD, 'GreekAndCoptic'],
        [0x1E00, 0x1EFF, TEXCLASS.ORD, 'LatinExtendedAdditional'],
        [0x2000, 0x206F, TEXCLASS.PUNCT, 'GeneralPunctuation'],
        [0x2070, 0x209F, TEXCLASS.ORD, 'SuperAndSubscripts'],
        [0x20A0, 0x20CF, TEXCLASS.ORD, 'Currency'],
        [0x20D0, 0x20FF, TEXCLASS.ORD, 'CombDiactForSymbols'],
        [0x2100, 0x214F, TEXCLASS.ORD, 'LetterlikeSymbols'],
        [0x2150, 0x218F, TEXCLASS.ORD, 'NumberForms'],
        [0x2190, 0x21FF, TEXCLASS.REL, 'Arrows'],
        [0x2200, 0x22FF, TEXCLASS.BIN, 'MathOperators'],
        [0x2300, 0x23FF, TEXCLASS.ORD, 'MiscTechnical'],
        [0x2460, 0x24FF, TEXCLASS.ORD, 'EnclosedAlphaNums'],
        [0x2500, 0x259F, TEXCLASS.ORD, 'BoxDrawing'],
        [0x25A0, 0x25FF, TEXCLASS.ORD, 'GeometricShapes'],
        [0x2700, 0x27BF, TEXCLASS.ORD, 'Dingbats'],
        [0x27C0, 0x27EF, TEXCLASS.ORD, 'MiscMathSymbolsA'],
        [0x27F0, 0x27FF, TEXCLASS.REL, 'SupplementalArrowsA'],
        [0x2900, 0x297F, TEXCLASS.REL, 'SupplementalArrowsB'],
        [0x2980, 0x29FF, TEXCLASS.ORD, 'MiscMathSymbolsB'],
        [0x2A00, 0x2AFF, TEXCLASS.BIN, 'SuppMathOperators'],
        [0x2B00, 0x2BFF, TEXCLASS.ORD, 'MiscSymbolsAndArrows'],
        [0x1D400, 0x1D7FF, TEXCLASS.ORD, 'MathAlphabets']
    ];

    /*
     * The (minimal) Operator Dictionary.  Currently this only include the basics.
     */
    public static OPTABLE: {[form: string]: OperatorList} = {
        prefix: {
            '\u2200': MO.ORD21,    // for all
            '\u2202': MO.ORD21,    // partial differential
            '\u2203': MO.ORD21,    // there exists
            '\u2207': MO.ORD21,    // nabla
            '\u220F': MO.OP,       // n-ary product
            '\u2210': MO.OP,       // n-ary coproduct
            '\u2211': MO.OP,       // n-ary summation
            '\u2212': MO.BIN01,    // minus sign
            '\u2213': MO.BIN01,    // minus-or-plus sign
            '\u221A': [1, 1, TEXCLASS.ORD, {stretchy: true}], // square root
            '\u2220': MO.ORD,      // angle
            '\u222B': MO.INTEGRAL, // integral
            '\u222E': MO.INTEGRAL, // contour integral
            '\u22C0': MO.OP,       // n-ary logical and
            '\u22C1': MO.OP,       // n-ary logical or
            '\u22C2': MO.OP,       // n-ary intersection
            '\u22C3': MO.OP,       // n-ary union
            '\u2308': MO.OPEN,     // left ceiling
            '\u230A': MO.OPEN,     // left floor
            '\u27E8': MO.OPEN,     // mathematical left angle bracket
            '\u27EE': MO.OPEN,     // mathematical left flattened parenthesis
            '\u2A00': MO.OP,       // n-ary circled dot operator
            '\u2A01': MO.OP,       // n-ary circled plus operator
            '\u2A02': MO.OP,       // n-ary circled times operator
            '\u2A04': MO.OP,       // n-ary union operator with plus
            '\u2A06': MO.OP,       // n-ary square union operator
            '\u00AC': MO.ORD21,    // not sign
            '\u00B1': MO.BIN01,    // plus-minus sign
            '(': MO.OPEN,          // left parenthesis
            '+': MO.BIN01,         // plus sign
            '-': MO.BIN01,         // hyphen-minus
            '[': MO.OPEN,          // left square bracket
            '{': MO.OPEN,          // left curly bracket
            '|': MO.OPEN           // vertical line
        },
        postfix: {
            '!': [1, 0, TEXCLASS.CLOSE, null], // exclamation mark
            '&': MO.ORD,             // ampersand
            '\u2032': MO.ORD02,      // prime
            '\u203E': MO.WIDEACCENT, // overline
            '\u2309': MO.CLOSE,      // right ceiling
            '\u230B': MO.CLOSE,      // right floor
            '\u23DE': MO.WIDEACCENT, // top curly bracket
            '\u23DF': MO.WIDEACCENT, // bottom curly bracket
            '\u266D': MO.ORD02,      // music flat sign
            '\u266E': MO.ORD02,      // music natural sign
            '\u266F': MO.ORD02,      // music sharp sign
            '\u27E9': MO.CLOSE,      // mathematical right angle bracket
            '\u27EF': MO.CLOSE,      // mathematical right flattened parenthesis
            '\u02C6': MO.WIDEACCENT, // modifier letter circumflex accent
            '\u02C7': MO.WIDEACCENT, // caron
            '\u02C9': MO.WIDEACCENT, // modifier letter macron
            '\u02CA': MO.ACCENT,     // modifier letter acute accent
            '\u02CB': MO.ACCENT,     // modifier letter grave accent
            '\u02D8': MO.ACCENT,     // breve
            '\u02D9': MO.ACCENT,     // dot above
            '\u02DC': MO.WIDEACCENT, // small tilde
            '\u0302': MO.WIDEACCENT, // combining circumflex accent
            '\u00A8': MO.ACCENT,     // diaeresis
            '\u00AF': MO.WIDEACCENT, // macron
            ')': MO.CLOSE,           // right parenthesis
            ']': MO.CLOSE,           // right square bracket
            '^': MO.WIDEACCENT,      // circumflex accent
            '_': MO.WIDEACCENT,      // low line
            '`': MO.ACCENT,          // grave accent
            '|': MO.CLOSE,           // vertical line
            '}': MO.CLOSE,           // right curly bracket
            '~': MO.WIDEACCENT       // tilde
        },
        infix: {
            '': MO.ORD,              // empty <mo>
            '%': [3, 3, TEXCLASS.ORD, null], // percent sign
            '\u2022': MO.BIN4,       // bullet
            '\u2026': MO.INNER,      // horizontal ellipsis
            '\u2044': MO.TALLBIN,    // fraction slash
            '\u2061': MO.ORD,        // function application
            '\u2062': MO.ORD,        // invisible times
            '\u2063': [0, 0, TEXCLASS.ORD, {linebreakstyle: 'after', separator: true}], // invisible separator
            '\u2064': MO.ORD,        // invisible plus
            '\u2190': MO.WIDEREL,    // leftwards arrow
            '\u2191': MO.RELSTRETCH, // upwards arrow
            '\u2192': MO.WIDEREL,    // rightwards arrow
            '\u2193': MO.RELSTRETCH, // downwards arrow
            '\u2194': MO.WIDEREL,    // left right arrow
            '\u2195': MO.RELSTRETCH, // up down arrow
            '\u2196': MO.RELSTRETCH, // north west arrow
            '\u2197': MO.RELSTRETCH, // north east arrow
            '\u2198': MO.RELSTRETCH, // south east arrow
            '\u2199': MO.RELSTRETCH, // south west arrow
            '\u21A6': MO.WIDEREL,    // rightwards arrow from bar
            '\u21A9': MO.WIDEREL,    // leftwards arrow with hook
            '\u21AA': MO.WIDEREL,    // rightwards arrow with hook
            '\u21BC': MO.WIDEREL,    // leftwards harpoon with barb upwards
            '\u21BD': MO.WIDEREL,    // leftwards harpoon with barb downwards
            '\u21C0': MO.WIDEREL,    // rightwards harpoon with barb upwards
            '\u21C1': MO.WIDEREL,    // rightwards harpoon with barb downwards
            '\u21CC': MO.WIDEREL,    // rightwards harpoon over leftwards harpoon
            '\u21D0': MO.WIDEREL,    // leftwards double arrow
            '\u21D1': MO.RELSTRETCH, // upwards double arrow
            '\u21D2': MO.WIDEREL,    // rightwards double arrow
            '\u21D3': MO.RELSTRETCH, // downwards double arrow
            '\u21D4': MO.WIDEREL,    // left right double arrow
            '\u21D5': MO.RELSTRETCH, // up down double arrow
            '\u2208': MO.REL,        // element of
            '\u2209': MO.REL,        // not an element of
            '\u220B': MO.REL,        // contains as member
            '\u2212': MO.BIN4,       // minus sign
            '\u2213': MO.BIN4,       // minus-or-plus sign
            '\u2215': MO.TALLBIN,    // division slash
            '\u2216': MO.BIN4,       // set minus
            '\u2217': MO.BIN4,       // asterisk operator
            '\u2218': MO.BIN4,       // ring operator
            '\u2219': MO.BIN4,       // bullet operator
            '\u221D': MO.REL,        // proportional to
            '\u2223': MO.REL,        // divides
            '\u2225': MO.REL,        // parallel to
            '\u2227': MO.BIN4,       // logical and
            '\u2228': MO.BIN4,       // logical or
            '\u2229': MO.BIN4,       // intersection
            '\u222A': MO.BIN4,       // union
            '\u223C': MO.REL,        // tilde operator
            '\u2240': MO.BIN4,       // wreath product
            '\u2243': MO.REL,        // asymptotically equal to
            '\u2245': MO.REL,        // approximately equal to
            '\u2248': MO.REL,        // almost equal to
            '\u224D': MO.REL,        // equivalent to
            '\u2250': MO.REL,        // approaches the limit
            '\u2260': MO.REL,        // not equal to
            '\u2261': MO.REL,        // identical to
            '\u2264': MO.REL,        // less-than or equal to
            '\u2265': MO.REL,        // greater-than or equal to
            '\u226A': MO.REL,        // much less-than
            '\u226B': MO.REL,        // much greater-than
            '\u227A': MO.REL,        // precedes
            '\u227B': MO.REL,        // succeeds
            '\u2282': MO.REL,        // subset of
            '\u2283': MO.REL,        // superset of
            '\u2286': MO.REL,        // subset of or equal to
            '\u2287': MO.REL,        // superset of or equal to
            '\u228E': MO.BIN4,       // multiset union
            '\u2291': MO.REL,        // square image of or equal to
            '\u2292': MO.REL,        // square original of or equal to
            '\u2293': MO.BIN4,       // square cap
            '\u2294': MO.BIN4,       // square cup
            '\u2295': MO.BIN4,       // circled plus
            '\u2296': MO.BIN4,       // circled minus
            '\u2297': MO.BIN4,       // circled times
            '\u2298': MO.BIN4,       // circled division slash
            '\u2299': MO.BIN4,       // circled dot operator
            '\u22A2': MO.REL,        // right tack
            '\u22A3': MO.REL,        // left tack
            '\u22A4': MO.ORD55,      // down tack
            '\u22A5': MO.REL,        // up tack
            '\u22A8': MO.REL,        // true
            '\u22C4': MO.BIN4,       // diamond operator
            '\u22C5': MO.BIN4,       // dot operator
            '\u22C6': MO.BIN4,       // star operator
            '\u22C8': MO.REL,        // bowtie
            '\u22EE': MO.ORD55,      // vertical ellipsis
            '\u22EF': MO.INNER,      // midline horizontal ellipsis
            '\u22F1': [5, 5, TEXCLASS.INNER, null], // down right diagonal ellipsis
            '\u25B3': MO.BIN4,       // white up-pointing triangle
            '\u25B5': MO.BIN4,       // white up-pointing small triangle
            '\u25B9': MO.BIN4,       // white right-pointing small triangle
            '\u25BD': MO.BIN4,       // white down-pointing triangle
            '\u25BF': MO.BIN4,       // white down-pointing small triangle
            '\u25C3': MO.BIN4,       // white left-pointing small triangle
            '\u2758': MO.REL,        // light vertical bar
            '\u27F5': MO.WIDEREL,    // long leftwards arrow
            '\u27F6': MO.WIDEREL,    // long rightwards arrow
            '\u27F7': MO.WIDEREL,    // long left right arrow
            '\u27F8': MO.WIDEREL,    // long leftwards double arrow
            '\u27F9': MO.WIDEREL,    // long rightwards double arrow
            '\u27FA': MO.WIDEREL,    // long left right double arrow
            '\u27FC': MO.WIDEREL,    // long rightwards arrow from bar
            '\u2A2F': MO.BIN4,       // vector or cross product
            '\u2A3F': MO.BIN4,       // amalgamation or coproduct
            '\u2AAF': MO.REL,        // precedes above single-line equals sign
            '\u2AB0': MO.REL,        // succeeds above single-line equals sign
            '\u00B1': MO.BIN4,       // plus-minus sign
            '\u00B7': MO.BIN4,       // middle dot
            '\u00D7': MO.BIN4,       // multiplication sign
            '\u00F7': MO.BIN4,       // division sign
            '*': MO.BIN3,            // asterisk
            '+': MO.BIN4,            // plus sign
            ',': [0, 3, TEXCLASS.PUNCT, {linebreakstyle: 'after', separator: true}], // comma
            '-': MO.BIN4,            // hyphen-minus
            '/': MO.ORD11,           // solidus
            ':': [1, 2, TEXCLASS.REL, null], // colon
            ';': [0, 3, TEXCLASS.PUNCT, {linebreakstyle: 'after', separator: true}], // semicolon
            '<': MO.REL,             // less-than sign
            '=': MO.REL,             // equals sign
            '>': MO.REL,             // greater-than sign
            '?': [1, 1, TEXCLASS.CLOSE, null], // question mark
            '\\': MO.ORD,            // reverse solidus
            '^': MO.ORD11,           // circumflex accent
            '_': MO.ORD11,           // low line
            '|': [2, 2, TEXCLASS.ORD, {fence: true, stretchy: true, symmetric: true}], // vertical line
            '#': MO.ORD,             // #
            '$': MO.ORD,             // $
            '.': [0, 3, TEXCLASS.PUNCT, {separator: true}], // \ldotp
            '\u02B9': MO.ORD,        // prime
            '\u0300': MO.ACCENT,     // \grave
            '\u0301': MO.ACCENT,     // \acute
            '\u0303': MO.WIDEACCENT,   // \tilde
            '\u0304': MO.ACCENT,     // \bar
            '\u0306': MO.ACCENT,     // \breve
            '\u0307': MO.ACCENT,     // \dot
            '\u0308': MO.ACCENT,     // \ddot
            '\u030C': MO.ACCENT,     // \check
            '\u0332': MO.WIDEACCENT, // horizontal line
            '\u0338': MO.REL4,       // \not
            '\u2015': [0, 0, TEXCLASS.ORD, {stretchy: true}], // horizontal line
            '\u2017': [0, 0, TEXCLASS.ORD, {stretchy: true}], // horizontal line
            '\u2020': MO.BIN3,       // \dagger
            '\u2021': MO.BIN3,       // \ddagger
            '\u20D7': MO.ACCENT,     // \vec
            '\u2111': MO.ORD,        // \Im
            '\u2113': MO.ORD,        // \ell
            '\u2118': MO.ORD,        // \wp
            '\u211C': MO.ORD,        // \Re
            '\u2205': MO.ORD,        // \emptyset
            '\u221E': MO.ORD,        // \infty
            '\u2305': MO.BIN3,       // barwedge
            '\u2306': MO.BIN3,       // doublebarwedge
            '\u2322': MO.REL4,       // \frown
            '\u2323': MO.REL4,       // \smile
            '\u2329': MO.OPEN,       // langle
            '\u232A': MO.CLOSE,      // rangle
            '\u23AA': MO.ORD,        // \bracevert
            '\u23AF': [0, 0, TEXCLASS.ORD, {stretchy: true}], // \underline
            '\u23B0': MO.OPEN,       // \lmoustache
            '\u23B1': MO.CLOSE,      // \rmoustache
            '\u2500': MO.ORD,        // horizontal line
            '\u25EF': MO.BIN3,       // \bigcirc
            '\u2660': MO.ORD,        // \spadesuit
            '\u2661': MO.ORD,        // \heartsuit
            '\u2662': MO.ORD,        // \diamondsuit
            '\u2663': MO.ORD,        // \clubsuit
            '\u3008': MO.OPEN,       // langle
            '\u3009': MO.CLOSE,      // rangle
            '\uFE37': MO.WIDEACCENT, // horizontal brace down
            '\uFE38': MO.WIDEACCENT  // horizontal brace up
        }
    };

    public texClass = TEXCLASS.REL;  // for MathML, but TeX sets it explicitly in setTeXclass()

    /*
     * @return {string}  The mo kind
     */
    public get kind() {
        return 'mo';
    }

    /*
     * @return {boolean}  All <mo> are considered embellished
     */
    public get isEmbellished() {
        return true;
    }

    /*
     * @return {boolean}  Is <mo> marked as an explicit linebreak?
     */
    public get hasNewLine() {
        return this.attributes.get('linebreak') === 'newline';
    }

    /*
     * @return {MmlNode}  The node that is the outermost embellished operator
     *                    with this node as its core
     */
    public coreParent() {
        let parent: MmlNode = this;
        let math = this.factory.getNodeClass('math');
        while (parent && parent.isEmbellished && parent.coreMO() === this && !(parent instanceof math)) {
            parent = (parent as MmlNode).Parent;
        }
        return parent;
    }

    /*
     * @param {MmlNode} parent  The node whose core text is to be obtained
     * @return {string}         The text of the core MO of the given parent element
     */
    public coreText(parent: MmlNode) {
        if (!parent) {
            return '';
        }
        if (parent.isEmbellished) {
            return (parent.coreMO() as MmlMo).getText();
        }
        while ((((parent.isKind('mrow') || parent.isKind('TeXAtom') || parent.isKind('mstyle') ||
                  parent.isKind('mphantom')) && parent.childNodes.length === 1) ||
                parent.isKind('munderover')) && parent.childNodes[0]) {
            parent = parent.childNodes[0] as MmlNode;
        }
        return (parent.isToken ? (parent as AMmlTokenNode).getText() : '');
    }

    /*
     * Produce the texClass based on the operator dictionary values
     *
     * @override
     */
    public setTeXclass(prev: MmlNode) {
        let {form, lspace, rspace, fence} = this.attributes.getList('form', 'lspace', 'rspace', 'fence') as
                                             {form: string, lspace: string, rspace: string, fence: string};
        // if (this.useMMLspacing) {this.texClass = TEXCLASS.NONE; return this}
        if (fence && this.texClass === TEXCLASS.REL) {
            if (form === 'prefix') {
                this.texClass = TEXCLASS.OPEN;
            }
            if (form === 'postfix') {
                this.texClass = TEXCLASS.CLOSE;
            }
        }
        if (this.getText() === '\u2061') {
            //
            //  Force previous node to be TEXCLASS.OP and skip this node
            //
            if (prev) {
                prev.texClass = TEXCLASS.OP;
                prev.setProperty('fnOP', true);
            }
            this.texClass = this.prevClass = TEXCLASS.NONE;
            return prev;
        }
        return this.adjustTeXclass(prev);
    }
    /*
     * Follow the TeXBook rules for adjusting the TeX class once its neighbors are known
     *
     * @param {MmlNode} prev  The node appearing before this one in the output
     * @return {MmlNode}      The last node displayed (this node)
     */
    public adjustTeXclass(prev: MmlNode): MmlNode {
        let texClass = this.texClass;
        let prevClass = this.prevClass;
        if (texClass === TEXCLASS.NONE) {
            return prev;
        }
        if (prev) {
            if (prev.getProperty('autoOp') && (texClass === TEXCLASS.BIN || texClass === TEXCLASS.REL)) {
                texClass = this.texClass = TEXCLASS.ORD;
            }
            prevClass = this.prevClass = (prev.texClass || TEXCLASS.ORD);
            this.prevLevel = this.attributes.getInherited('scriptlevel') as number;
        } else {
            prevClass = this.prevClass = TEXCLASS.NONE;
        }
        if (texClass === TEXCLASS.BIN &&
            (prevClass === TEXCLASS.NONE || prevClass === TEXCLASS.BIN || prevClass === TEXCLASS.OP ||
             prevClass === TEXCLASS.REL || prevClass === TEXCLASS.OPEN || prevClass === TEXCLASS.PUNCT)) {
            this.texClass = TEXCLASS.ORD;
        } else if (prevClass === TEXCLASS.BIN &&
                   (texClass === TEXCLASS.REL || texClass === TEXCLASS.CLOSE || texClass === TEXCLASS.PUNCT)) {
            prev.texClass = this.prevClass = TEXCLASS.ORD;
        } else if (texClass === TEXCLASS.BIN) {
            //
            // Check if node is the last one in its container since the rule
            // above only takes effect if there is a node that follows.
            //
            let child: MmlNode = this;
            let parent = this.parent;
            while (parent && parent.parent && parent.isEmbellished &&
                   (parent.childNodes.length === 1 ||
                    (!parent.isKind('mrow') && parent.core() === child))) {
                child = parent;
                parent = parent.parent;
            }
            if (parent.childNodes[parent.childNodes.length - 1] === child) {
                this.texClass = TEXCLASS.ORD;
            }
        }
        return this;
    }

    /*
     * Do the normal inheritance, then look up the attributes from the operator dictionary.
     * If there is no dictionary entry, get the TeX class from the Unicode range list.
     *  (FIXME: if using MathML spacing, fake lspace and rspace as well)
     *
     * @override
     */
    public setInheritedAttributes(attributes: AttributeList = {},
                           display: boolean = false, level: number = 0, prime: boolean = false) {
        super.setInheritedAttributes(attributes, display, level, prime);
        let mo = this.getText();
        let [form1, form2, form3] = this.getForms();
        this.attributes.setInherited('form', form1);
        let OPTABLE = MmlMo.OPTABLE;
        let def = OPTABLE[form1][mo] || OPTABLE[form2][mo] || OPTABLE[form3][mo];
        if (def) {
            this.texClass = def[2];
            for (const name of Object.keys(def[3] || {})) {
                this.attributes.setInherited(name, def[3][name]);
            }
        } else {
            let range = this.getRange(mo);
            if (range) {
                this.texClass = range[2];
            }
        }
    }

    /*
     * @return {[string, string, string]}  The list of form attribute values in the
     *                                     order they should be tested, based on the
     *                                     position of the element in its parent.
     */
    protected getForms() {
        let core: MmlNode = this;
        let parent = this.parent;
        let Parent = this.Parent;
        while (Parent && Parent.isEmbellished) {
            core = parent;
            parent = Parent.parent;
            Parent = Parent.Parent;
        }
        if (parent && parent.isKind('mrow') && (parent as MmlMrow).nonSpaceLength() !== 1) {
            if ((parent as MmlMrow).firstNonSpace() === core) {
                return ['prefix', 'infix', 'postfix'];
            }
            if ((parent as MmlMrow).lastNonSpace() === core) {
                return ['postfix', 'infix', 'prefix'];
            }
        }
        return ['infix', 'prefix', 'postfix'];
    }

    /*
     * @param {string} mo  The character to look up in the range table
     * @return {RangeDef}  The unicode range in which the character falls, or null
     */
    protected getRange(mo: string): RangeDef {
        if (!mo.match(/^[\uD800-\uDBFF]?.$/)) {
            return null;
        }
        let n = mo.charCodeAt(0);
        if (mo.length === 2) {
            n = (n - 0xD800) * 0x400 + mo.charCodeAt(1) - 0xDC00 + 0x10000;
        }
        let ranges = MmlMo.RANGES;
        for (const range of ranges) {
            if (range[0] <= n && n <= range[1]) {
                return range;
            }
            if (n < range[0]) {
                return null;
            }
        }
        return null;
    }
}

//
//  These are not in the W3C table, but FF works this way,
//  and it makes sense, so add them here
//
let OPTABLE = MmlMo.OPTABLE;
OPTABLE['infix']['^'] = MO.WIDEREL;
OPTABLE['infix']['_'] = MO.WIDEREL;
OPTABLE['prefix']['\u2223'] = MO.OPEN;
OPTABLE['prefix']['\u2225'] = MO.OPEN;
OPTABLE['postfix']['\u2223'] = MO.CLOSE;
OPTABLE['postfix']['\u2225'] = MO.CLOSE;
