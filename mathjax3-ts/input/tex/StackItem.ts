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


import MapHandler from './MapHandler.js';
import {CharacterMap} from './SymbolMap.js';
import {MmlEntities} from '../mathml/MmlEntities.js';
import {MmlNode, TextNode, TEXCLASS} from '../../core/MmlTree/MmlNode.js';
import {MmlMsubsup} from '../../core/MmlTree/MmlNodes/msubsup.js';
import {TexConstant} from './TexConstants.js';
import TexError from './TexError.js';
// import {TexError} from './TexError.js';
import {ParserUtil} from './ParserUtil.js';
import {TreeHelper} from './TreeHelper.js';
import {Property, PropertyList} from '../../core/Tree/Node.js';

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

// TODO: Marry these eventually with Property and PropertyList?
export type EnvProp = string | number | boolean;

export type EnvList = {[key: string]: EnvProp};

// This is the type for all fields that used to be set with With.
export type Prop = string | number | boolean | MmlNode | PropList;

export type PropList = {[key: string]: Prop};

export type ErrorMsg = string[];

export type ErrorList = {[key: string]: ErrorMsg};

export type CheckType = boolean | StackItem | (MmlNode | StackItem)[];

export interface StackItem {
  checkItem(item: StackItem): CheckType;
  mmlData(inferred?: boolean, forceRow?: boolean): MmlNode;
  Pop(): MmlNode | void;
  Push(...args: MmlNode[]): void;
  hasType(kind: string): boolean;
  getType(): string;
  getProperty(key: string): Prop;
  setProperty(key: string, value: Prop): void;
  isClose: boolean;
  isOpen: boolean;
  data: MmlNode[];
  global: EnvList;
  getName(): string;
  env: EnvList;
}

export class BaseItem implements StackItem {

  private _env: EnvList;

  private _properties: PropList = {};

  protected errors: {[key: string]: string[]} = {
    endError:   ['ExtraOpenMissingClose',
                 'Extra open brace or missing close brace'],
    closeError: ['ExtraCloseMissingOpen',
                 'Extra close brace or missing open brace'],
    rightError: ['MissingLeftExtraRight',
                 'Missing \\left or extra \\right']
  };

  protected kind = 'base';

  public global: EnvList = {};
  
  public data: MmlNode[] = [];
  
  constructor(...args: MmlNode[]) {
    this.kind = 'base';
    if (this.isOpen) {
      this._env = {};
    }
    this.Push.apply(this, args);
  }

  get env() {
    return this._env;
  }

  set env(value) {
    this._env = value;
  }
  
  getProperty(key: string) {
    // 
    // TODO: Right side retained for legacy code!
    return this._properties[key] || (this as any)[key];
    // return this._properties[key];
  }

  setProperty(key: string, value: Prop) {
    this._properties[key] = value;
    // (this as {[field: string]: Prop})[key] = value;
    // 
    // TODO: Retained for legacy code!
    (this as any)[key] = value as any;
  }
  
  get isOpen() {
    return false;
  }

  get isClose() {
    return false;
  }

  Push(...args: MmlNode[]) {
    TreeHelper.printMethod('StackItem Push arguments: ' + this.data + ' arguments: ');
    TreeHelper.printSimple(args.toString());
    this.data.push.apply(this.data, arguments);
  }


  Pop(): MmlNode | void {
    return this.data.pop();
  }


  getType() {
    return this.kind;
  }


  hasType(kind: string) {
    return kind === this.getType();
  }


  mmlData(inferred?: boolean, forceRow?: boolean) {
    TreeHelper.printMethod('mmlData');
    if (inferred == null) {
      inferred = true;
    }
    if (this.data.length === 1 && !forceRow) {
      TreeHelper.printSimple('End 1');
      return this.data[0];
    }
    // @test Two Identifiers
    return TreeHelper.createNode('mrow', this.data, {});
    // VS: OLD
    // var node = MML.mrow.apply(MML,this.data).With((inferred ? {inferred: true}: {}));
  }


