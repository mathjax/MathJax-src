/*************************************************************
 *
 *  Copyright (c) 2009-2025 The MathJax Consortium
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
 * @file Stack items for basic Tex parsing.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { MapHandler } from '../MapHandler.js';
import { CharacterMap } from '../TokenMap.js';
import { entities } from '../../../util/Entities.js';
import { MmlNode, TextNode, TEXCLASS } from '../../../core/MmlTree/MmlNode.js';
import { MmlMo } from '../../../core/MmlTree/MmlNodes/mo.js';
import { MmlMsubsup } from '../../../core/MmlTree/MmlNodes/msubsup.js';
import { MmlMunderover } from '../../../core/MmlTree/MmlNodes/munderover.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import { ParseUtil } from '../ParseUtil.js';
import { UnitUtil } from '../UnitUtil.js';
import NodeUtil from '../NodeUtil.js';
import { Property, PropertyList } from '../../../core/Tree/Node.js';
import StackItemFactory from '../StackItemFactory.js';
import { CheckType, BaseItem, StackItem, EnvList } from '../StackItem.js';
import { TRBL } from '../../../util/Styles.js';
import { TexConstant } from '../TexConstants.js';

/**
 * Initial item on the stack. It's pushed when parsing begins.
 */
export class StartItem extends BaseItem {
  /**
   * @override
   */
  constructor(
    factory: StackItemFactory,
    public global: EnvList
  ) {
    super(factory);
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
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('stop')) {
      let node = this.toMml();
      if (!this.global.isInner) {
        node = this.factory.configuration.tags.finalize(node, this.env);
      }
      return [[this.factory.create('mml', node)], true];
    }
    return super.checkItem(item);
  }
}

/**
 * Final item on the stack. Errors will be thrown if other items than the start
 * item are still on the stack.
 */
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

/**
 * Item indicating an open brace.
 */
export class OpenItem extends BaseItem {
  /**
   * @override
   */
  protected static errors = Object.assign(Object.create(BaseItem.errors), {
    // @test ExtraOpenMissingClose
    stop: ['ExtraOpenMissingClose', 'Extra open brace or missing close brace'],
  });

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
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('close')) {
      // @test PrimeSup
      const mml = this.toMml();
      const node = this.create('node', 'TeXAtom', [mml]);
      addLatexItem(node, item);
      return [[this.factory.create('mml', node)], true];
    }
    return super.checkItem(item);
  }
}

/**
 * Item indicating a close brace. Collapses stack until an OpenItem is found.
 */
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

/**
 * Item pushed when a macro doesn't produce any output.
 */
export class NullItem extends BaseItem {
  /**
   * @override
   */
  public get kind() {
    return 'null';
  }
}

/**
 * Item indicating an we are currently dealing with a prime mark.
 */
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
  public checkItem(item: StackItem): CheckType {
    const [top0, top1] = this.Peek(2);
    const isSup =
      (NodeUtil.isType(top0, 'msubsup') || NodeUtil.isType(top0, 'msup')) &&
      !NodeUtil.getChildAt(top0, (top0 as MmlMsubsup).sup);
    const isOver =
      (NodeUtil.isType(top0, 'munderover') || NodeUtil.isType(top0, 'mover')) &&
      !NodeUtil.getChildAt(top0, (top0 as MmlMunderover).over) &&
      !NodeUtil.getProperty(top0, 'subsupOK');
    if (!isSup && !isOver) {
      // @test Prime, Double Prime
      const node = this.create(
        'node',
        top0.getProperty('movesupsub') ? 'mover' : 'msup',
        [top0, top1]
      );
      return [[node, item], true];
    }
    const pos = isSup ? (top0 as MmlMsubsup).sup : (top0 as MmlMunderover).over;
    NodeUtil.setChild(top0, pos, top1);
    return [[top0, item], true];
  }
}

/**
 * Item indicating an we are currently dealing with a sub/superscript
 * expression.
 */
export class SubsupItem extends BaseItem {
  /**
   * @override
   */
  protected static errors = Object.assign(Object.create(BaseItem.errors), {
    // @test MissingScript Sub, MissingScript Sup
    stop: ['MissingScript', 'Missing superscript or subscript argument'],
    // @test MissingOpenForSup
    sup: ['MissingOpenForSup', 'Missing open brace for superscript'],
    // @test MissingOpenForSub
    sub: ['MissingOpenForSub', 'Missing open brace for subscript'],
  });

