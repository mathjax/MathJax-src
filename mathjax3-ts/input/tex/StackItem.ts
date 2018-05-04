/*************************************************************
 *
 *  MathJax/jax/input/TeX/StackItem.ts
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


/**
 * @fileoverview Stack items hold information on the TexParser stack.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import MapHandler from './MapHandler.js';
import {CharacterMap} from './SymbolMap.js';
import {Entities} from '../../util/Entities.js';
import {MmlNode, TextNode, TEXCLASS} from '../../core/MmlTree/MmlNode.js';
import {MmlMsubsup} from '../../core/MmlTree/MmlNodes/msubsup.js';
import {TexConstant} from './TexConstants.js';
import TexError from './TexError.js';
import ParseUtil from './ParseUtil.js';
import {TreeHelper} from './TreeHelper.js';
import {Property, PropertyList} from '../../core/Tree/Node.js';
import StackItemFactory from './StackItemFactory.js';

// Union types for abbreviation.
export type EnvProp = string | number | boolean;

export type EnvList = {[key: string]: EnvProp};

// This is the type for all fields that used to be set with With.
export type Prop = string | number | boolean | MmlNode | PropList;

export type PropList = {[key: string]: Prop};

export type CheckType = boolean | MmlItem | (MmlNode | StackItem)[];


export interface NodeStack {

  /**
   * Get or set the topmost element on the node stack without removing it.
   * @return {MmlNode} The topmost node on the stack.
   */
  Top: MmlNode;

  /**
   * Get or set the last element on the node stack without removing it.
   * @return {MmlNode} The topmost node on the stack.
   */
  Last: MmlNode;

  /**
   * @return {MmlNode} The topmost node on the item's node stack.
   */
  Pop(): MmlNode | void;

  /**
   * Pushes new nodes onto the items node stack.
   * @param {MmlNode[]} ...nodes A list of nodes.
   */
  Push(...nodes: MmlNode[]): void;

  /**
   * Get the top n elements on the node stack without removing them.
   * @param {number=} n Number of elements that should be returned.
   * @return {MmlNode[]} List of nodes on top of stack.
   */
  TopN(n?: number): MmlNode[];

  /**
   * @return {number} The size of the stack.
   */
  Size(): number;

  /**
   * Clears the stack.
   */
  Clear(): void;

  /**
   * Returns nodes on the stack item's node stack as an Mml node. I.e., in case
   * the item contains more than one node, it creates an mrow.
   * @param {boolean=} inferred If set the mrow will be an inferred mrow.
   * @param {boolean=} forceRow If set an mrow will be created, regardless of
   *     how many nodes the item contains.
   * @return {MmlNode} The topmost Mml node.
   */
  toMml(inferred?: boolean, forceRow?: boolean): MmlNode;

}


export class MmlStack implements NodeStack {

  constructor(private _nodes: MmlNode[]) { }

  protected get nodes(): MmlNode[] {
    return this._nodes;
  }

  /**
   * @override
   */
  public Push(...nodes: MmlNode[]) {
    TreeHelper.printMethod('StackItem Push arguments: ' + this._nodes + ' arguments: ');
    this._nodes.push.apply(this._nodes, nodes);
  }


  /**
   * @override
   */
  public Pop(): MmlNode {
    return this._nodes.pop();
  }


  /**
   * @override
   */
  public get Top(): MmlNode {
    return this._nodes[0];
  }


  /**
   * @override
   */
  public set Top(node: MmlNode) {
    this._nodes[0] = node;
  }


  /**
   * @override
   */
  public get Last(): MmlNode {
    return this._nodes[this._nodes.length - 1];
  }


  /**
   * @override
   */
  public set Last(node: MmlNode) {
    this._nodes[this._nodes.length - 1] = node;
  }


  /**
   * @override
   */
  public TopN(n?: number): MmlNode[] {
    if (n == null) {
      n = 1;
    }
    return this._nodes.slice(0, n);
  }


  /**
   * @override
   */
  public Size(): number {
    return this._nodes.length;
  }


  /**
   * @override
   */
  public Clear(): void {
    this._nodes = [];
  }


  /**
   * @override
   */
  public toMml(inferred?: boolean, forceRow?: boolean) {
    TreeHelper.printMethod('toMml');
    if (inferred == null) {
      inferred = true;
    }
    if (this._nodes.length === 1 && !forceRow) {
      TreeHelper.printSimple('End 1');
      return this.Top;
    }
    // @test Two Identifiers
    return TreeHelper.createNode(inferred ? 'inferredMrow' : 'mrow', this._nodes, {});
    // VS: OLD
    // var node = MML.mrow.apply(MML,this.data).With((inferred ? {inferred: true}: {}));
  }

}

