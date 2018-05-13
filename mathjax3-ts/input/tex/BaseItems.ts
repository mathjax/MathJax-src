/*************************************************************
 *
 *  MathJax/jax/input/TeX/BaseItems.ts
 *
 *  Implements the TeX InputJax that reads mathematics in
 *  TeX and LaTeX format and converts it to the MML ElementJax
 *  internal format.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2009-2018 The MathJax Consortium
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
 * @fileoverview Stack items for basic Tex parsing.
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
import {BaseItem, StackItem, EnvList} from './StackItem.js';
import {TagsFactory, DefaultTags} from './Tags.js';


export class StartItem extends BaseItem {

  /**
   * @override
   */
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

  /**
   * @override
   */
  public checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem start');
    if (item.isKind('stop')) {
      let node = this.toMml();
      if (!this.global.isInner) {
        node = DefaultTags.finalize(node, this.env);
      }
      return this.factory.create('mml', node);
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

  /**
   * @override
   */
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

  /**
   * @override
   */
  public checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem open');
    if (item.isKind('close')) {
      // @test PrimeSup
      let mml = this.toMml();
      const node = TreeHelper.createNode('TeXAtom', [mml], {});
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

  /**
   * @override
   */
  public checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem prime');
    let [top0, top1] = this.TopN(2);
    if (!TreeHelper.isType(top0, 'msubsup')) {
      // @test Prime, Double Prime
      const node = TreeHelper.createNode('msup', [top0, top1], {});
      return [node, item];
    }
    TreeHelper.setData(top0, (top0 as MmlMsubsup).sup, top1);
    return [top0, item];
  }
}

export class SubsupItem extends BaseItem {

  /**
   * @override
   */
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

