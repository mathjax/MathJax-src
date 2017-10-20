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

process.TEST_NEW = false;

let MapHandler = require('mathjax3/input/tex/MapHandler.js').default;
let TeXParser = require('mathjax3/input/tex/TexParser.js').default;
let TEXCLASS = require("mathjax3/core/MmlTree/MmlNode.js").TEXCLASS;
let TexConstant = require("mathjax3/input/tex/TexConstants.js").TexConstant;
let MmlEntities = require("mathjax3/input/mathml/MmlEntities.js").MmlEntities;
let mmlNode = require('mathjax3/core/MmlTree/MmlNode.js');
require("../../element/MmlNode.js");
let imp = require("./imp.js").imp;
let TexError = require('./TexError.js').TexError;


// This is only necessary for the legacy tests.
imp.MML = MathJax.ElementJax.mml;
imp.NEW = process.TEST_NEW;


(function (TEX) {

  var NBSP = "\u00A0"; 
  
  var STACK = MathJax.Object.Subclass({
    Init: function (env,inner) {
      this.global = {isInner: inner};
      this.data = [STACKITEM.start(this.global)];
      if (env) {this.data[0].env = env}
      this.env = this.data[0].env;
    },
    Push: function () {
      var i, m, item, top;
      for (i = 0, m = arguments.length; i < m; i++) {
        item = arguments[i]; if (!item) continue;
        if (imp.isNode(item)) {
          item = STACKITEM.mml(item);
        }
        item.global = this.global;
        
        top = (this.data.length ? this.Top().checkItem(item) : true);
        if (top instanceof Array) {this.Pop(); this.Push.apply(this,top)}
        else if (top instanceof STACKITEM) {this.Pop(); this.Push(top)}
        else if (top) {
          this.data.push(item);
          if (item.env) {
            if (item.copyEnv !== false) {
              for (var id in this.env)
                {if (this.env.hasOwnProperty(id)) {item.env[id] = this.env[id]}}
            }
            this.env = item.env;
          } else {item.env = this.env}
        }
      }
    },
    Pop: function () {
      var item = this.data.pop(); if (!item.isOpen) {delete item.env}
      this.env = (this.data.length ? this.Top().env : {});
      return item;
    },
    Top: function (n) {
      if (n == null) {n = 1}
      if (this.data.length < n) {return null}
      return this.data[this.data.length-n];
    },
    Prev: function (noPop) {
      var top = this.Top();
      if (noPop) {return top.data[top.data.length-1]}
            else {return top.Pop()}
    },
    toString: function () {return "stack[\n  "+this.data.join("\n  ")+"\n]"}
  });
  
  var STACKITEM = STACK.Item = MathJax.Object.Subclass({
    type: "base",
    endError:   /*_()*/ ["ExtraOpenMissingClose","Extra open brace or missing close brace"],
    closeError: /*_()*/ ["ExtraCloseMissingOpen","Extra close brace or missing open brace"],
    rightError: /*_()*/ ["MissingLeftExtraRight","Missing \\left or extra \\right"],
    Init: function () {
      if (this.isOpen) {this.env = {}}
      this.data = [];
      this.Push.apply(this,arguments);
    },
    Push: function () {
      imp.printMethod('StackItem Push arguments: ' + this.data + ' arguments: ');
      imp.printSimple(arguments);
      this.data.push.apply(this.data,arguments)},
    Pop: function () {return this.data.pop()},
    getType: function() {return this.type;},
    hasType: function(type) {return type === this.getType();},
    mmlData: function (inferred,forceRow) {
      imp.printMethod('mmlData');
      if (inferred == null) {inferred = true}
      if (this.data.length === 1 && !forceRow) {
        imp.printSimple('End 1');
        return this.data[0];
      }
      // @test Two Identifiers
      var node = imp.createNode('mrow', this.data, inferred ? {inferred: true}: {});
      // VS: OLD
      // var node = MML.mrow.apply(MML,this.data).With((inferred ? {inferred: true}: {}));
      imp.printSimple('End 2');
      return node;
    },
    checkItem: function (item) {
      imp.printMethod('Checkitem base for ' + item.getType() + ' with ' + item);
      if (item.hasType('over') && this.isOpen) {item.num = this.mmlData(false); this.data = []}
      if (item.hasType('cell') && this.isOpen) {
        if (item.linebreak) {return false}
        TEX.Error(["Misplaced","Misplaced %1",item.name.symbol]);
      }
      if (item.isClose && this[item.getType()+"Error"]) {TEX.Error(this[item.getType()+"Error"])}
      if (!item.isNotStack) {return true}
      this.Push(item.data[0]); return false;
    },
    With: function (def) {
      for (var id in def) {if (def.hasOwnProperty(id)) {this[id] = def[id]}}
      return this;
    },
    toString: function () {return this.getType()+"["+this.data.join("; ")+"]"}
  });

  STACKITEM.start = STACKITEM.Subclass({
    type: "start", isOpen: true,
    Init: function (global) {
      this.SUPER(arguments).Init.call(this);
      this.global = global;
    },
    checkItem: function (item) {
      imp.printMethod('Checkitem start');
      if (item.hasType('stop')) {return STACKITEM.mml(this.mmlData())}
      return this.SUPER(arguments).checkItem.call(this,item);
    }
  });

  STACKITEM.stop = STACKITEM.Subclass({
    type: "stop", isClose: true
  });

  STACKITEM.open = STACKITEM.Subclass({
    type: "open", isOpen: true,
    stopError: /*_()*/ ["ExtraOpenMissingClose","Extra open brace or missing close brace"],
    checkItem: function (item) {
      imp.printMethod('Checkitem open');
      if (item.hasType('close')) {
        var mml = this.mmlData();
        // @test PrimeSup
        // TODO: Move that into mmlData?
        mml = imp.cleanSubSup(mml);
        var node = imp.createNode('TeXAtom', [mml], {});
        // VS: OLD
        // var node = MML.TeXAtom(mml);
        return STACKITEM.mml(node); // TeXAtom make it an ORD to prevent spacing (FIXME: should be another way)
      }
      return this.SUPER(arguments).checkItem.call(this,item);
    }
  });

  STACKITEM.close = STACKITEM.Subclass({
    type: "close", isClose: true
  });
  
  STACKITEM.prime = STACKITEM.Subclass({
    type: "prime",
    checkItem: function (item) {
      imp.printMethod('Checkitem prime');
      if (!imp.isType(this.data[0], "msubsup")) {
        // @test Prime, Double Prime
        var node = imp.createNode('msup', [this.data[0],this.data[1]], {});
        // VS: OLD
        // var node = MML.msup(this.data[0],this.data[1]);
        return [node, item];
      }
      imp.setData(this.data[0], this.data[0].sup,this.data[1]);
      return [this.data[0],item];
    }
  });
  
  STACKITEM.subsup = STACKITEM.Subclass({
    type: "subsup",
    stopError: /*_()*/ ["MissingScript","Missing superscript or subscript argument"],
    supError:  /*_()*/ ["MissingOpenForSup","Missing open brace for superscript"],
    subError:  /*_()*/ ["MissingOpenForSub","Missing open brace for subscript"],
    checkItem: function (item) {
      imp.printMethod('Checkitem subsup');
      if (item.hasType('open') || item.hasType('left')) {return true}
      if (item.hasType('mml')) {
        if (this.primes) {
          if (this.position !== 2) {
            // @test Prime on Sub
            imp.setData(this.data[0], 2, this.primes);
          }
          else {
            // @test Prime on Prime
            imp.setProperties(this.primes, {variantForm: true});
            var node = imp.createNode('mrow', [this.primes, item.data[0]], {});
            // VS: OLD
            // var node = MML.mrow(this.primes, item.data[0]);
            item.data[0] = node;
          }
        }
        imp.setData(this.data[0], this.position, item.data[0]);
        if (this.movesupsub != null) {
          imp.setProperties(this.data[0], {movesupsub: this.movesupsub});
        }
        var result = STACKITEM.mml(this.data[0]);
        return result;
      }
      if (this.SUPER(arguments).checkItem.call(this,item)) {
        // @test Brace Superscript Error
        TEX.Error(this[["","subError","supError"][this.position]]);
      }
    },
    Pop: function () {}
  });

  STACKITEM.over = STACKITEM.Subclass({
    type: "over", isClose: true, name: "\\over",
    checkItem: function (item,stack) {
      imp.printMethod('Checkitem over');
      if (item.hasType('over')) {
        // @test Double Over
        TEX.Error(["AmbiguousUseOf","Ambiguous use of %1",item.name]);
      }
      if (item.isClose) {
        // @test Over
        var mml = imp.createNode('mfrac', [this.num, this.mmlData(false)], {});
        // VS: OLD
        // var mml = MML.mfrac(this.num,this.mmlData(false));
        if (this.thickness != null) {
          // @test Choose, Above, Above with Delims
          imp.setAttribute(mml, 'linethickness', this.thickness);
        }
        if (this.open || this.close) {
          // @test Choose
          mml.texWithDelims = true;
          // setProperty(mml, 'texWithDelims', true);
          mml = TEX.fixedFence(this.open,mml,this.close);
        }
        return [STACKITEM.mml(mml), item];
      }
      return this.SUPER(arguments).checkItem.call(this,item);
    },
    toString: function () {return "over["+this.num+" / "+this.data.join("; ")+"]"}
  });

  STACKITEM.left = STACKITEM.Subclass({
    type: "left", isOpen: true, delim: '(',
    stopError: /*_()*/ ["ExtraLeftMissingRight", "Extra \\left or missing \\right"],
    checkItem: function (item) {
      // @test Missing Right
      imp.printMethod('Checkitem left');
      if (item.hasType('right'))
        {return STACKITEM.mml(TEX.fenced(this.delim,this.mmlData(),item.delim))}
      return this.SUPER(arguments).checkItem.call(this,item);
    }
  });

  STACKITEM.right = STACKITEM.Subclass({
    type: "right", isClose: true, delim: ')'
  });

  STACKITEM.begin = STACKITEM.Subclass({
    type: "begin", isOpen: true,
    checkItem: function (item) {
      imp.printMethod('Checkitem begin');
      if (item.hasType('end')) {
        if (item.name !== this.name)
          {TEX.Error(["EnvBadEnd","\\begin{%1} ended with \\end{%2}",this.name,item.name])}
        if (!this.end) {return STACKITEM.mml(this.mmlData())}
        return this.parse[this.end].call(this.parse,this,this.data);
      }
      if (item.hasType('stop'))
        {TEX.Error(["EnvMissingEnd","Missing \\end{%1}",this.name])}
      return this.SUPER(arguments).checkItem.call(this,item);
    }
  });
  
  STACKITEM.end = STACKITEM.Subclass({
    type: "end", isClose: true
  });

  STACKITEM.style = STACKITEM.Subclass({
    type: "style",
    checkItem: function (item) {
      imp.printMethod('Checkitem style');
      if (!item.isClose) {return this.SUPER(arguments).checkItem.call(this,item)}
      // @test Style
      var mml = imp.createNode('mstyle', this.data, this.styles);
      // VS: OLD
      // var mml = MML.mstyle.apply(MML,this.data).With(this.styles);
      return [STACKITEM.mml(mml),item];
    }
  });
  
  STACKITEM.position = STACKITEM.Subclass({
    type: "position",
    checkItem: function (item) {
      imp.printMethod('Checkitem position');
      if (item.isClose) {TEX.Error(["MissingBoxFor","Missing box for %1",this.name])}
      if (item.isNotStack) {
        var mml = item.mmlData();
        switch (this.move) {
         case 'vertical':
          // @test Raise, Lower
          mml = imp.createNode('mpadded', [mml], {height: this.dh, depth: this.dd, voffset: this.dh});
          // VS: OLD
          // mml = MML.mpadded(mml).With({height: this.dh, depth: this.dd, voffset: this.dh});
          return [STACKITEM.mml(mml)];
         case 'horizontal':
          return [STACKITEM.mml(this.left),item,STACKITEM.mml(this.right)];
        }
      }
      return this.SUPER(arguments).checkItem.call(this,item);
    }
  });
  
  STACKITEM.array = STACKITEM.Subclass({
    type: "array", isOpen: true, copyEnv: false, arraydef: {},
    Init: function () {
      this.table = []; this.row = []; this.frame = []; this.hfill = [];
      this.SUPER(arguments).Init.apply(this,arguments);
    },
    checkItem: function (item) {
      imp.printMethod('Checkitem array');
      if (item.isClose && !item.hasType('over')) {
        if (item.isEntry) {this.EndEntry(); this.clearEnv(); return false}
        if (item.isCR)    {this.EndEntry(); this.EndRow(); this.clearEnv(); return false}
        this.EndTable(); this.clearEnv();
        var scriptlevel = this.arraydef.scriptlevel; delete this.arraydef.scriptlevel;
        // @test Array1
        var mml = imp.createNode('mtable', this.table, this.arraydef);
        // VS: OLD
        // var mml = MML.mtable.apply(MML,this.table).With(this.arraydef);
        if (this.frame.length === 4) {
          mml.frame = (this.frame.dashed ? "dashed" : "solid");
        } else if (this.frame.length) {
          mml.hasFrame = true;
          if (this.arraydef.rowlines) {this.arraydef.rowlines = this.arraydef.rowlines.replace(/none( none)+$/,"none")}
          // @test Array2
          mml = imp.createNode('menclose', [mml], {notation: this.frame.join(" "), isFrame: true});
          // VS: OLD
          // mml = MML.menclose(mml).With({notation: this.frame.join(" "), isFrame: true});
          if ((this.arraydef.columnlines||"none") != "none" ||
              (this.arraydef.rowlines||"none") != "none") {mml.padding = 0} // HTML-CSS jax implements this
        }
        if (scriptlevel) {
          imp.untested(3);
          mml = imp.createNode('mstyle', [mml], {scriptlevel: scriptlevel});
          // VS: OLD
          // mml = MML.mstyle(mml).With({scriptlevel: scriptlevel})}
        }
        if (this.open || this.close) {mml = TEX.fenced(this.open,mml,this.close)}
        mml = STACKITEM.mml(mml);
        if (this.requireClose) {
          if (item.hasType('close')) {return mml}
          TEX.Error(["MissingCloseBrace","Missing close brace"]);
        }
        return [mml,item];
      }
      return this.SUPER(arguments).checkItem.call(this,item);
    },
    EndEntry: function () {
      // @test Array1, Array2
      var mtd = imp.createNode('mtd', this.data, {});
      // VS: OLD
      // var mtd = MML.mtd.apply(MML,this.data);
      if (this.hfill.length) {
        if (this.hfill[0] === 0) mtd.columnalign = "right";
        if (this.hfill[this.hfill.length-1] === this.data.length)
          mtd.columnalign = (mtd.columnalign ? "center" : "left");
      }
      this.row.push(mtd); this.data = []; this.hfill = [];
    },
    EndRow:   function () {
      if (this.isNumbered && this.row.length === 3) {
        this.row.unshift(this.row.pop());  // move equation number to first position
        // @test Label
        var node = imp.createNode('mlabeledtr', this.row, {});
        // VS: OLD
        // var node = MML.mlabeledtr.apply(MML,this.row);
      } else {
        // @test Array1, Array2
        node = imp.createNode('mtr', this.row, {});
        // VS: OLD
        // node = MML.mtr.apply(MML,this.row);
      }
      this.table.push(node);
      this.row = [];
    },
    EndTable: function () {
      if (this.data.length || this.row.length) {this.EndEntry(); this.EndRow()}
      this.checkLines();
    },
    checkLines: function () {
      if (this.arraydef.rowlines) {
        var lines = this.arraydef.rowlines.split(/ /);
        if (lines.length === this.table.length) {
          this.frame.push("bottom"); lines.pop();
          this.arraydef.rowlines = lines.join(' ');
        } else if (lines.length < this.table.length-1) {
          this.arraydef.rowlines += " none";
        }
      }
      if (this.rowspacing) {
        var rows = this.arraydef.rowspacing.split(/ /);
        while (rows.length < this.table.length) {rows.push(this.rowspacing+"em")}
        this.arraydef.rowspacing = rows.join(' ');
      }
    },
    clearEnv: function () {
      for (var id in this.env) {if (this.env.hasOwnProperty(id)) {delete this.env[id]}}
    }
  });
  
  STACKITEM.cell = STACKITEM.Subclass({
    type: "cell", isClose: true
  });

  STACKITEM.mml = STACKITEM.Subclass({
    type: "mml", isNotStack: true,
    Add: function () {this.data.push.apply(this.data,arguments); return this}
  });
  
  STACKITEM.fn = STACKITEM.Subclass({
    type: "fn",
    checkItem: function (item) {
      imp.printMethod('Checkitem fn');
      if (this.data[0]) {
        imp.printSimple('case 1');
        if (item.isOpen) {
          imp.printSimple('case 2');
          return true;
        }
        if (!item.hasType('fn')) {
          imp.printSimple('case 3');
          if (!item.hasType('mml') || !item.data[0]) {
            imp.printSimple('case 4');
            return [this.data[0],item];
          }
          if (imp.isType(item.data[0], 'mspace')) {
            imp.untested(100);
            return [this.data[0],item];
          }
          var mml = item.data[0];
          if (imp.isEmbellished(mml)) {
            imp.printSimple('case 5');
            mml = imp.getCoreMO(mml);
          }
          if ([0,0,1,1,0,1,1,0,0,0][imp.getTexClass(mml)]) {
            return [this.data[0],item];
          }
        }
        // @test Named Function
        var text = imp.createText(MmlEntities.ENTITIES.ApplyFunction);
        // TODO: Texclass should probably be set and not given as attribute!
        var node = imp.createNode('mo', [], {texClass:TEXCLASS.NONE}, text);
        // VS: OLD
        // var node = MML.mo(MML.entity("#x2061")).With({texClass:MML.TEXCLASS.NONE});
        return [this.data[0], node, item];
      }
      return this.SUPER(arguments).checkItem.apply(this,arguments);
    }
  });
  
  STACKITEM.not = STACKITEM.Subclass({
    type: "not",
    checkItem: function (item) {
      imp.printMethod('Checkitem not');
      var mml, c;
      if (item.hasType('open') || item.hasType('left')) {return true}
      if (item.hasType('mml') &&
          (imp.isType(item.data[0], 'mo') || imp.isType(item.data[0], 'mi') ||
           imp.isType(item.data[0], 'mtext'))) {
        mml = item.data[0];
        imp.printJSON(mml);
        c = imp.getText(mml);
        if (c.length === 1 && !imp.getProperty(mml, 'movesupsub') &&
            imp.getChildren(mml).length === 1) {
          if (STACKITEM.not.remap.contains(c)) {
            // @test Negation Simple, Negation Complex
            var textNode = imp.createText(STACKITEM.not.remap.lookup(c).char);
            imp.setData(mml, 0, textNode);
            // VS: OLD
            // mml.SetData(0, MML.chars(STACKITEM.not.remap.lookup(c).char));
          } else {
            // @test Negation Explicit
            var textNode = imp.createText("\u0338");
            imp.appendChildren(mml, [textNode]);
            // VS: OLD
            // mml.Append(MML.chars("\u0338"));
          }
          return item;
        }
      }
      //  \mathrel{\rlap{\notChar}}
      // @test Negation Large
      textNode = imp.createText("\u29F8");
      var mtextNode = imp.createNode('mtext', [], {}, textNode);
      var paddedNode = imp.createNode('mpadded', [mtextNode], {width: 0});
      mml = imp.createNode('TeXAtom', [paddedNode], {texClass: TEXCLASS.REL});
      // VS: OLD
      // mml = MML.mpadded(MML.mtext("\u29F8")).With({width:0});
      // mml = MML.TeXAtom(mml).With({texClass:MML.TEXCLASS.REL});
      return [mml,item];
    }
  });
  STACKITEM.not.remap = MapHandler.getInstance().getMap('not_remap');
  
  STACKITEM.dots = STACKITEM.Subclass({
    type: "dots",
    checkItem: function (item) {
      imp.printMethod('Checkitem dots')
      if (item.hasType('open') || item.hasType('left')) {return true}
      var dots = this.ldots;
      // @test Operator Dots
      if (item.hasType('mml') && imp.isEmbellished(item.data[0])) {
        var tclass = imp.getTexClass(imp.getCoreMO(item.data[0]));
        if (tclass === TEXCLASS.BIN || tclass === TEXCLASS.REL) {
          dots = this.cdots;
        }
      }
      return [dots,item];
    }
  });
  

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
      this.stack = TEX.Stack(ENV,!!env);
      NewParser.setup(this);
      TEXDEF.configurations.forEach(NewParser.append.bind(NewParser));
      this.Parse(); this.Push(STACKITEM.stop());
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
      TEX.Error(["UndefinedControlSequence","Undefined control sequence %1",'\\' + name]);
    },
    envUndefined: function(env) {
    imp.printMethod("envUndefined");
      TEX.Error(["UnknownEnv", "Unknown environment '%1'", env]);
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
    Open: function (c) {this.Push(STACKITEM.open())},
    Close: function (c) {this.Push(STACKITEM.close())},
    
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
        TEX.Error(["DoubleExponent","Double exponent: use braces to clarify"]);
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
      this.Push(STACKITEM.subsup(base).With({
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
        TEX.Error(["DoubleSubscripts","Double subscripts: use braces to clarify"]);
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
      this.Push(STACKITEM.subsup(base).With({
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
        TEX.Error(["DoubleExponentPrime",
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
      this.Push(STACKITEM.prime(base, this.mmlToken(node)));
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
      TEX.Error(["CantUseHash1",
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
      this.Push(STACKITEM.style().With({styles: {displaystyle: style, scriptlevel: level}}));
    },
    SetSize: function (name,size) {
    imp.printMethod("SetSize");
      this.stack.env.size = size;
      this.Push(STACKITEM.style().With({styles: {mathsize: size+"em"}})); // convert to absolute?
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
      this.Push(STACKITEM[name.substr(1)]().With({delim: this.GetDelimiter(name)}));
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
        TEX.Error(["MisplacedMiddle","%1 must be within \\left and \\right",name]);
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
      this.Push(STACKITEM.fn(this.mmlToken(mml)));
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
        TEX.Error(["MisplacedLimits","%1 is allowed only on operators",name]);
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
      var mml = STACKITEM.over().With({name: name});
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
        TEX.Error(["MisplacedMoveRoot","%1 can appear only within a root",name]);
      }
      if (this.stack.global[id]) {
        // @test Multiple Move Root
        TEX.Error(["MultipleMoveRoot","Multiple use of %1",name]);
      }
      var n = this.GetArgument(name);
      if (!n.match(/-?[0-9]+/)) {
        // @test Incorrect Move Root
        TEX.Error(["IntegerArg","The argument to %1 must be an integer",name]);
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
          mml = STACKITEM.fn(this.mmlToken(node));
        } else {
          // @test Mathop Cal
          var parsed = TEX.Parse(arg,this.stack.env).mml();
          node = imp.createNode('TeXAtom', [parsed], def);
          // VS: OLD
          // node = MML.TeXAtom(parsed).With(def);
          mml = STACKITEM.fn(node);
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
        TEX.Error(["NotMathMLToken","%1 is not a token element",type]);
      }
      while (attr !== "") {
        match = attr.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i);
        if (!match) {
          // @test Token Invalid Attribute
          TEX.Error(["InvalidMathMLAttr","Invalid MathML attribute: %1",attr]);
        }
        if (node.attributes.getAllDefaults()[match[1]] == null && !this.MmlTokenAllow[match[1]]) {
          // @test Token Unknown Attribute, Token Wrong Attribute
          TEX.Error(["UnknownAttrForElement",
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
        TEX.Error(["NotMathMLToken","%1 is not a token element",type])}
      while (attr !== "") {
        match = attr.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i);
        if (!match) {
          // @test Token Invalid Attribute
          TEX.Error(["InvalidMathMLAttr","Invalid MathML attribute: %1",attr]);
        }
        if (imp.MML[type].prototype.defaults[match[1]] == null && !this.MmlTokenAllow[match[1]]) {
          // @test Token Unknown Attribute, Token Wrong Attribute
          TEX.Error(["UnknownAttrForElement",
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
      var item = STACKITEM.position().With({name: name, move: 'vertical'});
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
      this.Push(STACKITEM.position().With({
        name: name, move: 'horizontal',
        left:  imp.createNode('mspace', [], {width: h, mathsize: TexConstant.Size.NORMAL}),
        right: imp.createNode('mspace', [], {width: nh, mathsize: TexConstant.Size.NORMAL})
        // VS: OLD
        // left:  MML.mspace().With({width: h, mathsize: MML.SIZE.NORMAL}),
        // right: MML.mspace().With({width: nh, mathsize: MML.SIZE.NORMAL})
      }));
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
      this.Push(STACKITEM.not());
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
      this.Push(STACKITEM.dots().With({
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
        TEX.Error(["MaxMacroSub1",
                   "MathJax maximum macro substitution count exceeded; " +
                   "is there a recursive macro call?"]);
      }
    },
    
    Matrix: function (name,open,close,align,spacing,vspacing,style,cases,numbered) {
    imp.printMethod("Matrix");
      // imp.untested(36);
      var c = this.GetNext();
      if (c === "")
        {TEX.Error(["MissingArgFor","Missing argument for %1",name])}
      if (c === "{") {this.i++} else {this.string = c+"}"+this.string.slice(this.i+1); this.i = 0}
      var array = STACKITEM.array().With({
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
      this.Push(STACKITEM.cell().With({isEntry: true, name: name}));
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
            TEX.Error(["ExtraAlignTab","Extra alignment tab in \\cases text"]);
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
      this.Push(STACKITEM.cell().With({isCR: true, name: name}));
    },
    
    CrLaTeX: function (name) {
    imp.printMethod("CrLaTeX");
      var n;
      if (this.string.charAt(this.i) === "[") {
        n = this.GetBrackets(name,"").replace(/ /g,"").replace(/,/,".");
        if (n && !this.matchDimen(n)) {
          TEX.Error(["BracketMustBeDimension",
                     "Bracket argument to %1 must be a dimension",name]);
        }
      }
      this.Push(STACKITEM.cell().With({isCR: true, name: name, linebreak: true}));
      var top = this.stack.Top();
      if (top instanceof STACKITEM.array) {
        // @test Array
        if (n && top.arraydef.rowspacing) {
          var rows = top.arraydef.rowspacing.split(/ /);
          if (!top.rowspacing) {top.rowspacing = this.dimen2em(rows[0])}
          while (rows.length < top.table.length) {rows.push(this.Em(top.rowspacing))}
          rows[top.table.length-1] = this.Em(Math.max(0,top.rowspacing+this.dimen2em(n)));
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
    emPerInch: 7.2,
    pxPerInch: 72,
    matchDimen: function (dim) {
    // imp.printMethod("matchDimen");
      return dim.match(/^(-?(?:\.\d+|\d+(?:\.\d*)?))(px|pt|em|ex|mu|pc|in|mm|cm)$/);
    },
    dimen2em: function (dim) {
    // imp.printMethod("dimen2em");
      var match = this.matchDimen(dim);
      var m = parseFloat(match[1]||"1"), unit = match[2];
      if (unit === "em") {return m}
      if (unit === "ex") {return m * .43}
      if (unit === "pt") {return m / 10}                    // 10 pt to an em
      if (unit === "pc") {return m * 1.2}                   // 12 pt to a pc
      if (unit === "px") {return m * this.emPerInch / this.pxPerInch}
      if (unit === "in") {return m * this.emPerInch}
      if (unit === "cm") {return m * this.emPerInch / 2.54} // 2.54 cm to an inch
      if (unit === "mm") {return m * this.emPerInch / 25.4} // 10 mm to a cm
      if (unit === "mu") {return m / 18}
      return 0;
    },
    Em: function (m) {
    // imp.printMethod("Em");
      if (Math.abs(m) < .0006) {return "0em"}
      return m.toFixed(3).replace(/\.?0+$/,"") + "em";
    },
    
    HLine: function (name,style) {
    imp.printMethod("HLine");
      if (style == null) {style = "solid"}
      var top = this.stack.Top();
      if (!top.isa(STACKITEM.array) || top.data.length)
        {TEX.Error(["Misplaced","Misplaced %1",name])}
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
      if (top.isa(STACKITEM.array)) top.hfill.push(top.data.length);
        else TEX.Error(["UnsupportedHFill","Unsupported use of %1",name]);
    },
    

    
   /************************************************************************/
   /*
    *   LaTeX environments
    */

    BeginEnd: function (name) {
      imp.printMethod("BeginEnd");
      var env = this.GetArgument(name);
      if (env.match(/^\\end\\/)) {env = env.substr(5)} // special \end{} for \newenvironment environments
      if (env.match(/\\/i)) {TEX.Error(["InvalidEnv","Invalid environment name '%1'",env])}
      if (name === "\\end") {
        var mml = STACKITEM.end().With({name: env});
        this.Push(mml);
      } else {
        if (++this.macroCount > TEX.config.MAXMACROS) {
          TEX.Error(["MaxMacroSub2",
                     "MathJax maximum substitution count exceeded; " +
                     "is there a recursive latex environment?"]);
        }
        NewParser.parse('environment', [env, this]);
      }
    },
    BeginEnvironment: function (func, env, args) {
      imp.printMethod("BeginEnvironment");
      var end = args[0];
      var mml = STACKITEM.begin().With({name: env, end: end, parse:this});
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
      var array = STACKITEM.array().With({
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
        if (!noneOK) {TEX.Error(["MissingArgFor","Missing argument for %1",name])}
        return null;
       case '}':
        if (!noneOK) {
          TEX.Error(["ExtraCloseMissingOpen",
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
        TEX.Error(["MissingCloseBrace","Missing close brace"]);
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
            TEX.Error(["ExtraCloseLooking",
                       "Extra close brace while looking for %1","']'"]);
          }
          break;   
         case ']':
          if (parens == 0) {return this.string.slice(j,this.i-1)}
          break;
        }
      }
      TEX.Error(["MissingCloseBracket",
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
      TEX.Error(["MissingOrUnrecognizedDelim",
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
      TEX.Error(["MissingDimOrUnits",
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
            TEX.Error(["ExtraCloseLooking",
                       "Extra close brace while looking for %1",token])
          }
          parens--;
          break;
        }
        if (parens == 0 && c == token) {return this.string.slice(j,k)}
      }
      TEX.Error(["TokenNotFoundForCommand",
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
        if (match !== '') TEX.Error(["MathNotTerminated","Math not terminated in text box"]);
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
              TEX.Error(["IllegalMacroParam",
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
        TEX.Error(["MaxBufferSize",
                   "MathJax internal buffer size exceeded; is there a recursive macro call?"]);
      }
      return s1+s2;
    }
    
  });
  
  /************************************************************************/

  TEX.Augment({
    Stack: STACK, Parse: PARSE, Definitions: TEXDEF, Startup: STARTUP,
    
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
      // var data = {math:math, display:display, script:script};
      // var callback = this.prefilterHooks.Execute(data); if (callback) return callback;
      // math = data.math;
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
      this.combineRelations(root);
      return mathNode;
    },
    prefilterMath: function (math,displaystyle,script) {
      return math;
    },
    postfilterMath: function (math,displaystyle,script) {
      this.combineRelations(math.root);
      return math;
    },
    formatError: function (err,math,display,script) {
      var message = err.message.replace(/\n.*/,"");
      return imp.createError(message);
    },

    //
    //  Produce an error and stop processing this equation
    //
    Error: function (message) {
      //
      //  Translate message if it is ["id","message",args]
      //
      throw new TexError(message);
    },
    
    //
    //  Add a user-defined macro to the macro list
    //
    Macro: function (name,def,argn) {
      TEXDEF.macros[name] = ['Macro'].concat([].slice.call(arguments,1));
      TEXDEF.macros[name].isUser = true;
    },
    
    /*
     *  Create an mrow that has stretchy delimiters at either end, as needed
     */
    fenced: function (open,mml,close) {
      imp.printMethod('fenced');
      // @test Fenced, Fenced3
      var mrow = imp.createNode('mrow', [], {open:open, close:close, texClass:TEXCLASS.INNER});
      var openNode = imp.createText(open);
      var mo = imp.createNode('mo', [],
                          {fence:true, stretchy:true, symmetric:true, texClass:TEXCLASS.OPEN},
                          openNode);
      imp.appendChildren(mrow, [mo]);
      // VS: OLD
      // var mrow = MML.mrow().With({open:open, close:close, texClass:MML.TEXCLASS.INNER});
      // mrow.Append(
      //   MML.mo(open).With({fence:true, stretchy:true, symmetric:true, texClass:MML.TEXCLASS.OPEN})
      // );
      // TODO: Rewrite the inferred and mml.data
      if (imp.isType(mml, "mrow") && mml.inferred) {
        // @test Fenced
        imp.appendChildren(mrow, mml.data);
      } else {
        // @test Fenced3
        imp.appendChildren(mrow, [mml]);
      }
      var closeNode = imp.createText(close);
      mo = imp.createNode('mo', [],
                      {fence:true, stretchy:true, symmetric:true, texClass:TEXCLASS.CLOSE},
                      closeNode);
      imp.appendChildren(mrow, [mo]);
      // VS: OLD
      // mrow.Append(
      //   MML.mo(close).With({fence:true, stretchy:true, symmetric:true, texClass:MML.TEXCLASS.CLOSE})
      // );
      return mrow;
    },
    /*
     *  Create an mrow that has \mathchoice using \bigg and \big for the delimiters
     */
    fixedFence: function (open,mml,close) {
      // @test Choose, Over With Delims, Above with Delims
      imp.printMethod('fixedFence');
      var mrow = imp.createNode('mrow', [], {open:open, close:close, texClass:TEXCLASS.ORD});
      // VS: OLD
      // var mrow = MML.mrow().With({open:open, close:close, texClass:MML.TEXCLASS.ORD});
      if (open) {
        imp.appendChildren(mrow, [this.mathPalette(open,"l")]);
      }
      if (imp.isType(mml, "mrow")) {
        imp.appendChildren(mrow, [mrow, mml.data]);
      } else {
        imp.appendChildren(mrow, [mml]);
      }
      if (close) {
        imp.appendChildren(mrow, [this.mathPalette(close,"r")]);
      }
      return mrow;
    },
    mathPalette: function (fence,side) {
      imp.printMethod('mathPalette');
      if (fence === '{' || fence === '}') {fence = "\\"+fence}
      var D = '{\\bigg'+side+' '+fence+'}', T = '{\\big'+side+' '+fence+'}';
      return TEX.Parse('\\mathchoice'+D+T+T+T,{}).mml();
    },
    
    //
    //  Combine adjacent <mo> elements that are relations
    //    (since MathML treats the spacing very differently)
    //
    combineRelations: function (mml) {
      imp.printMethod('combineRelations: ');
      var i, m, m1, m2;
      var children = imp.getChildren(mml);
      for (i = 0, m = children.length; i < m; i++) {
        if (children[i]) {
          if (imp.isType(mml, 'mrow')) {
            while (i+1 < m && (m1 = children[i]) && (m2 = children[i+1]) &&
                   imp.isType(m1, 'mo') && imp.isType(m2, 'mo') &&
                   imp.getTexClass(m1) === TEXCLASS.REL &&
                   imp.getTexClass(m2) === TEXCLASS.REL) {
              if (imp.getProperty(m1, 'variantForm') == imp.getProperty(m2, 'variantForm') &&
                  imp.getAttribute(m1, 'mathvariant') == imp.getAttribute(m2, 'mathvariant')) {
                imp.appendChildren(m1, imp.getChildren(m2));
                children.splice(i+1,1);
                m--;
              } else {
                imp.untested('Combine Relations Case 2');
                imp.setAttribute(m1, 'rspace', '0pt');
                imp.setAttribute(m2, 'lspace', '0pt');
                i++;
              }
            }
          }
          if (!children[i].isToken) {
            this.combineRelations(children[i]);
          }
        }
      }
    }
  });

  //
  //  Add the default filters
  //
  TEX.prefilterHooks.Add(function (data) {
    data.math = TEX.prefilterMath(data.math,data.display,data.script);
  });
  TEX.postfilterHooks.Add(function (data) {
    data.math = TEX.postfilterMath(data.math,data.display,data.script);
  });

  TEX.loadComplete("jax.js");
  // MathJax.Ajax.loadComplete("TeX_Parser");
  
})(MathJax.InputJax.TeX);