  /**
   * @override
   */
  public get kind() {
    return 'subsup';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType | null {
    if (item.isKind('open') || item.isKind('left')) {
      return BaseItem.success;
    }
    const top = this.First;
    const position = this.getProperty('position') as number;
    if (item.isKind('mml')) {
      if (this.getProperty('primes')) {
        if (position !== 2) {
          // @test Prime on Sub
          NodeUtil.setChild(top, 2, this.getProperty('primes') as MmlNode);
        } else {
          // @test Prime on Prime
          NodeUtil.setProperty(
            this.getProperty('primes') as MmlNode,
            'variantForm',
            true
          );
          const node = this.create('node', 'mrow', [
            this.getProperty('primes') as MmlNode,
            item.First,
          ]);
          item.First = node;
        }
      }
      NodeUtil.setChild(top, position, item.First);
      if (this.getProperty('movesupsub') != null) {
        // @test Limits Subsup (currently does not work! Check again!)
        NodeUtil.setProperty(
          top,
          'movesupsub',
          this.getProperty('movesupsub') as Property
        );
      }
      const result = this.factory.create('mml', top);
      return [[result], true];
    }
    super.checkItem(item);
    // @test Brace Superscript Error, MissingOpenForSup, MissingOpenForSub
    const error = this.getErrors(['', 'sub', 'sup'][position]);
    throw new TexError(error[0], error[1], ...error.splice(2));
  }
}

/**
 * Item indicating an we are currently dealing with an \\over command.
 */
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
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('over')) {
      // @test Double Over
      throw new TexError(
        'AmbiguousUseOf',
        'Ambiguous use of %1',
        item.getName()
      );
    }
    if (item.isClose) {
      // @test Over
      let mml = this.create('node', 'mfrac', [
        this.getProperty('num') as MmlNode,
        this.toMml(false),
      ]);
      if (this.getProperty('thickness') != null) {
        // @test Choose, Above, Above with Delims
        NodeUtil.setAttribute(
          mml,
          'linethickness',
          this.getProperty('thickness') as string
        );
      }
      if (this.getProperty('ldelim') || this.getProperty('rdelim')) {
        // @test Choose
        NodeUtil.setProperty(mml, 'withDelims', true);
        mml = ParseUtil.fixedFence(
          this.factory.configuration,
          this.getProperty('ldelim') as string,
          mml,
          this.getProperty('rdelim') as string
        );
      }
      mml.attributes.set(
        TexConstant.Attr.LATEXITEM,
        this.getProperty('name') as string
      );
      return [[this.factory.create('mml', mml), item], true];
    }
    return super.checkItem(item);
  }

  /**
   * @override
   */
  public toString() {
    return (
      'over[' + this.getProperty('num') + ' / ' + this.nodes.join('; ') + ']'
    );
  }
}

/**
 * Item pushed when a \\left opening delimiter has been found.
 */
export class LeftItem extends BaseItem {
  /**
   * @override
   */
  protected static errors = Object.assign(Object.create(BaseItem.errors), {
    // @test ExtraLeftMissingRight
    stop: ['ExtraLeftMissingRight', 'Extra \\left or missing \\right'],
  });

  /**
   * @override
   */
  constructor(factory: StackItemFactory, delim: string) {
    super(factory);
    this.setProperty('delim', delim);
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
  public checkItem(item: StackItem): CheckType {
    // @test Missing Right
    if (item.isKind('right')) {
      //
      //  Create the fenced structure as an mrow
      //
      const fenced = ParseUtil.fenced(
        this.factory.configuration,
        this.getProperty('delim') as string,
        this.toMml(),
        item.getProperty('delim') as string,
        '',
        item.getProperty('color') as string
      );
      const left = fenced.childNodes[0];
      const right = fenced.childNodes[fenced.childNodes.length - 1];
      const mrow = this.factory.create('mml', fenced);
      addLatexItem(left, this, '\\left');
      addLatexItem(right, item, '\\right');
      mrow
        .Peek()[0]
        .attributes.set(
          TexConstant.Attr.LATEXITEM,
          '\\left' + item.startStr.slice(this.startI, item.stopI)
        );
      return [[mrow], true];
    }
    if (item.isKind('middle')) {
      //
      //  Add the middle delimiter, with empty open and close elements around it for spacing
      //
      const def = { stretchy: true } as any;
      if (item.getProperty('color')) {
        def.mathcolor = item.getProperty('color');
      }
      const middle = this.create('token', 'mo', def, item.getProperty('delim'));
      addLatexItem(middle, item, '\\middle');
      this.Push(
        this.create('node', 'TeXAtom', [], { texClass: TEXCLASS.CLOSE }),
        middle,
        this.create('node', 'TeXAtom', [], { texClass: TEXCLASS.OPEN })
      );
      this.env = {}; // Since \middle closes the group, clear the environment
      return [[this], true]; // this will reset the environment to its initial state
    }
    return super.checkItem(item);
  }
}

/**
 * Item pushed when a \\middle delimiter has been found. Stack is
 * collapsed until a corresponding LeftItem is encountered.
 */
export class Middle extends BaseItem {
  /**
   * @override
   */
  constructor(factory: StackItemFactory, delim: string, color: string) {
    super(factory);
    this.setProperty('delim', delim);
    if (color) {
      this.setProperty('color', color);
    }
  }