export interface StackItem extends NodeStack {

  kind: string;
  isClose: boolean;
  isOpen: boolean;
  isFinal: boolean;
  global: EnvList;
  env: EnvList;

  /**
   * Tests if item is of the given type.
   * @param {string} kind The type.
   * @return {boolean} True if item is of that type.
   */
  isKind(kind: string): boolean;

  getProperty(key: string): Prop;
  setProperty(key: string, value: Prop): void;

  getName(): string;
  checkItem(item: StackItem): CheckType;

}

export interface StackItemClass {
  new (factory: StackItemFactory, ...nodes: MmlNode[]): StackItem;
}

export abstract class BaseItem extends MmlStack implements StackItem {

  private _env: EnvList;

  private _properties: PropList = {};

  protected errors: {[key: string]: string[]} = {
    // @test ExtraOpenMissingClose End
    end: ['ExtraOpenMissingClose', 'Extra open brace or missing close brace'],
    // @test ExtraCloseMissingOpen
    close: ['ExtraCloseMissingOpen', 'Extra close brace or missing open brace'],
    // @test MissingLeftExtraRight
    right: ['MissingLeftExtraRight', 'Missing \\left or extra \\right']
  };

  public global: EnvList = {};

  constructor(private _factory: StackItemFactory, ...nodes: MmlNode[]) {
    super(nodes);
    if (this.isOpen) {
      this._env = {};
    }
  }

  public get factory() {
    return this._factory;
  }

  /**
   * @return {string} The type of the stack item.
   */
  public get kind() {
    return 'base';
  }

  get env() {
    return this._env;
  }

  set env(value) {
    this._env = value;
  }

  getProperty(key: string): Prop {
    return this._properties[key];
  }

  setProperty(key: string, value: Prop) {
    this._properties[key] = value;
  }


  /**
   * @return {boolean} True if item is an opening entity, i.e., it expects a
   *     closing counterpart on the stack later.
   */
  get isOpen() {
    return false;
  }

  /**
   * @return {boolean} True if item is an closing entity, i.e., it needs an
   *     opening counterpart already on the stack.
   */
  get isClose() {
    return false;
  }


  /**
   * @return {boolean} True if item is final, i.e., it contains one or multiple
   *      finished parsed nodes.
   */
  get isFinal() {
    return false;
  }


  /**
   * @override
   */
  public isKind(kind: string) {
    return kind === this.kind;
  }


  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    TreeHelper.printMethod('Checkitem base for ' + item.kind + ' with ' + item);
    if (item.isKind('over') && this.isOpen) {
      item.setProperty('num', this.toMml(false));
      this.Clear();
    }
    if (item.isKind('cell') && this.isOpen) {
      if (item.getProperty('linebreak')) {
        return false;
      }
      // TODO: Test what symbol really does!
      //throw new TexError(['Misplaced', 'Misplaced %1', item.getProperty('name').symbol]);
      // @test Ampersand-error
      throw new TexError(['Misplaced', 'Misplaced %1', item.getName()]);
    }
    if (item.isClose && this.errors[item.kind]) {
      throw new TexError(this.errors[item.kind]);
    }
    if (!item.isFinal) {
      return true;
    }
    this.Push(item.Top);
    return false;
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



  /**
   * Convenience method for returning the string property "name".
   * @return {string} The value for the name property.
   */
  public getName() {
    return this.getProperty('name') as string;
  }


  /**
   * @override
   */
  public toString() {
    return this.kind + '[' + this.nodes.join('; ') + ']';
  }

}

export class StartItem extends BaseItem {

  // TODO: Sort out this type!
  constructor(factory: StackItemFactory, ...global: any[]) {
    super(factory);
    this.global = global[0] as EnvList;
  }


  /**
   * @override
   */
  public get kind() {
    return 'start';
  }


  /**
   * @override
   */
  get isOpen() {
    return true;
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem start');
    if (item.isKind('stop')) {
      return this.factory.create('mml', this.toMml());
    }
    return super.checkItem(item);
  }
}

export class StopItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'stop';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }

}

export class OpenItem extends BaseItem {

  constructor(factory: StackItemFactory) {
    super(factory);
    // @test ExtraOpenMissingClose Stop
    this.errors['stop'] = ['ExtraOpenMissingClose',
                           'Extra open brace or missing close brace'];
  }

