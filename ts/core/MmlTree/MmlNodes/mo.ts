/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file  Implements the MmlMo node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { PropertyList } from '../../Tree/Node.js';
import {
  AbstractMmlTokenNode,
  MmlNode,
  AttributeList,
  TEXCLASS,
} from '../MmlNode.js';
import { MmlMrow } from './mrow.js';
import { MmlMover, MmlMunder, MmlMunderover } from './munderover.js';
import {
  OperatorDef,
  OperatorList,
  OPTABLE,
  OPDEF,
  getRange,
  MMLSPACING,
} from '../OperatorDictionary.js';
import { unicodeChars, unicodeString } from '../../../util/string.js';

/*****************************************************************/
/**
 *  Implements the MmlMo node class (subclass of AbstractMmlTokenNode)
 */

export class MmlMo extends AbstractMmlTokenNode {
  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlTokenNode.defaults,
    form: 'infix',
    fence: false,
    separator: false,
    lspace: 'thickmathspace',
    rspace: 'thickmathspace',
    stretchy: false,
    symmetric: false,
    maxsize: 'infinity',
    minsize: '0em', // MathML says '1em', but that is larger than some natural sizes
    largeop: false,
    movablelimits: false,
    accent: false,
    linebreak: 'auto',
    lineleading: '100%',
    linebreakstyle: 'before',
    indentalign: 'auto',
    indentshift: '0',
    indenttarget: '',
    indentalignfirst: 'indentalign',
    indentshiftfirst: 'indentshift',
    indentalignlast: 'indentalign',
    indentshiftlast: 'indentshift',
  };

  /**
   * The MathML spacing values for the TeX classes
   */
  public static MMLSPACING = MMLSPACING;

  /**
   * The Operator Dictionary
   */
  public static OPTABLE: { [form: string]: OperatorList } = OPTABLE;

  /**
   * Pattern for matching when the contents is one ore more pseudoscripts
   */
  /* prettier-ignore */
  public static pseudoScripts = new RegExp([
    '^["\'*`',
    '\u00AA',               // FEMININE ORDINAL INDICATOR
    '\u00B0',               // DEGREE SIGN
    '\u00B2-\u00B4',        // SUPERSCRIPT 2 and 3, ACUTE ACCENT
    '\u00B9',               // SUPERSCRIPT ONE
    '\u00BA',               // MASCULINE ORDINAL INDICATOR
    '\u2018-\u201F',        // Various double and single quotation marks (up and down)
    '\u2032-\u2037\u2057',  // Primes and reversed primes (forward and reversed)
    '\u2070\u2071',         // SUPERSCRIPT 0 and i
    '\u2074-\u207F',        // SUPERCRIPT 4 through 9, -, =, (, ), and n
    '\u2080-\u208E',        // SUBSCRIPT 0 through 9, -, =, (, ).
    ']+$'
  ].join(''));

  /**
   * Pattern for when contents is a collection of primes
   */
  protected static primes = new RegExp(
    [
      '^["\'',
      '\u2018-\u201F', // Various double and single quotation marks (up and down)
      ']+$',
    ].join('')
  );

  /**
   * Pattern to use to identify a multiletter operator
   */
  protected static opPattern = /^[a-zA-Z]{2,}$/;

  /**
   * Default map for remapping prime characters
   */
  protected static remapPrimes: { [n: number]: number } = {
    0x0022: 0x2033, // double quotes
    0x0027: 0x2032, // single quote
    0x2018: 0x2035, // open single quote
    0x2019: 0x2032, // close single quote
    0x201a: 0x2032, // low open single quote
    0x201b: 0x2035, // reversed open single quote
    0x201c: 0x2036, // open double quote
    0x201d: 0x2033, // close double quote
    0x201e: 0x2033, // low open double quote
    0x201f: 0x2036, // reversed open double quote
  };

  /**
   * Regular expression matching characters that are marked as math accents
   *  (property mathaccent = true)
   */
  /* prettier-ignore */
  /* eslint-disable no-misleading-character-class */
  public static mathaccents = new RegExp([
    '^[',
    '\u00B4\u0301\u02CA',  // acute
    '\u0060\u0300\u02CB',  // grave
    '\u00A8\u0308',        // ddot
    '\u007E\u0303\u02DC',  // tilde
    '\u00AF\u0304\u02C9',  // bar
    '\u02D8\u0306',        // breve
    '\u02C7\u030C',        // check
    '\u005E\u0302\u02C6',  // hat
    '\u20D0\u20D1',        // harpoons
    '\u20D6\u20D7\u20E1',  // vec (backward, forward, double)
    '\u02D9\u0307',        // dot
    '\u02DA\u030A',        // mathring
    '\u20DB',              // dddot
    '\u20DC',              // ddddot
    ']$'
  ].join(''));

  /**
   * Regular expression matching characters that are marked as math accents
   *   whose widths are to be respected (property mathaccent = false)
   */
  /* prettier-ignore */
  public static mathaccentsWithWidth = new RegExp([
    '^[',
    '\u2190\u2192\u2194',  // arrows
    '\u23DC\u23DD',        // over and under parens
    '\u23DE\u23DF',        // over and under braces
    ']$'
  ].join(''));

  /**
   * The internal TeX class of the node (for use with getter/setter below)
   */
  public _texClass: number = null;

  /**
   * Use a getter to look up the TeX class from the operator table if it hasn't
   * been set yet (but don't save it in case the form changes when it is in its
   * location).
   *
   * @returns {number} The TeX class.
   */
  public get texClass() {
    if (this._texClass === null) {
      return this.getOperatorDef(this.getText())[2];
    }
    return this._texClass;
  }

  /**
   * Use a setter to store the actual value in _texClass;
   */
  public set texClass(value: number) {
    this._texClass = value;
  }

  /**
   * The default MathML spacing on the left
   */
  /* prettier-ignore */
  public lspace = 5/18;

  /**
   * The default MathML spacing on the right
   */
  /* prettier-ignore */
  public rspace = 5/18;

  /**
   * @override
   */
  public get kind() {
    return 'mo';
  }

  /**
   * All <mo> are considered embellished
   *
   * @override
   */
  public get isEmbellished() {
    return true;
  }

  /**
   * @returns {MmlNode}  The node that is the outermost embellished operator
   *                    with this node as its core
   */
  public coreParent(): MmlNode {
    let embellished = null;
    let parent = this as MmlNode;
    const math = this.factory.getNodeClass('math');
    while (
      parent &&
      parent.isEmbellished &&
      parent.coreMO() === this &&
      !(parent instanceof math)
    ) {
      embellished = parent;
      parent = (parent as MmlNode).parent;
    }
    return embellished || this;
  }

  /**
   * @param {MmlNode} parent  The node whose core text is to be obtained
   * @returns {string}         The text of the core MO of the given parent element
   */
  public coreText(parent: MmlNode): string {
    if (!parent) {
      return '';
    }
    if (parent.isEmbellished) {
      return (parent.coreMO() as MmlMo).getText();
    }
    while (
      (((parent.isKind('mrow') ||
        parent.isKind('TeXAtom') ||
        parent.isKind('mstyle') ||
        parent.isKind('mphantom')) &&
        parent.childNodes.length === 1) ||
        parent.isKind('munderover')) &&
      parent.childNodes[0]
    ) {
      parent = parent.childNodes[0];
    }
    return parent.isToken ? (parent as AbstractMmlTokenNode).getText() : '';
  }

  /**
   * @override
   */
  public hasSpacingAttributes() {
    return this.attributes.isSet('lspace') || this.attributes.isSet('rspace');
  }

  /**
   * @returns {boolean}  True is this mo is an accent in an munderover construction
   */
  get isAccent(): boolean {
    let accent = false;
    const node = this.coreParent().parent;
    if (node) {
      const key = node.isKind('mover')
        ? node.childNodes[(node as MmlMover).over].coreMO()
          ? 'accent'
          : ''
        : node.isKind('munder')
          ? node.childNodes[(node as MmlMunder).under].coreMO()
            ? 'accentunder'
            : ''
          : node.isKind('munderover')
            ? this === node.childNodes[(node as MmlMunderover).over].coreMO()
              ? 'accent'
              : this === node.childNodes[(node as MmlMunderover).under].coreMO()
                ? 'accentunder'
                : ''
            : '';
      if (key) {
        const value = node.attributes.getExplicit(key);
        accent = (
          value !== undefined ? accent : this.attributes.get('accent')
        ) as boolean;
      }
    }
    return accent;
  }

  /**
   * Produce the texClass based on the operator dictionary values
   *
   * @override
   */
  public setTeXclass(prev: MmlNode): MmlNode {
    const { form, fence } = this.attributes.getList('form', 'fence') as {
      form: string;
      fence: string;
    };
    if (
      this.getProperty('texClass') === undefined &&
      this.hasSpacingAttributes()
    ) {
      return null;
    }
    if (fence && this.texClass === TEXCLASS.REL) {
      if (form === 'prefix') {
        this.texClass = TEXCLASS.OPEN;
      }
      if (form === 'postfix') {
        this.texClass = TEXCLASS.CLOSE;
      }
    }
    return this.adjustTeXclass(prev);
  }
  /**
   * Follow the TeXBook rules for adjusting the TeX class once its neighbors are known
   *
   * @param {MmlNode} prev  The node appearing before this one in the output
   * @returns {MmlNode}      The last node displayed (this node)
   */
  public adjustTeXclass(prev: MmlNode): MmlNode {
    const texClass = this.texClass;
    let prevClass = this.prevClass;
    if (texClass === TEXCLASS.NONE) {
      return prev;
    }
    if (prev) {
      if (
        prev.getProperty('autoOP') &&
        (texClass === TEXCLASS.BIN || texClass === TEXCLASS.REL)
      ) {
        prevClass = prev.texClass = TEXCLASS.ORD;
      }
      prevClass = this.prevClass = prev.texClass || TEXCLASS.ORD;
      this.prevLevel = this.attributes.getInherited('scriptlevel') as number;
    } else {
      prevClass = this.prevClass = TEXCLASS.NONE;
    }
    if (
      texClass === TEXCLASS.BIN &&
      (prevClass === TEXCLASS.NONE ||
        prevClass === TEXCLASS.BIN ||
        prevClass === TEXCLASS.OP ||
        prevClass === TEXCLASS.REL ||
        prevClass === TEXCLASS.OPEN ||
        prevClass === TEXCLASS.PUNCT)
    ) {
      this.texClass = TEXCLASS.ORD;
    } else if (
      prevClass === TEXCLASS.BIN &&
      (texClass === TEXCLASS.REL ||
        texClass === TEXCLASS.CLOSE ||
        texClass === TEXCLASS.PUNCT)
    ) {
      prev.texClass = this.prevClass = TEXCLASS.ORD;
    } else if (texClass === TEXCLASS.BIN) {
      //
      // Check if node is the last one in its container since the rule
      // above only takes effect if there is a node that follows.
      //
      let child: MmlNode = null;
      let parent = this.parent;
      while (
        parent &&
        parent.parent &&
        parent.isEmbellished &&
        (parent.childNodes.length === 1 ||
          (!parent.isKind('mrow') && parent.core() === child))
      ) {
        child = parent;
        parent = parent.parent;
      }
      child = child || this;
      if (parent.childNodes[parent.childNodes.length - 1] === child) {
        this.texClass = TEXCLASS.ORD;
      }
    }
    return this;
  }

  /**
   * Do the normal inheritance, then look up the attributes from the operator dictionary.
   * If there is no dictionary entry, get the TeX class from the Unicode range list.
   *
   * @override
   */
  public setInheritedAttributes(
    attributes: AttributeList = {},
    display: boolean = false,
    level: number = 0,
    prime: boolean = false
  ) {
    super.setInheritedAttributes(attributes, display, level, prime);
    const mo = this.getText();
    this.checkOperatorTable(mo);
    this.checkPseudoScripts(mo);
    this.checkPrimes(mo);
    this.checkMathAccent(mo);
  }

  /**
   * get the operator definition from the operator table
   *
   * @param {string} mo   The text of the mo element
   * @returns {OperatorDef} The operator definition
   */
  protected getOperatorDef(mo: string): OperatorDef {
    const [form1, form2, form3] = this.handleExplicitForm(this.getForms());
    this.attributes.setInherited('form', form1);
    const CLASS = this.constructor as typeof MmlMo;
    const OPTABLE = CLASS.OPTABLE;
    const def = OPTABLE[form1][mo] || OPTABLE[form2][mo] || OPTABLE[form3][mo];
    if (def) {
      return def;
    }
    this.setProperty('noDictDef', true);
    const limits = this.attributes.get('movablelimits');
    const isOP = !!mo.match(CLASS.opPattern);
    if ((isOP || limits) && this.getProperty('texClass') === undefined) {
      return OPDEF(1, 2, TEXCLASS.OP);
    }
    const range = getRange(mo);
    const [l, r] = CLASS.MMLSPACING[range[2]];
    return OPDEF(l, r, range[2]);
  }

  /**
   * Set the attributes from the operator table
   *
   * @param {string} mo   The text of the mo element
   */
  protected checkOperatorTable(mo: string) {
    const def = this.getOperatorDef(mo);
    if (this.getProperty('texClass') === undefined) {
      this.texClass = def[2];
    }
    for (const name of Object.keys(def[3] || {})) {
      this.attributes.setInherited(name, def[3][name]);
    }
    this.lspace = ((def[0] || -1) + 1) / 18;
    this.rspace = ((def[1] || -1) + 1) / 18;
  }

  /**
   * @returns {[string, string, string]}  The list of form attribute values in the
   *                                     order they should be tested, based on the
   *                                     position of the element in its parent.
   */
  public getForms(): [string, string, string] {
    let core: MmlNode = null;
    let parent = this.parent;
    let Parent = this.Parent;
    while (Parent && Parent.isEmbellished) {
      core = parent;
      parent = Parent.parent;
      Parent = Parent.Parent;
    }
    core = core || this;
    if (
      parent &&
      parent.isKind('mrow') &&
      (parent as MmlMrow).nonSpaceLength() !== 1
    ) {
      if ((parent as MmlMrow).firstNonSpace() === core) {
        return ['prefix', 'infix', 'postfix'];
      }
      if ((parent as MmlMrow).lastNonSpace() === core) {
        return ['postfix', 'infix', 'prefix'];
      }
    }
    return ['infix', 'prefix', 'postfix'];
  }

  /**
   * @param {string[]} forms     The three forms in the default order they are to be tested
   * @returns {string[]}          The forms in the new order, if there is an explicit form attribute
   */
  protected handleExplicitForm(forms: string[]): string[] {
    if (this.attributes.isSet('form')) {
      const form = this.attributes.get('form') as string;
      forms = [form].concat(forms.filter((name) => name !== form));
    }
    return forms;
  }

  /**
   * Mark the mo as a pseudoscript if it is one.  True means it is,
   *   false means it is a pseudo-script character, but in an msup (so needs a variant form)
   *
   * @param {string} mo   The test of the mo element
   */
  protected checkPseudoScripts(mo: string) {
    const PSEUDOSCRIPTS = (this.constructor as typeof MmlMo).pseudoScripts;
    if (!mo.match(PSEUDOSCRIPTS)) return;
    const parent = this.coreParent().Parent;
    const isPseudo =
      !parent || !(parent.isKind('msubsup') && !parent.isKind('msub'));
    this.setProperty('pseudoscript', isPseudo);
    if (isPseudo) {
      this.attributes.setInherited('lspace', 0);
      this.attributes.setInherited('rspace', 0);
    }
  }

  /**
   * Determine whether the mo consists of primes, and remap them if so.
   *
   * @param {string} mo   The test of the mo element
   */
  protected checkPrimes(mo: string) {
    const PRIMES = (this.constructor as typeof MmlMo).primes;
    if (!mo.match(PRIMES)) return;
    const REMAP = (this.constructor as typeof MmlMo).remapPrimes;
    const primes = unicodeString(unicodeChars(mo).map((c) => REMAP[c]));
    this.setProperty('primes', primes);
  }

  /**
   * Determine whether the mo is a mathaccent character
   *
   * @param {string} mo   The test of the mo element
   */
  protected checkMathAccent(mo: string) {
    const parent = this.Parent;
    if (
      this.getProperty('mathaccent') !== undefined ||
      !parent ||
      !parent.isKind('munderover')
    )
      return;
    const [base, under, over] = parent.childNodes;
    if (base.isEmbellished && base.coreMO() === this) return;
    const isUnder = !!(under && under.isEmbellished && under.coreMO() === this);
    const isOver = !!(over && over.isEmbellished && under.coreMO() === this);
    if (!isUnder && !isOver) return;
    if (this.isMathAccent(mo)) {
      this.setProperty('mathaccent', true); // math accent whose width is replaced by 0
    } else if (this.isMathAccentWithWidth(mo)) {
      this.setProperty('mathaccent', false); // math accent whose width is normal
    }
  }

  /**
   * Check a string for being a mathaccent
   *
   * @param {string} mo   The string to check
   * @returns {boolean}    True if the string should be a mathaccent
   */
  public isMathAccent(mo: string = this.getText()): boolean {
    const MATHACCENT = (this.constructor as typeof MmlMo).mathaccents;
    return !!mo.match(MATHACCENT);
  }

  /**
   * Check a string for being a mathaccent with non-zero width
   *
   * @param {string} mo   The string to check
   * @returns {boolean}    True if the string should be a mathaccent
   */
  public isMathAccentWithWidth(mo: string = this.getText()): boolean {
    const MATHACCENT = (this.constructor as typeof MmlMo).mathaccentsWithWidth;
    return !!mo.match(MATHACCENT);
  }
}