  /**
   * @override
   */
  public get kind() {
    return 'middle';
  }

  /**
   * @override
   */
  get isClose() {
    return true;
  }
}

/**
 * Item pushed when a \\right closing delimiter has been found. Stack is
 * collapsed until a corresponding LeftItem is encountered.
 */
export class RightItem extends BaseItem {
  /**
   * @override
   */
  constructor(factory: StackItemFactory, delim: string, color: string) {
    super(factory);
    this.setProperty('delim', delim);
    if (color) {
      this.setProperty('color', color);
    }
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

/**
 * Add linebreak attribute to next mo, if any, or insert an mo with the
 * given linebreak attribute.
 */
export class BreakItem extends BaseItem {
  /**
   * @override
   */
  public get kind() {
    return 'break';
  }

  /**
   * @override
   * @param {StackItemFactory} factory The current stack item factory
   * @param {string} linebreak   The linbreak attribute to use
   * @param {boolean} insert     Whether to insert an mo if there isn't a following
   */
  constructor(factory: StackItemFactory, linebreak: string, insert: boolean) {
    super(factory);
    this.setProperty('linebreak', linebreak);
    this.setProperty('insert', insert);
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    const linebreak = this.getProperty('linebreak') as string;
    if (item.isKind('mml')) {
      const mml = item.First;
      if (mml.isKind('mo')) {
        const style =
          NodeUtil.getOp(mml as MmlMo)?.[3]?.linebreakstyle ||
          NodeUtil.getAttribute(mml, 'linebreakstyle');
        if (style !== 'after') {
          NodeUtil.setAttribute(mml, 'linebreak', linebreak);
          return [[item], true];
        }
        if (!this.getProperty('insert')) {
          return [[item], true];
        }
      }
    }
    const mml = this.create('token', 'mspace', { linebreak });
    return [[this.factory.create('mml', mml), item], true];
  }
}

/**
 * Item pushed for opening an environment with \\begin{env}.
 */
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
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('end')) {
      if (item.getName() !== this.getName()) {
        // @test EnvBadEnd
        throw new TexError(
          'EnvBadEnd',
          '\\begin{%1} ended with \\end{%2}',
          this.getName(),
          item.getName()
        );
      }
      // @test Hfill
      const node = this.toMml();
      addLatexItem(node, item);
      return [[this.factory.create('mml', node)], true];
    }
    if (item.isKind('stop')) {
      // @test EnvMissingEnd Array
      throw new TexError('EnvMissingEnd', 'Missing \\end{%1}', this.getName());
    }
    return super.checkItem(item);
  }
}

/**
 * Item pushed for closing an environment with \\end{env}. Stack is collapsed
 * until a corresponding BeginItem for 'env' is found. Error is thrown in case
 * other open environments interfere.
 */
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

/**
 * Item pushed for remembering styling information.
 */
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
  public checkItem(item: StackItem): CheckType {
    if (!item.isClose) {
      return super.checkItem(item);
    }
    // @test Style
    const mml = this.create(
      'node',
      'mstyle',
      this.nodes,
      this.getProperty('styles')
    );
    return [[this.factory.create('mml', mml), item], true];
  }
}

/**
 * Item pushed for remembering positioning information.
 */
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
  public checkItem(item: StackItem): CheckType {
    if (item.isClose) {
      // @test MissingBoxFor
      throw new TexError('MissingBoxFor', 'Missing box for %1', this.getName());
    }
    if (item.isFinal) {
      let mml = item.toMml();
      switch (this.getProperty('move')) {
        case 'vertical':
          // @test Raise, Lower, Raise Negative, Lower Negative
          mml = this.create('node', 'mpadded', [mml], {
            height: this.getProperty('dh'),
            depth: this.getProperty('dd'),
            voffset: this.getProperty('dh'),
          });
          return [[this.factory.create('mml', mml)], true];
        case 'horizontal':
          // @test Move Left, Move Right, Move Left Negative, Move Right Negative
          return [
            [
              this.factory.create('mml', this.getProperty('left') as MmlNode),
              item,
              this.factory.create('mml', this.getProperty('right') as MmlNode),
            ],
            true,
          ];
      }
    }
    return super.checkItem(item);
  }
}

/**
 * Item indicating a table cell.
 */
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

/**
 * Final item for collating Nodes.
 */
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

