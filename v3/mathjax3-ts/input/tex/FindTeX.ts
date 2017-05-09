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
 * @fileoverview  Implements the TeX version of the FindMath object
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
 *  Implements the FindTeX class (extends AbstractFindMath)
 *
 *  Locates TeX expressions within strings
 */

export class FindTeX extends AbstractFindMath {

    public static OPTIONS: OptionList = {
        inlineMath: [              // The start/end delimiter pairs for in-line math
      //  ['$', '$'],              //  (comment out any you don't want, or add your own, but
          ['\\(', '\\)']           //  be sure that you don't have an extra comma at the end)
        ],

        displayMath: [             // The start/end delimiter pairs for display math
          ['$$', '$$'],            //  (comment out any you don't want, or add your own, but
          ['\\[', '\\]']           //  be sure that you don't have an extra comma at the end)
        ],

        processEscapes: true,      // set to true to allow \$ to produce a dollar without
                                   //   starting in-line math mode

        processEnvironments: true, // set to true to process \begin{xxx}...\end{xxx} outside
                                   //   of math mode, false to prevent that

        processRefs: true,         // set to true to process \ref{...} outside of math mode
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
     * The index of the \begin...\end pattern in the regex match array
     */
    protected env: number;

    /*
     * The index of the \ref and escaped character patters in the regex match array
     */
    protected sub: number;

    /*
     * @override
     */
    constructor(options: OptionList) {
        super(options);
        this.getPatterns();
    }

    /*
     * Create the patterns needed for searching the strings for TeX
     *   based on the configuration options
     */
    protected getPatterns() {
        let options = this.options;
        let starts: string[] = [], parts: string[] = [], subparts: string[] = [];
        this.end = {};
        this.env = this.sub = 0;
        let i = 1;
        options['inlineMath'].forEach((delims: DELIMS) => this.addPattern(starts, delims, false));
        options['displayMath'].forEach((delims: DELIMS) => this.addPattern(starts, delims, true));
        if (starts.length) {
            parts.push(starts.sort(sortLength).join('|'));
        }
        if (options['processEnvironments']) {
            parts.push('\\\\begin\\{([^}]*)\\}');
            this.env = i; i++;
        }
        if (options['processEscapes']) {
            subparts.push('\\\\([\\\\$])');
        }
        if (options['processRefs'])    {
            subparts.push('(\\\\(?:eq)?ref\\{[^}]*\\})');
        }
        if (subparts.length) {
            parts.push('(' + subparts.join('|') + ')');
            this.sub = i;
        }
        this.start = new RegExp(parts.join('|'), 'g');
        this.hasPatterns = (parts.length > 0);
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
        this.end[open] = [close, display, this.endPattern(close)];
    }

    /*
     * Create the pattern for a close delimiter
     *
     * @param{string} end  The end delimiter text
     * @return{RegExp}     The regular expression for the end delimiter
     */
    protected endPattern(end: string) {
        return new RegExp(quotePattern(end) + '|\\\\(?:[a-zA-Z]|.)|[{}]', 'g');
    }

    /*
     * Search for the end delimiter given the start delimiter,
     *   skipping braced groups, and control sequences that aren't
     *   the close delimiter.
     *
     * @param{string} text            The string being searched for the end delimiter
     * @param{number} n               The index of the string being searched
     * @param{RegExpExecArray} start  The result array from the start-delimiter search
     * @param{ENDITEM} end            The end-delimiter data corresponding to the start delimiter
     * @return{ProtoItem}             The proto math item for the math, if found
     */
    protected findEnd(text: string, n: number, start: RegExpExecArray, end: ENDITEM) {
        let [close, display, pattern] = end;
        let i = pattern.lastIndex = start.index + start[0].length;
        let match: RegExpExecArray, braces: number = 0;
        while ((match = pattern.exec(text))) {
            if (match[0] === close && braces === 0) {
                return MATCH(start[0], text.substr(i, match.index - i), match[0],
                             n, start.index, match.index + match[0].length, display);
            } else if (match[0] === '{') {
                braces++;
            } else if (match[0] === '}') {
                if (braces) {
                    braces--;
                }
            }
        }
        return null;
    }

    /*
     * Search a string for math delimited by one of the delimiter pairs,
     *   or by \being{env}...\end{env}, or \eqref{...}, \ref{...}, \\, or \$.
     *
     * @param{ProtoItem[]} math  The array of proto math items located so far
     * @param{number} n          The index of the string being searched
     * @param{string} text       The string being searched
     */
    protected findMathInString(math: ProtoItem[], n: number, text: string) {
        let start, match;
        this.start.lastIndex = 0;
        while ((start = this.start.exec(text))) {
            if (start[this.env] !== undefined && this.env) {
                let end = '\\end{' + start[this.env] + '}';
                match = this.findEnd(text, n, start, [end, true, this.endPattern(end)]);
                if (match) {
                    match.math = match.open + match.math + match.close;
                    match.open = match.close = '';
                }
            } else if (start[this.sub] !== undefined && this.sub) {
                let math = start[this.sub];
                let end = start.index + start[this.sub].length;
                if (math.length === 2) {
                    match = MATCH('', math.substr(1), '', n, start.index, end);
                } else {
                    match = MATCH('', math, '', n, start.index, end, false);
                }
            } else {
                match = this.findEnd(text, n, start, this.end[start[0]]);
            }
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
    public findMath(strings: string[]) {
        let math: ProtoItem[] = [];
        if (this.hasPatterns) {
            for (let i = 0, m = strings.length; i < m; i++) {
                this.findMathInString(math, i, strings[i]);
            }
        }
        return math;
    }

}
