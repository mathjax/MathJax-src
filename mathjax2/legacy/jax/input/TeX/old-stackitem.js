let MapHandler = require('../../../../../mathjax3/input/tex/MapHandler.js').default;
let TEXCLASS = require('../../../../../mathjax3/core/MmlTree/MmlNode.js').TEXCLASS;
let MmlEntities = require('../../../../../mathjax3/input/mathml/MmlEntities.js').MmlEntities;
let ParserUtil = require('./ParserUtil.js').ParserUtil;
let TexError = require('../../../../../mathjax3/input/tex/TexError.js').default;
let imp = require("./imp.js").imp;

(function (TEX) {

  // Retained to move STACK.Item to extensions.
  var STACK = {};
  
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
        throw new TexError(["Misplaced","Misplaced %1",item.name.symbol]);
      }
      if (item.isClose && this[item.getType()+"Error"]) {throw new TexError(this[item.getType()+"Error"])}
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
        throw new TexError(this[["","subError","supError"][this.position]]);
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
        throw new TexError(["AmbiguousUseOf","Ambiguous use of %1",item.name]);
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
          // mml.texWithDelims = true;
          imp.setProperties(mml, {'texWithDelims': true});
          mml = ParserUtil.fixedFence(this.open,mml,this.close);
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
      if (item.hasType('right')) {
        return STACKITEM.mml(ParserUtil.fenced(this.delim,this.mmlData(),item.delim));
      }
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
          {throw new TexError(["EnvBadEnd","\\begin{%1} ended with \\end{%2}",this.name,item.name])}
        if (!this.end) {return STACKITEM.mml(this.mmlData())}
        return this.parse[this.end].call(this.parse,this,this.data);
      }
      if (item.hasType('stop'))
        {throw new TexError(["EnvMissingEnd","Missing \\end{%1}",this.name])}
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
      if (item.isClose) {throw new TexError(["MissingBoxFor","Missing box for %1",this.name])}
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
        if (this.open || this.close) {
          mml = ParserUtil.fenced(this.open,mml,this.close);
        }
        mml = STACKITEM.mml(mml);
        if (this.requireClose) {
          if (item.hasType('close')) {return mml}
          throw new TexError(["MissingCloseBrace","Missing close brace"]);
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

  TEX.Stack = STACK;
  
})(MathJax.InputJax.TeX);