/**
 * Item indicating a named function operator (e.g., \\sin) as been encountered.
 */
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
  public checkItem(item: StackItem): CheckType {
    const top = this.First;
    if (top) {
      if (item.isOpen) {
        // @test Fn Stretchy
        return BaseItem.success;
      }
      if (!item.isKind('fn')) {
        // @test Named Function
        let mml = item.First;
        if (!item.isKind('mml') || !mml) {
          // @test Mathop Super
          return [[top, item], true];
        }
        if (
          (NodeUtil.isType(mml, 'mstyle') &&
            mml.childNodes.length &&
            NodeUtil.isType(mml.childNodes[0].childNodes[0], 'mspace')) ||
          NodeUtil.isType(mml, 'mspace')
        ) {
          // @test Fn Pos Space, Fn Neg Space
          return [[top, item], true];
        }
        if (NodeUtil.isEmbellished(mml)) {
          // @test MultiInt with Limits
          mml = NodeUtil.getCoreMO(mml);
        }
        const form = NodeUtil.getForm(mml);
        if (form != null && [0, 0, 1, 1, 0, 1, 1, 0, 0, 0][form[2]]) {
          // @test Fn Operator
          return [[top, item], true];
        }
      }
      // @test Named Function, Named Function Arg
      const node = this.create(
        'token',
        'mo',
        { texClass: TEXCLASS.NONE },
        entities.ApplyFunction
      );
      return [[top, node, item], true];
    }
    // @test Mathop Super, Mathop Sub
    return super.checkItem(item);
  }
}

/**
 * Item indicating a \\not has been encountered and needs to be applied to the
 * next operator.
 */
export class NotItem extends BaseItem {
  private remap = MapHandler.getMap('not_remap') as CharacterMap;

  /**
   * @override
   */
  public get kind() {
    return 'not';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    let mml: TextNode | MmlNode;
    let c: string;
    let textNode: TextNode;
    if (item.isKind('open') || item.isKind('left')) {
      // @test Negation Left Paren
      return BaseItem.success;
    }
    if (
      item.isKind('mml') &&
      (NodeUtil.isType(item.First, 'mo') ||
        NodeUtil.isType(item.First, 'mi') ||
        NodeUtil.isType(item.First, 'mtext'))
    ) {
      mml = item.First;
      c = NodeUtil.getText(mml as TextNode);
      if (
        c.length === 1 &&
        !NodeUtil.getProperty(mml, 'movesupsub') &&
        NodeUtil.getChildren(mml).length === 1
      ) {
        if (this.remap.contains(c)) {
          // @test Negation Simple, Negation Complex
          textNode = this.create('text', this.remap.lookup(c).char) as TextNode;
          NodeUtil.setChild(mml, 0, textNode);
        } else {
          // @test Negation Explicit
          textNode = this.create('text', '\u0338') as TextNode;
          NodeUtil.appendChildren(mml, [textNode]);
        }
        return [[item], true];
      }
    }
    // @test Negation Large
    textNode = this.create('text', '\u29F8') as TextNode;
    const mtextNode = this.create('node', 'mtext', [], {}, textNode);
    const paddedNode = this.create('node', 'mpadded', [mtextNode], {
      width: 0,
    });
    mml = this.create('node', 'TeXAtom', [paddedNode], {
      texClass: TEXCLASS.REL,
    });
    return [[mml, item], true];
  }
}

/**
 * A StackItem that removes an mspace that follows it (for \nonscript).
 */
export class NonscriptItem extends BaseItem {
  /**
   * @override
   */
  public get kind() {
    return 'nonscript';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    //
    //  Check if the next item is an mspace (or an mspace in an mstyle) and remove it.
    //
    if (item.isKind('mml') && item.Size() === 1) {
      let mml = item.First;
      //
      //  Space macros like \, are wrapped with an mstyle to set scriptlevel="0"
      //    (so size is independent of level), we look at the contents of the mstyle for the mspace.
      //
      if (mml.isKind('mstyle') && mml.notParent) {
        mml = NodeUtil.getChildren(NodeUtil.getChildren(mml)[0])[0];
      }
      if (mml.isKind('mspace')) {
        //
        //  If the space is in an mstyle, wrap it in an mrow so we can test its scriptlevel
        //    in the post-filter (the mrow will be removed in the filter).  We can't test
        //    the mstyle's scriptlevel, since it is ecxplicitly setting it to 0.
        //
        if (mml !== item.First) {
          const mrow = this.create('node', 'mrow', [item.Pop()]);
          item.Push(mrow);
        }
        //
        //  Save the mspace for later post-processing.
        //
        this.factory.configuration.addNode('nonscript', item.First);
      }
    }
    return [[item], true];
  }
}

