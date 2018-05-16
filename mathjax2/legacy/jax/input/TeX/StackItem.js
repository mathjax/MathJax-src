/*************************************************************
 *
 *  MathJax/jax/input/TeX/StackItem.js
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


import MapHandler from '../../../../../mathjax3/input/tex/MapHandler.js';
import {MmlEntities} from '../../../../../mathjax3/input/mathml/MmlEntities.js';
import {TEXCLASS} from '../../../../../mathjax3/core/MmlTree/MmlNode.js';
import {TexConstant} from '../../../../../mathjax3/input/tex/TexConstants.js';
import TexError from '../../../../../mathjax3/input/tex/TexError.js';
// import {TexError} from './TexError.js';
import {ParserUtil} from './ParserUtil.js';
import {imp} from './imp.js';

// Stack item classes for the parser stack.

// Future Interface:
// readonly get type,
// public: push, pop, checkitem,
// protected: isOpen
//
// BaseItem is the abstract class.
//
// protected this.data .
//
// Errors should go into a proper Error Object.


export class BaseItem {


  constructor(...args) {
    this.endError =   /*_()*/ ['ExtraOpenMissingClose',
                         'Extra open brace or missing close brace'];
    this.closeError = /*_()*/ ['ExtraCloseMissingOpen',
                         'Extra close brace or missing open brace'];
    this.rightError = /*_()*/ ['MissingLeftExtraRight',
                         'Missing \\left or extra \\right'];
    this.type = 'base';
    if (this.isOpen) {
      this._env = {};
    }
    this.data = [];
    this.Push.apply(this, args);
  }

  get env() {
    return this._env;
  }

  set env(value) {
    this._env = value;
  }
  
  
  get isOpen() {
    return false;
  }

  get isClose() {
    return false;
  }

  Push() {
    imp.printMethod('StackItem Push arguments: ' + this.data + ' arguments: ');
    imp.printSimple(arguments);
    this.data.push.apply(this.data, arguments);
  }


  Pop() {
    return this.data.pop();
  }


  getType() {
    return this.type;
  }


  hasType(type) {
    return type === this.getType();
  }


  mmlData(inferred, forceRow) {
    imp.printMethod('mmlData');
    if (inferred == null) {
      inferred = true;
    }
    if (this.data.length === 1 && !forceRow) {
      imp.printSimple('End 1');
      return this.data[0];
    }
    // @test Two Identifiers
    var node = imp.createNode('mrow', this.data,
                              inferred ? {inferred: true} : {});
    // VS: OLD
    // var node = MML.mrow.apply(MML,this.data).With((inferred ? {inferred: true}: {}));
    return node;
  }


  checkItem(item) {
    imp.printMethod('Checkitem base for ' + item.getType() + ' with ' + item);
    if (item.hasType('over') && this.isOpen) {
      item.num = this.mmlData(false);
      this.data = [];
    }
    if (item.hasType('cell') && this.isOpen) {
      if (item.linebreak) {
        return false;
      }
      throw new TexError(['Misplaced', 'Misplaced %1', item.name.symbol]);
    }
    if (item.isClose && this[item.getType() + 'Error']) {
      throw new TexError(this[item.getType() + 'Error']);
    }
    if (!item.isNotStack) {
      return true;
    }
    this.Push(item.data[0]); return false;
  }


  // TODO: This needs proper changing once we get rid of legacy compatibility!
  With(def) {
    for (var id in def) {
      if (def.hasOwnProperty(id)) {
        this[id] = def[id];
      }
    }
    return this;
  }


  toString() {
    return this.getType() + '[' + this.data.join('; ') + ']';
  }
}

export class StartItem extends BaseItem {

  constructor(global) {
    super();
    this.type = 'start';
    this.global = global;
  }

  get isOpen() {
    return true;
  }

  checkItem(item) {
    imp.printMethod('Checkitem start');
    if (item.hasType('stop')) {
      return new MmlItem(this.mmlData());
    }
    return super.checkItem(item);
  }
}

export class StopItem extends BaseItem {

