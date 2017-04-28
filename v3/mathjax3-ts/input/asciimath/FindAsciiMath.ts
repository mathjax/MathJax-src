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
 * @fileoverview  Implements the AsciiMath version of the FindMath object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractFindMath} from '../../core/FindMath.js';
import {OptionList} from '../../util/Options.js';
import {MathItem, ProtoItem, Location} from '../../core/MathItem.js';

/*
 *  Sort strings by length
 */
const sortLength = function (a: string, b: string) {
    if (a.length !== b.length) {
        return b.length - a.length;
    }
    return (a === b ? 0 : (a < b ? -1 : 1));
};

/*
 *  Quote a string for use in regular expressions
 */
const quotePattern = function (text: string) {
    return text.replace(/([\^$(){}+*?\-|\[\]\:\\])/g, '\\$1');
};

/*
 *  Produce a proto math item that can be turned into a MathItem
 */
const MATCH = function (open: string, math: string, close: string, n: number,
                        start: number, end: number, display: boolean = null) {
    let item: ProtoItem = {open: open, math: math, close: close,
                           n: n, start: {n: start}, end: {n: end}, display: display};
    return item;
};

/*
 * Shorthand types for data about end delimiters and delimiter pairs
 */
export type ENDITEM = [string, boolean, RegExp];
export type DELIMS = [string, string];

/*****************************************************************/
/*
 *  Implements the FindAsciiMath class (extends AbstractFindMath)
 *
 *  Locates AsciiMath expressions within strings
 */
export class FindAsciiMath extends AbstractFindMath {

    public static OPTIONS: OptionList = {
        delimiters: [['`', '`']],   // The start/end delimiter pairs for asciimath code
    };

    /*
     * The regular expression for any starting delimiter
     */
    protected start: RegExp;

    /*
     * The end-delimiter data keyed to the opening delimiter string
     */
    protected end: {[name: string]: ENDITEM};

    /*
     * False if the configuration has no delimiters (so search can be skipped), true otherwise
     */
    protected hasPatterns: boolean;

    /*
     * @override
     */
    constructor(options: OptionList) {
        super(options);
        this.GetPatterns();
    }

    /*
     * Create the patterns needed for searching the strings for AsciiMath
     *   based on the configuration options
     */
    protected GetPatterns() {
        let options = this.options;
        let starts: string[] = [];
        this.end = {};
        options['delimiters'].forEach((delims: DELIMS) => this.addPattern(starts, delims, false));
        this.start = new RegExp(starts.join('|'), 'g');
        this.hasPatterns = (starts.length > 0);
    }

    /*
     * Add the needed patterns for a pair of delimiters
     *
     * @param{string[]} starts  Array of starting delimiter strings
     * @param{DELIMS} delims    Array of delimiter strings, as [start, end]
     * @param{boolean} display  True if the delimiters are for display mode
     */
    protected addPattern(starts: string[], delims: DELIMS, display: boolean) {
        let [open, close] = delims;
        starts.push(quotePattern(open));
        this.end[open] = [close, display, new RegExp(quotePattern(close), 'g')];
    }

    /*
     * Search for the end delimiter given the start delimiter.
     *
     * @param{string} text            The string being searched for the end delimiter
     * @param{number} n               The index of the string being searched
     * @param{RegExpExecArray} start  The result array from the start-delimiter search
     * @param{ENDITEM} end            The end-delimiter data corresponding to the start delimiter
     * @return{ProtoItem}             The proto math item for the math, if found
     */
    protected FindEnd(text: string, n: number, start: RegExpExecArray, end: ENDITEM) {
        let [close, display, pattern] = end;
        let i = pattern.lastIndex = start.index + start[0].length;
        let match = pattern.exec(text);
        return (!match ? null : MATCH(start[0], text.substr(i, match.index - i), match[0],
                                      n, start.index, match.index + match[0].length, display));
    }

    /*
     * Search a string for math delimited by one of the delimiter pairs.
     *
     * @param{ProtoItem[]} math  The array of proto math items located so far
     * @param{number} n          The index of the string being searched
     * @param{string} text       The string being searched
     */
    protected FindMathInString(math: ProtoItem[], n: number, text: string) {
        let start, match;
        this.start.lastIndex = 0;
        while ((start = this.start.exec(text))) {
            match = this.FindEnd(text, n, start, this.end[start[0]]);
            if (match) {
                math.push(match);
                this.start.lastIndex = match.end.n;
            }
        }
    }

    /*
     * Search for math in an array of strings and return an array of matches.
     *
     * @override
     */
    public FindMath(strings: string[]) {
        let math: ProtoItem[] = [];
        if (this.hasPatterns) {
            for (let i = 0, m = strings.length; i < m; i++) {
                this.FindMathInString(math, i, strings[i]);
            }
        }
        return math;
    }

}