/**
 * Item indicating a dots command has been encountered.
 */
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
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('open') || item.isKind('left')) {
      return BaseItem.success;
    }
    let dots = this.getProperty('ldots') as MmlNode;
    const top = item.First;
    // @test Operator Dots
    if (item.isKind('mml') && NodeUtil.isEmbellished(top)) {
      const tclass = NodeUtil.getTexClass(NodeUtil.getCoreMO(top));
      if (tclass === TEXCLASS.BIN || tclass === TEXCLASS.REL) {
        dots = this.getProperty('cdots') as MmlNode;
      }
    }
    return [[dots, item], true];
  }
}

/**
 * Item indicating an array is assembled. It collates cells, rows and
 * information about column/row separator and framing lines.
 */
export class ArrayItem extends BaseItem {
  /**
   * The table as a list of rows.
   *
   * @type {MmlNode[]}
   */
  public table: MmlNode[] = [];

  /**
   * The current row as a list of cells.
   *
   * @type {MmlNode[]}
   */
  public row: MmlNode[] = [];

  /**
   * Frame specification as a list of pairs of strings [side, style].
   *
   * @type {[string, string][]}
   */
  public frame: [string, string][] = [];

  /**
   * Hfill value.
   *
   * @type {number[]}
   */
  public hfill: number[] = [];

  /**
   * Properties for special array definitions.
   *
   * @type {{[key: string]: string|number|boolean}}
   */
  public arraydef: { [key: string]: string | number | boolean } = {};

  /**
   * Insertions that go at the beginning of table entries (from >{...})
   */
  public cstart: string[] = [];

  /**
   * Insertions that go at the end of table entries (from <{...})
   */
  public cend: string[] = [];

  /**
   * True for columns from @{...} and !{...}
   */
  public cextra: boolean[] = [];

  /**
   * True if adding extra columns at the end of a row
   */
  public atEnd: boolean = false;

  /**
   * Row alignments to specify on particular columns
   */
  public ralign: [string, string, string][] = [];

  /**
   * Data for setting cell/row/table alignment for when there are line breaks
   */
  public breakAlign = {
    cell: '',
    row: '',
    table: '',
  };

  /**
   * Substitution count for template substitutions (to avoid infinite loops)
   */
  public templateSubs: number = 0;

  /**
   * The TeX parser that created this item
   */
  public parser: TexParser;

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
  get copyEnv() {
    return false;
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    // @test Array Single
    if (item.isClose && !item.isKind('over')) {
      // @test Array Single
      if (item.getProperty('isEntry')) {
        // @test Array dashed column, Array solid column
        this.EndEntry();
        this.clearEnv();
        this.StartEntry();
        return BaseItem.fail;
      }
      if (item.getProperty('isCR')) {
        // @test Enclosed bottom
        this.EndEntry();
        this.EndRow();
        this.clearEnv();
        this.StartEntry();
        return BaseItem.fail;
      }
      this.EndTable();
      this.clearEnv();
      const newItem = this.factory.create('mml', this.createMml());
      if (this.getProperty('requireClose')) {
        // @test: Label
        if (item.isKind('close')) {
          // @test: Label
          return [[newItem], true];
        }
        // @test MissingCloseBrace2
        throw new TexError('MissingCloseBrace', 'Missing close brace');
      }
      return [[newItem, item], true];
    }
    return super.checkItem(item);
  }

  /**
   * Create the MathML representation of the table.
   *
   * @returns {MmlNode} The new node.
   */
  public createMml(): MmlNode {
    const scriptlevel = this.arraydef['scriptlevel'];
    delete this.arraydef['scriptlevel'];
    let mml = this.create('node', 'mtable', this.table, this.arraydef);
    if (scriptlevel) {
      mml.setProperty('smallmatrix', true);
    }
    if (this.breakAlign.table) {
      NodeUtil.setAttribute(mml, 'data-break-align', this.breakAlign.table);
    }
    if (this.getProperty('arrayPadding')) {
      NodeUtil.setAttribute(mml, 'data-frame-styles', ''); // empty frame-styles forces framespacing to be used
      NodeUtil.setAttribute(
        mml,
        'framespacing',
        this.getProperty('arrayPadding') as string
      );
    }
    mml = this.handleFrame(mml);
    if (scriptlevel !== undefined) {
      mml = this.create('node', 'mstyle', [mml], { scriptlevel });
    }
    if (this.getProperty('open') || this.getProperty('close')) {
      // @test Cross Product Formula
      mml = ParseUtil.fenced(
        this.factory.configuration,
        this.getProperty('open') as string,
        mml,
        this.getProperty('close') as string
      );
    }
    return mml;
  }

