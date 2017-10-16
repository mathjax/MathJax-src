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
let MmlFactory = require("mathjax3/core/MmlTree/MmlFactory.js").MmlFactory;
let TEXCLASS = require("mathjax3/core/MmlTree/MmlNode.js").TEXCLASS;
let TexConstant = require("mathjax3/input/tex/TexConstants.js").TexConstant;
let MmlEntities = require("mathjax3/input/mathml/MmlEntities.js").MmlEntities;
// TODO: That currently does not work as the entities directory is relative to
//       the mathjax-v3 top directory.
// require("mathjax3/input/mathml/AllEntities.js");
let factory = new MmlFactory();
let JsonMmlVisitor = require('mathjax3/core/MmlTree/JsonMmlVisitor.js');
let visitor = new JsonMmlVisitor.JsonMmlVisitor();
let mmlNode = require('mathjax3/core/MmlTree/MmlNode.js');
require("../../element/MmlNode.js");

var MML = MathJax.ElementJax.mml;

var NEW = process.TEST_NEW;
var methodOut = true;
var defOut = false;
var jsonOut = true;
var simpleOut = false;

var createNode = function(type, children, def, text) {
  if (NEW) {
    var node = factory.create(type, def, children);
    if (text) {
      node.appendChild(text);
    }
    // TODO: Separate properties from proper attributes.
    node.attributes.setList(def);
  } else {
    node = (typeof text === 'undefined') ?
      MML[type].apply(MML, children).With(def) :
      MML[type](text).With(def);
  }
  printDef(def);
  printJSON(node);
  return node;
};
  

var createText = function(text) {
  if (text == null) {
    return null;
  }
  var node = NEW ? factory.create('text').setText(text) : MML.chars(text);
  printJSON(node);
  return node;
};


var createEntity = function(code) {
  return createText(String.fromCharCode(parseInt(code,16)));
};

var appendChildren = function(node, children) {
  if (NEW) {
    for (let child of children) {
      node.appendChild(child);
    }
  } else {
    node.Append.apply(node, children);
  }
};


var setAttribute = function(node, attribute, value) {
  if (NEW) {
    console.log(node.attributes.set);
    node.attributes.set(attribute, value);
  } else {
    node[attribute] = value;
  }
};


var setData = function(node, position, item) {
  if (NEW) {
    // Here we assume that everything in data are actually proper nodes!
    node.childNodes[position] = item;
    item.parent = node;
    // for (let child of node.childNodes) {
    //   if (child) {console.log(child.parent)};
    // }
  } else {
    node.SetData(position, item);
  }
};

var isType = function(node, type) {
  return NEW ? node.isKind(type) : node.type === type;
};

var isClass = function(node, type) {
  return NEW ? node.isKind(type) : node.isa(MML[type]);
};

var isEmbellished = function(node) {
  return NEW ? node.isEmbellished : node.isEmbellished();
};

var cleanSubSup = function(node) {
  console.log('Cleaning');
  let rewrite = [];
  node.walkTree((n, d) => {
    const children = n.childNodes;
    if ((n.kind === 'msubsup' && (!children[n.sub] || !children[n.sup])) ||
        (n.isKind('munderover') && (!children[n.under] || !children[n.over]))) {
      d.unshift(n);
    }
  }, rewrite);
  for (const n of rewrite) {
    const children = n.childNodes;
    const parent = n.parent;
    let newNode = (n.isKind('msubsup')) ?
          (children[n.sub] ?
           createNode('msub', [children[n.base], children[n.sub]], {}) :
           createNode('msup', [children[n.base], children[n.sup]], {})) :
        (children[n.under] ?
         createNode('munder', [children[n.base], children[n.under]], {}) :
         createNode('mover', [children[n.base], children[n.over]], {}));
    if (parent) {
      parent.replaceChild(newNode, n);
    } else {
      node = newNode;
    }
  }
  return node;
};

// Unused?
// var setVariant = function(node, variant) {
//   if (NEW) {
//     // console.log(node.attributes);
//     // console.log('Setting variant: ' + variant);
//     // node.attributes.set('mathvariant', variant);
//     // node.attributes.inherited['mathvariant'] = variant;
//     // console.log(node.attributes.getAllInherited());
//     // node.mathvariant = variant;
//   } else {
//     // This probably sets things twice in most cases!
//     node.With({'mathvariant': variant});
//   }
// };


// var setStretchy = function(node, variant) {
//   console.log(node.attributes);
//   console.log('Setting variant: ' + variant);
//   node.attributes.set('mathvariant', variant);
//   node.attributes.inherited['mathvariant'] = variant;
//   console.log(node.attributes.getAllInherited());
//   // node.mathvariant = variant;
// };


var printSimple = function(txt) {
  if (simpleOut) {
    console.log(txt);
  }
};

var untested = function(kind) {
  console.log("Untested case " + kind);
};

var printMethod = function(text) {
  if (methodOut) {
    console.log("In " + text);
  }
};

var printNew = function(node) {
  console.log(visitor.visitNode(node));
};

var printOld = function(node) {
  var mmlNode = node.toMmlNode(factory);
  console.log(visitor.visitNode(mmlNode));  
};


var printJSON = function(node) {
  if (jsonOut) {
    if (NEW) {
      printNew(node);
    } else {
      printOld(node);
    }
  }
};

var printDef = function(def) {
  if (methodOut && defOut) {
    console.log("With:");
    for (var x in def) {
      console.log(x + ": " + def[x]);
    }
  }
};