  checkItem(item: StackItem): CheckType {
    TreeHelper.printMethod('Checkitem base for ' + item.getType() + ' with ' + item);
    if (item.hasType('over') && this.isOpen) {
      item.setProperty('num', this.mmlData(false));
      this.data = [];
    }
    if (item.hasType('cell') && this.isOpen) {
      if (item.getProperty('linebreak')) {
        return false;
      }
      // TODO: Test what symbol really does!
      //throw new TexError(['Misplaced', 'Misplaced %1', item.getProperty('name').symbol]);      
      // @test Ampersand-error
      throw new TexError(['Misplaced', 'Misplaced %1', item.getName()]);
    }
    if (item.isClose && this.errors[item.getType() + 'Error']) {
      throw new TexError(this.errors[item.getType() + 'Error']);
    }
    if (!item.getProperty('isNotStack')) {
      return true;
    }
    this.Push(item.data[0]); return false;
  }


  // TODO: This needs proper changing once we get rid of legacy compatibility!
  With(def: PropList) {
    for (let id in def) {
      if (def.hasOwnProperty(id)) {
        this.setProperty(id, def[id]);
      }
    }
    return this;
  }


  toString() {
    return this.getType() + '[' + this.data.join('; ') + ']';
  }

  getName() {
    return this.getProperty('name') as string;
  }
}

export class StartItem extends BaseItem {

  constructor(global: EnvList) {
    super();
    this.kind = 'start';
    this.global = global;
  }

  get isOpen() {
    return true;
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem start');
    if (item.hasType('stop')) {
      return new MmlItem(this.mmlData());
    }
    return super.checkItem(item);
  }
}

export class StopItem extends BaseItem {

  constructor() {
    super();
    this.kind = 'stop';
  }

  get isClose() {
    return true;
  }

}

export class OpenItem extends BaseItem {

  constructor() {
    super();
    this.errors['stopError'] = ['ExtraOpenMissingClose',
                                'Extra open brace or missing close brace'];
    this.kind = 'open';
  }

  get isOpen() {
    return true;
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem open');
    if (item.hasType('close')) {
      let mml = this.mmlData();
      // @test PrimeSup
      // TODO: Move that into mmlData?
      mml = TreeHelper.cleanSubSup(mml);
      const node = TreeHelper.createNode('TeXAtom', [mml], {});
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
    this.kind = 'close';
  }

  get isClose() {
    return true;
  }

}


export class PrimeItem extends BaseItem {

  constructor(...args: MmlNode[]) {
    super(...args);
    this.kind = 'prime';
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem prime');
    if (!TreeHelper.isType(this.data[0], 'msubsup')) {
      // @test Prime, Double Prime
      const node = TreeHelper.createNode('msup', [this.data[0], this.data[1]], {});
      // VS: OLD
      // var node = MML.msup(this.data[0],this.data[1]);
      return [node, item];
    }
    TreeHelper.setData(this.data[0], (this.data[0] as MmlMsubsup).sup, this.data[1]);
    return [this.data[0], item];
  }
}

export class SubsupItem extends BaseItem {

  constructor(...args: MmlNode[]) {
    super(...args);
    this.kind = 'subsup';
    this.errors['stopError'] = ['MissingScript',
                               'Missing superscript or subscript argument'];
    this.errors['supError'] =  ['MissingOpenForSup',
                                'Missing open brace for superscript'];
    this.errors['subError'] =  ['MissingOpenForSub',
                                'Missing open brace for subscript'];
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem subsup');
    if (item.hasType('open') || item.hasType('left')) {
      return (true as CheckType);
    }
    if (item.hasType('mml')) {
      if (this.getProperty('primes')) {
        if (this.getProperty('position') !== 2) {
          // @test Prime on Sub
          TreeHelper.setData(this.data[0], 2, this.getProperty('primes') as MmlNode);
        }
        else {
          // @test Prime on Prime
          TreeHelper.setProperties(this.getProperty('primes') as MmlNode, {variantForm: true});
          const node = TreeHelper.createNode('mrow', [this.getProperty('primes') as MmlNode, item.data[0]], {});
          // VS: OLD
          // var node = MML.mrow(this.primes, item.data[0]);
          item.data[0] = node;
        }
      }
      TreeHelper.setData(this.data[0], this.getProperty('position') as number, item.data[0]);
      if (this.getProperty('movesupsub') != null) {
        TreeHelper.setProperties(this.data[0], {movesupsub: this.getProperty('movesupsub')} as PropertyList);
      }
      const result = new MmlItem(this.data[0]);
      return result;
    }
    if (super.checkItem(item)) {
      // @test Brace Superscript Error
      throw new TexError(this.errors[['', 'subError', 'supError']
                                     [this.getProperty('position') as number]]);
    }
  }