  /**
   * @param {MmlNode} mml  The mtable to frame
   * @returns {MmlNode} The new node.
   */
  protected handleFrame(mml: MmlNode): MmlNode {
    if (!this.frame.length) return mml;
    //
    // Map sides to their styles
    //
    const sides = new Map(this.frame);
    //
    // If all style are the same,
    //   If all four sides are present, use a frame of the correct type
    //   Otherwise, if the given sides are solid, use menclosed (with no padding)
    //
    const fstyle = this.frame.reduce(
      (fstyle, [, style]) => (style === fstyle ? style : ''),
      this.frame[0][1]
    );
    if (fstyle) {
      if (this.frame.length === 4) {
        NodeUtil.setAttribute(mml, 'frame', fstyle);
        NodeUtil.removeAttribute(mml, 'data-frame-styles');
        return mml;
      }
      if (fstyle === 'solid') {
        NodeUtil.setAttribute(mml, 'data-frame-styles', '');
        mml = this.create('node', 'menclose', [mml], {
          notation: Array.from(sides.keys()).join(' '),
          'data-padding': 0,
        });
        return mml;
      }
    }
    //
    //  Otherwise (some sides are dashed), use styles, which is implemented in
    //    the common output jax so that we get the proper line width (it may be
    //    customizable via output options in the future).
    //
    const styles = TRBL.map((side) => sides.get(side) || 'none').join(' ');
    NodeUtil.setAttribute(mml, 'data-frame-styles', styles);
    return mml;
  }

  /**
   * Check to see if there are column declarations that need
   * extra content around the cell contents.
   */
  public StartEntry() {
    const n = this.row.length;
    let start = this.cstart[n];
    let end = this.cend[n];
    const ralign = this.ralign[n];
    const cextra = this.cextra;
    if (!start && !end && !ralign && !cextra[n] && !cextra[n + 1]) return;
    let [prefix, entry, term, found] = this.getEntry();
    //
    // Add & to an extra column if it is not at the end of the line
    //
    if (cextra[n] && (!this.atEnd || cextra[n + 1])) {
      start += '&';
    }
    //
    // Check if there are extra entries at the end of a row to be added
    //
    if (term !== '&') {
      found =
        !!entry.trim() || !!(n || (term && term.substring(0, 4) !== '\\end'));
      if (cextra[n + 1] && !cextra[n]) {
        end = (end || '') + '&'; // extra entries follow this one
        this.atEnd = true;
      }
    }
    if (!found && !prefix) return;
    const parser = this.parser;
    if (found) {
      //
      //  Add the start, entry, and end values together
      //
      if (start) {
        entry = ParseUtil.addArgs(parser, start, entry);
      }
      if (end) {
        entry = ParseUtil.addArgs(parser, entry, end);
      }
      //
      //  If row aligning, use text mode
      //
      if (ralign) {
        entry = '\\text{' + entry.trim() + '}';
      }
      if (start || end || ralign) {
        if (
          ++this.templateSubs >
          parser.configuration.options.maxTemplateSubtitutions
        ) {
          throw new TexError(
            'MaxTemplateSubs',
            'Maximum template substitutions exceeded; ' +
              'is there an invalid use of \\\\ in the template?'
          );
        }
      }
    }
    //
    //  Add any \hline or \hfill macros
    //
    if (prefix) {
      entry = ParseUtil.addArgs(parser, prefix, entry);
    }
    //
    //  Insert the entry into the parser string
    //
    parser.string = ParseUtil.addArgs(parser, entry, parser.string);
    parser.i = 0;
  }

  /**
   * Get the TeX string for the contents of the coming cell (if any)
   *
   * @returns {[string, string, string, boolean]} List of values for prefix,
   *     entry, term, found.
   */
  protected getEntry(): [string, string, string, boolean] {
    const parser = this.parser;
    const pattern = /^([^]*?)([&{}]|\\\\|\\(?:begin|end)\s*\{array\}|\\cr|\\)/;
    let braces = 0;
    let envs = 0;
    let i = parser.i;
    let match;
    const fail: [string, string, string, boolean] = ['', '', '', false];
    while ((match = parser.string.slice(i).match(pattern)) !== null) {
      i += match[0].length;
      switch (match[2]) {
        case '\\':
          i++;
          break;
        case '{':
          braces++;
          break;
        case '}':
          if (!braces) return fail;
          braces--;
          break;
        case '\\begin{array}':
          if (!braces) {
            envs++;
          }
          break;
        case '\\end{array}':
          if (!braces && envs) {
            envs--;
            break;
          }
        // fall through if not closing a nested array environment
        default: {
          if (braces || envs) continue;
          i -= match[2].length;
          let entry = parser.string.slice(parser.i, i).trim();
          const prefix = entry.match(
            /^(?:\s*\\(?:h(?:dash)?line|hfil{1,3}|rowcolor\s*\{.*?\}))+/
          );
          if (prefix) {
            entry = entry.slice(prefix[0].length);
          }
          parser.string = parser.string.slice(i);
          parser.i = 0;
          return [prefix?.[0] || '', entry, match[2], true];
        }
      }
    }
    return fail;
  }

