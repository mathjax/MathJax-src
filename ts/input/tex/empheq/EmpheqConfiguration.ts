import {Configuration} from '../Configuration.js';
import {CommandMap, EnvironmentMap} from '../SymbolMap.js';
import ParseUtil from '../ParseUtil.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import {AbstractTags} from '../Tags.js';
import {BeginItem} from '../base/BaseItems.js';
import {StackItem} from '../StackItem.js';
import {AbstractMmlNode, MmlNode, TextNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMtable} from '../../../core/MmlTree/MmlNodes/mtable.js';
import {MmlMtd} from '../../../core/MmlTree/MmlNodes/mtd.js';

export class EmpheqBeginItem extends BeginItem {
  public options = {};

  public get kind() {
    return 'empheq-begin';
  }

  public checkItem(item: StackItem) {
    if (item.isKind('end') && item.getName() === this.getName()) {
      this.setProperty('end', false);
    }
    return super.checkItem(item);
  }
}

export const EmpheqUtil = {

  environment(parser: TexParser, env: string, func: Function, args: any[]) {
    const name = args[0];
    const item = parser.itemFactory.create(name + '-begin').setProperties({name: env, end: name});
    parser.Push(func(parser, item, ...args.slice(1)));
  },

  copyMml(node: MmlNode) {
    if (!node) return null;
    const mml = (node as AbstractMmlNode).factory.create(node.kind);
    if (node.isKind('text')) {
      (mml as TextNode).setText((node as TextNode).getText());
      return mml;
    }
    if (node.attributes) {
      const attributes = node.attributes.getAllAttributes();
      for (const name of Object.keys(attributes)) {
        if (name !== 'id') {
          mml.attributes.set(name, attributes[name]);
        }
      }
    }
    if (node.childNodes && node.childNodes.length) {
      let children = node.childNodes;
      if (children.length === 1 && children[0].isKind('inferredMrow')) {
        children = children[0].childNodes;
      }
      for (const child of children) {
        if (child) mml.appendChild(this.copyMml(child));
      }
    }
    return mml;
  },

  splitOptions(text: string, allowed: {[key: string]: number} = null) {
    return ParseUtil.keyvalOptions(text, allowed, true);
  },

  columnCount(table: MmlMtable) {
    let m = 0;
    for (const row of table.childNodes) {
      const n = row.childNodes.length - (row.isKind('mlabeledtr') ? 1 : 0);
      if (n > m) m = n;
    }
    return m;
  },

  cellBlock(tex: string, table: MmlMtable, parser: TexParser, env: string) {
    const mpadded = parser.create('node', 'mpadded', [], {height: 0, depth: 0, voffset: '-1height'});
    const result = new TexParser(tex, parser.stack.env, parser.configuration);
    const mml = result.mml();
    if (env && result.configuration.tags.label) {
      (result.configuration.tags.currentTag as any).env = env;
      (result.configuration.tags as AbstractTags).getTag(true);
    }
    for (const child of (mml.isInferred ? mml.childNodes : [mml])) {
      mpadded.appendChild(child);
    }
    mpadded.appendChild(parser.create('node', 'mphantom', [
      parser.create('node', 'mpadded', [table], {width: 0})
    ]));
    return mpadded;
  },

  topRowTable(original: MmlMtable, parser: TexParser) {
    const table = this.copyMml(original);
    table.setChildren(table.childNodes.slice(0, 1));
    table.attributes.set('align', 'baseline 1');
    return original.factory.create('mphantom', {}, [parser.create('node', 'mpadded', [table],  {width: 0})]);
  },

  rowspanCell(mtd: MmlMtd, tex: string, table: MmlMtable, parser: TexParser, env: string) {
    mtd.appendChild(
      parser.create('node', 'mpadded', [
        this.cellBlock(tex, this.copyMml(table), parser, env),
        this.topRowTable(table, parser)
      ], {height: 0, depth: 0, voffset: 'height'})
    );
  },

  left(table: MmlMtable, original: MmlMtable, left: string, parser: TexParser, env: string = '') {
    table.attributes.set('columnalign', 'right ' + (table.attributes.get('columnalign') || ''));
    table.attributes.set('columnspacing', '0em ' + (table.attributes.get('columnspacing') || ''));
    let mtd;
    for (const row of table.childNodes.slice(0).reverse()) {
      mtd = parser.create('node', 'mtd');
      row.childNodes.unshift(mtd);
      row.replaceChild(mtd, mtd);   // make sure parent is set
      if (row.isKind('mlabeledtr')) {
        row.childNodes[0] = row.childNodes[1];
        row.childNodes[1] = mtd;
      }
    }
    this.rowspanCell(mtd, left, original, parser, env);
  },

  right(table: MmlMtable, original: MmlMtable, right: string, parser: TexParser, env: string = '') {
    if (table.childNodes.length === 0) {
      table.appendChild(parser.create('node', 'mtr'));
    }
    const m = EmpheqUtil.columnCount(table);
    const row = table.childNodes[0];
    while (row.childNodes.length < m) row.appendChild(parser.create('node', 'mtd'));
    const mtd = row.appendChild(parser.create('node', 'mtd')) as MmlMtd;
    EmpheqUtil.rowspanCell(mtd, right, original, parser, env);
    table.attributes.set(
      'columnalign',
      (table.attributes.get('columnalign') as string || '').split(/ /).slice(0, m).join(' ') + ' left'
    );
    table.attributes.set(
      'columnspacing',
      (table.attributes.get('columnspacing') as string || '').split(/ /).slice(0, m - 1).join(' ') + ' 0em'
    );
  },

  adjustTable(empheq: EmpheqBeginItem, parser: TexParser) {
    const options = empheq.options as {left: string, right: string};
    if (options.left || options.right) {
      const table = empheq.Last;
      const original = this.copyMml(table);
      if (options.left) this.left(table, original, options.left, parser);
      if (options.right) this.right(table, original, options.right, parser);
    }
  },

  allowEnv: {
    equation: true,
    align: true,
    gather: true,
    flalign: true,
    alignat: true,
    multline: true
  },

  checkEnv(env: string) {
    return this.allowEnv[env.replace(/\*$/, '')] || false;
  }

};

