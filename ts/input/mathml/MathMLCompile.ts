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
 * @file  Implementation of the Compile function for the MathML input jax
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { MmlFactory } from '../../core/MmlTree/MmlFactory.js';
import {
  MmlNode,
  TextNode,
  XMLNode,
  AbstractMmlNode,
  AbstractMmlTokenNode,
  TEXCLASS,
} from '../../core/MmlTree/MmlNode.js';
import { HtmlNode } from '../../core/MmlTree/MmlNodes/HtmlNode.js';
import { userOptions, defaultOptions, OptionList } from '../../util/Options.js';
import * as Entities from '../../util/Entities.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';

/********************************************************************/
/**
 *  The class for performing the MathML DOM node to
 *  internal MmlNode conversion.
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class MathMLCompile<N, T, D> {
  /**
   *  The default options for this object
   */
  /* prettier-ignore */
  public static OPTIONS: OptionList = {
    MmlFactory: null,                   // The MmlFactory to use (defaults to a new MmlFactory)
    allowHtmlInTokenNodes: false,       // True if HTML is allowed in token nodes
    fixMisplacedChildren: true,         // True if we want to use heuristics to try to fix
                                        //   problems with the tree based on HTML not handling
                                        //   self-closing tags properly
    verify: {                           // Options to pass to verifyTree() controlling MathML verification
      ...AbstractMmlNode.verifyDefaults
    },
    translateEntities: true             // True means translate entities in text nodes
  };

  /**
   * The DOMAdaptor for the document being processed
   */
  public adaptor: DOMAdaptor<N, T, D>;

  /**
   *  The instance of the MmlFactory object and
   */
  public factory: MmlFactory;
  /**
   *  The options (the defaults with the user options merged in)
   */
  public options: OptionList;

  /**
   *  Merge the user options into the defaults, and save them
   *  Create the MmlFactory object
   *
   * @param {OptionList} options  The options controlling the conversion
   */
  constructor(options: OptionList = {}) {
    const Class = this.constructor as typeof MathMLCompile;
    this.options = userOptions(defaultOptions({}, Class.OPTIONS), options);
  }

  /**
   * @param {MmlFactory} mmlFactory   The MathML factory to use for new nodes
   */
  public setMmlFactory(mmlFactory: MmlFactory) {
    this.factory = mmlFactory;
  }

  /**
   * Convert a MathML DOM tree to internal MmlNodes
   *
   * @param {N} node     The <math> node to convert to MmlNodes
   * @returns {MmlNode}   The MmlNode at the root of the converted tree
   */
  public compile(node: N): MmlNode {
    const mml = this.makeNode(node);
    mml.verifyTree(this.options['verify']);
    mml.setInheritedAttributes({}, false, 0, false);
    mml.walkTree(this.markMrows);
    return mml;
  }

  /**
   * Recursively convert nodes and their children, taking MathJax classes
   * into account.
   *
   *  FIXME: we should use data-* attributes rather than classes for these
   *
   * @param {N} node     The node to convert to an MmlNode
   * @returns {MmlNode}   The converted MmlNode
   */
  public makeNode(node: N): MmlNode {
    const adaptor = this.adaptor;
    let limits = false;
    const kind = adaptor.kind(node).replace(/^.*:/, '');
    let texClass = adaptor.getAttribute(node, 'data-mjx-texclass') || '';
    if (texClass) {
      texClass = this.filterAttribute('data-mjx-texclass', texClass) || '';
    }
    let type = texClass && kind === 'mrow' ? 'TeXAtom' : kind;
    for (const name of this.filterClassList(adaptor.allClasses(node))) {
      if (name.match(/^MJX-TeXAtom-/) && kind === 'mrow') {
        texClass = name.substring(12);
        type = 'TeXAtom';
      } else if (name === 'MJX-fixedlimits') {
        limits = true;
      }
    }
    if (!this.factory.getNodeClass(type)) {
      return this.unknownNode(type, node);
    }
    return this.createMml(type, node, texClass, limits);
  }

  /**
   * Create an actual MmlNode tree from a given DOM node.
   *
   * @param {string} type      The type of MmlNode to create
   * @param {N} node           The original DOM node that is being transcribed
   * @param {string} texClass  The texClass specified on the node, if any
   * @param {boolean} limits   True if fixed limits are to be used
   * @returns {MmlNode}         The final MmlNode tree
   */
  protected createMml(
    type: string,
    node: N,
    texClass: string,
    limits: boolean
  ): MmlNode {
    const mml = this.factory.create(type);
    if (type === 'TeXAtom' && texClass === 'OP' && !limits) {
      mml.setProperty('movesupsub', true);
      mml.attributes.setInherited('movablelimits', true);
    }
    if (texClass) {
      mml.texClass = (TEXCLASS as { [name: string]: number })[texClass];
      mml.setProperty('texClass', mml.texClass);
    }
    this.addAttributes(mml, node);
    this.checkClass(mml, node);
    this.addChildren(mml, node);
    return mml;
  }

  /**
   * Handle unknown node by either creating an HTML node, or throwing an error.
   *
   * @param {string} type   The type of node being requested
   * @param {N} node        The HTML node used to create it.
   * @returns {MmlNode}      The HtmlNode holding the node (or null)
   */
  protected unknownNode(type: string, node: N): MmlNode {
    if (
      this.factory.getNodeClass('html') &&
      this.options.allowHtmlInTokenNodes
    ) {
      return (this.factory.create('html') as HtmlNode<N>).setHTML(
        node,
        this.adaptor
      );
    }
    this.error('Unknown node type "' + type + '"');
    return null;
  }

  /**
   * Copy the attributes from a MathML node to an MmlNode.
   *
   * @param {MmlNode} mml       The MmlNode to which attributes will be added
   * @param {N} node  The MathML node whose attributes to copy
   */
  protected addAttributes(mml: MmlNode, node: N) {
    let ignoreVariant = false;
    for (const attr of this.adaptor.allAttributes(node)) {
      const name = attr.name;
      const value = this.filterAttribute(name, attr.value);
      if (value === null || name === 'xmlns') {
        continue;
      }
      if (name.substring(0, 9) === 'data-mjx-') {
        switch (name.substring(9)) {
          case 'alternate':
            mml.setProperty('variantForm', true);
            break;
          case 'variant':
            mml.attributes.set('mathvariant', value);
            mml.setProperty('ignore-variant', true);
            ignoreVariant = true;
            break;
          case 'smallmatrix':
            mml.setProperty('smallmatrix', true);
            mml.setProperty('useHeight', false);
            break;
          case 'mathaccent':
            mml.setProperty('mathaccent', value === 'true');
            break;
          case 'auto-op':
            mml.setProperty('autoOP', value === 'true');
            break;
          case 'script-align':
            mml.setProperty('scriptalign', value);
            break;
          case 'vbox':
            mml.setProperty('vbox', value);
            break;
          default:
            mml.attributes.set(name, value);
            break;
        }
      } else if (name !== 'class') {
        const val = value.toLowerCase();
        if (val === 'true' || val === 'false') {
          mml.attributes.set(name, val === 'true');
        } else if (!ignoreVariant || name !== 'mathvariant') {
          mml.attributes.set(name, value);
        }
      }
    }
  }

  /**
   * Provide a hook for the Safe extension to filter attribute values.
   *
   * @param {string} _name  The name of an attribute to filter
   * @param {string} value  The value to filter
   * @returns {string} The filtered value.
   */
  protected filterAttribute(_name: string, value: string): string {
    return value;
  }

  /**
   * Provide a hook for the Safe extension to filter class names.
   *
   * @param {string[]} list   The list of class names to filter
   * @returns {string[]}      The list of filtered class names
   */
  protected filterClassList(list: string[]) {
    return list;
  }

  /**
   * Convert the children of the MathML node and add them to the MmlNode
   *
   * @param {MmlNode} mml  The MmlNode to which children will be added
   * @param {N} node       The MathML node whose children are to be copied
   */
  protected addChildren(mml: MmlNode, node: N) {
    if (mml.arity === 0) {
      return;
    }
    const adaptor = this.adaptor;
    for (const child of adaptor.childNodes(node) as N[]) {
      const name = adaptor.kind(child);
      if (name === '#comment') {
        continue;
      }
      if (name === '#text') {
        this.addText(mml, child);
      } else if (mml.isKind('annotation-xml')) {
        mml.appendChild(
          (this.factory.create('XML') as XMLNode).setXML(child, adaptor)
        );
      } else {
        const childMml = mml.appendChild(this.makeNode(child));
        if (
          childMml.arity === 0 &&
          adaptor.childNodes(child).length &&
          !childMml.isKind('html')
        ) {
          if (this.options['fixMisplacedChildren']) {
            this.addChildren(mml, child);
          } else {
            childMml.mError(
              'There should not be children for ' + childMml.kind + ' nodes',
              this.options['verify'],
              true
            );
          }
        }
      }
    }
    if (mml.isToken) {
      this.trimSpace(mml);
    }
  }

  /**
   * Add text to a token node
   *
   * @param {MmlNode} mml  The MmlNode to which text will be added
   * @param {N} child      The text node whose contents is to be copied
   */
  protected addText(mml: MmlNode, child: N) {
    let text = this.adaptor.value(child);
    if ((mml.isToken || mml.getProperty('isChars')) && mml.arity) {
      if (mml.isToken) {
        text = Entities.translate(text);
        text = this.normalizeSpace(text);
      }
      mml.appendChild((this.factory.create('text') as TextNode).setText(text));
    } else if (text.match(/\S/)) {
      this.error('Unexpected text node "' + text + '"');
    }
  }

  /**
   * Check for special MJX values in the class and process them
   *
   * @param {MmlNode} mml       The MmlNode to be modified according to the class markers
   * @param {N} node  The MathML node whose class is to be processed
   */
  protected checkClass(mml: MmlNode, node: N) {
    const classList = [];
    for (const name of this.filterClassList(this.adaptor.allClasses(node))) {
      if (name.substring(0, 4) === 'MJX-') {
        if (name === 'MJX-variant') {
          mml.setProperty('variantForm', true);
        } else if (name.substring(0, 11) !== 'MJX-TeXAtom') {
          mml.attributes.set(
            'mathvariant',
            this.fixCalligraphic(name.substring(3))
          );
        }
      } else {
        classList.push(name);
      }
    }
    if (classList.length) {
      mml.attributes.set('class', classList.join(' '));
    }
  }

  /**
   * Fix the old incorrect spelling of calligraphic.
   *
   * @param {string} variant  The mathvariant name
   * @returns {string}         The corrected variant
   */
  protected fixCalligraphic(variant: string): string {
    return variant.replace(/caligraphic/, 'calligraphic');
  }

  /**
   * Check to see if an mrow has delimiters at both ends (so looks like an mfenced structure).
   *
   * @param {MmlNode} mml  The node to check for mfenced structure
   */
  protected markMrows(mml: MmlNode) {
    if (mml.isKind('mrow') && !mml.isInferred && mml.childNodes.length >= 2) {
      const first = mml.childNodes[0];
      const last = mml.childNodes[mml.childNodes.length - 1];
      if (
        first.isKind('mo') &&
        first.attributes.get('fence') &&
        first.attributes.get('stretchy') &&
        last.isKind('mo') &&
        last.attributes.get('fence') &&
        last.attributes.get('stretchy')
      ) {
        if (first.childNodes.length) {
          mml.setProperty('open', (first as AbstractMmlTokenNode).getText());
        }
        if (last.childNodes.length) {
          mml.setProperty('close', (last as AbstractMmlTokenNode).getText());
        }
      }
    }
  }

  /**
   * @param {string} text  The text to have spacing normalized
   * @returns {string}      The trimmed text
   */
  protected normalizeSpace(text: string): string {
    return text
      .replace(/[\t\n\r]/g, ' ') // whitespace to spaces
      .replace(/  +/g, ' '); // internal multiple whitespace
  }

  /**
   * @param {MmlNode} mml  The token node whose leading/trailing spaces should be removed
   */
  protected trimSpace(mml: MmlNode) {
    let child = mml.childNodes[0] as TextNode;
    if (!child) return;
    if (child.isKind('text')) {
      child.setText(child.getText().replace(/^ +/, ''));
    }
    child = mml.childNodes[mml.childNodes.length - 1] as TextNode;
    if (child.isKind('text')) {
      child.setText(child.getText().replace(/ +$/, ''));
    }
  }
  /**
   * @param {string} message  The error message to produce
   */
  protected error(message: string) {
    throw new Error(message);
  }
}