  /**
   * @override
   */
  public get kind() {
    return 'open';
  }


  /**
   * @override
   */
  get isOpen() {
    return true;
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem open');
    if (item.isKind('close')) {
      let mml = this.toMml();
      // @test PrimeSup
      // TODO: Move that into toMml?
      mml = TreeHelper.cleanSubSup(mml);
      const node = TreeHelper.createNode('TeXAtom', [mml], {});
      // VS: OLD
      // var node = MML.TeXAtom(mml);
      return this.factory.create('mml', node); // TeXAtom make it an ORD to prevent spacing
                                // (FIXME: should be another way)
    }
    return super.checkItem(item);
  }
}


export class CloseItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'close';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }

}


export class PrimeItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'prime';
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem prime');
    let [top0, top1] = this.TopN(2);
    if (!TreeHelper.isType(top0, 'msubsup')) {
      // @test Prime, Double Prime
      const node = TreeHelper.createNode('msup', [top0, top1], {});
      // VS: OLD
      // var node = MML.msup(top0,top1);
      return [node, item];
    }
    TreeHelper.setData(top0, (top0 as MmlMsubsup).sup, top1);
    return [top0, item];
  }
}

export class SubsupItem extends BaseItem {

  constructor(factory: StackItemFactory, ...nodes: MmlNode[]) {
    super(factory, ...nodes);
    // @test MissingScript Sub, MissingScript Sup
    this.errors['stop'] = ['MissingScript',
                           'Missing superscript or subscript argument'];
    // @test MissingOpenForSup
    this.errors['sup'] =  ['MissingOpenForSup',
                           'Missing open brace for superscript'];
    // @test MissingOpenForSub
    this.errors['sub'] =  ['MissingOpenForSub',
                           'Missing open brace for subscript'];
  }

  /**
   * @override
   */
  public get kind() {
    return 'subsup';
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem subsup');
    if (item.isKind('open') || item.isKind('left')) {
      return true;
    }
    const top = this.Top;
    const position = this.getProperty('position') as number;
    if (item.isKind('mml')) {
      if (this.getProperty('primes')) {
        if (position !== 2) {
          // @test Prime on Sub
          TreeHelper.setData(top, 2, this.getProperty('primes') as MmlNode);
        } else {
          // @test Prime on Prime
          TreeHelper.setProperties(this.getProperty('primes') as MmlNode, {variantForm: true});
          const node = TreeHelper.createNode('mrow', [this.getProperty('primes') as MmlNode, item.Top], {});
          // VS: OLD
          // var node = MML.mrow(this.primes, item.data[0]);
          item.Top = node;
        }
      }
      TreeHelper.setData(top, position, item.Top);
      if (this.getProperty('movesupsub') != null) {
        // @test Limits Subsup (currently does not work! Check again!)
        TreeHelper.setProperties(top, {movesupsub: this.getProperty('movesupsub')} as PropertyList);
      }
      const result = this.factory.create('mml', top);
      return result;
    }
    if (super.checkItem(item)) {
      // @test Brace Superscript Error, MissingOpenForSup, MissingOpenForSub
      throw new TexError(this.errors[['', 'sub', 'sup'][position]]);
    }
  }

}

export class OverItem extends BaseItem {

  constructor(factory: StackItemFactory) {
    super(factory);
    this.setProperty('name', '\\over');
  }

  /**
   * @override
   */
  public get kind() {
    return 'over';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }


  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem over');
    if (item.isKind('over')) {
      // @test Double Over
      throw new TexError(['AmbiguousUseOf', 'Ambiguous use of %1', item.getName()]);
    }
    if (item.isClose) {
      // @test Over
      let mml = TreeHelper.createNode('mfrac',
                                      [this.getProperty('num') as MmlNode, this.toMml(false)], {});
      // VS: OLD
      // var mml = MML.mfrac(this.num,this.toMml(false));
      if (this.getProperty('thickness') != null) {
        // @test Choose, Above, Above with Delims
        TreeHelper.setAttribute(mml, 'linethickness', this.getProperty('thickness') as string);
      }
      if (this.getProperty('open') || this.getProperty('close')) {
        // @test Choose
        TreeHelper.setProperties(mml, {'withDelims': true});
        mml = ParseUtil.fixedFence(this.getProperty('open') as string, mml,
                                    this.getProperty('close') as string);
      }
      return [this.factory.create('mml', mml), item];
    }
    return super.checkItem(item);
  }


  /**
   * @override
   */
  public toString() {
    return 'over[' + this.getProperty('num') +
      ' / ' + this.nodes.join('; ') + ']';
  }

}