  /**
   * Finishes a single cell of the array.
   */
  public EndEntry() {
    // @test Array1, Array2
    const mtd = this.create('node', 'mtd', this.nodes);
    //
    // Handle \hfil by setting column alignment
    //
    if (this.hfill.length) {
      if (this.hfill[0] === 0) {
        NodeUtil.setAttribute(mtd, 'columnalign', 'right');
      }
      if (this.hfill[this.hfill.length - 1] === this.Size()) {
        NodeUtil.setAttribute(
          mtd,
          'columnalign',
          NodeUtil.getAttribute(mtd, 'columnalign') ? 'center' : 'left'
        );
      }
    }
    //
    // Check for row alignment specification, and use
    //   an mpadded element to produce the aligned content.
    //
    const ralign = this.ralign[this.row.length];
    if (ralign) {
      const [valign, cwidth, calign] = ralign;
      const box = this.create('node', 'mpadded', mtd.childNodes[0].childNodes, {
        width: cwidth,
        'data-overflow': 'auto',
        'data-align': calign,
        'data-vertical-align': valign,
      });
      box.setProperty('vbox', valign);
      mtd.childNodes[0].childNodes = [];
      mtd.appendChild(box);
    } else if (this.breakAlign.cell) {
      NodeUtil.setAttribute(mtd, 'data-vertical-align', this.breakAlign.cell);
    }
    this.breakAlign.cell = '';
    //
    this.row.push(mtd);
    this.Clear();
    this.hfill = [];
  }

  /**
   * Finishes a single row of the array.
   */
  public EndRow() {
    // @test Array1, Array2
    let type = 'mtr';
    if (this.getProperty('isNumbered') && this.row.length === 3) {
      // @test Label, Matrix Numbered
      this.row.unshift(this.row.pop()); // move equation number to first
      // position
      type = 'mlabeledtr';
    } else if (this.getProperty('isLabeled')) {
      type = 'mlabeledtr';
      this.setProperty('isLabeled', false);
    }
    const node = this.create('node', type, this.row);
    if (this.breakAlign.row) {
      NodeUtil.setAttribute(node, 'data-break-align', this.breakAlign.row);
      this.breakAlign.row = '';
    }
    addLatexItem(node, this);
    this.table.push(node);
    this.row = [];
    this.atEnd = false;
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
    if (this.arraydef.rowlines) {
      const lines = (this.arraydef.rowlines as string).split(/ /);
      if (lines.length === this.table.length) {
        this.frame.push(['bottom', lines.pop()]);
        if (lines.length) {
          this.arraydef.rowlines = lines.join(' ');
        } else {
          delete this.arraydef.rowlines;
        }
      } else if (lines.length < this.table.length - 1) {
        this.arraydef.rowlines += ' none';
      }
    }
    if (this.getProperty('rowspacing')) {
      const rows = (this.arraydef.rowspacing as string).split(/ /);
      while (rows.length < this.table.length) {
        rows.push(this.getProperty('rowspacing') + 'em');
      }
      this.arraydef.rowspacing = rows.join(' ');
    }
  }

  /**
   * Adds a row-spacing to the current row (padding out the rowspacing if needed to get there).
   *
   * @param {string} spacing   The rowspacing to use for the current row.
   */
  public addRowSpacing(spacing: string) {
    if (this.arraydef['rowspacing']) {
      const rows = (this.arraydef['rowspacing'] as string).split(/ /);
      if (!this.getProperty('rowspacing')) {
        // @test Array Custom Linebreak
        const dimem = UnitUtil.dimen2em(rows[0]);
        this.setProperty('rowspacing', dimem);
      }
      const rowspacing = this.getProperty('rowspacing') as number;
      while (rows.length < this.table.length) {
        rows.push(UnitUtil.em(rowspacing));
      }
      rows[this.table.length - 1] = UnitUtil.em(
        Math.max(0, rowspacing + UnitUtil.dimen2em(spacing))
      );
      this.arraydef['rowspacing'] = rows.join(' ');
    }
  }
}

/**
 * Item dealing with equation arrays as a special case of arrays. Handles
 * tagging information according to the given tagging style.
 */
export class EqnArrayItem extends ArrayItem {
  /**
   * The length of the longest row.
   */
  public maxrow: number = 0;

  /**
   * @override
   */
  constructor(factory: StackItemFactory, ...args: any[]) {
    super(factory);
    this.factory.configuration.tags.start(args[0], args[2], args[1]);
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
    // @test Cubic Binomial
    const calign = (this.arraydef.columnalign as string).split(/ /);
    const align =
      this.row.length && calign.length
        ? calign[this.row.length % calign.length]
        : 'right';
    if (align !== 'right') {
      ParseUtil.fixInitialMO(this.factory.configuration, this.nodes);
    }
    super.EndEntry();
  }