  constructor() {
    super();
    this.type = 'stop';
  }

  get isClose() {
    return true;
  }

}

export class OpenItem extends BaseItem {

  constructor() {
    super();
    this.stopError = /*_()*/ ['ExtraOpenMissingClose',
                              'Extra open brace or missing close brace'];
    this.type = 'open';
  }

  get isOpen() {
    return true;
  }

  checkItem(item) {
    imp.printMethod('Checkitem open');
    if (item.hasType('close')) {
      var mml = this.mmlData();
      // @test PrimeSup
      // TODO: Move that into mmlData?
      mml = imp.cleanSubSup(mml);
      var node = imp.createNode('TeXAtom', [mml], {});
      // VS: OLD
      // var node = MML.TeXAtom(mml);
      return new MmlItem(node); // TeXAtom make it an ORD to prevent spacing
                                // (FIXME: should be another way)
    }
    return super.checkItem(item);
  }
}


export class CloseItem extends BaseItem {

  constructor() {
    super();
    this.type = 'close';
  }

  get isClose() {
    return true;
  }

}


export class PrimeItem extends BaseItem {

  constructor(...args) {
    super(...args);
    this.type = 'prime';
  }

  checkItem(item) {
    imp.printMethod('Checkitem prime');
    if (!imp.isType(this.data[0], 'msubsup')) {
      // @test Prime, Double Prime
      var node = imp.createNode('msup', [this.data[0], this.data[1]], {});
      // VS: OLD
      // var node = MML.msup(this.data[0],this.data[1]);
      return [node, item];
    }
    imp.setData(this.data[0], this.data[0].sup, this.data[1]);
    return [this.data[0], item];
  }
}

export class SubsupItem extends BaseItem {

  constructor(...args) {
    super(...args);
    this.type = 'subsup';
    this.stopError = /*_()*/ ['MissingScript',
                              'Missing superscript or subscript argument'];
    this.supError =  /*_()*/ ['MissingOpenForSup',
                              'Missing open brace for superscript'];
    this.subError =  /*_()*/ ['MissingOpenForSub',
                              'Missing open brace for subscript'];
  }

  checkItem(item) {
    imp.printMethod('Checkitem subsup');
    if (item.hasType('open') || item.hasType('left')) {
      return true;
    }
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
      var result = new MmlItem(this.data[0]);
      return result;
    }
    if (super.checkItem(item)) {
      // @test Brace Superscript Error
      throw new TexError(this[['', 'subError', 'supError'][this.position]]);
    }
  }


  Pop() {}
}

export class OverItem extends BaseItem {

  constructor() {
    super();
    this.type = 'over';
    this.name = '\\over';
  }


  get isClose() {
    return true;
  }


  checkItem(item) {
    imp.printMethod('Checkitem over');
    if (item.hasType('over')) {
      // @test Double Over
      throw new TexError(['AmbiguousUseOf', 'Ambiguous use of %1', item.name]);
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
        imp.setProperties(mml, {'texWithDelims': true});
        // TODO: What to do about TEX?
        mml = ParserUtil.fixedFence(this.open, mml, this.close);
      }
      return [new MmlItem(mml), item];
    }
    return super.checkItem(item);
  }


  toString() {return 'over[' + this.num + ' / ' + this.data.join('; ') + ']';}

}

export class LeftItem extends BaseItem {

  constructor() {
    super();
    this.type = 'left';
    this.delim = '(',
    this.stopError = /*_()*/ ['ExtraLeftMissingRight',
                              'Extra \\left or missing \\right'];
  }

  get isOpen() {
    return true;
  }


  checkItem(item) {
    // @test Missing Right
    imp.printMethod('Checkitem left');
    if (item.hasType('right')) {
      // TODO: What to do about the TEX.fenced?
      return new MmlItem(
        ParserUtil.fenced(this.delim, this.mmlData(), item.delim));
    }
    return super.checkItem(item);
  }

}

export class RightItem extends BaseItem {

  constructor() {
    super();
    this.type = 'right';
    this.delim = ')';
  }