export class LeftItem extends BaseItem {

  constructor(factory: StackItemFactory) {
    super(factory);
    this.setProperty('delim', '('),
    // @test ExtraLeftMissingRight
    this.errors['stop'] = ['ExtraLeftMissingRight',
                           'Extra \\left or missing \\right'];
  }

  /**
   * @override
   */
  public get kind() {
    return 'left';
  }


  /**
   * @override
   */
  get isOpen() {
    return true;
  }


  checkItem(item: StackItem) {
    // @test Missing Right
    TreeHelper.printMethod('Checkitem left');
    if (item.isKind('right')) {
      return this.factory.create('mml',
        ParseUtil.fenced(this.getProperty('delim') as string, this.toMml(),
                          item.getProperty('delim') as string));
    }
    return super.checkItem(item);
  }

}

export class RightItem extends BaseItem {

  constructor(factory: StackItemFactory) {
    super(factory);
    this.setProperty('delim', ')');
  }

  /**
   * @override
   */
  public get kind() {
    return 'right';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }

}

export class BeginItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'begin';
  }


  /**
   * @override
   */
  get isOpen() {
    return true;
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem begin');
    if (item.isKind('end')) {
      if (item.getName() !== this.getName()) {
        throw new TexError(['EnvBadEnd', '\\begin{%1} ended with \\end{%2}',
                            this.getName(), item.getName()]);
      }
      if (!this.getProperty('end')) {
        return this.factory.create('mml', this.toMml());
      }
      // TODO: This case currently does not work!
      //
      //       The problem: It needs to call a particular Parse Method. It is
      //       only used in equation(*) anyway and should therefore probably
      //       handled in a special case.
      // return this.parse[this.end].call(this.parse, this, this.data);
      return;
    }
    if (item.isKind('stop')) {
      throw new TexError(['EnvMissingEnd', 'Missing \\end{%1}', this.getName()]);
    }
    return super.checkItem(item);
  }

}

export class EndItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'end';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }

}

export class StyleItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'style';
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem style');
    if (!item.isClose) {
      return super.checkItem(item);
    }
    // @test Style
    const mml = TreeHelper.createNode('mstyle', this.nodes, this.getProperty('styles'));
    // VS: OLD
    // var mml = MML.mstyle.apply(MML,this.data).With(this.styles);
    return [this.factory.create('mml', mml), item];
  }

}