  Pop() {}
}

export class OverItem extends BaseItem {

  constructor() {
    super();
    this.kind = 'over';
    this.setProperty('name', '\\over');
  }


  get isClose() {
    return true;
  }


  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem over');
    if (item.hasType('over')) {
      // @test Double Over
      throw new TexError(['AmbiguousUseOf', 'Ambiguous use of %1', item.getName()]);
    }
    if (item.isClose) {
      // @test Over
      let mml = TreeHelper.createNode('mfrac',
                                      [this.getProperty('num') as MmlNode, this.mmlData(false)], {});
      // VS: OLD
      // var mml = MML.mfrac(this.num,this.mmlData(false));
      if (this.getProperty('thickness') != null) {
        // @test Choose, Above, Above with Delims
        TreeHelper.setAttribute(mml, 'linethickness', this.getProperty('thickness') as string);
      }
      if (this.getProperty('open') || this.getProperty('close')) {
        // @test Choose
        TreeHelper.setProperties(mml, {'texWithDelims': true});
        mml = ParserUtil.fixedFence(this.getProperty('open') as string, mml,
                                    this.getProperty('close') as string);
      }
      return [new MmlItem(mml), item];
    }
    return super.checkItem(item);
  }


  toString() {return 'over[' + this.getProperty('num') + ' / ' + this.data.join('; ') + ']';}

}

export class LeftItem extends BaseItem {

  constructor() {
    super();
    this.kind = 'left';
    this.setProperty('delim', '('),
    this.errors['stopError'] = ['ExtraLeftMissingRight',
                                'Extra \\left or missing \\right'];
  }

  get isOpen() {
    return true;
  }


  checkItem(item: StackItem) {
    // @test Missing Right
    TreeHelper.printMethod('Checkitem left');
    if (item.hasType('right')) {
      // TODO: What to do about the TEX.fenced?
      return new MmlItem(
        ParserUtil.fenced(this.getProperty('delim') as string, this.mmlData(),
                          item.getProperty('delim') as string));
    }
    return super.checkItem(item);
  }

}

export class RightItem extends BaseItem {

  constructor() {
    super();
    this.kind = 'right';
    this.setProperty('delim', ')');
  }

  get isClose() {
    return true;
  }

}

export class BeginItem extends BaseItem {

  constructor() {
    super();
    this.kind = 'begin';
  }

  get isOpen() {
    return true;
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem begin');
    if (item.hasType('end')) {
      if (item.getName() !== this.getName()) {
        throw new TexError(['EnvBadEnd', '\\begin{%1} ended with \\end{%2}',
                            this.getName(), item.getName()]);
      }
      if (!this.getProperty('end')) {
        return new MmlItem(this.mmlData());
      }
      // TODO: This case currently does not work!
      // 
      //       The problem: It needs to call a particular Parse Method. It is
      //       only used in equation(*) anyway and should therefore probably
      //       handled in a special case.
      // return this.parse[this.end].call(this.parse, this, this.data);
      return;
    }
    if (item.hasType('stop')) {
      throw new TexError(['EnvMissingEnd', 'Missing \\end{%1}', this.getName()]);
    }
    return super.checkItem(item);
  }

}

export class EndItem extends BaseItem {

  constructor() {
    super();
    this.kind = 'end';
  }

  get isClose() {
    return true;
  }

}

export class StyleItem extends BaseItem {

  constructor() {
    super();
    this.kind = 'style';
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem style');
    if (!item.isClose) {
      return super.checkItem(item);
    }
    // @test Style
    const mml = TreeHelper.createNode('mstyle', this.data, this.getProperty('styles'));
    // VS: OLD
    // var mml = MML.mstyle.apply(MML,this.data).With(this.styles);
    return [new MmlItem(mml), item];
  }

}

export class PositionItem extends BaseItem {