  get isClose() {
    return true;
  }

}

export class BeginItem extends BaseItem {

  constructor() {
    super();
    this.type = 'begin';
  }

  get isOpen() {
    return true;
  }

  checkItem(item) {
    imp.printMethod('Checkitem begin');
    if (item.hasType('end')) {
      if (item.name !== this.name) {
        throw new TexError(['EnvBadEnd', '\\begin{%1} ended with \\end{%2}',
                            this.name, item.name]);
      }
      if (!this.end) {
        return new MmlItem(this.mmlData());
      }
      // TODO: This case currently does not work!
      // 
      //       The problem: It needs to call a particular Parse Method. It is
      //       only used in equation(*) anyway and should therefore probably
      //       handled in a special case.
      return this.parse[this.end].call(this.parse, this, this.data);
    }
    if (item.hasType('stop')) {
      throw new TexError(['EnvMissingEnd', 'Missing \\end{%1}', this.name]);
    }
    return super.checkItem(item);
  }

}

export class EndItem extends BaseItem {

  constructor() {
    super();
    this.type = 'end';
  }

  get isClose() {
    return true;
  }

}

export class StyleItem extends BaseItem {

  constructor() {
    super();
    this.type = 'style';
  }

  checkItem(item) {
    imp.printMethod('Checkitem style');
    if (!item.isClose) {
      return super.checkItem(item);
    }
    // @test Style
    var mml = imp.createNode('mstyle', this.data, this.styles);
    // VS: OLD
    // var mml = MML.mstyle.apply(MML,this.data).With(this.styles);
    return [new MmlItem(mml), item];
  }

}

export class PositionItem extends BaseItem {

  constructor() {
    super();
    this.type = 'position';
  }

  checkItem(item) {
    imp.printMethod('Checkitem position');
    if (item.isClose) {
      throw new TexError(['MissingBoxFor', 'Missing box for %1', this.name]);
    }
    if (item.isNotStack) {
      var mml = item.mmlData();
      switch (this.move) {
      case 'vertical':
        // @test Raise, Lower
        mml = imp.createNode('mpadded', [mml],
                             {height: this.dh, depth: this.dd,
                              voffset: this.dh});
        // VS: OLD
        // mml = MML.mpadded(mml).With({height: this.dh, depth: this.dd, voffset: this.dh});
        return [new MmlItem(mml)];
      case 'horizontal':
        return [new MmlItem(this.left), item, new MmlItem(this.right)];
      }
    }
    return super.checkItem(item);
  }
}

export class ArrayItem extends BaseItem {

  constructor() {
    super();
    this.type = 'array';
    this.table = [];
    this.row = [];
    this.frame = [];
    this.hfill = [];
    this.copyEnv = false;
    this.arraydef = {};
  }

  get isOpen() {
    return true;
  }


  checkItem(item) {
    imp.printMethod('Checkitem array');
    if (item.isClose && !item.hasType('over')) {
      if (item.isEntry) {
        this.EndEntry();
        this.clearEnv();
        return false;
      }
      if (item.isCR) {
        this.EndEntry();
        this.EndRow();
        this.clearEnv();
        return false;
      }
      this.EndTable();
      this.clearEnv();
      var scriptlevel = this.arraydef.scriptlevel;
      delete this.arraydef.scriptlevel;
      // @test Array1
      var mml = imp.createNode('mtable', this.table, this.arraydef);
      // VS: OLD
      // var mml = MML.mtable.apply(MML,this.table).With(this.arraydef);
      if (this.frame.length === 4) {
        mml.frame = (this.frame.dashed ? 'dashed' : 'solid');
      } else if (this.frame.length) {
        mml.hasFrame = true;
        if (this.arraydef.rowlines) {
          this.arraydef.rowlines =
            this.arraydef.rowlines.replace(/none( none) + $/, 'none');
        }
        // @test Array2
        mml = imp.createNode('menclose', [mml],
                             {notation: this.frame.join(' '), isFrame: true});
        // VS: OLD
        // mml = MML.menclose(mml).With({notation: this.frame.join(' '), isFrame: true});
        if ((this.arraydef.columnlines || 'none') != 'none' ||
            (this.arraydef.rowlines || 'none') != 'none') {
          // HTML-CSS jax implements this
          mml.padding = 0;
        }
      }
      if (scriptlevel) {
        imp.untested(3);
        mml = imp.createNode('mstyle', [mml], {scriptlevel: scriptlevel});
        // VS: OLD
        // mml = MML.mstyle(mml).With({scriptlevel: scriptlevel})}
      }
      if (this.open || this.close) {
        // TODO: What to do about TEX?
        mml = ParserUtil.fenced(this.open, mml, this.close);
      }
      mml = new MmlItem(mml);
      if (this.requireClose) {
        if (item.hasType('close')) {
          return mml;
        }
        throw new TexError(['MissingCloseBrace', 'Missing close brace']);
      }
      return [mml, item];
    }
    return super.checkItem(item);
  }