export class PositionItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'position';
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem position');
    if (item.isClose) {
      throw new TexError(['MissingBoxFor', 'Missing box for %1', this.getName()]);
    }
    if (item.isFinal) {
      let mml = item.toMml();
      switch (this.getProperty('move')) {
      case 'vertical':
        // @test Raise, Lower
        mml = TreeHelper.createNode('mpadded', [mml],
                                    {height: this.getProperty('dh'), depth: this.getProperty('dd'),
                                     voffset: this.getProperty('dh')});
        // VS: OLD
        // mml = MML.mpadded(mml).With({height: this.dh, depth: this.dd, voffset: this.dh});
        return [this.factory.create('mml', mml)];
      case 'horizontal':
        return [this.factory.create('mml', this.getProperty('left') as MmlNode), item,
                this.factory.create('mml', this.getProperty('right') as MmlNode)];
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

  /**
   * @override
   */
  public get kind() {
    return 'array';
  }


  /**
   * @override
   */
  get isOpen() {
    return true;
  }


  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem array');
    // @test Array Single
    if (item.isClose && !item.isKind('over')) {
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
        // @test Subarray, Small Matrix
        mml = TreeHelper.createNode('mstyle', [mml], {scriptlevel: scriptlevel});
        // VS: OLD
        // mml = MML.mstyle(mml).With({scriptlevel: scriptlevel})}
      }
      if (this.getProperty('open') || this.getProperty('close')) {
        // @test Cross Product Formula
        mml = ParseUtil.fenced(this.getProperty('open') as string, mml,
                                this.getProperty('close') as string);
      }
      let newItem = this.factory.create('mml', mml);
      if (this.getProperty('requireClose')) {
        // @test: Label
        if (item.isKind('close')) {
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
    const mtd = TreeHelper.createNode('mtd', this.nodes, {});
    // VS: OLD
    // var mtd = MML.mtd.apply(MML,this.data);
    if (this.hfill.length) {
      if (this.hfill[0] === 0) {
        TreeHelper.setAttribute(mtd, 'columnalign', 'right');
      }
      if (this.hfill[this.hfill.length - 1] === this.Size()) {
        TreeHelper.setAttribute(mtd, 'columnalign',
                                TreeHelper.getAttribute(mtd, 'columnalign') ? 'center' : 'left');
      }
    }
    this.row.push(mtd); this.Clear(); this.hfill = [];
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
    if (this.Size() || this.row.length) {
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

  /**
   * @override
   */
  public get kind() {
    return 'cell';
  }


  /**
   * @override
   */
  get isClose() {
    return true;
  }
}


export class MmlItem extends BaseItem {

  /**
   * @override
   */
  public get isFinal() {
    return true;
  }

  /**
   * @override
   */
  public get kind() {
    return 'mml';
  }

}


export class FnItem extends BaseItem {

  constructor(factory: StackItemFactory, ...nodes: MmlNode[]) {
    super(factory, ...nodes);
  }

  /**
   * @override
   */
  public get kind() {
    return 'fn';
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem fn');
    const top = this.Top;
    if (top) {
      if (item.isOpen) {
        return true;
      }
      if (!item.isKind('fn')) {
        TreeHelper.printSimple('case 3');
        let mml = item.Top;
        if (!item.isKind('mml') || !mml) {
          TreeHelper.printSimple('case 4');
          return [top, item];
        }
        if (TreeHelper.isType(mml, 'mspace')) {
          TreeHelper.untested(100);
          return [top, item];
        }
        if (TreeHelper.isEmbellished(mml)) {
          TreeHelper.printSimple('case 5');
          mml = TreeHelper.getCoreMO(mml);
        }
        // TODO: Look this up in the operator table either as
        //       infix/postfix/prefix.
        if ([0, 0, 1, 1, 0, 1, 1, 0, 0, 0][TreeHelper.getTexClass(mml)]) {
          return [top, item];
        }
      }
      // @test Named Function
      const text = TreeHelper.createText(Entities.ENTITIES.ApplyFunction);
      const node = TreeHelper.createNode('mo', [], {texClass: TEXCLASS.NONE}, text);
      // VS: OLD
      // var node = MML.mo(MML.entity('#x2061')).With({texClass:MML.TEXCLASS.NONE});
      return [top, node, item];
    }
    return super.checkItem.apply(this, arguments);
  }
}

export class NotItem extends BaseItem {

  private remap = MapHandler.getInstance().getMap('not_remap') as CharacterMap;

  /**
   * @override
   */
  public get kind() {
    return 'not';
  }

  // TODO: There is a lot of recasting that should go away!
  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem not');
    let mml: TextNode | MmlNode;
    let c: string;
    let textNode: TextNode;
    if (item.isKind('open') || item.isKind('left')) {
      return true;
    }
    if (item.isKind('mml') &&
        (TreeHelper.isType(item.Top, 'mo') || TreeHelper.isType(item.Top, 'mi') ||
         TreeHelper.isType(item.Top, 'mtext'))) {
      TreeHelper.printJSON(mml);
      // TODO: This is the wrong type! That should be a token node!
      mml = item.Top as TextNode;
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
        return item as MmlItem;
      }
    }
    //  \mathrel{\rlap{\notChar}}
    // @test Negation Large
    textNode = TreeHelper.createText('\u29F8');
    const mtextNode = TreeHelper.createNode('mtext', [], {}, textNode);
    const paddedNode = TreeHelper.createNode('mpadded', [mtextNode], {width: 0});
    mml = TreeHelper.createNode('TeXAtom', [paddedNode], {texClass: TEXCLASS.REL});
    // VS: OLD
    // mml = MML.mpadded(MML.mtext('\u29F8')).With({width:0});
    // mml = MML.TeXAtom(mml).With({texClass:MML.TEXCLASS.REL});
    return [mml, item];
  }
}


export class DotsItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'dots';
  }

  checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem dots');
    if (item.isKind('open') || item.isKind('left')) {
      return true;
    }
    let dots = this.getProperty('ldots') as MmlNode;
    let top = item.Top;
    // @test Operator Dots
    if (item.isKind('mml') && TreeHelper.isEmbellished(top)) {
      // TODO: Lookup in Operator Table.
      const tclass = TreeHelper.getTexClass(TreeHelper.getCoreMO(top));
      if (tclass === TEXCLASS.BIN || tclass === TEXCLASS.REL) {
        dots = this.getProperty('cdots') as MmlNode;
      }
    }
    return [dots, item];
  }
}