  constructor() {
    super();
    this.kind = 'position';
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem position');
    if (item.isClose) {
      throw new TexError(['MissingBoxFor', 'Missing box for %1', this.getName()]);
    }
    if (item.getProperty('isNotStack')) {
      let mml = item.mmlData();
      switch (this.getProperty('move')) {
      case 'vertical':
        // @test Raise, Lower
        mml = TreeHelper.createNode('mpadded', [mml],
                                    {height: this.getProperty('dh'), depth: this.getProperty('dd'),
                                     voffset: this.getProperty('dh')});
        // VS: OLD
        // mml = MML.mpadded(mml).With({height: this.dh, depth: this.dd, voffset: this.dh});
        return [new MmlItem(mml)];
      case 'horizontal':
        return [new MmlItem(this.getProperty('left') as MmlNode), item,
                new MmlItem(this.getProperty('right') as MmlNode)];
      }
    }
    return super.checkItem(item);
  }
}

export class ArrayItem extends BaseItem {

  public table: MmlNode[] = [];
  public row: MmlNode[] = [];
  public frame: string[] = [];
  public hfill: number[] = [];
  public copyEnv = false;
  public arraydef: {[key: string]: string|number|boolean}= {};
  public dashed: boolean = false;
  
  constructor() {
    super();
    this.kind = 'array';
  }

  get isOpen() {
    return true;
  }


  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem array');
    // @test Array Single
    if (item.isClose && !item.hasType('over')) {
      // @test Array Single
      if (item.getProperty('isEntry')) {
        // @test Array dashed column, Array solid column
        this.EndEntry();
        this.clearEnv();
        return false;
      }
      if (item.getProperty('isCR')) {
        // @test Enclosed bottom
        this.EndEntry();
        this.EndRow();
        this.clearEnv();
        return false;
      }
      this.EndTable();
      this.clearEnv();
      const scriptlevel = this.arraydef['scriptlevel'];
      delete this.arraydef['scriptlevel'];
      let mml = TreeHelper.createNode('mtable', this.table, this.arraydef);
      // VS: OLD
      // var mml = MML.mtable.apply(MML,this.table).With(this.arraydef);
      if (this.frame.length === 4) {
        // @test Enclosed frame solid, Enclosed frame dashed 
        TreeHelper.setAttribute(mml, 'frame', this.dashed ? 'dashed' : 'solid');
      } else if (this.frame.length) {
        // @test Enclosed left right
        // mml.hasFrame = true;
        if (this.arraydef['rowlines']) {
          // @test Enclosed dashed row, Enclosed solid row, 
          this.arraydef['rowlines'] =
            (this.arraydef['rowlines'] as string).replace(/none( none) + $/, 'none');
        }
        // @test Enclosed left right
        mml = TreeHelper.createNode('menclose', [mml],
                             {notation: this.frame.join(' '), isFrame: true});
        // VS: OLD
        // mml = MML.menclose(mml).With({notation: this.frame.join(' '), isFrame: true});
        if ((this.arraydef['columnlines'] || 'none') !== 'none' ||
            (this.arraydef['rowlines'] || 'none') !== 'none') {
          // @test Enclosed dashed row, Enclosed solid row
          // @test Enclosed dashed column, Enclosed solid column
          // HTML-CSS jax implements this
          TreeHelper.setAttribute(mml, 'padding', 0);
        }
      }
      if (scriptlevel) {
        TreeHelper.untested(3);
        mml = TreeHelper.createNode('mstyle', [mml], {scriptlevel: scriptlevel});
        // VS: OLD
        // mml = MML.mstyle(mml).With({scriptlevel: scriptlevel})}
      }
      if (this.getProperty('open') || this.getProperty('close')) {
        // @test Cross Product Formula
        mml = ParserUtil.fenced(this.getProperty('open') as string, mml,
                                this.getProperty('close') as string);
      }
      let newItem = new MmlItem(mml);
      if (this.getProperty('requireClose')) {
        // @test: Label
        if (item.hasType('close')) {
          // @test: Label
          return newItem;
        }
        throw new TexError(['MissingCloseBrace', 'Missing close brace']);
      }
      return [newItem, item];
    }
    return super.checkItem(item);
  }


  EndEntry() {
    // @test Array1, Array2
    const mtd = TreeHelper.createNode('mtd', this.data, {});
    // VS: OLD
    // var mtd = MML.mtd.apply(MML,this.data);
    if (this.hfill.length) {
      if (this.hfill[0] === 0) {
        TreeHelper.setAttribute(mtd, 'columnalign', 'right');
      }
      if (this.hfill[this.hfill.length - 1] === this.data.length) {
        TreeHelper.setAttribute(mtd, 'columnalign',
                                TreeHelper.getAttribute(mtd, 'columnalign') ? 'center' : 'left');
      }
    }
    this.row.push(mtd); this.data = []; this.hfill = [];
  }


  EndRow() {
    let node: MmlNode;
    if (this.getProperty('isNumbered') && this.row.length === 3) {
      this.row.unshift(this.row.pop());  // move equation number to first
                                         // position
      // @test Label
      node = TreeHelper.createNode('mlabeledtr', this.row, {});
      // VS: OLD
      // var node = MML.mlabeledtr.apply(MML,this.row);
    } else {
      // @test Array1, Array2
      node = TreeHelper.createNode('mtr', this.row, {});
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
    if (this.arraydef['rowlines']) {
      const lines = (this.arraydef['rowlines'] as string).split(/ /);
      if (lines.length === this.table.length) {
        this.frame.push('bottom'); lines.pop();
        this.arraydef['rowlines'] = lines.join(' ');
      } else if (lines.length < this.table.length - 1) {
        this.arraydef['rowlines'] += ' none';
      }
    }
    if (this.getProperty('rowspacing')) {
      const rows = (this.arraydef['rowspacing'] as string).split(/ /);
      while (rows.length < this.table.length) {
        rows.push(this.getProperty('rowspacing') + 'em');
      }
      this.arraydef['rowspacing'] = rows.join(' ');
    }
  }


  clearEnv() {
    for (let id in this.env) {
      if (this.env.hasOwnProperty(id)) {
        delete this.env[id];
      }
    }
  }
}