  /**
   * @override
   */
  public EndRow() {
    if (this.row.length > this.maxrow) {
      this.maxrow = this.row.length;
    }
    // @test Cubic Binomial
    const tag = this.factory.configuration.tags.getTag();
    if (tag) {
      this.row = [tag].concat(this.row);
      this.setProperty('isLabeled', true);
    }
    this.factory.configuration.tags.clearTag();
    super.EndRow();
  }

  /**
   * @override
   */
  public EndTable() {
    // @test Cubic Binomial
    super.EndTable();
    this.factory.configuration.tags.end();
    //
    // Repeat the column align and width specifications
    //   to match the number of columns
    //
    this.extendArray('columnalign', this.maxrow);
    this.extendArray('columnwidth', this.maxrow);
    this.extendArray('columnspacing', this.maxrow - 1);
    this.extendArray('data-break-align', this.maxrow);
    //
    // Add indentshift for left-aligned columns
    //
    this.addIndentshift();
  }

  /**
   * Extend a column specification to include a repeating set of values
   * so that it has enough to match the maximum row length.
   *
   * @param {string} name The name of the calling command.
   * @param {number} max The maximum row length.
   */
  protected extendArray(name: string, max: number) {
    if (!this.arraydef[name]) return;
    const repeat = (this.arraydef[name] as string).split(/ /);
    const columns = [...repeat];
    if (columns.length > 1) {
      while (columns.length < max) {
        columns.push(...repeat);
      }
      this.arraydef[name] = columns.slice(0, max).join(' ');
    }
  }

  /**
   * Add indentshift to left-aligned columns so that linebreaking will work
   *   better in alignments.
   */
  protected addIndentshift() {
    const align = (this.arraydef.columnalign as string).split(/ /);
    let prev = '';
    for (const i of align.keys()) {
      if (align[i] === 'left' && i > 0) {
        const indentshift = prev === 'center' ? '.7em' : '2em';
        for (const row of this.table) {
          const cell = row.childNodes[row.isKind('mlabeledtr') ? i + 1 : i];
          if (cell) {
            const mstyle = this.create(
              'node',
              'mstyle',
              cell.childNodes[0].childNodes,
              { indentshift }
            );
            cell.childNodes[0].childNodes = [];
            cell.appendChild(mstyle);
          }
        }
      }
      prev = align[i];
    }
  }
}

/**
 * Item that places an mstyle having given attributes around its contents
 */
export class MstyleItem extends BeginItem {
  /**
   * @override
   */
  get kind() {
    return 'mstyle';
  }

  /**
   * The properties to set for the mstyle element
   */
  public attrList: PropertyList;

  /**
   * @param {StackItemFactory} factory The current stack item factory
   * @param {PropertyList} attr  The properties to set on the mstyle
   * @param {string} name        The name of the environment being processed
   * @override
   * @class
   */
  constructor(factory: StackItemFactory, attr: PropertyList, name: string) {
    super(factory);
    this.attrList = attr;
    this.setProperty('name', name);
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('end') && item.getName() === this.getName()) {
      const mml = this.create('node', 'mstyle', [this.toMml()], this.attrList);
      return [[mml], true];
    }
    return super.checkItem(item);
  }
}

/**
 * Item dealing with simple equation environments.  Handles tagging information
 * according to the given tagging style.
 */
export class EquationItem extends BaseItem {
  /**
   * @override
   */
  constructor(factory: StackItemFactory, ...args: any[]) {
    super(factory);
    this.factory.configuration.tags.start('equation', true, args[0]);
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
  get isOpen() {
    return true;
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('end')) {
      const mml = this.toMml();
      const tag = this.factory.configuration.tags.getTag();
      this.factory.configuration.tags.end();
      return [
        [tag ? this.factory.configuration.tags.enTag(mml, tag) : mml, item],
        true,
      ];
    }
    if (item.isKind('stop')) {
      // @test EnvMissingEnd Equation
      throw new TexError('EnvMissingEnd', 'Missing \\end{%1}', this.getName());
    }
    return super.checkItem(item);
  }
}

/**
 * Adds auxiliary attributes for LaTeX output to node.
 *
 * @param {MmlNode} node The current node.
 * @param {StackItem} item The stack item.
 * @param {string=} prefix A prefix for the LaTeX command.
 */
function addLatexItem(node: MmlNode, item: StackItem, prefix: string = '') {
  const str = item.startStr.slice(item.startI, item.stopI);
  if (str) {
    node.attributes.set(
      TexConstant.Attr.LATEXITEM,
      prefix ? prefix + str : str
    );
    node.attributes.set(TexConstant.Attr.LATEX, prefix ? prefix + str : str);
  }
}
