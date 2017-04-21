import {UserOptions, DefaultOptions} from 'mathjax/util/Options.js';

//
//  Sort strings by length
//
const sortLength = function (a,b) {
  if (a.length !== b.length) {return b.length - a.length}
  return (a == b ? 0 : (a < b ? -1 : 1));
};

//
//  Quote a string for use in regular expressions
//
const quotePattern = function (string) {
  return string.replace(/([\^$(){}+*?\-|\[\]\:\\])/g,'\\$1');
};

//
//  Produce a match object that can be turned into a MathItem
//
const MATCH = function (open,math,close,n,start,end,display=null) {
  return {open:open, math:math, close:close, n:n, start:start, end:end, display:display};
};

//
//  Locates AsciiMath expressions within strings
//
export class FindAsciiMath {
  
  constructor(options) {
    this.options = UserOptions(DefaultOptions({},this.constructor.OPTIONS),options);
    this.GetPatterns();
  }
  
  //
  //  Create the pattern needed for searching the strings for TeX
  //  based on the configuration options
  //
  GetPatterns() {
    let options = this.options;
    let starts = [];
    this.end = {};
    options.delimiters.forEach(delims => this.addPattern(starts,delims,false));
    this.start = new RegExp(starts.join("|"),"g");
    this.hasPatterns = (starts.length > 0);
  }

  //
  //  Add patters for a pair of delimiters
  //
  addPattern(starts,delims,display) {
    let [open, close] = delims;
    starts.push(quotePattern(open));
    this.end[open] = [close, display, new RegExp(quotePattern(close),"g")];
  }
  
  //
  //  Search for the end delimiter given the start delimiter.
  //
  FindEnd(string,n,start,end,display,pattern) {
    let i = pattern.lastIndex = start.index + start[0].length;
    let match = pattern.exec(string);
    if (!match) return null;
    return MATCH(start[0], string.substr(i,match.index-i), match[0],
                 n, start.index, match.index + match[0].length, display);
  }

  //
  //  Search a string for math delimited by one of the delimiter pairs.
  //  
  FindMathInString(math,n,string) {
    let start, match;
    this.start.lastIndex = 0;
    while ((start = this.start.exec(string))) {
      match = this.FindEnd(string, n, start, ...this.end[start[0]]);
      if (match) {
        math.push(match);
        this.start.lastIndex = match.end;
      }
    }
  }
  
  //
  //  Search for math in an array of strings and return
  //  an array of matches.
  //
  FindMath(strings) {
    let math = [];
    if (this.hasPatterns) {
      for (let i = 0, m = strings.length; i < m; i++) {
        this.FindMathInString(math,i,strings[i]);
      }
    }
    return math;
  }
  
};

FindAsciiMath.OPTIONS = {
  delimiters: [['`','`']],   // The start/stop delimiter pairs for asciimath code
};