export class CellItem extends BaseItem {

  constructor() {
    super();
    this.kind = 'cell';
  }

  get isClose() {
    return true;
  }
}


export class MmlItem extends BaseItem {

  constructor(...args: MmlNode[]) {
    super(...args);
    this.kind = 'mml';
    this.setProperty('isNotStack', true);
  }

  Add() {
    this.data.push.apply(this.data, arguments);
    return this;
  }
}


export class FnItem extends BaseItem {

  constructor(...args: MmlNode[]) {
    super(...args);
    this.kind = 'fn';
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem fn');
    if (this.data[0]) {
      if (item.isOpen) {
        return true;
      }
      if (!item.hasType('fn')) {
        TreeHelper.printSimple('case 3');
        if (!item.hasType('mml') || !item.data[0]) {
          TreeHelper.printSimple('case 4');
          return [this.data[0], item];
        }
        if (TreeHelper.isType(item.data[0], 'mspace')) {
          TreeHelper.untested(100);
          return [this.data[0], item];
        }
        let mml = item.data[0];
        if (TreeHelper.isEmbellished(mml)) {
          TreeHelper.printSimple('case 5');
          mml = TreeHelper.getCoreMO(mml);
        }
        // TODO: Look this up in the operator table either as
        //       infix/postfix/prefix.
        if ([0, 0, 1, 1, 0, 1, 1, 0, 0, 0][TreeHelper.getTexClass(mml)]) {
          return [this.data[0], item];
        }
      }
      // @test Named Function
      const text = TreeHelper.createText(MmlEntities.ENTITIES.ApplyFunction);
      const node = TreeHelper.createNode('mo', [], {texClass: TEXCLASS.NONE}, text);
      // VS: OLD
      // var node = MML.mo(MML.entity('#x2061')).With({texClass:MML.TEXCLASS.NONE});
      return [this.data[0], node, item];
    }
    return super.checkItem.apply(this, arguments);
  }
}

export class NotItem extends BaseItem {

  private remap = MapHandler.getInstance().getMap('not_remap') as CharacterMap;

  constructor() {
    super();
    this.kind = 'not';
  }

