import {AbstractFindMath} from '../../core/FindMath.js';
import {OptionList} from '../../util/Options.js';
import {MathItem, ProtoItem, Location} from '../../core/MathItem.js';

//
//  Sort strings by length
//
const sortLength = function (a: string, b: string) {
    if (a.length !== b.length) {return b.length - a.length}
    return (a == b ? 0 : (a < b ? -1 : 1));
};

//
//  Quote a string for use in regular expressions
//
const quotePattern = function (text: string) {
    return text.replace(/([\^$(){}+*?\-|\[\]\:\\])/g,'\\$1');
};

//
//  Produce a match object that can be turned into a MathItem
//
const MATCH = function (open: string, math: string, close: string, n: number,
                        start: number, end: number, display: boolean = null) {
    let item: ProtoItem = {open: open, math: math, close: close,
                           n: n, start: {n: start}, end: {n: end}, display: display};
    return item;
};


export type ENDITEM = [string, boolean, RegExp];
export type DELIMS = [string, string];

//
//  Locates AsciiMath expressions within strings
//
export class FindAsciiMath extends AbstractFindMath {

    public static OPTIONS: OptionList = {
        delimiters: [['`','`']],   // The start/stop delimiter pairs for asciimath code
    };

    protected start: RegExp;
    protected end: {[name: string]: ENDITEM};
    protected hasPatterns: boolean;

    constructor(options: OptionList) {
        super(options);
        this.GetPatterns();
    }

    //
    //  Create the pattern needed for searching the strings for TeX
    //  based on the configuration options
    //
    protected GetPatterns() {
        let options = this.options;
        let starts: string[] = [];
        this.end = {};
        options['delimiters'].forEach((delims: DELIMS) => this.addPattern(starts, delims, false));
        this.start = new RegExp(starts.join('|'), 'g');
        this.hasPatterns = (starts.length > 0);
    }

    //
    //  Add patters for a pair of delimiters
    //
    protected addPattern(starts: string[], delims: DELIMS, display: boolean) {
        let [open, close] = delims;
        starts.push(quotePattern(open));
        this.end[open] = [close, display, new RegExp(quotePattern(close), 'g')];
    }

    //
    //  Search for the end delimiter given the start delimiter.
    //
    protected FindEnd(string: string, n: number, start: RegExpExecArray, end: ENDITEM) {
        let [close, display, pattern] = end;
        let i = pattern.lastIndex = start.index + start[0].length;
        let match = pattern.exec(string);
        if (!match) return null;
        return MATCH(start[0], string.substr(i, match.index - i), match[0],
                     n, start.index, match.index + match[0].length, display);
    }

    //
    //  Search a string for math delimited by one of the delimiter pairs.
    //
    protected FindMathInString(math: ProtoItem[], n: number, string: string) {
        let start, match;
        this.start.lastIndex = 0;
        while ((start = this.start.exec(string))) {
            match = this.FindEnd(string, n, start, this.end[start[0]]);
            if (match) {
                math.push(match);
                this.start.lastIndex = match.end.n;
            }
        }
    }

    //
    //  Search for math in an array of strings and return
    //  an array of matches.
    //
    public FindMath(strings: string[]) {
        let math: ProtoItem[] = [];
        if (this.hasPatterns) {
            for (let i = 0, m = strings.length; i < m; i++) {
                this.FindMathInString(math,i,strings[i]);
            }
        }
        return math;
    }

};
