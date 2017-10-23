/* -*- Mode: Javascript; indent-tabs-mode:nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */

/*************************************************************
 *
 *  MathJax/jax/input/TeX/jax.js
 *  
 *  Implements the TeX InputJax that reads mathematics in
 *  TeX and LaTeX format and converts it to the MML ElementJax
 *  internal format.
 *
 *  ---------------------------------------------------------------------
 *  
 *  Copyright (c) 2009-2017 The MathJax Consortium
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

let MapHandler = require('mathjax3/input/tex/MapHandler.js').default;
let TeXParser = require('mathjax3/input/tex/TexParser.js').default;
let TEXCLASS = require("mathjax3/core/MmlTree/MmlNode.js").TEXCLASS;
let TexConstant = require("mathjax3/input/tex/TexConstants.js").TexConstant;
let MmlEntities = require("mathjax3/input/mathml/MmlEntities.js").MmlEntities;
require("../../element/MmlNode.js");
let imp = require("./imp.js").imp;
let TexError = require('./TexError.js').TexError;
let stack = require('./Stack.js');
let sitem = require('./StackItem.js');
let ParserUtil = require("./ParserUtil.js").ParserUtil;
let ParseMethods = require('./ParseMethods.js').ParseMethods;
require("./old-stackitem.js");

// This is only necessary for the legacy tests.
imp.MML = MathJax.ElementJax.mml;
ParseMethods.STACKITEM = MathJax.InputJax.TeX.Stack.Item;

(function (TEX) {

  var NBSP = "\u00A0"; 

  var STACKITEM = MathJax.InputJax.TeX.Stack.Item;

  var TEXDEF = {
    //
    //  Add new definitions without overriding user-defined ones
    //
    Add: function (src,dst,nouser) {
      if (!dst) {dst = this}
      for (var id in src) {if (src.hasOwnProperty(id)) {
        if (typeof src[id] === 'object' && !(src[id] instanceof Array) &&
           (typeof dst[id] === 'object' || typeof dst[id] === 'function'))
             {this.Add(src[id],dst[id],src[id],nouser)}
          else if (!dst[id] || !dst[id].isUser || !nouser) {dst[id] = src[id]}
      }}
      return dst;
    },
    number:  /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)*|\.[0-9]+)/,
    p_height: 1.2 / .85,   // cmex10 height plus depth over .85
    // TODO (VS): Retained these for AMScd.js.
    macros: {},
    special: {},
    environment: {},
    // TODO (VS): Temporary to collect configurations from extensions.
    configurations: []
  };

  var STARTUP = function () {
    //
    //  Add macros defined in the configuration
    //
    // TODO (VS): This needs to be moved and rewritten!
    //
    if (this.config.Macros) {
      var MACROS = this.config.Macros;
      for (var id in MACROS) {if (MACROS.hasOwnProperty(id)) {
        if (typeof(MACROS[id]) === "string") {TEXDEF.macros[id] = ['Macro',MACROS[id]]}
        else {TEXDEF.macros[id] = ["Macro"].concat(MACROS[id])}
        TEXDEF.macros[id].isUser = true;
      }}
    }
  };
  

  /************************************************************************/
  /*
   *   The TeX Parser
   */

  var NewParser = new TeXParser();
  ParseMethods.NEW_PARSER = NewParser;
  var PARSE = MathJax.Object.Subclass({
    remap:   MapHandler.getInstance().getMap('remap'),
    Init: function (string,env) {
    imp.printMethod("Init");
      this.string = string; this.i = 0; this.macroCount = 0;
      var ENV; if (env) {ENV = {}; for (var id in env) {if (env.hasOwnProperty(id)) {ENV[id] = env[id]}}}
      this.stack = new stack.Stack(ENV,!!env,STACKITEM);
      NewParser.setup(ParseMethods);
      TEXDEF.configurations.forEach(NewParser.append.bind(NewParser));
      this.Parse();
      this.Push(imp.STACKS ? new sitem.StopItem() : STACKITEM.stop());
    },
    Parse: function () {
    imp.printMethod("Parse");
      var c, n;
      while (this.i < this.string.length) {
        c = this.string.charAt(this.i++); n = c.charCodeAt(0);
        if (n >= 0xD800 && n < 0xDC00) {c += this.string.charAt(this.i++)}
        NewParser.parse('character', [c, this])
      }
    },
    Push: function (arg) {
    imp.printMethod("Push");
      this.stack.Push(arg);
    },
    PushAll: function (args) {
      imp.printMethod("PushAll");
      for(var i = 0, m = args.length; i < m; i++) {
        this.stack.Push(args[i]);
      } 
    },
    mml: function () {
      imp.printMethod("mml");
      if (!this.stack.Top().hasType('mml')) {
        return null;
      }
      var node = this.stack.Top().data[0];
      if (imp.NEW) {
        // Makes sure TeXclasses are properly set, so none is null.
        node.setTeXclass(null);
      };
      return node;
    },

    // VS: Forget this for now!
    mmlToken: function (token) {return token}, // used by boldsymbol extension


    /************************************************************************/
    /*
     *   String handling routines
     */

    /*
     *  Convert delimiter to character
     */
    convertDelimiter: function (c) {
    imp.printMethod("convertDelimiter");
      return NewParser.lookup('delimiter', c).char || null;
    },

    /*
     *  Trim spaces from a string
     */
    // static
    trimSpaces: function (text) {
    imp.printMethod("trimSpaces");
      if (typeof(text) != 'string') {return text}
      var TEXT = text.replace(/^\s+|\s+$/g,'');
      if (TEXT.match(/\\$/) && text.match(/ $/)) TEXT += " ";
      return TEXT;
    },

    /*
     *   Check if the next character is a space
     */
    nextIsSpace: function () {
    imp.printMethod("nextIsSpace");
      return this.string.charAt(this.i).match(/\s/);
    },
    
    /*
     *  Get the next non-space character
     */
    GetNext: function () {
    imp.printMethod("GetNext");
      while (this.nextIsSpace()) {this.i++}
      return this.string.charAt(this.i);
    },
  
    /*
     *  Get and return a control-sequence name
     */
    GetCS: function () {
    imp.printMethod("GetCS");
      var CS = this.string.slice(this.i).match(/^([a-z]+|.) ?/i);
      if (CS) {this.i += CS[1].length; return CS[1]} else {this.i++; return " "}
    },

    /*
     *  Get and return a TeX argument (either a single character or control sequence,
     *  or the contents of the next set of braces).
     */
    GetArgument: function (name,noneOK) {
    imp.printMethod("GetArgument");
      switch (this.GetNext()) {
       case "":
        if (!noneOK) {throw new TexError(["MissingArgFor","Missing argument for %1",name])}
        return null;
       case '}':
        if (!noneOK) {
          throw new TexError(["ExtraCloseMissingOpen",
                     "Extra close brace or missing open brace"]);
        }
        return null;
       case '\\':
        this.i++; return "\\"+this.GetCS();
       case '{':
        var j = ++this.i, parens = 1;
        while (this.i < this.string.length) {
          switch (this.string.charAt(this.i++)) {
           case '\\':  this.i++; break;
           case '{':   parens++; break;
           case '}':
            if (--parens == 0) {return this.string.slice(j,this.i-1)}
            break;
          }
        }
        throw new TexError(["MissingCloseBrace","Missing close brace"]);
        break;
      }        
      return this.string.charAt(this.i++);
    },
    
    /*
     *  Get an optional LaTeX argument in brackets
     */
    GetBrackets: function (name,def) {
    imp.printMethod("GetBrackets");
      if (this.GetNext() != '[') {return def};
      var j = ++this.i, parens = 0;
      while (this.i < this.string.length) {
        switch (this.string.charAt(this.i++)) {
         case '{':   parens++; break;
         case '\\':  this.i++; break;
         case '}':
          if (parens-- <= 0) {
            throw new TexError(["ExtraCloseLooking",
                       "Extra close brace while looking for %1","']'"]);
          }
          break;   
         case ']':
          if (parens == 0) {return this.string.slice(j,this.i-1)}
          break;
        }
      }
      throw new TexError(["MissingCloseBracket",
                 "Couldn't find closing ']' for argument to %1",name]);
    },
  
    /*
     *  Get the name of a delimiter (check it in the delimiter list).
     */
    GetDelimiter: function (name,braceOK) {
    imp.printMethod("GetDelimiter");
      while (this.nextIsSpace()) {this.i++}
      var c = this.string.charAt(this.i); this.i++;
      if (this.i <= this.string.length) {
        if (c == "\\") {
          c += this.GetCS(name);
        } else if (c === "{" && braceOK) {
          this.i--;
          c = this.GetArgument(name);
        }
        if (NewParser.contains('delimiter', c)) {
          return this.convertDelimiter(c);
        }
      }
      throw new TexError(["MissingOrUnrecognizedDelim",
                 "Missing or unrecognized delimiter for %1",name]);
    },

    /*
     *  Get a dimension (including its units).
     */
    GetDimen: function (name) {
    imp.printMethod("GetDimen");
      var dimen;
      if (this.nextIsSpace()) {this.i++}
      if (this.string.charAt(this.i) == '{') {
        dimen = this.GetArgument(name);
        if (dimen.match(/^\s*([-+]?([.,]\d+|\d+([.,]\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)\s*$/))
          {return dimen.replace(/ /g,"").replace(/,/,".")}
      } else {
        dimen = this.string.slice(this.i);
        var match = dimen.match(/^\s*(([-+]?([.,]\d+|\d+([.,]\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)) ?/);
        if (match) {
          this.i += match[0].length;
          return match[1].replace(/ /g,"").replace(/,/,".");
        }
      }
      throw new TexError(["MissingDimOrUnits",
                 "Missing dimension or its units for %1",name]);
    },
    
    /*
     *  Get everything up to the given control sequence (token)
     */
    GetUpTo: function (name,token) {
    imp.printMethod("GetUpTo");
      while (this.nextIsSpace()) {this.i++}
      var j = this.i, k, c, parens = 0;
      while (this.i < this.string.length) {
        k = this.i; c = this.string.charAt(this.i++);
        switch (c) {
         case '\\':  c += this.GetCS(); break;
         case '{':   parens++; break;
         case '}':
          if (parens == 0) {
            throw new TexError(["ExtraCloseLooking",
                       "Extra close brace while looking for %1",token])
          }
          parens--;
          break;
        }
        if (parens == 0 && c == token) {return this.string.slice(j,k)}
      }
      throw new TexError(["TokenNotFoundForCommand",
                 "Couldn't find %1 for %2",token,name]);
    },

    /*
     *  Parse various substrings
     */
    ParseArg: function (name) {return TEX.Parse(this.GetArgument(name),this.stack.env).mml()},
    ParseUpTo: function (name,token) {return TEX.Parse(this.GetUpTo(name,token),this.stack.env).mml()},
    
    /*
     *  Break up a string into text and math blocks
     */
    InternalMath: function (text,level) {
    imp.printMethod("InternalMath");
      var def = (this.stack.env.font ? {mathvariant: this.stack.env.font} : {});
      var mml = [], i = 0, k = 0, c, node, match = '', braces = 0;
      if (text.match(/\\?[${}\\]|\\\(|\\(eq)?ref\s*\{/)) {
        while (i < text.length) {
          c = text.charAt(i++);
          if (c === '$') {
            if (match === '$' && braces === 0) {
              // @test Interspersed Text
              node = imp.createNode('TeXAtom', [TEX.Parse(text.slice(k,i-1),{}).mml()], {});
              // VS: OLD
              // node = MML.TeXAtom(TEX.Parse(text.slice(k,i-1),{}).mml());
              mml.push(node);
              match = ''; k = i;
            } else if (match === '') {
              // @test Interspersed Text
              if (k < i-1) mml.push(this.InternalText(text.slice(k,i-1),def));
              match = '$'; k = i;
            }
          } else if (c === '{' && match !== '') {
            braces++;
          } else if (c === '}') {
            if (match === '}' && braces === 0) {
              imp.untested(12);
              node = imp.createNode('TeXAtom', [TEX.Parse(text.slice(k,i),{}).mml()], def);
              // VS: OLD
              // node = MML.TeXAtom(TEX.Parse(text.slice(k,i),{}).mml().With(def));
              mml.push(node);
              match = ''; k = i;
            } else if (match !== '') {
              if (braces) braces--;
            }
          } else if (c === '\\') {
            if (match === '' && text.substr(i).match(/^(eq)?ref\s*\{/)) {
              var len = RegExp["$&"].length;
              if (k < i-1) mml.push(this.InternalText(text.slice(k,i-1),def));
              match = '}'; k = i-1; i += len;
            } else {
              c = text.charAt(i++);
              if (c === '(' && match === '') {
                if (k < i-2) mml.push(this.InternalText(text.slice(k,i-2),def));
                match = ')'; k = i;
              } else if (c === ')' && match === ')' && braces === 0) {
                imp.untested(13);
                node = imp.createNode('TeXAtom', [TEX.Parse(text.slice(k,i-2),{}).mml()], {});
                // VS: OLD
                // node = MML.TeXAtom(TEX.Parse(text.slice(k,i-2),{}).mml());
                mml.push(node);
                match = ''; k = i;
              } else if (c.match(/[${}\\]/) && match === '')  {
                i--; text = text.substr(0,i-1) + text.substr(i); // remove \ from \$, \{, \}, or \\
              }
            }
          }
        }
        if (match !== '') throw new TexError(["MathNotTerminated","Math not terminated in text box"]);
      }
      if (k < text.length) mml.push(this.InternalText(text.slice(k),def));
      if (level != null) {
        // @test Label, Fbox, Hbox
        mml = [imp.createNode('mstyle', mml, {displaystyle:false,scriptlevel:level})];
        // VS: OLD
        // mml = [MML.mstyle.apply(MML,mml).With({displaystyle:false,scriptlevel:level})];
      } else if (mml.length > 1) {
        // @test Interspersed Text
        mml = [imp.createNode('mrow', mml, {})];
        // VS: OLD
        // mml = [MML.mrow.apply(MML,mml)];
      }
      return mml;
    },
    InternalText: function (text,def) {
      // @test Label, Fbox, Hbox
      imp.printMethod("InternalText");
      text = text.replace(/^\s+/,NBSP).replace(/\s+$/,NBSP);
      var textNode = imp.createText(text);
      return imp.createNode('mtext', [], def, textNode);
      // VS: OLD
      // return MML.mtext(MML.chars(text)).With(def);
    },


    // VS: End of the actual Parser methods.

    // VS: Currently only kept for setting Parsing methods.
    ControlSequence: ParseMethods.ControlSequence,
    csMathchar0mi: ParseMethods.csMathchar0mi,
    csMathchar0mo: ParseMethods.csMathchar0mo,
    csMathchar7: ParseMethods.csMathchar7,
    csDelimiter: ParseMethods.csDelimiter,
    csUndefined: ParseMethods.csUndefined,
    envUndefined: ParseMethods.envUndefined,
    Variable: ParseMethods.Variable,
    Number: ParseMethods.Number,
    Open: ParseMethods.Open,
    Close: ParseMethods.Close,
    Tilde: ParseMethods.Tilde,
    Space: ParseMethods.Space,
    Superscript: ParseMethods.Superscript,
    Subscript: ParseMethods.Subscript,
    Prime: ParseMethods.Prime,
    Comment: ParseMethods.Comment,
    Hash: ParseMethods.Hash,
    Other: ParseMethods.Other,
    SetFont: ParseMethods.SetFont,
    SetStyle: ParseMethods.SetStyle,
    SetSize: ParseMethods.SetSize,
    Color: ParseMethods.Color,
    Spacer: ParseMethods.Spacer,
    LeftRight: ParseMethods.LeftRight,
    Middle: ParseMethods.Middle,
    NamedFn: ParseMethods.NamedFn,
    NamedOp: ParseMethods.NamedOp,
    Limits: ParseMethods.Limits,
    Over: ParseMethods.Over,
    Frac: ParseMethods.Frac,
    Sqrt: ParseMethods.Sqrt,
    Root: ParseMethods.Root,
    MoveRoot: ParseMethods.MoveRoot,
    Accent: ParseMethods.Accent,
    UnderOver: ParseMethods.UnderOver,
    Overset: ParseMethods.Overset,
    Underset: ParseMethods.Underset,
    TeXAtom: ParseMethods.TeXAtom,
    // VS: This method is only called during a macro call: AMS Math and \\mod.
    MmlToken: ParseMethods.MmlToken,
    Strut: ParseMethods.Strut,
    Phantom: ParseMethods.Phantom,
    Smash: ParseMethods.Smash,
    Lap: ParseMethods.Lap,
    RaiseLower: ParseMethods.RaiseLower,
    MoveLeftRight: ParseMethods.MoveLeftRight,
    Hskip: ParseMethods.Hskip,
    Rule: ParseMethods.Rule,
    rule: ParseMethods.rule,
    MakeBig: ParseMethods.MakeBig,
    BuildRel: ParseMethods.BuildRel,
    HBox: ParseMethods.HBox,
    FBox: ParseMethods.FBox,
    Not: ParseMethods.Not,
    Dots: ParseMethods.Dots,
    Require: ParseMethods.Require,
    Extension: ParseMethods.Extension,
    Macro: ParseMethods.Macro,
    Matrix: ParseMethods.Matrix,
    Entry: ParseMethods.Entry,
    Cr: ParseMethods.Cr,
    CrLaTeX: ParseMethods.CrLaTeX,
    HLine: ParseMethods.HLine,
    HFill: ParseMethods.HFill,
    BeginEnd: ParseMethods.BeginEnd,
    BeginEnvironment: ParseMethods.BeginEnvironment,
    Equation: ParseMethods.Equation,
    ExtensionEnv: ParseMethods.ExtensionEnv,
    Array: ParseMethods.Array,
    AlignedArray: ParseMethods.AlignedArray,
    setArrayAlign: ParseMethods.setArrayAlign
    
  });
  
  ParseMethods.OLD_PARSER = PARSE;
  /************************************************************************/

  TEX.Augment({
    Stack: TEX.Stack, Parse: PARSE, Definitions: TEXDEF, Startup: STARTUP,
    
    config: {
      MAXMACROS: 10000,    // maximum number of macro substitutions per equation
      MAXBUFFER: 5*1024    // maximum size of TeX string to process
    },
    
    sourceMenuTitle: /*_(MathMenu)*/ ["TeXCommands","TeX Commands"],
    annotationEncoding: "application/x-tex",

    prefilterHooks: MathJax.Callback.Hooks(true),    // hooks to run before processing TeX
    postfilterHooks: MathJax.Callback.Hooks(true),   // hooks to run after processing TeX


    //
    //  Check if AMSmath extension must be loaded and push
    //    it on the extensions array, if needed
    //
    Config: function () {
      this.SUPER(arguments).Config.apply(this,arguments);
      if (this.config.equationNumbers.autoNumber !== "none") {
        if (!this.config.extensions) {this.config.extensions = []}
        this.config.extensions.push("AMSmath.js");
      }
    },

    //
    //  Convert TeX to ElementJax
    //
    Translate: function (script) {
      imp.printMethod('Translate');
      imp.printSimple(script);
      var mml, isError = false, math = MathJax.HTML.getScript(script);
      var display = (script.type.replace(/\n/g," ").match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/) != null);
      try {
        mml = TEX.Parse(math).mml();
        imp.printSimple(mml.toString());
      } catch(err) {
        console.log(err);
        if (!err instanceof TexError) {throw err}
        mml = this.formatError(err,math,display,script);
        isError = true;
      }
      mml = imp.cleanSubSup(mml);
      if (imp.isType(mml, 'mtable') &&
          imp.getAttribute(mml, 'displaystyle') === 'inherit') {
        // for tagged equations
        imp.untested('Tagged equations');
        imp.setAttribute(mml, 'displaystyle', display);
      }
      let mathNode = imp.createMath(mml);
      let root = imp.getRoot(mathNode);
      if (display) {
        imp.setAttribute(root, 'display', 'block');
      }
      if (isError) {
        mathNode.texError = true;
      }
      ParserUtil.combineRelations(root);
      return mathNode;
    },
    formatError: function (err,math,display,script) {
      var message = err.message.replace(/\n.*/,"");
      return imp.createError(message);
    },

    //
    //  Produce an error and stop processing this equation
    //
    // TODO: Kept for extenions only.
    Error: function (message) {
      throw new TexError(message);
    },
    
    //
    //  Add a user-defined macro to the macro list
    //
    Macro: function (name,def,argn) {
      TEXDEF.macros[name] = ['Macro'].concat([].slice.call(arguments,1));
      TEXDEF.macros[name].isUser = true;
    }


  });

  TEX.loadComplete("jax.js");
  // MathJax.Ajax.loadComplete("TeX_Parser");
  
})(MathJax.InputJax.TeX);