  /**
   * @override
   */
  public checkItem(item: StackItem) {
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

  /**
   * @override
   */
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


  /**
   * @override
   */
  public checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem over');
    if (item.isKind('over')) {
      // @test Double Over
      throw new TexError(
        ['AmbiguousUseOf', 'Ambiguous use of %1', item.getName()]);
    }
    if (item.isClose) {
      // @test Over
      let mml = TreeHelper.createNode(
        'mfrac', [this.getProperty('num') as MmlNode, this.toMml(false)], {});
      if (this.getProperty('thickness') != null) {
        // @test Choose, Above, Above with Delims
        TreeHelper.setAttribute(mml, 'linethickness',
                                this.getProperty('thickness') as string);
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
  
  /**
   * @override
   */
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


  /**
   * @override
   */
  public checkItem(item: StackItem) {
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

  /**
   * @override
   */
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

  /**
   * @override
   */
  public checkItem(item: StackItem) {
    if (item.isKind('end')) {
      if (item.getName() !== this.getName()) {
        throw new TexError(['EnvBadEnd', '\\begin{%1} ended with \\end{%2}',
                            this.getName(), item.getName()]);
      }
      if (!this.getProperty('end')) {
        return this.factory.create('mml', this.toMml());
      }
      return false;
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

  /**
   * @override
   */
  public checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem style');
    if (!item.isClose) {
      return super.checkItem(item);
    }
    // @test Style
    const mml = TreeHelper.createNode('mstyle', this.nodes, this.getProperty('styles'));
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


  /**
   * @override
   */
  public checkItem(item: StackItem) {
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
                                    {height: this.getProperty('dh'),
                                     depth: this.getProperty('dd'),
                                     voffset: this.getProperty('dh')});
        return [this.factory.create('mml', mml)];
      case 'horizontal':
        return [this.factory.create('mml', this.getProperty('left') as MmlNode), item,
                this.factory.create('mml', this.getProperty('right') as MmlNode)];
      }
    }
    return super.checkItem(item);
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

  /**
   * @override
   */
  public get kind() {
    return 'fn';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem fn');
    const top = this.Top;
    if (top) {
      if (item.isOpen) {
        // @test Fn Stretchy
        return true;
      }
      if (!item.isKind('fn')) {
        // @test Named Function
        let mml = item.Top;
        if (!item.isKind('mml') || !mml) {
          // @test Mathop Super
          return [top, item];
        }
        if (TreeHelper.isType(mml, 'mspace')) {
          // @test Fn Pos Space, Fn Neg Space
          return [top, item];
        }
        if (TreeHelper.isEmbellished(mml)) {
          // @test MultiInt with Limits
          mml = TreeHelper.getCoreMO(mml);
        }
        const form = TreeHelper.getForm(mml);
        if (form != null && [0, 0, 1, 1, 0, 1, 1, 0, 0, 0][form[2]]) {
          // @test Fn Operator
          return [top, item];
        }
      }
      // @test Named Function, Named Function Arg
      const text = TreeHelper.createText(Entities.ENTITIES.ApplyFunction);
      const node = TreeHelper.createNode('mo', [], {texClass: TEXCLASS.NONE}, text);
      return [top, node, item];
    }
    // @test Mathop Super, Mathop Sub
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
  /**
   * @override
   */
  public checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem not');
    let mml: TextNode | MmlNode;
    let c: string;
    let textNode: TextNode;
    if (item.isKind('open') || item.isKind('left')) {
      // @test Negation Left Paren
      return true;
    }
    if (item.isKind('mml') &&
        (TreeHelper.isType(item.Top, 'mo') || TreeHelper.isType(item.Top, 'mi') ||
         TreeHelper.isType(item.Top, 'mtext'))) {
      mml = item.Top;
      c = TreeHelper.getText(mml as TextNode);
      if (c.length === 1 && !TreeHelper.getProperty(mml, 'movesupsub') &&
          TreeHelper.getChildren(mml).length === 1) {
        if (this.remap.contains(c)) {
          // @test Negation Simple, Negation Complex
          textNode = TreeHelper.createText(this.remap.lookup(c).char);
          TreeHelper.setData(mml, 0, textNode);
        } else {
          // @test Negation Explicit
          textNode = TreeHelper.createText('\u0338');
          TreeHelper.appendChildren(mml, [textNode]);
        }
        return item as MmlItem;
      }
    }
    // @test Negation Large
    textNode = TreeHelper.createText('\u29F8');
    const mtextNode = TreeHelper.createNode('mtext', [], {}, textNode);
    const paddedNode = TreeHelper.createNode('mpadded', [mtextNode], {width: 0});
    mml = TreeHelper.createNode('TeXAtom', [paddedNode], {texClass: TEXCLASS.REL});
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

  /**
   * @override
   */
  public checkItem(item: StackItem) {
    TreeHelper.printMethod('Checkitem dots');
    if (item.isKind('open') || item.isKind('left')) {
      return true;
    }
    let dots = this.getProperty('ldots') as MmlNode;
    let top = item.Top;
    // @test Operator Dots
    if (item.isKind('mml') && TreeHelper.isEmbellished(top)) {
      const tclass = TreeHelper.getTexClass(TreeHelper.getCoreMO(top));
      if (tclass === TEXCLASS.BIN || tclass === TEXCLASS.REL) {
        dots = this.getProperty('cdots') as MmlNode;
      }
    }
    return [dots, item];
  }
}


export class ArrayItem extends BaseItem {

  public table: MmlNode[] = [];
  public row: MmlNode[] = [];
  public frame: string[] = [];
  public hfill: number[] = [];
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


  /**
   * @override
   */
  public checkItem(item: StackItem) {
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
      if (this.frame.length === 4) {
        // @test Enclosed frame solid, Enclosed frame dashed
        TreeHelper.setAttribute(mml, 'frame', this.dashed ? 'dashed' : 'solid');
      } else if (this.frame.length) {
        // @test Enclosed left right
        if (this.arraydef['rowlines']) {
          // @test Enclosed dashed row, Enclosed solid row,
          this.arraydef['rowlines'] =
            (this.arraydef['rowlines'] as string).replace(/none( none) + $/, 'none');
        }
        // @test Enclosed left right
        mml = TreeHelper.createNode('menclose', [mml],
                                    {notation: this.frame.join(' '), isFrame: true});
        if ((this.arraydef['columnlines'] || 'none') !== 'none' ||
            (this.arraydef['rowlines'] || 'none') !== 'none') {
          // @test Enclosed dashed row, Enclosed solid row
          // @test Enclosed dashed column, Enclosed solid column
          TreeHelper.setAttribute(mml, 'padding', 0);
        }
      }
      if (scriptlevel) {
        // @test Subarray, Small Matrix
        mml = TreeHelper.createNode('mstyle', [mml], {scriptlevel: scriptlevel});
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


  /**
   * Finishes a single cell of the array.
   */
  public EndEntry() {
    // @test Array1, Array2
    const mtd = TreeHelper.createNode('mtd', this.nodes, {});
    if (this.hfill.length) {
      if (this.hfill[0] === 0) {
        TreeHelper.setAttribute(mtd, 'columnalign', 'right');
      }
      if (this.hfill[this.hfill.length - 1] === this.Size()) {
        TreeHelper.setAttribute(
          mtd, 'columnalign',
          TreeHelper.getAttribute(mtd, 'columnalign') ? 'center' : 'left');
      }
    }
    this.row.push(mtd);
    this.Clear();
    this.hfill = [];
  }


  /**
   * Finishes a single row of the array.
   */
  public EndRow() {
    let node: MmlNode;
    if (this.getProperty('isNumbered') && this.row.length === 3) {
      // @test Label, Matrix Numbered
      this.row.unshift(this.row.pop());  // move equation number to first
                                         // position
      node = TreeHelper.createNode('mlabeledtr', this.row, {});
    } else {
      // @test Array1, Array2
      node = TreeHelper.createNode('mtr', this.row, {});
    }
    this.table.push(node);
    this.row = [];
  }


  /**
   * Finishes the table layout.
   */
  public EndTable() {
    if (this.Size() || this.row.length) {
      this.EndEntry();
      this.EndRow();
    }
    this.checkLines();
  }


  /**
   * Finishes line layout if not already given.
   */
  public checkLines() {
    if (this.arraydef['rowlines']) {
      const lines = (this.arraydef['rowlines'] as string).split(/ /);
      if (lines.length === this.table.length) {
        this.frame.push('bottom');
        lines.pop();
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

}


export class EqnArrayItem extends ArrayItem {

  /**
   * @override
   */
  constructor(factory: any, ...args: any[]) {
    super(factory);
    DefaultTags.start(args[0], args[2], args[1]);
  }


  /**
   * @override
   */
  get kind() {
    return 'eqnarray';
  }


  /**
   * @override
   */
  public EndEntry() {
    TreeHelper.printMethod('AMS-EndEntry');
    // @test Cubic Binomial
    if (this.row.length) {
      ParseUtil.fixInitialMO(this.nodes);
    }
    const node = TreeHelper.createNode('mtd', this.nodes, {});
    this.row.push(node);
    this.Clear();
  }

  /**
   * @override
   */
  public EndRow() {
    TreeHelper.printMethod('AMS-EndRow');
    // @test Cubic Binomial
    let mtr = 'mtr';
    let tag = DefaultTags.getTag();
    if (tag) {
      this.row = [tag].concat(this.row);
      mtr = 'mlabeledtr';
    }
    DefaultTags.clearTag();
    const node = TreeHelper.createNode(mtr, this.row, {});
    this.table.push(node); this.row = [];
  }

  /**
   * @override
   */
  public EndTable() {
    TreeHelper.printMethod('AMS-EndTable');
    // @test Cubic Binomial
    super.EndTable();
    DefaultTags.end();
  }
}


export class EquationItem extends BaseItem {

  /**
   * @override
   */
  constructor(factory: any, ...args: any[]) {
    super(factory);
    DefaultTags.start('equation', true, args[0]);
  }


  /**
   * @override
   */
  get kind() {
    return 'equation';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem) {
    if (item.isKind('end')) {
      let mml = this.toMml();
      let tag = DefaultTags.getTag();
      return [tag ? TagsFactory.enTag(mml, tag) : mml, item];
    }
    return super.checkItem(item);
  }

}
