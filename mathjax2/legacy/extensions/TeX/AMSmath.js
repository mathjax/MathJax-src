/* -*- Mode: Javascript; indent-tabs-mode:nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */

/*************************************************************
 *
 *  MathJax/extensions/Tex/AMSmath.js
 *
 *  Implements AMS math environments and macros.
 *  
 *  ---------------------------------------------------------------------
 *  
 *  Copyright (c) 2009-2016 The MathJax Consortium
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

let sm = require('../../../../mathjax3/input/tex/SymbolMap.js');
let tc = require('../../../../mathjax3/input/tex/TexConstants.js');
let BaseMethods = require('../../../../mathjax3/input/tex/BaseMethods.js').default;
let AmsMethods = require('../../jax/input/TeX/AmsMethods.js').default;
let imp = require("../../jax/input/TeX/imp.js").imp;
let ParserUtil = require("../../jax/input/TeX/ParserUtil.js").ParserUtil;

MathJax.Extension["TeX/AMSmath"] = {
  version: "2.7.0",
  
  number: 0,        // current equation number
  startNumber: 0,   // current starting equation number (for when equation is restarted)
  IDs: {},          // IDs used in previous equations
  eqIDs: {},        // IDs used in this equation
  labels: {},       // the set of labels
  eqlabels: {},     // labels in the current equation
  refs: []          // array of jax with unresolved references
};

MathJax.Hub.Register.StartupHook("TeX Jax Ready",function () {
  
  var MML = MathJax.ElementJax.mml,
      TEX = MathJax.InputJax.TeX,
      AMS = MathJax.Extension["TeX/AMSmath"];

  var TEXDEF = TEX.Definitions,
      STACKITEM = TEX.Stack.Item,
      CONFIG = TEX.config.equationNumbers;
      
  var COLS = function (W) {
    var WW = [];
    for (var i = 0, m = W.length; i < m; i++) 
      {WW[i] = ParserUtil.Em(W[i])}
    return WW.join(" ");
  };
  
  //
  //  Get the URL of the page (for use with formatURL) when there
  //  is a <base> element on the page.
  //  
  var baseURL = "";
                // (document.getElementsByTagName("base").length === 0) ? "" :
                // String(document.location).replace(/#.*$/,"");
  
  /******************************************************************************/
  
  /******************************************************************************/
  
  TEX.Parse.Augment({

    /*
     *  Add the tag to the environment (to be added to the table row later)
     */
    HandleTag: AmsMethods.HandleTag,
    HandleNoTag: function (name) {
      imp.printMethod('AMS-HandleNoTag');
      if (this.stack.global.tag) {delete this.stack.global.tag}
      this.stack.global.notag = true;  // prevent auto-tagging
    },
    
    /*
     *  Record a label name for a tag
     */
    HandleLabel: function (name) {
      imp.printMethod('AMS-HandleLabel');
      var global = this.stack.global, label = this.GetArgument(name);
      if (label === "") return;
      if (!AMS.refUpdate) {
        if (global.label) {TEX.Error(["MultipleCommand","Multiple %1",name])}
        global.label = label;
        if (AMS.labels[label] || AMS.eqlabels[label])
          {TEX.Error(["MultipleLabel","Label '%1' multiply defined",label])}
        AMS.eqlabels[label] = {tag:"???", id:""}; // will be replaced by tag value later
      }
    },
    
    /*
     *  Handle a label reference
     */
    HandleRef: function (name,eqref) {
      imp.printMethod('AMS-HandleRef');
      var label = this.GetArgument(name);
      var ref = AMS.labels[label] || AMS.eqlabels[label];
      if (!ref) {ref = {tag:"???",id:""}; AMS.badref = !AMS.refUpdate}
      var tag = ref.tag; if (eqref) {tag = CONFIG.formatTag(tag)}
      this.Push(MML.mrow.apply(MML,this.InternalMath(tag)).With({
        href:CONFIG.formatURL(ref.id,baseURL), "class":"MathJax_ref"
      }));
    },
    
    /*
     *  Handle \DeclareMathOperator
     */
    HandleDeclareOp: AmsMethods.HandleDeclareOp,
    
    HandleOperatorName: AmsMethods.HandleOperatorName,
    
    SkipLimits: AmsMethods.SkipLimits,

    /*
     *  Record presence of \shoveleft and \shoveright
     */
    HandleShove: function (name,shove) {
      imp.printMethod('AMS-HandleShove');
      var top = this.stack.Top();
      if (top.type !== "multline" || top.data.length) {
        TEX.Error(["CommandAtTheBeginingOfLine",
                   "%1 must come at the beginning of the line",name]);
      }
      top.data.shove = shove;
    },
    
    /*
     *  Handle \cfrac
     */
    CFrac: AmsMethods.CFrac,
    
    /*
     *  Implement AMS generalized fraction
     */
    Genfrac: AmsMethods.Genfrac,

    /*
     *  Implements multline environment (mostly handled through STACKITEM below)
     */
    Multline: function (begin,numbered) {
      imp.printMethod('AMS-Multline');
      imp.untested(11);
      this.Push(begin); this.checkEqnEnv();
      return STACKITEM.multline(numbered,this.stack).With({
        arraydef: {
          displaystyle: true,
          rowspacing: ".5em",
          width: TEX.config.MultLineWidth, columnwidth:"100%",
          side: TEX.config.TagSide,
          minlabelspacing: TEX.config.TagIndent
        }
      });
    },

    /*
     *  Handle AMS aligned environments
     */
    // VS: That's the only rewritten function so far!
    AMSarray: AmsMethods.AMSarray,
    
    AlignedAMSArray: function (begin) {
      imp.printMethod('AMS-AlignedAMSArray');
      var align = this.GetBrackets("\\begin{"+begin.name+"}");
      return this.setArrayAlign(this.AMSarray.apply(this,arguments),align);
    },

    /*
     *  Handle alignat environments
     */
    AlignAt: function (begin,numbered,taggable) {
      imp.printMethod('AMS-AlignAt');
      var n, valign, align = "", spacing = [];
      if (!taggable) {valign = this.GetBrackets("\\begin{"+begin.name+"}")}
      n = this.GetArgument("\\begin{"+begin.name+"}");
      if (n.match(/[^0-9]/)) {
        TEX.Error(["PositiveIntegerArg","Argument to %1 must me a positive integer",
                  "\\begin{"+begin.name+"}"]);
      }
      while (n > 0) {align += "rl"; spacing.push("0em 0em"); n--}
      spacing = spacing.join(" ");
      if (taggable) {return this.AMSarray(begin,numbered,taggable,align,spacing)}
      var array = this.AMSarray(begin,numbered,taggable,align,spacing);
      return this.setArrayAlign(array,valign);
    },
    
    /*
     *  Handle equation environment
     */
    EquationBegin: function (begin,force) {
      imp.printMethod('AMS-EquationBegin');
      this.checkEqnEnv();
      this.stack.global.forcetag = (force && CONFIG.autoNumber !== "none");
      return begin;
    },
    EquationStar: function (begin,row) {
      imp.printMethod('AMS-EquationStar');
      this.stack.global.tagged = true; // prevent automatic tagging
      return row;
    },
    
    /*
     *  Check for bad nesting of equation environments
     */
    checkEqnEnv: function () {
      imp.printMethod('AMS-checkEqnEnv');
      if (this.stack.global.eqnenv)
        {TEX.Error(["ErroneousNestingEq","Erroneous nesting of equation structures"])}
      this.stack.global.eqnenv = true;
    },
    
    /*
     *  Handle multiple integrals (make a mathop if followed by limits)
     */
    MultiIntegral: AmsMethods.MultiIntegral,
    
    /*
     *  Handle stretchable arrows
     */
    xArrow: AmsMethods.xArrow,
    
    /*
     *  Get a delimiter or empty argument
     */
    GetDelimiterArg: function (name) {
      imp.printMethod('AMS-GetDelimiterArg');
      var c = this.trimSpaces(this.GetArgument(name));
      if (c == "") return null;
      if (c in TEXDEF.delimiter) return c;
      TEX.Error(["MissingOrUnrecognizedDelim","Missing or unrecognized delimiter for %1",name]);
    },
    
    /*
     *  Get a star following a control sequence name, if any
     */
    GetStar: function () {
      imp.printMethod('AMS-GetStar');
      var star = (this.GetNext() === "*");
      if (star) {this.i++}
      return star;
    }
    
  });
  
  /******************************************************************************/
  
  STACKITEM.Augment({
    /*
     *  Increment equation number and form tag mtd element
     */
    autoTag: function () {
      imp.printMethod('AMS-autoTag');
      var global = this.global;
      if (!global.notag) {
        AMS.number++; global.tagID = CONFIG.formatNumber(AMS.number.toString());
        var mml = TEX.Parse("\\text{"+CONFIG.formatTag(global.tagID)+"}",{}).mml();
        global.tag = MML.mtd(mml).With({id:CONFIG.formatID(global.tagID)});
      }
    },
  
    /*
     *  Get the tag and record the label, if any
     */
    getTag: function () {
      imp.printMethod('AMS-getTag');
      var global = this.global, tag = global.tag; global.tagged = true;
      if (global.label) {
        if (CONFIG.useLabelIds) {tag.id = CONFIG.formatID(global.label)}
        AMS.eqlabels[global.label] = {tag:global.tagID, id:tag.id};        
      }
      //
      //  Check for repeated ID's (either in the document or as
      //  a previous tag) and find a unique related one. (#240)
      //
      if (document.getElementById(tag.id) || AMS.IDs[tag.id] || AMS.eqIDs[tag.id]) {
        var i = 0, ID;
        do {i++; ID = tag.id+"_"+i}
          while (document.getElementById(ID) || AMS.IDs[ID] || AMS.eqIDs[ID]);
        tag.id = ID; if (global.label) {AMS.eqlabels[global.label].id = ID}
      }
      AMS.eqIDs[tag.id] = 1;
      this.clearTag();
      return tag;
    },
    clearTag: function () {
      imp.printMethod('AMS-clearTag');
      var global = this.global;
      delete global.tag; delete global.tagID; delete global.label;
    }
  });

    
  /*
   *  Implement multline environment via a STACKITEM
   */
  STACKITEM.multline = STACKITEM.array.Subclass({
    type: "multline",
    Init: function (numbered,stack) {
      imp.printMethod('AMS-Init');
      this.SUPER(arguments).Init.apply(this);
      this.numbered = (numbered && CONFIG.autoNumber !== "none");
      this.save = {notag: stack.global.notag};
      stack.global.tagged = !numbered && !stack.global.forcetag; // prevent automatic tagging in starred environments
    },
    EndEntry: function () {
      imp.printMethod('AMS-EndEntry');
      if (this.table.length) {ParserUtil.fixInitialMO(this.data)}
      var mtd = MML.mtd.apply(MML,this.data);
      if (this.data.shove) {mtd.columnalign = this.data.shove}
      this.row.push(mtd);
      this.data = [];
    },
    EndRow: function () {
      imp.printMethod('AMS-EndRow');
      if (this.row.length != 1) {
        TEX.Error(["MultlineRowsOneCol",
                   "The rows within the %1 environment must have exactly one column",
                   "multline"]);
      }
      this.table.push(this.row); this.row = [];
    },
    EndTable: function () {
      imp.printMethod('AMS-EndTable');
      this.SUPER(arguments).EndTable.call(this);
      if (this.table.length) {
        var m = this.table.length-1, i, label = -1;
        if (!this.table[0][0].columnalign) {this.table[0][0].columnalign = MML.ALIGN.LEFT}
        if (!this.table[m][0].columnalign) {this.table[m][0].columnalign = MML.ALIGN.RIGHT}
        if (!this.global.tag && this.numbered) {this.autoTag()}
        if (this.global.tag && !this.global.notags) {
          label = (this.arraydef.side === "left" ? 0 : this.table.length - 1);
          this.table[label] = [this.getTag()].concat(this.table[label]);
        }
        for (i = 0, m = this.table.length; i < m; i++) {
          var mtr = (i === label ? MML.mlabeledtr : MML.mtr);
          this.table[i] = mtr.apply(MML,this.table[i]);
        }
      }
      this.global.notag  = this.save.notag;
    }
  });
  
  /*
   *  Save data about numbering and taging equations, and add
   *  tags at the ends of rows.
   */
  STACKITEM.AMSarray = STACKITEM.array.Subclass({
    type: "AMSarray",
    Init: function (name,numbered,taggable,stack) {
      imp.printMethod('AMS-Init');
      this.SUPER(arguments).Init.apply(this);
      this.numbered = (numbered && CONFIG.autoNumber !== "none");
      this.save = {notags: stack.global.notags, notag: stack.global.notag};
      stack.global.notags = (taggable ? null : name);
      stack.global.tagged = !numbered && !stack.global.forcetag; // prevent automatic tagging in starred environments
    },
    EndEntry: function () {
      imp.printMethod('AMS-EndEntry');
      // @test Cubic Binomial
      if (this.row.length) {ParserUtil.fixInitialMO(this.data);}
      var node = imp.createNode('mtd', this.data, {});
      // VS: OLD
      // var node = MML.mtd.apply(MML,this.data);
      this.row.push(node);
      this.data = [];
    },
    EndRow: function () {
      imp.printMethod('AMS-EndRow');
      // @test Cubic Binomial
      var mtr = 'mtr'; // MML.mtr;
      if (!this.global.tag && this.numbered) {this.autoTag()}
      if (this.global.tag && !this.global.notags) {
        this.row = [this.getTag()].concat(this.row);
        mtr = 'mlabeledtr'; // MML.mlabeledtr;
      } else {this.clearTag();}
      if (this.numbered) {delete this.global.notag;}
      var node = imp.createNode(mtr, this.row, {});
      this.table.push(node); this.row = [];
    },
    EndTable: function () {
      imp.printMethod('AMS-EndTable');
      // @test Cubic Binomial
      this.SUPER(arguments).EndTable.call(this);
      this.global.notags = this.save.notags;
      this.global.notag  = this.save.notag;
    }
  });
  
  //
  //  Look for \tag on a formula and make an mtable to include it
  //
  STACKITEM.start.Augment({
    oldCheckItem: STACKITEM.start.prototype.checkItem,
    checkItem: function (item) {
      imp.printMethod('AMS-checkItem');
      if (item.type === "stop") {
        var mml = this.mmlData(), global = this.global;
        if (AMS.display && !global.tag && !global.tagged && !global.isInner &&
            (CONFIG.autoNumber === "all" || global.forcetag)) {this.autoTag()}
        if (global.tag) {
          var row = [this.getTag(),MML.mtd(mml)];
          var def = {
            side: TEX.config.TagSide,
            minlabelspacing: TEX.config.TagIndent,
            displaystyle: "inherit"   // replaced by TeX input jax Translate() function with actual value
          };
          mml = MML.mtable(MML.mlabeledtr.apply(MML,row)).With(def);
        }
        return STACKITEM.mml(mml);
      }
      return this.oldCheckItem.call(this,item);
    }
  });
  
  /******************************************************************************/

  /*
   *  Add pre- and post-filters to handle the equation number maintainance.
   */
  TEX.prefilterHooks.Add(function (data) {
    AMS.display = data.display;
    AMS.number = AMS.startNumber;  // reset equation numbers (in case the equation restarted)
    AMS.eqlabels = {};
    AMS.eqIDs = {}; 
    AMS.badref = false;
    if (AMS.refUpdate) {AMS.number = data.script.MathJax.startNumber}
  });
  TEX.postfilterHooks.Add(function (data) {
    data.script.MathJax.startNumber = AMS.startNumber;
    AMS.startNumber = AMS.number;                // equation numbers for next equation
    MathJax.Hub.Insert(AMS.IDs,AMS.eqIDs);       // save IDs from this equation
    MathJax.Hub.Insert(AMS.labels,AMS.eqlabels); // save labels from this equation
    if (AMS.badref && !data.math.texError) {AMS.refs.push(data.script)}  // reprocess later
  },100);
  
  MathJax.Hub.Register.MessageHook("Begin Math Input",function () {
    AMS.refs = [];                 // array of jax with bad references
    AMS.refUpdate = false;
  });
  MathJax.Hub.Register.MessageHook("End Math Input",function (message) {
    if (AMS.refs.length) {
      AMS.refUpdate = true;
      for (var i = 0, m = AMS.refs.length; i < m; i++)
        {AMS.refs[i].MathJax.state = MathJax.ElementJax.STATE.UPDATE}
      return MathJax.Hub.processInput({
        scripts:AMS.refs,
        start: new Date().getTime(),
        i:0, j:0, jax:{}, jaxIDs:[]
      });
    }
    return null;
  });
  
  //
  //  Clear the equation numbers and labels
  //
  TEX.resetEquationNumbers = function (n,keepLabels) {
    AMS.startNumber = (n || 0);
    if (!keepLabels) {
      AMS.labels = {};
      AMS.IDs = {};
    }
  }

  /******************************************************************************/

  MathJax.Hub.Startup.signal.Post("TeX AMSmath Ready");
  
});

MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSmath.js");