export const EmpheqMethods = {
  Empheq(parser: TexParser, begin: EmpheqBeginItem) {
    if (parser.stack.env.closing === begin.getName()) {
      delete parser.stack.env.closing;
      parser.Push(parser.itemFactory.create('end').setProperty('name', parser.stack.global.empheq));
      parser.stack.global.empheq = '';
      const empheq = parser.stack.Top() as EmpheqBeginItem;
      EmpheqUtil.adjustTable(empheq, parser);
      parser.Push(parser.itemFactory.create('end').setProperty('name', 'empheq'));
    } else {
      ParseUtil.checkEqnEnv(parser);
      delete parser.stack.global.eqnenv;
      const opts = parser.GetBrackets('\\begin{' + begin.getName() + '}') || '';
      const [env, n] = (parser.GetArgument('\\begin{' + begin.getName() + '}') || '').split(/=/);
      if (!EmpheqUtil.checkEnv(env)) {
        throw new TexError('UnknownEnv', 'Unknown environment "%1"', env);
      }
      begin.options = (opts ? EmpheqUtil.splitOptions(opts, {left: 1, right: 1}) : {});
      parser.stack.global.empheq = env;
      parser.string = '\\begin{' + env + '}' + (n ? '{' + n + '}' : '') + parser.string.slice(parser.i);
      parser.i = 0;
      parser.Push(begin);
    }
  },

  EmpheqMO(parser: TexParser, _name: string, c: string) {
    parser.Push(parser.create('token', 'mo', {}, c));
  },

  EmpheqDelim(parser: TexParser, name: string) {
    const c = parser.GetDelimiter(name);
    parser.Push(parser.create('token', 'mo', {stretchy: true, symmetric: true}, c));
  }

};

//
//  Define an environment map to add the new empheq environment
//
new EnvironmentMap('empheq-env', EmpheqUtil.environment, {
  empheq: ['Empheq', 'empheq'],
}, EmpheqMethods);

new CommandMap('empheq-macros', {
  empheqlbrace:    ['EmpheqMO', '{'],
  empheqrbrace:    ['EmpheqMO', '}'],
  empheqlbrack:    ['EmpheqMO', '['],
  empheqrbrack:    ['EmpheqMO', ']'],
  empheqlangle:    ['EmpheqMO', '\u27E8'],
  empheqrangle:    ['EmpheqMO', '\u27E9'],
  empheqlparen:    ['EmpheqMO', '('],
  empheqrparen:    ['EmpheqMO', ')'],
  empheqlvert:     ['EmpheqMO', '|'],
  empheqrvert:     ['EmpheqMO', '|'],
  empheqlVert:     ['EmpheqMO', '\u2016'],
  empheqrVert:     ['EmpheqMO', '\u2016'],
  empheqlfloor:    ['EmpheqMO', '\u230A'],
  empheqrfloor:    ['EmpheqMO', '\u230B'],
  empheqlceil:     ['EmpheqMO', '\u2308'],
  empheqrceil:     ['EmpheqMO', '\u2309'],
  empheqbiglbrace: ['EmpheqMO', '{'],
  empheqbigrbrace: ['EmpheqMO', '}'],
  empheqbiglbrack: ['EmpheqMO', '['],
  empheqbigrbrack: ['EmpheqMO', ']'],
  empheqbiglangle: ['EmpheqMO', '\u27E8'],
  empheqbigrangle: ['EmpheqMO', '\u27E9'],
  empheqbiglparen: ['EmpheqMO', '('],
  empheqbigrparen: ['EmpheqMO', ')'],
  empheqbiglvert:  ['EmpheqMO', '|'],
  empheqbigrvert:  ['EmpheqMO', '|'],
  empheqbiglVert:  ['EmpheqMO', '\u2016'],
  empheqbigrVert:  ['EmpheqMO', '\u2016'],
  empheqbiglfloor: ['EmpheqMO', '\u230A'],
  empheqbigrfloor: ['EmpheqMO', '\u230B'],
  empheqbiglceil:  ['EmpheqMO', '\u2308'],
  empheqbigrceil:  ['EmpheqMO', '\u2309'],
  empheql:          'EmpheqDelim',
  empheqr:          'EmpheqDelim',
  empheqbigl:       'EmpheqDelim',
  empheqbigr:       'EmpheqDelim'
}, EmpheqMethods);

//
//  Define the package for our new environment
//
export const EmpheqConfiguration = Configuration.create('empheq', {
  handler: {
    macro: ['empheq-macros'],
    environment: ['empheq-env'],
  },
  items: {
    [EmpheqBeginItem.prototype.kind]: EmpheqBeginItem
  }
});