  // TODO: There is a lot of recasting that should go away!
  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem not');
    let mml: TextNode | MmlNode;
    let c: string;
    let textNode: TextNode;
    if (item.hasType('open') || item.hasType('left')) {
      return true as CheckType;
    }
    if (item.hasType('mml') &&
        (TreeHelper.isType(item.data[0], 'mo') || TreeHelper.isType(item.data[0], 'mi') ||
         TreeHelper.isType(item.data[0], 'mtext'))) {
      mml = item.data[0] as TextNode;
      TreeHelper.printJSON(mml);
      c = TreeHelper.getText(mml as TextNode);
      if (c.length === 1 && !TreeHelper.getProperty(mml, 'movesupsub') &&
          TreeHelper.getChildren(mml).length === 1) {
        if (this.remap.contains(c)) {
          // @test Negation Simple, Negation Complex
          textNode = TreeHelper.createText(this.remap.lookup(c).char);
          TreeHelper.setData(mml, 0, textNode);
          // VS: OLD
          // mml.SetData(0, MML.chars(this.remap.lookup(c).char));
        } else {
          // @test Negation Explicit
          textNode = TreeHelper.createText('\u0338');
          TreeHelper.appendChildren(mml, [textNode]);
          // VS: OLD
          // mml.Append(MML.chars('\u0338'));
        }
        return item as CheckType;
      }
    }
    //  \mathrel{\rlap{\notChar}}
    // @test Negation Large
    textNode = TreeHelper.createText('\u29F8');
    const mtextNode = TreeHelper.createNode('mtext', [], {}, textNode);
    const paddedNode = TreeHelper.createNode('mpadded', [mtextNode], {width: 0});
    mml = TreeHelper.createNode('TeXAtom', [paddedNode], {texClass: TEXCLASS.REL}) as MmlNode;
    // VS: OLD
    // mml = MML.mpadded(MML.mtext('\u29F8')).With({width:0});
    // mml = MML.TeXAtom(mml).With({texClass:MML.TEXCLASS.REL});
    return [mml, item];
  }
}


export class DotsItem extends BaseItem {

  constructor() {
    super();
    this.kind = 'dots';
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem dots');
    if (item.hasType('open') || item.hasType('left')) {
      return true;
    }
    let dots = this.getProperty('ldots') as MmlNode;
    // @test Operator Dots
    if (item.hasType('mml') && TreeHelper.isEmbellished(item.data[0])) {
      // TODO: Lookup in Operator Table.
      const tclass = TreeHelper.getTexClass(TreeHelper.getCoreMO(item.data[0]));
      if (tclass === TEXCLASS.BIN || tclass === TEXCLASS.REL) {
        dots = this.getProperty('cdots') as MmlNode;
      }
    }
    return [dots, item] as CheckType;
  }
}


// AMS


export class AMSarrayItem extends ArrayItem {

  private numbered: boolean = false;
  private save: {[key: string]: string} = {};
  
  constructor(name: string, numbered: boolean, taggable: boolean, global: EnvList) {
    super();
    this.kind = 'AMSarray';
    // Omitted configuration: && CONFIG.autoNumber !== "none";
    this.numbered = numbered;
    this.save['notags'] = global['notags'] as string;
    this.save['notag'] = global['notag'] as string;
    global['notags'] = (taggable ? null : name);
    // prevent automatic tagging in starred environments
    global['tagged'] = !numbered && !global['forcetag'];
  }

  // TODO: Temporary!
  autoTag() {}
  getTag(): MmlNode {
    return;
  }
  clearTag() {}

  EndEntry() {
    TreeHelper.printMethod('AMS-EndEntry');
    // @test Cubic Binomial
    if (this.row.length) {
      ParserUtil.fixInitialMO(this.data);
    }
    const node = TreeHelper.createNode('mtd', this.data, {});
    // VS: OLD
    // var node = MML.mtd.apply(MML,this.data);
    this.row.push(node);
    this.data = [];
  }
  
  EndRow() {
    TreeHelper.printMethod('AMS-EndRow');
    // @test Cubic Binomial
    let mtr = 'mtr'; // MML.mtr;
    if (!this.global['tag'] && this.numbered) {
      this.autoTag();
    }
    if (this.global['tag'] && !this.global['notags']) {
      this.row = [this.getTag()].concat(this.row);
      mtr = 'mlabeledtr'; // MML.mlabeledtr;
    } else {
      this.clearTag();
    }
    if (this.numbered) {delete this.global['notag'];}
    const node = TreeHelper.createNode(mtr, this.row, {});
    this.table.push(node); this.row = [];
  }
  
  EndTable() {
    TreeHelper.printMethod('AMS-EndTable');
    // @test Cubic Binomial
    super.EndTable();
    this.global['notags'] = this.save['notags'];
    this.global['notag']  = this.save['notag'];
  }
}
