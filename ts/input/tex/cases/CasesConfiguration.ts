import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import { EnvironmentMap, MacroMap } from '../TokenMap.js';
import { ParseResult, ParseMethod } from '../Types.js';
import { ParseUtil } from '../ParseUtil.js';
import BaseMethods from '../base/BaseMethods.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import { BeginItem, EqnArrayItem } from '../base/BaseItems.js';
import { AmsTags } from '../ams/AmsConfiguration.js';
import { StackItem, CheckType } from '../StackItem.js';
import { MmlMtable } from '../../../core/MmlTree/MmlNodes/mtable.js';
import { EmpheqUtil } from '../empheq/EmpheqUtil.js';

/**
 * The StackItem for the numcases environment.
 */
export class CasesBeginItem extends BeginItem {
  /**
   * @override
   */
  get kind() {
    return 'cases-begin';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem) {
    if (item.isKind('end') && item.getName() === this.getName()) {
      if (this.getProperty('end')) {
        this.setProperty('end', false);
        return [[], true] as CheckType;
      }
    }
    return super.checkItem(item);
  }
}

/**
 * A tagging class for the subnumcases environment.
 */
export class CasesTags extends AmsTags {
  /**
   * The counter for the subnumber.
   */
  protected subcounter = 0;

  /**
   * @override
   */
  public start(env: string, taggable: boolean, defaultTags: boolean) {
    this.subcounter = 0;
    super.start(env, taggable, defaultTags);
  }

  /**
   * @override
   */
  public autoTag() {
    if (this.currentTag.tag != null) return;
    if (this.currentTag.env === 'subnumcases') {
      if (this.subcounter === 0) {
        this.counter++;
      }
      this.subcounter++;
      this.tag(this.formatNumber(this.counter, this.subcounter), false);
    } else {
      if (this.currentTag.env !== 'numcases-left') {
        this.counter++;
      }
      this.tag(this.formatNumber(this.counter), false);
    }
  }

  /**
   * @override
   */
  public formatNumber(n: number, m: number = null) {
    return n.toString() + (m === null ? '' : String.fromCharCode(0x60 + m));
  }
}

export const CasesMethods = {
  /**
   * Implements the numcases environment.
   *
   * @param {TexParser} parser      The active tex parser.
   * @param {CasesBeginItem} begin  The environment begin item.
   * @returns {ParseResult}         The array stack item.
   */
  NumCases(parser: TexParser, begin: CasesBeginItem): ParseResult {
    if (parser.stack.env.closing === begin.getName()) {
      delete parser.stack.env.closing;
      parser.Push(
        parser.itemFactory.create('end').setProperty('name', begin.getName())
      ); // finish eqnarray
      const cases = parser.stack.Top();
      const table = cases.Last as MmlMtable;
      const original = ParseUtil.copyNode(table, parser) as MmlMtable;
      const left = cases.getProperty('left');
      EmpheqUtil.left(
        table,
        original,
        left + '\\mmlToken{mo}{\\U{7B}}\\,',
        parser,
        'numcases-left'
      );
      parser.Push(
        parser.itemFactory.create('end').setProperty('name', begin.getName())
      );
      return null;
    } else {
      const left = parser.GetArgument('\\begin{' + begin.getName() + '}');
      begin.setProperty('left', left);
      const array = BaseMethods.EqnArray(
        parser,
        begin,
        true,
        true,
        'll',
        'tt'
      ) as EqnArrayItem;
      array.arraydef.displaystyle = false;
      array.arraydef.rowspacing = '.2em';
      array.setProperty('numCases', true);
      parser.Push(begin);
      return array;
    }
  },

  /**
   * Replacement for & in cases environment.
   *
   * @param {TexParser} parser      The active tex parser.
   * @param {string} name           The environment name.
   * @returns {ParseResult}         The parser result code.
   */
  Entry(parser: TexParser, name: string): ParseResult {
    if (!parser.stack.Top().getProperty('numCases')) {
      return BaseMethods.Entry(parser, name);
    }
    parser.Push(
      parser.itemFactory
        .create('cell')
        .setProperties({ isEntry: true, name: name })
    );
    //
    //  Make second column be in \text{...}
    //
    const tex = parser.string;
    let braces = 0;
    let i = parser.i;
    const m = tex.length;
    //
    //  Look through the string character by character...
    //
    while (i < m) {
      const c = tex.charAt(i);
      if (c === '{') {
        //
        //  Increase the nested brace count and go on
        //
        braces++;
        i++;
      } else if (c === '}') {
        //
        //  If there are too many close braces, just end (we will get an
        //    error message later when the rest of the string is parsed)
        //  Otherwise
        //    decrease the nested brace count,
        //    go on to the next character.
        //
        if (braces === 0) {
          break;
        } else {
          braces--;
          i++;
        }
      } else if (c === '&' && braces === 0) {
        //
        //  Extra alignment tabs are not allowed in cases
        //
        throw new TexError(
          'ExtraCasesAlignTab',
          'Extra alignment tab in text for numcase environment'
        );
      } else if (c === '\\' && braces === 0) {
        //
        //  If the macro is \cr or \\, end the search, otherwise skip the macro
        //  (multi-letter names don't matter, as we will skip the rest of the
        //   characters in the main loop)
        //
        const cs = (tex.slice(i + 1).match(/^[a-z]+|./i) || [])[0];
        if (
          cs === '\\' ||
          cs === 'cr' ||
          cs === 'end' ||
          cs === 'label' ||
          cs === undefined
        ) {
          break;
        } else {
          i += cs.length;
        }
      } else {
        //
        //  Go on to the next character
        //
        i++;
      }
    }
    //
    //  Process the second column as text and continue parsing from there,
    //
    // i >= parser.i
    const text = tex.substring(parser.i, i).replace(/^\s*/, '');
    parser.PushAll(ParseUtil.internalMath(parser, text, 0));
    parser.i = i;
    return null;
  },

  /**
   * Create the needed envinronment and process it by the give function.
   *
   * @param {TexParser} parser   The active tex parser.
   * @param {string} env         The environment to create.
   * @param {ParseMethod} func      A function to process the environment.
   * @param {any[]} args         The arguments for func.
   */
  environment(parser: TexParser, env: string, func: ParseMethod, args: any[]) {
    const item = parser.itemFactory
      .create('cases-begin')
      .setProperties({ name: env, end: true });
    parser.Push(func(parser, item, ...args) as StackItem);
  },
};

/**
 * The environments for this package
 */
new EnvironmentMap('cases-env', CasesMethods.environment, {
  numcases: [CasesMethods.NumCases, 'cases'],
  subnumcases: [CasesMethods.NumCases, 'cases'],
});

/**
 * The macros for this package
 */
new MacroMap('cases-macros', {
  '&': CasesMethods.Entry,
});

//
//  Define the package for our new environment
//
export const CasesConfiguration = Configuration.create('cases', {
  [ConfigurationType.HANDLER]: {
    [HandlerType.ENVIRONMENT]: ['cases-env'],
    [HandlerType.CHARACTER]: ['cases-macros'],
  },
  [ConfigurationType.ITEMS]: {
    [CasesBeginItem.prototype.kind]: CasesBeginItem,
  },
  [ConfigurationType.TAGS]: { cases: CasesTags },
});