(function (TEX,HUB,AJAX) {

  var NBSP = "\u00A0"; 
  var MML = MathJax.ElementJax.mml;
  
  var _ = function (id) {
    return MathJax.Localization._.apply(MathJax.Localization,
      [["TeX", id]].concat([].slice.call(arguments,1)));
  };
  
  var isArray = MathJax.Object.isArray;

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
        // VS: NEW
        if (item instanceof mmlNode.AbstractMmlNode) {
          item = STACKITEM.mml(item);
        }
        // VS: OLD
        if (item instanceof MML.mbase) {
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
      printMethod('StackItem Push arguments: ' + this.data + ' arguments: ');
      printSimple(arguments);
      this.data.push.apply(this.data,arguments)},
    Pop: function () {return this.data.pop()},
    getType: function() {return this.type;},
    hasType: function(type) {return type === this.getType();},
    mmlData: function (inferred,forceRow) {
      printMethod('mmlData');
      console.log(this.data);
      console.log(this.data[0]);
      if (inferred == null) {inferred = true}
      if (this.data.length === 1 && !forceRow) {
        console.log('End 1');
        return this.data[0]}
      // @test Two Identifiers
      var node = createNode('mrow', this.data, inferred ? {inferred: true}: {});
      // VS: OLD
      // var node = MML.mrow.apply(MML,this.data).With((inferred ? {inferred: true}: {}));
      console.log('End 2');
      return node;
    },
    checkItem: function (item) {
      printMethod('Checkitem base for ' + item.getType() + ' with ' + item);
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
      printMethod('Checkitem start');
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
      printMethod('Checkitem open');
      if (item.hasType('close')) {
        var mml = this.mmlData();
        // @test PrimeSup
        console.log(mml);
        if (NEW) {
          // TODO: Move that into mmlData?
          mml = cleanSubSup(mml);
          console.log(mml);
        }
        var node = createNode('TeXAtom', [mml], {});
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
      printMethod('Checkitem prime');
      if (!isType(this.data[0], "msubsup")) {
        // @test Prime, Double Prime
        var node = createNode('msup', [this.data[0],this.data[1]], {});
        // VS: OLD
        // var node = MML.msup(this.data[0],this.data[1]);
        return [node, item];
      }
      setData(this.data[0], this.data[0].sup,this.data[1]);
      return [this.data[0],item];
    }
  });
  
  STACKITEM.subsup = STACKITEM.Subclass({
    type: "subsup",
    stopError: /*_()*/ ["MissingScript","Missing superscript or subscript argument"],
    supError:  /*_()*/ ["MissingOpenForSup","Missing open brace for superscript"],
    subError:  /*_()*/ ["MissingOpenForSub","Missing open brace for subscript"],
    checkItem: function (item) {
      printMethod('Checkitem subsup');
      if (item.hasType('open') || item.hasType('left')) {return true}
      if (item.hasType('mml')) {
        if (this.primes) {
          if (this.position !== 2) {
            // @test Prime on Sub
            setData(this.data[0], 2, this.primes);
          }
          else {
            // @test Prime on Prime
            if (NEW) {
              this.primes.setProperty('variantForm', true);
            } else {
              this.primes.With({variantForm:true});
            }
            var node = createNode('mrow', [this.primes, item.data[0]], {});
            // VS: OLD
            // var node = MML.mrow(this.primes, item.data[0]);
            item.data[0] = node;
          }
        }
        setData(this.data[0], this.position, item.data[0]);
        if (this.movesupsub != null) {
          this.data[0].movesupsub = this.movesupsub;
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
      printMethod('Checkitem over');
      if (item.hasType('over')) {
        // @test Double Over
        TEX.Error(["AmbiguousUseOf","Ambiguous use of %1",item.name]);
      }
      if (item.isClose) {
        var mml = createNode('mfrac', [this.num, this.mmlData(false)], {});
        // VS: OLD
        // var mml = MML.mfrac(this.num,this.mmlData(false));
        if (this.thickness != null) {
          setAttribute(mml, 'linethickness', this.thickness);
        }
        if (this.open || this.close) {
          mml.texWithDelims = true;
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
      printMethod('Checkitem left');
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
      printMethod('Checkitem begin');
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
      printMethod('Checkitem style');
      if (!item.isClose) {return this.SUPER(arguments).checkItem.call(this,item)}
      // @test Style
      var mml = createNode('mstyle', this.data, this.styles);
      // VS: OLD
      // var mml = MML.mstyle.apply(MML,this.data).With(this.styles);
      return [STACKITEM.mml(mml),item];
    }
  });
  
  STACKITEM.position = STACKITEM.Subclass({
    type: "position",
    checkItem: function (item) {
      printMethod('Checkitem position');
      if (item.isClose) {TEX.Error(["MissingBoxFor","Missing box for %1",this.name])}
      if (item.isNotStack) {
        var mml = item.mmlData();
        switch (this.move) {
         case 'vertical':
          // @test Raise, Lower
          mml = createNode('mpadded', [mml], {height: this.dh, depth: this.dd, voffset: this.dh});
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
      printMethod('Checkitem array');
      if (item.isClose && !item.hasType('over')) {
        if (item.isEntry) {this.EndEntry(); this.clearEnv(); return false}
        if (item.isCR)    {this.EndEntry(); this.EndRow(); this.clearEnv(); return false}
        this.EndTable(); this.clearEnv();
        var scriptlevel = this.arraydef.scriptlevel; delete this.arraydef.scriptlevel;
        // @test Array1
        var mml = createNode('mtable', this.table, this.arraydef);
        // VS: OLD
        // var mml = MML.mtable.apply(MML,this.table).With(this.arraydef);
        if (this.frame.length === 4) {
          mml.frame = (this.frame.dashed ? "dashed" : "solid");
        } else if (this.frame.length) {
          mml.hasFrame = true;
          if (this.arraydef.rowlines) {this.arraydef.rowlines = this.arraydef.rowlines.replace(/none( none)+$/,"none")}
          // @test Array2
          mml = createNode('menclose', [mml], {notation: this.frame.join(" "), isFrame: true});
          // VS: OLD
          // mml = MML.menclose(mml).With({notation: this.frame.join(" "), isFrame: true});
          if ((this.arraydef.columnlines||"none") != "none" ||
              (this.arraydef.rowlines||"none") != "none") {mml.padding = 0} // HTML-CSS jax implements this
        }
        if (scriptlevel) {
          untested(3);
          mml = MML.mstyle(mml).With({scriptlevel: scriptlevel})}
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
      var mtd = createNode('mtd', this.data, {});
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
        var node = createNode('mlabeledtr', this.row, {});
        // VS: OLD
        // var node = MML.mlabeledtr.apply(MML,this.row);
      } else {
        // @test Array1, Array2
        node = createNode('mtr', this.row, {});
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
      printMethod('Checkitem fn');
      if (this.data[0]) {
        console.log('case 1');
        if (item.isOpen) {
          console.log('case 2');
          return true;
        }
        if (!item.hasType('fn')) {
          console.log('case 3');
          if (!item.hasType('mml') || !item.data[0]) {
            console.log('case 4');
            return [this.data[0],item];
          }
          if (isClass(item.data[0], 'mspace')) {
            untested(100);
            return [this.data[0],item];
          }
          var mml = item.data[0];
          if (isEmbellished(mml)) {
            console.log('case 5');
            mml = mml.CoreMO();
          }
          console.log(mml.Get);
          if ([0,0,1,1,0,1,1,0,0,0][mml.Get("texClass")]) {
            return [this.data[0],item];
          }
        }
        // @test Named Function
        var text = createText(MmlEntities.ENTITIES.ApplyFunction);
        var node = createNode('mo', [], {texClass:TEXCLASS.NONE}, text);
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
      printMethod('Checkitem not');
      var mml, c;
      if (item.hasType('open') || item.hasType('left')) {return true}
      if (item.hasType('mml') &&
          (isType(item.data[0], 'mo') || isType(item.data[0], 'mi') ||
           isType(item.data[0], 'mtext'))) {
        mml = item.data[0], c = mml.data.join("");
        if (c.length === 1 && !mml.movesupsub && mml.data.length === 1) {
          if (STACKITEM.not.remap.contains(c)) {
            // @test Negation Simple, Negation Complex
            var textNode = createText(STACKITEM.not.remap.lookup(c).char);
            setData(mml, 0, textNode);
            // VS: OLD
            // mml.SetData(0, MML.chars(STACKITEM.not.remap.lookup(c).char));
          } else {
            // @test Negation Explicit
            var textNode = createText("\u0338");
            appendChildren(mml, [textNode]);
            // VS: OLD
            // mml.Append(MML.chars("\u0338"));
          }
          return item;
        }
      }
      //  \mathrel{\rlap{\notChar}}
      // @test Negation Large
      textNode = createText("\u29F8");
      var mtextNode = createNode('mtext', [], {}, textNode);
      var paddedNode = createNode('mpadded', [mtextNode], {width: 0});
      mml = createNode('TeXAtom', [paddedNode], {texClass: TEXCLASS.REL});
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
      printMethod('Checkitem dots')
      if (item.hasType('open') || item.hasType('left')) {return true}
      var dots = this.ldots;
      // @test Operator Dots
      if (item.hasType('mml') && isEmbellished(item.data[0])) {
        var tclass = item.data[0].CoreMO().Get("texClass");
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
        if (typeof src[id] === 'object' && !isArray(src[id]) &&
           (typeof dst[id] === 'object' || typeof dst[id] === 'function')) 
             {this.Add(src[id],dst[id],src[id],nouser)}
          else if (!dst[id] || !dst[id].isUser || !nouser) {dst[id] = src[id]}
      }}
      return dst;
    }
  };
  var STARTUP = function () {
    // MML = MathJax.ElementJax.mml;

    HUB.Insert(TEXDEF,{
      number:  /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)*|\.[0-9]+)/,
      p_height: 1.2 / .85,   // cmex10 height plus depth over .85
      // TODO (VS): Retained these for AMScd.js.
      macros: {},
      special: {},
      environment: {},
      // TODO (VS): Temporary to collect configurations from extensions.
      configurations: []
    });
    
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
    printMethod("Init");
      this.string = string; this.i = 0; this.macroCount = 0;
      var ENV; if (env) {ENV = {}; for (var id in env) {if (env.hasOwnProperty(id)) {ENV[id] = env[id]}}}
      this.stack = TEX.Stack(ENV,!!env);
      NewParser.setup(this);
      TEXDEF.configurations.forEach(NewParser.append.bind(NewParser));
      this.Parse(); this.Push(STACKITEM.stop());
    },
    Parse: function () {
    printMethod("Parse");
      var c, n;
      while (this.i < this.string.length) {
        c = this.string.charAt(this.i++); n = c.charCodeAt(0);
        if (n >= 0xD800 && n < 0xDC00) {c += this.string.charAt(this.i++)}
        NewParser.parse('character', [c, this])
      }
    },
    Push: function (arg) {
    printMethod("Push");
      this.stack.Push(arg);
    },
    PushAll: function (args) {
    printMethod("PushAll");
      for(var i = 0, m = args.length; i < m; i++) {
        this.stack.Push(args[i]);
      } 
    },
    mml: function () {
      printMethod("mml");
      console.log(this.stack.Top().getType());
      if (!this.stack.Top().hasType('mml')) {
        return null}
      return this.stack.Top().data[0];
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
    printMethod("ControlSequence");
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
      printMethod("csMathchar0mi");
      var def = mchar.attributes || {mathvariant: TexConstant.Variant.ITALIC};
      // @test Greek
      var textNode = createText(mchar.char);
      var node = createNode('mi', [], def, textNode);
      // VS: OLD
      // var node = this.mmlToken(MML.mi(mchar.char).With(def));
      this.Push(this.mmlToken(node));
    },
    //
    //  Handle normal mathchar (as an mo)
    //
    csMathchar0mo: function (mchar) {
    printMethod("csMathchar0mo");
      var def = mchar.attributes || {};
      def.stretchy = false;
      // @test Large Set
      var textNode = createText(mchar.char);
      var node = createNode('mo', [], def, textNode);
      // PROBLEM: Attributes stop working when Char7 are explicitly set.
      // VS: OLD
      // var node = this.mmlToken(MML.mo(mchar.char).With(def))
      this.Push(this.mmlToken(node));
    },
    //
    //  Handle mathchar in current family
    //
    csMathchar7: function (mchar) {
    printMethod("csMathchar7");
      var def = mchar.attributes || {mathvariant: TexConstant.Variant.NORMAL};
      if (this.stack.env.font) {
        // @test MathChar7 Single Font
        def.mathvariant = this.stack.env.font;
      }
      // @test MathChar7 Single, MathChar7 Operator, MathChar7 Multi
      var textNode = createText(mchar.char);
      var node = createNode('mi', [], def, textNode);
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
    printMethod("csDelimiter");
      var def = delim.attributes || {};
      // @test Fenced2, Delimiter (AMS)
      def = Object.assign({fence: false, stretchy: false}, def);
      var textNode = createText(delim.char);
      var node = createNode('mo', [], def, textNode);
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
    printMethod("csUndefined");
      TEX.Error(["UndefinedControlSequence","Undefined control sequence %1",'\\' + name]);
    },
    envUndefined: function(env) {
    printMethod("envUndefined");
      TEX.Error(["UnknownEnv", "Unknown environment '%1'", env]);
    },
    
    /*
     *  Handle a variable (a single letter)
     */
    Variable: function (c) {
      printMethod("Variable");
      var def = {};
      if (this.stack.env.font) {
        // @test Identifier Font
        def.mathvariant = this.stack.env.font;
      }
      // @test Identifier
      var textNode = createText(c);
      var node = createNode('mi', [], def, textNode);
      // VS: OLD
      // node = MML.mi(MML.chars(c)).With(def);
      this.Push(this.mmlToken(node));
    },

    /*
     *  Determine the extent of a number (pattern may need work)
     */
    Number: function (c) {
      printMethod("Number");
      var mml, n = this.string.slice(this.i-1).match(TEXDEF.number);
      var def = {};
      if (this.stack.env.font) {
        // @test Integer Font
        def.mathvariant = this.stack.env.font;
      }
      if (n) {
        // @test Integer, Number
        var textNode = createText(n[0].replace(/[{}]/g,""));
        mml = createNode('mn', [], def, textNode);
        this.i += n[0].length - 1;
      } else {
        // @test Decimal
        var textNode = createText(c);
        mml = createNode('mo', [], def, textNode);
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
      // var textNode = createText(MmlEntities.ENTITIES.nbsp);
      var textNode = createText(NBSP);
      var node = createNode('mtext', [], {}, textNode);
      // VS: OLD
      // node = MML.mtext(MML.chars(NBSP))
      this.Push(node);
    },
    Space: function (c) {},
    
    /*
     *  Handle ^, _, and '
     */
    Superscript: function (c) {
    printMethod("Superscript");
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
          var textNode = createText("");
          base = createNode('mi', [], {}, textNode);
          // VS: OLD
          // base = MML.mi("");
        }
      }
      if (base.isEmbellishedWrapper) {
        // TODO: Warning, those are childNodes now!
        base = base.data[0].data[0];
      }
      var movesupsub = base.movesupsub, position = base.sup;
      console.log(base.type);
      console.log(base.kind);
      console.log(base.sup);
      if ((isType(base, "msubsup") && base.data[base.sup]) ||
          (isType(base, "munderover") && base.data[base.over] && !base.subsupOK)) {
        // @test Double-super-error, Double-over-error
        TEX.Error(["DoubleExponent","Double exponent: use braces to clarify"]);
      }
      if (!isType(base, "msubsup")) {
        console.log('Case 1');
        if (movesupsub) {
        console.log('Case 2');
          // @test Move Superscript, Large Operator
          if (!isType(base, "munderover") || base.data[base.over]) {
        console.log('Case 3');
            if (base.movablelimits && isClass(base, 'mi')) {
              // @test Mathop Super
              base = this.mi2mo(base);
            }
            // @test Large Operator
            base = createNode('munderover', [base], {movesupsub:true});
            // VS: OLD
            // base = MML.munderover(base,null,null).With({movesupsub:true});
          }
          position = base.over;
        } else {
        console.log('Case 4');
          // @test Empty base, Empty base2, Square, Cube
          base = createNode('msubsup', [base], {});
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
    printMethod("Subscript");
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
          var textNode = createText("");
          base = createNode('mi', [], {}, textNode);
          // VS: OLD
          // base = MML.mi("");
        }
      }
      if (base.isEmbellishedWrapper) {
        // TODO: Warning, those are childNodes now!
        base = base.data[0].data[0];
      }
      var movesupsub = base.movesupsub, position = base.sub;
      if ((isType(base, "msubsup") && base.data[base.sub]) ||
          (isType(base, "munderover") && base.data[base.under] && !base.subsupOK)) {
        // @test Double-sub-error, Double-under-error
        TEX.Error(["DoubleSubscripts","Double subscripts: use braces to clarify"]);
      }
      if (!isType(base, "msubsup")) {
        if (movesupsub) {
          // @test Large Operator, Move Superscript
          if (!isType(base, "munderover") || base.data[base.under]) {
            if (base.movablelimits && isClass(base, 'mi')) {
              // @test Mathop Sub
              base = this.mi2mo(base);
            }
            // @test Move Superscript
            base = createNode('munderover', [base], {movesupsub:true});
            // VS: OLD
            // base = MML.munderover(base,null,null).With({movesupsub:true});
          }
          position = base.under;
        } else {
          // @test Empty Base Index, Empty, Base Index2, Index
          base = createNode('msubsup', [base], {});
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
        base = createNode('mi', [], {});
        // VS: OLD
        // base = MML.mi();
      }
      if (isType(base, "msubsup") && base.data[base.sup]) {
        // @test Double Prime Error
        TEX.Error(["DoubleExponentPrime",
                   "Prime causes double exponent: use braces to clarify"]);
      }
      var sup = ""; this.i--;
      do {sup += this.PRIME; this.i++, c = this.GetNext()}
        while (c === "'" || c === this.SMARTQUOTE);
      sup = ["","\u2032","\u2033","\u2034","\u2057"][sup.length] || sup;
      var textNode = createText(sup);
      var node = createNode('mo', [], {}, textNode);
      // VS: OLD
      // var node = MML.mo(sup);
      this.Push(STACKITEM.prime(base, this.mmlToken(node)));
    },
    mi2mo: function (mi) {
    printMethod("mi2mo");
      // @test Mathop Sub, Mathop Super
      var mo = MML.mo();
      appendChildren(mo, mi.data);
      var id;
      // TODO: Figure out how to copy these attributes.
      for (id in mo.defaults) {
        if (mo.defaults.hasOwnProperty(id) && mi[id] != null) {
          mo[id] = mi[id];
        }
      }
      for (id in MML.copyAttributes) {
        if (MML.copyAttributes.hasOwnProperty(id) && mi[id] != null) {
          mo[id] = mi[id];
        }
      }
      // TODO: Do this with get('lspace') etc.
      mo.lspace = mo.rspace = "0";  // prevent mo from having space in NativeMML
      mo.useMMLspacing &= ~(mo.SPACE_ATTR.lspace | mo.SPACE_ATTR.rspace);  // don't count these explicit settings
      return mo;
    },
    
    /*
     *  Handle comments
     */
    Comment: function (c) {
    printMethod("Comment");
      while (this.i < this.string.length && this.string.charAt(this.i) != "\n") {this.i++}
    },
    
    /*
     *  Handle hash marks outside of definitions
     */
    Hash: function (c) {
    printMethod("Hash");
      // @test Hash Error
      TEX.Error(["CantUseHash1",
                 "You can't use 'macro parameter character #' in math mode"]);
    },
    
    /*
     *  Handle other characters (as <mo> elements)
     */
    Other: function (c) {
    printMethod("Other");
      var def, mo;
      if (this.stack.env.font) {
        // @test Other Font
        def = {mathvariant: this.stack.env.font};
      }
      var remap = this.remap.lookup(c);
      // @test Other
      // @test Other Remap
      var textNode = createText(remap ? remap.char : c);
      mo = createNode('mo', [], def, textNode);
      // VS: OLD
      // mo = remap ? MML.mo(remap.char).With(def) : MML.mo(c).With(def);
      // VS: Question: What do these autoDefault methods do exactly.
      //     Is there a modern equivalent in v3?
      // 
      //   This changes the operator class, when fences are put around it. Just
      //   propagate from the inherited attributes or properties.
      if (mo.autoDefault("stretchy",true)) {
        // @test A Rogers-Ramanujan Identity
        mo.stretchy = false;
      }
      if (mo.autoDefault("texClass",true) == "") {
        // @test A Rogers-Ramanujan Identity
        mo = createNode('TeXAtom', [mo], {});
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
      printMethod("SetStyle: " + name + " texStyle: " + texStyle +
                " style: " + style + " level: " + level);
      this.stack.env.style = texStyle; this.stack.env.level = level;
      this.Push(STACKITEM.style().With({styles: {displaystyle: style, scriptlevel: level}}));
    },
    SetSize: function (name,size) {
    printMethod("SetSize");
      this.stack.env.size = size;
      this.Push(STACKITEM.style().With({styles: {mathsize: size+"em"}})); // convert to absolute?
    },

    // Look at color extension!
    Color: function (name) {
    printMethod("Color");
      // @test Color Frac
      var color = this.GetArgument(name);
      var old = this.stack.env.color;
      this.stack.env.color = color;
      var math = this.ParseArg(name);
      if (old) {this.stack.env.color} else {delete this.stack.env.color}
      var node = createNode('mstyle', [math], {mathcolor: color});
      // VS: OLD
      // var node = MML.mstyle(math).With({mathcolor: color});
      this.Push(node);
    },
    
    Spacer: function (name,space) {
      // @test Positive Spacing, Negative Spacing
      var node = createNode('mspace', [],
                            {width: space, mathsize: TexConstant.Size.NORMAL, scriptlevel:0});
      // VS: OLD
      // var node = MML.mspace().With({width: space, mathsize: MML.SIZE.NORMAL, scriptlevel:0});
      this.Push(node);
    },
    
    LeftRight: function (name) {
      printMethod("LeftRight");
      // @test Fenced, Fenced3
      this.Push(STACKITEM[name.substr(1)]().With({delim: this.GetDelimiter(name)}));
    },
    
    Middle: function (name) {
      printMethod("Middle");
      // @test Middle
      var delim = this.GetDelimiter(name);
      var node = createNode('TeXAtom', [], {texClass:TEXCLASS.CLOSE});
      // VS: OLD
      // var node = MML.TeXAtom().With({texClass:TEXCLASS.CLOSE});
      this.Push(node);
      if (!this.stack.Top().hasType('left')) {
        // @test Orphan Middle, Middle with Right
        TEX.Error(["MisplacedMiddle","%1 must be within \\left and \\right",name]);
      }
      var textNode = createText(delim);
      node = createNode('mo', [], {stretchy:true}, textNode);
      // VS: OLD
      // node = MML.mo(delim).With({stretchy:true});
      this.Push(node);
      node = createNode('TeXAtom', [], {texClass:TEXCLASS.OPEN});
      // VS: OLD
      // node = MML.TeXAtom().With({texClass:MML.TEXCLASS.OPEN});
      this.Push(node);
    },
    
    NamedFn: function (name,id) {
      printMethod("NamedFn");
      // @test Named Function
      if (!id) {id = name.substr(1)};
      var textNode = createText(id);
      var mml = createNode('mi', [], {texClass: TEXCLASS.OP}, textNode);
      // VS: OLD
      // var mml = MML.mi(id).With({texClass: MML.TEXCLASS.OP});
      this.Push(STACKITEM.fn(this.mmlToken(mml)));
    },
    NamedOp: function (name,id) {
      printMethod("NamedOp");
      if (!id) {id = name.substr(1)};
      id = id.replace(/&thinsp;/,"\u2006");
      var mml = createNode('mo', [id], {
        movablelimits: true,
        movesupsub: true,
        form: TexConstant.Form.PREFIX,
        texClass: TEXCLASS.OP
      });
      // VS: OLD
      // var mml = MML.mo(id).With({
      //   movablelimits: true,
      //   movesupsub: true,
      //   form: MML.FORM.PREFIX,
      //   texClass: MML.TEXCLASS.OP
      // });
      // TODO: Sort this out with get('form');
      mml.useMMLspacing &= ~mml.SPACE_ATTR.form;  // don't count this explicit form setting
      this.Push(this.mmlToken(mml));
    },
    Limits: function (name,limits) {
      printMethod("Limits");
      // @test Limits
      var op = this.stack.Prev("nopop");
      if (!op || (op.Get("texClass") !== TEXCLASS.OP && op.movesupsub == null)) {
        // @test Limits Error
        TEX.Error(["MisplacedLimits","%1 is allowed only on operators",name]);
      }
      var top = this.stack.Top();
      if (isType(op, "munderover") && !limits) {
        // @test Limits UnderOver
        var node = createNode('msubsup', op.data, {});
        // VS: OLD
        // var node = MML.msubsup.apply(MML.subsup,op.data);
        op = top.data[top.data.length-1] = node;
      } else if (isType(op, "msubsup") && limits) {
        // @test Limits SubSup
        node = createNode('munderover', op.data, {});
        // VS: OLD
        // node = MML.munderover.apply(MML.underover,op.data);
        op = top.data[top.data.length-1] = node;
      }
      // TODO: Turns this into properties.
      op.movesupsub = (limits ? true : false);
      op.Core().movablelimits = false;
      if (op.movablelimits) op.movablelimits = false;
    },
    
    Over: function (name,open,close) {
      printMethod("Over");
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
      printMethod("Frac");
      // @test Frac
      var num = this.ParseArg(name);
      var den = this.ParseArg(name);
      var node = createNode('mfrac', [num, den], {});
      // VS: OLD
      // var node = MML.mfrac(num, den);
      this.Push(node);
    },

    Sqrt: function (name) {
      printMethod("Sqrt");
      var n = this.GetBrackets(name), arg = this.GetArgument(name);
      if (arg === "\\frac") {arg += "{"+this.GetArgument(arg)+"}{"+this.GetArgument(arg)+"}"}
      var mml = TEX.Parse(arg,this.stack.env).mml();
      if (!n) {
        // @test Square Root
        mml = createNode('msqrt', mml.array(), {});
        // VS: OLD
        // mml = MML.msqrt.apply(MML,mml.array());
      } else {
        // @test General Root
        mml = createNode('mroot', [mml, this.parseRoot(n)], {});
        // VS: OLD
        // mml = MML.mroot(mml,this.parseRoot(n));
      }
      this.Push(mml);
    },
    Root: function (name) {
      printMethod("Root");
      var n = this.GetUpTo(name,"\\of");
      var arg = this.ParseArg(name);
      var node = createNode('mroot', [arg ,this.parseRoot(n)], {});
      // VS: OLD
      // var node = MML.mroot(arg,this.parseRoot(n));
      this.Push(node);
    },
    parseRoot: function (n) {
    printMethod("parseRoot");
      // @test General Root, Explicit Root
      var env = this.stack.env, inRoot = env.inRoot; env.inRoot = true;
      // TODO: This parser call might change!
      var parser = TEX.Parse(n,env);
      n = parser.mml();
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
        
        n = createNode('mpadded', [n], def);
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
    printMethod("MoveRoot");
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
      printSimple(n);
      if (!n.match(/-?[0-9]+/)) {
        // @test Incorrect Move Root
        TEX.Error(["IntegerArg","The argument to %1 must be an integer",name]);
      }
      n = (n/15)+"em";
      if (n.substr(0,1) !== "-") {n = "+"+n}
      this.stack.global[id] = n;
    },
    
    Accent: function (name,accent,stretchy) {
      printMethod("Accent");
      // @test Vector
      var c = this.ParseArg(name);
      var def = {accent: true};
      if (this.stack.env.font) {
        // @test Vector Font
        def.mathvariant = this.stack.env.font;
      }
      var entity = createEntity(accent);
      var moNode = createNode('mo', [], def, entity);
      // VS: OLD
      // var entity = MML.entity("#x"+accent);
      // var moNode = MML.mo(entity).With(def);
      var mml = this.mmlToken(moNode);
      // TODO: This should be property?
      mml.stretchy = (stretchy ? true : false);
      // @test Vector Op, Vector
      var mo = (isEmbellished(c) ? c.CoreMO() : c);
      if (isClass(mo, 'mo')) {
        // @test Vector Op
        mo.movablelimits = false;
      }
      var muoNode = createNode('munderover', [c,null,mml], {accent: true});
      var texAtom = createNode('TeXAtom', [muoNode], {});
      // VS: OLD
      // var muoNode = MML.munderover(c,null,mml).With({accent: true});
      // var texAtom = MML.TeXAtom(muoNode);
      this.Push(texAtom);
    },
    
    UnderOver: function (name,c,stack,noaccent) {
      printMethod("UnderOver");
      // @test Overline
      var pos = {o: "over", u: "under"}[name.charAt(1)];
      var base = this.ParseArg(name);
      // TODO: Sort this one out!
      if (base.Get("movablelimits")) {
        // @test Overline Sum
        base.movablelimits = false;
      }
      if (isClass(base, 'munderover') && isEmbellished(base)) {
        // @test Overline Limits
        // TODO: Sort these properties out!
        base.Core().With({lspace:0,rspace:0}); // get spacing right for NativeMML
        var mo = createNode('mo', [], {rspace:0});
        base = createNode('mrow', [mo,base], {});  // add an empty <mi> so it's not embellished any more
        // VS: OLD
        // var mo = MML.mo().With({rspace:0});
        // base = MML.mrow(mo,base);  // add an empty <mi> so it's not embellished any more
      }
      var mml = createNode('munderover', [base,null,null], {});
      var entity = createEntity(c);
      mo = createNode('mo', [], {stretchy:true, accent:!noaccent}, entity);
      // VS: OLD
      // var mml = MML.munderover(base,null,null);
      // var entity = MML.entity("#x"+c);
      // mo = MML.mo(entity).With({stretchy:true, accent:!noaccent});

      setData(
        mml,
        mml[pos], 
        this.mmlToken(mo)
      );

      if (stack) {
        untested(8);
        mml = MML.TeXAtom(mml).With({texClass:MML.TEXCLASS.OP, movesupsub:true});
      }
      // TODO: Sort these properties out!
      this.Push(mml.With({subsupOK:true}));
    },
    
    Overset: function (name) {
      printMethod("Overset");
      // @test Overset
      var top = this.ParseArg(name), base = this.ParseArg(name);
      if (base.movablelimits) base.movablelimits = false;
      var node = createNode('mover', [base, top], {});
      // VS: OLD
      // var node = MML.mover(base,top); 
      this.Push(node);
    },
    Underset: function (name) {
      printMethod("Underset");
      // @test Underset
      var bot = this.ParseArg(name), base = this.ParseArg(name);
      if (base.movablelimits) base.movablelimits = false;
      var node = createNode('munder', [base, bot], {});
      // VS: OLD
      // var node = MML.munder(base,bot);
      this.Push(node);
    },
    
    TeXAtom: function (name,mclass) {
      printMethod("TeXAtom");
      var def = {texClass: mclass}, mml, node;
      if (mclass == TEXCLASS.OP) {
        def.movesupsub = def.movablelimits = true;
        var arg = this.GetArgument(name);
        var match = arg.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
        if (match) {
          // @test Mathop
          def.mathvariant = TexConstant.Variant.NORMAL;
          node = createNode('mi', [match[1]], def);
          // VS: OLD
          // node = MML.mi(match[1]).With(def);
          mml = STACKITEM.fn(this.mmlToken(node));
        } else {
          // @test Mathop Cal
          var parsed = TEX.Parse(arg,this.stack.env).mml();
          node = createNode('TeXAtom', [parsed], def);
          // VS: OLD
          // node = MML.TeXAtom(parsed).With(def);
          mml = STACKITEM.fn(node);
        }
      } else {
        // @test Mathrel
        parsed = this.ParseArg(name);
        mml = createNode('TeXAtom', [parsed], def);
        // VS: OLD
        // mml = MML.TeXAtom(parsed).With(def);
      }
      this.Push(mml);
    },

    // VS: This method is only called during a macro call.
    MmlToken: function (name) {
    printMethod("MmlToken");
      var type = this.GetArgument(name),
          attr = this.GetBrackets(name,"").replace(/^\s+/,""),
          data = this.GetArgument(name),
          def = {attrNames:[]}, match;
      printSimple("Start mmlToken: type: " + type + " data: " + data);
      if (!MML[type] || !MML[type].prototype.isToken)
        {TEX.Error(["NotMathMLToken","%1 is not a token element",type])}
      while (attr !== "") {
        match = attr.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i);
        if (!match)
          {TEX.Error(["InvalidMathMLAttr","Invalid MathML attribute: %1",attr])}
        if (MML[type].prototype.defaults[match[1]] == null && !this.MmlTokenAllow[match[1]]) {
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
      printSimple("End mmlToken: type: " + type + " data: " + data);
      this.Push(this.mmlToken(MML[type](data).With(def)));
    },
    MmlFilterAttribute: function (name,value) {return value},
    MmlTokenAllow: {
      fontfamily:1, fontsize:1, fontweight:1, fontstyle:1,
      color:1, background:1,
      id:1, "class":1, href:1, style:1
    },
    
    Strut: function (name) {
    printMethod("Strut");
      this.Push(MML.mpadded(MML.mrow()).With({height: "8.6pt", depth: "3pt", width: 0}));
    },
    
    Phantom: function (name,v,h) {
    printMethod("Phantom");
      var box = MML.mphantom(this.ParseArg(name));
      if (v || h) {
        box = MML.mpadded(box);
        if (h) {box.height = box.depth = 0}
        if (v) {box.width = 0}
      }
      this.Push(MML.TeXAtom(box));
    },
    
    Smash: function (name) {
    printMethod("Smash");
      var bt = this.trimSpaces(this.GetBrackets(name,""));
      var smash = MML.mpadded(this.ParseArg(name));
      switch (bt) {
        case "b": smash.depth = 0; break;
        case "t": smash.height = 0; break;
        default: smash.height = smash.depth = 0;
      }
      this.Push(MML.TeXAtom(smash));
    },
    
    Lap: function (name) {
    printMethod("Lap");
      var mml = MML.mpadded(this.ParseArg(name)).With({width: 0});
      if (name === "\\llap") {mml.lspace = "-1width"}
      this.Push(MML.TeXAtom(mml));
    },
    
    RaiseLower: function (name) {
    printMethod("RaiseLower");
      var h = this.GetDimen(name);
      var item = STACKITEM.position().With({name: name, move: 'vertical'});
      if (h.charAt(0) === '-') {h = h.slice(1); name = {raise: "\\lower", lower: "\\raise"}[name.substr(1)]}
      if (name === "\\lower") {item.dh = '-'+h; item.dd = '+'+h} else {item.dh = '+'+h; item.dd = '-'+h}
      this.Push(item);
    },
    
    MoveLeftRight: function (name) {
    printMethod("MoveLeftRight");
      var h = this.GetDimen(name);
      var nh = (h.charAt(0) === '-' ? h.slice(1) : '-'+h);
      if (name === "\\moveleft") {var tmp = h; h = nh; nh = tmp}
      this.Push(STACKITEM.position().With({
        name: name, move: 'horizontal',
        left:  MML.mspace().With({width: h, mathsize: MML.SIZE.NORMAL}),
        right: MML.mspace().With({width: nh, mathsize: MML.SIZE.NORMAL})
      }));
    },
    
    Hskip: function (name) {
    printMethod("Hskip");
      this.Push(MML.mspace().With({width: this.GetDimen(name), mathsize: MML.SIZE.NORMAL}));
    },
    
    Rule: function (name,style) {
    printMethod("Rule");
      var w = this.GetDimen(name),
          h = this.GetDimen(name),
          d = this.GetDimen(name);
      var def = {width:w, height:h, depth:d};
      if (style !== 'blank') {
        def.mathbackground = (this.stack.env.color || "black");
      }
      this.Push(MML.mspace().With(def));
    },
    rule: function (name) {
    printMethod("rule");
      var v = this.GetBrackets(name),
          w = this.GetDimen(name),
          h = this.GetDimen(name);
      var mml = MML.mspace().With({
        width: w, height:h,
        mathbackground: (this.stack.env.color || "black")
      });
      if (v) {
        mml = MML.mpadded(mml).With({voffset: v});
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
    printMethod("MakeBig");
      size *= TEXDEF.p_height;
      size = String(size).replace(/(\.\d\d\d).+/,'$1')+"em";
      var delim = this.GetDelimiter(name,true);
      this.Push(MML.TeXAtom(MML.mo(delim).With({
        minsize: size, maxsize: size,
        fence: true, stretchy: true, symmetric: true
      })).With({texClass: mclass}));
    },
    
    BuildRel: function (name) {
    printMethod("BuildRel");
      var top = this.ParseUpTo(name,"\\over");
      var bot = this.ParseArg(name);
      this.Push(MML.TeXAtom(MML.munderover(bot,null,top)).With({texClass: MML.TEXCLASS.REL}));
    },
    
    HBox: function (name,style) {
    printMethod("HBox");
      this.PushAll(this.InternalMath(this.GetArgument(name),style));
    },
    
    FBox: function (name) {
    printMethod("FBox");
      this.Push(MML.menclose.apply(MML,this.InternalMath(this.GetArgument(name))).With({notation:"box"}));
    },
    
    Not: function (name) {
    printMethod("Not");
      this.Push(STACKITEM.not());
    },
    
    Dots: function (name) {
    printMethod("Dots");
      this.Push(STACKITEM.dots().With({
        ldots: this.mmlToken(MML.mo(MML.entity("#x2026")).With({stretchy:false})),
        cdots: this.mmlToken(MML.mo(MML.entity("#x22EF")).With({stretchy:false}))
      }));
    },
    
    Require: function (name) {
    printMethod("Require");
      var file = this.GetArgument(name)
        .replace(/.*\//,"")            // remove any leading path
        .replace(/[^a-z0-9_.-]/ig,""); // remove illegal characters
      this.Extension(null,file);
    },
    
    Extension: function (name,file,array) {
    printMethod("Extension");
      if (name && !typeof(name) === "string") {name = name.name}
      file = TEX.extensionDir+"/"+file;
      if (!file.match(/\.js$/)) {file += ".js"}
      if (!AJAX.loaded[AJAX.fileURL(file)]) {
        if (name != null) {delete TEXDEF[array || 'macros'][name.replace(/^\\/,"")]}
        HUB.RestartAfter(AJAX.Require(file));
      }
    },
    
    Macro: function (name,macro,argcount,def) {
    printMethod("Macro");
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
    printMethod("Matrix");
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
    printMethod("Entry");
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
    printMethod("Cr");
      this.Push(STACKITEM.cell().With({isCR: true, name: name}));
    },
    
    CrLaTeX: function (name) {
    printMethod("CrLaTeX");
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
      if (top.isa(STACKITEM.array)) {
        if (n && top.arraydef.rowspacing) {
          var rows = top.arraydef.rowspacing.split(/ /);
          if (!top.rowspacing) {top.rowspacing = this.dimen2em(rows[0])}
          while (rows.length < top.table.length) {rows.push(this.Em(top.rowspacing))}
          rows[top.table.length-1] = this.Em(Math.max(0,top.rowspacing+this.dimen2em(n)));
          top.arraydef.rowspacing = rows.join(' ');
        }
      } else {
        if (n) {this.Push(MML.mspace().With({depth:n}))}
        this.Push(MML.mspace().With({linebreak:MML.LINEBREAK.NEWLINE}));
      }
    },
    emPerInch: 7.2,
    pxPerInch: 72,
    matchDimen: function (dim) {
    // printMethod("matchDimen");
      return dim.match(/^(-?(?:\.\d+|\d+(?:\.\d*)?))(px|pt|em|ex|mu|pc|in|mm|cm)$/);
    },
    dimen2em: function (dim) {
    // printMethod("dimen2em");
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
    // printMethod("Em");
      if (Math.abs(m) < .0006) {return "0em"}
      return m.toFixed(3).replace(/\.?0+$/,"") + "em";
    },
    
    HLine: function (name,style) {
    printMethod("HLine");
      if (style == null) {style = "solid"}
      var top = this.stack.Top();
      if (!top.isa(STACKITEM.array) || top.data.length)
        {TEX.Error(["Misplaced","Misplaced %1",name])}
      if (top.table.length == 0) {
        top.frame.push("top");
      } else {
        var lines = (top.arraydef.rowlines ? top.arraydef.rowlines.split(/ /) : []);
        while (lines.length < top.table.length) {lines.push("none")}
        lines[top.table.length-1] = style;
        top.arraydef.rowlines = lines.join(' ');
      }
    },
    
    HFill: function (name) {
    printMethod("HFill");
      var top = this.stack.Top();
      if (top.isa(STACKITEM.array)) top.hfill.push(top.data.length);
        else TEX.Error(["UnsupportedHFill","Unsupported use of %1",name]);
    },
    

    
   /************************************************************************/
   /*
    *   LaTeX environments
    */

    BeginEnd: function (name) {
    printMethod("BeginEnd");
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
      printMethod("BeginEnvironment");
      var end = args[0];
      var mml = STACKITEM.begin().With({name: env, end: end, parse:this});
      mml = func.apply(this,[mml].concat(args.slice(1)));
      this.Push(mml);
    },

    Equation: function (begin,row) {return row},
    
    ExtensionEnv: function (begin,file) {this.Extension(begin.name,file,"environment")},
    
    Array: function (begin,open,close,align,spacing,vspacing,style,raggedHeight) {
    printMethod("Array");
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
    printMethod("AlignedArray");
      var align = this.GetBrackets("\\begin{"+begin.name+"}");
      return this.setArrayAlign(this.Array.apply(this,arguments),align);
    },
    setArrayAlign: function (array,align) {
    printMethod("setArrayAlign");
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
    printMethod("convertDelimiter");
      return NewParser.lookup('delimiter', c).char || null;
    },

    /*
     *  Trim spaces from a string
     */
    trimSpaces: function (text) {
    printMethod("trimSpaces");
      if (typeof(text) != 'string') {return text}
      var TEXT = text.replace(/^\s+|\s+$/g,'');
      if (TEXT.match(/\\$/) && text.match(/ $/)) TEXT += " ";
      return TEXT;
    },

    /*
     *   Check if the next character is a space
     */
    nextIsSpace: function () {
    printMethod("nextIsSpace");
      return this.string.charAt(this.i).match(/\s/);
    },
    
    /*
     *  Get the next non-space character
     */
    GetNext: function () {
    printMethod("GetNext");
      while (this.nextIsSpace()) {this.i++}
      return this.string.charAt(this.i);
    },
  
    /*
     *  Get and return a control-sequence name
     */
    GetCS: function () {
    printMethod("GetCS");
      var CS = this.string.slice(this.i).match(/^([a-z]+|.) ?/i);
      if (CS) {this.i += CS[1].length; return CS[1]} else {this.i++; return " "}
    },

    /*
     *  Get and return a TeX argument (either a single character or control sequence,
     *  or the contents of the next set of braces).
     */
    GetArgument: function (name,noneOK) {
    printMethod("GetArgument");
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
    printMethod("GetBrackets");
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
    printMethod("GetDelimiter");
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
    printMethod("GetDimen");
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
    printMethod("GetUpTo");
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
    printMethod("InternalMath");
      var def = (this.stack.env.font ? {mathvariant: this.stack.env.font} : {});
      var mml = [], i = 0, k = 0, c, match = '', braces = 0;
      if (text.match(/\\?[${}\\]|\\\(|\\(eq)?ref\s*\{/)) {
        while (i < text.length) {
          c = text.charAt(i++);
          if (c === '$') {
            if (match === '$' && braces === 0) {
              mml.push(MML.TeXAtom(TEX.Parse(text.slice(k,i-1),{}).mml()));
              match = ''; k = i;
            } else if (match === '') {
              if (k < i-1) mml.push(this.InternalText(text.slice(k,i-1),def));
              match = '$'; k = i;
            }
          } else if (c === '{' && match !== '') {
            braces++;
          } else if (c === '}') {
            if (match === '}' && braces === 0) {
              mml.push(MML.TeXAtom(TEX.Parse(text.slice(k,i),{}).mml().With(def)));
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
                mml.push(MML.TeXAtom(TEX.Parse(text.slice(k,i-2),{}).mml()));
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
        mml = [MML.mstyle.apply(MML,mml).With({displaystyle:false,scriptlevel:level})];
      } else if (mml.length > 1) {
        mml = [MML.mrow.apply(MML,mml)];
      }
      return mml;
    },
    InternalText: function (text,def) {
    printMethod("InternalText");
      text = text.replace(/^\s+/,NBSP).replace(/\s+$/,NBSP);
      return MML.mtext(MML.chars(text)).With(def);
    },

    /*
     *  Replace macro paramters with their values
     */
    SubstituteArgs: function (args,string) {
    printMethod("SubstituteArgs");
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
    printMethod("AddArgs");
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
      printMethod('Translate');
      console.log(script);
      var mml, isError = false, math = MathJax.HTML.getScript(script);
      var display = (script.type.replace(/\n/g," ").match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/) != null);
      var data = {math:math, display:display, script:script};
      var callback = this.prefilterHooks.Execute(data); if (callback) return callback;
      math = data.math;
      try {
        mml = TEX.Parse(math).mml();
        console.log('MML:');
        console.log(mml);
      } catch(err) {
        if (!err.texError) {throw err}
        mml = this.formatError(err,math,display,script);
        isError = true;
      }
      console.log("HERE?");
      console.log(mml);
      // VS: temporary (get INHERIT from attributes)
      if (NEW) {
        mml = cleanSubSup(mml);
        if (mml.isKind('mtable') && mml.attributes.get('displaystyle') === 'inherit') {
          mml.displaystyle = display;
        } // for tagged equations
        if (mml.isInferred) {
          var mathNode = createNode('math', mml, {});
        } else {
          // TODO: We should not need this case!
          if (mml.isKind('mrow') && !mml.isKind('math')) {
            mathNode = createNode('math', [], {});
            mathNode.setChildren(mml.childNodes);
          } else if (!mml.isKind('math')) {
            console.log('here2');
            mathNode = createNode('math', [mml], {});
            console.log('here3');
          } else {
            mathNode = mml;
          }
          
        }
        if (display) {
          mathNode.attributes.set("display", "block");
        }
        if (isError) {
          mathNode.texError = true;
        }
        // TODO: Apply the post filters: combination of relations etc.
        return mathNode;
      }
      // VS: OLD
      if (mml.isa(MML.mtable) && mml.displaystyle === "inherit") mml.displaystyle = display; // for tagged equations
      if (mml.inferred) {mml = MML.apply(MathJax.ElementJax,mml.data)} else {mml = MML(mml)}
      if (display) {mml.root.display = "block"}
      if (isError) {mml.texError = true}
      data.math = mml;
      return this.postfilterHooks.Execute(data) || data.math;
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
      HUB.signal.Post(["TeX Jax - parse error",message,math,display,script]);
      return MML.Error(message);
    },

    //
    //  Produce an error and stop processing this equation
    //
    Error: function (message) {
      //
      //  Translate message if it is ["id","message",args]
      //
      if (isArray(message)) {message = _.apply(_,message)}
      throw HUB.Insert(Error(message),{texError: true});
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
      printMethod('fenced');
      // @test Fenced, Fenced3
      var mrow = createNode('mrow', [], {open:open, close:close, texClass:TEXCLASS.INNER});
      var openNode = createText(open);
      var mo = createNode('mo', [],
                          {fence:true, stretchy:true, symmetric:true, texClass:TEXCLASS.OPEN},
                          openNode);
      appendChildren(mrow, [mo]);
      // VS: OLD
      // var mrow = MML.mrow().With({open:open, close:close, texClass:MML.TEXCLASS.INNER});
      // mrow.Append(
      //   MML.mo(open).With({fence:true, stretchy:true, symmetric:true, texClass:MML.TEXCLASS.OPEN})
      // );
      if (isType(mml, "mrow") && mml.inferred) {
        // @test Fenced
        appendChildren(mrow, mml.data);
      } else {
        // @test Fenced3
        appendChildren(mrow, [mml]);
      }
      var closeNode = createText(close);
      mo = createNode('mo', [],
                      {fence:true, stretchy:true, symmetric:true, texClass:TEXCLASS.CLOSE},
                      closeNode);
      appendChildren(mrow, [mo]);
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
      printMethod('fixedFence');
      var mrow = createNode('mrow', [], {open:open, close:close, texClass:MML.TEXCLASS.ORD});
      // VS: OLD
      // var mrow = MML.mrow().With({open:open, close:close, texClass:MML.TEXCLASS.ORD});
      if (open) {
        appendChildren(mrow, [this.mathPalette(open,"l")]);
      }
      if (isType(mml, "mrow")) {
        appendChildren(mrow, [mrow, mml.data]);
      } else {
        appendChildren(mrow, [mml]);
      }
      if (close) {
        appendChildren(mrow, [this.mathPalette(close,"r")]);
      }
      console.log(mrow);
      return mrow;
    },
    mathPalette: function (fence,side) {
      printMethod('mathPalette');
      if (fence === '{' || fence === '}') {fence = "\\"+fence}
      var D = '{\\bigg'+side+' '+fence+'}', T = '{\\big'+side+' '+fence+'}';
      return TEX.Parse('\\mathchoice'+D+T+T+T,{}).mml();
    },
    
    //
    //  Combine adjacent <mo> elements that are relations
    //    (since MathML treats the spacing very differently)
    //
    combineRelations: function (mml) {
      printMethod('combineRelations');
      var i, m, m1, m2;
      for (i = 0, m = mml.data.length; i < m; i++) {
        if (mml.data[i]) {
          if (mml.isa(MML.mrow)) {
            while (i+1 < m && (m1 = mml.data[i]) && (m2 = mml.data[i+1]) &&
                   m1.isa(MML.mo) && m2.isa(MML.mo) &&
                   m1.Get("texClass") === MML.TEXCLASS.REL &&
                   m2.Get("texClass") === MML.TEXCLASS.REL) {
              if (m1.variantForm == m2.variantForm &&
                  m1.Get("mathvariant") == m2.Get("mathvariant") && m1.style == m2.style &&
                  m1["class"] == m2["class"] && !m1.id && !m2.id) {
                untested('Combine Relations Case 1');
                m1.Append.apply(m1,m2.data);
                mml.data.splice(i+1,1); m--;
              } else {
                untested('Combine Relations Case 2');
                m1.rspace = m2.lspace = "0pt"; i++;
              }
            }
          }
          if (!mml.data[i].isToken) {this.combineRelations(mml.data[i])}
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
  MathJax.Ajax.loadComplete("TeX_Parser");
  
})(MathJax.InputJax.TeX,MathJax.Hub,MathJax.Ajax);