  EndEntry() {
    // @test Array1, Array2
    var mtd = imp.createNode('mtd', this.data, {});
    // VS: OLD
    // var mtd = MML.mtd.apply(MML,this.data);
    if (this.hfill.length) {
      if (this.hfill[0] === 0) {
        mtd.columnalign = 'right';
      }
      if (this.hfill[this.hfill.length - 1] === this.data.length) {
        mtd.columnalign = (mtd.columnalign ? 'center' : 'left');
      }
    }
    this.row.push(mtd); this.data = []; this.hfill = [];
  }


  EndRow() {
    if (this.isNumbered && this.row.length === 3) {
      this.row.unshift(this.row.pop());  // move equation number to first
                                         // position
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
  }


  EndTable() {
    if (this.data.length || this.row.length) {
      this.EndEntry();
      this.EndRow();
    }
    this.checkLines();
  }


  checkLines() {
    if (this.arraydef.rowlines) {
      var lines = this.arraydef.rowlines.split(/ /);
      if (lines.length === this.table.length) {
        this.frame.push('bottom'); lines.pop();
        this.arraydef.rowlines = lines.join(' ');
      } else if (lines.length < this.table.length - 1) {
        this.arraydef.rowlines += ' none';
      }
    }
    if (this.rowspacing) {
      var rows = this.arraydef.rowspacing.split(/ /);
      while (rows.length < this.table.length) {
        rows.push(this.rowspacing + 'em');
      }
      this.arraydef.rowspacing = rows.join(' ');
    }
  }


  clearEnv() {
    for (var id in this.env) {
      if (this.env.hasOwnProperty(id)) {
        delete this.env[id];
      }
    }
  }
}


export class CellItem extends BaseItem {

  constructor() {
    super();
    this.type = 'cell';
  }

  get isClose() {
    return true;
  }
}


export class MmlItem extends BaseItem {

  constructor(...args) {
    super(...args);
    this.type = 'mml';
    this.isNotStack = true;
  }

  Add() {
    this.data.push.apply(this.data, arguments);
    return this;
  }
}


export class FnItem extends BaseItem {

  constructor(...args) {
    super(...args);
    this.type = 'fn';
  }

  checkItem(item) {
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
          return [this.data[0], item];
        }
        if (imp.isType(item.data[0], 'mspace')) {
          imp.untested(100);
          return [this.data[0], item];
        }
        var mml = item.data[0];
        if (imp.isEmbellished(mml)) {
          imp.printSimple('case 5');
          mml = imp.getCoreMO(mml);
        }
        if ([0, 0, 1, 1, 0, 1, 1, 0, 0, 0][imp.getTexClass(mml)]) {
          return [this.data[0], item];
        }
      }
      // @test Named Function
      var text = imp.createText(MmlEntities.ENTITIES.ApplyFunction);
      // TODO: Texclass should probably be set and not given as attribute!
      var node = imp.createNode('mo', [], {texClass: TEXCLASS.NONE}, text);
      // VS: OLD
      // var node = MML.mo(MML.entity('#x2061')).With({texClass:MML.TEXCLASS.NONE});
      return [this.data[0], node, item];
    }
    return super.checkItem.apply(this, arguments);
  }
}

