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
//  Locates TeX expressions within strings
//
export class FindTeX {
  
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
    let starts = [], parts = [], subparts = [];
    this.end = {};
    this.env = this.sub = 0;
    let i = 1;
    options.inlineMath.forEach(delims => this.addPattern(starts,delims,false));
    options.displayMath.forEach(delims => this.addPattern(starts,delims,true));
    if (starts.length) parts.push(starts.sort(sortLength).join("|"));
    if (options.processEnvironments) {
      parts.push("\\\\begin\\{([^}]*)\\}");
      this.env = i; i++;
    }
    if (options.processEscapes) subparts.push("\\\\([\\\\$])");
    if (options.processRefs)    subparts.push("(\\\\(?:eq)?ref\\{[^}]*\\})");
    if (subparts.length) {
      parts.push("("+subparts.join("|")+")");
      this.sub = i;
    }
    this.start = new RegExp(parts.join("|"),"g");
    this.hasPatterns = (parts.length > 0);
  }

  //
  //  Add patters for a pair of delimiters
  //
  addPattern(starts,delims,display) {
    let [open, close] = delims;
    starts.push(quotePattern(open));
    this.end[open] = [close, display, this.endPattern(close)];
  }
  
  //
  //  Create the pattern for a close delimiter
  //
  endPattern(end) {
    return new RegExp(quotePattern(end)+"|\\\\(?:[a-zA-Z]|.)|[{}]","g");
  }
  

  //
  //  Search for the end delimiter given the start delimiter,
  //  skipping braced groups, and control sequences that aren't
  //  the close delimiter.
  //
  FindEnd(string,n,start,end,display,pattern) {
    let i = pattern.lastIndex = start.index + start[0].length;
    let match, braces = 0;
    while ((match = pattern.exec(string))) {
      if (match[0] === end && braces === 0) {
        return MATCH(start[0], string.substr(i,match.index-i), match[0],
                     n, start.index, match.index + match[0].length, display);
      } else if (match[0] === '{') {
        braces++;
      } else if (match[0] === '}') {
        if (braces) braces--;
      }
    }
    return null;
  }

  //
  //  Search a string for math delimited by one of the delimiter pairs,
  //  or by \being{env}...\end{env}, or \eqref{...}, \ref{...}, \\, or \$.
  //  
  FindMathInString(math,n,string) {
    let start, match;
    this.start.lastIndex = 0;
    while ((start = this.start.exec(string))) {
      if (start[this.env] !== undefined && this.env) {
        let end = "\\end{"+start[this.env]+"}";
        match = this.FindEnd(string, n, start, end, true, this.endPattern(end));
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
        match = this.FindEnd(string, n, start, ...this.end[start[0]]);
      }
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

FindTeX.OPTIONS = {
  inlineMath: [              // The start/stop pairs for in-line math
//  ['$','$'],               //  (comment out any you don't want, or add your own, but
    ['\\(','\\)']            //  be sure that you don't have an extra comma at the end)
  ],

  displayMath: [             // The start/stop pairs for display math
    ['$$','$$'],             //  (comment out any you don't want, or add your own, but
    ['\\[','\\]']            //  be sure that you don't have an extra comma at the end)
  ],

  processEscapes: true,      // set to true to allow \$ to produce a dollar without
                             //   starting in-line math mode

  processEnvironments: true, // set to true to process \begin{xxx}...\end{xxx} outside
                             //   of math mode, false to prevent that

  processRefs: true,         // set to true to process \ref{...} outside of math mode
  
};
