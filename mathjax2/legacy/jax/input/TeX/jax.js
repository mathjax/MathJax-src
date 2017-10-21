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
require("./old-stackitem.js");

// This is only necessary for the legacy tests.
imp.MML = MathJax.ElementJax.mml;


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
  var PARSE = MathJax.Object.Subclass({
    remap:   MapHandler.getInstance().getMap('remap'),
    Init: function (string,env) {
    imp.printMethod("Init");
      this.string = string; this.i = 0; this.macroCount = 0;
      var ENV; if (env) {ENV = {}; for (var id in env) {if (env.hasOwnProperty(id)) {ENV[id] = env[id]}}}
      this.stack = new stack.Stack(ENV,!!env,STACKITEM);
      NewParser.setup(this);
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
     *   Handle various token classes
     */

    /*
     *  Lookup a control-sequence and process it
     */
    ControlSequence: function (c) {
    imp.printMethod("ControlSequence");
      var name = this.GetCS();
      NewParser.parse('macro', [name, this]);
    },
    //
    //  Look up a macro in the macros list
    //  (overridden in begingroup extension)
    //
    // csFindMacro: function (name) {return TEXDEF.macros[name]},
    //
    //  Handle normal mathchar (as an mi)
    //
    csMathchar0mi: function (mchar) {
      imp.printMethod("csMathchar0mi");
      var def = mchar.attributes || {mathvariant: TexConstant.Variant.ITALIC};
      // @test Greek
      var textNode = imp.createText(mchar.char);
      var node = imp.createNode('mi', [], def, textNode);
      // VS: OLD
      // var node = this.mmlToken(MML.mi(mchar.char).With(def));
      this.Push(this.mmlToken(node));
    },
    //
    //  Handle normal mathchar (as an mo)
    //
    csMathchar0mo: function (mchar) {
    imp.printMethod("csMathchar0mo");
      var def = mchar.attributes || {};
      def.stretchy = false;
      // @test Large Set
      var textNode = imp.createText(mchar.char);
      var node = imp.createNode('mo', [], def, textNode);
      // PROBLEM: Attributes stop working when Char7 are explicitly set.
      // VS: OLD
      // var node = this.mmlToken(MML.mo(mchar.char).With(def))
      this.Push(this.mmlToken(node));
    },
    //
    //  Handle mathchar in current family
    //
    csMathchar7: function (mchar) {
    imp.printMethod("csMathchar7");
      var def = mchar.attributes || {mathvariant: TexConstant.Variant.NORMAL};
      if (this.stack.env.font) {
        // @test MathChar7 Single Font
        def.mathvariant = this.stack.env.font;
      }
      // @test MathChar7 Single, MathChar7 Operator, MathChar7 Multi
      var textNode = imp.createText(mchar.char);
      var node = imp.createNode('mi', [], def, textNode);
      // setVariant(node, def.mathvariant);
      // PROBLEM: Attributes have to be explicitly set, but then interfere with
      // AMS tests. Try setting variant of node!
      // for (var x in def) {
      //   node.attributes.set(x, def[x]);
      // }
      // VS: OLD
      // var node = MML.mi(mchar.char).With(def);
      this.Push(this.mmlToken(node));
    },
    //
    //  Handle delimiter
    //
    csDelimiter: function (delim) {
    imp.printMethod("csDelimiter");
      var def = delim.attributes || {};
      // @test Fenced2, Delimiter (AMS)
      def = Object.assign({fence: false, stretchy: false}, def);
      var textNode = imp.createText(delim.char);
      var node = imp.createNode('mo', [], def, textNode);
      // var node = MML.mo(textNode).With({fence: false, stretchy: false}).With(def); 
      // VS: OLD
      // var node = MML.mo(delim.char).With({fence: false, stretchy: false}).With(def); 
      this.Push(this.mmlToken(node));
    },
    //
    //  Handle undefined control sequence
    //  (overridden in noUndefined extension)
    //
    csUndefined: function (name) {
    imp.printMethod("csUndefined");
      throw new TexError(["UndefinedControlSequence","Undefined control sequence %1",'\\' + name]);
    },
    envUndefined: function(env) {
    imp.printMethod("envUndefined");
      throw new TexError(["UnknownEnv", "Unknown environment '%1'", env]);
    },
    
    /*
     *  Handle a variable (a single letter)
     */
    Variable: function (c) {
      imp.printMethod("Variable");
      var def = {};
      if (this.stack.env.font) {
        // @test Identifier Font
        def.mathvariant = this.stack.env.font;
      }
      // @test Identifier
      var textNode = imp.createText(c);
      var node = imp.createNode('mi', [], def, textNode);
      // VS: OLD
      // node = MML.mi(MML.chars(c)).With(def);
      this.Push(this.mmlToken(node));
    },

    /*
     *  Determine the extent of a number (pattern may need work)
     */
    Number: function (c) {
      imp.printMethod("Number");
      var mml, n = this.string.slice(this.i-1).match(TEXDEF.number);
      var def = {};
      if (this.stack.env.font) {
        // @test Integer Font
        def.mathvariant = this.stack.env.font;
      }
      if (n) {
        // @test Integer, Number
        var textNode = imp.createText(n[0].replace(/[{}]/g,""));
        mml = imp.createNode('mn', [], def, textNode);
        this.i += n[0].length - 1;
      } else {
        // @test Decimal
        var textNode = imp.createText(c);
        mml = imp.createNode('mo', [], def, textNode);
      }
      this.Push(this.mmlToken(mml));
      // VS: OLD
      // if (n) {mml = MML.mn(n[0].replace(/[{}]/g,"")); this.i += n[0].length - 1}
      // else {mml = MML.mo(MML.chars(c))}
      // if (this.stack.env.font) {mml.mathvariant = this.stack.env.font}
      // this.Push(this.mmlToken(mml));
    },
    
    /*
     *  Handle { and }
     */
    Open: function (c) {
      this.Push(imp.STACKS ? new sitem.OpenItem() : STACKITEM.open());
    },
    Close: function (c) {
      this.Push(imp.STACKS ? new sitem.CloseItem() : STACKITEM.close());
    },
    
    /*
     *  Handle tilde and spaces
     */
    Tilde: function (c) {
      // @test Tilde, Tilde2
      // 
      // TODO: Once we can properly load AllEntities, this should be the line.
      // var textNode = imp.createText(MmlEntities.ENTITIES.nbsp);
      var textNode = imp.createText(NBSP);
      var node = imp.createNode('mtext', [], {}, textNode);
      // VS: OLD
      // node = MML.mtext(MML.chars(NBSP))
      this.Push(node);
    },
    Space: function (c) {},
    
    /*
     *  Handle ^, _, and '
     */
    Superscript: function (c) {
    imp.printMethod("Superscript");
      if (this.GetNext().match(/\d/)) {
        // don't treat numbers as a unit
        this.string = this.string.substr(0,this.i+1)+" "+this.string.substr(this.i+1);
      }
      var primes, base, top = this.stack.Top();
      if (top.hasType('prime')) {
        // @test Prime on Prime
        base = top.data[0];
        primes = top.data[1];
        this.stack.Pop();
      } else {
        // @test Empty base2, Square, Cube
        base = this.stack.Prev();
        if (!base) {
          // @test Empty base
          var textNode = imp.createText("");
          base = imp.createNode('mi', [], {}, textNode);
          // VS: OLD
          // base = MML.mi("");
        }
      }
      if (base.isEmbellishedWrapper) {
        // TODO: Warning, those are childNodes now!
        // base = base.data[0].data[0];
        base = imp.getChildAt(imp.getChildAt(base, 0), 0);
      }
      var movesupsub = imp.getProperty(base, 'movesupsub');
      var position = imp.isType(base, "msubsup") ? base.sup : base.over;
      // var movesupsub = base.movesupsub, position = base.sup;
      if ((imp.isType(base, "msubsup") && imp.getChildAt(base, base.sup)) ||
          (imp.isType(base, "munderover") && imp.getChildAt(base, base.over) && !imp.getProperty(base, 'subsupOK'))) {
        // @test Double-super-error, Double-over-error
        throw new TexError(["DoubleExponent","Double exponent: use braces to clarify"]);
      }
      if (!imp.isType(base, "msubsup")) {
        imp.printSimple('Case 1');
        if (movesupsub) {
        imp.printSimple('Case 2');
          // @test Move Superscript, Large Operator
          if (!imp.isType(base, "munderover") || imp.getChildAt(base, base.over)) {
        imp.printSimple('Case 3');
            if (imp.getProperty(base, 'movablelimits') && imp.isType(base, 'mi')) {
              // @test Mathop Super
              base = this.mi2mo(base);
            }
            // @test Large Operator
            base = imp.createNode('munderover', [base], {movesupsub:true});
            // VS: OLD
            // base = MML.munderover(base,null,null).With({movesupsub:true});
          }
          position = base.over;
        } else {
        imp.printSimple('Case 4');
          // @test Empty base, Empty base2, Square, Cube
          base = imp.createNode('msubsup', [base], {});
          // VS: OLD
          // base = MML.msubsup(base,null,null);
          position = base.sup;
        }
      }
      this.Push(imp.STACKS ?
                new sitem.SubsupItem(base).With({
                  position: position, primes: primes, movesupsub: movesupsub
                }) :
                STACKITEM.subsup(base).With({
                  position: position, primes: primes, movesupsub: movesupsub
                }));
    },
    Subscript: function (c) {
    imp.printMethod("Subscript");
      if (this.GetNext().match(/\d/)) {
        // don't treat numbers as a unit
        this.string = this.string.substr(0,this.i+1)+" "+this.string.substr(this.i+1);
      }
      var primes, base, top = this.stack.Top();
      if (top.hasType('prime')) {
        // @test Prime on Sub
        base = top.data[0]; primes = top.data[1];
        this.stack.Pop();
      } else {
        base = this.stack.Prev();
        if (!base) {
          // @test Empty Base Indes
          var textNode = imp.createText("");
          base = imp.createNode('mi', [], {}, textNode);
          // VS: OLD
          // base = MML.mi("");
        }
      }
      if (base.isEmbellishedWrapper) {
        // TODO: Warning, those are childNodes now!
        base = imp.getChildAt(imp.getChildAt(base, 0), 0);
      }
      var movesupsub = imp.getProperty(base, 'movesupsub');
      var position = imp.isType(base, "msubsup") ? base.sub : base.under;
      // var movesupsub = base.movesupsub, position = base.sub;
      if ((imp.isType(base, "msubsup") && imp.getChildAt(base, base.sub)) ||
          (imp.isType(base, "munderover") && imp.getChildAt(base, base.under) &&
           !imp.getProperty(base, 'subsupOK'))) {
        // @test Double-sub-error, Double-under-error
        throw new TexError(["DoubleSubscripts","Double subscripts: use braces to clarify"]);
      }
      if (!imp.isType(base, "msubsup")) {
        if (movesupsub) {
          // @test Large Operator, Move Superscript
          if (!imp.isType(base, "munderover") || imp.getChildAt(base, base.under)) {
            if (imp.getProperty(base, 'movablelimits') && imp.isType(base, 'mi')) {
              // @test Mathop Sub
              base = this.mi2mo(base);
            }
            // @test Move Superscript
            base = imp.createNode('munderover', [base], {movesupsub:true});
            // VS: OLD
            // base = MML.munderover(base,null,null).With({movesupsub:true});
          }
          position = base.under;
        } else {
          // @test Empty Base Index, Empty, Base Index2, Index
          base = imp.createNode('msubsup', [base], {});
          // VS: OLD
          // base = MML.msubsup(base,null,null);
          position = base.sub;
        }
      }
      this.Push(imp.STACKS ?
                new sitem.SubsupItem(base).With({
                  position: position, primes: primes, movesupsub: movesupsub
                }) :
                STACKITEM.subsup(base).With({
                  position: position, primes: primes, movesupsub: movesupsub
                }));
    },
    PRIME: "\u2032", SMARTQUOTE: "\u2019",
    Prime: function (c) {
      // @test Prime
      var base = this.stack.Prev();
      if (!base) {
        // @test PrimeSup, PrePrime, Prime on Sup
        base = imp.createNode('mi', [], {});
        // VS: OLD
        // base = MML.mi();
      }
      if (imp.isType(base, "msubsup") && imp.getChildAt(base, base.sup)) {
        // @test Double Prime Error
        throw new TexError(["DoubleExponentPrime",
                   "Prime causes double exponent: use braces to clarify"]);
      }
      var sup = ""; this.i--;
      do {sup += this.PRIME; this.i++, c = this.GetNext()}
        while (c === "'" || c === this.SMARTQUOTE);
      sup = ["","\u2032","\u2033","\u2034","\u2057"][sup.length] || sup;
      var textNode = imp.createText(sup);
      var node = imp.createNode('mo', [], {}, textNode);
      // VS: OLD
      // var node = MML.mo(sup);
      console.log('BASE:');
      console.log(base);
      this.Push(imp.STACKS ?
                new sitem.PrimeItem(base, this.mmlToken(node)) :
                STACKITEM.prime(base, this.mmlToken(node)));
    },
    mi2mo: function (mi) {
    imp.printMethod("mi2mo");
      // @test Mathop Sub, Mathop Super
      var mo = imp.createNode('mo', [], {});
      imp.copyChildren(mi, mo);
      // TODO: Figure out how to copy these attributes.
      imp.copyAttributes(mi, mo);
      // TODO: Do this with get('lspace') etc.
      imp.setProperties(mo, {lspace: '0', rspace: '0'});
      // mo.lspace = mo.rspace = "0";  // prevent mo from having space in NativeMML
      // mo.useMMLspacing &= ~(mo.SPACE_ATTR.lspace | mo.SPACE_ATTR.rspace);  // don't count these explicit settings
      return mo;
    },
    
    /*
     *  Handle comments
     */
    Comment: function (c) {
    imp.printMethod("Comment");
      while (this.i < this.string.length && this.string.charAt(this.i) != "\n") {this.i++}
    },
    
    /*
     *  Handle hash marks outside of definitions
     */
    Hash: function (c) {
    imp.printMethod("Hash");
      // @test Hash Error
      throw new TexError(["CantUseHash1",
                 "You can't use 'macro parameter character #' in math mode"]);
    },
    
    /*
     *  Handle other characters (as <mo> elements)
     */
    Other: function (c) {
    imp.printMethod("Other");
      var def = {}, mo;
      if (this.stack.env.font) {
        // @test Other Font
        def = {mathvariant: this.stack.env.font};
      }
      var remap = this.remap.lookup(c);
      // @test Other
      // @test Other Remap
      var textNode = imp.createText(remap ? remap.char : c);
      mo = imp.createNode('mo', [], def, textNode);
      // VS: OLD
      // mo = remap ? MML.mo(remap.char).With(def) : MML.mo(c).With(def);
      // VS: Question: What do these autoDefault methods do exactly.
      //     Is there a modern equivalent in v3?
      // 
      //   This changes the operator class, when fences are put around it. Just
      //   propagate from the inherited attributes or properties.
      // TODO: Currently just omitted!
      if (!imp.NEW && mo.autoDefault("stretchy",true)) {
        // @test A Rogers-Ramanujan Identity
        mo.stretchy = false;
      }
      if (!imp.NEW && mo.autoDefault("texClass",true) == "") {
        // @test A Rogers-Ramanujan Identity
        mo = imp.createNode('TeXAtom', [mo], {});
        // VS: OLD
        // mo = MML.TeXAtom(mo);
      }
      this.Push(this.mmlToken(mo));
    },
    
    /************************************************************************/
    /*
     *   Macros
     */
    
    SetFont: function (name,font) {this.stack.env.font = font},
    SetStyle: function (name,texStyle,style,level) {
      imp.printMethod("SetStyle: " + name + " texStyle: " + texStyle +
                " style: " + style + " level: " + level);
      this.stack.env.style = texStyle; this.stack.env.level = level;
      this.Push(imp.STACKS ?
                new sitem.StyleItem().With({styles: {displaystyle: style, scriptlevel: level}}) :
                STACKITEM.style().With({styles: {displaystyle: style, scriptlevel: level}}));
    },
    SetSize: function (name,size) {
    imp.printMethod("SetSize");
      this.stack.env.size = size;
      this.Push(imp.STACKS ?
                new sitem.StyleItem().With({styles: {mathsize: size+"em"}}) :
                STACKITEM.style().With({styles: {mathsize: size+"em"}})); // convert to absolute?
    },

    // Look at color extension!
    Color: function (name) {
    imp.printMethod("Color");
      // @test Color Frac
      var color = this.GetArgument(name);
      var old = this.stack.env.color;
      this.stack.env.color = color;
      var math = this.ParseArg(name);
      if (old) {this.stack.env.color} else {delete this.stack.env.color}
      var node = imp.createNode('mstyle', [math], {mathcolor: color});
      // VS: OLD
      // var node = MML.mstyle(math).With({mathcolor: color});
      this.Push(node);
    },
    
    Spacer: function (name,space) {
      // @test Positive Spacing, Negative Spacing
      var node = imp.createNode('mspace', [],
                            {width: space, mathsize: TexConstant.Size.NORMAL, scriptlevel:0});
      // VS: OLD
      // var node = MML.mspace().With({width: space, mathsize: MML.SIZE.NORMAL, scriptlevel:0});
      this.Push(node);
    },
    
    LeftRight: function (name) {
      imp.printMethod("LeftRight");
      // @test Fenced, Fenced3
      console.log("The fence name!");
      console.log(name);
      console.log(name.substr(1));
      var alpha = name.substr(1);
      this.Push(imp.STACKS ?
                // TODO: Sort this out: Uppercase the first character and add Item!
                new sitem[alpha[0].toUpperCase() + alpha.slice(1) + 'Item']()
                  .With({delim: this.GetDelimiter(name)}) :
                STACKITEM[alpha]().With({delim: this.GetDelimiter(name)}));
    },
    
    Middle: function (name) {
      imp.printMethod("Middle");
      // @test Middle
      var delim = this.GetDelimiter(name);
      var node = imp.createNode('TeXAtom', [], {texClass:TEXCLASS.CLOSE});
      // VS: OLD
      // var node = MML.TeXAtom().With({texClass:TEXCLASS.CLOSE});
      this.Push(node);
      if (!this.stack.Top().hasType('left')) {
        // @test Orphan Middle, Middle with Right
        throw new TexError(["MisplacedMiddle","%1 must be within \\left and \\right",name]);
      }
      var textNode = imp.createText(delim);
      node = imp.createNode('mo', [], {stretchy:true}, textNode);
      // VS: OLD
      // node = MML.mo(delim).With({stretchy:true});
      this.Push(node);
      node = imp.createNode('TeXAtom', [], {texClass:TEXCLASS.OPEN});
      // VS: OLD
      // node = MML.TeXAtom().With({texClass:MML.TEXCLASS.OPEN});
      this.Push(node);
    },
    
    NamedFn: function (name,id) {
      imp.printMethod("NamedFn");
      // @test Named Function
      if (!id) {id = name.substr(1)};
      var textNode = imp.createText(id);
      var mml = imp.createNode('mi', [], {texClass: TEXCLASS.OP}, textNode);
      // VS: OLD
      // var mml = MML.mi(id).With({texClass: MML.TEXCLASS.OP});
      this.Push(imp.STACKS ? new sitem.FnItem(this.mmlToken(mml)) :
                STACKITEM.fn(this.mmlToken(mml)));
    },
    NamedOp: function (name,id) {
      imp.printMethod("NamedOp");
      // @test Limit
      if (!id) {id = name.substr(1)};
      id = id.replace(/&thinsp;/,"\u2006");
      var text = imp.createText(id);
      var mml = imp.createNode('mo', [], {
        movablelimits: true,
        movesupsub: true,
        form: TexConstant.Form.PREFIX,
        texClass: TEXCLASS.OP
      }, text);
      // VS: OLD
      // var mml = MML.mo(id).With({
      //   movablelimits: true,
      //   movesupsub: true,
      //   form: MML.FORM.PREFIX,
      //   texClass: MML.TEXCLASS.OP
      // });
      // TODO: Sort this out with get('form');
      // mml.useMMLspacing &= ~mml.SPACE_ATTR.form;  // don't count this explicit form setting
      this.Push(this.mmlToken(mml));
    },
    Limits: function (name,limits) {
      imp.printMethod("Limits");
      // @test Limits
      var op = this.stack.Prev("nopop");
      if (!op || (imp.getTexClass(op) !== TEXCLASS.OP &&
                  imp.getProperty(op, 'movesupsub') == null)) {
        // @test Limits Error
        throw new TexError(["MisplacedLimits","%1 is allowed only on operators",name]);
      }
      var top = this.stack.Top();
      if (imp.isType(op, "munderover") && !limits) {
        // @test Limits UnderOver
        var node = imp.createNode('msubsup', [], {});
        imp.copyChildren(op, node);
        // VS: OLD
        // var node = MML.msubsup.apply(MML.subsup,op.data);
        op = top.data[top.data.length-1] = node;
      } else if (imp.isType(op, "msubsup") && limits) {
        // @test Limits SubSup
        // node = imp.createNode('munderover', imp.getChildren(op), {});
        // Needs to be copied, otherwise we get an error in MmlNode.appendChild!
        node = imp.createNode('munderover', [], {});
        imp.copyChildren(op, node);
        // VS: OLD
        // node = MML.munderover.apply(MML.underover,op.data);
        op = top.data[top.data.length-1] = node;
      }
      // TODO: Turns this into properties.
      imp.setProperties(op, {'movesupsub': limits ? true : false});
      imp.setProperties(imp.getCore(op), {'movablelimits': false});
      if (imp.getProperty(op, 'movablelimits')) {
        imp.setProperties(op, {'movablelimits': false});
      }
    },
    
    Over: function (name,open,close) {
      imp.printMethod("Over");
      // @test Over
      var mml = imp.STACKS ?
          new sitem.OverItem().With({name: name, parse: TEX.Parse}) :
          STACKITEM.over().With({name: name, parse: TEX.Parse});
      if (open || close) {
        // @test Choose
        mml.open = open; mml.close = close;
      } else if (name.match(/withdelims$/)) {
        // @test Over With Delims, Above With Delims
        mml.open  = this.GetDelimiter(name);
        mml.close = this.GetDelimiter(name);
      }
      if (name.match(/^\\above/)) {
        // @test Above, Above With Delims
        mml.thickness = this.GetDimen(name);
      }
      else if (name.match(/^\\atop/) || open || close) {
        // @test Choose
        mml.thickness = 0;
      }
      this.Push(mml);
    },

    Frac: function (name) {
      imp.printMethod("Frac");
      // @test Frac
      var num = this.ParseArg(name);
      var den = this.ParseArg(name);
      var node = imp.createNode('mfrac', [num, den], {});
      // VS: OLD
      // var node = MML.mfrac(num, den);
      this.Push(node);
    },

    Sqrt: function (name) {
      imp.printMethod("Sqrt");
      var n = this.GetBrackets(name), arg = this.GetArgument(name);
      if (arg === "\\frac") {arg += "{"+this.GetArgument(arg)+"}{"+this.GetArgument(arg)+"}"}
      var mml = TEX.Parse(arg,this.stack.env).mml();
      if (!n) {
        // @test Square Root
        // mml = imp.createNode('msqrt', imp.NEW ? [mml] : mml.array(), {});
        // .array call never seemed to be necessary!
        mml = imp.createNode('msqrt', [mml], {});
        // VS: OLD
        // mml = MML.msqrt.apply(MML,mml.array());
      } else {
        // @test General Root
        mml = imp.createNode('mroot', [mml, this.parseRoot(n)], {});
        // VS: OLD
        // mml = MML.mroot(mml,this.parseRoot(n));
      }
      this.Push(mml);
    },
    Root: function (name) {
      imp.printMethod("Root");
      var n = this.GetUpTo(name,"\\of");
      var arg = this.ParseArg(name);
      var node = imp.createNode('mroot', [arg ,this.parseRoot(n)], {});
      // VS: OLD
      // var node = MML.mroot(arg,this.parseRoot(n));
      this.Push(node);
    },
    parseRoot: function (n) {
    imp.printMethod("parseRoot");
      // @test General Root, Explicit Root
      var env = this.stack.env, inRoot = env.inRoot; env.inRoot = true;
      // TODO: This parser call might change!
      var parser = TEX.Parse(n,env);
      n = parser.mml();
      imp.printJSON(n);
      var global = parser.stack.global;
      if (global.leftRoot || global.upRoot) {
        // @test Tweaked Root
        var def = {};
        if (global.leftRoot) {
          def.width = global.leftRoot;
        }
        if (global.upRoot) {
          def.voffset = global.upRoot;
          def.height = global.upRoot;
        }
        
        n = imp.createNode('mpadded', [n], def);
        // VS: OLD
        // n = MML.mpadded(n);
        // if (global.leftRoot) {
        //   n.width = global.leftRoot;
        // }
        // if (global.upRoot) {
        //   n.voffset = global.upRoot;
        //   n.height = global.upRoot;
        // }
      }
      env.inRoot = inRoot;
      return n;
    },
    MoveRoot: function (name,id) {
    imp.printMethod("MoveRoot");
      // @test Tweaked Root
      if (!this.stack.env.inRoot) {
        // @test Misplaced Move Root
        throw new TexError(["MisplacedMoveRoot","%1 can appear only within a root",name]);
      }
      if (this.stack.global[id]) {
        // @test Multiple Move Root
        throw new TexError(["MultipleMoveRoot","Multiple use of %1",name]);
      }
      var n = this.GetArgument(name);
      if (!n.match(/-?[0-9]+/)) {
        // @test Incorrect Move Root
        throw new TexError(["IntegerArg","The argument to %1 must be an integer",name]);
      }
      n = (n/15)+"em";
      if (n.substr(0,1) !== "-") {n = "+"+n}
      this.stack.global[id] = n;
    },
    
    Accent: function (name,accent,stretchy) {
      imp.printMethod("Accent");
      // @test Vector
      var c = this.ParseArg(name);
      var def = {accent: true};
      if (this.stack.env.font) {
        // @test Vector Font
        def.mathvariant = this.stack.env.font;
      }
      var entity = imp.createEntity(accent);
      var moNode = imp.createNode('mo', [], def, entity);
      // VS: OLD
      // var entity = MML.entity("#x"+accent);
      // var moNode = MML.mo(entity).With(def);
      var mml = this.mmlToken(moNode);
      // TODO: This should be property?
      imp.setProperties(mml, {stretchy: (stretchy ? true : false)});
      // @test Vector Op, Vector
      var mo = (imp.isEmbellished(c) ? imp.getCoreMO(c) : c);
      if (imp.isType(mo, 'mo')) {
        // @test Vector Op
        imp.setProperties(mo, {'movablelimits': false});
      }
      var muoNode = imp.createNode('munderover', [], {accent: true});
      // TODO: This is necessary to get the empty element into the children.
      imp.setData(muoNode, 0, c);
      imp.setData(muoNode, 1, null);
      imp.setData(muoNode, 2, mml);
      var texAtom = imp.createNode('TeXAtom', [muoNode], {});
      // VS: OLD
      // var muoNode = MML.munderover(c,null,mml).With({accent: true});
      // var texAtom = MML.TeXAtom(muoNode);
      this.Push(texAtom);
    },
    
    UnderOver: function (name,c,stack,noaccent) {
      imp.printMethod("UnderOver");
      // @test Overline
      var pos = {o: "over", u: "under"}[name.charAt(1)];
      var base = this.ParseArg(name);
      // TODO: Sort this one out!
      if (imp.getProperty(base, 'movablelimits')) {
        // @test Overline Sum
        imp.setProperties(base, {'movablelimits': false});
      }
      if (imp.isType(base, 'munderover') && imp.isEmbellished(base)) {
        // @test Overline Limits
        // TODO: Sort these properties out!
        imp.setProperties(imp.getCore(base), {lspace:0,rspace:0}); // get spacing right for NativeMML
        var mo = imp.createNode('mo', [], {rspace:0});
        base = imp.createNode('mrow', [mo,base], {});  // add an empty <mi> so it's not embellished any more
        // VS: OLD
        // var mo = MML.mo().With({rspace:0});
        // base = MML.mrow(mo,base);  // add an empty <mi> so it's not embellished any more
      }
      var mml = imp.createNode('munderover', [base], {});
      var entity = imp.createEntity(c);
      mo = imp.createNode('mo', [], {stretchy:true, accent:!noaccent}, entity);
      // VS: OLD
      // var mml = MML.munderover(base,null,null);
      // var entity = MML.entity("#x"+c);
      // mo = MML.mo(entity).With({stretchy:true, accent:!noaccent});

      imp.setData(mml, mml[pos], this.mmlToken(mo));

      if (stack) {
        imp.untested(8);
        mml = imp.createNode('TeXAtom', [mml], {texClass:TEXCLASS.OP, movesupsub:true});
        // VS: OLD
        // mml = MML.TeXAtom(mml).With({texClass:MML.TEXCLASS.OP, movesupsub:true});
      }
      // TODO: Sort these properties out!
      imp.setProperties(mml, {subsupOK: true});
      this.Push(mml);
    },
    
    Overset: function (name) {
      imp.printMethod("Overset");
      // @test Overset
      var top = this.ParseArg(name), base = this.ParseArg(name);
      if (imp.getProperty(base, 'movablelimits')) {
        imp.setProperties(base, {'movablelimits': false});
      }
      var node = imp.createNode('mover', [base, top], {});
      // VS: OLD
      // var node = MML.mover(base,top); 
      this.Push(node);
    },
    Underset: function (name) {
      imp.printMethod("Underset");
      // @test Underset
      var bot = this.ParseArg(name), base = this.ParseArg(name);
      if (imp.getProperty(base, 'movablelimits')) {
        // @test Overline Sum
        imp.setProperties(base, {'movablelimits': false});
      }
      var node = imp.createNode('munder', [base, bot], {});
      // VS: OLD
      // var node = MML.munder(base,bot);
      this.Push(node);
    },
    
    TeXAtom: function (name,mclass) {
      imp.printMethod("TeXAtom");
      var def = {texClass: mclass}, mml, node;
      if (mclass == TEXCLASS.OP) {
        def.movesupsub = def.movablelimits = true;
        var arg = this.GetArgument(name);
        var match = arg.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
        if (match) {
          // @test Mathop
          def.mathvariant = TexConstant.Variant.NORMAL;
          var textNode = imp.createText(match[1]);
          node = imp.createNode('mi', [], def, textNode);
          // VS: OLD
          // node = MML.mi(match[1]).With(def);
          mml = imp.STACKS ?
            new sitem.FnItem(this.mmlToken(node)) :
            STACKITEM.fn(this.mmlToken(node));
        } else {
          // @test Mathop Cal
          var parsed = TEX.Parse(arg,this.stack.env).mml();
          node = imp.createNode('TeXAtom', [parsed], def);
          // VS: OLD
          // node = MML.TeXAtom(parsed).With(def);
          mml = imp.STACKS ? new sitem.FnItem(node) : STACKITEM.fn(node);
        }
      } else {
        // @test Mathrel
        parsed = this.ParseArg(name);
        mml = imp.createNode('TeXAtom', [parsed], def);
        // VS: OLD
        // mml = MML.TeXAtom(parsed).With(def);
      }
      this.Push(mml);
    },

    // VS: This method is only called during a macro call: AMS Math and \\mod.
    MmlToken: function (name) {
      if (imp.NEW) {
        this.MmlTokenNew(name);
      } else {
        this.MmlTokenOld(name);
      }
    },
    MmlTokenNew: function (name) {
    imp.printMethod("MmlToken");
      // @test Modulo
      var type = this.GetArgument(name),
          attr = this.GetBrackets(name,"").replace(/^\s+/,""),
          data = this.GetArgument(name),
          def = {}, match;
      var node;
      try {
        node = imp.createNode(type, [], {});
      } catch (e) {
        node = null;
      }
      if (!node || !node.isToken) {
        // @test Token Illegal Type, Token Wrong Type
        throw new TexError(["NotMathMLToken","%1 is not a token element",type]);
      }
      while (attr !== "") {
        match = attr.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i);
        if (!match) {
          // @test Token Invalid Attribute
          throw new TexError(["InvalidMathMLAttr","Invalid MathML attribute: %1",attr]);
        }
        if (node.attributes.getAllDefaults()[match[1]] == null && !this.MmlTokenAllow[match[1]]) {
          // @test Token Unknown Attribute, Token Wrong Attribute
          throw new TexError(["UnknownAttrForElement",
                     "%1 is not a recognized attribute for %2",
                     match[1],type]);
        }
        var value = this.MmlFilterAttribute(match[1],match[2].replace(/^(['"])(.*)\1$/,"$2"));
        if (value) {
          if (value.toLowerCase() === "true") {value = true}
            else if (value.toLowerCase() === "false") {value = false}
          def[match[1]] = value;
        }
        attr = attr.substr(match[0].length);
      }
      imp.printSimple("End mmlToken: type: " + type + " data: " + data + ' def: ');
      var textNode = imp.createText(data);
      node.appendChild(textNode);
      imp.setProperties(node, def);
      this.Push(this.mmlToken(node));
    },
    MmlTokenOld: function (name) {
      imp.printMethod("MmlToken");
      // @test Modulo
      var type = this.GetArgument(name),
          attr = this.GetBrackets(name,"").replace(/^\s+/,""),
          data = this.GetArgument(name),
          def = {attrNames:[]}, match;
      imp.printSimple("Start mmlToken: type: " + type + " data: " + data);
      if (!imp.MML[type] || !imp.MML[type].prototype.isToken) {
        // @test Token Illegal Type, Token Wrong Type
        throw new TexError(["NotMathMLToken","%1 is not a token element",type])}
      while (attr !== "") {
        match = attr.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i);
        if (!match) {
          // @test Token Invalid Attribute
          throw new TexError(["InvalidMathMLAttr","Invalid MathML attribute: %1",attr]);
        }
        if (imp.MML[type].prototype.defaults[match[1]] == null && !this.MmlTokenAllow[match[1]]) {
          // @test Token Unknown Attribute, Token Wrong Attribute
          throw new TexError(["UnknownAttrForElement",
                     "%1 is not a recognized attribute for %2",
                     match[1],type]);
        }
        var value = this.MmlFilterAttribute(match[1],match[2].replace(/^(['"])(.*)\1$/,"$2"));
        if (value) {
          if (value.toLowerCase() === "true") {value = true}
            else if (value.toLowerCase() === "false") {value = false}
          def[match[1]] = value;
          def.attrNames.push(match[1]);
        }
        attr = attr.substr(match[0].length);
      }
      imp.printSimple("End mmlToken: type: " + type + " data: " + data);
      this.Push(this.mmlToken(imp.MML[type](data).With(def)));
    },
    MmlFilterAttribute: function (name,value) {return value},
    MmlTokenAllow: {
      fontfamily:1, fontsize:1, fontweight:1, fontstyle:1,
      color:1, background:1,
      id:1, "class":1, href:1, style:1
    },
    
    Strut: function (name) {
      imp.printMethod("Strut");
      // @test Strut
      // TODO: Do we still need this row as it is implicit?
      var row = imp.createNode('mrow', [], {});
      var padded = imp.createNode('mpadded', [row],
                                  {height: "8.6pt", depth: "3pt", width: 0});
      // VS: OLD
      // var padded = MML.mpadded(MML.mrow()).With({height: "8.6pt", depth: "3pt", width: 0});
      this.Push(padded);
    },
    
    Phantom: function (name,v,h) {
    imp.printMethod("Phantom");
      // @test Phantom
      var box = imp.createNode('mphantom', [this.ParseArg(name)], {});
      if (v || h) {
        box = imp.createNode('mpadded', [box], {});
        if (h) {
          // @test Horizontal Phantom
          box.height = box.depth = 0;
        }
        if (v) {
          // @test Vertical Phantom
          box.width = 0;
        }
      }
      var atom = imp.createNode('TeXAtom', [box], {});
      this.Push(atom);
      // VS: OLD
      // this.Push(MML.TeXAtom(box));
    },
    
    Smash: function (name) {
    imp.printMethod("Smash");
      // @test Smash, Smash Top, Smash Bottom
      var bt = this.trimSpaces(this.GetBrackets(name,""));
      var smash = imp.createNode('mpadded', [this.ParseArg(name)], {});
      // VS: OLD
      // var smash = MML.mpadded(this.ParseArg(name));
      switch (bt) {
        case "b": smash.depth = 0; break;
        case "t": smash.height = 0; break;
        default: smash.height = smash.depth = 0;
      }
      var atom = imp.createNode('TeXAtom', [smash], {});
      this.Push(atom);
      // VS: OLD
      // this.Push(MML.TeXAtom(smash));
    },
    
    Lap: function (name) {
    imp.printMethod("Lap");
      // @test Llap, Rlap
      var mml = imp.createNode('mpadded', [this.ParseArg(name)], {width: 0});
      // VS: OLD
      // var mml = MML.mpadded(this.ParseArg(name)).With({width: 0});
      if (name === "\\llap") {
        // @test Llap
        imp.setAttribute(mml, 'lspace', '-1width');
      }
      var atom = imp.createNode('TeXAtom', [mml], {});
      this.Push(atom);
      // VS: OLD
      // this.Push(MML.TeXAtom(mml));
    },
    
    RaiseLower: function (name) {
      imp.printMethod("RaiseLower");
      // @test Raise, Lower, Raise Negative, Lower Negative
      var h = this.GetDimen(name);
      var item = imp.STACKS ?
          new sitem.PositionItem().With({name: name, move: 'vertical'}) :
          STACKITEM.position().With({name: name, move: 'vertical'});
      if (h.charAt(0) === '-') {
        // @test Raise Negative, Lower Negative
        h = h.slice(1);
        name = {raise: "\\lower", lower: "\\raise"}[name.substr(1)];
      }
      if (name === "\\lower") {
        // @test Raise, Raise Negative
        item.dh = '-'+h; item.dd = '+'+h;
      } else {
        // @test Lower, Lower Negative
        item.dh = '+'+h; item.dd = '-'+h;
      }
      this.Push(item);
    },
    
    MoveLeftRight: function (name) {
      imp.printMethod("MoveLeftRight");
      // @test Move Left, Move Right, Move Left Negative, Move Right Negative
      var h = this.GetDimen(name);
      var nh = (h.charAt(0) === '-' ? h.slice(1) : '-'+h);
      if (name === "\\moveleft") {
        var tmp = h;
        h = nh;
        nh = tmp;
      }
      this.Push(imp.STACKS ?
                new sitem.PositionItem().With({
                  name: name, move: 'horizontal',
                  left:  imp.createNode('mspace', [], {width: h, mathsize: TexConstant.Size.NORMAL}),
                  right: imp.createNode('mspace', [], {width: nh, mathsize: TexConstant.Size.NORMAL})}) :
                STACKITEM.position().With({
                  name: name, move: 'horizontal',
                  left:  imp.createNode('mspace', [], {width: h, mathsize: TexConstant.Size.NORMAL}),
                  right: imp.createNode('mspace', [], {width: nh, mathsize: TexConstant.Size.NORMAL})}));
        // VS: OLD
        // left:  MML.mspace().With({width: h, mathsize: MML.SIZE.NORMAL}),
        // right: MML.mspace().With({width: nh, mathsize: MML.SIZE.NORMAL})
    },
    
    Hskip: function (name) {
    imp.printMethod("Hskip");
      // @test Modulo
      var node = imp.createNode('mspace', [],
                                {width: this.GetDimen(name),
                                 mathsize: TexConstant.Size.NORMAL});
      // VS: OLD
      // var node = MML.mspace().With({width: this.GetDimen(name), mathsize: TexConstant.Size.NORMAL});
      this.Push(node);
    },
    
    Rule: function (name,style) {
      imp.printMethod("Rule");
      // @test Rule 3D, Space 3D
      var w = this.GetDimen(name),
          h = this.GetDimen(name),
          d = this.GetDimen(name);
      var def = {width:w, height:h, depth:d};
      if (style !== 'blank') {
        def.mathbackground = (this.stack.env.color || "black");
      }
      var node = imp.createNode('mspace', [], def);
      // VS: OLD
      // var node = MML.mspace().With(def);
      this.Push(node);
    },
    rule: function (name) {
    imp.printMethod("rule");
      // @test Rule 2D
      var v = this.GetBrackets(name),
          w = this.GetDimen(name),
          h = this.GetDimen(name);
      var mml = imp.createNode('mspace', [], {
        width: w, height:h,
        mathbackground: (this.stack.env.color || "black") });
      // VS: OLD
      // var mml = MML.mspace().With({
      //   width: w, height:h,
      //   mathbackground: (this.stack.env.color || "black")
      // });
      if (v) {
        mml = imp.createNode('mpadded', [mml], {voffset: v});
        // VS: OLD
        // mml = MML.mpadded(mml).With({voffset: v});
        if (v.match(/^\-/)) {
          mml.height = v;
          mml.depth = '+' + v.substr(1);
        } else {
          mml.height = '+' + v;
        }
      }
      this.Push(mml);
    },
    
    MakeBig: function (name,mclass,size) {
      imp.printMethod("MakeBig");
      // @test Choose, Over With Delims, Above With Delims
      size *= TEXDEF.p_height;
      size = String(size).replace(/(\.\d\d\d).+/,'$1')+"em";
      var delim = this.GetDelimiter(name,true);
      var text = imp.createText(delim);
      var mo = imp.createNode('mo', [], {
        minsize: size, maxsize: size,
        fence: true, stretchy: true, symmetric: true
      }, text);
      var node = imp.createNode('TeXAtom', [mo], {texClass: mclass});
      // VS: OLD
      // var node = MML.TeXAtom(MML.mo(delim).With({
      //   minsize: size, maxsize: size,
      //   fence: true, stretchy: true, symmetric: true
      // })).With({texClass: mclass});
      this.Push(node);
    },
    
    BuildRel: function (name) {
      imp.printMethod("BuildRel");
      // @test BuildRel, BuildRel Expression
      var top = this.ParseUpTo(name,"\\over");
      var bot = this.ParseArg(name);
      var node = imp.createNode('munderover', [], {});
      // TODO: This is necessary to get the empty element into the children.
      imp.setData(node, 0, bot);
      imp.setData(node, 1, null);
      imp.setData(node, 2, top);
      var atom = imp.createNode('TeXAtom', [node], {texClass: TEXCLASS.REL});
      // VS: OLD
      // this.Push(MML.TeXAtom(MML.munderover(bot,null,top)).With({texClass: MML.TEXCLASS.REL}));
      this.Push(atom);
    },
    
    HBox: function (name,style) {
    imp.printMethod("HBox");
      // @test Hbox
      // VS: OLD
      // this.PushAll(this.InternalMath(this.GetArgument(name),style));
      // TODO: Sort out internal math first!
      this.PushAll(this.InternalMath(this.GetArgument(name),style));
    },
    
    FBox: function (name) {
    imp.printMethod("FBox");
      // @test Fbox
      var internal = this.InternalMath(this.GetArgument(name));
      var node = imp.createNode('menclose', internal, {notation:"box"});
      // VS: OLD
      // this.Push(MML.menclose.apply(MML,this.InternalMath(this.GetArgument(name))).With({notation:"box"}));
      this.Push(node);
    },
    
    Not: function (name) {
      imp.printMethod("Not");
      // @test Negation Simple, Negation Complex, Negation Explicit,
      //       Negation Large
      this.Push(imp.STACKS ? new sitem.NotItem() : STACKITEM.not());
    },
    
    Dots: function (name) {
    imp.printMethod("Dots");
      // @test Operator Dots
      var ldotsEntity = imp.createEntity('2026');
      var cdotsEntity = imp.createEntity('22EF');
      var ldots = imp.createNode('mo', [], {stretchy:false}, ldotsEntity);
      var cdots = imp.createNode('mo', [], {stretchy:false}, cdotsEntity);
      // VS: OLD
      // var ldots = MML.mo(MML.entity("#x2026")).With({stretchy:false});
      // var cdots = MML.mo(MML.entity("#x22EF")).With({stretchy:false});
      this.Push(imp.STACKS ?
                new sitem.DotsItem().With({
                  ldots: this.mmlToken(ldots),
                  cdots: this.mmlToken(cdots)
                }) :
                STACKITEM.dots().With({
                  ldots: this.mmlToken(ldots),
                  cdots: this.mmlToken(cdots)
                }));
    },
    
    Require: function (name) {
    imp.printMethod("Require");
      var file = this.GetArgument(name)
        .replace(/.*\//,"")            // remove any leading path
        .replace(/[^a-z0-9_.-]/ig,""); // remove illegal characters
      this.Extension(null,file);
    },
    
    Extension: function (name,file,array) {
    imp.printMethod("Extension");
      if (name && !typeof(name) === "string") {name = name.name}
      file = TEX.extensionDir+"/"+file;
      if (!file.match(/\.js$/)) {file += ".js"}
    },
    
    Macro: function (name,macro,argcount,def) {
    imp.printMethod("Macro");
      if (argcount) {
        var args = [];
        if (def != null) {
          var optional = this.GetBrackets(name);
          args.push(optional == null ? def : optional);
        }
        for (var i = args.length; i < argcount; i++) {args.push(this.GetArgument(name))}
        macro = this.SubstituteArgs(args,macro);
      }
      this.string = this.AddArgs(macro,this.string.slice(this.i));
      this.i = 0;
      if (++this.macroCount > TEX.config.MAXMACROS) {
        throw new TexError(["MaxMacroSub1",
                   "MathJax maximum macro substitution count exceeded; " +
                   "is there a recursive macro call?"]);
      }
    },
    
    Matrix: function (name,open,close,align,spacing,vspacing,style,cases,numbered) {
    imp.printMethod("Matrix");
      // imp.untested(36);
      var c = this.GetNext();
      if (c === "")
        {throw new TexError(["MissingArgFor","Missing argument for %1",name])}
      if (c === "{") {this.i++} else {this.string = c+"}"+this.string.slice(this.i+1); this.i = 0}
      var array = imp.STACKS ?
          new sitem.ArrayItem().With({
            requireClose: true,
            arraydef: {
              rowspacing: (vspacing||"4pt"),
              columnspacing: (spacing||"1em")
            }}) :
            STACKITEM.array().With({
              requireClose: true,
              arraydef: {
                rowspacing: (vspacing||"4pt"),
                columnspacing: (spacing||"1em")
              }
            });
      if (cases)         {array.isCases = true}
      if (numbered)      {array.isNumbered = true; array.arraydef.side = numbered}
      if (open || close) {array.open = open; array.close = close}
      if (style === "D") {array.arraydef.displaystyle = true}
      if (align != null) {array.arraydef.columnalign = align}
      this.Push(array);
    },
    
    Entry: function (name) {
    imp.printMethod("Entry");
      // imp.untested(20);
      this.Push(imp.STACKS ?
                new sitem.CellItem().With({isEntry: true, name: name}) :
                STACKITEM.cell().With({isEntry: true, name: name}));
      if (this.stack.Top().isCases) {
        //
        //  Make second column be in \text{...} (unless it is already
        //  in a \text{...}, for backward compatibility).
        //
        var string = this.string;
        var braces = 0, close = -1, i = this.i, m = string.length;
        //
        //  Look through the string character by character...
        //
        while (i < m) {
          var c = string.charAt(i);
          if (c === "{") {
            //
            //  Increase the nested brace count and go on
            //
            braces++;
            i++;
          } else if (c === "}") {
            //
            //  If there are too many close braces, just end (we will get an
            //    error message later when the rest of the string is parsed)
            //  Otherwise
            //    decrease the nested brace count,
            //    if it is now zero and we haven't already marked the end of the
            //      first brace group, record the position (use to check for \text{} later)
            //    go on to the next character.
            //
            if (braces === 0) {
              m = 0;
            } else {
              braces--;
              if (braces === 0 && close < 0) {
                close = i - this.i;
              }
              i++;
            }
          } else if (c === "&" && braces === 0) {
            //
            //  Extra alignment tabs are not allowed in cases
            //
            throw new TexError(["ExtraAlignTab","Extra alignment tab in \\cases text"]);
          } else if (c === "\\") {
            //
            //  If the macro is \cr or \\, end the search, otherwise skip the macro
            //  (multi-letter names don't matter, as we will skip the rest of the
            //   characters in the main loop)
            //
            if (string.substr(i).match(/^((\\cr)[^a-zA-Z]|\\\\)/)) {m = 0} else {i += 2}
          } else {
            //
            //  Go on to the next character
            //
            i++;
          }
        }
        //
        //  Check if the second column text is already in \text{},
        //  If not, process the second column as text and continue parsing from there,
        //    (otherwise process the second column as normal, since it is in \text{}
        //
        var text = string.substr(this.i,i-this.i);
        if (!text.match(/^\s*\\text[^a-zA-Z]/) || close !== text.replace(/\s+$/,'').length - 1) {
          var internal = this.InternalMath(text,0);
          this.PushAll(internal);
          this.i = i;
        }
      }
    },
    
    Cr: function (name) {
    imp.printMethod("Cr");
      this.Push(imp.STACKS ?
                new sitem.CellItem().With({isCR: true, name: name}) :
                STACKITEM.cell().With({isCR: true, name: name}));
    },
    
    CrLaTeX: function (name) {
    imp.printMethod("CrLaTeX");
      var n;
      if (this.string.charAt(this.i) === "[") {
        n = this.GetBrackets(name,"").replace(/ /g,"").replace(/,/,".");
        if (n && !ParserUtil.matchDimen(n)) {
          throw new TexError(["BracketMustBeDimension",
                     "Bracket argument to %1 must be a dimension",name]);
        }
      }
      this.Push(imp.STACKS ?
                new sitem.CellItem().With({isCR: true, name: name, linebreak: true}) :
                STACKITEM.cell().With({isCR: true, name: name, linebreak: true}));
      var top = this.stack.Top();
      if (imp.STACKS ? top instanceof sitem.ArrayItem : top instanceof STACKITEM.array) {
        // @test Array
        if (n && top.arraydef.rowspacing) {
          var rows = top.arraydef.rowspacing.split(/ /);
          if (!top.rowspacing) {top.rowspacing = ParserUtil.dimen2em(rows[0])}
          while (rows.length < top.table.length) {rows.push(ParserUtil.Em(top.rowspacing))}
          rows[top.table.length-1] = ParserUtil.Em(Math.max(0,top.rowspacing+ParserUtil.dimen2em(n)));
          top.arraydef.rowspacing = rows.join(' ');
        }
      } else {
        if (n) {
          // @test Custom Linebreak
          var node = imp.createNode('mspace', [], {depth:n});
          // VS: OLD
          // var node = MML.mspace().With({depth:n});
          this.Push(node);
        }
        // @test Linebreak
        node = imp.createNode('mspace', [], {linebreak:TexConstant.LineBreak.NEWLINE});
        // VS: OLD
        // node = MML.mspace().With({linebreak:MML.LINEBREAK.NEWLINE});
        this.Push(node);
      }
    },
    
    HLine: function (name,style) {
    imp.printMethod("HLine");
      if (style == null) {style = "solid"}
      var top = this.stack.Top();
      if (!(imp.STACKS ? top instanceof sitem.ArrayItem : top instanceof STACKITEM.array) ||
          top.data.length)
        {throw new TexError(["Misplaced","Misplaced %1",name])}
      if (top.table.length == 0) {
        top.frame.push("top");
      } else {
        var lines = (top.arraydef.rowlines ? top.arraydef.rowlines.split(/ /) : []);
        while (lines.length < top.table.length) {
          lines.push("none");
        }
        lines[top.table.length-1] = style;
        top.arraydef.rowlines = lines.join(' ');
      }
    },
    
    HFill: function (name) {
    imp.printMethod("HFill");
      var top = this.stack.Top();
      if ((imp.STACKS ? top instanceof sitem.ArrayItem : top instanceof STACKITEM.array))
        top.hfill.push(top.data.length);
        else throw new TexError(["UnsupportedHFill","Unsupported use of %1",name]);
    },
    

    
   /************************************************************************/
   /*
    *   LaTeX environments
    */

    BeginEnd: function (name) {
      imp.printMethod("BeginEnd");
      var env = this.GetArgument(name);
      if (env.match(/^\\end\\/)) {env = env.substr(5)} // special \end{} for \newenvironment environments
      if (env.match(/\\/i)) {throw new TexError(["InvalidEnv","Invalid environment name '%1'",env])}
      if (name === "\\end") {
        var mml = imp.STACKS ?
            new sitem.EndItem().With({name: env}) :
            STACKITEM.end().With({name: env});
        this.Push(mml);
      } else {
        if (++this.macroCount > TEX.config.MAXMACROS) {
          throw new TexError(["MaxMacroSub2",
                     "MathJax maximum substitution count exceeded; " +
                     "is there a recursive latex environment?"]);
        }
        NewParser.parse('environment', [env, this]);
      }
    },
    BeginEnvironment: function (func, env, args) {
      imp.printMethod("BeginEnvironment");
      var end = args[0];
      var mml = imp.STACKS ?
          new sitem.BeginItem().With({name: env, end: end, parse:this}) :
          STACKITEM.begin().With({name: env, end: end, parse:this});
      mml = func.apply(this,[mml].concat(args.slice(1)));
      this.Push(mml);
    },

    Equation: function (begin,row) {return row},
    
    ExtensionEnv: function (begin,file) {this.Extension(begin.name,file,"environment")},
    
    Array: function (begin,open,close,align,spacing,vspacing,style,raggedHeight) {
    imp.printMethod("Array");
      if (!align) {align = this.GetArgument("\\begin{"+begin.name+"}")}
      var lines = ("c"+align).replace(/[^clr|:]/g,'').replace(/[^|:]([|:])+/g,'$1');
      align = align.replace(/[^clr]/g,'').split('').join(' ');
      align = align.replace(/l/g,'left').replace(/r/g,'right').replace(/c/g,'center');
      var array = imp.STACKS ?
          new sitem.ArrayItem().With({
            arraydef: {
              columnalign: align,
              columnspacing: (spacing||"1em"),
              rowspacing: (vspacing||"4pt")
            }
          }) :
          STACKITEM.array().With({
            arraydef: {
              columnalign: align,
              columnspacing: (spacing||"1em"),
              rowspacing: (vspacing||"4pt")
            }
          });
      if (lines.match(/[|:]/)) {
        if (lines.charAt(0).match(/[|:]/)) {array.frame.push("left"); array.frame.dashed = lines.charAt(0) === ":"}
        if (lines.charAt(lines.length-1).match(/[|:]/)) {array.frame.push("right")}
        lines = lines.substr(1,lines.length-2);
        array.arraydef.columnlines =
          lines.split('').join(' ').replace(/[^|: ]/g,'none').replace(/\|/g,'solid').replace(/:/g,'dashed');
      }
      if (open)  {array.open  = this.convertDelimiter(open)}
      if (close) {array.close = this.convertDelimiter(close)}
      if (style === "D") {array.arraydef.displaystyle = true}
         else if (style) {array.arraydef.displaystyle = false}
      if (style === "S") {array.arraydef.scriptlevel = 1} // FIXME: should use mstyle?
      if (raggedHeight)  {array.arraydef.useHeight = false}
      this.Push(begin);
      return array;
    },
    
    AlignedArray: function (begin) {
    imp.printMethod("AlignedArray");
      var align = this.GetBrackets("\\begin{"+begin.name+"}");
      return this.setArrayAlign(this.Array.apply(this,arguments),align);
    },
    setArrayAlign: function (array,align) {
    imp.printMethod("setArrayAlign");
      align = this.trimSpaces(align||"");
      if (align === "t") {array.arraydef.align = "baseline 1"}
      else if (align === "b") {array.arraydef.align = "baseline -1"}
      else if (align === "c") {array.arraydef.align = "center"}
      else if (align) {array.arraydef.align = align} // FIXME: should be an error?
      return array;
    },
    
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

    /*
     *  Replace macro paramters with their values
     */
    SubstituteArgs: function (args,string) {
    imp.printMethod("SubstituteArgs");
      var text = ''; var newstring = ''; var c; var i = 0;
      while (i < string.length) {
        c = string.charAt(i++);
        if (c === "\\") {text += c + string.charAt(i++)}
        else if (c === '#') {
          c = string.charAt(i++);
          if (c === '#') {text += c} else {
            if (!c.match(/[1-9]/) || c > args.length) {
              throw new TexError(["IllegalMacroParam",
                         "Illegal macro parameter reference"]);
            }
            newstring = this.AddArgs(this.AddArgs(newstring,text),args[c-1]);
            text = '';
          }
        } else {text += c}
      }
      return this.AddArgs(newstring,text);
    },
    
    /*
     *  Make sure that macros are followed by a space if their names
     *  could accidentally be continued into the following text.
     */
    AddArgs: function (s1,s2) {
    imp.printMethod("AddArgs");
      if (s2.match(/^[a-z]/i) && s1.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i)) {s1 += ' '}
      if (s1.length + s2.length > TEX.config.MAXBUFFER) {
        throw new TexError(["MaxBufferSize",
                   "MathJax internal buffer size exceeded; is there a recursive macro call?"]);
      }
      return s1+s2;
    }
    
  });
  
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