export class NotItem extends BaseItem {

  constructor() {
    super();
    this.type = 'not';
    this.remap = MapHandler.getInstance().getMap('not_remap');
  }

  checkItem(item) {
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
        if (this.remap.contains(c)) {
          // @test Negation Simple, Negation Complex
          var textNode = imp.createText(this.remap.lookup(c).char);
          imp.setData(mml, 0, textNode);
          // VS: OLD
          // mml.SetData(0, MML.chars(this.remap.lookup(c).char));
        } else {
          // @test Negation Explicit
          textNode = imp.createText('\u0338');
          imp.appendChildren(mml, [textNode]);
          // VS: OLD
          // mml.Append(MML.chars('\u0338'));
        }
        return item;
      }
    }
    //  \mathrel{\rlap{\notChar}}
    // @test Negation Large
    textNode = imp.createText('\u29F8');
    var mtextNode = imp.createNode('mtext', [], {}, textNode);
    var paddedNode = imp.createNode('mpadded', [mtextNode], {width: 0});
    mml = imp.createNode('TeXAtom', [paddedNode], {texClass: TEXCLASS.REL});
    // VS: OLD
    // mml = MML.mpadded(MML.mtext('\u29F8')).With({width:0});
    // mml = MML.TeXAtom(mml).With({texClass:MML.TEXCLASS.REL});
    return [mml, item];
  }
}


export class DotsItem extends BaseItem {

  constructor() {
    super();
    this.type = 'dots';
  }

  checkItem(item) {
    imp.printMethod('Checkitem dots');
    if (item.hasType('open') || item.hasType('left')) {
      return true;
    }
    var dots = this.ldots;
    // @test Operator Dots
    if (item.hasType('mml') && imp.isEmbellished(item.data[0])) {
      var tclass = imp.getTexClass(imp.getCoreMO(item.data[0]));
      if (tclass === TEXCLASS.BIN || tclass === TEXCLASS.REL) {
        dots = this.cdots;
      }
    }
    return [dots, item];
  }
}


// AMS


export class AMSarrayItem extends ArrayItem {

  constructor(name, numbered, taggable, stack) {
    super();
    this.type = 'AMSarray';
    // Omitted configuration: && CONFIG.autoNumber !== "none";
    this.numbered = numbered;
    this.save = {notags: stack.global.notags, notag: stack.global.notag};
    stack.global.notags = (taggable ? null : name);
    // prevent automatic tagging in starred environments
    stack.global.tagged = !numbered && !stack.global.forcetag;
  }

  // TODO: Temporary!
  autoTag() {}
  getTag() {}
  clearTag() {}

  EndEntry() {
    imp.printMethod('AMS-EndEntry');
    // @test Cubic Binomial
    if (this.row.length) {
      ParserUtil.fixInitialMO(this.data);
    }
    var node = imp.createNode('mtd', this.data, {});
    // VS: OLD
    // var node = MML.mtd.apply(MML,this.data);
    this.row.push(node);
    this.data = [];
  }
  
  EndRow() {
    imp.printMethod('AMS-EndRow');
    // @test Cubic Binomial
    var mtr = 'mtr'; // MML.mtr;
    if (!this.global.tag && this.numbered) {
      this.autoTag();
    }
    if (this.global.tag && !this.global.notags) {
      this.row = [this.getTag()].concat(this.row);
      mtr = 'mlabeledtr'; // MML.mlabeledtr;
    } else {
      this.clearTag();
    }
    if (this.numbered) {delete this.global.notag;}
    var node = imp.createNode(mtr, this.row, {});
    this.table.push(node); this.row = [];
  }
  
  EndTable() {
    imp.printMethod('AMS-EndTable');
    // @test Cubic Binomial
    super.EndTable();
    this.global.notags = this.save.notags;
    this.global.notag  = this.save.notag;
  }
}
